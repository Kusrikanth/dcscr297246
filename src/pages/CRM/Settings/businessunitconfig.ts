import { settingsBranches, type SettingsOption } from "./helper";

export interface ConfigItem {
    id: string;
    displayName: string;
    isActive: boolean;
    code?: string;
    position?: number;
    categoryId?: string;
}

export interface LeadField {
    id: string;
    fieldKey: string;
    displayName: string;
    fieldType: string;
    placeholder: string;
    options: Array<string>;
    isSystem: boolean;
    isRequired: boolean;
    showInList: boolean;
    isFilterable: boolean;
    filterControl: string;
    isSearchable: boolean;
    isImportable: boolean;
    isImportRequired: boolean;
    importHeader: string;
    importSampleValue: string;
    useInLeadForm: boolean;
    useInQuickCreate: boolean;
    useInLeadDetails: boolean;
    useInReports: boolean;
    useInAutomations: boolean;
    columnWidth: number;
    optionsSectionId?: string;
    optionsSectionLevel?: string;
}

export interface PipelineStage extends ConfigItem {
    stageType: string;
    color: string;
    position: number;
    requiresFollowup: boolean;
    pipelineId: string;
    isAdmissionStage: boolean;
}

export interface PipelineSubstage extends ConfigItem {
    stageId: string;
    position: number;
}

export interface TrackerStatus extends ConfigItem {
    stageType: string;
    color: string;
    position: number;
}

export interface UnitBranch {
    id: string;
    name: string;
    shortName: string;
    isActive: boolean;
    callerdeskDidNumber: string;
    callerdeskDidId: string;
    callerdeskCallGroup: string;
    callerdeskInboundEnabled: boolean;
    callerdeskOutboundEnabled: boolean;
    smartfloDidNumber: string;
    smartfloDidId: string;
    smartfloIvrId: string;
    smartfloIvrName: string;
    smartfloDepartmentId: string;
    smartfloInboundEnabled: boolean;
    smartfloOutboundEnabled: boolean;
    jodoBaseUrl: string;
    jodoCollectorCode: string;
    hasJodoApiKey: boolean;
    hasJodoSecretKey: boolean;
    hasJodoAuthHeader: boolean;
    pipelineIds: Array<string>;
    whatsappAccountIds: Array<string>;
    whatsappDefaultAccountId: string;
    whatsappAutoCreateLead: boolean;
    whatsappAssignmentMode: string;
    whatsappOwnerEmployeeId: string;
    whatsappIntakeBranchId: string;
}

export interface LeadSource extends ConfigItem {
    channelId: string;
}

export interface AcademicYear {
    academicYear: string;
    displayName: string;
    isActive: boolean;
}

export const leadFieldCatalogue = [
    {
        key: "branch_id",
        label: "Branch",
        group: "Lead routing",
        fieldType: "single_select",
        columnWidth: 160,
        isSearchable: false,
        sourceLabel: "Branches configured for this unit",
    },
    {
        key: "stage_id",
        label: "Stage",
        group: "Lead routing",
        fieldType: "single_select",
        columnWidth: 160,
        isSearchable: false,
        sourceLabel: "Pipeline stages",
    },
    {
        key: "substage_id",
        label: "Sub-stage",
        group: "Lead routing",
        fieldType: "single_select",
        columnWidth: 160,
        isSearchable: false,
        sourceLabel: "Pipeline sub-stages",
    },
    {
        key: "owner_employee_id",
        label: "Counsellor",
        group: "Lead routing",
        fieldType: "user",
        columnWidth: 180,
        isSearchable: true,
        sourceLabel: "Employees",
    },
    {
        key: "next_followup_at",
        label: "Next Follow-up",
        group: "Follow-up",
        fieldType: "datetime",
        columnWidth: 180,
        isSearchable: false,
        sourceLabel: "The follow-up schedule",
    },
    {
        key: "alternate_phone",
        label: "Alternate Phone",
        group: "Contact",
        fieldType: "phone",
        columnWidth: 150,
        isSearchable: true,
        sourceLabel: "What the counsellor types",
    },
    {
        key: "academic_year",
        label: "Academic Year",
        group: "Academic",
        fieldType: "single_select",
        columnWidth: 140,
        isSearchable: false,
        sourceLabel: "Academic years",
    },
    {
        key: "admission_type_id",
        label: "Admission Type",
        group: "Academic",
        fieldType: "single_select",
        columnWidth: 160,
        isSearchable: false,
        sourceLabel: "Admission types",
    },
];

