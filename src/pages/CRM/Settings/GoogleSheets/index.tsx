import { useMemo, useState, type MouseEvent } from "react";
import { useHistory } from "react-router-dom";

import UpdatedHorizontalTab from "../../../../Components/Common/UpdatedHorizontalTab";
import {
    Button,
    ConfirmationModal,
    MenuOptionHrtl,
    ModalContainerUpdated,
    SelectInput,
    StatusLabel,
} from "../../../../Components/Common";
import type { IOptionsHrtl } from "../../../../Components/Common/MenuOptions";
import { useModal } from "../../../../hooks/modalhook";
import { formatDateTime } from "../helper";
import FieldMappingPanel from "../Integrations/FieldMappingPanel";
import { syncLogs } from "../Integrations/helper";
import { withSettingsPage } from "../index";
import AddSheetSourceModal from "./AddSheetSourceModal";
import SkippedLeads from "./SkippedLeads";
import {
    branchNameFor,
    googleIntegrations,
    sheetPreview,
    sheetSources as sampleSources,
    sheetStatusLabel,
    type SheetSource,
} from "./helper";
import { toast } from "react-toastify";

const workspaceViews = [
    { id: "configuration", label: "Configuration", icon: "ri-settings-3-line" },
    { id: "mapping", label: "Field Mapping", icon: "ri-list-check-2" },
    { id: "sync", label: "Sync Data", icon: "ri-refresh-line" },
    { id: "logs", label: "Sync Logs", icon: "ri-history-line" },
];

const workspaceMenuOptions = workspaceViews.map(view => ({
    id: view.id,
    labelName: view.label,
    customPadding: "0px 10px 0px 10px",
    Icon: <i className={`${view.icon} tw-me-1`}></i>,
}));

