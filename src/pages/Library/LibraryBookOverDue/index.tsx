
import { useEffect, useMemo, useRef, useState } from "react";
import { ModalContainerUpdated, OffCanvasContainer, SelectInput, TextInput } from "../../../Components/Common";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import TableContainer from "../../../Components/Common/TableContainer";
import { useHistory } from "react-router-dom";
import { MenuOptions, generateColumns, getUserTypeId, hasStateChanged, ignoredKeys } from "./helper";
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { generateActionPayload } from "../../../utility/reduxutility";
import { exportBooksOverDueAct, getBookIssuanceUserTypeListAct, getLibraryBookIssuanceListAct, setBookIssuanceUserTypeListAct } from "../../../store/library/bookissuance/bookissuanceaction";
import { toast } from "react-toastify";
import { IPaginationState } from "../../../Components/Common/Pagination";
import ModifiedHorizontalTab from "../../../Components/Common/ModifiedHorizontalTab";
import AdvanceFilterModal from "./AdvanceFilter";
import { default as FilterSvg } from "../../../assets/imagesdps/academics/FilterSvg.svg?react";
import { getLibraryDetailsListAct, getLibraryRecordListAct } from "../../../store/library/settings/librarysettingsaction";
import { useModal } from "../../../hooks/modalhook";
import { useFilterState } from "../../../hooks/filterhook";
import { getBranchClassAct, getBranchCurriculumAct, resetBrchClassAct, resetBrchCurriculumAct } from "../../../store/branchsettings/branchacademics/branchacademicsactions";
import { downloadExcelFile, removeLeadingZeros } from "../../../utility/commonutility";
import ExportModal from "../../Directory/StudentManagement/ExportModal";
import { Add01Icon } from "@hugeicons-pro/core-stroke-standard";
import { HugeiconsIcon } from "@hugeicons/react";
import { convertToFullTime, convertToFullTimeWithPeriod, Current_Date } from "../../../utility/dateutility";
import { CustomDatePicker } from "../../DashBoardBranchSummary/CustomDatePicker";
import Button from "../../../Components/Common/Button";

const initialValues = {
  searchString: "",
  academicYearId: "",
  issuanceDate: "",
  curriculumId: "",
  libraryId: "",
  issueStatus: "",
  recordTypeId: "",
  classId: "",
  sectionId: "",
  fromDate: convertToFullTime(Current_Date),
  toDate: convertToFullTimeWithPeriod(Current_Date),
};

