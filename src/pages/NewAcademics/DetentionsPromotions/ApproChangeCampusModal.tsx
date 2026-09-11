import React from "react";
import { ModalContainer, TextIconInput } from "../../../Components/Common";
import { DetectionPromotionModalProps } from "./DetectionPromotionTypes";
import {default as ApproveSvg} from '../../../assets/imagesdps/academics/ApproveSvg.svg?react'

const ApproChangeCampusModal = (props: DetectionPromotionModalProps) => {
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
        modalHeaderClass="bg-transparent tw-pt-2"
        hideHeader
      >
        <div className="tw-flex tw-flex-col tw-items-center tw-text-center">

          <div className="tw-flex tw-mb-3">
            <ApproveSvg width="70" height="70" fill="#16A99A" />
          </div>

          <h4 className="tw-mb-2 tw-text-lg tw-font-semibold">
            Are you sure?
          </h4>

          <h5 className="tw-font-normal tw-m-0 tw-text-gray-600">
            You want to Approve Detention Promotion Request!
          </h5>

          {/* <TextIconInput
            name="remarks"
            value={"remarks"}
            onChange={""}
            isReadOnly={true}
            inputClassName="bg-light"
          >
            <i className="ri-pencil-line text-muted"></i>
          </TextIconInput> */}
        </div>
      </ModalContainer>
    </>
  );
};

export default ApproChangeCampusModal;
