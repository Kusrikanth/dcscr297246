import { useFormik } from "formik";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ConfirmationModal, ModalContainerUpdated, TextInput } from "../../../../Components/Common";
import TableContainer from "../../../../Components/Common/TableContainer";
import { IVehicalsTypeModal, vehicalsTypesProps } from "./VehiclesTypeTypes";
import {  generateColumns } from "./helper";
import { default as EditSvg } from "../../../../assets/imagesdps/academics/EditSvg.svg?react";
import VehicalsTypeModal from "./VehicalsTypeModal";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { deleteVehicleTypeListAct, getVehicleTypeListAct, getVehicleTypeListByIdAct } from "../../../../store/transportation/transportationaction";
import { toast } from "react-toastify";

const initialValues: vehicalsTypesProps = {
  search: "",
};

const VehiclesType = () => {

  const dispatch = useAppDispatch()
  const [vehicalTypesModalState, setVehicalTypesModalState] =
    useState<IVehicalsTypeModal>({
      showModal: false,
      vehicleId: "",
    });

    const paginationDetailRef = useRef({
      pageNo: 0,
      pageSize: 10,
      });

      const [delVehicleTypeModalState, setDelVehicleTypeModalState] = useState({
        showModal: false,
        vehicleId: ""
      })

  const toggleVehicalTypeModal = useCallback(() => {
    setVehicalTypesModalState((prevState) => ({
      ...prevState,
      showModal: !prevState.showModal,
      vehicleId : "",
    }));
  }, []);

  const {currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    showApiLoader,
    transportationErrorAct,
    getVehicleTypeListResp,
    createVehicleTypeListResp,
    deleteVehicleTypeListResp,
    editVehicleTypeListResp,
   } = useAppSelector(({ transportrequest,appData,globalData }) => ({
  
    currentBranchIdResp: appData.currentBranchIdResp,
    currentInstIdResp: appData.currentInstIdResp,
    showApiLoader : globalData.showApiLoader,
   transportationErrorAct:transportrequest.transportationErrorAct,
   getVehicleTypeListResp:transportrequest.getVehicleTypeListResp,
   createVehicleTypeListResp:transportrequest.createVehicleTypeListResp,
   deleteVehicleTypeListResp:transportrequest.deleteVehicleTypeListResp,
   editVehicleTypeListResp:transportrequest.editVehicleTypeListResp,
  }), shallowEqual);

  const vehicalsTypeFilterForm = useFormik({
    initialValues: initialValues,
    onSubmit: (values) => { },
  });
  
  const addRouteRespRef = useRef({
    prevTransportationErrorAct: transportationErrorAct,
    prevCreateVehicleTypeListResp: createVehicleTypeListResp,
    prevDeleteVehicleTypeListResp: deleteVehicleTypeListResp,
    prevEditVehicleTypeListResp: editVehicleTypeListResp,
  });

  useEffect(() => {
    const {  prevTransportationErrorAct,prevCreateVehicleTypeListResp,prevDeleteVehicleTypeListResp,prevEditVehicleTypeListResp } = addRouteRespRef.current;

    if (transportationErrorAct && prevTransportationErrorAct !== transportationErrorAct) {
     const { details } = transportationErrorAct;
      toast.error(details)
    } 
    else if (createVehicleTypeListResp && prevCreateVehicleTypeListResp !== createVehicleTypeListResp) {
     toggleVehicalTypeModal();
     toast.success("Vehicle Type added successfully");
     getVehicleTypeList({VehicleType : vehicalsTypeFilterForm.values.search})
    } 
    else if (deleteVehicleTypeListResp && prevDeleteVehicleTypeListResp !== deleteVehicleTypeListResp) {
     delModalCancelHndlr();
     toast.success("Vehicle Type Deleted successfully");
     getVehicleTypeList({VehicleType : vehicalsTypeFilterForm.values.search})
    } 
    else if (editVehicleTypeListResp && prevEditVehicleTypeListResp !== editVehicleTypeListResp) {
      toggleVehicalTypeModal();
     toast.success("Vehicle Type Edited successfully");
     getVehicleTypeList({VehicleType : vehicalsTypeFilterForm.values.search})
    } 
    addRouteRespRef.current.prevTransportationErrorAct = transportationErrorAct;
    addRouteRespRef.current.prevCreateVehicleTypeListResp = createVehicleTypeListResp;
    addRouteRespRef.current.prevDeleteVehicleTypeListResp = deleteVehicleTypeListResp;
    addRouteRespRef.current.prevEditVehicleTypeListResp = editVehicleTypeListResp;

  }, [transportationErrorAct,createVehicleTypeListResp,deleteVehicleTypeListResp,editVehicleTypeListResp]);

  function getVehicleTypeList (otherProps?:any){
    dispatch(getVehicleTypeListAct(generateActionPayload("get_vehicle_type_list", undefined,{branchId,instituteId, ...paginationDetailRef.current,...otherProps})));
  }

  
  const menuOptions = useMemo(
    () => [
      {
        id: "edit",
        actionIcon: <EditSvg className="d-inline-block" color="#405189" />,
        actionName: "Edit",
        onClickHndlr: (event:any) => {
          const vehicleId = event.currentTarget.getAttribute("data-id");
          dispatch(getVehicleTypeListByIdAct(generateActionPayload("get_vehicle_type_list_by_id", { vehicleId })));
          setVehicalTypesModalState((prevState: any) => ({ ...prevState, showModal: true, vehicleId : vehicleId || "" }));
         },
      },
      // {
      //   id: "delete",
      //   actionIcon: <i className="text-danger ri-delete-bin-5-fill fs-16"></i>,
      //   actionName: "Delete",
      //   onClickHndlr: (event:any) => { 
      //     const vehicleId = event.currentTarget.getAttribute("data-id");
      //    if (vehicleId)
      //     setDelVehicleTypeModalState((prevState: any) => ({ ...prevState, showModal: true, vehicleId : vehicleId || "" }));
      //   },
      // },
    ],
    [getVehicleTypeListResp]
  );

  useEffect(() => {
    getVehicleTypeList()
  }, [branchId,instituteId])

  function paginationHndlr(paginationInfo: any) {
    paginationDetailRef.current = paginationInfo;
    getVehicleTypeList();
}

function delModalCancelHndlr() {
  setDelVehicleTypeModalState((prevState: any) => ({ ...prevState, showModal: false,vehicleId:"" }));
}

function delModalSubmitHndlr() {
  const { vehicleId } = delVehicleTypeModalState;
  dispatch(deleteVehicleTypeListAct(generateActionPayload("delete_vehicle_type_list", { vehicleId })));
}

const filterHndler= (event:any)=>{
  vehicalsTypeFilterForm.handleChange(event)
  paginationDetailRef.current.pageNo = 0
  getVehicleTypeList({VehicleType : event.target.value})
}
  
  const roleColumns = useMemo(() => generateColumns(menuOptions), [getVehicleTypeListResp]);

  const {totalElements, totalPages, pageNumber} = getVehicleTypeListResp || {}

  return (
    <>
      <div className="page-content transportaion_dashboard_wrapper">
        <div className="container-fluid">
          <BreadCrumb title="Dashboard" pageTitle="Transportation" />

          <div className="tw-bg-white tw-rounded-lg tw-shadow tw-mb-6">
            <div className="tw-border-b tw-px-4 tw-py-3">
              <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                Vehicle Type
              </h4>
            </div>

            <div className="tw-p-0">
              <div className="">
                <div className="tw-w-full tw-mt-2">
                  <div className="tw-px-4 tw-py-3">
                    <form
                      onSubmit={vehicalsTypeFilterForm.handleSubmit}
                      className=""
                    >
                      <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-12 tw-gap-4">
                        <div className="md:tw-col-span-3 xl:tw-col-span-2">
                          <div className="search-box">
                            <TextInput
                              name="search"
                              value={vehicalsTypeFilterForm.values.search}
                              onChange={filterHndler}
                              inputClassName="bg-soft-light"
                              formgroupClassName="mb-0"
                              placeHolder="Search"
                              labelText="Search"
                              floatingLabel
                            />
                            <i className="ri-search-line search-icon"></i>
                          </div>
                        </div>

                        {/* Add button (currently commented in original code) */}
                        {/*
                  <div className="tw-flex tw-justify-end md:tw-col-span-9 xl:tw-col-span-10">
                    <button
                      type="button"
                      onClick={toggleVehicalTypeModal}
                      className="tw-bg-green-600 tw-text-white tw-flex tw-items-center tw-gap-2 tw-px-4 tw-py-2 tw-rounded-md hover:tw-bg-green-700"
                    >
                      <i className="ri-add-line" />
                      Add New
                    </button>
                  </div>
                  */}
                      </div>
                    </form>
                  </div>


                  <TableContainer
                    columns={roleColumns || []}
                    data={getVehicleTypeListResp?.data || []}
                    divClass="table-responsive mb-1"
                    theadClass="table-light text-muted align-middle"
                    showPagination={true}
                    totalPages={totalPages || 0}
                    totalRecords={totalElements || 0}
                    callbackPaginationHndlr={paginationHndlr}
                    currentPageNumber={pageNumber || 0}
                  />
                </div>

                <ModalContainerUpdated
                  id="add-edit-vehicle-type-details"
                  isOpen={vehicalTypesModalState.showModal}
                  toggle={toggleVehicalTypeModal}
                  modalTitle="Vehicles Type"
                  modalSize="md"
                >
                  <VehicalsTypeModal
                    isOpen={vehicalTypesModalState.showModal}
                    toggle={toggleVehicalTypeModal}
                    modalTitle="Vehicles Type"
                    instituteId="1"
                    instituteName="Assign Class"
                    vehicleId={vehicalTypesModalState.vehicleId}
                    editBranchDetails=""
                  />
                </ModalContainerUpdated>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ConfirmationModal
          id="delete-vehicle-type-modal"
          isOpen={delVehicleTypeModalState.showModal}
          confirmMessage="Are you sure you want to delete this Vehicle Type ?"
          cancelHndlr={delModalCancelHndlr}
          confirmHndlr={delModalSubmitHndlr}
          showImgIcon={true}
          isDisble={showApiLoader}
          iconType="reject"
        />
    </>
  );
};

export default VehiclesType;
