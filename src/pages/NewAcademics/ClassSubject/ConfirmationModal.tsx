import React from "react";
import { default as ConfirmationIcon } from "../../../assets/imagesdps/academics/confirmation-icon.svg?react";
import { ConfirmationModalProps } from "./classSubjectTypes";
import Button from "../../../Components/Common/Button";

const ConfirmationModal = (props: ConfirmationModalProps) => {

  return (
    <>
     
      <div className="tw-p-5">
        <div className="tw-flex tw-flex-col tw-items-center">
          <div className="tw-flex tw-mb-3"><ConfirmationIcon width={"70px"} height={"70px"} /></div>
          <h4 className="tw-mb-2 tw-text-lg tw-font-semibold">
            Are you sure?
          </h4>

          <h5 className="tw-font-normal tw-m-0 tw-text-gray-600">
            You want to delete a subject!
          </h5>

        </div>

        <div className="tw-flex tw-gap-2 tw-justify-center tw-mb-1 tw-mt-4">

          <Button
            type="button"
            variant="secondary"
            onClick={props.toggle}
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="reject"
            onClick={props.submitHandler}
            disabled={props.showApiLoader}
          >
            Yes Delete
          </Button>

        </div>

      </div>
     
    </>
  );
};

export default ConfirmationModal;
