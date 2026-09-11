import { useCallback, useMemo, useState, type MouseEvent } from "react";

import {
    Button,
    ConfirmationModal,
    ModalContainerUpdated,
    SelectInput,
    TextIconInput,
} from "../../../../../Components/Common";
import TableContainer from "../../../../../Components/Common/TableContainer";
import { type IOptionsHrtl } from "../../../../../Components/Common/MenuOptions";
import { useModal } from "../../../../../hooks/modalhook";
import {
    activeStatusOptions,
    type FieldChangeEvent,
} from "../../helper";
import AddEditEmailTemplateModal from "./AddEditEmailTemplateModal";
import {
    emailTemplateCategories,
    emailTemplates as sampleTemplates,
    generateEmailTemplateColumns,
    type EmailTemplate,
} from "./helper";
import { toast } from "react-toastify";

interface FilterState {
    searchString: string;
    status: string;
    category: string;
}

interface PaginationState {
    pageNo: number;
    pageSize: number;
}

const initialFilterState: FilterState = {
    searchString: "",
    status: "",
    category: "",
};

const initialPagination: PaginationState = { pageNo: 0, pageSize: 10 };

const EmailTemplates = () => {
    const [templates, setTemplates] =
        useState<Array<EmailTemplate>>(sampleTemplates);
    const [filterState, setFilterState] =
        useState<FilterState>(initialFilterState);
    const [pagination, setPagination] =
        useState<PaginationState>(initialPagination);

    const { openModal, closeModal, modalState } = useModal();
    const {
        openModal: deleteOpenModal,
        closeModal: deleteCloseModal,
        modalState: deleteModalState,
    } = useModal();

    const paginatedTemplates = useMemo(() => {
        const start = pagination.pageNo * pagination.pageSize;

        return templates.slice(start, start + pagination.pageSize);
    }, [pagination, templates]);

    const findTemplate = useCallback(
        (templateId: string | null) =>
            templates.find(template => template.id === templateId),
        [templates],
    );

    const filterChangeHandler = (event: FieldChangeEvent) => {
        const { name, value } = event.target;

        setFilterState(prevState => ({ ...prevState, [name]: value }));
    };

    const saveHandler = (template: EmailTemplate, isNew: boolean) => {
        setTemplates(current =>
            isNew
                ? [template, ...current]
                : current.map(item =>
                    item.id === template.id ? template : item,
                ),
        );
        toast.success("Email template saved");
    };

    const statusToggleHandler = (template: EmailTemplate) => {
        setTemplates(current =>
            current.map(item =>
                item.id === template.id
                    ? { ...item, isActive: !item.isActive }
                    : item,
            ),
        );
        toast.success("Template status updated");
    };

    const duplicateHandler = (template: EmailTemplate) => {
        setTemplates(current => [
            {
                ...template,
                id: `email-template-${Date.now()}`,
                templateName: `${template.templateName} copy`,
                isActive: false,
                updatedAt: new Date().toISOString(),
            },
            ...current,
        ]);
        toast.success("Template duplicated");
    };

    const deleteHandler = () => {
        const template: EmailTemplate | undefined = deleteModalState.modalData;

        if (!template) {
            return;
        }

        setTemplates(current => current.filter(item => item.id !== template.id));
        deleteCloseModal();
        toast.success("Template deleted");
    };

    const menuOptions: Array<IOptionsHrtl> = useMemo(
        () => [
            {
                id: "edit",
                actionIcon: <i className="ri-pencil-line tw-text-gray-500"></i>,
                actionName: "Edit",
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
                id: "duplicate",
                actionIcon: <i className="ri-file-copy-line tw-text-gray-500"></i>,
                actionName: "Duplicate",
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
                id: "delete",
                actionIcon: <i className="ri-delete-bin-line tw-text-danger"></i>,
                actionName: "Delete",
                onClickHndlr: (event: MouseEvent<HTMLElement>) => {
                    const template = findTemplate(
                        event.currentTarget.getAttribute("data-id"),
                    );

                    if (template) {
                        deleteOpenModal(template);
                    }
                },
            },
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [deleteOpenModal, findTemplate, openModal],
    );

    const tableColumns = useMemo(
        () => generateEmailTemplateColumns(menuOptions, statusToggleHandler),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [menuOptions, templates],
    );

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
                                value={filterState.searchString}
                                onChange={filterChangeHandler}
                                placeHolder="Search template name or subject…"
                                floatingLabel
                            >
                                <i className="ri-search-line search-icon"></i>
                            </TextIconInput>
                        </div>

                        <div className="col-6 col-md-3 col-xl-2">
                            <SelectInput
                                name="status"
                                labelText="Status"
                                defaultSelect="All statuses"
                                value={filterState.status}
                                onChange={filterChangeHandler}
                                menuItems={activeStatusOptions}
                                valueKey="id"
                                textKey="name"
                                formgroupClassName="tw-mb-0"
                                floatingLabel
                            />
                        </div>

                        <div className="col-6 col-md-3 col-xl-2">
                            <SelectInput
                                name="category"
                                labelText="Category"
                                defaultSelect="All categories"
                                value={filterState.category}
                                onChange={filterChangeHandler}
                                menuItems={emailTemplateCategories}
                                valueKey="id"
                                textKey="name"
                                formgroupClassName="tw-mb-0"
                                floatingLabel
                            />
                        </div>

                        <div className="col-12 col-xl-4">
                            <div className="tw-flex tw-flex-wrap tw-items-center tw-justify-end tw-gap-2">
                                <Button
                                    type="button"
                                    variant="primary"
                                    onClick={() => openModal()}
                                >
                                    <i className="ri-add-line tw-me-1"></i>
                                    Create Template
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="tw-card">
                <div className="tw-card-body !tw-p-0">
                    <TableContainer
                        columns={tableColumns}
                        data={paginatedTemplates}
                        tableClass="mb-0"
                        divClass="table-responsive mb-3"
                        theadClass="table-light text-muted align-middle"
                        showPagination
                        totalPages={Math.ceil(
                            templates.length / pagination.pageSize,
                        )}
                        totalRecords={templates.length}
                        currentPageNumber={pagination.pageNo}
                        pageSize={pagination.pageSize}
                        callbackPaginationHndlr={setPagination}
                    />
                </div>
            </div>

            <ModalContainerUpdated
                id="crm-settings-email-template"
                isOpen={modalState.showModal}
                toggle={closeModal}
                modalTitle={
                    modalState.modalData
                        ? "Edit Email Template"
                        : "Create Email Template"
                }
                modalSize="lg"
            >
                <AddEditEmailTemplateModal
                    data={modalState.modalData}
                    toggle={closeModal}
                    onSave={saveHandler}
                />
            </ModalContainerUpdated>

            <ConfirmationModal
                id="crm-settings-email-template-delete"
                isOpen={deleteModalState.showModal}
                iconType="reject"
                confirmTitle="Delete this email template?"
                confirmMessage={`"${deleteModalState.modalData?.templateName}" will no longer be available to send.`}
                noteMessage="Emails already sent from it are kept."
                confirmBtnText="Delete Template"
                confirmHndlr={deleteHandler}
                cancelHndlr={deleteCloseModal}
            />
        </>
    );
};

export default EmailTemplates;
