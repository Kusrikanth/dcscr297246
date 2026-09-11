
import { useState } from "react";
import { default as ConfirmationIcon } from "../../../assets/imagesdps/academics/confirmation-icon.svg?react";
import { UploadFileInput } from "../../../Components/Common";
import { useFormik } from "formik";
import { shallowEqual, useDispatch } from "react-redux";
import { useAppSelector } from "../../../hooks/storehook";
import * as Yup from 'yup';
import { generateActionPayload } from "../../../utility/reduxutility";
import { bulkUploadConcessionAct } from "../../../store/fee/feeconcessions/feeconcessionactions";
import { downloadStaticHealthFormAct } from "../../../store/academic/classroomManagment/classroommanagmentactions";

const validationSchema = Yup.object().shape({
  file: Yup.mixed().required('file is required'),
});

const UploadExcelModal = (props: any) => {
  const dispatch = useDispatch();

  const [bulkUploadState,setbulkUploadState] = useState<any>("");
const [errorBulkUpload, setErrorBulkUpload] = useState<any>("")

const {
  showApiLoader,
  currentBranchIdResp:branchId,
}: any = useAppSelector(
  ({applicationSale, globalData, instAcademics, branchAcademics, appData, directoryStudent,classroomManagmentInfo }) => ({
      showApiLoader:globalData.showApiLoader,
      currentBranchIdResp: appData.currentBranchIdResp,
  }),
  shallowEqual
);

const initialValues: any = {
  file:null,
};

const bulkUploadForm = useFormik({
  initialValues,
  validationSchema,
  enableReinitialize: true,
  onSubmit: (values:any) => {

    const params = {
      branchId,
      academicYearId: props.academicYearId,
      feeType : "ONETIME",
    }
    const formData = new FormData();
    formData.append("file",values?.file)

    dispatch(bulkUploadConcessionAct(generateActionPayload('bulk_upload_concession',params,formData)))
  },
});

function uploadFileErrorHndlr(fileSize: any, fileType: string, validFileFormaters: Array<string>) {
  if (!validFileFormaters.includes(fileType)) {
      return `Upload file should be of format .xlsx , .xls`;
  }
  if (!isNaN(fileSize) && (Math.ceil(fileSize / (1024 * 1024)) > 2)) {
      return "Upload file should be less than 2mb.";
  }
  return "";
}

function handleFileUploadHnlr(event: any) {
  const { name } = event.target;
  const file = event.target.files[0];
  if (name === "file") {
    let error = uploadFileErrorHndlr(file.size,file.type,['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel']);
    
    if (error === "") {
      setErrorBulkUpload('');
      setbulkUploadState(file);
      bulkUploadForm.setFieldValue('file', file)
    }
    else {
      setErrorBulkUpload(error);
    }
  }
}

const downloadHealthForm = () => {

  const payload = {
      formType: "CONCESSION_BULK_UPLOAD",
  }
  dispatch(downloadStaticHealthFormAct(generateActionPayload("download_static_health_form", undefined, payload)));
}
  return (
    <>
      
      <div className='p-4 '>
        <div className='d-flex align-items-center mb-3'>
          <div className="">
      Dowload Template for Concession :
          </div>
          <div className="ms-3">
        <button
                        style={{ background: "#405189", border: "none" }}
                        className="btn float-end d-flex align-items-center  text-white me-2"
                        onClick={() => downloadHealthForm()}
                        disabled={showApiLoader}
                        >
                        Download
                    </button>
                      </div>
        </div>
        <div className='col-12'>
        <UploadFileInput
              name="file"
              labelText="Upload Excel"
              value={bulkUploadState?.name || ""}
              onChange={handleFileUploadHnlr}
              hideUploadBtn={true}
              invalid={!!errorBulkUpload}
              error={errorBulkUpload || (bulkUploadForm.errors.file) }
            //   isReadOnly={props.tcId}
            />
        </div>

        <div className='row'>
                <div className='d-flex w-auto ms-auto mt-2'>
                    <button
                        type="submit"
                        className="btn btn-light text-success mx-3"
                        onClick={props.toggle}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="btn btn-success px-4"
                        onClick={(event:any) => { bulkUploadForm.handleSubmit(event)}}
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
