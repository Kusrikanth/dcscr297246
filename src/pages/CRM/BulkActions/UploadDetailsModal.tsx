import { Button } from "../../../Components/Common";
import {
    formatDateTime,
    successRate,
    type BulkUploadRecord,
} from "./helper";
import { StatusBadge } from "./StatusBadge";

interface UploadDetailsModalProps {
    upload: BulkUploadRecord;
    toggle: () => void;
    onDownloadSuccessful: (
        upload: BulkUploadRecord,
    ) => void;
}

const SummaryTile = ({
    labelText,
    value,
    valueClassName,
}: {
    labelText: string;
    value: string | number;
    valueClassName?: string;
}) => (
    <div className="tw-rounded tw-border tw-border-gray-200 tw-p-3 tw-text-center">
        <p
            className={`tw-mb-0 tw-text-2xl tw-font-semibold ${valueClassName || "tw-text-gray-900"}`}
        >
            {value}
        </p>
        <p className="tw-mb-0 tw-text-xs tw-text-gray-500">
            {labelText}
        </p>
    </div>
);

const UploadDetailsModal = ({
    upload,
    toggle,
    onDownloadSuccessful,
}: UploadDetailsModalProps) => (
    <div className="tw-bg-white">
        <div className="tw-border-b tw-border-gray-200 tw-p-4">
            <div className="tw-mb-3 tw-flex tw-flex-wrap tw-items-center tw-justify-between tw-gap-2">
                <div>
                    <p className="tw-mb-0 tw-text-xs tw-font-semibold tw-uppercase tw-text-gray-400">
                        {upload.type}
                    </p>
                    <h5 className="tw-mb-0 tw-text-base tw-font-semibold tw-text-gray-900">
                        {upload.fileName}
                    </h5>
                    <p className="tw-mb-0 tw-text-sm tw-text-gray-500">
                        Uploaded by {upload.createdBy || "—"} ·{" "}
                        {formatDateTime(upload.createdAt)}
                    </p>
                </div>

                <StatusBadge status={upload.status} />
            </div>

            <div className="row tw-gap-y-3">
                <div className="col-6 col-lg-3">
                    <SummaryTile
                        labelText="Total records"
                        value={upload.totalRecords}
                    />
                </div>
                <div className="col-6 col-lg-3">
                    <SummaryTile
                        labelText="Success"
                        value={upload.successCount}
                        valueClassName="tw-text-emerald-600"
                    />
                </div>
                <div className="col-6 col-lg-3">
                    <SummaryTile
                        labelText="Failed"
                        value={upload.failureCount}
                        valueClassName="tw-text-red-600"
                    />
                </div>
                <div className="col-6 col-lg-3">
                    <SummaryTile
                        labelText="Success rate"
                        value={`${successRate(
                            upload.successCount,
                            upload.totalRecords,
                        )}%`}
                    />
                </div>
            </div>

            {upload.duplicateCount > 0 && (
                <p className="tw-mb-0 tw-mt-3 tw-text-sm tw-text-amber-600">
                    {upload.duplicateCount} row
                    {upload.duplicateCount === 1 ? "" : "s"} were
                    skipped as duplicates of leads already in the
                    CRM.
                </p>
            )}
        </div>

        <div className="tw-max-h-[52vh] tw-overflow-y-auto tw-p-4">
            {upload.errorSummary && (
                <div className="alert alert-danger tw-mb-4">
                    <strong>Upload error</strong>
                    <p className="tw-mb-0 tw-mt-1 tw-text-sm">
                        {upload.errorSummary}
                    </p>
                </div>
            )}

            {upload.failedRecords.length > 0 && (
                <div className="tw-mb-4">
                    <p className="tw-mb-2 tw-text-sm tw-font-semibold tw-text-gray-700">
                        Failed records (
                        {upload.failedRecords.length})
                    </p>

                    <div className="tw-max-h-72 tw-overflow-auto tw-rounded tw-border tw-border-gray-200">
                        <table className="table table-sm tw-mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th>CSV row</th>
                                    <th>Student name</th>
                                    <th>Phone</th>
                                    <th>Failure reason</th>
                                </tr>
                            </thead>
                            <tbody>
                                {upload.failedRecords.map(
                                    record => (
                                        <tr
                                            key={record.rowNumber}
                                        >
                                            <td>
                                                {record.rowNumber}
                                            </td>
                                            <td>
                                                {record.studentName ||
                                                    "—"}
                                            </td>
                                            <td>
                                                {record.phone ||
                                                    "—"}
                                            </td>
                                            <td>
                                                {record.reasons
                                                    .length ? (
                                                    record.reasons.map(
                                                        reason => (
                                                            <div
                                                                key={
                                                                    reason
                                                                }
                                                                className="tw-text-xs tw-text-red-600"
                                                            >
                                                                •{" "}
                                                                {
                                                                    reason
                                                                }
                                                            </div>
                                                        ),
                                                    )
                                                ) : (
                                                    <span className="tw-text-xs tw-text-gray-500">
                                                        No failure
                                                        reason was
                                                        recorded.
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ),
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {upload.events.length > 0 && (
                <div>
                    <p className="tw-mb-2 tw-text-sm tw-font-semibold tw-text-gray-700">
                        Upload timeline
                    </p>

                    <div className="tw-rounded tw-border tw-border-gray-200 tw-bg-gray-50 tw-p-3">
                        {upload.events.map(
                            (event, eventIndex) => (
                                <div
                                    key={event.id}
                                    className="tw-flex tw-gap-3"
                                >
                                    <div className="tw-flex tw-flex-col tw-items-center">
                                        <span className="tw-mt-1 tw-h-2 tw-w-2 tw-flex-shrink-0 tw-rounded-full tw-bg-emerald-500"></span>
                                        {eventIndex <
                                            upload.events.length -
                                            1 && (
                                                <span className="tw-my-1 tw-w-px tw-flex-1 tw-bg-slate-200"></span>
                                            )}
                                    </div>

                                    <div className="tw-pb-3">
                                        <p className="tw-mb-0 tw-text-sm tw-font-medium tw-text-gray-800">
                                            {event.label}
                                        </p>
                                        <p className="tw-mb-0 tw-text-xs tw-text-gray-500">
                                            {event.performedBy} ·{" "}
                                            {formatDateTime(
                                                event.createdAt,
                                            )}
                                        </p>
                                    </div>
                                </div>
                            ),
                        )}
                    </div>
                </div>
            )}

            {!upload.errorSummary &&
                !upload.failedRecords.length &&
                !upload.events.length && (
                    <p className="tw-mb-0 tw-py-6 tw-text-center tw-text-sm tw-text-gray-500">
                        Nothing further was recorded for this
                        upload.
                    </p>
                )}
        </div>

        <div className="tw-flex tw-justify-end tw-gap-2 tw-border-t tw-border-gray-200 tw-p-4">
            <Button
                type="button"
                variant="secondary"
                onClick={toggle}
            >
                Close
            </Button>
            <Button
                type="button"
                variant="hoverInfo"
                disabled={!upload.successCount}
                onClick={() => onDownloadSuccessful(upload)}
            >
                <i className="ri-download-2-line"></i>
                Download imported leads
            </Button>
        </div>
    </div>
);

export default UploadDetailsModal;
