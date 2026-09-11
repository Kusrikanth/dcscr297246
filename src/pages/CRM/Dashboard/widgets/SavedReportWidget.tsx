import { useMemo } from "react";

import {
    buildLiveReportData,
    reportTypes,
    type ReportDefinition,
} from "../../Reports/helper";
import ReportVisual from "../../Reports/ReportVisual";
import type { DashboardLead } from "../helper";

interface SavedReportWidgetProps {
    report: ReportDefinition;
    leads: DashboardLead[];
}

const SavedReportWidget = ({
    report,
    leads,
}: SavedReportWidgetProps) => {
    const liveData = useMemo(
        () => buildLiveReportData(report, leads),
        [report, leads],
    );

    const typeLabel =
        reportTypes.find(type => type.id === report.type)
            ?.label || "Report";

    return (
        <div className="tw-card tw-mb-0 tw-h-full">
            <div className="tw-card-header">
                <p className="tw-mb-1 tw-text-xs tw-font-semibold tw-uppercase tw-text-gray-400">
                    Saved report · {typeLabel}
                </p>
                <h4 className="tw-card-title tw-mb-0">
                    {report.title || "Untitled report"}
                </h4>
                {report.description && (
                    <p className="tw-mb-0 tw-text-sm tw-text-gray-500">
                        {report.description}
                    </p>
                )}
            </div>

            <div className="tw-card-body">
                <ReportVisual
                    report={report}
                    data={liveData}
                    leads={leads}
                    compact
                />
            </div>
        </div>
    );
};

export default SavedReportWidget;
