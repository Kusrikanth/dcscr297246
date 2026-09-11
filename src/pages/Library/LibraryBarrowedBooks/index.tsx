
import { useEffect, useMemo, useRef, useState } from "react";
import { ModalContainerUpdated, OffCanvasContainer, SelectInput, TextInput } from "../../../Components/Common";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import TableContainer from "../../../Components/Common/TableContainer";
import { useHistory, useLocation } from "react-router-dom";
import { MenuOptions, generateColumns, getIgnoredKeys, getUserTypeId, hasStateChanged } from "./helper";
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { generateActionPayload } from "../../../utility/reduxutility";
import { exportLibraryBorrowedBooksAct, getBookIssuanceUserTypeListAct, getLibraryBorrowedBooksListAct, getLibraryBookIssuanceListAct, setBookIssuanceUserTypeListAct } from "../../../store/library/bookissuance/bookissuanceaction";
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
import { getSectionList } from "../../../store/academic/classroomManagment/classroommanagmentactions";

const LibraryBorrowedBooks = () => {
  const location = useLocation();
  const isBorrowedBooks = location.pathname.includes("/borrowed-library-books");
  const ignoredKeys = getIgnoredKeys(isBorrowedBooks);
  const initialValues = useMemo(() => ({
    searchString: "",
    academicYearId: "",
    issuanceDate: "",
    curriculumId: "",
    libraryId: "",
    issueStatus: "",
    recordTypeId: "",
    classId: "",
    sectionId: "",
    fromDate: isBorrowedBooks ? "" : convertToFullTime(Current_Date),
    toDate: isBorrowedBooks ? "" : convertToFullTimeWithPeriod(Current_Date),
  }), [isBorrowedBooks]);

  const history = useHistory()
  const dispatch = useAppDispatch();
  const [borrowedBooksFilterState, setBorrowedBooksFilterState] = useState(initialValues);
  const [menuId, setMenuId] = useState<string>("STUDENT");
  const [open, setOpen] = useState<boolean>(false);
  const { closeModal: closeExportExcelModal, modalState: exportExcelState, openModal: openExportExcelModal } = useModal();
  const { showClearFilterState, count, advanceFilterChange } = useFilterState()

  const pagination = useRef({
    pageNo: 0,
    pageSize: 10
  })

  const libraryBorrowedBooksHighestList = (otherProps?: any) => {
    let payload = {
      branchId,
      ...borrowedBooksFilterState,
      userTypeId: menuId,
      ...pagination.current,
      ...otherProps,
    };

    if (!isBorrowedBooks) {
      if (payload.fromDate) {
        payload.fromDate = payload.fromDate.slice(0, 10);
      }
      if (payload.toDate) {
        payload.toDate = payload.toDate.slice(0, 10);
      }
    }

    payload.userTypeId = getUserTypeId(payload.userTypeId, getBookIssuanceUserTypeListResp);

    if (payload.userTypeId) {
      dispatch(
        getLibraryBorrowedBooksListAct(
          generateActionPayload("get_library_borrowed_books_list", undefined, payload)
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
      ...borrowedBooksFilterState,
      userTypeId: menuId,
    };
    if (payload.fromDate) {
      payload.fromDate = payload.fromDate.slice(0, 10);
    }
    if (payload.toDate) {
      payload.toDate = payload.toDate.slice(0, 10);
    }
    payload.userTypeId = getUserTypeId(payload.userTypeId, getBookIssuanceUserTypeListResp);
    dispatch(exportLibraryBorrowedBooksAct(generateActionPayload("export_library_borrowed_books", undefined, payload, {
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
    getLibraryBorrowedBooksListResp,
    getBookIssuanceUserTypeListResp,
    exportLibraryBorrowedBooksResp,
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
      getLibraryBorrowedBooksListResp: libraryBookIssuance.getLibraryBorrowedBooksListResp,
      getBookIssuanceUserTypeListResp: libraryBookIssuance.getBookIssuanceUserTypeListResp,
      exportLibraryBorrowedBooksResp: libraryBookIssuance.exportLibraryBorrowedBooksResp,
      libraryDetailsRequestListResp: librarysettings.libraryDetailsRequestListResp,
    }),
    shallowEqual
  );

  const borrowedBooksRef = useRef({
    prevGetBookIssuanceUserTypeListResp: getBookIssuanceUserTypeListResp,
    prevGetExportBookBorrowedBooksResp: exportLibraryBorrowedBooksResp,
    prevLibraryBookIssuanceErrorResp: libraryBookIssuanceErrorAct,
  })
  useEffect(() => {
    const { prevGetExportBookBorrowedBooksResp, prevLibraryBookIssuanceErrorResp, prevGetBookIssuanceUserTypeListResp } = borrowedBooksRef.current;
    if (exportLibraryBorrowedBooksResp && prevGetExportBookBorrowedBooksResp !== exportLibraryBorrowedBooksResp) {
      toast.success("Book Over Due Book's Data Download Successfully.");
      closeExportExcelModal();
      downloadExcelFile(exportLibraryBorrowedBooksResp, 'highest_borrowed_books.xlsx')
    }
    else if (libraryBookIssuanceErrorAct && prevLibraryBookIssuanceErrorResp !== libraryBookIssuanceErrorAct) {
      const { details } = libraryBookIssuanceErrorAct;
      toast.error(details)
    }
    else if (getBookIssuanceUserTypeListResp && prevGetBookIssuanceUserTypeListResp !== getBookIssuanceUserTypeListResp) {
      const { academicYearId } = academicYearListResp?.data?.find((year: any) => year.yearStatus.toLowerCase() === "current") || {};
      libraryBorrowedBooksHighestList({ ...initialValues, academicYearId, userTypeId: menuId })
    }

    borrowedBooksRef.current.prevGetBookIssuanceUserTypeListResp = getBookIssuanceUserTypeListResp;
    borrowedBooksRef.current.prevGetExportBookBorrowedBooksResp = exportLibraryBorrowedBooksResp;
    borrowedBooksRef.current.prevLibraryBookIssuanceErrorResp = libraryBookIssuanceErrorAct;

  }, [getBookIssuanceUserTypeListResp, exportLibraryBorrowedBooksResp, libraryBookIssuanceErrorAct])

  useEffect(() => {
    if (academicYearListResp && menuId) {
      const { academicYearId } = academicYearListResp?.data?.find((year: any) => year.yearStatus.toLowerCase() === "current") || {};
      pagination.current.pageNo = 0
      setBorrowedBooksFilterState((prev: any) => ({ ...initialValues, academicYearId: academicYearId || "" }))
      libraryBorrowedBooksHighestList({ ...initialValues, academicYearId, userTypeId: menuId })
    }
  }, [menuId, branchId, instituteId,])

  const getCurriculumApiCall = (otherProps?: any) => {
    const payload1 = { academicYearId: borrowedBooksFilterState.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", ...otherProps };
    dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
  }
  const getClassApiCall = (otherProps?: any) => {
    const payload = { branchId: branchId, academicYearId: borrowedBooksFilterState?.academicYearId, curriculumId: borrowedBooksFilterState?.curriculumId, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100, ...otherProps };
    dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
  }

  const getSectionListResp = (otherProps?: any) => {
    let payload = {
      branchClassId: otherProps?.branchClassId || borrowedBooksFilterState.classId || null,
      masterAcademicYearId: borrowedBooksFilterState.academicYearId,
      curriculumId: borrowedBooksFilterState.curriculumId,
      pageNo: 0,
      pageSize: 20,
      sortBy: "sectionName",
      orderBy: "asc",
    };

    if (payload.branchClassId && payload.masterAcademicYearId) {
      dispatch(
        getSectionList(
          generateActionPayload("get_section_list", undefined, payload)
        )
      );
    }
  };

  useEffect(() => {
    if (borrowedBooksFilterState.classId && borrowedBooksFilterState.academicYearId) {
      getSectionListResp();
    }
  }, [borrowedBooksFilterState.classId]);
  
  useEffect(() => {
    const { data } = academicYearListResp || {};
    if (Array.isArray(data) && data.length > 0) {
      let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId
      setBorrowedBooksFilterState((prev: any) => ({ ...prev, academicYearId: yearId }))
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
  useEffect(() => {
    if (isBorrowedBooks) {
      const { data } = brchCurriculumResp || {};
      if (Array.isArray(data) && data.length > 0 && borrowedBooksFilterState.academicYearId) {
        const payload = { branchId, curriculumId: data[0].branchCurriculumId, academicYearId: borrowedBooksFilterState.academicYearId, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100, };
        dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
        setBorrowedBooksFilterState((prev: any) => ({ ...prev, curriculumId: data[0].branchCurriculumId }));
      }

    }
  }, [brchCurriculumResp])

  useEffect(() => {
    const { content } = branchClassResp || {};
    if (isBorrowedBooks && content?.length > 0) {
      const classId = content[0].id;

      setBorrowedBooksFilterState(prev => ({ ...prev, classId }));

      libraryBorrowedBooksHighestList({
        ...borrowedBooksFilterState,
        classId
      });
    }
  }, [branchClassResp])

  function paginationHndlr(paginationInfo: IPaginationState) {
    pagination.current = paginationInfo;
    libraryBorrowedBooksHighestList(paginationInfo)
  }

  const filterHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    let processedValue = value;
    if (name === 'searchString') {
      processedValue = removeLeadingZeros(value);
    }
    let stateChanged = hasStateChanged({ ...borrowedBooksFilterState, [name]: value, academicYearId: "" }, ignoredKeys);
    pagination.current.pageNo = 0;

    if (name === 'academicYearId') {
      setBorrowedBooksFilterState(prev => {
        const newState = { ...prev, [name]: value, curriculumId: "", classId: "", sectionId: "" };
        advanceFilterChange({ keys: { ...newState, count: 0 }, ignoredKeys });
        return newState;
      });
      libraryBorrowedBooksHighestList({ [name]: processedValue });
      getCurriculumApiCall({ academicYearId: value });
      dispatch(resetBrchClassAct(undefined));
      stateChanged = hasStateChanged({ ...borrowedBooksFilterState, academicYearId: "", classId: null, curriculumId: null }, ignoredKeys);
    }
    else if (name === 'curriculumId') {
      if (!value) {
        dispatch(resetBrchClassAct(undefined));
      }
      else {
        getClassApiCall({ curriculumId: value, academicYearId: borrowedBooksFilterState.academicYearId });
        setBorrowedBooksFilterState((prev: any) => ({ ...prev, [name]: value }));
      }
    } else if (name === 'classId') {
      setBorrowedBooksFilterState(prev => ({
        ...prev,
        [name]: value,
        sectionId: ""
      }));
      getSectionListResp({ branchClassId: value });
      libraryBorrowedBooksHighestList({ [name]: value });
    } else {
      setBorrowedBooksFilterState(prev => ({ ...prev, [name]: value }));
      libraryBorrowedBooksHighestList({ [name]: value });
    }
    advanceFilterChange({
      keys: { ...borrowedBooksFilterState, [name]: value, academicYearId: "" },
      ignoredKeys
    });
  };

  const toggleAdvanceFilter = () => {
    setOpen(prev => !prev);
  }

  function advanceFilterCallbckHndlr(appliedFilters?: any) {
    pagination.current = { ...pagination.current, pageNo: 0 }
    const updatedState = {
      ...borrowedBooksFilterState,
      ...appliedFilters
    };
    advanceFilterChange({ keys: { ...borrowedBooksFilterState, ...appliedFilters, academicYearId: "" }, ignoredKeys })
    setBorrowedBooksFilterState((prevState: any) => ({ ...prevState, ...appliedFilters }));
    libraryBorrowedBooksHighestList(updatedState);
  }

  const clearFilterHndlr = () => {
    pagination.current = { ...pagination.current, pageNo: 0 };
    const { academicYearId } = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current") || {}
    setBorrowedBooksFilterState({ ...initialValues, academicYearId: academicYearId || "" });
    libraryBorrowedBooksHighestList({ ...initialValues, academicYearId });
    advanceFilterChange({ keys: { ...initialValues }, ignoredKeys })
  };

  const { data: academicYearList } = academicYearListResp || {};
  const { content: borrowedBooks, totalElements, totalPages, pageable } = getLibraryBorrowedBooksListResp || {}

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
  }, [menuId, borrowedBooks]);

  const { data: curriculumTypes } = brchCurriculumResp || {};
  const { content: classTypes } = branchClassResp || {};
  return (
    <>
      <div className="page-content free_payment_record_wrapper">
        <div className="container-fluid">
          <BreadCrumb title="Library" pageTitle="Library" />
          <div className="tw-bg-white tw-rounded tw-shadow tw-mb-6">
            <div className="tw-border-b tw-px-4 tw-py-3">
              <div className="tw-grid tw-grid-cols-12 tw-items-center">
                <div className="tw-col-span-6">
                  <h4 className="tw-text-base tw-font-semibold tw-mb-0">{isBorrowedBooks ? "Borrowed Library Books" : "Over Due Reports"}</h4>
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
                <div className="tw-col-span-12 md:tw-col-span-4 xl:tw-col-span-2">
                  <div className="search-box">
                    <TextInput
                      name="searchString"
                      formgroupClassName="tw-mb-3"
                      placeHolder="Search..."
                      labelText="Search"
                      value={borrowedBooksFilterState.searchString}
                      onChange={filterHandler}
                      floatingLabel
                    />
                    <i className="ri-search-line search-icon"></i>
                  </div>
                </div>
                <div className="tw-col-span-12 md:tw-col-span-4 xl:tw-col-span-2">
                  <SelectInput
                    name="academicYearId"
                    value={borrowedBooksFilterState.academicYearId}
                    onChange={filterHandler}
                    menuItems={academicYearList || []}
                    valueKey="academicYearId"
                    textKey="academicYearName"
                    formgroupClassName="tw-mb-3"
                    labelText="Academic Year"
                    floatingLabel
                  />
                </div>
                {menuId === "STUDENT" && (
                  <> <div className='tw-col-span-12 md:tw-col-span-4 xl:tw-col-span-2'>
                    <SelectInput
                      name="curriculumId"
                      value={borrowedBooksFilterState.curriculumId}
                      onChange={filterHandler}
                      menuItems={curriculumTypes}
                      valueKey="branchCurriculumId"
                      textKey="curriculumName"
                      formgroupClassName="tw-mb-0"
                      defaultSelect="Select"
                      labelText="Curriculum"
                      floatingLabel
                    />
                  </div>
                    <div className='tw-col-span-12 md:tw-col-span-4 xl:tw-col-span-2'>
                      <SelectInput
                        name="classId"
                        value={borrowedBooksFilterState.classId}
                        onChange={filterHandler}
                        menuItems={classTypes}
                        valueKey="id"
                        textKey="shortName"
                        formgroupClassName="tw-mb-0"
                        defaultSelect="Select"
                        labelText="Class"
                        floatingLabel
                      />
                    </div></>
                )}
                <div className="tw-col-span-12 md:tw-col-span-4 xl:tw-col-span-2">
                  <SelectInput
                    name="libraryId"
                    value={borrowedBooksFilterState.libraryId}
                    onChange={filterHandler}
                    menuItems={libraryDetailsRequestListResp?.content || []}
                    valueKey="id"
                    textKey="libraryName"
                    formgroupClassName="tw-mb-3"
                    labelText="Library"
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
                <div className="tw-col-span-1 tw-flex tw-justify-end tw-mb-2">
                  {showClearFilterState && (
                    <Button
                      variant="wrong"
                      type="button"
                      className="!tw-px-2 !tw-py-1"
                      onClick={clearFilterHndlr}
                    >
                      Clear filter
                    </Button>
                  )}
                </div>
              </div>
              <TableContainer
                columns={columns || []}
                data={borrowedBooks || []}
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
        id="advance-highest-borrowed-books"
      >
        <AdvanceFilterModal
          appliedFilter={borrowedBooksFilterState}
          applyFilterCallback={advanceFilterCallbckHndlr}
          toggleAdvanceFilter={toggleAdvanceFilter}
          isOpen={open}
          menuId={menuId}
          isBorrowedBooks={isBorrowedBooks}
        />
      </OffCanvasContainer>
      <ModalContainerUpdated
        id="book-overdue-export"
        isOpen={exportExcelState.showModal}
        toggle={closeExportExcelModal}
        modalTitle="Export Highest Book Count Data"
        modalSize="md"
      >
        <ExportModal
          isOpen={exportExcelState.showModal}
          toggle={closeExportExcelModal}
          instituteId={instituteId}
          branchId={branchId}
          submitHndlr={exportExcelHndler}
          feature="library"
          subFeature="library_borrowed_books_export"
          remarksText="Enter remarks to export Highest Book Count Data?"
        />
      </ModalContainerUpdated>
    </>
  );
};

export default LibraryBorrowedBooks;
