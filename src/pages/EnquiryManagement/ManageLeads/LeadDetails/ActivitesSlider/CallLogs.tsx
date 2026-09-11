import { CallIcon } from '@hugeicons-pro/core-stroke-standard'
import { HugeiconsIcon } from '@hugeicons/react'
import React from 'react'

const CallLogs = () => {
  return (
    <div className='tw-my-4'>
        <div className='tw-flex tw-items-center tw-gap-3 tw-mb-4'>
                  <div className='timeline-icon tw-flex tw-items-center tw-justify-center tw-flex-shrink-0 tw-rounded-full tw-bg-emerald-100' style={{ width: '2rem', height: '2rem' }}>
                      <HugeiconsIcon icon={CallIcon} className="tw-text-emerald-500" size={16} />
                  </div>
                  <div className="timeline-content">
                      <p className='tw-mb-0 tw-text-base tw-font-bold'>Sep 5, 2024, 3:26 PM</p>
                      <p className='tw-mb-0 tw-text-gray-500 tw-text-[10px]'>Lead Assigned To HARITHA Via User Allocation Logic On 05-09-2024 01:29:04 PM.</p>
                  </div>
              </div>
              <div className='tw-flex tw-items-center tw-gap-3 tw-mb-4'>
                  <div className='timeline-icon tw-flex tw-items-center tw-justify-center tw-flex-shrink-0 tw-rounded-full tw-bg-emerald-100' style={{ width: '2rem', height: '2rem' }}>
                      <HugeiconsIcon icon={CallIcon} className="tw-text-emerald-500" size={16} />
                  </div>
                  <div className="timeline-content">
                      <p className='tw-mb-0 tw-text-base tw-font-bold'>Sep 5, 2024, 3:26 PM</p>
                      <p className='tw-mb-0 tw-text-gray-500 tw-text-[10px]'>Lead Assigned To HARITHA Via User Allocation Logic On 05-09-2024 01:29:04 PM.</p>
                  </div>
              </div>
              <div className='tw-flex tw-items-center tw-gap-3 tw-mb-4'>
                  <div className='timeline-icon tw-flex tw-items-center tw-justify-center tw-flex-shrink-0 tw-rounded-full tw-bg-emerald-100' style={{ width: '2rem', height: '2rem' }}>
                      <HugeiconsIcon icon={CallIcon} className="tw-text-emerald-500" size={16} />
                  </div>
                  <div className="timeline-content">
                      <p className='tw-mb-0 tw-text-base tw-font-bold'>Sep 5, 2024, 3:26 PM</p>
                      <p className='tw-mb-0 tw-text-gray-500 tw-text-[10px]'>Lead Assigned To HARITHA Via User Allocation Logic On 05-09-2024 01:29:04 PM.</p>
                  </div>
              </div>
    </div>
  )
}

export default CallLogs