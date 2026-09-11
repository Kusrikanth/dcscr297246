import { useMemo, useState, type MouseEvent } from "react";

import UpdatedHorizontalTab from "../../../../../Components/Common/UpdatedHorizontalTab";
import {
    Button,
    ConfirmationModal,
    MenuOptionHrtl,
    ModalContainerUpdated,
    SelectInput,
    StatusLabel,
    Switch,
    TextIconInput,
} from "../../../../../Components/Common";
import type { IOptionsHrtl } from "../../../../../Components/Common/MenuOptions";
import { useModal } from "../../../../../hooks/modalhook";
import {
    formatDateTime,
    settingsBranches,
    type FieldChangeEvent,
} from "../../helper";
import AddEditWhatsAppTemplateModal from "./AddEditWhatsAppTemplateModal";
import {
    previewBody,
    statusLabel,
    statusTone,
    variableCountOf,
    whatsappAccounts,
    whatsappBranchMappings as sampleMappings,
    whatsappCategories,
    whatsappLanguages,
    whatsappStatusOptions,
    whatsappTemplates as sampleTemplates,
    type WhatsAppBranchMapping,
    type WhatsAppTemplate,
} from "./helper";
import { toast } from "react-toastify";

interface FilterState {
    searchString: string;
    status: string;
    category: string;
}

const initialFilterState: FilterState = {
    searchString: "",
    status: "",
    category: "",
};

