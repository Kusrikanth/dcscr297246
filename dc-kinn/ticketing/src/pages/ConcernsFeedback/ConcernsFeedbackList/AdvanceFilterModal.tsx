import React, { useEffect, useState } from 'react'
import { shallowEqual, useDispatch } from 'react-redux';
import { useAppSelector } from '../../../hooks/storehook';
import { getClassListAdvanceFilter, resetClassListForAdvanceFilterAct, setClassListForAdvanceFilterAct } from '../../../store/fee/feecollections/feecollectionactions';
import { generateActionPayload } from '../../../utility/reduxutility';
import { DateInput, SelectInput, MultiSelectCheckbox, CustomSelect, AutoSearchInputUpdated } from '../../../Components/Common';
import { Current_Date_YYYYMMDD } from '../../../utility/dateutility';
import { accessRoles, complaintUserTypeOptions, dateType, priorityFilter, renderOptionsDepartment, renderValueDepartment } from './helper';
import { getComplaintDepartmentListAct } from '../../../store/concernsfeedback/complaintdepartment/complaintdepartmentaction';
import { getEmployeeByFilterAct } from '../../../store/directory/employeemanagement/employeemanagementactions';
import { getConcernsUserListAct, getDepartmentListAct } from '../../../store/concernsfeedback/concernsfeedbacklist/concernsfeedbacklistaction';
import { CustomDatePicker } from '../../DashBoardBranchSummary/CustomDatePicker';
import { requestType } from './AddConcernFeedback/helper';
import Button from '../../../Components/Common/Button';


const initialValues: any = {
    academicYearId: null,
    searchString: null,
    status: null,
    complaintUserType: null,
    priority: null,
    startDate: null,
    endDate: null,
    departmentId: null,
    assigneeId: null,
    selectedEmployee: null,
    complaintUser: null,
    complaintById: null,
    complaintCategory: "",
    requestedType: "",
    dateType: "",
    moduleId: "",
    branchId: "",
};


function renderValue(selectedItems: any) {
    if (Array.isArray(selectedItems)) {
        return (<div className="text-truncate">
            {
                selectedItems.map((item, index) => {
                    return item?.shortName + (index !== (selectedItems.length - 1) ? ', ' : '')
                })
            }
        </div>)
    }
}


