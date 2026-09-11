import { useFormik } from "formik";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { ConfirmationModal, ModalContainerUpdated, SelectInput, TextInput } from "../../../../Components/Common";
import TableContainer from "../../../../Components/Common/TableContainer";
import {
  vehicalDetailsProps,
} from "./VehiclesDetailsTypes";
import { generateColumns, vehicleStatsOptions } from "./helper";
import VehicalsDetailsModal from "./VehicaleDetailsModal";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { deleteVehicleDetailesAct, exportVehicleDetailListAct, getFuelTypeListAct, getVehicleDetailesListAct } from "../../../../store/transportation/settings/vehicledetails/vehicledetaileaction";
import { shallowEqual } from "react-redux";
import { getVehicleTypeListAct } from "../../../../store/transportation/transportationaction";
import { toast } from "react-toastify";
import { useModal } from "../../../../hooks/modalhook";
import { PencilEdit02Icon } from "@hugeicons-pro/core-stroke-standard";
import { HugeiconsIcon } from "@hugeicons/react";
import { UncontrolledTooltip } from "reactstrap";
import ExportIcon from "../../../../assets/imagesdps/common_icon/export_icon.svg";
import ExportModal from "../../../Directory/StudentManagement/ExportModal";
import { downloadExcelFile } from "../../../../utility/commonutility";
import Button from "../../../../Components/Common/Button";

const initialValues: vehicalDetailsProps = {
  registrationNo: "",
  vehicleStatus: "",
};

