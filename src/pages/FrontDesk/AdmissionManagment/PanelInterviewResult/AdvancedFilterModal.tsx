import React, { useEffect, useState } from 'react'
import { shallowEqual, useDispatch } from 'react-redux';
import { useAppSelector } from '../../../../hooks/storehook';
import { getClassListAdvanceFilter, resetClassListForAdvanceFilterAct } from '../../../../store/fee/feecollections/feecollectionactions';
import { generateActionPayload } from '../../../../utility/reduxutility';
import { DateInput, MultiSelectCheckbox, SelectInput } from '../../../../Components/Common';
import { Current_Date_YYYYMMDD } from '../../../../utility/dateutility';
import { AdmissionStatusMenuOptions, AdmissionTypeMenuOptions, mainApplicationStatus, jodoRegisteredOptions, paidStatusOptions, renderOptionsEmployee, renderValueEmployee } from './helper';
import { getPanelEmployeesListAct } from '../../../../store/FrontDesk/Settings/admissionAvailability/admissionavailabilityaction';
import { getEmployeeByFilterAct } from '../../../../store/directory/employeemanagement/employeemanagementactions';
import { CustomDatePicker } from '../../../DashBoardBranchSummary/CustomDatePicker';
import { admissionSourceOptions } from '../ApplicationSale/helper';
import Button from '../../../../Components/Common/Button';

const initialValues: any = {
    academicYearId: "",
    curriculumId: "",
    classId: "",
    feePaymentPaidStatus: "",
    endDate: "",
    startDate: "",
    searchString: "",
    registrationType: "",
    admissionType: null,
    admissionCancel: null,
    jodoStudentId: "",
    admissionSource: "",
    mainApplicationStatus: "",
    employeeIds: [],
    recentFollowupRemarksStartDate: null,
    recentFollowupRemarksEndDate: null,
};

