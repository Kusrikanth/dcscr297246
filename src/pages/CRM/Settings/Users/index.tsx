import { useMemo, useState, type MouseEvent } from "react";

import UpdatedHorizontalTab from "../../../../Components/Common/UpdatedHorizontalTab";
import { type SettingsPageProps, withSettingsPage } from "../index";
import AccessControlTab from "./AccessControlTab";
import UsersTab from "./UsersTab";
import { accessRoles } from "./accesscontrolhelper";
import { crmUsers } from "./helper";

const Users = ({ initialTab }: SettingsPageProps) => {
    const [activeId, setActiveId] = useState<string>(
        initialTab === "access" ? "access" : "users",
    );

    const menuOptions = useMemo(
        () => [
            {
                id: "users",
                labelName: "Users",
                customPadding: "0px 10px 0px 10px",
                count: crmUsers.length,
            },
            {
                id: "access",
                labelName: "Access Control",
                customPadding: "0px 10px 0px 10px",
                count: accessRoles.length,
            },
        ],
        [],
    );

    const clickMenuHandler = (event: MouseEvent<HTMLElement>) => {
        const menuId = event.currentTarget.getAttribute("data-id");

        if (menuId) {
            setActiveId(menuId);
        }
    };

    return (
        <>
            <UpdatedHorizontalTab
                MenuOptions={menuOptions}
                clickMenuHandler={clickMenuHandler}
                activeTabId={activeId}
                showBadge
                horizontalClass=""
            />

            <div className="tw-mt-3">
                {activeId === "users" && <UsersTab />}

                {activeId === "access" && <AccessControlTab />}
            </div>
        </>
    );
};

const UsersPage = withSettingsPage(Users, "User Management");

export default UsersPage;
