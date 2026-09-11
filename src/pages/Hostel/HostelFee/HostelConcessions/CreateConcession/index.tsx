
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
} from "../../../../../Components/Common";
import BreadCrumb from "../../../../../Components/Common/BreadCrumb";
import {
  concessionMode,
  concessionType,
  generateColumns,
} from "./helper";
import TableContainer from "../../../../../Components/Common/TableContainer";
// import StudentConcessionModal from "./StudentConcessionModal";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { getInstAcademicYearAct } from "../../../../../store/mastersettings/instacademics/instacademicactions";
import { generateActionPayload } from "../../../../../utility/reduxutility";
import { getBranchClassAct, getBranchCurriculumAct, resetBrchClassAct, resetBrchCurriculumAct, setBrchClassAct } from "../../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { getEmployeeByFilterAct } from "../../../../../store/directory/employeemanagement/employeemanagementactions";
import { getStudentsListAct } from "../../../../../store/directory/studentmanagement/studentmanagementactions";
import { getLedgerDetailsAct, resetLedgerDetailsAct } from "../../../../../store/fee/feecollections/feecollectionactions";
import { getAmountValueWithDecimal, percentageConverter, valueConverter } from "../../../../../utility/commonutility";
import { addStudentConcessionAct, editStudentConcessionAct, getStudentConcessionById } from "../../../../../store/fee/feeconcessions/feeconcessionactions";
import { useHistory, useLocation } from "react-router-dom";
import { getFeeTypesAct } from "../../../../../store/modulesettings/masterfeesettings/masterfeesettingsactions";
import * as Yup from 'yup';
import { toast } from "react-toastify";
import CheckConcessionModal from "./CheckConcessionModal";
import { getSiblingForRegistrationAct } from "../../../../../store/FrontDesk/AdmissionRegistration/admissionregistrationaction";
import Button from "../../../../../Components/Common/Button";


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

function generateValidationSchema(concessionId: any) {
  return (Yup.object().shape({
    concessionMode: Yup.string().required("Select Concession Mode").nullable(),
    concessionValue: Yup.number().min(0, 'Concession should be more than 0').required("Enter Concession Value.").when('concessionMode', {
      is: (item: any) => item === "PERCENTAGE",
      then: Yup.number().max(100, 'Concession should be less than 100').min(0, 'Concession should be more than 0').nullable(),
      otherwise: Yup.number().nullable()
    }),
    concessionType: Yup.string().required("Select Concession Type").nullable(),
    studentId: Yup.string().required("Student is required").nullable(),
    siblingId: Yup.string().nullable().when('concessionType', {
      is: (item: any) => item === "SIBLING",
      then: Yup.string().required('Sibling id is required.')
    }),
    employeeId: Yup.string().nullable().when('concessionType', {
      is: (item: any) => item === "EMPLOYEE",
      then: Yup.string().required('Employee id is required.').nullable()
    }),
    remarks: Yup.string().required("Remarks are required.").nullable(),
    document: Yup.array().test('is-files-required', 'At least one file is required', function (value) {
      // if (!concessionId && (!value || value.length === 0)) {
      if (!value || value.length === 0) {
        return false;
      }
      return true;
    }).nullable(),
  }))
}

