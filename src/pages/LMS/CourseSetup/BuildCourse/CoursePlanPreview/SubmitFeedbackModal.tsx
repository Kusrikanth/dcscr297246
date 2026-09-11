import { TextArea } from "../../../../../Components/Common";
import UploadFileProgress from "../../../../../Components/Common/UploadFileProgress";



const SubmitFeedbackModal = () => {
  return (
    <div style={{ padding: "1.25rem" }}>
      <div className="row mb-4">
        <div className="col-12">
          <TextArea
            name="feedback"
            value={""}
            onChange={() => {}}
            labelText="Feedback"
            labelClass="required"
          ></TextArea>
        </div>
        <div className="col-12">
          <UploadFileProgress></UploadFileProgress>
        </div>
      </div>

      <div className="col-12">
        <div className="d-flex justify-content-end">
          <button className="btn btn-light me-2">Cancel</button>
          <button className="btn btn-success me-2">Submit</button>
        </div>
      </div>
    </div>
  );
};

export default SubmitFeedbackModal;
