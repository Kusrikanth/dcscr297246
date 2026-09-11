import type { SettingsOption } from "../../helper";

export interface BulkLinkRow {
    rowNumber: number;
    phone: string;
    name: string;
    email: string;
    amount: string;
    error: string;
}

export interface BulkLinkBatchRow {
    id: string;
    rowNumber: number;
    phone: string;
    name: string;
    amount: number;
    leadNumber: string;
    status: string;
    paymentStatus: string;
    error: string;
}

export interface BulkLinkBatch {
    id: string;
    fileName: string;
    branchId: string;
    branchName: string;
    templateName: string;
    createdBy: string;
    createdAt: string;
    totalRows: number;
    totalAmount: number;
    paidRows: number;
    paidAmount: number;
    status: string;
    rows: Array<BulkLinkBatchRow>;
}

export const bulkLinkStatusOptions: Array<SettingsOption> = [
    { id: "queued", name: "Queued" },
    { id: "running", name: "Running" },
    { id: "completed", name: "Completed" },
    { id: "cancelled", name: "Cancelled" },
];

export const whatsappTemplateOptions: Array<SettingsOption> = [
    { id: "1", name: "fee_reminder_link" },
    { id: "2", name: "transport_fee_due" },
];

export const whatsappAccountOptions: Array<SettingsOption> = [
    { id: "1", name: "Digital Campus Admissions" },
    { id: "2", name: "Digital Campus Transport" },
];

export const templateBodies: Record<string, string> = {
    "1": "Hello {{1}}, the application fee of ₹{{2}} is due. Pay securely here: {{3}}",
    "2": "Hi {{1}}, your transport fee of ₹{{2}} is pending. Use this link: {{3}}",
};

export const batchStatusTone = (status: string) => {
    if (status === "completed") {
        return "active";
    }

    if (status === "cancelled") {
        return "failed";
    }

    if (status === "running") {
        return "pending";
    }

    return "new";
};

export const rowStatusTone = (status: string) => {
    if (status === "paid" || status === "sent") {
        return "active";
    }

    if (status === "failed") {
        return "failed";
    }

    return "new";
};

export const sampleCsvRows = [
    ["phone", "name", "email", "amount"],
    ["9XXXXXXXXX", "Ravi Kumar", "ravi.kumar@example.com", "2500"],
    ["9XXXXXXXXX", "", "", "1200.50"],
    ["9XXXXXXXXX", "Anita Sharma", "", "750"],
];

export const bulkLinkBatches: Array<BulkLinkBatch> = [
    {
        id: "1",
        fileName: "term-2-fees-aug-2026.csv",
        branchId: "1",
        branchName: "Mahendra Hills",
        templateName: "fee_reminder_link",
        createdBy: "Srikanth Reddy",
        createdAt: "2026-08-18T19:40:00",
        totalRows: 412,
        totalAmount: 4326000,
        paidRows: 188,
        paidAmount: 1974000,
        status: "completed",
        rows: [
            {
                id: "1-1",
                rowNumber: 1,
                phone: "9840012345",
                name: "Meera Krishnan",
                amount: 10500,
                leadNumber: "LEAD-24118",
                status: "paid",
                paymentStatus: "settled",
                error: "",
            },
            {
                id: "1-2",
                rowNumber: 2,
                phone: "9701234567",
                name: "",
                amount: 10500,
                leadNumber: "",
                status: "sent",
                paymentStatus: "order_created",
                error: "",
            },
            {
                id: "1-3",
                rowNumber: 3,
                phone: "9963012345",
                name: "Kiran Rao",
                amount: 8000,
                leadNumber: "LEAD-24096",
                status: "failed",
                paymentStatus: "",
                error: "WhatsApp delivery failed — number not on WhatsApp",
            },
        ],
    },
    {
        id: "2",
        fileName: "transport-slab-b.csv",
        branchId: "2",
        branchName: "Nacharam",
        templateName: "transport_fee_due",
        createdBy: "ARJUN",
        createdAt: "2026-08-19T09:05:00",
        totalRows: 96,
        totalAmount: 1152000,
        paidRows: 12,
        paidAmount: 144000,
        status: "running",
        rows: [
            {
                id: "2-1",
                rowNumber: 1,
                phone: "9848098765",
                name: "Suhas Bhat",
                amount: 12000,
                leadNumber: "",
                status: "sent",
                paymentStatus: "order_created",
                error: "",
            },
            {
                id: "2-2",
                rowNumber: 2,
                phone: "9700112233",
                name: "Vivek Anand",
                amount: 12000,
                leadNumber: "LEAD-24101",
                status: "paid",
                paymentStatus: "paid",
                error: "",
            },
        ],
    },
    {
        id: "3",
        fileName: "alumni-pledges.csv",
        branchId: "1",
        branchName: "Mahendra Hills",
        templateName: "",
        createdBy: "TARUN",
        createdAt: "2026-08-11T14:22:00",
        totalRows: 58,
        totalAmount: 290000,
        paidRows: 0,
        paidAmount: 0,
        status: "cancelled",
        rows: [],
    },
];

