import React, {  useState } from 'react'
import { shallowEqual } from 'react-redux';
import { useAppSelector } from '../../../hooks/storehook';
import { DateInput } from '../../../Components/Common';
import { Current_Date_YYYYMMDD } from '../../../utility/dateutility';
import Button from '../../../Components/Common/Button';


const initialValues = {
    startDate: null,
    endDate: null,
};


const AdvanceFilterModal = (props: any) => {
    const [advanceFilterState, setAdvanceFilterState] = useState(props.filterState || initialValues);


    const applyFilterHndlr = () => {
        props.applyFilterCallback({ ...advanceFilterState });
        props.toggleAdvanceFilter();
    }; 
  
    const onChangeFilterHndlr = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
            setAdvanceFilterState((prev: typeof initialValues) => ({ ...prev, [name]: value }))
    }
    return (
        <>
            <div className="offcanvas-body">
                <div className="tw-mb-3">
                    <DateInput
                        name="startDate"
                        value={advanceFilterState.startDate}
                        onChange={onChangeFilterHndlr}
                        formgroupClassName="tw-mb-0"
                        labelText="Start Date"
                        // floatingLabel
                    />
                </div>

                <div className="tw-mb-3">
                    <DateInput
                        name="endDate"
                        value={advanceFilterState.endDate}
                        onChange={onChangeFilterHndlr}
                        formgroupClassName="tw-mb-0"
                        labelText="End Date"
                        // floatingLabel
                    />
                </div>
            </div>

            <div className="tw-border-t tw-p-2 tw-text-center">
                <div className="tw-flex tw-gap-2 tw-justify-end">
                    <Button
                        type="submit"
                        variant='primary'
                        onClick={applyFilterHndlr}
                    >
                        Submit
                    </Button>
                </div>
            </div>
        </>
    )
}

export default AdvanceFilterModal
