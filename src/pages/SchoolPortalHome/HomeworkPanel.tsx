import React, { useMemo, useState } from "react";
import { DateInput, MultiSelectCheckbox } from "../../Components/Common";
import TableContainer from "../../Components/Common/TableContainer";
import { IPaginationState } from "../../Components/Common/Pagination";
import {
  classOptions,
  curriculumOptions,
  generateHomeworkColumns,
  homeworkRecords,
  sectionOptions,
} from "./helper";

const defaultHomeworkDate = "2026-08-16";

interface IFilterOption {
  id: string;
  name: string;
}

const HomeworkPanel: React.FC = () => {
  const [filterState, setFilterState] = useState<any>({
    curricula: [],
    classes: [],
    sections: [],
    date: "",
  });
  const [paginationState, setPaginationState] = useState<IPaginationState>({
    pageNo: 0,
    pageSize: 10,
  });

  const effectiveDate = filterState.date || defaultHomeworkDate;

  const filteredRecords = useMemo(() => {
    const curricula = (filterState.curricula || []).map(
      (item: IFilterOption) => item.name
    );
    const classes = (filterState.classes || []).map(
      (item: IFilterOption) => item.name
    );
    const sections = (filterState.sections || []).map(
      (item: IFilterOption) => item.name
    );

    return homeworkRecords.filter((record) => {
      if (!record.datetime.startsWith(effectiveDate)) return false;
      if (curricula.length && !curricula.includes(record.curriculum))
        return false;
      if (
        classes.length &&
        !record.targets.some((target) => classes.includes(target.split("-")[0]))
      )
        return false;
      if (
        sections.length &&
        !record.targets.some((target) => sections.includes(target.split("-")[1]))
      )
        return false;
      return true;
    });
  }, [filterState, effectiveDate]);

  const pagedRecords = useMemo(() => {
    const start = paginationState.pageNo * paginationState.pageSize;
    return filteredRecords.slice(start, start + paginationState.pageSize);
  }, [filteredRecords, paginationState]);

  const columns = useMemo(() => generateHomeworkColumns(), []);

  function onSelectOptionHndlr(selectedOptions: any, config?: any) {
    const { name } = config || {};
    setFilterState((prevState: any) => ({
      ...prevState,
      [name]: Array.isArray(selectedOptions) ? selectedOptions : [],
    }));
    setPaginationState((prevState) => ({ ...prevState, pageNo: 0 }));
  }

  function renderValue(selectedItems: Array<IFilterOption>) {
    if (!Array.isArray(selectedItems) || !selectedItems.length) return null;
    return (
      <div className="text-truncate">
        {selectedItems.map((item) => item?.name).join(", ")}
      </div>
    );
  }

  function renderOptions(item: IFilterOption) {
    return item?.name;
  }

  return (
    <div className="tw-card tw-mb-0 tw-h-full !tw-overflow-visible">
      <div className="tw-card-header">
        <h4 className="tw-card-title">Homework overview</h4>
        <p className="tw-card-subTitle">
          {filterState.date
            ? new Date(`${filterState.date}T00:00:00`).toLocaleDateString(
              "en-IN",
              { day: "numeric", month: "short", year: "numeric" }
            )
            : "Today"}{" "}
          · Homework and files shared through the system
        </p>
      </div>

      <div className="tw-grid tw-grid-cols-12 tw-gap-3 tw-px-4 tw-py-3">
        <div className="tw-col-span-12 sm:tw-col-span-6 lg:tw-col-span-3">
          <MultiSelectCheckbox
            name="curricula"
            idKey="id"
            searchKey="name"
            labelText="Curriculum"
            defaultSelect="All"
            value={filterState.curricula}
            options={curriculumOptions}
            renderValue={renderValue}
            renderOptions={renderOptions}
            onChange={onSelectOptionHndlr}
            floatingLabel
          />
        </div>
        <div className="tw-col-span-12 sm:tw-col-span-6 lg:tw-col-span-3">
          <MultiSelectCheckbox
            name="classes"
            idKey="id"
            searchKey="name"
            labelText="Class"
            defaultSelect="All"
            value={filterState.classes}
            options={classOptions}
            renderValue={renderValue}
            renderOptions={renderOptions}
            onChange={onSelectOptionHndlr}
            floatingLabel
          />
        </div>
        <div className="tw-col-span-12 sm:tw-col-span-6 lg:tw-col-span-3">
          <MultiSelectCheckbox
            name="sections"
            idKey="id"
            searchKey="name"
            labelText="Section"
            defaultSelect="All"
            value={filterState.sections}
            options={sectionOptions}
            renderValue={renderValue}
            renderOptions={renderOptions}
            onChange={onSelectOptionHndlr}
            floatingLabel
          />
        </div>
        <div className="tw-col-span-12 sm:tw-col-span-6 lg:tw-col-span-3">
          <DateInput
            name="date"
            labelText="Date"
            value={filterState.date}
            formgroupClassName="tw-mb-0"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              const { value } = event.target;
              setFilterState((prevState: any) => ({
                ...prevState,
                date: value,
              }));
              setPaginationState((prevState) => ({ ...prevState, pageNo: 0 }));
            }}
            floatingLabel
          />
        </div>
      </div>

      <TableContainer
        columns={columns}
        data={pagedRecords}
        divClass="tw-overflow-x-auto"
        tableClass="tw-w-full tw-whitespace-nowrap"
        theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
        showPagination={filteredRecords.length > 0}
        totalPages={Math.ceil(
          filteredRecords.length / paginationState.pageSize
        )}
        totalRecords={filteredRecords.length}
        currentPageNumber={paginationState.pageNo}
        callbackPaginationHndlr={(updatedState: IPaginationState) =>
          setPaginationState(updatedState)
        }
      />
    </div>
  );
};

export default HomeworkPanel;
