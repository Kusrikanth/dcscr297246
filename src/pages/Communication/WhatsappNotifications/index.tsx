import React, { useEffect, useMemo, useRef, useState } from "react";
import { ConfirmationModal, ModalContainerUpdated, OffCanvasContainer, SelectInput, TextInput } from "../../../Components/Common";
import TableContainer from "../../../Components/Common/TableContainer";
import { generateColumns } from "./helper";
import { UncontrolledTooltip } from 'reactstrap';
import ExportIcon from "../../../assets/imagesdps/common_icon/export_icon.svg";
import { useFormik } from "formik";
import { useHistory, useLocation } from "react-router-dom";
import { useModal } from "../../../hooks/modalhook";
import classnames from "classnames";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import AddUserDefinedTemplateModal from "../Settings/UserDefinedTemplate/AddUserDefinedTemplateModal";
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { getInstAcademicYearAct } from "../../../store/mastersettings/instacademics/instacademicactions";
import { generateActionPayload } from "../../../utility/reduxutility";
import { getCurriculumClassSectAct, getManageNotificationAct } from "../../../store/communication/communicationactions";
import { IPaginationState } from "../../../Components/Common/Pagination";
import ComposeModal from "./ComposeModal";
import WhatsappCampaignStats from "./WhatsappCampaignStats";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Delete02StrokeStandard,
  EyeIcon,
  FilterIcon,
  PencilEdit02Icon,
  SentIcon,
} from "@hugeicons-pro/core-stroke-standard";
import ViewWhatsappCampaign from "./ViewWhatsappCampaign";
import Button from "../../../Components/Common/Button";

