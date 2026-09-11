import React, { useEffect, useState } from "react";
import UpdatedHorizontalTab from "../../../../Components/Common/UpdatedHorizontalTab";
import { MenuOptions, IMenuOptionsId } from "./helper";
import VehicleCategoryBarChart from "./VehicleCategoryBarChart";
import VehicleCategoryTable from "./VehicleCategoryTable";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { getVehicleCategoryAct } from "../../../../store/transportation/transportationaction";
import { shallowEqual } from "react-redux";

const VehicleCategory = () => {
  const [activeId, setActiveId] = useState<IMenuOptionsId>("dunut");
  const dispatch = useAppDispatch();
  const transportDashboardStatsApiCall = ( otherProps?: any) => {
        let payload = {
            branchId,
            instituteId,
            ...otherProps,
        };
      dispatch(getVehicleCategoryAct(generateActionPayload('transport_dashboard_vehicle_category', undefined, payload)))
  }

const { currentBranchIdResp: branchId,currentInstIdResp: instituteId,
  } = useAppSelector(
    ({ appData }) => ({
      currentBranchIdResp:appData.currentBranchIdResp,
      currentInstIdResp:appData.currentInstIdResp,
    }),
    shallowEqual
  );

  useEffect(() => {
    transportDashboardStatsApiCall();
  }, [branchId, instituteId]);

  function clickMenuHandler(event: React.MouseEvent<HTMLElement>) {
    const { currentTarget } = event;
    const menuId: IMenuOptionsId = currentTarget.getAttribute(
      "data-id"
    ) as IMenuOptionsId;
    setActiveId(menuId);
  }

  return (
    <div
      className="tw-bg-white tw-rounded-xl tw-shadow tw-overflow-hidden section-count-card tw-min-h-[478px]"
    >
      <div className="tw-border-b tw-p-2 tw-pt-3 horizontal_tab_fee">
        <div className="tw-grid tw-grid-cols-12 tw-items-center">
          <div className="tw-col-span-12 md:tw-col-span-4">
            <h4 className="tw-text-base tw-font-semibold tw-mb-0">
              Vehicle Category
            </h4>
          </div>

          <div className="tw-col-span-8 tw-pt-3 md:tw-pt-0 tw-flex tw-justify-end  tw-px-4 md:tw-px-0">
            <UpdatedHorizontalTab
              MenuOptions={MenuOptions}
              clickMenuHandler={clickMenuHandler}
              activeTabId={activeId}
              horizontalClass="tw-ps-0"
            />
          </div>
        </div>
      </div>

      <div
        className={`tw-flex tw-justify-center tw-w-full tw-px-0 tw-pt-0 ${activeId === "dunut" ? "tw-pb-0" : "tw-pb-4"
          }`}
      >
        {activeId === "dunut" ? (
          <VehicleCategoryBarChart />
        ) : (
          <VehicleCategoryTable />
        )}
      </div>
    </div>
  );
};

export default VehicleCategory;
