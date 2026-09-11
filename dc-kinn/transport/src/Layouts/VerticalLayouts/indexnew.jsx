import React, { useEffect, useLayoutEffect, useState } from 'react';
import { shallowEqual, useSelector } from "react-redux";
import classnames from "classnames";
import PropTypes from "prop-types";
import { Link, NavLink, withRouter } from 'react-router-dom';
import { Collapse } from 'reactstrap';

// Import Data
import navdata, { menuOptions } from "../LayoutMenuData";

function SubMenusContainer({ parentId, isMenuOpen, menuLevel, menutItems, activeRouteMenuOptions, uncollapsedMenuOptions, handleClickMenu }) {
    // const isOpenCollapsible = Array.isArray(uncollapsedMenuOptions) && uncollapsedMenuOptions.includes(parentId) || false;
    return (
        <Collapse
            className="menu-dropdown"
            isOpen={isMenuOpen}
            id="sidebarApps">
            <ul className="nav nav-sm flex-column test">
                {
                    menutItems.map(item => {
                        const { childMenu } = item,
                            hasChildMenu = Array.isArray(childMenu) && childMenu.length > 0;
                        const isOpenCollapsible = Array.isArray(uncollapsedMenuOptions) && uncollapsedMenuOptions.includes(item.id) || false;
                        return (
                            <React.Fragment key={item.id}>
                                <li className="nav-item">
                                    <Link
                                        onClick={handleClickMenu}
                                        data-id={item.id}
                                        data-child={hasChildMenu}
                                        data-parentid={parentId}
                                        data-menulevel={menuLevel}
                                        // className="nav-link"
                                        className={classnames("nav-link", { "active": (activeRouteMenuOptions.includes(item.id)) })}
                                        to={item.link}
                                        data-bs-toggle={hasChildMenu ? "collapse" : undefined}
                                        aria-expanded={isOpenCollapsible}
                                        activeClassName={item.link === "/#" ? "" : "active"}
                                    >
                                        {/* <img src={item.icon} height="18" width="18"/>  */}
                                        {item.menuName}
                                    </Link>
                                    {hasChildMenu && <SubMenusContainer
                                        parentId={item.id}
                                        handleClickMenu={handleClickMenu}
                                        uncollapsedMenuOptions={uncollapsedMenuOptions}
                                        activeRouteMenuOptions={activeRouteMenuOptions}
                                        menuLevel={Number(menuLevel) + 1}
                                        menutItems={childMenu}
                                        isMenuOpen={isOpenCollapsible}
                                    />}
                                </li>
                            </React.Fragment>
                        )
                    })
                }
            </ul>
        </Collapse>
    )
}

