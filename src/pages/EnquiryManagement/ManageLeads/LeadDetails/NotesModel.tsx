import React from 'react'
import { TextArea } from '../../../../Components/Common'
import Button from '../../../../Components/Common/Button'

const NotesModel = (props:any) => {
  function applyFilterHndlr() {

  }
  return (
    <>
    <div className='tw-p-6'>
      <TextArea
        name="notes"
        value={""}
        onChange={""}
        placeHolder="Notes"

      />
      <div className="hstack tw-gap-2 tw-py-2 tw-justify-end">
        <Button
          type="submit"
          onClick={applyFilterHndlr}
          // disabled={showApiLoader}
          variant="primary"
        >
          Submit
        </Button>
      </div>
    </div>
    <div className='tw-border-t tw-mt-3'>
      <p className='fw-bold tw-p-2'>Previous Activities</p>
    </div>
    
    </>
  )
}

export default NotesModel