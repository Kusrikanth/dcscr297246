import { shallowEqual } from "react-redux";
import { useAppSelector } from "../../../../hooks/storehook";

const VehicleCategoryTable = () => {

    const { currentBranchIdResp: branchId,currentInstIdResp: instituteId,
      getVehicleCategoryResp
      } = useAppSelector(
        ({ appData, transportrequest }) => ({
          currentBranchIdResp:appData.currentBranchIdResp,
          currentInstIdResp:appData.currentInstIdResp,
          getVehicleCategoryResp:transportrequest.getVehicleCategoryResp
  
        }),
        shallowEqual
    );
    
    const borderColors = ["#D8D4FE", "#BCE3FF", "#C4F4E4"]; 
    
    const rowData = getVehicleCategoryResp?.map((item: any, index: any) => ({
      vehicleType: item.vehicleType,
      noOfVehicles: item.noOfVehicles,
      vehiclesUsing: item.vehiclesUsing,
      vehiclesPercentage: parseFloat(item.vehiclePercentage).toFixed(2),
      borderColor: borderColors[index % borderColors.length],
    }));
    const totalVehicles = rowData?.reduce((acc: any, cur: any) => acc + cur.noOfVehicles, 0);
    const totalVehiclesUsing = rowData?.reduce((acc: any, cur: any) => acc + cur.vehiclesUsing, 0);
    const totalVehiclesPercentage = rowData?.reduce((acc: any, cur: any) => acc + parseFloat(cur.vehiclesPercentage), 0).toFixed(2);

  return (
    <div className="tw-py-1 tw-px-1 tw-m-0 tw-w-full">
      <div className="tw-grid tw-grid-cols-12 tw-border-b tw-py-1 tw-px-0 tw-w-full tw-mx-auto tw-max-w-full">
        <div className="tw-col-span-3">
          <p className="tw-font-semibold tw-text-gray-500 tw-truncate tw-my-1">
            Vehicle Type
          </p>
        </div>
        <div className="tw-col-span-3 tw-text-center">
          <p className="tw-font-semibold tw-text-gray-500 tw-truncate tw-my-1">
            No of Vehicles
          </p>
        </div>
        <div className="tw-col-span-3 tw-text-center">
          <p className="tw-font-semibold tw-text-gray-500 tw-truncate tw-my-1">
            Vehicles Using
          </p>
        </div>
        <div className="tw-col-span-3 tw-text-center">
          <p className="tw-font-semibold tw-text-gray-500 tw-truncate tw-my-1">
            Vehicles Percentage (%)
          </p>
        </div>
      </div>
      <div
        className="tw-grid tw-grid-cols-12 tw-w-full tw-mx-auto"
        style={{
          zIndex: "1",
          maxHeight: "396px",
          minHeight: "100px",
          overflowY: "auto",
          overflowX: "hidden",
          scrollbarWidth: "thin",
        }}
      >
        <div className="tw-col-span-12 tw-p-0 tw-ps-2">
          <div className="tw-flex tw-items-center">
            <div className="tw-flex-grow tw-overflow-hidden">
              {rowData?.map((row: any, index: number) => (
                <div
                  key={index}
                  className="tw-grid tw-grid-cols-12 tw-py-1 tw-mx-1 tw-my-1 tw-border-b tw-pr-0"
                  style={{ borderLeft: `4px solid ${row.borderColor}` }}
                >
                  <div className="tw-col-span-3">
                    <p className="tw-truncate tw-mb-1 tw-flex tw-items-center">
                      {row.vehicleType}
                    </p>
                  </div>

                  <div className="tw-col-span-3 tw-text-center">
                    <p className="tw-truncate tw-mb-1">
                      {row.noOfVehicles}
                    </p>
                  </div>

                  <div className="tw-col-span-3 tw-text-center">
                    <p className="tw-truncate tw-mb-1">
                      {row.vehiclesUsing}
                    </p>
                  </div>

                  <div className="tw-col-span-3 tw-text-center">
                    <p className="tw-font-medium tw-truncate tw-ps-3 tw-mb-1">
                      {row.vehiclesPercentage}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="tw-grid tw-grid-cols-12 tw-justify-between tw-mx-auto tw-ps-4 tw-pt-2">
        <div className="tw-col-span-3">
          <p className="tw-font-medium tw-truncate tw-mb-1">Total</p>
        </div>

        <div className="tw-col-span-3 tw-text-center">
          <p className="tw-font-medium tw-truncate tw-mb-1 tw-pr-2.5">
            {totalVehicles}
          </p>
        </div>

        <div className="tw-col-span-3 tw-text-center">
          <p className="tw-font-medium tw-truncate tw-mb-1 tw-pr-2.5">
            {totalVehiclesUsing}
          </p>
        </div>

        <div className="tw-col-span-3 tw-text-center">
          <p className="tw-font-medium tw-truncate tw-mb-1">
            {totalVehiclesPercentage}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default VehicleCategoryTable;
