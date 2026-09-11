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
} from "../../../../Components/Common";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import {
  concessionMode,
  concessionType,
  checkDisablePreviousBtn,
  generateColumns,
} from "./helper";
import { NewStudentConcessionDataTypes } from "./studentConcessionTypes";
import TableContainer from "../../../../Components/Common/TableContainer";
import { IStudentConcessionModal } from "../studentConcessionsTypes";
import StudentConcessionModal from "./StudentConcessionModal";
import { useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual, useDispatch } from "react-redux";
import { getInstAcademicYearAct } from "../../../../store/mastersettings/instacademics/instacademicactions";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { getBranchClassAct, getBranchCurriculumAct, resetBrchClassAct, resetBrchCurriculumAct, setBrchClassAct } from "../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { getEmployeeByFilterAct } from "../../../../store/directory/employeemanagement/employeemanagementactions";
import { getStudentByFilterAct, getStudentsListAct } from "../../../../store/directory/studentmanagement/studentmanagementactions";
import { getLedgerDetailsAct, resetLedgerDetailsAct } from "../../../../store/fee/feecollections/feecollectionactions";
import { getAmountValueWithDecimal, percentageConverter, valueConverter } from "../../../../utility/commonutility";
import { addStudentConcessionAct, editStudentConcessionAct, getStudentConcessionById } from "../../../../store/fee/feeconcessions/feeconcessionactions";
import { useHistory, useLocation } from "react-router-dom";
import { getFeeTypesAct } from "../../../../store/modulesettings/masterfeesettings/masterfeesettingsactions";
import * as Yup from 'yup';
import { toast } from "react-toastify";
import CheckConcessionModal from "./CheckConcessionModal";
import { getSiblingForRegistrationAct } from "../../../../store/FrontDesk/AdmissionRegistration/admissionregistrationaction";


