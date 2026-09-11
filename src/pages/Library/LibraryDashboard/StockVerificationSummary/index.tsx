import { UncontrolledTooltip } from "reactstrap";
import ExportIcon from "../../../../assets/imagesdps/common_icon/export_icon.svg";
import { DateInput, ModalContainerUpdated, SelectInput } from "../../../../Components/Common";
import { libraryDataToRowData, menuData } from "./helper";
import React, { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { shallowEqual } from "react-redux";
import { getStockVerificationAct, resetStockVerificationAct } from "../../../../store/library/bookcollection/bookcollectionaction";
import { getLibraryDetailsListAct } from "../../../../store/library/settings/librarysettingsaction";
import { resetLibraryListAct } from "../../../../store/library/settings/librarysettingsslice";
import { useModal } from "../../../../hooks/modalhook";
import ExportModal from "../../../Directory/StudentManagement/ExportModal";
import { exportStockCheckingAct } from "../../../../store/library/stockDetails/stockdetailsaction";
import { toast } from "react-toastify";
import { downloadExcelFile } from "../../../../utility/commonutility";
import LibraryStockVerificationModel from "../../LibraryReports/LibraryStockVerificationModel";
import NoDataComp from "../../../../Components/Common/NoDataComp";

const initialValues = {
  libraryId: "",
  curriculumId: "",
};

const StockVerificationSummary = () => {
  const dispatch = useAppDispatch();
  const [filterState, setFilterState] = useState(initialValues);
  const [currentPageSizeState, setCurrentPageSizeState] = useState(10);
  const [totalStudentCountState, setTotalStudentCountState] = useState(0);
  const [isLoadingState, setIsLoadingState] = useState(false);
  const { closeModal: closeExportSectionModalHnldr, openModal: openExportSectionModalHnldr, modalState: exportSectionModalState } = useModal();
  const { closeModal: closeStockVerificationModal, openModal: openStockVerificationModal, modalState: stockVerificationModal } = useModal();
  
    
  const stockChickingListApiCall = (otherProps?: any) => {
    const { academicYearId } = academicYearListResp?.data?.find((year: any) => year.yearStatus.toLowerCase() === "current") || {};
    const { pageSize, ...otherFilters } = otherProps || {};

     let payload = {
       branchId,
       academicYearId,
      ...filterState,
       ...otherFilters,
      pageNo: 0, pageSize: pageSize || currentPageSizeState,

     };
     if(payload.academicYearId  ){
     dispatch(getStockVerificationAct(generateActionPayload("get_library_stock_details_list", undefined, payload)));
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

     const { currentBranchIdResp: branchId, currentInstIdResp: instituteId,
       academicYearListResp, getStockVerificationResp,
       libraryDetailsRequestListResp,
       exportStockCheckingResp
     } = useAppSelector(
       ({ instAcademics, appData, libraryBookCollection, librarysettings, stockChecking }) => ({
         academicYearListResp: instAcademics.academicYearListResp,
         currentBranchIdResp: appData.currentBranchIdResp,
         currentInstIdResp: appData.currentInstIdResp,
         getStockVerificationResp: libraryBookCollection.getStockVerificationResp,
         libraryDetailsRequestListResp: librarysettings.libraryDetailsRequestListResp,
         exportStockCheckingResp: stockChecking.exportStockCheckingResp
       }),
       shallowEqual
     );
     const stockCheckingRef = useRef({
         prevExportStockCheckingResp: exportStockCheckingResp,
       })
     
       useEffect(() => {
         const { prevExportStockCheckingResp } = stockCheckingRef.current;
     
         if (exportStockCheckingResp && prevExportStockCheckingResp !== exportStockCheckingResp) {
           toast.success("Stock Checking Data Download Successfully.");
           closeExportSectionModalHnldr();
           downloadExcelFile(exportStockCheckingResp, 'Stock_Verification')
         }
         stockCheckingRef.current.prevExportStockCheckingResp = exportStockCheckingResp;
       }, [exportStockCheckingResp])

    function resetState() {
        setTotalStudentCountState(0);
        setCurrentPageSizeState(10);
        dispatch(resetStockVerificationAct(undefined));
      }
  
    const filterStateForm = useFormik({
        enableReinitialize: true,
        initialValues: filterState,
        onSubmit: (values) => { },
    });

   useEffect(() => {
       if (getStockVerificationResp) {
         setTotalStudentCountState(getStockVerificationResp?.totalElements || 0);
       }
     }, [getStockVerificationResp]);

     useEffect(() => {
        if (branchId && academicYearListResp) {
          setCurrentPageSizeState(10);
          stockChickingListApiCall({ pageSize: 10 });
          libraryDetailsList();
          resetState();
        } else {
          dispatch(resetStockVerificationAct(undefined));
          resetState();
        }
      }, [branchId,instituteId, academicYearListResp]);

    const filterHandler = (event: any) => {
        const { name, value } = event.target;
        if (name === 'libraryId') {
          setFilterState((prev: any) => ({ ...prev, [name]: value }));
          const payload = { branchId: branchId, libraryId: value, orderBy: "asc", pageNo: 0, pageSize: 100 };
          stockChickingListApiCall({ [name]: value })
        } 
    }
    

    function handleScroll(event: React.UIEvent<HTMLElement>) {
        const target = event.currentTarget as HTMLElement;
        const { scrollTop, scrollHeight, clientHeight } = target;
    
        if (((scrollHeight - scrollTop) - clientHeight) <= 1) {
          const nextPageSize = currentPageSizeState + 10;
          if (currentPageSizeState >= totalStudentCountState) {
            return;
          }
          if (nextPageSize > totalStudentCountState) {
            setCurrentPageSizeState(totalStudentCountState);
            stockChickingListApiCall({ pageSize: totalStudentCountState });
          } else {
            setCurrentPageSizeState(nextPageSize);
            stockChickingListApiCall({ pageSize: nextPageSize });
          }
          setIsLoadingState(true)
        }
      }
       function submitExportHndlr() {
          const { academicYearId } = academicYearListResp?.data?.find((year: any) => year.yearStatus.toLowerCase() === "current") || {};
          dispatch(exportStockCheckingAct(generateActionPayload("export_library_stock_details_collection", undefined, { ...filterState, branchId, instituteId, academicYearId }, {
                responseType: 'blob'
              })));
        }
    
      const rowData = libraryDataToRowData(getStockVerificationResp?.content) || []

  return (
    <div
      className="tw-bg-white tw-rounded-lg tw-overflow-hidden section-count-card tw-min-h-[420px]"
    >
      <div className="tw-py-3 tw-px-4 tw-border-b">
        <div className="tw-grid tw-grid-cols-12 tw-items-center tw-gap-2">
          <div className="tw-col-span-6">
            <h4 className="tw-text-base tw-font-semibold tw-mb-0 tw-flex-grow">
              Stock Verification Summary
            </h4>
          </div>
          <div className="tw-col-span-5 tw-ml-auto tw-pr-0">
            <SelectInput
              name="libraryId"
              value={filterStateForm.values.libraryId}
              onChange={filterHandler}
              menuItems={libraryDetailsRequestListResp?.content || []}
              valueKey="id"
              textKey="libraryName"
              formgroupClassName="tw-mb-0"
              labelText="Library Name"
              floatingLabel
            />
          </div>
          <div className="tw-col-span-auto">
            <div className="tw-flex tw-items-center">
              <button
                id="export-btn"
                className="tw-rounded-full tw-bg-sky-100 tw-p-2"
                onClick={openExportSectionModalHnldr}
              >
                <img src={ExportIcon} className="tw-h-full tw-w-auto" />
                <UncontrolledTooltip placement="bottom" target="export-btn">
                  Export
                </UncontrolledTooltip>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="tw-px-0 tw-pt-0 tw-pb-2">
        <div className="tw-hidden tw-border-b tw-pb-2 tw-w-full tw-mx-auto"></div>
        <div className="tw-py-1 tw-px-0 tw-m-0">
          <div className="tw-grid tw-grid-cols-4 tw-border-b tw-py-2 tw-px-4 tw-w-full">
            <p className="tw-font-bold tw-mb-0 tw-text-gray-500 tw-truncate">Room Name</p>
            <p className="tw-font-bold tw-mb-0 tw-text-gray-500 tw-truncate">Shelf Name</p>
            <p className="tw-font-bold tw-mb-0 tw-text-gray-500 tw-text-center tw-truncate">
              Rack
            </p>
            <p className="tw-font-bold tw-mb-0 tw-text-gray-500 tw-text-center tw-truncate">
              No.of Books
            </p>
          </div>
          {rowData?.length > 0 ? (
            <div
              className="tw-w-full tw-overflow-y-auto tw-overflow-x-hidden tw-min-h-[100px] tw-px-4 tw-max-h-[375px]"
              onScroll={handleScroll}
              style={{ scrollbarWidth: "thin" }}
            >
              <div className="tw-p-0">
                {rowData.map((row: any, index: any) => (
                  <div
                    key={index}
                    className="tw-grid tw-grid-cols-4 tw-items-center tw-gap-2 tw-py-2 tw-px-4 tw-my-1 tw-border-b"
                    style={{ borderLeft: `4px solid ${row.borderColor}` }}
                  >
                    <p className="tw-truncate">{row.roomName}</p>

                    <p className="tw-truncate">{row.shelfName}</p>

                    <p className="tw-text-center tw-truncate">{row.rackName}</p>

                    <p
                      className="tw-text-center tw-text-sky-500 tw-underline tw-cursor-pointer tw-truncate"
                      onClick={() => openStockVerificationModal(row)}
                    >
                      {row.numberOfVerifiedBooks || "0"}/
                      {row.numberOfTotalBooks || "0"}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="tw-flex tw-items-center tw-justify-center tw-text-center tw-h-[375px]">
              <NoDataComp />
            </div>
          )}
        </div>
      </div>
      <ModalContainerUpdated
        id="export-stock-verification-modal"
        isOpen={exportSectionModalState.showModal}
        toggle={closeExportSectionModalHnldr}
        modalTitle="Export Stock Verification Summary"
        modalSize="md"
      >
        <ExportModal
          isOpen={exportSectionModalState.showModal}
          toggle={closeExportSectionModalHnldr}
          instituteId={instituteId}
          branchId={branchId}
          submitHndlr={submitExportHndlr}
          feature="library"
          subFeature="library_stock_verification"
          remarksText="Enter remarks to export stock verification summary?"
        />
      </ModalContainerUpdated>
      <ModalContainerUpdated
        id="detensions-or-promotions"
        isOpen={stockVerificationModal.showModal}
        toggle={closeStockVerificationModal}
        modalTitle="Stock Verification"
        modalSize="xl"
      >
        <LibraryStockVerificationModel
          isOpen={stockVerificationModal.showModal}
          toggle={closeStockVerificationModal}
          modalTitle="Stock Verification"
          modalData={stockVerificationModal.modalData}
        />
      </ModalContainerUpdated>
    </div>

  );
};

export default StockVerificationSummary;
