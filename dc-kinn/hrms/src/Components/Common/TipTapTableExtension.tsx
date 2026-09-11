import React, { useEffect, useRef, useState } from 'react'
import { HugeiconsIcon } from "@hugeicons/react";
import { GridTableIcon } from '@hugeicons-pro/core-stroke-standard';
import { Editor } from "@tiptap/react";
import classnames from "classnames";
import { createPortal } from 'react-dom';
import {CustomTooltip} from './index';

const TableSizeSelector = ({ onSelect }: { onSelect: (rows: number, cols: number) => void }) => {
    const [hoveredRow, setHoveredRow] = useState(0);
    const [hoveredCol, setHoveredCol] = useState(0);

    const maxRows = 10;
    const maxCols = 10;

    return (
        <div className="tw-border tw-rounded tw-shadow tw-p-2 tw-bg-white">
            <div
                className="tw-grid"
                style={{ gridTemplateColumns: `repeat(${maxCols}, 20px)` }}
            >
                {Array.from({ length: maxRows }).map((_, row) =>
                    Array.from({ length: maxCols }).map((_, col) => {
                        const isSelected = row <= hoveredRow && col <= hoveredCol;
                        return (
                            <div
                                key={`${row}-${col}`}
                                onMouseEnter={() => {
                                    setHoveredRow(row);
                                    setHoveredCol(col);
                                }}
                                onClick={() => onSelect(row + 1, col + 1)}
                                className={`tw-w-5 tw-h-5 tw-border tw-border-gray-300 tw-cursor-pointer ${isSelected ? 'tw-bg-blue-300' : 'tw-bg-white'
                                    }`}
                            />
                        );
                    })
                )}
            </div>
            <div className="tw-text-sm tw-mt-2 tw-text-center">{`${hoveredRow + 1} × ${hoveredCol + 1}`}</div>
        </div>

    );
};

const TipTapTableExtension = ({ editor, toolbarButtonSizing, classStyles, isStaticOptionsRequired }: { editor: Editor | null, toolbarButtonSizing: React.CSSProperties, classStyles?: string, isStaticOptionsRequired?: boolean }) => {

    const [showTableSelector, setShowTableSelector] = useState(false);
    const tableButtonRef = useRef<HTMLButtonElement>(null);
    const tableSelectorRef = useRef<HTMLDivElement>(null);
    const [tableSelectorPos, setTableSelectorPos] = useState<{ top: number, left: number } | null>(null);

    useEffect(() => {
        if (showTableSelector && tableButtonRef.current) {
            const rect = tableButtonRef.current.getBoundingClientRect();
            setTableSelectorPos({
                top: rect.bottom + window.scrollY + 4,
                left: rect.left + window.scrollX,
            });
        }
    }, [showTableSelector]);

    useEffect(() => {
        if (!showTableSelector) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setShowTableSelector(false);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [showTableSelector]);

    useEffect(() => {
        if (!showTableSelector) return;
        const handleClick = (e: MouseEvent) => {
            const selector = tableSelectorRef.current;
            const button = tableButtonRef.current;
            if (
                selector && !selector.contains(e.target as Node) &&
                button && !button.contains(e.target as Node)
            ) {
                setShowTableSelector(false);
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => {
            document.removeEventListener("mousedown", handleClick);
        };
    }, [showTableSelector]);

    return (
        <>
            <button
                ref={tableButtonRef}
                id="table-tooltip"
                data-tooltip-id="table-tooltip"
                onClick={() => setShowTableSelector(!showTableSelector)}
                style={toolbarButtonSizing}
                className={classnames(`btn ${isStaticOptionsRequired ? "btn-outline-light !tw-text-black" : "btn-outline-primary tw-text-black"} btn-sm tw-relative`, { 'active': editor?.isActive('table') }, classStyles)}
            >
                <HugeiconsIcon icon={GridTableIcon} className="tw-pointer-events-none" />
            </button>
            <CustomTooltip id="table-tooltip" content="Table" />
            {showTableSelector && tableSelectorPos &&
                createPortal(
                    <div
                        ref={tableSelectorRef}
                        style={{
                            position: "absolute",
                            top: tableSelectorPos.top,
                            left: tableSelectorPos.left,
                            zIndex: 9999,
                        }}
                    >
                        <TableSizeSelector
                            onSelect={(rows, cols) => {
                                editor?.chain().focus().insertTable({ rows, cols, withHeaderRow: true }).run();
                                setShowTableSelector(false);
                            }}
                        />
                    </div>,
                    document.body
                )
            }
        </>
    )
}

export default TipTapTableExtension