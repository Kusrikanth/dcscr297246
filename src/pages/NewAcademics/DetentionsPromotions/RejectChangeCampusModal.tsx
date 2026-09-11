import React from "react";
import { ModalContainer, TextIconInput } from "../../../Components/Common";
import { DetectionPromotionModalProps } from "./DetectionPromotionTypes";
import { default as ConfirmationIcon } from "../../../assets/imagesdps/academics/confirmation-icon.svg?react";

const RejectChangeCampusModal = (props: DetectionPromotionModalProps) => {
  return (
    <>
      <ModalContainer
        id="appro-change-campus-modal"
        modalTitle={props.modalTitle}
        isOpen={props.isOpen}
        toggle={props.toggle}
        submitHndlr={props.submitHandler}
        cancelHndlr={props.toggle}
        cancelTitle={"Cancel"}
        submitTitle={"Yes Approve"}
        modalSize={"md"}
        hideHeader
      >
        <div className="tw-flex tw-flex-col tw-items-center">

          <div className="tw-flex tw-mb-3">
            <ConfirmationIcon />
          </div>

          <h4 className="tw-mb-3 tw-text-lg tw-font-semibold">
            Are you sure?
          </h4>

          <h5 className="tw-font-normal tw-mb-4 tw-text-gray-600 tw-text-center">
            You want to Reject Change Campus Request!
          </h5>

          <TextIconInput
            name="remarks"
            value={"remarks"}
            onChange={""}
            isReadOnly={true}
            inputClassName="tw-bg-gray-100"
          >
            <i className="ri-pencil-line tw-text-gray-400"></i>
          </TextIconInput>

        </div>
      </ModalContainer>
    </>
  );
};

export default RejectChangeCampusModal;
