import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useFormik } from "formik";
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
import { getStudentsListAct } from "../../../store/directory/studentmanagement/studentmanagementactions";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { AutoSearchInputUpdated, ModalContainerUpdated, SelectInput, TextInputGroup } from "../../../Components/Common";
import { generateActionPayload } from "../../../utility/reduxutility";
import { feeLedgersConcessionAct, feePaymentAct, getPayFeeDetailsAct } from "../../../store/fee/feecollections/feecollectionactions";
import { shallowEqual } from "react-redux";
import { validateLedgersForPayment, generateColumns, generateTransportationColumns } from "../../ParentDetails/FeeDetails/PayFee/helper";
import { toast } from "react-toastify";
import { createJodoOrder } from "../../../store/FrontDesk/AdmissionManagment/applicationmanagmentaction";
import * as Yup from "yup";
import TableContainer from "../../../Components/Common/TableContainer";
import { getDisplayAmountValue } from "../../../utility/commonutility";
import { default as RupeeSvg } from "../../../assets/imagesdps/feeDashboard/RupeeSvg.svg?react";
import UpdatePaymentModal from "./updatepayment";
import { useModal } from "../../../hooks/modalhook";
const concessionInitialValues = {
    academicYearId: "",
    studentId: "",
};

const initialValues = {
    totalOutstandingAmount: 0,
    fineAmount: 0,
    totalAmount: 0,
    concessionAmount: 0,
    concessionPercentage: 0,
    ledgerIds: [],
    academicLedgerIds: [],
    transportLedgerIds: []
};

const validationSchema = Yup.object().shape({

    totalAmount: Yup.string().test("isCashAmountGreater", "Amount should not be zero. Selected atleast one ledger to pay.",
        (value: any, schema: any) => {
            const concessionAmount = schema.parent?.concessionAmount;
            if ((Number(value) - Number(concessionAmount)) <= 0) {
                return false;
            }
            return true;
        }),
});

