import React from "react";
import { Button, ModalContainer } from "../../Components/Common";
import { default as ConfirmationIcon } from "../../assets/imagesdps/academics/confirmation-icon.svg?react";
import { ConfirmationModalProps } from "./academicsTypes";
import { useAppSelector } from "../../hooks/storehook";
import { shallowEqual } from "react-redux";

const ConfirmationModal = (props: ConfirmationModalProps) => {
  const { showApiLoader } = useAppSelector(
    ({ globalData }) => ({
      showApiLoader:globalData.showApiLoader,

    }),
    shallowEqual
  );

  return (
    <>
    
      <div className="tw-p-5">

        <div className="tw-flex tw-flex-col tw-items-center">
          <div className="tw-flex tw-mb-3"><ConfirmationIcon width={"70px"} height="70px"/></div>
          <h5 className="tw-flex-grow tw-mb-2">Are you sure?</h5>
          <span className="tw-flex-grow tw-font-normal tw-m-0">
            {props.confirmationMessage}
          </span>
        </div>
        <div className="tw-flex tw-gap-2 tw-justify-center tw-py-3">
           
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
             onClick={(event:any)=>props.submitHandler(event)}
             disabled={showApiLoader}
           >
            {props.submitTxt?props.submitTxt:"Yes Delete"}
           </Button>
         
       </div>
      </div>
  
    </>
  );
};

export default ConfirmationModal;
