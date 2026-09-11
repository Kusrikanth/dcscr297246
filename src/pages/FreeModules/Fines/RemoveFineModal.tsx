import React from "react";
import { default as CancelIcon } from "../../../assets/imagesdps/academics/CancelIcon.svg?react";
import { ModalContainer, TextIconInput } from "../../../Components/Common";
import { RemoveFineModalProps } from "./FinesType";

const RemoveFineModal = (props: RemoveFineModalProps) => {
  return (
    <>
      <ModalContainer
        id="change-stream-confirm-modal"
        modalTitle={props.modalTitle}
        isOpen={props.isOpen}
        toggle={props.toggle}
        submitHndlr={""}
        cancelHndlr={props.toggle}
        cancelTitle={"Cancel"}
        submitTitle={"Yes Delete it !"}
        modalSize={"md"}
      >
        <div className="d-flex flex-column align-items-center">
          <div className="d-flex mb-3">
            <CancelIcon />
          </div>
          <h4 className="flex-grow-1 mb-3">Are you sure?</h4>
          <h5 className="flex-grow-1 fw-normal mb-4">
            You want Delete this Record !
          </h5>

          <TextIconInput
            name="remarks"
            value={"Remarks"}
            onChange={""}
            isReadOnly={true}
            inputClassName="bg-light"
          >
            <i className="ri-pencil-line text-muted"></i>
          </TextIconInput>
        </div>
      </ModalContainer>
    </>
  );
};

export default RemoveFineModal;
