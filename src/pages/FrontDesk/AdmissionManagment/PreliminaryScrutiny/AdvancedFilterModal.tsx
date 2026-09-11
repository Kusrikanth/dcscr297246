import React, { useEffect, useState } from 'react'
import { shallowEqual, useDispatch } from 'react-redux';
import { useAppSelector } from '../../../../hooks/storehook';
import { getClassListAdvanceFilter, resetClassListForAdvanceFilterAct } from '../../../../store/fee/feecollections/feecollectionactions';
import { generateActionPayload } from '../../../../utility/reduxutility';
import { SelectInput } from '../../../../Components/Common';
import { Current_Date_YYYYMMDD } from '../../../../utility/dateutility';
import { AdmissionTypeMenuOptions } from './helper';
import { CustomDatePicker } from '../../../DashBoardBranchSummary/CustomDatePicker';
import { admissionSourceOptions } from '../ApplicationSale/helper';
import Button from '../../../../Components/Common/Button';
// import { requestType, statusTypes } from './helper';

const initialValues: any = {
    academicYearId: "",
    curriculumId: "",
    classId: "",
    searchString: "",
    scrutinyStatus: null,
    admissionType : null,
    startDate : "",
    endDate : "",
    admissionSource : "",
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
                const payload = { pageNo: 0, pageSize: 100, sortBy: "classSequence", orderBy: "asc", curriculumId: value, branchId , academicYearId : enquiryFilterState.academicYearId };
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
        setEnquiryFilterState((prev: any) => ({ ...prev, curriculumId: "",  classId: "",admissionType : null,startDate:"",endDate:"", }));
        props.toggleAdvanceFilter();
        props.applyFilterCallback({ ...enquiryFilterState, curriculumId: "",  classId: "",admissionType : null,startDate:"",endDate:"", });
    }


    useEffect(() => {
        if (!props.isOpen) {
            dispatch(resetClassListForAdvanceFilterAct(undefined));
        }
        else {
            if(props.appliedFilter.curriculumId && props.appliedFilter.academicYearId){
                const payload = { pageNo: 0, pageSize: 100, sortBy: "classSequence", orderBy: "asc", curriculumId: props.appliedFilter.curriculumId, branchId , academicYearId : props.appliedFilter.academicYearId};
                dispatch(getClassListAdvanceFilter(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
            }
        }
    }, [props.isOpen])

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
                <div className="tw-mb-3">
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
                <div className="tw-mb-3">
                    <SelectInput
                        name="classId"
                        value={enquiryFilterState?.classId}
                        onChange={filterHandler}
                        menuItems={classTypes || []}
                        valueKey="id"
                        textKey="className"
                        formgroupClassName="tw-mb-0"
                        defaultSelect="Class"
                        labelText="Class"
                    />
                </div>
                <div className="tw-mb-3">
                    <SelectInput
                        name="admissionType"
                        value={enquiryFilterState?.admissionType}
                        onChange={filterHandler}
                        menuItems={AdmissionTypeMenuOptions || []}
                        valueKey="id"
                        textKey="value"
                        formgroupClassName="tw-mb-0"
                        defaultSelect="Admission Type"
                        labelText="Admission Type"
                    />
                </div>
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
                        portalId={"preliminary-scrutiny-advance-filter"}
                    />
                </div>
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
            <div className="tw-border-t tw-border-gray-200 tw-p-2 tw-text-center">
                <div className="tw-flex tw-items-center tw-gap-2 tw-justify-end">
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