const AdvanceFilterModal = (props: any) => {

    const dispatch = useDispatch();

    const [enquiryFilterState, setEnquiryFilterState] = useState<any>(props.appliedFilter || initialValues);
    const [searchEmployeeState, setSearchEmployeeState] = useState<any>(undefined);
    const [searchComplaintByState, setSearchComplaintByState] = useState<any>(undefined);

    const { currentBranchIdResp: branchId, getComplaintDepartmentListResp, currentInstIdResp: instituteId, showApiLoader, getEmployeesByFilterResp, getConcernsUserListResp, loggedInUserRole, allModulesListResp, virtualRoleResp }: any =
        useAppSelector(
            ({ appData, classroomManagmentInfo, globalData, complaintDepartment, directoryEmployee, login, concernsFeedback }) => ({
                currentBranchIdResp: appData.currentBranchIdResp,
                currentInstIdResp: appData.currentInstIdResp,
                loginUserDetailsResp: appData.loginUserDetailsResp,
                showApiLoader: globalData.showApiLoader,
                getComplaintDepartmentListResp: complaintDepartment.getComplaintDepartmentListResp,
                getEmployeesByFilterResp: directoryEmployee.getEmployeesByFilterResp,
                classroomManagmentErrorResp: classroomManagmentInfo.classroomManagmentErrorResp,
                getConcernsUserListResp: concernsFeedback.getConcernsUserListResp,
                loggedInUserRole: appData.loggedInUserRole,
                allModulesListResp: concernsFeedback.allModulesListResp,
                virtualRoleResp: appData.virtualRoleResp
            }),
            shallowEqual
        );


    const showInstituteAdminUI = loggedInUserRole === 'INSTITUTE_ADMIN' && virtualRoleResp;

    const filterHandler = (event: any) => {
        const { name, value } = event.target;

        if (name === "curriculumId") {
            setEnquiryFilterState((prev: any) => ({
                ...prev, [name]: value,
                classId: null,
                selectedClasses: null,
            }))
            dispatch(setClassListForAdvanceFilterAct({}));
            if (value) {
                const payload = { pageNo: 0, pageSize: 100, sortBy: "classSequence", orderBy: "asc", curriculumId: value, branchId };
                dispatch(getClassListAdvanceFilter(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
            }
        }
        else if (name === "complaintCategory") {
            if (value) {
                if (!showInstituteAdminUI && loggedInUserRole !== 'BRANCH_ADMIN') {
                    setEnquiryFilterState((prev: any) => ({ ...prev, [name]: value, departmentId: "" }));
                    getDepartmentListApiCall({ complaintCategory: value, branchId: props.branchId });
                }
                else {
                    setEnquiryFilterState((prev: any) => ({ ...prev, [name]: value, departmentId: "" }));
                    getComplaintDeptApiCall({ complaintCategory: value, branchId });
                }
            }
        }
        else {
            setEnquiryFilterState((prev: any) => ({ ...prev, [name]: value }))
        }
    }

    function applyFilterHndlr() {
        props.toggleAdvanceFilter()

        let updatedFilterState = { ...enquiryFilterState };
        if (updatedFilterState?.startDate && !updatedFilterState?.endDate) {
            props.applyFilterCallback({ ...updatedFilterState, endDate: Current_Date_YYYYMMDD });
        }
        else if (showInstituteAdminUI) {
            const selectedDept = getComplaintDepartmentListResp.data.find(
                (dept: any) => String(dept.id) === String(updatedFilterState.departmentId)
            );
            if (selectedDept) {
                updatedFilterState.departmentName = selectedDept.departmentName;
            }
        }
        else if (!showInstituteAdminUI && loggedInUserRole !== 'BRANCH_ADMIN' && loggedInUserRole !== 'GRIEVANCE') {
            updatedFilterState
        }
        else if (loggedInUserRole === 'INSTITUTE_ADMIN') {
            const selectedDept = getComplaintDepartmentListResp.data.find(
                (dept: any) => String(dept.id) === String(updatedFilterState.departmentId)
            );
            if (selectedDept) {
                updatedFilterState.departmentName = selectedDept.departmentName;
                delete updatedFilterState.departmentId
            }
        }
        else {
            delete updatedFilterState.departmentName;
        }
        props.applyFilterCallback(updatedFilterState);
    }

    function getComplaintDeptApiCall(otherProps?: any) {
        const payload = { branchId, pageNo: 0, pageSize: 100, ...otherProps };
        dispatch(getComplaintDepartmentListAct(generateActionPayload("get_complaint_dept_list", undefined, { ...payload })));
    }


    const getDepartmentListApiCall = ({ branchId, complaintCategory }: { branchId?: string, complaintCategory?: string } = {}) => {
        let payload = {
            branchId,
            complaintCategory
        };
        dispatch(getDepartmentListAct(generateActionPayload("get_department", undefined, payload)));
    };

    useEffect(() => {
        if (!props.isOpen) {
            dispatch(resetClassListForAdvanceFilterAct(undefined));
        }
        else if (!showInstituteAdminUI && loggedInUserRole !== 'BRANCH_ADMIN' && loggedInUserRole !== 'GRIEVANCE') {
            getDepartmentListApiCall({ branchId: props.branchId });
        }
        else {
            if (props.appliedFilter) {
                setSearchEmployeeState(props.appliedFilter?.selectedEmployee)
                setSearchComplaintByState(props.appliedFilter?.complaintUser)
            }
        }

    }, [props.isOpen, showInstituteAdminUI, props.branchId, loggedInUserRole]);

    function onSelectOptionHandler(selectedOptions: any, config?: any) {
        const { name } = config;
        if (name === "departmentId") {
            setEnquiryFilterState((prevState: any) => ({ ...prevState, [name]: selectedOptions }));
        } else {
            if (Array.isArray(selectedOptions) && selectedOptions.length > 0) {
                setEnquiryFilterState((prevState: any) => ({ ...prevState, [name]: selectedOptions }));
            } else {
                setEnquiryFilterState((prevState: any) => ({ ...prevState, [name]: null }));
            }
        }
    }

    function onSelectDepartmentOptionHandler(selectedOptions: any, config?: any) {
        const { name } = config;
        if (Array.isArray(selectedOptions) && selectedOptions.length > 0) {
            setEnquiryFilterState((prevState: any) => ({ ...prevState, departmentName: selectedOptions }));
        } else {
            setEnquiryFilterState((prevState: any) => ({ ...prevState, [name]: null }));
        }
    }

    function renderOptionsStatus(item: any) {
        return item?.name;
    }

    function renderValueStatus(selectedItems: any) {

        if (Array.isArray(selectedItems)) {
            return (<div className="text-truncate">
                {
                    selectedItems.map((item, index) => {
                        return item?.name + (index !== (selectedItems.length - 1) ? ', ' : '')
                    })
                }
            </div>)
        }
    }

    function onSearchAssigneeHandler(value: any) {
        if (value) {
            const params = { searchString: value };
            dispatch(getEmployeeByFilterAct(generateActionPayload("get_employee_by_name", params, { branchId })));
        }
    }
    function onSearchComplaintByHandler(value: any) {
        if (value) {
            const params = { searchString: value, branchId };
            dispatch(getConcernsUserListAct(generateActionPayload("get_concerns_user_list", undefined, { ...params })));
        }
    }

    function selectEmployeeHndlr(selectedEmployee: any) {
        setSearchEmployeeState(selectedEmployee);
        if (selectedEmployee) {
            const { id } = selectedEmployee;
            setEnquiryFilterState((prevState: any) => ({ ...prevState, assigneeId: id, selectedEmployee, }));
        }
    }

    function selectComplaintByHndlr(selectedEmployee: any) {
        setSearchComplaintByState(selectedEmployee);
        if (selectedEmployee) {
            const { id } = selectedEmployee;
            setEnquiryFilterState((prevState: any) => ({ ...prevState, complaintById: id, complaintUser: selectedEmployee, }));
        }
    }

    const handleDateChange = ({ startDate, endDate }: any) => {
        if (startDate && endDate) {
            setEnquiryFilterState((prev: any) => ({ ...prev, startDate, endDate }));
        }
    }

    return (
        <>
            <div className="offcanvas-body">
                {(props.roleName === "BRANCH_ADMIN" || props.roleName === "INSTITUTE_ADMIN" ||
                    props.roleType === "EMPLOYEE") && <div className='mb-3'>
                        <SelectInput
                            name="priority"
                            value={enquiryFilterState.priority}
                            onChange={filterHandler}
                            menuItems={priorityFilter}
                            formgroupClassName="mb-0"
                            defaultSelect="Select"
                            valueKey="id"
                            textKey="name"
                            labelText='Priority'
                        />
                    </div>}
                <div className='mb-3'>
                    <CustomDatePicker
                        name="dateRange"
                        startDate={enquiryFilterState.startDate}
                        endDate={enquiryFilterState.endDate}
                        onChange={handleDateChange}
                        placeholder="Select a Date Range"
                        monthsShown={2}
                        formgroupClassName="tw-mb-0"
                        labelText="Date Range"
                        portalId={"concern-feedback-advance-filter"}
                    />
                </div>

                <div className="tw-mb-3">
                    <SelectInput
                        name="dateType"
                        value={enquiryFilterState.dateType}
                        onChange={filterHandler}
                        menuItems={dateType}
                        formgroupClassName="tw-mb-0"
                        labelText="Date Type"
                        valueKey="id"
                        textKey="name"
                    />
                </div>

                <div className="tw-mb-3">
                    <SelectInput
                        name="moduleId"
                        value={enquiryFilterState.moduleId}
                        onChange={filterHandler}
                        menuItems={allModulesListResp}
                        formgroupClassName="tw-mb-0"
                        labelText="Module"
                        valueKey="id"
                        textKey="moduleName"
                    />
                </div>
                {(props.roleName === "BRANCH_ADMIN" || props.roleName === "INSTITUTE_ADMIN") && <>
                    <div className='mb-3'>
                        <SelectInput
                            name="complaintUserType"
                            value={enquiryFilterState?.complaintUserType}
                            onChange={filterHandler}
                            menuItems={complaintUserTypeOptions}
                            valueKey="id"
                            textKey="name"
                            formgroupClassName="mb-0"
                            defaultSelect="Select"
                            labelText="Complaint User Type"
                        />
                    </div>
                    <div className='mb-3'>
                        <SelectInput
                            name="complaintCategory"
                            value={enquiryFilterState.complaintCategory}
                            onChange={filterHandler}
                            // inputClassName="bg-light"
                            formgroupClassName="mb-0"
                            defaultSelect="Select"
                            labelText='complaintCategory'
                            menuItems={[{ name: "ACADEMIC", key: "ACADEMIC" }, { name: "NON ACADEMIC", key: "NON_ACADEMIC" }]}
                            valueKey="key"
                            textKey="name"
                        />
                    </div>
                </>}
                {(props.roleName === "BRANCH_ADMIN" || props.roleName === "INSTITUTE_ADMIN" ||
                    props.isDepartmentHead) && <>
                        {(showInstituteAdminUI || loggedInUserRole === 'BRANCH_ADMIN' || loggedInUserRole === 'GRIEVANCE') && <div className="mb-3">
                            <CustomSelect
                                name="departmentId"
                                idKey="id"
                                defaultSelect="Select"
                                value={enquiryFilterState.departmentId}
                                renderValue={renderValueDepartment}
                                // onSearchHandler={onSearchDeptHandler}
                                renderOptions={renderOptionsDepartment}
                                onChange={onSelectOptionHandler}
                                searchKey="departmentName"
                                labelText="Department"
                                options={getComplaintDepartmentListResp?.data || []}
                            />
                        </div>}
                        {(!showInstituteAdminUI && loggedInUserRole !== 'BRANCH_ADMIN' && loggedInUserRole !== 'GRIEVANCE') && <div className="mb-3">
                            <MultiSelectCheckbox
                                name="departmentName"
                                idKey="name"
                                labelText='Department'
                                value={enquiryFilterState.departmentName}
                                renderValue={renderValueStatus}
                                renderOptions={renderOptionsStatus}
                                onChange={onSelectDepartmentOptionHandler}
                                searchKey="name"
                                options={props.department || []}
                            />
                        </div>}
                        <div className='mb-3'>
                            <AutoSearchInputUpdated
                                formgroupClassName="search-box"
                                name="assigneeId"
                                placeHolder="Search..."
                                onChange={onSearchAssigneeHandler}
                                valueKey="id"
                                labelKey="employeeCode"
                                subLabelKey="employeeName"
                                labelHeader="Employee Code"
                                subLabelHeader="Employee Name"
                                options={getEmployeesByFilterResp || []}
                                selected={searchEmployeeState}
                                labelText='Assignee Name'
                                selectedOptionCallbck={selectEmployeeHndlr}
                            ><i className="ri-search-line search-icon"></i></AutoSearchInputUpdated>
                        </div>
                        <div className='mb-3'>
                            <AutoSearchInputUpdated
                                formgroupClassName="search-box"
                                name="complaintById"
                                placeHolder="Search..."
                                onChange={onSearchComplaintByHandler}
                                valueKey="id"
                                labelKey="userName"
                                subLabelKey="name"
                                labelHeader="User Code"
                                subLabelHeader="User Name"
                                options={getConcernsUserListResp || []}
                                selected={searchComplaintByState}
                                labelText='Complaint By'
                                selectedOptionCallbck={selectComplaintByHndlr}
                            ><i className="ri-search-line search-icon"></i></AutoSearchInputUpdated>
                        </div>
                        <div className='mb-3'>
                            <SelectInput
                                name="requestedType"
                                value={enquiryFilterState.requestedType}
                                onChange={filterHandler}
                                menuItems={requestType || []}
                                valueKey="reqType"
                                textKey="name"
                                // inputClassName="bg-light border-0"
                                formgroupClassName="mb-0"
                                labelText='Request Type'
                                defaultSelect='Select'
                            />
                        </div>
                    </>}
            </div>

            <div className="tw-border-t tw-p-2 tw-text-center">
                <div className="tw-flex tw-flex-row tw-gap-2 tw-justify-end">
                    <Button
                        type="submit"
                        onClick={applyFilterHndlr}
                        disabled={showApiLoader}
                        variant="primary"
                    >
                        Submit
                    </Button>
                </div>
            </div>
        </>
    )
}

export default AdvanceFilterModal
