import {
    MenuOptionHrtl,
    type IOptionsHrtl,
} from "../../../../../Components/Common/MenuOptions";
import { StatusLabel } from "../../../../../Components/Common";
import {
    formatDate,
    settingsBranches,
    type SettingsOption,
} from "../../helper";

export interface PaymentFormField {
    id: string;
    name: string;
    label: string;
    fieldType: string;
    placeholder: string;
    isRequired: boolean;
    options: Array<string>;
}

export interface PaymentCategory {
    name: string;
    amount: string;
}

export interface PaymentForm {
    id: string;
    formKey: string;
    title: string;
    description: string;
    logo: string;
    componentType: string;
    branchId: string;
    selectionType: "single" | "multiple";
    fields: Array<PaymentFormField>;
    categories: Array<PaymentCategory>;
    successMessage: string;
    redirectUrl: string;
    expiresOn: string;
    isActive: boolean;
    submissionCount: number;
}

interface PaymentFormRow {
    row: { original: PaymentForm };
}

export const paymentFieldTypeOptions: Array<SettingsOption> = [
    { id: "text", name: "Text Input" },
    { id: "email", name: "Email" },
    { id: "phone", name: "Phone Number" },
    { id: "number", name: "Number" },
    { id: "textarea", name: "Text Area" },
    { id: "select", name: "Dropdown" },
    { id: "checkbox", name: "Checkbox" },
    { id: "date", name: "Date" },
];

export const selectionTypeOptions = [
    {
        id: "single",
        name: "Single",
        description: "One category",
        icon: "ri-radio-button-line",
    },
    {
        id: "multiple",
        name: "Multiple",
        description: "Many categories",
        icon: "ri-list-check-2",
    },
];

export const typeTakesPlaceholder = (fieldType: string) =>
    fieldType !== "checkbox";

export const branchNameFor = (branchId: string) =>
    settingsBranches.find(branch => branch.id === branchId)?.name || "—";

export const paymentFormStatus = (form: PaymentForm) => {
    if (!form.isActive) {
        return "inactive";
    }

    if (form.expiresOn && new Date(form.expiresOn) < new Date()) {
        return "expired";
    }

    return "active";
};

export const paymentFormUrl = (formKey: string) =>
    `${window.location.origin}/payment/${formKey}`;

export const paymentForms: Array<PaymentForm> = [
    {
        id: "1",
        formKey: "adm-fee-2026",
        title: "Admission Fee Payment",
        description: "Class I to X admission fees for the 2026-27 session.",
        logo: "",
        componentType: "Application Fee",
        branchId: "1",
        selectionType: "single",
        fields: [
            {
                id: "f1",
                name: "studentName",
                label: "Student Name",
                fieldType: "text",
                placeholder: "Enter student name",
                isRequired: true,
                options: [],
            },
            {
                id: "f2",
                name: "parentPhone",
                label: "Parent Phone",
                fieldType: "phone",
                placeholder: "10-digit mobile number",
                isRequired: true,
                options: [],
            },
            {
                id: "f3",
                name: "admissionClass",
                label: "Class Applying For",
                fieldType: "select",
                placeholder: "",
                isRequired: true,
                options: ["Class I", "Class II", "Class III", "Class IV", "Class V"],
            },
        ],
        categories: [
            { name: "Admission Fee", amount: "25000" },
            { name: "Registration Fee", amount: "2000" },
        ],
        successMessage: "Thank you. Your payment has been received.",
        redirectUrl: "",
        expiresOn: "2026-12-31",
        isActive: true,
        submissionCount: 148,
    },
    {
        id: "2",
        formKey: "transport-2026",
        title: "Transport Fee",
        description: "Termly bus fee by route slab.",
        logo: "",
        componentType: "Transport Fee",
        branchId: "2",
        selectionType: "multiple",
        fields: [
            {
                id: "f4",
                name: "studentName",
                label: "Student Name",
                fieldType: "text",
                placeholder: "Enter student name",
                isRequired: true,
                options: [],
            },
            {
                id: "f5",
                name: "admissionNumber",
                label: "Admission Number",
                fieldType: "text",
                placeholder: "e.g. DC-2026-0412",
                isRequired: true,
                options: [],
            },
        ],
        categories: [
            { name: "Slab A — up to 5 km", amount: "8000" },
            { name: "Slab B — 5 to 12 km", amount: "12000" },
            { name: "Slab C — above 12 km", amount: "16000" },
        ],
        successMessage: "Transport fee received. Your route pass will be issued.",
        redirectUrl: "https://digitalcampus.in/transport/thank-you",
        expiresOn: "",
        isActive: true,
        submissionCount: 62,
    },
    {
        id: "3",
        formKey: "summer-camp-25",
        title: "Summer Camp 2025",
        description: "Closed camp registration, kept for its records.",
        logo: "",
        componentType: "",
        branchId: "3",
        selectionType: "single",
        fields: [],
        categories: [{ name: "Camp Fee", amount: "4500" }],
        successMessage: "",
        redirectUrl: "",
        expiresOn: "2025-05-31",
        isActive: true,
        submissionCount: 31,
    },
    {
        id: "4",
        formKey: "alumni-fund",
        title: "Alumni Contribution",
        description: "Voluntary contributions towards the scholarship fund.",
        logo: "",
        componentType: "",
        branchId: "1",
        selectionType: "single",
        fields: [],
        categories: [
            { name: "Silver", amount: "5000" },
            { name: "Gold", amount: "10000" },
        ],
        successMessage: "",
        redirectUrl: "",
        expiresOn: "",
        isActive: false,
        submissionCount: 0,
    },
];

