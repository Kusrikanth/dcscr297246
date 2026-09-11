
import { useEffect, useMemo, useRef, useState } from "react";
import { ConfirmationModal, DateInput, ModalContainerUpdated, OffCanvasContainer, SelectInput, TextInput } from "../../../Components/Common";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import TableContainer from "../../../Components/Common/TableContainer";
import { useHistory } from "react-router-dom";
import classnames from "classnames"
import {
  MenuOptions,
  generateColumns,
  getUserTypeId,
  ignoredKeys,
} from "./helper";
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { generateActionPayload } from "../../../utility/reduxutility";
import { toast } from "react-toastify";
import { IPaginationState } from "../../../Components/Common/Pagination";
import { exportBookReturnAct, getLibraryBookReturnListAct } from "../../../store/library/bookreturn/bookreturnaction";
import ModifiedHorizontalTab from "../../../Components/Common/ModifiedHorizontalTab";
import { getSectionList } from "../../../store/academic/classroomManagment/classroommanagmentactions";
import { resetBrchClassAct, resetBrchCurriculumAct } from "../../../store/branchsettings/branchacademics/branchacademicsslice";
import { getBranchClassAct, getBranchCurriculumAct } from "../../../store/branchsettings/branchacademics/branchacademicsactions";
import { setBookIssuanceUserTypeListAct } from "../../../store/library/bookissuance/bookissuanceslice";
import { useFilterState } from "../../../hooks/filterhook";
import { removeLeadingZeros } from "../../../utility/commonutility";
import AdvanceFilterModal from "./AdvanceFilter";
import { default as FilterSvg } from "../../../assets/imagesdps/academics/FilterSvg.svg?react";
import { getLibraryDetailsListAct } from "../../../store/library/settings/librarysettingsaction";
import ExportModal from "../../Directory/StudentManagement/ExportModal";
import { downloadExcelFile } from "../../../utility/commonutility";
import { hasStateChanged } from "../BookIssuances/helper";
import Button from "../../../Components/Common/Button";

const initialValues = {
  searchString: "",
  academicYearId: "",
  returnDate: "",
  curriculumId: "",
  classId: "",
  sectionId: "",
  userType: '',
  libraryId: "",
};

