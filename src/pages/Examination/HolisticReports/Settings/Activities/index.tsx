import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ConfirmationModal,
  OffCanvasContainer,
  SelectInput,
  TextInput,
} from "../../../../../Components/Common";
import BreadCrumb from "../../../../../Components/Common/BreadCrumb";
import TableContainer from "../../../../../Components/Common/TableContainer";
import { generateColumns, ignoredKeys } from "./helper";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Copy01Icon,
  Delete02StrokeStandard,
  PencilEdit02Icon,
} from "@hugeicons-pro/core-stroke-standard";
import { useModal } from "../../../../../hooks/modalhook";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
import { generateActionPayload } from "../../../../../utility/reduxutility";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import { IPaginationState } from "../../../../../Components/Common/Pagination";
import { useFormik } from "formik";
import { debounce } from "../../../../../utility/commonutility";
import { deleteHolisticActivityAct, getClassesByStageAct, getHolisticActivityAct } from "../../../../../store/examination/examinationsettings/examinationsettingsaction";
import { useHistory } from "react-router-dom";
import { resetBrchClassAct, resetBrchCurriculumAct } from "../../../../../store/branchsettings/branchacademics/branchacademicsslice";
import { getBranchClassAct } from "../../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { useFilterState } from "../../../../../hooks/filterhook";
import AdvanceFilterModal from "./AdvanceFilter";
import { default as FilterSvg } from "../../../../../assets/imagesdps/academics/FilterSvg.svg?react";


const initialValues = {
  searchString: "",
  academicYearId: "",
  curriculumId: "",
  classId: "",
  branchId: "",
};

