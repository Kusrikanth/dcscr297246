import { useMemo } from "react";
import TableContainer from "../../../../Components/Common/TableContainer";
import { generateColumnsIssuedBooks, } from "./helper";
import { useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual } from "react-redux";

const RecentlyCirculatedBooks = () => {

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

  const columns = useMemo(() => generateColumnsIssuedBooks(), [getLibrarySummaryResp]);
  return (
    <div className="book-summary">
      <TableContainer
        columns={columns || []}
        data={getLibrarySummaryResp?.bookCirculationOverview?.recentCirculatedBooks}
        tableClass="tw-mb-0"
        divClass="tw-overflow-x-auto tw-max-h-[400px]"
        theadClass="tw-bg-gray-50 tw-text-gray-500 tw-align-middle tw-sticky tw-top-0"
        showPagination={false}
      />
    </div>
  );
};

export default RecentlyCirculatedBooks;
