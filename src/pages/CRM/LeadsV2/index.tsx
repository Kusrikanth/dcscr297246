import {
    useCallback,
    useMemo,
    useState,
    type ChangeEvent,
    type MouseEvent,
} from "react";
import {
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    UncontrolledDropdown,
} from "reactstrap";
import { toast } from "react-toastify";

import { HugeiconsIcon } from "@hugeicons/react";
import {
    Bookmark01Icon,
    Download01Icon,
    GitMergeIcon,
    GlobalEditingIcon,
    LinkForwardIcon,
    Mail01Icon,
    Megaphone01Icon,
    Message01Icon,
    Notification02Icon,
    Upload01Icon,
    WhatsappIcon,
} from "@hugeicons-pro/core-stroke-standard";
import { default as FilterSvg } from "../../../assets/imagesdps/academics/FilterSvg.svg?react";

import {
    Button,
    ConfirmationModal,
    InputCheckbox,
    ModalContainerUpdated,
    MultiSelectCheckbox,
    OffCanvasContainer,
    SelectInput,
    TextIconInput,
} from "../../../Components/Common";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import TableContainer from "../../../Components/Common/TableContainer";
import UpdatedHorizontalTab from "../../../Components/Common/UpdatedHorizontalTab";
import { CustomDatePicker } from "../../DashBoardBranchSummary/CustomDatePicker";
import { useModal } from "../../../hooks/modalhook";

import AddEditLeadModal, {
    type LeadFormValues,
    type LeadModalMode,
} from "./AddEditLeadModal";
import AppliedFiltersPanel from "./AppliedFiltersPanel";
import BulkMessageModal, {
    type BulkMessageChannel,
} from "./BulkMessageModal";
import BulkUploadModal from "./BulkUploadModal";
import DownloadFieldsModal from "./DownloadFieldsModal";
import FilterWorkspace from "./FilterWorkspace";
import FollowUpModal, {
    type FollowUpPayload,
} from "./FollowUpModal";
import LeadMessagesOffCanvas from "./LeadMessagesOffCanvas";
import ReferModal, { type ReferTarget } from "./ReferModal";
import SavedViewsModal from "./SavedViewsModal";
import StageChangeModal, {
    type StageChangeTarget,
} from "./StageChangeModal";

import {
    currentUser,
    dummyLeads,
    dummySavedViews,
    leadMeta,
    paymentStatusOptions,
    studentIdStatusOptions,
    touchStatusOptions,
} from "./data";
import {
    buildAppliedFilterGroups,
    buildLeadExportGroups,
    buildStageTabs,
    DATE_TYPE_FILTER_FIELDS,
    dateTypeOptions,
    displayNameOf,
    emptyAdvancedFilters,
    employeeName,
    generateColumns,
    isPendingFollowupTillToday,
    RE_ENQUIRED_TAB_ID,
    scopeMetaToPipeline,
    withDateRange,
    type LeadRowHandlers,
} from "./helper";
import type {
    AdvancedFilters,
    DateFilterType,
    LeadRecord,
    Option,
    SavedView,
} from "./types";
import { useHistory } from "react-router-dom";

const nowIso = () => new Date().toISOString();