export interface BusinessUnitConfig {
    fields: Array<LeadField>;
    leadPipelines: Array<{
        id: string;
        displayName: string;
        description: string;
        isDefault: boolean;
        isActive: boolean;
    }>;
    duplicateFields: Array<{
        key: string;
        label: string;
        group: string;
    }>;
    duplicateRule: Array<string>;
    pipelineStages: Array<PipelineStage>;
    leadSubstages: Array<PipelineSubstage>;
    trackerStatuses: Array<TrackerStatus>;
    branches: Array<UnitBranch>;
    channelCategories: Array<ConfigItem>;
    channels: Array<ConfigItem>;
    sources: Array<LeadSource>;
    campaignCategories: Array<ConfigItem>;
    campaigns: Array<ConfigItem>;
    academicYears: Array<AcademicYear>;
    admissionTypes: Array<ConfigItem>;
    admissionClasses: Array<ConfigItem>;
    curriculums: Array<ConfigItem>;
    admissionClassConfigs: Array<{
        id: string;
        academicYear: string;
        branchId: string;
        curriculumId: string;
        admissionTypeId: string;
        classIds: Array<string>;
    }>;
    databaseTables: Array<{
        tableName: string;
        rowCount: number;
        columns: Array<string>;
        rows: Array<Record<string, string>>;
    }>;
    manualLeadDefaults: {
        stageId: string;
        substageId: string;
        channelId: string;
        sourceId: string;
        campaignId: string;
    };
}

export const leadFieldTypes: Array<SettingsOption> = [
    "text",
    "textarea",
    "number",
    "decimal",
    "date",
    "datetime",
    "email",
    "phone",
    "boolean",
    "single_select",
    "multi_select",
    "user",
    "file",
].map(type => ({ id: type, name: type.replace(/_/g, " ") }));

export const stageTypeOptions: Array<SettingsOption> = [
    { id: "open", name: "Open / active" },
    { id: "on_hold", name: "On hold" },
    { id: "completed", name: "Completed" },
    { id: "cancelled", name: "Cancelled" },
];

export const filterControlOptions = (fieldType: string): Array<SettingsOption> => {
    if (["date", "datetime"].includes(fieldType)) {
        return [
            { id: "date", name: "Single date" },
            { id: "date_range", name: "Date range" },
        ];
    }

    if (["number", "decimal"].includes(fieldType)) {
        return [
            { id: "exact", name: "Exact value" },
            { id: "number_range", name: "Number range" },
        ];
    }

    if (fieldType === "boolean") {
        return [{ id: "boolean", name: "Yes / No" }];
    }

    if (["single_select", "multi_select", "user"].includes(fieldType)) {
        return [
            { id: "single_select", name: "Single select" },
            { id: "multi_select", name: "Multi-select" },
        ];
    }

    return [
        { id: "contains", name: "Contains text" },
        { id: "exact", name: "Exact match" },
        { id: "single_select", name: "Single select" },
        { id: "multi_select", name: "Multi-select" },
    ];
};

export const fieldUsageOptions: Array<{
    key: keyof LeadField;
    label: string;
    description: string;
}> = [
        {
            key: "useInLeadForm",
            label: "Lead form",
            description: "Available while creating or editing a lead",
        },
        {
            key: "useInQuickCreate",
            label: "Quick lead form",
            description: "Can appear in compact lead capture flows",
        },
        {
            key: "useInLeadDetails",
            label: "Lead details",
            description: "Visible in the lead profile screen",
        },
        {
            key: "showInList",
            label: "Lead list column",
            description: "Can be shown as a column in lead lists",
        },
        {
            key: "isFilterable",
            label: "Lead filters",
            description: "Available in filter panels",
        },
        {
            key: "isSearchable",
            label: "Global search",
            description: "Included in search matching",
        },
        {
            key: "useInReports",
            label: "Reports and pivots",
            description: "Available for rows, columns, values and report filters",
        },
        {
            key: "useInAutomations",
            label: "Automations",
            description: "Can be used by workflow conditions",
        },
        {
            key: "isImportable",
            label: "Import templates",
            description: "Included in CSV / Google Sheet import templates",
        },
    ];

