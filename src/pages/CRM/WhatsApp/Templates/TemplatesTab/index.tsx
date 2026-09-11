import {
    useCallback,
    useMemo,
    useState,
    type ChangeEvent,
    type MouseEvent,
} from "react";

import {
    Button,
    ConfirmationModal,
    ModalContainerUpdated,
    OffCanvasContainer,
    TextIconInput,
} from "../../../../../Components/Common";
import TableContainer from "../../../../../Components/Common/TableContainer";
import { type IOptionsHrtl } from "../../../../../Components/Common/MenuOptions";
import { useModal } from "../../../../../hooks/modalhook";
import { default as FilterSvg } from "../../../../../assets/imagesdps/academics/FilterSvg.svg?react";

import AddEditTemplateModal from "./AddEditTemplateModal";
import TemplatePreviewOffCanvas from "./TemplatePreviewOffCanvas";
import TemplateFilterModal from "./TemplateFilterModal";
import {
    emptyTemplateFilters,
    generateTemplateColumns,
    type TemplateAdvancedFilters,
} from "./helper";
import {
    templateStatusList,
    whatsAppTemplates,
    type WhatsAppTemplate,
} from "../../helper";
import { toast } from "react-toastify";

interface TemplatesTabProps {
    onSendMessage: () => void;
    onMessageHistory: () => void;
}

interface PaginationState {
    pageNo: number;
    pageSize: number;
}

const initialPagination: PaginationState = { pageNo: 0, pageSize: 10 };

const buildOptions = (values: Array<string>) =>
    [...new Set(values.filter(Boolean))]
        .sort()
        .map(value => ({ id: value, name: value }));

