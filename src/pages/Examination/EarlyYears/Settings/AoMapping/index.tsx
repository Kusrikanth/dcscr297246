import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ConfirmationModal, CustomSelect, ModalContainerUpdated, OffCanvasContainer, SelectInput, TextInput } from "../../../../../Components/Common";
import TableContainer from "../../../../../Components/Common/TableContainer";
import { generateColumns, renderOptionsEmployee, renderValueSection, ignoredKeys } from "./helper";
import { default as EditSvg } from "../../../../../assets/imagesdps/academics/EditSvg.svg?react";
import { default as DeleteIconSvg } from "../../../../../assets/imagesdps/academics/DeleteIconSvg.svg?react";
import { useFormik } from "formik";
import AoMappingModel from "./AoMappingModel";
import BreadCrumb from "../../../../../Components/Common/BreadCrumb";
import { useModal } from "../../../../../hooks/modalhook";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { generateActionPayload } from "../../../../../utility/reduxutility";
import { getBranchClassAct, getBranchCurriculumAct, resetBrchClassAct } from "../../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { toast } from "react-toastify";
import { deleteAoMappingSubjectAct, getAoMappingSubjectAct, getAoMappingSubjectByIdAct, getSubjectListAct } from "../../../../../store/examination/examinationsettings/examinationsettingsaction";
import { IPaginationState } from "../../../../../Components/Common/Pagination";
import { debounce } from "../../../../../utility/commonutility";
import { useLocation } from "react-router-dom";
import { getEmployeeByFilterAct } from "../../../../../store/directory/employeemanagement/employeemanagementactions";
import { default as FilterSvg } from "../../../../../assets/imagesdps/academics/FilterSvg.svg?react";
import { useFilterState } from "../../../../../hooks/filterhook";
import AdvanceFilterModal from "./AdvancedFilterModal";
import { getAssignedClassSubjectsList } from "../../../../../store/academic/classSubjects/classsubjectsactions";


const initialValues = {
  searchString: "",
  academicYearId: "",
  classId: "",
  subjectId: "",
  curriculumId: "",
};

