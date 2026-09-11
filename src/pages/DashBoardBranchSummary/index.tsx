import React, { useEffect } from 'react'
import AcademicYearWiseTotal from './AcademicYearWiseTotal'
import QuickLinks from './QuickLinks/QuickLinks'
import UpcomingEvents from './UpcomingEvents/UpcomingEvents'
import AttandanceReport from './AttendanceReport/AttandanceReport'
import UsersByDevices from './UsersByDevices/UsersByDevices'
import StudentSectionCount from './StudentCountSectionWise/StudentSectionCount'
import TaskBoard from './TaskBoard/TaskBoard'
import BreadCrumb from '../../Components/Common/BreadCrumb'
import boy from "../../assets/imagesdps/updatedDashboard/boy.svg";
import girl from "../../assets/imagesdps/updatedDashboard/girl.svg";
import coins from "../../assets/imagesdps/updatedDashboard/due.svg";
import money from "../../assets/imagesdps/updatedDashboard/fee.svg";
import school from "../../assets/imagesdps/updatedDashboard/school.svg";
import world from "../../assets/imagesdps/updatedDashboard/online.svg";
import teaching from "../../assets/imagesdps/updatedDashboard/teaching.svg";
import nonTeaching from "../../assets/imagesdps/updatedDashboard/nonteaching.svg";
import CommonCard from '../UpdatedDashboard/CommonCard'
import { useAppDispatch, useAppSelector } from '../../hooks/storehook'
import { generateActionPayload } from '../../utility/reduxutility'
import { getBranchDashboardStatsAct } from '../../store/academic/academicRequest/academicrequestactions'
import { shallowEqual } from 'react-redux'
import { toast } from 'react-toastify'
import SectionWiseLanguage from './SectionWiseLanguage'
import ClassByBranchStatus from './ClassByBranchStatus'
import ClassWiseAnalysis from './ClassWiseAnalysis'

