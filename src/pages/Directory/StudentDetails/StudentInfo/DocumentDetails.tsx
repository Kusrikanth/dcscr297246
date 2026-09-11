import React, { useEffect, useMemo, useRef, useState } from "react";
import { shallowEqual, useDispatch } from "react-redux";
import TableContainer from "../../../../Components/Common/TableContainer";
import { useAppSelector } from "../../../../hooks/storehook";
import { deleteDocByIdAct, downloadDocumentByIdAct, getStudentByIdAct } from "../../../../store/directory/studentmanagement/studentmanagementactions";
import { generateActionPayload } from "../../../../utility/reduxutility";
import AddDocumentDetailsModal from "./AddDocumentDetails";
import { generateDocumentDetailsColumns } from "./helper";
import { IAddDetailsModal, IOptionsHrtl } from "./StudentInfoTypes";
import { ModalContainerUpdated } from "../../../../Components/Common";
import { useModal } from "../../../../hooks/modalhook";
import ExportModal from "../../StudentManagement/ExportModal";
import { toast } from "react-toastify";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02StrokeStandard, DownloadCircle02Icon, EyeIcon, PencilEdit02Icon } from "@hugeicons-pro/core-stroke-standard";
import Button from "../../../../Components/Common/Button";

interface IDocumentDetails {
    studentId: number;
    academicYearId: string;
    divId: string;
    branchId: number;
    instituteId: number;
    canCreateAndUpdate: boolean;
}

