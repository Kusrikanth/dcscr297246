import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useFormik } from "formik";
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
import { shallowEqual, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import TableContainer from "../../../Components/Common/TableContainer";
import { TextInput, SelectInput, ModalContainerUpdated, ConfirmationModal, OffCanvasContainer } from "../../../Components/Common";
import { getInstAcademicYearAct } from "../../../store/mastersettings/instacademics/instacademicactions";
import { exportStockCheckingAct, getStockCheckingListAct } from "../../../store/library/stockDetails/stockdetailsaction";
import { generateActionPayload } from "../../../utility/reduxutility";
import { IPaginationState } from "../../../Components/Common/Pagination";
import { toast } from "react-toastify";
import { resetLibraryListAct, resetLibraryRoomAct, resetRackAct, resetShelfAct } from "../../../store/library/settings/librarysettingsslice";
import { getLibraryDetailsListAct, getLibraryrack, getLibraryRooms, getLibraryshelf } from "../../../store/library/settings/librarysettingsaction";
import { bookConditionOptions, generateColumns, ignoredKeys } from "./helper";
import LibraryStockVerificationModel from "./LibraryStockVerificationModel";
import ExportModal from "../../Directory/StudentManagement/ExportModal";
import { downloadExcelFile } from "../../../utility/commonutility";
import { default as FilterSvg } from "../../../assets/imagesdps/academics/FilterSvg.svg?react";
import { useFilterState } from "../../../hooks/filterhook";
import AdvanceFilterModal from "./AdvanceFilter";
import Button from "../../../Components/Common/Button";

const initialValues = {
  searchString: "",
  academicYearId: "",
  libraryId: "",
  roomId: "",
  shelfId: "",
  rackId: "",
  bookCondition: "",
};

const LibraryStockVerificationReport = () => {
  const dispatch = useAppDispatch();
  const history = useHistory();
    const [open, setOpen] = useState<boolean>(false);
    const { showClearFilterState , count , advanceFilterChange } = useFilterState()
  const [exportExcel, setExportExcel] = useState({
    showModal: false,
  })
  
  const [bedNumberDetailsModel, setBookNumberDetailsModel] = useState({
    
    showModal: false,
    libraryId: "",
    modalData: undefined,
  });

  const [LibraryStockVerification, setLibraryStockVerification] = useState(initialValues);

  const libraryStockVerificationForm = useFormik({
    enableReinitialize: true,
    initialValues: LibraryStockVerification,
    onSubmit: (values) => { },
  });

  const toggleExportExcelModal = () => {
    setExportExcel((prevState) => ({
      ...prevState,
      showModal: !prevState.showModal,
    }));
  };

  const pagination = useRef({
    pageNo: 0,
    pageSize: 10,
  });

  const stockChickingList = (otherProps = {}) => {
    const { searchString, academicYearId, libraryId, roomId, shelfId, rackId, } = LibraryStockVerification;
    let payload = {
      branchId,
      academicYearId,
      libraryId,
      roomId,
      shelfId, rackId,
      searchString,
      ...pagination.current,
      ...otherProps,
    };
    if(payload.academicYearId  ){
    dispatch(getStockCheckingListAct(generateActionPayload("get_library_stock_details_list", undefined, payload)));
    }
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

  const {
    academicYearListResp,
    currentInstIdResp: instituteId,
    currentBranchIdResp: branchId,
    showApiLoader,
    stockCheckingRequestListResp,
    exportStockCheckingResp,
    libraryDetailsRequestListResp,
    libraryRoomsRequestListResp,
    libraryShelfRequestListResp,
    libraryRackRequestListResp,
    stockCheckingErrorAct,
  } = useAppSelector(
    ({ globalData, instAcademics, appData, stockChecking, librarysettings }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      showApiLoader: globalData.showApiLoader,
      stockCheckingRequestListResp: stockChecking.stockCheckingRequestListResp,
      exportStockCheckingResp: stockChecking.exportStockCheckingResp,
      stockCheckingErrorAct: stockChecking.stockCheckingErrorAct,
      libraryRoomsRequestListResp: librarysettings.libraryRoomsRequestListResp,
      libraryShelfRequestListResp: librarysettings.libraryShelfRequestListResp,
      libraryRackRequestListResp: librarysettings.libraryRackRequestListResp,
      libraryDetailsRequestListResp: librarysettings.libraryDetailsRequestListResp,
    }),
    shallowEqual
  );

  const stockCheckingRef = useRef({
    prevExportStockCheckingResp: exportStockCheckingResp,
    prevCheckingErrorResp: stockCheckingErrorAct,
  })

  useEffect(() => {

    const { prevExportStockCheckingResp, prevCheckingErrorResp, } = stockCheckingRef.current;

    if (exportStockCheckingResp && prevExportStockCheckingResp !== exportStockCheckingResp) {
      toast.success("Stock Checking Data Download Successfully.");
      toggleExportExcelModal();
      downloadExcelFile(exportStockCheckingResp, 'Stock_Verification')
    }
    else if (stockCheckingErrorAct && prevCheckingErrorResp !== stockCheckingErrorAct) {
      const { stock } = stockCheckingErrorAct;
      toast.error(stock || "Something went wrong!");
    }

    stockCheckingRef.current.prevExportStockCheckingResp = exportStockCheckingResp;
    stockCheckingRef.current.prevCheckingErrorResp = stockCheckingErrorAct;

  }, [exportStockCheckingResp, stockCheckingErrorAct,])

  useEffect(() => {
    stockChickingList();
    libraryDetailsList();
  }, [branchId,instituteId,]);

  useEffect(() => {
    const payload = { instituteId, pageNo: 0, pageSize: 100, sortBy: "academicYearName", orderBy: "desc" };
    dispatch(getInstAcademicYearAct(generateActionPayload("get_inst_academic_year", undefined, payload)));
  }, [branchId,instituteId,]);

  useEffect(() => {
    const { data } = academicYearListResp || {};
    if (Array.isArray(data) && data.length > 0) {
      let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId
      setLibraryStockVerification((prev: any) => ({ ...prev, academicYearId: yearId }));
      stockChickingList({ academicYearId: yearId });
    }
  }, [academicYearListResp]);

  const toggleNoofBooksModel = useCallback(() => {
    setBookNumberDetailsModel((prevState: any) => ({
      ...prevState,
      showModal: false
    }))
  }, [stockCheckingRequestListResp]);

  const viewNoofBooksModel = (item: any) => {
    setBookNumberDetailsModel((prevState: any) => ({
      ...prevState,
      showModal: true,
      modalData: { ...item,
      bookCondition: libraryStockVerificationForm.values.bookCondition, },
    }));
  };
  
  const filterHandler = (event: any) => {
    const { name, value } = event.target;
    pagination.current.pageNo = 0;
    if (name === 'libraryId') {
      setLibraryStockVerification((prev: any) => ({ ...prev, [name]: value, roomId: "", shelfId: "", rackId: "", }));
      const payload = { branchId: branchId, libraryId: value, orderBy: "asc", pageNo: 0, pageSize: 100 };
      stockChickingList({ [name]: value })
      if (!value) {
        dispatch(resetShelfAct(undefined))
        dispatch(resetRackAct(undefined));
        dispatch(resetLibraryRoomAct(undefined))
        dispatch(resetLibraryListAct(undefined));
      }
      else {
        dispatch(getLibraryRooms(generateActionPayload("get_library_rooms", undefined, payload)));
      }
    } else if (name === 'roomId') {
      setLibraryStockVerification((prev: any) => ({ ...prev, [name]: value, shelfId: "", rackId: "", }));
      const payload = { branchId: branchId, roomId: value, orderBy: "asc", pageNo: 0, pageSize: 100 };
      stockChickingList({ [name]: value })
      if (!value) {
        dispatch(resetShelfAct(undefined))
        dispatch(resetRackAct(undefined));
      }
      else {
        dispatch(getLibraryshelf(generateActionPayload("get_library_shelf", undefined, payload)));
      }
    } else if (name === 'shelfId') {
      setLibraryStockVerification((prev: any) => ({ ...prev, [name]: value, rackId: "", }));
      const shelfPayload = { branchId: branchId, shelfId: value, orderBy: "asc", pageNo: 0, pageSize: 100 };
      stockChickingList({ [name]: value });

      if (!value) {
        dispatch(resetRackAct(undefined));
      } else {
        dispatch(getLibraryrack(generateActionPayload("get_library_rack", undefined, shelfPayload)));
      }
    } else {
      setLibraryStockVerification((prev: any) => ({ ...prev, [name]: value }));
      stockChickingList({ [name]: value });
    }
        advanceFilterChange({
      keys: { ...libraryStockVerificationForm.values, [name]: value, academicYearId: "", count: 0 },  // Ensure count is reset here as well
      ignoredKeys
    });
  };

  const clearFilterHndlr = () => {
    pagination.current.pageNo = 0;
    let academicYearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId
    setLibraryStockVerification({...initialValues , academicYearId : academicYearId || ""});
    stockChickingList({ ...initialValues , academicYearId });
     advanceFilterChange({ keys : { ...initialValues} , ignoredKeys })
  };

  function paginationHndlr(paginationInfo: IPaginationState) {
    pagination.current = paginationInfo;
    stockChickingList(paginationInfo);
  }
  const toggleAdvanceFilter = () => {
    setOpen(prev => !prev);
  }
    function advanceFilterCallbckHndlr(appliedFilters?: any) {
      pagination.current = { ...pagination.current, pageNo: 0 }
      advanceFilterChange({ keys: { ...initialValues, ...appliedFilters, academicYearId: "" }, ignoredKeys })
      libraryStockVerificationForm.setValues((prevState: any) => ({ ...prevState, ...appliedFilters }));
      stockChickingList(appliedFilters)
    }
  const exportExcelHndler = () => {

    dispatch(exportStockCheckingAct(generateActionPayload("export_library_stock_details_collection", undefined, { ...LibraryStockVerification, branchId, instituteId }, {
      responseType: 'blob'
    })));
  }

   const columns = useMemo(() => generateColumns(viewNoofBooksModel), [stockCheckingRequestListResp]);
 const { content: stockChecking = [], totalElements = 0, totalPages = 0, pageable = {} } = stockCheckingRequestListResp || {};
  const { data: academicYearList } = academicYearListResp || {};

  return (
    <>
      <div className="page-content free_payment_record_wrapper">
        <div className="container-fluid">
          <BreadCrumb pageTitle="Library" />
          <div className="tw-bg-white tw-rounded tw-shadow tw-mb-6">
            <div className="tw-border-b tw-px-4 tw-py-3">
              <div className="tw-grid tw-grid-cols-12 tw-items-center">
                <div className="tw-col-span-6">
                  <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                    Stock Checking Details
                  </h4>
                </div>
                <div className="tw-col-span-6 tw-flex tw-justify-end">
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
            <div className="tw-p-0">
              <form onSubmit={libraryStockVerificationForm.handleSubmit}>
                <div className="tw-grid tw-grid-cols-12 tw-gap-3 tw-px-4 tw-pt-4">
                  <div className="tw-col-span-12 lg:tw-col-span-4">
                    <div className="tw-relative search-box">
                      <TextInput
                        name="searchString"
                        formgroupClassName="tw-mb-2"
                        placeHolder="Search..."
                        value={libraryStockVerificationForm.values.searchString}
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
                      value={libraryStockVerificationForm.values.academicYearId}
                      onChange={filterHandler}
                      menuItems={academicYearList || []}
                      valueKey="academicYearId"
                      textKey="academicYearName"
                      formgroupClassName="tw-mb-2"
                      labelText="Academic Year"
                      floatingLabel
                    />
                  </div>
                  <div className="tw-col-span-12 lg:tw-col-span-2">
                    <SelectInput
                      name="libraryId"
                      value={libraryStockVerificationForm.values.libraryId}
                      onChange={filterHandler}
                      menuItems={libraryDetailsRequestListResp?.content || []}
                      valueKey="id"
                      textKey="libraryName"
                      formgroupClassName="tw-mb-2"
                      labelText="Library Name"
                      floatingLabel
                    />
                  </div>
                  <div className="tw-col-span-12 lg:tw-col-span-2">
                    <SelectInput
                      name="bookCondition"
                      value={libraryStockVerificationForm.values.bookCondition}
                      onChange={filterHandler}
                      menuItems={bookConditionOptions}
                      valueKey="bookConditionType"
                      textKey="bookConditionTypeName"
                      formgroupClassName="tw-mb-2"
                      labelText="Book Condition"
                      floatingLabel
                    />
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
                    <span className="tw-absolute tw--top-2 tw-left-14 tw-bg-[#0ab39c] tw-text-white tw-text-xs tw-px-2 tw-rounded-full">
                      {count}
                    </span>
                  </div>
                  {showClearFilterState && (
                    <div className="tw-col-span-12 tw-flex tw-justify-end">
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
              </form>
              <TableContainer
                columns={columns || []}
                data={stockChecking || []}
                tableClass="tw-mb-0"
                divClass="tw-overflow-x-auto tw-mb-3"
                theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
                showCheckbox={false}
                showPagination={true}
                totalPages={totalPages || 0}
                totalRecords={totalElements || 0}
                selectedMembers
                callbackPaginationHndlr={paginationHndlr}
                currentPageNumber={pageable?.pageNumber || 0}
              />
            </div>
          </div>
        </div>
      </div>
      <ModalContainerUpdated
        id="detensions-or-promotions"
        isOpen={bedNumberDetailsModel.showModal}
        toggle={toggleNoofBooksModel}
        modalTitle="Stock Verification"
        modalSize="xl"
      >
        <LibraryStockVerificationModel
          isOpen={bedNumberDetailsModel.showModal}
          toggle={toggleNoofBooksModel}
          modalTitle="Stock Verification"
          modalData={bedNumberDetailsModel.modalData}
        />
      </ModalContainerUpdated>
      <ModalContainerUpdated
      id="book-stock-export"
      isOpen={exportExcel.showModal}
      toggle={toggleExportExcelModal}
      modalTitle="Export Stock Verification Data"
      modalSize="md"
  >
      <ExportModal
          isOpen={exportExcel.showModal}
          toggle={toggleExportExcelModal}
          instituteId={instituteId}
          branchId={branchId}
          submitHndlr={exportExcelHndler}
          feature="library"
          subFeature="stock_verification_report"
          remarksText="Enter remarks to export stock verifiaction data?"
      />
  </ModalContainerUpdated>
        <OffCanvasContainer
          isOpen={open}
          headerTitle="Advance Filters"
          closeHndlr={toggleAdvanceFilter}
          id="advance-filter-book-issuance"
        >
          <AdvanceFilterModal
            appliedFilter={libraryStockVerificationForm.values}
            applyFilterCallback={advanceFilterCallbckHndlr}
            toggleAdvanceFilter={toggleAdvanceFilter}
            isOpen={open}
          />
        </OffCanvasContainer>
    </>
  );
};

export default LibraryStockVerificationReport;
