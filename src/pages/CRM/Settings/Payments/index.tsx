import { useMemo, useState, type MouseEvent } from "react";

import UpdatedHorizontalTab from "../../../../Components/Common/UpdatedHorizontalTab";
import { type SettingsPageProps, withSettingsPage } from "../index";
import BulkLinks from "./BulkLinks";
import Collections from "./Collections";
import EnquiryForms from "./EnquiryForms";
import PaymentForms from "./PaymentForms";

const tabIds = ["forms", "collections", "bulk-links", "enquiry"];

const Payments = ({ initialTab }: SettingsPageProps) => {
    const [activeId, setActiveId] = useState<string>(
        initialTab && tabIds.includes(initialTab) ? initialTab : "forms",
    );

    const menuOptions = useMemo(
        () => [
            {
                id: "forms",
                labelName: "Payment Forms",
                customPadding: "0px 10px 0px 10px",
            },
            {
                id: "collections",
                labelName: "Collections",
                customPadding: "0px 10px 0px 10px",
            },
            {
                id: "bulk-links",
                labelName: "Bulk Links",
                customPadding: "0px 10px 0px 10px",
            },
            {
                id: "enquiry",
                labelName: "Enquiry Forms",
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
                {activeId === "forms" && <PaymentForms />}

                {activeId === "collections" && <Collections />}

                {activeId === "bulk-links" && <BulkLinks />}

                {activeId === "enquiry" && <EnquiryForms />}
            </div>
        </>
    );
};

const PaymentsPage = withSettingsPage(Payments, "Payments");

export default PaymentsPage;
