import { useEffect, useMemo, useState } from "react";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import UpdatedHorizontalTab from "../../../Components/Common/UpdatedHorizontalTab";
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { getInstBranchesAct } from "../../../store/mastersettings/branch/branchactions";
import { generateActionPayload } from "../../../utility/reduxutility";
import AcademicStudentHealthIssues from "./AcademicStudentHealthIssues";
import RegistrationStudentHealthIssues from "./RegistrationStudentHealthIssues";

interface IMenuOptions {
  id: string;
  labelName: string;
  customPadding: string;
}

const StudentHealthIssues = () => {
  const [activeId, setActiveId] = useState<any>("academic-health-issues");

  const MenuOptions: Array<IMenuOptions> = [
    {
      id: "academic-health-issues",
      labelName: `Academics`,
      customPadding: "0px 10px 4px 10px",
    },
    {
      id: "registration-health-issues",
      labelName: `Registration`,
      customPadding: "0px 10px 4px 10px",
    },
  ];

  function getActiveMenuComponent(menuId: string) {
    switch (menuId) {
      case "academic-health-issues":
        return AcademicStudentHealthIssues;
      case "registration-health-issues":
        return RegistrationStudentHealthIssues;
    }
  }

  function clickMenuHandler(event: React.MouseEvent<HTMLElement>) {
    const menuId = event.currentTarget.getAttribute("data-id");
    setActiveId(menuId);
  }

  const activeComponent = useMemo(() => {
    const TabComponent: any = getActiveMenuComponent(activeId);
    return <TabComponent activeId={activeId} />;
  }, [activeId]);

  return (
    <div className="page-content">
      <div className="container-fluid">
        <BreadCrumb
          title="Health Records"
          pageTitle="Health Records"
        />

        <div className="tw-bg-white tw-rounded-xl tw-shadow-sm tw-border tw-border-gray-200 tw-mb-5">

          {/* Header */}
          <div className="tw-px-6 tw-py-4 tw-border-b tw-border-gray-200">
            <h4 className="tw-text-[16px] tw-font-[600] tw-text-gray-800 text-align-center tw-mb-0">
              Student Health Issues
            </h4>
          </div>

          {/* Body */}
          <div className="tw-p-0">

            {/* Tabs */}
            <div className="tw-w-full">
              <UpdatedHorizontalTab
                MenuOptions={MenuOptions}
                clickMenuHandler={clickMenuHandler}
                activeTabId={activeId}
                horizontalClass="tw-w-full tw-border-b"
                tabWrapperClass="!tw-border-0"
              />
            </div>

            {/* Active Component */}
            <div className="tw-p-0">
              {activeComponent}
            </div>

          </div>
        </div>
      </div>
    </div>

  );
};

export default StudentHealthIssues;
