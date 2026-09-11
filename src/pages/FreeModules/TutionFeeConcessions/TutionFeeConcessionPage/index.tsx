import { useFormik } from "formik";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AutoSearchInput,
  AutoSearchInputUpdated,
  ConfirmationModal,
  ModalContainerUpdated,
  MultipleFileUpload,
  SelectInput,
  TextArea,
  TextInputGroup,
} from "../../../../Components/Common";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import {
  concessionMode,
  concessionType,
  generateColumns,
} from "./helper";
import { NewStudentConcessionDataTypes } from "./tutionFeesConcessionTypes";
import TableContainer from "../../../../Components/Common/TableContainer";
import { IStudentConcessionModal } from "../tutionFeeConcessionsTypes";
import ViewConcessions from "./ViewConcessions";
import { shallowEqual, useDispatch } from "react-redux";
import { getInstAcademicYearAct } from "../../../../store/mastersettings/instacademics/instacademicactions";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { getBranchClassAct, getBranchCurriculumAct, resetBrchClassAct, resetBrchCurriculumAct } from "../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { useAppSelector } from "../../../../hooks/storehook";
import { getStudentsListAct } from "../../../../store/directory/studentmanagement/studentmanagementactions";
import { getLedgerDetailsAct, resetLedgerDetailsAct } from "../../../../store/fee/feecollections/feecollectionactions";
import { getAmountValueWithDecimal, percentageConverter, valueConverter } from "../../../../utility/commonutility";
import { addTutionFeeConcessionAct, editTutionFeeConcessionAct, getTutionFeeConcessionByIdAct } from "../../../../store/fee/feeconcessions/feeconcessionactions";
import { toast } from "react-toastify";
import { useHistory, useLocation } from "react-router-dom";
import { getEmployeeByFilterAct } from "../../../../store/directory/employeemanagement/employeemanagementactions";
import * as Yup from 'yup';
import { FormFeedback } from "reactstrap";
import { default as RupeeSvg } from "../../../../assets/imagesdps/feeDashboard/RupeeSvg.svg?react";
import CheckConcessionModal from "../../StudentConcessions/StudentConcessionPage/CheckConcessionModal";
import { getSiblingForRegistrationAct } from "../../../../store/FrontDesk/AdmissionRegistration/admissionregistrationaction";

const initialValues: NewStudentConcessionDataTypes = {
  // type: "Term Wise",
  academicYearId: "",
  curriculumId: "",
  studentId: "",
  siblingId: "",
  employeeId: "",
  minimumNetAmount: "",
  // studentName: "",
  concessionType: "",
  concessionMode: "",
  concessionValue: "",
  totalConcessionAmount: "",
  classId: "",
  isNoFeeSelected: "",
  document: null,
  // concessionDetails: {
  //   concession: "",
  //   price: "0.0",
  // },
  remarks: "",
};

