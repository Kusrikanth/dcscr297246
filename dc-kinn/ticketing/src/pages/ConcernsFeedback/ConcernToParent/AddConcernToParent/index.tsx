import React, { useEffect, useRef, useState } from 'react'
import BreadCrumb from '../../../../Components/Common/BreadCrumb'
import { AutoSearchInputUpdated, CustomSelect, MultipleFileUpload, QuillEditor, SelectInput, TextInput } from '../../../../Components/Common'
import { useFormik } from 'formik';
import { categoriesOptions, concernByOptions, priorityOptions, renderOptionsSection, renderValueSection } from './helper';
import { useAppDispatch, useAppSelector } from '../../../../hooks/storehook';
import { shallowEqual } from 'react-redux';
import { getComplaintDepartmentListAct } from '../../../../store/concernsfeedback/complaintdepartment/complaintdepartmentaction';
import { generateActionPayload } from '../../../../utility/reduxutility';
import { getStudentsListAct } from '../../../../store/directory/studentmanagement/studentmanagementactions';
import { getConcernsToParentSectionListAct, saveConcernsToParentListAct } from '../../../../store/concernsfeedback/concernsfeedbacklist/concernsfeedbacklistaction';
import * as Yup from "yup";
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';

const initialValues = {
    subject: "",
    description: "",
    priority: "",
    concernBy: "EMPLOYEE",
    categories: "ACADEMIC",
    departmentId: "",
    studentId: "",
    document: [],
    sectionId: "",
    curriculumId: "",
    academicYearId: "",
    classId: "",
    className: "",
    curriculumName: "",
    sectionName: "",
    studentName: "",
};

const validationSchema = Yup.object().shape({
    subject: Yup.string().required("Subject is required.").nullable(),
    // description: Yup.string().required("Description is required.").nullable(),
    priority: Yup.string().nullable().required("Priority is required."),
    departmentId: Yup.string().required("Department is required.").nullable(),
    sectionId: Yup.string().required("Section is required.").nullable(),
    studentId: Yup.string().required("Student is required.").nullable(),
})

