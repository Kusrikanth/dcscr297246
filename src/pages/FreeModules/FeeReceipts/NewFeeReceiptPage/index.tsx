import React, { useRef, useEffect, useMemo, useState, useCallback, createRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import {
  AutoSearchInputUpdated, DateInput, ModalContainerUpdated, RadioInputContainer, SelectInput,
  TextArea, TextInputGroup,
  TextIconInput, TextInput, ConfirmationModal, InputCheckbox
} from "../../../../Components/Common";
import BackButtonText from "../../../../Components/Common/BackButtonText";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import PaymentDetails from "./PaymentDetails";
import { default as RupeeSvg } from "../../../../assets/imagesdps/feeDashboard/RupeeSvg.svg?react";
import TableContainer from "../../../../Components/Common/TableContainer";
import StudentFeeReceiptDetails from "./StudentFeeReceiptDetails";
//Helper
import {
  receiptTypeOptions, receiptForOptions, feeDetailsColumns, paymentModeOptions,
  generateFeeStructureColumns,
  statusOptions
} from "./helper";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
//Action Generator
import { generateActionPayload } from "../../../../utility/reduxutility";
import {
  getStudentByFilterAct, getStudentListByRegNoAct, getStudentsListAct, setStudentsListAct,
  setStudentListByRegNoAct
} from "../../../../store/directory/studentmanagement/studentmanagementactions";
import {
  getInstAcademicYearAct,
} from "../../../../store/mastersettings/instacademics/instacademicactions";
import {
  getFeeStructureForClassAct
} from "../../../../store/modulesettings/masterfeesettings/masterfeesettingsactions";
import {
  getBranchCurriculumAct, getBranchClassAct,
  setBrchClassAct,
} from "../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { addFeeReceiptAct, feePaymentAct, getFeeReceiptNoAct, setFeeReceiptNoAct } from "../../../../store/fee/feecollections/feecollectionactions";
import { getStudentPreadmissionByRegnoAct } from "../../../../store/FrontDesk/AdmissionRegistration/admissionregistrationaction";
import { useLocation, useHistory, useParams } from "react-router-dom";
import { getMasterBanksAct, getMasterTrustAct } from "../../../../store/masterdata/masterdataactions";
//Utility
import { getAmountValueWithDecimal, getDisplayAmountValue, parseQueryStringToObject } from "../../../../utility/commonutility";
import { Current_Date_YYYYMMDD } from "../../../../utility/dateutility";
import { nanoid } from "nanoid";
import { getStudentLedgerTcAct, setStudentLedgerTcAct } from "../../../../store/academic/classroomManagment/classroommanagmentactions";

const initialPaymentInfo = {
  transactionId: "",
  transactionDate: "",
  accountPayeeName: "",
  bankName: "",
  chequeDate: "",
  chequeNumber: "",
};

const initialValues: any = {
  ledgerType: "TERM",
  receiptFor: "",
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
  studentRegistrationNo: "",
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
  studentLedgerIds: [],
  studentMonthLedgerIds: [],
  totalConcession: "0.00",
  studentLedgerDetails: [],
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
  studentDetailId: Yup.string().when('receiptFor', {
    is: (item: any) => item !== "NEW_STUDENT",
    then: Yup.string().required('Student is required.')
  }),
  studentLedgerIds: Yup.array().when("ledgerType", {
    is: "TERM",
    then: Yup.array().min(1, "No fee ledger is there to fill."),
    otherwise: Yup.array().nullable(),
  }),
  studentMonthLedgerIds: Yup.array().when("ledgerType", {
    is: "MONTH",
    then: Yup.array().min(1, "No fee ledger is there to fill."),
    otherwise: Yup.array().nullable(),
  }),
  studentRegistrationNo: Yup.string().when('receiptFor', {
    is: (item: any) => item === "NEW_STUDENT",
    then: Yup.string().required('Search student after selecting academic year, curriculum.')
  }),
  paymentMode: Yup.string(),
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
  accountPayeeName: Yup.string().when('paymentMode', {
    is: (item: any) => (item === "CHEQUE" || item === "DD"),
    then: Yup.string().required('Payee Name is required.')
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


const NewFeeReceiptPage = () => {
  const location: any = useLocation();
  const history: any = useHistory();
  const queryParams = new URLSearchParams(location.search);
  const paymentType = queryParams.get('type');
  //Related to existing Student Data
  const [selectedStudentState, setSelectedStudentState] = useState<any>(null);
  const [ledgersState, setLedgersState] = useState<any>([]);
  //Related to new student Data
  const [studentListByRegNoState, setStudentListByRegNoState] = useState<any>([]);
  const [selectedStudentByRegNoState, setSelectedStudentByRegNoState] = useState<any>(null);
  const [smsAndEmailMenu, setSmsAndEmailMenu] = useState<any>(statusOptions);
  //Confirmation Modal
  const [credConfirmModalState, setCredConfirmModalState] = useState({
    showModal: false,
    modalData: null
  });
  const [amountLabel, setAmountLabel] = useState("Cash Amount");
  const [chalanTypeState, setChalanTypeState] = useState("false");
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
    feePaymentResp, feeStructureForClassResp,
    studentPreadmissionByRegNoResp, admissionRegistrationErrorResp, studentLedgerTcResp,
    feeCollectionErrorResp } =
    useAppSelector(({ appData, directoryStudent, branchAcademics,
      masterData,
      masterFeeSettings, feeCollections, globalData,
      admissionRegistration, classroomManagmentInfo,
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
        feeStructureForClassResp: masterFeeSettings.feeStructureForClassResp,
        studentLedgerTcResp: classroomManagmentInfo.studentLedgerTcResp,
        studentPreadmissionByRegNoResp: admissionRegistration.studentPreadmissionByRegNoResp,
        admissionRegistrationErrorResp: admissionRegistration.admissionRegistrationErrorResp,
        feeCollectionErrorResp: feeCollections.feeCollectionErrorResp,
      }), shallowEqual);

  const [feeClassStructureState, setFeeClassStructureState] = useState<any>([]);
  const [isAllFeeClassStructureCheckedState, setIsAllFeeClassStructureCheckedState] = useState(false);

  const newFeeReceiptResp = useRef<any>({
    prevAddFeeReceiptResp: addFeeReceiptResp,
    prevAcademicYearListResp: academicYearListResp,
    prevFeePaymentResp: feePaymentResp,
    prevStudentPreadmissionByRegNoResp: studentPreadmissionByRegNoResp,
    prevFeeReceiptNoResp: feeReceiptNoResp,
    prevFeeStructureForClassResp: feeStructureForClassResp,
    prevStudentLedgerTcResp: studentLedgerTcResp,
    prevFeeCollectionErrorResp: feeCollectionErrorResp
  });

  const paymentFormRef = useRef<any>(null);
  useEffect(() => {
    const { prevAddFeeReceiptResp, prevAcademicYearListResp, prevFeePaymentResp,
      prevStudentPreadmissionByRegNoResp, prevFeeReceiptNoResp, prevFeeStructureForClassResp,
      prevStudentLedgerTcResp, prevFeeCollectionErrorResp } = newFeeReceiptResp.current;
    if (addFeeReceiptResp && prevAddFeeReceiptResp !== addFeeReceiptResp) {
      const baseUrl = window.location.href;
      const { currentPaidAmount, studentDetailId } = createReceiptForm.values,
        { studentName } = selectedStudentState || {};
      const paymentPayload = {
        branchId: 1,
        amount: currentPaidAmount,
        currency: "INR",
        studentID: studentDetailId,
        // successUrl: `${baseUrl}`,
        // cancelUrl: `${baseUrl}`,
        studentName: studentName
      }
      // dispatch(feePaymentAct(generateActionPayload("fee_payment", undefined, paymentPayload)));

      toast.success("Receipt added successfully.");
      const { receiptId } = addFeeReceiptResp;
      if (receiptId) {
        if (location.state) {
          history.push(`/fee-receipts/preview-receipt/${receiptId}`, location.state);
        } else {
          history.push(`/fee-receipts/preview-receipt/${receiptId}`);
        }
      }
      // dispatch(feePaymentAct(generateActionPayload("fee_payment", undefined, paymentPayload)));

      // toast.success("Receipt added successfully.");
      // const { receiptId } = addFeeReceiptResp;
      // if (receiptId) {
      //   if (location.state) {
      //     history.push(`/fee-receipts/preview-receipt/${receiptId}`, {...location.state });
      //   } else {
      //     history.push(`/fee-receipts/preview-receipt/${receiptId}`);
      //   }
      // }
    }
    else if (feePaymentResp && prevFeePaymentResp !== feePaymentResp) {
      const { encRequest, accessCode, actionUrl } = feePaymentResp;
      setPaymentInfoState({
        ccavenueUrl: actionUrl,
        payloadData: encRequest,
        accessCode: accessCode,
      });
      // const { ccavenueurl, access_code, payload } = feePaymentResp;
      // setPaymentInfoState({
      //   // ccavenueUrl: `${ccavenueurl}&encRequest=${payload}&access_code=AVYB04KD80BJ23BYJB`,
      // ccavenueUrl: ccavenueurl,
      // payloadData: payload,
      // accessCode: access_code,
      // });
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
    else if (studentPreadmissionByRegNoResp && prevStudentPreadmissionByRegNoResp !== studentPreadmissionByRegNoResp) {
      if (Array.isArray(studentPreadmissionByRegNoResp)) {
        const updateStudentListByRegNo = studentPreadmissionByRegNoResp.map((item: any) => ({
          studentUidNo: item.studentUidNo,
          studentName: item.studentName,
          registrationNo: item.registrationNo,
          curriculumId: item.curriculumId,
          academicYearId: item.academicYearId,
          classId: item.admissionSoughtId,
          jodoPaymentMethod: item.jodoPaymentMethod
        }));
        setStudentListByRegNoState(updateStudentListByRegNo);
      }
    }
    else if (feeStructureForClassResp && prevFeeStructureForClassResp !== feeStructureForClassResp) {
      const { data: classFeeStructure } = feeStructureForClassResp;
      if (Array.isArray(classFeeStructure)) {
        const updatedClassFeeStructure = classFeeStructure.map((item: any, index: number) => ({
          ...item, isEnabled: index === 0, isChecked: false,
          id: nanoid()
        }));
        setFeeClassStructureState(updatedClassFeeStructure);
      }
      // if (Array.isArray(classFeeStructure)) {
      // let formTotalActualAmount = 0,
      //   formTotalFine = 0,
      //   formPreviouPaidAmount = 0, formAmountToPay = 0,
      //   formTotalConcession = 0,
      //   studentIds: any = [];
      // const { receiptFor } = createReceiptForm.values;
      // for (let i = 0; i < classFeeStructure.length; i++) {
      //   if (receiptFor === "NEW_STUDENT") {
      //     const { netAmount, newAdmissionFeeAmont, feeStructureId } = classFeeStructure[i];
      //     formTotalActualAmount += (!isNaN(newAdmissionFeeAmont) ? Number(newAdmissionFeeAmont) : 0);
      //     formAmountToPay += (!isNaN(netAmount) ? Number(netAmount) : 0);
      //     studentIds.push(feeStructureId);
      //   } else {
      //     const { feeAmount, feeStructureId } = classFeeStructure[i];
      //     formTotalActualAmount += (!isNaN(feeAmount) ? Number(feeAmount) : 0);
      //     formAmountToPay += (!isNaN(feeAmount) ? Number(feeAmount) : 0);
      //     studentIds.push(feeStructureId);
      //   }

      // }
      // //Actaul amount paid is dependent on amout to pay and total fine
      // const actualAmountPaid = formAmountToPay + formTotalFine;
      // createReceiptForm.setValues((prevState: any) => ({
      //   ...prevState,
      //   totalActualAmount: getAmountValueWithDecimal(formTotalActualAmount),
      //   previousPaidAmount: getAmountValueWithDecimal(formPreviouPaidAmount),
      //   currentPaidAmount: getAmountValueWithDecimal(formAmountToPay),
      //   amountToPay: getAmountValueWithDecimal(formAmountToPay),
      //   totalFine: getAmountValueWithDecimal(formTotalFine),
      //   balanceToPay: getAmountValueWithDecimal(0),
      //   fine: getAmountValueWithDecimal(formTotalFine),
      //   cashAmount: getAmountValueWithDecimal(formAmountToPay),
      //   actualPaidAmount: getAmountValueWithDecimal(actualAmountPaid),
      //   totalConcession: getAmountValueWithDecimal(formTotalConcession),
      //   cashToReturn: getAmountValueWithDecimal(0),
      //   studentLedgerIds: studentIds
      // }));
      // }
    }
    else if (feeReceiptNoResp && prevFeeReceiptNoResp !== feeReceiptNoResp) {
      const { receiptNo } = feeReceiptNoResp;
      createReceiptForm.setFieldValue("receiptNo", receiptNo || "");
    }
    else if (feeCollectionErrorResp && feeCollectionErrorResp !== prevFeeCollectionErrorResp) {
      const { details, message }: any = feeCollectionErrorResp;
      toast.error(details || message || "Something went wrong.");
    } else if (studentLedgerTcResp && prevStudentLedgerTcResp !== studentLedgerTcResp) {
      const { isDueForPreAc, feeSummary, academicYearWiseLedgers } = studentLedgerTcResp || {};
      if (isDueForPreAc) {
        const yearKeys = Object.keys(academicYearWiseLedgers).join(', ');
        toast.error(`Fee of ₹${getDisplayAmountValue(feeSummary?.amountToBePaidSum)} 
        for the academic year ${yearKeys} is pending for payment.`);
        return;
      }
      setEditStudentFeeReceiptModalState((prevState: any) => ({
        ...prevState,
        showModal: true,
        studentId: selectedStudentState?.studentId,
        studentCode: selectedStudentState?.studentCode,
      }))
    }
    newFeeReceiptResp.current.prevAddFeeReceiptResp = addFeeReceiptResp;
    newFeeReceiptResp.current.prevAcademicYearListResp = academicYearListResp;
    newFeeReceiptResp.current.prevFeePaymentResp = feePaymentResp;
    newFeeReceiptResp.current.prevFeeReceiptNoResp = feeReceiptNoResp;
    newFeeReceiptResp.current.prevStudentPreadmissionByRegNoResp = studentPreadmissionByRegNoResp;
    newFeeReceiptResp.current.prevFeeStructureForClassResp = feeStructureForClassResp;
    newFeeReceiptResp.current.prevStudentLedgerTcResp = studentLedgerTcResp;
    newFeeReceiptResp.current.prevFeeCollectionErrorResp = feeCollectionErrorResp;
  }, [addFeeReceiptResp, academicYearListResp, feeReceiptNoResp, feePaymentResp, studentPreadmissionByRegNoResp,
    feeStructureForClassResp, studentLedgerTcResp, selectedStudentState,
    feeCollectionErrorResp]);

  useEffect(() => {
    if (location.state) {

      const { curriculumId, classId,
        studentCode, studentId, studentName,
        academicYearId } = location.state;

      createReceiptForm.setValues((prev: any) => ({
        ...prev, receiptFor: 'EXISTING_STUDENT',
        receiptType: "SCHOOL", academicYearId,
        branchCurriculumId: curriculumId,
        branchClassId: classId,
        studentDetailId: studentId
      }));

      getReceiptNoApiCall({ academicYearId });
      dispatch(setBrchClassAct(undefined));
      if (curriculumId) {
        getClassApiCall(curriculumId);
      }
      setSelectedStudentState({ studentName: studentName, studentCode: studentCode, studentId: studentId })
    }

  }, [location])

  useEffect(() => {
    const { ccavenueUrl,
      payloadData,
      accessCode } = paymentInfoState;
    if (ccavenueUrl && payloadData && accessCode) {
      paymentFormRef?.current?.submit();
    }
  }, [paymentInfoState]);

  useEffect(() => {
    return () => {
      dispatch(setStudentLedgerTcAct(undefined))
    }
  }, []);


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
      if (payload.receiptFor === "EXISTING_STUDENT") {
        delete payload.studentRegistrationNo;
      } else {
        delete payload.studentDetailId;
      }
      delete payload.totalFine;
      delete payload.balanceToPay;
      delete payload.previousPaidAmount;
      delete payload.totalConcession;
      
      if (payload.receiptFor === "EXISTING_STUDENT") {
        delete payload.studentLedgerDetails;
        values.ledgerType === "TERM" ? delete payload.studentMonthLedgerIds : delete payload.studentLedgerIds
        dispatch(addFeeReceiptAct(generateActionPayload("add_existing_student_fee_receipt", undefined, payload)));
      } else if (payload.receiptFor === "NEW_STUDENT") {
        delete payload.studentLedgerIds;
        delete payload.studentMonthLedgerIds;
        dispatch(addFeeReceiptAct(generateActionPayload("add_new_student_fee_receipt", undefined, payload)));
      }
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
    setStudentListByRegNoState([]);
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
    const { studentId } = selectedStudent || {};
    const { academicYearId } = createReceiptForm.values;
    if (studentId) {
      dispatch(getStudentLedgerTcAct(generateActionPayload('student_ledger_tc', {
        studentId,
      }, { branchId, academicYearId, isReceipt: 1 })))
    }
    setLedgersState([]);
    createReceiptForm.setFieldValue("studentDetailId", studentId || "");
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


  function onInputSearchByRegNoChange(inputString: any) {
    const { academicYearId, branchCurriculumId } = createReceiptForm.values;
    if (academicYearId) {
      // const params = {
      //   branchId, academicYearId,
      //   curriculumId: branchCurriculumId, enrollmentNumber: "",
      //   searchString: inputString,
      //   pageNo: 0,
      //   pageSize: 10, sortBy: "lastModifiedAt", orderBy: "asc"
      // };
      const params = {
        branchId,
        academicYearId,
        curriculumId: branchCurriculumId || "",
        searchString: inputString,
        pageNo: 0,
        pageSize: 10,
      }
      dispatch(getStudentPreadmissionByRegnoAct(generateActionPayload("get_preadmission_byregNo", undefined, params)));
    }
  }

  function selectedStudentByRegNoHndlr(selectedStudent: any) {
    getClassApiCall(selectedStudent?.curriculumId)
    const { registrationNo, jodoPaymentMethod } = selectedStudent || {};
    if (jodoPaymentMethod === "CRED") {
      setCredConfirmModalState({
        showModal: true,
        modalData: selectedStudent
      })
    } else if (registrationNo) {
      setSelectedStudentByRegNoState(selectedStudent);
    }
    getNewStudentRegistrationFee(selectedStudent);
  }

  function getNewStudentRegistrationFee(studentDetails: any) {
    const { registrationNo, curriculumId, classId, academicYearId } = studentDetails || {};
    if (registrationNo) {
      const params = {
        branchId, academicYearId,
        curriculumId, branchClassId: classId,
        registrationNo
      };
      dispatch(getFeeStructureForClassAct(generateActionPayload("get_fee_structure_forclass", undefined, params)));
    } else {
      //tesitng
    }
    createReceiptForm.setValues((prevState: any) => ({
      ...prevState, "studentRegistrationNo": registrationNo || "",
      branchClassId: classId,
    }));
  }

  function selectedLedgerCallbck(selectedLedgers: any) {
    if (!Array.isArray(selectedLedgers)) {
      return;
    }
    setEditStudentFeeReceiptModalState((prevState: any) => ({
      ...prevState,
      showModal: false,
      studentId: "",
      studentCode: ""
    }));
    setLedgersState(selectedLedgers.map((item: any, index: number) => {
      return ({ ...item, canDelete: (index === selectedLedgers.length - 1) })
    }));
    updateFeePaymentDetails(selectedLedgers);
  }

  function updateFeePaymentDetails(ledgers: any) {
    if (Array.isArray(ledgers)) {
      let formTotalActualAmount = 0,
        formTotalFine = 0,
        formPreviouPaidAmount = 0, formAmountToPay = 0,
        formTotalConcession = 0,
        studentIds: any = [];
      // const studentIds = ledgers.map((item: any) => item.id);
      for (let i = 0; i < ledgers.length; i++) {
        const { amountToPay, amountPaid, totalConcession, amountToBePaid, fineAmount } = ledgers[i];
        formTotalActualAmount += (!isNaN(amountToPay) ? Number(amountToPay) : 0);
        formPreviouPaidAmount += (!isNaN(amountPaid) ? Number(amountPaid) : 0);
        formTotalConcession += (!isNaN(totalConcession) ? Number(totalConcession) : 0);
        formAmountToPay += (!isNaN(amountToBePaid) ? Number(amountToBePaid) : 0);
        formTotalFine += (!isNaN(fineAmount) ? Number(fineAmount) : 0);
        studentIds.push(ledgers[i].id);
      }
      //Actaul amount paid is dependent on amout to pay and total fine
      const actualAmountPaid = formAmountToPay + formTotalFine;
      const { ledgerType } = createReceiptForm.values;
      createReceiptForm.setValues((prevState: any) => ({
        ...prevState,
        totalActualAmount: getAmountValueWithDecimal(formTotalActualAmount),
        previousPaidAmount: getAmountValueWithDecimal(formPreviouPaidAmount),
        currentPaidAmount: getAmountValueWithDecimal(formAmountToPay),
        amountToPay: getAmountValueWithDecimal(formAmountToPay),
        totalFine: getAmountValueWithDecimal(formTotalFine),
        balanceToPay: getAmountValueWithDecimal(0),
        fine: getAmountValueWithDecimal(formTotalFine),
        cashAmount: getAmountValueWithDecimal(formAmountToPay),
        actualPaidAmount: getAmountValueWithDecimal(actualAmountPaid),
        totalConcession: getAmountValueWithDecimal(formTotalConcession),
        cashToReturn: getAmountValueWithDecimal(0),
        ...(ledgerType === "TERM" ? { studentLedgerIds: studentIds } : { studentMonthLedgerIds: studentIds })
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
    const { studentId, studentCode } = selectedStudentState || {};
    const { studentData, isDueForPreAc, feeSummary, academicYearWiseLedgers } = studentLedgerTcResp || {};
    const { academicYearId } = createReceiptForm.values;
    if (!studentLedgerTcResp || studentData?.studentId?.toString() !== studentId?.toString()) {
      dispatch(getStudentLedgerTcAct(generateActionPayload('student_ledger_tc', {
        studentId,
      }, { branchId, academicYearId, isReceipt: 1 })));
      return;
    }
    if (isDueForPreAc) {
      const yearKeys = Object.keys(academicYearWiseLedgers).join(', ');
      toast.error(`Fee of ₹${getDisplayAmountValue(feeSummary?.amountToBePaidSum)} 
        for the academic year ${yearKeys} is pending for payment.`);
      return;
    }
    const selectedLedgersId = ledgersState.map((item: any) => item.id);
    if (studentId) {
      setEditStudentFeeReceiptModalState((prevState: any) => ({
        ...prevState,
        showModal: true,
        studentId,
        studentCode,
        selectedLedgersId
      }))
    }
  }

  const onDeleteLedgerHndlr = useCallback((event: any) => {
    const ledgerId = event.currentTarget.getAttribute("data-id"),
      updateSelectedLedgers: any = ledgersState.filter((item: any) => item.id != ledgerId);

    setLedgersState(updateSelectedLedgers.map((item: any, index: number) => {
      return ({ ...item, canDelete: (index === updateSelectedLedgers.length - 1) })
    }));
    updateFeePaymentDetails(updateSelectedLedgers);
  }, [ledgersState]);

  function onChangeCashAmountHndlr(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    const { fine, amountToPay, bankCharges } = createReceiptForm.values || {};
    let updateActualAmountValue = (Number(value) || 0) + (Number(fine) || 0) + (Number(bankCharges) || 0);

    let balanceToPay = (Number(amountToPay) || 0) - (Number(value) || 0);

    let cashToReturn = (Number(value) || 0) - (Number(amountToPay) || 0);
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

  function onChangeFineHndlr(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target,
      { cashAmount, bankCharges } = createReceiptForm.values || {};
    let updateActualAmountValue = ((Number(value) || 0)) + ((Number(bankCharges) || 0)) + (Number(cashAmount)) || 0;
    createReceiptForm.setValues((prevState: any) => ({
      ...prevState,
      [name]: value,
      totalFine: getAmountValueWithDecimal(value),
      actualPaidAmount: getAmountValueWithDecimal(updateActualAmountValue)
    }));
  }

  function getReceiptNoApiCall(otherProps?: any) {
    const { receiptType, paymentMode, academicYearId } = createReceiptForm.values;
    const params = {
      branchId, instituteId,
      receiptType, paymentMode, academicYearId, ...otherProps
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

  function confirmCredModalHandler() {
    const { modalData } = credConfirmModalState;
    getNewStudentRegistrationFee(modalData);
    setCredConfirmModalState(prevState => ({ ...prevState, showModal: false, modalData: null }));
  }

  function cancelConfirmCredModalHandler() {
    setCredConfirmModalState(prevState => ({ ...prevState, showModal: false, modalData: null }));
    setSelectedStudentByRegNoState({});
    createReceiptForm.setValues((prevState: any) => ({
      ...prevState, "studentRegistrationNo": "",
      branchClassId: ""
    }));
  }

  function onSelectClassHndlr(event: React.ChangeEvent<HTMLInputElement>) {
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

  function handleCcAvenueHndlr() {
    // const { ccavenueUrl,
    //   payloadData,
    //   accessCode } = paymentInfoState;
    // if (payloadData && accessCode) {
    //   paymentFormRef?.current?.submit();
    // } else {
    //   toast.error('encRequest or access code is missing');
    // }
    console.log({ selectedStudentState });
    if (!selectedStudentState) {
      toast.error('Select student to proceed');
      return;
    }
    const paymentPayload = {
      branchId,
      amount: 1,
      customIdentifier: null,
      identifier: selectedStudentState.studentId,
      studentName: selectedStudentState?.studentName,
      identifierType: "STUDENT",
      callbackUrl: `${window.location.origin}/paymentstatus/${branchId}`,
      redirectUrl: window.location.href,
    }
    dispatch(feePaymentAct(generateActionPayload("ccavenue_fee_payment", undefined, paymentPayload)));
  }


  const onChangesingleFeeStructHndlr = useCallback((event: any) => {
    const { checked } = event.currentTarget,
      id = event.currentTarget.getAttribute("data-id"),
      structRowIndex = feeClassStructureState?.findIndex((item: any) => item.id === id);
    // let updateStudentState: any = [...academicLedgerState];
    if (structRowIndex > -1 && Array.isArray(feeClassStructureState)) {
      const updatedFeeStruct: any = feeClassStructureState.map((item: any, index: number) => {
        if (structRowIndex === index) {
          return ({ ...item, isChecked: checked });
        } else if (index === (structRowIndex + 1) && checked) {
          return ({ ...item, isEnabled: true, isChecked: false });
        } else if (index > structRowIndex && !checked) {
          return ({ ...item, isEnabled: false, isChecked: false });
        } else {
          return ({ ...item });
        }
      })
      setIsAllFeeClassStructureCheckedState(updatedFeeStruct.every((item: any) => item.isChecked));
      setFeeClassStructureState(updatedFeeStruct);
      updateClassStructAmount(updatedFeeStruct.filter((item: any) => item.isChecked));
    }
  }, [feeClassStructureState]);

  const onChangeAllFeeStructHndlr = useCallback((event: any) => {
    const { checked } = event.currentTarget;
    if (Array.isArray(feeClassStructureState) && feeClassStructureState.length > 0) {
      const updatedFeeStruct: any = feeClassStructureState.map((item: any, index: number) => {
        if (checked) {
          return ({ ...item, isEnabled: true, isChecked: true })
        } else {
          return ({ ...item, isEnabled: index === 0, isChecked: false })
        }
      });
      setIsAllFeeClassStructureCheckedState(updatedFeeStruct.every((item: any) => item.isChecked));
      setFeeClassStructureState(updatedFeeStruct);
      updateClassStructAmount(updatedFeeStruct.filter((item: any) => item.isChecked));
    }
  }, [feeClassStructureState]);

  function updateClassStructAmount(checkedFeeStruct: any[]) {
    let formTotalActualAmount = 0,
      formTotalFine = 0,
      formPreviouPaidAmount = 0, formAmountToPay = 0,
      formTotalConcession = 0,
      studentIds: any = [], studentLedgerDetails: any = [];
    const { receiptFor } = createReceiptForm.values;
    for (let i = 0; i < checkedFeeStruct.length; i++) {
      if (receiptFor === "NEW_STUDENT") {
        const { netAmount, newAdmissionFeeAmont, feeStructureId, feeTermId } = checkedFeeStruct[i];
        formTotalActualAmount += (!isNaN(newAdmissionFeeAmont) ? Number(newAdmissionFeeAmont) : 0);
        formAmountToPay += (!isNaN(netAmount) ? Number(netAmount) : 0);
        studentIds.push(feeStructureId);
        studentLedgerDetails.push({ ledgerId: feeStructureId, termId: feeTermId })
      } else {
        const { feeAmount, feeStructureId, feeTermId } = checkedFeeStruct[i];
        formTotalActualAmount += (!isNaN(feeAmount) ? Number(feeAmount) : 0);
        formAmountToPay += (!isNaN(feeAmount) ? Number(feeAmount) : 0);
        studentIds.push(feeStructureId);
        studentLedgerDetails.push({ ledgerId: feeStructureId, termId: feeTermId })
      }

    }
    //Actaul amount paid is dependent on amout to pay and total fine
    const actualAmountPaid = formAmountToPay + formTotalFine;
    const { ledgerType } = createReceiptForm.values;
    createReceiptForm.setValues((prevState: any) => ({
      ...prevState,
      totalActualAmount: getAmountValueWithDecimal(formTotalActualAmount),
      previousPaidAmount: getAmountValueWithDecimal(formPreviouPaidAmount),
      currentPaidAmount: getAmountValueWithDecimal(formAmountToPay),
      amountToPay: getAmountValueWithDecimal(formAmountToPay),
      totalFine: getAmountValueWithDecimal(formTotalFine),
      balanceToPay: getAmountValueWithDecimal(0),
      fine: getAmountValueWithDecimal(formTotalFine),
      cashAmount: getAmountValueWithDecimal(formAmountToPay),
      actualPaidAmount: getAmountValueWithDecimal(actualAmountPaid),
      totalConcession: getAmountValueWithDecimal(formTotalConcession),
      cashToReturn: getAmountValueWithDecimal(0),
      ...(ledgerType === "TERM" ? { studentLedgerIds: studentIds } : { studentMonthLedgerIds: studentIds }),
      studentLedgerDetails
    }));
  }

  const ledgersColumns = useMemo(() => feeDetailsColumns(onDeleteLedgerHndlr), [ledgersState]);
  const feeStructureColumns = useMemo(() => generateFeeStructureColumns(
    isAllFeeClassStructureCheckedState,
    onChangesingleFeeStructHndlr,
    onChangeAllFeeStructHndlr), [
    feeClassStructureState,
    isAllFeeClassStructureCheckedState,
    onChangesingleFeeStructHndlr,
    onChangeAllFeeStructHndlr,
  ]);
  return (
    <>
      <div className="page-content new_fee_receipt_page_warp">
        <div className="container-fluid">
          <BreadCrumb title="Fee Receipts" pageTitle="Fee" pageTitleUrl={location.state ? "/student-fee-ledger/fee-details" : "/fee-receipts"}
            linkState={{ studentId: location.state?.studentId, academicYearId: location.state?.academicYearId, curriculumId: location.state?.curriculumId, classId: location.state?.classId }} />
          <BackButtonText title={location.state ? "<< Back to Fee Summary" : "<< Back to Receipt List"} link={(location?.state) ? "/student-fee-ledger/fee-details" : "/fee-receipts"}
            otherDetails={{
              studentId: location.state?.studentId,
              academicYearId: location.state?.academicYearId,
              curriculumId: location.state?.curriculumId,
              classId: location.state?.classId
            }}
          />
          <div className="card">
            <div className="card-header">
              <div className="row align-items-center">
                <div className="col">
                  <h4 className="card-title mb-0 flex-grow-1">
                    Create Receipt
                  </h4>
                </div>
              </div>
            </div>
            <form onSubmit={createReceiptForm.handleSubmit}>
              <div className="card-body">
                <div className="row pb-2" style={{ borderBottom: "2px dashed #CFCFCF" }}>
                  <div className="col-3">
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
                        isDisabled={location.state}
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
                  <div className="col-5">

                  </div>
                  <div className="col-4">
                    <SelectInput
                      name="academicYearId"
                      formgroupClassName="mb-1"
                      // labelText="Academic Year"
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
                    {(createReceiptForm.values.receiptFor === "EXISTING_STUDENT" || !createReceiptForm.values.receiptFor) &&
                      <AutoSearchInputUpdated
                        formgroupClassName="search-box mb-1"
                        alignRight={true}
                        name="studentDetailId"
                        placeHolder="Search..."
                        // onChange={(e: any) => setSearchInputState(e.target.value)}
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
                    }
                    {(createReceiptForm.values.receiptFor === "NEW_STUDENT") && <AutoSearchInputUpdated
                      formgroupClassName="search-box mb-1"
                      alignRight={true}
                      name="studentRegistrationNo"
                      placeHolder="Search By Registration No..."
                      // onChange={(e: any) => setSearchInputState(e.target.value)}
                      onChange={onInputSearchByRegNoChange}
                      onBlur={createReceiptForm.handleBlur}
                      valueKey="registrationNo"
                      labelHeader="Reg. No."
                      labelKey="registrationNo"
                      subLabelHeader="Student Name"
                      subLabelKey="studentName"

                      options={studentListByRegNoState}
                      selected={selectedStudentByRegNoState}
                      selectedOptionCallbck={selectedStudentByRegNoHndlr}
                      isDisabled={location.state}
                      invalid={(createReceiptForm.touched.studentRegistrationNo && createReceiptForm.errors.studentRegistrationNo) ? true : false}
                      error={(createReceiptForm.touched.studentRegistrationNo && createReceiptForm.errors.studentRegistrationNo) ? createReceiptForm.errors.studentRegistrationNo : ""}
                    ><i className="ri-search-line search-icon"></i></AutoSearchInputUpdated>
                    }
                    <SelectInput
                      name="branchCurriculumId"
                      formgroupClassName="mb-1"
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
                      formgroupClassName="mb-1"
                      value={createReceiptForm.values.branchClassId}
                      onChange={onChangeHndlr}
                      onBlur={createReceiptForm.handleBlur}
                      menuItems={branchClassResp?.content}
                      valueKey="id"
                      textKey="shortName"
                      defaultSelect="Class"
                      // isDisabled={location.state || (createReceiptForm.values.receiptFor === "NEW_STUDENT")}
                      isDisabled={true}
                      invalid={(createReceiptForm.touched.branchClassId && createReceiptForm.errors.branchClassId) ? true : false}
                      error={(createReceiptForm.touched.branchClassId && createReceiptForm.errors.branchClassId) ? createReceiptForm.errors.branchClassId : ""}
                    />


                  </div>
                  <div className="col-12 col-xl-2" />
                </div>
                <div className="row g-3 py-2" style={{ borderBottom: "2px dashed #CFCFCF" }}>
                  <div className="col-4">
                    <TextInput
                      name={'receiptNo'}
                      value={createReceiptForm.values.receiptNo}
                      formgroupClassName="mb-0"
                      onChange={createReceiptForm.handleChange}
                      isDisabled={true}
                      labelText="Receipt No"
                    />
                  </div>
                  <div className="col-4">
                    <DateInput
                      name="receiptDate"
                      labelText="Date"
                      value={createReceiptForm.values.receiptDate}
                      onChange={createReceiptForm.handleChange}
                    // isReadOnly={true}
                    />
                  </div>
                  {(createReceiptForm.values.receiptFor !== "NEW_STUDENT") && <div className="col-4">
                    <RadioInputContainer
                      name="challanType"
                      labelText="Challan Type"
                      inputContainerClassName="mt-2"
                      radioOptions={[{ id: "true", name: "Challan" }, { id: "false", name: "Non Challan" }]}
                      value={chalanTypeState}
                      onChange={(e: any) => { setChalanTypeState(e.target.value) }}
                      isDisabled={true}
                    />
                  </div>}

                </div>
                <div className="row py-2" style={{ borderBottom: "2px dashed #CFCFCF" }}>
                  {(createReceiptForm.values.receiptFor !== "NEW_STUDENT") && <>{selectedStudentState && <div className="col-12 mb-2">
                    <button type="button" className="btn btn-outline-primary" onClick={feeDetailsHndlr}>
                      Fee Details
                    </button>
                  </div>}
                    <div className="col-12">
                      <TableContainer
                        columns={ledgersColumns}
                        data={Array.isArray(ledgersState) ? ledgersState : []}
                        divClass="table-responsive mb-1"
                        tableClass="table-nowrap mb-0"
                        theadClass="table-light text-muted align-middle"
                      />
                    </div>
                  </>}
                  {(createReceiptForm.values.receiptFor === "NEW_STUDENT") && <>
                    <div className="col-12">
                      <TableContainer
                        columns={feeStructureColumns}
                        data={feeClassStructureState}
                        divClass="table-responsive mb-1"
                        tableClass="table-nowrap mb-0"
                        theadClass="table-light text-muted align-middle"
                      />
                    </div>
                  </>}
                  <div className="col-12">
                    <span className="d-block invalid-feedback">
                      {createReceiptForm.values.ledgerType === "TERM" ? ((createReceiptForm.touched.studentLedgerIds && createReceiptForm.errors.studentLedgerIds) ? createReceiptForm.errors?.studentLedgerIds?.toString() : "") :
                        (createReceiptForm.touched.studentMonthLedgerIds && createReceiptForm.errors.studentMonthLedgerIds) ? createReceiptForm.errors?.studentMonthLedgerIds?.toString() : ""}
                    </span>
                  </div>
                </div>
                <div className="row py-3">
                  <div className="col-12 col-md-6 col-lg-5 ms-auto">
                    <div className="row d-flex align-items-center mb-2">
                      <div className="col p-0">
                        <h6 className="m-0">Total Actual Amount</h6>
                      </div>
                      <div className="col">
                        <TextInputGroup
                          name="totalActualAmount"
                          formgroupClassName="mb-0"
                          inputgroupClassName="input-group-sm"
                          inputClassName="form-control-sm"
                          inputGroupStart={true}
                          value={createReceiptForm.values.totalActualAmount}
                          onChange={undefined}
                          isDisabled={true}
                        >
                          <RupeeSvg width="11px" height="11px" fill={"#495057"} />
                        </TextInputGroup>
                      </div>
                    </div>
                    <div className="row d-flex align-items-center mb-4">
                      <div className="col p-0">
                        <h6 className="m-0">Total Fine</h6>
                      </div>
                      <div className="col">
                        <TextInputGroup
                          name="totalFine"
                          formgroupClassName="mb-0"
                          inputgroupClassName="input-group-sm"
                          inputClassName="form-control-sm"
                          inputGroupStart={true}
                          value={createReceiptForm.values.totalFine}
                          onChange={undefined}
                          isDisabled={true}
                        >
                          <RupeeSvg width="11px" height="11px" fill={"#495057"} />
                        </TextInputGroup>
                      </div>
                    </div>
                    <div className="row d-flex align-items-center mb-2">
                      <div className="col p-0">
                        <h6 className="m-0">Previous Paid Amount</h6>
                      </div>
                      <div className="col">
                        <TextInputGroup
                          name="previousPaidAmount"
                          formgroupClassName="mb-0"
                          inputgroupClassName="input-group-sm"
                          inputClassName="form-control-sm"
                          inputGroupStart={true}
                          value={createReceiptForm.values.previousPaidAmount}
                          onChange={undefined}
                          isDisabled={true}
                        >
                          <RupeeSvg width="11px" height="11px" fill={"#495057"} />
                        </TextInputGroup>
                      </div>
                    </div>
                    <div className="row d-flex align-items-center  mb-2">
                      <div className="col p-0">
                        <h6 className="m-0">Amount to Pay</h6>
                      </div>
                      <div className="col">
                        <TextInputGroup
                          name="amountToPay"
                          formgroupClassName="mb-0"
                          inputgroupClassName="input-group-sm"
                          inputClassName="form-control-sm"
                          inputGroupStart={true}
                          value={createReceiptForm.values.amountToPay}
                          onChange={undefined}
                          isDisabled={true}
                        >
                          <RupeeSvg width="11px" height="11px" fill={"#495057"} />
                        </TextInputGroup>
                      </div>
                    </div>
                    <div className="row d-flex align-items-center  mb-2">
                      <div className="col p-0">
                        <h6 className="m-0">Current Paid Amount</h6>
                      </div>
                      <div className="col">
                        <TextInputGroup
                          name="currentPaidAmount"
                          formgroupClassName="mb-0"
                          inputgroupClassName="input-group-sm"
                          inputClassName="form-control-sm"
                          inputGroupStart={true}
                          value={createReceiptForm.values.currentPaidAmount}
                          onChange={undefined}
                          isDisabled={true}
                        >
                          <RupeeSvg width="11px" height="11px" fill={"#495057"} />
                        </TextInputGroup>
                        {/* <div className="input-group input-group-sm">
                          <span className="input-group-text">
                            <RupeeSvg width="11px" height="11px" fill={"#878a99"} />
                          </span>
                          <input type="text" className="form-control"
                            disabled={true}
                            value={createReceiptForm.values.currentPaidAmount}
                            onChange={undefined}
                          />
                        </div> */}
                      </div>
                    </div>
                    <div className="row d-flex align-items-center  mb-2">
                      <div className="col p-0">
                        <h6 className="m-0">Balance to Pay</h6>
                      </div>
                      <div className="col">
                        <TextInputGroup
                          name="balanceToPay"
                          formgroupClassName="mb-0"
                          inputgroupClassName="input-group-sm"
                          inputClassName="form-control-sm"
                          inputGroupStart={true}
                          value={createReceiptForm.values.balanceToPay}
                          onChange={undefined}
                          isDisabled={true}
                        >
                          <RupeeSvg width="11px" height="11px" fill={"#495057"} />
                        </TextInputGroup>
                      </div>
                    </div>
                    <div className="row d-flex align-items-center  mb-2">
                      <div className="col p-0">
                        <h6 className="m-0">Cash to Return</h6>
                      </div>
                      <div className="col">
                        <TextInputGroup
                          name="cashToReturn"
                          formgroupClassName="mb-0"
                          inputgroupClassName="input-group-sm"
                          inputClassName="form-control-sm"
                          inputGroupStart={true}
                          value={createReceiptForm.values.cashToReturn}
                          onChange={undefined}
                          isDisabled={true}
                        >
                          <RupeeSvg width="11px" height="11px" fill={"#495057"} />
                        </TextInputGroup>
                      </div>
                    </div>
                    <div className="row d-flex align-items-center  mb-2">
                      <div className="col p-0">
                        <h6 className="m-0">Late Fee charges</h6>
                      </div>
                      <div className="col">
                        <TextInputGroup
                          name="fine"
                          formgroupClassName="mb-0"
                          inputgroupClassName="input-group-sm"
                          inputClassName="form-control-sm"
                          allowedInputRegex="^[0-9]+\.?[0-9]*$"
                          inputGroupStart={true}
                          value={createReceiptForm.values.fine}
                          onChange={onChangeFineHndlr}
                          placeHolder="0.00"
                          onBlur={onBlurAmountHndlr}
                          invalid={(createReceiptForm.touched.fine && createReceiptForm.errors.fine) ? true : false}
                          error={(createReceiptForm.touched.fine && createReceiptForm.errors.fine) ? createReceiptForm.errors.fine : ""}
                        >
                          <RupeeSvg width="11px" height="11px" fill={"#495057"} />
                        </TextInputGroup>
                      </div>
                    </div>
                    <div className="row d-flex align-items-center  mb-4">
                      <div className="col p-0">
                        <h6 className="m-0">Bank Charges/ Card charges</h6>
                      </div>
                      <div className="col">
                        <TextInputGroup
                          name="bankCharges"
                          formgroupClassName="mb-0"
                          inputgroupClassName="input-group-sm"
                          inputClassName="form-control-sm"
                          allowedInputRegex="^[0-9]+\.?[0-9]*$"
                          inputGroupStart={true}
                          placeHolder="0.00"
                          value={createReceiptForm.values.bankCharges}
                          onChange={onChangeBankChargeHndlr}
                          onBlur={onBlurAmountHndlr}
                        >
                          <RupeeSvg width="11px" height="11px" fill={"#495057"} />
                        </TextInputGroup>
                      </div>
                    </div>
                    <div className="row d-flex align-items-center pb-3 mb-3" style={{ borderBottom: "2px dashed #CFCFCF" }}>
                      <div className="col p-0">
                        <h6 className="m-0">{amountLabel}</h6>
                      </div>
                      <div className="col">
                        <TextInputGroup
                          name="cashAmount"
                          formgroupClassName="mb-0"
                          inputgroupClassName="input-group-sm"
                          inputClassName="form-control-sm"
                          // allowedInputRegex="^\d+\.\d{1,2}$"
                          // allowedInputRegex="^[0-9]+$"
                          allowedInputRegex="^[0-9]+\.?[0-9]*$"
                          inputGroupStart={true}
                          value={createReceiptForm.values.cashAmount}
                          onChange={onChangeCashAmountHndlr}
                          onBlur={onBlurAmountHndlr}
                          placeHolder="0.00"
                          invalid={(createReceiptForm.touched.cashAmount && createReceiptForm.errors.cashAmount) ? true : false}
                          error={(createReceiptForm.touched.cashAmount && createReceiptForm.errors.cashAmount) ? createReceiptForm.errors.cashAmount : ""}
                        >
                          <RupeeSvg width="11px" height="11px" fill={"#495057"} />
                        </TextInputGroup>
                      </div>
                    </div>
                    <div className="row d-flex align-items-center">
                      <div className="col p-0">
                        <h6 className="m-0">Actual Paid Amount</h6>
                      </div>
                      <div className="col">
                        <TextInputGroup
                          name="actualPaidAmount"
                          formgroupClassName="mb-0"
                          inputgroupClassName="input-group-sm"
                          inputClassName="form-control-sm"
                          inputGroupStart={true}
                          value={createReceiptForm.values.actualPaidAmount}
                          onChange={undefined}
                          isDisabled={true}
                        >
                          <RupeeSvg width="11px" height="11px" fill={"#495057"} />
                        </TextInputGroup>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row py-1">
                  <div className="col-4 mb-3">
                    <h6 className="fw-400 text-muted" >PAYMENT DETAILS</h6>
                    <SelectInput
                      name="paymentMode"
                      labelText="Payment Mode"
                      formgroupClassName="mb-3"
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
                      labelText='Remarks'
                      value={createReceiptForm.values.remarks}
                      onChange={createReceiptForm.handleChange}
                      onBlur={createReceiptForm.handleBlur}
                      formgroupClassName='mb-0'
                      invalid={(createReceiptForm.touched.remarks && createReceiptForm.errors.remarks) ? true : false}
                      error={(createReceiptForm.touched.remarks && createReceiptForm.errors.remarks) ? createReceiptForm.errors.remarks : ""}
                    />
                  </div>
                </div>
                <div className="row mt-3">
                  <h6 className="p-0">Noted</h6>
                  <p className="py-2 w-100 rounded" style={{ backgroundColor: "#BFE1F4", color: "#1F75A4" }}>Fee is not refundable after the commencement of the session or after the student stops attending or leave the School or leave the school in the mid of Session or are suspended by the School owing to non-attendance or misconduct.</p>
                </div>
                <div className="row ">
                  <div className="col-6 d-flex justify-content-end align-items-center">
                    {smsAndEmailMenu && smsAndEmailMenu.map((item: any) => {
                      return (
                        <div key={item.id} className="ms-3">
                          <InputCheckbox
                            name={`${item.id}`}
                            labelName={item.name}
                            value={item.selected}
                            onChange={onSelectClassHndlr}
                            dataId={item.id}
                          />
                        </div>
                      )
                    })}
                  </div>
                  <div className="col ms-auto d-flex justify-content-end">
                    {/* <button className="btn btn-danger px-4 me-2">
                      <PrintSvg className="me-2 d-inline-block" stroke="#FFFFFF" />Send Receipt
                    </button>
                    <button className="btn px-4 me-2" style={{ backgroundColor: "#405189", color: "#FFFFFF" }}><DownloadSvg fill="#cfcfcf" className="me-2 d-inline-block" />Download Receipt
                    </button> */}
                    <button className="btn btn-success px-4"
                      type="submit"
                      disabled={showApiLoader}
                    > Save
                    </button>
                    {paymentType === 'ccavenue' && <button className="btn btn-success px-4 ms-4 ml-4"
                      type="button"
                      disabled={showApiLoader}
                      onClick={handleCcAvenueHndlr}
                    > Pay CC Avenue
                    </button>}
                  </div>
                </div>
              </div>
            </form>
            <form id="nonseamless" ref={paymentFormRef} method="post" name="redirect"
              action={paymentInfoState.ccavenueUrl}>
              {/* <input type="hidden" name="command" id="command" value="initiateTransaction" /> */}
              <input type="hidden" id="encRequest" name="encRequest" value={paymentInfoState.payloadData} />
              <input type="hidden" name="access_code" id="access_code" value={paymentInfoState.accessCode} />
              {/* <button className="btn btn-success px-4"
                type="submit"
              > Submit Payment
              </button> */}
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
          ledgerType={createReceiptForm.values.ledgerType}
          event={createReceiptForm}
        />
      </ModalContainerUpdated>

      <ConfirmationModal
        id="confirm-receipt-modal"
        btnClassName="btn w-sm btn-success"
        isOpen={credConfirmModalState.showModal}
        confirmMessage="Are you sure you want to create receipt for CRED payment method?"
        cancelHndlr={cancelConfirmCredModalHandler}
        confirmHndlr={confirmCredModalHandler}
      />
    </>
  );
};

export default NewFeeReceiptPage;
