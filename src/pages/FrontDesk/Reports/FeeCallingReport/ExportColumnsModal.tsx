import { useEffect, useMemo, useState } from "react";
import { InputCheckboxUpdated } from "../../../../Components/Common";
import Button from "../../../../Components/Common/Button";
import { exportColumnOptions } from "./helper";

interface IExportColumnsModal {
    isOpen: boolean;
    toggle: () => void;
    onDownload: (columns: string[]) => void;
    isDisabled?: boolean;
}

const STORAGE_KEY = "feeCallingReport.exportColumns";
const allKeys = exportColumnOptions.map((c) => c.key);

function loadSaved(): string[] {
    try {
        const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        const valid = Array.isArray(parsed) ? parsed.filter((k) => allKeys.includes(k)) : [];
        return valid.length ? valid : allKeys;
    } catch {
        return allKeys;
    }
}

export default function ExportColumnsModal({ isOpen, toggle, onDownload, isDisabled }: IExportColumnsModal) {
    const [selected, setSelected] = useState<string[]>(loadSaved);

    useEffect(() => {
        if (isOpen) setSelected(loadSaved());
    }, [isOpen]);

    const groups = useMemo(() => {
        const order: string[] = [];
        const byGroup: Record<string, typeof exportColumnOptions> = {};
        exportColumnOptions.forEach((c) => {
            if (!byGroup[c.group]) { byGroup[c.group] = []; order.push(c.group); }
            byGroup[c.group].push(c);
        });
        return order.map((name) => ({ name, columns: byGroup[name] }));
    }, []);

    const allSelected = selected.length === allKeys.length;

    const toggleAll = () => setSelected(allSelected ? [] : allKeys);
    const toggleGroup = (keys: string[]) => {
        const every = keys.every((k) => selected.includes(k));
        setSelected((prev) => every ? prev.filter((k) => !keys.includes(k)) : Array.from(new Set([...prev, ...keys])));
    };
    const toggleOne = (key: string) =>
        setSelected((prev) => prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]);

    const download = () => {
        // Keep the catalogue order so the Excel columns are predictable regardless of click order.
        const ordered = allKeys.filter((k) => selected.includes(k));
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(ordered)); } catch { /* ignore */ }
        onDownload(ordered);
    };

    return (
        <div className="tw-p-5">
            <div className="tw-flex tw-items-center tw-justify-between tw-mb-3">
                <p className="tw-text-sm tw-text-gray-600 tw-mb-0">Choose the columns to include in the Excel file.</p>
                <InputCheckboxUpdated
                    name="export-select-all"
                    labelName={allSelected ? "Deselect all" : "Select all"}
                    value={allSelected}
                    onChange={toggleAll}
                    formgroupClassName="tw-mb-0"
                />
            </div>

            <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4">
                {groups.map((group) => {
                    const keys = group.columns.map((c) => c.key);
                    const groupAll = keys.every((k) => selected.includes(k));
                    return (
                        <div key={group.name} className="tw-border tw-rounded-lg tw-p-3">
                            <InputCheckboxUpdated
                                name={`export-group-${group.name}`}
                                labelName={group.name}
                                value={groupAll}
                                onChange={() => toggleGroup(keys)}
                                formgroupClassName="tw-mb-2 tw-font-semibold"
                            />
                            <div className="tw-pl-4 tw-grid tw-grid-cols-1 sm:tw-grid-cols-2 tw-gap-x-3">
                                {group.columns.map((col) => (
                                    <InputCheckboxUpdated
                                        key={col.key}
                                        name={`export-col-${col.key}`}
                                        labelName={col.label}
                                        value={selected.includes(col.key)}
                                        onChange={() => toggleOne(col.key)}
                                        formgroupClassName="tw-mb-1"
                                    />
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="tw-flex tw-items-center tw-justify-between tw-mt-5">
                <span className="tw-text-xs tw-text-gray-500">{selected.length} of {allKeys.length} columns selected</span>
                <div className="tw-flex tw-gap-3">
                    <Button type="button" variant="secondary" onClick={toggle}>Cancel</Button>
                    <Button type="button" variant="primary" onClick={download} disabled={isDisabled || selected.length === 0}>
                        Download
                    </Button>
                </div>
            </div>
        </div>
    );
}
