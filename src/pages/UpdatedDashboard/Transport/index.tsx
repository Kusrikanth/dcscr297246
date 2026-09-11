import { useEffect, useRef, useState } from "react";
import { SelectInput } from "../../../Components/Common";
import BracnhWiseVehicleType from "./BranchWiseVehicleType";
import RouteOccupancySummary from "./RouteOccupancySummary";
import Statistics from "./Statistics";
import TransportExpiry from "./TransportExpiry";
import TransportFeeCollectionChartView from "./TransportFeeCollection";
import TransportFeeCollectionTableView from "./TransportFeeCollectionTableView";
import VehicleCategory from "./VehicleCategory";
import { shallowEqual } from "react-redux";
import { useAppSelector } from "../../../hooks/storehook";
import { toast } from "react-toastify";

const initialValues = {
  branchIdState: "",
  academicYearId: "",
}

const SuperAdminTransportDashboard = () => {

  const [filterState, setFilterState] = useState(initialValues);

  const {
    currentInstIdResp: instituteId,
    currentBranchIdResp: branchId,
    branchListResp,
    academicYearListResp,
    feeReportErrorResp,
  } = useAppSelector(
    ({ appData, branch, feeReport, instAcademics }) => ({
      currentInstIdResp: appData.currentInstIdResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      branchListResp: branch.branchListResp,
      academicYearListResp: instAcademics.academicYearListResp,
      feeReportErrorResp: feeReport.feeReportErrorResp,
    }),
    shallowEqual
  );

  const superAdminFeeDashboard = useRef({
    prevFeeReportErrorResp: feeReportErrorResp,
  })

  useEffect(() => {
    const { prevFeeReportErrorResp } = superAdminFeeDashboard.current;

    if (feeReportErrorResp && prevFeeReportErrorResp !== feeReportErrorResp) {
      const { details } = feeReportErrorResp || {}
      toast.error(details || "Something went wrong");
    }
    superAdminFeeDashboard.current.prevFeeReportErrorResp = feeReportErrorResp;

  }, [feeReportErrorResp])

  useEffect(() => {
    if (Array.isArray(academicYearListResp?.data)) {
      const { academicYearId = "" } = academicYearListResp?.data?.find((year: any) => year.yearStatus.toLowerCase() === "current") || {};
      setFilterState((prev) => ({ ...prev, academicYearId }));
    }
  }, [academicYearListResp, instituteId])

  const onChangeFilterHndlr = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    if (name === "academicYearId") {
      value && setFilterState((prevState) => ({ ...prevState, [name]: value }));
    } else {
      setFilterState((prevState) => ({ ...prevState, [name]: value }));
    }
  };

  const { data: academicYearList } = academicYearListResp || {};

  return (
    <>     
        <div className="tw-grid tw-grid-cols-12 tw-gap-1">
          <div className="tw-col-span-12 tw-mb-4">
            <div className="tw-bg-white tw-shadow-sm tw-rounded-2xl">
              <div className="tw-p-4">
                <div className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-12 tw-gap-6 tw-items-center">
                  <div className="tw-col-span-12 lg:tw-col-span-4">
                    <h4 className="tw-text-lg tw-font-semibold tw-m-0">
                      Transport Summary
                    </h4>
                  </div>

                  <div className="tw-col-span-12 lg:tw-col-span-8">
                    <div className="tw-flex tw-flex-col sm:tw-flex-row tw-gap-4 sm:tw-justify-end">
                      <div className="tw-w-full sm:tw-w-56">
                        <SelectInput
                          name="academicYearId"
                          value={filterState.academicYearId}
                          onChange={onChangeFilterHndlr}
                          menuItems={academicYearList || []}
                          valueKey="academicYearId"
                          textKey="academicYearName"
                          formgroupClassName="tw-mb-0"
                          labelText="Academic Year"
                          floatingLabel
                        />
                      </div>
                      <div className="tw-w-full sm:tw-w-56">
                        <SelectInput
                          name="branchIdState"
                          valueKey="branchId"
                          textKey="branchName"
                          value={filterState.branchIdState}
                          menuItems={branchListResp?.data}
                          onChange={onChangeFilterHndlr}
                          labelText="Branch Name"
                          floatingLabel
                          formgroupClassName="tw-mb-0"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="tw-col-span-12">
            <Statistics branchIdState={filterState.branchIdState} academicYearId={filterState.academicYearId}></Statistics>
          </div>
          <div className="tw-col-span-12 xl:tw-col-span-8 tw-grid">
            <VehicleCategory branchIdState={filterState.branchIdState} academicYearId={filterState.academicYearId}></VehicleCategory>
          </div>
          <div className="tw-col-span-12 xl:tw-col-span-4 tw-grid">
            <TransportFeeCollectionChartView branchIdState={filterState.branchIdState} academicYearId={filterState.academicYearId}></TransportFeeCollectionChartView>
          </div>
          <div className="tw-col-span-12">
            <RouteOccupancySummary 
            // branchIdState={filterState.branchIdState} academicYearId={filterState.academicYearId}
            ></RouteOccupancySummary>
          </div>
          <div className="tw-col-span-12">
            <TransportFeeCollectionTableView branchIdState={filterState.branchIdState} academicYearId={filterState.academicYearId}></TransportFeeCollectionTableView>
          </div>
          <div className="tw-col-span-12">
            <TransportExpiry branchIdState={filterState.branchIdState} academicYearId={filterState.academicYearId}></TransportExpiry>
          </div>

          <div className="tw-col-span-12">
            <BracnhWiseVehicleType></BracnhWiseVehicleType>
          </div>
        </div>      
    </>
  );
};

export default SuperAdminTransportDashboard;