import { useState, type MouseEvent } from "react";

import {
    Button,
    ConfirmationModal,
    MenuOptionHrtl,
    ModalContainerUpdated,
    SelectInput,
    StatusLabel,
    TextIconInput,
} from "../../../../../Components/Common";
import type { IOptionsHrtl } from "../../../../../Components/Common/MenuOptions";
import { useModal } from "../../../../../hooks/modalhook";
import AddEditSmsTemplateModal from "./AddEditSmsTemplateModal";
import {
    segmentCountOf,
    smsAccounts,
    smsTemplates as sampleTemplates,
    variableCountOf,
    type SmsTemplate,
} from "./helper";
import { toast } from "react-toastify";

const SmsTemplates = () => {
    const [templates, setTemplates] =
        useState<Array<SmsTemplate>>(sampleTemplates);
    const [accountId, setAccountId] = useState<string>(
        smsAccounts[0]?.id || "",
    );
    const [searchString, setSearchString] = useState<string>("");

    const { openModal, closeModal, modalState } = useModal();
    const {
        openModal: deleteOpenModal,
        closeModal: deleteCloseModal,
        modalState: deleteModalState,
    } = useModal();

    const findTemplate = (templateId: string | null) =>
        templates.find(template => template.id === templateId);

    const actionsList: Array<IOptionsHrtl> = [
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

    const saveHandler = (template: SmsTemplate, isNew: boolean) => {
        setTemplates(current =>
            isNew
                ? [template, ...current]
                : current.map(item =>
                    item.id === template.id ? template : item,
                ),
        );
        toast.success(isNew ? "Template added" : "Template saved");
    };

    const deleteHandler = () => {
        const template: SmsTemplate | undefined = deleteModalState.modalData;

        if (!template) {
            return;
        }

        setTemplates(current => current.filter(item => item.id !== template.id));
        deleteCloseModal();
        toast.success(`"${template.templateName}" deleted`);
    };

    if (!smsAccounts.length) {
        return (
            <div className="tw-card">
                <div className="tw-card-body">
                    <div className="tw-py-6 tw-text-center">
                        <i className="ri-message-2-line tw-text-3xl tw-text-gray-300"></i>
                        <p className="tw-mb-0 tw-mt-2 tw-text-sm tw-font-medium tw-text-gray-700">
                            No SMS account connected
                        </p>
                        <p className="tw-mb-0 tw-text-xs tw-text-gray-500">
                            Connect a SmartPing SMS account under Integrations, then
                            add its templates here.
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
                        <div className="col-12 col-md-6 col-xl-4">
                            <TextIconInput
                                formgroupClassName="search-box tw-mb-0"
                                name="searchString"
                                labelText="Search"
                                value={searchString}
                                onChange={(
                                    event: React.ChangeEvent<HTMLInputElement>,
                                ) => setSearchString(event.target.value)}
                                placeHolder="Search templates…"
                                floatingLabel
                            >
                                <i className="ri-search-line search-icon"></i>
                            </TextIconInput>
                        </div>

                        {smsAccounts.length > 1 && (
                            <div className="col-12 col-md-6 col-xl-3">
                                <SelectInput
                                    name="accountId"
                                    labelText="SMS Account"
                                    hideSelectOption
                                    value={accountId}
                                    onChange={(
                                        event: React.ChangeEvent<HTMLSelectElement>,
                                    ) => setAccountId(event.target.value)}
                                    menuItems={smsAccounts}
                                    valueKey="id"
                                    textKey="name"
                                    formgroupClassName="tw-mb-0"
                                    floatingLabel
                                />
                            </div>
                        )}

                        <div className="col-auto ms-auto">
                            <div className="tw-flex tw-flex-wrap tw-items-center tw-justify-end tw-gap-2">
                                <span className="tw-text-sm tw-text-gray-500">
                                    {templates.length} template
                                    {templates.length === 1 ? "" : "s"}
                                </span>

                                <Button
                                    type="button"
                                    variant="primary"
                                    onClick={() => openModal()}
                                >
                                    <i className="ri-add-line tw-me-1"></i>
                                    Add Template
                                </Button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {!templates.length ? (
                <div className="tw-card">
                    <div className="tw-card-body">
                        <p className="tw-mb-0 tw-py-6 tw-text-center tw-text-sm tw-text-gray-500">
                            No SMS templates yet. Add the wordings you have
                            registered on the DLT portal.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="tw-flex tw-flex-col tw-gap-3">
                    {templates.map(template => {
                        const variableCount = variableCountOf(template.body);

                        return (
                            <div key={template.id} className="tw-card tw-mb-0">
                                <div className="tw-card-body">
                                    <div className="tw-flex tw-flex-wrap tw-items-start tw-justify-between tw-gap-3">
                                        <div className="tw-min-w-0 tw-flex-1">
                                            <p className="tw-mb-0 tw-text-sm tw-font-medium tw-text-gray-800">
                                                {template.templateName}
                                            </p>
                                            <p className="tw-mb-1 tw-text-sm tw-text-gray-600">
                                                {template.body}
                                            </p>
                                            <p className="tw-mb-0 tw-text-xs tw-text-gray-500">
                                                DLT {template.dltContentId} ·{" "}
                                                {variableCount} variable
                                                {variableCount === 1 ? "" : "s"} ·{" "}
                                                {segmentCountOf(template.body)} segment
                                                {segmentCountOf(template.body) === 1
                                                    ? ""
                                                    : "s"}
                                                {template.senderId
                                                    ? ` · sender ${template.senderId}`
                                                    : ""}
                                                {template.visibleUserIds.length
                                                    ? ` · ${template.visibleUserIds.length} user${template.visibleUserIds.length === 1 ? "" : "s"}`
                                                    : " · everyone"}
                                            </p>
                                        </div>

                                        <div className="tw-flex tw-flex-shrink-0 tw-items-center tw-gap-2">
                                            <StatusLabel
                                                type={
                                                    template.isActive
                                                        ? "active"
                                                        : "inactive"
                                                }
                                                labelName={
                                                    template.isActive
                                                        ? "Active"
                                                        : "Inactive"
                                                }
                                            />

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

            <ModalContainerUpdated
                id="crm-settings-sms-template"
                isOpen={modalState.showModal}
                toggle={closeModal}
                modalTitle={
                    modalState.modalData
                        ? "Edit SMS Template"
                        : "Add SMS Template"
                }
                modalSize="lg"
            >
                <AddEditSmsTemplateModal
                    data={modalState.modalData}
                    accountId={accountId}
                    toggle={closeModal}
                    onSave={saveHandler}
                />
            </ModalContainerUpdated>

            <ConfirmationModal
                id="crm-settings-sms-template-delete"
                isOpen={deleteModalState.showModal}
                iconType="reject"
                confirmTitle="Delete this SMS template?"
                confirmMessage={`"${deleteModalState.modalData?.templateName}" will no longer be available to send.`}
                noteMessage="Its DLT registration on the operator portal is not affected."
                confirmBtnText="Delete Template"
                confirmHndlr={deleteHandler}
                cancelHndlr={deleteCloseModal}
            />
        </>
    );
};

export default SmsTemplates;
