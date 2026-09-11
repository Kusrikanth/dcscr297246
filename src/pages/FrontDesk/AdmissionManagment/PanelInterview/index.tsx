import React, { useRef, useEffect, useMemo, useState, useCallback } from "react";
import { shallowEqual } from "react-redux";
import { useHistory } from 'react-router-dom';
import { toast } from "react-toastify";
import {
    ModalContainerUpdated, SelectInput, TextInput, DateInput,
    ConfirmationModal,
    OffCanvasContainer
} from '../../../../Components/Common';
import TableContainer from '../../../../Components/Common/TableContainer';
// import { PreliminaryScrutinyData, generateColumns } from './helper';
import { default as FilterSvg } from "../../../../assets/imagesdps/academics/FilterSvg.svg?react";

//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
//Action Generator
import { generateActionPayload } from "../../../../utility/reduxutility";
import {
    getInstAcademicYearAct,
} from "../../../../store/mastersettings/instacademics/instacademicactions";
import {
    getBranchCurriculumAct, getBranchClassAct,
    setBrchClassAct,
    resetBrchCurriculumAct,
    resetBrchClassAct,
} from "../../../../store/branchsettings/branchacademics/branchacademicsactions";
import {
    getInterviewSchedulesListAct, delInterviewAct, getEvaluationClassList, exportPanIntListAct, resetEvaluationClassList
} from "../../../../store/FrontDesk/Interview/interviewactions";
import { getStatasticResp } from "../../../../store/FrontDesk/AdmissionManagment/applicationmanagmentaction";
import { setRegistrationTabIdAct } from "../../../../store/global/globalslice";
import { MenuOptions, generateColumnsForPanelInterivew, hasStateChanged } from "./helper";
import StudentExamDetailModal from "./StudentExamDetailModal";
import AllStudentExamDetailModal from "./AllStudentExamDetailModal";
import AdvanceFilterModal from "./AdvancedFilterModal";
import ModifiedHorizontalTab from "../../../../Components/Common/ModifiedHorizontalTab";
import ExportModal from "../../../Directory/StudentManagement/ExportModal";
import { downloadExcelFile } from "../../../../utility/commonutility";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02StrokeStandard, PencilEdit02Icon } from "@hugeicons-pro/core-stroke-standard";
import Button from "../../../../Components/Common/Button";

const initialFilterState = {
    academicYearId: "",
    curriculumId: "",
    classId: "",
    scheduleMode: null,
    interviewDate: null,
    endDate: "",
    startDate: "",
    searchString: "",
    rescheduleFilter: "",
    forReSchedule: false,
    isAbsent: false,
    isReObservation: false,
    admissionSource: null
}

