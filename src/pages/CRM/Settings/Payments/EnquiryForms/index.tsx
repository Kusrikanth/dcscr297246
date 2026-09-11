import { useMemo, useState, type MouseEvent } from "react";

import {
    Button,
    ConfirmationModal,
    MenuOptionHrtl,
    ModalContainerUpdated,
    SelectInput,
    StatusLabel,
} from "../../../../../Components/Common";
import type { IOptionsHrtl } from "../../../../../Components/Common/MenuOptions";
import { useModal } from "../../../../../hooks/modalhook";
import {
    copyToClipboard,
    settingsBusinessUnits,
} from "../../helper";
import { configForUnit } from "../../businessunitconfig";
import AddEditEnquiryFormModal from "./AddEditEnquiryFormModal";
import {
    enquiryForms as sampleForms,
    enquiryIframeCode,
    publicEnquiryUrl,
    type EnquiryForm,
} from "./helper";
import { toast } from "react-toastify";

const EnquiryForms = () => {
    const [businessUnitId, setBusinessUnitId] = useState<string>(
        settingsBusinessUnits[0]?.id || "",
    );
    const [forms, setForms] = useState<Array<EnquiryForm>>(sampleForms);

    const { openModal, closeModal, modalState } = useModal();
    const {
        openModal: deleteOpenModal,
        closeModal: deleteCloseModal,
        modalState: deleteModalState,
    } = useModal();

    const findForm = (formId: string | null) =>
        forms.find(form => form.id === formId);

    const actionsList: Array<IOptionsHrtl> = [
        {
            id: "copyLink",
            actionIcon: <i className="ri-file-copy-line tw-text-gray-500"></i>,
            actionName: "Copy Public Link",
            onClickHndlr: (event: MouseEvent<HTMLElement>) => {
                const form = findForm(event.currentTarget.getAttribute("data-id"));

                if (form) {
                    copyToClipboard(
                        publicEnquiryUrl(form.formKey),
                        "Public link copied",
                    );
                }
            },
        },
        {
            id: "copyEmbed",
            actionIcon: <i className="ri-code-s-slash-line tw-text-gray-500"></i>,
            actionName: "Copy Embed Code",
            onClickHndlr: (event: MouseEvent<HTMLElement>) => {
                const form = findForm(event.currentTarget.getAttribute("data-id"));

                if (form) {
                    copyToClipboard(
                        enquiryIframeCode(form.formKey),
                        "Embed code copied",
                    );
                }
            },
        },
        {
            id: "edit",
            actionIcon: <i className="ri-pencil-line tw-text-gray-500"></i>,
            actionName: "Edit Enquiry Form",
            onClickHndlr: (event: MouseEvent<HTMLElement>) => {
                const form = findForm(event.currentTarget.getAttribute("data-id"));

                if (form) {
                    openModal(form);
                }
            },
        },
        {
            id: "delete",
            actionIcon: <i className="ri-delete-bin-line tw-text-danger"></i>,
            actionName: "Delete Enquiry Form",
            onClickHndlr: (event: MouseEvent<HTMLElement>) => {
                const form = findForm(event.currentTarget.getAttribute("data-id"));

                if (form) {
                    deleteOpenModal(form);
                }
            },
        },
    ];

    const unit = useMemo(
        () => settingsBusinessUnits.find(item => item.id === businessUnitId),
        [businessUnitId],
    );

    const config = useMemo(
        () => configForUnit(businessUnitId),
        [businessUnitId],
    );

    const visibleForms = useMemo(
        () => forms.filter(form => form.businessUnitId === businessUnitId),
        [businessUnitId, forms],
    );

    const saveHandler = (form: EnquiryForm, isNew: boolean) => {
        setForms(current =>
            isNew
                ? [form, ...current]
                : current.map(item => (item.id === form.id ? form : item)),
        );
        toast.success(isNew ? "Enquiry form added" : "Enquiry form saved");
    };

    const deleteHandler = () => {
        const form: EnquiryForm | undefined = deleteModalState.modalData;

        if (!form) {
            return;
        }

        setForms(current => current.filter(item => item.id !== form.id));
        deleteCloseModal();
        toast.success(`"${form.displayName}" deleted`);
    };

    return (
        <>
            <div className="tw-card tw-mb-4">
                <div className="tw-card-body">
                    <div className="row tw-items-end tw-gap-y-3">
                        <div className="col-12 col-md-6 col-xl-4">
                            <SelectInput
                                name="businessUnitId"
                                labelText="Business Unit"
                                hideSelectOption
                                value={businessUnitId}
                                onChange={(
                                    event: React.ChangeEvent<HTMLSelectElement>,
                                ) => setBusinessUnitId(event.target.value)}
                                menuItems={settingsBusinessUnits}
                                valueKey="id"
                                textKey="name"
                                formgroupClassName="tw-mb-0"
                            />
                        </div>

                        <div className="col-12 col-md-6 col-xl-8">
                            <div className="tw-flex tw-flex-wrap tw-items-center tw-justify-end tw-gap-2">
                                <span className="tw-text-sm tw-text-gray-500">
                                    {visibleForms.length} form
                                    {visibleForms.length === 1 ? "" : "s"} for{" "}
                                    {unit?.name}
                                </span>

                                <Button
                                    type="button"
                                    variant="primary"
                                    disabled={!config.pipelineStages.length}
                                    title={
                                        config.pipelineStages.length
                                            ? ""
                                            : "Configure this unit's pipeline first"
                                    }
                                    onClick={() => openModal()}
                                >
                                    <i className="ri-add-line tw-me-1"></i>
                                    Add Enquiry Form
                                </Button>
                            </div>
                        </div>
                    </div>

                    <p className="tw-mb-0 tw-mt-2 tw-text-xs tw-text-gray-500">
                        Copy the link or the iframe code and place it on your website.
                    </p>
                </div>
            </div>

            {visibleForms.length === 0 ? (
                <div className="tw-card">
                    <div className="tw-card-body">
                        <div className="tw-py-6 tw-text-center">
                            <i className="ri-external-link-line tw-text-3xl tw-text-gray-300"></i>
                            <p className="tw-mb-0 tw-mt-2 tw-text-sm tw-font-medium tw-text-gray-700">
                                No enquiry forms yet
                            </p>
                            <p className="tw-mb-0 tw-text-xs tw-text-gray-500">
                                Add a form, choose the fields, then copy the embed code
                                to your website.
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="row tw-gap-y-3">
                    {visibleForms.map(form => (
                        <div key={form.id} className="col-12 col-xl-6">
                            <div className="tw-card tw-h-full">
                                <div className="tw-card-body">
                                    <div className="tw-flex tw-items-start tw-gap-3">
                                        <span className="tw-grid tw-h-10 tw-w-10 tw-flex-shrink-0 tw-place-items-center tw-rounded-full tw-bg-[#eef1f7] tw-text-[#405189]">
                                            <i className="ri-external-link-line"></i>
                                        </span>

                                        <div className="tw-min-w-0 tw-flex-1">
                                            <p className="tw-mb-0 tw-text-sm tw-font-medium tw-text-gray-800">
                                                {form.displayName}
                                            </p>
                                            <p className="tw-mb-0 tw-font-mono tw-text-xs tw-text-gray-500">
                                                {form.formKey} · {form.fields.length}{" "}
                                                field{form.fields.length === 1 ? "" : "s"}
                                            </p>
                                        </div>

                                        <StatusLabel
                                            type={form.isActive ? "active" : "inactive"}
                                            labelName={
                                                form.isActive ? "Active" : "Inactive"
                                            }
                                        />
                                    </div>

                                    <div className="tw-mt-3 tw-flex tw-flex-wrap tw-gap-1">
                                        <span className="badge badge-soft-secondary">
                                            {form.defaultBranchId
                                                ? "Branch mapped"
                                                : "No branch"}
                                        </span>
                                        <span className="badge badge-soft-secondary">
                                            {form.defaultStageId
                                                ? "Stage mapped"
                                                : "No stage"}
                                        </span>
                                        <span className="badge badge-soft-secondary">
                                            {form.paymentRequired
                                                ? `Collects ₹${form.paymentAmount || "branch amount"}`
                                                : "No payment"}
                                        </span>
                                    </div>

                                    <div className="tw-mt-3 tw-flex tw-flex-wrap tw-justify-end tw-border-t tw-border-gray-200 tw-pt-3">
                                        <MenuOptionHrtl
                                            actionOptions={actionsList}
                                            rowId={form.id}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <ModalContainerUpdated
                id="crm-settings-enquiry-form"
                isOpen={modalState.showModal}
                toggle={closeModal}
                modalTitle={
                    modalState.modalData ? "Edit Enquiry Form" : "Add Enquiry Form"
                }
                modalSize="lg"
            >
                <AddEditEnquiryFormModal
                    data={modalState.modalData}
                    businessUnitId={businessUnitId}
                    toggle={closeModal}
                    onSave={saveHandler}
                />
            </ModalContainerUpdated>

            <ConfirmationModal
                id="crm-settings-enquiry-form-delete"
                isOpen={deleteModalState.showModal}
                iconType="reject"
                confirmTitle="Delete enquiry form?"
                confirmMessage={`"${deleteModalState.modalData?.displayName}" will be removed and its public link will stop working.`}
                noteMessage="Leads already captured through it are kept."
                confirmBtnText="Delete Form"
                confirmHndlr={deleteHandler}
                cancelHndlr={deleteCloseModal}
            />
        </>
    );
};

export default EnquiryForms;
