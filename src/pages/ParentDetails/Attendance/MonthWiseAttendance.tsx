import React, { useMemo } from 'react'
import { default as RightIcon } from "../../../assets/imagesdps/attendence/RightIcon.svg?react";
import { default as WrongIcon } from "../../../assets/imagesdps/attendence/WrongIcon.svg?react";
import { default as LeaveIcon } from "../../../assets/imagesdps/attendence/LeaveIcon.svg?react";
import TableContainer from '../../../Components/Common/TableContainer';
import { MonthWiseAttendanceData, generateColumns } from './helper';

const MonthWiseAttendance = () => {

  const roleColumns = useMemo(() => generateColumns(), []);
  return (
    <>
     <div className="card month-wise-attendance">
            <div className="card-header">
              <div className="tw-flex tw-items-center">
                <div className="tw-w-1/2">
                  <h4 className="card-title tw-mb-0 tw-grow">
                  Month Wise Attendance Details
                  </h4>
                </div>
                {/* <div className="col-auto ms-auto">
                  <button
                    className="btn btn-success float-end d-flex align-items-center"
                  >
                    <i className="ri-add-line me-2" />
                    Add Request
                  </button>
                </div> */}
              </div>
            </div>

            <div className="tw-p-0 card-body">
            <div className="tw-mt-2 tw-flex tw-flex-wrap tw-gap-3 tw-items-center tw-ml-2">
                        <div className="tw-w-full lg:tw-w-1/2 tw-flex">
                        <div className="tw-flex tw-items-center ">
                           <span className='svg-icon' ><RightIcon /></span>  <span className="tw-ml-2">Present</span>
                        </div>
                        <div className="tw-flex tw-items-center tw-ml-3">
                        <span className='svg-icon-2' > <WrongIcon /></span> <span className="tw-ml-2">Absent</span>
                        </div>
                        <div className="tw-flex tw-items-center tw-ml-3">
                        <span className='svg-icon-2' ><LeaveIcon /></span> <span className="tw-ml-2">Holiday</span>
                        </div>
                        </div>
                    </div>

                    <div className='tw-mt-4'>
                    <TableContainer
                       columns={roleColumns || []}
                       data={MonthWiseAttendanceData || []}
                       divClass="table-responsive tw-mb-3"
                       theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
                       // showCheckbox={true}
                       showPagination={false}
                     />
                    </div>

            </div>
          </div>
    </>
  )
}

export default MonthWiseAttendance