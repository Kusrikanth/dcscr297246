import React, { useMemo, useState } from "react";
import UpdatedHorizontalTab from "../../../../Components/Common/UpdatedHorizontalTab";
import TopPositions from "./TopPositions";
import HighestScoreSubjects from "./HighestScoreSubjects";
import Centums from "./Centums";
import SubjectAverageAnalysis from "./SubjectAverageAnalysis";
import FailedStudentsTable from "./FailedStudentsTable";

interface IMenuOptions {
  id: string;
  labelName: string;
  customPadding: string;
}

const initialValues = {
  user: "Student"
};

const ExaminationSummary = (props: any) => {
  const [activeId, setActiveId] = useState<any>("topPositions");
  const [currentPageSizeState, setCurrentPageSizeState] = useState<any>(10);

  const MenuOptions: Array<IMenuOptions> = [
    {
      id: "topPositions",
      labelName: "Top 10 Positions",
      customPadding: "0px 5px 5px 5px"
    },
    {
      id: "highestScoreSubjects",
      labelName: "Highest Score Subject Wise",
      customPadding: "0px 5px 5px 5px"
    },
    {
      id: "centums",
      labelName: "Centums",
      customPadding: "0px 5px 5px 5px"
    },
    {
      id: "subjectAverageAnalysis",
      labelName: "Subject Average",
      customPadding: "0px 5px 5px 5px"
    },
    {
      id: "failedStudentsTable",
      labelName: "Failed Students",
      customPadding: "0px 5px 5px 5px"
    }
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
      case "failedStudentsTable":
        return FailedStudentsTable;

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
    return <TabComponent data={props.data} subjectList={props.subjectList} />;
  }, [activeId, props.data, props.subjectList]);

  return (
    <>
      <div className="upcoming_events library-dashboard tw-grid">
        <div className="card !tw-rounded-2xl !tw-shadow-sm">
          {/* Card Header */}
          <div className="card-header tw-px-4 tw-py-2 !tw-rounded-t-2xl">
            <h4 className="card-title">Summary</h4>
            <UpdatedHorizontalTab
              MenuOptions={MenuOptions}
              clickMenuHandler={clickMenuHandler}
              activeTabId={activeId}
              horizontalClass="horizontal-menu-updated-style"
            />
          </div>

          {/* Card Body */}
          <div className="card-body !tw-p-0">
            <div
              className="tw-h-[383px] tw-overflow-y-auto tw-overflow-x-hidden"
              style={{ scrollbarWidth: "thin" }}
            >
              {activeComponent}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ExaminationSummary;
