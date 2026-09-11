import React, { useMemo, useState } from "react";
import { shallowEqual, useDispatch } from "react-redux";

import { generateSiblingfDetailsColumns } from "./helper";
import { useAppSelector } from "../../../../../hooks/storehook";
import { generateActionPayload } from "../../../../../utility/reduxutility";
import { getStudentByIdAct } from "../../../../../store/directory/studentmanagement/studentmanagementactions";
import { IOptionsHrtl } from "../../../../../Components/Common/MenuOptions";
import TableContainer from "../../../../../Components/Common/TableContainer";
import { ModalContainerUpdated } from "../../../../../Components/Common";
import AddSiblingModal from "./AddSiblingModal";


interface ISiblingDetails {
    studentId: number;
    branchId: number;
    instituteId: number;
    academicYearId: string;
    divId: string;

}

export default function SiblingDetails(props: ISiblingDetails) {
    const dispatch = useDispatch();
    const [addSiblingDetailsModalState, setAddSiblingDetailsModalState] =
        useState<any>({
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
        setAddSiblingDetailsModalState((pre:any) => ({
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
        actionIcon: <i className="text-muted ri-pencil-fill fs-16"></i>,
        actionName: "Edit",
        onClickHndlr: (e: any) => {
            const id = e.currentTarget.getAttribute("data-id");
            const data = getStudentByIdResp.studentSiblingDetails.find((student: any) => student.id == id)
            setAddSiblingDetailsModalState((pre:any) => ({ ...pre, showModal: true, editData: data }));
        },
    }]), [getStudentByIdResp]);
    const siblingDetailsColumns = useMemo(() => generateSiblingfDetailsColumns(menuOptions), [getStudentByIdResp])


    return (
        <>
            <div id={props.divId} className="tw-mb-4 tw-rounded-lg tw-border tw-border-gray-200 tw-bg-white tw-shadow-sm">
                <div className="tw-px-5 tw-py-4 tw-border-b tw-border-gray-200">
                    <h4 className="tw-text-base tw-font-semibold tw-m-0">Sibling Details</h4>
                </div>
                <div className="tw-p-0">
                    <TableContainer
                        columns={siblingDetailsColumns || []}
                        data={getStudentByIdResp?.studentSiblingDetails?.length > 0 ? getStudentByIdResp?.studentSiblingDetails : []}
                        divClass="table-responsive tw-mb-3"
                        tableClass="tw-w-full tw-border-collapse"
                        theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
                    />
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