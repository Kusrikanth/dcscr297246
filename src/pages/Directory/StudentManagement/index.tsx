import React, { useMemo, useState, useEffect, useRef } from "react";
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown, UncontrolledTooltip } from "reactstrap";
import { shallowEqual } from "react-redux";
import { useHistory } from "react-router";
//Common Component

import BreadCrumb from "../../../Components/Common/BreadCrumb";
import TableContainer from "../../../Components/Common/TableContainer";
import { SelectInput, ModalContainerUpdated, OffCanvasContainer, SearchInput } from "../../../Components/Common";
import { AutoSearchInput } from "../../../Components/Common/AutoSearchInput";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
//Helper
import { generateColumns, getAppliedFiltersInfo, initialAdvanceFilterState, initialFilterState, searchInputOptions, statusFilter } from "./helper";
//Icon
import ExportIcon from "../../../assets/imagesdps/common_icon/export_icon.svg";
import classnames from "classnames";
//Images & icons
import Statistics from "./Statistics";
//Action Generator
import { generateActionPayload } from "../../../utility/reduxutility";
import {
    getBranchCurriculumAct, resetBrchCurriculumAct, resetBrchSectionByClassAct, setBrchClassAct,
} from "../../../store/branchsettings/branchacademics/branchacademicsactions";
import {
    exportStudentDataAct, setStudentsListAct,
    getStudentsListAct, getStudentsStatsAct, setStudentsStatsAct,
    exportStudentRegistrationDataAct
} from "../../../store/directory/studentmanagement/studentmanagementactions";
import { useParams, useLocation } from "react-router-dom";
import {
    getStudentByFilterAct
} from "../../../store/directory/studentmanagement/studentmanagementactions";
import {
    getInstAcademicYearAct,
} from "../../../store/mastersettings/instacademics/instacademicactions";
import { toast } from "react-toastify";
import { csvExportHndlr, downloadExcelFile, getSortingKeys, sanitizeUrlParams } from "../../../utility/commonutility";
import { default as FilterSvg } from "../../../assets/imagesdps/academics/FilterSvg.svg?react";

//Interface & Types
import { IPaginationState } from "../../../Components/Common/Pagination";
import ExportModal from "./ExportModal";
import AdvanceFilterModal from "./AdvancedFilterModal";
import { getInstBranchesAct } from "../../../store/mastersettings/branch/branchactions";
import { IAdvanceFilterState, IFilterPayload, IFilterState } from "./types";
import { HugeiconsIcon } from "@hugeicons/react";
import { EyeIcon } from "@hugeicons-pro/core-stroke-standard";

import { useModal } from "../../../hooks/modalhook";
import Button from "../../../Components/Common/Button";