export function generatePaymentFormColumns(actionsList: Array<IOptionsHrtl>) {
    return [
        {
            Header: "Form",
            accessor: "title",
            disableSortBy: true,

            Cell: ({ row: { original } }: PaymentFormRow) => (
                <div className="tw-min-w-0">
                    <p className="tw-mb-0 tw-text-sm tw-font-medium tw-text-gray-800">
                        {original.title}
                    </p>
                    <p className="tw-mb-0 tw-max-w-[280px] tw-truncate tw-text-xs tw-text-gray-500">
                        {original.description || original.formKey}
                    </p>
                </div>
            ),
        },

        {
            Header: "Branch",
            accessor: "branchId",
            disableSortBy: true,

            Cell: ({ row: { original } }: PaymentFormRow) => (
                <p className="tw-mb-0 tw-whitespace-nowrap tw-text-sm tw-text-gray-700">
                    {branchNameFor(original.branchId)}
                </p>
            ),
        },

        {
            Header: "Categories",
            accessor: "categories",
            disableSortBy: true,

            Cell: ({ row: { original } }: PaymentFormRow) => (
                <p className="tw-mb-0 tw-text-sm tw-text-gray-700">
                    {original.categories.length}
                </p>
            ),
        },

        {
            Header: "Submissions",
            accessor: "submissionCount",
            disableSortBy: true,

            Cell: ({ row: { original } }: PaymentFormRow) => (
                <p className="tw-mb-0 tw-text-sm tw-text-gray-700">
                    {original.submissionCount}
                </p>
            ),
        },

        {
            Header: "Expires",
            accessor: "expiresOn",
            disableSortBy: true,

            Cell: ({ row: { original } }: PaymentFormRow) => {
                if (!original.expiresOn) {
                    return <span className="tw-text-gray-400">No expiry</span>;
                }

                const isPast = new Date(original.expiresOn) < new Date();

                return (
                    <p
                        className={`tw-mb-0 tw-whitespace-nowrap tw-text-sm ${isPast ? "tw-text-danger" : "tw-text-gray-700"
                            }`}
                    >
                        {formatDate(original.expiresOn)}
                    </p>
                );
            },
        },

        {
            Header: "Status",
            accessor: "isActive",
            disableSortBy: true,

            Cell: ({ row: { original } }: PaymentFormRow) => {
                const status = paymentFormStatus(original);

                return (
                    <StatusLabel
                        type={status}
                        labelName={
                            status === "inactive"
                                ? "Inactive"
                                : status === "expired"
                                    ? "Expired"
                                    : "Active"
                        }
                    />
                );
            },
        },

        {
            Header: "Actions",
            accessor: "id",
            disableSortBy: true,

            Cell: ({ row: { original } }: PaymentFormRow) => (
                <MenuOptionHrtl actionOptions={actionsList} rowId={original.id} />
            ),
        },
    ];
}
