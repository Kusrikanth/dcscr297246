import React, { useRef, useEffect, useMemo, useState, useCallback } from "react";
import { shallowEqual } from "react-redux";
import TableContainer from '../../../../Components/Common/TableContainer';
import { generateNewFeeReceiptModalColumns, getSpecialFeesLedgers } from "./helper";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";

//Action Generator
import { generateActionPayload } from "../../../../utility/reduxutility";
import { getSpecialFeePayDetailsAct, getStudentLedgersAct } from "../../../../store/fee/feecollections/feecollectionactions";
import Button from "../../../../Components/Common/Button";

interface StudentFeeDetailsModalProps {
    isOpen: boolean;
    toggle: any;
    modalTitle: string;
    instituteId: string;
    instituteName: string;
    branchId: string;
    editBranchDetails: string | undefined;
}
const StudentFeeReceiptDetails = (props: any) => {
    const [ledgersState, setLedgersState] = useState<any>([]);
    const [selectedLedgerTableState, setSelectedLedgerTableState] = useState<any>({});
    const dispatch = useAppDispatch();
    const { getSpecialFeePayDetailsResp } =
        useAppSelector(({ feeCollections, appData }) => ({
            getSpecialFeePayDetailsResp: feeCollections.getSpecialFeePayDetailsResp,
        }), shallowEqual);

    const studentFeeReceipt = useRef<any>({
        prevGetSpecialFeePayDetailsResp: getSpecialFeePayDetailsResp,
    });
    const selectedLedgerRef = useRef<any>([]);

    useEffect(() => {
        const { studentId } = props;
        if (studentId) {
            const payload = {
                studentId: props.studentId,
                academicYearId: props.academicYearId,
                isActive: "1"
            };
            dispatch(getSpecialFeePayDetailsAct(generateActionPayload("get_special_pay_fee_details", undefined, payload)));
        }
    }, [props.studentId]);

    useEffect(() => {
        const { prevGetSpecialFeePayDetailsResp } = studentFeeReceipt.current;
        if (getSpecialFeePayDetailsResp && prevGetSpecialFeePayDetailsResp !== getSpecialFeePayDetailsResp) {

            const { selectedLedgersId = [] } = props;
            if (Array.isArray(getSpecialFeePayDetailsResp) && getSpecialFeePayDetailsResp.length > 0) {
                const tableSelectedRows: any = {};
                const specialFeeList = getSpecialFeesLedgers(getSpecialFeePayDetailsResp);
                const feeList = specialFeeList.filter((item: any) =>
                    item.paymentStatus?.toLowerCase() !== "paid").map((i: any, index: number) => {
                        return { ...i, isChecked: false };
                    });
                for (let i = 0; i < feeList.length; i++) {
                    if (selectedLedgersId.includes(feeList[i].feeId)) {
                        tableSelectedRows[i] = true;
                    }
                }
                setSelectedLedgerTableState(tableSelectedRows);
                setLedgersState(feeList);
            }


            // const totalAmount = feeList.reduce((total: number, item: any) => {
            //   total = total + (+item?.balance || 0);
            //   return total;
            // }, 0);
            // payFeeForm.setValues(prevValue => ({
            //   ...prevValue,
            //   totalOutstandingAmount: totalAmount,
            // }));
        }
        studentFeeReceipt.current.prevGetSpecialFeePayDetailsResp = getSpecialFeePayDetailsResp;
    }, [getSpecialFeePayDetailsResp]);


    function onSubmitHndlr() {
        props.selectedLedgerCallbck(selectedLedgerRef.current);
    }

    const selectedRowHandler = useCallback((row: any) => {
        selectedLedgerRef.current = row;
    }, []);

    const studentLedgerColumns = useMemo(() => generateNewFeeReceiptModalColumns(), [ledgersState]);
    return (
        <React.Fragment>
            <div className="tw-p-0">
                <TableContainer
                    columns={studentLedgerColumns}
                    data={Array.isArray(ledgersState) ? ledgersState : []}
                    divClass="tw-overflow-x-auto tw-mb-1"
                    tableClass="tw-mb-0"
                    theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
                    showCheckbox={true}
                    selectedRowHandler={selectedRowHandler}
                    defaultSelect={selectedLedgerTableState}
                />
            </div>

            <div className="tw-mt-2 tw-p-2 tw-flex tw-justify-end tw-gap-2">
                <Button
                    variant="secondary"
                    type="button"
                    onClick={props.toggle}
                >
                    Cancel
                </Button>
                <Button
                    variant="primary"
                    type="submit"
                    onClick={onSubmitHndlr}
                >
                    Select
                </Button>
            </div>

        </React.Fragment>

    )
}

export default StudentFeeReceiptDetails
