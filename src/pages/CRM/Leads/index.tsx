import {
    useCallback,
    useMemo,
    useState,
    type ChangeEvent,
    type MouseEvent,
} from "react";

import { HugeiconsIcon } from "@hugeicons/react";
import { Calendar02Icon, Clock01Icon, GlobalEditingIcon, LinkForwardIcon, Message01Icon, Notification02Icon, PencilEdit02Icon, WhatsappIcon } from "@hugeicons-pro/core-stroke-standard";
import { default as FilterSvg } from "../../../assets/imagesdps/academics/FilterSvg.svg?react";

import {
    Button,
    InputCheckbox,
    ModalContainerUpdated,
    MultiSelectCheckbox,
    OffCanvasContainer,
    SelectInput,
    Switch,
    TextIconInput,
} from "../../../Components/Common";
import UpdatedHorizontalTab from "../../../Components/Common/UpdatedHorizontalTab";
import TableContainer from "../../../Components/Common/TableContainer";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { CustomDatePicker } from "../../DashBoardBranchSummary/CustomDatePicker";
import { useModal } from "../../../hooks/modalhook";
import {
    dummyLeadsData,
    followUpOwnerOptions,
    generateColumns,
    leadTabOptions,
    leadTypeOptions,
    nextFollowUpOptions,
    sourceOptions,
    viewsList,
    type LeadRecord,
} from "./helper";
import AddNewLeadModal from "./AddNewLeadModal";
import LeadHistoryModal from "./LeadHistoryModal";
import FollowUpModal from "./FollowUpModal";
import ReferModal from "./ReferModal";
import LeadMessagesOffCanvas from "./LeadMessagesOffCanvas";
import LeadViewModal from "./LeadViewModal/index";
import LeadViewFilterModal from "./LeadViewFilterModal";

interface LeadFilterOption {
    id: string;
    name: string;
}

interface FilterState {
    searchString: string;
    branchId: string;
    leadType: LeadFilterOption[];
    status: string;
    source: LeadFilterOption[];
    startDate: string;
    endDate: string;
    nextFollowUp: string;
    followUpOwner: LeadFilterOption[];
    untouchedOnly: boolean;
    pendingFollowUpsDueToday: boolean;
}

const initialFilterState: FilterState = {
    searchString: "",
    branchId: "",
    leadType: [],
    status: "",
    source: [],
    startDate: "",
    endDate: "",
    nextFollowUp: "all",
    followUpOwner: [],
    untouchedOnly: false,
    pendingFollowUpsDueToday: false,
};

const todayDate = "2026-08-12";

const getOwnerFilterId = (owner: string) =>
    owner.toLowerCase() === "unassigned"
        ? "unassigned"
        : owner.toLowerCase().includes("srikanth")
            ? "srikanth"
            : owner.toLowerCase().includes("taufeeq")
                ? "taufeeq"
                : owner.toLowerCase();

const isLeadInFollowUpFilter = (
    lead: LeadRecord,
    nextFollowUp: string,
) => {
    if (nextFollowUp === "all") {
        return true;
    }

    return (
        lead.nextFollowUpStatus
            .toLowerCase()
            ?.replace(/ /g, "-") === nextFollowUp
    );
};

const isPendingFollowUpDueThroughToday = (lead: LeadRecord) =>
    !!lead.nextFollowUpValue &&
    lead.nextFollowUpValue <= todayDate &&
    lead.status !== "Admitted" &&
    lead.status !== "Closed";

const getLeadStageTabId = (stage: string) =>
    stage.trim().toLowerCase().replace(/ /g, "-");

const isLeadMatchingSearch = (
    lead: LeadRecord,
    searchString: string,
) => {
    const searchText = searchString.trim().toLowerCase();

    if (!searchText) {
        return true;
    }

    return [
        lead.studentName,
        lead.phone,
        lead.className,
        lead.branchName,
        lead.leadType,
        lead.source,
        lead.stage,
        lead.status,
        lead.owner,
        lead.followUpOwner,
    ].some(value =>
        value?.toLowerCase().includes(searchText),
    );
};

