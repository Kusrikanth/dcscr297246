import { StatusLabel } from "../../../../../Components/Common";
import {
    formatDate,
    formatMoney,
    settingsBranches,
    titleCase,
    type SettingsOption,
} from "../../helper";

export interface PaymentCollection {
    id: string;
    source: "enquiry" | "payment_form" | "payment_link";
    sourceName: string;
    branchId: string;
    leadNumber: string;
    payerName: string;
    payerEmail: string;
    payerPhone: string;
    orderId: string;
    transactionId: string;
    amount: number;
    status: string;
    paidAt: string;
    settledAt: string;
    settlementUtr: string;
    createdAt: string;
}

interface PaymentCollectionRow {
    row: { original: PaymentCollection };
}

export const collectionSourceOptions: Array<SettingsOption> = [
    { id: "enquiry", name: "Enquiry form" },
    { id: "payment_form", name: "Payment form" },
    { id: "payment_link", name: "Payment link" },
];

export const collectionStatusOptions: Array<SettingsOption> = [
    "order_created",
    "unpaid",
    "paid",
    "settled",
    "expired",
    "failed",
    "cancelled",
].map(status => ({ id: status, name: titleCase(status) }));

export const collectionStatusTone = (status: string) => {
    const value = String(status || "").toLowerCase();

    if (["paid", "settled", "success", "completed", "captured"].includes(value)) {
        return "paid";
    }

    if (["expired", "failed", "cancelled"].includes(value)) {
        return "failed";
    }

    return "pending";
};

const branchNameFor = (branchId: string) =>
    settingsBranches.find(branch => branch.id === branchId)?.name || "";

export const paymentCollections: Array<PaymentCollection> = [
    {
        id: "c1",
        source: "payment_form",
        sourceName: "Application Fee 2026-27",
        branchId: "1",
        leadNumber: "LEAD-24118",
        payerName: "Meera Krishnan",
        payerEmail: "meera.k@example.com",
        payerPhone: "9840012345",
        orderId: "ORD-9A72F1",
        transactionId: "TXN-556231",
        amount: 25000,
        status: "settled",
        paidAt: "2026-08-12T10:22:00",
        settledAt: "2026-08-14T02:00:00",
        settlementUtr: "UTR8891203344",
        createdAt: "2026-08-12T10:18:00",
    },
    {
        id: "c2",
        source: "enquiry",
        sourceName: "Admissions Enquiry — Kompally",
        branchId: "2",
        leadNumber: "LEAD-24127",
        payerName: "Arjun Desai",
        payerEmail: "arjun.desai@example.com",
        payerPhone: "9812233445",
        orderId: "ORD-9A73B4",
        transactionId: "TXN-556288",
        amount: 1000,
        status: "paid",
        paidAt: "2026-08-13T16:40:00",
        settledAt: "",
        settlementUtr: "",
        createdAt: "2026-08-13T16:36:00",
    },
    {
        id: "c3",
        source: "payment_link",
        sourceName: "Bulk links · fees-aug-2026.csv",
        branchId: "3",
        leadNumber: "LEAD-24130",
        payerName: "Kavya Reddy",
        payerEmail: "kavya.reddy@example.com",
        payerPhone: "9701122334",
        orderId: "ORD-9A7401",
        transactionId: "",
        amount: 12000,
        status: "unpaid",
        paidAt: "",
        settledAt: "",
        settlementUtr: "",
        createdAt: "2026-08-14T09:05:00",
    },
    {
        id: "c4",
        source: "payment_form",
        sourceName: "Transport Fee",
        branchId: "1",
        leadNumber: "",
        payerName: "Imran Qureshi",
        payerEmail: "imran.q@example.com",
        payerPhone: "9900011223",
        orderId: "ORD-9A7455",
        transactionId: "TXN-556310",
        amount: 8000,
        status: "failed",
        paidAt: "",
        settledAt: "",
        settlementUtr: "",
        createdAt: "2026-08-14T11:47:00",
    },
    {
        id: "c5",
        source: "enquiry",
        sourceName: "Admissions Enquiry — Nacharam",
        branchId: "4",
        leadNumber: "LEAD-24144",
        payerName: "Sarita Bose",
        payerEmail: "sarita.bose@example.com",
        payerPhone: "9811224466",
        orderId: "ORD-9A7502",
        transactionId: "TXN-556377",
        amount: 1000,
        status: "settled",
        paidAt: "2026-08-14T14:02:00",
        settledAt: "2026-08-15T02:00:00",
        settlementUtr: "UTR8891208877",
        createdAt: "2026-08-14T13:58:00",
    },
    {
        id: "c6",
        source: "payment_link",
        sourceName: "",
        branchId: "",
        leadNumber: "LEAD-24151",
        payerName: "Nikhil Warrier",
        payerEmail: "nikhil.w@example.com",
        payerPhone: "9745566778",
        orderId: "ORD-9A7566",
        transactionId: "",
        amount: 16000,
        status: "expired",
        paidAt: "",
        settledAt: "",
        settlementUtr: "",
        createdAt: "2026-08-05T08:30:00",
    },
];

