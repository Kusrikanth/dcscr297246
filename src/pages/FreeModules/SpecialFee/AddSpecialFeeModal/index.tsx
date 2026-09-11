import { setNestedObjectValues, useFormik } from "formik";
import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import * as Yup from "yup";
import {
    SelectInput,
    TextInputGroup,
    TextInput,
    DateInput,
    TextArea,
    AutoSearchInput,
    InputCheckbox,
} from "../../../../Components/Common";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual } from "react-redux";

//Action Generator
import { generateActionPayload } from "../../../../utility/reduxutility";
import {
    getBranchClassAct,
    getBranchCurriculumAct,
    setBrchClassAct
} from "../../../../store/branchsettings/branchacademics/branchacademicsactions";

import { getFeeTypeByIdAct, getFeeTypesAct, getSpecialFeeCategoryListAct, getSpecialFeeNameItemByIdAct, getSpecialFeeNamesListAct } from "../../../../store/modulesettings/masterfeesettings/masterfeesettingsactions";

import { toast } from "react-toastify";

import { getAmountValueWithDecimal } from "../../../../utility/commonutility";
import {
    Current_Date, getYyyyMmDdFormat
} from "../../../../utility/dateutility";
import { addSpecialFeeAct, updateSpecialFeeAct } from "../../../../store/modulesettings/masterfeesettings/masterfeesettingsactions";


import { default as RupeeSvg } from "../../../../assets/imagesdps/feeDashboard/RupeeSvg.svg?react";
//Helper
import { applicableToOptions } from "../helper";
import SelectStudent from "./SelectStudent";
import SelectClass from "./SelectClass";
import TableContainer from "../../../../Components/Common/TableContainer";
import { validateOnChange, validateOnSubmit } from "../../../../utility/validationutility";
import { generateModalColumns } from "./helper";
import Button from "../../../../Components/Common/Button";

function getSpecialFeeModalState(feeDetails?: any): any {
    const { branchClasses, studentDetails } = feeDetails || {};
    const branchClassIds: any = [],
        studentDetailIds: any = [];
    if (Array.isArray(branchClasses) && branchClasses.length > 0) {
        branchClasses.forEach((item) => {
            branchClassIds.push(item.id);
        })
    }
    if (Array.isArray(studentDetails) && studentDetails.length > 0) {
        studentDetails.forEach((item) => {
            studentDetailIds.push(item.id);
        })
    }
    const dueDate: any = feeDetails?.dueDate ? getYyyyMmDdFormat(feeDetails?.dueDate) : "";
    return ({
        specialFeeName: feeDetails?.specialFeeName || "",
        dueDate,
        feeAmount: getAmountValueWithDecimal(feeDetails?.amount),
        feeTypeId: feeDetails?.feeTypeId || "",
        branchCurriculumId: feeDetails?.branchCurriculumId || "",
        academicYearId: feeDetails?.academicYearId || "",
        applicableTo: feeDetails?.applicableTo || "CLASS",
        classId: feeDetails?.classId || "",
        isDisplayAfterDueDate: feeDetails?.isDisplayAfterDueDate || false,
        // isRecommended: feeDetails?.isRecommended || "",
        feeType: feeDetails?.feeType || "",
        categoryId: feeDetails?.categoryId || "",
        categoryName:feeDetails?.categoryName || "",
        subCategoryName: feeDetails?.subCategoryName || "",
        remarks: feeDetails?.remarks || "",
        branchClassIds,
        studentDetailIds
    })
}

