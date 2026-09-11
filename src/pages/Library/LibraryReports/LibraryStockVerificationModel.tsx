import React, { useState, useEffect, useMemo, useRef } from "react";
import { useFormik } from "formik";
import { useAppSelector } from "../../../hooks/storehook";
import { shallowEqual, useDispatch } from "react-redux";
import { generateActionPayload } from "../../../utility/reduxutility";
import { generateColumnsStockCheckingBooks } from "./helper";
import { TextInput } from "../../../Components/Common";
import { getStockCheckingDetailsListAct } from "../../../store/library/stockDetails/stockdetailsaction";
import { IPaginationState } from "../../../Components/Common/Pagination";
import { getInstAcademicYearAct } from "../../../store/mastersettings/instacademics/instacademicactions";
import TableContainer from "../../../Components/Common/TableContainer";
import Button from "../../../Components/Common/Button";

const initialValues = {
  searchString: "",
};

const LibraryStockVerificationModel: React.FC<any> = (props) => {
  const [changeLibraryStockVerification, setChangeLibraryStockVerification] = useState(initialValues);

  const dispatch = useDispatch();
  const changeLibraryStockVerificationFormik = useFormik({
    enableReinitialize: true,
    initialValues: changeLibraryStockVerification,
    onSubmit: (values) => {},
  });

  const pagination = useRef({
    pageNo: 0,
    pageSize: 10,
  });

  

  const {
    currentBranchIdResp: branchId,
    stockCheckingDetailsRequestListResp,
  } = useAppSelector(
    ({ stockChecking, appData }) => ({
      currentBranchIdResp: appData.currentBranchIdResp,
      stockCheckingDetailsRequestListResp: stockChecking.stockCheckingDetailsRequestListResp,
    }),
    shallowEqual
  );

  const stockVerificationTotalBookDetails = (otherProps?: any) => {
    const { searchString,  } = changeLibraryStockVerification;
    const { modalData } = props;

  let payload = {
    branchId,
    searchString,
    academicYearId: modalData?.academicYearId || "",
    libraryId: modalData?.libraryId || "",
    roomId: modalData?.roomId || "",
    shelfId: modalData?.shelfId || "",
    rackId: modalData?.rackId || "",
    bookCondition: modalData?.bookCondition || "",
    ...otherProps
  };  
    dispatch(getStockCheckingDetailsListAct(generateActionPayload("get_library_stock_checking_details_list", undefined, payload)));
    
  };


  useEffect(() => {
    stockVerificationTotalBookDetails();
  }, []);

  const filterHandler = (event: { target: { name: any; value: any } }) => {
    const { name, value } = event.target;
    setChangeLibraryStockVerification((prev) => ({ ...prev, [name]: value }));
    pagination.current.pageNo = 0;
    stockVerificationTotalBookDetails({ [name]: value });
  };

  function paginationHndlr(paginationInfo: IPaginationState) {
    pagination.current = paginationInfo;
    stockVerificationTotalBookDetails(paginationInfo);
  }

  const { content: stockChecking = [], totalElements = 0, totalPages = 0, pageable = {} } = stockCheckingDetailsRequestListResp || {};
  const { modalData } = props;
  
  const roleColumns = useMemo(() => generateColumnsStockCheckingBooks(), []);
  return (
    <>
      <div className="tw-flex tw-flex-col tw-items-center">
        <div className="tw-w-full tw-px-4 tw-py-2">
          <div className="tw-grid tw-grid-cols-12">
            <div className="tw-col-span-4 tw-px-2 tw-py-1">
              <div className="tw-grid tw-grid-cols-12">
                <div className="tw-col-span-4">
                  <h6>
                    <span className="tw-font-bold">Library Name : </span>
                  </h6>
                </div>
                <div className="tw-col-span-6">
                  <h6>
                    <span className="tw-font-bold tw-text-gray-500">
                      {modalData?.libraryName || "n/a"}
                    </span>
                  </h6>
                </div>
              </div>
            </div>
            <div className="tw-col-span-3 tw-px-2 tw-py-1">
              <div className="tw-grid tw-grid-cols-12">
                <div className="tw-col-span-6">
                  <h6>
                    <span className="tw-font-bold">Room Name : </span>
                  </h6>
                </div>
                <div className="tw-col-span-4">
                  <h6>
                    <span className="tw-font-bold tw-text-gray-500">
                      {modalData?.roomName || "n/a"}
                    </span>
                  </h6>
                </div>
              </div>
            </div>
            <div className="tw-col-span-4 tw-px-2 tw-py-1">
              <div className="tw-grid tw-grid-cols-12">
                <div className="tw-col-span-6">
                  <h6>
                    <span className="tw-font-bold">Book Condition : </span>
                  </h6>
                </div>
                <div className="tw-col-span-6">
                  <h6>
                    <span className="tw-font-bold tw-text-gray-500">
                      {modalData?.bookCondition || "n/a"}
                    </span>
                  </h6>
                </div>
              </div>
            </div>
          </div>
          <div className="tw-grid tw-grid-cols-12">
            <div className="tw-col-span-4 tw-px-2 tw-py-1">
              <div className="tw-grid tw-grid-cols-12">
                <div className="tw-col-span-4">
                  <h6>
                    <span className="tw-font-bold">Shelf : </span>
                  </h6>
                </div>
                <div className="tw-col-span-4">
                  <h6>
                    <span className="tw-font-bold tw-text-gray-500">
                      {modalData?.shelfName || "n/a"}
                    </span>
                  </h6>
                </div>
              </div>
            </div>
            <div className="tw-col-span-4 tw-px-2 tw-py-1">
              <div className="tw-grid tw-grid-cols-12">
                <div className="tw-col-span-4">
                  <h6>
                    <span className="tw-font-bold">Rack : </span>
                  </h6>
                </div>
                <div className="tw-col-span-4">
                  <h6>
                    <span className="tw-font-bold tw-text-gray-500">
                      {modalData?.rackName || "n/a"}
                    </span>
                  </h6>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="tw-w-full">
          <div className="tw-grid tw-grid-cols-12 tw-px-3 tw-gap-3">
            <div className="tw-col-span-12 lg:tw-col-span-7">
              <div className="tw-relative search-box">
                <TextInput
                  name="searchString"
                  formgroupClassName="tw-mb-3 tw-w-[95%]"
                  placeHolder="Search by Accession Number/Book Name/Author name.."
                  value={changeLibraryStockVerificationFormik.values.searchString}
                  onChange={filterHandler}
                />
                <i className="ri-search-line tw-absolute tw-left-3 tw-top-1/2 tw-translate-y-[-50%] tw-text-gray-400"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="tw-w-full">
          <TableContainer
            columns={roleColumns || []}
            data={stockChecking || []}
            divClass="tw-overflow-x-auto tw-mb-1"
            theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
            showCheckbox={false}
            showPagination={true}
            totalPages={totalPages || 0}
            totalRecords={totalElements || 0}
            callbackPaginationHndlr={paginationHndlr}
            currentPageNumber={pageable?.pageNumber || 0}
          />
        </div>
        <div className="tw-w-full">
          <div className="tw-grid tw-grid-cols-12 tw-px-3">
            <div className="tw-col-span-12">
              <div className="tw-flex tw-gap-2 tw-justify-end tw-mx-4 tw-my-3">
                <Button
                  variant="warning"
                  type="button"
                  className="tw-px-2 tw-py-1"
                  onClick={props.toggle}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LibraryStockVerificationModel;
