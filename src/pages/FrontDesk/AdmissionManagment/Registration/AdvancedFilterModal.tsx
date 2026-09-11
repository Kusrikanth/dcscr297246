import { useEffect, useState } from 'react'
import { shallowEqual } from 'react-redux';
import { useAppDispatch, useAppSelector } from '../../../../hooks/storehook';
import { getClassListAdvanceFilter, resetClassListForAdvanceFilterAct } from '../../../../store/fee/feecollections/feecollectionactions';
import { generateActionPayload } from '../../../../utility/reduxutility';
import { MultiSelectCheckbox, SelectInput } from '../../../../Components/Common';
import { Current_Date_YYYYMMDD } from '../../../../utility/dateutility';
import { AdmissionTypeMenuOptions, currentStatusOptions, pallaviStatusOptions } from './helper';
import { CustomDatePicker } from '../../../DashBoardBranchSummary/CustomDatePicker';
import { admissionSourceOptions } from '../ApplicationSale/helper';

const initialValues: any = {
    search: null,
    academicYearId: null,
    curriculumId: null,
    classId: null,
    startDate: null,
    recentFollowupRemarksStartDate: null,
    recentFollowupRemarksEndDate: null,
    completionStatus: null,
    paymentStatus: null,
    mode : null,
    admissionSource : null,
};