const WhatsappNotifications = () => {
  const [filterState, setFilterState] = useState({
    searchString: "",
    academicYearId: "",
  });
  const { closeModal: closeManageAllNotifcationsModal, modalState: manageAllNotifcationState, openModal: openManageAllNotifcationsModal } = useModal();
  const { closeModal: closeCommunicationStatusLogsModal, modalState: communicationStatusLogState, openModal: openCommunicationStatusLogsModal } = useModal();
  const [open, setOpen] = useState<boolean>(false);

  const {
      openModal: addEditSportNameOpenModal,
      closeModal: addEditSportNameCloseModal,
      modalState: addEditSportNameModalState,
  } = useModal();
  
  const {
    openModal: viewWhatsappCampaignOpenModal,
    closeModal: viewWhatsappCampaignCloseModal,
    modalState: viewWhatsappCampaignModalState,
  } = useModal();

  const dispatch = useAppDispatch();
  const history = useHistory();
   const location = useLocation();
  const { showApiLoader, manageNotificationResp, currentInstIdResp: instituteId, currentBranchIdResp: branchId,
    academicYearListResp, communicationErrorResp,
  } = useAppSelector(({
    globalData, instAcademics, communication,
    appData }) => ({
      showApiLoader: globalData.showApiLoader,
      currentInstIdResp: appData.currentInstIdResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      academicYearListResp: instAcademics.academicYearListResp,
      manageNotificationResp: communication.manageNotificationResp,
      communicationErrorResp: communication.communicationErrorResp,
    }), shallowEqual);

  const paginationRef = useRef({
    pageNo: 0,
    pageSize: 10,
  });

  const toggleAdvanceFilter = () => {
    setOpen((prev) => !prev);
  };

  function getWhatsappNotificationApiCall(otherProps?: any) {
    const payload = {
      instituteId, branchId, searchString: filterState.searchString, ...otherProps, ...paginationRef.current,
      mode: 'WhatsApp',
      ...(location.pathname === "/hostel-whatsapp-notifications" && {
        module: "HOSTEL",
      }),
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
      getWhatsappNotificationApiCall();
    }
    if (branchId) {
      dispatch(getCurriculumClassSectAct(generateActionPayload("get_curriculum_class_section", undefined, {
        branchId
      })));
    }
  }, [branchId, instituteId]);

  const menuOptions = useMemo(
      () => [
        // {
        //   id: "send",
        //   actionIcon: (
        //     <HugeiconsIcon icon={SentIcon} className="text-muted" size={18} />
        //   ),
        //   actionName: "Send",
        //   onClickHndlr: (event: any) => {
        //     const id = event.currentTarget.getAttribute("data-id");
        //     addEditSportNameOpenModal(id);
        //   },
        // },
        // {
        //   id: "edit",
        //   actionIcon: (
        //     <HugeiconsIcon
        //       icon={PencilEdit02Icon}
        //       className="text-muted"
        //       size={18}
        //     />
        //   ),
        //   actionName: "Edit",
        //   onClickHndlr: (event: any) => {
        //     const id = event.currentTarget.getAttribute("data-id");
        //     addEditSportNameOpenModal(id);
        //   },
        // },
        {
          id: "view",
          actionIcon: (
            <HugeiconsIcon icon={EyeIcon} className="text-muted" size={18} />
          ),
          actionName: "View",
          onClickHndlr: (event: any) => {
            const id = event.currentTarget.getAttribute("data-id");
            viewWhatsappCampaignOpenModal(id);
          },
        },
      ],
      []
    );

  function paginationHndlr(paginationInfo: IPaginationState) {
    // Implement pagination logic if needed
    paginationRef.current = paginationInfo;
    getWhatsappNotificationApiCall();
  }

  function toggleModalHndlr() {
    closeManageAllNotifcationsModal();
    getWhatsappNotificationApiCall();
  }

  function onChangeFilterHndlr(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFilterState(prevState => ({ ...prevState, [name]: value }));
    getWhatsappNotificationApiCall({ searchString: value });
  }

  function redirectToComposeMessageHndlr() {
    const isHostelPage = location.pathname.includes(
      "/hostel-whatsapp-notifications"
    );

    history.push(
      isHostelPage
        ? "/hostel-whatsapp-notifications/compose"
        : "/whatsapp-notifications/compose"
    );
  }

  const columns = useMemo(() => generateColumns(menuOptions), []);
  const { data: notificationList, pageNumber, totalPages, totalElements } = manageNotificationResp || {};
  return (
    <>
      <div className="page-content free_payment_record_wrapper transportaion_dashboard_wrapper">
        <div className="container-fluid">
          <BreadCrumb title="Communication" pageTitle="Communication" />

          {/* <WhatsappCampaignStats /> */}

          <div className="tw-bg-white tw-rounded-xl tw-shadow-sm tw-border tw-border-gray-200 tw-mb-5">

            {/* Header */}
            <div className="tw-px-6 tw-py-4 tw-border-b tw-border-gray-200">
              <div className="tw-flex tw-items-center tw-justify-between">
                <h4 className="tw-text-lg tw-font-semibold tw-text-gray-800">
                  Whatsapp Notifications
                </h4>
              </div>
            </div>

            {/* Body */}
            <div className="tw-p-0">

              {/* Top Section */}
              <div className="tw-flex tw-flex-col lg:tw-flex-row 
                        tw-gap-4 
                        tw-items-start lg:tw-items-center 
                        tw-justify-between 
                        tw-px-6 tw-py-4">

                {/* Search */}
                <div className="tw-w-full lg:tw-max-w-xs tw-relative">
                  <div className="search-box">
                    <TextInput
                      name="searchString"
                      formgroupClassName="tw-mb-0"
                      placeHolder="Search..."
                      value={filterState.searchString}
                      onChange={onChangeFilterHndlr}
                    />
                    <i className="ri-search-line search-icon"></i>
                  </div>
                </div>

                {/* Button */}
                <Button
                  onClick={redirectToComposeMessageHndlr}
                  variant="primary"
                >
                  <i className="ri-add-line" />
                  Compose Message
                </Button>
              </div>

              {/* Table */}
              <div className="tw-px-6 tw-pb-6">
                <TableContainer
                  columns={columns}
                  data={Array.isArray(notificationList) ? notificationList : []}
                  tableClass="tw-mb-0"
                  divClass="tw-overflow-x-auto tw-mb-3"
                  theadClass="tw-table-light tw-text-gray-500 tw-align-middle"
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
      </ModalContainerUpdated>

      {/* <OffCanvasContainer
        isOpen={open}
        headerTitle="Advance Filters"
        closeHndlr={toggleAdvanceFilter}
        id="advance-filter-whatsapp-campaign"
      >
        <AdvanceFilterModal applyFilterHndlr={() => {}} isOpen={open} />
        <p>Children</p>
      </OffCanvasContainer> */}

      <ModalContainerUpdated
        id="view-whatsapp-campaign-modal"
        isOpen={viewWhatsappCampaignModalState.showModal}
        toggle={viewWhatsappCampaignCloseModal}
        modalTitle="View Whatsapp Campaign"
        modalSize="md"
      >
        <ViewWhatsappCampaign
          campaignId={viewWhatsappCampaignModalState.modalData}
        ></ViewWhatsappCampaign>
      </ModalContainerUpdated>
    </>
  );
};

export default WhatsappNotifications;
