import React, { useEffect, useMemo, useRef, useState } from "react";
import { ConfirmationModal, ModalContainerUpdated, OffCanvasContainer, SelectInput, TextInput } from "../../../../Components/Common";
import TableContainer from "../../../../Components/Common/TableContainer";
import { generateExaminationColumns, ignoredKeys } from "./helper";
import { useFormik } from "formik";
import ExaminationNameModel from "./ExaminationNameModel";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import { deleteCbseExaminationListAct, getCbseExaminationListAct, getCbseExaminationListByIdAct, getExamCategoryAct, getIgseTermNameListAct, setCbseExaminationListAct } from "../../../../store/examination/examinationsettings/examinationsettingsaction";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { useModal } from "../../../../hooks/modalhook";
import { useFilterState } from "../../../../hooks/filterhook";
import { getBranchClassAct, getBranchCurriculumAct, resetBrchClassAct, resetBrchCurriculumAct } from "../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { IPaginationState } from "../../../../Components/Common/Pagination";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import { useLocation } from "react-router-dom";
import DisplayOrderModal from "./DisplayOrderModal";
import * as Yup from "yup";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02StrokeStandard, PencilEdit02Icon } from "@hugeicons-pro/core-stroke-standard";
import { default as FilterSvg } from "../../../../assets/imagesdps/academics/FilterSvg.svg?react";
import AdvanceFilterModal from "./AdvancedFilterModal";
import { setIgseTermDetailsListAct } from "../../../../store/examination/examinationsettings/examinationsettingsslice";

const initialValues = {
  searchString: "",
  academicYearId: "",
  curriculumId: "",
  classId: "",
  examCategoryId: "",
};

const validationSchema = Yup.object({
  academicYearId: Yup.string().required("Academic Year is required"),
  curriculumId: Yup.string().required("Curriculum is required"),
  classId: Yup.string().required("Class is required"),
});

