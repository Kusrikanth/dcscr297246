import React, { Children, useEffect, useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { default as ApproveSvg } from "../../../../assets/imagesdps/academics/ApproveSvg.svg?react";
import { default as RupeeSvg } from "../../../../assets/imagesdps/feeDashboard/RupeeSvg.svg?react";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import { getAmountValueWithDecimal } from "../../../../utility/commonutility";
import { InputCheckbox, RadioInputContainer, TextInputGroup } from "../../../../Components/Common";
import Button from "../../../../Components/Common/Button";
import { notifyHostelDueFeePaymentAct } from "../../../../store/hostel/hostelfee/hostelstudentledger/hostelstudentledgeractions";
import { generateActionPayload } from "../../../../utility/reduxutility";

const notifyStudentType = [
    {
        id: 'ALL_STUDENT',
        name: 'All student'
    },
    {
        id: 'SELECTED_STUDENT',
        name: 'Selected student'
    }
]

const initialValues = {
    notifyTo: "SELECTED_STUDENT",
    dueAmount: "",
    sendSms: true,
    sendEmail: true,
}


const validationSchema = Yup.object().shape({
    sendSms: Yup.boolean().test("sendSmsValidation", "Atleast one need to be selected.",
        (value: any, schema: any) => {
            const { sendEmail } = schema.parent;
            if (!value && !sendEmail) {
                return false;
            }
            return true;
        }),
});


export const ConfirmSendsmsDuePassed: React.FC<any> = (props) => {
    const dispatch = useAppDispatch();
    const {
        notifyHostelDueFeePaymentResp,
    }: any = useAppSelector(
        ({ hostelStuLedger }) => ({
            notifyHostelDueFeePaymentResp: hostelStuLedger.notifyHostelDueFeePaymentResp,
        }),
        shallowEqual
    );

    const feeDetailsRespRef = useRef({
        prevNotifyHostelDueFeePaymentResp: notifyHostelDueFeePaymentResp,
    });
    
    useEffect(() => {
        const { prevNotifyHostelDueFeePaymentResp } = feeDetailsRespRef.current;
        if (notifyHostelDueFeePaymentResp && notifyHostelDueFeePaymentResp !== prevNotifyHostelDueFeePaymentResp) {
            toast.success("Fee due reminder sended successfully.");
            props.toggle();
        }
        feeDetailsRespRef.current.prevNotifyHostelDueFeePaymentResp = notifyHostelDueFeePaymentResp;
    }, [notifyHostelDueFeePaymentResp]);


    const cbseVerificationForm = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values) => {
            const payload = {
                academicYearId: props.academicYearId,
                studentIds: values.notifyTo === 'ALL_STUDENT' ? '' : props.id,
                dueAmount: values.dueAmount || 0,
                sendSms: values.sendSms,
                sendEmail: values.sendEmail,
                branchId: props.branchId
            };
            dispatch(notifyHostelDueFeePaymentAct(generateActionPayload('notify_hostel_fee_due_ledge', undefined, payload)));
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
                        <div className="tw-text-base">
                            <div className="tw-flex tw-justify-center tw-mb-3">
                                <ApproveSvg fill="#0ab39c" width="70px" height="70px" />
                            </div>

                            <h4 className="tw-text-base tw-font-semibold tw-mb-0">Are you sure?</h4>

                            <p className="tw-text-gray-500 tw-mb-0">
                                You want to send sms reminder for the payment due date passed ?
                            </p>
                        </div>
                    </div>

                    <RadioInputContainer
                        name="notifyTo"
                        labelText="Notifity student options"
                        radioOptions={notifyStudentType}
                        value={cbseVerificationForm.values.notifyTo}
                        onChange={cbseVerificationForm.handleChange}
                    />

                    <TextInputGroup
                        name="dueAmount"
                        labelText="Notify student for due amount more than ?"
                        allowedInputRegex="^[0-9]+\.?[0-9]*$"
                        inputGroupStart={true}
                        value={cbseVerificationForm.values.dueAmount}
                        onChange={cbseVerificationForm.handleChange}
                        onBlur={onBlurDueamountHndlr}
                        placeHolder="0.00"
                    >
                        <RupeeSvg width="11px" height="11px" fill="#495057" />
                    </TextInputGroup>

                    <div className="tw-flex tw-flex-col tw-items-center tw-justify-center">
                        <div className="tw-flex tw-items-center tw-justify-center">
                            <InputCheckbox
                                name="sendSms"
                                formgroupClassName="tw-mb-0 tw-ml-0"
                                labelName="SMS"
                                value={cbseVerificationForm.values.sendSms}
                                onChange={cbseVerificationForm.handleChange}
                            />

                            <InputCheckbox
                                name="sendEmail"
                                formgroupClassName="tw-mb-0 tw-ml-3"
                                labelName="Email"
                                value={cbseVerificationForm.values.sendEmail}
                                onChange={cbseVerificationForm.handleChange}
                            />
                        </div>

                        {cbseVerificationForm.touched.sendSms &&
                            cbseVerificationForm.errors.sendSms && (
                                <div className="tw-block tw-text-center tw-text-red-500 tw-text-sm tw-mt-1">
                                    {cbseVerificationForm.errors.sendSms}
                                </div>
                            )}
                    </div>
                </div>

                <div className="tw-flex tw-gap-2 tw-justify-center tw-pb-4">
                    <Button
                        type="button"
                        variant="secondary"
                        data-bs-dismiss="modal"
                        onClick={props.toggle}
                    >
                        Cancel
                    </Button>

                    <Button
                        type="submit"
                        variant="primary"
                        id="delete-record"
                    >
                        Confirm
                    </Button>
                </div>
            </form>
        </React.Fragment>
    )

}