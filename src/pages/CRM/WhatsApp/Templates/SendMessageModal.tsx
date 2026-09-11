import {
    useEffect,
    useMemo,
    useState,
    type ChangeEvent,
} from "react";

import {
    Button,
    SelectInput,
    TextArea,
    TextInput,
} from "../../../../Components/Common";
import WhatsAppPreview from "../WhatsAppPreview";
import {
    cleanPhone,
    detectTemplateVariables,
    isValidIndianMobile,
    mediaTemplateTypes,
    whatsAppAccounts,
    whatsAppTemplates,
    type WhatsAppTemplate,
} from "../helper";
import { toast } from "react-toastify";

export interface SendRecipient {
    phoneNumber: string;
    name?: string;
    leadId?: string;
}

interface SendMessageModalProps {
    toggle: () => void;
    initialRecipients?: Array<SendRecipient>;
}

type SendMode = "single" | "selected" | "upload";

const SendMessageModal = ({
    toggle,
    initialRecipients = [],
}: SendMessageModalProps) => {
    const [mode, setMode] = useState<SendMode>(
        initialRecipients.length ? "selected" : "single",
    );
    const [accountId, setAccountId] = useState<string>(
        whatsAppAccounts.find(item => item.isDefault && item.hasCredentials)
            ?.id || "",
    );
    const [templateId, setTemplateId] = useState<string>("");
    const [templateParams, setTemplateParams] = useState<Array<string>>([]);
    const [message, setMessage] = useState<string>("");
    const [phone, setPhone] = useState<string>(
        initialRecipients.length === 1
            ? cleanPhone(initialRecipients[0]?.phoneNumber)
            : "",
    );
    const [uploadRecipients, setUploadRecipients] = useState<
        Array<SendRecipient>
    >([]);
    const [mediaFileName, setMediaFileName] = useState<string>("");
    const [isSending, setIsSending] = useState<boolean>(false);

    const accountOptions = useMemo(
        () =>
            whatsAppAccounts
                .filter(item => item.hasCredentials)
                .map(item => ({
                    id: item.id,
                    name: `${item.name} · ${item.branchName}`,
                })),
        [],
    );

    const templateOptions = useMemo(() => {
        if (!accountId) {
            return [];
        }

        return whatsAppTemplates
            .filter(
                item =>
                    item.integrationId === accountId &&
                    item.status === "APPROVED",
            )
            .map(item => ({
                id: item.id,
                name: `${item.templateName} · ${item.category}`,
            }));
    }, [accountId]);

    const selectedTemplate: WhatsAppTemplate | undefined = useMemo(
        () => whatsAppTemplates.find(item => item.id === templateId),
        [templateId],
    );

    const templateRequiresMedia = mediaTemplateTypes.includes(
        String(selectedTemplate?.templateType || "TEXT").toUpperCase(),
    );

    const recipients: Array<SendRecipient> = useMemo(() => {
        if (mode === "selected") {
            return initialRecipients;
        }

        if (mode === "upload") {
            return uploadRecipients;
        }

        return phone ? [{ phoneNumber: cleanPhone(phone) }] : [];
    }, [initialRecipients, mode, phone, uploadRecipients]);

    const validRecipients = useMemo(
        () => recipients.filter(item => isValidIndianMobile(item.phoneNumber)),
        [recipients],
    );

    useEffect(() => {
        setTemplateId("");
        setTemplateParams([]);
        setMessage("");
        setMediaFileName("");
    }, [accountId]);

    const templateChangeHandler = (event: ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        const template = whatsAppTemplates.find(item => item.id === value);

        setTemplateId(value);
        setMessage(template?.body || "");
        setTemplateParams(
            Array.from(
                { length: detectTemplateVariables(template?.body).length },
                () => "",
            ),
        );

        if (
            !mediaTemplateTypes.includes(
                String(template?.templateType || "TEXT").toUpperCase(),
            )
        ) {
            setMediaFileName("");
        }
    };

    const contactsUploadHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        const reader = new FileReader();

        reader.onload = () => {
            const lines = String(reader.result || "")
                .split(/\r?\n/)
                .filter(Boolean);

            const parsed = lines.flatMap(line => {
                const cells = line
                    .split(/,|\t/)
                    .map(cell => cell.replace(/^"|"$/g, "").trim());
                const candidate = cells.find(isValidIndianMobile);

                return candidate
                    ? [
                        {
                            phoneNumber: cleanPhone(candidate),
                            name: cells[0],
                        },
                    ]
                    : [];
            });

            const unique = [
                ...new Map(
                    parsed.map(item => [item.phoneNumber, item]),
                ).values(),
            ];

            setUploadRecipients(unique);
            if (unique.length) {
                toast.success(
                    `${unique.length} valid contact${unique.length === 1 ? "" : "s"} ready to send.`,
                );
            } else {
                toast.error("No valid mobile numbers were found in the file.");
            }
        };

        reader.readAsText(file);
    };

    const mediaUploadHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        setMediaFileName(file.name);
        toast.success(`${file.name} attached and ready to send.`);
    };

    const missingParamCount = templateParams.filter(
        value => !value.trim(),
    ).length;

    const canSend = Boolean(
        accountId &&
        templateId &&
        validRecipients.length &&
        message.trim() &&
        !missingParamCount &&
        (!templateRequiresMedia || mediaFileName) &&
        !isSending,
    );

    const sendHandler = () => {
        if (!canSend) {
            return;
        }

        setIsSending(true);
        toast.info(
            `Sending to ${validRecipients.length} recipient${validRecipients.length === 1 ? "" : "s"}…`,
        );

        window.setTimeout(() => {
            setIsSending(false);
            toast.success(
                validRecipients.length === 1
                    ? "WhatsApp message sent successfully."
                    : `${validRecipients.length} sent, 0 failed.`,
            );
        }, 700);
    };

    const previewTemplate = selectedTemplate
        ? {
            ...selectedTemplate,
            sampleText: templateParams.some(value => value.trim())
                ? templateParams.join("\n")
                : selectedTemplate.sampleText,
        }
        : undefined;

    return (
        <div className="tw-p-4">
            <div className="row">
                <div className="col-12 col-lg-7">
                    {!initialRecipients.length && (
                        <div className="tw-mb-3 tw-flex tw-gap-2">
                            {(
                                [
                                    ["single", "Single contact"],
                                    ["upload", "Bulk upload"],
                                ] as Array<[SendMode, string]>
                            ).map(([id, label]) => (
                                <Button
                                    key={id}
                                    type="button"
                                    variant="secondary"
                                    onClick={() => setMode(id)}
                                    className={`!tw-rounded-full tw-border !tw-px-3 !tw-py-1 !tw-text-xs tw-font-medium ${mode === id
                                        ? "tw-border-[#1bb3a6] !tw-bg-[#d1f4f1] tw-text-[#0b6d63]"
                                        : "tw-border-gray-200 !tw-bg-transparent tw-text-gray-600 hover:!tw-bg-gray-50"
                                        }`}
                                >
                                    {label}
                                </Button>
                            ))}
                        </div>
                    )}

                    <div className="row">
                        <div className="col-12 col-md-6">
                            <SelectInput
                                name="sendAccountId"
                                labelText="WhatsApp Account"
                                defaultSelect="Select account"
                                value={accountId}
                                onChange={(
                                    event: ChangeEvent<HTMLSelectElement>,
                                ) => setAccountId(event.target.value)}
                                menuItems={accountOptions}
                                valueKey="id"
                                textKey="name"
                                labelClass="required"
                            />
                        </div>

                        <div className="col-12 col-md-6">
                            <SelectInput
                                name="sendTemplateId"
                                labelText="Approved Template"
                                defaultSelect={
                                    accountId
                                        ? templateOptions.length
                                            ? "Select template"
                                            : "No approved templates"
                                        : "Select an account first"
                                }
                                value={templateId}
                                onChange={templateChangeHandler}
                                menuItems={templateOptions}
                                valueKey="id"
                                textKey="name"
                                isDisabled={!templateOptions.length}
                                labelClass="required"
                            />
                        </div>
                    </div>

                    {mode === "single" && (
                        <TextInput
                            name="sendPhone"
                            labelText="Mobile Number"
                            placeHolder="10-digit mobile number"
                            value={phone}
                            onChange={(
                                event: ChangeEvent<HTMLInputElement>,
                            ) =>
                                setPhone(
                                    event.target.value
                                        .replace(/\D/g, "")
                                        .slice(0, 10),
                                )
                            }
                            maxLength={10}
                            invalid={Boolean(
                                phone && !isValidIndianMobile(phone),
                            )}
                            error={
                                phone && !isValidIndianMobile(phone)
                                    ? "Enter a valid 10-digit mobile number starting with 6-9"
                                    : ""
                            }
                            labelClass="required"
                        />
                    )}

                    {mode === "upload" && (
                        <div className="tw-mb-3 tw-rounded tw-border tw-border-dashed tw-border-gray-300 tw-p-3 tw-text-center">
                            <i className="ri-upload-cloud-2-line tw-text-2xl tw-text-gray-400"></i>
                            <p className="tw-mb-1 tw-mt-1 tw-text-sm tw-font-semibold tw-text-gray-800">
                                Upload contacts
                            </p>
                            <p className="tw-mb-2 tw-text-xs tw-text-gray-500">
                                CSV or tab-separated file containing mobile
                                numbers
                            </p>
                            <input
                                type="file"
                                accept=".csv,.txt,.tsv"
                                className="form-control"
                                onChange={contactsUploadHandler}
                            />
                            <p className="tw-mb-0 tw-mt-2 tw-text-xs tw-font-semibold tw-text-gray-700">
                                {uploadRecipients.length
                                    ? `${uploadRecipients.length} valid contacts ready`
                                    : "No file chosen"}
                            </p>
                        </div>
                    )}

                    {mode === "selected" && (
                        <div className="alert alert-info tw-flex tw-items-start tw-gap-2">
                            <i className="ri-checkbox-circle-line"></i>
                            <span>
                                <strong>
                                    {validRecipients.length} valid recipients
                                </strong>
                                <br />
                                <small>
                                    {initialRecipients.length -
                                        validRecipients.length}{" "}
                                    lead(s) without a valid mobile number will
                                    not be sent.
                                </small>
                            </span>
                        </div>
                    )}

                    <TextArea
                        name="sendMessage"
                        labelText={templateId ? "Template Message" : "Message"}
                        value={message}
                        onChange={(
                            event: ChangeEvent<HTMLTextAreaElement>,
                        ) => setMessage(event.target.value)}
                        isReadOnly={Boolean(templateId)}
                        height="120px"
                        placeHolder="Select an approved template to start the conversation"
                        helperText={
                            templateId
                                ? "Template content cannot be edited"
                                : "A template is required to open a new conversation"
                        }
                        labelClass="required"
                    />

                    {templateParams.length > 0 && (
                        <div className="tw-mb-3 tw-rounded tw-border tw-border-gray-200 tw-p-3">
                            <p className="tw-mb-0 tw-text-sm tw-font-semibold tw-text-gray-800">
                                Template parameters
                            </p>
                            <p className="tw-mb-2 tw-text-xs tw-text-gray-500">
                                Enter values in placeholder order.
                            </p>

                            <div className="row">
                                {templateParams.map((value, index) => (
                                    <div
                                        className="col-12 col-md-6"
                                        key={`param-${index}`}
                                    >
                                        <TextInput
                                            name={`templateParam-${index}`}
                                            labelText={`{{${index + 1}}}`}
                                            placeHolder={`Value for parameter ${index + 1}`}
                                            value={value}
                                            onChange={(
                                                event: ChangeEvent<HTMLInputElement>,
                                            ) =>
                                                setTemplateParams(current =>
                                                    current.map(
                                                        (item, itemIndex) =>
                                                            itemIndex === index
                                                                ? event.target
                                                                    .value
                                                                : item,
                                                    ),
                                                )
                                            }
                                            invalid={!value.trim()}
                                            error={
                                                !value.trim()
                                                    ? "This parameter is required"
                                                    : ""
                                            }
                                            labelClass="required"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {templateRequiresMedia && (
                        <div className="tw-mb-3 tw-rounded tw-border tw-border-gray-200 tw-p-3">
                            <p className="tw-mb-2 tw-text-sm tw-font-semibold tw-text-gray-800">
                                {String(
                                    selectedTemplate?.templateType,
                                ).toLowerCase()}{" "}
                                attachment required by this template
                            </p>
                            <input
                                type="file"
                                className="form-control"
                                accept={
                                    selectedTemplate?.templateType === "IMAGE"
                                        ? "image/jpeg,image/png,image/webp,image/gif"
                                        : selectedTemplate?.templateType ===
                                            "VIDEO"
                                            ? "video/mp4"
                                            : ".pdf,.doc,.docx"
                                }
                                onChange={mediaUploadHandler}
                            />
                            {mediaFileName && (
                                <p className="tw-mb-0 tw-mt-2 tw-text-xs tw-text-gray-600">
                                    <i className="ri-attachment-2 tw-me-1"></i>
                                    {mediaFileName}
                                </p>
                            )}
                        </div>
                    )}
                </div>

                <div className="col-12 col-lg-5">
                    <p className="tw-mb-2 tw-text-sm tw-font-semibold tw-uppercase tw-text-gray-500">
                        Preview
                    </p>
                    <WhatsAppPreview template={previewTemplate} />
                </div>
            </div>

            <div className="tw-mt-4 tw-flex tw-justify-end tw-gap-2 tw-border-t tw-border-gray-200 tw-pt-4">
                <Button type="button" variant="secondary" onClick={toggle}>
                    Cancel
                </Button>

                <Button
                    type="button"
                    variant="primary"
                    disabled={!canSend}
                    onClick={sendHandler}
                >
                    <i className="ri-send-plane-fill"></i>
                    {isSending
                        ? "Sending…"
                        : `Send to ${validRecipients.length}`}
                </Button>
            </div>
        </div>
    );
};

export default SendMessageModal;
