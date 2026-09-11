import { useState } from "react";

interface IModalState {
    showModal: boolean;
    modalData: any;
}

export function useModal() {
    const [modalState, setModalState] = useState<IModalState>({
        showModal: false,
        modalData: undefined
    });

    function closeModal() {
        setModalState(prevState => ({
            ...prevState, showModal: false
        }))
    }

    function openModal(modalData?: any) {
        setModalState(prevState => ({
            ...prevState, showModal: true, modalData
        }))
    }

    return { modalState, setModalState, openModal, closeModal }
}