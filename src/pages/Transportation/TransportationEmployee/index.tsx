import { useFormik } from "formik";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    ModalContainerUpdated, SelectInput, TextInput,
} from "../../../Components/Common";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import TableContainer from "../../../Components/Common/TableContainer";
import { default as DeleteIconSvg } from "../../../assets/imagesdps/academics/DeleteIconSvg.svg?react";
import { ConfirmationModal } from "../../../Components/Common";

import {
    employeeActiveStatus,
    employeeTypes,
    generateColumns,
} from "./helper";
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
import { shallowEqual } from "react-redux";

//Action Generator
import { generateActionPayload } from "../../../utility/reduxutility";
import { useModal } from "../../../hooks/modalhook";
import { toast } from "react-toastify";
import { deleteTransportEmployeeAct, exportTransportEmployeeAct, getEmployeeTypeListAct, getTransportEmployeesAct, updateTransempActinactAct } from "../../../store/transportation/TransportationEmployee/transportationemployeeactions";
import { debounce, downloadExcelFile } from "../../../utility/commonutility";
import { useHistory } from "react-router-dom";
import { Delete02StrokeStandard, PencilEdit02Icon, SquareUnlock02Icon } from "@hugeicons-pro/core-stroke-standard";
import { HugeiconsIcon } from "@hugeicons/react";
import ExportModal from "../../Directory/StudentManagement/ExportModal"
import Button from "../../../Components/Common/Button";

