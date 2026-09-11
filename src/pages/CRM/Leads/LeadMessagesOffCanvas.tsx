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
import { type LeadRecord } from "./helper";

const senderOptions = [
    {
        id: "dps",
        name: "Delhi Public School Group",
    },
];

const templateOptions = [
    {
        id: "transport-reminder",
        name: "Transport reminder",
    },
    {
        id: "admission-followup",
        name: "Admission follow-up",
    },
];

const messageThread = [
    {
        id: "1",
        body:
            "*Seats are filling fast!* What are you waiting for? Register now with the below link and give your child the advantage of a powerful academic foundation - Regards",
        sentAt: "11/08/26, 12:57 pm",
        status: "FAILED",
    },
    {
        id: "2",
        body:
            "Dear Parent, Greetings from DPS Nacharam! This is a gentle reminder that the school transport fee, due on 15 July, is still pending. Transport Admit Cards are being issued only to students whose transport fees have been paid. Kindly clear the outstanding amount on or before 5th August to ensure uninterrupted transport service for your ward. Transport services may be withheld until the dues are cleared. Regards,",
        sentAt: "11/08/26, 1:00 pm",
        status: "DELIVERED",
    },
    {
        id: "3",
        body:
            "Dear Parents, Greetings from DPS Nacharam! Our first batch for IIT JEE & NEET with a well-structured integrated programme in collaboration with Aakash, the curriculum is aptly designed for both board exams and competitive success. Our program offers: * Expert faculty for Engineering and Medical entrances preparation * Guidance aligned in sync with CBSE curriculum * Regular tests, doubt-clearing sessions, and performance tracking * A safe, focused and supportive learning environment Are you still looking for the best path of your child's Grade XI admissions for IIT-JEE / NEET preparation? We invite you to attend a Virtual Orientation Session by the Aakash team tomorrow to understand our approach, curriculum and support system. * Date:- 5th April (Sunday) * Time:- 10am Link to join IIT JEE programme orientation:- https://meet.google.com/sza-spzr-dkx",
        sentAt: "11/08/26, 1:04 pm",
        status: "DELIVERED",
        hasMediaPreview: true,
    },
];

interface LeadMessagesOffCanvasProps {
    data?: LeadRecord;
    toggle: () => void;
}

const LeadMessagesOffCanvas = ({
    data,
    toggle,
}: LeadMessagesOffCanvasProps) => {
    const [replyMessage, setReplyMessage] =
        useState<string>("");
    const [senderId, setSenderId] =
        useState<string>("dps");
    const [templateId, setTemplateId] =
        useState<string>("");
    const [attachmentFile, setAttachmentFile] =
        useState<File | undefined>();

    const replyChangeHandler = (
        event: ChangeEvent<HTMLInputElement>,
    ) => {
        setReplyMessage(event.target.value);
    };

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

    const attachmentChangeHandler = (
        event: ChangeEvent<HTMLInputElement>,
    ) => {
        setAttachmentFile(event.target.files?.[0]);
    };

    return (
        <div className="tw-flex tw-h-full tw-flex-col tw-bg-white">
            <div className="tw-flex tw-items-center tw-justify-between tw-border-b tw-border-gray-200 tw-bg-white tw-px-4 tw-py-3">
                <div className="tw-flex tw-min-w-0 tw-items-center tw-gap-3">
                    <div className="tw-min-w-0">
                        <h4 className="tw-card-title">
                            {data?.studentName || "Lead"}
                        </h4>
                        <p className="tw-mb-0 tw-truncate tw-text-sm tw-text-gray-500">
                            Primary: {data?.phone || "-"}
                        </p>
                    </div>
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
                            className="tw-ml-auto tw-w-[82%] tw-rounded-lg tw-border tw-border-[#a6dec0] tw-bg-[#dcffd7] tw-p-3 tw-shadow-sm"
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
                                {message.sentAt} ·{" "}
                                {message.status}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="tw-border-t tw-border-gray-200 tw-bg-white tw-p-4">
                <TextArea
                    name="replyMessage"
                    value={replyMessage}
                    onChange={replyChangeHandler}
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
                    onChangeFileHndlr={attachmentChangeHandler}
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
                        className=""
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
