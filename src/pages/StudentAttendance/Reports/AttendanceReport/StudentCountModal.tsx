import React, { useEffect, useMemo, useRef } from 'react'
import TableContainer from '../../../../Components/Common/TableContainer'
import { generateColumnsForStuCount } from './helper';
import { useAppSelector } from '../../../../hooks/storehook';
import { shallowEqual, useDispatch } from 'react-redux';
import { IPaginationState } from '../../../../Components/Common/Pagination';
import { getStuDailyAttListAct } from '../../../../store/StudentAttendance/DailyAttendance/dailyattendanceaction';
import { generateActionPayload } from '../../../../utility/reduxutility';

const StudentCountModal = (props:any) => {

    const dispatch = useDispatch();
    const pagination = useRef({
        pageNo: 0,
        pageSize: 100
    })

    const {
        getStuDailyAttListResp,
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
    } = useAppSelector(
        ({ dailyAttendance,appData }) => ({
            getStuDailyAttListResp:dailyAttendance.getStuDailyAttListResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
        }),
        shallowEqual
    );

    useEffect(() => {
      if(props?.modalData){
        const { academicYearId, curriculumId, classId,sectionId,date,attendance } = props.modalData || {}
        const payload = {academicYearId, curriculumId, classId,sectionId,date : date?.slice(0,10) , attendance}
        StudentAttendanceList(payload)
      }
      
    }, [])
    

    const StudentAttendanceList = ( otherProps?: any) => {
        const { academicYearId, curriculumId, classId,sectionId,date,attendance } = props.modalData || {};
        let payload = {
            academicYearId,
            curriculumId,
            instituteId,
            branchId,
            classId,
            sectionId,
            attendance,
            date : date?.slice(0,10) ,
            ...pagination.current ,
            ...otherProps,
        };
        if(payload.academicYearId  ){
            dispatch(getStuDailyAttListAct(generateActionPayload('get_daily_att_list', undefined, payload)))
        }
    }

    function paginationHndlr(paginationInfo: IPaginationState) {
        pagination.current = paginationInfo;
        StudentAttendanceList(paginationInfo)
        // getSectionListResp(paginationInfo);
    }

    const roleColumns = useMemo(() => generateColumnsForStuCount(), []);

    const { content: studentResp,totalElements,totalPages,pageble } = getStuDailyAttListResp || {}

    return (
        <>
            <div className='tw-pb-4'>
                <TableContainer
                    columns={roleColumns || []}
                    data={getStuDailyAttListResp?.content || []}
                    divClass="tw-overflow-x-auto tw-mb-3"
                    theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
                    // showCheckbox={true}
                    showPagination={false}
                    // totalPages={totalPages || 0}
                    // totalRecords={totalElements || 0}
                    // callbackPaginationHndlr={paginationHndlr}
                    // currentPageNumber={pageble?.pageNumber || 0}
                />

            </div>
        </>
    )
}

export default StudentCountModal