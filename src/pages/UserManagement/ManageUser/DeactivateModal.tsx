import React from "react";
import { ModalContainer, TextIconInput } from "../../../Components/Common";
import { DeactivateModalProps } from "./ManageUserTypes";
import { default as ConfirmationIcon } from "../../../assets/imagesdps/academics/confirmation-icon.svg?react";

const DeactivateModal = (props: DeactivateModalProps) => {
  return (
    <>
      <ModalContainer
        id="deactivate-modal"
        modalTitle={props.modalTitle}
        isOpen={props.isOpen}
        toggle={props.toggle}
        submitHndlr={""}
        cancelHndlr={props.toggle}
        cancelTitle={"Cancel"}
        submitTitle={"Yes Deactivate !"}
        modalSize={"md"}
        submitButtonClass={"bg-danger text-white"}
        cancelBtnClass={"bg-soft-danger"}
        modalHeaderClass="bg-transparent pt-2"
        hideHeader={true}
      >
        <div className="tw-flex tw-flex-col tw-items-center tw-p-4">
          <div className="tw-flex tw-mb-4">
            <ConfirmationIcon className="tw-w-16 tw-h-16" />
          </div>
          <h4 className="tw-text-center tw-mb-2 tw-text-xl tw-font-bold">You want to Deactivate the Account?</h4>
          <h5 className="tw-text-center tw-font-normal tw-mb-6 tw-text-gray-500">
            User will no longer be able to login the system.
          </h5>

          <div className="tw-w-full">
            <TextIconInput
                name="remarks"
                value={"remarks"}
                onChange={""}
                isReadOnly={true}
                inputClassName="tw-bg-gray-50 tw-border-gray-200"
            >
                <i className="ri-pencil-line tw-text-gray-400"></i>
            </TextIconInput>
          </div>
        </div>
      </ModalContainer>
    </>
  );
};

export default DeactivateModal;
