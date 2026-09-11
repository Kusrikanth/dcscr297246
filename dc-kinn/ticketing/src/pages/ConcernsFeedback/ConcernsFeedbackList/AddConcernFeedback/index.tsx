import React, { useEffect, useMemo, useRef, useState } from 'react'
import BreadCrumb from '../../../../Components/Common/BreadCrumb'
import { AutoSearchInputUpdated, AvatarGroupUpdated, DateInput, ModalContainerUpdated, MultiSelectCheckbox, MultipleFileUpload, QuillEditor, SelectInput, TextInput } from '../../../../Components/Common'
import { useFormik } from 'formik';
import { accessRoles, categoriesOptions, concernByOptions, priorityOptions, renderOptionsEmployee, renderValueEmployee, requestType } from './helper';
import { useAppSelector } from '../../../../hooks/storehook';
import { shallowEqual, useDispatch } from 'react-redux';
import { getComplaintDepartmentListAct } from '../../../../store/concernsfeedback/complaintdepartment/complaintdepartmentaction';
import { generateActionPayload } from '../../../../utility/reduxutility';
import { getEmployeeByFilterAct } from '../../../../store/directory/employeemanagement/employeemanagementactions';
import { getAllParentsListAct, getStudentByFilterAct, getStudentsListAct } from '../../../../store/directory/studentmanagement/studentmanagementactions';
import { addConcernsFeedbackListAct } from '../../../../store/concernsfeedback/concernsfeedbacklist/concernsfeedbacklistaction';
import * as Yup from "yup";
import { toast } from 'react-toastify';
import { useHistory, useLocation } from 'react-router-dom';
import EmployeeDetailModal from '../EmployeeDetailModal';

const initialValues = {
    subject: "",
    description: "",
    priority: "",
    moduleId: "",
    // status: "",
    concernBy: "EMPLOYEE",
    categories: "ACADEMIC",
    departmentId: "",
    departmentName: "",
    deptHeadName: [],
    employeeId: "",
    parentId: "",
    studentId: "",
    requestType: "",
    targetDate: "",
    assignee: [],
    document: [],
};

function getValidationSchema(userRole: any) {
    return (
        Yup.object().shape({
            subject: Yup.string().required("Subject is required.").nullable(),
            concernBy: Yup.string().nullable().test('is-concernby-required', 'Concern By is required', function (value) {
                if (!value && !accessRoles.includes(userRole)) {
                    return false;
                }
                return true;
            }).nullable(),
            // description: Yup.string().required("Description is required.").nullable(),
            priority: Yup.string().nullable().test('is-priority-required', 'Priority is required', function (value) {
                if (!value && !accessRoles.includes(userRole)) {
                    return false;
                }
                return true;
            }).nullable(),
            departmentId: Yup.string().required("Department is required.").nullable(),
            departmentName: Yup.string(),
            // document: Yup.array().test('is-files-required', 'At least one file is required', function (value) {
            //     if (!value || value.length === 0) {
            //         return false;
            //     }
            //     return true;
            // }),
            // assignee: Yup.array().test('is-files-required', 'At least one Assignee is required', function (value) {
            //     if ((!value || value.length === 0) && !accessRoles.includes(userRole)) {
            //         return false;
            //     }
            //     return true;
            // }),
            employeeId: Yup.string().when('concernBy', {
                is: (concernBy: any) => (concernBy === "EMPLOYEE" && !accessRoles.includes(userRole)),
                then: Yup.string()
                    .required('Employee is required.')
            }).nullable(),
            parentId: Yup.string().when('concernBy', {
                is: (concernBy: any) => (concernBy === "PARENT" && !accessRoles.includes(userRole)),
                then: Yup.string()
                    .required('Parent is required.')
            }).nullable(),
            // requestType: Yup.string().required('Request Type is required').nullable(),
            moduleId: Yup.string()
                .when('departmentName', {
                    is: (departmentName: string) => departmentName === 'Digital Campus',
                    then: Yup.string().required('Module is required.')        
                }).nullable(),
        })
    )
}

