import React, { useEffect, useMemo, useRef, useState } from "react";
import { ConfirmationModal, ModalContainerUpdated, OffCanvasContainer, SelectInput, TextInput } from '../../../../Components/Common';
import TableContainer from '../../../../Components/Common/TableContainer';
import { generateColumns, ignoredKeys } from "./helper";
import { default as DeleteIconSvg } from "../../../../assets/imagesdps/academics/DeleteIconSvg.svg?react";
import AddExaminationMarksModel from "./AddExaminationMarksModel";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { useModal } from "../../../../hooks/modalhook";
import { useFilterState } from "../../../../hooks/filterhook";
import { deleteCbseExaminationSubjectsListAct, getCbseExaminationListAct, getCbseExaminationSubjectsListAct, getCbseExaminationSubjectsListByIdAct, setCbseExaminationListAct, setCbseExaminationSubjectsListAct } from "../../../../store/examination/examinationsettings/examinationsettingsaction";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import { getBranchClassAct, getBranchCurriculumAct, resetBrchClassAct, resetBrchCurriculumAct } from "../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { IPaginationState } from "../../../../Components/Common/Pagination";
import { useLocation } from "react-router-dom";
import { useFormik } from "formik";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02StrokeStandard, PencilEdit02Icon } from "@hugeicons-pro/core-stroke-standard";
import AdvanceFilterModal from "./AdvanceFilter";
import { default as FilterSvg } from "../../../../assets/imagesdps/academics/FilterSvg.svg?react";
import AddExaminationSubjectsIGSE from "./AddExaminationSubjectsIGSE";
import DisplayOrderModal from "./DisplayOrderModal";
import { getExaminationLanguagesListAct } from "../../../../store/assignlanguages/assignlanguagesaction";

const initialValues = {
  searchString: "",
  academicYearId: "",
  curriculumId: "",
  classId: "",
  examinationId: "",
};

