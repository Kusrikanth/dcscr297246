import { useMemo, useState } from "react";
import UpdatedHorizontalTab from "../../../../Components/Common/UpdatedHorizontalTab";
import BranchWiseApplicationsAdmissions from "./BranchWiseApplicationsAdmissions";
import BranchWiseAdmissionTargets from "./BranchWiseAdmissionTargets";

interface IMenuOptions {
  id: string;
  labelName: string;
  customPadding: string;
  Icon: any;
}

const BranchDrillDown = (props:any) => {
  const { isAdmissionTarget } = props || {}
  const [activeId, setActiveId] = useState(isAdmissionTarget ? "branch-wise-admission-targets" : "branch-wise-applications-admissions");

  const MenuOptions: Array<IMenuOptions> = [
    !isAdmissionTarget && ({
      id: "branch-wise-applications-admissions",
      labelName: "Applications to Admissions",
      customPadding: "0px 5px 5px 5px",
      Icon: "",
    }),
    isAdmissionTarget && ({
      id: "branch-wise-admission-targets",
      labelName: "Admission Targets",
      customPadding: "0px 5px 5px 5px",
      Icon: "",
    }),
  ].filter(Boolean);

  function clickMenuHandler(event: React.MouseEvent<HTMLElement>) {
    const { currentTarget } = event;
    const menuId = currentTarget.getAttribute("data-id");
    setActiveId(menuId || "");
  }

  function getActiveMenuComponent(menuId: string) {
    switch (menuId) {
      case "branch-wise-admission-targets":
        return BranchWiseAdmissionTargets;
      case "branch-wise-applications-admissions":
        return BranchWiseApplicationsAdmissions;
      default:
        return null;
    }
  }

  const activeComponent = useMemo(() => {
    const TabComponent: any = getActiveMenuComponent(activeId);

    return <TabComponent {...props}></TabComponent>;
  }, [activeId,props]);

  return (
    <>
      <div className="class-wise-admission-analysis-container">
        <div className="card !tw-rounded-2xl !tw-pb-0 !tw-mb-4">
          <div className="card-header !tw-py-2 !tw-rounded-t-2xl">
            <div className="tw-flex tw-flex-wrap tw-items-center tw-justify-between tw-gap-3">
              <div>
                <h4 className="card-title !tw-mb-0">
                  Branch wise Admissions Analysis
                </h4>
              </div>

              <div>
                <UpdatedHorizontalTab
                  MenuOptions={MenuOptions}
                  clickMenuHandler={clickMenuHandler}
                  activeTabId={activeId}
                  horizontalClass="tw-overflow-auto tw-whitespace-nowrap tw-justify-end horizontal-menu-updated-style"
                ></UpdatedHorizontalTab>
              </div>
            </div>
          </div>

          <div className="tw-p-0">
            <div>{activeComponent}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BranchDrillDown;