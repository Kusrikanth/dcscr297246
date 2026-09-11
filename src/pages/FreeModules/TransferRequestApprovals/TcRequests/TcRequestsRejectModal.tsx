import React from "react";
import { TextIconInput } from "../../../../Components/Common";
import { TransferRequestApprovalsModalsProps } from "../TransferRequestApprovalsTypes";
import { default as CancelIcon } from "../../../../assets/imagesdps/academics/CancelIcon.svg?react";
import Button from "../../../../Components/Common/Button";
const TcRequestsRejectModal = (props: any) => {
  return (
    <>

      <div className="tw-p-5">
        <div className="tw-flex tw-flex-col tw-items-center">
          <div className="tw-flex tw-mb-3">
            <CancelIcon className="tw-mr-2 tw-inline-block" />
          </div>

          <h4 className="tw-flex-grow tw-mb-3 tw-text-lg tw-font-semibold">
            Are you sure?
          </h4>

          <h5 className="tw-flex-grow tw-font-normal tw-mb-4 tw-text-gray-700">
            You want to Reject TC Request !
          </h5>

          <TextIconInput
            name="remarks"
            value={"Remarks"}
            onChange={""}
            isReadOnly={true}
            inputClassName="tw-bg-gray-100 tw-w-full"
            formgroupClassName="tw-w-[70%] md:tw-w-[50%]"
          >
            <i className="ri-pencil-line tw-text-gray-400"></i>
          </TextIconInput>
        </div>

        <div className="tw-flex tw-gap-2 tw-justify-center tw-mt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={props.toggle}
          >
            Cancel
          </Button>

          <Button
            variant="reject"
            type="button"
            onClick={undefined}
          // disabled={showApiLoader}
          >
            Yes Reject it!
          </Button>
        </div>
      </div>

    </>
  );
};

export default TcRequestsRejectModal;
