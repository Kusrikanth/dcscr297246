
import { useEffect, useState } from "react";
import { UploadFileInput } from "../../../Components/Common";
import { useFormik } from "formik";
import { shallowEqual } from "react-redux";
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
import * as Yup from 'yup';
import { generateActionPayload } from "../../../utility/reduxutility";
import {  blukUploadConcessionError, bulkUploadConcessionV2Act } from "../../../store/fee/feeconcessions/feeconcessionactions";
import { downloadStaticHealthFormAct } from "../../../store/academic/classroomManagment/classroommanagmentactions";
import Button from "../../../Components/Common/Button";

const validationSchema = Yup.object().shape({
    file: Yup.mixed().required('file is required'),
});

const UploadExcelModal = (props: any) => {
    const dispatch = useAppDispatch();

    const [bulkUploadState, setbulkUploadState] = useState<any>("");
    const [errorBulkUpload, setErrorBulkUpload] = useState<any>("")
    const [showErrors, setShowErrors] = useState<boolean>(true); 

    const {
        showApiLoader,
        currentBranchIdResp: branchId,
        blukUploadConcessionErrorV2Resp
    } = useAppSelector(
        ({ globalData,  appData, feeConcession }) => ({
            showApiLoader: globalData.showApiLoader,
            currentBranchIdResp: appData.currentBranchIdResp,
            blukUploadConcessionErrorV2Resp: feeConcession.blukUploadConcessionErrorV2Resp
        }),
        shallowEqual 
    );    
    const initialValues: any = {
        file: null,
    };

    const bulkUploadForm = useFormik({
        initialValues,
        validationSchema,
        enableReinitialize: true,
        onSubmit: (values) => {

            const params = {
                branchId,
                academicYearId: props.academicYearId,
                feeType: "TERM",
            }
            const formData = new FormData();
            formData.append("file", values?.file)

            dispatch(bulkUploadConcessionV2Act(generateActionPayload('bulk_upload_concession_v2', params, formData)))
            setShowErrors(true);
        },
    });

    useEffect(() => {
        return () => {
          dispatch(blukUploadConcessionError(undefined))  
        }
    },[])
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
            let error = uploadFileErrorHndlr(file.size, file.type, ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel']);

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

            <div className="tw-p-4">
                <div className="tw-flex tw-items-center tw-mb-3">
                    <div>Download Template for Concession :</div>

                    <div className="tw-ml-3">
                        <Button
                            className="tw-flex tw-items-center !tw-bg-[#405189] tw-text-white tw-px-4 tw-py-2 tw-rounded disabled:tw-opacity-60"
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

                {blukUploadConcessionErrorV2Resp &&
                    !blukUploadConcessionErrorV2Resp.details &&
                    showErrors && (
                        <div className="tw-relative tw-mt-3 tw-max-h-[200px] tw-overflow-y-auto tw-rounded tw-border tw-border-red-300 tw-bg-red-50 tw-p-3">
                            <strong className="tw-text-red-700">Errors:</strong>

                            <div
                                className="tw-absolute tw-top-2 tw-right-2 tw-text-gray-500 hover:tw-text-gray-700"
                                onClick={() => setShowErrors(false)}
                            >
                                ✕
                            </div>

                            <ul className="tw-mt-2 tw-space-y-2">
                                {Object.entries(blukUploadConcessionErrorV2Resp)?.map(
                                    ([row, messages]: any) => (
                                        <li key={row}>
                                            <strong>{row}:</strong>
                                            <ul className="tw-mt-1 tw-ml-5 tw-list-disc tw-space-y-1">
                                                {messages?.map((msg: string, index: number) => (
                                                    <li
                                                        key={index}
                                                        className="tw-break-words"
                                                    >
                                                        {msg}
                                                    </li>
                                                ))}
                                            </ul>
                                        </li>
                                    )
                                )}
                            </ul>
                        </div>
                    )}

                <div className="tw-flex tw-justify-end tw-mt-4">
                    <div className="tw-flex tw-gap-3">
                        <Button
                            variant="secondary"
                            type="button"
                            onClick={props.toggle}
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            variant="primary"
                            onClick={(event: any) => bulkUploadForm.handleSubmit(event)}
                            disabled={showApiLoader}
                        >
                            Upload
                        </Button>
                    </div>
                </div>
            </div>

        </>
    );
};

export default UploadExcelModal;
