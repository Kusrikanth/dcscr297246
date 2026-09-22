import React, { useRef, useEffect, useMemo, useState, useCallback } from "react";
import { useFormik } from "formik";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
// Formik validation
import * as Yup from "yup";
import {
  AutoSearchInput,
  DateInput,
  SelectInput,
  TextArea,
  TextInput,
  TextInputGroup,
  AutoSearchInputUpdated,
  ModalContainerUpdated,
  MultipleFileUpload
} from "../../../../Components/Common";
import BackButtonText from "../../../../Components/Common/BackButtonText";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import { IMenuOptions } from "./feeRefundPageTypes";
import {
  feeAdjustmentColumns,
  paymentOptions,
  createRefundPayload,
  feeRefundColumns,
  finePaidReceiptSelectColumns,
  finePaidAdjustLedgerColumns,
  getRefundableFineAmount,
  USE_SAMPLE_FINE_PAID_REFUND,
  USE_SAMPLE_REFUND_SUBMIT,
  sampleFinePaidReceipts,
  samplePendingLedgersForFineAdjust
} from "./helper";
import { default as RupeeSvg } from "../../../../assets/imagesdps/feeDashboard/RupeeSvg.svg?react";
import TableContainer from "../../../../Components/Common/TableContainer";
import { receiptForOptions } from "./helper";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
//Action Generator
import { generateActionPayload } from "../../../../utility/reduxutility";
import {
  getStudentsListAct, setStudentsListAct
} from "../../../../store/directory/studentmanagement/studentmanagementactions";
import {
  getInstAcademicYearAct,
} from "../../../../store/mastersettings/instacademics/instacademicactions";
import {
  getBranchCurriculumAct, getBranchClassAct,
  setBrchClassAct,
} from "../../../../store/branchsettings/branchacademics/branchacademicsactions";
import {
  addFeeRefundAct, getStudentRefundLedgerAct,
  setStudentRefundLedgersAct, getStuForFeeAdjustAct, getLedgerForFeeAdjustAct,
  getStudentLedgersForFeeAdjustExcessAmountAct
} from "../../../../store/fee/feecollections/feecollectionactions";
//Utility
import { useHistory, useLocation } from "react-router-dom";
import { getAmountValueWithDecimal } from "../../../../utility/commonutility";
import { validateOnChange, touchFieldOnBlur } from "../../../../utility/validationutility";
import { default as ConfirmationIcon } from "../../../../assets/imagesdps/academics/confirmation-icon.svg?react";
import { getMasterBanksAct } from "../../../../store/masterdata/masterdataactions";
import Button from "../../../../Components/Common/Button";

export const MenuOptions: Array<IMenuOptions> = [
  {
    id: "feeDetails",
    labelName: "1. Fee Details",
  },
  {
    id: "refundDetails",
    labelName: "2. Refund Details",
  },
];

const termsValidationSchema = Yup.array().of(
  Yup.object().shape({
    amountToPay: Yup.string(),
    adjustAmount: Yup.string().test("isAdjustAmountLessThanAmountToPay", "Adjust amount cannot be more that amount to pay.",
      (value: any, schema: any) => {
        if (Math.round(value) > Math.round(schema?.parent?.amountToPay)) {
          return false;
        }
        return true;
      }),
  })
);


const validationSchema = Yup.object().shape({
  branchClassId: Yup.string().required("Select branch class."),
  branchCurriculumId: Yup.string().required("Select branch curriculum."),
  academicYearId: Yup.string().required("Select academic year."),
  studentDetailId: Yup.string().required("Student is required."),
  // A Fine Paid refund is settled by adjusting it into the student's ledgers, so it has no payment details.
  paymentMode: Yup.string().when('refundFor', {
    is: (item: any) => item !== "FINE_PAID",
    then: Yup.string().required("Select payment mode.")
  }),
  totalRefundAmount: Yup.string(),
  // studentRefundLedgerIds: Yup.array().min(1, "No fee refund ledger is there to fill."),
  // refundableAmount: Yup.string().test("totalRefundAmount", "Refundable amount should be Less than or equal to total refund amount.",
  //   (value: any, schema: any) => {
  //     if (Math.round(value) > Math.round(schema?.parent?.totalRefundAmount)) {
  //       return false;
  //     }
  //     return true;
  //   }),
  totalAdjustAmount: Yup.string().test("finalRefundableAmount", "Adjust amount should be equal to total refund amount. Enter value in the adjusting ledger by searching student.",
    (value: any, schema: any) => {
      if (schema?.parent?.paymentMode === "ADJUSTMENT" && Math.round(value) !== Math.round(+schema?.parent?.finalRefundableAmount)) {
        return false;
      }
      return true;
    }),
  // paymentAmount: Yup.string().when('paymentMode', {
  //   is: (item: any) => (item === "CASH" || item === "ONLINE" || item === "CHEQUE"),
  //   then: Yup.string().test("refundableAmount", "Amount should be equal to total refund amount.",
  //     (value: any, schema: any) => {
  //       if (Math.round(value) !== Math.round(schema?.parent?.refundableAmount)) {
  //         return false;
  //       }
  //       return true;
  //     })
  // }),
  // remarks: Yup.string().when('paymentMode', {
  //   is: (item: any) => (item === "CHEQUE" || item === "ADJUSTMENT"),
  //   then: Yup.string().required("Remarks is required.")
  // }),
  onlineDetailDTO: Yup.object().when('paymentMode', {
    is: (item: any) => item === "ONLINE",
    then: Yup.object({
      transactionId: Yup.string().required("Transaction id is required."),
      transactionDate: Yup.string().required("Transaction date is required."),
    })
  }),
  feeRefundChequeDTO: Yup.object().when('paymentMode', {
    is: (item: any) => item === "CHEQUE",
    then: Yup.object({
      chequeDate: Yup.string().required('Cheque date is required.'),
      accountPayeeName: Yup.string().required('Payee name is required.'),
      bankName: Yup.string().required('Bank name is required.'),
      chequeNumber: Yup.string().required('Cheque number is required.')
      // ...etc
    })
  }),
  attachments: Yup.array().min(1, "Attach a PDF or image file."),
  adjustedStudentDetailsId: Yup.string().when('paymentMode', {
    is: (item: any) => (item === "ADJUSTMENT"),
    then: Yup.string().required("Search student after selecting academic year, curriculum.")
  })
});


const initialValueRefundForm = {
  refundFor: "EXCESS_AMOUNT",
  feeDetailDTOList: [],
  refundableAmount: "0.00",
  instituteId: "",
  branchId: "",
  branchClassId: "",
  branchCurriculumId: "",
  academicYearId: "",
  paymentAmount: "0.00",
  studentDetailId: "",
  studentRefundLedgerIds: [],
  feeRefundChequeDTO: {
    chequeDate: "",
    accountPayeeName: "",
    bankName: "",
    chequeNumber: ""
  },
  feeRefundAdjustDetailDTO: {},
  onlineDetailDTO: {
    transactionId: "",
    transactionDate: ""
  },
  paymentMode: "",
  branchName: "",
  remarks: "",
  totalAmountToPay: "0.00",
  totalNetAmount: "0.00",
  totalAmountPaid: "0.00",
  totalRefundAmount: "0.00",
  totalAdjustAmount: "0.00",
  finalRefundableAmount: "0.00",
  adjustedStudentDetailsId: "",
  newStudentId: "",
  studentName: "",
  attachments: [] as Array<File>,
}

// Supporting document required for every refund.
const REFUND_ATTACHMENT_TYPES = ["application/pdf", "image/png", "image/jpeg"];

// Shapes a student's pending ledgers into rows for the "Adjust To Fees" table.
const toAdjustingLedgerRows = (ledgers: Array<any>) => ledgers.map((ledger: any) => ({
  studentLedgerId: ledger.id,
  feeDetails: ledger.feeDetails,
  amountToBePaid: ledger.amountToBePaid,
  amountPaid: ledger.amountPaid,
  amountToPay: ledger.amountToPay,
  netAmount: ledger.netAmount,
  academicYear: ledger.academicYear,
  paymentStatus: ledger.paymentStatus,
  adjustAmount: "0.00"
}));

// Shapes a student's pending ledgers into refund rows for Fine Paid, where the fine is adjusted.
const toFineAdjustLedgerRows = (ledgers: Array<any>) => ledgers.map((ledger: any) => ({
  id: ledger.id,
  feeName: ledger.feeDetails,
  academicYear: ledger.academicYear,
  netAmount: ledger.netAmount,
  amountPaid: ledger.amountPaid,
  amountToBePaid: ledger.amountToBePaid,
  paymentStatus: ledger.paymentStatus,
  refundAmount: 0,
  isSelected: false
}));