const normalizePhone = (value: string) => {
    const digits = String(value || "").replace(/\D/g, "");

    if (digits.length === 12 && digits.startsWith("91")) {
        return digits.slice(2);
    }

    if (digits.length === 11 && digits.startsWith("0")) {
        return digits.slice(1);
    }

    return digits.slice(-10);
};

const headerAliases: Record<string, Array<string>> = {
    phone: ["phone", "mobile", "mobile number", "phone number", "number", "contact", "whatsapp"],
    amount: ["amount", "fee", "due", "amount due", "payable", "value"],
    name: ["name", "student name", "parent name", "payer name"],
    email: ["email", "email address", "mail"],
};

const parseCsvLine = (line: string) => {
    const cells: Array<string> = [];
    let value = "";
    let isQuoted = false;

    for (let index = 0; index < line.length; index += 1) {
        const character = line[index];

        if (character === '"') {
            if (isQuoted && line[index + 1] === '"') {
                value += '"';
                index += 1;
            } else {
                isQuoted = !isQuoted;
            }
        } else if (character === "," && !isQuoted) {
            cells.push(value.trim());
            value = "";
        } else {
            value += character;
        }
    }

    cells.push(value.trim());

    return cells;
};

export const parseBulkLinkFile = (text: string) => {
    const lines = String(text || "")
        .split(/\r?\n/)
        .filter(line => line.trim());

    if (!lines.length) {
        return { rows: [] as Array<BulkLinkRow>, error: "The file is empty" };
    }

    const header = parseCsvLine(lines[0]).map(cell =>
        cell.toLowerCase().replace(/^"|"$/g, ""),
    );
    const columnFor = (key: string) =>
        header.findIndex(cell => headerAliases[key].includes(cell));

    const phoneAt = columnFor("phone");
    const amountAt = columnFor("amount");

    if (phoneAt < 0) {
        return {
            rows: [] as Array<BulkLinkRow>,
            error: 'No mobile number column found. Name it "phone" or "mobile".',
        };
    }

    if (amountAt < 0) {
        return {
            rows: [] as Array<BulkLinkRow>,
            error: 'No amount column found. Name it "amount".',
        };
    }

    const nameAt = columnFor("name");
    const emailAt = columnFor("email");
    const seen = new Map<string, number>();

    const rows = lines.slice(1).map((line, index) => {
        const cells = parseCsvLine(line);
        const phone = String(cells[phoneAt] || "").trim();
        const amount = String(cells[amountAt] || "")
            .trim()
            .replace(/[₹,\s]/g, "");
        const normalized = normalizePhone(phone);
        const numericAmount = Number(amount);

        let error = "";

        if (!normalized) {
            error = "No mobile number";
        } else if (!/^[6-9]\d{9}$/.test(normalized)) {
            error = "Not a valid Indian mobile number";
        } else if (seen.has(normalized)) {
            error = `Duplicate of row ${seen.get(normalized)}`;
        } else if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
            error = "Amount must be greater than zero";
        }

        if (!error) {
            seen.set(normalized, index + 1);
        }

        return {
            rowNumber: index + 1,
            phone,
            name: nameAt >= 0 ? String(cells[nameAt] || "").trim() : "",
            email: emailAt >= 0 ? String(cells[emailAt] || "").trim() : "",
            amount,
            error,
        };
    });

    return { rows, error: "" };
};

export const placeholderCount = (body: string) => {
    const found = new Set(String(body || "").match(/\{\{(\d+)\}\}/g) || []);

    return found.size
        ? Math.max(...[...found].map(token => Number(token.replace(/\D/g, ""))))
        : 0;
};

export const moneyText = (value: number) =>
    Number(value || 0).toLocaleString("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    });