const renderFilterMultiSelectValue = (
    selectedItems: LeadFilterOption[],
    removeItemHandler: (event: React.MouseEvent<HTMLElement>) => void,
) => (
    <div className="tw-flex tw-flex-wrap tw-gap-1">
        {selectedItems.map(item => (
            <span
                key={item.id}
                className="badge badge-soft-primary tw-flex tw-items-center tw-gap-1"
            >
                {item.name}
                <i
                    data-id={item.id}
                    className="ri-close-line tw-cursor-pointer"
                    onClick={removeItemHandler}
                ></i>
            </span>
        ))}
    </div>
);

const renderFilterMultiSelectOption = (
    item: LeadFilterOption,
) => (
    <span>{item.name}</span>
);

const isOptionSelected = (
    selectedOptions: LeadFilterOption[],
    value: string,
) =>
    selectedOptions.length === 0 ||
    selectedOptions.some(item => item.id === value);

const CRMLeads = () => {
    const whatsappCount = 12;
    const notificationCount = 5;
    const [activeTabId, setActiveTabId] =
        useState<string>("all");
    const [selectedViewId, setSelectedViewId] =
        useState<string>("");
    const [filterState, setFilterState] =
        useState<FilterState>(initialFilterState);
    const {
        openModal: addNewLeadOpenModal,
        closeModal: addNewLeadCloseModal,
        modalState: addNewLeadModalState,
    } = useModal();
    const {
        setModalState: setLeadHistoryModalState,
        closeModal: leadHistoryCloseModal,
        modalState: leadHistoryModalState,
    } = useModal();
    const {
        openModal: followUpOpenModal,
        closeModal: followUpCloseModal,
        modalState: followUpModalState,
    } = useModal();
    const {
        openModal: referOpenModal,
        closeModal: referCloseModal,
        modalState: referModalState,
    } = useModal();
    const {
        openModal: messageOpenCanvas,
        closeModal: messageCloseCanvas,
        modalState: messageCanvasState,
    } = useModal();
    const {
        openModal: leadViewOpenModal,
        closeModal: leadViewCloseModal,
        modalState: leadViewModalState,
    } = useModal();
    const {
        openModal: filtersOpenModal,
        closeModal: filtersCloseModal,
        modalState: filtersModalState,
    } = useModal();

    const menuOptions = useMemo(
        () => [
            {
                id: "edit",
                actionIcon: (
                    <HugeiconsIcon
                        icon={PencilEdit02Icon}
                        className="text-muted"
                        size={18}
                    />
                ),
                actionName: "Edit",
                onClickHndlr: (
                    event: MouseEvent<HTMLElement>,
                ) => {
                    const id =
                        event.currentTarget.getAttribute("data-id");
                    addNewLeadOpenModal(id)
                },
            },
            {
                id: "message",
                actionIcon: (
                    <HugeiconsIcon
                        icon={Message01Icon}
                        className="text-muted"
                        size={18}
                    />
                ),
                actionName: "Message",
                onClickHndlr: (
                    event: MouseEvent<HTMLElement>,
                ) => {
                    const id =
                        event.currentTarget.getAttribute("data-id");

                    const selectedLead =
                        dummyLeadsData.find(
                            item => item.id === id,
                        );

                    if (selectedLead) {
                        messageOpenCanvas(selectedLead);
                    }
                },
            },
            {
                id: "follow-up",
                actionIcon: (
                    <HugeiconsIcon
                        icon={Calendar02Icon}
                        className="text-muted"
                        size={18}
                    />
                ),
                actionName: "Follow Up",
                onClickHndlr: (
                    event: MouseEvent<HTMLElement>,
                ) => {
                    const id =
                        event.currentTarget.getAttribute("data-id");

                    const selectedLead =
                        dummyLeadsData.find(
                            item => item.id === id,
                        );

                    if (selectedLead) {
                        followUpOpenModal(selectedLead);
                    }
                },
            },
            {
                id: "refer",
                actionIcon: (
                    <HugeiconsIcon
                        icon={LinkForwardIcon}
                        className="text-muted"
                        size={18}
                    />
                ),
                actionName: "Refer",
                onClickHndlr: (
                    event: MouseEvent<HTMLElement>,
                ) => {
                    const id =
                        event.currentTarget.getAttribute("data-id");

                    const selectedLead =
                        dummyLeadsData.find(
                            item => item.id === id,
                        );

                    if (selectedLead) {
                        referOpenModal(selectedLead);
                    }
                },
            },
            {
                id: "lead-history",
                actionIcon: (
                    <HugeiconsIcon
                        icon={Clock01Icon}
                        className="text-muted"
                        size={18}
                    />
                ),
                actionName: "Lead History",
                onClickHndlr: (
                    event: MouseEvent<HTMLElement>,
                ) => {
                    const id =
                        event.currentTarget.getAttribute("data-id");

                    const selectedLead =
                        dummyLeadsData.find(
                            item => item.id === id,
                        );

                    if (selectedLead) {
                        setLeadHistoryModalState({
                            showModal: true,
                            modalData: selectedLead,
                        });
                    }
                },
            },
        ],
        [
            addNewLeadOpenModal,
            followUpOpenModal,
            messageOpenCanvas,
            referOpenModal,
            setLeadHistoryModalState,
        ],
    );

    const tableColumns = useMemo(
        () => generateColumns(menuOptions),
        [menuOptions],
    );

    const tabOptionsWithCount = useMemo(
        () =>
            leadTabOptions.map(item => ({
                ...item,
                count: item.count ?? (
                    item.id === "all"
                        ? dummyLeadsData.length
                        : dummyLeadsData.filter(
                            lead =>
                                lead.bucket === item.id ||
                                getLeadStageTabId(lead.stage) === item.id,
                        ).length
                ),
            })),
        [],
    );

    const filterLeads = useCallback(
        (
            leadList: LeadRecord[],
            includePendingDueFilter: boolean,
        ) => {
            return leadList.filter(lead => {
                const matchesTab =
                    activeTabId === "all" ||
                    (activeTabId === "pending-followups" &&
                        isPendingFollowUpDueThroughToday(lead)) ||
                    lead.bucket === activeTabId ||
                    getLeadStageTabId(lead.stage) === activeTabId;
                const matchesSearch = isLeadMatchingSearch(
                    lead,
                    filterState.searchString,
                );
                const matchesBranch =
                    !filterState.branchId ||
                    lead.branchId === filterState.branchId;
                const matchesLeadType =
                    isOptionSelected(
                        filterState.leadType,
                        lead.leadType,
                    );
                const matchesStatus =
                    !filterState.status ||
                    lead.status === filterState.status;
                const matchesUntouched =
                    !filterState.untouchedOnly ||
                    lead.status === "Untouched";
                const matchesSource =
                    isOptionSelected(
                        filterState.source,
                        lead.source,
                    );
                const matchesStartDate =
                    !filterState.startDate ||
                    lead.sourceDateValue >= filterState.startDate;
                const matchesEndDate =
                    !filterState.endDate ||
                    lead.sourceDateValue <= filterState.endDate;
                const matchesNextFollowUp =
                    isLeadInFollowUpFilter(
                        lead,
                        filterState.nextFollowUp,
                    );
                const matchesFollowUpOwner =
                    isOptionSelected(
                        filterState.followUpOwner,
                        getOwnerFilterId(lead.followUpOwner),
                    );
                const matchesPendingDue =
                    !includePendingDueFilter ||
                    !filterState.pendingFollowUpsDueToday ||
                    isPendingFollowUpDueThroughToday(lead);

                return (
                    matchesTab &&
                    matchesSearch &&
                    matchesBranch &&
                    matchesLeadType &&
                    matchesStatus &&
                    matchesUntouched &&
                    matchesSource &&
                    matchesStartDate &&
                    matchesEndDate &&
                    matchesNextFollowUp &&
                    matchesFollowUpOwner &&
                    matchesPendingDue
                );
            });
        },
        [activeTabId, filterState],
    );

    const pendingFollowUpsDueCount = useMemo(() => {
        return filterLeads(dummyLeadsData, false).filter(
            isPendingFollowUpDueThroughToday,
        ).length;
    }, [filterLeads]);

    const untouchedLeadCount = useMemo(() => {
        return filterLeads(dummyLeadsData, false).filter(
            lead => lead.status === "Untouched",
        ).length;
    }, [filterLeads]);

    const filteredLeads = useMemo(() => {
        return filterLeads(dummyLeadsData, true);
    }, [filterLeads]);

    const filterChangeHandler = (
        event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        const { name, value, type } = event.target;
        const checked =
            (event.target as HTMLInputElement).checked;

        setFilterState(prevState => ({
            ...prevState,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const multiSelectFilterChangeHandler = (
        selectedOptions: LeadFilterOption[],
        meta: { name: keyof FilterState },
    ) => {
        setFilterState(prevState => ({
            ...prevState,
            [meta.name]: selectedOptions,
        }));
    };

    const dateRangeChangeHandler = (dates: {
        startDate: string;
        endDate: string;
    }) => {
        setFilterState(prevState => ({
            ...prevState,
            startDate: dates.startDate,
            endDate: dates.endDate,
        }));
    };

    const tabClickHandler = (
        event: MouseEvent<HTMLElement>,
    ) => {
        const tabId =
            event.currentTarget.getAttribute("data-id");

        if (tabId) {
            setActiveTabId(tabId);
        }
    };

    const resetFilterHandler = () => {
        setFilterState(initialFilterState);
        setActiveTabId("all");
    };

    const applyViewFilterHandler = (viewId: string) => {
        setSelectedViewId(viewId);
        filtersCloseModal();
    };

    return (
        <div className="page-content">
            <div className="container-fluid">
                <BreadCrumb pageTitle="CRM" />

                <div className="tw-card">
                    <div className="tw-card-header">
                        <div className="tw-flex tw-flex-wrap tw-items-center tw-justify-between tw-gap-3">
                            <div className="tw-flex tw-w-full tw-flex-wrap tw-items-center tw-gap-3 lg:tw-w-auto">
                                <div className="tw-w-full md:tw-w-96">
                                    <TextIconInput
                                        formgroupClassName="search-box tw-mb-0"
                                        name="searchString"
                                        value={filterState.searchString}
                                        onChange={filterChangeHandler}
                                        placeHolder="Search name, mobile, email.     Ctrl + Shift + F"
                                    >
                                        <i className="ri-search-line search-icon"></i>
                                    </TextIconInput>
                                </div>
                            </div>

                            <div className="tw-flex tw-gap-3">
                                <div className="tw-flex tw-gap-4 tw-items-center">
                                    <Switch
                                        attributeId="pendingFollowUpsDueToday"
                                        className="tw-mb-0"
                                        checked={filterState.pendingFollowUpsDueToday}
                                        onChangeHndlr={filterChangeHandler}
                                        labelName={`Pending followups (${pendingFollowUpsDueCount})`}
                                        labelClass="form-check-label tw-cursor-pointer tw-text-sm tw-font-medium tw-text-gray-800"
                                    />
                                    <div
                                        title={`Untouched (${untouchedLeadCount})`}
                                        className="tw-relative tw-flex tw-h-9 tw-items-center tw-rounded tw-border tw-border-gray-200 tw-bg-white tw-px-2 hover:tw-bg-gray-50"
                                    >
                                        <InputCheckbox
                                            name="untouchedOnly"
                                            formgroupClassName="tw-mb-0"
                                            value={filterState.untouchedOnly}
                                            onChange={filterChangeHandler}
                                        />
                                        <span className="tw-absolute -tw-right-2 -tw-top-2 tw-flex tw-h-5 tw-min-w-5 tw-items-center tw-justify-center tw-rounded-full tw-bg-[#c33d35] tw-px-1 tw-text-[10px] tw-font-semibold tw-leading-none tw-text-white">
                                            {untouchedLeadCount}
                                        </span>
                                    </div>
                                </div>

                                <div className="tw-flex tw-items-center tw-gap-2 tw-me-2">
                                    <Button
                                        type="button"
                                        title="Lead Actions"
                                        aria-label="Lead Actions"
                                        variant="secondary"
                                        className="!tw-h-8 !tw-w-8 !tw-p-0 tw-border tw-border-gray-200 !tw-bg-white hover:!tw-bg-gray-50"
                                    >
                                        <HugeiconsIcon
                                            icon={GlobalEditingIcon}
                                            className="text-muted"
                                            size={28}
                                        />
                                    </Button>
                                    <Button
                                        type="button"
                                        title={`Whatsapp (${whatsappCount})`}
                                        aria-label={`Whatsapp (${whatsappCount})`}
                                        variant="secondary"
                                        className="!tw-h-8 !tw-w-8 !tw-p-0 tw-border tw-border-gray-200 !tw-bg-white hover:!tw-bg-gray-50 tw-relative"
                                    >
                                        <HugeiconsIcon
                                            icon={WhatsappIcon}
                                            className="text-success"
                                            size={28}
                                        />
                                        <span className="tw-absolute -tw-right-2 -tw-top-2 tw-flex tw-h-5 tw-min-w-4 tw-items-center tw-justify-center tw-rounded-full tw-bg-success tw-px-1 tw-text-[10px] tw-font-semibold tw-leading-none tw-text-white tw-bg-[#034932]">
                                            {whatsappCount}
                                        </span>
                                    </Button>
                                    <Button
                                        type="button"
                                        title={`Notifications (${notificationCount})`}
                                        aria-label={`Notifications (${notificationCount})`}
                                        variant="secondary"
                                        className="!tw-h-8 !tw-w-8 !tw-p-0 tw-border tw-border-gray-200 !tw-bg-white hover:!tw-bg-gray-50 tw-relative"
                                    >
                                        <HugeiconsIcon
                                            icon={Notification02Icon}
                                            className="text-muted"
                                            size={28}
                                        />
                                        <span className="tw-absolute -tw-right-2 -tw-top-2 tw-flex tw-h-5 tw-min-w-5 tw-items-center tw-justify-center tw-rounded-full tw-bg-danger tw-px-1 tw-text-[10px] tw-font-semibold tw-leading-none tw-text-white tw-bg-[#c33d35]">
                                            {notificationCount}
                                        </span>
                                    </Button>
                                </div>

                                <div className="tw-flex tw-gap-2">
                                    <Button
                                        type="button"
                                        variant="hoverInfo"
                                        onClick={() => leadViewOpenModal()}
                                    >
                                        <i className="ri-add-fill"></i>
                                        Add View
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="primary"
                                        onClick={() => addNewLeadOpenModal()}
                                    >
                                        <i className="ri-add-fill"></i>
                                        Add Lead
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="reject"
                                        onClick={resetFilterHandler}
                                    >
                                        Reset
                                    </Button>
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className="tw-border-b tw-border-gray-200 tw-p-3">
                        <div className="row tw-items-ends tw-gap-y-3">
                            <div className="col-12 col-md-6 col-xl-2">
                                <MultiSelectCheckbox
                                    name="followUpOwner"
                                    idKey="id"
                                    labelText="Follow Up Owner"
                                    value={filterState.followUpOwner}
                                    renderValue={renderFilterMultiSelectValue}
                                    renderOptions={renderFilterMultiSelectOption}
                                    onChange={multiSelectFilterChangeHandler}
                                    searchKey="name"
                                    options={followUpOwnerOptions}
                                    containerClassName="tw-mb-0"
                                    floatingLabel
                                />
                            </div>

                            <div className="col-12 col-md-6 col-xl-2">
                                <MultiSelectCheckbox
                                    name="leadType"
                                    idKey="id"
                                    labelText="Lead Type"
                                    value={filterState.leadType}
                                    renderValue={renderFilterMultiSelectValue}
                                    renderOptions={renderFilterMultiSelectOption}
                                    onChange={multiSelectFilterChangeHandler}
                                    searchKey="name"
                                    options={leadTypeOptions}
                                    containerClassName="tw-mb-0"
                                    floatingLabel
                                />
                            </div>

                            <div className="col-12 col-md-6 col-xl-2">
                                <MultiSelectCheckbox
                                    name="source"
                                    idKey="id"
                                    labelText="Source"
                                    value={filterState.source}
                                    renderValue={renderFilterMultiSelectValue}
                                    renderOptions={renderFilterMultiSelectOption}
                                    onChange={multiSelectFilterChangeHandler}
                                    searchKey="name"
                                    options={sourceOptions}
                                    containerClassName="tw-mb-0"
                                    floatingLabel
                                />
                            </div>

                            <div className="col-12 col-md-6 col-xl-2">
                                <SelectInput
                                    name="nextFollowUp"
                                    labelText="Date filter type"
                                    value={filterState.nextFollowUp}
                                    onChange={filterChangeHandler}
                                    menuItems={nextFollowUpOptions}
                                    valueKey="id"
                                    textKey="name"
                                    hideSelectOption
                                    formgroupClassName="tw-mb-0"
                                    floatingLabel
                                />
                            </div>

                            <div className="col-12 col-md-6 col-xl-2">
                                <CustomDatePicker
                                    name="dateRange"
                                    labelText="Date Range"
                                    startDate={filterState.startDate}
                                    endDate={filterState.endDate}
                                    onChange={dateRangeChangeHandler}
                                    placeholder="Select date range"
                                    monthsShown={2}
                                    formgroupClassName="tw-mb-0"
                                    portalId="crm-leads-date-filter"
                                    floatingLabel
                                />
                            </div>

                            <div className="col-1">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    className="!tw-bg-[#f4f7fa] tw-border tw-border-[#ced4da]"
                                    onClick={() => filtersOpenModal()}
                                >
                                    <FilterSvg height={"18px"} width={"18px"} />
                                    <span>Filters</span>
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="tw-card-body !tw-p-0">
                        <div className="tw-mt-3">
                            <UpdatedHorizontalTab
                                MenuOptions={tabOptionsWithCount}
                                clickMenuHandler={tabClickHandler}
                                activeTabId={activeTabId}
                                showBadge
                                horizontalClass="use-small-font"
                            />
                        </div>
                        <TableContainer
                            columns={tableColumns || []}
                            data={filteredLeads || []}
                            tableClass="mb-0"
                            divClass="table-responsive mb-3"
                            theadClass="table-light text-muted align-middle"
                            showCheckbox={true}
                            showPagination={true}
                            totalPages={0}
                            totalRecords={filteredLeads.length}
                            callbackPaginationHndlr={() => { }}
                            currentPageNumber={0}
                        />
                    </div>
                </div>

                <OffCanvasContainer
                    id="crm-lead-message-offcanvas"
                    isOpen={messageCanvasState.showModal}
                    closeHndlr={messageCloseCanvas}
                    headerTitle=""
                    width={520}
                    customClass="[&_.offcanvas-header]:tw-hidden"
                >
                    <LeadMessagesOffCanvas
                        data={messageCanvasState.modalData}
                        toggle={messageCloseCanvas}
                    />
                </OffCanvasContainer>

                <ModalContainerUpdated
                    id="crm-lead-filters-modal"
                    isOpen={filtersModalState.showModal}
                    toggle={filtersCloseModal}
                    modalTitle="Select Views"
                    modalSize="lg"
                >
                    <LeadViewFilterModal
                        selectedViewId={selectedViewId}
                        viewsList={viewsList}
                        onApply={applyViewFilterHandler}
                        toggle={filtersCloseModal}
                    />
                </ModalContainerUpdated>

                <ModalContainerUpdated
                    id="add-new-lead-modal"
                    isOpen={addNewLeadModalState.showModal}
                    toggle={addNewLeadCloseModal}
                    modalTitle={
                        addNewLeadModalState.modalData ? "Edit Lead" : "Add Lead"
                    }
                    modalSize="xl"
                >
                    <AddNewLeadModal
                        toggle={addNewLeadCloseModal}
                    />
                </ModalContainerUpdated>

                <ModalContainerUpdated
                    id="follow-up-modal"
                    isOpen={followUpModalState.showModal}
                    toggle={followUpCloseModal}
                    modalTitle="Follow-up and notes"
                    modalSize="lg"
                >

                    <FollowUpModal
                        data={followUpModalState.modalData}
                        toggle={followUpCloseModal}
                    />

                </ModalContainerUpdated>

                <ModalContainerUpdated
                    id="refer-modal"
                    isOpen={referModalState.showModal}
                    toggle={referCloseModal}
                    modalTitle="Refer Lead"
                    modalSize="md"
                >

                    <ReferModal
                        data={referModalState.modalData}
                        toggle={referCloseModal}
                    />

                </ModalContainerUpdated>

                <ModalContainerUpdated
                    id="lead-view-modal"
                    isOpen={leadViewModalState.showModal}
                    toggle={leadViewCloseModal}
                    modalTitle="Create View"
                    modalSize="xl"
                    headerClassName="tw-hidden"
                >
                    <LeadViewModal
                        toggle={leadViewCloseModal}
                    />
                </ModalContainerUpdated>

                <ModalContainerUpdated
                    id="lead-history-modal"
                    isOpen={leadHistoryModalState.showModal}
                    toggle={leadHistoryCloseModal}
                    modalTitle="Lead history"
                    modalSize="xl"
                >

                    <LeadHistoryModal
                        data={
                            leadHistoryModalState.modalData
                        }
                        toggle={leadHistoryCloseModal}
                    />

                </ModalContainerUpdated>
            </div>
        </div>
    );
};

export default CRMLeads;
