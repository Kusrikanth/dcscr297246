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
import AddEditDiffcultyModal from "./AddEditDiffcultyModal";
import { generateActionPayload } from "../../../../../utility/reduxutility";
import { deleteDifficultyLevelsAct, getDifficultyLevelsAct, getDifficultyLevelsByIdAct } from "../../../../../store/lms/lmssettings/lmssettingsaction";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { IPaginationState } from "../../../../../Components/Common/Pagination";
import { useFormik } from "formik";
import { debounce } from "../../../../../utility/commonutility";
import { toast } from "react-toastify";

const initialValues = {
  searchString: "",
}

const DifficultyLevels = () => {
  const dispatch = useAppDispatch();
  const {
    openModal: addEditOpenDiffcultyModal,
    closeModal: addEditCloseDiffcultyModal,
    modalState: addEditDiffcultyModalState,
  } = useModal();

  const {
    openModal: delOpenDiffcultyModal,
    closeModal: delClsoeDiffcultyModal,
    modalState: delDiffcultyModalState,
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
    dispatch(getDifficultyLevelsAct(generateActionPayload("get_difficulty_levels", undefined, payload)));
  };

  const {
    getDifficultyLevelsResp,
    saveDifficultyLevelsResp,
    updateDifficultyLevelsResp,
    deleteDifficultyLevelsResp,
    lmsSettingsErrorAct
  } = useAppSelector(
    ({ lmsSettings }) => ({
      getDifficultyLevelsResp: lmsSettings.getDifficultyLevelsResp,
      saveDifficultyLevelsResp: lmsSettings.saveDifficultyLevelsResp,
      updateDifficultyLevelsResp: lmsSettings.updateDifficultyLevelsResp,
      deleteDifficultyLevelsResp: lmsSettings.deleteDifficultyLevelsResp,
      lmsSettingsErrorAct: lmsSettings.lmsSettingsErrorAct,
    }),
    shallowEqual
  );
  const difficultyLevelsRef = useRef({
    prevSaveDifficultyLevelsResp: saveDifficultyLevelsResp,
    prevUpdateDifficultyLevelsResp: updateDifficultyLevelsResp,
    prevDeleteDifficultyLevelsResp: deleteDifficultyLevelsResp,
    prevLmsSettingsErrorAct: lmsSettingsErrorAct,
  })
  const difficultyLevelForm = useFormik({
    initialValues,
    // validationSchema,
    onSubmit: (values) => {
    },
  });

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
          dispatch(getDifficultyLevelsByIdAct(generateActionPayload("get_difficulty_levels_by_id", { id })));
          addEditOpenDiffcultyModal(id);
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
          delOpenDiffcultyModal(id);
        },
      },
    ],
    [getDifficultyLevelsResp]
  );

  useEffect(() => {
    const { prevSaveDifficultyLevelsResp, prevUpdateDifficultyLevelsResp, prevDeleteDifficultyLevelsResp, prevLmsSettingsErrorAct } = difficultyLevelsRef.current;
    if (saveDifficultyLevelsResp && prevSaveDifficultyLevelsResp !== saveDifficultyLevelsResp) {
      toast.success("Difficulty Level Added successfully.");
      addEditCloseDiffcultyModal()
      getQuestionsNoFormatApiCall()
    }
    else if (updateDifficultyLevelsResp && prevUpdateDifficultyLevelsResp !== updateDifficultyLevelsResp) {
      toast.success("Difficulty Level Updated successfully.");
      addEditCloseDiffcultyModal()
      getQuestionsNoFormatApiCall()
    }
    else if (deleteDifficultyLevelsResp && prevDeleteDifficultyLevelsResp !== deleteDifficultyLevelsResp) {
      toast.success("Difficulty Level Deleted successfully.");
      delClsoeDiffcultyModal()
      getQuestionsNoFormatApiCall()
    }
    else if (lmsSettingsErrorAct && prevLmsSettingsErrorAct !== lmsSettingsErrorAct) {
      const { details, error } = lmsSettingsErrorAct || {};
      toast.error(details || error || "Something went wrong.");
    }
    difficultyLevelsRef.current.prevDeleteDifficultyLevelsResp = deleteDifficultyLevelsResp;
    difficultyLevelsRef.current.prevUpdateDifficultyLevelsResp = updateDifficultyLevelsResp;
    difficultyLevelsRef.current.prevSaveDifficultyLevelsResp = saveDifficultyLevelsResp;
    difficultyLevelsRef.current.prevLmsSettingsErrorAct = lmsSettingsErrorAct;
  }, [saveDifficultyLevelsResp, updateDifficultyLevelsResp, deleteDifficultyLevelsResp, lmsSettingsErrorAct]);

  function delModalSubmitHndlr() {
    dispatch(deleteDifficultyLevelsAct(generateActionPayload("delete_difficulty_levels", { id: delDiffcultyModalState.modalData })));
  }

  function paginationHndlr(paginationInfo: IPaginationState) {
    pagination.current = paginationInfo;
    getQuestionsNoFormatApiCall(paginationInfo);
  }

  function search(value: string) {
    getQuestionsNoFormatApiCall({ ...difficultyLevelForm.values, searchString: value });
  }

  const debounceFun = useCallback(debounce(search, 200), [getDifficultyLevelsResp]);

  const onChangeFilterHndlr = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    pagination.current.pageNo = 0;

    if (name === "searchString") {
      difficultyLevelForm.setValues((prev: any) => ({ ...prev, [name]: value }))
      debounceFun(value);
    }
  }
  const tableColumns = useMemo(() => generateColumns(menuOptions), []);

  const {
    content: libraryCategoryResp,
    totalElements,
    totalPages,
    pageNumber,
  } = getDifficultyLevelsResp || {};

  return (
    <>
      <div className="card">
        <div className="card-header">
          <div className="row align-items-center">
            <div className="col-6">
              <h4 className="card-title mb-0 flex-grow-1">Difficulty Levels</h4>
            </div>
            <div className="col-auto ms-auto">
              <div className="d-flex">
                <button
                  className="btn btn-success float-end d-flex align-items-center"
                  onClick={() => addEditOpenDiffcultyModal()}
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
                        value={difficultyLevelForm.values.searchString}
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
            data={getDifficultyLevelsResp?.data || []}
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
        isOpen={addEditDiffcultyModalState.showModal}
        toggle={addEditCloseDiffcultyModal}
        modalTitle={
          addEditDiffcultyModalState.modalData
            ? "Edit Difficulty"
            : "Add Difficulty"
        }
        modalSize="lg"
      >
        <AddEditDiffcultyModal
          toggle={addEditCloseDiffcultyModal}
          id={addEditDiffcultyModalState.modalData}
        ></AddEditDiffcultyModal>
      </ModalContainerUpdated>
      <ConfirmationModal
        id="delete-difficulty-level-modal"
        isOpen={delDiffcultyModalState.showModal}
        confirmMessage="Are you sure you want to delete this Difficulty Level ?"
        cancelHndlr={delClsoeDiffcultyModal}
        confirmHndlr={delModalSubmitHndlr}
        showImgIcon={true}
        iconType="reject"
      />
    </>
  );
};

export default DifficultyLevels;