const HostelConcessionPage = () => {

  const dispatch = useAppDispatch();
  const location: any = useLocation();
  const history: any = useHistory();
  const [document, setDocument] = useState<any>([]);
  const [ledgerList, setLedgerList] = useState([]);
  const [allFeeSelectedState, setAllFeeSelectedState] = useState(false);
  const [searchStudentState, setSearchStudentState] = useState<any>(null);
  const [siblingState, setSiblingState] = useState<any>(null);
  const [employeeState, setEmployeeState] = useState<any>(null);
  const [checkTotalConcession, setCheckTotalConcession] = useState(false);
  const [availableStudentState, setAvailableStudentState] = useState([]);
  const [globalConcessionValue, setGlobalConcessionValue] = useState<any>(0);
  const [selectedFees, setSelectedFees] = useState<any>([]);

  const [submitConfirmationModal, setSubmitConfirmationModal] =
    useState({
      showModal: false,
      payload: null,
    });
  const [checkConcessionModal, setCheckConcessionModal] =
    useState({
      showModal: false,
      id: null,
    });

  const toggleSubmitConfirmationModal = (payload?: any) => {
    setSubmitConfirmationModal((prevState: any) => ({
      ...prevState,
      showModal: !prevState.showModal,
      payload: payload || null,
    }));
  };
  const toggleCheckConcessionModal = (id?: any) => {
    setCheckConcessionModal((prevState: any) => ({
      ...prevState,
      showModal: !prevState.showModal,
      id: id || null,
    }));
  };

  const validationSchema = useMemo(() => {
    const concessionId = location?.state?.id;
    return generateValidationSchema(concessionId);
  }, [location]);

  const HostelConcessionForm = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema,
    onSubmit: (values) => {
      let selectedStudents: any = [];
      let payload = {};
      ledgerList.map((stu: any) => {
        if (stu?.isSelected) {
          selectedStudents.push({
            ledgerId: stu.ledgerId,
            concessionValueInPerc: getAmountValueWithDecimal(percentageConverter(stu.amountToPay, values?.concessionMode, values?.concessionMode === "AMOUNT" ? (stu?.concessionAmount || 0) : values?.concessionValue)),
            concessionAmount: Math.ceil(valueConverter((+stu.remainingAmount), values?.concessionMode, values?.concessionMode === "AMOUNT" ? (+stu?.concessionAmount || 0) : +values?.concessionValue)) || 0
          })
        }
      })

      if (location.state?.id) {
        payload = {
          feeType: "TERM",
          concessionMode: values.concessionMode,
          concessionValue: values.concessionValue,
          studentConcessionFeeDetailsDTO: selectedStudents,
          siblingId: siblingState?.studentId || "",
          employeeId: employeeState?.id || "",
          totalConcessionAmount: values.totalConcessionAmount,
          remarks: values.remarks,
          concessionType: values.concessionType
        }

        if (selectedStudents.length > 0) {

          if (values.concessionMode === "AMOUNT" && (+values.totalConcessionAmount !== +values.concessionValue)) {
            toggleCheckConcessionModal()
          } else {
            toggleSubmitConfirmationModal(payload)
          }
        }
        else {
          HostelConcessionForm.setFieldError('isNoFeeSelected', "*Select At least One Fee")
        }
      }
      else {

        payload = {
          classId: values.classId,
          curriculumId: values.curriculumId,
          studentId: searchStudentState.studentId,
          sectionId: searchStudentState?.sectionId,
          siblingId: siblingState?.studentId || "",
          employeeId: employeeState?.id || "",
          feeTypeId: values.feeTypeId,
          branchId,
          concessionMode: values.concessionMode,
          concessionValue: values.concessionValue,
          academicYearId: values.academicYearId,
          ledgers: selectedStudents,
          concessionType: values.concessionType,
          remarks: values.remarks,
          totalConcessionAmount: values.totalConcessionAmount
        }

        if (selectedStudents.length > 0) {
          if (values.concessionMode === "AMOUNT" && (+values.totalConcessionAmount !== +values.concessionValue)) {
            toggleCheckConcessionModal()
          } else {
            toggleSubmitConfirmationModal(payload)
          }
        }
        else {
          HostelConcessionForm.setFieldError('isNoFeeSelected', "*Select At least One Fee")
        }

      }
    },
  });
  const {
    academicYearListResp,
    brchCurriculumResp,
    branchClassResp,
    feeTypesResp,
    classroomManagmentErrorResp,
    ledgerDetails,
    studentConcessionById,
    addStudentConcession,
    editStudentConcession,
    studentsListResp,
    getStudentsByFilterResp,
    getEmployeesByFilterResp,
    feeConcessionErrorState,
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    showApiLoader,
    siblingsForRegistrationResp,
  } = useAppSelector(
    ({ classroomManagmentInfo, globalData, instAcademics, branchAcademics, appData, directoryStudent, directoryEmployee, feeCollections, feeConcession, masterFeeSettings, admissionRegistration }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      branchClassResp: branchAcademics.branchClassResp,
      classroomManagmentErrorResp: classroomManagmentInfo.classroomManagmentErrorResp,
      ledgerDetails: feeCollections.ledgerDetails,
      studentConcessionById: feeConcession.studentConcessionById,
      addStudentConcession: feeConcession.addStudentConcession,
      editStudentConcession: feeConcession.editStudentConcession,
      studentsListResp: directoryStudent.studentsListResp,
      getStudentsByFilterResp: directoryStudent.getStudentsByFilterResp,
      getEmployeesByFilterResp: directoryEmployee.getEmployeesByFilterResp,
      feeTypesResp: masterFeeSettings.feeTypesResp,
      feeConcessionErrorState: feeConcession.feeConcessionErrorState,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      siblingsForRegistrationResp: admissionRegistration.siblingsForRegistrationResp,
      showApiLoader: globalData.showApiLoader,
    }),
    shallowEqual
  );

  const fetchLedgersDetails = (studentId: any, academicYearId: any) => {

    const payload = {
      studentId,
      branchId: branchId,
      academicYearId,
      studentInfo: "studentInfo",
      allowStudentConcession: "",
      allowEmployeeConcession: "YES",
      allowRefund: "NO",
      sortBy: "id",
      ledgerId: 1,
    };

    dispatch(getLedgerDetailsAct(generateActionPayload('hostel_stu_ledger_details', undefined, payload)));

  }


  const selectAllFeeHndlr = useCallback((event: any) => {
    const { checked } = event.target;

    setAllFeeSelectedState(checked);
    const updateSearchStudentListState: any = [...ledgerList];
    const updatedAvailableStudentState: any = [...availableStudentState];

    const modifiedStudentId: any = [];
    updateSearchStudentListState.forEach((item: any) => {
      let { concessionMode, concessionValue } = HostelConcessionForm.values;
      if ((concessionMode === "AMOUNT") || (concessionMode === "PERCENTAGE" && +concessionValue <= 100)) {
        if (!item?.isSelected) { item.concessionAmount = 0 }
        item.isSelected = checked;
        modifiedStudentId.push(item.id);
      }
    });

    updatedAvailableStudentState.forEach((item: any) => {
      let { concessionMode, concessionValue } = HostelConcessionForm.values;
      if ((concessionMode === "AMOUNT" && +item.amountToPay >= +concessionValue) || (concessionMode === "PERCENTAGE" && +concessionValue <= 100)) {
        item.isSelected = modifiedStudentId.includes(item.id) ? checked : item.isSelected;
        modifiedStudentId.push(item.id);
      }
    });

    let value: any = 0;
    updateSearchStudentListState?.map((item: any) => {
      if (item.isSelected) {
        if (item?.concessionAmount) {
          value = +value + +item?.concessionAmount
        }
      }
    })
    let totalValue = +HostelConcessionForm.values.concessionValue - +value
    const newList: any = updateSearchStudentListState?.map((item: any) => {
      if (item.isSelected && !item?.concessionAmount) {
        if ((+item?.remainingAmount) > +totalValue) {
          const newValue: any = totalValue;
          totalValue = 0
          return { ...item, concessionAmount: newValue }
        } else {
          totalValue = +totalValue - (+item?.remainingAmount)
          return { ...item, concessionAmount: (+item?.remainingAmount) }
        }

      } else {
        return { ...item }
      }
    })
    let globalConcession: any = 0
    newList?.map((i: any) => {
      if (i.isSelected) {
        if (HostelConcessionForm.values.concessionMode === "AMOUNT") {
          globalConcession = +globalConcession + Math.ceil(+valueConverter((i?.remainingAmount), HostelConcessionForm.values.concessionMode, i?.concessionAmount || 0))
        } else {
          globalConcession = +globalConcession + Math.ceil(+valueConverter((i?.remainingAmount), HostelConcessionForm.values.concessionMode, HostelConcessionForm.values.concessionValue || 0))
        }
      }
    })

    setGlobalConcessionValue(+HostelConcessionForm.values.concessionValue - +globalConcession)
    HostelConcessionForm.setFieldValue('totalConcessionAmount', +globalConcession);
    setLedgerList(newList);
    setCheckTotalConcession(false)
    setAvailableStudentState(updatedAvailableStudentState);
  }, [ledgerList, availableStudentState]);

  const studentCheckHndlr = useCallback((event: any) => {
    const { name, value, checked } = event.currentTarget,
      ledgerId = event.currentTarget.getAttribute("data-id"),
      studentIndex = availableStudentState.findIndex((item: any) => +item.ledgerId === Number(ledgerId)),
      studentIndexInSearchedStudent = ledgerList.findIndex((item: any) => +item.ledgerId === Number(ledgerId)),
      student: any = ledgerList.find((item: any) => item.ledgerId === Number(ledgerId))
    let updatedLegder: any = ledgerList;
    let globalValue: any = globalConcessionValue;

    if (student?.isSelected) {
      let totalConcession: any = +HostelConcessionForm.values.totalConcessionAmount;
      if (HostelConcessionForm.values.concessionMode === "PERCENTAGE") {
        totalConcession -= Math.ceil(+valueConverter(student?.amountToPay, HostelConcessionForm.values.concessionMode, HostelConcessionForm.values.concessionValue))
      } else {
        totalConcession -= Math.ceil(student?.concessionAmount || 0)
      }
      HostelConcessionForm.setFieldValue('totalConcessionAmount', totalConcession);
      setGlobalConcessionValue((prev: any) => (+prev + Math.ceil(student?.concessionAmount || 0)))
    }
    else {
      if (!(HostelConcessionForm.values.concessionMode === "PERCENTAGE")) {
        updatedLegder = updatedLegder?.map((i: any) => {
          if (+i?.ledgerId === +ledgerId) {

            if (+globalConcessionValue <= (+i?.remainingAmount)) {
              return {
                ...i,
                concessionAmount: +globalConcessionValue
              }
            } else if (+globalConcessionValue > (+i?.remainingAmount)) {

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
    if (studentIndex > -1 && studentIndexInSearchedStudent > -1) {
      const studentDetails: any = availableStudentState[studentIndex],
        updatedStudentDetails: any = updatedLegder[studentIndex],
        updatedAvailableStudentState: any = [...availableStudentState],
        updatedSearchStudentState: any = [...updatedLegder];
      updatedAvailableStudentState.splice(studentIndex, 1, { ...studentDetails, isSelected: checked });
      updatedSearchStudentState.splice(studentIndexInSearchedStudent, 1, { ...updatedStudentDetails, isSelected: checked });


      let totalValue: any = 0;
      let minimum = 999999999999999;
      updatedSearchStudentState.map((ledger: any) => {
        if (ledger?.isSelected) {
          minimum = minimum > ledger.amountToPay ? ledger.amountToPay : minimum;
          if (HostelConcessionForm.values.concessionMode === "PERCENTAGE") {
            totalValue = +totalValue + Math.ceil(+valueConverter((+ledger?.remainingAmount), HostelConcessionForm.values.concessionMode, +HostelConcessionForm.values.concessionValue))
          } else {
            totalValue += Math.ceil(+ledger.concessionAmount || 0)
          }
        }
      })
      globalValue = +HostelConcessionForm.values.concessionValue - +totalValue
      setGlobalConcessionValue(globalValue)

      HostelConcessionForm.setFieldValue('totalConcessionAmount', +totalValue);
      HostelConcessionForm.setFieldValue('minimumNetAmount', minimum);
      setCheckTotalConcession(false)
      setAvailableStudentState(updatedAvailableStudentState);
      setLedgerList(updatedSearchStudentState);
      updateSelectedAllHndlr(updatedSearchStudentState);
    }
  }, [ledgerList, HostelConcessionForm.values.concessionMode, HostelConcessionForm.values.concessionValue]);

  const roleColumns = useMemo(() => generateColumns(HostelConcessionForm.values.concessionMode, HostelConcessionForm.values.concessionValue, allFeeSelectedState,
    selectAllFeeHndlr, studentCheckHndlr, globalConcessionValue), [HostelConcessionForm, globalConcessionValue, ledgerList]);
  const [studentConcessionModal, setStudentConcessionModal] =
    useState<any>({
      showModal: false,
      branchId: "",
    });

  const toggleStudentConcessionModal = () => {
    setStudentConcessionModal((prevState: any) => ({
      ...prevState,
      showModal: !prevState.showModal,
    }));
  };

  useEffect(() => {
    return () => {
      dispatch(resetBrchClassAct(undefined));
    }
  }, []);
  
  useEffect(() => {
    if(instituteId){ 
      const params = { instituteId: instituteId };
      dispatch(getFeeTypesAct(generateActionPayload('get_fee_types', undefined, params)))
    }
  }, [instituteId]);

  const getCurriculumApiCall = (otherProps?: any) => {
    const payload1 = { academicYearId: HostelConcessionForm.values.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" , ...otherProps };
    dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
  }

  useEffect(() => {
    let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus === "CURRENT")?.academicYearId
    if(academicYearListResp && !location.state?.fromComponent){
      HostelConcessionForm.setFieldValue("academicYearId", yearId)
      getCurriculumApiCall({academicYearId:yearId})
    }
  }, [academicYearListResp,branchId,instituteId]);


  const filterHandler = (event: any) => {
    const { name, value } = event.target;
    if (name === "concessionValue") {
      if (HostelConcessionForm.values.concessionMode === "PERCENTAGE") {
        if (+value <= 100) {
          HostelConcessionForm.handleChange(event);
        }
      } else {
        HostelConcessionForm.handleChange(event);
      }
    } else {
      HostelConcessionForm.handleChange(event);
    }
    setCheckTotalConcession(false)
    if (name === 'curriculumId') {
      const payload = { branchId: branchId,academicYearId:HostelConcessionForm.values.academicYearId, curriculumId: value, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100 };
      dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));

      setSearchStudentState({});
      dispatch(setBrchClassAct(undefined));
      setLedgerList([]);
    }
    else if (name === 'academicYearId') {
      HostelConcessionForm.setValues((prev: any) => ({ ...initialValues, feeTypeId: prev?.feeTypeId, [name]: value }));
      setSearchStudentState({});
      dispatch(setBrchClassAct(undefined));
      setLedgerList([]);
    }
    else if (name === "concessionMode") {
      let newled: any = ledgerList.map((ledger: any) => ({ ...ledger, isSelected: false }));
      setLedgerList(newled);
      updateSelectedAllHndlr(newled)
      HostelConcessionForm.setValues((prev: any) => ({ ...prev, [name]: value, concessionValue: "", totalConcessionAmount: "" }));
    }
    else if (name === "concessionValue") {


      let totalValue = event.target.value;
      let newled: any;
      if (HostelConcessionForm.values.concessionMode === "AMOUNT") {
        newled = ledgerList?.map((ledger: any) => {
          if (ledger?.isSelected) {
            if ((+ledger?.remainingAmount) <= totalValue) {
              totalValue = totalValue - (+ledger?.remainingAmount)
              return { ...ledger, concessionAmount: (+ledger?.remainingAmount) }
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
      let globalValue = event.target.value - +totalConcession

      HostelConcessionForm.setFieldValue('totalConcessionAmount', +totalConcession);

      setGlobalConcessionValue(globalValue)
      setLedgerList(newled);
      updateSelectedAllHndlr(newled)
      HostelConcessionForm.setFieldValue('minimumNetAmount', 999999999999999);

    }
    else if (name === 'feeTypeId') {

      fetchLedgersDetails(searchStudentState?.studentId, HostelConcessionForm.values.academicYearId)

    } else if (name === 'classId') {
      setLedgerList([]);
      HostelConcessionForm.setValues((prevValues: any) => ({
        ...prevValues,
        feeTypeId: '', studentId: '', concessionMode: '',
        concessionType: '',
        concessionValue: '', [name]: value
      }));
      setSearchStudentState({});
    }
  }
  function onInputSearchChange(inputString: any) {
    const { academicYearId, curriculumId, classId } = HostelConcessionForm.values;
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
    const newpayload = { branchId: branchId,academicYearId:HostelConcessionForm.values.academicYearId, curriculumId: student?.curriculumId, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100 };
    dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, newpayload)));

    setLedgerList([]);
    if (!student) {
      HostelConcessionForm.setValues((prevValue: any) => ({
        ...prevValue, studentId: '',
        feeTypeId: prevValue?.feeTypeId, concessionMode: '', concessionValue: ''
      }));
    } else {
      HostelConcessionForm.setFieldValue('studentId', student?.studentId);
    }

    fetchLedgersDetails(student?.studentId, HostelConcessionForm.values.academicYearId)
  }

  useEffect(() => {
    if (branchClassResp && searchStudentState) {

      HostelConcessionForm.setValues((prev: any) => ({
        ...prev,
        curriculumId: searchStudentState?.curriculumId,
        classId: searchStudentState?.classId
      }))
    }
  }, [branchClassResp])

  const selectedSibling = (student: any) => {
    HostelConcessionForm.setFieldValue('siblingId', student.studentId)
    setSiblingState(student);
  }
  const selectedEmployee = (employee: any) => {
    HostelConcessionForm.setFieldValue('employeeId', employee.id)
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
    history.push("/hostel-concession");
  }

  useEffect(() => {
    if (ledgerDetails) {
      let ledgerValue: any = studentConcessionById && location.state?.id ? +studentConcessionById?.totalConcessionAmount : 0
      let updatedLedgers = (((studentConcessionById && location.state?.id) ? studentConcessionById?.studentConcessionChildDTO : ledgerDetails?.ledgersDtos) || []).map((ledger: any) => {
        if (selectedFees.includes(location.state?.id ? +ledger.id : +ledger.ledgerId)) {
          if (studentConcessionById && location.state?.id) {
            ledgerValue = +ledgerValue - (+ledger?.studentConcessionAmount || 0)
          } else {
            ledgerValue = +ledgerValue + (+ledger?.studentConcessionAmount || 0)
          }
          return { ...ledger,ledgerId : ledger?.ledgerId || ledger?.id, isSelected: selectedFees.includes(location.state?.id ? +ledger.id : +ledger.ledgerId) ? true : false, concessionAmount: +ledger?.studentConcessionAmount || 0, remainingAmount: (studentConcessionById && location.state?.id) ? +ledger?.concessionAllocatedAmount : ((+ledger?.amountToPay - +ledger?.studentConcessionAmount) || 0) }
        } else {
          return { ...ledger,ledgerId : ledger?.ledgerId || ledger?.id, isSelected: false, concessionAmount: +ledger?.studentConcession || 0, remainingAmount: (+ledger?.amountToPay - (+ledger?.studentConcession + +ledger?.employeeConcession)) || 0 }
        }
      })
      
      setGlobalConcessionValue(ledgerValue)
      setLedgerList(updatedLedgers);
      setAvailableStudentState(updatedLedgers);
      updateSelectedAllHndlr(updatedLedgers);
    }
    else {
      setLedgerList([]);
    }
  }, [ledgerDetails, selectedFees])

  useEffect(() => {
    if (location.state?.id && location.state?.fromComponent === 'Student Concession') {
      dispatch(getStudentConcessionById(generateActionPayload('get_hostel_concession_by_id', { id: location.state?.id })))
    }
    else if (location.state?.fromComponent === "Fee Summary") {
      const payload = { branchId: branchId,academicYearId:location.state?.StudentDetails?.academicYearId, curriculumId: location.state?.StudentDetails.curriculumId, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100 };
      dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
      HostelConcessionForm.setValues((prev: any) => ({
        ...prev,
        'studentId': location.state?.StudentDetails?.studentId,
        curriculumId: location.state?.StudentDetails?.curriculumId, classId: location.state?.classId, academicYearId: location.state?.StudentDetails?.academicYearId
      }));
      getCurriculumApiCall({academicYearId: location.state?.StudentDetails?.academicYearId})
      setSearchStudentState({ studentId: location.state?.StudentDetails?.studentId, studentCode: location.state?.StudentDetails?.studentCode, studentName: location.state?.StudentDetails?.studentName, curriculumId: location.state?.StudentDetails?.curriculumId, classId: location.state?.StudentDetails?.classId })

      // Call Fee Types API
      dispatch(getFeeTypesAct(generateActionPayload('get_fee_types', undefined, { instituteId: instituteId })))

    }
  }, [location.state])

  useEffect(() => {
    if (feeTypesResp && location.state?.fromComponent === "Fee Summary") {

      fetchLedgersDetails(location.state?.StudentDetails?.studentId, location.state?.StudentDetails?.academicYearId || "")
    }
  }, [feeTypesResp])


  useEffect(() => {
    const { prevStudentConcessionById } = StudentConcessionRef.current;
    if (studentConcessionById && studentConcessionById !== prevStudentConcessionById) {
      let feeType = feeTypesResp && feeTypesResp.find((fee: any) => +fee.feeTypeId === +studentConcessionById.feeTypeId)
      const { studentId, studentName, studentCode, totalConcessionAmount, curriculumId, classId, academicYearId, siblingName, siblingId, siblingCode, employeeId, employeeName, employeeCode } = studentConcessionById;
      getCurriculumApiCall({academicYearId})
      HostelConcessionForm.setValues({ ...studentConcessionById, document: studentConcessionById?.fileInfo?.map((i: any) => ({ ...i, name: i?.originalFileName })) });
      const payload1 = { branchId: branchId,academicYearId, curriculumId: curriculumId, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100 };
      dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload1)));
      setSearchStudentState({ studentId: studentId, studentCode: studentCode, studentName: studentName, curriculumId, classId });
      setSelectedFees(studentConcessionById?.studentLedgersIds || [])
      setDocument(studentConcessionById?.fileInfo?.map((i: any) => ({ ...i, name: i?.originalFileName })));

      fetchLedgersDetails(studentId, studentConcessionById?.academicYearId || "")
      if (studentConcessionById?.concessionType === "SIBLING") {
        setSiblingState({ studentId: siblingId, studentCode: siblingCode, studentName: siblingName })
      } else if (studentConcessionById?.concessionType === "EMPLOYEE") {
        setEmployeeState({ employeeId: employeeId, employeeCode: employeeCode, employeeName: employeeName })
      }
    }

    StudentConcessionRef.current.prevStudentConcessionById = studentConcessionById;
  }, [studentConcessionById, feeTypesResp])

  const StudentConcessionRef = useRef({
    prevAddStudentConcession: addStudentConcession,
    prevEditStudentConcession: editStudentConcession,
    prevStudentConcessionById: studentConcessionById,
    prevFeeConcessionErrorState: feeConcessionErrorState
  })

  useEffect(() => {
    const { prevAddStudentConcession, prevEditStudentConcession, prevFeeConcessionErrorState } = StudentConcessionRef.current;
    if (addStudentConcession && addStudentConcession !== prevAddStudentConcession) {
      toast.success('Hostel concession created successfully.');
      history.push("/hostel-concession");
    }
    else if (editStudentConcession && editStudentConcession !== prevEditStudentConcession) {
      toast.success('student concession edited successfully.');
      history.push("/hostel-concession");
    } else if (feeConcessionErrorState && feeConcessionErrorState !== prevFeeConcessionErrorState) {
      const { message, details }: any = feeConcessionErrorState;
      toast.error(message || details || "Something went wrong.");
    }
    StudentConcessionRef.current.prevAddStudentConcession = addStudentConcession;
    StudentConcessionRef.current.prevEditStudentConcession = editStudentConcession;
    StudentConcessionRef.current.prevFeeConcessionErrorState = feeConcessionErrorState;
  }, [addStudentConcession, editStudentConcession, feeConcessionErrorState])

  useEffect(() => {
    dispatch(resetLedgerDetailsAct(undefined));
    return () => {

      dispatch(resetBrchCurriculumAct(undefined));
      dispatch(resetBrchClassAct(undefined));
      setSearchStudentState(null);
      HostelConcessionForm.resetForm();
      dispatch(resetLedgerDetailsAct(undefined));
    }
  }, [])

  const confirmSubmitHndler = () => {
    if (location.state?.id) {
      const formData = new FormData();

      const prevArr = studentConcessionById?.fileInfo
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
      formData.append('request', JSON.stringify(submitConfirmationModal?.payload))
      dispatch(editStudentConcessionAct(generateActionPayload('edit_hostel_concession', { id: location.state?.id }, formData)))
    } else {

      const formData = new FormData();
      document?.map((item: any, index: any) => {
        formData.append(`file`, item);
      })
      formData.append('requestvalue', JSON.stringify(submitConfirmationModal?.payload))
      dispatch(addStudentConcessionAct(generateActionPayload('create_hostel_concession', undefined, formData)))
    }
  }

  const handleFileChange = (files: any) => {
    setDocument(files);
    HostelConcessionForm.setFieldValue('document', files);
  }

  const concessionAmountChangeHandler = (id: any, value: any, oldValue: any) => {

    let totalValue: any = 0;
    const abcd: any = ledgerList.map((ledger: any) => {
      if (+ledger.ledgerId === +id) {
        if ((+value <= (+ledger?.remainingAmount))) {
          totalValue += Math.ceil(+value)
        } else {
          totalValue += Math.ceil(+ledger?.concessionAmount)
        }
        return {
          ...ledger, concessionAmount: (+value <= (+ledger?.remainingAmount)) ? +value : +ledger?.concessionAmount
        }
      } else {
        if (ledger?.isSelected) totalValue += Math.ceil(+ledger.concessionAmount || 0)
      }
      return { ...ledger }
    })

    if (totalValue <= +HostelConcessionForm.values.concessionValue) {
      setCheckTotalConcession(false)
      setGlobalConcessionValue((prev: any) => (+HostelConcessionForm.values.concessionValue - +totalValue))
      setLedgerList(abcd)
      HostelConcessionForm.setFieldValue('totalConcessionAmount', +totalValue);
    } else {
      setCheckTotalConcession(true)
    }
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
          <BreadCrumb
            title="Student Concessions"
            pageTitle="Hostel"
            pageTitleUrl={
              location.state?.fromComponent === "Fee Summary"
                ? "/student-fee-ledger/fee-details"
                : "/student-concessions"
            }
            linkState={{
              studentId: location.state?.StudentDetails?.studentId,
              academicYearId: location.state?.StudentDetails?.academicYearId,
              curriculumId: location.state?.StudentDetails?.curriculumId,
              classId: location.state?.StudentDetails?.classId,
            }}
          />

          <div className="tw-flex tw-justify-center tw-mb-4">
            <div className="tw-w-full tw-bg-white tw-rounded-lg tw-shadow">
              <div className="tw-px-5 tw-py-3 tw-border-b tw-font-bold tw-text-lg">
                {`${location.state?.id ? "Edit" : "Create"} Concession`}
              </div>

              <div className="tw-p-5">
                <div className="tw-grid tw-grid-cols-12 tw-gap-6 tw-border-b tw-border-dashed tw-border-gray-300 tw-pb-6">
                  <div className="tw-col-span-4">
                    <SelectInput
                        name="academicYearId"
                        value={HostelConcessionForm.values.academicYearId}
                        onChange={filterHandler}
                        menuItems={academicYearList || []}
                        valueKey="academicYearId"
                        textKey="academicYearName"
                        defaultSelect="Academic Year"
                        formgroupClassName="tw-mb-2"
                        isDisabled={location.state?.id || location.state?.fromComponent === "Fee Summary"}
                        invalid={
                          HostelConcessionForm.touched.academicYearId &&
                            HostelConcessionForm.errors.academicYearId
                            ? true
                            : false
                        }
                        error={
                          HostelConcessionForm.touched.academicYearId &&
                            HostelConcessionForm.errors.academicYearId
                            ? HostelConcessionForm.errors.academicYearId
                            : ""
                        }
                      />
                      <AutoSearchInputUpdated
                        formgroupClassName="search-box"
                        name="searchString"
                        placeHolder="Search..."
                        onChange={(string: any) => {
                          if (!string) HostelConcessionForm.setFieldValue('studentId', "");
                          onInputSearchChange(string)
                        }}
                        onBlur={HostelConcessionForm.handleBlur}
                        valueKey="studentId"
                        labelHeader="Student Code"
                        labelKey="studentCode"
                        subLabelHeader="Student Name"
                        subLabelKey="studentName"

                        options={StudentList}
                        selected={searchStudentState}
                        selectedOptionCallbck={selectedStudent}
                        isDisabled={location.state?.id || location.state?.fromComponent === "Fee Summary"}
                        invalid={
                          HostelConcessionForm.touched.studentId &&
                            HostelConcessionForm.errors.studentId
                            ? true
                            : false
                        }
                        error={
                          HostelConcessionForm.touched.studentId &&
                            HostelConcessionForm.errors.studentId
                            ? HostelConcessionForm.errors.studentId
                            : ""
                        }
                      ><i className="ri-search-line search-icon"></i></AutoSearchInputUpdated>
                      <SelectInput
                        name="curriculumId"
                        value={HostelConcessionForm.values.curriculumId}
                        onChange={filterHandler}
                        menuItems={curriculumTypes || []}
                        valueKey="branchCurriculumId"
                        textKey="curriculumName"
                        defaultSelect="Curriculum"
                        formgroupClassName="tw-my-2"
                        isDisabled={true}
                        invalid={
                          HostelConcessionForm.touched.curriculumId &&
                            HostelConcessionForm.errors.curriculumId
                            ? true
                            : false
                        }
                        error={
                          HostelConcessionForm.touched.curriculumId &&
                            HostelConcessionForm.errors.curriculumId
                            ? HostelConcessionForm.errors.curriculumId
                            : ""
                        }
                      />
                      <SelectInput
                        name="classId"
                        value={HostelConcessionForm.values.classId}
                        onChange={filterHandler}
                        menuItems={classTypes || []}
                        valueKey="id"
                        textKey="shortName"
                        defaultSelect="Class"
                        formgroupClassName="tw-mb-2"
                        isDisabled={true}
                        invalid={
                          HostelConcessionForm.touched.classId &&
                            HostelConcessionForm.errors.classId
                            ? true
                            : false
                        }
                        error={
                          HostelConcessionForm.touched.classId &&
                            HostelConcessionForm.errors.classId
                            ? HostelConcessionForm.errors.classId
                            : ""
                        }
                      />
                  </div>

                  <div className="tw-col-span-4 tw-col-start-9">
                    <SelectInput
                        name="concessionMode"
                        labelText="Concession"
                        value={HostelConcessionForm.values.concessionMode}
                        onChange={filterHandler}
                        menuItems={concessionMode}
                        valueKey="concessionModeType"
                        textKey="concessionMode"
                        labelClass="required"
                        formgroupClassName="tw-mb-1"
                        invalid={
                          HostelConcessionForm.touched.concessionMode &&
                            HostelConcessionForm.errors.concessionMode
                            ? true
                            : false
                        }
                        error={
                          HostelConcessionForm.touched.concessionMode &&
                            HostelConcessionForm.errors.concessionMode
                            ? HostelConcessionForm.errors.concessionMode
                            : ""
                        }
                      />
                      <TextInputGroup
                        name="concessionValue"
                        value={HostelConcessionForm.values.concessionValue}
                        onChange={filterHandler}
                        inputGroupStart={true}
                        allowedInputRegex="^[0-9]*$"
                        groupClassName="2.3rem"

                        labelClass="tw-text-garay-600"
                        invalid={
                          HostelConcessionForm.touched.concessionValue &&
                            HostelConcessionForm.errors.concessionValue
                            ? true
                            : false
                        }
                        error={
                          HostelConcessionForm.touched.concessionValue &&
                            HostelConcessionForm.errors.concessionValue
                            ? HostelConcessionForm.errors.concessionValue
                            : ""
                        }

                      >
                        <i className="tw-p-2">{HostelConcessionForm.values.concessionMode === "AMOUNT" ? "₹" : "%"}</i>
                      </TextInputGroup>
                  </div>
                </div>

                <div className="tw-mt-6 tw-border-b tw-border-dashed tw-border-gray-300 tw-pb-6">
                  <TableContainer
                    columns={roleColumns || []}
                    data={Array.isArray(ledgerList) ? ledgerList : []}
                    divClass="tw-overflow-x-auto"
                    theadClass="tw-bg-gray-100 tw-text-gray-500"
                    rowDataInfo={{
                      ...HostelConcessionForm.values,
                      globalConcessionValue,
                    }}
                    onChangeInputHndlr={concessionAmountChangeHandler}
                  />

                  <span className="tw-text-red-600 tw-pl-4">
                    {HostelConcessionForm.errors.isNoFeeSelected
                      ? String(HostelConcessionForm.errors.isNoFeeSelected)
                      : ""}</span>
                    <span className="text-danger ps-4">{checkTotalConcession ? "* Your Concession Amount should not be greater than total Concession Amount" : ""}</span>
                  </div>

                <div className="tw-p-4">
                  <div className="tw-w-5/12 tw-ml-auto">
                    <div className="tw-flex tw-items-center tw-justify-between tw-mb-4">
                      <label className="tw-w-4/12 tw-m-0 tw-font-medium">
                        Concession Type <span className="tw-text-red-600">*</span>
                      </label>

                      <SelectInput
                        name="concessionType"
                        value={HostelConcessionForm.values.concessionType}
                        onChange={HostelConcessionForm.handleChange}
                        menuItems={concessionType}
                        valueKey="concessionType"
                        textKey="concessionType"
                        isDisabled={location.state?.id && true}
                        formgroupClassName="tw-w-6/12"
                        invalid={
                          HostelConcessionForm.touched.concessionType &&
                            HostelConcessionForm.errors.concessionType
                            ? true
                            : false
                        }
                        error={
                          HostelConcessionForm.touched.concessionType &&
                            HostelConcessionForm.errors.concessionType
                            ? HostelConcessionForm.errors.concessionType
                            : ""
                        }
                      />
                    </div>
                    {HostelConcessionForm.values.concessionType === "SIBLING" && (
                      <div className="tw-flex tw-justify-between tw-items-center tw-mb-4">
                        <label className="tw-w-4/12 tw-m-0 tw-font-medium">
                          Sibling <span className="tw-text-red-600">*</span>
                        </label>

                        <AutoSearchInputUpdated
                          formgroupClassName="search-box tw-w-6/12"
                          name="siblingId"
                          placeHolder="Search..."
                          onChange={(string: any) => {
                            if (!string) HostelConcessionForm.setFieldValue('siblingId', "");
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
                          onBlur={HostelConcessionForm.handleBlur}
                          invalid={
                            HostelConcessionForm.touched.siblingId &&
                              HostelConcessionForm.errors.siblingId
                              ? true
                              : false
                          }
                          error={
                            HostelConcessionForm.touched.siblingId &&
                              HostelConcessionForm.errors.siblingId
                              ? HostelConcessionForm.errors.siblingId
                              : ""
                          }
                        ><i className="ri-search-line search-icon"></i></AutoSearchInputUpdated>
                      </div>)}

                    {HostelConcessionForm.values.concessionType === "EMPLOYEE" && (
                      <div className="tw-flex tw-justify-between tw-items-center tw-mb-4">
                        <label className="tw-w-4/12 tw-m-0 tw-font-medium">
                          Employee <span className="tw-text-red-600">*</span>
                        </label>

                        <AutoSearchInputUpdated
                          formgroupClassName="search-box tw-w-6/12"
                          name="employeeId"
                          placeHolder="Search..."
                          onChange={(string: any) => {
                            if (!string) HostelConcessionForm.setFieldValue('employeeId', "");
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
                            HostelConcessionForm.touched.employeeId &&
                              HostelConcessionForm.errors.employeeId
                              ? true
                              : false
                          }
                          error={
                            HostelConcessionForm.touched.employeeId &&
                              HostelConcessionForm.errors.employeeId
                              ? HostelConcessionForm.errors.employeeId
                              : ""
                          }
                        // isDisabled={location.state?.concessionId}
                        // isDisabled={location.state?.id}
                        ><i className="ri-search-line search-icon"></i></AutoSearchInputUpdated>
                      </div>
                    )}
                    <div className="tw-flex tw-justify-between tw-items-center tw-mb-4">
                      <label className="tw-w-4/12 tw-m-0">
                        Total Concession Amount
                      </label>
                        <TextIconInput
                          name="totalConcessionAmount"
                          // labelText="Work Email"
                          value={HostelConcessionForm.values.totalConcessionAmount}
                          onChange={HostelConcessionForm.handleChange}
                          onBlur={HostelConcessionForm.handleBlur}
                          // isReadOnly={!edit}
                          formgroupClassName="tw-w-6/12"
                          // inputClassName={''}
                          // invalid={
                          //     employeeCurrentJobForm.touched.workEmailId &&
                          //         employeeCurrentJobForm.errors.workEmailId
                          //         ? true
                          //         : false
                          // }
                          // error={
                          //     employeeCurrentJobForm.touched.workEmailId &&
                          //         employeeCurrentJobForm.errors.workEmailId
                          //         ? employeeCurrentJobForm.errors.workEmailId
                          //         : ""
                          // }
                          labelClass="text-muted"
                          isDisabled={true}
                        >
                          <i style={{ fontSize: "19px" }}>₹</i>
                        </TextIconInput>
                    </div>

                    <div className="tw-flex tw-justify-between tw-mb-4">
                      <label className="tw-w-4/12 tw-m-0 tw-font-medium">
                        Remarks <span className="tw-text-red-500">*</span>
                      </label>

                      <TextArea
                        name="remarks"
                        value={HostelConcessionForm.values.remarks}
                        onChange={HostelConcessionForm.handleChange}
                        formgroupClassName="tw-w-6/12"
                        invalid={
                          HostelConcessionForm.touched.remarks &&
                            HostelConcessionForm.errors.remarks
                            ? true
                            : false
                        }
                        error={
                          HostelConcessionForm.touched.remarks &&
                            HostelConcessionForm.errors.remarks
                            ? HostelConcessionForm.errors.remarks
                            : ""
                        }
                      />
                    </div>

                    {/* Document */}
                    <div className="tw-flex tw-justify-between">
                      <label className="tw-w-4/12 tw-m-0 tw-font-medium ">
                        Document <span className="tw-text-red-500">*</span>
                      </label>

                      <MultipleFileUpload
                        name="document"
                        prevFiles={document}
                        onChange={handleFileChange}
                        containerClass="tw-w-6/12"
                        maxSizeInMb={2}
                        helperText="Note : Max File Size is 2MB"
                        error={
                          HostelConcessionForm.touched.document &&
                            HostelConcessionForm.errors.document
                            ? HostelConcessionForm.errors.document
                            : ""
                        }
                      />
                    </div>
                  </div>
                </div>

                  <div className="tw-flex tw-justify-end tw-gap-3 tw-mt-6">
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
                    onClick={(e: any) => HostelConcessionForm.handleSubmit(e)}
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
        isOpen={studentConcessionModal.showModal}
        toggle={toggleStudentConcessionModal}
        modalTitle="Previous Concession"
        modalSize="xl"
      >
        <StudentConcessionModal
          dispatch={dispatch}
          branchId={branchId}
          concessionDetails={HostelConcessionForm.values}
        />
      </ModalContainerUpdated> */}
      <ConfirmationModal
        id="student-concession-create-modal"
        isOpen={submitConfirmationModal.showModal}
        confirmMessage={`You want to ${location.state?.id ? "Update" : "Create"} this concession ?`}
        cancelHndlr={() => toggleSubmitConfirmationModal()}
        confirmHndlr={confirmSubmitHndler}
        isDisble={showApiLoader}
        showImgIcon={true}
        iconType="approve"
        btnClassName='btn w-sm btn-success'
      />
      <ModalContainerUpdated
        id="student-concession-check-modal"
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

export default HostelConcessionPage;

