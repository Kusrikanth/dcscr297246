import { useFormik } from "formik";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  SelectInput,
  TextArea,
  TextIconInput,
  ModalContainerUpdated,
  ConfirmationModal,
  AutoSearchInputUpdated,
  MultipleFileUpload,
  TextInputGroup,
} from "../../../Components/Common";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import {
  checkDisablePreviousBtn,
  concessionMode,
  concessionType,
  generateColumnsForConcession,
} from "./helper";

import TableContainer from "../../../Components/Common/TableContainer";
import { useAppSelector } from "../../../hooks/storehook";
import { shallowEqual, useDispatch } from "react-redux";
import { getInstAcademicYearAct } from "../../../store/mastersettings/instacademics/instacademicactions";
import { generateActionPayload } from "../../../utility/reduxutility";
import { getBranchClassAct, getBranchCurriculumAct, resetBrchClassAct, resetBrchCurriculumAct, setBrchClassAct } from "../../../store/branchsettings/branchacademics/branchacademicsactions";
import { getEmployeeByFilterAct } from "../../../store/directory/employeemanagement/employeemanagementactions";
import { getStudentsListAct } from "../../../store/directory/studentmanagement/studentmanagementactions";
import { getLedgerDetailsAct, resetLedgerDetailsAct } from "../../../store/fee/feecollections/feecollectionactions";
import { getAmountValueWithDecimal, percentageConverter, valueConverter } from "../../../utility/commonutility";
import { getStudentConcessionById } from "../../../store/fee/feeconcessions/feeconcessionactions";
import { useHistory, useLocation } from "react-router-dom";
import { getFeeTypesAct } from "../../../store/modulesettings/masterfeesettings/masterfeesettingsactions";
import * as Yup from 'yup';
import { toast } from "react-toastify";
import { FormFeedback } from "reactstrap";
import CheckConcessionModal from "./CheckConcessionModal";
import { getSiblingForRegistrationAct } from "../../../store/FrontDesk/AdmissionRegistration/admissionregistrationaction";
import { createTransportConcessionAct, editTransportConcessionAct, getTransportConcessionByIdAct } from "../../../store/transportation/TransportationConcession/transportationconcessionaction";
import { useModal } from "../../../hooks/modalhook";
import { setTransportConcessionByIdAct } from "../../../store/transportation/TransportationConcession/transportationconcessionslice";
import Button from "../../../Components/Common/Button";
// import StudentConcessionModal from "./StudentConcessionModal";

const initialValues = {
  feeTypeId: "",
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
  document: "",
  isNoFeeSelected: "",
  concessionDetails: {
    concession: "",
    price: "0.0",
  },
  remarks: "",
};

const validationSchema = Yup.object().shape({
  concessionMode: Yup.string().required("Select Concession Mode").nullable(),
  concessionValue: Yup.number().min(0, 'Concession should be more than 0').required("Enter Concession Value.").when('concessionMode', {
    is: (item: any) => item === "PERCENTAGE",
    then: Yup.number().max(100, 'Concession should be less than 100').min(0, 'Concession should be more than 0').nullable(),
    otherwise: Yup.number().nullable()
  }),
  studentId: Yup.string().required("Student is required").nullable(),
  siblingId: Yup.string().nullable().when('concessionType', {
    is: (item: any) => item === "SIBLING",
    then: Yup.string().required('Sibling id is required.')
  }),
  employeeId: Yup.string().nullable().when('concessionType', {
    is: (item: any) => item === "EMPLOYEE",
    then: Yup.string().required('Employee id is required.').nullable()
  }),
  concessionType: Yup.string().required("Concession Type is required.").nullable(),
  remarks: Yup.string().required("Remarks are required.").nullable(),
  document: Yup.mixed().required("Document is required").nullable(),
})

