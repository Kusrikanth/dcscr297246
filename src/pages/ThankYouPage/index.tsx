import React, { useEffect, useRef } from 'react'
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import { default as ThankYouSvg } from "../../assets/imagesdps/ThankYou.svg?react";
import HeaderLogoImg from "../../assets/imagesdps/authicon/header-logo.png";
import { useHistory, useLocation } from 'react-router-dom'
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../hooks/storehook";
import { generateRegistrationPdfAct } from '../../store/FrontDesk/AdmissionRegistration/admissionregistrationaction';
//Actions
import { generateActionPayload } from "../../utility/reduxutility";
import { logoutUserAct, setLogoutUserAct, setCleanLoginDataAct } from "../../store/login/loginaction";
import { cleanProfileAct } from "../../store/auth/profile/actions";
import { cleanAppDataStateAct } from "../../store/appdata/appdataslice";
import { getLocalStorage, removeLocalStorage } from "../../utility/storageUtility";
import { accessSessionKey, accessTokenKey, instituteIdKey } from "../../Components/constants/storageconstants";
import { getInstituteListAct } from '../../store/mastersettings/instituteinfo/instituteinfoactions';

const ThankYouPage = (props: any) => {
    const location = useLocation();
    const { state }: any = location,
        { registrationId, registrationNo, branchEmail } = state || {};
    const history = useHistory();
    useEffect(() => {
        if (!registrationId) {
            history.replace('/login');
        }
    }, [registrationId]);


    const dispatch = useAppDispatch();
    const { instituteListResp, currentInstIdResp: instituteId, registrationPdfResp, admissionRegistrationErrorResp } =
        useAppSelector(({ admissionRegistration, appData, instituteInfo }) => ({
            registrationPdfResp: admissionRegistration.registrationPdfResp,
            currentInstIdResp: appData.currentInstIdResp,
            instituteListResp: instituteInfo.instituteListResp,
            admissionRegistrationErrorResp: admissionRegistration.admissionRegistrationErrorResp,
        }), shallowEqual);
    const thankyouPageRef = useRef({
        prevRegistrationPdfResp: registrationPdfResp,
        prevAdmissionRegistrationErrorResp: admissionRegistrationErrorResp
    });

    useEffect(() => {
        const { prevRegistrationPdfResp, prevAdmissionRegistrationErrorResp } = thankyouPageRef.current;
        if (registrationPdfResp && prevRegistrationPdfResp !== registrationPdfResp) {
            const url = window.URL.createObjectURL(new Blob([(registrationPdfResp)]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${registrationNo || 'Registration'}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        }
        else if (admissionRegistrationErrorResp && admissionRegistrationErrorResp !== prevAdmissionRegistrationErrorResp) {
            const { details, message, code } = admissionRegistrationErrorResp;
            toast.error(message || "Something went wrong.");
        }
        thankyouPageRef.current.prevRegistrationPdfResp = registrationPdfResp;
        thankyouPageRef.current.prevAdmissionRegistrationErrorResp = admissionRegistrationErrorResp;
    }, [registrationPdfResp, admissionRegistrationErrorResp]);

    useEffect(() => {
        const params = { instituteGroupId: "1", pageNo: 0, pageSize: 10, };
        dispatch(getInstituteListAct(generateActionPayload("get_institute_list", undefined, params)));
    }, []);

    function downloadPdfHandler() {
        const params = {
            registrationId
        }
        dispatch(generateRegistrationPdfAct(generateActionPayload("generate_registration_pdf", params, undefined, {
            responseType: 'blob'
        })));
    }

    function logoutHndlr(event: any) {
        dispatch(logoutUserAct(generateActionPayload("logout_user",{sessionId : getLocalStorage(accessSessionKey)})));
        setTimeout(() => {
            dispatch(setCleanLoginDataAct(undefined));
            dispatch(setLogoutUserAct(undefined));
            dispatch(cleanAppDataStateAct({}));
            dispatch(cleanProfileAct(undefined));
            removeLocalStorage(accessTokenKey);
            removeLocalStorage(accessSessionKey);
            removeLocalStorage(instituteIdKey);
        }, 100);
    }

    const { data: instituteList } = instituteListResp || {};
    const instituteDetails = instituteList?.find((item: any) => item.id === +instituteId);
    return (
        <>
            <div className="thankypage-container">
                <div className="tw-px-3 tw-py-2 tw-mb-4 header-container">
                    <img src={instituteDetails?.logo} alt="header-logo"
                        className="header-logo img-fluid"
                    />
                    <div className="">
                        <button onClick={logoutHndlr} className="btn btn-outline-green tw-text-nowrap tw-float-end tw-px-4">
                            <i className="ri-logout-box-r-line tw-align-bottom tw-mr-1"></i> Logout
                        </button>
                    </div>
                </div>
                <div className="thank-you-page-top">
                    <div className="thank-you-page">
                        <div className='header'>
                        </div>
                        <div className='body'>
                            <div><ThankYouSvg className='thank-you-image' /></div>
                            <div className='text-1'>AWESOME !</div>
                            <div className='text-2'>Your Registration Form {registrationNo && <>(<span className="tw-text-green-600">{registrationNo}</span>)</>} is Submitted Successfully .</div>
                            <div className='text-2'>Thank you for registering with {instituteDetails?.instituteName}, You will be intimated
                                through mail and sms regarding the next Admission Process.</div>
                            <div className='text-3'>For any further inquiries please contact <a href='/#' onClick={e => e.preventDefault()} style={{ color: "#41BAED" }}>{branchEmail || "admission@dpssecunderabad.in"}</a></div>
                            {registrationId && <div><button onClick={downloadPdfHandler} className='button'>DOWNLOAD REGISTRATION PDF</button></div>}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ThankYouPage
