import React, { useEffect, useMemo, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { exportRouteOccupancySummaryAct, getRouteOccupancySummaryAct } from "../../../../store/transportation/transportationaction";
import { getSortingKeysLower } from "../../../../utility/commonutility";
import { generateActionPayload } from "../../../../utility/reduxutility";
import TableContainer from "../../../../Components/Common/TableContainer";
import { generateColumns } from "./helper";
import { useModal } from "../../../../hooks/modalhook";

const initialFilterState = { shiftWise: "" };
interface RouteOccupancyProps {
  shiftWise: string;
}

const RouteOccupancy: React.FC<RouteOccupancyProps> = ({ shiftWise }) => {
  const [filterState, setFilterState] = useState(initialFilterState);
  const sortingRef = useRef(null);

  const dispatch = useAppDispatch();
  const {
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    academicYearListResp,
    getRouteOccupancySummaryResp,
  } = useAppSelector(
    ({ instAcademics, appData, transportrequest }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      getRouteOccupancySummaryResp: transportrequest.getRouteOccupancySummaryResp,
    }),
    shallowEqual
  );

  const callSummaryAPI = (extra: any = {}) => {
    const sorting = getSortingKeysLower(sortingRef.current, true);

    const academicYearId =
      academicYearListResp?.data?.find((y: any) => y.yearStatus.toLowerCase() === "current")
        ?.academicYearId;

    if (!academicYearId) return;

    const payload = {
      instituteId,
      academicYearId,
      sortBy: "routeName",
      ...extra,
      ...sorting
    };

    dispatch(getRouteOccupancySummaryAct(generateActionPayload("transport_route_occupancy_summary", undefined, payload)));
  };

  useEffect(() => {
    callSummaryAPI({ shiftWise });
  }, [shiftWise]);

  useEffect(() => {
    if (academicYearListResp?.data?.length) callSummaryAPI();
  }, [academicYearListResp, instituteId]);

  const tableColumns = useMemo(generateColumns, []);

  return (
    <div className="tw-overflow-hidden section-count-card">
      <div className="tw-w-full tw-mx-auto tw-overflow-y-auto">
        <TableContainer
          columns={tableColumns}
          data={(getRouteOccupancySummaryResp || []).slice(0, -1)}
          tableClass="tw-mb-0"
          divClass="table-responsive tw-max-h-[400px]"
          theadClass="table-light tw-text-gray-500 tw-align-middle tw-sticky tw-top-0"
          tfootClass="tw-sticky tw-bottom-0 tw-bg-white"
          showPagination={false}
          showFooter
          manualSorting 
          sortingHandler={(keys) => {
            sortingRef.current = keys;
            callSummaryAPI({ shiftWise: filterState.shiftWise });
          }}
        />
      </div>
    </div>
  );
};

export default RouteOccupancy;


