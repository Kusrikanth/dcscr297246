import React, { useMemo, useState, useEffect, useRef } from "react";
import { shallowEqual } from "react-redux";
import { useHistory } from "react-router";
//Common Component
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import TableContainer from "../../../Components/Common/TableContainer";
import { SelectInput, ModalContainerUpdated, TextInput, OffCanvasContainer } from "../../../Components/Common";
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
import { accessRoles, generateColumns, hasStateChanged, statusFilter } from "./helper";
import classnames from "classnames";
import { generateActionPayload } from "../../../utility/reduxutility";
import {
    getBranchCurriculumAct,
} from "../../../store/branchsettings/branchacademics/branchacademicsactions";
import { default as FilterSvg } from "../../../assets/imagesdps/academics/FilterSvg.svg?react";
import { useLocation } from "react-router-dom";
import { IPaginationState } from "../../../Components/Common/Pagination";
import { getConcernsFeedbackListAct, getConcernsStatsAct, resetConcernsFeedbackListAct } from "../../../store/concernsfeedback/concernsfeedbacklist/concernsfeedbacklistaction";
import { getComplaintDepartmentListAct } from "../../../store/concernsfeedback/complaintdepartment/complaintdepartmentaction";
import AssignEmployeeModal from "../ConcernsFeedbackList/AssignEmployeeModal";
import AdvanceFilterModal from "./AdvanceFilterModal";
import EmployeeDetailModal from "../ConcernsFeedbackList/EmployeeDetailModal";
import { toast } from "react-toastify";
import ReopenModal from "../ConcernsFeedbackList/ReopenModal";
import Button from "../../../Components/Common/Button";


const initialFilterState = {

    academicYearId: null,
    searchString: null,
    status: null,
    complaintUserType: null,
    priority: null,
    departmentId: null,
    assigneeId: null,
    startDate:null,
    endDate:null,
    selectedEmployee:null,
};


