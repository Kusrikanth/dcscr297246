import React from 'react'
import { Button, UserDetails } from '../../../../Components/Common';
import avatar1 from "../../../../assets/images/users/avatar-1.jpg";
// import { UserDetails } from '../../../Components/Common';

const TodayAbsentee = () => {
  return (
    <>
        <div className="card today_absentee_wrap">
            <div className="card-header">
                <div className="tw-flex tw-items-center">
                    <div className="tw-flex-1">
                        <h4 className="tw-card-title tw-mb-0 tw-flex-grow">Today Absentee</h4>
                    </div>
                </div>
            </div>

            <div className="card-body">
                <div className='tw-flex tw-items-center tw-mb-3'>
                    <div className='tw-w-5/12'>
                        <div className='tw-inline-block'>
                            <UserDetails
                                imageUrl={avatar1}
                                displayName="Madhukar Shetty"
                                displayId="Nacharam"
                            />
                        </div>
                    </div>

                    <div className='tw-w-4/12'>
                        <h6 className='tw-text-[14px] tw-flex tw-items-start tw-justify-center tw-flex-wrap'>2D <span className='tw-text-gray-500 tw-ml-1 tw-font-normal tw-text-center'>Casual Leave</span></h6>
                    </div>

                    <div className='tw-w-3/12'>
                        <div className='tw-flex tw-justify-end'>
                            <button type="button" className="tw-btn tw-text-success tw-border tw-border-success tw-px-3 tw-py-1 tw-text-[13px] tw-rounded hover:tw-bg-success hover:tw-text-white tw-transition-colors outline_button">View</button>
                        </div>
                    </div>
                </div>

                <div className='tw-flex tw-items-center tw-mb-3'>
                    <div className='tw-w-5/12'>
                        <div className='tw-inline-block'>
                            <UserDetails
                                imageUrl={avatar1}
                                displayName="Divyanka Reddy"
                                displayId="Mahendra Hills"
                            />
                        </div>
                    </div>

                    <div className='tw-w-4/12'>
                        <h6 className='tw-text-[14px] tw-flex tw-items-start tw-justify-center tw-flex-wrap'>2D <span className='tw-text-gray-500 tw-ml-1 tw-font-normal tw-text-center'>Casual Leave</span></h6>
                    </div>

                    <div className='tw-w-3/12'>
                        <div className='tw-flex tw-justify-end'>
                            <button type="button" className="tw-btn tw-text-success tw-border tw-border-success tw-px-3 tw-py-1 tw-text-[13px] tw-rounded hover:tw-bg-success hover:tw-text-white tw-transition-colors outline_button">View</button>
                        </div>
                    </div>
                </div>

                <div className='tw-flex tw-items-center tw-mb-3'>
                    <div className='tw-w-5/12'>
                        <div className='tw-inline-block'>
                            <UserDetails
                                imageUrl={avatar1}
                                displayName="Indrajith Prasad"
                                displayId="Nadergul"
                            />
                        </div>
                    </div>

                    <div className='tw-w-4/12'>
                        <h6 className='tw-text-[14px] tw-flex tw-items-start tw-justify-center tw-flex-wrap'>2D <span className='tw-text-gray-500 tw-ml-1 tw-font-normal tw-text-center'>Casual Leave</span></h6>
                    </div>

                    <div className='tw-w-3/12'>
                        <div className='tw-flex tw-justify-end'>
                            <Button type="button" className="tw-btn tw-text-success tw-border tw-border-success tw-px-3 tw-py-1 tw-text-[13px] tw-rounded hover:tw-bg-success hover:tw-text-white tw-transition-colors outline_button">View</Button>
                        </div>
                    </div>
                </div>

                <div className='tw-flex tw-items-center tw-mb-3'>
                    <div className='tw-w-5/12'>
                        <div className='tw-inline-block'>
                            <UserDetails
                                imageUrl={avatar1}
                                displayName="Indrajith Prasad"
                                displayId="Nacharam"
                            />
                        </div>
                    </div>

                    <div className='tw-w-4/12'>
                        <h6 className='tw-text-[14px] tw-flex tw-items-start tw-justify-center tw-flex-wrap'>2D <span className='tw-text-gray-500 tw-ml-1 tw-font-normal tw-text-center'>Casual Leave</span></h6>
                    </div>

                    <div className='tw-w-3/12'>
                        <div className='tw-flex tw-justify-end'>
                            <button type="button" className="tw-btn tw-text-success tw-border tw-border-success tw-px-3 tw-py-1 tw-text-[13px] tw-rounded hover:tw-bg-success hover:tw-text-white tw-transition-colors outline_button">View</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card-footer" />
        </div>
    </>
  )
}

export default TodayAbsentee