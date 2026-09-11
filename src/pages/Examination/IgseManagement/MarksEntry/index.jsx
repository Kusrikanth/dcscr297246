import React, { useEffect, useMemo, useRef, useState } from "react";
import { RadioInputContainer, SelectInput, TextInput, } from "../../../../Components/Common";
import TableContainer from "../../../../Components/Common/TableContainer";
import { generateColumns, MarksEntryTableData, selectData1, selectData2, selectData3, selectData4, selectData5, } from "./helper";
import { default as PrintSvg } from "../../../../assets/imagesdps/academics/PrintSvg.svg?react";
import { default as EyeSvg } from "../../../../assets/imagesdps/academics/EyeSvg.svg?react";
import { default as MessageSvg } from "../../../../assets/imagesdps/academics/MessageSvg.svg?react";
import { useFormik } from "formik";

const initialValues = {
  search: "",
  year: "2022-23",
  class: "Class",
  examName: "Examination Name",
  section: "section",
  term: "",
};

const MarksEntry = () => {
  const [marksEntry, setMarksEntry] = useState(initialValues);
  const MarksEntry = useFormik({
    enableReinitialize: true,
    initialValues: marksEntry,
    onSubmit: (values) => {},
  });

  const columns = useMemo(() => generateColumns(), []);

  return (
    <>
      <div className="card d-inline-block w-100">
        <form onSubmit={MarksEntry.handleSubmit}>
          <div className="px-4 py-2">
            <div className="bg-light row pt-3">
              <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                <SelectInput
                  name="year"
                  value={MarksEntry.values.year}
                  onChange={MarksEntry.handleChange}
                  menuItems={selectData1}
                  valueKey="yearType"
                  textKey="yearType"
                  labelText="Academic Year"
                />
              </div>

              <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                <SelectInput
                  name="class"
                  value={MarksEntry.values.class}
                  onChange={MarksEntry.handleChange}
                  menuItems={selectData2}
                  valueKey="classType"
                  textKey="classType"
                  labelText="Class"
                />
              </div>
              <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                <SelectInput
                  name="examName"
                  value={MarksEntry.values.examName}
                  onChange={MarksEntry.handleChange}
                  menuItems={selectData3}
                  valueKey="examName"
                  textKey="examName"
                  labelText="Examination"
                />
              </div>
              <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                <SelectInput
                  name="term"
                  value={MarksEntry.values.term}
                  onChange={MarksEntry.handleChange}
                  menuItems={selectData5}
                  valueKey="termType"
                  textKey="termType"
                  // inputClassName="bg-light border-0"
                  labelText="Term"
                />
              </div>
              <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                <SelectInput
                  name="section"
                  value={MarksEntry.values.section}
                  onChange={MarksEntry.handleChange}
                  menuItems={selectData4}
                  valueKey="sectionType"
                  textKey="sectionType"
                  // inputClassName="bg-light border-0"
                  labelText="Section"
                />
              </div>
              <div className="col-auto ms-auto d-flex align-items-center">
                <button
                  className="btn btn-3"
                  style={{ background: "#405189", border: "none" }}
                >
                  <div className="d-flex align-items-center text-white">
                    <span>Filter</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
          <div className="row px-3 g-3 pt-2">
            <div className="col-xs-12 col-md-12 col-lg-4 col-xl-3">
              <div className="search-box">
                <TextInput
                  name="search"
                  placeHolder="Search"
                  labelText = "Search"
                  floatingLabel
                  value={MarksEntry.values.search}
                  onChange={MarksEntry.handleChange}
                />

                <i className="ri-search-line search-icon"></i>
              </div>
            </div>
          </div>
        </form>
        <TableContainer
          columns={columns || []}
          data={MarksEntryTableData}
          tableClass="mb-0"
          divClass="table-responsive mb-3"
          theadClass="table-light text-muted align-middle"
          showPagination={true}
          showCheckbox={true}
          totalPages={10}
          totalRecords={200}
          callbackPaginationHndlr={() => {}}
          currentPageNumber={1}
        />
      </div>
    </>
  );
};

export default MarksEntry;
