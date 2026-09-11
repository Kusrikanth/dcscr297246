import React, {  useState } from 'react'
import { shallowEqual } from 'react-redux';
import { DateInput, SelectInput } from '../../../../../Components/Common';
import { CustomDatePicker } from '../../../../DashBoardBranchSummary/CustomDatePicker';
import Button from '../../../../../Components/Common/Button';



const initialValues = {
    // startDate: null,
    // endDate: null,
    roleType: null,
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

    // const handleDateChange = ({ startDate, endDate }:any)=>{
    //     if(startDate && endDate){
    //       setAdvanceFilterState((prev:any) => ({ ...prev, startDate, endDate }));
    //     }
    // } 
    return (
        <>
            <div className="offcanvas-body">
                {/* <div className='mb-3'>
                    <CustomDatePicker
                      name="dateRange"
                      startDate={advanceFilterState.startDate}
                      endDate={advanceFilterState.endDate}
                      onChange={handleDateChange}
                      placeholder="Select a Date Range"
                      monthsShown={2}
                      formgroupClassName="mb-0"
                      labelText='Date Range'
                      portalId={"advance-filter-login-user"}
                    />
                </div> */}
                <div>
                    <SelectInput
                        name="roleType"
                        value={advanceFilterState.roleType}
                        onChange={onChangeFilterHndlr}
                        menuItems={props?.getRoleTypeListResp || []}
                        valueKey="roleTypes"
                        textKey="roleTypes"
                        formgroupClassName="tw-mb-0"
                        labelText="Role Type"                    />
                </div>
                                               
            </div>
            <div className="tw-border-t tw-p-2 tw-text-center">
                <div className="tw-flex tw-justify-end tw-gap-2">
                    <Button
                        variant="primary"
                        type="button"
                        className="tw-px-2 tw-py-1"
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
