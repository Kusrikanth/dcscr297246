import { generateColumnsSlabs, menuData } from "./helper";
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
      branchId,
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
  }, [academicYearListResp, branchId, instituteId]);

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
   <>
      <div className="tw-w-full tw-max-h-[400px] tw-overflow-y-auto tw-relative">

        <TableContainer
          columns={slabTableColumns || []}
          data={(getSlabOccupancySummaryResp || []).slice(0, -1)}
          tableClass="tw-min-w-full tw-border-collapse"
          divClass="tw-w-full"
          theadClass="tw-bg-gray-50 tw-text-gray-500 tw-align-middle tw-sticky tw-top-0 tw-z-10"
          tfootClass="tw-bg-white tw-sticky tw-bottom-0 tw-z-10"
          showPagination={false}
          showFooter={true}
          manualSorting={true}
          sortingHandler={sortingHandler}
        />

      </div>

    </>
  );
};

export default SlabOccupancy;


