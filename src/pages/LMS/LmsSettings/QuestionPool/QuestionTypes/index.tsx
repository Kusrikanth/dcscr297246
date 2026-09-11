import { useCallback, useEffect, useMemo, useRef } from "react";
import TableContainer from "../../../../../Components/Common/TableContainer";
import { generateColumns, tableData } from "./helper";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Delete02StrokeStandard,
  PencilEdit02Icon,
  PlusSignIcon,
} from "@hugeicons-pro/core-stroke-standard";
import {
  ConfirmationModal,
  ModalContainerUpdated,
  TextInput,
} from "../../../../../Components/Common";
import { useModal } from "../../../../../hooks/modalhook";
import AddEditQuestionTypeModal from "./AddEditQuestionTypeModal";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { deleteQuestionTypesAct, getQuestionNoFormatAct, getQuestionTypesAct, getQuestionTypesByIdAct } from "../../../../../store/lms/lmssettings/lmssettingsaction";
import { generateActionPayload } from "../../../../../utility/reduxutility";
import { IPaginationState } from "../../../../../Components/Common/Pagination";
import { useFormik } from "formik";
import { debounce } from "../../../../../utility/commonutility";
import { toast } from "react-toastify";


const initialValues = {
  searchString: "",
}
const QuestionTypes = () => {
  const dispatch = useAppDispatch();
  const {
    openModal: addEditOpenQuestionType,
    closeModal: addEditCloseQuestionType,
    modalState: addEditQuestionTypesModalState,
  } = useModal();

  const {
    openModal: delOpenQuestionTypeModal,
    closeModal: delCloseQuestionTypeModal,
    modalState: delQuestionTypeModalState,
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
    dispatch(getQuestionTypesAct(generateActionPayload("get_question_types", undefined, payload)));
  };
  const {
    getQuestionTypesResp,
    saveQuestionTypesResp,
    updateQuestionTypesResp,
    deleteQuestionTypesResp,
    lmsSettingsErrorAct
  } = useAppSelector(
    ({ lmsSettings }) => ({
      getQuestionTypesResp: lmsSettings.getQuestionTypesResp,
      saveQuestionTypesResp: lmsSettings.saveQuestionTypesResp,
      updateQuestionTypesResp: lmsSettings.updateQuestionTypesResp,
      deleteQuestionTypesResp: lmsSettings.deleteQuestionTypesResp,
      lmsSettingsErrorAct: lmsSettings.lmsSettingsErrorAct,
    }),
    shallowEqual
  );
    const questionTypeRef = useRef({
      prevSaveQuestionTypesResp: saveQuestionTypesResp,
      prevUpdateQuestionTypesResp: updateQuestionTypesResp,
      prevDeleteQuestionTypesResp: deleteQuestionTypesResp,
      prevLmsSettingsErrorAct: lmsSettingsErrorAct,
    })
      const questionTypesForm = useFormik({
      initialValues,
      // validationSchema,
      onSubmit: (values) => {
       },
    });
      useEffect(() => {
        getQuestionsNoFormatApiCall();
      },[])

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
          dispatch(getQuestionTypesByIdAct(generateActionPayload("get_question_types_by_id", { id })));
          addEditOpenQuestionType(id);
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
          delOpenQuestionTypeModal(id)
        },
      },
    ],
    []
  );
    useEffect(() => {
      const { prevSaveQuestionTypesResp, prevUpdateQuestionTypesResp, prevDeleteQuestionTypesResp, prevLmsSettingsErrorAct } = questionTypeRef.current;
      if (saveQuestionTypesResp && prevSaveQuestionTypesResp !== saveQuestionTypesResp) {
        toast.success("Question Type successfully.");
        addEditCloseQuestionType()
        getQuestionsNoFormatApiCall()
      }
      else if (updateQuestionTypesResp && prevUpdateQuestionTypesResp !== updateQuestionTypesResp) {
        toast.success("Question Type successfully.");
        addEditCloseQuestionType()
        getQuestionsNoFormatApiCall()
      }
      else if (deleteQuestionTypesResp && prevDeleteQuestionTypesResp !== deleteQuestionTypesResp) {
        toast.success("Question Type Deleted successfully.");
        delCloseQuestionTypeModal()
        getQuestionsNoFormatApiCall()
      }
      else if (lmsSettingsErrorAct && prevLmsSettingsErrorAct !== lmsSettingsErrorAct) {
        const { details, error } = lmsSettingsErrorAct || {};
        toast.error(details || error || "Something went wrong.");
      }
      questionTypeRef.current.prevDeleteQuestionTypesResp = deleteQuestionTypesResp;
      questionTypeRef.current.prevUpdateQuestionTypesResp = updateQuestionTypesResp;
      questionTypeRef.current.prevSaveQuestionTypesResp = saveQuestionTypesResp;
      questionTypeRef.current.prevLmsSettingsErrorAct = lmsSettingsErrorAct;
    }, [saveQuestionTypesResp, updateQuestionTypesResp, deleteQuestionTypesResp, lmsSettingsErrorAct]);
    function delModalSubmitHndlr() {
      dispatch(deleteQuestionTypesAct(generateActionPayload("delete_question_types", { id: delQuestionTypeModalState.modalData })));
    }
 function paginationHndlr(paginationInfo: IPaginationState) {
      pagination.current = paginationInfo;
      getQuestionsNoFormatApiCall(paginationInfo);
    }

      function search(value: string) {
    getQuestionsNoFormatApiCall({ ...questionTypesForm.values, searchString: value });
  }

  const debounceFun = useCallback(debounce(search, 200), [getQuestionTypesResp]);
  
  const onChangeFilterHndlr = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    pagination.current.pageNo = 0;

    if (name === "searchString") {
      questionTypesForm.setValues((prev: any) => ({ ...prev, [name]: value }))
      debounceFun(value);
    }
  }
  const tableColumns = useMemo(() => generateColumns(menuOptions), []);
 const {
    content: libraryCategoryResp,
    totalElements,
    totalPages,
    pageNumber,
  } = getQuestionTypesResp || {};
  return (
    <>
      <div className="card">
        <div className="card-header">
          <div className="row align-items-center">
            <div className="col-6">
              <h4 className="card-title mb-0 flex-grow-1">Question Types &  Weightage Standards</h4>
            </div>
            <div className="col-auto ms-auto">
              <div className="d-flex">
                <button
                  className="btn btn-success float-end d-flex align-items-center"
                  onClick={() => addEditOpenQuestionType()}
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
          <div className="py-3 px-3">
            <div className="row g-3">
              <div className="col-12">
                <div className="row g-3">
                  <div className="col-xs-12 col-md-12 col-lg-4 ">
                    <div className="search-box">
                      <TextInput
                        name="searchString"
                        formgroupClassName="mb-0"
                        placeHolder="Search..."
                        value={questionTypesForm.values.searchString}
                        onChange={onChangeFilterHndlr}
                        labelText="Search"
                        floatingLabel
                      />
                      <i className="ri-search-line search-icon"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <TableContainer
            columns={tableColumns || []}
            data={getQuestionTypesResp?.data || []}
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
        id="add-edit-difficulty-levels-modal"
        isOpen={addEditQuestionTypesModalState.showModal}
        toggle={addEditCloseQuestionType}
        modalTitle={
          addEditQuestionTypesModalState.modalData
            ? "Edit Question Type"
            : "Add Question Type"
        }
        modalSize="xl"
      >
        <AddEditQuestionTypeModal
          toggle={addEditCloseQuestionType}
          id={addEditQuestionTypesModalState.modalData}
        ></AddEditQuestionTypeModal>
      </ModalContainerUpdated>

      <ConfirmationModal
        id="delete-examination-modal"
        isOpen={delQuestionTypeModalState.showModal}
        confirmMessage="Are you sure you want to delete this Question Type ?"
        cancelHndlr={delCloseQuestionTypeModal}
        confirmHndlr={delModalSubmitHndlr}
        showImgIcon={true}
        iconType="reject"
      />
    </>
  );
};

export default QuestionTypes;
