import React from 'react'
import { DateInput, TextInput } from '../../../../../Components/Common'
import '../progress.scss'
import { HugeiconsIcon } from '@hugeicons/react'
import { Calendar03Icon } from '@hugeicons-pro/core-stroke-standard'

const CalendarPro = () => {
  return (
      <>
          <div className='tw-flex tw-gap-3 tw-my-3'>
              <TextInput
                  name="searchString"
                  value={""}
                  onChange={undefined}
                  inputClassName="tw-bg-soft-light"
                  formgroupClassName="tw-mb-0 tw-w-[30%]"
                  placeHolder="Search..."
              />
              <DateInput
                  name="Date"
                  value={""}
                  onChange={undefined}
                  formgroupClassName="tw-mb-0 tw-w-[20%]"

              />
          </div>

          <div>
              <div className='tw-flex tw-items-center tw-gap-3 tw-mb-3 tw-border tw-bg-blue-100 tw-rounded tw-p-3'>
                  <div className='timeline-icon tw-flex tw-items-center tw-justify-center tw-flex-shrink-0 tw-rounded-full tw-bg-blue-100' style={{ width: '2rem', height: '2rem' }}>
                    <HugeiconsIcon icon={Calendar03Icon} className="tw-text-blue-500" size={16} />
                  </div>
                  <div>
                      <p className='tw-mb-0 tw-text-base tw-font-bold'>Sep 5, 2024, 3:26 PM</p>
                      <p className='tw-mb-0 tw-text-gray-500 tw-text-[10px]'>Lead Assigned To HARITHA Via User Allocation Logic On 05-09-2024 01:29:04 PM.</p>
                  </div>
              </div>
              <div className='tw-flex tw-items-center tw-gap-3 tw-mb-3 tw-border tw-rounded tw-p-3'>
                  <div className='timeline-icon tw-flex tw-items-center tw-justify-center tw-flex-shrink-0 tw-rounded-full tw-bg-soft-warning' style={{ width: '2rem', height: '2rem' }}>
                        <HugeiconsIcon icon={Calendar03Icon} className="tw-text-red-500" size={16} />
                  </div>
                  <div>
                      <p className='tw-mb-0 tw-text-base tw-font-bold'>Sep 5, 2024, 3:26 PM</p>
                      <p className='tw-mb-0 tw-text-gray-500 tw-text-[10px]'>Lead Assigned To HARITHA Via User Allocation Logic On 05-09-2024 01:29:04 PM.</p>
                  </div>
              </div>
          </div>

      </>
  )
}

export default CalendarPro