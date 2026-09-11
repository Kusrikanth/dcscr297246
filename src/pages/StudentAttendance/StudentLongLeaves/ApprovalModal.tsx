import React, { useEffect, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '../../../hooks/storehook';
import { shallowEqual } from 'react-redux';
import { useFormik } from 'formik';
import { TextIconInput, TextInput } from '../../../Components/Common';
import { generateActionPayload } from '../../../utility/reduxutility';
import { approveStuLongLeavesAct } from '../../../store/StudentAttendance/StudentLongLeaves/studentlongleavesaction';
import { toast } from 'react-toastify';
import { default as ConfirmationIcon } from "../../../assets/imagesdps/academics/confirmation-icon.svg?react";
import { default as ApproveSvg } from "../../../assets/imagesdps/academics/ApproveSvg.svg?react";
import * as Yup from 'yup';
import Button from '../../../Components/Common/Button';



const initialValues = {
    approvalRemarks : ""
}
const ApprovalModal = (props: any) => {
    
    const dispatch = useAppDispatch();
    const validationSchema = Yup.object().shape({
        approvalRemarks: Yup.string().required('Remarks is required')
      })

    const {
        showApiLoader
    } = useAppSelector(
        ({ globalData }) => ({
            showApiLoader: globalData.showApiLoader
        }),
        shallowEqual
    );

    const approvalFrom = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values) => {
            const { approvalRemarks } = values || {};
            const payload = {
                approvalRemarks,
                approvalStatus : props.modalInfo.approvalStatus
            }

         dispatch(approveStuLongLeavesAct(generateActionPayload("approve_reject_long_leaves", { id: props?.modalInfo.id }, payload)));
        }
    })
    
  return (
    <div className="tw-p-5">
      <div className="tw-flex tw-flex-col tw-items-center">
        {/* Icon */}
        <div className="tw-flex tw-mb-3">
          {props.modalInfo.approvalStatus === "APPROVED" ? (
            <ApproveSvg fill="#16A99A" height={"70px"} width={"70px"} />
          ) : (
            <ConfirmationIcon width={"70px"} height="70px" />
          )}
        </div>

        {/* Title */}
        <h5 className="tw-flex-grow tw-mb-2">Are you sure?</h5>

        {/* Message */}
        <span className="tw-flex-grow tw-font-normal tw-mb-3 tw-text-center">
          {`You want to ${props.modalInfo.approvalStatus === "APPROVED"
              ? "Approve"
              : props.modalInfo.approvalStatus === "REJECTED"
                ? "Reject"
                : "Cancel"
            } this long leaves !`}
        </span>

        {/* Remarks */}
        <TextIconInput
          name="approvalRemarks"
          value={approvalFrom.values.approvalRemarks}
          onChange={approvalFrom.handleChange}
          invalid={
            approvalFrom.touched.approvalRemarks &&
              approvalFrom.errors.approvalRemarks
              ? true
              : false
          }
          error={
            approvalFrom.touched.approvalRemarks &&
              approvalFrom.errors.approvalRemarks
              ? approvalFrom.errors.approvalRemarks
              : ""
          }
          inputClassName="tw-w-full"
          placeHolder="Remarks"
          formgroupClassName="tw-w-[70%]"
          maxLength={500}
        >
          <i className="ri-pencil-line tw-text-gray-500"></i>
        </TextIconInput>
      </div>

      {/* Actions */}
      <div className="tw-flex tw-gap-2 tw-justify-center tw-mt-4">
        <Button
          type="button"
          variant='secondary'
          onClick={props.toggleModal}
        >
          Cancel
        </Button>

        <Button
          variant={props.modalInfo.approvalStatus === "APPROVED" ? "primary" : "reject"}
          type="button"
          // className={`tw-px-4 tw-py-2 tw-rounded tw-text-white disabled:tw-opacity-50 ${props.modalInfo.approvalStatus === "APPROVED"
          //     ? "tw-bg-green-600"
          //     : "tw-bg-red-600"
          //   }`}
          onClick={(event: any) => approvalFrom.handleSubmit(event)}
          disabled={showApiLoader}
        >
          {props.modalInfo.approvalStatus === "APPROVED"
            ? "Yes Approve it !"
            : props.modalInfo.approvalStatus === "REJECTED"
              ? "Yes Reject it !"
              : "Yes Cancel it !"}
        </Button>
      </div>
    </div>

      

  )
}

export default ApprovalModal