import React, { useEffect, useMemo, useRef } from "react";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  Delete02StrokeStandard,
  PencilEdit02Icon,
} from "@hugeicons-pro/core-stroke-standard";

import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import {
  deletePreparatoryDomainAct,
  getPreparatoryDomainAct,
} from "../../../../../../store/examination/examinationsettings/examinationsettingsaction";
import DisplayOrderModal from "./DisplayOrderModal";
import { generateColumns } from "./helper";
import BreadCrumb from "../../../../../../Components/Common/BreadCrumb";
import TableContainer from "../../../../../../Components/Common/TableContainer";
import {
  ConfirmationModal,
  ModalContainerUpdated,
} from "../../../../../../Components/Common";
import { useModal } from "../../../../../../hooks/modalhook";
import { generateActionPayload } from "../../../../../../utility/reduxutility";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../../../hooks/storehook";
import AddEditNewPreparatoryModal from "./AddEditNewPreparatoryModal";

const PreparatoryDomains = () => {
  const {
    openModal: addEditSportNameOpenModal,
    closeModal: addEditSportNameCloseModal,
    modalState: addEditSportNameModalState,
  } = useModal();
  const {
    openModal: delSportsNameOpenModal,
    closeModal: delSportsNameCloseModal,
    modalState: delSportsNameModalState,
  } = useModal();

  const {
    closeModal: closeDisplayOrderModal,
    modalState: displayOrderModalState,
    openModal: openDisplayOrderModal,
  } = useModal();
  const dispatch = useAppDispatch();

  const {
    currentBranchIdResp: branchId,
    getPreparatoryDomainResp,
    savePreparatoryDomainResp,
    updatePreparatoryDomainResp,
    savePreparatoryDomainOrderResp,
    cbseExaminationErrorAct,
    deletePreparatoryDomainResp,
    loggedInUserRole,
    virtualRoleResp,
  } = useAppSelector(
    ({ appData, examinationSettings }) => ({
      currentBranchIdResp: appData.currentBranchIdResp,
      getPreparatoryDomainResp: examinationSettings.getPreparatoryDomainResp,
      savePreparatoryDomainResp: examinationSettings.savePreparatoryDomainResp,
      updatePreparatoryDomainResp: examinationSettings.updatePreparatoryDomainResp,
      savePreparatoryDomainOrderResp: examinationSettings.savePreparatoryDomainOrderResp,
      cbseExaminationErrorAct: examinationSettings.cbseExaminationErrorAct,
      deletePreparatoryDomainResp: examinationSettings.deletePreparatoryDomainResp,
      loggedInUserRole: appData.loggedInUserRole,
      virtualRoleResp: appData.virtualRoleResp,
    }),
    shallowEqual
  );
  const showInstituteAdminUI =
    loggedInUserRole === "INSTITUTE_ADMIN" && !virtualRoleResp;

  const menuOptions = useMemo(
    () => [
      {
        id: "edit",
        actionIcon: (
          <HugeiconsIcon
            icon={PencilEdit02Icon}
            className="text-muted"
            size={18}
          />
        ),
        actionName: "Edit",
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute("data-id");
          addEditSportNameOpenModal(id);
        },
      },
      {
        id: "delete",
        actionIcon: (
          <HugeiconsIcon
            icon={Delete02StrokeStandard}
            className="text-danger"
            size={18}
          />
        ),
        actionName: "Delete",
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute("data-id");
          delSportsNameOpenModal(id);
        },
      },
    ],
    []
  );

  const getHolisticDomainApiCall = (otherProps?: any) => {
    dispatch(
      getPreparatoryDomainAct(
        generateActionPayload("get_preparatory_domain", undefined, {})
      )
    );
  };
  function delSportNameItemHndlr() {
    dispatch(
      deletePreparatoryDomainAct(
        generateActionPayload("delete_preparatory_domain", {
          id: delSportsNameModalState.modalData,
        })
      )
    );
  }

  const sportsNamesRef = useRef({
    prevSavePreparatoryDomainResp: savePreparatoryDomainResp,
    prevUpdatePreparatoryDomainResp: updatePreparatoryDomainResp,
    prevSavePreparatoryDomainOrderResp: savePreparatoryDomainOrderResp,
    prevCbseExaminationErrorAct: cbseExaminationErrorAct,
    prevDeletePreparatoryDomainResp: deletePreparatoryDomainResp,
  });

  useEffect(() => {
    const {
      prevSavePreparatoryDomainResp,
      prevUpdatePreparatoryDomainResp,
      prevSavePreparatoryDomainOrderResp,
      prevCbseExaminationErrorAct,
      prevDeletePreparatoryDomainResp,
    } = sportsNamesRef.current;

    if (
      savePreparatoryDomainResp &&
      savePreparatoryDomainResp !== prevSavePreparatoryDomainResp
    ) {
      toast.success("Domain Name added successfully");
      getHolisticDomainApiCall();
      addEditSportNameCloseModal();
    } else if (
      updatePreparatoryDomainResp &&
      updatePreparatoryDomainResp !== prevUpdatePreparatoryDomainResp
    ) {
      toast.success("Domain Name updated successfully");
      getHolisticDomainApiCall();
      addEditSportNameCloseModal();
    } else if (
      savePreparatoryDomainOrderResp &&
      savePreparatoryDomainOrderResp !== prevSavePreparatoryDomainOrderResp
    ) {
      toast.success("Domain Order updated successfully");
    //   delSportsNameCloseModal();
      closeDisplayOrderModal()
      getHolisticDomainApiCall();
    } else if (
      cbseExaminationErrorAct &&
      cbseExaminationErrorAct !== prevCbseExaminationErrorAct
    ) {
      const { details } = cbseExaminationErrorAct;
      toast.error(details || "Something went wrong");
    } else if (
      deletePreparatoryDomainResp &&
      deletePreparatoryDomainResp !== prevDeletePreparatoryDomainResp
    ) {
      toast.success("Domain Name deleted successfully");
      delSportsNameCloseModal();
      getHolisticDomainApiCall();
    }

    sportsNamesRef.current.prevSavePreparatoryDomainResp = savePreparatoryDomainResp;
    sportsNamesRef.current.prevUpdatePreparatoryDomainResp =
      updatePreparatoryDomainResp;
    sportsNamesRef.current.prevSavePreparatoryDomainOrderResp = savePreparatoryDomainOrderResp;
    sportsNamesRef.current.prevCbseExaminationErrorAct =
      cbseExaminationErrorAct;
    sportsNamesRef.current.prevDeletePreparatoryDomainResp =
      deletePreparatoryDomainResp;
  }, [
    savePreparatoryDomainResp,
    updatePreparatoryDomainResp,
    savePreparatoryDomainOrderResp,
    cbseExaminationErrorAct,
    deletePreparatoryDomainResp,
  ]);

  useEffect(() => {
    getHolisticDomainApiCall();
  }, []);

  const tableColumns = useMemo(
    () => generateColumns(menuOptions, showInstituteAdminUI),
    [menuOptions, showInstituteAdminUI]
  );

  return (
    <>
      <div className="page-content">
        <div className="container-fluid">
          <BreadCrumb title="Examination" pageTitle="Examination" />

          <div className="card">
            <div className="card-header">
              <div className="row align-items-center">
                <div className="col-6">
                  <h4 className="card-title mb-0 flex-grow-1">Domain</h4>
                </div>

                {showInstituteAdminUI && (
                  <div className="col-auto ms-auto ">
                    <button
                      className="btn btn-primary me-2"
                      onClick={() => openDisplayOrderModal()}
                    >
                      Set Order
                    </button>
                    <button
                      className="btn btn-success float-end d-flex align-items-center"
                      onClick={() => addEditSportNameOpenModal()}
                    >
                      <i className="ri-add-line me-2" />
                      Add New
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="card-body p-0">
              <TableContainer
                columns={tableColumns || []}
                data={getPreparatoryDomainResp || []}
                tableClass="mb-0"
                divClass="table-responsive mb-3"
                theadClass="table-light text-muted align-middle"
                showPagination={false}
              />
            </div>
          </div>
        </div>
      </div>

      <ModalContainerUpdated
        id="add-edit-sports-names-modal"
        isOpen={addEditSportNameModalState.showModal}
        toggle={addEditSportNameCloseModal}
        modalTitle={
          addEditSportNameModalState.modalData ? "Edit Domain" : "Add Domain"
        }
        modalSize="md"
      >
        <AddEditNewPreparatoryModal
          toggle={addEditSportNameCloseModal}
          dataLength={getPreparatoryDomainResp?.length}
          id={addEditSportNameModalState.modalData}
        ></AddEditNewPreparatoryModal>
      </ModalContainerUpdated>

      <ConfirmationModal
        id="del-sports-name-modal"
        isOpen={delSportsNameModalState.showModal}
        confirmMessage="Are you sure you want to delete this domain?"
        cancelHndlr={delSportsNameCloseModal}
        confirmHndlr={delSportNameItemHndlr}
        iconType="reject"
      ></ConfirmationModal>
      <ModalContainerUpdated
        id="change-examination_subject-order"
        isOpen={displayOrderModalState.showModal}
        toggle={() => closeDisplayOrderModal()}
        modalTitle={"Set Domain Order"}
        modalSize="md"
      >
        <DisplayOrderModal
          modalData={getPreparatoryDomainResp}
          isOpen={displayOrderModalState.showModal}
          toggle={() => closeDisplayOrderModal()}
        />
      </ModalContainerUpdated>
    </>
  );
};

export default PreparatoryDomains;
