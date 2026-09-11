import type { ComponentType } from "react";

import BreadCrumb from "../../../Components/Common/BreadCrumb";

export interface SettingsPageProps {
    initialTab?: string;
}

export const withSettingsPage = <Props extends object>(
    Content: ComponentType<Props>,
    pageTitle: string,
) => {
    const SettingsPage = (props: Props) => (
        <div className="page-content">
            <div className="container-fluid">
                <BreadCrumb pageTitle={pageTitle} />
                <Content {...props} />
            </div>
        </div>
    );

    SettingsPage.displayName = `${Content.displayName || Content.name || "CRM"}Page`;

    return SettingsPage;
};