const TransportationEmployee = () => {
    const history = useHistory();
    const [filterState, setFilterState] = useState({
        searchString: '',
        employeeType: '',
        activeStatus: ''
    });
    const { modalState: delTransEmpModalState, closeModal: closeTransEmpModalHndlr,
        openModal: openAlamanacModalHndlr
    } = useModal();
    const { modalState: activeInactModalState, closeModal: closeActiveInactModalHndlr,
        openModal: openActiveInactModalState
    } = useModal();
    const [exportExcel, setExportExcel] = useState({ showModal: false, })
    const toggleExportExcelModal = () => {
        setExportExcel((prevState: any) => ({
            ...prevState,
            showModal: !prevState.showModal,
        }));
    };

    const paginationRef = useRef<any>({
        pageNo: 0,
        pageSize: 10,
    });

    const dispatch = useAppDispatch();
    const {
        currentInstIdResp: instituteId, currentBranchIdResp: branchId,
        transportEmployeesResp,
        updateTransempActinactResp,
        deleteTransportEmployeeResp,
        getEmployeeTypeListResp,
        exportTransportEmployeeResp,
        transportEmployeeErrorResp } =
        useAppSelector(({ appData, transportEmployee }) => ({
            currentInstIdResp: appData.currentInstIdResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            transportEmployeesResp: transportEmployee.transportEmployeesResp,
            deleteTransportEmployeeResp: transportEmployee.deleteTransportEmployeeResp,
            updateTransempActinactResp: transportEmployee.updateTransempActinactResp,
            getEmployeeTypeListResp: transportEmployee.getEmployeeTypeListResp,
            exportTransportEmployeeResp: transportEmployee.exportTransportEmployeeResp,
            transportEmployeeErrorResp: transportEmployee.transportEmployeeErrorResp
        }), shallowEqual);

    const alamanacRef = useRef({
        prevDeleteTransportEmployeeResp: deleteTransportEmployeeResp,
        prevUpdateTransempActinactResp: updateTransempActinactResp,
        prevExportTransportEmployeeResp: exportTransportEmployeeResp,
        prevTransportEmployeeErrorResp: transportEmployeeErrorResp
    })

    useEffect(() => {
        const { prevDeleteTransportEmployeeResp, prevUpdateTransempActinactResp, prevExportTransportEmployeeResp, prevTransportEmployeeErrorResp } = alamanacRef.current;
        if (deleteTransportEmployeeResp && prevDeleteTransportEmployeeResp !== deleteTransportEmployeeResp) {
            toast.success("Transport employee deleted successfully.");
            closeTransEmpModalHndlr();
            getTransportEmployeeApicall();
        } else if (updateTransempActinactResp && prevUpdateTransempActinactResp !== updateTransempActinactResp) {
            toast.success("Transport employee updated successfully.");
            closeActiveInactModalHndlr();
            getTransportEmployeeApicall();
        } else if (exportTransportEmployeeResp && prevExportTransportEmployeeResp !== exportTransportEmployeeResp) {
            toast.success("Transport employee exported successfully.");
            downloadExcelFile(exportTransportEmployeeResp, "Transport_Employee_List")
            setExportExcel((prev: any) => ({ ...prev, showModal: !prev.showModal }))
        }
        else if (transportEmployeeErrorResp && prevTransportEmployeeErrorResp !== transportEmployeeErrorResp) {
            const { message, details } = transportEmployeeErrorResp;
            toast.error(message || details || "Something went wrong.");
        }
        alamanacRef.current.prevDeleteTransportEmployeeResp = deleteTransportEmployeeResp;
        alamanacRef.current.prevUpdateTransempActinactResp = updateTransempActinactResp;
        alamanacRef.current.prevExportTransportEmployeeResp = exportTransportEmployeeResp;
        alamanacRef.current.prevTransportEmployeeErrorResp = transportEmployeeErrorResp;
    }, [deleteTransportEmployeeResp, updateTransempActinactResp, exportTransportEmployeeResp, transportEmployeeErrorResp]);

    function getEmployeeTypeList() {
        dispatch(getEmployeeTypeListAct(generateActionPayload("get_employee_type_list", undefined, undefined)))
    }

    const exportExcelHndler = () => {
        dispatch(exportTransportEmployeeAct(generateActionPayload("export_transport_employee", { branchId, ...filterState }, undefined, {
            responseType: 'blob'
        })));
    }

    useEffect(() => {
        if (branchId) {
            getEmployeeTypeList();
            getTransportEmployeeApicall();
        }
    }, [branchId, instituteId]);

    const menuOptions = useMemo(
        () => [
            {
                id: "edit",
                actionName: "Edit",
                actionIcon: <HugeiconsIcon icon={PencilEdit02Icon} className="me-2 text-muted" size={18} />,
                onClickHndlr: (event: React.MouseEvent<HTMLElement>) => {
                    let transportEmployeeId = event.currentTarget.getAttribute('data-id');
                    if (transportEmployeeId) {
                        history.push(`/transportation-employee/edit/${transportEmployeeId}`);
                    }
                },
            },
            {
                id: "delete",
                actionIcon: <HugeiconsIcon icon={Delete02StrokeStandard} className="me-2 text-danger" size={18} />,
                actionName: "Delete",
                onClickHndlr: (event: React.MouseEvent<HTMLElement>) => {
                    const transportEmployeeId = event.currentTarget.getAttribute("data-id");
                    openAlamanacModalHndlr(transportEmployeeId);
                },
            },
            {
                id: "activate",
                actionIcon: <HugeiconsIcon icon={SquareUnlock02Icon} className="me-2 text-success" size={18} />,
                actionName: "Activate",
                onClickHndlr: (event: React.MouseEvent<HTMLElement>) => {
                    const transportEmployeeId = event.currentTarget.getAttribute("data-id");
                    if (transportEmployeeId) {
                        openActiveInactModalState({ employeeId: transportEmployeeId, type: "Activate", status: 'ACTIVE' });
                    }
                },
            },
            {
                id: "deactivate",
                actionIcon: <HugeiconsIcon icon={SquareUnlock02Icon} className="me-2 text-danger" size={18} />,
                actionName: "De-Activate",
                onClickHndlr: (event: React.MouseEvent<HTMLElement>) => {
                    const transportEmployeeId = event.currentTarget.getAttribute("data-id");
                    if (transportEmployeeId) {
                        openActiveInactModalState({ employeeId: transportEmployeeId, type: "De-Activate", status: 'INACTIVE' });
                    }
                },
            },
        ],
        [transportEmployeesResp]
    );

    function getTransportEmployeeApicall(otherProps?: any) {
        const payload = {
            branchId,
            ...filterState,
            ...otherProps,
            ...paginationRef.current
        }
        dispatch(getTransportEmployeesAct(generateActionPayload("get_transport_employee", undefined, payload)));
    }

    function search(value: string) {
        getTransportEmployeeApicall({ searchString: value });
    }
    const debounceFun = useCallback(debounce(search, 200), [transportEmployeesResp]);
    function onSearchHandler(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        setFilterState(prevState => ({ ...prevState, [name]: value }));
        paginationRef.current.pageNo = 0;
        debounceFun(value);
    }

    function onChangeFilterHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        setFilterState(prevState => ({ ...prevState, [name]: value }));
        getTransportEmployeeApicall({ [name]: value });
    }

    function paginationHndlr(paginationInfo: any) {
        paginationRef.current = paginationInfo;
        getTransportEmployeeApicall();
    }


    function confirmDeleteTransporEmpHandler() {
        const { modalData } = delTransEmpModalState;
        dispatch(deleteTransportEmployeeAct(generateActionPayload("delete_transport_employee",
            { employeeId: modalData })));
    }
    function confirmActinactTransportEmpHandler() {
        const { modalData } = activeInactModalState,
            { employeeId, status } = modalData;
        if (employeeId && status) {
            dispatch(updateTransempActinactAct(generateActionPayload("actinact_transport_employee",
                { employeeId, status: status })));
        }
    }

    function addTransportEmpHandler() {
        history.push('/transportation-employee/add');
    }

    const columns = useMemo(() => generateColumns(menuOptions), [transportEmployeesResp]);
    const { content: employeeList, totalPages, totalElements, pageNumber } = transportEmployeesResp || {};
    return (
        <>
            <div className="page-content free_payment_record_wrapper">
                <div className="container-fluid">
                    <BreadCrumb pageTitle="Transportation" />


                    <div className="tw-bg-white tw-rounded-lg tw-shadow tw-mb-6">
                        <div className="tw-flex tw-items-center tw-py-2 tw-px-3 tw-border-b">
                            <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                                Transportation Employee Management
                            </h4>

                            <div className="tw-ml-auto tw-flex tw-gap-2">
                                <Button
                                    variant="primary"
                                    onClick={addTransportEmpHandler}
                                >
                                    <i className="ri-add-line"></i>
                                    <span>Add New</span>
                                </Button>
                                <Button variant="info" onClick={() => toggleExportExcelModal()} >
                                    <div className="d-flex align-items-center text-white">
                                        <span><i className="ri-add-line me-1" /></span>
                                        <span>Export</span>
                                    </div>
                                </Button>
                            </div>
                        </div>

                        <div className="tw-p-0">
                            <div className="tw-py-3 tw-px-3">
                                <div className="tw-grid tw-grid-cols-12 tw-gap-3">
                                    <div className="tw-col-span-12 lg:tw-col-span-4">
                                        <div className="search-box">
                                            <TextInput
                                                name="searchString"
                                                value={filterState.searchString}
                                                onChange={onSearchHandler}
                                                formgroupClassName="tw-mb-0"
                                                placeHolder="Search"
                                                labelText="Search"
                                                floatingLabel
                                            />
                                            <i className="ri-search-line search-icon"></i>
                                        </div>
                                    </div>

                                    <div className="tw-col-span-12 lg:tw-col-span-6 xl:tw-col-span-2">
                                        <SelectInput
                                            name="employeeType"
                                            value={filterState.employeeType}
                                            onChange={onChangeFilterHndlr}
                                            formgroupClassName="tw-mb-0"
                                            menuItems={getEmployeeTypeListResp && Array.isArray(getEmployeeTypeListResp) ? getEmployeeTypeListResp : []}
                                            valueKey="employeeType"
                                            textKey="employeeType"
                                            labelText="Employee Type"
                                            floatingLabel
                                        />
                                    </div>

                                    <div className="tw-col-span-12 lg:tw-col-span-6 xl:tw-col-span-2">
                                        <SelectInput
                                            name="activeStatus"
                                            value={filterState.activeStatus}
                                            onChange={onChangeFilterHndlr}
                                            menuItems={employeeActiveStatus}
                                            formgroupClassName="tw-mb-0"
                                            valueKey="id"
                                            textKey="name"
                                            labelText="Status"
                                            floatingLabel
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="tw-overflow-x-auto tw-mb-3">
                                <TableContainer
                                    columns={columns}
                                    data={Array.isArray(employeeList) ? employeeList : []}
                                    divClass="tw-w-full"
                                    theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
                                    showPagination={true}
                                    totalPages={totalPages}
                                    totalRecords={totalElements}
                                    callbackPaginationHndlr={paginationHndlr}
                                    currentPageNumber={pageNumber || 0}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ConfirmationModal
                id="delete-driver-modal"
                isOpen={delTransEmpModalState.showModal}
                confirmMessage="Are you sure you want to delete this transport employee?"
                cancelHndlr={closeTransEmpModalHndlr}
                confirmHndlr={confirmDeleteTransporEmpHandler}
                showImgIcon={true}
                iconType="reject"
            />
            <ConfirmationModal
                id="active-inactive-modal"
                isOpen={activeInactModalState.showModal}
                confirmMessage={`Are you sure you want to ${activeInactModalState.modalData?.type} this transport employee?`}
                cancelHndlr={closeActiveInactModalHndlr}
                confirmHndlr={confirmActinactTransportEmpHandler}
                btnClassName={activeInactModalState.modalData?.status === 'ACTIVE' ? 'btn w-sm btn-success' : ''}
                showImgIcon={true}
                iconType={activeInactModalState.modalData?.status === 'ACTIVE' ? 'approve' : 'reject'}
            />
            <ModalContainerUpdated
                id="export-transport-concession-modal"
                isOpen={exportExcel.showModal}
                toggle={toggleExportExcelModal}
                modalTitle="Export Transport Employee Details"
                modalSize="md"
            >
                <ExportModal
                    isOpen={exportExcel.showModal}
                    toggle={toggleExportExcelModal}
                    instituteId={instituteId}
                    branchId={branchId}
                    submitHndlr={exportExcelHndler}
                    feature="transportation"
                    subFeature="transportation_employee_management"
                    remarksText="Enter remarks to export transport concession details?"
                />
            </ModalContainerUpdated>
        </>
    );
};

export default TransportationEmployee;