const ExaminationSubjectDetails = () => {

  const dispatch = useAppDispatch();
  const { closeModal: closeDelCbseExaminationSubjectsModal, modalState: deleteCbseExaminationSubjectsState, openModal: openDelCbseExaminationSubjectsModal } = useModal();
  const { closeModal: closeCbseExaminationSubjectsUploadModal, modalState: cbseExaminationSubjectsUploadState, openModal: openCbseExaminationSubjectsUploadModal } = useModal();
  const { closeModal: closeDisplayOrderModal, modalState: displayOrderModalState, openModal: openDisplayOrderModal } = useModal();
    const { showClearFilterState, count, advanceFilterChange } = useFilterState()
  const location = useLocation();
  const [open, setOpen] = useState<boolean>(false);
  const pagination = useRef({
    pageNo: 0,
    pageSize: 10
  });
const isCbse = location.pathname.includes("/cbse-management");
const isIgcse = location.pathname.includes("/igcse-management");

  const cbseExaminationSubjectsList = (otherProps?: any) => {
    let payload = {
      branchId,
      ...examinationSubjectsForm.values,
      ...pagination.current,
      ...otherProps,
    };
    dispatch(getCbseExaminationSubjectsListAct(generateActionPayload("get_cbse_examination_subject_list", undefined, payload)));
  };

  const cbseExaminationList = (classId: string, academicYearId: string) => {
    const payload = {
      academicYearId,
      classId,
      curriculumId: examinationSubjectsForm.values.curriculumId,
      branchId,
    };
    dispatch(getExaminationLanguagesListAct(generateActionPayload("get_cbse_examination_list", undefined, payload)));
  };

  function delModalSubmitHndlr() {
    dispatch(deleteCbseExaminationSubjectsListAct(generateActionPayload("delete_cbse_examination_subject_list", { id: deleteCbseExaminationSubjectsState.modalData })));
  }

  const examinationSubjectsForm = useFormik({
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
    getCbseExaminationSubjectsRequestListResp,
    saveCbseExaminationSubjectsListResp,
    editCbseExaminationSubjectsRequestResp,
    delCbseExaminationSubjectsRequestResp,
    getCbseExaminationRequestListResp,
    changeDisplayOrderExaminationSubjectsListResp,
    cbseExaminationErrorAct
  } = useAppSelector(
    ({ instAcademics, branchAcademics, examinationSettings, appData, globalData, }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      branchClassResp: branchAcademics.branchClassResp,
      showApiLoader: globalData.showApiLoader,
      currentInstIdResp: appData.currentInstIdResp,
      getCbseExaminationSubjectsRequestListResp: examinationSettings.getCbseExaminationSubjectsRequestListResp,
      saveCbseExaminationSubjectsListResp: examinationSettings.saveCbseExaminationSubjectsListResp,
      editCbseExaminationSubjectsRequestResp: examinationSettings.editCbseExaminationSubjectsRequestResp,
      delCbseExaminationSubjectsRequestResp: examinationSettings.delCbseExaminationSubjectsRequestResp,
      changeDisplayOrderExaminationSubjectsListResp: examinationSettings.changeDisplayOrderExaminationSubjectsListResp,
      getCbseExaminationRequestListResp: examinationSettings.getCbseExaminationRequestListResp,
      cbseExaminationErrorAct: examinationSettings.cbseExaminationErrorAct,
    }),
    shallowEqual
  );

  const cbseExaminationSubjectsRef = useRef({
    prevAddCbseExaminationSubjects: saveCbseExaminationSubjectsListResp,
    prevEditCbseExaminationSubjects: editCbseExaminationSubjectsRequestResp,
    prevDeleteCbseExaminationSubjectsRequestListResp: delCbseExaminationSubjectsRequestResp,
    prevChangeDisplayOrderExaminationSubjectsListResp: changeDisplayOrderExaminationSubjectsListResp,
    prevCbseExaminationSubjectsErrorResp: cbseExaminationErrorAct,
  })

  useEffect(() => {
    const { prevAddCbseExaminationSubjects, prevEditCbseExaminationSubjects, prevDeleteCbseExaminationSubjectsRequestListResp, prevChangeDisplayOrderExaminationSubjectsListResp, prevCbseExaminationSubjectsErrorResp } = cbseExaminationSubjectsRef.current;
    if (saveCbseExaminationSubjectsListResp && prevAddCbseExaminationSubjects !== saveCbseExaminationSubjectsListResp) {
      toast.success("ExaminationSubjects added successfully.");
      closeCbseExaminationSubjectsUploadModal()
      cbseExaminationSubjectsList()
    }
    else if (editCbseExaminationSubjectsRequestResp && prevEditCbseExaminationSubjects !== editCbseExaminationSubjectsRequestResp) {
      toast.success("ExaminationSubjects updated successfully.");
      closeCbseExaminationSubjectsUploadModal()
      cbseExaminationSubjectsList()
    }
    else if (delCbseExaminationSubjectsRequestResp && prevDeleteCbseExaminationSubjectsRequestListResp !== delCbseExaminationSubjectsRequestResp) {
      toast.success("ExaminationSubjects deleted successfully.");
      closeDelCbseExaminationSubjectsModal()
      cbseExaminationSubjectsList()
    }
    
        else if (changeDisplayOrderExaminationSubjectsListResp && prevChangeDisplayOrderExaminationSubjectsListResp !== changeDisplayOrderExaminationSubjectsListResp) {
          toast.success("Examination Subjects Order updated successfully.");
          closeDisplayOrderModal()
          cbseExaminationSubjectsList()
        }
    else if (cbseExaminationErrorAct && prevCbseExaminationSubjectsErrorResp !== cbseExaminationErrorAct) {
      const { details, message, status, ERROR } = cbseExaminationErrorAct || {};
      const errorMessage = details || message || ERROR || "Something went wrong.";
      toast.error(errorMessage);
    }
    cbseExaminationSubjectsRef.current.prevDeleteCbseExaminationSubjectsRequestListResp = delCbseExaminationSubjectsRequestResp;
    cbseExaminationSubjectsRef.current.prevEditCbseExaminationSubjects = editCbseExaminationSubjectsRequestResp;
    cbseExaminationSubjectsRef.current.prevAddCbseExaminationSubjects = saveCbseExaminationSubjectsListResp;
    cbseExaminationSubjectsRef.current.prevChangeDisplayOrderExaminationSubjectsListResp = changeDisplayOrderExaminationSubjectsListResp;
    cbseExaminationSubjectsRef.current.prevCbseExaminationSubjectsErrorResp = cbseExaminationErrorAct;
  }, [saveCbseExaminationSubjectsListResp, editCbseExaminationSubjectsRequestResp, delCbseExaminationSubjectsRequestResp, changeDisplayOrderExaminationSubjectsListResp, cbseExaminationErrorAct]);

  const classApiCalled = useRef(false);

  useEffect(() => {
    let yearId = academicYearListResp?.data.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId;
    if (yearId) {
      examinationSubjectsForm.setValues((prev: any) => ({ ...prev, academicYearId: yearId }));
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
    const curriculumMapping: Record<string, string> = {
      "/early-years-management": "EY1-EY3",
      "/cbse-management": "CBSE",
      "/igcse-management": "IGCSE",
    };
    const selectedCurriculumName = curriculumMapping[location.pathname];

    if (Array.isArray(data) && data.length > 0 && examinationSubjectsForm.values.academicYearId) {
      classApiCalled.current = false;
      const selectedCurriculum = data.find(
        (item) => item.shortName === selectedCurriculumName
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
    }
  }, [brchCurriculumResp, examinationSubjectsForm.values.academicYearId]);

  const menuOptions = useMemo(
    () => [
      {
        id: "edit",
        actionIcon: <HugeiconsIcon icon={PencilEdit02Icon} className=" text-muted" size={20} />,
        actionName: "Edit",
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute("data-id");
          dispatch(getCbseExaminationSubjectsListByIdAct(generateActionPayload("get_cbse_examination_subject_details_list_by_id", { id })));
          openCbseExaminationSubjectsUploadModal(id);
        },
      },
      {
        id: "delete",
        actionIcon: <HugeiconsIcon icon={Delete02StrokeStandard} className="text-danger" size={18} />,
        actionName: "Delete",
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute("data-id");
          openDelCbseExaminationSubjectsModal(id)
        },
      },
    ],
    [getCbseExaminationSubjectsRequestListResp]
  );

  function paginationHndlr(paginationInfo: IPaginationState) {
    pagination.current = paginationInfo;
    cbseExaminationSubjectsList(paginationInfo);
  }

  const getCurriculumApiCall = (otherProps?: any) => {
    const payload1 = { academicYearId: examinationSubjectsForm.values.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", ...otherProps };
    dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
  }

  const onChangeFilterHndlr = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    pagination.current.pageNo = 0;

    examinationSubjectsForm.setValues((prev: any) => {
      const updatedState = { ...prev, [name]: value };

      if (name === "academicYearId") {
        classApiCalled.current = false;
        if (!value) {
          dispatch(resetBrchCurriculumAct(undefined))
          dispatch(resetBrchClassAct(undefined))
        }
        else {
        getCurriculumApiCall({ academicYearId: value });
        updatedState.classId = "";
        cbseExaminationSubjectsList({ ...updatedState, classId: "" });
        }
      } else if (name === "curriculumId") {
        if (!value) {
          dispatch(resetBrchClassAct(undefined))
        }
        else {
        }
        updatedState.classId = "";
        cbseExaminationSubjectsList({ ...updatedState, classId: "" });
      } else if (name === "classId") {
        if (!value) {
          dispatch(setCbseExaminationListAct(undefined))
        }
        else {
          cbseExaminationList(updatedState.classId, examinationSubjectsForm.values.academicYearId); 
        }
        updatedState.examinationId = "";
        cbseExaminationSubjectsList({ ...updatedState, examinationId: "" });
      } 
      else {
        cbseExaminationSubjectsList(updatedState);
      }
      advanceFilterChange({ keys: { ...examinationSubjectsForm.values, [name]: value }, ignoredKeys });
      return updatedState;
    });
  };
 
  useEffect(() => {
    return () => {
      dispatch(setCbseExaminationSubjectsListAct(undefined))
    }
  }, []);

  useEffect(() => {
    const { academicYearId, curriculumId, } = examinationSubjectsForm.values;
    if (academicYearId && curriculumId) {
      cbseExaminationSubjectsList({ curriculumId });
    }
  }, [examinationSubjectsForm.values.academicYearId, examinationSubjectsForm.values.curriculumId, examinationSubjectsForm.values.classId]);

  const toggleAdvanceFilter = () => {
    setOpen(prev => !prev);
  }
  const setOrderOpenHndler = () => {
    if (!examinationSubjectsForm.values.academicYearId) {
      toast.error("Please select academic year");
      return
    } else if (!examinationSubjectsForm.values.curriculumId) {
      toast.error("Please select curriculum");
      return
    } else if (!examinationSubjectsForm.values.classId) {
      toast.error("Please select class");
      return
    } else if (!examinationSubjectsForm.values.examinationId) {
      toast.error("Please select Examination");
      return
    }
    openDisplayOrderModal()
  }

  function clearFilterHndlr() {
    pagination.current.pageNo = 0;
    const { academicYearId } = academicYearListResp?.data?.find((year: any) => year.yearStatus.toLowerCase() === "current") || {};
    const curriculumId = examinationSubjectsForm.values.curriculumId;
    examinationSubjectsForm.setValues({ ...initialValues, academicYearId: academicYearId || "", curriculumId: curriculumId || "", });
    cbseExaminationSubjectsList({ ...initialValues, academicYearId, curriculumId });
    advanceFilterChange({ keys: { ...initialValues }, ignoredKeys: [] });
  }

  function advanceFilterCallbckHndlr(appliedFilters?: any) {
    pagination.current = { ...pagination.current, pageNo: 0 }
    advanceFilterChange({ keys: { ...initialValues, ...appliedFilters }, ignoredKeys })
    examinationSubjectsForm.setValues((prevState: any) => ({ ...prevState, ...appliedFilters }));
    cbseExaminationSubjectsList(appliedFilters);
  }

  const examinationSubjectsColumns = useMemo(() => generateColumns(menuOptions), [getCbseExaminationSubjectsRequestListResp]);
  const { data: cbseExaminationSubjectsResp, totalElements, totalPages, pageable } = getCbseExaminationSubjectsRequestListResp || {};
  const { data: academicYearList } = academicYearListResp || {};
  const { data: curriculumTypes } = brchCurriculumResp || {};

  return (
    <>
      <div className="card d-inline-block w-100">
        <div className="row bg-light m-3 pb-1 px-2 g-3 examination">
          <div className="col-xs-12 col-md-12 col-lg-4 col-xl-3 py-2 mt-2">
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
          <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2 py-2 mt-2">
            <SelectInput
              name="academicYearId"
              value={examinationSubjectsForm.values.academicYearId}
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
              value={examinationSubjectsForm.values.curriculumId}
              onChange={onChangeFilterHndlr}
              menuItems={curriculumTypes || []}
              valueKey="branchCurriculumId"
              textKey="curriculumName"
              formgroupClassName="mb-0"
              labelText='Curriculum'
              floatingLabel
                inputClassName="bg-light"
                isDisabled={true}
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
          {showClearFilterState && (
          <div className="col-auto d-flex align-items-center py-2 mt-2">
             <button type="button" onClick={clearFilterHndlr} className="btn btn-sm btn-ghost-danger">
              Clear filter</button>
          </div>
        )}
          <div className="col-auto ms-auto py-2 mt-2">
                              <button
                    className="btn btn-primary me-2"
                    onClick={setOrderOpenHndler}
                  >
                    Set Order
                  </button>
                  <button
              className="btn btn-success float-end d-flex align-items-center"
              onClick={() => openCbseExaminationSubjectsUploadModal()}
            >
              <i className="ri-add-line me-2" />
              Add New
            </button>
          </div>
        </div>
        <TableContainer
          columns={examinationSubjectsColumns}
          data={Array.isArray(getCbseExaminationSubjectsRequestListResp?.data) ? getCbseExaminationSubjectsRequestListResp?.data : []}
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
      <ModalContainerUpdated
        id="add-examination-ExaminationSubjects"
        isOpen={cbseExaminationSubjectsUploadState.showModal}
        toggle={() => closeCbseExaminationSubjectsUploadModal()}
        modalTitle={cbseExaminationSubjectsUploadState.modalData ? "Edit Examination Subjects Details" : "Add Examination Subjects Details"}
        modalSize="xl"
        customWidth="1400px"
      >
        {isCbse && (
          <AddExaminationMarksModel
            id={cbseExaminationSubjectsUploadState.modalData}
            isOpen={false}
            toggle={() => closeCbseExaminationSubjectsUploadModal()}
            modalTitle="Create Detail"
            modalData={examinationSubjectsForm.values}
          />
        )}
        {isIgcse && (
          <AddExaminationSubjectsIGSE
            id={cbseExaminationSubjectsUploadState.modalData}
            isOpen={false}
            toggle={() => closeCbseExaminationSubjectsUploadModal()}
            modalTitle="Create Detail"
            modalData={examinationSubjectsForm.values}
          />
        )}
      </ModalContainerUpdated>
      <ConfirmationModal
        id="delete-examination-ExaminationSubjects"
        isOpen={deleteCbseExaminationSubjectsState.showModal}
        confirmMessage="Are you sure you want to delete this Examination Subjects ?"
        cancelHndlr={closeDelCbseExaminationSubjectsModal}
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
          appliedFilter={examinationSubjectsForm.values}
          applyFilterCallback={advanceFilterCallbckHndlr}
          toggleAdvanceFilter={toggleAdvanceFilter}
          isOpen={open}
        />
      </OffCanvasContainer>
      <ModalContainerUpdated
              id="change-examination_subject-order"
              isOpen={displayOrderModalState.showModal}
              toggle={() => closeDisplayOrderModal()}
              modalTitle={"Set Grade Book Order"}
              modalSize="md"
            >
              <DisplayOrderModal
                modalData={getCbseExaminationSubjectsRequestListResp?.data}
                isOpen={displayOrderModalState.showModal}
                toggle={() => closeDisplayOrderModal()}
                formValues={examinationSubjectsForm.values}
                showApiLoader={showApiLoader}
              />
            </ModalContainerUpdated>
    </>
  );
};

export default ExaminationSubjectDetails;
