import React, { useEffect, useMemo, useRef, useState } from "react";
import { ConfirmationModal, ModalContainerUpdated, SelectInput, TextInput } from "../../../Components/Common";
import TableContainer from "../../../Components/Common/TableContainer";
import { generateColumns } from "./helper";
import { UncontrolledTooltip } from 'reactstrap';
import ExportIcon from "../../../assets/imagesdps/common_icon/export_icon.svg";
import { useFormik } from "formik";
import { useHistory } from "react-router-dom";
import { useModal } from "../../../hooks/modalhook";
import AddManageAllNotifcationsModal from "./AddManageAllNotifcationsModal";
import classnames from "classnames";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import CommunicationLogsModal from "./CommunicationLogsModal";
import AddUserDefinedTemplateModal from "../Settings/UserDefinedTemplate/AddUserDefinedTemplateModal";
import ComposeModal from "./ComposeModal";
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { getInstAcademicYearAct } from "../../../store/mastersettings/instacademics/instacademicactions";
import { generateActionPayload } from "../../../utility/reduxutility";
import { getCurriculumClassSectAct, getManageNotificationAct } from "../../../store/communication/communicationactions";
import { IPaginationState } from "../../../Components/Common/Pagination";
import Button from "../../../Components/Common/Button";

const ManageAllNotifcations = () => {
  const [filterState, setFilterState] = useState({
    searchString: "",
    academicYearId: "",
  })
  const { closeModal: closeManageAllNotifcationsModal, modalState: manageAllNotifcationState, openModal: openManageAllNotifcationsModal } = useModal();
  const { closeModal: closeCommunicationStatusLogsModal, modalState: communicationStatusLogState, openModal: openCommunicationStatusLogsModal } = useModal();
  const dispatch = useAppDispatch();
  const { showApiLoader, currentInstIdResp: instituteId, currentBranchIdResp: branchId,
    academicYearListResp, manageNotificationResp, curriculumClassSectResp, communicationErrorResp,
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
    }), shallowEqual);

  const paginationRef = useRef({
    pageNo: 0,
    pageSize: 10,
  });

  function getManageNotificationApiCall(otherProps?: any) {
    const payload = {
      instituteId, branchId, searchString: filterState.searchString, ...otherProps, ...paginationRef.current,
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



  const menuOptions = useMemo(() => [
    {
      id: "view",
      actionIcon: <i className={classnames("me-2 ri-eye-fill text-primary fs-16")}></i>,
      actionName: "View Details",
    },
    {
      id: "logs",
      actionIcon: <i className={classnames("me-2 ri-eye-fill text-primary fs-16")}></i>,
      actionName: "Status Logs",
      onClickHndlr: openCommunicationStatusLogsModal,
    },
  ], []);

  function paginationHndlr(paginationInfo: IPaginationState) {
    paginationRef.current = paginationInfo;
    getManageNotificationApiCall();
  }

  function toggleModalHndlr() {
    closeManageAllNotifcationsModal();
    getManageNotificationApiCall();
  }

  function onChangeFilterHndlr(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFilterState(prevState => ({ ...prevState, [name]: value }));
    getManageNotificationApiCall({ searchString: value });
  }
  const columns = useMemo(() => generateColumns(menuOptions), [manageNotificationResp]);
  const { data: notificationList, pageNumber, totalPages, totalElements } = manageNotificationResp || {};
  return (
    <>
      <div className="page-content free_payment_record_wrapper">
        <div className="tw-px-4 tw-pb-4">

          <BreadCrumb title="Communication" pageTitle="Communication" />

          <div className="tw-bg-white tw-rounded-lg tw-shadow">

            {/* Header */}
            <div className="tw-border-b tw-px-4 tw-py-3">
              <div className="tw-flex tw-items-center">
                <h4 className="tw-text-lg tw-font-semibold tw-text-gray-800">
                  Manage All Notifications
                </h4>
              </div>
            </div>

            {/* Body */}
            <div className="tw-p-0">

              {/* Filters & Actions */}
              <div className="tw-grid tw-grid-cols-12 tw-gap-3 tw-px-4 tw-py-3">

                {/* Search */}
                <div className="tw-col-span-12 lg:tw-col-span-4 xl:tw-col-span-3">
                  <div className="tw-relative">
                    <div className="search-box">
                      <TextInput
                        name="searchString"
                        formgroupClassName="tw-mb-0"
                        placeHolder="Search..."
                        value={filterState.searchString}
                        onChange={onChangeFilterHndlr}
                      />
                      <i className="ri-search-line tw-absolute tw-left-3 tw-top-1/2 -tw-translate-y-1/2 tw-text-gray-400"></i>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="tw-col-span-12 tw-flex tw-justify-end lg:tw-col-span-8 xl:tw-col-span-9">
                  <Button
                    variant="primary"
                    onClick={() => openManageAllNotifcationsModal()}
                  >
                    <i className="ri-add-line tw-mr-2" />
                    Compose Message
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
        modalTitle={"Compose New Messsage"}
        modalSize="xl"
      >
        <ComposeModal
          toggle={closeManageAllNotifcationsModal}
          modalTitle="Compose New Messsage"
          instituteId={instituteId}
          branchId={branchId}
          toggleModal={toggleModalHndlr}
        />
        {/* <AddManageAllNotifcationsModal
          id={manageAllNotifcationState.showModal}
          isOpen={false}
          toggle={closeManageAllNotifcationsModal}
          modalTitle="Compose New Messsage"
        /> */}
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
