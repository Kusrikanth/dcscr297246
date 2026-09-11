import { generateColumnsSlabs } from "./helper";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { getSlabOccupancySummaryAct } from "../../../../store/transportation/transportationaction";
import { shallowEqual } from "react-redux";
import { getSortingKeysLower } from "../../../../utility/commonutility";
import TableContainer from "../../../../Components/Common/TableContainer";

const initialFilterState = {
  shiftWise: "",
}
const SlabOccupancy = () => {
  const [filterState, setFilterState] = useState({ ...initialFilterState });
  const dispatch = useAppDispatch();
  const sortingRef = useRef(undefined);
  const routeOccupancySummaryApiCall = (otherProps?: any) => {
    const sortingParams = getSortingKeysLower(sortingRef.current, true);
    const { academicYearId } = academicYearListResp?.data?.find((year: any) => year.yearStatus.toLowerCase() === "current") || {};

    let payload = {
      instituteId,
      academicYearId,
      sortBy: "slabName",
      ...otherProps,
      ...sortingParams
    };
    if (payload.academicYearId) {
      dispatch(getSlabOccupancySummaryAct(generateActionPayload('transport_slab_occupancy_summary', undefined, payload)))
    }
  }

  const { currentBranchIdResp: branchId, currentInstIdResp: instituteId,
    academicYearListResp, getSlabOccupancySummaryResp,
  } = useAppSelector(
    ({ instAcademics, appData, transportrequest }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      getSlabOccupancySummaryResp: transportrequest.getSlabOccupancySummaryResp,

    }),
    shallowEqual
  )

  useEffect(() => {
    const { data } = academicYearListResp || {};
    if (Array.isArray(data) && data.length > 0) {
      routeOccupancySummaryApiCall();
    }
  }, [academicYearListResp, instituteId]);

  function sortingHandler(sortingKeys: any) {
    if (sortingRef.current && sortingRef.current !== sortingKeys) {
      sortingRef.current = sortingKeys;
      routeOccupancySummaryApiCall({ shiftWise: filterState.shiftWise });
    } else {
      sortingRef.current = sortingKeys;
    }
  }

  const slabTableColumns = useMemo(() => generateColumnsSlabs(), [getSlabOccupancySummaryResp]);

  return (
    <div
      className="overflow-hidden section-count-card"
    >
      <div className="tw-w-full tw-mx-auto !tw-max-h-[360px]">
        <TableContainer
          columns={slabTableColumns || []}
          data={(getSlabOccupancySummaryResp || []).slice(0, -1)}
          tableClass="tw-mb-0"
          divClass="table-responsive tw-max-h-[400px]"
          theadClass="table-light tw-text-gray-500 tw-align-middle tw-sticky tw-top-0"
          tfootClass="tw-sticky tw-bottom-0 tw-bg-white"
          showPagination={false}
          showFooter={true}
          manualSorting={true}
          sortingHandler={sortingHandler}
        ></TableContainer>
      </div>
    </div>
  );
};

export default SlabOccupancy;


