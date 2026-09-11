import { useMemo } from "react";
import TableContainer from "../../../../Components/Common/TableContainer";
import { generateColumnsibraryBooksSummary,  transformLibraryData } from "./helper";
import { useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual } from "react-redux";

const LibraryBookSummary = () => {

    const { currentBranchIdResp: branchId, currentInstIdResp: instituteId,
        academicYearListResp, getLibrarySummaryResp
      } = useAppSelector(
        ({ instAcademics, appData, libraryBookCollection }) => ({
          academicYearListResp: instAcademics.academicYearListResp,
          currentBranchIdResp: appData.currentBranchIdResp,
          currentInstIdResp: appData.currentInstIdResp,
          getLibrarySummaryResp: libraryBookCollection.getLibrarySummaryResp,
        }),
        shallowEqual
      );
  const tableColumns = useMemo(() => transformLibraryData(getLibrarySummaryResp?.bookCirculationOverview?.libraryBooksSummary), [getLibrarySummaryResp]);
  
  const rowData = useMemo(()=>generateColumnsibraryBooksSummary(),[getLibrarySummaryResp])
  

  return (
    <div className="book-summary">
      <TableContainer
        columns={rowData || []}
        data={tableColumns || []}
        tableClass="tw-mb-0"
        divClass="tw-overflow-x-auto tw-max-h-[400px]"
        theadClass="tw-bg-gray-50 tw-text-gray-500 tw-align-middle tw-sticky tw-top-0"
        tfootClass="tw-sticky tw-bottom-0 tw-bg-white"
        showPagination={false}
        showFooter={true}
      ></TableContainer>
    </div>
  );
};

export default LibraryBookSummary;
