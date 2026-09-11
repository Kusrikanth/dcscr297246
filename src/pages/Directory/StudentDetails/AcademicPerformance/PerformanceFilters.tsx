import React from "react";
import { SelectInput } from "../../../../Components/Common";
import {
  academicYearOptions,
  examFilterOptions,
  subjectFilterOptions,
} from "./helper";


const PerformanceFilters = ({
  filterState,
  onChange,
}) => {
  return (
    <div className="tw-card !tw-overflow-visible">
      <div className="tw-card-body tw-grid tw-grid-cols-12 tw-gap-3">
        <div className="tw-col-span-12 sm:tw-col-span-6 xl:tw-col-span-4">
          <SelectInput
            name="academicYear"
            labelText="Academic Year"
            value={filterState.academicYear}
            onChange={onChange}
            menuItems={academicYearOptions}
            valueKey="key"
            textKey="name"
            formgroupClassName="tw-mb-0"
            floatingLabel
          />
        </div>
        <div className="tw-col-span-12 sm:tw-col-span-6 xl:tw-col-span-4">
          <SelectInput
            name="subject"
            labelText="Subject"
            value={filterState.subject}
            onChange={onChange}
            menuItems={subjectFilterOptions}
            valueKey="key"
            textKey="name"
            formgroupClassName="tw-mb-0"
            floatingLabel
          />
        </div>
        <div className="tw-col-span-12 sm:tw-col-span-6 xl:tw-col-span-4">
          <SelectInput
            name="exam"
            labelText="Exam"
            value={filterState.exam}
            onChange={onChange}
            menuItems={examFilterOptions}
            valueKey="key"
            textKey="name"
            formgroupClassName="tw-mb-0"
            floatingLabel
          />
        </div>
      </div>
    </div>
  );
};

export default React.memo(PerformanceFilters);