const validationSchema = Yup.object().shape({
    specialFeeName: Yup.string().required("Fee name required.").nullable(),
    feeTypeId: Yup.string().required("Fee type required.").nullable(),
    branchCurriculumId: Yup.string().required("Branch curriculum required.").nullable(),
    academicYearId: Yup.string().required("Academic year required.").nullable(),
    // isRecommended: Yup.string().required("Is Recommended required.").nullable(),
    categoryId: Yup.string().required("Category is required.").nullable(),
    subCategoryName: Yup.string().nullable(),

    dueDate: Yup.string().test('is-student-required', 'Due Date is required', function (value) {
        const { feeType } = this.parent;
        if ((feeType === "ONETIME" && !value)) {
            return false;
        }
        return true;
    }).nullable(),
    feeAmount: Yup.string().typeError("Enter valid number.").test('is-student-required', 'Amount should be greater than 0', function (value: any) {
        const { feeType } = this.parent;
        if ((feeType === "ONETIME" && ((parseInt(value) === 0) || !value))) {
            return false;
        }
        return true;
    }).nullable(),

    applicableTo: Yup.string(),
    branchClassIds: Yup.array().when('applicableTo', {
        is: (item: any) => item === "CLASS",
        then: Yup.array()
            .min(1, 'Select atleast one class.')
    }),
    classId: Yup.string().when('applicableTo', {
        is: (item: any) => item === "STUDENT",
        then: Yup.string().required('Class is required.')
    }),
    studentDetailIds: Yup.array().when('applicableTo', {
        is: (item: any) => item === "STUDENT",
        then: Yup.array()
            .min(1, 'Select atleast one student.')
    }),

});

const termsValidationSchema = Yup.array().of(
    Yup.object().shape({
        dueDate: Yup.date().typeError("Enter a valid date").required("Due date cannot be empty"),
        feeAmount: Yup.number().typeError("Not a valid number").moreThan(0, "Fee amount should be greater than 0.")
            .required("Fee amount is required."),
    })
);