const BookReturns = () => {
  const history = useHistory()
  const dispatch = useAppDispatch();
  const { showClearFilterState, count , advanceFilterChange } = useFilterState()
  const [bookReturnsFilterState, setBookReturnsFilterState] = useState(initialValues);
  const [open, setOpen] = useState<boolean>(false);
  const [menuId, setMenuId] = useState("student");
  const [deleteBookReturnsState, setDeleteBookReturnsState] = useState({
    showModal: false,
    id: ""
  })

  const [exportExcel, setExportExcel] = useState({
    showModal: false,
  })

  const pagination: any = useRef({
    pageNo: 0,
    pageSize: 10
  })
 

const toggleExportExcelModal = () => {
    setExportExcel((prevState: any) => ({
      ...prevState,
      showModal: !prevState.showModal,
    }));
  };

  const libraryDetailsList = (otherProps?: any) => {
    let payload = {
      branchId,
      sortBy: "createdAt",
      orderBy: "asc",
      pageNo: 0, pageSize: 20,
      ...otherProps,
    };
    dispatch(getLibraryDetailsListAct(generateActionPayload("get_library_details", undefined, payload)));
  };

  const libraryBookReturnsList = ( otherProps: any) => {
    let payload = {
      branchId,
      userTypeId: menuId,
      ...bookReturnsFilterState,
      ...pagination.current,
      ...otherProps,
    };
    payload.userTypeId = getUserTypeId(payload.userTypeId)
    dispatch(getLibraryBookReturnListAct(generateActionPayload("get_library_book_return_list", undefined, payload)))
  };

  const {
    academicYearListResp,
    currentInstIdResp: instituteId,
    currentBranchIdResp: branchId,
    showApiLoader,
    getExportBookReturnResp,
    libraryDetailsRequestListResp,
    bookReturnErrorResp,
    bookReturnListResp,
  } = useAppSelector(
    ({ libraryBookIssuance, globalData, instAcademics, appData, libraryBookReturn, librarysettings }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      showApiLoader: globalData.showApiLoader,
      getExportBookReturnResp: libraryBookReturn.getExportBookReturnResp,
      libraryDetailsRequestListResp: librarysettings.libraryDetailsRequestListResp,
      bookReturnErrorResp: libraryBookReturn.bookReturnErrorResp,
      bookReturnListResp: libraryBookReturn.bookReturnListResp,
    }),
    shallowEqual
  );

  const libraryBookReturnsRef = useRef({
    prevBookReturnErrorResp: bookReturnErrorResp,
    prevGetExportBookReturnResp: getExportBookReturnResp,
       
  })
  useEffect(() => {
    const { prevGetExportBookReturnResp, prevBookReturnErrorResp } = libraryBookReturnsRef.current;
    
     if (getExportBookReturnResp && prevGetExportBookReturnResp !== getExportBookReturnResp) {
      toast.success("Book Retund Data Download Successfully.");
      toggleExportExcelModal();
      downloadExcelFile(getExportBookReturnResp, "book_return")
    } else if (bookReturnErrorResp && prevBookReturnErrorResp !== bookReturnErrorResp) {
      const { details } = bookReturnErrorResp;
      toast.error(details || "Something went wrong!");
    }
    libraryBookReturnsRef.current.prevGetExportBookReturnResp = getExportBookReturnResp;
    libraryBookReturnsRef.current.prevBookReturnErrorResp = bookReturnErrorResp;
    
  }, [ getExportBookReturnResp, bookReturnErrorResp,])

  const menuOptions = useMemo(
    () => [
      {
        id: "delete",
        actionIcon: <i className={classnames("ri-delete-bin-5-fill text-danger fs-16 me-2")}></i>,
        actionName: "Delete",
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute("data-id");
          toggleDeleteIssuanceModal(id)
        },
      }
    ],
    [menuId]
  );

  useEffect(() => {
    const { data } = academicYearListResp || {};
    if (Array.isArray(data) && data.length > 0) {
      let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId
      setBookReturnsFilterState((prev: any) => ({ ...prev, academicYearId: yearId }))
    }
  }, [academicYearListResp]);

  useEffect(() => {
    libraryDetailsList();
  }, [branchId,instituteId,]);

  useEffect(() => {
    if (academicYearListResp && menuId) {
      const { academicYearId } = academicYearListResp?.data?.find((year: any) => year.yearStatus.toLowerCase() === "current") || {};
      pagination.current.pageNo = 0
      setBookReturnsFilterState((prev: any) => ({ ...initialValues, academicYearId : academicYearId || "" }))
      libraryBookReturnsList({ ...initialValues, academicYearId, userTypeId: menuId })
      getCurriculumApiCall({ academicYearId: academicYearId })
    }
  }, [menuId,branchId,instituteId,])

  useEffect(() => {
    return () => {
      dispatch(resetBrchCurriculumAct(undefined));
      dispatch(resetBrchClassAct(undefined));
      dispatch(setBookIssuanceUserTypeListAct(undefined))
    }
  }, [])

  function paginationHndlr(paginationInfo: IPaginationState) {
    pagination.current = paginationInfo;
    libraryBookReturnsList(paginationInfo)
  }

  const toggleAdvanceFilter = () => {
    setOpen(prev => !prev);
  }

  function advanceFilterCallbckHndlr(appliedFilters?: any) {
    pagination.current = { ...pagination.current, pageNo: 0 }
    advanceFilterChange({ keys : { ...bookReturnsFilterState, ...appliedFilters , academicYearId: "" } , ignoredKeys })
    setBookReturnsFilterState((prevState: any) => ({ ...prevState, ...appliedFilters }));
    libraryBookReturnsList(appliedFilters)    
  }
  const getCurriculumApiCall = (otherProps?: any) => {
    const payload1 = { academicYearId: bookReturnsFilterState.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", ...otherProps };
    dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
  }
  const getClassApiCall = (otherProps?: any) => {
    const payload = { branchId: branchId, academicYearId: bookReturnsFilterState?.academicYearId, curriculumId: bookReturnsFilterState?.curriculumId, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100, ...otherProps };
    dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
  }
  const filterHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    let processedValue = value;
    if (name === 'searchString') {
      processedValue = removeLeadingZeros(value);
    }
    let stateChanged = hasStateChanged({ ...bookReturnsFilterState, [name]: value, academicYearId: "" });
    pagination.current.pageNo = 0;
    if (name === 'academicYearId') {
      setBookReturnsFilterState(prev => {
        const newState = { ...prev, [name]: value, curriculumId: "", classId: "", sectionId: "" };
        advanceFilterChange({ keys: { ...newState, count: 0 }, ignoredKeys });
        return newState;
      });
      libraryBookReturnsList({ [name]: processedValue });
      getCurriculumApiCall({ academicYearId: value });
      dispatch(resetBrchClassAct(undefined));
      stateChanged = hasStateChanged({ ...bookReturnsFilterState, academicYearId: "", classId: null, curriculumId: null });
    }
    else if (name === 'curriculumId') {
      if (!value) {
        dispatch(resetBrchClassAct(undefined));
      }
      else {
        getClassApiCall({ curriculumId: value, academicYearId: bookReturnsFilterState.academicYearId });
        setBookReturnsFilterState((prev: any) => ({ ...prev, [name]: value }));
      }
    }
    else {
      setBookReturnsFilterState(prev => ({ ...prev, [name]: value }));
      libraryBookReturnsList({ [name]: value });
    }
    advanceFilterChange({
      keys: { ...bookReturnsFilterState, [name]: value, academicYearId: "", count: 0 },  // Ensure count is reset here as well
      ignoredKeys
    });
  };


  const clearFilterHndlr = () => {
    pagination.current = { ...pagination.current, pageNo: 0 };
    const { academicYearId } = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current") || {}
    setBookReturnsFilterState({ ...initialValues , academicYearId : academicYearId || "" });
    libraryBookReturnsList({ ...initialValues , academicYearId });
    advanceFilterChange({ keys : { ...initialValues}, ignoredKeys  })
  };

  const toggleDeleteIssuanceModal = (id?: any) => {
    setDeleteBookReturnsState((prevState: any) => ({
      ...prevState,
      showModal: !prevState.showModal,
      id: id || "",
    }));
  }

  function delModalSubmitHndlr() {
    const { id } = deleteBookReturnsState;
    // dispatch(deleteLibraryBookIssuanceAct(generateActionPayload("delete_library_book_issuance", { id: id })));
  }

  const exportExcelHndler = () => {
    const payload = {
      ...bookReturnsFilterState,
      branchId,
      instituteId,
      userTypeId: getUserTypeId(menuId),
    };
  
    dispatch(exportBookReturnAct(generateActionPayload("export_library_return_collection", undefined, payload, {
      responseType: 'blob'
    })));
  };

  const { data: academicYearList } = academicYearListResp || {};
  const { content: libraryBookReturns, totalElements, totalPages, pageable } = bookReturnListResp || {}
  const columns = useMemo(() => {
    const newColumns = generateColumns(menuOptions);
    return newColumns.filter((item: any) => {
      if (item?.Header === "Class" || item?.Header === "Section") {
        if (menuId === "student") {
          return true
        }
        return false
      }
      return true
    })
  }, [menuId, bookReturnListResp]);
  
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
                    Book Returns Details List
                  </h4>
                </div>
                <div className="tw-col-span-6 tw-flex tw-justify-end tw-gap-2">
                  <Button
                    variant="primary"
                    type="submit"
                    className="tw-px-2 tw-py-1"
                    onClick={() => {
                      history.push("/library-book-return/book-return-details");
                    }}
                    disabled={showApiLoader}
                  >
                    <i className="ri-add-line" />
                    Return Book
                  </Button>
                  <Button
                    variant="info"
                    type="button"
                    className="tw-flex tw-items-center"
                    onClick={() => toggleExportExcelModal()}
                    disabled={showApiLoader}
                  >
                    <i className="ri-add-line tw-mr-1" />
                    <span>Export</span>
                  </Button>
                </div>
              </div>
            </div>
            <div className="tw-pb-2">
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
              <div className="tw-grid tw-grid-cols-12 tw-gap-3 tw-px-4 tw-pt-2">
                <div className="tw-col-span-3">
                  <div className="tw-relative search-box">
                    <TextInput
                      name="searchString"
                      formgroupClassName="tw-mb-1"
                      placeHolder="Search..."
                      value={bookReturnsFilterState.searchString}
                      onChange={filterHandler}
                      floatingLabel
                      labelText="Search"
                    />
                    <i className="ri-search-line tw-absolute tw-left-3 tw-top-[33px] tw-text-gray-400"></i>
                  </div>
                </div>
                <div className="tw-col-span-2">
                  <SelectInput
                    name="academicYearId"
                    value={bookReturnsFilterState.academicYearId}
                    onChange={filterHandler}
                    menuItems={academicYearList || []}
                    valueKey="academicYearId"
                    textKey="academicYearName"
                    formgroupClassName="tw-mb-1"
                    labelText="Academic Year"
                    floatingLabel
                  />
                </div>
                <div className="tw-col-span-2">
                  <SelectInput
                    name="libraryId"
                    value={bookReturnsFilterState.libraryId}
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
                  <DateInput
                    name="returnDate"
                    value={bookReturnsFilterState.returnDate}
                    onChange={filterHandler}
                    placeHolder="Issuances Date"
                    labelText="Issuances Date"
                    floatingLabel
                  />
                </div>
                {menuId === "student" && (
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
                    <span className="tw-absolute tw--top-2 tw-left-14 tw-bg-[#0ab39c] tw-text-white tw-text-xs tw-px-2 tw-rounded-full">
                      {count}
                    </span>
                  </div>
                )}
                {showClearFilterState && (
                  <div className="tw-col-span-2 tw-ml-auto tw-flex tw-items-end">
                    <Button
                      variant="wrong"
                      type="button"
                      className="tw-px-2 tw-py-1"
                      onClick={clearFilterHndlr}
                    >
                      Clear filter
                    </Button>
                  </div>
                )}
              </div>
              <TableContainer
                columns={columns || []}
                data={libraryBookReturns || []}
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
        id="advance-filter-book-issuance"
      >
        <AdvanceFilterModal
          appliedFilter={bookReturnsFilterState}
          applyFilterCallback={advanceFilterCallbckHndlr}
          toggleAdvanceFilter={toggleAdvanceFilter}
          isOpen={open}
          menuId={menuId}
        />
      </OffCanvasContainer>
      <ConfirmationModal
        id="delete-transport-concession-modal"
        isOpen={deleteBookReturnsState.showModal}
        confirmMessage="Are you sure you want to delete this Concession ?"
        cancelHndlr={toggleDeleteIssuanceModal}
        confirmHndlr={delModalSubmitHndlr}
        showImgIcon={true}
        isDisble={showApiLoader}
        iconType="reject"
      />
      <ModalContainerUpdated
      id="book-return-export"
      isOpen={exportExcel.showModal}
      toggle={toggleExportExcelModal}
      modalTitle="Export Book Returns Data"
      modalSize="md"
  >
      <ExportModal
          isOpen={exportExcel.showModal}
          toggle={toggleExportExcelModal}
          instituteId={instituteId}
          branchId={branchId}
          submitHndlr={exportExcelHndler}
          feature="library"
          subFeature={`${menuId === "student" ? "book_returns_students" : `book_returns_${menuId.toLowerCase()}`}`}
          remarksText="Enter remarks to export book return data?"
      />
  </ModalContainerUpdated>
    </>
  );
};

export default BookReturns;
