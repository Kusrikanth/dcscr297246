import { Comment01Icon, DashboardSquareEditIcon, Task01Icon } from "@hugeicons-pro/core-stroke-standard";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMemo, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import BreadCrumb from "../../../../../Components/Common/BreadCrumb";
import UpdatedHorizontalTab from "../../../../../Components/Common/UpdatedHorizontalTab";
import StudentAssessmentHistory from "./StudentAssessmentHistory";
import StatsCards from "./StatsCards";

const StudentAssessmentList = (props: any) => {
  const location = useLocation<any>();
  const { id, activeId: initialActiveId } = location.state || {};
  const history = useHistory<any>();
  const [activeId, setActiveId] = useState<any>(initialActiveId || "assessmentHistory");

  const MenuOptions = [
    {
      id: "assessmentHistory",
      labelName: "Assessment History",
      customPadding: "0px 10px 6px 10px",
      count: 10,
      Icon: (
        <HugeiconsIcon
          icon={DashboardSquareEditIcon}
          size={18}
          className="me-2"
        />
      ),
    },
    {
      id: "dummy",
      labelName: "Subject Insights",
      customPadding: "0px 10px 6px 10px",
      count: 10,
      Icon: (
        <HugeiconsIcon
          icon={Comment01Icon}
          size={18}
          className="me-2"
        />
      ),
    },
    {
      id: "dummy1",
      labelName: "Attendance Log",
      customPadding: "0px 10px 6px 10px",
      count: 10,
      Icon: (
        <HugeiconsIcon
          icon={Task01Icon}
          size={18}
          className="me-2"
        />
      ),
    },
    {
      id: "dummy2",
      labelName: "Performance Summary",
      customPadding: "0px 10px 6px 10px",
      count: 10,
      Icon: (
        <HugeiconsIcon
          icon={DashboardSquareEditIcon}
          size={18}
          className="me-2"
        />
      ),
    },
  ];

  function clickMenuHandler(event: React.MouseEvent<HTMLElement>) {
    const { currentTarget } = event;
    const menuId = currentTarget.getAttribute("data-id");
    setActiveId(menuId);
  }

  function getActiveMenuComponent(menuId: string) {
    switch (menuId) {
      case "assessmentHistory":
        return StudentAssessmentHistory;
      default:
        return null;
    }
  }

  const activeComponent = useMemo(() => {
    const TabComponent: any = getActiveMenuComponent(activeId);
    return TabComponent ? (
      <TabComponent id={history.location.state?.id} />
    ) : null;
  }, [activeId, history.location.state]);

  return (
    <>
      <div className="page-content free_payment_record_wrapper">
        <div className="container-fluid">
          <BreadCrumb pageTitle="LMS" title="LMS" />
          <div className="card">
            <div className="card-header">
              <div className="row">
                <h4 className="card-title mb-0 flex-grow-1">Dashboard</h4>
              </div>
            </div>
          </div>
          <div className="row pb-3">
            <StatsCards />
          </div><div className="row">
            <div className="col-12">
              <UpdatedHorizontalTab
                MenuOptions={MenuOptions}
                clickMenuHandler={clickMenuHandler}
                activeTabId={activeId}
                horizontalClass="overflow-auto text-nowrap"
              />
            </div>
            <div className="col-12">{activeComponent}</div>
          </div>
        </div>
      </div>
    </>
  );
};
export default StudentAssessmentList;