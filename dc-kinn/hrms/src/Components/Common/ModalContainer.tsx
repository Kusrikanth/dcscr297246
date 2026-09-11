import React, { Children } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Form } from "reactstrap";
import classnames from "classnames";
import Button from "./Button";

interface IModalContainerProps {
  id: string;
  isOpen: boolean;
  toggle: any;
  modalSize?: string;
  modalTitle?: string;
  children?: React.ReactNode;
  cancelTitle?: string;
  cancelBtnClass?: string;
  submitTitle?: string;
  submitHndlr?: any;
  cancelHndlr?: any;
  hideFooter?: boolean;
  hideHeader?: boolean;
  hideCancleBtn?: boolean;
  hideSubmitBtn?: boolean;
  modalBodyClass?: string;
  modalHeaderClass?: string;
  modalFooterClass?: string;
  submitButtonClass?: string;
  footerClass?: string;
  isSubmitting?: boolean;
}

export const ModalContainer: React.FC<IModalContainerProps> = (props) => {
  return (
    <Modal
      id={props.id}
      isOpen={props.isOpen}
      toggle={props.toggle}
      centered
      size={props.modalSize || "xxl"}
      backdrop="static"
    >
      {!props.hideHeader && (
        <ModalHeader
          className={`${
            props.modalHeaderClass ? props.modalHeaderClass : "bg-light p-3"
          }`}
          toggle={props.toggle}
        >
          {props.modalTitle}
        </ModalHeader>
      )}
      <form onSubmit={props.submitHndlr}>
        <ModalBody className={props.modalBodyClass && props.modalBodyClass}>
          {props.children}
        </ModalBody>
        {props?.hideFooter !== true && (
          <ModalFooter
            className={props.modalFooterClass && props.modalFooterClass}
          >
            <div className="hstack tw-gap-2 tw-justify-end">
              {!props.hideCancleBtn && (
                <Button
                  type="button"
                  className={classnames(
                    props.cancelBtnClass
                  )}
                  variant="secondary"
                  onClick={props.cancelHndlr}
                  // disabled={props.isSubmitting||false}
                >
                  {props.cancelTitle || "Cancel"}
                </Button>
              )}

              {!props.hideSubmitBtn && (
                <Button
                  type="button"
                  className={`${
                    props?.submitButtonClass 
                  } `}
                  variant="primary"
                  onClick={props.submitHndlr}
                  disabled={props.isSubmitting || false}
                >
                  {props.submitTitle || "Submit"}
                </Button>
              )}
            </div>
          </ModalFooter>
        )}
      </form>
    </Modal>
  );
};

interface IModalComponent {
  id: string;
  formId?: string;
  isOpen: boolean;
  toggle: any;
  modalSize?: string;
  modalTitle?: string;
  children: React.ReactNode;
  cancelTitle?: string;
  cancelBtnClass?: string;
  submitTitle?: string;
  cancelHndlr?: any;
  hideFooter?: boolean;
  hideHeader?: boolean;
  hideCancleBtn?: boolean;
  modalBodyClass?: string;
}

export const ModalComponent: React.FC<IModalComponent> = (props) => {
  return (
    <Modal
      id={props.id}
      isOpen={props.isOpen}
      toggle={props.toggle}
      centered
      size={props.modalSize || "lg"}
      backdrop="static"
    >
      {!props.hideHeader && (
        <ModalHeader className="bg-light p-3" toggle={props.toggle}>
          {props.modalTitle}
        </ModalHeader>
      )}
      <ModalBody className={props.modalBodyClass && props.modalBodyClass}>
        {props.children}
      </ModalBody>
      {props?.hideFooter !== true && (
        <ModalFooter>
          <div className="hstack gap-2 justify-content-end">
            {!props.hideCancleBtn && (
              <button
                type="button"
                className={classnames(
                  "btn",
                  props.cancelBtnClass || "btn-light"
                )}
                onClick={props.cancelHndlr}
              >
                {props.cancelTitle || "Cancel"}
              </button>
            )}

            <button
              type="submit"
              form={props.formId}
              className="btn btn-success"
            >
              {props.submitTitle || "Submit"}
            </button>
          </div>
        </ModalFooter>
      )}
    </Modal>
  );
};

interface IModalContainerUpdated {
  id: string;
  isOpen: boolean;
  toggle: any;
  modalSize?: string;
  modalTitle?: string;
  children?: React.ReactNode;
  cancelTitle?: string;
  hideHeader?: boolean;
  headerClassName?: string;
  modaClassName?: string;
  customWidth?: string;
  modalSubtitle?:any;
  subTitleClassName?:string;
}

export const ModalContainerUpdated: React.FC<IModalContainerUpdated> = (
  props
) => {
  const customStyle = props.customWidth ? { maxWidth: props.customWidth } : {};

  return (
    <Modal
      id={props.id}
      isOpen={props.isOpen}
      toggle={props.toggle}
      centered
      size={props.modalSize || "lg"}
      backdrop="static"
      className={props.modaClassName}
      autoFocus={false}
      style={customStyle}
    >
      {!props.hideHeader && (
        <ModalHeader
          className={classnames("bg-light p-3", props.headerClassName)}
          toggle={props.toggle}
        >
          {props.modalTitle}
          {props.modalSubtitle && (
            props.modalSubtitle
          )}
        </ModalHeader>
      )}
      {props.children}
    </Modal>
  );
};
