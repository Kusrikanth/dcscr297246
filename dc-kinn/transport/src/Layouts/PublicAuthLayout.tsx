import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';

import { withRouter, Link } from 'react-router-dom';

//redux
import { useSelector } from "react-redux";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//Images
import StudentIntroImg from "../assets/imagesdps/authicon/auth-right-section-img.png";
import WhiteDotsImg from "../assets/imagesdps/authicon/white-dots.png";
import GreyDotsImg from "../assets/imagesdps/authicon/grey-dots.png";
import HeaderLogoImg from "../assets/imagesdps/authicon/header-logo.png";

import AppleIconSvg from "../assets/imagesdps/authicon/apple-icon.svg";
import QrCodeIconSvg from "../assets/imagesdps/authicon/qrcode-icon.svg";
import GooglePlayIconSvg from "../assets/imagesdps/authicon/google-play-icon.svg";
import { FullPageLoader } from "../Components/Common";


import "./publicauth.scss";

const PublicAuthLayout: React.FC<any> = ({ children }) => {
    const headerContainer = useRef(null);
    const {
        layoutModeType, showApiLoader
    } = useSelector((state: any) => ({
        layoutModeType: state.Layout.layoutModeType,
        showApiLoader: state.globalData.showApiLoader
    }));


    useLayoutEffect(() => {
        // const containerWidth = headerContainer.current.clientWidth;
        // setDynamicCircleStyleState(prevState => ({
        //     ...prevState,
        //     height: `${containerWidth + 200}px`,
        //     width: `${containerWidth + 200}px`,
        //     left: `-${100}px`
        // }));
        // setLoginContainerWidth();
    }, [headerContainer]);

    // useEffect(() => {

    // }, [layoutModeType]);

    return (
        <>
            <ToastContainer />
            <section className="auth-page-container">
                <div className="container-fluid px-0">
                    <div className="row g-0">
                        <div className="col-xs-12 col-md-6 left-section px-4 py-4">
                            <img src={WhiteDotsImg} alt="white-dots-img"
                                className="white-dots-img img-fluid"
                            />
                            <img src={GreyDotsImg} alt="grey-dots-img "
                                className="grey-dots-img img-fluid"
                            />
                            <img src={HeaderLogoImg} alt="header-logo"
                                className="header-logo img-fluid"
                            />

                            <div className="row form-container-row">

                                {children}
                                <div className="col-12 d-flex justify-content-center align-items-center fs-7">
                                    <span className="fw-bold me-2">
                                        Powered By
                                    </span>
                                    <span className="fw-bold text-info">
                                        STA Solutions Pvt Ltd
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className='col-xs-12 position-relative col-md-6 py-4 px-4'>
                            <div className="d-flex flex-wrap align-items-center download-app-container mb-5 float-end p-2">
                                <img src={QrCodeIconSvg} className="img-fluid me-2 mb-2 mb-lg-0" alt="student-image" />
                                <span className="fs-6 me-2 text-nowrap">Download Mobile App</span>
                                <a href="https://apps.apple.com/in/app/dc-digitalcaampus/id6504325051"
                                    rel="noreferrer"
                                    target="_blank">
                                    <button className="download-btn p-2 me-2">
                                        <img src={AppleIconSvg} className="img-fluid me-1" alt="student-image" />
                                        <div className="d-flex flex-column align-items-center">
                                            <span className="download-text">Download on</span>
                                            <span className="fs-5 fw-bold lh-1 text-nowrap">App Store</span>
                                        </div>
                                    </button>
                                </a>
                                <a href="https://play.google.com/store/apps/details?id=com.sta.dpsdigitalcaampus"
                                    rel="noreferrer"
                                    target="_blank">
                                    <button className="download-btn p-2 me-1">
                                        <img src={GooglePlayIconSvg} className="img-fluid me-1" alt="student-image" />
                                        <div className="d-flex flex-column align-items-center">
                                            <span className="download-text">Available app on</span>
                                            <span className="fs-5 fw-bold lh-1 text-nowrap">Google Play</span>
                                        </div>
                                    </button>
                                </a>
                            </div>

                            <img src={StudentIntroImg} className="img-fluid w-100" alt="student-image" />
                            <div className="text-muted copyright-container fs-7">
                                ©COPYRIGHT 2024 BY DELHI PUBLIC SCHOOL. ALL RIGHT RESERVED
                            </div>
                        </div>
                    </div>

                </div>
            </section>
            {showApiLoader && <FullPageLoader />}
        </>
    );
};

export default withRouter(PublicAuthLayout);