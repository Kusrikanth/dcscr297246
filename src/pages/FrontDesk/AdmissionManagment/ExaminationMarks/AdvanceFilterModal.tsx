import React, { useEffect, useState } from 'react'
import { shallowEqual, useDispatch } from 'react-redux';
import { useAppSelector } from '../../../../hooks/storehook';
import { getClassListAdvanceFilter, resetClassListForAdvanceFilterAct } from '../../../../store/fee/feecollections/feecollectionactions';
import { generateActionPayload } from '../../../../utility/reduxutility';
import { DateInput, SelectInput } from '../../../../Components/Common';
import { Current_Date_YYYYMMDD } from '../../../../utility/dateutility';
import { AdmissionTypeMenuOptions } from './helper';
import { CustomDatePicker } from '../../../DashBoardBranchSummary/CustomDatePicker';
import Button from '../../../../Components/Common/Button';
// import { completionStatus, modeOptions, paymentStatus } from './helper';
// import { requestType, statusTypes } from './helper';

const initialValues: any = {
    academicYearId: "",
    search: "",
    curriculumId: "",
    classId: "",
    examStartDate:"",
    examEndDate:"",
    recommended:null,
    admissionType:null,
};

const AdvanceFilterModal = (props: any) => {

    const dispatch = useDispatch();

    const [enquiryFilterState, setEnquiryFilterState] =
        useState<any>(props.appliedFilter || initialValues);

    const { currentBranchIdResp: branchId, currentInstIdResp: instituteId, academicYearListResp, brchCurriculumResp, branchClassResp, classListForAdvanceFilter, tcRequestList, showApiLoader }: any =
        useAppSelector(
            ({ appData, instAcademics, branchAcademics, classroomManagmentInfo, feeCollections,globalData }) => ({
                currentBranchIdResp: appData.currentBranchIdResp,
                currentInstIdResp: appData.currentInstIdResp,
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
        setEnquiryFilterState((prev:any) => ({ ...prev, [name]: value }))
        if (name === "curriculumId") {
            if (value) {
                const payload = { pageNo: 0, pageSize: 100, sortBy: "classSequence", orderBy: "asc", curriculumId: value, branchId };
                dispatch(getClassListAdvanceFilter(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
            }
        }
    }

    
    function applyFilterHndlr() {
        // setEnquiryFilterState((prev: any) => ({ ...prev, paymentModes: paymentModeState, receiptTypes: receiptOptionState }))
        if(enquiryFilterState?.examStartDate && !enquiryFilterState?.examEndDate){
            props.applyFilterCallback({...enquiryFilterState,examEndDate : Current_Date_YYYYMMDD });
        }else{
            props.applyFilterCallback({...enquiryFilterState ,recommended:enquiryFilterState?.recommended || null,admissionType:enquiryFilterState?.admissionType || null, });
        }
    }

    function resetHandler (){
        setEnquiryFilterState((prev: any) => ({ ...prev, examStartDate: "", examEndDate: "" }));
        props.toggleAdvanceFilter();
        props.applyFilterCallback({ examStartDate: "", examEndDate: "" });
    }

    const handleDateChange = ({ startDate, endDate }:any)=>{
        if(startDate && endDate){
            setEnquiryFilterState((prev:any) => ({ ...prev, examStartDate:startDate, examEndDate:endDate }));
        }
    } 

    const { data: academicYearList } = academicYearListResp || {};
    const { data: curriculumTypes } = brchCurriculumResp || {};
    const { data: TcRequestList, totalElements, totalPages, pageNumber } = tcRequestList || {};
    const { content: classTypes } = classListForAdvanceFilter || {};
    return (
        <>
            <div className="offcanvas-body">
             
                <div className='tw-mb-3'>
                    <CustomDatePicker
                        name="dateRange"
                        startDate={enquiryFilterState.examStartDate}
                        endDate={enquiryFilterState.examEndDate}
                        onChange={handleDateChange}
                        placeholder="Select a Date Range"
                        monthsShown={2}
                        formgroupClassName="tw-mb-0"
                        labelText="Date Range"
                        portalId={"examination-marks-advance-filter"}
                    />
                </div>

                <div className="tw-mb-3">
                    <SelectInput
                        name="recommended"
                        formgroupClassName="tw-mb-3 lg:tw-mb-1"
                        value={enquiryFilterState?.recommended || ""}
                        onChange={filterHandler}
                        menuItems={[{ id: "YES", name: "Pass" }, { id: "NO", name: "Fail" }]}
                        valueKey="id"
                        textKey="name"
                        labelText="Status"
                    />
                </div>

                <div className="tw-mb-3">
                    <SelectInput
                        name="admissionType"
                        formgroupClassName="tw-mb-3 lg:tw-mb-1"
                        value={enquiryFilterState?.admissionType || ""}
                        onChange={filterHandler}
                        menuItems={AdmissionTypeMenuOptions}
                        valueKey="id"
                        textKey="id"
                        labelText="Admission Type"
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
