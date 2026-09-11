import { useEffect, useRef } from "react";
import { useFormik } from "formik";
import { SelectInput, TextInputWithRegex } from "../../../../Components/Common";
import { CustomDatePicker } from "../../../DashBoardBranchSummary/CustomDatePicker";

const initialValues = {
  plannedSessions: "",
  lectures: "",
  labs: "",
  academicPacing: "35",
  sessionDistribution: "",
  startDate: "",
  endDate: "",
};

const AcademicStructure = () => {

  const signatureForm = useFormik({
    enableReinitialize: true,
    initialValues,
    onSubmit: (values) => { },
  });

  const sessionDistributionList = [
    { id: '3week', name: '2 / Week' },
    { id: '4week', name: '3 / Week' },
    { id: '5week', name: '4 / Week' },
  ]
  const handleDateChange = ({ startDate, endDate }: any) => {
    if (startDate && endDate) {
      signatureForm.setValues((prev) => ({ ...prev, startDate, endDate }));
    }
  }
  return (
    <>
      <div className="tw-rounded tw-overflow-hidden course">
        <div className="pt-2">
          <h4 className="tw-mb-0 fs-16">
            Sessions Plan
          </h4>
        </div>
        <div className="pt-2 pb-3 mb-2" >
          <h4 className="tw-mb-0 fs-14 text-muted fw-medium">
            Define the class structure, curriculum flow, and learning hierarchy.
          </h4>
        </div>
        <div className="row align-items-center">
          <div className="col-12 col-md-4 mb-3">
            <CustomDatePicker
              name="dateRange"
              startDate={signatureForm.values.startDate}
              endDate={signatureForm.values.endDate}
              onChange={handleDateChange}
              placeholder="Select a Date"
              monthsShown={2}
              formgroupClassName="mb-0"
              labelText='Course Start & End Date'
              floatingLabel
            />
          </div>
          <div className="col-12 col-md-4 mb-3">
            <TextInputWithRegex
              name="plannedSessions"
              labelClass="required"
              formgroupClassName="mb-0 me-2"
              value={signatureForm.values.plannedSessions}
              onChange={signatureForm.handleChange}
              allowedInputRegex="^[0-9]+$"
              labelText="Total Planned Sessions"
              placeHolder="Total Planned Sessions"
              floatingLabel
            />
          </div>
          <div className="col-12 col-md-4 mb-3">
            <TextInputWithRegex
              name="lectures"
              labelClass="required"
              formgroupClassName="mb-0 me-2"
              value={signatureForm.values.lectures}
              onChange={signatureForm.handleChange}
              allowedInputRegex="^[0-9]+$"
              labelText="Lecture Sessions"
              placeHolder="Lecture Sessions"
              floatingLabel
            />
          </div>
          <div className="col-12 col-md-4 mb-3">
            <TextInputWithRegex
              name="labs"
              labelClass="required"
              formgroupClassName="mb-0 me-2"
              value={signatureForm.values.labs}
              onChange={signatureForm.handleChange}
              allowedInputRegex="^[0-9]+$"
              labelText="Lab Sessions"
              placeHolder="Lab Sessions"
              floatingLabel
            />
          </div>
          <div className="col-12 col-md-4 mb-3">
            <TextInputWithRegex
              name="academicPacing"
              labelClass="required"
              formgroupClassName="mb-0 me-2"
              value={signatureForm.values.academicPacing}
              onChange={signatureForm.handleChange}
              allowedInputRegex="^[0-9]+$"
              labelText="Academic Pacing (Weeks)"
              placeHolder="Academic Pacing (Weeks)"
              floatingLabel
              isDisabled={true}
            />
          </div>
          <div className="col-12 col-md-4 mb-3 mt-3">
            <SelectInput
              name="sessionDistribution"
              labelClass="required"
              value={signatureForm.values.sessionDistribution}
              onChange={signatureForm.handleChange}
              menuItems={sessionDistributionList}
              valueKey="id"
              textKey="name"
              labelText="Session Pacing" floatingLabel
            />
          </div>
        </div>
        <div className="row mb-3">
          <div className="col-12 text-center">
            <button className='btn btn-light fs-12 px-5' >Previous</button>
            <button
              type="button"
              className="btn btn-outline-primary mx-2 fs-12 px-5"
            // onClick={previousBtnHndlr}

            >
              Save as Draft
            </button>

            <button type="button" className="btn btn-success fs-12 px-5" >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AcademicStructure;
