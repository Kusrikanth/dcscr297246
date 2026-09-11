import { DateInput, TimeInput } from "../../../../../../Components/Common";

const EditAssessmentDetailsModal = ({ toggle }) => {
  return (
    <div style={{ padding: "1.25rem" }}>
      <div className="row mb-4">
        <div className="col-8">
          <DateInput
            name="examStartDate"
            labelText="Exam Start Date"
            value={""}
            onChange={() => {}}
          ></DateInput>
        </div>
        <div className="col-4">
          <TimeInput
            name="examStartTime"
            labelText="Exam Start Time"
            value={""}
            onChange={() => {}}
          ></TimeInput>
        </div>
      </div>
      <div className="row mb-4">
        <div className="col-8">
          <DateInput
            name="examEndDate"
            labelText="Exam End Date"
            value={""}
            onChange={() => {}}
          ></DateInput>
        </div>
        <div className="col-4">
          <TimeInput
            name="examEndTime"
            labelText="Exam End Time"
            value={""}
            onChange={() => {}}
          ></TimeInput>
        </div>
      </div>
      <div className="row">
        <div className="d-flex ms-auto w-auto">
          <button className="btn btn-light me-3" onClick={toggle}>
            Cancel
          </button>
          <button type="submit" className="btn btn-success" onClick={() => {}}>
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditAssessmentDetailsModal;
