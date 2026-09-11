import type { ChangeEvent } from "react";
import { toast } from "react-toastify";

export type FieldChangeEvent = ChangeEvent<
    HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
>;

export interface SettingsOption {
    id: string;
    name: string;
}

export interface BranchOption {
    id: string;
    name: string;
    shortName: string;
}

export interface BusinessUnitOption {
    id: string;
    name: string;
    industryType: string;
    description: string;
    color: string;
    leadCount: number;
    isDefault: boolean;
    compatibilityMode: "legacy_school" | "metadata";
    brandTitle?: string;
    brandSubtitle?: string;
    brandLogo?: string;
    helpUrl?: string;
    helpTitle?: string;
    helpSubtitle?: string;
}

export interface EmployeeOption {
    id: string;
    name: string;
    employeeNumber: string;
    employeeBranch: string;
    employeeBranchId: string;
    loginEmail: string;
    userId: string;
}

export interface CallingMember {
    id: string;
    name: string;
    number: string;
}

export interface SmartfloAgent {
    id: string;
    name: string;
    number: string;
}

export const activeStatusOptions: Array<SettingsOption> = [
    { id: "active", name: "Active" },
    { id: "inactive", name: "Inactive" },
];

export const formatDateTime = (value: string | undefined | null) =>
    value
        ? new Date(value).toLocaleString("en-IN", {
            dateStyle: "medium",
            timeStyle: "short",
        })
        : "—";

export const formatDate = (value: string | undefined | null) =>
    value
        ? new Date(value).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        })
        : "—";

