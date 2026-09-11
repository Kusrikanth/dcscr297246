import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { FullPageLoader } from "../Components/Common";
//redux
import { shallowEqual, useSelector } from "react-redux";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const NonAuthLayout = ({ children }) => {
    const {
        layoutModeType, showApiLoader
    } = useSelector(({ Layout, globalData }) => ({
        layoutModeType: Layout.layoutModeType,
        showApiLoader: globalData.showApiLoader
    }, shallowEqual));

    useEffect(() => {
        if (layoutModeType === "dark") {
            document.body.setAttribute("data-layout-mode", "dark");
        } else {
            document.body.setAttribute("data-layout-mode", "light");
        }
    }, [layoutModeType]);
    return (
        <>
            <ToastContainer />
            <div>
                {children}
            </div>
            {showApiLoader && <FullPageLoader />}
        </>
    );
};

export default withRouter(NonAuthLayout);