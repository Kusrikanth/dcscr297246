import { useFormik } from "formik";
import { useEffect, useMemo, useRef, useState } from "react";
import { TextInput } from "../../../../Components/Common";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import TableContainer from "../../../../Components/Common/TableContainer";
import { useHistory } from "react-router-dom";
import {
  generateColumns,
} from "./helper";
import { shallowEqual, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useAppSelector } from "../../../../hooks/storehook";
import { getLibraryLanguageListAct } from "../../../../store/library/settings/librarysettingsaction";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { IPaginationState } from "../../../../Components/Common/Pagination";

const initialValues = {
  searchString: "",
};

const LibraryLanguageDetails = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  const pagination = useRef({
    pageNo: 0,
    pageSize: 10,
  });
  const [LibraryLanguageDetails, setLibraryLanguageDetails] = useState(initialValues);
  const LibraryLanguageDetailsForm = useFormik({
    enableReinitialize: true,
    initialValues: LibraryLanguageDetails,
    onSubmit: (values) => { },
  });
  const libraryLanguageList = (otherProps?: any) => {
    const { searchString } = LibraryLanguageDetails;
    let payload = {
      branchId,
      searchString,
      sortBy: "createdAt",
      orderBy: "asc",
      ...pagination.current,
      ...otherProps,
    };
    dispatch(getLibraryLanguageListAct(generateActionPayload("get_library_language", undefined, payload)));
  };
  const {
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    showApiLoader,
    libraryLanguageRequestListResp,
    libraryDetailsErrorAct,
  } = useAppSelector(
    ({ librarysettings, appData, globalData }) => ({
      currentBranchIdResp: appData.currentBranchIdResp,
      showApiLoader: globalData.showApiLoader,
      currentInstIdResp: appData.currentInstIdResp,
      libraryLanguageRequestListResp: librarysettings.libraryLanguageRequestListResp,
      libraryDetailsErrorAct: librarysettings.libraryDetailsErrorAct,
    }),
    shallowEqual
  );
  const libraryLanguageRef = useRef({
    prevLibraryDetailsErrorResp: libraryDetailsErrorAct,
  });

  useEffect(() => {
    const { prevLibraryDetailsErrorResp } = libraryLanguageRef.current;
    if (libraryDetailsErrorAct && prevLibraryDetailsErrorResp !== libraryDetailsErrorAct) {
      const { details } = libraryDetailsErrorAct;
      toast.error(details);
    }
    libraryLanguageRef.current.prevLibraryDetailsErrorResp = libraryDetailsErrorAct;
  }, [libraryDetailsErrorAct]);

  useEffect(() => {

    libraryLanguageList();
    return () => {

    }
}, [branchId,instituteId,]);
  function paginationHndlr(paginationInfo: IPaginationState) {
    pagination.current = paginationInfo;
    libraryLanguageList(paginationInfo);
  }
  const filterHandler = (event: { target: { name: any; value: any; }; }) => {
    const { name, value } = event.target;
    setLibraryLanguageDetails((prev) => ({ ...prev, [name]: value }));
    pagination.current.pageNo = 0;
    libraryLanguageList({ [name]: value });
  };
  const columns = useMemo(() => generateColumns(), []);
  const { content: libraryLanguageResp, totalElements, totalPages, pageable } = libraryLanguageRequestListResp || {};

  return (
    <>
      <div className="page-content free_payment_record_wrapper">
        <div className="container-fluid">
          <BreadCrumb title="Library" pageTitle="Library" />

          <div className="tw-bg-white tw-rounded-md tw-shadow">
            <div className="tw-border-b tw-border-slate-200 tw-px-4 tw-py-3">
              <div className="tw-flex tw-items-center">
                <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                  Language Details
                </h4>
              </div>
            </div>
            <div className="tw-p-0">
              <form onSubmit={LibraryLanguageDetailsForm.handleSubmit}>
                <div className="tw-grid tw-grid-cols-12 tw-gap-3 tw-p-4">
                  <div className="tw-col-span-12 lg:tw-col-span-4">
                    <div className="search-box">
                      <TextInput
                        name="searchString"
                        formgroupClassName="tw-mb-0"
                        placeHolder="Search..."
                        value={LibraryLanguageDetailsForm.values.searchString}
                        onChange={filterHandler}
                        floatingLabel
                        labelText="Search"
                      />
                      <i className="ri-search-line search-icon"></i>
                    </div>
                  </div>
                </div>
              </form>
              <TableContainer
                columns={columns || []}
                data={libraryLanguageResp || []}
                tableClass="tw-mb-0"
                divClass="tw-overflow-x-auto tw-mb-3"
                theadClass="tw-bg-slate-100 tw-text-slate-500 tw-align-middle"
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
    </>
  );
};

export default LibraryLanguageDetails;
