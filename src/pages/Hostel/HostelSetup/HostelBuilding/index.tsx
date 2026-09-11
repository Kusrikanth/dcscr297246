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
import HostelBuildingModel from "./HostelBuildingModel";
import { toast } from "react-toastify";
import { deleteHostelBuildingListAct, getHostelBuildingAct, getHostelBuildingListByIdAct, getHostelDetailsAct } from "../../../../store/hostel/hostelsettings/hostelsettingsactions";
import { Delete02StrokeStandard, PencilEdit02Icon } from "@hugeicons-pro/core-stroke-standard";
import { HugeiconsIcon } from "@hugeicons/react";
import Button from "../../../../Components/Common/Button";

const initialValues = {
  buildingName: "",
  hostelId: "",
};

const HostelBuilding = () => {

  const dispatch = useDispatch();
  
  const [hostelBuilding, setHostelBuilding] = useState(initialValues);
  const [hostelBuildingModelState, setHostelBuildingModelState] = useState({
    showModal: false,
    id: undefined
  })

  const [delHostelBuildingModalState, setDelHostelBuildingModalState] = useState({
    showModal: false,
    id: ""
  })

  const pagination = useRef({
    pageNo: 0,
    pageSize: 10,
  });

  const toggleHostelBuildingModel = (id?: any) => {
    setHostelBuildingModelState((prevState: any) => ({
      ...prevState,
      showModal: !prevState.showModal,
      id: id || "",
    }));
  };

  const toggleDelHostelBuildingModal = (id?: any) => {
    setDelHostelBuildingModalState((prevState: any) => ({
      ...prevState,
      showModal: !prevState.showModal,
      id: id || "",
    }));
  }

  const delHostelBuildingConfirmHndler = () => {
    dispatch(deleteHostelBuildingListAct(generateActionPayload("delete_hostel_building_list", { id: delHostelBuildingModalState.id },)));
  }

  const hostelBuildingList = (otherProps?: any) => {
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
    dispatch(getHostelBuildingAct(generateActionPayload("get_hostel_building", undefined, payload)));
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
    getHostelBuildingResp,
    getHostelDetailsResp,
    delHostelBuildingRequestResp,
    saveHostelBuildingResp,
    editHostelBuildingRequestResp,
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
      getHostelBuildingResp: hostelSettings.getHostelBuildingResp,
      saveHostelBuildingResp: hostelSettings.saveHostelBuildingResp,
      editHostelBuildingRequestResp: hostelSettings.editHostelBuildingRequestResp,
      delHostelBuildingRequestResp: hostelSettings.delHostelBuildingRequestResp,
      hostelSettingsErrResp: hostelSettings.hostelSettingsErrResp,
    }),
    shallowEqual
  );
  
  const hostelBuildingRef = useRef({
    prevAddHostelBuilding: saveHostelBuildingResp,
    prevEditHostelBuilding: editHostelBuildingRequestResp,
    prevDeleteHostelBuildingRequestListResp: delHostelBuildingRequestResp,
    prevHostelBuildingErrorResp: hostelSettingsErrResp,
  });

  useEffect(() => {
    const { prevAddHostelBuilding, prevEditHostelBuilding, prevDeleteHostelBuildingRequestListResp, prevHostelBuildingErrorResp } = hostelBuildingRef.current;
    if (saveHostelBuildingResp && prevAddHostelBuilding !== saveHostelBuildingResp) {
      toast.success("Hostel Building added successfully.");
      toggleHostelBuildingModel()
      hostelBuildingList()
    }
    else if (editHostelBuildingRequestResp && prevEditHostelBuilding !== editHostelBuildingRequestResp) {
      toast.success("Hostel Building updated successfully.");
      toggleHostelBuildingModel()
      hostelBuildingList()
    }
    else if (delHostelBuildingRequestResp && prevDeleteHostelBuildingRequestListResp !== delHostelBuildingRequestResp) {
      toast.success("Hostel Building deleted successfully.");
      toggleDelHostelBuildingModal()
      hostelBuildingList()
    }
    else if (hostelSettingsErrResp && prevHostelBuildingErrorResp !== hostelSettingsErrResp) {
      const { details } = hostelSettingsErrResp;
      toast.error(details);
    }
    hostelBuildingRef.current.prevDeleteHostelBuildingRequestListResp = delHostelBuildingRequestResp;
    hostelBuildingRef.current.prevEditHostelBuilding = editHostelBuildingRequestResp;
    hostelBuildingRef.current.prevAddHostelBuilding = saveHostelBuildingResp;
    hostelBuildingRef.current.prevHostelBuildingErrorResp = hostelSettingsErrResp;

  }, [saveHostelBuildingResp, editHostelBuildingRequestResp, delHostelBuildingRequestResp, hostelSettingsErrResp]);

