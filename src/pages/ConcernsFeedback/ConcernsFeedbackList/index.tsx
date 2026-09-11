import React, { useMemo, useState, useEffect, useRef } from "react";
import { shallowEqual } from "react-redux";
import { useHistory } from "react-router";
//Common Component
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import TableContainer from "../../../Components/Common/TableContainer";
import { SelectInput, ModalContainerUpdated, TextInput, OffCanvasContainer, ConfirmationModal, MultiSelectCheckbox } from "../../../Components/Common";
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
import { generateColumns, hasStateChanged, statusFilter } from "./helper";
import classnames from "classnames";
import Statistics from "./Statistics";
import { generateActionPayload } from "../../../utility/reduxutility";
import {
    getBranchCurriculumAct,
} from "../../../store/branchsettings/branchacademics/branchacademicsactions";
import { default as FilterSvg } from "../../../assets/imagesdps/academics/FilterSvg.svg?react";
import { useLocation } from "react-router-dom";
import { IPaginationState } from "../../../Components/Common/Pagination";
import AssignEmployeeModal from "./AssignEmployeeModal";
import { exportConcernsFeedbackListAct, getAllModulesListAct, getConcernDeptByHeadAct, getConcernsFeedbackListAct, getConcernsStatsAct, resetConcernsFeedbackListAct } from "../../../store/concernsfeedback/concernsfeedbacklist/concernsfeedbacklistaction";
import AdvanceFilterModal from "./AdvanceFilterModal";
import { getComplaintDepartmentListAct } from "../../../store/concernsfeedback/complaintdepartment/complaintdepartmentaction";
import EmployeeDetailModal from "./EmployeeDetailModal";
import ReopenModal from "./ReopenModal";
import { toast } from "react-toastify";
import { downloadExcelFile } from "../../../utility/commonutility";
import ExportModal from "../../Directory/StudentManagement/ExportModal";
import { EyeIcon, Folder02Icon } from "@hugeicons-pro/core-stroke-standard";
import { HugeiconsIcon } from "@hugeicons/react";
import Button from "../../../Components/Common/Button";
 
 
const initialFilterState = {
    academicYearId: null,
    searchString: null,
    status: null,
    complaintUserType: null,
    priority: null,
    departmentId: null,
    departmentName: "",
    branchId: "",
    assigneeName: null,
    startDate: null,
    endDate: null,
    complaintUser: null,
    selectedEmployee: null,
    complaintById: null,
    assigneeId: null,
    complaintCategory: "",
    isParentComplaint: false,
    requestedType: "",
    dateType: "",
   
};
 
 
const ConcernFeedback: React.FC<any> = () => {
    const { pathname } = useLocation();
    const [assignEmployeeModalState, setAssignEmployeeModalState] = useState({
        showModal: false,
        receiptId: "",
        modalData: undefined
    });
    const [open, setOpen] = useState<boolean>(false);
    const [showClearFilterState, setShowClearFilterState] = useState(false);
    const [count, setCount] = useState<any>(null);
    const paginationDetailRef = useRef<IPaginationState>({
        pageNo: 0,
        pageSize: 10,
    });
    const [employeeDetailModalState, setEmployeeDetailModalState] = useState({
        showModal: false,
        employees: undefined
    })
    const [reopenModalState, setReopenModalState] = useState({
        showModal: false,
        complaintId: undefined
    })
    const [exportExcel, setExportExcel] = useState({
        showModal: false,
    })
    const sortingRef = useRef(undefined);
    const [filterState, setFilterState] = useState<any>({ ...initialFilterState });
    const history = useHistory();
 
    const dispatch = useAppDispatch();
 
    const {
        academicYearListResp,
        getConcernsFeedbackListResp,
        getConcernsStatsResp,
        currentInstIdResp: instituteId,
        currentBranchIdResp: branchId,
        showApiLoader,
        concernsFeedbackErrResp,
        addCommentListResp,
        loggedInUserRole,
        exportConcernsFeedbackListResp,
        concernDeptByHeadResp,
        userMeResp,
        instituteListResp,
        virtualRoleResp,
        branchListResp,
        getDepartmentListResp
    } =
        useAppSelector(({ appData, login, instAcademics, globalData, concernsFeedback , instituteInfo, branch }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            currentInstIdResp: appData.currentInstIdResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            loggedInUserRole: appData.loggedInUserRole,
            getConcernsFeedbackListResp: concernsFeedback.getConcernsFeedbackListResp,
            getConcernsStatsResp: concernsFeedback.getConcernsStatsResp,
            concernsFeedbackErrResp: concernsFeedback.concernsFeedbackErrResp,
            addCommentListResp: concernsFeedback.addCommentListResp,
            exportConcernsFeedbackListResp: concernsFeedback.exportConcernsFeedbackListResp,
            concernDeptByHeadResp: concernsFeedback.concernDeptByHeadResp,
            showApiLoader: globalData.showApiLoader,
            userMeResp: login.userMeResp,
            instituteListResp: instituteInfo.instituteListResp,
            virtualRoleResp: appData.virtualRoleResp,
            branchListResp: branch.branchListResp,
            getDepartmentListResp: concernsFeedback.getDepartmentListResp,
 
 
        }), shallowEqual);
 
    const showInstituteAdminUI = loggedInUserRole === 'INSTITUTE_ADMIN' && virtualRoleResp || loggedInUserRole !== 'INSTITUTE_ADMIN';

    const hideRoutes = ["/dc-erp-issues", "/concerns-from-app"];
    const showAddNewBtn = !hideRoutes.some(route => pathname?.includes(route));

    const concernFeedbackRef = useRef<any>({
        prevConcernsFeedbackErrResp: concernsFeedbackErrResp,
        prevAddCommentListResp: addCommentListResp,
        prevExportConcernsFeedbackListResp: exportConcernsFeedbackListResp,
    });
 
    useEffect(() => {
        const { prevConcernsFeedbackErrResp, prevAddCommentListResp, prevExportConcernsFeedbackListResp } = concernFeedbackRef.current;
 
        if (addCommentListResp && addCommentListResp !== prevAddCommentListResp) {
            toast.success("Concern Reopened successfully.");
            toggleReopenModal();
            getConcernsApiCall();
        }
        else if (concernsFeedbackErrResp && concernsFeedbackErrResp !== prevConcernsFeedbackErrResp) {
            const { details }: any = concernsFeedbackErrResp;
            toast.error(details || "Something went wrong.");
        }
        else if (exportConcernsFeedbackListResp && exportConcernsFeedbackListResp !== prevExportConcernsFeedbackListResp) {
            toast.success("Concern Feedback Data Download Successfully.");
            toggleExportExcelModal();
            downloadExcelFile(exportConcernsFeedbackListResp, "Concerns_Feedback_List");
        }
 
        concernFeedbackRef.current.prevAddCommentListResp = addCommentListResp;
        concernFeedbackRef.current.prevConcernsFeedbackErrResp = concernsFeedbackErrResp;
        concernFeedbackRef.current.prevExportConcernsFeedbackListResp = exportConcernsFeedbackListResp;
 
    }, [concernsFeedbackErrResp, addCommentListResp, exportConcernsFeedbackListResp]);
 
    function getComplaintDeptApiCall(otherProps?: any) {
        const payload = { branchId, pageNo: 0, pageSize: 100 };
        dispatch(getComplaintDepartmentListAct(generateActionPayload("get_complaint_dept_list", undefined, { ...payload })));
    }
    useEffect(() => {
        if (branchId) {
            const brchCurriculumparams = { branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" };
            dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, brchCurriculumparams)));
            getComplaintDeptApiCall({ branchId, complaintCategory: "" });
        }
        if (userMeResp) {
            const { id: userId } = userMeResp;
            if (userId) {
                dispatch(getConcernDeptByHeadAct(generateActionPayload("get_concern_dept_head", { userId })));
            }
        }
    }, [branchId, userMeResp]);
 
    useEffect(() => {
 
        getAllModulesApiCall()
        return () => {
            dispatch(resetConcernsFeedbackListAct(undefined))
        }
    }, [])
 
 
    useEffect(() => {
        const { data } = academicYearListResp || {};
        if (Array.isArray(data) && data.length > 0) {
            let { academicYearId } = data.find((year: any) => year.yearStatus === "CURRENT") || {};
            if (academicYearId) {
                setFilterState((prev: any) => ({ ...prev, academicYearId }));
                getConcernsApiCall({
                    academicYearId,
                });
                getConcernsStatsApiCall({ academicYearId });
            }
        }
    }, [academicYearListResp, userMeResp]);
 
    function getConcernsApiCall(otherProps?: any) {
        const payload = {
            instituteId, ...filterState, branchId: filterState.branchId || branchId, ...paginationDetailRef.current, ...(otherProps || {}),
        };
        if (Array.isArray(instituteListResp?.data) && instituteListResp?.data.length > 0) {
            payload.instituteGroupId = instituteListResp?.data.find((item: any) => +item?.id === +instituteId)?.instituteGroupId;
        }
        if (Array.isArray(payload.departmentName)) {
            payload.departmentName = payload.departmentName.map((item: any) => item.name).join(",");
        }
        delete payload?.selectedEmployee;
        delete payload?.complaintUser;
        if (loggedInUserRole !== "BRANCH_ADMIN" && loggedInUserRole !== "INSTITUTE_ADMIN") {
            const { role } = userMeResp || {};
            const { roleType } = role || {};
            if (roleType === "EMPLOYEE" && pathname !== "/my-concerns") {
                payload.requestType = "DEPT_COMPLAINTS";
            } else {
                payload.requestType = "MY_COMPLAINTS";
            }
        }
        if (pathname === "/dc-erp-issues") {
            payload.departmentShortCode = "DC"
        }
        if(pathname === "/concerns-from-app"){
            payload.departmentShortCode = "APP_SUP"
        }
        if (Array.isArray(payload.status)) {
            payload.status = payload.status.map((item: any) => item.id).join(",");
        }
 
        dispatch(getConcernsFeedbackListAct(generateActionPayload("get_concern_feedback_list", undefined, { ...payload })));
    }
 
    useEffect(() => {
        getConcernsApiCall();
    }, [filterState.status, filterState.academicYearId]);
 
    function getConcernsStatsApiCall(otherProps?: any) {
        const payload = { instituteId,branchId, academicYearId: filterState?.academicYearId, ...otherProps };
        if(Array.isArray(instituteListResp?.data) && instituteListResp?.data.length > 0){
            payload.instituteGroupId = instituteListResp?.data.find((item: any) => +item?.id === +instituteId)?.instituteGroupId
        }
        if (loggedInUserRole !== "BRANCH_ADMIN" && loggedInUserRole !== "INSTITUTE_ADMIN") {
            const { role } = userMeResp || {},
                { roleType } = role || {};
            if (roleType === "EMPLOYEE" && pathname !== "/my-concerns") {
                payload.requestType = "DEPT_COMPLAINTS"
            } else {
                payload.requestType = "MY_COMPLAINTS"
            }
        }
        if(pathname === "/dc-erp-issues"){
            payload.departmentShortCode = "DC"
        }
        if(pathname === "/concerns-from-app"){
            payload.departmentShortCode = "APP_SUP"
        }
        dispatch(getConcernsStatsAct(generateActionPayload("get_concern_stats", undefined, { ...payload })));
    }
 
 
    function onChangeFilterHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        paginationDetailRef.current.pageNo = 0;
        setFilterState((prevState: any) => ({ ...prevState, [name]: value }));
        if (name === "academicYearId") {
            value && getConcernsStatsApiCall({ [name]: value });
        }
        getConcernsApiCall({ [name]: value });
        const stateChanged = hasStateChanged({ ...filterState, [name]: value, academicYearId: "" });
        setShowClearFilterState(stateChanged?.stateChange)
        stateChanged?.count === 0 ? setCount(null) : setCount(stateChanged?.count)
    }
 
    function viewConcernHndlr(event: any) {
        const complaintId = event.currentTarget.getAttribute("data-id");
        if (complaintId) {
            const { role } = userMeResp, { roleType } = role || {};
            history.push(`${pathname}/view-concerns-feedback`, {
                complaintId: complaintId,
                isCreated: roleType === "EMPLOYEE" || roleType === "BRANCH" || roleType === "Institute_Admin" || false,
                pathName: pathname
            });
        }
    }
 
    function redirectViewHndlr(complaintId, event) {
        if (!complaintId) return;
 
        const { role } = userMeResp;
        const { roleType } = role || {};
        const isCreated = roleType === "EMPLOYEE" || roleType === "BRANCH" || roleType === "Institute_Admin" || false;
 
        if (event && (event.ctrlKey || event.metaKey)) {
           
            sessionStorage.setItem('ctrl_click_complaint_data', JSON.stringify({
                complaintId: complaintId,
                isCreated: isCreated,
                pathName: pathname,
                academicYearId: filterState?.academicYearId
            }));    
            window?.open(`${window?.location.origin}${pathname}/view-concerns-feedback`, '_blank')?.focus();
        }
         else {
            history.push(`${pathname}/view-concerns-feedback`, {
                complaintId: complaintId,
                isCreated: isCreated,
                pathName: pathname,
                academicYearId: filterState?.academicYearId
            });
        }
    }
    function redirectIconViewHndlr(complaintId, event) {
        if (!complaintId) return;
 
        const { role } = userMeResp;
        const { roleType } = role || {};
        const isCreated = roleType === "EMPLOYEE" || roleType === "BRANCH" || roleType === "Institute_Admin" || false;
       
            sessionStorage.setItem('ctrl_click_complaint_data', JSON.stringify({
                complaintId: complaintId,
                isCreated: isCreated,
                pathName: pathname,
                academicYearId: filterState?.academicYearId
            }));    
            window?.open(`${window?.location.origin}${pathname}/view-concerns-feedback`, '_blank')?.focus();
    }
 
    const toggleViewDetailsModal = (modalData?: any) => {
        setAssignEmployeeModalState((prev: any) => ({
            ...prev,
            showModal: !prev.showModal,
            modalData: modalData || "",
        }))
    }
 
    const toggleEmployeeDetailModal = (assignee?: any) => {
        setEmployeeDetailModalState((prev: any) => ({
            ...prev,
            showModal: !prev.showModal,
            employees: assignee?.length > 0 ? assignee : [],
        }))
    }
 
    const toggleReopenModal = (complaintId?: any) => {
        setReopenModalState((prev: any) => ({
            ...prev,
            showModal: !prev.showModal,
            complaintId: complaintId || "",
        }))
    }
 
    const toggleExportExcelModal = () => {
        setExportExcel((prevState: any) => ({
            ...prevState,
            showModal: !prevState.showModal,
        }));
    };
 
    const exportExcelHndler = () => {
 
        const payload = { ...filterState, branchId, instituteId };
        if (Array.isArray(payload.departmentName)) {
            payload.departmentName = payload.departmentName.map((item: any) => item.name).join(",");
        }
        if(pathname === "/dc-erp-issues"){
            payload.departmentShortCode = "DC"
        }
        if(pathname === "/concerns-from-app"){
            payload.departmentShortCode = "APP_SUP"
        }
        if (Array.isArray(payload.status)) {
            payload.status = payload.status.map((item: any) => item.id).join(",");
        }
        dispatch(exportConcernsFeedbackListAct(generateActionPayload("export_concern_list", undefined, payload, {
            responseType: 'blob'
        })));
    }
 
        const getAllModulesApiCall = () => {
        dispatch(getAllModulesListAct(generateActionPayload("get_all_modules_list", undefined)));
    }
 
    const menuOptions = useMemo((): any[] => {
        return ([
            {
                id: "view",
                actionIcon: <HugeiconsIcon icon={EyeIcon} className="me-2 text-muted" size={18} />,
                actionName: "View Details",
                onClickHndlr: viewConcernHndlr,
            }
            ,
            {
                id: "reopen",
                actionIcon: <HugeiconsIcon icon={Folder02Icon} className="me-2 text-muted" size={18} />,
                actionName: "Re-Open",
                onClickHndlr: (event: any) => {
                    const complaintId = event.currentTarget.getAttribute("data-id");
                    toggleReopenModal(complaintId)
                },
            }
        ])
    }, [getConcernsFeedbackListResp, userMeResp]);
 
    function paginationHndlr(paginationInfo: any) {
        paginationDetailRef.current = paginationInfo;
        getConcernsApiCall(paginationInfo);
    }
 
    const moveToAddConcern = (event: any) => {
        event.preventDefault()
        history.push(`${pathname}/add-concerns-feedback`, {
            pathName: pathname
        })
    }
 
    const toggleAdvanceFilter = () => {
        setOpen(prev => !prev);
    }
 
    function advanceFilterCallbckHndlr(appliedFilters?: any) {
        paginationDetailRef.current.pageNo = 0;
        setFilterState((prevState: any) => ({ ...prevState, ...appliedFilters }));
        const stateChanged = hasStateChanged({ ...filterState, ...appliedFilters, academicYearId: "" });
        stateChanged?.count === 0 ? setCount(null) : setCount(stateChanged?.count)
        setShowClearFilterState(stateChanged?.stateChange)
        getConcernsApiCall(appliedFilters)
    }
 
    const clearFilterHndlr = () => {
        if (academicYearListResp?.data) {
            paginationDetailRef.current = { ...paginationDetailRef.current, pageNo: 0 };

            const currentYear = academicYearListResp?.data?.find((year: any) => year.yearStatus === "CURRENT") || null;
            const resetFilters = { ...initialFilterState, academicYearId: currentYear?.academicYearId || null, departmentName: "", branchId: "" };
            setFilterState(resetFilters);
            setCount(null);
            setShowClearFilterState(false);
            getConcernsApiCall(resetFilters);
            getConcernsStatsApiCall({ academicYearId: resetFilters.academicYearId });
            getComplaintDeptApiCall({ branchId, complaintCategory: "" });
        }
    };
 
    function renderValue(selectedItems: any) {
        if (Array.isArray(selectedItems)) {
            return (<div className="text-truncate">
                {
                    selectedItems.map((item, index) => {
                        return item?.name + (index !== (selectedItems.length - 1) ? ', ' : '')
                    })
                }
            </div>)
        }
    }
 
    function renderOptions(item: any) {
        return item?.name;
    }
 
    function onSelectOptionHandler(selectedOptions: any, config?: any) {
        const { name } = config;
        const selectedValue = Array.isArray(selectedOptions) && selectedOptions.length > 0 ? selectedOptions : null;
        const updatedFilters = { ...filterState, [name]: selectedValue };
        paginationDetailRef.current.pageNo = 0;
        setFilterState(updatedFilters);
        const stateChanged = hasStateChanged({ ...updatedFilters, academicYearId: "" });
        setShowClearFilterState(stateChanged?.stateChange);
        stateChanged?.count === 0 ? setCount(null) : setCount(stateChanged?.count);
        getConcernsApiCall(updatedFilters);
    }
 
    const studentColumns = useMemo(() => generateColumns(menuOptions, redirectViewHndlr,redirectIconViewHndlr, toggleEmployeeDetailModal, userMeResp, pathname), [getConcernsFeedbackListResp, userMeResp, pathname]),
        { pageNo: pageNumber, totalPages, totalElements: totalRecords } = getConcernsFeedbackListResp || {};
 
    const departments = useMemo(() => getDepartmentListResp?.map(dept => ({ name: dept })) || [], [getDepartmentListResp]);
 
    const { role } = userMeResp || {},
        { roleType } = role || {},
        isDepartmentHead = Array.isArray(concernDeptByHeadResp) && concernDeptByHeadResp.length > 0 &&
            pathname !== "/my-concerns" && roleType === "EMPLOYEE" || false;
    return (
        <React.Fragment>
            <div className="page-content">
                <div className="container-fluid">
                    <BreadCrumb title="Students Management" pageTitle="Helpdesk" />
                    <Statistics statsInfo={getConcernsStatsResp} />

                    <div className="tw-flex tw-flex-col tw-mb-4">
                        <div className="tw-w-full">
                            <div className="tw-bg-white tw-rounded tw-shadow" id="tasksList">
                                <div className="tw-flex tw-items-center tw-justify-between tw-py-2 tw-px-4 tw-border-b tw-border-gray-200">
                                    <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                                        {pathname === "/my-concerns" ? "My Tickets" : "Tickets / Feedback List"}
                                    </h4>
                                    <div className="tw-flex tw-space-x-2 tw-items-center">
                                        {showInstituteAdminUI && showAddNewBtn && (
                                            <Button
                                                variant="primary"
                                                onClick={moveToAddConcern}
                                            >
                                                <i className="ri-add-line" />
                                                <span>Add Request</span>
                                            </Button>
                                        )}
                                        <Button
                                            variant="info"
                                            onClick={() => toggleExportExcelModal()}
                                        >
                                            <i className="ri-add-line" />
                                            <span>Export</span>
                                        </Button>
                                    </div>
                                </div>

                                <div className="tw-p-0">
                                    <div className="tw-py-3 tw-px-3">
                                        <div className="tw-grid tw-gap-3">
                                            <div className="tw-w-full">
                                                <div className="tw-grid tw-grid-cols-12 tw-gap-3 tw-pt-2 tw-pb-1">

                                                    {/* Search Box */}
                                                    <div className="tw-col-span-12 md:tw-col-span-4 xl:tw-col-span-3">
                                                        <div className="search-box">
                                                            <TextInput
                                                                name="searchString"
                                                                value={filterState.searchString}
                                                                onChange={onChangeFilterHndlr}
                                                                inputClassName="tw-bg-gray-100"
                                                                formgroupClassName="tw-mb-0"
                                                                placeHolder="Search"
                                                                labelText="Search"
                                                                floatingLabel
                                                            />
                                                            <i className="ri-search-line search-icon"></i>
                                                        </div>
                                                    </div>

                                                    {/* Academic Year */}
                                                    <div className="tw-col-span-6 md:tw-col-span-2 xl:tw-col-span-2">
                                                        <SelectInput
                                                            name="academicYearId"
                                                            value={filterState.academicYearId}
                                                            onChange={onChangeFilterHndlr}
                                                            menuItems={academicYearListResp?.data}
                                                            formgroupClassName="tw-mb-0"
                                                            valueKey="academicYearId"
                                                            textKey="academicYearName"
                                                            labelText="Academic Year"
                                                            floatingLabel
                                                        />
                                                    </div>

                                                    {/* Branch Name (conditionally rendered) */}
                                                    {!showInstituteAdminUI && (
                                                        <div className="tw-col-span-6 md:tw-col-span-2 xl:tw-col-span-2">
                                                            <SelectInput
                                                                name="branchId"
                                                                valueKey="branchId"
                                                                textKey="branchName"
                                                                value={filterState.branchId}
                                                                menuItems={branchListResp?.data}
                                                                onChange={onChangeFilterHndlr}
                                                                labelText="Branch Name"
                                                                floatingLabel
                                                                formgroupClassName="tw-mb-0"
                                                            />
                                                        </div>
                                                    )}

                                                    {/* Status MultiSelect */}
                                                    <div className="tw-col-span-6 md:tw-col-span-2 xl:tw-col-span-2">
                                                        <MultiSelectCheckbox
                                                            name="status"
                                                            idKey="id"
                                                            // labelText="Status"
                                                            value={filterState?.status}
                                                            renderValue={renderValue}
                                                            renderOptions={renderOptions}
                                                            onChange={onSelectOptionHandler}
                                                            searchKey="name"
                                                            options={statusFilter || []}
                                                            floatingLabel
                                                        />
                                                    </div>

                                                    {/* Filters Button */}
                                                    <div className="tw-relative">
                                                        <div
                                                            onClick={toggleAdvanceFilter}
                                                            className="tw-flex tw-items-center tw-gap-2 tw-bg-gray-100 tw-p-2 tw-cursor-pointer tw-rounded"
                                                        >
                                                            <FilterSvg height="18px" width="18px" />
                                                            <span>Filters</span>
                                                        </div>

                                                        <span
                                                            className="tw-absolute -tw-top-2 tw-left-16 tw-rounded-full tw-bg-emerald-500 tw-text-white tw-text-xs tw-px-2"
                                                        >
                                                            {count}
                                                        </span>
                                                    </div>

                                                    {/* Clear Filter */}
                                                    <div className="tw-col-span-6 md:tw-col-span-2 xl:tw-col-span-2 tw-flex tw-items-center">
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
                                        </div>
                                    </div>

                                    <TableContainer
                                        columns={studentColumns}
                                        data={(Array.isArray(getConcernsFeedbackListResp?.data) && getConcernsFeedbackListResp?.data) || []}
                                        divClass="tw-overflow-x-auto tw-mb-3"
                                        tableClass="tw-min-w-full tw-divide-y tw-divide-gray-200"
                                        theadClass="tw-bg-gray-50 tw-text-gray-500 tw-text-left tw-align-middle"
                                        showPagination={true}
                                        totalPages={totalPages}
                                        totalRecords={totalRecords}
                                        callbackPaginationHndlr={paginationHndlr}
                                        currentPageNumber={pageNumber}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ModalContainerUpdated
                id="assign-employee-modal"
                isOpen={assignEmployeeModalState.showModal}
                toggle={() => toggleViewDetailsModal()}
                modalTitle="Assign To"
                modalSize="md"
            >
                <AssignEmployeeModal
                    toggle={() => toggleViewDetailsModal()}
                    modalData={assignEmployeeModalState.modalData}
                />
            </ModalContainerUpdated>
            <ModalContainerUpdated
                id="reopen-ticket-modal"
                isOpen={reopenModalState.showModal}
                toggle={() => toggleReopenModal()}
                modalTitle="Reopen Tikcet"
                modalSize="md"
            >
                <ReopenModal
                    toggle={() => toggleReopenModal()}
                    complaintId={reopenModalState.complaintId}
                />
            </ModalContainerUpdated>
            <OffCanvasContainer
                isOpen={open}
                headerTitle="Advance Filters"
                closeHndlr={toggleAdvanceFilter}
                id="concern-feedback-advance-filter"
            >
                <AdvanceFilterModal
                    appliedFilter={filterState}
                    applyFilterCallback={advanceFilterCallbckHndlr}
                    toggleAdvanceFilter={toggleAdvanceFilter}
                    isOpen={open}
                    isDepartmentHead={isDepartmentHead}
                    roleType={roleType}
                    roleName={loggedInUserRole}
                    branchId={filterState.branchId}
                    department={departments}
                />
 
            </OffCanvasContainer>
            <ModalContainerUpdated
                id="all-employees-details"
                isOpen={employeeDetailModalState.showModal}
                toggle={() => toggleEmployeeDetailModal()}
                modalTitle="Assignees Details"
                modalSize="md"
            >
                <EmployeeDetailModal employeeList={employeeDetailModalState?.employees || []} />
 
            </ModalContainerUpdated>
            <ModalContainerUpdated
                id="feedback-export"
                isOpen={exportExcel.showModal}
                toggle={toggleExportExcelModal}
                modalTitle="Export Concern Feedback Data"
                modalSize="md"
            >
                <ExportModal
                    isOpen={exportExcel.showModal}
                    toggle={toggleExportExcelModal}
                    instituteId={instituteId}
                    branchId={branchId}
                    submitHndlr={exportExcelHndler}
                    feature="helpdesk"
                    subFeature="concerns_feedback_list"
                    remarksText="Enter remarks to export concern feedback data?"
                />
            </ModalContainerUpdated>
 
 
        </React.Fragment>
    )
}
 
export default ConcernFeedback;
 