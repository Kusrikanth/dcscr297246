import React, { useEffect, useMemo, useRef, useState } from "react";
import { ConfirmationModal, ModalContainerUpdated, SelectInput, TextInput } from "../../../Components/Common";
import { CustomDatePicker } from "../../DashBoardBranchSummary/CustomDatePicker";
import TableContainer from "../../../Components/Common/TableContainer";
import { categoryOptions, generateColumns, isDraftNotification, notificationStatusFilterOptions, userTypeOptions } from "./helper";
import { UncontrolledTooltip } from 'reactstrap';
import ExportIcon from "../../../assets/imagesdps/common_icon/export_icon.svg";
import { useFormik } from "formik";
import { useHistory } from "react-router-dom";
import { useModal } from "../../../hooks/modalhook";
import AddManageAllNotifcationsModal from "./AddManageAllNotifcationsModal";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import CommunicationLogsModal from "./CommunicationLogsModal";
import AddUserDefinedTemplateModal from "../Settings/UserDefinedTemplate/AddUserDefinedTemplateModal";
import ComposeModal from "./ComposeModal";
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { getInstAcademicYearAct } from "../../../store/mastersettings/instacademics/instacademicactions";
import { generateActionPayload } from "../../../utility/reduxutility";
import { deleteNotificationAct, getCurriculumClassSectAct, getManageNotificationAct } from "../../../store/communication/communicationactions";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02StrokeStandard, PencilEdit02Icon } from "@hugeicons-pro/core-stroke-standard";
import { toast } from "react-toastify";
import { IPaginationState } from "../../../Components/Common/Pagination";
import Button from "../../../Components/Common/Button";

const initialListFilters = {
  searchString: "",
  status: "",
  recipientType: "",
  category: "",
  fromDate: "",
  toDate: "",
};
type ListFilters = typeof initialListFilters;

// "All" is what an empty filter means, so it is not offered as a choice.
const recipientTypeFilterOptions = userTypeOptions.filter((option) => option.id !== "ALL");

/** Only send the filters that have a value, so an unset filter never narrows the list. */
function toListFilterParams(filters: ListFilters) {
  return Object.fromEntries(
    (Object.keys(initialListFilters) as Array<keyof ListFilters>)
      .filter((key) => filters[key] !== "")
      .map((key) => [key, filters[key]])
  );
}

