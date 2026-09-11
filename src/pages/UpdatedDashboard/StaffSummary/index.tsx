import React from 'react'
import DepartmentSummary from './DepartmentSummary'
import SalaryDistribution from './SalaryDistribution'
import TodayAbsentee from './TodayAbsentee'

const StaffSummary = () => {
  return (
    <>
      <div className='tw-grid tw-grid-cols-12 tw-gap-4'>
        <div className='tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-4'>
          <DepartmentSummary />
        </div>

        <div className='tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-4'>
          <SalaryDistribution />
        </div>

        <div className='tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-4'>
          <TodayAbsentee/>
        </div>
      </div>
    </>
  )
}

export default StaffSummary