export const sourcesForChannel = (
    sources: Array<LeadSource>,
    channelId: string,
) => (channelId ? sources.filter(source => source.channelId === channelId) : []);

const leadFields: Array<LeadField> = [
    {
        id: "1",
        fieldKey: "student_name",
        displayName: "Student Name",
        fieldType: "text",
        placeholder: "Enter the student's full name",
        options: [],
        isSystem: true,
        isRequired: true,
        showInList: true,
        isFilterable: true,
        filterControl: "contains",
        isSearchable: true,
        isImportable: true,
        isImportRequired: true,
        importHeader: "Student Name",
        importSampleValue: "Aarav Sharma",
        useInLeadForm: true,
        useInQuickCreate: true,
        useInLeadDetails: true,
        useInReports: true,
        useInAutomations: false,
        columnWidth: 200,
    },
    {
        id: "2",
        fieldKey: "phone",
        displayName: "Phone",
        fieldType: "phone",
        placeholder: "10-digit mobile number",
        options: [],
        isSystem: true,
        isRequired: true,
        showInList: true,
        isFilterable: true,
        filterControl: "exact",
        isSearchable: true,
        isImportable: true,
        isImportRequired: true,
        importHeader: "Phone",
        importSampleValue: "9800011122",
        useInLeadForm: true,
        useInQuickCreate: true,
        useInLeadDetails: true,
        useInReports: true,
        useInAutomations: true,
        columnWidth: 150,
    },
    {
        id: "3",
        fieldKey: "email",
        displayName: "Email",
        fieldType: "email",
        placeholder: "name@example.com",
        options: [],
        isSystem: true,
        isRequired: false,
        showInList: true,
        isFilterable: true,
        filterControl: "contains",
        isSearchable: true,
        isImportable: true,
        isImportRequired: false,
        importHeader: "Email",
        importSampleValue: "parent@example.com",
        useInLeadForm: true,
        useInQuickCreate: false,
        useInLeadDetails: true,
        useInReports: true,
        useInAutomations: true,
        columnWidth: 220,
    },
    {
        id: "4",
        fieldKey: "parent_name",
        displayName: "Parent Name",
        fieldType: "text",
        placeholder: "Parent or guardian name",
        options: [],
        isSystem: false,
        isRequired: false,
        showInList: true,
        isFilterable: true,
        filterControl: "contains",
        isSearchable: true,
        isImportable: true,
        isImportRequired: false,
        importHeader: "Parent Name",
        importSampleValue: "Rohit Sharma",
        useInLeadForm: true,
        useInQuickCreate: false,
        useInLeadDetails: true,
        useInReports: true,
        useInAutomations: false,
        columnWidth: 180,
    },
    {
        id: "5",
        fieldKey: "class_id",
        displayName: "Class Applying For",
        fieldType: "single_select",
        placeholder: "",
        options: ["Nursery", "Class I", "Class V", "Class IX", "Class XI"],
        isSystem: false,
        isRequired: true,
        showInList: true,
        isFilterable: true,
        filterControl: "single_select",
        isSearchable: false,
        isImportable: true,
        isImportRequired: false,
        importHeader: "Class",
        importSampleValue: "Class I",
        useInLeadForm: true,
        useInQuickCreate: true,
        useInLeadDetails: true,
        useInReports: true,
        useInAutomations: true,
        columnWidth: 160,
    },
    {
        id: "6",
        fieldKey: "curriculum_id",
        displayName: "Curriculum",
        fieldType: "single_select",
        placeholder: "",
        options: ["CBSE", "ICSE", "IGCSE", "IB"],
        isSystem: false,
        isRequired: false,
        showInList: false,
        isFilterable: true,
        filterControl: "single_select",
        isSearchable: false,
        isImportable: true,
        isImportRequired: false,
        importHeader: "Curriculum",
        importSampleValue: "CBSE",
        useInLeadForm: true,
        useInQuickCreate: false,
        useInLeadDetails: true,
        useInReports: true,
        useInAutomations: false,
        columnWidth: 140,
    },
    {
        id: "7",
        fieldKey: "city",
        displayName: "City",
        fieldType: "text",
        placeholder: "City of residence",
        options: [],
        isSystem: false,
        isRequired: false,
        showInList: false,
        isFilterable: true,
        filterControl: "contains",
        isSearchable: true,
        isImportable: true,
        isImportRequired: false,
        importHeader: "City",
        importSampleValue: "Hyderabad",
        useInLeadForm: true,
        useInQuickCreate: false,
        useInLeadDetails: true,
        useInReports: true,
        useInAutomations: false,
        columnWidth: 140,
    },
    {
        id: "8",
        fieldKey: "remarks",
        displayName: "Remarks",
        fieldType: "textarea",
        placeholder: "Anything the counsellor should know",
        options: [],
        isSystem: false,
        isRequired: false,
        showInList: false,
        isFilterable: false,
        filterControl: "contains",
        isSearchable: false,
        isImportable: false,
        isImportRequired: false,
        importHeader: "",
        importSampleValue: "",
        useInLeadForm: true,
        useInQuickCreate: false,
        useInLeadDetails: true,
        useInReports: false,
        useInAutomations: false,
        columnWidth: 240,
    },
];

