import { TextArea, TextInput } from "../../../../../../Components/Common";
import { FormGroup, Label, Input } from "reactstrap";

const AddEditStudentSubmissionModal = (props: any) => {
  return (
    <>
      <div className="modal-body p-3">
        <form>
          <div className="row">
            <div className="col-12">
              <TextInput
                name="statusName"
                value={""}
                onChange={() => {}}
                labelText="Status"
              ></TextInput>
            </div>
            <div className="col-12">
              <FormGroup>
                <Label htmlFor="statusColor" className="form-label">
                  Status Color
                </Label>
                <Input
                  name={`statusColor`}
                  type="color"
                  className="form-control form-control-color w-100"
                  id={`statusColor`}
                  defaultValue="#364574"
                ></Input>
              </FormGroup>
            </div>
            <div className="col-12">
              <TextArea
                name="description"
                value={""}
                onChange={() => {}}
                labelText="Description"
              ></TextArea>
            </div>
          </div>

          <div className="hstack gap-2 justify-content-end mt-4 mb-1 pt-3 pb-0">
            <button
              type="button"
              className="btn btn-light"
              onClick={props.toggle}
            >
              Cancel
            </button>
            <button
              className="btn btn-success"
              type="submit"
              onClick={() => {}}
            >
              {props.id ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddEditStudentSubmissionModal;
