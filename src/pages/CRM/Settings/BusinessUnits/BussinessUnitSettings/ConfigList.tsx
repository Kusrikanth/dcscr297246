import type { ReactNode } from "react";
import Button from "../../../../../Components/Common/Button";
import { MenuOptionHrtl } from "../../../../../Components/Common";
import type { IOptionsHrtl } from "../../../../../Components/Common/MenuOptions";

export interface ConfigRow {
    id: string;
    title: string;
    subtitle: string;
    badges: Array<string>;
    color?: string;
    canMoveUp?: boolean;
    canMoveDown?: boolean;
    canDelete?: boolean;
}

interface ConfigListProps {
    title: string;
    description: string;
    actionLabel?: string;
    rows: Array<ConfigRow>;
    emptyIcon?: string;
    children?: ReactNode;
    onAdd?: () => void;
    onEdit?: (row: ConfigRow) => void;
    onDelete?: (row: ConfigRow) => void;
    onMove?: (row: ConfigRow, direction: "up" | "down") => void;
}

function buildRowActions(
    row: ConfigRow,
    handlers: Pick<ConfigListProps, "onEdit" | "onDelete" | "onMove">,
): Array<IOptionsHrtl> {
    const { onEdit, onDelete, onMove } = handlers;

    return [
        ...(onMove
            ? [
                {
                    id: "moveUp",
                    actionIcon: (
                        <i
                            className={`ri-arrow-up-line ${row.canMoveUp ? "tw-text-gray-500" : "tw-text-gray-300"}`}
                        ></i>
                    ),
                    actionName: `Move ${row.title} Up`,
                    disabled: !row.canMoveUp,
                    onClickHndlr: () => row.canMoveUp && onMove(row, "up"),
                },
                {
                    id: "moveDown",
                    actionIcon: (
                        <i
                            className={`ri-arrow-down-line ${row.canMoveDown ? "tw-text-gray-500" : "tw-text-gray-300"}`}
                        ></i>
                    ),
                    actionName: `Move ${row.title} Down`,
                    disabled: !row.canMoveDown,
                    onClickHndlr: () => row.canMoveDown && onMove(row, "down"),
                },
            ]
            : []),
        ...(onEdit
            ? [
                {
                    id: "edit",
                    actionIcon: <i className="ri-pencil-line tw-text-gray-500"></i>,
                    actionName: `Edit ${row.title}`,
                    onClickHndlr: () => onEdit(row),
                },
            ]
            : []),
        ...(onDelete && row.canDelete !== false
            ? [
                {
                    id: "delete",
                    actionIcon: <i className="ri-delete-bin-line tw-text-danger"></i>,
                    actionName: `Delete ${row.title}`,
                    onClickHndlr: () => onDelete(row),
                },
            ]
            : []),
    ];
}

const ConfigList = ({
    title,
    description,
    actionLabel,
    rows,
    emptyIcon = "ri-settings-3-line",
    children,
    onAdd,
    onEdit,
    onDelete,
    onMove,
}: ConfigListProps) => (
    <div className="tw-card">
        <div className="tw-card-body">
            <div className="tw-flex tw-flex-wrap tw-items-start tw-justify-between tw-gap-2">
                <div className="tw-min-w-0">
                    <p className="tw-mb-0 tw-text-base tw-font-semibold tw-text-gray-800">
                        {title}
                    </p>
                    <p className="tw-mb-0 tw-text-sm tw-text-gray-500">
                        {description}
                    </p>
                </div>

                {onAdd && (
                    <Button
                        type="button"
                        variant="primary"
                        onClick={onAdd}
                    >
                        <i className="ri-add-line tw-me-1"></i>
                        {actionLabel || "Add"}
                    </Button>
                )}
            </div>

            {children}

            <div className="tw-mt-3 tw-flex tw-flex-col tw-gap-2">
                {rows.map(row => (
                    <div
                        key={row.id}
                        className="tw-flex tw-flex-wrap tw-items-center tw-gap-3 tw-rounded tw-border tw-border-gray-200 tw-p-3"
                    >
                        <span
                            className="tw-grid tw-h-9 tw-w-9 tw-flex-shrink-0 tw-place-items-center tw-rounded"
                            style={
                                row.color
                                    ? { backgroundColor: row.color, color: "#fff" }
                                    : {
                                        backgroundColor: "#eef1f7",
                                        color: "#405189",
                                    }
                            }
                        >
                            <i className="ri-price-tag-3-line"></i>
                        </span>

                        <div className="tw-min-w-0 tw-flex-1">
                            <p className="tw-mb-0 tw-text-sm tw-font-medium tw-text-gray-800">
                                {row.title}
                            </p>
                            <p className="tw-mb-0 tw-text-xs tw-text-gray-500">
                                {row.subtitle}
                            </p>
                        </div>

                        <div className="tw-flex tw-flex-wrap tw-gap-1">
                            {row.badges.filter(Boolean).map(badge => (
                                <span
                                    key={badge}
                                    className="badge badge-soft-secondary tw-whitespace-nowrap"
                                >
                                    {badge}
                                </span>
                            ))}
                        </div>

                        {(onEdit || onDelete || onMove) && (
                            <div className="tw-flex-shrink-0">
                                <MenuOptionHrtl
                                    actionOptions={buildRowActions(row, {
                                        onEdit,
                                        onDelete,
                                        onMove,
                                    })}
                                    rowId={row.id}
                                />
                            </div>
                        )}
                    </div>
                ))}

                {!rows.length && (
                    <div className="tw-rounded tw-border tw-border-dashed tw-border-gray-200 tw-py-6 tw-text-center">
                        <i className={`${emptyIcon} tw-text-3xl tw-text-gray-300`}></i>
                        <p className="tw-mb-0 tw-mt-2 tw-text-sm tw-font-medium tw-text-gray-700">
                            No configuration yet
                        </p>
                        <p className="tw-mb-0 tw-text-xs tw-text-gray-500">
                            {onAdd
                                ? `Use ${(actionLabel || "Add").toLowerCase()} to get started.`
                                : "Add configuration for this business unit to continue."}
                        </p>
                    </div>
                )}
            </div>
        </div>
    </div>
);

export default ConfigList;
