import { SelectInput } from "../../../../Components/Common";
import { CustomDatePicker } from "../../../DashBoardBranchSummary/CustomDatePicker";

const AdvanceFilterModal = () => {
  return (
    <>
      <div className="offcanvas-body">
        <div className="mb-3">
          <SelectInput
            name="sectionid"
            value=""
            onChange={() => {}}
            menuItems={[]}
            valueKey=""
            textKey=""
            labelText="Section"
            formgroupClassName="mb-0"
          ></SelectInput>
        </div>
        <div className="mb-3">
          <SelectInput
            name="subjectName"
            value=""
            onChange={() => {}}
            menuItems={[]}
            valueKey=""
            textKey=""
            labelText="Subject"
            formgroupClassName="mb-0"
          ></SelectInput>
        </div>
        <div className="mb-3">
          <SelectInput
            name="testType"
            value=""
            onChange={() => {}}
            menuItems={[]}
            valueKey=""
            textKey=""
            labelText="Test Type"
            formgroupClassName="mb-0"
          ></SelectInput>
        </div>
        <div className="mb-3">
          <CustomDatePicker
            name="dateRange"
            labelText="Date Range"
            formgroupClassName="mb-0"
            portalId="advance-filter-created-assessment-list"
          ></CustomDatePicker>
        </div>
      </div>
    </>
  );
};

export default AdvanceFilterModal;