const TemplatesTab = ({
    onSendMessage,
    onMessageHistory,
}: TemplatesTabProps) => {
    const [templates, setTemplates] =
        useState<Array<WhatsAppTemplate>>(whatsAppTemplates);
    const [searchString, setSearchString] = useState<string>("");
    const [activeStatus, setActiveStatus] = useState<string>("");
    const [filters, setFilters] =
        useState<TemplateAdvancedFilters>(emptyTemplateFilters);
    const [pagination, setPagination] =
        useState<PaginationState>(initialPagination);
    const [isSyncing, setIsSyncing] = useState<boolean>(false);

    const {
        openModal: addEditOpenModal,
        closeModal: addEditCloseModal,
        modalState: addEditModalState,
    } = useModal();
    const {
        openModal: previewOpenCanvas,
        closeModal: previewCloseCanvas,
        modalState: previewCanvasState,
    } = useModal();
    const {
        openModal: filterOpenModal,
        closeModal: filterCloseModal,
        modalState: filterModalState,
    } = useModal();
    const {
        openModal: deleteOpenModal,
        closeModal: deleteCloseModal,
        modalState: deleteModalState,
    } = useModal();

    const findTemplate = useCallback(
        (templateId: string | null) =>
            templates.find(item => item.id === templateId),
        [templates],
    );

    const statusCounts = useMemo(() => {
        const counts: Record<string, number> = {
            ALL: templates.length,
        };

        templateStatusList.forEach(status => {
            counts[status] = templates.filter(
                item => item.status === status,
            ).length;
        });

        return counts;
    }, [templates]);

    const paginatedTemplates = useMemo(() => {
        const start = pagination.pageNo * pagination.pageSize;

        return templates.slice(start, start + pagination.pageSize);
    }, [templates, pagination]);

    const typeOptions = useMemo(
        () => buildOptions(templates.map(item => item.templateType)),
        [templates],
    );
    const categoryOptions = useMemo(
        () => buildOptions(templates.map(item => item.category)),
        [templates],
    );
    const languageOptions = useMemo(
        () => buildOptions(templates.map(item => item.language)),
        [templates],
    );

    const activeFilterCount = useMemo(
        () =>
            Object.values(filters).filter(value => Boolean(value)).length,
        [filters],
    );

    const searchChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchString(event.target.value);
    };

    const statusChipHandler = (status: string) => {
        setActiveStatus(status);
        setFilters(prevState => ({ ...prevState, status: "" }));
    };

    const applyFiltersHandler = (appliedFilters: TemplateAdvancedFilters) => {
        setFilters(appliedFilters);
        setActiveStatus("");
        filterCloseModal();
    };

    const paginationHandler = (updatedState: PaginationState) => {
        setPagination(updatedState);
    };

    const syncHandler = () => {
        setIsSyncing(true);

        window.setTimeout(() => {
            const syncedAt = new Date().toISOString();

            setTemplates(currentList =>
                currentList.map(item =>
                    item.status === "PENDING"
                        ? { ...item, status: "APPROVED", updatedAt: syncedAt }
                        : item,
                ),
            );

            const updatedCount = templates.filter(
                item => item.status === "PENDING",
            ).length;

            setIsSyncing(false);
            toast.success(
                updatedCount
                    ? `${updatedCount} template${updatedCount === 1 ? "" : "s"} updated from the provider.`
                    : "No changes found."
            );
        }, 600);
    };

    const saveTemplateHandler = (
        template: WhatsAppTemplate,
        isEdit: boolean,
    ) => {
        setTemplates(currentList =>
            isEdit
                ? currentList.map(item =>
                    item.id === template.id ? template : item,
                )
                : [template, ...currentList],
        );

        toast.success(`Template "${template.templateName}" ${isEdit ? "updated" : "created"} successfully.`);

        if (isEdit) {
            previewCloseCanvas();
        }
    };

    const duplicateHandler = (template: WhatsAppTemplate) => {
        previewCloseCanvas();
        addEditOpenModal({
            mode: "duplicate",
            prefill: {
                ...template,
                templateName: `${template.templateName}_copy`,
                status: "DRAFT",
            },
        });
    };

    const deleteTemplateHandler = () => {
        const template = deleteModalState.modalData as WhatsAppTemplate;

        setTemplates(currentList =>
            currentList.filter(item => item.id !== template.id),
        );
        toast.success(`Template "${template.templateName}" deleted successfully.`);

        deleteCloseModal();
        previewCloseCanvas();
    };

    const menuOptions: Array<IOptionsHrtl> = useMemo(
        () => [
            {
                id: "view",
                actionIcon: <i className="ri-eye-line tw-text-gray-500"></i>,
                actionName: "View",
                onClickHndlr: (event: MouseEvent<HTMLElement>) => {
                    const template = findTemplate(
                        event.currentTarget.getAttribute("data-id"),
                    );

                    if (template) {
                        previewOpenCanvas(template);
                    }
                },
            },
            {
                id: "edit",
                actionIcon: <i className="ri-pencil-line tw-text-gray-500"></i>,
                actionName: "Edit",
                onClickHndlr: (event: MouseEvent<HTMLElement>) => {
                    const template = findTemplate(
                        event.currentTarget.getAttribute("data-id"),
                    );

                    if (template) {
                        addEditOpenModal({ mode: "edit", template });
                    }
                },
            },
            {
                id: "duplicate",
                actionIcon: (
                    <i className="ri-file-copy-line tw-text-gray-500"></i>
                ),
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
                actionIcon: (
                    <i className="ri-delete-bin-line tw-text-danger"></i>
                ),
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
        [findTemplate],
    );

    const tableColumns = useMemo(
        () => generateTemplateColumns(menuOptions),
        [menuOptions],
    );

    const statusChips = [
        { id: "", label: "All", count: statusCounts.ALL },
        ...templateStatusList.map(status => ({
            id: status,
            label: status,
            count: statusCounts[status] || 0,
        })),
    ];

    return (
        <div className="tw-card">
            <div className="tw-card-header">
                <div className="tw-flex tw-flex-wrap tw-items-center tw-justify-between tw-gap-3">
                    <div className="tw-w-full md:tw-w-96">
                        <TextIconInput
                            formgroupClassName="search-box tw-mb-0"
                            name="templateSearch"
                            labelText="Search"
                            value={searchString}
                            onChange={searchChangeHandler}
                            placeHolder="Search templates by name, body, category or status"
                            floatingLabel
                        >
                            <i className="ri-search-line search-icon"></i>
                        </TextIconInput>
                    </div>

                    <div className="tw-flex tw-flex-wrap tw-items-center tw-gap-2">
                        <Button
                            type="button"
                            variant="secondary"
                            className="!tw-h-9 !tw-w-9 !tw-p-0 tw-border tw-border-gray-200 !tw-bg-white hover:!tw-bg-gray-50"
                            title="Sync templates"
                            aria-label="Sync templates"
                            onClick={syncHandler}
                            disabled={isSyncing}
                        >
                            <i
                                className={`ri-refresh-line ${isSyncing ? "tw-animate-spin" : ""}`}
                            ></i>
                        </Button>

                        <Button
                            type="button"
                            variant="secondary"
                            className="!tw-h-9 !tw-w-9 !tw-p-0 tw-border tw-border-gray-200 !tw-bg-white hover:!tw-bg-gray-50"
                            title="Message history"
                            aria-label="Message history"
                            onClick={onMessageHistory}
                        >
                            <i className="ri-history-line"></i>
                        </Button>

                        <Button
                            type="button"
                            variant="hoverInfo"
                            onClick={onSendMessage}
                        >
                            <i className="ri-send-plane-line tw-me-1"></i>
                            Send Message
                        </Button>

                        <Button
                            type="button"
                            variant="primary"
                            onClick={() => addEditOpenModal({ mode: "create" })}
                        >
                            <i className="ri-add-fill tw-me-1"></i>
                            New Template
                        </Button>
                    </div>
                </div>
            </div>

            <div className="tw-border-b tw-border-gray-200 tw-p-3">
                <div className="tw-flex tw-flex-wrap tw-items-center tw-justify-between tw-gap-3">
                    <div className="tw-flex tw-flex-wrap tw-gap-2">
                        {statusChips.map(chip => (
                            <Button
                                type="button"
                                variant="secondary"
                                key={chip.id || "all"}
                                onClick={() => statusChipHandler(chip.id)}
                                className={`!tw-gap-1 !tw-rounded-full tw-border !tw-px-3 !tw-py-1 !tw-text-xs tw-font-medium ${(activeStatus || filters.status) === chip.id
                                    ? "tw-border-[#1bb3a6] !tw-bg-[#d1f4f1] tw-text-[#0b6d63]"
                                    : "tw-border-gray-200 !tw-bg-white tw-text-gray-600 hover:!tw-bg-gray-50"
                                    }`}
                            >
                                {chip.label}
                                <span className="tw-rounded-full tw-bg-gray-100 tw-px-1.5 tw-text-[10px] tw-text-gray-700">
                                    {chip.count}
                                </span>
                            </Button>
                        ))}
                    </div>

                    <div className="tw-flex tw-items-center tw-gap-2">
                        <Button
                            type="button"
                            variant="secondary"
                            className="tw-relative !tw-bg-[#f4f7fa] tw-border tw-border-[#ced4da]"
                            onClick={() => filterOpenModal()}
                        >
                            <FilterSvg height={"18px"} width={"18px"} />
                            <span>Filters</span>
                            {activeFilterCount > 0 && (
                                <span className="tw-absolute -tw-right-2 -tw-top-2 tw-flex tw-h-5 tw-min-w-5 tw-items-center tw-justify-center tw-rounded-full tw-bg-[#0ab39c] tw-px-1 tw-text-[10px] tw-font-semibold tw-text-white">
                                    {activeFilterCount}
                                </span>
                            )}
                        </Button>

                        {(activeFilterCount > 0 ||
                            activeStatus ||
                            searchString) && (
                                <Button
                                    type="button"
                                    variant="reject"
                                    onClick={() => {
                                        setFilters(emptyTemplateFilters);
                                        setActiveStatus("");
                                        setSearchString("");
                                    }}
                                >
                                    Reset
                                </Button>
                            )}
                    </div>
                </div>
            </div>

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
                    callbackPaginationHndlr={paginationHandler}
                />
            </div>

            <ModalContainerUpdated
                id="crm-whatsapp-template-modal"
                isOpen={addEditModalState.showModal}
                toggle={addEditCloseModal}
                modalTitle={
                    addEditModalState.modalData?.mode === "edit"
                        ? "Edit WhatsApp Template"
                        : addEditModalState.modalData?.mode === "duplicate"
                            ? "Duplicate WhatsApp Template"
                            : "Create WhatsApp Template"
                }
                modalSize="xl"
            >
                <AddEditTemplateModal
                    data={addEditModalState.modalData?.template}
                    prefill={addEditModalState.modalData?.prefill}
                    toggle={addEditCloseModal}
                    onSave={saveTemplateHandler}
                />
            </ModalContainerUpdated>

            <ModalContainerUpdated
                id="crm-whatsapp-template-filters"
                isOpen={filterModalState.showModal}
                toggle={filterCloseModal}
                modalTitle="Filter Templates"
                modalSize="lg"
            >
                <TemplateFilterModal
                    filters={filters}
                    typeOptions={typeOptions}
                    categoryOptions={categoryOptions}
                    languageOptions={languageOptions}
                    matchCount={templates.length}
                    toggle={filterCloseModal}
                    onApply={applyFiltersHandler}
                />
            </ModalContainerUpdated>

            <OffCanvasContainer
                id="crm-whatsapp-template-preview"
                isOpen={previewCanvasState.showModal}
                closeHndlr={previewCloseCanvas}
                headerTitle=""
                width={480}
                customClass="[&_.offcanvas-header]:tw-hidden"
            >
                <TemplatePreviewOffCanvas
                    template={previewCanvasState.modalData}
                    toggle={previewCloseCanvas}
                    onEdit={template =>
                        addEditOpenModal({ mode: "edit", template })
                    }
                    onDuplicate={duplicateHandler}
                    onDelete={template => deleteOpenModal(template)}
                />
            </OffCanvasContainer>

            <ConfirmationModal
                id="crm-whatsapp-template-delete"
                isOpen={deleteModalState.showModal}
                iconType="reject"
                confirmTitle="Delete template?"
                confirmMessage={`"${deleteModalState.modalData?.templateName || ""}" will be removed from this WhatsApp account.`}
                noteMessage="This action cannot be undone."
                confirmBtnText="Delete"
                cancelHndlr={deleteCloseModal}
                confirmHndlr={deleteTemplateHandler}
            />
        </div>
    );
};

export default TemplatesTab;