const VehiclesDetails = () => {
  const dispatch = useAppDispatch();
  const { closeModal: closeExportVehicalDetailsModalHndlr, openModal: openExportVehicalDetailsModalHnldr, modalState: exportVehicalDetailsModal } = useModal();

  const paginationDetailRef = useRef({
    pageNo: 0,
    pageSize: 10,
  });

  const { vehicleDetaileListResp, currentBranchIdResp: branchId,
    currentInstIdResp: instituteId, showApiLoader, delVehicleDetailResp, addVehicleDetailResp, updateVehicleDetailResp, vehicleDetailErrorResp, exportVehicleDetailListResp } = useAppSelector(({ vehicleDetailRequest, appData, globalData }) => ({
      vehicleDetaileListResp: vehicleDetailRequest.vehicleDetaileListResp,
      delVehicleDetailResp: vehicleDetailRequest.delVehicleDetailResp,
      addVehicleDetailResp: vehicleDetailRequest.addVehicleDetailResp,
      updateVehicleDetailResp: vehicleDetailRequest.updateVehicleDetailResp,
      vehicleDetailErrorResp: vehicleDetailRequest.vehicleDetailErrorResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      showApiLoader: globalData.showApiLoader,
      exportVehicleDetailListResp: vehicleDetailRequest.exportVehicleDetailListResp
    }), shallowEqual);

  const { modalState: vehicalDetailsModal, closeModal: closeVehicalDetailsModalHndlr,
    openModal: openVehicalDetailsModalHndlr
  } = useModal();

  const [delVehicleDetailModal, setDelVehicleDetailModal] = useState({
    showModal: false,
    vehicleDetailId: ""
  })

  const vehicalDetailsFilterForm = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    onSubmit: (values) => { },
  });

  const vehicleDetailsRef = useRef({

    prevDelVehicleDetailResp: delVehicleDetailResp,
    prevAddVehicleDetailResp: addVehicleDetailResp,
    prevUpdateVehicleDetailResp: updateVehicleDetailResp,
    prevVehicleDetailErrorResp: vehicleDetailErrorResp,
    prevExportVehicleDetailListResp: exportVehicleDetailListResp,

  });

  useEffect(() => {
    const { prevDelVehicleDetailResp, prevAddVehicleDetailResp, prevUpdateVehicleDetailResp, prevVehicleDetailErrorResp, prevExportVehicleDetailListResp } = vehicleDetailsRef.current;

    if (delVehicleDetailResp && prevDelVehicleDetailResp !== delVehicleDetailResp) {
      toggleDelVehicleDetailModal()
      toast.success("Vehicle Detail Deleted Successfully.")
      getVehicleDetailsList({ registrationNo: vehicalDetailsFilterForm.values.registrationNo || null })
    }
    else if (addVehicleDetailResp && prevAddVehicleDetailResp !== addVehicleDetailResp) {
      closeVehicalDetailsModalHndlr();
      toast.success("Vehicle detail added successfully.")
      getVehicleDetailsList({ registrationNo: vehicalDetailsFilterForm.values.registrationNo || null })
    }
    else if (updateVehicleDetailResp && prevUpdateVehicleDetailResp !== updateVehicleDetailResp) {
      closeVehicalDetailsModalHndlr();
      toast.success("Vehicle detail Edited successfully.")
      getVehicleDetailsList({ registrationNo: vehicalDetailsFilterForm.values.registrationNo || null })
    }
    else if (vehicleDetailErrorResp && prevVehicleDetailErrorResp !== vehicleDetailErrorResp) {
      const { details } = vehicleDetailErrorResp || {};
      toast.error(details)
    }
    else if (exportVehicleDetailListResp && prevExportVehicleDetailListResp !== exportVehicleDetailListResp) {
      toast.success("Exported successfully");
      closeExportVehicalDetailsModalHndlr()
      downloadExcelFile(exportVehicleDetailListResp, "vehicle_details");
    }

    vehicleDetailsRef.current.prevDelVehicleDetailResp = delVehicleDetailResp;
    vehicleDetailsRef.current.prevAddVehicleDetailResp = addVehicleDetailResp;
    vehicleDetailsRef.current.prevUpdateVehicleDetailResp = updateVehicleDetailResp;
    vehicleDetailsRef.current.prevVehicleDetailErrorResp = vehicleDetailErrorResp;
    vehicleDetailsRef.current.prevExportVehicleDetailListResp = exportVehicleDetailListResp;

  }, [delVehicleDetailResp, addVehicleDetailResp, updateVehicleDetailResp, vehicleDetailErrorResp, exportVehicleDetailListResp]);

  const toggleDelVehicleDetailModal = (id?: any) => {
    setDelVehicleDetailModal((prevState: any) => ({
      ...prevState,
      showModal: !prevState.showModal,
      vehicleDetailId: id || "",
    }));
  };

  const menuOptions = useMemo(
    () => [
      {
        id: "edit",
        actionIcon: <HugeiconsIcon icon={PencilEdit02Icon} className="text-muted" size={20} />,
        actionName: "Edit",
        onClickHndlr: (event: any) => {
          const vehicleDetailId = event.currentTarget.getAttribute("data-id")
          openVehicalDetailsModalHndlr(vehicleDetailId)

        },
      },
    ],
    []
  );

  const deleteVehicleDetailSubmitHndler = () => {

    dispatch(deleteVehicleDetailesAct(generateActionPayload("del_vehicle_details", { id: delVehicleDetailModal.vehicleDetailId }, undefined,)));
  }

  function submitExportHndlr() {

    const payload = {
      branchId,
      instituteId,
    };

    dispatch(exportVehicleDetailListAct(generateActionPayload('export_vehicle_details', undefined, payload, {
      responseType: 'blob'
    })))
  }

  function paginationHndlr(paginationInfo: any) {
    paginationDetailRef.current = paginationInfo;
    getVehicleDetailsList();
  }
  const roleColumns = useMemo(() => generateColumns(menuOptions), []);

  const getVehicleDetailsList = (otherProps?: any) => {
    dispatch(getVehicleDetailesListAct(generateActionPayload("get_vehicle_details", undefined, { instituteId, branchId, ...paginationDetailRef.current, ...otherProps })))
  }

  useEffect(() => {
    getVehicleDetailsList()
    dispatch(getVehicleTypeListAct(generateActionPayload("get_vehicle_type_list", undefined, { branchId, instituteId, pageNo: 0, pageSize: 100 })));
    dispatch(getFuelTypeListAct(generateActionPayload("get_fuel_type_list", undefined, { branchId, instituteId })));
  }, [branchId, instituteId])


