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
import HostelFloorModel from "./HostelFloorModel";
import { toast } from "react-toastify";
import { deleteHostelFloorListAct, getHostelBuildingAct, getHostelDetailsAct, getHostelFloorAct, getHostelFloorListByIdAct } from "../../../../store/hostel/hostelsettings/hostelsettingsactions";
import { resetHostelBuildingsListAct, resetHostelDetailsListAct } from "../../../../store/hostel/hostelsettings/hostelsettingsslice";
import { Delete02StrokeStandard, PencilEdit02Icon } from "@hugeicons-pro/core-stroke-standard";
import { HugeiconsIcon } from "@hugeicons/react";
import Button from "../../../../Components/Common/Button";

const initialValues = {
  searchString: "",
  hostelId: "",
  buildingId: "",
};

const HostelFloor = () => {

  const dispatch = useDispatch();
  
  const [hostelFloor, setHostelFloor] = useState(initialValues);
  const [showClearFilterState, setShowClearFilterState] = useState(false);
  const [hostelFloorModelState, setHostelFloorModelState] = useState({
    showModal: false,
    floorId: undefined
  })

  const [delHostelFloorModalState, setDelHostelFloorModalState] = useState({
    showModal: false,
    floorId: ""
  })

  const pagination = useRef({
    pageNo: 0,
    pageSize: 10,
  });

  const toggleHostelFloorModel = (floorId?: any) => {
    setHostelFloorModelState((prevState: any) => ({
      ...prevState,
      showModal: !prevState.showModal,
      floorId: floorId || "",
    }));
  };

  const toggleDelHostelFloorModal = (floorId?: any) => {
    setDelHostelFloorModalState((prevState: any) => ({
      ...prevState,
      showModal: !prevState.showModal,
      floorId: floorId || "",
    }));
  }

  const delHostelFloorConfirmHndler = () => {
    dispatch(deleteHostelFloorListAct(generateActionPayload("delete_hostel_floor_list", { floorId: delHostelFloorModalState.floorId },)));
  }

  const hostelFloorList = (otherProps?: any) => {
    const { searchString, hostelId, buildingId } = hostelFloor;
    let payload = {
      branchId,
      searchString,
      hostelId:hostelId, 
      buildingId:buildingId,
      sortBy: "createdAt",
      orderBy: "asc",
      ...pagination.current,
      ...otherProps,
    };
    dispatch(getHostelFloorAct(generateActionPayload("get_hostel_floor", undefined, payload)));
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
  const hostelBuildingList = (otherProps?: any) => {
    const payload = {
      branchId,
      sortBy: "createdAt",
      orderBy: "asc",
      ...pagination.current,
      ...otherProps,
    };
    dispatch(getHostelBuildingAct(generateActionPayload("get_hostel_building", undefined, payload)));
  };
  const {
    academicYearListResp,
    brchCurriculumResp,
    branchClassResp,
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    showApiLoader,
    getHostelFloorResp,
    delHostelFloorRequestResp,
    saveHostelFloorResp,
    editHostelFloorRequestResp,
    getHostelDetailsResp,
    getHostelBuildingResp,
    hostelSettingsErrResp,
  }: any = useAppSelector(
    ({ applicationSale, globalData, instAcademics, branchAcademics, appData, hostelSettings }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      branchClassResp: branchAcademics.branchClassResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      showApiLoader: globalData.showApiLoader,
      getHostelFloorResp: hostelSettings.getHostelFloorResp,
      saveHostelFloorResp: hostelSettings.saveHostelFloorResp,
      editHostelFloorRequestResp: hostelSettings.editHostelFloorRequestResp,
      delHostelFloorRequestResp: hostelSettings.delHostelFloorRequestResp,
      getHostelDetailsResp: hostelSettings.getHostelDetailsResp,
      getHostelBuildingResp: hostelSettings.getHostelBuildingResp,
      hostelSettingsErrResp: hostelSettings.hostelSettingsErrResp,
    }),
    shallowEqual
  );
  
  const hostelFloorRef = useRef({
    prevAddHostelFloor: saveHostelFloorResp,
    prevEditHostelFloor: editHostelFloorRequestResp,
    prevDeleteHostelRequestListResp: delHostelFloorRequestResp,
    prevHostelFloorErrorResp: hostelSettingsErrResp,
  });

  useEffect(() => {
    const { prevAddHostelFloor, prevEditHostelFloor, prevDeleteHostelRequestListResp, prevHostelFloorErrorResp } = hostelFloorRef.current;
    if (saveHostelFloorResp && prevAddHostelFloor !== saveHostelFloorResp) {
      toast.success("Hostel Floor added successfully.");
      toggleHostelFloorModel()
      hostelFloorList()
    }
    else if (editHostelFloorRequestResp && prevEditHostelFloor !== editHostelFloorRequestResp) {
      toast.success("Hostel Floor updated successfully.");
      toggleHostelFloorModel()
      hostelFloorList()
    }
    else if (delHostelFloorRequestResp && prevDeleteHostelRequestListResp !== delHostelFloorRequestResp) {
      toast.success("Hostel Floor deleted successfully.");
      toggleDelHostelFloorModal()
      hostelFloorList()
    }
    else if (hostelSettingsErrResp && prevHostelFloorErrorResp !== hostelSettingsErrResp) {
      const { floor } = hostelSettingsErrResp;
      toast.error(floor);
    }
    hostelFloorRef.current.prevDeleteHostelRequestListResp = delHostelFloorRequestResp;
    hostelFloorRef.current.prevEditHostelFloor = editHostelFloorRequestResp;
    hostelFloorRef.current.prevAddHostelFloor = saveHostelFloorResp;
    hostelFloorRef.current.prevHostelFloorErrorResp = hostelSettingsErrResp;

  }, [saveHostelFloorResp, editHostelFloorRequestResp, delHostelFloorRequestResp, hostelSettingsErrResp]);




const menuOptions = useMemo(
  () => [
    {
      id: "edit",
      actionIcon: <HugeiconsIcon icon={PencilEdit02Icon} className="text-muted" size={18}/>,
      actionName: "Edit",
      onClickHndlr: (event: any) => {
        const floorId = event.currentTarget.getAttribute("data-id");
        dispatch(getHostelFloorListByIdAct(generateActionPayload("get_Hostel_floor_list_by_id", { floorId: floorId })));
        toggleHostelFloorModel(floorId)
      },
    },
    {
      id: "delete",
      actionIcon: <HugeiconsIcon icon={Delete02StrokeStandard} className="me-2 text-danger" size={18} />,
      actionName: "Delete",
      onClickHndlr: (event: any) => {
        const floorId = event.currentTarget.getAttribute("data-id");
        toggleDelHostelFloorModal(floorId)
      },
    },
  ],
  []
);

useEffect(() => {
  hostelFloorList();
  hostelDetailsList();
  hostelBuildingList();
  return () => {

  }
}, [branchId,instituteId]);

const filterHandler = (event: { target: { name: any; value: any; }; }) => {
  const { name, value } = event.target;
  pagination.current.pageNo = 0;

  if (name === 'hostelId') {
    setHostelFloor((prev: any) => ({ ...prev, [name]: value, buildingId: "" }));
    const payload = { branchId: branchId, hostelId: value, orderBy: "asc", pageNo: 0, pageSize: 100 };
    hostelFloorList({ [name]: value });
    
    if (!value) {
      dispatch(resetHostelBuildingsListAct(undefined));
    } else {
      dispatch(getHostelBuildingAct(generateActionPayload("get_hostel_building", undefined, payload)));
    }
  } else if (name === 'buildingId') {
    setHostelFloor((prev: any) => ({ ...prev, [name]: value }));
    hostelFloorList({ [name]: value });

    if (!value) {
      dispatch(resetHostelBuildingsListAct(undefined));
    }
  } else {
    setHostelFloor((prev: any) => ({ ...prev, [name]: value }));
    hostelFloorList({ [name]: value });
  }

  // const stateChanged = hasStateChanged({ ...initialValues, [name]: value });
  // setShowClearFilterState(stateChanged?.stateChange);
};

const columns = useMemo(() => generateColumns(menuOptions), [menuOptions]);

function paginationHndlr(paginationInfo: IPaginationState) {
  pagination.current = paginationInfo;
  hostelFloorList(paginationInfo);
}
const { data: hostelFloorResp, totalElements, totalPages, pageable } = getHostelFloorResp || {};
const { data: hostelDetailsResp } = getHostelDetailsResp || {};
const { data: hostelBuildingResp } = getHostelBuildingResp || {};
  return (
    <>
      <div className="page-content free_payment_record_wrapper">
        <div className="container-fluid">
          <BreadCrumb title="Hostel" pageTitle="Hostel" />

          <div className="tw-bg-white tw-rounded-lg tw-shadow tw-mb-6">
            <div className="tw-border-b tw-px-4 tw-py-3">
              <div className="tw-flex tw-items-center tw-justify-between">
                <div className="tw-w-1/2">
                  <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                    Hostel Floor Details
                  </h4>
                </div>
                <div >
                    <Button
                      type="button"
                      variant="primary"
                      onClick={() => toggleHostelFloorModel()}
                    >
                      <i className="ri-add-line tw-mr-2" />
                      Add New
                    </Button>
                  </div>
                
              </div>
            </div>

            <div className="tw-p-0">
              <form
              // onSubmit={hostelFloor.handleSubmit}
              >
                <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-12 tw-gap-3 tw-px-3 tw-pt-3">
                  <div className="md:tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-3">
                    <div className="search-box">
                      <TextInput
                        name="searchString"
                        formgroupClassName="mb-3"
                        value={hostelFloor.searchString}
                        onChange={filterHandler}
                        labelText="Search"
                        placeHolder="Search"
                        floatingLabel
                      />
                      <i className="ri-search-line search-icon"></i>
                    </div>
                  </div>

                  <div className="md:tw-col-span-12 lg:tw-col-span-2 xl:tw-col-span-2">
                    <SelectInput
                      name="hostelId"
                      value={hostelFloor.hostelId}
                      onChange={filterHandler}
                      menuItems={hostelDetailsResp}
                      valueKey="hostelId"
                      textKey="hostelName"
                      formgroupClassName="mb-0"
                      labelText="Hostel Name"
                      floatingLabel
                    />
                  </div>

                  <div className="md:tw-col-span-12 lg:tw-col-span-2 xl:tw-col-span-2">
                    <SelectInput
                      name="buildingId"
                      value={hostelFloor.buildingId}
                      onChange={filterHandler}
                      menuItems={hostelBuildingResp}
                      valueKey="id"
                      textKey="buildingName"
                      formgroupClassName="mb-0"
                      labelText="Building Name"
                      floatingLabel
                    />
                  </div>
                  
                </div>
              </form>
              <TableContainer
                columns={columns || []}
                data={hostelFloorResp || []}
                tableClass="tw-mb-0"
                divClass="tw-overflow-x-auto tw-mb-3"
                theadClass="tw-table-light tw-text-gray-500 tw-align-middle"
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
        id="hostel-Floor-modal"
        isOpen={hostelFloorModelState.showModal}
        toggle={() => toggleHostelFloorModel()}
        modalTitle={hostelFloorModelState.floorId ? "Edit Hostel Floor" : "Create Hostel Floor"}
        modalSize="md"
      >
        <HostelFloorModel
          floorId={hostelFloorModelState.floorId}
          toggle={() => toggleHostelFloorModel()}
          modalTitle="Create Hostel Floor" isOpen={false} />
      </ModalContainerUpdated>

      <ConfirmationModal
        id="delete-hostel-Floor-modal"
        isOpen={delHostelFloorModalState.showModal}
        confirmMessage="Are you sure you want to delete this Hostel Floor ?"
        cancelHndlr={() => toggleDelHostelFloorModal()}
        confirmHndlr={delHostelFloorConfirmHndler}
        showImgIcon={true}
        isDisble={showApiLoader}
        iconType="reject"
      />
    </>
  );
};

export default HostelFloor;
