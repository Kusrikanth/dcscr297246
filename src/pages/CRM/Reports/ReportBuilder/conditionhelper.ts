import type { ConditionNode, ReportField, ReportRecord } from "../helper";
import { leadFieldValue } from "../helper";

let conditionSequence = 0;

const nextConditionId = () => {
    conditionSequence += 1;
    return `cond_${conditionSequence}`;
};

export const makeCondition = (): ConditionNode => ({
    id: nextConditionId(),
    kind: "condition",
    field: "",
    operator: "equals",
    value: "",
});

export const makeGroup = (logic: "AND" | "OR" = "AND"): ConditionNode => ({
    id: nextConditionId(),
    kind: "group",
    logic,
    children: [makeCondition()],
});

function quoteConditionValue(value: unknown, type: string | undefined) {
    if (["number", "currency", "decimal", "integer"].includes(String(type)) && value !== "") {
        return String(Number(value));
    }
    return `"${String(value).replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

export function conditionExpression(
    node: ConditionNode,
    fields: Array<ReportField>
): string {
    if (node.kind === "group") {
        return `(${(node.children || [])
            .map(child => conditionExpression(child, fields))
            .filter(Boolean)
            .join(` ${node.logic === "OR" ? "||" : "&&"} `)})`;
    }

    const field = fields.find(item => item.id === node.field);
    if (!field) {
        return "";
    }

    const reference = `[${field.label}]`;
    const value = quoteConditionValue(node.value, field.type);

    if (node.operator === "is_blank") return `ISBLANK(${reference})`;
    if (node.operator === "is_not_blank") return `NOT(ISBLANK(${reference}))`;
    if (node.operator === "contains") return `CONTAINSSTRING(${reference}, ${value})`;
    if (node.operator === "not_contains") return `NOT(CONTAINSSTRING(${reference}, ${value}))`;
    if (node.operator === "starts_with") return `STARTSWITH(${reference}, ${value})`;
    if (node.operator === "ends_with") return `ENDSWITH(${reference}, ${value})`;

    if (["in", "not_in"].includes(String(node.operator))) {
        const values = Array.isArray(node.value)
            ? node.value
            : String(node.value || "")
                .split(",")
                .map(item => item.trim())
                .filter(Boolean);

        return `${reference} ${node.operator === "not_in" ? "NOT IN" : "IN"} {${values
            .map(item => quoteConditionValue(item, field.type))
            .join(", ")}}`;
    }

    if (node.operator === "today") return `${reference} = TODAY()`;
    if (node.operator === "yesterday") return `${reference} = TODAY() - 1`;
    if (node.operator === "last_x_days") return `${reference} >= TODAY() - ${Number(node.value) || 0}`;

    const symbol =
        ({
            equals: "=",
            not_equals: "<>",
            greater_than: ">",
            greater_equal: ">=",
            less_than: "<",
            less_equal: "<=",
            before: "<",
            after: ">",
            on_or_before: "<=",
            on_or_after: ">=",
        } as Record<string, string>)[String(node.operator)] || String(node.operator);

    return `${reference} ${symbol} ${value}`;
}

export function conditionFieldValues(field: ReportField | undefined, rows: Array<ReportRecord>) {
    if (!field) {
        return [];
    }

    const values = rows
        .map(record => leadFieldValue(record, field.id))
        .filter(value => value !== null && value !== undefined && value !== "")
        .map(value => {
            if (field.type === "date") return String(value).slice(0, 10);
            if (field.type === "datetime") return String(value).replace(" ", "T").slice(0, 16);
            if (typeof value === "boolean") return value ? "true" : "false";
            return String(value);
        });

    return [...new Set(values)]
        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
        .slice(0, 250);
}
