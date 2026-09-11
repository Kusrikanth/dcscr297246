import React from "react";
import { default as CancelIcon } from "../../../assets/imagesdps/academics/CancelIcon.svg?react";
import { ModalContainer } from "../../../Components/Common";

interface ModalPropsType {
  isOpen: boolean;
  toggle: any;
  showApiLoader?: any;
  submitHandler?: any;
  confirmationMessage?: any;
  cancelHandler?: any;
  submitTitle?: any;
  cancleTitle?: any;
}
const ConfirmationModal = (props: ModalPropsType) => {

  return (
    <>
        <div className="d-flex flex-column align-items-center" style={{padding:"1.25rem"}}>
          <div className="d-flex mb-3">
            <CancelIcon width={'70px'} height={'70px'}/>
          </div>
          <h5 className="flex-grow-1 mb-3">Confirmation !</h5>
          <h6 className="flex-grow-1 fw-normal">
            {props.confirmationMessage}
          </h6> 
          <div className="hstack gap-2 justify-content-end mb-1 mt-4">
           
           <button
             type="button"
             className={"btn btn-light"}
             onClick={props.cancelHandler||props.toggle}
           >
             {props.cancleTitle||"No"}
           </button>
         
           <button
             type="button"
             className={`btn btn-success
                `}
             onClick={props.submitHandler}
             disabled={props.showApiLoader}
           >
             {props.submitTitle||"Yes"}
           </button>
         
       </div>
        </div>
     
    </>
  );
};

export default ConfirmationModal;
