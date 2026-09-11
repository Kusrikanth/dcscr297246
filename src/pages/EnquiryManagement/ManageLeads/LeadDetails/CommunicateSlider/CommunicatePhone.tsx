import React from 'react'
import { SelectInput, TextArea, TextInput } from '../../../../../Components/Common'
import { tr } from 'date-fns/locale'
import Button from '../../../../../Components/Common/Button'

const CommunicatePhone = () => {
    
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
          formgroupClassName="tw-w-full"
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
          name="smssender"
          value={""}
          onChange={undefined}
          menuItems={[]}
          valueKey="smssender"
          textKey="smssender"
          defaultSelect="SMS National Sender"
          formgroupClassName="tw-w-full"
        />
      </div>
      <div className="tw-flex tw-gap-3 tw-p-3 ">
        <SelectInput
          name="send"
          value={""}
          onChange={undefined}
          menuItems={[]}
          valueKey="send"
          textKey="send"
          defaultSelect="Send To The Registered Lead"
          formgroupClassName="tw-w-full"
        />
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
                <TextArea
                    name="message"
                    value={""}
                    onChange={""}
                    placeHolder="Message text"
                    isDisabled={true}
                    formgroupClassName="tw-w-full"

                />
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

export default CommunicatePhone