import React , {useEffect} from 'react'
import { Container } from 'reactstrap'
import BreadCrumb from '../../../Components/Common/BreadCrumb'
import ClassStories from './ClassStories'
import HomeWork from './HomeWork'
import Messages from './Messages'
import PerformanceSummary from './PerformanceSummary'
import StudentFeeDetails from './StudentFeeDetails'
import UpcomingEvent from './UpcomingEvent'
import { useAppDispatch, useAppSelector } from '../../../hooks/storehook'
import { shallowEqual } from 'react-redux'
import { generateActionPayload } from '../../../utility/reduxutility'
import { getParentChildrensAct } from '../../../store/directory/studentmanagement/studentmanagementactions'

const ParentDashboard = () => {

    const dispatch = useAppDispatch()

    const { getStudentByIdResp, 
        currentInstIdResp: instituteId,
        currentBranchIdResp: branchId,userMeResp,parentChildrensResp } = useAppSelector(
            ({ directoryStudent, appData, branchAcademics,classroomManagmentInfo,login }) => ({
                getStudentByIdResp: directoryStudent.getStudentByIdResp,
                currentInstIdResp: appData.currentInstIdResp,
                currentBranchIdResp: appData.currentBranchIdResp,
                parentChildrensResp:directoryStudent.parentChildrensResp,
                userMeResp:login.userMeResp,

            }),
            shallowEqual
        );
    

useEffect(() => {
    const params = {
       parentId: userMeResp?.loggedInUserInformation?.id, instituteId, branchId, academicYearId : 10
    };
    dispatch(getParentChildrensAct(generateActionPayload("get_parent_childrens", undefined, params)));
}, [])
    return (
        <div className="page-content">
            <Container fluid>
                <BreadCrumb title="Dashboard" pageTitle="Parent" />
                <div className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-12 tw-gap-4 tw-mb-4">
                    <div className="lg:tw-col-span-3 tw-space-y-4">
                        <StudentFeeDetails />
                        <HomeWork />
                    </div>
                    <div className="lg:tw-col-span-4 tw-space-y-4">
                        <PerformanceSummary />
                        <ClassStories />
                    </div>
                    <div className="lg:tw-col-span-5 tw-space-y-4">
                        <UpcomingEvent />
                        <Messages />
                    </div>

                </div>
            </Container>
        </div>
    )
}

export default ParentDashboard