const filterHandler = (event: { target: { name: any; value: any; }; }) => {
  const { name, value } = event.target;
  setHostelBuilding((prev) => ({ ...prev, [name]: value }));
  pagination.current.pageNo = 0;
  hostelBuildingList({ [name]: value });
};
function filterDropDownHandler(event: React.ChangeEvent<HTMLInputElement>) {
  const { name, value } = event.target;
  setHostelBuilding((prev) => ({ ...prev, [name]: value }));
  pagination.current.pageNo = 0;
  hostelBuildingList({ [name]: value });
}
const menuOptions = useMemo(
  () => [
    {
      id: "edit",
      actionIcon: <HugeiconsIcon icon={PencilEdit02Icon} className="text-muted" size={18}/>,
      actionName: "Edit",
      onClickHndlr: (event: any) => {
        const id = event.currentTarget.getAttribute("data-id");
        dispatch(getHostelBuildingListByIdAct(generateActionPayload("get_Hostel_building_list_by_id", { id: id })));
        toggleHostelBuildingModel(id)
      },
    },
    {
      id: "delete",
      actionIcon: <HugeiconsIcon icon={Delete02StrokeStandard} className="text-danger" size={18} />,
      actionName: "Delete",
      onClickHndlr: (event: any) => {
        const id = event.currentTarget.getAttribute("data-id");
        toggleDelHostelBuildingModal(id)
      },
    },
  ],
  []
);

useEffect(() => {
  hostelDetailsList();
  hostelBuildingList();
}, [branchId,instituteId]);

const columns = useMemo(() => generateColumns(menuOptions), [menuOptions]);

function paginationHndlr(paginationInfo: IPaginationState) {
  pagination.current = paginationInfo;
  hostelBuildingList(paginationInfo);
}
const { data: hostelBuildingResp, totalElements, totalPages, pageable } = getHostelBuildingResp || {};
const { data: hostelDetailsResp } = getHostelDetailsResp || {};

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
                    Hostel Building Details
                  </h4>
                </div>
                <div>
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
            </div>

            <div className="tw-p-0">
              <form
              // onSubmit={hostelBuilding.handleSubmit}
              >
                <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-12 tw-gap-3 tw-px-3 tw-pt-3">
                  <div className="md:tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-3">
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
                      <i className="ri-search-line search-icon"></i>
                    </div>
                  </div>

                  <div className="md:tw-col-span-12 lg:tw-col-span-2 xl:tw-col-span-2">
                    <SelectInput
                      name="hostelId"
                      value={hostelBuilding.hostelId}
                      onChange={filterDropDownHandler}
                      menuItems={hostelDetailsResp}
                      valueKey="hostelId"
                      textKey="hostelName"
                      formgroupClassName="mb-0"
                      labelText="Hostel Name"
                      floatingLabel
                    />
                  </div>
                  
                  
                </div>
              </form>
              <TableContainer
                columns={columns || []}
                data={hostelBuildingResp || []}
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
        id="hostel-Building-modal"
        isOpen={hostelBuildingModelState.showModal}
        toggle={() => toggleHostelBuildingModel()}
        modalTitle={hostelBuildingModelState.id ? "Edit Hostel Building" : "Create Hostel Building"}
        modalSize="md"
      >
        <HostelBuildingModel
          id={hostelBuildingModelState.id}
          toggle={() => toggleHostelBuildingModel()}
          modalTitle="Create Hostel Building" isOpen={false} />
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

export default HostelBuilding;
