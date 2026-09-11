import React, { useEffect, useState } from 'react'
import { shallowEqual, useDispatch } from 'react-redux';
import { useAppSelector } from '../../../../hooks/storehook';
import { getClassListAdvanceFilter, resetClassListForAdvanceFilterAct, setClassListForAdvanceFilterAct } from '../../../../store/fee/feecollections/feecollectionactions';
import { generateActionPayload } from '../../../../utility/reduxutility';
import { SelectInput, MultiSelectCheckbox } from '../../../../Components/Common';
import { Current_Date_YYYYMMDD } from '../../../../utility/dateutility';
import { completionStatus, currentStatusOptions, modeOptions, pallaviStatusOptions, paymentStatus, admissionTypesForDps, admissionSourceOptions } from './helper';
import { CustomDatePicker } from '../../../DashBoardBranchSummary/CustomDatePicker';
import Button from '../../../../Components/Common/Button';
import { getGenderListAct } from '../../../../store/masterdata/masterdataactions';
// import { requestType, statusTypes } from './helper';

const initialValues: any = {
    search: null,
    academicYearId: null,
    curriculumId: null,
    classId: null,
    selectedClasses: null,
    startDate: null,
    recentFollowupRemarksStartDate: null,
    recentFollowupRemarksEndDate: null,
    completionStatus: null,
    paymentStatus: null,
    currentStatus: null,
    mode: null,
    admissionType: null,
    admissionSource: "",
    genderId: "",
};

function renderOptions(item: any) {
    return item?.shortName;
}

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

function renderOptionsStatus(item: any) {
    return item?.id;
}

