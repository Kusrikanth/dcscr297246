import React, { useEffect, useRef, useState } from "react";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import { AutoSearchInputUpdated, DateInput, SelectInput, TextInput } from "../../../../Components/Common";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";

//Action Generator
import { ArrayHelpers, FieldArray, FormikProvider, useFormik } from "formik";
import * as Yup from 'yup';
import { getClassListAdvanceFilter, setClassListForAdvanceFilterAct } from "../../../../store/fee/feecollections/feecollectionactions";
import { getCurriculumClassAct } from "../../../../store/mastersettings/instacademics/instacademicactions";
import { generateUniqueNumber } from "../../../../utility/commonutility";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { hostelMenuOptions } from "./helper";
import { HugeiconsIcon } from "@hugeicons/react";
import { MultiplicationSignIcon } from "@hugeicons-pro/core-stroke-standard";
import { addBranchClassAct, updateAcademicDatesAct } from "../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { getTeacherList } from "../../../../store/academic/classroomManagment/classroommanagmentactions";
import Button from "../../../../Components/Common/Button";

const intialValues = (modalData?: any) => {
    return {
        academicYearId: modalData ? modalData.academicYearId : "",
        curriculumId: modalData ? modalData.curriculumId : "",
        departments: modalData ? modalData.departments ? modalData.departments : [{
            classId: modalData.classId,
            startDate: modalData.startDate,
            endDate: modalData.endDate,
            hostelFacility: modalData.hostelFacility,
            classTeacherId: modalData.classTeacherId,
            classJodoCode: modalData.classJodoCode,
            admissionContactNo: modalData.admissionContactNo,
            schoolSection: modalData.schoolSection,
            checkPointCurriculum: modalData.checkPointCurriculum,
        }] : [{
            uniqueId: generateUniqueNumber(),
            classId: "",
            startDate: "",
            endDate: "",
            hostelFacility: "",
            classTeacherId: "",
            classJodoCode: "",
            admissionContactNo: "",
            schoolSection: "",
            checkPointCurriculum: "",
        }],
    }
}

const validationSchema = Yup.object().shape({
    // academicYearId: Yup.string().required("Academic Year is required."),
    curriculumId: Yup.string().required("Curriculum is required.").nullable(),
    departments: Yup.array().of(
        Yup.object().shape({
            classId: Yup.string().required("Class is required."),
            startDate: Yup.string().required("Start Date is required.").nullable(),
            endDate: Yup.string().required("End Date is required.").nullable(),
            hostelFacility: Yup.string().required("Hostel Facility is required.").nullable(),
            // classJodoCode: Yup.string().required("Class Jodo Code is required.").nullable(),
            // admissionContactNo: Yup.string().required("Contact No is required.").nullable(),
            // schoolSection: Yup.string().required("School Section is required.").nullable(),
            // checkPointCurriculum: Yup.string().required("Check Point Curriculum is required.").nullable(),
        })
    )
});

