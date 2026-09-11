import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { shallowEqual, useSelector } from "react-redux";
import classnames from "classnames";
import PropTypes from "prop-types";
import { Link, NavLink, withRouter } from 'react-router-dom';
import { Collapse } from 'reactstrap';

// Import Data
import { generateMenuOptions, filterRoutesHndlr } from "../LayoutMenuData";
import FloatingHelpButton  from "./FloatingHelpButton";

function SubMenusContainer({ parentId, isMenuOpen, menuLevel, menutItems, hiddenSubmodulesIds, activeRouteMenuOptions, uncollapsedMenuOptions, handleClickMenu }) {
    // const isOpenCollapsible = Array.isArray(uncollapsedMenuOptions) && uncollapsedMenuOptions.includes(parentId) || false;
    return (
        <Collapse
            className="menu-dropdown"
            isOpen={isMenuOpen}
            id="sidebarApps">
            <ul className="nav nav-sm flex-column test">
                {
                    menutItems.map(item => {
                        const isOpenCollapsible = Array.isArray(uncollapsedMenuOptions) && uncollapsedMenuOptions.includes(item.id) || false;
                        if (Array.isArray(hiddenSubmodulesIds) && hiddenSubmodulesIds.includes(item.id)) {
                            return;
                        }
                        return (
                            <React.Fragment key={item.id}>
                                <li className="nav-item">
                                    {
                                        item.externalLink ? (
                                            <a
                                                className="nav-link"
                                                href={item.externalLink}
                                                rel="noopener noreferrer"
                                                target="_blank"
                                            >{item.menuName}</a>
                                        ) :
                                            <Link
                                                onClick={handleClickMenu}
                                                data-id={item.id}
                                                data-child={item?.hasChildMenu}
                                                data-parentid={parentId}
                                                data-menulevel={menuLevel}
                                                // className="nav-link"
                                                className={classnames("nav-link", { "active": (activeRouteMenuOptions.includes(item.id)) })}
                                                to={item.link}
                                                data-bs-toggle={item?.hasChildMenu ? "collapse" : undefined}
                                                aria-expanded={isOpenCollapsible}
                                            // activeClassName={item.link === "/#" ? "" : "active"}
                                            >
                                                {/* <img src={item.icon} height="18" width="18"/>  */}
                                                {item.menuName}
                                            </Link>
                                    }

                                    {item?.hasChildMenu && <SubMenusContainer
                                        parentId={item.id}
                                        handleClickMenu={handleClickMenu}
                                        hiddenSubmodulesIds={hiddenSubmodulesIds}
                                        uncollapsedMenuOptions={uncollapsedMenuOptions}
                                        activeRouteMenuOptions={activeRouteMenuOptions}
                                        menuLevel={Number(menuLevel) + 1}
                                        menutItems={item.childMenu}
                                        isMenuOpen={isOpenCollapsible}
                                    />}
                                </li>
                            </React.Fragment>
                        )
                    })
                }
            </ul>
        </Collapse >
    )
}

function findRoutesInfo(menuOptions, routePath, openMenuState) {
    const hasRoutePath = Array.isArray(menuOptions) && menuOptions.find(item => {
        const { childRoutes } = item;
        if (item.link === routePath || (Array.isArray(childRoutes) && childRoutes.includes(routePath))) {
            return true;
        }
        return false;
    });
    if ((hasRoutePath && hasRoutePath?.hasChildMenu)) {
        openMenuState.push([hasRoutePath.id]);
        return findRoutesInfo(hasRoutePath.childMenu, routePath, openMenuState);
    } else if (hasRoutePath) {
        openMenuState.push([hasRoutePath.id]);
        return openMenuState;
    } else {
        return openMenuState;
    }
}

