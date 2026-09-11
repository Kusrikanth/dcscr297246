import { ModalContainer } from "../../../Components/Common";
import { ModalPropsType } from "./bonafideCertificateTypes";

const ApprovalStatusModal = (props: ModalPropsType) => {
  return (
    <div>
      <ModalContainer
        id="approval-status-modal"
        modalTitle={props.modalTitle}
        isOpen={props.isOpen}
        toggle={props.toggle}
        submitHndlr={""}
        cancelHndlr={props.toggle}
        cancelTitle={"No"}
        submitTitle={"Yes"}
        modalSize={"md"}
        hideFooter={true}
      >
        {/* <div className="d-inline-block w-100">
          <img
            src="https://tinyjpg.com/images/social/website.jpg"
            className="img-fluid w-100"
            alt="img"
            height={100}
          ></img>
        </div> */}
      </ModalContainer>
    </div>
  );
};

export default ApprovalStatusModal;
