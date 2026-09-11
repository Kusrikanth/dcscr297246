export interface PermissionEntry {
    key: string;
    action: string;
    isScoped: boolean;
}

export interface PermissionTab {
    tab: string;
    label: string;
    actions: Array<PermissionEntry>;
}

export interface PermissionScreen {
    screen: string;
    label: string;
    actions: Array<PermissionEntry>;
    tabs?: Array<PermissionTab>;
}

export interface PermissionModule {
    module: string;
    label: string;
    screens: Array<PermissionScreen>;
}

export interface AccessRole {
    id: string;
    name: string;
    description: string;
    isActive: boolean;
    isSuperAdmin: boolean;
    userIds: Array<string>;
    grants: Record<string, string>;
}

export const scopeLabels: Record<string, string> = {
    own: "Own records",
    team: "Team records",
    department: "Department records",
    all: "All records",
};

export const accessPresets = [
    { key: "no_access", label: "No Access" },
    { key: "view_only", label: "View Only" },
    { key: "full_access", label: "Full Access" },
];

const entries = (
    prefix: string,
    actions: Array<string>,
    scopedActions: Array<string> = [],
): Array<PermissionEntry> =>
    actions.map(action => ({
        key: `${prefix}.${action}`,
        action,
        isScoped: scopedActions.includes(action),
    }));

export const permissionRegistry: Array<PermissionModule> = [
    {
        module: "leads",
        label: "Leads",
        screens: [
            {
                screen: "leads.list",
                label: "Lead list",
                actions: entries(
                    "leads.list",
                    ["view", "create", "edit", "delete", "export", "import", "assign"],
                    ["view", "edit", "delete", "export", "assign"],
                ),
                tabs: [
                    {
                        tab: "leads.followups",
                        label: "Follow-ups",
                        actions: entries(
                            "leads.followups",
                            ["view", "create", "edit"],
                            ["view", "edit"],
                        ),
                    },
                    {
                        tab: "leads.bulk",
                        label: "Bulk actions",
                        actions: entries("leads.bulk", ["view", "execute"], ["execute"]),
                    },
                ],
            },
        ],
    },
    {
        module: "tracker",
        label: "Tracker",
        screens: [
            {
                screen: "tracker.action_items",
                label: "Action items",
                actions: entries(
                    "tracker.action_items",
                    ["view", "create", "edit", "delete"],
                    ["view", "edit", "delete"],
                ),
            },
            {
                screen: "tracker.approvals",
                label: "Approvals",
                actions: entries("tracker.approvals", ["view", "approve", "reject"]),
            },
        ],
    },
    {
        module: "whatsapp",
        label: "WhatsApp",
        screens: [
            {
                screen: "whatsapp.inbox",
                label: "Inbox",
                actions: entries(
                    "whatsapp.inbox",
                    ["view", "send"],
                    ["view"],
                ),
            },
            {
                screen: "whatsapp.templates",
                label: "Templates",
                actions: entries("whatsapp.templates", ["view", "create", "edit", "delete"]),
            },
        ],
    },
    {
        module: "automations",
        label: "Automations",
        screens: [
            {
                screen: "automations.rules",
                label: "Automation rules",
                actions: entries("automations.rules", [
                    "view",
                    "create",
                    "edit",
                    "delete",
                    "run",
                ]),
            },
        ],
    },
    {
        module: "reports",
        label: "Reports",
        screens: [
            {
                screen: "reports.library",
                label: "Report library",
                actions: entries(
                    "reports.library",
                    ["view", "create", "edit", "delete", "export"],
                    ["view", "export"],
                ),
            },
        ],
    },
    {
        module: "payments",
        label: "Payments",
        screens: [
            {
                screen: "payments.forms",
                label: "Payment forms",
                actions: entries("payments.forms", ["view", "create", "edit", "delete"]),
            },
            {
                screen: "payments.collections",
                label: "Collections",
                actions: entries(
                    "payments.collections",
                    ["view", "export"],
                    ["view", "export"],
                ),
            },
            {
                screen: "payments.enquiry_forms",
                label: "Enquiry forms",
                actions: entries("payments.enquiry_forms", [
                    "view",
                    "create",
                    "edit",
                    "delete",
                ]),
            },
        ],
    },
    {
        module: "settings",
        label: "Settings",
        screens: [
            {
                screen: "settings.users",
                label: "User management",
                actions: entries("settings.users", ["view", "create", "edit"]),
            },
            {
                screen: "settings.access_control",
                label: "Access control",
                actions: entries("settings.access_control", [
                    "view",
                    "create",
                    "edit",
                    "delete",
                    "assign",
                ]),
            },
            {
                screen: "settings.business_units",
                label: "Business units",
                actions: entries("settings.business_units", ["view", "create", "edit", "delete"]),
            },
            {
                screen: "settings.branches",
                label: "Branch settings",
                actions: entries("settings.branches", ["view", "edit"]),
            },
            {
                screen: "settings.integrations",
                label: "Integrations",
                actions: entries("settings.integrations", ["view", "edit"]),
            },
            {
                screen: "settings.templates",
                label: "Templates",
                actions: entries("settings.templates", ["view", "create", "edit", "delete"]),
            },
        ],
    },
];

