import React, { useMemo, useState } from "react";
import { shallowEqual, useDispatch } from "react-redux";
import TableContainer from "../../../../Components/Common/TableContainer";
import { useAppSelector } from "../../../../hooks/storehook";
import { getStudentByIdAct } from "../../../../store/directory/studentmanagement/studentmanagementactions";
import { generateActionPayload } from "../../../../utility/reduxutility";
import AddSiblingModal from "./AddSiblingModal";
import { generateSiblingfDetailsColumns } from "./helper";
import { IAddDetailsModal, IOptionsHrtl } from "./StudentInfoTypes";
import { ModalContainerUpdated } from "../../../../Components/Common";
import { HugeiconsIcon } from "@hugeicons/react";
import { PencilEdit02Icon } from "@hugeicons-pro/core-stroke-standard";
interface ISiblingDetails {
    studentId: number;
    branchId: number;
    instituteId: number;
    academicYearId: string;
    divId: string;
    canCreateAndUpdate: boolean;
}

export default function SiblingDetails(props: ISiblingDetails) {
    const dispatch = useDispatch();
    const [addSiblingDetailsModalState, setAddSiblingDetailsModalState] =
        useState<IAddDetailsModal>({
            showModal: false,
            branchId: "",
            editData: undefined
        });
    const { getStudentByIdResp } = useAppSelector(
        ({ directoryStudent }) => ({
            getStudentByIdResp: directoryStudent.getStudentByIdResp,
        }),
        shallowEqual
    );
    const toggleAddSiblingDetailsModal = (apiCall?: any) => {
        setAddSiblingDetailsModalState((pre) => ({
            ...pre,
            showModal: !pre.showModal,
            editData: undefined
        }))
        if (typeof (apiCall) === "boolean" && apiCall) {
            dispatch(getStudentByIdAct(generateActionPayload("get_students_by_id", { studentId: props.studentId }, { academicYearId: props.academicYearId })));
        }
    }
    const menuOptions = useMemo((): IOptionsHrtl[] => ([{
        id: "edit",
        actionIcon: <HugeiconsIcon icon={PencilEdit02Icon} className="me-2 text-muted" size={18} />,
        actionName: "Edit",
        onClickHndlr: (e: any) => {
            const id = e.currentTarget.getAttribute("data-id");
            const data = getStudentByIdResp.studentSiblingDetails.find((student: any) => student.id == id)
            setAddSiblingDetailsModalState(pre => ({ ...pre, showModal: true, editData: data }));
        },
    }]), [getStudentByIdResp]);
    const siblingDetailsColumns = useMemo(() => generateSiblingfDetailsColumns(menuOptions), [getStudentByIdResp])


    return (
        <>
            <div id={props.divId} className="tw-bg-white tw-rounded-lg tw-shadow tw-mb-4">
                {/* Header */}
                <div className="tw-border-b tw-px-6 tw-py-4">
                    <h4 className="tw-text-lg tw-font-semibold tw-text-gray-800">
                        Sibling Details
                    </h4>
                </div>

                {/* Body */}
                <div className="tw-p-0">
                    <TableContainer
                        columns={siblingDetailsColumns || []}
                        data={
                            getStudentByIdResp?.studentSiblingDetails?.length > 0
                                ? getStudentByIdResp.studentSiblingDetails
                                : []
                        }
                        divClass="tw-overflow-x-auto tw-mb-1"
                        theadClass="tw-text-gray-500 tw-align-middle"
                    /* Pagination props agar baad me chahiye to yahin rehne do */
                    // showPagination={true}
                    // totalPages={totalPages}
                    // totalRecords={totalRecords}
                    // callbackPaginationHndlr={paginationHndlr}
                    // currentPageNumber={pageNumber}
                    />

                    {/* Add Sibling Button (optional) */}
                    {/*
    <div className="tw-px-6 tw-pb-4">
      <button
        type="button"
        onClick={toggleAddSiblingDetailsModal}
        className="tw-flex tw-items-center tw-gap-2 tw-border tw-border-green-500 tw-text-green-600 tw-px-4 tw-py-2 tw-rounded-md hover:tw-bg-green-50"
      >
        Add Sibling
      </button>
    </div>
    */}
                </div>
            </div>
            <ModalContainerUpdated
                id="add-student-sibling-details-modal"
                isOpen={addSiblingDetailsModalState.showModal}
                toggle={toggleAddSiblingDetailsModal}
                modalTitle={`${addSiblingDetailsModalState.editData ? "Edit" : "Add"} Sibling Details`}
                modalSize="md"
            >
                <AddSiblingModal
                    isOpen={addSiblingDetailsModalState.showModal}
                    toggle={toggleAddSiblingDetailsModal}
                    modalTitle={`${addSiblingDetailsModalState.editData ? "Edit" : "Add"} Sibling Details`}
                    instituteId={props.instituteId}
                    instituteName={""}
                    branchId={props.branchId}
                    academicYearId={props.academicYearId}
                    editBranchDetails={""}
                    editData={addSiblingDetailsModalState.editData}
                    data={getStudentByIdResp}
                />
            </ModalContainerUpdated>
        </>
    )
}