const AdvanceFilterModal = (props: any) => {

    const dispatch = useAppDispatch();

    const [enquiryFilterState, setEnquiryFilterState] =
        useState<any>(props.appliedFilter || initialValues);

    const { currentBranchIdResp: branchId, currentInstIdResp: instituteId, academicYearListResp, brchCurriculumResp, branchClassResp, classListForAdvanceFilter, showApiLoader,currentInstCodeResp : instituteCode } =
        useAppSelector(
            ({ appData, instAcademics, branchAcademics, classroomManagmentInfo, feeCollections,globalData }) => ({
                currentBranchIdResp: appData.currentBranchIdResp,
                currentInstIdResp: appData.currentInstIdResp,
                currentInstCodeResp: appData.currentInstCodeResp,
                loginUserDetailsResp: appData.loginUserDetailsResp,
                academicYearListResp: instAcademics.academicYearListResp,
                brchCurriculumResp: branchAcademics.brchCurriculumResp,
                branchClassResp: branchAcademics.branchClassResp,
                showApiLoader : globalData.showApiLoader,
                classListForAdvanceFilter: feeCollections.classListForAdvanceFilter,
                classroomManagmentErrorResp: classroomManagmentInfo.classroomManagmentErrorResp,

            }),
            shallowEqual
        );

    const filterHandler = (event: any) => {
        const { name, value } = event.target;
        if (name === "curriculumId") {
            if (value) {
                const payload = { pageNo: 0, pageSize: 100, sortBy: "classSequence", orderBy: "asc", curriculumId: value,academicYearId : enquiryFilterState.academicYearId, branchId };
                dispatch(getClassListAdvanceFilter(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
            }
            setEnquiryFilterState((prev:any) => ({ ...prev, [name]: value,classId : null, }))
        }else{
            setEnquiryFilterState((prev:any) => ({ ...prev, [name]: value }))
        }
    }
    function applyFilterHndlr() {
        // setEnquiryFilterState((prev: any) => ({ ...prev, paymentModes: paymentModeState, receiptTypes: receiptOptionState }))
        if(enquiryFilterState?.startDate && !enquiryFilterState?.endDate){
            props.applyFilterCallback({...enquiryFilterState , endDate : Current_Date_YYYYMMDD});
        }else{
            props.applyFilterCallback(enquiryFilterState);
        }
    }
    function resetHandler (){
        setEnquiryFilterState((prev: any) => ({ ...prev, startDate: "", curriculumId: "",  classId: "", endDate: "",admissionType : "", }));
        props.toggleAdvanceFilter();
        props.applyFilterCallback({ ...enquiryFilterState, startDate: "", curriculumId: "",  classId: "", endDate: "",admissionType : "", });
    }


    useEffect(() => {
        if (!props.isOpen) {
            dispatch(resetClassListForAdvanceFilterAct(undefined));
        }
        else {
            if(props.appliedFilter.curriculumId){
                const payload = { pageNo: 0, pageSize: 100, sortBy: "classSequence", orderBy: "asc", curriculumId: props.appliedFilter.curriculumId, branchId };
                dispatch(getClassListAdvanceFilter(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
            }
        }
    }, [props.isOpen])

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

    function onSelectOptionHandler(selectedOptions: any, config?: any) {
        const { name } = config;
        if (Array.isArray(selectedOptions) && selectedOptions.length > 0) {
            setEnquiryFilterState((prevState: any) => ({ ...prevState, [name]: selectedOptions }));
        } else {
            setEnquiryFilterState((prevState: any) => ({ ...prevState, [name]: null }));
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
    const { content: classTypes } = classListForAdvanceFilter || {};
    return (
        <>
            <div className="offcanvas-body">
                {/* <div className='mb-3'>
                    <SelectInput
                        name="academicYearId"
                        value={enquiryFilterState?.academicYearId}
                        onChange={filterHandler}
                        menuItems={academicYearList || []}
                        valueKey="academicYearId"
                        textKey="academicYearName"
                        // inputClassName="bg-light"
                        formgroupClassName="mb-0"
                        defaultSelect="Academic Year"
                        labelText="Academic Year"
                    />
                </div> */}
                <div className='mb-3'>
                    <SelectInput
                        name="curriculumId"
                        value={enquiryFilterState?.curriculumId}
                        onChange={filterHandler}
                        menuItems={curriculumTypes}
                        valueKey="branchCurriculumId"
                        textKey="curriculumName"
                        // inputClassName="bg-light"
                        formgroupClassName="mb-0"
                        defaultSelect="Curriculum"
                        labelText="Curriculum"
                    />
                </div>
                {/* <div className='mb-3'>
                    <SelectInput
                        name="classId"
                        value={enquiryFilterState?.classId}
                        onChange={filterHandler}
                        menuItems={classTypes || []}
                        valueKey="id"
                        textKey="className"
                        // inputClassName="bg-light"
                        formgroupClassName="mb-0"
                        defaultSelect="Class"
                        labelText="Class"
                    />
                </div> */}
                 <div className='mb-3'>
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
                  <div className="mb-3">
                     <MultiSelectCheckbox
                        name="currentStatus"
                        idKey="id"
                        labelText='Current Status'
                        value={enquiryFilterState?.currentStatus}
                        renderValue={renderValueStatus}
                        renderOptions={renderOptionsStatus}
                        onChange={onSelectOptionHandler}
                        searchKey="id"
                        options={instituteCode === "PMS" ? pallaviStatusOptions : currentStatusOptions}
                    />
                </div>
                <div className='mb-3'>
                    <SelectInput
                        name="admissionType"
                        value={enquiryFilterState?.admissionType}
                        onChange={filterHandler}
                        menuItems={AdmissionTypeMenuOptions || []}
                        valueKey="id"
                        textKey="value"
                        // inputClassName="bg-light border-0"
                        formgroupClassName="mb-0"
                        defaultSelect='Admission Type'
                        labelText='Admission Type'
                    />
                </div>
                <div className='mb-3'>
                    <CustomDatePicker
                        name="dateRange"
                        startDate={enquiryFilterState.startDate}
                        endDate={enquiryFilterState.endDate}
                        onChange={(dates: any) =>
                            handleDateChange(dates, "startDate", "endDate")
                        }
                        placeholder="Select a Date Range"
                        monthsShown={2}
                        formgroupClassName="mb-0"
                        labelText='Date Range'
                        portalId={"registration-advance-filter"}
                    />
                </div>
                <div className="mb-3">
                    <SelectInput
                        name="admissionSource"
                        value={enquiryFilterState?.admissionSource}
                        onChange={filterHandler}
                        menuItems={admissionSourceOptions || []}
                        valueKey="id"
                        textKey="name"
                        formgroupClassName="mb-0"
                        labelText='Admission Source'
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
                        portalId="registration-advance-filter"
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
                        portalId="registration-advance-filter"
                    />
                </div>
            </div>
            <div className="border-top p-2 text-center">
                <div className="hstack gap-2 justify-content-end">
                {/* <button
                        type="button"
                        className="btn btn-light"
                        onClick={resetHandler}
                    >
                        Reset
                    </button> */}
                    <button
                        type="submit"
                        onClick={applyFilterHndlr}
                        disabled={showApiLoader}
                        className="btn btn-success"
                    >
                        Submit
                    </button>
                </div>
            </div>
        </>
    )
}

export default AdvanceFilterModal
