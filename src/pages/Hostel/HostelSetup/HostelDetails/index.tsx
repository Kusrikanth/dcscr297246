import { useFormik } from "formik";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import { useEffect, useMemo, useRef, useState } from "react";
import { ConfirmationModal, ModalContainerUpdated, TextInput } from "../../../../Components/Common";
import { deleteHostelDetailsListAct, getHostelDetailsAct, getHostelDetailsListByIdAct } from "../../../../store/hostel/hostelsettings/hostelsettingsactions";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { shallowEqual, useDispatch } from "react-redux";
import { useAppSelector } from "../../../../hooks/storehook";
import { generateColumns } from "./helper";
import TableContainer from "../../../../Components/Common/TableContainer";
import { IPaginationState } from "../../../../Components/Common/Pagination";
import HostelDetailsModel from "./HostelDetailsModel";
import { toast } from "react-toastify";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02StrokeStandard, PencilEdit02Icon } from "@hugeicons-pro/core-stroke-standard";
import Button from "../../../../Components/Common/Button";

const initialValues = {
  searchString: "",
};

const HostelDetails = () => {

  const dispatch = useDispatch();
  
  const [hostelDetails, setHostelDetails] = useState(initialValues);
  const [hostelDetailsModelState, setHostelDetailsModelState] = useState({
    showModal: false,
    hostelId: undefined
  })

  const [delHostelDetailsModalState, setDelHostelDetailsModalState] = useState({
    showModal: false,
    hostelId: ""
  })

  const pagination = useRef({
    pageNo: 0,
    pageSize: 10,
  });

  const toggleHostelDetailsModel = (hostelId?: any) => {
    setHostelDetailsModelState((prevState: any) => ({
      ...prevState,
      showModal: !prevState.showModal,
      hostelId: hostelId || "",
    }));
  };

  const toggleDelHostelDetailsModal = (hostelId?: any) => {
    setDelHostelDetailsModalState((prevState: any) => ({
      ...prevState,
      showModal: !prevState.showModal,
      hostelId: hostelId || "",
    }));
  }

  const delHostelDetailsConfirmHndler = () => {
    dispatch(deleteHostelDetailsListAct(generateActionPayload("delete_hostel_details_list", { hostelId: delHostelDetailsModalState.hostelId },)));
  }

  const hostelDetailsList = (otherProps?: any) => {
    const { searchString } = hostelDetails;
    let payload = {
      branchId,
      searchString,
      sortBy: "createdAt",
      orderBy: "asc",
      ...pagination.current,
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
    getHostelDetailsResp,
    delHostelRequestResp,
    saveHostelDetailsResp,
    editHostelDetailRequestResp,
    hostelSettingsErrResp,
  }: any = useAppSelector(
    ({ applicationSale, globalData, instAcademics, branchAcademics, appData, hostelSettings }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      branchClassResp: branchAcademics.branchClassResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      showApiLoader: globalData.showApiLoader,
      getHostelDetailsResp: hostelSettings.getHostelDetailsResp,
      saveHostelDetailsResp: hostelSettings.saveHostelDetailsResp,
      editHostelDetailRequestResp: hostelSettings.editHostelDetailRequestResp,
      delHostelRequestResp: hostelSettings.delHostelRequestResp,
      hostelSettingsErrResp: hostelSettings.hostelSettingsErrResp,
    }),
    shallowEqual
  );
  
  const hostelDetailsRef = useRef({
    prevAddHostelDetails: saveHostelDetailsResp,
    prevEditHostelDetails: editHostelDetailRequestResp,
    prevDeleteHostelRequestListResp: delHostelRequestResp,
    prevHostelDetailsErrorResp: hostelSettingsErrResp,
  });

  useEffect(() => {
    const { prevAddHostelDetails, prevEditHostelDetails, prevDeleteHostelRequestListResp, prevHostelDetailsErrorResp } = hostelDetailsRef.current;
    if (saveHostelDetailsResp && prevAddHostelDetails !== saveHostelDetailsResp) {
      toast.success("Hostel Details added successfully.");
      toggleHostelDetailsModel()
      hostelDetailsList()
    }
    else if (editHostelDetailRequestResp && prevEditHostelDetails !== editHostelDetailRequestResp) {
      toast.success("Hostel Details updated successfully.");
      toggleHostelDetailsModel()
      hostelDetailsList()
    }
    else if (delHostelRequestResp && prevDeleteHostelRequestListResp !== delHostelRequestResp) {
      toast.success("Hostel Details deleted successfully.");
      toggleDelHostelDetailsModal()
      hostelDetailsList()
    }
    else if (hostelSettingsErrResp && prevHostelDetailsErrorResp !== hostelSettingsErrResp) {
      const { details } = hostelSettingsErrResp;
      toast.error(details);
    }
    hostelDetailsRef.current.prevDeleteHostelRequestListResp = delHostelRequestResp;
    hostelDetailsRef.current.prevEditHostelDetails = editHostelDetailRequestResp;
    hostelDetailsRef.current.prevAddHostelDetails = saveHostelDetailsResp;
    hostelDetailsRef.current.prevHostelDetailsErrorResp = hostelSettingsErrResp;

  }, [saveHostelDetailsResp, editHostelDetailRequestResp, delHostelRequestResp, hostelSettingsErrResp]);

const filterHandler = (event: { target: { name: any; value: any; }; }) => {
  const { name, value } = event.target;
  setHostelDetails((prev) => ({ ...prev, [name]: value }));
  pagination.current.pageNo = 0;
  hostelDetailsList({ [name]: value });
};

const menuOptions = useMemo(
  () => [
    {
      id: "edit",
      actionIcon: <HugeiconsIcon icon={PencilEdit02Icon} className="text-muted" size={18}/>,
      actionName: "Edit",
      onClickHndlr: (event: any) => {
        const hostelId = event.currentTarget.getAttribute("data-id");
        dispatch(getHostelDetailsListByIdAct(generateActionPayload("get_Hostel_details_list_by_id", { hostelId: hostelId })));
        toggleHostelDetailsModel(hostelId)
      },
    },
    {
      id: "delete",
      actionIcon: <HugeiconsIcon icon={Delete02StrokeStandard} className="text-danger" size={18} />,
      actionName: "Delete",
      onClickHndlr: (event: any) => {
        const hostelId = event.currentTarget.getAttribute("data-id");
        toggleDelHostelDetailsModal(hostelId)
      },
    },
  ],
  []
);

useEffect(() => {
  hostelDetailsList();
}, [branchId,instituteId]);

const columns = useMemo(() => generateColumns(menuOptions), [menuOptions]);

function paginationHndlr(paginationInfo: IPaginationState) {
  pagination.current = paginationInfo;
  hostelDetailsList(paginationInfo);
}
const { data: hostelDetailsResp, totalElements, totalPages, pageable } = getHostelDetailsResp || {};

  return (
    <>
      <div className="page-content free_payment_record_wrapper">
        <div className="container-fluid">
          <BreadCrumb title="Hostel" pageTitle="Hostel" />

          <div className="tw-bg-white tw-rounded-lg tw-shadow tw-mb-6">
            <div className="tw-border-b tw-px-4 tw-py-3">
              <div className="tw-flex tw-justify-between tw-items-center">
                <div className="tw-w-1/2">
                  <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                    Hostel Details
                  </h4>
                </div>
                 <div>
                    <Button
                      type="button"
                      variant="primary"
                      onClick={() => toggleHostelDetailsModel()}
                    >
                      <i className="ri-add-line tw-mr-2" />
                      Add New
                    </Button>
                  </div>
              </div>
            </div>

            <div className="tw-p-0">
              <form
              // onSubmit={hostelDetails.handleSubmit}
              >
                <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-12 tw-gap-3 tw-px-3 tw-pt-3">
                  <div className="md:tw-col-span-6 lg:tw-col-span-4 xl:tw-col-span-4">
                    <div className="search-box">
                      <TextInput
                        name="searchString"
                        formgroupClassName="mb-3"
                        value={hostelDetails.searchString}
                        onChange={filterHandler}
                        labelText="Search"
                        placeHolder="Search"
                        floatingLabel
                      />
                      <i className="ri-search-line search-icon"></i>
                    </div>
                  </div>
                 
                  
                </div>
              </form>
              <TableContainer
                columns={columns || []}
                data={hostelDetailsResp || []}
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
        id="hostel-details-modal"
        isOpen={hostelDetailsModelState.showModal}
        toggle={() => toggleHostelDetailsModel()}
        modalTitle={hostelDetailsModelState.hostelId ? "Edit Hostel Details" : "Create Hostel Details"}
        modalSize="md"
      >
        <HostelDetailsModel
          hostelId={hostelDetailsModelState.hostelId}
          toggle={() => toggleHostelDetailsModel()}
          modalTitle="Create Hostel Details" isOpen={false} />
      </ModalContainerUpdated>

      <ConfirmationModal
        id="delete-hostel-details-modal"
        isOpen={delHostelDetailsModalState.showModal}
        confirmMessage="Are you sure you want to delete this Hostel Details ?"
        cancelHndlr={() => toggleDelHostelDetailsModal()}
        confirmHndlr={delHostelDetailsConfirmHndler}
        showImgIcon={true}
        isDisble={showApiLoader}
        iconType="reject"
      />
    </>
  );
};

export default HostelDetails;
