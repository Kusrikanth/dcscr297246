import { toast } from "react-toastify";

import { Button } from "../../../Components/Common";
import { formatDateTime, type DownloadRecord } from "./helper";

interface DownloadsTabProps {
    downloads: DownloadRecord[];
}

const DownloadsTab = ({ downloads }: DownloadsTabProps) => {
    if (!downloads.length) {
        return (
            <div className="tw-card">
                <div className="tw-card-body tw-py-5 tw-text-center">
                    <i className="ri-download-2-line tw-text-3xl tw-text-gray-300"></i>
                    <p className="tw-mb-0 tw-mt-2 tw-text-sm tw-font-medium tw-text-gray-700">
                        No downloads recorded
                    </p>
                    <p className="tw-mb-0 tw-text-xs tw-text-gray-500">
                        Exports from Leads, Meta lead forms, the review queue and
                        remarketing appear here.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="tw-flex tw-flex-col tw-gap-3 tw-p-4">
            {downloads.map(download => (
                <div key={download.id} className="tw-card">
                    <div className="tw-card-body">
                        <div className="tw-flex tw-flex-wrap tw-items-start tw-justify-between tw-gap-3">
                            <div className="tw-min-w-0 tw-flex-1">
                                <div className="tw-flex tw-flex-wrap tw-items-center tw-gap-2">
                                    <i className="ri-download-2-line tw-text-gray-500"></i>
                                    <p className="tw-mb-0 tw-text-sm tw-font-semibold tw-text-gray-800">
                                        {download.dataset}
                                    </p>
                                    <span className="badge badge-soft-secondary">
                                        {download.recordCount} record
                                        {download.recordCount === 1 ? "" : "s"}
                                    </span>
                                </div>

                                <p className="tw-mb-0 tw-mt-1 tw-break-all tw-text-sm tw-text-gray-600">
                                    {download.fileName}
                                </p>

                                {download.columns.length > 0 && (
                                    <p className="tw-mb-0 tw-mt-1 tw-text-xs tw-text-gray-500">
                                        Columns:{" "}
                                        {download.columns
                                            .slice(0, 8)
                                            .join(", ")}
                                        {download.columns.length > 8
                                            ? ` +${download.columns.length - 8} more`
                                            : ""}
                                    </p>
                                )}
                            </div>

                            <div className="tw-flex tw-flex-shrink-0 tw-items-start tw-gap-3">
                                <div className="tw-text-end">
                                    <p className="tw-mb-0 tw-text-sm tw-font-medium tw-text-gray-800">
                                        {download.createdBy || "Unknown user"}
                                    </p>
                                    <p className="tw-mb-0 tw-text-xs tw-text-gray-500">
                                        {formatDateTime(download.createdAt)}
                                    </p>
                                    {download.fileSizeKb > 0 && (
                                        <p className="tw-mb-0 tw-text-xs tw-text-gray-500">
                                            {download.fileSizeKb.toFixed(1)} KB
                                        </p>
                                    )}
                                </div>

                                <Button
                                    type="button"
                                    variant="secondary"
                                    disabled={!download.isFileRetained}
                                    title={
                                        download.isFileRetained
                                            ? `Download ${download.fileName} again`
                                            : "This file was not kept, so it cannot be downloaded again"
                                    }
                                    onClick={() =>
                                        toast.success(
                                            `${download.fileName} downloaded`,
                                        )
                                    }
                                >
                                    <i className="ri-download-2-line tw-me-1"></i>
                                    Download
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default DownloadsTab;
