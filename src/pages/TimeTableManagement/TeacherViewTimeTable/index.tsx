import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from '@fullcalendar/list';
import interactionPlugin from "@fullcalendar/interaction";
import React, { useEffect, useRef, useState } from 'react'
import BootstrapTheme from "@fullcalendar/bootstrap";
import timeGridPlugin from '@fullcalendar/timegrid'
import { startOfWeek, addDays, setHours, setMinutes } from 'date-fns';
import "./fullcalendar.scss";
import { shallowEqual } from 'react-redux';
import { useAppDispatch, useAppSelector } from '../../../hooks/storehook';
import { toast } from 'react-toastify';
import { getWeeksAct, viewTeacherTimeTableAct } from '../../../store/academic/timetableManagment/timetableManagmentactions';
import { generateActionPayload } from '../../../utility/reduxutility';

const TeacherViewTimeTable = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [weekDayMap, setWeekDayMap] = useState<Record<string, number>>({});

  const dispatch = useAppDispatch();

  const {
      viewTimeTableResp,
      currentBranchIdResp: branchId,
      getTimeTableErrResp,
      userMeResp,
      viewTeacherTimeTableResp,
      getWeeksResp
    } = useAppSelector(
      ({ timeTableManagement, appData, login }) => ({
        viewTimeTableResp: timeTableManagement.viewTimeTableResp,
        currentBranchIdResp: appData.currentBranchIdResp,
        getTimeTableErrResp : timeTableManagement.getTimeTableErrResp,
        userMeResp: login.userMeResp,
        viewTeacherTimeTableResp: timeTableManagement.viewTeacherTimeTableResp,
        getWeeksResp: timeTableManagement.getWeeksResp,
      }),
      shallowEqual
    );
    
  const newRequestRespRef = useRef({
    prevGetTimeTableErrResp: getTimeTableErrResp,
  });
    
  useEffect(() => {
    const { prevGetTimeTableErrResp } = newRequestRespRef.current;
    if (getTimeTableErrResp && prevGetTimeTableErrResp !== getTimeTableErrResp) {
      const { details } = getTimeTableErrResp;
      toast.error(details || "Something went wrong. Please try again later.");
    }
    newRequestRespRef.current.prevGetTimeTableErrResp = getTimeTableErrResp;
  }, [getTimeTableErrResp]);

  useEffect(() => {
    if (getWeeksResp?.daysInWeekDtos?.length > 0) {
      const map: Record<string, number> = {};
      getWeeksResp?.daysInWeekDtos.forEach((day) => {
        map[day.weekId] = day.id - 1;
      });
      setWeekDayMap(map);
    }
  }, [getWeeksResp]);

  useEffect(() => {
    if (viewTeacherTimeTableResp && Object.keys(weekDayMap).length > 0) {
      const scheduleData = viewTeacherTimeTableResp;
      const processedEvents: any[] = [];
      const currentDate = new Date();
      const mondayDate = startOfWeek(currentDate, { weekStartsOn: 1 });
  
      Object.entries(scheduleData.dayWeek).forEach(([weekKey, periods]) => {
        const dayOffset = weekDayMap[weekKey]; 
        const eventDate = addDays(mondayDate, dayOffset);
  
        (periods as any[]).forEach(period => {
          const startParts = period.startTime.split('T')[1].split(':');
          const endParts = period.endTime.split('T')[1].split(':');
  
          const startDate = setMinutes(setHours(eventDate, parseInt(startParts[0])), parseInt(startParts[1]));
          const endDate = setMinutes(setHours(eventDate, parseInt(endParts[0])), parseInt(endParts[1]));
          const hue = Math.floor(Math.random() * 360);
          const backgroundColor = `hsla(${hue}, 70%, 80%, 0.8)`;
          const borderColor = `hsla(${hue}, 70%, 60%, 1)`;
  
          processedEvents.push({
            id: period.id.toString(),
            title: period.subjectName,
            extendedProps: {
              sectionName: period.sectionName,
              curriculumName: period.curriculumName,
              className: period.className,
              
            },
            start: startDate.toISOString(),
            end: endDate.toISOString(),
            backgroundColor: backgroundColor,
            borderColor: borderColor,
            textColor: '#333'
          });
        });
      });
  
      setEvents(processedEvents);
    }
  }, [viewTeacherTimeTableResp, weekDayMap]);
      
  useEffect(() => {
    if(userMeResp){
      dispatch(viewTeacherTimeTableAct(generateActionPayload("view_teacher_timetable", {id: userMeResp?.loggedInUserInformation?.id}, undefined)));
      dispatch(getWeeksAct(generateActionPayload("get_weeks", undefined, undefined)));
    }
  }, [userMeResp]);


