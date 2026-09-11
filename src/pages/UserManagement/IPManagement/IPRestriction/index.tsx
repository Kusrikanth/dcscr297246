import React, { useEffect, useMemo, useRef, useState } from "react";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import TableContainer from "../../../../Components/Common/TableContainer";
import { default as EditSvg } from "../../../../assets/imagesdps/academics/EditSvg.svg?react";
import { generateColumns } from "./helper";
import {
  ConfirmationModal,
  ModalContainerUpdated,
} from "../../../../Components/Common";
import AddRestriction from "./addRestriction";
import { useModal } from "../../../../hooks/modalhook";
import { UncontrolledTooltip } from "reactstrap";
import ExportIcon from "../../../../assets/imagesdps/common_icon/export_icon.svg";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { deleteIPRestrictionAct, exportIPRestrictionAct, getIPRestrictionAct } from "../../../../store/usermanagement/usermanagementactions";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { shallowEqual } from "react-redux";
import { IPaginationState } from "../../../../Components/Common/Pagination";
import { toast } from "react-toastify";
import ExportModal from "../../../Directory/StudentManagement/ExportModal";
import { downloadExcelFile } from "../../../../utility/commonutility";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02StrokeStandard, PencilEdit02Icon } from "@hugeicons-pro/core-stroke-standard";
import Button from "../../../../Components/Common/Button";

