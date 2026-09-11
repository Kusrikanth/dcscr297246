import React, { useMemo, useState } from "react";
import UpdatedHorizontalTab from "../../../../Components/Common/UpdatedHorizontalTab";
import GradeWiseStudents from "../../../UpdatedDashboard/Examination/GradeWiseStudents/RangeWiseStudents";
import RangeWiseStudents from "../../../UpdatedDashboard/Examination/GradeWiseStudents/HighestAverageScore";
import HighestAverageScore from "../../../UpdatedDashboard/Examination/GradeWiseStudents/SchoolGradeWise";
import SchoolGradeWise from "../../../UpdatedDashboard/Examination/GradeWiseStudents/GradeWiseStudents";

interface IMenuOptions {
  id: string;
  labelName: string;
  customPadding: string;
}


const LibrarySummary = (props: any) => {
  const [activeId, setActiveId] = useState<any>("schoolGradeWise");
  const [currentPageSizeState, setCurrentPageSizeState] = useState<any>(10);

  const MenuOptions: Array<IMenuOptions> = [
    {
      id: "schoolGradeWise",
      labelName: "School Grade Wise Performance",
      customPadding: "0px 5px 5px 5px",
    },
    {
      id: "rangeWiseStudents",
      labelName: "Range Wise Students",
      customPadding: "0px 5px 5px 5px",
    },
     {
      id: "highestAverageScore",
      labelName: "Highest & Average Score",
      customPadding: "0px 5px 5px 5px",
      
    }, 
    {
      id: "studentGradeWise",
      labelName: "Subject Wise Students Grade",
      customPadding: "0px 5px 5px 5px",
    },
  ];

  function getActiveMenuComponent(menuId: string) {
    switch (menuId) {
      case "schoolGradeWise":
        return SchoolGradeWise;
      case "rangeWiseStudents":
        return RangeWiseStudents;
      case "highestAverageScore":
          return HighestAverageScore;
      case "studentGradeWise":
          return GradeWiseStudents;

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
      <TabComponent data={props?.data} />
    );
  }, [activeId, props.data]);

  return (
    <>
      <div className="upcoming_events examination-dashboard d-grid">
        <div className="card">
          <div className="card-header pb-0">
            <div className="row align-items-center">
              <UpdatedHorizontalTab
                MenuOptions={MenuOptions}
                clickMenuHandler={clickMenuHandler}
                activeTabId={activeId}
                horizontalClass="ps-0 overflow-auto text-nowrap"
              />
            </div>
          </div>
          <div
            className="card-body px-3 pb-2"
          >
            <div className="row">{activeComponent}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LibrarySummary;
