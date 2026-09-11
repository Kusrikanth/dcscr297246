import { useFormik } from "formik";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import { useEffect, useMemo, useRef, useState } from "react";
import { ConfirmationModal, ModalContainerUpdated, SelectInput, TextInput } from "../../../../Components/Common";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { shallowEqual, useDispatch } from "react-redux";
import { useAppSelector } from "../../../../hooks/storehook";
import TableContainer from "../../../../Components/Common/TableContainer";
import { IPaginationState } from "../../../../Components/Common/Pagination";
import HostelRoomDetailsModel from "./HostelRoomDetailsModel";
import { toast } from "react-toastify";
import { generateColumns, hasStateChanged } from "./helper";
import { deleteHostelRoomDetailsListAct, deleteHostelRoomTypeListAct, getHostelBuildingAct, getHostelDetailsAct, getHostelFloorAct, getHostelRoomDetailsAct, getHostelRoomDetailsListByIdAct, getHostelRoomTypeAct } from "../../../../store/hostel/hostelsettings/hostelsettingsactions";
import BedNumberDetailsModel from "./BedNumberDetailsModel";
import { resetHostelBuildingsListAct, resetHostelFloorListAct, resetHostelRoomDetailsListAct, resetHostelRoomTypeListAct } from "../../../../store/hostel/hostelsettings/hostelsettingsslice";
import { Delete02StrokeStandard, PencilEdit02Icon } from "@hugeicons-pro/core-stroke-standard";
import { HugeiconsIcon } from "@hugeicons/react";
import Button from "../../../../Components/Common/Button";

const initialValues = {
  RoomDetailsName: "",
  hostelId: "",
  buildingId: "",
  floorId: "",
  roomTypeId: "",
};

