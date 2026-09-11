import React, { useEffect, useMemo, useState } from "react";
import { shallowEqual, useDispatch } from "react-redux";
import TableContainer from "../../../../Components/Common/TableContainer";
import { generateViewStudentLedgerColumns } from "./helper";
import { StudentViewLedgerModalTypesProps } from "./RequestedListTypes";
import { getStudentLedgerItFormAct, resetStudentLedgerItFormAct } from "../../../../store/fee/feeapprovals/feeapprovalactions";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { useAppSelector } from "../../../../hooks/storehook";

const ViewStudentLedgers = (props: StudentViewLedgerModalTypesProps) => {
    const dispatch = useDispatch();

    const StudentLedgerColumns = useMemo(() =>generateViewStudentLedgerColumns(),[]);

    const {
        studentLedgerItFormResp
      } =
        useAppSelector(({ feeApprovals }) => ({
            studentLedgerItFormResp:feeApprovals.studentLedgerItFormResp
          }), shallowEqual);

    useEffect(()=>{
        if(props.isOpen&&props.ledgerId){
            dispatch(getStudentLedgerItFormAct(generateActionPayload('get_student_ledger_it_form',{ledgerId:props.ledgerId} )))
        }
        return ()=>{
            dispatch(resetStudentLedgerItFormAct(undefined));
        }
    },[props.isOpen])

    return (
        <>
     
                <div>
                    <TableContainer
                        columns={StudentLedgerColumns || []}
                        data={studentLedgerItFormResp||[]}
                        divClass="table-responsive mb-1"
                        theadClass="table-light text-muted align-middle"
                    />
                </div>
           
        </>
    );
};

export default ViewStudentLedgers;
