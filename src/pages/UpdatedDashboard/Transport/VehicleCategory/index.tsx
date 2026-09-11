import React, { useEffect, useMemo, useState } from "react";
import UpdatedHorizontalTab from "../../../../Components/Common/UpdatedHorizontalTab";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { getVehicleCategoryAct } from "../../../../store/transportation/transportationaction";
import { shallowEqual } from "react-redux";
import VehicleCategoryBarView from "./VehicleCategoryBarView";
import VehicleCategoryTableView from "./VehicleCategoryTableView";

export type IMenuOptionsId = "chart" | "table";

interface IMenuOptions {
  id: string;
  labelName: string;
  customPadding: string;
}

const VehicleCategory = (props: any) => {
  const { academicYearId, branchIdState } = props || {}
  const [activeId, setActiveId] = useState<IMenuOptionsId>("chart");
  const dispatch = useAppDispatch();

  const { currentBranchIdResp: branchId, currentInstIdResp: instituteId,
    getVehicleCategoryResp
  } = useAppSelector(
    ({ appData, transportrequest }) => ({
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      getVehicleCategoryResp: transportrequest.getVehicleCategoryResp
    }),
    shallowEqual
  );

  useEffect(() => {
    if(instituteId){
      transportDashboardStatsApiCall();
    }
  }, [instituteId,branchIdState]);

  const transportDashboardStatsApiCall = (otherProps?: any) => {
    let payload = {
      branchId : branchIdState,
      instituteId,
      ...otherProps,
    };
    dispatch(getVehicleCategoryAct(generateActionPayload('transport_dashboard_vehicle_category', undefined, payload)))
  }

  const MenuOptions: Array<IMenuOptions> = [
    {
      id: "chart",
      labelName: "Chart",
      customPadding: "0px 10px 10px 10px",
    },
    {
      id: "table",
      labelName: "Table",
      customPadding: "0px 10px 10px 10px",
    },
  ];

  function clickMenuHandler(event: React.MouseEvent<HTMLElement>) {
    const { currentTarget } = event;
    const menuId: IMenuOptionsId = currentTarget.getAttribute(
      "data-id"
    ) as IMenuOptionsId;
    setActiveId(menuId);
  }

  return (
    <div
      className="card !tw-shadow-sm !tw-rounded-2xl tw-overflow-hidden section-count-card"
      style={{ minHeight: "478px" }}
    >
      <div className="card-header !tw-py-2">
        <div className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-2 tw-items-center tw-gap-3">
          <div>
            <h4 className="card-title !tw-mb-0">Vehicle Category</h4>
          </div>
          <div className="tw-flex tw-justify-start lg:tw-justify-end">
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
        className={`card-body !tw-p-0`}
      >
        {activeId === "chart" ? (
          <VehicleCategoryBarView></VehicleCategoryBarView>
        ) : (
          <VehicleCategoryTableView></VehicleCategoryTableView>
        )}
      </div>
    </div>
  );
};

export default VehicleCategory;
