import React, { useEffect, useMemo, useRef, useState } from "react";
import { shallowEqual, useDispatch } from "react-redux";
import TableContainer from "../../../../../Components/Common/TableContainer";
import { useAppSelector } from "../../../../../hooks/storehook";
import { getStudentByIdAct } from "../../../../../store/directory/studentmanagement/studentmanagementactions";
import { generateActionPayload } from "../../../../../utility/reduxutility";
import { generateDocumentDetailsColumns } from "./helper";
import { ModalContainerUpdated } from "../../../../../Components/Common";
import Button from "../../../../../Components/Common/Button";
import AddDocumentDetailsModal from "./AddDocumentDetails";
import { HugeiconsIcon } from "@hugeicons/react";
import { IOptionsHrtl } from "../../../../../Components/Common/MenuOptions";
import { DownloadCircle02Icon, EyeIcon } from "@hugeicons-pro/core-stroke-standard";

interface IDocumentDetails {
    studentId: number;
    academicYearId: string;
    divId: string;
    branchId: number;
    instituteId: number;
}

export default function DocumentDetails(props: IDocumentDetails) {
    const dispatch = useDispatch();
    const [addDocumentDetailsModalState, setAddDocumentDetailsModalState] =
        useState<any>({
            showModal: false,
            branchId: "",
            editData: undefined
        });
    const { getStudentByIdResp, currentInstIdResp: instituteId, currentBranchIdResp: branchId } = useAppSelector(
        ({ directoryStudent, appData }) => ({
            getStudentByIdResp: directoryStudent.getStudentByIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            currentBranchIdResp: appData.currentBranchIdResp,
        }),
        shallowEqual
    );

    const menuOptions = useMemo((): IOptionsHrtl[] => ([
        {
            id: "view",
            actionIcon: <HugeiconsIcon icon={EyeIcon} className="me-2 text-muted" size={18} />,
            actionName: "View",
            onClickHndlr: (event: any) => {
                const documentId = event.currentTarget.getAttribute("data-id");
                const document = getStudentByIdResp?.studentDocumentsDetails?.find((a: any) => a.id === Number(documentId));
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
        },{
            id: "download",
            actionIcon: <HugeiconsIcon icon={DownloadCircle02Icon} className="me-2 text-muted" size={18} />,
            actionName: "Download",
            onClickHndlr: (event: any) => {
                const documentId = event.currentTarget.getAttribute("data-id");
                const document = getStudentByIdResp && getStudentByIdResp.studentDocumentsDetails.find((a: any) => a.id === +documentId);
                const s3URL = document?.systemFile?.s3URL
                window.open(s3URL, "_blank", "noopener,noreferrer");
            },
        }
    ]), [getStudentByIdResp]);

    const documentDetailsColumns = useMemo(() => generateDocumentDetailsColumns(menuOptions), [getStudentByIdResp,]);

    const toggleAddDocumentDetailsModal = (apiCall?: any) => {
        setAddDocumentDetailsModalState(pre => ({ ...pre, showModal: !pre.showModal }))
        if (typeof (apiCall) === "boolean" && apiCall) {
            dispatch(getStudentByIdAct(generateActionPayload("get_students_by_id", { studentId: props.studentId }, { academicYearId: props.academicYearId })));
        }
    }

    function addDocumentHndlr() {
        setAddDocumentDetailsModalState(pre => ({ ...pre, showModal: true, editData: undefined }))
    }

    return (<>
        <div id={props.divId} className="tw-mb-5 tw-bg-white tw-rounded-lg tw-shadow">
            <div className="tw-border-b tw-px-6 tw-py-4 tw-flex tw-items-center">

                <h4 className="tw-text-lg tw-font-semibold tw-text-gray-800">
                    Documents
                </h4>

                <div className="tw-ml-auto">
                    <Button
                        type="button"
                        onClick={addDocumentHndlr}
                        variant="info"
                    >
                        Add Document
                    </Button>
                </div>

            </div>
            <div className="tw-flex tw-flex-col tw-gap-4 tw-pb-4">
                <div className="tw-overflow-x-auto">
                    <TableContainer
                        columns={documentDetailsColumns || []}
                        data={
                            getStudentByIdResp
                                ? getStudentByIdResp.studentDocumentsDetails
                                : []
                        }
                        divClass="tw-mb-0"
                        theadClass="tw-text-gray-500 tw-align-middle"
                    />
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
    </>
    )
}