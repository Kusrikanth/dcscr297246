import React, { useEffect } from "react";
import {  TextArea } from "../../../Components/Common";
import {  ConfirmationModalProps } from "./ChangeCurriculumTypes";
import { default as ApproveSvg } from '../../../assets/imagesdps/academics/ApproveSvg.svg?react'
import { useDispatch } from "react-redux";
import { approveRejectCurriculumChangeReq } from "../../../store/academic/classroomManagment/classroommanagmentactions";
import { generateActionPayload } from "../../../utility/reduxutility";
import * as Yup from 'yup';
import { useFormik } from "formik";
import Button from "../../../Components/Common/Button";


const ChangeCurriculumConfirmModal = (props: ConfirmationModalProps) => {
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
      dispatch(approveRejectCurriculumChangeReq(generateActionPayload('approve_reject_change_curriculum_req', undefined, payload)))
    },
  });
  useEffect(()=>{
    if(!props.isOpen){
      confirmRequestFrom.resetForm();
    }
  },[props.isOpen])

  return (
    <>

      <div className="tw-flex tw-flex-col tw-items-center tw-p-5">

        <div className="tw-flex tw-mb-3">
          <ApproveSvg
            style={{ height: "70px", width: "70px" }}
            fill="#16A99A"
          />
        </div>

        <h5 className="tw-flex-grow tw-mb-2 tw-text-lg tw-font-semibold tw-text-center">
          Are you sure?
        </h5>

        <span className="tw-flex-grow tw-mb-3 tw-font-normal tw-text-gray-600 tw-text-center">
          You want to Approve Change Curriculum Request !
        </span>

        <TextArea
          name="remarks"
          value={confirmRequestFrom.values.remarks}
          onChange={confirmRequestFrom.handleChange}
          inputClassName="tw-bg-gray-100 tw-w-full"
          formgroupClassName="tw-w-[70%]"
          invalid={(confirmRequestFrom.touched.remarks && confirmRequestFrom.errors.remarks) ? true : false}
            error={(confirmRequestFrom.touched.remarks && confirmRequestFrom.errors.remarks) ? confirmRequestFrom.errors.remarks : ""}

        />

        <div className="tw-flex tw-justify-center tw-gap-2 tw-mt-4">

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
            onClick={(event: any) =>
              confirmRequestFrom.handleSubmit(event)
            }
          >
            Yes Approve
          </Button>

        </div>
      </div>
    </>
  );
};

export default ChangeCurriculumConfirmModal;
