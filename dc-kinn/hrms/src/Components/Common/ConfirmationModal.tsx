import React, { Children } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Form } from "reactstrap";
import classnames from "classnames";
import { default as ApproveSvg } from "../../assets/imagesdps/academics/ApproveSvg.svg?react";
import { default as RejectSvg } from "../../assets/imagesdps/academics/confirmation-icon.svg?react";
import Button from "./Button";

interface IConfirmationModalProps {
    id: string,
    isOpen: boolean,
    confirmTitle?: string,
    confirmMessage?: string | React.ReactNode;
    noteMessage?: string | React.ReactNode;
    cancelHndlr: any,
    cancelBtnText?: string,
    confirmHndlr: any,
    showImgIcon?: boolean,
    iconType?: string,
    btnClassName?: string;
    confirmBtnText?: string,
    isDisble?: boolean
}


export const ConfirmationModal: React.FC<IConfirmationModalProps> = (props) => {
    return (
        <Modal id={props.id} isOpen={props.isOpen} toggle={props.cancelHndlr} centered={true}>
            <ModalBody className="!tw-p-4">
                <div className="!tw-mt-2 !tw-text-center">
                    <div className="fs-15">
                        {props?.iconType && <div className="!tw-flex !tw-mb-3 !tw-justify-center"> {props.iconType === "approve" ? <ApproveSvg fill="#0ab39c" width={"70px"} height="70px" /> : <RejectSvg fill="#f06548" width={"70px"} height="70px" />}</div>}
                        <h4>{props.confirmTitle || "Are you sure?"}</h4>
                        <p className="!tw-text-gray-500 !tw-mb-0">
                            {props.confirmMessage || "Are you sure you want to remove this record ?"}
                        </p>
                        <p className="!tw-text-[#f06548] !tw-mb-0 !tw-text-sm">
                            {props.noteMessage || ""}
                        </p>
                    </div>
                </div>
            </ModalBody>
            <ModalFooter className="!tw-flex !tw-gap-2 !tw-justify-center !tw-pb-4">
                <Button
                    type="button"
                    variant="secondary"
                    data-bs-dismiss="modal"
                    onClick={props.cancelHndlr}
                >
                    {props.cancelBtnText || "Cancel"}
                </Button>
                <Button
                    type="button"
                    variant="reject"
                    className={classnames(`tw-m-0`, props.btnClassName)}
                    id="delete-record"
                    onClick={props.confirmHndlr}
                    disabled={props.isDisble || false}
                >
                    {props.confirmBtnText || "Confirm"}
                </Button>
            </ModalFooter>
        </Modal>
    )

}