const GoogleSheets = () => {
    const history = useHistory();

    const [sources, setSources] = useState<Array<SheetSource>>(sampleSources);
    const [integrationFilter, setIntegrationFilter] = useState<string>("");
    const [showSkipped, setShowSkipped] = useState<boolean>(false);
    const [workspace, setWorkspace] = useState<{
        source: SheetSource;
        view: string;
    } | null>(null);

    const clickWorkspaceViewHandler = (event: MouseEvent<HTMLElement>) => {
        const menuId = event.currentTarget.getAttribute("data-id");

        if (menuId) {
            setWorkspace(current => (current ? { ...current, view: menuId } : current));
        }
    };

    const actionsListFor = (source: SheetSource): Array<IOptionsHrtl> => [
        ...workspaceViews.map(view => {
            const isDisabled = view.id === "sync" && source.status !== "active";
            const needsMapping =
                view.id === "mapping" && source.status !== "active";

            return {
                id: view.id,
                actionIcon: (
                    <i
                        className={`${view.icon} ${isDisabled
                            ? "tw-text-gray-300"
                            : needsMapping
                                ? "tw-text-amber-600"
                                : "tw-text-gray-500"
                            }`}
                    ></i>
                ),
                actionName: view.label,
                disabled: isDisabled,
                onClickHndlr: () =>
                    !isDisabled && setWorkspace({ source, view: view.id }),
            };
        }),
        {
            id: "remove",
            actionIcon: <i className="ri-delete-bin-line tw-text-danger"></i>,
            actionName: "Remove Source",
            onClickHndlr: () => deleteOpenModal(source),
        },
    ];

    const { openModal, closeModal, modalState } = useModal();
    const {
        openModal: deleteOpenModal,
        closeModal: deleteCloseModal,
        modalState: deleteModalState,
    } = useModal();

    const authorizedCount = googleIntegrations.filter(
        integration => integration.isAuthorized,
    ).length;

    const visibleSources = useMemo(
        () =>
            sources.filter(
                source =>
                    !integrationFilter ||
                    source.integrationId === integrationFilter,
            ),
        [integrationFilter, sources],
    );

    const saveHandler = (source: SheetSource) => {
        setSources(current => [...current, source]);
        setWorkspace({ source, view: "mapping" });
        toast.success("Sheet added. Complete field mapping to activate continuous import.");
    };

    const deleteHandler = () => {
        const source: SheetSource | undefined = deleteModalState.modalData;

        if (!source) {
            return;
        }

        setSources(current => current.filter(item => item.id !== source.id));
        setWorkspace(current =>
            current?.source.id === source.id ? null : current,
        );
        deleteCloseModal();
        toast.success(`"${source.sheetName}" removed`);
    };

    const mappingSavedHandler = () => {
        if (!workspace) {
            return;
        }

        setSources(current =>
            current.map(item =>
                item.id === workspace.source.id
                    ? { ...item, status: "active" as const }
                    : item,
            ),
        );
        setWorkspace(current =>
            current
                ? {
                    ...current,
                    source: { ...current.source, status: "active" as const },
                }
                : current,
        );
    };

    const importNowHandler = (source: SheetSource) => {
        setSources(current =>
            current.map(item =>
                item.id === source.id
                    ? { ...item, lastSyncAt: new Date().toISOString() }
                    : item,
            ),
        );
        toast.success(`Import complete for ${source.sheetName}`);
    };

    if (showSkipped) {
        return (
            <SkippedLeads
                onBack={() => setShowSkipped(false)}
            />
        );
    }

    if (!authorizedCount) {
        return (
            <div className="tw-card">
                <div className="tw-card-body">
                    <div className="tw-py-6 tw-text-center">
                        <i className="ri-file-excel-2-line tw-text-3xl tw-text-gray-300"></i>
                        <p className="tw-mb-0 tw-mt-2 tw-text-sm tw-font-medium tw-text-gray-700">
                            No authorized Google Sheets connection
                        </p>
                        <p className="tw-mb-2 tw-text-xs tw-text-gray-500">
                            Authorize Google Sheets under Integrations before
                            configuring sheets and sync.
                        </p>

                        <Button
                            type="button"
                            variant="primary"
                            onClick={() => history.push("/integrations")}
                        >
                            Open Integrations
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="tw-card tw-mb-4">
                <div className="tw-card-body">
                    <div className="row tw-items-end tw-gap-y-3">
                        <div className="col-12 col-md-6 col-xl-4">
                            <SelectInput
                                name="integrationFilter"
                                labelText="Google Sheets Connection"
                                defaultSelect="All connections"
                                value={integrationFilter}
                                onChange={(
                                    event: React.ChangeEvent<HTMLSelectElement>,
                                ) => setIntegrationFilter(event.target.value)}
                                menuItems={googleIntegrations.map(integration => ({
                                    id: integration.id,
                                    name: `${integration.name}${integration.isAuthorized ? "" : " · authorization pending"}`,
                                }))}
                                valueKey="id"
                                textKey="name"
                                formgroupClassName="tw-mb-0"
                            />
                        </div>

                        <div className="col-12 col-md-6 col-xl-8">
                            <div className="tw-flex tw-flex-wrap tw-items-center tw-justify-end tw-gap-2">
                                <span className="tw-text-sm tw-text-gray-500">
                                    {visibleSources.length} sheet
                                    {visibleSources.length === 1 ? "" : "s"} ·{" "}
                                    {authorizedCount} authorized
                                </span>

                                <Button
                                    type="button"
                                    variant="hoverInfo"
                                    onClick={() => setShowSkipped(true)}
                                >
                                    <i className="ri-forbid-line tw-me-1"></i>
                                    Skipped Leads
                                </Button>

                                <Button
                                    type="button"
                                    variant="primary"
                                    onClick={() => openModal()}
                                >
                                    <i className="ri-add-line tw-me-1"></i>
                                    Add Google Sheet
                                </Button>
                            </div>
                        </div>
                    </div>

                    <p className="tw-mb-0 tw-mt-2 tw-text-xs tw-text-gray-500">
                        Add one Google Sheet per branch, then map its columns to
                        import its rows into Leads.
                    </p>
                </div>
            </div>

            {!visibleSources.length ? (
                <div className="tw-card">
                    <div className="tw-card-body">
                        <p className="tw-mb-0 tw-py-6 tw-text-center tw-text-sm tw-text-gray-500">
                            No sheet sources configured. Add a spreadsheet and assign
                            its destination branch.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="row tw-gap-y-3">
                    {visibleSources.map(source => (
                        <div key={source.id} className="col-12 col-xl-6">
                            <div className="tw-card tw-h-full">
                                <div className="tw-card-body">
                                    <div className="tw-flex tw-items-start tw-gap-3">
                                        <span className="tw-grid tw-h-10 tw-w-10 tw-flex-shrink-0 tw-place-items-center tw-rounded tw-bg-[#0f9d58] tw-text-white">
                                            <i className="ri-file-excel-2-line"></i>
                                        </span>

                                        <div className="tw-min-w-0 tw-flex-1">
                                            <p className="tw-mb-0 tw-text-sm tw-font-medium tw-text-gray-800">
                                                {source.sheetName}
                                            </p>
                                            <p className="tw-mb-0 tw-text-xs tw-text-gray-500">
                                                {sheetStatusLabel(source)}
                                            </p>
                                        </div>

                                        <StatusLabel
                                            type={
                                                source.status === "active"
                                                    ? "active"
                                                    : "pending"
                                            }
                                            labelName={
                                                source.status === "active"
                                                    ? "Active"
                                                    : "Mapping"
                                            }
                                        />
                                    </div>

                                    <p className="tw-mb-0 tw-mt-2 tw-text-xs tw-text-gray-500">
                                        {source.lastSyncAt
                                            ? `Last import ${formatDateTime(source.lastSyncAt)}`
                                            : "Never imported"}
                                        {source.rowsImported > 0
                                            ? ` · ${source.rowsImported.toLocaleString("en-IN")} rows`
                                            : ""}
                                    </p>

                                    <div className="tw-mt-3 tw-flex tw-flex-wrap tw-justify-end tw-border-t tw-border-gray-200 tw-pt-3">
                                        <MenuOptionHrtl
                                            actionOptions={actionsListFor(source)}
                                            rowId={source.id}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <ModalContainerUpdated
                id="crm-settings-sheet-source"
                isOpen={modalState.showModal}
                toggle={closeModal}
                modalTitle="Add Google Sheet"
                modalSize="md"
            >
                <AddSheetSourceModal
                    existingSources={sources}
                    toggle={closeModal}
                    onSave={saveHandler}
                />
            </ModalContainerUpdated>

            <ModalContainerUpdated
                id="crm-settings-sheet-workspace"
                isOpen={Boolean(workspace)}
                toggle={() => setWorkspace(null)}
                modalTitle={workspace?.source.sheetName || "Sheet"}
                modalSize="lg"
            >
                {workspace && (
                    <div className="tw-p-4">
                        <div className="tw-mb-3 tw-border-b tw-border-gray-200 tw-pb-2">
                            <UpdatedHorizontalTab
                                MenuOptions={workspaceMenuOptions}
                                clickMenuHandler={clickWorkspaceViewHandler}
                                activeTabId={workspace.view}
                                horizontalClass=""
                            />
                        </div>

                        {workspace.view === "configuration" && (
                            <>
                                <div className="tw-mb-3 tw-grid tw-gap-2 md:tw-grid-cols-4">
                                    {[
                                        {
                                            label: "Spreadsheet",
                                            value: workspace.source.sheetName,
                                        },
                                        {
                                            label: "Destination branch",
                                            value: branchNameFor(
                                                workspace.source.branchId,
                                            ),
                                        },
                                        {
                                            label: "Sync mode",
                                            value: "Continuous · every minute",
                                        },
                                        {
                                            label: "Status",
                                            value:
                                                workspace.source.status === "active"
                                                    ? "Active"
                                                    : "Mapping required",
                                        },
                                    ].map(item => (
                                        <div
                                            key={item.label}
                                            className="tw-rounded tw-border tw-border-gray-200 tw-bg-gray-50 tw-p-2"
                                        >
                                            <p className="tw-mb-0 tw-text-[11px] tw-text-gray-500">
                                                {item.label}
                                            </p>
                                            <p className="tw-mb-0 tw-text-sm tw-text-gray-800">
                                                {item.value}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                <p className="tw-mb-1 tw-text-sm tw-font-semibold tw-text-gray-800">
                                    Sheet preview
                                </p>

                                <div className="table-responsive">
                                    <table className="table table-sm align-middle mb-0">
                                        <thead className="table-light text-muted">
                                            <tr>
                                                {sheetPreview.headers.map(header => (
                                                    <th key={header}>{header}</th>
                                                ))}
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {sheetPreview.rows.map((row, index) => (
                                                <tr key={index}>
                                                    {row.map((cell, cellIndex) => (
                                                        <td
                                                            key={cellIndex}
                                                            className="tw-text-sm"
                                                        >
                                                            {cell || "—"}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        )}

                        {workspace.view === "mapping" && (
                            <FieldMappingPanel
                                sourceLabel={workspace.source.sheetName}
                                onSaved={mappingSavedHandler}
                            />
                        )}

                        {workspace.view === "sync" && (
                            <div className="tw-flex tw-flex-wrap tw-items-center tw-gap-3 tw-rounded tw-border tw-border-gray-200 tw-p-3">
                                <span className="tw-grid tw-h-11 tw-w-11 tw-flex-shrink-0 tw-place-items-center tw-rounded-full tw-bg-[#eef1f7] tw-text-[#405189]">
                                    <i className="ri-refresh-line tw-text-lg"></i>
                                </span>

                                <div className="tw-min-w-0 tw-flex-1">
                                    <p className="tw-mb-0 tw-text-sm tw-font-medium tw-text-gray-800">
                                        Continuous import is{" "}
                                        {workspace.source.status === "active"
                                            ? "active"
                                            : "waiting for mapping"}
                                    </p>
                                    <p className="tw-mb-0 tw-text-xs tw-text-gray-500">
                                        New rows are deduplicated and added to{" "}
                                        {branchNameFor(workspace.source.branchId)} in
                                        Leads.
                                    </p>
                                </div>

                                <Button
                                    type="button"
                                    variant="primary"
                                    disabled={workspace.source.status !== "active"}
                                    onClick={() => importNowHandler(workspace.source)}
                                >
                                    Import Now
                                </Button>
                            </div>
                        )}

                        {workspace.view === "logs" && (
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
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => setWorkspace(null)}
                            >
                                Close
                            </Button>
                        </div>
                    </div>
                )}
            </ModalContainerUpdated>

            <ConfirmationModal
                id="crm-settings-sheet-source-delete"
                isOpen={deleteModalState.showModal}
                iconType="reject"
                confirmTitle="Remove this sheet source?"
                confirmMessage={`"${deleteModalState.modalData?.sheetName}" will stop importing into ${branchNameFor(deleteModalState.modalData?.branchId || "")}.`}
                noteMessage="Leads already imported from it are kept."
                confirmBtnText="Remove Source"
                confirmHndlr={deleteHandler}
                cancelHndlr={deleteCloseModal}
            />
        </>
    );
};

const GoogleSheetsPage = withSettingsPage(GoogleSheets, "Google Sheets");

export default GoogleSheetsPage;
