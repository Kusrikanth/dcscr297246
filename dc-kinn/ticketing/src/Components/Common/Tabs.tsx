import React from "react";
import { Nav, NavItem, NavLink } from "reactstrap";

import classnames from "classnames";

export interface ITabItem {
    tabId: string,
    tabName: string,
    badgeCount?: number | undefined,
}
export interface ITabsProps {
    tabsList: Array<ITabItem>
    activeTabId: (string | null),
    tabChangeHndlr: any,
    navContainerClass?: string,
}

export const Tabs = ({ tabsList, activeTabId, tabChangeHndlr, navContainerClass = "" }: ITabsProps) => {

    function tabClickHandler(event: React.MouseEvent<HTMLElement>) {
        const tabId = event.currentTarget.getAttribute("data-id");
        tabChangeHndlr(tabId);
    }
    return (
        <Nav className={classnames("nav-tabs-custom rounded", navContainerClass)}
            role="tablist" >
            {
                tabsList.map(item => (
                    <React.Fragment key={item.tabId}>
                        <NavItem>
                            <NavLink
                                data-id={item.tabId}
                                className={classnames({ active: (item.tabId === activeTabId) })}
                                onClick={tabClickHandler} style={{cursor:"pointer"}}>
                                {item.tabName}
                                {item.badgeCount && (item.badgeCount) > 0 && <span className="badge badge-soft-danger tw-align-middle rounded-pill tw-ms-1">
                                    {item.badgeCount}
                                </span>}
                            </NavLink>
                        </NavItem>
                    </React.Fragment>
                ))
            }
        </Nav >
    )
}
