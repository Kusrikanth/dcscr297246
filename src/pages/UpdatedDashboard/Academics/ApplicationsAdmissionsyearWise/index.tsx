import { useMemo, useState } from "react";
import UpdatedHorizontalTab from "../../../../Components/Common/UpdatedHorizontalTab";
import ApplicationsYearWise from "../ApplicationsYearWise";
import AdmissionsYearWise from "../AdmissionsYearWise";

interface IMenuOptions {
  id: string;
  labelName: string;
  customPadding: string;
  Icon: any;
}

const ApplicationsAdmissionsyearWise = () => {
  const [activeId, setActiveId] = useState<any>("admissions-year-wise");

  const MenuOptions: Array<IMenuOptions> = [
    {
      id: "admissions-year-wise",
      labelName: "Admissions",
      customPadding: "0px 5px 5px 5px",
      Icon: "",
    },
    {
      id: "applications-year-wise",
      labelName: "Applications",
      customPadding: "0px 5px 5px 5px",
      Icon: "",
    },
  ];

  function clickMenuHandler(event: React.MouseEvent<HTMLElement>) {
    const { currentTarget } = event;
    const menuId = currentTarget.getAttribute("data-id");
    setActiveId(menuId);
  }

  function getActiveMenuComponent(menuId: string) {
    switch (menuId) {
      case "admissions-year-wise":
        return AdmissionsYearWise;
      case "applications-year-wise":
        return ApplicationsYearWise;
      default:
        return null;
    }
  }

  const activeComponent = useMemo(() => {
    const TabComponent: any = getActiveMenuComponent(activeId);

    return <TabComponent></TabComponent>;
  }, [activeId]);

  return (
    <>
      <div className="admissions-year-wise-container">
        <div className="card !tw-pb-0 !tw-rounded-2xl">
          <div className="card-header tw-py-2 !tw-rounded-t-2xl">
            <div className="tw-flex tw-flex-wrap tw-items-center tw-justify-between tw-gap-3">
              <div className="tw-col-span-12 lg:tw-col-span-4">
                <h4 className="card-title !tw-mb-0">
                  Admissions Year wise
                </h4>
              </div>
              <div className="tw-col-span-12 lg:tw-col-span-8">
                <UpdatedHorizontalTab
                  MenuOptions={MenuOptions}
                  clickMenuHandler={clickMenuHandler}
                  activeTabId={activeId}
                  horizontalClass="tw-overflow-auto tw-whitespace-nowrap tw-justify-end horizontal-menu-updated-style"
                ></UpdatedHorizontalTab>
              </div>
            </div>
          </div>

          <div className="card-body !tw-pb-0 !tw-px-0 !tw-pt-2">
            <div>{activeComponent}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ApplicationsAdmissionsyearWise;