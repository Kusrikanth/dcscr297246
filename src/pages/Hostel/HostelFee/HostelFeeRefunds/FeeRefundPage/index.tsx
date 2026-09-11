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
  ModalContainerUpdated
} from "../../../../../Components/Common";
import BreadCrumb from "../../../../../Components/Common/BreadCrumb";


import { default as RupeeSvg } from "../../../../../assets/imagesdps/feeDashboard/RupeeSvg.svg?react";
import TableContainer from "../../../../../Components/Common/TableContainer";

//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
//Action Generator
import { generateActionPayload } from "../../../../../utility/reduxutility";
import {
  getStudentsListAct, setStudentsListAct
} from "../../../../../store/directory/studentmanagement/studentmanagementactions";
import {
  getInstAcademicYearAct,
} from "../../../../../store/mastersettings/instacademics/instacademicactions";
import {
  getBranchCurriculumAct, getBranchClassAct,
  setBrchClassAct,
} from "../../../../../store/branchsettings/branchacademics/branchacademicsactions";
import {
  addFeeRefundAct, getStudentRefundLedgerAct,
  setStudentRefundLedgersAct, getStuForFeeAdjustAct, getLedgerForFeeAdjustAct,
  setAddFeeRefundAct, setLedgerForFeeAdjustAct, setStuForFeeAdjustAct
} from "../../../../../store/fee/feecollections/feecollectionactions";
//Utility
import { useHistory, useLocation } from "react-router-dom";
import { getAmountValueWithDecimal } from "../../../../../utility/commonutility";
import { validateOnChange, touchFieldOnBlur } from "../../../../../utility/validationutility";
import { default as ConfirmationIcon } from "../../../../../assets/imagesdps/academics/confirmation-icon.svg?react";
import { getMasterBanksAct } from "../../../../../store/masterdata/masterdataactions";
import { createRefundPayload, feeAdjustmentColumns, feeRefundColumns, paymentOptions, receiptForOptions } from "./helper";
import Button from "../../../../../Components/Common/Button";

export const MenuOptions: Array<any> = [
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
  paymentMode: Yup.string().required("Select payment mode."),
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
  adjustedStudentDetailsId: Yup.string().when('paymentMode', {
    is: (item: any) => (item === "ADJUSTMENT"),
    then: Yup.string().required("Search student after selecting academic year, curriculum.")
  })
});


const initialValueRefundForm = {
  refundFor: "AMOUNT_PAID",
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
  remarks: "",
  totalAmountToPay: "0.00",
  totalNetAmount: "0.00",
  totalAmountPaid: "0.00",
  totalRefundAmount: "0.00",
  totalAdjustAmount: "0.00",
  finalRefundableAmount: "0.00",
  adjustedStudentDetailsId: "",
}

