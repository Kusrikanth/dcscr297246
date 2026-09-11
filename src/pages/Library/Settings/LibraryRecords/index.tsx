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
import { generateActionPayload } from "../../../../utility/reduxutility";
import { useAppSelector } from "../../../../hooks/storehook";
import { toast } from "react-toastify";
import { getLibraryRecordListAct } from "../../../../store/library/settings/librarysettingsaction";
import { IPaginationState } from "../../../../Components/Common/Pagination";

const initialValues = {
  searchString: "",
};

const LibraryRecords = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [LibraryRecords, setLibraryRecords] = useState(initialValues);
  const [LibraryRecordsModelState, setLibraryRecordsModelState] =
    useState({
      showModal: false,
      branchId: "",
    });
    
  const pagination = useRef({
    pageNo: 0,
    pageSize: 10,
  });

  const LibraryRecordsForm = useFormik({
    enableReinitialize: true,
    initialValues: LibraryRecords,
    onSubmit: (values) => { },
  });
  const toggleLibraryRecordsModel = () => {
    setLibraryRecordsModelState((prevState) => ({
      ...prevState,
      showModal: !prevState.showModal,
    }));
  };
  const libraryRecordList = (otherProps?: any) => {
    const { searchString } = LibraryRecords;
    let payload = {
      branchId,
      searchString,
      sortBy: "createdAt",
      orderBy: "asc",
      ...pagination.current,
      ...otherProps,
    };
    dispatch(getLibraryRecordListAct(generateActionPayload("get_library_record", undefined, payload)));
  };
  const {
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    showApiLoader,
    libraryRecordRequestListResp,
    libraryDetailsErrorAct,
  } = useAppSelector(
    ({ librarysettings, appData, globalData }) => ({
      currentBranchIdResp: appData.currentBranchIdResp,
      showApiLoader: globalData.showApiLoader,
      currentInstIdResp: appData.currentInstIdResp,
      libraryRecordRequestListResp: librarysettings.libraryRecordRequestListResp,
      libraryDetailsErrorAct: librarysettings.libraryDetailsErrorAct,
    }),
    shallowEqual
  );

  const libraryRecordRef = useRef({
    prevLibraryRecordErrorResp: libraryDetailsErrorAct,
  });

  useEffect(() => {
    const { prevLibraryRecordErrorResp } = libraryRecordRef.current;
    if (libraryDetailsErrorAct && prevLibraryRecordErrorResp !== libraryDetailsErrorAct) {
      const { details } = libraryDetailsErrorAct;
      toast.error(details);
    }
    libraryRecordRef.current.prevLibraryRecordErrorResp = libraryDetailsErrorAct;
  }, [libraryDetailsErrorAct]);

  useEffect(() => {
    libraryRecordList();
  }, [branchId,instituteId,]);

  const filterHandler = (event: { target: { name: any; value: any; }; }) => {
    const { name, value } = event.target;
    setLibraryRecords((prev) => ({ ...prev, [name]: value }));
    pagination.current.pageNo = 0;
    libraryRecordList({ [name]: value });
  };
  function paginationHndlr(paginationInfo: IPaginationState) {
    pagination.current = paginationInfo;
    libraryRecordList(paginationInfo);
  }
  const columns = useMemo(() => generateColumns(), []);
  const { content: libraryRecordResp, totalElements, totalPages, pageable } = libraryRecordRequestListResp || {};

  return (
    <>
      <div className="page-content free_payment_record_wrapper">
        <div className="container-fluid">
          <BreadCrumb title="Library" pageTitle="Library" />
          <div className="tw-bg-white tw-rounded-md tw-shadow">
            <div className="tw-border-b tw-border-slate-200 tw-px-4 tw-py-3">
              <div className="tw-flex tw-items-center">
                <div className="tw-flex-1">
                  <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                    Record Type
                  </h4>
                </div>
              </div>
            </div>
            <div className="tw-p-0">
              <form onSubmit={LibraryRecordsForm.handleSubmit}>
                <div className="tw-grid tw-grid-cols-12 tw-gap-3 tw-px-3 tw-pt-3">
                  <div className="tw-col-span-12 lg:tw-col-span-4">
                    <div className="search-box">
                      <TextInput
                        name="searchString"
                        formgroupClassName="tw-mb-4 tw-mt-2"
                        placeHolder="Search..."
                        value={LibraryRecordsForm.values.searchString}
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
                data={libraryRecordResp || []}
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

export default LibraryRecords;
