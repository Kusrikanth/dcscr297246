import { useFormik } from "formik";
import React, { useState } from "react";
import { SelectInput } from "../../../Components/Common";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import Button from "../../../Components/Common/Button";
import DueFeesDetailsOfStu from "./DueFeesDetailsOfStu";
import { feeDueSummaryFilterTypes } from "./feeDueSummaryTypes";
import {
  selectData1,
  selectData2,
  selectData3,
  selectData4,
  selectData5,
} from "./helper";
import TotalFeedueOfClass from "./TotalFeedueOfClass";

const initialValues: feeDueSummaryFilterTypes = {
  academicYear: "All",
  curriculum: "CBSE",
  feeName: "All",
  class: "VII",
  section: "VII A",
};

const FeeDueSummary = () => {
  const [feeDueSummaryFilterState, setFeeDueSummaryFilterState] =
    useState<feeDueSummaryFilterTypes>(initialValues);

  const FeeDueSummaryForm = useFormik({
    enableReinitialize: true,
    initialValues: feeDueSummaryFilterState,
    onSubmit: (values) => {},
  });

  return (
    <>
      <div className="page-content fee_due_summary_wrap">
        <div className="container-fluid">
          <BreadCrumb title="Fee Due Summary" pageTitle="Fee" />

          <div className="card">
            <div className="card-header">
              <div className="tw-flex tw-items-center">
                <div className="tw-flex-1">
                  <h4 className="card-title tw-mb-0 tw-flex-grow">
                    Fee Due Summary
                  </h4>
                </div>
              </div>
            </div>

            <div className="card-body">
              <div className="tw-grid tw-grid-cols-12 tw-gap-3">
                <div className="tw-col-span-12 xl:tw-col-span-2">
                  <SelectInput
                    name="academicYear"
                    labelText="Academic Year"
                    value={FeeDueSummaryForm.values.academicYear}
                    onChange={FeeDueSummaryForm.handleChange}
                    menuItems={selectData1}
                    valueKey="academicYearType"
                    textKey="academicYearType"
                    formgroupClassName="tw-mb-0"
                  />
                </div>

                <div className="tw-col-span-12 xl:tw-col-span-2">
                  <SelectInput
                    name="curriculum"
                    labelText="Curriculum"
                    value={FeeDueSummaryForm.values.curriculum}
                    onChange={FeeDueSummaryForm.handleChange}
                    menuItems={selectData2}
                    valueKey="curriculumType"
                    textKey="curriculumType"
                    formgroupClassName="tw-mb-0"
                  />
                </div>

                <div className="tw-col-span-12 xl:tw-col-span-2">
                  <SelectInput
                    name="feeName"
                    labelText="Fee Name"
                    value={FeeDueSummaryForm.values.feeName}
                    onChange={FeeDueSummaryForm.handleChange}
                    menuItems={selectData3}
                    valueKey="feeNameType"
                    textKey="feeNameType"
                    formgroupClassName="tw-mb-0"
                  />
                </div>

                <div className="tw-col-span-12 xl:tw-col-span-2">
                  <SelectInput
                    name="class"
                    labelText="Class"
                    value={FeeDueSummaryForm.values.class}
                    onChange={FeeDueSummaryForm.handleChange}
                    menuItems={selectData4}
                    valueKey="classType"
                    textKey="classType"
                    formgroupClassName="tw-mb-0"
                  />
                </div>

                <div className="tw-col-span-12 xl:tw-col-span-2">
                  <SelectInput
                    name="section"
                    labelText="Section"
                    value={FeeDueSummaryForm.values.section}
                    onChange={FeeDueSummaryForm.handleChange}
                    menuItems={selectData5}
                    valueKey="sectionType"
                    textKey="sectionType"
                    formgroupClassName="tw-mb-0"
                  />
                </div>

                <div className="tw-col-span-12 xl:tw-col-span-2">
                  <div className="tw-flex tw-items-end tw-justify-end tw-h-full tw-w-full">
                    <Button variant="primary" className="get_report_button tw-w-full">
                      Get Report
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="tw-flex tw-flex-wrap tw-gap-3">
            <div className="tw-w-full xl:tw-flex-1">
              <TotalFeedueOfClass />
            </div>

            <div className="tw-w-full xl:tw-w-[65%]">
              <DueFeesDetailsOfStu />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FeeDueSummary;
