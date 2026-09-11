import React, { useEffect, useMemo, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { exportRouteOccupancySummaryAct, getRouteOccupancySummaryAct } from "../../../../store/transportation/transportationaction";
import { getSortingKeysLower } from "../../../../utility/commonutility";
import { generateActionPayload } from "../../../../utility/reduxutility";
import TableContainer from "../../../../Components/Common/TableContainer";
import { ModalContainerUpdated } from "../../../../Components/Common";
import ExportModal from "../../../Directory/StudentManagement/ExportModal";
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

  const { openModal, closeModal, modalState } = useModal();

  const callSummaryAPI = (extra: any = {}) => {
    const sorting = getSortingKeysLower(sortingRef.current, true);

    const academicYearId =
      academicYearListResp?.data?.find((y: any) => y.yearStatus.toLowerCase() === "current")
        ?.academicYearId;

    if (!academicYearId) return;

    const payload = {
      branchId,
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
  }, [academicYearListResp, branchId, instituteId]);

  const submitExport = () => {
    const sorting = getSortingKeysLower(sortingRef.current, true);

    const academicYearId =
      academicYearListResp?.data?.find((y: any) => y.yearStatus.toLowerCase() === "current")
        ?.academicYearId;

    const payload = {
      branchId,
      instituteId,
      academicYearId,
      shiftWise: filterState.shiftWise,
      sortBy: "routeName",
      ...sorting
    };

    dispatch(
      exportRouteOccupancySummaryAct(
        generateActionPayload("export_route_occupancy_summary", undefined, payload, {
          responseType: "blob"
        })
      )
    );
  };

  const tableColumns = useMemo(generateColumns, []);

  return (
    <>

      <div className="tw-w-full tw-overflow-auto tw-max-h-[400px] tw-relative">

        <TableContainer
          columns={tableColumns}
          data={(getRouteOccupancySummaryResp || []).slice(0, -1)}
          tableClass="tw-min-w-full tw-border-collapse"
          divClass="tw-w-full"
          theadClass="tw-bg-gray-50 tw-text-gray-500 tw-align-middle tw-sticky tw-top-0 tw-z-10"
          tfootClass="tw-bg-white tw-sticky tw-bottom-0 tw-z-10"
          showPagination={false}
          showFooter
          manualSorting
          sortingHandler={(keys) => {
            sortingRef.current = keys;
            callSummaryAPI({ shiftWise: filterState.shiftWise });
          }}
        />
      </div>
      <ModalContainerUpdated
        id="export-route-occupancy-modal"
        isOpen={modalState.showModal}
        toggle={closeModal}
        modalTitle="Export Route Occupancy Summary"
        modalSize="md"
      >
        <ExportModal
          isOpen={modalState.showModal}
          toggle={closeModal}
          instituteId={instituteId}
          branchId={branchId}
          submitHndlr={submitExport}
          feature="transportation"
          subFeature="dashboard_route_occupancy"
          remarksText="Enter remarks to export route occupancy summary?"
        />
      </ModalContainerUpdated>

    </>
  );
};

export default RouteOccupancy;


