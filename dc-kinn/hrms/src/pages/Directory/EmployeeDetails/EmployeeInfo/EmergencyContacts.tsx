import React, { useEffect, useMemo, useState } from "react";
import { shallowEqual, useDispatch } from "react-redux";
import TableContainer from "../../../../Components/Common/TableContainer";
import { useAppSelector } from "../../../../hooks/storehook";
import { generateEmergencyContactsColumns, SiblingDetailsData } from "./helper";
import { IAddDetailsModal, IOptionsHrtl, IPropsTypes } from "./EmployeeInfoTypes";
import AddEmergencyContactModal from "./AddEmergencyContactModal";
import { getEmployeeByIdAct } from "../../../../store/directory/employeemanagement/employeemanagementactions";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { ModalContainerUpdated } from "../../../../Components/Common";
import { AccordionBody, AccordionHeader } from "reactstrap";
import Button from "../../../../Components/Common/Button";

export default function EmergencyContacts({ instituteId, branchId, employeeId, divId, canCreateAndUpdate }: any) {
    const dispatch = useDispatch()
    const [addEmergencyContactModalState, setAddEmergencyContactModalState] =
        useState<IAddDetailsModal>({
            showModal: false,
            branchId: "",
            editData: undefined
        });
    const { getEmployeeByIdResp, relationTypeListResp } = useAppSelector(
        ({ directoryEmployee, masterData }) => ({
            getEmployeeByIdResp: directoryEmployee.getEmployeeByIdResp,
            relationTypeListResp: masterData.relationTypeListResp,
        }),
        shallowEqual
    );
    const toggleAddEmergencyContactModal = (apiCall?: any) => {
        setAddEmergencyContactModalState((pre) => ({
            ...pre,
            showModal: !pre.showModal,
            editData: undefined
        }))

        if (typeof (apiCall) === "boolean" && apiCall) {
            dispatch(getEmployeeByIdAct(generateActionPayload("get_employee_byid", { employeeId: employeeId })));
        }
    }
    const menuOptions = useMemo((): IOptionsHrtl[] => ([{
        id: "edit",
        actionIcon: <i className="text-muted ri-pencil-fill fs-16"></i>,
        actionName: "Edit",
        onClickHndlr: (e: any) => {
            const id = e.currentTarget.getAttribute("data-id");
            const data = getEmployeeByIdResp.employeeEmergencyDetails.find((contact: any) => contact.id === +id)

            setAddEmergencyContactModalState(pre => ({ ...pre, showModal: true, editData: data }));
        },
    }]), [getEmployeeByIdResp]);

    const { data: RelationData } = relationTypeListResp || {};

    const EmergencyContactDetailsColumns = useMemo(() => {
        const columns = generateEmergencyContactsColumns(menuOptions, RelationData);
        if (!canCreateAndUpdate) {
            return columns.filter(item => item.accessor !== 'actions');
        }
        return columns;
    }, [getEmployeeByIdResp, canCreateAndUpdate])


    return (
        <>
        <div>
        <AccordionHeader tag = "h4" targetId="emergency-contacts">
            Emergency Contacts
        </AccordionHeader>
        <AccordionBody accordionId="emergency-contacts">
                    <div id={divId}>
                        <div className="tw-p-0">

                            <TableContainer
                                columns={EmergencyContactDetailsColumns || []}
                                data={
                                    getEmployeeByIdResp && getEmployeeByIdResp.employeeEmergencyDetails
                                        ? getEmployeeByIdResp.employeeEmergencyDetails
                                        : []
                                }
                                divClass="tw-overflow-x-auto tw-mb-1"
                                theadClass="tw-text-gray-500 tw-align-middle"
                            />

                            {canCreateAndUpdate && <div className="tw-pl-2 tw-pt-2">
                                <Button
                                    type="button"
                                    variant="primary"
                            onClick={toggleAddEmergencyContactModal}
                                >
                                    Add Contact Number
                                </Button>
                            </div>}

                        </div>
                    </div>
            <ModalContainerUpdated
            id="add-emergency-contact-modal"
            isOpen={addEmergencyContactModalState.showModal}
            toggle={toggleAddEmergencyContactModal}
            modalTitle={`${addEmergencyContactModalState.editData?'Edit':'Add'} Emergency Contact`}
            modalSize="md"
                >

                        <AddEmergencyContactModal
                            isOpen={addEmergencyContactModalState.showModal}
                            toggle={toggleAddEmergencyContactModal}
                            modalTitle={`${addEmergencyContactModalState.editData ? 'Edit' : 'Add'} Emergency Contact`}
                            employeeId={employeeId}
                            instituteId={instituteId}
                            branchId={branchId}
                            editBranchDetails={""}
                            editData={addEmergencyContactModalState.editData}
                            data={getEmployeeByIdResp}
                        />
                    </ModalContainerUpdated>
                </AccordionBody>
            </div>
        </>
    )
}