const initialValues: NewStudentConcessionDataTypes = {
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
    // receiptFor: Yup.string().required("Select receipt for."),
    feeTypeId: Yup.string().required('Select Fee Type.').nullable(),
    concessionMode: Yup.string().required("Select Concession Mode").nullable(),
    concessionValue: Yup.number().min(0, 'Concession should be more than 0').required("Enter Concession Value.").when('concessionMode', {
      is: (item: any) => item === "PERCENTAGE",
      then: Yup.number().max(100, 'Concession should be less than 100').min(0, 'Concession should be more than 0').nullable(),
      otherwise: Yup.number().nullable()
    }),
    concessionType: Yup.string().required("Select Concession Type").nullable(),
    // classId: Yup.string().required("Select class.").nullable(),
    // curriculumId: Yup.string().required("Select curriculum.").nullable(),
    // academicYearId: Yup.string().required("Select academic year."),
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

const StudentConcessionPage = () => {

  const dispatch = useDispatch();
  const location: any = useLocation();
  const history: any = useHistory();
  const [newStudentConcessionDataState, setNewStudentConcessionDataState] =
    useState<NewStudentConcessionDataTypes>(initialValues);
  const [document, setDocument] = useState<any>([]);
  const [ledgerList, setLedgerList] = useState([]);
  const [allFeeSelectedState, setAllFeeSelectedState] = useState(false);
  const [searchStudentState, setSearchStudentState] = useState<any>(null);
  const [siblingState, setSiblingState] = useState<any>(null);
  const [employeeState, setEmployeeState] = useState<any>(null);
  const [checkTotalConcession, setCheckTotalConcession] = useState(false);
  const [availableStudentState, setAvailableStudentState] = useState([]);
  const [globalConcessionValue, setGlobalConcessionValue] = useState<any>(0);
  const [totalConcessionAmount, setTotalConcessionAmount] = useState<any>(0);
  const [selectedFees, setSelectedFees] = useState<any>([]);

  const [submitConfirmationModal, setSubmitConfirmationModal] =
    useState<any>({
      showModal: false,
      payload: null,
    });
  const [checkConcessionModal, setCheckConcessionModal] =
    useState<any>({
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

  const studentConcessionForm = useFormik({
    enableReinitialize: true,
    initialValues: newStudentConcessionDataState,
    validationSchema,
    onSubmit: (values) => {
      let selectedStudents: any = [];
      let payload = {};
      ledgerList.map((stu: any) => {
        if (stu?.isSelected) {
          selectedStudents.push({
            studentLedgerId: stu.id,
            // concessionValueInPerc: getAmountValueWithDecimal(percentageConverter(stu.amountToPay, values.concessionMode, stu.concessionAmount)),
            // concessionAmount: +stu?.concessionAmount || 0
            concessionValueInPerc: getAmountValueWithDecimal(percentageConverter(stu.amountToPay, values?.concessionMode, values?.concessionMode === "AMOUNT" ? (stu?.concessionAmount || 0) : values?.concessionValue)),
            concessionAmount: valueConverter((+stu.remainingAmount), values?.concessionMode, values?.concessionMode === "AMOUNT" ? (+stu?.concessionAmount || 0) : +values?.concessionValue) || 0
            // concessionValueInPerc: percentageConverter(stu.amountToPay, values.concessionMode, stu?.concessionAmount || 0),
            // concessionAmount: +stu?.concessionAmount || valueConverter(stu.amountToPay, values.concessionMode, +stu?.concessionAmount || 0)
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
          studentConcessionForm.setFieldError('isNoFeeSelected', "*Select At least One Fee")
        }
      }
      else {
        payload = {
          studentConcessionDTO: {
            classId: values.classId,
            curriculumId: values.curriculumId,
            studentId: searchStudentState.studentId,
            siblingId: siblingState?.studentId || "",
            employeeId: employeeState?.id || "",
            feeTypeId: values.feeTypeId,
            concessionMode: values.concessionMode,
            concessionValue: values.concessionValue
          },
          studentConcessionFeeDetailsDTOs: selectedStudents,
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
  }: any = useAppSelector(
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

  const typesListData = useMemo(() => {
    if (Array.isArray(feeTypesResp)) {
      feeTypesResp?.map((item: any) => {
        if (item.feeType === "TERM") {
          studentConcessionForm.setValues((prev: any) => ({ ...prev, feeTypeId: item?.feeTypeId }))
        }
      })
      return feeTypesResp.filter(item => item.feeType === "MONTH" || item.feeType === "TERM");
    }
    return [];
  }, [feeTypesResp]);
  const selectAllFeeHndlr = useCallback((event: any) => {
    const { checked } = event.target;
    // if (checked) {
    //   let total = 0;
    //   ledgerList.map((ledger: any) => {
    //     if (+ledger.amountToPay >= +studentConcessionForm.values.concessionValue) {
    //       total = +total + +valueConverter(ledger?.amountToPay, studentConcessionForm.values.concessionMode, studentConcessionForm.values.concessionMode === "AMOUNT" ? ledger?.concessionAmount : studentConcessionForm.values.concessionValue);
    //     }
    //   })

    //   studentConcessionForm.setFieldValue('totalConcessionAmount', total);
    // }
    // else {
    //   studentConcessionForm.setFieldValue('totalConcessionAmount', 0);
    // }
    setAllFeeSelectedState(checked);
    const updateSearchStudentListState: any = [...ledgerList];
    const updatedAvailableStudentState: any = [...availableStudentState];

    const modifiedStudentId: any = [];
    updateSearchStudentListState.forEach((item: any) => {
      let { concessionMode, concessionValue } = studentConcessionForm.values;
      if ((concessionMode === "AMOUNT") || (concessionMode === "PERCENTAGE" && +concessionValue <= 100)) {
        if (!item?.isSelected) { item.concessionAmount = 0 }
        item.isSelected = checked;
        modifiedStudentId.push(item.id);
      }
    });

    updatedAvailableStudentState.forEach((item: any) => {
      let { concessionMode, concessionValue } = studentConcessionForm.values;
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
    let totalValue = +studentConcessionForm.values.concessionValue - +value
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
        if (studentConcessionForm.values.concessionMode === "AMOUNT") {
          globalConcession = +globalConcession + +valueConverter((i?.remainingAmount), studentConcessionForm.values.concessionMode, i?.concessionAmount || 0)
        } else {
          globalConcession = +globalConcession + +valueConverter((i?.remainingAmount), studentConcessionForm.values.concessionMode, studentConcessionForm.values.concessionValue || 0)
        }
      }
    })

    setGlobalConcessionValue(+studentConcessionForm.values.concessionValue - +globalConcession)
    studentConcessionForm.setFieldValue('totalConcessionAmount', +globalConcession);
    setLedgerList(newList);
    setCheckTotalConcession(false)
    setAvailableStudentState(updatedAvailableStudentState);
    // updateSelectedAllHndlr(updatedAvailableStudentState);
  }, [ledgerList, availableStudentState]);

  const studentCheckHndlr = useCallback((event: any) => {
    const { name, value, checked } = event.currentTarget,
      studentId = event.currentTarget.getAttribute("data-id"),
      studentIndex = availableStudentState.findIndex((item: any) => item.id === Number(studentId)),
      studentIndexInSearchedStudent = ledgerList.findIndex((item: any) => item.id === Number(studentId)),
      student: any = ledgerList.find((item: any) => item.id === Number(studentId))
    let updatedLegder: any = ledgerList;
    let globalValue: any = globalConcessionValue;

    if (student?.isSelected) {
      let totalConcession: any = +studentConcessionForm.values.totalConcessionAmount;
      if (studentConcessionForm.values.concessionMode === "PERCENTAGE") {
        totalConcession -= +valueConverter(student?.amountToPay, studentConcessionForm.values.concessionMode, studentConcessionForm.values.concessionValue)
      } else {
        totalConcession -= (student?.concessionAmount || 0)
      }
      studentConcessionForm.setFieldValue('totalConcessionAmount', totalConcession);
      setGlobalConcessionValue((prev: any) => (+prev + (student?.concessionAmount || 0)))
    }
    else {
      if (!(studentConcessionForm.values.concessionMode === "PERCENTAGE")) {
        updatedLegder = updatedLegder?.map((i: any) => {
          if (+i?.id === +studentId) {

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
          if (studentConcessionForm.values.concessionMode === "PERCENTAGE") {
            totalValue = +totalValue + +valueConverter((+ledger?.remainingAmount), studentConcessionForm.values.concessionMode, +studentConcessionForm.values.concessionValue)
          } else {
            totalValue += (+ledger.concessionAmount || 0)
          }
        }
      })
      globalValue = +studentConcessionForm.values.concessionValue - +totalValue
      setGlobalConcessionValue(globalValue)

      // setMinimumNetAmount(minimum);
      studentConcessionForm.setFieldValue('totalConcessionAmount', +totalValue);
      studentConcessionForm.setFieldValue('minimumNetAmount', minimum);
      setCheckTotalConcession(false)
      setAvailableStudentState(updatedAvailableStudentState);
      setLedgerList(updatedSearchStudentState);
      updateSelectedAllHndlr(updatedSearchStudentState);
    }
  }, [ledgerList, studentConcessionForm.values.concessionMode, studentConcessionForm.values.concessionValue]);

  const roleColumns = useMemo(() => generateColumns(studentConcessionForm.values.concessionMode, studentConcessionForm.values.concessionValue, allFeeSelectedState,
    selectAllFeeHndlr, studentCheckHndlr, globalConcessionValue), [studentConcessionForm, globalConcessionValue, ledgerList]);
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

  useEffect(() => {
    const payload = { instituteId: instituteId, pageNo: 0, pageSize: 100, sortBy: "academicYearName", orderBy: "desc" };
    dispatch(
      getInstAcademicYearAct(
        generateActionPayload("get_inst_academic_year", undefined, payload)
      )
    );
    const payload1 = { branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" };
    dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));

    const params = { instituteId: instituteId };
    dispatch(getFeeTypesAct(generateActionPayload('get_fee_types', undefined, params)))
    return () => {
      dispatch(resetBrchClassAct(undefined));
    }
  }, []);

  useEffect(() => {
    let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus === "CURRENT")?.academicYearId
    // academicsFilterForm.setValues((prev:any)=>({...prev,masterAcademicYearId:yearId}))
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
      const payload = { branchId: branchId, curriculumId: value, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100 };
      dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
      // studentConcessionForm.setFieldValue('studentId')

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
      // studentConcessionForm.setFieldValue('totalConcessionAmount', 0);
      // studentConcessionForm.setFieldValue('minimumNetAmount',999999999999999);
    }
    else if (name === "concessionValue") {


      let totalValue = event.target.value;
      let newled: any;
      if (studentConcessionForm.values.concessionMode === "AMOUNT") {
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
          totalConcession += (+ledger.concessionAmount || 0)
        }
      })
      let globalValue = event.target.value - +totalConcession

      // setMinimumNetAmount(minimum);
      studentConcessionForm.setFieldValue('totalConcessionAmount', +totalConcession);

      setGlobalConcessionValue(globalValue)
      setLedgerList(newled);
      updateSelectedAllHndlr(newled)
      // studentConcessionForm.setFieldValue('totalConcessionAmount', 0);
      studentConcessionForm.setFieldValue('minimumNetAmount', 999999999999999);
      // studentConcessionForm.setFieldValue('totalConcessionAmount',total);
      // setTotalConcessionAmount(total);
    }
    else if (name === 'feeTypeId') {
      let feeType = feeTypesResp && feeTypesResp.find((fee: any) => +fee.feeTypeId === +value);
      let payload = {
        studentId: searchStudentState?.studentId,
        instituteId,
        branchId: branchId,
        academicYearId: studentConcessionForm.values.academicYearId,
        studentInfo: "studentInfo",
        allowStudentConcession: "YES",
        allowEmployeeConcession: "",
        allowRefund: "",
        feeType: [`${feeType.feeType}`],
        // instituteDeptId: [1],
        instituteDeptNames: ["ACADEMICS"],
        paymentStatus: ""
      }
      dispatch(getLedgerDetailsAct(generateActionPayload('ledger_details', undefined, payload)));
    } else if (name === 'classId') {
      setLedgerList([]);
      studentConcessionForm.setValues(prevValues => ({
        ...prevValues,
        feeTypeId: '', studentId: '', concessionMode: '',
        concessionType: '',
        concessionValue: '', [name]: value
      }));
      setSearchStudentState({});
    }
  }
  function onInputSearchChange(inputString: any) {
    const { academicYearId, curriculumId, classId } = studentConcessionForm.values;
    if (inputString && academicYearId) {

      // const params = { searchString: inputString };
      // dispatch(getEmployeeByFilterAct(generateActionPayload("get_employee_by_name", params, { branchId })));
      const params = {
        branchId, academicYearId,
        // classId: classId,
        // curriculumId: curriculumId, 
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
    const newpayload = { branchId: branchId, curriculumId: student?.curriculumId, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100 };
    dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, newpayload)));

    setLedgerList([]);
    if (!student) {
      studentConcessionForm.setValues(prevValue => ({
        ...prevValue, studentId: '',
        feeTypeId: prevValue?.feeTypeId, concessionMode: '', concessionValue: ''
      }));
    } else {
      studentConcessionForm.setFieldValue('studentId', student?.studentId);
    }

    let feeType = feeTypesResp && feeTypesResp.find((fee: any) => +fee.feeTypeId === +studentConcessionForm.values.feeTypeId);
    let payload = {
      studentId: student?.studentId,
      instituteId,
      branchId: branchId,
      academicYearId: studentConcessionForm.values.academicYearId,
      studentInfo: "studentInfo",
      allowStudentConcession: "YES",
      allowEmployeeConcession: "",
      allowRefund: "",
      feeType: [`${feeType.feeType}`],
      // instituteDeptId: [1],
      instituteDeptNames: ["ACADEMICS"],
      paymentStatus: ""
    }
    dispatch(getLedgerDetailsAct(generateActionPayload('ledger_details', undefined, payload)));
  }

  useEffect(() => {
    if (branchClassResp && searchStudentState) {

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
    history.push("/student-concessions");
  }

  useEffect(() => {
    if (ledgerDetails) {
      let ledgerValue: any = studentConcessionById && location.state?.id ? +studentConcessionById?.concessionValue : 0
      let updatedLedgers = (((studentConcessionById && location.state?.id) ? studentConcessionById?.studentConcessionChildDTO : ledgerDetails.ledgers) || []).map((ledger: any) => {
        if (selectedFees.includes(+ledger.id)) {
          if (studentConcessionById && location.state?.id) {
            ledgerValue = +ledgerValue - (+ledger?.studentConcessionAmount || 0)
          } else {
            ledgerValue = +ledgerValue + (+ledger?.studentConcessionAmount || 0)
          }
          return { ...ledger, isSelected: selectedFees.includes(+ledger.id) ? true : false, concessionAmount: +ledger?.studentConcessionAmount || 0, remainingAmount: (studentConcessionById && location.state?.id) ? +ledger?.concessionAllocatedAmount : ((+ledger?.amountToPay - +ledger?.studentConcessionAmount) || 0) }
        } else {
          return { ...ledger, isSelected: false, concessionAmount: +ledger?.studentConcessionAmount || 0, remainingAmount: (+ledger?.amountToPay - (+ledger?.studentConcessionAmount + +ledger?.employeeConcessionAmount)) || 0 }
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

  // useEffect(() => {
  //   if (ledgerDetails) {
  //     let updatedLedgers=ledgerDetails.ledgers.map((ledger:any)=>({...ledger,isSelected:selectedLedgerIds.includes(ledger.id)?true:false}))
  //     setLedgerList(updatedLedgers);
  //     setAvailableStudentState(updatedLedgers);
  //     updateSelectedAllHndlr(updatedLedgers);
  //   }
  // }, [ledgerDetails,selectedLedgerIds])

  useEffect(() => {
    if (location.state?.id && location.state?.fromComponent === 'Student Concession') {
      dispatch(getStudentConcessionById(generateActionPayload('student_concession_by_id', { id: location.state?.id })))
    }
    else if (location.state?.fromComponent === "Fee Summary") {
      const payload = { branchId: branchId, curriculumId: location.state?.StudentDetails?.studentAcademicDetails?.curriculumId, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100 };
      dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
      setNewStudentConcessionDataState((prev: any) => ({
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
      let feeType = feeTypesResp && feeTypesResp.find((fee: any) => fee.feeType === "TERM");
      let newpayload = {
        studentId: location.state?.StudentDetails?.studentDetails?.id,
        instituteId,
        branchId: branchId,
        academicYearId: location.state?.StudentDetails?.academicYearId || "",
        studentInfo: "studentInfo",
        allowStudentConcession: "",
        allowEmployeeConcession: "",
        allowRefund: "",
        feeType: [`${feeType?.feeType}`],
        // instituteDeptId: [1],
        instituteDeptNames: ["ACADEMICS"],
        paymentStatus: ""
      }
      dispatch(getLedgerDetailsAct(generateActionPayload('ledger_details', undefined, newpayload)));
    }
  }, [feeTypesResp])


  useEffect(() => {
    const { prevStudentConcessionById } = StudentConcessionRef.current;
    if (studentConcessionById && studentConcessionById !== prevStudentConcessionById) {
      let feeType = feeTypesResp && feeTypesResp.find((fee: any) => +fee.feeTypeId === +studentConcessionById.feeTypeId)
      const { studentId, studentName, studentCode, totalConcessionAmount, curriculumId, classId, academicYearId, siblingName, siblingId, siblingCode, employeeId, employeeName, employeeCode } = studentConcessionById;
      setNewStudentConcessionDataState({ ...studentConcessionById, document: studentConcessionById?.fileInfo?.map((i: any) => ({ ...i, name: i?.originalFileName })) });
      const payload1 = { branchId: branchId, curriculumId: curriculumId, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100 };
      dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload1)));
      setSearchStudentState({ studentId: studentId, studentCode: studentCode, studentName: studentName, curriculumId, classId });
      setSelectedFees(studentConcessionById?.studentLedgersIds || [])
      // setTotalConcessionAmount(totalConcessionAmount);
      setDocument(studentConcessionById?.fileInfo?.map((i: any) => ({ ...i, name: i?.originalFileName })));
      let payload = {
        studentId: studentId,
        instituteId,
        branchId: branchId,
        academicYearId: studentConcessionById?.academicYearId || "",
        studentInfo: "studentInfo",
        allowStudentConcession: "",
        allowEmployeeConcession: "",
        allowRefund: "",
        feeType: [`${feeType?.feeType}`],
        // instituteDeptId: [1],
        instituteDeptNames: ["ACADEMICS"],
        paymentStatus: ""
      }
      dispatch(getLedgerDetailsAct(generateActionPayload('ledger_details', undefined, payload)));
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
      toast.success('student concession created successfully.');
      history.push("/student-concessions");
    }
    else if (editStudentConcession && editStudentConcession !== prevEditStudentConcession) {
      toast.success('student concession edited successfully.');
      history.push("/student-concessions");
    } else if (feeConcessionErrorState && feeConcessionErrorState !== prevFeeConcessionErrorState) {
      const { message, details }: any = feeConcessionErrorState;
      toast.error(message || details || "Something went wrong.");
    }
    StudentConcessionRef.current.prevAddStudentConcession = addStudentConcession;
    StudentConcessionRef.current.prevEditStudentConcession = editStudentConcession;
    StudentConcessionRef.current.prevFeeConcessionErrorState = feeConcessionErrorState;
  }, [addStudentConcession, editStudentConcession, feeConcessionErrorState])

  useEffect(() => {
    // setLedgerList([]);
    dispatch(resetLedgerDetailsAct(undefined));
    return () => {

      dispatch(resetBrchCurriculumAct(undefined));
      dispatch(resetBrchClassAct(undefined));
      setSearchStudentState(null);
      // setNewStudentConcessionDataState((prev: any) => ({ ...prev, curriculumId: "", classId: "" }));
      studentConcessionForm.resetForm();
      dispatch(resetLedgerDetailsAct(undefined));
    }
  }, [])

  const confirmSubmitHndler = () => {
    if (location.state.id) {
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
      dispatch(editStudentConcessionAct(generateActionPayload('edit_student_concession', { studentLedgerId: location.state?.id }, formData)))
    } else {

      const formData = new FormData();
      document?.map((item: any, index: any) => {
        formData.append(`file`, item);
      })
      formData.append('requestvalue', JSON.stringify(submitConfirmationModal?.payload))
      dispatch(addStudentConcessionAct(generateActionPayload('add_new_student_concession', { branchId: branchId, instituteId: instituteId, academicYearId: studentConcessionForm.values.academicYearId }, formData)))
    }
  }

  const handleFileChange = (files: any) => {
    setDocument(files);
    studentConcessionForm.setFieldValue('document', files);
  }

  const concessionAmountChangeHandler = (id: any, value: any, oldValue: any) => {

    let totalValue: any = 0;
    const abcd: any = ledgerList.map((ledger: any) => {
      if (+ledger.id === +id) {
        if ((+value <= (+ledger?.remainingAmount))) {
          totalValue += +value
        } else {
          totalValue += +ledger?.concessionAmount
        }
        return {
          ...ledger, concessionAmount: (+value <= (+ledger?.remainingAmount)) ? +value : +ledger?.concessionAmount
        }
      } else {
        if (ledger?.isSelected) totalValue += (+ledger.concessionAmount || 0)
      }
      return { ...ledger }
    })

    if (totalValue <= +studentConcessionForm.values.concessionValue) {
      setCheckTotalConcession(false)
      setGlobalConcessionValue((prev: any) => (+studentConcessionForm.values.concessionValue - +totalValue))
      setLedgerList(abcd)
      studentConcessionForm.setFieldValue('totalConcessionAmount', +totalValue);
    } else {
      setCheckTotalConcession(true)
    }
    // let totalConcession: any = +studentConcessionForm.values.totalConcessionAmount;
    //  totalConcession = totalConcession - +oldValue + +value;
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
          <BreadCrumb title="Student Concessions" pageTitle="Fee" pageTitleUrl={location.state?.fromComponent === "Fee Summary" ? "/student-fee-ledger/fee-details" : "/student-concessions"} linkState={{ studentId: location.state?.StudentDetails?.studentDetails?.id, academicYearId: location.state?.StudentDetails?.academicYearId, curriculumId: location.state?.StudentDetails?.studentAcademicDetails?.curriculumId, classId: location.state?.StudentDetails?.studentAcademicDetails?.classId }} />
          {/* <BackButtonText title="<< Back to Student Concessions List" link="/student-fee-ledger/fee-details" otherDetails={{studentId:location.state?.StudentDetails?.studentDetails.id,academicYearId:location.state?.StudentDetails?.academicYearId,curriculumId:location.state?.StudentDetails?.studentAcademicDetails.curriculumId,classId:location.state?.StudentDetails?.studentAcademicDetails.classId}}/> */}
          <div className="d-flex justify-content-center">
            <div className="card w-100">
              <div className="card-header fw-bold fs-18">{`${location.state?.id ? 'Edit' : 'Create'} Conncession`}</div>
              <div className="card-body">
                <div className="inline-block w-100">
                  {/* <form onSubmit={studentConcessionForm.handleSubmit}> */}
                  <div className="row" style={{ borderBottom: '1px dashed #C9CBCE' }}>
                    <div className="col-4">
                      {/* <div className="row"> */}
                      <SelectInput
                        name="academicYearId"
                        // labelText="Academic Year"
                        value={studentConcessionForm.values.academicYearId}
                        onChange={filterHandler}
                        menuItems={academicYearList || []}
                        valueKey="academicYearId"
                        textKey="academicYearName"
                        defaultSelect="Academic Year"
                        formgroupClassName="mb-2"
                        isDisabled={location.state?.id || location.state?.fromComponent === "Fee Summary"}
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
                      // inputClassName="border-0"
                      />
                      <AutoSearchInputUpdated
                        formgroupClassName="search-box"
                        name="searchString"
                        placeHolder="Search..."
                        // onChange={(e: any) => setSearchInputState(e.target.value)}
                        onChange={(string: any) => {
                          if (!string) studentConcessionForm.setFieldValue('studentId', "");
                          onInputSearchChange(string)
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
                        isDisabled={location.state?.id || location.state?.fromComponent === "Fee Summary"}
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
                      ><i className="ri-search-line search-icon"></i></AutoSearchInputUpdated>
                      <SelectInput
                        name="curriculumId"
                        // labelText="Curriculum"
                        value={studentConcessionForm.values.curriculumId}
                        onChange={filterHandler}
                        menuItems={curriculumTypes || []}
                        valueKey="branchCurriculumId"
                        textKey="curriculumName"
                        defaultSelect="Curriculum"
                        formgroupClassName="my-2"
                        // isDisabled={location.state?.id || location.state?.fromComponent === "Fee Summary"}
                        isDisabled={true}
                        invalid={
                          studentConcessionForm.touched.curriculumId &&
                            studentConcessionForm.errors.curriculumId
                            ? true
                            : false
                        }
                        error={
                          studentConcessionForm.touched.curriculumId &&
                            studentConcessionForm.errors.curriculumId
                            ? studentConcessionForm.errors.curriculumId
                            : ""
                        }
                      />
                      <SelectInput
                        name="classId"
                        // labelText="Class"
                        value={studentConcessionForm.values.classId}
                        onChange={filterHandler}
                        menuItems={classTypes || []}
                        valueKey="id"
                        textKey="shortName"
                        defaultSelect="Class"
                        formgroupClassName="mb-2"
                        // isDisabled={location.state?.id || location.state?.fromComponent === "Fee Summary"}
                        isDisabled={true}
                        invalid={
                          studentConcessionForm.touched.classId &&
                            studentConcessionForm.errors.classId
                            ? true
                            : false
                        }
                        error={
                          studentConcessionForm.touched.classId &&
                            studentConcessionForm.errors.classId
                            ? studentConcessionForm.errors.classId
                            : ""
                        }
                      />
                      {/* <TextInput
                        name="studentId"
                        // labelText="Student ID"
                        placeHolder="Student ID"
                        value={studentConcessionForm.values.studentId}
                        onChange={filterHandler}
                      /> */}


                      <div className="mt-3 mb-2">
                        <button
                          onClick={toggleStudentConcessionModal}
                          disabled={checkDisablePreviousBtn(studentConcessionForm.values)}
                          className="btn btn-link text-info text-nowrap text-decoration-underline">
                          View Previous Concessions
                        </button>
                        {/* <p className="text-info my-4 fs-16 text-decoration-underline cursor-pointer">
                        </p> */}
                      </div>

                      {/* </div> */}
                    </div>

                    <div className="col">

                    </div>
                    <div className="col-4">
                      <SelectInput
                        name="feeTypeId"
                        labelText="Type"
                        value={studentConcessionForm.values.feeTypeId}
                        onChange={filterHandler}
                        menuItems={typesListData || []}
                        valueKey="feeTypeId"
                        textKey="feeTypeName"
                        formgroupClassName="mb-2"
                        isDisabled={location.state?.id || !(studentConcessionForm.values.curriculumId && studentConcessionForm.values.classId && studentConcessionForm.values.studentId)}
                        invalid={
                          studentConcessionForm.touched.feeTypeId &&
                            studentConcessionForm.errors.feeTypeId
                            ? true
                            : false
                        }
                        error={
                          studentConcessionForm.touched.feeTypeId &&
                            studentConcessionForm.errors.feeTypeId
                            ? studentConcessionForm.errors.feeTypeId
                            : ""
                        }
                      />
                      <SelectInput
                        name="concessionMode"
                        labelText="Concession"
                        value={studentConcessionForm.values.concessionMode}
                        onChange={filterHandler}
                        menuItems={concessionMode}
                        valueKey="concessionModeType"
                        textKey="concessionMode"
                        formgroupClassName="mb-1"
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
                        // iconPositionClassName={studentConcessionForm.values.concessionMode === "AMOUNT" ? "left" : "right"}
                        inputGroupStart={true}
                        allowedInputRegex="^[0-9]*$"
                        groupClassName="2.3rem"
                        // isReadOnly={!edit}
                        // inputClassName={`bg-transparent ${!edit ? 'border-0 border-bottom rounded-0' : ""}`}

                        labelClass="text-muted"
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
                        {/* <i className="ri-mail-unread-line"></i> */}
                        <i className="p-2">{studentConcessionForm.values.concessionMode === "AMOUNT" ? "₹" : "%"}</i>
                      </TextInputGroup>
                    </div>
                  </div>

                  <div className="row" style={{ borderBottom: '1px dashed #C9CBCE' }}>
                    <TableContainer
                      columns={roleColumns || []}
                      data={Array.isArray(ledgerList) ? ledgerList : []}
                      divClass="table-responsive my-3"
                      theadClass="table-light text-muted align-middle"
                      rowDataInfo={{ ...studentConcessionForm.values, globalConcessionValue: globalConcessionValue }}
                      onChangeInputHndlr={concessionAmountChangeHandler}
                    // showCheckbox={true}
                    />
                    <span className="text-danger ps-4">{studentConcessionForm.errors.isNoFeeSelected
                      ? studentConcessionForm.errors.isNoFeeSelected
                      : ""}</span>
                    <span className="text-danger ps-4">{checkTotalConcession ? "* Your Concession Amount should not be greater than total Concession Amount" : ""}</span>
                  </div>

                  <div className="row p-4">
                    <div className="col-5 ms-auto">
                      <div className="row d-flex justify-content-between align-items-center mb-4">
                        <label className="col-4 m-0">Concession Type</label>
                        <SelectInput
                          name="concessionType"
                          // labelText="Concession Type"
                          value={studentConcessionForm.values.concessionType}
                          onChange={studentConcessionForm.handleChange}
                          menuItems={concessionType}
                          valueKey="concessionType"
                          textKey="concessionType"
                          isDisabled={location.state?.id && true}
                          formgroupClassName="w-50 col-3"
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
                      {studentConcessionForm.values.concessionType == "SIBLING" && <div className="row d-flex justify-content-between align-items-center mb-4">
                        <label className="col-4 m-0">Sibling</label>
                        <AutoSearchInputUpdated
                          formgroupClassName="search-box w-50 col-3"
                          name="siblingId"
                          placeHolder="Search..."
                          // onChange={(e: any) => setSearchInputState(e.target.value)}
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
                        // isDisabled={location.state?.concessionId}
                        // isDisabled={location.state?.id}
                        ><i className="ri-search-line search-icon"></i></AutoSearchInputUpdated>
                      </div>}
                      {studentConcessionForm.values.concessionType == "EMPLOYEE" && <div className="row d-flex justify-content-between align-items-center mb-4">
                        <label className="col-4 m-0">Employee</label>
                        <AutoSearchInputUpdated
                          formgroupClassName="search-box w-50 col-3"
                          name="employeeId"
                          placeHolder="Search..."
                          // onChange={(e: any) => setSearchInputState(e.target.value)}
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
                        // isDisabled={location.state?.concessionId}
                        // isDisabled={location.state?.id}
                        ><i className="ri-search-line search-icon"></i></AutoSearchInputUpdated>
                      </div>}
                      <div className="row d-flex justify-content-between align-items-center mb-4">
                        <label className="col-5 m-0">Total Concession Amount</label>
                        <TextIconInput
                          name="totalConcessionAmount"
                          // labelText="Work Email"
                          value={studentConcessionForm.values.totalConcessionAmount}
                          onChange={studentConcessionForm.handleChange}
                          onBlur={studentConcessionForm.handleBlur}
                          // isReadOnly={!edit}
                          formgroupClassName="col-6 m-0"
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

                        {/* <TextInput
                        name="totalConcessionAmount"
                        value={
                          studentConcessionForm.values.totalConcessionAmount
                        }
                        onChange={studentConcessionForm.handleChange}
                        formgroupClassName="w-60 col-4"
                      /> */}
                      </div>
                      <div className="row d-flex justify-content-between mb-4">
                        <label className="col-5 m-0">Remarks</label>
                        <TextArea
                          name="remarks"
                          value={studentConcessionForm.values.remarks}
                          onChange={studentConcessionForm.handleChange}
                          formgroupClassName="col-6"
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
                      {/* { !location.state?.id && <div className="row d-flex justify-content-between">
                        <label className="col-5 m-0">Document</label>

                        <div className="col-6">
                          <label
                            className="choose_file_botton border cursor-pointer mb-2 hover_effect"
                            htmlFor="document"
                          >
                            Choose File
                          </label>

                          <input
                            type="file"
                            name="document"
                            id="document"
                            onChange={(event: any) => {
                              setDocument(event.target.files[0]);
                              studentConcessionForm.handleChange(event)
                            }}
                            hidden
                          />
                          <h6 className="fw-normal d-block file_name_wrap"
                            title={studentConcessionForm.values.document}
                            id="document">
                            {studentConcessionForm.values.document
                              ? studentConcessionForm.values.document?.includes("fakepath") ? studentConcessionForm.values.document.slice(12) : studentConcessionForm.values.document
                              : "No file chosen"}
                          </h6>
                        </div>

                      </div>} */}
                      {/* {!location.state?.id  &&  */}
                      <div className="row d-flex justify-content-between">
                        <label className="col-5 m-0">Document</label>
                        <MultipleFileUpload
                          name="document"
                          prevFiles={document}
                          onChange={handleFileChange}
                          containerClass="col-6"
                          maxSizeInMb={2}
                          helperText="Note : Max File Size is 2MB"
                          error={
                            studentConcessionForm.touched.document &&
                              studentConcessionForm.errors.document
                              ? studentConcessionForm.errors.document
                              : ""
                          }
                        />
                      </div>
                      {/* } */}
                    </div>
                  </div>
                  <div className="row p-3 pt-4">
                    <div className="hstack gap-2 justify-content-end">
                      <button type="button" className="btn btn-light" onClick={CancelHandler}>
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-success" onClick={(e: any) => studentConcessionForm.handleSubmit(e)}>
                        {location.state?.id ? "Update" : "Submit"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ModalContainerUpdated
        id="student-concession-modal"
        isOpen={studentConcessionModal.showModal}
        toggle={toggleStudentConcessionModal}
        modalTitle="Previous Concession"
        modalSize="xl"
      >
        <StudentConcessionModal
          dispatch={dispatch}
          branchId={branchId}
          concessionDetails={studentConcessionForm.values}
        />
      </ModalContainerUpdated>
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

export default StudentConcessionPage;
