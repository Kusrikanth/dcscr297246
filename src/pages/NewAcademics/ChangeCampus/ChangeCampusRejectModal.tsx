import React from "react";
import { TextIconInput } from "../../../Components/Common";
import { ChangeCampusModalProps } from "./changeCampusTypes";
import { default as ConfirmationIcon } from "../../../assets/imagesdps/academics/confirmation-icon.svg?react";
import Button from "../../../Components/Common/Button";

const ChangeCampusRejectModal = (props: ChangeCampusModalProps) => {
  return (
    <>

      <div className="tw-p-5">

        <div className="tw-flex tw-flex-col tw-items-center">

          <div className="tw-flex tw-mb-3">
            <ConfirmationIcon />
          </div>

          <h4 className="tw-flex-grow tw-mb-3 tw-text-xl tw-font-semibold tw-text-center">
            Are you sure?
          </h4>

          <h5 className="tw-flex-grow tw-mb-4 tw-font-normal tw-text-gray-600 tw-text-center">
            You want to Reject Change Campus Request !
          </h5>

          <div className="tw-relative tw-w-full">
            <TextIconInput
              name="remarks"
              value={"remarks"}
              onChange={() => {}}
              isReadOnly={true}
              inputClassName="tw-bg-gray-100 tw-pl-10"
              formgroupClassName="tw-mb-0"
            >
              <i className="ri-pencil-line tw-text-gray-400"></i>
            </TextIconInput>
          </div>

        </div>

        <div className="tw-flex tw-justify-end tw-gap-2 tw-mt-3">

          <Button
            type="button"
            variant="secondary"
            onClick={props.toggle}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={() => { }}
            variant="reject"
          >
            Yes Reject
          </Button>
        </div>

      </div>
   
    </>
  );
};

export default ChangeCampusRejectModal;
