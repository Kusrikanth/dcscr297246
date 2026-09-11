import React from "react";
import { default as ConfirmationSvg } from "../../../assets/imagesdps/academics/confirmation-icon.svg?react";
import { ModalContainer, TextIconInput } from "../../../Components/Common";
import { CampusTransferRequestModalProps } from "./CampusTransferRequestsTypes";

const CampusTransferRequestRejectModal = (
  props: CampusTransferRequestModalProps
) => {
  return (
    <>
      <ModalContainer
        id="change-campus-confirm-modal"
        modalTitle={props.modalTitle}
        isOpen={props.isOpen}
        toggle={props.toggle}
        submitHndlr={""}
        cancelHndlr={props.toggle}
        cancelTitle={"Cancel"}
        submitTitle={"Yes Approve"}
        modalSize={"md"}
        modalHeaderClass="bg-transparent pt-2"
        hideHeader={true}
      >
        <div className="tw-flex tw-flex-col tw-items-center">

          <div className="tw-flex tw-mb-4">
            <ConfirmationSvg className="tw-mr-2 tw-inline-block" />
          </div>

          <h4 className="tw-mb-3 tw-text-lg tw-font-semibold">
            Are you sure?
          </h4>

          <h5 className="tw-mb-5 tw-text-base tw-font-normal tw-text-gray-600 tw-text-center">
            You want to Reject Change Campus Request !
          </h5>

          <TextIconInput
            name="remarks"
            value={"remarks"}
            onChange={""}
            isReadOnly={true}
            inputClassName="tw-bg-gray-100"
          >
            <i className="ri-pencil-line tw-text-gray-500"></i>
          </TextIconInput>

        </div>
      </ModalContainer>
    </>
  );
};

export default CampusTransferRequestRejectModal;
