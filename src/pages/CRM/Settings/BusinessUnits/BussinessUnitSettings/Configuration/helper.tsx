export interface ConfigSectionValue {
    id: string;
    code: string;
    displayName: string;
    position: number;
    isActive: boolean;
    children: Array<{
        id: string;
        code: string;
        displayName: string;
        position: number;
        isActive: boolean;
    }>;
}

export interface ConfigSection {
    id: string;
    displayName: string;
    description: string;
    placeholder: string;
    sectionType: string;
    childLabel: string;
    childPlaceholder: string;
    parentSectionId: string;
    pipelineId: string;
    isActive: boolean;
    values: Array<ConfigSectionValue>;
}

export interface ConfigLinkRow {
    id: string;
    branchId: string;
    keyValueIds: Array<string>;
    resultValueIds: Array<string>;
}

export interface ConfigLinkRule {
    id: string;
    displayName: string;
    description: string;
    pipelineId: string;
    includesBranch: boolean;
    keySectionIds: Array<string>;
    resultSectionId: string;
    isActive: boolean;
    rows: Array<ConfigLinkRow>;
}

export const configSections: Array<ConfigSection> = [
    {
        id: "1",
        displayName: "Programmes",
        description: "What this unit sells or admits into",
        placeholder: "Select a programme",
        sectionType: "list",
        childLabel: "",
        childPlaceholder: "",
        parentSectionId: "",
        pipelineId: "",
        isActive: true,
        values: [
            {
                id: "v1",
                code: "DAY",
                displayName: "Day School",
                position: 1,
                isActive: true,
                children: [],
            },
            {
                id: "v2",
                code: "BOARD",
                displayName: "Boarding",
                position: 2,
                isActive: true,
                children: [],
            },
            {
                id: "v3",
                code: "JC",
                displayName: "Junior College",
                position: 3,
                isActive: true,
                children: [],
            },
        ],
    },
    {
        id: "2",
        displayName: "Intake Terms",
        description: "When a programme starts",
        placeholder: "Select an intake",
        sectionType: "list",
        childLabel: "",
        childPlaceholder: "",
        parentSectionId: "1",
        pipelineId: "",
        isActive: true,
        values: [
            {
                id: "v4",
                code: "T1",
                displayName: "Term 1",
                position: 1,
                isActive: true,
                children: [],
            },
            {
                id: "v5",
                code: "T2",
                displayName: "Term 2",
                position: 2,
                isActive: true,
                children: [],
            },
            {
                id: "v6",
                code: "MID",
                displayName: "Mid-year",
                position: 3,
                isActive: false,
                children: [],
            },
        ],
    },
    {
        id: "3",
        displayName: "Courses",
        description: "Offered per branch and intake",
        placeholder: "Select a course",
        sectionType: "hierarchy",
        childLabel: "Specialisation",
        childPlaceholder: "Select a specialisation",
        parentSectionId: "2",
        pipelineId: "",
        isActive: true,
        values: [
            {
                id: "v7",
                code: "SCI",
                displayName: "Science",
                position: 1,
                isActive: true,
                children: [
                    {
                        id: "v7a",
                        code: "MPC",
                        displayName: "MPC",
                        position: 1,
                        isActive: true,
                    },
                    {
                        id: "v7b",
                        code: "BIPC",
                        displayName: "BiPC",
                        position: 2,
                        isActive: true,
                    },
                ],
            },
            {
                id: "v8",
                code: "COM",
                displayName: "Commerce",
                position: 2,
                isActive: true,
                children: [
                    {
                        id: "v8a",
                        code: "MEC",
                        displayName: "MEC",
                        position: 1,
                        isActive: true,
                    },
                ],
            },
            {
                id: "v9",
                code: "ARTS",
                displayName: "Arts",
                position: 3,
                isActive: true,
                children: [],
            },
        ],
    },
    {
        id: "4",
        displayName: "Transport Routes",
        description: "Routes offered to transport enquiries",
        placeholder: "Select a route",
        sectionType: "list",
        childLabel: "",
        childPlaceholder: "",
        parentSectionId: "",
        pipelineId: "2",
        isActive: true,
        values: [
            {
                id: "v10",
                code: "R1",
                displayName: "Route 1 — Nacharam",
                position: 1,
                isActive: true,
                children: [],
            },
            {
                id: "v11",
                code: "R2",
                displayName: "Route 2 — Kompally",
                position: 2,
                isActive: true,
                children: [],
            },
        ],
    },
];

