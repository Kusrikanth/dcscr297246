import React, { useMemo, useState } from "react";
import UpdatedHorizontalTab from "../../../../Components/Common/UpdatedHorizontalTab";
import {
  HugeiconsIcon
} from "@hugeicons/react";
import {
  LicenseThirdPartyIcon,
  DocumentValidationIcon,
  GreenHouseIcon,
  Bus01Icon,
} from "@hugeicons-pro/core-stroke-standard";

import VehicleRegistrationRenewal from "./VehicleRegistrationRenewal";
import LicenseRenewal from "./LicenseRenewal";
import InsuranceRenewal from "./InsuranceRenewal";
interface IMenuOptions {
  id: string;
  labelName: string;
  customPadding: string;
  Icon: any;
}
const initialValues = {
  user: "Student",
};
const TransportExpiry = (props: any) => {
  const [activeId, setActiveId] = useState<any>("licenseRenewal");
  const [filterState, setFilterState] = useState(initialValues);
  const MenuOptions: Array<IMenuOptions> = [
    {
      id: "licenseRenewal",
      labelName: "License Renewal",
      customPadding: "0px 5px 5px 5px",
      Icon: (
        <HugeiconsIcon icon={LicenseThirdPartyIcon}
          size={24}
          color={activeId === "licenseRenewal" ? "#0AB39C" : "#9599AD"}
          className="tw-mr-2"
        />
      ),
    },
    {
      id: "vehicleRegistrationRenewal",
      labelName: "Vehicle Registration Renewal",
      customPadding: "0px 5px 5px 5px",
      Icon: (
        <HugeiconsIcon icon={Bus01Icon}
          size={24}
          color={
            activeId === "vehicleRegistrationRenewal" ? "#0AB39C" : "#9599AD"
          }
          className="tw-mr-2"
        />
      ),
    },
    {
      id: "permitRenewal",
      labelName: "Permit Renewal",
      customPadding: "0px 5px 5px 5px",
      Icon: (
        <HugeiconsIcon icon={DocumentValidationIcon}
          size={24}
          color={activeId === "permitRenewal" ? "#0AB39C" : "#9599AD"}
          className="tw-mr-2"
        />
      ),
    },
    {
      id: "pollutionRenewal",
      labelName: "Pollution Renewal",
      customPadding: "0px 5px 5px 5px",
      Icon: (
        <HugeiconsIcon icon={GreenHouseIcon}
          size={24}
          color={activeId === "pollutionRenewal" ? "#0AB39C" : "#9599AD"}
          className="tw-mr-2"
        />
      ),
    },
    {
      id: "fitnessRenewal",
      labelName: "Fitness Renewal",
      customPadding: "0px 5px 5px 5px",
      Icon: (
        <HugeiconsIcon icon={DocumentValidationIcon}
          size={24}
          color={activeId === "fitnessRenewal" ? "#0AB39C" : "#9599AD"}
          className="tw-mr-2"
        />
      ),
    },
    {
      id: "fitnessRenewal",
      labelName: "Fitness Renewal",
      customPadding: "0px 5px 5px 5px",
      Icon: (
        <HugeiconsIcon icon={DocumentValidationIcon}
          size={24}
          color={activeId === "fitnessRenewal" ? "#0AB39C" : "#9599AD"}
          className="tw-mr-2"
        />
      ),
    },
    {
      id: "insuranceRenewal",
      labelName: "Insurance Renewal",
      customPadding: "0px 5px 5px 5px",
      Icon: (
        <HugeiconsIcon icon={DocumentValidationIcon}
          size={24}
          color={activeId === "insuranceRenewal" ? "#0AB39C" : "#9599AD"}
          className="tw-mr-2"
        />
      ),
    },
  ];

  function getActiveMenuComponent(menuId: string) {
    switch (menuId) {
      case "licenseRenewal":
        return LicenseRenewal;
      case "vehicleRegistrationRenewal":
        return VehicleRegistrationRenewal;
      case "permitRenewal":
        return VehicleRegistrationRenewal;
      case "pollutionRenewal":
        return VehicleRegistrationRenewal;
      case "fitnessRenewal":
        return VehicleRegistrationRenewal;
      case "insuranceRenewal":
        return InsuranceRenewal;
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
      <TabComponent {...props} activeId={activeId} setFilterState={setFilterState} filterState={filterState} />
    );
  }, [activeId, filterState, props?.branchIdState]);
  return (
    <>
      <div className="upcoming_events">
        <div className="card card_height !tw-shadow-sm !tw-rounded-2xl tw-h-full">
          <div className="card-header !tw-pb-0 !tw-rounded-t-2xl">
            <div>
              <UpdatedHorizontalTab
                MenuOptions={MenuOptions}
                clickMenuHandler={clickMenuHandler}
                activeTabId={activeId}
                horizontalClass="tw-pl-0 tw-overflow-auto tw-text-nowrap"
              />
            </div>
          </div>
          <div
            className="card-body !tw-p-0"
            style={{
              zIndex: "1",
              height: "378px",
              overflowY: "auto",
              overflowX: "hidden",
            }}
          >
            <div className="row">{activeComponent}</div>
          </div>
        </div>
      </div>
    </>
  );
};
export default TransportExpiry;
