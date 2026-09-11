import React, { useEffect, useMemo, useState, useRef } from "react";
import { shallowEqual } from "react-redux";
import { useFormik, setNestedObjectValues } from 'formik';
import * as Yup from "yup";
import { toast } from "react-toastify";
import {
  ModalContainer,
  SelectInput,
  TextInput, InputCheckbox,
  InputCheckboxUpdated
} from "../../../Components/Common";
import {
  generateModalColumns,
} from "./helper";
import TableContainer from "../../../Components/Common/TableContainer";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
//Action Generator
import { generateActionPayload } from "../../../utility/reduxutility";
import {
  getFeeParticularsAct, setFeeParticularsAct, addFeeStructureAct,
  getFeeStructureByIdAct, setFeeStructureByIdAct,
  updateFeeStructureAct,
  getJodoFeeStructureAct
} from "../../../store/modulesettings/masterfeesettings/masterfeesettingsactions";
import { getFeeTypeByIdAct } from "../../../store/modulesettings/masterfeesettings/masterfeesettingsactions";
import { getBranchClassAct, getBranchCurriculumAct, setBrchClassAct, } from "../../../store/branchsettings/branchacademics/branchacademicsactions";
//Utility
import { getYyyyMmDdFormat } from "../../../utility/dateutility";
import { getAmountValueWithDecimal } from "../../../utility/commonutility";
import {
  validateOnChange, validateOnSubmit, touchTableFieldOnBlur,
  validateSingleTableField
} from "../../../utility/validationutility";
import Button from "../../../Components/Common/Button";

const validationSchema = Yup.object().shape({
  academicYearId: Yup.string().required("Academic year is required."),
  branchCurriculumId: Yup.string().required("Curriculum is required."),
  feeParticularId: Yup.string().required("Fee name is required."),
  feeTypeId: Yup.string().required("Fee type is required."),
});

const termsValidationSchema = Yup.array().of(
  Yup.object().shape({
    feeType: Yup.string(),
    dueDate: Yup.date().typeError("Enter a valid date").required("Due date cannot be empty"),
    feeAmount: Yup.number().typeError("Not a valid number").moreThan(0, "Fee amount should be greater than 0.")
      .required("Fee amount is required."),
    admissionFeeAmount: Yup.number().typeError("Not a valid number").moreThan(0, "Admission fee amount should be greater than 0.")
      .required("Admission fee amount is required."),
    newStudentJodoCode: Yup.string().nullable(),
    newStudentDisplay: Yup.string().nullable(),
    oldStudentJodoCode: Yup.string().nullable(),
    oldStudentDisplay: Yup.string().nullable(),
    existingStudent: Yup.boolean(),
    newStudent: Yup.boolean(),
  })
);

