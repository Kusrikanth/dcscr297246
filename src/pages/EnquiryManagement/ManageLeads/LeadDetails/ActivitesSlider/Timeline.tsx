import { CallIcon, File01Icon, Mail01Icon, UserAdd01Icon } from "@hugeicons-pro/core-stroke-standard"
import { HugeiconsIcon } from "@hugeicons/react"

const Timeline = () => {
  return (
    <>
          <div className="tw-my-5">
              <div className='tw-flex tw-items-center tw-gap-3 tw-mb-3'>
                  <div className='timeline-icon tw-flex tw-items-center tw-justify-center tw-flex-shrink-0 tw-rounded-full tw-bg-emerald-100' style={{ width: '2rem', height: '2rem' }}>
                      <HugeiconsIcon icon={CallIcon} className="tw-text-emerald-500" size={16} />
                  </div>
                  <div className="timeline-content">
                      <p className='tw-mb-0 tw-text-base tw-font-bold'>Sep 5, 2024, 3:26 PM</p>
                      <p className='tw-mb-0 tw-text-gray-500 tw-text-[10px]'>Lead Assigned To HARITHA Via User Allocation Logic On 05-09-2024 01:29:04 PM.</p>
                  </div>
              </div>
              <div className="tw-flex tw-items-start tw-gap-3 tw-mb-3">
                  <div className="timeline-icon tw-flex tw-items-center tw-justify-center tw-flex-shrink-0 tw-rounded-full tw-bg-emerald-100" style={{ width: "2rem", height: "2rem" }}>
                      <HugeiconsIcon icon={Mail01Icon} className="tw-text-emerald-500" size={16} />
                  </div>
                  <div className="timeline-content">
                      <p className="tw-mb-1 tw-text-base tw-font-bold">Sep 5, 2024, 3:26 PM</p>
                      <p className="tw-mb-0 tw-text-gray-500 tw-text-[10px]">
                          Lead Assigned To HARITHA Via User Allocation Logic On 05-09-2024 01:29:04 PM.
                      </p>
                  </div>
              </div>

              <div className='tw-flex tw-items-center tw-gap-3 tw-mb-3'>
                  <div className='timeline-icon tw-flex tw-items-center tw-justify-center tw-flex-shrink-0 tw-rounded-full tw-bg-blue-100' style={{ width: '2rem', height: '2rem' }}>
                    <HugeiconsIcon icon={UserAdd01Icon} className="tw-text-blue-500" size={16} />
                  </div>
                  <div>
                      <p className='tw-mb-0 tw-text-base tw-font-bold'>Sep 5, 2024, 3:26 PM</p>
                      <p className='tw-mb-0 tw-text-gray-500 tw-text-[10px]'>Praveen Kumar Has Successfully Created Account.</p>
                  </div>
              </div>
              <div className='tw-flex tw-items-center tw-gap-3 tw-mb-3'>
                  <div className='timeline-icon tw-flex tw-items-center tw-justify-center tw-flex-shrink-0 tw-rounded-full tw-bg-blue-100' style={{ width: '2rem', height: '2rem' }}>
                    <HugeiconsIcon icon={UserAdd01Icon} className="tw-text-blue-500" size={16} />
                  </div>
                  <div>
                      <p className='tw-mb-0 tw-text-base tw-font-bold'>Sep 5, 2024, 3:26 PM</p>
                      <p className='tw-mb-0 tw-text-gray-500 tw-text-[10px]'>Praveen Kumar Registered Via Lead Origin:Widget, Registration Channel: Email Through Channel/Publisher: Google Ads With Campaign Name: Google/Search/PIS Bachupally CBSE - 9Th November (Search) Through International School, Bachupally</p>
                  </div>
              </div>
              <div className='tw-flex tw-items-center tw-gap-3 tw-mb-3'>
                  <div className='timeline-icon tw-flex tw-items-center tw-justify-center tw-flex-shrink-0 tw-rounded-full tw-text-amber-500 tw-bg-amber-100' style={{ width: '2rem', height: '2rem' }}>
                    <HugeiconsIcon icon={File01Icon} className="tw-text-amber-500" size={16} />
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

export default Timeline