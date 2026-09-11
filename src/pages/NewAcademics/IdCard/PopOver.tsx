import React, { useEffect, useMemo, useRef, useState } from 'react'
import { shallowEqual, useDispatch } from 'react-redux';
import { Popover, PopoverBody, PopoverHeader } from 'reactstrap'
import { generateActionPayload } from '../../../utility/reduxutility';
import { parentCollectedStatus } from '../../../store/academic/classroomManagment/classroommanagmentactions';
import { ModalContainerUpdated } from '../../../Components/Common';
import ConfirmationModal from './ConfirmationModal';
import { getDateWithTimeFormat, getDdMmYyyyWithMonthNameFormat } from '../../../utility/dateutility';
import { idCardCollectedByParentAct } from '../../../store/academic/notreportingstudents/notreportingstudentsactions';
import { useAppSelector } from '../../../hooks/storehook';
import { toast } from 'react-toastify';
import { useModal } from '../../../hooks/modalhook';

const fontColor = (action: any) => {
    let act = action && action.toLowerCase();
    switch (act) {
        case "yet_to_prepare":
        case "pending":
            return "#F7B84B"
        case "prepared":
        case "approved":
            return "#0AB39C"
        case "issued":
            return "#299CDB"
        case "cancelled":
            return "#f06548"
    }
}

const PopOver = (props: any) => {
    const dispatch = useDispatch();
    const { modalState: collectedStatusModalState, closeModal: closeCollectedStatusHndlr, openModal: openCollectedStatusHndlr } = useModal();

    const certificateCollectedHandler = (event: any) => {
        const params = { idCadrNo: props.id, tcParentCollectedStatus: "Yes" }
        dispatch(idCardCollectedByParentAct(generateActionPayload('id_card_collected_by_parent', { ...params })))
    }
    const certificateNotCollectedHandler = (event: any) => {
        const params = { idCadrNo: props.id, tcParentCollectedStatus: "No" }

        dispatch(idCardCollectedByParentAct(generateActionPayload('id_card_collected_by_parent', { ...params })))
    }

    const {
        idCardCollectedByParentResp,
    } = useAppSelector(
        ({ notReportingStu }) => ({
            idCardCollectedByParentResp: notReportingStu.idCardCollectedByParentResp,
        }),
        shallowEqual
    );

    const stuIdCardRef = useRef({
        prevIdCardCollectedByParentResp: idCardCollectedByParentResp,
    });

    return (<>
        <div>
            <Popover
                flip
                target={`testing-${props.id}`}
                toggle={props.toggle}
                isOpen={props.popOver}
            >
                <PopoverHeader>
                </PopoverHeader>
                <PopoverBody className='p-0'>
                    <table>
                        <tr className='bg-light'>
                            <th className='p-2'>ID Status</th>
                            <th className='p-2' style={{ color: fontColor(props?.idCardStatus) }}>{props?.idCardStatus}</th>
                        </tr>
                        {(props?.idCardStatus === "ISSUED" ||
                            props?.idCardStatus === "YET_TO_PREPARE" ||
                            props?.idCardStatus === "PREPARED" ||
                            props?.idCardStatus === "CANCELLED") && (
                                <tr>
                                    <td className="p-2">ID Application Date :</td>
                                    <td className="p-2">
                                        {props?.data?.idCardApplicationDate
                                            ? getDdMmYyyyWithMonthNameFormat(props.data?.idCardApplicationDate)
                                            : "N/A"}
                                    </td>
                                </tr>
                            )}

                        {(props?.idCardStatus === "ISSUED" || props?.idCardStatus === "YET_TO_PREPARE" || props?.idCardStatus === "PREPARED") && (
                            <tr>
                                <td className="p-2">Payment Date :</td>
                                <td className="p-2" style={{ color: fontColor(props?.data?.departmentApprovalStatus) }}>
                                    {props?.data?.idCardPaymentDate
                                        ? getDdMmYyyyWithMonthNameFormat(props.data?.idCardPaymentDate)
                                        : "N/A"}
                                </td>
                            </tr>
                        )}

                        {(props?.idCardStatus === "ISSUED" || props?.idCardStatus === "PREPARED") && (
                            <tr>
                                <td className="p-2">ID Card Preparation :</td>
                                <td className="p-2" style={{ color: fontColor(props?.data?.tcPreparationStatus) }}>
                                    {props?.data?.idCardPreparationDate
                                        ? getDdMmYyyyWithMonthNameFormat(props.data?.idCardPreparationDate)
                                        : "N/A"}
                                </td>
                            </tr>
                        )}

                        {props?.idCardStatus === "ISSUED" && (
                            <>
                                <tr>
                                    <td className="p-2">ID Card Issuance :</td>
                                    <td className="p-2" style={{ color: fontColor(props?.data?.idCardIssuanceDate) }}>
                                        {props?.data?.idCardIssuanceDate
                                            ? getDdMmYyyyWithMonthNameFormat(props.data?.idCardIssuanceDate)
                                            : "N/A"}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="p-2">Parent Collected Date :</td>
                                    <td className="p-2" style={{ color: fontColor(props?.data?.parentCollectedDate) }}>
                                        {props?.data?.parentCollectedDate
                                            ? getDdMmYyyyWithMonthNameFormat(props.data?.parentCollectedDate)
                                            : "N/A"}
                                    </td>
                                </tr>
                            </>
                        )}

                        {props?.idCardStatus === "CANCELLED" && (
                            <tr>
                                <td className="p-2">Cancelled Date :</td>
                                <td className="p-2">
                                    {props?.data?.idCardCancelledDate
                                        ? getDdMmYyyyWithMonthNameFormat(props.data?.idCardCancelledDate)
                                        : "N/A"}
                                </td>
                            </tr>
                        )}
                        {props?.idCardStatus === "ISSUED" && (
                            <tr>
                                <td className="p-2">Parent Collected :</td>
                                <td
                                    className={`p-2 ${props?.data?.parentCollectedStatus !== "Yes"
                                        ? "text-info text-decoration-underline cursor-pointer"
                                        : ""
                                        }`}
                                    onClick={
                                        props?.data?.parentCollectedStatus !== "Yes"
                                            ? openCollectedStatusHndlr
                                            : undefined
                                    }
                                >
                                    {props?.data?.parentCollectedStatus !== "Yes" ? "Update here" : props?.data?.parentCollectedStatus}
                                </td>
                            </tr>
                        )}
                    </table>
                </PopoverBody>
            </Popover>
        </div>
        <ModalContainerUpdated
            id="sms-confirmation-modal"
            isOpen={collectedStatusModalState.showModal}
            toggle={closeCollectedStatusHndlr}
            modalTitle=""
            modalSize="md"
        >
            <ConfirmationModal
                isOpen={collectedStatusModalState.showModal}
                toggle={closeCollectedStatusHndlr}
                submitTitle={"Collected"}
                cancleTitle={"Not Collected"}
                submitHandler={certificateCollectedHandler}
                cancelHandler={certificateNotCollectedHandler}
                confirmationMessage={"Are you sure you want to update the ID Card collection status !!"}
            />
        </ModalContainerUpdated>
    </>
    )
}

export default PopOver
