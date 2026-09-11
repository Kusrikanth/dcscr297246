import React, { useEffect, useMemo, useRef, useState } from "react";
import { ConfirmationModal, ModalContainerUpdated, OffCanvasContainer, SelectInput, TextInput } from "../../../../Components/Common";
import TableContainer from "../../../../Components/Common/TableContainer";
import { generateWeightageColumns,ignoredKeys } from "./helper";
import { useFormik } from "formik";
import AddExaminationWeightageModel from "./AddExaminationWeightageModel";
import { useFilterState } from "../../../../hooks/filterhook";
import { useModal } from "../../../../hooks/modalhook";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { getBranchClassAct, getBranchCurriculumAct, resetBrchClassAct } from "../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { deleteCbseWeightageListAct, getCbseExaminationListAct, getCbseWeightageListAct, getCbseWeightageListByIdAct, getExaminationTermListAct, getIgseTermNameListAct } from "../../../../store/examination/examinationsettings/examinationsettingsaction";
import { IPaginationState } from "../../../../Components/Common/Pagination";
import { default as FilterSvg } from "../../../../assets/imagesdps/academics/FilterSvg.svg?react";
import AdvanceFilterModal from "./AdvancedFilterModal";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02StrokeStandard, PencilEdit02Icon } from "@hugeicons-pro/core-stroke-standard";
import { setIgseTermDetailsListAct } from "../../../../store/examination/examinationsettings/examinationsettingsslice";

const initialValues = {
  searchString: "",
  academicYearId: "",
  curriculumId: "",
  classId: "",
};

