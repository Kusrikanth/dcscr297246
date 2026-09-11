
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ConfirmationModal, OffCanvasContainer, SearchInput, SelectInput, TextInput } from "../../../Components/Common";
import TableContainer from "../../../Components/Common/TableContainer";
import {
  stockCheckingColumns,
  ignoredKeys,
  statusTypes,
} from "./helper";
import { shallowEqual } from "react-redux";
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
import { generateActionPayload } from "../../../utility/reduxutility";
import { IPaginationState } from "../../../Components/Common/Pagination";
import { getStockVerificationListAct, saveRelocateStockListAct } from "../../../store/library/stockDetails/stockdetailsaction";
import { getLibraryDetailsListAct, getLibraryRooms } from "../../../store/library/settings/librarysettingsaction";
import { toast } from "react-toastify";
import { default as FilterSvg } from "../../../assets/imagesdps/academics/FilterSvg.svg?react";
import AdvanceFilterModal from "./AdvanceFilter";
import { useFilterState } from "../../../hooks/filterhook";
import { bookColletionSearchInputOptions } from "../BookCollectionUpload/helper";
import Button from "../../../Components/Common/Button";

interface StockItem {
  bookId: number;
  verificationStatus: string;
  isSelected?: boolean;
}

const initialValues = {
  searchString: "",
  academicYearId: "",
  libraryId: "",
  verificationStatus: "",
  roomId: "",
  shelfId: "",
  rackId: "",
  languageId: "",
};

