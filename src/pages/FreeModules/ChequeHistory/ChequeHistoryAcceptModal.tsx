import React, { useRef, useEffect, } from "react";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import * as Yup from "yup";
import classnames from "classnames";
import {
  DateInput,
  TextArea,
} from "../../../Components/Common";
import { useFormik } from "formik";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";

//Action Generator
import { generateActionPayload } from "../../../utility/reduxutility";
import {
  approveRejectChequeAct
} from "../../../store/fee/feeapprovals/feeapprovalactions";

//Icons
import { default as CancelIcon } from "../../../assets/imagesdps/academics/CancelIcon.svg?react";

import { default as ApproveIcon } from "../../../assets/imagesdps/academics/ApproveSvg.svg?react";
import Button from "../../../Components/Common/Button";

const validationSchema =
  Yup.object().shape({
    startDate: Yup.string().when('isApprovedAction', {
      is: (isApprovedAction: any) => isApprovedAction,
      then: Yup.string()
        .required('Select cheque clearance date.')
    }),

    remarks: Yup.string().when('isApprovedAction', {
      is: (isApprovedAction: any) => !isApprovedAction,
      then: Yup.string().required('Remark is required.'),
    }),
  });

const initialValues = { remarks: "", startDate: "",isApprovedAction:false };

const ChequeHistoryAcceptModal = (props: any) => {
  const dispatch = useAppDispatch();

  const { approvRejectChequeResp, showApiLoader } = useAppSelector(({ feeApprovals, globalData }) => ({
    approvRejectChequeResp: feeApprovals.approvRejectChequeResp,
    showApiLoader: globalData.showApiLoader,
  }), shallowEqual);

  const deactivateAccountRespref = useRef({
    prevApprovRejectChequeResp: approvRejectChequeResp
  });
  useEffect(() => {
    const { prevApprovRejectChequeResp } = deactivateAccountRespref.current;
    if (approvRejectChequeResp && prevApprovRejectChequeResp !== approvRejectChequeResp) {
      toast.success("Cheque updated successfully.");
      props.toggle(true);
    }
    deactivateAccountRespref.current.prevApprovRejectChequeResp = approvRejectChequeResp;
  }, [approvRejectChequeResp]);

  const deactivateUserForm = useFormik({
    enableReinitialize: false,
    initialValues: initialValues,
    validationSchema,
    onSubmit: (values) => {
      const { chequeId } = props;
      const { isApprovedAction } = values || {}
      const params = {
        chequeId,
        status: isApprovedAction ? "APPROVED" : "REJECT"
      };
      let payload: any = {}
      if (isApprovedAction) {
        payload.startDate = values.startDate
      } else {
        payload.remarks = values.remarks
      }
      dispatch(approveRejectChequeAct(generateActionPayload( props.parentModule === "FEE" ? "approve_reject_cheque" : "special_fee_approve_reject_cheque" , params, payload)));
    },
  });

  useEffect(() => {
    deactivateUserForm.setFieldValue("isApprovedAction", props.isApprovedAction)
    return () => {
      deactivateUserForm.resetForm();
    }
  }, []);

  return (
    <>
      <form onSubmit={deactivateUserForm.handleSubmit}>
        <div className="tw-p-4">
          <div className="tw-flex tw-flex-col tw-items-center">
            <div className="tw-flex tw-mb-2">
              {deactivateUserForm.values.isApprovedAction ? (
                <ApproveIcon className="tw-h-[70px] tw-w-[70px] tw-fill-[#16A99A]" />
              ) : (
                <CancelIcon className="tw-h-[70px] tw-w-[70px]" />
              )}
            </div>

            <h5 className="tw-mb-2">Are you sure?</h5>

            <span className="tw-font-normal tw-mb-3 tw-text-center">
              {deactivateUserForm.values.isApprovedAction
                ? "You want to Approve this Cheque!."
                : "You want to Reject this Cheque!."}
            </span>

            {deactivateUserForm.values.isApprovedAction ? (
              <DateInput
                name="startDate"
                value={deactivateUserForm.values.startDate}
                onChange={deactivateUserForm.handleChange}
                formgroupClassName="tw-w-[70%]"
                invalid={(deactivateUserForm.touched.startDate && deactivateUserForm.errors.startDate) ? true : false}
                error={(deactivateUserForm.touched.startDate && deactivateUserForm.errors.startDate) ? deactivateUserForm.errors.startDate : ""}
              />
            ) : (
              <TextArea
                name="remarks"
                value={deactivateUserForm.values.remarks}
                onChange={deactivateUserForm.handleChange}
                inputClassName="tw-bg-gray-100 tw-w-full"
                formgroupClassName="tw-w-[70%]"
                invalid={(deactivateUserForm.touched.remarks && deactivateUserForm.errors.remarks) ? true : false}
                error={(deactivateUserForm.touched.remarks && deactivateUserForm.errors.remarks) ? deactivateUserForm.errors.remarks : ""}
              >
              </TextArea>)}
          </div>
        </div>

        <div className="tw-border-t tw-border-gray-200 tw-shadow-inner tw-p-4 tw-flex tw-justify-center">
          <div className="tw-flex tw-gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={props.toggle}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant={deactivateUserForm.values.isApprovedAction ? "primary" : "reject"}
              disabled={showApiLoader}
              
            >
              Confirm
            </Button>
          </div>
        </div>
      </form>
    </>
  );
};

export default ChequeHistoryAcceptModal;
