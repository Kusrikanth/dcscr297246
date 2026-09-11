import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from '@fullcalendar/list';
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import React, { useEffect, useState } from 'react'
import BootstrapTheme from "@fullcalendar/bootstrap";
import timeGridPlugin from '@fullcalendar/timegrid'
import { useModal } from '../../../hooks/modalhook';
import { ModalContainerUpdated, Button } from '../../../Components/Common';
import BreadCrumb from '../../../Components/Common/BreadCrumb';
import "./fullcalendar.scss";
import { nanoid } from 'nanoid';
import { HugeiconsIcon } from '@hugeicons/react';
import { PencilEdit02Icon } from '@hugeicons-pro/core-stroke-standard';
import AddEditEventModal from './AddEditEventModal';
import { getColorName, getEventColors } from './helper';

interface Event {
  id: string;
  title: string;
  start: string;
  end: string;
}
const CalendarSummary = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedNewDay, setSelectedNewDay] = useState();
  const [eventData, setEventData] = useState<any>({});
  const {modalState: addNewState,closeModal: closeAddNewStateHndlr,openModal: openAddNewStateHndlr,} = useModal();
  const toggle = () => {};
  const handleDateClick = (arg: any) => {
    const date = arg["date"];
    setEventData({});
    setSelectedNewDay(date);
    openAddNewStateHndlr();
    toggle();
  };
  const handleEventClick = (arg: any) => {
    const event = arg.event;    
    setEventData({
      id: event.id,
      type: getColorName(event._def.ui.backgroundColor),
      name: event.title,
      startDate: event.startStr,
      endDate: event.endStr,
      location: event._def.extendedProps.location ? event._def.extendedProps.location : "No Location",
      description: event._def.extendedProps.description,
      uploadImage: event._def.extendedProps.uploadImage || '', 
      file1: event._def.extendedProps.file1 || null 
    });
    openAddNewStateHndlr();
    toggle();
  };
  const handleEditClick = (event: any) => {    
    setEventData({
      id: event.id,
      type: getColorName(event.backgroundColor),
      name: event.title,
      startDate: event.start,
      endDate: event.end,
      location: event.location || "No Location",
      description: event.description,
      uploadImage: event.extendedProps?.uploadImage || '', 
      file1: event.extendedProps?.file1 || null 
    });
    openAddNewStateHndlr();
  };
  const onDrag = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };
  const formatEvents = (data: any) => {
    return data.map((event: any) => {
      const colors = getEventColors(event.type);
      return {
        id: event.id || nanoid(),
        title: event.name,
        start: event.startDate,
        end: event.endDate,
        description: event.description,
        location: event.location,
        backgroundColor: colors.backgroundColor,
        textColor: colors.textColor,
        uploadImage: event.uploadImage, 
        file1: event.file1, 
        extendedProps: {
          description: event.description,
          location: event.location,
          uploadImage: event.uploadImage,
          file1: event.file1
        }
      };
    });
  };
  const handleEventDrop = (info: any) => {
    const updatedEvent = {
      ...info.event.toPlainObject(),
      start: info.event.startStr,
      end: info.event.endStr,
    };
    setEvents(prevEvents =>
      prevEvents.map(event =>
        event.id === updatedEvent.id
          ? { ...event, start: updatedEvent.start, end: updatedEvent.end }
          : event
      )
    );
  };
  useEffect(() => {
    new Draggable(document.getElementById("external-events") as HTMLElement, {
      itemSelector: ".external-event",
    });
  }, []);
  useEffect(() => {
    const initialEvents = [
      {
        id: '',
        name: '',
        startDate: '',
        endDate: '',
        type: '',
        description: '',
        location: '',
        uploadImage: '',
        file1: null as File | null,
      },
    ];
    setEvents(formatEvents(initialEvents));
  }, []);
  return (
    <div className="page-content">
      <div className="container-fluid">
        <BreadCrumb title="School Calendar" pageTitle="School Calendar" />
        <div className="container-fluid calendar-container">
          <div className="tw-flex tw-flex-wrap tw-mx-0">
            <div className="tw-w-full">
              <div className="tw-grid tw-grid-cols-12 tw-gap-4 lg:tw-gap-6">
                <div className="tw-col-span-12 xl:tw-col-span-3">
                  <div className="card">
                    <div className="card-body">
                      <Button
                        variant="info"
                        id="btn-new-event"
                        className="tw-w-full tw-mb-3"
                        onClick={openAddNewStateHndlr}
                      >
                        <i className="mdi mdi-plus"></i> Add New
                      </Button>
                      <div id="external-events">
                        <p className="tw-text-gray-500">
                          Drag and drop your event or click in the calendar
                        </p>
                        <div
                          className="external-event fc-event bg-soft-success text-success tw-rounded"
                          draggable
                          onDrag={(event: React.DragEvent<HTMLDivElement>) => {
                            onDrag(event);
                          }}
                        >
                          <span className="tw-rounded-full tw-mr-2 tw-bg-emerald-500 tw-p-1"></span>
                          New Event Planning
                        </div>
                        <div
                          className="external-event fc-event bg-soft-primary text-primary tw-rounded"
                          draggable
                          onDrag={(event: React.DragEvent<HTMLDivElement>) => {
                            onDrag(event);
                          }}
                        >
                          <span className="tw-rounded-full tw-mr-2 tw-bg-blue-500 tw-p-1"></span>
                          Meeting
                        </div>
                        <div
                          className="external-event fc-event bg-soft-warning text-warning tw-rounded"
                          draggable
                          onDrag={(event: React.DragEvent<HTMLDivElement>) => {
                            onDrag(event);
                          }}
                        >
                          <span className="tw-rounded-full tw-mr-2 tw-bg-yellow-500 tw-p-1"></span>
                          Generating Reports
                        </div>
                        <div
                          className="external-event fc-event bg-soft-danger text-danger tw-rounded"
                          draggable
                          onDrag={(event: React.DragEvent<HTMLDivElement>) => {
                            onDrag(event);
                          }}
                        >
                          <span className="tw-rounded-full tw-mr-2 tw-bg-red-500 tw-p-1"></span>
                          Create New Theme
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h5 className="tw-mb-1">Upcoming Events</h5>
                    <p className="tw-text-gray-500">Don't miss scheduled events</p>
                    {events?.length > 1 ?
                    <div className="">
                        {events?.slice(1)?.map((event) => (
                          <div className="card" key={event.id}>
                            <div className="card-body tw-flex tw-flex-wrap tw-items-center">
                              <div className="tw-w-1/2">
                                <p
                                  className="tw-flex tw-items-center tw-mb-3 tw-truncate"
                                  title={new Date(event.start).toLocaleDateString()}
                                >
                                  <span className="tw-rounded-full tw-mr-2 tw-bg-cyan-500 tw-p-1 tw-inline-block" style={{ width: '8px', height: '8px' }}></span>
                                  {new Date(event.start).toLocaleDateString()}
                                </p>
                                <h4 className="card-title tw-truncate">{event.title}</h4>
                              </div>
                              <div className="tw-w-1/2 tw-flex tw-justify-between tw-gap-2">
                                <p className="tw-bg-blue-50 tw-text-center tw-text-blue-500 tw-rounded tw-p-1 tw-w-full">
                                  {new Date(event.start).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}{" "}
                                  to{" "}
                                  {new Date(event.end).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </p>
                                <p>
                                  <HugeiconsIcon icon={PencilEdit02Icon} className="tw-mr-2 tw-text-gray-500 tw-cursor-pointer" size={18} onClick={() =>  handleEditClick(event)}/>
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div> : 
                    <p className="tw-text-gray-500 tw-text-center card tw-p-3">No Upcoming Events</p>}
                  </div>
                  <div className="card tw-mt-4">
                    <div className="tw-bg-cyan-50 card-body">
                      <div className="tw-flex">
                        <div className="tw-flex-shrink-0">
                          <i className="ri-calendar-line tw-text-cyan-500 tw-text-lg"></i>
                        </div>
                        <div className="tw-flex-grow tw-ml-3">
                          <h6 className="tw-text-[0.9375rem]">Welcome to your Calendar!</h6>
                          <p className="tw-text-gray-500 tw-mb-0">
                            Events that applications book will appear here.
                            Click on an event to see the details and manage
                            applicants' events.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="tw-col-span-12 xl:tw-col-span-9">
                  <div className="card">
                    <div className="card-body">
                      <FullCalendar
                        plugins={[
                          BootstrapTheme,
                          dayGridPlugin,
                          listPlugin,
                          interactionPlugin,
                          timeGridPlugin,
                        ]}
                        initialView="dayGridMonth"
                        slotDuration={"00:30:00"}
                        handleWindowResize={true}
                        themeSystem="bootstrap"
                        headerToolbar={{
                          left: "prev,next today",
                          center: "title",
                          right:
                            "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
                        }}
                        editable={true}
                        selectable={true}
                        droppable={true}
                        timeZone="local"
                        dateClick={handleDateClick}
                        eventClick={handleEventClick}
                        eventDrop={handleEventDrop}
                        events={events}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <ModalContainerUpdated
            id="book-collection"
            isOpen={addNewState.showModal}
            toggle={closeAddNewStateHndlr}
            modalTitle={eventData.id ? "Edit Event" : "Add New Event"}
            modalSize="md"
          >
           <AddEditEventModal
              toggle={() => closeAddNewStateHndlr()}
              isOpen={addNewState.showModal}
              setEvent={(newEvent: any) => {
                setEvents(prevEvents => {
                  if (newEvent.id) {
                    return prevEvents.map(event => 
                      event.id === newEvent.id 
                        ? { ...event, ...formatEvents([newEvent])[0] }
                        : event
                    );
                  }
                  const formattedNewEvent = formatEvents([{
                    ...newEvent,
                    id: nanoid()
                  }])[0];
                  return [...prevEvents, formattedNewEvent];
                });
              }}             
              events={eventData}
            />
          </ModalContainerUpdated>
        </div>
      </div>
    </div>
  );
};
export default CalendarSummary