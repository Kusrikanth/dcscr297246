import React, { useMemo, useRef, useEffect, useState } from 'react';
import BreadCrumb from '../../../../Components/Common/BreadCrumb';
import { ModalContainerUpdated, SelectInput, TextIconInput, TextInput } from '../../../../Components/Common';
import TableContainer from '../../../../Components/Common/TableContainer';
import { useAppDispatch, useAppSelector } from '../../../../hooks/storehook';
import { shallowEqual } from 'react-redux';
import { generateColumns } from './helper';
import { generateActionPayload } from '../../../../utility/reduxutility';
import { getAdmissionFacilitysListAct, editAdmissionFacilitysListAct, getAdmissionFacilitysListByIdAct, saveAdmissionFacilitysListAct, deleteAdmissionFacilitysListAct } from '../../../../store/FrontDesk/Settings/admissionAvailability/admissionavailabilityaction';
import { setAdmissionFacilitysListById } from '../../../../store/FrontDesk/Settings/admissionAvailability/admissionavailabilityslice';
import { IOptionsHrtl } from '../../../../Components/Common/MenuOptions';
import { Delete02StrokeStandard, PencilEdit02Icon, PlusSignIcon } from '@hugeicons-pro/core-stroke-standard';
import { HugeiconsIcon } from '@hugeicons/react';
import { toast } from 'react-toastify';
import { ConfirmationModal } from '../../../../Components/Common/ConfirmationModal';
import { useModal } from '../../../../hooks/modalhook';
import EditAdmitionFacilityModal from './EditAdmissionFacilityModal';
import { getInstDepartmentAct } from '../../../../store/mastersettings/instituteinfo/instituteinfoactions';
import { getHrmDepartmentsListAct } from '../../../../store/masterdata/masterdataactions';
import Button from '../../../../Components/Common/Button';

const AdmissionFacility = () => {
    const [filterState, setFilterState] = useState({ departmentId: "" });
    const dispatch = useAppDispatch();

    const { closeModal: closeAddEditModal, modalState: addEditModalState, openModal: openAddEditModal } = useModal();
    const { closeModal: closeDeleteModal, modalState: deleteModalState, openModal: openDeleteModal } = useModal();

    const {
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        getAdmissionFacilitysListResp,
        hrmDepartmentResp,
        delAdmissionFacilityRequestResp,
        academicAvailabilityErrorResp
    } = useAppSelector(
        ({ admissionAvailabilityRequest, masterData, appData }) => ({
            getAdmissionFacilitysListResp: admissionAvailabilityRequest.getAdmissionFacilitysListResp,
            hrmDepartmentResp: masterData.hrmDepartmentResp,
            delAdmissionFacilityRequestResp: admissionAvailabilityRequest.delAdmissionFacilityRequestResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            academicAvailabilityErrorResp: admissionAvailabilityRequest.academicAvailabilityErrorResp,
        }),
        shallowEqual
    );

    const facilityApiRef = useRef({
        prevDeleteResp: delAdmissionFacilityRequestResp,
        prevAcademicAvailabilityErrorResp: academicAvailabilityErrorResp,
    });

    useEffect(() => {
        const { prevDeleteResp, prevAcademicAvailabilityErrorResp } = facilityApiRef.current;
        if (delAdmissionFacilityRequestResp && prevDeleteResp !== delAdmissionFacilityRequestResp) {
            toast.success("Facility deleted successfully!");
            closeDeleteModal();
            getAdmissionFacilitysList();
        }
        else if (academicAvailabilityErrorResp && prevAcademicAvailabilityErrorResp !== academicAvailabilityErrorResp) {
            const { details } = academicAvailabilityErrorResp || {}
            toast.error(details || "Something went wrong")
        }
        facilityApiRef.current.prevDeleteResp = delAdmissionFacilityRequestResp;
        facilityApiRef.current.prevAcademicAvailabilityErrorResp = academicAvailabilityErrorResp;
    }, [delAdmissionFacilityRequestResp, academicAvailabilityErrorResp]);


    const handleSaveFacility = (data: any) => {
        if (addEditModalState.modalData) {
            const { id } = addEditModalState.modalData;
            const payload = { facilityName: data.facilityName };
            dispatch(editAdmissionFacilitysListAct(generateActionPayload("edit_admission_facility_by_id", { id }, payload)));
        } else {
            const payload = {
                instituteId: instituteId,
                branchId: branchId,
                facilities: [data.facilityName]
            };
            dispatch(saveAdmissionFacilitysListAct(generateActionPayload("save_admission_facility", undefined, payload)));
        }
    };

    const handleConfirmDelete = () => {
        if (deleteModalState.modalData) {
            const id = deleteModalState.modalData;
            dispatch(deleteAdmissionFacilitysListAct(generateActionPayload("delete_admission_facility", { id })));
        }
    };

    const menuOptions = useMemo((): IOptionsHrtl[] => ([
        {
            id: "edit",
            actionIcon: <HugeiconsIcon icon={PencilEdit02Icon} className="me-2 text-muted" size={16} />,
            actionName: "Edit",
            onClickHndlr: (event: any) => {
                const id = event.currentTarget.getAttribute("data-id");
                if (id) {
                    openAddEditModal({ id });
                }
            },
        },
        {
            id: "delete",
            actionIcon: <HugeiconsIcon icon={Delete02StrokeStandard} className="me-2 text-danger" size={16} />,
            actionName: "Delete",
            onClickHndlr: (event: any) => {
                const id = event.currentTarget.getAttribute("data-id");
                if (id) {
                    openDeleteModal(id);
                }
            },
        },
    ]), [getAdmissionFacilitysListResp]);
    const columns = useMemo(() => generateColumns(menuOptions), [getAdmissionFacilitysListResp, menuOptions]);

    const getAdmissionFacilitysList = (otherProps?: any) => {
        let payload = { branchId: branchId, ...filterState, ...otherProps };
        dispatch(getAdmissionFacilitysListAct(generateActionPayload("get_admission_facility_list", undefined, payload)));
    };

    useEffect(() => {
        if (branchId) {
            getAdmissionFacilitysList();
        }
    }, [branchId]);

    useEffect(() => {
        if (instituteId) {
            const payload = { instituteId, sortBy: "departmentName", orderBy: "asc", isFeeDepartment: 0, pageNo: 0, pageSize: 1500 };
            dispatch(getHrmDepartmentsListAct(generateActionPayload("get_hrm_department", undefined, payload)));
        }
    }, [instituteId]);


    function toggleSettingsHandler(apiCall?: boolean) {
        if (typeof (apiCall) === 'boolean') {
            getAdmissionFacilitysList();
        }
        closeAddEditModal();
    }

    function onChangeFilterHandler(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        setFilterState(prevState => ({ ...prevState, [name]: value }));
        getAdmissionFacilitysList({ [name]: value });
    }

    return (
        <>
            <div className="page-content free_payment_record_wrapper">
                <div className="container-fluid">
                    <BreadCrumb title="Admissions" pageTitle="Admissions" />
                    <div className="tw-bg-white tw-border tw-border-gray-200 tw-rounded-lg tw-shadow-sm">
                        <div className="tw-p-0 tw-border-b tw-border-gray-200">
                            <div className="tw-flex tw-items-center tw-px-4 tw-py-3">
                                <div className="tw-w-1/2">
                                    <h4 className="tw-text-base tw-font-semibold tw-mb-0 tw-grow">Admission Facility</h4>
                                </div>
                                <div className="tw-w-auto tw-ml-auto">
                                    <Button
                                        variant="primary"
                                        onClick={() => {
                                            openAddEditModal();
                                        }}
                                    >
                                        <i className="ri-add-line tw-mr-2" />
                                        Add Facility
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className="tw-p-0">
                            <div className="tw-py-3 tw-px-3">
                                <div className="tw-flex tw-flex-wrap tw--mx-3 tw-gap-y-3">
                                    <div className="tw-w-1/2 lg:tw-w-1/4 tw-px-3">
                                        <SelectInput
                                            floatingLabel
                                            name="departmentId"
                                            formgroupClassName='tw-mb-0'
                                            labelText="Department Name"
                                            labelClass="required"
                                            value={filterState.departmentId}
                                            onChange={onChangeFilterHandler}
                                            menuItems={hrmDepartmentResp}
                                            textKey='departmentName'
                                            valueKey='hrmDeptId'
                                        />
                                    </div>
                                </div>
                            </div>
                            <TableContainer
                                columns={columns || []}
                                data={Array.isArray(getAdmissionFacilitysListResp) ? getAdmissionFacilitysListResp : []}
                                tableClass="tw-mb-0"
                                divClass="table-responsive tw-mb-0"
                                theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
                                showCheckbox={false}
                                showPagination={false}
                            />
                        </div>
                    </div>
                    <ModalContainerUpdated
                        id="add-edit-admission-facility-modal"
                        isOpen={addEditModalState.showModal}
                        toggle={closeAddEditModal}
                        modalTitle={addEditModalState.modalData ? 'Edit Admission Facility' : 'Add Admission Facility'}
                        modalSize="md"
                    >
                        <EditAdmitionFacilityModal
                            instituteId={instituteId}
                            branchId={branchId}
                            facilityId={addEditModalState.modalData?.id}
                            show={addEditModalState.showModal}
                            mode={addEditModalState.modalData ? 'edit' : 'add'}
                            onCloseClick={toggleSettingsHandler}
                            onSave={handleSaveFacility}
                        />
                    </ModalContainerUpdated>

                    <ConfirmationModal
                        id="delete-facility-confirmation"
                        isOpen={deleteModalState.showModal}
                        cancelHndlr={closeDeleteModal}
                        confirmHndlr={handleConfirmDelete}
                        iconType="reject"
                        confirmTitle="Delete Facility"
                        confirmMessage="Are you sure you want to delete this facility? This action cannot be undone."
                        confirmBtnText="Yes, Delete It"
                        cancelBtnText="Cancel"
                    />
                </div>
            </div>
        </>
    )
}

export default AdmissionFacility;