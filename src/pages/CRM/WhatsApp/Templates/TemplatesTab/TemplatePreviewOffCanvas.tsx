import { Button,
    StatusLabel } from "../../../../../Components/Common";
import WhatsAppPreview from "../../WhatsAppPreview";
import {
    crmUsers,
    detectTemplateVariables,
    formatDateTime,
    getStatusLabelType,
    type WhatsAppTemplate,
} from "../../helper";

interface TemplatePreviewOffCanvasProps {
    template?: WhatsAppTemplate;
    toggle: () => void;
    onEdit: (template: WhatsAppTemplate) => void;
    onDuplicate: (template: WhatsAppTemplate) => void;
    onDelete: (template: WhatsAppTemplate) => void;
}

const detailItem = (label: string, value: string) => (
    <div className="col-6" key={label}>
        <div className="tw-border-b tw-border-gray-100 tw-py-1.5">
            <p className="tw-mb-0 tw-text-[11px] tw-uppercase tw-text-gray-500">
                {label}
            </p>
            <p className="tw-mb-0 tw-break-words tw-text-sm tw-font-medium tw-text-gray-800">
                {value || "—"}
            </p>
        </div>
    </div>
);

const TemplatePreviewOffCanvas = ({
    template,
    toggle,
    onEdit,
    onDuplicate,
    onDelete,
}: TemplatePreviewOffCanvasProps) => {
    if (!template) {
        return null;
    }

    const variableCount = detectTemplateVariables(template.body).length;
    const visibleUserNames = crmUsers
        .filter(user => template.visibleUserIds.includes(user.id))
        .map(user => user.name);

    return (
        <div className="tw-flex tw-h-full tw-flex-col">
            <div className="tw-flex tw-items-start tw-justify-between tw-gap-2 tw-border-b tw-border-gray-200 tw-p-3">
                <div className="tw-min-w-0">
                    <p className="tw-mb-0 tw-truncate tw-text-base tw-font-semibold tw-text-gray-800">
                        {template.label || template.templateName}
                    </p>
                    <p className="tw-mb-0 tw-truncate tw-text-xs tw-text-gray-500">
                        {template.templateName}
                    </p>
                </div>

                <div className="tw-flex tw-flex-shrink-0 tw-items-center tw-gap-2">
                    <StatusLabel
                        type={getStatusLabelType(template.status)}
                        labelName={template.status}
                    />
                    <Button
                        type="button"
                        variant="secondary"
                        className="!tw-h-8 !tw-w-8 !tw-p-0 tw-border tw-border-gray-200 !tw-bg-white hover:!tw-bg-gray-50"
                        aria-label="Close template preview"
                        onClick={toggle}
                    >
                        <i className="ri-close-line tw-text-lg"></i>
                    </Button>
                </div>
            </div>

            <div className="tw-flex-1 tw-overflow-y-auto tw-p-3">
                <div className="row">
                    {detailItem("Account", template.integrationName)}
                    {detailItem("Category", template.category)}
                    {detailItem("Language", template.language)}
                    {detailItem("Type", template.templateType)}
                    {detailItem("Message buttons", template.messageActionType)}
                    {detailItem(
                        "Variables",
                        variableCount ? String(variableCount) : "0",
                    )}
                    {detailItem("Created", formatDateTime(template.createdAt))}
                    {detailItem("Updated", formatDateTime(template.updatedAt))}
                </div>

                {template.headerContent && (
                    <div className="tw-mt-3">
                        <p className="tw-mb-1 tw-text-[11px] tw-uppercase tw-text-gray-500">
                            Header content
                        </p>
                        <p className="tw-mb-0 tw-break-all tw-text-sm tw-text-gray-700">
                            {template.headerContent}
                        </p>
                    </div>
                )}

                {template.sampleText && (
                    <div className="tw-mt-3">
                        <p className="tw-mb-1 tw-text-[11px] tw-uppercase tw-text-gray-500">
                            Sample text
                        </p>
                        <p className="tw-mb-0 tw-whitespace-pre-wrap tw-text-sm tw-text-gray-700">
                            {template.sampleText}
                        </p>
                    </div>
                )}

                {template.quickReplies.length > 0 && (
                    <div className="tw-mt-3">
                        <p className="tw-mb-1 tw-text-[11px] tw-uppercase tw-text-gray-500">
                            Quick replies
                        </p>
                        <div className="tw-flex tw-flex-wrap tw-gap-1">
                            {template.quickReplies.map((reply, index) => (
                                <span
                                    key={`reply-${index}`}
                                    className="badge badge-soft-primary"
                                >
                                    {reply}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {template.callToAction.length > 0 && (
                    <div className="tw-mt-3">
                        <p className="tw-mb-1 tw-text-[11px] tw-uppercase tw-text-gray-500">
                            Call-to-action buttons
                        </p>
                        {template.callToAction.map((button, index) => (
                            <div
                                key={`cta-${index}`}
                                className="tw-mb-1 tw-rounded tw-border tw-border-gray-200 tw-p-2"
                            >
                                <p className="tw-mb-0 tw-text-sm tw-font-medium tw-text-gray-800">
                                    {button.buttonTitle}
                                    <span className="badge badge-soft-secondary tw-ms-2">
                                        {button.type}
                                    </span>
                                </p>
                                <p className="tw-mb-0 tw-break-all tw-text-xs tw-text-gray-500">
                                    {button.buttonValue}
                                </p>
                            </div>
                        ))}
                    </div>
                )}

                <div className="tw-mt-3">
                    <p className="tw-mb-1 tw-text-[11px] tw-uppercase tw-text-gray-500">
                        Who can use this template
                    </p>
                    {visibleUserNames.length ? (
                        <div className="tw-flex tw-flex-wrap tw-gap-1">
                            {visibleUserNames.map(name => (
                                <span
                                    key={name}
                                    className="badge badge-soft-secondary"
                                >
                                    {name}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <p className="tw-mb-0 tw-text-sm tw-text-gray-500">
                            Administrators only
                        </p>
                    )}
                </div>

                {template.rejectionReason && (
                    <div className="alert alert-danger tw-mt-3 tw-mb-0">
                        <p className="tw-mb-1 tw-text-sm tw-font-semibold">
                            Rejection reason
                        </p>
                        <p className="tw-mb-0 tw-text-xs">
                            {template.rejectionReason}
                        </p>
                    </div>
                )}

                <div className="tw-mt-3">
                    <p className="tw-mb-1 tw-text-[11px] tw-uppercase tw-text-gray-500">
                        Preview
                    </p>
                    <WhatsAppPreview template={template} hideMeta />
                </div>
            </div>

            <div className="tw-flex tw-flex-wrap tw-gap-2 tw-border-t tw-border-gray-200 tw-p-3">
                <Button
                    type="button"
                    variant="primary"
                    onClick={() => onEdit(template)}
                >
                    <i className="ri-pencil-line tw-me-1"></i>
                    Edit
                </Button>
                <Button
                    type="button"
                    variant="hoverInfo"
                    onClick={() => onDuplicate(template)}
                >
                    <i className="ri-file-copy-line tw-me-1"></i>
                    Duplicate
                </Button>
                <Button
                    type="button"
                    variant="reject"
                    onClick={() => onDelete(template)}
                >
                    <i className="ri-delete-bin-line tw-me-1"></i>
                    Delete
                </Button>
            </div>
        </div>
    );
};

export default TemplatePreviewOffCanvas;
