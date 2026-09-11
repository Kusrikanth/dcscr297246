import React, { useEffect, useRef, useState } from 'react'
import {  MultiSelectCheckbox, SelectInput, TextInput } from '../../../../Components/Common'
import { ArrayHelpers, FieldArray, FormikProvider, useFormik } from 'formik'
import { generateUniqueNumber } from '../../../../utility/commonutility'
import { generateActionPayload } from '../../../../utility/reduxutility'
import { getBranchClassAct, getBranchCurriculumAct, resetBrchClassAct } from '../../../../store/branchsettings/branchacademics/branchacademicsactions'
import { shallowEqual } from 'react-redux'
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from '../../../../hooks/storehook'
import {
    addExamSubjectsListAct, editExamSubjectsListAct,
    getAllSubjectsByClassAct, getExamSubjectStreamListAct, getExamSubjectsByIdAct,
    setExamSubjectsByClassAct, setExamSubjectsListById
} from '../../../../store/FrontDesk/Settings/admissionAvailability/admissionavailabilityaction'
import { renderOptionsClasses, renderOptionsStream, renderValueClasses, renderValueStream } from './helper'
import Button from '../../../../Components/Common/Button'

const initialValue = {
    curriculumId: "",
    classes: [],
    streams: [],
    assignSubjects: [{
        id: generateUniqueNumber(),
        subjectId: "",
        maxMarks: "",
        passMarks: ""
    }]
}
const validationSchema = Yup.object().shape({
    curriculumId: Yup.string().required("Curriculum is required."),
    classes: Yup.array().nullable().min(1, 'Classes is required.'),
    // streams: Yup.array().min(1,"Min 1 Stream is Required").required('Stream is required.'),
    assignSubjects: Yup.array().of(
        Yup.object().shape({
            subjectId: Yup.string().required('Subject Name is required'),
            // maxMarks: Yup.number().required('Max marks are required'),
            // passMarks: Yup.number().required('Pass marks are required'),
        })
    ),

});

