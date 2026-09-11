import React from 'react'
import { SelectInput, TextArea } from '../../../../../Components/Common'
import Button from '../../../../../Components/Common/Button'

const CommunicateWhatsApp = () => {
    function applyFilterHndlr() {

    }
  return (
      <>
          <div className="tw-flex tw-gap-3 tw-p-3 ">
              <SelectInput
                  name="send"
                  value={""}
                  onChange={undefined}
                  menuItems={[]}
                  valueKey="send"
                  textKey="send"
                  defaultSelect="Send To The Registered Lead"
                  formgroupClassName="w-100"
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
                  formgroupClassName="w-100"
              />
          </div>
          <div className="tw-flex tw-gap-3 tw-p-3">
              <SelectInput
                  name="tockens"
                  value={""}
                  onChange={undefined}
                  menuItems={[]}
                  valueKey="tockens"
                  textKey="tockens"
                  defaultSelect="Add Tockens"
                  formgroupClassName="w-100"
              />
          </div>
          <div className="tw-flex tw-gap-3 tw-p-3">
              <TextArea
                  name="message"
                  value={""}
                  onChange={""}
                  placeHolder="Message text"
                  formgroupClassName="w-100"

              />
          </div>
          <div className="hstack tw-gap-2 tw-p-3 tw-justify-end">
              <Button
                  type="submit"
                  onClick={applyFilterHndlr}
                  // disabled={showApiLoader}
              >
                  Send
              </Button>
          </div>
      </>
  )
}

export default CommunicateWhatsApp