import React, { useEffect, useMemo, useRef, useState } from "react";
import { ConfirmationModal, ModalContainerUpdated, SelectInput, TextInput } from '../../../../Components/Common';
import TableContainer from '../../../../Components/Common/TableContainer';
import { generateCoscholasticGradeColumns, ignoredKeys } from "./helper";
import AddCoscholasticGradesModel from "./AddCoscholasticGradesModel";
import CopyOverallGradesModel from "./CopyOverallGradesModel";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { useFilterState } from "../../../../hooks/filterhook";
import { useModal } from "../../../../hooks/modalhook";
import { deleteCbseExaminationCoscholasticGradesListAct, getCbseExaminationCoscholasticGradesListAct, getCbseExaminationCoscholasticGradesListByIdAct, } from "../../../../store/examination/examinationsettings/examinationsettingsaction";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import { getBranchClassAct, getBranchCurriculumAct, resetBrchClassAct } from "../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { IPaginationState } from "../../../../Components/Common/Pagination";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import { useFormik } from "formik";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02StrokeStandard, PencilEdit02Icon } from "@hugeicons-pro/core-stroke-standard";

const initialValues = {
  searchString: "",
  academicYearId: "",
  curriculumId: "",
  classId: "",
  examinationId: "",
};

const CoscholasticGrades = () => {

  const dispatch = useAppDispatch();
  const { closeModal: closeDelCbseExaminationCoscholasticGradeModal, modalState: deleteCbseExaminationCoscholasticGradeState, openModal: openDelCbseExaminationCoscholasticGradeModal } = useModal();
  const { closeModal: closeCbseExaminationCoscholasticGradeUploadModal, modalState: cbseExaminationCoscholasticGradeUploadState, openModal: openCbseExaminationCoscholasticGradeUploadModal } = useModal();
  const { closeModal: closeCbseExaminationCoscholasticCopyUploadModal, modalState: cbseExaminationCoscholasticCopyUploadState, openModal: openCbseExaminationCoscholasticCopyUploadModal } = useModal();
  const { showClearFilterState, count, advanceFilterChange } = useFilterState()

  const pagination = useRef({
    pageNo: 0,
    pageSize: 10
  });

  const cbseExaminationCoscholasticGradesList = (otherProps?: any) => {
    const payload = {
      branchId,
      ...coscholaticGradeForm.values,
      ...pagination.current,
      ...otherProps,
    };
    dispatch(getCbseExaminationCoscholasticGradesListAct(generateActionPayload("get_cbse_examination_coscholastic_grades_list", undefined, payload)));
  };

  function delModalSubmitHndlr() {
    dispatch(deleteCbseExaminationCoscholasticGradesListAct(generateActionPayload("delete_cbse_examination_coscholastic_grades_list", { id: deleteCbseExaminationCoscholasticGradeState.modalData })));
  }

    const coscholaticGradeForm = useFormik({
      enableReinitialize: true,
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
    saveCbseExaminationCoscholasticGradesListResp,
    editCbseExaminationCoscholasticGradesRequestResp,
    delCbseExaminationCoscholasticGradesRequestResp,
    copyCbseExaminationCoscholasticGradesResp,
    cbseExaminationErrorAct
  } = useAppSelector(
    ({ instAcademics, branchAcademics, examinationSettings, appData, globalData, }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      showApiLoader: globalData.showApiLoader,
      currentInstIdResp: appData.currentInstIdResp,
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      branchClassResp: branchAcademics.branchClassResp,
      getCbseExaminationCoscholasticGradesRequestListResp: examinationSettings.getCbseExaminationCoscholasticGradesRequestListResp,
      saveCbseExaminationCoscholasticGradesListResp: examinationSettings.saveCbseExaminationCoscholasticGradesListResp,
      editCbseExaminationCoscholasticGradesRequestResp: examinationSettings.editCbseExaminationCoscholasticGradesRequestResp,
      copyCbseExaminationCoscholasticGradesResp: examinationSettings.copyCbseExaminationCoscholasticGradesResp,
      delCbseExaminationCoscholasticGradesRequestResp: examinationSettings.delCbseExaminationCoscholasticGradesRequestResp,
      cbseExaminationErrorAct: examinationSettings.cbseExaminationErrorAct,
    }),
    shallowEqual
  );

  const cbseExaminationCoscholasticGradesRef = useRef({
    prevAddCbseExaminationCoscholasticGrades: saveCbseExaminationCoscholasticGradesListResp,
    prevEditCbseExaminationCoscholasticGrades: editCbseExaminationCoscholasticGradesRequestResp,
    prevDeleteCbseExaminationCoscholasticGradesRequestListResp: delCbseExaminationCoscholasticGradesRequestResp,
    prevCopyCbseExaminationCoscholasticGradesResp: copyCbseExaminationCoscholasticGradesResp,
    prevCbseExaminationCoscholasticGradesErrorResp: cbseExaminationErrorAct,
  })

  useEffect(() => {
    const { prevCopyCbseExaminationCoscholasticGradesResp, prevAddCbseExaminationCoscholasticGrades, prevEditCbseExaminationCoscholasticGrades, prevDeleteCbseExaminationCoscholasticGradesRequestListResp, prevCbseExaminationCoscholasticGradesErrorResp } = cbseExaminationCoscholasticGradesRef.current;
    if (saveCbseExaminationCoscholasticGradesListResp && prevAddCbseExaminationCoscholasticGrades !== saveCbseExaminationCoscholasticGradesListResp) {
      toast.success("CoscholasticGrades added successfully.");
      closeCbseExaminationCoscholasticGradeUploadModal()
      cbseExaminationCoscholasticGradesList()
    }
    else if (editCbseExaminationCoscholasticGradesRequestResp && prevEditCbseExaminationCoscholasticGrades !== editCbseExaminationCoscholasticGradesRequestResp) {
      toast.success("CoscholasticGrades updated successfully.");
      closeCbseExaminationCoscholasticGradeUploadModal()
      cbseExaminationCoscholasticGradesList()
    }
    else if (copyCbseExaminationCoscholasticGradesResp && prevCopyCbseExaminationCoscholasticGradesResp !== copyCbseExaminationCoscholasticGradesResp) {
      toast.success("Coscholastic Grades Copied successfully.");
      closeCbseExaminationCoscholasticCopyUploadModal()
      cbseExaminationCoscholasticGradesList();
    }
    else if (delCbseExaminationCoscholasticGradesRequestResp && prevDeleteCbseExaminationCoscholasticGradesRequestListResp !== delCbseExaminationCoscholasticGradesRequestResp) {
      toast.success("CoscholasticGrades deleted successfully.");
      closeDelCbseExaminationCoscholasticGradeModal()
      cbseExaminationCoscholasticGradesList()
    }
    else if (cbseExaminationErrorAct && prevCbseExaminationCoscholasticGradesErrorResp !== cbseExaminationErrorAct) {
      const { details } = cbseExaminationErrorAct || {};
      toast.error(details || "Something went wrong.");
    }
    cbseExaminationCoscholasticGradesRef.current.prevDeleteCbseExaminationCoscholasticGradesRequestListResp = delCbseExaminationCoscholasticGradesRequestResp;
    cbseExaminationCoscholasticGradesRef.current.prevEditCbseExaminationCoscholasticGrades = editCbseExaminationCoscholasticGradesRequestResp;
    cbseExaminationCoscholasticGradesRef.current.prevAddCbseExaminationCoscholasticGrades = saveCbseExaminationCoscholasticGradesListResp;
    cbseExaminationCoscholasticGradesRef.current.prevCopyCbseExaminationCoscholasticGradesResp = copyCbseExaminationCoscholasticGradesResp;
    cbseExaminationCoscholasticGradesRef.current.prevCbseExaminationCoscholasticGradesErrorResp = cbseExaminationErrorAct;
  }, [copyCbseExaminationCoscholasticGradesResp, saveCbseExaminationCoscholasticGradesListResp, editCbseExaminationCoscholasticGradesRequestResp, delCbseExaminationCoscholasticGradesRequestResp, cbseExaminationErrorAct]);

  useEffect(() => {
    const yearId = academicYearListResp?.data.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId;
    if (yearId) {
      cbseExaminationCoscholasticGradesList({ academicYearId: yearId });
      coscholaticGradeForm .setValues((prev: any) => ({ ...prev, academicYearId: yearId }));
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
        coscholaticGradeForm.setValues((prev: any) => ({
          ...prev,
          curriculumId: selectedCurriculum.branchCurriculumId,
        }));
        classApiCalled.current = true;
      }
    }
  }, [brchCurriculumResp, coscholaticGradeForm.values.academicYearId]);

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

  function paginationHndlr(paginationInfo: IPaginationState) {
    pagination.current = paginationInfo;
    cbseExaminationCoscholasticGradesList(paginationInfo);
  }
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
  const onChangeFilterHndlr = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    pagination.current.pageNo = 0;

    coscholaticGradeForm .setValues((prev: any) => {
      const updatedState = { ...prev, [name]: value };

      if (name === "academicYearId") {
        getCurriculumApiCall({ academicYearId: value });
        updatedState.classId = "";
        getClassApiCall(updatedState.curriculumId, value);
        cbseExaminationCoscholasticGradesList({ ...updatedState, classId: "" });
      } else if (name === "curriculumId") {
        if (!value) {
          dispatch(resetBrchClassAct(undefined))
        }
        else {
          getClassApiCall(value, coscholaticGradeForm.values.academicYearId);
        }
        updatedState.classId = "";
        cbseExaminationCoscholasticGradesList({ ...updatedState, classId: "" });
      } else {
        cbseExaminationCoscholasticGradesList(updatedState);
      }
      advanceFilterChange({ keys: { ...coscholaticGradeForm.values, [name]: value }, ignoredKeys });
      return updatedState;
    });
  };

  useEffect(() => {
    if (coscholaticGradeForm.values.curriculumId || coscholaticGradeForm.values.classId) {
      cbseExaminationCoscholasticGradesList({ curriculumId: coscholaticGradeForm.values.curriculumId });
    }
  }, [coscholaticGradeForm.values.curriculumId, coscholaticGradeForm.values.classId]);
  
  function clearFilterHndlr() {
    pagination.current.pageNo = 0;
    const { academicYearId } = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current") || {}
    const selectedCurriculum = brchCurriculumResp?.data?.find((item: { instituteCurriculumId: number }) => item.instituteCurriculumId === 1 ) || brchCurriculumResp?.data?.[0];
    const curriculumId = selectedCurriculum?.branchCurriculumId || "";
    coscholaticGradeForm .setValues({ ...initialValues, academicYearId: academicYearId || "", curriculumId });
    cbseExaminationCoscholasticGradesList({ ...initialValues, academicYearId, curriculumId });
    advanceFilterChange({ keys: { ...initialValues, academicYearId, curriculumId }, ignoredKeys })
    if (count) {
      setTimeout(() => {
        advanceFilterChange({ keys: {}, ignoredKeys });
      }, 0);
    }
  }
  const examinationCoscholasticGrades = useMemo(() => generateCoscholasticGradeColumns(menuOptions), []);
  const { data: cbseExaminationResp, totalElements, totalPages, pageable } = getCbseExaminationCoscholasticGradesRequestListResp || {};
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
                  <h4 className="card-title mb-0 flex-grow-1">Coscholastic Grades</h4>
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
                      value={coscholaticGradeForm.values.searchString}
                      onChange={onChangeFilterHndlr}
                      floatingLabel
                      inputClassName="bg-light"
                    />
                    <i className="ri-search-line search-icon"></i>
                  </div>
                </div>
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
                  />
                </div>
                <div className="col-auto d-flex align-items-center">
                  {showClearFilterState && <button type="button" onClick={clearFilterHndlr} className="btn btn-sm btn-ghost-danger">Clear filter</button>}
                </div>
                <div className="col-auto ms-auto">
                  <button
                    className="btn btn-success float-end d-flex align-items-center"
                    onClick={() => openCbseExaminationCoscholasticGradeUploadModal()}
                  >
                    <i className="ri-add-line me-2" />
                    Add New
                  </button>
                </div>
                <div className="col-auto">
                  <button
                    className="btn btn-3" style={{ background: "#405189", border: "none" }}
                    onClick={() => openCbseExaminationCoscholasticCopyUploadModal()}
                  >
                    <div className="d-flex align-items-center text-white">
                      <span>Copy</span>
                    </div>
                  </button>
                </div>
              </div>

              <TableContainer
                columns={examinationCoscholasticGrades}
                data={Array.isArray(getCbseExaminationCoscholasticGradesRequestListResp?.data) ? getCbseExaminationCoscholasticGradesRequestListResp?.data : []}
                tableClass="mb-0"
                divClass="table-responsive mb-3"
                theadClass="table-light text-muted align-middle"
                showCheckbox={false}
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
        isOpen={cbseExaminationCoscholasticGradeUploadState.showModal}
        toggle={() => closeCbseExaminationCoscholasticGradeUploadModal()}
        modalTitle={cbseExaminationCoscholasticGradeUploadState.modalData ? "Edit Coscholastic Grades Details" : "Create Details"}
        modalSize="lg"
      >
        <AddCoscholasticGradesModel
        modalData={coscholaticGradeForm.values}
          id={cbseExaminationCoscholasticGradeUploadState.modalData}
          isOpen={false}
          toggle={() => closeCbseExaminationCoscholasticGradeUploadModal()}
          modalTitle="Create Detail"
        />
      </ModalContainerUpdated>
      <ModalContainerUpdated
        id="add-examination"
        isOpen={cbseExaminationCoscholasticCopyUploadState.showModal}
        toggle={() => closeCbseExaminationCoscholasticCopyUploadModal()}
        modalTitle={cbseExaminationCoscholasticCopyUploadState.modalData ? "Copy Coscholastic Grades Details" : "Create Details"}
        modalSize="lg"
      >
        <CopyOverallGradesModel
         modalData={coscholaticGradeForm.values}
          id={cbseExaminationCoscholasticCopyUploadState.modalData}
          isOpen={false}
          toggle={() => closeCbseExaminationCoscholasticCopyUploadModal()}
          modalTitle="Create Detail"
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
    </>
  );
};

export default CoscholasticGrades;
