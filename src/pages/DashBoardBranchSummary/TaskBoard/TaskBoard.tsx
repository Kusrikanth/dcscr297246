import React, { useEffect, useMemo, useState } from 'react';
import UpdatedHorizontalTab from '../../../Components/Common/UpdatedHorizontalTab';
import { default as AlarmBell } from "../../../assets/imagesdps/updatedDashboard/alarmBell.svg?react";
import { default as Time } from "../../../assets/imagesdps/updatedDashboard/time.svg?react";
import NoticeBoard from './NoticeBoard';
import UpcomingActivities from './UpcomingActivities';
import { useAppDispatch, useAppSelector } from '../../../hooks/storehook';
import { shallowEqual } from 'react-redux';
import { generateActionPayload } from '../../../utility/reduxutility';
import { getEventsListAct, resetEventsListAct } from '../../../store/academic/academicRequest/academicrequestactions';
import { getFeedsListAct } from '../../../store/communication/communicationactions';
import { transformedFeeds, transformEvents } from './helper';

interface IMenuOptions {
    id: string;
    labelName: string;
    customPadding: string;
    Icon: any;
}


const TaskBoard = () => {

    const [activeId, setActiveId] = useState<string>("upcomingActivities");
    const [currentPageSizeState, setCurrentPageSizeState] = useState(10);
    const [totalStudentCountState, setTotalStudentCountState] = useState(0);
    const dispatch = useAppDispatch();
    const eventsListApi = (otherProps?: any) => {
        const { pageSize, ...otherFilters } = otherProps || {};
        const { academicYearId } = academicYearListResp?.data?.find((year: any) => year.yearStatus.toLowerCase() === "current") || {};
        let payload = {
            instituteId: instituteId,
            branchId,
            academicYearId,
            ...otherFilters,
            pageNo: 0, pageSize: pageSize || currentPageSizeState,

        }
        if(branchId && academicYearId && activeId === "upcomingActivities") {
            dispatch(getEventsListAct(generateActionPayload("get_event_list", undefined, payload)));
        }
        else if(branchId && activeId === "Feed" && academicYearId) {
            dispatch(getFeedsListAct(generateActionPayload("get_feeds_list", undefined, payload)));
        }
    }

    const {
        academicYearListResp,
        currentInstIdResp: instituteId,
        currentBranchIdResp: branchId,
        showApiLoader,
        getEventsListResp,
        getFeedsListResp

    } =
        useAppSelector(({ appData, instAcademics, globalData,academicRequest }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            currentInstIdResp: appData.currentInstIdResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            showApiLoader: globalData.showApiLoader,
            getEventsListResp:academicRequest.getEventsListResp,
            getFeedsListResp: academicRequest.getFeedsListResp
        }), shallowEqual);

        
            useEffect(() => {
                if (branchId && Array.isArray(academicYearListResp?.data) && academicYearListResp.data.length > 0 ) {
                    setCurrentPageSizeState(10);
                    eventsListApi({ pageSize: 10 });
                    resetState();
                } else {
                    dispatch(resetEventsListAct(undefined));
                    resetState();
                }
            }, [activeId, branchId,instituteId , academicYearListResp]);    
        
             function resetState() {
                    setTotalStudentCountState(0);
                    setCurrentPageSizeState(10);
                    dispatch(resetEventsListAct(undefined));
                }
        
            useEffect(() => {

                if (activeId === "upcomingActivities") {
                    if(getEventsListResp){
                        setTotalStudentCountState(getEventsListResp?.totalElements|| 0);
                    }
                }
                else {
                    if (getFeedsListResp) {
                        setTotalStudentCountState(getFeedsListResp?.totalElements || 0);
                    }
                }             
                       
            }, [getEventsListResp, getFeedsListResp, activeId]);


    const MenuOptions: Array<IMenuOptions> = [
        {
            id: "upcomingActivities",
            labelName: "Current & Up Coming Activities",
            customPadding: "0px 5px 5px 5px",
            Icon: <AlarmBell width={"24px"} height={"24px"} className="me-2" fill={activeId === "upcomingActivities" ? "#0AB39C" : '#9599AD'} stroke={activeId === "upcomingActivities" ? "#0AB39C" : '#9599AD'} />
        },
        {
            id: "Feed",
            labelName: "Feeds",
            customPadding: "0px 5px 5px 5px",
            Icon: <Time width={"24px"} height={"24px"} className="me-2" fill={activeId === "noticeBoard" ? "#0AB39C" : '#9599AD'} stroke={activeId === "noticeBoard" ? "#0AB39C" : '#9599AD'}/>
        },
        
    ];
    function getActiveMenuComponent(menuId: string) {
        switch (menuId) {
            case "upcomingActivities":
                return UpcomingActivities;
            case "Feed":
                return NoticeBoard;
        }
    }

    function clickMenuHandler(event: React.MouseEvent<HTMLElement>) {
        const { currentTarget } = event,
        menuId = currentTarget.getAttribute("data-id");
        setActiveId(menuId || "");
    }

    function handleScroll(event: any) {
        const { scrollTop, scrollHeight, clientHeight } = event.target;        
      
        if (((scrollHeight - scrollTop) - clientHeight) <= 1) {
            const nextPageSize = currentPageSizeState + 10;
            if (currentPageSizeState >= totalStudentCountState) {
              return;
            }
          if (nextPageSize > totalStudentCountState) {
            setCurrentPageSizeState(totalStudentCountState);
            eventsListApi({ pageSize: totalStudentCountState });
          } else {
            setCurrentPageSizeState(nextPageSize);
            eventsListApi({ pageSize: nextPageSize });
          }
        }
      }


    const activeComponent = useMemo(() => {
        const TabComponent: any = getActiveMenuComponent(activeId);
        return (
            <TabComponent />
        );
    }, [activeId,branchId,instituteId]);

    const eventsFeeds = useMemo(() => {
        if (activeId === "upcomingActivities"){
            return transformEvents(getEventsListResp?.data) || [];
        }
        else {
            return transformedFeeds(getFeedsListResp?.data) || [];
        }
    }, [getEventsListResp, getFeedsListResp, activeId]);

    return (
        <>
            <div className='upcoming_events tw-mb-4'>
                <div className="tw-bg-white tw-rounded-lg tw-shadow-sm  tw-overflow-hidden tw-h-full card_height">
                    <div className="tw-px-3 tw-py-2 tw-pb-0 card-header">
                        <div className="tw-flex tw-items-center tw-gap-3">
                            <UpdatedHorizontalTab
                                MenuOptions={MenuOptions}
                                clickMenuHandler={clickMenuHandler}
                                activeTabId={activeId}
                                horizontalClass="ps-0"
                            />
                        </div>
                    </div>
                    { eventsFeeds?.length <= 0 ?
                    (<div className='card-body tw-flex tw-items-center tw-justify-center tw-text-center '>
                        <p>No Record Found</p>
                     </div>)
                     :
                        (<div className="card-body" style={{ zIndex: "1", height: "355px", overflowY: 'auto', overflowX: 'hidden', paddingTop: "23px" }} onScroll={handleScroll}>
                        <div className='row'>
                            {activeComponent}
                        </div>
                    </div>)}
                </div>
            </div>
        </>
    );
};

export default TaskBoard;
