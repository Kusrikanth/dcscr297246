
import React, { useMemo, useState } from 'react'

import { default as Verified } from "../../../../../assets/imagesdps/academics/Verified.svg?react";
import DefaultStudentImage from "../../../../../assets/imagesdps/student-default-img.png";
import { default as CalendarSvg } from "../../../../../assets/imagesdps/academics/Calendar_1.svg?react";
import { useModal } from '../../../../../hooks/modalhook';
import { DateInput, MoreActions, OffCanvasContainer, StatusLabel, TextInput, UserDetails } from '../../../../../Components/Common';
import { Current_Date_YYYYMMDD } from '../../../../../utility/dateutility';
import ChangeLeadStageModel from '../ChangeLeadStageModel';
import AddEventModel from '../AddEventModel';
import CommunicateModel from '../CommunicateModel';
import CallDetailsModel from '../CallDetailsModel';
import NotesModel from '../NotesModel';
import LeadProfileDetails from './LeadProfileDetails';
import ContactDetails from './ContactDetails';
import ParenetDetails from './ParenetDetails';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowLeftRightIcon, Calendar03Icon, CallIcon, Mail01Icon, NoteEditIcon, PencilEdit02Icon, UserIcon } from '@hugeicons-pro/core-stroke-standard';

const LeadDetailsInfo = () => {
  const [isEditing, setIsEditing] = useState(false);
    const { modalState: ChangeLeadStage, closeModal: closeChangeLeadStageModalHndlr,
        openModal: openChangeLeadStageModalHndlr
    } = useModal();
    const { modalState: AddEvent, closeModal: closeAddEventModalHndlr,
        openModal: openAddEventModalHndlr
    } = useModal();
    const { modalState: Communicate, closeModal: closeCommunicateModalHndlr,
        openModal: openCommunicateModalHndlr
    } = useModal();
    const { modalState: CallDetalis, closeModal: closeCallDetalisModalHndlr,
        openModal: openCallDetalisModalHndlr
    } = useModal();
    const { modalState: Note, closeModal: closeNoteModalHndlr,
        openModal: openNoteModalHndlr
    } = useModal();
    const menuOptions = useMemo(
        () => [
          {
            id: "changeleadstage",
            actionIcon:<HugeiconsIcon icon={ArrowLeftRightIcon} className="tw-mr-2 tw-text-gray-500" size={18} />,
            actionName: "Change Lead Stage",
            onClickHndlr: (event: any) => {
                const id = event.currentTarget.getAttribute("data-id");
                openChangeLeadStageModalHndlr();
              },
          },
          {
            id:"addevent",
            actionIcon: <HugeiconsIcon icon={Calendar03Icon} className="tw-mr-2 tw-text-gray-500" size={18} />,
            actionName: "Add Event",
            onClickHndlr: (event: any) => {
                const id = event.currentTarget.getAttribute("data-id");
                openAddEventModalHndlr();
              },
          },
          {
            id: "communicate",
            actionIcon:<HugeiconsIcon icon={Mail01Icon} className="tw-mr-2 tw-text-gray-500" size={18} />,
            actionName: "Communicate",
            onClickHndlr: (event: any) => {
              const id = event.currentTarget.getAttribute("data-id");
              openCommunicateModalHndlr();
            },
          },
          {
            id: "reassignlead",
            actionIcon: <HugeiconsIcon icon={UserIcon} className="tw-mr-2 tw-text-gray-500" size={18} />,
            actionName: "Re-assign Lead",
          }
        ],
        []
      );
      const handleCall = () =>{
        openCallDetalisModalHndlr()
      }
      const handleNote = ()=>{
        openNoteModalHndlr()
      }
      const handleEditClick = () => {
        setIsEditing((prevState) => !prevState);
      };
  return (
      <div>
          <div className='tw-flex tw-items-center tw-p-2 tw-bg-emerald-600'>
              <p className='tw-mb-0 tw-items-center tw-text-white'>Lead Details</p>
          </div>
          <div className='tw-flex tw-items-center tw-p-2'>
              <UserDetails
                  displayName={""}
                  displayId={""}
                  size={"md"}
                  contentNotCenter={true}
                  paddingTop={"tw-pt-2"}
                  imageUrl={DefaultStudentImage}
              />
              <div className='tw-flex-grow'>
                  <p className='tw-mb-0 tw-text-xl tw-font-bold'>John Doe</p>
                  <StatusLabel type='student' labelName='Student' />
              </div>
              <div>
                  <i className="ri-edit-2-line edit-icon tw-text-3xl tw-text-blue-500" ></i>
              </div>
          </div>
          <div className='tw-flex tw-flex-wrap tw-gap-2 tw-p-2 tw-px-3 tw-pb-4'>
              <div className='tw-flex tw-items-center tw-gap-1 tw-border tw-border-secondary tw-rounded tw-p-2 tw-px-3' onClick={handleCall} >
                  <HugeiconsIcon icon={CallIcon} className="tw-mr-2 tw-text-blue-500" size={18} />
                  <p className='tw-mb-0 tw-text-blue-500'>Call</p>
              </div>
              <div className='tw-flex tw-items-center tw-gap-1 tw-border tw-border-secondary tw-rounded tw-p-2 tw-px-3' onClick={handleNote}>
                  <HugeiconsIcon icon={PencilEdit02Icon} className="tw-mr-2 tw-text-blue-500" size={18} />
                  <p className='tw-mb-0 tw-text-blue-500'>Log Notes</p>
              </div>
              <div className='tw-flex tw-items-center tw-gap-1 tw-border tw-border-secondary tw-rounded tw-p-2 tw-px-3'>
                  <HugeiconsIcon icon={NoteEditIcon} className="tw-mr-2 tw-text-blue-500" size={18} />
                  <p className='tw-mb-0 tw-text-blue-500'>Send Applications</p>
              </div>
              <div className='tw-items-center tw-text-center tw-gap-1 tw-border tw-border-secondary tw-rounded tw-px-3'>
                  <MoreActions actionOptions={menuOptions} rowId={"1"} isHorizontal={false} menuIconClassName={"tw-text-blue-500 tw-text-4xl tw-font-bold"} />
              </div>
          </div>
         <LeadProfileDetails/>
          <ContactDetails/>
          <ParenetDetails/>
          <div className="tw-p-2 tw-border-t tw-pt-3 tw-border-b tw-pb-3 tw-gap-2">
              <p className='tw-text-base tw-font-bold tw-text-blue-500'>Add Additional Information</p>
              <div className='tw-mb-3'>
                  <p className='tw-text-base tw-text-gray-500 tw-p-2 tw-mb-0'>CURRICULUM</p>
                  <p className='tw-border tw-rounded-full tw-p-2 tw-text-gray-500 tw-inline-block tw-mb-0'>Cambridge International</p>
              </div>
              <div className='tw-mb-3'>
                  <p className='tw-text-base tw-text-gray-500 tw-p-2 tw-mb-0'>GRADE</p>
                  <p className='tw-border tw-rounded-full tw-p-2 tw-text-gray-500 tw-inline-block tw-mb-0'>Grade 1</p>
              </div>
          </div>
        <OffCanvasContainer
        isOpen={ChangeLeadStage.showModal}
        headerTitle="Change Lead Stage"
        closeHndlr={closeChangeLeadStageModalHndlr}
        id="changeleadstage"
        customClass="tw-w-[30%]"
      >
        <ChangeLeadStageModel
          isOpen={ChangeLeadStage.showModal}
          toggle={closeChangeLeadStageModalHndlr}
        />
      </OffCanvasContainer>
      <OffCanvasContainer
        isOpen={AddEvent.showModal}
        headerTitle="Events"
        closeHndlr={closeAddEventModalHndlr}
        id="events"
        customClass="tw-w-[30%]"
      >
        <AddEventModel
          isOpen={AddEvent.showModal}
          toggle={closeAddEventModalHndlr}
        />
      </OffCanvasContainer>
      <OffCanvasContainer
        isOpen={Communicate.showModal}
        headerTitle="Communications"
        closeHndlr={closeCommunicateModalHndlr}
        id="communicate"
        customClass='custom-offcanvas-width'
      >
        <CommunicateModel
          isOpen={Communicate.showModal}
          toggle={closeCommunicateModalHndlr}
        />
      </OffCanvasContainer>
      <OffCanvasContainer
        isOpen={CallDetalis.showModal}
        headerTitle="Call Details"
        closeHndlr={closeCallDetalisModalHndlr}
        id="Call Details"
        customClass='custom-offcanvas-width'
      >
        <CallDetailsModel
        isOpen={CallDetalis.showModal}
        toggel={closeCallDetalisModalHndlr}
        />
      </OffCanvasContainer>
      
      <OffCanvasContainer
        isOpen={Note.showModal}
        headerTitle="Add Notes"
        closeHndlr={closeNoteModalHndlr}
        id="AddNote"
        customClass='tw-w-[30%]'
      >
        <NotesModel
        isOpen={Note.showModal}
        toggel={closeNoteModalHndlr}
        />
      </OffCanvasContainer>
      </div>
  )
}
export default LeadDetailsInfo