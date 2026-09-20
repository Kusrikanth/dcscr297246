import React, { useMemo, useState, useCallback } from "react";
import { toast } from "react-toastify";

//Common Component
import TableContainer from "../../../../Components/Common/TableContainer";
import { ModalContainerUpdated, TextIconInput } from "../../../../Components/Common";
import { generateColumns, sampleEmailIntegrations, USE_SAMPLE_EMAIL_INTEGRATIONS } from "./helper";

//Modal Component
import UpdateEmailPasswordModal from "./UpdateEmailPasswordModal";

//Interface & Types
import {
    IEmailIntegration,
    IEmailIntegrationModalState,
    IEmailIntegrationProps,
    IUpdateEmailPasswordPayload
} from "./emailintegrationtypes";
import { IOptionsHrtl } from "../../../../Components/Common/MenuOptions";

const EmailIntegration: React.FC<IEmailIntegrationProps> = () => {
    const [emailIntegrations, setEmailIntegrations] = useState<Array<IEmailIntegration>>(
        () => (USE_SAMPLE_EMAIL_INTEGRATIONS ? sampleEmailIntegrations : [])
    );
    const [updatePwdModalState, setUpdatePwdModalState] = useState<IEmailIntegrationModalState>({
        showModal: false,
        emailIntegrationId: undefined,
        modalData: undefined
    });
    const [filterState, setFilterState] = useState({
        searchString: ""
    });

    const toggleUpdatePwdHndlr = useCallback(() => {
        setUpdatePwdModalState((prevState) => ({ ...prevState, showModal: !prevState.showModal }));
    }, []);

    function updatePasswordHndlr(event: any) {
        const emailIntegrationId = +event.currentTarget.getAttribute("data-id"),
            modalData = emailIntegrations.find((item) => item.id === emailIntegrationId);
        if (modalData) {
            setUpdatePwdModalState((prevState) => ({ ...prevState, showModal: true, emailIntegrationId, modalData }));
        }
    }

    const menuOptions = useMemo((): IOptionsHrtl[] => ([{
        id: "update-password",
        actionIcon: <i className="text-primary ri-lock-password-line fs-16"></i>,
        actionName: "Update Password",
        onClickHndlr: updatePasswordHndlr,
    }]), [emailIntegrations]);

    /** No API yet - the update is applied to the in-memory list. */
    function submitUpdatePasswordHndlr(payload: IUpdateEmailPasswordPayload) {
        setEmailIntegrations((prevState) => prevState.map((item) => (
            item.id === payload.id
                ? {
                    ...item,
                    rs: payload.rs,
                    password: payload.password,
                    actualPassword: payload.actualPassword,
                    admissionPassword: payload.admissionPassword,
                }
                : item
        )));
        setUpdatePwdModalState((prevState) => ({ ...prevState, showModal: false }));
        toast.success("Email integration updated successfully.");
    }

    function onChangeFilterHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        setFilterState(prevState => ({ ...prevState, [name]: value }));
    }

    const filteredIntegrations = useMemo(() => {
        const searchString = filterState.searchString.trim().toLowerCase();
        if (!searchString) return emailIntegrations;
        return emailIntegrations.filter((item) => (
            [item.department, item.fromAddress, item.host, item.admissionFromAddress]
                .some((field) => (field || "").toLowerCase().includes(searchString))
        ));
    }, [emailIntegrations, filterState.searchString]);

    const emailIntegrationColumn = useMemo(() => generateColumns(menuOptions), [menuOptions]);

    return (
        <React.Fragment>
            <div className="tw-p-0">
                <div className="tw-py-3 tw-px-3">
                    <form onClick={(e) => e.preventDefault()}>
                        <div className="tw-grid tw-grid-cols-1 xl:tw-grid-cols-12 tw-gap-3 tw-items-end tw-mt-3 tw-mb-2">
                            <div className="xl:tw-col-span-4">
                                <TextIconInput
                                    formgroupClassName="search-box tw-mb-0"
                                    name="searchString"
                                    value={filterState.searchString}
                                    placeHolder="Search"
                                    labelText="Search"
                                    floatingLabel
                                    onChange={onChangeFilterHndlr}
                                >
                                    <i className="ri-search-line search-icon"></i>
                                </TextIconInput>
                            </div>
                        </div>
                    </form>
                </div>

                <div className="tw-overflow-x-auto tw-mb-1">
                    <TableContainer
                        columns={emailIntegrationColumn || []}
                        data={filteredIntegrations}
                        divClass="tw-overflow-x-auto tw-mb-1"
                        tableClass="tw-whitespace-nowrap"
                        theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
                        showPagination={false}
                    />
                </div>
            </div>

            <ModalContainerUpdated
                id="update-email-password-modal"
                isOpen={updatePwdModalState.showModal}
                toggle={toggleUpdatePwdHndlr}
                modalTitle="Update Email Password"
                modalSize="lg"
            >
                <UpdateEmailPasswordModal
                    isOpen={updatePwdModalState.showModal}
                    toggle={toggleUpdatePwdHndlr}
                    editModalData={updatePwdModalState.modalData}
                    onSubmitHndlr={submitUpdatePasswordHndlr}
                />
            </ModalContainerUpdated>
        </React.Fragment>
    )
}

export default EmailIntegration;
