import { useState, type MouseEvent } from "react";
import { useHistory } from "react-router-dom";

import UpdatedHorizontalTab from "../../../../Components/Common/UpdatedHorizontalTab";
import { Button, StatusLabel } from "../../../../Components/Common";
import { formatDateTime } from "../helper";
import FieldMappingPanel from "./FieldMappingPanel";
import GoogleSheetsConfigPanel from "./GoogleSheetsConfigPanel";
import SmartpingConfigPanel from "./SmartpingConfigPanel";
import SmartpingSmsConfigPanel from "./SmartpingSmsConfigPanel";
import {
    isAuthorized,
    providerScreens,
    statusLabel,
    syncLogs,
    type Integration,
} from "./helper";

interface IntegrationDetailsModalProps {
    data: Integration;
    toggle: () => void;
    onAuthorize: (integration: Integration) => void;
}

const handoffCopy: Record<string, { title: string; text: string; action: string }> =
{
    google_sheets: {
        title: "Google Sheets is authorized",
        text: "Sheet selection, field mapping, data sync and sync history are managed on the Google Sheets screen.",
        action: "Open Google Sheets",
    },
    callerdesk: {
        title: "CallerDesk calling integration",
        text: "API credentials, branch DIDs, CRM user mappings, webhooks and dialling queues are managed on the Calling screen.",
        action: "Open Calling",
    },
};

