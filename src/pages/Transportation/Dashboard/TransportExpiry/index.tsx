import React, { useEffect, useMemo, useRef, useState } from "react";
import UpdatedHorizontalTab from "../../../../Components/Common/UpdatedHorizontalTab";
import {
  HugeiconsIcon
} from "@hugeicons/react";
import { LicenseThirdPartyIcon, DocumentValidationIcon, GreenHouseIcon, Bus01Icon } from "@hugeicons-pro/core-stroke-standard";

import LicenseRenewal from "./LicenseRenewal";
import VehicleRegistrationRenewal from "./VehicleRegistrationRenewal";
import TransportClasswise from "../TransportClasswise";
import ExportIcon from "../../../../assets/imagesdps/common_icon/export_icon.svg";
import { UncontrolledTooltip } from "reactstrap";
import { useModal } from "../../../../hooks/modalhook";
import ExportModal from "../../../Directory/StudentManagement/ExportModal";
import { Button, ModalContainerUpdated } from "../../../../Components/Common";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { exportTransportOptedAct } from "../../../../store/transportation/transportationaction";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { toast } from "react-toastify";
import { downloadExcelFile } from "../../../../utility/commonutility";
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

const TransportExpiry = () => {
  const [activeId, setActiveId] = useState<any>("transportClasswise");
  const [filterState, setFilterState] = useState(initialValues);
  const { modalState: duedateSmsModalState, closeModal: closeDuedateSmsModalHndlr, openModal: openDuedateSmsModalHndlr } = useModal();
  const dispatch = useAppDispatch();
  
  const { currentBranchIdResp: branchId, currentInstIdResp: instituteId,
    academicYearListResp, getTransportOptedResp, exportTransportOptedResp
  } = useAppSelector(
    ({ instAcademics, appData, transportrequest }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      getTransportOptedResp: transportrequest.getTransportOptedResp,
      exportTransportOptedResp: transportrequest.exportTransportOptedResp

    }),
    shallowEqual
  );
   const employeeManagementRespRef = useRef({
      prevExportTransportOptedResp: exportTransportOptedResp
    });
  
    useEffect(() => {
      const { prevExportTransportOptedResp } = employeeManagementRespRef.current;
      if (exportTransportOptedResp && prevExportTransportOptedResp !== exportTransportOptedResp) {
        toast.success(" Exported successfully");
        closeDuedateSmsModalHndlr()
        downloadExcelFile(exportTransportOptedResp, "transport_opted");
      }
      employeeManagementRespRef.current.prevExportTransportOptedResp = exportTransportOptedResp;
    }, [exportTransportOptedResp]);
  


  const MenuOptions: Array<IMenuOptions> = [
    {
      id: "transportClasswise",
      labelName: "Transport Opted",
      customPadding: "0px 5px 5px 5px",
      Icon: (
        <HugeiconsIcon icon={Bus01Icon}
          size={24}
          color={activeId === "transportClasswise" ? "#0AB39C" : "#9599AD"}
          className="me-2"
        />
      ),
    },
    {
      id: "licenseRenewal",
      labelName: "License Renewal",
      customPadding: "0px 5px 5px 5px",
      Icon: (
        <HugeiconsIcon icon={LicenseThirdPartyIcon}
          size={24}
          color={activeId === "licenseRenewal" ? "#0AB39C" : "#9599AD"}
          className="me-2"
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
          className="me-2"
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
          className="me-2"
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
          className="me-2"
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
          className="me-2"
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
          className="me-2"
        />
      ),
    },

  ];

  function getActiveMenuComponent(menuId: string) {
    switch (menuId) {
      case "transportClasswise":
        return TransportClasswise
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
      <TabComponent setFilterState={setFilterState} filterState={filterState} activeId={activeId} />
    );
  }, [activeId, filterState]);

  function submitHndlr(password: any) {
    const { academicYearId } = academicYearListResp?.data?.find((year: any) => year.yearStatus.toLowerCase() === "current") || {};
    dispatch(exportTransportOptedAct(generateActionPayload("export_transport_opted", undefined, { academicYearId, branchId, instituteId }, {
      responseType: 'blob'
    })));
  }

  return (
    <>
      <div className="tw-overflow-x-auto">
  <div className="tw-bg-white tw-rounded-xl tw-shadow tw-min-w-max tw-h-full">
        <div className="tw-pb-0 tw-border-b">
          <div className="tw-flex tw-items-center tw-px-3 tw-py-4">
            <UpdatedHorizontalTab
              MenuOptions={MenuOptions}
              clickMenuHandler={clickMenuHandler}
              activeTabId={activeId}
              horizontalClass="tw-ps-0 tw-overflow-x-auto tw-whitespace-nowrap"
            />
          </div>
        </div>
        {activeId === "transportClasswise" && <div className="card-header tw-py-3">
          <div className="row align-items-center sticky-top">
            <div className="col">
              <h4 className="card-title mb-0 flex-grow-1">
                Transport Opted
              </h4>
            </div>
            <div className="col-auto ">
              <div className="d-flex align-items-center">
                <Button
                  id="export-btn"
                  variant="exportBtn"
                  onClick={openDuedateSmsModalHndlr}
                >
                  <img src={ExportIcon} className="img-fluid h-100" />
                  <UncontrolledTooltip placement="bottom" target="export-btn">
                    Export
                  </UncontrolledTooltip>
                </Button>
              </div>
            </div>
          </div>
        </div>}
          <div
            className="card-body p-0 tw-overflow-x-auto tw-me-1"
            style={{
              zIndex: "1",
              height: "378px",
              overflowY: "auto",
            }}
          >
            <div className="tw-w-full">{activeComponent}</div>
        </div>
      </div>
        </div>
      
      <ModalContainerUpdated
        id="employee-export-modal"
        isOpen={duedateSmsModalState.showModal}
        toggle={closeDuedateSmsModalHndlr}
        modalTitle="Export Transport Opted Report"
        modalSize="md"
      >
        <ExportModal
          isOpen={duedateSmsModalState.showModal}
          toggle={closeDuedateSmsModalHndlr}
          instituteId={instituteId}
          branchId={branchId}
          submitHndlr={submitHndlr}
          feature="transportation"
          subFeature={"transport_opted"}
          remarksText="Enter remarks to export the data?"
        />
      </ModalContainerUpdated>
    </>
  );
};

export default TransportExpiry;