const PanelInterview = ({ tabId }: any) => {
    const [filterState, setFilterState] = useState(initialFilterState);
    const [students, setStudents] = useState([]);
    const [open, setOpen] = useState<boolean>(false);
    const [count, setCount] = useState<any>(null);
    const [showClearFilterState, setShowClearFilterState] = useState(false);
    const [menuId, setMenuId] = useState<string | null>("panelInterviewSchedule");
    const [stuExamDetailModalState, setStuExamDetailModalState] = useState({
        showModal: false,
        examId: undefined
    })
    const [delInterviewModalState, setDelInterviewModalState] = useState({
        showModal: false,
        interviewId: ""
    })
    const history = useHistory();
    const {
        branchClassResp,
        academicYearListResp,
        brchCurriculumResp,
        currentInstIdResp: instituteId, currentBranchIdResp: branchId,
        interviewSchedulesListResp,
        delInterviewResp, registrationTabId,
        evaluationClassList,
        showApiLoader, exportPanIntListResp,
        interviewErrorResp } =
        useAppSelector(({ appData, branchAcademics, globalData,
            instAcademics, interview }) => ({
                branchClassResp: branchAcademics.branchClassResp,
                brchCurriculumResp: branchAcademics.brchCurriculumResp,
                academicYearListResp: instAcademics.academicYearListResp,
                currentInstIdResp: appData.currentInstIdResp,
                currentBranchIdResp: appData.currentBranchIdResp,
                delInterviewResp: interview.delInterviewResp,
                exportPanIntListResp: interview.exportPanIntListResp,
                showApiLoader: globalData.showApiLoader,
                evaluationClassList: interview.evaluationClassList,
                interviewSchedulesListResp: interview.interviewSchedulesListResp,
                interviewErrorResp: interview.interviewErrorResp,
                registrationTabId: globalData.registrationTabId,
            }), shallowEqual);
    const feeDetailsRespRef = useRef({
        prevDelInterviewResp: delInterviewResp,
        prevExportPanIntListResp: exportPanIntListResp,
        prevInterviewErrorResp: interviewErrorResp
    });
    const paginationDetailRef = useRef({
        pageNo: 0,
        pageSize: 10,
    });

    const dispatch = useAppDispatch();

    useEffect(() => {
        return () => {
            dispatch(resetBrchCurriculumAct(undefined));
            dispatch(resetBrchClassAct(undefined));
        }
    }, []);

    useEffect(() => {
        if (Array.isArray(academicYearListResp?.data)) {
            const { academicYearId } = academicYearListResp?.data?.find((year: any) => year.isAdmissionDefault) || {};
            setFilterState((prevState: any) => ({ ...prevState, academicYearId }));
            getCurriculumApiCall({ academicYearId });
            dispatch(getStatasticResp(generateActionPayload('get_statastic', undefined, { academicYearId, branchId })))
            getScheduleInterviewApiCall({ academicYearId });
        }
    }, [academicYearListResp])

    useEffect(() => {
        const { prevDelInterviewResp,
            prevInterviewErrorResp, prevExportPanIntListResp } = feeDetailsRespRef.current;
        if (delInterviewResp && delInterviewResp !== prevDelInterviewResp) {
            setDelInterviewModalState((prevState: any) => ({ ...prevState, showModal: false, interviewId: "" }));
            toast.success("Interview deleted successfully.");
            getScheduleInterviewApiCall();
        }
        if (exportPanIntListResp && exportPanIntListResp !== prevExportPanIntListResp) {
            toast.success("Interview Data Download Successfully.");
            downloadExcelFile(exportPanIntListResp, 'Panel_Interview')
            toggleExportExcelModal();
        }
        else if (interviewErrorResp && interviewErrorResp !== prevInterviewErrorResp) {
            const { message }: any = interviewErrorResp;
            toast.error(message || "Something went wrong.");
        }
        feeDetailsRespRef.current.prevDelInterviewResp = delInterviewResp;
        feeDetailsRespRef.current.prevExportPanIntListResp = exportPanIntListResp;
        feeDetailsRespRef.current.prevInterviewErrorResp = interviewErrorResp;
    }, [delInterviewResp, interviewErrorResp, exportPanIntListResp]);

    const editInterviewHndlr = (event: any) => {
        const interviewId = event.currentTarget.getAttribute("data-id");
        if (interviewId) {
            dispatch(setRegistrationTabIdAct(tabId));
            if (menuId === "panelInterviewReschedule") {
                history.push(`/admission-management/interview-reschedule/${interviewId}`);
            } else {
                history.push(`/admission-management/interview/${interviewId}`);
            }
        }
    }

    function deleteInterviewHndlr(event: any) {
        const interviewId = event.currentTarget.getAttribute("data-id");
        if (interviewId)
            setDelInterviewModalState((prevState: any) => ({ ...prevState, showModal: true, interviewId }));
    }
    const menuOptions = useMemo(
        () => [
            {
                id: "edit",
                actionIcon: <HugeiconsIcon icon={PencilEdit02Icon} className="me-2 text-muted" size={18} />,
                actionName: "Edit",
                onClickHndlr: editInterviewHndlr
            },
            {
                id: "delete",
                actionIcon: <HugeiconsIcon icon={Delete02StrokeStandard} className="me-2 text-danger" size={18} />,
                actionName: "Delete",
                onClickHndlr: deleteInterviewHndlr
            },
        ],
        [menuId]
    );

    const togglePanelInterviewModal = () => {
        dispatch(setRegistrationTabIdAct(tabId));
        if (menuId === "panelInterviewReschedule") {
            history.push('/admission-management/interview-reschedule');
        } else {
            history.push('/admission-management/interview');
        }
    }

    const getCurriculumApiCall = (otherProps?: any) => {
        const payload1 = { academicYearId: filterState.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", ...otherProps };
        dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
    }

    function onChangeFilterHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        paginationDetailRef.current.pageNo = 0;
        let stateChanged = hasStateChanged({ ...filterState, [name]: value, academicYearId: "" });
        if (name === "academicYearId") {
            !(value === "") && dispatch(getStatasticResp(generateActionPayload('get_statastic', undefined, { academicYearId: +value, branchId })))
            getCurriculumApiCall({ academicYearId: value });
            dispatch(resetEvaluationClassList(undefined));
            setFilterState((prev: any) => ({ ...prev, [name]: value, classId: null, curriculumId: "" }));
            stateChanged = hasStateChanged({ ...filterState, academicYearId: "", classId: null, curriculumId: "" });
            getScheduleInterviewApiCall({ [name]: value, classId: null, curriculumId: "" });
        }
        else if (name === "curriculumId") {
            if (value) {
                getClassApiCall({ curriculumId: value, academicYearId: filterState.academicYearId });
            }
            else {
                dispatch(resetEvaluationClassList(undefined));
            }
            setFilterState((prevState: any) => ({ ...prevState, [name]: value, classId: "" }));
            getScheduleInterviewApiCall({ [name]: value, classId: "" });
        } else {
            setFilterState((prevState: any) => ({ ...prevState, [name]: value }));
            getScheduleInterviewApiCall({ [name]: value });
        }
        setShowClearFilterState(stateChanged?.stateChange)
        stateChanged?.count === 0 ? setCount(null) : setCount(stateChanged?.count)
    }

    function paginationHndlr(paginationInfo: any) {
        paginationDetailRef.current = paginationInfo;
        getScheduleInterviewApiCall();
    }

    function getClassApiCall(otherProps?: any) {
        // sortBy: "className", orderBy: "asc"
        const { academicYearId, curriculumId } = filterState;
        const payload = { academicYearId: academicYearId, branchId, curriculumId, evaluationCode: "PINT", ...otherProps };
        if (payload.academicYearId && payload.curriculumId) {
            dispatch(getEvaluationClassList(generateActionPayload('get_evaluation_class_list', undefined, payload)))
        }
    }

    function getScheduleInterviewApiCall(otherProps?: any) {
        let payload = { instituteId, branchId, ...filterState, ...otherProps, ...paginationDetailRef.current, sortBy: "lastModifiedAt", orderType: "desc" };
        if (menuId === "panelInterviewReschedule") {
            if (payload?.rescheduleFilter === "ABSENT") {
                payload = { ...payload, forReSchedule: true, isAbsent: true, isReObservation: false }
            } else if (payload?.rescheduleFilter === "REOBSERVATION") {
                payload = { ...payload, forReSchedule: true, isReObservation: true, isAbsent: false }
            } else {
                payload = { ...payload, forReSchedule: true, isReObservation: false, isAbsent: false }
            }
        }
        delete payload?.rescheduleFilter
        if (payload.academicYearId) {
            dispatch(getInterviewSchedulesListAct(generateActionPayload("get_scheduled_interview", undefined, payload)));
        }
    }
    useEffect(() => {
        if (academicYearListResp && menuId) {
            const { academicYearId = "" } = academicYearListResp?.data?.find((year: any) => year.isAdmissionDefault) || {};
            paginationDetailRef.current.pageNo = 0
            // dispatch(setRegistrationTabIdAct(tabId));
            setShowClearFilterState(false)
            setCount(null)
            setFilterState({ ...initialFilterState, academicYearId })
            getScheduleInterviewApiCall({ ...initialFilterState, academicYearId })
        }
    }, [menuId])

    function delModalCancelHndlr() {
        setDelInterviewModalState((prevState: any) => ({ ...prevState, showModal: false, interviewId: "" }));
    }

    function delModalSubmitHndlr() {
        const { interviewId } = delInterviewModalState;
        if (interviewId)
            dispatch(delInterviewAct(generateActionPayload("delete_schedule_interview", { interviewId })));
    }

    const [exportExcel, setExportExcel] = useState({
        showModal: false,
        scrutinyId: undefined
    })

    const toggleExportExcelModal = (id?: any) => {
        setExportExcel((prevState: any) => ({
            ...prevState,
            showModal: !prevState.showModal,
            scrutinyId: id || "",
        }));
    };

    const exportExcelHndler = () => {
        let payload: any = { ...filterState };
        if (menuId === "panelInterviewReschedule") {
            if (payload?.rescheduleFilter === "ABSENT") {
                payload = { ...payload, forReSchedule: true, isAbsent: true, isReObservation: false }
            } else if (payload?.rescheduleFilter === "REOBSERVATION") {
                payload = { ...payload, forReSchedule: true, isReObservation: true, isAbsent: false }
            } else {
                payload = { ...payload, forReSchedule: true, isReObservation: false, isAbsent: false }
            }
        }
        delete payload.rescheduleFilter;
        dispatch(exportPanIntListAct(generateActionPayload("export_panel_int_list", undefined, { ...payload, branchId, instituteId }, {
            responseType: 'blob'
        })));
    }

    const toggleStudentExamDetailModal = (event: any, isAbsent?: any, id?: any) => {
        if (id) {
            const newList = interviewSchedulesListResp?.content?.find((item: any) => +item?.id === +id)
            setStudents(newList?.admissionPanelInterviewScheduleDetailsDTOS)
        }
        const dataId: any = event.currentTarget.getAttribute("data-id")

        setStuExamDetailModalState((prev: any) => ({ ...prev, showModal: !prev.showModal, examId: dataId }));
    }
    const [allStuExamDetailModalState, setAllStuExamDetailModalState] = useState({
        showModal: false,
        examId: undefined
    })

    const toggleAllStudentExamDetailModal = (event: any, isAbsent?: any, id?: any, name?: any) => {
        if (id) {
            const newList = interviewSchedulesListResp?.content?.find((item: any) => ((+item?.id === +id)))
            const newStudentList = newList?.admissionPanelInterviewScheduleDetailsDTOS?.filter((item: any) => {
                return (name === "reobservation") ? (item?.reobservation?.toLowerCase() === isAbsent) : (item?.isAbsent?.toLowerCase() === isAbsent)
            });

            setStudents(newStudentList);

        }
        const dataId: any = event.currentTarget.getAttribute("data-id")
        setAllStuExamDetailModalState((prev: any) => ({ ...prev, showModal: !prev.showModal, examId: dataId }));
    }

    function advanceFilterCallbckHndlr(appliedFilters?: any) {
        paginationDetailRef.current = { ...paginationDetailRef.current, pageNo: 0 }
        const stateChanged = hasStateChanged({ ...filterState, ...appliedFilters, academicYearId: "" });
        setShowClearFilterState(stateChanged?.stateChange)
        stateChanged?.count === 0 ? setCount(null) : setCount(stateChanged?.count)
        setFilterState((prevState: any) => ({ ...prevState, ...appliedFilters }));
        getScheduleInterviewApiCall(appliedFilters)
    }

    const toggleAdvanceFilter = () => {
        setOpen(prev => !prev);
    }

    useEffect(() => {
        if (interviewSchedulesListResp) {
            setOpen(false);
        }
    }, [interviewSchedulesListResp])

    const clearFilterHndlr = () => {
        if (academicYearListResp) {
            paginationDetailRef.current = { ...paginationDetailRef.current, pageNo: 0 }
            dispatch(resetEvaluationClassList(undefined));
            let { academicYearId }: any = academicYearListResp?.data?.find((year: any) => year.isAdmissionDefault) || {};
            if (menuId === "panelInterviewReschedule") {
                setFilterState({ ...initialFilterState, academicYearId, forReSchedule: true })
                getScheduleInterviewApiCall({ ...initialFilterState, academicYearId, forReSchedule: true })
            } else {
                setFilterState({ ...initialFilterState, academicYearId })
                getScheduleInterviewApiCall({ ...initialFilterState, academicYearId })
            }
            setCount(null)
            setShowClearFilterState(false)
        }
    }

    const panelInterviewColumns = useMemo(() => {
        const newColumns = generateColumnsForPanelInterivew(menuOptions, toggleStudentExamDetailModal, toggleAllStudentExamDetailModal)
        return newColumns.filter((item: any) => {
            if (item?.Header === "Student Details" || item?.Header === "Actions") {
                if (menuId === "panelInterviewSchedule") {
                    return item
                }
            }
            else if (item?.Header === "Absentees Details" || item?.Header === "Reobservation") {
                if (menuId === "panelInterviewReschedule") {
                    if (filterState?.rescheduleFilter === "ABSENT") {
                        if (item?.Header === "Absentees Details") {
                            return item
                        }
                    } else if (filterState?.rescheduleFilter === "REOBSERVATION") {
                        if (item?.Header === "Reobservation") {
                            return item
                        }
                    } else {
                        return item;
                    }
                }
            } else {
                return item;
            }
        })
    }, [interviewSchedulesListResp, menuId]);

    const { content: interviewList, totalElements, totalPages, number: pageNumber } = interviewSchedulesListResp || {};


    return (<>
        <div className="tw-inline-block tw-w-full tw-bg-white tw-rounded-lg tw-shadow">
            <div className='tw-flex tw-items-center tw-p-2 tw-px-3 tw-border-b'>
                <div style={{ marginBottom: "-17px" }}>
                    <ModifiedHorizontalTab
                        MenuOptions={MenuOptions}
                        getActiveMenuId={(menuId: any) => {
                            setMenuId(menuId);
                        }}
                        activeTabId={menuId}
                        horizontalClass="tw-pt-2 tw-mb-2 tw-overflow-auto"
                        labelClass='tw-whitespace-nowrap'
                    />
                </div>
                <div className="tw-ms-auto tw-text-center tw-flex tw-gap-2">
                    <Button variant="primary" onClick={togglePanelInterviewModal}>
                        <div className="tw-flex tw-items-center">
                            <span><i className="ri-add-line tw-me-1" /></span>
                            <span>{menuId === "panelInterviewSchedule" ? "Schedule Interview" : "Reschedule Interview"}</span>
                        </div>
                    </Button>
                    <Button variant="info" onClick={toggleExportExcelModal}>
                        <div className="tw-flex tw-items-center tw-text-white">
                            <span><i className="ri-add-line tw-me-1" /></span>
                            <span>Export</span>
                        </div>
                    </Button>
                </div>
            </div>

            <div className="tw-p-4">
                <div className="tw-grid tw-grid-cols-12 tw-gap-3 tw-mb-1">
                    <div className="tw-col-span-12 lg:tw-col-span-4 xl:tw-col-span-3">
                        <div className="tw-relative">
                            <TextInput
                                name="searchString"
                                value={filterState.searchString}
                                onChange={onChangeFilterHndlr}
                                formgroupClassName="tw-mb-0"
                                placeHolder="Search..."
                                labelText="Search"
                                floatingLabel
                            />
                            <i className="ri-search-line tw-absolute tw-left-3 tw-top-1/2 tw--translate-y-1/2"></i>
                        </div>
                    </div>

                    <div className="tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-2">
                        <SelectInput
                            name="academicYearId"
                            value={filterState.academicYearId}
                            onChange={onChangeFilterHndlr}
                            menuItems={academicYearListResp?.data}
                            valueKey="academicYearId"
                            textKey="academicYearName"
                            formgroupClassName="tw-mb-0"
                            labelText="Academic Year"
                            floatingLabel
                        />
                    </div>

                    <div className="tw-col-span-12 lg:tw-col-span-6 xl:tw-col-span-2">
                        <SelectInput
                            name="curriculumId"
                            value={filterState.curriculumId}
                            onChange={onChangeFilterHndlr}
                            menuItems={brchCurriculumResp?.data}
                            valueKey="branchCurriculumId"
                            textKey="curriculumName"
                            formgroupClassName="tw-mb-0"
                            labelText="Curriculum"
                            floatingLabel
                        />
                    </div>

                    <div className="tw-col-span-12 lg:tw-col-span-6 xl:tw-col-span-2">
                        <SelectInput
                            name="classId"
                            value={filterState.classId}
                            onChange={onChangeFilterHndlr}
                            menuItems={evaluationClassList || []}
                            valueKey="branchClassId"
                            textKey="className"
                            formgroupClassName="tw-mb-0"
                            labelText="Class"
                            floatingLabel
                        />
                    </div>

                    <div className="tw-col-span-12 lg:tw-col-span-1 tw-relative">
                        <div
                            onClick={toggleAdvanceFilter}
                            className="tw-flex tw-items-center tw-gap-2 tw-bg-[#F4F7FA] tw-p-2 tw-rounded"
                        >
                            <FilterSvg height="18px" width="18px" />
                            <span>Filters</span>
                        </div>
                        <span className="badge tw-align-middle rounded-pill ms-1 " style={{ marginBottom: "18px", position: "absolute", top: "-9px", left: "78px", background: "#0ab39c" }}>
                            {count}
                        </span>
                    </div>

                    <div className='tw-col-span-auto tw-ms-auto tw-flex'>
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
            <OffCanvasContainer
                isOpen={open}
                headerTitle="Advance Filters"
                closeHndlr={toggleAdvanceFilter}
                id="panel-interview-advance-filter"
            >
                <AdvanceFilterModal
                    getClassApiCall={getClassApiCall}
                    appliedFilter={filterState}
                    applyFilterCallback={advanceFilterCallbckHndlr}
                    toggleAdvanceFilter={toggleAdvanceFilter}
                    isOpen={open}
                    menuId={menuId}
                />
            </OffCanvasContainer>
            <TableContainer
                columns={panelInterviewColumns || []}
                data={interviewList || []}
                divClass="tw-overflow-x-auto tw-mb-3"
                theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
                showPagination={true}
                totalPages={totalPages}
                totalRecords={totalElements}
                callbackPaginationHndlr={paginationHndlr}
                currentPageNumber={pageNumber}
            />
        </div>
        <ModalContainerUpdated
            id="student-exam-details"
            isOpen={stuExamDetailModalState.showModal}
            toggle={toggleStudentExamDetailModal}
            modalTitle="Student Exam Schedule Details"
            modalSize="md"
        >
            <StudentExamDetailModal isOpen={stuExamDetailModalState.showModal} toggle={toggleStudentExamDetailModal} examId={stuExamDetailModalState.examId} studentList={students} />

        </ModalContainerUpdated>
        <ModalContainerUpdated
            id='all-student-exam-details'
            isOpen={allStuExamDetailModalState.showModal}
            toggle={toggleAllStudentExamDetailModal}
            modalTitle="Student Exam Schedule Details"
            modalSize="xl"
        >
            <AllStudentExamDetailModal isOpen={allStuExamDetailModalState.showModal} toggle={toggleAllStudentExamDetailModal} examId={allStuExamDetailModalState.examId} studentList={students} />

        </ModalContainerUpdated>

        <ModalContainerUpdated
            id="panel-interview-export-list"
            isOpen={exportExcel.showModal}
            toggle={toggleExportExcelModal}
            modalTitle={menuId === 'panelInterviewReschedule' ? "Export Panel Interview Re-Schedule Data" :
                "Export Panel Interview Schedule Data"}
            modalSize="md"
        >
            <ExportModal
                isOpen={exportExcel.showModal}
                toggle={toggleExportExcelModal}
                instituteId={instituteId}
                branchId={branchId}
                submitHndlr={exportExcelHndler}
                feature="admission"
                subFeature="panel_interview"
                remarksText={menuId === 'panelInterviewReschedule' ? "Enter remarks to export panel interview re-schedule data?" :
                    "Enter remarks to export panel interview data?"}
            />
        </ModalContainerUpdated>
        <ConfirmationModal
            id="delete-branch-modal"
            isOpen={delInterviewModalState.showModal}
            confirmMessage="Are you sure you want to delete the schedule interview ?"
            cancelHndlr={delModalCancelHndlr}
            confirmHndlr={delModalSubmitHndlr}
            showImgIcon={true}
            iconType='reject'
        />
    </>
    );
}

export default PanelInterview
