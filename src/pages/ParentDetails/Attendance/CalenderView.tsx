import React, { useState } from 'react'
import ReactDatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const CalenderView = () => {
    const [startDate, setStartDate] = useState(new Date());
  return (
    <>
    <div className="card">
            <div className="card-header">
              <div className="tw-flex tw-items-center">
                <div className="tw-w-1/2">
                  <h4 className="card-title tw-mb-0 tw-grow">
                  Calender View
                  </h4>
                </div>
              </div>
            </div>

            <div className="tw-p-0 card-body custom-datepicker">

            <ReactDatePicker
                  selected={startDate}
                  onChange={(date:any) => setStartDate(date)}
                  inline
                />
            </div>
          </div>
    </>
  )
}

export default CalenderView