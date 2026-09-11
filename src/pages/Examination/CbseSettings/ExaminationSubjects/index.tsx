import React, { useEffect, useMemo, useRef, useState } from "react";
import { ConfirmationModal, ModalContainerUpdated, OffCanvasContainer, SelectInput } from '../../../../Components/Common';
import TableContainer from '../../../../Components/Common/TableContainer';
import { generateCoscholasticGradeColumns, ignoredKeys } from "./helper";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { useFilterState } from "../../../../hooks/filterhook";
import { useModal } from "../../../../hooks/modalhook";
import { deleteCbseExaminationCoscholasticGradesListAct, getCBSEAllSubjectsOrderAct,  getCbseExaminationCoscholasticGradesListByIdAct } from "../../../../store/examination/examinationsettings/examinationsettingsaction";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import { getBranchClassAct, getBranchCurriculumAct, resetBrchClassAct } from "../../../../store/branchsettings/branchacademics/branchacademicsactions";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import { useFormik } from "formik";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02StrokeStandard, PencilEdit02Icon } from "@hugeicons-pro/core-stroke-standard";
import AddExaminationMarksModel from "./AddExaminationMarksModel";
import AddExaminationGradeModel from "./AddExaminationGradeModel";
import AdvanceFilterModal from "./AdvanceFilter";
import { default as FilterSvg } from "../../../../assets/imagesdps/academics/FilterSvg.svg?react";

const initialValues = {
  academicYearId: "",
  curriculumId: "",
  classId: "",
};

const ExaminationSubjects = () => {

  const dispatch = useAppDispatch();
  const { closeModal: closeDelCbseExaminationCoscholasticGradeModal, modalState: deleteCbseExaminationCoscholasticGradeState, openModal: openDelCbseExaminationCoscholasticGradeModal } = useModal();
  const { closeModal: closeDisplayOrderModal, modalState: displayOrderModalState, openModal: openDisplayOrderModal } = useModal();
  const { closeModal: closeCbseExaminationCoscholasticGradeUploadModal, modalState: cbseExaminationCoscholasticGradeUploadState, openModal: openCbseExaminationCoscholasticGradeUploadModal } = useModal();
  const { showClearFilterState, count, advanceFilterChange } = useFilterState()
  const [open, setOpen] = useState<boolean>(false);

  const cbseSubjectOrderList = (otherProps: any = {}) => {
    const {
      subjectType,
      scholasticType,
      coScholasticType,
      ...rest
    } = otherProps;

const payload = {
  branchId,
  academicYearId: coscholaticGradeForm.values.academicYearId,
  curriculumId: coscholaticGradeForm.values.curriculumId,
  classId: coscholaticGradeForm.values.classId,
  ...rest, 
  ...(subjectType
    ? {
        subjectType,
        ...(subjectType === "COSCHOLASTIC"
          ? { coScholasticType }
          : { scholasticType }),
      }
    : {}),
};    
    if(!payload.academicYearId || !payload.curriculumId || !payload.classId) return
    dispatch(getCBSEAllSubjectsOrderAct(generateActionPayload("get_cbse_all_subjects_order", undefined, payload)));
  };

  function delModalSubmitHndlr() {
    dispatch(deleteCbseExaminationCoscholasticGradesListAct(generateActionPayload("delete_cbse_examination_coscholastic_grades_list", { id: deleteCbseExaminationCoscholasticGradeState.modalData })));
  }

  const coscholaticGradeForm = useFormik({
    initialValues,
    onSubmit: (values) => { },
  });

  const {
    academicYearListResp,
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    brchCurriculumResp,
    branchClassResp,
    showApiLoader,
    getCbseExaminationCoscholasticGradesRequestListResp,
    saveCbseExaminationSubjectOrderResp,
    updateCbseExaminationSubjectOrderResp,
    cbseExaminationErrorAct,
    getCBSEAllSubjectsOrderResp
  } = useAppSelector(
    ({ instAcademics, branchAcademics, examinationSettings, appData, globalData, }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      showApiLoader: globalData.showApiLoader,
      currentInstIdResp: appData.currentInstIdResp,
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      branchClassResp: branchAcademics.branchClassResp,
      getCbseExaminationCoscholasticGradesRequestListResp: examinationSettings.getCbseExaminationCoscholasticGradesRequestListResp,
      saveCbseExaminationSubjectOrderResp: examinationSettings.saveCbseExaminationSubjectOrderResp,
      cbseExaminationErrorAct: examinationSettings.cbseExaminationErrorAct,
      getCBSEAllSubjectsOrderResp: examinationSettings.getCBSEAllSubjectsOrderResp,
      updateCbseExaminationSubjectOrderResp: examinationSettings.updateCbseExaminationSubjectOrderResp
    }),
    shallowEqual
  );

  const cbseExaminationCoscholasticGradesRef = useRef({
    prevSaveCbseExaminationSubjectOrderResp: saveCbseExaminationSubjectOrderResp,
    prevCbseExaminationCoscholasticGradesErrorResp: cbseExaminationErrorAct,
    prevUpdateCbseExaminationSubjectOrderResp: updateCbseExaminationSubjectOrderResp
  })

  useEffect(() => {
    const { prevSaveCbseExaminationSubjectOrderResp, prevCbseExaminationCoscholasticGradesErrorResp, prevUpdateCbseExaminationSubjectOrderResp } = cbseExaminationCoscholasticGradesRef.current;
     if (cbseExaminationErrorAct && prevCbseExaminationCoscholasticGradesErrorResp !== cbseExaminationErrorAct) {
      const { details } = cbseExaminationErrorAct || {};
      toast.error(details || "Something went wrong.");
    }
    else if (saveCbseExaminationSubjectOrderResp && prevSaveCbseExaminationSubjectOrderResp !== saveCbseExaminationSubjectOrderResp) {
      toast.success("Display order updated successfully.");
      closeCbseExaminationCoscholasticGradeUploadModal()
      cbseSubjectOrderList()
    }
    else if (updateCbseExaminationSubjectOrderResp && prevUpdateCbseExaminationSubjectOrderResp !== updateCbseExaminationSubjectOrderResp) {
      toast.success("Grade Book Order updated successfully.");
      closeDisplayOrderModal()
      cbseSubjectOrderList()
    }
    cbseExaminationCoscholasticGradesRef.current.prevSaveCbseExaminationSubjectOrderResp = saveCbseExaminationSubjectOrderResp;
    cbseExaminationCoscholasticGradesRef.current.prevCbseExaminationCoscholasticGradesErrorResp = cbseExaminationErrorAct;
    cbseExaminationCoscholasticGradesRef.current.prevUpdateCbseExaminationSubjectOrderResp = updateCbseExaminationSubjectOrderResp
  }, [saveCbseExaminationSubjectOrderResp, cbseExaminationErrorAct, updateCbseExaminationSubjectOrderResp]);

  useEffect(() => {
    const yearId = academicYearListResp?.data.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId;
    if (yearId) {      
      cbseSubjectOrderList({ academicYearId: yearId });
      coscholaticGradeForm.setFieldValue("academicYearId", yearId);
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

    if (Array.isArray(data) && data.length > 0 && coscholaticGradeForm.values.academicYearId && !classApiCalled.current) {
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
        const payload = {
          branchId,
          curriculumId: selectedCurriculum.branchCurriculumId,
          academicYearId: coscholaticGradeForm.values.academicYearId,
          sortBy: "classSequence",
          classFilter: "HIGHER",
          orderBy: "asc",
          pageNo: 0,
          pageSize: 100,
        };
        dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
        coscholaticGradeForm.setFieldValue("curriculumId", selectedCurriculum.branchCurriculumId);
        classApiCalled.current = true;
      }
    }
  }, [brchCurriculumResp, coscholaticGradeForm.values.academicYearId]);

  useEffect(() => {
    const { content } = branchClassResp || {};
    if (Array.isArray(content) && content.length > 0) {
      coscholaticGradeForm.setFieldValue("classId", content[0].id);
      cbseSubjectOrderList({ curriculumId: coscholaticGradeForm.values.curriculumId, classId: content[0].id, academicYearId: coscholaticGradeForm.values.academicYearId });
    }
  },[branchClassResp])

  const menuOptions = useMemo(
    () => [
      {
        id: "edit",
        actionIcon: <HugeiconsIcon icon={PencilEdit02Icon} className=" text-muted" size={20} />,
        actionName: "Edit",
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute("data-id");
          dispatch(getCbseExaminationCoscholasticGradesListByIdAct(generateActionPayload("get_cbse_examination_coscholastic_grades_details_list_by_id", { id })));
          openCbseExaminationCoscholasticGradeUploadModal(id);
        },
      },
      {
        id: "delete",
        actionIcon: <HugeiconsIcon icon={Delete02StrokeStandard} className="text-danger" size={18} />,
        actionName: "Delete",
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute("data-id");
          openDelCbseExaminationCoscholasticGradeModal(id)
        },
      },
    ],
    [getCbseExaminationCoscholasticGradesRequestListResp]
  );

  const getCurriculumApiCall = (otherProps?: any) => {
    const payload1 = { academicYearId: coscholaticGradeForm.values.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", ...otherProps };
    dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
  }
  function getClassApiCall(curriculumId: string, academicYearId: string) {
    const payload = {
      academicYearId,
      curriculumId,
      branchId,
      classFilter: "HIGHER",
      pageNo: 0,
      pageSize: 100,
      sortBy: "classSequence",
      orderBy: "asc",
    };
    dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
  }
  const toggleAdvanceFilter = () => {
    setOpen(prev => !prev);
  }
  const onChangeFilterHndlr = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    coscholaticGradeForm .setValues((prev: any) => {
      const updatedState = { ...prev, [name]: value };

      if (name === "academicYearId") {
        getCurriculumApiCall({ academicYearId: value });
        updatedState.classId = "";
        getClassApiCall(updatedState.curriculumId, value);
        cbseSubjectOrderList({ ...updatedState, classId: "" });
      } else if (name === "curriculumId") {
        if (!value) {
          dispatch(resetBrchClassAct(undefined))
        }
        else {
          getClassApiCall(value, coscholaticGradeForm.values.academicYearId);
        }
        updatedState.classId = "";
        cbseSubjectOrderList({ ...updatedState, classId: "" });
      } else {
        cbseSubjectOrderList(updatedState);
      }
      advanceFilterChange({ keys: { ...coscholaticGradeForm.values, [name]: value }, ignoredKeys });
      return updatedState;
    });
  };
  
  function clearFilterHndlr() {
    const { academicYearId } = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current") || {}
    const selectedCurriculum = brchCurriculumResp?.data?.find((item: { instituteCurriculumId: number }) => item.instituteCurriculumId === 1 ) || brchCurriculumResp?.data?.[0];
    const selectedClass = branchClassResp?.content?.find((item: { instituteCurriculumId: number }) => item.instituteCurriculumId === 1 ) || branchClassResp?.content?.[0];
    const curriculumId = selectedCurriculum?.branchCurriculumId || "";
    coscholaticGradeForm .setValues({ ...initialValues, academicYearId: academicYearId || "", curriculumId, classId: selectedClass?.id || "" });
    cbseSubjectOrderList({ ...initialValues, academicYearId, curriculumId, classId: selectedClass?.id || "" });
    advanceFilterChange({ keys: { ...initialValues, academicYearId, curriculumId, classId: selectedClass?.id || "" }, ignoredKeys })
    if (count) {
      setTimeout(() => {
        advanceFilterChange({ keys: {}, ignoredKeys });
      }, 0);
    }
  }

  function advanceFilterCallbckHndlr(appliedFilters?: any) {
      advanceFilterChange({ keys: { ...initialValues, ...appliedFilters }, ignoredKeys })
      coscholaticGradeForm.setValues((prevState: any) => ({ ...prevState, ...appliedFilters }));
      cbseSubjectOrderList(appliedFilters);
    }

  const examinationCoscholasticGrades = useMemo(() => generateCoscholasticGradeColumns(menuOptions, location.pathname.includes("cbse-settings")), []);
  const { data: academicYearList } = academicYearListResp || {};
  const { data: curriculumTypes } = brchCurriculumResp || {};
  const { content: classTypes } = branchClassResp || {};
  return (
    <>
      <div className="page-content free_payment_record_wrapper">
        <div className="container-fluid">
          <BreadCrumb title="Examination" pageTitle="Examination" />
          <div className="card">
            <div className="card-header">
              <div className="row align-items-center">
                <div className="col-6">
                  <h4 className="card-title mb-0 flex-grow-1">Examination Subjects</h4>
                </div>
              </div>
            </div>
            <div className="card-body p-0">
              <div className="row bg-light m-3 pb-3 px-2 g-3 examination">
                <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                  <SelectInput
                    name="academicYearId"
                    value={coscholaticGradeForm.values.academicYearId}
                    onChange={onChangeFilterHndlr}
                    menuItems={academicYearList}
                    valueKey="academicYearId"
                    textKey="academicYearName"
                    formgroupClassName="mb-0"
                    labelText='Academic Year'
                    floatingLabel
                    inputClassName="bg-light"
                    labelClass="required"
                  />
                </div>
                <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                  <SelectInput
                    name="curriculumId"
                    value={coscholaticGradeForm.values.curriculumId}
                    onChange={onChangeFilterHndlr}
                    menuItems={curriculumTypes}
                    valueKey="branchCurriculumId"
                    textKey="curriculumName"
                    formgroupClassName="mb-0"
                    labelText='Curriculum'
                    floatingLabel
                    inputClassName="bg-light"
                    isDisabled={true}
                    labelClass="required"
                  />
                </div>
                <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                  <SelectInput
                    name="classId"
                    value={coscholaticGradeForm.values.classId}
                    onChange={onChangeFilterHndlr}
                    menuItems={classTypes}
                    valueKey="id"
                    textKey="shortName"
                    formgroupClassName="mb-0"
                    labelText='Class'
                    floatingLabel
                    inputClassName="bg-light"
                    labelClass="required"
                  />
                </div>
                {/* {location.pathname.includes("igcse-settings") && <div className="col-1 py-2 mt-2">
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
                </div>} */}
                <div className="col-auto d-flex align-items-center">
                  {showClearFilterState && <button type="button" onClick={clearFilterHndlr} className="btn btn-sm btn-ghost-danger">Clear filter</button>}
                </div>
                <div className="col-auto ms-auto">
                    <button
                    className="btn btn-primary me-2"
                    onClick={() => openDisplayOrderModal()}
                  >
                    Grade Book Order
                  </button>
                  <button
                    className="btn btn-success float-end d-flex align-items-center"
                    onClick={() => openCbseExaminationCoscholasticGradeUploadModal()}
                  >
                    Display Order
                  </button>
                </div>
              </div>

              <TableContainer
                columns={examinationCoscholasticGrades}
                data={Array.isArray(getCBSEAllSubjectsOrderResp) ? getCBSEAllSubjectsOrderResp : []}
                tableClass="mb-0"
                divClass="table-responsive mb-3"
                theadClass="table-light text-muted align-middle"
                showCheckbox={false}
                showPagination={false}

              />
            </div>
          </div>
        </div>
      </div>
      <ModalContainerUpdated
        id="add-examination"
        isOpen={cbseExaminationCoscholasticGradeUploadState.showModal}
        toggle={() => closeCbseExaminationCoscholasticGradeUploadModal()}
        modalTitle={"Set Display Order"}
        modalSize="lg"
      >
        <AddExaminationMarksModel
        modalData={coscholaticGradeForm.values}
          id={cbseExaminationCoscholasticGradeUploadState.modalData}
          isOpen={false}
          toggle={() => closeCbseExaminationCoscholasticGradeUploadModal()}
          modalTitle="Set Display Order"
        />
      </ModalContainerUpdated>
      <ModalContainerUpdated
        id="add-examination"
        isOpen={displayOrderModalState.showModal}
        toggle={() => closeDisplayOrderModal()}
        modalTitle={"Set Grade Book Order"}
        modalSize="lg"
      >
        <AddExaminationGradeModel
        modalData={coscholaticGradeForm.values}
          id={displayOrderModalState.modalData}
          isOpen={false}
          toggle={() => closeDisplayOrderModal()}
          modalTitle="Set Grade Book Order"
        />
      </ModalContainerUpdated>
      <ConfirmationModal
        id="delete-examination-modal"
        isOpen={deleteCbseExaminationCoscholasticGradeState.showModal}
        confirmMessage="Are you sure you want to delete this CoscholasticGrades ?"
        cancelHndlr={closeDelCbseExaminationCoscholasticGradeModal}
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
          appliedFilter={coscholaticGradeForm.values}
          applyFilterCallback={advanceFilterCallbckHndlr}
          toggleAdvanceFilter={toggleAdvanceFilter}
          isOpen={open}
        />
      </OffCanvasContainer>
    </>
  );
};

export default ExaminationSubjects;
