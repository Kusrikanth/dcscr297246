import { useMemo, useState } from "react";

import NoDataComp from "../../../../Components/Common/NoDataComp";
import {
    Button,
    ModalContainerUpdated,
    TextInput,
} from "../../../../Components/Common";
import { useModal } from "../../../../hooks/modalhook";

import {
    buildLiveReportData,
    canViewSavedReport,
    filterReportLeads,
    formatDateTime,
    reportLeads,
    reportSourceRows,
    reportTypes,
    type FieldChangeEvent,
    type ReportDefinition,
} from "../helper";
import ReportVisual from "../ReportVisual";

interface ReportsLibraryProps {
    reports: Array<ReportDefinition>;
    onCreateNew: () => void;
    onEdit: (report: ReportDefinition) => void;
    onDelete: (report: ReportDefinition) => void;
    onReorder: (report: ReportDefinition, direction: number) => void;
}

const rowsForReport = (report: ReportDefinition) =>
    String(report.dataSourceId || "leads") === "leads"
        ? reportLeads
        : reportSourceRows[String(report.dataSourceId)] || [];

function filterSummary(report: ReportDefinition) {
    const catalog = report.fieldCatalog || [];
    const fieldName = (id: string) => catalog.find(field => field.id === id)?.label || id;

    const operatorName = (operator: string) =>
        ({
            equals: "is",
            not_equals: "is not",
            contains: "contains",
            not_contains: "does not contain",
            greater_than: ">",
            less_than: "<",
            before: "before",
            after: "after",
            is_blank: "is blank",
            is_not_blank: "is not blank",
        } as Record<string, string>)[operator] || operator;

    const chips: Array<string> = [];

    if (report.dateFrom || report.dateTo) {
        chips.push(
            `${fieldName(report.dateField || "addedAt")}: ${report.dateFrom || "Beginning"} – ${report.dateTo || "Today"}`
        );
    }

    (report.filters || []).forEach(filter => {
        const values = Array.isArray(filter.value)
            ? filter.value
            : filter.value
                ? [filter.value]
                : [];

        const valueText = ["is_blank", "is_not_blank"].includes(filter.operator)
            ? ""
            : values.length > 2
                ? `${values.slice(0, 2).join(", ")} +${values.length - 2}`
                : values.join(", ");

        chips.push(
            `${fieldName(filter.field)} ${operatorName(filter.operator)}${valueText ? ` ${valueText}` : ""}`
        );
    });

    return chips;
}

