
import { useEffect, useMemo, useRef, useState } from "react";
import { ConfirmationModal, ModalContainerUpdated, OffCanvasContainer, SelectInput, TextInput } from "../../../Components/Common";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import TableContainer from "../../../Components/Common/TableContainer";
import { useHistory } from "react-router-dom";
import classnames from "classnames"
import {
  MenuOptions,
  generateColumns,
  getUserTypeId,
  hasStateChanged,
  ignoredKeys,
} from "./helper";
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { generateActionPayload } from "../../../utility/reduxutility";
import { exportBookIssuanceAct, getBookIssuanceUserTypeListAct, getLibraryBookIssuanceListAct, setBookIssuanceUserTypeListAct } from "../../../store/library/bookissuance/bookissuanceaction";
import { toast } from "react-toastify";
import { IPaginationState } from "../../../Components/Common/Pagination";
import ModifiedHorizontalTab from "../../../Components/Common/ModifiedHorizontalTab";
import BookRenewalModel from "./BookRenewalModel";
import AdvanceFilterModal from "./AdvanceFilter";
import { default as FilterSvg } from "../../../assets/imagesdps/academics/FilterSvg.svg?react";
import { getLibraryDetailsListAct, getLibraryRecordListAct } from "../../../store/library/settings/librarysettingsaction";
import { useModal } from "../../../hooks/modalhook";
import { useFilterState } from "../../../hooks/filterhook";
import { getBranchClassAct, getBranchCurriculumAct, getBrchSectionsAct, resetBrchClassAct, resetBrchCurriculumAct } from "../../../store/branchsettings/branchacademics/branchacademicsactions";
import LibraryCarousel from "./LibraryCarousel";
import { downloadExcelFile, removeLeadingZeros } from "../../../utility/commonutility";
import ExportModal from "../../Directory/StudentManagement/ExportModal";
import { Add01Icon, Book02Icon } from "@hugeicons-pro/core-stroke-standard";
import { HugeiconsIcon } from "@hugeicons/react";
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
};