const PaymentTesting = () => {
    const [allAcademicLedgerSelectedState, setAllAcademicLedgerSelectedState] = useState(false);
    const [allTransportLedgerSelectedState, setAllTransportLedgerSelectedState] = useState(false);
    const [academicLedgerState, setAcademicLedgerState] = useState([]);
    const [transportLedgerState, setTransportLedgerState] = useState([]);
    const [jodoCredOptedState, setJodoCredOptedState] = useState(false);
    const { closeModal, openModal, modalState } = useModal();
    const dispatch = useAppDispatch();
    const [paymentInfoState, setPaymentInfoState] = useState({
        ccavenueUrl: "",
        payloadData: "",
        accessCode: "",
    });
    const [searchStudentState, setSearchStudentState] = useState<any>(null);
    const [formState, setFormState] = useState({
        academicYearId: "",
        studentId: "",
    });

    const studentConcessionForm = useFormik({
        initialValues: concessionInitialValues,
        onSubmit: (values) => { },
    });

    const payFeeForm = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values) => {
            const { academicLedgerIds, transportLedgerIds } = values;
            const ledgersIdSelected: any = [...academicLedgerIds, ...transportLedgerIds];
            const { ledgers } = getPayFeeDetailsResp;
            const { isValid, message } = validateLedgersForPayment(ledgers, academicLedgerIds, transportLedgerIds);
            if (!isValid) {
                toast.error(`Select ${message} to proceed for payment.`);
                return;
            }
            const ledgerIds = ledgers.filter((item: any) => {
                return ledgersIdSelected.includes(item?.id)
            }).map((item: any) => ({
                ledgerId: item.id,
                feeAmount: item.amountToPay,
                fineAmount: item.fineAmount,
                concessionAmount: 0
            }));
            const payload: any = {
                branchId: searchStudentState?.branchId,
                academicYearId: formState?.academicYearId,
                curriculumId: searchStudentState?.curriculumId,
                classId: searchStudentState?.classId,
                name: searchStudentState?.studentName,
                phone: searchStudentState?.phoneNumber,
                email: searchStudentState?.email,
                paymentType: "ACADEMIC_FEE",
                identifier: searchStudentState?.studentCode,
                studentId: searchStudentState?.studentId,
                fineAmount: Number(values.fineAmount),
                concessionAmount: (+values.concessionAmount),
                actualAmount: Number(values.totalAmount),
                ledgerIds,
                details: [
                    {
                        component_type: "Payable Amount",
                        amount: Number(values.totalAmount) + Number(values.fineAmount) - Number(values.concessionAmount),
                    }
                ],
                source: 'WEB',
                callback_url: `${import.meta.env.VITE_APPLICATION_URL}/feeledgersuccess/${searchStudentState?.studentId}`
            }
            payload.gateWayType = 'CCAVANUE';

            dispatch(createJodoOrder(generateActionPayload("jodo_order_pay", undefined, payload)));
        },
    });

    const { academicYearListResp, studentsListResp, currentInstIdResp: instituteId,
        currentBranchIdResp: branchId,
        createJodoOrderResp, currentStudentId, parentChildrensResp,
        feeLedgersConcessionResp, feeCollectionErrorResp,
        feePaymentResp,
        getPayFeeDetailsResp }: any =
        useAppSelector(
            ({ appData, instAcademics, applicationSale, directoryStudent, globalData, feeCollections }) => ({
                academicYearListResp: instAcademics.academicYearListResp,
                currentBranchIdResp: appData.currentBranchIdResp,
                studentsListResp: directoryStudent.studentsListResp,
                currentInstIdResp: appData.currentInstIdResp,
                getPayFeeDetailsResp: feeCollections.getPayFeeDetailsResp,
                feeLedgersConcessionResp: feeCollections.feeLedgersConcessionResp,
                currentStudentId: appData.currentStudentId,
                showApiLoader: globalData.showApiLoader,
                createJodoOrderResp: applicationSale.createJodoOrderResp,
                parentChildrensResp: directoryStudent.parentChildrensResp,
                feePaymentResp: feeCollections.feePaymentResp,
                feeCollectionErrorResp: feeCollections.feeCollectionErrorResp,
            }),
            shallowEqual
        );


    const payFeeRespRef = useRef({
        prevFeePaymentResp: feePaymentResp,
        prevCreateJodoOrderResp: createJodoOrderResp,
        prevFeeLedgersConcessionResp: feeLedgersConcessionResp,
        prevFeeCollectionErrorResp: feeCollectionErrorResp
    });

    useEffect(() => {
        const { prevCreateJodoOrderResp, prevFeeLedgersConcessionResp,
            prevFeePaymentResp,
            prevFeeCollectionErrorResp } = payFeeRespRef.current;
        if (createJodoOrderResp && createJodoOrderResp !== prevCreateJodoOrderResp) {
            const { data } = createJodoOrderResp;
            if (!data?.order_id) {
                toast.error("Something went wrong.");
                return;
            }
            const { totalAmount, fineAmount, concessionAmount } = payFeeForm.values;
            if (import.meta.env.VITE_ENVIRONMENT === "dev") {
                openModal({
                    orderRef: data?.order_id,
                    studentId: searchStudentState?.studentId,
                    studentCode: searchStudentState?.studentCode,
                    studentName: searchStudentState?.studentName,
                    amount: "1.00",
                    // amount: (Number(totalAmount) + Number(fineAmount) - Number(concessionAmount)),
                    branchId: searchStudentState?.branchId
                });
                return;
            }
            const paymentPayload = {
                orderRef: data?.order_id,
                branchId: searchStudentState?.branchId,
                // amount: (Number(totalAmount) + Number(fineAmount) - Number(concessionAmount)),
                amount: "1.00",
                identifier: {
                    type: "STUDENT_CODE",
                    value: searchStudentState?.studentCode,
                    studentId: searchStudentState?.studentId
                },
                studentName: searchStudentState?.studentName,
                callbackUrl: `${window.location.origin}/paymentstatus/${searchStudentState?.branchId}`,
                redirectUrl: window.location.href,
            }
            dispatch(feePaymentAct(generateActionPayload("ccavenue_fee_payment", undefined, paymentPayload)));
        } else if (feeLedgersConcessionResp && prevFeeLedgersConcessionResp !== feeLedgersConcessionResp) {
            const { totalAmount } = payFeeForm.values;
            if (isNaN(totalAmount) || isNaN(feeLedgersConcessionResp?.concessionAmount)) {
                toast.error("Error in getting ledger information. Something went wrong.");
                return;
            } else if (Number(feeLedgersConcessionResp?.concessionAmount) > Number(totalAmount)) {
                toast.error("Error in getting ledger information. Something went wrong.");
                return;
            }
            let amountValue = 0;
            amountValue = Number(totalAmount) - Number(feeLedgersConcessionResp?.concessionAmount);
            payFeeForm.setValues(prevValue => ({
                ...prevValue,
                concessionAmount: feeLedgersConcessionResp?.concessionAmount,
                concessionPercentage: feeLedgersConcessionResp?.concessionPercentage,
            }));
        } else if (feePaymentResp && prevFeePaymentResp !== feePaymentResp) {
            const { encRequest, accessCode, actionUrl } = feePaymentResp;
            setPaymentInfoState({
                ccavenueUrl: actionUrl,
                payloadData: encRequest,
                accessCode: accessCode,
            });
        } else if (feeCollectionErrorResp && prevFeeCollectionErrorResp !== feeCollectionErrorResp) {
            const { details } = feeCollectionErrorResp || {};
            toast.error(details || "Something went wrong.");
        }
        payFeeRespRef.current.prevCreateJodoOrderResp = createJodoOrderResp;
        payFeeRespRef.current.prevFeeLedgersConcessionResp = feeLedgersConcessionResp;
        payFeeRespRef.current.prevFeePaymentResp = feePaymentResp;
        payFeeRespRef.current.prevFeeCollectionErrorResp = feeCollectionErrorResp;
    }, [createJodoOrderResp, feeLedgersConcessionResp, feeCollectionErrorResp,
        feePaymentResp,
        parentChildrensResp, currentStudentId]);


    useEffect(() => {
        if (getPayFeeDetailsResp) {
            const { jodoOptedStatus } = getPayFeeDetailsResp,
                isJodoCredOpted = jodoOptedStatus === "CRED_OPTED" || jodoOptedStatus === "FLEX_OPTED";
            const academicFeeList = getPayFeeDetailsResp?.ledgers?.filter((i: any) => (
                !i?.feeDetails.includes("TRANSPORT") &&
                (i?.paymentStatus === "Unpaid" || i?.paymentStatus === "Partially paid")))
                .map((i: any, index: number) => {
                    return { ...i, isEnabled: (index === 0 && !isJodoCredOpted) ? true : false, isChecked: false };
                });
            const transportFeeList = getPayFeeDetailsResp?.ledgers?.filter((i: any) => (
                i?.feeDetails.includes("TRANSPORT") &&
                (i?.paymentStatus === "Unpaid" || i?.paymentStatus === "Partially paid")))
                .map((i: any, index: number) => {
                    return { ...i, isEnabled: (index === 0 && !isJodoCredOpted) ? true : false, isChecked: false };
                });
            const totalAmount = [...academicFeeList, ...transportFeeList].reduce((total: number, item: any) => {
                //including fine in the total amount.
                total = total + (+item?.amountToBePaid || 0) + (+item?.fineAmount || 0);
                return total;
            }, 0);
            setAcademicLedgerState(academicFeeList);
            setTransportLedgerState(transportFeeList);
            payFeeForm.setValues(prevValue => ({
                ...prevValue,
                totalOutstandingAmount: totalAmount,
            }));
            setJodoCredOptedState(isJodoCredOpted);
        }
    }, [getPayFeeDetailsResp])


    useEffect(() => {
        const yearId = academicYearListResp?.data?.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId;
        if (yearId) {
            setFormState((prevState) => ({ ...prevState, academicYearId: yearId, }));
        }
    }, [academicYearListResp]);

    const filterHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormState((prevState) => ({ ...prevState, [name]: value, }));
        studentConcessionForm.setFieldValue(name, value);
    };

    const onInputSearchChange = (inputString: any) => {
        const { academicYearId } = formState;
        if (inputString && academicYearId) {
            const params = { branchId, academicYearId, searchString: inputString };
            dispatch(getStudentsListAct(generateActionPayload("get_students", undefined, params)));
        }
    };

    const selectedStudent = (student: any) => {
        setSearchStudentState(student);
        if (student) {
            setFormState((prevState) => ({
                ...prevState,
                studentId: student.studentId,
            }));
            studentConcessionForm.setFieldValue("studentId", student.studentId);

            const payload = {
                studentId: student?.studentId,
                branchId: student?.branchId,
                // academicYearId: studentDetails?.academicYearId,
                studentInfo: "studentInfo",
                allowStudentConcession: "",
                allowEmployeeConcession: "",
                allowRefund: "",
                feeType: [],
                // instituteDeptId: [1, 4],
                instituteDeptNames: ["ACADEMICS", "TRANSPORT"],
                paymentStatus: "",
                ledgerId: "",
            }
            dispatch(getPayFeeDetailsAct(generateActionPayload("get_pay_fee_details", undefined, payload)));
        }
    };

    function handleCcAvenuePayment() {
        payFeeForm.handleSubmit();
    }

    const singleAcademicLedgerCheckHndlr = useCallback((event: any) => {
        const { checked } = event.currentTarget,
            id = event.currentTarget.getAttribute("data-id"),
            ledgerRowIndex = academicLedgerState?.findIndex((item: any) => +item.id === Number(id));
        // let updateStudentState: any = [...academicLedgerState];

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
            let payingAmount = 0, fineAmount = 0;
            [...updatedFeeDetails, ...transportLedgerState]?.forEach((i: any) => {
                if (i?.isChecked) {
                    payingAmount += (+i?.amountToBePaid || 0)
                    fineAmount += (+i?.fineAmount || 0)
                }
            })
            const selectedLedgersIds = updatedFeeDetails?.filter((item: any) => item.isChecked).map((item: any) => item.id);
            if (updatedFeeDetails?.every((item: any) => item.isChecked)) {
                const payload = { isFullConcessionApply: true, ledgerIds: selectedLedgersIds };
                dispatch(feeLedgersConcessionAct(generateActionPayload("feeledger_concession", undefined, payload)));
            }
            payFeeForm.setValues((prev) => ({
                ...prev,
                academicLedgerIds: selectedLedgersIds,
                totalAmount: payingAmount,
                fineAmount,
                concessionAmount: 0,
                concessionPercentage: 0
            }))
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
            let payingAmount = 0, fineAmount = 0;
            [...updatedFeeDetails, ...transportLedgerState]?.forEach((i: any) => {
                if (i?.isChecked) {
                    payingAmount += (+i?.amountToBePaid || 0)
                    fineAmount += (+i?.fineAmount || 0)
                }
            })
            const selectedLedgersIds = updatedFeeDetails?.filter((item: any) => item.isChecked).map((item: any) => item.id);
            if (checked && selectedLedgersIds.length > 0) {
                const payload = { isFullConcessionApply: true, ledgerIds: selectedLedgersIds };
                dispatch(feeLedgersConcessionAct(generateActionPayload("feeledger_concession", undefined, payload)));
            }
            payFeeForm.setValues((prev: any) => ({
                ...prev,
                academicLedgerIds: selectedLedgersIds,
                totalAmount: payingAmount,
                fineAmount,
                concessionAmount: 0,
                concessionPercentage: "0"
            }))
        }
    }, [academicLedgerState, transportLedgerState]);

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
            let payingAmount = 0, fineAmount = 0;
            [...updatedFeeDetails, ...academicLedgerState]?.forEach((i: any) => {
                if (i?.isChecked) {
                    payingAmount += (+i?.amountToBePaid || 0)
                    fineAmount += (+i?.fineAmount || 0)
                }
            })
            const selectedLedgersIds = updatedFeeDetails?.filter((item: any) => item.isChecked).map((item: any) => item.id);
            payFeeForm.setValues((prev) => ({
                ...prev,
                transportLedgerIds: selectedLedgersIds,
                totalAmount: payingAmount,
                fineAmount,
            }))
            setTransportLedgerState(updatedFeeDetails);
        }
    }, [transportLedgerState, academicLedgerState]);

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
            let payingAmount = 0, fineAmount = 0;
            [...updatedFeeDetails, ...academicLedgerState]?.forEach((i: any) => {
                if (i?.isChecked) {
                    payingAmount += (+i?.amountToBePaid || 0)
                    fineAmount += (+i?.fineAmount || 0)
                }
            })
            const selectedLedgersIds = updatedFeeDetails?.filter((item: any) => item.isChecked).map((item: any) => item.id);
            payFeeForm.setValues((prev: any) => ({
                ...prev,
                transportLedgerIds: selectedLedgersIds,
                totalAmount: payingAmount,
                fineAmount
            }))
        }
    }, [transportLedgerState, academicLedgerState]);

    const paymentFormRef = useRef<any>(null);
    useEffect(() => {
        const { ccavenueUrl,
            payloadData,
            accessCode } = paymentInfoState;
        if (ccavenueUrl && payloadData && accessCode) {
            paymentFormRef?.current?.submit();
        }
    }, [paymentInfoState]);


    const { data: academicYearList } = academicYearListResp || {};
    const { data: StudentList } = studentsListResp || {};
    const academicLedgerColumns = useMemo(() => generateColumns(singleAcademicLedgerCheckHndlr, allAcademicLedgerSelectHndlr, allAcademicLedgerSelectedState, jodoCredOptedState), [academicLedgerState, transportLedgerState, allAcademicLedgerSelectedState, jodoCredOptedState]);
    const transportLedgerColumns = useMemo(() => generateTransportationColumns(singleTransportLedgerCheckHndlr, allTransportLedgerSelectHndlr, allTransportLedgerSelectedState, jodoCredOptedState), [transportLedgerState, academicLedgerState, allTransportLedgerSelectedState, jodoCredOptedState]);
    const academicLedgerSelected = Array.isArray(payFeeForm.values.academicLedgerIds) ? (payFeeForm.values.academicLedgerIds.length === 0) : true;
    const transportLedgerSelected = Array.isArray(payFeeForm.values.transportLedgerIds) ? (payFeeForm.values.transportLedgerIds.length === 0) : true;
    const enablePayNow = !academicLedgerSelected || !transportLedgerSelected;
    const { totalAmount, fineAmount, concessionAmount } = payFeeForm.values;
    const amountToPay = Number(totalAmount) + Number(fineAmount) - Number(concessionAmount);
    return (
        <>
            <div className="page-content tution_fee_concession_wrap">
                <div className="container-fluid">
                    <BreadCrumb title="Student Concessions" pageTitle="Fee" />
                    <div className="d-flex justify-content-center mb-4">
                        <div className="card w-100">
                            <div className="card-header fw-bold fs-18">Payment Testing</div>
                            <div className="card-body">
                                <div className="row mb-4">
                                    <div className="col-6">
                                        <SelectInput
                                            name="academicYearId"
                                            labelText="Academic Year"
                                            value={formState.academicYearId}
                                            onChange={filterHandler}
                                            menuItems={academicYearList || []}
                                            valueKey="academicYearId"
                                            textKey="academicYearName"
                                            defaultSelect="Academic Year"
                                            formgroupClassName="mb-3"
                                        />
                                        <AutoSearchInputUpdated
                                            formgroupClassName="search-box"
                                            name="studentId"
                                            placeHolder="Search..."
                                            labelText="Student"
                                            onChange={(string: any) => {
                                                if (!string) {
                                                    studentConcessionForm.setFieldValue("studentId", "");
                                                    setFormState((prevState) => ({
                                                        ...prevState,
                                                        studentId: "",
                                                    }));
                                                }
                                                onInputSearchChange(string);
                                            }}
                                            onBlur={studentConcessionForm.handleBlur}
                                            valueKey="studentId"
                                            labelHeader="Student Code"
                                            labelKey="studentCode"
                                            subLabelHeader="Student Name"
                                            subLabelKey="studentName"
                                            options={StudentList}
                                            selected={searchStudentState}
                                            selectedOptionCallbck={selectedStudent}
                                        >
                                            <i className="ri-search-line search-icon"></i>
                                        </AutoSearchInputUpdated>
                                    </div>
                                </div>

                                <div style={{ position: "relative", display: "inline-block", width: "100%", padding: "20px 16px 12px", border: "1px solid #CED4DA", borderRadius: "6px", marginBottom: "20px" }}>
                                    <p className='fs-15' style={{ position: "absolute", top: "-11px", padding: "0px 10px", color: "#495057", backgroundColor: "white" }}>
                                        Academics Fee</p>
                                    <TableContainer
                                        columns={academicLedgerColumns}
                                        data={academicLedgerState || []}
                                        divClass="table-responsive mb-0"
                                        theadClass="table-light text-muted align-middle"
                                        showPagination={false}
                                    />
                                </div>
                                <div style={{ position: "relative", display: "inline-block", width: "100%", padding: "20px 16px 12px", border: "1px solid #CED4DA", borderRadius: "6px", marginBottom: "20px" }}>
                                    <p className='fs-15' style={{ position: "absolute", top: "-11px", padding: "0px 10px", color: "#495057", backgroundColor: "white" }}>
                                        Transportation Fee</p>
                                    <TableContainer
                                        columns={transportLedgerColumns}
                                        data={transportLedgerState || []}
                                        divClass="table-responsive mb-0"
                                        theadClass="table-light text-muted align-middle"
                                        showPagination={false}
                                    />
                                </div>
                                {!jodoCredOptedState && <form onSubmit={payFeeForm.handleSubmit}>
                                    <div className="col-12 col-md-6 col-lg-5 ms-auto">
                                        <div className="row d-flex align-items-center mb-2">
                                            <div className="col p-0">
                                                <h6 className="m-0">Total Actual Amount</h6>
                                            </div>
                                            <div className="col">
                                                <TextInputGroup
                                                    name="totalAmount"
                                                    formgroupClassName="mb-0"
                                                    inputgroupClassName="input-group-sm"
                                                    inputClassName="form-control-sm"
                                                    inputGroupStart={true}
                                                    value={getDisplayAmountValue(payFeeForm.values.totalAmount)}
                                                    onChange={undefined}
                                                    isDisabled={true}
                                                >
                                                    <RupeeSvg width="11px" height="11px" fill={"#495057"} />
                                                </TextInputGroup>
                                            </div>
                                        </div>

                                        <div className="row d-flex align-items-center mb-2">
                                            <div className="col p-0">
                                                <h6 className="m-0">Fine Amount</h6>
                                            </div>
                                            <div className="col">
                                                <TextInputGroup
                                                    name="fineAmount"
                                                    formgroupClassName="mb-0"
                                                    inputgroupClassName="input-group-sm"
                                                    inputClassName="form-control-sm"
                                                    inputGroupStart={true}
                                                    value={getDisplayAmountValue(payFeeForm.values.fineAmount)}
                                                    onChange={undefined}
                                                    isDisabled={true}
                                                >
                                                    <RupeeSvg width="11px" height="11px" fill={"#495057"} />
                                                </TextInputGroup>
                                            </div>
                                        </div>
                                        <div className="row d-flex align-items-center mb-2">
                                            <div className="col p-0">
                                                <h6 className="m-0">Total Concession Amount</h6>
                                            </div>
                                            <div className="col">
                                                <TextInputGroup
                                                    name="concessionAmount"
                                                    formgroupClassName="mb-0"
                                                    inputgroupClassName="input-group-sm"
                                                    inputClassName="form-control-sm"
                                                    inputGroupStart={true}
                                                    value={getDisplayAmountValue(payFeeForm.values.concessionAmount)}
                                                    onChange={undefined}
                                                    isDisabled={true}
                                                >
                                                    <RupeeSvg width="11px" height="11px" fill={"#495057"} />
                                                </TextInputGroup>
                                            </div>
                                        </div>
                                        <div className="row d-flex align-items-center mb-3 pb-3" style={{ borderBottom: "2px dashed #CFCFCF" }}>
                                            <div className="col p-0">
                                                <h6 className="m-0">Concession Percentage</h6>
                                            </div>
                                            <div className="col">
                                                <TextInputGroup
                                                    name="cocessionPercentage"
                                                    formgroupClassName="mb-0"
                                                    inputgroupClassName="input-group-sm"
                                                    inputClassName="form-control-sm"
                                                    inputGroupStart={true}
                                                    value={payFeeForm.values.concessionPercentage || "0"}
                                                    onChange={undefined}
                                                    isDisabled={true}
                                                >
                                                    <span className="fw-bold">%</span>
                                                </TextInputGroup>
                                            </div>
                                        </div>
                                        <div className="row d-flex align-items-center mb-2">
                                            <div className="col p-0">
                                                <h6 className="m-0">Paying Amount</h6>
                                            </div>
                                            <div className="col">
                                                <TextInputGroup
                                                    name="payingAmount"
                                                    formgroupClassName={"mb-0"}
                                                    inputgroupClassName="input-group-sm"
                                                    inputClassName="form-control-sm"
                                                    value={getDisplayAmountValue(amountToPay)}
                                                    onChange={undefined}
                                                    inputGroupStart={true}
                                                    isDisabled={true}
                                                    invalid={(payFeeForm.touched.totalAmount && payFeeForm.errors.totalAmount) ? true : false}
                                                    error={(payFeeForm.touched.totalAmount && payFeeForm.errors.totalAmount) ? payFeeForm.errors.totalAmount : ""}
                                                >
                                                    <RupeeSvg width="11px" height="11px" fill={"#495057"} />
                                                </TextInputGroup>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center justify-content-center mb-3 mt-4">
                                        <button
                                            type="button"
                                            onClick={handleCcAvenuePayment}
                                            data-id="ccAvenue"
                                            disabled={!enablePayNow}
                                            className="btn btn-success d-flex align-items-center justify-content-center ">
                                            <span>PAY NOW</span>&nbsp;<span className="fs-12px">(WITH CCAVENUE)</span>
                                        </button>
                                    </div>
                                </form>}
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        {jodoCredOptedState && <div className="col-12 mb-3">
                            <div className="bg-primary px-3 py-2 text-white rounded">
                                Cred/Flex payment has been opted for the student. Fees will be Auto paid as per schedule.
                            </div>
                        </div>}
                    </div>
                </div>
                <form id="nonseamless" ref={paymentFormRef} method="post" name="redirect"
                    action={paymentInfoState.ccavenueUrl}>
                    <input type="hidden" id="encRequest" name="encRequest" value={paymentInfoState.payloadData} />
                    <input type="hidden" name="access_code" id="access_code" value={paymentInfoState.accessCode} />
                </form>
            </div>

            <ModalContainerUpdated
                id="updatpayment-status"
                toggle={closeModal}
                modalSize="xs"
                modalTitle="Update Payment"
                isOpen={modalState.showModal}>
                <UpdatePaymentModal
                    closeModalHndlr={closeModal}
                    modalData={modalState.modalData}
                />
            </ModalContainerUpdated>
        </>
    );
};

export default PaymentTesting;
