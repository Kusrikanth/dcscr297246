import React, { useMemo, useState, useCallback, useEffect, useRef } from "react";
import { shallowEqual } from "react-redux";
import { UncontrolledTooltip } from "reactstrap";
//Common Component
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import TableContainer from "../../../../Components/Common/TableContainer";
import { ModalComponent, ModalContainerUpdated, SearchInput, SelectInput, TextInput } from "../../../../Components/Common";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
//Helper
import { generateColumns, ignoredKeys } from "./helper";
//Icon
import ExportIcon from "../../../../assets/imagesdps/common_icon/export_icon.svg";
import classnames from "classnames";
//Images & icons
import ImportEmployeeModal from "../ImportEmployeeModal";

//Action Generator
import { generateActionPayload } from "../../../../utility/reduxutility";
import { csvExportHndlr, getSortingKeys } from "../../../../utility/commonutility";
import { exportEmployeeDataAct, exportOtherEmployeeDataAct, getAllCompaniesListAct, getOtherEmployeesListAct } from "../../../../store/directory/employeemanagement/employeemanagementactions";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
//Interface & Types
import { IPaginationState } from "../../../../Components/Common/Pagination";
import ExportModal from "../../StudentManagement/ExportModal";
import { useFilterState } from "../../../../hooks/filterhook";
import { useModal } from "../../../../hooks/modalhook";
import { getEmployeeStatusAct } from "../../../../store/masterdata/masterdataactions";
import { searchInputOptions } from "../helper";
import { EyeIcon } from "@hugeicons-pro/core-stroke-standard";
import { HugeiconsIcon } from "@hugeicons/react";
import Button from "../../../../Components/Common/Button";


const initialValues = {
    employeeName: "",
    companyId: "",
    statusId: "",
};