const ExaminationWeightage = () => {

  const dispatch = useAppDispatch();
  const { closeModal: closeDelCbseWeightageModal, modalState: deleteCbseWeightageState, openModal: openDelCbseWeightageModal } = useModal();
  const { closeModal: closeCbseWeightageUploadModal, modalState: cbseWeightageUploadState, openModal: openCbseWeightageUploadModal } = useModal();
  const { showClearFilterState, count, advanceFilterChange } = useFilterState()
  const [open, setOpen] = useState<boolean>(false);
  const pagination = useRef({
    pageNo: 0,
    pageSize: 10
  });

  const cbseWeightageList = (otherProps?: any) => {
    const payload = {
      branchId,
      ...examinationWeightageForm.values,
      ...pagination.current,
      ...otherProps,
    };
    if(payload.academicYearId && payload.curriculumId && payload.classId){
      dispatch(getCbseWeightageListAct(generateActionPayload("get_cbse_weightage_list", undefined, payload)));
    }
  };

  const cbseExaminationList = (otherProps?: any) => {
    let payload = {
      ...examinationWeightageForm.values,
      ...otherProps,
      branchId,
      pageNo: 0,
      pageSize: 100,
    };
    if (payload.academicYearId && payload.curriculumId && payload.classId) {
      dispatch(getCbseExaminationListAct(generateActionPayload("get_cbse_examination_list", undefined, payload)));
    }
  };

  const examinationTermList = (curriculumId: string) => {
    if (curriculumId) {
      let payload = {
        branchId,
        curriculumId,
      };
      dispatch(getIgseTermNameListAct(generateActionPayload("get_igse_term_name_list", undefined, payload)));
    }
  };

  function delModalSubmitHndlr() {
    dispatch(deleteCbseWeightageListAct(generateActionPayload("delete_cbse_weightage_list", { id: deleteCbseWeightageState.modalData })));
  }

  const examinationWeightageForm = useFormik({
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
    getCbseWeightageRequestListResp,
    saveCbseWeightageListResp,
    editCbseWeightageRequestResp,
    delCbseWeightageRequestResp,
    cbseExaminationErrorAct
  } = useAppSelector(
    ({ instAcademics, branchAcademics, examinationSettings, appData, globalData, }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      branchClassResp: branchAcademics.branchClassResp,
      showApiLoader: globalData.showApiLoader,
      currentInstIdResp: appData.currentInstIdResp,
      getCbseWeightageRequestListResp: examinationSettings.getCbseWeightageRequestListResp,
      saveCbseWeightageListResp: examinationSettings.saveCbseWeightageListResp,
      editCbseWeightageRequestResp: examinationSettings.editCbseWeightageRequestResp,
      delCbseWeightageRequestResp: examinationSettings.delCbseWeightageRequestResp,
      cbseExaminationErrorAct: examinationSettings.cbseExaminationErrorAct,
    }),
    shallowEqual
  );

  const cbseWeightageRef = useRef({
    prevAddCbseWeightage: saveCbseWeightageListResp,
    prevEditCbseWeightage: editCbseWeightageRequestResp,
    prevDeleteCbseWeightageRequestListResp: delCbseWeightageRequestResp,
    prevCbseWeightageErrorResp: cbseExaminationErrorAct,
  })

  useEffect(() => {
    const { prevAddCbseWeightage, prevEditCbseWeightage, prevDeleteCbseWeightageRequestListResp, prevCbseWeightageErrorResp } = cbseWeightageRef.current;
    if (saveCbseWeightageListResp && prevAddCbseWeightage !== saveCbseWeightageListResp) {
      toast.success("Weightage added successfully.");
      closeCbseWeightageUploadModal()
      cbseWeightageList()
    }
    else if (editCbseWeightageRequestResp && prevEditCbseWeightage !== editCbseWeightageRequestResp) {
      toast.success("Weightage updated successfully.");
      closeCbseWeightageUploadModal()
      cbseWeightageList()
    }
    else if (delCbseWeightageRequestResp && prevDeleteCbseWeightageRequestListResp !== delCbseWeightageRequestResp) {
      toast.success("Weightage deleted successfully.");
      closeDelCbseWeightageModal()
      cbseWeightageList()
    }
    else if (cbseExaminationErrorAct && prevCbseWeightageErrorResp !== cbseExaminationErrorAct) {
      const { details } = cbseExaminationErrorAct || {};
      toast.error(details || "Something went wrong.");
    }
    cbseWeightageRef.current.prevDeleteCbseWeightageRequestListResp = delCbseWeightageRequestResp;
    cbseWeightageRef.current.prevEditCbseWeightage = editCbseWeightageRequestResp;
    cbseWeightageRef.current.prevAddCbseWeightage = saveCbseWeightageListResp;
    cbseWeightageRef.current.prevCbseWeightageErrorResp = cbseExaminationErrorAct;
  }, [saveCbseWeightageListResp, editCbseWeightageRequestResp, delCbseWeightageRequestResp, cbseExaminationErrorAct]);
    const classApiCalled = useRef(false);
      
    useEffect(() => {
      const { content } = branchClassResp || {};
      if (Array.isArray(content) && content.length > 0) {
  
        examinationWeightageForm.setValues((prev: any) => ({ ...prev, classId: content[0].id }))
        cbseWeightageList({ classId: content[0]?.id });
        cbseExaminationList({ classId: content[0]?.id });
      }
    }, [branchClassResp])
    
    useEffect(() => {
      const { data } = brchCurriculumResp || {};
    const curriculumMapping: Record<string, string> = {
      "/early-years-settings/examination-weightage": "EY1-EY3",
      "/cbse-settings/examination-weightage": "CBSE",
      "/igcse-settings/examination-weightage": "IGCSE",
    };
    const selectedCurriculumName = curriculumMapping[location.pathname];
    if (Array.isArray(data) && data.length > 0 && examinationWeightageForm.values.academicYearId && !classApiCalled.current) {
      const selectedCurriculum = data.find(
        (item) => item.shortName === selectedCurriculumName
      );
      if (!selectedCurriculum) {
        examinationWeightageForm.setValues((prev: any) => ({
          ...prev,
          curriculumId: undefined,
        }));
        return;
      }
        const payload = {
          branchId,
          curriculumId: selectedCurriculum.branchCurriculumId,
          academicYearId: examinationWeightageForm.values.academicYearId,
          sortBy: "classSequence",
          classFilter: "HIGHER",
          orderBy: "asc",
          pageNo: 0,
          pageSize: 100,
        };
        dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
        examinationWeightageForm.setValues((prev: any) => ({
          ...prev,
          curriculumId: selectedCurriculum.branchCurriculumId,
        }));
        dispatch(getIgseTermNameListAct(generateActionPayload("get_igse_term_name_list", undefined, {branchId, curriculumId: selectedCurriculum.branchCurriculumId})));
        classApiCalled.current = true;
      }
    }, [brchCurriculumResp, examinationWeightageForm.values.academicYearId]);

  useEffect(() => {
    const yearId = academicYearListResp?.data.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId;
    if (yearId) {
      examinationWeightageForm.setValues((prev: any) => ({ ...prev, academicYearId: yearId }));
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

  const menuOptions = useMemo(
    () => [
      {
        id: "edit",
        actionIcon: <HugeiconsIcon icon={PencilEdit02Icon} className=" text-muted" size={20} />,
        actionName: "Edit",
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute("data-id");
          dispatch(getCbseWeightageListByIdAct(generateActionPayload("get_cbse_weightage_details_list_by_id", { id })));
          openCbseWeightageUploadModal(id);
        },
      },
      {
        id: "delete",
        actionIcon: <HugeiconsIcon icon={Delete02StrokeStandard} className="text-danger" size={18} />,
        actionName: "Delete",
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute("data-id");
          openDelCbseWeightageModal(id)
        },
      },
    ],
    [getCbseWeightageRequestListResp]
  );

  function paginationHndlr(paginationInfo: IPaginationState) {
    pagination.current = paginationInfo;
    cbseWeightageList(paginationInfo);
  }

  const getCurriculumApiCall = (otherProps?: any) => {
    const payload1 = { academicYearId: examinationWeightageForm.values.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", ...otherProps };
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
  
      examinationWeightageForm.setValues((prev: any) => {
        const updatedState = { ...prev, [name]: value };
  
        if (name === "academicYearId") {
          getCurriculumApiCall({ academicYearId: value });
          updatedState.classId = "";
          getClassApiCall(updatedState.curriculumId, value);
          // cbseWeightageList({ ...updatedState, classId: "" });
        } else if (name === "curriculumId") {
          if (!value) {
            dispatch(resetBrchClassAct(undefined))
            dispatch(setIgseTermDetailsListAct(undefined))
          }
          else {
            getClassApiCall(value, examinationWeightageForm.values.academicYearId);
            examinationTermList(value);
          }
          updatedState.classId = "";
          // cbseWeightageList({ ...updatedState, classId: "" });
        } else if (name === "classId") {
          if (!value) {
            dispatch(resetBrchClassAct(undefined))
          }
          else {
            cbseExaminationList({ classId: updatedState.classId });
          }
          updatedState.examinationId = "";
          cbseWeightageList({ ...updatedState, examinationId: "" });
        } else {
          cbseWeightageList(updatedState);
        }
        advanceFilterChange({ keys: { ...examinationWeightageForm.values, [name]: value }, ignoredKeys });
        return updatedState;
      });
    };
  const toggleAdvanceFilter = () => {
    setOpen(prev => !prev);
  }

  function advanceFilterCallbckHndlr(appliedFilters?: any) {
    pagination.current = { ...pagination.current, pageNo: 0 }
    advanceFilterChange({ keys : { ...examinationWeightageForm.values, ...appliedFilters , academicYearId: "" } , ignoredKeys })
    examinationWeightageForm.setValues((prevState: any) => ({ ...prevState, ...appliedFilters }));
    cbseWeightageList(appliedFilters)    
  }

  function clearFilterHndlr() {
    pagination.current.pageNo = 0;
    const { academicYearId } = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current") || {}
    const selectedCurriculum = brchCurriculumResp?.data?.find((item: { instituteCurriculumId: number }) => item.instituteCurriculumId === 1 ) || brchCurriculumResp?.data?.[0];
    const curriculumId = selectedCurriculum?.branchCurriculumId || "";
    examinationWeightageForm.setValues({ ...initialValues, academicYearId: academicYearId || "", curriculumId });
    cbseWeightageList({ ...initialValues, academicYearId, curriculumId });
    advanceFilterChange({ keys: { ...initialValues }, ignoredKeys })
  }
  const weightageColumns = useMemo(() => generateWeightageColumns(menuOptions), [getCbseWeightageRequestListResp]);
  const { data: cbseWeightageResp, totalElements, totalPages, pageable } = getCbseWeightageRequestListResp || {};
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
                  <h4 className="card-title mb-0 flex-grow-1">Examinations Weightage</h4>
                </div>
              </div>
            </div>
            <div className="card-body p-0">
              <div className="row bg-light m-3 pb-1 px-2 g-3 examination">
                <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2 py-2 mt-2">
                  <div className="search-box">
                    <TextInput
                      name="searchString"
                      formgroupClassName="mb-0"
                      labelText='Search'
                      placeHolder="Search"
                      value={examinationWeightageForm.values.searchString}
                      onChange={onChangeFilterHndlr}
                      floatingLabel
                      inputClassName="bg-light"
                    />
                    <i className="ri-search-line search-icon"></i>
                  </div>
                </div>
                <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2 py-2 mt-2">
                  <SelectInput
                    name="academicYearId"
                    value={examinationWeightageForm.values.academicYearId}
                    onChange={onChangeFilterHndlr}
                    menuItems={academicYearList || []}
                    valueKey="academicYearId"
                    textKey="academicYearName"
                    formgroupClassName="mb-0"
                    labelText='Academic Year'
                    floatingLabel
                      inputClassName="bg-light"
                  />
                </div>
                <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2 py-2 mt-2">
                  <SelectInput
                    name="curriculumId"
                    value={examinationWeightageForm.values.curriculumId}
                    onChange={onChangeFilterHndlr}
                    menuItems={curriculumTypes || []}
                    valueKey="branchCurriculumId"
                    textKey="curriculumName"
                    formgroupClassName="mb-0"
                    labelText='Curriculum'
                    isDisabled={true}
                    floatingLabel
                      inputClassName="bg-light"
                  />
                </div>
                <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2 py-2 mt-2">
                  <SelectInput
                    name="classId"
                    value={examinationWeightageForm.values.classId}
                    onChange={onChangeFilterHndlr}
                    menuItems={classTypes}
                    valueKey="id"
                    textKey="shortName"
                    formgroupClassName="mb-0"
                    floatingLabel
                    // isDisabled={true}
                      inputClassName="bg-light"
                    labelText="Class"
                  />
                </div>
                <div className="col-1 py-2 mt-2">
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
                <div className="col-auto d-flex align-items-center py-2 mt-2">
                  {showClearFilterState && <button type="button" onClick={clearFilterHndlr} className="btn btn-sm btn-ghost-danger">Clear filter</button>}
                </div>
                <div className="col-auto ms-auto py-2 mt-2">
                  <button
                    className="btn btn-success float-end d-flex align-items-center"
                    onClick={() => openCbseWeightageUploadModal()}
                  >
                    <i className="ri-add-line me-2" />
                    Add New
                  </button>
                </div>
              </div>

              <TableContainer
                columns={weightageColumns}
                data={Array.isArray(getCbseWeightageRequestListResp?.data) ? getCbseWeightageRequestListResp?.data : []}
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
      <OffCanvasContainer
        isOpen={open}
        headerTitle="Advance Filters"
        closeHndlr={toggleAdvanceFilter}
        id="advance-filter-book-issuance"
      >
        <AdvanceFilterModal
          appliedFilter={examinationWeightageForm.values}
          applyFilterCallback={advanceFilterCallbckHndlr}
          toggleAdvanceFilter={toggleAdvanceFilter}
          isOpen={open}
        />
      </OffCanvasContainer>
      <ModalContainerUpdated
        id="add-examination-weightage"
        isOpen={cbseWeightageUploadState.showModal}
        toggle={() => closeCbseWeightageUploadModal()}
        modalTitle={cbseWeightageUploadState.modalData ? "Edit Weightage Details" : "Create Details"}
        modalSize="md"
      >
        <AddExaminationWeightageModel
        modalData={examinationWeightageForm.values}
          id={cbseWeightageUploadState.modalData}
          isOpen={false}
          toggle={() => closeCbseWeightageUploadModal()}
          modalTitle="Create Detail"
        />
      </ModalContainerUpdated>
      <ConfirmationModal
        id="delete-examination-weightage"
        isOpen={deleteCbseWeightageState.showModal}
        confirmMessage="Are you sure you want to delete this Weightage ?"
        cancelHndlr={closeDelCbseWeightageModal}
        confirmHndlr={delModalSubmitHndlr}
        showImgIcon={true}
        isDisble={showApiLoader}
        iconType="reject"
      />
    </>
  );
};

export default ExaminationWeightage;
