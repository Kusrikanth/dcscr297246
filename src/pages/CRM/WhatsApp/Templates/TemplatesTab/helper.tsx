import { StatusLabel } from "../../../../../Components/Common";
import {
    MenuOptionHrtl,
    type IOptionsHrtl,
} from "../../../../../Components/Common/MenuOptions";
import {
    formatDateTime,
    getStatusLabelType,
    type WhatsAppTemplate,
} from "../../helper";

interface TemplateRow {
    row: { original: WhatsAppTemplate };
}

export interface TemplateAdvancedFilters {
    integrationId: string;
    status: string;
    templateType: string;
    category: string;
    language: string;
    createdFrom: string;
    createdTo: string;
}

export const emptyTemplateFilters: TemplateAdvancedFilters = {
    integrationId: "",
    status: "",
    templateType: "",
    category: "",
    language: "",
    createdFrom: "",
    createdTo: "",
};

const previewText = (body: string) => {
    const flattened = String(body || "").replace(/\s+/g, " ").trim();

    return flattened.length > 90
        ? `${flattened.substring(0, 90)}…`
        : flattened || "—";
};

export function generateTemplateColumns(actionsList: Array<IOptionsHrtl>) {
    return [
        {
            Header: "Template",
            accessor: "label",
            disableSortBy: true,

            Cell: ({ row: { original } }: TemplateRow) => (
                <div className="tw-min-w-0">
                    <p className="tw-mb-0 tw-truncate tw-text-sm tw-font-semibold tw-text-gray-800">
                        {original.label || original.templateName}
                    </p>
                    <p className="tw-mb-0 tw-truncate tw-text-xs tw-text-gray-500">
                        {original.templateName}
                    </p>
                    <p className="tw-mb-0 tw-mt-1 tw-truncate tw-text-xs tw-text-gray-500">
                        {previewText(original.body)}
                    </p>
                </div>
            ),
        },

        {
            Header: "Account",
            accessor: "integrationName",
            disableSortBy: true,

            Cell: ({ row: { original } }: TemplateRow) => (
                <span className="tw-text-sm tw-text-gray-700">
                    {original.integrationName || "—"}
                </span>
            ),
        },

        {
            Header: "Category",
            accessor: "category",
            disableSortBy: true,

            Cell: ({ row: { original } }: TemplateRow) => (
                <span className="tw-text-sm tw-text-gray-700">
                    {original.category || "—"}
                </span>
            ),
        },

        {
            Header: "Type",
            accessor: "templateType",
            disableSortBy: true,

            Cell: ({ row: { original } }: TemplateRow) => (
                <span className="tw-text-sm tw-text-gray-700">
                    {original.templateType || "—"}
                </span>
            ),
        },

        {
            Header: "Language",
            accessor: "language",
            disableSortBy: true,

            Cell: ({ row: { original } }: TemplateRow) => (
                <span className="tw-text-sm tw-text-gray-700">
                    {original.language || "—"}
                </span>
            ),
        },

        {
            Header: "Created",
            accessor: "createdAt",
            disableSortBy: true,

            Cell: ({ row: { original } }: TemplateRow) => (
                <span className="tw-whitespace-nowrap tw-text-sm tw-text-gray-700">
                    {formatDateTime(original.createdAt)}
                </span>
            ),
        },

        {
            Header: "Modified",
            accessor: "updatedAt",
            disableSortBy: true,

            Cell: ({ row: { original } }: TemplateRow) => (
                <span className="tw-whitespace-nowrap tw-text-sm tw-text-gray-700">
                    {formatDateTime(original.updatedAt)}
                </span>
            ),
        },

        {
            Header: "Status",
            accessor: "status",
            disableSortBy: true,

            Cell: ({ row: { original } }: TemplateRow) => (
                <StatusLabel
                    type={getStatusLabelType(original.status)}
                    labelName={original.status}
                />
            ),
        },

        {
            Header: "Actions",
            accessor: "id",
            disableSortBy: true,

            Cell: ({ row: { original } }: TemplateRow) => (
                <MenuOptionHrtl
                    actionOptions={actionsList}
                    rowId={original.id}
                />
            ),
        },
    ];
}
