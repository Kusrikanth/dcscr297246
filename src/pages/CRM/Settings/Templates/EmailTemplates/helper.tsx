import {
    MenuOptionHrtl,
    type IOptionsHrtl,
} from "../../../../../Components/Common/MenuOptions";
import { Button, StatusLabel } from "../../../../../Components/Common";
import { formatDateTime, type SettingsOption } from "../../helper";

export interface EmailTemplate {
    id: string;
    templateName: string;
    category: string;
    subject: string;
    bodyHtml: string;
    isActive: boolean;
    visibleUserIds: Array<string>;
    updatedBy: string;
    updatedAt: string;
}

interface EmailTemplateRow {
    row: { original: EmailTemplate };
}

export const emailTemplateCategories: Array<SettingsOption> = [
    "Lead",
    "Follow-up",
    "Application",
    "Admission",
    "Payment",
    "General",
    "Other",
].map(category => ({ id: category, name: category }));

export const emailMergeFields = [
    "student_name",
    "parent_name",
    "lead_name",
    "branch_name",
    "class_name",
    "counsellor_name",
    "counsellor_phone",
    "application_number",
    "application_date",
    "followup_date",
    "company_name",
];

export const emailTemplates: Array<EmailTemplate> = [
    {
        id: "1",
        templateName: "Enquiry Acknowledgement",
        category: "Lead",
        subject: "Thank you for your enquiry, {{parent_name}}",
        bodyHtml:
            "<p>Dear {{parent_name}},</p><p>Thank you for enquiring about admission for {{student_name}} at {{branch_name}}. Your counsellor {{counsellor_name}} will call you on {{counsellor_phone}} shortly.</p><p>Warm regards,<br/>{{company_name}}</p>",
        isActive: true,
        visibleUserIds: [],
        updatedBy: "Ananya Rao",
        updatedAt: "2026-08-10T11:20:00",
    },
    {
        id: "2",
        templateName: "Campus Visit Reminder",
        category: "Follow-up",
        subject: "Your campus visit on {{followup_date}}",
        bodyHtml:
            "<p>Dear {{parent_name}},</p><p>This is a reminder of your campus visit at {{branch_name}} on {{followup_date}}. Please carry a photo ID.</p>",
        isActive: true,
        visibleUserIds: ["11", "12"],
        updatedBy: "Vikram Shetty",
        updatedAt: "2026-08-12T15:05:00",
    },
    {
        id: "3",
        templateName: "Application Received",
        category: "Application",
        subject: "Application {{application_number}} received",
        bodyHtml:
            "<p>Dear {{parent_name}},</p><p>We have received application {{application_number}} for {{student_name}}, submitted on {{application_date}}.</p>",
        isActive: true,
        visibleUserIds: [],
        updatedBy: "Ananya Rao",
        updatedAt: "2026-07-28T09:40:00",
    },
    {
        id: "4",
        templateName: "Fee Payment Reminder",
        category: "Payment",
        subject: "Pending fee for {{student_name}}",
        bodyHtml:
            "<p>Dear {{parent_name}},</p><p>The admission fee for {{student_name}} at {{branch_name}} is still pending.</p>",
        isActive: false,
        visibleUserIds: [],
        updatedBy: "Sneha Menon",
        updatedAt: "2026-06-19T17:30:00",
    },
];

export function generateEmailTemplateColumns(
    actionsList: Array<IOptionsHrtl>,
    onToggleStatus: (template: EmailTemplate) => void,
) {
    return [
        {
            Header: "Template",
            accessor: "templateName",
            disableSortBy: true,

            Cell: ({ row: { original } }: EmailTemplateRow) => (
                <div className="tw-min-w-0">
                    <p className="tw-mb-0 tw-text-sm tw-font-medium tw-text-gray-800">
                        {original.templateName}
                    </p>
                    <p className="tw-mb-0 tw-max-w-[320px] tw-truncate tw-text-xs tw-text-gray-500">
                        {original.subject}
                    </p>
                </div>
            ),
        },

        {
            Header: "Category",
            accessor: "category",
            disableSortBy: true,

            Cell: ({ row: { original } }: EmailTemplateRow) => (
                <span className="badge badge-soft-secondary">
                    {original.category}
                </span>
            ),
        },

        {
            Header: "Visibility",
            accessor: "visibleUserIds",
            disableSortBy: true,

            Cell: ({ row: { original } }: EmailTemplateRow) => (
                <p className="tw-mb-0 tw-whitespace-nowrap tw-text-sm tw-text-gray-700">
                    {original.visibleUserIds.length
                        ? `${original.visibleUserIds.length} user${original.visibleUserIds.length === 1 ? "" : "s"}`
                        : "Everyone"}
                </p>
            ),
        },

        {
            Header: "Status",
            accessor: "isActive",
            disableSortBy: true,

            Cell: ({ row: { original } }: EmailTemplateRow) => (
                <Button
                    type="button"
                    variant="sidebarMenu"
                    title={
                        original.isActive
                            ? "Mark template inactive"
                            : "Mark template active"
                    }
                    onClick={() => onToggleStatus(original)}
                >
                    <StatusLabel
                        type={original.isActive ? "active" : "inactive"}
                        labelName={original.isActive ? "Active" : "Inactive"}
                    />
                </Button>
            ),
        },

        {
            Header: "Updated",
            accessor: "updatedAt",
            disableSortBy: true,

            Cell: ({ row: { original } }: EmailTemplateRow) => (
                <div className="tw-min-w-0">
                    <p className="tw-mb-0 tw-text-sm tw-text-gray-700">
                        {original.updatedBy}
                    </p>
                    <p className="tw-mb-0 tw-whitespace-nowrap tw-text-xs tw-text-gray-500">
                        {formatDateTime(original.updatedAt)}
                    </p>
                </div>
            ),
        },

        {
            Header: "Actions",
            accessor: "id",
            disableSortBy: true,

            Cell: ({ row: { original } }: EmailTemplateRow) => (
                <MenuOptionHrtl actionOptions={actionsList} rowId={original.id} />
            ),
        },
    ];
}
