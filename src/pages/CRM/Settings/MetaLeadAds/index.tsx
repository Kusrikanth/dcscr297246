import { useMemo, useState, type ChangeEvent, type MouseEvent } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

import {
    Button,
    ConfirmationModal,
    ModalContainerUpdated,
    SelectInput,
    StatusLabel,
    TextIconInput,
    TextInput,
} from "../../../../Components/Common";
import TableContainer from "../../../../Components/Common/TableContainer";
import UpdatedHorizontalTab from "../../../../Components/Common/UpdatedHorizontalTab";
import { useModal } from "../../../../hooks/modalhook";
import {
    copyToClipboard,
    formatDateTime,
    secretPlaceholder,
    settingsBranches,
    settingsBusinessUnits,
} from "../helper";
import { crmUsers } from "../Users/helper";
import { withSettingsPage } from "../index";
import AddFacebookAccountModal from "./AddFacebookAccountModal";
import {
    branchNameFor,
    businessUnitNameFor,
    importStatusTone,
    metaConfiguration,
    metaImports,
    metaLeadForms,
    metaPages,
    metaRouting,
    subscribedOptions,
    type MetaPage,
} from "./helper";
import { toast } from "react-toastify";

const validationSchema = Yup.object().shape({
    appId: Yup.string()
        .trim()
        .matches(/^\d*$/, "The app ID is numeric")
        .required("App ID is required"),

    actorUserId: Yup.string().required(
        "Required — imports fail without an import user",
    ),
});

const emptyPageFilters = {
    searchString: "",
    accountId: "",
    subscribed: "",
    branchId: "",
};

