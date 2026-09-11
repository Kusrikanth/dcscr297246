import { SelectInput } from "../../../../../../../../Components/Common";

const FiltersModal = ({ toggle }) => {
  return (
    <>
      <div style={{ padding: "1.25rem" }}>
        <div className="row mb-4">
          <div className="col-12">
            <SelectInput
              name="classId"
              value={""}
              onChange={() => {}}
              menuItems={[]}
              valueKey=""
              textKey=""
              labelText="Class"
            ></SelectInput>
          </div>
          <div className="col-12">
            <SelectInput
              name="sectionId"
              value={""}
              onChange={() => {}}
              menuItems={[]}
              valueKey=""
              textKey=""
              labelText="Section"
            ></SelectInput>
          </div>
          <div className="col-12">
            <SelectInput
              name="assessementId"
              value={""}
              onChange={() => {}}
              menuItems={[]}
              valueKey=""
              textKey=""
              labelText="Assessment"
            ></SelectInput>
          </div>
        </div>
        <div className="row">
          <div className="d-flex ms-auto w-auto">
            <button className="btn btn-light me-3" onClick={toggle}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-success"
              onClick={() => {}}
            >
              {"Submit"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FiltersModal;
