import React, {  useState } from 'react'
import { Button, DateInput,  } from '../../../Components/Common';

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

    return (
        <>
            <div className="offcanvas-body">
                <div className='mb-3'>
                    <DateInput
                        name="startDate"
                        value={advanceFilterState?.startDate}
                        onChange={filterHandler}
                        // inputClassName="bg-light"
                        formgroupClassName="mb-0"
                        labelText="Start Date"
                        minDate={props.minStartDate}
                    />
                </div>
                <div className='mb-3'>
                    <DateInput
                        name="endDate"
                        value={advanceFilterState?.endDate}
                        onChange={filterHandler}
                        // inputClassName="bg-light"
                        formgroupClassName="mb-0"
                        labelText="End Date"
                    />
                </div>
            </div>
            <div className="tw-border-t tw-p-2 tw-text-center">
                <div className="tw-flex tw-gap-2 tw-justify-end">
                    <Button
                        type="submit"
                        onClick={applyFilterHndlr}
                        disabled={props.showApiLoader}
                        variant="primary"
                    >
                        Submit
                    </Button>
                </div>
            </div>
        </>
    )
}

export default AdvanceFilterModal
