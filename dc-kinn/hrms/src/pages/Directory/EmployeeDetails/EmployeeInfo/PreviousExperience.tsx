import { useFormik } from 'formik';
import React, { useEffect, useMemo, useState } from 'react'
import { shallowEqual, useDispatch } from 'react-redux';
import { ModalContainerUpdated, TextInput } from '../../../../Components/Common';
import TableContainer from '../../../../Components/Common/TableContainer';
import { useAppSelector } from '../../../../hooks/storehook';
import AddParentModal from './AddDependencyModal';
import { generatePreviousExperienceDetailsColumns, ParentsDetailsData } from './helper';
import { IAddDetailsModal, IOptionsHrtl, IPropsTypes } from './EmployeeInfoTypes';
import AddExperienceDetailsModal from './AddExperienceDetails';
import { getEmployeeByIdAct } from '../../../../store/directory/employeemanagement/employeemanagementactions';
import { generateActionPayload } from '../../../../utility/reduxutility';
import { AccordionBody, AccordionHeader } from 'reactstrap';
import Button from '../../../../Components/Common/Button';

const initialValues = {
    schoolStudied: "",
    curriculum: "",
    class: "",
    percentage: "",
    reasonforSeekingAdmission: "",
}

const PreviousExperience = ({ instituteId, branchId, employeeId, divId, canCreateAndUpdate }: any) => {
    const dispatch = useDispatch()
    const [addExperienceDetailsModalState, setAddExperienceDetailsModalState] =
        useState<IAddDetailsModal>({
            showModal: false,
            branchId: "",
            editData: undefined
        });

    const toggleAddExperienceDetailsModal = (apiCall?: any) => {
        setAddExperienceDetailsModalState((pre) => ({
            ...pre,
            showModal: !pre.showModal,
            editData: undefined
        }))

        if (typeof (apiCall) === "boolean" && apiCall) {
            dispatch(getEmployeeByIdAct(generateActionPayload("get_employee_byid", { employeeId: employeeId })));
        }
    }
    const { getEmployeeByIdResp, designationListResp } = useAppSelector(
        ({ directoryEmployee, masterData }) => ({
            getEmployeeByIdResp: directoryEmployee.getEmployeeByIdResp,
            designationListResp: masterData.designationListResp,
        }),
        shallowEqual
    );
    const menuOptions = useMemo((): IOptionsHrtl[] => ([{
        id: "edit",
        actionIcon: <i className="text-muted ri-pencil-fill fs-16"></i>,
        actionName: "Edit",
        onClickHndlr: (e: any) => {
            const id = e.currentTarget.getAttribute("data-id");
            const data = getEmployeeByIdResp.employeePastExperience.find((experience: any) => experience.id === +id)

            setAddExperienceDetailsModalState(pre => ({ ...pre, showModal: true, editData: data }));

        },
    }]), [getEmployeeByIdResp]);

    const { data: DesignationData } = designationListResp || {};

    const parentDetailsColumns = useMemo(() => generatePreviousExperienceDetailsColumns(menuOptions, DesignationData), [getEmployeeByIdResp])


    return (<>
    <div>
        <AccordionHeader tag = "h4" targetId="previous-experience">
            Previous Experience
        </AccordionHeader>
        <AccordionBody accordionId="previous-experience">
                <div id={divId}>
                    <div className="tw-p-0">

                        <TableContainer
                            columns={parentDetailsColumns || []}
                            data={
                                getEmployeeByIdResp &&
                                    getEmployeeByIdResp.employeePastExperience
                                    ? getEmployeeByIdResp.employeePastExperience
                                    : []
                            }
                            divClass="tw-overflow-x-auto tw-mb-1"
                            theadClass="tw-text-gray-500 tw-align-middle"
                        />

                        {canCreateAndUpdate && <div className="tw-pl-2 tw-pt-2">
                            <Button
                            variant='primary'
                                onClick={toggleAddExperienceDetailsModal}
                            >
                                Add Experience
                            </Button>
                        </div>}

                    </div>
                </div>

            <ModalContainerUpdated
            id="add-experience-details-date-modal"
            isOpen={addExperienceDetailsModalState.showModal}
            toggle={toggleAddExperienceDetailsModal}
            modalTitle={`${addExperienceDetailsModalState.editData?'Edit':'Add'} Experience Details`}
            modalSize="md"
                >

                    <AddExperienceDetailsModal
                        isOpen={addExperienceDetailsModalState.showModal}
                        toggle={toggleAddExperienceDetailsModal}
                        modalTitle={`${addExperienceDetailsModalState.editData ? 'Edit' : 'Add'} Experience Details`}
                        employeeId={employeeId}
                        instituteId={instituteId}
                        branchId={branchId}
                        editBranchDetails={""}
                        editData={addExperienceDetailsModalState.editData}
                        data={getEmployeeByIdResp}
                    />
                </ModalContainerUpdated>
            </AccordionBody>
        </div>
    </>
    )
}

export default PreviousExperience
