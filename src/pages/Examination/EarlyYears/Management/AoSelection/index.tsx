import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { generateColumns, ignoredKeys } from "./helper";
import { default as EditSvg } from "../../../../../assets/imagesdps/academics/EditSvg.svg?react";
import { default as DeleteIconSvg } from "../../../../../assets/imagesdps/academics/DeleteIconSvg.svg?react";
import { useFormik } from "formik";
import AoselectionModel from "./AoSelectionModel";
import { ConfirmationModal, ModalContainerUpdated, OffCanvasContainer, SelectInput, TextInput } from "../../../../../Components/Common";
import TableContainer from "../../../../../Components/Common/TableContainer";
import { useModal } from "../../../../../hooks/modalhook";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { generateActionPayload } from "../../../../../utility/reduxutility";
import { getBranchClassAct, getBranchCurriculumAct, resetBrchClassAct } from "../../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { deleteAoTermSubjectsAct, getAoTermSubjectsAct, getAoTermSubjectsByIdAct, getExaminationInstituteTermsAct, resetAoTermSubjectsAct, setAoTermSubjectsAct } from "../../../../../store/examination/examinationmanagement/examinationmanagementactions";
import { getAssignedClassSubjectsList, resetAssignedClassSubjectsListAct } from "../../../../../store/academic/classSubjects/classsubjectsactions";
import { IPaginationState } from "../../../../../Components/Common/Pagination";
import * as Yup from "yup"
import { toast } from "react-toastify";
import { useFilterState } from "../../../../../hooks/filterhook";
import { default as FilterSvg } from "../../../../../assets/imagesdps/academics/FilterSvg.svg?react";
import AdvanceFilterModal from "./AdvancedFilterModal";
import { debounce } from "../../../../../utility/commonutility";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02StrokeStandard, PencilEdit02Icon } from "@hugeicons-pro/core-stroke-standard";
import { getIgseTermNameListAct } from "../../../../../store/examination/examinationsettings/examinationsettingsaction";
import { setIgseTermDetailsListAct } from "../../../../../store/examination/examinationsettings/examinationsettingsslice";
import { useLocation } from "react-router-dom";

const initialValues = {
  searchString: "",
  academicYearId: "",
  curriculumId: "",
  classId: "",
  termId: "",
  subjectId: "",
};

