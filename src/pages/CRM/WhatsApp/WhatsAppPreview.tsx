import {
    detectTemplateVariables,
    renderTemplateBody,
    type TemplateCTAButton,
} from "./helper";

export interface WhatsAppPreviewTemplate {
    label?: string;
    templateName?: string;
    templateType?: string;
    category?: string;
    language?: string;
    body?: string;
    headerContent?: string;
    footer?: string;
    sampleText?: string;
    messageActionType?: string;
    quickReplies?: Array<string>;
    callToAction?: Array<TemplateCTAButton>;
}

interface WhatsAppPreviewProps {
    template?: WhatsAppPreviewTemplate;
    hideMeta?: boolean;
}

const mediaLabels: Record<string, { icon: string; text: string }> = {
    IMAGE: { icon: "ri-image-line", text: "Image header" },
    VIDEO: { icon: "ri-video-line", text: "Video header" },
    FILE: { icon: "ri-file-text-line", text: "Document header" },
    LOCATION: { icon: "ri-map-pin-line", text: "Location header" },
    CAROUSEL: { icon: "ri-gallery-line", text: "Carousel header" },
    ORDER_DETAILS: { icon: "ri-shopping-bag-line", text: "Order details" },
};

const WhatsAppPreview = ({ template, hideMeta }: WhatsAppPreviewProps) => {
    if (!template) {
        return (
            <div className="tw-flex tw-h-full tw-min-h-52 tw-flex-col tw-items-center tw-justify-center tw-rounded tw-border tw-border-dashed tw-border-gray-300 tw-bg-gray-50 tw-p-4 tw-text-center">
                <i className="ri-whatsapp-line tw-text-2xl tw-text-gray-400"></i>
                <p className="tw-mb-0 tw-mt-2 tw-text-sm tw-text-gray-500">
                    Select a template to preview
                </p>
            </div>
        );
    }

    const templateType = String(
        template.templateType || "TEXT",
    ).toUpperCase();
    const media = mediaLabels[templateType];
    const messageBody = renderTemplateBody(
        template.body,
        template.sampleText,
    );
    const remainingVariables = detectTemplateVariables(messageBody);
    const quickReplies =
        template.messageActionType === "QuickReplies" ||
        !template.messageActionType
            ? template.quickReplies || []
            : [];
    const ctaButtons =
        template.messageActionType === "CTA" || !template.messageActionType
            ? template.callToAction || []
            : [];

    return (
        <div className="tw-overflow-hidden tw-rounded tw-border tw-border-gray-200">
            <div className="tw-flex tw-items-center tw-gap-2 tw-bg-[#034932] tw-px-3 tw-py-2 tw-text-white">
                <span className="tw-flex tw-h-8 tw-w-8 tw-items-center tw-justify-center tw-rounded-full tw-bg-white/20">
                    <i className="ri-whatsapp-line tw-text-base"></i>
                </span>
                <div className="tw-min-w-0">
                    <p className="tw-mb-0 tw-truncate tw-text-sm tw-font-semibold">
                        {template.label || "Business Account"}
                    </p>
                    <p className="tw-mb-0 tw-text-[11px] tw-opacity-80">
                        Official business account
                    </p>
                </div>
            </div>

            <div
                className="tw-space-y-2 tw-p-3"
                style={{ backgroundColor: "#ece5dd", minHeight: "220px" }}
            >
                <div className="tw-max-w-[85%] tw-rounded tw-rounded-tl-none tw-bg-white tw-p-2 tw-shadow-sm">
                    {media && (
                        <div className="tw-mb-2 tw-flex tw-h-24 tw-flex-col tw-items-center tw-justify-center tw-rounded tw-bg-gray-100 tw-text-gray-500">
                            <i className={`${media.icon} tw-text-xl`}></i>
                            <span className="tw-mt-1 tw-text-[11px]">
                                {media.text}
                            </span>
                            {template.headerContent && (
                                <span className="tw-mt-0.5 tw-max-w-full tw-truncate tw-px-2 tw-text-[10px] tw-text-gray-400">
                                    {template.headerContent}
                                </span>
                            )}
                        </div>
                    )}

                    {messageBody ? (
                        <div className="tw-whitespace-pre-wrap tw-break-words tw-text-[13px] tw-text-gray-800">
                            {messageBody}
                        </div>
                    ) : (
                        <div className="tw-text-[13px] tw-italic tw-text-gray-400">
                            Message body will appear here
                        </div>
                    )}

                    {template.footer && (
                        <div className="tw-mt-1.5 tw-text-[11px] tw-text-gray-500">
                            {template.footer}
                        </div>
                    )}

                    <div className="tw-mt-1 tw-flex tw-items-center tw-justify-end tw-gap-1 tw-text-[10px] tw-text-gray-400">
                        <span>11:24</span>
                        <i className="ri-check-double-line tw-text-[#53bdeb]"></i>
                    </div>
                </div>

                {(quickReplies.length > 0 || ctaButtons.length > 0) && (
                    <div className="tw-max-w-[85%] tw-space-y-1">
                        {quickReplies
                            .filter(reply => reply?.trim())
                            .map((reply, index) => (
                                <div
                                    key={`quick-reply-${index}`}
                                    className="tw-rounded tw-bg-white tw-py-1.5 tw-text-center tw-text-[12px] tw-font-medium tw-text-[#0a7cff] tw-shadow-sm"
                                >
                                    {reply}
                                </div>
                            ))}

                        {ctaButtons
                            .filter(button => button?.buttonTitle?.trim())
                            .map((button, index) => (
                                <div
                                    key={`cta-${index}`}
                                    className="tw-flex tw-items-center tw-justify-center tw-gap-1 tw-rounded tw-bg-white tw-py-1.5 tw-text-[12px] tw-font-medium tw-text-[#0a7cff] tw-shadow-sm"
                                >
                                    <i
                                        className={
                                            button.type === "URL"
                                                ? "ri-external-link-line"
                                                : "ri-phone-line"
                                        }
                                    ></i>
                                    {button.buttonTitle}
                                </div>
                            ))}
                    </div>
                )}
            </div>

            {!hideMeta && (
                <div className="tw-space-y-1 tw-border-t tw-border-gray-200 tw-bg-white tw-p-3">
                    <div className="tw-flex tw-flex-wrap tw-gap-1">
                        <span className="badge badge-soft-primary">
                            {template.category || "CATEGORY"}
                        </span>
                        <span className="badge badge-soft-secondary">
                            {template.language || "LANGUAGE"}
                        </span>
                        <span className="badge badge-soft-info">
                            {templateType}
                        </span>
                    </div>

                    {template.templateName && (
                        <p className="tw-mb-0 tw-break-all tw-text-[11px] tw-text-gray-500">
                            {template.templateName}
                        </p>
                    )}

                    {remainingVariables.length > 0 && (
                        <p className="tw-mb-0 tw-text-[11px] tw-text-[#f7b84b]">
                            {remainingVariables.length} placeholder
                            {remainingVariables.length === 1 ? "" : "s"} without
                            a sample value: {remainingVariables.join(", ")}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

export default WhatsAppPreview;
