import BreadCrumb from "../../../Components/Common/BreadCrumb";
import LibraryStats from "./LibraryStats";
import BookCirculationAnalysis from "./BookCirculationAnalysis";
import LanguageDetails from "./LanguageDetails";
import LibrarySummary from "./LibrarySummary";
import BookStatusSummary from "./BookStatusSummary";
import StockVerificationSummary from "./StockVerificationSummary";
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
import { generateActionPayload } from "../../../utility/reduxutility";
import { getLibraryDashboardDataAct } from "../../../store/library/bookcollection/bookcollectionaction";
import { shallowEqual } from "react-redux";
import { useEffect, useRef } from "react";
import { toast } from "react-toastify";
import BookCategory from "./BookCategory";
import { getBranchCardAnalysisAct } from "../../../store/FrontDesk/AdmissionManagment/applicationmanagmentaction";

const LibraryDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const libraryDashboardStatsApiCall = (otherProps?: any) => {
    const { academicYearId } = academicYearListResp?.data?.find((year: any) => year.yearStatus.toLowerCase() === "current") || {};

    let payload = {
      branchId,
      instituteId,
      academicYearId,
      ...otherProps,
    };
    dispatch(getLibraryDashboardDataAct(generateActionPayload('library_dashboard_data', undefined, payload)))
  }

  const { currentBranchIdResp: branchId, currentInstIdResp: instituteId,
    academicYearListResp, getLibraryDashboardDataResp, libraryBookCollectionErrorAct,
    stockCheckingErrorAct
  } = useAppSelector(
    ({ instAcademics, appData, libraryBookCollection, stockChecking }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      getLibraryDashboardDataResp: libraryBookCollection.getLibraryDashboardDataResp,
      libraryBookCollectionErrorAct: libraryBookCollection.libraryBookCollectionErrorAct,
      stockCheckingErrorAct: stockChecking.stockCheckingErrorAct,


    }),
    shallowEqual
  );

  const libraryDashboardRef = useRef({
    prevLibraryBookCollectionErrorResp: libraryBookCollectionErrorAct,
    prevStockCheckingErrorAct: stockCheckingErrorAct,
  })

  useEffect(() => {
    const { prevLibraryBookCollectionErrorResp, prevStockCheckingErrorAct } = libraryDashboardRef.current;

    if (libraryBookCollectionErrorAct && prevLibraryBookCollectionErrorResp !== libraryBookCollectionErrorAct) {
      const { details } = libraryBookCollectionErrorAct;
      toast.error(details || "Something went wrong");
    }
    else if (stockCheckingErrorAct && prevStockCheckingErrorAct !== stockCheckingErrorAct) {
      const { details } = stockCheckingErrorAct;
      toast.error(details || "Something went wrong");
    }

    libraryDashboardRef.current.prevLibraryBookCollectionErrorResp = libraryBookCollectionErrorAct;
    libraryDashboardRef.current.prevStockCheckingErrorAct = stockCheckingErrorAct;
  }, [libraryBookCollectionErrorAct, stockCheckingErrorAct]);
 
  const getCurriculumApiCall = (otherProps?: any) => {
      const payload1 = { branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" , ...otherProps };
      dispatch(getBranchCardAnalysisAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
  }


  useEffect(() => {
    libraryDashboardStatsApiCall();
    getCurriculumApiCall();
  }, [branchId, instituteId]);

  return (
    <div className="page-content branch_dashboard_wrapper transportaion_dashboard_wrapper">
      <div className="container-fluid">
        <BreadCrumb title="Dashboard" pageTitle="Library" />
        <div className="tw-grid tw-grid-cols-1 tw-gap-4">
          <div className="tw-col-span-1">
            <LibraryStats />
          </div>
          <div className="tw-grid tw-grid-cols-1 xl:tw-grid-cols-2 tw-gap-4">
            <StockVerificationSummary />
            <LanguageDetails />
          </div>
          <div className="tw-col-span-1">
            <BookCategory />
          </div>
          <div className="tw-col-span-1">
            <BookCirculationAnalysis />
          </div>
          <div className="tw-grid tw-grid-cols-1 xl:tw-grid-cols-12 tw-gap-4">
            <div className="xl:tw-col-span-4 2xl:tw-col-span-3">
              <BookStatusSummary />
            </div>
            <div className="xl:tw-col-span-8 2xl:tw-col-span-9">
              <LibrarySummary />
            </div>
          </div>
        </div>
      </div>
    </div>
    );
};

export default LibraryDashboard;
