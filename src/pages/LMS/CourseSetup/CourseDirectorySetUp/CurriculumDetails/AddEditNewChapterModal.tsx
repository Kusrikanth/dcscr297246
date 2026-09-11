import { TextInput } from "../../../../../Components/Common";

const AddEditNewChapterModal = ({toggle}) => {
  return (
    <div className="p-4">
      <div className="row mb-4">
        <div className="col-12">
          <TextInput
            name={`chapterName`}
            value={""}
            formgroupClassName="mb-0"
            onChange={() => {}}
            labelText="Chapter Name"
          ></TextInput>
        </div>
      </div>

      <div className="row">
        <div className="d-flex ms-auto w-auto">
          <button className="btn btn-light me-3" onClick={toggle}>
            Cancel
          </button>
          <button type="submit" className="btn btn-success" onClick={() => {}}>
            {"Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEditNewChapterModal;