const VerticalLayout = (props) => {
    const navData = navdata().props.children;

    const { userDetails } = useSelector((state) => ({
        userDetails: state.Profile.userDetails,
    }), shallowEqual);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        const initMenu = () => {
            const pathName = import.meta.env.PUBLIC_URL + props.location.pathname;
            const ul = document.getElementById("navbar-nav");
            const items = ul.getElementsByTagName("a");
            let itemsArray = [...items]; // converts NodeList to Array
            removeActivation(itemsArray);
            let matchingMenuItem = itemsArray.find((x) => {
                return x.pathname === pathName;
            });
            if (matchingMenuItem) {
                activateParentDropdown(matchingMenuItem);
            }
        };
        if (props.layoutType === "vertical") {
            // initMenu();
        }
    }, [props.location.pathname, props.layoutType]);

    function activateParentDropdown(item) {

        item.classList.add("active");
        let parentCollapseDiv = item.closest(".collapse.menu-dropdown");

        if (parentCollapseDiv) {

            // to set aria expand true remaining
            parentCollapseDiv.classList.add("show");
            parentCollapseDiv.parentElement.children[0].classList.add("active");
            parentCollapseDiv.parentElement.children[0].setAttribute("aria-expanded", "true");
            if (parentCollapseDiv.parentElement.closest(".collapse.menu-dropdown")) {
                parentCollapseDiv.parentElement.closest(".collapse").classList.add("show");
                if (parentCollapseDiv.parentElement.closest(".collapse").previousElementSibling)
                    parentCollapseDiv.parentElement.closest(".collapse").previousElementSibling.classList.add("active");
            }
            return false;
        }
        return false;
    }

    const removeActivation = (items) => {
        let actiItems = items.filter((x) => x.classList.contains("active"));

        actiItems.forEach((item) => {
            if (item.classList.contains("menu-link")) {
                if (!item.classList.contains("active")) {
                    item.setAttribute("aria-expanded", false);
                }
                if (item.nextElementSibling) {
                    item.nextElementSibling.classList.remove("show");
                }
            }
            if (item.classList.contains("nav-link")) {
                if (item.nextElementSibling) {
                    item.nextElementSibling.classList.remove("show");
                }
                item.setAttribute("aria-expanded", false);
            }
            item.classList.remove("active");
        });
    };

    const [openMenuState, setOpenMenuState] = useState([]);
    const [activeMenuState, setActiveMenuState] = useState([]);
    const [toggleMenusState, setToogleMenusState] = useState([]);

    // function handleClickMenu(event) {
    // const menuId = event.currentTarget.getAttribute("data-id");
    // const hasChild = event.currentTarget.getAttribute("data-child");
    // const parentId = event.currentTarget.getAttribute("data-parentid");
    //     if (hasChild === "true") {
    //         event.preventDefault();
    //         // let updateOpenMenuState = [...openMenuState];
    //         // const inOpenStateIndex = updateOpenMenuState.indexOf(menuId);
    //         // if (inOpenStateIndex >= 0) {
    //         //     updateOpenMenuState.splice(inOpenStateIndex, updateOpenMenuState.length);
    //         // } else {
    //         //     updateOpenMenuState.push(menuId);
    //         // }
    //         setOpenMenuState(updateOpenMenuState);
    //     } else {
    //         if (parentId) {
    //             const updateOpenMenuState = [...openMenuState, menuId];
    //             setActiveMenuState(updateOpenMenuState);
    //         } else {
    //             setActiveMenuState([menuId]);
    //         }
    //     }
    // }

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
                // updatedToggleMenuState[Number(menuLevel)] = [menuId];
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
    }

    const { role = "INSTITUTE_ADMIN" } = userDetails || {};
    return (
        <React.Fragment>
            {/* menu Items */}
            {
                Array.isArray(menuOptions) && menuOptions.map((item) => {
                    const { childMenu } = item,
                        hasChildMenu = Array.isArray(childMenu) && childMenu.length > 0;
                    const isOpenCollapsible = Array.isArray(openMenuState) && openMenuState.includes(item.id) || false;
                    return (
                        <React.Fragment key={item.id}><li className="nav-item">
                            <Link
                                onClick={handleClickMenu}
                                data-id={item.id}
                                data-child={hasChildMenu}
                                data-parentid={undefined}
                                data-menulevel={0}
                                className={classnames("nav-link menu-link", { "active": (activeMenuState.includes(item.id)) })}
                                to={item.link}
                                data-bs-toggle={hasChildMenu ? "collapse" : undefined}
                                aria-expanded={isOpenCollapsible}
                                activeClassName={item.link === "/#" ? "" : "active"}
                            >
                                {/* <img src={item.icon} height="18" width="18"/>  */}
                                {item.icon && <i className={item.icon}></i>}
                                {item.iconImage}
                                <span>{item.menuName}</span>
                            </Link>
                            {hasChildMenu && <SubMenusContainer
                                parentId={item.id}
                                handleClickMenu={handleClickMenu}
                                uncollapsedMenuOptions={openMenuState}
                                activeRouteMenuOptions={activeMenuState}
                                menutItems={childMenu}
                                isMenuOpen={isOpenCollapsible}
                                menuLevel={1}
                            />}
                        </li></React.Fragment>)
                })
            }
            {
                (navData || []).map((item, key) => {
                    return (
                        <React.Fragment key={key}>
                            {/* Main Header */}
                            {
                                (item.roleName?.indexOf(role) > -1 && (item.subItems ? (
                                    <li className="nav-item">
                                        <Link
                                            onClick={item.click}
                                            className="nav-link menu-link"
                                            to={item.link ? item.link : "/#"}
                                            data-bs-toggle="collapse"
                                        >
                                            {item.iconImage}
                                            <span data-key="t-apps">{props.t(item.label)}</span>
                                        </Link>
                                        <Collapse
                                            className="menu-dropdown"
                                            isOpen={item.stateVariables}
                                            id="sidebarApps">
                                            <ul className="nav nav-sm flex-column test">
                                                {/* subItms  */}
                                                {item.subItems && ((item.subItems || []).map((subItem, key) => (
                                                    <React.Fragment key={key}>
                                                        {!subItem.isChildItem ? (
                                                            <li className="nav-item">
                                                                <Link
                                                                    to={subItem.link ? subItem.link : "/#"}
                                                                    className="nav-link"
                                                                >
                                                                    {props.t(subItem.label)}
                                                                    {subItem.badgeName ?
                                                                        <span className={"badge badge-pill bg-" + subItem.badgeColor} data-key="t-new">{subItem.badgeName}</span>
                                                                        : null}
                                                                </Link>
                                                            </li>
                                                        ) : (
                                                            <li className="nav-item">
                                                                <Link
                                                                    onClick={subItem.click}
                                                                    className="nav-link"
                                                                    to="/#"
                                                                    data-bs-toggle="collapse"
                                                                > {props.t(subItem.label)}
                                                                </Link>
                                                                <Collapse className="menu-dropdown" isOpen={subItem.stateVariables} id="sidebarEcommerce">
                                                                    <ul className="nav nav-sm flex-column">
                                                                        {subItem.childItems && (
                                                                            (subItem.childItems || []).map((childItem, key) => (
                                                                                <React.Fragment key={key}>
                                                                                    {!childItem.childItems ?
                                                                                        <li className="nav-item">
                                                                                            <Link
                                                                                                to={childItem.link ? childItem.link : "/#"}
                                                                                                className="nav-link">
                                                                                                {props.t(childItem.label)}
                                                                                            </Link>
                                                                                        </li>
                                                                                        : <li className="nav-item">
                                                                                            <Link to="/#" className="nav-link" onClick={childItem.click} data-bs-toggle="collapse">
                                                                                                {props.t(childItem.label)} <span className="badge badge-pill bg-danger" data-key="t-new">New</span>
                                                                                            </Link>
                                                                                            <Collapse className="menu-dropdown" isOpen={childItem.stateVariables} id="sidebaremailTemplates">
                                                                                                <ul className="nav nav-sm flex-column">
                                                                                                    {childItem.childItems.map((subChildItem, key) => (
                                                                                                        <li className="nav-item" key={key}>
                                                                                                            <Link to={subChildItem.link} className="nav-link" data-key="t-basic-action">{props.t(subChildItem.label)} </Link>
                                                                                                        </li>
                                                                                                    ))}
                                                                                                </ul>
                                                                                            </Collapse>
                                                                                        </li>
                                                                                    }
                                                                                </React.Fragment>
                                                                            ))
                                                                        )}
                                                                    </ul>
                                                                </Collapse>
                                                            </li>
                                                        )}
                                                    </React.Fragment>
                                                ))
                                                )}
                                            </ul>

                                        </Collapse>
                                    </li>
                                ) : (
                                    <li className="nav-item">
                                        <Link
                                            className="nav-link menu-link"
                                            to={item.link ? item.link : "/#"}>
                                            {/* <img src={item.icon} height="18" width="18"/>  */}
                                            {item.icon && <i className={item.icon}></i>}
                                            {item.iconImage}
                                            <span>{props.t(item.label)}</span>
                                        </Link>
                                    </li>
                                )))

                            }
                        </React.Fragment>
                    );
                })
            }
        </React.Fragment >
    );
};

VerticalLayout.propTypes = {
    location: PropTypes.object,
    t: PropTypes.any,
};

export default withRouter(VerticalLayout);
