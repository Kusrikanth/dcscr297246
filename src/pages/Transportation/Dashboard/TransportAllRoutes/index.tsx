import React, { useMemo, useState, useRef, useEffect } from "react";
import UpdatedHorizontalTab from "../../../../Components/Common/UpdatedHorizontalTab";
import { HugeiconsIcon } from "@hugeicons/react";
import { LicenseThirdPartyIcon, Bus01Icon } from "@hugeicons-pro/core-stroke-standard";

import RouteOccupancy from "./RouteOccupancy";
import SlabOccupancy from "./SlabOccupancy";

import { ModalContainerUpdated, SelectInput } from "../../../../Components/Common";
import ExportIcon from "../../../../assets/imagesdps/common_icon/export_icon.svg";
import { UncontrolledTooltip } from "reactstrap";

import { useModal } from "../../../../hooks/modalhook";
import ExportModal from "../../../Directory/StudentManagement/ExportModal";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { downloadExcelFile, getSortingKeysLower } from "../../../../utility/commonutility";
import { exportRouteOccupancySummaryAct, exportSlabOccupancySummaryAct } from "../../../../store/transportation/transportationaction";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { menuData } from "./helper";
import { toast } from "react-toastify";
import Button from "../../../../Components/Common/Button";

const initialFilterState = { shiftWise: "" };
interface IMenuOptions {
  id: string;
  labelName: string;
  customPadding: string;
  Icon: any;
}

