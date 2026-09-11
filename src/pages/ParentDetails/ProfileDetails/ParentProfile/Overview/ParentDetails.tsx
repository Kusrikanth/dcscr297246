
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { shallowEqual, useDispatch } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';


import { generateParentsDetailsColumns } from './helper';
import "react-toastify/dist/ReactToastify.css";
import { generateActionPayload } from '../../../../../utility/reduxutility';
import { getStudentByIdAct, updatePrimaryContactAct } from '../../../../../store/directory/studentmanagement/studentmanagementactions';
import { useAppSelector } from '../../../../../hooks/storehook';
import { IOptionsHrtl } from '../../../../../Components/Common/MenuOptions';
import TableContainer from '../../../../../Components/Common/TableContainer';
import { ConfirmationModal, ModalContainerUpdated } from '../../../../../Components/Common';
import AddParentModal from './AddParentModal';
import { useModal } from '../../../../../hooks/modalhook';
import classNames from "classnames";


const initialValues = {
    schoolStudied: "",
    curriculum: "",
    class: "",
    percentage: "",
    reasonforSeekingAdmission: "",
}

interface IParentDetails {
    studentId: number;
    academicYearId: string;
    divId: string;
    branchId: number;
    instituteId: number;
}

const ParentsDetails = (props: IParentDetails) => {
    const { modalState: confirmPrimaryModalState, closeModal: closePrimaryModalHandler,
        openModal: openPrimaryModalState
    } = useModal();

    const dispatch = useDispatch();
    const [addParentDetailsModalState, setAddParentDetailsModalState] =
        useState<any>({
            showModal: false,
            branchId: "",
            editData: undefined
        });

    const toggleAddParentDetailsModal = (apiCall?: any) => {
        setAddParentDetailsModalState((pre: any) => ({
            ...pre,
            showModal: !pre.showModal,
        }))
        if (typeof (apiCall) === "boolean" && apiCall) {
            dispatch(getStudentByIdAct(generateActionPayload("get_students_by_id", { studentId: props.studentId }, { academicYearId: props.academicYearId })));
        }
    }
    const { getStudentByIdResp, updatePrimaryContactResp } = useAppSelector(
        ({ directoryStudent }) => ({
            getStudentByIdResp: directoryStudent.getStudentByIdResp,
            updatePrimaryContactResp: directoryStudent.updatePrimaryContactResp
        }),
        shallowEqual
    );

    const parentDetailsRef = useRef({
        prevUpdatePrimaryContactResp: updatePrimaryContactResp
    })

    useEffect(() => {
        const { prevUpdatePrimaryContactResp } = parentDetailsRef.current;
        if (updatePrimaryContactResp && prevUpdatePrimaryContactResp !== updatePrimaryContactResp) {
            toast.success("Primary contact details updated successfully.");
            dispatch(getStudentByIdAct(generateActionPayload("get_students_by_id", { studentId: props.studentId }, { academicYearId: props.academicYearId })));
            closePrimaryModalHandler();
        }
        parentDetailsRef.current.prevUpdatePrimaryContactResp = updatePrimaryContactResp;
    }, [updatePrimaryContactResp]);

    const modalTitle = (relation: any) => {
        if (relation === "Father") {
            return `${addParentDetailsModalState.editData ? "Update" : "Add"} Father Details`
        }
        else if (relation === "Mother") {
            return `${addParentDetailsModalState.editData ? "Update" : "Add"} Mother Details`
        }
        else if (relation === "Guardian") {
            return `${addParentDetailsModalState.editData ? "Update" : "Add"} Guardian Details`
        }
        else {
            return `Add Parent Details`
        }
    }

    function confirmModalHandler() {
        const { modalData }: any = confirmPrimaryModalState,
            { relationType } = modalData || {},
            payload = {
                studentId: props.studentId,
                relationType
            };
        dispatch(updatePrimaryContactAct(generateActionPayload("update_primary_contact", undefined, payload)));
    }

    const getMenuOptions = useCallback((relationType: any): IOptionsHrtl[] => {
        const isActive = relationType?.toLowerCase()?.toString() === getStudentByIdResp?.studentDetails?.primaryContactStatus?.toLowerCase().toString()
        return ([{
            id: "primary-contact",
            actionIcon: <i className={classNames("ri-star-fill fs-16", isActive ? "text-warning" : "tw-text-gray-500")}></i>,
            actionName: "Primary Contact",
            onClickHndlr: (e: any) => {
                const relationType = e.currentTarget.getAttribute("data-id");
                openPrimaryModalState({
                    relationType: relationType?.toString().toUpperCase() || ""
                })
            },
        }, {
            id: "edit",
            actionIcon: <i className="text-muted ri-pencil-fill fs-16"></i>,
            actionName: "Edit",
            onClickHndlr: (e: any) => {
                const relationType = e.currentTarget.getAttribute("data-id");
                const data = getStudentByIdResp.studentParentDetails.find((parent: any) => parent.relationType === relationType)
                setAddParentDetailsModalState((pre: any) => ({ ...pre, showModal: true, editData: data }));

            }
        }])
    }, [getStudentByIdResp]);


    const parentDetailsColumns = useMemo(() => generateParentsDetailsColumns(getMenuOptions), [getStudentByIdResp])
    return (<>
        <div id={props.divId} className="tw-rounded-lg tw-border tw-border-gray-200 tw-bg-white tw-shadow-sm tw-mb-4">
            <div className="tw-flex tw-px-5 tw-py-4 tw-border-b tw-border-gray-200">
                <h4 className="tw-text-base tw-font-semibold tw-m-0">Parents/Guardian Details</h4>
            </div>
            <div className="tw-p-0">
                <TableContainer
                    columns={parentDetailsColumns || []}
                    data={getStudentByIdResp?.studentParentDetails?.length > 0 ? getStudentByIdResp?.studentParentDetails : []}
                    divClass="table-responsive tw-mb-3"
                    tableClass="tw-w-full tw-border-collapse"
                    theadClass="tw-bg-gray-100 tw-text-gray-600 tw-text-sm tw-align-middle"
                />
            </div>
        </div>
        <ModalContainerUpdated
            id="add-parent-details-modal"
            isOpen={addParentDetailsModalState.showModal}
            toggle={toggleAddParentDetailsModal}
            modalTitle={modalTitle(addParentDetailsModalState.editData && addParentDetailsModalState.editData.relationType)}
            modalSize="lg"
        >
            <AddParentModal
                isOpen={addParentDetailsModalState.showModal}
                toggle={toggleAddParentDetailsModal}
                modalTitle={modalTitle(addParentDetailsModalState.editData && addParentDetailsModalState.editData.relationType)}
                instituteId={props.instituteId}
                instituteName={""}
                branchId={props.branchId}
                editBranchDetails={""}
                editData={addParentDetailsModalState.editData}
                data={getStudentByIdResp}
            />
        </ModalContainerUpdated>
        <ConfirmationModal
            id="primary-modal"
            btnClassName="btn w-sm btn-success"
            isOpen={confirmPrimaryModalState.showModal}
            confirmMessage="Are you sure you want to update the primary contact details?"
            cancelHndlr={closePrimaryModalHandler}
            confirmHndlr={confirmModalHandler}
        />
    </>
    )
}

export default ParentsDetails