const ExamSubjectsModal = (props: any) => {

    const dispatch = useAppDispatch();
    const applicationId  = props.applicationId;
    const [classListState, setClassListState] = useState<any>([]);
    const { branchClassResp, currentBranchIdResp: branchId, getExamSubjectStreamResp, getExamSubjectsByClassResp, brchCurriculumResp,
        currentInstIdResp: instituteId, streamListResp, assignedClassSubjectsListResp, examSubjectListByIdResp,showApiLoader,academicYearListResp } = useAppSelector(
            ({ branchAcademics, appData, assignGroupInfo, classSubjectsInfo, admissionAvailabilityRequest,globalData,instAcademics, }) => ({
                branchClassResp: branchAcademics.branchClassResp,
                brchCurriculumResp: branchAcademics.brchCurriculumResp,
                currentBranchIdResp: appData.currentBranchIdResp,
                currentInstIdResp: appData.currentInstIdResp,
                examSubjectListByIdResp: admissionAvailabilityRequest.examSubjectListByIdResp,
                streamListResp: assignGroupInfo.streamListResp,
                assignedClassSubjectsListResp: classSubjectsInfo.assignedClassSubjectsListResp,
                getExamSubjectStreamResp: admissionAvailabilityRequest.getExamSubjectStreamResp,
                getExamSubjectsByClassResp: admissionAvailabilityRequest.getExamSubjectsByClassResp,
                academicYearListResp : instAcademics.academicYearListResp,
                showApiLoader:globalData.showApiLoader,
            }),
            shallowEqual
        );

    const examModalRef = useRef({
        prevBranchClassResp: branchClassResp,
        prevExamSubjectListByIdResp: examSubjectListByIdResp,
    });

    useEffect(() => {
        const { prevBranchClassResp, prevExamSubjectListByIdResp } = examModalRef.current;
        if (branchClassResp && prevBranchClassResp !== branchClassResp) {
            const { classData } = examSubjectListByIdResp || {},
                { content } = branchClassResp;
            if (Array.isArray(content)) {
                setClassListState(content);
                if (Array.isArray(classData) && classData.length > 0) {
                    const classIds = classData.map(item => item.classId?.toString()),
                        classInfo = content.filter(item => classIds.includes(item.id?.toString()));
                    examSubjectForm.setFieldValue("classes", classInfo);
                }
            }
        } else if (examSubjectListByIdResp && prevExamSubjectListByIdResp !== examSubjectListByIdResp) {
            const { curriculumId, subjectId, maxMarks, passMarks, streamGroups, classData , academicYearId } = examSubjectListByIdResp
            getCurriculumApiCall({ academicYearId });
            getClassApiCall({ academicYearId , curriculumId });
            if (classData?.length > 0) {
                const params = { academicYearId,branchId, curriculumId, classIds: classData?.map((item:any)=>item?.classId)?.join(",") }
                dispatch(getExamSubjectStreamListAct(generateActionPayload("exam_subjects_stream_list", undefined, params)));
            }
            const payload1 = { curriculumId, branchId };
            dispatch(getAllSubjectsByClassAct(generateActionPayload("all_subjects_by_class", undefined, payload1)));
            const initial = {
                curriculumId, assignSubjects: [{ id: generateUniqueNumber(), subjectId, maxMarks, passMarks }], streams: streamGroups, classes: classData?.map((item:any)=>({...item , id : item?.classId})),
            }

            examSubjectForm.resetForm({
                values: initial
            })
        }
        examModalRef.current.prevBranchClassResp = branchClassResp;
        examModalRef.current.prevExamSubjectListByIdResp = examSubjectListByIdResp;
    }, [branchClassResp, examSubjectListByIdResp]);

    const examSubjectForm = useFormik({
        initialValues: initialValue,
        validationSchema,
        onSubmit: (values) => {

            if (applicationId) {
                const { assignSubjects } = values
                const payload = { maxMarks: assignSubjects[0]?.maxMarks, passMarks: assignSubjects[0].passMarks, groupIds: values.streams.map((i: any) => i?.streamId),classIds: values?.classes?.map((item: any) => item?.id) }

                dispatch(
                    editExamSubjectsListAct(
                        generateActionPayload("edit_exam_subjects", { id: applicationId }, payload)
                    )
                );
            } else {
                const payload = {
                    instituteId, branchId, curriculumId: values?.curriculumId, academicYearId: props?.details?.academicYearId, classIds: values?.classes?.map((item: any) => item?.id), groupIds: values?.streams?.map((i: any) => i?.streamId), admissionExamSubjectReqDTOS: values?.assignSubjects.map((i: any) => { return { maxMarks: i.maxMarks, passMarks: i.passMarks, subjectId: i.subjectId } })
                }
                dispatch(
                    addExamSubjectsListAct(
                        generateActionPayload("add_exam_subjects", undefined, payload)
                    )
                );
            }
        }
    })

    useEffect(() => {
        if (props?.applicationId) {
            const params = { id: props?.applicationId }
            dispatch(getExamSubjectsByIdAct(generateActionPayload('exam_subjects_by_id', params)));
        }else{
            getCurriculumApiCall()
        }
        return () => {
            dispatch(setExamSubjectsListById(undefined));
        }
    }, [])

    const formikArrayHelpers = useRef<ArrayHelpers | null>(null);

    const getClassApiCall = (otherProps?:any)=>{    
        const payload = { branchId: branchId, academicYearId : props?.details?.academicYearId, curriculumId: examSubjectForm.values.curriculumId, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100 , ...otherProps };
        dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
    }

    const getCurriculumApiCall = (otherProps?: any) => {
        const payload1 = { academicYearId: props?.details?.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" , ...otherProps };
        dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
    }

    const handleChange = (e: any) => {
        const { name, value } = e.target
        if (name === "curriculumId") {
            examSubjectForm.setValues((values:any) => ({
                ...values,
                curriculumId: value,
                classes: [], streams: []
            }));
            dispatch(resetBrchClassAct(undefined));
            if (value) {
                getClassApiCall({ curriculumId: value });
                const subjectPayload = { branchId, curriculumId: value };
                dispatch(getAllSubjectsByClassAct(generateActionPayload("all_subjects_by_class", undefined, subjectPayload)));
            }
        }
        dispatch(setExamSubjectsByClassAct({}));
    }

    function selectHndlr(selectedOptions: any, config?: any) {
      
        const { name , actionItem , actionType } = config;
        if (Array.isArray(selectedOptions) && selectedOptions.length > 0) {
            if(name === "classes"){
                const params = { academicYearId:props?.details?.academicYearId, branchId,curriculumId: examSubjectForm.values.curriculumId, classIds: selectedOptions.map((item: any) => item?.id).join(',') }
                dispatch(getExamSubjectStreamListAct(generateActionPayload("exam_subjects_stream_list", undefined, params)));
                examSubjectForm.setValues((prevState: any) => ({ ...prevState, [name]: selectedOptions , streams: prevState?.streams?.filter((item:any)=> actionType === 'remove' ? +item?.classId !== +actionItem?.id : true)}));
            }
            else {
                examSubjectForm.setValues((prevState: any) => ({ ...prevState, [name]: selectedOptions }));
            }
        } else {
            examSubjectForm.setValues((prevState: any) => ({ ...prevState, [name]: [] }));
        }

    }

    const { data: academicYearList } = academicYearListResp || {};
    const { data: curriculumTypes } = brchCurriculumResp || {}
    return (
        <form onSubmit={examSubjectForm.handleSubmit}>
            {/* Filters */}
            <div className="tw-grid tw-grid-cols-1 tw-gap-4 tw-p-3">

                <div className="tw-col-span-1">
                    <SelectInput
                        name="academicYearId"
                        value={props?.details?.academicYearId}
                        onChange={undefined}
                        isDisabled={true}
                        menuItems={academicYearList || []}
                        valueKey="academicYearId"
                        textKey="academicYearName"
                        formgroupClassName="tw-mb-0"
                        labelText="Academic Year"
                    />
                </div>

                <div className="tw-col-span-1">
                    <SelectInput
                        name="curriculumId"
                        value={examSubjectForm.values.curriculumId}
                        onChange={handleChange}
                        menuItems={curriculumTypes || []}
                        valueKey="branchCurriculumId"
                        textKey="curriculumName"
                        labelClass="required"
                        formgroupClassName="tw-mb-0"
                        isDisabled={applicationId && true}
                        defaultSelect="Curriculum"
                        invalid={examSubjectForm.touched.curriculumId && !!examSubjectForm.errors.curriculumId}
                        error={examSubjectForm.touched.curriculumId ? examSubjectForm.errors.curriculumId : ""}
                        labelText="Curriculum"
                    />
                </div>

                <div className="tw-col-span-1">
                    <MultiSelectCheckbox
                        name="classes"
                        labelText="Class"
                        idKey="id"
                        labelClass="required"
                        value={examSubjectForm.values.classes}
                        renderValue={renderValueClasses}
                        renderOptions={renderOptionsClasses}
                        onChange={selectHndlr}
                        searchKey="shortName"
                        options={classListState}
                        invalid={(examSubjectForm.touched.classes && examSubjectForm.errors.classes) ? true : false}
                        error={(examSubjectForm.touched.classes && examSubjectForm.errors.classes) ? examSubjectForm.errors.classes : ""}
                        isDisabled={!examSubjectForm.values.curriculumId}
                    />
                </div>

                <div className="tw-col-span-1">
                    <MultiSelectCheckbox
                        name="streams"
                        labelText="Stream"
                        containerClassName="tw-mb-3"
                        idKey="streamId"
                        searchKey="streamGroupName"
                        value={examSubjectForm.values.streams}
                        renderValue={renderValueStream}
                        renderOptions={renderOptionsStream}
                        onChange={selectHndlr}
                        options={getExamSubjectStreamResp}
                        isDisabled={!examSubjectForm.values.curriculumId}
                    />
                </div>

            </div>

            {/* Assigned Subjects Header */}
            <div className="tw-flex tw-items-center tw-gap-2 tw-px-3 tw-pb-3">
                <h6 className="tw-m-0">Assigned Subjects</h6>
                {/* Optional Add Button */}
            </div>

            {/* Assigned Subjects Table Header */}
            <div className="tw-mx-2 tw-mt-2">
                <div className="tw-grid tw-grid-cols-12 tw-gap-2 tw-bg-gray-100 tw-py-2 tw-px-2 tw-mb-3">
                    <div className="tw-col-span-4">
                        <h6 className="tw-m-0 tw-p-2 tw-font-semibold ">Subjects Name <span className="tw-text-red-600">*</span></h6>
                    </div>
                    <div className="tw-col-span-4">
                        <h6 className="tw-m-0 tw-p-2">Max Marks</h6>
                    </div>
                    <div className="tw-col-span-3">
                        <h6 className="tw-m-0 tw-p-2">Pass Marks</h6>
                    </div>
                    <div className="tw-col-auto"></div>
                </div>
            </div>

            {/* Assigned Subjects Formik Fields */}
            <FormikProvider value={examSubjectForm}>
                <FieldArray name="assignSubjects">
                    {(arrayHelpers: ArrayHelpers) => {
                        if (!formikArrayHelpers.current) formikArrayHelpers.current = arrayHelpers;

                        return (
                            <>
                                {examSubjectForm.values.assignSubjects.length > 0 &&
                                    examSubjectForm.values.assignSubjects.map((subject: any, index: any) => {
                                        const inputFieldErrors: any =
                                            Array.isArray(examSubjectForm.errors.assignSubjects) &&
                                            examSubjectForm.errors.assignSubjects[index] || {};
                                        const inputFieldTouched =
                                            Array.isArray(examSubjectForm.touched.assignSubjects) &&
                                            examSubjectForm.touched.assignSubjects[index] || {};

                                        return (
                                            <div className="tw-grid tw-grid-cols-12 tw-gap-2 tw-px-3 tw-pb-3" key={subject.id}>
                                                <div className="tw-col-span-4">
                                                    <SelectInput
                                                        name={`assignSubjects[${index}].subjectId`}
                                                        valueKey="subjectId"
                                                        textKey="subjectName"
                                                        menuItems={getExamSubjectsByClassResp || []}
                                                        value={examSubjectForm.values.assignSubjects[index].subjectId}
                                                        onChange={examSubjectForm.handleChange}
                                                        invalid={inputFieldTouched.subjectId && !!inputFieldErrors.subjectId}
                                                        error={inputFieldTouched.subjectId ? inputFieldErrors.subjectId : ""}
                                                        isDisabled={applicationId && true}
                                                    />
                                                </div>

                                                <div className="tw-col-span-4">
                                                    <TextInput
                                                        name={`assignSubjects[${index}].maxMarks`}
                                                        value={examSubjectForm.values.assignSubjects[index].maxMarks}
                                                        onChange={examSubjectForm.handleChange}
                                                        invalid={inputFieldTouched.maxMarks && !!inputFieldErrors.maxMarks}
                                                        error={inputFieldTouched.maxMarks ? inputFieldErrors.maxMarks : ""}
                                                    />
                                                </div>

                                                <div className="tw-col-span-3">
                                                    <TextInput
                                                        name={`assignSubjects[${index}].passMarks`}
                                                        value={examSubjectForm.values.assignSubjects[index].passMarks}
                                                        onChange={examSubjectForm.handleChange}
                                                        invalid={inputFieldTouched.passMarks && !!inputFieldErrors.passMarks}
                                                        error={inputFieldTouched.passMarks ? inputFieldErrors.passMarks : ""}
                                                    />
                                                </div>

                                                {/* Optional Remove Button */}
                                            </div>
                                        );
                                    })}
                            </>
                        );
                    }}
                </FieldArray>
            </FormikProvider>

            {/* Form Footer Buttons */}
            <div className="tw-flex tw-justify-end tw-gap-2 tw-p-3">
                <Button
                    type="button"
                    variant='secondary'
                    onClick={props.toggle}
                >
                    Cancel
                </Button>

                <Button
                    type="submit"
                    variant='primary'
                    disabled={showApiLoader}
                >
                    Save
                </Button>
            </div>
        </form>
    )
}

export default ExamSubjectsModal