const initialState = getSpecialFeeModalState();
const CreateStudentAccModal = (props: any) => {

    const [termsState, setTermsState] = useState<any>([]);
    const [allStudentSelectedState, setAllStudentSelectedState] = useState(false);
    const [selectedFeeName,setSelectedFeeName] = useState("")

    const dispatch = useAppDispatch();
    const {
        academicYearListResp, brchCurriculumResp,
        branchClassResp,
        feeTypesResp, feeTypeByIdResp, showApiLoader, currentBranchIdResp: branchId,
        getSpecialFeeCategoryListResp,
        addSpecialFeeResp, updateSpecialFeeResp, brchAcademicErrorResp,specialfeeNamesResp } =
        useAppSelector(({ instituteInfo, directoryStudent, branchAcademics, instAcademics,
            masterFeeSettings, globalData, appData,
            userManagement }) => ({
                brchCurriculumResp: branchAcademics.brchCurriculumResp,
                branchClassResp: branchAcademics.branchClassResp,
                academicYearListResp: instAcademics.academicYearListResp,
                feeTypesResp: masterFeeSettings.feeTypesResp,
                addSpecialFeeResp: masterFeeSettings.addSpecialFeeResp,
                feeTypeByIdResp: masterFeeSettings.feeTypeByIdResp,
                getSpecialFeeCategoryListResp: masterFeeSettings.getSpecialFeeCategoryListResp,
                updateSpecialFeeResp: masterFeeSettings.updateSpecialFeeResp,
                specialfeeNamesResp: masterFeeSettings.specialfeeNamesResp,
                studentManagementErrorResp: directoryStudent.studentManagementErrorResp,
                currentBranchIdResp: appData.currentBranchIdResp,
                brchAcademicErrorResp: branchAcademics.brchAcademicErrorResp,
                showApiLoader: globalData.showApiLoader,
            }), shallowEqual);

    const createAccountRespRef = useRef({
        prevAddSpecialFeeResp: addSpecialFeeResp,
        prevFeeTypeByIdResp: feeTypeByIdResp,
        prevUpdateSpecialFeeResp: updateSpecialFeeResp
    });

    const getCurriculumApiCall = (otherProps?:any)=>{
        const curriculumParams = { academicYearId:feeModalForm.values.academicYearId, branchId: branchId || props.branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", };
        dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, curriculumParams)));
    }

    useEffect(() => {
        if (academicYearListResp && Array.isArray(academicYearListResp?.data) && !props.editSpecialFeeDetails) {
            const { academicYearId } = academicYearListResp.data?.find((year: any) => year.yearStatus === "CURRENT") || {};
            feeModalForm.setFieldValue("academicYearId", academicYearId);
            getCurriculumApiCall({academicYearId})
        }
    }, [academicYearListResp]);

    useEffect(() => {
        if (brchCurriculumResp && Array.isArray(brchCurriculumResp?.data) && !props.editSpecialFeeDetails) {
            const { branchCurriculumId } = brchCurriculumResp?.data[0] || {};
            feeModalForm.setFieldValue("branchCurriculumId", branchCurriculumId);
        }else if(brchCurriculumResp && Array.isArray(brchCurriculumResp?.data) && props.editSpecialFeeDetails){
            const specialFeeData = getSpecialFeeModalState(props.editSpecialFeeDetails);
            feeModalForm.resetForm({
                values: specialFeeData
            })
        }
    }, [brchCurriculumResp,props.editSpecialFeeDetails]);

    useEffect(() => {
        const { prevAddSpecialFeeResp, prevUpdateSpecialFeeResp, prevFeeTypeByIdResp } = createAccountRespRef.current;
        if (feeTypeByIdResp && prevFeeTypeByIdResp !== feeTypeByIdResp) {
            const { terms } = feeTypeByIdResp;

            const processTerms = (sourceArray: any[], idKey: string, nameKey: string) => {
                const list = sourceArray.map(item => ({
                    termId: item[idKey],
                    termName: item[nameKey],
                    dueDate: "",
                    feeAmount: "",
                    isEditable: true,
                }));
                setTermsState(list);
            };

            const prepareList = (sourceArray: any[], selectedArray: any[], idKey: string, srcIdKey: string, nameKey: string) => {
                const selectedIds = selectedArray.map(item => item[idKey])
                const list = sourceArray.map(item => {
                    if (selectedIds.includes(item[srcIdKey])) {
                        return {
                            ...selectedArray.find(i => +i[idKey] === +item[srcIdKey]),
                            isSelected: true,
                            touched: true
                        };
                    }
                    return {
                        termId: item[srcIdKey],
                        termName: item[nameKey],
                        dueDate: "",
                        feeAmount: "",
                        isEditable: true,
                    };
                });

                setTermsState(list);
            };

            if (props.editSpecialFeeDetails) {
                const { feeStructureTermDTOS, feeStructureMonthsDTOS, feeType } = props.editSpecialFeeDetails;

                if (feeType === "MONTH" && Array.isArray(feeTypeByIdResp)) {
                    prepareList(feeTypeByIdResp, feeStructureMonthsDTOS, 'termId', 'monthId', 'monthName');
                } else if (feeType === "TERM" && Array.isArray(terms)) {
                    prepareList(terms, feeStructureTermDTOS, 'termId', 'id', 'termTypeName');
                }
            } else {
                if (Array.isArray(terms)) {
                    processTerms(terms, 'id', 'termTypeName');
                } else if (Array.isArray(feeTypeByIdResp)) {
                    processTerms(feeTypeByIdResp, 'monthId', 'monthName');
                } else {
                    setTermsState([]);
                }
            }

        }
        else if (addSpecialFeeResp && prevAddSpecialFeeResp !== addSpecialFeeResp) {
            toast.success("Special fee added successfully.");
            props.toggle(true);
        } else if (updateSpecialFeeResp && prevUpdateSpecialFeeResp !== updateSpecialFeeResp) {
            toast.success("Special fee updated successfully.");
            props.toggle(true);
        }
        createAccountRespRef.current.prevAddSpecialFeeResp = addSpecialFeeResp;
        createAccountRespRef.current.prevFeeTypeByIdResp = feeTypeByIdResp;
        createAccountRespRef.current.prevUpdateSpecialFeeResp = updateSpecialFeeResp;
    }, [addSpecialFeeResp, updateSpecialFeeResp, feeTypeByIdResp]);

    useEffect(() => {
        const { instituteId } = props;
        if (instituteId) {
            const params = { instituteId:instituteId };
            dispatch(getFeeTypesAct(generateActionPayload("get_fee_types", undefined, params)));
            specialFeeCategoryList()
        } else {
            dispatch(setBrchClassAct(undefined));
        }
    }, [props.instituteId]);

    useEffect(() => {
        if (props.editSpecialFeeDetails) {
            const { branchCurriculumId, feeType, feeTypeId , academicYearId } = props.editSpecialFeeDetails;
            if (feeType === "TERM") {
                dispatch(getFeeTypeByIdAct(generateActionPayload("get_fee_type_byid", { feeTypeId })));
            } else if (feeType === "MONTH") {
                dispatch(getFeeTypeByIdAct(generateActionPayload("get_month_names_terms")));
            }
            if(academicYearId){
                getCurriculumApiCall({academicYearId})
            }
            if (branchCurriculumId) {
                getClassApiCall(branchCurriculumId);
            }
            
        }
    }, [props.editSpecialFeeDetails]);
    const feeModalForm = useFormik({
        validationSchema,
        initialValues: initialState,
        onSubmit: (values) => {
            let termPresentList: Array<any> = [];
            if (props.editSpecialFeeDetails && (values.feeType === "MONTH" || values.feeType === "TERM")) {

                const { feeStructureTermDTOS, feeStructureMonthsDTOS, feeType } = props.editSpecialFeeDetails;
                termPresentList = (feeType === "TERM" ? feeStructureTermDTOS : feeStructureMonthsDTOS).map((item: any) => +item?.termId)

            }

            if (props.specialFeeId) {

                const structureTermsDtos = termsState.map((item: any) => (
                    {
                        termId: item["termId"],
                        feeAmount: (termPresentList.includes(+item["termId"]) && !item?.isSelected) ? 0.00 : item["feeAmount"],
                        dueDate: item["dueDate"],
                        isSelected: item?.isSelected,
                        isDeleted: (termPresentList.includes(+item["termId"]) && !item?.isSelected) ? true : false
                    }
                )).filter((item: any) => item?.isSelected || item?.isDeleted);

                const { classId, branchCurriculumId, academicYearId, ...otherPayload } = values,
                    params = { specialFeeId: props.specialFeeId };
                dispatch(updateSpecialFeeAct(generateActionPayload("update_special_fee", params, { ...otherPayload, feeStructureTerms: structureTermsDtos })));

            } else {
                const structureTermsDtos = termsState.filter((item: any) => item.isSelected).map((item: any) => (
                    {
                        termId: item["termId"],
                        feeAmount: item["feeAmount"],
                        dueDate: item["dueDate"],
                    }
                ));

                const payload = { ...values, feeStructureTerms: structureTermsDtos };
                payload.instituteId = props.instituteId;
                payload.branchId = props.branchId;
                delete payload.feeType
                dispatch(addSpecialFeeAct(generateActionPayload("add_special_fee", undefined, { ...payload })));
            }
        }
    });

    const specialFeeCategoryList = () => {

        let payload = {
            branchId: props.branchId,
        };
        dispatch(getSpecialFeeCategoryListAct(generateActionPayload("get_special_fee_category_list", undefined, payload)));
    };

    const selectedStudentCallback = useCallback((studentIds: any) => {
        if (Array.isArray(studentIds)) {
            feeModalForm.setValues((prevState: any) => ({
                ...prevState,
                studentDetailIds: studentIds,
                branchClassIds: []
            }))
        }
    }, []);
    const selectedClassCallback = useCallback((classIds: any) => {
        if (Array.isArray(classIds)) {
            feeModalForm.setValues((prevState: any) => ({
                ...prevState,
                studentDetailIds: [],
                classId: "",
                branchClassIds: classIds
            }))
        }
    }, []);

    function onChangeCurriculumHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
    if (name === "academicYearId") {
            feeModalForm.setValues((prevValue: any) => ({ ...prevValue, academicYearId: value, curriculumId: "", classId: "", branchClassIds: [] }));
    
            if (value) {
                const curriculumParams = { academicYearId: value, branchId: branchId || props.branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", };
                dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, curriculumParams)));
            } else {
                dispatch(setBrchClassAct(undefined));
            }           
        }
        if (feeModalForm.values.applicableTo === "STUDENT") {
            if (value) {
                getClassApiCall(value);
            } else {
                dispatch(setBrchClassAct(undefined));
            }
        }
        feeModalForm.setValues((prevValue: any) => ({
            ...prevValue, [name]: value, classId: "", branchClassIds: []
        }))
    }

    function onChangeApplicableToHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        if (value === "STUDENT" && feeModalForm.values.branchCurriculumId) {
            getClassApiCall(feeModalForm.values.branchCurriculumId);
        }
        feeModalForm.setValues((prevValue: any) => ({
            ...prevValue, [name]: value, classId: ""
        }))
    }
    function getClassApiCall(curriculumId: any) {        
        const payload = {
            pageNo: 0, pageSize: 100, sortBy: "classSequence", orderBy: "asc", curriculumId, branchId
                : props.branchId,academicYearId: feeModalForm.values.academicYearId
        };
        dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
    }

    const fetchSpecialfeeNamesList = (otherProps?: any) => {
        const payload = {
          branchId: props.branchId || branchId,
          ...otherProps,
          pageSize:100,
        };
        dispatch(
          getSpecialFeeNamesListAct(
            generateActionPayload("get_special_fee_Names", undefined, payload)
          )
        );
      };

    function onInputSearchChange(inputString:any){
        const {specialFeeName} = feeModalForm.values;
        if(!inputString) {
            feeModalForm.setFieldValue("categoryName","")
            feeModalForm.setFieldValue("subCategoryName","")
        }
        if(inputString){
            const params = {searchString:inputString}
            fetchSpecialfeeNamesList(params)
        }
    }


    function selectedFeeNameHandler(selectedFeeName:any) {
        setSelectedFeeName(selectedFeeName)
        const catId = getSpecialFeeCategoryListResp.find((item) => item.categoryName === selectedFeeName.category)
        // if(selectedFeeName){
        //     const {id} = selectedFeeName
        //     dispatch(getSpecialFeeNameItemByIdAct(generateActionPayload("get_special_fee_name_by_id", {feeNameId: id,})));
        // }
        feeModalForm.setValues((values) => ({
            ...values,
            specialFeeName:selectedFeeName?.feeName || "",
            subCategoryName:selectedFeeName?.subCategory || "",
            categoryId:catId?.id,
            categoryName:catId?.categoryName,
        }))
    }

    function onBlurAmountFieldHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        feeModalForm.setValues((prevState: any) => ({
            ...prevState,
            [name]: getAmountValueWithDecimal(value)
        }));
        feeModalForm.handleBlur(event);
    }

    function onChangeFeeNameHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        setTermsState([]);
        if (value) {
            if (Array.isArray(feeTypesResp)) {
                const feeParticularInfo = feeTypesResp.find(item => item.feeTypeId == value),
                    { feeTypeId, feeType } = feeParticularInfo;
                feeModalForm.setValues((prevState: any) => ({ ...prevState, feeType, feeTypeId, [name]: value }));
                if (feeType === "TERM") {
                    dispatch(getFeeTypeByIdAct(generateActionPayload("get_fee_type_byid", { feeTypeId })));
                } else if (feeType === "MONTH") {
                    dispatch(getFeeTypeByIdAct(generateActionPayload("get_month_names_terms")));
                } else {
                    setTermsState([]);
                }
            }
            return;
        }
        feeModalForm.setValues((prevState: any) => ({ ...prevState, feeType: "", [name]: value }));
    }

    async function onChangeTableHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target,
            [indexKey, nameKey] = name.split(".");
        if (indexKey && nameKey) {
            var indexMatch = indexKey.match(/\[(.*?)\]/) || "",
                index = Number(Number(indexMatch[1]));
            if (!isNaN(index)) {
                const updatedTermState = [...termsState],
                    termsInfo = { ...termsState[index], [nameKey]: value };
                updatedTermState.splice(index, 1, termsInfo);
                // if (termsInfo?.touched && termsInfo?.touched[nameKey]) {
                const { items } = await validateOnChange(termsValidationSchema, name, updatedTermState);
                setTermsState(items);
                // return;
                // }
                // setTermsState(updatedTermState);
            }
        }
    }

    async function submitHndlr(event: any) {
        event.preventDefault();
        const updatedTermState = [...termsState.filter((item: any) => item?.isSelected)];
        const { items, isValid: isTermStateValid } = await validateOnSubmit(termsValidationSchema, updatedTermState);
        const formKeys = await feeModalForm.validateForm();
        if (!isTermStateValid || Object.keys(formKeys).length !== 0) {
            if (!isTermStateValid) {
                const selectedIds = items?.map((i: any) => i?.termId)
                setTermsState(termsState?.map((item: any) => {
                    if (selectedIds?.includes(item?.termId)) {
                        return items?.find((i: any) => i?.termId == item?.termId)
                    }
                    return { ...item }
                }));
            }
            if (Object.keys(formKeys).length !== 0) {
                feeModalForm.setTouched(setNestedObjectValues<any>(formKeys, true));
            }
            return;
        }
        feeModalForm.handleSubmit();
    }

    const allStudentCheckHndlr = useCallback((event: any) => {
        const { checked } = event.target;
        setAllStudentSelectedState(checked);
        let updateStudentState = [...termsState];
        updateStudentState.forEach((item: any) => {
            if(item?.isEditable){
                item.isSelected = checked;
            }
            if (!checked) {
                delete item.errors;
                delete item.touched;
            }
        });
        setTermsState(updateStudentState);
    }, [termsState]);

    const singleStudentCheckHndlr = useCallback((event: any) => {
        const { checked } = event.currentTarget,
            id = event.currentTarget.getAttribute("data-id"),
            studentRowIndex = termsState.findIndex((item: any) => +item.termId === Number(id));
        if (studentRowIndex > -1) {
            const studentDetails: any = termsState[studentRowIndex];
            let updateStudentState: any = [...termsState];
            const updatedStudent = {
                ...studentDetails,
                isSelected: checked,
            };
            if (!checked) {
                delete updatedStudent.errors;
                delete updatedStudent.touched;
            }
            updateStudentState.splice(studentRowIndex, 1, updatedStudent);
            setTermsState(updateStudentState);
            const isAllSelected = updateStudentState.every((item: any) => item.isSelected);
            setAllStudentSelectedState(isAllSelected);
        }
    }, [termsState]);

    const roleColumns = useMemo(() => generateModalColumns(allStudentCheckHndlr, singleStudentCheckHndlr, allStudentSelectedState), [termsState]);

    useEffect(() => {
        fetchSpecialfeeNamesList()
    },[])

    const {data:specialfeeNamesOptions} = specialfeeNamesResp || {}

    return (
        <>
            <form onSubmit={(event: any) => submitHndlr(event)}>
                <div className="tw-p-4">
                    <div className="tw-grid tw-grid-cols-12 tw-gap-4 tw-mb-3">

                        <div className="tw-col-span-6">
                            <SelectInput
                                name="academicYearId"
                                labelText="Academic Year"
                                value={feeModalForm.values.academicYearId}
                                onChange={onChangeCurriculumHndlr}
                                valueKey="academicYearId"
                                textKey="academicYearName"
                                labelClass="required"
                                menuItems={academicYearListResp?.data}
                                invalid={!!(feeModalForm.touched.academicYearId && feeModalForm.errors.academicYearId)}
                                error={feeModalForm.touched.academicYearId ? feeModalForm.errors.academicYearId : ""}
                                isDisabled={!!props.specialFeeId}
                            />
                        </div>

                        <div className="tw-col-span-6">
                            <SelectInput
                                name="branchCurriculumId"
                                labelText="Curriculum"
                                value={feeModalForm.values.branchCurriculumId}
                                onChange={onChangeCurriculumHndlr}
                                onBlur={feeModalForm.handleBlur}
                                valueKey="branchCurriculumId"
                                textKey="curriculumName"
                                labelClass="required"
                                menuItems={brchCurriculumResp?.data}
                                invalid={!!(feeModalForm.touched.branchCurriculumId && feeModalForm.errors.branchCurriculumId)}
                                error={feeModalForm.touched.branchCurriculumId ? feeModalForm.errors.branchCurriculumId : ""}
                                isDisabled={!!props.specialFeeId}
                            />
                        </div>

                        <div className="tw-col-span-6">
                            {
                                props.specialFeeId ? 
                                <TextInput
                                    name="specialFeeName"
                                    labelText="Fee Name"
                                    labelClass="required"
                                    value={feeModalForm.values.specialFeeName}
                                    onChange={feeModalForm.handleChange}
                                    onBlur={feeModalForm.handleBlur}
                                    // placeHolder="Search..."
                                    invalid={(feeModalForm.touched.specialFeeName && feeModalForm.errors.specialFeeName) ? true : false}
                                    error={(feeModalForm.touched.specialFeeName && feeModalForm.errors.specialFeeName) ? feeModalForm.errors.specialFeeName : ""}
                                    isDisabled={!!props.specialFeeId}
                                />  :
                                    <AutoSearchInput
                                        formgroupClassName="search-box mb-3"
                                        name = "specialFeeName"
                                        labelClass="required"
                                        placeHolder="Search..."
                                        onChange={onInputSearchChange}
                                        onBlur={feeModalForm.handleBlur}
                                        valueKey="id"
                                        subLabelKey="feeName"
                                        labelHeader="Fee Name"
                                        // subLabelKey="id"
                                        // subLabelHeader="Fee Name"
                                        options={specialfeeNamesOptions || []}
                                        selected={selectedFeeName}
                                        selectedOptionCallbck={selectedFeeNameHandler}
                                        labelText="Fee Name"
                                        invalid={(feeModalForm.touched.specialFeeName && feeModalForm.errors.specialFeeName) ? true : false}
                                        error={(feeModalForm.touched.specialFeeName && feeModalForm.errors.specialFeeName) ? feeModalForm.errors.specialFeeName : ""}
                                        isDisabled={!!props.specialFeeId}
                                    >
                                        <i className="ri-search-line search-icon"></i>
                                    </AutoSearchInput>
                            }
                        </div>

                        <div className="tw-col-span-6">
                            <SelectInput
                                name="feeTypeId"
                                labelText="Fee Type"
                                value={feeModalForm.values.feeTypeId}
                                onChange={onChangeFeeNameHndlr}
                                onBlur={feeModalForm.handleBlur}
                                menuItems={feeTypesResp}
                                valueKey="feeTypeId"
                                textKey="feeTypeName"
                                labelClass="required"
                                invalid={(feeModalForm.touched.feeTypeId && feeModalForm.errors.feeTypeId) ? true : false}
                                error={(feeModalForm.touched.feeTypeId && feeModalForm.errors.feeTypeId) ? feeModalForm.errors.feeTypeId : ""}
                                isDisabled={!!props.specialFeeId}
                            />
                        </div>
                        <div className="tw-col-span-6">
                            <InputCheckbox
                                name="isDisplayAfterDueDate"
                                labelName="Display After Due Date"
                                value={feeModalForm.values.isDisplayAfterDueDate}
                                onChange={feeModalForm.handleChange}
                                formgroupClassName="tw-mb-0"
                            />
                        </div>
                    </div>
                    <div className="tw-grid tw-grid-cols-12 tw-gap-4 tw-mb-3">
                        {termsState?.length > 0 && (
                            <div className="tw-col-span-12">
                                <TableContainer
                                    columns={roleColumns}
                                    data={termsState}
                                    divClass="tw-overflow-x-auto tw-mb-3"
                                    theadClass="tw-bg-gray-100 tw-text-gray-500"
                                    onChangeInputHndlr={onChangeTableHndlr}
                                />
                            </div>
                        )}

                        <div className="tw-col-span-6">
                            <div className="tw-grid tw-grid-cols-12 tw-gap-4">
                                <div className="tw-col-span-12">
                                <TextInput
                                        name="categoryId"
                                        value={feeModalForm.values.categoryName}
                                        onChange={feeModalForm.handleChange}
                                        inputType="text"
                                        labelText="Category"
                                        isReadOnly={true}
                                    />
                                </div>
                                <div className="tw-col-span-12">
                                    <TextInput
                                        name="subCategoryName"
                                        value={feeModalForm.values.subCategoryName}
                                        onChange={feeModalForm.handleChange}
                                        inputType="text"
                                        labelText="Sub Category"
                                        isReadOnly={true}
                                    />
                                </div>
                                <div className="tw-col-span-12">
                                    <SelectInput
                                        name="applicableTo"
                                        labelText="Applicable To"
                                        value={feeModalForm.values.applicableTo}
                                        onChange={onChangeApplicableToHndlr}
                                        valueKey="id"
                                        textKey="name"
                                        menuItems={applicableToOptions}
                                        hideSelectOption={true}
                                        isDisabled={!!props.specialFeeId}
                                    />
                                </div>

                                {feeModalForm.values.applicableTo === "STUDENT" && (
                                    <div className="tw-col-span-12">
                                        <SelectInput
                                            name="classId"
                                            labelText="Class"
                                            value={feeModalForm.values.classId}
                                            onChange={feeModalForm.handleChange}
                                            valueKey="id"
                                            textKey="shortName"
                                            labelClass="required"
                                            menuItems={branchClassResp?.content}
                                            isDisabled={!!props.specialFeeId}
                                            invalid={!!(feeModalForm.touched.classId && feeModalForm.errors.classId)}
                                            error={feeModalForm.touched.classId ? feeModalForm.errors.classId : ""}
                                        />
                                    </div>
                                )}

                                {feeModalForm.values.feeType === "ONETIME" && (
                                    <>
                                        <div className="tw-col-span-12">
                                            <DateInput
                                                name="dueDate"
                                                labelText="Due Date"
                                                labelClass="required"
                                                value={feeModalForm.values.dueDate}
                                                onChange={feeModalForm.handleChange}
                                                onBlur={feeModalForm.handleBlur}
                                                minDate={Current_Date}
                                                invalid={!!(feeModalForm.touched.dueDate && feeModalForm.errors.dueDate)}
                                                error={feeModalForm.touched.dueDate ? feeModalForm.errors.dueDate : ""}
                                            />
                                        </div>

                                        <div className="tw-col-span-12">
                                            <TextInputGroup
                                                name="feeAmount"
                                                labelText="Amount"
                                                inputgroupClassName="input-group-md"
                                                inputClassName="form-control-md"
                                                allowedInputRegex="^[0-9]+\.?[0-9]*$"
                                                inputGroupStart={true}
                                                labelClass="required"
                                                value={feeModalForm.values.feeAmount}
                                                onChange={feeModalForm.handleChange}
                                                onBlur={onBlurAmountFieldHndlr}
                                                maxLength={10}
                                                invalid={(feeModalForm.touched.feeAmount && feeModalForm.errors.feeAmount) ? true : false}
                                                error={(feeModalForm.touched.feeAmount && feeModalForm.errors.feeAmount) ? feeModalForm.errors.feeAmount : ""}
                                            >
                                                <RupeeSvg width="11px" height="11px" fill="#495057" />
                                            </TextInputGroup>
                                        </div>
                                    </>
                                )}

                                <div className="tw-col-span-12">
                                    <TextArea
                                        name="remarks"
                                        labelText="Remarks"
                                        value={feeModalForm.values.remarks}
                                        onChange={feeModalForm.handleChange}
                                    />
                                </div>

                            </div>
                        </div>

                        <div className="tw-col-span-6">
                            {feeModalForm.values.applicableTo === "STUDENT" && (
                                <SelectStudent
                                    curriculumId={feeModalForm.values.branchCurriculumId}
                                    classId={feeModalForm.values.classId}
                                    academicYearId={feeModalForm.values.academicYearId}
                                    branchId={props.branchId}
                                    selectedStudentId={feeModalForm.values.studentDetailIds}
                                    selectedStudentCallback={selectedStudentCallback}
                                />
                            )}

                            {feeModalForm.values.applicableTo === "CLASS" && (
                                <SelectClass
                                    curriculumId={feeModalForm.values.branchCurriculumId}
                                    branchId={props.branchId}
                                    selectedClassId={feeModalForm.values.branchClassIds}
                                    selectedClassCallback={selectedClassCallback}
                                    academicYearId={feeModalForm.values.academicYearId}
                                />
                            )}

                            <div className="tw-text-red-500 tw-text-sm tw-mt-2">
                                {feeModalForm.touched.studentDetailIds && feeModalForm.errors.studentDetailIds?.toString()}
                                {feeModalForm.touched.branchClassIds && feeModalForm.errors.branchClassIds?.toString()}
                            </div>
                        </div>

                    </div>
                </div>

                <div className="tw-flex tw-justify-end tw-gap-2 tw-p-4 tw-border-t tw-shadow-inner">
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
                    disabled={showApiLoader}
                    >
                        Submit
                    </Button>
                </div>
            </form>

        </>
    );
};

export default CreateStudentAccModal;