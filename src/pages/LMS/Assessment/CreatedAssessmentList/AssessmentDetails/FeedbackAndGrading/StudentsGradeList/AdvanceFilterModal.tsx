import React, { useState } from "react";
import { SelectInput } from "../../../../../../../Components/Common";
import { attemptStatus, resultStatus } from "./helper";

const initialValues = {
    nameFilterType: "",
    attemptStatus: "",
    resultStatus: "",
};

const AdvanceFilterModal = (props: any) => {
  const [advanceFilterState, setAdvanceFilterState] = useState<any>(props.appliedFilter || initialValues);

  const filterHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setAdvanceFilterState((prev: any) => ({ ...prev, [name]: value }))
    }
  const applyFilterHndlr = () => {
        props.applyFilterCallback({ ...advanceFilterState });
        props.toggleAdvanceFilter();
    };
  
  return (
    <>
      <div className="offcanvas-body">
        {/* <div className="mb-3">
          <SelectInput
            name="assessmentId"
            value={""}
            onChange={() => {}}
            menuItems={[]}
            valueKey=""
            textKey=""
            labelText="Assessment"
          ></SelectInput>
        </div> */}
        <div className="mb-3">
          <SelectInput
            name="attemptStatus"
            value={advanceFilterState.attemptStatus}
            onChange={filterHandler}
            menuItems={attemptStatus || []}
            valueKey="value"
            textKey="label"
            labelText="Assessment Status"
          ></SelectInput>
        </div>
        <div className="mb-3">
          <SelectInput
            name="resultStatus"
            value={advanceFilterState.resultStatus}
            onChange={filterHandler}
            menuItems={resultStatus || []}
            valueKey="value"
            textKey="label"
            labelText="Result Status"
          ></SelectInput>
        </div>
      </div>
      <div className="border-top p-2 text-center">
        <div className="hstack gap-2 justify-content-end">
          <button type="submit" onClick={applyFilterHndlr} className="btn btn-success">
            Submit
          </button>
        </div>
      </div>
    </>
  );
};

export default AdvanceFilterModal;