export const entriesUnder = (
    node: PermissionModule | PermissionScreen,
): Array<PermissionEntry> => {
    const collected: Array<PermissionEntry> = [];

    const collect = (screen: PermissionScreen) => {
        screen.actions.forEach(entry => collected.push(entry));
        (screen.tabs || []).forEach(tab =>
            tab.actions.forEach(entry => collected.push(entry)),
        );
    };

    if ("screens" in node) {
        node.screens.forEach(collect);
    } else {
        collect(node);
    }

    return collected;
};

export const applyPresetToGrants = (
    grants: Record<string, string>,
    targets: Array<PermissionEntry>,
    preset: string,
) => {
    const next = { ...grants };

    targets.forEach(entry => {
        if (preset === "no_access") {
            delete next[entry.key];
            return;
        }

        if (preset === "full_access") {
            next[entry.key] = entry.isScoped ? "all" : "none";
            return;
        }

        if (entry.action === "view") {
            next[entry.key] = entry.isScoped ? "all" : "none";
        } else {
            delete next[entry.key];
        }
    });

    return next;
};

const grantEverything = () =>
    permissionRegistry
        .flatMap(entriesUnder)
        .reduce<Record<string, string>>((grants, entry) => {
            grants[entry.key] = entry.isScoped ? "all" : "none";
            return grants;
        }, {});

const viewOnlyGrants = (modules: Array<string>) =>
    permissionRegistry
        .filter(module => modules.includes(module.module))
        .flatMap(entriesUnder)
        .filter(entry => entry.action === "view")
        .reduce<Record<string, string>>((grants, entry) => {
            grants[entry.key] = entry.isScoped ? "all" : "none";
            return grants;
        }, {});

export const accessRoles: Array<AccessRole> = [
    {
        id: "1",
        name: "Super Admin",
        description: "Unrestricted access to every CRM screen.",
        isActive: true,
        isSuperAdmin: true,
        userIds: ["11"],
        grants: grantEverything(),
    },
    {
        id: "2",
        name: "CRM Administrator",
        description: "Runs the CRM day to day, short of access control.",
        isActive: true,
        isSuperAdmin: false,
        userIds: ["11"],
        grants: {
            ...viewOnlyGrants([
                "leads",
                "tracker",
                "whatsapp",
                "automations",
                "reports",
                "payments",
                "settings",
            ]),
            "leads.list.create": "none",
            "leads.list.edit": "all",
            "leads.list.export": "all",
            "leads.list.assign": "all",
            "tracker.action_items.create": "none",
            "tracker.action_items.edit": "all",
            "payments.forms.create": "none",
            "payments.forms.edit": "none",
            "settings.users.create": "none",
            "settings.users.edit": "none",
        },
    },
    {
        id: "3",
        name: "Branch Manager",
        description: "Manages the leads and counsellors of assigned branches.",
        isActive: true,
        isSuperAdmin: false,
        userIds: ["12"],
        grants: {
            ...viewOnlyGrants(["leads", "tracker", "whatsapp", "reports"]),
            "leads.list.view": "team",
            "leads.list.create": "none",
            "leads.list.edit": "team",
            "leads.list.assign": "team",
            "leads.list.export": "team",
            "leads.followups.view": "team",
            "leads.followups.create": "none",
            "leads.followups.edit": "team",
            "reports.library.view": "team",
            "reports.library.export": "team",
        },
    },
    {
        id: "4",
        name: "Counsellor",
        description: "Works their own leads and logs follow-ups.",
        isActive: true,
        isSuperAdmin: false,
        userIds: ["13", "15"],
        grants: {
            "leads.list.view": "own",
            "leads.list.create": "none",
            "leads.list.edit": "own",
            "leads.followups.view": "own",
            "leads.followups.create": "none",
            "leads.followups.edit": "own",
            "whatsapp.inbox.view": "own",
            "whatsapp.inbox.send": "none",
            "tracker.action_items.view": "own",
            "reports.library.view": "own",
        },
    },
    {
        id: "5",
        name: "Telecaller",
        description: "Calls new enquiries and records the outcome.",
        isActive: true,
        isSuperAdmin: false,
        userIds: ["14"],
        grants: {
            "leads.list.view": "own",
            "leads.list.edit": "own",
            "leads.followups.view": "own",
            "leads.followups.create": "none",
            "whatsapp.inbox.view": "own",
        },
    },
    {
        id: "6",
        name: "Viewer",
        description: "Read-only access, used for audits.",
        isActive: false,
        isSuperAdmin: false,
        userIds: [],
        grants: viewOnlyGrants(["leads", "reports"]),
    },
];
