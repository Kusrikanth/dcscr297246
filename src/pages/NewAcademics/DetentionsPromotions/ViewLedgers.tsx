import React, { useEffect, useMemo } from "react";
import { useDispatch, shallowEqual } from "react-redux";
import {
    generateFeeDetailsModalColumns,
} from "./helper";
import TableContainer from "../../../Components/Common/TableContainer";
import { useAppSelector } from "../../../hooks/storehook";
import { getLedgersOfDetainedOrPromotedAct } from "../../../store/academic/classroomManagment/classroommanagmentactions";
import { generateActionPayload } from "../../../utility/reduxutility";
import Button from "../../../Components/Common/Button";

const ViewLeadgersModal = (props: any) => {
    const feeDetailsColumns = useMemo(() => generateFeeDetailsModalColumns(), []);

    const { ledgersOfDetainedOrPromotedResp }: any =
        useAppSelector(
            ({ classroomManagmentInfo }) => ({
                ledgersOfDetainedOrPromotedResp: classroomManagmentInfo.ledgersOfDetainedOrPromotedResp,
            }),
            shallowEqual
        );

    useEffect(() => {
        if (props.ledgerDetails) {
            const { studentId, academicYearId, fromClassId, toClassId, approvedStatus } = props.ledgerDetails,
                params = {
                    academicYearId,
                    studentId,
                    classId: ""
                };
            if (approvedStatus === "APPROVED") {
                params.classId = toClassId;
            } else {
                params.classId = fromClassId;
            }
            props.dispatch(getLedgersOfDetainedOrPromotedAct(generateActionPayload('ledger_of_detention_promtion', params)))
        }

    }, [props.ledgerDetails]);

    function editReceiptHndlr(event: any) {
        props.toggle();
        props.editFeeDetailsHndlr(event);
    }

    const { feeListDTOAcademics } = ledgersOfDetainedOrPromotedResp || {};
    return (
        <>
            <div className="tw-px-6 tw-py-4">
                <div className="tw-grid tw-grid-cols-12 tw-gap-6 tw-mb-1">
                    <div className="tw-col-span-12 md:tw-col-span-4">
                        <label className="tw-font-bold tw-block tw-mb-1">
                            Student Details:
                        </label>
                        <span className="tw-block tw-text-gray-800">
                            {props?.ledgerDetails?.studentName || "-"}
                        </span>
                        <span className="tw-text-sm tw-text-blue-600">
                            {props?.ledgerDetails?.studentCode || "-"}
                        </span>
                    </div>
                    <div className="tw-col-span-12 md:tw-col-span-5 tw-space-y-3">
                        <div className="tw-flex tw-gap-2">
                            <label className="tw-font-bold tw-min-w-[140px]">
                                From Class:
                            </label>
                            <span>
                                {props?.ledgerDetails?.fromClass || "-"}
                            </span>
                        </div>
                        <div className="tw-flex tw-gap-2">
                            <label className="tw-font-bold tw-min-w-[140px]">
                                Promoted or Detained:
                            </label>
                            <span>
                                {props?.ledgerDetails?.eligibilityStatusDetentionAndPromotion || "-"}
                            </span>
                        </div>
                    </div>
                    <div className="tw-col-span-12 md:tw-col-span-3">
                        <div className="tw-flex tw-gap-2">
                            <label className="tw-font-bold tw-min-w-[90px]">
                                To Class:
                            </label>
                            <span>
                                {props?.ledgerDetails?.toClass || "-"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <TableContainer
                columns={feeDetailsColumns || []}
                data={Array.isArray(feeListDTOAcademics) ? feeListDTOAcademics : []}
                divClass="tw-overflow-x-auto tw-mb-2"
                tableClass="tw-mb-0"
                theadClass="tw-bg-gray-100 tw-text-gray-600 tw-align-middle"
            />
            <div className="tw-px-6 tw-py-4 tw-flex tw-justify-end">
                <Button
                    type="button"
                    variant="secondary"
                    onClick={props.toggle}
                >
                    Close
                </Button>
            </div>
        </>
    );
};

export default ViewLeadgersModal;
