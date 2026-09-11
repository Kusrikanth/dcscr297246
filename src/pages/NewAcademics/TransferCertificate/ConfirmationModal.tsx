import React from "react";
import { default as CancelIcon } from "../../../assets/imagesdps/academics/CancelIcon.svg?react";
import { ModalContainer } from "../../../Components/Common";
import { ModalPropsType } from "./transferCertificateTypes";
import Button from "../../../Components/Common/Button";

const ConfirmationModal = (props: ModalPropsType) => {

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

        <div className="tw-flex tw-justify-end tw-gap-2 tw-mt-4 tw-w-full">

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

export default ConfirmationModal;
