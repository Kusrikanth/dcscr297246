import React, { useEffect } from "react";
import {  TextIconInput } from "../../../Components/Common";
import { ItFromApprovalModalsProps } from "./ItFormApprovalsTypes";
import { default as AllowSvg } from "../../../assets/imagesdps/academics/AllowSvg.svg?react";
import { default as CancelIcon } from "../../../assets/imagesdps/academics/CancelIcon.svg?react";
import { useDispatch } from "react-redux";
import { approveRejectItFormAct } from "../../../store/fee/feeapprovals/feeapprovalactions";
import { generateActionPayload } from "../../../utility/reduxutility";
import { useFormik } from "formik";
import * as Yup from 'yup';
import Button from "../../../Components/Common/Button";

const initialValue: any = {
  remarks: ""
}

const ItFromApprovalRejectModals = (props: ItFromApprovalModalsProps) => {


  const dispatch = useDispatch();
  const validationSchema = Yup.object().shape({
    remarks: Yup.string().required('Remarks is required')
  })
  const ITFormApprovalForm = useFormik({
    enableReinitialize: true,
    initialValues: initialValue,
    validationSchema,
    onSubmit: (values) => {
      let payload = { itFormId: props.itFormId, approvedStatus: props.actionName, remarks: values.remarks }
      dispatch(approveRejectItFormAct(generateActionPayload('approve_reject_it_form', undefined, payload)))
    },
  });

  useEffect(() => {
    if (!props.isOpen) {
      ITFormApprovalForm.resetForm();
    }
  }, [props.isOpen])
  
  return (
    <>
      <div style={{ padding: "1.25rem" }}>

        <div className="tw-flex tw-flex-col tw-items-center tw-text-center">

          <div className="tw-flex tw-mb-3">
            {props.actionName === "APPROVED" ? (
              <AllowSvg
                className="tw-inline-block"
                width="70px"
                height="70px"
              />
            ) : (
              <CancelIcon
                width="70px"
                height="70px"
              />
            )}
          </div>

          <h4 className="tw-text-lg tw-font-semibold tw-mb-3">
            Are you sure?
          </h4>

          <h5 className="tw-text-sm tw-font-normal tw-mb-4 tw-text-gray-600">
            {props.modalText}
          </h5>

          <div className="tw-w-full tw-max-w-md">
            <TextIconInput
              name="remarks"
              value={ITFormApprovalForm.values.remarks}
              onChange={ITFormApprovalForm.handleChange}
              invalid={
                ITFormApprovalForm.touched.remarks &&
                  ITFormApprovalForm.errors.remarks
                  ? true
                  : false
              }
              error={
                ITFormApprovalForm.touched.remarks &&
                  ITFormApprovalForm.errors.remarks
                  ? ITFormApprovalForm.errors.remarks
                  : ""
              }
              inputClassName="tw-w-full"
              formgroupClassName="tw-w-full"
            >
              <i className="ri-pencil-line tw-text-gray-400"></i>
            </TextIconInput>
          </div>

        </div>

        <div className="tw-flex tw-gap-3 tw-justify-center tw-mt-4">

          <Button
            type="button"
            variant="secondary"
            onClick={props.cancelHandler || props.toggle}
          >
            Cancel
          </Button>

          <Button
            type="button"
            onClick={(event: any) => ITFormApprovalForm.handleSubmit(event)}
            disabled={props.showApiLoader}
            
              variant={props.actionName === "APPROVED" ? "primary" : "reject"}
          >
            {props.submitText}
          </Button>

        </div>

      </div>
    </>
  );
};

export default ItFromApprovalRejectModals;
