import {
    useCallback,
    useMemo,
    useState,
    type MouseEvent,
} from "react";

import { ModalContainerUpdated } from "../../../Components/Common";
import TableContainer from "../../../Components/Common/TableContainer";
import { type IOptionsHrtl } from "../../../Components/Common/MenuOptions";
import { useModal } from "../../../hooks/modalhook";
import UploadDetailsModal from "./UploadDetailsModal";
import {
    actionsColumn,
    formatDateTime,
    initialPagination,
    successRate,
    type BulkUploadRecord,
} from "./helper";
import { StatusBadge } from "./StatusBadge";

interface UploadsTabProps {
    uploads: BulkUploadRecord[];
}

const generateColumns = (
    actionOptions: Array<IOptionsHrtl>,
) => [
        {
            Header: "File",
            accessor: "fileName",
            disableSortBy: true,
            Cell: ({
                row: { original },
            }: {
                row: { original: BulkUploadRecord };
            }) => (
                <div>
                    <p className="tw-mb-0 tw-text-sm tw-font-semibold tw-text-gray-800">
                        {original.fileName}
                    </p>
                    <p className="tw-mb-0 tw-text-xs tw-text-gray-500">
                        {original.type}
                    </p>
                </div>
            ),
        },
        {
            Header: "Status",
            accessor: "status",
            disableSortBy: true,
            Cell: ({
                row: { original },
            }: {
                row: { original: BulkUploadRecord };
            }) => <StatusBadge status={original.status} />,
        },
        {
            Header: "Records",
            accessor: "totalRecords",
            disableSortBy: true,
        },
        {
            Header: "Success",
            accessor: "successCount",
            disableSortBy: true,
            Cell: ({
                row: { original },
            }: {
                row: { original: BulkUploadRecord };
            }) => (
                <span className="tw-font-semibold tw-text-emerald-600">
                    {original.successCount}
                </span>
            ),
        },
        {
            Header: "Failed",
            accessor: "failureCount",
            disableSortBy: true,
            Cell: ({
                row: { original },
            }: {
                row: { original: BulkUploadRecord };
            }) => (
                <span
                    className={
                        original.failureCount
                            ? "tw-font-semibold tw-text-red-600"
                            : ""
                    }
                >
                    {original.failureCount}
                </span>
            ),
        },
        {
            Header: "Duplicates",
            accessor: "duplicateCount",
            disableSortBy: true,
        },
        {
            Header: "Success rate",
            disableSortBy: true,
            Cell: ({
                row: { original },
            }: {
                row: { original: BulkUploadRecord };
            }) => (
                <span>
                    {successRate(
                        original.successCount,
                        original.totalRecords,
                    )}
                    %
                </span>
            ),
        },
        {
            Header: "Uploaded",
            accessor: "createdAt",
            disableSortBy: true,
            Cell: ({
                row: { original },
            }: {
                row: { original: BulkUploadRecord };
            }) => (
                <div>
                    <p className="tw-mb-0 tw-text-sm tw-text-gray-800">
                        {formatDateTime(original.createdAt)}
                    </p>
                    <p className="tw-mb-0 tw-text-xs tw-text-gray-500">
                        {original.createdBy || "—"}
                    </p>
                </div>
            ),
        },
        actionsColumn(actionOptions),
    ];

const UploadsTab = ({
    uploads,
}: UploadsTabProps) => {
    const [pagination, setPagination] = useState(
        initialPagination,
    );

    const {
        openModal: detailsOpenModal,
        closeModal: detailsCloseModal,
        modalState: detailsModalState,
    } = useModal();

    const findUpload = useCallback(
        (uploadId: string | null) =>
            uploads.find(item => item.id === uploadId),
        [uploads],
    );

    const paginatedUploads = useMemo(() => {
        const start = pagination.pageNo * pagination.pageSize;

        return uploads.slice(
            start,
            start + pagination.pageSize,
        );
    }, [uploads, pagination]);

    const downloadHandler = useCallback(() => {
    }, []);

    const actionOptions: Array<IOptionsHrtl> = useMemo(
        () => [
            {
                id: "view",
                actionIcon: (
                    <i className="ri-eye-line text-success fs-16"></i>
                ),
                actionName: "View details",
                onClickHndlr: (
                    event: MouseEvent<HTMLElement>,
                ) => {
                    const record = findUpload(
                        event.currentTarget.getAttribute(
                            "data-id",
                        ),
                    );

                    if (record) {
                        detailsOpenModal(record);
                    }
                },
            },
            {
                id: "download",
                actionIcon: (
                    <i className="ri-download-2-line text-primary fs-16"></i>
                ),
                actionName: "Download report",
                onClickHndlr: (
                    event: MouseEvent<HTMLElement>,
                ) => {
                    const record = findUpload(
                        event.currentTarget.getAttribute(
                            "data-id",
                        ),
                    );

                    if (record) {
                        downloadHandler();
                    }
                },
            },
        ],
        [detailsOpenModal, downloadHandler, findUpload],
    );

    const tableColumns = useMemo(
        () => generateColumns(actionOptions),
        [actionOptions],
    );

    return (
        <>
            <div className="tw-card-body !tw-p-0">
                <TableContainer
                    columns={tableColumns}
                    data={paginatedUploads}
                    tableClass="mb-0"
                    divClass="table-responsive mb-3"
                    theadClass="table-light text-muted align-middle"
                    showPagination
                    totalPages={Math.ceil(
                        uploads.length / pagination.pageSize,
                    )}
                    totalRecords={uploads.length}
                    currentPageNumber={pagination.pageNo}
                    pageSize={pagination.pageSize}
                    callbackPaginationHndlr={setPagination}
                />
            </div>

            <ModalContainerUpdated
                id="bulk-upload-details-modal"
                isOpen={detailsModalState.showModal}
                toggle={detailsCloseModal}
                modalTitle="Upload details"
                modalSize="lg"
            >
                {detailsModalState.modalData && (
                    <UploadDetailsModal
                        upload={
                            detailsModalState.modalData as BulkUploadRecord
                        }
                        toggle={detailsCloseModal}
                        onDownloadSuccessful={downloadHandler}
                    />
                )}
            </ModalContainerUpdated>
        </>
    );
};

export default UploadsTab;
