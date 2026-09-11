import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useFormik } from "formik";
import TableContainer from "../../../Components/Common/TableContainer";
import { StatusLabel, TextInput } from "../../../Components/Common";
import { ILibraryStockVerificationProps } from "./LibraryStockVerificationTypes";
import { useAppSelector } from "../../../hooks/storehook";
import { shallowEqual, useDispatch } from "react-redux";
import { generateActionPayload } from "../../../utility/reduxutility";
import { getRelocateSaveListAct, saveRelocateStockListAct, setRelocateSaveListAct } from "../../../store/library/stockDetails/stockdetailsaction";
import { IPaginationState } from "../../../Components/Common/Pagination";
import { getInstAcademicYearAct } from "../../../store/mastersettings/instacademics/instacademicactions";
import { toast } from "react-toastify";
import { debounce } from "../../../utility/commonutility";
import Button from "../../../Components/Common/Button";

const initialValues = {
  searchString: "",
  academicYearId: "",
};

const RelocateModel: React.FC<ILibraryStockVerificationProps> = (props) => {
  const [changeLibraryStockVerification, setChangeLibraryStockVerification] = useState(initialValues);
  const dispatch = useDispatch();
  const pagination = useRef({
    pageNo: 0,
    pageSize: 10,
  });

  const {
    academicYearListResp,
    currentInstIdResp: instituteId,
    currentBranchIdResp: branchId,
    stockRelocateSaveRequestListResp,
    saveRelocateStockRequestListResp,
    showApiLoader,
    stockCheckingErrorAct,
  }: any = useAppSelector(
    ({ instAcademics, globalData, appData, stockChecking }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      currentInstIdResp: appData.currentInstIdResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      stockRelocateSaveRequestListResp: stockChecking.stockRelocateSaveRequestListResp,
      saveRelocateStockRequestListResp: stockChecking.saveRelocateStockRequestListResp,
      showApiLoader: globalData.showApiLoader,
      stockCheckingErrorAct: stockChecking.stockCheckingErrorAct,
    }),
    shallowEqual
  );

  const stockRelocateRef = useRef({
    prevStockCheckingErrorAct: stockCheckingErrorAct,
    prevSaveRelocateStockRequestListResp: saveRelocateStockRequestListResp,

  })

  useEffect(() => {
    const { prevSaveRelocateStockRequestListResp, prevStockCheckingErrorAct } = stockRelocateRef.current;
    if (saveRelocateStockRequestListResp && prevSaveRelocateStockRequestListResp !== saveRelocateStockRequestListResp) {
      toast.success("Stock Relocated Successfully.");
      relocateSaveDetailsList();
    } else if (stockCheckingErrorAct && prevStockCheckingErrorAct !== stockCheckingErrorAct) {
      const { details } = stockCheckingErrorAct;
      toast.error(details || "Something went wrong!");
    }
    stockRelocateRef.current.prevSaveRelocateStockRequestListResp = saveRelocateStockRequestListResp;
    stockRelocateRef.current.prevStockCheckingErrorAct = stockCheckingErrorAct;

  }, [saveRelocateStockRequestListResp, stockCheckingErrorAct,])
  useEffect(() => {
    if (academicYearListResp) {
      const { data } = academicYearListResp;
      if (Array.isArray(data) && data.length > 0) {
        const currentYear = data.find((year) => year.yearStatus.toLowerCase() === "current");
        if (currentYear) {
          const yearId = currentYear.academicYearId;
          setChangeLibraryStockVerification((prev) => ({
            ...prev,
            academicYearId: yearId,
          }));
          relocateSaveDetailsList({ academicYearId: yearId });
        }
      }
    }
  }, [academicYearListResp]);

  const relocateSaveDetailsList = (otherProps = {}) => {
    const { searchString, academicYearId } = changeLibraryStockVerification;
    let payload = {
      branchId,
      academicYearId,
      searchString,
      ...pagination.current,
      ...otherProps,
    };
    if (payload.searchString) {
      dispatch(getRelocateSaveListAct(generateActionPayload("get_library_relocate_save_list", undefined, payload)));
    }
  };


  useEffect(() => {
    const payload = { instituteId, pageNo: 0, pageSize: 100, sortBy: "academicYearName", orderBy: "desc" };
    dispatch(getInstAcademicYearAct(generateActionPayload("get_inst_academic_year", undefined, payload)));

  }, [instituteId]);

  const RelocateButton = ({ row }: { row: any }) => {
    const handleRelocate = () => {
      const relocatePayload = [
        {
          academicYearId: changeLibraryStockVerification.academicYearId,
          bookId: row.original.bookId,
          verificationStatus: "RELOCATED",
        }
      ];
      dispatch(saveRelocateStockListAct(generateActionPayload("save_relocate_stock", undefined, relocatePayload)));
      relocateSaveDetailsList();
    };

    return (
      <div className="mb-0 d-flex align-items-center justify-content-start">
        <button className="btn btn-success float-end d-flex align-items-center py-1 px-2" onClick={handleRelocate}>
          Relocate
        </button>
      </div>
    );
  };

  function generateRelocateColumns() {
    return [
      {
        Header: "Accession Number",
        accessor: "accessionNumber",
        disableSortBy: true,
      },
      {
        Header: "Book Name",
        accessor: "title",
        disableSortBy: true,
        columnClassName: "tw-w-[300px] tw-min-w-[300px] tw-max-w-[300px]",
      },
      {
        Header: "Library",
        accessor: "libraryName",
        disableSortBy: true,
      },
      {
        Header: "Room",
        accessor: "roomName",
        disableSortBy: true,
      },
      {
        Header: "Shelf",
        accessor: "shelfName",
        disableSortBy: true,
      },
      {
        Header: "Rack",
        accessor: "rackName",
        disableSortBy: true,
      },
      {
        Header: "",
        accessor: "verificationStatus",
        disableSortBy: true,        
        Cell: ({ row }: { row: any }) => {
          if (row.original.verificationStatus === "RELOCATED") {
            return (
              <StatusLabel
                type={row.original.verificationStatus}
                labelName="RELOCATED"
              />
            );
          } else {
            return <RelocateButton row={row} />;
          }
        },
      },
    ];
  }

  function paginationHndlr(paginationInfo: IPaginationState) {
    pagination.current = paginationInfo;
    relocateSaveDetailsList(paginationInfo);
  }
  
  function search(value: string) {
    relocateSaveDetailsList({ searchString: value });
}
  const debounceFun = useCallback(debounce(search, 1000), [changeLibraryStockVerification.academicYearId, stockRelocateSaveRequestListResp]);

  const filterHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    pagination.current.pageNo = 0;
    
    if (!value) {
      dispatch(setRelocateSaveListAct(undefined));
      setChangeLibraryStockVerification((prev) => ({
        ...prev,
        [name]: value,
        searchString: "",
      }));
    } else {
      setChangeLibraryStockVerification((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    debounceFun(value);
  };

  const roleColumns = useMemo(() => generateRelocateColumns(), [stockRelocateSaveRequestListResp, saveRelocateStockRequestListResp]);
  
  const { content: RelocateStockDetails = [], totalElements = 0, totalPages = 0, pageable = {} } = stockRelocateSaveRequestListResp || {};

  return (
    <>
      <div className="tw-flex tw-flex-col tw-items-center">
        <div className="tw-w-full">
          <div className="tw-grid tw-grid-cols-12 tw-gap-3 tw-px-3 tw-pt-3">
            <div className="tw-col-span-12">
              <div className="search-box">
                <TextInput
                  name="searchString"
                  labelClass="tw-font-bold"
                  formgroupClassName="tw-mb-3"
                  placeHolder="Search by Accession Number/Book Name/Author name.."
                  value={changeLibraryStockVerification.searchString}
                  onChange={filterHandler}
                />
                <i className="ri-search-line search-icon"></i>
              </div>
            </div>
          </div>
          <div className="tw-grid tw-grid-cols-12 tw-gap-3 tw-px-3">
            <div className="tw-col-span-12 tw-border-b tw-pb-2">
              <span className="tw-font-bold tw-text-left">
                Book original Location
              </span>
            </div>
            <div className="tw-col-span-12 tw-border-b">
              <TableContainer
                columns={roleColumns || []}
                data={RelocateStockDetails || []}
                divClass="tw-overflow-x-auto tw-mb-3 tw-border"
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
        <div className="tw-w-full">
          <div className="tw-grid tw-grid-cols-12 tw-gap-3 tw-px-3">
            <div className="tw-col-span-12">
              <div className="tw-flex tw-gap-2 tw-w-auto tw-justify-end tw-mx-4 tw-my-3">
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

export default RelocateModel;
