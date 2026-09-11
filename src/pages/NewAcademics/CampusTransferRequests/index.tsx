import React, { useMemo, useEffect, useState, useRef, useCallback } from "react";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import { Card, CardBody, Col, Container, Row, CardHeader } from "reactstrap";
import { SelectInput, TextInput, ModalContainerUpdated } from "../../../Components/Common";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { generateColumns } from "./helper";
import TableContainer from "../../../Components/Common/TableContainer";
import ChangeCampusConfirmModal from "../ChangeCampus/ChangeCampusConfirmModal";
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
import LedgerModal from "./LedgerModal";
import { HugeiconsIcon } from "@hugeicons/react";
import { CancelCircleIcon, CheckmarkCircle03StrokeStandard, Notebook01Icon } from "@hugeicons-pro/core-stroke-standard";
import { UncontrolledTooltip } from "reactstrap";
import ExportIcon from "../../../assets/imagesdps/common_icon/export_icon.svg";
import ExportModal from "../../Directory/StudentManagement/ExportModal";
import Button from "../../../Components/Common/Button";

const CampusTransferRequests = () => {
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


  const paginationDetailRef = useRef<any>({
    pageNo: 0,
    pageSize: 10,
  });


  const dispatch = useAppDispatch();
  const {
    currentInstIdResp: instituteId, currentBranchIdResp: branchId,
    loggedInUserRole,
    academicYearListResp, changeCampusListResp, academicRequestErrorResp, exportChangeCampusResp
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
      const { details }: any = academicRequestErrorResp;
      toast.error(details || "Something went wrong.");
    }
    else if (exportChangeCampusResp && exportChangeCampusResp !== prevExportChangeCampusResp) {
      toast.success(" Exported successfully");
      closeExportLoginHistoryModalHnldr()
      downloadExcelFile(exportChangeCampusResp, "export_campus_transfer_requests");
    }
    changeCampusResp.current.prevAcademicYearListResp = academicYearListResp;
    changeCampusResp.current.prevAcademicRequestErrorResp = academicRequestErrorResp;
    changeCampusResp.current.prevExportChangeCampusResp = exportChangeCampusResp;
  }, [academicYearListResp, academicRequestErrorResp, exportChangeCampusResp]);

  const canCreateAndUpdate = useMemo(() => {
    return loggedInUserRole !== 'ACCOUNT' && loggedInUserRole !== 'ACCOUNT_HEAD'
  }, [loggedInUserRole]);

  useEffect(() => {
    if (instituteId) {
      const payload = { instituteId, sortBy: "academicYearName", orderBy: "desc", pageNo: 0, pageSize: 20 };
      dispatch(getInstAcademicYearAct(generateActionPayload("get_inst_academic_year", undefined, payload)));
    }
  }, [instituteId]);

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
    [canCreateAndUpdate, changeCampusListResp]
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
      newBranchId: branchId, ...changeCampusFilterState, ...otherProps,
      changeCampusStatus: "APPROVED",
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

  const toggleChangeCampusConfirmModal = (apiCall?: any, modalInfo?: any, apprRejCampusResp?: any) => {
    closeApprRejModalHndlr();
    if (typeof apiCall === "boolean" && apiCall) {
      const { content } = changeCampusListResp,
        { changeCampusId, modalType } = modalInfo || {};
      if (modalType === "APPROVED" && changeCampusId && Array.isArray(content)) {
        const campusInfo = content.find(item => item.id?.toString() === changeCampusId?.toString());
        const updatedCampusInfo = {
          ...campusInfo,
          newStudentId: apprRejCampusResp?.newStudentId,
          newStudentCode: apprRejCampusResp?.newStudentCode
        };
        openLedgerModalHndlr(updatedCampusInfo);
      }
      getChangeCampusApiCall();
    }
  };

  const toggleLedgerModalHndlr = (apiCall?: any) => {
    closeLedgerModalHndlr();
    if (typeof apiCall === "boolean" && apiCall) {
      getChangeCampusApiCall();
    }
  };
  function submitExportHndlr() {
    const payload = {
      newBranchId: branchId,
      ...changeCampusFilterState,
      changeCampusStatus: "APPROVED",

    };
    dispatch(exportChangeCampusAct(generateActionPayload('export_change_campus', undefined, payload, {
      responseType: 'blob'
    })))
  }


  const roleColumns = useMemo(() => generateColumns(menuOptions), [changeCampusListResp]),
    { content: changeCampusList, pageNumber, totalPages, totalElements } = changeCampusListResp || {};
  return (
    <>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Change Campus" pageTitle="Admissions" />

          <Card>
            <CardHeader>
              <div className="tw-flex tw-flex-col lg:tw-flex-row tw-items-center tw-gap-2">
                <div className="tw-flex-grow">
                  <h4 className="card-title !tw-mb-0 tw-flex-grow tw-justify-center">
                    Campus Transfer Request
                  </h4>
                </div>
                <div className="tw-w-auto tw-ml-auto">
                  <Button
                    id="export-btn"
                    variant="exportBtn"
                    onClick={openExportLoginHistoryModalHnldr}
                  >
                    <img src={ExportIcon} className="tw-object-contain tw-h-full" />
                    <UncontrolledTooltip placement="bottom" target="export-btn">
                      Export
                    </UncontrolledTooltip>
                  </Button>
                </div>
              </div>
            </CardHeader>

            <div className="tw-p-0">
              <div className="tw-py-3 tw-px-3">
                <div className="tw-grid tw-grid-cols-12 tw-gap-3">
                  <div className="lg:tw-col-span-3 xl:tw-col-span-3">
                    <div className="search-box tw-relative">
                      <TextInput
                        name="searchString"
                        value={changeCampusFilterState.searchString}
                        onChange={onChangeFilterHndlr}
                        // inputClassName="bg-light"
                        formgroupClassName="tw-mb-0"
                        placeHolder="Search..."
                        labelText="Search"
                        floatingLabel
                      />

                      <i className="ri-search-line tw-absolute tw-left-3 tw-top-1/2 tw-transform tw--translate-y-1/2 tw-text-gray-400"></i>
                    </div>
                  </div>
                  <div className="lg:tw-col-span-2 xl:tw-col-span-2">
                    <SelectInput
                      name="academicYearId"
                      value={changeCampusFilterState.academicYearId}
                      onChange={filterHndler}
                      menuItems={academicYearListResp?.data || []}
                      valueKey="academicYearId"
                      textKey="academicYearName"
                      // inputClassName="bg-light"
                      labelText="Academic Year"
                      floatingLabel
                      formgroupClassName="tw-mb-0"
                    // isDisabled={true}
                    />
                  </div>
                </div>
              </div>

              <TableContainer
                columns={roleColumns || []}
                data={Array.isArray(changeCampusList) ? changeCampusList : []}
                divClass="tw-overflow-x-auto tw-mb-3"
                theadClass="tw-bg-gray-100 tw-text-gray-600 tw-align-middle"
                showPagination={true}
                totalPages={totalPages}
                totalRecords={totalElements}
                callbackPaginationHndlr={paginationHndlr}
                currentPageNumber={pageNumber}
              />
            </div>
          </Card>
        </Container>
      </div>
      <ModalContainerUpdated
        id="change-campus-ledger-modal"
        isOpen={ledgerModalState.showModal}
        toggle={closeLedgerModalHndlr}
        modalTitle="Ledger Details"
        modalSize="xl"
      >
        <LedgerModal
          toggle={toggleLedgerModalHndlr}
          campusInfo={ledgerModalState.modalData}
        />
      </ModalContainerUpdated>
      <ModalContainerUpdated
        id="change-campus-confirm-modal"
        isOpen={apprRejModalState.showModal}
        toggle={toggleChangeCampusConfirmModal}
        modalTitle="Change Campus"
        modalSize="md"
        hideHeader={true}
      >
        <ChangeCampusConfirmModal
          toggle={toggleChangeCampusConfirmModal}
          modalData={apprRejModalState.modalData}
          isCurrentCampus={false}
        />
      </ModalContainerUpdated>
      <ModalContainerUpdated
        id="export-login-history-modal"
        isOpen={exportLoginHistoryModalState.showModal}
        toggle={closeExportLoginHistoryModalHnldr}
        modalTitle="Export Campus Change or Transfer Details"
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
          remarksText="Enter remarks to export campus change or transfer details?"
        />
      </ModalContainerUpdated>
    </>
  );
};

export default CampusTransferRequests;