const leadPipelines = [
    {
        id: "1",
        displayName: "Admissions",
        description: "Enquiries that lead to an admission",
        isDefault: true,
        isActive: true,
    },
    {
        id: "2",
        displayName: "Transport Enquiries",
        description: "Route and stop requests from existing parents",
        isDefault: false,
        isActive: true,
    },
];

const duplicateFields = [
    { key: "phone", label: "Primary phone", group: "Contact" },
    { key: "alternatePhone", label: "Alternate phone", group: "Contact" },
    { key: "email", label: "Email", group: "Contact" },
    { key: "studentName", label: "Student name", group: "Student" },
    { key: "parentName", label: "Parent name", group: "Student" },
    { key: "branchId", label: "Branch", group: "Academic" },
    { key: "academicYear", label: "Academic year", group: "Academic" },
    { key: "classId", label: "Applying class", group: "Academic" },
];

export const whatsappAccountOptions: Array<SettingsOption> = [
    { id: "1", name: "Digital Campus Admissions" },
    { id: "2", name: "Digital Campus Transport" },
];

export const assignmentModeOptions: Array<SettingsOption> = [
    { id: "unassigned", name: "Nobody — leave unassigned" },
    { id: "rule", name: "Whoever the assignment rule picks" },
    { id: "fixed", name: "One counsellor" },
];

const pipelineStages: Array<PipelineStage> = [
    {
        id: "1",
        displayName: "New Enquiry",
        stageType: "open",
        color: "#405189",
        position: 1,
        requiresFollowup: true,
        isActive: true,
        pipelineId: "1",
        isAdmissionStage: false,
    },
    {
        id: "2",
        displayName: "Contacted",
        stageType: "open",
        color: "#0ab39c",
        position: 2,
        requiresFollowup: true,
        isActive: true,
        pipelineId: "1",
        isAdmissionStage: false,
    },
    {
        id: "3",
        displayName: "Campus Visit",
        stageType: "open",
        color: "#f7b84b",
        position: 3,
        requiresFollowup: true,
        isActive: true,
        pipelineId: "1",
        isAdmissionStage: false,
    },
    {
        id: "4",
        displayName: "Application Submitted",
        stageType: "open",
        color: "#299cdb",
        position: 4,
        requiresFollowup: false,
        isActive: true,
        pipelineId: "1",
        isAdmissionStage: false,
    },
    {
        id: "5",
        displayName: "Admitted",
        stageType: "completed",
        color: "#0b7a4f",
        position: 5,
        requiresFollowup: false,
        isActive: true,
        pipelineId: "1",
        isAdmissionStage: true,
    },
    {
        id: "6",
        displayName: "Lost",
        stageType: "cancelled",
        color: "#f06548",
        position: 6,
        requiresFollowup: false,
        isActive: true,
        pipelineId: "1",
        isAdmissionStage: false,
    },
    {
        id: "7",
        displayName: "New Enquiry",
        stageType: "open",
        color: "#405189",
        position: 1,
        requiresFollowup: true,
        isActive: true,
        pipelineId: "2",
        isAdmissionStage: false,
    },
    {
        id: "8",
        displayName: "Route Assigned",
        stageType: "open",
        color: "#0ab39c",
        position: 2,
        requiresFollowup: true,
        isActive: true,
        pipelineId: "2",
        isAdmissionStage: false,
    },
    {
        id: "9",
        displayName: "Transport Confirmed",
        stageType: "completed",
        color: "#0b7a4f",
        position: 3,
        requiresFollowup: false,
        isActive: true,
        pipelineId: "2",
        isAdmissionStage: false,
    },
];

