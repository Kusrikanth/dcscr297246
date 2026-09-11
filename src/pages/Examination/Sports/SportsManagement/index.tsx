import { useMemo, useState } from "react";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import UpdatedHorizontalTab from "../../../../Components/Common/UpdatedHorizontalTab";

import SportsGradeEntry from "./GradeEntry";
import AssignSportsToStudents from "./AssignSportsToStudents";
import ProgressCard from "./ProgressCard";

interface IMenuOptions {
  id: string;
  labelName: string;
  customPadding: string;
}

const SportsManagement = () => {
  const [activeId, setActiveId] = useState<any>("assignSportsToStudents");

  const MenuOptions: Array<IMenuOptions> = [
    {
      id: "assignSportsToStudents",
      labelName: "Assign Sports To Students",
      customPadding: "0px 10px 4px 10px",
    },
    {
      id: "gradeEntry",
      labelName: "Grade Entry",
      customPadding: "0px 10px 4px 10px",
    },
    {
      id: "progressCard",
      labelName: "Progress Card",
      customPadding: "0px 10px 4px 10px",
    },
  ];

  function getActiveMenuComponent(menuId: string) {
    switch (menuId) {
      case "assignSportsToStudents":
        return AssignSportsToStudents;
      case "gradeEntry":
        return SportsGradeEntry;
      case "progressCard":
        return ProgressCard;
    }
  }

  function clickMenuHandler(event: React.MouseEvent<HTMLElement>) {
    const menuId = event.currentTarget.getAttribute("data-id");
    setActiveId(menuId);
  }

  const activeComponent = useMemo(() => {
    const TabComponent: any = getActiveMenuComponent(activeId);
    return <TabComponent />;
  }, [activeId]);

  return (
    <div className="page-content">
      <div className="container-fluid">
        <BreadCrumb title="Dashboard" pageTitle="Examination" />

        <div className="card">
          <div className="card-header pb-0">
            <div className="row">
              <div className="col-12">
                <h4 className="card-title mb-2">Sports Management</h4>
              </div>
              <div className="col-12">
                <UpdatedHorizontalTab
                  MenuOptions={MenuOptions}
                  clickMenuHandler={clickMenuHandler}
                  activeTabId={activeId}
                  horizontalClass=""
                ></UpdatedHorizontalTab>
              </div>
            </div>
          </div>

          <div className="card-body p-0">
            <div className="">{activeComponent}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SportsManagement;
