import {
    useMemo,
    useState,
    type ChangeEvent,
} from "react";

import {
    Button,
    SelectInput,
    TextArea,
    TextInput,
} from "../../../Components/Common";
import type { LeadRecord } from "./types";

export type BulkMessageChannel =
    | "whatsapp"
    | "sms"
    | "email"
    | "campaign";

interface BulkMessageModalProps {
    channel: BulkMessageChannel;
    leads: LeadRecord[];
    toggle: () => void;
    onSend: (payload: {
        channel: BulkMessageChannel;
        templateId: string;
        subject: string;
        body: string;
        leadIds: string[];
    }) => void;
}

const templatesByChannel: Record<
    BulkMessageChannel,
    Array<{ id: string; name: string; body: string }>
> = {
    whatsapp: [
        {
            id: "admission-followup",
            name: "Admission follow-up",
            body: "Dear Parent, thank you for your interest in DPS. Our counsellor will call you shortly to take your admission enquiry forward.",
        },
        {
            id: "campus-visit",
            name: "Campus visit invite",
            body: "Dear Parent, we would love to host you on campus. Visits run between 10 am and 4 pm on Saturday and Sunday.",
        },
    ],
    sms: [
        {
            id: "sms-followup",
            name: "Admission follow-up",
            body: "DPS Admissions: our counsellor will call you shortly regarding your enquiry. Reply STOP to opt out.",
        },
    ],
    email: [
        {
            id: "email-brochure",
            name: "Campus brochure",
            body: "Dear Parent,\n\nPlease find attached our campus brochure and the admission process for the coming academic year.\n\nRegards,\nDPS Admissions",
        },
    ],
    campaign: [
        {
            id: "campaign-admissions",
            name: "Admissions 2026 Blast",
            body: "Admissions for 2026-27 are open. Register today to reserve a seat for your child.",
        },
    ],
};

const channelLabels: Record<BulkMessageChannel, string> = {
    whatsapp: "WhatsApp",
    sms: "SMS",
    email: "Email",
    campaign: "Marketing campaign",
};

const BulkMessageModal = ({
    channel,
    leads,
    toggle,
    onSend,
}: BulkMessageModalProps) => {
    const templates = templatesByChannel[channel] || [];

    const [templateId, setTemplateId] = useState<string>("");
    const [subject, setSubject] = useState<string>("");
    const [body, setBody] = useState<string>("");

    const recipients = useMemo(
        () =>
            leads.filter(lead =>
                channel === "email"
                    ? Boolean(lead.email)
                    : Boolean(lead.phone),
            ),
        [leads, channel],
    );

    const skipped = leads.length - recipients.length;

    const templateChangeHandler = (
        event: ChangeEvent<HTMLSelectElement>,
    ) => {
        const nextId = event.target.value;
        const template = templates.find(
            item => item.id === nextId,
        );

        setTemplateId(nextId);

        if (template) {
            setBody(template.body);
        }
    };

    return (
        <div className="tw-bg-white">
            <div className="tw-p-4">
                <p className="tw-mb-3 tw-text-sm tw-text-gray-600">
                    {channelLabels[channel]} will be sent to{" "}
                    <strong>{recipients.length}</strong> of{" "}
                    {leads.length} selected lead
                    {leads.length === 1 ? "" : "s"}.
                    {skipped > 0 && (
                        <span className="tw-text-amber-600">
                            {" "}
                            {skipped} lead
                            {skipped === 1 ? "" : "s"} skipped —
                            no{" "}
                            {channel === "email"
                                ? "email address"
                                : "phone number"}{" "}
                            on record.
                        </span>
                    )}
                </p>

                <div className="row">
                    <div className="col-12 col-lg-6">
                        <SelectInput
                            name="templateId"
                            labelText="Template"
                            value={templateId}
                            onChange={templateChangeHandler}
                            menuItems={templates}
                            valueKey="id"
                            textKey="name"
                            defaultSelect="Select a template"
                        />
                    </div>

                    {channel === "email" && (
                        <div className="col-12 col-lg-6">
                            <TextInput
                                name="subject"
                                labelText="Subject"
                                labelClass="required"
                                placeHolder="Enter the email subject"
                                value={subject}
                                onChange={(
                                    event: ChangeEvent<HTMLInputElement>,
                                ) =>
                                    setSubject(
                                        event.target.value,
                                    )
                                }
                            />
                        </div>
                    )}

                    <div className="col-12">
                        <TextArea
                            name="body"
                            labelText="Message"
                            labelClass="required"
                            placeHolder="Write the message to send"
                            height="160px"
                            value={body}
                            onChange={(
                                event: ChangeEvent<HTMLTextAreaElement>,
                            ) => setBody(event.target.value)}
                            maxLength={2000}
                            showRemainingChars
                        />
                    </div>
                </div>

                <div className="tw-mt-2 tw-max-h-32 tw-overflow-y-auto tw-rounded tw-border tw-border-gray-200 tw-bg-gray-50 tw-p-3">
                    <p className="tw-mb-2 tw-text-xs tw-font-semibold tw-uppercase tw-text-gray-500">
                        Recipients
                    </p>
                    <div className="tw-flex tw-flex-wrap tw-gap-1">
                        {recipients.length ? (
                            recipients.map(lead => (
                                <span
                                    key={lead.id}
                                    className="badge badge-soft-primary"
                                >
                                    {lead.studentName} ·{" "}
                                    {channel === "email"
                                        ? lead.email
                                        : lead.phone}
                                </span>
                            ))
                        ) : (
                            <span className="tw-text-sm tw-text-gray-500">
                                No reachable recipients in the
                                selection.
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="tw-flex tw-justify-end tw-gap-2 tw-border-t tw-border-gray-200 tw-p-4">
                <Button
                    type="button"
                    variant="secondary"
                    onClick={toggle}
                >
                    Cancel
                </Button>
                <Button
                    type="button"
                    variant="primary"
                    disabled={
                        !recipients.length ||
                        !body.trim() ||
                        (channel === "email" && !subject.trim())
                    }
                    onClick={() =>
                        onSend({
                            channel,
                            templateId,
                            subject,
                            body,
                            leadIds: recipients.map(
                                lead => lead.id,
                            ),
                        })
                    }
                >
                    <i className="ri-send-plane-fill"></i>
                    Send to {recipients.length} lead
                    {recipients.length === 1 ? "" : "s"}
                </Button>
            </div>
        </div>
    );
};

export default BulkMessageModal;
