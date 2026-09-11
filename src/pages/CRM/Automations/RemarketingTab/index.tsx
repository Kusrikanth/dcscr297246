import { useState } from "react";
import { toast } from "react-toastify";

import {
    Button,
    ConfirmationModal,
    ModalContainerUpdated,
    StatusLabel,
} from "../../../../Components/Common";
import { useModal } from "../../../../hooks/modalhook";
import { formatDateTime } from "../../Settings/helper";
import AddEditAudienceModal from "./AddEditAudienceModal";
import {
    audienceMembers,
    audienceStatusTone,
    remarketingAudiences,
    syncIntervalOptions,
    type RemarketingAudience,
} from "./helper";

const RemarketingTab = () => {
    const [audiences, setAudiences] = useState<Array<RemarketingAudience>>(
        remarketingAudiences,
    );

    const { openModal, closeModal, modalState } = useModal();
    const {
        openModal: openLeadsModal,
        closeModal: closeLeadsModal,
        modalState: leadsModalState,
    } = useModal();
    const {
        openModal: openDeleteConfirm,
        closeModal: closeDeleteConfirm,
        modalState: deleteConfirmState,
    } = useModal();
    const {
        openModal: openMetaDeleteConfirm,
        closeModal: closeMetaDeleteConfirm,
        modalState: metaDeleteConfirmState,
    } = useModal();

    const saveAudienceHandler = (
        audience: RemarketingAudience,
        isNew: boolean,
    ) => {
        setAudiences(current =>
            isNew
                ? [audience, ...current]
                : current.map(item =>
                    item.id === audience.id ? audience : item,
                ),
        );
        toast.success(isNew ? "Audience created" : "Audience updated");
    };

    const syncHandler = (audience: RemarketingAudience) => {
        setAudiences(current =>
            current.map(item =>
                item.id === audience.id
                    ? {
                        ...item,
                        status: "active",
                        lastError: "",
                        syncedLeadCount: item.crmLeadCount,
                        lastSyncAt: new Date().toISOString(),
                    }
                    : item,
            ),
        );
        toast.success("Synced: 62 added, 8 removed");
    };

    const refreshHandler = (audience: RemarketingAudience) => {
        setAudiences(current =>
            current.map(item =>
                item.id === audience.id
                    ? {
                        ...item,
                        syncedLeadCount: item.crmLeadCount,
                        lastSyncAt: new Date().toISOString(),
                    }
                    : item,
            ),
        );
        toast.success(`Refreshed: ${audience.crmLeadCount} uploaded`);
    };

    const togglePauseHandler = (audience: RemarketingAudience) => {
        const isPaused = audience.status === "paused";

        setAudiences(current =>
            current.map(item =>
                item.id === audience.id
                    ? { ...item, status: isPaused ? "active" : "paused" }
                    : item,
            ),
        );
        toast.success(isPaused ? "Sync resumed" : "Sync paused");
    };

    const confirmDeleteHandler = () => {
        const audience = deleteConfirmState.modalData as RemarketingAudience;

        closeDeleteConfirm();

        if (audience.metaAudienceId) {
            openMetaDeleteConfirm(audience);
            return;
        }

        removeAudience(audience, false);
    };

    const removeAudience = (
        audience: RemarketingAudience,
        isMetaDeleted: boolean,
    ) => {
        setAudiences(current =>
            current.filter(item => item.id !== audience.id),
        );
        toast.success(
            isMetaDeleted
                ? "Audience deleted here and at Meta"
                : "Audience deleted from the CRM",
        );
    };

    const discoverAccountsHandler = () =>
        toast.success("2 ad account(s) discovered");

    const exportHandler = () => {
    };

    return (
        <div className="tw-card">
            <div className="tw-card-body">
                <div className="tw-mb-1 tw-flex tw-flex-wrap tw-items-center tw-justify-between tw-gap-2">
                    <p className="tw-mb-0 tw-text-base tw-font-semibold tw-text-gray-800">
                        Remarketing audiences ({audiences.length})
                    </p>

                    <div className="tw-flex tw-flex-wrap tw-gap-2">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={discoverAccountsHandler}
                        >
                            <i className="ri-refresh-line"></i>
                            Discover Ad Accounts
                        </Button>

                        <Button
                            type="button"
                            variant="secondary"
                            disabled={!audiences.length}
                            title={
                                audiences.length
                                    ? "Download this list as CSV"
                                    : "Nothing to export"
                            }
                            onClick={exportHandler}
                        >
                            <i className="ri-download-2-line"></i>
                            Export
                        </Button>

                        <Button
                            type="button"
                            variant="primary"
                            onClick={() => openModal()}
                        >
                            <i className="ri-add-line"></i>
                            Create Audience
                        </Button>
                    </div>
                </div>

                <p className="tw-mb-3 tw-text-xs tw-text-gray-500">
                    An audience is a saved set of lead filters. Matching leads are
                    hashed and uploaded to a Meta Custom Audience — the CRM never
                    sends raw contact details.
                </p>

                {audiences.length === 0 ? (
                    <p className="tw-mb-0 tw-py-4 tw-text-center tw-text-sm tw-text-gray-500">
                        No audiences yet. Create one to start remarketing to CRM
                        leads.
                    </p>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-sm align-middle mb-0">
                            <thead className="table-light text-muted">
                                <tr>
                                    <th>Audience</th>
                                    <th>Ad account</th>
                                    <th>CRM leads</th>
                                    <th>Synced</th>
                                    <th>Sync</th>
                                    <th>Status</th>
                                    <th>Last sync</th>
                                    <th>Created</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {audiences.map(audience => (
                                    <tr key={audience.id}>
                                        <td>
                                            <p className="tw-mb-0 tw-text-sm tw-font-medium tw-text-gray-800">
                                                {audience.name}
                                            </p>
                                            <p className="tw-mb-0 tw-font-mono tw-text-xs tw-text-gray-500">
                                                {audience.metaAudienceId
                                                    ? `Meta ID ${audience.metaAudienceId}`
                                                    : "Not yet created at Meta"}
                                            </p>
                                            {audience.lastError && (
                                                <p
                                                    className="tw-mb-0 tw-text-xs tw-text-danger"
                                                    title={audience.lastError}
                                                >
                                                    {audience.lastError}
                                                </p>
                                            )}
                                        </td>

                                        <td className="tw-text-sm tw-text-gray-700">
                                            {audience.adAccountName ||
                                                audience.adAccountId}
                                        </td>

                                        <td className="tw-text-sm tw-text-gray-800">
                                            {audience.crmLeadCount}
                                        </td>

                                        <td className="tw-text-sm tw-text-gray-800">
                                            {audience.syncedLeadCount}
                                        </td>

                                        <td className="tw-text-xs tw-text-gray-700">
                                            {audience.syncType === "automatic"
                                                ? syncIntervalOptions.find(
                                                    item =>
                                                        item.id ===
                                                        audience.syncInterval,
                                                )?.name || "Automatic"
                                                : "Manual"}
                                        </td>

                                        <td>
                                            <StatusLabel
                                                type={audienceStatusTone(
                                                    audience.status,
                                                )}
                                                labelName={audience.status}
                                            />
                                        </td>

                                        <td className="tw-whitespace-nowrap tw-text-xs tw-text-gray-500">
                                            {formatDateTime(
                                                audience.lastSyncAt,
                                            ) || "—"}
                                        </td>

                                        <td>
                                            <p className="tw-mb-0 tw-text-xs tw-text-gray-700">
                                                {audience.createdBy || "—"}
                                            </p>
                                            <p className="tw-mb-0 tw-text-xs tw-text-gray-500">
                                                {formatDateTime(
                                                    audience.createdAt,
                                                )}
                                            </p>
                                        </td>

                                        <td>
                                            <div className="tw-flex tw-flex-wrap tw-gap-1">
                                                <Button
                                                    type="button"
                                                    variant="hoverInfo"
                                                    onClick={() =>
                                                        syncHandler(audience)
                                                    }
                                                >
                                                    Sync
                                                </Button>

                                                <Button
                                                    type="button"
                                                    variant="hoverInfo"
                                                    title="Re-upload every matching lead"
                                                    onClick={() =>
                                                        refreshHandler(audience)
                                                    }
                                                >
                                                    Refresh
                                                </Button>

                                                <Button
                                                    type="button"
                                                    variant="hoverInfo"
                                                    onClick={() =>
                                                        openLeadsModal(audience)
                                                    }
                                                >
                                                    Leads
                                                </Button>

                                                <Button
                                                    type="button"
                                                    variant="hoverInfo"
                                                    onClick={() =>
                                                        openModal(audience)
                                                    }
                                                >
                                                    Edit
                                                </Button>

                                                <Button
                                                    type="button"
                                                    variant="hoverInfo"
                                                    onClick={() =>
                                                        togglePauseHandler(
                                                            audience,
                                                        )
                                                    }
                                                >
                                                    {audience.status ===
                                                        "paused"
                                                        ? "Resume"
                                                        : "Pause"}
                                                </Button>

                                                <Button
                                                    type="button"
                                                    variant="wrong"
                                                    onClick={() =>
                                                        openDeleteConfirm(
                                                            audience,
                                                        )
                                                    }
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <ModalContainerUpdated
                id="crm-automations-audience-modal"
                isOpen={modalState.showModal}
                toggle={closeModal}
                modalTitle={
                    modalState.modalData ? "Edit audience" : "Create audience"
                }
                modalSize="xl"
            >
                <AddEditAudienceModal
                    data={
                        modalState.modalData as
                        | RemarketingAudience
                        | undefined
                    }
                    toggle={closeModal}
                    onSave={saveAudienceHandler}
                />
            </ModalContainerUpdated>

            <ModalContainerUpdated
                id="crm-automations-audience-leads"
                isOpen={leadsModalState.showModal}
                toggle={closeLeadsModal}
                modalTitle={
                    (leadsModalState.modalData as RemarketingAudience)?.name ||
                    "Audience leads"
                }
                modalSize="lg"
            >
                <div className="tw-p-4">
                    <p className="tw-mb-3 tw-text-sm tw-text-gray-500">
                        {audienceMembers.length} matching leads
                    </p>

                    <div className="table-responsive">
                        <table className="table table-sm align-middle mb-0">
                            <thead className="table-light text-muted">
                                <tr>
                                    <th>Lead</th>
                                    <th>Match keys</th>
                                    <th>Eligible</th>
                                    <th>Sync status</th>
                                    <th>Last synced</th>
                                </tr>
                            </thead>

                            <tbody>
                                {audienceMembers.map(member => (
                                    <tr key={member.id}>
                                        <td>
                                            <p className="tw-mb-0 tw-text-sm tw-font-medium tw-text-gray-800">
                                                {member.name}
                                            </p>
                                            <p className="tw-mb-0 tw-text-xs tw-text-gray-500">
                                                {member.city || "—"}
                                            </p>
                                        </td>

                                        <td className="tw-text-xs tw-text-gray-700">
                                            {member.matchKeys || "—"}
                                        </td>

                                        <td>
                                            <StatusLabel
                                                type={
                                                    member.isEligible
                                                        ? "active"
                                                        : "pending"
                                                }
                                                labelName={
                                                    member.isEligible
                                                        ? "Yes"
                                                        : "No"
                                                }
                                            />
                                        </td>

                                        <td className="tw-text-xs tw-text-gray-700">
                                            {member.syncStatus}
                                        </td>

                                        <td className="tw-whitespace-nowrap tw-text-xs tw-text-gray-500">
                                            {formatDateTime(
                                                member.lastSyncedAt,
                                            ) || "—"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="tw-mt-4 tw-flex tw-justify-end tw-border-t tw-border-gray-200 tw-pt-4">
                        <Button
                            type="button"
                            variant="primary"
                            onClick={closeLeadsModal}
                        >
                            Close
                        </Button>
                    </div>
                </div>
            </ModalContainerUpdated>

            <ConfirmationModal
                id="crm-automations-audience-delete"
                isOpen={deleteConfirmState.showModal}
                iconType="reject"
                confirmTitle="Delete audience"
                confirmMessage={
                    deleteConfirmState.modalData
                        ? `Delete the CRM audience "${(deleteConfirmState.modalData as RemarketingAudience).name}"?`
                        : ""
                }
                confirmBtnText="Delete"
                cancelHndlr={closeDeleteConfirm}
                confirmHndlr={confirmDeleteHandler}
            />

            <ConfirmationModal
                id="crm-automations-audience-delete-meta"
                isOpen={metaDeleteConfirmState.showModal}
                iconType="reject"
                confirmTitle="Also delete it at Meta?"
                confirmMessage={
                    metaDeleteConfirmState.modalData
                        ? `Also DELETE the Custom Audience at Meta (${(metaDeleteConfirmState.modalData as RemarketingAudience).metaAudienceId})?`
                        : ""
                }
                noteMessage="Ads currently targeting it will stop delivering. Cancel to keep it at Meta and remove only the CRM copy."
                confirmBtnText="Delete at Meta"
                cancelHndlr={() => {
                    const audience =
                        metaDeleteConfirmState.modalData as RemarketingAudience;

                    closeMetaDeleteConfirm();
                    removeAudience(audience, false);
                }}
                confirmHndlr={() => {
                    const audience =
                        metaDeleteConfirmState.modalData as RemarketingAudience;

                    closeMetaDeleteConfirm();
                    removeAudience(audience, true);
                }}
            />
        </div>
    );
};

export default RemarketingTab;
