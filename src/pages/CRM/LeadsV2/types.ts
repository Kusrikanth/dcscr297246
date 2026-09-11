export interface Option {
    id: string;
    name: string;
}

export interface Branch {
    id: string;
    name: string;
}

export interface AcademicYear {
    id: string;
    academicYear: string;
    displayName: string;
}

export interface AdmissionType {
    id: string;
    displayName: string;
    academicYear: string;
    branchIds: string[];
}

export interface Curriculum {
    id: string;
    displayName: string;
    academicYear: string;
    branchIds: string[];
    admissionTypeIds: string[];
}

export interface ClassOption {
    id: string;
    displayName: string;
    academicYear: string;
    branchIds: string[];
    admissionTypeIds: string[];
    curriculumId: string;
}

export interface Channel {
    id: string;
    displayName: string;
    category: string;
}

export interface Source {
    id: string;
    displayName: string;
}

export interface SourceLink {
    channelId: string;
    sourceId: string;
}

export interface Campaign {
    id: string;
    displayName: string;
    category: string;
}

export interface CampaignLink {
    sourceId: string;
    campaignId: string;
}

export interface Stage {
    id: string;
    displayName: string;
    requiresFollowup: boolean;
    pipelineId: string;
}

export interface SubStage {
    id: string;
    displayName: string;
    stageId: string;
}

export interface Employee {
    id: string;
    name: string;
    branchId: string;
    branchName: string;
}

export interface MarketingCampaign {
    id: string;
    name: string;
}

export type LeadFieldType =
    | "text"
    | "textarea"
    | "phone"
    | "email"
    | "number"
    | "decimal"
    | "date"
    | "datetime"
    | "boolean"
    | "single_select"
    | "multi_select";

export interface LeadField {
    id: string;
    fieldKey: string;
    displayName: string;
    fieldType: LeadFieldType;
    isRequired: boolean;
    placeholder?: string;
    options?: string[];
}

export interface LeadMeta {
    branches: Branch[];
    pipelines: Array<{
        id: string;
        displayName: string;
        isDefault: boolean;
    }>;
    academicYears: AcademicYear[];
    admissionTypes: AdmissionType[];
    curricula: Curriculum[];
    classes: ClassOption[];
    channels: Channel[];
    sources: Source[];
    sourceLinks: SourceLink[];
    campaigns: Campaign[];
    campaignLinks: CampaignLink[];
    stages: Stage[];
    substages: SubStage[];
    employees: Employee[];
    marketingCampaigns: MarketingCampaign[];
    leadFields: LeadField[];
    manualLeadDefaults: {
        stageId?: string;
        substageId?: string;
        channelId?: string;
        sourceId?: string;
        campaignId?: string;
    };
}

export type TouchStatus = "touched" | "untouched" | "unassigned";

export interface SourceHistoryEntry {
    id: string;
    isPrimary: boolean;
    academicYear: string;
    channel: string;
    source: string;
    campaign: string;
    addedBy: string;
    createdAt: string;
}

export interface LeadComment {
    id: string;
    counsellorName: string;
    commentText: string;
    createdAt: string;
}

export type LeadActivityType =
    | "created"
    | "stage"
    | "followup"
    | "communication"
    | "workflow"
    | "referral";

export interface LeadActivity {
    id: string;
    type: LeadActivityType;
    title: string;
    performedBy: string;
    description: string;
    createdAt: string;
}

export interface MarketingDelivery {
    campaignId: string;
    status: string;
}


export interface LeadRecord {
    id: string;
    leadId: string;
    studentId: string;

    studentName: string;
    phone: string;
    alternatePhone: string;
    email: string;
    parentName: string;
    city: string;

    academicYear: string;
    branchId: string;
    branchName: string;
    admissionTypeId: string;
    curriculumId: string;
    classId: string;

    channelId: string;
    sourceId: string;
    campaignId: string;

    pipelineId: string;
    stageId: string;
    substageId: string;
    ownerEmployeeId: string;
    referredByEmployeeId: string;
    referredToBranchId: string;

    nextFollowupAt: string;
    followupType: string;
    remarks: string;
    leadScore: number;

    touchStatus: TouchStatus;
    leadEntryPath: string;
    paymentStatus: string;
    paymentAmount: number;
    paymentAt: string;
    whatsappResponse: string;
    isParent: boolean;
    lookingForAdmission: boolean;
    remarksCount: number;
    unreadMessageCount: number;

    addedAt: string;
    updatedAt: string;
    referredAt: string;
    reEnquiredAt: string;
    recentModifiedAt: string;
    parkedAt: string;

    formName: string;
    formPageName: string;

    customValues: Record<string, string>;
    marketingDeliveries: MarketingDelivery[];
    sourceHistory: SourceHistoryEntry[];
    formResponses: Array<{
        question: string;
        answer: string;
    }>;
    audiences: Array<{
        audienceId: string;
        name: string;
        audienceStatus: string;
        metaAudienceId: string;
        matchKeys: string;
        syncStatus: string;
        lastSyncedAt: string;
    }>;
    comments: LeadComment[];
    activities: LeadActivity[];
}

export interface AdvancedFilters {
    branchId: string[];
    stage: string[];
    substageId: string[];
    sourceId: string[];
    channelId: string[];
    channelCategory: string[];
    campaignId: string[];
    campaignCategory: string[];
    marketingCampaignId: string[];
    marketingDeliveryStatus: string[];
    ownerEmployeeId: string[];
    classId: string[];
    curriculumId: string[];
    admissionTypeId: string[];
    referredByEmployeeId: string[];
    touchStatus: string[];
    leadEntryPath: string[];
    isParent: string[];
    lookingForAdmission: string[];
    whatsappResponse: string[];
    contactAvailability: string[];
    paymentStatus: string[];
    studentIdStatus: string[];

    studentName: string;
    primaryPhone: string;
    alternatePhone: string;
    email: string;
    parentName: string;

    scoreMin: string;
    scoreMax: string;
    isReferred: string;

    addedFrom: string;
    addedTo: string;
    updatedFrom: string;
    updatedTo: string;
    referredFrom: string;
    referredTo: string;
    nextFollowupFrom: string;
    nextFollowupTo: string;
    reEnquiredFrom: string;
    reEnquiredTo: string;

    pendingFollowupsOnly: boolean;
}

export type DateFilterType =
    | "addedAt"
    | "updatedAt"
    | "referredAt"
    | "nextFollowup"
    | "reEnquiredAt";

export interface SavedView {
    id: string;
    name: string;
    type: "filter" | "funnel";
    filters: AdvancedFilters;
}

export interface ExportField {
    id: string;
    label: string;
    group: string;
    defaultSelected?: boolean;
    getValue: (lead: LeadRecord) => string;
}

export interface ExportFieldGroup {
    name: string;
    fields: ExportField[];
}