const renderFilterValue = (
    selectedItems: Option[],
    removeItemHandler: (
        event: MouseEvent<HTMLElement>,
    ) => void,
) => (
    <div className="tw-flex tw-flex-nowrap tw-gap-1 tw-overflow-hidden">
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

const renderFilterOption = (item: Option) => (
    <span>{item.name}</span>
);

const asOptions = (
    list: Array<{
        id: string;
        displayName?: string;
        name?: string;
    }>,
): Option[] =>
    list.map(item => ({
        id: String(item.id),
        name: item.displayName || item.name || "",
    }));

const CRMLeadsV2 = () => {
    const [leads, setLeads] =
        useState<LeadRecord[]>(dummyLeads);
    const [savedViews, setSavedViews] = useState<SavedView[]>(
        dummySavedViews,
    );
    const [selectedViewId, setSelectedViewId] =
        useState<string>("");

    const [searchString, setSearchString] =
        useState<string>("");
    const [activeTabId, setActiveTabId] =
        useState<string>("all");
    const [pipelineId, setPipelineId] = useState<string>(
        leadMeta.pipelines.find(item => item.isDefault)?.id ||
        leadMeta.pipelines[0]?.id ||
        "",
    );
    const [parkedOnly, setParkedOnly] =
        useState<boolean>(false);
    const [filters, setFilters] = useState<AdvancedFilters>(
        emptyAdvancedFilters,
    );
    const [dateFilterType, setDateFilterType] =
        useState<DateFilterType>("nextFollowup");
    const [appliedFiltersExpanded, setAppliedFiltersExpanded] =
        useState<boolean>(false);
    const history = useHistory()

    const [pagination, setPagination] = useState({
        pageNo: 0,
        pageSize: 10,
    });
    const [selectedLeads, setSelectedLeads] = useState<
        LeadRecord[]
    >([]);

    const [workspaceMode, setWorkspaceMode] = useState<
        "filter" | "funnel"
    >("filter");
    const [bulkChannel, setBulkChannel] =
        useState<BulkMessageChannel>("whatsapp");
    const [leadModalMode, setLeadModalMode] =
        useState<LeadModalMode>("create");
    const [leadInitialTab, setLeadInitialTab] =
        useState<string>("student");

    const {
        openModal: openLeadModal,
        closeModal: closeLeadModal,
        modalState: leadModalState,
        setModalState: setLeadModalState,
    } = useModal();
    const {
        openModal: openFollowUpModal,
        closeModal: closeFollowUpModal,
        modalState: followUpModalState,
    } = useModal();
    const {
        openModal: openReferModal,
        closeModal: closeReferModal,
        modalState: referModalState,
    } = useModal();
    const {
        openModal: openStageModal,
        closeModal: closeStageModal,
        modalState: stageModalState,
    } = useModal();
    const {
        openModal: openBulkStageConfirm,
        closeModal: closeBulkStageConfirm,
        modalState: bulkStageConfirmState,
    } = useModal();
    const {
        openModal: openMessagesCanvas,
        closeModal: closeMessagesCanvas,
        modalState: messagesCanvasState,
    } = useModal();
    const {
        openModal: openWorkspaceModal,
        closeModal: closeWorkspaceModal,
        modalState: workspaceModalState,
    } = useModal();
    const {
        openModal: openSavedViewsModal,
        closeModal: closeSavedViewsModal,
        modalState: savedViewsModalState,
    } = useModal();
    const {
        openModal: openDownloadModal,
        closeModal: closeDownloadModal,
        modalState: downloadModalState,
    } = useModal();
    const {
        openModal: openBulkUploadModal,
        closeModal: closeBulkUploadModal,
        modalState: bulkUploadModalState,
    } = useModal();
    const {
        openModal: openBulkMessageModal,
        closeModal: closeBulkMessageModal,
        modalState: bulkMessageModalState,
    } = useModal();
    const {
        openModal: openRemoveConfirm,
        closeModal: closeRemoveConfirm,
        modalState: removeConfirmState,
    } = useModal();

    const scopedMeta = useMemo(
        () => scopeMetaToPipeline(leadMeta, pipelineId),
        [pipelineId],
    );

    const pendingFollowupCount = useMemo(
        () => leads.filter(isPendingFollowupTillToday).length,
        [leads],
    );

    const untouchedCount = useMemo(
        () =>
            leads.filter(
                lead => lead.touchStatus === "untouched",
            ).length,
        [leads],
    );

    const parkedCount = useMemo(
        () => leads.filter(lead => Boolean(lead.parkedAt)).length,
        [leads],
    );

    const stageTabs = useMemo(
        () => buildStageTabs(leads, filters.stage, scopedMeta),
        [leads, filters.stage, scopedMeta],
    );

    const paginatedLeads = useMemo(() => {
        const start = pagination.pageNo * pagination.pageSize;

        return leads.slice(
            start,
            start + pagination.pageSize,
        );
    }, [leads, pagination]);

    const appliedFilterGroups = useMemo(
        () =>
            buildAppliedFilterGroups(
                scopedMeta,
                searchString,
                filters,
            ),
        [scopedMeta, searchString, filters],
    );

    const exportGroups = useMemo(
        () => buildLeadExportGroups(scopedMeta),
        [scopedMeta],
    );

    const [dateFromKey, dateToKey] =
        DATE_TYPE_FILTER_FIELDS[dateFilterType];

    const resetPage = () =>
        setPagination(current => ({ ...current, pageNo: 0 }));

    const searchChangeHandler = (
        event: ChangeEvent<HTMLInputElement>,
    ) => {
        setSearchString(event.target.value);
        resetPage();
    };

    const multiFilterChangeHandler = (
        selectedOptions: Option[],
        config: { name: keyof AdvancedFilters },
    ) => {
        setFilters(current => ({
            ...current,
            [config.name]: selectedOptions.map(item =>
                String(item.id),
            ),
            ...(config.name === "branchId"
                ? { ownerEmployeeId: [] }
                : {}),
        }));
        resetPage();
    };

    const pipelineChangeHandler = (
        event: ChangeEvent<HTMLSelectElement>,
    ) => {
        setPipelineId(event.target.value);
        setActiveTabId("all");
        setFilters(current => ({
            ...current,
            stage: [],
            substageId: [],
        }));
        resetPage();
    };

    const parkedToggleHandler = () => {
        setParkedOnly(current => !current);
    };

    const dateTypeChangeHandler = (
        event: ChangeEvent<HTMLSelectElement>,
    ) => {
        const nextType = event.target.value as DateFilterType;

        if (nextType === dateFilterType) {
            return;
        }

        setFilters(current => {
            const carriedFrom = current[dateFromKey] as string;
            const carriedTo = current[dateToKey] as string;
            const cleared = withDateRange(
                current,
                dateFilterType,
                "",
                "",
            );

            return withDateRange(
                cleared,
                nextType,
                carriedFrom,
                carriedTo,
            );
        });

        setDateFilterType(nextType);
        resetPage();
    };

    const dateRangeChangeHandler = (dates: {
        startDate: string;
        endDate: string;
    }) => {
        setFilters(current =>
            withDateRange(
                current,
                dateFilterType,
                dates.startDate,
                dates.endDate,
            ),
        );
        resetPage();
    };

    const pendingFollowupToggleHandler = (
        event: ChangeEvent<HTMLInputElement>,
    ) => {
        setFilters(current => ({
            ...current,
            pendingFollowupsOnly: event.target.checked,
        }));
        resetPage();
    };

    const untouchedToggleHandler = (
        event: ChangeEvent<HTMLInputElement>,
    ) => {
        setFilters(current => ({
            ...current,
            touchStatus: event.target.checked
                ? ["untouched"]
                : [],
        }));
        resetPage();
    };

    const tabClickHandler = (
        event: MouseEvent<HTMLElement>,
    ) => {
        const tabId =
            event.currentTarget.getAttribute("data-id");

        if (tabId) {
            setActiveTabId(tabId);
            setAppliedFiltersExpanded(false);
            resetPage();
        }
    };

    const resetFilterHandler = () => {
        setSearchString("");
        setActiveTabId("all");
        setFilters(emptyAdvancedFilters);
        setDateFilterType("nextFollowup");
        setSelectedViewId("");
        resetPage();
        toast.success(
            "Filters cleared — showing all accessible branches",
        );
    };

    const applyFiltersHandler = (
        nextFilters: AdvancedFilters,
    ) => {
        setFilters(nextFilters);

        if (
            nextFilters.stage.length &&
            activeTabId !== "all" &&
            activeTabId !== RE_ENQUIRED_TAB_ID &&
            !nextFilters.stage.includes(activeTabId)
        ) {
            setActiveTabId("all");
        }

        setAppliedFiltersExpanded(true);
        closeWorkspaceModal();
        resetPage();
        toast.success("Lead filters applied");
    };

    const saveViewHandler = (
        name: string,
        type: "filter" | "funnel",
        nextFilters: AdvancedFilters,
    ) => {
        setSavedViews(current => [
            ...current,
            {
                id: `view-${current.length + 1}-${Date.now()}`,
                name,
                type,
                filters: nextFilters,
            },
        ]);

        toast.success(
            `${type === "funnel" ? "View" : "Filter"} "${name}" saved`,
        );
    };

    const applySavedViewHandler = (viewId: string) => {
        const view = savedViews.find(
            item => item.id === viewId,
        );

        if (!view) {
            return;
        }

        setSelectedViewId(viewId);
        setFilters(view.filters);
        setActiveTabId("all");
        setAppliedFiltersExpanded(true);
        closeSavedViewsModal();
        resetPage();
        toast.success(`View "${view.name}" applied`);
    };

    const deleteSavedViewHandler = (viewId: string) => {
        setSavedViews(current =>
            current.filter(item => item.id !== viewId),
        );

        if (selectedViewId === viewId) {
            setSelectedViewId("");
        }

        toast.success("View deleted");
    };

    const openCreateHandler = () => {
        setLeadModalMode("create");
        setLeadInitialTab("student");
        openLeadModal(undefined);
    };

    const openLeadHandler = (
        lead: LeadRecord,
        mode: LeadModalMode,
        tab: string = "student",
    ) => {
        setLeadModalMode(mode);
        setLeadInitialTab(tab);
        openLeadModal(lead);
    };

    const saveLeadHandler = (
        values: LeadFormValues,
        mode: LeadModalMode,
    ) => {
        const branchName =
            displayNameOf(leadMeta.branches, values.branchId) ||
            "";

        if (mode === "create") {
            const nextId = String(
                Math.max(
                    0,
                    ...leads.map(lead => Number(lead.id) || 0),
                ) + 1,
            );

            const newLead: LeadRecord = {
                id: nextId,
                leadId: `ADM-2026-${String(
                    637 + Number(nextId),
                ).padStart(6, "0")}`,
                studentId: values.studentId.trim(),
                studentName: values.studentName.trim(),
                phone: values.phone.trim(),
                alternatePhone: values.alternatePhone.trim(),
                email: values.email.trim(),
                parentName: values.parentName.trim(),
                city: values.city.trim(),
                academicYear: values.academicYear,
                branchId: values.branchId,
                branchName,
                admissionTypeId: values.admissionTypeId,
                curriculumId: values.curriculumId,
                classId: values.classId,
                channelId: values.channelId,
                sourceId: values.sourceId,
                campaignId: values.campaignId,
                pipelineId,
                stageId: values.stageId,
                substageId: values.substageId,
                ownerEmployeeId: values.ownerEmployeeId,
                referredByEmployeeId: "",
                referredToBranchId: values.branchId,
                nextFollowupAt: values.nextFollowupAt,
                followupType: values.followupType,
                remarks: values.remarks.trim(),
                leadScore: Number(values.leadScore || 0),
                touchStatus: values.ownerEmployeeId
                    ? "untouched"
                    : "unassigned",
                leadEntryPath: "manual",
                paymentStatus: "unpaid",
                paymentAmount: 0,
                paymentAt: "",
                whatsappResponse: "No response",
                isParent: true,
                lookingForAdmission: true,
                remarksCount: values.remarks.trim() ? 1 : 0,
                unreadMessageCount: 0,
                addedAt: nowIso(),
                updatedAt: nowIso(),
                referredAt: "",
                reEnquiredAt: "",
                recentModifiedAt: nowIso(),
                parkedAt: "",
                formName: "",
                formPageName: "",
                customValues: values.customValues,
                marketingDeliveries: [],
                formResponses: [],
                audiences: [],
                sourceHistory: [
                    {
                        id: "1",
                        isPrimary: true,
                        academicYear: values.academicYear,
                        channel:
                            displayNameOf(
                                leadMeta.channels,
                                values.channelId,
                            ) || "—",
                        source:
                            displayNameOf(
                                leadMeta.sources,
                                values.sourceId,
                            ) || "—",
                        campaign:
                            displayNameOf(
                                leadMeta.campaigns,
                                values.campaignId,
                            ) || "—",
                        addedBy: currentUser.employeeName,
                        createdAt: nowIso(),
                    },
                ],
                comments: values.remarks.trim()
                    ? [
                        {
                            id: "1",
                            counsellorName:
                                currentUser.employeeName,
                            commentText: values.remarks.trim(),
                            createdAt: nowIso(),
                        },
                    ]
                    : [],
                activities: [
                    {
                        id: `${nextId}-1`,
                        type: "created",
                        title: "Lead created",
                        performedBy: currentUser.employeeName,
                        description:
                            "Lead added manually from the CRM",
                        createdAt: nowIso(),
                    },
                ],
            };

            setLeads(current => [newLead, ...current]);
            closeLeadModal();
            toast.success(
                `Lead "${newLead.studentName}" created`,
            );

            return;
        }

        const editedId = String(leadModalState.modalData?.id);

        setLeads(current =>
            current.map(lead =>
                lead.id === editedId
                    ? {
                        ...lead,
                        studentId: values.studentId.trim(),
                        studentName:
                            values.studentName.trim(),
                        alternatePhone:
                            values.alternatePhone.trim(),
                        academicYear: values.academicYear,
                        parentName: values.parentName.trim(),
                        city: values.city.trim(),
                        admissionTypeId:
                            values.admissionTypeId,
                        curriculumId: values.curriculumId,
                        classId: values.classId,
                        campaignId: values.campaignId,
                        stageId: values.stageId,
                        substageId: values.substageId,
                        ownerEmployeeId:
                            values.ownerEmployeeId,
                        nextFollowupAt: values.nextFollowupAt,
                        followupType: values.followupType,
                        remarks: values.remarks.trim(),
                        leadScore: Number(
                            values.leadScore || 0,
                        ),
                        customValues: values.customValues,
                        updatedAt: nowIso(),
                        recentModifiedAt: nowIso(),
                    }
                    : lead,
            ),
        );

        closeLeadModal();
        toast.success("Lead updated");
    };

    const markReEnquiredHandler = () => {
        const lead = leadModalState.modalData as LeadRecord;

        setLeads(current =>
            current.map(item =>
                item.id === lead.id
                    ? {
                        ...item,
                        reEnquiredAt: nowIso(),
                        updatedAt: nowIso(),
                        recentModifiedAt: nowIso(),
                        activities: [
                            {
                                id: `${item.id}-re-${Date.now()}`,
                                type: "stage" as const,
                                title: "Lead marked as re-enquiry",
                                performedBy:
                                    currentUser.employeeName,
                                description:
                                    "Marked as a re-enquiry from the lead view",
                                createdAt: nowIso(),
                            },
                            ...item.activities,
                        ],
                    }
                    : item,
            ),
        );

        closeLeadModal();
        toast.success("Lead marked as re-enquiry");
    };

    const addSecondarySourceHandler = (source: {
        channelId: string;
        sourceId: string;
        campaignId: string;
    }) => {
        const lead = leadModalState.modalData as LeadRecord;

        const entry = {
            id: `${(lead.sourceHistory?.length || 0) + 1}`,
            isPrimary: false,
            academicYear: lead.academicYear,
            channel:
                displayNameOf(
                    leadMeta.channels,
                    source.channelId,
                ) || "—",
            source:
                displayNameOf(
                    leadMeta.sources,
                    source.sourceId,
                ) || "—",
            campaign:
                displayNameOf(
                    leadMeta.campaigns,
                    source.campaignId,
                ) || "—",
            addedBy: currentUser.employeeName,
            createdAt: nowIso(),
        };

        const updated = {
            ...lead,
            sourceHistory: [
                ...(lead.sourceHistory || []),
                entry,
            ],
            updatedAt: nowIso(),
            recentModifiedAt: nowIso(),
        };

        setLeads(current =>
            current.map(item =>
                item.id === lead.id ? updated : item,
            ),
        );

        setLeadModalState({
            showModal: true,
            modalData: updated,
        });

        toast.success(
            "Secondary source added. The primary source is unchanged.",
        );
    };

    const saveFollowupHandler = (
        payload: FollowUpPayload,
    ) => {
        const lead = followUpModalState.modalData as LeadRecord;

        setLeads(current =>
            current.map(item =>
                item.id === lead.id
                    ? {
                        ...item,
                        stageId: payload.stageId,
                        substageId: payload.substageId,
                        nextFollowupAt:
                            payload.nextFollowupAt,
                        followupType: payload.followupType,
                        ownerEmployeeId:
                            payload.referralEmployeeId ||
                            item.ownerEmployeeId,
                        referredToBranchId:
                            payload.referralBranchId ||
                            item.referredToBranchId,
                        touchStatus: "touched",
                        remarksCount:
                            Number(item.remarksCount || 0) + 1,
                        updatedAt: nowIso(),
                        recentModifiedAt: nowIso(),
                        comments: [
                            ...item.comments,
                            {
                                id: `${item.comments.length + 1}`,
                                counsellorName:
                                    currentUser.employeeName,
                                commentText: payload.comment,
                                createdAt: nowIso(),
                            },
                        ],
                        activities: [
                            {
                                id: `${item.id}-fu-${Date.now()}`,
                                type: "followup" as const,
                                title: "Follow-up saved",
                                performedBy:
                                    currentUser.employeeName,
                                description: payload.comment,
                                createdAt: nowIso(),
                            },
                            ...item.activities,
                        ],
                    }
                    : item,
            ),
        );

        closeFollowUpModal();
        toast.success("Follow-up saved");
    };

    const referHandler = (payload: {
        branchId: string;
        employeeId: string;
        pipelineId: string;
        leadIds: string[];
    }) => {
        const movedStageId = payload.pipelineId
            ? leadMeta.stages.find(
                stage =>
                    String(stage.pipelineId) ===
                    String(payload.pipelineId),
            )?.id || ""
            : "";

        setLeads(current =>
            current.map(lead =>
                payload.leadIds.includes(lead.id)
                    ? {
                        ...lead,
                        referredByEmployeeId:
                            lead.ownerEmployeeId ||
                            currentUser.employeeId,
                        ownerEmployeeId: payload.employeeId,
                        referredToBranchId: payload.branchId,
                        pipelineId:
                            payload.pipelineId || lead.pipelineId,
                        stageId: movedStageId || lead.stageId,
                        substageId: movedStageId
                            ? ""
                            : lead.substageId,
                        branchId: payload.branchId,
                        branchName:
                            displayNameOf(
                                leadMeta.branches,
                                payload.branchId,
                            ) || lead.branchName,
                        referredAt: nowIso(),
                        updatedAt: nowIso(),
                        recentModifiedAt: nowIso(),
                        activities: [
                            {
                                id: `${lead.id}-ref-${Date.now()}`,
                                type: "referral" as const,
                                title: "Lead referred",
                                performedBy:
                                    currentUser.employeeName,
                                description: `Referred to ${employeeName(
                                    leadMeta,
                                    payload.employeeId,
                                )} · ${displayNameOf(
                                    leadMeta.branches,
                                    payload.branchId,
                                )}`,
                                createdAt: nowIso(),
                            },
                            ...lead.activities,
                        ],
                    }
                    : lead,
            ),
        );

        closeReferModal();
        toast.success(
            `${payload.leadIds.length} lead${payload.leadIds.length === 1 ? "" : "s"} referred to ${employeeName(
                leadMeta,
                payload.employeeId,
            )}`,
        );
    };

    const changeStageHandler = (payload: {
        stageId: string;
        substageId: string;
        leadIds: string[];
    }) => {
        setLeads(current =>
            current.map(lead =>
                payload.leadIds.includes(lead.id)
                    ? {
                        ...lead,
                        stageId: payload.stageId,
                        substageId: payload.substageId,
                        touchStatus: "touched",
                        updatedAt: nowIso(),
                        recentModifiedAt: nowIso(),
                        activities: [
                            {
                                id: `${lead.id}-stage-${Date.now()}`,
                                type: "stage" as const,
                                title: `Stage changed to ${displayNameOf(
                                    leadMeta.stages,
                                    payload.stageId,
                                )}`,
                                performedBy:
                                    currentUser.employeeName,
                                description: `Sub-stage set to ${displayNameOf(
                                    leadMeta.substages,
                                    payload.substageId,
                                )}`,
                                createdAt: nowIso(),
                            },
                            ...lead.activities,
                        ],
                    }
                    : lead,
            ),
        );

        closeStageModal();
        toast.success(
            `Stage changed for ${payload.leadIds.length} lead${payload.leadIds.length === 1 ? "" : "s"}`,
        );
    };

    const toggleParkedHandler = (lead: LeadRecord) => {
        const isParked = Boolean(lead.parkedAt);

        setLeads(current =>
            current.map(item =>
                item.id === lead.id
                    ? {
                        ...item,
                        parkedAt: isParked ? "" : nowIso(),
                    }
                    : item,
            ),
        );

        toast.success(
            isParked
                ? `${lead.studentName} removed from the parked list`
                : `${lead.studentName} parked`,
        );
    };

    const removeLeadHandler = () => {
        const lead = removeConfirmState.modalData as LeadRecord;

        setLeads(current =>
            current.filter(item => item.id !== lead.id),
        );

        closeRemoveConfirm();
        toast.success(
            `${lead.studentName} (${lead.leadId}) removed`,
        );
    };

    const callLeadHandler = (lead: LeadRecord) => {
        toast.info(
            `Dialling ${lead.studentName} on ${lead.phone}. Your mapped phone will ring first.`,
        );
    };

    const exportHandler = () => {
        closeDownloadModal();
    };

    const requireSelection = () => {
        if (!selectedLeads.length) {
            toast.error("Select at least one lead first");
            return false;
        }

        return true;
    };

    const bulkActions = [
        {
            id: "bulk-upload",
            label: "Bulk Upload",
            icon: Upload01Icon,
            needsSelection: false,
            onSelect: () => openBulkUploadModal(),
        },
        {
            id: "change-stage",
            label: "Change Stage",
            icon: GitMergeIcon,
            needsSelection: true,
            onSelect: () => openBulkStageConfirm(),
        },
        {
            id: "refer",
            label: "Refer",
            icon: LinkForwardIcon,
            needsSelection: true,
            onSelect: () =>
                openReferModal({
                    leadIds: selectedLeads.map(lead => lead.id),
                } as ReferTarget),
        },
        {
            id: "campaign",
            label: "Campaign",
            icon: Megaphone01Icon,
            needsSelection: true,
            onSelect: () => {
                setBulkChannel("campaign");
                openBulkMessageModal(selectedLeads);
            },
        },
        {
            id: "whatsapp",
            label: "WhatsApp",
            icon: WhatsappIcon,
            needsSelection: true,
            onSelect: () => {
                setBulkChannel("whatsapp");
                openBulkMessageModal(selectedLeads);
            },
        },
        {
            id: "sms",
            label: "SMS",
            icon: Message01Icon,
            needsSelection: true,
            onSelect: () => {
                setBulkChannel("sms");
                openBulkMessageModal(selectedLeads);
            },
        },
        {
            id: "email",
            label: "Email",
            icon: Mail01Icon,
            needsSelection: true,
            onSelect: () => {
                setBulkChannel("email");
                openBulkMessageModal(selectedLeads);
            },
        },
        {
            id: "export",
            label: "Export",
            icon: Download01Icon,
            needsSelection: false,
            onSelect: () => openDownloadModal(),
        },
    ];

    const bulkActionHandler = (action: {
        needsSelection: boolean;
        onSelect: () => void;
    }) => {
        if (action.needsSelection && !requireSelection()) {
            return;
        }

        action.onSelect();
    };

    const rowHandlers: LeadRowHandlers = {
        onView: lead => openLeadHandler(lead, "view"),
        onToggleParked: toggleParkedHandler,
        onCall: callLeadHandler,
        onMessage: lead => openMessagesCanvas(lead),
        onEmail: lead => {
            setBulkChannel("email");
            openBulkMessageModal([lead]);
        },
        onHistory: lead =>
            openLeadHandler(lead, "view", "history"),
        onFollowup: lead => openFollowUpModal(lead),
        onEdit: lead => openLeadHandler(lead, "edit"),
        onChangeStage: lead =>
            openStageModal({ lead } as StageChangeTarget),
        onRefer: lead =>
            openReferModal({ lead } as ReferTarget),
        onRemove: lead => openRemoveConfirm(lead),
    };

    const tableColumns = useMemo(
        () => generateColumns(scopedMeta, rowHandlers),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [selectedLeads.length, leads, scopedMeta],
    );

    const selectedRowHandler = useCallback(
        (rows: LeadRecord[]) => {
            setSelectedLeads(current =>
                current.length === rows.length &&
                    current.every((lead, index) =>
                        lead.id === rows[index]?.id,
                    )
                    ? current
                    : rows,
            );
        },
        [],
    );

    return (
        <div className="page-content">
            <div className="container-fluid">
                <BreadCrumb pageTitle="CRM" />

                <div className="tw-card">
                    <div className="tw-card-header">
                        <div className="tw-flex tw-flex-wrap tw-items-center tw-justify-between tw-gap-3">
                            <div className="tw-w-full md:tw-w-96">
                                <TextIconInput
                                    formgroupClassName="search-box tw-mb-0"
                                    name="searchString"
                                    value={searchString}
                                    onChange={searchChangeHandler}
                                    placeHolder="Search name, lead id, mobile, email…"
                                >
                                    <i className="ri-search-line search-icon"></i>
                                </TextIconInput>
                            </div>

                            <div className="tw-flex tw-flex-wrap tw-items-center tw-gap-3">
                                <InputCheckbox
                                    name="pendingFollowUpsDueToday"
                                    formgroupClassName="tw-mb-0"
                                    labelName={`Pending followups (${pendingFollowupCount})`}
                                    labelClassName="tw-cursor-pointer tw-text-sm tw-font-medium tw-text-gray-800"
                                    value={filters.pendingFollowupsOnly}
                                    onChange={pendingFollowupToggleHandler}
                                />

                                <div
                                    title={`Untouched (${untouchedCount})`}
                                    className="tw-relative tw-flex tw-h-9 tw-items-center tw-rounded tw-border tw-border-gray-200 tw-bg-white tw-px-2 hover:tw-bg-gray-50"
                                >
                                    <InputCheckbox
                                        name="untouchedOnly"
                                        formgroupClassName="tw-mb-0"
                                        value={filters.touchStatus.includes(
                                            "untouched",
                                        )}
                                        onChange={untouchedToggleHandler}
                                    />
                                    <span className="tw-absolute -tw-right-2 -tw-top-2 tw-flex tw-h-5 tw-min-w-5 tw-items-center tw-justify-center tw-rounded-full tw-bg-[#c33d35] tw-px-1 tw-text-[10px] tw-font-semibold tw-leading-none tw-text-white">
                                        {untouchedCount}
                                    </span>
                                </div>

                                <Button
                                    type="button"
                                    role="switch"
                                    aria-checked={parkedOnly}
                                    variant="secondary"
                                    title={
                                        parkedOnly
                                            ? "Showing parked leads. Click to show all leads."
                                            : "Show only parked leads"
                                    }
                                    onClick={parkedToggleHandler}
                                    className={`tw-relative !tw-h-9 tw-gap-1.5 tw-border ${parkedOnly
                                        ? "tw-border-amber-200 !tw-bg-amber-50 hover:!tw-bg-amber-100"
                                        : "tw-border-gray-200 !tw-bg-white hover:!tw-bg-gray-50"
                                        }`}
                                >
                                    <HugeiconsIcon
                                        icon={Bookmark01Icon}
                                        className={
                                            parkedOnly
                                                ? "tw-text-amber-600"
                                                : "text-muted"
                                        }
                                        size={18}
                                    />
                                    <span className="tw-text-sm tw-font-medium tw-text-gray-800">
                                        Parked
                                    </span>
                                    {parkedCount > 0 && (
                                        <span className="tw-absolute -tw-right-2 -tw-top-2 tw-flex tw-h-5 tw-min-w-5 tw-items-center tw-justify-center tw-rounded-full tw-bg-[#c33d35] tw-px-1 tw-text-[10px] tw-font-semibold tw-leading-none tw-text-white">
                                            {parkedCount > 99
                                                ? "99+"
                                                : parkedCount}
                                        </span>
                                    )}
                                </Button>

                                <UncontrolledDropdown>
                                    <DropdownToggle
                                        tag="button"
                                        type="button"
                                        title="Lead actions"
                                        className="btn btn-icon btn-sm tw-inline-flex tw-h-9 tw-w-9 tw-items-center tw-justify-center tw-rounded tw-border tw-border-gray-200 tw-bg-white hover:tw-bg-gray-50"
                                    >
                                        <HugeiconsIcon
                                            icon={
                                                GlobalEditingIcon
                                            }
                                            className="text-muted"
                                            size={24}
                                        />
                                    </DropdownToggle>
                                    <DropdownMenu end>
                                        <div className="tw-px-3 tw-py-1 tw-text-xs tw-text-gray-500">
                                            {selectedLeads.length}{" "}
                                            selected
                                        </div>
                                        {bulkActions.map(
                                            action => (
                                                <DropdownItem
                                                    key={
                                                        action.id
                                                    }
                                                    onClick={() =>
                                                        bulkActionHandler(
                                                            action,
                                                        )
                                                    }
                                                >
                                                    <div className="tw-flex tw-items-center tw-gap-2">
                                                        <HugeiconsIcon
                                                            icon={
                                                                action.icon
                                                            }
                                                            className="text-muted"
                                                            size={
                                                                16
                                                            }
                                                        />
                                                        {
                                                            action.label
                                                        }
                                                    </div>
                                                </DropdownItem>
                                            ),
                                        )}
                                    </DropdownMenu>
                                </UncontrolledDropdown>

                                <Button
                                    type="button"
                                    title="WhatsApp inbox"
                                    variant="secondary"
                                    className="!tw-h-8 !tw-w-8 !tw-p-0 tw-border tw-border-gray-200 !tw-bg-white hover:!tw-bg-gray-50 tw-relative"
                                    onClick={() => history.push('/crm-whatsapp-inbox')}
                                >
                                    <HugeiconsIcon
                                        icon={WhatsappIcon}
                                        className="text-success"
                                        size={24}
                                    />
                                    <span className="tw-absolute -tw-right-2 -tw-top-2 tw-flex tw-h-5 tw-min-w-4 tw-items-center tw-justify-center tw-rounded-full tw-bg-[#034932] tw-px-1 tw-text-[10px] tw-font-semibold tw-leading-none tw-text-white">
                                        {leads.reduce(
                                            (total, lead) =>
                                                total +
                                                Number(
                                                    lead.unreadMessageCount ||
                                                    0,
                                                ),
                                            0,
                                        )}
                                    </span>
                                </Button>

                                <Button
                                    type="button"
                                    title="Notifications"
                                    variant="secondary"
                                    className="!tw-h-8 !tw-w-8 !tw-p-0 tw-border tw-border-gray-200 !tw-bg-white hover:!tw-bg-gray-50 tw-relative"
                                >
                                    <HugeiconsIcon
                                        icon={Notification02Icon}
                                        className="text-muted"
                                        size={24}
                                    />
                                    <span className="tw-absolute -tw-right-2 -tw-top-2 tw-flex tw-h-5 tw-min-w-5 tw-items-center tw-justify-center tw-rounded-full tw-bg-[#c33d35] tw-px-1 tw-text-[10px] tw-font-semibold tw-leading-none tw-text-white">
                                        {pendingFollowupCount}
                                    </span>
                                </Button>

                                <div className="tw-flex tw-gap-2">
                                    <Button
                                        type="button"
                                        variant="hoverInfo"
                                        onClick={() => {
                                            setWorkspaceMode(
                                                "funnel",
                                            );
                                            openWorkspaceModal();
                                        }}
                                    >
                                        <i className="ri-add-fill"></i>
                                        Create view
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="primary"
                                        onClick={
                                            openCreateHandler
                                        }
                                    >
                                        <i className="ri-add-fill"></i>
                                        Add Lead
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="reject"
                                        onClick={
                                            resetFilterHandler
                                        }
                                    >
                                        Reset
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="tw-border-b tw-border-gray-200 tw-p-3">
                        <div className="row tw-items-end tw-gap-y-3">
                            {leadMeta.pipelines.length > 1 && (
                                <div className="col-12 col-md-6 col-xl-2">
                                    <SelectInput
                                        name="pipelineId"
                                        labelText="Pipeline"
                                        value={pipelineId}
                                        onChange={
                                            pipelineChangeHandler
                                        }
                                        menuItems={leadMeta.pipelines.map(
                                            item => ({
                                                id: item.id,
                                                name: item.isDefault
                                                    ? `${item.displayName} (default)`
                                                    : item.displayName,
                                            }),
                                        )}
                                        valueKey="id"
                                        textKey="name"
                                        hideSelectOption
                                        formgroupClassName="tw-mb-0"
                                        floatingLabel
                                    />
                                </div>
                            )}

                            <div className="col-12 col-md-6 col-xl-2">
                                <MultiSelectCheckbox
                                    name="branchId"
                                    idKey="id"
                                    searchKey="name"
                                    labelText="Branch"
                                    value={asOptions(
                                        leadMeta.branches,
                                    ).filter(item =>
                                        filters.branchId.includes(
                                            item.id,
                                        ),
                                    )}
                                    options={asOptions(
                                        leadMeta.branches,
                                    )}
                                    renderValue={
                                        renderFilterValue
                                    }
                                    renderOptions={
                                        renderFilterOption
                                    }
                                    onChange={
                                        multiFilterChangeHandler
                                    }
                                    containerClassName="tw-mb-0"
                                    floatingLabel
                                />
                            </div>

                            <div className="col-12 col-md-6 col-xl-2">
                                <MultiSelectCheckbox
                                    name="touchStatus"
                                    idKey="id"
                                    searchKey="name"
                                    labelText="Touch Status"
                                    value={touchStatusOptions.filter(
                                        item =>
                                            filters.touchStatus.includes(
                                                item.id,
                                            ),
                                    )}
                                    options={touchStatusOptions}
                                    renderValue={
                                        renderFilterValue
                                    }
                                    renderOptions={
                                        renderFilterOption
                                    }
                                    onChange={
                                        multiFilterChangeHandler
                                    }
                                    containerClassName="tw-mb-0"
                                    floatingLabel
                                />
                            </div>

                            <div className="col-12 col-md-6 col-xl-2">
                                <MultiSelectCheckbox
                                    name="substageId"
                                    idKey="id"
                                    searchKey="name"
                                    labelText="Sub-stage"
                                    value={asOptions(
                                        scopedMeta.substages,
                                    ).filter(item =>
                                        filters.substageId.includes(
                                            item.id,
                                        ),
                                    )}
                                    options={asOptions(
                                        scopedMeta.substages.filter(
                                            item =>
                                                activeTabId ===
                                                "all" ||
                                                activeTabId ===
                                                RE_ENQUIRED_TAB_ID ||
                                                String(
                                                    item.stageId,
                                                ) === activeTabId,
                                        ),
                                    )}
                                    renderValue={
                                        renderFilterValue
                                    }
                                    renderOptions={
                                        renderFilterOption
                                    }
                                    onChange={
                                        multiFilterChangeHandler
                                    }
                                    containerClassName="tw-mb-0"
                                    floatingLabel
                                />
                            </div>

                            <div className="col-12 col-md-6 col-xl-2">
                                <MultiSelectCheckbox
                                    name="sourceId"
                                    idKey="id"
                                    searchKey="name"
                                    labelText="Source"
                                    value={asOptions(
                                        leadMeta.sources,
                                    ).filter(item =>
                                        filters.sourceId.includes(
                                            item.id,
                                        ),
                                    )}
                                    options={asOptions(
                                        leadMeta.sources,
                                    )}
                                    renderValue={
                                        renderFilterValue
                                    }
                                    renderOptions={
                                        renderFilterOption
                                    }
                                    onChange={
                                        multiFilterChangeHandler
                                    }
                                    containerClassName="tw-mb-0"
                                    floatingLabel
                                />
                            </div>

                            <div className="col-12 col-md-6 col-xl-2">
                                <MultiSelectCheckbox
                                    name="paymentStatus"
                                    idKey="id"
                                    searchKey="name"
                                    labelText="Payment Status"
                                    value={paymentStatusOptions.filter(
                                        item =>
                                            filters.paymentStatus.includes(
                                                item.id,
                                            ),
                                    )}
                                    options={
                                        paymentStatusOptions
                                    }
                                    renderValue={
                                        renderFilterValue
                                    }
                                    renderOptions={
                                        renderFilterOption
                                    }
                                    onChange={
                                        multiFilterChangeHandler
                                    }
                                    containerClassName="tw-mb-0"
                                    floatingLabel
                                />
                            </div>

                            <div className="col-12 col-md-6 col-xl-2">
                                <MultiSelectCheckbox
                                    name="studentIdStatus"
                                    idKey="id"
                                    searchKey="name"
                                    labelText="Student ID"
                                    value={studentIdStatusOptions.filter(
                                        item =>
                                            filters.studentIdStatus.includes(
                                                item.id,
                                            ),
                                    )}
                                    options={
                                        studentIdStatusOptions
                                    }
                                    renderValue={
                                        renderFilterValue
                                    }
                                    renderOptions={
                                        renderFilterOption
                                    }
                                    onChange={
                                        multiFilterChangeHandler
                                    }
                                    containerClassName="tw-mb-0"
                                    floatingLabel
                                />
                            </div>

                            <div className="col-12 col-md-6 col-xl-2">
                                <SelectInput
                                    name="dateFilterType"
                                    labelText="Date filter type"
                                    value={dateFilterType}
                                    onChange={
                                        dateTypeChangeHandler
                                    }
                                    menuItems={dateTypeOptions}
                                    valueKey="id"
                                    textKey="name"
                                    hideSelectOption
                                    formgroupClassName="tw-mb-0"
                                    floatingLabel
                                />
                            </div>

                            <div className="col-12 col-md-6 col-xl-3">
                                <CustomDatePicker
                                    name="dateRange"
                                    labelText="Date Range"
                                    startDate={
                                        filters[
                                        dateFromKey
                                        ] as string
                                    }
                                    endDate={
                                        filters[
                                        dateToKey
                                        ] as string
                                    }
                                    onChange={
                                        dateRangeChangeHandler
                                    }
                                    placeholder="Select date range"
                                    monthsShown={2}
                                    formgroupClassName="tw-mb-0"
                                    portalId="crm-leads-v2-date-filter"
                                    floatingLabel
                                />
                                <div id="crm-leads-v2-date-filter"></div>
                            </div>

                            <div className="col-12 col-md-6 col-xl-3">
                                <div className="tw-flex tw-gap-2">
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        className="!tw-bg-[#f4f7fa] tw-border tw-border-[#ced4da]"
                                        onClick={() => {
                                            setWorkspaceMode(
                                                "filter",
                                            );
                                            openWorkspaceModal();
                                        }}
                                    >
                                        <FilterSvg
                                            height="18px"
                                            width="18px"
                                        />
                                        <span>Filters</span>
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="secondary"
                                        className="!tw-bg-[#f4f7fa] tw-border tw-border-[#ced4da]"
                                        onClick={() =>
                                            openSavedViewsModal()
                                        }
                                    >
                                        <i className="ri-stack-line"></i>
                                        <span>
                                            Views ({savedViews.length})
                                        </span>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <AppliedFiltersPanel
                        groups={appliedFilterGroups}
                        isExpanded={appliedFiltersExpanded}
                        onToggle={() =>
                            setAppliedFiltersExpanded(
                                current => !current,
                            )
                        }
                        onReset={resetFilterHandler}
                        onEdit={() => {
                            setWorkspaceMode("filter");
                            openWorkspaceModal();
                        }}
                    />

                    <div className="tw-card-body !tw-p-0">
                        <div className="tw-mt-3">
                            <UpdatedHorizontalTab
                                MenuOptions={stageTabs}
                                clickMenuHandler={
                                    tabClickHandler
                                }
                                activeTabId={activeTabId}
                                showBadge
                                horizontalClass="use-small-font"
                            />
                        </div>

                        <TableContainer
                            columns={tableColumns}
                            data={paginatedLeads}
                            tableClass="mb-0"
                            divClass="table-responsive mb-3"
                            theadClass="table-light text-muted align-middle"
                            showCheckbox
                            selectedRowHandler={
                                selectedRowHandler
                            }
                            showPagination
                            totalPages={Math.ceil(
                                leads.length /
                                pagination.pageSize,
                            )}
                            totalRecords={leads.length}
                            currentPageNumber={
                                pagination.pageNo
                            }
                            pageSize={pagination.pageSize}
                            callbackPaginationHndlr={(state: {
                                pageNo: number;
                                pageSize: number;
                            }) => setPagination(state)}
                        />
                    </div>
                </div>

                <ModalContainerUpdated
                    id="crm-leads-v2-lead-modal"
                    isOpen={leadModalState.showModal}
                    toggle={closeLeadModal}
                    modalTitle={
                        leadModalMode === "create"
                            ? "Add Lead"
                            : leadModalMode === "edit"
                                ? "Edit Lead"
                                : "Lead details"
                    }
                    modalSize="xl"
                >
                    <AddEditLeadModal
                        mode={leadModalMode}
                        initialTab={leadInitialTab}
                        lead={
                            leadModalState.modalData as
                            | LeadRecord
                            | undefined
                        }
                        toggle={closeLeadModal}
                        onSave={saveLeadHandler}
                        onSwitchToEdit={() =>
                            setLeadModalMode("edit")
                        }
                        onMarkReEnquired={
                            markReEnquiredHandler
                        }
                        onAddSecondarySource={
                            addSecondarySourceHandler
                        }
                    />
                </ModalContainerUpdated>

                <ModalContainerUpdated
                    id="crm-leads-v2-followup-modal"
                    isOpen={followUpModalState.showModal}
                    toggle={closeFollowUpModal}
                    modalTitle="Follow-up and notes"
                    modalSize="lg"
                >
                    {followUpModalState.modalData && (
                        <FollowUpModal
                            lead={
                                followUpModalState.modalData as LeadRecord
                            }
                            toggle={closeFollowUpModal}
                            onSave={saveFollowupHandler}
                        />
                    )}
                </ModalContainerUpdated>

                <ModalContainerUpdated
                    id="crm-leads-v2-refer-modal"
                    isOpen={referModalState.showModal}
                    toggle={closeReferModal}
                    modalTitle="Refer lead"
                    modalSize="md"
                >
                    {referModalState.modalData && (
                        <ReferModal
                            target={
                                referModalState.modalData as ReferTarget
                            }
                            toggle={closeReferModal}
                            onRefer={referHandler}
                        />
                    )}
                </ModalContainerUpdated>

                <ModalContainerUpdated
                    id="crm-leads-v2-stage-modal"
                    isOpen={stageModalState.showModal}
                    toggle={closeStageModal}
                    modalTitle="Change stage"
                    modalSize="md"
                >
                    {stageModalState.modalData && (
                        <StageChangeModal
                            target={
                                stageModalState.modalData as StageChangeTarget
                            }
                            toggle={closeStageModal}
                            onChangeStage={changeStageHandler}
                        />
                    )}
                </ModalContainerUpdated>

                <ModalContainerUpdated
                    id="crm-leads-v2-filter-workspace"
                    isOpen={workspaceModalState.showModal}
                    toggle={closeWorkspaceModal}
                    modalTitle="Filter leads"
                    modalSize="xl"
                    headerClassName="tw-hidden"
                >
                    <FilterWorkspace
                        mode={workspaceMode}
                        initialFilters={filters}
                        savedViews={savedViews}
                        showReferredFilter={
                            currentUser.isCounsellor
                        }
                        toggle={closeWorkspaceModal}
                        onApply={applyFiltersHandler}
                        onSave={saveViewHandler}
                    />
                </ModalContainerUpdated>

                <ModalContainerUpdated
                    id="crm-leads-v2-saved-views"
                    isOpen={savedViewsModalState.showModal}
                    toggle={closeSavedViewsModal}
                    modalTitle="Select views"
                    modalSize="lg"
                >
                    <SavedViewsModal
                        savedViews={savedViews}
                        selectedViewId={selectedViewId}
                        toggle={closeSavedViewsModal}
                        onApply={applySavedViewHandler}
                        onDelete={deleteSavedViewHandler}
                    />
                </ModalContainerUpdated>

                <ModalContainerUpdated
                    id="crm-leads-v2-download-modal"
                    isOpen={downloadModalState.showModal}
                    toggle={closeDownloadModal}
                    modalTitle="Download data"
                    modalSize="lg"
                >
                    <DownloadFieldsModal
                        groups={exportGroups}
                        recordCount={leads.length}
                        toggle={closeDownloadModal}
                        onDownload={exportHandler}
                    />
                </ModalContainerUpdated>

                <ModalContainerUpdated
                    id="crm-leads-v2-bulk-upload"
                    isOpen={bulkUploadModalState.showModal}
                    toggle={closeBulkUploadModal}
                    modalTitle="Bulk upload leads"
                    modalSize="lg"
                >
                    <BulkUploadModal
                        toggle={closeBulkUploadModal}
                        onUploaded={count =>
                            toast.success(
                                `${count} lead${count === 1 ? "" : "s"} queued for import`,
                            )
                        }
                    />
                </ModalContainerUpdated>

                <ModalContainerUpdated
                    id="crm-leads-v2-bulk-message"
                    isOpen={bulkMessageModalState.showModal}
                    toggle={closeBulkMessageModal}
                    modalTitle={
                        bulkChannel === "campaign"
                            ? "Add marketing campaign"
                            : `Send ${bulkChannel}`
                    }
                    modalSize="lg"
                >
                    <BulkMessageModal
                        channel={bulkChannel}
                        leads={
                            (bulkMessageModalState.modalData as LeadRecord[]) ||
                            []
                        }
                        toggle={closeBulkMessageModal}
                        onSend={payload => {
                            closeBulkMessageModal();
                            toast.success(
                                `${payload.channel === "campaign" ? "Campaign" : payload.channel.toUpperCase()} queued for ${payload.leadIds.length} lead${payload.leadIds.length === 1 ? "" : "s"}`,
                            );
                        }}
                    />
                </ModalContainerUpdated>

                <OffCanvasContainer
                    id="crm-leads-v2-messages"
                    isOpen={messagesCanvasState.showModal}
                    closeHndlr={closeMessagesCanvas}
                    headerTitle=""
                    width={520}
                    customClass="[&_.offcanvas-header]:tw-hidden"
                >
                    <LeadMessagesOffCanvas
                        lead={
                            messagesCanvasState.modalData as
                            | LeadRecord
                            | undefined
                        }
                        toggle={closeMessagesCanvas}
                        onSend={() =>
                            toast.success("Message sent")
                        }
                    />
                </OffCanvasContainer>

                <ConfirmationModal
                    id="crm-leads-v2-bulk-stage-confirm"
                    isOpen={bulkStageConfirmState.showModal}
                    iconType="reject"
                    confirmTitle="Bulk lead stage change"
                    confirmMessage={`Are you sure you want to change the stage of ${selectedLeads.length} selected lead${selectedLeads.length === 1 ? "" : "s"}?`}
                    confirmBtnText="Continue"
                    cancelHndlr={closeBulkStageConfirm}
                    confirmHndlr={() => {
                        closeBulkStageConfirm();
                        openStageModal({
                            leadIds: selectedLeads.map(
                                lead => lead.id,
                            ),
                        } as StageChangeTarget);
                    }}
                />

                <ConfirmationModal
                    id="crm-leads-v2-remove-confirm"
                    isOpen={removeConfirmState.showModal}
                    iconType="reject"
                    confirmTitle="Remove lead"
                    confirmMessage={
                        removeConfirmState.modalData
                            ? `Remove ${(removeConfirmState.modalData as LeadRecord).studentName} (${(removeConfirmState.modalData as LeadRecord).leadId})?`
                            : ""
                    }
                    noteMessage="This can be restored from the database."
                    confirmBtnText="Remove"
                    cancelHndlr={closeRemoveConfirm}
                    confirmHndlr={removeLeadHandler}
                />
            </div>
        </div>
    );
};

export default CRMLeadsV2;
