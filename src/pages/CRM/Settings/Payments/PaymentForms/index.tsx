import { useCallback, useMemo, useState, type MouseEvent } from "react";

import {
    Button,
    ConfirmationModal,
    ModalContainerUpdated,
} from "../../../../../Components/Common";
import TableContainer from "../../../../../Components/Common/TableContainer";
import { type IOptionsHrtl } from "../../../../../Components/Common/MenuOptions";
import { useModal } from "../../../../../hooks/modalhook";
import { copyToClipboard } from "../../helper";
import AddEditPaymentFormModal from "./AddEditPaymentFormModal";
import {
    generatePaymentFormColumns,
    paymentForms as sampleForms,
    paymentFormUrl,
    type PaymentForm,
} from "./helper";
import { toast } from "react-toastify";

interface PaginationState {
    pageNo: number;
    pageSize: number;
}

const initialPagination: PaginationState = { pageNo: 0, pageSize: 10 };

const PaymentForms = () => {
    const [forms, setForms] = useState<Array<PaymentForm>>(sampleForms);
    const [pagination, setPagination] =
        useState<PaginationState>(initialPagination);

    const { openModal, closeModal, modalState } = useModal();
    const {
        openModal: deleteOpenModal,
        closeModal: deleteCloseModal,
        modalState: deleteModalState,
    } = useModal();

    const paginatedForms = useMemo(() => {
        const start = pagination.pageNo * pagination.pageSize;

        return forms.slice(start, start + pagination.pageSize);
    }, [forms, pagination]);

    const findForm = useCallback(
        (formId: string | null) => forms.find(form => form.id === formId),
        [forms],
    );

    const saveHandler = (form: PaymentForm, isNew: boolean) => {
        setForms(current =>
            isNew
                ? [form, ...current]
                : current.map(item => (item.id === form.id ? form : item)),
        );
        toast.success(isNew ? "Payment form created" : "Payment form updated");
    };

    const deleteHandler = () => {
        const form: PaymentForm | undefined = deleteModalState.modalData;

        if (!form) {
            return;
        }

        if (form.submissionCount > 0) {
            toast.error(`"${form.title}" has ${form.submissionCount} payment submissions and cannot be deleted. Deactivate it instead to close the link and keep the records.`);
            deleteCloseModal();
            return;
        }

        setForms(current => current.filter(item => item.id !== form.id));
        deleteCloseModal();
        toast.success(`"${form.title}" deleted`);
    };

    const menuOptions: Array<IOptionsHrtl> = useMemo(
        () => [
            {
                id: "copy",
                actionIcon: <i className="ri-file-copy-line tw-text-gray-500"></i>,
                actionName: "Copy Public Link",
                onClickHndlr: (event: MouseEvent<HTMLElement>) => {
                    const form = findForm(
                        event.currentTarget.getAttribute("data-id"),
                    );

                    if (form) {
                        copyToClipboard(
                            paymentFormUrl(form.formKey),
                            "Payment form link copied",
                        );
                    }
                },
            },
            {
                id: "preview",
                actionIcon: <i className="ri-eye-line tw-text-gray-500"></i>,
                actionName: "Preview Form",
                onClickHndlr: (event: MouseEvent<HTMLElement>) => {
                    const form = findForm(
                        event.currentTarget.getAttribute("data-id"),
                    );

                    if (form) {
                        window.open(
                            paymentFormUrl(form.formKey),
                            "_blank",
                            "noreferrer",
                        );
                    }
                },
            },
            {
                id: "edit",
                actionIcon: <i className="ri-pencil-line tw-text-gray-500"></i>,
                actionName: "Edit",
                onClickHndlr: (event: MouseEvent<HTMLElement>) => {
                    const form = findForm(
                        event.currentTarget.getAttribute("data-id"),
                    );

                    if (form) {
                        openModal(form);
                    }
                },
            },
            {
                id: "delete",
                actionIcon: <i className="ri-delete-bin-line tw-text-danger"></i>,
                actionName: "Delete",
                onClickHndlr: (event: MouseEvent<HTMLElement>) => {
                    const form = findForm(
                        event.currentTarget.getAttribute("data-id"),
                    );

                    if (form) {
                        deleteOpenModal(form);
                    }
                },
            },
        ],
        [deleteOpenModal, findForm, openModal],
    );

    const tableColumns = useMemo(
        () => generatePaymentFormColumns(menuOptions),
        [menuOptions],
    );

    return (
        <>
            <div className="tw-mb-3 tw-flex tw-flex-wrap tw-items-center tw-justify-end tw-gap-2">
                <Button
                    type="button"
                    variant="primary"
                    onClick={() => openModal()}
                >
                    <i className="ri-add-line tw-me-1"></i>
                    Create Form
                </Button>
            </div>

            <div className="tw-card">
                <div className="tw-card-body !tw-p-0">
                    <TableContainer
                        columns={tableColumns}
                        data={paginatedForms}
                        tableClass="mb-0"
                        divClass="table-responsive mb-3"
                        theadClass="table-light text-muted align-middle"
                        showPagination
                        totalPages={Math.ceil(forms.length / pagination.pageSize)}
                        totalRecords={forms.length}
                        currentPageNumber={pagination.pageNo}
                        pageSize={pagination.pageSize}
                        callbackPaginationHndlr={setPagination}
                    />
                </div>
            </div>

            <ModalContainerUpdated
                id="crm-settings-payment-form"
                isOpen={modalState.showModal}
                toggle={closeModal}
                modalTitle={
                    modalState.modalData
                        ? "Edit Payment Form"
                        : "Create Payment Form"
                }
                modalSize="lg"
            >
                <AddEditPaymentFormModal
                    data={modalState.modalData}
                    toggle={closeModal}
                    onSave={saveHandler}
                />
            </ModalContainerUpdated>

            <ConfirmationModal
                id="crm-settings-payment-form-delete"
                isOpen={deleteModalState.showModal}
                iconType="reject"
                confirmTitle="Delete payment form?"
                confirmMessage={`"${deleteModalState.modalData?.title}" and its ${deleteModalState.modalData?.categories?.length || 0} categories will be removed, and its public link will stop working.`}
                noteMessage={
                    deleteModalState.modalData?.submissionCount > 0
                        ? `This form has ${deleteModalState.modalData?.submissionCount} payment submissions. Forms that have taken money cannot be deleted — deactivate it instead.`
                        : "This cannot be undone."
                }
                confirmBtnText="Delete Form"
                confirmHndlr={deleteHandler}
                cancelHndlr={deleteCloseModal}
            />
        </>
    );
};

export default PaymentForms;
