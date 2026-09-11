import React, { useMemo, useEffect, useState, useRef, useCallback } from "react";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
// import { Card, CardBody, Col, Container, Row, CardHeader } from "reactstrap";
import { SelectInput, TextInput, ModalContainerUpdated, Button } from "../../../Components/Common";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { generateColumns } from "./helper";
import TableContainer from "../../../Components/Common/TableContainer";
import ChangeCampusModal from "./ChangeCampusModal";
import ChangeCampusConfirmModal from "./ChangeCampusConfirmModal";
import ChangeCampusLedgerModal from "./ChangeCampusLedgerModal";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
//Action Generator
import { generateActionPayload } from "../../../utility/reduxutility";
import {
  getInstAcademicYearAct,
} from "../../../store/mastersettings/instacademics/instacademicactions";
import {
  changeCampusListAct,
  exportChangeCampusAct
} from "../../../store/academic/academicRequest/academicrequestactions";
//Common Utility
import { debounce, downloadExcelFile, getSortingKeys } from "../../../utility/commonutility";
import { useModal } from "../../../hooks/modalhook";
import { HugeiconsIcon } from "@hugeicons/react";
import { CancelCircleIcon, CheckmarkCircle03StrokeStandard, Notebook01Icon } from "@hugeicons-pro/core-stroke-standard";
import { UncontrolledTooltip } from "reactstrap";
import ExportIcon from "../../../assets/imagesdps/common_icon/export_icon.svg";
import ExportModal from "../../Directory/StudentManagement/ExportModal";

