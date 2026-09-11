import React, { useEffect, useState } from 'react'
import { shallowEqual, useDispatch } from 'react-redux';
import { useAppSelector } from '../../../../hooks/storehook';
import { getClassListAdvanceFilter, setClassListForAdvanceFilterAct } from '../../../../store/fee/feecollections/feecollectionactions';
import { generateActionPayload } from '../../../../utility/reduxutility';
import { DateInput, SelectInput } from '../../../../Components/Common';
import { Current_Date_YYYYMMDD } from '../../../../utility/dateutility';
import { AdmissionTypeMenuOptions } from './helper';
import { CustomDatePicker } from '../../../DashBoardBranchSummary/CustomDatePicker';
import Button from '../../../../Components/Common/Button';

const initialValues: any = {
    search: null,
    academicYearId: null,
    curriculumId: null,
    classId: null,
    selectedClasses: null,
    startDate: null,
    completionStatus: null,
    paymentStatus: null,
    currentStatus: null,
    mode: null,
    admissionType:null,
    isFeedbackProvided:null,
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


const AdvanceFilterModal = (props: any) => {

    const dispatch = useDispatch();

    const [enquiryFilterState, setEnquiryFilterState] =
        useState<any>(props.appliedFilter || initialValues);

    const { currentBranchIdResp: branchId, currentInstIdResp: instituteId, academicYearListResp, brchCurriculumResp, branchClassResp, classListForAdvanceFilter, tcRequestList, showApiLoader }: any =
        useAppSelector(
            ({ appData, instAcademics, branchAcademics, classroomManagmentInfo, feeCollections, globalData }) => ({
                currentBranchIdResp: appData.currentBranchIdResp,
                currentInstIdResp: appData.currentInstIdResp,
                loginUserDetailsResp: appData.loginUserDetailsResp,
                academicYearListResp: instAcademics.academicYearListResp,
                brchCurriculumResp: branchAcademics.brchCurriculumResp,
                branchClassResp: branchAcademics.branchClassResp,
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
                const payload = { pageNo: 0, pageSize: 100, sortBy: "classSequence", orderBy: "asc", curriculumId: value, branchId };
                dispatch(getClassListAdvanceFilter(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
            }
        } else {
            setEnquiryFilterState((prev: any) => ({ ...prev, [name]: value }))
        }
    }


    function applyFilterHndlr() {
        // setEnquiryFilterState((prev: any) => ({ ...prev, paymentModes: paymentModeState, receiptTypes: receiptOptionState }))
        if (enquiryFilterState?.startDate && !enquiryFilterState?.endDate) {
            props.applyFilterCallback({ ...enquiryFilterState, endDate: Current_Date_YYYYMMDD });
        } else {
            props.applyFilterCallback(enquiryFilterState);
        }
        props.toggleAdvanceFilter()
    }

    // useEffect(() => {
    //     if (!props.isOpen) {
    //         dispatch(resetClassListForAdvanceFilterAct(undefined));
    //     }
    //     else {
    //         if (props.appliedFilter.curriculumId) {
    //             const payload = { pageNo: 0, pageSize: 100, sortBy: "classSequence", orderBy: "asc", curriculumId: props.appliedFilter.curriculumId, branchId };
    //             dispatch(getClassListAdvanceFilter(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
    //         }
    //     }
    // }, [props.isOpen])

    function onSelectOptionHandler(selectedOptions: any, config?: any) {
        const { name } = config;
        if (Array.isArray(selectedOptions) && selectedOptions.length > 0) {
            setEnquiryFilterState((prevState: any) => ({ ...prevState, [name]: selectedOptions }));
        } else {
            setEnquiryFilterState((prevState: any) => ({ ...prevState, [name]: null }));
        }
    }

    const handleDateChange = ({ startDate, endDate }:any)=>{
        if(startDate && endDate){
            setEnquiryFilterState((prev:any) => ({ ...prev, startDate, endDate }));
        }
    }

    const { data: academicYearList } = academicYearListResp || {};
    const { data: curriculumTypes } = brchCurriculumResp || {};
    const { data: TcRequestList, totalElements, totalPages, pageNumber } = tcRequestList || {};
    const { content: classTypes } = classListForAdvanceFilter || {};
    return (
        <>
            <div className="offcanvas-body">

                {/* Admission Type */}
                <div className="tw-mb-3">
                    <SelectInput
                        name="admissionType"
                        value={enquiryFilterState?.admissionType}
                        onChange={filterHandler}
                        menuItems={AdmissionTypeMenuOptions || []}
                        valueKey="id"
                        textKey="value"
                        formgroupClassName="tw-mb-0"
                        defaultSelect="Select"
                        labelText="Admission Type"
                    />
                </div>

                {/* Date Range */}
                <div className="tw-mb-3">
                    <CustomDatePicker
                        name="dateRange"
                        startDate={enquiryFilterState.startDate}
                        endDate={enquiryFilterState.endDate}
                        onChange={handleDateChange}
                        placeholder="Select a Date Range"
                        monthsShown={2}
                        formgroupClassName="tw-mb-0"
                        labelText="Date Range"
                        portalId={"unpaid-report-advance-filter"}
                    />
                </div>

            </div>

            {/* Footer Section */}
            <div className="tw-border-t tw-p-2 tw-text-center">
                <div className="tw-flex tw-gap-2 tw-justify-end">

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
