import React, { useEffect } from "react";
import { default as CancelIcon } from "../../../assets/imagesdps/academics/CancelIcon.svg?react";
import { ModalContainer } from "../../../Components/Common";
import { ModalPropsType } from "./transferCertificateTypes";
import { useAppDispatch } from "../../../hooks/storehook";
import { getTcApprovalStatus } from "../../../store/academic/classroomManagment/classroommanagmentactions";
import { generateActionPayload } from "../../../utility/reduxutility";
import Button from "../../../Components/Common/Button";

const DepartmentConfirmationModal = (props: any) => {

  const dispatch = useAppDispatch();

  useEffect(() => {
          if (props.tcId&&props.isOpen) {
              dispatch(getTcApprovalStatus(generateActionPayload('tc_approval_list', { tcRequestId: props.tcId })))
          }
      }, [props.isOpen])

  return (
    <>
      <div className="tw-flex tw-flex-col tw-items-center tw-p-5">

        <div className="tw-flex tw-mb-3">
          <CancelIcon width={'70px'} height={'70px'} />
        </div>

        <h5 className="tw-mb-3 tw-text-lg tw-font-semibold tw-text-center">
          Confirmation !
        </h5>

        <h6 className="tw-font-normal tw-text-center">
          {props.confirmationMessage}
        </h6>

        <div className="tw-flex tw-gap-2 tw-justify-center tw-mt-4">

          <Button
            type="button"
            variant="secondary"
            onClick={props.cancelHandler || props.toggle}
          >
            {props.cancleTitle || "No"}
          </Button>

          <Button
            type="button"
            variant="primary"
            onClick={props.submitHandler}
            disabled={props.showApiLoader}
          >
            {props.submitTitle || "Yes"}
          </Button>

        </div>
      </div>

     
    </>
  );
};

export default DepartmentConfirmationModal;
