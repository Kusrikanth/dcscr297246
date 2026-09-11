import React, { useMemo, useState } from "react";
import UpdatedHorizontalTab from "../../../../Components/Common/UpdatedHorizontalTab";
import GradeWiseStudents from "./GradeWiseStudents";
import HighestAverageScore from "./HighestAverageScore";
import SchoolGradeWise from "./SchoolGradeWise";
import RangeWiseStudents from "./RangeWiseStudents";

interface IMenuOptions {
  id: string;
  labelName: string;
  customPadding: string;
}

const GradeWisePerformance = (props: any) => {
  const [activeId, setActiveId] = useState<any>("studentGradeWise");
  const [currentPageSizeState, setCurrentPageSizeState] = useState<any>(10);

  const MenuOptions: Array<IMenuOptions> = [
    {
      id: "studentGradeWise",
      labelName: "Grade Wise Number of Students",
      customPadding: "0px 8px 2px 8px",
    },
    {
      id: "schoolGradeWise",
      labelName: "Subject wise",
      customPadding: "0px 8px 2px 8px",
    },
    {
      id: "rangeWiseStudents",
      labelName: "Garde Wise",
      customPadding: "0px 8px 2px 8px",
    },
    {
      id: "highestAverageScore",
      labelName: "Marks Range",
      customPadding: "0px 8px 2px 8px",
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
      <TabComponent data={props?.data}/>
    );
  }, [activeId, props?.data]);

  return (
    <>
      <div className="upcoming_events examination-dashboard tw-grid">
        <div className="card !tw-shadow-sm !tw-rounded-2xl">
          <div className="card-header !tw-pb-0 !tw-rounded-t-2xl !tw-px-2 !tw-pt-2">
            <div className="tw-flex tw-items-center">
              <UpdatedHorizontalTab
                MenuOptions={MenuOptions}
                clickMenuHandler={clickMenuHandler}
                activeTabId={activeId}
                horizontalClass="tw-pl-0 tw-overflow-auto tw-whitespace-nowrap"
              />
            </div>
          </div>
          <div className="card-body !tw-px-3 !tw-pb-2">
            <div className="row">{activeComponent}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GradeWisePerformance;
