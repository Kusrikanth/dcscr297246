import { useEffect, useMemo, useRef, useState } from "react";
import UploadFileProgress from "../../../../Components/Common/UploadFileProgress";
import Button from "../../../../Components/Common/Button";
import { findFolderPathById, renderOptionsCategory } from "./helper";
import { useFormik } from "formik";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { resetUploadBranchStorageFileAct, reUploadBranchStorageFileAct, uploadBranchStorageFileAct } from "../../../../store/branchstorage/branchstoragemanagement/branchstoragemanagementactions";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import { getBranchPoliciesAct, getFileTypeCategoryListAct } from "../../../../store/branchstorage/branchstoragesettings/branchstoragesettingsactions";
import { FileTypeIcon } from "./FilceIconType";
import UploadLoadingOverlay from "./UploadLoadingOverlay";
import { AutoSearchInputUpdated, CustomSelect, SelectInput } from "../../../../Components/Common";
import * as Yup from "yup";

type UploadSlot = {
  id: string;
  file?: File;
  folderId?: string;
  folderPath?: string;
  error?: string;
};

const createUploadSlot = (): UploadSlot => ({
  id: `${Date.now()}-${Math.random()}`,
});

const cleanFolderPath = (path: string) => {
  return path.replace(/^All files\s*\/\s*/i, "").trim();
};

const getSelectedFolderPath = (folderTree: any[], folderId: string) => {
  if (!folderId || folderId === "all") return "All files";
  const path = findFolderPathById(folderTree, folderId);
  return cleanFolderPath(path) || "All files";
};


const initialValues = {
  categoryId: "",
  selectedGroup: null,
}

const validationSchema = Yup.object().shape({
  categoryId: Yup.string()
    .nullable()
    .required("Category is required"),
});