export default function DocumentDetails(props: IDocumentDetails) {
    const dispatch = useDispatch();
    const [documentDetails, setDocumentDetails] = useState<any>();
    const { modalState: deleteDocState, openModal: openDeleteDocModal, closeModal: closeDeleteDocModal } = useModal()
    const [addDocumentDetailsModalState, setAddDocumentDetailsModalState] =
        useState<IAddDetailsModal>({
            showModal: false,
            branchId: "",
            editData: undefined
        });
    const { getStudentByIdResp, downDocumentByIdResp, currentInstIdResp: instituteId, currentBranchIdResp: branchId, deleteDocByIdResp } = useAppSelector(
        ({ directoryStudent, appData }) => ({
            getStudentByIdResp: directoryStudent.getStudentByIdResp,
            downDocumentByIdResp: directoryStudent.downDocumentByIdResp,
            deleteDocByIdResp: directoryStudent.deleteDocByIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            currentBranchIdResp: appData.currentBranchIdResp,
        }),
        shallowEqual
    );

    const docDetailsRef = useRef({
        prevDeleteDocByIdResp: deleteDocByIdResp
    })

    useEffect(() => {
        const { prevDeleteDocByIdResp } = docDetailsRef.current;
        if (deleteDocByIdResp && deleteDocByIdResp !== prevDeleteDocByIdResp) {
            toast.success("Document Deleted Successfully.")
            dispatch(getStudentByIdAct(generateActionPayload("get_students_by_id", { studentId: props.studentId }, { academicYearId: props.academicYearId })));
            closeDeleteDocModal()
        }
        docDetailsRef.current.prevDeleteDocByIdResp = deleteDocByIdResp
    }, [deleteDocByIdResp])


    const menuOptions = useMemo((): IOptionsHrtl[] => ([{
        id: "edit",
        actionIcon: <HugeiconsIcon icon={PencilEdit02Icon} className="me-2 text-muted" size={18} />,
        actionName: "Edit",
        onClickHndlr: (event: any) => {
            const documentId = event.currentTarget.getAttribute("data-id");
            const document = getStudentByIdResp && getStudentByIdResp.studentDocumentsDetails.find((a: any) => a.id === +documentId);
            setAddDocumentDetailsModalState(pre => ({ ...pre, showModal: true, editData: document }))
        },
    }, {
            id: "view",
            actionIcon: <HugeiconsIcon icon={EyeIcon} className="me-2 text-muted" size={18} />,
            actionName: "View",
            onClickHndlr: (event: any) => {
                const documentId = event.currentTarget.getAttribute("data-id");
                const document = getStudentByIdResp?.studentDocumentsDetails?.find((a: any) => a.id === Number(documentId));
                setDocumentDetails(document);
                const base64Data = document?.base64Data;
                if (!base64Data) return;
                const fileType = document?.systemFile?.fileExtension || document?.type;
                let mimeType = "";
                if (
                    [".jpg", ".jpeg", ".png"].includes(
                        fileType?.toLowerCase()
                    )
                ) {
                    mimeType = fileType === ".png" ? "image/png" : "image/jpeg";
                }
                else if (fileType?.toLowerCase() === ".pdf") {
                    mimeType = "application/pdf";
                }
                const fileURL = `data:${mimeType};base64,${base64Data}`;
                const newWindow = window.open();
                if (newWindow) {
                    if (mimeType === "application/pdf") {
                        newWindow.document.write(`
                            <iframe width="100%" height="100%" src="${fileURL}" frameborder="0" 
                                style="border:none; position:fixed; top:0; left:0; width:100%; height:100%;" >
                            </iframe>
                        `);
                    } else {
                        newWindow.document.write(`
                            <img src="${fileURL}" style="max-width:100%; height:auto; display:block; margin:auto;" />
                        `);
                    }
                }
            },
        }, {
        id: "download",
        actionIcon: <HugeiconsIcon icon={DownloadCircle02Icon} className="me-2 text-muted" size={18} />,
        actionName: "Download",
        onClickHndlr: (event: any) => {
            const documentId = event.currentTarget.getAttribute("data-id");
            const document = getStudentByIdResp && getStudentByIdResp.studentDocumentsDetails.find((a: any) => a.id === +documentId);
            setDocumentDetails(document);

            const s3URL = document?.systemFile?.s3URL
            window.open(s3URL, '_blank');

        },
    }, {
        id: "delete",
        actionIcon: <HugeiconsIcon icon={Delete02StrokeStandard} className="me-2 text-danger" size={18} />,
        actionName: "Delete",
        onClickHndlr: (event: any) => {
            const documentId = event.currentTarget.getAttribute("data-id");
            openDeleteDocModal(documentId);
        },
    }]), [getStudentByIdResp]);

    const documentDetailsColumns = useMemo(() => {
        const columns = generateDocumentDetailsColumns(menuOptions);
        if (!props.canCreateAndUpdate) {
            return columns.filter((item: any) => item.accessor !== 'actions');
        }
        return columns;
    }, [getStudentByIdResp, props.canCreateAndUpdate])

    const toggleAddDocumentDetailsModal = (apiCall?: any) => {
        setAddDocumentDetailsModalState(pre => ({ ...pre, showModal: !pre.showModal }))
        if (typeof (apiCall) === "boolean" && apiCall) {
            dispatch(getStudentByIdAct(generateActionPayload("get_students_by_id", { studentId: props.studentId }, { academicYearId: props.academicYearId })));
        }
    }

    function addDocumentHndlr() {
        setAddDocumentDetailsModalState(pre => ({ ...pre, showModal: true, editData: undefined }))
    }

    const submitHndlr = () => {
        dispatch(deleteDocByIdAct(generateActionPayload("delete_doc_by_id", { id: deleteDocState.modalData })));
    }

    return (<>
        <div id={props.divId} className="tw-bg-white tw-rounded-lg tw-shadow tw-mb-6">

            {/* Header */}
            <div className="tw-border-b tw-px-6 tw-py-4">
                <h4 className="tw-text-lg tw-font-semibold tw-text-gray-800">
                    Documents
                </h4>
            </div>

            {/* Body */}
            <div className="tw-p-0">

                {/* Table */}
                <div className="tw-overflow-x-auto tw-mb-1">
                    <TableContainer
                        columns={documentDetailsColumns || []}
                        data={
                            getStudentByIdResp
                                ? getStudentByIdResp.studentDocumentsDetails
                                : []
                        }
                        divClass=""
                        theadClass="tw-text-gray-500 tw-align-middle"
                    />
                </div>

                {/* Add Button */}
                <div className="tw-pl-6 tw-pb-4">
                    <Button
                        type="button"
                        onClick={addDocumentHndlr}
                        variant="info"
                    >
                        Add Document
                    </Button>
                </div>

            </div>
        </div>
        <ModalContainerUpdated
            id="add-students-documents-details-date-modal"
            isOpen={addDocumentDetailsModalState.showModal}
            toggle={toggleAddDocumentDetailsModal}
            modalTitle={`${addDocumentDetailsModalState.editData ? "Update" : "Add"} Document Details`}
            modalSize="md"
        >
            <AddDocumentDetailsModal
                isOpen={addDocumentDetailsModalState.showModal}
                toggle={toggleAddDocumentDetailsModal}
                modalTitle={`${addDocumentDetailsModalState.editData ? "Update" : "Add"} Document Details`}
                instituteId={props.instituteId}
                instituteName={""}
                branchId={props.branchId}
                editBranchDetails={""}
                data={getStudentByIdResp}
                editData={addDocumentDetailsModalState.editData}
                studentId={props.studentId}
                academicYearId={props.academicYearId}
            />
        </ModalContainerUpdated>
        <ModalContainerUpdated
            id="export-student-management-modal"
            isOpen={deleteDocState.showModal}
            toggle={closeDeleteDocModal}
            modalTitle="Delete Document"
            modalSize="md"
        >
            <ExportModal
                isOpen={deleteDocState.showModal}
                toggle={closeDeleteDocModal}
                instituteId={instituteId}
                branchId={branchId}
                submitHndlr={submitHndlr}
                hideEnterRemarks
                feature="directory"
                subFeature={"student_management"}
            />
        </ModalContainerUpdated>
    </>
    )
}