const AddConcernFeedback = () => {
    const location = useLocation<{ pathName: string }>();
    const [document, setDocument] = useState<any>([]);
    const [searchEmployeeState, setSearchEmployeeState] = useState<any>(undefined);
    const [searchStudentState, setSearchStudentState] = useState<any>(undefined);
    const [searchParentState, setSearchParentState] = useState<any>(undefined);
    const [employeeDetailModalState, setEmployeeDetailModalState] = useState<any>({
        showModal: false,
        employees: undefined
    })
    const dispatch = useDispatch()
    const history = useHistory();

    const {
        academicYearListResp,
        getComplaintDepartmentListResp,
        currentInstIdResp: instituteId,
        currentBranchIdResp: branchId,
        loggedInUserRole,
        showApiLoader,
        allParentsListResp,
        userMeResp,
        getEmployeesByFilterResp,
        concernsFeedbackErrResp,
        addConcernsFeedbackListResp,
        getStudentsByFilterResp,
        allModulesListResp,
        currentStudentId, 
        parentChildrensResp,
        instituteListResp,
    } =
        useAppSelector(({ appData, directoryEmployee, directoryStudent, instAcademics, globalData, concernsFeedback, complaintDepartment, login, instituteInfo }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            currentInstIdResp: appData.currentInstIdResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            loggedInUserRole: appData.loggedInUserRole,
            getComplaintDepartmentListResp: complaintDepartment.getComplaintDepartmentListResp,
            showApiLoader: globalData.showApiLoader,
            getEmployeesByFilterResp: directoryEmployee.getEmployeesByFilterResp,
            allParentsListResp: directoryStudent.allParentsListResp,
            getStudentsByFilterResp: directoryStudent.getStudentsByFilterResp,
            userMeResp: login.userMeResp,
            concernsFeedbackErrResp: concernsFeedback.concernsFeedbackErrResp,
            addConcernsFeedbackListResp: concernsFeedback.addConcernsFeedbackListResp,
            allModulesListResp: concernsFeedback.allModulesListResp,
            currentStudentId: appData.currentStudentId,
            parentChildrensResp: directoryStudent.parentChildrensResp,
            instituteListResp: instituteInfo.instituteListResp,
        }), shallowEqual);

    const addConcernFeedbackRef = useRef({
        prevConcernsFeedbackErrResp: concernsFeedbackErrResp,
        prevAddConcernsFeedbackListResp: addConcernsFeedbackListResp,
    });

    useEffect(() => {
        const { prevConcernsFeedbackErrResp, prevAddConcernsFeedbackListResp } = addConcernFeedbackRef.current;
        if (addConcernsFeedbackListResp && addConcernsFeedbackListResp !== prevAddConcernsFeedbackListResp) {
            toast.success("Complaint Created Successfully");
            if (location.state.pathName) {
                history.push(location.state.pathName);
            }
            // history.push("/concerns-feedback");
        }
        else if (concernsFeedbackErrResp && concernsFeedbackErrResp !== prevConcernsFeedbackErrResp) {
            const { details }: any = concernsFeedbackErrResp;
            toast.error(details || "Something went wrong.");
        }

        addConcernFeedbackRef.current.prevAddConcernsFeedbackListResp = addConcernsFeedbackListResp;
        addConcernFeedbackRef.current.prevConcernsFeedbackErrResp = concernsFeedbackErrResp;

    }, [concernsFeedbackErrResp, addConcernsFeedbackListResp,]);

    function getComplaintDeptApiCall(otherProps?: any) {
        const payload = { branchId, category: "ACADEMIC", pageNo: 0, pageSize: 500, ...otherProps };
        dispatch(getComplaintDepartmentListAct(generateActionPayload("get_complaint_dept_list", undefined, { ...payload })));
    }

    const selectedChild = useMemo(() => {
        if (Array.isArray(parentChildrensResp) && parentChildrensResp.length > 0) {
            return parentChildrensResp.find(item => item.childId?.toString() === currentStudentId?.toString());
        }
        return {};
    }, [parentChildrensResp, currentStudentId]);

    const addConcernFeedbackForm = useFormik({
        initialValues,
        validationSchema: getValidationSchema(userMeResp?.role?.name),
        onSubmit: (values) => {

            let { academicYearId } = academicYearListResp?.data.find((year: any) => year?.yearStatus?.toLowerCase() === "current") || {};

            const { subject, description, priority, departmentId, assignee, document, employeeId, parentId, concernBy, requestType, targetDate, moduleId } = values || {};
            const getFormattedDateTime = (dateStr: string) => {
                if (!dateStr) return null;

                const now = new Date();
                const timePart = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

                return `${dateStr}T${timePart}`;
            };

            const formattedTargetDate = getFormattedDateTime(targetDate);
            const payload: any = {
                subject,
                description,
                priority: priority || null,
                complaintDepartmentId: departmentId,
                assigneeIds: (assignee?.length > 0) ? assignee?.map((i: any) => i?.id) : [],
                source: "WEB",
                complaintUserType: ["PARENT", "STUDENT", "EMPLOYEE"].includes(userMeResp?.role?.name) ? userMeResp?.role?.name : (accessRoles.includes(concernBy) ? concernBy : "OTHERS"),
                branchId,
                academicYearId,
                // requestType,
                targetDate: formattedTargetDate,
                moduleId,
                ...(loggedInUserRole === "PARENT_ROLE" && {
                    studentId: selectedChild?.childId,
                    branchId: selectedChild?.childBranchId,
                    studentClassSection: selectedChild?.sectionName
                        ? `${selectedChild?.sectionName}`
                        : selectedChild?.classShortName,
                }),
                adminBy: accessRoles.includes(userMeResp?.role?.name) ? null : (concernBy === "PARENT" ? parentId : employeeId)
            }
            if (requestType) {
                payload.requestType = requestType
            }

            let formData = new FormData();
            formData.append("request", JSON.stringify(payload));
            if (document?.length > 0) {
                for (let i = 0; i < document?.length; i++) {
                    formData.append("multipartFile", document[i]);
                }
            }

            dispatch(addConcernsFeedbackListAct(generateActionPayload("add_concern_feedback_list", undefined, formData)));
        },
    });

    console.log({ addConcernFeedbackForm: addConcernFeedbackForm.errors });

    useEffect(() => {
        getComplaintDeptApiCall()
    }, [])

    const toggleEmployeeDetailModal = (assignee?: any) => {
        setEmployeeDetailModalState((prev: any) => ({
            ...prev,
            showModal: !prev.showModal,
            employees: assignee?.length > 0 ? assignee : [],
        }))
    }


    const onChangeFilterHndlr = (event: any) => {
        const { name, value } = event.target;

        if (name === "departmentId") {
            const findData = getComplaintDepartmentListResp?.data?.find((item: any) => +item?.id === +value)
            addConcernFeedbackForm.setValues((prev: any) => ({
                ...prev,
                [name]: value,
                departmentName: findData?.departmentName,
                deptHeadName: findData?.headsDtos || [],
            }));
        }
        else if (name === "concernBy") {
            if (value === "PARENT") {
                addConcernFeedbackForm.setValues((prev: any) => ({ ...prev, [name]: value, employeeId: "", studentId: "", }))
                setSearchEmployeeState(undefined)
                setSearchStudentState(undefined)
            } else if (value === "EMPLOYEE") {
                addConcernFeedbackForm.setValues((prev: any) => ({ ...prev, [name]: value, parentId: "", studentId: "", }))
                setSearchParentState(undefined)
                setSearchStudentState(undefined)
            }
            else if (value === "STUDENT") {
                addConcernFeedbackForm.setValues((prev: any) => ({ ...prev, [name]: value, parentId: "", employeeId: "" }))
                setSearchEmployeeState(undefined)
                setSearchParentState(undefined)
            }
            else {
                setSearchParentState(undefined)
                setSearchEmployeeState(undefined)
                setSearchStudentState(undefined)
                addConcernFeedbackForm.setValues((prev: any) => ({ ...prev, [name]: value, employeeId: "", parentId: "", studentId: "" }))
            }
        } else if (name === "categories") {
            if (value) {
                addConcernFeedbackForm.setValues((prev: any) => ({ ...prev, [name]: value, departmentId: "", deptHeadName: [] }));
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

    function onSearchMultiSelectHandler(name: any, value: any) {
        if (value) {
            const params = { searchString: value };
            const payload = { instituteGroupId: "" }
            if (Array.isArray(instituteListResp?.data) && instituteListResp?.data.length > 0) {
                payload.instituteGroupId = instituteListResp?.data.find((item: any) => +item?.id === +instituteId)?.instituteGroupId
            }
            dispatch(getEmployeeByFilterAct(generateActionPayload("get_employee_by_name", params, { ...payload })));
        }
    }

    function selectEmployeeHndlr(selectedOptions: any, config?: any) {

        const { name } = config;
        if (Array.isArray(selectedOptions) && selectedOptions.length > 0) {
            addConcernFeedbackForm.setValues((prevState: any) => ({ ...prevState, [name]: selectedOptions }));
        } else {
            addConcernFeedbackForm.setValues((prevState: any) => ({ ...prevState, [name]: null }));
        }

    }

    function onInputSearchChange(inputString: any) {
        if (inputString) {
            const params = { searchString: inputString };
            dispatch(getEmployeeByFilterAct(generateActionPayload("get_employee_by_name", params, { branchId })));
        }
    }

    function onInputParentSearchChange(inputString: any) {
        if (inputString) {
            const { academicYearId }: any = academicYearListResp?.data.find((item: any) => item?.yearStatus?.toLowerCase() === "current") || {};
            const params = { searchString: inputString, academicYearId, branchId };
            dispatch(getAllParentsListAct(generateActionPayload("get_all_parents", undefined, params)));
        }
    }
    function onInputStudentSearchChange(inputString: any) {
        if (inputString) {
            const { academicYearId }: any = academicYearListResp?.data.find((item: any) => item?.yearStatus?.toLowerCase() === "current") || {};

            const payload = {
                branchId, academicYearId, studentName: inputString,
            }
            dispatch(getStudentByFilterAct(generateActionPayload("get_students_by_name", undefined, {
                branchId, academicYearId, studentName: inputString,
            })));
        }
    }

    function selectSingleEmployeeHndlr(selectedEmployee: any) {
        setSearchEmployeeState(selectedEmployee);
        if (selectedEmployee) {
            const { id } = selectedEmployee;
            addConcernFeedbackForm.setValues((prevState: any) => ({ ...prevState, employeeId: id }));
        } else {
            addConcernFeedbackForm.setValues((prevState: any) => ({ ...prevState, employeeId: null }));
        }
    }

    function selectSingleParentHndlr(selectedEmployee: any) {
        setSearchParentState(selectedEmployee);
        if (selectedEmployee) {
            const { userId } = selectedEmployee;
            addConcernFeedbackForm.setValues((prevState: any) => ({ ...prevState, parentId: userId }));
        } else {
            addConcernFeedbackForm.setValues((prevState: any) => ({ ...prevState, parentId: null }));
        }
    }

    function selectSingleStudentHndlr(selectedEmployee: any) {
        setSearchParentState(selectedEmployee);
        if (selectedEmployee) {
            const { userId } = selectedEmployee;
            addConcernFeedbackForm.setValues((prevState: any) => ({ ...prevState, parentId: userId }));
        } else {
            addConcernFeedbackForm.setValues((prevState: any) => ({ ...prevState, parentId: null }));
        }
    }

    const onChangeQuillHndlr = (content: any) => {
        addConcernFeedbackForm.setValues((prevState: any) => ({ ...prevState, description: content }));
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
                                                //   formgroupClassName="mb-0"
                                                invalid={(addConcernFeedbackForm.touched.subject && addConcernFeedbackForm.errors.subject) ? true : false}
                                                error={(addConcernFeedbackForm.touched.subject && addConcernFeedbackForm.errors.subject) ? addConcernFeedbackForm.errors.subject : ""}
                                                labelText='Subject'
                                                maxLength={50}
                                                placeHolder='Enter Subject'
                                                labelClass='required'
                                            />
                                        </div>
                                        <div className='col-12'>
                                            {/* <TextArea
                                                name="description"
                                                value={addConcernFeedbackForm.values.description}
                                                onChange={onChangeFilterHndlr}
                                                onBlur={addConcernFeedbackForm.handleBlur}
                                                // formgroupClassName="mb-0"
                                                invalid={(addConcernFeedbackForm.touched.description && addConcernFeedbackForm.errors.description) ? true : false}
                                                error={(addConcernFeedbackForm.touched.description && addConcernFeedbackForm.errors.description) ? addConcernFeedbackForm.errors.description : ""}
                                                labelText="Description"
                                                labelClass='required'
                                                height='15.8rem'
                                            /> */}
                                            <QuillEditor
                                                name="description"
                                                value={addConcernFeedbackForm.values.description}
                                                onChange={onChangeQuillHndlr}
                                                // onBlur={addConcernFeedbackForm.handleBlur}
                                                // formgroupClassName="mb-0"
                                                invalid={(addConcernFeedbackForm.touched.description && addConcernFeedbackForm.errors.description) ? true : false}
                                                error={(addConcernFeedbackForm.touched.description && addConcernFeedbackForm.errors.description) ? addConcernFeedbackForm.errors.description : ""}
                                                labelText="Description"
                                                labelClass='required'
                                            />
                                        </div>
                                        <div className='col-12'>
                                            <div className='row'>
                                                {!accessRoles.includes(userMeResp?.role?.name) && <><div className='col-md-4 col-12'>
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
                                                        // inputClassName="bg-light border-0"
                                                        formgroupClassName="mb-0"
                                                        labelText='Priority'
                                                        defaultSelect='Select'
                                                    />
                                                </div>
                                                    <div className='col-md-4 col-12'>
                                                        <SelectInput
                                                            name="requestType"
                                                            value={addConcernFeedbackForm.values.requestType}
                                                            onChange={addConcernFeedbackForm.handleChange}
                                                            menuItems={requestType || []}
                                                            valueKey="reqType"
                                                            textKey="name"
                                                            // inputClassName="bg-light border-0"
                                                            formgroupClassName="mb-0"
                                                            labelText='Request Type'
                                                            defaultSelect='Select'
                                                        // labelClass='required'
                                                        // invalid={(addConcernFeedbackForm.touched.requestType && addConcernFeedbackForm.errors.requestType) ? true : false}
                                                        // error={(addConcernFeedbackForm.touched.requestType && addConcernFeedbackForm.errors.requestType) ? addConcernFeedbackForm.errors.requestType : ""}
                                                        />
                                                    </div>
                                                    <div className='col-md-4 col-12'>
                                                        <DateInput
                                                            name="targetDate"
                                                            formgroupClassName="mb-0"
                                                            labelText='Target Date'
                                                            value={addConcernFeedbackForm.values.targetDate}
                                                            onChange={addConcernFeedbackForm.handleChange}
                                                        />
                                                    </div></>}
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
                                            {!accessRoles.includes(userMeResp?.role?.name) ? <div className='row'>
                                                <div className='col-12'>

                                                    <SelectInput
                                                        name="concernBy"
                                                        value={addConcernFeedbackForm.values.concernBy}
                                                        onChange={onChangeFilterHndlr}
                                                        menuItems={concernByOptions || []}
                                                        valueKey="id"
                                                        textKey="name"
                                                        defaultSelect='Select'
                                                        invalid={(addConcernFeedbackForm.touched.concernBy && addConcernFeedbackForm.errors.concernBy) ? true : false}
                                                        error={(addConcernFeedbackForm.touched.concernBy && addConcernFeedbackForm.errors.concernBy) ? addConcernFeedbackForm.errors.concernBy : ""}
                                                    />
                                                </div>
                                                {addConcernFeedbackForm.values.concernBy === "EMPLOYEE" &&
                                                    <div className='col-12'>
                                                        <AutoSearchInputUpdated
                                                            formgroupClassName="search-box"
                                                            name="employeeId"
                                                            placeHolder="Search Employee..."
                                                            onChange={onInputSearchChange}
                                                            valueKey="userId"
                                                            labelKey="employeeCode"
                                                            subLabelKey="employeeName"
                                                            labelHeader="Employee Code"
                                                            subLabelHeader="Employee Name"
                                                            options={getEmployeesByFilterResp}
                                                            selected={searchEmployeeState}
                                                            invalid={(addConcernFeedbackForm.touched.employeeId && addConcernFeedbackForm.errors.employeeId) ? true : false}
                                                            error={(addConcernFeedbackForm.touched.employeeId && addConcernFeedbackForm.errors.employeeId) ? addConcernFeedbackForm.errors.employeeId : ""}
                                                            selectedOptionCallbck={selectSingleEmployeeHndlr}
                                                        ><i className="ri-search-line search-icon"></i></AutoSearchInputUpdated>
                                                    </div>}
                                                {addConcernFeedbackForm.values.concernBy === "PARENT" &&
                                                    <div className='col-12'>
                                                        <AutoSearchInputUpdated
                                                            formgroupClassName="search-box"
                                                            name="parentId"
                                                            placeHolder="Search Parent..."
                                                            onChange={onInputParentSearchChange}
                                                            valueKey="userId"
                                                            labelKey="parentCode"
                                                            subLabelKey="fatherName"
                                                            labelHeader="Father Code"
                                                            subLabelHeader="Father Name"
                                                            options={allParentsListResp?.data || []}
                                                            selected={searchParentState}
                                                            invalid={(addConcernFeedbackForm.touched.parentId && addConcernFeedbackForm.errors.parentId) ? true : false}
                                                            error={(addConcernFeedbackForm.touched.parentId && addConcernFeedbackForm.errors.parentId) ? addConcernFeedbackForm.errors.parentId : ""}
                                                            selectedOptionCallbck={selectSingleParentHndlr}
                                                        ><i className="ri-search-line search-icon"></i></AutoSearchInputUpdated>
                                                    </div>}
                                                {addConcernFeedbackForm.values.concernBy === "STUDENT" &&
                                                    <div className='col-12'>
                                                        <AutoSearchInputUpdated
                                                            formgroupClassName="search-box"
                                                            name="studentId"
                                                            placeHolder="Search Student..."
                                                            onChange={onInputStudentSearchChange}
                                                            valueKey="id"
                                                            labelKey="studentCode"
                                                            subLabelKey="name"
                                                            labelHeader="Student Code"
                                                            subLabelHeader="Student Name"
                                                            options={getStudentsByFilterResp || []}
                                                            selected={searchStudentState}
                                                            selectedOptionCallbck={selectSingleStudentHndlr}
                                                        ><i className="ri-search-line search-icon"></i></AutoSearchInputUpdated>
                                                    </div>}
                                            </div> :
                                                <div className='row'>
                                                    <div className='col-12'>
                                                        <TextInput
                                                            name="concernBy"
                                                            value={userMeResp?.role?.name}
                                                            onChange={undefined}
                                                            isDisabled={true}
                                                            isReadOnly={true}
                                                        />
                                                    </div>
                                                </div>
                                            }
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
                                                        // inputClassName="bg-light border-0"
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
                                                        // inputClassName="bg-light border-0"
                                                        labelText='Department'
                                                        defaultSelect='Select'
                                                    />
                                                </div>
                                                {(addConcernFeedbackForm.values.departmentName === "Digital Campus") && < div className='col-12'>
                                                    <SelectInput
                                                        name="moduleId"
                                                        value={addConcernFeedbackForm.values.moduleId}
                                                        onChange={onChangeFilterHndlr}
                                                        menuItems={allModulesListResp}
                                                        valueKey="id"
                                                        textKey="moduleName"
                                                        labelText='Module'
                                                        invalid={(addConcernFeedbackForm.touched.moduleId && addConcernFeedbackForm.errors.moduleId) ? true : false}
                                                        error={(addConcernFeedbackForm.touched.moduleId && addConcernFeedbackForm.errors.moduleId) ? addConcernFeedbackForm.errors.moduleId : ""}
                                                        defaultSelect='Select'
                                                    />
                                                </div>}

                                                <div className='col-12'>

                                                    {addConcernFeedbackForm.values.deptHeadName?.length > 0 &&
                                                        (<>
                                                            <label className='form-label'>Department Head</label> <AvatarGroupUpdated
                                                                avatars={addConcernFeedbackForm.values.deptHeadName || []}
                                                                imageKey="employeeImage"
                                                                tooltipKey="departmentHeadName"
                                                                numberOfAvatarToShow={3}
                                                                dataId={addConcernFeedbackForm.values.departmentId}
                                                                showLimitedAvatar={true}
                                                                showAvatarName={true}
                                                                uniqueAvatarKey="id"
                                                                onClickMoreAvatarHndlr={(event: any) => toggleEmployeeDetailModal(addConcernFeedbackForm.values.deptHeadName)}
                                                            />
                                                        </>)
                                                    }
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
                        {(loggedInUserRole === 'INSTITUTE_ADMIN') && <div className='col-md-4 col-12'>
                            <div className='card'>
                                <div className='card-header'>
                                    <h4 className='card-title mb-0'>
                                        Members
                                    </h4>
                                </div>
                                <div className='card-body'>
                                    <div className='row'>
                                        <div className='col-12'>

                                            <MultiSelectCheckbox
                                                name="assignee"
                                                labelText='Assigned to'
                                                containerClassName='mb-3'
                                                idKey="id"
                                                // labelClass='required'
                                                // invalid={(addConcernFeedbackForm.touched.assignee && addConcernFeedbackForm.errors.assignee) ? true : false}
                                                // error={(addConcernFeedbackForm.touched.assignee && addConcernFeedbackForm.errors.assignee) ? addConcernFeedbackForm.errors.assignee : ""}
                                                value={addConcernFeedbackForm.values.assignee}
                                                renderValue={renderValueEmployee}
                                                renderOptions={renderOptionsEmployee}
                                                onChange={selectEmployeeHndlr}
                                                onSearchHandler={onSearchMultiSelectHandler}
                                                options={getEmployeesByFilterResp}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>}
                        <div className='col-md-8 col-12'>
                            <div className='d-flex justify-content-end mb-4'>
                                {/* <div>
                            <button className='btn btn-light me-2 text-black'>Reset</button>
                        </div> */}
                                <div>
                                    <button className='btn btn-success' disabled={showApiLoader} onClick={(e: any) => addConcernFeedbackForm.handleSubmit(e)}>Create</button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div >

            <ModalContainerUpdated
                id="all-employees-details"
                isOpen={employeeDetailModalState.showModal}
                toggle={() => toggleEmployeeDetailModal()}
                modalTitle="Department Heads"
                modalSize="md"
            >
                <EmployeeDetailModal employeeList={employeeDetailModalState?.employees || []} />

            </ModalContainerUpdated>
        </>
    )
}

export default AddConcernFeedback