const OtherEmployeeManagement = () => {

    const { closeModal: closeExportExcelModal, modalState: exportExcelState, openModal: openExportExcelModal } = useModal();

    const history = useHistory();
    const { showClearFilterState, count, advanceFilterChange } = useFilterState()
    const [importEmployeeState, setImportEmployeeState] = useState({
        showModal: false
    });

    const paginationDetailRef = useRef<IPaginationState>({
        pageNo: 0,
        pageSize: 10,
    });
    const [searchStudentState, setSearchStudentState] = useState("global");
    const sortingRef = useRef(undefined);

    const dispatch = useAppDispatch();

    const companyList = () => {
        dispatch(getAllCompaniesListAct(generateActionPayload("get_all_complanies", undefined, {
            instituteId,
            pageNo: 0, pageSize: 100
        })));
    };

    const { otherEmployeesListResp, exportOtherEmployeeDataResp,
        currentInstIdResp: instituteId, currentBranchIdResp: branchId,
        loggedInUserRole, virtualRoleResp, branchListResp, employeeStatusResp, employeeManagementErrorResp, getAllCompaniesllListResp, showApiLoader } =
        useAppSelector(({ directoryEmployee, appData, branch, masterData, globalData }) => ({
            otherEmployeesListResp: directoryEmployee.otherEmployeesListResp,
            masterDataErrorResp: masterData.masterDataErrorResp,
            exportOtherEmployeeDataResp: directoryEmployee.exportOtherEmployeeDataResp,
            currentInstIdResp: appData.currentInstIdResp,
            employeeStatusResp: masterData.employeeStatusResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            loggedInUserRole: appData.loggedInUserRole,
            virtualRoleResp: appData.virtualRoleResp,
            branchListResp: branch.branchListResp,
            getAllCompaniesllListResp: directoryEmployee.getAllCompaniesllListResp,
            employeeManagementErrorResp: directoryEmployee.employeeManagementErrorResp,
            showApiLoader: globalData.showApiLoader,
        }), shallowEqual);

    const showInstituteAdminUI = loggedInUserRole === 'INSTITUTE_ADMIN' && !virtualRoleResp;
    const canCreateAndUpdate = useMemo(() => {
        if (loggedInUserRole === 'INSTITUTE_ADMIN') {
            return !!virtualRoleResp;
        }
        return loggedInUserRole !== 'ADM_CONS' && loggedInUserRole !== 'ADM_HEAD';
    }, [loggedInUserRole, virtualRoleResp]);
    const canExport = useMemo(() => {
        return loggedInUserRole !== 'ADM_CONS' && loggedInUserRole !== 'ADM_HEAD';
    }, [loggedInUserRole, virtualRoleResp]);
    const [filterState, setFilterState] = useState(initialValues);

    const employeeManagementRespRef = useRef({
        prevEmployeeManagementErrorResp: employeeManagementErrorResp,
        prevExportOtherEmployeeDataResp: exportOtherEmployeeDataResp
    });

    useEffect(() => {
        const { prevExportOtherEmployeeDataResp, prevEmployeeManagementErrorResp } = employeeManagementRespRef.current;
        if (exportOtherEmployeeDataResp && prevExportOtherEmployeeDataResp !== exportOtherEmployeeDataResp) {
            closeExportExcelModal();
            csvExportHndlr(exportOtherEmployeeDataResp?.data, 'Other_employees')
        }
        else if (employeeManagementErrorResp && prevEmployeeManagementErrorResp !== employeeManagementErrorResp) {
            const { details } = employeeManagementErrorResp;
            toast.error(details);
        }
        employeeManagementRespRef.current.prevEmployeeManagementErrorResp = employeeManagementErrorResp;
        employeeManagementRespRef.current.prevExportOtherEmployeeDataResp = exportOtherEmployeeDataResp;
    }, [exportOtherEmployeeDataResp, employeeManagementErrorResp]);


    useEffect(() => {
        if (instituteId) {
            getEmployeeApiCall();
            companyList();
        }
        dispatch(getEmployeeStatusAct(generateActionPayload("get_employee_status")))
    }, [instituteId])

    function addEmployeeHndlr() {
        history.push("/other-employee/add-other-employee");
    }

    function paginationHndlr(paginationInfo: any) {
        paginationDetailRef.current = paginationInfo;
        getEmployeeApiCall();
    }

    function onSearchHandler(name: string, value: any) {
        paginationDetailRef.current.pageNo = 0;
        setSearchStudentState((prev) => {
            const updatedFilterType = prev;
            setFilterState((prevState) => {
                const updatedState = {
                    ...prevState,
                    employeeName: value,
                    filterTypeName: updatedFilterType
                };
                getEmployeeApiCall(updatedState);
                return updatedState;
            });
            return updatedFilterType;
        });
    }

    function onChangeHandler(name: string, id: any, item: any) {
        setSearchStudentState(id);
        paginationDetailRef.current.pageNo = 0;
        setFilterState((prevState) => {
            const updatedState = {
                ...prevState,
                filterTypeName: id,
                employeeName: ""
            };
            getEmployeeApiCall(updatedState);
            return updatedState;
        });
    }

    const onChangeFilterHndlr = (event: { target: { name: any; value: any; }; }) => {
        const { name, value } = event.target;
        paginationDetailRef.current.pageNo = 0;
        setFilterState((prevState: any) => ({ ...prevState, [name]: value }));
        getEmployeeApiCall({ [name]: value });
        advanceFilterChange({ keys: { ...filterState, [name]: value }, ignoredKeys })
    }

    function getEmployeeApiCall(otherProps?: any) {
        const sortingParams = getSortingKeys(sortingRef.current, true);
        const params = {
            instituteId, branchId,
            ...filterState, ...otherProps,
            ...paginationDetailRef.current,
            ...sortingParams
        };
        dispatch(getOtherEmployeesListAct(generateActionPayload("get_other_employees", undefined, params)));
    }
    const toggleImportEmpModalHndlr = useCallback((apiCall?: boolean) => {
        setImportEmployeeState((prevState: any) => ({ ...prevState, showModal: false, }))
    }, []);

    function editEmployeeHndlr(event: any) {
        const employeeId = event.currentTarget.getAttribute("data-id");
        if (employeeId)
            history.push(`/other-employee/edit-employee/${employeeId}`);
    }

    const menuOptions = useMemo((): any[] => {
        return ([{
            id: "view-employee-info",
            actionIcon: <HugeiconsIcon icon={EyeIcon} className="text-muted" size={18} />,
            actionName: "View Employee Info",
            onClickHndlr: editEmployeeHndlr,
        }])
    }, [otherEmployeesListResp]);

    function submitHndlr(password: any) {
        const params = { instituteId, branchId, ...filterState, };
        dispatch(exportOtherEmployeeDataAct(generateActionPayload("export_other_employee_data", undefined, params, {
            responseType: 'blob'
        })));
    }


    function clearFilterHndlr() {
        paginationDetailRef.current.pageNo = 0;
        setFilterState({ ...initialValues });
        getEmployeeApiCall({ ...initialValues });
        advanceFilterChange({ keys: { ...initialValues }, ignoredKeys })
    }

    function sortingHandler(sortingKeys: any) {
        if (sortingRef.current && sortingRef.current !== sortingKeys) {
            sortingRef.current = sortingKeys;
            getEmployeeApiCall();
        } else {
            sortingRef.current = sortingKeys;
        }
    }

    const employeeColumns = useMemo(() => {
        const columns = generateColumns(menuOptions)
        if (showInstituteAdminUI) {
            return columns.filter(item => item.accessor !== 'actions');
        }
        return columns.filter(item => item.accessor !== 'branchName');
    }, [otherEmployeesListResp, showInstituteAdminUI]),
        { data: employeeList, pageNumber, totalPages, totalElements } = otherEmployeesListResp || {};

    return (
        <>
            <div className="page-content">
                <div className="container-fluid">
                    <BreadCrumb title="Other Employee" pageTitle="HRMS" />

                    <div className="tw-mb-5">
                        <div className="tw-bg-white tw-rounded-xl tw-shadow-sm tw-border tw-border-gray-200">

                            {/* Header */}
                            <div className="tw-px-6 tw-py-3 tw-border-b tw-border-gray-200">
                                <div className="tw-flex tw-items-center tw-justify-between">

                                    <h4 className="tw-text-[16px] tw-font-[600] tw-text-gray-800 text-align-center tw-mb-0">
                                        Other Employees
                                    </h4>

                                    <div className="tw-flex tw-items-center tw-gap-3">

                                        {canCreateAndUpdate && (
                                            <Button
                                                variant="primary"
                                                onClick={addEmployeeHndlr}
                                            >
                                                <i className="ri-add-line"></i>
                                                Add Employee
                                            </Button>
                                        )}

                                        {canExport && <Button
                                            variant="exportBtn"
                                            id="export-btn"
                                            onClick={openExportExcelModal}
                                            className="tw-w-10 tw-h-10 tw-flex tw-items-center tw-justify-center tw-rounded-full tw-bg-blue-50 hover:tw-bg-blue-100 tw-transition"
                                        >
                                            <img src={ExportIcon} className="tw-w-5 tw-h-5" />
                                        </Button>}

                                    </div>
                                </div>
                            </div>

                            <div className="tw-p-0">

                                <div className="tw-px-6 tw-py-4">
                                    <div className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-12 tw-gap-4">
                                        <div className="lg:tw-col-span-5">
                                            <SearchInput
                                                hideDefaultSelect
                                                name="employeeName"
                                                value={searchStudentState}
                                                menuItems={searchInputOptions}
                                                idKey="id"
                                                labelName="Search With"
                                                searchHandler={onSearchHandler}
                                                onChange={onChangeHandler}
                                                renderSelectedValue={(item: any) => item?.name}
                                                renderOptions={(item: any) => item?.name}
                                            />
                                        </div>

                                        <div className="lg:tw-col-span-3">
                                            <SelectInput
                                                name="companyId"
                                                value={filterState.companyId}
                                                onChange={onChangeFilterHndlr}
                                                menuItems={
                                                    (Array.isArray(getAllCompaniesllListResp?.data) &&
                                                        getAllCompaniesllListResp?.data) || []
                                                }
                                                valueKey="companyId"
                                                textKey="companyName"
                                                formgroupClassName="tw-mb-0"
                                                labelText="Company Name"
                                                floatingLabel
                                            />
                                        </div>
                                        <div className="lg:tw-col-span-3">
                                            <SelectInput
                                                name="statusId"
                                                value={filterState.statusId}
                                                onChange={onChangeFilterHndlr}
                                                formgroupClassName="tw-mb-0"
                                                labelText="Status"
                                                menuItems={employeeStatusResp}
                                                valueKey="id"
                                                textKey="empStatusName"
                                                floatingLabel
                                            />
                                        </div>
                                        <div className="lg:tw-col-span-1 tw-flex tw-items-center tw-justify-end">
                                            {showClearFilterState && (
                                                <Button
                                                    type="button"
                                                    onClick={clearFilterHndlr}
                                                    variant="wrong"
                                                >
                                                    Clear filter
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <TableContainer
                                    columns={employeeColumns}
                                    data={Array.isArray(employeeList) ? employeeList : []}
                                    divClass="tw-overflow-x-auto tw-mb-4"
                                    tableClass="tw-min-w-full"
                                    theadClass="tw-bg-gray-100 tw-text-gray-600 tw-align-middle"
                                    showPagination={true}
                                    totalPages={totalPages}
                                    totalRecords={totalElements}
                                    callbackPaginationHndlr={paginationHndlr}
                                    currentPageNumber={pageNumber}
                                    manualSorting={true}
                                    sortingHandler={sortingHandler}
                                />

                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <ModalContainerUpdated
                id="employee-export-modal"
                isOpen={exportExcelState.showModal}
                toggle={closeExportExcelModal}
                modalTitle="Export Employees Data"
                modalSize="md"
            >
                <ExportModal
                    isOpen={exportExcelState.showModal}
                    toggle={closeExportExcelModal}
                    instituteId={instituteId}
                    branchId={branchId}
                    submitHndlr={submitHndlr}
                    feature="hrms"
                    subFeature="employee_management"
                    remarksText="Enter remarks to export employees data?"
                />
            </ModalContainerUpdated>
            <ModalComponent
                id="add-form"
                formId="handle-form-submit"
                modalSize="xl"
                modalTitle="Import Employee"
                modalBodyClass="p-0"
                isOpen={importEmployeeState.showModal}
                toggle={toggleImportEmpModalHndlr}
                cancelHndlr={toggleImportEmpModalHndlr}
                hideFooter={true}
            >
                <ImportEmployeeModal
                />
            </ModalComponent>
        </>
    )
}


export default OtherEmployeeManagement;