const ConcernFeedback: React.FC<any> = () => {

    const { pathname } = useLocation();


    const [assignEmployeeModalState, setAssignEmployeeModalState] =
        useState({
            showModal: false,
            modalData: undefined
        });
    const [open, setOpen] = useState<boolean>(false);
    const [showClearFilterState, setShowClearFilterState] = useState(false);
    const [count, setCount] = useState<any>(null);
    const paginationDetailRef = useRef<IPaginationState>({
        pageNo: 0,
        pageSize: 10,
    });
    const [reopenModalState, setReopenModalState] = useState<any>({
        showModal: false,
        complaintId: undefined
    })
    const [employeeDetailModalState, setEmployeeDetailModalState] = useState<any>({
        showModal: false,
        employees: undefined
    })
    const sortingRef = useRef(undefined);
    const [filterState, setFilterState] = useState<any>({ ...initialFilterState });
    const history = useHistory();

    const dispatch = useAppDispatch();
    const {
        studentsStatsResp,
        studentsListResp,
        academicYearListResp,
        getConcernsFeedbackListResp,
        getConcernsStatsResp,
        currentInstIdResp: instituteId,
        currentBranchIdResp: branchId,
        showApiLoader,
        concernsFeedbackErrResp,
        addCommentListResp,
        userMeResp,
    } =
        useAppSelector(({ appData, directoryStudent, login, instAcademics, globalData, concernsFeedback }) => ({
            studentsStatsResp: directoryStudent.studentsStatsResp,
            studentsListResp: directoryStudent.studentsListResp,
            academicYearListResp: instAcademics.academicYearListResp,
            currentInstIdResp: appData.currentInstIdResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            getConcernsFeedbackListResp: concernsFeedback.getConcernsFeedbackListResp,
            getConcernsStatsResp: concernsFeedback.getConcernsStatsResp,
            concernsFeedbackErrResp: concernsFeedback.concernsFeedbackErrResp,
            addCommentListResp: concernsFeedback.addCommentListResp,
            showApiLoader: globalData.showApiLoader,
            userMeResp: login.userMeResp,
        }), shallowEqual);

        const concernFeedbackRef = useRef<any>({
            prevConcernsFeedbackErrResp: concernsFeedbackErrResp,
            prevAddCommentListResp: addCommentListResp,
        });
    
        useEffect(() => {
            const { prevConcernsFeedbackErrResp, prevAddCommentListResp } = concernFeedbackRef.current;
    
            if (addCommentListResp && addCommentListResp !== prevAddCommentListResp) {
                toast.success("Concern Reopened successfully.");
                toggleReopenModal();
                getConcernsApiCall();
            }
            else if (concernsFeedbackErrResp && concernsFeedbackErrResp !== prevConcernsFeedbackErrResp) {
                const { details }: any = concernsFeedbackErrResp;
                toast.error(details || "Something went wrong.");
            }
    
            concernFeedbackRef.current.prevAddCommentListResp = addCommentListResp;
            concernFeedbackRef.current.prevConcernsFeedbackErrResp = concernsFeedbackErrResp;
    
        }, [concernsFeedbackErrResp, addCommentListResp]);

    function getComplaintDeptApiCall(otherProps?: any) {
        const payload = { branchId, pageNo: 0, pageSize: 100 };
        dispatch(getComplaintDepartmentListAct(generateActionPayload("get_complaint_dept_list", undefined, { ...payload })));
    }

    useEffect(() => {
        if (branchId) {
            const brchCurriculumparams = { branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" };
            dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, brchCurriculumparams)));
            getComplaintDeptApiCall({ branchId , category : "ACADEMIC" });
        }
    }, [branchId]);

    useEffect(() => {
      
        return () => {
          dispatch(resetConcernsFeedbackListAct(undefined))
        }
      }, [])

    useEffect(() => {
        const { data } = academicYearListResp || {};
        if (Array.isArray(data) && data.length > 0) {
            let { academicYearId } = data.find((year: any) => year?.yearStatus?.toLowerCase() === "current") || {};
            if (academicYearId) {
                setFilterState((prev: any) => ({ ...prev, academicYearId }));
                getConcernsApiCall({ academicYearId , assigneeId : userMeResp?.loggedInUserInformation?.id, });
                getConcernsStatsApiCall({ academicYearId });
            }
        }
    }, [academicYearListResp,userMeResp]);

    function getConcernsApiCall(otherProps?: any) {
        const payload = {
            branchId, ...filterState, ...paginationDetailRef.current, ...otherProps,
            assigneeId : userMeResp?.loggedInUserInformation?.id,
        };
        delete payload?.selectedEmployee;
        dispatch(getConcernsFeedbackListAct(generateActionPayload("assignee_list_concern", undefined, { ...payload })));
    }

    function getConcernsStatsApiCall(otherProps?: any) {
        const payload = { branchId, academicYearId: filterState?.academicYearId, ...otherProps };
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

    function editStudentHndlr(event: any) {
        const complaintId = event.currentTarget.getAttribute("data-id");
        if (complaintId)
            history.push(`/my-concerns-feedback/view-concerns-feedback`, { complaintId: complaintId , isCreated : true });
    }

    const toggleViewDetailsModal = (modalData?: any) => {
        setAssignEmployeeModalState((prev: any) => ({
            ...prev,
            showModal: !prev.showModal,
            modalData: modalData || "",
        }))
    }

    const toggleEmployeeDetailModal = (assignee?:any) => {
        setEmployeeDetailModalState((prev:any)=>({
            ...prev,
            showModal : !prev.showModal,
            employees : assignee?.length > 0 ? assignee : [],
        }))
    }

    const toggleReopenModal = (complaintId?: any) => {
        setReopenModalState((prev: any) => ({
            ...prev,
            showModal: !prev.showModal,
            complaintId : complaintId || "",
        }))
    }

    const menuOptions = useMemo((): any[] => {
        return ([{
            id: "view",
            actionIcon: <i className={classnames("me-2 ri-eye-fill text-primary fs-16")}></i>,
            actionName: "View Details",
            onClickHndlr: editStudentHndlr,
        },
        {
            id: "reopen",
            actionIcon: <i className={classnames("me-2 ri-folder-open-line text-primary fs-16")}></i>,
            actionName: "Re-Open",
            onClickHndlr: (event: any) => {
                const complaintId = event.currentTarget.getAttribute("data-id");
                toggleReopenModal(complaintId)
            },
        }
        ])
    }, [getConcernsFeedbackListResp]);

    function paginationHndlr(paginationInfo: any) {
        paginationDetailRef.current = paginationInfo;
        getConcernsApiCall(paginationInfo);
    }

    const moveToAddConcern = (event: any) => {
        event.preventDefault()
        history.push(`/add-concerns-feedback`)
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
        if (academicYearListResp) {
            paginationDetailRef.current = { ...paginationDetailRef.current, pageNo: 0 }
            let { academicYearId } = academicYearListResp?.data?.find((year: any) =>  year.yearStatus === "CURRENT") || {};
            setCount(null)
            setFilterState({ ...initialFilterState, academicYearId })
            getConcernsApiCall({ ...initialFilterState, academicYearId })
            setShowClearFilterState(false)
        }
    }
 function redirectViewHndlr(complaintId, event) {
        if (!complaintId) return;

        if (event && (event.ctrlKey || event.metaKey)) {
                        
            sessionStorage.setItem('ctrl_click_complaint_data', JSON.stringify({
                complaintId: complaintId,
                isCreated: true,
                pathName: pathname,
                academicYearId: filterState?.academicYearId,
                assigneeId: userMeResp?.loggedInUserInformation?.id
            }));    
            window?.open(`${window?.location.origin}${pathname}/view-concerns-feedback`, '_blank')?.focus();
        }
         else {
            history.push(`${pathname}/view-concerns-feedback`, {
                complaintId: complaintId,
                isCreated: true,
                pathName: pathname,
                academicYearId: filterState?.academicYearId,
                assigneeId: userMeResp?.loggedInUserInformation?.id
            });
        }
    }

function redirectIconViewHndlr(complaintId, event) {
        if (!complaintId) return;
                        
            sessionStorage.setItem('ctrl_click_complaint_data', JSON.stringify({
                complaintId: complaintId,
                isCreated: true,
                pathName: pathname,
                academicYearId: filterState?.academicYearId,
                assigneeId: userMeResp?.loggedInUserInformation?.id
            }));    
            window?.open(`${window?.location.origin}${pathname}/view-concerns-feedback`, '_blank')?.focus();
    }

    const studentColumns = useMemo(() => generateColumns(menuOptions, toggleViewDetailsModal,toggleEmployeeDetailModal, filterState.academicYearId, redirectViewHndlr,redirectIconViewHndlr), [getConcernsFeedbackListResp, filterState.academicYearId]),
        {  pageNo: pageNumber, totalPages, totalElements: totalRecords } = getConcernsFeedbackListResp || {};
    return (
        <React.Fragment>
            <div className="page-content">
                <div className="container-fluid">
                    <BreadCrumb pageTitle="Helpdesk" pageTitleName="My Assignees" />

                    <div className="tw-grid tw-grid-cols-1">
                        <div className="tw-col-span-1">
                            <div
                                className="tw-bg-white tw-rounded-lg tw-shadow-sm tw-border tw-border-gray-200"
                                id="tasksList"
                            >
                                <div className="tw-px-4 tw-py-3 tw-border-b tw-border-gray-200">
                                    <div className="tw-flex tw-items-center">
                                        <h4 className="tw-text-lg tw-font-semibold tw-text-gray-800 tw-flex-grow">
                                            My Assignees
                                        </h4>
                                    </div>
                                </div>

                                <div className="tw-p-0">
                                    <div className="tw-px-4 tw-py-3">
                                        <div className="tw-grid tw-grid-cols-1 tw-gap-3">
                                            <div className="tw-col-span-1">
                                                <div className="tw-grid tw-grid-cols-12 tw-gap-3 tw-items-end">

                                                    <div className="tw-col-span-12 sm:tw-col-span-6 xl:tw-col-span-4">
                                                        <div className="tw-relative search-box">
                                                            <TextInput
                                                                name="searchString"
                                                                value={filterState.searchString}
                                                                onChange={onChangeFilterHndlr}
                                                                inputClassName="tw-bg-slate-100"
                                                                formgroupClassName="tw-mb-0"
                                                                placeHolder="Search"
                                                                labelText="Search"
                                                                floatingLabel
                                                            />
                                                            <i className="ri-search-line tw-absolute tw-left-3 tw-top-1/2 -tw-translate-y-1/2 tw-text-slate-400"></i>
                                                        </div>
                                                    </div>

                                                    <div className="tw-col-span-12 sm:tw-col-span-6 xl:tw-col-span-2">
                                                        <SelectInput
                                                            name="academicYearId"
                                                            value={filterState.academicYearId}
                                                            onChange={onChangeFilterHndlr}
                                                            menuItems={academicYearListResp?.data}
                                                            formgroupClassName="tw-mb-0"
                                                            valueKey="academicYearId"
                                                            textKey="academicYearName"
                                                            defaultSelect="Academic Year"
                                                        />
                                                    </div>

                                                    <div className="tw-col-span-12 sm:tw-col-span-6 xl:tw-col-span-2">
                                                        <SelectInput
                                                            name="status"
                                                            value={filterState.status}
                                                            onChange={onChangeFilterHndlr}
                                                            menuItems={statusFilter}
                                                            formgroupClassName="tw-mb-0"
                                                            defaultSelect="Status"
                                                            valueKey="id"
                                                            textKey="name"
                                                        />
                                                    </div>

                                                    <div className="tw-col-span-12 lg:tw-col-span-1 tw-relative">
                                                        <button
                                                            onClick={toggleAdvanceFilter}
                                                            className="tw-flex tw-items-center tw-gap-2 tw-bg-[#F4F7FA] tw-p-2 tw-rounded"
                                                        >
                                                            <FilterSvg height="18px" width="18px" />
                                                            <span>Filters</span>
                                                        </button>
                                                        <span className="badge tw-align-middle rounded-pill ms-1 " style={{ marginBottom: "18px", position: "absolute", top: "-9px", left: "78px", background: "#0ab39c" }}>
                                                            {count}
                                                        </span>
                                                    </div>

                                                    <div className="tw-col-span-12 sm:tw-col-span-2 tw-ml-auto tw-flex tw-justify-end">
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
                                        data={
                                            (Array.isArray(getConcernsFeedbackListResp?.data) &&
                                                getConcernsFeedbackListResp?.data) ||
                                            []
                                        }
                                        divClass="tw-overflow-x-auto tw-mb-3"
                                        tableClass="tw-min-w-full tw-whitespace-nowrap"
                                        theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
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
                modalSize="lg"
            >
                <AssignEmployeeModal
                    toggle={() => toggleViewDetailsModal()}
                    modalData={assignEmployeeModalState.modalData}
                />
            </ModalContainerUpdated>
            <OffCanvasContainer
                isOpen={open}
                headerTitle="Advance Filters"
                closeHndlr={toggleAdvanceFilter}
                id="feereceipt-advance-filter"
            >
                <AdvanceFilterModal
                    appliedFilter={filterState}
                    applyFilterCallback={advanceFilterCallbckHndlr}
                    toggleAdvanceFilter={toggleAdvanceFilter}
                    isOpen={open}
                />

            </OffCanvasContainer>
            <ModalContainerUpdated
            id="all-employees-details"
            isOpen={employeeDetailModalState.showModal}
            toggle={()=>toggleEmployeeDetailModal()}
            modalTitle="Assignees Details"
            modalSize="md"
        >
             <EmployeeDetailModal employeeList={employeeDetailModalState?.employees || []} />

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

        </React.Fragment>
    )
}

export default ConcernFeedback;