const leadSubstages: Array<PipelineSubstage> = [
    { id: "1", stageId: "2", displayName: "Call Answered", position: 1, isActive: true },
    { id: "2", stageId: "2", displayName: "Not Reachable", position: 2, isActive: true },
    { id: "3", stageId: "3", displayName: "Visit Scheduled", position: 1, isActive: true },
    { id: "4", stageId: "3", displayName: "Visit Completed", position: 2, isActive: true },
    { id: "5", stageId: "6", displayName: "Chose Another School", position: 1, isActive: true },
    { id: "6", stageId: "6", displayName: "Budget Mismatch", position: 2, isActive: true },
];

const trackerStatuses: Array<TrackerStatus> = [
    { id: "1", displayName: "To Do", stageType: "open", color: "#405189", position: 1, isActive: true },
    { id: "2", displayName: "In Progress", stageType: "open", color: "#f7b84b", position: 2, isActive: true },
    { id: "3", displayName: "On Hold", stageType: "on_hold", color: "#878a99", position: 3, isActive: true },
    { id: "4", displayName: "Completed", stageType: "completed", color: "#0ab39c", position: 4, isActive: true },
    { id: "5", displayName: "Cancelled", stageType: "cancelled", color: "#f06548", position: 5, isActive: true },
];

const unitBranches: Array<UnitBranch> = settingsBranches.map((branch, index) => ({
    id: branch.id,
    name: branch.name,
    shortName: branch.shortName,
    isActive: true,
    callerdeskDidNumber: index < 3 ? `0402345678${9 + index}` : "",
    callerdeskDidId: index < 3 ? `DID-1${index + 1}` : "",
    callerdeskCallGroup: index < 2 ? "Admissions Desk" : "",
    callerdeskInboundEnabled: true,
    callerdeskOutboundEnabled: true,
    smartfloDidNumber: index < 2 ? `0404455667${7 + index}` : "",
    smartfloDidId: index < 2 ? `SFD-${index + 1}` : "",
    smartfloIvrId: index === 0 ? "IVR-1" : "",
    smartfloIvrName: index === 0 ? "Main Admissions IVR" : "",
    smartfloDepartmentId: index === 0 ? "D-1" : "",
    smartfloInboundEnabled: true,
    smartfloOutboundEnabled: true,
    jodoBaseUrl: "https://ext.jodo.in",
    jodoCollectorCode: index < 2 ? branch.shortName : "",
    hasJodoApiKey: index < 3,
    hasJodoSecretKey: index < 2,
    hasJodoAuthHeader: index === 0,
    pipelineIds: index === 3 ? ["2"] : [],
    whatsappAccountIds: index < 2 ? ["1"] : [],
    whatsappDefaultAccountId: index < 2 ? "1" : "",
    whatsappAutoCreateLead: index === 0,
    whatsappAssignmentMode: index === 0 ? "rule" : "unassigned",
    whatsappOwnerEmployeeId: "",
    whatsappIntakeBranchId: index === 0 ? branch.id : "",
}));

const channelCategories: Array<ConfigItem> = [
    { id: "1", displayName: "Inbound", code: "INBOUND", isActive: true },
    { id: "2", displayName: "Outbound", code: "OUTBOUND", isActive: true },
];

const channels: Array<ConfigItem> = [
    { id: "1", displayName: "Digital", code: "DIGITAL", categoryId: "1", isActive: true },
    { id: "2", displayName: "Referral", code: "REFERRAL", categoryId: "1", isActive: true },
    { id: "3", displayName: "Walk-in", code: "WALKIN", categoryId: "1", isActive: true },
    { id: "4", displayName: "Outbound", code: "OUTBOUND", categoryId: "2", isActive: true },
];