const AdvanceFilterModal = (props: any) => {

    const dispatch = useDispatch();
    const [searchEmployeeState, setSearchEmployeeState] = useState<any>(undefined);

    const [enquiryFilterState, setEnquiryFilterState] =
        useState<any>(props.appliedFilter || initialValues);

    const { currentBranchIdResp: branchId, currentInstIdResp: instituteId, academicYearListResp, brchCurriculumResp, branchClassResp, classListForAdvanceFilter,currentInstCodeResp : instituteCode, showApiLoader, panelEmployeesListResp } =
        useAppSelector(
            ({ appData, instAcademics, branchAcademics, classroomManagmentInfo, feeCollections, globalData, admissionAvailabilityRequest }) => ({
                currentBranchIdResp: appData.currentBranchIdResp,
                currentInstIdResp: appData.currentInstIdResp,
                currentInstCodeResp: appData.currentInstCodeResp,
                loginUserDetailsResp: appData.loginUserDetailsResp,
                academicYearListResp: instAcademics.academicYearListResp,
                brchCurriculumResp: branchAcademics.brchCurriculumResp,
                branchClassResp: branchAcademics.branchClassResp,
                showApiLoader: globalData.showApiLoader,
                classListForAdvanceFilter: feeCollections.classListForAdvanceFilter,
                classroomManagmentErrorResp: classroomManagmentInfo.classroomManagmentErrorResp,
                panelEmployeesListResp: admissionAvailabilityRequest.panelEmployeesListResp,
            }),
            shallowEqual
        );

    const filterHandler = (event: any) => {
        const { name, value } = event.target;
        // if(name==="employeeIds"){
        //    
        // }else{
        setEnquiryFilterState((prev: any) => ({ ...prev, [name]: value }))
        if (name === "curriculumId") {
            if (value) {
                const payload = { pageNo: 0, pageSize: 100, sortBy: "classSequence", orderBy: "asc", curriculumId: value, branchId };
                dispatch(getClassListAdvanceFilter(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
            }
        }
        // }
    }
    function applyFilterHndlr() {
        // setEnquiryFilterState((prev: any) => ({ ...prev, paymentModes: paymentModeState, receiptTypes: receiptOptionState }))
        if (enquiryFilterState?.startDate && !enquiryFilterState?.endDate) {
            props.applyFilterCallback({ ...enquiryFilterState, endDate: Current_Date_YYYYMMDD });
        } else {
            props.applyFilterCallback(enquiryFilterState);
        }
    }

    function resetHandler() {
        setEnquiryFilterState((prev: any) => ({ ...prev, startDate: "", endDate: "" }));
        props.toggleAdvanceFilter();
        props.applyFilterCallback({ ...enquiryFilterState, startDate: "", endDate: "" });
    }

    function renderOptions(item: any) {
        return item?.id;
    }

    function renderValue(selectedItems: any) {
        if (Array.isArray(selectedItems)) {
            return (<div className="text-truncate">
                {
                    selectedItems.map((item, index) => {
                        return item?.id + (index !== (selectedItems.length - 1) ? ', ' : '')
                    })
                }
            </div>)
        }
    }

    function onSelectOptionHandler(selectedOptions: any, config?: any) {
        const { name } = config;
        if (Array.isArray(selectedOptions) && selectedOptions.length > 0) {
            setEnquiryFilterState((prevState: any) => ({ ...prevState, [name]: selectedOptions }));
        } else {
            setEnquiryFilterState((prevState: any) => ({ ...prevState, [name]: null }));
        }
    }
    function onInputSearchChange(inputString: any) {
        if (inputString) {
            const params = { searchString: inputString };
            dispatch(getEmployeeByFilterAct(generateActionPayload("get_employee_by_name", params, { branchId })));
        }
    }


    function selectEmployeeHndlr(selectedOptions: any, config?: any) {
      
        const { name } = config;
        if (Array.isArray(selectedOptions) && selectedOptions.length > 0) {
            setEnquiryFilterState((prevState: any) => ({ ...prevState, [name]: selectedOptions }));
        } else {
            setEnquiryFilterState((prevState: any) => ({ ...prevState, [name]: null }));
        }

    }

    function onSearchMultiSelectHandler(name: any, value: any) {
        if (value) {
            const payload = { instituteId, branchId, searchString: value }
            dispatch(getPanelEmployeesListAct(generateActionPayload("panel_employees_list", undefined, payload)));
        }
    }

    const handleDateChange = (
        { startDate, endDate }: any,
        startKey: string,
        endKey: string
    ) => {
        setEnquiryFilterState((prev: any) => ({
            ...prev,
            [startKey]: startDate || null,
            [endKey]: endDate || null,
        }));
    };

    return (
        <>
            <div className="offcanvas-body">
                <div className="tw-mb-3">
                    <SelectInput
                        name="feePaymentPaidStatus"
                        labelText="Payment Status"
                        value={enquiryFilterState.feePaymentPaidStatus}
                        onChange={filterHandler}
                        menuItems={paidStatusOptions}
                        valueKey="id"
                        textKey="name"
                    />
                </div>

                <div className="tw-mb-3">
                    <CustomDatePicker
                        name="dateRange"
                        startDate={enquiryFilterState.startDate}
                        endDate={enquiryFilterState.endDate}
                        onChange={(dates: any) =>
                            handleDateChange(dates, "startDate", "endDate")
                        }
                        placeholder="Select a Date Range"
                        monthsShown={2}
                        formgroupClassName="tw-mb-0"
                        labelText="Date Range"
                        portalId={"panel-interview-result-advance-filter"}
                    />
                </div>

                {instituteCode === "DPS" && (
                    <MultiSelectCheckbox
                        name="employeeIds"
                        labelText="Interviewd By"
                        containerClassName="tw-mb-3"
                        idKey="employeeId"
                        value={enquiryFilterState?.employeeIds}
                        renderValue={renderValueEmployee}
                        renderOptions={renderOptionsEmployee}
                        onChange={selectEmployeeHndlr}
                        onSearchHandler={onSearchMultiSelectHandler}
                        options={panelEmployeesListResp}
                    />
                )}

                <div className="tw-mb-3">
                    <SelectInput
                        name="registrationType"
                        value={enquiryFilterState?.registrationType}
                        onChange={filterHandler}
                        menuItems={AdmissionTypeMenuOptions}
                        valueKey="id"
                        textKey="value"
                        formgroupClassName="tw-mb-0"
                        labelText="Admission Type"
                    />
                </div>

                <div className="tw-mb-3">
                    <SelectInput
                        name="jodoStudentId"
                        value={enquiryFilterState?.jodoStudentId}
                        onChange={filterHandler}
                        menuItems={[{ id: "YES", value: "YES" }, { id: "NO", value: "NO" }]}
                        valueKey="id"
                        textKey="value"
                        formgroupClassName="tw-mb-0"
                        defaultSelect="Select"
                        labelText="Jodo Registered"
                    />
                </div>

                <div className="tw-mb-3">
                    <SelectInput
                        name="admissionCancel"
                        value={enquiryFilterState?.admissionCancel}
                        onChange={filterHandler}
                        menuItems={[{ id: "YES" }, { id: "NO" }]}
                        valueKey="id"
                        textKey="id"
                        formgroupClassName="tw-mb-0"
                        labelText="Admission Cancelled"
                    />
                </div>

                {instituteCode === "DPS" && (
                    <div className="tw-mb-3">
                        <MultiSelectCheckbox
                            name="admissionType"
                            idKey="id"
                            labelText="Admission Status"
                            value={enquiryFilterState?.admissionType}
                            renderValue={renderValue}
                            renderOptions={renderOptions}
                            onChange={onSelectOptionHandler}
                            searchKey="id"
                            options={AdmissionStatusMenuOptions || []}
                        />
                    </div>
                )}

                <div className="tw-mb-3">
                    <SelectInput
                        name="admissionSource"
                        value={enquiryFilterState?.admissionSource}
                        onChange={filterHandler}
                        menuItems={admissionSourceOptions || []}
                        valueKey="id"
                        textKey="name"
                        formgroupClassName="tw-mb-0"
                        labelText="Admission Source"
                    />
                </div>
                <div className="tw-mb-3">
                    <SelectInput
                        name="mainApplicationStatus"
                        value={enquiryFilterState?.mainApplicationStatus}
                        onChange={filterHandler}
                        menuItems={mainApplicationStatus || []}
                        valueKey="id"
                        textKey="name"
                        formgroupClassName="tw-mb-0"
                        labelText="Application Status"
                    />
                </div>
                <div className="tw-mb-3">
                    <CustomDatePicker
                        name="dateRange"
                        startDate={enquiryFilterState.recentFollowupRemarksStartDate}
                        endDate={enquiryFilterState.recentFollowupRemarksEndDate}
                        onChange={(dates: any) =>
                            handleDateChange(
                                dates,
                                "recentFollowupRemarksStartDate",
                                "recentFollowupRemarksEndDate"
                            )
                        }
                        placeholder="Select a Date Range"
                        monthsShown={2}
                        formgroupClassName="tw-mb-0"
                        labelText="Follow Up Date Range"
                        portalId={"panel-interview-result-advance-filter"}
                    />
                </div>
                <div className="tw-mb-3">
                    <CustomDatePicker
                        name="dateRange"
                        startDate={enquiryFilterState.nextFollowupRemarksStartDate}
                        endDate={enquiryFilterState.nextFollowupRemarksEndDate}
                        onChange={(dates: any) =>
                            handleDateChange(
                                dates,
                                "nextFollowupRemarksStartDate",
                                "nextFollowupRemarksEndDate"
                            )
                        }
                        placeholder="Select a Date Range"
                        monthsShown={2}
                        formgroupClassName="tw-mb-0"
                        labelText="Next Action Date"
                        portalId="panel-interview-result-advance-filter"
                    />
                </div>
            </div>

            <div className="tw-border-t tw-p-2 tw-text-center">
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
