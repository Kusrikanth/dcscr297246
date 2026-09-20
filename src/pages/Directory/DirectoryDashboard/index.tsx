import React from 'react'
import BreadCrumb from '../../../Components/Common/BreadCrumb'
import SchoolStrengthStatistics from './Statistics'
import { useAppSelector } from '../../../hooks/storehook';
import { shallowEqual } from 'react-redux';
import AcademicYearWiseTotal from './AcademicYearWiseTotal';
import AttandanceReport from './AttendanceReport/AttandanceReport';
import StrengthBarView from './StrengthBarView';
import SectionWiseLanguage from './SectionWiseLanguage';
import StudentStatusAnalysis from './StudentStatusAnalysis';
import StudentSectionCount from '../../DashBoardBranchSummary/StudentCountSectionWise/StudentSectionCount';

const DirectoryDashboard = () => {

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
  return (
    <div className="page-content branch_dashboard_wrapper transportaion_dashboard_wrapper">
      <div className="container-fluid">
        <BreadCrumb title="Dashboard" pageTitle="Directory" />

        <div className="tw-grid tw-grid-cols-12 tw-gap-4 tw-mt-0">

          <div className="tw-col-span-12">
              <SchoolStrengthStatistics />
          </div>

          <div className="tw-col-span-12">
              <StudentStatusAnalysis />
          </div>

          <div className="tw-col-span-12">
              <AcademicYearWiseTotal />
           
          </div>

          <div className="tw-col-span-12 xl:tw-col-span-6 tw-grid">
              <AttandanceReport />
          </div>

          <div className="tw-col-span-12 xl:tw-col-span-6 tw-grid">
              <StudentSectionCount />
          </div>

          <div className="tw-col-span-12">
              <StrengthBarView />
          </div>

          <div className="tw-col-span-12">
              <SectionWiseLanguage />
          </div>
        </div>
      </div>
    </div>
  )
}

export default DirectoryDashboard