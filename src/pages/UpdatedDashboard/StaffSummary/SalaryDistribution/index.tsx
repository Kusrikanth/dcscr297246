import { useFormik } from 'formik';
import React, { useState } from 'react'
// import { SelectInput } from '../../../Components/Common';
import { selectData1 } from './helper';
import { SalaryDistributionFilterhProps } from './SalaryDistributionTypes';
import { default as RupeeSvg } from "../../../../assets/imagesdps/feeDashboard/RupeeSvg.svg?react";
import { SelectInput } from '../../../../Components/Common';

const initialValues: SalaryDistributionFilterhProps = {
    month: "Month",
};

const SalaryDistribution = () => {

const [salaryDistributionFilterState, setSalaryDistributionFilterState] =
    useState<SalaryDistributionFilterhProps>(initialValues);

    const SalaryDistributionFilterForm = useFormik({
    enableReinitialize: true,
    initialValues: salaryDistributionFilterState,
    onSubmit: (values) => {},
  })

  return (
    <>
        <div className="card salary_distribution_wrap">
            <div className="card-header">
                <form onSubmit={SalaryDistributionFilterForm.handleSubmit}>
                    <div className="tw-flex tw-items-center">
                        <div className="tw-w-5/12">
                            <h4 className="tw-card-title tw-mb-0 tw-flex-grow">
                                Salary Distribution
                            </h4>
                        </div>

                        <div className="tw-w-7/12">
                            <div className='tw-flex tw-gap-3 tw-justify-end'>
                                <SelectInput
                                    name="month"
                                    value={SalaryDistributionFilterForm.values.month}
                                    onChange={SalaryDistributionFilterForm.handleChange}
                                    menuItems={selectData1}
                                    valueKey="monthType"
                                    textKey="monthType" 
                                    inputClassName="tw-bg-gray-100 tw-border-0"
                                    formgroupClassName="tw-mb-0"
                                />
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            <div className="card-body">
              <div className='tw-flex tw-flex-col tw-mb-4'>
                <span className='tw-text-[14px] tw-text-gray-500 tw-mb-1'>Nacharam</span>
                <div className='tw-flex tw-items-center'>
                  <div className='tw-inline-block tw-w-full tw-mr-2'>
                      <div className="progress salary_distribution_progress" role="progressbar" aria-label="Example 20px high" aria-valuenow={50} aria-valuemin={0} aria-valuemax={100}>
                          <div className="progress-bar tw-bg-success" style={{width: `50%`}}></div>
                      </div>
                  </div>

                  <span className='tw-text-[15px] tw-flex tw-items-center'><RupeeSvg width="11px" height="11px" fill={"#495057"} /> 1,895,850.00</span>
                </div>
              </div>

              <div className='tw-flex tw-flex-col tw-mb-4'>
                <span className='tw-text-[14px] tw-text-gray-500 tw-mb-1'>Mahendra Hills</span>
                <div className='tw-flex tw-items-center'>
                  <div className='tw-inline-block tw-w-full tw-mr-2'>
                      <div className="progress salary_distribution_progress" role="progressbar" aria-label="Example 20px high" aria-valuenow={50} aria-valuemin={0} aria-valuemax={100}>
                          <div className="progress-bar tw-bg-success" style={{width: `50%`}}></div>
                      </div>
                  </div>

                  <span className='tw-text-[15px] tw-flex tw-items-center'><RupeeSvg width="11px" height="11px" fill={"#495057"} /> 1,895,850.00</span>
                </div>
              </div>

              <div className='tw-flex tw-flex-col tw-mb-4'>
                <span className='tw-text-[14px] tw-text-gray-500 tw-mb-1'>Nadergul</span>
                <div className='tw-flex tw-items-center'>
                  <div className='tw-inline-block tw-w-full tw-mr-2'>
                      <div className="progress salary_distribution_progress" role="progressbar" aria-label="Example 20px high" aria-valuenow={50} aria-valuemin={0} aria-valuemax={100}>
                          <div className="progress-bar tw-bg-success" style={{width: `50%`}}></div>
                      </div>
                  </div>

                  <span className='tw-text-[15px] tw-flex tw-items-center'><RupeeSvg width="11px" height="11px" fill={"#495057"} /> 1,895,850.00</span>
                </div>
              </div>

              <div className='tw-flex tw-gap-3 tw-justify-center color_box_warp'>
                <div className='tw-flex tw-items-center'>
                  <div className='tw-inline-block tw-mr-2 color_box tw-bg-success'/>

                <span className='tw-text-[13px] tw-text-gray-500'>Paid</span>
                </div>

                <div className='tw-flex tw-items-center'>
                  <div className='tw-inline-block tw-mr-2 color_box tw-bg-gray-100'/>

                <span className='tw-text-[13px] tw-text-gray-500'>Pending</span>
                </div>
              </div>


            </div>
        </div>

    </>
  )
}

export default SalaryDistribution