const filterHndler = (event: any) => {
  const { name, value } = event.target;
  vehicalDetailsFilterForm.handleChange(event);
  getVehicleDetailsList({...vehicalDetailsFilterForm.values, [name]: value,});
};

  const { totalElements, totalPages, pageNumber } = vehicleDetaileListResp || {}
  return (
    <>
      <div className="page-content transportaion_dashboard_wrapper">
        <div className="container-fluid">
          <BreadCrumb title="Dashboard" pageTitle="Transportation" />

          <div className="tw-bg-white tw-rounded-lg tw-shadow tw-mb-6">
            <div className="tw-border-b tw-p-4">
              <div className="tw-flex tw-items-center">
                <div className="tw-w-1/2">
                  <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                    Vehicle Details
                  </h4>
                </div>

                <div className="tw-ml-auto">
                  <Button
                    variant="exportBtn"
                    id="export-btn"
                    onClick={openExportVehicalDetailsModalHnldr}
                  >
                    <img
                      src={ExportIcon}
                      className="tw-h-5 tw-w-5"
                    />
                    <UncontrolledTooltip placement="bottom" target="export-btn">
                      Export
                    </UncontrolledTooltip>
                  </Button>
                </div>
                <div className="tw-col-span-12 tw-ml-4 tw-flex tw-justify-end">
                  <Button
                    type="button"
                    variant="primary"
                    onClick={() =>
                      openVehicalDetailsModalHndlr()
                    }
                  >
                    <i className="ri-add-line tw-mr-2" />
                    Add New
                  </Button>
                </div>
              </div>
            </div>

            <div className="tw-p-0">
              <div className="tw-py-2">
                <div className="tw-inline-block tw-w-full tw-mt-2">
                  <form
                    onSubmit={vehicalDetailsFilterForm.handleSubmit}
                    className="tw-mb-3 tw-px-4"
                  >
                    <div className="tw-grid tw-grid-cols-12 tw-gap-3 tw-items-end">
                      <div className="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-3 xl:tw-col-span-2">
                        <div className="search-box tw-relative">
                          <TextInput
                            name="registrationNo"
                            value={
                              vehicalDetailsFilterForm.values.registrationNo
                            }
                            onChange={filterHndler}
                            formgroupClassName="tw-mb-0"
                            placeHolder="Search"
                            labelText="Search"
                            floatingLabel
                          />
                          <i className="ri-search-line tw-absolute tw-left-3 tw-top-1/2 -tw-translate-y-1/2 tw-text-gray-400" />
                        </div>
                      </div>
                      <div className="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-3 xl:tw-col-span-2">
                        <SelectInput
                          name="vehicleStatus"
                          value={vehicalDetailsFilterForm.values.vehicleStatus}
                          onChange={filterHndler}
                          menuItems={vehicleStatsOptions || []}
                          formgroupClassName="mb-0"
                          valueKey="id"
                          textKey="name"
                          labelText="Status"
                          floatingLabel
                        />
                      </div>
                    </div>
                  </form>

                  <TableContainer
                    columns={roleColumns || []}
                    data={vehicleDetaileListResp?.data || []}
                    divClass="tw-overflow-x-auto tw-mb-1"
                    theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
                    showPagination={true}
                    totalPages={totalPages || 0}
                    totalRecords={totalElements || 0}
                    callbackPaginationHndlr={paginationHndlr}
                    currentPageNumber={pageNumber || 0}
                  />
                </div>
                <ModalContainerUpdated
                  id="add-edit-vehicle-registration-details"
                  isOpen={vehicalDetailsModal.showModal}
                  toggle={() => closeVehicalDetailsModalHndlr()}
                  modalTitle={"Vehicle Details"}
                  modalSize="xl"
                >
                  <VehicalsDetailsModal
                    isOpen={vehicalDetailsModal.showModal}
                    toggle={closeVehicalDetailsModalHndlr}
                    modalTitle={"Vehicle Details"}
                    vehicleDetailId={vehicalDetailsModal.modalData}
                    editBranchDetails={""}
                  />
                </ModalContainerUpdated>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ConfirmationModal
        id="delete-vehicle-detail-modal"
        isOpen={delVehicleDetailModal.showModal}
        confirmMessage="Are you sure you want to delete this Vehicle Detail ?"
        cancelHndlr={toggleDelVehicleDetailModal}
        confirmHndlr={deleteVehicleDetailSubmitHndler}
        showImgIcon={true}
        isDisble={showApiLoader}
        iconType="reject"
      />
      <ModalContainerUpdated
        id="export-section-modal"
        isOpen={exportVehicalDetailsModal.showModal}
        toggle={closeExportVehicalDetailsModalHndlr}
        modalTitle="Export Vehicle Details"
        modalSize="md"
      >
        <ExportModal
          isOpen={exportVehicalDetailsModal.showModal}
          toggle={closeExportVehicalDetailsModalHndlr}
          instituteId={instituteId}
          branchId={branchId}
          submitHndlr={submitExportHndlr}
          feature="transportation"
          subFeature="vehicle_details"
          remarksText="Enter remarks to export vehicle details?"
        />
      </ModalContainerUpdated>
    </>
  );
};

export default VehiclesDetails;