const FeeRefundPage = () => {
  const location: any = useLocation();
  const history = useHistory();
  const [selectedStudentState, setSelectedStudentState] = useState<any>(null);
  const [allFeeSelectedState, setAllFeeSelectedState] = useState(false);
  const [feeRefundList, setFeeRefundList] = useState<any>([]);
  const [selectedAdjustableStudentState, setSelectedAdjustableStudentState] = useState<any>(null);
  const [adjustingFeeLedgerState, setAdjustingFeeLedgerState] = useState<Array<any>>([]);
  const [allAdjustLedgerSelectedState, setAllAdjustLedgerSelectedState] = useState(false);
  const [finePaidReceiptsState, setFinePaidReceiptsState] = useState<Array<any>>([]);
  const [selectedFineReceiptState, setSelectedFineReceiptState] = useState<any>(null);
  const [fineReceiptModalState, setFineReceiptModalState] = useState({
    showModal: false,
    selectedReceiptId: '',
    refundFineAmount: ''
  });
  // get_ledgers_fee_adjust also serves the ADJUSTMENT student search; this marks a Fine Paid request.
  const fineLedgersRequestRef = useRef(false);
  const [showWarningModalState, setShowWarningModalState] = useState({
    showModal: false,
    warningMessage: '',
    studentName: ''
  });
  const dispatch = useAppDispatch();
  const {
    branchClassResp,
    academicYearListResp, brchCurriculumResp,
    currentInstIdResp: instituteId, currentBranchIdResp: branchId,
    studentsListResp, studentRefundLedgerResp, addFeeRefundResp, studentLedgersResp, getLedgerForFeeAdjustResp, getStudentLedgersForFeeAdjustExcessAmountResp,
    feeCollectionErrorResp, getStuForFeeAdjustResp, masterBanksResp } =
    useAppSelector(({ appData, directoryStudent, branchAcademics, feeCollections,
      instAcademics, masterData }) => ({
        branchClassResp: branchAcademics.branchClassResp,
        brchCurriculumResp: branchAcademics.brchCurriculumResp,
        academicYearListResp: instAcademics.academicYearListResp,
        currentInstIdResp: appData.currentInstIdResp,
        currentBranchIdResp: appData.currentBranchIdResp,
        studentsListResp: directoryStudent.studentsListResp,
        studentRefundLedgerResp: feeCollections.studentRefundLedgerResp,
        addFeeRefundResp: feeCollections.addFeeRefundResp,
        getLedgerForFeeAdjustResp: feeCollections.getLedgerForFeeAdjustResp,
        studentLedgersResp: feeCollections.studentLedgersResp,
        getStuForFeeAdjustResp: feeCollections.getStuForFeeAdjustResp,
        getStudentLedgersForFeeAdjustExcessAmountResp: feeCollections.getStudentLedgersForFeeAdjustExcessAmountResp,
        feeCollectionErrorResp: feeCollections.feeCollectionErrorResp,
        masterBanksResp: masterData.masterBanksResp,
      }), shallowEqual);

  const feeRefundRespRef = useRef({
    prevAcademicYearListResp: academicYearListResp,
    prevStudentLedgersResp: studentLedgersResp,
    prevAddFeeRefundResp: addFeeRefundResp,
    prevGetLedgerForFeeAdjustResp: getLedgerForFeeAdjustResp,
    prevFeeCollectionErrorResp: feeCollectionErrorResp
  });

  useEffect(() => {
    const { prevAcademicYearListResp, prevAddFeeRefundResp,
      prevStudentLedgersResp, prevFeeCollectionErrorResp, prevGetLedgerForFeeAdjustResp } = feeRefundRespRef.current;
    if (academicYearListResp && prevAcademicYearListResp !== academicYearListResp) {
      const { academicYearId } = addFeeRefundForm.values;
      if (!academicYearId && Array.isArray(academicYearListResp?.data)) {
        const { academicYearId } = academicYearListResp.data?.find((year: any) => year.yearStatus === "CURRENT") || {};
        if (academicYearId) {
          addFeeRefundForm.setFieldValue("academicYearId", academicYearId);
        }
      }
    }
    else if (addFeeRefundResp && prevAddFeeRefundResp !== addFeeRefundResp) {
      toast.success("Refund added successfully.");
      if (location.state) {
        history.push(`/student-fee-ledger/fee-details`, { ...location.state });
      } else {
        history.push("/fee-refunds");
      }
    }
    else if (getLedgerForFeeAdjustResp && getLedgerForFeeAdjustResp !== prevGetLedgerForFeeAdjustResp) {
      // const { ledgers } = getLedgerForFeeAdjustResp;
      if (Array.isArray(getLedgerForFeeAdjustResp) && fineLedgersRequestRef.current) {
        fineLedgersRequestRef.current = false;
        if (getLedgerForFeeAdjustResp.length === 0) {
          setShowWarningModalState(prevState => ({
            ...prevState, showModal: true,
            warningMessage: 'There is no pending ledger to adjust the fine amount for the selected student.',
            studentName: selectedStudentState?.studentName || ""
          }));
        }
        setFeeRefundList(toFineAdjustLedgerRows(getLedgerForFeeAdjustResp));
      } else if (Array.isArray(getLedgerForFeeAdjustResp)) {
        if (getLedgerForFeeAdjustResp.length === 0) {
          setShowWarningModalState(prevState => ({
            ...prevState, showModal: true,
            warningMessage: 'There is no ledger available to adjust for the selected student.',
            studentName: selectedAdjustableStudentState?.studentName || ""
          }));
          setAdjustingFeeLedgerState([]);
        } else {
          setAdjustingFeeLedgerState(toAdjustingLedgerRows(getLedgerForFeeAdjustResp));
        }
      }
    }
    else if (feeCollectionErrorResp && feeCollectionErrorResp !== prevFeeCollectionErrorResp) {
      const { message }: any = feeCollectionErrorResp;
      toast.error(message || "Something went wrong.");
    }
    feeRefundRespRef.current.prevAcademicYearListResp = academicYearListResp;
    feeRefundRespRef.current.prevAddFeeRefundResp = addFeeRefundResp;
    feeRefundRespRef.current.prevStudentLedgersResp = studentLedgersResp;
    feeRefundRespRef.current.prevGetLedgerForFeeAdjustResp = getLedgerForFeeAdjustResp;
    feeRefundRespRef.current.prevFeeCollectionErrorResp = feeCollectionErrorResp;
  }, [academicYearListResp, addFeeRefundResp, studentLedgersResp, feeCollectionErrorResp, getLedgerForFeeAdjustResp]);

  useEffect(() => {
    if (location.state) {
      const { curriculumId, classId,
        studentCode, studentId, studentName,
        academicYearId } = location.state;
      addFeeRefundForm.setValues((prev: any) => ({
        ...prev, refundFor: 'EXCESS_AMOUNT',
        academicYearId, branchCurriculumId: curriculumId, branchClassId: classId,
        studentDetailId: studentId
      }))
      dispatch(setBrchClassAct(undefined));
      if (curriculumId) {
        getClassApiCall(curriculumId);
      }
      if (studentId) {
        const params = { studentDetailId: studentId, academicYearId, refundFor: "EXCESS_AMOUNT" };
        dispatch(getStudentRefundLedgerAct(generateActionPayload("get_student_refund_ledger", undefined, params)));
      }
      setSelectedStudentState({ studentName: studentName, studentCode: studentCode, studentId })
    }
    return () => {
      //Clear Data On Unmount
      dispatch(setStudentRefundLedgersAct(undefined));
    }
  }, [])


  useEffect(() => {
    if (instituteId) {
      const payload = { instituteId, sortBy: "academicYearName", orderBy: "desc", pageNo: 0, pageSize: 20 };
      dispatch(getInstAcademicYearAct(generateActionPayload("get_inst_academic_year", undefined, payload)));

      dispatch(getMasterBanksAct(generateActionPayload("get_master_banks", undefined, { pageNo: 0, pageSize: 100 })));
    }
  }, [instituteId]);

  useEffect(() => {
    if (studentRefundLedgerResp && Array.isArray(studentRefundLedgerResp)) {
      if (studentRefundLedgerResp.length === 0) {
        setShowWarningModalState(prevState => ({
          ...prevState, showModal: true,
          warningMessage: addFeeRefundForm.values.refundFor === "FINE_PAID"
            ? 'There is no fine paid receipt to refund for the selected student.'
            : 'There is no fee to refund for the selected student.',
          studentName: selectedStudentState?.studentName || ""
        }));
      }
      if (addFeeRefundForm.values.refundFor === "FINE_PAID") {
        setFinePaidReceiptsState(studentRefundLedgerResp);
        if (studentRefundLedgerResp.length > 0) {
          setFineReceiptModalState({ showModal: true, selectedReceiptId: '', refundFineAmount: '' });
        }
        return;
      }
      setFeeRefundList(studentRefundLedgerResp?.map((item: any) => ({
        ...item,
        refundAmount: 0,
        isSelected: false
      })))
    }
  }, [studentRefundLedgerResp])

  // useEffect(() => {
  //   if (Array.isArray(feeRefundList) && feeRefundList.length > 0) {
  //     let formAmountToPay = 0,
  //       formNetAmount = 0,
  //       formAmountPaid = 0, formRefundAmount = 0,
  //       studentRefundLedgerIds: any = [];
  //     for (let i = 0; i < feeRefundList.length; i++) {
  //       const { id, amountToPay, netAmount, amountPaid, refundedAmount, isSelected } = feeRefundList[i];
  //       if (isSelected) {
  //         formAmountToPay += (!isNaN(amountToPay) ? Number(amountToPay) : 0);
  //         formNetAmount += (!isNaN(netAmount) ? Number(netAmount) : 0);
  //         formAmountPaid += (!isNaN(amountPaid) ? Number(amountPaid) : 0);
  //         formRefundAmount += (!isNaN(refundedAmount) ? Number(refundedAmount) : 0);
  //         studentRefundLedgerIds.push(id);
  //       }
  //     }
  //     addFeeRefundForm.setValues((prevState: any) => ({
  //       ...prevState,
  //       studentRefundLedgerIds,
  //       totalAmountToPay: getAmountValueWithDecimal(formAmountToPay),
  //       totalNetAmount: getAmountValueWithDecimal(formNetAmount),
  //       totalAmountPaid: getAmountValueWithDecimal(formAmountPaid),
  //       totalRefundAmount: getAmountValueWithDecimal(formRefundAmount),
  //       refundableAmount: getAmountValueWithDecimal(formRefundAmount),
  //       finalRefundableAmount: getAmountValueWithDecimal(formRefundAmount),
  //     }))
  //   }
  // }, [feeRefundList]);

  const addFeeRefundForm = useFormik({
    initialValues: initialValueRefundForm,
    validationSchema,
    onSubmit: (values) => {
      const payload = createRefundPayload(values, feeRefundList, adjustingFeeLedgerState);
      payload.instituteId = instituteId;
      payload.branchId = branchId;
      payload.feeDetailDTOList = payload?.feeDetailDTOList?.map((item: any, index: any) => {
        if ((+feeRefundList[index]?.id === +item?.studentLedgerId) && (feeRefundList[index]?.isSelected === true)) {
          return item;
        }
      }).filter(f => f)
      // Fine Paid refunds also carry the receipt the fine was collected on.
      const requestPayload = values.refundFor === "FINE_PAID"
        ? { ...payload, receiptId: selectedFineReceiptState?.id }
        : payload;
      if (USE_SAMPLE_REFUND_SUBMIT) {
        // Not sent to the server; the refund is shown on the Fee Refunds list instead.
        console.info("Sample refund submit (not sent):", requestPayload, values.attachments);
        toast.success("Refund added (sample mode, not saved to the server).");
        if (location.state) {
          history.push(`/student-fee-ledger/fee-details`, { ...location.state });
        } else {
          history.push("/fee-refunds", { sampleCreatedRefund: toSampleRefundListRow(values) });
        }
        return;
      }
      // Every refund carries a mandatory supporting document, so it goes as multipart like concession documents.
      const formData = new FormData();
      values.attachments.forEach((file: File) => formData.append("file", file));
      formData.append("request", JSON.stringify(requestPayload));

      dispatch(addFeeRefundAct(generateActionPayload("add_fee_refund", undefined, formData)));
    },
  });

  // Shapes a sample-mode refund like a Fee Refunds list row; its attachments open from this browser session.
  function toSampleRefundListRow(values: any) {
    const now = new Date();
    const { paymentMode, refundFor } = values;
    const refundAmount = +values.finalRefundableAmount || 0;
    const isAdjustment = ["ADJUSTMENT", "CT_ADJUSTMENT"].includes(paymentMode);
    // A Fine Paid refund is adjusted into the same student's ledgers.
    const adjustedStudent = refundFor === "FINE_PAID"
      ? selectedStudentState
      : paymentMode === "ADJUSTMENT" ? selectedAdjustableStudentState : null;
    return {
      id: `sample-${now.getTime()}`,
      refundFor,
      refundDate: now.toISOString(),
      studentName: selectedStudentState?.studentName,
      studentCode: selectedStudentState?.studentCode,
      branchName: "",
      curriculumName: brchCurriculumResp?.data?.find((item: any) => String(item.branchCurriculumId) === String(values.branchCurriculumId))?.curriculumName,
      classShortName: branchClassResp?.content?.find((item: any) => String(item.id) === String(values.branchClassId))?.shortName,
      refundAmount,
      paymentMode,
      transactionId: values.onlineDetailDTO?.transactionId,
      transactionDate: paymentMode === "ONLINE" ? values.onlineDetailDTO?.transactionDate
        : paymentMode === "CHEQUE" ? values.feeRefundChequeDTO?.chequeDate : "",
      adjustAmount: refundFor === "FINE_PAID" ? refundAmount : isAdjustment ? +values.totalAdjustAmount || 0 : 0,
      adjustedStudentName: adjustedStudent?.studentName,
      adjustedStudentCode: adjustedStudent?.studentCode,
      cashAmount: paymentMode === "CASH" ? refundAmount : 0,
      chequeAmount: paymentMode === "CHEQUE" ? refundAmount : 0,
      chequeNumber: values.feeRefundChequeDTO?.chequeNumber,
      accountPayeeName: values.feeRefundChequeDTO?.accountPayeeName,
      createdAt: now.toISOString().slice(0, 19),
      fileInfo: values.attachments.map((file: File, index: number) => ({
        id: `${now.getTime()}-${index}`,
        originalFileName: file.name,
        s3URL: URL.createObjectURL(file),
      })),
    };
  }

  useEffect(() => {
    if (branchId) {
      const { academicYearId } = addFeeRefundForm.values;
      const brchCurriculumparams = { branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", academicYearId, orderBy: "asc" };
      dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, brchCurriculumparams)));
    }
  }, [branchId, addFeeRefundForm.values.academicYearId]);

  function onChangeHndlr(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target,
      { refundFor, branchCurriculumId, branchClassId, academicYearId } = addFeeRefundForm.values;
    if (name === "branchCurriculumId") {
      dispatch(setBrchClassAct(undefined));
      if (value) {
        getClassApiCall(value);
      }
      // addFeeRefundForm.setValues((prevState: any) => ({
      //   ...prevState, [name]: value, branchClassId: "",
      //   studentDetailId: ""
      // }))
      addFeeRefundForm.resetForm({
        values: {
          ...initialValueRefundForm, [name]: value,
          refundFor, academicYearId
        }
      });
      setFeeRefundList([])

    } else if (name === "branchClassId") {
      // addFeeRefundForm.setValues((prevState: any) => ({ ...prevState, [name]: value, studentDetailId: "" }))
      addFeeRefundForm.resetForm({
        values: {
          ...initialValueRefundForm, [name]: value,
          academicYearId, branchCurriculumId, refundFor
        }
      });
      setFeeRefundList([])
    } else if (name === "academicYearId") {
      addFeeRefundForm.resetForm({
        values: {
          ...initialValueRefundForm, [name]: value, refundFor
        }
      });
      setFeeRefundList([])
    }
    setSelectedStudentState(null);
    clearFinePaidReceipts();
    dispatch(setStudentsListAct({}));
    dispatch(setStudentRefundLedgersAct(undefined));
  }

  function onChangeRefundForHndlr(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target,
      { branchCurriculumId, studentDetailId, branchClassId, academicYearId } = addFeeRefundForm.values;
    addFeeRefundForm.resetForm({
      values: {
        ...initialValueRefundForm, [name]: value, studentDetailId,
        academicYearId, branchCurriculumId, branchClassId,
      }
    });
    setFeeRefundList([]);
    setAllFeeSelectedState(false);
    setAdjustingFeeLedgerState([]);
    setAllAdjustLedgerSelectedState(false);
    clearFinePaidReceipts();
    if (studentDetailId && academicYearId) {
      // const params = { studentDetailId: 1, academicYearId: 2, refundFor };
      loadRefundRows(studentDetailId, academicYearId, value);
    }
    dispatch(setStudentsListAct({}));
    dispatch(setStudentRefundLedgersAct(undefined));
  }

  function clearFinePaidReceipts() {
    setFinePaidReceiptsState([]);
    setSelectedFineReceiptState(null);
  }

  // Fine Paid first lists the student's receipts on which a fine was collected (picked in a modal);
  // other types list the refundable fee ledgers directly.
  function loadRefundRows(studentDetailId: any, academicYearId: any, refundFor: string) {
    if (refundFor === "FINE_PAID") {
      clearFinePaidReceipts();
      setFeeRefundList([]);
      setAllFeeSelectedState(false);
      if (USE_SAMPLE_FINE_PAID_REFUND) {
        setFinePaidReceiptsState(sampleFinePaidReceipts);
        setFineReceiptModalState({ showModal: true, selectedReceiptId: '', refundFineAmount: '' });
        return;
      }
    }
    const params = { studentDetailId, academicYearId, refundFor };
    dispatch(getStudentRefundLedgerAct(generateActionPayload("get_student_refund_ledger", undefined, params)));
  }

  // The selected receipt's fine is adjusted against the student's ledgers that still have an amount due.
  function loadFineAdjustLedgers(studentId: any) {
    if (USE_SAMPLE_FINE_PAID_REFUND) {
      setFeeRefundList(toFineAdjustLedgerRows(samplePendingLedgersForFineAdjust));
      return;
    }
    setFeeRefundList([]);
    if (studentId) {
      fineLedgersRequestRef.current = true;
      dispatch(getLedgerForFeeAdjustAct(generateActionPayload("get_ledgers_fee_adjust", { id: studentId })));
    }
  }


  function getClassApiCall(curriculumId: string) {
    // sortBy: "className", orderBy: "asc"
    const { academicYearId } = addFeeRefundForm.values;
    const payload = { pageNo: 0, pageSize: 100, sortBy: "classSequence", orderBy: "asc", academicYearId, curriculumId, branchId };
    dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
  }

  function onInputSearchChange(inputString: any) {
    const { academicYearId, branchClassId, branchCurriculumId } = addFeeRefundForm.values;
    if (academicYearId) {
      const params = {
        branchId, academicYearId, classId: branchClassId,
        curriculumId: branchCurriculumId, searchString: inputString,
        isActive: false,
      };
      dispatch(getStudentsListAct(generateActionPayload("get_students", undefined, params)));
    }
  }

  function selectedStudentHndlr(selectedStudent: any) {
    const { academicYearId, refundFor } = addFeeRefundForm.values;
    setSelectedStudentState(selectedStudent);
    const { studentId, curriculumId, classId } = selectedStudent || {};
    if (studentId) {
      // const params = { studentDetailId: 1, academicYearId: 2, refundFor };
      getClassApiCall(curriculumId);
      // One setValues only: Formik resolves `prev` from the last render, so a second call here
      // would overwrite the curriculum/class set by the first.
      addFeeRefundForm.setValues((prev: any) => ({
        ...prev,
        branchCurriculumId: curriculumId,
        branchClassId: classId,
        // Documents attached for the previous student don't apply to this one.
        attachments: [],
        // Drop the amount picked from the previous student's fine receipt.
        ...(refundFor === "FINE_PAID" ? { finalRefundableAmount: "0.00", paymentAmount: "0.00" } : {}),
      }))
      loadRefundRows(studentId, academicYearId, refundFor);
    } else {
      const { refundFor, branchCurriculumId, branchClassId, academicYearId } = addFeeRefundForm.values;
      setSelectedStudentState(null);
      clearFinePaidReceipts();
      dispatch(setStudentsListAct({}));
      dispatch(setStudentRefundLedgersAct(undefined));
      addFeeRefundForm.resetForm({
        values: {
          ...initialValueRefundForm, refundFor, academicYearId, branchCurriculumId, branchClassId
        }
      });

    }
    addFeeRefundForm.setFieldValue("studentDetailId", studentId || "");
  }


  function onAdjustedInputSearchChange(inputString: any) {
    const { academicYearId, branchClassId, branchCurriculumId } = addFeeRefundForm.values;
    if (academicYearId && branchCurriculumId && inputString) {
      const params = {
        searchString: inputString, instituteId,
      };
      dispatch(getStuForFeeAdjustAct(generateActionPayload("get_stu_for_fee_adjust", undefined, params)));
      // dispatch(getStudentsListAct(generateActionPayload("get_students", undefined, params)));
    }
  }

  function selectedAdjustableStudentHndlr(selectedStudent: any) {
    const { academicYearId, refundFor } = addFeeRefundForm.values;
    setSelectedAdjustableStudentState(selectedStudent);
    const { studentId } = selectedStudent || {};
    if (studentId) {
      const payload = {
        studentId: studentId,
        branchId: branchId,
        academicYearId: academicYearId,
        studentInfo: "",
        allowStudentConcession: "",
        allowEmployeeConcession: "",
        allowRefund: "",
        feeType: [],
        // instituteDeptId: [1, 4],
        instituteDeptNames: ["ACADEMICS", "TRANSPORT"],
        paymentStatus: "unpaid"
      };
      fineLedgersRequestRef.current = false;
      dispatch(getLedgerForFeeAdjustAct(generateActionPayload("get_ledgers_fee_adjust", { id: studentId })));
      // dispatch(getStudentRefundLedgerAct(generateActionPayload("get_student_refund_ledger", undefined, params)));
    }
    addFeeRefundForm.setValues((prevState: any) => ({
      ...prevState, "adjustedStudentDetailsId": studentId,
      totalAdjustAmount: "0.00"
    }))
    addFeeRefundForm.setFieldValue("adjustedStudentDetailsId", studentId || "");
  }

