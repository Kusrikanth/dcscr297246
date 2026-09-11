import { useMemo, useState } from "react";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import UpdatedHorizontalTab from "../../../Components/Common/UpdatedHorizontalTab";
import PvaGradeEntry from "./PvaGradeEntry";
import ProgressCard from "./ProgressCard";

const CbsePvaManagement = () => {

  const [activeId, setActiveId] = useState<any>("pvaGradeEntry");

  const MenuOptions = [
    {
      id: "pvaGradeEntry",
      labelName: "PVA Grade Entry",
      customPadding: "0px 15px",
    },
    {
      id: "progressCard",
      labelName: "Progress Card",
      customPadding: "0px 10px 4px 10px",
    },
  ];
  function getActiveMenuComponent(menuId: string) {
    switch (menuId) {
      case "pvaGradeEntry":
        return PvaGradeEntry;
      case "progressCard":
        return ProgressCard;
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
    return (
      <TabComponent />
    );
  }, [activeId]);

  return (
    <>
      <div className="page-content free_payment_record_wrapper">
        <div className="container-fluid">
          <BreadCrumb title="Early Years Managment" pageTitle="Examination" />

          <div className="card mb-0">
            <div className="card-header pb-0">
              <div className="row align-items-center">
                <div className="col-6">
                  <h4 className="card-title mb-0 flex-grow-1">
                    PVA Report Management
                  </h4>
                </div>
              </div>
              <UpdatedHorizontalTab
                MenuOptions={MenuOptions}
                clickMenuHandler={clickMenuHandler}
                activeTabId={activeId}
                showBadge={true}
                horizontalClass="pt-2 mb-0 overflow-auto text-nowrap"
              />
            </div>
          </div>
          <div className="card-body p-0">
            {activeComponent}
          </div>
        </div>
      </div>
    </>
  );
};

export default CbsePvaManagement;
