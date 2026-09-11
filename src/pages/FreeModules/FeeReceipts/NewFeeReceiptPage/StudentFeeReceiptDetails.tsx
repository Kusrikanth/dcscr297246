import React, { useRef, useEffect, useMemo, useState, useCallback } from "react";
import { shallowEqual } from "react-redux";
import TableContainer from '../../../../Components/Common/TableContainer';
import { generateNewFeeReceiptModalColumns, ledgerType } from "./helper";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";

//Action Generator
import { generateActionPayload } from "../../../../utility/reduxutility";
import { getStudentLedgersAct } from "../../../../store/fee/feecollections/feecollectionactions";
import { RadioInputContainer } from "../../../../Components/Common";
import { useFormik } from "formik";
import { validateLedgersForPayment } from "../../../ParentDetails/FeeDetails/PayFee/helper";
import { toast } from "react-toastify";
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
    const [allAcademicLedgerSelectedState, setAllAcademicLedgerSelectedState] = useState(false);
    const [allTransportLedgerSelectedState, setAllTransportLedgerSelectedState] = useState(false);
    const [jodoCredOptedState, setJodoCredOptedState] = useState(false);
    const [academicLedgerState, setAcademicLedgerState] = useState<any[]>([]);
    const [transportLedgerState, setTransportLedgerState] = useState<any[]>([]);
    const dispatch = useAppDispatch();
    const { studentLedgersResp } =
        useAppSelector(({ feeCollections, appData }) => ({
            studentLedgersResp: feeCollections.studentLedgersResp,
        }), shallowEqual);

    const studentFeeReceipt = useRef<any>({
        prevStudentLedgersResp: studentLedgersResp,
    });

    useEffect(() => {
        const { studentId } = props;
        if (studentId) {
            const payload = {
                studentId: props.studentId,
                branchId: props.branchId,
                academicYearId: props.academicYearId,
                instituteId: props.instituteId,
                studentInfo: "",
                allowStudentConcession: "",
                allowEmployeeConcession: "",
                allowRefund: "",
                feeType: [],
                // instituteDeptId: [1, 4],
                instituteDeptNames: ["ACADEMICS", "TRANSPORT"],
                paymentStatus: "",
            };
            dispatch(getStudentLedgersAct(generateActionPayload("get_student_ledgers", undefined, payload)));
        }
    }, [props.studentId]);


    useEffect(() => {
        const { prevStudentLedgersResp } = studentFeeReceipt.current;
        if (studentLedgersResp && prevStudentLedgersResp !== studentLedgersResp) {
            const { jodoOptedStatus, ledgers } = studentLedgersResp,
                { selectedLedgersId = [] } = props,
                isJodoCredOpted = jodoOptedStatus === "CRED_OPTED" || jodoOptedStatus === "FLEX_OPTED";

            if (Array.isArray(ledgers) && ledgers.length > 0) {
                const filteredAcademicFeeLedgers = ledgers?.filter((i: any) => (
                    !i?.feeDetails.includes("TRANSPORT") &&
                    i.ledgerType === props.ledgerType &&
                    i?.paymentStatus !== "Paid"
                ));
                const lastAcademicLedgerIndex = filteredAcademicFeeLedgers.reduce((maxIdx: any, item: any, idx: any) =>
                    selectedLedgersId.includes(item.id) ? idx : maxIdx,
                    -1);

                const academicFeeList = filteredAcademicFeeLedgers.map((i: any, index: number) => {
                    return {
                        ...i, isEnabled: (index <= lastAcademicLedgerIndex + 1 && !isJodoCredOpted) ? true : false,
                        isChecked: selectedLedgersId.includes(i.id)
                    };
                })

                const filteredTransportFeeLedgers = ledgers?.filter((i: any) => (
                    i?.feeDetails.includes("TRANSPORT") &&
                    i.ledgerType === props.ledgerType &&
                    i?.paymentStatus !== "Paid"));
                const lastTransportLedgerIndex = filteredTransportFeeLedgers.reduce((maxIdx: any, item: any, idx: any) =>
                    selectedLedgersId.includes(item.id) ? idx : maxIdx,
                    -1);

                const transportFeeList = filteredTransportFeeLedgers.map((i: any, index: number) => {
                    return {
                        ...i, isEnabled: (index <= lastTransportLedgerIndex + 1 && !isJodoCredOpted) ? true : false,
                        isChecked: selectedLedgersId.includes(i.id)
                    };
                });
                setJodoCredOptedState(isJodoCredOpted);
                setAcademicLedgerState(academicFeeList);
                setAllAcademicLedgerSelectedState(academicFeeList.length ? academicFeeList.every((item: any) => item.isChecked) : false);
                setTransportLedgerState(transportFeeList);
                setAllTransportLedgerSelectedState(transportFeeList.length ? transportFeeList.every((item: any) => item.isChecked) : false);
            }
        }
        studentFeeReceipt.current.prevStudentLedgersResp = studentLedgersResp;
    }, [studentLedgersResp, props.ledgerType, props.selectedLedgersId]);


    const handleLedgerTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        props.event.handleChange(e);
        const { selectedLedgersId = [] } = props;
        if (studentLedgersResp && studentLedgersResp.ledgers) {
            setAllAcademicLedgerSelectedState(false);
            setAllTransportLedgerSelectedState(false);
            const { jodoOptedStatus, ledgers } = studentLedgersResp,
                isJodoCredOpted = jodoOptedStatus === "CRED_OPTED" || jodoOptedStatus === "FLEX_OPTED";
            if (Array.isArray(ledgers) && ledgers.length > 0) {
                const filteredAcademicFeeLedgers = ledgers?.filter((i: any) => (
                    !i?.feeDetails.includes("TRANSPORT") &&
                    i.ledgerType === e.target.value &&
                    i?.paymentStatus !== "Paid"
                ));
                const lastAcademicLedgerIndex = filteredAcademicFeeLedgers.reduce((maxIdx: any, item: any, idx: any) =>
                    selectedLedgersId.includes(item.id) ? idx : maxIdx,
                    -1);

                const academicFeeList = filteredAcademicFeeLedgers.map((i: any, index: number) => {
                    return {
                        ...i, isEnabled: (index <= lastAcademicLedgerIndex + 1 && !isJodoCredOpted) ? true : false,
                        isChecked: selectedLedgersId.includes(i.id)
                    };
                })

                const filteredTransportFeeLedgers = ledgers?.filter((i: any) => (
                    i?.feeDetails.includes("TRANSPORT") &&
                    i.ledgerType === e.target.value &&
                    i?.paymentStatus !== "Paid"));
                const lastTransportLedgerIndex = filteredTransportFeeLedgers.reduce((maxIdx: any, item: any, idx: any) =>
                    selectedLedgersId.includes(item.id) ? idx : maxIdx,
                    -1);

                const transportFeeList = filteredTransportFeeLedgers.map((i: any, index: number) => {
                    return {
                        ...i, isEnabled: (index <= lastTransportLedgerIndex + 1 && !isJodoCredOpted) ? true : false,
                        isChecked: selectedLedgersId.includes(i.id)
                    };
                });
                setJodoCredOptedState(isJodoCredOpted);
                setAcademicLedgerState(academicFeeList);
                setAllAcademicLedgerSelectedState(academicFeeList.length ? academicFeeList.every((item: any) => item.isChecked) : false);
                setTransportLedgerState(transportFeeList);
                setAllTransportLedgerSelectedState(transportFeeList.length ? transportFeeList.every((item: any) => item.isChecked) : false);
            }
        }
    }

    function onSubmitHndlr() {
        const { ledgers } = studentLedgersResp;
        const academicLedgerIds = academicLedgerState.filter((item: any) => item.isChecked)
            .map((item: any) => item?.id);
        const transportLedgerIds = transportLedgerState.filter((item: any) => item.isChecked)
            .map((item: any) => item?.id);
        // const { isValid, message } = validateLedgersForPayment(ledgers,
        //     academicLedgerIds
        //     , transportLedgerIds);

        // if (!isValid) {
        //     toast.error(`Select ${message} to proceed for payment.`);
        //     return;
        // }
        const selectedLedgersIds = [...academicLedgerIds, ...transportLedgerIds];
        const selectedLedgers = ledgers.filter((item: any) => selectedLedgersIds.includes(item.id));
        props.selectedLedgerCallbck(selectedLedgers);
    }

    const singleAcademicLedgerCheckHndlr = useCallback((event: any) => {
        const { checked } = event.currentTarget,
            id = event.currentTarget.getAttribute("data-id"),
            ledgerRowIndex = academicLedgerState?.findIndex((item: any) => +item.id === Number(id));
        if (ledgerRowIndex > -1 && Array.isArray(academicLedgerState)) {
            const updatedFeeDetails: any = academicLedgerState.map((item: any, index: number) => {
                if (ledgerRowIndex === index) {
                    return ({ ...item, isChecked: checked });
                } else if (index === (ledgerRowIndex + 1) && checked) {
                    return ({ ...item, isEnabled: true, isChecked: false });
                } else if (index > ledgerRowIndex && !checked) {
                    return ({ ...item, isEnabled: false, isChecked: false });
                } else {
                    return ({ ...item });
                }
            })
            setAllAcademicLedgerSelectedState(updatedFeeDetails.every((item: any) => item.isChecked));
            setAcademicLedgerState(updatedFeeDetails);
        }
    }, [academicLedgerState, transportLedgerState]);

    const allAcademicLedgerSelectHndlr = useCallback((event: any) => {
        const { checked } = event.currentTarget;
        if (Array.isArray(academicLedgerState) && academicLedgerState.length > 0) {
            const updatedFeeDetails: any = academicLedgerState.map((item: any, index: number) => {
                if (checked) {
                    return ({ ...item, isEnabled: true, isChecked: true })
                } else {
                    return ({ ...item, isEnabled: (index === 0) ? true : false, isChecked: false })
                }
            });
            setAcademicLedgerState(updatedFeeDetails);
            setAllAcademicLedgerSelectedState(checked);
        }
    }, [academicLedgerState]);


    const allTransportLedgerSelectHndlr = useCallback((event: any) => {
        const { checked } = event.currentTarget;
        if (Array.isArray(transportLedgerState) && transportLedgerState.length > 0) {
            const updatedFeeDetails: any = transportLedgerState.map((item: any, index: number) => {
                if (checked) {
                    return ({ ...item, isEnabled: true, isChecked: true })
                } else {
                    return ({ ...item, isEnabled: (index === 0) ? true : false, isChecked: false })
                }
            });
            setTransportLedgerState(updatedFeeDetails);
            setAllTransportLedgerSelectedState(checked);
        }
    }, [transportLedgerState]);


    const singleTransportLedgerCheckHndlr = useCallback((event: any) => {
        const { checked } = event.currentTarget,
            id = event.currentTarget.getAttribute("data-id"),
            ledgerRowIndex = transportLedgerState?.findIndex((item: any) => +item.id === Number(id));

        if (ledgerRowIndex > -1 && Array.isArray(transportLedgerState)) {
            const updatedFeeDetails: any = transportLedgerState.map((item: any, index: number) => {
                if (ledgerRowIndex === index) {
                    return ({ ...item, isChecked: checked });
                } else if (index === (ledgerRowIndex + 1) && checked) {
                    return ({ ...item, isEnabled: true, isChecked: false });
                } else if (index > ledgerRowIndex && !checked) {
                    return ({ ...item, isEnabled: false, isChecked: false });
                } else {
                    return ({ ...item });
                }
            })
            setAllTransportLedgerSelectedState(updatedFeeDetails.every((item: any) => item.isChecked));
            setTransportLedgerState(updatedFeeDetails);
        }
    }, [transportLedgerState, academicLedgerState]);

    const academicLedgersColumn = useMemo(() =>
        generateNewFeeReceiptModalColumns(allAcademicLedgerSelectedState,
            singleAcademicLedgerCheckHndlr, allAcademicLedgerSelectHndlr),
        [singleAcademicLedgerCheckHndlr, allAcademicLedgerSelectedState, academicLedgerState]);
    const transportLedgersColumn = useMemo(() =>
        generateNewFeeReceiptModalColumns(allTransportLedgerSelectedState,
            singleTransportLedgerCheckHndlr, allTransportLedgerSelectHndlr), [
        singleTransportLedgerCheckHndlr, allTransportLedgerSelectHndlr, transportLedgerState]);

    return (
        <React.Fragment>
            <div className="tw-p-5 tw-pt-0">
                <RadioInputContainer
                    name="ledgerType"
                    radioOptions={ledgerType || []}
                    value={props.ledgerType}
                    onChange={handleLedgerTypeChange}
                    labelText="Ledger Type"
                    labelClassName="tw-text-gray-500"
                />
                {jodoCredOptedState && <div className="tw-px-3 tw-mb-3">
                    <div className="tw-bg-blue-600 tw-px-3 tw-py-2 tw-text-white tw-rounded">
                        Cred/Flex payment has been opted for the student. Fees will be Auto paid as per schedule.
                    </div>
                </div>}

                <div style={{ position: "relative", display: "inline-block", width: "100%", padding: "20px 16px 12px", border: "1px solid #CED4DA", borderRadius: "6px", marginBottom: "24px" }}>
                    <p className='fs-15' style={{ position: "absolute", top: "-11px", padding: "0px 10px", color: "#495057", backgroundColor: "white" }}>
                        Academics Fee</p>
                    <TableContainer
                        columns={academicLedgersColumn}
                        data={academicLedgerState}
                        divClass="tw-overflow-x-auto tw-mb-0"
                        theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
                        showPagination={false}
                    />
                </div>

                <div style={{ position: "relative", display: "inline-block", width: "100%", padding: "20px 16px 12px", border: "1px solid #CED4DA", borderRadius: "6px" }}>
                    <p className='fs-15' style={{ position: "absolute", top: "-11px", padding: "0px 10px", color: "#495057", backgroundColor: "white" }}>
                        Transportation Fee</p>
                    <TableContainer
                        columns={transportLedgersColumn}
                        data={transportLedgerState}
                        divClass="tw-overflow-x-auto tw-mb-0"
                        theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
                        showPagination={false}
                    />
                </div>
                {/* <TableContainer
                    columns={studentLedgerColumns}
                    data={Array.isArray(ledgersState) ? ledgersState : []}
                    divClass="table-responsive mb-1"
                    tableClass="mb-0"
                    theadClass="table-light text-muted align-middle"
                /> */}
            </div>
            <div className="tw-p-4 tw-border-t tw-flex tw-justify-end tw-items-center tw-gap-2 tw-mt-2">
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
                    disabled={jodoCredOptedState}
                    onClick={onSubmitHndlr}
                >
                    Select
                </Button>
            </div>
        </React.Fragment>

    )
}


export default StudentFeeReceiptDetails;