const validationSchema = Yup.object().shape({
  academicYearId: Yup.string().required("Academic Year is required."),
  curriculumId: Yup.string().required("Curriculum is required."),
  classId: Yup.string().required("Class is required.").nullable(),
});
const AoSelection = () => {

  const { closeModal: closeAoSectionModal, openModal: openAoSectionModal, modalState: aoselectionModelState } = useModal();
  const { closeModal: closeDelAoSectionModal, modalState: delAoSectionModalState, openModal: openDelAoSectionModal } = useModal();
  const { showClearFilterState, advanceFilterChange, count } = useFilterState();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const isEy = location.pathname.includes("/early-years-management");
  const pagination = useRef({
    pageNo: 0,
    pageSize: 10
  })
  const [open, setOpen] = useState<boolean>(false);


  const {
    academicYearListResp,
    brchCurriculumResp,
    branchClassResp,
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    showApiLoader,
    getAoTermSubjectsResp,
    examinationManagementErrorResp,
    saveAoTermSubjectsResp,
    deleteAoTermSubjectsResp,
    updateAoTermSubjectsResp


  } = useAppSelector(
    ({ globalData, instAcademics, branchAcademics, appData, examinationManagement }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      branchClassResp: branchAcademics.branchClassResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      showApiLoader: globalData.showApiLoader,
      getAoTermSubjectsResp: examinationManagement.getAoTermSubjectsResp,
      examinationManagementErrorResp: examinationManagement.examinationManagementErrorResp,
      saveAoTermSubjectsResp: examinationManagement.saveAoTermSubjectsResp,
      deleteAoTermSubjectsResp: examinationManagement.deleteAoTermSubjectsResp,
      updateAoTermSubjectsResp: examinationManagement.updateAoTermSubjectsResp,

    }),
    shallowEqual
  );

  const marksEntryRef = useRef({
    prevSaveAoTermSubjectsResp: saveAoTermSubjectsResp,
    prevExaminationManagementErrorResp: examinationManagementErrorResp,
    prevDeleteAoTermSubjectsResp: deleteAoTermSubjectsResp,
    prevUpdateAoTermSubjectsResp: updateAoTermSubjectsResp,
  })

  useEffect(() => {
    const { prevSaveAoTermSubjectsResp, prevExaminationManagementErrorResp, prevDeleteAoTermSubjectsResp, prevUpdateAoTermSubjectsResp } = marksEntryRef.current || {}

    if (saveAoTermSubjectsResp && prevSaveAoTermSubjectsResp !== saveAoTermSubjectsResp) {
      toast.success("Ao's Selection Saved Successfully")
      closeAoSectionModal()
      getAoSelectionApiCall()
    }
    else if (examinationManagementErrorResp && prevExaminationManagementErrorResp !== examinationManagementErrorResp) {
      const { details } = examinationManagementErrorResp || {}
      toast.error(details || "Something went wrong")
    }
    else if (deleteAoTermSubjectsResp && prevDeleteAoTermSubjectsResp !== deleteAoTermSubjectsResp) {
      toast.success("Ao's Selection Deleted Successfully")
      getAoSelectionApiCall()
      closeDelAoSectionModal()
    }
    else if (updateAoTermSubjectsResp && prevUpdateAoTermSubjectsResp !== updateAoTermSubjectsResp) {
      toast.success("Ao's Selection Updated Successfully")
      getAoSelectionApiCall()
      closeAoSectionModal()
    }
    marksEntryRef.current.prevSaveAoTermSubjectsResp = saveAoTermSubjectsResp;
    marksEntryRef.current.prevExaminationManagementErrorResp = examinationManagementErrorResp;
    marksEntryRef.current.prevDeleteAoTermSubjectsResp = deleteAoTermSubjectsResp;
    marksEntryRef.current.prevUpdateAoTermSubjectsResp = updateAoTermSubjectsResp;

  }, [saveAoTermSubjectsResp, examinationManagementErrorResp, deleteAoTermSubjectsResp, updateAoTermSubjectsResp])

  const aoSelectionForm = useFormik({
    validationSchema,
    initialValues,
    onSubmit: (values) => { },
  });

  function editScheduleTaskModalHndlr(event: React.MouseEvent<HTMLElement>) {
    const id = event.currentTarget.getAttribute("data-id");
    dispatch(getAoTermSubjectsByIdAct(generateActionPayload('get_ao_term_subjects_by_id', { id })));
    openAoSectionModal(id);
  }

  const menuOptions = useMemo(
    () => [
      {
        id: "edit",
        actionIcon: <HugeiconsIcon icon={PencilEdit02Icon} className="text-muted" size={18} />,
        actionName: "Edit",
        onClickHndlr: editScheduleTaskModalHndlr,
      },
      {
        id: "delete",
        actionIcon: <HugeiconsIcon icon={Delete02StrokeStandard} className="text-danger" size={18} />,
        actionName: "Delete",
        onClickHndlr: (event: React.MouseEvent<HTMLElement>) => {
          const id = event.currentTarget.getAttribute("data-id");
          openDelAoSectionModal(id)
        },
      },
    ],
    [getAoTermSubjectsResp]
  );

  const getAoSelectionApiCall = (otherProps?: any) => {
    const payload = {
      branchId,
      academicYearId: aoSelectionForm.values.academicYearId,
      curriculumId: aoSelectionForm.values.curriculumId,
      classId: aoSelectionForm.values.classId,
      termId: aoSelectionForm.values.termId,
      subjectId: aoSelectionForm.values.subjectId,
      ...pagination.current,
      ...otherProps,
    }
    if (payload.academicYearId) {
      dispatch(getAoTermSubjectsAct(generateActionPayload("get_ao_term_subjects", undefined, payload)));
    }
  }

  const igseTermList = (curriculumId: string) => {
    if (curriculumId) {
      let payload = {
        branchId,
        curriculumId,
      };
      dispatch(getIgseTermNameListAct(generateActionPayload("get_igse_term_name_list", undefined, payload)));
    }
  };

  const getSubjectList = (otherProps?: any) => {

    const payload = {
      branchId,
      academicYearId: aoSelectionForm.values.academicYearId, curriculumId: aoSelectionForm.values.curriculumId, branchClassId: aoSelectionForm.values.classId,
      sortBy: "subjectName", orderBy: "asc",
      pageNo: 0, pageSize: 100,
      ...otherProps
    }
    if (payload.academicYearId) {
      dispatch(
        getAssignedClassSubjectsList(
          generateActionPayload("get_examinations_languages_list", undefined, payload)
        )
      );
    }
  }
  const getCurriculumApiCall = (otherProps?: any) => {
    const payload1 = { academicYearId: aoSelectionForm.values.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", ...otherProps };
    dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
  }

  function delModalSubmitHndlr() {
    dispatch(deleteAoTermSubjectsAct(generateActionPayload("delete_ao_term_subjects", { id: delAoSectionModalState.modalData })));
  }

  useEffect(() => {
    return () => {
      dispatch(setAoTermSubjectsAct(undefined));
      dispatch(resetAoTermSubjectsAct(undefined));
    }
  }, [])


  useEffect(() => {
    let yearId = academicYearListResp?.data.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId;
    if (yearId) {
      aoSelectionForm.setValues((prev: any) => ({ ...prev, academicYearId: yearId }));
      const payload1 = {
        academicYearId: yearId,
        branchId: branchId,
        pageNo: 0,
        pageSize: 100,
        sortBy: "curriculumName",
        orderBy: "asc",
      };
      dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
      classApiCalled.current = false;
    }
  }, [academicYearListResp]);
  const classApiCalled = useRef(false);
  useEffect(() => {
    const { data } = brchCurriculumResp || {};
    const curriculumMapping: Record<string, string> = {
      "/early-years-management": "EY1-EY3",
      "/cbse-management": "CBSE",
      "/igcse-settings/ao-selection": "IGCSE",
    };
    const selectedCurriculumName = curriculumMapping[location.pathname];
    if (Array.isArray(data) && data.length > 0 && aoSelectionForm.values.academicYearId && !classApiCalled.current) {
      const selectedCurriculum = data.find(
        (item) => item.shortName === selectedCurriculumName
      );
      if (!selectedCurriculumName || !selectedCurriculum) {
        dispatch(resetAssignedClassSubjectsListAct(undefined));
        dispatch(resetBrchClassAct(undefined));
        aoSelectionForm.setFieldValue("curriculumId", undefined);
        aoSelectionForm.setFieldValue("subjectId", undefined);
        return;
      }
      const payload = {
        branchId,
        curriculumId: selectedCurriculum.branchCurriculumId,
        academicYearId: aoSelectionForm.values.academicYearId,
        sortBy: "classSequence",
        classFilter: isEy ? "EARLY" : "HIGHER",
        orderBy: "asc",
        pageNo: 0,
        pageSize: 100,
      };
      dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
      aoSelectionForm.setValues((prev: any) => ({
        ...prev,
        curriculumId: selectedCurriculum.branchCurriculumId,
      }));
      dispatch(getIgseTermNameListAct(generateActionPayload("get_igse_term_name_list", undefined, { branchId, curriculumId: selectedCurriculum.branchCurriculumId })));
      classApiCalled.current = true;
    }
  }, [brchCurriculumResp, aoSelectionForm.values.academicYearId]);

  useEffect(() => {
    const { content } = branchClassResp || {};
    if (Array.isArray(content) && content.length > 0) {
      aoSelectionForm.setFieldValue("classId", content[0].id);
      getSubjectList({ branchClassId: content[0]?.id });
      getAoSelectionApiCall({ classId: content[0]?.id });
    }
  }, [branchClassResp])

  function search(value: string) {
    getAoSelectionApiCall({ ...aoSelectionForm.values, searchString: value });
  }

  const debounceFun = useCallback(debounce(search, 200), [getAoTermSubjectsResp]);

  const getClassApiCall = (otherProps?: any) => {
    const payload = { branchId: branchId, classFilter: isEy ? "EARLY" : "HIGHER", academicYearId: aoSelectionForm.values?.academicYearId, curriculumId: aoSelectionForm.values.curriculumId, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100, ...otherProps };
    dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
  }

  const filterHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    pagination.current.pageNo = 0;
    if (name === "academicYearId") {
      getCurriculumApiCall({ academicYearId: value });
      aoSelectionForm.setValues((prev: any) => ({
        ...prev,
        [name]: value,
        classId: null,
        curriculumId: prev.curriculumId ? prev.curriculumId : "",
      }));
      getAoSelectionApiCall({ academicYearId: value, curriculumId: "", classId: "", subjectId: "" });
    } else if (name === 'curriculumId') {
      aoSelectionForm.setValues((prev: any) => ({ ...prev, [name]: value, classId: "", sectionId: "" }))
      if (!value) {
        dispatch(resetBrchClassAct(undefined))
        dispatch(setIgseTermDetailsListAct(undefined))
      }
      else {
        getClassApiCall({ curriculumId: value, academicYearId: aoSelectionForm.values.academicYearId });
        igseTermList(value);
      }
    }
    else if (name === 'classId') {
      aoSelectionForm.setValues((prev: any) => ({ ...prev, [name]: value, subjectId: "" }));
      getSubjectList({ branchClassId: value });
      getAoSelectionApiCall({ classId: value, subjectId: "" });
    }
    else if (name === "serchString") {
      aoSelectionForm.setValues((prev: any) => ({ ...prev, [name]: value }));
      debounceFun(value);
    }
    else {
      aoSelectionForm.setValues((prev: any) => ({ ...prev, [name]: value }))
      getAoSelectionApiCall({ [name]: value });
    }
    advanceFilterChange({
      keys: { ...aoSelectionForm.values, [name]: value },
      ignoredKeys: ["serchString", "academicYearId", "curriculumId", "classId"],
    });
  }

  function paginationHndlr(paginationInfo: IPaginationState) {
    pagination.current = paginationInfo;
    getAoSelectionApiCall(paginationInfo);
  }
  const toggleAdvanceFilter = () => {
    setOpen(prev => !prev);
  }
  function advanceFilterCallbckHndlr(appliedFilters?: any) {
    pagination.current = { ...pagination.current, pageNo: 0 }
    advanceFilterChange({ keys: { ...initialValues, ...appliedFilters, academicYearId: "" }, ignoredKeys })
    aoSelectionForm.setValues((prevState: any) => ({ ...prevState, ...appliedFilters }));
    getAoSelectionApiCall(appliedFilters)
  }

  const clearFilterHndlr = () => {
    if (academicYearListResp) {
      pagination.current = { ...pagination.current, pageNo: 0 }
      const { academicYearId } = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current") || {}
      const curriculumId = aoSelectionForm.values.curriculumId;
      const classId = aoSelectionForm.values.classId;
      aoSelectionForm.setValues({ ...initialValues, academicYearId: academicYearId || "", curriculumId, classId })
      getCurriculumApiCall({ academicYearId })
      getAoSelectionApiCall({ ...initialValues, academicYearId, curriculumId, classId })
      advanceFilterChange({ keys: { ...initialValues }, ignoredKeys: [] });
    }
  };

  const columns = useMemo(() => generateColumns(menuOptions), []);
  const { data: academicYearList } = academicYearListResp || {};
  const { data: curriculumTypes } = brchCurriculumResp || {}
  const { content: classTypes } = branchClassResp || {};
  const { content: studentList, totalElements, totalPages, pageable } = getAoTermSubjectsResp || {}

  return (
    <>
      <div className="card d-inline-block w-100">
        <form onSubmit={aoSelectionForm.handleSubmit}>
          <div className="row bg-light m-3 pb-3 px-2 g-3 examination">

            <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
              <div className="search-box">
                <TextInput
                  name="searchString"
                  formgroupClassName="mb-0"
                  placeHolder="Search"
                  labelText="Search"
                  floatingLabel
                  inputClassName="bg-light"
                  value={aoSelectionForm.values.searchString}
                  onChange={filterHandler}
                />
                <i className="ri-search-line search-icon"></i>
              </div>
            </div>
            <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
              <SelectInput
                name="academicYearId"
                value={aoSelectionForm.values.academicYearId}
                onChange={filterHandler}
                menuItems={academicYearList || []}
                valueKey="academicYearId"
                textKey="academicYearName"
                labelText="Academic Year"
                labelClass="required"
                formgroupClassName="mb-0"
                floatingLabel
                inputClassName="bg-light"
                invalid={(aoSelectionForm.touched.academicYearId && aoSelectionForm.errors.academicYearId) ? true : false}
                error={(aoSelectionForm.touched.academicYearId && aoSelectionForm.errors.academicYearId) ? aoSelectionForm.errors.academicYearId : ""}
              />
            </div>
            <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
              <SelectInput
                name="curriculumId"
                value={aoSelectionForm.values.curriculumId}
                onChange={filterHandler}
                menuItems={curriculumTypes}
                valueKey="branchCurriculumId"
                textKey="curriculumName"
                labelText="Curriculum"
                labelClass="required"
                formgroupClassName="mb-0"
                floatingLabel
                inputClassName="bg-light"
                isDisabled={!isEy}
                invalid={(aoSelectionForm.touched.curriculumId && aoSelectionForm.errors.curriculumId) ? true : false}
                error={(aoSelectionForm.touched.curriculumId && aoSelectionForm.errors.curriculumId) ? aoSelectionForm.errors.curriculumId : ""}
              />
            </div>
            <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
              <SelectInput
                name="classId"
                value={aoSelectionForm.values.classId}
                onChange={filterHandler}
                menuItems={classTypes}
                valueKey="id"
                textKey="shortName"
                labelText="Class"
                labelClass="required"
                formgroupClassName="mb-0"
                floatingLabel
                inputClassName="bg-light"
                invalid={(aoSelectionForm.touched.classId && aoSelectionForm.errors.classId) ? true : false}
                error={(aoSelectionForm.touched.classId && aoSelectionForm.errors.classId) ? aoSelectionForm.errors.classId : ""}
              />
            </div>
            <div className="col-1">
              <button
                style={{
                  backgroundColor: "#F4F7FA",
                  border: "1px solid #ced4da",
                }}
                onClick={toggleAdvanceFilter}
                className="p-2 btn d-flex"
              >
                <FilterSvg height={"18px"} width={"18px"} />
                <span className='ms-2'>Filters</span>
              </button>
              <span className="badge align-middle rounded-pill ms-1 " style={{ marginBottom: "18px", position: "absolute", top: "-9px", left: "78px", background: "#0ab39c" }}>
                {count}
              </span>
            </div>
            {showClearFilterState && (
              <div className="col-auto ms-auto d-flex">
                <button
                  type="button"
                  onClick={clearFilterHndlr}
                  className="btn btn-ghost-danger"
                >
                  Clear filter
                </button>
              </div>
            )}

            <div className="col-auto ms-auto">
              <button
                className="btn btn-success float-end d-flex align-items-center"
                onClick={() => openAoSectionModal()}
              >
                <i className="ri-add-line me-2" />
                Add New
              </button>
            </div>
          </div>
        </form>

        <TableContainer
          columns={columns || []}
          data={studentList || []}
          tableClass="mb-0"
          divClass="table-responsive mb-3"
          theadClass="table-light text-muted align-middle"
          showPagination={true}
          totalPages={totalPages || 0}
          totalRecords={totalElements || 0}
          callbackPaginationHndlr={paginationHndlr}
          currentPageNumber={pageable?.pageNumber || 0}
        />
      </div>
      <ModalContainerUpdated
        id="detensions-or-promotions"
        isOpen={aoselectionModelState.showModal}
        toggle={closeAoSectionModal}
        modalTitle="Ao's Selection"
        modalSize="xl"
      >
        <AoselectionModel
          isOpen={aoselectionModelState.showModal}
          toggle={closeAoSectionModal}
          modalTitle="Ao's Selection"
          modalData={aoSelectionForm.values}
          modalData1={aoselectionModelState.modalData}
        />
      </ModalContainerUpdated>
      <ConfirmationModal
        id="delete-examination-ao-selection"
        isOpen={delAoSectionModalState.showModal}
        confirmMessage="Are you sure you want to delete this Ao Selection ?"
        cancelHndlr={closeDelAoSectionModal}
        confirmHndlr={delModalSubmitHndlr}
        showImgIcon={true}
        isDisble={showApiLoader}
        iconType="reject"
      />

      <OffCanvasContainer
        isOpen={open}
        headerTitle="Advance Filters"
        closeHndlr={toggleAdvanceFilter}
        id="advance-filter-book-issuance"
      >
        <AdvanceFilterModal
          appliedFilter={aoSelectionForm.values}
          applyFilterCallback={advanceFilterCallbckHndlr}
          toggleAdvanceFilter={toggleAdvanceFilter}
          isOpen={open}
        />
      </OffCanvasContainer>
    </>
  );
};

export default AoSelection;