const StockChecking = () => {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState<boolean>(false);
  const [stockVerificationList, setStockVerificationList] = useState<StockItem[]>([]);
  const [allStockSelectedState, setAllStudentSelectedState] = useState(false);
  const [stockVerifiedModal, setStockVerifiedModal] = useState({
    showModal: false,
  })
  const { showClearFilterState , count , advanceFilterChange } = useFilterState();
  const [stockChecking, setStockChecking] = useState(initialValues);
  const [searchType, setSearchType] = useState("global");

  const toggleStockVerifiedModal = () => {
    setStockVerifiedModal((prevState) => ({
      ...prevState,
      showModal: !prevState.showModal,
    }));
  };

  const pagination = useRef({
    pageNo: 0,
    pageSize: 10,
  });

  const stockCheckingDetailsList = (otherProps?: any) => {
    const { academicYearId, searchString, libraryId,verificationStatus, roomId, shelfId, rackId, languageId } = stockChecking;
    let payload = {
      branchId,
      libraryId,
      verificationStatus,
      roomId,
      shelfId, rackId,
      searchString,
      academicYearId,
      languageId,
      ...pagination.current,
      ...otherProps,
    };    
      dispatch(getStockVerificationListAct(generateActionPayload("get_library_stock_verification_list", undefined, payload)));
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

  const libraryRoomsList = (otherProps?: any) => {
    const { libraryId } = stockChecking;
    let payload = {
      libraryId,
      branchId,
      sortBy: "createdAt",
      orderBy: "asc",
      pageNo: 0, pageSize: 20,
      ...otherProps,
    };
    dispatch(getLibraryRooms(generateActionPayload("get_library_rooms", undefined, payload)));
  };

  const {
    academicYearListResp,
    currentInstIdResp: instituteId,
    currentBranchIdResp: branchId,
    stockVerificationRequestListResp,
    libraryDetailsRequestListResp,
    showApiLoader,
    saveRelocateStockRequestListResp,
    stockCheckingErrorAct,
  } = useAppSelector(
    ({ instAcademics, appData, globalData, stockChecking, librarysettings }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      currentInstIdResp: appData.currentInstIdResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      stockVerificationRequestListResp: stockChecking.stockVerificationRequestListResp,
      libraryDetailsRequestListResp: librarysettings.libraryDetailsRequestListResp,
      showApiLoader: globalData.showApiLoader,
      saveRelocateStockRequestListResp: stockChecking.saveRelocateStockRequestListResp,
      stockCheckingErrorAct: stockChecking.stockCheckingErrorAct,

    }),
    shallowEqual
  );

  const stockCheckingDetailsRef = useRef({
    prevSaveRelocateStockRequestListResp: saveRelocateStockRequestListResp,
    prevStockCheckingErrorAct: stockCheckingErrorAct,

  })

  useEffect(() => {
    const { prevSaveRelocateStockRequestListResp, prevStockCheckingErrorAct } = stockCheckingDetailsRef.current;
    if (saveRelocateStockRequestListResp && prevSaveRelocateStockRequestListResp !== saveRelocateStockRequestListResp) {
      toast.success("Stock Verified Successfully.");
      toggleStockVerifiedModal();
      stockCheckingDetailsList();
    }
    else if (stockCheckingErrorAct && prevStockCheckingErrorAct !== stockCheckingErrorAct) {
      const { details } = stockCheckingErrorAct;
      toast.error(details || "Something went wrong!");
    }
    stockCheckingDetailsRef.current.prevSaveRelocateStockRequestListResp = saveRelocateStockRequestListResp;
    stockCheckingDetailsRef.current.prevStockCheckingErrorAct = stockCheckingErrorAct;

  }, [saveRelocateStockRequestListResp, stockCheckingErrorAct,])

  useEffect(() => {
    
    stockCheckingDetailsList();
    libraryDetailsList();
  }, [branchId,instituteId,]);

  useEffect(() => {
    if (stockChecking.libraryId) {
      libraryRoomsList();
    }
  }, [stockChecking.libraryId,branchId,instituteId,]);
    
  useEffect(() => {
    const { data } = academicYearListResp || {};
    if (Array.isArray(data) && data.length > 0) {
      let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId
      setStockChecking((prev: any) => ({ ...prev, academicYearId: yearId }));
      stockCheckingDetailsList({ academicYearId: yearId });
    }
  }, [academicYearListResp]);

  const filterHandler = (event: any) => {
    const { name, value } = event.target;
    pagination.current.pageNo = 0;
      setStockChecking((prev: any) => ({ ...prev, [name]: value }));
      stockCheckingDetailsList({ [name]: value });
      advanceFilterChange({ keys : { ...stockChecking, [name]: value, academicYearId: "" } , ignoredKeys})
  };

  const toggleAdvanceFilter = () => {
    setOpen(prev => !prev);
  }

  function advanceFilterCallbckHndlr(appliedFilters?: any) {
    pagination.current = { ...pagination.current, pageNo: 0 }
    advanceFilterChange({ keys : { ...stockChecking, ...appliedFilters, academicYearId: "" } , ignoredKeys})
    setStockChecking((prevState: any) => ({ ...prevState, ...appliedFilters }));
    stockCheckingDetailsList(appliedFilters)
  }

  const clearFilterHndlr = () => {
    pagination.current.pageNo = 0;
    let academicYearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId
    stockCheckingDetailsList({ ...initialValues,academicYearId });
    setStockChecking({...initialValues , academicYearId : academicYearId || ""});
    advanceFilterChange({ keys : { ...initialValues } , ignoredKeys})
  };

  function paginationHndlr(paginationInfo: IPaginationState) {
    pagination.current = paginationInfo;
    stockCheckingDetailsList(paginationInfo);
  }

  function submitHandler() {
    const relocatePayload = stockVerificationList
      .filter((item: any) => item.isSelected)
      .map((item: any) => ({
        academicYearId: stockChecking.academicYearId,
        bookId: item.bookId,
        verificationStatus: "VERIFIED",
      }));

    dispatch(saveRelocateStockListAct(generateActionPayload("save_relocate_stock", undefined, relocatePayload)));
    stockCheckingDetailsList();
  }

  const allStockCheckHndlr = useCallback((event: any) => {
    const { checked } = event.target;
    setAllStudentSelectedState(checked);
    let updatedStockList = [...stockVerificationList];
    updatedStockList.forEach((item: any) => {
      if (
        item.verificationStatus != "VERIFIED"
      )
        item.isSelected = checked;
    });

    setStockVerificationList(updatedStockList);
  }, [stockVerificationList]);

  const singleStockCheckHndlr = useCallback((event: any) => {
    const { checked } = event.currentTarget;
    const bookId = Number(event.currentTarget.getAttribute("data-id"));

    const stockRowIndex = stockVerificationList.findIndex((item: any) => +item.bookId === Number(bookId));

    if (stockRowIndex > -1) {
      const stockDetails: any = stockVerificationList[stockRowIndex];
      let updatedStockList: any = [...stockVerificationList];
      updatedStockList.splice(stockRowIndex, 1, {
        ...stockDetails, isSelected: checked,
      });

      setStockVerificationList(updatedStockList);
      const allSelected = updatedStockList.every((item: any) => item.isSelected);
      setAllStudentSelectedState(allSelected);
    }
  }, [stockVerificationList]);

  useEffect(() => {
    if (stockVerificationRequestListResp?.content?.length) {
      setStockVerificationList(stockVerificationRequestListResp?.content?.map((item: any) => {
        return { ...item, isSelected: false }
      }))
    } else {
      setStockVerificationList([])
    }
  }, [stockVerificationRequestListResp])

  function onSearchHandler(name:string,value:any) {
    pagination.current.pageNo = 0;
    setSearchType((prev:any) => {
      const updatedFilterType = prev;
      setStockChecking((prev:any) => {
        const updatedFilters = {
          ...prev,
          searchString: value,
          searchFilterType: updatedFilterType
        }
        stockCheckingDetailsList(updatedFilters)
        return updatedFilters
      })
      return updatedFilterType;
    })
  }

  function onChangeHandler(name:string, id:any, item:any) {
    pagination.current.pageNo = 0;
    setSearchType(id);

    setStockChecking((prev:any) => {
      const updatedFilters = {
        ...prev,
        searchString: "",
        searchFilterType: id
      }
      stockCheckingDetailsList(updatedFilters)
      return updatedFilters
    })
  }

  const { data: academicYearList } = academicYearListResp || {};
  const { content: stockCheckingDetails = [], totalElements = 0, totalPages = 0, pageable = {} } = stockVerificationRequestListResp || {};

  const columns = useMemo(() => stockCheckingColumns(allStockCheckHndlr, singleStockCheckHndlr, allStockSelectedState),
    [stockVerificationList]
  );
  return (
    <>

      <div className="tw-bg-white tw-rounded tw-shadow tw-mb-0">
        <div className="tw-border-b tw-py-2 tw-px-4">
          <div className="tw-grid tw-grid-cols-12 tw-items-center">
            <div className="tw-col-span-6">
              <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                Stock Checking
              </h4>
            </div>
            <div className="tw-col-span-6 tw-flex tw-justify-end">
              <Button
                variant="primary"
                type="submit"
                className="tw-px-2 tw-py-1"
                disabled={
                  stockVerificationList.length <= 0 ||
                  showApiLoader ||
                  !stockVerificationList.some(item => item.isSelected)
                }
                onClick={() => toggleStockVerifiedModal()}
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
        <div className="tw-p-0">
          <div className="tw-px-4 tw-pt-5 tw-pb-2">
            <div className="tw-grid tw-grid-cols-12 tw-gap-3">
              <div className="tw-col-span-12 lg:tw-col-span-5 xl:tw-col-span-3">
                <SearchInput
                  hideDefaultSelect
                  name="searchString"
                  value={searchType}
                  menuItems={bookColletionSearchInputOptions}
                  idKey="id"
                  labelName="Search With"
                  searchHandler={onSearchHandler}
                  onChange={onChangeHandler}
                  renderSelectedValue={(item: any) => item?.name}
                  renderOptions={(item: any) => item?.name}
                />
              </div>
              <div className="tw-col-span-12 lg:tw-col-span-2">
                <SelectInput
                  name="academicYearId"
                  value={stockChecking.academicYearId}
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
                  value={stockChecking.libraryId}
                  onChange={filterHandler}
                  menuItems={libraryDetailsRequestListResp?.content || []}
                  valueKey="id"
                  textKey="libraryName"
                  formgroupClassName="tw-mb-3"
                  labelText="Library Name"
                  floatingLabel
                />
              </div>
              <div className="tw-col-span-12 lg:tw-col-span-2">
                <SelectInput
                  name="verificationStatus"
                  value={stockChecking.verificationStatus}
                  onChange={filterHandler}
                  menuItems={statusTypes}
                  valueKey="statusType"
                  textKey="statusName"
                  formgroupClassName="tw-mb-3"
                  labelText="Status"
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
                <span className="tw-absolute tw--top-2 tw-left-[4.5rem] tw-bg-[#0ab39c] tw-text-white tw-text-xs tw-px-2 tw-rounded-full">
                  {count}
                </span>
              </div>
              <div className="tw-col-span-auto tw-ml-auto">
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
          </div>
          <TableContainer
            columns={columns}
            data={stockVerificationList || []}
            tableClass="tw-mb-0"
            divClass="tw-overflow-x-auto tw-mb-3"
            theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
            showPagination={true}
            totalPages={totalPages || 0}
            totalRecords={totalElements || 0}
            callbackPaginationHndlr={paginationHndlr}
            currentPageNumber={pageable?.pageNumber || 0}
          />
        </div>
      </div>
      <OffCanvasContainer
        isOpen={open}
        headerTitle="Advance Filters"
        closeHndlr={toggleAdvanceFilter}
        id="advance-filter-book-issuance"
      >
        <AdvanceFilterModal
          appliedFilter={stockChecking}
          applyFilterCallback={advanceFilterCallbckHndlr}
          toggleAdvanceFilter={toggleAdvanceFilter}
          isOpen={open}
        />
      </OffCanvasContainer>
      <ConfirmationModal
        id="verified-confirmation"
        isOpen={stockVerifiedModal.showModal}
        confirmMessage="Are you sure the stock is verified ?"
        cancelHndlr={toggleStockVerifiedModal}
        confirmHndlr={submitHandler}
        isDisble={showApiLoader}
        btnClassName='btn w-sm btn-success'
        showImgIcon={true}
        iconType="approve"
      />
    </>
  );
};

export default StockChecking;
