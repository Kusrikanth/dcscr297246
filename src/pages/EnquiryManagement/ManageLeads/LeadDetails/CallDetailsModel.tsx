import React from 'react'
import { DateInput, SelectInput, StatusLabel, TextArea, TextInput, UserDetails } from '../../../../Components/Common'
import DefaultStudentImage from "../../../../assets/imagesdps/student-default-img.png";
import AccordionCardItem from '../../../../Components/Common/AccordionCardItem';
import AccordionCardHeader from '../../../../Components/Common/AccordionCardHeader';
import AccordionCardBody from '../../../../Components/Common/AccordionCardBody';
import './progress.scss'
import UncontrolledAccordionCard from '../../../../Components/Common/UncontrolledAccordionCard';
import { HugeiconsIcon } from '@hugeicons/react';
import { NoteEditIcon } from '@hugeicons-pro/core-stroke-standard';
import Button from '../../../../Components/Common/Button';

const CallDetailsModel = (props:any) => {
  function applyFilterHndlr() {

  }
  return (
    <React.Fragment>
      <div className='tw-flex tw-items-center tw-p-3'>
        <UserDetails
          displayName={""}
          displayId={""}
          size={"md"}
          contentNotCenter={true}
          paddingTop={"tw-pt-2"}
          imageUrl={DefaultStudentImage}
        />
        <div className='tw-flex-grow-1 tw-mt-2'>
          <p className='tw-mb-0 tw-fs-5 tw-fw-bold'>John Doe</p>
          <div className='tw-flex tw-gap-1'>
            <p className='tw-text-gray-500 tw-fs-7 tw-mb-0 tw-p-2'>Campaign: </p>
            <p className='tw-fs-7 tw-fw-bold tw-mb-0 tw-py-2'>Inbound_91********81</p>
          </div>
          <div className='tw-flex tw-gap-1'>
            <p className='tw-text-gray-500 tw-fs-7 tw-mb-0 tw-p-2'>Lead Owner: </p>
            <p className='tw-fs-7 tw-fw-bold tw-mb-0 tw-py-2'>Gitika Kalashi</p>
            <i className="ri-edit-2-line edit-icon tw-fs-5 tw-text-info" ></i>
          </div>
        </div>
        <div className='tw-text-info tw-border tw-rounded tw-p-2 tw-flex tw-gap-2 tw-text-center tw-align-item-center tw-justify-content-center'>
        <HugeiconsIcon icon={NoteEditIcon} className="tw-text-info" size={18} />          
        <p className='tw-mb-0'>Send Application</p>
        </div>
      </div>
      <div>
        <UncontrolledAccordionCard
          defaultOpen={[
            '1',
            '2',
            '3',
            '4',
            '5',
            '6'
          ]}
        >
          <AccordionCardItem>
            <AccordionCardHeader targetId="1" title="Lead Details" accordionHeaderClass="tw-bg-soft-info" titleClass="tw-text-black tw-fw-bold" />
            <AccordionCardBody accordionId="1" style={{ borderTop: "0px", borderRadius: "0px 0px 5px 5px", padding: "0px", border: "0px" }} >
              <div className="container mt-4">
                <div className="row">
                  <div className="col-md-6">
                    <div className="info-item">
                      <span className="tw-text-gray-500">School :</span>
                      <span className="value">PIS BACHUPALLY</span>
                    </div>
                    <div className="info-item">
                      <span className="tw-text-gray-500">Email :</span>
                      <span className="value">Praveenkumarredf73@Gmail.Com</span>
                    </div>
                    <div className="info-item">
                      <span className="tw-text-gray-500">Location :</span>
                      <span className="value">Zaheerabad</span>
                    </div>
                    <div className="info-item">
                      <span className="tw-text-gray-500">Name Of The Parent :</span>
                      <span className="value">Gitika Kalasthi</span>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="info-item">
                      <span className="tw-text-gray-500">DOB :</span>
                      <span className="value">N/A</span>
                    </div>
                    <div className="info-item">
                      <span className="tw-text-gray-500">Admission Type :</span>
                      <span className="value">N/A</span>
                    </div>
                    <div className="info-item">
                      <span className="tw-text-gray-500">Alternate Mobile Number :</span>
                      <span className="value">N/A</span>
                    </div>
                  </div>
                </div>
              </div>

            </AccordionCardBody>
          </AccordionCardItem>

          <AccordionCardItem>
            <AccordionCardHeader targetId="2" title="Timeline" accordionHeaderClass="tw-bg-soft-info" titleClass="tw-text-black tw-fw-bold" />
            <AccordionCardBody accordionId="2" style={{ borderTop: "0px", borderRadius: "0px 0px 5px 5px", padding: "0px", border: "0px" }} >

            </AccordionCardBody>
          </AccordionCardItem>
        </UncontrolledAccordionCard>
      </div>
      <div className='p-3'>
        <p className='tw-border-bottom tw-p-2 tw-fw-bold'>
          Disposition
        </p>
        <SelectInput
          name="disposition"
          value={""}
          onChange={undefined}
          menuItems={[]}
          valueKey="disposition"
          textKey="disposition"
          defaultSelect="Select disposition"
        />
        <TextArea
          name="callSummary"
          value={""}
          onChange={undefined}
          placeHolder="Call Summary"
          formgroupClassName="tw-w-100"
          height="100px"
        />
        <DateInput
          name="Date"
          labelText="Call back Date & Time"
          value={""}
          onChange={undefined}
          // isReadOnly={true}
          formgroupClassName="tw-mb-0 tw-mt-2"

        />
        <div className="tw-hstack tw-gap-2 tw-py-2 tw-justify-content-end">
          <Button
            type="submit"
            onClick={applyFilterHndlr}
            // disabled={sho`wApiLoader}
            variant="primary"
          >
            Save
          </Button>
        </div>
      </div>
    </React.Fragment>

  )
}

export default CallDetailsModel