const IPRestriction = () => {

  const { closeModal: closeExportLoginHistoryModalHnldr,
    openModal: openExportLoginHistoryModalHnldr, modalState: exportLoginHistoryModalState } = useModal();

  const dispatch = useAppDispatch()
  const paginationDetailRef = useRef<IPaginationState>({
    pageNo: 0,
    pageSize: 10,
  });
  const {
    closeModal: closeAddIPRestriction,
    openModal: openAddIPRestriction,
    modalState: addIPRestriction,
  } = useModal();

  const {
    closeModal: closeDeleteIPRestriction,
    openModal: openDeleteIPRestriction,
    modalState: deleteIPRestriction,
  } = useModal();

  const loginUserApiCall = (otherProps?: any) => {
    let payload = {
      branchId,
      ...otherProps,
      ...paginationDetailRef.current,

    };
    dispatch(getIPRestrictionAct(generateActionPayload('get_ip_restriction', undefined, payload)))
  }

  const {
    academicYearListResp,
    brchCurriculumResp,
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    brchClassCurriculumResp,
    showApiLoader,
    getIPRestrictionResp,
    deleteIPRestrictionResp,
    userManagementErrorResp,
    exportIPRestrictionResp,
    saveIPRestrictionResp,
    upadteIPRestrictionResp,


  } = useAppSelector(
    ({ instAcademics, branchAcademics, appData, applicationSale, userManagement, globalData }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      brchClassCurriculumResp: applicationSale.brchClassCurriculumResp,
      showApiLoader: globalData.showApiLoader,
      getIPRestrictionResp: userManagement.getIPRestrictionResp,
      deleteIPRestrictionResp: userManagement.deleteIPRestrictionResp,
      userManagementErrorResp: userManagement.userManagementErrorResp,
      exportIPRestrictionResp: userManagement.exportIPRestrictionResp,
      saveIPRestrictionResp: userManagement.saveIPRestrictionResp,
      upadteIPRestrictionResp: userManagement.upadteIPRestrictionResp,
    }),
    shallowEqual
  );

  const loginHistoryRef = useRef<any>({
    prevUserManagementErrorResp: userManagementErrorResp,
    prevDeleteIPRestrictionResp: deleteIPRestrictionResp,
    prevExportIPRestrictionResp: exportIPRestrictionResp,
    prevSaveIPRestrictionResp: saveIPRestrictionResp,
    prevUpadteIPRestrictionResp: upadteIPRestrictionResp,

  });

  useEffect(() => {
    const { prevUserManagementErrorResp, prevDeleteIPRestrictionResp, prevExportIPRestrictionResp, prevSaveIPRestrictionResp, prevUpadteIPRestrictionResp } =
      loginHistoryRef.current;
    if (userManagementErrorResp && userManagementErrorResp !== prevUserManagementErrorResp) {
      const { details } = userManagementErrorResp || {}
      toast.error(details || "Something went wrong");
    }
    else if (deleteIPRestrictionResp && deleteIPRestrictionResp !== prevDeleteIPRestrictionResp) {
      toast.success("IP Restriction deleted successfully");
      closeDeleteIPRestriction()
      loginUserApiCall();
    }
    else if (exportIPRestrictionResp && exportIPRestrictionResp !== prevExportIPRestrictionResp) {
      toast.success("IP Restriction exported successfully");
      closeExportLoginHistoryModalHnldr()
      loginUserApiCall();
      downloadExcelFile(exportIPRestrictionResp, "IP_Restriction");
    }
    else if (saveIPRestrictionResp && saveIPRestrictionResp !== prevSaveIPRestrictionResp) {
      toast.success("IP Restriction saved successfully");
      closeAddIPRestriction()
      loginUserApiCall();
    }
    else if (upadteIPRestrictionResp && upadteIPRestrictionResp !== prevUpadteIPRestrictionResp) {
      toast.success("IP Restriction updated successfully");
      closeAddIPRestriction()
      loginUserApiCall();
    }
    loginHistoryRef.current.prevUserManagementErrorResp = userManagementErrorResp;
    loginHistoryRef.current.prevDeleteIPRestrictionResp = deleteIPRestrictionResp;
    loginHistoryRef.current.prevExportIPRestrictionResp = exportIPRestrictionResp;
    loginHistoryRef.current.prevSaveIPRestrictionResp = saveIPRestrictionResp;
    loginHistoryRef.current.prevUpadteIPRestrictionResp = upadteIPRestrictionResp;
  }, [userManagementErrorResp, deleteIPRestrictionResp, exportIPRestrictionResp, saveIPRestrictionResp, upadteIPRestrictionResp]);

  const menuOptions = useMemo(
    () => [
      {
        id: "edit",
        actionIcon: <HugeiconsIcon icon={PencilEdit02Icon} className="tw-text-gray-500" size={18} />,
        actionName: "Edit",
        onClickHndlr: (event: React.MouseEvent<HTMLElement>) => {
          const id = event.currentTarget.getAttribute("data-id");
          openAddIPRestriction(id);
        },
      },
      {
        id: "delete",
        actionIcon: <HugeiconsIcon icon={Delete02StrokeStandard} className="tw-text-red-500" size={18} />,
        actionName: "Delete",
        onClickHndlr: (event: React.MouseEvent<HTMLElement>) => {
          const id = event.currentTarget.getAttribute("data-id");
          openDeleteIPRestriction(id);
        },
      },
    ],
    []
  );

  useEffect(() => {
    loginUserApiCall();
  }, []);
  const deleteHandler = () => {
    dispatch(
      deleteIPRestrictionAct(
        generateActionPayload("delete_ip_restriction", {
          id: deleteIPRestriction.modalData,
        })
      )
    );
  };

  function submitExportHndlr() {
    const payload = {
      branchId,
    };
    dispatch(exportIPRestrictionAct(generateActionPayload('export_ip_restriction', undefined, payload, {
      responseType: 'blob'
    })))
  }


  function paginationHndlr(paginationInfo: IPaginationState) {
    paginationDetailRef.current = paginationInfo;
    loginUserApiCall(paginationInfo);
  }
  const columns = useMemo(() => generateColumns(menuOptions), []);
  const { data: IPRestriction, totalPages, pageNumber, totalElements: totalRecords } = getIPRestrictionResp || {};


  return (
    <>
      <div className="page-content">
        <div className="container-fluid">
          <BreadCrumb pageTitle="User Management"></BreadCrumb>
          <div className="tw-bg-white tw-rounded-lg tw-shadow-sm tw-mb-6">
            <div className="tw-border-b tw-px-4 tw-py-4">
              <div className="tw-flex tw-items-center tw-justify-between">
                <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                  IP Restriction
                </h4>
                <div className="tw-flex tw-items-center tw-gap-2">
                  <Button
                    type="button"
                    variant="primary"
                    onClick={() => openAddIPRestriction()}
                    className="tw-flex tw-items-center"
                  >
                    <i className="ri-add-line tw-mr-2" />
                    Add New
                  </Button>
                  <Button
                    type="button"
                    variant="exportBtn"
                    onClick={openExportLoginHistoryModalHnldr}
                    id="export-btn"
                    className="!tw-p-2"
                  >
                    <img src={ExportIcon} className="tw-h-5 tw-w-5" />
                  </Button>
                  <UncontrolledTooltip placement="bottom" target="export-btn">
                    Export
                  </UncontrolledTooltip>
                </div>
              </div>
            </div>
            <div className="">
              <TableContainer
                columns={columns || []}
                data={IPRestriction || []}
                tableClass="tw-mb-0"
                divClass="tw-overflow-x-auto tw-mb-3"
                theadClass="tw-bg-gray-100 tw-text-gray-600 tw-align-middle"
                showCheckbox={false}
                showPagination={true}
                totalPages={totalPages}
                totalRecords={totalRecords}
                callbackPaginationHndlr={paginationHndlr}
                currentPageNumber={pageNumber}
              />
            </div>
          </div>
        </div>
      </div>

      <ModalContainerUpdated
        id="add-restriction-modal"
        isOpen={addIPRestriction.showModal}
        toggle={closeAddIPRestriction}
        modalTitle={`${addIPRestriction.modalData ? "Update" : "Add"} IP Restriction`}
        modalSize="md"
      >
        <AddRestriction toggle={closeAddIPRestriction}
          modalData={addIPRestriction.modalData}
        ></AddRestriction>
      </ModalContainerUpdated>

      <ConfirmationModal
        id="delete-ip-restriction"
        isOpen={deleteIPRestriction.showModal}
        confirmMessage="Are you sure you want to Remove the IP Restriction"
        cancelHndlr={() => closeDeleteIPRestriction()}
        confirmHndlr={deleteHandler}
        showImgIcon={true}
        iconType="reject"
      ></ConfirmationModal>
      <ModalContainerUpdated
        id="export-login-history-modal"
        isOpen={exportLoginHistoryModalState.showModal}
        toggle={closeExportLoginHistoryModalHnldr}
        modalTitle="Export Ip Restriction Details"
        modalSize="md"
      >
        <ExportModal
          isOpen={exportLoginHistoryModalState.showModal}
          toggle={closeExportLoginHistoryModalHnldr}
          instituteId={instituteId}
          branchId={branchId}
          submitHndlr={submitExportHndlr}
          feature="user_management"
          subFeature="ip_restriction"
          remarksText="Enter remarks to export IP Restriction?"
        />
      </ModalContainerUpdated>
    </>
  );
};

export default IPRestriction;
