import React, { useEffect, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '../../../hooks/storehook';
import { shallowEqual } from 'react-redux';
import { useFormik } from 'formik';
import { TextIconInput, TextInput } from '../../../Components/Common';
import { generateActionPayload } from '../../../utility/reduxutility';
import { default as ConfirmationIcon } from "../../../assets/imagesdps/academics/confirmation-icon.svg?react";
import { default as ApproveSvg } from "../../../assets/imagesdps/academics/ApproveSvg.svg?react";
import * as Yup from 'yup';
import { approveStuLIdCardAct } from '../../../store/academic/notreportingstudents/notreportingstudentsactions';

const initialValues = {
  remarks: ""
}

const ApprovalModal = (props: any) => {

  const dispatch = useAppDispatch();
  const validationSchema = Yup.object().shape({
    remarks: Yup.string().required('Remarks is required')
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
      const { remarks } = values || {};
      const payload = {
        remarks,
        idCardStatus: props.modalInfo.idCardStatus
      }
      dispatch(approveStuLIdCardAct(generateActionPayload("approve_stu_id_card", { idCadrNo: props?.modalInfo.idCadrNo }, payload)));
    }
  })

  return (
    <>
      <div style={{ padding: "1.25rem" }}>
        <div className="d-flex flex-column align-items-center">
          <div className="d-flex mb-3">
            {props.modalInfo.idCardStatus === "PREPARED" || props.modalInfo.idCardStatus === "ISSUED" ? <ApproveSvg fill="#16A99A" height={"70px"} width={"70px"} /> : <ConfirmationIcon width={"70px"} height="70px" />}
          </div>
          <h5 className="flex-grow-1 mb-2">Are you sure?</h5>
          <span className="flex-grow-1 fw-normal mb-3">
            {`You want to ${props.modalInfo.idCardStatus === "PREPARED"
                ? "Prepare"
                : props.modalInfo.idCardStatus === "ISSUED"
                  ? "Issue"
                  : props.modalInfo.idCardStatus === "CANCELLED"
                    ? "Cancel"
                    : "perform an action on"
              } this ID Card!`}

          </span>
          <TextIconInput
            name="remarks"
            value={approvalFrom.values.remarks}
            onChange={approvalFrom.handleChange}
            invalid={(approvalFrom.touched.remarks && approvalFrom.errors.remarks) ? true : false}
            error={(approvalFrom.touched.remarks && approvalFrom.errors.remarks) ? approvalFrom.errors.remarks : ""}
            inputClassName="w-100"
            placeHolder="Remarks"
            formgroupClassName="w-70"
            maxLength={500}
          >
            <i className="ri-pencil-line text-muted"></i>
          </TextIconInput>
        </div>
        <div className="hstack gap-2 justify-content-center mt-4">
          <button
            type="button"
            className={"btn btn-light"}
            onClick={props.toggleModal}
          >
            Cancel
          </button>
          <button
            type="button"
            className={`btn ${props.modalInfo.idCardStatus === "PREPARED" || props.modalInfo.idCardStatus === "ISSUED" ? "btn btn-success" : "btn btn-danger"}`}
            onClick={(event: any) => approvalFrom.handleSubmit(event)}
            disabled={showApiLoader}
          >
            {props.modalInfo.idCardStatus === "PREPARED" ? "Yes Prepare it !" : props.modalInfo.idCardStatus === "ISSUED" ? "Yes Issue it !" : props.modalInfo.idCardStatus === "CANCELLED" ? "Yes Cancel it !" : "Yes Cancel it !"}
          </button>
        </div>
      </div>
    </>
  )
}

export default ApprovalModal