const sources: Array<LeadSource> = [
    { id: "1", channelId: "1", displayName: "Website Enquiry Form", isActive: true },
    { id: "2", channelId: "1", displayName: "Meta Lead Ads", isActive: true },
    { id: "3", channelId: "1", displayName: "Google Ads", isActive: true },
    { id: "4", channelId: "2", displayName: "Parent Referral", isActive: true },
    { id: "5", channelId: "2", displayName: "Staff Referral", isActive: true },
    { id: "6", channelId: "3", displayName: "Campus Walk-in", isActive: true },
    { id: "7", channelId: "4", displayName: "Telecalling List", isActive: true },
];

const campaignCategories: Array<ConfigItem> = [
    { id: "1", displayName: "Admissions", code: "ADM", isActive: true },
    { id: "2", displayName: "Brand", code: "BRAND", isActive: true },
];

const campaigns: Array<ConfigItem> = [
    { id: "1", displayName: "Admissions 2026-27", code: "ADM2627", categoryId: "1", isActive: true },
    { id: "2", displayName: "Summer Open House", code: "OPENHOUSE", categoryId: "2", isActive: true },
    { id: "3", displayName: "Sibling Drive", code: "SIBLING", categoryId: "1", isActive: false },
];

const admissionClassConfigs = [
    {
        id: "1",
        academicYear: "2026-27",
        branchId: "1",
        curriculumId: "1",
        admissionTypeId: "1",
        classIds: ["1", "2", "3"],
    },
    {
        id: "2",
        academicYear: "2026-27",
        branchId: "2",
        curriculumId: "2",
        admissionTypeId: "1",
        classIds: ["2", "4"],
    },
    {
        id: "3",
        academicYear: "2027-28",
        branchId: "1",
        curriculumId: "1",
        admissionTypeId: "3",
        classIds: ["1", "2", "3", "4", "5"],
    },
];

const databaseTables = [
    {
        tableName: "crm_leads",
        rowCount: 1284,
        columns: ["id", "student_name", "phone", "stage_id", "created_at"],
        rows: [
            { id: "9041", student_name: "Aarav Sharma", phone: "9800011122", stage_id: "1", created_at: "2026-08-14 10:22" },
            { id: "9042", student_name: "Diya Menon", phone: "9800011133", stage_id: "2", created_at: "2026-08-14 11:05" },
            { id: "9043", student_name: "Kabir Anand", phone: "9800011144", stage_id: "8", created_at: "2026-08-15 09:40" },
            { id: "9044", student_name: "Rahul Kumar", phone: "9800011155", stage_id: "3", created_at: "2026-08-15 16:12" },
            { id: "9045", student_name: "Ishita Rao", phone: "9800011166", stage_id: "5", created_at: "2026-08-16 08:58" },
        ],
    },
    {
        tableName: "crm_lead_pipelines",
        rowCount: 2,
        columns: ["id", "display_name", "is_default", "is_active"],
        rows: [
            { id: "1", display_name: "Admissions", is_default: "1", is_active: "1" },
            { id: "2", display_name: "Transport Enquiries", is_default: "0", is_active: "1" },
        ],
    },
    {
        tableName: "crm_pipeline_stages",
        rowCount: 9,
        columns: ["id", "display_name", "pipeline_id", "position"],
        rows: [
            { id: "1", display_name: "New Enquiry", pipeline_id: "1", position: "1" },
            { id: "2", display_name: "Contacted", pipeline_id: "1", position: "2" },
            { id: "3", display_name: "Campus Visit", pipeline_id: "1", position: "3" },
            { id: "4", display_name: "Application Submitted", pipeline_id: "1", position: "4" },
            { id: "5", display_name: "Admitted", pipeline_id: "1", position: "5" },
        ],
    },
    {
        tableName: "crm_branches",
        rowCount: 4,
        columns: ["id", "name", "short_name", "is_active"],
        rows: [],
    },
];

const academicYears: Array<AcademicYear> = [
    { academicYear: "2026-27", displayName: "2026-2027", isActive: true },
    { academicYear: "2027-28", displayName: "2027-2028", isActive: true },
    { academicYear: "2025-26", displayName: "2025-2026 (closed)", isActive: false },
];

