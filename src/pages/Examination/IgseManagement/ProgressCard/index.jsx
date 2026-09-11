import React, { useEffect, useMemo, useRef, useState } from "react";
import { ModalContainerUpdated, RadioInputContainer, SelectInput, TextInput, } from "../../../../Components/Common";
import TableContainer from "../../../../Components/Common/TableContainer";
import { generateColumns, ProgressCardTableData, selectData1, selectData2, selectData3, selectData4, selectData5, } from "./helper";
import { default as PrintSvg } from "../../../../assets/imagesdps/academics/PrintSvg.svg?react";
import { default as EyeSvg } from "../../../../assets/imagesdps/academics/EyeSvg.svg?react";
import { default as MessageSvg } from "../../../../assets/imagesdps/academics/MessageSvg.svg?react";
import { useFormik } from "formik";

const initialValues = {
  search: "",
  student: "",
  year: "2022-23",
  class: "Class",
  examName: "Examination Name",
  section: "section",
  generateFor: "",
};

const ProgressCard = () => {
  const [progressCard, setProgressCard] = useState(initialValues);
  const ProgressCard = useFormik({
    enableReinitialize: true,
    initialValues: progressCard,
    onSubmit: (values) => {},
  });

  const menuOptions = useMemo(
    () => [
      {
        id: "viewDetails",
        actionIcon: <EyeSvg className="me-2 d-inline-block" fill="#878a99" />,
        actionName: "View Details",
        onClick: () => {},
      },
      {
        id: "message",
        actionIcon: (
          <MessageSvg className="me-2 d-inline-block" fill="#878a99" />
        ),
        actionName: "Send Message",
        onClick: () => {},
      },
      {
        id: "print",
        actionIcon: (
          <PrintSvg className="me-2 d-inline-block" stroke="#707070" />
        ),
        actionName: "Print",
      },
    ],
    []
  );

  const columns = useMemo(() => generateColumns(menuOptions), []);

  return (
    <>
      <div className="card d-inline-block w-100">
        <form onSubmit={ProgressCard.handleSubmit}>
          <div className="px-4 py-2">
            <div className="bg-light row pt-3">
              <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                <SelectInput
                  name="year"
                  value={ProgressCard.values.year}
                  onChange={ProgressCard.handleChange}
                  menuItems={selectData1}
                  valueKey="yearType"
                  textKey="yearType"
                  labelText="Academic Year"
                />
              </div>
              <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                <SelectInput
                  name="class"
                  value={ProgressCard.values.class}
                  onChange={ProgressCard.handleChange}
                  menuItems={selectData2}
                  valueKey="classType"
                  textKey="classType"
                  labelText="Class"
                />
              </div>
              
              <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                <SelectInput
                  name="section"
                  value={ProgressCard.values.section}
                  onChange={ProgressCard.handleChange}
                  menuItems={selectData4}
                  valueKey="sectionType"
                  textKey="sectionType"
                  // inputClassName="bg-light border-0"
                  labelText="Section"
                />
              </div>
            </div>
            <div className="bg-light row">
              <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                <SelectInput
                  name="generateFor"
                  value={ProgressCard.values.generateFor}
                  onChange={ProgressCard.handleChange}
                  menuItems={selectData5}
                  valueKey="generateForType"
                  textKey="generateForType"
                  labelText="Report Generation"
                />
              </div>
              <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
              <RadioInputContainer
                   name="generateFor"
                   labelText="Generate For"
                   inputContainerClassName="mt-2"
                   radioOptions={[{ id: "all", name: "All" }, { id: "individual", name: "Individual" }]}
                   value={ProgressCard.values.generateFor}
                   onChange={ProgressCard.handleChange}
               />
              </div>
              
              <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                <SelectInput
                  name="examName"
                  value={ProgressCard.values.examName}
                  onChange={ProgressCard.handleChange}
                  menuItems={selectData3}
                  valueKey="examName"
                  textKey="examName"
                  labelText="Examination"
                />
              </div>
              <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
              <TextInput
                  name="student"
                  value={ProgressCard.values.student}
                  onChange={ProgressCard.handleChange}
                  labelText="Student Id"
                />
              </div>
              <div className="col-auto ms-auto d-flex align-items-center">
                <button className="btn btn-success float-end ">Search</button>
              </div>
            </div>
          </div>
          <div className="row px-3 g-3 pb-3 pt-3">
            <div className="col-xs-12 col-md-12 col-lg-4 col-xl-3">
              <div className="search-box">
                <TextInput
                  name="search"
                  placeHolder="Search"
                  labelText = "Search"
                  floatingLabel
                  value={ProgressCard.values.search}
                  onChange={ProgressCard.handleChange}
                />

                <i className="ri-search-line search-icon"></i>
              </div>
            </div>
              <div className="col-auto ms-auto d-flex align-items-center">
                <button  className="btn btn-3" style={{ background: "#405189", border: "none" }}><div className="d-flex align-items-center text-white">
                    <span>Generate</span>
                  </div></button>
              </div>
          </div>
        </form>
        <TableContainer
          columns={columns || []}
          data={ProgressCardTableData}
          tableClass="mb-0"
          divClass="table-responsive mb-3"
          theadClass="table-light text-muted align-middle"
          showPagination={true}
          totalPages={10}
          totalRecords={200}
          callbackPaginationHndlr={() => {}}
          currentPageNumber={1}
        />
      </div>
    </>
  );
};

export default ProgressCard;
