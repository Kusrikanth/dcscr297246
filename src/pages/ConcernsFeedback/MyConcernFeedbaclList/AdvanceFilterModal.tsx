import React, { useEffect, useState } from 'react'
import { shallowEqual, useDispatch } from 'react-redux';
import { useAppSelector } from '../../../hooks/storehook';
import { getClassListAdvanceFilter, resetClassListForAdvanceFilterAct, setClassListForAdvanceFilterAct } from '../../../store/fee/feecollections/feecollectionactions';
import { generateActionPayload } from '../../../utility/reduxutility';
import { DateInput, SelectInput, MultiSelectCheckbox, CustomSelect, AutoSearchInputUpdated } from '../../../Components/Common';
import { Current_Date_YYYYMMDD } from '../../../utility/dateutility';
import { accessRoles, complaintUserTypeOptions, priorityFilter, renderOptionsDepartment, renderValueDepartment } from './helper';
import { getComplaintDepartmentListAct } from '../../../store/concernsfeedback/complaintdepartment/complaintdepartmentaction';
import { getEmployeeByFilterAct } from '../../../store/directory/employeemanagement/employeemanagementactions';
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
    category : "ACADEMIC",
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

    const { currentBranchIdResp: branchId, getComplaintDepartmentListResp, currentInstIdResp: instituteId, showApiLoader, getEmployeesByFilterResp, userMeResp }: any =
        useAppSelector(
            ({ appData, classroomManagmentInfo, globalData, complaintDepartment, directoryEmployee, login }) => ({
                currentBranchIdResp: appData.currentBranchIdResp,
                currentInstIdResp: appData.currentInstIdResp,
                loginUserDetailsResp: appData.loginUserDetailsResp,
                showApiLoader: globalData.showApiLoader,
                getComplaintDepartmentListResp: complaintDepartment.getComplaintDepartmentListResp,
                getEmployeesByFilterResp: directoryEmployee.getEmployeesByFilterResp,
                classroomManagmentErrorResp: classroomManagmentInfo.classroomManagmentErrorResp,
                userMeResp: login.userMeResp,

            }),
            shallowEqual
        );

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
        else if(name === "category"){
            if(value){
                setEnquiryFilterState((prev: any) => ({ ...prev, [name]: value, departmentId: "" }));
                getComplaintDeptApiCall({ category: value, branchId });
            }
        }
        else {
            setEnquiryFilterState((prev: any) => ({ ...prev, [name]: value }))
        }
    }

    function applyFilterHndlr() {
        props.toggleAdvanceFilter()
        // setEnquiryFilterState((prev: any) => ({ ...prev, paymentModes: paymentModeState, receiptTypes: receiptOptionState }))
        if (enquiryFilterState?.startDate && !enquiryFilterState?.endDate) {
            props.applyFilterCallback({ ...enquiryFilterState, endDate: Current_Date_YYYYMMDD });
        } else {
            props.applyFilterCallback(enquiryFilterState);
        }
    }

    function getComplaintDeptApiCall(otherProps?: any) {
        const payload = { branchId, pageNo: 0, pageSize: 100, ...otherProps };
        dispatch(getComplaintDepartmentListAct(generateActionPayload("get_complaint_dept_list", undefined, { ...payload })));
    }

    useEffect(() => {
        if (!props.isOpen) {
            dispatch(resetClassListForAdvanceFilterAct(undefined));
        }
        else {
            if (props.appliedFilter) {
                setSearchEmployeeState(props.appliedFilter?.selectedEmployee)
            }
        }
    }, [props.isOpen])

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

    function onSearchAssigneeHandler(value: any) {
        if (value) {
            const params = { searchString: value };
            dispatch(getEmployeeByFilterAct(generateActionPayload("get_employee_by_name", params, { branchId })));
        }
    }

    function selectEmployeeHndlr(selectedEmployee: any) {
        setSearchEmployeeState(selectedEmployee);
        if (selectedEmployee) {
            const { id } = selectedEmployee;
            setEnquiryFilterState((prevState: any) => ({ ...prevState, assigneeId: id, selectedEmployee, }));
        }
    }

    return (
        <>
            <div className="offcanvas-body">
                {!accessRoles.includes(userMeResp?.role?.roleType) && (
                    <div className="tw-mb-3">
                        <SelectInput
                            name="priority"
                            value={enquiryFilterState.priority}
                            onChange={filterHandler}
                            menuItems={priorityFilter}
                            formgroupClassName="tw-mb-0"
                            defaultSelect="Select"
                            valueKey="id"
                            textKey="name"
                            labelText="Priority"
                        />
                    </div>
                )}

                <div className="tw-mb-3">
                    <DateInput
                        name="startDate"
                        value={enquiryFilterState?.startDate}
                        onChange={filterHandler}
                        formgroupClassName="tw-mb-0"
                        labelText="Start Date"
                    />
                </div>

                <div className="tw-mb-3">
                    <DateInput
                        name="endDate"
                        value={enquiryFilterState?.endDate}
                        onChange={filterHandler}
                        formgroupClassName="tw-mb-0"
                        labelText="End Date"
                    />
                </div>

                {!accessRoles.includes(userMeResp?.role?.roleType) && (
                    <>
                        <div className="tw-mb-3">
                            <SelectInput
                                name="complaintUserType"
                                value={enquiryFilterState?.complaintUserType}
                                onChange={filterHandler}
                                menuItems={complaintUserTypeOptions}
                                valueKey="id"
                                textKey="name"
                                formgroupClassName="tw-mb-0"
                                defaultSelect="Select"
                                labelText="Complaint User Type"
                            />
                        </div>

                        <div className="tw-mb-3">
                            <SelectInput
                                name="category"
                                value={enquiryFilterState.category}
                                onChange={filterHandler}
                                formgroupClassName="tw-mb-0"
                                defaultSelect="Select"
                                labelText="Category"
                                menuItems={[
                                    { name: "ACADEMIC", key: "ACADEMIC" },
                                    { name: "NON ACADEMIC", key: "NON_ACADEMIC" },
                                ]}
                                valueKey="key"
                                textKey="name"
                            />
                        </div>

                        <div className="tw-mb-3">
                            <CustomSelect
                                name="departmentId"
                                idKey="id"
                                defaultSelect="Select"
                                value={enquiryFilterState.departmentId}
                                renderValue={renderValueDepartment}
                                renderOptions={renderOptionsDepartment}
                                onChange={onSelectOptionHandler}
                                searchKey="departmentName"
                                labelText="Department"
                                options={getComplaintDepartmentListResp?.data || []}
                            />
                        </div>

                        <div className="tw-mb-3">
                            <AutoSearchInputUpdated
                                formgroupClassName="tw-relative"
                                name="assigneeId"
                                placeHolder="Search..."
                                onChange={onSearchAssigneeHandler}
                                valueKey="id"
                                labelKey="employeeName"
                                subLabelKey="employeeCode"
                                labelHeader="Employee Code"
                                subLabelHeader="Employee Name"
                                options={getEmployeesByFilterResp}
                                selected={searchEmployeeState}
                                labelText="Assignee Name"
                                selectedOptionCallbck={selectEmployeeHndlr}
                            >
                                <i className="ri-search-line tw-absolute tw-left-3 tw-top-1/2 -tw-translate-y-1/2"></i>
                            </AutoSearchInputUpdated>
                        </div>
                    </>
                )}
            </div>

            <div className="tw-border-t tw-border-gray-200 tw-p-3 tw-text-center">
                <div className="tw-flex tw-justify-end tw-gap-2">
                    <Button
                        type="submit"
                        onClick={applyFilterHndlr}
                        disabled={showApiLoader}
                        variant='primary'
                    >
                        Submit
                    </Button>
                </div>
            </div>

        </>
    )
}

export default AdvanceFilterModal
