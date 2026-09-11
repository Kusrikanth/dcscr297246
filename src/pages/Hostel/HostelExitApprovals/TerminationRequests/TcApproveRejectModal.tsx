import { useEffect, useRef } from "react";
import { TextArea } from "../../../../Components/Common";
import classNames from "classnames";
import { default as ApproveSvg } from "../../../../assets/imagesdps/academics/ApproveSvg.svg?react";
import { default as RejectSvg } from "../../../../assets/imagesdps/academics/confirmation-icon.svg?react";
import { useFormik } from 'formik';
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { updateHostelTransferStatusAct } from "../../../../store/hostel/hostelrequest/hostelrequestactions";
import Button from "../../../../Components/Common/Button";

const validationSchema = Yup.object().shape({
    remarks: Yup.string().required("Remarks is required.")
});

const initialValues = {
    remarks: ""
}

const TCApproveRejectModal = (props: any) => {
    const dispatch = useAppDispatch();
    const { showApiLoader, updateHostelTransferStatusResp } =
        useAppSelector(
            ({ globalData, hostelRequest }) => ({
                showApiLoader: globalData.showApiLoader,
                updateHostelTransferStatusResp: hostelRequest.updateHostelTransferStatusResp,
            }), shallowEqual);

    const modalRespRef = useRef({
        prevUpdateHostelTransferStatusResp: updateHostelTransferStatusResp
    })

    useEffect(() => {
        const { prevUpdateHostelTransferStatusResp } = modalRespRef.current;
        if (updateHostelTransferStatusResp && prevUpdateHostelTransferStatusResp !== updateHostelTransferStatusResp) {
            toast.success("Hostel exit status updated successfully.");
            props.toggle(true);
        }
        modalRespRef.current.prevUpdateHostelTransferStatusResp = updateHostelTransferStatusResp;
    }, [updateHostelTransferStatusResp]);

    const remarksForm = useFormik({
        validationSchema,
        initialValues,
        onSubmit: (values) => {
            const payload = {
                exitApprovalId: props.tcReqId,
                remarks: values.remarks
            }
            dispatch(updateHostelTransferStatusAct(generateActionPayload('approve_hostel_transfer_request',
                undefined, payload)))
        },
    });

    return (
        <form onSubmit={remarksForm.handleSubmit}>
            <div className="tw-p-6">
                <div className="tw-mt-2 tw-text-center">
                    <div className="tw-flex tw-justify-center tw-mb-3">
                        {props.requestType === "APPROVED" ? (
                            <ApproveSvg fill="#0ab39c" width="70px" height="70px" />
                        ) : (
                            <RejectSvg fill="#f06548" width="70px" height="70px" />
                        )}
                    </div>

                    <h4 className="tw-text-base tw-font-semibold tw-mb-0">Are you sure?</h4>

                    {props.requestType === "APPROVED" && (
                        <p className="tw-text-gray-500 tw-mb-3">
                            You want to Approve this Hostel Exit Request !
                        </p>
                    )}

                    {props.requestType === "REJECTED" && (
                        <p className="tw-text-gray-500 tw-mb-3">
                            You want to Reject Hostel Exit Request !
                        </p>
                    )}

                    <div className="tw-flex tw-justify-center">
                        <TextArea
                            name="remarks"
                            value={remarksForm.values.remarks}
                            placeHolder="Enter Remarks"
                            onChange={remarksForm.handleChange}
                            inputClassName="bg-light w-100"
                            formgroupClassName="tw-w-[70%]"
                            invalid={
                                remarksForm.touched.remarks && remarksForm.errors.remarks
                                    ? true
                                    : false
                            }
                            error={
                                remarksForm.touched.remarks && remarksForm.errors.remarks
                                    ? remarksForm.errors.remarks
                                    : ""
                            }
                        >
                            <i className="ri-pencil-line tw-text-gray-400"></i>
                        </TextArea>
                    </div>
                </div>
            </div>

            <div className="tw-flex tw-gap-2 tw-justify-center tw-px-6 tw-pb-4">
                <Button
                    type="button"
                    onClick={props.toggle}
                    variant="secondary"
                >
                    Cancel
                </Button>

                <Button
                    type="submit"
                    id="delete-record"
                    disabled={props.isDisble || showApiLoader || false}
                    variant={props.requestType === "APPROVED" ? "primary" : "reject"}

                >
                    {props.requestType === "APPROVED" && "Yes approve it!"}
                    {props.requestType === "REJECTED" && "Yes reject it!"}
                </Button>
            </div>
        </form>
    );
};

export default TCApproveRejectModal;
