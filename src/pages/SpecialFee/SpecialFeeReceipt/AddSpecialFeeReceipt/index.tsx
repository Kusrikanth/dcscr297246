import React, { useRef, useEffect, useMemo, useState, useCallback } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import {
    AutoSearchInputUpdated, DateInput, ModalContainerUpdated, SelectInput,
    TextArea, TextInputGroup,
     TextInput, InputCheckbox
} from "../../../../Components/Common";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import PaymentDetails from "./PaymentDetails";
import { default as RupeeSvg } from "../../../../assets/imagesdps/feeDashboard/RupeeSvg.svg?react";
import TableContainer from "../../../../Components/Common/TableContainer";
import StudentFeeReceiptDetails from "./StudentFeeReceiptDetails";
//Helper
import {
    receiptTypeOptions, receiptForOptions, feeDetailsColumns, paymentModeOptions,
    statusOptions
} from "./helper";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
//Action Generator
import { generateActionPayload } from "../../../../utility/reduxutility";
import {
     getStudentsListAct, setStudentsListAct,
    setStudentListByRegNoAct
} from "../../../../store/directory/studentmanagement/studentmanagementactions";
import {
    getInstAcademicYearAct,
} from "../../../../store/mastersettings/instacademics/instacademicactions";
import {
    getBranchCurriculumAct, getBranchClassAct,
    setBrchClassAct,
} from "../../../../store/branchsettings/branchacademics/branchacademicsactions";
import {  addFeeReceiptAct, getFeeReceiptNoAct, setFeeReceiptNoAct } from "../../../../store/fee/feecollections/feecollectionactions";
import { useLocation, useHistory } from "react-router-dom";
import { getMasterBanksAct, getMasterTrustAct } from "../../../../store/masterdata/masterdataactions";
//Utility
import { getAmountValueWithDecimal } from "../../../../utility/commonutility";
import { Current_Date_YYYYMMDD } from "../../../../utility/dateutility";
import Button from "../../../../Components/Common/Button";

const initialPaymentInfo = {
    transactionId: "",
    transactionDate: "",
    accountPayeeName: "",
    bankName: "",
    chequeDate: "",
    chequeNumber: "",
    panCardNumber : "",
};

const initialValues: any = {
    receiptFor: "SPECIAL_FEE",
    receiptType: "SCHOOL",
    receiptNo: "",
    receiptDate: Current_Date_YYYYMMDD,
    instituteId: "",
    branchId: "",
    branchClassId: "",
    branchCurriculumId: "",
    academicYearId: "",
    totalActualAmount: "0.00",
    studentDetailId: "",
    amountToPay: "0.00",
    currentPaidAmount: "0.00",
    cashToReturn: "0.00",
    fine: "",
    totalFine: "0.00",
    cashAmount: "",
    chequeAmount: "0.00",
    bankCharges: "",
    paymentMode: "CASH",
    actualPaidAmount: "0.00",
    remarks: "",
    specialFeeDetails: [],
    totalConcession: "0.00",
    sectionName : "",

    ...initialPaymentInfo,

    previousPaidAmount: "0.00",
    balanceToPay: "0.00",
}


const validationSchema = Yup.object().shape({
    receiptFor: Yup.string().required("Select receipt for."),
    receiptType: Yup.string().required("Select receipt type."),
    // receiptDate: Yup.string().required("Select receipt date."),
    branchClassId: Yup.string().required("Select branch class."),
    branchCurriculumId: Yup.string().required("Select branch curriculum."),
    academicYearId: Yup.string().required("Select academic year."),
    studentDetailId: Yup.string().required('Student is required.'),
    specialFeeDetails: Yup.array().min(1, "No fee ledger is there to fill."),
    paymentMode: Yup.string(),
    accountPayeeName: Yup.string().when('paymentMode', {
        is: (item: any) => (item === "CHEQUE" || item === "DD"),
        then: Yup.string().required('Payee Name is required.')
    }),
    panCardNumber: Yup.string()
    .when('paymentMode', {
      is: (item: any) => item === "CASH",
      then: Yup.string()
        .required('Pan Card is required.') 
        .test(
          'length',
          'Pan Card must be exactly 10 characters.',
          (value) => !value || value.length === 10
        ),
      otherwise: Yup.string().nullable(),
    }),
    bankName: Yup.string().when('paymentMode', {
        is: (item: any) => (item === "CHEQUE" || item === "DD" || item === "CARD_PAYMENT" || item === "UPI"),
        then: Yup.string().required('Bank is required.')
    }),
    chequeNumber: Yup.number().when('paymentMode', {
        is: (item: any) => (item === "CHEQUE" || item === "DD"),
        then: Yup.number().typeError("Enter a valid number.").required('Number is required.')
    }),
    chequeDate: Yup.string().when('paymentMode', {
        is: (item: any) => (item === "CHEQUE" || item === "DD"),
        then: Yup.string().required('Date is required.')
    }),
    transactionId: Yup.string().when('paymentMode', {
        is: (item: any) => (item === "ONLINE" || item === "JODO_QR" || item === "UPI" || item === "ONLINE_PG" || item === "CARD_PAYMENT"),
        then: Yup.string().required('Transaction id is required.')
    }),
    transactionDate: Yup.string().when('paymentMode', {
        is: (item: any) => (item === "ONLINE" || item === "JODO_QR" || item === "ONLINE_PG"),
        then: Yup.string().required('Transaction date is required.')
    }),
    cashAmount: Yup.string().test("isCashAmountGreater", "Amount should not be zero and more than amount to pay.",
        (value: any, schema: any) => {
            if (!Number(value) || (Math.round(value) > Math.round(schema?.parent?.amountToPay))) {
                return false;
            }
            return true;
        }),
    remarks: Yup.string().required("Remarks are required.")
});


