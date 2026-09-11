import React from 'react'
import BreadCrumb from '../../../../Components/Common/BreadCrumb'
import { default as ThankYouSvg } from "../../../../assets/imagesdps/ThankYou.svg?react"
import { useLocation } from 'react-router-dom'

const ThankYouPage = (props:any) => {
    const location=useLocation();
    return (
        <>
            <div className="">
                <div className="thank-you-page-top" style={{minHeight:"100vh"}}>
                    <div className="thank-you-page w-100">
                            <div className='header'>
                            </div>
                            <div className='body'>
                                <div><ThankYouSvg className='thank-you-image' /></div>
                                <div className='text-1'>AWSEOME !</div>
                                <div className='text-2'>Your Feedback Form is Submitted Successfully .</div>
                            </div>
                            </div>
                </div>
            </div>
        </>
    )
}

export default ThankYouPage