const studentId = selectedStudentState?.studentId;

useEffect(() => {
  const { academicYearId, paymentMode } = addFeeRefundForm.values;

  if (
    branchId &&
    studentId &&
    academicYearId &&
    paymentMode === "CT_ADJUSTMENT"
  ) {
    const payload = {
      academicYearId,
    };

    dispatch(
      getStudentLedgersForFeeAdjustExcessAmountAct(
        generateActionPayload(
          "get_student_ledgers_fee_adjust_excess_amount",
          { id: studentId },
          payload
        )
      )
    );
  }
}, [
  branchId,
  studentId,
  addFeeRefundForm.values.academicYearId,
  addFeeRefundForm.values.paymentMode,
]);

  useEffect(() => {
    if (
      addFeeRefundForm.values.paymentMode !== "CT_ADJUSTMENT" ||
      !getStudentLedgersForFeeAdjustExcessAmountResp
    ) {
      return;
    }

    const resp: any = getStudentLedgersForFeeAdjustExcessAmountResp;

    const ledgers = Array.isArray(resp)
      ? resp
      : Array.isArray(resp?.studentLedgers)
        ? resp.studentLedgers
        : [];

    if (!Array.isArray(resp)) {
      addFeeRefundForm.setFieldValue(
        "branchName",
        resp?.branchName || ""
      );
    }

    const updateStudentFeeLedger = ledgers.map(
      (item: any, index: number) => ({
        studentLedgerId: item.id,
        feeDetails: item.feeDetails,
        receiptNo: item.receiptNo,

        academicYear: item.academicYear,
        academicYearId: item.academicYearId,

        termId: item.termId,
        branchName: item.branchName,

        netAmount: item.netAmount || 0,
        amountPaid: item.amountPaid || 0,
        amountToPay: item.amountToPay || 0,
        amountToBePaid: item.amountToBePaid || item.amountToPay || 0,

        actualAmountPaid: item.actualAmountPaid || 0,
        refundedAmount: item.refundedAmount || 0,

        paymentStatus: item.paymentStatus || "",

        adjustAmount: "0.00",
        excessAmount: "0.00",

        isSelected: false,
        canSelect: index === 0,
      })
    );

    setAllAdjustLedgerSelectedState(false);
    addFeeRefundForm.setFieldValue("totalAdjustAmount", "0.00");
    setAdjustingFeeLedgerState(updateStudentFeeLedger);
  }, [
    getStudentLedgersForFeeAdjustExcessAmountResp,
    addFeeRefundForm.values.paymentMode,
  ]);

  function onChangePaymentModeHndlr(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    addFeeRefundForm.setValues((prevState: any) => ({
      ...prevState, [name]: value,
      feeRefundChequeDTO: {
        chequeDate: "",
        accountPayeeName: "",
        bankName: "",
        chequeNumber: ""
      },
      onlineDetailDTO: {
        transactionId: "",
        transactionDate: ""
      },
    }))
    addFeeRefundForm.setFieldValue("paymentMode", value || "");
  }

  async function onChangeAdjustTableHndlr(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target,
      [indexKey, nameKey] = name.split(".");
    if (indexKey && nameKey) {
      var indexMatch = indexKey.match(/\[(.*?)\]/) || "",
        index = Number(Number(indexMatch[1]));
      if (!isNaN(index)) {
        const updatedTermState = [...adjustingFeeLedgerState],
          termsInfo = { ...adjustingFeeLedgerState[index], [nameKey]: value };
        updatedTermState.splice(index, 1, termsInfo);
        const { items } = await validateOnChange(termsValidationSchema, name, updatedTermState);
        setAdjustingFeeLedgerState(items);
      }
    }
  }

  async function onBlurAdjustTableHndlr(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target,
      [indexKey, nameKey] = name.split(".");
    if (indexKey && nameKey) {
      var indexMatch = indexKey.match(/\[(.*?)\]/) || "",
        index = Number(Number(indexMatch[1]));
      if (!isNaN(index)) {
        const updatedTermState = [...adjustingFeeLedgerState],
          termsInfo = { ...adjustingFeeLedgerState[index], [nameKey]: getAmountValueWithDecimal(value) };
        updatedTermState.splice(index, 1, termsInfo);
        const touchedFeeLedger = await touchFieldOnBlur(name, updatedTermState);
        if (Array.isArray(touchedFeeLedger)) {
          const updateAdjustedAmount = touchedFeeLedger.reduce((sumAdjust, item) => {
            sumAdjust += (Number(item?.adjustAmount) || 0);
            return sumAdjust;
          }, 0);
          addFeeRefundForm.setFieldValue("totalAdjustAmount", getAmountValueWithDecimal(updateAdjustedAmount));
        }
        setAdjustingFeeLedgerState(touchedFeeLedger);
      }
    }
  }

  function onchangeRefundableHndlr(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    addFeeRefundForm.setValues((prevState: any) => ({
      ...prevState, [name]: value,
      finalRefundableAmount: getAmountValueWithDecimal(value),
    }));
  }

  function onBlurAmountFieldHndlr(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    addFeeRefundForm.setValues((prevState: any) => ({
      ...prevState,
      [name]: getAmountValueWithDecimal(value)
    }));
    addFeeRefundForm.handleBlur(event);
  }

  const allFeeLedgerCheckHndlr = useCallback((event: any) => {
    const { checked } = event.target;
    if (adjustingFeeLedgerState.length === 0) {
      return;
    }
    setAllAdjustLedgerSelectedState(checked);
    let totalAdjustAmount = 0,
      updatedLedgerState = [...adjustingFeeLedgerState];
    updatedLedgerState.forEach(item => {
      if (checked) {
        totalAdjustAmount += (Number(item?.adjustAmount) || 0)
      }
      item.isSelected = checked;
    })
    addFeeRefundForm.setFieldValue("totalAdjustAmount", getAmountValueWithDecimal(totalAdjustAmount));
    setAdjustingFeeLedgerState(updatedLedgerState);
  }, [adjustingFeeLedgerState]);

  const feeLedgerCheckHndlr = useCallback((event: any) => {
    const { checked } = event.currentTarget,
      studentFeeLedgerId = event.currentTarget.getAttribute("data-id"),
      ledgerIndex = adjustingFeeLedgerState.findIndex((item: any) => item.studentLedgerId === Number(studentFeeLedgerId));
    if (ledgerIndex > -1) {
      const ledgerDetails: any = adjustingFeeLedgerState[ledgerIndex],
        updateAdjustingFeeLedger: any = [...adjustingFeeLedgerState];
      //Delete the touched and delete the error.
      if (ledgerDetails?.errors) {
        delete ledgerDetails?.errors?.adjustAmount;
      }
      if (ledgerDetails?.touched) {
        ledgerDetails.touched.adjustAmount = false;
      }
      updateAdjustingFeeLedger.splice(ledgerIndex, 1, {
        ...ledgerDetails, isSelected: checked,
        adjustAmount: "0.00"
      });
      let totalAdjustAmount = 0,
        isAllSelected = true;
      updateAdjustingFeeLedger.forEach((item: any) => {
        totalAdjustAmount += (Number(item?.adjustAmount) || 0);
        if (!item.isSelected && isAllSelected) {
          isAllSelected = false;
        }
      })
      setAllAdjustLedgerSelectedState(isAllSelected);
      addFeeRefundForm.setFieldValue("totalAdjustAmount", getAmountValueWithDecimal(totalAdjustAmount));
      setAdjustingFeeLedgerState(updateAdjustingFeeLedger);

    }
  }, [adjustingFeeLedgerState]);

  const selectAllFeeHndlr = useCallback((event: any) => {
    const { checked } = event.currentTarget;
    setAllFeeSelectedState(checked);
    let totalAmt: any = 0
    let filterList = [];
    if (checked) {
      filterList = feeRefundList.map((fee: any) => {
        if (fee.isSelected) {
          totalAmt = totalAmt + +fee.refundAmount
          return { ...fee, isSelected: checked, refundAmount: fee.refundAmount }
        } else {
          return { ...fee, isSelected: checked }
        }
      });
    } else {
      filterList = feeRefundList.map((fee: any) => ({
        ...fee, isSelected: checked, refundAmount: 0,
        paymentAmount: 0
      }));
    }
    addFeeRefundForm.setValues((prev: any) => ({
      ...prev, finalRefundableAmount: totalAmt,
      paymentAmount: totalAmt,
    }))
    setFeeRefundList(filterList);
  }, [feeRefundList]);

  const studentCheckHndlr = useCallback((event: any) => {
    const { name, value, checked } = event.currentTarget,
      feeId = event.currentTarget.getAttribute("data-id");
    let totalAmt: any = 0

    const filterList = feeRefundList.map((fee: any) => {
      if (+fee.id === +feeId) {
        return { ...fee, isSelected: checked, refundAmount: 0, paymentAmount: 0 }
      }
      else {
        totalAmt = totalAmt + +fee.refundAmount
        return fee
      }
    });
    addFeeRefundForm.setValues((prev: any) => ({ ...prev, finalRefundableAmount: totalAmt, paymentAmount: totalAmt, }))
    setFeeRefundList(filterList);
    let checkAll = true;
    filterList.map((fee: any) => {
      if (!fee.isSelected) {
        checkAll = false;
      }
    })

    setAllFeeSelectedState(checkAll);
  }, [feeRefundList]);

  function toggleLedgerWarningHndler() {
    setShowWarningModalState(prevState => ({ ...prevState, showModal: false }));
  }

  const onChangeInputHndlr = (event: any, id: any) => {
    const { name, value } = event.target;
    let totalAmt: any = 0

    const filterList = feeRefundList.map((fee: any) => {
      if (+fee.id === +id) {
        totalAmt = totalAmt + +value
        return { ...fee, refundAmount: +value }
      }
      else {
        totalAmt = totalAmt + +fee.refundAmount
        return fee
      }
    });
    addFeeRefundForm.setValues((prev: any) => ({
      ...prev,
      finalRefundableAmount: +totalAmt,
      paymentAmount: +totalAmt,
    }))
    setFeeRefundList(filterList);
  }

  //FINE_PAID
  function openFineReceiptModalHndlr() {
    setFineReceiptModalState({
      showModal: true,
      selectedReceiptId: selectedFineReceiptState ? String(selectedFineReceiptState.id) : '',
      refundFineAmount: selectedFineReceiptState ? getAmountValueWithDecimal(selectedFineReceiptState.refundFineAmount) : ''
    });
  }

  function toggleFineReceiptModalHndlr() {
    setFineReceiptModalState(prevState => ({ ...prevState, showModal: false }));
  }

  // Picking a receipt starts its refundable fine at the full amount still refundable.
  const fineReceiptSelectHndlr = useCallback((event: any) => {
    const receiptId = event.currentTarget.getAttribute("data-id") || '';
    const receipt = finePaidReceiptsState.find((item: any) => String(item.id) === receiptId);
    setFineReceiptModalState(prevState => ({
      ...prevState,
      selectedReceiptId: receiptId,
      refundFineAmount: getAmountValueWithDecimal(getRefundableFineAmount(receipt))
    }));
  }, [finePaidReceiptsState]);

  const onChangeRefundableFineHndlr = (event: any) => {
    const value = event.target.value.replace(/^0+(?=\d)/, "");
    setFineReceiptModalState(prevState => ({ ...prevState, refundFineAmount: value }));
  }

  // Applies the receipt picked in the modal and lists the ledgers its fine can be adjusted to.
  function confirmFineReceiptHndlr() {
    const { selectedReceiptId, refundFineAmount } = fineReceiptModalState;
    const receipt = finePaidReceiptsState.find((item: any) => String(item.id) === selectedReceiptId);
    setSelectedFineReceiptState(receipt ? { ...receipt, refundFineAmount: +refundFineAmount || 0 } : null);
    setFineReceiptModalState(prevState => ({ ...prevState, showModal: false }));
    // Amounts adjusted against the previous receipt's fine no longer apply.
    setAllFeeSelectedState(false);
    applyFineRefundAmount(0);
    loadFineAdjustLedgers(addFeeRefundForm.values.studentDetailId);
  }

  const onChangeFineAdjustAmountHndlr = (event: any, id: any) => {
    const value = event.target.value.replace(/^0+(?=\d)/, "");
    const updatedLedgers = feeRefundList.map((ledger: any) => (
      +ledger.id === +id ? { ...ledger, refundAmount: value } : ledger
    ));
    const totalAmt = updatedLedgers.reduce((sum: number, ledger: any) => (
      ledger.isSelected ? sum + (+ledger.refundAmount || 0) : sum
    ), 0);
    // Together the ledgers can take at most the fine amount entered for the receipt.
    if (Math.round(totalAmt * 100) > Math.round((+selectedFineReceiptState?.refundFineAmount || 0) * 100)) {
      return;
    }
    setFeeRefundList(updatedLedgers);
    applyFineRefundAmount(totalAmt);
  }

  // Same bookkeeping the other refund types do when their refund amount changes.
  function applyFineRefundAmount(totalAmt: number) {
    addFeeRefundForm.setValues((prev: any) => ({
      ...prev,
      finalRefundableAmount: totalAmt,
      paymentAmount: totalAmt,
    }));
  }

  //CT_ADJUSTMENT
  const getLedgerAmountToPay = (row: any) =>
    +(row?.amountToBePaid ?? row?.amountToPay ?? 0) || 0;

  const getSelectedAdjustTotalCT = (rows: any[]) =>
    rows.reduce(
      (sum: number, row: any) =>
        row.isSelected ? sum + (+row.adjustAmount || 0) : sum,
      0
    );

  const getTotalExcessAmountCT = (rows: any[]) =>
    rows.reduce(
      (sum: number, row: any) =>
        sum + (+row.excessAmount || 0),
      0
    );

  function resetCTAdjustmentRows(finalRefundAmount: number = 0) {
    const resetRows = adjustingFeeLedgerState.map(
      (row: any, index: number) => ({
        ...row,
        isSelected: false,
        adjustAmount: "0.00",
        excessAmount: "0.00",
        canSelect: finalRefundAmount > 0 && index === 0,
        errors: {
          ...row.errors,
          adjustAmount: "",
        },
        touched: {
          ...row.touched,
          adjustAmount: false,
        },
      })
    );

    setAllAdjustLedgerSelectedState(false);

    addFeeRefundForm.setFieldValue(
      "totalAdjustAmount",
      "0.00"
    );

    setAdjustingFeeLedgerState(resetRows);
  }

  function applyCTExcessAmount(rows: any[], finalRefund: number) {
    const updated = rows.map((row: any) => ({
      ...row,
      excessAmount: "0.00",
    }));

    const selectedRows = updated
      .map((row: any, index: number) => ({ row, index }))
      .filter(({ row }: any) => row.isSelected);

    // Only 1 selected ledger => excess should be 0
    if (selectedRows.length < 2) {
      return updated;
    }

    const selectedAmountToPay = selectedRows.reduce(
      (sum: number, { row }: any) =>
        sum + getLedgerAmountToPay(row),
      0
    );

    if (selectedAmountToPay < finalRefund) {
      const lastSelectedIndex =
        selectedRows[selectedRows.length - 1].index;

      updated[lastSelectedIndex].excessAmount =
        getAmountValueWithDecimal(finalRefund - selectedAmountToPay);
    }

    return updated;
  }

  function validateCTAdjustRow(
    rows: any[],
    index: number,
    finalRefund: number
  ) {
    const updated = rows.map((row: any) => ({
      ...row,
      errors: { ...row.errors },
      touched: { ...row.touched },
    }));

    if (!updated[index]?.isSelected) {
      return updated;
    }

    const currentValue = updated[index].adjustAmount;
    const currentAdjust = +currentValue || 0;
    const currentPayable = getLedgerAmountToPay(updated[index]);

    updated[index].touched.adjustAmount = true;
    updated[index].errors.adjustAmount = "";

    if (
      currentValue === "" ||
      currentValue === null ||
      currentValue === undefined
    ) {
      updated[index].errors.adjustAmount = "Enter adjust amount";
      return updated;
    }

    if (currentAdjust <= 0) {
      updated[index].errors.adjustAmount =
        "Adjust amount must be greater than 0.";
      return updated;
    }

    if (currentAdjust > currentPayable) {
      updated[index].errors.adjustAmount =
        "Adjust amount cannot exceed Amount to Pay.";
      return updated;
    }

    const otherSelectedAdjustTotal = updated.reduce(
      (sum: number, row: any, rowIndex: number) =>
        rowIndex !== index && row.isSelected
          ? sum + (+row.adjustAmount || 0)
          : sum,
      0
    );

    const remainingRefund = finalRefund - otherSelectedAdjustTotal;

    if (currentAdjust > remainingRefund) {
      updated[index].errors.adjustAmount =
        "Adjust amount cannot exceed remaining refund amount.";
    }

    return updated;
  }

  function refreshCTSequentialRows(rows: any[], finalRefund: number) {
    let updated = rows.map((row: any) => ({
      ...row,
      errors: { ...row.errors },
      touched: { ...row.touched },
    }));

    if (updated.length === 0) {
      return updated;
    }

    updated[0].canSelect = finalRefund > 0;

    for (let i = 1; i < updated.length; i++) {
      const prevSelected = updated[i - 1].isSelected;
      const prevAdjust = +updated[i - 1].adjustAmount || 0;
      const prevPayable = getLedgerAmountToPay(updated[i - 1]);
      const prevHasError = !!updated[i - 1]?.errors?.adjustAmount;

      const selectedAdjustBeforeCurrent = updated
        .slice(0, i)
        .reduce(
          (sum: number, row: any) =>
            row.isSelected ? sum + (+row.adjustAmount || 0) : sum,
          0
        );

      const refundBalanceLeft =
        selectedAdjustBeforeCurrent < finalRefund;

      const canEnable =
        prevSelected &&
        prevAdjust === prevPayable &&
        !prevHasError &&
        refundBalanceLeft;

      updated[i].canSelect = canEnable;

      if (!canEnable) {
        updated[i].isSelected = false;
        updated[i].adjustAmount = "0.00";
        updated[i].excessAmount = "0.00";

        if (updated[i].errors) {
          updated[i].errors.adjustAmount = "";
        }

        if (updated[i].touched) {
          updated[i].touched.adjustAmount = false;
        }
      }
    }

    updated = applyCTExcessAmount(updated, finalRefund);

    return updated;
  }
  async function onChangeAdjustTableHndlrCTAdjustment(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const { name, value } = event.target;

    const [indexKey, fieldName] = name.split(".");
    const match = indexKey.match(/\[(\d+)\]/);
    const index = Number(match?.[1]);

    if (isNaN(index)) return;

    const finalRefund =
      +addFeeRefundForm.values.finalRefundableAmount || 0;

    let updated = [...adjustingFeeLedgerState];

    updated[index] = {
      ...updated[index],
      [fieldName]: value,
    };

    updated = validateCTAdjustRow(updated, index, finalRefund);
    updated = refreshCTSequentialRows(updated, finalRefund);

    const totalAdjustAmount = getSelectedAdjustTotalCT(updated);

    addFeeRefundForm.setFieldValue(
      "totalAdjustAmount",
      getAmountValueWithDecimal(totalAdjustAmount)
    );

    const allChecked =
      updated.length > 0 &&
      updated.every((row: any) => row.isSelected);

    setAllAdjustLedgerSelectedState(allChecked);
    setAdjustingFeeLedgerState(updated);
  }

  async function onBlurAdjustTableHndlrCTAdjustment(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const { name, value } = event.target;

    const [indexKey, nameKey] = name.split(".");
    const match = indexKey.match(/\[(\d+)\]/);
    const index = Number(match?.[1]);

    if (isNaN(index)) return;

    const finalRefund =
      +addFeeRefundForm.values.finalRefundableAmount || 0;

    let updated = [...adjustingFeeLedgerState];

    updated[index] = {
      ...updated[index],
      [nameKey]: getAmountValueWithDecimal(value),
    };

    updated = validateCTAdjustRow(updated, index, finalRefund);
    updated = refreshCTSequentialRows(updated, finalRefund);

    const totalAdjustAmount = getSelectedAdjustTotalCT(updated);

    addFeeRefundForm.setFieldValue(
      "totalAdjustAmount",
      getAmountValueWithDecimal(totalAdjustAmount)
    );

    const allChecked =
      updated.length > 0 &&
      updated.every((row: any) => row.isSelected);

    setAllAdjustLedgerSelectedState(allChecked);
    setAdjustingFeeLedgerState(updated);
  }
  const allFeeLedgerCheckHndlrCTAdjustment = useCallback(
    (event: any) => {
      const { checked } = event.target;

      const finalRefund =
        +addFeeRefundForm.values.finalRefundableAmount || 0;

      let updated = adjustingFeeLedgerState.map((row: any) => ({
        ...row,
        errors: { ...row.errors },
        touched: { ...row.touched },
      }));

      if (!checked || finalRefund <= 0) {
        updated = updated.map((row: any, index: number) => ({
          ...row,
          isSelected: false,
          adjustAmount: "0.00",
          excessAmount: "0.00",
          canSelect: finalRefund > 0 && index === 0,
          errors: {
            ...row.errors,
            adjustAmount: "",
          },
          touched: {
            ...row.touched,
            adjustAmount: false,
          },
        }));

        setAllAdjustLedgerSelectedState(false);
        addFeeRefundForm.setFieldValue("totalAdjustAmount", "0.00");
        setAdjustingFeeLedgerState(updated);
        return;
      }

      updated[0].canSelect = true;

      updated = refreshCTSequentialRows(updated, finalRefund);

      const totalAdjustAmount = getSelectedAdjustTotalCT(updated);

      addFeeRefundForm.setFieldValue(
        "totalAdjustAmount",
        getAmountValueWithDecimal(totalAdjustAmount)
      );

      const allChecked =
        updated.length > 0 &&
        updated.every((row: any) => row.isSelected);

      setAllAdjustLedgerSelectedState(allChecked);
      setAdjustingFeeLedgerState(updated);
    },
    [
      adjustingFeeLedgerState,
      addFeeRefundForm.values.finalRefundableAmount,
    ]
  );

  const feeLedgerCheckHndlrCTAdjustment = useCallback(
    (event: any) => {
      const { checked } = event.currentTarget;

      const studentFeeLedgerId = Number(
        event.currentTarget.getAttribute("data-id")
      );

      const finalRefund =
        +addFeeRefundForm.values.finalRefundableAmount || 0;

      let updated = adjustingFeeLedgerState.map((row: any) => ({
        ...row,
        errors: { ...row.errors },
        touched: { ...row.touched },
      }));

      const rowIndex = updated.findIndex(
        (row: any) => row.studentLedgerId === studentFeeLedgerId
      );

      if (rowIndex === -1) return;

      if (checked && updated[rowIndex].canSelect === false) {
        return;
      }

      if (checked && finalRefund <= 0) {
        return;
      }

      updated[rowIndex] = {
        ...updated[rowIndex],
        isSelected: checked,
        errors: {
          ...updated[rowIndex].errors,
          adjustAmount: "",
        },
        touched: {
          ...updated[rowIndex].touched,
          adjustAmount: false,
        },
      };

      if (!checked) {
        updated[rowIndex].adjustAmount = "0.00";
        updated[rowIndex].excessAmount = "0.00";
      }

      updated = refreshCTSequentialRows(updated, finalRefund);

      const totalAdjustAmount = getSelectedAdjustTotalCT(updated);

      addFeeRefundForm.setFieldValue(
        "totalAdjustAmount",
        getAmountValueWithDecimal(totalAdjustAmount)
      );

      const allChecked =
        updated.length > 0 &&
        updated.every((row: any) => row.isSelected);

      setAllAdjustLedgerSelectedState(allChecked);
      setAdjustingFeeLedgerState(updated);
    },
    [
      adjustingFeeLedgerState,
      addFeeRefundForm.values.finalRefundableAmount,
    ]
  );
  const selectAllFeeHndlrCTAdjustment = useCallback(
    (event: any) => {
      const { checked } = event.currentTarget;

      setAllFeeSelectedState(checked);

      let totalAmt: any = 0;

      const filterList = feeRefundList.map((fee: any) => {
        if (checked) {
          totalAmt = totalAmt + (+fee.refundAmount || 0);

          return {
            ...fee,
            isSelected: true,
          };
        }

        return {
          ...fee,
          isSelected: false,
          refundAmount: 0,
          paymentAmount: 0,
        };
      });

      addFeeRefundForm.setValues((prev: any) => ({
        ...prev,
        finalRefundableAmount: totalAmt,
        paymentAmount: totalAmt,
        totalAdjustAmount: "0.00",
      }));

      setFeeRefundList(filterList);
      resetCTAdjustmentRows(+totalAmt);
    },
    [
      feeRefundList,
      adjustingFeeLedgerState,
    ]
  );

  const studentCheckHndlrCTAdjustment = useCallback(
    (event: any) => {
      const { checked } = event.currentTarget;
      const feeId = event.currentTarget.getAttribute("data-id");

      let totalAmt: any = 0;

      const filterList = feeRefundList.map((fee: any) => {
        if (+fee.id === +feeId) {
          return {
            ...fee,
            isSelected: checked,
            refundAmount: 0,
            paymentAmount: 0,
          };
        }

        totalAmt = totalAmt + (+fee.refundAmount || 0);
        return fee;
      });

      addFeeRefundForm.setValues((prev: any) => ({
        ...prev,
        finalRefundableAmount: totalAmt,
        paymentAmount: totalAmt,
        totalAdjustAmount: "0.00",
      }));

      setFeeRefundList(filterList);

      const checkAll =
        filterList.length > 0 &&
        filterList.every((fee: any) => fee.isSelected);

      setAllFeeSelectedState(checkAll);
      resetCTAdjustmentRows(+totalAmt);
    },
    [
      feeRefundList,
      adjustingFeeLedgerState,
    ]
  );

  const onChangeInputHndlrCTAdjustment = (
    event: any,
    id: any
  ) => {
    const { value } = event.target;

    let totalAmt: any = 0;

    const filterList = feeRefundList.map((fee: any) => {
      if (+fee.id === +id) {
        const refundAmount = +value || 0;

        totalAmt = totalAmt + refundAmount;

        return {
          ...fee,
          refundAmount,
        };
      }

      totalAmt = totalAmt + (+fee.refundAmount || 0);
      return fee;
    });

    addFeeRefundForm.setValues((prev: any) => ({
      ...prev,
      finalRefundableAmount: totalAmt,
      paymentAmount: totalAmt,
      totalAdjustAmount: "0.00",
    }));

    setFeeRefundList(filterList);
    resetCTAdjustmentRows(+totalAmt);
  };

  useEffect(() => {
    if (
      addFeeRefundForm.values.paymentMode === "CT_ADJUSTMENT" &&
      getStudentLedgersForFeeAdjustExcessAmountResp
    ) {
      const resp: any = getStudentLedgersForFeeAdjustExcessAmountResp;
      addFeeRefundForm.setFieldValue(
        "newStudentId",
        resp?.newStudentId || ""
      );
      addFeeRefundForm.setFieldValue(
        "studentName",
        `${resp?.newStudentCode || ""} - ${resp?.newStudentName || ""}`
      );
    }
  }, [getStudentLedgersForFeeAdjustExcessAmountResp, addFeeRefundForm.values.paymentMode]);

  const isCTAdjustment =
    addFeeRefundForm.values.paymentMode === "CT_ADJUSTMENT";
  const finalRefund =
    +addFeeRefundForm.values.finalRefundableAmount || 0;

  const totalAdjust =
    +addFeeRefundForm.values.totalAdjustAmount || 0;

  const totalExcess = getTotalExcessAmountCT(adjustingFeeLedgerState);

  const isCTAdjustmentSubmitValid =
    Math.round((totalAdjust + totalExcess) * 100) ===
    Math.round(finalRefund * 100);

  const hasCTRowErrors =
    adjustingFeeLedgerState.some(
      (row: any) => row?.errors?.adjustAmount
    );

  const hasCTSelectedLedger =
    adjustingFeeLedgerState.some((row: any) => row.isSelected);

  const isFinePaid =
    addFeeRefundForm.values.refundFor === "FINE_PAID";

  // The fine amount entered for the receipt has to be fully adjusted across the ledgers.
  const fineToAdjust = +selectedFineReceiptState?.refundFineAmount || 0;
  const fineBalanceToAdjust = Math.max(fineToAdjust - finalRefund, 0);

  const disableRefundBtn =
    (isCTAdjustment &&
      (
        !hasCTSelectedLedger ||
        !isCTAdjustmentSubmitValid ||
        hasCTRowErrors
      )) ||
    (isFinePaid && (
      !selectedFineReceiptState ||
      finalRefund <= 0 ||
      Math.round(finalRefund * 100) !== Math.round(fineToAdjust * 100)
    ));

  const fineReceiptSelectColumns = useMemo(
    () => finePaidReceiptSelectColumns(fineReceiptSelectHndlr),
    [fineReceiptSelectHndlr]
  );

  const refundColumns = useMemo(
    () =>
      (isFinePaid ? finePaidAdjustLedgerColumns : feeRefundColumns)(
        allFeeSelectedState,
        isCTAdjustment
          ? studentCheckHndlrCTAdjustment
          : studentCheckHndlr,
        isCTAdjustment
          ? selectAllFeeHndlrCTAdjustment
          : selectAllFeeHndlr
      ),
    [isFinePaid, allFeeSelectedState, isCTAdjustment, studentCheckHndlr, studentCheckHndlrCTAdjustment, selectAllFeeHndlr, selectAllFeeHndlrCTAdjustment]
  );

  const adjustmentColumns = useMemo(() => {
    return feeAdjustmentColumns(
      allAdjustLedgerSelectedState,
      isCTAdjustment
        ? allFeeLedgerCheckHndlrCTAdjustment
        : allFeeLedgerCheckHndlr,
      isCTAdjustment
        ? feeLedgerCheckHndlrCTAdjustment
        : feeLedgerCheckHndlr,
      isCTAdjustment
    );
  }, [adjustingFeeLedgerState, allAdjustLedgerSelectedState, isCTAdjustment, allFeeLedgerCheckHndlr, allFeeLedgerCheckHndlrCTAdjustment, feeLedgerCheckHndlr, feeLedgerCheckHndlrCTAdjustment]);
  return (
    <>
      <div>
        <div className="page-content new_fee_receipt_page_warp">
          <div className="container-fluid">
            <BreadCrumb title="Fee Receipts" pageTitle="Fee" pageTitleUrl={location.state ? "/student-fee-ledger/fee-details" : "/fee-refunds"}
              linkState={{
                studentId: location.state?.studentId, academicYearId: location.state?.academicYearId,
                curriculumId: location.state?.curriculumId,
                classId: location.state?.classId
              }} />
            <BackButtonText
              title={location.state ? "<< Back to Fee Summary" : "<< Back to Refund List"}
              link={location.state ? "/student-fee-ledger/fee-details" : "/fee-refunds"}
              otherDetails={location.state}
            />
            {/* <BackButtonText title="<< Back to Refund List" link={"/fee-refunds"} /> */}

            <div className="card">
              <div className="tw-border-b tw-border-gray-200 tw-p-4">
                <div className="tw-flex tw-items-center">
                  <div className="tw-flex-1">
                    <h4 className="tw-text-lg tw-font-medium tw-mb-0">
                      Create Refund
                    </h4>
                  </div>
                </div>
              </div>
              <form onSubmit={addFeeRefundForm.handleSubmit}>
                <div className="card-body">
                  <div className="tw-flex tw-flex-wrap tw-pb-2 tw-border-b-2 tw-border-dashed tw-border-[#CFCFCF]">
                    <div className="tw-w-3/12">
                      <div>
                        <SelectInput
                          name="refundFor"
                          labelText="Refund For"
                          value={addFeeRefundForm.values.refundFor}
                          onChange={onChangeRefundForHndlr}
                          menuItems={receiptForOptions}
                          valueKey="id"
                          textKey="name"
                          hideSelectOption={true}
                        // isDisabled={location.state}
                        />
                      </div>
                    </div>

                    <div className="tw-w-5/12"></div>

                    <div className="tw-w-4/12">
                      <SelectInput
                        name="academicYearId"
                        formgroupClassName="tw-mb-1"
                        value={addFeeRefundForm.values.academicYearId}
                        onChange={onChangeHndlr}
                        onBlur={addFeeRefundForm.handleBlur}
                        menuItems={academicYearListResp?.data}
                        valueKey="academicYearId"
                        textKey="academicYearName"
                        defaultSelect="Academic Year"
                        isDisabled={location.state}
                        invalid={
                          addFeeRefundForm.touched.academicYearId &&
                            addFeeRefundForm.errors.academicYearId
                            ? true
                            : false
                        }
                        error={
                          addFeeRefundForm.touched.academicYearId &&
                            addFeeRefundForm.errors.academicYearId
                            ? addFeeRefundForm.errors.academicYearId
                            : ""
                        }
                      />

                      <AutoSearchInputUpdated
                        formgroupClassName="tw-mb-1"
                        alignRight={true}
                        name="studentDetailId"
                        placeHolder="Search..."
                        onChange={onInputSearchChange}
                        onBlur={addFeeRefundForm.handleBlur}
                        valueKey="studentId"
                        labelHeader="Student Code"
                        labelKey="studentCode"
                        subLabelHeader="Student Name"
                        subLabelKey="studentName"
                        options={studentsListResp?.data}
                        selected={selectedStudentState}
                        selectedOptionCallbck={selectedStudentHndlr}
                        isDisabled={location.state}
                        invalid={
                          addFeeRefundForm.touched.studentDetailId &&
                            addFeeRefundForm.errors.studentDetailId
                            ? true
                            : false
                        }
                        error={
                          addFeeRefundForm.touched.studentDetailId &&
                            addFeeRefundForm.errors.studentDetailId
                            ? addFeeRefundForm.errors.studentDetailId
                            : ""
                        }
                      >
                        <i className="ri-search-line"></i>
                      </AutoSearchInputUpdated>

                      <SelectInput
                        name="branchCurriculumId"
                        formgroupClassName="tw-mb-1"
                        value={addFeeRefundForm.values.branchCurriculumId}
                        onChange={onChangeHndlr}
                        onBlur={addFeeRefundForm.handleBlur}
                        menuItems={brchCurriculumResp?.data}
                        valueKey="branchCurriculumId"
                        textKey="curriculumName"
                        defaultSelect="Curriculum"
                        isDisabled={true}
                        invalid={
                          addFeeRefundForm.touched.branchCurriculumId &&
                            addFeeRefundForm.errors.branchCurriculumId
                            ? true
                            : false
                        }
                        error={
                          addFeeRefundForm.touched.branchCurriculumId &&
                            addFeeRefundForm.errors.branchCurriculumId
                            ? addFeeRefundForm.errors.branchCurriculumId
                            : ""
                        }
                      />

                      <SelectInput
                        name="branchClassId"
                        formgroupClassName="tw-mb-1"
                        value={addFeeRefundForm.values.branchClassId}
                        onChange={onChangeHndlr}
                        onBlur={addFeeRefundForm.handleBlur}
                        menuItems={branchClassResp?.content}
                        valueKey="id"
                        textKey="shortName"
                        defaultSelect="Class"
                        isDisabled={true}
                        invalid={
                          addFeeRefundForm.touched.branchClassId &&
                            addFeeRefundForm.errors.branchClassId
                            ? true
                            : false
                        }
                        error={
                          addFeeRefundForm.touched.branchClassId &&
                            addFeeRefundForm.errors.branchClassId
                            ? addFeeRefundForm.errors.branchClassId
                            : ""
                        }
                      />
                    </div>
                  </div>
                  <div className="tw-flex-wrap tw-py-2 tw-mb-2 tw-border-b-2 tw-border-dashed tw-border-[#CFCFCF]">
                    {isFinePaid && (
                      <div className="tw-flex tw-items-center tw-justify-between tw-mb-2">
                        <div>
                          <h6 className="tw-m-0">Adjust Fine To Ledgers</h6>
                          {selectedFineReceiptState && (
                            <span className="tw-text-sm tw-text-gray-500">
                              Receipt {selectedFineReceiptState.receiptNumber} · Fine to adjust ₹
                              {getAmountValueWithDecimal(fineToAdjust)} · Balance ₹
                              {getAmountValueWithDecimal(fineBalanceToAdjust)}
                            </span>
                          )}
                        </div>
                        <Button
                          variant="hoverInfo"
                          type="button"
                          onClick={openFineReceiptModalHndlr}
                          disabled={finePaidReceiptsState.length === 0}
                        >
                          {selectedFineReceiptState ? "Change Receipt" : "Select Receipt"}
                        </Button>
                      </div>
                    )}
                    <TableContainer
                      columns={refundColumns}
                      data={Array.isArray(feeRefundList) ? feeRefundList : []}
                      tableClass="tw-mb-0"
                      onChangeInputHndlr={
                        isFinePaid
                          ? onChangeFineAdjustAmountHndlr
                          : isCTAdjustment
                            ? onChangeInputHndlrCTAdjustment
                            : onChangeInputHndlr
                      }
                      divClass="tw-overflow-x-auto"
                      theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
                    />

                    <div className="tw-w-full">
                      <span className="tw-block tw-text-red-600 tw-text-sm">
                        {(addFeeRefundForm.touched.studentRefundLedgerIds &&
                          addFeeRefundForm.errors.studentRefundLedgerIds)
                          ? addFeeRefundForm.errors?.studentRefundLedgerIds?.toString()
                          : ""}
                      </span>
                    </div>
                  </div>
                  <div className="tw-flex tw-flex-wrap tw-py-3">
                    <div className="tw-w-4/6 tw-ml-auto">

                      <div className="tw-flex tw-items-center tw-mb-2">
                        <div className="tw-flex-1 tw-p-0">
                          <h6 className="tw-m-0">Final Refund Amount</h6>
                        </div>
                        <div className="tw-flex-1">
                          <TextInputGroup
                            name="finalRefundableAmount"
                            formgroupClassName="tw-mb-0"
                            inputgroupClassName="tw-text-sm"
                            inputClassName="tw-text-sm"
                            inputGroupStart={true}
                            value={getAmountValueWithDecimal(+addFeeRefundForm.values.finalRefundableAmount)}
                            onChange={undefined}
                            isDisabled={true}
                          >
                            <RupeeSvg width="11px" height="11px" fill={"#495057"} />
                          </TextInputGroup>
                        </div>
                      </div>

                      {["CHEQUE", "CASH", "ONLINE"].includes(addFeeRefundForm?.values?.paymentMode) && (
                        <div className="tw-flex tw-items-center tw-mb-2">
                          <div className="tw-flex-1 tw-p-0">
                            <h6 className="tw-m-0">
                              {addFeeRefundForm?.values?.paymentMode === "CHEQUE" ? "Cheque" :
                                addFeeRefundForm?.values?.paymentMode === "CASH" ? "Cash" : "Online"} Amount
                            </h6>
                          </div>
                          <div className="tw-flex-1">
                            <TextInputGroup
                              name="paymentAmount"
                              formgroupClassName="tw-mb-0"
                              inputgroupClassName="tw-text-sm"
                              inputClassName="tw-text-sm"
                              inputGroupStart={true}
                              isDisabled={true}
                              value={getAmountValueWithDecimal(+addFeeRefundForm.values.paymentAmount)}
                              onChange={addFeeRefundForm.handleChange}
                              onBlur={addFeeRefundForm.handleBlur}
                              invalid={(addFeeRefundForm.touched.paymentAmount && addFeeRefundForm.errors.paymentAmount) ? true : false}
                              error={(addFeeRefundForm.touched.paymentAmount && addFeeRefundForm.errors.paymentAmount) ? addFeeRefundForm.errors.paymentAmount : ""}
                            >
                              <RupeeSvg width="11px" height="11px" fill={"#495057"} />
                            </TextInputGroup>
                          </div>
                        </div>
                      )}

                      {["ADJUSTMENT", "CT_ADJUSTMENT"].includes(
                        addFeeRefundForm?.values?.paymentMode
                      ) && (
                          <div className="tw-flex tw-items-center tw-mb-2 tw-mt-2">
                            <div className="tw-flex-1 tw-p-0">
                              <h6 className="tw-m-0">Adjust Amount</h6>
                            </div>
                            <div className="tw-flex-1">
                              <TextInputGroup
                                name="totalAdjustAmount"
                                formgroupClassName="tw-mb-0"
                                inputgroupClassName="tw-text-sm"
                                inputClassName="tw-text-sm"
                                inputGroupStart={true}
                                value={getAmountValueWithDecimal(+addFeeRefundForm.values.totalAdjustAmount)}
                                onChange={undefined}
                                isDisabled={true}
                                invalid={(addFeeRefundForm.touched.totalAdjustAmount && addFeeRefundForm.errors.totalAdjustAmount) ? true : false}
                                error={(addFeeRefundForm.touched.totalAdjustAmount && addFeeRefundForm.errors.totalAdjustAmount) ? addFeeRefundForm.errors.totalAdjustAmount : ""}
                              >
                                <RupeeSvg width="11px" height="11px" fill={"#495057"} />
                              </TextInputGroup>
                            </div>
                          </div>
                        )}

                      <div className="tw-flex">
                        <div className="tw-flex-1 tw-p-0">
                          <h6 className="tw-m-0">Remarks</h6>
                        </div>
                        <div className="tw-flex-1">
                          <TextArea
                            name="remarks"
                            value={addFeeRefundForm.values.remarks}
                            onChange={addFeeRefundForm.handleChange}
                            onBlur={addFeeRefundForm.handleBlur}
                            formgroupClassName="tw-mb-0"
                            invalid={(addFeeRefundForm.touched.remarks && addFeeRefundForm.errors.remarks) ? true : false}
                            error={(addFeeRefundForm.touched.remarks && addFeeRefundForm.errors.remarks) ? addFeeRefundForm.errors.remarks : ""}
                            maxLength={230}
                          />
                        </div>
                      </div>

                      <div className="tw-flex tw-mt-3">
                        <div className="tw-flex-1 tw-p-0">
                          <h6 className="tw-m-0">Attachment <span className="tw-text-red-500">*</span></h6>
                        </div>
                        <div className="tw-flex-1">
                          <MultipleFileUpload
                            // Remount on the changes that reset the form, so the uploader's own file list clears too.
                            key={`refund-attachments-${addFeeRefundForm.values.academicYearId}-${addFeeRefundForm.values.studentDetailId}-${addFeeRefundForm.values.refundFor}`}
                            name="attachments"
                            prevFiles={addFeeRefundForm.values.attachments}
                            onChange={(files: Array<File>) => addFeeRefundForm.setFieldValue("attachments", files)}
                            accept={REFUND_ATTACHMENT_TYPES}
                            acceptErrorText="Only PDF or image (JPG, PNG) files are allowed."
                            maxSizeInMb={2}
                            helperText="PDF or image (JPG, PNG). Max file size is 2MB."
                            error={(addFeeRefundForm.touched.attachments && addFeeRefundForm.errors.attachments)
                              ? addFeeRefundForm.errors.attachments.toString()
                              : ""}
                          />
                        </div>
                      </div>

                    </div>
                  </div>

                  {!isFinePaid && (
                    <div className="tw-flex tw-flex-wrap tw-mb-2">
                      <div className="tw-w-1/3">
                        <h6 className="tw-font-normal tw-text-gray-500 tw-mb-3">PAYMENT DETAILS</h6>
                        <SelectInput
                          name="paymentMode"
                          formgroupClassName={
                            addFeeRefundForm?.values?.paymentMode === "CT_ADJUSTMENT"
                              ? "tw-mb-0 search-box"
                              : "tw-mb-3 search-box"
                          }
                          value={addFeeRefundForm.values.paymentMode}
                          onChange={onChangePaymentModeHndlr}
                          onBlur={addFeeRefundForm.handleBlur}
                          menuItems={paymentOptions}
                          valueKey="id"
                          textKey="name"
                          defaultSelect="Select"
                          inputClassName="tw-text-gray-500"
                          invalid={(addFeeRefundForm.touched.paymentMode && addFeeRefundForm.errors.paymentMode) ? true : false}
                          error={(addFeeRefundForm.touched.paymentMode && addFeeRefundForm.errors.paymentMode) ? addFeeRefundForm.errors.paymentMode : ""}
                        />
                      </div>
                    </div>
                  )}

                  {(addFeeRefundForm?.values?.paymentMode === "CHEQUE") &&
                    <div className="tw-flex tw-flex-wrap">
                      <div className="tw-w-1/3">
                        <TextInput
                          name="feeRefundChequeDTO.accountPayeeName"
                          formgroupClassName="tw-mb-2"
                          value={addFeeRefundForm.values.feeRefundChequeDTO.accountPayeeName}
                          onChange={addFeeRefundForm.handleChange}
                          placeHolder="In the Name of"
                          invalid={!!(addFeeRefundForm.touched?.feeRefundChequeDTO?.accountPayeeName &&
                            addFeeRefundForm.errors?.feeRefundChequeDTO?.accountPayeeName)}
                          error={addFeeRefundForm.touched?.feeRefundChequeDTO?.accountPayeeName &&
                            addFeeRefundForm.errors?.feeRefundChequeDTO?.accountPayeeName
                            ? addFeeRefundForm.errors?.feeRefundChequeDTO?.accountPayeeName
                            : ""}
                        />

                        <DateInput
                          name="feeRefundChequeDTO.chequeDate"
                          formgroupClassName="tw-mb-2"
                          value={addFeeRefundForm.values.feeRefundChequeDTO.chequeDate}
                          onChange={addFeeRefundForm.handleChange}
                          invalid={!!(addFeeRefundForm.touched?.feeRefundChequeDTO?.chequeDate &&
                            addFeeRefundForm.errors?.feeRefundChequeDTO?.chequeDate)}
                          error={addFeeRefundForm.touched?.feeRefundChequeDTO?.chequeDate &&
                            addFeeRefundForm.errors?.feeRefundChequeDTO?.chequeDate
                            ? addFeeRefundForm.errors?.feeRefundChequeDTO?.chequeDate
                            : ""}
                        />

                        <SelectInput
                          name="feeRefundChequeDTO.bankName"
                          formgroupClassName="tw-mb-3"
                          value={addFeeRefundForm.values.feeRefundChequeDTO.bankName}
                          onChange={addFeeRefundForm.handleChange}
                          onBlur={addFeeRefundForm.handleBlur}
                          menuItems={masterBanksResp?.content || []}
                          valueKey="bankName"
                          textKey="bankName"
                          defaultSelect="Bank Name"
                          invalid={!!(addFeeRefundForm.touched?.feeRefundChequeDTO?.bankName &&
                            addFeeRefundForm.errors?.feeRefundChequeDTO?.bankName)}
                          error={addFeeRefundForm.touched?.feeRefundChequeDTO?.bankName &&
                            addFeeRefundForm.errors?.feeRefundChequeDTO?.bankName
                            ? addFeeRefundForm.errors?.feeRefundChequeDTO?.bankName
                            : ""}
                        />

                        <TextInput
                          name="feeRefundChequeDTO.chequeNumber"
                          formgroupClassName="tw-mb-2"
                          value={addFeeRefundForm.values.feeRefundChequeDTO.chequeNumber}
                          onChange={addFeeRefundForm.handleChange}
                          placeHolder="Cheque Number"
                          invalid={!!(addFeeRefundForm.touched?.feeRefundChequeDTO?.chequeNumber &&
                            addFeeRefundForm.errors?.feeRefundChequeDTO?.chequeNumber)}
                          error={addFeeRefundForm.touched?.feeRefundChequeDTO?.chequeNumber &&
                            addFeeRefundForm.errors?.feeRefundChequeDTO?.chequeNumber
                            ? addFeeRefundForm.errors?.feeRefundChequeDTO?.chequeNumber
                            : ""}
                        />
                      </div>
                    </div>
                  }
                  {["ADJUSTMENT", "CT_ADJUSTMENT"].includes(
                    addFeeRefundForm?.values?.paymentMode
                  ) && (
                      <>
                        {addFeeRefundForm?.values?.paymentMode === "ADJUSTMENT" && (
                          <div className="tw-w-full md:tw-w-1/3">
                            <AutoSearchInput
                              formgroupClassName="tw-mb-3 search-box"
                              name="adjustedStudentDetailsId"
                              placeHolder="Search..."
                              onChange={onAdjustedInputSearchChange}
                              onBlur={addFeeRefundForm.handleBlur}
                              valueKey="studentId"
                              labelKey="studentName"
                              subLabelKey="studentCode"
                              labelHeader="Student Code"
                              subLabelHeader="Student Name"
                              options={getStuForFeeAdjustResp || []}
                              selected={selectedAdjustableStudentState}
                              selectedOptionCallbck={selectedAdjustableStudentHndlr}
                              invalid={
                                !!(
                                  addFeeRefundForm.touched.adjustedStudentDetailsId &&
                                  addFeeRefundForm.errors.adjustedStudentDetailsId
                                )
                              }
                              error={
                                addFeeRefundForm.touched.adjustedStudentDetailsId &&
                                  addFeeRefundForm.errors.adjustedStudentDetailsId
                                  ? addFeeRefundForm.errors.adjustedStudentDetailsId
                                  : ""
                              }
                            >
                              <i className="ri-search-line search-icon"></i>
                            </AutoSearchInput>
                          </div>
                        )}
                      {addFeeRefundForm?.values?.paymentMode === "CT_ADJUSTMENT" && (
                        <div className="tw-w-full md:tw-w-1/3">
                          <TextInput
                            name="branchName"
                            formgroupClassName="tw-mb-2"
                            value={addFeeRefundForm.values.branchName || ""}
                            onChange={addFeeRefundForm.handleChange}
                            placeHolder="Branch"
                            isDisabled={true}
                            labelText="Branch"
                          />
                          <TextInput
                            name="studentName"
                            formgroupClassName="tw-mb-4"
                            value={addFeeRefundForm.values.studentName || ""}
                            onChange={addFeeRefundForm.handleChange}
                            placeHolder="Branch"
                            isDisabled={true}
                            labelText="Student"
                          />
                        </div>
                      )}

                        <div className="tw-w-full tw-mb-3">
                          <h5 className="tw-font-semibold tw-mb-2">Adjust To Fees</h5>

                        <TableContainer
                          columns={adjustmentColumns}
                          data={adjustingFeeLedgerState}
                          divClass="tw-overflow-x-auto tw-mb-3"
                          tableClass="tw-w-full tw-mb-0"
                          theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
                          onChangeInputHndlr={
                            isCTAdjustment
                              ? onChangeAdjustTableHndlrCTAdjustment
                              : onChangeAdjustTableHndlr
                          }
                          onBlurInputHndlr={
                            isCTAdjustment
                              ? onBlurAdjustTableHndlrCTAdjustment
                              : onBlurAdjustTableHndlr
                          }
                        />
                        </div>
                      </>
                    )}
                  {(addFeeRefundForm?.values?.paymentMode === "ONLINE") &&
                    <div className="tw-w-full">
                      <div className="tw-w-1/3">
                        <TextInput
                          name="onlineDetailDTO.transactionId"
                          value={addFeeRefundForm.values.onlineDetailDTO.transactionId}
                          onChange={addFeeRefundForm.handleChange}
                          placeHolder="Transaction Id"
                          formgroupClassName="tw-mb-2"
                          invalid={!!(addFeeRefundForm.touched?.onlineDetailDTO?.transactionId &&
                            addFeeRefundForm.errors?.onlineDetailDTO?.transactionId)}
                          error={addFeeRefundForm.touched?.onlineDetailDTO?.transactionId &&
                            addFeeRefundForm.errors?.onlineDetailDTO?.transactionId
                            ? addFeeRefundForm.errors?.onlineDetailDTO?.transactionId
                            : ""}
                        />

                        <DateInput
                          formgroupClassName="tw-mb-2"
                          name="onlineDetailDTO.transactionDate"
                          value={addFeeRefundForm.values.onlineDetailDTO.transactionDate}
                          onChange={addFeeRefundForm.handleChange}
                          invalid={!!(addFeeRefundForm.touched?.onlineDetailDTO?.transactionDate &&
                            addFeeRefundForm.errors?.onlineDetailDTO?.transactionDate)}
                          error={addFeeRefundForm.touched?.onlineDetailDTO?.transactionDate &&
                            addFeeRefundForm.errors?.onlineDetailDTO?.transactionDate
                            ? addFeeRefundForm.errors?.onlineDetailDTO?.transactionDate
                            : ""}
                        />
                      </div>
                    </div>
                  }
                  <div className="tw-flex tw-justify-end tw-space-x-2">
                    <Button
                      variant="secondary"
                      type="button"
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      type="submit"
                      disabled={disableRefundBtn}
                    >
                      Refund
                    </Button>
                  </div>

                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <ModalContainerUpdated
        id="refund-ledger-warning"
        isOpen={showWarningModalState.showModal}
        toggle={toggleLedgerWarningHndler}
        hideHeader={true}
        // modalTitle="Warning Message"
        modalSize="md"
      >
        <div className="modal-body pb-2">
          <div className="d-flex flex-column align-items-center">
            <div className="d-flex mb-3"><ConfirmationIcon style={{ height: '70px', width: '70px' }} /></div>
            <h4 className="flex-grow-1 mb-3">Warning Message?</h4>
            <span className="fs-normal">
              {showWarningModalState.warningMessage}
            </span><span className="fw-bold text-primary">{showWarningModalState.studentName}</span>
          </div>
        </div>
        <div className="modal-footer d-flex justify-content-center">
          <button onClick={toggleLedgerWarningHndler} className="btn btn-light">Close</button>
          <button onClick={toggleLedgerWarningHndler} className="btn btn-success px-4">Ok</button>
        </div>

        {/* <div className="modal-body">
          <span className="fs-normal">
            There is no ledger available to adjust for the selected student.
          </span><span className="fw-bold text-primary">Testing Student</span>
        </div>
        <div className="modal-footer">
          <button className="btn btn-success">Ok</button>
        </div> */}
      </ModalContainerUpdated>
      <ModalContainerUpdated
        id="fine-paid-receipt-select"
        isOpen={fineReceiptModalState.showModal}
        toggle={toggleFineReceiptModalHndlr}
        modalTitle="Select Fine Paid Receipt"
        modalSize="xl"
      >
        <div className="modal-body">
          <TableContainer
            columns={fineReceiptSelectColumns}
            data={finePaidReceiptsState}
            rowDataInfo={fineReceiptModalState}
            onChangeInputHndlr={onChangeRefundableFineHndlr}
            tableClass="tw-mb-0"
            divClass="tw-overflow-x-auto"
            theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
          />
        </div>
        <div className="modal-footer">
          <Button variant="secondary" type="button" onClick={toggleFineReceiptModalHndlr}>
            Cancel
          </Button>
          <Button
            variant="primary"
            type="button"
            onClick={confirmFineReceiptHndlr}
            disabled={!fineReceiptModalState.selectedReceiptId || !(+fineReceiptModalState.refundFineAmount > 0)}
          >
            Select
          </Button>
        </div>
      </ModalContainerUpdated>
    </>
  );
};

export default FeeRefundPage;