const AoMapping = () => {
  const { closeModal: closeAoDataUploadModalModal, modalState: aoMappingUploadModalState, openModal: aoMappingUploadModal } = useModal();
  const { closeModal: closeDelAoMappingModal, modalState: delAoMappingModalState, openModal: openDelAoMappingModal } = useModal();
  const classApiCalled = useRef(false);
  const { showClearFilterState, advanceFilterChange, count } = useFilterState();
  const [open, setOpen] = useState<boolean>(false);


  const isEy = location.pathname.includes("/early-years-settings/ao-mapping");

  const dispatch = useAppDispatch();
  const pagination = useRef({
    pageNo: 0,
    pageSize: 10
  })


  const {
    academicYearListResp,
    brchCurriculumResp,
    branchClassResp,
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    showApiLoader,
    cbseExaminationErrorAct,
    getSubjectListResp,
    getAoMappingSubjectResp,
    saveAoMappingSubjectResp,
    deleteAoMappingSubjectResp,
    updateAoMappingSubjectResp,

  } = useAppSelector(
    ({ globalData, instAcademics, branchAcademics, appData, examinationSettings }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      branchClassResp: branchAcademics.branchClassResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      showApiLoader: globalData.showApiLoader,
      cbseExaminationErrorAct: examinationSettings.cbseExaminationErrorAct,
      getSubjectListResp: examinationSettings.getSubjectListResp,
      getAoMappingSubjectResp: examinationSettings.getAoMappingSubjectResp,
      saveAoMappingSubjectResp: examinationSettings.saveAoMappingSubjectResp,
      deleteAoMappingSubjectResp: examinationSettings.deleteAoMappingSubjectResp,
      updateAoMappingSubjectResp: examinationSettings.updateAoMappingSubjectResp,

    }),
    shallowEqual
  );

  const aoMappingRef = useRef({
    prevCbseExaminationErrorAct: cbseExaminationErrorAct,
    prevSaveAoMappingSubjectResp: saveAoMappingSubjectResp,
    prevDeleteAoMappingSubjectResp: deleteAoMappingSubjectResp,
    prevUpdateAoMappingSubjectResp: updateAoMappingSubjectResp,
  })

  useEffect(() => {
    const { prevCbseExaminationErrorAct, prevSaveAoMappingSubjectResp, prevDeleteAoMappingSubjectResp, prevUpdateAoMappingSubjectResp } = aoMappingRef.current || {}

    if (cbseExaminationErrorAct && prevCbseExaminationErrorAct !== cbseExaminationErrorAct) {
      const { details } = cbseExaminationErrorAct || {}
      toast.error(details || "Something went wrong")
    }
    else if (saveAoMappingSubjectResp && prevSaveAoMappingSubjectResp !== saveAoMappingSubjectResp) {
      toast.success("AO Mapping Added successfully")
      getAoMappingApiCall();
      closeAoDataUploadModalModal();
    }
    else if (deleteAoMappingSubjectResp && prevDeleteAoMappingSubjectResp !== deleteAoMappingSubjectResp) {
      toast.success("AO Mapping Deleted successfully")
      getAoMappingApiCall();
      closeDelAoMappingModal();
    }
    else if (updateAoMappingSubjectResp && prevUpdateAoMappingSubjectResp !== updateAoMappingSubjectResp) {
      toast.success("AO Mapping Updated successfully")
      getAoMappingApiCall();
      closeAoDataUploadModalModal();
    }
    aoMappingRef.current.prevCbseExaminationErrorAct = cbseExaminationErrorAct;
    aoMappingRef.current.prevSaveAoMappingSubjectResp = saveAoMappingSubjectResp;
    aoMappingRef.current.prevDeleteAoMappingSubjectResp = deleteAoMappingSubjectResp;
    aoMappingRef.current.prevUpdateAoMappingSubjectResp = updateAoMappingSubjectResp;
  }, [cbseExaminationErrorAct, saveAoMappingSubjectResp, deleteAoMappingSubjectResp, updateAoMappingSubjectResp])


  const aoMappingForm = useFormik({
    enableReinitialize: true,
    initialValues,
    onSubmit: (values) => { },
  });


  function editScheduleTaskModalHndlr(event: React.MouseEvent<HTMLElement>) {
    const id = event.currentTarget.getAttribute("data-id");
    dispatch(getAoMappingSubjectByIdAct(generateActionPayload('get_ao_mapping_subjects_by_id', { id })));
    aoMappingUploadModal(id);
  }

  const menuOptions = useMemo(
    () => [
      {
        id: "edit",
        actionIcon: <EditSvg color="#405189" />,
        actionName: "Edit",
        onClickHndlr: editScheduleTaskModalHndlr,
      },
      {
        id: "delete",
        actionIcon: <DeleteIconSvg className="me-2" fill="#f06548" />,
        actionName: "Delete",
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute("data-id");
          openDelAoMappingModal(id)
        },
      },
    ],
    []
  );


  const getCurriculumApiCall = (otherProps?: any) => {
    const payload1 = { instituteId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", ...otherProps };
    dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
  }


  const getAoMappingApiCall = (otherProps?: any) => {
    const payload = {
      branchId,
      academicYearId: aoMappingForm.values.academicYearId,
      curriculumId: aoMappingForm.values.curriculumId,
      classId: aoMappingForm.values.classId,
      searchString: aoMappingForm.values.searchString,
      subjectId: aoMappingForm.values.subjectId,
      ...pagination.current,
      ...otherProps,
    }
    dispatch(getAoMappingSubjectAct(generateActionPayload("get_ao_mapping_subjects", undefined, payload)));
  }

  function delModalSubmitHndlr() {
    dispatch(deleteAoMappingSubjectAct(generateActionPayload("delete_ao_mapping_subjects", { id: delAoMappingModalState.modalData })));
  }

  useEffect(() => {
    let yearId = academicYearListResp?.data.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId;
    if (yearId) {
      getAoMappingApiCall({ academicYearId: yearId });
      aoMappingForm.setValues((prev: any) => ({ ...prev, academicYearId: yearId }));
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
  useEffect(() => {
    const { data } = brchCurriculumResp || {};

    if (Array.isArray(data) && data.length > 0 && aoMappingForm.values.academicYearId && !classApiCalled.current) {
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
      if (selectedCurriculum) {
        const branchCurriculumId = selectedCurriculum.branchCurriculumId;
      const payload = {
        branchId,
        curriculumId: branchCurriculumId,
        academicYearId: aoMappingForm.values.academicYearId,
        sortBy: "classSequence",
        classFilter: isEy ? "EARLY" : "HIGHER",
        orderBy: "asc",
        pageNo: 0,
        pageSize: 100,
      };
      dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
         aoMappingForm.setValues((prev: any) => ({
      ...prev,
      curriculumId: String(branchCurriculumId),
    }));
      classApiCalled.current = true;
      getSubjectList({ curriculumId: branchCurriculumId });
      getClassApiCall(branchCurriculumId);
    }
    }
  }, [brchCurriculumResp, aoMappingForm.values.academicYearId]);

  useEffect(() => {
    const { content } = branchClassResp || {};
    if (Array.isArray(content) && content.length > 0) {
      aoMappingForm.setFieldValue("classId", content[0].id);
      getSubjectList({ branchClassId: content[0]?.id });
      getAoMappingApiCall({ classId: content[0]?.id });
    }
  }, [branchClassResp])

  const getSubjectList = (otherProps?: any) => {
    const payload = {
      academicYearId: aoMappingForm.values.academicYearId, curriculumId: aoMappingForm.values.curriculumId, branchClassId: aoMappingForm.values.classId,
      sortBy: "subjectName", orderBy: "asc",
      pageNo: 0, pageSize: 100,
      ...otherProps
    }
    if (payload.academicYearId) {
      dispatch(
        getAssignedClassSubjectsList(
          generateActionPayload("get_assigned_class_subject_list", undefined, payload)
        )
      );
    }
  }

  function getClassApiCall(curriculumId: string,) {
    const payload = {
      curriculumId,
      branchId,
      pageNo: 0,
      pageSize: 100,
      sortBy: "classSequence",
      classFilter: isEy ? "EARLY" : "HIGHER",
      orderBy: "asc",
    };
    dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
  }

  function paginationHndlr(paginationInfo: IPaginationState) {
    pagination.current = paginationInfo;
    getAoMappingApiCall(paginationInfo);
  }

  function search(value: string) {
    getAoMappingApiCall({ ...aoMappingForm.values, searchString: value });
  }
  const toggleAdvanceFilter = () => {
    setOpen(prev => !prev);
  }
  function advanceFilterCallbckHndlr(appliedFilters?: any) {
    pagination.current = { ...pagination.current, pageNo: 0 }
    advanceFilterChange({ keys: { ...initialValues, ...appliedFilters, academicYearId: "" }, ignoredKeys })
    aoMappingForm.setValues((prevState: any) => ({ ...prevState, ...appliedFilters }));
    getAoMappingApiCall(appliedFilters)
  }


  const debounceFun = useCallback(debounce(search, 200), [getAoMappingSubjectResp]);

  const filterHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    pagination.current.pageNo = 0;
    if (name === "searchString") {
      aoMappingForm.setValues((prev: any) => ({ ...prev, [name]: value }))
      debounceFun(value);
    }
    else if (name === "curriculumId") {
      aoMappingForm.setValues((prev: any) => ({ ...prev, [name]: value }));

      if (!value) {
        dispatch(resetBrchClassAct(undefined));
      } else {
        getClassApiCall(value);
        getSubjectList(value);
      }
    } else if (name === 'classId') {
      aoMappingForm.setValues((prev: any) => ({ ...prev, [name]: value, subjectId: "" }));
      getSubjectList({ branchClassId: value });
      getAoMappingApiCall({ classId: value, subjectId: "" });
    } else {
      aoMappingForm.setValues((prev: any) => ({ ...prev, [name]: value }))
      getAoMappingApiCall({ [name]: value });
    }
  }

  const columns = useMemo(() => generateColumns(menuOptions), []);

  const { data: curriculumTypes } = brchCurriculumResp || {}
  const { content: classTypes } = branchClassResp || {};
  const { content: studentAoMappingResp, totalElements, totalPages, pageable } = getAoMappingSubjectResp || {}
const { data: academicYearList } = academicYearListResp || {};

  return (
    <>
      <div className="page-content free_payment_record_wrapper">
        <div className="container-fluid">
          <BreadCrumb title="Examination" pageTitle="Examination" />

          <div className="card">
            <div className="card-header">
              <div className="row align-items-center">
                <div className="col-6">
                  <h4 className="card-title mb-0 flex-grow-1">Ao Mapping</h4>
                </div>
              </div>
            </div>
            <div className="card-body p-0">
              <div className="row bg-light m-3 px-2 g-3 examination">
                <div className="col-xs-12 col-md-12 col-lg-3 col-xl-3">
                  <div className="search-box">
                    <TextInput
                      name="searchString"
                      formgroupClassName="mb-0"
                      placeHolder="Search"
                      labelText="Search"
                      floatingLabel
                      inputClassName="bg-light"
                      value={aoMappingForm.values.searchString}
                      onChange={filterHandler}
                    />
                    <i className="ri-search-line search-icon"></i>
                  </div>
                </div>
                <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                  <SelectInput
                    name="academicYearId"
                    value={aoMappingForm.values.academicYearId}
                    onChange={filterHandler}
                    menuItems={academicYearList || []}
                    valueKey="academicYearId"
                    textKey="academicYearName"
                    formgroupClassName="mb-0"
                    labelText="Academic Year"
                    floatingLabel
                    inputClassName="bg-light"
                  />
                </div>
                <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                  <SelectInput
                    name="curriculumId"
                    value={aoMappingForm.values.curriculumId}
                    onChange={filterHandler}
                    menuItems={curriculumTypes}
                    valueKey="branchCurriculumId"
                    textKey="curriculumName"
                    labelText="Curriculum"
                    labelClass="required"
                    isDisabled={!isEy}
                    floatingLabel
                      inputClassName="bg-light"
                    invalid={(aoMappingForm.touched.curriculumId && aoMappingForm.errors.curriculumId) ? true : false}
                    error={(aoMappingForm.touched.curriculumId && aoMappingForm.errors.curriculumId) ? aoMappingForm.errors.curriculumId : ""}
                  />
                </div>
                <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                  <SelectInput
                    name="classId"
                    value={aoMappingForm.values.classId}
                    onChange={filterHandler}
                    menuItems={classTypes}
                    valueKey="id"
                    textKey="shortName"
                    labelText="Class"
                    labelClass="required"
                    floatingLabel
                      inputClassName="bg-light"
                    invalid={(aoMappingForm.touched.classId && aoMappingForm.errors.classId) ? true : false}
                    error={(aoMappingForm.touched.classId && aoMappingForm.errors.classId) ? aoMappingForm.errors.classId : ""}
                  />
                </div>
                {/* <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2"> */}
                  {/* <SelectInput
                    name="subjectId"
                    value={aoMappingForm.values.subjectId}
                    onChange={filterHandler}
                    menuItems={getSubjectListResp?.data}
                    valueKey="id"
                    textKey="subjectName"
                    formgroupClassName="mb-0"
                    labelText="Subject"
                    floatingLabel
                      inputClassName="bg-light"
                  /> */}

                  {/* <CustomSelect
                    name="subjectId"
                    idKey="id"
                    defaultSelect="Select"
                    value={aoMappingForm.values.subjectId}
                    renderValue={renderValueSection}
                    renderOptions={renderOptionsEmployee}
                    onChange={selectSectionHndlr}
                    onSearchHandler={onSearchMultiSelectHandleremployee}
                    labelText='Subject'
                    containerClassName="mb-3"
                    options={getSubjectListResp?.data}
                  /> */}
                {/* </div> */}

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
                <div className="col-auto ms-auto">
                  <button
                    className="btn btn-success float-end d-flex align-items-center"
                    onClick={() => aoMappingUploadModal()}
                  >
                    <i className="ri-add-line me-2" />
                    Add New
                  </button>
                </div>
              </div>

              <TableContainer
                columns={columns || []}
                data={studentAoMappingResp || []}
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
          </div>
        </div>
      </div>
      <ModalContainerUpdated
        id="add-examination"
        isOpen={aoMappingUploadModalState.showModal}
        toggle={() => closeAoDataUploadModalModal()}
        modalTitle={aoMappingUploadModalState.modalData ? "Edit Ao's Mapping" : "Add Ao's Mapping"}
        modalSize="md"
      >
        <AoMappingModel
          id={aoMappingUploadModalState.modalData}
          isOpen={false}
          toggle={() => closeAoDataUploadModalModal()}
          modalTitle="Create Detail"
          modalData={aoMappingForm.values}
          modalData1={aoMappingUploadModalState.modalData}
        />
      </ModalContainerUpdated>

      <ConfirmationModal
        id="delete-examination-ao-mapping"
        isOpen={delAoMappingModalState.showModal}
        confirmMessage="Are you sure you want to delete this Ao Mapping ?"
        cancelHndlr={closeDelAoMappingModal}
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
                appliedFilter={aoMappingForm.values}
                applyFilterCallback={advanceFilterCallbckHndlr}
                toggleAdvanceFilter={toggleAdvanceFilter}
                isOpen={open}
                branchId={branchId}
              />
            </OffCanvasContainer>
    </>
  );
};

export default AoMapping;