const BranchSummaryDashboard = () => {
  const dispatch = useAppDispatch();
  const BranchDashboardStatsApiCall = ( otherProps?: any) => {
    const { academicYearId } = academicYearListResp?.data?.find((year: any) => year.yearStatus.toLowerCase() === "current") || {};
    let payload = {
        branchId,
        instituteId,
        academicYearId,
        ...otherProps,
    };
        dispatch(getBranchDashboardStatsAct(generateActionPayload('get_branch_dashboard_stats', undefined, payload)))
}

  const { currentBranchIdResp: branchId,currentInstIdResp: instituteId,
    getBranchDashboardStatsResp,academicYearListResp,academicRequestErrorResp
  } = useAppSelector(
    ({ appData, academicRequest, instAcademics }) => ({
      currentBranchIdResp:appData.currentBranchIdResp,
      currentInstIdResp:appData.currentInstIdResp,
      getBranchDashboardStatsResp:academicRequest.getBranchDashboardStatsResp,
      academicYearListResp: instAcademics.academicYearListResp,
      academicRequestErrorResp:academicRequest.academicRequestErrorResp
    }),
    shallowEqual
  );
      const branchDashboardRef = React.useRef({
        prevAcademicRequestErrorResp : academicRequestErrorResp,
      });
  
      useEffect(() => {
        const { prevAcademicRequestErrorResp } = branchDashboardRef.current;
  
        if (academicRequestErrorResp && prevAcademicRequestErrorResp !== academicRequestErrorResp) {
            const { details } = academicRequestErrorResp || {}
            toast.error(details || "Something went wrong");
        }
  
        branchDashboardRef.current.prevAcademicRequestErrorResp = academicRequestErrorResp;
      }, [academicRequestErrorResp])
      

  useEffect(() => {
    if (Array.isArray(academicYearListResp?.data) && academicYearListResp.data.length > 0){
      BranchDashboardStatsApiCall();
    }
  }, [branchId,instituteId,academicYearListResp]);
  const commonCardConfig = [
    {
      cardMainText: "Students Count",
      curriculumIndex: "studentsCount",
      cardLeftText : "Boys",
      cardRightText : "Girls",
      cardLeftIcon : boy,
      cardRightIcon : girl
      
    },
    {
      cardMainText: "Staff Count",
      curriculumIndex: "staffCount",
      cardLeftText : "Teaching",
      cardRightText : "Non-Teaching",
      cardLeftIcon : teaching,
      cardRightIcon : nonTeaching
     
    },
    {
      cardMainText: "New Admissions",
      curriculumIndex: "newAdmissions",
      cardLeftText : "At School",
      cardRightText : "Online",
      cardLeftIcon : school,
      cardRightIcon : world
    
    },
    {
      cardMainText: "Total Fee Receivable",
      curriculumIndex: "TotalFee",
      cardLeftText : "Fee Due",
      cardRightText : "Fee Collected",
      cardLeftIcon : coins,
      cardRightIcon : money
      
    },
  ];
  return (
    <>
      <div className="page-content branch_dashboard_wrapper">
        <div className="container-fluid">
          <BreadCrumb title="Dashboard" pageTitle="DPS" />

          <div className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-2 2xl:tw-grid-cols-4 tw-gap-4">
            {commonCardConfig?.map((item, index) => {
              const data = getBranchDashboardStatsResp?.[item.curriculumIndex] || {};
              const cardLeftAmount = data.MALE || data.teaching || data.feeDue || data.OFFLINE || 0;
              const cardRightAmount = data.FEMALE || data.nonTeaching || data.feeCollected || data.ONLINE || 0;
              const total = cardLeftAmount + cardRightAmount;
              const amountLeftPercentage = total ? Math.round((cardLeftAmount / total) * 100) : 0;
              const amountRightPercentage = total ? Math.round((cardRightAmount / total) * 100) : 0;
                      
            return (
                <div key={index} className="tw-w-full">
                  <CommonCard
                    cardMainText={item.cardMainText}
                    cardMainAmount={total}
                    cardLeftText={item.cardLeftText}
                    cardRightText={item.cardRightText}
                    cardLeftAmount={cardLeftAmount}
                    cardRightAmount={cardRightAmount}
                    cardLeftIcon={item.cardLeftIcon}
                    cardRightIcon={item.cardRightIcon}
                    amountLeftPercentage={amountLeftPercentage}
                    amountRightPercentage={amountRightPercentage}
                  />
                </div>
              );
            })}
          </div>

          <div className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-12 tw-gap-4 tw-mt-4">

            <div className="lg:tw-col-span-12 xl:tw-col-span-9 tw-grid">
              <AcademicYearWiseTotal />
            </div>

            <div className="lg:tw-col-span-12 xl:tw-col-span-3 tw-grid">
              <AttandanceReport />
            </div>

            <div className="lg:tw-col-span-6 xl:tw-col-span-4 tw-grid">
              <StudentSectionCount />
            </div>

            <div className="lg:tw-col-span-6 xl:tw-col-span-4 tw-grid">
              <UsersByDevices />
            </div>

            <div className="lg:tw-col-span-12 xl:tw-col-span-4 tw-grid">
              <QuickLinks />
            </div>

            <div className="lg:tw-col-span-12 xl:tw-col-span-12">
              <ClassWiseAnalysis />
            </div>

            <div className="lg:tw-col-span-12 xl:tw-col-span-8 ">
              <SectionWiseLanguage />
            </div>

            <div className="lg:tw-col-span-12 xl:tw-col-span-4 ">
              <ClassByBranchStatus />
            </div>

            <div className="lg:tw-col-span-6 xl:tw-col-span-6">
              <UpcomingEvents />
            </div>

            <div className="lg:tw-col-span-6 xl:tw-col-span-6">
              <TaskBoard />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default BranchSummaryDashboard
