
import { default as ConfirmationIcon } from "../../../../../assets/imagesdps/academics/confirmation-icon.svg?react";
import Button from "../../../../../Components/Common/Button";

const CheckConcessionModal = (props: any) => {

  return (
    <>
      
      <div className="tw-p-4 tw-pt-0">
        <div className="tw-flex tw-flex-col tw-items-center">
          <div className="tw-flex tw-mb-3">
            <ConfirmationIcon width={"70px"} height="70px" />
          </div>

          <h5 className="tw-mb-2 tw-font-semibold">
            Warning
          </h5>

          <span className="tw-mb-3 tw-font-normal tw-text-center">
            Please level the concession amount according to the Terms
          </span>
        </div>
        <div className="tw-flex tw-gap-2 tw-justify-center">
           <Button
             type="button"
             variant="reject"
             onClick={props.toggle}
           >
             Ok
           </Button>
         
       </div>
            </div>
      
    </>
  );
};

export default CheckConcessionModal;
