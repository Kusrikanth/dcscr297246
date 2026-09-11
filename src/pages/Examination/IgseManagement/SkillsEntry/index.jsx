import React, { useEffect, useMemo, useRef, useState } from "react";
import { SelectInput, TextInput, } from "../../../../Components/Common";
import {selectData1, selectData2, selectData3, selectData4,} from "./helper";
import { useFormik } from "formik";
import UpdatedHorizontalTab from "../../../../Components/Common/UpdatedHorizontalTab";
import CurricularSkills from "./CurricularSkills";
import SportsSkills from "./SportsSkills";
import CambridgeLearnerAttribute from "./CambridgeLearnerAttributes";

const initialValues = {
  search: "",
  year: "2022-23",
  class: "Class",
  termName: "Term",
  section: "section",
};

const SkillsEntry = () => {

  const [activeId, setActiveId] = useState("learningSubject");

  const [gradesEntry, setGradesEntry] = useState(initialValues);
  const GradesEntry = useFormik({
    enableReinitialize: true,
    initialValues: gradesEntry,
    onSubmit: (values) => {},
  });


  const MenuOptions = [
    {
      id: "learningSubject",
      labelName: "Personality , Creative & Professional Curricular Skills",
      customPadding: "0px 15px",
    },
    {
      id: "SportsSkills",
      labelName: "Soft Skills & Physical Education : Sports Skills",
      customPadding: "0px 15px",
    },
    {
      id: "cambridgeLearnerAttribute",
      labelName: "Cambridge Learner Attributes",
      customPadding: "0px 15px",
    }
  ];
  function getActiveMenuComponent(menuId) { 
    switch (menuId) {
      case "learningSubject":
       return CurricularSkills;
       case "SportsSkills":
         return SportsSkills; 
      case "cambridgeLearnerAttribute":
        return CambridgeLearnerAttribute;
      default:
        return null; 
    }
  }
  function clickMenuHandler(event) { 
    const { currentTarget } = event,
      menuId = currentTarget.getAttribute("data-id");
    setActiveId(menuId);
  }
  const activeComponent = useMemo(() => {
    const TabComponent = getActiveMenuComponent(activeId);
    return (
      <TabComponent />
    );
  }, [activeId]);

  return (
    <>
      <div className="card d-inline-block w-100">
        <form onSubmit={GradesEntry.handleSubmit}>
          <div className="px-4 pt-2">
            <div className="bg-light row pt-3">
              <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                <SelectInput
                  name="year"
                  value={GradesEntry.values.year}
                  onChange={GradesEntry.handleChange}
                  menuItems={selectData1}
                  valueKey="yearType"
                  textKey="yearType"
                  labelText="Academic Year"
                />
              </div>
              <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                <SelectInput
                  name="class"
                  value={GradesEntry.values.class}
                  onChange={GradesEntry.handleChange}
                  menuItems={selectData2}
                  valueKey="classType"
                  textKey="classType"
                  labelText="Class"
                />
              </div>
              
              <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                <SelectInput
                  name="section"
                  value={GradesEntry.values.section}
                  onChange={GradesEntry.handleChange}
                  menuItems={selectData4}
                  valueKey="sectionType"
                  textKey="sectionType"
                  // inputClassName="bg-light border-0"
                  labelText="Section"
                />
              </div>
              <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
              <SelectInput
                  name="termName"
                  value={GradesEntry.values.termName}
                  onChange={GradesEntry.handleChange}
                  menuItems={selectData3}
                  valueKey="termName"
                  textKey="termName"
                  labelText="Term Name"
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
          <div className="row px-3 pt-3 mb-0">
            <div className="col-xs-12 col-md-12 col-lg-4 col-xl-3">
              <div className="search-box">
                <TextInput
                  name="search"
                  placeHolder="Search"
                  labelText = "Search"
                  floatingLabel
                  value={GradesEntry.values.search}
                  onChange={GradesEntry.handleChange}
                />
                <i className="ri-search-line search-icon"></i>
              </div>
            </div>
          </div>
        </form>
        <UpdatedHorizontalTab
                MenuOptions={MenuOptions}
                clickMenuHandler={clickMenuHandler}
                activeTabId={activeId}
                showBadge={true}
                horizontalClass="mb-3 overflow-auto text-nowrap"
              />
              {activeComponent}
      </div>
    </>
  );
};

export default SkillsEntry;
