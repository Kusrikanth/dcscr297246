import {
    useMemo,
    useState,
    type ChangeEvent,
} from "react";

import {
    Button,
    ModalContainerUpdated,
    TextIconInput,
} from "../../../Components/Common";
import NoDataComp from "../../../Components/Common/NoDataComp";
import { useModal } from "../../../hooks/modalhook";
import {
    buildLiveReportData,
    canViewSavedReport,
    formatDateTime,
    reportTypes,
    type ReportDefinition,
} from "../Reports/helper";
import ReportVisual from "../Reports/ReportVisual";
import type { DashboardLead } from "./helper";

interface SavedReportsTabProps {
    reports: ReportDefinition[];
    leads: DashboardLead[];
    onCreateNew: () => void;
}

const SavedReportsTab = ({
    reports,
    leads,
    onCreateNew,
}: SavedReportsTabProps) => {
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
                    `${report.title || ""} ${report.description || ""}`
                        .toLowerCase()
                        .includes(term),
            )
            .map(report => ({
                ...report,
                liveData: buildLiveReportData(report, leads),
            }));
    }, [reports, leads, searchText]);

    const expandedReport = expandModalState.modalData as
        | (ReportDefinition & { liveData?: unknown })
        | undefined;

    if (!reports.length) {
        return (
            <div className="tw-card tw-mb-0">
                <div className="tw-card-body tw-text-center">
                    <NoDataComp />
                    <p className="tw-mb-1 tw-text-base tw-font-semibold tw-text-gray-900">
                        No saved reports yet
                    </p>
                    <p className="tw-mb-3 tw-text-sm tw-text-gray-500">
                        Build a report on the Reports screen and
                        it will appear here.
                    </p>
                    <Button
                        type="button"
                        variant="primary"
                        onClick={onCreateNew}
                    >
                        <i className="ri-add-fill"></i>
                        New report
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="tw-card tw-mb-3">
                <div className="tw-card-body tw-flex tw-flex-wrap tw-items-center tw-justify-between tw-gap-3">
                    <div className="tw-w-full md:tw-w-96">
                        <TextIconInput
                            formgroupClassName="search-box tw-mb-0"
                            name="savedReportSearch"
                            value={searchText}
                            onChange={(
                                event: ChangeEvent<HTMLInputElement>,
                            ) =>
                                setSearchText(
                                    event.target.value,
                                )
                            }
                            placeHolder="Search saved reports…"
                        >
                            <i className="ri-search-line search-icon"></i>
                        </TextIconInput>
                    </div>

                    <Button
                        type="button"
                        variant="primary"
                        onClick={onCreateNew}
                    >
                        <i className="ri-add-fill"></i>
                        New report
                    </Button>
                </div>
            </div>

            {visibleReports.length ? (
                <div className="row tw-gap-y-3">
                    {visibleReports.map(report => (
                        <div
                            key={report.id}
                            className="col-12 col-xl-6"
                        >
                            <div className="tw-card tw-mb-0 tw-h-full">
                                <div className="tw-card-header">
                                    <div className="tw-flex tw-items-start tw-justify-between tw-gap-2">
                                        <div className="tw-min-w-0">
                                            <p className="tw-mb-1 tw-text-xs tw-font-semibold tw-uppercase tw-text-gray-400">
                                                {reportTypes.find(
                                                    type =>
                                                        type.id ===
                                                        report.type,
                                                )?.label ||
                                                    "Report"}
                                            </p>
                                            <h4 className="tw-card-title tw-mb-0">
                                                {report.title ||
                                                    "Untitled report"}
                                            </h4>
                                            {report.description && (
                                                <p className="tw-mb-0 tw-text-sm tw-text-gray-500">
                                                    {
                                                        report.description
                                                    }
                                                </p>
                                            )}
                                            {report.updatedAt && (
                                                <p className="tw-mb-0 tw-text-xs tw-text-gray-400">
                                                    Updated{" "}
                                                    {formatDateTime(
                                                        report.updatedAt,
                                                    )}
                                                </p>
                                            )}
                                        </div>

                                        <Button
                                            type="button"
                                            variant="secondary"
                                            className="!tw-h-8 !tw-w-8 !tw-p-0 tw-border tw-border-gray-200 !tw-bg-white hover:!tw-bg-gray-50"
                                            title={`Expand ${report.title || "saved report"}`}
                                            aria-label={`Expand ${report.title || "saved report"}`}
                                            onClick={() =>
                                                expandOpenModal(
                                                    report,
                                                )
                                            }
                                        >
                                            <i className="ri-fullscreen-line"></i>
                                        </Button>
                                    </div>
                                </div>

                                <div className="tw-card-body">
                                    <ReportVisual
                                        report={report}
                                        data={report.liveData}
                                        leads={leads}
                                        compact
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="tw-card tw-mb-0">
                    <div className="tw-card-body tw-text-center">
                        <NoDataComp />
                        <p className="tw-mb-0 tw-text-sm tw-text-gray-500">
                            No reports match your search.
                        </p>
                    </div>
                </div>
            )}

            <ModalContainerUpdated
                id="crm-dashboard-saved-report-expand"
                isOpen={expandModalState.showModal}
                toggle={expandCloseModal}
                modalTitle={
                    expandedReport?.title || "Saved report"
                }
                modalSize="xl"
            >
                {expandedReport && (
                    <div className="tw-p-4">
                        {expandedReport.description && (
                            <p className="tw-mb-3 tw-text-sm tw-text-gray-500">
                                {expandedReport.description}
                            </p>
                        )}
                        <ReportVisual
                            report={expandedReport}
                            data={buildLiveReportData(
                                expandedReport,
                                leads,
                            )}
                            leads={leads}
                        />
                    </div>
                )}
            </ModalContainerUpdated>
        </>
    );
};

export default SavedReportsTab;
