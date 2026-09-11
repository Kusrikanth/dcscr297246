import React, { useEffect, useMemo, useRef } from "react";
import { ConfirmationModal, ModalContainerUpdated, SelectInput, TextInput } from '../../../../../Components/Common';
import TableContainer from '../../../../../Components/Common/TableContainer';
import { generateColumns } from "./helper";
import AddSkillSetModel from "./AddSkillSetModel";
import BreadCrumb from "../../../../../Components/Common/BreadCrumb";
import { useModal } from "../../../../../hooks/modalhook";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
import { IPaginationState } from "../../../../../Components/Common/Pagination";
import { shallowEqual } from "react-redux";
import { generateActionPayload } from "../../../../../utility/reduxutility";
import { deleteSkillEntryAct, getSkillEntryByIdAct, getSkillEntryListAct } from "../../../../../store/examination/examinationsettings/examinationsettingsaction";
import { getBranchCurriculumAct } from "../../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { Delete02StrokeStandard, PencilEdit02Icon } from "@hugeicons-pro/core-stroke-standard";
import { HugeiconsIcon } from "@hugeicons/react";
import { useLocation } from "react-router-dom";

const initialValues = {
  searchString: "",
  curriculumId: "",
};

const SkillSet = () => {

  const dispatch = useAppDispatch();
  const { closeModal: closeAoDataUploadModalModal, modalState: aoDataUploadModalState, openModal: aoDataUploadModal } = useModal();
  const {
    closeModal: closeDeletePeriodCategoryModal,
    openModal: openDeletePeriodCategoryModal,
    modalState: deletePeriodCategoryModalState,
  } = useModal();
  const pagination = useRef({
    pageNo: 0,
    pageSize: 10
  })

  const isEy = location.pathname.includes("/early-years-settings/skill-set");
  const eyAoDataList = (otherProps?: any) => {
    const payload = {
      branchId,
      curriculumId: examinationSubjectsForm.values.curriculumId,
      searchString: examinationSubjectsForm.values.searchString,
      ...pagination.current,
      ...otherProps,
    };
    if (payload.curriculumId) {
      dispatch(getSkillEntryListAct(generateActionPayload("get_skill_entry_list", undefined, payload)));
    }
  };

  const examinationSubjectsForm = useFormik({
    enableReinitialize: true,
    initialValues,
    onSubmit: (values) => { },
  });

  const {
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    showApiLoader,
    getSkillEntryListResp,
    brchCurriculumResp,
    saveSkillEntryResp,
    cbseExaminationErrorAct,
    deleteSkillEntryResp,
    updateSkillEntryResp

  } = useAppSelector(
    ({ instAcademics, branchAcademics, examinationSettings, appData, globalData, }) => ({
      currentBranchIdResp: appData.currentBranchIdResp,
      showApiLoader: globalData.showApiLoader,
      currentInstIdResp: appData.currentInstIdResp,
      getSkillEntryListResp: examinationSettings.getSkillEntryListResp,
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      cbseExaminationErrorAct: examinationSettings.cbseExaminationErrorAct,
      saveSkillEntryResp: examinationSettings.saveSkillEntryResp,
      deleteSkillEntryResp: examinationSettings.deleteSkillEntryResp,
      updateSkillEntryResp: examinationSettings.updateSkillEntryResp
    }),
    shallowEqual
  );

  const skillSetRef = useRef({
    prevCbseExaminationErrorAct: cbseExaminationErrorAct,
    prevSaveSkillEntryResp: saveSkillEntryResp,
    prevDeleteSkillEntryResp: deleteSkillEntryResp,
    prevUpdateSkillEntryResp: updateSkillEntryResp
  })

  useEffect(() => {
    const { prevCbseExaminationErrorAct, prevSaveSkillEntryResp, prevDeleteSkillEntryResp, prevUpdateSkillEntryResp } = skillSetRef.current || {}

    if (cbseExaminationErrorAct && prevCbseExaminationErrorAct !== cbseExaminationErrorAct) {
      const { details } = cbseExaminationErrorAct || {}
      toast.error(details || "Something went wrong")
    }
    else if (saveSkillEntryResp && prevSaveSkillEntryResp !== saveSkillEntryResp) {
      toast.success("Skill Entry Added successfully")
      eyAoDataList();
      closeAoDataUploadModalModal();
    }
    else if (deleteSkillEntryResp && prevDeleteSkillEntryResp !== deleteSkillEntryResp) {
      toast.success("Skill Entry Deleted successfully")
      eyAoDataList();
      closeDeletePeriodCategoryModal();
    }
    else if (updateSkillEntryResp && prevUpdateSkillEntryResp !== updateSkillEntryResp) {
      toast.success("Skill Entry Updated successfully")
      eyAoDataList();
      closeAoDataUploadModalModal();
    }
    skillSetRef.current.prevCbseExaminationErrorAct = cbseExaminationErrorAct;
    skillSetRef.current.prevSaveSkillEntryResp = saveSkillEntryResp;
    skillSetRef.current.prevDeleteSkillEntryResp = deleteSkillEntryResp;
    skillSetRef.current.prevUpdateSkillEntryResp = updateSkillEntryResp;
  }, [cbseExaminationErrorAct, saveSkillEntryResp, deleteSkillEntryResp, updateSkillEntryResp])

  function editScheduleTaskModalHndlr(event: React.MouseEvent<HTMLElement>) {
    const id = event.currentTarget.getAttribute("data-id");
    dispatch(getSkillEntryByIdAct(generateActionPayload('get_skill_entry_by_id', { id })));
    aoDataUploadModal(id);
  }


  const menuOptions = useMemo(
    () => [
      {
        id: "edit",
        actionIcon: <HugeiconsIcon icon={PencilEdit02Icon} className=" text-muted" size={20} />,
        actionName: "Edit",
        onClickHndlr: editScheduleTaskModalHndlr,
      },
      {
        id: "delete",
        actionIcon: <HugeiconsIcon icon={Delete02StrokeStandard} className="text-danger" size={18} />,
        actionName: "Delete",
        onClickHndlr: (event: React.MouseEvent<HTMLElement>) => {
          const id = event.currentTarget.getAttribute("data-id");
          openDeletePeriodCategoryModal(id);
        },
      },
    ],
    []
  );
  useEffect(() => {
    getCurriculumApiCall();
  }, [])
  const getCurriculumApiCall = (otherProps?: any) => {
    const payload1 = { instituteId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", ...otherProps };
    dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
  }

  useEffect(() => {
    const { data } = brchCurriculumResp || {};

    if (Array.isArray(data) && data.length > 0) {
      let shortNameToMatch = "";
  
      if (location.pathname.includes("/cbse-settings")) {
        shortNameToMatch = "CBSE";
      } else if (location.pathname.includes("/early-years-settings")) {
        shortNameToMatch = "EY1-EY3";
      } else if (location.pathname.includes("/igcse-settings")) {
        shortNameToMatch = "IGCSE";
      }
  
      const selectedCurriculum = data.find(
        (item) => item.shortName === shortNameToMatch
      );

      if (!selectedCurriculum) {
        examinationSubjectsForm.setValues((prev: any) => ({
          ...prev,
          curriculumId: undefined,
        }));
        return;
      }
      examinationSubjectsForm.setValues((prev: any) => ({
        ...prev,
        curriculumId: selectedCurriculum.branchCurriculumId,
      }));
      eyAoDataList({ curriculumId: selectedCurriculum.branchCurriculumId })
    }
  }, [brchCurriculumResp]);

  const onChangeFilterHndlr = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    pagination.current.pageNo = 0;
    eyAoDataList({ [name]: value, });
    examinationSubjectsForm.setValues((prev: any) => ({ ...prev, [name]: value }));
  };

  function delModalSubmitHndlr() {
    dispatch(deleteSkillEntryAct(generateActionPayload("delete_skill_entry", { id: deletePeriodCategoryModalState.modalData })));
  }

  function paginationHndlr(paginationInfo: IPaginationState) {
    pagination.current = paginationInfo;
    eyAoDataList(paginationInfo);
  }
  const columns = useMemo(() => generateColumns(menuOptions), []);
  const { totalElements, totalPages, pageable } = getSkillEntryListResp || {};
  const { data: curriculumTypes } = brchCurriculumResp || {};

  return (
    <>
      <div className="page-content free_payment_record_wrapper">
        <div className="container-fluid">
          <BreadCrumb title="Examination" pageTitle="Examination" />

          <div className="card">
            <div className="card-header">
              <div className="row align-items-center">
                <div className="col-6">
                  <h4 className="card-title mb-0 flex-grow-1">Skill Set</h4>
                </div>
              </div>
            </div>
            <div className="card-body p-0">
              <div className="row bg-light m-3 pb-3 px-2 g-3 examination">
                <div className="col-xs-12 col-md-12 col-lg-4 col-xl-3">
                  <div className="search-box">
                    <TextInput
                      name="searchString"
                      formgroupClassName="mb-0"
                      labelText='Search'
                      placeHolder="Search"
                      value={examinationSubjectsForm.values.searchString}
                      onChange={onChangeFilterHndlr}
                      floatingLabel
                      inputClassName="bg-light"
                    />
                    <i className="ri-search-line search-icon"></i>
                  </div>
                </div>
                <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                  <SelectInput
                    name="curriculumId"
                    value={examinationSubjectsForm.values.curriculumId}
                    onChange={onChangeFilterHndlr}
                    menuItems={curriculumTypes}
                    valueKey="branchCurriculumId"
                    textKey="curriculumName"
                    formgroupClassName="mb-0"
                    labelText='Curriculum'
                    floatingLabel
                    inputClassName="bg-light"
                    isDisabled={!isEy}
                  />
                </div>
                <div className="col-auto ms-auto">
                  <button
                    className="btn btn-success float-end d-flex align-items-center"
                    onClick={() => aoDataUploadModal()}
                  >
                    <i className="ri-add-line me-2" />
                    Add New
                  </button>
                </div>
              </div>

              <TableContainer
                columns={columns}
                data={examinationSubjectsForm.values.curriculumId ? (Array.isArray(getSkillEntryListResp?.data) ? getSkillEntryListResp?.data : []) : []}
                tableClass="mb-0"
                divClass="table-responsive mb-3"
                theadClass="table-light text-muted align-middle"
                showCheckbox={false}
                showPagination={true}
                totalPages={totalPages || 0}
                totalRecords={examinationSubjectsForm.values.curriculumId ? totalElements || 0 : 0}
                callbackPaginationHndlr={paginationHndlr}
                currentPageNumber={pageable?.pageNumber || 0}
              />

            </div>
          </div>
        </div>
      </div>
      <ModalContainerUpdated
        id="add-examination"
        isOpen={aoDataUploadModalState.showModal}
        toggle={() => closeAoDataUploadModalModal()}
        modalTitle={aoDataUploadModalState.modalData ? "Edit Skill Set" : "Create Skill Set"}
        modalSize="lg"
      >
        <AddSkillSetModel
          id={aoDataUploadModalState.modalData}
          isOpen={false}
          toggle={() => closeAoDataUploadModalModal()}
          modalTitle="Create Detail"
          modalData={examinationSubjectsForm.values}
        />
      </ModalContainerUpdated>

      <ConfirmationModal
        id="delete-skill-set"
        isOpen={deletePeriodCategoryModalState.showModal}
        confirmMessage="Are you sure you want to delete a skill set?"
        cancelHndlr={closeDeletePeriodCategoryModal}
        confirmHndlr={delModalSubmitHndlr}
        showImgIcon={true}
        iconType="reject"
      ></ConfirmationModal>
    </>
  );
};

export default SkillSet;
