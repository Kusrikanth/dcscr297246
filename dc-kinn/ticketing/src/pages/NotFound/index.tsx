import React from 'react';
import { Link } from 'react-router-dom';

import { shallowEqual } from "react-redux";
//Custom Hooks
import { generateActionPayload } from "../../utility/reduxutility";
import { useAppDispatch, useAppSelector } from "../../hooks/storehook";
import { logoutUserAct, setLogoutUserAct, setCleanLoginDataAct } from "../../store/login/loginaction";
import { cleanProfileAct } from "../../store/auth/profile/actions";
import { cleanAppDataStateAct } from "../../store/appdata/appdataslice";
import { getLocalStorage, removeLocalStorage } from "../../utility/storageUtility";
import { accessSessionKey, accessTokenKey, instituteIdKey } from "../../Components/constants/storageconstants";

const NotFound = () => {
    const dispatch = useAppDispatch();

    function logoutHndlr(event: any) {
        dispatch(logoutUserAct(generateActionPayload("logout_user", { sessionId: getLocalStorage(accessSessionKey) })));
        setTimeout(() => {
            dispatch(setCleanLoginDataAct(undefined));
            dispatch(setLogoutUserAct(undefined));
            dispatch(cleanAppDataStateAct({}));
            dispatch(cleanProfileAct(undefined));
            removeLocalStorage(accessTokenKey);
            removeLocalStorage(instituteIdKey);
            removeLocalStorage(accessSessionKey);
        }, 100);
    }

    return (
        <React.Fragment>
            <div className="auth-page-content">

                <div className="auth-page-wrapper tw-py-12 tw-flex tw-justify-center tw-items-center tw-min-h-screen">
                    <div className="auth-page-content tw-overflow-hidden tw-p-0 tw-w-full">
                        <div className="container tw-mx-auto">
                            <div className="tw-flex tw-justify-center">
                                <div className="tw-w-full lg:tw-w-8/12 xl:tw-w-7/12">
                                    <div className="tw-text-center">
                                        {/* <img src={error400cover} alt="error img" className="img-fluid" /> */}
                                        <div className="tw-mt-3">
                                            <h3 className="tw-uppercase tw-text-xl tw-font-semibold tw-mb-2">Sorry, Page not Found.</h3>
                                            <p className="tw-text-gray-500 tw-mb-4">The page you are looking for not available!</p>
                                            <Link onClick={logoutHndlr} to="/login" className="!tw-px-4 !tw-py-2 !tw-rounded-md tw-inline-block !tw-text-white !tw-bg-[#1bb3a6] hover:!tw-bg-[#099885]"><i className="mdi mdi-home tw-me-1"></i>Back to Login</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default NotFound;