const NewTransportConcession = () => {

  const dispatch = useDispatch();
  const location: any = useLocation();
  const history = useHistory();
  const [document, setDocument] = useState<any>({});
  const [ledgerList, setLedgerList] = useState([]);
  const [allFeeSelectedState, setAllFeeSelectedState] = useState(false);
  const [searchStudentState, setSearchStudentState] = useState<any>(null);
  const [siblingState, setSiblingState] = useState<any>(null);
  const [employeeState, setEmployeeState] = useState<any>(null);
  const [checkTotalConcession, setCheckTotalConcession] = useState(false);
  const [selectedFees, setSelectedFees] = useState<any>([]);

  const { modalState:submitConfirmModalState,closeModal:closeSubmitConfirmModal,openModal:openeSubmitConfirmModal } = useModal()
  const { modalState:checkConcessionModalState,closeModal:closeCheckConcessionModal,openModal:openeCheckConcessionModal } = useModal()
  const { modalState:stuConcessionModalState,closeModal:closeStuConcessionModal,openModal:openStuConcessionModal } = useModal()

  const studentConcessionForm = useFormik({
    initialValues: initialValues,
    validationSchema,
    onSubmit: (values) => {
      let selectedStudents: any = [];
      let payload = {};
      const getPayload = (stu: any) => {
        return {
          studentLedgerId: stu.id,
          concessionValueInPerc: getAmountValueWithDecimal(percentageConverter(stu.amountToPay, values?.concessionMode, values?.concessionMode === "AMOUNT" ? (stu?.concessionAmount || 0) : values?.concessionValue)),
          concessionAmount: Math.ceil(valueConverter((+stu.remainingAmount), values?.concessionMode, values?.concessionMode === "AMOUNT" ? (+stu?.concessionAmount || 0) : +values?.concessionValue)) || 0,
        }
      }

      if (location.state?.id) {
        payload = {
          feeType: "TERM",
          concessionMode: values.concessionMode,
          concessionValue: values.concessionValue,
          studentConcessionFeeDetailsDTO: ledgerList.map((item: any) => ({ ...getPayload(item), isDeleted: !item?.isSelected ? true : false, })),
          siblingId: siblingState?.studentId || "",
          employeeId: employeeState?.id || "",
          totalConcessionAmount: values.totalConcessionAmount,
          remarks: values.remarks,
          concessionType: values.concessionType
        }

        if (ledgerList.length > 0 && ledgerList.some((item: any) => item?.isSelected)) {

          if (values.concessionMode === "AMOUNT" && (+values.totalConcessionAmount !== +values.concessionValue)) {
            openeCheckConcessionModal()
          } else {
            openeSubmitConfirmModal(payload)
          }
        }
        else {
          studentConcessionForm.setFieldError('isNoFeeSelected', "*Select At least One Fee")
        }
      }
      else {
        payload = {
          tuitionFeeConcessionDTO: {
            classId: values.classId,
            curriculumId: values.curriculumId,
            studentId: searchStudentState.studentId,
            siblingId: siblingState?.studentId || "",
            employeeId: employeeState?.id || "",
            // feeTypeId: values.feeTypeId,
            concessionMode: values.concessionMode,
            concessionValue: values.concessionValue
          },
          tuitionFeeConcessionFeeDetailsDTOs: ledgerList.filter((i: any) => i?.isSelected).map(getPayload),
          concessionType: values.concessionType,
          remarks: values.remarks,
          totalConcessionAmount: values.totalConcessionAmount
        }

        if (ledgerList.length > 0 && ledgerList.some((item: any) => item?.isSelected)) {
          if (values.concessionMode === "AMOUNT" && (+values.totalConcessionAmount !== +values.concessionValue)) {
            openeCheckConcessionModal()
          } else {
            openeSubmitConfirmModal(payload)
          }
        }
        else {
          studentConcessionForm.setFieldError('isNoFeeSelected', "*Select At least One Fee")
        }

      }
    },
  });
  const {
    academicYearListResp,
    brchCurriculumResp,
    branchClassResp,
    feeTypesResp,
    ledgerDetails,
    getTransportConcessionByIdResp,
    editTransportConcessionResp,
    studentsListResp,
    getEmployeesByFilterResp,
    feeConcessionErrorState,
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    showApiLoader,
    siblingsForRegistrationResp,
    transportationConcessionErrorAct,
    createTransportConcessionResp,
  } = useAppSelector(
    ({ globalData, instAcademics, branchAcademics, appData, directoryStudent, directoryEmployee, feeCollections, feeConcession, masterFeeSettings, admissionRegistration, transportConcession }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      branchClassResp: branchAcademics.branchClassResp,
      ledgerDetails: feeCollections.ledgerDetails,
      getTransportConcessionByIdResp: transportConcession.getTransportConcessionByIdResp,
      editTransportConcessionResp: transportConcession.editTransportConcessionResp,
      studentsListResp: directoryStudent.studentsListResp,
      getEmployeesByFilterResp: directoryEmployee.getEmployeesByFilterResp,
      feeTypesResp: masterFeeSettings.feeTypesResp,
      feeConcessionErrorState: feeConcession.feeConcessionErrorState,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      siblingsForRegistrationResp: admissionRegistration.siblingsForRegistrationResp,
      showApiLoader: globalData.showApiLoader,
      createTransportConcessionResp: transportConcession.createTransportConcessionResp,
      transportationConcessionErrorAct: transportConcession.transportationConcessionErrorAct,
    }),
    shallowEqual
  );

  const getClassApiCall = (otherProps?: any) => {
    const payload = { branchId: branchId, academicYearId: studentConcessionForm.values.academicYearId, curriculumId: studentConcessionForm.values.curriculumId, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100, ...otherProps };
    dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
  }

  const getCurriculumApiCall = (otherProps?: any) => {
    const payload1 = { academicYearId: studentConcessionForm.values.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", ...otherProps };
    dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
  }

  const fetchLedgerDetails = (studentId: any) => {

    const payload = {
      studentId: studentId,
      branchId: branchId,
      academicYearId: studentConcessionForm.values.academicYearId,
      studentInfo: "studentInfo",
      allowStudentConcession: "YES",
      allowEmployeeConcession: "",
      allowRefund: "",
      feeType: [],
      instituteDeptId: [],
      instituteDeptNames: ["TRANSPORT"],
      paymentStatus: ""
    }
    dispatch(getLedgerDetailsAct(generateActionPayload('ledger_details', undefined, payload)));

  }

  const selectAllFeeHndlr = useCallback((event: any) => {
    const { checked } = event.target;
    let globalConcession: number = 0
    let value: number = 0;

    setAllFeeSelectedState(checked);
    const updateSearchStudentListState: any = [...ledgerList];

    updateSearchStudentListState.forEach((item: any) => {
      let { concessionMode, concessionValue } = studentConcessionForm.values;
      if ((concessionMode === "AMOUNT") || (concessionMode === "PERCENTAGE" && +concessionValue <= 100)) {
        // concession amonut set to 0 once unchecked
        if (!item?.isSelected) { item.concessionAmount = 0 }
        item.isSelected = checked;

        if (checked) {
          value = value + (+item?.concessionAmount || 0)
        }
      }
    });

    let totalValue = +studentConcessionForm.values.concessionValue - +value;

    const newList = updateSearchStudentListState?.map((item: any) => {

      let updatedItem = { ...item };

      // Apply the logic for selected items without concessionAmount
      if (item.isSelected && !item?.concessionAmount) {
        if (+item?.remainingAmount > totalValue) {
          const newValue: any = totalValue;
          totalValue = 0;
          updatedItem = { ...item, concessionAmount: newValue };
        } else {
          totalValue = totalValue - +item?.remainingAmount;
          updatedItem = { ...item, concessionAmount: +item?.remainingAmount };
        }
      }

      // Update the globalConcession based on the same condition
      if (item.isSelected) {
        if (studentConcessionForm.values.concessionMode === "AMOUNT") {
          globalConcession += Math.ceil(+valueConverter(
            item?.remainingAmount,
            studentConcessionForm.values.concessionMode,
            updatedItem?.concessionAmount || 0
          ));
        } else {
          globalConcession += Math.ceil(+valueConverter(
            item?.remainingAmount,
            studentConcessionForm.values.concessionMode,
            studentConcessionForm.values.concessionValue || 0
          ));
        }
      }

      return updatedItem;
    });

    studentConcessionForm.setFieldValue('totalConcessionAmount', +globalConcession);
    setLedgerList(newList);
    setCheckTotalConcession(false)
  }, [ledgerList]);

  const studentCheckHndlr = useCallback((event: any) => {
    const { checked } = event.currentTarget,
      studentId = event.currentTarget.getAttribute("data-id"),
      studentIndexInSearchedStudent = ledgerList.findIndex((item: any) => item.id === Number(studentId)),
      student: any = ledgerList.find((item: any) => item.id === Number(studentId))
    let updatedLegder: any[] = ledgerList;

    if (student?.isSelected) {
      let totalConcession: number = +studentConcessionForm.values.totalConcessionAmount;
      if (studentConcessionForm.values.concessionMode === "PERCENTAGE") {
        totalConcession -= Math.ceil(+valueConverter(student?.remainingAmount, studentConcessionForm.values.concessionMode, studentConcessionForm.values.concessionValue))
      } else {
        totalConcession -= Math.ceil(student?.concessionAmount || 0)
      }
      studentConcessionForm.setFieldValue('totalConcessionAmount', totalConcession);
    }
    else {
      if (!(studentConcessionForm.values.concessionMode === "PERCENTAGE")) {
        const concessionValue = +studentConcessionForm.values.concessionValue - +studentConcessionForm.values.totalConcessionAmount
        updatedLegder = updatedLegder?.map((i: any) => {
          if (+i?.id === +studentId) {

            if (+concessionValue <= (+i?.remainingAmount)) {
              return {
                ...i,
                concessionAmount: +concessionValue
              }
            } else if (+concessionValue > (+i?.remainingAmount)) {
              return {
                ...i,
                concessionAmount: (+i?.remainingAmount)
              }
            }
          }
          return { ...i, concessionAmount: i?.isSelected ? i?.concessionAmount : 0 }
        })
      }
    }
    if (studentIndexInSearchedStudent > -1) {
      const updatedStudentDetails: any = updatedLegder[studentIndexInSearchedStudent],
        updatedSearchStudentState: any = [...updatedLegder];
      updatedSearchStudentState.splice(studentIndexInSearchedStudent, 1, { ...updatedStudentDetails, isSelected: checked });

      let totalValue: number = 0;
      updatedSearchStudentState.map((ledger: any) => {
        if (ledger?.isSelected) {
          if (studentConcessionForm.values.concessionMode === "PERCENTAGE") {
            totalValue = +totalValue + Math.ceil(+valueConverter((+ledger?.remainingAmount), studentConcessionForm.values.concessionMode, +studentConcessionForm.values.concessionValue))
          } else {
            totalValue += Math.ceil(+ledger.concessionAmount || 0)
          }
        }
      })

      studentConcessionForm.setFieldValue('totalConcessionAmount', +totalValue);
      setCheckTotalConcession(false)
      setLedgerList(updatedSearchStudentState);
      updateSelectedAllHndlr(updatedSearchStudentState);
    }
  }, [ledgerList, studentConcessionForm.values]);

  const roleColumns = useMemo(() => generateColumnsForConcession(studentConcessionForm.values.concessionMode, studentConcessionForm.values.concessionValue, allFeeSelectedState,selectAllFeeHndlr, studentCheckHndlr), [studentConcessionForm, ledgerList]);

  useEffect(() => {
    const payload = { instituteId: instituteId, pageNo: 0, pageSize: 100, sortBy: "academicYearName", orderBy: "desc" };
    dispatch(
      getInstAcademicYearAct(
        generateActionPayload("get_inst_academic_year", undefined, payload)
      )
    );

    const params = { instituteId: instituteId };
    dispatch(getFeeTypesAct(generateActionPayload('get_fee_types', undefined, params)))
    return () => {
      dispatch(resetBrchClassAct(undefined));
      dispatch(setTransportConcessionByIdAct(undefined));
    }
  }, []);

  useEffect(() => {
    let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus === "CURRENT")?.academicYearId
    !location.state?.StudentDetails?.academicYearId && studentConcessionForm.setFieldValue("academicYearId", yearId)
  }, [academicYearListResp]);

  const filterHandler = (event: any) => {
    const { name, value } = event.target;
    if (name === "concessionValue") {
      if (studentConcessionForm.values.concessionMode === "PERCENTAGE") {
        if (+value <= 100) {
          studentConcessionForm.handleChange(event);
        }
      } else {
        studentConcessionForm.handleChange(event);
      }
    } else {
      studentConcessionForm.handleChange(event);
    }
    setCheckTotalConcession(false)
    if (name === 'curriculumId') {
      getClassApiCall({ curriculumId: value })

      setSearchStudentState({});
      dispatch(setBrchClassAct(undefined));
      setLedgerList([]);
    }
    else if (name === 'academicYearId') {
      studentConcessionForm.setValues((prev: any) => ({ ...initialValues, feeTypeId: prev?.feeTypeId, [name]: value }));
      setSearchStudentState({});
      dispatch(setBrchClassAct(undefined));
      setLedgerList([]);
    }
    else if (name === "concessionMode") {
      let newled: any = ledgerList.map((ledger: any) => ({ ...ledger, isSelected: false }));
      setLedgerList(newled);
      updateSelectedAllHndlr(newled)
      studentConcessionForm.setValues((prev: any) => ({ ...prev, [name]: value, concessionValue: "", totalConcessionAmount: "" }));
    }
    else if (name === "concessionValue") {

      let totalValue = event.target.value;
      let newled: any;
      if (studentConcessionForm.values.concessionMode === "AMOUNT") {
        newled = ledgerList?.map((ledger: any) => {
          if (ledger?.isSelected) {
            if (+ledger?.remainingAmount <= totalValue) {
              totalValue = totalValue - +ledger?.remainingAmount
              return { ...ledger, concessionAmount: +ledger?.remainingAmount }
            } else {
              let newValue: any = totalValue
              totalValue = 0
              return { ...ledger, concessionAmount: newValue || 0 }
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
          totalConcession += Math.ceil(+ledger.concessionAmount || 0)
        }
      })

      studentConcessionForm.setFieldValue('totalConcessionAmount', +totalConcession);
      setLedgerList(newled);
      updateSelectedAllHndlr(newled)
    }
    else if (name === 'feeTypeId') {
      fetchLedgerDetails(searchStudentState?.studentId);
    } else if (name === 'classId') {
      setLedgerList([]);
      studentConcessionForm.setValues((prevValues: any) => ({
        ...prevValues,
        feeTypeId: '', studentId: '', concessionMode: '',
        concessionType: '',
        concessionValue: '', [name]: value
      }));
      setSearchStudentState({});
    }
  }
  function onInputSearchChange(inputString: any) {
    const { academicYearId } = studentConcessionForm.values;
    if (inputString && academicYearId) {
      const params = {
        branchId, academicYearId,
        searchString: inputString,
      };
      dispatch(getStudentsListAct(generateActionPayload("get_students", undefined, params)));
    }
  }
  function onSiblingInputSearchChange(inputString: any) {
    if (inputString) {
      const params = { searchString: inputString, instituteId };
      dispatch(getSiblingForRegistrationAct(generateActionPayload("get_siblings_registration", undefined,
        params)));
    }
  }

  function onEmployeeInputSearchChange(inputString: any) {
    if (inputString) {
      dispatch(getEmployeeByFilterAct(generateActionPayload("get_employee_by_name",
        { searchString: inputString }, undefined)));
    }
  }
  const selectedStudent = (student: any) => {
    setSearchStudentState(student);
    getCurriculumApiCall({ academicYearId: studentConcessionForm.values.academicYearId });
    getClassApiCall({ academicYearId: studentConcessionForm.values.academicYearId, curriculumId: student?.curriculumId });

    setLedgerList([]);
    if (!student) {
      studentConcessionForm.setValues((prevValue: any) => ({
        ...prevValue, studentId: '',
        feeTypeId: prevValue?.feeTypeId, concessionMode: '', concessionValue: ''
      }));
    } else {
      studentConcessionForm.setFieldValue('studentId', student?.studentId);
    }
    fetchLedgerDetails(student?.studentId)
  }

  useEffect(() => {
    if (branchClassResp && searchStudentState && !location?.state?.id) {

      studentConcessionForm.setValues((prev: any) => ({
        ...prev,
        curriculumId: searchStudentState?.curriculumId,
        classId: searchStudentState?.classId
      }))
    }
  }, [branchClassResp])

  const selectedSibling = (student: any) => {
    studentConcessionForm.setFieldValue('siblingId', student.studentId)
    setSiblingState(student);
  }
  const selectedEmployee = (employee: any) => {
    studentConcessionForm.setFieldValue('employeeId', employee.id)
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
    history.push("/transport-concession");
  }

  useEffect(() => {
    if (ledgerDetails) {
      let updatedLedgers = (((getTransportConcessionByIdResp && location.state?.id) ? getTransportConcessionByIdResp?.feeTransportChildResponseVO : ledgerDetails.ledgers) || []).map((ledger: any) => {
        const transportConcession: number = ledger?.transportConcession || ledger?.concessionAmount || 0
        const totalConcession: number = ledger?.totalConcession || ledger?.concessionAmount || 0
        if (selectedFees.includes(+ledger.id || +ledger?.ledgerId)) {
          return {
            // in edit case getting ledgerId so converting those in id
            ...ledger, id: ledger.id || ledger?.ledgerId, isSelected: selectedFees.includes(+ledger.id || +ledger?.ledgerId) ? true : false, concessionAmount: transportConcession || 0,
            remainingAmount: (getTransportConcessionByIdResp && location.state?.id) ? +ledger?.concessionAllocatedAmount : ((+ledger?.amountToPay - totalConcession) || 0)
          }
        } else {
          return {
            ...ledger, id: ledger.id || ledger?.ledgerId, isSelected: false, concessionAmount: transportConcession, remainingAmount: (getTransportConcessionByIdResp && location.state?.id) ? +ledger?.concessionAllocatedAmount : ((+ledger?.amountToPay - totalConcession) || 0)
          }
        }
      })

      setLedgerList(updatedLedgers);
      updateSelectedAllHndlr(updatedLedgers);
    }
    else {
      setLedgerList([]);
    }
  }, [ledgerDetails, selectedFees])

  useEffect(() => {
    if (location.state?.id && location.state?.fromComponent === 'Student Concession') {
      dispatch(getTransportConcessionByIdAct(generateActionPayload('get_transport_concession_by_id', { id: location.state?.id })))
    }
    else if (location.state?.fromComponent === "Fee Summary") {
      getClassApiCall({ academicYearId: location.state?.StudentDetails?.studentAcademicDetails?.academicYearId, curriculumId: location.state?.StudentDetails?.studentAcademicDetails?.curriculumId });
      studentConcessionForm.setValues((prev: any) => ({
        ...prev,
        'studentId': location.state?.StudentDetails?.studentDetails?.id,
        curriculumId: location.state?.StudentDetails?.studentAcademicDetails?.curriculumId, classId: location.state?.StudentDetails?.studentAcademicDetails?.classId, academicYearId: location.state?.StudentDetails?.academicYearId
      }));
      setSearchStudentState({ studentId: location.state?.StudentDetails?.studentDetails?.id, studentCode: location.state?.StudentDetails?.studentDetails?.studentCode, studentName: location.state?.StudentDetails?.studentDetails?.studentName, curriculumId: location.state?.StudentDetails?.studentAcademicDetails?.curriculumId, classId: location.state?.StudentDetails?.studentAcademicDetails?.classId })

      // Call Fee Types API
      dispatch(getFeeTypesAct(generateActionPayload('get_fee_types', undefined, { instituteId: instituteId })))

    }
  }, [location.state])

  useEffect(() => {
    if (feeTypesResp && location.state?.fromComponent === "Fee Summary") {
      fetchLedgerDetails(location.state?.StudentDetails?.studentDetails?.id)
    }
  }, [feeTypesResp])

  useEffect(() => {
    const { prevGetTransportConcessionByIdResp } = StudentConcessionRef.current;
    if (getTransportConcessionByIdResp && getTransportConcessionByIdResp !== prevGetTransportConcessionByIdResp) {
      const { studentId, studentName, studentCode, totalConcessionAmount, curriculumId, classId, academicYearId, siblingName, siblingId, siblingCode, employeeId, employeeName, employeeCode } = getTransportConcessionByIdResp;

      studentConcessionForm.setValues({ ...getTransportConcessionByIdResp, document: getTransportConcessionByIdResp?.fileInfo?.originalFileName });
      getCurriculumApiCall({ academicYearId });
      getClassApiCall({ curriculumId, academicYearId });

      setSearchStudentState({ studentId: studentId, studentCode: studentCode, studentName: studentName, curriculumId, classId });
      setSelectedFees(getTransportConcessionByIdResp?.studentLedgersIds || [])
      fetchLedgerDetails(studentId)
      if (getTransportConcessionByIdResp?.concessionType === "SIBLING") {
        setSiblingState({ studentId: siblingId, studentCode: siblingCode, studentName: siblingName })
      } else if (getTransportConcessionByIdResp?.concessionType === "EMPLOYEE") {
        setEmployeeState({ employeeId: employeeId, employeeCode: employeeCode, employeeName: employeeName })
      }
    }

    StudentConcessionRef.current.prevGetTransportConcessionByIdResp = getTransportConcessionByIdResp;
  }, [getTransportConcessionByIdResp, feeTypesResp])

  const StudentConcessionRef = useRef({
    prevCreateTransportConcessionResp: createTransportConcessionResp,
    prevEditTransportConcessionResp: editTransportConcessionResp,
    prevGetTransportConcessionByIdResp: getTransportConcessionByIdResp,
    prevFeeConcessionErrorState: feeConcessionErrorState,
    prevTransportationConcessionErrorAct: transportationConcessionErrorAct,
  })

  useEffect(() => {
    const { prevCreateTransportConcessionResp, prevEditTransportConcessionResp, prevFeeConcessionErrorState, prevTransportationConcessionErrorAct } = StudentConcessionRef.current;
    if (createTransportConcessionResp && createTransportConcessionResp !== prevCreateTransportConcessionResp) {
      toast.success('transport concession created successfully.');
      history.push("/transport-concession");
    }
    else if (editTransportConcessionResp && editTransportConcessionResp !== prevEditTransportConcessionResp) {
      toast.success('transport concession edited successfully.');
      history.push("/transport-concession");
    } else if (feeConcessionErrorState && feeConcessionErrorState !== prevFeeConcessionErrorState) {
      const { message, details }: any = feeConcessionErrorState;
      toast.error(message || details || "Something went wrong.");
    }
    else if (transportationConcessionErrorAct && transportationConcessionErrorAct !== prevTransportationConcessionErrorAct) {
      const { message, details }: any = transportationConcessionErrorAct;
      toast.error(message || details || "Something went wrong.");
    }
    StudentConcessionRef.current.prevCreateTransportConcessionResp = createTransportConcessionResp;
    StudentConcessionRef.current.prevEditTransportConcessionResp = editTransportConcessionResp;
    StudentConcessionRef.current.prevFeeConcessionErrorState = feeConcessionErrorState;
    StudentConcessionRef.current.prevTransportationConcessionErrorAct = transportationConcessionErrorAct;
  }, [createTransportConcessionResp, editTransportConcessionResp, feeConcessionErrorState, transportationConcessionErrorAct])

  useEffect(() => {
    dispatch(resetLedgerDetailsAct(undefined));
    return () => {

      dispatch(resetBrchCurriculumAct(undefined));
      dispatch(resetBrchClassAct(undefined));
      setSearchStudentState(null);
      studentConcessionForm.resetForm();
      dispatch(resetLedgerDetailsAct(undefined));
    }
  }, [])

  const isEditMode = studentConcessionForm.values.document || getTransportConcessionByIdResp?.fileInfo?.originalFileName;
  useEffect(() => {
    if (!isEditMode) {
      studentConcessionForm.setFieldValue('document', null);
    }
  }, [isEditMode]); 

  const confirmSubmitHndler = () => {
    if (location?.state?.id) {
      const formData = new FormData();
      if (document?.name) {
        formData.append('file', document);
      }
      formData.append('request', JSON.stringify(submitConfirmModalState.modalData))
      dispatch(editTransportConcessionAct(generateActionPayload('edit_transport_concession', { id: location?.state?.id }, formData)))
    } else {

      const formData = new FormData();
      formData.append('file', document);
      formData.append('request', JSON.stringify(submitConfirmModalState.modalData))
      dispatch(createTransportConcessionAct(generateActionPayload('create_transport_concession', { branchId: branchId, academicYearId: studentConcessionForm.values.academicYearId }, formData)))
    }
  }

  const concessionAmountChangeHandler = (id: any, value: any, oldValue: any) => {

    let totalValue: any = 0;
    const abcd: any = ledgerList.map((ledger: any) => {
      if (+ledger.id === +id) {
        if ((+value <= +ledger?.remainingAmount)) {
          totalValue += Math.ceil(+value)
        } else {
          totalValue += Math.ceil(+ledger?.concessionAmount)
        }
        return {
          ...ledger, concessionAmount: (+value <= +ledger?.remainingAmount) ? +value : +ledger?.concessionAmount
        }
      } else {
        if (ledger?.isSelected) totalValue += Math.ceil(+ledger.concessionAmount || 0)
      }
      return { ...ledger }
    })

    if (totalValue <= +studentConcessionForm.values.concessionValue) {
      setCheckTotalConcession(false)
      setLedgerList(abcd)
      studentConcessionForm.setFieldValue('totalConcessionAmount', +totalValue);
    } else {
      setCheckTotalConcession(true)
    }
  }

  const handleFileChange = (files: any) => {
    setDocument(files);
    studentConcessionForm.setFieldValue('document', files);
  }

  const { data: academicYearList } = academicYearListResp || {};
  const { data: curriculumTypes } = brchCurriculumResp || {}
  const { content: classTypes } = branchClassResp || {};
  const { ledgers: LedgerList } = ledgerDetails || {};
  const { data: StudentList } = studentsListResp || {};

  return (
    <>
      <div className="page-content tution_fee_concession_wrap">
        <div className="container-fluid">
          <BreadCrumb title="Student Concessions" pageTitle="Fee" pageTitleUrl={location.state?.fromComponent === "Fee Summary" ? "/student-fee-ledger/fee-details" : "/student-concessions"} linkState={{ studentId: location.state?.StudentDetails?.studentDetails?.id, academicYearId: location.state?.StudentDetails?.academicYearId, curriculumId: location.state?.StudentDetails?.studentAcademicDetails?.curriculumId, classId: location.state?.StudentDetails?.studentAcademicDetails?.classId }}
          />

          <div className="tw-flex tw-justify-center tw-mb-4">
            <div className="tw-w-full tw-bg-white tw-rounded-lg tw-shadow">
              <div className="tw-border-b tw-px-6 tw-py-4 tw-text-lg tw-font-semibold">
                {`${location.state?.id ? "Edit" : "Create"} Conncession`}
              </div>

              <div className="tw-p-6">
                <div className="tw-grid tw-grid-cols-12 tw-gap-6 tw-border-b tw-border-dashed tw-border-gray-300 tw-pb-6">
                  <div className="tw-col-span-4">
                    <SelectInput
                      name="academicYearId"
                      value={studentConcessionForm.values.academicYearId}
                      onChange={filterHandler}
                      menuItems={academicYearList || []}
                      valueKey="academicYearId"
                      textKey="academicYearName"
                      defaultSelect="Academic Year"
                      formgroupClassName="tw-mb-2"
                      isDisabled={
                        location.state?.id ||
                        location.state?.fromComponent === "Fee Summary"
                      }
                      invalid={
                        studentConcessionForm.touched.academicYearId &&
                          studentConcessionForm.errors.academicYearId
                          ? true
                          : false
                      }
                      error={
                        studentConcessionForm.touched.academicYearId &&
                          studentConcessionForm.errors.academicYearId
                          ? studentConcessionForm.errors.academicYearId
                          : ""
                      }
                    />

                    <AutoSearchInputUpdated
                      formgroupClassName="search-box"
                      name="searchString"
                      placeHolder="Search..."
                      onChange={(string: any) => {
                        if (!string)
                          studentConcessionForm.setFieldValue("studentId", "");
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
                      isDisabled={
                        location.state?.id ||
                        location.state?.fromComponent === "Fee Summary"
                      }
                      invalid={
                        studentConcessionForm.touched.studentId &&
                          studentConcessionForm.errors.studentId
                          ? true
                          : false
                      }
                      error={
                        studentConcessionForm.touched.studentId &&
                          studentConcessionForm.errors.studentId
                          ? studentConcessionForm.errors.studentId
                          : ""
                      }
                    >
                      <i className="ri-search-line search-icon" />
                    </AutoSearchInputUpdated>

                    <SelectInput
                      name="curriculumId"
                      value={studentConcessionForm.values.curriculumId}
                      onChange={filterHandler}
                      menuItems={curriculumTypes || []}
                      valueKey="branchCurriculumId"
                      textKey="curriculumName"
                      defaultSelect="Curriculum"
                      formgroupClassName="tw-my-2"
                      isDisabled={true}
                    />

                    <SelectInput
                      name="classId"
                      value={studentConcessionForm.values.classId}
                      onChange={filterHandler}
                      menuItems={classTypes || []}
                      valueKey="id"
                      textKey="shortName"
                      defaultSelect="Class"
                      formgroupClassName="tw-mb-2"
                      isDisabled={true}
                    />
                  </div>

                  <div className="tw-col-span-4" />

                  <div className="tw-col-span-4">
                    <SelectInput
                      name="concessionMode"
                      labelText="Concession"
                      value={studentConcessionForm.values.concessionMode}
                      onChange={filterHandler}
                      menuItems={concessionMode}
                      valueKey="concessionModeType"
                      textKey="concessionMode"
                      formgroupClassName="tw-mb-1"
                      invalid={
                        studentConcessionForm.touched.concessionMode &&
                          studentConcessionForm.errors.concessionMode
                          ? true
                          : false
                      }
                      error={
                        studentConcessionForm.touched.concessionMode &&
                          studentConcessionForm.errors.concessionMode
                          ? studentConcessionForm.errors.concessionMode
                          : ""
                      }
                    />

                    <TextInputGroup
                      name="concessionValue"
                      value={studentConcessionForm.values.concessionValue}
                      onChange={filterHandler}
                      inputGroupStart={true}
                      allowedInputRegex="^[0-9]*$"
                      groupClassName="2.3rem"
                      labelClass="tw-text-gray-500"
                      invalid={
                        studentConcessionForm.touched.concessionValue &&
                          studentConcessionForm.errors.concessionValue
                          ? true
                          : false
                      }
                      error={
                        studentConcessionForm.touched.concessionValue &&
                          studentConcessionForm.errors.concessionValue
                          ? studentConcessionForm.errors.concessionValue
                          : ""
                      }
                    >
                      <i className="tw-p-2">
                        {studentConcessionForm.values.concessionMode === "AMOUNT"
                          ? "₹"
                          : "%"}
                      </i>
                    </TextInputGroup>
                  </div>
                </div>

                {/* Ledger Table */}
                <div className="tw-border-b tw-border-dashed tw-border-gray-300 tw-py-4">
                  <TableContainer
                    columns={roleColumns || []}
                    data={Array.isArray(ledgerList) ? ledgerList : []}
                    divClass="table-responsive tw-my-3"
                    theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
                    rowDataInfo={{ ...studentConcessionForm.values }}
                    onChangeInputHndlr={concessionAmountChangeHandler}
                  />

                  <span className="tw-text-red-600 tw-pl-4">
                    {studentConcessionForm.errors.isNoFeeSelected
                      ? String(studentConcessionForm.errors.isNoFeeSelected)
                      : ""}
                  </span>

                  <span className="tw-text-red-600 tw-pl-4">
                    {checkTotalConcession
                      ? "* Your Concession Amount should not be greater than total Concession Amount"
                      : ""}
                  </span>
                </div>

                <div className="tw-p-6">
                  <div className="tw-ml-auto tw-w-5/12 tw-space-y-4">
                    <div className="tw-flex tw-items-center tw-justify-between">
                      <label>
                        Concession Type <span className="tw-text-red-600">*</span>
                      </label>
                      <SelectInput
                        name="concessionType"
                        value={studentConcessionForm.values.concessionType}
                        onChange={studentConcessionForm.handleChange}
                        menuItems={concessionType}
                        valueKey="concessionType"
                        textKey="concessionType"
                        formgroupClassName="tw-w-1/2"
                        invalid={
                          studentConcessionForm.touched.concessionType &&
                            studentConcessionForm.errors.concessionType
                            ? true
                            : false
                        }
                        error={
                          studentConcessionForm.touched.concessionType &&
                            studentConcessionForm.errors.concessionType
                            ? studentConcessionForm.errors.concessionType
                            : ""
                        }
                      />
                    </div>
                    {studentConcessionForm.values.concessionType == "SIBLING" && (<div className="tw-flex tw-items-center tw-justify-between tw-mb-4">
                      <label className="tw-m-0">Sibling</label>
                      <AutoSearchInputUpdated
                        formgroupClassName="search-box tw-w-1/2"
                        name="siblingId"
                        placeHolder="Search..."
                        onChange={(string: any) => {
                          if (!string) studentConcessionForm.setFieldValue('siblingId', "");
                          onSiblingInputSearchChange(string)
                        }}
                        alignRight={true}
                        valueKey="studentId"
                        labelHeader="Student Code"
                        labelKey="studentCode"
                        subLabelHeader="Student Name"
                        subLabelKey="studentName"
                        options={siblingsForRegistrationResp?.filter((item: any) => +item?.studentId !== searchStudentState?.studentId)}
                        selected={siblingState}
                        selectedOptionCallbck={selectedSibling}
                        onBlur={studentConcessionForm.handleBlur}
                        invalid={
                          studentConcessionForm.touched.siblingId &&
                            studentConcessionForm.errors.siblingId
                            ? true
                            : false
                        }
                        error={
                          studentConcessionForm.touched.siblingId &&
                            studentConcessionForm.errors.siblingId
                            ? studentConcessionForm.errors.siblingId
                            : ""
                        }
                      ><i className="ri-search-line search-icon"></i></AutoSearchInputUpdated>
                    </div>)}
                  {studentConcessionForm.values.concessionType == "EMPLOYEE" && (<div className="tw-flex tw-items-center tw-justify-between tw-mb-4">
                      <label className="tw-m-0">Employee</label>
                      <AutoSearchInputUpdated
                        formgroupClassName="search-box tw-w-1/2"
                        name="employeeId"
                        placeHolder="Search..."
                        onChange={(string: any) => {
                          if (!string) studentConcessionForm.setFieldValue('employeeId', "");
                          onEmployeeInputSearchChange(string)
                        }}
                        valueKey="id"
                        labelHeader="Employee Code"
                        labelKey="employeeCode"
                        subLabelHeader="Employee Name"
                        subLabelKey="employeeName"

                        options={(Array.isArray(getEmployeesByFilterResp) && getEmployeesByFilterResp) || []}
                        selected={employeeState}
                        selectedOptionCallbck={selectedEmployee}
                        invalid={
                          studentConcessionForm.touched.employeeId &&
                            studentConcessionForm.errors.employeeId
                            ? true
                            : false
                        }
                        error={
                          studentConcessionForm.touched.employeeId &&
                            studentConcessionForm.errors.employeeId
                            ? studentConcessionForm.errors.employeeId
                            : ""
                        }
                      ><i className="ri-search-line search-icon"></i></AutoSearchInputUpdated>
                    </div>)}

                    <div className="tw-flex tw-items-center tw-justify-between">
                      <label>Total Concession Amount</label>
                      <TextIconInput
                        name="totalConcessionAmount"
                        value={Math.ceil(+studentConcessionForm.values.totalConcessionAmount)}
                        onChange={studentConcessionForm.handleChange}
                        onBlur={studentConcessionForm.handleBlur}
                        isDisabled={true}
                        formgroupClassName="tw-w-1/2"
                      >
                        <i className="tw-text-lg">₹</i>
                      </TextIconInput>
                    </div>

                    <div className="tw-flex tw-justify-between">
                      <label>
                        Remarks <span className="tw-text-red-600">*</span>
                      </label>
                      <TextArea
                        name="remarks"
                        value={studentConcessionForm.values.remarks}
                        onChange={studentConcessionForm.handleChange}
                        formgroupClassName="tw-w-1/2"
                        invalid={
                          studentConcessionForm.touched.remarks &&
                            studentConcessionForm.errors.remarks
                            ? true
                            : false
                        }
                        error={
                          studentConcessionForm.touched.remarks &&
                            studentConcessionForm.errors.remarks
                            ? studentConcessionForm.errors.remarks
                            : ""
                        }
                      />
                    </div>
                    <div className="tw-flex tw-justify-between">
                      <label className="tw-m-0">
                        Document <span className="tw-text-red-600">*</span>
                      </label>

                      <div className="tw-w-1/2">
                        <label
                          className="choose_file_botton tw-border tw-cursor-pointer tw-mb-2 hover_effect"
                          htmlFor="document"
                        >
                          Choose File
                        </label>

                        <input
                          type="file"
                          name="document"
                          id="document"
                          onChange={(event: any) => {
                            const file = event.target.files[0];
                            if (file) {
                              setDocument(file);
                              studentConcessionForm.setFieldValue("document", file);
                            }
                          }}
                          hidden
                        />
                        <h6 className="tw-font-normal tw-block file_name_wrap"
                          title={studentConcessionForm.values.document ? typeof studentConcessionForm.values.document === "string" ? studentConcessionForm.values.document : (studentConcessionForm.values.document as File).name : getTransportConcessionByIdResp?.fileInfo?.originalFileName || "No file chosen"}
                          id="document"
                        >
                          {studentConcessionForm.values.document ? typeof studentConcessionForm.values.document === "string" ? studentConcessionForm.values.document : (studentConcessionForm.values.document as File).name
                            : "No file chosen"}
                        </h6>
                        {studentConcessionForm.touched.document && studentConcessionForm.errors.document && (
                          <FormFeedback className="d-block" type="invalid">
                            {studentConcessionForm.errors.document}</FormFeedback>)}</div>
                    </div>
                  </div>
                </div>

                <div className="tw-flex tw-justify-end tw-gap-3 tw-pt-6">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={CancelHandler}
                  >
                    Cancel
                  </Button>

                  <Button
                    type="submit"
                    variant="primary"
                    onClick={(e: any) =>
                      studentConcessionForm.handleSubmit(e)
                    }
                  >
                    {location.state?.id ? "Update" : "Submit"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <ModalContainerUpdated
        id="student-concession-modal"
        isOpen={stuConcessionModalState.showModal}
        toggle={closeStuConcessionModal}
        modalTitle="Previous Concession"
        modalSize="xl"
      >
        <StudentConcessionModal
          dispatch={dispatch}
          branchId={branchId}
          concessionDetails={studentConcessionForm.values}
        />
      </ModalContainerUpdated> */}
      <ConfirmationModal
        id="transport-concession-create-modal"
        isOpen={submitConfirmModalState.showModal}
        confirmMessage={`You want to ${location.state?.id ? "Update" : "Create"} this concession ?`}
        cancelHndlr={closeSubmitConfirmModal}
        confirmHndlr={confirmSubmitHndler}
        isDisble={showApiLoader}
        showImgIcon={true}
        iconType="approve"
        btnClassName='btn w-sm btn-success'
      />
      <ModalContainerUpdated
        id="student-concession-check-modal"
        isOpen={checkConcessionModalState.showModal}
        toggle={closeCheckConcessionModal}
        modalTitle=""
        headerClassName="bg-white"
        modalSize="md"
      >
        <CheckConcessionModal
          toggle={closeCheckConcessionModal}
        />
      </ModalContainerUpdated>

    </>
  );
};

export default NewTransportConcession;
