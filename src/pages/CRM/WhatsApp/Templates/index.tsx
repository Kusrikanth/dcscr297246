import { useState, type MouseEvent } from "react";

import UpdatedHorizontalTab from "../../../../Components/Common/UpdatedHorizontalTab";
import { ModalContainerUpdated } from "../../../../Components/Common";
import { useModal } from "../../../../hooks/modalhook";

import DashboardTab from "./DashboardTab";
import TemplatesTab from "./TemplatesTab";
import SendMessageModal from "./SendMessageModal";
import MessageHistoryModal from "./MessageHistoryModal";

interface IMenuOptions {
    id: string;
    labelName: string;
    customPadding: string;
}

const MenuOptions: Array<IMenuOptions> = [
    {
        id: "dashboard",
        labelName: "Dashboard",
        customPadding: "0px 10px 0px 10px",
    },
    {
        id: "templates",
        labelName: "Templates",
        customPadding: "0px 10px 0px 10px",
    },
];

const WhatsAppTemplates = () => {
    const [activeId, setActiveId] = useState<string>("dashboard"); 

    const {
        openModal: sendMessageOpenModal,
        closeModal: sendMessageCloseModal,
        modalState: sendMessageModalState,
    } = useModal();
    const {
        openModal: historyOpenModal,
        closeModal: historyCloseModal,
        modalState: historyModalState,
    } = useModal();

    const clickMenuHandler = (event: MouseEvent<HTMLElement>) => {
        const menuId = event.currentTarget.getAttribute("data-id");

        if (menuId) {
            setActiveId(menuId);
        }
    };

    return (
        <div className="">
            <div className="">

                <div className="tw-w-full">
                    <UpdatedHorizontalTab
                        MenuOptions={MenuOptions}
                        clickMenuHandler={clickMenuHandler}
                        activeTabId={activeId}
                        horizontalClass=""
                    />
                </div>

                <div className="tw-mt-3">
                    {activeId === "dashboard" && <DashboardTab />}

                    {activeId === "templates" && (
                        <TemplatesTab
                            onSendMessage={() => sendMessageOpenModal()}
                            onMessageHistory={() => historyOpenModal()}
                        />
                    )}

                </div>

                <ModalContainerUpdated
                    id="crm-whatsapp-send-message"
                    isOpen={sendMessageModalState.showModal}
                    toggle={sendMessageCloseModal}
                    modalTitle="Send WhatsApp Message"
                    modalSize="xl"
                >
                    <SendMessageModal toggle={sendMessageCloseModal} />
                </ModalContainerUpdated>

                <ModalContainerUpdated
                    id="crm-whatsapp-message-history"
                    isOpen={historyModalState.showModal}
                    toggle={historyCloseModal}
                    modalTitle="WhatsApp Message History"
                    modalSize="xl"
                >
                    <MessageHistoryModal />
                </ModalContainerUpdated>
            </div>
        </div>
    );
};

export default WhatsAppTemplates;
