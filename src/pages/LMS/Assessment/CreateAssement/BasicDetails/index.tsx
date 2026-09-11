import React, { useContext, useEffect, useState } from 'react'
import { useFormik } from 'formik';
import { shallowEqual } from 'react-redux';
import { useAppDispatch, useAppSelector } from '../../../../../hooks/storehook';
import { getBranchClassAct, getBranchCurriculumAct, resetBrchClassAct } from '../../../../../store/branchsettings/branchacademics/branchacademicsactions';
import { generateActionPayload } from '../../../../../utility/reduxutility';
import { CustomSelect, MultiSelectCheckbox, QuillEditor, SelectInput, TextInput } from '../../../../../Components/Common';
import { assessmentMode, assessmentTypes, createdBy, renderOptionsEmployee, renderValueSection, renderValueStaff, skillTags, subjectList, topicList } from './helper';
import { StepperFormContext, TABS_ACTIONS } from '../helper';
import { getAssignedClassSubjectsList, resetAssignedClassSubjectsListAct } from '../../../../../store/academic/classSubjects/classsubjectsactions';
import { getEmployeeByFilterAct } from '../../../../../store/directory/employeemanagement/employeemanagementactions';
import { getAssessmentCodeAct, getAssessmentCodeByIdAct, resetAssessmentByIdAct, resetSaveBasicAssessmentAct, saveBasicAssessmentAct } from '../../../../../store/lms/lmsAssessment/lmsAssessmentaction';
import * as Yup from "yup";
import { useHistory } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import { File01Icon } from '@hugeicons-pro/core-solid-standard';
import { ArrowRight03Icon, ArrowRight04Icon, ResetPasswordIcon } from '@hugeicons-pro/core-stroke-standard';

const initialValues = {
    academicYearId: '',
    curriculumId: '',
    schoolName: '',
    assessmentName: '',
    assessmentCode: '',
    assessmentMode: 'ONLINE',
    seqNum: '',
    classId: '',
    subjectId: '',
    skillTags: '',
    studentPhoto: '',
    topic: '',
    createdBy: '',
    assessmentType: 'LIVE_WORKSHEET',
    studentPhotoFile: "",
    studentPhotoPreviewUrl: "",
    instructions: "",
};

const validationSchema = Yup.object({
    assessmentName: Yup.string().required('Assessment name is required').max(100, 'Assessment name should not be more than 100 characters'),
    assessmentMode: Yup.string().required('Assessment mode is required'),
    assessmentType: Yup.string().required('Assessment type is required'),
    curriculumId: Yup.string().required('Curriculum is required'),
    classId: Yup.string().required('Class is required'),
    subjectId: Yup.string().required('Subject is required'),
    createdBy: Yup.string().required('Created by is required'),
});