const LibraryBookOverDue = () => {
  const history = useHistory()
  const dispatch = useAppDispatch();
  const [overDueFilterState, setOverDueFilterState] = useState(initialValues);
  const [menuId, setMenuId] = useState<string>("STUDENT");
  const [open, setOpen] = useState<boolean>(false);
  const { closeModal: closeExportExcelModal, modalState: exportExcelState, openModal: openExportExcelModal } = useModal();
  const { showClearFilterState, count, advanceFilterChange } = useFilterState()

  const pagination = useRef({
    pageNo: 0,
    pageSize: 10
  })

  const libraryBooksOverDueList = (otherProps?: any) => {
    let payload = {
      branchId,
      ...overDueFilterState,
      userTypeId: menuId,
      ...pagination.current,
      ...otherProps,
    };

     if (payload.fromDate) {
    payload.fromDate = payload.fromDate.slice(0, 10);
  }
  if (payload.toDate) {
    payload.toDate = payload.toDate.slice(0, 10);
  }

    payload.userTypeId = getUserTypeId(payload.userTypeId, getBookIssuanceUserTypeListResp);

    if (payload.userTypeId) {
      dispatch(
        getLibraryBookIssuanceListAct(
          generateActionPayload("get_library_book_issuance", undefined, payload)
        )
      );
    }
  };

  const libraryRecordList = () => {
    let payload = {
      branchId,
      sortBy: "createdAt",
      orderBy: "asc",
      pageNo: 0, pageSize: 20,
    };
    dispatch(getLibraryRecordListAct(generateActionPayload("get_library_record", undefined, payload)));
  };

  const libraryDetailsList = () => {
    let payload = {
      branchId,
      sortBy: "createdAt",
      orderBy: "asc",
      pageNo: 0, pageSize: 20,
    };
    dispatch(getLibraryDetailsListAct(generateActionPayload("get_library_details", undefined, payload)));
  };

  const exportExcelHndler = () => {
    let payload = {
      branchId,
      ...overDueFilterState,
      userTypeId: menuId,
    };
     if (payload.fromDate) {
    payload.fromDate = payload.fromDate.slice(0, 10);
  }
  if (payload.toDate) {
    payload.toDate = payload.toDate.slice(0, 10);
  }
    payload.userTypeId = getUserTypeId(payload.userTypeId, getBookIssuanceUserTypeListResp);
    dispatch(exportBooksOverDueAct(generateActionPayload("export_books_over_due", undefined, payload, {
      responseType: 'blob'
    })));
  };

  const {
    academicYearListResp,
    currentInstIdResp: instituteId,
    currentBranchIdResp: branchId,
    brchCurriculumResp,
    branchClassResp,
    showApiLoader,
    libraryBookIssuanceErrorAct,
    libraryBookIssuanceRequestListResp,
    getBookIssuanceUserTypeListResp,
    getExportBooksOverDueResp,
    libraryDetailsRequestListResp,
  } = useAppSelector(
    ({ libraryBookIssuance, globalData, instAcademics, classroomManagmentInfo, branchAcademics, appData, librarysettings, }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      branchClassResp: branchAcademics.branchClassResp,
      showApiLoader: globalData.showApiLoader,
      libraryBookIssuanceErrorAct: libraryBookIssuance.libraryBookIssuanceErrorAct,
      libraryBookIssuanceRequestListResp: libraryBookIssuance.libraryBookIssuanceRequestListResp,
      getBookIssuanceUserTypeListResp: libraryBookIssuance.getBookIssuanceUserTypeListResp,
      getExportBooksOverDueResp: libraryBookIssuance.getExportBooksOverDueResp,
      libraryDetailsRequestListResp: librarysettings.libraryDetailsRequestListResp,
    }),
    shallowEqual
  );

  const overDueRef = useRef({
    prevGetBookIssuanceUserTypeListResp: getBookIssuanceUserTypeListResp,
    prevGetExportBookOverDueResp: getExportBooksOverDueResp,
    prevLibraryBookIssuanceErrorResp: libraryBookIssuanceErrorAct,
  })
  useEffect(() => {
    const { prevGetExportBookOverDueResp, prevLibraryBookIssuanceErrorResp, prevGetBookIssuanceUserTypeListResp } = overDueRef.current;
    if (getExportBooksOverDueResp && prevGetExportBookOverDueResp !== getExportBooksOverDueResp) {
      toast.success("Book Over Due Book's Data Download Successfully.");
      closeExportExcelModal();
      downloadExcelFile(getExportBooksOverDueResp, 'over_due_report.xlsx')
    }
    else if (libraryBookIssuanceErrorAct && prevLibraryBookIssuanceErrorResp !== libraryBookIssuanceErrorAct) {
      const { details } = libraryBookIssuanceErrorAct;
      toast.error(details)
    }
    else if (getBookIssuanceUserTypeListResp && prevGetBookIssuanceUserTypeListResp !== getBookIssuanceUserTypeListResp) {
      const { academicYearId } = academicYearListResp?.data?.find((year: any) => year.yearStatus.toLowerCase() === "current") || {};
      libraryBooksOverDueList({ ...initialValues, academicYearId, userTypeId: menuId })
    }

    overDueRef.current.prevGetBookIssuanceUserTypeListResp = getBookIssuanceUserTypeListResp;
    overDueRef.current.prevGetExportBookOverDueResp = getExportBooksOverDueResp;
    overDueRef.current.prevLibraryBookIssuanceErrorResp = libraryBookIssuanceErrorAct;

  }, [getBookIssuanceUserTypeListResp, getExportBooksOverDueResp, libraryBookIssuanceErrorAct])

  useEffect(() => {
    if (academicYearListResp && menuId) {
      const { academicYearId } = academicYearListResp?.data?.find((year: any) => year.yearStatus.toLowerCase() === "current") || {};
      pagination.current.pageNo = 0
      setOverDueFilterState((prev: any) => ({ ...initialValues, academicYearId: academicYearId || "" }))
      libraryBooksOverDueList({ ...initialValues, academicYearId, userTypeId: menuId })
    }
  }, [menuId, branchId, instituteId,])

  const getCurriculumApiCall = (otherProps?: any) => {
    const payload1 = { academicYearId: overDueFilterState.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", ...otherProps };
    dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
  }
  const getClassApiCall = (otherProps?: any) => {
    const payload = { branchId: branchId, academicYearId: overDueFilterState?.academicYearId, curriculumId: overDueFilterState?.curriculumId, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100, ...otherProps };
    dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
  }
  useEffect(() => {
    const { data } = academicYearListResp || {};
    if (Array.isArray(data) && data.length > 0) {
      let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId
      setOverDueFilterState((prev: any) => ({ ...prev, academicYearId: yearId }))
      dispatch(getBookIssuanceUserTypeListAct(generateActionPayload("get_book_issuance_user_list")));
      libraryDetailsList()
      libraryRecordList()
      getCurriculumApiCall({ academicYearId: yearId })
    }
  }, [academicYearListResp, branchId, instituteId,]);

  useEffect(() => {
    const payload1 = { branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" };
    dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
  }, [branchId, instituteId,])

  useEffect(() => {
    return () => {
      dispatch(resetBrchCurriculumAct(undefined));
      dispatch(resetBrchClassAct(undefined));
      dispatch(setBookIssuanceUserTypeListAct(undefined))
    }
  }, [])

  function paginationHndlr(paginationInfo: IPaginationState) {
    pagination.current = paginationInfo;
    libraryBooksOverDueList(paginationInfo)
  }

  const filterHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    let processedValue = value;
    if (name === 'searchString') {
      processedValue = removeLeadingZeros(value);
    }
    let stateChanged = hasStateChanged({ ...overDueFilterState, [name]: value, academicYearId: "" });
    pagination.current.pageNo = 0;

    if (name === 'academicYearId') {
      setOverDueFilterState(prev => {
        const newState = { ...prev, [name]: value, curriculumId: "", classId: "", sectionId: "" };
        advanceFilterChange({ keys: { ...newState, count: 0 }, ignoredKeys });
        return newState;
      });
      libraryBooksOverDueList({ [name]: processedValue });
      getCurriculumApiCall({ academicYearId: value });
      dispatch(resetBrchClassAct(undefined));
      stateChanged = hasStateChanged({ ...overDueFilterState, academicYearId: "", classId: null, curriculumId: null });
    }
    else if (name === 'curriculumId') {
      if (!value) {
        dispatch(resetBrchClassAct(undefined));
      }
      else {
        getClassApiCall({ curriculumId: value, academicYearId: overDueFilterState.academicYearId });
        setOverDueFilterState((prev: any) => ({ ...prev, [name]: value }));
      }
    } else {
      setOverDueFilterState(prev => ({ ...prev, [name]: value }));
      libraryBooksOverDueList({ [name]: value });
    }
    advanceFilterChange({
      keys: { ...overDueFilterState, [name]: value, academicYearId: "", count: 0 },
      ignoredKeys
    });
  };


  const toggleAdvanceFilter = () => {
    setOpen(prev => !prev);
  }

  function advanceFilterCallbckHndlr(appliedFilters?: any) {
    pagination.current = { ...pagination.current, pageNo: 0 }
    advanceFilterChange({ keys: { ...overDueFilterState, ...appliedFilters, academicYearId: "" }, ignoredKeys })
    setOverDueFilterState((prevState: any) => ({ ...prevState, ...appliedFilters }));
    libraryBooksOverDueList(appliedFilters)
  }

  const clearFilterHndlr = () => {
    pagination.current = { ...pagination.current, pageNo: 0 };
    const { academicYearId } = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current") || {}
    setOverDueFilterState({ ...initialValues, academicYearId: academicYearId || "" });
    libraryBooksOverDueList({ ...initialValues, academicYearId });
    advanceFilterChange({ keys: { ...initialValues }, ignoredKeys })
  };


  const handleDateChange = ({ startDate, endDate }: any) => {
    if (startDate && endDate) {
      setOverDueFilterState((prev: any) => ({
        ...prev,
        fromDate: startDate,
        toDate: endDate
      }));
      libraryBooksOverDueList({
        ...overDueFilterState,
        fromDate: convertToFullTime(startDate),
        toDate: convertToFullTimeWithPeriod(endDate)
      });
    }
  }

  const { data: academicYearList } = academicYearListResp || {};
  const { content: OverDUeBooks, totalElements, totalPages, pageable } = libraryBookIssuanceRequestListResp || {}

  const columns = useMemo(() => {
    const newColumns = generateColumns();
    return newColumns.filter((item: any) => {
      if (item?.Header === "Curriculum" || item?.Header === "Class" || item?.Header === "Section") {
        if (menuId === "STUDENT") {
          return true
        }
        return false
      }
      return true
    })
  }, [menuId, OverDUeBooks]);

  return (
    <>
      <div className="page-content free_payment_record_wrapper">
        <div className="container-fluid">
          <BreadCrumb title="Library" pageTitle="Library" />
          <div className="tw-bg-white tw-rounded tw-shadow tw-mb-6">
            <div className="tw-border-b tw-px-4 tw-py-3">
              <div className="tw-grid tw-grid-cols-12 tw-items-center">
                <div className="tw-col-span-6">
                  <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                    Over Due Reports
                  </h4>
                </div>
                <div className="tw-col-span-6 tw-flex tw-justify-end">
                  <Button
                    variant="info"
                    type="button"
                    className="tw-flex tw-items-center"
                    onClick={() => openExportExcelModal()}
                    disabled={showApiLoader}
                  >
                    <i className="ri-add-line tw-mr-1" />
                    <span>Export</span>
                  </Button>
                </div>
              </div>
            </div>
            <div className="tw-p-0">
              <div className="tw-ml-3">
                <ModifiedHorizontalTab
                  MenuOptions={MenuOptions}
                  getActiveMenuId={(menuId: any) => {
                    setMenuId(menuId);
                  }}
                  activeTabId={menuId}
                  horizontalClass="tw-pt-2 tw-mb-2 tw-overflow-auto"
                  labelClass="tw-text-nowrap"
                />
              </div>
              <div className="tw-grid tw-grid-cols-12 tw-gap-3 tw-px-3 tw-pt-2 tw-pb-1">
                <div className="tw-col-span-3">
                  <div className="tw-relative search-box">
                    <TextInput
                      name="searchString"
                      formgroupClassName="tw-mb-3"
                      placeHolder="Search..."
                      labelText="Search"
                      value={overDueFilterState.searchString}
                      onChange={filterHandler}
                      floatingLabel
                    />
                    <i className="ri-search-line tw-absolute tw-left-3 tw-top-[33px] tw-text-gray-400"></i>
                  </div>
                </div>
                <div className="tw-col-span-2">
                  <SelectInput
                    name="academicYearId"
                    value={overDueFilterState.academicYearId}
                    onChange={filterHandler}
                    menuItems={academicYearList || []}
                    valueKey="academicYearId"
                    textKey="academicYearName"
                    formgroupClassName="tw-mb-3"
                    labelText="Academic Year"
                    floatingLabel
                  />
                </div>
                <div className="tw-col-span-2">
                  <SelectInput
                    name="libraryId"
                    value={overDueFilterState.libraryId}
                    onChange={filterHandler}
                    menuItems={libraryDetailsRequestListResp?.content || []}
                    valueKey="id"
                    textKey="libraryName"
                    formgroupClassName="tw-mb-3"
                    labelText="Library"
                    floatingLabel
                  />
                </div>
                <div className="tw-col-span-2">
                  <CustomDatePicker
                    name="dateRange"
                    startDate={overDueFilterState.fromDate}
                    endDate={overDueFilterState.toDate}
                    onChange={handleDateChange}
                    placeholder="Select a Date Range"
                    monthsShown={2}
                    formgroupClassName="tw-mb-0"
                    labelText="Date Range"
                    floatingLabel
                  />
                </div>
                <div className="tw-col-span-1 tw-relative">
                  <Button
                    variant="secondary"
                    type="button"
                    className="tw-flex tw-items-center"
                    onClick={toggleAdvanceFilter}
                    disabled={showApiLoader}
                  >
                    <FilterSvg height="18px" width="18px" />
                    <span className="tw-ml-2">Filters</span>
                  </Button>

                  <span className="tw-absolute tw--top-2 tw-left-[78px] tw-bg-[#0ab39c] tw-text-white tw-text-xs tw-rounded-full tw-px-2">
                    {count}
                  </span>
                </div>
                <div className="tw-col-span-2 tw-flex tw-justify-end tw-mb-2">
                  {showClearFilterState && (
                    <Button
                      variant="wrong"
                      type="button"
                      className="tw-px-2 tw-py-1"
                      onClick={clearFilterHndlr}
                    >
                      Clear filter
                    </Button>
                  )}
                </div>
              </div>
              <TableContainer
                columns={columns || []}
                data={OverDUeBooks || []}
                tableClass="tw-mb-0"
                divClass="tw-overflow-x-auto tw-mb-3"
                theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
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
        id="advance-filter-book-overdue"
      >
        <AdvanceFilterModal
          appliedFilter={overDueFilterState}
          applyFilterCallback={advanceFilterCallbckHndlr}
          toggleAdvanceFilter={toggleAdvanceFilter}
          isOpen={open}
          menuId={menuId}
        />
      </OffCanvasContainer>
      <ModalContainerUpdated
        id="book-overdue-export"
        isOpen={exportExcelState.showModal}
        toggle={closeExportExcelModal}
        modalTitle="Export Book Over Due Book's Data"
        modalSize="md"
      >
        <ExportModal
          isOpen={exportExcelState.showModal}
          toggle={closeExportExcelModal}
          instituteId={instituteId}
          branchId={branchId}
          submitHndlr={exportExcelHndler}
          feature="library"
          subFeature={`book_issuances_${menuId.toLowerCase()}`}
          remarksText="Enter remarks to export Over Due Book's data?"
        />
      </ModalContainerUpdated>
    </>
  );
};

export default LibraryBookOverDue;
