import { SelectInput } from "../../../../Components/Common";
import { CustomDatePicker } from "../../../DashBoardBranchSummary/CustomDatePicker";

export const AdvanceFilterModal = () => {
  return (
    <>
      <div className="offcanvas-body">
        <div className="mb-3">
          <SelectInput
            name="statusIs"
            value={""}
            onChange={() => {}}
            menuItems={[]}
            valueKey=""
            textKey=""
            formgroupClassName="mb-0"
            labelText="Status"
          />
        </div>
        <div className="mb-3">
          <SelectInput
            name="subjectId"
            value={""}
            onChange={() => {}}
            menuItems={[]}
            valueKey=""
            textKey=""
            formgroupClassName="mb-0"
            labelText="Subject"
          />
        </div>
        <div className="mb-3">
          <SelectInput
            name="createdBy"
            value={""}
            onChange={() => {}}
            menuItems={[]}
            valueKey=""
            textKey=""
            formgroupClassName="mb-0"
            labelText="Created By"
          />
        </div>
        <div className="mb-3">
          <CustomDatePicker
            name="createdBy"
            startDate={""}
            endDate={""}
            onChange={() => {}}
            formgroupClassName="mb-0"
            placeholder="Select a Date Range"
            monthsShown={2}
            labelText="Date Range"
            portalId="advance-filter-course-directory-list"
          />
        </div>
      </div>
      <div className="border-top p-2 text-center">
        <div className="hstack gap-2 justify-content-end">
          <button type="submit" onClick={() => {}} className="btn btn-success">
            Submit
          </button>
        </div>
      </div>
    </>
  );
};
