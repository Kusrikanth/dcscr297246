import React from 'react'
import { getDateWithTimeFormat } from '../../../../../../utility/dateutility'

const ScheduleType = (props: any) => {
  const {data} = props
  const utcStartDate = `${data?.startDate}T${data?.startTime}Z`;
  const utcEndDate = `${data?.expiryDate}T${data?.expiryTime}Z`;

  const formatToTimeOnly = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };
  return (
   <div className="border rounded-md p-4">
  <div className="grid grid-cols-2 gap-4">
    <div className='tw-flex tw-items-center tw-gap-2 tw-mb-1'>
      <span className="fs-12 fw-bold">Exam Start Date and Time:   </span>
      <p className="tw-mb-0 fs-12 text-muted">{getDateWithTimeFormat(utcStartDate).replace(/,$/, '')} - {formatToTimeOnly(utcEndDate)}</p>
    </div>
    <div className='tw-flex tw-items-center tw-gap-2 tw-mb-1'>
     <span className="fs-12 fw-bold ">Duration (Minutes):   </span>
      <p className="tw-mb-0 fs-12 text-muted">{data?.durationMinutes}</p>
    </div>
    <div className='tw-flex tw-items-center tw-gap-2 tw-mb-1'>
      <span className="fs-12 fw-bold ">Grace Period to Join (Minutes):   </span>
      <p className="tw-mb-0 fs-12 text-muted">{data?.gracePeriod}</p>
    </div>
  </div>
</div>

  )
}

export default ScheduleType