const renderEventContent = (eventInfo) => {
  return (
    <div className="tw-p-1 tw-h-full tw-flex tw-flex-col tw-justify-center  tw-overflow-hidden">
      <div className="tw-font-semibold tw-text-[12px] tw-leading-[0.7rem] tw-mb-1 tw-truncate">
        {eventInfo.event.title}
      </div>
      <div className="tw-text-xs tw-opacity-90 tw-truncate">
        {`${eventInfo.event.extendedProps.curriculumName} (${eventInfo.event.extendedProps.sectionName})`}
      </div>
      
    </div>
  );
};
  return (
    <div className='tw-w-full tw-flex tw-items-center tw-justify-center tw-my-16'>
      <div className="tw-flex tw-flex-col tw-w-full tw-max-w-7xl tw-mx-auto">
        <div className="tw-w-full tw-p-4">
          <div className="tw-bg-white tw-rounded-lg tw-shadow-lg tw-p-4 tw-mx-auto">
            <h2 className="tw-text-xl tw-font-bold tw-mb-4 tw-text-center">Teacher's Weekly Schedule</h2>
            <FullCalendar
              plugins={[
                BootstrapTheme,
                dayGridPlugin,
                listPlugin,
                interactionPlugin,
                timeGridPlugin,
              ]}
              initialView="timeGridWeek"
              slotDuration={"00:30:00"}
              handleWindowResize={true}
              headerToolbar={false}
              themeSystem="bootstrap"
              editable={false}
              selectable={false}
              droppable={false}
              timeZone="local"
              hiddenDays={[0]}
              dayHeaderFormat={{ weekday: 'long' }}
              events={events}
              eventContent={renderEventContent}
              height="auto"
              contentHeight={700}
               stickyHeaderDates={true}
              dayHeaderClassNames="tw-font-bold tw-text-gray-800 tw-text-base tw-py-2 tw-sticky tw-top-0 tw-bg-white tw-z-10"
              slotLabelClassNames="tw-font-medium tw-text-gray-600"
              eventClassNames="tw-rounded-md tw-shadow-sm"
              nowIndicator={true}
              nowIndicatorClassNames="[&_.fc-timegrid-now-indicator-line]:!tw-border-[#2563eb] [&_.fc-timegrid-now-indicator-line]:!tw-border-l-[3px]"
              allDaySlot={false}
              eventOverlap={false}
              slotEventOverlap={false}
              slotMinTime="08:00:00"
              slotMaxTime="18:00:00"
              eventDidMount={(info) => {
                const { title, extendedProps, start, end } = info.event;
                const startTime = start?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) ?? '';
                const endTime = end?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) ?? '';
                
                // Create tooltip element
                const tooltip = document.createElement('div');
                tooltip.className = 'custom-tooltip';
                tooltip.innerHTML = `
                  <strong><u>${title}</u></strong><br/>
                  <b>Curriculum:</b> ${extendedProps.curriculumName}<br/>
                  <b>Class:</b> ${extendedProps.className}<br/>
                  <b>Section:</b> ${extendedProps.sectionName}<br/>
                  <b>Time:</b> ${startTime} - ${endTime}
                `;

                // Initially hidden
                tooltip.style.position = 'absolute';
                tooltip.style.zIndex = '1000';
                tooltip.style.background = '#fff';
                tooltip.style.border = '1px solid #ccc';
                tooltip.style.padding = '6px 10px';
                tooltip.style.borderRadius = '6px';
                tooltip.style.boxShadow = '0px 2px 6px rgba(0,0,0,0.15)';
                tooltip.style.whiteSpace = 'nowrap';
                tooltip.style.fontSize = '12px';
                tooltip.style.display = 'none';

                document.body.appendChild(tooltip);

                // Mouse enter - show tooltip
                info.el.addEventListener('mouseenter', (e) => {
                  tooltip.style.display = 'block';
                });

                // Mouse move - position tooltip
                info.el.addEventListener('mousemove', (e) => {
                  tooltip.style.left = `${e.pageX + 10}px`;
                  tooltip.style.top = `${e.pageY + 10}px`;
                });

                // Mouse leave - hide tooltip
                info.el.addEventListener('mouseleave', () => {
                  tooltip.style.display = 'none';
                });
              }}
              // Business hours
              // businessHours={{
              //   daysOfWeek: [1, 2, 3, 4, 5, 6],
              //   startTime: '08:00',
              //   endTime: '17:00',
              // }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default TeacherViewTimeTable