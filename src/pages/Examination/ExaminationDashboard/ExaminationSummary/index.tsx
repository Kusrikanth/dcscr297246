import React, { useMemo, useState } from "react";
import UpdatedHorizontalTab from "../../../../Components/Common/UpdatedHorizontalTab";
import TopPositions from "../../../UpdatedDashboard/Examination/ExaminationSummary/TopPositions";
import HighestScoreSubjects from "../../../UpdatedDashboard/Examination/ExaminationSummary/HighestScoreSubjects";
import Centums from "../../../UpdatedDashboard/Examination/ExaminationSummary/Centums";
import SubjectAverageAnalysis from "../../../UpdatedDashboard/Examination/ExaminationSummary/SubjectAverageAnalysis";
// import TopPositions from "./TopPositions";
// import HighestScoreSubjects from "./HighestScoreSubjects";
// import Centums from "./Centums";
// import SubjectAverageAnalysis from "./SubjectAverageAnalysis";

interface IMenuOptions {
  id: string;
  labelName: string;
  customPadding: string;
}

const initialValues = {
  user: "Student",
};

const ExaminationSummary = (props: any) => {
  const [activeId, setActiveId] = useState<any>("topPositions");
  const [currentPageSizeState, setCurrentPageSizeState] = useState<any>(10);

  const MenuOptions: Array<IMenuOptions> = [
    {
      id: "topPositions",
      labelName: "Top 10 Positions",
      customPadding: "0px 5px 5px 5px",
    },
    {
      id: "highestScoreSubjects",
      labelName: "Highest Score Subject Wise",
      customPadding: "0px 5px 5px 5px",
    },
    {
      id: "centums",
      labelName: "Centums",
      customPadding: "0px 5px 5px 5px",
    },
    {
      id: "subjectAverageAnalysis",
      labelName: "Subject Average",
      customPadding: "0px 5px 5px 5px",
    },
  ];

  function getActiveMenuComponent(menuId: string) {
    switch (menuId) {
      case "topPositions":
        return TopPositions;
      case "highestScoreSubjects":
        return HighestScoreSubjects;
      case "centums":
        return Centums;
      case "subjectAverageAnalysis":
        return SubjectAverageAnalysis;

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
      <TabComponent  data={props.data} subjectList={props.subjectList}/>
    );
  }, [activeId, props.data, props.subjectList]);

  return (
    <>
      <div className="upcoming_events library-dashboard d-grid h-100">
        <div className="card">
          <div className="card-header py-3">
            <div className="row align-items-center">
              <div className="col">
                <h4 className="card-title flex-grow-1">
                  Summary
                </h4>
              </div>
              <div className="col-auto">
                <UpdatedHorizontalTab
                  MenuOptions={MenuOptions}
                  clickMenuHandler={clickMenuHandler}
                  activeTabId={activeId}
                  horizontalClass="horizontal-menu-updated-style"
                />
              </div>
            </div>
          </div>
          <div
            className="card-body p-0">
            <div className="row w-100 mx-auto" style={{
              zIndex: "1",
              height: "383px",
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

export default ExaminationSummary;
