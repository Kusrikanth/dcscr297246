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
import { tcApproveRejectAct } from "../../../../store/academic/classroomManagment/classroommanagmentactions";
import { generateActionPayload } from "../../../../utility/reduxutility";
import Button from "../../../../Components/Common/Button";

const validationSchema = Yup.object().shape({
    remarks: Yup.string().required("Remarks is required.")
});

const initialValues = {
    remarks: ""
}

const TCApproveRejectModal = (props: any) => {
    const dispatch = useAppDispatch();
    const { showApiLoader, tcApproveRejectResp } =
        useAppSelector(
            ({ globalData, classroomManagmentInfo }) => ({
                showApiLoader: globalData.showApiLoader,
                tcApproveRejectResp: classroomManagmentInfo.tcApproveRejectResp,
                classroomManagmentErrorResp: classroomManagmentInfo.classroomManagmentErrorResp
            }), shallowEqual);

    const modalRespRef = useRef({
        prevTcApproveRejectResp: tcApproveRejectResp
    })

    useEffect(() => {
        const { prevTcApproveRejectResp, } = modalRespRef.current;
        if (tcApproveRejectResp && prevTcApproveRejectResp !== tcApproveRejectResp) {
            toast.success("TC updated successfully.");
            props.toggle(true);
        }
        modalRespRef.current.prevTcApproveRejectResp = tcApproveRejectResp;
    }, [tcApproveRejectResp]);

    const remarksForm = useFormik({
        validationSchema,
        initialValues,
        onSubmit: (values) => {
            const payload = {
                departmentName: props.departmentName,
                status: props.requestType,
                remarks: values.remarks
            }
            dispatch(tcApproveRejectAct(generateActionPayload('approve_tc_request', {
                tcReqId: props.tcReqId,
            }, payload)))
        },
    });

    return (
        <form onSubmit={remarksForm.handleSubmit}>
            <div className="tw-p-6">
                <div className="tw-mt-2 tw-text-center">
                    <div className="tw-flex tw-mb-3 tw-justify-center">
                        {props.requestType === "APPROVED" ? (
                            <ApproveSvg fill="#0ab39c" width="70px" height="70px" />
                        ) : (
                            <RejectSvg fill="#f06548" width="70px" height="70px" />
                        )}
                    </div>

                    <h4 className="tw-text-base tw-font-semibold tw-mb-0">Are you sure?</h4>

                    {props.requestType === "APPROVED" && (
                        <p className="tw-text-gray-500 tw-mb-3">
                            You want to Approve this TC Request !
                        </p>
                    )}

                    {props.requestType === "REJECTED" && (
                        <p className="tw-text-gray-500 tw-mb-3">
                            You want to Reject TC Request !
                        </p>
                    )}

                    <div className="tw-flex tw-justify-center">
                        <TextArea
                            name="remarks"
                            value={remarksForm.values.remarks}
                            placeHolder="Enter Remarks"
                            onChange={remarksForm.handleChange}
                             inputClassName="tw-bg-gray-100 tw-w-full"
                            formgroupClassName="tw-w-[70%]"
                            invalid={(remarksForm.touched.remarks && remarksForm.errors.remarks) ? true : false}
                            error={(remarksForm.touched.remarks && remarksForm.errors.remarks) ? remarksForm.errors.remarks : ""}
                        >
                            <i className="ri-pencil-line tw-text-gray-400"></i>
                        </TextArea>
                    </div>
                </div>
            </div>

            <div className="tw-flex tw-gap-2 tw-justify-center tw-p-4">
                <Button
                    type="button"
                    variant="secondary"
                    onClick={props.toggle}
                >
                    Cancel
                </Button>

                <Button
                    type="submit"
                    
                    variant= {props.requestType === "APPROVED" ? "primary" : "reject"}
                    id="delete-record"
                    disabled={props.isDisble || showApiLoader || false}
                >
                    {props.requestType === "APPROVED" && "Yes approve it!"}
                    {props.requestType === "REJECTED" && "Yes reject it!"}
                </Button>
            </div>
        </form>
    );
};

export default TCApproveRejectModal;