const WhatsAppTemplates = () => {
    const [templates, setTemplates] =
        useState<Array<WhatsAppTemplate>>(sampleTemplates);
    const [mappings, setMappings] =
        useState<Array<WhatsAppBranchMapping>>(sampleMappings);
    const [accountId, setAccountId] = useState<string>(
        whatsappAccounts[0]?.id || "",
    );
    const [filterState, setFilterState] =
        useState<FilterState>(initialFilterState);
    const [view, setView] = useState<string>("templates");

    const viewMenuOptions = [
        {
            id: "templates",
            labelName: "Templates",
            customPadding: "0px 10px 0px 10px",
        },
        {
            id: "branches",
            labelName: "Branch Mapping",
            customPadding: "0px 10px 0px 10px",
        },
    ];

    const clickViewMenuHandler = (event: MouseEvent<HTMLElement>) => {
        const menuId = event.currentTarget.getAttribute("data-id");

        if (menuId) {
            setView(menuId);
        }
    };

    const { openModal, closeModal, modalState } = useModal();
    const {
        openModal: previewOpenModal,
        closeModal: previewCloseModal,
        modalState: previewModalState,
    } = useModal();
    const {
        openModal: deleteOpenModal,
        closeModal: deleteCloseModal,
        modalState: deleteModalState,
    } = useModal();

    const account = useMemo(
        () => whatsappAccounts.find(item => item.id === accountId),
        [accountId],
    );

    const statusCounts = useMemo(
        () =>
            whatsappStatusOptions.map(option => ({
                ...option,
                value: templates.filter(
                    template =>
                        template.accountId === accountId &&
                        template.status === option.id,
                ).length,
            })),
        [accountId, templates],
    );

    const filterChangeHandler = (event: FieldChangeEvent) => {
        const { name, value } = event.target;

        setFilterState(prevState => ({ ...prevState, [name]: value }));
    };

    const saveHandler = (template: WhatsAppTemplate, isNew: boolean) => {
        setTemplates(current =>
            isNew
                ? [template, ...current]
                : current.map(item =>
                    item.id === template.id ? template : item,
                ),
        );
        toast.success(
            isNew
                ? "Template submitted for review"
                : "Template saved and resubmitted for review",
        );
    };

    const duplicateHandler = (template: WhatsAppTemplate) => {
        setTemplates(current => [
            {
                ...template,
                id: `whatsapp-template-${Date.now()}`,
                templateName: `${template.templateName}_copy`,
                status: "draft",
                rejectionReason: "",
                updatedAt: new Date().toISOString(),
            },
            ...current,
        ]);
        toast.success("Template duplicated as a draft");
    };

    const findTemplate = (templateId: string | null) =>
        templates.find(template => template.id === templateId);

    const actionsList: Array<IOptionsHrtl> = [
        {
            id: "preview",
            actionIcon: <i className="ri-eye-line tw-text-gray-500"></i>,
            actionName: "Preview Template",
            onClickHndlr: (event: MouseEvent<HTMLElement>) => {
                const template = findTemplate(
                    event.currentTarget.getAttribute("data-id"),
                );

                if (template) {
                    previewOpenModal(template);
                }
            },
        },
        {
            id: "duplicate",
            actionIcon: <i className="ri-file-copy-line tw-text-gray-500"></i>,
            actionName: "Duplicate Template",
            onClickHndlr: (event: MouseEvent<HTMLElement>) => {
                const template = findTemplate(
                    event.currentTarget.getAttribute("data-id"),
                );

                if (template) {
                    duplicateHandler(template);
                }
            },
        },
        {
            id: "edit",
            actionIcon: <i className="ri-pencil-line tw-text-gray-500"></i>,
            actionName: "Edit Template",
            onClickHndlr: (event: MouseEvent<HTMLElement>) => {
                const template = findTemplate(
                    event.currentTarget.getAttribute("data-id"),
                );

                if (template) {
                    openModal(template);
                }
            },
        },
        {
            id: "delete",
            actionIcon: <i className="ri-delete-bin-line tw-text-danger"></i>,
            actionName: "Delete Template",
            onClickHndlr: (event: MouseEvent<HTMLElement>) => {
                const template = findTemplate(
                    event.currentTarget.getAttribute("data-id"),
                );

                if (template) {
                    deleteOpenModal(template);
                }
            },
        },
    ];

    const submitHandler = (template: WhatsAppTemplate) => {
        setTemplates(current =>
            current.map(item =>
                item.id === template.id
                    ? {
                        ...item,
                        status: "pending" as const,
                        rejectionReason: "",
                        updatedAt: new Date().toISOString(),
                    }
                    : item,
            ),
        );
        toast.success("Template submitted for review");
    };

    const deleteHandler = () => {
        const template: WhatsAppTemplate | undefined = deleteModalState.modalData;

        if (!template) {
            return;
        }

        setTemplates(current => current.filter(item => item.id !== template.id));
        deleteCloseModal();
        toast.success(`"${template.templateName}" deleted`);
    };

    const mappingChangeHandler = (
        branchId: string,
        changes: Partial<WhatsAppBranchMapping>,
    ) => {
        setMappings(current =>
            current.map(mapping =>
                mapping.branchId === branchId
                    ? { ...mapping, ...changes }
                    : mapping,
            ),
        );
    };

    if (!whatsappAccounts.length) {
        return (
            <div className="tw-card">
                <div className="tw-card-body">
                    <div className="tw-py-6 tw-text-center">
                        <i className="ri-whatsapp-line tw-text-3xl tw-text-gray-300"></i>
                        <p className="tw-mb-0 tw-mt-2 tw-text-sm tw-font-medium tw-text-gray-700">
                            No WhatsApp account connected
                        </p>
                        <p className="tw-mb-0 tw-text-xs tw-text-gray-500">
                            Connect a Smartping WhatsApp account under Integrations,
                            then add its templates here.
                        </p>
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
                        {whatsappAccounts.length > 1 && (
                            <div className="col-12 col-md-6 col-xl-3">
                                <SelectInput
                                    name="accountId"
                                    labelText="WhatsApp Account"
                                    hideSelectOption
                                    value={accountId}
                                    onChange={(
                                        event: React.ChangeEvent<HTMLSelectElement>,
                                    ) => setAccountId(event.target.value)}
                                    menuItems={whatsappAccounts}
                                    valueKey="id"
                                    textKey="name"
                                    formgroupClassName="tw-mb-0"
                                    floatingLabel
                                />
                            </div>
                        )}

                        <div className="col-12 col-xl-9">
                            <div className="tw-flex tw-flex-wrap tw-items-center tw-justify-end tw-gap-2">
                                <span className="tw-text-sm tw-text-gray-500">
                                    {account?.senderNumber} · WABA {account?.wabaId}
                                </span>

                                <UpdatedHorizontalTab
                                    MenuOptions={viewMenuOptions}
                                    clickMenuHandler={clickViewMenuHandler}
                                    activeTabId={view}
                                    horizontalClass=""
                                />

                                {view === "templates" && (
                                    <Button
                                        type="button"
                                        variant="primary"
                                        onClick={() => openModal()}
                                    >
                                        <i className="ri-add-line tw-me-1"></i>
                                        Add Template
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {view === "branches" ? (
                <div className="tw-card">
                    <div className="tw-card-body">
                        <p className="tw-mb-0 tw-text-base tw-font-semibold tw-text-gray-800">
                            Branch mapping
                        </p>
                        <p className="tw-mb-3 tw-text-sm tw-text-gray-500">
                            Which branches may send from this WhatsApp number. A
                            branch with no mapping cannot send at all.
                        </p>

                        <div className="tw-flex tw-flex-col tw-gap-2">
                            {settingsBranches.map(branch => {
                                const mapping = mappings.find(
                                    item => item.branchId === branch.id,
                                );

                                return (
                                    <div
                                        key={branch.id}
                                        className="tw-flex tw-flex-wrap tw-items-center tw-gap-3 tw-rounded tw-border tw-border-gray-200 tw-p-3"
                                    >
                                        <div className="tw-min-w-0 tw-flex-1">
                                            <p className="tw-mb-0 tw-text-sm tw-font-medium tw-text-gray-800">
                                                {branch.name}
                                            </p>
                                            <p className="tw-mb-0 tw-text-xs tw-text-gray-500">
                                                {mapping?.senderNumber ||
                                                    "No sender number mapped"}
                                            </p>
                                        </div>

                                        <div className="tw-w-full sm:tw-w-[240px]">
                                            <SelectInput
                                                name={`account-${branch.id}`}
                                                defaultSelect="Not mapped"
                                                value={mapping?.accountId || ""}
                                                onChange={(
                                                    event: React.ChangeEvent<HTMLSelectElement>,
                                                ) => {
                                                    const nextAccount =
                                                        whatsappAccounts.find(
                                                            item =>
                                                                item.id ===
                                                                event.target.value,
                                                        );

                                                    mappingChangeHandler(branch.id, {
                                                        accountId: event.target.value,
                                                        senderNumber:
                                                            nextAccount?.senderNumber ||
                                                            "",
                                                        isActive: Boolean(
                                                            event.target.value,
                                                        ),
                                                    });
                                                }}
                                                menuItems={whatsappAccounts}
                                                valueKey="id"
                                                textKey="name"
                                                formgroupClassName="tw-mb-0"
                                                floatingLabel
                                            />
                                        </div>

                                        <Switch
                                            attributeId={`mapping-active-${branch.id}`}
                                            labelName="Sending enabled"
                                            checked={Boolean(mapping?.isActive)}
                                            isDisabled={!mapping?.accountId}
                                            onChangeHndlr={() =>
                                                mappingChangeHandler(branch.id, {
                                                    isActive: !mapping?.isActive,
                                                })
                                            }
                                        />
                                    </div>
                                );
                            })}
                        </div>

                        <div className="tw-mt-3 tw-flex tw-justify-end tw-border-t tw-border-gray-200 tw-pt-3">
                            <Button
                                type="button"
                                variant="primary"
                                onClick={() =>
                                    toast.success("Branch mapping saved")
                                }
                            >
                                Save Mapping
                            </Button>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <div className="row tw-mb-4 tw-gap-y-3">
                        {statusCounts.map(count => (
                            <div key={count.id} className="col-6 col-xl-3">
                                <div className="tw-card tw-h-full">
                                    <div className="tw-card-body">
                                        <p className="tw-mb-0 tw-text-xl tw-font-semibold tw-text-gray-800">
                                            {count.value}
                                        </p>
                                        <p className="tw-mb-0 tw-text-xs tw-text-gray-500">
                                            {count.name}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="tw-card tw-mb-4">
                        <div className="tw-card-body">
                            <div className="row tw-items-end tw-gap-y-3">
                                <div className="col-12 col-md-6 col-xl-5">
                                    <TextIconInput
                                        formgroupClassName="search-box tw-mb-0"
                                        name="searchString"
                                        labelText="Search"
                                        value={filterState.searchString}
                                        onChange={filterChangeHandler}
                                        placeHolder="Search template name or body…"
                                        floatingLabel
                                    >
                                        <i className="ri-search-line search-icon"></i>
                                    </TextIconInput>
                                </div>

                                <div className="col-6 col-md-3">
                                    <SelectInput
                                        name="status"
                                        labelText="Status"
                                        defaultSelect="All statuses"
                                        value={filterState.status}
                                        onChange={filterChangeHandler}
                                        menuItems={whatsappStatusOptions}
                                        valueKey="id"
                                        textKey="name"
                                        formgroupClassName="tw-mb-0"
                                        floatingLabel
                                    />
                                </div>

                                <div className="col-6 col-md-3">
                                    <SelectInput
                                        name="category"
                                        labelText="Category"
                                        defaultSelect="All categories"
                                        value={filterState.category}
                                        onChange={filterChangeHandler}
                                        menuItems={whatsappCategories}
                                        valueKey="id"
                                        textKey="name"
                                        formgroupClassName="tw-mb-0"
                                        floatingLabel
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {!templates.length ? (
                        <div className="tw-card">
                            <div className="tw-card-body">
                                <p className="tw-mb-0 tw-py-6 tw-text-center tw-text-sm tw-text-gray-500">
                                    No WhatsApp templates yet.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="row tw-gap-y-3">
                            {templates.map(template => {
                                const variableCount = variableCountOf(template.body);

                                return (
                                    <div
                                        key={template.id}
                                        className="col-12 col-xl-6"
                                    >
                                        <div className="tw-card tw-h-full">
                                            <div className="tw-card-body">
                                                <div className="tw-flex tw-items-start tw-gap-3">
                                                    <div className="tw-min-w-0 tw-flex-1">
                                                        <p className="tw-mb-0 tw-font-mono tw-text-sm tw-font-medium tw-text-gray-800">
                                                            {template.templateName}
                                                        </p>
                                                        <p className="tw-mb-0 tw-text-xs tw-text-gray-500">
                                                            {
                                                                whatsappCategories.find(
                                                                    option =>
                                                                        option.id ===
                                                                        template.category,
                                                                )?.name
                                                            }{" "}
                                                            ·{" "}
                                                            {
                                                                whatsappLanguages.find(
                                                                    option =>
                                                                        option.id ===
                                                                        template.language,
                                                                )?.name
                                                            }{" "}
                                                            · {variableCount} variable
                                                            {variableCount === 1
                                                                ? ""
                                                                : "s"}
                                                        </p>
                                                    </div>

                                                    <StatusLabel
                                                        type={statusTone(
                                                            template.status,
                                                        )}
                                                        labelName={statusLabel(
                                                            template.status,
                                                        )}
                                                    />
                                                </div>

                                                <p className="tw-mb-0 tw-mt-2 tw-line-clamp-3 tw-text-sm tw-text-gray-600">
                                                    {template.body}
                                                </p>

                                                {template.rejectionReason && (
                                                    <p className="tw-mb-0 tw-mt-2 tw-rounded tw-bg-red-50 tw-p-2 tw-text-xs tw-text-red-700">
                                                        {template.rejectionReason}
                                                    </p>
                                                )}

                                                <p className="tw-mb-0 tw-mt-2 tw-text-xs tw-text-gray-500">
                                                    Updated{" "}
                                                    {formatDateTime(template.updatedAt)}
                                                </p>

                                                <div className="tw-mt-3 tw-flex tw-flex-wrap tw-justify-end tw-gap-1 tw-border-t tw-border-gray-200 tw-pt-3">
                                                    {["draft", "rejected"].includes(
                                                        template.status,
                                                    ) && (
                                                            <Button
                                                                type="button"
                                                                variant="hoverInfo"
                                                                onClick={() =>
                                                                    submitHandler(
                                                                        template,
                                                                    )
                                                                }
                                                            >
                                                                Submit for Review
                                                            </Button>
                                                        )}

                                                    <MenuOptionHrtl
                                                        actionOptions={actionsList}
                                                        rowId={template.id}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </>
            )}

            <ModalContainerUpdated
                id="crm-settings-whatsapp-template"
                isOpen={modalState.showModal}
                toggle={closeModal}
                modalTitle={
                    modalState.modalData
                        ? "Edit WhatsApp Template"
                        : "Add WhatsApp Template"
                }
                modalSize="lg"
            >
                <AddEditWhatsAppTemplateModal
                    data={modalState.modalData}
                    accountId={accountId}
                    toggle={closeModal}
                    onSave={saveHandler}
                />
            </ModalContainerUpdated>

            <ModalContainerUpdated
                id="crm-settings-whatsapp-preview"
                isOpen={previewModalState.showModal}
                toggle={previewCloseModal}
                modalTitle={previewModalState.modalData?.templateName || "Preview"}
                modalSize="md"
            >
                {previewModalState.modalData && (
                    <div className="tw-p-4">
                        <div className="tw-rounded tw-bg-[#ece5dd] tw-p-3">
                            <div className="tw-max-w-[320px] tw-rounded tw-bg-white tw-p-3 tw-shadow-sm">
                                {previewModalState.modalData.headerType === "text" &&
                                    previewModalState.modalData.headerText && (
                                        <p className="tw-mb-1 tw-text-sm tw-font-semibold tw-text-gray-800">
                                            {previewModalState.modalData.headerText}
                                        </p>
                                    )}

                                <p className="tw-mb-1 tw-whitespace-pre-wrap tw-text-sm tw-text-gray-800">
                                    {previewBody(previewModalState.modalData.body)}
                                </p>

                                {previewModalState.modalData.footer && (
                                    <p className="tw-mb-0 tw-text-xs tw-text-gray-500">
                                        {previewModalState.modalData.footer}
                                    </p>
                                )}

                                {previewModalState.modalData.buttons.length > 0 && (
                                    <div className="tw-mt-2 tw-flex tw-flex-col tw-gap-1 tw-border-t tw-border-gray-200 tw-pt-2">
                                        {previewModalState.modalData.buttons.map(
                                            (button: { id: string; text: string }) => (
                                                <span
                                                    key={button.id}
                                                    className="tw-text-center tw-text-sm tw-text-[#0b7a4f]"
                                                >
                                                    {button.text}
                                                </span>
                                            ),
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="tw-mt-4 tw-flex tw-justify-end tw-border-t tw-border-gray-200 tw-pt-4">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={previewCloseModal}
                            >
                                Close
                            </Button>
                        </div>
                    </div>
                )}
            </ModalContainerUpdated>

            <ConfirmationModal
                id="crm-settings-whatsapp-template-delete"
                isOpen={deleteModalState.showModal}
                iconType="reject"
                confirmTitle="Delete this WhatsApp template?"
                confirmMessage={`"${deleteModalState.modalData?.templateName}" will no longer be available to send.`}
                noteMessage="Messages already sent from it are kept."
                confirmBtnText="Delete Template"
                confirmHndlr={deleteHandler}
                cancelHndlr={deleteCloseModal}
            />
        </>
    );
};

export default WhatsAppTemplates;
