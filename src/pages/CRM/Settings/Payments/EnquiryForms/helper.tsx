import type { LeadField } from "../../businessunitconfig";

export interface EnquiryFormField {
    fieldKey: string;
    label: string;
    placeholder: string;
    isRequired: boolean;
    position: number;
}

export interface EnquiryForm {
    id: string;
    formKey: string;
    displayName: string;
    description: string;
    businessUnitId: string;
    defaultBranchId: string;
    defaultAcademicYear: string;
    defaultStageId: string;
    defaultSubstageId: string;
    defaultChannelId: string;
    defaultSourceId: string;
    defaultCampaignId: string;
    defaultOwnerEmployeeId: string;
    paymentRequired: boolean;
    paymentAmount: string;
    paymentComponentType: string;
    successMessage: string;
    redirectUrl: string;
    isActive: boolean;
    fields: Array<EnquiryFormField>;
}

export const emptyEnquiryForm: EnquiryForm = {
    id: "",
    formKey: "",
    displayName: "",
    description: "",
    businessUnitId: "",
    defaultBranchId: "",
    defaultAcademicYear: "",
    defaultStageId: "",
    defaultSubstageId: "",
    defaultChannelId: "",
    defaultSourceId: "",
    defaultCampaignId: "",
    defaultOwnerEmployeeId: "",
    paymentRequired: false,
    paymentAmount: "",
    paymentComponentType: "",
    successMessage: "Thank you. Your enquiry has been submitted.",
    redirectUrl: "",
    isActive: true,
    fields: [],
};

export const defaultEnquiryFields = (
    fields: Array<LeadField>,
): Array<EnquiryFormField> => {
    const preferred = [
        "student_name",
        "phone",
        "email",
        "parent_name",
        "class_id",
        "curriculum_id",
        "city",
        "remarks",
    ];

    const byKey = new Map(fields.map(field => [field.fieldKey, field]));

    return preferred
        .filter(key => byKey.has(key))
        .map((key, index) => {
            const field = byKey.get(key) as LeadField;

            return {
                fieldKey: key,
                label: field.displayName,
                placeholder: field.placeholder,
                isRequired: ["student_name", "phone"].includes(key),
                position: index + 1,
            };
        });
};

export const publicEnquiryUrl = (formKey: string) =>
    `${window.location.origin}/public/enquiry/${formKey}`;

export const enquiryIframeCode = (formKey: string) =>
    `<iframe src="${publicEnquiryUrl(formKey)}" style="width:100%;min-height:680px;border:0;" loading="lazy"></iframe>`;

export const toEnquiryFormKey = (displayName: string) =>
    displayName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 40) || "enquiry-form";

export const enquiryForms: Array<EnquiryForm> = [
    {
        id: "1",
        formKey: "main-website-enquiry",
        displayName: "Main Website Enquiry",
        description: "The form linked from the admissions page.",
        businessUnitId: "1",
        defaultBranchId: "1",
        defaultAcademicYear: "2026-27",
        defaultStageId: "1",
        defaultSubstageId: "",
        defaultChannelId: "1",
        defaultSourceId: "1",
        defaultCampaignId: "1",
        defaultOwnerEmployeeId: "101",
        paymentRequired: true,
        paymentAmount: "1000",
        paymentComponentType: "Application Fee",
        successMessage: "Thank you. Our admissions team will call you shortly.",
        redirectUrl: "https://digitalcampus.in/thank-you",
        isActive: true,
        fields: [
            {
                fieldKey: "student_name",
                label: "Student Name",
                placeholder: "Enter the student's full name",
                isRequired: true,
                position: 1,
            },
            {
                fieldKey: "phone",
                label: "Phone",
                placeholder: "10-digit mobile number",
                isRequired: true,
                position: 2,
            },
            {
                fieldKey: "email",
                label: "Email",
                placeholder: "name@example.com",
                isRequired: false,
                position: 3,
            },
            {
                fieldKey: "class_id",
                label: "Class Applying For",
                placeholder: "",
                isRequired: true,
                position: 4,
            },
        ],
    },
    {
        id: "2",
        formKey: "open-house-2026",
        displayName: "Open House Registration",
        description: "Landing-page form for the summer open house.",
        businessUnitId: "1",
        defaultBranchId: "2",
        defaultAcademicYear: "2026-27",
        defaultStageId: "1",
        defaultSubstageId: "",
        defaultChannelId: "1",
        defaultSourceId: "3",
        defaultCampaignId: "2",
        defaultOwnerEmployeeId: "",
        paymentRequired: false,
        paymentAmount: "",
        paymentComponentType: "",
        successMessage: "Thank you. Your seat at the open house is reserved.",
        redirectUrl: "",
        isActive: true,
        fields: [
            {
                fieldKey: "student_name",
                label: "Student Name",
                placeholder: "Enter the student's full name",
                isRequired: true,
                position: 1,
            },
            {
                fieldKey: "phone",
                label: "Phone",
                placeholder: "10-digit mobile number",
                isRequired: true,
                position: 2,
            },
            {
                fieldKey: "city",
                label: "City",
                placeholder: "City of residence",
                isRequired: false,
                position: 3,
            },
        ],
    },
    {
        id: "3",
        formKey: "skill-academy-enquiry",
        displayName: "Skill Academy Enquiry",
        description: "",
        businessUnitId: "2",
        defaultBranchId: "1",
        defaultAcademicYear: "",
        defaultStageId: "1",
        defaultSubstageId: "",
        defaultChannelId: "2",
        defaultSourceId: "4",
        defaultCampaignId: "",
        defaultOwnerEmployeeId: "102",
        paymentRequired: false,
        paymentAmount: "",
        paymentComponentType: "",
        successMessage: "Thank you. Your enquiry has been submitted.",
        redirectUrl: "",
        isActive: false,
        fields: [
            {
                fieldKey: "student_name",
                label: "Full Name",
                placeholder: "Enter your full name",
                isRequired: true,
                position: 1,
            },
            {
                fieldKey: "phone",
                label: "Phone",
                placeholder: "10-digit mobile number",
                isRequired: true,
                position: 2,
            },
        ],
    },
];