export const configLinkRules: Array<ConfigLinkRule> = [
    {
        id: "1",
        displayName: "Courses by branch and intake",
        description: "Which courses a branch offers in a given intake",
        pipelineId: "",
        includesBranch: true,
        keySectionIds: ["2"],
        resultSectionId: "3",
        isActive: true,
        rows: [
            {
                id: "r1",
                branchId: "1",
                keyValueIds: ["v4"],
                resultValueIds: ["v7", "v8"],
            },
            {
                id: "r2",
                branchId: "1",
                keyValueIds: ["v5"],
                resultValueIds: ["v7"],
            },
            {
                id: "r3",
                branchId: "2",
                keyValueIds: ["v4"],
                resultValueIds: ["v8", "v9"],
            },
        ],
    },
    {
        id: "2",
        displayName: "Routes by branch",
        description: "",
        pipelineId: "2",
        includesBranch: true,
        keySectionIds: [],
        resultSectionId: "4",
        isActive: true,
        rows: [
            {
                id: "r4",
                branchId: "2",
                keyValueIds: [],
                resultValueIds: ["v10", "v11"],
            },
        ],
    },
];

export const sectionPathOf = (
    sections: Array<ConfigSection>,
    section: ConfigSection,
) => {
    const names = [section.displayName];
    const seen = new Set<string>();
    let cursor = section.parentSectionId;

    while (cursor && !seen.has(cursor)) {
        seen.add(cursor);

        const parent = sections.find(item => item.id === cursor);

        if (!parent) {
            break;
        }

        names.unshift(parent.displayName);
        cursor = parent.parentSectionId;
    }

    return names.join(" › ");
};

export const descendantIdsOf = (
    sections: Array<ConfigSection>,
    sectionId: string,
) => {
    const found = new Set<string>();

    const visit = (parentId: string) => {
        sections
            .filter(section => section.parentSectionId === parentId)
            .forEach(child => {
                found.add(child.id);
                visit(child.id);
            });
    };

    visit(sectionId);

    return found;
};

export const buildSectionTree = (
    sections: Array<ConfigSection>,
    collapsedIds: Array<string>,
) => {
    const rows: Array<{
        section: ConfigSection;
        depth: number;
        hasChildren: boolean;
    }> = [];

    const walk = (parentId: string, depth: number) => {
        sections
            .filter(section => (section.parentSectionId || "") === parentId)
            .forEach(section => {
                const children = sections.filter(
                    item => item.parentSectionId === section.id,
                );

                rows.push({
                    section,
                    depth,
                    hasChildren: children.length > 0,
                });

                if (children.length && !collapsedIds.includes(section.id)) {
                    walk(section.id, depth + 1);
                }
            });
    };

    walk("", 0);

    return rows;
};

export const valuesOfSection = (
    sections: Array<ConfigSection>,
    sectionId: string,
) =>
    (sections.find(section => section.id === sectionId)?.values || []).map(
        value => ({ id: value.id, name: value.displayName }),
    );

export const sectionCountText = (section: ConfigSection) =>
    section.sectionType === "hierarchy"
        ? `${section.values.length} ${section.displayName}, ${section.values.reduce(
            (total, value) => total + value.children.length,
            0,
        )} ${section.childLabel || "sub-values"}`
        : `${section.values.length} values`;
