import React, { useEffect, useMemo, useRef, useState } from "react";
import { SelectInput, TextInput, } from "../../../../Components/Common";
import TableContainer from "../../../../Components/Common/TableContainer";
import { Button } from "reactstrap";
import { generateColumns, PrePrimaryResultTableData, selectData1, selectData2, selectData3, selectData4, } from "./helper";
import { default as PrintSvg } from "../../../../assets/imagesdps/academics/PrintSvg.svg?react";
import { default as EyeSvg } from "../../../../assets/imagesdps/academics/EyeSvg.svg?react";
import { default as MessageSvg } from "../../../../assets/imagesdps/academics/MessageSvg.svg?react";
import { useFormik } from "formik";

const initialValues = {
  search: "",
  year: "2022-23",
  class: "Class",
  examName: "Examination Name",
  assesment: "assesment",
};

const PrePrimaryResultEntry = () => {
  const [prePrimaryResult, setPrePrimaryResult] = useState(initialValues);
  const PrePrimaryResult = useFormik({
    enableReinitialize: true,
    initialValues: prePrimaryResult,
    onSubmit: (values) => {},
  });

 

  const columns = useMemo(() => generateColumns(), []);

  return (
    <>
      <div className="card d-inline-block w-100">
        <form onSubmit={PrePrimaryResult.handleSubmit}>
          <div className="px-4 py-2">
            <div className="bg-light row py-3">
              <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                <SelectInput
                  name="year"
                  value={PrePrimaryResult.values.year}
                  onChange={PrePrimaryResult.handleChange}
                  menuItems={selectData1}
                  valueKey="yearType"
                  textKey="yearType"
                  formgroupClassName="mb-0"
                  labelText="Academic Year"
                />
              </div>

              <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                <SelectInput
                  name="class"
                  value={PrePrimaryResult.values.class}
                  onChange={PrePrimaryResult.handleChange}
                  menuItems={selectData2}
                  valueKey="classType"
                  textKey="classType"
                  labelText="Class"
                />
              </div>
              <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                <SelectInput
                  name="examName"
                  value={PrePrimaryResult.values.examName}
                  onChange={PrePrimaryResult.handleChange}
                  menuItems={selectData3}
                  valueKey="examName"
                  textKey="examName"
                  formgroupClassName="mb-0"
                  labelText="Examination"
                />
              </div>
              <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                <SelectInput
                  name="assesment"
                  value={PrePrimaryResult.values.assesment}
                  onChange={PrePrimaryResult.handleChange}
                  menuItems={selectData4}
                  valueKey="assesmentType"
                  textKey="assesmentType"
                  // inputClassName="bg-light border-0"
                  formgroupClassName="mb-0"
                  labelText="Assesment"
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
          <div className="row px-3 g-3 pb-3">
            <div className="col-xs-12 col-md-12 col-lg-4 col-xl-3">
              <div className="search-box">
                <TextInput
                  name="search"
                  formgroupClassName="mb-0"
                  placeHolder="Search"
                  labelText="Search"
                  floatingLabel
                  value={PrePrimaryResult.values.search}
                  onChange={PrePrimaryResult.handleChange}
                />

                <i className="ri-search-line search-icon"></i>
              </div>
            </div>
          </div>
        </form>
        <TableContainer
          columns={columns || []}
          data={PrePrimaryResultTableData}
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

export default PrePrimaryResultEntry;
