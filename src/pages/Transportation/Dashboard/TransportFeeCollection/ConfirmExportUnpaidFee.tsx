import React, { useEffect, useRef } from "react";
import { useFormik } from "formik";
import { default as ApproveSvg } from "../../../../assets/imagesdps/academics/ApproveSvg.svg?react";
import { TextInputGroup } from "../../../../Components/Common";
import { default as RupeeSvg } from "../../../../assets/imagesdps/feeDashboard/RupeeSvg.svg?react";
import { downloadExcelFile, getAmountValueWithDecimal } from "../../../../utility/commonutility";
import { shallowEqual, useDispatch } from "react-redux";
import { useAppSelector } from "../../../../hooks/storehook";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { toast } from "react-toastify";
import { exportUnpaidReportsAct } from "../../../../store/transportation/transportationaction";
import Button from "../../../../Components/Common/Button";

const initialValues = {
    dueAmount: "",
}

export const ConfirmExportUnpaidFee: React.FC<any> = (props) => {
    const dispatch = useDispatch();
    const {
        showApiLoader, academicYearListResp, exportUnpaidReportsResp,
    } = useAppSelector(
        ({ feeCollections, globalData, instAcademics, transportrequest, appData }) => ({
            showApiLoader: globalData.showApiLoader,
            academicYearListResp: instAcademics.academicYearListResp,
            exportUnpaidReportsResp: transportrequest.exportUnpaidReportsResp,
        }),
        shallowEqual
    );

    const feeDetailsRespRef = useRef({
        prevExportUnpaidReportsResp: exportUnpaidReportsResp,
    });

    useEffect(() => {
        const { prevExportUnpaidReportsResp } = feeDetailsRespRef.current;
        if (exportUnpaidReportsResp && exportUnpaidReportsResp !== prevExportUnpaidReportsResp) {
            toast.success("Transport dueAmount data downloaded successfully.");
            props.toggleModal()
            props.getFeeCollectionApiCall()
            downloadExcelFile(exportUnpaidReportsResp.data, "Transport_dueAmount");
        }
        feeDetailsRespRef.current.prevExportUnpaidReportsResp = exportUnpaidReportsResp;
    }, [exportUnpaidReportsResp]);


    const cbseVerificationForm = useFormik({
        initialValues,
        onSubmit: (values) => {
            const { academicYearId } = academicYearListResp?.data?.find((year: any) => year.yearStatus.toLowerCase() === "current") || {};
            const payload = {
                academicYearId: academicYearId,
                dueAmount: values.dueAmount || 0,
                branchId: props.branchId
            };
            dispatch(exportUnpaidReportsAct(generateActionPayload("export_unpaid_reports", payload, undefined, {
                responseType: 'blob'
            })));
        },
    });

    function onBlurDueamountHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        cbseVerificationForm.setFieldValue(name, getAmountValueWithDecimal(value));
    }

    return (
        <React.Fragment>
            <form onSubmit={cbseVerificationForm.handleSubmit}>
                <div className="tw-p-4">
                    <div className="tw-mt-2 tw-text-center tw-mb-3">
                        <div className="tw-text-[15px]">
                            <div className="tw-flex tw-justify-center tw-mb-3">
                                <ApproveSvg fill="#0ab39c" width="70px" height="70px" />
                            </div>

                            <h4 className="tw-text-base tw-font-semibold tw-mb-0">Are you sure?</h4>

                            <p className="tw-text-gray-500 tw-mb-0">
                                You want to export unpaid student report?
                            </p>
                        </div>
                    </div>
                    <TextInputGroup
                        name="dueAmount"
                        labelText="Download report of student for due amount more than ?"
                        allowedInputRegex="^[0-9]+\.?[0-9]*$"
                        inputGroupStart
                        value={cbseVerificationForm.values.dueAmount}
                        onChange={cbseVerificationForm.handleChange}
                        onBlur={onBlurDueamountHndlr}
                        placeHolder="0.00"
                    >
                        <RupeeSvg width="11px" height="11px" fill="#495057" />
                    </TextInputGroup>
                </div>
                <div className="tw-flex tw-justify-center tw-gap-2 tw-pb-4">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={props.toggleModal}
                    >
                        Cancel
                    </Button>

                    <Button
                        type="submit"
                        variant="primary"
                        id="delete-record"
                        disabled={showApiLoader}
                    >
                        Download
                    </Button>
                </div>

            </form>
        </React.Fragment>
    )

}