import React, { useEffect, useState } from "react";
import {  TextIconInput } from "../../../Components/Common";
import { default as ConfirmationIcon } from "../../../assets/imagesdps/academics/confirmation-icon.svg?react";
import { ConfirmationModalProps } from "./assignGroupTypes";
import { default as ApproveSvg } from "../../../assets/imagesdps/academics/ApproveSvg.svg?react";

import { useDispatch } from "react-redux";
import * as Yup from 'yup';
import { useFormik } from "formik";
import { generateActionPayload } from "../../../utility/reduxutility";
import { approveFeeCashFormAct } from "../../../store/fee/feeapprovals/feeapprovalactions";
import Button from "../../../Components/Common/Button";

const initialValue: any = {
  remarks: ""
}

const ConfirmationModal = (props: ConfirmationModalProps) => {

const {actionStatus,actionId , isOpen} = props;
const dispatch = useDispatch();
const [initialValues, setInitialValues] = useState<any>(initialValue)
const validationSchema = Yup.object().shape({
  remarks: Yup.string().required('Remarks is required')
})
const CashApprovalForm = useFormik({
  initialValues,
  validationSchema,
  enableReinitialize: true,
  onSubmit: (values) => {
    
    dispatch(approveFeeCashFormAct(generateActionPayload('approve_fee_cash_payments', { actionId: actionId ,actionStatus : actionStatus ,remarks : values.remarks})))
  },
});
    
  useEffect(() => {
    
    if(!isOpen){
      setInitialValues(initialValue)
      CashApprovalForm.resetForm();
    }
  }, [isOpen])
    
  return (
    <>
      
      <div className="tw-p-5">
        <div className="tw-flex tw-flex-col tw-items-center">
          <div className="tw-mb-3">
            {actionStatus === "APPROVED" ? (
              <ApproveSvg fill="#16A99A" height="70px" width="70px" />
            ) : (
              <ConfirmationIcon width="70px" height="70px" />
            )}
          </div>

          <h5 className="tw-mb-2 tw-text-lg tw-font-semibold">Are you sure?</h5>

          <span className="tw-mb-3 tw-text-base tw-font-normal text-center">
            {`You want to ${actionStatus === "APPROVED" ? "Approve" : "Reject"} this Cash Payment!`}
          </span>

          <TextIconInput
            name="remarks"
            value={CashApprovalForm.values.remarks}
            onChange={CashApprovalForm.handleChange}
            invalid={CashApprovalForm.touched.remarks && CashApprovalForm.errors.remarks ? true : false}
            error={CashApprovalForm.touched.remarks && CashApprovalForm.errors.remarks ? CashApprovalForm.errors.remarks : ""}
            inputClassName="tw-w-full"
            placeHolder="Remarks"
            formgroupClassName="tw-w-4/5"
          >
            <i className="ri-pencil-line tw-text-gray-400"></i>
          </TextIconInput>
        </div>

        <div className="tw-flex tw-gap-2 tw-justify-center tw-mt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={props.toggle}
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant={actionStatus === "APPROVED" ? "primary" : "reject"}
            onClick={(event: any) => CashApprovalForm.handleSubmit(event)}
            disabled={props.showApiLoader}
          >
            {actionStatus === "APPROVED" ? "Yes Approve it !" : "Yes Reject it !"}
          </Button>
        </div>
      </div>

      
    </>
  );
};

export default ConfirmationModal;
