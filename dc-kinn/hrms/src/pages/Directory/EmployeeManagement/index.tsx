import React, { useMemo, useState, useCallback, useEffect, useRef } from "react";
import { shallowEqual } from "react-redux";
import { UncontrolledTooltip } from "reactstrap";
//Common Component
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import TableContainer from "../../../Components/Common/TableContainer";
import {
    SelectInput, ModalComponent,
    AutoSearchInput,
    ModalContainerUpdated,
    SearchInput
} from "../../../Components/Common";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
//Helper
import { generateColumns, searchInputOptions } from "./helper";
//Icon
import ExportIcon from "../../../assets/imagesdps/common_icon/export_icon.svg";
import classnames from "classnames";
//Images & icons
import Statistics from "./Statistics";
import ImportEmployeeModal from "./ImportEmployeeModal";


//Action Generator
import { generateActionPayload } from "../../../utility/reduxutility";
import { csvExportHndlr, exportCsvFile, getSortingKeys } from "../../../utility/commonutility";
import {
    getEmployeesListAct, getEmployeesStatsAct
    , getEmployeeByFilterAct, exportEmployeeDataAct
} from "../../../store/directory/employeemanagement/employeemanagementactions";
import { useParams, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { getEmployeeCategoriesAct, getEmployeeStatusAct } from "../../../store/masterdata/masterdataactions";
//Interface & Types
import { IPaginationState } from "../../../Components/Common/Pagination";
import ExportModal from "../StudentManagement/ExportModal";
import { EyeIcon } from "@hugeicons-pro/core-stroke-standard";
import { HugeiconsIcon } from "@hugeicons/react";
import Button from "../../../Components/Common/Button";


const EmployeeManagement: React.FC<any> = () => {
    const { employeeId }: any = useParams();
    const [exportModal, setExportModal] =
        useState({
            showModal: false,
        });
    const history = useHistory();
    const [showClearFilterState, setShowClearFilterState] = useState(false);
    const [importEmployeeState, setImportEmployeeState] = useState({
        showModal: false
    });

    const paginationDetailRef = useRef<IPaginationState>({
        pageNo: 0,
        pageSize: 10,
    });
    const sortingRef = useRef(undefined);

    const [searchEmployeeState, setSearchEmployeeState] = useState<any>(undefined);
    const [searchStudentState, setSearchStudentState] = useState("global");

    const dispatch = useAppDispatch();
    const { employeesListResp, employeesStatsResp,
        employeeStatusResp, employeeCategoriesResp, exportEmployeeDataResp,
        currentInstIdResp: instituteId, currentBranchIdResp: branchId,
        loggedInUserRole, virtualRoleResp, branchListResp, employeeManagementErrorResp, showApiLoader } =
        useAppSelector(({ directoryEmployee, appData, branch, masterData, globalData }) => ({
            employeesListResp: directoryEmployee.employeesListResp,
            employeesStatsResp: directoryEmployee.employeesStatsResp,
            employeeCategoriesResp: masterData.employeeCategoriesResp,
            employeeStatusResp: masterData.employeeStatusResp,
            masterDataErrorResp: masterData.masterDataErrorResp,
            exportEmployeeDataResp: directoryEmployee.exportEmployeeDataResp,
            currentInstIdResp: appData.currentInstIdResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            loggedInUserRole: appData.loggedInUserRole,
            virtualRoleResp: appData.virtualRoleResp,
            branchListResp: branch.branchListResp,
            employeeManagementErrorResp: directoryEmployee.employeeManagementErrorResp,
            showApiLoader: globalData.showApiLoader,
        }), shallowEqual);

    const isInstituteAdmin = loggedInUserRole === 'INSTITUTE_ADMIN';
    const canCreateAndUpdate = useMemo(() => {
        if (loggedInUserRole === 'INSTITUTE_ADMIN') {
            return !!virtualRoleResp;
        }
        return loggedInUserRole !== 'ACCOUNT' && loggedInUserRole !== 'ACCOUNT_HEAD'
            && loggedInUserRole !== 'ADM_CONS' && loggedInUserRole !== 'ADM_HEAD';
    }, [loggedInUserRole, virtualRoleResp]);

    const canExport = useMemo(() => {
        return loggedInUserRole !== 'ACCOUNT' && loggedInUserRole !== 'ACCOUNT_HEAD'
            && loggedInUserRole !== 'ADM_CONS' && loggedInUserRole !== 'ADM_HEAD';
    }, [loggedInUserRole, virtualRoleResp]);

    const [filterState, setFilterState] = useState({
        branchId: branchId ? branchId?.toString() : '',
        status: "",
        employeeCategoryId: "",
        employeeIds: ""
    });

    const employeeManagementRespRef = useRef({
        prevEmployeeManagementErrorResp: employeeManagementErrorResp,
        prevExportEmployeeDataResp: exportEmployeeDataResp
    });

    useEffect(() => {
        const { prevExportEmployeeDataResp, prevEmployeeManagementErrorResp } = employeeManagementRespRef.current;
        if (exportEmployeeDataResp && prevExportEmployeeDataResp !== exportEmployeeDataResp) {
            toggleExportModalHandler();
            csvExportHndlr(exportEmployeeDataResp?.data, 'employee_data');
        }
        else if (employeeManagementErrorResp && prevEmployeeManagementErrorResp !== employeeManagementErrorResp) {
            const { details } = employeeManagementErrorResp;
            toast.error(details);
        }
        employeeManagementRespRef.current.prevEmployeeManagementErrorResp = employeeManagementErrorResp;
        employeeManagementRespRef.current.prevExportEmployeeDataResp = exportEmployeeDataResp;
    }, [exportEmployeeDataResp, employeeManagementErrorResp]);

    useEffect(() => {
        dispatch(getEmployeeCategoriesAct(generateActionPayload("get_employee_categories")));
        dispatch(getEmployeeStatusAct(generateActionPayload("get_employee_status")))
        return () => {
            dispatch({ type: 'RESET_EMPLOYEEMANGEMENT_STORE' });
        }
    }, [dispatch])

    useEffect(() => {
        if (branchId || instituteId) {
            getEmployeeApiCall();
        }
    }, [branchId, instituteId])
    useEffect(() => {
        if (branchId) {
            const params = { branchId };
            dispatch(getEmployeesStatsAct(generateActionPayload("get_employees_stats", undefined, params)));
        }
    }, [branchId]);

    function addEmployeeHndlr() {
        history.push("/employee-management/add-employee");
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
                    searchString: value,
                    nameFilterType: updatedFilterType
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
                nameFilterType: id,
                searchString: ""
            };
            getEmployeeApiCall(updatedState);
            return updatedState;
        });
    }

    function onChangeFilterHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        paginationDetailRef.current.pageNo = 0;
        setFilterState((prevState: any) => ({ ...prevState, [name]: value }));
        getEmployeeApiCall({ [name]: value });
        if (name === "employeeCategoryId" && !value && !filterState.status && !searchEmployeeState) {
            setShowClearFilterState(false);
        } else if (name == "status" && !value && !filterState.employeeCategoryId && !searchEmployeeState) {
            setShowClearFilterState(false);
        } else {
            setShowClearFilterState(true);
        }
    }

    function getEmployeeApiCall(otherProps?: any) {
        const sortingParams = getSortingKeys(sortingRef.current, true);
        const params = {
            instituteId,
            ...filterState, ...otherProps,
            ...paginationDetailRef.current,
            ...sortingParams
        };
        dispatch(getEmployeesListAct(generateActionPayload("get_employees", undefined, params)));
    }
    const toggleImportEmpModalHndlr = useCallback((apiCall?: boolean) => {
        setImportEmployeeState((prevState: any) => ({ ...prevState, showModal: false, }))
    }, []);

    function editEmployeeHndlr(event: any) {
        const employeeId = event.currentTarget.getAttribute("data-id");
        if (employeeId)
            history.push(`/employee-management/edit-employee/${employeeId}`);
    }

    const menuOptions = useMemo((): any[] => {
        return ([{
            id: "view-employee-info",
            actionIcon: <HugeiconsIcon icon={EyeIcon} className="text-muted" size={18} />,
            actionName: "View Employee Info",
            onClickHndlr: editEmployeeHndlr,
        }])
    }, [employeesListResp]);


    const toggleExportModalHandler = () => {
        setExportModal((prev: any) => ({ ...prev, showModal: !prev.showModal }))
    }

    function submitHndlr(password: any) {
        // toggleExportModalHandler();
        const params = { instituteId, ...filterState };
        // dispatch(exportEmployeeDataAct(generateActionPayload("export_employee_data", undefined, params)));
        dispatch(exportEmployeeDataAct(generateActionPayload("export_employee_data", undefined, params, {
            responseType: 'blob'
        })));
    }


    function clearFilterHndlr() {
        setFilterState((prevState: any) => ({
            ...prevState,
            branchId: isInstituteAdmin ? filterState.branchId : '',
            status: "",
            employeeCategoryId: "",
            employeeIds: ""
        }));
        //Resest page number to 0 if filters are applied
        paginationDetailRef.current.pageNo = 0;
        setSearchEmployeeState(null);
        getEmployeeApiCall({
            branchId: isInstituteAdmin ? filterState.branchId : '',
            status: "", employeeCategoryId: "", employeeIds: ""
        });
        setShowClearFilterState(false);
    }

    function sortingHandler(sortingKeys: any) {
        if (sortingRef.current && sortingRef.current !== sortingKeys) {
            sortingRef.current = sortingKeys;
            getEmployeeApiCall();
            //Testing
        } else {
            sortingRef.current = sortingKeys;
        }
    }

    const employeeColumns = useMemo(() => {
        const columns = generateColumns(menuOptions);
        if (isInstituteAdmin && !virtualRoleResp) {
            return columns.filter(item => item.accessor !== 'actions');
        }
        return columns.filter(item => item.accessor !== 'branchName');
    }, [employeesListResp, isInstituteAdmin, virtualRoleResp]),
        { data: employeeList, pageNumber, totalPages, totalRecords } = employeesListResp || {};
    return (
        <React.Fragment>
            <div className="page-content">
                <div className="container-fluid">
                    <BreadCrumb title="Employee Management" pageTitle="HRMS" />

                    {!isInstituteAdmin && (
                        <Statistics statsInfo={employeesStatsResp} />
                    )}

                    <div className="tw-mt-4 tw-mb-6">
                        <div className="tw-mb-4 tw-bg-white tw-rounded-xl tw-shadow" id="tasksList">

                            <div className="tw-px-4 tw-py-3 tw-border-b">
                                <div className="tw-flex tw-items-center tw-justify-between tw-flex-wrap tw-gap-3">

                                    <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                                        Employee Directories
                                    </h4>

                                    <div className="tw-flex tw-items-center tw-gap-2">

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
                                            id="export-btn"
                                            onClick={toggleExportModalHandler}
                                            variant="exportBtn"
                                        >
                                            <img src={ExportIcon} className="tw-h-full tw-w-auto" />
                                            <UncontrolledTooltip placement="bottom" target="export-btn">
                                                Export
                                            </UncontrolledTooltip>
                                        </Button>}

                                    </div>
                                </div>
                            </div>
                            <div className="tw-p-0">
                                <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-12 tw-gap-4 tw-p-4">

                                    <div className="md:tw-col-span-4">
                                        <SearchInput
                                            hideDefaultSelect
                                            name="searchString"
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

                                    {isInstituteAdmin && (
                                        <div className="md:tw-col-span-2">
                                            <SelectInput
                                                name="branchId"
                                                value={filterState.branchId}
                                                onChange={onChangeFilterHndlr}
                                                menuItems={branchListResp?.data}
                                                formgroupClassName="tw-mb-0"
                                                valueKey="branchId"
                                                textKey="branchName"
                                                labelText="Branch"
                                                floatingLabel
                                            />
                                        </div>
                                    )}

                                    <div className="md:tw-col-span-2">
                                        <SelectInput
                                            name="employeeCategoryId"
                                            value={filterState.employeeCategoryId}
                                            onChange={onChangeFilterHndlr}
                                            formgroupClassName="tw-mb-0"
                                            labelText="Employee Category"
                                            floatingLabel
                                            menuItems={employeeCategoriesResp}
                                            valueKey="employeeCategoryId"
                                            textKey="categoryName"
                                        />
                                    </div>

                                    <div className="md:tw-col-span-2">
                                        <SelectInput
                                            name="status"
                                            value={filterState.status}
                                            onChange={onChangeFilterHndlr}
                                            formgroupClassName="tw-mb-0"
                                            labelText="Status"
                                            floatingLabel
                                            menuItems={employeeStatusResp}
                                            valueKey="id"
                                            textKey="empStatusName"
                                        />
                                    </div>

                                    <div className="md:tw-col-span-1 tw-flex tw-items-center md:tw-justify-end">
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
                                <div className="">
                                    <TableContainer
                                        columns={employeeColumns}
                                        data={Array.isArray(employeeList) ? employeeList : []}
                                        divClass="tw-overflow-x-auto tw-mb-3"
                                        tableClass="tw-whitespace-nowrap"
                                        theadClass="tw-table-light tw-text-gray-500 tw-align-middle"
                                        showPagination={true}
                                        totalPages={totalPages}
                                        totalRecords={totalRecords}
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
            </div>
            <ModalContainerUpdated
                id="employee-export-modal"
                isOpen={exportModal.showModal}
                toggle={toggleExportModalHandler}
                modalTitle="Export Employees Data"
                modalSize="md"
            >
                <ExportModal
                    isOpen={exportModal.showModal}
                    toggle={toggleExportModalHandler}
                    instituteId={instituteId}
                    branchId={filterState.branchId}
                    submitHndlr={submitHndlr}
                    feature="hrms"
                    subFeature={!isInstituteAdmin ? "employee_management" : ""}
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
        </React.Fragment >
    )
}

export default EmployeeManagement;