import { DateInput, SelectInput } from "../../../Components/Common";
import React, { useState } from "react";
import { CustomDatePicker } from "../../DashBoardBranchSummary/CustomDatePicker";
import Button from "../../../Components/Common/Button";

const initialValues = {
  receivedStartDate: "",
  receivedEndDate: "",
};

const AdvanceFilterModal = (props: any) => {
  const [advancedFilterState, setAdvancedFilterState] = useState(
    props.appliedFilter || initialValues
  );

  function onChangeFilterHndlr(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setAdvancedFilterState((prevState: any) => ({
      ...prevState,
      [name]: value,
    }));
  }

  function applyFilterHndlr() {
    props.applyFilterCallback(advancedFilterState);
  }

  const handleDateChange = ({ startDate, endDate }:any)=>{
    if(startDate && endDate){
      setAdvancedFilterState((prev:any) => ({ ...prev, receivedStartDate:startDate, receivedEndDate:endDate }));
    }
  }

  return (
    <>
      <div className="offcanvas-body">

        <div className="tw-flex-1 tw-overflow-y-auto tw-p-4">
          <div className="tw-mb-4">
            <CustomDatePicker
              name="dateRange"
              startDate={advancedFilterState.receivedStartDate}
              endDate={advancedFilterState.receivedEndDate}
              onChange={handleDateChange}
              placeholder="Select a Date Range"
              monthsShown={2}
              formgroupClassName="tw-mb-0"
              labelText="Date Range"
              portalId="webhool-logs-advanced-filter"
            />
          </div>
        </div>

        <div className="tw-border-t tw-border-gray-200 tw-p-4">
          <div className="tw-flex tw-justify-end tw-gap-3">
            <Button
              type="button"
              onClick={applyFilterHndlr}
              disabled={props.showApiLoader}
              variant="primary"
            >
              Submit
            </Button>
          </div>
        </div>

      </div>

    </>
  );
};

export default AdvanceFilterModal;