const AddConcernFeedback = () => {

    const [document, setDocument] = useState<any>([]);
    const [selectedStudentState, setSelectedStudentState] = useState<any>(null);
    const dispatch = useAppDispatch()
    const history = useHistory();

    const {
        academicYearListResp,
        getComplaintDepartmentListResp,
        currentInstIdResp: instituteId,
        currentBranchIdResp: branchId,
        showApiLoader,
        userMeResp,
        concernsFeedbackErrResp,
        saveConcernsToParentListResp,
        studentsListResp,
        getConcernsToParentSectionListResp,
    } =
        useAppSelector(({ appData, directoryStudent, instAcademics, globalData, concernsFeedback, complaintDepartment, login }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            currentInstIdResp: appData.currentInstIdResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            getComplaintDepartmentListResp: complaintDepartment.getComplaintDepartmentListResp,
            showApiLoader: globalData.showApiLoader,
            studentsListResp: directoryStudent.studentsListResp,
            userMeResp: login.userMeResp,
            concernsFeedbackErrResp: concernsFeedback.concernsFeedbackErrResp,
            saveConcernsToParentListResp: concernsFeedback.saveConcernsToParentListResp,
            getConcernsToParentSectionListResp: concernsFeedback.getConcernsToParentSectionListResp,
        }), shallowEqual);

    const addConcernFeedbackRef = useRef({
        prevConcernsFeedbackErrResp: concernsFeedbackErrResp,
        prevSaveConcernsToParentListResp: saveConcernsToParentListResp,
    });

    useEffect(() => {
        const { prevConcernsFeedbackErrResp, prevSaveConcernsToParentListResp } = addConcernFeedbackRef.current;

        if (saveConcernsToParentListResp && saveConcernsToParentListResp !== prevSaveConcernsToParentListResp) {
            toast.success("Complaint Created Successfully");
            history.push("/concerns-to-parent");
        }
        else if (concernsFeedbackErrResp && concernsFeedbackErrResp !== prevConcernsFeedbackErrResp) {
            const { details } = concernsFeedbackErrResp || {};
            toast.error(details || "Something went wrong.");
        }

        addConcernFeedbackRef.current.prevSaveConcernsToParentListResp = saveConcernsToParentListResp;
        addConcernFeedbackRef.current.prevConcernsFeedbackErrResp = concernsFeedbackErrResp;

    }, [concernsFeedbackErrResp, saveConcernsToParentListResp,]);

    useEffect(() => {
        if (academicYearListResp && userMeResp) {
            const { academicYearId } = academicYearListResp?.data.find((year: any) => year?.yearStatus?.toLowerCase() === "current") || {};
            const payload = {
                userId: userMeResp?.id,
                academicYearId,
                branchId
            }
            addConcernFeedbackForm.setFieldValue("academicYearId", academicYearId);
            dispatch(getConcernsToParentSectionListAct(generateActionPayload("get_concerns_to_parent_section_list", undefined, { ...payload })));
        }

    }, [academicYearListResp])


    function getComplaintDeptApiCall(otherProps?: any) {
        const payload = { branchId, category: "ACADEMIC", pageNo: 0, pageSize: 500, ...otherProps };
        dispatch(getComplaintDepartmentListAct(generateActionPayload("get_complaint_dept_list", undefined, { ...payload })));
    }

    const addConcernFeedbackForm = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values) => {

            const { subject, description, priority, departmentId, document, academicYearId, studentId } = values || {};
            const payload = {
                instituteId,
                branchId,
                academicYearId,
                subject,
                description,
                priority: priority || null,
                complaintDepartmentId: departmentId,
                studentIds: [studentId],
                complaintUserType: "EMPLOYEE",

            }

            let formData = new FormData();
            formData.append("request", JSON.stringify(payload));
            if (document?.length > 0) {
                for (let i = 0; i < document?.length; i++) {
                    formData.append("file", document[i]);
                }
            }

            dispatch(saveConcernsToParentListAct(generateActionPayload("save_concerns_to_parent_list", undefined, formData)));
        },
    });


    useEffect(() => {
        getComplaintDeptApiCall()
    }, [])


    const onChangeFilterHndlr = (event: any) => {
        const { name, value } = event.target;

        if (name === "departmentId") {
            addConcernFeedbackForm.setValues((prev: any) => ({ ...prev, [name]: value }))
        }
        else if (name === "categories") {
            if (value) {
                addConcernFeedbackForm.setValues((prev: any) => ({ ...prev, [name]: value }))
                getComplaintDeptApiCall({ category: value });
            }
        }
        else {
            addConcernFeedbackForm.setValues((prev: any) => ({ ...prev, [name]: value }))
        }
    }

    const handleFileChange = (files: any) => {
        setDocument(files);
        addConcernFeedbackForm.setFieldValue('document', files);
    }

    function onInputSearchChange(inputString: any) {
        const { academicYearId, classId, curriculumId, sectionId } = addConcernFeedbackForm.values || {};
        if (academicYearId && classId && curriculumId && sectionId && inputString) {
            const params = {
                branchId, academicYearId, classId, sectionId,
                curriculumId, searchString: inputString,
            };
            dispatch(getStudentsListAct(generateActionPayload("get_students", undefined, params)));
        }
    }

    const onChangeQuillHndlr = (content: any) => {
        addConcernFeedbackForm.setValues((prevState: any) => ({ ...prevState, description: content }));
    }

    function selectSectionHndlr(selectedOptions: any, config?: any) {
        const { name } = config;
        const { curriculumId, classId, } = getConcernsToParentSectionListResp.find((item: any) => +item.sectionId === +selectedOptions) || {}
        addConcernFeedbackForm.setValues((prevState: any) => ({ ...prevState, [name]: selectedOptions, curriculumId, classId, }));
    }

    function selectedStudentHndlr(selectedStudent: any) {
        setSelectedStudentState(selectedStudent);
        const { studentId, className, curriculumName, sectionName, studentName } = selectedStudent || {};
        if (studentId) {
            addConcernFeedbackForm.setValues((prevState: any) => ({ ...prevState, studentId, className, curriculumName, sectionName, studentName }));
        } else {
            addConcernFeedbackForm.setValues((prevState: any) => ({ ...prevState, studentId: "", className: "", curriculumName: "", sectionName: "", studentName: "", }));
        }
    }

    const cancelHndler = ()=>{
        history.push("/concerns-to-parent");
    }

    return (
        <>
            <div className="page-content">
                <div className="container-fluid">
                    <BreadCrumb title="Students Management" pageTitle="Helpdesk" />
                    <div className="row">
                        <div className="col-md-8 col-12">
                            <div className="card" style={{ height: "95%" }}>

                                <div className="card-body">
                                    <div className='row'>
                                        <div className='col-12'>
                                            <TextInput
                                                name="subject"
                                                value={addConcernFeedbackForm.values.subject}
                                                onChange={onChangeFilterHndlr}
                                                inputClassName="bg-soft-light"
                                                invalid={(addConcernFeedbackForm.touched.subject && addConcernFeedbackForm.errors.subject) ? true : false}
                                                error={(addConcernFeedbackForm.touched.subject && addConcernFeedbackForm.errors.subject) ? addConcernFeedbackForm.errors.subject : ""}
                                                labelText='Subject'
                                                maxLength={50}
                                                placeHolder='Enter Subject'
                                                labelClass='required'
                                            />
                                        </div>
                                        <div className='col-12'>
                                            <QuillEditor
                                                name="description"
                                                value={addConcernFeedbackForm.values.description}
                                                onChange={onChangeQuillHndlr}
                                                invalid={(addConcernFeedbackForm.touched.description && addConcernFeedbackForm.errors.description) ? true : false}
                                                error={(addConcernFeedbackForm.touched.description && addConcernFeedbackForm.errors.description) ? addConcernFeedbackForm.errors.description : ""}
                                                labelText="Description"
                                                labelClass='required'
                                            />
                                        </div>
                                        <div className='col-12'>
                                            <div className='row'>
                                                <div className='col-md-4 col-12'>
                                                    <SelectInput
                                                        name="priority"
                                                        value={addConcernFeedbackForm.values.priority}
                                                        onChange={onChangeFilterHndlr}
                                                        menuItems={priorityOptions || []}
                                                        invalid={(addConcernFeedbackForm.touched.priority && addConcernFeedbackForm.errors.priority) ? true : false}
                                                        error={(addConcernFeedbackForm.touched.priority && addConcernFeedbackForm.errors.priority) ? addConcernFeedbackForm.errors.priority : ""}
                                                        valueKey="id"
                                                        textKey="name"
                                                        labelClass='required'
                                                        formgroupClassName="mb-0"
                                                        labelText='Priority'
                                                        defaultSelect='Select'
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='col-md-4 col-12'>
                            <div className='row'>
                                <div className='col-12'>
                                    <div className='card'>
                                        <div className='card-header'>
                                            <h4 className="card-title mb-0">
                                                Concern By
                                            </h4>
                                        </div>
                                        <div className='card-body'>
                                            <div className='row'>
                                                <div className='col-12'>
                                                    <SelectInput
                                                        name="concernBy"
                                                        value={addConcernFeedbackForm.values.concernBy}
                                                        onChange={undefined}
                                                        menuItems={concernByOptions || []}
                                                        valueKey="id"
                                                        textKey="name"
                                                        defaultSelect='Select'
                                                        isDisabled={true}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='col-12'>
                                    <div className='card'>
                                        <div className='card-header'>
                                            <h4 className="card-title mb-0">
                                                Complaint Department
                                            </h4>
                                        </div>
                                        <div className='card-body'>
                                            <div className='row'>
                                                <div className='col-12'>
                                                    <SelectInput
                                                        name="categories"
                                                        value={addConcernFeedbackForm.values.categories}
                                                        onChange={onChangeFilterHndlr}
                                                        labelText='Categories'
                                                        valueKey="key"
                                                        textKey="name"
                                                        labelClass='required'
                                                        menuItems={categoriesOptions}
                                                    />
                                                </div>
                                                <div className='col-12'>
                                                    <SelectInput
                                                        name="departmentId"
                                                        value={addConcernFeedbackForm.values.departmentId}
                                                        onChange={onChangeFilterHndlr}
                                                        menuItems={getComplaintDepartmentListResp?.data || []}
                                                        invalid={(addConcernFeedbackForm.touched.departmentId && addConcernFeedbackForm.errors.departmentId) ? true : false}
                                                        error={(addConcernFeedbackForm.touched.departmentId && addConcernFeedbackForm.errors.departmentId) ? addConcernFeedbackForm.errors.departmentId : ""}
                                                        valueKey="id"
                                                        textKey="departmentName"
                                                        labelClass='required'
                                                        labelText='Department'
                                                        defaultSelect='Select'
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-md-8 col-12'>
                            <div className='card'>
                                <div className='card-header'>
                                    <h4 className="card-title mb-0">
                                        Attached files
                                    </h4>
                                </div>
                                <div className='card-body'>
                                    <div className='row'>
                                        <div className='col-12 form-text fs-14 text-muted'>
                                            Add Attached files here.
                                        </div>
                                        <div className='col-12 mt-2'>
                                            <MultipleFileUpload
                                                name="document"
                                                prevFiles={document}
                                                onChange={handleFileChange}
                                                containerClass="col-12"
                                                maxSizeInMb={2}
                                                helperText="Note : Max File Size is 2MB"
                                                invalid={(addConcernFeedbackForm.touched.document && addConcernFeedbackForm.errors.document) ? true : false}
                                                error={(addConcernFeedbackForm.touched.document && addConcernFeedbackForm.errors.document) ? addConcernFeedbackForm.errors.document : ""}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {<div className='col-md-4 col-12'>
                            <div className='card'>
                                <div className='card-header'>
                                    <h4 className='card-title mb-0'>
                                        Concerned To
                                    </h4>
                                </div>
                                <div className='card-body'>
                                    <div className='row'>
                                        <div className='col-12'>
                                            <CustomSelect
                                                name="sectionId"
                                                idKey="sectionId"
                                                defaultSelect="Select"
                                                value={addConcernFeedbackForm.values.sectionId}
                                                renderValue={renderValueSection}
                                                renderOptions={renderOptionsSection}
                                                onChange={selectSectionHndlr}
                                                searchKey="sectionName"
                                                labelText='Section'
                                                containerClassName="mb-3"
                                                labelClass='required'
                                                options={getConcernsToParentSectionListResp}
                                                invalid={(addConcernFeedbackForm.touched.sectionId && addConcernFeedbackForm.errors.sectionId) ? true : false}
                                                error={(addConcernFeedbackForm.touched.sectionId && addConcernFeedbackForm.errors.sectionId) ? addConcernFeedbackForm.errors.sectionId : ""}
                                            />
                                        </div>
                                        <div>
                                            <AutoSearchInputUpdated
                                                formgroupClassName="search-box mb-3"
                                                alignRight={true}
                                                name="studentId"
                                                placeHolder="Search..."
                                                onChange={onInputSearchChange}
                                                onBlur={addConcernFeedbackForm.handleBlur}
                                                valueKey="studentId"
                                                labelHeader="Student Code"
                                                labelKey="studentCode"
                                                subLabelHeader="Student Name"
                                                subLabelKey="studentName"
                                                labelText="Student"
                                                labelClass='required'
                                                options={studentsListResp?.data}
                                                selected={selectedStudentState}
                                                selectedOptionCallbck={selectedStudentHndlr}
                                                helperText="Note : Please perform the search after selecting section."
                                                invalid={(addConcernFeedbackForm.touched.studentId && addConcernFeedbackForm.errors.studentId) ? true : false}
                                                error={(addConcernFeedbackForm.touched.studentId && addConcernFeedbackForm.errors.studentId) ? addConcernFeedbackForm.errors.studentId : ""}
                                            ><i className="ri-search-line search-icon"></i></AutoSearchInputUpdated>
                                        </div>
                                        { addConcernFeedbackForm.values.studentId && <div className='col-12'>
                                            <div className=' bg-light rounded'>
                                                <div className="row p-3">
                                                    <div className="col-md-6">
                                                        <strong>Student name : </strong>{selectedStudentState?.studentName}
                                                    </div>
                                                    <div className="col-md-6">
                                                        <strong>Curriculum : </strong>{selectedStudentState?.curriculumName}
                                                    </div>

                                                </div>
                                                <div className="row p-3 pt-0">
                                                    <div className="col-md-6">
                                                        <strong>Class : </strong>{selectedStudentState?.className}
                                                    </div>
                                                    <div className="col-md-6">
                                                        <strong>Section : </strong>{selectedStudentState?.sectionName}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>}
                                    </div>
                                </div>
                            </div>
                        </div>}
                        <div className='col-md-8 col-12'>
                            <div className='d-flex justify-content-end mb-4'>
                                <div>
                                    <button className='btn btn-light me-2 text-black' onClick={cancelHndler} >Cancel</button>
                                </div>
                                <div>
                                    <button className='btn btn-success' disabled={showApiLoader} onClick={(e: any) => addConcernFeedbackForm.handleSubmit(e)}>Create</button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}

export default AddConcernFeedback