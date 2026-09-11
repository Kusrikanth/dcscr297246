import React, { useState } from "react";
import { SelectInput } from "../../../Components/Common";
import { audienceOptions, branchOptions, statusOptions, typeOptions } from "./helper";
import Button from "../../../Components/Common/Button";

const AdvanceFilterModal = (props: any) => {
  const { applyFilterHndlr } = props;
  return (
    <>
      <div className="tw-p-4 tw-space-y-4">
        <div>
          <SelectInput
            name="type"
            labelText="Campaign Type"
            onChange={() => { }}
            menuItems={typeOptions || []}
            valueKey="value"
            textKey="label"
          />
        </div>

        <div>
          <SelectInput
            name="status"
            labelText="Status"
            onChange={() => { }}
            menuItems={statusOptions || []}
            valueKey="value"
            textKey="label"
          />
        </div>

        <div>
          <SelectInput
            name="audience"
            labelText="Audience"
            onChange={() => { }}
            menuItems={audienceOptions || []}
            valueKey="value"
            textKey="label"
          />
        </div>

        <div>
          <SelectInput
            name="branch"
            labelText="Branch"
            onChange={() => { }}
            menuItems={branchOptions || []}
            valueKey="value"
            textKey="label"
          />
        </div>
      </div>

      {/* Footer Section */}
      <div className="tw-border-t tw-border-gray-200 tw-p-4">
        <div className="tw-flex tw-justify-end">
          <Button
            type="submit"
            onClick={applyFilterHndlr}
            variant="primary"
          >
            Submit
          </Button>
        </div>
      </div>

    </>
  );
};

export default AdvanceFilterModal;
