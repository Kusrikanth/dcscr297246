import { useState } from "react";

import { Button,
    ConfirmationModal,
    StatusLabel } from "../../../../Components/Common";
import { useModal } from "../../../../hooks/modalhook";
import NoDataComp from "../../../../Components/Common/NoDataComp";
import {
    formatDateTime,
    getCampaignProgress,
    getCampaignRuleLabel,
    getStatusLabelType,
    type MarketingCampaign,
} from "../helper";

interface CampaignsTabProps {
    campaigns: Array<MarketingCampaign>;
    onStatusChange: (campaign: MarketingCampaign, status: string) => void;
}

const detailItem = (label: string, value: string | number) => (
    <div className="col-6 col-md-4 col-xl-3" key={label}>
        <div className="tw-py-1.5">
            <p className="tw-mb-0 tw-text-[11px] tw-uppercase tw-text-gray-500">
                {label}
            </p>
            <p className="tw-mb-0 tw-break-words tw-text-sm tw-font-medium tw-text-gray-800">
                {value === "" || value == null ? "—" : value}
            </p>
        </div>
    </div>
);

const CampaignsTab = ({ campaigns, onStatusChange }: CampaignsTabProps) => {
    const [expandedId, setExpandedId] = useState<string>("");

    const { openModal, closeModal, modalState } = useModal();

    const stopHandler = () => {
        onStatusChange(modalState.modalData, "CANCELLED");
        closeModal();
    };

    if (!campaigns.length) {
        return (
            <div className="tw-card">
                <div className="tw-card-body">
                    <NoDataComp
                        title="No bulk marketing campaigns"
                        helperText="Create one from the filtered Leads screen."
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="tw-card">
            <div className="tw-card-body">
                {campaigns.map(campaign => {
                    const isExpanded = expandedId === campaign.id;
                    const progress = getCampaignProgress(campaign);
                    const isStoppable = !["COMPLETED", "CANCELLED"].includes(
                        campaign.status,
                    );

                    return (
                        <div
                            key={campaign.id}
                            className="tw-mb-3 tw-overflow-hidden tw-rounded tw-border tw-border-gray-200"
                        >
                            <div className="tw-flex tw-flex-wrap tw-items-center tw-gap-2 tw-pe-3">
                            <Button
                                type="button"
                                variant="secondary"
                                className="tw-w-full tw-flex-wrap !tw-justify-start tw-gap-3 !tw-bg-white !tw-rounded-none !tw-shadow-none !tw-p-3 tw-text-start hover:!tw-bg-gray-50"
                                onClick={() =>
                                    setExpandedId(
                                        isExpanded ? "" : campaign.id,
                                    )
                                }
                            >
                                <span className="tw-min-w-56 tw-flex-1">
                                    <span className="tw-block tw-text-[11px] tw-uppercase tw-text-gray-500">
                                        Campaign name
                                    </span>
                                    <span className="tw-block tw-text-sm tw-font-semibold tw-text-gray-800">
                                        {campaign.name}
                                    </span>
                                </span>

                                <span className="tw-w-32">
                                    <span className="tw-block tw-text-[11px] tw-uppercase tw-text-gray-500">
                                        Status
                                    </span>
                                    <StatusLabel
                                        type={getStatusLabelType(
                                            campaign.status,
                                        )}
                                        labelName={campaign.status}
                                    />
                                </span>

                                <span className="tw-w-44">
                                    <span className="tw-block tw-text-[11px] tw-uppercase tw-text-gray-500">
                                        Created on
                                    </span>
                                    <span className="tw-block tw-text-sm tw-text-gray-700">
                                        {formatDateTime(campaign.createdAt)}
                                    </span>
                                </span>

                                <span className="tw-w-36">
                                    <span className="tw-block tw-text-[11px] tw-uppercase tw-text-gray-500">
                                        Created by
                                    </span>
                                    <span className="tw-block tw-text-sm tw-text-gray-700">
                                        {campaign.createdBy || "—"}
                                    </span>
                                </span>

                                <i
                                    className={`tw-text-lg tw-text-gray-400 ${isExpanded
                                        ? "ri-arrow-up-s-line"
                                        : "ri-arrow-down-s-line"
                                        }`}
                                ></i>
                            </Button>

                            {isStoppable && (
                                <div className="tw-flex tw-flex-shrink-0 tw-flex-wrap tw-gap-2">
                                    {campaign.status === "ACTIVE" && (
                                        <Button
                                            type="button"
                                            variant="hoverInfo"
                                            title="Pause this campaign"
                                            onClick={() =>
                                                onStatusChange(
                                                    campaign,
                                                    "PAUSED",
                                                )
                                            }
                                        >
                                            <i className="ri-pause-circle-line tw-me-1"></i>
                                            Pause
                                        </Button>
                                    )}

                                    {campaign.status === "PAUSED" && (
                                        <Button
                                            type="button"
                                            variant="hoverInfo"
                                            title="Resume this campaign"
                                            onClick={() =>
                                                onStatusChange(
                                                    campaign,
                                                    "ACTIVE",
                                                )
                                            }
                                        >
                                            <i className="ri-play-circle-line tw-me-1"></i>
                                            Resume
                                        </Button>
                                    )}

                                    <Button
                                        type="button"
                                        variant="reject"
                                        title="Stop this campaign and cancel every message not yet sent"
                                        onClick={() => openModal(campaign)}
                                    >
                                        <i className="ri-forbid-line tw-me-1"></i>
                                        Stop
                                    </Button>
                                </div>
                            )}
                            </div>

                            {isExpanded && (
                                <div className="tw-border-t tw-border-gray-200 tw-bg-gray-50 tw-p-3">
                                    <div className="row">
                                        {detailItem(
                                            "Updated on",
                                            formatDateTime(campaign.updatedAt),
                                        )}
                                        {detailItem(
                                            "Rule",
                                            getCampaignRuleLabel(campaign),
                                        )}
                                        {detailItem(
                                            "WhatsApp account",
                                            campaign.integrationName,
                                        )}
                                        {detailItem(
                                            "Lead recipients",
                                            campaign.recipientCount,
                                        )}
                                        {detailItem(
                                            "Primary mobile numbers",
                                            campaign.primaryCount,
                                        )}
                                        {detailItem(
                                            "Alternate mobile numbers",
                                            campaign.alternateCount,
                                        )}
                                        {detailItem(
                                            "Communications",
                                            campaign.communicationCount,
                                        )}
                                        {detailItem(
                                            "First communication",
                                            formatDateTime(
                                                campaign.firstCommunicationAt,
                                            ),
                                        )}
                                    </div>

                                    <div className="tw-mt-3 tw-rounded tw-border tw-border-gray-200 tw-bg-white tw-p-3">
                                        <div className="tw-flex tw-flex-wrap tw-items-center tw-justify-between tw-gap-2">
                                            <div>
                                                <p className="tw-mb-0 tw-text-sm tw-font-semibold tw-text-gray-800">
                                                    Processing status
                                                </p>
                                                <p className="tw-mb-0 tw-text-xs tw-text-gray-500">
                                                    WhatsApp delivery summary
                                                    across all scheduled
                                                    communications.
                                                </p>
                                            </div>

                                            <div className="tw-min-w-56 tw-flex-1">
                                                <div className="tw-h-2 tw-w-full tw-overflow-hidden tw-rounded tw-bg-gray-100">
                                                    <div
                                                        className="tw-h-full tw-bg-[#1bb3a6]"
                                                        style={{
                                                            width: `${progress}%`,
                                                        }}
                                                    />
                                                </div>
                                                <p className="tw-mb-0 tw-mt-1 tw-text-end tw-text-xs tw-text-gray-500">
                                                    {
                                                        campaign.completedDeliveries
                                                    }
                                                    /{campaign.totalDeliveries}{" "}
                                                    processed · {progress}%
                                                </p>
                                            </div>
                                        </div>

                                        <div className="row tw-mt-3">
                                            {[
                                                [
                                                    "Scheduled",
                                                    campaign.totalDeliveries,
                                                ],
                                                [
                                                    "Pending",
                                                    campaign.pendingDeliveries,
                                                ],
                                                [
                                                    "Queued",
                                                    campaign.queuedDeliveries,
                                                ],
                                                ["Sent", campaign.sentDeliveries],
                                                [
                                                    "Delivered",
                                                    campaign.deliveredDeliveries,
                                                ],
                                                ["Read", campaign.readDeliveries],
                                            ].map(([label, value]) => (
                                                <div
                                                    className="col-6 col-md-4 col-xl-2"
                                                    key={label as string}
                                                >
                                                    <p className="tw-mb-0 tw-text-[11px] tw-uppercase tw-text-gray-500">
                                                        {label}
                                                    </p>
                                                    <p className="tw-mb-0 tw-text-sm tw-font-semibold tw-text-gray-800">
                                                        {value}
                                                    </p>
                                                </div>
                                            ))}

                                            <div className="col-6 col-md-4 col-xl-2">
                                                <p className="tw-mb-0 tw-text-[11px] tw-uppercase tw-text-gray-500">
                                                    Failed
                                                </p>
                                                <p
                                                    className={`tw-mb-0 tw-text-sm tw-font-semibold ${campaign.failedDeliveries
                                                        ? "tw-text-danger"
                                                        : "tw-text-gray-800"
                                                        }`}
                                                >
                                                    {campaign.failedDeliveries}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <ConfirmationModal
                id="crm-automation-campaign-stop"
                isOpen={modalState.showModal}
                iconType="reject"
                confirmTitle={`Stop "${modalState.modalData?.name}"?`}
                confirmMessage="Messages already sent cannot be recalled; everything still queued is cancelled."
                confirmBtnText="Stop Campaign"
                confirmHndlr={stopHandler}
                cancelHndlr={closeModal}
            />
        </div>
    );
};

export default CampaignsTab;
