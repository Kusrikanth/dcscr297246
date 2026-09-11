import React from 'react'
import { TextArea } from '../../../../../Components/Common'
import { default as ViewLedger } from "../../../../../assets/imagesdps/academics/ViewLedger.svg?react";
import { HugeiconsIcon } from '@hugeicons/react';
import { Notebook02Icon } from '@hugeicons-pro/core-stroke-standard';
import Button from '../../../../../Components/Common/Button';


const Notes = () => {
    function applyFilterHndlr() {

    }
  return (
   <>
    <div className="tw-flex tw-gap-3 tw-p-3">
                <TextArea
                    name="notes"
                    value={""}
                    onChange={undefined}
                    placeHolder="Notes"
                    formgroupClassName="tw-w-full"
                    height="100px"
                />
      </div>
      <div className="tw-flex tw-gap-2 tw-p-3 tw-justify-end">
              <Button
                  type="submit"
                  variant='primary'
                  onClick={applyFilterHndlr}
                  // disabled={showApiLoader}
              >
                  Save
              </Button>
          </div>

          <div className='tw-flex tw-items-center tw-gap-3 tw-mb-3 tw-border-top tw-p-3'>
                  <div className='timeline-icon tw-flex tw-items-center tw-justify-center tw-flex-shrink-0 tw-rounded-circle tw-bg-soft-success' style={{ width: '2rem', height: '2rem' }}>
                    <HugeiconsIcon icon={Notebook02Icon} className="text-success" size={16} />
                  </div>
                  <div>
                      <p className='tw-mb-0 tw-fs-7 tw-fw-bold'>Sep 5, 2024, 3:26 PM</p>
                      <p className='tw-mb-0 tw-text-muted tw-fs-7'>Lead Assigned To HARITHA Via User Allocation Logic On 05-09-2024 01:29:04 PM.</p>
                  </div>
              </div>  
   </>
  )
}

export default Notes