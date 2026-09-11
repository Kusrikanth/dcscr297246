import React, { useState, useEffect, useRef } from "react";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import { useFormik } from 'formik';
import * as Yup from "yup";
import classnames from "classnames";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";

//Common Component
import {
    ProgressIndicator, ModalComponent,
    TextArea,
    Button
} from "../../../../Components/Common";

//Generate Action
import { generateActionPayload } from "../../../../utility/reduxutility";
import { deactivateRoleTypeUserAct } from "../../../../store/usermanagement/usermanagementactions";
//Icons
import { default as CancelIcon } from "../../../../assets/imagesdps/academics/CancelIcon.svg?react";

import { default as ApproveIcon } from "../../../../assets/imagesdps/academics/ApproveSvg.svg?react";


const validationSchema = Yup.object().shape({
    remarks: Yup.string().required("Remarks are required."),
});


const initialValues = { remarks: "" };
export default function DeactivateAccount(props: any) {
    const dispatch = useAppDispatch();

    const { deactivateRoleTypeUserResp } = useAppSelector(({ userManagement }) => ({
        deactivateRoleTypeUserResp: userManagement.deactivateRoleTypeUserResp
    }), shallowEqual);

    const deactivateAccountRespref = useRef<any>({
        prevDeactivateRoleTypeUserResp: deactivateRoleTypeUserResp
    });
    useEffect(() => {
        const { prevDeactivateRoleTypeUserResp } = deactivateAccountRespref.current;
        if (deactivateRoleTypeUserResp && prevDeactivateRoleTypeUserResp !== deactivateRoleTypeUserResp) {
            toast.success("User upated successfully.");
            props.toggle(true);
        }
        deactivateAccountRespref.current.prevDeactivateRoleTypeUserResp = deactivateRoleTypeUserResp;
    }, [deactivateRoleTypeUserResp]);


    const deactivateUserForm = useFormik({
        enableReinitialize: false,
        initialValues: initialValues,
        validationSchema,
        onSubmit: (values) => {
            const { userIds, isUserActive } = props;
            if (Array.isArray(userIds)) {
                const payload = userIds.map((item: any) => ({
                    userId: item,
                    enable: !isUserActive,
                }));
                dispatch(deactivateRoleTypeUserAct(generateActionPayload("deactivate_activate_user", undefined,
                    { users: payload })));
            }
            // const { id, role } = props.editUserDetails,
            //     { roleType } = role || {};
            // const params = { roleType, userId: id };
            // const payload = { ...values };
            // dispatch(deactivateRoleTypeUserAct(generateActionPayload("update_user_detail", params, payload)));
        },
    });


    useEffect(() => {
        if (!props.isOpen) {
            deactivateUserForm.resetForm();
        }
    }, [props.isOpen]);


    const { isUserActive } = props;
    return (
        <>
            
                <form onSubmit={deactivateUserForm.handleSubmit} className="tw-p-5">
                    <div className="tw-flex tw-flex-col tw-items-center">
                        <div className="tw-flex tw-mb-6">
                            {isUserActive ? <CancelIcon style={{ height: "70px", width: "70px" }} /> :
                                <ApproveIcon style={{ height: "70px", width: "70px", fill: "#16A99A" }} />}
                        </div>
                        <h5 className="tw-text-lg tw-font-semibold tw-mb-2">You want to {isUserActive ? "Deactivate" : "Activate"} the Account?</h5>
                        <span className="tw-text-gray-500 tw-font-normal tw-mb-6 tw-text-center">
                            {isUserActive ? "User will no longer be able to login the system." : "User can login into the system."}
                        </span>

                        <div className="tw-w-full">
                            <TextArea
                                name="remarks"
                                value={deactivateUserForm.values.remarks}
                                onChange={deactivateUserForm.handleChange}
                                inputClassName="tw-bg-gray-100 tw-w-full"
                                formgroupClassName="tw-w-full"
                                invalid={(deactivateUserForm.touched.remarks && deactivateUserForm.errors.remarks) ? true : false}
                                error={(deactivateUserForm.touched.remarks && deactivateUserForm.errors.remarks) ? deactivateUserForm.errors.remarks : ""}
                            />
                        </div>
                        
                        <div className="tw-flex tw-justify-center tw-gap-2 tw-mt-8">
                            <Button 
                                type="button"
                                variant="secondary"
                                onClick={props.toggle}
                            >
                                Cancel
                            </Button>
                            <Button 
                                type="submit"
                                variant={isUserActive ? "reject" : "primary"}
                            >
                                Confirm
                            </Button>
                        </div>
                    </div>
                </form>
            

        </>
    )
}