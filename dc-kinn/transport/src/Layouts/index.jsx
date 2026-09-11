import React, { useEffect, useRef, useState } from 'react';
import { shallowEqual } from "react-redux";
import { withRouter } from "react-router-dom";
//import Components
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { FullPageLoader } from "../Components/Common";
//import actions
import {
    changeLayout,
    changeSidebarTheme,
    changeLayoutMode,
    changeLayoutWidth,
    changeLayoutPosition,
    changeTopbarTheme,
    changeLeftsidebarSizeType,
    changeLeftsidebarViewType,
    changeSidebarImageType
} from "../store/actions";
//redux
import { useSelector, useDispatch } from "react-redux";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Layout = (props) => {
    const dispatch = useDispatch();
    const {
        layoutType,
        leftSidebarType,
        layoutModeType,
        layoutWidthType,
        layoutPositionType,
        topbarThemeType,
        leftsidbarSizeType,
        leftSidebarViewType,
        leftSidebarImageType,
        showApiLoader
    } = useSelector(({ Layout, globalData }) => ({
        layoutType: Layout.layoutType,
        leftSidebarType: Layout.leftSidebarType,
        layoutModeType: Layout.layoutModeType,
        layoutWidthType: Layout.layoutWidthType,
        layoutPositionType: Layout.layoutPositionType,
        topbarThemeType: Layout.topbarThemeType,
        leftsidbarSizeType: Layout.leftsidbarSizeType,
        leftSidebarViewType: Layout.leftSidebarViewType,
        leftSidebarImageType: Layout.leftSidebarImageType,
        showApiLoader: globalData.showApiLoader
    }), shallowEqual);

    /*
    layout settings
    */
    useEffect(() => {
        if (
            layoutType ||
            leftSidebarType ||
            layoutModeType ||
            layoutWidthType ||
            layoutPositionType ||
            topbarThemeType ||
            leftsidbarSizeType ||
            leftSidebarViewType ||
            leftSidebarImageType
        ) {
            dispatch(changeLeftsidebarViewType(leftSidebarViewType));
            dispatch(changeLeftsidebarSizeType(leftsidbarSizeType));
            dispatch(changeSidebarTheme(leftSidebarType));
            dispatch(changeLayoutMode(layoutModeType));
            dispatch(changeLayoutWidth(layoutWidthType));
            dispatch(changeLayoutPosition(layoutPositionType));
            dispatch(changeTopbarTheme(topbarThemeType));
            dispatch(changeLayout(layoutType));
            dispatch(changeSidebarImageType(leftSidebarImageType))
        }
    }, [layoutType,
        leftSidebarType,
        layoutModeType,
        layoutWidthType,
        layoutPositionType,
        topbarThemeType,
        leftsidbarSizeType,
        leftSidebarViewType,
        leftSidebarImageType,
        dispatch]);
    /*
    call dark/light mode
    */
    const onChangeLayoutMode = (value) => {
        if (changeLayoutMode) {
            dispatch(changeLayoutMode(value));
        }
    };

    const [headerClass, setHeaderClass] = useState("");
    // class add remove in header
    useEffect(() => {
        window.addEventListener("scroll", scrollNavigation, true);
    });
    function scrollNavigation() {
        var scrollup = document.documentElement.scrollTop;
        if (scrollup > 50) {
            setHeaderClass("topbar-shadow");
        } else {
            setHeaderClass("");
        }
    }

    return (
        <React.Fragment>
            <div id="layout-wrapper">
                <Header
                    headerClass={headerClass}
                    layoutModeType={layoutModeType}
                    onChangeLayoutMode={onChangeLayoutMode} />
                <Sidebar layoutType={layoutType} />
                <ToastContainer />
                <div className="main-content">
                    {props.children}
                    <Footer />
                </div>
                {showApiLoader && <FullPageLoader />}
            </div>

        </React.Fragment>

    );
};

export default withRouter(Layout);