const VerticalLayout = (props) => {
    const { userDetails, sideBarMenuOpenState, virtualRoleResp } = useSelector(({ Profile, appData }) => ({
        userDetails: Profile.userDetails,
        sideBarMenuOpenState: appData.sideBarMenuOpenState,
        virtualRoleResp: appData.virtualRoleResp,
    }), shallowEqual);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [props.location.pathname, sideBarMenuOpenState, props.layoutType]);

    useEffect(() => {
        const onMountRouteName = props.location.pathname;
        if (onMountRouteName) {
            const startRoutePath = onMountRouteName.split("/");
            if (startRoutePath[1]) {
                const toFindRoutePath = `/${startRoutePath[1]}`;
                const menuOptions = generateMenuOptions("");
                const openMenusOnMount = findRoutesInfo(menuOptions, toFindRoutePath, []);
                if (Array.isArray(openMenusOnMount) && openMenusOnMount.length > 0) {
                    const updateOpenMenuOnMount = [...openMenusOnMount];
                    const selectedMenu = updateOpenMenuOnMount.splice(updateOpenMenuOnMount.length - 1, updateOpenMenuOnMount.length);
                    toggleMenuHandler(updateOpenMenuOnMount, selectedMenu[0][0]);
                }
            }
        }
    }, [props.location.pathname]);

    const openMenuStateRef = useRef(undefined);

    const [openMenuState, setOpenMenuState] = useState([]);
    const [activeMenuState, setActiveMenuState] = useState([]);
    const [toggleMenusState, setToogleMenusState] = useState([]);

    function handleClickMenu(event) {
        const menuId = event.currentTarget.getAttribute("data-id");
        const hasChild = event.currentTarget.getAttribute("data-child");
        const parentId = event.currentTarget.getAttribute("data-parentid");
        const menuLevel = event.currentTarget.getAttribute("data-menulevel");
        if (hasChild === "true") {
            event.preventDefault();
            const updatedToggleMenuState = [...toggleMenusState];
            if (updatedToggleMenuState[Number(menuLevel)]) {
                const levelMenuOption = [...updatedToggleMenuState[Number(menuLevel)]];
                const indexOfMenuId = levelMenuOption.indexOf(menuId);
                if (indexOfMenuId >= 0) {
                    updatedToggleMenuState.splice(Number(menuLevel), updatedToggleMenuState.length);
                } else {
                    updatedToggleMenuState[Number(menuLevel)] = [menuId];
                    updatedToggleMenuState.splice(Number(menuLevel) + 1, updatedToggleMenuState.length);
                }
            } else {
                updatedToggleMenuState[Number(menuLevel)] = [menuId];
                updatedToggleMenuState.splice(Number(menuLevel) + 1, updatedToggleMenuState.length);
            }
            toggleMenuHandler(updatedToggleMenuState);
        } else {
            if (parentId) {
                const updatedToggleMenuState = [...toggleMenusState];
                toggleMenuHandler(updatedToggleMenuState, menuId);
            } else {
                toggleMenuHandler([], menuId);
            }
        }
    }

    function toggleMenuHandler(updatedToggleMenuState, menuId) {
        const openMenuOptions = Array.prototype.flat.call(updatedToggleMenuState);
        if (menuId) {
            setActiveMenuState([...openMenuOptions, menuId]);
        }
        setToogleMenusState(updatedToggleMenuState);
        setOpenMenuState(openMenuOptions);
        openMenuStateRef.current = updatedToggleMenuState;
    }
    const { instituteId, instituteCode } = props;
    const allowedMenuOptions = useMemo(() => {
        const { role } = userDetails || {};
        if (virtualRoleResp) {
            return filterRoutesHndlr(virtualRoleResp, instituteCode);
        } else if (role) {
            return filterRoutesHndlr(role, instituteCode);
        } else {
            return [];
        }
    }, [userDetails, instituteCode, virtualRoleResp]);
    return (
        <React.Fragment>
            {/* menu Items */}
            {
                Array.isArray(allowedMenuOptions) && allowedMenuOptions.map((item) => {
                    const isOpenCollapsible = Array.isArray(openMenuState) && openMenuState.includes(item.id);
                    return (
                        <React.Fragment key={item.id}><li className="nav-item">
                            <Link
                                onClick={handleClickMenu}
                                data-id={item.id}
                                data-child={item?.hasChildMenu}
                                data-parentid={undefined}
                                data-menulevel={0}
                                className={classnames("nav-link menu-link", { "active": (activeMenuState.includes(item.id)) })}
                                to={item.link}
                                data-bs-toggle={item?.hasChildMenu ? "collapse" : undefined}
                                aria-expanded={isOpenCollapsible}
                            // activeClassName={item.link === "/#" ? "" : "active"}
                            >
                                {/* <img src={item.icon} height="18" width="18"/>  */}
                                {item.icon && <i className={item.icon}></i>}
                                {item.iconImage}
                                <span>{item.menuName}</span>
                            </Link>
                            {item?.hasChildMenu && <SubMenusContainer
                                parentId={item.id}
                                hiddenSubmodulesIds={props.hiddenSubmodulesIds || []}
                                handleClickMenu={handleClickMenu}
                                uncollapsedMenuOptions={openMenuState}
                                activeRouteMenuOptions={activeMenuState}
                                menutItems={item.childMenu}
                                isMenuOpen={isOpenCollapsible}
                                menuLevel={1}
                            />}
                        </li></React.Fragment>)
                })
            }
            <FloatingHelpButton/>
        </React.Fragment >
    );
};

VerticalLayout.propTypes = {
    location: PropTypes.object,
    t: PropTypes.any,
};

export default withRouter(VerticalLayout);