export const businessUnitConfigs: Record<string, BusinessUnitConfig> = {
    "1": {
        fields: leadFields,
        leadPipelines,
        duplicateFields,
        duplicateRule: ["phone", "branchId", "academicYear"],
        pipelineStages,
        leadSubstages,
        trackerStatuses,
        branches: unitBranches,
        channelCategories,
        channels,
        sources,
        campaignCategories,
        campaigns,
        academicYears,
        admissionTypes: [
            { id: "1", displayName: "Fresh Admission", code: "fresh", isActive: true },
            { id: "2", displayName: "Transfer Admission", code: "transfer", isActive: true },
            { id: "3", displayName: "Sibling Admission", code: "sibling", isActive: true },
        ],
        admissionClasses: [
            { id: "1", displayName: "Nursery", isActive: true },
            { id: "2", displayName: "Class I", isActive: true },
            { id: "3", displayName: "Class V", isActive: true },
            { id: "4", displayName: "Class IX", isActive: true },
            { id: "5", displayName: "Class XI", isActive: true },
        ],
        curriculums: [
            { id: "1", displayName: "CBSE", code: "CBSE", position: 1, isActive: true },
            { id: "2", displayName: "ICSE", code: "ICSE", position: 2, isActive: true },
            { id: "3", displayName: "IGCSE", code: "IGCSE", position: 3, isActive: true },
            { id: "4", displayName: "IB", code: "IB", position: 4, isActive: false },
        ],
        admissionClassConfigs,
        databaseTables,
        manualLeadDefaults: {
            stageId: "1",
            substageId: "",
            channelId: "1",
            sourceId: "1",
            campaignId: "1",
        },
    },

    "2": {
        fields: leadFields.slice(0, 4),
        leadPipelines: leadPipelines.slice(0, 1),
        duplicateFields,
        duplicateRule: ["phone"],
        pipelineStages: pipelineStages.slice(0, 4),
        leadSubstages: leadSubstages.slice(0, 2),
        trackerStatuses,
        branches: unitBranches.slice(0, 2),
        channelCategories,
        channels,
        sources: sources.slice(0, 4),
        campaignCategories,
        campaigns: campaigns.slice(0, 2),
        academicYears: [],
        admissionTypes: [],
        admissionClasses: [],
        curriculums: [],
        admissionClassConfigs: [],
        databaseTables: databaseTables.slice(0, 2),
        manualLeadDefaults: {
            stageId: "1",
            substageId: "",
            channelId: "",
            sourceId: "",
            campaignId: "",
        },
    },

    "3": {
        fields: leadFields.slice(0, 3),
        leadPipelines: leadPipelines.slice(0, 1),
        duplicateFields,
        duplicateRule: [],
        pipelineStages: pipelineStages.slice(0, 3),
        leadSubstages: [],
        trackerStatuses: trackerStatuses.slice(0, 3),
        branches: unitBranches.slice(0, 1),
        channelCategories: channelCategories.slice(0, 1),
        channels: channels.slice(0, 2),
        sources: sources.slice(0, 3),
        campaignCategories: [],
        campaigns: [],
        academicYears: [],
        admissionTypes: [],
        admissionClasses: [],
        curriculums: [],
        admissionClassConfigs: [],
        databaseTables: [],
        manualLeadDefaults: {
            stageId: "",
            substageId: "",
            channelId: "",
            sourceId: "",
            campaignId: "",
        },
    },
};

export const emptyBusinessUnitConfig: BusinessUnitConfig = {
    fields: [],
    leadPipelines: [],
    duplicateFields: [],
    duplicateRule: [],
    pipelineStages: [],
    leadSubstages: [],
    trackerStatuses: [],
    branches: [],
    channelCategories: [],
    channels: [],
    sources: [],
    campaignCategories: [],
    campaigns: [],
    academicYears: [],
    admissionTypes: [],
    admissionClasses: [],
    curriculums: [],
    admissionClassConfigs: [],
    databaseTables: [],
    manualLeadDefaults: {
        stageId: "",
        substageId: "",
        channelId: "",
        sourceId: "",
        campaignId: "",
    },
};

export const configForUnit = (unitId: string) =>
    businessUnitConfigs[unitId] || emptyBusinessUnitConfig;
