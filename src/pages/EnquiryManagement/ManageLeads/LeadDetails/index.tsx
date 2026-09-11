import React, { useMemo, useState } from 'react'
import BreadCrumb from '../../../../Components/Common/BreadCrumb'
import { AutoSearchInputUpdated, AvatarGroup, MoreActions, StatusLabel, UserDetails } from '../../../../Components/Common';
import { default as InfoSvg } from "../../../../assets/imagesdps/academics/Information.svg?react";
import { default as Verified } from "../../../../assets/imagesdps/academics/Verified.svg?react";
import DefaultStudentImage from "../../../../assets/imagesdps/student-default-img.png";
import { default as CalendarSvg } from "../../../../assets/imagesdps/academics/Calendar_1.svg?react";
import { default as EditSvg } from "../../../../assets/imagesdps/academics/EditSvg.svg?react";
import Timeline from './ActivitesSlider/Timeline';
import './progress.scss'
import LeadDetailsInfo from './LeadDetailsInfo';
import CalendarPro from './ActivitesSlider/CalendarPro';
import Notes from './ActivitesSlider/Notes';
import CallLogs from './ActivitesSlider/CallLogs';


const LeadDetails = () => {
    const [activeTab, setActiveTab] = useState('Timeline')
    const handleTabClick = (tabName: string) => {
        setActiveTab(tabName);
      };
  return (
    <>
        <div className="page-content fee-summary">
            <div className="container-fluid">
                <BreadCrumb title="Manage Leads > Lead Details" pageTitle="Enquiry Management"  />
                <div className='tw-bg-white tw-shadow tw-rounded-lg'>
                    <div className='tw-p-6'>
                        <div className="tw-grid tw-grid-cols-12 tw-gap-2">
                            <div className="tw-col-span-12 lg:tw-col-span-8 lg:tw-pr-3">
                                <div className="communication-status tw-relative tw-inline-block tw-w-full tw-p-4 tw-mb-4 tw-rounded-lg tw-border-2 tw-mt-4" >
                                    <div className='tw-flex tw-items-center tw-p-4 tw-bg-blue-50'>
                                        <InfoSvg className='tw-me-2 tw-inline-block' fill='#008ED3' />
                                        <p className='tw-mb-0'>This Application Was Last Contacted On <span>31-08-2024</span>.</p>
                                        <b className='tw-mb-0 tw-ms-auto tw-text-blue-600'>Unverified</b>
                                    </div>
                                    <div className="container tw-mt-4 ">
                                        <div className="tw-grid tw-grid-cols-12 tw-gap-4">
                                            <div className="tw-col-span-6 md:tw-col-span-4">
                                                <p className="tw-font-bold">Communication Status</p>
                                                <p>Email Sent: <span>0</span></p>
                                                <p>SMS Sent: <span>0</span></p>
                                            </div>
                                            <div className="tw-col-span-6 md:tw-col-span-4 tw-border-l tw-ps-4">
                                                <p className="tw-font-bold">Telephony Status</p>
                                                <p>Inbound Call: <span>0</span></p>
                                                <p>Outbound Call: <span>0</span></p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="container">
                                    <div className="progress-bar-container tw-flex tw-w-full">
                                        <div className="step completed "><i className="ri-check-fill tw-me-1"/>Untouched</div>
                                        <div className="step completed"> <i className="ri-check-fill tw-me-1"/>Contacted</div>
                                        <div className="step completed"> <i className="ri-check-fill tw-me-1"/>Interested</div>
                                        <div className="step active"><i className="ri-check-fill tw-me-1"/>Interested</div>
                                        <div className="step ">Interested</div>
                                        <div className="step">Application Sent</div>
                                    </div>
                                </div>
                                <div className="communication-status tw-relative tw-inline-block tw-w-full tw-p-4 tw-mb-4 tw-rounded-lg tw-border-2 tw-mt-4" >
                                    <p className='tw-text-gray-500 tw-text-sm'>Activites on the lead</p>
                                      <div className='tw-flex tw-justify-between'>
                                          <div className='tw-border-b tw-inline-block'>
                                              <div className='tw-flex tw-gap-2'>
                                                  {['Timeline', 'Calendar Pro', 'Notes', 'Communication Logs', 'Call Logs'].map((tab) => (
                                                      <div
                                                          key={tab}
                                                          className={` tw-p-2 tw-cursor-pointer ${activeTab === tab ? 'tw-bg-gray-100 tw-text-black tw-border-b-2 tw-border-blue-600 ' : ''}`}
                                                          onClick={() => handleTabClick(tab)}
                                                      >
                                                          {tab}
                                                      </div>

                                                  ))}
                                              </div>
                                          </div>
                                          {

                                              activeTab === 'Calendar Pro' && (
                                                  <div className='tw-text-center tw-border tw-text-blue-500 tw-p-2 tw-flex tw-items-center  tw-rounded-lg tw-px-4 tw-cursor-pointer'>
                                                      Add Event
                                                  </div>
                                              )
                                          }

                                      </div>
                                      <div className="tw-mt-4">
                                          {activeTab === 'Timeline' && <Timeline />}
                                          {activeTab === 'Calendar Pro' && <CalendarPro />}
                                        {activeTab === 'Notes' && <Notes />}
                                        {/* {activeTab === 'Communication Logs' && <CommunicationLogs />} */}
                                        {activeTab === 'Call Logs' && <CallLogs />}
                                       
                                      </div>
                                </div>
                            
                            </div>
                            <div className="tw-col-span-12 lg:tw-col-span-4 tw-border tw-p-0">
                                <LeadDetailsInfo />
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </>
  )
}

export default LeadDetails