const IntegrationDetailsModal = ({
    data,
    toggle,
    onAuthorize,
}: IntegrationDetailsModalProps) => {
    const history = useHistory();
    const [tab, setTab] = useState<string>("settings");
    const [syncResult, setSyncResult] = useState<{
        imported: number;
        skipped: number;
        failed: number;
        exported: number;
        message: string;
    } | null>(null);

    const authorized = isAuthorized(data);
    const handoff =
        data.providerName === "google_sheets" && !authorized
            ? undefined
            : handoffCopy[data.providerName];

    const providerTitle =
        data.providerName === "google_sheets"
            ? "Google Sheets"
            : data.providerName;

    const canAuthorize =
        !authorized &&
        !["callerdesk", "smartping_sms"].includes(data.providerName);

    const hasGenericPanels =
        authorized &&
        !["smartping", "google_sheets"].includes(data.providerName);

    const menuOptions = [
        { id: "settings", labelName: "Settings" },
        ...(hasGenericPanels
            ? [
                { id: "mapping", labelName: "Field Mapping" },
                { id: "sync", labelName: "Sync Data" },
                { id: "logs", labelName: "Sync Logs" },
            ]
            : []),
    ].map(option => ({ ...option, customPadding: "0px 10px 0px 10px" }));

    const clickMenuHandler = (event: MouseEvent<HTMLElement>) => {
        const menuId = event.currentTarget.getAttribute("data-id");

        if (menuId) {
            setTab(menuId);
        }
    };

    return (
        <div className="tw-p-4">
            <div className="tw-mb-3 tw-border-b tw-border-gray-200 tw-pb-2">
                <UpdatedHorizontalTab
                    MenuOptions={menuOptions}
                    clickMenuHandler={clickMenuHandler}
                    activeTabId={tab}
                    horizontalClass=""
                />
            </div>

            {tab === "settings" && (
                <>
                    <dl className="tw-mb-3 tw-rounded tw-border tw-border-gray-200 tw-bg-gray-50 tw-p-3">
                        {[
                            { label: "Provider", value: data.providerName },
                            {
                                label: "Created",
                                value: formatDateTime(data.createdAt),
                            },
                        ].map(row => (
                            <div
                                key={row.label}
                                className="tw-flex tw-justify-between tw-gap-2 tw-py-0.5"
                            >
                                <dt className="tw-text-xs tw-text-gray-500">
                                    {row.label}
                                </dt>
                                <dd className="tw-mb-0 tw-text-sm tw-text-gray-800">
                                    {row.value}
                                </dd>
                            </div>
                        ))}

                        <div className="tw-flex tw-items-center tw-justify-between tw-gap-2 tw-py-0.5">
                            <dt className="tw-text-xs tw-text-gray-500">Status</dt>
                            <dd className="tw-mb-0">
                                <StatusLabel
                                    type={authorized ? "active" : "pending"}
                                    labelName={statusLabel(data.status)}
                                />
                            </dd>
                        </div>
                    </dl>

                    {data.providerName === "google_sheets" && (
                        <div className="tw-mb-3">
                            <GoogleSheetsConfigPanel
                                integrationName={data.integrationName}
                            />
                        </div>
                    )}

                    {data.providerName === "smartping_sms" && (
                        <div className="tw-mb-3">
                            <SmartpingSmsConfigPanel
                                integrationId={data.id}
                                integrationName={data.integrationName}
                            />
                        </div>
                    )}

                    {authorized && data.providerName === "smartping" && (
                        <div className="tw-mb-3">
                            <SmartpingConfigPanel
                                integrationName={data.integrationName}
                            />
                        </div>
                    )}

                    {handoff && (
                        <div className="tw-flex tw-flex-wrap tw-items-center tw-justify-between tw-gap-2 tw-rounded tw-border tw-border-gray-200 tw-p-3">
                            <div className="tw-min-w-0">
                                <p className="tw-mb-0 tw-text-sm tw-font-medium tw-text-gray-800">
                                    {handoff.title}
                                </p>
                                <p className="tw-mb-0 tw-text-xs tw-text-gray-500">
                                    {handoff.text}
                                </p>
                            </div>

                            <Button
                                type="button"
                                variant="primary"
                                onClick={() => {
                                    toggle();
                                    history.push(providerScreens[data.providerName]);
                                }}
                            >
                                {handoff.action}
                            </Button>
                        </div>
                    )}

                    {canAuthorize && (
                        <div className="alert alert-warning tw-mt-3">
                            <p className="tw-mb-2 tw-text-sm">
                                This integration is not authorized yet. Authorize it to
                                enable syncing.
                            </p>

                            <Button
                                type="button"
                                variant="primary"
                                onClick={() => onAuthorize(data)}
                            >
                                Authorize Integration
                            </Button>
                        </div>
                    )}
                </>
            )}

            {tab === "mapping" && (
                <FieldMappingPanel
                    sourceLabel={data.integrationName}
                />
            )}

            {tab === "sync" && (
                <>
                    <div className="tw-rounded tw-border tw-border-gray-200 tw-p-3">
                        <p className="tw-mb-0 tw-text-sm tw-font-medium tw-text-gray-800">
                            Sync data
                        </p>
                        <p className="tw-mb-3 tw-text-xs tw-text-gray-500">
                            Import data from {providerTitle} or export CRM data.
                        </p>

                        <div className="tw-flex tw-flex-wrap tw-gap-2">
                            <Button
                                type="button"
                                variant="primary"
                                onClick={() =>
                                    setSyncResult({
                                        imported: 14,
                                        skipped: 3,
                                        failed: 0,
                                        exported: 0,
                                        message:
                                            "Duplicates were matched on phone number and skipped.",
                                    })
                                }
                            >
                                <i className="ri-download-2-line tw-me-1"></i>
                                Import from {providerTitle}
                            </Button>

                            <Button
                                type="button"
                                variant="hoverInfo"
                                onClick={() =>
                                    setSyncResult({
                                        imported: 0,
                                        skipped: 0,
                                        failed: 0,
                                        exported: 26,
                                        message:
                                            "Exported leads updated since the last run.",
                                    })
                                }
                            >
                                <i className="ri-upload-2-line tw-me-1"></i>
                                Export to {providerTitle}
                            </Button>
                        </div>
                    </div>

                    {syncResult && (
                        <div className="tw-mt-3 tw-rounded tw-border tw-border-gray-200 tw-p-3">
                            <p className="tw-mb-2 tw-text-sm tw-font-medium tw-text-gray-800">
                                Sync completed
                            </p>

                            <div className="row tw-gap-y-2">
                                {[
                                    { label: "Imported", value: syncResult.imported },
                                    { label: "Skipped", value: syncResult.skipped },
                                    { label: "Failed", value: syncResult.failed },
                                    { label: "Exported", value: syncResult.exported },
                                ].map(entry => (
                                    <div key={entry.label} className="col-6 col-md-3">
                                        <div className="tw-rounded tw-border tw-border-gray-200 tw-bg-gray-50 tw-p-2 tw-text-center">
                                            <p className="tw-mb-0 tw-text-base tw-font-semibold tw-text-gray-800">
                                                {entry.value}
                                            </p>
                                            <p className="tw-mb-0 tw-text-[11px] tw-text-gray-500">
                                                {entry.label}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="tw-mt-2 tw-flex tw-flex-wrap tw-items-center tw-justify-between tw-gap-2">
                                <p className="tw-mb-0 tw-text-xs tw-text-gray-500">
                                    {syncResult.message}
                                </p>

                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => setSyncResult(null)}
                                >
                                    Close
                                </Button>
                            </div>
                        </div>
                    )}

                    <p className="tw-mb-0 tw-mt-3 tw-text-xs tw-text-gray-500">
                        Set the field mappings before syncing. An import checks for
                        duplicates on phone number or email.
                    </p>
                </>
            )}

            {tab === "logs" && (
                <div className="table-responsive">
                    <table className="table table-sm align-middle mb-0">
                        <thead className="table-light text-muted">
                            <tr>
                                <th>Date</th>
                                <th>Type</th>
                                <th>Status</th>
                                <th>Records</th>
                                <th>Duration</th>
                            </tr>
                        </thead>

                        <tbody>
                            {syncLogs.map(log => (
                                <tr key={log.id}>
                                    <td className="tw-whitespace-nowrap tw-text-sm">
                                        {formatDateTime(log.createdAt)}
                                    </td>
                                    <td className="tw-text-sm tw-capitalize">
                                        {log.syncType}
                                    </td>
                                    <td>
                                        <StatusLabel
                                            type={
                                                log.status === "success"
                                                    ? "active"
                                                    : "failed"
                                            }
                                            labelName={log.status}
                                        />
                                    </td>
                                    <td className="tw-text-sm">
                                        {log.recordsProcessed}
                                    </td>
                                    <td className="tw-text-sm">
                                        {log.durationSeconds}s
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <div className="tw-mt-4 tw-flex tw-justify-end tw-border-t tw-border-gray-200 tw-pt-4">
                <Button type="button" variant="secondary" onClick={toggle}>
                    Close
                </Button>
            </div>
        </div>
    );
};

export default IntegrationDetailsModal;
