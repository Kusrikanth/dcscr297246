import { SelectInput, TextInput } from "../../../Components/Common";

const AddEditPeriodModal = (props: any) => {
  return (
    <>
      <form>
        <div className="card-body">
          <div className="row">
            <div className="col-12">
              <SelectInput
                name="subjectName"
                labelText="Subject"
                value={""}
                onChange={() => {}}
                menuItems={[]}
                valueKey="id"
                textKey="name"
                formgroupClassName="mb-3"
              ></SelectInput>
            </div>
            <div className="col-12">
              <SelectInput
                name="teacherName"
                labelText="Teacher"
                value={""}
                onChange={() => {}}
                menuItems={[]}
                valueKey="id"
                textKey="name"
                formgroupClassName="mb-3"
              ></SelectInput>
            </div>
            <div className="col-12">
              <SelectInput
                name="substituteTeacherName"
                labelText="Substitute Teacher"
                value={""}
                onChange={() => {}}
                menuItems={[]}
                valueKey="id"
                textKey="name"
                formgroupClassName="mb-3"
              ></SelectInput>
            </div>
          </div>

          <div className="hstack gap-2 justify-content-end">
            <button
              type="button"
              className="btn btn-light"
              onClick={props.toggle}
            >
              Cancel
            </button>

            <button type="submit" className="btn btn-success">
              {props.modalData ? "Update" : "Submit"}
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default AddEditPeriodModal;
