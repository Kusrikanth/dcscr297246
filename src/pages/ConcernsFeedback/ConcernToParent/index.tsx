import React, { useMemo, useState, useEffect, useRef } from "react";
import { shallowEqual } from "react-redux";
import { useHistory } from "react-router";
//Common Component
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import TableContainer from "../../../Components/Common/TableContainer";
import { SelectInput, ModalContainerUpdated, TextInput, } from "../../../Components/Common";
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
import {  generateColumns, statusFilter } from "./helper";
import classnames from "classnames";
import { generateActionPayload } from "../../../utility/reduxutility";
import {
    getBranchCurriculumAct,
} from "../../../store/branchsettings/branchacademics/branchacademicsactions";
import { IPaginationState } from "../../../Components/Common/Pagination";
import { getConcernsToParentListAct, resetConcernsFeedbackListAct } from "../../../store/concernsfeedback/concernsfeedbacklist/concernsfeedbacklistaction";
import { getComplaintDepartmentListAct } from "../../../store/concernsfeedback/complaintdepartment/complaintdepartmentaction";
import { toast } from "react-toastify";
import ReopenModal from "../ConcernsFeedbackList/ReopenModal";
import { useModal } from "../../../hooks/modalhook";
import { useFilterState } from "../../../hooks/filterhook";
import { EyeIcon, Folder02Icon } from "@hugeicons-pro/core-stroke-standard";
import { HugeiconsIcon } from "@hugeicons/react";
import Button from "../../../Components/Common/Button";

const initialFilterState = {

    academicYearId: null,
    searchString: null,
    status: null,
    complaintById:null,
    branchId : null,
};

