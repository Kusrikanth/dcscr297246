import React, { useRef, useEffect, } from "react";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import * as Yup from "yup";
import classnames from "classnames";
import {
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

const validationSchema = Yup.object().shape({
  remarks: Yup.string().required("Remarks are required."),
});


const initialValues = { remarks: "", chequeAcceptanceDate: "" };
const ChequeHistoryAcceptModal = (props: any) => {
  const dispatch = useAppDispatch();

  const { approvRejectChequeResp , showApiLoader } = useAppSelector(({ feeApprovals,globalData }) => ({
    approvRejectChequeResp: feeApprovals.approvRejectChequeResp,
    showApiLoader:globalData.showApiLoader,
  }), shallowEqual);

  const deactivateAccountRespref = useRef<any>({
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
      const { chequeId, isApprovedAction } = props;
      const params = {
        chequeId,
        status: isApprovedAction ? "APPROVED" : "REJECT",
        remarks : values.remarks
      };
      dispatch(approveRejectChequeAct(generateActionPayload("hostel_approve_reject_cheque", params)));
    },
  });


  useEffect(() => {
    if (!props.isOpen) {
      deactivateUserForm.resetForm();
    }
  }, [props.isOpen]);


  const { isApprovedAction } = props;
  return (
    <>
      <form onSubmit={deactivateUserForm.handleSubmit}>
        {/* Body */}
        <div className="tw-p-6">
          <div className="tw-flex tw-flex-col tw-items-center">
            <div className="tw-flex tw-mb-2">
              {isApprovedAction ? (
                <ApproveIcon
                  className="tw-h-[70px] tw-w-[70px]"
                  style={{ fill: "#16A99A" }}
                />
              ) : (
                <CancelIcon className="tw-h-[70px] tw-w-[70px]" />
              )}
            </div>

            <h5 className="tw-mb-2 tw-text-lg tw-font-semibold">
              Are you sure?
            </h5>

            <span className="tw-mb-3 tw-text-sm tw-font-normal tw-text-gray-600">
              {isApprovedAction
                ? "You want to Approve this Cheque!."
                : "You want to Reject this Cheque!."}
            </span>

           <TextArea
              name="remarks"
              // labelText="Remarks"
              labelClass="required"
              value={deactivateUserForm.values.remarks}
              onChange={deactivateUserForm.handleChange}
              // isReadOnly={true}
              inputClassName="tw-bg-gray-100 tw-w-full"
              formgroupClassName="tw-w-[70%]"
              invalid={(deactivateUserForm.touched.remarks && deactivateUserForm.errors.remarks) ? true : false}
              error={(deactivateUserForm.touched.remarks && deactivateUserForm.errors.remarks) ? deactivateUserForm.errors.remarks : ""}
            >
            </TextArea>


          </div>
        </div>

        <div className="tw-border-t tw-shadow-sm tw-flex tw-justify-center tw-p-4">
          <div className="tw-flex tw-gap-2">
            <Button
              type="button"
              onClick={props.toggle}
              variant="secondary"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={showApiLoader}
              variant={isApprovedAction ? "primary" : "reject"}
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