const CurriculumGoals = () => {
  const history = useHistory();
  const { showClearFilterState, count, advanceFilterChange } = useFilterState()
  const [open, setOpen] = useState<boolean>(false);
  const {
    openModal: delSportsNameOpenModal,
    closeModal: delSportsNameCloseModal,
    modalState: delSportsNameModalState,
  } = useModal();

  const dispatch = useAppDispatch();
  const paginationRef = useRef({
    pageNo: 0,
    pageSize: 10,
  });

  const {
    currentBranchIdResp: branchId,
    getHolisticActivityResp,
    saveHolisticActivityResp,
    updateHolisticActivityResp,
    cbseExaminationErrorAct,
    deleteHolisticActivityResp,
    loggedInUserRole,
    branchClassResp,
    academicYearListResp,
    brchCurriculumResp,
    branchListResp,
    virtualRoleResp,
    currentInstIdResp: instituteId,
    getClassesByStageResp

  } = useAppSelector(
    ({ appData, branchAcademics, instAcademics, examinationSettings, branch }) => ({
      currentBranchIdResp: appData.currentBranchIdResp,
      getHolisticActivityResp: examinationSettings.getHolisticActivityResp,
      saveHolisticActivityResp: examinationSettings.saveHolisticActivityResp,
      updateHolisticActivityResp: examinationSettings.updateHolisticActivityResp,
      cbseExaminationErrorAct: examinationSettings.cbseExaminationErrorAct,
      deleteHolisticActivityResp: examinationSettings.deleteHolisticActivityResp,
      branchClassResp: branchAcademics.branchClassResp,
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      academicYearListResp: instAcademics.academicYearListResp,
      loggedInUserRole: appData.loggedInUserRole,
      branchListResp: branch.branchListResp,
      currentInstIdResp: appData.currentInstIdResp,
      virtualRoleResp: appData.virtualRoleResp,
      getClassesByStageResp: examinationSettings.getClassesByStageResp,
    }),
    shallowEqual
  );
  const showInstituteAdminUI = loggedInUserRole === 'INSTITUTE_ADMIN' && !virtualRoleResp;

  const sportsNameFormik = useFormik({
    initialValues,
    onSubmit: (value) => { },
  });

  const menuOptions = useMemo(
    () => [
      {
        id: "edit",
        actionIcon: (
          <HugeiconsIcon
            icon={PencilEdit02Icon}
            className="text-muted"
            size={18}
          />
        ),
        actionName: "Edit",
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute("data-id");
          history.push(showInstituteAdminUI ? "/holistic-activity-management/edit" : "/holistic-management/edit-activity", { id: id, isCopy: false });
          // addEditSportNameOpenModal(id);
        },
      },
      {
        id: "copy",
        actionIcon: (
          <HugeiconsIcon
            icon={Copy01Icon}
            className="text-muted"
            size={18}
          />
        ),
        actionName: "Copy Activity",
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute("data-id");
          history.push("/holistic-activity-management/copy", { id: id, isCopy: true });
          // addEditSportNameOpenModal(id);
        },
      },
      {
        id: "delete",
        actionIcon: (
          <HugeiconsIcon
            icon={Delete02StrokeStandard}
            className="text-danger"
            size={18}
          />
        ),
        actionName: "Delete",
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute("data-id");
          delSportsNameOpenModal(id);
        },
      },
    ],
    []
  );

  const getHolisticActivityApiCall = (otherProps?: any) => {
    const payload = {
      ...(showInstituteAdminUI ? { branchId: sportsNameFormik.values.branchId } : { branchId }),
      academicYearId: sportsNameFormik.values.academicYearId,
      // curriculumId: sportsNameFormik.values.curriculumId,
      classId: sportsNameFormik.values.classId,
      instituteId,
      ...otherProps,
      ...paginationRef.current,
    };

    dispatch(getHolisticActivityAct(generateActionPayload("get_holistic_activity", undefined, payload)));
  };
  const getCurriculumClassApiCall = (otherProps?: any) => {
    const payload = {
      branchId: showInstituteAdminUI ? sportsNameFormik.values.branchId : branchId,
      academicYearId: sportsNameFormik.values.academicYearId,
      stageId: 1,
      ...otherProps,
    };

    dispatch(getClassesByStageAct(generateActionPayload("get_classes_by_stage", undefined, payload)));
  };

  function delSportNameItemHndlr() {
    dispatch(deleteHolisticActivityAct(generateActionPayload("delete_holistic_activity", { id: delSportsNameModalState.modalData })));

  }

  function paginationHndlr(paginationInfo: IPaginationState) {
    paginationRef.current = paginationInfo;
    getHolisticActivityApiCall(paginationInfo);
  }

  function search(value: string) {
    getHolisticActivityApiCall({ ...sportsNameFormik.values, searchString: value });
  }
  const toggleAdvanceFilter = () => {
    setOpen(prev => !prev);
  }
  const clearFilterHndlr = () => {
    if (academicYearListResp) {
      paginationRef.current = { ...paginationRef.current, pageNo: 0 }
      let { academicYearId } = academicYearListResp?.data?.find((year: any) => year.yearStatus === "CURRENT") || {};
      dispatch(resetBrchClassAct(undefined));
      let updatedBranchId = ""
      if (showInstituteAdminUI) {
        updatedBranchId = ""
      } else {
        updatedBranchId = branchId
      }
      sportsNameFormik.setValues({ ...initialValues, academicYearId: academicYearId || "", branchId: updatedBranchId });
      getHolisticActivityApiCall({ ...initialValues, academicYearId, branchId: updatedBranchId })
      getCurriculumClassApiCall({ academicYearId, branchId: updatedBranchId })
      advanceFilterChange({ keys: { ...initialValues }, ignoredKeys: [] })
      if (!showInstituteAdminUI) {
        getCurriculumApiCall({ academicYearId, branchId: updatedBranchId })
      }
      else {
        dispatch(resetBrchCurriculumAct(undefined));
      }
    }
  }

  function advanceFilterCallbckHndlr(appliedFilters?: any) {
    paginationRef.current = { ...paginationRef.current, pageNo: 0 }
    advanceFilterChange({ keys: { ...initialValues, ...appliedFilters }, ignoredKeys })
    sportsNameFormik.setValues((prevState: any) => ({ ...prevState, ...appliedFilters }));
    getHolisticActivityApiCall(appliedFilters);
  }

  const debounceFun = useCallback(debounce(search, 200), [getHolisticActivityResp]);
  const getClassApiCall = (otherProps?: any) => {
    const payload = {
      ...(showInstituteAdminUI ? { branchId: sportsNameFormik.values.branchId } : { branchId }),
      academicYearId: sportsNameFormik.values.academicYearId,
      curriculumId: sportsNameFormik.values.curriculumId,
      sortBy: "classSequence",
      orderBy: "asc",
      pageNo: 0,
      pageSize: 100,
      ...otherProps,
    };

    dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
  };

  const getCurriculumApiCall = (otherProps?: any) => {
    const payload = {
      ...(showInstituteAdminUI ? { branchId: sportsNameFormik.values.branchId } : { branchId }),
      academicYearId: sportsNameFormik.values.academicYearId,
      pageNo: 0,
      pageSize: 100,
      sortBy: "curriculumName",
      orderBy: "asc",
      ...otherProps,
    };

    // dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload)));
  };

  useEffect(() => {
    if (academicYearListResp && academicYearListResp.data && !showInstituteAdminUI) {
      let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId
      sportsNameFormik.setFieldValue("academicYearId", yearId || "")
      getCurriculumApiCall({ academicYearId: yearId || "" });
      getCurriculumClassApiCall({ academicYearId: yearId || "" });
      getHolisticActivityApiCall({ academicYearId: yearId || "" });
    }
    else if (academicYearListResp && academicYearListResp.data && showInstituteAdminUI) {
      let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId
      sportsNameFormik.setFieldValue("academicYearId", yearId || "")
      if (branchListResp?.data) {
        let branchIdLocal = branchListResp?.data[0]?.branchId;
        sportsNameFormik.setFieldValue("branchId", branchIdLocal || "")
        getCurriculumApiCall({ academicYearId: yearId || "", branchId: branchIdLocal || "" });
        getHolisticActivityApiCall({ academicYearId: yearId || "", branchId: branchIdLocal || "" });
        getCurriculumClassApiCall({ academicYearId: yearId || "", branchId: branchIdLocal || "" });
      }
    }
  }, [academicYearListResp, branchListResp, showInstituteAdminUI]);



  function onChangeFilterHndlr(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    paginationRef.current.pageNo = 0;

    if (name === "academicYearId") {
      if (value) {
        getHolisticActivityApiCall({ [name]: value, branchClassId: "", curriculumId: "" });
        dispatch(resetBrchClassAct(undefined));
        getCurriculumApiCall({ academicYearId: value });
        getCurriculumClassApiCall({ academicYearId: value });
        sportsNameFormik.setFieldValue("curriculumId", "");
        sportsNameFormik.setFieldValue("classId", "");
      } else {
        getHolisticActivityApiCall({ [name]: "" });
        getCurriculumClassApiCall({ academicYearId: "" });
        dispatch(resetBrchCurriculumAct(undefined));
        dispatch(resetBrchClassAct(undefined));
      }
    }
    else if (name === "curriculumId") {
      if (value) {
        getHolisticActivityApiCall({ [name]: value, branchClassId: "" });
        getClassApiCall({ curriculumId: value, academicYearId: sportsNameFormik.values.academicYearId });
      } else {
        getHolisticActivityApiCall({ [name]: "" });
        dispatch(resetBrchClassAct(undefined));
      }
    }
    else if (name === "branchId") {
      if (value) {
        // getCurriculumApiCall({ academicYearId: sportsNameFormik.values.academicYearId, branchId: value });
        getHolisticActivityApiCall({ [name]: value, curriculumId: "", classId: "" });
        getCurriculumClassApiCall({ academicYearId: sportsNameFormik.values.academicYearId, branchId: value });
      } else {
        getHolisticActivityApiCall({ [name]: "" });
        dispatch(resetBrchCurriculumAct(undefined));
        dispatch(resetBrchClassAct(undefined));
      }
    }
    else {
      getHolisticActivityApiCall({ [name]: value });
    }

    sportsNameFormik.setFieldValue(name, value);

    const updatedValues = { ...sportsNameFormik.values, [name]: value };
    advanceFilterChange({ keys: updatedValues, ignoredKeys });
  }


  const sportsNamesRef = useRef({
    prevSaveHolisticActivityResp: saveHolisticActivityResp,
    prevUpdateHolisticActivityResp: updateHolisticActivityResp,
    prevDeleteHolisticActivityResp: deleteHolisticActivityResp,
    prevCbseExaminationErrorAct: cbseExaminationErrorAct,
  });

  useEffect(() => {
    const {
      prevSaveHolisticActivityResp,
      prevUpdateHolisticActivityResp,
      prevDeleteHolisticActivityResp,
      prevCbseExaminationErrorAct,
    } = sportsNamesRef.current;

    if (
      saveHolisticActivityResp &&
      saveHolisticActivityResp !== prevSaveHolisticActivityResp
    ) {
      getHolisticActivityApiCall();
    } else if (
      updateHolisticActivityResp &&
      updateHolisticActivityResp !== prevUpdateHolisticActivityResp
    ) {
      getHolisticActivityApiCall();
    }
    else if (
      deleteHolisticActivityResp &&
      deleteHolisticActivityResp !== prevDeleteHolisticActivityResp
    ) {
      toast.success(" Activity deleted successfully");
      delSportsNameCloseModal();
      getHolisticActivityApiCall();
    }
    else if (
      cbseExaminationErrorAct &&
      cbseExaminationErrorAct !== prevCbseExaminationErrorAct
    ) {
      const { details } = cbseExaminationErrorAct;
      toast.error(details || "Something went wrong");
    }

    sportsNamesRef.current.prevSaveHolisticActivityResp = saveHolisticActivityResp;
    sportsNamesRef.current.prevUpdateHolisticActivityResp = updateHolisticActivityResp;
    sportsNamesRef.current.prevDeleteHolisticActivityResp = deleteHolisticActivityResp;
    sportsNamesRef.current.prevCbseExaminationErrorAct = cbseExaminationErrorAct;
  }, [
    saveHolisticActivityResp,
    updateHolisticActivityResp,
    deleteHolisticActivityResp,
    cbseExaminationErrorAct,
  ]);

  const tableColumns = useMemo(
    () => generateColumns(menuOptions, showInstituteAdminUI),
    [menuOptions, showInstituteAdminUI]
  );

  const {
    data: activities,
    totalElements,
    totalPages,
    pageNumber,
  } = getHolisticActivityResp || {};

  return (
    <>
      {showInstituteAdminUI ? (<div className="page-content">
        <div className="container-fluid">
          <BreadCrumb title="Examination" pageTitle="Examination" />

          <div className="card mb-0">
            <div className="card-header">
              <div className="row align-items-center">
                <div className="col-6">
                  <h4 className="card-title mb-0 flex-grow-1">Activities</h4>
                </div>
              </div>
            </div>
            <div className="card-body p-0">
              <div className="row px-3 g-3 pt-3">
                <div className="col-xs-12 col-md-12 col-lg-4 col-xl-3">
                  <div className="search-box">
                    <TextInput
                      name="searchString"
                      formgroupClassName="mb-3"
                      placeHolder="Search..."
                      value={sportsNameFormik.values.searchString}
                      onChange={onChangeFilterHndlr}
                      floatingLabel
                      labelText="Search"
                    />
                    <i className="ri-search-line search-icon"></i>
                  </div>
                </div>
                <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                  <SelectInput
                    name="academicYearId"
                    value={sportsNameFormik.values.academicYearId}
                    onChange={onChangeFilterHndlr}
                    menuItems={academicYearListResp?.data}
                    valueKey="academicYearId"
                    textKey="academicYearName"
                    formgroupClassName="mb-0"
                    labelText="Academic Year"
                    floatingLabel
                  />
                </div>
                <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                  <SelectInput
                    name="branchId"
                    valueKey="branchId"
                    textKey="branchName"
                    value={sportsNameFormik.values.branchId}
                    menuItems={branchListResp?.data}
                    onChange={onChangeFilterHndlr}
                    labelText="Branch Name"
                    floatingLabel
                    formgroupClassName="mb-0"
                  />
                </div>
                {/* <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                  <SelectInput
                    name="curriculumId"
                    value={sportsNameFormik.values.curriculumId}
                    onChange={onChangeFilterHndlr}
                    menuItems={brchCurriculumResp?.data}
                    valueKey="branchCurriculumId"
                    textKey="curriculumName"
                    formgroupClassName="mb-0"
                    labelText="Curriculum"
                    floatingLabel
                  />
                </div> */}
                <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                  <SelectInput
                    name="classId"
                    value={sportsNameFormik.values.classId}
                    onChange={onChangeFilterHndlr}
                    menuItems={getClassesByStageResp}
                    valueKey="classId"
                    textKey="className"
                    formgroupClassName="mb-0"
                    labelText="Curriculum Class"
                    floatingLabel
                  />
                </div>
                <div className="col-auto col-xl-1 !tw-mb-4">
                  <button
                    style={{
                      backgroundColor: "#F4F7FA",
                    }}
                    onClick={toggleAdvanceFilter}
                    className="p-2 btn d-flex"
                  >
                    <FilterSvg height={"18px"} width={"18px"} />
                    <span className="ms-2">Filters</span>
                  </button>
                  <span
                    className="badge align-middle rounded-pill ms-1 "
                    style={{
                      marginBottom: "18px",
                      position: "absolute",
                      top: "-9px",
                      left: "78px",
                      background: "#0ab39c",
                    }}
                  >
                    {count}
                  </span>
                </div>
                {showClearFilterState && (
                  <div className="col-auto d-flex align-items-center py-2 mt-2">
                    <button type="button" onClick={clearFilterHndlr} className="btn btn-sm btn-ghost-danger">
                      Clear filter
                    </button>
                  </div>
                )}

                <div className="col-auto ms-auto">
                  <button
                    className="btn btn-success float-end d-flex align-items-center"
                    onClick={() => history.push(`/holistic-activity-management/add`, { isCopy: false })}
                  >
                    <i className="ri-add-line me-2" />
                    Add New
                  </button>
                </div>
              </div>

              <TableContainer
                columns={tableColumns || []}
                data={activities || []}
                tableClass="mb-0"
                divClass="table-responsive mb-3"
                theadClass="table-light text-muted align-middle"
                showPagination={true}
                totalPages={totalPages || 0}
                totalRecords={totalElements || 0}
                callbackPaginationHndlr={paginationHndlr}
                currentPageNumber={pageNumber || 0}
              />
            </div>
          </div>
        </div>
      </div>) :
        (
          <div className="card mb-0">
            <div className="card-body p-0">
              <div className="row px-3 g-3 pt-3">
                <div className="col-xs-12 col-md-12 col-lg-4 col-xl-3">
                  <div className="search-box">
                    <TextInput
                      name="searchString"
                      formgroupClassName="mb-3"
                      placeHolder="Search..."
                      value={sportsNameFormik.values.searchString}
                      onChange={onChangeFilterHndlr}
                      floatingLabel
                      labelText="Search"
                    />
                    <i className="ri-search-line search-icon"></i>
                  </div>
                </div>

                <div className="col-xs-12 col-md-12 col-lg-4 col-xl-3">
                  <SelectInput
                    name="academicYearId"
                    value={sportsNameFormik.values.academicYearId}
                    onChange={onChangeFilterHndlr}
                    menuItems={academicYearListResp?.data}
                    valueKey="academicYearId"
                    textKey="academicYearName"
                    formgroupClassName="mb-0"
                    labelText="Academic Year"
                    floatingLabel
                  />
                </div>
                <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                  <SelectInput
                    name="classId"
                    value={sportsNameFormik.values.classId}
                    onChange={onChangeFilterHndlr}
                    menuItems={getClassesByStageResp}
                    valueKey="classId"
                    textKey="className"
                    formgroupClassName="mb-0"
                    labelText="Curriculum Class"
                    floatingLabel
                  />
                </div>
                <div className="col-auto col-xl-1 !tw-mb-4">
                  <button
                    style={{
                      backgroundColor: "#F4F7FA",
                    }}
                    onClick={toggleAdvanceFilter}
                    className="p-2 btn d-flex"
                  >
                    <FilterSvg height={"18px"} width={"18px"} />
                    <span className="ms-2">Filters</span>
                  </button>
                  <span
                    className="badge align-middle rounded-pill ms-1 "
                    style={{
                      marginBottom: "18px",
                      position: "absolute",
                      top: "-9px",
                      left: "78px",
                      background: "#0ab39c",
                    }}
                  >
                    {count}
                  </span>
                </div>
                {showClearFilterState && (
                  <div className="col-auto d-flex align-items-center mt-2">
                    <button type="button" onClick={clearFilterHndlr} className="btn btn-sm btn-ghost-danger">
                      Clear filter
                    </button>
                  </div>
                )}
                <div className="col-auto ms-auto">
                  <button
                    className="btn btn-success float-end d-flex align-items-center"
                    onClick={() => history.push("/holistic-management/add-activity")}
                  >
                    <i className="ri-add-line me-2" />
                    Add New
                  </button>
                </div>
              </div>

              <TableContainer
                columns={tableColumns || []}
                data={activities || []}
                tableClass="mb-0"
                divClass="table-responsive mb-3"
                theadClass="table-light text-muted align-middle"
                showPagination={true}
                totalPages={totalPages || 0}
                totalRecords={totalElements || 0}
                callbackPaginationHndlr={paginationHndlr}
                currentPageNumber={pageNumber || 0}
              />
            </div>
          </div>
        )}

      <OffCanvasContainer
        isOpen={open}
        headerTitle="Advance Filters"
        closeHndlr={toggleAdvanceFilter}
        id="advance-filter-book-issuance"
      >
        <AdvanceFilterModal
          appliedFilter={sportsNameFormik.values}
          applyFilterCallback={advanceFilterCallbckHndlr}
          toggleAdvanceFilter={toggleAdvanceFilter}
          isOpen={open}
        />
      </OffCanvasContainer>

      <ConfirmationModal
        id="del-sports-name-modal"
        isOpen={delSportsNameModalState.showModal}
        confirmMessage="Are you sure you want to delete this activity?"
        cancelHndlr={delSportsNameCloseModal}
        confirmHndlr={delSportNameItemHndlr}
        iconType="reject"
      ></ConfirmationModal>
    </>
  );
};

export default CurriculumGoals;
