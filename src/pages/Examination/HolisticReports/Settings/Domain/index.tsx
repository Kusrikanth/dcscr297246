import React, { useEffect, useMemo, useRef } from "react";
import {
  ConfirmationModal,
  ModalContainerUpdated,
} from "../../../../../Components/Common";
import BreadCrumb from "../../../../../Components/Common/BreadCrumb";
import TableContainer from "../../../../../Components/Common/TableContainer";
import { generateColumns } from "./helper";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Delete02StrokeStandard,
  PencilEdit02Icon,
} from "@hugeicons-pro/core-stroke-standard";
import { useModal } from "../../../../../hooks/modalhook";
import AddEditNewSportsModal from "./AddEditNewSportsModal";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
import { generateActionPayload } from "../../../../../utility/reduxutility";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import { deleteHolisticDomainAct, getHolisticDomainAct } from "../../../../../store/examination/examinationsettings/examinationsettingsaction";
import DisplayOrderModal from "./DisplayOrderModal";

const Domain = () => {
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

  const { closeModal: closeDisplayOrderModal, modalState: displayOrderModalState, openModal: openDisplayOrderModal } = useModal();
  const dispatch = useAppDispatch();

  const {
    currentBranchIdResp: branchId,
    getHolisticDomainResp,
    saveHolisticDomainResp,
    updateHolisticDomainResp,
    saveDomainOrderResp,
    cbseExaminationErrorAct,
    deleteHolisticDomainResp,
    loggedInUserRole,
    virtualRoleResp
  } = useAppSelector(
    ({ appData, examinationSettings }) => ({
      currentBranchIdResp: appData.currentBranchIdResp,
      getHolisticDomainResp: examinationSettings.getHolisticDomainResp,
      saveHolisticDomainResp: examinationSettings.saveHolisticDomainResp,
      updateHolisticDomainResp: examinationSettings.updateHolisticDomainResp,
      saveDomainOrderResp: examinationSettings.saveDomainOrderResp,
      cbseExaminationErrorAct:
        examinationSettings.cbseExaminationErrorAct,
      deleteHolisticDomainResp: examinationSettings.deleteHolisticDomainResp,
      loggedInUserRole: appData.loggedInUserRole,
      virtualRoleResp: appData.virtualRoleResp
    }),
    shallowEqual
  );
  const showInstituteAdminUI = loggedInUserRole === 'INSTITUTE_ADMIN' && !virtualRoleResp;

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
    dispatch(getHolisticDomainAct(generateActionPayload("get_holistic_domain", undefined, {})));
  };
  function delSportNameItemHndlr() {
    dispatch(deleteHolisticDomainAct(generateActionPayload("delete_holistic_domain", { id: delSportsNameModalState.modalData })));

  }



  const sportsNamesRef = useRef({
    prevSaveHolisticDomainResp: saveHolisticDomainResp,
    prevUpdateHolisticDomainResp: updateHolisticDomainResp,
    prevSaveDomainOrderResp: saveDomainOrderResp,
    prevCbseExaminationErrorAct: cbseExaminationErrorAct,
    prevDeleteHolisticDomainResp: deleteHolisticDomainResp
  });

  useEffect(() => {
    const {
      prevSaveHolisticDomainResp,
      prevUpdateHolisticDomainResp,
      prevSaveDomainOrderResp,
      prevCbseExaminationErrorAct,
      prevDeleteHolisticDomainResp
    } = sportsNamesRef.current;

    if (
      saveHolisticDomainResp &&
      saveHolisticDomainResp !== prevSaveHolisticDomainResp
    ) {
      toast.success("Domain Name added successfully");
      getHolisticDomainApiCall();
      addEditSportNameCloseModal();
    }
    else if (
      updateHolisticDomainResp &&
      updateHolisticDomainResp !== prevUpdateHolisticDomainResp
    ) {
      toast.success("Domain Name updated successfully");
      getHolisticDomainApiCall();
      addEditSportNameCloseModal();
    }
    else if (
      saveDomainOrderResp &&
      saveDomainOrderResp !== prevSaveDomainOrderResp
    ) {
      toast.success("Domain Order updated successfully");
      delSportsNameCloseModal();
      getHolisticDomainApiCall();
    }
    else if (
      cbseExaminationErrorAct &&
      cbseExaminationErrorAct !== prevCbseExaminationErrorAct
    ) {
      const { details } = cbseExaminationErrorAct;
      toast.error(details || "Something went wrong");
    }
    else if (
      deleteHolisticDomainResp &&
      deleteHolisticDomainResp !== prevDeleteHolisticDomainResp
    ) {
      toast.success("Domain Name deleted successfully");
      delSportsNameCloseModal();
      getHolisticDomainApiCall();
    }

    sportsNamesRef.current.prevSaveHolisticDomainResp = saveHolisticDomainResp;
    sportsNamesRef.current.prevUpdateHolisticDomainResp = updateHolisticDomainResp;
    sportsNamesRef.current.prevSaveDomainOrderResp = saveDomainOrderResp;
    sportsNamesRef.current.prevCbseExaminationErrorAct = cbseExaminationErrorAct;
    sportsNamesRef.current.prevDeleteHolisticDomainResp = deleteHolisticDomainResp;
  }, [
    saveHolisticDomainResp,
    updateHolisticDomainResp,
    saveDomainOrderResp,
    cbseExaminationErrorAct,
    deleteHolisticDomainResp
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

                {showInstituteAdminUI && <div className="col-auto ms-auto ">
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
                </div>}
              </div>
            </div>
            <div className="card-body p-0">

              <TableContainer
                columns={tableColumns || []}
                data={getHolisticDomainResp || []}
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
          addEditSportNameModalState.modalData
            ? "Edit Domain"
            : "Add Domain"
        }
        modalSize="md"
      >
        <AddEditNewSportsModal
          toggle={addEditSportNameCloseModal}
          dataLength={getHolisticDomainResp?.length}
          id={addEditSportNameModalState.modalData}
        ></AddEditNewSportsModal>
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
          modalData={getHolisticDomainResp}
          isOpen={displayOrderModalState.showModal}
          toggle={() => closeDisplayOrderModal()}
        />
      </ModalContainerUpdated>
    </>
  );
};

export default Domain;
