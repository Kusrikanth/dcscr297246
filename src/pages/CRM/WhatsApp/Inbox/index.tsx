import {
    useEffect,
    useMemo,
    useRef,
    useState,
    type ChangeEvent,
    type FormEvent,
} from "react";
import { useHistory } from "react-router-dom";

import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import NoDataComp from "../../../../Components/Common/NoDataComp";
import {
    Button,
    OffCanvasContainer,
    SelectInput,
    TextIconInput,
} from "../../../../Components/Common";
import { useModal } from "../../../../hooks/modalhook";
import LeadProfileOffCanvas from "./LeadProfileOffCanvas";
import {
    cleanPhone,
    formatDateTime,
    formatTime,
    getInitial,
    whatsAppAccounts,
    whatsAppConversations,
    whatsAppMessages,
    type WhatsAppConversation,
    type WhatsAppMessage,
} from "../helper";

const WhatsAppInbox = () => {
    const history = useHistory();

    const [conversations, setConversations] = useState<
        Array<WhatsAppConversation>
    >(whatsAppConversations);
    const [messages, setMessages] =
        useState<Array<WhatsAppMessage>>(whatsAppMessages);
    const [selectedId, setSelectedId] = useState<string>(
        whatsAppConversations[0]?.id || "",
    );
    const [searchString, setSearchString] = useState<string>("");
    const [accountId, setAccountId] = useState<string>("");
    const [reply, setReply] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSending, setIsSending] = useState<boolean>(false);

    const threadRef = useRef<HTMLDivElement>(null);
    const pinnedToLatestRef = useRef<boolean>(true);

    const {
        openModal: profileOpenCanvas,
        closeModal: profileCloseCanvas,
        modalState: profileCanvasState,
    } = useModal();

    const selectedConversation = useMemo(
        () => conversations.find(item => item.id === selectedId),
        [conversations, selectedId],
    );

    const conversationMessages = useMemo(
        () =>
            messages
                .filter(item => item.conversationId === selectedId)
                .sort(
                    (first, second) =>
                        new Date(first.createdAt).getTime() -
                        new Date(second.createdAt).getTime(),
                ),
        [messages, selectedId],
    );

    const unreadTotal = useMemo(
        () =>
            conversations.reduce(
                (total, item) => total + Number(item.unreadCount || 0),
                0,
            ),
        [conversations],
    );

    useEffect(() => {
        if (!selectedId) {
            return;
        }

        pinnedToLatestRef.current = true;

        setConversations(currentList =>
            currentList.map(item =>
                item.id === selectedId ? { ...item, unreadCount: 0 } : item,
            ),
        );
    }, [selectedId]);

    useEffect(() => {
        const pane = threadRef.current;

        if (!pane || !conversationMessages.length) {
            return;
        }

        if (pinnedToLatestRef.current) {
            pane.scrollTop = pane.scrollHeight;
        }
    }, [conversationMessages]);

    const trackScrollPosition = () => {
        const pane = threadRef.current;

        if (!pane) {
            return;
        }

        pinnedToLatestRef.current =
            pane.scrollHeight - pane.scrollTop - pane.clientHeight <= 24;
    };

    const searchChangeHandler = (
        event: ChangeEvent<HTMLInputElement>,
    ) => {
        setSearchString(event.target.value);
    };

    const accountChangeHandler = (
        event: ChangeEvent<HTMLSelectElement>,
    ) => {
        setAccountId(event.target.value);
    };

    const refreshHandler = () => {
        setIsLoading(true);

        window.setTimeout(() => {
            setConversations(whatsAppConversations);
            setMessages(whatsAppMessages);
            setIsLoading(false);
        }, 400);
    };

    const sendReplyHandler = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!reply.trim() || !selectedConversation) {
            return;
        }

        setIsSending(true);

        const sentAt = new Date().toISOString();
        const newMessage: WhatsAppMessage = {
            id: `m-${Date.now()}`,
            conversationId: selectedConversation.id,
            direction: "outgoing",
            message: reply.trim(),
            type: "TEXT",
            status: "SENT",
            createdAt: sentAt,
        };

        setMessages(currentList => [...currentList, newMessage]);
        setConversations(currentList =>
            currentList.map(item =>
                item.id === selectedConversation.id
                    ? {
                        ...item,
                        lastMessage: newMessage.message,
                        lastMessageTime: sentAt,
                        unreadCount: 0,
                    }
                    : item,
            ),
        );

        setReply("");
        pinnedToLatestRef.current = true;
        setIsSending(false);
    };

    const openLeadHandler = (leadId: string) => {
        profileCloseCanvas();
        history.push(`/crm-leads?openLead=${leadId}`);
    };

    return (
        <div className="page-content">
            <div className="container-fluid">
                <BreadCrumb pageTitle="CRM" />

                <div className="tw-card">
                    <div className="tw-card-header">
                        <div className="tw-flex tw-flex-wrap tw-items-center tw-justify-between tw-gap-3">
                            <div className="tw-flex tw-flex-wrap tw-items-center tw-gap-3">
                                <div className="tw-w-full md:tw-w-80">
                                    <TextIconInput
                                        formgroupClassName="search-box tw-mb-0"
                                        name="searchString"
                                        labelText="Search"
                                        value={searchString}
                                        onChange={searchChangeHandler}
                                        placeHolder="Search name, number or message"
                                        floatingLabel
                                    >
                                        <i className="ri-search-line search-icon"></i>
                                    </TextIconInput>
                                </div>

                                <div className="tw-w-full md:tw-w-64">
                                    <SelectInput
                                        name="accountId"
                                        labelText="WhatsApp Account"
                                        defaultSelect="All WhatsApp accounts"
                                        value={accountId}
                                        onChange={accountChangeHandler}
                                        menuItems={whatsAppAccounts}
                                        valueKey="id"
                                        textKey="name"
                                        formgroupClassName="tw-mb-0"
                                        floatingLabel
                                    />
                                </div>
                            </div>

                            <div className="tw-flex tw-items-center tw-gap-2">
                                <span className="badge badge-soft-success tw-flex tw-items-center tw-gap-1 tw-p-2">
                                    <i className="ri-whatsapp-line"></i>
                                    {unreadTotal} unread
                                </span>

                                <Button
                                    type="button"
                                    variant="hoverInfo"
                                    onClick={refreshHandler}
                                    disabled={isLoading}
                                >
                                    <i className="ri-refresh-line tw-me-1"></i>
                                    {isLoading ? "Refreshing…" : "Refresh"}
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="tw-card-body !tw-p-0">
                        <div className="tw-flex tw-flex-col lg:tw-flex-row">
                            <aside
                                className="tw-w-full tw-border-b tw-border-gray-200 lg:tw-w-80 lg:tw-border-b-0 lg:tw-border-e"
                                style={{ minWidth: "280px" }}
                            >
                                <div className="tw-flex tw-items-center tw-justify-between tw-border-b tw-border-gray-200 tw-px-3 tw-py-2">
                                    <span className="tw-text-sm tw-font-semibold tw-text-gray-800">
                                        Conversations
                                    </span>
                                    <span className="badge badge-soft-secondary">
                                        {conversations.length}
                                    </span>
                                </div>

                                <div
                                    className="tw-overflow-y-auto"
                                    style={{ height: "560px" }}
                                >
                                    {conversations.map(item => (
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            key={item.id}
                                            onClick={() => setSelectedId(item.id)}
                                            className={`tw-w-full !tw-items-start !tw-justify-start !tw-rounded-none !tw-shadow-none tw-border-b tw-border-gray-100 !tw-p-3 tw-text-start hover:!tw-bg-gray-50 ${item.id === selectedId
                                                ? "!tw-bg-gray-100"
                                                : "!tw-bg-white"
                                                }`}
                                        >
                                            <span className="tw-flex tw-h-9 tw-w-9 tw-flex-shrink-0 tw-items-center tw-justify-center tw-rounded-full tw-bg-[#034932] tw-text-sm tw-font-semibold tw-text-white">
                                                {getInitial(
                                                    item.contactName,
                                                    item.studentName,
                                                    item.mobile,
                                                )}
                                            </span>

                                            <span className="tw-min-w-0 tw-flex-1">
                                                <span
                                                    className={`tw-block tw-truncate tw-text-sm ${item.unreadCount
                                                        ? "tw-font-semibold tw-text-gray-900"
                                                        : "tw-font-medium tw-text-gray-800"
                                                        }`}
                                                >
                                                    {item.contactName ||
                                                        item.studentName ||
                                                        item.mobile}
                                                </span>
                                                <span className="tw-block tw-truncate tw-text-xs tw-text-gray-500">
                                                    {item.lastMessage ||
                                                        "No messages"}
                                                </span>
                                                <span className="tw-block tw-truncate tw-text-[11px] tw-text-gray-400">
                                                    {item.integrationName}
                                                </span>
                                            </span>

                                            <span className="tw-flex tw-flex-shrink-0 tw-flex-col tw-items-end tw-gap-1">
                                                <span className="tw-whitespace-nowrap tw-text-[11px] tw-text-gray-400">
                                                    {formatTime(
                                                        item.lastMessageTime,
                                                    )}
                                                </span>
                                                {item.unreadCount > 0 && (
                                                    <span className="tw-flex tw-h-5 tw-min-w-5 tw-items-center tw-justify-center tw-rounded-full tw-bg-[#034932] tw-px-1 tw-text-[10px] tw-font-semibold tw-text-white">
                                                        {item.unreadCount > 99
                                                            ? "99+"
                                                            : item.unreadCount}
                                                    </span>
                                                )}
                                            </span>
                                        </Button>
                                    ))}

                                    {!conversations.length && (
                                        <NoDataComp
                                            title={
                                                isLoading
                                                    ? "Loading conversations…"
                                                    : "No conversations found"
                                            }
                                            helperText={
                                                isLoading
                                                    ? ""
                                                    : "Try a different search term or WhatsApp account."
                                            }
                                        />
                                    )}
                                </div>
                            </aside>

                            <section className="tw-flex tw-min-w-0 tw-flex-1 tw-flex-col">
                                {selectedConversation ? (
                                    <>
                                        <header className="tw-flex tw-items-center tw-justify-between tw-gap-2 tw-border-b tw-border-gray-200 tw-p-3">
                                            <div className="tw-flex tw-min-w-0 tw-items-center tw-gap-2">
                                                <span className="tw-flex tw-h-9 tw-w-9 tw-flex-shrink-0 tw-items-center tw-justify-center tw-rounded-full tw-bg-[#034932] tw-text-sm tw-font-semibold tw-text-white">
                                                    {getInitial(
                                                        selectedConversation.contactName,
                                                        selectedConversation.studentName,
                                                        selectedConversation.mobile,
                                                    )}
                                                </span>
                                                <div className="tw-min-w-0">
                                                    <p className="tw-mb-0 tw-truncate tw-text-sm tw-font-semibold tw-text-gray-800">
                                                        {selectedConversation.contactName ||
                                                            selectedConversation.studentName ||
                                                            selectedConversation.mobile}
                                                    </p>
                                                    <p className="tw-mb-0 tw-truncate tw-text-xs tw-text-gray-500">
                                                        +91{" "}
                                                        {cleanPhone(
                                                            selectedConversation.mobile,
                                                        )}{" "}
                                                        ·{" "}
                                                        {
                                                            selectedConversation.integrationName
                                                        }
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="tw-flex tw-flex-shrink-0 tw-items-center tw-gap-2">
                                                <span className="badge badge-soft-success tw-flex tw-items-center tw-gap-1">
                                                    <i className="ri-check-double-line"></i>
                                                    Synced
                                                </span>
                                                <Button
                                                    type="button"
                                                    variant="secondary"
                                                    className="!tw-h-8 !tw-w-8 !tw-p-0 tw-border tw-border-gray-200 !tw-bg-white hover:!tw-bg-gray-50"
                                                    title="View lead details"
                                                    aria-label="View lead details"
                                                    onClick={() =>
                                                        profileOpenCanvas(
                                                            selectedConversation,
                                                        )
                                                    }
                                                >
                                                    <i className="ri-user-3-line"></i>
                                                </Button>
                                            </div>
                                        </header>

                                        <div
                                            ref={threadRef}
                                            onScroll={trackScrollPosition}
                                            className="tw-flex-1 tw-space-y-2 tw-overflow-y-auto tw-p-3"
                                            style={{
                                                height: "440px",
                                                backgroundColor: "#ece5dd",
                                            }}
                                        >
                                            {conversationMessages.map(item => (
                                                <div
                                                    key={item.id}
                                                    className={`tw-flex ${item.direction === "outgoing"
                                                        ? "tw-justify-end"
                                                        : "tw-justify-start"
                                                        }`}
                                                >
                                                    <div
                                                        className={`tw-max-w-[75%] tw-rounded tw-p-2 tw-shadow-sm ${item.direction === "outgoing"
                                                            ? "tw-rounded-tr-none tw-bg-[#dcf8c6]"
                                                            : "tw-rounded-tl-none tw-bg-white"
                                                            }`}
                                                    >
                                                        {item.mediaUrl && (
                                                            <a
                                                                href={item.mediaUrl}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="tw-mb-1 tw-flex tw-items-center tw-gap-1 tw-text-xs tw-text-blue-600"
                                                            >
                                                                <i className="ri-attachment-2"></i>
                                                                View attachment
                                                            </a>
                                                        )}

                                                        <p className="tw-mb-0 tw-whitespace-pre-wrap tw-break-words tw-text-[13px] tw-text-gray-800">
                                                            {item.message ||
                                                                item.caption ||
                                                                `[${item.type}]`}
                                                        </p>

                                                        <p className="tw-mb-0 tw-mt-1 tw-text-end tw-text-[10px] tw-text-gray-500">
                                                            {formatDateTime(
                                                                item.createdAt,
                                                            )}
                                                            {item.direction ===
                                                                "outgoing" &&
                                                                ` · ${item.status}`}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}

                                            {!conversationMessages.length && (
                                                <div className="tw-flex tw-h-full tw-items-center tw-justify-center">
                                                    <p className="tw-mb-0 tw-text-sm tw-text-gray-500">
                                                        No messages in this
                                                        conversation
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        <form
                                            onSubmit={sendReplyHandler}
                                            className="tw-flex tw-items-end tw-gap-2 tw-border-t tw-border-gray-200 tw-p-3"
                                        >
                                            <textarea
                                                className="form-control"
                                                rows={2}
                                                value={reply}
                                                onChange={event =>
                                                    setReply(event.target.value)
                                                }
                                                placeholder="Type a reply to this contact…"
                                            />
                                            <Button
                                                type="submit"
                                                variant="primary" className="tw-flex-shrink-0"
                                                disabled={
                                                    isSending || !reply.trim()
                                                }
                                            >
                                                <i className="ri-send-plane-fill tw-me-1"></i>
                                                {isSending ? "Sending…" : "Send"}
                                            </Button>
                                        </form>
                                    </>
                                ) : (
                                    <div className="tw-flex tw-flex-1 tw-items-center tw-justify-center tw-p-5">
                                        <NoDataComp
                                            title="Select a conversation"
                                            helperText="Incoming and outgoing messages will appear here."
                                        />
                                    </div>
                                )}
                            </section>
                        </div>
                    </div>
                </div>

                <OffCanvasContainer
                    id="crm-whatsapp-lead-profile"
                    isOpen={profileCanvasState.showModal}
                    closeHndlr={profileCloseCanvas}
                    headerTitle=""
                    width={420}
                    customClass="[&_.offcanvas-header]:tw-hidden"
                >
                    <LeadProfileOffCanvas
                        conversation={profileCanvasState.modalData}
                        toggle={profileCloseCanvas}
                        onOpenLead={openLeadHandler}
                    />
                </OffCanvasContainer>
            </div>
        </div>
    );
};

export default WhatsAppInbox;
