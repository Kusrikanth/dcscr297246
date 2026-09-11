import { useState } from "react";
import { useFormik } from "formik";
import { shallowEqual, useDispatch } from "react-redux";
import * as Yup from 'yup';
import { useAppSelector } from "../../../../hooks/storehook";
import { UploadFileInput } from "../../../../Components/Common";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { uploadMarksEntryAct } from "../../../../store/examination/examinationmanagement/examinationmanagementactions";

const validationSchema = Yup.object().shape({
  file: Yup.mixed().required('File is required'),
});

const initialValues: any = {
  file: null,
  isForceUpdate: "false", 
};

const UploadExcelModal = (props: any) => {
  const dispatch = useDispatch();

  const [bulkUploadState, setBulkUploadState] = useState<any>("");
  const [errorBulkUpload, setErrorBulkUpload] = useState<any>("");

  const {
    showApiLoader,
    currentBranchIdResp: branchId,
  } = useAppSelector(
    ({ globalData, appData }) => ({
      showApiLoader: globalData.showApiLoader,
      currentBranchIdResp: appData.currentBranchIdResp,
    }),
    shallowEqual
  );

  const bulkUploadForm = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values: any) => {

      const { academicYearId, curriculumId, classId, sectionId, examinationId, subjectType, scholasticType, subjectId, coScholasticType, skillArea, languageId } = props.marksEntryForm.values
      const formData = new FormData();
      formData.append("file", values?.file);
      formData.append("academicYearId", academicYearId); 
      formData.append("curriculumId", curriculumId);
      formData.append("classId", classId);
      formData.append("sectionId", sectionId);
      formData.append("examinationId", examinationId);
      formData.append("subjectType", subjectType);
      if (subjectType === "COSCHOLASTIC") {
        formData.append("coScholasticType", coScholasticType);
        formData.append("skillArea", skillArea);
      } else {
        formData.append("scholasticType", scholasticType);
      }
      formData.append("subjectId", subjectId);
      formData.append("branchId", branchId);
      formData.append("languageId", languageId);
      dispatch(uploadMarksEntryAct(generateActionPayload('upload_marks_entry', undefined, formData)));
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


  return (
    <>
      <div className='p-4'>
        <div className='col-12'>
          <UploadFileInput
            name="file"
            formgroupClassName="mb-2"
            labelText="Upload Excel"
            value={bulkUploadState?.name || ""}
            onChange={handleFileUploadHnlr}
            hideUploadBtn={true}
            invalid={!!errorBulkUpload}
            error={errorBulkUpload || (bulkUploadForm.errors.file)}
          />
        </div>
        <div className='row px-3'>
          <div className='col-auto pe-0 ms-auto'>
            <p className="text-muted mb-0">
            Present - PR, Absent - AB, Medical leave- ML
            </p>
          </div>
        </div>
        <div className='row'>
          <div className='d-flex w-auto ms-auto mt-2'>
            <button
              type="button"
              className="btn btn-light mx-3"
              onClick={props.toggle}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-success px-4"
              onClick={(event: any) => { bulkUploadForm.handleSubmit(event); }}
              disabled={showApiLoader}
            >
              Upload
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UploadExcelModal;
