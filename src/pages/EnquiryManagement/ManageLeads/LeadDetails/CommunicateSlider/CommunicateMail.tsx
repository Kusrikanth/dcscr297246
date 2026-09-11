import React, { Suspense } from 'react'
import { QuillEditor, SelectInput, TextInput } from '../../../../../Components/Common'
import Button from '../../../../../Components/Common/Button'

const CommunicateMail = () => {
    
    function applyFilterHndlr() {

    }
  return (
    <>
      <div className="tw-flex tw-gap-3 tw-p-3 tw-pt-3 ">
        <TextInput
          name="campaignname"
          value={""}
          onChange={undefined}
          placeHolder="Enter Campaign Name"
          isDisabled={false}
          formgroupClassName="w-100"
        />
        <SelectInput
          name="campaigntype"
          value={""}
          onChange={undefined}
          menuItems={[]}
          valueKey="campaigntype"
          textKey="campaigntype"
          defaultSelect="Campaign Type"
          formgroupClassName="tw-w-full"
        />
      </div>
      <div className="tw-flex tw-gap-3 tw-p-3">
        <SelectInput
          name="fromemail"
          value={""}
          onChange={undefined}
          menuItems={[]}
          valueKey="fromemail"
          textKey="fromemail"
          defaultSelect="From Email"
          formgroupClassName="tw-w-full"
        />
      </div>
      <div className="tw-flex tw-gap-3 tw-p-3 ">
        <SelectInput
          name="sendemail"
          value={""}
          onChange={undefined}
          menuItems={[]}
          valueKey="sendemail"
          textKey="sendemail"
          defaultSelect="Send To"
          formgroupClassName="tw-w-full"
        />
        <p className="mb-0 pt-1">CC</p>
      </div>
      <div className="tw-flex tw-gap-3 tw-p-3">
        <SelectInput
          name="template"
          value={""}
          onChange={undefined}
          menuItems={[]}
          valueKey="template"
          textKey="template"
          defaultSelect="Select Template"
          formgroupClassName="tw-w-full"
        />
      </div>
      <div className="tw-flex tw-gap-3 tw-p-3">
        <TextInput
          name="subject"
          value={""}
          onChange={undefined}
          placeHolder="Subject"
          isDisabled={false}
          formgroupClassName="tw-w-full"
        />
      </div>
      <div className="tw-flex tw-gap-3 tw-p-3">
        <Suspense fallback={<div>Loading...</div>} >
          <QuillEditor
            name="description"
            value={"hello"}
            onChange={(value: any) => { }}
            // onBlur={addConcernFeedbackForm.handleBlur}
            formgroupClassName="tw-mb-0 tw-w-full"
            labelText="Description"
          />
        </Suspense>
      </div>
      <div className="tw-flex tw-gap-2 tw-p-3 tw-justify-end">
        <Button
          type="submit"
          variant='primary'
          onClick={applyFilterHndlr}
          // disabled={showApiLoader}
        >
          Send
        </Button>
      </div>
    </>
  )
}

export default CommunicateMail