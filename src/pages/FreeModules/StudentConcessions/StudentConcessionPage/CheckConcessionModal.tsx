
import { default as ConfirmationIcon } from "../../../../assets/imagesdps/academics/confirmation-icon.svg?react";

const CheckConcessionModal = (props: any) => {

  return (
    <>
      
      <div  className="p-4 pt-0">

        <div className="d-flex flex-column align-items-center">

          <div className="d-flex mb-3"> <ConfirmationIcon width={"70px"} height="70px"/></div>
          <h5 className="flex-grow-1 mb-2">Warning</h5>
          <span className="flex-grow-1 fw-normal mb-3">
          Please level the concession amount according to the Terms
          </span>

        </div>
        <div className="hstack gap-2 justify-content-center">
           
           <button
             type="button"
             className={"btn btn-danger"}
             onClick={props.toggle}
           >
             Ok
           </button>
         
       </div>
            </div>
      
    </>
  );
};

export default CheckConcessionModal;