const AddClassModal: React.FC<any> = (props) => {
    const [selectedStudentState, setSelectedStudentState] = useState<any>(undefined);
    
    const [addClassState, setAddClassState] = useState({
        selectAllClass: false,
        curriculumId: ""
    });
    const [classListState, setClassListState] = useState<any>([]);
    const [departmentListState, setDepartmentListState] = useState<any>(intialValues());
    const formikArrayHelpers = useRef<ArrayHelpers | null>(null);
    const dispatch = useAppDispatch();
    const { curriculumClassResp, brchCurriculumResp, branchClassResp, addBrchClassResp, showApiLoader, academicYearListResp, classListForAdvanceFilter, updateAcademicDateRep , currentInstIdResp : instituteId , currentBranchIdResp : branchId, teacherListResp } = useAppSelector(({ instAcademics, branchAcademics, globalData, feeCollections , appData, classroomManagmentInfo }) => ({
        curriculumClassResp: instAcademics.curriculumClassResp,
        academicYearListResp: instAcademics.academicYearListResp,
        brchCurriculumResp: branchAcademics.brchCurriculumResp,
        branchClassResp: branchAcademics.branchClassResp,
        addBrchClassResp: branchAcademics.addBrchClassResp,
        updateAcademicDateRep: branchAcademics.updateAcademicDateRep,
        classListForAdvanceFilter: feeCollections.classListForAdvanceFilter,
        showApiLoader: globalData.showApiLoader,
        currentInstIdResp: appData.currentInstIdResp,
        currentBranchIdResp: appData.currentBranchIdResp,
        teacherListResp: classroomManagmentInfo.teacherListResp
    }), shallowEqual);

    const addDepartmentForm: any = useFormik({
        enableReinitialize: true,
        initialValues: departmentListState,
        validationSchema,
        onSubmit: (values: any) => {
            if (!props?.modalData) {
                const payload = {
                    curriculumId: values.curriculumId, branchId: props.branchId, academicYearId: props.academicYearId,
                    classDTOS: values?.departments?.map((item: any) => ({
                        classId: item?.classId,
                        startDate: item?.startDate,
                        endDate: item?.endDate,
                        hostelFacility: item.hostelFacility,
                        classTeacherId: item.classTeacherId,
                        classJodoCode: item.classJodoCode,
                        admissionContactNo: item.admissionContactNo,
                        schoolSection: item.schoolSection,
                        checkPointCurriculum: item.checkPointCurriculum,
                    }))
                };
                dispatch(addBranchClassAct(generateActionPayload("add_brch_curriculum_class", undefined, payload)));
            } else {
                const payload = {
                    branchClassId: props?.modalData?.id,
                    academicYearId: props?.academicYearId,
                    hostelFacility: values?.departments[0]?.hostelFacility,
                    classTeacherId: values?.departments[0]?.classTeacherId,
                    classJodoCode: values?.departments[0]?.classJodoCode,
                    admissionContactNo: values?.departments[0]?.admissionContactNo,
                    startDate: values?.departments[0]?.startDate,
                    endDate: values?.departments[0]?.endDate,
                    schoolSection: values?.departments[0]?.schoolSection,
                    checkPointCurriculum: values?.departments[0]?.checkPointCurriculum,
                }          
                dispatch(
                    updateAcademicDatesAct(
                        generateActionPayload(
                            "update_save_branch_academic_class_date",
                            undefined,
                            payload
                        )
                    )
                );
            }

        },
    });

    const addClassStructRespRef = useRef({
        prevAddBrchClassResp: addBrchClassResp,
        prevUpdateAcademicDateRep: updateAcademicDateRep,
    });    
    
    useEffect(() => {
        if (props.isOpen && curriculumClassResp && classListForAdvanceFilter) {
            if (props.modalData) {                
                setClassListState(classListForAdvanceFilter?.content?.map((i: any) => ({ ...i, instituteClassId: i?.classId })));
            } else {                
                updateSelectedClass(curriculumClassResp, classListForAdvanceFilter?.content);
            }
        }
    }, [props.isOpen, curriculumClassResp, classListForAdvanceFilter]);

    useEffect(() => {
        const { prevAddBrchClassResp, prevUpdateAcademicDateRep } = addClassStructRespRef.current;
        if (addBrchClassResp && prevAddBrchClassResp !== addBrchClassResp) {
            props.toggle(true);
            toast.success("Classes added successfully.")
        }
        else if (updateAcademicDateRep && prevUpdateAcademicDateRep !== updateAcademicDateRep) {
            props.toggle(true);
            toast.success("Classes updated successfully.")
        }
        addClassStructRespRef.current.prevAddBrchClassResp = addBrchClassResp;
        addClassStructRespRef.current.prevUpdateAcademicDateRep = updateAcademicDateRep;
    }, [addBrchClassResp, updateAcademicDateRep]);

    useEffect(() => {
        if (props.isOpen) {
            if(props.modalData){
                   const { classTeacherName } = props.modalData;
                     const params = { 
                        academicYearId: props.academicYearId, 
                        empCategoryName: "TEACHERS", 
                        branchId: branchId, 
                        searchString: classTeacherName || "", 
                        pageNo: 0, 
                        pageSize: 2000 
                    };
                    dispatch(getTeacherList(generateActionPayload("get_employees", undefined, params)));
            }
            // getInstCurriculumAndBranchClassDetails(props.curriculumId);
            const { classId, startDate, endDate , hostelFacility,classJodoCode,admissionContactNo,schoolSection,checkPointCurriculum, classTeacherId } = props.modalData || {};
            setDepartmentListState(intialValues({
                ...props.modalData, departments: [
                    { classId, startDate, endDate , hostelFacility,classTeacherId,classJodoCode,admissionContactNo,schoolSection,checkPointCurriculum }
                ]
            }))
        }
    }, [props.isOpen]);

    useEffect(() => {
        if (props.isOpen && props.modalData) {
            const { classTeacherId } = props.modalData;
            if (classTeacherId && teacherListResp) {
                
                const teacherData = teacherListResp.find((teacher: any) => +teacher.id === +classTeacherId);
                
                if (teacherData) {
                    setSelectedStudentState({
                        id: teacherData.id,
                        employeeCode: teacherData.employeeCode,
                        employeeName: teacherData.employeeName
                    });
                }
            }
        }
    }, [ props.modalData, teacherListResp]);    
    function getInstCurriculumAndBranchClassDetails(curriculumId: string) {
        const { instituteCurriculumId } = brchCurriculumResp?.data.find((item: any) => item.branchCurriculumId === +curriculumId) || {};
        const payload = { instituteId,branchId,academicYearId : props.academicYearId, curriculumId, pageNo: 0, pageSize: 100, sortBy: "className", orderBy: "asc" };
        dispatch(getCurriculumClassAct(generateActionPayload("get_unassigned_classes", undefined, payload)));
        const branchClassPayload = { pageNo: 0, pageSize: 100,academicYearId : props.academicYearId, curriculumId: curriculumId, branchId: props.branchId, };
        dispatch(getClassListAdvanceFilter(generateActionPayload("get_brch_curriculum_class", undefined, branchClassPayload)));
    }
    function updateSelectedClass(instCurriculumClassList: any, branchClasses: any) {        
        const branchCurriculumClassId = Array.isArray(branchClasses) && branchClasses.map((item: any) => (item?.classId || "")) || [];        
        const updateClassList = instCurriculumClassList?.filter((item: any) =>
            !branchCurriculumClassId.includes(item?.classId)
        ).map((item: any) => Object.assign({}, item));
        updateSelectedAllHndlr(updateClassList);        
        setClassListState(updateClassList);
    }

    useEffect(() => {
        if (props.isOpen && props.curriculumId) {
            setAddClassState((prevState: any) => ({ ...prevState, curriculumId: props.curriculumId }))
            getInstCurriculumAndBranchClassDetails(props.curriculumId);
        } else if (!props.isOpen) {
            setAddClassState((prevState: any) => ({ ...prevState, selectAllClass: false }))
            dispatch(setClassListForAdvanceFilterAct(undefined))
        }
    }, [props.isOpen, props.curriculumId]);

    function updateSelectedAllHndlr(classList: any) {
        const isAllSelected = classList.every((item: any) => item.selected);
        if (isAllSelected) {
            setAddClassState((prevState: any) => ({ ...prevState, selectAllClass: true }));
        } else {
            setAddClassState((prevState: any) => ({ ...prevState, selectAllClass: false }));
        }
    }

    function onChangeCurrciulumHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        addDepartmentForm.handleChange(event)        
        setClassListState([]);
        if (value)
            getInstCurriculumAndBranchClassDetails(value);
    }

    function addNewDepartmentHndlr() {
        if (formikArrayHelpers.current) {
            formikArrayHelpers.current.push({ uniqueId: generateUniqueNumber(), classId: "", startDate: "", endDate: "", hostelFacility: "", classJodoCode: "", admissionContactNo: "", schoolSection: "", checkPointCurriculum: "", classTeacherId: "" });
        }
    }
  
    function selectStudentHandler(selectedStudent: any, index: number) {
        addDepartmentForm.setFieldValue(`departments[${index}].classTeacherId`, selectedStudent?.id);
    }
      function onInputSearchChange(inputString: any) {
        const { academicYearId } = props;
        if (inputString && academicYearId) {
          const params = { academicYearId: academicYearId, empCategoryName: "TEACHERS", branchId: branchId, searchString: inputString, pageNo: 0, pageSize: 2000 };
         dispatch(getTeacherList(generateActionPayload("get_employees", undefined, params)));
        }
      }

    function removeDepartmentHndlr(event: React.MouseEvent<HTMLButtonElement>) {
        const rowIndex = event.currentTarget.getAttribute("data-index");
        if (rowIndex !== undefined || rowIndex !== null) {
            formikArrayHelpers.current?.remove(Number(rowIndex));
        }
    }

    return (

        <div className="tw-w-full">
            <FormikProvider value={addDepartmentForm}>

                <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-px-4 tw-pb-4 tw-pt-2 tw-gap-3">

                    <div className="tw-pt-3">
                        <SelectInput
                            name="academicYearId"
                            value={props.academicYearId}
                            onChange={undefined}
                            menuItems={academicYearListResp?.data}
                            valueKey="academicYearId"
                            textKey="academicYearName"
                            isDisabled={true}
                            formgroupClassName="tw-mb-0"
                            labelText="Academic Year"
                            labelClass="required"
                        />
                    </div>

                    <div className="tw-pt-3">
                        <SelectInput
                            name="curriculumId"
                            labelText="Curriculum"
                            value={addDepartmentForm.values.curriculumId}
                            onChange={onChangeCurrciulumHndlr}
                            menuItems={brchCurriculumResp?.data || []}
                            formgroupClassName="tw-mb-0"
                            valueKey="branchCurriculumId"
                            textKey="curriculumName"
                            isDisabled={props.modalData}
                            labelClass="required"
                        />
                    </div>
                </div>

                <div className="tw-flex tw-items-baseline tw-w-full tw-border-b tw-px-4 tw-pb-2">
                    <h6 className="tw-mb-0 tw-mr-2">Classes</h6>
                </div>

                <div className="tw-w-full tw-p-4">

                    <FieldArray name="departments">
                        {(arrayHelpers: ArrayHelpers) => {
                            if (!formikArrayHelpers.current) {
                                formikArrayHelpers.current = arrayHelpers;
                            }

                            return (
                                <>
                                    {addDepartmentForm.values.departments &&
                                    addDepartmentForm.values.departments?.map((department: any, index: number) => {

                                        const inputFieldErrors: any = addDepartmentForm.errors.departments && addDepartmentForm.errors.departments[index] || {};
                                        const inputFieldTouched: any = addDepartmentForm.touched.departments && addDepartmentForm.touched.departments[index] || {};
                                            return (
                                            <div key={`${index}-${department.uniqueId}`} className="tw-relative">

                                                <div className="tw-relative tw-w-full tw-p-5 tw-border tw-border-gray-300 tw-rounded-md tw-my-3">

                                                    <p className="tw-absolute tw--top-3 tw-left-4 tw-px-2 tw-text-gray-600 tw-bg-white tw-text-sm">
                                                        Class Info
                                                    </p>

                                                    <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-gap-4 tw-mb-3">

                                                        <div>
                                                            <SelectInput
                                                                name={`departments[${index}].classId`}
                                                                value={department.classId}
                                                                onChange={addDepartmentForm.handleChange}
                                                                isDisabled={props.modalData}
                                                                menuItems={classListState}
                                                                valueKey="classId"
                                                                textKey="className"
                                                                invalid={inputFieldTouched.classId && inputFieldErrors.classId}
                                                                error={inputFieldTouched.classId && inputFieldErrors.classId ? inputFieldErrors.classId : ""}
                                                                formgroupClassName="tw-mb-0"
                                                                labelText="Class"
                                                                labelClass="required"
                                                            />
                                                        </div>

                                                        <div>
                                                            <DateInput
                                                                name={`departments[${index}].startDate`}
                                                                value={department.startDate}
                                                                onChange={addDepartmentForm.handleChange}
                                                                formgroupClassName="tw-mb-0"
                                                                invalid={inputFieldTouched.startDate && inputFieldErrors.startDate}
                                                                error={inputFieldTouched.startDate && inputFieldErrors.startDate ? inputFieldErrors.startDate : ""}
                                                                labelText="Start Date"
                                                                labelClass="required"
                                                            />
                                                        </div>

                                                        <div>
                                                            <DateInput
                                                                name={`departments[${index}].endDate`}
                                                                value={department.endDate}
                                                                onChange={addDepartmentForm.handleChange}
                                                                formgroupClassName="tw-mb-0"
                                                                invalid={inputFieldTouched.endDate && inputFieldErrors.endDate}
                                                                error={inputFieldTouched.endDate && inputFieldErrors.endDate ? inputFieldErrors.endDate : ""}
                                                                labelText="End Date"
                                                                labelClass="required"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-gap-4 tw-mt-3">

                                                        <AutoSearchInputUpdated
                                                            formgroupClassName="search-box"
                                                            name={`departments[${index}].classTeacherId`}
                                                            placeHolder="Search Employee..."
                                                            onChange={onInputSearchChange}
                                                            valueKey="id"
                                                            labelKey="employeeCode"
                                                            subLabelKey="employeeName"
                                                            labelHeader="Employee Code"
                                                            subLabelHeader="Employee Name"
                                                            options={teacherListResp || []}
                                                            labelText="Assign Teacher"
                                                            selectedOptionCallbck={(student) => selectStudentHandler(student, index)}
                                                            selected={selectedStudentState}
                                                        />

                                                        <SelectInput
                                                            name={`departments[${index}].hostelFacility`}
                                                            value={department.hostelFacility}
                                                            onChange={addDepartmentForm.handleChange}
                                                            menuItems={hostelMenuOptions}
                                                            formgroupClassName="tw-mb-0"
                                                            valueKey="key"
                                                            textKey="name"
                                                            invalid={inputFieldTouched.hostelFacility && inputFieldErrors.hostelFacility}
                                                            error={inputFieldTouched.hostelFacility && inputFieldErrors.hostelFacility ? inputFieldErrors.hostelFacility : ""}
                                                            labelText="Hostel Facility"
                                                            labelClass="required"
                                                        />

                                                        <TextInput
                                                            name={`departments[${index}].classJodoCode`}
                                                            value={department.classJodoCode}
                                                            onChange={addDepartmentForm.handleChange}
                                                            formgroupClassName="tw-mb-0"
                                                            invalid={inputFieldTouched.classJodoCode && inputFieldErrors.classJodoCode}
                                                            error={inputFieldTouched.classJodoCode && inputFieldErrors.classJodoCode ? inputFieldErrors.classJodoCode : ""}
                                                            labelText="Class Jodo Code"
                                                        />
                                                    </div>

                                                    <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-gap-4 tw-mt-3">

                                                        <TextInput
                                                            name={`departments[${index}].admissionContactNo`}
                                                            value={department.admissionContactNo}
                                                            onChange={addDepartmentForm.handleChange}
                                                            formgroupClassName="tw-mb-0"
                                                            invalid={inputFieldTouched.admissionContactNo && inputFieldErrors.admissionContactNo}
                                                            error={inputFieldTouched.admissionContactNo && inputFieldErrors.admissionContactNo ? inputFieldErrors.admissionContactNo : ""}
                                                            labelText="Admission Contact No"
                                                        />

                                                        <TextInput
                                                            name={`departments[${index}].schoolSection`}
                                                            value={department.schoolSection}
                                                            onChange={addDepartmentForm.handleChange}
                                                            formgroupClassName="tw-mb-0"
                                                            invalid={inputFieldTouched.schoolSection && inputFieldErrors.schoolSection}
                                                            error={inputFieldTouched.schoolSection && inputFieldErrors.schoolSection ? inputFieldErrors.schoolSection : ""}
                                                            labelText="School Section"
                                                        />

                                                        <TextInput
                                                            name={`departments[${index}].checkPointCurriculum`}
                                                            value={department.checkPointCurriculum}
                                                            onChange={addDepartmentForm.handleChange}
                                                            formgroupClassName="tw-mb-0"
                                                            invalid={inputFieldTouched.checkPointCurriculum && inputFieldErrors.checkPointCurriculum}
                                                            error={inputFieldTouched.checkPointCurriculum && inputFieldErrors.checkPointCurriculum ? inputFieldErrors.checkPointCurriculum : ""}
                                                            labelText="Check Point Curriculum"
                                                        />
                                                    </div>

                                                </div>

                                                {index !== 0 && (
                                                    <div className="tw-bg-white tw-shadow-lg tw-rounded-full tw-absolute -tw-top-2 -tw-right-2 tw-flex tw-justify-end">
                                                        <Button
                                                            type="button"
                                                            variant="wrong"
                                                            data-index={index}
                                                            className="!tw-rounded-full !tw-p-2"
                                                            onClick={removeDepartmentHndlr}
                                                        >
                                                            <HugeiconsIcon
                                                                icon={MultiplicationSignIcon}
                                                                className="tw-text-red-600"
                                                                size={18}
                                                            />
                                                        </Button>
                                                    </div>
                                                )}

                                            </div>
                                        );
                                    })}
                                </>
                            );
                        }}
                    </FieldArray>

                    {!props.modalData && (
                        <div className="tw-mt-2">
                            <Button
                                onClick={addNewDepartmentHndlr}
                                type="button"
                                variant="hoverInfo"
                            >
                                Add New
                            </Button>
                        </div>
                    )}

                </div>

                <div className="tw-flex tw-justify-end tw-gap-2 tw-mb-4 tw-mr-2">

                    <Button
                        type="button"
                        variant="secondary"
                        onClick={props.toggle}
                    >
                        Cancel
                    </Button>

                    <Button
                        type="button"
                        variant="primary"
                        onClick={(event: any) => addDepartmentForm.handleSubmit(event)}
                        disabled={showApiLoader}
                    >
                        {props.classId ? "Update" : "Submit"}
                    </Button>

                </div>
            </FormikProvider >
        </div >

    )
}

export default React.memo(AddClassModal);