const ConcernToParent: React.FC<any> = () => {

    const paginationDetailRef = useRef<IPaginationState>({
        pageNo: 0,
        pageSize: 10,
    });

    const { closeModal:closeReopenModal,modalState:reopenModalState,openModal:openReopenModal } = useModal();
    const {advanceFilterChange,showClearFilterState} = useFilterState();

    const [filterState, setFilterState] = useState<any>({ ...initialFilterState });
    const history = useHistory();

    const dispatch = useAppDispatch();
    
    const {
        academicYearListResp,
        getConcernsToParentListResp,
        currentInstIdResp: instituteId,
        currentBranchIdResp: branchId,
        showApiLoader,
        concernsFeedbackErrResp,
        addCommentListResp,
        parentChildrensResp,
        currentStudentId,
        loggedInUserRole,
        userMeResp,
    } =
        useAppSelector(({ appData, login, instAcademics, globalData, concernsFeedback,directoryStudent, }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            currentInstIdResp: appData.currentInstIdResp,
            currentStudentId: appData.currentStudentId,
            currentBranchIdResp: appData.currentBranchIdResp,
            loggedInUserRole: appData.loggedInUserRole,
            getConcernsToParentListResp: concernsFeedback.getConcernsToParentListResp,
            concernsFeedbackErrResp: concernsFeedback.concernsFeedbackErrResp,
            addCommentListResp: concernsFeedback.addCommentListResp,
            showApiLoader: globalData.showApiLoader,
            userMeResp: login.userMeResp,
            parentChildrensResp: directoryStudent.parentChildrensResp,
        }), shallowEqual);

        const concernFeedbackRef = useRef({
            prevConcernsFeedbackErrResp: concernsFeedbackErrResp,
            prevAddCommentListResp: addCommentListResp,
        });
    
        useEffect(() => {
            const { prevConcernsFeedbackErrResp, prevAddCommentListResp } = concernFeedbackRef.current;
    
            if (addCommentListResp && addCommentListResp !== prevAddCommentListResp) {
                toast.success("Concern Reopened successfully.");
                closeReopenModal();
                getConcernsApiCall();
            }
            else if (concernsFeedbackErrResp && concernsFeedbackErrResp !== prevConcernsFeedbackErrResp) {
                const { details } = concernsFeedbackErrResp || {};
                toast.error(details || "Something went wrong.");
            }
    
            concernFeedbackRef.current.prevAddCommentListResp = addCommentListResp;
            concernFeedbackRef.current.prevConcernsFeedbackErrResp = concernsFeedbackErrResp;
    
        }, [concernsFeedbackErrResp, addCommentListResp]);
        
    function getComplaintDeptApiCall(otherProps?: any) {
        const payload = { branchId, pageNo: 0, pageSize: 100,...otherProps };
        dispatch(getComplaintDepartmentListAct(generateActionPayload("get_complaint_dept_list", undefined, { ...payload })));
    }

    useEffect(() => {
        if (branchId) {
            const brchCurriculumparams = { branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" };
            dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, brchCurriculumparams)));
        }
    }, [branchId]);

    useEffect(() => {
      
      return () => {
        dispatch(resetConcernsFeedbackListAct(undefined))
      }
    }, [])
    
    useEffect(() => {
        const { data } = academicYearListResp || {};
        if (Array.isArray(data) && data.length > 0 && (loggedInUserRole === "TEACHER" || loggedInUserRole === "BRANCH_ADMIN")) {
            let { academicYearId } = data.find((year: any) => year?.yearStatus?.toLowerCase() === "current") || {};
            if (academicYearId) {
                setFilterState((prev: any) => ({ ...prev, academicYearId , branchId }));
                getConcernsApiCall({
                    academicYearId,branchId,
                });
                getComplaintDeptApiCall({ branchId, category: "ACADEMIC" });
            }
        }
    }, [academicYearListResp, loggedInUserRole]);

    useEffect(() => {
        if(parentChildrensResp && currentStudentId && loggedInUserRole === "PARENT_ROLE"){
            const student = parentChildrensResp?.find((item: any) => +item?.childId === +currentStudentId) || {};
            const { academicYearId,  childBranchId, instituteId } = student;
            setFilterState((prev: any) => ({ ...prev, academicYearId, branchId: childBranchId, instituteId }));
            getConcernsApiCall({academicYearId,branchId : childBranchId,});
            getComplaintDeptApiCall({ branchId:childBranchId, category: "ACADEMIC" });
        }
     
    }, [parentChildrensResp,currentStudentId])

    function getConcernsApiCall(otherProps?: any) {
        const payload = {
            ...filterState, ...paginationDetailRef.current, ...otherProps,
        };
       
        if(loggedInUserRole === "TEACHER"){
            payload["complaintById"] = userMeResp?.id
        }else if(loggedInUserRole === "PARENT_ROLE"){
            payload["assigneeUserId"] = userMeResp?.id
            payload["studentId"] = currentStudentId
        }

        dispatch(getConcernsToParentListAct(generateActionPayload("get_concerns_to_parent_list", undefined, { ...payload })));
    }

    function onChangeFilterHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        paginationDetailRef.current.pageNo = 0;
        setFilterState((prevState: any) => ({ ...prevState, [name]: value }));
        getConcernsApiCall({ [name]: value });
        advanceFilterChange({keys : {...filterState, [name]: value, academicYearId: ""} , ignoredKeys :[] })
    }

    function editStudentHndlr(event: any) {
        const complaintId = event.currentTarget.getAttribute("data-id");
        if (complaintId){
            if(loggedInUserRole !== "PARENT_ROLE"){
                history.push(`/concerns-to-parent/view-concern-to-parent`, { complaintId: complaintId });
            }else{
                history.push(`/concerns-from-school/view-concern-from-school`, { complaintId: complaintId });
            }
        }
    }

    const menuOptions = useMemo((): any[] => {
        return ([
            {
                id: "view",
                actionIcon: <HugeiconsIcon icon={EyeIcon} className="me-2 text-muted" size={18} />,
                actionName: "View Details",
                onClickHndlr: editStudentHndlr,
            },
            {
                id: "reopen",
                actionIcon: <HugeiconsIcon icon={Folder02Icon} className="me-2 text-muted" size={18} />,
                actionName: "Re-Open",
                onClickHndlr: (event: any) => {
                    const complaintId = event.currentTarget.getAttribute("data-id");
                    openReopenModal(complaintId)
                },
            }
        ])
    }, [getConcernsToParentListResp]);

    function paginationHndlr(paginationInfo: any) {
        paginationDetailRef.current = paginationInfo;
        getConcernsApiCall(paginationInfo);
    }

    const moveToAddConcern = () => {
        history.push(`/concerns-to-parent/add-concern-to-parent`)
    }

    const clearFilterHndlr = () => {
        if (academicYearListResp) {
            paginationDetailRef.current = { ...paginationDetailRef.current, pageNo: 0 }
            let { academicYearId } = academicYearListResp?.data?.find((year: any) => year?.yearStatus?.toLowerCase() === "current")|| {};
            let updatedBranchId = "";
            if(loggedInUserRole === "PARENT_ROLE"){
                const student = parentChildrensResp?.find((item: any) => +item?.childId === +currentStudentId) || {};
                const { childBranchId } = student;
                updatedBranchId = childBranchId;
            }else{
                updatedBranchId = branchId;
            }
            setFilterState({ ...initialFilterState, academicYearId , branchId : updatedBranchId })
            getConcernsApiCall({ ...initialFilterState, academicYearId , branchId : updatedBranchId });
            advanceFilterChange({keys : {...initialFilterState, academicYearId : ""} , ignoredKeys :[] })
            getComplaintDeptApiCall({ branchId:updatedBranchId, category: "ACADEMIC" });
        }
    }

    const studentColumns = useMemo(() => generateColumns(menuOptions,loggedInUserRole), [getConcernsToParentListResp,loggedInUserRole]),
        { data: studentList, pageNo: pageNumber, totalPages, totalElements: totalRecords } = getConcernsToParentListResp || {};
    return (
        <React.Fragment>
            <div className="page-content">
                <div className="container-fluid">
                    <BreadCrumb title="Students Management" pageTitle="Helpdesk" />

                    <div className="tw-mb-4">
                        <div className="tw-w-full">
                            <div className="tw-bg-white tw-rounded-lg tw-shadow" id="tasksList">

                                <div className="tw-border-b tw-px-4 tw-py-3">
                                    <div className="tw-flex tw-items-center">
                                        <h4 className="tw-text-base tw-font-semibold tw-flex-grow tw-mb-0">
                                            {"Tickets / Feedback List"}
                                        </h4>

                                        <div className="tw-flex-shrink-0 tw-text-center">
                                            {loggedInUserRole === "TEACHER" && (
                                                <Button
                                                variant="primary"
                                                    onClick={moveToAddConcern}
                                                >
                                                    <i className="ri-add-line" />
                                                    <span>Add Request</span>
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="tw-p-0">
                                    <div className="tw-px-4 tw-py-3">
                                        <div className="tw-grid tw-grid-cols-12 tw-gap-3">

                                            <div className="tw-col-span-6 xl:tw-col-span-4">
                                                <div className="tw-relative search-box">
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
                                                    <i className="ri-search-line tw-absolute tw-left-3 tw-top-1/2 -tw-translate-y-1/2 tw-text-gray-400" />
                                                </div>
                                            </div>

                                            <div className="tw-col-span-6 xl:tw-col-span-2">
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

                                            <div className="tw-col-span-6 xl:tw-col-span-2">
                                                <SelectInput
                                                    name="status"
                                                    value={filterState.status}
                                                    onChange={onChangeFilterHndlr}
                                                    menuItems={statusFilter}
                                                    formgroupClassName="tw-mb-0"
                                                    labelText="Status"
                                                    floatingLabel
                                                    valueKey="id"
                                                    textKey="name"
                                                />
                                            </div>

                                            <div className="tw-col-auto tw-ml-auto tw-flex tw-items-end">
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
                                        columns={studentColumns}
                                        data={Array.isArray(getConcernsToParentListResp?.data)
                                            ? getConcernsToParentListResp?.data
                                            : []}
                                        divClass="tw-overflow-x-auto tw-mb-3"
                                        tableClass="tw-w-full tw-whitespace-nowrap"
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
                id="reopen-ticket-modal"
                isOpen={reopenModalState.showModal}
                toggle={closeReopenModal}
                modalTitle="Reopen Tikcet"
                modalSize="md"
            >
                <ReopenModal
                    toggle={closeReopenModal}
                    complaintId={reopenModalState.modalData}
                />
            </ModalContainerUpdated>


        </React.Fragment>
    )
}

export default ConcernToParent;