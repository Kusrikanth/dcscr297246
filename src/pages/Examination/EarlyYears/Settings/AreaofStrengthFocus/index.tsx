import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ConfirmationModal, CustomSelect, ModalContainerUpdated, OffCanvasContainer, SelectInput, TextInput } from "../../../../../Components/Common";
import TableContainer from "../../../../../Components/Common/TableContainer";
import { generateColumns, renderOptionsEmployee, renderValueSection, ignoredKeys } from "./helper";
import { default as EditSvg } from "../../../../../assets/imagesdps/academics/EditSvg.svg?react";
import { default as DeleteIconSvg } from "../../../../../assets/imagesdps/academics/DeleteIconSvg.svg?react";
import { useFormik } from "formik";
import BreadCrumb from "../../../../../Components/Common/BreadCrumb";
import { useModal } from "../../../../../hooks/modalhook";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { generateActionPayload } from "../../../../../utility/reduxutility";
import { getBranchClassAct, getBranchCurriculumAct, resetBrchClassAct } from "../../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { toast } from "react-toastify";
import { getAreaofStrengthFocusByIdAct, getAreaofStrengthFocusListAct } from "../../../../../store/examination/examinationsettings/examinationsettingsaction";
import { IPaginationState } from "../../../../../Components/Common/Pagination";
import { debounce } from "../../../../../utility/commonutility";
import { useLocation } from "react-router-dom";
import { getEmployeeByFilterAct } from "../../../../../store/directory/employeemanagement/employeemanagementactions";
import { default as FilterSvg } from "../../../../../assets/imagesdps/academics/FilterSvg.svg?react";
import { useFilterState } from "../../../../../hooks/filterhook";
import AdvanceFilterModal from "./AdvancedFilterModal";
import { getAssignedClassSubjectsList } from "../../../../../store/academic/classSubjects/classsubjectsactions";
import AreaofStrengthFocusModel from "./AreaofStrengthFocusModel";


const initialValues = {
  searchString: "",
  academicYearId: "",
  classId: "",
  subjectId: "",
  curriculumId: "",
};

