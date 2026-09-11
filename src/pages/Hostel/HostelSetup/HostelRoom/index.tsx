import { useFormik } from "formik";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import { useEffect, useMemo, useRef, useState } from "react";
import { ConfirmationModal, ModalContainerUpdated, SelectInput, TextInput } from "../../../../Components/Common";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { shallowEqual, useDispatch } from "react-redux";
import { useAppSelector } from "../../../../hooks/storehook";
import { generateColumns } from "./helper";
import TableContainer from "../../../../Components/Common/TableContainer";
import { IPaginationState } from "../../../../Components/Common/Pagination";
import HostelBuildingModel from "./HostelRoomModel";
import { toast } from "react-toastify";
import { deleteHostelRoomTypeListAct, getHostelDetailsAct, getHostelRoomTypeAct, getHostelRoomTypeListByIdAct } from "../../../../store/hostel/hostelsettings/hostelsettingsactions";
import { Delete02StrokeStandard, PencilEdit02Icon } from "@hugeicons-pro/core-stroke-standard";
import { HugeiconsIcon } from "@hugeicons/react";
import Button from "../../../../Components/Common/Button";

const initialValues = {
  buildingName: "",
  hostelId: "",
};

const HostelRoom = () => {

  const dispatch = useDispatch();

  const [hostelBuilding, setHostelBuilding] = useState(initialValues);
  const [hostelBuildingModelState, setHostelBuildingModelState] = useState({
    showModal: false,
    roomTypeId: undefined
  })

  const [delHostelBuildingModalState, setDelHostelBuildingModalState] = useState({
    showModal: false,
    roomTypeId: ""
  })

  const pagination = useRef({
    pageNo: 0,
    pageSize: 10,
  });

  const toggleHostelBuildingModel = (roomTypeId?: any) => {
    setHostelBuildingModelState((prevState: any) => ({
      ...prevState,
      showModal: !prevState.showModal,
      roomTypeId: roomTypeId || "",
    }));
  };

  const toggleDelHostelBuildingModal = (roomTypeId?: any) => {
    setDelHostelBuildingModalState((prevState: any) => ({
      ...prevState,
      showModal: !prevState.showModal,
      roomTypeId: roomTypeId || "",
    }));
  }

  const delHostelBuildingConfirmHndler = () => {
    dispatch(deleteHostelRoomTypeListAct(generateActionPayload("delete_hostel_room_type_list", { roomTypeId: delHostelBuildingModalState.roomTypeId },)));
  }

  const hostelRoomTypeList = (otherProps?: any) => {
    const { buildingName, hostelId } = hostelBuilding;
    const payload = {
      branchId,
      hostelId: hostelId,
      buildingName,
      sortBy: "createdAt",
      orderBy: "asc",
      ...pagination.current,
      ...otherProps,
    };
    dispatch(getHostelRoomTypeAct(generateActionPayload("get_hostel_room_type", undefined, payload)));
  };
  const hostelDetailsList = (otherProps?: any) => {
    const payload = {
      branchId,
      sortBy: "createdAt",
      orderBy: "asc",
      ...otherProps,
    };
    dispatch(getHostelDetailsAct(generateActionPayload("get_hostel_details", undefined, payload)));
  };
  const {
    academicYearListResp,
    brchCurriculumResp,
    branchClassResp,
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    showApiLoader,
    getHostelRoomTypeResp,
    getHostelDetailsResp,
    delHostelRoomTypeRequestResp,
    saveHostelRoomTypeResp,
    editHostelRoomTypeRequestResp,
    hostelSettingsErrResp,
  }: any = useAppSelector(
    ({ globalData, instAcademics, branchAcademics, appData, hostelSettings }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      branchClassResp: branchAcademics.branchClassResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      showApiLoader: globalData.showApiLoader,
      getHostelDetailsResp: hostelSettings.getHostelDetailsResp,
      getHostelRoomTypeResp: hostelSettings.getHostelRoomTypeResp,
      saveHostelRoomTypeResp: hostelSettings.saveHostelRoomTypeResp,
      editHostelRoomTypeRequestResp: hostelSettings.editHostelRoomTypeRequestResp,
      delHostelRoomTypeRequestResp: hostelSettings.delHostelRoomTypeRequestResp,
      hostelSettingsErrResp: hostelSettings.hostelSettingsErrResp,
    }),
    shallowEqual
  );

  const hostelBuildingRef = useRef({
    prevAddHostelRoomType: saveHostelRoomTypeResp,
    prevEditHostelRoomType: editHostelRoomTypeRequestResp,
    prevDeleteHostelRoomTypeRequestListResp: delHostelRoomTypeRequestResp,
    prevHostelRoomTypeErrorResp: hostelSettingsErrResp,
  });

  useEffect(() => {
    const { prevAddHostelRoomType, prevEditHostelRoomType, prevDeleteHostelRoomTypeRequestListResp, prevHostelRoomTypeErrorResp } = hostelBuildingRef.current;
    if (saveHostelRoomTypeResp && prevAddHostelRoomType !== saveHostelRoomTypeResp) {
      toast.success("Hostel Room Type added successfully.");
      toggleHostelBuildingModel()
      hostelRoomTypeList()
    }
    else if (editHostelRoomTypeRequestResp && prevEditHostelRoomType !== editHostelRoomTypeRequestResp) {
      toast.success("Hostel Room Type updated successfully.");
      toggleHostelBuildingModel()
      hostelRoomTypeList()
    }
    else if (delHostelRoomTypeRequestResp && prevDeleteHostelRoomTypeRequestListResp !== delHostelRoomTypeRequestResp) {
      toast.success("Hostel Room Type deleted successfully.");
      toggleDelHostelBuildingModal()
      hostelRoomTypeList()
    }
    else if (hostelSettingsErrResp && prevHostelRoomTypeErrorResp !== hostelSettingsErrResp) {
      const { details } = hostelSettingsErrResp;
      toast.error(details);
    }
    hostelBuildingRef.current.prevDeleteHostelRoomTypeRequestListResp = delHostelRoomTypeRequestResp;
    hostelBuildingRef.current.prevEditHostelRoomType = editHostelRoomTypeRequestResp;
    hostelBuildingRef.current.prevAddHostelRoomType = saveHostelRoomTypeResp;
    hostelBuildingRef.current.prevHostelRoomTypeErrorResp = hostelSettingsErrResp;

  }, [saveHostelRoomTypeResp, editHostelRoomTypeRequestResp, delHostelRoomTypeRequestResp, hostelSettingsErrResp]);

  const filterHandler = (event: { target: { name: any; value: any; }; }) => {
    const { name, value } = event.target;
    setHostelBuilding((prev) => ({ ...prev, [name]: value }));
    pagination.current.pageNo = 0;
    hostelRoomTypeList({ [name]: value });
  };
  function filterDropDownHandler(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setHostelBuilding((prev) => ({ ...prev, [name]: value }));
    pagination.current.pageNo = 0;
    hostelRoomTypeList({ [name]: value });
  }
  const menuOptions = useMemo(
    () => [
      {
        id: "edit",
        actionIcon: <HugeiconsIcon icon={PencilEdit02Icon} className="text-muted" size={18} />,
        actionName: "Edit",
        onClickHndlr: (event: any) => {
          const roomTypeId = event.currentTarget.getAttribute("data-id");
          dispatch(getHostelRoomTypeListByIdAct(generateActionPayload("get_Hostel_room_type_list_by_id", { roomTypeId: roomTypeId })));
          toggleHostelBuildingModel(roomTypeId)
        },
      },
      {
        id: "delete",
        actionIcon: <HugeiconsIcon icon={Delete02StrokeStandard} className="text-danger" size={18} />,
        actionName: "Delete",
        onClickHndlr: (event: any) => {
          const roomTypeId = event.currentTarget.getAttribute("data-id");
          toggleDelHostelBuildingModal(roomTypeId)
        },
      },
    ],
    []
  );

  useEffect(() => {
    hostelDetailsList();
    hostelRoomTypeList();
  }, [branchId, instituteId]);

  const columns = useMemo(() => generateColumns(menuOptions), [menuOptions]);

  function paginationHndlr(paginationInfo: IPaginationState) {
    pagination.current = paginationInfo;
    hostelRoomTypeList(paginationInfo);
  }
  const { data: hostelBuildingResp, totalElements, totalPages, pageable } = getHostelRoomTypeResp || {};
  const { data: hostelDetailsResp } = getHostelDetailsResp || {};
  return (
    <>
      <div className="page-content free_payment_record_wrapper">
        <div className="container-fluid">
          <BreadCrumb title="Hostel" pageTitle="Hostel" />

          <div className="tw-bg-white tw-rounded-lg tw-shadow tw-mt-4">
            <div className="tw-border-b tw-px-4 tw-py-3">
              <div className="tw-flex tw-items-center tw-justify-between">
                <h4 className="tw-text-lg tw-font-semibold tw-text-gray-800">
                  Hostel Room Type
                </h4>
              
                    <Button
                      type="button"
                      variant="primary"
                      onClick={() => toggleHostelBuildingModel()}
                    >
                      <i className="ri-add-line tw-mr-2" />
                      Add New
                    </Button>
              </div>
            </div>

            <div className="tw-p-0">
              <form>
                <div className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-12 tw-gap-4 tw-px-4 tw-pt-4">

                  <div className="lg:tw-col-span-4">
                    <div className="tw-relative">
                      <div className="search-box">

                      <TextInput
                        name="buildingName"
                        formgroupClassName="mb-3"
                        value={hostelBuilding.buildingName}
                        onChange={filterHandler}
                        labelText="Search"
                        placeHolder="Search"
                        floatingLabel
                      />
                      <i className="ri-search-line tw-absolute tw-left-3 tw-top-1/2 tw--translate-y-1/2 tw-text-gray-400" />
                      </div>
                    </div>
                  </div>
                    
                </div>
              </form>
              <TableContainer
                columns={columns || []}
                data={hostelBuildingResp || []}
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
        id="hostel-Building-modal"
        isOpen={hostelBuildingModelState.showModal}
        toggle={() => toggleHostelBuildingModel()}
        modalTitle={hostelBuildingModelState.roomTypeId ? "Edit Hostel Room Type" : "Create Hostel Room Type"}
        modalSize="md"
      >
        <HostelBuildingModel
          roomTypeId={hostelBuildingModelState.roomTypeId}
          toggle={() => toggleHostelBuildingModel()}
          modalTitle="Create Hostel Room Type" isOpen={false} />
      </ModalContainerUpdated>

      <ConfirmationModal
        id="delete-hostel-Building-modal"
        isOpen={delHostelBuildingModalState.showModal}
        confirmMessage="Are you sure you want to delete this Hostel Building ?"
        cancelHndlr={() => toggleDelHostelBuildingModal()}
        confirmHndlr={delHostelBuildingConfirmHndler}
        showImgIcon={true}
        isDisble={showApiLoader}
        iconType="reject"
      />
    </>
  );
};

export default HostelRoom;
