import React, { useEffect, useMemo, useRef, useState } from "react";
import { ConfirmationModal, ModalContainerUpdated, SelectInput, TextInput } from '../../../../Components/Common';
import TableContainer from '../../../../Components/Common/TableContainer';
import { generateColumns, ignoredKeys } from "./helper";
import AddOverallGradesModel from "./AddOverallGradesModel";
import CopyOverallGradesModel from "./CopyOverallGradesModel";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { resetBrchClassAct, resetBrchCurriculumAct, setBrchAcademicYearAct, } from "../../../../store/branchsettings/branchacademics/branchacademicsslice";
import { getBranchClassAct, getBranchCurriculumAct } from "../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { IPaginationState } from "../../../../Components/Common/Pagination";
import { shallowEqual } from "react-redux";
import { useModal } from "../../../../hooks/modalhook";
import { deleteCbseExaminationOverAllGradesByIdAct, getCbseExaminationOverAllGradesAct, getCbseExaminationOverAllGradesByIdAct } from "../../../../store/examination/examinationsettings/examinationsettingsaction";
import { toast } from "react-toastify";
import { useFilterState } from "../../../../hooks/filterhook";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import { useFormik } from "formik";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02StrokeStandard, PencilEdit02Icon } from "@hugeicons-pro/core-stroke-standard";
import SetGradeColorModal from "./SetGradeColorModal";

const initialValues = {
  searchString: "",
  academicYearId: "",
  curriculumId: "",
  classId: "",
};

