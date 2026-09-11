import React, { useEffect, useState } from 'react'
import { DateInput, } from '../../../Components/Common';
import { CustomDatePicker } from '../../DashBoardBranchSummary/CustomDatePicker';
import Button from '../../../Components/Common/Button';


const initialValues = {
    startDate: undefined,
    endDate: undefined
};

const AdvanceFilterModal = (props: any) => {
    const [advanceFilterState, setAdvanceFilterState] =
        useState<any>(props.appliedFilter || initialValues);

    const filterHandler = (event: any) => {
        const { name, value } = event.target;
        setAdvanceFilterState((prevState: any) => ({ ...prevState, [name]: value }));
    }
    function applyFilterHndlr() {
        // setEnquiryFilterState((prev: any) => ({ ...prev, paymentModes: paymentModeState, receiptTypes: receiptOptionState }))
        props.applyFilterCallback({ ...advanceFilterState });

    }
    function resetHandler() {
        setAdvanceFilterState(initialValues);
        props.toggleAdvanceFilter();
        props.applyFilterCallback(initialValues);
    }

    const handleDateChange = ({ startDate, endDate }:any)=>{
        if(startDate && endDate){
          setAdvanceFilterState((prev:any) => ({ ...prev, startDate, endDate }));
        }
    }

    return (
        <>
            <div className="tw-p-4 offcanvas-body">
                <div className="tw-mb-3">
                    <CustomDatePicker
                        name="dateRange"
                        startDate={advanceFilterState.startDate}
                        endDate={advanceFilterState.endDate}
                        onChange={handleDateChange}
                        placeholder="Select a Date Range"
                        monthsShown={2}
                        formgroupClassName="tw-mb-0"
                        labelText="Date Range"
                        portalId="admission-withdrawal-advance-filter"
                    />
                </div>
            </div>

            <div className="tw-border-t tw-p-2 tw-text-center">
                <div className="tw-flex tw-gap-2 tw-justify-end">
                    <Button
                        type="submit"
                        onClick={applyFilterHndlr}
                        disabled={props.showApiLoader}
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
