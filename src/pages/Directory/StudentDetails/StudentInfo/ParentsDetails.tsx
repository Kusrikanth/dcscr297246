
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { shallowEqual, useDispatch } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import { ConfirmationModal, ModalContainerUpdated, Switch } from '../../../../Components/Common';
import TableContainer from '../../../../Components/Common/TableContainer';
import { useAppSelector } from '../../../../hooks/storehook';
import { getStudentByIdAct, updatePrimaryContactAct, updateStudentAct } from '../../../../store/directory/studentmanagement/studentmanagementactions';
import { generateActionPayload } from '../../../../utility/reduxutility';
import AddParentModal from './AddParentModal';
import { details, formSectionSaveKey, generateParentsDetailsColumns } from './helper';
import "react-toastify/dist/ReactToastify.css";
import { IAddDetailsModal, IOptionsHrtl } from './StudentInfoTypes';
import { useModal } from '../../../../hooks/modalhook';
import classNames from "classnames";
import { HugeiconsIcon } from '@hugeicons/react';
import { PencilEdit02Icon, StarIcon } from "@hugeicons-pro/core-stroke-standard";
import Button from '../../../../Components/Common/Button';

interface IParentDetails {
    studentId: number;
    academicYearId: string;
    divId: string;
    branchId: number;
    instituteId: number;
    canCreateAndUpdate: boolean;
}

const ParentsDetails = (props: IParentDetails) => {
    const { modalState: confirmPrimaryModalState, closeModal: closePrimaryModalHandler,
        openModal: openPrimaryModalState
    } = useModal();

    const [isEliteParent, setIsEliteParent] = useState(false);

    const dispatch = useDispatch();
    const [addParentDetailsModalState, setAddParentDetailsModalState] =
        useState<IAddDetailsModal>({
            showModal: false,
            branchId: "",
            editData: undefined
        });


    const toggleAddParentDetailsModal = (apiCall?: any) => {
        setAddParentDetailsModalState((pre) => ({
            ...pre,
            showModal: !pre.showModal,
        }))
        if (typeof (apiCall) === "boolean" && apiCall) {
            dispatch(getStudentByIdAct(generateActionPayload("get_students_by_id", { studentId: props.studentId }, { academicYearId: props.academicYearId })));
        }
    }
    const { getStudentByIdResp, updatePrimaryContactResp, showApiLoader } = useAppSelector(
        ({ directoryStudent, globalData }) => ({
            getStudentByIdResp: directoryStudent.getStudentByIdResp,
            showApiLoader: globalData.showApiLoader,
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

    const menuOptions = useMemo((): IOptionsHrtl[] => {
        return ([{
            id: "primary-contact",
            actionIcon: <i className="ri-star-fill text-warning fs-16"></i>,
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
                setAddParentDetailsModalState(pre => ({ ...pre, showModal: true, editData: data }));

            },
        }])
    }, [getStudentByIdResp]);

    const getMenuOptions = useCallback((relationType: any, menuOptions: any): IOptionsHrtl[] => {
        const isActive = relationType?.toLowerCase()?.toString() === getStudentByIdResp?.studentDetails?.primaryContactStatus?.toLowerCase().toString()
        const isVisible = menuOptions?.name && menuOptions?.emailId && menuOptions?.contactNo
        return ([{
            id: "primary-contact",
            actionIcon: isActive ? <HugeiconsIcon icon={StarIcon} className="me-2 text-warning" size={18} /> : <HugeiconsIcon icon={StarIcon} className={`me-2 text-muted ${isVisible ? "" : "tw-invisible"}`} size={18} />,
            actionName: isVisible && "Primary Contact",
            onClickHndlr: (e: any) => {
                const relationType = e.currentTarget.getAttribute("data-id");
                {
                    isVisible && openPrimaryModalState({
                        relationType: relationType?.toString().toUpperCase() || ""
                    })
                }
            },
        }, {
            id: "edit",
            actionIcon: <HugeiconsIcon icon={PencilEdit02Icon} className="me-2 text-muted" size={18} />,
            actionName: "Edit",
            onClickHndlr: (e: any) => {
                const relationType = e.currentTarget.getAttribute("data-id");
                const data = getStudentByIdResp.studentParentDetails.find((parent: any) => parent.relationType === relationType)
                setAddParentDetailsModalState(pre => ({ ...pre, showModal: true, editData: data }));

            },
        }])
    }, [getStudentByIdResp]);

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

    useEffect(() => {
        if (getStudentByIdResp?.studentParentDetails?.length > 0) {
            const { isEliteParent = false } = getStudentByIdResp?.studentParentDetails[0] || {};
            setIsEliteParent(isEliteParent)
        }
    }, [getStudentByIdResp])

    const switchHndler = (event: React.ChangeEvent<HTMLInputElement>) => {
        let formData = new FormData();
        const data: any = details(getStudentByIdResp, { isEliteParent: event.target.checked }, { branchId: props.branchId, instituteId: props.instituteId }, formSectionSaveKey.parentFather);
        formData.append("studentRequest", JSON.stringify(data));

        dispatch(updateStudentAct(generateActionPayload('update_students_by_id', undefined, formData, {
            affectedSection: "Student Details"
        })));
    }


    const parentDetailsColumns = useMemo(() => {
        const columns = generateParentsDetailsColumns(getMenuOptions);
        if (!props.canCreateAndUpdate) {
            return columns.filter(item => item.accessor !== 'actions');
        }
        return columns;
    }, [getStudentByIdResp, props.canCreateAndUpdate])
    return (<>
        <div id={props.divId} className="tw-bg-white tw-rounded-lg tw-shadow tw-mb-4">

            {/* Header */}
            <div className="tw-border-b tw-px-6 tw-py-4">
                <div className="tw-flex tw-items-center tw-gap-4">

                    <h4 className="tw-text-lg tw-font-semibold tw-text-gray-800">
                        Parents / Guardian Details
                    </h4>

                    {props.canCreateAndUpdate && getStudentByIdResp?.studentParentDetails?.length > 0 && (
                        <div className="tw-ml-auto">
                            <Switch
                                attributeId="isEliteParent"
                                labelName="Is Elite Parent"
                                checked={isEliteParent}
                                isDisabled={showApiLoader}
                                onChangeHndlr={switchHndler}
                                className="tw-flex tw-items-center tw-gap-2"
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Body */}
            <div className="tw-p-0">

                {/* Table */}
                <div className="tw-overflow-x-auto tw-mb-1">
                    <TableContainer
                        columns={parentDetailsColumns}
                        data={
                            getStudentByIdResp?.studentParentDetails?.length > 0
                                ? getStudentByIdResp?.studentParentDetails
                                : []
                        }
                        theadClass="tw-text-gray-500 tw-align-middle"
                    />
                </div>

                {/* Add Parent Button */}
                <div className="tw-pl-6 tw-pb-4">
                    {getStudentByIdResp &&
                        getStudentByIdResp?.studentParentDetails?.length < 3 && (
                            <Button
                                variant='primary'
                                type="button"
                                onClick={toggleAddParentDetailsModal}
                            >
                                Add Parent
                            </Button>
                        )}
                </div>

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
        <ToastContainer />
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
