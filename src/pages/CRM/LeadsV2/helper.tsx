import { HugeiconsIcon } from "@hugeicons/react";
import {
    Bookmark01Icon,
    Bookmark03Icon,
    CallIcon,
    Clock01Icon,
    Mail01Icon,
    NoteEditIcon,
    WhatsappIcon,
    PencilEdit02Icon,
    GitMergeIcon,
    LinkForwardIcon,
    Delete02Icon,
} from "@hugeicons-pro/core-stroke-standard";

import { Button, StatusLabel, UserDetails } from "../../../Components/Common";
import { MoreActions } from "../../../Components/Common/MenuOptions";
import { leadMeta } from "./data";
import type {
    AdmissionType,
    AdvancedFilters,
    ClassOption,
    Curriculum,
    DateFilterType,
    Employee,
    ExportFieldGroup,
    LeadField,
    LeadMeta,
    LeadRecord,
    Option,
    Stage,
    SubStage,
} from "./types";

const IST_OPTIONS: Intl.DateTimeFormatOptions = {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "short",
};

export const formatDateTime = (value?: string) => {
    if (!value) {
        return "";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    return date.toLocaleString("en-IN", IST_OPTIONS);
};

export const formatDate = (value?: string) => {
    if (!value) {
        return "";
    }

    const date = new Date(
        value.length === 10 ? `${value}T00:00:00` : value,
    );

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    return new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(date);
};

export const dateKey = (value?: string) => {
    if (!value) {
        return "";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};

export const toLocalInput = (value?: string) => {
    if (!value) {
        return "";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    const offset = date.getTimezoneOffset() * 60000;

    return new Date(date.getTime() - offset)
        .toISOString()
        .slice(0, 16);
};

export const minimumFollowupTime = () =>
    toLocalInput(
        new Date(Date.now() + 60000).toISOString(),
    );

export const relativeText = (value?: string) => {
    if (!value) {
        return "";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    const differenceInDays = Math.round(
        (new Date().setHours(0, 0, 0, 0) -
            new Date(date).setHours(0, 0, 0, 0)) /
        86400000,
    );

    if (differenceInDays < 0) {
        const upcomingDays = Math.abs(differenceInDays);

        return upcomingDays === 1
            ? "Due tomorrow"
            : `In ${upcomingDays} days`;
    }

    if (differenceInDays === 0) {
        return "Today";
    }

    return differenceInDays === 1
        ? "1 day ago"
        : `${differenceInDays} days ago`;
};

export const sourcesForChannel = (
    meta: LeadMeta,
    channelId: string,
) => {
    if (!channelId) {
        return [];
    }

    return meta.sources.filter(source =>
        meta.sourceLinks.some(
            link =>
                String(link.channelId) === String(channelId) &&
                String(link.sourceId) === String(source.id),
        ),
    );
};

export const campaignsForSource = (
    meta: LeadMeta,
    sourceId: string,
) => {
    if (!sourceId) {
        return meta.campaigns;
    }

    const links = meta.campaignLinks.filter(
        link => String(link.sourceId) === String(sourceId),
    );

    if (!links.length) {
        return meta.campaigns;
    }

    return meta.campaigns.filter(campaign =>
        links.some(
            link =>
                String(link.campaignId) === String(campaign.id),
        ),
    );
};

export const admissionTypesFor = (
    meta: LeadMeta,
    academicYear: string,
    branchId: string,
): AdmissionType[] => {
    if (!academicYear || !branchId) {
        return [];
    }

    return meta.admissionTypes.filter(
        item =>
            item.academicYear === academicYear &&
            item.branchIds.includes(String(branchId)),
    );
};

export const curriculaFor = (
    meta: LeadMeta,
    academicYear: string,
    branchId: string,
    admissionTypeId: string,
): Curriculum[] => {
    if (!academicYear || !branchId || !admissionTypeId) {
        return [];
    }

    return meta.curricula.filter(
        item =>
            item.academicYear === academicYear &&
            item.branchIds.includes(String(branchId)) &&
            item.admissionTypeIds.includes(
                String(admissionTypeId),
            ),
    );
};

export const classesFor = (
    meta: LeadMeta,
    academicYear: string,
    branchId: string,
    admissionTypeId: string,
    curriculumId: string,
): ClassOption[] => {
    if (
        !academicYear ||
        !branchId ||
        !admissionTypeId ||
        !curriculumId
    ) {
        return [];
    }

    return meta.classes.filter(
        item =>
            item.academicYear === academicYear &&
            item.branchIds.includes(String(branchId)) &&
            item.admissionTypeIds.includes(
                String(admissionTypeId),
            ) &&
            String(item.curriculumId) === String(curriculumId),
    );
};

export const substagesForStage = (
    meta: LeadMeta,
    stageId: string,
): SubStage[] =>
    meta.substages.filter(
        item =>
            !stageId ||
            String(item.stageId) === String(stageId),
    );

export const employeesForBranch = (
    meta: LeadMeta,
    branchId: string,
): Employee[] =>
    meta.employees.filter(
        item =>
            !branchId ||
            String(item.branchId) === String(branchId),
    );

export const stageById = (
    meta: LeadMeta,
    stageId: string,
): Stage | undefined =>
    meta.stages.find(
        item => String(item.id) === String(stageId),
    );

export const stageRequiresFollowup = (
    meta: LeadMeta,
    stageId: string,
) => Boolean(stageById(meta, stageId)?.requiresFollowup);

export const stagesForPipeline = (
    meta: LeadMeta,
    pipelineId: string,
): Stage[] =>
    meta.stages.filter(
        stage =>
            !pipelineId ||
            String(stage.pipelineId) === String(pipelineId),
    );

export const stageLabelFor = (
    meta: LeadMeta,
    stageId: string,
) => {
    const stage = stageById(meta, stageId);

    if (!stage) {
        return "";
    }

    const isAmbiguous = meta.stages.some(
        other =>
            other.id !== stage.id &&
            other.displayName === stage.displayName &&
            String(other.pipelineId) !== String(stage.pipelineId),
    );

    if (!isAmbiguous) {
        return stage.displayName;
    }

    const pipelineName = displayNameOf(
        meta.pipelines,
        stage.pipelineId,
    );

    return pipelineName
        ? `${stage.displayName} · ${pipelineName}`
        : stage.displayName;
};

export const scopeMetaToPipeline = (
    meta: LeadMeta,
    pipelineId: string,
): LeadMeta => {
    if (!pipelineId) {
        return meta;
    }

    const stages = stagesForPipeline(meta, pipelineId);
    const stageIds = stages.map(stage => String(stage.id));

    return {
        ...meta,
        stages,
        substages: meta.substages.filter(item =>
            stageIds.includes(String(item.stageId)),
        ),
    };
};

export const referralChoices = (
    employees: Employee[],
): Option[] =>
    employees.map(employee => ({
        id: `${employee.branchId}:${employee.id}`,
        name: `${employee.name} - ${employee.branchName}`,
    }));

export const referralKey = (
    branchId: string,
    employeeId: string,
) => (branchId && employeeId ? `${branchId}:${employeeId}` : "");

export const splitReferralKey = (key: string) => {
    const [branchId = "", employeeId = ""] = String(
        key || "",
    ).split(":");

    return { branchId, employeeId };
};

export const employeeName = (
    meta: LeadMeta,
    employeeId: string,
) =>
    meta.employees.find(
        item => String(item.id) === String(employeeId),
    )?.name || "";

export const displayNameOf = (
    list: Array<{ id: string; displayName?: string; name?: string }>,
    id: string,
) => {
    const match = list.find(
        item => String(item.id) === String(id),
    );

    return match?.displayName || match?.name || "";
};

export const configuredFieldProperties: Record<string, string> = {
    name: "studentName",
    student_name: "studentName",
    phone: "phone",
    primary_phone: "phone",
    alternate_phone: "alternatePhone",
    email: "email",
    parent_name: "parentName",
    city: "city",
    academic_year: "academicYear",
    branch_id: "branchId",
    admission_type_id: "admissionTypeId",
    curriculum_id: "curriculumId",
    class_id: "classId",
    channel_id: "channelId",
    source_id: "sourceId",
    campaign_id: "campaignId",
    stage_id: "stageId",
    substage_id: "substageId",
    owner_employee_id: "ownerEmployeeId",
    next_followup_at_utc: "nextFollowupAt",
    followup_type: "followupType",
    remarks: "remarks",
    lead_score: "leadScore",
};

export const leadFieldGroups = [
    {
        title: "Lead name & contact details",
        keys: [
            "student_name",
            "name",
            "phone",
            "primary_phone",
            "alternate_phone",
            "email",
            "parent_name",
            "city",
        ],
    },
    {
        title: "Academic requirements",
        keys: [
            "academic_year",
            "branch_id",
            "admission_type_id",
            "curriculum_id",
            "class_id",
        ],
    },
    {
        title: "Source details",
        keys: ["channel_id", "source_id", "campaign_id"],
    },
    {
        title: "Follow-up details",
        keys: [
            "stage_id",
            "substage_id",
            "owner_employee_id",
            "next_followup_at_utc",
            "followup_type",
            "remarks",
            "lead_score",
        ],
    },
];

const groupedLeadFieldKeys = new Set(
    leadFieldGroups.flatMap(group => group.keys),
);

export const groupLeadFields = (fields: LeadField[] = []) => {
    const sections = leadFieldGroups.map(group => ({
        title: group.title,
        fields: group.keys
            .map(key =>
                fields.find(field => field.fieldKey === key),
            )
            .filter(Boolean) as LeadField[],
    }));

    const ungrouped = fields.filter(
        field => !groupedLeadFieldKeys.has(field.fieldKey),
    );

    if (ungrouped.length) {
        sections.push({
            title: "Additional details",
            fields: ungrouped,
        });
    }

    return sections.filter(section => section.fields.length);
};

const multiKeys: Array<keyof AdvancedFilters> = [
    "branchId",
    "stage",
    "substageId",
    "sourceId",
    "channelId",
    "channelCategory",
    "campaignId",
    "campaignCategory",
    "marketingCampaignId",
    "marketingDeliveryStatus",
    "ownerEmployeeId",
    "classId",
    "curriculumId",
    "admissionTypeId",
    "referredByEmployeeId",
    "touchStatus",
    "leadEntryPath",
    "isParent",
    "lookingForAdmission",
    "whatsappResponse",
    "contactAvailability",
    "paymentStatus",
    "studentIdStatus",
];

export const emptyAdvancedFilters: AdvancedFilters = {
    branchId: [],
    stage: [],
    substageId: [],
    sourceId: [],
    channelId: [],
    channelCategory: [],
    campaignId: [],
    campaignCategory: [],
    marketingCampaignId: [],
    marketingDeliveryStatus: [],
    ownerEmployeeId: [],
    classId: [],
    curriculumId: [],
    admissionTypeId: [],
    referredByEmployeeId: [],
    touchStatus: [],
    leadEntryPath: [],
    isParent: [],
    lookingForAdmission: [],
    whatsappResponse: [],
    contactAvailability: [],
    paymentStatus: [],
    studentIdStatus: [],

    studentName: "",
    primaryPhone: "",
    alternatePhone: "",
    email: "",
    parentName: "",

    scoreMin: "",
    scoreMax: "",
    isReferred: "no",

    addedFrom: "",
    addedTo: "",
    updatedFrom: "",
    updatedTo: "",
    referredFrom: "",
    referredTo: "",
    nextFollowupFrom: "",
    nextFollowupTo: "",
    reEnquiredFrom: "",
    reEnquiredTo: "",

    pendingFollowupsOnly: false,
};

export const normalizeFilters = (
    filters: Partial<AdvancedFilters> = {},
): AdvancedFilters => {
    const normalized = {
        ...emptyAdvancedFilters,
        ...filters,
    } as AdvancedFilters;

    const source = filters as Record<string, unknown>;
    const target = normalized as unknown as Record<
        string,
        unknown
    >;

    multiKeys.forEach(key => {
        const value = source[key];

        target[key] = Array.isArray(value)
            ? value.map(String)
            : value
                ? [String(value)]
                : [];
    });

    normalized.pendingFollowupsOnly = Boolean(
        filters.pendingFollowupsOnly,
    );

    return normalized;
};

export const DATE_TYPE_FILTER_FIELDS: Record<
    DateFilterType,
    [keyof AdvancedFilters, keyof AdvancedFilters]
> = {
    addedAt: ["addedFrom", "addedTo"],
    updatedAt: ["updatedFrom", "updatedTo"],
    referredAt: ["referredFrom", "referredTo"],
    nextFollowup: ["nextFollowupFrom", "nextFollowupTo"],
    reEnquiredAt: ["reEnquiredFrom", "reEnquiredTo"],
};

export const dateTypeOptions = [
    { id: "addedAt", name: "Added" },
    { id: "updatedAt", name: "Updated" },
    { id: "referredAt", name: "Referred" },
    { id: "nextFollowup", name: "Next Follow-up" },
    { id: "reEnquiredAt", name: "Re-Enquired" },
];

export const withDateRange = (
    filters: AdvancedFilters,
    dateType: DateFilterType,
    from: string,
    to: string,
): AdvancedFilters => {
    const [fromKey, toKey] =
        DATE_TYPE_FILTER_FIELDS[dateType] ||
        DATE_TYPE_FILTER_FIELDS.nextFollowup;

    return {
        ...filters,
        [fromKey]: from || "",
        [toKey]: to || "",
    };
};

const dateFieldValue = (
    lead: LeadRecord,
    dateType: DateFilterType,
) => {
    const map: Record<DateFilterType, string> = {
        addedAt: lead.addedAt,
        updatedAt: lead.updatedAt,
        referredAt: lead.referredAt,
        nextFollowup: lead.nextFollowupAt,
        reEnquiredAt: lead.reEnquiredAt,
    };

    return map[dateType] || "";
};

export const matchesDateRange = (
    lead: LeadRecord,
    dateType: DateFilterType,
    from: string,
    to: string,
) => {
    if (!from && !to) {
        return true;
    }

    const value = dateFieldValue(lead, dateType);

    if (!value) {
        return false;
    }

    const key = dateKey(value);

    return (
        (!from || key >= from) && (!to || key <= to)
    );
};

export const containsFilter = (
    value: string,
    search: string,
) => {
    if (!search) {
        return true;
    }

    return String(value || "")
        .toLowerCase()
        .includes(String(search).trim().toLowerCase());
};

export const phoneContainsFilter = (
    value: string,
    search: string,
) => {
    if (!search) {
        return true;
    }

    return String(value || "")
        .replace(/\D/g, "")
        .includes(String(search).replace(/\D/g, ""));
};

export const PAID_PAYMENT_STATUSES = [
    "paid",
    "settled",
    "success",
    "completed",
    "captured",
];

export const isPaid = (lead: LeadRecord) =>
    PAID_PAYMENT_STATUSES.includes(
        String(lead.paymentStatus || "").toLowerCase(),
    );

export const hasStudentId = (lead: LeadRecord) =>
    Boolean(String(lead.studentId || "").trim());

export const secondarySourcesOf = (lead: LeadRecord) =>
    (lead.sourceHistory || []).filter(entry => !entry.isPrimary);

export const matchesReferredFilter = (
    lead: LeadRecord,
    mode: string,
    myEmployeeId: string,
) => {
    if (!mode || !myEmployeeId) {
        return true;
    }

    const referredByMe =
        String(lead.referredByEmployeeId || "") ===
        String(myEmployeeId);
    const ownedByMe =
        String(lead.ownerEmployeeId || "") ===
        String(myEmployeeId);

    if (mode === "yes") {
        return referredByMe && !ownedByMe;
    }

    return !referredByMe && ownedByMe;
};

export const isPendingFollowupTillToday = (
    lead: LeadRecord,
) => {
    if (!lead.nextFollowupAt) {
        return false;
    }

    return dateKey(lead.nextFollowupAt) <= dateKey(
        new Date().toISOString(),
    );
};

const matchesSearch = (
    lead: LeadRecord,
    meta: LeadMeta,
    search: string,
) => {
    const term = search.trim().toLowerCase();

    if (!term) {
        return true;
    }

    return [
        lead.studentName,
        lead.leadId,
        lead.phone,
        lead.alternatePhone,
        lead.email,
        lead.parentName,
        lead.city,
        lead.branchName,
        displayNameOf(meta.classes, lead.classId),
        displayNameOf(meta.sources, lead.sourceId),
        displayNameOf(meta.stages, lead.stageId),
        employeeName(meta, lead.ownerEmployeeId),
    ].some(value =>
        String(value || "")
            .toLowerCase()
            .includes(term),
    );
};

const matchesMulti = (
    selected: string[],
    value: string,
) => !selected.length || selected.includes(String(value));

export const applyLeadFilters = (
    leads: LeadRecord[],
    meta: LeadMeta,
    search: string,
    filters: AdvancedFilters,
    options: {
        isCounsellor: boolean;
        currentEmployeeId: string;
        includePendingFollowups?: boolean;
    },
) =>
    leads.filter(lead => {
        const marketingSelected =
            filters.marketingCampaignId.length ||
            filters.marketingDeliveryStatus.length;

        return (
            matchesSearch(lead, meta, search) &&
            matchesMulti(filters.branchId, lead.branchId) &&
            matchesMulti(filters.sourceId, lead.sourceId) &&
            matchesMulti(
                filters.ownerEmployeeId,
                lead.ownerEmployeeId,
            ) &&
            matchesMulti(filters.classId, lead.classId) &&
            matchesMulti(
                filters.curriculumId,
                lead.curriculumId,
            ) &&
            matchesMulti(filters.stage, lead.stageId) &&
            matchesMulti(filters.substageId, lead.substageId) &&
            matchesMulti(filters.channelId, lead.channelId) &&
            matchesMulti(
                filters.channelCategory,
                meta.channels.find(
                    item =>
                        String(item.id) ===
                        String(lead.channelId),
                )?.category || "",
            ) &&
            matchesMulti(filters.campaignId, lead.campaignId) &&
            matchesMulti(
                filters.campaignCategory,
                meta.campaigns.find(
                    item =>
                        String(item.id) ===
                        String(lead.campaignId),
                )?.category || "",
            ) &&
            matchesMulti(
                filters.admissionTypeId,
                lead.admissionTypeId,
            ) &&
            matchesMulti(
                filters.referredByEmployeeId,
                lead.referredByEmployeeId,
            ) &&
            matchesMulti(filters.touchStatus, lead.touchStatus) &&
            matchesMulti(
                filters.leadEntryPath,
                lead.leadEntryPath,
            ) &&
            matchesMulti(
                filters.whatsappResponse,
                lead.whatsappResponse,
            ) &&
            (!filters.isParent.length ||
                filters.isParent.some(value =>
                    value === "yes"
                        ? lead.isParent
                        : !lead.isParent,
                )) &&
            (!filters.lookingForAdmission.length ||
                filters.lookingForAdmission.some(value =>
                    value === "yes"
                        ? lead.lookingForAdmission
                        : !lead.lookingForAdmission,
                )) &&
            (!filters.contactAvailability.length ||
                filters.contactAvailability.some(value =>
                    value === "email"
                        ? Boolean(lead.email)
                        : value === "alternatePhone"
                            ? Boolean(lead.alternatePhone)
                            : Boolean(lead.phone),
                )) &&
            (!filters.paymentStatus.length ||
                filters.paymentStatus.some(value =>
                    value === "yes"
                        ? isPaid(lead)
                        : value === "no"
                            ? !isPaid(lead)
                            : String(
                                lead.paymentStatus || "",
                            ).toLowerCase() === value,
                )) &&
            (!filters.studentIdStatus.length ||
                filters.studentIdStatus.some(value =>
                    value === "yes"
                        ? hasStudentId(lead)
                        : !hasStudentId(lead),
                )) &&
            (!marketingSelected ||
                lead.marketingDeliveries.some(
                    delivery =>
                        matchesMulti(
                            filters.marketingCampaignId,
                            delivery.campaignId,
                        ) &&
                        matchesMulti(
                            filters.marketingDeliveryStatus,
                            delivery.status,
                        ),
                )) &&
            containsFilter(
                lead.studentName,
                filters.studentName,
            ) &&
            phoneContainsFilter(
                lead.phone,
                filters.primaryPhone,
            ) &&
            phoneContainsFilter(
                lead.alternatePhone,
                filters.alternatePhone,
            ) &&
            containsFilter(lead.email, filters.email) &&
            containsFilter(
                lead.parentName,
                filters.parentName,
            ) &&
            (!filters.scoreMin ||
                Number(lead.leadScore) >=
                Number(filters.scoreMin)) &&
            (!filters.scoreMax ||
                Number(lead.leadScore) <=
                Number(filters.scoreMax)) &&
            (!options.isCounsellor ||
                matchesReferredFilter(
                    lead,
                    filters.isReferred,
                    options.currentEmployeeId,
                )) &&
            (options.includePendingFollowups === false ||
                !filters.pendingFollowupsOnly ||
                isPendingFollowupTillToday(lead)) &&
            matchesDateRange(
                lead,
                "addedAt",
                filters.addedFrom,
                filters.addedTo,
            ) &&
            matchesDateRange(
                lead,
                "updatedAt",
                filters.updatedFrom,
                filters.updatedTo,
            ) &&
            matchesDateRange(
                lead,
                "referredAt",
                filters.referredFrom,
                filters.referredTo,
            ) &&
            matchesDateRange(
                lead,
                "nextFollowup",
                filters.nextFollowupFrom,
                filters.nextFollowupTo,
            ) &&
            matchesDateRange(
                lead,
                "reEnquiredAt",
                filters.reEnquiredFrom,
                filters.reEnquiredTo,
            )
        );
    });

export const RE_ENQUIRED_TAB_ID = "re-enquired";

export const matchesStageTab = (
    lead: LeadRecord,
    tabId: string,
) => {
    if (!tabId || tabId === "all") {
        return true;
    }

    if (tabId === RE_ENQUIRED_TAB_ID) {
        return Boolean(lead.reEnquiredAt);
    }

    return String(lead.stageId) === String(tabId);
};

export interface AppliedFilterItem {
    label: string;
    values: string[];
}

export interface AppliedFilterGroup {
    title: string;
    items: AppliedFilterItem[];
}

const labelsFor = (
    values: string[],
    list: Array<{
        id: string;
        displayName?: string;
        name?: string;
    }>,
) =>
    values.map(
        value => displayNameOf(list, value) || value,
    );

export const buildAppliedFilterGroups = (
    meta: LeadMeta,
    search: string,
    filters: AdvancedFilters,
): AppliedFilterGroup[] => {
    const lead: AppliedFilterItem[] = [];
    const academic: AppliedFilterItem[] = [];
    const communication: AppliedFilterItem[] = [];
    const marketing: AppliedFilterItem[] = [];
    const dates: AppliedFilterItem[] = [];
    const ranges: AppliedFilterItem[] = [];

    const add = (
        target: AppliedFilterItem[],
        label: string,
        values: string[] | string,
    ) => {
        const list = Array.isArray(values)
            ? values.filter(Boolean)
            : values
                ? [values]
                : [];

        if (list.length) {
            target.push({ label, values: list });
        }
    };

    add(lead, "Search", search);
    add(lead, "Branch", labelsFor(filters.branchId, meta.branches));
    add(
        lead,
        "Touch status",
        filters.touchStatus.map(value =>
            value === "touched"
                ? "Is touched"
                : value === "untouched"
                    ? "Untouched"
                    : value,
        ),
    );
    add(
        lead,
        "Lead added via",
        filters.leadEntryPath.map(
            value =>
                ({
                    manual: "Manually added",
                    bulk_upload: "Bulk upload",
                    google_sheets: "Google Sheets",
                    integration:
                        "Integration (Facebook and others)",
                    website_form: "Website enquiry form",
                } as Record<string, string>)[value] || value,
        ),
    );
    add(
        lead,
        "Pending follow-ups",
        filters.pendingFollowupsOnly ? "Due through today" : "",
    );
    add(lead, "Current stage", labelsFor(filters.stage, meta.stages));
    add(
        lead,
        "Sub-stage",
        labelsFor(filters.substageId, meta.substages),
    );
    add(lead, "Lead source", labelsFor(filters.sourceId, meta.sources));
    add(
        lead,
        "Counsellor",
        labelsFor(filters.ownerEmployeeId, meta.employees),
    );
    add(lead, "Channel category", filters.channelCategory);
    add(lead, "Channel", labelsFor(filters.channelId, meta.channels));
    add(lead, "Campaign category", filters.campaignCategory);
    add(
        lead,
        "Campaign",
        labelsFor(filters.campaignId, meta.campaigns),
    );
    add(
        lead,
        "Payment status",
        filters.paymentStatus.map(
            value =>
                ({
                    yes: "Paid",
                    no: "Not paid",
                    order_created: "Order created",
                    unpaid: "Unpaid",
                    expired: "Expired",
                    failed: "Failed",
                } as Record<string, string>)[value] || value,
        ),
    );
    add(
        lead,
        "Student ID generated",
        filters.studentIdStatus.map(value =>
            value === "yes" ? "Generated" : "Not generated",
        ),
    );

    add(academic, "Class", labelsFor(filters.classId, meta.classes));
    add(
        academic,
        "Curriculum",
        labelsFor(filters.curriculumId, meta.curricula),
    );
    add(
        academic,
        "Admission type",
        labelsFor(filters.admissionTypeId, meta.admissionTypes),
    );
    add(
        academic,
        "Referred from",
        labelsFor(filters.referredByEmployeeId, meta.employees),
    );

    add(communication, "Student name", filters.studentName);
    add(communication, "Primary phone", filters.primaryPhone);
    add(communication, "Alternate phone", filters.alternatePhone);
    add(communication, "Email", filters.email);
    add(communication, "Parent name", filters.parentName);
    add(
        communication,
        "Parent",
        filters.isParent.map(value =>
            value === "yes" ? "Yes" : "No",
        ),
    );
    add(
        communication,
        "Looking for admission",
        filters.lookingForAdmission.map(value =>
            value === "yes" ? "Yes" : "No",
        ),
    );
    add(
        communication,
        "WhatsApp response",
        filters.whatsappResponse,
    );
    add(
        communication,
        "Contact availability",
        filters.contactAvailability.map(value =>
            value === "email"
                ? "Has email address"
                : value === "alternatePhone"
                    ? "Has alternate phone"
                    : "Has phone number",
        ),
    );

    add(
        marketing,
        "Bulk campaign",
        labelsFor(
            filters.marketingCampaignId,
            meta.marketingCampaigns,
        ),
    );
    add(
        marketing,
        "Delivery status",
        filters.marketingDeliveryStatus,
    );

    (
        [
            ["Added", filters.addedFrom, filters.addedTo],
            ["Updated", filters.updatedFrom, filters.updatedTo],
            ["Referred", filters.referredFrom, filters.referredTo],
            [
                "Next Follow-up",
                filters.nextFollowupFrom,
                filters.nextFollowupTo,
            ],
            [
                "Re-Enquired",
                filters.reEnquiredFrom,
                filters.reEnquiredTo,
            ],
        ] as Array<[string, string, string]>
    ).forEach(([label, from, to]) => {
        add(dates, `${label} from`, formatDate(from));
        add(dates, `${label} to`, formatDate(to));
    });

    add(ranges, "Minimum lead score", filters.scoreMin);
    add(ranges, "Maximum lead score", filters.scoreMax);

    return [
        { title: "Lead details", items: lead },
        { title: "Academic details", items: academic },
        { title: "Communication details", items: communication },
        { title: "Marketing campaigns", items: marketing },
        { title: "Date filters", items: dates },
        { title: "Range filters", items: ranges },
    ].filter(group => group.items.length);
};

const standardFieldKeys = new Set([
    "name",
    "student_name",
    "phone",
    "primary_phone",
    "alternate_phone",
    "email",
    "parent_name",
    "city",
    "academic_year",
    "branch_id",
    "admission_type_id",
    "curriculum_id",
    "class_id",
    "channel_id",
    "source_id",
    "campaign_id",
    "stage_id",
    "substage_id",
    "owner_employee_id",
    "next_followup_at_utc",
    "followup_type",
    "remarks",
    "lead_score",
]);

export const buildLeadExportGroups = (
    meta: LeadMeta,
): ExportFieldGroup[] => {
    const base = [
        {
            id: "leadId",
            label: "Lead ID",
            group: "Lead details",
            defaultSelected: true,
            getValue: (lead: LeadRecord) => lead.leadId,
        },
        {
            id: "studentName",
            label: "Student name",
            group: "Lead details",
            defaultSelected: true,
            getValue: (lead: LeadRecord) => lead.studentName,
        },
        {
            id: "studentId",
            label: "Student ID",
            group: "Lead details",
            getValue: (lead: LeadRecord) => lead.studentId,
        },
        {
            id: "studentIdGenerated",
            label: "Student ID generated",
            group: "Lead details",
            defaultSelected: true,
            getValue: (lead: LeadRecord) =>
                hasStudentId(lead) ? "Yes" : "No",
        },
        {
            id: "paymentDone",
            label: "Payment status",
            group: "Lead details",
            defaultSelected: true,
            getValue: (lead: LeadRecord) =>
                isPaid(lead) ? "Yes" : "No",
        },
        {
            id: "paymentAmount",
            label: "Payment amount",
            group: "Lead details",
            getValue: (lead: LeadRecord) =>
                isPaid(lead)
                    ? String(lead.paymentAmount || 0)
                    : "",
        },
        {
            id: "primaryPhone",
            label: "Primary phone",
            group: "Communication details",
            defaultSelected: true,
            getValue: (lead: LeadRecord) => lead.phone,
        },
        {
            id: "alternatePhone",
            label: "Alternate phone",
            group: "Communication details",
            getValue: (lead: LeadRecord) => lead.alternatePhone,
        },
        {
            id: "email",
            label: "Email",
            group: "Communication details",
            getValue: (lead: LeadRecord) => lead.email,
        },
        {
            id: "parentName",
            label: "Parent name",
            group: "Family & address details",
            getValue: (lead: LeadRecord) => lead.parentName,
        },
        {
            id: "city",
            label: "City",
            group: "Family & address details",
            getValue: (lead: LeadRecord) => lead.city,
        },
        {
            id: "branch",
            label: "Branch",
            group: "Academic details",
            defaultSelected: true,
            getValue: (lead: LeadRecord) => lead.branchName,
        },
        {
            id: "academicYear",
            label: "Academic year",
            group: "Academic details",
            getValue: (lead: LeadRecord) => lead.academicYear,
        },
        {
            id: "class",
            label: "Class",
            group: "Academic details",
            defaultSelected: true,
            getValue: (lead: LeadRecord) =>
                displayNameOf(meta.classes, lead.classId),
        },
        {
            id: "curriculum",
            label: "Curriculum",
            group: "Academic details",
            defaultSelected: true,
            getValue: (lead: LeadRecord) =>
                displayNameOf(meta.curricula, lead.curriculumId),
        },
        {
            id: "admissionType",
            label: "Admission type",
            group: "Academic details",
            getValue: (lead: LeadRecord) =>
                displayNameOf(
                    meta.admissionTypes,
                    lead.admissionTypeId,
                ),
        },
        {
            id: "stage",
            label: "Stage",
            group: "Lead journey details",
            defaultSelected: true,
            getValue: (lead: LeadRecord) =>
                displayNameOf(meta.stages, lead.stageId),
        },
        {
            id: "substage",
            label: "Sub-stage",
            group: "Lead journey details",
            getValue: (lead: LeadRecord) =>
                displayNameOf(meta.substages, lead.substageId),
        },
        {
            id: "source",
            label: "Source",
            group: "Source details",
            getValue: (lead: LeadRecord) =>
                displayNameOf(meta.sources, lead.sourceId),
        },
        {
            id: "secondarySources",
            label: "Secondary sources",
            group: "Source details",
            getValue: (lead: LeadRecord) =>
                secondarySourcesOf(lead)
                    .map(entry => entry.source)
                    .filter(Boolean)
                    .join(", "),
        },
        {
            id: "allSources",
            label: "All sources",
            group: "Source details",
            getValue: (lead: LeadRecord) =>
                (lead.sourceHistory || [])
                    .map(entry => entry.source)
                    .filter(Boolean)
                    .join(", "),
        },
        {
            id: "sourceCount",
            label: "Source count",
            group: "Source details",
            getValue: (lead: LeadRecord) =>
                String((lead.sourceHistory || []).length),
        },
        {
            id: "channel",
            label: "Channel",
            group: "Source details",
            getValue: (lead: LeadRecord) =>
                displayNameOf(meta.channels, lead.channelId),
        },
        {
            id: "campaign",
            label: "Campaign",
            group: "Source details",
            getValue: (lead: LeadRecord) =>
                displayNameOf(meta.campaigns, lead.campaignId),
        },
        {
            id: "owner",
            label: "Counsellor",
            group: "Lead ownership",
            defaultSelected: true,
            getValue: (lead: LeadRecord) =>
                employeeName(meta, lead.ownerEmployeeId) ||
                "Unassigned",
        },
        {
            id: "touchStatus",
            label: "Touch status",
            group: "Lead ownership",
            getValue: (lead: LeadRecord) => lead.touchStatus,
        },
        {
            id: "score",
            label: "Lead score",
            group: "Lead ownership",
            getValue: (lead: LeadRecord) =>
                String(lead.leadScore ?? ""),
        },
        {
            id: "remarks",
            label: "Remarks",
            group: "Lead journey details",
            getValue: (lead: LeadRecord) => lead.remarks,
        },
        {
            id: "addedAt",
            label: "Added on",
            group: "Date details",
            defaultSelected: true,
            getValue: (lead: LeadRecord) =>
                formatDateTime(lead.addedAt),
        },
        {
            id: "updatedAt",
            label: "Updated on",
            group: "Date details",
            defaultSelected: true,
            getValue: (lead: LeadRecord) =>
                formatDateTime(lead.updatedAt),
        },
        {
            id: "referredAt",
            label: "Referred on",
            group: "Date details",
            getValue: (lead: LeadRecord) =>
                formatDateTime(lead.referredAt),
        },
        {
            id: "nextFollowup",
            label: "Next follow-up",
            group: "Date details",
            getValue: (lead: LeadRecord) =>
                formatDateTime(lead.nextFollowupAt),
        },
        {
            id: "reEnquiredAt",
            label: "Re-enquired on",
            group: "Date details",
            getValue: (lead: LeadRecord) =>
                formatDateTime(lead.reEnquiredAt),
        },
        {
            id: "recentComments",
            label: "Recent comments (last 5)",
            group: "Lead journey details",
            getValue: (lead: LeadRecord) =>
                [...lead.comments]
                    .slice(-5)
                    .reverse()
                    .map(
                        comment =>
                            `${comment.counsellorName || "CRM user"}: ${String(
                                comment.commentText || "",
                            )
                                .replace(/\s*\r?\n\s*/g, " ")
                                .trim()}`,
                    )
                    .join("\n"),
        },
    ];

    const custom = meta.leadFields
        .filter(
            field =>
                field.fieldKey &&
                !standardFieldKeys.has(field.fieldKey),
        )
        .map(field => ({
            id: `custom:${field.fieldKey}`,
            label: field.displayName,
            group: "Configured custom fields",
            getValue: (lead: LeadRecord) =>
                lead.customValues?.[field.fieldKey] || "",
        }));

    const byGroup = [...base, ...custom].reduce(
        (accumulator, field) => {
            if (!accumulator[field.group]) {
                accumulator[field.group] = [];
            }

            accumulator[field.group].push(field);

            return accumulator;
        },
        {} as Record<string, ExportFieldGroup["fields"]>,
    );

    return Object.entries(byGroup).map(([name, fields]) => ({
        name,
        fields,
    }));
};

const stageColorMap: Record<string, string> = {
    new: "new",
    notconnected: "waring",
    campusvisit: "inprogress",
    application: "inprogress",
    admissiondone: "active",
    notinterested: "rejected",
    lost: "rejected",
};

const stageBadgeType = (stageName: string) =>
    stageColorMap[
    stageName.split(" ").join("").toLowerCase()
    ] || "default";

const initialsOf = (studentName: string) =>
    studentName
        .trim()
        .split(" ")
        .map(part => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase() || "-";

const avatarClassName = (touchStatus: string) =>
    touchStatus === "touched"
        ? "tw-bg-green-100 tw-text-green-700 tw-border-green-200"
        : touchStatus === "untouched"
            ? "tw-bg-red-100 tw-text-red-700 tw-border-red-200"
            : "tw-bg-gray-100 tw-text-gray-600 tw-border-gray-200";

export interface LeadRowHandlers {
    onView: (lead: LeadRecord) => void;
    onToggleParked: (lead: LeadRecord) => void;
    onCall: (lead: LeadRecord) => void;
    onMessage: (lead: LeadRecord) => void;
    onEmail: (lead: LeadRecord) => void;
    onHistory: (lead: LeadRecord) => void;
    onFollowup: (lead: LeadRecord) => void;
    onEdit: (lead: LeadRecord) => void;
    onChangeStage: (lead: LeadRecord) => void;
    onRefer: (lead: LeadRecord) => void;
    onRemove: (lead: LeadRecord) => void;
}

const IconAction = ({
    title,
    icon,
    badge,
    badgeClassName,
    onClick,
}: {
    title: string;
    icon: typeof CallIcon;
    badge?: number;
    badgeClassName?: string;
    onClick: () => void;
}) => (
    <Button
        type="button"
        variant="secondary"
        title={title}
        aria-label={title}
        onClick={onClick}
        className="tw-relative !tw-h-8 !tw-w-8 !tw-p-0 tw-border tw-border-gray-200 !tw-bg-white hover:!tw-bg-gray-50"
    >
        <HugeiconsIcon
            icon={icon}
            className="text-muted"
            size={17}
        />
        {Boolean(badge) && (
            <span
                className={`tw-absolute -tw-right-1.5 -tw-top-1.5 tw-flex tw-h-4 tw-min-w-4 tw-items-center tw-justify-center tw-rounded-full tw-px-1 tw-text-[9px] tw-font-semibold tw-leading-none tw-text-white ${badgeClassName || "tw-bg-[#c33d35]"}`}
            >
                {Number(badge) > 99 ? "99+" : badge}
            </span>
        )}
    </Button>
);

const LeadRowActions = ({
    lead,
    handlers,
}: {
    lead: LeadRecord;
    handlers: LeadRowHandlers;
}) => (
    <div className="tw-flex tw-items-center tw-gap-1.5">
        <IconAction
            title={`Call ${lead.studentName}`}
            icon={CallIcon}
            onClick={() => handlers.onCall(lead)}
        />
        <IconAction
            title={`Send WhatsApp message to ${lead.studentName}`}
            icon={WhatsappIcon}
            badge={lead.unreadMessageCount}
            badgeClassName="tw-bg-[#034932]"
            onClick={() => handlers.onMessage(lead)}
        />
        <IconAction
            title={`Send email to ${lead.studentName}`}
            icon={Mail01Icon}
            onClick={() => handlers.onEmail(lead)}
        />
        <IconAction
            title={`${lead.remarksCount} remarks · Lead history`}
            icon={Clock01Icon}
            badge={lead.remarksCount}
            onClick={() => handlers.onHistory(lead)}
        />
        <IconAction
            title={`Follow-up and notes for ${lead.studentName}`}
            icon={NoteEditIcon}
            onClick={() => handlers.onFollowup(lead)}
        />
        <MoreActions
            rowId={lead.id}
            isHorizontal
            actionOptions={[
                {
                    id: "edit",
                    actionName: "Edit",
                    actionIcon: (
                        <HugeiconsIcon
                            icon={PencilEdit02Icon}
                            className="text-muted tw-me-2"
                            size={16}
                        />
                    ),
                    onClickHndlr: () => handlers.onEdit(lead),
                },
                {
                    id: "change-stage",
                    actionName: "Change Stage",
                    actionIcon: (
                        <HugeiconsIcon
                            icon={GitMergeIcon}
                            className="text-muted tw-me-2"
                            size={16}
                        />
                    ),
                    onClickHndlr: () =>
                        handlers.onChangeStage(lead),
                },
                {
                    id: "refer",
                    actionName: "Refer",
                    actionIcon: (
                        <HugeiconsIcon
                            icon={LinkForwardIcon}
                            className="text-muted tw-me-2"
                            size={16}
                        />
                    ),
                    onClickHndlr: () => handlers.onRefer(lead),
                },
                {
                    id: "remove",
                    actionName: "Remove",
                    actionIcon: (
                        <HugeiconsIcon
                            icon={Delete02Icon}
                            className="text-danger tw-me-2"
                            size={16}
                        />
                    ),
                    onClickHndlr: () => handlers.onRemove(lead),
                },
            ]}
        />
    </div>
);

export const generateColumns = (
    meta: LeadMeta,
    handlers: LeadRowHandlers,
) => [
        {
            Header: "",
            accessor: "parkedAt",
            disableSortBy: true,
            Cell: ({
                row: { original },
            }: {
                row: { original: LeadRecord };
            }) => {
                const isParked = Boolean(original.parkedAt);

                return (
                    <Button
                        type="button"
                        variant="secondary"
                        aria-pressed={isParked}
                        title={
                            isParked
                                ? `Parked · remove ${original.studentName} from the parked list`
                                : `Park ${original.studentName} to follow up later`
                        }
                        aria-label={
                            isParked
                                ? `Remove ${original.studentName} from the parked list`
                                : `Park ${original.studentName}`
                        }
                        onClick={() =>
                            handlers.onToggleParked(original)
                        }
                        className={`!tw-h-8 !tw-w-8 !tw-p-0 tw-border ${isParked
                            ? "tw-border-amber-200 !tw-bg-amber-50 hover:!tw-bg-amber-100"
                            : "tw-border-gray-200 !tw-bg-white hover:!tw-bg-gray-50"
                            }`}
                    >
                        <HugeiconsIcon
                            icon={
                                isParked
                                    ? Bookmark03Icon
                                    : Bookmark01Icon
                            }
                            className={
                                isParked
                                    ? "tw-text-amber-600"
                                    : "text-muted"
                            }
                            size={17}
                        />
                    </Button>
                );
            },
        },
        {
            Header: "Student",
            accessor: "studentName",
            disableSortBy: true,
            Cell: ({
                row: { original },
            }: {
                row: { original: LeadRecord };
            }) => (
                <div className="tw-flex tw-items-center">
                    <Button
                        type="button"
                        variant="secondary"
                        title={`View ${original.studentName}`}
                        onClick={() => handlers.onView(original)}
                        className={`tw-me-2 !tw-h-8 !tw-w-8 !tw-p-0 tw-flex-shrink-0 tw-border !tw-text-xs tw-font-semibold ${avatarClassName(original.touchStatus)}`}
                    >
                        {initialsOf(original.studentName)}
                    </Button>
                    <UserDetails
                        displayName={original.studentName}
                        displayId={original.phone}
                        showAvatar={false}
                    />
                </div>
            ),
        },
        {
            Header: "Class / Branch",
            accessor: "classId",
            disableSortBy: true,
            Cell: ({
                row: { original },
            }: {
                row: { original: LeadRecord };
            }) => (
                <UserDetails
                    displayName={
                        [
                            displayNameOf(
                                meta.curricula,
                                original.curriculumId,
                            ),
                            displayNameOf(
                                meta.classes,
                                original.classId,
                            ),
                        ]
                            .filter(Boolean)
                            .join(" - ") || "-"
                    }
                    displayId={original.branchName || "-"}
                    showAvatar={false}
                />
            ),
        },
        {
            Header: "Source",
            accessor: "sourceId",
            disableSortBy: true,
            Cell: ({
                row: { original },
            }: {
                row: { original: LeadRecord };
            }) => {
                const secondary = secondarySourcesOf(original);

                return (
                    <div className="tw-flex tw-items-start tw-gap-1">
                        <UserDetails
                            displayName={
                                displayNameOf(
                                    meta.sources,
                                    original.sourceId,
                                ) || "-"
                            }
                            displayId={
                                formatDateTime(original.addedAt) ||
                                "-"
                            }
                            showAvatar={false}
                        />
                        {secondary.length > 0 && (
                            <span
                                className="badge badge-soft-secondary"
                                title={`Also from: ${secondary
                                    .map(entry => entry.source)
                                    .join(", ")}`}
                            >
                                +{secondary.length}
                            </span>
                        )}
                    </div>
                );
            },
        },
        {
            Header: "Stage",
            accessor: "stageId",
            disableSortBy: true,
            Cell: ({
                row: { original },
            }: {
                row: { original: LeadRecord };
            }) => {
                const stageName = displayNameOf(
                    meta.stages,
                    original.stageId,
                );

                return (
                    <StatusLabel
                        type={stageBadgeType(stageName)}
                        labelName={
                            stageLabelFor(meta, original.stageId) ||
                            "-"
                        }
                    />
                );
            },
        },
        {
            Header: "Payment",
            accessor: "paymentStatus",
            disableSortBy: true,
            Cell: ({
                row: { original },
            }: {
                row: { original: LeadRecord };
            }) => (
                <div>
                    <StatusLabel
                        type={isPaid(original) ? "active" : "inactive"}
                        labelName={isPaid(original) ? "Yes" : "No"}
                    />
                    {isPaid(original) &&
                        Number(original.paymentAmount) > 0 && (
                            <p className="tw-mb-0 tw-text-xs tw-text-gray-500">
                                ₹
                                {Number(
                                    original.paymentAmount,
                                ).toLocaleString("en-IN")}
                            </p>
                        )}
                </div>
            ),
        },
        {
            Header: "Student ID",
            accessor: "studentId",
            disableSortBy: true,
            Cell: ({
                row: { original },
            }: {
                row: { original: LeadRecord };
            }) => (
                <div>
                    <StatusLabel
                        type={
                            hasStudentId(original)
                                ? "active"
                                : "inactive"
                        }
                        labelName={
                            hasStudentId(original) ? "Yes" : "No"
                        }
                    />
                    {hasStudentId(original) && (
                        <p className="tw-mb-0 tw-font-mono tw-text-xs tw-text-gray-500">
                            {original.studentId}
                        </p>
                    )}
                </div>
            ),
        },
        {
            Header: "Owner",
            accessor: "ownerEmployeeId",
            disableSortBy: true,
            Cell: ({
                row: { original },
            }: {
                row: { original: LeadRecord };
            }) => (
                <span>
                    {employeeName(
                        meta,
                        original.ownerEmployeeId,
                    ) || "Unassigned"}
                </span>
            ),
        },
        {
            Header: "Next follow-up",
            accessor: "nextFollowupAt",
            disableSortBy: true,
            Cell: ({
                row: { original },
            }: {
                row: { original: LeadRecord };
            }) => (
                <span>
                    {formatDateTime(original.nextFollowupAt) ||
                        "Not scheduled"}
                </span>
            ),
        },
        {
            Header: "Recent modified",
            accessor: "recentModifiedAt",
            disableSortBy: true,
            Cell: ({
                row: { original },
            }: {
                row: { original: LeadRecord };
            }) => (
                <span>
                    {formatDateTime(original.recentModifiedAt) ||
                        "-"}
                </span>
            ),
        },
        {
            Header: "Actions",
            disableSortBy: true,
            Cell: ({
                row: { original },
            }: {
                row: { original: LeadRecord };
            }) => (
                <LeadRowActions
                    lead={original}
                    handlers={handlers}
                />
            ),
        },
    ];

export interface LeadHistoryMilestone {
    id: string;
    labelName: string;
    dateText: string;
    timeText: string;
    relativeText: string;
    emptyText: string;
    isCompleted: boolean;
}

const buildMilestone = (
    id: string,
    labelName: string,
    value: string,
    emptyText: string,
): LeadHistoryMilestone => {
    const formatted = formatDateTime(value);
    const [datePart = "", timePart = ""] =
        formatted.split(", ");

    return {
        id,
        labelName,
        dateText: datePart,
        timeText: timePart,
        relativeText: relativeText(value),
        emptyText,
        isCompleted: Boolean(formatted),
    };
};

export const buildLeadMilestones = (
    lead: LeadRecord,
): LeadHistoryMilestone[] => [
        buildMilestone(
            "added",
            "Added",
            lead.addedAt,
            "Not recorded",
        ),
        buildMilestone(
            "updated",
            "Updated",
            lead.updatedAt,
            "Not recorded",
        ),
        buildMilestone(
            "referred",
            "Referred",
            lead.referredAt,
            "Not recorded",
        ),
        buildMilestone(
            "re-enquired",
            "Re-enquired",
            lead.reEnquiredAt,
            "Not recorded",
        ),
        buildMilestone(
            "next-follow-up",
            "Next follow-up",
            lead.nextFollowupAt,
            "Not scheduled",
        ),
    ];

export const leadActivityFilterOptions = [
    { id: "all", name: "All activity" },
    { id: "stage", name: "Stage changes" },
    { id: "followup", name: "Follow-ups" },
    { id: "communication", name: "Communication" },
    { id: "referral", name: "Referrals" },
    { id: "workflow", name: "Workflows" },
];

export const activityFilterGroupMap: Record<string, string> = {
    created: "stage",
    stage: "stage",
    followup: "followup",
    communication: "communication",
    referral: "referral",
    workflow: "workflow",
};

export const buildStageTabs = (
    leads: LeadRecord[],
    selectedStageIds: string[] = [],
    meta: LeadMeta = leadMeta,
) => [
        {
            id: "all",
            labelName: "All",
            count: leads.length,
            customPadding: "0px 16px",
        },
        ...meta.stages
            .filter(
                stage =>
                    !selectedStageIds.length ||
                    selectedStageIds.includes(String(stage.id)),
            )
            .map(stage => ({
                id: stage.id,
                labelName: stage.displayName,
                count: leads.filter(
                    lead =>
                        String(lead.stageId) ===
                        String(stage.id),
                ).length,
                customPadding: "0px 16px",
            })),
        {
            id: RE_ENQUIRED_TAB_ID,
            labelName: "Re-enquired",
            count: leads.filter(lead =>
                Boolean(lead.reEnquiredAt),
            ).length,
            customPadding: "0px 16px",
        },
    ];
