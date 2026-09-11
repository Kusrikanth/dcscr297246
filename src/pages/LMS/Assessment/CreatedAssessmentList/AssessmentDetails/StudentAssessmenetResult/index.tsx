import { HugeiconsIcon } from "@hugeicons/react";
import { FilterIcon } from "@hugeicons-pro/core-stroke-standard";
import { useState } from "react";
import { useFilterState } from "../../../../../../hooks/filterhook";
import {
  OffCanvasContainer,
  SelectInput,
  TextInput,
} from "../../../../../../Components/Common";

import DefaultStudentImage from "../../../../../../assets/imagesdps/student-default-img.png";
import StudentAssessmentDetails from "./StudentAssessmentDetails";
import AdvanceFilterModal from "./AdvanceFilterModal";

const StudentAssessmentResult = () => {
  const [openAdvancedFilter, setOpenAdavancedFilter] = useState(false);
  const { showClearFilterState, count, advanceFilterChange } = useFilterState();

  function toggleAdvanceFilter() {
    setOpenAdavancedFilter((prev) => !prev);
  }

  return (
    <>
      <div className="">
        <div className="assessement-result-container">
          <div className="row w-100 mx-auto px-0 gx-2">
            <div className="col-12">
              <div className="card">
                <div className="card-body pt-4">
                  <div className="row g-2">
                    <div className="col-12 col-md-6 col-lg-2">
                      <SelectInput
                        name="academicYearId"
                        value={""}
                        onChange={() => {}}
                        menuItems={[]}
                        valueKey=""
                        textKey=""
                        labelText="Academic Year"
                        floatingLabel
                        formgroupClassName="mb-0"
                      ></SelectInput>
                    </div>
                    <div className="col-12 col-md-6 col-lg-2">
                      <SelectInput
                        name="curriculumId"
                        value={""}
                        onChange={() => {}}
                        menuItems={[]}
                        valueKey=""
                        textKey=""
                        labelText="Curriculum"
                        floatingLabel
                        formgroupClassName="mb-0"
                      ></SelectInput>
                    </div>
                    <div className="col-12 col-md-6 col-lg-2">
                      <SelectInput
                        name="classId"
                        value={""}
                        onChange={() => {}}
                        menuItems={[]}
                        valueKey=""
                        textKey=""
                        labelText="Class"
                        floatingLabel
                        formgroupClassName="mb-0"
                      ></SelectInput>
                    </div>
                    <div className="col-12 col-md-6 col-lg-2">
                      <SelectInput
                        name="sectionId"
                        value={""}
                        onChange={() => {}}
                        menuItems={[]}
                        valueKey=""
                        textKey=""
                        labelText="Section"
                        floatingLabel
                        formgroupClassName="mb-0"
                      ></SelectInput>
                    </div>
                    <div className="col-1">
                      <button
                        style={{
                          backgroundColor: "#F4F7FA",
                        }}
                        className="p-2 btn d-flex me-2"
                        onClick={toggleAdvanceFilter}
                      >
                        <HugeiconsIcon
                          icon={FilterIcon}
                          size={18}
                          className="me-2"
                        />
                        <span className="me-2">Filters</span>
                      </button>
                      <span
                        className="badge align-middle rounded-pill ms-1 "
                        style={{
                          marginBottom: "18px",
                          position: "absolute",
                          top: "-9px",
                          left: "78px",
                          background: "#0ab39c",
                        }}
                      >
                        {count}
                      </span>
                    </div>
                    {showClearFilterState && (
                      <div className="col-auto ms-auto d-flex">
                        <button
                          type="button"
                          className="btn btn-ghost-danger"
                          onClick={() => {}}
                        >
                          Clear Filter
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-xxl-3">
              <div className="card sticky-left-menucard">
                <div className="card-header">
                  <div className="search-box">
                    <TextInput
                      name="searchString"
                      value={""}
                      onChange={() => {}}
                      placeHolder="Search"
                      formgroupClassName="mb-0"
                    ></TextInput>
                    <i className="ri-search-line search-icon"></i>
                  </div>
                </div>
                <div className="card-body p-0">
                  <div className="d-flex flex-column align-items-center tw-pt-4 mb-3">
                    <div className="avatar-sm flex-shrink-0 rounded-circle me-2 tw-z-10">
                      <img
                        src={DefaultStudentImage}
                        className="img-fluid h-100 d-block rounded-circle"
                        width={"72px"}
                        height={"72px"}
                      ></img>
                    </div>
                    <p className="mb-0 ">Arun Kumar</p>
                    <span
                      className="px-3 py-2"
                      style={{
                        backgroundColor: "#F7B84B2D",
                        borderRadius: "5px",
                        color: "black",
                      }}
                    >
                      ID : 1238123
                    </span>
                  </div>
                  <div className="p-3 pt-0">
                    <div className="mb-2 row">
                      <p className="mb-0 text-muted col-5">Assessment Name</p>
                      <p className="mb-0 col-7">
                        <span className="me-2">:</span>
                        Final Exam
                      </p>
                    </div>
                    <div className="mb-2 row">
                      <p className="mb-0 text-muted col-5">Mode</p>
                      <p className="mb-0 col-7">
                        <span className="me-2">:</span>
                        Online
                      </p>
                    </div>
                    <div className="mb-2 row">
                      <p className="mb-0 text-muted col-5">Started Time</p>
                      <p className="mb-0 col-7">
                        <span className="me-2">:</span>
                        July 07, 2025 04:25 PM
                      </p>
                    </div>
                    <div className="mb-2 row">
                      <p className="mb-0 text-muted col-5">Finished Time</p>
                      <p className="mb-0 col-7">
                        <span className="me-2">:</span>
                        July 07, 2025 05:50 PM
                      </p>
                    </div>
                    <div className="mb-2 row">
                      <p className="mb-0 text-muted col-5">Time Spent</p>
                      <p className="mb-0 col-7">
                        <span className="me-2">:</span>
                        00:23:23
                      </p>
                    </div>
                    <div className="mb-2 row">
                      <p className="mb-0 text-muted col-5">IP Address</p>
                      <p className="mb-0 col-7">
                        <span className="me-2">:</span>
                        192.168.0.1
                      </p>
                    </div>
                    <div className="mb-2 row">
                      <p className="mb-0 text-muted col-5">Passing Score</p>
                      <p className="mb-0 col-7">
                        <span className="me-2">:</span>
                        40%
                      </p>
                    </div>
                    <div className="mb-2 row">
                      <p className="mb-0 text-muted col-5">Achieved Score</p>
                      <p className="mb-0 col-7">
                        <span className="me-2">:</span>
                        65%
                      </p>
                    </div>
                    <div className="mb-2 row">
                      <p className="mb-0 text-muted col-5">Achieved Marks</p>
                      <p className="mb-0 col-7">
                        <span className="me-2">:</span>
                        65
                      </p>
                    </div>
                    <div className="mb-2 row">
                      <p className="mb-0 text-muted col-5">Result</p>
                      <p className="mb-0 col-7">
                        <span className="me-2">:</span>
                        Pass
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-8 col-xxl-9">
              <StudentAssessmentDetails></StudentAssessmentDetails>
            </div>
          </div>
        </div>
      </div>

      <OffCanvasContainer
        id="moder-assessment-filter-offcanvas"
        isOpen={openAdvancedFilter}
        closeHndlr={toggleAdvanceFilter}
        headerTitle="Advance Filters"
      >
        <AdvanceFilterModal></AdvanceFilterModal>
      </OffCanvasContainer>
    </>
  );
};

export default StudentAssessmentResult;