const AddSpecialFeeReceipt = () => {
    const location: any = useLocation();
    const history: any = useHistory();
    //Related to existing Student Data
    const [selectedStudentState, setSelectedStudentState] = useState<any>(null);
    const [ledgersState, setLedgersState] = useState<any>([]);

    const [selectedStudentByRegNoState, setSelectedStudentByRegNoState] = useState<any>(null);
    const [smsAndEmailMenu, setSmsAndEmailMenu] = useState<any>(statusOptions);

    const [amountLabel, setAmountLabel] = useState("Cash Amount");

    const [paymentInfoState, setPaymentInfoState] = useState({
        ccavenueUrl: "",
        payloadData: "",
        accessCode: "",
    });
    const dispatch = useAppDispatch();
    const {
        branchClassResp,
        academicYearListResp, feeReceiptNoResp, brchCurriculumResp,
        currentInstIdResp: instituteId, currentBranchIdResp: branchId,
        masterBanksResp, masterTrustResp,
        studentsListResp, addFeeReceiptResp, showApiLoader,
        feePaymentResp,
        feeCollectionErrorResp } =
        useAppSelector(({ appData, directoryStudent, branchAcademics,
            masterData,
            masterFeeSettings, feeCollections, globalData,
            admissionRegistration,
            instAcademics }) => ({
                branchClassResp: branchAcademics.branchClassResp,
                brchCurriculumResp: branchAcademics.brchCurriculumResp,
                masterBanksResp: masterData.masterBanksResp,
                masterTrustResp: masterData.masterTrustResp,
                academicYearListResp: instAcademics.academicYearListResp,
                feeReceiptNoResp: feeCollections.feeReceiptNoResp,
                currentInstIdResp: appData.currentInstIdResp,
                currentBranchIdResp: appData.currentBranchIdResp,
                studentsListResp: directoryStudent.studentsListResp,
                addFeeReceiptResp: feeCollections.addFeeReceiptResp,
                feePaymentResp: feeCollections.feePaymentResp,
                showApiLoader: globalData.showApiLoader,
                feeCollectionErrorResp: feeCollections.feeCollectionErrorResp,
            }), shallowEqual);

    const newFeeReceiptResp = useRef<any>({
        prevAddFeeReceiptResp: addFeeReceiptResp,
        prevAcademicYearListResp: academicYearListResp,
        prevFeePaymentResp: feePaymentResp,
        prevFeeReceiptNoResp: feeReceiptNoResp,
        prevFeeCollectionErrorResp: feeCollectionErrorResp
    });

    const paymentFormRef = useRef<any>(null);
    useEffect(() => {
        const { prevAddFeeReceiptResp, prevAcademicYearListResp, prevFeePaymentResp,
            prevFeeReceiptNoResp, prevFeeCollectionErrorResp } = newFeeReceiptResp.current;
        if (addFeeReceiptResp && prevAddFeeReceiptResp !== addFeeReceiptResp) {
            toast.success("Receipt added successfully.");
            const { receiptId } = addFeeReceiptResp;
            if (receiptId) {
                history.push(`/special-fee-reciepts/preview-receipt/${receiptId}`);

            }
        }
        else if (feePaymentResp && prevFeePaymentResp !== feePaymentResp) {
            const { ccavenueurl, access_code, payload } = feePaymentResp;
            setPaymentInfoState({
                ccavenueUrl: ccavenueurl,
                payloadData: payload,
                accessCode: access_code,
            });
        }
        else if (academicYearListResp && prevAcademicYearListResp !== academicYearListResp) {
            const { academicYearId } = createReceiptForm.values;
            if (!academicYearId && Array.isArray(academicYearListResp?.data)) {
                const { academicYearId } = academicYearListResp.data?.find((year: any) => year.yearStatus === "CURRENT") || {};
                if (academicYearId) {
                    createReceiptForm.setFieldValue("academicYearId", academicYearId);
                    getReceiptNoApiCall({ academicYearId });
                }
            }
        }


        else if (feeReceiptNoResp && prevFeeReceiptNoResp !== feeReceiptNoResp) {
            const { receiptNo } = feeReceiptNoResp;
            createReceiptForm.setFieldValue("receiptNo", receiptNo || "");
        }
        else if (feeCollectionErrorResp && feeCollectionErrorResp !== prevFeeCollectionErrorResp) {
            const { details, message }: any = feeCollectionErrorResp;
            toast.error(details || message || "Something went wrong.");
        }
        newFeeReceiptResp.current.prevAddFeeReceiptResp = addFeeReceiptResp;
        newFeeReceiptResp.current.prevAcademicYearListResp = academicYearListResp;
        newFeeReceiptResp.current.prevFeePaymentResp = feePaymentResp;
        newFeeReceiptResp.current.prevFeeReceiptNoResp = feeReceiptNoResp;
        newFeeReceiptResp.current.prevFeeCollectionErrorResp = feeCollectionErrorResp;
    }, [addFeeReceiptResp, academicYearListResp, feeReceiptNoResp, feePaymentResp,
        feeCollectionErrorResp]);


    useEffect(() => {
        const { ccavenueUrl,
            payloadData,
            accessCode } = paymentInfoState;
        if (ccavenueUrl && payloadData) {
            paymentFormRef?.current?.submit();
        }
    }, [paymentInfoState]);

    const createReceiptForm = useFormik({
        initialValues: initialValues,
        validationSchema,
        onSubmit: (values) => {
            const payload = { ...values, bankCharges: values?.bankCharges || 0.00, fine: values?.fine || 0.00 };
            payload.instituteId = instituteId;
            payload.branchId = branchId;
            smsAndEmailMenu?.map((item: any) => {
                payload[item?.id] = item?.selected
            })
            if (payload.paymentMode === "CHEQUE" || payload.paymentMode === "DD") {
                payload.chequeAmount = payload.cashAmount;
                payload.cashAmount = "0.00";
            }

            delete payload.totalFine;
            delete payload.balanceToPay;
            delete payload.previousPaidAmount;
            delete payload.totalConcession;

            payload.specialFeeDetails = payload?.specialFeeDetails?.map((item: any) => {
                const defaultPayload = {
                    academicYearId: item?.academicYearId,
                    specialFeeId: item?.specialFeeId,
                    specialFeeName: item?.feeName,
                    feeAmount: item?.balance,
                    fineAmount: "0.00",
                    concessionAmount: "0.00",
                }
                if (item?.feeType === "ONETIME") {
                    return {
                        ...defaultPayload
                    }
                }
                else if (item?.feeType === "TERM") {
                    return {
                        ...defaultPayload,
                        specialFeeTermId: item?.feeId,
                    }
                }
                else if (item?.feeType === "MONTH") {
                    return {
                        ...defaultPayload,
                        specialFeeMonthId: item?.feeId,
                    }
                }
            })            
            dispatch(addFeeReceiptAct(generateActionPayload("add_existing_student_fee_receipt", undefined, payload)));
        },
    });

    const [editStudentFeeReceiptModalState, setEditStudentFeeReceiptModalState] =
        useState<any>({
            showModal: false,
            branchId: "",
            studentId: "",
            studentCode: "",
            editStudentFeeReceiptModalState: ""
        });
    const toggleFeeReceiptDetailsModal = () => {
        setEditStudentFeeReceiptModalState((prev: any) => ({
            ...prev,
            showModal: !prev.showModal
        }))
    }

    useEffect(() => {
        if (instituteId && branchId) {
            const { academicYearId } = createReceiptForm.values;
            const payload = { instituteId, sortBy: "academicYearName", orderBy: "desc", pageNo: 0, pageSize: 20 };
            dispatch(getInstAcademicYearAct(generateActionPayload("get_inst_academic_year", undefined, payload)));
            const brchCurriculumparams = { branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", academicYearId, orderBy: "asc", };
            dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, brchCurriculumparams)));
            const bankApiPayload = { pageNo: 0, pageSize: 100, sortBy: 'bankName', orderBy: 'ASC' };
            dispatch(getMasterBanksAct(generateActionPayload("get_bank_details", undefined, bankApiPayload)));
            dispatch(getMasterTrustAct(generateActionPayload("get_master_trust")));
        }
    }, [instituteId, branchId, createReceiptForm.values.academicYearId]);

    function onChangeHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target,
            { receiptFor, receiptType, branchCurriculumId, branchClassId, academicYearId } = createReceiptForm.values;
        if (name === "branchCurriculumId") {
            if (value) {
                getClassApiCall(value);
            }
            dispatch(setBrchClassAct(undefined));
            createReceiptForm.resetForm({
                values: { ...initialValues, [name]: value, receiptFor, receiptType, academicYearId }
            });
        } else if (name === "branchClassId") {
            // createReceiptForm.setValues((prevState: any) => ({ ...prevState, [name]: value, studentDetailId: "" }))
            createReceiptForm.resetForm({
                values: { ...initialValues, [name]: value, branchCurriculumId, receiptFor, receiptType, academicYearId }
            });
        } else if (name === "receiptFor") {
            createReceiptForm.resetForm({
                values: {
                    ...initialValues, [name]: value,
                    receiptType, academicYearId
                }
            });
        } else if (name === "academicYearId") {
            createReceiptForm.resetForm({
                values: {
                    ...initialValues, [name]: value, receiptFor, receiptType,
                }
            });
            if (value && createReceiptForm.values.receiptType) {
                getReceiptNoApiCall({ receiptType, paymentMode: "CASH", academicYearId: value });
            }
            dispatch(setBrchClassAct(undefined));
        }

        if (name !== "academicYearId") {
            getReceiptNoApiCall({ receiptType, paymentMode: "CASH" });
        }
        //setting initial value null for existing student on change of curriculum class
        setLedgersState([]);
        dispatch(setFeeReceiptNoAct({}));
        dispatch(setStudentsListAct({}));
        setSelectedStudentState(null);
        //seting initial value null for 
        dispatch(setStudentListByRegNoAct(undefined));
        setSelectedStudentByRegNoState(null);
    }

    function getClassApiCall(curriculumId: string) {
        const { academicYearId } = createReceiptForm.values;
        const payload = { pageNo: 0, pageSize: 100, sortBy: "classSequence", orderBy: "asc", academicYearId, curriculumId, branchId };
        dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
    }

    function onInputSearchChange(inputString: any) {
        const { academicYearId, branchClassId, branchCurriculumId } = createReceiptForm.values;
        if (academicYearId) {
            const params = {
                branchId, academicYearId, classId: branchClassId || "",
                curriculumId: branchCurriculumId || "", searchString: inputString,
            };
            dispatch(getStudentsListAct(generateActionPayload("get_students", undefined, params)));
        }
    }

    function selectedStudentHndlr(selectedStudent: any) {
        getClassApiCall(selectedStudent?.curriculumId)
        setSelectedStudentState(selectedStudent);
        const { studentId, studentCode , sectionName } = selectedStudent || {};
        if (studentId) {
            setEditStudentFeeReceiptModalState((prevState: any) => ({
                ...prevState,
                showModal: true,
                studentId,
                studentCode
            }))
        }
        setLedgersState([]);
        createReceiptForm.setFieldValue("studentDetailId", studentId || "");
        createReceiptForm.setFieldValue("sectionName", sectionName || "");
    }

    useEffect(() => {
        if ((selectedStudentState || selectedStudentByRegNoState) && branchClassResp?.content?.length > 0) {
            createReceiptForm.setValues((prev: any) => ({
                ...prev,
                branchClassId: selectedStudentState?.classId || selectedStudentByRegNoState?.classId || prev?.branchClassId,
                branchCurriculumId: selectedStudentState?.curriculumId || selectedStudentByRegNoState?.curriculumId || prev?.branchCurriculumId,
            }))
        }
    }, [branchClassResp])

    function selectedLedgerCallbck(selectedLedgers: any) {
        setEditStudentFeeReceiptModalState((prevState: any) => ({
            ...prevState,
            showModal: false,
            studentId: "",
            studentCode: ""
        }));
        setLedgersState(selectedLedgers);
        updateFeePaymentDetails(selectedLedgers);
    }

    function updateFeePaymentDetails(ledgers: any) {        
        if (Array.isArray(ledgers)) {
            let formTotalActualAmount = 0,
                formTotalFine = 0,
                // formPreviouPaidAmount = 0, 
                formAmountToPay = 0,
                // formTotalConcession = 0,
                balanceToPay = 0,
                studentIds: any = [];
            // const studentIds = ledgers.map((item: any) => item.id);
            for (let i = 0; i < ledgers.length; i++) {
                const { feeAmount, amountPaid, totalConcession, amountToBePaid, balance, fineAmount } = ledgers[i];
                formTotalActualAmount += (!isNaN(feeAmount) ? Number(feeAmount) : 0);
                // formPreviouPaidAmount += (!isNaN(amountPaid) ? Number(amountPaid) : 0);
                // formTotalConcession += (!isNaN(totalConcession) ? Number(totalConcession) : 0);
                formAmountToPay += (!isNaN(feeAmount) ? Number(feeAmount) : 0);
                formTotalFine += (!isNaN(fineAmount) ? Number(fineAmount) : 0);
                balanceToPay += (!isNaN(balance) ? Number(balance) : 0);
                studentIds.push(ledgers[i]);
            }
            //Actaul amount paid is dependent on amout to pay and total fine
            const actualAmountPaid = formAmountToPay + formTotalFine;
            createReceiptForm.setValues((prevState: any) => ({
                ...prevState,
                totalActualAmount: getAmountValueWithDecimal(formTotalActualAmount),
                // previousPaidAmount: getAmountValueWithDecimal(formPreviouPaidAmount),
                currentPaidAmount: getAmountValueWithDecimal(balanceToPay),
                amountToPay: getAmountValueWithDecimal(formAmountToPay),
                totalFine: getAmountValueWithDecimal(formTotalFine),
                balanceToPay: getAmountValueWithDecimal(0),
                fine: getAmountValueWithDecimal(formTotalFine),
                cashAmount: getAmountValueWithDecimal(balanceToPay),
                actualPaidAmount: getAmountValueWithDecimal(balanceToPay),
                // totalConcession: getAmountValueWithDecimal(formTotalConcession),
                cashToReturn: getAmountValueWithDecimal(0),
                specialFeeDetails: studentIds
            }));
        }
    }

    function onChangePaymentModeHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        let accountPayeeName = "";
        if (value === "CHEQUE") {
            accountPayeeName = Array.isArray(masterTrustResp) ? masterTrustResp[0]?.trustName : "";
        }
        createReceiptForm.setValues((prevState: any) => ({
            ...prevState, ...initialPaymentInfo, [name]: value,
            receiptNo: "", accountPayeeName
        }));

        const { receiptType, academicYearId } = createReceiptForm.values;
        if (receiptType && academicYearId) {
            getReceiptNoApiCall({ [name]: value });
        }

        const touchedField = Object.keys(initialPaymentInfo).reduce((obj: any, item: any) => {
            obj[item] = false;
            return obj;
        }, {});
        createReceiptForm.setTouched({ ...createReceiptForm.touched, ...touchedField });
        let labelText = "";
        switch (value) {
            case "CASH": labelText = "Amount";
                break;
            case "ONLINE": labelText = "Online Amount";
                break;
            case "CHEQUE": labelText = "Cheque Amount";
                break;
            case "DD": labelText = "DD Amount";
                break;
            default: labelText = "Amount";
                break;
        }
        setAmountLabel(labelText);
    }

    function feeDetailsHndlr() {
        const { studentId } = selectedStudentState || {};
        const selectedLedgersId = ledgersState.map((item: any) => item.feeId);
        if (studentId) {
            setEditStudentFeeReceiptModalState((prevState: any) => ({
                ...prevState,
                showModal: true,
                studentId,
                studnetCode: "",
                selectedLedgersId
            }))
        }
    }

    const onDeleteLedgerHndlr = useCallback((event: any) => {
        const ledgerId = event.currentTarget.getAttribute("data-id"),
            updateSelectedLedgers = ledgersState.filter((item: any) => +item.feeId !== +ledgerId);
        setLedgersState(updateSelectedLedgers);
        updateFeePaymentDetails(updateSelectedLedgers);
    }, [ledgersState]);

    function onChangeCashAmountHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target,
            { fine, amountToPay } = createReceiptForm.values || {};
        let updateActualAmountValue = ((Number(value) || 0)) + (Number(fine)) || 0,
            balanceToPay = ((Number(amountToPay) || 0)) - (Number(value)) || 0,
            cashToReturn = ((Number(value) || 0)) - (Number(amountToPay)) || 0;
        balanceToPay = balanceToPay < 0 ? 0 : balanceToPay;
        cashToReturn = cashToReturn < 0 ? 0 : cashToReturn;
        createReceiptForm.setValues((prevState: any) => ({
            ...prevState,
            [name]: value,
            currentPaidAmount: getAmountValueWithDecimal(value),
            balanceToPay: getAmountValueWithDecimal(balanceToPay),
            cashToReturn: getAmountValueWithDecimal(cashToReturn),
            actualPaidAmount: getAmountValueWithDecimal(updateActualAmountValue)
        }));
    }

    function onBlurAmountHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        createReceiptForm.setValues((prevState: any) => ({
            ...prevState,
            [name]: value ? getAmountValueWithDecimal(value) : "",
        }));
        createReceiptForm.handleBlur(event);
    }

    function getReceiptNoApiCall(otherProps?: any) {
        const { receiptType, paymentMode, academicYearId } = createReceiptForm.values;
        const params = {
            branchId, instituteId,
            receiptType, paymentMode, academicYearId, receiptFor: "SPECIAL_FEE", ...otherProps
        }
        dispatch(getFeeReceiptNoAct(generateActionPayload("get_receipt_no", undefined, params)));
    }

    function onChangeBankChargeHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target,
            { cashAmount, fine } = createReceiptForm.values || {};
        let updateActualAmountValue = ((Number(value) || 0)) + ((Number(fine) || 0)) + + (Number(cashAmount)) || 0;
        createReceiptForm.setValues((prevState: any) => ({
            ...prevState,
            [name]: value,
            actualPaidAmount: getAmountValueWithDecimal(updateActualAmountValue)
        }));
    }

    function onChangeReceiptTypeHandler(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        createReceiptForm.setValues((prevState: any) => ({
            ...prevState, [name]: value, receiptNo: ""
        }));
        if (value) {
            getReceiptNoApiCall({ [name]: value });
        } else {
            dispatch(setFeeReceiptNoAct({}));
        }
    }

    function smsAndEmailChangeHndler(event: React.ChangeEvent<HTMLInputElement>) {
        const { checked, name } = event.target

        const newList = smsAndEmailMenu?.map((item: any) => {
            if (item?.id === name) {
                return {
                    ...item,
                    selected: checked
                }
            }
            return item
        })
        setSmsAndEmailMenu(newList)

    }

    const ledgersColumns = useMemo(() => feeDetailsColumns(onDeleteLedgerHndlr), [ledgersState]);

    return (
        <>
            <div className="page-content new_fee_receipt_page_warp">
                <div className="container-fluid">
                    <BreadCrumb title="Fee Receipts" pageTitle="Special Fee" pageTitleUrl={"/special-fee-reciepts"}
                        linkState={{ studentId: location.state?.studentId, academicYearId: location.state?.academicYearId, curriculumId: location.state?.curriculumId, classId: location.state?.classId }} />

                    <div className="card">
                        <div className="tw-border-b tw-px-4 tw-py-3">
                            <div className="tw-flex tw-items-center">
                                <div className="tw-flex-1">
                                    <h4 className="tw-text-base tw-font-semibold tw-mb-0 tw-flex-grow">
                                        Create Receipt
                                    </h4>
                                </div>
                            </div>
                        </div>
                        <form onSubmit={createReceiptForm.handleSubmit}>
                            <div className="card-body">
                                <div className="tw-grid tw-grid-cols-12 tw-pb-2 tw-border-b-2 tw-border-dashed tw-border-[#CFCFCF]">
                                    <div className="tw-col-span-12 xl:tw-col-span-3">
                                        <div>
                                            <SelectInput
                                                name="receiptFor"
                                                labelText="Receipt For"
                                                value={createReceiptForm.values.receiptFor}
                                                onChange={onChangeHndlr}
                                                onBlur={createReceiptForm.handleBlur}
                                                menuItems={receiptForOptions}
                                                valueKey="id"
                                                textKey="name"
                                                isDisabled={true}
                                                invalid={(createReceiptForm.touched.receiptFor && createReceiptForm.errors.receiptFor) ? true : false}
                                                error={(createReceiptForm.touched.receiptFor && createReceiptForm.errors.receiptFor) ? createReceiptForm.errors.receiptFor : ""}
                                            />
                                        </div>

                                        <div>
                                            <SelectInput
                                                name="receiptType"
                                                labelText="Receipt Type"
                                                value={createReceiptForm.values.receiptType}
                                                onChange={onChangeReceiptTypeHandler}
                                                onBlur={createReceiptForm.handleBlur}
                                                menuItems={receiptTypeOptions}
                                                valueKey="id"
                                                textKey="name"
                                                invalid={(createReceiptForm.touched.receiptType && createReceiptForm.errors.receiptType) ? true : false}
                                                error={(createReceiptForm.touched.receiptType && createReceiptForm.errors.receiptType) ? createReceiptForm.errors.receiptType : ""}
                                            />
                                        </div>
                                    </div>

                                    <div className="tw-col-span-12 xl:tw-col-span-5" />

                                    <div className="tw-col-span-12 xl:tw-col-span-4">
                                        <SelectInput
                                            name="academicYearId"
                                            formgroupClassName="tw-mb-1"
                                            value={createReceiptForm.values.academicYearId}
                                            onChange={onChangeHndlr}
                                            onBlur={createReceiptForm.handleBlur}
                                            menuItems={academicYearListResp?.data}
                                            valueKey="academicYearId"
                                            textKey="academicYearName"
                                            defaultSelect="Academic Year"
                                            isDisabled={location.state}
                                            invalid={(createReceiptForm.touched.academicYearId && createReceiptForm.errors.academicYearId) ? true : false}
                                            error={(createReceiptForm.touched.academicYearId && createReceiptForm.errors.academicYearId) ? createReceiptForm.errors.academicYearId : ""}
                                        />

                                        <AutoSearchInputUpdated
                                            formgroupClassName="search-box tw-mb-1"
                                            alignRight={true}
                                            name="studentDetailId"
                                            placeHolder="Search..."
                                            onChange={onInputSearchChange}
                                            onBlur={createReceiptForm.handleBlur}
                                            valueKey="studentId"
                                            labelHeader="Student Code"
                                            labelKey="studentCode"
                                            subLabelHeader="Student Name"
                                            subLabelKey="studentName"
                                            options={studentsListResp?.data}
                                            selected={selectedStudentState}
                                            selectedOptionCallbck={selectedStudentHndlr}
                                            isDisabled={location.state}
                                            invalid={(createReceiptForm.touched.studentDetailId && createReceiptForm.errors.studentDetailId) ? true : false}
                                            error={(createReceiptForm.touched.studentDetailId && createReceiptForm.errors.studentDetailId) ? createReceiptForm.errors.studentDetailId : ""}
                                        ><i className="ri-search-line search-icon"></i></AutoSearchInputUpdated>


                                        <SelectInput
                                            name="branchCurriculumId"
                                            formgroupClassName="tw-mb-1"
                                            value={createReceiptForm.values.branchCurriculumId}
                                            onChange={onChangeHndlr}
                                            onBlur={createReceiptForm.handleBlur}
                                            menuItems={brchCurriculumResp?.data}
                                            valueKey="branchCurriculumId"
                                            textKey="curriculumName"
                                            defaultSelect="Curriculum"
                                            isDisabled={true}
                                            invalid={(createReceiptForm.touched.branchCurriculumId && createReceiptForm.errors.branchCurriculumId) ? true : false}
                                            error={(createReceiptForm.touched.branchCurriculumId && createReceiptForm.errors.branchCurriculumId) ? createReceiptForm.errors.branchCurriculumId : ""}
                                        />

                                        <SelectInput
                                            name="branchClassId"
                                            formgroupClassName="tw-mb-1"
                                            value={createReceiptForm.values.branchClassId}
                                            onChange={onChangeHndlr}
                                            onBlur={createReceiptForm.handleBlur}
                                            menuItems={branchClassResp?.content}
                                            valueKey="id"
                                            textKey="shortName"
                                            defaultSelect="Class"
                                            isDisabled={true}
                                            invalid={(createReceiptForm.touched.branchClassId && createReceiptForm.errors.branchClassId) ? true : false}
                                            error={(createReceiptForm.touched.branchClassId && createReceiptForm.errors.branchClassId) ? createReceiptForm.errors.branchClassId : ""}
                                        />

                                        <TextInput
                                            name="sectionName"
                                            formgroupClassName="tw-mb-1"
                                            value={createReceiptForm.values.sectionName}
                                            onChange={undefined}
                                            isDisabled={true}
                                            placeHolder="Section"
                                        />
                                    </div>

                                    <div className="tw-col-span-12 xl:tw-col-span-2" />
                                </div>

                                <div className="tw-grid tw-grid-cols-12 tw-gap-4 tw-py-2 tw-border-b-2 tw-border-dashed tw-border-[#CFCFCF]">
                                    <div className="tw-col-span-12 xl:tw-col-span-4">
                                        <TextInput
                                            name="receiptNo"
                                            value={createReceiptForm.values.receiptNo}
                                            formgroupClassName="tw-mb-0"
                                            onChange={createReceiptForm.handleChange}
                                            isDisabled={true}
                                            labelText="Receipt No"
                                        />
                                    </div>

                                    <div className="tw-col-span-12 xl:tw-col-span-4">
                                        <DateInput
                                            name="receiptDate"
                                            labelText="Date"
                                            value={createReceiptForm.values.receiptDate}
                                            onChange={createReceiptForm.handleChange}
                                        /* isReadOnly={true} */
                                        />
                                    </div>
                                </div>

                                <div className="tw-py-2 tw-border-b-2 tw-border-dashed tw-border-gray-300">
                                    {selectedStudentState && (
                                        <div className="tw-w-full tw-mb-2">
                                            <Button
                                                type="button"
                                                variant="soft"
                                                onClick={feeDetailsHndlr}
                                            >
                                                Fee Details
                                            </Button>
                                        </div>
                                    )}

                                    <div className="tw-w-full tw-overflow-x-auto tw-mb-1">
                                        <TableContainer
                                            columns={ledgersColumns}
                                            data={Array.isArray(ledgersState) ? ledgersState : []}
                                            divClass="tw-w-full"
                                            tableClass="tw-table-auto tw-mb-0 tw-whitespace-nowrap"
                                            theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
                                        />
                                    </div>

                                    <div className="tw-w-full">
                                        <span className="tw-block tw-text-red-600 tw-text-sm">
                                            {(createReceiptForm.touched.specialFeeDetails && createReceiptForm.errors.specialFeeDetails)
                                                ? createReceiptForm.errors.specialFeeDetails.toString()
                                                : ""}
                                        </span>
                                    </div>
                                </div>
                                <div className="tw-grid tw-grid-cols-12 tw-py-3">
                                    <div className="tw-col-span-12 tw-ml-auto">

                                        <div className="tw-grid tw-grid-cols-12 tw-items-center tw-mb-2">
                                            <div className="tw-col-span-6 tw-p-0">
                                                <h6 className="tw-m-0">Amount to Pay</h6>
                                            </div>
                                            <div className="tw-col-span-6">
                                                <TextInputGroup
                                                    name="amountToPay"
                                                    formgroupClassName="tw-mb-0"
                                                    inputgroupClassName="tw-text-sm"
                                                    inputClassName="tw-text-sm"
                                                    inputGroupStart={true}
                                                    value={createReceiptForm.values.amountToPay}
                                                    onChange={undefined}
                                                    isDisabled={true}
                                                >
                                                    <RupeeSvg width="11px" height="11px" fill="#495057" />
                                                </TextInputGroup>
                                            </div>
                                        </div>

                                        <div className="tw-grid tw-grid-cols-12 tw-items-center tw-mb-2">
                                            <div className="tw-col-span-6 tw-p-0">
                                                <h6 className="tw-m-0">Current Paid Amount</h6>
                                            </div>
                                            <div className="tw-col-span-6">
                                                <TextInputGroup
                                                    name="currentPaidAmount"
                                                    formgroupClassName="tw-mb-0"
                                                    inputgroupClassName="tw-text-sm"
                                                    inputClassName="tw-text-sm"
                                                    inputGroupStart={true}
                                                    value={createReceiptForm.values.currentPaidAmount}
                                                    onChange={undefined}
                                                    isDisabled={true}
                                                >
                                                    <RupeeSvg width="11px" height="11px" fill="#495057" />
                                                </TextInputGroup>
                                            </div>
                                        </div>

                                        <div className="tw-grid tw-grid-cols-12 tw-items-center tw-mb-2">
                                            <div className="tw-col-span-6 tw-p-0">
                                                <h6 className="tw-m-0">Balance to Pay</h6>
                                            </div>
                                            <div className="tw-col-span-6">
                                                <TextInputGroup
                                                    name="balanceToPay"
                                                    formgroupClassName="tw-mb-0"
                                                    inputgroupClassName="tw-text-sm"
                                                    inputClassName="tw-text-sm"
                                                    inputGroupStart={true}
                                                    value={createReceiptForm.values.balanceToPay}
                                                    onChange={undefined}
                                                    isDisabled={true}
                                                >
                                                    <RupeeSvg width="11px" height="11px" fill="#495057" />
                                                </TextInputGroup>
                                            </div>
                                        </div>

                                        <div className="tw-grid tw-grid-cols-12 tw-items-center tw-mb-4">
                                            <div className="tw-col-span-6 tw-p-0">
                                                <h6 className="tw-m-0">Bank Charges/ Card charges</h6>
                                            </div>
                                            <div className="tw-col-span-6">
                                                <TextInputGroup
                                                    name="bankCharges"
                                                    formgroupClassName="tw-mb-0"
                                                    inputgroupClassName="tw-text-sm"
                                                    inputClassName="tw-text-sm"
                                                    allowedInputRegex="^[0-9]+\.?[0-9]*$"
                                                    inputGroupStart={true}
                                                    placeHolder="0.00"
                                                    value={createReceiptForm.values.bankCharges}
                                                    onChange={onChangeBankChargeHndlr}
                                                    onBlur={onBlurAmountHndlr}
                                                >
                                                    <RupeeSvg width="11px" height="11px" fill="#495057" />
                                                </TextInputGroup>
                                            </div>
                                        </div>

                                        <div className="tw-grid tw-grid-cols-12 tw-items-center tw-pb-3 tw-mb-3 tw-border-b-2 tw-border-dashed tw-border-[#CFCFCF]">
                                            <div className="tw-col-span-6 tw-p-0">
                                                <h6 className="tw-m-0">{amountLabel}</h6>
                                            </div>
                                            <div className="tw-col-span-6">
                                                <TextInputGroup
                                                    name="cashAmount"
                                                    formgroupClassName="tw-mb-0"
                                                    inputgroupClassName="tw-text-sm"
                                                    inputClassName="tw-text-sm"
                                                    allowedInputRegex="^[0-9]+\.?[0-9]*$"
                                                    inputGroupStart={true}
                                                    value={createReceiptForm.values.cashAmount}
                                                    onChange={onChangeCashAmountHndlr}
                                                    onBlur={onBlurAmountHndlr}
                                                    placeHolder="0.00"
                                                    invalid={(createReceiptForm.touched.cashAmount && createReceiptForm.errors.cashAmount) ? true : false}
                                                    error={(createReceiptForm.touched.cashAmount && createReceiptForm.errors.cashAmount) ? createReceiptForm.errors.cashAmount : ""}
                                                >
                                                    <RupeeSvg width="11px" height="11px" fill="#495057" />
                                                </TextInputGroup>
                                            </div>
                                        </div>

                                        <div className="tw-grid tw-grid-cols-12 tw-items-center">
                                            <div className="tw-col-span-6 tw-p-0">
                                                <h6 className="tw-m-0">Actual Paid Amount</h6>
                                            </div>
                                            <div className="tw-col-span-6">
                                                <TextInputGroup
                                                    name="actualPaidAmount"
                                                    formgroupClassName="tw-mb-0"
                                                    inputgroupClassName="tw-text-sm"
                                                    inputClassName="tw-text-sm"
                                                    inputGroupStart={true}
                                                    value={createReceiptForm.values.actualPaidAmount}
                                                    onChange={undefined}
                                                    isDisabled={true}
                                                >
                                                    <RupeeSvg width="11px" height="11px" fill="#495057" />
                                                </TextInputGroup>
                                            </div>
                                        </div>

                                    </div>
                                </div>

                                <div className="tw-grid tw-grid-cols-12 tw-py-1">
                                    <div className="tw-col-span-12 xl:tw-col-span-4 tw-mb-3">
                                        <h6 className="tw-font-normal tw-text-gray-500 tw-mb-3">PAYMENT DETAILS</h6>

                                        <SelectInput
                                            name="paymentMode"
                                            labelText="Payment Mode"
                                            formgroupClassName="tw-mb-3"
                                            value={createReceiptForm.values.paymentMode}
                                            onChange={onChangePaymentModeHndlr}
                                            menuItems={paymentModeOptions}
                                            valueKey="id"
                                            textKey="name"
                                            hideSelectOption={true}
                                        />

                                        <PaymentDetails
                                            receiptForm={createReceiptForm}
                                            bankList={masterBanksResp?.data}
                                            trustList={masterTrustResp}
                                        />

                                        <TextArea
                                            name="remarks"
                                            labelText="Remarks"
                                            value={createReceiptForm.values.remarks}
                                            onChange={createReceiptForm.handleChange}
                                            onBlur={createReceiptForm.handleBlur}
                                            formgroupClassName='tw-mb-0'
                                            invalid={(createReceiptForm.touched.remarks && createReceiptForm.errors.remarks) ? true : false}
                                            error={(createReceiptForm.touched.remarks && createReceiptForm.errors.remarks) ? createReceiptForm.errors.remarks : ""}
                                        />
                                    </div>
                                </div>

                                <div className="tw-mt-3">
                                    <h6 className="tw-p-0 tw-font-semibold">Noted</h6>
                                    <p className="tw-py-2 tw-w-full tw-rounded tw-bg-blue-100 tw-text-blue-700">
                                        Fee is not refundable after the commencement of the session or after the student stops attending or leaves the School, or leaves the school in the mid of Session, or are suspended by the School owing to non-attendance or misconduct.
                                    </p>
                                </div>

                                <div className="tw-flex tw-items-center tw-justify-between tw-mt-3">
                                    <div className="tw-flex tw-items-center tw-gap-3">
                                        {smsAndEmailMenu && smsAndEmailMenu.map((item: any) => (
                                            <InputCheckbox
                                                key={item.id}
                                                name={`${item.id}`}
                                                labelName={item.name}
                                                value={item.selected}
                                                onChange={smsAndEmailChangeHndler}
                                                dataId={item.id}
                                            />
                                        ))}
                                    </div>

                                    <div>
                                        <Button
                                            variant="primary"
                                            type="submit"
                                            disabled={showApiLoader}
                                        >
                                            Save
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </form>

                    </div>
                </div >
            </div >
            <ModalContainerUpdated
                id="add-student-ledger"
                modalSize="xl"
                modalTitle={`Select fee for Student Code: ${editStudentFeeReceiptModalState.studentCode}`}
                headerClassName="bg-white"
                isOpen={editStudentFeeReceiptModalState.showModal}
                toggle={toggleFeeReceiptDetailsModal}
            >
                <StudentFeeReceiptDetails
                    toggle={toggleFeeReceiptDetailsModal}
                    instituteId={instituteId}
                    branchId={branchId}
                    academicYearId={createReceiptForm.values.academicYearId}
                    studentId={editStudentFeeReceiptModalState.studentId}
                    selectedLedgersId={editStudentFeeReceiptModalState.selectedLedgersId}
                    selectedLedgerCallbck={selectedLedgerCallbck}
                />
            </ModalContainerUpdated>

        </>
    );
};

export default AddSpecialFeeReceipt;
