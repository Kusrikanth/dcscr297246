import { useState } from "react";
import { shallowEqual } from "react-redux";
import { SelectInput } from "../../../../../../Components/Common";
import { entryProcessStatusFilterList, entryStatusMenuItems } from "./helper";
import { useAppSelector } from "../../../../../../hooks/storehook";

const initialValues = {
  sectionId: "",
  entryProcessStatus: "",
  entryStatus: "",
};

const AdvanceFilterModal = (props: any) => {
  const [advanceFilterState, setAdvanceFilterState] = useState<any>(
    props.appliedFilter || initialValues
  );

  const { sectionListResp } = useAppSelector(
    ({ classroomManagmentInfo }) => ({
      sectionListResp: classroomManagmentInfo.sectionListResp,
    }),
    shallowEqual
  );

  const applyFilterHndlr = () => {
    props.applyFilterCallback({ ...advanceFilterState });
    props.toggleAdvanceFilter();
  };

  function filterHandler(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setAdvanceFilterState((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  }

  return (
    <>
      <div className="offcanvas-body">
        <div className="mb-3">
          <SelectInput
            name="sectionId"
            value={advanceFilterState.sectionId}
            onChange={filterHandler}
            menuItems={
              Array.isArray(sectionListResp?.data) ? sectionListResp.data : []
            }
            valueKey="sectionId"
            textKey="sectionName"
            labelText="Section"
            formgroupClassName="mb-3"
          />
        </div>
        <div className="mb-3">
          <SelectInput
            name="entryProcessStatus"
            value={advanceFilterState.entryProcessStatus}
            onChange={filterHandler}
            menuItems={entryProcessStatusFilterList}
            valueKey="id"
            textKey="value"
            labelText="Process"
            formgroupClassName="mb-3"
          />
        </div>
        <div className="mb-3">
          <SelectInput
            name="entryStatus"
            value={advanceFilterState.entryStatus}
            onChange={filterHandler}
            menuItems={entryStatusMenuItems}
            valueKey="id"
            textKey="name"
            labelText="Status"
            formgroupClassName="mb-3"
          />
        </div>
      </div>
      <div className="border-top p-2 text-center">
        <div className="hstack gap-2 justify-content-end">
          <button
            type="submit"
            onClick={applyFilterHndlr}
            className="btn btn-success"
          >
            Submit
          </button>
        </div>
      </div>
    </>
  );
};

export default AdvanceFilterModal;
