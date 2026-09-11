import React, { useMemo, useState } from 'react'
import DefaultStudentImage from "../../../assets/imagesdps/student-default-img.png";
import { DateInput, Button } from '../../../Components/Common';
import BreadCrumb from '../../../Components/Common/BreadCrumb';
import TableContainer from '../../../Components/Common/TableContainer';
import { activityLogData, generateActivityColumns } from './helper';


const filterData = {
    date: ""
}
const LoginActivities = () => {
    const [filterState, setFilterState] = useState<any>(filterData);
    const DateHandler = (event: any) => {
        setFilterState((prev: any) => ({ ...prev, date: event.target.value }));
    }

    const roleColumns = useMemo(() => generateActivityColumns(), []);

    return (
        <div className="page-content">
            <div className="container-fluid">
                <BreadCrumb title="User List" pageTitle="User Management" />
                <div className='tw-grid tw-grid-cols-12 tw-gap-4 tw-m-0'>
                    <div className="tw-col-span-12 lg:tw-col-span-4 tw-card">
                        <div className="tw-p-4">
                            <div className='tw-flex tw-flex-col tw-items-center tw-mb-4'>
                                <div className="tw-h-20 tw-w-20 tw-flex-shrink-0 tw-rounded-full tw-mb-3 tw-overflow-hidden">
                                    <img
                                        src={DefaultStudentImage}
                                        className="tw-w-full tw-h-full tw-object-cover"
                                        alt="Profile"
                                    />
                                </div>
                                <h5 className="tw-text-lg tw-font-bold tw-mb-1">Rudra Narayan</h5>
                                <span className="tw-text-gray-500 tw-text-sm">Student</span>
                                <span className="tw-inline-block tw-bg-[#FEF9C3] tw-text-[#854D0E] tw-text-[12px] tw-font-bold tw-px-3 tw-py-1 tw-rounded-full tw-mt-2 tw-uppercase">
                                    DPS Nacharam
                                </span>
                            </div>
                            <div className="tw-space-y-2 tw-mt-6">
                                <div className='tw-grid tw-grid-cols-12'>
                                    <div className='tw-col-span-5 tw-text-gray-500 tw-font-medium'>User Name</div>
                                    <div className='tw-col-span-1 tw-text-gray-400'>:</div>
                                    <div className='tw-col-span-6 tw-font-semibold'>P1230001</div>
                                </div>
                                <div className='tw-grid tw-grid-cols-12'>
                                    <div className='tw-col-span-5 tw-text-gray-500 tw-font-medium'>Role</div>
                                    <div className='tw-col-span-1 tw-text-gray-400'>:</div>
                                    <div className='tw-col-span-6 tw-font-semibold'>Parent</div>
                                </div>
                                <div className='tw-grid tw-grid-cols-12'>
                                    <div className='tw-col-span-5 tw-text-gray-500 tw-font-medium'>Email</div>
                                    <div className='tw-col-span-1 tw-text-gray-400'>:</div>
                                    <div className='tw-col-span-6 tw-font-semibold tw-break-words'>info@delhipubschool.com</div>
                                </div>
                                <div className='tw-grid tw-grid-cols-12'>
                                    <div className='tw-col-span-5 tw-text-gray-500 tw-font-medium'>Phone No.</div>
                                    <div className='tw-col-span-1 tw-text-gray-400'>:</div>
                                    <div className='tw-col-span-6 tw-font-semibold'>+91 9852565245</div>
                                </div>
                                <div className='tw-grid tw-grid-cols-12'>
                                    <div className='tw-col-span-5 tw-text-gray-500 tw-font-medium'>Created Date</div>
                                    <div className='tw-col-span-1 tw-text-gray-400'>:</div>
                                    <div className='tw-col-span-6 tw-font-semibold'>22-03-2023</div>
                                </div>
                                <div className='tw-grid tw-grid-cols-12'>
                                    <div className='tw-col-span-5 tw-text-gray-500 tw-font-medium'>Password</div>
                                    <div className='tw-col-span-1 tw-text-gray-400'>:</div>
                                    <div className='tw-col-span-6 tw-font-semibold'>**************</div>
                                </div>
                            </div>
                            <div className="tw-mt-6">
                                <Button 
                                    onClick={() => { }} 
                                    variant="primary"
                                >
                                    Change Password
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className="tw-col-span-12 lg:tw-col-span-8 tw-card tw-p-0">
                        <div className="tw-p-0">
                            <DateInput
                                name={'date'}
                                value={filterState.date}
                                formgroupClassName="tw-mx-4 tw-my-3"
                                onChange={DateHandler}
                            // invalid={inputFieldTouched.startDate &&
                            //     inputFieldErrors.startDate
                            //     ? true
                            //     : false}
                            // error={inputFieldTouched.startDate &&
                            //     inputFieldErrors.startDate
                            //     ? inputFieldErrors.startDate
                            //     : ""}
                            // invalid={(addAcademicYearForm.touched.startDate && addAcademicYearForm.errors.startDate) ? true : false}
                            // error={(addAcademicYearForm.touched.startDate && addAcademicYearForm.errors.startDate) ? addAcademicYearForm.errors.startDate : ""}
                            />
                            <TableContainer
                                columns={roleColumns || []}
                                data={activityLogData}
                                divClass="table-responsive tw-mb-1"
                                theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
                                // thClass="text-dark"
                                // showCheckbox={true}
                           />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginActivities
