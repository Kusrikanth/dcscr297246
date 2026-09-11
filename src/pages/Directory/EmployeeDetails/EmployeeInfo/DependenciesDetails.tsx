import { useFormik } from 'formik';
import React, { useEffect, useMemo, useState } from 'react'
import { shallowEqual, useDispatch } from 'react-redux';
import { ModalContainerUpdated, TextInput } from '../../../../Components/Common';
import TableContainer from '../../../../Components/Common/TableContainer';
import { useAppSelector } from '../../../../hooks/storehook';
import { generateDependenciesDetailsColumns, ParentsDetailsData } from './helper';
import { IAddDetailsModal, IOptionsHrtl, IPropsTypes } from './EmployeeInfoTypes';
import AddDependencyModal from './AddDependencyModal';
import { getEmployeeByIdAct } from '../../../../store/directory/employeemanagement/employeemanagementactions';
import { generateActionPayload } from '../../../../utility/reduxutility';
import { getRelationTypeAct } from '../../../../store/masterdata/masterdataactions';
import { AccordionBody, AccordionHeader } from 'reactstrap';
import Button from '../../../../Components/Common/Button';


const DependenciesDetails = ({ instituteId, branchId, employeeId, divId, canCreateAndUpdate }: any) => {
    const dispatch = useDispatch()
    const [addDependencyDetailsModalState, setAddDependencyDetailsModalState] =
        useState<IAddDetailsModal>({
            showModal: false,
            branchId: "",
            editData: undefined
        });

    const toggleAddDependencyDetailsModal = (apiCall?: any) => {
        setAddDependencyDetailsModalState((pre) => ({
            ...pre,
            showModal: !pre.showModal,
            editData: undefined
        }))
        if (typeof (apiCall) === "boolean" && apiCall) {
            dispatch(getEmployeeByIdAct(generateActionPayload("get_employee_byid", { employeeId: employeeId })));
        }
    }
    const { getEmployeeByIdResp, relationTypeListResp } = useAppSelector(
        ({ directoryEmployee, masterData }) => ({
            getEmployeeByIdResp: directoryEmployee.getEmployeeByIdResp,
            relationTypeListResp: masterData.relationTypeListResp,
        }),
        shallowEqual
    );
    const menuOptions = useMemo((): IOptionsHrtl[] => ([{
        id: "edit",
        actionIcon: <i className="text-muted ri-pencil-fill fs-16"></i>,
        actionName: "Edit",
        onClickHndlr: (e: any) => {
            const id = e.currentTarget.getAttribute("data-id");
            const data = getEmployeeByIdResp.employeeDependentDetails.find((depedenct: any) => depedenct.id === +id)

            setAddDependencyDetailsModalState(pre => ({ ...pre, showModal: true, editData: data }));

        },
    }]), [getEmployeeByIdResp]);

    useEffect(() => {
        dispatch(getRelationTypeAct(generateActionPayload("get_global_records_by_search_string", undefined, { categoryName: "RELATION", searchString: "", sortBy: "relationType", orderBy: "asc", pageNo: 0, pageSize: 100 })));
    }, [])

    const { data: RelationData } = relationTypeListResp || {};
    const parentDetailsColumns = useMemo(() => generateDependenciesDetailsColumns(menuOptions, RelationData), [getEmployeeByIdResp])


    return (<>
        <div>
            <AccordionHeader tag="h4" targetId="dependencies">
                Dependencies
            </AccordionHeader>
            <AccordionBody accordionId="dependencies">
                <div id={divId}>
                    <div className="tw-p-0">

                        <TableContainer
                            columns={parentDetailsColumns || []}
                            data={
                                getEmployeeByIdResp &&
                                    getEmployeeByIdResp.employeeDependentDetails
                                    ? getEmployeeByIdResp.employeeDependentDetails
                                    : []
                            }
                            divClass="tw-overflow-x-auto tw-mb-1"
                            theadClass="tw-text-gray-500 tw-align-middle"
                        />

                        {canCreateAndUpdate &&<div className="tw-pl-2 tw-pt-2">
                            <Button
                                variant='primary'
                                onClick={toggleAddDependencyDetailsModal}
                            >
                                Add Dependencies
                            </Button>
                        </div>}
                    </div>

                </div>
                <ModalContainerUpdated
                    id="add-dependencies-details-modal"
                    isOpen={addDependencyDetailsModalState.showModal}
                    toggle={toggleAddDependencyDetailsModal}
                    modalTitle={`${addDependencyDetailsModalState.editData ? 'Edit' : 'Add'} Depedent Details`}
                    modalSize="md"
                >
                    <AddDependencyModal
                        isOpen={addDependencyDetailsModalState.showModal}
                        toggle={toggleAddDependencyDetailsModal}

                        modalTitle={`${addDependencyDetailsModalState.editData ? 'Edit' : 'Add'} Depedent Details`}
                        employeeId={employeeId}
                        instituteId={instituteId}
                        branchId={branchId}
                        editBranchDetails={""}
                        editData={addDependencyDetailsModalState.editData}
                        data={getEmployeeByIdResp}
                    />
                </ModalContainerUpdated>
            </AccordionBody>
        </div>
    </>
    )
}

export default DependenciesDetails;