const StudentConcessionPage = () => {
  const [newStudentConcessionDataState, setNewStudentConcessionDataState] =
    useState<NewStudentConcessionDataTypes>(initialValues);
  const [searchStudentState, setSearchStudentState] = useState<any>(null);
  const [siblingState, setSiblingState] = useState<any>(null);
  const [employeeState, setEmployeeState] = useState<any>(null);
  const [fullConcessionErr, setFullConcessionErr] = useState(false);
  const [allFeeSelectedState, setAllFeeSelectedState] = useState(false);
  const [ledgerList, setLedgerList] = useState<any>([]);
  const [selectedLedgerIds, setSelectedLedgerIds] = useState<any>([]);
  const [availableStudentState, setAvailableStudentState] = useState([]);
  const [totalConcessionAmount, setTotalConcessionAmount] = useState<any>(0);
  const [document, setDocument] = useState<any>([]);
  const dispatch = useDispatch();
  const history = useHistory();
  const location: any = useLocation();

  const [checkConcessionModal, setCheckConcessionModal] =
    useState<any>({
      showModal: false,
      id: null,
    });

  const validationSchema = Yup.object().shape({
    // receiptFor: Yup.string().required("Select receipt for."),
    // yup.number().required().test(
    //   'is-greater',
    //   'Value 2 must be greater than Value 1',
    //   function (value) {
    //     const value1 = this.resolve(yup.ref('value1'));
    //     return value > value1;
    //   }
    // ),
    concessionValue: Yup.number().min(0, 'Concession should be more than 0').required("Enter Concession Value.").when('concessionMode', {
      is: (item: any) => item === "PERCENTAGE",
      then: Yup.number().max(100, 'Concession should be less than 100').nullable(),
      otherwise: Yup.number()
    }),
    // .test('is-greater',`Concession should be less than`,function(value:any){
    //   const val1:any=this.resolve(Yup.ref('minimumNetAmount'));
    //   return value<val1;
    // }),
    concessionMode: Yup.string().required("Select Concession Mode").nullable(),
    concessionType: Yup.string().required("Select Concession Type").nullable(),
    classId: Yup.string().required("Select class.").nullable(),
    curriculumId: Yup.string().required("Select curriculum.").nullable(),
    // academicYearId: Yup.string().required("Select academic year."),
    studentId: Yup.string().required("Student is required.").nullable(),
    siblingId: Yup.string().when('concessionType', {
      is: (item: any) => item === "SIBLING",
      then: Yup.string().required('Sibling id is required.').nullable()
    }),
    employeeId: Yup.string().when('concessionType', {
      is: (item: any) => item === "EMPLOYEE",
      then: Yup.string().required('Employee id is required.').nullable()
    }),
    // transactionId: Yup.string().when('paymentMode', {
    //   is: (item: any) => item === "ONLINE",
    //   then: Yup.string().required('Transaction id is required.')
    // }),
    // transactionDate: Yup.string().when('paymentMode', {
    //   is: (item: any) => item === "ONLINE",
    //   then: Yup.string().required('Transaction date is required.')
    // }),
    remarks: Yup.string().required("Remarks are required.").nullable(),
    document: Yup.array().test('is-files-required', 'At least one file is required', function (value) {
      // if (!location.state?.concessionId && (!value || value.length === 0)) {
      if (!value || value.length === 0) {
        return false;
      }
      return true;
    }).nullable(),
  });

  const toggleCheckConcessionModal = (id?: any) => {
    setCheckConcessionModal((prevState: any) => ({
      ...prevState,
      showModal: !prevState.showModal,
      id: id || null,
    }));
  };

  const NewTutionConcessionForm = useFormik({
    enableReinitialize: true,
    initialValues: newStudentConcessionDataState,
    validationSchema,
    onSubmit: (values) => {
      let selectedStudents: any = [];
      let payload = {};
      availableStudentState.map((stu: any) => {
        if (stu?.isSelected) {
          selectedStudents.push({
            studentLedgerId: stu.id,
            concessionValueInPerc: percentageConverter(stu.amountToPay, values.concessionMode, values.concessionValue),
            concessionAmount: valueConverter(stu.amountToPay, values.concessionMode, values.concessionValue)
          })
        }
      })
      if (selectedStudents.length > 0) {

        if (values.concessionMode === "AMOUNT" && (+values.totalConcessionAmount !== +values.concessionValue)) {
          toggleCheckConcessionModal()
        } else {
          toggleSubmitConfirmationModal(payload)
        }
      }
      else {
        NewTutionConcessionForm.setFieldError('isNoFeeSelected', "*Select At least One Fee")
      }
      // if (!(selectedStudents.length > 0)) {
      //   NewTutionConcessionForm.setFieldError('isNoFeeSelected', "*Select At least One Fee")
      // }else{
      //   toggleSubmitConfirmationModal()
      // }

    },
  });

  const {
    academicYearListResp,
    brchCurriculumResp,
    branchClassResp,
    tutionFeeConcessionById,
    addTutionFeeConcession,
    editTutionFeeConcession,
    feeSummaryList,
    ledgerDetails,
    studentsListResp,
    getStudentsByFilterResp,
    getEmployeesByFilterResp,
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    showApiLoader,
    siblingsForRegistrationResp,
  }: any = useAppSelector(
    ({ classroomManagmentInfo, globalData, instAcademics, branchAcademics, appData, feeConcession, feeCollections, directoryStudent, directoryEmployee, admissionRegistration }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      branchClassResp: branchAcademics.branchClassResp,
      addTutionFeeConcession: feeConcession.addTutionFeeConcession,
      editTutionFeeConcession: feeConcession.editTutionFeeConcession,
      tutionFeeConcessionById: feeConcession.tutionFeeConcessionById,
      studentsListResp: directoryStudent.studentsListResp,
      getStudentsByFilterResp: directoryStudent.getStudentsByFilterResp,
      getEmployeesByFilterResp: directoryEmployee.getEmployeesByFilterResp,
      ledgerDetails: feeCollections.ledgerDetails,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      showApiLoader: globalData.showApiLoader,
      siblingsForRegistrationResp: admissionRegistration.siblingsForRegistrationResp,
    }),
    shallowEqual
  );


  const selectAllFeeHndlr = useCallback((event: any) => {
    const { checked } = event.target;
    if (checked) {
      let total = 0;
      ledgerList.map((ledger: any) => {
        if (+ledger.amountToPay >= +NewTutionConcessionForm.values.concessionValue) {
          total = +total + +valueConverter(ledger?.amountToPay, NewTutionConcessionForm.values.concessionMode, NewTutionConcessionForm.values.concessionValue);
        }
      })

      NewTutionConcessionForm.setFieldValue('totalConcessionAmount', total);
    }
    else {
      NewTutionConcessionForm.setFieldValue('totalConcessionAmount', 0);
    }
    setAllFeeSelectedState(checked);
    const updateSearchStudentListState: any = [...ledgerList];
    const updatedAvailableStudentState: any = [...availableStudentState];

    const modifiedStudentId: any = [];
    updateSearchStudentListState.forEach((item: any) => {
      let { concessionMode, concessionValue } = NewTutionConcessionForm.values;
      if ((concessionMode === "AMOUNT" && +item.amountToPay >= +concessionValue) || (concessionMode === "PERCENTAGE" && +concessionValue <= 100)) {
        item.isSelected = checked;
        modifiedStudentId.push(item.id);
      }
    });

    updatedAvailableStudentState.forEach((item: any) => {
      let { concessionMode, concessionValue } = NewTutionConcessionForm.values;
      if ((concessionMode === "AMOUNT" && +item.amountToPay >= +concessionValue) || (concessionMode === "PERCENTAGE" && +concessionValue <= 100)) {
        item.isSelected = modifiedStudentId.includes(item.id) ? checked : item.isSelected;
        modifiedStudentId.push(item.id);
      }
    });
    setLedgerList(updateSearchStudentListState);
    setAvailableStudentState(updatedAvailableStudentState);
    // updateSelectedAllHndlr(updatedAvailableStudentState);
  }, [ledgerList, availableStudentState]);

  const gettingCalculation = (value: any, availableCon: any, checked: any, cntConcession: any) => {
    let newVal = 0, newAvailableCon = 0;
    if (+value >= +availableCon && checked) {
      newVal = availableCon;
      newAvailableCon = 0;
    }
    else if (+value < +availableCon && checked) {
      newAvailableCon = +availableCon - +value;
      newVal = value;
    }
    else if (!checked) {
      newAvailableCon = +availableCon + +cntConcession;
      newVal = 0;
    }
    return {
      concessionAmount: newVal,
      availableConcessionAmount: newAvailableCon
    }
  }

  const studentCheckHndlr = useCallback((event: any) => {
    const { name, value, checked } = event.currentTarget,
      studentId = event.currentTarget.getAttribute("data-id"),
      studentIndex = availableStudentState.findIndex((item: any) => +item.id === +Number(studentId)),
      studentIndexInSearchedStudent = ledgerList.findIndex((item: any) => +item.id === +Number(studentId)),
      student: any = ledgerList.find((item: any) => +item.id === Number(studentId))

    if (studentIndex > -1 && studentIndexInSearchedStudent > -1) {
      const studentDetails: any = ledgerList[studentIndex],
        updatedAvailableStudentState: any = [...availableStudentState],
        updatedSearchStudentState: any = [...ledgerList];
      let data: any = gettingCalculation(studentDetails.amountToPay, studentDetails.availableConcessionAmount, checked, studentDetails.concessionAmount);
      const abcd = updatedSearchStudentState.map((student: any) => {
        if (+student.id === +studentId) {
          let totalConcession: any = +NewTutionConcessionForm.values.concessionValue;
          if (checked) {

            if (NewTutionConcessionForm.values.concessionMode === "AMOUNT" && +NewTutionConcessionForm.values.concessionValue > (student?.remainingAmount)) {

              totalConcession = +student?.remainingAmount

              NewTutionConcessionForm.setFieldValue('totalConcessionAmount', totalConcession);
              return { ...student, isSelected: checked, concessionAmount: +student?.remainingAmount }

            } else {
              totalConcession = valueConverter(student?.remainingAmount, NewTutionConcessionForm.values.concessionMode, NewTutionConcessionForm.values.concessionValue)
              NewTutionConcessionForm.setFieldValue('totalConcessionAmount', totalConcession);

              return { ...student, isSelected: checked, concessionAmount: +valueConverter((student?.remainingAmount), NewTutionConcessionForm.values.concessionMode, NewTutionConcessionForm.values.concessionValue) }
            }
          } else {
            NewTutionConcessionForm.setFieldValue('totalConcessionAmount', 0.00);
            return { ...student, isSelected: checked, concessionAmount: 0 }
          }
        }
        else {
          return { ...student };
        }
      })


      let minimum = 999999999999999;
      updatedSearchStudentState.map((ledger: any) => {
        if (ledger.isSelected) {
          minimum = minimum > ledger.amountToPay ? ledger.amountToPay : minimum;
        }
      })

      NewTutionConcessionForm.setFieldValue('minimumNetAmount', minimum);

      setAvailableStudentState(abcd);
      setLedgerList(abcd);
      updateSelectedAllHndlr(updatedSearchStudentState);
    }

  }, [ledgerList, NewTutionConcessionForm.values.concessionMode, NewTutionConcessionForm.values.concessionValue]);

  const roleColumns = useMemo(() => generateColumns(NewTutionConcessionForm.values.concessionMode, NewTutionConcessionForm.values.concessionValue, allFeeSelectedState,
    selectAllFeeHndlr, studentCheckHndlr, setFullConcessionErr), [NewTutionConcessionForm, ledgerList]);

  const [studentConcessionModal, setStudentConcessionModal] =
    useState<IStudentConcessionModal>({
      showModal: false,
      branchId: "",
    });
  const toggleStudentConcessionModal = () => {
    setStudentConcessionModal((prevState) => ({
      ...prevState,
      showModal: !prevState.showModal,
    }));
  };
  const filterHandler = (event: any) => {
    const { name, value } = event.target;
    if (name === "concessionValue") {
      if (NewTutionConcessionForm.values.concessionMode === "PERCENTAGE") {
        if (+value <= 100) {
          NewTutionConcessionForm.handleChange(event);
        }
      } else {
        NewTutionConcessionForm.handleChange(event);
      }
    } else {
      NewTutionConcessionForm.handleChange(event);
    }
    if (name === "academicYearId") {
      NewTutionConcessionForm.setValues((prev: any) => ({ ...initialValues, [name]: value }));
      dispatch(resetLedgerDetailsAct(undefined));
      setSearchStudentState(null)
      setFullConcessionErr(false)
    }
    else if (name === "classId") {
      // setSearchStudentState(null)
      // dispatch(resetLedgerDetailsAct(undefined));
    }
    else if (name === "curriculumId") {
      const payload = { branchId: branchId, curriculumId: value, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100 };
      dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
      dispatch(resetLedgerDetailsAct(undefined));
      setSearchStudentState(null)
      NewTutionConcessionForm.setValues((prev: any) => ({ ...prev, [name]: value, classId: "" }));
      !value && dispatch(resetBrchClassAct(undefined));

    }
    else if (name === "concessionMode") {
      let newled: any = ledgerList.map((ledger: any) => ({ ...ledger, isSelected: false, mode: value }));
      setLedgerList(newled);
      updateSelectedAllHndlr(newled)
      NewTutionConcessionForm.setValues((prev: any) => ({ ...prev, [name]: value, concessionValue: "", totalConcessionAmount: "" }));
      // NewStudentConcessionForm.setFieldValue('totalConcessionAmount', 0);
      // NewStudentConcessionForm.setFieldValue('minimumNetAmount',999999999999999);
    }
    else if (name === "concessionValue") {

      let totalValue = event.target.value;
      let newled: any;
      if (NewTutionConcessionForm.values.concessionMode === "AMOUNT") {
        newled = ledgerList?.map((ledger: any) => {
          if (ledger?.isSelected) {
            if ((+ledger?.remainingAmount) <= totalValue) {
              totalValue = totalValue - (+ledger?.remainingAmount)
              return { ...ledger, concessionAmount: (+ledger?.remainingAmount) }
            } else {
              let newValue: any = totalValue
              totalValue = 0
              return { ...ledger, concessionAmount: +newValue || 0 }
            }
          }
          return { ...ledger, concessionAmount: 0, isSelected: false }
        })
      } else {
        newled = ledgerList.map((ledger: any) => ({ ...ledger, isSelected: false }));
      }
      let totalConcession: any = 0;
      newled.map((ledger: any) => {
        if (ledger?.isSelected) {
          totalConcession += (+ledger.concessionAmount || 0)
        }
      })

      // let newled: any = ledgerList.map((ledger: any) => ({ ...ledger, isSelected: false,availableConcessionAmount: value, concessionAmount: 0 }));
      setLedgerList(newled);
      updateSelectedAllHndlr(newled)
      NewTutionConcessionForm.setFieldValue('totalConcessionAmount', +totalConcession);
      NewTutionConcessionForm.setFieldValue('minimumNetAmount', 999999999999999);
      // setTotalConcessionAmount(total);
    }

  }
  function onInputSearchChange(inputString: any) {
    setFullConcessionErr(false)
    const { academicYearId, curriculumId, classId } = NewTutionConcessionForm.values;
    if (inputString && academicYearId) {
      // const params = { searchString: inputString };
      // dispatch(getEmployeeByFilterAct(generateActionPayload("get_employee_by_name", params, { branchId })));
      // dispatch(getStudentByFilterAct(generateActionPayload("get_students_by_name", undefined, {
      //   branchId, academicYearId: academicYearId, curriculumId: curriculumId,
      //   classId: classId,
      //   studentName: inputString
      // })));
      const params = {
        branchId, academicYearId,
        // classId: classId,
        // curriculumId: curriculumId,
        searchString: inputString,
      };
      dispatch(getStudentsListAct(generateActionPayload("get_students", undefined, params)));
    }
  }
  function onEmployeeInputSearchChange(inputString: any) {
    const { academicYearId, curriculumId, classId } = NewTutionConcessionForm.values;
    NewTutionConcessionForm.setFieldValue('employeeId', inputString);
    if (inputString) {
      // const params = { searchString: inputString };
      // dispatch(getEmployeeByFilterAct(generateActionPayload("get_employee_by_name", params, { branchId })));
      dispatch(getEmployeeByFilterAct(generateActionPayload("get_employee_by_name",
        { searchString: inputString }, undefined)));
    }
  }

  function onSiblingInputSearchChange(inputString: any) {
    if (inputString) {
      const params = { searchString: inputString, instituteId };
      dispatch(getSiblingForRegistrationAct(generateActionPayload("get_siblings_registration", undefined,
        params)));
    }
  }
  const selectedStudent = (student: any) => {
    NewTutionConcessionForm.setFieldValue('studentId', student?.studentId);
    setSearchStudentState(student);

    const newpayload = { branchId: branchId, curriculumId: student?.curriculumId, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100 };
    dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, newpayload)));
    let payload = {
      studentId: student?.studentId,
      instituteId,
      branchId: branchId,
      academicYearId: NewTutionConcessionForm.values.academicYearId,
      studentInfo: "studentInfo",
      allowStudentConcession: "",
      allowEmployeeConcession: "",
      allowRefund: "",
      feeType: ["ONETIME"],
      // instituteDeptId: [1, 4],
      instituteDeptNames: ["ACADEMICS", "TRANSPORT"],
      paymentStatus: ""
    }
    dispatch(getLedgerDetailsAct(generateActionPayload('ledger_details', undefined, payload)));
  }

  useEffect(() => {
    if (branchClassResp && searchStudentState) {
      NewTutionConcessionForm.setValues((prev: any) => ({ ...prev, curriculumId: searchStudentState?.curriculumId || prev?.curriculumId, classId: searchStudentState?.classId || prev?.classId }));
    }
  }, [branchClassResp])


  const selectedSibling = (student: any) => {
    NewTutionConcessionForm.setFieldValue('siblingId', student.studentId);
    setSiblingState({
      id: student.studentId,
      studentName: student.studentName,
      studentCode: student.studentCode
    });
  }
  const selectedEmployee = (employee: any) => {
    setEmployeeState(employee);
  }

  function updateSelectedAllHndlr(feeList: any) {
    if (Array.isArray(feeList) && feeList.length > 0) {
      const isAnyUnselected = feeList.some((item: any) => !item.isSelected);
      setAllFeeSelectedState(!isAnyUnselected);
    } else {
      setAllFeeSelectedState(false);
    }
  }

  function CancelHandler() {
    history.push('/tution-fee-concessions');
  }




  useEffect(() => {
    const { concessionId }: any = location.state || {};
    if (concessionId) {
      dispatch(getTutionFeeConcessionByIdAct(generateActionPayload('tution_fee_concession_by_id', { concessionId: concessionId })))
    }
    const payload = { instituteId: instituteId, pageNo: 0, pageSize: 100, sortBy: "academicYearName", orderBy: "desc" };
    dispatch(
      getInstAcademicYearAct(
        generateActionPayload("get_inst_academic_year", undefined, payload)
      )
    );
    const payload1 = { branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" };
    dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
    dispatch(resetLedgerDetailsAct(undefined));
    return () => {
      // setLedgerList([]);
      dispatch(resetBrchCurriculumAct(undefined));
      dispatch(resetBrchClassAct(undefined));
      setSearchStudentState(null);
      setNewStudentConcessionDataState((prev: any) => ({ ...prev, curriculumId: "", classId: "" }));
      dispatch(resetLedgerDetailsAct(undefined));
      // NewTutionConcessionForm.resetForm();
    }
  }, []);

  useEffect(() => {
    if (location.state?.fromComponent === "Fee Summary" && location.state.StudentDetails) {
      // dispatch(resetLedgerDetailsAct(undefined));
      let studentDetails = location.state.StudentDetails;
      setNewStudentConcessionDataState((prev: any) => ({ ...prev, studentId: studentDetails?.studentDetails?.id, curriculumId: studentDetails?.studentAcademicDetails?.curriculumId, classId: studentDetails?.studentAcademicDetails?.classId, academicYearId: studentDetails?.academicYearId }))
      const payload = { branchId: branchId, curriculumId: studentDetails?.studentAcademicDetails?.curriculumId, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100 };
      dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
      setSearchStudentState({ studentId: studentDetails?.studentDetails?.id, studentName: studentDetails?.studentDetails?.studentName, studentCode: studentDetails?.studentDetails?.studentCode, curriculumId: studentDetails?.curriculumId, classId: studentDetails?.classId });
      let payload1 = {
        studentId: studentDetails?.studentDetails?.id,
        instituteId,
        branchId: branchId,
        academicYearId: studentDetails?.academicYearId,
        studentInfo: "studentInfo",
        allowStudentConcession: "",
        allowEmployeeConcession: "",
        allowRefund: "",
        feeType: ["ONETIME"],
        // instituteDeptId: [1, 4],
        instituteDeptNames: ["ACADEMICS", "TRANSPORT"],
        paymentStatus: ""
      }
      dispatch(getLedgerDetailsAct(generateActionPayload('ledger_details', undefined, payload1)));

      NewTutionConcessionForm.setValues((prev: any) => ({
        ...prev,
        curriculumId: studentDetails?.studentAcademicDetails?.curriculumId,
        classId: studentDetails?.studentAcademicDetails?.classId,
      }))
    }
  }, [location.state])

  useEffect(() => {
    let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus === "CURRENT")?.academicYearId
    !location.state?.StudentDetails?.academicYearId && NewTutionConcessionForm.setValues((prev: any) => ({ ...prev, academicYearId: yearId }))
    // setTutionFeeConcessionFilterState((prev: any) => ({ ...prev, academicYearId: yearId }));
    // TutionFeeConcessionList({ academicYearId: yearId })
  }, [academicYearListResp]);
  useEffect(() => {
    if (ledgerDetails) {

      let updatedLedgers = (((tutionFeeConcessionById && location.state?.concessionId) ? tutionFeeConcessionById?.feeTuitionChildResponse : ledgerDetails.ledgers) || [])
      if (tutionFeeConcessionById) {

        updatedLedgers = updatedLedgers.map((ledger: any) => ({ ...ledger, id: ledger.ledgerId, isSelected: selectedLedgerIds.includes(ledger.ledgerId) ? true : false, mode: tutionFeeConcessionById?.concessionMode, feeDetails: ledger?.feeName, amountToPay: ledger?.feeAmount, remainingAmount: (tutionFeeConcessionById && location.state?.concessionId) ? +ledger?.concessionAllocatedAmount : ((+ledger?.feeAmount - +ledger?.tuitionFeeConcession) || 0) }))
      } else {
        updatedLedgers = updatedLedgers.map((ledger: any) => ({ ...ledger, isSelected: selectedLedgerIds.includes(ledger.id) ? true : false, remainingAmount: (+ledger?.amountToPay - (+ledger?.tuitionFeeConcession + +ledger?.employeeConcessionAmount)) }))
      }
      setLedgerList(updatedLedgers);
      setAvailableStudentState(updatedLedgers);
      updateSelectedAllHndlr(updatedLedgers);
    }
    else {
      setLedgerList([]);
    }
  }, [ledgerDetails, selectedLedgerIds])

  const tutionFeeRef = useRef({
    prevTutionFeeConcessionById: tutionFeeConcessionById
  })
  useEffect(() => {
    const { prevTutionFeeConcessionById } = tutionFeeRef.current;
    if (tutionFeeConcessionById && tutionFeeConcessionById !== prevTutionFeeConcessionById) {

      let ledgerIds = tutionFeeConcessionById.feeTuitionChildResponse.map((concession: any) => concession.ledgerId);
      setSelectedLedgerIds(ledgerIds);

      if (tutionFeeConcessionById.concessionType == "SIBLING") {
        setSiblingState({
          id: tutionFeeConcessionById.siblingId,
          studentName: tutionFeeConcessionById.siblingName,
          studentCode: tutionFeeConcessionById.siblingCode
        })
      }
      else if (tutionFeeConcessionById.concessionType === "EMPLOYEE") {
        setEmployeeState({
          id: tutionFeeConcessionById.employeeId,
          employeeName: tutionFeeConcessionById.employeeName,
          employeeCode: tutionFeeConcessionById.employeeCode
        })
      }
      // let newStudentState=ledgerDetails&&ledgerDetails.ledgers.map((student:any)=>({...student,isChecked:ledgerIds.includes(student.id)}))
      let data: any = {
        academicYearId: tutionFeeConcessionById?.academicYearId,
        curriculumId: tutionFeeConcessionById?.curriculumId,
        studentId: `${tutionFeeConcessionById.studentId}`,
        siblingId: `${tutionFeeConcessionById.siblingId}`,
        employeeId: `${tutionFeeConcessionById.employeeId}`,
        // studentName: "",
        concessionType: tutionFeeConcessionById.concessionType,
        concessionMode: tutionFeeConcessionById?.concessionMode,
        concessionValue: tutionFeeConcessionById?.concessionValue,
        totalConcessionAmount: tutionFeeConcessionById?.totalConcessionAmount,
        classId: tutionFeeConcessionById?.classId,
        // concessionDetails: {
        //   concession: "",
        //   price: "0.0",
        // },
        remarks: tutionFeeConcessionById?.remarks,
        document: tutionFeeConcessionById?.fileInfo?.map((i: any) => ({ ...i, name: i?.originalFileName }))
      }
      setDocument(tutionFeeConcessionById?.fileInfo?.map((i: any) => ({ ...i, name: i?.originalFileName })));
      // setNewStudentConcessionDataState(prev=>({...prev,studentId:`${tutionFeeConcessionById.studentId}`}));
      setSearchStudentState({
        studentId: tutionFeeConcessionById.studentId,
        studentName: tutionFeeConcessionById.studentName,
        studentCode: tutionFeeConcessionById.studentCode,
        curriculumId: tutionFeeConcessionById?.curriculumId,
        classId: tutionFeeConcessionById?.classId,
      })
      setNewStudentConcessionDataState(data);
      const payload1 = { branchId: branchId, curriculumId: tutionFeeConcessionById?.curriculumId, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100 };
      dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload1)));
      let payload = {
        studentId: tutionFeeConcessionById.studentId,
        instituteId,
        branchId: branchId,
        academicYearId: tutionFeeConcessionById.academicYearId,
        studentInfo: "studentInfo",
        allowStudentConcession: "",
        allowEmployeeConcession: "",
        allowRefund: "",
        feeType: ["ONETIME"],
        // instituteDeptId: [1, 4],
        instituteDeptNames: ["ACADEMICS", "TRANSPORT"],
        paymentStatus: ""
      }
      dispatch(getLedgerDetailsAct(generateActionPayload('ledger_details', undefined, payload)));


    }
    tutionFeeRef.current.prevTutionFeeConcessionById = tutionFeeConcessionById;
  }, [tutionFeeConcessionById])

  const tutionFeeConcessionRef = useRef({
    prevAddTutionFeeConcession: addTutionFeeConcession,
    prevEditTutionFeeConcession: editTutionFeeConcession
  })

  useEffect(() => {
    const { prevAddTutionFeeConcession, prevEditTutionFeeConcession } = tutionFeeConcessionRef.current;

    if (addTutionFeeConcession && prevAddTutionFeeConcession !== addTutionFeeConcession) {
      toast.success('Tution Fee Concession Added Successfully.');
      history.push('/tution-fee-concessions');
      dispatch(resetLedgerDetailsAct(undefined));
    }
    else if (editTutionFeeConcession && prevEditTutionFeeConcession !== editTutionFeeConcession) {
      toast.success('Tution Fee Concession Edited Successfully.');
      history.push('/tution-fee-concessions');
      dispatch(resetLedgerDetailsAct(undefined));
    }

    tutionFeeConcessionRef.current.prevAddTutionFeeConcession = addTutionFeeConcession;
    tutionFeeConcessionRef.current.prevEditTutionFeeConcession = editTutionFeeConcession;
  }, [addTutionFeeConcession, editTutionFeeConcession])

  const concessionAmountChangeHandler = (id: any, value: any) => {
    let totalConcession: any = +NewTutionConcessionForm.values.totalConcessionAmount;
    //  totalConcession = totalConcession - +oldValue + +value;
    NewTutionConcessionForm.setFieldValue('totalConcessionAmount', totalConcession);
    const abcd: any = ledgerList.map((ledger: any) => {
      if (+ledger.id === +id) {
        return {
          ...ledger, concessionAmount: value > (ledger?.remainingAmount) ? ledger?.concessionAmount : value
        }
      }
      else {
        return {
          ...ledger,
        }
      }
    })

    setLedgerList(abcd)
  }

  const [submitConfirmationModal, setSubmitConfirmationModal] =
    useState<any>({
      showModal: false,
    });

  const toggleSubmitConfirmationModal = (id?: any) => {
    setSubmitConfirmationModal((prevState: any) => ({
      ...prevState,
      showModal: !prevState.showModal,
    }));
  };

  const confirmSubmitHndler = () => {

    const values = NewTutionConcessionForm.values
    let selectedStudents: any = [];
    let payload = {};

    ledgerList.map((stu: any) => {

      if (stu?.isSelected) {
        selectedStudents.push({
          studentLedgerId: stu?.ledgerId || stu.id,
          concessionValueInPerc: values.concessionMode === "PERCENTAGE" ? values.concessionValue : percentageConverter(+stu.amountToPay - +stu?.tuitionFeeConcession, values.concessionMode, +stu.concessionAmount),
          concessionAmount: +stu.concessionAmount
        })
      }
    })
    if (location.state?.concessionId) {

      payload = {
        feeType: "ONETIME",
        concessionMode: values.concessionMode,
        concessionValue: values.concessionValue,
        concessionType: values.concessionType,
        siblingId: siblingState?.id || "",
        studentConcessionFeeDetailsDTO: selectedStudents,
        totalConcessionAmount: values.totalConcessionAmount,
        remarks: values.remarks
      }

      const formData = new FormData();
      const prevArr = tutionFeeConcessionById?.fileInfo
      let newArr;
      if (Array.isArray(prevArr) && prevArr?.length > 0) {
        newArr = prevArr.filter((obj: any) => !document.some((obj2: any) => obj2?.id === obj?.id))
      }
      if (Array.isArray(newArr) && newArr?.length > 0) {
        formData.append(`deletedFileIds`, newArr.map((i: any) => i?.id).join(","));
      }
      document?.map((item: any, index: any) => {
        if (!item?.id) {
          formData.append(`file`, item);
        }
      })

      formData.append('request', JSON.stringify(payload));
      dispatch(editTutionFeeConcessionAct(generateActionPayload('edit_tution_fee_concession', { concessionId: location.state?.concessionId }, formData)))
    }
    else {

      payload = {
        tuitionFeeConcessionDTO: {
          classId: values.classId,
          curriculumId: values.curriculumId,
          studentId: searchStudentState.studentId,
          siblingId: siblingState?.id || "",
          employeeId: employeeState?.id || "",
          concessionMode: values.concessionMode,
          concessionValue: values.concessionValue
        },
        tuitionFeeConcessionFeeDetailsDTOs: selectedStudents,
        concessionType: values.concessionType,
        remarks: values.remarks,
        totalConcessionAmount: values.totalConcessionAmount
      }

      if (selectedStudents.length > 0) {
        const formData = new FormData();
        document?.map((item: any, index: any) => {
          formData.append(`file`, item);
        })
        formData.append('request', JSON.stringify(payload))
        dispatch(addTutionFeeConcessionAct(generateActionPayload('add_tution_fee_concession', { branchId: branchId, academicYearId: values.academicYearId }, formData)))
      }


    }
  }

  const handleFileChange = (files: any) => {
    setDocument(files);
    NewTutionConcessionForm.setFieldValue('document', files);
  }

  const { data: academicYearList } = academicYearListResp || {};
  const { data: curriculumTypes } = brchCurriculumResp || {};
  const { content: classTypes } = branchClassResp || {};
  const { ledgers: LedgerList } = ledgerDetails || {};
  return (
    <>
      <div className="page-content tution_fee_concession_wrap">
        <div className="container-fluid">
          <BreadCrumb title="Tution Concessions" pageTitle="Fee" pageTitleUrl={location.state?.fromComponent === "Fee Summary" ? "/student-fee-ledger/fee-details" : "/tution-fee-concessions"} linkState={{ studentId: location.state?.StudentDetails?.studentDetails?.id, academicYearId: location.state?.StudentDetails?.academicYearId, curriculumId: location.state?.StudentDetails?.studentAcademicDetails?.curriculumId, classId: location.state?.StudentDetails?.studentAcademicDetails?.classId }} />
          {/* <BackButtonText title="<< Back to Student Concessions List" /> */}
          <div className="card">
            <div className="card-header fw-bold fs-18">{`${location.state?.concessionId ? 'Edit' : 'Create'} Conncession`}</div>
            <div className="card-body">
              <div className="inline-block w-100">
                {/* <form onSubmit={NewTutionConcessionForm.handleSubmit}> */}
                <div className="row pb-3" style={{ borderBottom: '1px dashed #C9CBCE' }}>
                  <div className="col-4">
                    {/* <div className="row"> */}
                    <SelectInput
                      name="academicYearId"
                      // labelText="Academic Year"
                      value={NewTutionConcessionForm.values.academicYearId}
                      onChange={filterHandler}
                      menuItems={academicYearList || []}
                      valueKey="academicYearId"
                      textKey="academicYearName"
                      defaultSelect="Academic Year"
                      formgroupClassName="mb-2"
                    // inputClassName="border-0"
                    />
                    <AutoSearchInputUpdated
                      formgroupClassName="search-box"
                      name="studentId"
                      placeHolder="Search..."
                      // onChange={(e: any) => setSearchInputState(e.target.value)}
                      onChange={(string: any) => { NewTutionConcessionForm.setFieldValue('studentId', ""); onInputSearchChange(string) }}
                      valueKey="studentId"
                      labelKey="studentCode"
                      subLabelKey="studentName"
                      onBlur={NewTutionConcessionForm.handleBlur}
                      labelHeader="Student Code"
                      subLabelHeader="Student Name"
                      options={studentsListResp?.data}
                      selected={searchStudentState}
                      selectedOptionCallbck={selectedStudent}
                      isDisabled={location.state?.concessionId || location.state?.fromComponent === "Fee Summary"}
                      invalid={
                        NewTutionConcessionForm.touched.studentId &&
                          NewTutionConcessionForm.errors.studentId
                          ? true
                          : false
                      }
                      error={
                        NewTutionConcessionForm.touched.studentId &&
                          NewTutionConcessionForm.errors.studentId
                          ? NewTutionConcessionForm.errors.studentId
                          : ""
                      }
                    ><i className="ri-search-line search-icon"></i></AutoSearchInputUpdated>
                    <SelectInput
                      name="curriculumId"
                      // labelText="Curriculum"
                      value={NewTutionConcessionForm.values.curriculumId}
                      onChange={filterHandler}
                      menuItems={curriculumTypes || []}
                      valueKey="branchCurriculumId"
                      textKey="curriculumName"
                      defaultSelect="Curriculum"
                      onBlur={NewTutionConcessionForm.handleBlur}
                      formgroupClassName="my-2"
                      // isDisabled={location.state?.concessionId || location.state?.fromComponent === "Fee Summary"}
                      isDisabled={true}
                      invalid={
                        NewTutionConcessionForm.touched.curriculumId &&
                          NewTutionConcessionForm.errors.curriculumId
                          ? true
                          : false
                      }
                      error={
                        NewTutionConcessionForm.touched.curriculumId &&
                          NewTutionConcessionForm.errors.curriculumId
                          ? NewTutionConcessionForm.errors.curriculumId
                          : ""
                      }
                    />
                    <SelectInput
                      name="classId"
                      // labelText="Class"
                      value={NewTutionConcessionForm.values.classId}
                      onChange={filterHandler}
                      menuItems={classTypes || []}
                      onBlur={NewTutionConcessionForm.handleBlur}
                      valueKey="id"
                      textKey="shortName"
                      defaultSelect="Class"
                      formgroupClassName="mb-2"
                      // isDisabled={location.state?.concessionId || location.state?.fromComponent === "Fee Summary"}
                      isDisabled={true}
                      invalid={
                        NewTutionConcessionForm.touched.classId &&
                          NewTutionConcessionForm.errors.classId
                          ? true
                          : false
                      }
                      error={
                        NewTutionConcessionForm.touched.classId &&
                          NewTutionConcessionForm.errors.classId
                          ? NewTutionConcessionForm.errors.classId
                          : ""
                      }
                    />

                    {/* <div onClick={toggleStudentConcessionModal}>
                      <p className="text-info pt-2 fs-16 text-decoration-underline cursor-pointer">
                        View Previous Concessions
                      </p>
                    </div> */}
                    {/* </div> */}
                  </div>
                  <div className="col">

                  </div>
                  <div className="col-4">

                    <SelectInput
                      name="concessionMode"
                      labelText="Concession"
                      value={NewTutionConcessionForm.values.concessionMode}
                      onChange={filterHandler}
                      menuItems={concessionMode || []}
                      valueKey="concessionModeType"
                      textKey="concessionMode"
                      onBlur={NewTutionConcessionForm.handleBlur}
                      formgroupClassName="mb-1"
                      invalid={
                        NewTutionConcessionForm.touched.concessionMode &&
                          NewTutionConcessionForm.errors.concessionMode
                          ? true
                          : false
                      }
                      error={
                        NewTutionConcessionForm.touched.concessionMode &&
                          NewTutionConcessionForm.errors.concessionMode
                          ? NewTutionConcessionForm.errors.concessionMode
                          : ""
                      }
                    // defaultSelect="Percentage"
                    />


                    <TextInputGroup
                      name="concessionValue"
                      formgroupClassName="col-12 m-0"
                      labelClass="text-muted"
                      // inputgroupClassName="input-group h-auto"
                      // inputClassName="form-control-sm"
                      inputGroupStart={true}
                      allowedInputRegex="^[0-9]*$"
                      value={NewTutionConcessionForm.values.concessionValue}
                      onChange={filterHandler}
                      onBlur={NewTutionConcessionForm.handleBlur}
                      invalid={
                        NewTutionConcessionForm.touched.concessionValue &&
                          NewTutionConcessionForm.errors.concessionValue
                          ? true
                          : false
                      }
                      error={
                        NewTutionConcessionForm.touched.concessionValue &&
                          NewTutionConcessionForm.errors.concessionValue
                          ? NewTutionConcessionForm.errors.concessionValue
                          : ""
                      }
                    // isDisabled={true}
                    >
                      <i className="">{NewTutionConcessionForm.values.concessionMode === "AMOUNT" ? <RupeeSvg width="11px" height="11px" fill={"#878a99"} className="" /> : "%"}</i>
                    </TextInputGroup>
                  </div>
                </div>
                <div className="row" style={{ borderBottom: '1px dashed #C9CBCE' }}>
                  <TableContainer
                    columns={roleColumns || []}
                    data={ledgerList || []}
                    rowDataInfo={NewTutionConcessionForm.values.concessionValue}
                    divClass="table-responsive my-3"
                    theadClass="table-light text-muted align-middle"
                    onChangeInputHndlr={concessionAmountChangeHandler}
                  // showCheckbox={true}
                  />
                  <span className="text-danger ps-4">{NewTutionConcessionForm.errors.isNoFeeSelected
                    ? NewTutionConcessionForm.errors.isNoFeeSelected
                    : ""}</span>
                  {fullConcessionErr && <span className="text-danger ps-4">{"A full Concession already given to this student"}</span>}

                </div>
                <div className="row p-3">
                  <div className="col-5 ms-auto">
                    <div className="row d-flex justify-content-between align-items-center mb-3">
                      <label className="col-4 m-0">Concession Type</label>
                      <SelectInput
                        name="concessionType"
                        // labelText="Concession Type"
                        value={NewTutionConcessionForm.values.concessionType}
                        onChange={NewTutionConcessionForm.handleChange}
                        menuItems={concessionType || []}
                        onBlur={NewTutionConcessionForm.handleBlur}
                        valueKey="concessionType"
                        textKey="concessionType"
                        isDisabled={location.state?.concessionId && true}
                        formgroupClassName="w-50 col-3"
                        invalid={
                          NewTutionConcessionForm.touched.concessionType &&
                            NewTutionConcessionForm.errors.concessionType
                            ? true
                            : false
                        }
                        error={
                          NewTutionConcessionForm.touched.concessionType &&
                            NewTutionConcessionForm.errors.concessionType
                            ? NewTutionConcessionForm.errors.concessionType
                            : ""
                        }
                      />
                    </div>
                    {NewTutionConcessionForm.values.concessionType == "SIBLING" && <div className="row d-flex justify-content-between align-items-center mb-3">
                      <label className="col-4 m-0">Sibling</label>
                      <AutoSearchInputUpdated
                        formgroupClassName="search-box w-50 col-3"
                        name="siblingId"
                        placeHolder="Search..."
                        // onChange={(e: any) => setSearchInputState(e.target.value)}
                        onChange={(event: any) => { onSiblingInputSearchChange(event) }}
                        onBlur={NewTutionConcessionForm.handleBlur}
                        valueKey="studentId"
                        labelKey="studentCode"
                        subLabelKey="studentName"
                        labelHeader="Student Code"
                        subLabelHeader="Student Name"
                        options={siblingsForRegistrationResp?.filter((item: any) => +item?.studentId !== searchStudentState?.studentId)}
                        selected={siblingState}
                        selectedOptionCallbck={selectedSibling}
                        // isDisabled={location.state?.concessionId}
                        invalid={
                          NewTutionConcessionForm.touched.siblingId &&
                            NewTutionConcessionForm.errors.siblingId
                            ? true
                            : false
                        }
                        error={
                          NewTutionConcessionForm.touched.siblingId &&
                            NewTutionConcessionForm.errors.siblingId
                            ? NewTutionConcessionForm.errors.siblingId
                            : ""
                        }
                      // isDisabled={location.state?.id}
                      ><i className="ri-search-line search-icon"></i></AutoSearchInputUpdated>
                    </div>}
                    {NewTutionConcessionForm.values.concessionType == "EMPLOYEE" && <div className="row d-flex justify-content-between align-items-center mb-3">
                      <label className="col-4 m-0">Employee</label>
                      <AutoSearchInput
                        formgroupClassName="search-box w-50 col-3"
                        name="employeeString"
                        placeHolder="Search..."
                        // onChange={(e: any) => setSearchInputState(e.target.value)}
                        onChange={onEmployeeInputSearchChange}
                        valueKey="id"
                        labelKey="employeeName"
                        subLabelKey="employeeCode"
                        labelHeader="Employee Code"
                        subLabelHeader="Employee Name"
                        options={(Array.isArray(getEmployeesByFilterResp) && getEmployeesByFilterResp) || []}
                        selected={employeeState}
                        selectedOptionCallbck={selectedEmployee}
                        isDisabled={location.state?.concessionId}
                        invalid={
                          NewTutionConcessionForm.touched.employeeId &&
                            NewTutionConcessionForm.errors.employeeId
                            ? true
                            : false
                        }
                        error={
                          NewTutionConcessionForm.touched.employeeId &&
                            NewTutionConcessionForm.errors.employeeId
                            ? NewTutionConcessionForm.errors.employeeId
                            : ""
                        }
                      // isDisabled={location.state?.id}
                      ><i className="ri-search-line search-icon"></i></AutoSearchInput>
                    </div>}
                    <div className="row d-flex justify-content-between align-items-center mb-3">
                      <label className="col-5 m-0">Total Concession Amount</label>

                      <TextInputGroup
                        name="totalConcessionAmount"
                        formgroupClassName="col-6 m-0"
                        inputgroupClassName="input-group-sm"
                        inputClassName="form-control-sm"
                        labelClass="text-muted"
                        inputGroupStart={true}
                        value={getAmountValueWithDecimal(NewTutionConcessionForm.values.totalConcessionAmount)}
                        onChange={NewTutionConcessionForm.handleChange}
                        onBlur={NewTutionConcessionForm.handleBlur}
                        isDisabled={true}
                      >
                        <RupeeSvg width="11px" height="11px" fill={"#878a99"} />
                      </TextInputGroup>

                    </div>
                    <div className="row d-flex justify-content-between mb-3">
                      <label className="col-5 m-0">Remarks</label>
                      <TextArea
                        name="remarks"
                        value={NewTutionConcessionForm.values.remarks}
                        onChange={NewTutionConcessionForm.handleChange}
                        onBlur={NewTutionConcessionForm.handleBlur}
                        formgroupClassName="col-6"
                        invalid={
                          NewTutionConcessionForm.touched.remarks &&
                            NewTutionConcessionForm.errors.remarks
                            ? true
                            : false
                        }
                        error={
                          NewTutionConcessionForm.touched.remarks &&
                            NewTutionConcessionForm.errors.remarks
                            ? NewTutionConcessionForm.errors.remarks
                            : ""
                        }
                      />
                    </div>
                    {/* {!location.state?.concessionId && <div className="row d-flex justify-content-between">
                      <label className="col-5 m-0">Document</label>

                      <div className="col-6">
                        <label
                          className="choose_file_botton border cursor-pointer mb-2 hover_effect"
                          htmlFor="document"
                          style={{ color: "black", backgroundColor: "white" }}
                        >
                          Choose File
                        </label>

                        <input
                          type="file"
                          name="document"
                          id="document"
                          onChange={(event: any) => {
                            setDocument(event.target.files[0]);
                            NewTutionConcessionForm.values.document = event.target.files[0].name
                          }}
                          hidden
                        />
                        <h6 className="fw-normal file_name_wrap ps-2" id="document">
                          {NewTutionConcessionForm.values.document
                            ? NewTutionConcessionForm.values.document
                            : "No file chosen"}
                        </h6>
                      </div>
                    </div>}
                    {!location.state?.concessionId && <div className="row d-flex align-items-center justify-content-between">
                      <div className="col-5 m-0"></div>
                      <div className="col-6">{NewTutionConcessionForm.touched.document && NewTutionConcessionForm.errors.document ? <FormFeedback className="d-block" type="invalid">
                        {NewTutionConcessionForm.errors.document}
                      </FormFeedback> : ""}</div>
                    </div>} */}
                    {/* {!location.state?.concessionId  && */}
                    <div className="row d-flex justify-content-between">
                      <label className="col-5 m-0">Document</label>
                      <MultipleFileUpload
                        name="document"
                        onChange={handleFileChange}
                        prevFiles={document}
                        containerClass="col-6"
                        maxSizeInMb={2}
                        helperText="Note : Max File Size is 2MB"
                        error={
                          NewTutionConcessionForm.touched.document &&
                            NewTutionConcessionForm.errors.document
                            ? NewTutionConcessionForm.errors.document
                            : ""
                        }
                      />
                    </div>
                    {/* } */}
                  </div>
                </div>
                <div className="row p-3 pt-5">
                  <div className="hstack gap-2 justify-content-end">
                    <button type="button" className="btn btn-light" onClick={CancelHandler}>
                      Cancel
                    </button>
                    <button type="submit" onClick={(e: any) => NewTutionConcessionForm.handleSubmit(e)} className="btn btn-success">
                      {location.state?.concessionId ? "Update" : "Submit"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ModalContainerUpdated
        id="tc-requests-approval-modal"
        isOpen={studentConcessionModal.showModal}
        toggle={toggleStudentConcessionModal}
        modalSize="xl"
        headerClassName="p-3 bg-white"
      >
        <ViewConcessions
          isOpen={studentConcessionModal.showModal}
          toggle={toggleStudentConcessionModal}
          modalTitle=""
          instituteId={"1"}
          instituteName={"Hostel Exit Request"}
          branchId={studentConcessionModal.branchId}
          editBranchDetails={""}
        />
      </ModalContainerUpdated>
      <ConfirmationModal
        id="application-sale-export-modal"
        isOpen={submitConfirmationModal.showModal}
        confirmMessage="You want to create this concession ?"
        cancelHndlr={toggleSubmitConfirmationModal}
        confirmHndlr={confirmSubmitHndler}
        isDisble={showApiLoader}
        showImgIcon={true}
        iconType="approve"
        btnClassName='btn w-sm btn-success'
      />
      <ModalContainerUpdated
        id="tution-concession-check-modal"
        isOpen={checkConcessionModal.showModal}
        toggle={() => toggleCheckConcessionModal()}
        modalTitle=""
        headerClassName="bg-white"
        modalSize="md"
      >
        <CheckConcessionModal
          toggle={() => toggleCheckConcessionModal()}
        />
      </ModalContainerUpdated>
    </>
  );
};

export default StudentConcessionPage;