const ExaminationName = () => {

  const dispatch = useAppDispatch();
  const { closeModal: closeDelCbseExaminationModal, modalState: deleteCbseExaminationState, openModal: openDelCbseExaminationModal } = useModal();
  const { closeModal: closeCbseExaminationUploadModal, modalState: cbseExaminationUploadState, openModal: openCbseExaminationUploadModal } = useModal();
  const { closeModal: closeDisplayOrderModal, modalState: displayOrderModalState, openModal: openDisplayOrderModal } = useModal();
  const { showClearFilterState, count, advanceFilterChange } = useFilterState()
  const location = useLocation();
  const [open, setOpen] = useState<boolean>(false);
  const isTermWiseExamPath = location.pathname.includes("/igcse-settings/term-wise-examination");

  const pagination = useRef({
    pageNo: 0,
    pageSize: 30
  })

  const cbseExaminationList = (otherProps?: any) => {
    let payload = {
      branchId,
      ...examinationNameForm.values,
      ...pagination.current,
      ...otherProps,
    };
    if (payload.academicYearId && payload.curriculumId && payload.classId) {
      dispatch(getCbseExaminationListAct(generateActionPayload("get_cbse_examination_list", undefined, payload)));
    }
  };

  const toggleAdvanceFilter = () => {
    setOpen(prev => !prev);
  }

  const getExamCategoryApiCall = () => {
    dispatch(getExamCategoryAct(generateActionPayload("get_exam_category")));
  }

  const igseTermList = (curriculumId: string) => {
    if (curriculumId && isTermWiseExamPath) {
      let payload = {
        branchId,
        curriculumId,
      };
      dispatch(getIgseTermNameListAct(generateActionPayload("get_igse_term_name_list", undefined, payload)));
    }
  };

  function delModalSubmitHndlr() {
    dispatch(deleteCbseExaminationListAct(generateActionPayload("delete_cbse_examination_list", { id: deleteCbseExaminationState.modalData })));
  }

  const examinationNameForm = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => { },
  });

  const {
    academicYearListResp,
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    brchCurriculumResp,
    branchClassResp,
    showApiLoader,
    getCbseExaminationRequestListResp,
    saveCbseExaminationListResp,
    editCbseExaminationRequestResp,
    delCbseExaminationRequestResp,
    changeDisplayOrderExamResp,
    getExamCategoryResp,
    cbseExaminationErrorAct
  } = useAppSelector(
    ({ instAcademics, branchAcademics, examinationSettings, appData, globalData, }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      showApiLoader: globalData.showApiLoader,
      currentInstIdResp: appData.currentInstIdResp,
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      branchClassResp: branchAcademics.branchClassResp,
      getCbseExaminationRequestListResp: examinationSettings.getCbseExaminationRequestListResp,
      saveCbseExaminationListResp: examinationSettings.saveCbseExaminationListResp,
      editCbseExaminationRequestResp: examinationSettings.editCbseExaminationRequestResp,
      delCbseExaminationRequestResp: examinationSettings.delCbseExaminationRequestResp,
      changeDisplayOrderExamResp: examinationSettings.changeDisplayOrderExamResp,
      getExamCategoryResp: examinationSettings.getExamCategoryResp,
      cbseExaminationErrorAct: examinationSettings.cbseExaminationErrorAct,
    }),
    shallowEqual
  );

  const cbseExaminationRef = useRef({
    prevAddCbseExamination: saveCbseExaminationListResp,
    prevEditCbseExamination: editCbseExaminationRequestResp,
    prevDeleteCbseExaminationRequestListResp: delCbseExaminationRequestResp,
    prevChangeDisplayOrderExamResp: changeDisplayOrderExamResp,
    prevCbseExaminationErrorResp: cbseExaminationErrorAct,
  })

  useEffect(() => {
    const { prevAddCbseExamination, prevEditCbseExamination, prevDeleteCbseExaminationRequestListResp, prevChangeDisplayOrderExamResp, prevCbseExaminationErrorResp } = cbseExaminationRef.current;
    if (saveCbseExaminationListResp && prevAddCbseExamination !== saveCbseExaminationListResp) {
      toast.success("Examination added successfully.");
      closeCbseExaminationUploadModal()
      cbseExaminationList()
    }
    else if (editCbseExaminationRequestResp && prevEditCbseExamination !== editCbseExaminationRequestResp) {
      toast.success("Examination updated successfully.");
      closeCbseExaminationUploadModal()
      cbseExaminationList()
    }
    else if (delCbseExaminationRequestResp && prevDeleteCbseExaminationRequestListResp !== delCbseExaminationRequestResp) {
      toast.success("Examination deleted successfully.");
      closeDelCbseExaminationModal()
      cbseExaminationList()
    }
    else if (changeDisplayOrderExamResp && prevChangeDisplayOrderExamResp !== changeDisplayOrderExamResp) {
      toast.success("Examination Display Order updated successfully.");
      closeDisplayOrderModal()
      cbseExaminationList()
    }
    else if (cbseExaminationErrorAct && prevCbseExaminationErrorResp !== cbseExaminationErrorAct) {
      const { details, error } = cbseExaminationErrorAct || {};
      toast.error(details || error || "Something went wrong.");
    }
    cbseExaminationRef.current.prevDeleteCbseExaminationRequestListResp = delCbseExaminationRequestResp;
    cbseExaminationRef.current.prevEditCbseExamination = editCbseExaminationRequestResp;
    cbseExaminationRef.current.prevAddCbseExamination = saveCbseExaminationListResp;
    cbseExaminationRef.current.prevChangeDisplayOrderExamResp = changeDisplayOrderExamResp;
    cbseExaminationRef.current.prevCbseExaminationErrorResp = cbseExaminationErrorAct;
  }, [saveCbseExaminationListResp, changeDisplayOrderExamResp, editCbseExaminationRequestResp, delCbseExaminationRequestResp, cbseExaminationErrorAct]);

  useEffect(() => {
    getExamCategoryApiCall()
    return () => {
      dispatch(setCbseExaminationListAct(undefined))
    }
  }, []);
  const classApiCalled = useRef(false);

  useEffect(() => {
    const { data } = brchCurriculumResp || {};
    const curriculumMapping: Record<string, string> = {
      "/early-years-management": "EY1-EY3",
      "/cbse-settings/examination-name": "CBSE",
      "/igcse-settings/term-wise-examination": "IGCSE",
    };
    const selectedCurriculumName = curriculumMapping[location.pathname];
    if (Array.isArray(data) && data.length > 0 && examinationNameForm.values.academicYearId && !classApiCalled.current) {
      const selectedCurriculum = data.find(
        (item) => item.shortName === selectedCurriculumName
      );
      if (!selectedCurriculum) {
        examinationNameForm.setValues((prev: any) => ({
          ...prev,
          curriculumId: undefined,
        }));
        return;
      }
      const payload = {
        branchId,
        curriculumId: selectedCurriculum.branchCurriculumId,
        academicYearId: examinationNameForm.values.academicYearId,
        sortBy: "classSequence",
        classFilter: "HIGHER",
        orderBy: "asc",
        pageNo: 0,
        pageSize: 100,
      };
      dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
      examinationNameForm.setValues((prev: any) => ({
        ...prev,
        curriculumId: selectedCurriculum.branchCurriculumId,
      }));
      if (isTermWiseExamPath) {
        dispatch(getIgseTermNameListAct(generateActionPayload("get_igse_term_name_list", undefined, { branchId, curriculumId: selectedCurriculum.branchCurriculumId })));
      }
      classApiCalled.current = true;
    }
  }, [brchCurriculumResp, examinationNameForm.values.academicYearId]);

  useEffect(() => {
    const { content } = branchClassResp || {};
    if (Array.isArray(content) && content.length > 0) {

      examinationNameForm.setValues((prev: any) => ({ ...prev, classId: content[0].id }))
      cbseExaminationList({ classId: content[0]?.id });
    }
  }, [branchClassResp])

  useEffect(() => {
    let yearId = academicYearListResp?.data.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId;
    if (yearId) {
      examinationNameForm.setValues((prev: any) => ({ ...prev, academicYearId: yearId }));
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
          dispatch(getCbseExaminationListByIdAct(generateActionPayload("get_cbse_examination_details_list_by_id", { id })));
          openCbseExaminationUploadModal(id);
        },
      },
      {
        id: "delete",
        actionIcon: <HugeiconsIcon icon={Delete02StrokeStandard} className="text-danger" size={18} />,
        actionName: "Delete",
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute("data-id");
          openDelCbseExaminationModal(id)
        },
      },
    ],
    [getCbseExaminationRequestListResp]
  );

  function paginationHndlr(paginationInfo: IPaginationState) {
    pagination.current = paginationInfo;
    cbseExaminationList(paginationInfo);
  }
  const getCurriculumApiCall = (otherProps?: any) => {
    const payload1 = { academicYearId: examinationNameForm.values.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", ...otherProps };
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

    examinationNameForm.setValues((prev: any) => {
      const updatedState = { ...prev, [name]: value };

      if (name === "academicYearId") {
        if (!value) {
          dispatch(resetBrchCurriculumAct(undefined))
          dispatch(resetBrchClassAct(undefined))
        }
        else {
          getCurriculumApiCall({ academicYearId: value });
          updatedState.classId = "";
          getClassApiCall(updatedState.curriculumId, value);
        }
      } else if (name === "curriculumId") {
        if (!value) {
          dispatch(resetBrchClassAct(undefined))
          dispatch(setIgseTermDetailsListAct(undefined))
        }
        else {
          getClassApiCall(value, examinationNameForm.values.academicYearId);
          igseTermList(value);
        }
        updatedState.classId = "";
        cbseExaminationList({ ...updatedState, classId: "" });
      } else if (name === "classId") {
        if (value) {
          cbseExaminationList(updatedState);
        }
      }
      else {
        cbseExaminationList(updatedState);
      }
      advanceFilterChange({ keys: { ...examinationNameForm.values, [name]: value }, ignoredKeys });
      return updatedState;
    });
  };

  const setOrderOpenHndler = () => {
    if (!examinationNameForm.values.academicYearId) {
      toast.error("Please select academic year");
      return
    } else if (!examinationNameForm.values.curriculumId) {
      toast.error("Please select curriculum");
      return
    } else if (!examinationNameForm.values.classId) {
      toast.error("Please select class");
      return
    }
    openDisplayOrderModal()
  }

  function advanceFilterCallbckHndlr(appliedFilters?: any) {
    pagination.current = { ...pagination.current, pageNo: 0 }
    advanceFilterChange({ keys: { ...initialValues, ...appliedFilters, academicYearId: "" }, ignoredKeys })
    examinationNameForm.setValues((prevState: any) => ({ ...prevState, ...appliedFilters }));
    cbseExaminationList(appliedFilters)
  }

  const examinationColumns = useMemo(() => generateExaminationColumns(menuOptions, isTermWiseExamPath), [getCbseExaminationRequestListResp]);
  const { totalElements, totalPages, pageable } = getCbseExaminationRequestListResp || {};
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
                  <h4 className="card-title mb-0 flex-grow-1">{isTermWiseExamPath ? "Term Wise Examination" : "Examination"}</h4>
                </div>
              </div>
            </div>
            <div className="card-body p-0">
              <div className="row bg-light m-3 pb-1 px-2 g-3 examination">
                <div className="col-xs-12 col-md-12 col-lg-2 col-xl-2 py-2 mt-2">
                  <div className="search-box">
                    <TextInput
                      name="searchString"
                      formgroupClassName="mb-0"
                      labelText='Search'
                      placeHolder="Search"
                      value={examinationNameForm.values.searchString}
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
                    value={examinationNameForm.values.academicYearId}
                    onChange={onChangeFilterHndlr}
                    menuItems={academicYearList || []}
                    valueKey="academicYearId"
                    textKey="academicYearName"
                    formgroupClassName="mb-0"
                    labelText='Academic Year'
                    floatingLabel
                    inputClassName="bg-light"
                    invalid={(examinationNameForm.touched.academicYearId && examinationNameForm.errors.academicYearId) ? true : false}
                    error={(examinationNameForm.touched.academicYearId && examinationNameForm.errors.academicYearId) ? examinationNameForm.errors.academicYearId : ""}
                  />
                </div>
                <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2 py-2 mt-2">
                  <SelectInput
                    name="curriculumId"
                    value={examinationNameForm.values.curriculumId}
                    onChange={onChangeFilterHndlr}
                    menuItems={curriculumTypes || []}
                    valueKey="branchCurriculumId"
                    textKey="curriculumName"
                    formgroupClassName="mb-0"
                    labelText='Curriculum'
                    floatingLabel
                    inputClassName="bg-light"
                    isDisabled={true}
                    invalid={(examinationNameForm.touched.curriculumId && examinationNameForm.errors.curriculumId) ? true : false}
                    error={(examinationNameForm.touched.curriculumId && examinationNameForm.errors.curriculumId) ? examinationNameForm.errors.curriculumId : ""}
                  />
                </div>
                <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2 py-2 mt-2">
                  <SelectInput
                    name="classId"
                    value={examinationNameForm.values.classId}
                    onChange={onChangeFilterHndlr}
                    menuItems={classTypes || []}
                    valueKey="id"
                    textKey="shortName"
                    formgroupClassName="mb-0"
                    labelText='Class'
                    floatingLabel
                    inputClassName="bg-light"
                    invalid={(examinationNameForm.touched.classId && examinationNameForm.errors.classId) ? true : false}
                    error={(examinationNameForm.touched.classId && examinationNameForm.errors.classId) ? examinationNameForm.errors.classId : ""}
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
                <div className="col-auto ms-auto d-flex py-2 mt-2 ">
                  <button
                    className="btn btn-primary me-2"
                    onClick={setOrderOpenHndler}
                  >
                    Set Order
                  </button>
                  <button
                    className="btn btn-success"
                    onClick={() => openCbseExaminationUploadModal()}
                  >
                    <i className="ri-add-line me-2" />
                    Add New
                  </button>
                </div>
              </div>

              <TableContainer
                columns={examinationColumns}
                data={examinationNameForm.values.curriculumId ? (Array.isArray(getCbseExaminationRequestListResp?.data) ? getCbseExaminationRequestListResp?.data : []) : []}
                tableClass="mb-0"
                divClass="table-responsive mb-3"
                theadClass="table-light text-muted align-middle"
                showCheckbox={false}
                showPagination={true}
                totalPages={totalPages || 0}
                totalRecords={totalElements || 0}
                callbackPaginationHndlr={paginationHndlr}
                currentPageNumber={pageable?.pageNumber || 0}
                pageSize={pagination.current.pageSize}
              />
            </div>
          </div>
        </div>
      </div>
      <ModalContainerUpdated
        id="add-examination"
        isOpen={cbseExaminationUploadState.showModal}
        toggle={() => closeCbseExaminationUploadModal()}
        modalTitle={cbseExaminationUploadState.modalData ? "Edit Examination Details" : "Create Details"}
        modalSize="md"
      >
        <ExaminationNameModel
          id={cbseExaminationUploadState.modalData}
          isOpen={false}
          toggle={() => closeCbseExaminationUploadModal()}
          modalTitle="Create Detail"
          modalData={examinationNameForm.values}
        />
      </ModalContainerUpdated>
      <ModalContainerUpdated
        id="change-examination-order"
        isOpen={displayOrderModalState.showModal}
        toggle={() => closeDisplayOrderModal()}
        modalTitle={"Set Examination Order"}
        modalSize="md"
      >
        <DisplayOrderModal
          modalData={getCbseExaminationRequestListResp?.data}
          isOpen={displayOrderModalState.showModal}
          toggle={() => closeDisplayOrderModal()}
          formValues={examinationNameForm.values}
          showApiLoader={showApiLoader}
        />
      </ModalContainerUpdated>
      <ConfirmationModal
        id="delete-examination-modal"
        isOpen={deleteCbseExaminationState.showModal}
        confirmMessage="Are you sure you want to delete this Eximanition ?"
        cancelHndlr={closeDelCbseExaminationModal}
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
          appliedFilter={examinationNameForm.values}
          applyFilterCallback={advanceFilterCallbckHndlr}
          toggleAdvanceFilter={toggleAdvanceFilter}
          isOpen={open}
        />
      </OffCanvasContainer>
    </>
  );
};

export default ExaminationName;
