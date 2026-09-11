import React, { useState } from "react";
import { default as CancelIcon } from "../../../assets/imagesdps/academics/CancelIcon.svg?react";
import { TextArea } from "../../../Components/Common";
import { ModalPropsType } from "../BonafideCertificate/bonafideCertificateTypes";
import Button from "../../../Components/Common/Button";

const CancelModal = (props: ModalPropsType) => {
  const [remarksState, setRemarksState] = useState('');

  function onChangeHandler(event: React.ChangeEvent<HTMLInputElement>) {
    const { value } = event.target;
    setRemarksState(value)
  }

  function confirmCancelHandler() {
    props.submitHandler(remarksState);
  }
  return (
    <>
      <div className="tw-p-4">
        <div className="tw-flex tw-flex-col tw-items-center tw-mt-2 tw-text-[15px]">

          <div className="tw-flex tw-mb-3">
            <CancelIcon width={'70px'} height={'70px'} />
          </div>

          <h4 className="tw-mb-2 tw-text-lg tw-font-semibold">
            Cancel TC Request !
          </h4>

          <p className="tw-font-normal tw-m-0 tw-mb-2 tw-text-center">
            Do you want to Cancel Transfer Certificate Request ?
          </p>

          <TextArea
            name="reason"
            placeHolder="Remarks"
            value={remarksState}
            onChange={onChangeHandler}
            inputClassName="tw-bg-gray-100 tw-w-full tw-rounded tw-p-2"
            formgroupClassName="tw-w-4/5"
          />
        </div>
      </div>

      <div className="tw-flex tw-justify-center tw-gap-2 tw-pb-4">
        <Button
          type="button"
          variant="secondary"
          onClick={props.toggle}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          variant="primary"
          onClick={confirmCancelHandler}
        >
          Confirm
        </Button>
      </div>
    </>
  );
};

export default CancelModal;
