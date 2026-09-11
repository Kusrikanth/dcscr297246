import React, {  useMemo, useState } from "react";
import {  SelectInput, TextInput, } from "../../../../Components/Common";
import { selectData1, selectData2, selectData3, selectData4, selectData5, } from "./helper";
import { useFormik } from "formik";
import UpcomingEvents from "./StudentDetails";
import AssesmentObjective from "./AssesmentObjective";

const initialValues = {
  search: "",
  year: "2022-23",
  class: "Class",
  termName: "Term",
  section: "Section",
  subjectTypeII: "Subject",
};

const AoGradeEntry = () => {
  const [internalSubjectsGradesEntry, setInternalSubjectsGradesEntry] = useState(initialValues);
  const InternalSubjectsGradesEntry = useFormik({
    enableReinitialize: true,
    initialValues: internalSubjectsGradesEntry,
    onSubmit: (values) => {},
  });



  return (
    <>
      <div className="card d-inline-block w-100">
        <form onSubmit={InternalSubjectsGradesEntry.handleSubmit}>
          <div className="px-4 pt-2">
            <div className="row pt-3">
            <div className="col-xs-12 col-md-12 col-lg-2">
              <div className="search-box">
                <TextInput
                  name="search"
                  formgroupClassName="mb-0"
                  placeHolder="Search"
                  labelText = "Search"
                  floatingLabel
                  value={InternalSubjectsGradesEntry.values.search}
                  onChange={InternalSubjectsGradesEntry.handleChange}
                />

                <i className="ri-search-line search-icon"></i>
              </div>
            </div>
              <div className="col-xs-12 col-md-12 col-lg-2">
                <SelectInput
                  name="year"
                  value={InternalSubjectsGradesEntry.values.year}
                  onChange={InternalSubjectsGradesEntry.handleChange}
                  menuItems={selectData1}
                  valueKey="yearType"
                  textKey="yearType"
                  formgroupClassName="mb-0"
                  labelText = "Academic Year"
                  floatingLabel
                />
              </div>

              <div className="col-xs-12 col-md-12 col-lg-2">
                <SelectInput
                  name="class"
                  value={InternalSubjectsGradesEntry.values.class}
                  onChange={InternalSubjectsGradesEntry.handleChange}
                  menuItems={selectData2}
                  valueKey="classType"
                  textKey="classType"
                  labelText = "Class"
                  floatingLabel
                />
              </div>
              <div className="col-xs-12 col-md-12 col-lg-2">
                <SelectInput
                  name="section"
                  value={InternalSubjectsGradesEntry.values.section}
                  onChange={InternalSubjectsGradesEntry.handleChange}
                  menuItems={selectData4}
                  valueKey="sectionType"
                  textKey="sectionType"
                  // inputClassName="bg-light border-0"
                  formgroupClassName="mb-0"
                  labelText = "Section"
                  floatingLabel
                />
              </div>
              <div className="col-xs-12 col-md-12 col-lg-2">
                <SelectInput
                  name="termName"
                  value={InternalSubjectsGradesEntry.values.termName}
                  onChange={InternalSubjectsGradesEntry.handleChange}
                  menuItems={selectData3}
                  valueKey="termName"
                  textKey="termName"
                  formgroupClassName="mb-0"
                  labelText = "Term"
                  floatingLabel
                />
              </div>
              <div className="col-xs-12 col-md-12 col-lg-2">
                <SelectInput
                  name="subjectTypeII"
                  value={InternalSubjectsGradesEntry.values.subjectTypeII}
                  onChange={InternalSubjectsGradesEntry.handleChange}
                  menuItems={selectData5}
                  valueKey="subjectType"
                  textKey="subjectType"
                  formgroupClassName="mb-0"
                  labelText = "Subject Type"
                  floatingLabel
                />
              </div>
            </div>
          </div>
        </form>
      </div>
      <div className="row">
      <div className="col-4">
            <UpcomingEvents />
          </div>
          <div className="col-8">
            <AssesmentObjective />
          </div>
          </div>
    </>
  );
};

export default AoGradeEntry;
