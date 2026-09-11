import React from 'react'
import NoData from '../../assets/images/NoData.png'

const NoDataComp = ({ title, helperText }: any) => {
  return (
    <div className='!tw-inline-block !tw-w-full !tw-py-4'>
      <div className='!tw-flex !tw-flex-col !tw-items-center'>
        <span className='!tw-flex !tw-justify-center !tw-items-center !tw-rounded-full !tw-mb-3' style={{ width: "100px", height: "100px", backgroundColor: "#F8F8F8" }} >
          <img src={NoData} alt="" style={{ width: "54px" }} />
        </span>
        <h6 className='!tw-text-base !tw-mb-2'>{title || "Sorry ! No Results Found"}</h6>
        {helperText && <p className='!tw-text-center !tw-text-gray-500'>
          {helperText}
        </p>}
        {/* <h5 className='fw-normal text-muted mb-5'>Try adjusting your search or filter to find for what you are looking for.</h5>
      <h6 className='text-muted'>Not sure where to start?<span className='text-info'>Watch this video</span> or visit our <span className='text-info'>Help Center</span></h6> */}
      </div>
    </div>
  )
}

export default NoDataComp