function renderValueStatus(selectedItems: any) {
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


const AdvanceFilterModal = (props: any) => {

    const dispatch = useDispatch();

    const [enquiryFilterState, setEnquiryFilterState] =
        useState<any>(props.appliedFilter || initialValues);

    const { currentBranchIdResp: branchId, currentInstIdResp: instituteId, currentInstCodeResp: instituteCode, academicYearListResp, brchCurriculumResp, branchClassResp, classListForAdvanceFilter, tcRequestList, showApiLoader, genderListResp }: any =
        useAppSelector(
            ({ appData, instAcademics, branchAcademics, classroomManagmentInfo, feeCollections, globalData, masterData }) => ({
                currentBranchIdResp: appData.currentBranchIdResp,
                currentInstIdResp: appData.currentInstIdResp,
                currentInstCodeResp: appData.currentInstCodeResp,
                loginUserDetailsResp: appData.loginUserDetailsResp,
                academicYearListResp: instAcademics.academicYearListResp,
                brchCurriculumResp: branchAcademics.brchCurriculumResp,
                branchClassResp: branchAcademics.branchClassResp,
                genderListResp: masterData.genderListResp,
                showApiLoader: globalData.showApiLoader,
                classListForAdvanceFilter: feeCollections.classListForAdvanceFilter,
                classroomManagmentErrorResp: classroomManagmentInfo.classroomManagmentErrorResp,

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
                const payload = { pageNo: 0, pageSize: 100, sortBy: "classSequence", orderBy: "asc", curriculumId: value, branchId ,academicYearId : enquiryFilterState.academicYearId};
                dispatch(getClassListAdvanceFilter(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
            }
        } else {
            setEnquiryFilterState((prev: any) => ({ ...prev, [name]: value }))
        }
    }

    useEffect(() => {
        dispatch(getGenderListAct(generateActionPayload("get_inst_global_records", undefined, { categoryName: "gender", sortBy: "genderName", orderBy: "asc" })));
    }, []);

    function applyFilterHndlr() {
        // setEnquiryFilterState((prev: any) => ({ ...prev, paymentModes: paymentModeState, receiptTypes: receiptOptionState }))
        if (enquiryFilterState?.startDate && !enquiryFilterState?.endDate) {
            props.applyFilterCallback({ ...enquiryFilterState, endDate: Current_Date_YYYYMMDD });
        } else {
            props.applyFilterCallback(enquiryFilterState);
        }
    }

    function resetHandler() {
        setEnquiryFilterState((prev: any) => ({ ...prev, startDate: null, curriculumId: null, classId: null, endDate: null, completionStatus: null, mode: null, currentStatus: null }));
        props.toggleAdvanceFilter();
        props.applyFilterCallback({ ...enquiryFilterState, startDate: null, curriculumId: null, classId: null, endDate: null, completionStatus: null, mode: null, currentStatus: null });
    }

    useEffect(() => {
        if (!props.isOpen) {
            dispatch(resetClassListForAdvanceFilterAct(undefined));
        }
        else {
            if (props.appliedFilter.curriculumId && props.appliedFilter.academicYearId) {
                const payload = { pageNo: 0, pageSize: 100, sortBy: "classSequence", orderBy: "asc", curriculumId: props.appliedFilter.curriculumId, branchId , academicYearId : props.appliedFilter.academicYearId };
                dispatch(getClassListAdvanceFilter(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
            }
        }
    }, [props.isOpen])

    function onSelectOptionHandler(selectedOptions: any, config?: any) {
        const { name } = config;
        if (Array.isArray(selectedOptions) && selectedOptions.length > 0) {
            setEnquiryFilterState((prevState: any) => ({ ...prevState, [name]: selectedOptions }));
        } else {
            setEnquiryFilterState((prevState: any) => ({ ...prevState, [name]: null }));
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

    const { data: academicYearList } = academicYearListResp || {};
    const { data: curriculumTypes } = brchCurriculumResp || {};
    const { data: TcRequestList, totalElements, totalPages, pageNumber } = tcRequestList || {};
    const { content: classTypes } = classListForAdvanceFilter || {};
    return (
        <>
            <div className="offcanvas-body">

                <div className="tw-mb-4">
                    <SelectInput
                        name="curriculumId"
                        value={enquiryFilterState?.curriculumId}
                        onChange={filterHandler}
                        menuItems={curriculumTypes}
                        valueKey="branchCurriculumId"
                        textKey="curriculumName"
                        formgroupClassName="tw-mb-0"
                        defaultSelect="Curriculum"
                        labelText="Curriculum"
                    />
                </div>

                <div className="tw-mb-4">
                    <MultiSelectCheckbox
                        name="classId"
                        idKey="id"
                        labelText="Class"
                        value={enquiryFilterState?.classId}
                        renderValue={renderValue}
                        renderOptions={renderOptions}
                        onChange={onSelectOptionHandler}
                        searchKey="shortName"
                        options={classTypes || []}
                    />
                </div>

                <div className="tw-mb-4">
                    <SelectInput
                        name="completionStatus"
                        value={enquiryFilterState?.completionStatus}
                        onChange={filterHandler}
                        menuItems={completionStatus}
                        valueKey="id"
                        textKey="name"
                        formgroupClassName="tw-mb-0"
                        defaultSelect="Registration Status"
                        labelText="Registration Status"
                    />
                </div>

                <div className="tw-mb-4">
                    <SelectInput
                        name="mode"
                        value={enquiryFilterState?.mode}
                        onChange={filterHandler}
                        menuItems={modeOptions}
                        valueKey="id"
                        textKey="name"
                        formgroupClassName="tw-mb-0"
                        labelText="Mode"
                    />
                </div>

                <div className="tw-mb-4">
                    <MultiSelectCheckbox
                        name="currentStatus"
                        idKey="id"
                        labelText="Current Status"
                        value={enquiryFilterState?.currentStatus}
                        renderValue={renderValueStatus}
                        renderOptions={renderOptionsStatus}
                        onChange={onSelectOptionHandler}
                        searchKey="id"
                        options={instituteCode === "PMS" ? pallaviStatusOptions : currentStatusOptions}
                    />
                </div>

                <div className="tw-mb-4">
                    <SelectInput
                        name="admissionType"
                        value={enquiryFilterState?.admissionType}
                        onChange={filterHandler}
                        menuItems={admissionTypesForDps}
                        valueKey="id"
                        textKey="name"
                        formgroupClassName="tw-mb-0"
                        labelText="Admission Type"
                    />
                </div>

                <div className="tw-mb-4">
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

                <div className="tw-mb-4">
                    <SelectInput
                        name="genderId"
                        value={enquiryFilterState.genderId}
                        onChange={filterHandler}
                        menuItems={genderListResp?.data || []}
                        valueKey="genderId"
                        textKey="genderName"
                        formgroupClassName="tw-mb-0"
                        labelText="Gender"
                    />
                </div>

                <div className="tw-mb-4">
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
                        portalId="application-sale-advance-filter"
                    />
                </div>

                <div className="tw-mb-4">
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
                        portalId="application-sale-advance-filter"
                    />
                </div>

                <div className="tw-mb-4">
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
                        portalId="application-sale-advance-filter"
                    />
                </div>
                <div className="tw-border-t tw-pt-3 tw-flex tw-justify-end tw-gap-3">
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
