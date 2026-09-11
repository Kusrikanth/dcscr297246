import React from "react";
import { ModalContainer, StatusLabel } from "../../../Components/Common";
import { Card, CardBody, Col, Container, Row, CardHeader } from "reactstrap";
import { ModalPropsType } from "./bonafideCertificateTypes";

const ApprovalStatusBatchModal = (props: ModalPropsType) => {
  return (
    <>
      <ModalContainer
        id="approval-status-batch-modal"
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
        <Row>
          <Col xs={6}>
            <h5 className="tw-flex-grow tw-mb-4">Department</h5>
            <h5 className="tw-flex-grow fw-normal tw-mb-4">Accounts</h5>
            <h5 className="tw-flex-grow fw-normal tw-mb-4">Library</h5>
          </Col>
          <Col xs={6}>
            <div className="tw-flex tw-flex-col tw-items-end">
              <h5 className="tw-flex-grow tw-mb-4">Status</h5>

              <div className="tw-inline-block tw-mb-4">
                <StatusLabel type={"approved"} labelName={"approved"} />
              </div>
              <div className="tw-inline-block tw-mb-4">
                <StatusLabel type={"approved"} labelName={"approved"} />
              </div>
            </div>
          </Col>
        </Row>
      </ModalContainer>
    </>
  );
};

export default ApprovalStatusBatchModal;
