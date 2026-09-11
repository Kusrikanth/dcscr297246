import { useMemo, useState, type MouseEvent } from "react";

import UpdatedHorizontalTab from "../../../../Components/Common/UpdatedHorizontalTab";
import { type SettingsPageProps, withSettingsPage } from "../index";
import EmailTemplates from "./EmailTemplates";
import SmsTemplates from "./SmsTemplates";
import WhatsAppTemplates from "../../WhatsApp/Templates";
const tabIds = ["whatsapp", "sms", "email"];

const Templates = ({ initialTab }: SettingsPageProps) => {
    const [activeId, setActiveId] = useState<string>(
        initialTab && tabIds.includes(initialTab) ? initialTab : "whatsapp",
    );

    const menuOptions = useMemo(
        () => [
            {
                id: "whatsapp",
                labelName: "WhatsApp",
                customPadding: "0px 10px 0px 10px",
            },
            {
                id: "sms",
                labelName: "SMS",
                customPadding: "0px 10px 0px 10px",
            },
            {
                id: "email",
                labelName: "Email",
                customPadding: "0px 10px 0px 10px",
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
                horizontalClass=""
            />

            <div className="tw-mt-3" key={activeId}>
                {activeId === "whatsapp" && (
                    <WhatsAppTemplates />
                )}

                {activeId === "sms" && <SmsTemplates />}

                {activeId === "email" && <EmailTemplates />}
            </div>
        </>
    );
};

const TemplatesPage = withSettingsPage(Templates, "Templates");

export default TemplatesPage;
