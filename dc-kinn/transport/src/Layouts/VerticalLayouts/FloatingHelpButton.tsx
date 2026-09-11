import { HugeiconsIcon } from "@hugeicons/react";
import { ModalContainerUpdated } from "../../Components/Common";
import HelpDeskConcernFloatingModal from "./HelpDeskConcernFloatingModal";
import { MessageQuestionIcon } from "@hugeicons-pro/core-stroke-standard";
import { useEffect, useRef, useState } from "react";
import { useModal } from "../../hooks/modalhook";

function FloatingHelpButton() {
    const [showTooltip, setShowTooltip] = useState(false);
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    const {
        openModal: openHelpDeskConcernFloatingModal,
        closeModal: closeHelpDeskConcernFloatingModal,
        modalState: helpDeskConcernFloatingModalState
    } = useModal();

    const handleButtonClick = (e) => {
        e.stopPropagation();
        openHelpDeskConcernFloatingModal("help-desk-concern-modal");
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (helpDeskConcernFloatingModalState.showModal) return;

            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target)
            ) {
                setShowTooltip(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [helpDeskConcernFloatingModalState.showModal]);

    return (
        <>
            <div
                ref={dropdownRef}
                className="floating-help"
            >
                <button
                    onClick={handleButtonClick}
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                    className="tw-flex tw-items-center floating-help-btn"
                >
                    <span className='floating-help-icon tw-flex tw-items-center tw-justify-center'>
                        <HugeiconsIcon
                            icon={MessageQuestionIcon}
                            size={24}
                            className="tw-text-white"
                        />
                    </span>
                    <span className='tw-text-white tw-text-sm helper-text tw-ms-2'>Need Help ?</span>
                </button>
                {showTooltip && (
                    <>
                        <div className="tw-absolute tw-bottom-16 tw-left-0 tw-w-64 tw-bg-white tw-rounded-xl tw-border tw-shadow-lg tw-z-[99999]">
                            <div className="tw-flex tw-gap-3 tw-w-full tw-p-4 tw-rounded-xl tw-text-left">
                                <div>
                                    <div className="tw-font-semibold tw-text-gray-800">
                                        Need Help ?
                                    </div>
                                    <div className="tw-text-xs tw-text-gray-500">
                                        Digital Campus Helpline, Raise a ticket for Technical team
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="tw-absolute tw-bottom-[3.75rem] tw-left-[18px] tw-z-40">
                            <div className="tw-w-3.5 tw-h-3.5 tw-bg-white tw-rotate-45 tw-border tw-border-gray-200" />
                        </div>
                    </>
                )}
            </div>
            <ModalContainerUpdated
                id="help-desk-concern-modal"
                isOpen={helpDeskConcernFloatingModalState.showModal}
                toggle={closeHelpDeskConcernFloatingModal}
                modalTitle="Create New Enquiry - Digital Campus"
                modalSize="xl"
            >
                <HelpDeskConcernFloatingModal
                    toggle={closeHelpDeskConcernFloatingModal}
                    id={helpDeskConcernFloatingModalState.modalData}
                />
            </ModalContainerUpdated>
        </>
    );
}

export default FloatingHelpButton;