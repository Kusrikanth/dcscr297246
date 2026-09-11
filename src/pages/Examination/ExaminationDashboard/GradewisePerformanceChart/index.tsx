import React, { useMemo, useState } from "react";
import UpdatedHorizontalTab from "../../../../Components/Common/UpdatedHorizontalTab";
import SubjectGradeWiseAnalysis from "./SubjectGradeWiseAnalysis";
import { useFormik } from "formik";
import { SelectInput } from "../../../../Components/Common";
import SubjectRangeWiseAnalysis from "./SubjectRangeWiseAnalysis";

interface IMenuOptions {
  id: string;
  labelName: string;
  customPadding: string;
}

const initialValues = {
  subject: "",
  curriculumId: "",
};

const menuData = [
  {
    id: "English",
    name: "English",
  },
  {
    id: "Maths",
    name: "Maths",
  },
  {
    id: "Science",
    name: "Science",
  },
  {
    id: "Physics",
    name: "Physics",
  },
];

const GradewisePerformanceChart = () => {
  const [activeId, setActiveId] = useState<any>("subjectGradeWiseAnalysis");
  const [currentPageSizeState, setCurrentPageSizeState] = useState<any>(10);
  const [filterState, setFilterState] = useState(initialValues);
  const filterStateForm = useFormik({
    enableReinitialize: true,
    initialValues: filterState,
    onSubmit: (values) => { },
  });
  const MenuOptions: Array<IMenuOptions> = [
    {
      id: "subjectGradeWiseAnalysis",
      labelName: "Grade Wise",
      customPadding: "0px 5px 5px 5px",
    },
    {
      id: "subjectRangeWiseAnalysis",
      labelName: "Range Wise",
      customPadding: "0px 5px 5px 5px",
    },
  ];

  function getActiveMenuComponent(menuId: string) {
    switch (menuId) {
      case "subjectGradeWiseAnalysis":
        return SubjectGradeWiseAnalysis;
      case "subjectRangeWiseAnalysis":
        return SubjectRangeWiseAnalysis;

      default:
        return null;
    }
  }

  function clickMenuHandler(event: React.MouseEvent<HTMLElement>) {
    const { currentTarget } = event,
      menuId = currentTarget.getAttribute("data-id");
    setActiveId(menuId);
  }

  const activeComponent = useMemo(() => {
    const TabComponent: any = getActiveMenuComponent(activeId);
    setCurrentPageSizeState(0);
    return (
      <TabComponent setFilterState={setFilterState} filterState={filterState} />
    );
  }, [activeId, filterState]);

  return (
    <>
      <div className="upcoming_events library-dashboard d-grid">
        <div className="card">
          <div className="card-header horizontal_tab_fee py-3">
            <div className="row align-items-center">
              <div className="col">
                <h4 className="card-title mb-0 flex-grow-1">
                  Subject Analysis
                </h4>
              </div>
              <div className="col-auto">
                <SelectInput
                  name="subject"
                  value={filterStateForm.values.subject}
                  onChange={filterStateForm.handleChange}
                  menuItems={menuData}
                  valueKey="id"
                  textKey="name"
                  formgroupClassName="mb-0"
                  labelText="Subject"
                  floatingLabel
                />
              </div>
            </div>
          </div>
          <div
            className="card-body p-0">
            <div className="row m-2 my-3">
              <div className='col-12 ps-2 d-flex justify-content-center horizontal_tab'>
                <UpdatedHorizontalTab
                  MenuOptions={MenuOptions}
                  clickMenuHandler={clickMenuHandler}
                  activeTabId={activeId}
                  horizontalClass="ps-0"
                />
              </div>
            </div>
            <div className="row mx-3" style={{
              zIndex: "1",
              height: "330px",
              overflowY: "auto",
              overflowX: "hidden",
              scrollbarWidth: "thin",
            }}>{activeComponent}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GradewisePerformanceChart;