const ReUploadFilesModal = ({
  folderTree = [],
  modalData,
  toggle,
  setExpandedFolders,
  activeFolderId,
  setIsUploadingToS3,
  setUploadStatus,
  setCompletedUploads,
  setTotalUploads,
  onUploadSuccess,
}: any) => {
  const {
    id,
    folderId,
    path,
    fileName,
  } = modalData || {};

  const uploadFolderPath = useMemo(() => {
    if (path) return path;

    return getSelectedFolderPath(
      folderTree,
      String(folderId || activeFolderId || "all")
    );
  }, [
    path,
    folderId,
    activeFolderId,
    folderTree,
  ]);
  const [uploadTriggered, setUploadTriggered] = useState(false);
  const [isUploadLocked, setIsUploadLocked] = useState(false);
  const [uploadSlots, setUploadSlots] = useState<UploadSlot[]>([
    createUploadSlot(),
  ]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const dispatch = useAppDispatch();
  const {
    currentInstIdResp: instituteId,
    currentBranchIdResp: branchId,
    showApiLoader,
    reUploadBranchStorageFileNameResp,
    getBranchPoliciesList,
    getFileCategoryListResp,
    userMeResp,
    branchStorageManagementErrorAct,
  } =
    useAppSelector(({ appData, globalData, branchStorageManagement, branchStorageSettings, login }) => ({
      currentInstIdResp: appData.currentInstIdResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      showApiLoader: globalData.showApiLoader,
      reUploadBranchStorageFileNameResp: branchStorageManagement.reUploadBranchStorageFileNameResp,
      getBranchPoliciesList: branchStorageSettings.getBranchPoliciesList,
      getFileCategoryListResp: branchStorageSettings.getFileCategoryListResp,
      userMeResp: login.userMeResp,
      branchStorageManagementErrorAct: branchStorageManagement.branchStorageManagementErrorAct,
    }), shallowEqual);

  const FILE_EXTENSIONS = useMemo(
    () =>
      getBranchPoliciesList?.policyJson?.fileTypes?.extensions?.map(
        (ext: string) => `.${ext}`
      ) || [],
    [getBranchPoliciesList]
  );

  useEffect(() => {
    dispatch(resetUploadBranchStorageFileAct(undefined));
  }, []);

  const ignoredSessionUuidRef = useRef<string | null>(null);
  const processedSessionUuidRef = useRef<string | null>(null);
  //   const currentClientFileIdsRef = useRef<string[]>([]);

  const uploadSession =
    reUploadBranchStorageFileNameResp?.data ??
    reUploadBranchStorageFileNameResp;
  const branchPoliciesApiCall = () => {
    dispatch(
      getBranchPoliciesAct(
        generateActionPayload(
          "get_branch_policies",
          undefined,
          {
            branchId,
          }
        )
      )
    );
  };

  useEffect(() => {
    dispatch(resetUploadBranchStorageFileAct(undefined));
  }, []);

  const uploadedFiles = useMemo(
    () => uploadSlots.map((item) => item.file).filter(Boolean) as File[],
    [uploadSlots]
  );

  const MAX_FILES = 5;

  const canAddMore =
    uploadSlots.every((slot) => !!slot.file) &&
    uploadSlots.length < MAX_FILES;

  const handleAddMore = () => {
    if (!canAddMore) return;

    setUploadSlots((prev) => {
      if (prev.length >= MAX_FILES) {
        toast.warning(`Maximum ${MAX_FILES} files allowed`);
        return prev;
      }

      return [...prev, createUploadSlot()];
    });
  };

  const handleSlotUploadSuccess = (slotId: string, selectedFiles: File[]) => {
    const selectedFile = selectedFiles?.[0];
    if (!selectedFile) return;
    const maxSize =
      getBranchPoliciesList?.policyJson?.maximumUploadSize?.sizeConversionBytes;
    let error = "";
    const extension = selectedFile.name.split(".").pop();
    const allowedExtensions =
      getBranchPoliciesList?.policyJson?.fileTypes?.extensions || [];
    const isValidExtension = allowedExtensions.some(
      (ext: string) =>
        ext.toLowerCase() === extension?.toLowerCase()
    );

    const maxSizeMb =
      getBranchPoliciesList?.policyJson?.maximumUploadSize?.sizeMb;

    const normalizedAllowedExtensions = allowedExtensions.map((ext: string) =>
      ext.replace(".", "").toLowerCase()
    );


    if (maxSize && selectedFile.size > maxSize) {
      error = `Maximum file size is ${maxSizeMb} MB`;
    } else if (
      normalizedAllowedExtensions.length &&
      !normalizedAllowedExtensions.includes(extension || "")
    ) {
      error = `Allowed file types: ${allowedExtensions.join(", ")}`;
    }
    const uploadFolderId = activeFolderId || "all";
    const uploadFolderPath =
      path ||
      getSelectedFolderPath(
        folderTree,
        String(folderId || activeFolderId || "all")
      );
    setUploadSlots((prev) =>
      prev.map((slot) =>
        slot.id === slotId
          ? {
            ...slot,
            file: selectedFile,
            folderId: uploadFolderId,
            folderPath: uploadFolderPath,
            error,
          }
          : slot
      )
    );
    if (error) {
      toast.error(error);
    }
  };

  const handleRemoveFile = (slotId: string) => {
    setUploadSlots((prev) => {
      const nextSlots = prev.filter((slot) => slot.id !== slotId);
      return nextSlots.length ? nextSlots : [createUploadSlot()];
    });
  };

  const branchStorageFileUploadModalFormik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: () => {
      const selectedSlot = uploadSlots.find((slot) => slot.file);

      if (!selectedSlot?.file) {
        toast.error("Please select a file");
        return;
      }

      if (selectedSlot.error) {
        toast.error(selectedSlot.error);
        return;
      }
      setIsUploadLocked(true);
      // currentClientFileIdsRef.current = [selectedSlot.id];

      ignoredSessionUuidRef.current =
        uploadSession?.sessionUuid ?? null;

      processedSessionUuidRef.current = null;

      setUploadTriggered(true);

      const payload = {
        fileId: Number(id),
        categoryId: branchStorageFileUploadModalFormik.values.categoryId,
        expectedSizeBytes: selectedSlot.file.size,
        originalFileName: selectedSlot.file.name,
        //   clientFileId: selectedSlot.id,
      };

      dispatch(
        reUploadBranchStorageFileAct(
          generateActionPayload(
            "reupload_branch_storage_file",
            undefined,
            payload
          )
        )
      );
    },
  });

  const uploadFileWithProgress = (
    config: any,
    file: File,
    onProgress: (percentage: number) => void
  ) =>
    new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.open("PUT", config.uploadUrl);

      Object.entries(config.requiredHeaders || {}).forEach(([key, value]) => {
        xhr.setRequestHeader(key, String(value));
      });

      xhr.upload.addEventListener("progress", (event) => {
        if (!event.lengthComputable) return;

        const percentage = Math.round((event.loaded / event.total) * 100);
        onProgress(percentage);
      });

      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          onProgress(100);
          resolve();
        } else {
          reject(
            new Error(
              `S3 upload failed for ${file.name}: ${xhr.status}`
            )
          );
        }
      });

      xhr.addEventListener("error", () => {
        reject(new Error(`Network error while uploading ${file.name}`));
      });

      xhr.addEventListener("abort", () => {
        reject(new Error(`Upload cancelled for ${file.name}`));
      });

      xhr.send(file);
    });

  const uploadFilesToS3 = async (uploadConfigs: any[]) => {
    const selectedFile = uploadSlots.find((slot) => slot.file)?.file;

    if (!selectedFile) {
      toast.error("Selected file not found");
      return;
    }

    try {
      setIsUploadLocked(true);
      setIsUploadingToS3(true);
      setUploadStatus("uploading");
      setCompletedUploads(0);
      setTotalUploads(uploadConfigs.length);
      setUploadProgress(0);

      await Promise.all(
        uploadConfigs.map((config: any) =>
          uploadFileWithProgress(
            config,
            selectedFile,
            setUploadProgress
          )
        )
      );

      setUploadProgress(100);
      setCompletedUploads(uploadConfigs.length);
      setUploadStatus("success");

      setTimeout(() => {
        toast.success("File re-uploaded successfully");

        onUploadSuccess?.(String(folderId));
        toggle?.();
        setIsUploadingToS3(false);
        setIsUploadLocked(false);
        setUploadProgress(0);
      }, 8000);
    } catch (error) {
      setUploadStatus("error");

      toast.error(
        error instanceof Error
          ? error.message
          : "File re-upload failed"
      );

      setIsUploadingToS3(false);
      setIsUploadLocked(false);
      setUploadProgress(0);
    }
  };

  useEffect(() => {
    if (!uploadTriggered || !branchStorageManagementErrorAct) return;

    setUploadTriggered(false);
    setIsUploadLocked(false);
    setUploadProgress(0);
    setIsUploadingToS3(false);
    setUploadStatus("error");
  }, [uploadTriggered, branchStorageManagementErrorAct]);

  useEffect(() => {
    if (!activeFolderId || !folderTree.length) return;

    const expandPath = (
      nodes: any[],
      targetId: string,
      expanded: Record<string, boolean> = {}
    ): Record<string, boolean> | null => {
      for (const node of nodes) {
        if (node.id === targetId) {
          return {
            ...expanded,
            [node.id]: true,
          };
        }

        if (node.children?.length) {
          const result = expandPath(
            node.children,
            targetId,
            {
              ...expanded,
              [node.id]: true,
            }
          );

          if (result) return result;
        }
      }

      return null;
    };

    const expanded = expandPath(folderTree, activeFolderId);

    if (expanded) {
      setExpandedFolders(expanded);
    }
  }, [activeFolderId, folderTree]);

  useEffect(() => {
    if (!uploadTriggered) return;
    const sessionUuid = uploadSession?.sessionUuid;
    const uploadUrl = uploadSession?.uploadUrl;
    if (!sessionUuid || !uploadUrl) return;
    if (sessionUuid === ignoredSessionUuidRef.current) {
      return;
    }
    if (sessionUuid === processedSessionUuidRef.current) {
      return;
    }
    processedSessionUuidRef.current = sessionUuid;
    setUploadTriggered(false);
    uploadFilesToS3([uploadSession]);
  }, [
    uploadTriggered,
    uploadSession?.sessionUuid,
    uploadSession?.uploadUrl,
  ]);

  useEffect(() => {
    if (instituteId) {
      branchPoliciesApiCall();
      dispatch(
            getFileTypeCategoryListAct(
              generateActionPayload(
                "get_file_category_list",
                undefined,
                {
                  instituteId
                }
              )
            )
          );
    }
  }, [instituteId, branchId]);

  const selectGroupHndlr = (selectedOption: any) => {
    if (!selectedOption) {
      branchStorageFileUploadModalFormik.setFieldValue("categoryId", "");
      branchStorageFileUploadModalFormik.setFieldValue("categoryName", "");
      branchStorageFileUploadModalFormik.setFieldValue("selectedGroup", null);
      return;
    }

    branchStorageFileUploadModalFormik.setFieldValue(
      "categoryId",
      selectedOption.id
    );

    branchStorageFileUploadModalFormik.setFieldValue(
      "categoryName",
      selectedOption.categoryName
    );

    branchStorageFileUploadModalFormik.setFieldValue(
      "selectedGroup",
      selectedOption
    );
  };

  const onSearchCategoryHandler = (name: any, value: string) => {
    const searchString = value?.trim() || "";

    dispatch(
      getFileTypeCategoryListAct(
        generateActionPayload(
          "get_file_category_list",
          undefined,
          {
            instituteId,
            search: searchString,
          }
        )
      )
    );
  };
  return (
    <>
      <form onSubmit={branchStorageFileUploadModalFormik.handleSubmit}>
        <div className="tw-relative tw-px-5 tw-py-4">
          <UploadLoadingOverlay
            visible={isUploadLocked}
            isPreparing={uploadTriggered}
            progress={uploadProgress}
            title="Re-uploading file"
            preparingTitle="Preparing your re-upload"
            message="Please keep this window open while the file is being re-uploaded."
          />
          <div className={
            isUploadLocked
              ? "tw-pointer-events-none tw-select-none tw-opacity-60"
              : ""
          }>
            <div className="tw-grid tw-grid-cols-12">
              <div className="tw-col-span-12">
                <p className="tw-text-sm tw-text-gray-500 tw-mb-1">
                  Uploading to:{" "}
                  <span className="tw-font-semibold tw-text-gray-800">
                    {uploadFolderPath || "All files"}
                  </span>
                </p>
                <p className="tw-text-sm tw-text-gray-500 tw-mb-2">
                  File name:{" "}
                  <span
                    className="tw-font-semibold tw-text-gray-800"
                    title={fileName}
                  >
                    {fileName || "-"}
                  </span>
                </p>
              </div>
              <div className="tw-col-span-12 tw-min-w-0">
                <div className="tw-mb-3">
                  <CustomSelect
                                        name="categoryId"
                                        idKey="id"
                                        defaultSelect="Select File Category"
                                        value={branchStorageFileUploadModalFormik.values.categoryId}
                                        renderOptions={renderOptionsCategory}
                                        options={
                                          Array.isArray(getFileCategoryListResp)
                                            ? getFileCategoryListResp
                                            : []
                                        }
                                        onSearchHandler={onSearchCategoryHandler}
                                        labelText="File Category"
                                        labelClass="required"
                                        renderValue={(option: any) => option?.categoryName || ""}
                                        onChange={(value: any) => {
                                          const selectedOption = (
                                            Array.isArray(getFileCategoryListResp)
                                              ? getFileCategoryListResp
                                              : []
                                          ).find(
                                            (item: any) => String(item.id) === String(value)
                                          );
                  
                                          selectGroupHndlr(selectedOption);
                                        }}
                                        invalid={
                                          branchStorageFileUploadModalFormik.touched.categoryId &&
                                          !!branchStorageFileUploadModalFormik.errors.categoryId
                                        }
                                        error={
                                          branchStorageFileUploadModalFormik.touched.categoryId &&
                                            branchStorageFileUploadModalFormik.errors.categoryId
                                            ? branchStorageFileUploadModalFormik.errors.categoryId
                                            : ""
                                        }
                                      />
                </div>
                <div className="tw-pr-">
                  <div className="tw-space-y-3">
                    {uploadSlots.map((slot) => {
                      return slot.file ? (
                        <div
                          key={slot.id}
                          className={`tw-bg-white tw-rounded-lg tw-p-3 tw-flex tw-items-center tw-justify-between ${slot.error
                            ? "tw-border tw-border-red-500"
                            : "tw-border tw-border-green-500"
                            }`}
                        >
                          <div className="tw-flex tw-items-center tw-gap-3 tw-min-w-0">
                            <div className="tw-shrink-0">
                              <FileTypeIcon
                                fileName={slot.file.name}
                                size={22}
                              />
                            </div>
                            <div className="tw-flex tw-flex-col">
                              <p className="tw-text-sm tw-font-medium tw-text-gray-700 tw-truncate tw-mb-0">
                                {slot.file.name}
                              </p>

                              {slot.error && (
                                <p className="tw-text-red-500 tw-text-xs tw-mt-1 tw-mb-0">
                                  {slot.error}
                                </p>
                              )}
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="sidebarMenu"
                            onClick={() => handleRemoveFile(slot.id)}
                            className="tw-text-gray-400 hover:tw-text-red-500 tw-text-xl tw-leading-none tw-px-2"
                          >
                            ×
                          </Button>
                        </div>
                      ) : (
                        <UploadFileProgress
                          showContainer={false}
                          key={slot.id}
                          fileExtensions={FILE_EXTENSIONS}
                          invalid={!!slot.error}
                          error={slot.error}
                          onUploadSuccess={(selectedFiles) =>
                            handleSlotUploadSuccess(slot.id, selectedFiles)
                          }
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            <div className="tw-pe- tw-mt-3">
              <span className="tw-font-bold">Note:</span>{" "}
              <span className="tw-text-rose-400 tw-font-bold ">
                <ul className="tw-mb-0 tw-space-y-1.5 tw-pl-5 tw-text-sm tw-leading-5">
                  <li className="tw-list-disc">
                    The new file must have the same extension as the existing file.
                  </li>

                  <li className="tw-list-disc">
                    Re-uploading replaces the file content while keeping the existing file name.
                  </li>

                  <li className="tw-list-disc">
                    The previous file is retained as an earlier version.
                  </li>
                </ul>
              </span>
            </div>
            <div className="tw-flex tw-justify-end tw-gap-2 tw-mt-3 tw-px-">
              <Button variant="secondary" type="button" onClick={toggle}>
                Cancel
              </Button>
              <Button variant="primary" type="submit"
                disabled={
                  !uploadedFiles.length ||
                  !branchStorageFileUploadModalFormik.values.categoryId ||
                  uploadSlots.some((slot) => slot.error)
                }
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default ReUploadFilesModal;