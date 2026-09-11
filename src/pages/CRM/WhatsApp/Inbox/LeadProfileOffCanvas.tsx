import { useState } from "react";

import {
    formatDateTime,
    getInitial,
    leadProfiles,
    type WhatsAppConversation,
} from "../helper";
import Button from "../../../../Components/Common/Button";

interface LeadProfileOffCanvasProps {
    conversation?: WhatsAppConversation;
    toggle: () => void;
    onOpenLead: (leadId: string) => void;
}

const summaryRow = (label: string, value: string) => (
    <div key={label} className="tw-border-b tw-border-gray-100 tw-py-1.5">
        <p className="tw-mb-0 tw-text-[11px] tw-uppercase tw-text-gray-500">
            {label}
        </p>
        <p className="tw-mb-0 tw-text-sm tw-font-medium tw-text-gray-800">
            {value || "—"}
        </p>
    </div>
);

const LeadProfileOffCanvas = ({
    conversation,
    toggle,
    onOpenLead,
}: LeadProfileOffCanvasProps) => {
    const [openSection, setOpenSection] = useState<string>("activity");

    if (!conversation) {
        return null;
    }

    const leadDetails = leadProfiles[conversation.leadId];

    const sections = [
        {
            id: "activity",
            title: "Lead activity",
            count: leadDetails?.activities.length || 0,
            emptyText: "No lead activity available.",
            body: leadDetails?.activities.map(item => (
                <div
                    key={item.id}
                    className="tw-border-b tw-border-gray-100 tw-py-2 last:tw-border-0"
                >
                    <p className="tw-mb-0 tw-text-sm tw-font-medium tw-text-gray-800">
                        {item.summary}
                    </p>
                    <p className="tw-mb-0 tw-text-xs tw-text-gray-500">
                        {item.actorName} · {formatDateTime(item.occurredAt)}
                    </p>
                    {item.commentText && (
                        <p className="tw-mb-0 tw-mt-1 tw-text-xs tw-text-gray-600">
                            {item.commentText}
                        </p>
                    )}
                </div>
            )),
        },
        {
            id: "comments",
            title: "Comments and notes",
            count: leadDetails?.comments.length || 0,
            emptyText: "No comments available.",
            body: leadDetails?.comments.map(item => (
                <div
                    key={item.id}
                    className="tw-border-b tw-border-gray-100 tw-py-2 last:tw-border-0"
                >
                    <p className="tw-mb-0 tw-text-sm tw-font-medium tw-text-gray-800">
                        {item.counsellorName}
                    </p>
                    <p className="tw-mb-0 tw-text-xs tw-text-gray-600">
                        {item.commentText}
                    </p>
                    <p className="tw-mb-0 tw-text-[11px] tw-text-gray-400">
                        {formatDateTime(item.createdAt)}
                    </p>
                </div>
            )),
        },
        {
            id: "source",
            title: "Source history",
            count: leadDetails?.sourceHistory.length || 0,
            emptyText: "No source history available.",
            body: leadDetails?.sourceHistory.map(item => (
                <div
                    key={item.id}
                    className="tw-border-b tw-border-gray-100 tw-py-2 last:tw-border-0"
                >
                    <p className="tw-mb-0 tw-text-sm tw-font-medium tw-text-gray-800">
                        {item.isPrimary ? "Primary source" : "Secondary source"}{" "}
                        · {item.source}
                    </p>
                    <p className="tw-mb-0 tw-text-xs tw-text-gray-600">
                        {item.academicYear} · {item.channel} · {item.campaign}
                    </p>
                    <p className="tw-mb-0 tw-text-[11px] tw-text-gray-400">
                        {item.addedBy} · {formatDateTime(item.createdAt)}
                    </p>
                </div>
            )),
        },
    ];

    return (
        <div className="tw-flex tw-h-full tw-flex-col">
            <div className="tw-flex tw-items-start tw-justify-between tw-border-b tw-border-gray-200 tw-p-3">
                <div className="tw-flex tw-items-center tw-gap-2">
                    <span className="tw-flex tw-h-10 tw-w-10 tw-items-center tw-justify-center tw-rounded-full tw-bg-[#034932] tw-text-base tw-font-semibold tw-text-white">
                        {getInitial(
                            conversation.contactName,
                            conversation.studentName,
                            conversation.mobile,
                        )}
                    </span>
                    <div>
                        <p className="tw-mb-0 tw-text-base tw-font-semibold tw-text-gray-800">
                            {leadDetails?.studentName ||
                                conversation.contactName ||
                                conversation.mobile}
                        </p>
                        <p className="tw-mb-0 tw-text-xs tw-text-gray-500">
                            +91 {conversation.mobile}
                        </p>
                    </div>
                </div>

                <Button
                    type="button"
                    variant="secondary"
                    className="!tw-h-8 !tw-w-8 !tw-p-0 tw-border tw-border-gray-200 !tw-bg-white hover:!tw-bg-gray-50"
                    aria-label="Close lead details"
                    onClick={toggle}
                >
                    <i className="ri-close-line tw-text-lg"></i>
                </Button>
            </div>

            <div className="tw-flex-1 tw-overflow-y-auto tw-p-3">
                <div className="row">
                    {[
                        ["Lead number", leadDetails?.leadId || conversation.leadNumber],
                        ["Stage", leadDetails?.stage || conversation.stageName],
                        ["Sub-stage", leadDetails?.substage || ""],
                        ["Branch", leadDetails?.branch || conversation.branchName],
                        ["Class", leadDetails?.applyingClass || ""],
                        ["Curriculum", leadDetails?.curriculum || ""],
                        ["Owner", leadDetails?.owner || ""],
                        [
                            "Lead score",
                            leadDetails?.leadScore != null
                                ? String(leadDetails.leadScore)
                                : "",
                        ],
                        ["Source", leadDetails?.source || ""],
                        ["Account", conversation.integrationName],
                        [
                            "Next follow-up",
                            leadDetails?.nextFollowupAt
                                ? formatDateTime(leadDetails.nextFollowupAt)
                                : "",
                        ],
                        [
                            "Last active",
                            formatDateTime(conversation.lastMessageTime),
                        ],
                    ].map(([label, value]) => (
                        <div className="col-6" key={label}>
                            {summaryRow(label as string, value as string)}
                        </div>
                    ))}
                </div>

                <div className="tw-mt-3">
                    {sections.map(section => (
                        <div
                            key={section.id}
                            className="tw-mb-2 tw-rounded tw-border tw-border-gray-200"
                        >
                            <Button
                                type="button"
                                variant="secondary"
                                className="tw-w-full !tw-justify-between !tw-bg-gray-50 !tw-rounded-none !tw-shadow-none !tw-px-3 !tw-py-2 tw-text-left"
                                onClick={() =>
                                    setOpenSection(current =>
                                        current === section.id ? "" : section.id,
                                    )
                                }
                            >
                                <span className="tw-text-sm tw-font-semibold tw-text-gray-800">
                                    {section.title}
                                    <span className="badge badge-soft-secondary tw-ms-2">
                                        {section.count}
                                    </span>
                                </span>
                                <i
                                    className={
                                        openSection === section.id
                                            ? "ri-arrow-up-s-line"
                                            : "ri-arrow-down-s-line"
                                    }
                                ></i>
                            </Button>

                            {openSection === section.id && (
                                <div className="tw-px-3 tw-py-1">
                                    {section.count > 0 ? (
                                        section.body
                                    ) : (
                                        <p className="tw-mb-0 tw-py-2 tw-text-sm tw-text-gray-500">
                                            {section.emptyText}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {conversation.leadId && (
                <div className="tw-border-t tw-border-gray-200 tw-p-3">
                    <Button
                        type="button"
                        variant="hoverInfo" className="tw-w-full"
                        onClick={() => onOpenLead(conversation.leadId)}
                    >
                        Open complete lead details
                    </Button>
                </div>
            )}
        </div>
    );
};

export default LeadProfileOffCanvas;