const ChangeCampus = () => {
  const [changeCampusFilterState, setChangeCampusFilterState] =
    useState({
      academicYearId: "",
      searchString: ""
    });
  const { modalState: apprRejModalState, closeModal: closeApprRejModalHndlr,
    openModal: openApprRejModalHndlr
  } = useModal();
  const { modalState: ledgerModalState, closeModal: closeLedgerModalHndlr,
    openModal: openLedgerModalHndlr
  } = useModal();
  const { closeModal: closeExportLoginHistoryModalHnldr,
    openModal: openExportLoginHistoryModalHnldr, modalState: exportLoginHistoryModalState } = useModal();

  const [changeCampusModalState, setChangeCampusModalState] =
    useState({
      showModal: false,
      changeCampusId: "",
      modalData: undefined
    });
  const paginationDetailRef = useRef<any>({
    pageNo: 0,
    pageSize: 10,
  });

const isFeeModule = location.pathname === "/fee-change-campus";
  const dispatch = useAppDispatch();
  const {
    currentInstIdResp: instituteId, currentBranchIdResp: branchId,
    academicYearListResp, changeCampusListResp, academicRequestErrorResp,
    loggedInUserRole,
    exportChangeCampusResp
  } =
    useAppSelector(({ appData, instAcademics, academicRequest }) => ({
      currentInstIdResp: appData.currentInstIdResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      academicYearListResp: instAcademics.academicYearListResp,
      changeCampusListResp: academicRequest.changeCampusListResp,
      loggedInUserRole: appData.loggedInUserRole,
      academicRequestErrorResp: academicRequest.academicRequestErrorResp,
      exportChangeCampusResp: academicRequest.exportChangeCampusResp
    }), shallowEqual);

  const changeCampusResp = useRef({
    prevAcademicYearListResp: academicYearListResp,
    prevAcademicRequestErrorResp: academicRequestErrorResp,
    prevExportChangeCampusResp: exportChangeCampusResp,
  });

  useEffect(() => {
    const { prevAcademicYearListResp, prevAcademicRequestErrorResp, prevExportChangeCampusResp } = changeCampusResp.current;
    if (academicYearListResp && prevAcademicYearListResp !== academicYearListResp) {
      const academicYearInfo = academicYearListResp.data.find((year: any) => year.yearStatus === "CURRENT");
      if (academicYearInfo?.academicYearId) {
        setChangeCampusFilterState((prevState) => ({
          ...prevState, academicYearId:
            academicYearInfo?.academicYearId
        }));
        getChangeCampusApiCall({ academicYearId: academicYearInfo?.academicYearId })
      }
    } else if (academicRequestErrorResp && prevAcademicRequestErrorResp !== academicRequestErrorResp) {
      const { message }: any = academicRequestErrorResp;
      toast.error(message || "Something went wrong.");
    }
    else if (exportChangeCampusResp && exportChangeCampusResp !== prevExportChangeCampusResp) {
      toast.success(" Exported successfully");
      closeExportLoginHistoryModalHnldr()
      downloadExcelFile(exportChangeCampusResp, "export_change_campus");
    }
    changeCampusResp.current.prevAcademicYearListResp = academicYearListResp;
    changeCampusResp.current.prevAcademicRequestErrorResp = academicRequestErrorResp;
    changeCampusResp.current.prevExportChangeCampusResp = exportChangeCampusResp;
  }, [academicYearListResp, academicRequestErrorResp, exportChangeCampusResp]);

  const canCreateAndUpdate = useMemo(() => {
    return loggedInUserRole !== 'ACCOUNT' && loggedInUserRole !== 'ACCOUNT_HEAD'
  }, [loggedInUserRole]);

  useEffect(() => {
    const { data } = academicYearListResp || {};
    if (Array.isArray(data) && data.length > 0) {
      let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.isAdmissionDefault)?.academicYearId
      setChangeCampusFilterState((prev: any) => ({ ...prev, academicYearId: yearId }))
      getChangeCampusApiCall({ academicYearId: yearId })
    }
  }, [academicYearListResp]);

  const toggleChangeCampusModal = (apiCall?: any) => {
    setChangeCampusModalState((prevState) => ({
      ...prevState,
      showModal: !prevState.showModal,
    }));
    if (typeof apiCall === "boolean" && apiCall) {
      getChangeCampusApiCall();
    }
  };

  const menuOptions = useMemo(
    () => {
      const actions = [
        {
          id: "viewLedger",
          actionIcon: <HugeiconsIcon icon={Notebook01Icon} className="me-2 text-muted" size={18} />,
          actionName: "View Ledger",
          onClickHndlr: (event: any) => {
            const changeCampusId = event.currentTarget.getAttribute("data-id");
            const { content } = changeCampusListResp;
            if (changeCampusId && Array.isArray(content)) {
              const campusInfo = content.find(item => item.id?.toString() === changeCampusId?.toString());
              openLedgerModalHndlr(campusInfo);
            }
          },
        },
        {
          id: "approve",
          actionIcon: <HugeiconsIcon icon={CheckmarkCircle03StrokeStandard} className="me-2 text-success" size={18} />,
          actionName: "Approve",
          onClickHndlr: (event: any) => {
            const changeCampusId = event.currentTarget.getAttribute("data-id");
            openApprRejModalHndlr({ modalType: "APPROVED", changeCampusId });
          },
        },
        {
          id: "reject",
          actionIcon: <HugeiconsIcon icon={CancelCircleIcon} className="me-2 text-danger" size={18} />,
          actionName: "Reject",
          onClickHndlr: (event: any) => {
            const changeCampusId = event.currentTarget.getAttribute("data-id");
            openApprRejModalHndlr({ modalType: "REJECTED", changeCampusId });
          },
        },
      ]
      if (canCreateAndUpdate) {
        return actions;
      }
      return actions.filter(item => item.id === 'viewLedger');
    },
    [changeCampusListResp, canCreateAndUpdate]
  );


  function search(value: string) {
    getChangeCampusApiCall({ searchString: value });
  }
  const debounceFun = useCallback(debounce(search, 200), [changeCampusListResp]);
  function onChangeFilterHndlr(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setChangeCampusFilterState(prevState => ({ ...prevState, [name]: value }));
    paginationDetailRef.current.pageNo = 0;
    debounceFun(value);
  }

  function getChangeCampusApiCall(otherProps?: any) {
    const payload = {
      branchId, ...changeCampusFilterState, ...otherProps,
      // changeCampusStatus: "PENDING,APPROVED,REJECTED,ON_HOLD",
      ...paginationDetailRef.current
    };
    dispatch(changeCampusListAct(generateActionPayload("get_change_campus", undefined, payload)));
  }

  function paginationHndlr(paginationInfo: any) {
    paginationDetailRef.current = paginationInfo;
    getChangeCampusApiCall(paginationInfo);
  }

  const filterHndler = (event: any) => {
    const { name, value } = event.target;

    setChangeCampusFilterState((prevState: any) => ({
      ...prevState,
      [name]: value
    }))
    getChangeCampusApiCall({ academicYearId: value })
  }

  const toggleChangeCampusConfirmModal = (apiCall?: any, modalInfo?: any) => {
    closeApprRejModalHndlr();
    if (typeof apiCall === "boolean" && apiCall) {
      const { content } = changeCampusListResp,
        { changeCampusId, modalType } = modalInfo || {};
      if (modalType === "APPROVED" && changeCampusId && Array.isArray(content)) {
        const campusInfo = content.find(item => item.id?.toString() === changeCampusId?.toString());
        openLedgerModalHndlr(campusInfo);
      }
      getChangeCampusApiCall();
    }
  };

  function toggleLedgerModalHndlr(apiCall?: boolean) {
    if (typeof apiCall === "boolean" && apiCall) {
      getChangeCampusApiCall();
    }
    closeLedgerModalHndlr();
  }

  function submitExportHndlr() {
    const payload = {
      branchId,
      ...changeCampusFilterState,
    };
    dispatch(exportChangeCampusAct(generateActionPayload('export_change_campus', undefined, payload, {
      responseType: 'blob'
    })))
  }

  const roleColumns = useMemo(() => generateColumns(menuOptions, isFeeModule), [changeCampusListResp, isFeeModule]),
    { content: changeCampusList, pageNumber, totalPages, totalElements } = changeCampusListResp || {};
  return (
    <>
      <div className="page-content">
                <div className="container-fluid">
        <BreadCrumb title="Change Campus" pageTitle={isFeeModule ? "Fee" : "Admissions"} />

        <div className="tw-bg-white tw-rounded-lg tw-shadow-sm tw-overflow-hidden tw-mb-5">
          <div className="tw-px-6 tw-py-4 tw-border-b tw-border-gray-200">
            <div className="tw-flex tw-items-center tw-justify-between">
              <h4 className="card-title !tw-mb-0 tw-flex-grow tw-justify-center">Change Campus</h4>
              <div className="tw-flex tw-items-center tw-gap-2">
                {!isFeeModule && canCreateAndUpdate && (
                  <Button
                    variant="primary"
                    onClick={toggleChangeCampusModal}
                  >
                    <i className="ri-add-line tw-mr-2" />
                    Add Request
                  </Button>
                )}
                <Button
                  id="export-btn"
                  variant="exportBtn"
                  onClick={openExportLoginHistoryModalHnldr}
                >
                  <img src={ExportIcon} alt="Export" className="tw-h-5 tw-w-5" />
                  <UncontrolledTooltip placement="bottom" target="export-btn">
                    Export
                  </UncontrolledTooltip>
                </Button>
              </div>
            </div>
          </div>

          <div className="tw-p-0">
            <div className="tw-py-4 tw-px-6 tw-bg-gray-50/50">
              <div className="tw-grid tw-grid-cols-12 tw-gap-4">
                <div className="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-3">
                  <div className="tw-relative search-box">
                    <TextInput
                      name="searchString"
                      value={changeCampusFilterState.searchString}
                      onChange={onChangeFilterHndlr}
                      formgroupClassName="tw-mb-0"
                      placeHolder="Search..."
                      labelText="Search"
                      floatingLabel
                      inputClassName="tw-pl-10"
                    />
                    <i className="ri-search-line tw-absolute tw-left-3 tw-top-1/2 tw-transform tw--translate-y-1/2 tw-text-gray-400"></i>
                  </div>
                </div>
                <div className="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-2">
                  <SelectInput
                    name="academicYearId"
                    value={changeCampusFilterState.academicYearId}
                    onChange={filterHndler}
                    menuItems={academicYearListResp?.data || []}
                    valueKey="academicYearId"
                    textKey="academicYearName"
                    labelText="Academic Year"
                    floatingLabel
                    formgroupClassName="tw-mb-0"
                  />
                </div>
              </div>
            </div>

            <div className="tw-px-0">
              <TableContainer
                columns={roleColumns || []}
                data={Array.isArray(changeCampusList) ? changeCampusList : []}
                divClass="table-responsive tw-mb-3"
                theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
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
        id="changecampus-modal"
        isOpen={changeCampusModalState.showModal}
        toggle={toggleChangeCampusModal}
        modalTitle={changeCampusModalState.changeCampusId ? "Update Change Campus" : "Add Change Campus"}
      >
        <ChangeCampusModal
          toggle={toggleChangeCampusModal}
          isOpen={changeCampusModalState.showModal}
          branchId={branchId}
          instituteId={instituteId}
          academicYearId={changeCampusFilterState.academicYearId}
          editChangeCampusDetails={changeCampusModalState?.modalData}
        />
      </ModalContainerUpdated>
      <ModalContainerUpdated
        id="change-campus-ledger-modal"
        isOpen={ledgerModalState.showModal}
        toggle={closeLedgerModalHndlr}
        modalTitle="Ledger Details"
        modalSize="xl"
      >
        <ChangeCampusLedgerModal
          toggle={toggleLedgerModalHndlr}
          campusInfo={ledgerModalState.modalData}
        />
      </ModalContainerUpdated>
      <ModalContainerUpdated
        id="change-campus-confirm-modal"
        isOpen={apprRejModalState.showModal}
        toggle={closeApprRejModalHndlr}
        modalTitle="Change Campus"
        modalSize="md"
        hideHeader={true}

      >
        <ChangeCampusConfirmModal
          toggle={toggleChangeCampusConfirmModal}
          modalData={apprRejModalState.modalData}
          isCurrentCampus={true}
        />
      </ModalContainerUpdated>

      <ModalContainerUpdated
        id="export-login-history-modal"
        isOpen={exportLoginHistoryModalState.showModal}
        toggle={closeExportLoginHistoryModalHnldr}
        modalTitle="Export Change Campus Details"
        modalSize="md"
      >
        <ExportModal
          isOpen={exportLoginHistoryModalState.showModal}
          toggle={closeExportLoginHistoryModalHnldr}
          instituteId={instituteId}
          branchId={branchId}
          submitHndlr={submitExportHndlr}
          feature="admission"
          subFeature="campus_change_or_transfer"
          remarksText="Enter remarks to export the change campus details?"
        />
      </ModalContainerUpdated>
    </>
  );
};

export default ChangeCampus;