const BookIssuances = () => {
  const history = useHistory()
  const dispatch = useAppDispatch();
  const [bookIssuancesFilterState, setBookIssuancesFilterState] = useState(initialValues);

  const [open, setOpen] = useState<boolean>(false);
  const { closeModal: closeExportExcelModal, modalState: exportExcelState, openModal: openExportExcelModal } = useModal();
  const { closeModal: closeBookRenewalModal, modalState: bookRenewalState, openModal: openBookRenewalModal } = useModal()
  const { showClearFilterState, count, advanceFilterChange } = useFilterState()

  const pagination = useRef({
    pageNo: 0,
    pageSize: 10
  })

  const {
    loggedInUserRole,
    academicYearListResp,
    currentInstIdResp: instituteId,
    currentBranchIdResp: branchId,
    brchCurriculumResp,
    branchClassResp,
    showApiLoader,
    libraryBookIssuanceErrorAct,
    libraryBookIssuanceRequestListResp,
    saveLibraryBookRenewalResp,
    getBookIssuanceUserTypeListResp,
    getExportBookIssuanceResp,
    libraryDetailsRequestListResp,
  } = useAppSelector(
    ({ libraryBookIssuance, globalData, instAcademics, classroomManagmentInfo, branchAcademics, appData, librarysettings, }) => ({
      loggedInUserRole: appData.loggedInUserRole,
      academicYearListResp: instAcademics.academicYearListResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      branchClassResp: branchAcademics.branchClassResp,
      showApiLoader: globalData.showApiLoader,
      libraryBookIssuanceErrorAct: libraryBookIssuance.libraryBookIssuanceErrorAct,
      libraryBookIssuanceRequestListResp: libraryBookIssuance.libraryBookIssuanceRequestListResp,
      saveLibraryBookRenewalResp: libraryBookIssuance.saveLibraryBookRenewalResp,
      getBookIssuanceUserTypeListResp: libraryBookIssuance.getBookIssuanceUserTypeListResp,
      getExportBookIssuanceResp: libraryBookIssuance.getExportBookIssuanceResp,
      libraryDetailsRequestListResp: librarysettings.libraryDetailsRequestListResp,
    }),
    shallowEqual
  );

  const initialActiveId = useMemo(() => {
    if (loggedInUserRole === "HR" || loggedInUserRole === "HR_HEAD") {
      return "EMPLOYEE";
    }
    return "STUDENT";
  }, [loggedInUserRole]);

  const canAddAndEdit = useMemo(() => {
    if (loggedInUserRole === "HR" || loggedInUserRole === "HR_HEAD") {
      return false;
    }
    return true;
  }, [loggedInUserRole]);

  const [menuId, setMenuId] = useState<string>(initialActiveId);

  const libraryBookIssuanceList = (otherProps?: any) => {
    let payload = {
      branchId,
      ...bookIssuancesFilterState,
      userTypeId: menuId,
      ...pagination.current,
      ...otherProps,
    };
    payload.userTypeId = getUserTypeId(payload.userTypeId, getBookIssuanceUserTypeListResp);
    if (payload.userTypeId) {
      dispatch(getLibraryBookIssuanceListAct(generateActionPayload("get_library_book_issuance", undefined, payload)));
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
      ...bookIssuancesFilterState,
      userTypeId: menuId,
    };
    payload.userTypeId = getUserTypeId(payload.userTypeId, getBookIssuanceUserTypeListResp);
    dispatch(exportBookIssuanceAct(generateActionPayload("export_library_book_issuance", undefined, payload, {
      responseType: 'blob'
    })));
  };

  const libraryIssuanceRef = useRef({
    prevSaveLibraryBookRenewalResp: saveLibraryBookRenewalResp,
    prevGetBookIssuanceUserTypeListResp: getBookIssuanceUserTypeListResp,
    prevGetExportBookIssuanceResp: getExportBookIssuanceResp,
    prevLibraryBookIssuanceErrorResp: libraryBookIssuanceErrorAct,
  })
  useEffect(() => {
    const { prevGetExportBookIssuanceResp, prevLibraryBookIssuanceErrorResp, prevSaveLibraryBookRenewalResp, prevGetBookIssuanceUserTypeListResp } = libraryIssuanceRef.current;

    if (saveLibraryBookRenewalResp && prevSaveLibraryBookRenewalResp !== saveLibraryBookRenewalResp) {
      toast.success("Book issued renewed successfully")
      libraryBookIssuanceList("")
      closeBookRenewalModal()
    }
    else if (getExportBookIssuanceResp && prevGetExportBookIssuanceResp !== getExportBookIssuanceResp) {
      toast.success("Book Issuance Data Download Successfully.");
      closeExportExcelModal();
      downloadExcelFile(getExportBookIssuanceResp, 'Book_Issuance_Upload.xlsx')
    }
    else if (libraryBookIssuanceErrorAct && prevLibraryBookIssuanceErrorResp !== libraryBookIssuanceErrorAct) {
      const { details } = libraryBookIssuanceErrorAct;
      toast.error(details)
    }
    else if (getBookIssuanceUserTypeListResp && prevGetBookIssuanceUserTypeListResp !== getBookIssuanceUserTypeListResp) {
      const { academicYearId } = academicYearListResp?.data?.find((year: any) => year.yearStatus.toLowerCase() === "current") || {};
      libraryBookIssuanceList({ ...initialValues, academicYearId, userTypeId: menuId })
    }

    libraryIssuanceRef.current.prevSaveLibraryBookRenewalResp = saveLibraryBookRenewalResp;
    libraryIssuanceRef.current.prevGetBookIssuanceUserTypeListResp = getBookIssuanceUserTypeListResp;
    libraryIssuanceRef.current.prevGetExportBookIssuanceResp = getExportBookIssuanceResp;
    libraryIssuanceRef.current.prevLibraryBookIssuanceErrorResp = libraryBookIssuanceErrorAct;

  }, [saveLibraryBookRenewalResp, getBookIssuanceUserTypeListResp, getExportBookIssuanceResp, libraryBookIssuanceErrorAct,])

  useEffect(() => {
    if (academicYearListResp && menuId) {
      const { academicYearId } = academicYearListResp?.data?.find((year: any) => year.yearStatus.toLowerCase() === "current") || {};
      pagination.current.pageNo = 0
      setBookIssuancesFilterState((prev: any) => ({ ...initialValues, academicYearId: academicYearId || "" }))
      libraryBookIssuanceList({ ...initialValues, academicYearId, userTypeId: menuId })
    }
  }, [menuId, branchId, instituteId,])

  const rowMenuOptions = useMemo(
    () => [
      {
        id: "renew",
        actionIcon: <HugeiconsIcon icon={Book02Icon} className="tw-mr-2 tw-text-gray-400" size={20} />,
        actionName: "Book Renew",
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute("data-id");
          const data = libraryBookIssuanceRequestListResp?.content?.find((item: any) => +item?.id === +id)
          openBookRenewalModal(data)
        },
      },
    ],
    [menuId, libraryBookIssuanceRequestListResp]
  );

  const menuOptions = useMemo(() => {
    if (loggedInUserRole === "HR" || loggedInUserRole === "HR_HEAD") {
      return MenuOptions.filter((m: any) => m.id === "EMPLOYEE");
    }
    return MenuOptions;
  }, [loggedInUserRole]);
  const getCurriculumApiCall = (otherProps?: any) => {
    const payload1 = { academicYearId: bookIssuancesFilterState.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", ...otherProps };
    dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
  }
  const getClassApiCall = (otherProps?: any) => {
    const payload = { branchId: branchId, academicYearId: bookIssuancesFilterState?.academicYearId, curriculumId: bookIssuancesFilterState?.curriculumId, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100, ...otherProps };
    dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
  }
  useEffect(() => {
    const { data } = academicYearListResp || {};
    if (Array.isArray(data) && data.length > 0) {
      let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId
      setBookIssuancesFilterState((prev: any) => ({ ...prev, academicYearId: yearId }))
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
    libraryBookIssuanceList(paginationInfo)
  }

  const filterHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    let processedValue = value;
    if (name === 'searchString') {
      processedValue = removeLeadingZeros(value);
    }
    let stateChanged = hasStateChanged({ ...bookIssuancesFilterState, [name]: value, academicYearId: "" });
    pagination.current.pageNo = 0;

    if (name === 'academicYearId') {
      setBookIssuancesFilterState(prev => {
        const newState = { ...prev, [name]: value, curriculumId: "", classId: "", sectionId: "" };
        advanceFilterChange({ keys: { ...newState, count: 0 }, ignoredKeys });
        return newState;
      });
      libraryBookIssuanceList({ [name]: processedValue });
      getCurriculumApiCall({ academicYearId: value });
      dispatch(resetBrchClassAct(undefined));
      stateChanged = hasStateChanged({ ...bookIssuancesFilterState, academicYearId: "", classId: null, curriculumId: null });
    }
    else if (name === 'curriculumId') {
      if (!value) {
        dispatch(resetBrchClassAct(undefined));
      }
      else {
        getClassApiCall({ curriculumId: value, academicYearId: bookIssuancesFilterState.academicYearId });
        setBookIssuancesFilterState((prev: any) => ({ ...prev, [name]: value }));
      }
    } else {
      setBookIssuancesFilterState(prev => ({ ...prev, [name]: value }));
      libraryBookIssuanceList({ [name]: value });
    }
    advanceFilterChange({
      keys: { ...bookIssuancesFilterState, [name]: value, academicYearId: "", count: 0 },  // Ensure count is reset here as well
      ignoredKeys
    });
  };


  const toggleAdvanceFilter = () => {
    setOpen(prev => !prev);
  }

  function advanceFilterCallbckHndlr(appliedFilters?: any) {
    pagination.current = { ...pagination.current, pageNo: 0 }
    advanceFilterChange({ keys: { ...bookIssuancesFilterState, ...appliedFilters, academicYearId: "" }, ignoredKeys })
    setBookIssuancesFilterState((prevState: any) => ({ ...prevState, ...appliedFilters }));
    libraryBookIssuanceList(appliedFilters)
  }

  const clearFilterHndlr = () => {
    pagination.current = { ...pagination.current, pageNo: 0 };
    const { academicYearId } = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current") || {}
    setBookIssuancesFilterState({ ...initialValues, academicYearId: academicYearId || "" });
    libraryBookIssuanceList({ ...initialValues, academicYearId });
    advanceFilterChange({ keys: { ...initialValues }, ignoredKeys })
  };

  const { data: academicYearList } = academicYearListResp || {};
  const { content: libraryBookIssuance, totalElements, totalPages, pageable } = libraryBookIssuanceRequestListResp || {}

  const columns = useMemo(() => {
    const newColumns = generateColumns(rowMenuOptions);
    return newColumns.filter((item: any) => {
      if (item?.Header === "Curriculum" || item?.Header === "Class" || item?.Header === "Section") {
        if (menuId === "STUDENT") {
          return true;
        }
        return false;
      }
      // Remove actions column for HR roles
      if (item?.accessor === "actions" && (loggedInUserRole === "HR" || loggedInUserRole === "HR_HEAD")) {
        return false;
      }
      return true;
    });
  }, [menuId, libraryBookIssuance, loggedInUserRole, rowMenuOptions]);
  return (
    <>
      <div className="page-content free_payment_record_wrapper">
        <div className="container-fluid">
          <BreadCrumb title="Library" pageTitle="Library" />
          <LibraryCarousel academicYearId={bookIssuancesFilterState.academicYearId} />
          <div className="tw-bg-white tw-rounded tw-shadow tw-mb-6">
            <div className="tw-border-b tw-px-4 tw-py-3">
              <div className="tw-grid tw-grid-cols-12 tw-items-center">
                <div className="tw-col-span-6">
                  <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                    Book Issuances Details List
                  </h4>
                </div>
                <div className="tw-col-span-6 tw-flex tw-justify-end tw-gap-2">
                  {canAddAndEdit && <Button
                    variant="primary"
                    type="button"
                    className="tw-px-2 tw-py-1"
                    onClick={() => {
                      history.push(
                        "/library-book-issuance/book-issuance-details",
                        { userType: menuId }
                      );
                    }}
                    disabled={showApiLoader}
                  >
                    <HugeiconsIcon
                      icon={Add01Icon}
                      className="tw-mr-2 !tw-text-white"
                      size={16}
                    />
                    Issue New Book
                  </Button>}
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
                  getActiveMenuId={(menuId: any) => setMenuId(menuId)}
                  activeTabId={menuId}
                  horizontalClass="tw-pt-2 tw-mb-2 tw-overflow-auto"
                  labelClass="tw-whitespace-nowrap"
                />
              </div>
              <div className="tw-grid tw-grid-cols-12 tw-gap-3 tw-px-4 tw-pt-2 tw-pb-1">
                <div className="tw-col-span-12 lg:tw-col-span-3">
                  <div className="tw-relative search-box">
                    <TextInput
                      name="searchString"
                      formgroupClassName="tw-mb-0"
                      placeHolder="Search..."
                      value={bookIssuancesFilterState.searchString}
                      onChange={filterHandler}
                      floatingLabel
                      labelText="Search"
                    />
                    <i className="ri-search-line tw-absolute tw-left-3 tw-top-[33px] tw-text-gray-400"></i>
                  </div>
                </div>
                <div className="tw-col-span-12 lg:tw-col-span-2">
                  <SelectInput
                    name="academicYearId"
                    value={bookIssuancesFilterState.academicYearId}
                    onChange={filterHandler}
                    menuItems={academicYearList || []}
                    valueKey="academicYearId"
                    textKey="academicYearName"
                    formgroupClassName="tw-mb-3"
                    labelText="Academic Year"
                    floatingLabel
                  />
                </div>
                <div className="tw-col-span-12 lg:tw-col-span-2">
                  <SelectInput
                    name="libraryId"
                    value={bookIssuancesFilterState.libraryId}
                    onChange={filterHandler}
                    menuItems={libraryDetailsRequestListResp?.content || []}
                    valueKey="id"
                    textKey="libraryName"
                    formgroupClassName="tw-mb-3"
                    labelText="Library"
                    floatingLabel
                  />
                </div>
                <div className="tw-col-span-2 tw-flex tw-justify-end tw-mb-3">
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
                <div className="tw-col-span-12 lg:tw-col-span-1 tw-relative">
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
                  {count && (
                    <span className="tw-absolute tw--top-3 tw-left-[4.8rem] tw-bg-[#0ab39c] tw-text-white tw-text-xs tw-rounded-full tw-w-5 tw-h-5 tw-flex tw-items-center tw-justify-center">
                      {count}
                    </span>
                  )}
                </div>
              </div>
              <TableContainer
                columns={columns || []}
                data={libraryBookIssuance || []}
                tableClass="tw-mb-0"
                divClass="table-responsive tw-mb-3"
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
        id="advance-filter-book-issuance"
      >
        <AdvanceFilterModal
          appliedFilter={bookIssuancesFilterState}
          applyFilterCallback={advanceFilterCallbckHndlr}
          toggleAdvanceFilter={toggleAdvanceFilter}
          isOpen={open}
          menuId={menuId}
        />
      </OffCanvasContainer>
      <ModalContainerUpdated
        id="renew-book-model"
        isOpen={bookRenewalState.showModal}
        toggle={closeBookRenewalModal}
        modalTitle="Renew Book"
        modalSize="md"
      >
        <BookRenewalModel
          isOpen={bookRenewalState.showModal}
          toggle={closeBookRenewalModal}
          modalData={bookRenewalState.modalData}
          menuId={menuId}
        />
      </ModalContainerUpdated>


      <ModalContainerUpdated
        id="book-issuance-export"
        isOpen={exportExcelState.showModal}
        toggle={closeExportExcelModal}
        modalTitle="Export Book Issuance Data"
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
          remarksText="Enter remarks to export book issuance data?"
        />
      </ModalContainerUpdated>
    </>
  );
};

export default BookIssuances;