function getFeeStructModalValues(editData?: any) {
  return (
    {
      academicYearId: editData?.academicYearId || "",
      curriculumId: editData?.branchCurriculumId || "",
      instituteId: editData?.instituteId || "",
      feeParticularId: editData?.feeParticularId || "",
      branchId: editData?.branchId || "",
      branchCurriculumId: editData?.branchCurriculumId || "",
      feeStructureTerms: [],
      classesIds: [],
      feeTypeId: editData?.feeTypeId || "",
      feeType: editData?.feeType || "",
      feeTypeName: editData?.feeTypeName || "",
      isProRata: editData?.isProRata || false,
    }
  )
}
const initialValues = getFeeStructModalValues();
const FeeStructureModal = (props: any) => {
  const [termsState, setTermsState] = useState<any>([]);
  const [classListState, setClassListState] = useState<any>([]);
  const [selectAllClassState, setSelectAllClassState] = useState(false);
  const [classErrorState, setClassErrorState] = useState("");

  const dispatch = useAppDispatch();
  const {
    currentInstIdResp: instituteId, currentBranchIdResp: branchId,
    academicYearListResp, brchCurriculumResp, branchClassResp, feeTypeByIdResp, feeParticularsResp,
    addFeeStructureResp, updateFeeStructureResp, showApiLoader,
    feeStructureByIdResp, brchAcademicErrorResp, getJodoFeeStructureResp } =
    useAppSelector(({ appData, instAcademics, branchAcademics, masterFeeSettings, globalData }) => ({
      currentInstIdResp: appData.currentInstIdResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      academicYearListResp: instAcademics.academicYearListResp,
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      branchClassResp: branchAcademics.branchClassResp,
      feeTypeByIdResp: masterFeeSettings.feeTypeByIdResp,
      feeParticularsResp: masterFeeSettings.feeParticularsResp,
      addFeeStructureResp: masterFeeSettings.addFeeStructureResp,
      updateFeeStructureResp: masterFeeSettings.updateFeeStructureResp,
      feeStructureByIdResp: masterFeeSettings.feeStructureByIdResp,
      brchAcademicErrorResp: branchAcademics.brchAcademicErrorResp,
      showApiLoader: globalData.showApiLoader,
      getJodoFeeStructureResp: masterFeeSettings.getJodoFeeStructureResp,
    }), shallowEqual);

  const feeStructureRespRef = useRef({
    prevFeeTypeByIdResp: feeTypeByIdResp,
    prevAddFeeStructureResp: addFeeStructureResp,
    prevUpdateFeeStructureResp: updateFeeStructureResp,
    prevFeeStructureByIdResp: feeStructureByIdResp,
    prevBranchClassResp: branchClassResp,
    prevBrchAcademicErrorResp: brchAcademicErrorResp
  });

  useEffect(() => {
    if (academicYearListResp && Array.isArray(academicYearListResp?.data)) {
      const { academicYearId } = academicYearListResp.data?.find((year: any) => year.yearStatus === "CURRENT") || {};
      addFeeStructureForm.setFieldValue("academicYearId", academicYearId);
      const curriculumParams = { academicYearId, branchId: branchId || props.branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", };
      dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, curriculumParams)));
    }
  }, [academicYearListResp]);
  useEffect(() => {
    if (brchCurriculumResp && !props.feeStructureId && Array.isArray(brchCurriculumResp?.data)) {
      const { branchCurriculumId } = brchCurriculumResp?.data[0] || {};
      getBranchClassApiCall(branchCurriculumId);
      getFeeParticularApiCall(branchCurriculumId);
      addFeeStructureForm.setFieldValue("branchCurriculumId", branchCurriculumId);
    }
  }, [brchCurriculumResp, props.feeStructureId]);

  useEffect(() => {
    const { prevFeeTypeByIdResp, prevBranchClassResp,
      prevFeeStructureByIdResp,
      prevUpdateFeeStructureResp, prevBrchAcademicErrorResp, prevAddFeeStructureResp } = feeStructureRespRef.current;
    if (feeTypeByIdResp && prevFeeTypeByIdResp !== feeTypeByIdResp) {
      const { terms, feeType } = feeTypeByIdResp;
      dispatch(getJodoFeeStructureAct(generateActionPayload("get_jodo_fee_structure", undefined, {feeType, instituteId, branchId})));

      if (Array.isArray(terms)) {
        const termsList: any = [];
        for (let i = 0; i < terms.length; i++) {
          termsList.push({
            termId: terms[i].id, termName: terms[i].termTypeName, dueDate: "",
            feeAmount: "", feeType,
            admissionFeeAmount: "",
            newStudentJodoCode: "", newStudentDisplay: "",
            oldStudentJodoCode: "", oldStudentDisplay: "",
            existingStudent: false,
            newStudent: true,
          });
          setTermsState(termsList);
        }
      }
    } else if (branchClassResp && prevBranchClassResp !== branchClassResp) {
      const { content } = branchClassResp, { classes } = feeStructureByIdResp || {};
      if (Array.isArray(content)) {
        if (Array.isArray(classes) && classes.length > 0) {
          updateSelectedClass(content, classes);
        } else {
          const updateClassList = content?.map(item => ({ ...item }));
          setClassListState(updateClassList);
        }
      }
    }
    else if (addFeeStructureResp && prevAddFeeStructureResp !== addFeeStructureResp) {
      toast.success("Fee structure added successfully.");
      props.toggle(true);
    }
    else if (updateFeeStructureResp && prevUpdateFeeStructureResp !== updateFeeStructureResp) {
      toast.success("Fee structure updated successfully.");
      props.toggle(true);
    }
    else if (feeStructureByIdResp && prevFeeStructureByIdResp !== feeStructureByIdResp) {
      const { classes, branchCurriculumId, feeStructureTerms, feeType, dueDate, feeAmount, newAdmissionAmount, newStudentDisplay, newStudentJodoCode } = feeStructureByIdResp,
      
      { content } = branchClassResp || {};
      dispatch(getJodoFeeStructureAct(generateActionPayload("get_jodo_fee_structure", undefined, {feeType, instituteId, branchId})));
      let updatedTerms: any = [];
      if (feeType === "ONETIME") {
        updatedTerms = [{
          termId: 1, termName: "", feeType,
          dueDate: getYyyyMmDdFormat(dueDate),
          feeAmount: getAmountValueWithDecimal(feeAmount),
          admissionFeeAmount: getAmountValueWithDecimal(newAdmissionAmount),
          newStudentDisplay, newStudentJodoCode,
          existingStudent: feeStructureByIdResp?.isApplyExistingStudent,
          newStudent: feeStructureByIdResp?.isApplyNewStudent,
        }]
      }
      if (Array.isArray(content) && content.length > 0 && Array.isArray(classes)) {
        updateSelectedClass(content, classes);
      }
      if (Array.isArray(feeStructureTerms) && feeStructureTerms.length > 0) {
        updatedTerms = feeStructureTerms.map((item: any) => (
          {
            termId: item["termId"],
            termName: item["termName"],
            feeType,
            dueDate: getYyyyMmDdFormat(item["dueDate"]),
            feeAmount: getAmountValueWithDecimal(item["feeAmount"]),
            admissionFeeAmount: getAmountValueWithDecimal(item["admissionFeeAmount"]),
            newStudentDisplay: item["newStudentDisplay"],
            newStudentJodoCode: item["newStudentJodoCode"],
            oldStudentDisplay: item["oldStudentDisplay"],
            oldStudentJodoCode: item["oldStudentJodoCode"],
          }
        ));
      }
      addFeeStructureForm.resetForm({
        values: getFeeStructModalValues(feeStructureByIdResp)
      })
      setTermsState(updatedTerms);
      getBranchClassApiCall(branchCurriculumId);
      // { termId: terms[i].id, termName: terms[i].termTypeName, dueDate: "", feeAmount: 0, admissionFeeAmount: 0 }
    }
    else if (brchAcademicErrorResp && brchAcademicErrorResp !== prevBrchAcademicErrorResp) {
      const { message }: any = brchAcademicErrorResp;
      toast.error(message || "Something went wrong.");
    }
    feeStructureRespRef.current.prevFeeTypeByIdResp = feeTypeByIdResp;
    feeStructureRespRef.current.prevBranchClassResp = branchClassResp;
    feeStructureRespRef.current.prevAddFeeStructureResp = addFeeStructureResp;
    feeStructureRespRef.current.prevFeeStructureByIdResp = feeStructureByIdResp;
    feeStructureRespRef.current.prevUpdateFeeStructureResp = updateFeeStructureResp;
    feeStructureRespRef.current.prevBrchAcademicErrorResp = brchAcademicErrorResp;
  }, [feeTypeByIdResp, addFeeStructureResp, updateFeeStructureResp, feeStructureByIdResp,
    branchClassResp, brchAcademicErrorResp]);

  useEffect(() => {
    const { feeStructureId } = props;
    if (feeStructureId) {
      const params = { feeStructureId };
      dispatch(getFeeStructureByIdAct(generateActionPayload("get_fee_structure_byid", params)));
    }
    return () => { dispatch(setFeeStructureByIdAct(undefined)) }
  }, [props.feeStructureId]);
  // useEffect(() => {
  //   const { instituteId } = props;
  //   if (instituteId) {
  //     const payload = { instituteId, pageNo: 0, pageSize: 100 };
  //     dispatch(getFeeParticularsAct(generateActionPayload("get_fee_particulars", undefined, payload)));
  //   }
  // }, [props.instituteId]);


  function updateSelectedClass(branchClass: any, selectClasses: any) {
    const selectedClassIds = selectClasses?.reduce((data: any, item: any) => {
      data[item.shortCode] = true;
      return data;
    }, {});
    const updateClassList = branchClass?.map((item: any) => {
      if (Object.prototype.hasOwnProperty.call(selectedClassIds, item.shortName)) {
        return Object.assign({}, item, { selected: true });
      }
      return Object.assign({}, item, { selected: false });
    })
    updateSelectedAllHndlr(updateClassList);
    setClassListState(updateClassList);
  }

  const addFeeStructureForm = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      let payload: any = {};
      const feeStructureTerms = termsState.map((item: any) => (
        {
          termId: item["termId"],
          dueDate: item["dueDate"],
          feeAmount: item["feeAmount"],
          admissionFeeAmount: item["admissionFeeAmount"],
          newStudentDisplay: item["newStudentDisplay"],
          newStudentJodoCode: item["newStudentJodoCode"],
          oldStudentDisplay: item["oldStudentDisplay"],
          oldStudentJodoCode: item["oldStudentJodoCode"],
        }
      ));
      const classesIds = classListState.filter((item: any) => item.selected).map((item: any) => item.id);

      if (values.feeType === "ONETIME" && termsState?.length > 0) {
        const { dueDate, feeAmount, admissionFeeAmount, newStudentDisplay, newStudentJodoCode, existingStudent, newStudent } = termsState[0] || {};
        payload["dueDate"] = dueDate;
        payload["feeAmount"] = feeAmount;
        payload["newAdmissionAmount"] = admissionFeeAmount;
        payload["newStudentDisplay"] = newStudentDisplay;
        payload["newStudentJodoCode"] = newStudentJodoCode;
        payload["isApplyExistingStudent"] = existingStudent;
        payload["isApplyNewStudent"] = newStudent;
      }
      delete payload.feeType;
      delete payload.feeTypeId;
      delete payload.feeTypeName;
      if (props.feeStructureId) {
        const params = {
          feeStructureId: props.feeStructureId
        };
        payload.feeStructureTerms = values.feeType === "ONETIME" ? [] : feeStructureTerms;
        payload.classesIds = classesIds;
        payload.isProRata = values.isProRata;
        dispatch(updateFeeStructureAct(generateActionPayload("update_fee_structure", params, payload)));
      } else {
        payload = { ...payload, ...values };
        payload.branchId = props.branchId;
        payload.instituteId = props.instituteId;
        payload.feeStructureTerms = values.feeType === "ONETIME" ? [] : feeStructureTerms;
        payload.classesIds = classesIds;
        payload.isProRata = values.isProRata;

        dispatch(addFeeStructureAct(generateActionPayload("add_fee_structure", undefined, payload)));
      }
    },
  });
  function onChangeFeeNameHndlr(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setTermsState([]);
    if (value) {
      const { data } = feeParticularsResp;
      if (Array.isArray(data)) {
        const feeParticularInfo = data.find(item => item.id == value),
          { feeTypeId, feeType, feeTypeName } = feeParticularInfo;
        addFeeStructureForm.setValues((prevState: any) => ({ ...prevState, feeType: feeTypeName, feeTypeId, feeTypeName: feeType, [name]: value }));
        dispatch(getFeeTypeByIdAct(generateActionPayload("get_fee_type_byid", { feeTypeId })));
      }
      return;
    }
    addFeeStructureForm.setValues((prevState: any) => ({ ...prevState, feeType: "", feeTypeId: "", [name]: value }));
  }

  function onChangeCurriculumHndlr(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    if (name === "academicYearId") {
      addFeeStructureForm.setValues((prevValue: any) => ({ ...prevValue, academicYearId: value, curriculumId: "", feeParticularId: "", feeTypeId: "", feeType: "", }));
      if (value) {
        const curriculumParams = { academicYearId: value, branchId: branchId || props.branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", };
        dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, curriculumParams)));
      } else {
        dispatch(setBrchClassAct(undefined));
      }

      setClassListState([]);
      dispatch(setFeeParticularsAct(undefined));
      setSelectAllClassState(false);
      setTermsState([]);
    }
    else if (value) {
      // sortBy: "className", orderBy: "asc"
      getBranchClassApiCall(value);
      getFeeParticularApiCall(value);
    }
    //Make class list as empty array.
    setClassListState([]);
    dispatch(setFeeParticularsAct(undefined));
    //set all checkbox class are false.
    setSelectAllClassState(false);
    //Removing the previous terms state.
    setTermsState([]);
    addFeeStructureForm.setValues((prevValue: any) => ({
      ...prevValue, [name]: value, feeParticularId: "",
      feeTypeId: "",
      feeType: "",
    }));

  }

  function getBranchClassApiCall(curriculumId: any) {
    const payload = {
      pageNo: 0, pageSize: 100, sortBy: "classSequence", orderBy: "asc", curriculumId,
      branchId: branchId || props.branchId, academicYearId: addFeeStructureForm.values.academicYearId
    };
    if(!curriculumId) return
    dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
  }

  function getFeeParticularApiCall(curriculumId: any) {
    const payload = { instituteId: props.instituteId, curriculumId, pageNo: 0, pageSize: 100 };
    dispatch(getFeeParticularsAct(generateActionPayload("get_fee_particulars", undefined, payload)));
  }

  function selectClassHndlr(event: React.ChangeEvent<HTMLInputElement>) {
    const { checked } = event.target,
      classId = Number(event.target.getAttribute("data-id")),
      classIndex = classListState.findIndex((item: any) => item.id === classId);
    if (classErrorState && checked) {
      setClassErrorState("");
    }
    if (classIndex > -1) {
      const classDetails = classListState[classIndex],
        updateClassList = [...classListState];
      updateClassList.splice(classIndex, 1, { ...classDetails, selected: checked });
      setClassListState(updateClassList);
      updateSelectedAllHndlr(updateClassList)
    }
  }

  function updateSelectedAllHndlr(classList: any) {
    const isAllSelected = classList.every((item: any) => item.selected);
    if (isAllSelected) {
      setSelectAllClassState(true);
    } else {
      setSelectAllClassState(false);
    }
  }

  function selectAllClassHndlr(event: React.ChangeEvent<HTMLInputElement>) {
    if (classListState.length === 0) {
      return;
    }
    const { checked } = event.target;
    setSelectAllClassState(checked);
    const updateClassList = [...classListState];
    if (checked) {
      updateClassList.forEach((item) => {
        item.selected = true;
      });
      setClassListState(updateClassList);
      setClassErrorState("");
    } else {
      updateClassList.forEach((item) => {
        item.selected = false;
      });
      setClassListState(updateClassList);
    }
  }

  async function onChangeTableHndlr(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = event.target,
      [indexKey, nameKey] = name.split(".");
    if (indexKey && nameKey) {
      var indexMatch = indexKey.match(/\[(.*?)\]/) || "",
        index = Number(Number(indexMatch[1]));
      if (!isNaN(index)) {
        const updatedTermState = [...termsState];
        const termsInfo = { ...updatedTermState[index] };

        const newValue = type === "checkbox" ? checked : value;
        termsInfo[nameKey] = newValue;

        // if (type === "checkbox" && checked) {
        //   if (nameKey === "existingStudent") {
        //     termsInfo.newStudent = false;
        //   } else if (nameKey === "newStudent") {
        //     termsInfo.existingStudent = false;
        //   }
        // }

        updatedTermState.splice(index, 1, termsInfo);
        const { items } = await validateOnChange(
          termsValidationSchema,
          name,
          updatedTermState
        );
        setTermsState(items);
      }
    }
  }

  async function onBlurTableHndlr(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target,
      [indexKey, nameKey] = name.split(".");
    if (indexKey && nameKey) {
      var indexMatch = indexKey.match(/\[(.*?)\]/) || "",
        index = Number(Number(indexMatch[1]));
      if (!isNaN(index)) {
        if (index === 0) {
          const updatedTermState = [...termsState];

          if (nameKey === "dueDate") {
            const indexTermInfo = { ...updatedTermState[index], [nameKey]: value },
              monthGap = Math.round(12 / updatedTermState.length),
              selectedDate = new Date(value);
            updatedTermState.splice(index, 1, indexTermInfo);
            for (let i = 1; i < updatedTermState.length; i++) {
              if (i !== index && !updatedTermState[i][nameKey]) {
                const updateDate = new Date(selectedDate.setMonth(selectedDate.getMonth() + (i * monthGap)));
                updatedTermState[i][nameKey] = getYyyyMmDdFormat(updateDate);
              }
            }
            const termsStateTouched = await touchTableFieldOnBlur(index, nameKey, updatedTermState),
              itemsAfterColumnValidation = await validateSingleTableField(termsValidationSchema, termsStateTouched, nameKey);
            setTermsState(itemsAfterColumnValidation);
          } else {
            const amountValue = getAmountValueWithDecimal(value),
              indexTermInfo = { ...updatedTermState[index], [nameKey]: amountValue };
            updatedTermState.splice(index, 1, indexTermInfo);
            //We need to update else than zero index
            for (let i = 1; i < updatedTermState.length; i++) {
              if (i !== index && !updatedTermState[i][nameKey]) {
                updatedTermState[i][nameKey] = amountValue;
              }
            }
            const termsStateTouched = await touchTableFieldOnBlur(index, nameKey, updatedTermState),
              itemsAfterColumnValidation = await validateSingleTableField(termsValidationSchema, termsStateTouched, nameKey);
            setTermsState(itemsAfterColumnValidation);
          }
        } else if (nameKey !== "dueDate") {
          const updatedTermState = [...termsState],
            indexTermInfo = { ...updatedTermState[index], [nameKey]: getAmountValueWithDecimal(value) };
          updatedTermState.splice(index, 1, indexTermInfo);
          const termsStateTouched = await touchTableFieldOnBlur(index, nameKey, updatedTermState);
          setTermsState(termsStateTouched);
        } else {
          const updatedTermState = [...termsState],
            indexTermInfo = { ...updatedTermState[index], [nameKey]: value };
          updatedTermState.splice(index, 1, indexTermInfo);
          const termsStateTouched = await touchTableFieldOnBlur(index, nameKey, updatedTermState);
          setTermsState(termsStateTouched);
        }
      }
      //   if (!isNaN(index)) {
      //     const updatedTermState = [...adjustingFeeLedgerState],
      //       termsInfo = { ...adjustingFeeLedgerState[index], [nameKey]: getAmountValueWithDecimal(value) };
      //     updatedTermState.splice(index, 1, termsInfo);
      //     const touchedFeeLedger = await touchFieldOnBlur(name, updatedTermState);
      //     if (Array.isArray(touchedFeeLedger)) {
      //       const updateAdjustedAmount = touchedFeeLedger.reduce((sumAdjust, item) => {
      //         sumAdjust += (Number(item?.adjustAmount) || 0);
      //         return sumAdjust;
      //       }, 0);
      //       addFeeRefundForm.setFieldValue("totalAdjustAmount", getAmountValueWithDecimal(updateAdjustedAmount));
      //     }
      //     setAdjustingFeeLedgerState(touchedFeeLedger);
      //   }
    }
  }

  // function onBlurTableHndlr(event: React.ChangeEvent<HTMLInputElement>) {
  //   const { name } = event.target,
  //     [indexKey, nameKey] = name.split(".");
  //   if (indexKey && nameKey) {
  //     var indexMatch = indexKey.match(/\[(.*?)\]/) || "",
  //       index = Number(Number(indexMatch[1]));
  //     if (!isNaN(index)) {
  //       const updatedTermState = [...termsState],
  //         termsInfo = termsState[index];
  //       if (termsInfo.touched) {
  //         termsInfo.touched[nameKey] = true;
  //       } else {
  //         termsInfo.touched = { [nameKey]: true };
  //       }
  //       updatedTermState.splice(index, 1, { ...termsInfo });
  //       setTermsState(updatedTermState);
  //     }
  //   }
  // }

  async function submitHndlr() {
    const updatedTermState = [...termsState];
    const { items, isValid: isTermStateValid } = await validateOnSubmit(termsValidationSchema, updatedTermState);
    const classIdSelected = classListState.some((item: any) => item.selected);
    const formKeys = await addFeeStructureForm.validateForm();
    if (!isTermStateValid || !classIdSelected || Object.keys(formKeys).length !== 0) {
      if (!classIdSelected) {
        setClassErrorState("Select atleast once class for the fee structure after selecting curriculum.");
      } else {
        setClassErrorState("");
      }
      if (!isTermStateValid) {
        setTermsState(items);
      }
      if (Object.keys(formKeys).length !== 0) {
        addFeeStructureForm.setTouched(setNestedObjectValues<any>(formKeys, true));
      }
      return;
    }
    setClassErrorState("");
    addFeeStructureForm.handleSubmit();
    // if (!isTermStateValid) {
    //   setTermsState(items);
    //   return;
    // }
    // if (classesIds.length === 0) {
    //   setClassErrorState("Select at least on class.");
    //   return;
    // }
  }

  const roleColumns = useMemo(() => {
    return generateModalColumns(onChangeTableHndlr).filter((item) => {
      if (addFeeStructureForm.values.feeType === "ONETIME") {
        return (
          item.Header !== "Terms" &&
          item.Header !== "Old Student Display" &&
          item.Header !== "Old Student Jodo Code"
        );
      } else {
        return (
          item.Header !== "Existing Student" && item.Header !== "New Student"
        );
      }
    });
  }, [termsState, addFeeStructureForm.values.feeType]);

  const selectedFeeParticular = feeParticularsResp?.data?.find(
    (item: any) => item.id == addFeeStructureForm.values.feeParticularId
  );

  const showProRata =
    selectedFeeParticular?.feeTypeName === "TERM" &&
    selectedFeeParticular?.particularName === "TERM TUITION FEE";

  const jodoOptions = useMemo(() => {
    if (!getJodoFeeStructureResp) return null;
    
    return {
      newStudentJodoCodes: getJodoFeeStructureResp.newStudentJodoCodes || [],
      oldStudentJodoCodes: getJodoFeeStructureResp.oldStudentJodoCodes || [],
      newStudentDisplays: getJodoFeeStructureResp.newStudentDisplays || [],
      oldStudentDisplays: getJodoFeeStructureResp.oldStudentDisplays || []
    };
  }, [getJodoFeeStructureResp]);

  return (
    <form onSubmit={e => e.preventDefault()}>
      <div className="tw-p-0 tw-mb-3">
        <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-3 tw-pt-3 tw-px-3">

          <div>
            <SelectInput
              name="academicYearId"
              labelText="Academic Year"
              value={addFeeStructureForm.values.academicYearId}
              onChange={onChangeCurriculumHndlr}
              menuItems={academicYearListResp?.data}
              valueKey="academicYearId"
              textKey="academicYearName"
              defaultSelect="Academic Year"
              labelClass="required"
              isDisabled={props.feeStructureId}
              invalid={(addFeeStructureForm.touched.academicYearId && addFeeStructureForm.errors.academicYearId) ? true : false}
              error={(addFeeStructureForm.touched.academicYearId && addFeeStructureForm.errors.academicYearId) ? addFeeStructureForm.errors.academicYearId : ""}
            />
          </div>

          <div>
            <SelectInput
              name="branchCurriculumId"
              labelText="Curriculum"
              value={addFeeStructureForm.values.branchCurriculumId}
              onChange={onChangeCurriculumHndlr}
              menuItems={brchCurriculumResp?.data}
              valueKey="branchCurriculumId"
              textKey="curriculumName"
              defaultSelect="Curriculum"
              labelClass="required"
              isDisabled={props.feeStructureId}
              invalid={(addFeeStructureForm.touched.branchCurriculumId && addFeeStructureForm.errors.branchCurriculumId) ? true : false}
              error={(addFeeStructureForm.touched.branchCurriculumId && addFeeStructureForm.errors.branchCurriculumId) ? addFeeStructureForm.errors.branchCurriculumId : ""}
            />
          </div>

          <div>
            <SelectInput
              name="feeParticularId"
              labelText="Fee Name"
              value={addFeeStructureForm.values.feeParticularId}
              onChange={onChangeFeeNameHndlr}
              menuItems={feeParticularsResp?.data}
              valueKey="id"
              textKey="particularName"
              labelClass="required"
              isDisabled={props.feeStructureId}
              invalid={(addFeeStructureForm.touched.feeParticularId && addFeeStructureForm.errors.feeParticularId) ? true : false}
              error={(addFeeStructureForm.touched.feeParticularId && addFeeStructureForm.errors.feeParticularId) ? addFeeStructureForm.errors.feeParticularId : ""}
            />
          </div>

          <div>
            <TextInput
              name="feeTypeName"
              labelText="Fee Type"
              labelClass="required"
              value={addFeeStructureForm.values.feeTypeName}
              onChange={undefined}
              // formgroupClassName="mb-0"
              isReadOnly={true}
              invalid={(addFeeStructureForm.touched.feeTypeId && addFeeStructureForm.errors.feeTypeId) ? true : false}
              error={(addFeeStructureForm.touched.feeTypeId && addFeeStructureForm.errors.feeTypeId) ? addFeeStructureForm.errors.feeTypeId : ""}
            />
          </div>
          {showProRata && (
            <div>
              <InputCheckboxUpdated
                name="isProRata"
                labelName="Is Pro Rata"
                value={addFeeStructureForm.values.isProRata}
                onChange={addFeeStructureForm.handleChange}
                formgroupClassName="tw-mb-0"
              />
            </div>
          )}
        </div>

        {addFeeStructureForm.values.feeTypeId && (
          <div className="tw-mt-4">
            <div className="tw-w-full">
              <TableContainer
                columns={roleColumns}
                data={termsState}
                divClass="tw-overflow-x-auto tw-mb-3"
                theadClass="tw-bg-gray-100 tw-text-gray-500"
                onChangeInputHndlr={onChangeTableHndlr}
                onBlurInputHndlr={onBlurTableHndlr}
                rowDataInfo={{
                  feeType: addFeeStructureForm.values.feeType,
                  jodoOptions,
                }}
              />
            </div>
          </div>
        )}

        {addFeeStructureForm.values.branchCurriculumId && (
          <div className="tw-mb-3 tw-px-3">
            <div className="tw-mb-2">
              <h6 className="tw-text-sm tw-font-semibold tw-mb-1">
                Select Classes
              </h6>
              {classErrorState && (
                <span className="tw-text-red-500 tw-text-sm">
                  {classErrorState}
                </span>
              )}
            </div>

            <div className="tw-mb-2">
              <InputCheckbox
                name="selectAllClass"
                labelName="Select All"
                value={selectAllClassState}
                onChange={selectAllClassHndlr}
              />
            </div>

            <div className="tw-grid tw-grid-cols-1 sm:tw-grid-cols-2 md:tw-grid-cols-3 tw-gap-2">
              {Array.isArray(classListState) &&
                classListState.map((item: any, index: number) => (
                  <InputCheckbox
                    key={item.id}
                    name={`class-${index}`}
                    labelName={item.shortName}
                    value={item.selected}
                    onChange={selectClassHndlr}
                    dataId={item.id}
                  />
                ))}
            </div>
          </div>
        )}
      </div>

      <div className="tw-flex tw-justify-end tw-gap-2 tw-border-t tw-border-gray-200 tw-p-4">
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
          onClick={submitHndlr}
          disabled={showApiLoader}
        >
          Submit
        </Button>
      </div>

    </form>
  );
};

export default FeeStructureModal;
