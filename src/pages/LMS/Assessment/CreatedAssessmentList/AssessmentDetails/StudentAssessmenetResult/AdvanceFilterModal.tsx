import { SelectInput } from "../../../../../../Components/Common";

const AdvanceFilterModal = () => {
  return (
    <>
      <div className="offcanvas-body">
        <div className="">
          <SelectInput
            name="subjectId"
            value={""}
            onChange={() => {}}
            menuItems={[]}
            valueKey=""
            textKey=""
            formgroupClassName="mb-3"
            labelText="Subject"
          ></SelectInput>
        </div>
        <div className="">
          <SelectInput
            name="testTypeId"
            value={""}
            onChange={() => {}}
            menuItems={[]}
            valueKey=""
            textKey=""
            formgroupClassName="mb-3"
            labelText="Test Type"
          ></SelectInput>
        </div>
        <div className="">
          <SelectInput
            name="teacherId"
            value={""}
            onChange={() => {}}
            menuItems={[]}
            valueKey=""
            textKey=""
            formgroupClassName="mb-3"
            labelText="Teacher"
          ></SelectInput>
        </div>
        <div className="">
          <SelectInput
            name="statusId"
            value={""}
            onChange={() => {}}
            menuItems={[]}
            valueKey=""
            textKey=""
            formgroupClassName="mb-3"
            labelText="Status"
          ></SelectInput>
        </div>
      </div>
      <div className="hstack gap-2 justify-content-end p-2 border-top">
        <button type="submit" onClick={() => {}} className="btn btn-success">
          Submit
        </button>
      </div>
    </>
  );
};

export default AdvanceFilterModal;