const TransportAllRoutes = () => {
  const [activeId, setActiveId] = useState("routeOccupancy");
  const [shiftWise, setShiftWise] = useState("");
  const dispatch = useAppDispatch();
  const sortingRef = useRef(null);
  const [filterState, setFilterState] = useState(initialFilterState);

  const { openModal, closeModal, modalState } = useModal();
  const {
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    academicYearListResp,
    exportRouteOccupancySummaryResp,
    exportSlabOccupancySummaryResp,
    transportationErrorAct,
  } = useAppSelector(
    ({ instAcademics, appData, transportrequest }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      getRouteOccupancySummaryResp: transportrequest.getRouteOccupancySummaryResp,
      exportRouteOccupancySummaryResp: transportrequest.exportRouteOccupancySummaryResp,
      exportSlabOccupancySummaryResp: transportrequest.exportSlabOccupancySummaryResp,
      transportationErrorAct: transportrequest.transportationErrorAct
    }),
    shallowEqual
  );

  const prevExportRespRef = useRef({
    prevExportRouteOccupancySummaryResp: exportRouteOccupancySummaryResp,
    prevExportSlabOccupancySummaryResp: exportSlabOccupancySummaryResp,
    prevTransportationErrorAct: transportationErrorAct,
  })
  useEffect(() => {
    const { prevExportRouteOccupancySummaryResp, prevExportSlabOccupancySummaryResp, prevTransportationErrorAct } = prevExportRespRef.current;
    if (exportRouteOccupancySummaryResp && prevExportRouteOccupancySummaryResp !== exportRouteOccupancySummaryResp) {
      toast.success("Route Occupancy Summary Exported Successfully");
      closeModal();
      downloadExcelFile(exportRouteOccupancySummaryResp, "route_occupancy_summary");
    }
    else if (exportSlabOccupancySummaryResp && prevExportSlabOccupancySummaryResp !== exportSlabOccupancySummaryResp) {
      toast.success("Slab Occupancy Summary Exported Successfully");
      closeModal();
      downloadExcelFile(exportSlabOccupancySummaryResp, "slab_occupancy_summary");
    }
    else if (transportationErrorAct && prevTransportationErrorAct !== transportationErrorAct) {
      const { message, details } = transportationErrorAct;
      toast.error(message || details || "Something went wrong.");
    }
    prevExportRespRef.current.prevExportRouteOccupancySummaryResp = exportRouteOccupancySummaryResp;
    prevExportRespRef.current.prevExportSlabOccupancySummaryResp = exportSlabOccupancySummaryResp;
    prevExportRespRef.current.prevTransportationErrorAct = transportationErrorAct;
  }, [exportRouteOccupancySummaryResp, exportSlabOccupancySummaryResp, transportationErrorAct]);

  const submitExport = () => {
    const sorting = getSortingKeysLower(sortingRef.current, true);

    const academicYearId =
      academicYearListResp?.data?.find((y: any) => y.yearStatus.toLowerCase() === "current")
        ?.academicYearId

    if (activeId === "routeOccupancy") {
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
    }
    else if (activeId === "slabOccupancy") {
      const payload = {
        branchId,
        instituteId,
        academicYearId,
        sortBy: "slabName",
        ...sorting
      };
      console.log('payload', payload);

      dispatch(
        exportSlabOccupancySummaryAct(
          generateActionPayload("export_slab_occupancy_summary", undefined, payload, {
            responseType: "blob"
          })
        )
      );
    }
  };

  const MenuOptions: Array<IMenuOptions> = [
    {
      id: "routeOccupancy",
      labelName: "Route Occupancy",
      customPadding: "0px 5px 5px 5px",
      Icon: (
        <HugeiconsIcon
          icon={Bus01Icon}
          size={24}
          color={activeId === "routeOccupancy" ? "#0AB39C" : "#9599AD"}
          className="me-2"
        />
      ),
    },
    {
      id: "slabOccupancy",
      labelName: "Slab Occupancy",
      customPadding: "0px 5px 5px 5px",
      Icon: (
        <HugeiconsIcon
          icon={LicenseThirdPartyIcon}
          size={24}
          color={activeId === "slabOccupancy" ? "#0AB39C" : "#9599AD"}
          className="me-2"
        />
      ),
    },
  ];

  const activeComponent = useMemo(() => {
    if (activeId === "routeOccupancy")
      return <RouteOccupancy shiftWise={shiftWise} />;

    if (activeId === "slabOccupancy")
      return <SlabOccupancy />;

    return null;
  }, [activeId, shiftWise]);

  return (
    <div className="tw-bg-white tw-rounded-xl tw-shadow-sm tw-border tw-border-gray-100">
      <div className="tw-px-6 tw-pt-4 tw-pb-2 tw-border-b tw-border-gray-100">

        <div className="tw-flex tw-flex-col lg:tw-flex-row lg:tw-items-center tw-gap-4">

          <div className="tw-flex-1 tw-overflow-x-auto tw-whitespace-nowrap">
            <UpdatedHorizontalTab
              MenuOptions={MenuOptions}
              clickMenuHandler={(e) =>
                setActiveId(e.currentTarget.getAttribute("data-id")!)
              }
              activeTabId={activeId}
              horizontalClass="tw-flex tw-gap-4"
            />
          </div>

          {activeId === "routeOccupancy" && (
            <div className="tw-w-full sm:tw-w-64">
              <SelectInput
                name="shiftWise"
                value={shiftWise}
                onChange={(e) => setShiftWise(e.target.value)}
                menuItems={menuData || []}
                valueKey="id"
                textKey="name"
                labelText="Route Shifts"
                floatingLabel
                formgroupClassName="tw-mb-0"
              />
            </div>
          )}

          <div
            className={`tw-flex tw-justify-end ${activeId === "slabOccupancy" ? "lg:tw-ml-auto" : ""
              }`}
          >
            <Button
              id="export-btn"
              onClick={openModal}
              variant="exportBtn"
            >
              <img src={ExportIcon} alt="Export" className="tw-w-5 tw-h-5" />
            </Button>

            <UncontrolledTooltip target="export-btn">
              Export
            </UncontrolledTooltip>
          </div>

        </div>

      </div>

      <div className="tw-p-0">

        <div className="tw-min-h-[420px]">
          {activeComponent}
        </div>

      </div>

      <ModalContainerUpdated
        id="export-route-occupancy-modal"
        isOpen={modalState.showModal}
        toggle={closeModal}
        modalTitle={
          activeId === "routeOccupancy"
            ? "Export Route Occupancy Summary"
            : "Export Slab Occupancy Summary"
        }
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
    </div>
  );
};

export default TransportAllRoutes;
