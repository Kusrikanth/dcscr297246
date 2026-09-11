import React, { useEffect, useState } from 'react'
import { shallowEqual, useDispatch } from 'react-redux';
import { useAppSelector } from '../../../hooks/storehook';
import { Current_Date_YYYYMMDD } from '../../../utility/dateutility';
import { DateInput } from '../../../Components/Common';
import { CustomDatePicker } from '../../DashBoardBranchSummary/CustomDatePicker';
import Button from '../../../Components/Common/Button';

const initialValues: any = {
    startDate:"",
    endDate:"",
};

const AdvanceFilterModal = (props: any) => {

    const dispatch = useDispatch();

    const [enquiryFilterState, setEnquiryFilterState] =
        useState<any>(props.appliedFilter || initialValues);

    const { currentBranchIdResp: branchId, currentInstIdResp: instituteId, showApiLoader }: any =
        useAppSelector(
            ({ appData, instAcademics, branchAcademics, classroomManagmentInfo, feeCollections,globalData }) => ({
                currentBranchIdResp: appData.currentBranchIdResp,
                currentInstIdResp: appData.currentInstIdResp,
                showApiLoader : globalData.showApiLoader,
            }),
            shallowEqual
        );

    const filterHandler = (event: any) => {
        const { name, value } = event.target;
        setEnquiryFilterState((prev:any) => ({ ...prev, [name]: value }))
    }

    
    function applyFilterHndlr() {
    
        props.toggleAdvanceFilter()
        if(enquiryFilterState?.startDate && !enquiryFilterState?.endDate){
            props.applyFilterCallback({...enquiryFilterState,endDate : Current_Date_YYYYMMDD });
        }else{
            props.applyFilterCallback({...enquiryFilterState ,recommended:enquiryFilterState?.recommended || null,admissionType:enquiryFilterState?.admissionType || null, });
        }
    }

    const handleDateChange = ({ startDate, endDate }:any)=>{
        if(startDate && endDate){
            setEnquiryFilterState((prev:any) => ({ ...prev, startDate,endDate }));
        }
    }

    return (
        <>
            <div className="offcanvas-body">

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
                        portalId="health-form-verification-advance-filter"
                    />
                </div>

            </div>

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
