import { useMemo, useState } from "react";
import { useHistory } from "react-router-dom";

import {
    Button,
    ModalContainerUpdated,
    SelectInput,
    TextIconInput,
} from "../../../../Components/Common";
import { useModal } from "../../../../hooks/modalhook";
import type { FieldChangeEvent } from "../helper";
import { withSettingsPage } from "../index";
import ConnectionWizardModal from "./ConnectionWizardModal";
import IntegrationDetailsModal from "./IntegrationDetailsModal";
import {
    integrations as sampleIntegrations,
    integrationStatusOptions,
    integrationTypeOf,
    integrationTypes,
    lastSyncLabel,
    providerScreens,
    providerVisual,
    statusBadgeClass,
    statusDotClass,
    statusLabel,
    type Integration,
} from "./helper";
import { toast } from "react-toastify";

const Integrations = () => {
    const history = useHistory();

    const [items, setItems] = useState<Array<Integration>>(sampleIntegrations);
    const [openTypeId, setOpenTypeId] = useState<string>("");
    const [searchString, setSearchString] = useState<string>("");
    const [statusFilter, setStatusFilter] = useState<string>("");

    const { openModal, closeModal, modalState } = useModal();
    const {
        openModal: wizardOpenModal,
        closeModal: wizardCloseModal,
        modalState: wizardModalState,
    } = useModal();

    const openType = useMemo(
        () => integrationTypes.find(type => type.id === openTypeId),
        [openTypeId],
    );

    const stats = useMemo(
        () => [
            {
                id: "total",
                label: "Total integrations",
                value: items.length,
                icon: "ri-links-line",
                tone: "tw-bg-[#eef1f7] tw-text-[#405189]",
            },
            {
                id: "connected",
                label: "Connected",
                value: items.filter(item => item.status === "active").length,
                icon: "ri-checkbox-circle-line",
                tone: "tw-bg-emerald-50 tw-text-emerald-700",
            },
            {
                id: "disconnected",
                label: "Disconnected",
                value: items.filter(item =>
                    ["disconnected", "inactive"].includes(item.status),
                ).length,
                icon: "ri-plug-line",
                tone: "tw-bg-amber-50 tw-text-amber-700",
            },
            {
                id: "attention",
                label: "Needs attention",
                value: items.filter(item =>
                    ["error", "pending_auth"].includes(item.status),
                ).length,
                icon: "ri-error-warning-line",
                tone: "tw-bg-red-50 tw-text-red-700",
            },
        ],
        [items],
    );

    const visibleItems = useMemo(
        () =>
            items.filter(
                item =>
                    !openTypeId || integrationTypeOf(item) === openTypeId,
            ),
        [items, openTypeId],
    );

    const countFor = (typeId: string) =>
        items.filter(item => integrationTypeOf(item) === typeId).length;

    const screenForType = (typeId: string) => {
        if (typeId === "email") {
            return providerScreens.smtp;
        }

        return providerScreens[typeId];
    };

    const typeCardClickHandler = (typeId: string) => {
        const screen = screenForType(typeId);

        if (screen) {
            history.push(screen);
            return;
        }

        setOpenTypeId(typeId);
    };

    const settingsHandler = (integration: Integration) => {
        const screen = providerScreens[integration.providerName];

        if (screen) {
            history.push(screen);
            return;
        }

        openModal(integration);
    };

    const syncHandler = (integration: Integration) => {
        const screen = providerScreens[integration.providerName];

        if (screen && integration.providerName !== "google_sheets") {
            history.push(screen);
            return;
        }

        setItems(current =>
            current.map(item =>
                item.id === integration.id
                    ? { ...item, lastSyncAt: new Date().toISOString() }
                    : item,
            ),
        );
        toast.success(`Sync complete for ${integration.integrationName}`);
    };

    const authorizeHandler = (integration: Integration) => {
        setItems(current =>
            current.map(item =>
                item.id === integration.id
                    ? { ...item, status: "active" }
                    : item,
            ),
        );
        closeModal();
        toast.success(`${integration.integrationName} authorized`);
    };

    const createHandler = (integration: Integration) => {
        setItems(current => [...current, integration]);
        toast.success(`${integration.integrationName} created — authorize it to start syncing`);
    };

    const refreshHandler = () => {
        setItems(sampleIntegrations);
        setSearchString("");
        setStatusFilter("");
        toast.success("Integrations refreshed");
    };

    const filterChangeHandler = (event: FieldChangeEvent) => {
        const { name, value } = event.target;

        if (name === "searchString") {
            setSearchString(value);
        } else {
            setStatusFilter(value);
        }
    };

    return (
        <>
            <div className="row tw-mb-4 tw-gap-y-3">
                {stats.map(stat => (
                    <div key={stat.id} className="col-6 col-xl-3">
                        <div className="tw-card tw-h-full">
                            <div className="tw-card-body tw-flex tw-items-center tw-gap-3">
                                <span
                                    className={`tw-grid tw-h-11 tw-w-11 tw-flex-shrink-0 tw-place-items-center tw-rounded-full ${stat.tone}`}
                                >
                                    <i className={`${stat.icon} tw-text-lg`}></i>
                                </span>

                                <div className="tw-min-w-0">
                                    <p className="tw-mb-0 tw-text-xl tw-font-semibold tw-text-gray-800">
                                        {stat.value}
                                    </p>
                                    <p className="tw-mb-0 tw-text-xs tw-text-gray-500">
                                        {stat.label}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="tw-card tw-mb-4">
                <div className="tw-card-body">
                    <div className="tw-flex tw-flex-wrap tw-items-center tw-justify-between tw-gap-2">
                        {/* {openType ? (
                            <div className="tw-flex tw-flex-wrap tw-items-center tw-gap-2">
                                <Button
                                    type="button"
                                    variant="hoverInfo"
                                    onClick={() => {
                                        setOpenTypeId("");
                                        setSearchString("");
                                        setStatusFilter("");
                                    }}
                                >
                                    <i className="ri-arrow-left-s-line tw-me-1"></i>
                                    All integration types
                                </Button>

                                <div className="tw-min-w-0">
                                    <p className="tw-mb-0 tw-text-sm tw-font-medium tw-text-gray-800">
                                        {openType.name}
                                    </p>
                                    <p className="tw-mb-0 tw-text-xs tw-text-gray-500">
                                        {openType.providers.join(", ")}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <p className="tw-mb-0 tw-text-sm tw-text-gray-500">
                                Choose a service to see what is connected and add
                                another.
                            </p>
                        )} */}

                        {openType?.isAvailable && (
                            <Button
                                type="button"
                                variant="primary"
                                onClick={() => wizardOpenModal(openType)}
                            >
                                <i className="ri-add-line tw-me-1"></i>
                                Add {openType.name}
                            </Button>
                        )}
                    </div>

                    <div className="row tw-mt-3 tw-items-end tw-gap-y-3">
                        <div className="col-12 col-md-6 col-xl-4">
                            <TextIconInput
                                formgroupClassName="search-box tw-mb-0"
                                name="searchString"
                                labelText="Search"
                                value={searchString}
                                onChange={filterChangeHandler}
                                placeHolder="Search integrations…"
                                floatingLabel
                            >
                                <i className="ri-search-line search-icon"></i>
                            </TextIconInput>
                        </div>

                        <div className="col-12 col-md-6 col-xl-3">
                            <SelectInput
                                name="statusFilter"
                                labelText="Status"
                                defaultSelect="All statuses"
                                value={statusFilter}
                                onChange={filterChangeHandler}
                                menuItems={integrationStatusOptions}
                                valueKey="id"
                                textKey="name"
                                formgroupClassName="tw-mb-0"
                                floatingLabel
                            />
                        </div>

                        <div className="col-12 col-xl-5">
                            <div className="tw-flex tw-flex-wrap tw-justify-end tw-gap-2">
                                <Button
                                    type="button"
                                    variant="hoverInfo"
                                    onClick={refreshHandler}
                                >
                                    <i className="ri-refresh-line tw-me-1"></i>
                                    Refresh
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {!openType ? (
                <div className="row tw-gap-y-3">
                    {integrationTypes.map(type => {
                        const count = countFor(type.id);

                        return (
                            <div key={type.id} className="col-12 col-md-6 col-xl-4">
                                <div
                                    className={`tw-card tw-mb-0 tw-h-full ${
                                        type.isAvailable
                                            ? "tw-cursor-pointer hover:tw-border-primary"
                                            : "tw-opacity-75"
                                    }`}
                                    role={type.isAvailable ? "button" : undefined}
                                    tabIndex={type.isAvailable ? 0 : undefined}
                                    aria-disabled={!type.isAvailable}
                                    onClick={() =>
                                        type.isAvailable && typeCardClickHandler(type.id)
                                    }
                                    onKeyDown={event => {
                                        if (
                                            type.isAvailable &&
                                            ["Enter", " "].includes(event.key)
                                        ) {
                                            event.preventDefault();
                                            typeCardClickHandler(type.id);
                                        }
                                    }}
                                >
                                    <div className="tw-card-body tw-flex tw-items-center tw-gap-3">
                                        <span
                                            className="tw-grid tw-h-11 tw-w-11 tw-flex-shrink-0 tw-place-items-center tw-rounded tw-text-white"
                                            style={{ backgroundColor: type.accent }}
                                        >
                                            <i
                                                className={`${type.icon} tw-text-lg`}
                                            ></i>
                                        </span>

                                        <div className="tw-min-w-0 tw-flex-1">
                                            <p className="tw-mb-0 tw-text-sm tw-font-medium tw-text-gray-800">
                                                {type.name}
                                            </p>
                                            <p className="tw-mb-0 tw-truncate tw-text-xs tw-text-gray-500">
                                                {type.providers.join(", ")}
                                            </p>
                                        </div>

                                        <span
                                            className={`badge tw-flex-shrink-0 ${!type.isAvailable
                                                ? "badge-soft-secondary"
                                                : count
                                                    ? "badge-soft-success"
                                                    : "badge-soft-secondary"
                                                }`}
                                            title={
                                                type.isAvailable
                                                    ? `${count} connected`
                                                    : undefined
                                            }
                                            aria-label={
                                                type.isAvailable
                                                    ? `${count} connected`
                                                    : undefined
                                            }
                                        >
                                            {type.isAvailable
                                                ? count
                                                : "Coming soon"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : visibleItems.length === 0 ? (
                <div className="tw-card">
                    <div className="tw-card-body">
                        <div className="tw-py-6 tw-text-center">
                            <i className="ri-pulse-line tw-text-3xl tw-text-gray-300"></i>
                            <p className="tw-mb-0 tw-mt-2 tw-text-sm tw-font-medium tw-text-gray-700">
                                No {openType.name} integrations yet
                            </p>
                            <p className="tw-mb-2 tw-text-xs tw-text-gray-500">
                                {searchString || statusFilter
                                    ? "Nothing matches the current search."
                                    : "Add one to start using this service."}
                            </p>

                            {!searchString && !statusFilter && (
                                <Button
                                    type="button"
                                    variant="primary"
                                    onClick={() => wizardOpenModal(openType)}
                                >
                                    <i className="ri-add-line tw-me-1"></i>
                                    Add {openType.name}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="row tw-gap-y-3">
                    {visibleItems.map(item => (
                        <div key={item.id} className="col-12 col-xl-6">
                            <div className="tw-card tw-h-full">
                                <div className="tw-card-body">
                                    <div className="tw-flex tw-items-start tw-gap-3">
                                        <span
                                            className={`tw-grid tw-h-11 tw-w-11 tw-flex-shrink-0 tw-place-items-center tw-rounded ${providerVisual(item.providerName).tone}`}
                                        >
                                            <i
                                                className={`${providerVisual(item.providerName).icon} tw-text-lg`}
                                            ></i>
                                        </span>

                                        <div className="tw-min-w-0 tw-flex-1">
                                            <p className="tw-mb-0 tw-text-sm tw-font-medium tw-text-gray-800">
                                                {item.integrationName}
                                            </p>
                                            <p className="tw-mb-0 tw-text-xs tw-text-gray-500">
                                                Connected service via{" "}
                                                {item.providerName}.
                                            </p>
                                        </div>

                                        <span
                                            className={`badge tw-flex tw-flex-shrink-0 tw-items-center tw-gap-1 ${statusBadgeClass(item.status)}`}
                                        >
                                            <i
                                                className={`tw-h-1.5 tw-w-1.5 tw-rounded-full ${statusDotClass(item.status)}`}
                                            ></i>
                                            {statusLabel(item.status)}
                                        </span>
                                    </div>

                                    <dl className="tw-mb-0 tw-mt-3 tw-border-t tw-border-gray-200 tw-pt-3">
                                        <div className="tw-flex tw-justify-between tw-gap-3 tw-py-0.5">
                                            <dt className="tw-text-xs tw-text-gray-500">
                                                Provider
                                            </dt>
                                            <dd className="tw-mb-0 tw-truncate tw-text-xs tw-font-medium tw-text-gray-700">
                                                {item.providerName}
                                            </dd>
                                        </div>

                                        <div className="tw-flex tw-justify-between tw-gap-3 tw-py-0.5">
                                            <dt className="tw-text-xs tw-text-gray-500">
                                                Last sync
                                            </dt>
                                            <dd className="tw-mb-0 tw-text-xs tw-font-medium tw-text-gray-700">
                                                {lastSyncLabel(item)}
                                            </dd>
                                        </div>
                                    </dl>

                                    <div className="tw-mt-3 tw-flex tw-items-center tw-gap-2">
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            title="Sync now"
                                            aria-label={`Sync ${item.integrationName}`}
                                            className="!tw-h-9 !tw-w-9 !tw-p-0 tw-border tw-border-gray-200 !tw-bg-white"
                                            onClick={() => syncHandler(item)}
                                        >
                                            <i className="ri-refresh-line"></i>
                                        </Button>

                                        <Button
                                            type="button"
                                            variant="primary"
                                            className="tw-ms-auto"
                                            onClick={() => settingsHandler(item)}
                                        >
                                            Manage
                                            <i className="ri-arrow-right-line tw-ms-1"></i>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <ModalContainerUpdated
                id="crm-settings-integration-wizard"
                isOpen={wizardModalState.showModal}
                toggle={wizardCloseModal}
                modalTitle={
                    wizardModalState.modalData
                        ? `Add ${wizardModalState.modalData.name}`
                        : "Connect New Integration"
                }
                modalSize="md"
            >
                <ConnectionWizardModal
                    presetType={wizardModalState.modalData}
                    toggle={wizardCloseModal}
                    onCreate={createHandler}
                />
            </ModalContainerUpdated>

            <ModalContainerUpdated
                id="crm-settings-integration-details"
                isOpen={modalState.showModal}
                toggle={closeModal}
                modalTitle={modalState.modalData?.integrationName || "Integration"}
                modalSize="lg"
            >
                {modalState.modalData && (
                    <IntegrationDetailsModal
                        data={modalState.modalData}
                        toggle={closeModal}
                        onAuthorize={authorizeHandler}
                    />
                )}
            </ModalContainerUpdated>
        </>
    );
};

const IntegrationsPage = withSettingsPage(Integrations, "Integrations");

export default IntegrationsPage;