const BasicDetails = (props: any) => {

    const dispatch = useAppDispatch();
    const history = useHistory();

    const addQuestionForm = useFormik({
        validationSchema,
        initialValues,
        onSubmit: (values) => {
            const academicYearName = academicYearListResp?.data?.find((item: any) => item.academicYearId === values.academicYearId)?.academicYearName;
            const branchName = branchListResp?.data?.find((item: any) => +item.branchId === +branchId)?.branchName;
            const curriculumName = brchCurriculumResp?.data?.find((item: any) => +item.branchCurriculumId === +values.curriculumId)?.curriculumName;
            const className = branchClassResp?.content?.find((item: any) => +item.id === +values.classId)?.className;
            const subjectName = assignedClassSubjectsListResp?.data?.find((item: any) => +item.subjectId === +values.subjectId)?.subjectName;
            const branchShortName = branchListResp?.data?.find((item: any) => +item.branchId === +branchId)?.shortName;

            const payload: any = {
                branchId,
                instituteId,
                branchShortName,
                branchName,
                academicYearId: values.academicYearId,
                academicYearName,
                branchCurriculumId: values.curriculumId,
                curriculumName,
                classId: values.classId,
                className,
                subjectId: values.subjectId,
                subjectName,
                assessmentName: values.assessmentName,
                assessmentCode: values.assessmentCode,
                assessmentMode: values.assessmentMode,
                assessmentType: values.assessmentType,
                instructions: values.instructions,
                seqNum: values.seqNum,
                createdBy: values.createdBy
            }
            if (getAssessmentByIdResp) {
                payload.id = props.id || saveBasicAssessmentResp?.data
            }
            dispatch(saveBasicAssessmentAct(generateActionPayload("save_basic_assessment", undefined, payload)));
            submitCurrentFormCllbck("add_question", TABS_ACTIONS.PARTICULAR_TAB);

        }
    });

    const {
        academicYearListResp,
        brchCurriculumResp,
        branchClassResp,
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        showApiLoader,
        assignedClassSubjectsListResp,
        getEmployeesByFilterResp,
        branchListResp,
        getAssessmentCodeResp,
        saveBasicAssessmentResp,
        getAssessmentByIdResp

    } = useAppSelector(
        ({ instAcademics, globalData, branchAcademics, appData, classSubjectsInfo, directoryEmployee, branch, lmsAssessment }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            branchClassResp: branchAcademics.branchClassResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            showApiLoader: globalData.showApiLoader,
            assignedClassSubjectsListResp: classSubjectsInfo.assignedClassSubjectsListResp,
            getEmployeesByFilterResp: directoryEmployee.getEmployeesByFilterResp,
            branchListResp: branch.branchListResp,
            getAssessmentCodeResp: lmsAssessment.getAssessmentCodeResp,
            saveBasicAssessmentResp: lmsAssessment.saveBasicAssessmentResp,
            getAssessmentByIdResp: lmsAssessment.getAssessmentByIdResp,

        }),
        shallowEqual
    );

    const getCurriculumApiCall = (otherProps?: any) => {
        const payload1 = { instituteId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", ...otherProps };
        dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
    }

    function getClassApiCall(curriculumId: string, academicYearId?: string) {
        const payload = { pageNo: 0, pageSize: 100, sortBy: "classSequence", orderBy: "asc", curriculumId, branchId, academicYearId: academicYearId || addQuestionForm.values.academicYearId };
        dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
    }
    const classSubjectListApicall = (otherProps?: any) => {
        const { academicYearId, classId, curriculumId } = addQuestionForm.values;
        const payload = { academicYearId: academicYearId, curriculumId: curriculumId, branchClassId: classId, ...otherProps, pageNo: 0, pageSize: 100, };
        if (payload.academicYearId && payload.branchClassId) {
            dispatch(
                getAssignedClassSubjectsList(
                    generateActionPayload("get_assigned_class_subject_list", undefined, payload)
                )
            );
        }
    }

    const getAssessmentCodeApiCall = (academicYearId?: string, academicYearName?: any) => {
        const payload = {
            academicYearId: addQuestionForm.values.academicYearId || academicYearId,
            branchId,
            instituteId,
            branchShortName: branchListResp?.data?.find((item: any) => +item.branchId === +branchId)?.shortName,
            academicYearName: academicYearListResp?.data?.find((item: any) => item.academicYearId === addQuestionForm.values.academicYearId)?.academicYearName || academicYearName
        };
        dispatch(getAssessmentCodeAct(generateActionPayload("get_assessment_code", undefined, payload)));
    }

    useEffect(() => {
        const { data } = academicYearListResp || {};
        if (Array.isArray(data) && data.length > 0) {
            const academicYearId = data.find((year: any) => year.yearStatus?.toUpperCase() === "CURRENT")?.academicYearId;
            let { academicYearName } = data.find((year: any) => year.academicYearId === academicYearId) || {};
            if (academicYearId) {
                addQuestionForm.setFieldValue("academicYearId", academicYearId);
                getCurriculumApiCall({ academicYearId });
                getAssessmentCodeApiCall(academicYearId, academicYearName);
            }
        }
    }, [academicYearListResp]);

    useEffect(() => {
        if (getAssessmentCodeResp) {
            addQuestionForm.setFieldValue("assessmentCode", getAssessmentCodeResp?.assessmentCode || "Q13256");
            addQuestionForm.setFieldValue("seqNum", getAssessmentCodeResp?.seqNum || "");
        }
    }, [getAssessmentCodeResp]);

    useEffect(() => {
        if (getAssessmentByIdResp) {
            const { assessmentName, assessmentCode, assessmentMode, assessmentType, instructions, seqNum, subjectId, classId, branchCurriculumId, academicYearId, createdBy } = getAssessmentByIdResp;
            addQuestionForm.setFieldValue("assessmentName", assessmentName);
            addQuestionForm.setFieldValue("assessmentCode", assessmentCode);
            addQuestionForm.setFieldValue("assessmentMode", assessmentMode);
            addQuestionForm.setFieldValue("assessmentType", assessmentType);
            addQuestionForm.setFieldValue("instructions", instructions);
            addQuestionForm.setFieldValue("seqNum", seqNum);
            addQuestionForm.setFieldValue("subjectId", subjectId);
            addQuestionForm.setFieldValue("classId", classId);
            addQuestionForm.setFieldValue("curriculumId", branchCurriculumId);
            addQuestionForm.setFieldValue("academicYearId", academicYearId);
            addQuestionForm.setFieldValue("createdBy", createdBy);
        }

    }, [getAssessmentByIdResp]);

    useEffect(() => {
        if (props.id) {
            dispatch(getAssessmentCodeByIdAct(generateActionPayload("get_assessment_by_id", { id: props.id }, {})));
        }
    }, [props.id]);

    useEffect(() => {
        if (props.id && getAssessmentByIdResp) {
            const { academicYearId, branchCurriculumId, classId, subjectId, createdBy } = getAssessmentByIdResp;
            const params = { searchString: createdBy };
            dispatch(getEmployeeByFilterAct(generateActionPayload("get_employee_by_name", params, { instituteGroupId: 1 })));
            getClassApiCall(branchCurriculumId, academicYearId);
            classSubjectListApicall({ academicYearId: academicYearId, curriculumId: branchCurriculumId, branchClassId: classId });
        }
    }, [props.id, getAssessmentByIdResp]);
    function onSearchMultiSelectHandleremployee(name: any, value: string) {
        if (value) {
            const params = { searchString: value };
            dispatch(getEmployeeByFilterAct(generateActionPayload("get_employee_by_name", params, { instituteGroupId: 1 })));
        }
    }

    const onchangeHandler = (e: any) => {
        const { name, value } = e.target;
        if (name === "curriculumId") {
            if (value) {
                addQuestionForm.setValues((prev: any) => ({ ...prev, [name]: value, classId: "", subjectId: "" }));
                getClassApiCall(value, addQuestionForm.values.academicYearId);
            }
            else {
                addQuestionForm.setValues((prev: any) => ({ ...prev, [name]: value, classId: "", subjectId: "" }));
                dispatch(resetBrchClassAct(undefined));
                dispatch(resetAssignedClassSubjectsListAct(undefined));
            }
        }
        else if (name === "classId") {
            if (value) {
                addQuestionForm.setValues((prev: any) => ({ ...prev, [name]: value, subjectId: "" }));
                classSubjectListApicall({ branchClassId: value });
            }
            else {
                addQuestionForm.setValues((prev: any) => ({ ...prev, [name]: value, subjectId: "" }));
                dispatch(resetAssignedClassSubjectsListAct(undefined));
            }
        }
        else {
            addQuestionForm.setFieldValue(name, value);
        }
    }

    const { submitCurrentFormCllbck } = useContext<any>(StepperFormContext);
    const onChangeQuillHndlr = (content: any) => {
        addQuestionForm.setValues((prevState: any) => ({ ...prevState, instructions: content }));
    }

    function selectSectionHndlr(selectedOptions: number | number[], config?: any) {
        const { name } = config;
        const selectedContactPerson = getEmployeesByFilterResp.find((item: { userId: number }) => +item.userId === +selectedOptions);
        if (selectedContactPerson) {
            addQuestionForm.setValues((prevState) => ({
                ...prevState, contactPerson: selectedContactPerson.employeeName, contactPhone: selectedContactPerson.workPhoneNo, [name]: selectedOptions
            }))
        }
        else {
            addQuestionForm.setValues((prevState) => ({ ...prevState, [name]: selectedOptions }))
        }
    }

    function selectStudentHndlr(selectedOptions: any, config?: any) {
        const { name } = config;
        if (Array.isArray(selectedOptions) && selectedOptions.length > 0) {
            addQuestionForm.setFieldValue(name, selectedOptions);
        } else {
            addQuestionForm.setFieldValue(name, []);
        }
    }
    function onSearchMultiSelectHandlerEmployee(name: string, value: string) {
    }
    useEffect(() => {
        return () => {
            addQuestionForm.resetForm();
            dispatch(resetAssessmentByIdAct(undefined));
            //    dispatch(resetSaveBasicAssessmentAct(undefined));
        }
    }, [])

    const { data: curriculumTypes } = brchCurriculumResp || {}
    const { content: classTypes } = branchClassResp || {};

    return (
        <>
            <form onSubmit={addQuestionForm.handleSubmit} className="h-100">
                <div className='card h-100 mb-0' style={{ borderRadius: "10px" }}>
                    <div className='card-header' style={{
                        borderTopLeftRadius: "10px",
                        borderTopRightRadius: "10px",
                        padding: "20px"
                    }}>
                        <div className='d-flex align-items-center' style={{ gap: "16px" }}>
                            <div style={{
                                width: "48px",
                                height: "48px",
                                backgroundColor: "#CBF3EF",
                                borderRadius: "12px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0
                            }}>
                                <HugeiconsIcon
                                    icon={File01Icon}
                                    size={24}
                                    color="#0AB39C"
                                />
                            </div>
                            <div className='d-grid'>
                                <h4 className='mb-1' style={{
                                    fontSize: "18px",
                                    fontWeight: "600",
                                    color: "#333",
                                    lineHeight: "1.3"
                                }}>
                                    Step 1: Basic Details
                                </h4>
                                <span className='text-muted' style={{
                                    fontSize: "14px",
                                    color: "#6c757d",
                                    lineHeight: "1.4"
                                }}>
                                    Provide the basic details about your assessment.
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className='card-body'>
                        <div className='row px-3'>
                            <div>
                                <div className="row align-items-start create-admin-assessment">
                                    <div className="col-12 col-md-6 col-lg-4">
                                        <TextInput
                                            name="assessmentName"
                                            value={addQuestionForm.values.assessmentName}
                                            onChange={addQuestionForm.handleChange}
                                            labelText='Assessment Name'
                                            formgroupClassName="mb-3 "
                                            labelClass=' required'
                                            invalid={(addQuestionForm.touched.assessmentName && addQuestionForm.errors.assessmentName) ? true : false}
                                            error={(addQuestionForm.touched.assessmentName && addQuestionForm.errors.assessmentName) ? addQuestionForm.errors.assessmentName : ""}

                                        />
                                    </div>
                                    <div className="col-12 col-md-6 col-lg-4">
                                        <TextInput
                                            name="assessmentCode"
                                            value={addQuestionForm.values.assessmentCode}
                                            onChange={addQuestionForm.handleChange}
                                            labelText='Assessment Code'
                                            isDisabled={true}
                                            formgroupClassName="mb-3"
                                            labelClass=' required'
                                        />
                                    </div>
                                    <div className="col-12 col-md-6 col-lg-4">
                                        <SelectInput
                                            name="assessmentMode"
                                            value={addQuestionForm.values.assessmentMode}
                                            onChange={addQuestionForm.handleChange}
                                            menuItems={assessmentMode}
                                            valueKey="id"
                                            textKey="shortName"
                                            labelText='Assessment Mode'
                                            defaultSelect='Online'
                                            defaultValue='ONLINE'
                                            formgroupClassName="mb-3"
                                            labelClass=' required'
                                            invalid={(addQuestionForm.touched.assessmentMode && addQuestionForm.errors.assessmentMode) ? true : false}
                                            error={(addQuestionForm.touched.assessmentMode && addQuestionForm.errors.assessmentMode) ? addQuestionForm.errors.assessmentMode : ""}
                                        />
                                    </div>
                                    <div className="col-12 col-md-6 col-lg-4">
                                        <SelectInput
                                            name="assessmentType"
                                            value={addQuestionForm.values.assessmentType}
                                            onChange={addQuestionForm.handleChange}
                                            menuItems={assessmentTypes}
                                            valueKey="id"
                                            textKey="shortName"
                                            labelText='Assessment Type'
                                            defaultSelect='Live Worksheet'
                                            defaultValue='LIVE_WORKSHEET'
                                            formgroupClassName="mb-3"
                                            labelClass=' required'
                                            invalid={(addQuestionForm.touched.assessmentType && addQuestionForm.errors.assessmentType) ? true : false}
                                            error={(addQuestionForm.touched.assessmentType && addQuestionForm.errors.assessmentType) ? addQuestionForm.errors.assessmentType : ""}
                                        />
                                    </div>
                                    <div className="col-12 col-md-6 col-lg-4">
                                        <SelectInput
                                            name="curriculumId"
                                            value={addQuestionForm.values.curriculumId}
                                            onChange={onchangeHandler}
                                            menuItems={curriculumTypes}
                                            valueKey="branchCurriculumId"
                                            textKey="curriculumName"
                                            labelText='Curriculum'
                                            formgroupClassName="mb-3 "
                                            labelClass=' required'
                                            invalid={(addQuestionForm.touched.curriculumId && addQuestionForm.errors.curriculumId) ? true : false}
                                            error={(addQuestionForm.touched.curriculumId && addQuestionForm.errors.curriculumId) ? addQuestionForm.errors.curriculumId : ""}
                                        />
                                    </div>
                                    <div className="col-12 col-md-6 col-lg-4">
                                        <SelectInput
                                            name="classId"
                                            value={addQuestionForm.values.classId}
                                            onChange={onchangeHandler}
                                            menuItems={classTypes}
                                            valueKey="id"
                                            textKey="shortName"
                                            labelText='Class'
                                            formgroupClassName="mb-3"
                                            labelClass=' required'
                                            invalid={(addQuestionForm.touched.classId && addQuestionForm.errors.classId) ? true : false}
                                            error={(addQuestionForm.touched.classId && addQuestionForm.errors.classId) ? addQuestionForm.errors.classId : ""}
                                        />
                                    </div>
                                    <div className="col-12 col-md-6 col-lg-4">
                                        <SelectInput
                                            name="subjectId"
                                            value={addQuestionForm.values.subjectId}
                                            onChange={addQuestionForm.handleChange}
                                            menuItems={assignedClassSubjectsListResp?.data}
                                            valueKey="subjectId"
                                            textKey="subjectName"
                                            labelText='Subject'
                                            formgroupClassName="mb-3"
                                            labelClass=' required'
                                            invalid={(addQuestionForm.touched.subjectId && addQuestionForm.errors.subjectId) ? true : false}
                                            error={(addQuestionForm.touched.subjectId && addQuestionForm.errors.subjectId) ? addQuestionForm.errors.subjectId : ""}
                                        />
                                    </div>
                                    <div className="col-12 col-md-6 col-lg-4">
                                        <SelectInput
                                            name="topic"
                                            value={addQuestionForm.values.topic}
                                            onChange={addQuestionForm.handleChange}
                                            menuItems={topicList}
                                            valueKey="id"
                                            textKey="shortName"
                                            labelText='Topics'
                                            formgroupClassName="mb-3"
                                            labelClass=''
                                        />
                                    </div>
                                    <div className="col-12 col-md-6 col-lg-4">
                                        <MultiSelectCheckbox
                                            name="skillTags"
                                            labelText='Skill Tag'
                                            labelClass=''
                                            value={addQuestionForm.values.skillTags}
                                            onChange={selectStudentHndlr}
                                            idKey="userId"
                                            options={skillTags}
                                            renderValue={renderValueStaff}
                                            renderOptions={renderOptionsEmployee}
                                            onSearchHandler={onSearchMultiSelectHandlerEmployee}
                                        />
                                    </div>
                                    <div className="col-12 col-md-4">
                                        <CustomSelect
                                            name="createdBy"
                                            idKey="userId"
                                            defaultSelect="Select"
                                            value={addQuestionForm.values.createdBy}
                                            renderValue={renderValueSection}
                                            renderOptions={renderOptionsEmployee}
                                            onChange={selectSectionHndlr}
                                            onSearchHandler={onSearchMultiSelectHandleremployee}
                                            labelText='Created By'
                                            containerClassName="mb-3"
                                            labelClass=' required'
                                            options={getEmployeesByFilterResp}
                                            invalid={(addQuestionForm.touched.createdBy && addQuestionForm.errors.createdBy) ? true : false}
                                            error={(addQuestionForm.touched.createdBy && addQuestionForm.errors.createdBy) ? addQuestionForm.errors.createdBy : ""}
                                        />
                                    </div>
                                    <div className="col-12 col-md-8 lms">
                                        <QuillEditor
                                            name="instructions"
                                            value={addQuestionForm.values.instructions}
                                            onChange={onChangeQuillHndlr}
                                            labelText='Description'
                                            formgroupClassName='-editor'
                                            labelClass=''
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="row my-3 px-0">
                                <div className="col-12 d-flex justify-content-end mt-2 px-0">

                                    <button type="button" className='btn btn-light  px-4 py-2 ms-2' onClick={() => { history.push("/assessment-list") }}
                                        style={{ borderRadius: "8px" }}>Cancel</button>
                                    <button
                                        type="button"
                                        className="btn btn-outline-primary mx-2  px-4 py-2"
                                        onClick={() => {
                                            addQuestionForm.resetForm({
                                                values: {
                                                    ...initialValues,
                                                    assessmentCode: addQuestionForm.values.assessmentCode,
                                                    seqNum: addQuestionForm.values.seqNum
                                                },
                                            });
                                        }}
                                        style={{ borderRadius: "8px" }}
                                    >
                                        <HugeiconsIcon
                                            icon={ResetPasswordIcon}
                                            size={24}
                                            style={{ color: "currentColor" }}
                                            strokeWidth={1.5}
                                            className="me-2"
                                        /> Reset
                                    </button>
                                    <button type="submit" className="btn btn-success  px-4 py-2"
                                    disabled={showApiLoader}
                                        style={{ borderRadius: "8px" }}>
                                        Save & Next<HugeiconsIcon
                                            icon={ArrowRight03Icon}
                                            size={24}
                                            color="#fafafa"
                                            className='ms-1'
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </>
    )
}

export default BasicDetails