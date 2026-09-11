import {
    useState,
    type ChangeEvent,
} from "react";

import {
    BrowseFile,
    Button,
    SelectInput,
    TextArea,
} from "../../../Components/Common";
import type { LeadRecord } from "./types";

const senderOptions = [
    { id: "dps", name: "Delhi Public School Group" },
];

const templateOptions = [
    { id: "transport-reminder", name: "Transport reminder" },
    { id: "admission-followup", name: "Admission follow-up" },
    { id: "campus-visit", name: "Campus visit invite" },
];

const messageThread = [
    {
        id: "1",
        direction: "out",
        body:
            "*Seats are filling fast!* Register now with the link below and give your child the advantage of a powerful academic foundation. — Regards, DPS Admissions",
        sentAt: "11/08/26, 12:57 pm",
        status: "FAILED",
    },
    {
        id: "2",
        direction: "out",
        body:
            "Dear Parent, greetings from DPS! This is a gentle reminder that the school transport fee is still pending. Kindly clear the outstanding amount to ensure uninterrupted transport service for your ward. Regards,",
        sentAt: "11/08/26, 1:00 pm",
        status: "DELIVERED",
    },
    {
        id: "3",
        direction: "in",
        body: "Thank you. Can we visit the campus this weekend?",
        sentAt: "11/08/26, 1:02 pm",
        status: "RECEIVED",
    },
    {
        id: "4",
        direction: "out",
        body:
            "Certainly! Campus visits run between 10 am and 4 pm on Saturday and Sunday. Shall I block a slot for Saturday 11 am?",
        sentAt: "11/08/26, 1:04 pm",
        status: "READ",
        hasMediaPreview: true,
    },
];

interface LeadMessagesOffCanvasProps {
    lead?: LeadRecord;
    toggle: () => void;
    onSend?: (message: string) => void;
}

const LeadMessagesOffCanvas = ({
    lead,
    toggle,
    onSend,
}: LeadMessagesOffCanvasProps) => {
    const [replyMessage, setReplyMessage] =
        useState<string>("");
    const [senderId, setSenderId] = useState<string>("dps");
    const [templateId, setTemplateId] = useState<string>("");
    const [attachmentFile, setAttachmentFile] = useState<
        File | undefined
    >();

    const selectChangeHandler = (
        event: ChangeEvent<HTMLSelectElement>,
    ) => {
        const { name, value } = event.target;

        if (name === "senderId") {
            setSenderId(value);
        }

        if (name === "templateId") {
            setTemplateId(value);
        }
    };

    const sendHandler = () => {
        if (!replyMessage.trim()) {
            return;
        }

        onSend?.(replyMessage.trim());
        setReplyMessage("");
    };

    return (
        <div className="tw-flex tw-h-full tw-flex-col tw-bg-white">
            <div className="tw-flex tw-items-center tw-justify-between tw-border-b tw-border-gray-200 tw-bg-white tw-px-4 tw-py-3">
                <div className="tw-min-w-0">
                    <h4 className="tw-card-title">
                        {lead?.studentName || "Lead"}
                    </h4>
                    <p className="tw-mb-0 tw-truncate tw-text-sm tw-text-gray-500">
                        Primary: {lead?.phone || "-"}
                    </p>
                </div>

                <div className="tw-flex tw-items-center tw-gap-3">
                    <Button
                        type="button"
                        variant="soft"
                        title="Refresh messages"
                        aria-label="Refresh messages"
                        className="!tw-h-8 !tw-w-8 !tw-rounded-full !tw-p-0"
                    >
                        <i className="ri-refresh-line tw-text-xl"></i>
                    </Button>
                    <Button
                        type="button"
                        variant="soft"
                        title="Close messages"
                        aria-label="Close messages"
                        onClick={toggle}
                        className="!tw-h-8 !tw-w-8 !tw-rounded-full !tw-p-0"
                    >
                        <i className="ri-close-line tw-text-2xl"></i>
                    </Button>
                </div>
            </div>

            <div className="tw-flex-1 tw-overflow-y-auto tw-bg-[#eef3f0] tw-px-4 tw-py-4">
                <div className="tw-flex tw-flex-col tw-gap-4">
                    {messageThread.map(message => (
                        <div
                            key={message.id}
                            className={`tw-w-[82%] tw-rounded-lg tw-border tw-p-3 tw-shadow-sm ${message.direction === "out"
                                ? "tw-ml-auto tw-border-[#a6dec0] tw-bg-[#dcffd7]"
                                : "tw-me-auto tw-border-gray-200 tw-bg-white"
                                }`}
                        >
                            {message.hasMediaPreview && (
                                <div className="tw-mb-2 tw-rounded-lg tw-bg-gray-200 tw-p-2 tw-text-sm tw-leading-5 tw-text-gray-700">
                                    <div className="tw-mb-1 tw-h-6 tw-w-8 tw-rounded tw-bg-white"></div>
                                    Media preview
                                </div>
                            )}
                            <p className="tw-mb-2 tw-whitespace-pre-wrap tw-text-base tw-leading-7 tw-text-gray-900">
                                {message.body}
                            </p>
                            <p className="tw-mb-0 tw-text-right tw-text-xs tw-font-medium tw-text-gray-500">
                                {message.sentAt} · {message.status}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="tw-border-t tw-border-gray-200 tw-bg-white tw-p-4">
                <TextArea
                    name="replyMessage"
                    value={replyMessage}
                    onChange={(
                        event: ChangeEvent<HTMLTextAreaElement>,
                    ) => setReplyMessage(event.target.value)}
                    placeHolder="Type a reply"
                    formgroupClassName="tw-mb-3"
                    height="92px"
                    maxLength={1000}
                />

                <BrowseFile
                    name="messageAttachment"
                    labelText="Attachment"
                    fileName={attachmentFile?.name}
                    uploadedFile={attachmentFile}
                    onChangeFileHndlr={(
                        event: ChangeEvent<HTMLInputElement>,
                    ) => setAttachmentFile(event.target.files?.[0])}
                    containerClassName="tw-mb-3"
                    hideLabel
                />

                <div className="tw-grid tw-grid-cols-2 tw-gap-3">
                    <SelectInput
                        name="senderId"
                        value={senderId}
                        onChange={selectChangeHandler}
                        menuItems={senderOptions}
                        valueKey="id"
                        textKey="name"
                        hideSelectOption
                        formgroupClassName="tw-mb-0"
                        inputClassName="tw-h-12 tw-rounded-full tw-border-gray-200 tw-bg-[#f8fbfa] tw-px-4"
                    />
                    <SelectInput
                        name="templateId"
                        value={templateId}
                        onChange={selectChangeHandler}
                        menuItems={templateOptions}
                        valueKey="id"
                        textKey="name"
                        defaultSelect="Select template"
                        formgroupClassName="tw-mb-0"
                        inputClassName="tw-h-12 tw-rounded-full tw-border-gray-200 tw-bg-[#f8fbfa] tw-px-4"
                    />
                </div>

                <div className="tw-mt-4 tw-flex tw-justify-end">
                    <Button
                        type="button"
                        variant="primary"
                        disabled={!replyMessage.trim()}
                        onClick={sendHandler}
                    >
                        <i className="ri-send-plane-fill"></i>
                        Send
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default LeadMessagesOffCanvas;
