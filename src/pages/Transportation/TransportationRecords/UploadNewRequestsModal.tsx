import React from "react";
import UploadStudent from "../../../Components/Common/UploadStudent";
import { ModalTypeProps } from "./TransportationRecordsTypes";
import Button from "../../../Components/Common/Button";

const UploadNewRequestsModal = (props: ModalTypeProps) => {
  return (
    <>

      <div style={{ padding: "1.25rem" }}>

        <UploadStudent
          containerClass="tw-px-4 tw-py-3"
          uploadBtnText="Download Template"
        />

        <div className="tw-flex tw-justify-end tw-mt-4 tw-gap-3">

          <Button
            type="button"
            onClick={props.toggle}
            variant="secondary"
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="primary"
          >
            Proceed
          </Button>

        </div>

      </div>

    </>
  );
};

export default UploadNewRequestsModal;