const ReportsLibrary = ({
    reports,
    onCreateNew,
    onEdit,
    onDelete,
    onReorder,
}: ReportsLibraryProps) => {
    const [searchText, setSearchText] = useState("");

    const {
        openModal: expandOpenModal,
        closeModal: expandCloseModal,
        modalState: expandModalState,
    } = useModal();

    const visibleReports = useMemo(() => {
        const term = searchText.trim().toLowerCase();

        return reports
            .filter(report => canViewSavedReport(report))
            .filter(
                report =>
                    !term ||
                    `${report.title || ""} ${report.description || ""}`.toLowerCase().includes(term)
            )
            .map(report => ({
                ...report,
                liveData: buildLiveReportData(report, rowsForReport(report)),
            }));
    }, [reports, searchText]);

    const expandedReport = expandModalState.modalData as ReportDefinition | undefined;

    return (
        <>
            <div className="tw-card">
                <div className="tw-card-header tw-flex tw-justify-between tw-items-center">
                    <div>
                        <h4 className="tw-card-title tw-mb-0">Reports Library</h4>
                        <p className="tw-mb-0 tw-mt-1 tw-text-xs tw-text-gray-500">
                            {reports.length} saved report{reports.length === 1 ? "" : "s"}
                        </p>
                    </div>

                    <Button type="button" variant="primary" onClick={onCreateNew}>
                        <i className="ri-add-fill tw-mr-1"></i>
                        New Report
                    </Button>
                </div>

                <div className="tw-card-body">
                    <div className="row">
                        <div className="col-12 col-lg-4">
                            <TextInput
                                name="reportSearch"
                                placeHolder="Search reports by name or description"
                                value={searchText}
                                onChange={(event: FieldChangeEvent) =>
                                    setSearchText(event.target.value)
                                }
                                maxLength={80}
                            />
                        </div>
                    </div>

                    {!visibleReports.length ? (
                        <NoDataComp
                            title={reports.length ? "No reports match your search" : "No saved reports yet"}
                            helperText={
                                reports.length
                                    ? "Try another report name or description."
                                    : "Create your first custom report to see it here."
                            }
                        />
                    ) : (
                        <div className="row">
                            {visibleReports.map((report, index) => {
                                const chips = filterSummary(report);

                                return (
                                    <div className="col-12 col-xl-6" key={report.id}>
                                        <div className="tw-mb-3 tw-rounded-lg tw-border tw-border-gray-200">
                                            <div className="tw-flex tw-items-start tw-justify-between tw-gap-2 tw-border-b tw-border-gray-100 tw-p-3">
                                                <div className="tw-min-w-0">
                                                    <span className="tw-text-xs tw-text-gray-500">
                                                        {reportTypes.find(type => type.id === report.type)
                                                            ?.label || "Report"}
                                                    </span>

                                                    <h5 className="tw-mb-0 tw-truncate tw-text-base tw-font-semibold">
                                                        {report.title || "Untitled report"}
                                                    </h5>

                                                    {report.description && (
                                                        <p className="tw-mb-0 tw-text-xs tw-text-gray-500">
                                                            {report.description}
                                                        </p>
                                                    )}

                                                    <p className="tw-mb-0 tw-mt-1 tw-text-xs tw-text-gray-400">
                                                        Updated {formatDateTime(report.updatedAt || report.generatedAt)}
                                                    </p>

                                                    {chips.length > 0 && (
                                                        <div className="tw-mt-2 tw-flex tw-flex-wrap tw-gap-1">
                                                            {chips.map(chip => (
                                                                <span
                                                                    className="tw-rounded tw-bg-gray-100 tw-px-2 tw-py-0.5 tw-text-[11px] tw-text-gray-600"
                                                                    key={chip}
                                                                    title={chip}
                                                                >
                                                                    {chip}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="tw-flex tw-shrink-0 tw-gap-1">
                                                    <Button
                                                        type="button"
                                                        variant="secondary"
                                                        title="Expand report"
                                                        onClick={() => expandOpenModal(report)}
                                                    >
                                                        <i className="ri-fullscreen-line"></i>
                                                    </Button>

                                                    <Button
                                                        type="button"
                                                        variant="secondary"
                                                        title="Move up"
                                                        disabled={index === 0}
                                                        onClick={() => onReorder(report, -1)}
                                                    >
                                                        <i className="ri-arrow-up-line"></i>
                                                    </Button>

                                                    <Button
                                                        type="button"
                                                        variant="secondary"
                                                        title="Move down"
                                                        disabled={index === visibleReports.length - 1}
                                                        onClick={() => onReorder(report, 1)}
                                                    >
                                                        <i className="ri-arrow-down-line"></i>
                                                    </Button>

                                                    <Button
                                                        type="button"
                                                        variant="secondary"
                                                        title="Edit report"
                                                        onClick={() => onEdit(report)}
                                                    >
                                                        <i className="ri-pencil-line"></i>
                                                    </Button>

                                                    <Button
                                                        type="button"
                                                        variant="wrong"
                                                        title="Delete report"
                                                        onClick={() => onDelete(report)}
                                                    >
                                                        <i className="ri-delete-bin-line"></i>
                                                    </Button>
                                                </div>
                                            </div>

                                            <div className="tw-p-3">
                                                <ReportVisual
                                                    report={report}
                                                    data={report.liveData}
                                                    leads={filterReportLeads(rowsForReport(report), report)}
                                                    compact
                                                />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            <ModalContainerUpdated
                id="expand-report-modal"
                isOpen={expandModalState.showModal}
                toggle={expandCloseModal}
                modalTitle={expandedReport?.title || "Saved Report"}
                modalSize="xl"
            >
                {expandedReport && (
                    <div className="tw-p-4">
                        {expandedReport.description && (
                            <p className="tw-mb-3 tw-text-xs tw-text-gray-500">
                                {expandedReport.description}
                            </p>
                        )}

                        <ReportVisual
                            report={expandedReport}
                            data={buildLiveReportData(expandedReport, rowsForReport(expandedReport))}
                            leads={filterReportLeads(rowsForReport(expandedReport), expandedReport)}
                        />

                        <div className="tw-mt-4 tw-rounded-lg tw-border tw-border-gray-200 tw-bg-gray-50 tw-p-3">
                            <h6 className="tw-mb-2 tw-text-sm tw-font-semibold">Options &amp; filters</h6>

                            <ReadOnlyShelf
                                title="Rows"
                                items={(expandedReport.rows || []).map(field => ({ label: field }))}
                                report={expandedReport}
                            />
                            <ReadOnlyShelf
                                title="Columns"
                                items={(expandedReport.columns || []).map(field => ({ label: field }))}
                                report={expandedReport}
                            />
                            <ReadOnlyShelf
                                title="Values / Measures"
                                items={(expandedReport.values || []).map(measure => ({
                                    label: measure.field,
                                    hint: measure.aggregation,
                                }))}
                                report={expandedReport}
                            />

                            <p className="tw-mb-0 tw-mt-2 tw-text-xs tw-text-gray-500">
                                View only. Changes can be made from the report builder.
                            </p>
                        </div>
                    </div>
                )}
            </ModalContainerUpdated>
        </>
    );
};

export default ReportsLibrary;

const ReadOnlyShelf = ({
    title,
    items,
    report,
}: {
    title: string;
    items: Array<{ label: string; hint?: string }>;
    report: ReportDefinition;
}) => {
    const fieldName = (id: string) =>
        (report.fieldCatalog || []).find(field => field.id === id)?.label ||
        (report.calculatedFields || []).find(field => field.id === id)?.name ||
        id;

    return (
        <div className="tw-mb-2">
            <div className="tw-mb-1 tw-text-xs tw-font-semibold tw-text-gray-600">{title}</div>

            {items.length ? (
                <div className="tw-flex tw-flex-wrap tw-gap-1">
                    {items.map((item, index) => (
                        <span
                            className="tw-rounded tw-bg-white tw-px-2 tw-py-0.5 tw-text-[11px] tw-text-gray-700"
                            key={`${item.label}-${index}`}
                        >
                            {fieldName(item.label)}
                            {item.hint && (
                                <span className="tw-ml-1 tw-text-gray-400">{item.hint}</span>
                            )}
                        </span>
                    ))}
                </div>
            ) : (
                <p className="tw-mb-0 tw-text-xs tw-text-gray-400">Not selected</p>
            )}
        </div>
    );
};