const ManageAllNotifcations = () => {
  const [filterState, setFilterState] = useState<ListFilters & { academicYearId: string }>({
    ...initialListFilters,
    academicYearId: "",
  })
  const { closeModal: closeManageAllNotifcationsModal, modalState: manageAllNotifcationState, openModal: openManageAllNotifcationsModal } = useModal();
  const { closeModal: closeCommunicationStatusLogsModal, modalState: communicationStatusLogState } = useModal();
  const { closeModal: closeViewMessageModal, modalState: viewMessageState, openModal: openViewMessageModal } = useModal();
  const { closeModal: closeDeleteNotificationModal, modalState: deleteNotificationState, openModal: openDeleteNotificationModal } = useModal();
  const dispatch = useAppDispatch();
  const { showApiLoader, currentInstIdResp: instituteId, currentBranchIdResp: branchId,
    academicYearListResp, manageNotificationResp, curriculumClassSectResp, communicationErrorResp, deleteNotificationResp,
  } = useAppSelector(({
    globalData, instAcademics, communication,
    appData }) => ({
      showApiLoader: globalData.showApiLoader,
      currentInstIdResp: appData.currentInstIdResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      academicYearListResp: instAcademics.academicYearListResp,
      manageNotificationResp: communication.manageNotificationResp,
      curriculumClassSectResp: communication.curriculumClassSectResp,
      communicationErrorResp: communication.communicationErrorResp,
      deleteNotificationResp: communication.deleteNotificationResp,
    }), shallowEqual);

  const paginationRef = useRef({
    pageNo: 0,
    pageSize: 10,
  });

  const deleteRespRef = useRef({ prevDeleteNotificationResp: deleteNotificationResp });
  useEffect(() => {
    if (deleteNotificationResp && deleteNotificationResp !== deleteRespRef.current.prevDeleteNotificationResp) {
      toast.success("Notification deleted successfully.");
      closeDeleteNotificationModal();
      getManageNotificationApiCall();
    }
    deleteRespRef.current.prevDeleteNotificationResp = deleteNotificationResp;
  }, [deleteNotificationResp]);

  function getManageNotificationApiCall(filters: ListFilters = filterState) {
    const payload = {
      instituteId, branchId, ...toListFilterParams(filters), ...paginationRef.current,
    };
    dispatch(getManageNotificationAct(generateActionPayload("get_manage_notificaiton", undefined, payload)));
  }

  useEffect(() => {
    if (academicYearListResp && Array.isArray(academicYearListResp?.data)) {
      const { academicYearId } = academicYearListResp.data?.find((year: any) => year.yearStatus === 'CURRENT') || {};
      setFilterState(prevValue => ({ ...prevValue, academicYearId: academicYearId || "" }));
    }
  }, [academicYearListResp]);

  useEffect(() => {
    if (instituteId) {
      const payload = { instituteId, sortBy: "academicYearName", orderBy: "desc", pageNo: 0, pageSize: 20 };
      dispatch(getInstAcademicYearAct(generateActionPayload("get_inst_academic_year", undefined, payload)));
    }
    if (branchId && instituteId) {
      getManageNotificationApiCall();
    }
    if (branchId) {
      dispatch(getCurriculumClassSectAct(generateActionPayload("get_curriculum_class_section", undefined, {
        branchId
      })));
    }
  }, [branchId, instituteId]);



  function findNotificationFromEvent(event: React.MouseEvent<HTMLElement>) {
    const rowId = event.currentTarget.getAttribute("data-id");
    const list = Array.isArray(manageNotificationResp?.data) ? manageNotificationResp.data : [];
    return list.find((item: any) => String(item.id) === String(rowId));
  }

  function editNotificationHndlr(event: React.MouseEvent<HTMLElement>) {
    const record = findNotificationFromEvent(event);
    if (record) openManageAllNotifcationsModal(record);
  }

  function deleteNotificationHndlr(event: React.MouseEvent<HTMLElement>) {
    const record = findNotificationFromEvent(event);
    if (record) openDeleteNotificationModal(record);
  }

  function confirmDeleteNotificationHndlr() {
    const id = deleteNotificationState.modalData?.id;
    if (!id) return;
    dispatch(deleteNotificationAct(generateActionPayload("delete_notification", { id })));
  }

  const menuOptions = useMemo(() => [
    {
      id: "edit",
      actionIcon: <HugeiconsIcon icon={PencilEdit02Icon} className="text-muted" size={18} />,
      actionName: "Edit",
      onClickHndlr: editNotificationHndlr,
    },
    {
      id: "delete",
      actionIcon: <HugeiconsIcon icon={Delete02StrokeStandard} className="text-danger" size={18} />,
      actionName: "Delete",
      onClickHndlr: deleteNotificationHndlr,
    },
  ], [manageNotificationResp]);

  function paginationHndlr(paginationInfo: IPaginationState) {
    paginationRef.current = paginationInfo;
    getManageNotificationApiCall();
  }

  function toggleModalHndlr() {
    closeManageAllNotifcationsModal();
    getManageNotificationApiCall();
  }

  function applyListFilters(nextFilters: ListFilters) {
    setFilterState(prevState => ({ ...prevState, ...nextFilters }));
    // A filtered result can have fewer pages than the current page number, so start again from the first page.
    paginationRef.current = { ...paginationRef.current, pageNo: 0 };
    getManageNotificationApiCall(nextFilters);
  }

  function onChangeFilterHndlr(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    applyListFilters({ ...filterState, [name]: value });
  }

  // The picker only reports once both ends of the range are chosen.
  function onChangeDateRangeHndlr({ startDate, endDate }: { startDate: string, endDate: string }) {
    applyListFilters({ ...filterState, fromDate: startDate, toDate: endDate });
  }

  function resetFiltersHndlr() {
    applyListFilters(initialListFilters);
  }

  const hasActiveFilters = Object.keys(toListFilterParams(filterState)).length > 0;
  const composeModalTitle = !manageAllNotifcationState.modalData?.id
    ? "Compose New Messsage"
    : isDraftNotification(manageAllNotifcationState.modalData) ? "Edit Draft" : "Edit Message";
  const columns = useMemo(() => generateColumns(menuOptions, openViewMessageModal), [manageNotificationResp]);
  const { data: notificationList, pageNumber, totalPages, totalElements } = manageNotificationResp || {};
  return (
    <>
      <div className="page-content free_payment_record_wrapper">
        <div className="tw-px-4 tw-pb-4">

          <BreadCrumb title="Communication" pageTitle="Communication" />

          <div className="tw-bg-white tw-rounded-lg tw-shadow">

            {/* Header */}
            <div className="tw-border-b tw-px-4 tw-py-3">
              <div className="tw-flex tw-items-center tw-justify-between tw-gap-3">
                <h4 className="tw-text-lg tw-font-semibold tw-text-gray-800 tw-mb-0">
                  Manage All Notifications
                </h4>
                <Button
                  variant="primary"
                  onClick={() => openManageAllNotifcationsModal()}
                >
                  <i className="ri-add-line tw-mr-2" />
                  Compose Message
                </Button>
              </div>
            </div>

            {/* Body */}
            <div className="tw-p-0">

              {/* Filters */}
              <div className="tw-flex tw-flex-wrap lg:tw-flex-nowrap tw-items-center tw-gap-3 tw-px-4 tw-py-3">

                {/* Search */}
                <div className="tw-basis-full sm:tw-basis-[calc(50%-0.375rem)] lg:tw-basis-0 tw-grow-[1.4] tw-min-w-0">
                  <div className="tw-relative">
                    <div className="search-box">
                      <TextInput
                        name="searchString"
                        formgroupClassName="tw-mb-0"
                        placeHolder="Search by title or description..."
                        value={filterState.searchString}
                        onChange={onChangeFilterHndlr}
                      />
                      <i className="ri-search-line tw-absolute tw-left-3 tw-top-1/2 -tw-translate-y-1/2 tw-text-gray-400"></i>
                    </div>
                  </div>
                </div>

                <div className="tw-basis-full sm:tw-basis-[calc(50%-0.375rem)] lg:tw-basis-0 tw-grow tw-min-w-0">
                  <SelectInput
                    name="status"
                    formgroupClassName="tw-mb-0"
                    value={filterState.status}
                    onChange={onChangeFilterHndlr}
                    menuItems={notificationStatusFilterOptions}
                    valueKey="id"
                    textKey="name"
                    defaultSelect="All Status"
                  />
                </div>

                <div className="tw-basis-full sm:tw-basis-[calc(50%-0.375rem)] lg:tw-basis-0 tw-grow tw-min-w-0">
                  <SelectInput
                    name="recipientType"
                    formgroupClassName="tw-mb-0"
                    value={filterState.recipientType}
                    onChange={onChangeFilterHndlr}
                    menuItems={recipientTypeFilterOptions}
                    valueKey="id"
                    textKey="name"
                    defaultSelect="All User Types"
                  />
                </div>

                <div className="tw-basis-full sm:tw-basis-[calc(50%-0.375rem)] lg:tw-basis-0 tw-grow tw-min-w-0">
                  <SelectInput
                    name="category"
                    formgroupClassName="tw-mb-0"
                    value={filterState.category}
                    onChange={onChangeFilterHndlr}
                    menuItems={categoryOptions}
                    valueKey="id"
                    textKey="name"
                    defaultSelect="All Categories"
                  />
                </div>

                <div className="tw-basis-full sm:tw-basis-[calc(50%-0.375rem)] lg:tw-basis-0 tw-grow-[1.3] tw-min-w-0 lg:tw-min-w-[230px]">
                  <CustomDatePicker
                    name="dateRange"
                    startDate={filterState.fromDate}
                    endDate={filterState.toDate}
                    onChange={onChangeDateRangeHndlr}
                    placeholder="Select a Date Range"
                    monthsShown={2}
                    formgroupClassName="tw-mb-0"
                  />
                </div>

                <div className="tw-shrink-0">
                  <Button
                    variant="light"
                    onClick={resetFiltersHndlr}
                    disabled={!hasActiveFilters}
                  >
                    <i className="ri-refresh-line tw-mr-2" />
                    Reset
                  </Button>
                </div>

              </div>

              {/* Table */}
              <TableContainer
                columns={columns}
                data={Array.isArray(notificationList) ? notificationList : []}
                tableClass="tw-min-w-full"
                divClass="tw-overflow-x-auto tw-mb-3"
                theadClass="tw-bg-gray-100 tw-text-gray-500"
                showPagination={true}
                totalPages={totalPages}
                totalRecords={totalElements}
                callbackPaginationHndlr={paginationHndlr}
                currentPageNumber={pageNumber}
              />
            </div>
          </div>
        </div>
      </div>
      <ModalContainerUpdated
        id="book-collection"
        isOpen={manageAllNotifcationState.showModal}
        toggle={closeManageAllNotifcationsModal}
        modalTitle={composeModalTitle}
        modalSize="xl"
      >
        <ComposeModal
          toggle={closeManageAllNotifcationsModal}
          modalTitle={composeModalTitle}
          instituteId={instituteId}
          branchId={branchId}
          toggleModal={toggleModalHndlr}
          modalData={manageAllNotifcationState.modalData}
        />
        {/* <AddManageAllNotifcationsModal
          id={manageAllNotifcationState.showModal}
          isOpen={false}
          toggle={closeManageAllNotifcationsModal}
          modalTitle="Compose New Messsage"
        /> */}
      </ModalContainerUpdated>
      <ConfirmationModal
        id="delete-notification"
        isOpen={deleteNotificationState.showModal}
        confirmMessage={<>Are you sure you want to delete the message <strong>{deleteNotificationState.modalData?.title}</strong>?</>}
        cancelHndlr={closeDeleteNotificationModal}
        confirmHndlr={confirmDeleteNotificationHndlr}
        isDisble={showApiLoader}
      />
      <ModalContainerUpdated
        id="view-notification-message"
        isOpen={viewMessageState.showModal}
        toggle={closeViewMessageModal}
        modalTitle={viewMessageState.modalData?.title || "Message"}
        modalSize="lg"
      >
        <div className="tw-p-4">
          <div className="tw-mb-3 tw-flex tw-flex-wrap tw-gap-x-6 tw-gap-y-1 tw-text-sm tw-text-gray-500">
            {viewMessageState.modalData?.userName && (
              <span>Publisher: <span className="tw-text-gray-800">{viewMessageState.modalData.userName}</span></span>
            )}
            {Array.isArray(viewMessageState.modalData?.communicationModes) && viewMessageState.modalData.communicationModes.length > 0 && (
              <span>Sent via: <span className="tw-text-gray-800">{viewMessageState.modalData.communicationModes.join(", ")}</span></span>
            )}
          </div>
          <div className="ql-snow">
            <div
              className="ql-editor tw-max-h-[60vh] tw-overflow-y-auto tw-rounded tw-border tw-border-gray-200 tw-bg-white !tw-p-3"
              dangerouslySetInnerHTML={{ __html: viewMessageState.modalData?.description || "-" }}
            />
          </div>
        </div>
        <div className="modal-footer">
          <Button variant="light" onClick={closeViewMessageModal}>Close</Button>
        </div>
      </ModalContainerUpdated>
      <ModalContainerUpdated
        id="book-collection"
        isOpen={communicationStatusLogState.showModal}
        toggle={closeCommunicationStatusLogsModal}
        modalTitle={"Communication Status Logs"}
        modalSize="xl"
      >
        <CommunicationLogsModal
          id={communicationStatusLogState.showModal}
          isOpen={false}
          toggle={closeCommunicationStatusLogsModal}
          modalTitle="Communication Status Logs"
        />
      </ModalContainerUpdated>
    </>
  );
};

export default ManageAllNotifcations;
