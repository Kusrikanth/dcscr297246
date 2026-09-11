import { useEffect, useMemo, useRef, useState } from "react";
import { Button, DateInput, ModalContainerUpdated, SelectInput, TextInput } from "../../../Components/Common";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import TableContainer from "../../../Components/Common/TableContainer";
import {
  generateColumns,
  getUserTypeId,
  MenuOptions,
} from "./helper";
import BookRenewalModel from "./BookRenewalModel";
import { shallowEqual, useDispatch } from "react-redux";
import { useAppSelector } from "../../../hooks/storehook";
import { generateActionPayload } from "../../../utility/reduxutility";
import ModifiedHorizontalTab from "../../../Components/Common/ModifiedHorizontalTab";
import { IPaginationState } from "../../../Components/Common/Pagination";
import { getLibraryBookRenewalListAct } from "../../../store/library/bookrenewal/bookrenewalaction";
import { toast } from "react-toastify";
import { getLibraryDetailsListAct } from "../../../store/library/settings/librarysettingsaction";

const initialValues = {
  searchString: "",
  academicYearId: "",
  issuanceDate: "",
  libraryId:'',
};

const BookRenewal = () => {
  const dispatch = useDispatch();
  const [BookRenewalModelState, setBookRenewalModelState] =
    useState({
      showModal: false,
      branchId: "",
    });
  const pagination: any = useRef<any>({
    pageNo: 0,
    pageSize: 10
  })
  const [menuId, setMenuId] = useState<any>("student");
  const [BookRenewalFilterState, setBookRenewalFilterState] = useState(initialValues);

  const toggleBookRenewalModel = () => {
    setBookRenewalModelState((prevState) => ({
      ...prevState,
      showModal: !prevState.showModal,
    }));
  };

  const libraryBookRenewalList = (otherProps?: any) => {
    let payload = {
      branchId,
      userTypeId: menuId,
      ...BookRenewalFilterState,
      ...pagination.current,
      ...otherProps,
    };
    payload.userTypeId = getUserTypeId(payload.userTypeId)
    dispatch(getLibraryBookRenewalListAct(generateActionPayload("get_library_book_renewal", undefined, payload)))
  };

  const libraryDetailsList = () => {
    let payload = {
      branchId,
      sortBy: "createdAt",
      orderBy: "asc",
      pageNo:0,
      pageSize:100,
    };
    dispatch(getLibraryDetailsListAct(generateActionPayload("get_library_details", undefined, payload)));
  };

  const {
    academicYearListResp,
    currentInstIdResp: instituteId,
    currentBranchIdResp: branchId,
    showApiLoader,
    libraryBookRenewalRequestListResp,
    libraryDetailsRequestListResp,
    libraryBookRenewalErrorResp,
  }: any = useAppSelector(
    ({  globalData, instAcademics, appData, libraryBookRenewal , librarysettings }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      showApiLoader: globalData.showApiLoader,
      libraryBookRenewalRequestListResp: libraryBookRenewal.libraryBookRenewalRequestListResp,
      libraryDetailsRequestListResp: librarysettings.libraryDetailsRequestListResp,
      libraryBookRenewalErrorResp: libraryBookRenewal.libraryBookRenewalErrorResp,
    }),
    shallowEqual
  );

  const libraryBookReturnsRef = useRef({
    prevLibraryBookRenewalErrorResp: libraryBookRenewalErrorResp,
  })
  useEffect(() => {
    const { prevLibraryBookRenewalErrorResp } = libraryBookReturnsRef.current;
    if (libraryBookRenewalErrorResp && prevLibraryBookRenewalErrorResp !== libraryBookRenewalErrorResp) {
      const { details } = libraryBookRenewalErrorResp;
      toast.error(details || "Something went wrong!");
    }
    libraryBookReturnsRef.current.prevLibraryBookRenewalErrorResp = libraryBookRenewalErrorResp;

  }, [libraryBookRenewalErrorResp,])

  useEffect(() => {
    const { data } = academicYearListResp || {};
    if (Array.isArray(data) && data.length > 0) {
      let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus === "CURRENT").academicYearId
      setBookRenewalFilterState((prev: any) => ({ ...prev, academicYearId: yearId }))
      libraryDetailsList()
    }
  }, [academicYearListResp]);

  useEffect(() => {
    if (academicYearListResp && menuId) {
      const { academicYearId } = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current") || {}
      pagination.current.pageNo = 0
      setBookRenewalFilterState((prev: any) => ({ ...initialValues, academicYearId }))
      libraryBookRenewalList({ ...initialValues, academicYearId, userTypeId: menuId })
    }
  }, [menuId])

  const filterHandler = (event: { target: { name: any; value: any; }; }) => {
    const { name, value } = event.target;
    setBookRenewalFilterState((prev: any) => ({ ...prev, [name]: value }));
    pagination.current.pageNo = 0;
    libraryBookRenewalList({ [name]: value });
  };

  function paginationHndlr(paginationInfo: IPaginationState) {
    pagination.current = paginationInfo;
    libraryBookRenewalList(paginationInfo)
  }


  const { data: academicYearList } = academicYearListResp || {};
  const { totalElements, totalPages, pageable } = libraryBookRenewalRequestListResp || {}

  const columns = useMemo(() => generateColumns(), [libraryBookRenewalRequestListResp]);

  return (
    <>
      <div className="page-content free_payment_record_wrapper">
        <div className="container-fluid">
          <BreadCrumb title="Library" pageTitle="Library" />

          <div className="tw-relative tw-flex tw-flex-col tw-min-w-0 tw-break-words tw-bg-white tw-bg-clip-border tw-border tw-border-solid tw-border-black/10 tw-rounded">
            <div className="tw-py-4 tw-px-5 tw-mb-0 tw-bg-transparent tw-border-b tw-border-solid tw-border-black/10">
              <div className="tw-flex tw-flex-wrap tw-items-center">
                <div className="tw-w-1/2">
                  <h4 className="tw-mb-0 tw-grow tw-text-[16px] tw-font-semibold tw-text-[#495057]">
                    Book Renewal Details List
                  </h4>
                </div>
                <div className="tw-w-auto tw-ml-auto">
                  <div className="tw-flex">
                    <Button
                      variant="primary"
                      className="tw-float-right tw-flex tw-items-center tw-mr-2"
                      onClick={toggleBookRenewalModel}
                    >
                      Renew Book
                    </Button>
                    <Button 
                      variant="info"
                    >
                      <i className="ri-add-line tw-mr-1" />
                      <span>Export</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <div className="tw-flex-auto tw-p-0">
              <div className="tw-ml-3">
                <ModifiedHorizontalTab
                  MenuOptions={MenuOptions}
                  getActiveMenuId={(menuId: any) => {
                    setMenuId(menuId);
                  }}
                  activeTabId={menuId}
                  horizontalClass="tw-pt-2 tw-mb-2 tw-overflow-auto"
                  labelClass='tw-text-nowrap'
                />
              </div>
              <div className="tw-flex tw-flex-wrap tw-px-3 tw-pt-3">
                <div className="tw-w-full lg:tw-w-1/3 xl:tw-w-1/3 tw-px-1">
                  <div className="tw-relative search-box">
                    <TextInput
                      name="searchString"
                      formgroupClassName="tw-mb-3"
                      placeHolder="Search..."
                      value={BookRenewalFilterState.searchString}
                      onChange={filterHandler}
                    />
                    <i className="ri-search-line tw-absolute tw-left-3 tw-top-1/2 tw-translate-y-[-50%] tw-text-gray-400"></i>
                  </div>
                </div>
                <div className="tw-w-full lg:tw-w-1/6 xl:tw-w-1/6 tw-px-1">
                  <SelectInput
                    name="academicYearId"
                    value={BookRenewalFilterState.academicYearId}
                    onChange={filterHandler}
                    menuItems={academicYearList || []}
                    valueKey="academicYearId"
                    textKey="academicYearName"
                    formgroupClassName="tw-mb-3"
                    defaultSelect="Academic Year"
                  />
                </div>
                <div className="tw-w-full lg:tw-w-1/6 xl:tw-w-1/6 tw-px-1">
                  <SelectInput
                    name="libraryId"
                    value={BookRenewalFilterState.libraryId}
                    onChange={filterHandler}
                    menuItems={libraryDetailsRequestListResp?.content || []}
                    valueKey="id"
                    textKey="libraryName"
                    formgroupClassName="tw-mb-3"
                    defaultSelect="Library Name"
                  />
                </div>
                <div className="tw-w-full lg:tw-w-1/6 xl:tw-w-1/6 tw-px-1">
                  <DateInput
                    name="issuanceDate"
                    value={BookRenewalFilterState.issuanceDate}
                    onChange={filterHandler}
                    placeHolder="Issuances Date"
                  />
                </div>
              </div>
              <TableContainer
                columns={columns || []}
                data={libraryBookRenewalRequestListResp?.content || []}
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
      <ModalContainerUpdated
        id="detensions-or-promotions"
        isOpen={BookRenewalModelState.showModal}
        toggle={toggleBookRenewalModel}
        modalTitle="Renew Book"
        modalSize="md"
      >
        <BookRenewalModel
          isOpen={BookRenewalModelState.showModal}
          toggle={toggleBookRenewalModel}
          modalTitle="Renew Book"
        />
      </ModalContainerUpdated>
    </>
  );
};

export default BookRenewal;