const HostelRoomDetails = () => {

  const dispatch = useDispatch();

  const [hostelRoomDetails, setHostelRoomDetails] = useState(initialValues);
  const [hostelRoomDetailsModelState, setHostelRoomDetailsModelState] = useState({
    showModal: false,
    id: undefined
  })

  const [delHostelRoomDetailsModalState, setDelHostelRoomDetailsModalState] = useState({
    showModal: false,
    id: ""
  })
  const [showClearFilterState, setShowClearFilterState] = useState(false);
  const [bedNumberDetailsModel, setBedNumberDetailsModel] =
    useState({
      showModal: false,
      id: undefined,
    });
  const pagination = useRef({
    pageNo: 0,
    pageSize: 10,
  });
  const toggleNoofBedsModel = (id?: any) => {
    setBedNumberDetailsModel((prev: any) => ({
      ...prev,
      showModal: !prev.showModal,
      id: id || ""
    }));
  };
  const toggleHostelRoomDetailsModel = (id?: any) => {
    setHostelRoomDetailsModelState((prevState: any) => ({
      ...prevState,
      showModal: !prevState.showModal,
      id: id || "",
    }));
  };

  const toggleDelHostelRoomDetailsModal = (id?: any) => {
    setDelHostelRoomDetailsModalState((prevState: any) => ({
      ...prevState,
      showModal: !prevState.showModal,
      id: id || "",
    }));
  }

  const delHostelRoomDetailsConfirmHndler = () => {
    dispatch(deleteHostelRoomDetailsListAct(generateActionPayload("delete_hostel_room_details_list", { id: delHostelRoomDetailsModalState.id },)));
  }

  const hostelRoomDetailsList = (otherProps?: any) => {
    const { hostelId, buildingId, roomTypeId, floorId } = hostelRoomDetails;
    const payload = {
      branchId,
      hostelId,
      buildingId,
      roomTypeId,
      floorId,
      sortBy: "createdAt",
      orderBy: "asc",
      ...pagination.current,
      ...otherProps,
    };
    dispatch(getHostelRoomDetailsAct(generateActionPayload("get_hostel_room_details", undefined, payload)));
  };
  const hostelDetailsList = (otherProps?: any) => {
    const { hostelId } = hostelRoomDetails;
    const payload = {
      branchId,
      hostelId,
      ...otherProps,
    };
    dispatch(getHostelDetailsAct(generateActionPayload("get_hostel_details", undefined, payload)));
  };

  const {
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    showApiLoader,
    getHostelRoomDetailsResp,
    getHostelDetailsResp,
    delHostelRoomDetailsRequestResp,
    saveHostelRoomDetailsResp,
    editHostelRoomDetailsRequestResp,
    getHostelBuildingResp,
    getHostelFloorResp,
    getHostelRoomTypeResp,
    hostelSettingsErrResp,
  }: any = useAppSelector(
    ({ globalData, appData, hostelSettings }) => ({
     currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      showApiLoader: globalData.showApiLoader,
      getHostelDetailsResp: hostelSettings.getHostelDetailsResp,
      getHostelRoomDetailsResp: hostelSettings.getHostelRoomDetailsResp,
      saveHostelRoomDetailsResp: hostelSettings.saveHostelRoomDetailsResp,
      editHostelRoomDetailsRequestResp: hostelSettings.editHostelRoomDetailsRequestResp,
      delHostelRoomDetailsRequestResp: hostelSettings.delHostelRoomDetailsRequestResp,
      getHostelBuildingResp: hostelSettings.getHostelBuildingResp,
      getHostelFloorResp: hostelSettings.getHostelFloorResp,
      getHostelRoomTypeResp: hostelSettings.getHostelRoomTypeResp,
      hostelSettingsErrResp: hostelSettings.hostelSettingsErrResp,
    }),
    shallowEqual
  );

  const hostelRoomDetailsRef = useRef({
    prevAddHostelRoomDetails: saveHostelRoomDetailsResp,
    prevEditHostelRoomDetails: editHostelRoomDetailsRequestResp,
    prevDeleteHostelRoomDetailsRequestListResp: delHostelRoomDetailsRequestResp,
    prevHostelRoomDetailsErrorResp: hostelSettingsErrResp,
  });

  useEffect(() => {
    const { prevAddHostelRoomDetails, prevEditHostelRoomDetails, prevDeleteHostelRoomDetailsRequestListResp, prevHostelRoomDetailsErrorResp } = hostelRoomDetailsRef.current;
    if (saveHostelRoomDetailsResp && prevAddHostelRoomDetails !== saveHostelRoomDetailsResp) {
      toast.success("Hostel Room Details added successfully.");
      toggleHostelRoomDetailsModel()
      hostelRoomDetailsList()
    }
    else if (editHostelRoomDetailsRequestResp && prevEditHostelRoomDetails !== editHostelRoomDetailsRequestResp) {
      toast.success("Hostel Room Details updated successfully.");
      toggleHostelRoomDetailsModel()
      hostelRoomDetailsList()
    }
    else if (delHostelRoomDetailsRequestResp && prevDeleteHostelRoomDetailsRequestListResp !== delHostelRoomDetailsRequestResp) {
      toast.success("Hostel Room Details deleted successfully.");
      toggleDelHostelRoomDetailsModal()
      hostelRoomDetailsList()
    }
    else if (hostelSettingsErrResp && prevHostelRoomDetailsErrorResp !== hostelSettingsErrResp) {
      const { details } = hostelSettingsErrResp;
      toast.error(details);
    }
    hostelRoomDetailsRef.current.prevDeleteHostelRoomDetailsRequestListResp = delHostelRoomDetailsRequestResp;
    hostelRoomDetailsRef.current.prevEditHostelRoomDetails = editHostelRoomDetailsRequestResp;
    hostelRoomDetailsRef.current.prevAddHostelRoomDetails = saveHostelRoomDetailsResp;
    hostelRoomDetailsRef.current.prevHostelRoomDetailsErrorResp = hostelSettingsErrResp;

  }, [saveHostelRoomDetailsResp, editHostelRoomDetailsRequestResp, delHostelRoomDetailsRequestResp, hostelSettingsErrResp]);

  useEffect(() => {
    hostelRoomDetailsList();
    hostelDetailsList();
    return () => {

    }
  }, [branchId,instituteId]);

  const filterHandler = (event: { target: { name: any; value: any; }; }) => {
    const { name, value } = event.target;
    pagination.current.pageNo = 0;

    if (name === 'hostelId') {
      setHostelRoomDetails((prev: any) => ({ ...prev, [name]: value, buildingId: "" }));
      const payload = { branchId: branchId, hostelId: value, orderBy: "asc", pageNo: 0, pageSize: 100 };
      hostelRoomDetailsList({ [name]: value });

      if (!value) {
        dispatch(resetHostelBuildingsListAct(undefined));
      } else {
        dispatch(getHostelBuildingAct(generateActionPayload("get_hostel_building", undefined, payload)));
      }
    } else if (name === 'buildingId') {
      setHostelRoomDetails((prev: any) => ({ ...prev, [name]: value }));
      const payload = { branchId: branchId, hostelId: hostelRoomDetails.hostelId, buildingId: value, orderBy: "asc", pageNo: 0, pageSize: 100 };
      hostelRoomDetailsList({ [name]: value });

      if (!value) {
        dispatch(resetHostelFloorListAct(undefined));
      }
      else {
        dispatch(getHostelFloorAct(generateActionPayload("get_hostel_floor", undefined, payload)));
      }
    }
    else if (name === 'floorId') {
      setHostelRoomDetails((prev: any) => ({ ...prev, [name]: value, }));
      const floorPayload = { branchId: branchId, buildingId: hostelRoomDetails.buildingId, floorId: value, orderBy: "asc", pageNo: 0, pageSize: 100 };
      hostelRoomDetailsList({ [name]: value });

      if (!value) {
        dispatch(resetHostelRoomTypeListAct(undefined));
      } else {
        dispatch(getHostelRoomTypeAct(generateActionPayload("get_hostel_room_type", undefined, floorPayload)));
      }
    }
    else if (name === 'roomTypeId') {
      setHostelRoomDetails((prev: any) => ({ ...prev, [name]: value, }));
      hostelRoomDetailsList({ [name]: value });
      if (!value) {
        dispatch(resetHostelRoomTypeListAct(undefined));
      }

    }
    else {
      setHostelRoomDetails((prev: any) => ({ ...prev, [name]: value }));
      hostelRoomDetailsList({ [name]: value });

    }

    const stateChanged = hasStateChanged({ ...initialValues, [name]: value });
    setShowClearFilterState(stateChanged?.stateChange);
  };
  const clearFilterHndlr = () => {
    pagination.current = { ...pagination.current, pageNo: 0 };
    dispatch(resetHostelRoomDetailsListAct(undefined));
    setHostelRoomDetails({ ...initialValues });
    hostelRoomDetailsList({ ...initialValues });
    setShowClearFilterState(false);
  };
  const menuOptions = useMemo(
    () => [
      {
        id: "edit",
        actionIcon: <HugeiconsIcon icon={PencilEdit02Icon} className="text-muted" size={18}/>,
        actionName: "Edit",
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute("data-id");
          dispatch(getHostelRoomDetailsListByIdAct(generateActionPayload("get_Hostel_room_details_list_by_id", { id: id })));
          toggleHostelRoomDetailsModel(id)
        },
      },
      {
        id: "delete",
        actionIcon: <HugeiconsIcon icon={Delete02StrokeStandard} className="text-danger" size={18} />,
        actionName: "Delete",
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute("data-id");
          toggleDelHostelRoomDetailsModal(id)
        },
      },
    ],
    []
  );


  const columns = useMemo(() => generateColumns(menuOptions, toggleNoofBedsModel), [menuOptions]);

  function paginationHndlr(paginationInfo: IPaginationState) {
    pagination.current = paginationInfo;
    hostelRoomDetailsList(paginationInfo);
  }
  const { data: hostelRoomDetailsResp, totalElements, totalPages, pageable } = getHostelRoomDetailsResp || {};
  const { data: hostelDetailsResp } = getHostelDetailsResp || {};
  const { data: hostelBuildingResp } = getHostelBuildingResp || {};
  const { data: hostelFloorResp } = getHostelFloorResp || {};
  const { data: hostelRoomTypeResp } = getHostelRoomTypeResp || {};
  return (
    <>
      <div className="page-content free_payment_record_wrapper">
        <div className="container-fluid">
          <BreadCrumb title="Hostel" pageTitle="Hostel" />

          <div className="tw-bg-white tw-rounded-lg tw-shadow tw-mt-4">
            <div className="tw-border-b tw-px-4 tw-py-3">
              <div className="tw-flex tw-items-center tw-justify-between">
                <h4 className="tw-text-lg tw-font-semibold tw-text-gray-800">
                  Hostel Room Details
                </h4>
                <Button
                  type="button"
                  variant="primary"
                  onClick={() => toggleHostelRoomDetailsModel()}
                >
                  <i className="ri-add-line tw-mr-2" />
                  Add New
                </Button>
              </div>
            </div>

            <div className="tw-p-0">
              <form>
                <div className="tw-grid tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-12 tw-gap-4 tw-px-4 tw-pt-4">

                  <div className="lg:tw-col-span-2">
                    <div className="tw-relative search-box">
                      <TextInput
                        name="RoomDetailsName"
                        formgroupClassName="tw-mb-3"
                        value={hostelRoomDetails.RoomDetailsName}
                        onChange={filterHandler}
                        labelText="Search"
                        placeHolder="Search"
                        floatingLabel
                      />
                      <i className="ri-search-line tw-absolute tw-left-3 tw-top-1/2 tw--translate-y-1/2 tw-text-gray-400" />
                    </div>
                  </div>

                  <div className="lg:tw-col-span-2">
                    <SelectInput
                      name="hostelId"
                      value={hostelRoomDetails.hostelId}
                      onChange={filterHandler}
                      menuItems={hostelDetailsResp}
                      valueKey="hostelId"
                      textKey="hostelName"
                      formgroupClassName="tw-mb-0"
                      labelText="Hostel Name"
                      floatingLabel
                    />
                  </div>

                  <div className="lg:tw-col-span-2">
                    <SelectInput
                      name="buildingId"
                      value={hostelRoomDetails.buildingId}
                      onChange={filterHandler}
                      menuItems={hostelBuildingResp}
                      valueKey="id"
                      textKey="buildingName"
                      formgroupClassName="tw-mb-0"
                      labelText="Building Name"
                      floatingLabel
                    />
                  </div>

                  <div className="lg:tw-col-span-2">
                    <SelectInput
                      name="floorId"
                      value={hostelRoomDetails.floorId}
                      onChange={filterHandler}
                      menuItems={hostelFloorResp}
                      valueKey="floorId"
                      textKey="floorName"
                      formgroupClassName="tw-mb-0"
                      labelText="Floor Name"
                      floatingLabel
                    />
                  </div>

                  <div className="lg:tw-col-span-2">
                    <SelectInput
                      name="roomTypeId"
                      value={hostelRoomDetails.roomTypeId}
                      onChange={filterHandler}
                      menuItems={hostelRoomTypeResp}
                      valueKey="roomTypeId"
                      textKey="roomType"
                      formgroupClassName="tw-mb-0"
                      labelText="Room Type"
                      floatingLabel
                    />
                  </div>

                  <div className="lg:tw-col-span-2 tw-flex tw-justify-end tw-items-start tw-gap-2">
                    {showClearFilterState && (
                      <Button
                        type="button"
                        variant="wrong"
                        onClick={clearFilterHndlr}
                      >
                        Clear Filter
                      </Button>
                    )}

 
                  </div>

                </div>
              </form>

              {/* Table */}
              <TableContainer
                columns={columns || []}
                data={hostelRoomDetailsResp || []}
                tableClass="tw-w-full"
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
      </div>
      <ModalContainerUpdated
        id="hostel-RoomDetails-modal"
        isOpen={hostelRoomDetailsModelState.showModal}
        toggle={() => toggleHostelRoomDetailsModel()}
        modalTitle={hostelRoomDetailsModelState.id ? "Edit Hostel Room" : "Create Hostel Room"}
        modalSize="md"
      >
        <HostelRoomDetailsModel
          id={hostelRoomDetailsModelState.id}
          toggle={() => toggleHostelRoomDetailsModel()}
          modalTitle="Create Hostel Room" isOpen={false} />
      </ModalContainerUpdated>

      <ConfirmationModal
        id="delete-hostel-RoomDetails-modal"
        isOpen={delHostelRoomDetailsModalState.showModal}
        confirmMessage="Are you sure you want to delete this Hostel RoomDetails ?"
        cancelHndlr={() => toggleDelHostelRoomDetailsModal()}
        confirmHndlr={delHostelRoomDetailsConfirmHndler}
        showImgIcon={true}
        isDisble={showApiLoader}
        iconType="reject"
      />
      <ModalContainerUpdated
        id="payment-details"
        isOpen={bedNumberDetailsModel.showModal}
        toggle={() => toggleNoofBedsModel()}
        modalTitle="Number of Beds"
        modalSize="md"
      >
        <BedNumberDetailsModel
          isOpen={bedNumberDetailsModel.showModal}
          toggle={() => toggleNoofBedsModel()}
          modalTitle="Number of Beds"
          id={bedNumberDetailsModel.id}
        />
      </ModalContainerUpdated>
    </>
  );
};

export default HostelRoomDetails;
