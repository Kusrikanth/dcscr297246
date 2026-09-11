import {
    useCallback,
    useMemo,
    useState,
    type MouseEvent,
} from "react";

import TableContainer from "../../../Components/Common/TableContainer";
import { type IOptionsHrtl } from "../../../Components/Common/MenuOptions";
import {
    actionsColumn,
    formatDateTime,
    initialPagination,
    type DialerCampaignRecord,
} from "./helper";
import { StatusBadge } from "./StatusBadge";

interface CampaignsTabProps {
    campaigns: DialerCampaignRecord[];
}

const generateColumns = (
    actionOptions: Array<IOptionsHrtl>,
) => [
        {
            Header: "Campaign",
            accessor: "campaignName",
            disableSortBy: true,
            Cell: ({
                row: { original },
            }: {
                row: { original: DialerCampaignRecord };
            }) => (
                <div className="tw-max-w-sm">
                    <p className="tw-mb-0 tw-text-sm tw-font-semibold tw-text-gray-800">
                        {original.campaignName}
                    </p>
                    <p className="tw-mb-0 tw-text-xs tw-text-gray-500">
                        {original.description || "—"}
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
                row: { original: DialerCampaignRecord };
            }) => <StatusBadge status={original.status} />,
        },
        {
            Header: "Calls",
            accessor: "callCount",
            disableSortBy: true,
        },
        {
            Header: "Connected",
            accessor: "connectedCount",
            disableSortBy: true,
        },
        {
            Header: "Success rate",
            accessor: "successRate",
            disableSortBy: true,
            Cell: ({
                row: { original },
            }: {
                row: { original: DialerCampaignRecord };
            }) => (
                <span className="tw-font-semibold tw-text-emerald-600">
                    {original.successRate}%
                </span>
            ),
        },
        {
            Header: "Created",
            accessor: "createdAt",
            disableSortBy: true,
            Cell: ({
                row: { original },
            }: {
                row: { original: DialerCampaignRecord };
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

const CampaignsTab = ({
    campaigns,
}: CampaignsTabProps) => {
    const [pagination, setPagination] = useState(
        initialPagination,
    );

    const paginatedCampaigns = useMemo(() => {
        const start = pagination.pageNo * pagination.pageSize;

        return campaigns.slice(
            start,
            start + pagination.pageSize,
        );
    }, [campaigns, pagination]);

    const findCampaign = useCallback(
        (campaignId: string | null) =>
            campaigns.find(item => item.id === campaignId),
        [campaigns],
    );

    const downloadHandler = useCallback(() => {
    }, []);

    const actionOptions: Array<IOptionsHrtl> = useMemo(
        () => [
            {
                id: "download",
                actionIcon: (
                    <i className="ri-download-2-line text-primary fs-16"></i>
                ),
                actionName: "Download campaign report",
                onClickHndlr: (
                    event: MouseEvent<HTMLElement>,
                ) => {
                    const record = findCampaign(
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
        [downloadHandler, findCampaign],
    );

    const tableColumns = useMemo(
        () => generateColumns(actionOptions),
        [actionOptions],
    );

    return (
        <div className="tw-card-body !tw-p-0">
            <TableContainer
                columns={tableColumns}
                data={paginatedCampaigns}
                tableClass="mb-0"
                divClass="table-responsive mb-3"
                theadClass="table-light text-muted align-middle"
                showPagination
                totalPages={Math.ceil(
                    campaigns.length / pagination.pageSize,
                )}
                totalRecords={campaigns.length}
                currentPageNumber={pagination.pageNo}
                pageSize={pagination.pageSize}
                callbackPaginationHndlr={setPagination}
            />
        </div>
    );
};

export default CampaignsTab;
