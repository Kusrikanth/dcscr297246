import React, { useEffect, useMemo, useRef, useState } from "react";
import { shallowEqual, useDispatch } from "react-redux";
import TableContainer from "../../../../Components/Common/TableContainer";
import { useAppSelector } from "../../../../hooks/storehook";
import { downloadDocumentByIdAct } from "../../../../store/directory/studentmanagement/studentmanagementactions";
import { generateActionPayload } from "../../../../utility/reduxutility";
import AddDocumentDetailsModal from "./AddDocumentDetails";
import { DocumentDetailsData, generateDocumentDetailsColumns } from "./helper";
import { IAddDetailsModal, IOptionsHrtl, IPropsTypes } from "./EmployeeInfoTypes";
import { getEmployeeByIdAct, getEmployeeDocumentListAct } from "../../../../store/directory/employeemanagement/employeemanagementactions";
import { IUploadDocumentErrorRepRef, IUploadDocumentRepRef } from "../../StudentDetails/StudentInfo/StudentInfoTypes";
import { toast } from "react-toastify";
import { ModalContainerUpdated } from "../../../../Components/Common";
import { AccordionBody, AccordionHeader } from "reactstrap";
import Button from "../../../../Components/Common/Button";

export default function DocumentDetails({ instituteId, branchId, employeeId, divId, canCreateAndUpdate }: any) {
    const dispatch = useDispatch();
    const [documentDetails, setDocumentDetails] = useState<any>();
    const { getEmployeeByIdResp, downDocumentByIdResp, employeeManagementErrorResp } = useAppSelector(
        ({ directoryStudent, directoryEmployee }) => ({
            getEmployeeByIdResp: directoryEmployee.getEmployeeByIdResp,
            employeeManagementErrorResp: directoryEmployee.employeeManagementErrorResp,
            downDocumentByIdResp: directoryStudent.downDocumentByIdResp,
        }),
        shallowEqual
    );
    const DocumentUploadRef = useRef<IUploadDocumentErrorRepRef>({
        prevUploadDocumentErrorResp: employeeManagementErrorResp
    });

    useEffect(() => {
        const { prevUploadDocumentErrorResp } =
            DocumentUploadRef.current;

        if (employeeManagementErrorResp &&
            prevUploadDocumentErrorResp !== employeeManagementErrorResp) {
            const { details } = employeeManagementErrorResp;

            toast.error(details);
        }
        DocumentUploadRef.current.prevUploadDocumentErrorResp = employeeManagementErrorResp;
    }, [employeeManagementErrorResp]);
    function downloadExcelFile(blobStream: any, fileName: any) {

        const url = window.URL.createObjectURL(new Blob([(blobStream)]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
    }
    const menuOptions = useMemo((): IOptionsHrtl[] => ([{
        id: "edit",
        actionIcon: <i className="text-muted ri-pencil-fill fs-16"></i>,
        actionName: "Edit",
        onClickHndlr: (event: any) => {
            const documentId = event.currentTarget.getAttribute("data-id");
            const document = getEmployeeByIdResp && getEmployeeByIdResp.employeeDocumentList.find((a: any) => a.id === +documentId);
            setAddDocumentDetailsModalState(pre => ({ ...pre, showModal: true, editData: document }))
        },
    }, {
        id: "download",
        actionIcon: <i className="text-muted ri-download-2-line fs-16"></i>,
        actionName: "Download",
        onClickHndlr: (event: any) => {
            const documentId = event.currentTarget.getAttribute("data-id");
            const document = getEmployeeByIdResp && getEmployeeByIdResp.employeeDocumentList.find((a: any) => a.id === +documentId);

            setDocumentDetails(document);
            dispatch(downloadDocumentByIdAct(generateActionPayload('download_employee_document_by_id', {
                documentId: documentId
            }, undefined, {
                responseType: 'blob'
            })))
        },
    }]), [getEmployeeByIdResp]);



    const documentDetailsColumns = useMemo(() => {
        const columns = generateDocumentDetailsColumns(menuOptions);
        if (!canCreateAndUpdate) {
            return columns.filter(item => item.accessor !== 'actions');
        }
        return columns;
    }, [getEmployeeByIdResp, canCreateAndUpdate])

    const [addDocumentDetailsModalState, setAddDocumentDetailsModalState] =
        useState<IAddDetailsModal>({
            showModal: false,
            branchId: "",
            editData: undefined
        });
    const toggleAddDocumentDetailsModal = (apiCall?: any) => {
        setAddDocumentDetailsModalState(pre => ({
            ...pre,
            showModal: !pre.showModal,
            editData: undefined
        }))
        if (typeof (apiCall) === "boolean" && apiCall) {
            dispatch(getEmployeeByIdAct(generateActionPayload("get_employee_byid", { employeeId: employeeId })));
        }
    }

    useEffect(() => {

        downDocumentByIdResp && downloadExcelFile(downDocumentByIdResp, documentDetails.fileName)
    }, [downDocumentByIdResp])


    return (<>
        <div>
            <AccordionHeader tag="h4" targetId="documents">
                Documents
            </AccordionHeader>
            <AccordionBody accordionId="documents">
                <div id={divId}>
                    <div className="tw-p-0">

                        <TableContainer
                            columns={documentDetailsColumns || []}
                            data={
                                getEmployeeByIdResp
                                    ? getEmployeeByIdResp.employeeDocumentList
                                    : []
                            }
                            divClass="tw-overflow-x-auto tw-mb-1"
                            theadClass="tw-text-gray-500 tw-align-middle"
                        />

                         {canCreateAndUpdate && <div className="tw-pl-2 tw-pt-2">
                            <Button
                            variant="primary"
                                onClick={toggleAddDocumentDetailsModal}
                            >
                                Add Document
                            </Button>
                        </div>}

                    </div>
                </div>
                <ModalContainerUpdated
                    id="add-academic-year-date-modal"
                    isOpen={addDocumentDetailsModalState.showModal}
                    toggle={toggleAddDocumentDetailsModal}
                    modalTitle={"Add Documents Details"}
                    modalSize="md"
                >

                    <AddDocumentDetailsModal
                        isOpen={addDocumentDetailsModalState.showModal}
                        toggle={toggleAddDocumentDetailsModal}
                        modalTitle="Add Document Details"
                        employeeId={employeeId}
                        instituteId={instituteId}
                        branchId={branchId}
                        editData={addDocumentDetailsModalState.editData}
                        editBranchDetails={""}
                        data={getEmployeeByIdResp}
                    />
                </ModalContainerUpdated>
            </AccordionBody>
        </div>
    </>
    )
}