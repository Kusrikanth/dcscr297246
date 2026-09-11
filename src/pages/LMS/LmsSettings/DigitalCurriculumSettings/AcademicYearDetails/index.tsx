import { useEffect, useMemo, useRef } from "react";
import TableContainer from "../../../../../Components/Common/TableContainer";
import { generateColumns } from "./helper";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02StrokeStandard, PencilEdit02Icon, PlusSignIcon } from "@hugeicons-pro/core-stroke-standard";
import { ConfirmationModal, ModalContainerUpdated } from "../../../../../Components/Common";
import { useModal } from "../../../../../hooks/modalhook";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { deleteAcademicDetailsAct, getAcademicDetailsByIdAct, getAcademicDetailsListAct } from "../../../../../store/lms/lmssettings/lmssettingsaction";
import { generateActionPayload } from "../../../../../utility/reduxutility";
import AddAcademicDetailsModal from "./AddAcademicDetailsModal";
import { toast } from "react-toastify";

const AcademicYearDetails = () => {
  const { openModal: openAcademicDetailsModal, closeModal: closeAcademicDetailsModal, modalState: academicYearDetailsModalState } = useModal();
  const { openModal: openDelAcademicDetailsModal, closeModal: closeDelAcademicDetailsYearModal, modalState: delAcademicYearDetailsModalState, } = useModal();
  const dispatch = useAppDispatch();

  const getAcademicYearDetailsApiCall = (otherProps?: any) => {
    let payload = {
    };
    dispatch(getAcademicDetailsListAct(generateActionPayload("get_academic_details_list", undefined, payload)));
  };

  const { currentInstIdResp: instituteId,
    currentBranchIdResp: branchId,
    getAcademicDetailsListResp,
    savecademicDetailsResp,
    deleteAcademicDetailsResp,
    lmsSettingsErrorAct
  } = useAppSelector(
    ({
      appData, lmsSettings,
    }) => ({
      currentInstIdResp: appData.currentInstIdResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      getAcademicDetailsListResp: lmsSettings.getAcademicDetailsListResp,
      savecademicDetailsResp: lmsSettings.savecademicDetailsResp,
      deleteAcademicDetailsResp: lmsSettings.deleteAcademicDetailsResp,
      lmsSettingsErrorAct: lmsSettings.lmsSettingsErrorAct,
    }),
    shallowEqual
  );
  const academicYearDetailsRef = useRef({
    prevLmsSettingsErrorAct: lmsSettingsErrorAct,
    prevSavecademicDetailsResp: savecademicDetailsResp,
    prevDeleteAcademicDetailsResp: deleteAcademicDetailsResp,
  })

  useEffect(() => {
    const { prevLmsSettingsErrorAct, prevSavecademicDetailsResp, prevDeleteAcademicDetailsResp } = academicYearDetailsRef.current || {}

    if (lmsSettingsErrorAct && prevLmsSettingsErrorAct !== lmsSettingsErrorAct) {
      const { details } = lmsSettingsErrorAct || {}
      toast.error(details || "Something went wrong")
    }
    else if (savecademicDetailsResp && prevSavecademicDetailsResp !== savecademicDetailsResp) {
      toast.success("Academic Year Details Added successfully")
      getAcademicYearDetailsApiCall();
      closeAcademicDetailsModal();
    }
    else if (deleteAcademicDetailsResp && prevDeleteAcademicDetailsResp !== deleteAcademicDetailsResp) {
      toast.success("Academic Year Details Deleted successfully")
      getAcademicYearDetailsApiCall();
      closeDelAcademicDetailsYearModal();
    }
    academicYearDetailsRef.current.prevLmsSettingsErrorAct = lmsSettingsErrorAct;
    academicYearDetailsRef.current.prevSavecademicDetailsResp = savecademicDetailsResp;
    academicYearDetailsRef.current.prevDeleteAcademicDetailsResp = deleteAcademicDetailsResp;
  }, [lmsSettingsErrorAct, savecademicDetailsResp, deleteAcademicDetailsResp])

  useEffect(() => {
    getAcademicYearDetailsApiCall();
  }, []);
  
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
          dispatch(getAcademicDetailsByIdAct(generateActionPayload("get_academic_details_by_id", { id })));
          openAcademicDetailsModal(id);
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
          openDelAcademicDetailsModal(id);
        },
      },
    ],
    [getAcademicDetailsListResp]
  );

  function delModalSubmitHndlr() {
    dispatch(deleteAcademicDetailsAct(generateActionPayload("delete_academic_details_by_id", { id: delAcademicYearDetailsModalState.modalData })));
  }

  const tableColumns = useMemo(() => generateColumns(menuOptions), [getAcademicDetailsListResp]);

  return (
    <>
      <div className="card">
        <div className="card-header">
          <div className="row align-items-center">
            <div className="col-6">
              <h4 className="card-title mb-0 flex-grow-1">
                Academic Details
              </h4>
            </div>
            <div className="col-auto ms-auto">
              <div className="d-flex">
                <button
                  className="btn btn-success float-end d-flex align-items-center"
                  onClick={() => openAcademicDetailsModal()}
                >
                  <HugeiconsIcon
                    icon={PlusSignIcon}
                    className="me-2"
                    size={18}
                  />
                  Add New
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="card-body p-0">
          <TableContainer
            columns={tableColumns || []}
            data={Array.isArray(getAcademicDetailsListResp) ? getAcademicDetailsListResp : []}
            tableClass="mb-0"
            divClass="table-responsive mb-3"
            theadClass="table-light text-muted align-middle"
            showPagination={false}
          />
        </div>
      </div>
      <ModalContainerUpdated
        id="add-edit-difficulty-levels-modal"
        isOpen={academicYearDetailsModalState.showModal}
        toggle={closeAcademicDetailsModal}
        modalTitle={
          academicYearDetailsModalState.modalData
            ? "Edit Academic Details"
            : "Add Academic Details"
        }
        modalSize="md"
      >
        <AddAcademicDetailsModal
          toggle={closeAcademicDetailsModal}
          id={academicYearDetailsModalState.modalData}
        ></AddAcademicDetailsModal>
      </ModalContainerUpdated>
      <ConfirmationModal
        id="del-difficulty-levels-modal"
        isOpen={delAcademicYearDetailsModalState.showModal}
        confirmMessage="Are you sure you want to Delete the Academic Details"
        cancelHndlr={closeDelAcademicDetailsYearModal}
        confirmHndlr={delModalSubmitHndlr}
        showImgIcon={true}
        iconType="reject"
      ></ConfirmationModal>
    </>
  );
};

export default AcademicYearDetails;
