import React, { useEffect, useState } from "react";
import {  TextArea, TextIconInput } from "../../../Components/Common";
import { ChangeStreamConformationModalProps, ChangeStreamModalProps } from "./changeStreamTypes";
import {default as ApproveSvg} from '../../../assets/imagesdps/academics/ApproveSvg.svg?react'
import { approveRejectStreamChangeReq } from "../../../store/academic/classroomManagment/classroommanagmentactions";
import { generateActionPayload } from "../../../utility/reduxutility";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from 'yup'
import Button from "../../../Components/Common/Button";

const ChangeStreamConfirmModal = (props: ChangeStreamConformationModalProps) => {
  const dispatch = useDispatch();
  const validationSchema = Yup.object().shape({
    remarks: Yup.string().required("Remarks are required."),
});
const initialValues = { remarks: "" };
  const confirmRequestFrom = useFormik({
    enableReinitialize: false,
    initialValues: initialValues,
    validationSchema,
    onSubmit: (values) => {
      let payload = {
        changeRequestId: +props.requestId,
        status: "APPROVE",
        remarks: values.remarks
      }
      dispatch(approveRejectStreamChangeReq(generateActionPayload('approve_reject_stream_change_req', undefined, payload)))
    },
});


useEffect(() => {
    if (!props.isOpen) {
      confirmRequestFrom.resetForm();
    }
}, [props.isOpen]);
  return (
    <>

      <div className="tw-flex tw-flex-col tw-items-center tw-p-6">

        <div className="tw-flex tw-mb-3">
          <ApproveSvg className="tw-h-[70px] tw-w-[70px]" fill="#16A99A" />
        </div>

        <h5 className="tw-mb-2 tw-text-lg tw-font-semibold tw-text-center">
          Are you sure?
        </h5>

        <span className="tw-mb-3 tw-text-sm tw-font-normal tw-text-center tw-text-gray-600">
          You want to Approve Change Stream Request !
        </span>

        <TextArea
          name="remarks"
          value={confirmRequestFrom.values.remarks}
          onChange={confirmRequestFrom.handleChange}
          inputClassName="tw-bg-gray-100 tw-w-full"
          formgroupClassName="tw-w-full tw-max-w-md"
          invalid={
            confirmRequestFrom.touched.remarks &&
              confirmRequestFrom.errors.remarks
              ? true
              : false
          }
          error={
            confirmRequestFrom.touched.remarks &&
              confirmRequestFrom.errors.remarks
              ? confirmRequestFrom.errors.remarks
              : ""
          }
        />

        <div className="tw-flex tw-justify-center tw-gap-3 tw-mt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={props.toggle}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="primary"
            onClick={(event: any) => confirmRequestFrom.handleSubmit(event)}
          >
            Yes Approve
          </Button>
        </div>

      </div>
    </>
  );
};

export default ChangeStreamConfirmModal;
