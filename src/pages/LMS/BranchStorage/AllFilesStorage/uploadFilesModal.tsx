import { useEffect, useMemo, useRef, useState } from "react";
import UploadFileProgress from "../../../../Components/Common/UploadFileProgress";
import FolderTreeView from "./FolderTreeView";
import Button from "../../../../Components/Common/Button";
import { findFolderPathById, renderOptionsCategory } from "./helper";
import { useFormik } from "formik";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { resetUploadBranchStorageFileAct, uploadBranchStorageFileAct } from "../../../../store/branchstorage/branchstoragemanagement/branchstoragemanagementactions";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import { getBranchPoliciesAct, getFileTypeCategoryListAct, resetFileCategoryListAct } from "../../../../store/branchstorage/branchstoragesettings/branchstoragesettingsactions";
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
  selectedGroup: null,
  categoryId: "",
  categoryName: "",
}

const validationSchema = Yup.object().shape({
  categoryId: Yup.string()
    .nullable()
    .required("Category is required"),
});

const UploadFilesModal = ({
  folderTree = [],
  files = [],
  toggle,
  onSave,
  expandedFolders,
  setExpandedFolders,
  activeFolderId,
  setActiveFolderId,
  onFolderExpand,
  setIsUploadingToS3,
  setUploadStatus,
  setCompletedUploads,
  setTotalUploads,
  onUploadSuccess,
}: any) => {

  const [uploadTriggered, setUploadTriggered] = useState(false);
  const [uploadSlots, setUploadSlots] = useState<UploadSlot[]>([
    createUploadSlot(),
  ]);
  const [isUploadLocked, setIsUploadLocked] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const dispatch = useAppDispatch();
  const [searchEmployeeState, setSearchEmployeeState] = useState<any>(undefined);
  const {
    currentInstIdResp: instituteId,
    currentBranchIdResp: branchId,
    showApiLoader,
    uploadBranchStorageFileNameResp,
    getBranchPoliciesList,
    getFileCategoryListResp,
    userMeResp,
    branchStorageManagementErrorAct,
  } =
    useAppSelector(({ appData, globalData, branchStorageManagement, branchStorageSettings, login }) => ({
      currentInstIdResp: appData.currentInstIdResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      showApiLoader: globalData.showApiLoader,
      uploadBranchStorageFileNameResp: branchStorageManagement.uploadBranchStorageFileNameResp,
      getBranchPoliciesList: branchStorageSettings.getBranchPoliciesList,
      getFileCategoryListResp: branchStorageSettings.getFileCategoryListResp,
      userMeResp: login.userMeResp,
      branchStorageManagementErrorAct: branchStorageManagement.branchStorageManagementErrorAct,
    }), shallowEqual);

  const uploadExtensions = useMemo(() => {
    return (
      getBranchPoliciesList?.policyJson?.fileTypes?.extensions?.map(
        (ext: string) => `.${ext.toLowerCase()}`
      ) ?? []
    );
  }, [getBranchPoliciesList]);

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
  const currentClientFileIdsRef = useRef<string[]>([]);

  const uploadSession =
    uploadBranchStorageFileNameResp?.data ??
    uploadBranchStorageFileNameResp;

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

  const uploadedFiles = useMemo(
    () => uploadSlots.map((item) => item.file).filter(Boolean) as File[],
    [uploadSlots]
  );

  const activeFolderPath = useMemo(
    () => getSelectedFolderPath(folderTree, activeFolderId),
    [folderTree, activeFolderId]
  );

  const uploadedFileItems = useMemo(
    () =>
      uploadSlots
        .filter((item) => !!item.file)
        .map((item) => ({
          file: item.file as File,
          folderId: item.folderId || "all",
          folderPath: item.folderPath || "All files",
        })),
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
    const uploadFolderPath = getSelectedFolderPath(
      folderTree,
      uploadFolderId
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
      if (isUploadLocked) return;

      const invalidFiles = uploadSlots.filter((slot) => slot.error);

      if (invalidFiles.length > 0) {
        toast.error("Some files have invalid extension or size");
        return;
      }

      const filesPayload = uploadSlots
        .filter((slot) => slot.file)
        .map((slot) => ({
          clientFileId: slot.id,
          originalFileName: slot.file!.name,
          mimeType: slot.file!.type,
          expectedSizeBytes: slot.file!.size,
          categoryId: branchStorageFileUploadModalFormik.values.categoryId,
          // categoryName:
          //   branchStorageFileUploadModalFormik.values.categoryName,
        }));

      if (!filesPayload.length) {
        toast.error("Please select at least one file");
        return;
      }

      setIsUploadLocked(true);
      setUploadStatus("preparing");

      currentClientFileIdsRef.current = filesPayload.map(
        (file) => file.clientFileId
      );

      ignoredSessionUuidRef.current =
        uploadSession?.sessionUuid ?? null;

      setUploadTriggered(true);

      const payload = {
        instituteId,
        branchId,
        folderId: activeFolderId,
        files: filesPayload,
      };

      dispatch(
        uploadBranchStorageFileAct(
          generateActionPayload(
            "upload_branch_storage_file",
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
    onProgress: (loaded: number, total: number) => void
  ) =>
    new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.open("PUT", config.uploadUrl);

      Object.entries(config.requiredHeaders || {}).forEach(([key, value]) => {
        xhr.setRequestHeader(key, String(value));
      });

      xhr.upload.addEventListener("progress", (event) => {
        if (!event.lengthComputable) return;

        onProgress(event.loaded, event.total);
      });

      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          onProgress(file.size, file.size);
          resolve();
          return;
        }

        reject(
          new Error(`S3 upload failed for ${file.name}: ${xhr.status}`)
        );
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
    try {
      setIsUploadLocked(true);
      setIsUploadingToS3(true);
      setUploadStatus("uploading");
      setCompletedUploads(0);
      setTotalUploads(uploadConfigs.length);
      setUploadProgress(0);

      const fileMap = new Map(
        uploadSlots
          .filter((slot) => slot.file)
          .map((slot) => [slot.id, slot.file as File])
      );

      const totalBytes = uploadConfigs.reduce((sum, config) => {
        const file = fileMap.get(config.clientFileId);
        return sum + (file?.size ?? 0);
      }, 0);

      const uploadedBytes = new Map<string, number>();

      const updateOverallProgress = (
        clientFileId: string,
        loaded: number
      ) => {
        uploadedBytes.set(clientFileId, loaded);

        const totalLoaded = Array.from(uploadedBytes.values()).reduce(
          (sum, value) => sum + value,
          0
        );

        const percentage =
          totalBytes > 0
            ? Math.round((totalLoaded / totalBytes) * 100)
            : 0;

        setUploadProgress(Math.min(percentage, 100));
      };

      await Promise.all(
        uploadConfigs.map(async (config: any) => {
          const file = fileMap.get(config.clientFileId);

          if (!file) {
            throw new Error(
              `File not found for clientFileId: ${config.clientFileId}`
            );
          }

          await uploadFileWithProgress(
            config,
            file,
            (loaded) =>
              updateOverallProgress(config.clientFileId, loaded)
          );

          setCompletedUploads((previous: number) => previous + 1);
        })
      );

      setUploadProgress(100);
      setUploadStatus("success");

      setTimeout(() => {
        toast.success(
          `${uploadConfigs.length} file${uploadConfigs.length > 1 ? "s" : ""
          } uploaded successfully`
        );

        onUploadSuccess?.(activeFolderId);
        toggle?.();
        setIsUploadingToS3(false);
        setIsUploadLocked(false);
        setUploadProgress(0);
      }, 8000);
    } catch (error) {
      console.error("S3 upload error:", error);

      setUploadStatus("error");

      toast.error(
        error instanceof Error
          ? error.message
          : "File upload failed"
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
    const sessionUuid = uploadSession?.sessionUuid;
    const uploadFiles = uploadSession?.files || [];
    if (!uploadTriggered) return;
    if (!sessionUuid) return;
    if (!uploadFiles.length) return;
    if (sessionUuid === ignoredSessionUuidRef.current) return;
    if (processedSessionUuidRef.current === sessionUuid) return;
    const currentClientFileIds = currentClientFileIdsRef.current;
    const isCurrentRequest = uploadFiles.every((file: any) =>
      currentClientFileIds.includes(file.clientFileId)
    );
    if (!isCurrentRequest) return;
    processedSessionUuidRef.current = sessionUuid;
    setUploadTriggered(false);
    uploadFilesToS3(uploadFiles);
  }, [uploadTriggered, uploadSession?.sessionUuid, uploadSession?.files]);

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
            title="Uploading files"
            preparingTitle="Preparing your upload"
            message="Please keep this window open and do not change the selected folder."
          />
          <div
            className={
              isUploadLocked
                ? "tw-pointer-events-none tw-select-none tw-opacity-60"
                : ""
            }
          >
            <div className="tw-px-3 tw-py-1">
              <div className="tw-grid tw-grid-cols-12 tw-pe">
                <div className="tw-col-span-12">
                  <p className="tw-text-sm tw-text-gray-500 tw-mb-0 tw-truncate">
                    Uploading to:{" "}
                    <span className="tw-font-semibold tw-text-gray-800">
                      {activeFolderPath}
                    </span>
                  </p>
                </div>
                <div className="tw-col-span-12 lg:tw-col-span-5">
                  <div className="tw-p-4">
                    <div className="tw-mb-3">
                      <h4 className="tw-text-base tw-font-semibold tw-flex-1 tw-mb-1">
                        Select Location
                      </h4>
                    </div>
                    <div className="tw-max-h-[400px] tw-overflow-y-auto tw-overflow-x-hidden tw-pr-2">
                      <FolderTreeView
                        folderTree={folderTree}
                        activeFolderId={activeFolderId}
                        setActiveFolderId={setActiveFolderId}
                        expandedFolders={expandedFolders}
                        setExpandedFolders={setExpandedFolders}
                        onFolderExpand={onFolderExpand}
                      />
                    </div>
                  </div>
                </div>
                <div className="tw-col-span-12 lg:tw-col-span-7 tw-min-w-0">
                  <div className="tw-mt-2 tw-mb-4">
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
                  <div className="tw-flex tw-items-center tw-justify-between tw-mb-4">
                    <h5 className="tw-text-base tw-font-semibold tw-text-gray-800 tw-mb-0">
                      Selected Files ({uploadedFiles.length})
                    </h5>
                    <Button
                      variant="secondary"
                      type="button"
                      disabled={!canAddMore}
                      onClick={handleAddMore}
                    >
                      Add More
                    </Button>
                  </div>
                  <div className="tw-h-[400px] tw-overflow-y-auto tw-overflow-x-hidden tw-pr-2">
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
                              disabled={isUploadLocked}
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
                            fileExtensions={uploadExtensions}
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
              <div className="tw-flex tw-justify-end tw-gap-2">
                <Button
                  variant="secondary"
                  type="button"
                  disabled={isUploadLocked}
                  onClick={toggle}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={
                    isUploadLocked ||
                    uploadTriggered ||
                    !branchStorageFileUploadModalFormik.values.categoryId ||
                    !uploadedFiles.length ||
                    uploadSlots.some((slot) => Boolean(slot.error))
                  }
                >
                  {isUploadLocked ? "Uploading..." : "Save"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default UploadFilesModal;