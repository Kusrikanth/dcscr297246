import { useFormik } from "formik";
import { useEffect, useMemo, useRef } from "react";
import { ModalContainerUpdated, TextInput } from "../../../../Components/Common";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import TableContainer from "../../../../Components/Common/TableContainer";
import { useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual, useDispatch } from "react-redux";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { IPaginationState } from "../../../../Components/Common/Pagination";
import { toast } from "react-toastify";
import { generateColumns } from "./helper";
import AddVehicleModelManufactureModel from "./AddVehicleModelManufactureModel";
import AddVehicleManufactureModel from "./AddVehicleManufactureModel";
import { PencilEdit02Icon } from "@hugeicons-pro/core-stroke-standard";
import { HugeiconsIcon } from "@hugeicons/react";
import { useModal } from "../../../../hooks/modalhook";
import { getVehicleManufactureDetailsListAct } from "../../../../store/transportation/settings/vehicledetails/vehicledetaileaction";
import Button from "../../../../Components/Common/Button";

const initialValues = {
  searchString: "",
};

const VehicleManufacture = () => {

  const dispatch = useDispatch();
  const { openModal: openVehicleManufactureModal, closeModal: closeVehicleManufactureModal, modalState: vehicleManufactureModalState } = useModal();
  const { openModal: openVehicleModalManufactureModal, closeModal: closeVehicleModalManufactureModal, modalState: vehicleModalManufactureModalState } = useModal();

  const pagination = useRef({
    pageNo: 0,
    pageSize: 10,
  });

  const vehicleManufactureFormik = useFormik({
    enableReinitialize: true,
    initialValues,
    onSubmit: (values) => { },
  });

  const vehicleManufactureList = (otherProps?: any) => {
    const { searchString } = vehicleManufactureFormik.values;
    let payload = {
      branchId,
      searchString,
      ...pagination.current,
      ...otherProps,
    };
    dispatch(getVehicleManufactureDetailsListAct(generateActionPayload("get_vehicle_manufacture_details", undefined, payload)));
  }

  const {
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    showApiLoader,
    getVehicleManufactureDetailListResp,
    saveVehicleManufactureDetailListResp,
    saveVehicleModelManufactureDetailListResp,
    vehicleDetailErrorResp,
  } = useAppSelector(
    ({ vehicleDetailRequest, appData, globalData }) => ({
      currentBranchIdResp: appData.currentBranchIdResp,
      showApiLoader: globalData.showApiLoader,
      currentInstIdResp: appData.currentInstIdResp,
      getVehicleManufactureDetailListResp: vehicleDetailRequest.getVehicleManufactureDetailListResp,
      saveVehicleModelManufactureDetailListResp: vehicleDetailRequest.saveVehicleModelManufactureDetailListResp,
      saveVehicleManufactureDetailListResp: vehicleDetailRequest.saveVehicleManufactureDetailListResp,
      vehicleDetailErrorResp: vehicleDetailRequest.vehicleDetailErrorResp,

    }),
    shallowEqual
  );

  const vehicleManufactureRef = useRef({
    prevSaveVehicleManufactureDetails: saveVehicleManufactureDetailListResp,
    prevsaveVehicleModelManufactureDetail: saveVehicleModelManufactureDetailListResp,
    prevVehicleDetailError: vehicleDetailErrorResp,
  });

  useEffect(() => {
    const { prevSaveVehicleManufactureDetails, prevsaveVehicleModelManufactureDetail, prevVehicleDetailError } = vehicleManufactureRef.current;
    if (saveVehicleManufactureDetailListResp && prevSaveVehicleManufactureDetails !== saveVehicleManufactureDetailListResp) {
      toast.success("Manufacture Added successfully.");
      closeVehicleManufactureModal()
      vehicleManufactureList()
    }
    else if (saveVehicleModelManufactureDetailListResp && prevsaveVehicleModelManufactureDetail !== saveVehicleModelManufactureDetailListResp) {
      toast.success("Manufacture Updated successfully.");
      closeVehicleModalManufactureModal()
      vehicleManufactureList()
    }
    else if (vehicleDetailErrorResp && prevVehicleDetailError !== vehicleDetailErrorResp) {
      const { details } = vehicleDetailErrorResp;
      toast.error(details);
    }
    vehicleManufactureRef.current.prevSaveVehicleManufactureDetails = saveVehicleManufactureDetailListResp;
    vehicleManufactureRef.current.prevsaveVehicleModelManufactureDetail = saveVehicleModelManufactureDetailListResp;
    vehicleManufactureRef.current.prevVehicleDetailError = vehicleDetailErrorResp;
  }, [saveVehicleManufactureDetailListResp, saveVehicleModelManufactureDetailListResp, vehicleDetailErrorResp]);


  const menuOptions = useMemo(
    () => [
      {
        id: "edit",
        actionIcon: <HugeiconsIcon icon={PencilEdit02Icon} className="text-muted" size={18} />,
        actionName: "Edit",
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute("data-id");
          openVehicleModalManufactureModal(id);
        },
      }
    ],
    [getVehicleManufactureDetailListResp]
  );

  const columns = useMemo(() => generateColumns(menuOptions), [menuOptions]);

  useEffect(() => {
    if (branchId) {
      vehicleManufactureList();
    }
  }, [vehicleManufactureFormik.values.searchString]);

  function paginationHndlr(paginationInfo: IPaginationState) {
    pagination.current = paginationInfo;
    vehicleManufactureList(paginationInfo);
  }

  const { totalElements, totalPages, pageable } = getVehicleManufactureDetailListResp || {};

  return (
    <>
      <div className="page-content free_payment_record_wrapper">
        <div className="container-fluid">
          <BreadCrumb title="Settings" pageTitle="Transportation" />
          <div className="tw-bg-white tw-rounded-lg tw-shadow-sm tw-mb-6">
            <div className="tw-border-b tw-px-4 tw-py-3">
              <div className="tw-flex tw-items-center tw-justify-between">
                <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                  Vehicle Manufacture
                </h4>
                <Button
                  type="button"
                  variant="primary"
                  onClick={openVehicleManufactureModal}
                  className="tw-flex tw-items-center"
                >
                  <i className="ri-add-line" />
                  Add New
                </Button>
              </div>
            </div>
            <div className="tw-p-4">
              <form onSubmit={vehicleManufactureFormik.handleSubmit}>
                <div className="tw-grid tw-grid-cols-12 tw-gap-4 tw-items-end">
                  <div className="tw-col-span-12 md:tw-col-span-4">
                    <div className="search-box">
                      <TextInput
                        name="searchString"
                        formgroupClassName="tw-mb-0"
                        placeHolder="Search"
                        labelText="Search"
                        floatingLabel
                        value={vehicleManufactureFormik.values.searchString}
                        onChange={vehicleManufactureFormik.handleChange}
                      />
                      <i className="ri-search-line search-icon"></i>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <TableContainer
              columns={columns || []}
              data={Array.isArray(getVehicleManufactureDetailListResp?.data) ? getVehicleManufactureDetailListResp.data : []}
              tableClass="tw-mb-0"
              divClass="tw-overflow-x-auto tw-mb-3"
              theadClass="tw-bg-gray-100 tw-text-gray-600 tw-align-middle"
              showCheckbox={false}
              showPagination={true}
              totalPages={totalPages || 0}
              totalRecords={totalElements || 0}
              callbackPaginationHndlr={paginationHndlr}
              currentPageNumber={pageable?.pageNumber || 0}
            />
          </div>
        </div>
      </div>
      <ModalContainerUpdated
        id="add-edit-difficulty-levels-modal"
        isOpen={vehicleManufactureModalState.showModal}
        toggle={closeVehicleManufactureModal}
        modalTitle="Add Vehicle Manufacture"
        modalSize="lg"
      >
        <AddVehicleManufactureModel
          toggle={closeVehicleManufactureModal}
          id={vehicleManufactureModalState.modalData}
        />
      </ModalContainerUpdated>
      <ModalContainerUpdated
        id="add-edit-difficulty-levels-modal"
        isOpen={vehicleModalManufactureModalState.showModal}
        toggle={closeVehicleModalManufactureModal}
        modalTitle={
          vehicleModalManufactureModalState.modalData
            ? "Edit Vehicle Manufacture Model"
            : "Add Vehicle Manufacture Model"
        }
        modalSize="lg"
      >
        <AddVehicleModelManufactureModel
          toggle={closeVehicleModalManufactureModal}
          id={vehicleModalManufactureModalState.modalData}
        />
      </ModalContainerUpdated>
    </>
  );
};

export default VehicleManufacture;