const OverallGrades = () => {

  const dispatch = useAppDispatch();
  const { modalState:  addModalState, openModal: openAddModalHndlr, closeModal: closeAddModalHndlr } = useModal();
  const { modalState: delModalState, openModal: openDelModalHndlr, closeModal: closeDelModalHndlr } = useModal();
  const { closeModal: closeCbseExaminationCoscholasticCopyUploadModal, modalState: cbseExaminationCoscholasticCopyUploadState, openModal: openCbseExaminationCoscholasticCopyUploadModal } = useModal();
  const {
    closeModal: setGradeColorCloseModal,
    modalState: setGradeColorModalState,
    openModal: setGradeColorOpenModal
  } = useModal();
  const { showClearFilterState, count, advanceFilterChange } = useFilterState();
  const pagination = useRef({
    pageNo: 0,
    pageSize: 10
  })
  
    const overAllGradesListApiCall = (otherProps?: any) => {
      let payload = {
          branchId,
          ...overallGradesForm.values,
          ...pagination.current,
          ...otherProps,
      };
      
      dispatch(getCbseExaminationOverAllGradesAct(generateActionPayload('get_cbse_examination_over_all_grades', undefined, payload)))
    }

    const delConfirmHndler = () => {
      dispatch(
        deleteCbseExaminationOverAllGradesByIdAct(
          generateActionPayload("delete_cbse_examination_over_all_grades_by_id", {
            id: delModalState.modalData,
          })
        )
      );
    };

  const overallGradesForm = useFormik({
    enableReinitialize: true,
    initialValues,
    onSubmit: (values) => { },
  });

    const {
        academicYearListResp,
        brchCurriculumResp,
        branchClassResp,
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        getCbseExaminationOverAllGradesResp,
        saveCbseExaminationOverAllGradesResp,
        editCbseExaminationOverAllGradesByIdResp,
        deleteCbseExaminationOverAllGradesByIdResp,
        copyCbseExaminationOverAllGradesResp,
        saveOverallGradeColorResp,
        cbseExaminationErrorAct,
        showApiLoader
    } = useAppSelector(
        ({ globalData, instAcademics, branchAcademics, appData, examinationSettings }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            branchClassResp: branchAcademics.branchClassResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            getCbseExaminationOverAllGradesResp: examinationSettings.getCbseExaminationOverAllGradesResp,
            saveCbseExaminationOverAllGradesResp: examinationSettings.saveCbseExaminationOverAllGradesResp,
            editCbseExaminationOverAllGradesByIdResp: examinationSettings.editCbseExaminationOverAllGradesByIdResp,
            deleteCbseExaminationOverAllGradesByIdResp: examinationSettings.deleteCbseExaminationOverAllGradesByIdResp,
            copyCbseExaminationOverAllGradesResp: examinationSettings.copyCbseExaminationOverAllGradesResp,
            saveOverallGradeColorResp: examinationSettings.saveOverallGradeColorResp,
            cbseExaminationErrorAct : examinationSettings.cbseExaminationErrorAct,
            showApiLoader: globalData.showApiLoader,
        }),
        shallowEqual
    );

    const overAllGradesRef = useRef({
      prevGetCbseExaminationOverAllGradesResp: getCbseExaminationOverAllGradesResp,
      prevSaveCbseExaminationOverAllGradesResp: saveCbseExaminationOverAllGradesResp,
      prevEditCbseExaminationOverAllGradesByIdResp: editCbseExaminationOverAllGradesByIdResp,
      prevDeleteCbseExaminationOverAllGradesByIdResp: deleteCbseExaminationOverAllGradesByIdResp,
      prevCopyCbseExaminationOverAllGradesResp: copyCbseExaminationOverAllGradesResp,
      prevSaveOverallGradeColorResp: saveOverallGradeColorResp,
      prevCbseExaminationErrorAct: cbseExaminationErrorAct
    });

    useEffect(() => {
      const {
          prevSaveCbseExaminationOverAllGradesResp,
          prevEditCbseExaminationOverAllGradesByIdResp,
          prevDeleteCbseExaminationOverAllGradesByIdResp,
          prevCopyCbseExaminationOverAllGradesResp,
          prevSaveOverallGradeColorResp,
          prevCbseExaminationErrorAct
      } = overAllGradesRef.current;
      if (saveCbseExaminationOverAllGradesResp && prevSaveCbseExaminationOverAllGradesResp !== saveCbseExaminationOverAllGradesResp) {
        toast.success("Overall Grade added Successfully");
        closeAddModalHndlr();
        overAllGradesListApiCall();
      }
      else if (editCbseExaminationOverAllGradesByIdResp && prevEditCbseExaminationOverAllGradesByIdResp !== editCbseExaminationOverAllGradesByIdResp) {
        toast.success("Overall Grades updated successfully.");
        closeAddModalHndlr()
        overAllGradesListApiCall();
      }
      else if (copyCbseExaminationOverAllGradesResp && prevCopyCbseExaminationOverAllGradesResp !== copyCbseExaminationOverAllGradesResp) {
        toast.success("Overall Grades Copied successfully.");
        closeCbseExaminationCoscholasticCopyUploadModal()
        overAllGradesListApiCall();
      }
      else if (deleteCbseExaminationOverAllGradesByIdResp && prevDeleteCbseExaminationOverAllGradesByIdResp !== deleteCbseExaminationOverAllGradesByIdResp) {
          toast.success("Overall Grade Deleted Successfully");
          closeDelModalHndlr();
          overAllGradesListApiCall();
      } else if( saveOverallGradeColorResp && prevSaveOverallGradeColorResp !== saveOverallGradeColorResp) {
        toast.success("Overall Grade Color Saved Successfully");
        setGradeColorCloseModal();
        overAllGradesListApiCall();
      }
      else if (cbseExaminationErrorAct && cbseExaminationErrorAct !== prevCbseExaminationErrorAct) {
        const { details,message } = cbseExaminationErrorAct || {};
        toast.error(message || details || "Something went wrong");
      } 
  
      overAllGradesRef.current.prevGetCbseExaminationOverAllGradesResp = getCbseExaminationOverAllGradesResp;
      overAllGradesRef.current.prevSaveCbseExaminationOverAllGradesResp = saveCbseExaminationOverAllGradesResp;
      overAllGradesRef.current.prevEditCbseExaminationOverAllGradesByIdResp = editCbseExaminationOverAllGradesByIdResp;
      overAllGradesRef.current.prevDeleteCbseExaminationOverAllGradesByIdResp = deleteCbseExaminationOverAllGradesByIdResp;
      overAllGradesRef.current.prevCopyCbseExaminationOverAllGradesResp = copyCbseExaminationOverAllGradesResp;
      overAllGradesRef.current.prevSaveOverallGradeColorResp = saveOverallGradeColorResp;
      overAllGradesRef.current.prevCbseExaminationErrorAct = cbseExaminationErrorAct;
  }, [
      cbseExaminationErrorAct,
      getCbseExaminationOverAllGradesResp,
      saveCbseExaminationOverAllGradesResp,
      editCbseExaminationOverAllGradesByIdResp,
      deleteCbseExaminationOverAllGradesByIdResp,
      copyCbseExaminationOverAllGradesResp,
      saveOverallGradeColorResp
  ]);

  useEffect(()=>{
    const {prevDeleteCbseExaminationOverAllGradesByIdResp} = overAllGradesRef.current || {};
    if (deleteCbseExaminationOverAllGradesByIdResp && prevDeleteCbseExaminationOverAllGradesByIdResp !== deleteCbseExaminationOverAllGradesByIdResp) {
      toast.success("Overall Grade Deleted Successfully");
      closeDelModalHndlr();
      overAllGradesListApiCall();
    }
    overAllGradesRef.current.prevDeleteCbseExaminationOverAllGradesByIdResp = deleteCbseExaminationOverAllGradesByIdResp;
  },[deleteCbseExaminationOverAllGradesByIdResp])
  useEffect(() => {
    dispatch(resetBrchClassAct(undefined));
    return () => {
      dispatch(resetBrchClassAct(undefined));
      dispatch(resetBrchCurriculumAct(undefined));
      dispatch(setBrchAcademicYearAct(undefined));
    }
  }, [])

  const classApiCalled = useRef(false);
  useEffect(() => {
    let yearId = academicYearListResp?.data.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId;
    if (yearId) {
      overAllGradesListApiCall({ academicYearId: yearId });
      overallGradesForm.setValues((prev: any) => ({ ...prev, academicYearId: yearId }));
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

    if (Array.isArray(data) && data.length > 0 && overallGradesForm.values.academicYearId && !classApiCalled.current) {
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
      const payload = {
        branchId,
        curriculumId: selectedCurriculum.branchCurriculumId,
        academicYearId: overallGradesForm.values.academicYearId,
        sortBy: "classSequence",
        classFilter: "HIGHER",
        orderBy: "asc",
        pageNo: 0,
        pageSize: 100,
      };
      dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
      overallGradesForm.setValues((prev: any) => ({
        ...prev,
        curriculumId: selectedCurriculum.branchCurriculumId,
      }));
      classApiCalled.current = true;
    }
  }, [brchCurriculumResp, overallGradesForm.values.academicYearId]);

    const menuOptions = useMemo(
      () => [
        {
          id: "edit",
          actionIcon: <HugeiconsIcon icon={PencilEdit02Icon} className="text-muted" size={20} />,
          actionName: "Edit",
          onClickHndlr: (event: any) => {
              const id = event.currentTarget.getAttribute("data-id");
              dispatch(
                getCbseExaminationOverAllGradesByIdAct(
                  generateActionPayload('get_cbse_examination_over_all_grades_by_id',{
                    id:id
                  })
                )
              )
              openAddModalHndlr(id);
          },
        },
        {
          id: "delete",
          actionIcon: <HugeiconsIcon icon={Delete02StrokeStandard} className="text-danger" size={18} />,
          actionName: "Delete",
          onClickHndlr: (event: any) => {
            const id = event.currentTarget.getAttribute("data-id");
            openDelModalHndlr(id)
          },
        },
      ],
      []
    );
      const getCurriculumApiCall = (otherProps?: any) => {
        const payload1 = { academicYearId: overallGradesForm.values.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", ...otherProps };
        dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
      }
  function getClassApiCall(curriculumId: string, academicYearId: string) {
    const payload = {
      academicYearId,
      curriculumId,
      classFilter: "HIGHER",
      branchId,
      pageNo: 0,
      pageSize: 100,
      sortBy: "classSequence",
      orderBy: "asc",
    };
    dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
  }
  
 const filterHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    pagination.current.pageNo = 0;

    overallGradesForm.setValues((prev: any) => {
      const updatedState = { ...prev, [name]: value };

      if (name === "academicYearId") {
        getCurriculumApiCall({ academicYearId: value });
        updatedState.classId = "";
        getClassApiCall(updatedState.curriculumId, value);
        overAllGradesListApiCall({ ...updatedState, classId: "" });
      } else if (name === "curriculumId") {
        if (!value) {
          dispatch(resetBrchClassAct(undefined))
        }
        else {
          getClassApiCall(value, overallGradesForm.values.academicYearId);
        }
        updatedState.classId = "";
        overAllGradesListApiCall({ ...updatedState, classId: "" });
      } else {
        overAllGradesListApiCall(updatedState);
      }
      advanceFilterChange({ keys: { ...overallGradesForm.values, [name]: value }, ignoredKeys });
      return updatedState;
    });
  };

  useEffect(() => {
    if (overallGradesForm.values.curriculumId || overallGradesForm.values.classId) {
      overAllGradesListApiCall({ curriculumId: overallGradesForm.values.curriculumId });
    }
  }, [overallGradesForm.values.curriculumId, overallGradesForm.values.classId]);
  
    function paginationHndlr(paginationInfo: IPaginationState) {
      pagination.current = paginationInfo;
      overAllGradesListApiCall(paginationInfo)
    }

  function clearFilterHndlr() {
    pagination.current.pageNo = 0;
    const { academicYearId } = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current") || {}
    const selectedCurriculum = brchCurriculumResp?.data?.find((item: { instituteCurriculumId: number }) => item.instituteCurriculumId === 1) || brchCurriculumResp?.data?.[0];
    const curriculumId = selectedCurriculum?.branchCurriculumId || "";
    overallGradesForm.setValues({ ...initialValues, academicYearId: academicYearId || "", curriculumId });
    overAllGradesListApiCall({ ...initialValues, academicYearId, curriculumId });
    advanceFilterChange({ keys: { ...initialValues, academicYearId, curriculumId }, ignoredKeys })
    if (count) {
      setTimeout(() => {
        advanceFilterChange({ keys: {}, ignoredKeys });
      }, 0);
    }
  }

    const { data: academicYearList } = academicYearListResp || {};
    const { data: curriculumTypes } = brchCurriculumResp || {}
    const { data: overAllGradesTableData, totalElements, totalPages, pageble } =  getCbseExaminationOverAllGradesResp || {};
    const { content: classTypes } = branchClassResp || {};

    const columns = useMemo(() => generateColumns(menuOptions), [menuOptions,getCbseExaminationOverAllGradesResp]);
  return (
    <>
      <div className="page-content free_payment_record_wrapper">
        <div className="container-fluid">
          <BreadCrumb title="Examination" pageTitle="Examination" />

          <div className="card">
            <div className="card-header">
              <div className="row align-items-center">
                <div className="col-6">
                  <h4 className="card-title mb-0 flex-grow-1">Overall Grades</h4>
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
                      value={overallGradesForm.values.searchString}
                      onChange={filterHandler}
                      placeHolder="Search"
                      labelText="Search"
                      floatingLabel
                      inputClassName="bg-light"
                    />
                    <i className="ri-search-line search-icon"></i>
                  </div>
                </div>
                <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                  <SelectInput
                    name="academicYearId"
                    value={overallGradesForm.values.academicYearId}
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
                    value={overallGradesForm.values.curriculumId}
                    onChange={filterHandler}
                    menuItems={curriculumTypes || []}
                    valueKey="branchCurriculumId"
                    textKey="curriculumName"
                    formgroupClassName="mb-0"
                    labelText="Curriculum"
                    isDisabled={true}
                    floatingLabel
                    inputClassName="bg-light"
                  />
                </div>
                <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                  <SelectInput
                    name="classId"
                    value={overallGradesForm.values.classId}
                    onChange={filterHandler}
                    menuItems={classTypes || []}
                    valueKey="id"
                    textKey="shortName"
                    formgroupClassName="mb-0"
                    labelText="Class"
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
                    onClick={() => openAddModalHndlr()}
                  >
                    <i className="ri-add-line me-2" />
                    Add New
                  </button>
                </div>
                <div className="col-auto tw-flex tw-gap-2">
                  <button
                    className="btn btn-3" style={{ background: "#405189", border: "none" }}
                    onClick={() => openCbseExaminationCoscholasticCopyUploadModal()}
                  >
                    <div className="d-flex align-items-center text-white">
                      <span>Copy</span>
                    </div>
                  </button>
                  <button className="btn btn-secondary" onClick={() => setGradeColorOpenModal()}>Set Color</button>
                </div>
              </div>

              <TableContainer
                columns={columns || []}
                data={overAllGradesTableData || []}
                tableClass="mb-0"
                divClass="table-responsive mb-3"
                theadClass="table-light text-muted align-middle"
                showPagination={true}
                totalPages={totalPages || 0}
                totalRecords={totalElements || 0}
                callbackPaginationHndlr={paginationHndlr}
                currentPageNumber={pageble?.pageNumber || 0}
              />
            </div>
          </div>
        </div>
      </div>
      <ModalContainerUpdated
        id="add-over-all-grades"
        isOpen={addModalState.showModal}
        toggle={() => closeAddModalHndlr()}
        modalTitle={addModalState.modalData ? "Edit Over All Grades" : "Add Over All Grades"}
        modalSize="xl"
      >
        <AddOverallGradesModel
          modalData={overallGradesForm.values}
          id={addModalState.modalData}
          isOpen={false}
          toggle={() => closeAddModalHndlr()}
          modalTitle="Add Overall Grades"
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
          modalData={overallGradesForm.values}
          id={cbseExaminationCoscholasticCopyUploadState.modalData}
          isOpen={false}
          toggle={() => closeCbseExaminationCoscholasticCopyUploadModal()}
          modalTitle="Create Detail"
        />
      </ModalContainerUpdated>
      <ModalContainerUpdated
        id = "set-grade-color-modal"
        isOpen={setGradeColorModalState.showModal}
        toggle ={()=> setGradeColorCloseModal()}
        modalTitle="Set Grade Color"
        modalSize="md"
      >
        <SetGradeColorModal toggle={setGradeColorCloseModal}></SetGradeColorModal>
      </ModalContainerUpdated>
      <ConfirmationModal
        id="delete-over-all-grade-modal"
        isOpen={delModalState.showModal}
        confirmMessage="Are you sure you want to delete this Over All Grade ?"
        cancelHndlr={() => closeDelModalHndlr()}
        confirmHndlr={delConfirmHndler}
        showImgIcon={true}
        isDisble={showApiLoader}
        iconType="reject"
      />
</>
  );
};

export default OverallGrades;
