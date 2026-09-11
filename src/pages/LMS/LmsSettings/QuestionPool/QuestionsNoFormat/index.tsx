import { useEffect, useMemo, useRef } from "react";
import TableContainer from "../../../../../Components/Common/TableContainer";
import { generateColumns } from "./helper";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Delete02StrokeStandard,
  PencilEdit02Icon,
  PlusSignIcon,
} from "@hugeicons-pro/core-stroke-standard";
import {
  ConfirmationModal,
  ModalContainerUpdated,
} from "../../../../../Components/Common";
import { useModal } from "../../../../../hooks/modalhook";
import AddEditQuestionFormatModal from "./AddEditQuestionFormatModal";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
import { deleteQuestionNoFormatAct, getQuestionNoFormatAct } from "../../../../../store/lms/lmssettings/lmssettingsaction";
import { generateActionPayload } from "../../../../../utility/reduxutility";
import { shallowEqual } from "react-redux";
import { IPaginationState } from "../../../../../Components/Common/Pagination";
import { toast } from "react-toastify";

const QuestionsNoFormat = () => {
  const dispatch = useAppDispatch();
  const {
    openModal: addEditOpenQutionModal,
    closeModal: addEditCloseQutionModal,
    modalState: addEditQutionFormatState,
  } = useModal();

  const {
    openModal: delOpenQutionModal,
    closeModal: delCloseQutionModal,
    modalState: delQutionFormatState,
  } = useModal();

  const pagination = useRef({
    pageNo: 0,
    pageSize: 10,
  });

  const getQuestionsNoFormatApiCall = (otherProps?: any) => {
    let payload = {
      ...pagination.current,
      ...otherProps,
    };
    dispatch(getQuestionNoFormatAct(generateActionPayload("get_question_no_format", undefined, payload)));
  };

  const {
    getQuestionNoFormatResp,
    saveQuestionNoFormatResp,
    lmsSettingsErrorAct,
    updateQuestionNoFormatResp,
    deleteQuestionNoFormatResp
  } = useAppSelector(
    ({ lmsSettings }) => ({
      getQuestionNoFormatResp: lmsSettings.getQuestionNoFormatResp,
      saveQuestionNoFormatResp: lmsSettings.saveQuestionNoFormatResp,
      lmsSettingsErrorAct: lmsSettings.lmsSettingsErrorAct,
      updateQuestionNoFormatResp: lmsSettings.updateQuestionNoFormatResp,
      deleteQuestionNoFormatResp: lmsSettings.deleteQuestionNoFormatResp
    }),
    shallowEqual
  );


  const instituteRespRef = useRef<any>({
    prevSaveQuestionNoFormatResp: saveQuestionNoFormatResp,
    prevLmsSettingsErrorAct: lmsSettingsErrorAct,
    prevUpdateQuestionNoFormatResp: updateQuestionNoFormatResp,
    prevDeleteQuestionNoFormatResp: deleteQuestionNoFormatResp
  });

  useEffect(() => {
    const { prevSaveQuestionNoFormatResp, prevLmsSettingsErrorAct, prevUpdateQuestionNoFormatResp, prevDeleteQuestionNoFormatResp } = instituteRespRef.current;
    if (saveQuestionNoFormatResp && prevSaveQuestionNoFormatResp !== saveQuestionNoFormatResp) {
      toast.success("Question No Format saved successfully.");
      getQuestionsNoFormatApiCall();
      addEditCloseQutionModal();
    }
    else if (lmsSettingsErrorAct && prevLmsSettingsErrorAct !== lmsSettingsErrorAct) {
      toast.error(lmsSettingsErrorAct.details || "Something went wrong.");
    }
    else if (updateQuestionNoFormatResp && prevUpdateQuestionNoFormatResp !== updateQuestionNoFormatResp) {
      toast.success("Question No Format updated successfully.");
      getQuestionsNoFormatApiCall();
      addEditCloseQutionModal();
    }
    else if (deleteQuestionNoFormatResp && prevDeleteQuestionNoFormatResp !== deleteQuestionNoFormatResp) {
      toast.success("Question No Format deleted successfully.");
      getQuestionsNoFormatApiCall();
      delCloseQutionModal();
    }
    instituteRespRef.current.prevSaveQuestionNoFormatResp = saveQuestionNoFormatResp;
    instituteRespRef.current.prevLmsSettingsErrorAct = lmsSettingsErrorAct;
    instituteRespRef.current.prevUpdateQuestionNoFormatResp = updateQuestionNoFormatResp;
    instituteRespRef.current.prevDeleteQuestionNoFormatResp = deleteQuestionNoFormatResp;
  }, [saveQuestionNoFormatResp, lmsSettingsErrorAct, updateQuestionNoFormatResp, deleteQuestionNoFormatResp]);

  useEffect(() => {
    getQuestionsNoFormatApiCall();
  }, [])

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
          addEditOpenQutionModal(id);
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
          delOpenQutionModal(id);
        },
      },
    ],
    []
  );

  function paginationHndlr(paginationInfo: IPaginationState) {
    pagination.current = paginationInfo;
    getQuestionsNoFormatApiCall(paginationInfo);
  }

  const tableColumns = useMemo(() => generateColumns(menuOptions), []);

  const delLibraryDetailsConfirmHndler = () => {
      dispatch(deleteQuestionNoFormatAct(generateActionPayload("delete_question_no_format", { id: delQutionFormatState.modalData },)));
    }

  const {
    content: libraryCategoryResp,
    totalElements,
    totalPages,
    pageNumber,
  } = getQuestionNoFormatResp || {};

  return (
    <>
      <div className="card">
        <div className="card-header">
          <div className="row align-items-center">
            <div className="col-6">
              <h4 className="card-title mb-0 flex-grow-1">
                Questions No. Format
              </h4>
            </div>
            <div className="col-auto ms-auto">
              <div className="d-flex">
                <button
                  className="btn btn-success float-end d-flex align-items-center"
                  onClick={() => addEditOpenQutionModal()}
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
            data={getQuestionNoFormatResp?.data || []}
            tableClass="mb-0"
            divClass="table-responsive mb-3"
            theadClass="table-light text-muted align-middle"
            showPagination={true}
            totalPages={totalPages || 0}
            totalRecords={totalElements || 0}
            callbackPaginationHndlr={paginationHndlr}
            currentPageNumber={pageNumber || 0}
          ></TableContainer>
        </div>
      </div>
      <ModalContainerUpdated
        id="add-edit-question-formate-modal"
        isOpen={addEditQutionFormatState.showModal}
        toggle={addEditCloseQutionModal}
        modalTitle={
          addEditQutionFormatState.modalData
            ? "Edit Question No. Format"
            : "Add Question No. Format"
        }
        modalSize="xl"
      >
        <AddEditQuestionFormatModal
          toggle={addEditCloseQutionModal}
          id={addEditQutionFormatState.modalData}
        ></AddEditQuestionFormatModal>
      </ModalContainerUpdated>

      <ConfirmationModal
        id="del-question-formate-modal"
        isOpen={delQutionFormatState.showModal}
        confirmMessage="Are you sure you want to Delete the Question Format"
        cancelHndlr={delCloseQutionModal}
        confirmHndlr={delLibraryDetailsConfirmHndler}
        showImgIcon={true}
        iconType="reject"
      ></ConfirmationModal>
    </>
  );
};

export default QuestionsNoFormat;
