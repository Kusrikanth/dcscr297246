import { useState } from "react";
import { default as ConfirmationIcon } from "../../../assets/imagesdps/academics/confirmation-icon.svg?react";
import { RadioInputContainer, UploadFileInput } from "../../../Components/Common";
import { useFormik } from "formik";
import { shallowEqual, useDispatch } from "react-redux";
import { useAppSelector } from "../../../hooks/storehook";
import * as Yup from 'yup';
import { generateActionPayload } from "../../../utility/reduxutility";
import { bulkUploadLibraryBookCollectionAct, downloadLibraryBookCollectionFormAct } from "../../../store/library/bookcollection/bookcollectionaction";
import Button from "../../../Components/Common/Button";

const validationSchema = Yup.object().shape({
  file: Yup.mixed().required('File is required'),
});

const UploadExcelModal = (props: any) => {
  const dispatch = useDispatch();

  const [bulkUploadState, setBulkUploadState] = useState<any>("");
  const [errorBulkUpload, setErrorBulkUpload] = useState<any>("");

  const {
    showApiLoader,
    currentBranchIdResp: branchId,
  }: any = useAppSelector(
    ({ globalData, appData }) => ({
      showApiLoader: globalData.showApiLoader,
      currentBranchIdResp: appData.currentBranchIdResp,
    }),
    shallowEqual
  );

  const initialValues: any = {
    file: null,
    isForceUpdate: "false", // Added initial value for isForceUpdate
  };

  const bulkUploadForm = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values: any) => {
      const params = {
        branchId,
        isForceUpdate: values.isForceUpdate, // Added isForceUpdate to params
      };
      const formData = new FormData();
      formData.append("file", values?.file);
      formData.append("isForceUpdate", values.isForceUpdate); // Added isForceUpdate to formData
      formData.append("branchId", branchId);
      dispatch(bulkUploadLibraryBookCollectionAct(generateActionPayload('bulk_upload_library_book_collection', params, formData)));
    },
  });

  function uploadFileErrorHndlr(fileSize: any, fileType: string, validFileFormaters: Array<string>) {
    if (!validFileFormaters.includes(fileType)) {
      return `Upload file should be of format .xlsx, .xls`;
    }
    if (!isNaN(fileSize) && (Math.ceil(fileSize / (1024 * 1024)) > 2)) {
      return "Upload file should be less than 2MB.";
    }
    return "";
  }

  function handleFileUploadHnlr(event: any) {
    const { name } = event.target;
    const file = event.target.files[0];
    if (name === "file") {
      let error = uploadFileErrorHndlr(file.size, file.type, ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel']);
      
      if (error === "") {
        setErrorBulkUpload('');
        setBulkUploadState(file);
        bulkUploadForm.setFieldValue('file', file);
      } else {
        setErrorBulkUpload(error);
      }
    }
  }

  const downloadHealthForm = () => {
    const payload = {
      formType: "LIBRARY_BOOK_COLLECTION_UPLOAD",
    };
    dispatch(downloadLibraryBookCollectionFormAct(generateActionPayload("download_static_library_book_collection_form", undefined, payload)));
  };

  return (
    <>
      <div className="tw-p-5">
        <div className="tw-flex tw-items-center tw-mb-3">
          <div>Download Template for Book Collection:</div>
          <div className="tw-ml-3">
            <Button
              variant="info"
              type="button"
              className="tw-flex tw-items-center"
              onClick={() => downloadHealthForm()}
              disabled={showApiLoader}
            >
              Download
            </Button>
          </div>
        </div>
        <div className="tw-w-full">
          <UploadFileInput
            name="file"
            labelText="Upload Excel"
            value={bulkUploadState?.name || ""}
            onChange={handleFileUploadHnlr}
            hideUploadBtn={true}
            invalid={!!errorBulkUpload}
            error={errorBulkUpload || bulkUploadForm.errors.file}
          />
        </div>
        <div className="tw-w-full">
          <RadioInputContainer
            name="isForceUpdate"
            labelText="Replace Existing Accession Number?"
            labelClassName="fw-bold"
            inputContainerClassName="tw-mt-2"
            radioOptions={[
              { id: "true", name: "Yes" },
              { id: "false", name: "No" },
            ]}
            value={bulkUploadForm.values.isForceUpdate}
            onChange={bulkUploadForm.handleChange}
          />
        </div>
        <div className="tw-flex tw-justify-end tw-mt-2 tw-gap-2">
          <Button type="button" variant="secondary" onClick={props.toggle}>
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              className="tw-px-2 tw-py-1"
              onClick={(event: any) => {
              bulkUploadForm.handleSubmit(event);
            }}
              disabled={showApiLoader}
            >
              Upload
            </Button>
        </div>
      </div>
    </>
  );
};

export default UploadExcelModal;
