import React, { useState } from "react";
interface IConfirmationModalState {
    showConfirmModal: boolean,
    delItemId: string
}

export default function useConfirmModalHook(props: any): { confirmationState: IConfirmationModalState, delModalCancelHndlr: () => void } {
    const [confirmationState, setConfirmationState] = useState<IConfirmationModalState>({
        showConfirmModal: false,
        delItemId: ""
    });
    function delModalCancelHndlr() {
        setConfirmationState(prevState => ({ ...prevState, showConfirmModal: false, delItemId: "" }));
    }
    return { confirmationState, delModalCancelHndlr };

}