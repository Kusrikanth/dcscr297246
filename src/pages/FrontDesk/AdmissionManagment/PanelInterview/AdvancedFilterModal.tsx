import React, { useEffect, useState } from 'react'
import { shallowEqual, useDispatch } from 'react-redux';
import { useAppSelector } from '../../../../hooks/storehook';
import { getClassListAdvanceFilter, resetClassListForAdvanceFilterAct } from '../../../../store/fee/feecollections/feecollectionactions';
import { generateActionPayload } from '../../../../utility/reduxutility';
import { DateInput, SelectInput } from '../../../../Components/Common';
import { Current_Date_YYYYMMDD } from '../../../../utility/dateutility';
import { CustomDatePicker } from '../../../DashBoardBranchSummary/CustomDatePicker';
import { admissionSourceOptions } from '../ApplicationSale/helper';
import Button from '../../../../Components/Common/Button';
// import { completionStatus, modeOptions, paymentStatus } from './helper';
// import { requestType, statusTypes } from './helper';

const initialValues: any = {
    academicYearId: "",
    curriculumId: "",
    classId: "",
    scheduleMode: null,
    interviewDate: null,
    endDate: "",
    startDate :"",
    searchString: "",
    rescheduleFilter :"",
    admissionSource :"",
    
};

const AdvanceFilterModal = (props: any) => {

    const dispatch = useDispatch();

    const [enquiryFilterState, setEnquiryFilterState] =
        useState<any>(props.appliedFilter || initialValues);

    const { currentBranchIdResp: branchId, currentInstIdResp: instituteId, academicYearListResp, brchCurriculumResp, branchClassResp, classListForAdvanceFilter, tcRequestList, showApiLoader,registrationTabId }: any =
        useAppSelector(
            ({ appData, instAcademics, branchAcademics, classroomManagmentInfo, feeCollections,globalData }) => ({
                currentBranchIdResp: appData.currentBranchIdResp,
                currentInstIdResp: appData.currentInstIdResp,
                loginUserDetailsResp: appData.loginUserDetailsResp,
                academicYearListResp: instAcademics.academicYearListResp,
                brchCurriculumResp: branchAcademics.brchCurriculumResp,
                branchClassResp: branchAcademics.branchClassResp,
                showApiLoader : globalData.showApiLoader,
                registrationTabId:globalData.registrationTabId,
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
        if(enquiryFilterState?.startDate && !enquiryFilterState?.endDate){
            props.applyFilterCallback({...enquiryFilterState , endDate : Current_Date_YYYYMMDD});
        }else{
            props.applyFilterCallback(enquiryFilterState);
        }
    }

    function resetHandler (){
        setEnquiryFilterState((prev: any) => ({ ...prev, startDate: "", endDate: "" }));
        props.toggleAdvanceFilter();
        props.applyFilterCallback({ ...enquiryFilterState, startDate: "", endDate: "" });
    }

    const handleDateChange = ({ startDate, endDate }:any)=>{
        if(startDate && endDate){
            setEnquiryFilterState((prev:any) => ({ ...prev, startDate, endDate }));
        }
    } 
    
    return (
        <>
            <div className="tw-p-4">
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
      portalId="panel-interview-advance-filter"
    />
  </div>

  {props?.menuId === "panelInterviewReschedule" && (
    <div className="tw-mb-3">
      <SelectInput
        name="rescheduleFilter"
        formgroupClassName="tw-mb-3 lg:tw-mb-1"
        value={enquiryFilterState?.rescheduleFilter}
        onChange={filterHandler}
        menuItems={[{ id: "ABSENT" }, { id: "REOBSERVATION" }]}
        valueKey="id"
        textKey="id"
        labelText="Reschedule Type"
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