const StudentManagement: React.FC<any> = () => {
    const { closeModal: closeExportConfirmationModal, modalState: exportConfirmationModalState, openModal: openExportConfirmationModal } = useModal()
    const [exportModal, setExportModal] =
        useState({
            showModal: false,
        });
    const [open, setOpen] = useState<boolean>(false);
    const [appliedFilterState, setAppliedFilterState] = useState({
        count: 0,
        canClearFilter: false
    })
    const { pathname } = useLocation();
    const pageTitleName = useMemo(() => {
        if (pathname.includes("student-management")) {
            return "Directory";
        }
        return "Front Desk";
    }, [pathname]);
    const [searchStudentState, setSearchStudentState] = useState("global");
    const paginationDetailRef = useRef<IPaginationState>({
        pageNo: 0,
        pageSize: 10,
    });
    const sortingRef = useRef(undefined);
    const history = useHistory();

    const dispatch = useAppDispatch();
    const { studentsStatsResp, getStudentsByFilterResp, studentsListResp,
        currentInstCodeResp: instituteCode,
        academicYearListResp, instAcademicErrorResp, deleteStudentResp, loggedInUserRole
        , virtualRoleResp, branchListResp, exportStudentDataResp,
        currentInstIdResp: instituteId, currentBranchIdResp: branchId, studentManagementErrorResp, instituteListResp, showApiLoader } =
        useAppSelector(({ appData, branch, directoryStudent, instAcademics, globalData, instituteInfo }) => ({
            studentsStatsResp: directoryStudent.studentsStatsResp,
            getStudentsByFilterResp: directoryStudent.getStudentsByFilterResp,
            studentsListResp: directoryStudent.studentsListResp,
            deleteStudentResp: directoryStudent.deleteStudentResp,
            academicYearListResp: instAcademics.academicYearListResp,
            instAcademicErrorResp: instAcademics.instAcademicErrorResp,
            branchListResp: branch.branchListResp,
            exportStudentDataResp: directoryStudent.exportStudentDataResp,
            currentInstIdResp: appData.currentInstIdResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            loggedInUserRole: appData.loggedInUserRole,
            virtualRoleResp: appData.virtualRoleResp,
            currentInstCodeResp: appData.currentInstCodeResp,
            studentManagementErrorResp: directoryStudent.studentManagementErrorResp,
            instituteListResp: instituteInfo.instituteListResp,
            showApiLoader: globalData.showApiLoader,
        }), shallowEqual);

    const showInstituteAdminUI = loggedInUserRole === 'INSTITUTE_ADMIN' && !virtualRoleResp;
    const canViewStatistics = useMemo(() => {
        if (loggedInUserRole === 'INSTITUTE_ADMIN') {
            return Boolean(virtualRoleResp);
        }
        return loggedInUserRole !== 'TEACHER';
    }, [loggedInUserRole, virtualRoleResp]);

    const canExport = useMemo(() => {
        return loggedInUserRole !== 'EY_PA';
    }, [loggedInUserRole]);

    const [filterState, setFilterState] = useState<IFilterState>({ ...initialFilterState, branchId: (branchId ? branchId?.toString() : '') });
    const currentAcademicYearId = useRef<string | undefined>();
    const advanceFilterRef = useRef<IAdvanceFilterState>({ ...initialAdvanceFilterState });
    const studentRespRef = useRef({
        prevDeleteStudentResp: deleteStudentResp,
        prevInstAcademicErrorResp: instAcademicErrorResp,
        prevAcademicYearListResp: academicYearListResp,
        prevExportStudentDataResp: exportStudentDataResp,
        prevStudentManagementErrorResp: studentManagementErrorResp
    });
    useEffect(() => {
        const { prevAcademicYearListResp,
            prevExportStudentDataResp, prevInstAcademicErrorResp, prevStudentManagementErrorResp, } = studentRespRef.current;
        if (academicYearListResp && prevAcademicYearListResp !== academicYearListResp) {
            if (Array.isArray(academicYearListResp?.data)) {
                const { academicYearId }: any = academicYearListResp?.data.find((item: any) => item.yearStatus === "CURRENT") || {};
                if (academicYearId) {
                    currentAcademicYearId.current = academicYearId?.toString();
                    setFilterState((prevState: any) => ({ ...prevState, academicYearId: academicYearId?.toString() }));
                    getStudentsApiCall({ academicYearId });
                    if (canViewStatistics) {
                        const studentsStatsParams = { branchId, academicYearId };
                        dispatch(getStudentsStatsAct(generateActionPayload("get_students_stats", undefined, studentsStatsParams)));
                    }
                }
            }
        } else if (exportStudentDataResp && prevExportStudentDataResp !== exportStudentDataResp) {
            toggleExportModalHandler();
            csvExportHndlr(exportStudentDataResp, "StudentData");
        } else if (instAcademicErrorResp && instAcademicErrorResp !== prevInstAcademicErrorResp) {
            const { details } = instAcademicErrorResp;
            toast.error(details);
        } else if (studentManagementErrorResp && prevStudentManagementErrorResp !== studentManagementErrorResp) {
            const { details } = studentManagementErrorResp;
            toast.error(details);
        }
        studentRespRef.current.prevAcademicYearListResp = academicYearListResp;
        studentRespRef.current.prevExportStudentDataResp = exportStudentDataResp;
        studentRespRef.current.prevStudentManagementErrorResp = studentManagementErrorResp;
        studentRespRef.current.prevInstAcademicErrorResp = instAcademicErrorResp;
    }, [branchId, canViewStatistics, academicYearListResp,
        exportStudentDataResp, instAcademicErrorResp, studentManagementErrorResp]);

    useEffect(() => {
        if (instituteId) {
            const payload = { instituteId, sortBy: "academicYearName", orderBy: "desc", pageNo: 0, pageSize: 20 };
            dispatch(getInstAcademicYearAct(generateActionPayload("get_inst_academic_year", undefined, payload)));
        }
    }, [instituteId]);

    useEffect(() => {
        if (!branchListResp && loggedInUserRole === 'INSTITUTE_ADMIN') {
            const payload = { pageSize: 100, pageNo: 0, instituteId };
            dispatch(getInstBranchesAct(generateActionPayload("get_inst_branches", undefined, payload)));
        }
    }, [instituteId, branchListResp, loggedInUserRole]);

    useEffect(() => {
        if (branchId && !showInstituteAdminUI) {
            if (academicYearListResp) {
                const { academicYearId }: any = academicYearListResp?.data.find((item: any) => item.yearStatus === "CURRENT") || {};
                const brchCurriculumparams = { branchId, pageNo: 0, pageSize: 100, academicYearId, sortBy: "curriculumName", orderBy: "asc" };
                dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, brchCurriculumparams)));
            }
        }
    }, [branchId, showInstituteAdminUI]);

    useEffect(() => {
        return () => {
            dispatch({ type: "RESET_STUDENTMANGEMENT_STORE" });
            dispatch({ type: "RESET_BRANCHACADEMIC_STORE" });
        }
    }, [dispatch]);

    function onChangeFilterHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        //Resest page number to 0 if filters are applied
        paginationDetailRef.current.pageNo = 0;
        if (name === "academicYearId") {
            if (value) {
                getStudentsApiCall({ [name]: value, curriculumId: "", classId: "", sectionId: "" });
                dispatch(setBrchClassAct(undefined));
                dispatch(resetBrchSectionByClassAct(undefined));
                setFilterState((prevState: any) => ({ ...prevState, [name]: value, studentIds: "", curriculumId: "", classId: "", sectionId: "" }));
                advanceFilterRef.current = { ...initialAdvanceFilterState, curriculumId: "", classId: "", sectionId: "" };
                if (filterState.branchId) {
                    const brchCurriculumparams = { branchId: filterState.branchId, academicYearId: value, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" };
                    dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, brchCurriculumparams)));
                }
                if (canViewStatistics) {
                    const studentsStatsParams = { branchId: filterState.branchId, academicYearId: value };
                    dispatch(getStudentsStatsAct(generateActionPayload("get_students_stats", undefined, studentsStatsParams)));
                }
            } else {
                dispatch(setStudentsListAct(undefined));
                dispatch(setStudentsStatsAct(undefined));
                setFilterState((prevState: any) => ({
                    ...prevState, [name]: value,
                    studentIds: "", curriculumId: "", classId: "", sectionId: ""
                }));
            }
        } else if (name === 'branchId') {
            if (value) {
                const brchCurriculumparams = { branchId: value, academicYearId: filterState.academicYearId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" };
                dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, brchCurriculumparams)));
            }
            advanceFilterRef.current = { ...advanceFilterRef.current, curriculumId: '', classId: '', sectionId: '' };
            dispatch({ type: "RESET_BRANCHACADEMIC_STORE" });
            setFilterState((prevState) => ({ ...prevState, [name]: value }));
            getStudentsApiCall({ [name]: value });
        } else {
            setFilterState((prevState) => ({ ...prevState, [name]: value }));
            getStudentsApiCall({ [name]: value });
        }
    }

    function editStudentHndlr(event: any) {
        const studentId = event.currentTarget.getAttribute("data-id"),
            { academicYearId } = filterState;
        if (studentId && academicYearId)
            history.push(`${pathname}/edit-student/${studentId}/${academicYearId}`);
    }

    const menuOptions = useMemo((): any[] => {
        return ([{
            id: "view",
            actionIcon: <HugeiconsIcon icon={EyeIcon} className="me-2 text-muted" size={18} />,
            actionName: "View Student Info",
            onClickHndlr: editStudentHndlr,
        }])
    }, [studentsListResp]);

    function getStudentsApiCall(otherProps?: Partial<IFilterPayload>) {
        const sortingParams = getSortingKeys(sortingRef.current, true);
        const filterPayload = {
            ...filterState,
            nameFilterType: searchStudentState,
            ...advanceFilterRef.current,
            ...otherProps,
        }
        setAppliedFilterState(prevState => ({ ...prevState, ...getAppliedFiltersInfo(filterPayload, currentAcademicYearId.current, loggedInUserRole) }))
        dispatch(getStudentsListAct(generateActionPayload("get_students", undefined, sanitizeUrlParams({
            instituteId,
            ...filterPayload,
            ...paginationDetailRef.current, ...sortingParams
        }))));
    }
    const toggleExportModalHandler = () => {
        setExportModal((prev: any) => ({ ...prev, showModal: !prev.showModal }))
    }
    function submitHndlr() {
        const params = {
            instituteId, ...filterState, ...advanceFilterRef.current,
            pageNo: 0, pageSize: 5000
        };
        dispatch(exportStudentDataAct(generateActionPayload("export_student_data", undefined,
            sanitizeUrlParams(params), {
            responseType: 'blob'
        })));
    }

    const exportModalHndler = () => {
        let payload = {
            ...filterState, ...advanceFilterRef.current,
            pageNo: 0, pageSize: 5000
        };
        dispatch(exportStudentRegistrationDataAct(generateActionPayload('export_student_registration_data', undefined, { ...payload }, {
            responseType: 'blob'
        })))
    }

    function clearFilterHndlr() {
        const payload = {
            ...initialFilterState, academicYearId: currentAcademicYearId.current,
            branchId: !showInstituteAdminUI ? filterState.branchId : ''
        };
        //Resest page number to 0 if filters are applied
        paginationDetailRef.current.pageNo = 0;
        advanceFilterRef.current = initialAdvanceFilterState;
        setFilterState(payload);
        dispatch(resetBrchCurriculumAct(undefined));
        dispatch(setBrchClassAct(undefined));
        dispatch(resetBrchSectionByClassAct(undefined));
        setAppliedFilterState(prevState => ({ ...prevState, count: 0, canClearFilter: false }))
        getStudentsApiCall(payload);
        if (canViewStatistics) {
            const studentsStatsParams = { branchId: filterState.branchId, academicYearId: currentAcademicYearId.current };
            dispatch(getStudentsStatsAct(generateActionPayload("get_students_stats", undefined, studentsStatsParams)));
            const brchCurriculumparams = { branchId: filterState.branchId, academicYearId: currentAcademicYearId.current, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" };
            dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, brchCurriculumparams)));
        }
    }

    function onInputSearchChange(inputString: any) {
        dispatch(getStudentByFilterAct(generateActionPayload("get_students_by_name", undefined, {
            instituteId,
            branchId: filterState.branchId, academicYearId: filterState.academicYearId,
            studentName: inputString || "a",
            pageNo: 0, pageSize: 50
        })));
    }

    function selectedStudentHndlr(selectedStudent: any) {
        //Resest page number to 0 if filters are applied
        paginationDetailRef.current.pageNo = 0;
        if (selectedStudent) {
            const { id } = selectedStudent;
            setFilterState((prevState) => ({ ...prevState, studentIds: id, }));
            getStudentsApiCall({ studentIds: id });
        } else {
            const { studentIds, academicYearId, ...otherFilter } = filterState;
            const filterValues = Object.values(otherFilter);
            setFilterState((prevState) => ({ ...prevState, studentIds: "" }));
            getStudentsApiCall({ studentIds: "" });
        }
    }

    function paginationHndlr(paginationInfo: IPaginationState) {
        paginationDetailRef.current = paginationInfo;
        getStudentsApiCall();
    }

    function sortingHandler(sortingKeys: any) {
        if (sortingRef.current && sortingRef.current !== sortingKeys) {
            sortingRef.current = sortingKeys;
            getStudentsApiCall();
            //Testing
        } else {
            sortingRef.current = sortingKeys;
        }
    }

    const toggleAdvanceFilter = () => {
        setOpen((prev) => !prev);
    }

    function advanceFilterCallbckHndlr(appliedFilters: IAdvanceFilterState) {
        paginationDetailRef.current.pageNo = 0;
        advanceFilterRef.current = appliedFilters;
        getStudentsApiCall(appliedFilters)
    }

    const redirectUrlHndler = (studentId?: string) => {
        const { academicYearId } = filterState;
        if (studentId && academicYearId)
            return `${pathname}/edit-student/${studentId}/${academicYearId}`
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
                getStudentsApiCall(updatedState);
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
            getStudentsApiCall(updatedState);
            return updatedState;
        });
    }
    function addStudentHndlr() {
        history.push("/student-management/add-student");
    }

    const hasAddAccess = useMemo(() => {
        if (instituteCode === 'PIS') {
            return loggedInUserRole === "ADM_CONS" ||
                loggedInUserRole === "BRANCH_ADMIN" ||
                loggedInUserRole === "INSTITUTE_ADMIN"
        }
        return false;
    }, [loggedInUserRole, instituteCode]);

    const selectedInstitute = instituteListResp?.data?.find(
        (item: any) => Number(item.id) === Number(instituteId)
    );

    const isPF1Institute = selectedInstitute?.shortName === "PF1";

    const isBranchAdminAndPF1 =
        canViewStatistics && isPF1Institute;

    const studentColumns = useMemo(() => {
        const columnsList = generateColumns(menuOptions, redirectUrlHndler, showInstituteAdminUI);
        if (showInstituteAdminUI) {
            return columnsList.filter(item => item.accessor !== 'actions');
        }
        return columnsList.filter(item => item.accessor !== 'branchName');
    }, [studentsListResp, showInstituteAdminUI]),
        { data: studentList, pageNumber, totalPages, totalRecords } = studentsListResp || {};

    return (
        <React.Fragment>
            <div className="page-content">
                <div className="container-fluid">
                    <BreadCrumb title="Students Management" pageTitle={pageTitleName} />

                    {canViewStatistics && (
                        <Statistics statsInfo={studentsStatsResp} />
                    )}

                    <div className="tw-grid tw-grid-cols-1 tw-mb-4 ">
                        <div className="tw-col-span-1">
                            <div className="tw-bg-white tw-rounded-md tw-shadow-sm" id="tasksList">

                                {/* Header */}
                                <div className="tw-py-2 tw-px-4 tw-border-b">
                                    <div className="tw-flex tw-items-center">
                                        <h4 className="tw-text-base tw-font-semibold tw-flex-grow tw-mb-0">
                                            Student Directories
                                        </h4>

                                        <div className="tw-ml-auto tw-flex tw-gap-2">
                                            <Button
                                                onClick={toggleExportModalHandler}
                                                variant="info"
                                            >
                                                <i className="ri-add-line"></i>
                                                <span>Export</span>
                                            </Button>
                                            {isBranchAdminAndPF1 && (
                                                <Button
                                                    variant="primary"
                                                    className="!tw-whitespace-nowrap"
                                                    type="button"
                                                    onClick={addStudentHndlr}
                                                >
                                                    <i className="ri-add-line" /> Add
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Body */}
                                <div className="tw-p-0">
                                    <div className="tw-px-4 tw-py-3">
                                        <div className="tw-grid tw-grid-cols-12 tw-gap-3">

                                            {/* Search */}
                                            <div className="tw-col-span-12 xl:tw-col-span-5">
                                                <SearchInput
                                                    hideDefaultSelect
                                                    name="searchString"
                                                    value={searchStudentState}
                                                    menuItems={searchInputOptions}
                                                    idKey="id"
                                                    labelName="Search With"
                                                    searchHandler={onSearchHandler}
                                                    onChange={onChangeHandler}
                                                    renderSelectedValue={(item) => item?.name}
                                                    renderOptions={(item) => item?.name}
                                                />
                                            </div>

                                            {/* Academic Year */}
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

                                            {/* Branch (Institute Admin only) */}
                                            {showInstituteAdminUI && (
                                                <div className="tw-col-span-6 xl:tw-col-span-2">
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

                                            {/* Status */}
                                            <div className="tw-col-span-6 xl:tw-col-span-2">
                                                <SelectInput
                                                    name="status"
                                                    value={filterState.status}
                                                    onChange={onChangeFilterHndlr}
                                                    menuItems={statusFilter}
                                                    formgroupClassName="tw-mb-0"
                                                    valueKey="id"
                                                    textKey="name"
                                                    labelText="Status"
                                                    floatingLabel
                                                />
                                            </div>

                                            {/* Filter Button */}
                                            <div className="tw-col-span-1 tw-relative">
                                                <div
                                                    onClick={toggleAdvanceFilter}
                                                    className="
                      tw-flex
                      tw-items-center
                      tw-gap-2
                      tw-bg-[#F4F7FA]
                      tw-p-2
                      tw-rounded-md
                      tw-cursor-pointer
                    "
                                                >
                                                    <FilterSvg height="18px" width="18px" />
                                                    <span>Filters</span>
                                                </div>

                                                {!!appliedFilterState.count && (
                                                    <span
                                                        className="
                        tw-absolute
                        tw--top-2
                        tw-left-12
                        tw-bg-emerald-500
                        tw-text-white
                        tw-text-xs
                        tw-rounded-full
                        tw-px-2
                      "
                                                    >
                                                        {appliedFilterState.count}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Clear Filter */}
                                            {appliedFilterState.canClearFilter && (
                                                <div className="tw-col-span-2 tw-flex tw-justify-end tw-items-center">
                                                    <Button
                                                        type="button"
                                                        onClick={clearFilterHndlr}
                                                        variant="wrong"
                                                    >
                                                        Clear filter
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Table */}
                                    <TableContainer
                                        columns={studentColumns}
                                        data={Array.isArray(studentList) ? studentList : []}
                                        divClass="tw-overflow-x-auto tw-mb-3"
                                        tableClass="tw-whitespace-nowrap"
                                        theadClass="tw-table-light tw-text-gray-500 tw-align-middle"
                                        showPagination={true}
                                        totalPages={totalPages}
                                        totalRecords={totalRecords}
                                        callbackPaginationHndlr={paginationHndlr}
                                        currentPageNumber={pageNumber}
                                        manualSorting
                                        sortingHandler={sortingHandler}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ModalContainerUpdated
                id="export-student-management-modal"
                isOpen={exportModal.showModal}
                toggle={toggleExportModalHandler}
                modalTitle="Export Students Data"
                modalSize="md"
            >
                <ExportModal
                    isOpen={exportModal.showModal}
                    toggle={toggleExportModalHandler}
                    instituteId={instituteId}
                    branchId={filterState.branchId}
                    submitHndlr={submitHndlr}
                    feature="directory"
                    subFeature="student_management"
                    remarksText="Enter remarks to export students data?"
                />
            </ModalContainerUpdated>
            <OffCanvasContainer
                isOpen={open}
                headerTitle="Advance Filters"
                closeHndlr={toggleAdvanceFilter}
                id="student-mangement-advance-filter"
            >
                <AdvanceFilterModal
                    academicYearId={filterState.academicYearId}
                    branchId={filterState.branchId}
                    appliedFilter={advanceFilterRef.current}
                    applyFilterCallback={advanceFilterCallbckHndlr}
                    toggleAdvanceFilter={toggleAdvanceFilter}
                    isOpen={open}
                />
            </OffCanvasContainer>
            <ModalContainerUpdated
                id="student-concession-export-modal"
                isOpen={exportConfirmationModalState.showModal}
                toggle={closeExportConfirmationModal}
                modalTitle="Export Student Registration Data"
                modalSize="md"
            >
                <ExportModal
                    isOpen={exportConfirmationModalState.showModal}
                    toggle={closeExportConfirmationModal}
                    instituteId={instituteId}
                    branchId={branchId}
                    submitHndlr={exportModalHndler}
                    feature="directory"
                    subFeature="student_management"
                    remarksText="Enter remarks to export Student Registration Data?"
                />
            </ModalContainerUpdated>
        </React.Fragment>
    )
}

export default StudentManagement;