const FeeRefundPage = () => {
  const location: any = useLocation();
  const history = useHistory();
  const [selectedStudentState, setSelectedStudentState] = useState<any>(null);
  const [allFeeSelectedState, setAllFeeSelectedState] = useState(false);
  const [feeRefundList, setFeeRefundList] = useState<any>([]);
  const [selectedAdjustableStudentState, setSelectedAdjustableStudentState] = useState<any>(null);
  const [adjustingFeeLedgerState, setAdjustingFeeLedgerState] = useState<Array<any>>([]);
  const [allAdjustLedgerSelectedState, setAllAdjustLedgerSelectedState] = useState(false);
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
    studentsListResp, studentRefundLedgerResp, addFeeRefundResp, getLedgerForFeeAdjustResp,
    feeCollectionErrorResp, getStuForFeeAdjustResp, masterBanksResp, showApiLoader } =
    useAppSelector(({ appData, directoryStudent, branchAcademics, feeCollections,
      instAcademics, masterData, globalData }) => ({
        branchClassResp: branchAcademics.branchClassResp,
        brchCurriculumResp: branchAcademics.brchCurriculumResp,
        academicYearListResp: instAcademics.academicYearListResp,
        currentInstIdResp: appData.currentInstIdResp,
        currentBranchIdResp: appData.currentBranchIdResp,
        studentsListResp: directoryStudent.studentsListResp,
        studentRefundLedgerResp: feeCollections.studentRefundLedgerResp,
        addFeeRefundResp: feeCollections.addFeeRefundResp,
        getLedgerForFeeAdjustResp: feeCollections.getLedgerForFeeAdjustResp,
        getStuForFeeAdjustResp: feeCollections.getStuForFeeAdjustResp,
        feeCollectionErrorResp: feeCollections.feeCollectionErrorResp,
        masterBanksResp: masterData.masterBanksResp,
        showApiLoader: globalData.showApiLoader,
      }), shallowEqual);

  const feeRefundRespRef = useRef({
    prevAcademicYearListResp: academicYearListResp,
    prevAddFeeRefundResp: addFeeRefundResp,
    prevGetLedgerForFeeAdjustResp: getLedgerForFeeAdjustResp,
    prevFeeCollectionErrorResp: feeCollectionErrorResp
  });

  useEffect(() => {
    const { prevAcademicYearListResp, prevAddFeeRefundResp,
      prevFeeCollectionErrorResp, prevGetLedgerForFeeAdjustResp } = feeRefundRespRef.current;
    if (academicYearListResp && prevAcademicYearListResp !== academicYearListResp) {
      const { academicYearId } = addFeeRefundForm.values;
      if (!academicYearId && Array.isArray(academicYearListResp?.data)) {
        const { academicYearId } = academicYearListResp.data?.find((year: any) => year.yearStatus === "CURRENT") || {};
        if (academicYearId) {
          addFeeRefundForm.setFieldValue("academicYearId", academicYearId);
          if (!location?.state) {
            getCurriculumApiCall({ academicYearId });
          }
        }
      }
    }
    else if (addFeeRefundResp && prevAddFeeRefundResp !== addFeeRefundResp) {
      toast.success("Refund added successfully.");
      if (location.state) {
        history.push(`/hostel-student-ledger/ledger-details`, { ...location.state });
      } else {
        history.push("/hostel-fee-refund");
      }
    }
    else if (getLedgerForFeeAdjustResp && getLedgerForFeeAdjustResp !== prevGetLedgerForFeeAdjustResp) {
      // const { ledgers } = getLedgerForFeeAdjustResp;
      if (Array.isArray(getLedgerForFeeAdjustResp)) {
        if (getLedgerForFeeAdjustResp.length === 0) {
          setShowWarningModalState(prevState => ({
            ...prevState, showModal: true,
            warningMessage: 'There is no ledger available to adjust for the selected student.',
            studentName: selectedAdjustableStudentState?.studentName || ""
          }));
          setAdjustingFeeLedgerState([]);
        } else {
          const updateStudentFeeLedger: any = [];
          for (let i = 0; i < getLedgerForFeeAdjustResp.length; i++) {
            updateStudentFeeLedger.push({
              studentLedgerId: getLedgerForFeeAdjustResp[i].ledgerId,
              feeDetails: getLedgerForFeeAdjustResp[i].feeDetails,
              netAmount: getLedgerForFeeAdjustResp[i].netAmount,
              balance: getLedgerForFeeAdjustResp[i].balance,
              amountPaid: getLedgerForFeeAdjustResp[i].amountPaid,
              amountToPay: getLedgerForFeeAdjustResp[i].amountToPay,
              academicYear: getLedgerForFeeAdjustResp[i].academicYearName,
              paymentStatus: getLedgerForFeeAdjustResp[i].paymentStatus,
              adjustAmount: "0.00"
            });
          }
          setAdjustingFeeLedgerState(updateStudentFeeLedger);
        }
      }
    }
    else if (feeCollectionErrorResp && feeCollectionErrorResp !== prevFeeCollectionErrorResp) {
      const { message }: any = feeCollectionErrorResp;
      toast.error(message || "Something went wrong.");
    }
    feeRefundRespRef.current.prevAcademicYearListResp = academicYearListResp;
    feeRefundRespRef.current.prevAddFeeRefundResp = addFeeRefundResp;
    feeRefundRespRef.current.prevGetLedgerForFeeAdjustResp = getLedgerForFeeAdjustResp;
    feeRefundRespRef.current.prevFeeCollectionErrorResp = feeCollectionErrorResp;
  }, [academicYearListResp, addFeeRefundResp, feeCollectionErrorResp, getLedgerForFeeAdjustResp]);

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
      getCurriculumApiCall({ academicYearId });
      if (curriculumId) {
        getClassApiCall(curriculumId);
      }
      if (studentId) {
        const params = { studentDetailId: studentId, academicYearId, refundFor: "EXCESS_AMOUNT" };
        dispatch(getStudentRefundLedgerAct(generateActionPayload("get_student_hostel_refund_ledger", undefined, params)));
      }
      setSelectedStudentState({ studentName: studentName, studentCode: studentCode, studentId })
    }

    if (instituteId) {
      const payload = { instituteId, sortBy: "academicYearName", orderBy: "desc", pageNo: 0, pageSize: 20 };
      dispatch(getInstAcademicYearAct(generateActionPayload("get_inst_academic_year", undefined, payload)));

      dispatch(getMasterBanksAct(generateActionPayload("get_master_banks", undefined, { pageNo: 0, pageSize: 100 })));
    }

  }, [branchId, instituteId])

  useEffect(() => {
    return () => {
      //Clear Data On Unmount
      dispatch(setStudentRefundLedgersAct(undefined));
      dispatch(setAddFeeRefundAct(undefined));
      dispatch(setLedgerForFeeAdjustAct(undefined));
      dispatch(setStuForFeeAdjustAct(undefined));
    }
  }, []);

  useEffect(() => {
    if (studentRefundLedgerResp && Array.isArray(studentRefundLedgerResp)) {
      if (studentRefundLedgerResp.length === 0) {
        setShowWarningModalState(prevState => ({
          ...prevState, showModal: true,
          warningMessage: 'There is no fee to refund for the selected student.',
          studentName: selectedStudentState?.studentName || ""
        }));
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
      }).filter((f: any) => f)

      dispatch(addFeeRefundAct(generateActionPayload("add_hostel_fee_refund", undefined, payload)));
    },
  });

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
      getCurriculumApiCall({ academicYearId: value })
      addFeeRefundForm.resetForm({
        values: {
          ...initialValueRefundForm, [name]: value, refundFor
        }
      });
      setFeeRefundList([])
    }
    setSelectedStudentState(null);
    dispatch(setStudentsListAct({}));
    dispatch(setStudentRefundLedgersAct(undefined));
  }

  const getCurriculumApiCall = (otherProps?: any) => {
    const payload1 = { academicYearId: addFeeRefundForm.values.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", ...otherProps };
    dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
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
    if (studentDetailId && academicYearId) {
      // const params = { studentDetailId: 1, academicYearId: 2, refundFor };
      const params = { studentDetailId, academicYearId, refundFor: value };
      dispatch(getStudentRefundLedgerAct(generateActionPayload("get_student_hostel_refund_ledger", undefined, params)));
    }
    dispatch(setStudentsListAct({}));
    dispatch(setStudentRefundLedgersAct(undefined));
  }


  function getClassApiCall(curriculumId: string) {
    // sortBy: "className", orderBy: "asc"
    const payload = { pageNo: 0, pageSize: 100, sortBy: "classSequence", orderBy: "asc", curriculumId, branchId };
    dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
  }

  function onInputSearchChange(inputString: any) {
    const { academicYearId, branchClassId, branchCurriculumId } = addFeeRefundForm.values;
    if (academicYearId) {
      const params = {
        branchId, academicYearId, classId: branchClassId,
        curriculumId: branchCurriculumId, searchString: inputString,
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
      addFeeRefundForm.setValues((prev: any) => ({
        ...prev,
        branchCurriculumId: curriculumId,
        branchClassId: classId,
      }))
      const params = { studentDetailId: studentId, academicYearId, refundFor };
      dispatch(getStudentRefundLedgerAct(generateActionPayload("get_student_hostel_refund_ledger", undefined, params)));
    } else {
      const { refundFor, branchCurriculumId, branchClassId, academicYearId } = addFeeRefundForm.values;
      setSelectedStudentState(null);
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
        searchString: inputString,
      };
      dispatch(getStuForFeeAdjustAct(generateActionPayload("get_stu_for_hostel_fee_adjust", undefined, params)));
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
      dispatch(getLedgerForFeeAdjustAct(generateActionPayload("get_ledgers_hostel_fee_adjust", { id: studentId })));
      // dispatch(getStudentRefundLedgerAct(generateActionPayload("get_student_refund_ledger", undefined, params)));
    }
    addFeeRefundForm.setValues((prevState: any) => ({
      ...prevState, "adjustedStudentDetailsId": studentId,
      totalAdjustAmount: "0.00"
    }))
    addFeeRefundForm.setFieldValue("adjustedStudentDetailsId", studentId || "");
  }

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
  const refundColumns = useMemo(() => feeRefundColumns(allFeeSelectedState, studentCheckHndlr, selectAllFeeHndlr), [addFeeRefundForm]);
  const adjustmentColumns = useMemo(() => feeAdjustmentColumns(allAdjustLedgerSelectedState,
    allFeeLedgerCheckHndlr, feeLedgerCheckHndlr), [adjustingFeeLedgerState]);
  return (
    <>
      <div>
        <div className="page-content new_fee_receipt_page_warp">
          <div className="tw-mx-auto tw-px-4">
            <BreadCrumb title="Fee Receipts" pageTitle="Fee" pageTitleUrl={location.state ? "/hostel-student-ledger/ledger-details" : "/hostel-student-ledger"}
              linkState={{
                studentId: location.state?.studentId, academicYearId: location.state?.academicYearId,
                curriculumId: location.state?.curriculumId,
                classId: location.state?.classId
              }} />


            <div className="tw-bg-white tw-rounded-lg tw-shadow tw-mb-6">
              <div className="tw-px-6 tw-py-4 tw-border-b tw-border-gray-200">
                <div className="tw-grid tw-grid-cols-1 tw-items-center">
                  <div className="tw-col-span-1">
                    <h4 className="tw-text-lg tw-font-medium tw-mb-0 tw-flex-grow">
                      Create Refund
                    </h4>
                  </div>
                </div>
              </div>
              <form onSubmit={addFeeRefundForm.handleSubmit}>
                <div className="tw-p-6">
                  <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-12 tw-pb-2 tw-border-b-2 tw-border-dashed tw-border-gray-300">
                    <div className="tw-col-span-1 md:tw-col-span-3">
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
                    <div className="tw-col-span-1 md:tw-col-span-5">

                    </div>
                    <div className="tw-col-span-1 md:tw-col-span-4">
                      <SelectInput
                        name="academicYearId"
                        formgroupClassName="tw-mb-1"
                        // labelText="Academic Year"
                        value={addFeeRefundForm.values.academicYearId}
                        onChange={onChangeHndlr}
                        onBlur={addFeeRefundForm.handleBlur}
                        menuItems={academicYearListResp?.data}
                        valueKey="academicYearId"
                        textKey="academicYearName"
                        defaultSelect="Academic Year"
                        isDisabled={location.state}
                        invalid={(addFeeRefundForm.touched.academicYearId && addFeeRefundForm.errors.academicYearId) ? true : false}
                        error={(addFeeRefundForm.touched.academicYearId && addFeeRefundForm.errors.academicYearId) ? addFeeRefundForm.errors.academicYearId : ""}
                      // isDisabled={true}
                      />


                      <AutoSearchInputUpdated
                        formgroupClassName="search-box tw-mb-1"
                        alignRight={true}
                        name="studentDetailId"
                        placeHolder="Search..."
                        // onChange={(e: any) => setSearchInputState(e.target.value)}
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
                        invalid={(addFeeRefundForm.touched.studentDetailId && addFeeRefundForm.errors.studentDetailId) ? true : false}
                        error={(addFeeRefundForm.touched.studentDetailId && addFeeRefundForm.errors.studentDetailId) ? addFeeRefundForm.errors.studentDetailId : ""}
                      ><i className="ri-search-line search-icon"></i></AutoSearchInputUpdated>
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
                        invalid={(addFeeRefundForm.touched.branchCurriculumId && addFeeRefundForm.errors.branchCurriculumId) ? true : false}
                        error={(addFeeRefundForm.touched.branchCurriculumId && addFeeRefundForm.errors.branchCurriculumId) ? addFeeRefundForm.errors.branchCurriculumId : ""}
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
                        invalid={(addFeeRefundForm.touched.branchClassId && addFeeRefundForm.errors.branchClassId) ? true : false}
                        error={(addFeeRefundForm.touched.branchClassId && addFeeRefundForm.errors.branchClassId) ? addFeeRefundForm.errors.branchClassId : ""}
                      />
                    </div>
                  </div>
                  <div className="tw-grid tw-grid-cols-1 tw-py-2 tw-mb-2 tw-border-b-2 tw-border-dashed tw-border-gray-300">
                    <TableContainer
                      columns={refundColumns}
                      data={Array.isArray(feeRefundList) ? feeRefundList : []}
                      tableClass="tw-mb-0"
                      onChangeInputHndlr={onChangeInputHndlr}
                      divClass="tw-overflow-x-auto"
                      theadClass="tw-table-light tw-text-gray-500 tw-align-middle"
                    />
                    <div className="tw-col-span-1">
                      <span className="tw-block tw-text-red-600 tw-text-sm tw-mt-1">
                        {(addFeeRefundForm.touched.studentRefundLedgerIds && addFeeRefundForm.errors.studentRefundLedgerIds) ? addFeeRefundForm.errors?.studentRefundLedgerIds?.toString() : ""}
                      </span>
                    </div>

                  </div>
                  <div className="tw-grid tw-grid-cols-1 tw-py-3">
                    <div className="tw-col-span-1 md:tw-col-start-5 md:tw-col-span-8 lg:tw-col-start-8 lg:tw-col-span-5">

                      <div className="tw-grid tw-grid-cols-2 tw-items-center tw-mb-2">
                        <div className="tw-col-span-1 tw-p-0">
                          <h6 className="tw-m-0">Final Refund Amount</h6>
                        </div>
                        <div className="tw-col-span-1">
                          <TextInputGroup
                            name="finalRefundableAmount"
                            formgroupClassName="tw-mb-0"
                            inputgroupClassName="input-group-sm"
                            inputClassName="form-control-sm"
                            inputGroupStart={true}
                            value={getAmountValueWithDecimal(+addFeeRefundForm.values.finalRefundableAmount)}
                            onChange={undefined}
                            isDisabled={true}
                          >
                            <RupeeSvg width="11px" height="11px" fill={"#495057"} />
                          </TextInputGroup>
                        </div>
                      </div>
                      {((addFeeRefundForm?.values?.paymentMode === "CHEQUE") || (addFeeRefundForm?.values?.paymentMode === "CASH") || (addFeeRefundForm?.values?.paymentMode === "ONLINE")) &&
                        <div className="tw-grid tw-grid-cols-2 tw-items-center tw-mb-2">
                          <div className="tw-col-span-1 tw-p-0">
                            <h6 className="tw-m-0"> {addFeeRefundForm?.values?.paymentMode === "CHEQUE" ? "Cheque" : addFeeRefundForm?.values?.paymentMode === "CASH" ? "Cash" : "Online"} Amount</h6>
                          </div>
                          <div className="tw-col-span-1">
                            <TextInputGroup
                              name="paymentAmount"
                              formgroupClassName="tw-mb-0"
                              inputgroupClassName="input-group-sm"
                              inputClassName="form-control-sm"
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
                        </div>}

                      {(addFeeRefundForm?.values?.paymentMode === "ADJUSTMENT") &&
                        <div className=" tw-grid-cols-2 tw-flex tw-items-center tw-mb-2 tw-mt-2">
                          <div className="tw-col-span-1 tw-p-0">
                            <h6 className="tw-m-0">Adjust Amount</h6>
                          </div>
                          <div className="tw-col-span-1">
                            <TextInputGroup
                              name="totalAdjustAmount"
                              formgroupClassName="tw-mb-0"
                              inputgroupClassName="input-group-sm"
                              inputClassName="form-control-sm"
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
                        </div>}
                      <div className="tw-grid-cols-2 tw-flex">
                        <div className="tw-col-span-1 tw-p-0">
                          <h6 className="tw-m-0">Remarks</h6>
                        </div>
                        <div className="tw-col-span-1">
                          <TextArea
                            name="remarks"
                            // labelText='Remarks'
                            value={addFeeRefundForm.values.remarks}
                            onChange={addFeeRefundForm.handleChange}
                            onBlur={addFeeRefundForm.handleBlur}
                            formgroupClassName='tw-mb-0'
                            invalid={(addFeeRefundForm.touched.remarks && addFeeRefundForm.errors.remarks) ? true : false}
                            error={(addFeeRefundForm.touched.remarks && addFeeRefundForm.errors.remarks) ? addFeeRefundForm.errors.remarks : ""}
                          />
                        </div>
                      </div>

                    </div>
                  </div>
                  <div className="tw-grid tw-grid-cols-1 tw-mb-2">
                    <div className="tw-col-span-1 md:tw-col-span-4">
                      <h6 className="tw-font-normal tw-text-gray-500 tw-mb-3" >PAYMENT DETAILS</h6>
                      <SelectInput
                        name="paymentMode"
                        // labelText="Receipt For"
                        formgroupClassName="tw-mb-3"
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

                  {(addFeeRefundForm?.values?.paymentMode === "CHEQUE") &&
                    <div className="tw-grid tw-grid-cols-1">
                      <div className="tw-col-span-1 md:tw-col-span-4">
                        <TextInput
                          name="feeRefundChequeDTO.accountPayeeName"
                          formgroupClassName="tw-mb-2"
                          value={addFeeRefundForm.values.feeRefundChequeDTO.accountPayeeName}
                          onChange={addFeeRefundForm.handleChange}
                          placeHolder="In the Name of"
                          invalid={(addFeeRefundForm.touched?.feeRefundChequeDTO?.accountPayeeName && addFeeRefundForm.errors?.feeRefundChequeDTO?.accountPayeeName) ? true : false}
                          error={(addFeeRefundForm.touched?.feeRefundChequeDTO?.accountPayeeName && addFeeRefundForm.errors?.feeRefundChequeDTO?.accountPayeeName) ? addFeeRefundForm.errors?.feeRefundChequeDTO?.accountPayeeName : ""}
                        />
                        <DateInput
                          name="feeRefundChequeDTO.chequeDate"
                          formgroupClassName="tw-mb-2"
                          value={addFeeRefundForm.values.feeRefundChequeDTO.chequeDate}
                          onChange={addFeeRefundForm.handleChange}
                          invalid={(addFeeRefundForm.touched?.feeRefundChequeDTO?.chequeDate && addFeeRefundForm.errors?.feeRefundChequeDTO?.chequeDate) ? true : false}
                          error={(addFeeRefundForm.touched?.feeRefundChequeDTO?.chequeDate && addFeeRefundForm.errors?.feeRefundChequeDTO?.chequeDate) ? addFeeRefundForm.errors?.feeRefundChequeDTO?.chequeDate : ""}
                        />

                        <SelectInput
                          name="feeRefundChequeDTO.bankName"
                          // labelText="Receipt For"
                          formgroupClassName="tw-mb-3"
                          value={addFeeRefundForm.values.feeRefundChequeDTO.bankName}
                          onChange={addFeeRefundForm.handleChange}
                          onBlur={addFeeRefundForm.handleBlur}
                          menuItems={masterBanksResp?.content || []}
                          valueKey="bankName"
                          textKey="bankName"
                          defaultSelect="Bank Name"
                          // inputClassName="tw-text-gray-500"
                          invalid={(addFeeRefundForm.touched?.feeRefundChequeDTO?.bankName && addFeeRefundForm.errors?.feeRefundChequeDTO?.bankName) ? true : false}
                          error={(addFeeRefundForm.touched?.feeRefundChequeDTO?.bankName && addFeeRefundForm.errors?.feeRefundChequeDTO?.bankName) ? addFeeRefundForm.errors?.feeRefundChequeDTO?.bankName : ""}
                        />
                        <TextInput
                          name="feeRefundChequeDTO.chequeNumber"
                          formgroupClassName="tw-mb-2"
                          value={addFeeRefundForm.values.feeRefundChequeDTO.chequeNumber}
                          onChange={addFeeRefundForm.handleChange}
                          placeHolder="Cheque Number"
                          invalid={(addFeeRefundForm.touched?.feeRefundChequeDTO?.chequeNumber && addFeeRefundForm.errors?.feeRefundChequeDTO?.chequeNumber) ? true : false}
                          error={(addFeeRefundForm.touched?.feeRefundChequeDTO?.chequeNumber && addFeeRefundForm.errors?.feeRefundChequeDTO?.chequeNumber) ? addFeeRefundForm.errors?.feeRefundChequeDTO?.chequeNumber : ""}
                        />
                      </div>
                    </div>
                  }
                  {(addFeeRefundForm?.values?.paymentMode === "ADJUSTMENT") && <>
                    <div className="tw-grid tw-grid-cols-1 tw-mb-2">
                      <div className="tw-col-span-1 md:tw-col-span-4">
                        <AutoSearchInput
                          formgroupClassName="search-box tw-mb-3"
                          // alignRight={true}
                          name="adjustedStudentDetailsId"
                          placeHolder="Search..."
                          // onChange={(e: any) => setSearchInputState(e.target.value)}
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
                          invalid={(addFeeRefundForm.touched.adjustedStudentDetailsId && addFeeRefundForm.errors.adjustedStudentDetailsId) ? true : false}
                          error={(addFeeRefundForm.touched.adjustedStudentDetailsId && addFeeRefundForm.errors.adjustedStudentDetailsId) ? addFeeRefundForm.errors.adjustedStudentDetailsId : ""}
                        ><i className="ri-search-line search-icon"></i></AutoSearchInput>
                      </div>
                    </div>
                    <div className="tw-grid tw-grid-cols-1">
                      <h5>Adjust To Fees</h5>
                      <TableContainer
                        columns={adjustmentColumns}
                        data={adjustingFeeLedgerState}
                        divClass="tw-overflow-x-auto tw-mb-3"
                        tableClass="tw-mb-0"
                        theadClass="tw-table-light tw-text-gray-500 tw-align-middle"
                        onChangeInputHndlr={onChangeAdjustTableHndlr}
                        onBlurInputHndlr={onBlurAdjustTableHndlr}
                      />
                    </div>
                    {/* <div className="row">
                      <div className="col-5 ms-auto">
                        <div className="row d-flex align-items-center mb-2">
                          <div className="col-5">
                            <h6 className="m-0">Final Refund Amount</h6>
                          </div>
                          <div className="col-7">
                            <TextInputGroup
                              name="finalRefundableAmount"
                              formgroupClassName="mb-0"
                              inputgroupClassName="input-group-sm"
                              inputClassName="form-control-sm"
                              inputGroupStart={true}
                              value={addFeeRefundForm.values.finalRefundableAmount}
                              onChange={undefined}
                              isDisabled={true}
                            >
                              <RupeeSvg width="11px" height="11px" fill={"#495057"} />
                            </TextInputGroup>
                          </div>
                        </div>
                        <div className="row mb-3">
                          <div className="col-5">
                            <h6 className="m-0">Remarks</h6>
                          </div>
                          <div className="col-7">
                            <TextArea
                              name="remarks"
                              // labelText='Remarks'
                              value={addFeeRefundForm.values.remarks}
                              onChange={addFeeRefundForm.handleChange}
                              onBlur={addFeeRefundForm.handleBlur}
                              formgroupClassName='mb-0'
                              invalid={(addFeeRefundForm.touched.remarks && addFeeRefundForm.errors.remarks) ? true : false}
                              error={(addFeeRefundForm.touched.remarks && addFeeRefundForm.errors.remarks) ? addFeeRefundForm.errors.remarks : ""}
                            />
                          </div>
                        </div>
                      </div>
                    </div> */}
                  </>}
                  {(addFeeRefundForm?.values?.paymentMode === "ONLINE") &&
                    <div className="tw-grid tw-grid-cols-1">
                      <div className="tw-col-span-1 md:tw-col-span-4">
                        <TextInput
                          name="onlineDetailDTO.transactionId"
                          value={addFeeRefundForm.values.onlineDetailDTO.transactionId}
                          onChange={addFeeRefundForm.handleChange}
                          placeHolder="Transaction Id"
                          formgroupClassName="tw-mb-2"
                          invalid={(addFeeRefundForm.touched?.onlineDetailDTO?.transactionId && addFeeRefundForm.errors?.onlineDetailDTO?.transactionId) ? true : false}
                          error={(addFeeRefundForm.touched?.onlineDetailDTO?.transactionId && addFeeRefundForm.errors?.onlineDetailDTO?.transactionId) ? addFeeRefundForm.errors?.onlineDetailDTO?.transactionId : ""}
                        />
                        <DateInput
                          formgroupClassName="tw-mb-2"
                          name="onlineDetailDTO.transactionDate"
                          value={addFeeRefundForm.values.onlineDetailDTO.transactionDate}
                          onChange={addFeeRefundForm.handleChange}
                          invalid={(addFeeRefundForm.touched?.onlineDetailDTO?.transactionDate && addFeeRefundForm.errors?.onlineDetailDTO?.transactionDate) ? true : false}
                          error={(addFeeRefundForm.touched?.onlineDetailDTO?.transactionDate && addFeeRefundForm.errors?.onlineDetailDTO?.transactionDate) ? addFeeRefundForm.errors?.onlineDetailDTO?.transactionDate : ""}
                        />
                      </div>``
                    </div>
                  }
                  <div className="tw-grid tw-grid-cols-1">
                    <div className="tw-col-span-1 tw-flex tw-justify-end tw-gap-2">
                      <Button type="button" variant="secondary" onClick={() => history.push("/hostel-fee-refund")} >Cancel</Button>
                      <Button type="submit" variant="primary" disabled={showApiLoader}>Refund</Button>
                      {/* <button className="tw-bg-emerald-500 tw-text-white tw-border-0 tw-rounded tw-float-right tw-px-4 tw-py-2 tw-mr-2 hover:tw-bg-emerald-600 tw-transition-colors"><PrintSvg className="tw-mr-2 tw-inline-block" stroke="#FFFFFF" />Save
                    </button> */}
                    </div>
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
          <Button onClick={toggleLedgerWarningHndler} variant="secondary">Close</Button>
          <Button onClick={toggleLedgerWarningHndler} variant="primary">Ok</Button>
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
    </>
  );
};

export default FeeRefundPage;
