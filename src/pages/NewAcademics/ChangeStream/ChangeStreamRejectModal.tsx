import React, { useEffect, useState } from "react";
import {  Button, TextArea, TextIconInput } from "../../../Components/Common";
import { ChangeStreamConformationModalProps, ChangeStreamModalProps } from "./changeStreamTypes";
import { default as CancelIcon } from "../../../assets/imagesdps/academics/CancelIcon.svg?react";
import { approveRejectStreamChangeReq } from "../../../store/academic/classroomManagment/classroommanagmentactions";
import { generateActionPayload } from "../../../utility/reduxutility";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from 'yup'

const ChangeStreamRejectModal = (props: ChangeStreamConformationModalProps) => {
  const dispatch = useDispatch();
  // const submitHandler = () => {
  //   let payload = {
  //     changeRequestId: +props.requestId,
  //     status: "REJECT",
  //     remarks: remarks
  //   }
  //   dispatch(approveRejectStreamChangeReq(generateActionPayload('approve_reject_stream_change_req', undefined, payload)))
  // }
  const validationSchema = Yup.object().shape({
    remarks: Yup.string().required("Remarks are required."),
});
const initialValues = { remarks: "" };
  const rejectRequestForm = useFormik({
    enableReinitialize: false,
    initialValues: initialValues,
    validationSchema,
    onSubmit: (values) => {
      let payload = {
        changeRequestId: +props.requestId,
        status: "REJECT",
        remarks: values.remarks
      }
      dispatch(approveRejectStreamChangeReq(generateActionPayload('approve_reject_stream_change_req', undefined, payload)))
    },
});


useEffect(() => {
    if (!props.isOpen) {
      rejectRequestForm.resetForm();
    }
}, [props.isOpen]);
  return (
    <>
     
        <div className="tw-flex tw-flex-col tw-items-center tw-p-4">
          <div className="tw-flex tw-mb-3"><CancelIcon style={{ height: "70px", width: "70px" }} /></div>

          <h5 className="tw-flex-grow tw-mb-2">Are you sure?</h5>
          <span className="tw-flex-grow tw-font-normal tw-mb-3">
            You want to Reject Change Stream Request !
          </span>

          <TextArea
            name="remarks"
            value={rejectRequestForm.values.remarks}
            onChange={rejectRequestForm.handleChange}
            // isReadOnly={true}
            inputClassName="tw-bg-gray-100 tw-w-full"
            formgroupClassName="tw-w-72"
            invalid={(rejectRequestForm.touched.remarks && rejectRequestForm.errors.remarks) ? true : false}
            error={(rejectRequestForm.touched.remarks && rejectRequestForm.errors.remarks) ? rejectRequestForm.errors.remarks : ""}

          >
          </TextArea>
          <div className="tw-text-center tw-mt-4">
            <Button type="button" variant="secondary" onClick={props.toggle}>Cancel</Button>
            <Button type="submit" variant="reject" onClick={(event:any)=>rejectRequestForm.handleSubmit(event)}>Yes Reject</Button>
          </div>
        </div>
   
    </>
  );
};

export default ChangeStreamRejectModal;