export const formatMoney = (value: number | string | undefined | null) =>
    Number(value || 0).toLocaleString("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    });

export const titleCase = (value: string | undefined | null) =>
    String(value || "")
        .replace(/_/g, " ")
        .replace(/^./, character => character.toUpperCase());

export const getInitials = (name: string) =>
    String(name || "")
        .split(" ")
        .filter(Boolean)
        .map(part => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

export const secretPlaceholder = (isSet: boolean | undefined, ifEmpty: string) =>
    isSet ? "••••••••••••  (saved — type to replace)" : ifEmpty;

export const statusLabelType = (status: string | undefined | null) => {
    const value = String(status || "").toLowerCase();

    if (["active", "paid", "settled", "approved", "connected", "synced", "success"].includes(value)) {
        return "active";
    }

    if (["expired", "failed", "cancelled", "rejected", "error", "inactive"].includes(value)) {
        return "inactive";
    }

    return "pending";
};

export const copyToClipboard = async (
    text: string,
    label = "Copied to clipboard",
) => {
    try {
        await navigator.clipboard.writeText(text);
        toast.success(label);
    } catch {
        toast.error("Copy failed. Please copy it manually.");
    }
};

export const todayInputValue = () => new Date().toISOString().slice(0, 10);

export const toDateInputValue = (value: string | undefined | null) =>
    value ? String(value).slice(0, 10) : "";

export const settingsBranches: Array<BranchOption> = [
    { id: "1", name: "Nacharam", shortName: "NACHARAM" },
    { id: "2", name: "Kompally", shortName: "KOMPALLY" },
    { id: "3", name: "Bachupally", shortName: "BACHUPALLY" },
    { id: "4", name: "Mahendra Hills", shortName: "MHILLS" },
    { id: "5", name: "Nagole", shortName: "NAGOLE" },
];

export const settingsBusinessUnits: Array<BusinessUnitOption> = [
    {
        id: "1",
        name: "Digital Campus Schools",
        industryType: "K-12 Education",
        description: "Admissions across every campus.",
        color: "#0b7a4f",
        leadCount: 1284,
        isDefault: true,
        compatibilityMode: "legacy_school",
        brandTitle: "Digital Campus",
        brandSubtitle: "Admissions CRM",
        brandLogo: "",
        helpUrl: "https://wa.me/919000000000",
        helpTitle: "Need a hand?",
        helpSubtitle: "Talk to the admissions desk",
    },
    {
        id: "2",
        name: "Skill Academy",
        industryType: "Professional Training",
        description: "Short certification programmes for working professionals.",
        color: "#405189",
        leadCount: 316,
        isDefault: false,
        compatibilityMode: "metadata",
    },
    {
        id: "3",
        name: "Campus Realty",
        industryType: "Property Sales",
        description: "Residential enquiries for the campus township.",
        color: "#f7b84b",
        leadCount: 92,
        isDefault: false,
        compatibilityMode: "metadata",
    },
];

export const employeeMaster: Array<EmployeeOption> = [
    {
        id: "101",
        name: "Ananya Rao",
        employeeNumber: "EMP-1041",
        employeeBranch: "Nacharam",
        employeeBranchId: "1",
        loginEmail: "ananya.rao@digitalcampus.in",
        userId: "11",
    },
    {
        id: "102",
        name: "Vikram Shetty",
        employeeNumber: "EMP-1063",
        employeeBranch: "Kompally",
        employeeBranchId: "2",
        loginEmail: "vikram.shetty@digitalcampus.in",
        userId: "12",
    },
    {
        id: "103",
        name: "Sneha Menon",
        employeeNumber: "EMP-1092",
        employeeBranch: "Bachupally",
        employeeBranchId: "3",
        loginEmail: "sneha.menon@digitalcampus.in",
        userId: "",
    },
    {
        id: "104",
        name: "Rahul Iyer",
        employeeNumber: "EMP-1117",
        employeeBranch: "Mahendra Hills",
        employeeBranchId: "4",
        loginEmail: "rahul.iyer@digitalcampus.in",
        userId: "",
    },
    {
        id: "105",
        name: "Fatima Sheikh",
        employeeNumber: "EMP-1128",
        employeeBranch: "Nagole",
        employeeBranchId: "5",
        loginEmail: "fatima.sheikh@digitalcampus.in",
        userId: "",
    },
    {
        id: "106",
        name: "Joseph Thomas",
        employeeNumber: "EMP-1140",
        employeeBranch: "Nacharam",
        employeeBranchId: "1",
        loginEmail: "joseph.thomas@digitalcampus.in",
        userId: "",
    },
];

export const callerDeskMembers: Array<CallingMember> = [
    { id: "CD-201", name: "Ananya Rao", number: "9100000201" },
    { id: "CD-202", name: "Vikram Shetty", number: "9100000202" },
    { id: "CD-203", name: "Sneha Menon", number: "9100000203" },
    { id: "CD-204", name: "Rahul Iyer", number: "9100000204" },
];

export const callerDeskGroups: Array<SettingsOption> = [
    { id: "G-1", name: "Admissions Desk" },
    { id: "G-2", name: "Senior Counsellors" },
    { id: "G-3", name: "Transport Helpline" },
];

export const callerDeskDeskphones: Array<SettingsOption> = [
    { id: "DID-11", name: "04023456789" },
    { id: "DID-12", name: "04023456790" },
    { id: "DID-13", name: "04023456791" },
];

export const smartfloAgents: Array<SmartfloAgent> = [
    { id: "SF-301", name: "Ananya Rao", number: "9100000301" },
    { id: "SF-302", name: "Vikram Shetty", number: "9100000302" },
    { id: "SF-303", name: "Fatima Sheikh", number: "9100000303" },
];

export const smartfloDepartments: Array<SettingsOption> = [
    { id: "D-1", name: "Admissions" },
    { id: "D-2", name: "Fee Collections" },
];

export const smartfloNumbers: Array<SettingsOption> = [
    { id: "SFD-1", name: "04044556677" },
    { id: "SFD-2", name: "04044556678" },
];

export const smartfloIvrs: Array<SettingsOption> = [
    { id: "IVR-1", name: "Main Admissions IVR" },
    { id: "IVR-2", name: "After-hours IVR" },
];