const AreaofStrengthFocus = () => {
  const { closeModal: closeAreaofStrengthFocusModal, modalState: AreaofStrengthFocusUploadModalState, openModal: AreaofStrengthFocusUploadModal } = useModal();
  const { closeModal: closeDelAreaofStrengthFocusModal, modalState: delAreaofStrengthFocusModalState, openModal: openDelAreaofStrengthFocusModal } = useModal();
  const classApiCalled = useRef(false);
  const { showClearFilterState, advanceFilterChange, count } = useFilterState();
  const [open, setOpen] = useState<boolean>(false);


  const isEy = location.pathname.includes("/early-years-settings/area-of-strength-focus");

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
    getAreaofStrengthFocusListResp,
    saveAreaofStrengthFocusResp,
    updateAreaofStrengthFocusResp,

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
      getAreaofStrengthFocusListResp: examinationSettings.getAreaofStrengthFocusListResp,
      saveAreaofStrengthFocusResp: examinationSettings.saveAreaofStrengthFocusResp,
      updateAreaofStrengthFocusResp: examinationSettings.updateAreaofStrengthFocusResp,

    }),
    shallowEqual
  );

  const AreaofStrengthFocusRef = useRef({
    prevCbseExaminationErrorAct: cbseExaminationErrorAct,
    prevsaveAreaofStrengthFocusResp: saveAreaofStrengthFocusResp,
    prevupdateAreaofStrengthFocusResp: updateAreaofStrengthFocusResp,
  })

  useEffect(() => {
    const { prevCbseExaminationErrorAct, prevsaveAreaofStrengthFocusResp, prevupdateAreaofStrengthFocusResp } = AreaofStrengthFocusRef.current || {}

    if (cbseExaminationErrorAct && prevCbseExaminationErrorAct !== cbseExaminationErrorAct) {
      const { details } = cbseExaminationErrorAct || {}
      toast.error(details || "Something went wrong")
    }
    else if (saveAreaofStrengthFocusResp && prevsaveAreaofStrengthFocusResp !== saveAreaofStrengthFocusResp) {
      toast.success("AO Mapping Added successfully")
      getAreaofStrengthFocusApiCall();
      closeAreaofStrengthFocusModal();
    }
    else if (updateAreaofStrengthFocusResp && prevupdateAreaofStrengthFocusResp !== updateAreaofStrengthFocusResp) {
      toast.success("AO Mapping Updated successfully")
      getAreaofStrengthFocusApiCall();
      closeAreaofStrengthFocusModal();
    }
    AreaofStrengthFocusRef.current.prevCbseExaminationErrorAct = cbseExaminationErrorAct;
    AreaofStrengthFocusRef.current.prevsaveAreaofStrengthFocusResp = saveAreaofStrengthFocusResp;
    AreaofStrengthFocusRef.current.prevupdateAreaofStrengthFocusResp = updateAreaofStrengthFocusResp;
  }, [cbseExaminationErrorAct, saveAreaofStrengthFocusResp, updateAreaofStrengthFocusResp])


  const AreaofStrengthFocusForm = useFormik({
    enableReinitialize: true,
    initialValues,
    onSubmit: (values) => { },
  });


  function editScheduleTaskModalHndlr(event: React.MouseEvent<HTMLElement>) {
    const id = event.currentTarget.getAttribute("data-id");
    dispatch(getAreaofStrengthFocusByIdAct(generateActionPayload('get_area_strength_focus_by_id', { id })));
    AreaofStrengthFocusUploadModal(id);
  }

  const menuOptions = useMemo(
    () => [
      {
        id: "edit",
        actionIcon: <EditSvg color="#405189" />,
        actionName: "Edit",
        onClickHndlr: editScheduleTaskModalHndlr,
      }
    ],
    []
  );


  const getCurriculumApiCall = (otherProps?: any) => {
    const payload1 = { instituteId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", ...otherProps };
    dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
  }


  const getAreaofStrengthFocusApiCall = (otherProps?: any) => {
    const payload = {
      branchId,
      academicYearId: AreaofStrengthFocusForm.values.academicYearId,
      curriculumId: AreaofStrengthFocusForm.values.curriculumId,
      classId: AreaofStrengthFocusForm.values.classId,
      searchString: AreaofStrengthFocusForm.values.searchString,
      subjectId: AreaofStrengthFocusForm.values.subjectId,
      ...pagination.current,
      ...otherProps,
    }
    dispatch(getAreaofStrengthFocusListAct(generateActionPayload("get_area_strength_focus", undefined, payload)));
  }

  useEffect(() => {
    let yearId = academicYearListResp?.data.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId;
    if (yearId) {
      getAreaofStrengthFocusApiCall({ academicYearId: yearId });
      AreaofStrengthFocusForm.setValues((prev: any) => ({ ...prev, academicYearId: yearId }));
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

    if (Array.isArray(data) && data.length > 0 && AreaofStrengthFocusForm.values.academicYearId && !classApiCalled.current) {
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
        academicYearId: AreaofStrengthFocusForm.values.academicYearId,
        sortBy: "classSequence",
        classFilter: isEy ? "EARLY" : "HIGHER",
        orderBy: "asc",
        pageNo: 0,
        pageSize: 100,
      };
      dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
         AreaofStrengthFocusForm.setValues((prev: any) => ({
      ...prev,
      curriculumId: String(branchCurriculumId),
    }));
      classApiCalled.current = true;
      getSubjectList({ curriculumId: branchCurriculumId });
      getClassApiCall(branchCurriculumId);
    }
    }
  }, [brchCurriculumResp, AreaofStrengthFocusForm.values.academicYearId]);

  useEffect(() => {
    const { content } = branchClassResp || {};
    if (Array.isArray(content) && content.length > 0) {
      AreaofStrengthFocusForm.setFieldValue("classId", content[0].id);
      getSubjectList({ branchClassId: content[0]?.id });
      getAreaofStrengthFocusApiCall({ classId: content[0]?.id });
    }
  }, [branchClassResp])

  const getSubjectList = (otherProps?: any) => {
    const payload = {
      academicYearId: AreaofStrengthFocusForm.values.academicYearId, curriculumId: AreaofStrengthFocusForm.values.curriculumId, branchClassId: AreaofStrengthFocusForm.values.classId,
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
    getAreaofStrengthFocusApiCall(paginationInfo);
  }

  function search(value: string) {
    getAreaofStrengthFocusApiCall({ ...AreaofStrengthFocusForm.values, searchString: value });
  }
  const toggleAdvanceFilter = () => {
    setOpen(prev => !prev);
  }
  function advanceFilterCallbckHndlr(appliedFilters?: any) {
    pagination.current = { ...pagination.current, pageNo: 0 }
    advanceFilterChange({ keys: { ...initialValues, ...appliedFilters, academicYearId: "" }, ignoredKeys })
    AreaofStrengthFocusForm.setValues((prevState: any) => ({ ...prevState, ...appliedFilters }));
    getAreaofStrengthFocusApiCall(appliedFilters)
  }


  const debounceFun = useCallback(debounce(search, 200), [getAreaofStrengthFocusListResp]);

  const filterHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    pagination.current.pageNo = 0;
    if (name === "searchString") {
      AreaofStrengthFocusForm.setValues((prev: any) => ({ ...prev, [name]: value }))
      debounceFun(value);
    }
    else if (name === "curriculumId") {
      AreaofStrengthFocusForm.setValues((prev: any) => ({ ...prev, [name]: value }));

      if (!value) {
        dispatch(resetBrchClassAct(undefined));
      } else {
        getClassApiCall(value);
        getSubjectList(value);
      }
    } else if (name === 'classId') {
      AreaofStrengthFocusForm.setValues((prev: any) => ({ ...prev, [name]: value, subjectId: "" }));
      getSubjectList({ branchClassId: value });
      getAreaofStrengthFocusApiCall({ classId: value, subjectId: "" });
    } else {
      AreaofStrengthFocusForm.setValues((prev: any) => ({ ...prev, [name]: value }))
      getAreaofStrengthFocusApiCall({ [name]: value });
    }
  }

  const columns = useMemo(() => generateColumns(menuOptions), []);

  const { data: curriculumTypes } = brchCurriculumResp || {}
  const { content: classTypes } = branchClassResp || {};
  const { data: studentAreaofStrengthFocusResp, totalElements, totalPages, pageable } = getAreaofStrengthFocusListResp || {}
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
                  <h4 className="card-title mb-0 flex-grow-1">Area of Strength & Focus</h4>
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
                      value={AreaofStrengthFocusForm.values.searchString}
                      onChange={filterHandler}
                    />
                    <i className="ri-search-line search-icon"></i>
                  </div>
                </div>
                <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                  <SelectInput
                    name="academicYearId"
                    value={AreaofStrengthFocusForm.values.academicYearId}
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
                    value={AreaofStrengthFocusForm.values.curriculumId}
                    onChange={filterHandler}
                    menuItems={curriculumTypes}
                    valueKey="branchCurriculumId"
                    textKey="curriculumName"
                    labelText="Curriculum"
                    labelClass="required"
                    isDisabled={!isEy}
                    floatingLabel
                      inputClassName="bg-light"
                    invalid={(AreaofStrengthFocusForm.touched.curriculumId && AreaofStrengthFocusForm.errors.curriculumId) ? true : false}
                    error={(AreaofStrengthFocusForm.touched.curriculumId && AreaofStrengthFocusForm.errors.curriculumId) ? AreaofStrengthFocusForm.errors.curriculumId : ""}
                  />
                </div>
                <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                  <SelectInput
                    name="classId"
                    value={AreaofStrengthFocusForm.values.classId}
                    onChange={filterHandler}
                    menuItems={classTypes}
                    valueKey="id"
                    textKey="shortName"
                    labelText="Class"
                    labelClass="required"
                    floatingLabel
                      inputClassName="bg-light"
                    invalid={(AreaofStrengthFocusForm.touched.classId && AreaofStrengthFocusForm.errors.classId) ? true : false}
                    error={(AreaofStrengthFocusForm.touched.classId && AreaofStrengthFocusForm.errors.classId) ? AreaofStrengthFocusForm.errors.classId : ""}
                  />
                </div>
                {/* <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2"> */}
                  {/* <SelectInput
                    name="subjectId"
                    value={AreaofStrengthFocusForm.values.subjectId}
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
                    value={AreaofStrengthFocusForm.values.subjectId}
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
                    onClick={() => AreaofStrengthFocusUploadModal()}
                  >
                    <i className="ri-add-line me-2" />
                    Add New
                  </button>
                </div>
              </div>

              <TableContainer
                columns={columns || []}
                data={studentAreaofStrengthFocusResp || []}
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
        isOpen={AreaofStrengthFocusUploadModalState.showModal}
        toggle={() => closeAreaofStrengthFocusModal()}
        modalTitle={AreaofStrengthFocusUploadModalState.modalData ? "Edit Area of Strength & Focus" : "Add Area of Strength & Focus"}
        modalSize="md"
      >
        <AreaofStrengthFocusModel
          id={AreaofStrengthFocusUploadModalState.modalData}
          isOpen={false}
          toggle={() => closeAreaofStrengthFocusModal()}
          modalTitle="Create Detail"
          modalData={AreaofStrengthFocusForm.values}
          modalData1={AreaofStrengthFocusUploadModalState.modalData}
        />
      </ModalContainerUpdated>
      <OffCanvasContainer
              isOpen={open}
              headerTitle="Advance Filters"
              closeHndlr={toggleAdvanceFilter}
              id="advance-filter-book-issuance"
            >
              <AdvanceFilterModal
                appliedFilter={AreaofStrengthFocusForm.values}
                applyFilterCallback={advanceFilterCallbckHndlr}
                toggleAdvanceFilter={toggleAdvanceFilter}
                isOpen={open}
                branchId={branchId}
              />
            </OffCanvasContainer>
    </>
  );
};

export default AreaofStrengthFocus;