const MetaLeadAds = () => {
    const [activeId, setActiveId] = useState<string>("connect");
    const [pages, setPages] = useState<Array<MetaPage>>(metaPages);
    const [forms, setForms] = useState(metaLeadForms);
    const [imports, setImports] = useState(metaImports);
    const [stored, setStored] = useState({
        appSecret: metaConfiguration.hasAppSecret,
        systemUserToken: metaConfiguration.hasSystemUserToken,
    });

    const [pageFilters, setPageFilters] = useState(emptyPageFilters);
    const [importPagination, setImportPagination] = useState({
        pageNo: 0,
        pageSize: 10,
    });

    const { openModal, closeModal, modalState } = useModal();
    const {
        openModal: openDisconnectPage,
        closeModal: closeDisconnectPage,
        modalState: disconnectPageState,
    } = useModal();
    const {
        openModal: openDisconnectAccount,
        closeModal: closeDisconnectAccount,
        modalState: disconnectAccountState,
    } = useModal();

    const formik = useFormik({
        enableReinitialize: true,

        initialValues: {
            appId: metaConfiguration.appId,
            appSecret: "",
            systemUserToken: "",
            actorUserId: metaRouting.actorUserId,
            defaultBranchId: metaRouting.defaultBranchId,
            defaultBusinessUnitId: metaRouting.defaultBusinessUnitId,
        },

        validationSchema,

        onSubmit: values => {
            setStored(current => ({
                appSecret: current.appSecret || Boolean(values.appSecret),
                systemUserToken:
                    current.systemUserToken || Boolean(values.systemUserToken),
            }));
            formik.setFieldValue("appSecret", "");
            formik.setFieldValue("systemUserToken", "");
            toast.success("Meta settings saved");
        },
    });

    const errorFor = (field: keyof typeof formik.values) =>
        formik.touched[field] && formik.errors[field]
            ? (formik.errors[field] as string)
            : "";

    const accountOptions = useMemo(() => {
        const seen = new Map<string, string>();

        metaPages.forEach(page => {
            seen.set(
                page.accountId,
                page.accountName || "Previously connected account",
            );
        });

        return [...seen.entries()].map(([id, name]) => ({ id, name }));
    }, []);

    const branchFilterOptions = useMemo(() => {
        const seen = new Map<string, string>();

        metaPages.forEach(page => {
            seen.set(page.branchId, branchNameFor(page.branchId) || "Default");
        });

        return [...seen.entries()].map(([id, name]) => ({ id, name }));
    }, []);

    const visiblePages = useMemo(() => {
        const term = pageFilters.searchString.trim().toLowerCase();

        return pages.filter(
            page =>
                (!term ||
                    `${page.pageName} ${page.pageId}`
                        .toLowerCase()
                        .includes(term)) &&
                (!pageFilters.accountId ||
                    page.accountId === pageFilters.accountId) &&
                (!pageFilters.subscribed ||
                    (pageFilters.subscribed === "yes") === page.isSubscribed) &&
                (!pageFilters.branchId ||
                    page.branchId === pageFilters.branchId),
        );
    }, [pages, pageFilters]);

    const accountGroups = useMemo(() => {
        const groups = new Map<
            string,
            { id: string; name: string; pages: Array<MetaPage> }
        >();

        visiblePages.forEach(page => {
            const key = page.accountId || "unknown";

            if (!groups.has(key)) {
                groups.set(key, {
                    id: page.accountId,
                    name: page.accountName || "Previously connected account",
                    pages: [],
                });
            }

            groups.get(key)?.pages.push(page);
        });

        return [...groups.values()];
    }, [visiblePages]);

    const paginatedImports = useMemo(() => {
        const start = importPagination.pageNo * importPagination.pageSize;

        return imports.slice(start, start + importPagination.pageSize);
    }, [imports, importPagination]);

    const subscribedCount = pages.filter(page => page.isSubscribed).length;

    const isMissingActor = !formik.values.actorUserId;

    const isFiltered = visiblePages.length !== pages.length;

    const steps = [
        { label: "1. Connected", isDone: metaConfiguration.isConfigured },
        { label: "2. Lead routing", isDone: !isMissingActor },
        { label: "3. Pages subscribed", isDone: subscribedCount > 0 },
        { label: "4. Forms synced", isDone: forms.length > 0 },
    ];

    const importCounts = useMemo(
        () =>
            [
                { id: "imported", label: "Imported", tone: "tw-bg-emerald-50 tw-text-emerald-700" },
                { id: "duplicate", label: "Duplicates", tone: "tw-bg-amber-50 tw-text-amber-800" },
                { id: "failed", label: "Failed", tone: "tw-bg-red-50 tw-text-red-700" },
                { id: "skipped", label: "Skipped", tone: "tw-bg-gray-100 tw-text-gray-700" },
            ].map(count => ({
                ...count,
                value: imports.filter(record => record.status === count.id).length,
            })),
        [imports],
    );

    const menuOptions = useMemo(
        () => [
            {
                id: "connect",
                labelName: "Connect to Meta",
                customPadding: "0px 10px 0px 10px",
            },
            {
                id: "pages",
                labelName: `Facebook Pages (${pages.length})`,
                customPadding: "0px 10px 0px 10px",
            },
            {
                id: "imports",
                labelName: "Recent Imports",
                customPadding: "0px 10px 0px 10px",
            },
        ],
        [pages.length],
    );

    const clickMenuHandler = (event: MouseEvent<HTMLElement>) => {
        const menuId = event.currentTarget.getAttribute("data-id");

        if (menuId) {
            setActiveId(menuId);
        }
    };

    const pageFilterChangeHandler = (
        event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        const { name, value } = event.target;

        setPageFilters(current => ({ ...current, [name]: value }));
    };

    const clearPageFiltersHandler = () => setPageFilters(emptyPageFilters);

    const subscribeHandler = (page: MetaPage) => {
        setPages(current =>
            current.map(item =>
                item.pageId === page.pageId
                    ? { ...item, isSubscribed: true, subscribeError: "" }
                    : item,
            ),
        );
        toast.success(`${page.pageName} subscribed to leadgen webhooks`);
    };

    const disconnectPageHandler = () => {
        const page = disconnectPageState.modalData as MetaPage;

        setPages(current =>
            current.filter(item => item.pageId !== page.pageId),
        );
        setForms(current =>
            current.filter(form => form.pageId !== page.pageId),
        );

        closeDisconnectPage();
        toast.success(
            `${page.pageName || page.pageId} disconnected. Leads already imported are kept.`,
        );
    };

    const disconnectAccountHandler = () => {
        const group = disconnectAccountState.modalData as {
            id: string;
            name: string;
            pages: Array<MetaPage>;
        };

        const removedPageIds = pages
            .filter(page => page.accountId === group.id)
            .map(page => page.pageId);

        setPages(current =>
            current.filter(page => page.accountId !== group.id),
        );
        setForms(current =>
            current.filter(form => !removedPageIds.includes(form.pageId)),
        );

        closeDisconnectAccount();
        toast.success(
            `${removedPageIds.length} page${removedPageIds.length === 1 ? "" : "s"} disconnected from ${group.name}. Imported leads are kept.`,
        );
    };

    const connectAccountHandler = (
        accountName: string,
        connectedPages: Array<{ pageId: string; name: string }>,
    ) => {
        setPages(current => [
            ...current,
            ...connectedPages
                .filter(
                    page =>
                        !current.some(item => item.pageId === page.pageId),
                )
                .map(page => ({
                    pageId: page.pageId,
                    pageName: page.name,
                    accountId: `acct-${Date.now()}`,
                    accountName,
                    isSubscribed: true,
                    branchId: "",
                    businessUnitId: "",
                    subscribeError: "",
                })),
        ]);

        toast.success(
            `${accountName}: ${connectedPages.length} page${connectedPages.length === 1 ? "" : "s"} connected`,
        );
    };

    const retryHandler = (leadgenId: string) => {
        if (isMissingActor) {
            toast.error("Choose an import user before retrying — the lead will fail again without one.");
            return;
        }

        setImports(current =>
            current.map(record =>
                record.leadgenId === leadgenId
                    ? {
                        ...record,
                        status: "imported" as const,
                        errorMessage: "",
                        leadNumber: `LEAD-${24200 + current.indexOf(record)}`,
                    }
                    : record,
            ),
        );
        toast.success("Retry finished");
    };

    const exportHandler = () => {
    };

    const importColumns = [
        {
            Header: "Leadgen ID",
            accessor: "leadgenId",
            disableSortBy: true,
            Cell: ({
                row: { original },
            }: {
                row: { original: (typeof metaImports)[number] };
            }) => (
                <span className="tw-font-mono tw-text-xs">
                    {original.leadgenId}
                </span>
            ),
        },
        {
            Header: "Status",
            accessor: "status",
            disableSortBy: true,
            Cell: ({
                row: { original },
            }: {
                row: { original: (typeof metaImports)[number] };
            }) => (
                <StatusLabel
                    type={importStatusTone(original.status)}
                    labelName={original.status}
                />
            ),
        },
        {
            Header: "Lead",
            accessor: "leadNumber",
            disableSortBy: true,
            Cell: ({
                row: { original },
            }: {
                row: { original: (typeof metaImports)[number] };
            }) => (
                <span className="tw-font-mono tw-text-xs tw-text-[#405189]">
                    {original.leadNumber || "—"}
                </span>
            ),
        },
        {
            Header: "Campaign",
            accessor: "campaignName",
            disableSortBy: true,
            Cell: ({
                row: { original },
            }: {
                row: { original: (typeof metaImports)[number] };
            }) => (
                <div>
                    <p className="tw-mb-0 tw-text-sm tw-text-gray-800">
                        {original.campaignName || "—"}
                    </p>
                    {original.adName && (
                        <p className="tw-mb-0 tw-text-xs tw-text-gray-500">
                            {original.adName}
                        </p>
                    )}
                </div>
            ),
        },
        {
            Header: "Detail",
            disableSortBy: true,
            Cell: ({
                row: { original },
            }: {
                row: { original: (typeof metaImports)[number] };
            }) => (
                <>
                    <span
                        className="tw-text-xs tw-text-danger"
                        title={original.errorMessage}
                    >
                        {original.errorMessage}
                    </span>

                    {original.status === "failed" && (
                        <Button
                            type="button"
                            variant="linkBtn"
                            className="tw-p-0 tw-ms-2 tw-align-baseline"
                            onClick={() => retryHandler(original.leadgenId)}
                        >
                            retry
                        </Button>
                    )}
                </>
            ),
        },
        {
            Header: "When",
            accessor: "createdAt",
            disableSortBy: true,
            Cell: ({
                row: { original },
            }: {
                row: { original: (typeof metaImports)[number] };
            }) => (
                <span className="tw-whitespace-nowrap tw-text-xs tw-text-gray-500">
                    {formatDateTime(original.createdAt)}
                </span>
            ),
        },
    ];

    return (
        <form onSubmit={formik.handleSubmit}>
            <div className="tw-card tw-mb-4">
                <div className="tw-card-body">
                    <div className="tw-flex tw-flex-wrap tw-items-center tw-gap-2">
                        {steps.map(step => (
                            <span
                                key={step.label}
                                className={`tw-inline-flex tw-items-center tw-gap-1.5 tw-rounded tw-border tw-px-3 tw-py-1.5 tw-text-xs tw-font-semibold ${step.isDone
                                    ? "tw-border-emerald-200 tw-bg-emerald-50 tw-text-emerald-700"
                                    : "tw-border-gray-200 tw-bg-gray-50 tw-text-gray-500"
                                    }`}
                            >
                                <i
                                    className={
                                        step.isDone
                                            ? "ri-checkbox-circle-line"
                                            : "ri-checkbox-blank-circle-line"
                                    }
                                ></i>
                                {step.label}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {isMissingActor && (
                <div className="alert alert-warning">
                    <strong>Leads are not being imported.</strong> Choose an{" "}
                    <em>Import leads as</em> user below — every incoming lead is
                    recorded against a CRM user, and without one each lead is
                    rejected and listed as failed under Recent imports. Fix this and
                    use <em>retry</em> to bring them in.
                </div>
            )}

            <UpdatedHorizontalTab
                MenuOptions={menuOptions}
                clickMenuHandler={clickMenuHandler}
                activeTabId={activeId}
                horizontalClass=""
            />

            <div className="tw-mt-3">
                {activeId === "connect" && (
                    <>
                        <div className="tw-card tw-mb-4">
                            <div className="tw-card-body">
                                <div className="tw-mb-1 tw-flex tw-flex-wrap tw-items-center tw-justify-between tw-gap-2">
                                    <p className="tw-mb-0 tw-text-base tw-font-semibold tw-text-gray-800">
                                        1. Connect to Meta
                                    </p>

                                    <StatusLabel
                                        type={metaConfiguration.isConfigured ? "active" : "failed"}
                                        labelName={
                                            metaConfiguration.isConfigured
                                                ? "Connected"
                                                : "Not connected"
                                        }
                                    />
                                </div>

                                <p className="tw-mb-3 tw-text-xs tw-text-gray-500">
                                    From your Meta app at developers.facebook.com →
                                    Settings → Basic. Secrets are stored encrypted and
                                    never shown again.
                                </p>

                                <div className="row">
                                    <div className="col-12 col-md-6">
                                        <TextInput
                                            name="appId"
                                            labelText="App ID"
                                            labelClass="required"
                                            placeHolder="1234567890"
                                            helperText="The numeric ID of your Meta app."
                                            value={formik.values.appId}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            invalid={errorFor("appId") ? true : false}
                                            error={errorFor("appId")}
                                        />
                                    </div>

                                    <div className="col-12 col-md-6">
                                        <TextInput
                                            name="appSecret"
                                            inputType="password"
                                            labelText="App Secret"
                                            autoComplete="new-password"
                                            helperText="Used to verify that webhook calls really come from Meta."
                                            placeHolder={secretPlaceholder(
                                                stored.appSecret,
                                                "App secret",
                                            )}
                                            value={formik.values.appSecret}
                                            onChange={formik.handleChange}
                                        />
                                    </div>

                                    <div className="col-12">
                                        <TextInput
                                            name="systemUserToken"
                                            inputType="password"
                                            labelText="System User Token"
                                            autoComplete="new-password"
                                            helperText="A long-lived token from Business Settings → System Users. Needs pages_show_list, pages_manage_metadata and leads_retrieval."
                                            placeHolder={secretPlaceholder(
                                                stored.systemUserToken,
                                                "Long-lived system user token",
                                            )}
                                            value={formik.values.systemUserToken}
                                            onChange={formik.handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="tw-flex tw-flex-wrap tw-gap-2">
                                    <Button type="submit" variant="primary">
                                        Save
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="secondary"
                                        disabled={!metaConfiguration.isConfigured}
                                        onClick={() =>
                                            toast.success("Token valid — scopes: pages_show_list, pages_manage_metadata, leads_retrieval")
                                        }
                                    >
                                        <i className="ri-shield-check-line"></i>
                                        Test Token
                                    </Button>
                                </div>

                                <div className="tw-mt-3 tw-rounded tw-border tw-border-gray-200 tw-bg-gray-50 tw-p-3">
                                    {[
                                        {
                                            label: "Webhook callback URL",
                                            value: metaConfiguration.webhookUrl,
                                        },
                                        {
                                            label: "Verify token",
                                            value: metaConfiguration.verifyToken,
                                        },
                                    ].map(item => (
                                        <div key={item.label} className="tw-mb-2">
                                            <p className="tw-mb-1 tw-text-xs tw-font-semibold tw-text-gray-700">
                                                {item.label}
                                            </p>

                                            <div className="tw-flex tw-flex-wrap tw-items-center tw-gap-2">
                                                <code className="tw-break-all tw-text-xs tw-text-[#405189]">
                                                    {item.value}
                                                </code>

                                                <Button
                                                    type="button"
                                                    variant="secondary"
                                                    className="!tw-h-8 !tw-w-8 !tw-p-0 tw-border tw-border-gray-200 !tw-bg-white hover:!tw-bg-gray-50"
                                                    title={`Copy ${item.label.toLowerCase()}`}
                                                    aria-label={`Copy ${item.label.toLowerCase()}`}
                                                    onClick={() =>
                                                        copyToClipboard(item.value)
                                                    }
                                                >
                                                    <i className="ri-file-copy-line"></i>
                                                </Button>
                                            </div>
                                        </div>
                                    ))}

                                    <p className="tw-mb-0 tw-text-xs tw-text-gray-600">
                                        Paste both into your Meta App → Webhooks → Page →{" "}
                                        <code>leadgen</code>. Meta requires a public HTTPS
                                        URL; it cannot reach localhost.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="tw-card">
                            <div className="tw-card-body">
                                <div className="tw-mb-1 tw-flex tw-flex-wrap tw-items-center tw-justify-between tw-gap-2">
                                    <p className="tw-mb-0 tw-text-base tw-font-semibold tw-text-gray-800">
                                        2. Where new leads go
                                    </p>

                                    <StatusLabel
                                        type={isMissingActor ? "failed" : "active"}
                                        labelName={isMissingActor ? "Incomplete" : "Ready"}
                                    />
                                </div>

                                <p className="tw-mb-3 tw-text-xs tw-text-gray-500">
                                    Applied to every lead Meta sends. A form with its own
                                    destination overrides the default below.
                                </p>

                                <div className="row">
                                    <div className="col-12 col-md-4">
                                        <SelectInput
                                            name="actorUserId"
                                            labelText="Import Leads As"
                                            labelClass="required"
                                            defaultSelect="Select a user"
                                            value={formik.values.actorUserId}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            menuItems={crmUsers.map(user => ({
                                                id: user.id,
                                                name: `${user.name} (${user.email})`,
                                            }))}
                                            valueKey="id"
                                            textKey="name"
                                            invalid={errorFor("actorUserId") ? true : false}
                                            error={errorFor("actorUserId")}
                                        />
                                        <p className="tw-mb-3 tw-mt-[-8px] tw-text-xs tw-text-gray-500">
                                            A webhook has nobody signed in, so it acts as
                                            this user — who is then shown as the author on
                                            the lead.
                                        </p>
                                    </div>

                                    <div className="col-12 col-md-4">
                                        <SelectInput
                                            name="defaultBranchId"
                                            labelText="Default Branch"
                                            defaultSelect="No default branch"
                                            value={formik.values.defaultBranchId}
                                            onChange={formik.handleChange}
                                            menuItems={settingsBranches}
                                            valueKey="id"
                                            textKey="name"
                                        />
                                        <p className="tw-mb-3 tw-mt-[-8px] tw-text-xs tw-text-gray-500">
                                            Used when a form has no branch of its own.
                                        </p>
                                    </div>

                                    <div className="col-12 col-md-4">
                                        <SelectInput
                                            name="defaultBusinessUnitId"
                                            labelText="Default Business Unit"
                                            defaultSelect="No default business unit"
                                            value={formik.values.defaultBusinessUnitId}
                                            onChange={formik.handleChange}
                                            menuItems={settingsBusinessUnits}
                                            valueKey="id"
                                            textKey="name"
                                        />
                                        <p className="tw-mb-3 tw-mt-[-8px] tw-text-xs tw-text-gray-500">
                                            Which business the leads belong to.
                                        </p>
                                    </div>
                                </div>

                                <p className="tw-mb-2 tw-text-xs tw-text-gray-500">
                                    Only users with CRM access appear in the list. To use
                                    someone else, give them CRM access under User
                                    Management first.
                                </p>

                                <Button type="submit" variant="primary">
                                    Save
                                </Button>
                            </div>
                        </div>
                    </>
                )}

                {activeId === "pages" && (
                    <div className="tw-card">
                        <div className="tw-card-body">
                            <div className="tw-mb-1 tw-flex tw-flex-wrap tw-items-center tw-justify-between tw-gap-2">
                                <p className="tw-mb-0 tw-text-base tw-font-semibold tw-text-gray-800">
                                    3. Facebook pages ({pages.length})
                                    {accountGroups.length > 0 && (
                                        <span className="tw-ms-2 tw-text-xs tw-font-normal tw-text-gray-500">
                                            across {accountGroups.length} account
                                            {accountGroups.length === 1 ? "" : "s"}
                                        </span>
                                    )}
                                </p>

                                <div className="tw-flex tw-flex-wrap tw-gap-2">
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        disabled={!metaConfiguration.isConfigured}
                                        onClick={() =>
                                            toast.success(`${subscribedCount}/${pages.length} pages subscribed`)
                                        }
                                    >
                                        <i className="ri-refresh-line"></i>
                                        Re-sync Saved Account
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="secondary"
                                        disabled={!pages.length}
                                        title={
                                            pages.length
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
                                        disabled={!metaConfiguration.isConfigured}
                                        onClick={() => openModal()}
                                    >
                                        <i className="ri-add-line"></i>
                                        Add Facebook Account
                                    </Button>
                                </div>
                            </div>

                            <p className="tw-mb-3 tw-text-xs tw-text-gray-500">
                                Connect as many pages as you need. Pages from different
                                Facebook accounts can coexist — each page stores its own
                                access token, so lead delivery is independent.
                            </p>

                            <div className="row tw-items-end tw-gap-y-3">
                                <div className="col-12 col-md-6 col-xl-3">
                                    <TextIconInput
                                        formgroupClassName="search-box tw-mb-0"
                                        name="searchString"
                                        value={pageFilters.searchString}
                                        onChange={pageFilterChangeHandler}
                                        placeHolder="Search page name or ID…"
                                    >
                                        <i className="ri-search-line search-icon"></i>
                                    </TextIconInput>
                                </div>

                                <div className="col-12 col-md-6 col-xl-3">
                                    <SelectInput
                                        name="accountId"
                                        labelText="Account"
                                        defaultSelect="All accounts"
                                        value={pageFilters.accountId}
                                        onChange={pageFilterChangeHandler}
                                        menuItems={accountOptions}
                                        valueKey="id"
                                        textKey="name"
                                        formgroupClassName="tw-mb-0"
                                        floatingLabel
                                    />
                                </div>

                                <div className="col-12 col-md-6 col-xl-3">
                                    <SelectInput
                                        name="subscribed"
                                        labelText="Receiving leads"
                                        defaultSelect="Any"
                                        value={pageFilters.subscribed}
                                        onChange={pageFilterChangeHandler}
                                        menuItems={subscribedOptions}
                                        valueKey="id"
                                        textKey="name"
                                        formgroupClassName="tw-mb-0"
                                        floatingLabel
                                    />
                                </div>

                                <div className="col-12 col-md-6 col-xl-3">
                                    <SelectInput
                                        name="branchId"
                                        labelText="Branch"
                                        defaultSelect="All branches"
                                        value={pageFilters.branchId}
                                        onChange={pageFilterChangeHandler}
                                        menuItems={branchFilterOptions}
                                        valueKey="id"
                                        textKey="name"
                                        formgroupClassName="tw-mb-0"
                                        floatingLabel
                                    />
                                </div>
                            </div>

                            {isFiltered && (
                                <div className="tw-mt-3 tw-flex tw-items-center tw-gap-2">
                                    <span className="tw-text-xs tw-text-gray-500">
                                        {visiblePages.length} of {pages.length}
                                    </span>

                                    <Button
                                        type="button"
                                        variant="linkBtn"
                                        className="tw-p-0"
                                        title="Clear filters"
                                        onClick={clearPageFiltersHandler}
                                    >
                                        Clear filters
                                    </Button>
                                </div>
                            )}

                            {pages.length === 0 ? (
                                <p className="tw-mb-0 tw-py-4 tw-text-center tw-text-sm tw-text-gray-500">
                                    No pages yet. Save the credentials and re-sync, or add
                                    a Facebook account above.
                                </p>
                            ) : !visiblePages.length ? (
                                <p className="tw-mb-0 tw-py-4 tw-text-center tw-text-sm tw-text-gray-500">
                                    No pages match these filters.
                                </p>
                            ) : (
                                <div className="tw-mt-3 tw-flex tw-flex-col tw-gap-3">
                                    {accountGroups.map(group => (
                                        <div
                                            key={group.id || "unknown"}
                                            className="tw-overflow-hidden tw-rounded tw-border tw-border-gray-200"
                                        >
                                            <div className="tw-flex tw-flex-wrap tw-items-center tw-justify-between tw-gap-2 tw-border-b tw-border-gray-200 tw-bg-gray-50 tw-px-3 tw-py-2">
                                                <div className="tw-min-w-0">
                                                    <p className="tw-mb-0 tw-text-sm tw-font-semibold tw-text-gray-800">
                                                        {group.name}
                                                    </p>
                                                    <p className="tw-mb-0 tw-text-xs tw-text-gray-500">
                                                        {group.pages.length} page
                                                        {group.pages.length === 1 ? "" : "s"} ·{" "}
                                                        {
                                                            group.pages.filter(
                                                                page => page.isSubscribed,
                                                            ).length
                                                        }{" "}
                                                        subscribed
                                                    </p>
                                                </div>

                                                <Button
                                                    type="button"
                                                    variant="wrong"
                                                    onClick={() =>
                                                        openDisconnectAccount(group)
                                                    }
                                                >
                                                    Disconnect Account
                                                </Button>
                                            </div>

                                            <div className="table-responsive">
                                                <table className="table table-sm align-middle mb-0">
                                                    <thead className="table-light text-muted">
                                                        <tr>
                                                            <th>Page</th>
                                                            <th>Receiving leads</th>
                                                            <th>Destination</th>
                                                            <th>Forms</th>
                                                            <th>Actions</th>
                                                        </tr>
                                                    </thead>

                                                    <tbody>
                                                        {group.pages.map(page => (
                                                            <tr key={page.pageId}>
                                                                <td>
                                                                    <p className="tw-mb-0 tw-text-sm tw-font-medium tw-text-gray-800">
                                                                        {page.pageName ||
                                                                            "(unnamed)"}
                                                                    </p>
                                                                    <p className="tw-mb-0 tw-font-mono tw-text-xs tw-text-gray-500">
                                                                        {page.pageId}
                                                                    </p>
                                                                    {page.subscribeError && (
                                                                        <p className="tw-mb-0 tw-text-xs tw-text-danger">
                                                                            {page.subscribeError}
                                                                        </p>
                                                                    )}
                                                                </td>

                                                                <td>
                                                                    <StatusLabel
                                                                        type={
                                                                            page.isSubscribed
                                                                                ? "active"
                                                                                : "failed"
                                                                        }
                                                                        labelName={
                                                                            page.isSubscribed
                                                                                ? "Yes"
                                                                                : "No"
                                                                        }
                                                                    />
                                                                </td>

                                                                <td>
                                                                    <p className="tw-mb-0 tw-text-sm tw-text-gray-800">
                                                                        {businessUnitNameFor(
                                                                            page.businessUnitId,
                                                                        ) || (
                                                                                <span className="tw-text-gray-400">
                                                                                    Default unit
                                                                                </span>
                                                                            )}
                                                                    </p>
                                                                    <p className="tw-mb-0 tw-text-xs tw-text-gray-500">
                                                                        {branchNameFor(
                                                                            page.branchId,
                                                                        ) || "Default branch"}
                                                                    </p>
                                                                </td>

                                                                <td>
                                                                    <span className="badge badge-soft-secondary">
                                                                        {
                                                                            forms.filter(
                                                                                form =>
                                                                                    form.pageId ===
                                                                                    page.pageId,
                                                                            ).length
                                                                        }
                                                                    </span>
                                                                </td>

                                                                <td>
                                                                    <div className="tw-flex tw-flex-wrap tw-gap-2">
                                                                        {page.isSubscribed ? (
                                                                            <Button
                                                                                type="button"
                                                                                variant="hoverInfo"
                                                                                onClick={() =>
                                                                                    toast.success(`${forms.filter(form => form.pageId === page.pageId).length} forms synced`)
                                                                                }
                                                                            >
                                                                                Sync Forms
                                                                            </Button>
                                                                        ) : (
                                                                            <Button
                                                                                type="button"
                                                                                variant="hoverInfo"
                                                                                onClick={() =>
                                                                                    subscribeHandler(
                                                                                        page,
                                                                                    )
                                                                                }
                                                                            >
                                                                                Subscribe
                                                                            </Button>
                                                                        )}

                                                                        <Button
                                                                            type="button"
                                                                            variant="wrong"
                                                                            title={`Disconnect ${page.pageName || page.pageId}`}
                                                                            onClick={() =>
                                                                                openDisconnectPage(
                                                                                    page,
                                                                                )
                                                                            }
                                                                        >
                                                                            Disconnect
                                                                        </Button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeId === "imports" && (
                    <div className="tw-card">
                        <div className="tw-card-body">
                            <div className="tw-mb-1 tw-flex tw-flex-wrap tw-items-center tw-justify-between tw-gap-2">
                                <p className="tw-mb-0 tw-text-base tw-font-semibold tw-text-gray-800">
                                    Recent imports
                                </p>

                                <Button
                                    type="button"
                                    variant="secondary"
                                    disabled={!imports.length}
                                    title={
                                        imports.length
                                            ? "Download this list as CSV"
                                            : "Nothing to export"
                                    }
                                    onClick={exportHandler}
                                >
                                    <i className="ri-download-2-line"></i>
                                    Export
                                </Button>
                            </div>

                            <p className="tw-mb-3 tw-text-xs tw-text-gray-500">
                                Every lead Meta has sent. Failed ones are kept and can be
                                retried once the cause is fixed.
                            </p>

                            <div className="tw-mb-3 tw-flex tw-flex-wrap tw-gap-2">
                                {importCounts.map(count => (
                                    <div
                                        key={count.id}
                                        className={`tw-rounded tw-px-3 tw-py-2 ${count.tone}`}
                                    >
                                        <p className="tw-mb-0 tw-text-lg tw-font-bold">
                                            {count.value}
                                        </p>
                                        <p className="tw-mb-0 tw-text-xs tw-font-semibold">
                                            {count.label}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {imports.length === 0 ? (
                                <p className="tw-mb-0 tw-py-4 tw-text-center tw-text-sm tw-text-gray-500">
                                    No leads received yet.
                                </p>
                            ) : (
                                <TableContainer
                                    columns={importColumns}
                                    data={paginatedImports}
                                    tableClass="mb-0"
                                    divClass="table-responsive mb-3"
                                    theadClass="table-light text-muted align-middle"
                                    showPagination
                                    totalPages={Math.ceil(
                                        imports.length / importPagination.pageSize,
                                    )}
                                    totalRecords={imports.length}
                                    currentPageNumber={importPagination.pageNo}
                                    pageSize={importPagination.pageSize}
                                    callbackPaginationHndlr={(state: {
                                        pageNo: number;
                                        pageSize: number;
                                    }) => setImportPagination(state)}
                                />
                            )}
                        </div>
                    </div>
                )}
            </div>

            <ModalContainerUpdated
                id="crm-settings-meta-account"
                isOpen={modalState.showModal}
                toggle={closeModal}
                modalTitle="Add Facebook Account"
                modalSize="lg"
            >
                <AddFacebookAccountModal
                    connectedPageIds={pages.map(page => page.pageId)}
                    subscribedPageIds={pages
                        .filter(page => page.isSubscribed)
                        .map(page => page.pageId)}
                    toggle={closeModal}
                    onConnect={connectAccountHandler}
                />
            </ModalContainerUpdated>

            <ConfirmationModal
                id="crm-settings-meta-disconnect-page"
                isOpen={disconnectPageState.showModal}
                iconType="reject"
                confirmTitle="Disconnect page"
                confirmMessage={
                    disconnectPageState.modalData
                        ? `Disconnect "${(disconnectPageState.modalData as MetaPage).pageName || (disconnectPageState.modalData as MetaPage).pageId}"?`
                        : ""
                }
                noteMessage="It stops receiving leads and is removed from the CRM along with its forms. Leads already imported are kept."
                confirmBtnText="Disconnect"
                cancelHndlr={closeDisconnectPage}
                confirmHndlr={disconnectPageHandler}
            />

            <ConfirmationModal
                id="crm-settings-meta-disconnect-account"
                isOpen={disconnectAccountState.showModal}
                iconType="reject"
                confirmTitle="Disconnect account"
                confirmMessage={
                    disconnectAccountState.modalData
                        ? `Disconnect all ${(disconnectAccountState.modalData as { pages: Array<MetaPage> }).pages.length} page(s) connected through ${(disconnectAccountState.modalData as { name: string }).name}?`
                        : ""
                }
                noteMessage="Imported leads are kept."
                confirmBtnText="Disconnect"
                cancelHndlr={closeDisconnectAccount}
                confirmHndlr={disconnectAccountHandler}
            />
        </form>
    );
};

const MetaLeadAdsPage = withSettingsPage(MetaLeadAds, "Meta Lead Ads");

export default MetaLeadAdsPage;