export function generateCollectionColumns() {
    return [
        {
            Header: "Payer",
            accessor: "payerName",
            disableSortBy: true,

            Cell: ({ row: { original } }: PaymentCollectionRow) => (
                <div className="tw-min-w-0">
                    <p className="tw-mb-0 tw-text-sm tw-font-medium tw-text-gray-800">
                        {original.payerName || "—"}
                    </p>
                    <p className="tw-mb-0 tw-text-xs tw-text-gray-500">
                        {original.leadNumber ||
                            original.payerEmail ||
                            original.payerPhone ||
                            "—"}
                    </p>
                </div>
            ),
        },

        {
            Header: "Source",
            accessor: "source",
            disableSortBy: true,

            Cell: ({ row: { original } }: PaymentCollectionRow) => (
                <span className="badge badge-soft-info tw-whitespace-nowrap">
                    {titleCase(original.source)}
                </span>
            ),
        },

        {
            Header: "Form / link",
            accessor: "sourceName",
            disableSortBy: true,

            Cell: ({ row: { original } }: PaymentCollectionRow) => (
                <p className="tw-mb-0 tw-text-sm tw-text-gray-700">
                    {original.sourceName || (
                        <span className="tw-text-gray-400">—</span>
                    )}
                </p>
            ),
        },

        {
            Header: "Branch",
            accessor: "branchId",
            disableSortBy: true,

            Cell: ({ row: { original } }: PaymentCollectionRow) => (
                <p className="tw-mb-0 tw-whitespace-nowrap tw-text-sm tw-text-gray-700">
                    {branchNameFor(original.branchId) || (
                        <span className="tw-text-gray-400">Unassigned</span>
                    )}
                </p>
            ),
        },

        {
            Header: "Reference",
            accessor: "orderId",
            disableSortBy: true,

            Cell: ({ row: { original } }: PaymentCollectionRow) => (
                <div className="tw-min-w-0">
                    <p className="tw-mb-0 tw-font-mono tw-text-xs tw-text-[#405189]">
                        {original.orderId || "—"}
                    </p>
                    {original.transactionId && (
                        <p className="tw-mb-0 tw-font-mono tw-text-[11px] tw-text-gray-500">
                            {original.transactionId}
                        </p>
                    )}
                </div>
            ),
        },

        {
            Header: "Amount",
            accessor: "amount",
            disableSortBy: true,

            Cell: ({ row: { original } }: PaymentCollectionRow) => (
                <p className="tw-mb-0 tw-whitespace-nowrap tw-text-sm tw-font-semibold tw-text-gray-800">
                    {formatMoney(original.amount)}
                </p>
            ),
        },

        {
            Header: "Status",
            accessor: "status",
            disableSortBy: true,

            Cell: ({ row: { original } }: PaymentCollectionRow) => (
                <StatusLabel
                    type={collectionStatusTone(original.status)}
                    labelName={titleCase(original.status) || "Unknown"}
                />
            ),
        },

        {
            Header: "Date",
            accessor: "paidAt",
            disableSortBy: true,

            Cell: ({ row: { original } }: PaymentCollectionRow) => (
                <p className="tw-mb-0 tw-whitespace-nowrap tw-text-sm tw-text-gray-700">
                    {formatDate(original.paidAt || original.createdAt)}
                </p>
            ),
        },

        {
            Header: "Settlement",
            accessor: "settlementUtr",
            disableSortBy: true,

            Cell: ({ row: { original } }: PaymentCollectionRow) => (
                <p className="tw-mb-0 tw-font-mono tw-text-xs tw-text-gray-700">
                    {original.settlementUtr || (
                        <span className="tw-font-sans tw-text-gray-400">—</span>
                    )}
                </p>
            ),
        },
    ];
}
