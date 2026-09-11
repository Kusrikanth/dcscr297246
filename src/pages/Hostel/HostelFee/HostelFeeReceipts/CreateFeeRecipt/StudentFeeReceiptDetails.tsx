import React, { useRef, useEffect, useMemo, useState, useCallback } from "react";
import { shallowEqual } from "react-redux";
import TableContainer from '../../../../../Components/Common/TableContainer';
import { generateNewFeeReceiptModalColumns } from "./helper";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";

//Action Generator
import { generateActionPayload } from "../../../../../utility/reduxutility";
import { getStudentLedgersAct } from "../../../../../store/fee/feecollections/feecollectionactions";
import Button from "../../../../../Components/Common/Button";

const StudentFeeReceiptDetails = (props: any) => {
    const [ledgersState, setLedgersState] = useState<any>([]);
    const [selectedLedgerTableState, setSelectedLedgerTableState] = useState<any>({});
    const dispatch = useAppDispatch();
    const { studentLedgersResp } =
        useAppSelector(({ feeCollections, appData }) => ({
            studentLedgersResp: feeCollections.studentLedgersResp,
        }), shallowEqual);

    const studentHostelFeeReceipt = useRef<any>({
        prevStudentLedgersResp: studentLedgersResp,
    });
    const selectedLedgerRef = useRef<any>([]);

    useEffect(() => {
        const { studentId } = props;
        if (studentId) {
            const payload = {
                studentId: props.studentId,
                branchId: props.branchId,
                academicYearId: props.academicYearId,
                studentInfo: "studentInfo",
                allowStudentConcession: "",
                allowEmployeeConcession: "YES",
                allowRefund: "NO",
                // feeType: ["FEE STRUCTURE"],
                sortBy : "id",
                ledgerId : 1,
            };
            dispatch(getStudentLedgersAct(generateActionPayload("hostel_stu_ledger_details", undefined, payload)));
        }
    }, [props.studentId]);


    useEffect(() => {
        const { prevStudentLedgersResp } = studentHostelFeeReceipt.current;
        if (studentLedgersResp && prevStudentLedgersResp !== studentLedgersResp) {
            const { ledgersDtos : ledgers } = studentLedgersResp,
                { selectedLedgersId = [] } = props;
            if (Array.isArray(ledgers) && ledgers.length > 0) {
                const tableSelectedRows: any = {},
                    filterPaidLedgers = ledgers.filter(item => item.paymentStatus !== "Paid");
                for (let i = 0; i < filterPaidLedgers.length; i++) {
                    if (selectedLedgersId.includes(filterPaidLedgers[i].id)) {
                        tableSelectedRows[i] = true;
                    }
                }
                setSelectedLedgerTableState(tableSelectedRows);
                setLedgersState(filterPaidLedgers);
            }
        }
        studentHostelFeeReceipt.current.prevStudentLedgersResp = studentLedgersResp;
    }, [studentLedgersResp]);


    function onSubmitHndlr() {
        props.selectedLedgerCallbck(selectedLedgerRef.current);
    }

    const selectedRowHandler = useCallback((row: any) => {
        selectedLedgerRef.current = row;
    }, []);

    const studentLedgerColumns = useMemo(() => generateNewFeeReceiptModalColumns(), [ledgersState]);
    return (
        <React.Fragment>
            <div className="modal-body tw-p-0">
                <TableContainer
                    columns={studentLedgerColumns}
                    data={Array.isArray(ledgersState) ? ledgersState : []}
                    divClass="tw-overflow-x-auto tw-mb-1"
                    tableClass="tw-mb-0"
                    theadClass="tw-table-light tw-text-gray-500 tw-align-middle"
                    showCheckbox={true}
                    selectedRowHandler={selectedRowHandler}
                    defaultSelect={selectedLedgerTableState}
                />
            </div>
            <div className="modal-footer modal-footer-shadow tw-mt-2">
                <div className="tw-flex tw-gap-2 tw-justify-end">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={props.toggle}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        onClick={onSubmitHndlr}
                    >
                        Select
                    </Button>
                </div>
            </div>
        </React.Fragment>

    )
}

export default StudentFeeReceiptDetails
