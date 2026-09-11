import React, { useRef, useEffect, useMemo, useState, useCallback } from "react";
import { shallowEqual } from "react-redux";
import { useHistory } from 'react-router-dom';
import { toast } from "react-toastify";
import {
    SelectInput, TextInput,
    ConfirmationModal, OffCanvasContainer, ModalContainerUpdated
} from '../../../../Components/Common';
// import { PreliminaryScrutinyData, generateColumns } from './helper';
import { default as FilterSvg } from "../../../../assets/imagesdps/academics/FilterSvg.svg?react";
import AdvanceFilterModal from "./AdvanceFilterModal";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
//Action Generator
import { generateActionPayload } from "../../../../utility/reduxutility";
import {
    getInstAcademicYearAct,
} from "../../../../store/mastersettings/instacademics/instacademicactions";
import {
    getBranchCurriculumAct,
    setBrchClassAct,
    resetBrchCurriculumAct,
} from "../../../../store/branchsettings/branchacademics/branchacademicsactions";
import {
    getExaminationSchedulesListAct, delExaminationAct, resetStudentsForExaminationScheduleAct, exportExaminationDataAct
} from "../../../../store/FrontDesk/examination/examinationactions";
import { setRegistrationTabIdAct } from "../../../../store/global/globalslice";


//Utility
import { MenuOptions, generateColumnsForExamination, hasStateChanged, initialFilterState } from "./helper";
import { getByIdExamAbsentStudentAct, getStatasticResp } from "../../../../store/FrontDesk/AdmissionManagment/applicationmanagmentaction";
import { getEvaluationClassList, resetEvaluationClassList } from "../../../../store/FrontDesk/Interview/interviewactions";
import StudentExamDetailModal from "./StudentExamDetailModal";
import TableContainer from "../../../../Components/Common/TableContainer";
import AllStudentExamDetailModal from "./AllStudentExamDetailModal";
import ModifiedHorizontalTab from "../../../../Components/Common/ModifiedHorizontalTab";
import EditAbsentStudentExam from "./EditAbsentStudentExam";
import ExportModal from "../../../Directory/StudentManagement/ExportModal";
import { downloadExcelFile } from "../../../../utility/commonutility";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02StrokeStandard, PencilEdit02Icon } from "@hugeicons-pro/core-stroke-standard";
import Button from "../../../../Components/Common/Button";

const Examination = ({ tabId }: any) => {
    const [filterState, setFilterState] = useState(initialFilterState);
    const [advanceFilterState, setAdvanceFilterState] = useState(false);
    const [students,setStudents]=useState([]);
    const [count,setCount] = useState<any>(null);
    const [menuId, setMenuId] = useState<string | null>("examinationSchedule");
    const [showClearFilterState, setShowClearFilterState] = useState(false);
    const [stuExamDetailModalState, setStuExamDetailModalState] = useState<any>({
        showModal: false,
        examId: undefined
    })
    const [delInterviewModalState, setDelExaminationModalState] = useState<any>({
        showModal: false,
        examScheduleId: ""
    })
    const [editAbsentStuExamModal, setEditAbsentStuExamModal] = useState<any>({
        showModal: false,
        examScheduleId: ""
    })
    const history = useHistory();
    const {
        branchClassResp,
        academicYearListResp,
        brchCurriculumResp,
        currentInstIdResp: instituteId, currentBranchIdResp: branchId,
        examinationSchedulesListResp,
        delExaminationResp,
        evaluationClassList,
        showApiLoader,
        exportExaminationDataResp,
        examinationErrorResp,editAbsentStudentExamResp }: any =
        useAppSelector(({ appData, branchAcademics,
            instAcademics, examination, interview,globalData,applicationSale }) => ({
                branchClassResp: branchAcademics.branchClassResp,
                brchCurriculumResp: branchAcademics.brchCurriculumResp,
                academicYearListResp: instAcademics.academicYearListResp,
                currentInstIdResp: appData.currentInstIdResp,
                currentBranchIdResp: appData.currentBranchIdResp,
                showApiLoader: globalData.showApiLoader,
                delExaminationResp: examination.delExaminationResp,
                exportExaminationDataResp: examination.exportExaminationDataResp,
                evaluationClassList: interview.evaluationClassList,
                examinationSchedulesListResp: examination.examinationSchedulesListResp,
                examinationErrorResp: examination.examinationErrorResp,
                editAbsentStudentExamResp:applicationSale.editAbsentStudentExamResp,
            }), shallowEqual);
    const feeDetailsRespRef = useRef<any>({
        prevDelExaminationResp: delExaminationResp,
        prevExportExaminationDataResp: exportExaminationDataResp,
        prevEditAbsentStudentExamResp: editAbsentStudentExamResp,
        prevExaminationErrorResp: examinationErrorResp
    });
    const paginationDetailRef = useRef<any>({
        pageNo: 0,
        pageSize: 10,
    });

    const dispatch = useAppDispatch();

    useEffect(() => {
        return () => {
            dispatch(resetBrchCurriculumAct(undefined));
            dispatch(resetEvaluationClassList(undefined));
            dispatch(resetStudentsForExaminationScheduleAct(undefined));
        }
    }, []);

    useEffect(() => {
        const { data } = academicYearListResp || {};
        if (Array.isArray(data) && data.length > 0) {
            let academicYearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.isAdmissionDefault)?.academicYearId
            setFilterState((prevState: any) => ({ ...prevState, academicYearId }));
            getCurriculumApiCall({ academicYearId });
            dispatch(getStatasticResp(generateActionPayload('get_statastic', undefined, { academicYearId, branchId })))
        }
    }, [academicYearListResp])

    useEffect(() => {
        const { prevDelExaminationResp,
            prevExaminationErrorResp,prevExportExaminationDataResp,prevEditAbsentStudentExamResp } = feeDetailsRespRef.current;

        if (delExaminationResp && delExaminationResp !== prevDelExaminationResp) {
            setDelExaminationModalState((prevState: any) => ({ ...prevState, showModal: false, examScheduleId: "" }));
            toast.success("Exam schedule deleted successfully.");
            getScheduleExaminationApiCall();
        }
        if (exportExaminationDataResp && exportExaminationDataResp !== prevExportExaminationDataResp) {
            toast.success("Examination Data Download Successfully.");
            toggleExportExcelModal();
            downloadExcelFile(exportExaminationDataResp,"Examination_Schedule")
        }
        else if (editAbsentStudentExamResp && editAbsentStudentExamResp !== prevEditAbsentStudentExamResp) {
            toast.success("Absent Student Rescheduled Successfully.");
            toggleEditAbsStuExamModal();
            getScheduleExaminationApiCall({reSchedule : true});
        }
        else if (examinationErrorResp && examinationErrorResp !== prevExaminationErrorResp) {
            const { message }: any = examinationErrorResp;
            toast.error(message || "Something went wrong.");
        }
        feeDetailsRespRef.current.prevDelExaminationResp = delExaminationResp;
        feeDetailsRespRef.current.prevExportExaminationDataResp = exportExaminationDataResp;
        feeDetailsRespRef.current.prevEditAbsentStudentExamResp = editAbsentStudentExamResp;
        feeDetailsRespRef.current.prevExaminationErrorResp = examinationErrorResp;
    }, [delExaminationResp, examinationErrorResp,exportExaminationDataResp,editAbsentStudentExamResp]);


    // const roleColumns = useMemo(() => generateColumns(menuOptions), []);

    const toggleEditAbsStuExamModal = (id?: any) => {
        setEditAbsentStuExamModal((prevState: any) => ({
            ...prevState,
            showModal: !prevState.showModal,
            examScheduleId: id || "",
        }));
    };

    const editExamHndlr = useCallback((event: any) => {
        const examScheduleId = event.currentTarget.getAttribute("data-id");
        if (examScheduleId) {
            dispatch(setRegistrationTabIdAct(tabId));
            if(menuId === "examinationSchedule"){
                history.push(`/admission-management/exam/${examScheduleId}`);
            }else{
                toggleEditAbsStuExamModal(examScheduleId);
                dispatch(getByIdExamAbsentStudentAct(generateActionPayload('get_by_id_absent_student', { examScheduleId })));
                // history.push(`/admission-management/exam-reschedule/${examScheduleId}`);
            }
        }
    }, [menuId]);

    const deleteExamHndlr = useCallback((event: any) => {
        const examScheduleId = event.currentTarget.getAttribute("data-id");
        if (examScheduleId)
            setDelExaminationModalState((prevState: any) => ({ ...prevState, showModal: true, examScheduleId }));
    }, []);

    const menuOptions = useMemo(
        () => [
            {
                id: "edit",
                actionIcon: <HugeiconsIcon icon={PencilEdit02Icon} className="text-muted" size={18}/>,
                actionName: "Edit",
                onClickHndlr: editExamHndlr
            },
            {
                id: "delete",
                actionIcon: <HugeiconsIcon icon={Delete02StrokeStandard} className="text-danger" size={18}/>,
                actionName: "Delete",
                onClickHndlr: deleteExamHndlr
            },
        ],
        [menuId]
    );
    const addNewExamHndlr = () => {
        dispatch(setRegistrationTabIdAct(tabId));
        if(menuId === "examinationSchedule"){
            history.push(`/admission-management/exam`);
        }else{
            history.push(`/admission-management/exam-reschedule`);
        }
    }

    const getCurriculumApiCall = (otherProps?: any) => {
        const payload1 = { academicYearId: filterState.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" , ...otherProps };
        dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
    }

    function onChangeFilterHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        paginationDetailRef.current.pageNo = 0;
        let stateChanged = hasStateChanged({ ...filterState, [name]: value, academicYearId: "" });
        if (name === "academicYearId") {
            !(value === "") && dispatch(getStatasticResp(generateActionPayload('get_statastic', undefined, { academicYearId: +value, branchId })))
            getCurriculumApiCall({ [name]: value });
            dispatch(resetEvaluationClassList(undefined));
            setFilterState((prev:any) => ({ ...prev, [name]: value , classId : null,curriculumId :"" }));
            stateChanged = hasStateChanged({ ...filterState, academicYearId: "",classId : null,curriculumId: "" });
            getScheduleExaminationApiCall({ [name]: value, classId: null,curriculumId : "" });
        }
        else if (name === "curriculumId") {
            if (value) {
                getClassApiCall(value,filterState.academicYearId);
            }
            else {
                dispatch(resetEvaluationClassList(undefined));
            }
            getScheduleExaminationApiCall({ [name]: value, classId: null });
            setFilterState((prevState: any) => ({ ...prevState, [name]: value, classId: "" }));
        } else {
            getScheduleExaminationApiCall({ [name]: value });
            setFilterState((prevState: any) => ({ ...prevState, [name]: value }));
        }
        setShowClearFilterState(stateChanged?.stateChange)
        stateChanged?.count === 0 ? setCount(null) : setCount(stateChanged?.count)
    }

    function paginationHndlr(paginationInfo: any) {
        paginationDetailRef.current = paginationInfo;
        getScheduleExaminationApiCall();
    }

    function getClassApiCall(curriculumId: string,academicYearId?:string) {
        const payload = { academicYearId: academicYearId || filterState.academicYearId, curriculumId: curriculumId,branchId, evaluationCode: "EXAM" };
        if (payload.academicYearId && payload.curriculumId) {
            dispatch(getEvaluationClassList(generateActionPayload('get_evaluation_class_list', undefined, payload)))
        }
    }

    function getScheduleExaminationApiCall(otherProps?: any) {
        const params = { history: true, instituteId, branchId, ...filterState, ...otherProps, ...paginationDetailRef.current };
        if (params.academicYearId) {
            dispatch(getExaminationSchedulesListAct(generateActionPayload("get_scheduled_examination", undefined, params)));
        }
    }

    useEffect(()=>{
        if(academicYearListResp && menuId){
            const { academicYearId } = academicYearListResp?.data?.find((year: any) => year.isAdmissionDefault) || {};
            paginationDetailRef.current.pageNo = 0
            // dispatch(setRegistrationTabIdAct(tabId));
            setShowClearFilterState(false)
            setCount(null)
            if(menuId === "examinationSchedule"){
                setFilterState((prev:any)=>({...initialFilterState,reSchedule : false,academicYearId}))
                getScheduleExaminationApiCall({...initialFilterState,reSchedule : false,academicYearId})
            }else{
                setFilterState((prev:any)=>({...initialFilterState,reSchedule : true,academicYearId}))
                getScheduleExaminationApiCall({...initialFilterState,reSchedule : true,academicYearId})
            }
        }
    },[menuId])

    function delModalCancelHndlr() {
        setDelExaminationModalState((prevState: any) => ({ ...prevState, showModal: false, examScheduleId: "" }));
    }

    function delModalSubmitHndlr() {
        const { examScheduleId } = delInterviewModalState;
        if (examScheduleId)
            dispatch(delExaminationAct(generateActionPayload("delete_schedule_exam", { examScheduleId })));
    }

    //Advance Filter Handler
    function advanceFilterHndlr() {
        setAdvanceFilterState(true);
    }

    function closeAdvanceModalHndlr() {
        setAdvanceFilterState(prev => !prev);
    }
    function advanceFilterCallbckHndlr(appliedAdvanceFilter: any) {
        const { curriculumId } = filterState;
        if (appliedAdvanceFilter.curriculumId !== curriculumId) {
            if (appliedAdvanceFilter.curriculumId) {
                getClassApiCall(appliedAdvanceFilter.curriculumId);
            } else {
                dispatch(setBrchClassAct(undefined));
            }
        }
        paginationDetailRef.current={...paginationDetailRef.current,pageNo:0}
        const stateChanged = hasStateChanged( {...filterState,...appliedAdvanceFilter,academicYearId : ""});
        setShowClearFilterState(stateChanged?.stateChange)
        stateChanged?.count === 0 ? setCount(null) : setCount(stateChanged?.count)
        getScheduleExaminationApiCall(appliedAdvanceFilter);
        setFilterState((prevState: any) => ({ ...prevState, ...appliedAdvanceFilter }));
        closeAdvanceModalHndlr();
    }
    
    const [exportExcel, setExportExcel] = useState<any>({
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

    const exportExcelHndler = ()=>{

        dispatch(exportExaminationDataAct(generateActionPayload("export_examination_data", undefined, {...filterState ,branchId , instituteId ,history : true},{
            responseType: 'blob'
        })));
    }

    
    const resetBtnHndler = ()=>{
        if(academicYearListResp && brchCurriculumResp){

            let { academicYearId } = academicYearListResp?.data?.find((year: any) => year.isAdmissionDefault) || {};
            setFilterState({...initialFilterState,academicYearId,curriculumId: brchCurriculumResp?.data[0].branchCurriculumId})
            getScheduleExaminationApiCall({...initialFilterState,academicYearId,curriculumId: brchCurriculumResp?.data[0].branchCurriculumId});
        }
      
    }
    const toggleStudentExamDetailModal = (event:any,isAbsent?:any,examScheduleId?:any) => {
        if(examScheduleId){
            const newList = examinationSchedulesListResp?.data?.find((item:any)=>+item?.examScheduleId === +examScheduleId)
            setStudents(newList?.studentsList)
        }
        const id:any = event.currentTarget.getAttribute("data-id")
      
        setStuExamDetailModalState((prev: any) => ({ ...prev, showModal: !prev.showModal,examId : id }));
    }
    const [allStuExamDetailModalState, setAllStuExamDetailModalState] = useState<any>({
        showModal: false,
        examId: undefined
    })

    const toggleAllStudentExamDetailModal = (event:any,isAbsent?:any,examScheduleId?:any) => {
        if(examScheduleId){
            const newList = examinationSchedulesListResp?.data?.find((item:any)=>((+item?.examScheduleId === +examScheduleId)))
            const newStudentList =  newList?.studentsList?.filter((item:any)=>item?.absent===isAbsent)
            setStudents(newStudentList)
        }
        const id:any = event.currentTarget.getAttribute("data-id")
        setAllStuExamDetailModalState((prev: any) => ({ ...prev, showModal: !prev.showModal,examId : id }));
    }
    const clearFilterHndlr = ()=>{
        if(academicYearListResp){
            paginationDetailRef.current={...paginationDetailRef.current,pageNo:0}
            let { academicYearId } = academicYearListResp?.data?.find((year: any) => year.isAdmissionDefault) || {};
            dispatch(resetEvaluationClassList(undefined));
            setCount(null)
            setShowClearFilterState(false)
            if(menuId === "examinationSchedule"){
                setFilterState((prev:any)=>({...initialFilterState,reSchedule : false,academicYearId}))
                getScheduleExaminationApiCall({...initialFilterState,reSchedule : false,academicYearId})
            }else{
                setFilterState((prev:any)=>({...initialFilterState,reSchedule : true,academicYearId}))
                getScheduleExaminationApiCall({...initialFilterState,reSchedule : true,academicYearId})
            }
        }
      }

    const roleColumns = useMemo(() => {
        // const newOptions = menuOptions.map((item: any) => {
        //    if(item.id==="delete"){
        //     if(menuId === "examinationSchedule"){
        //         return item
        //     }
        //    }else{
        //        return item
        //    }
        // }).filter((f:any)=>f)
        const newColumns = generateColumnsForExamination(menuOptions,toggleStudentExamDetailModal,toggleAllStudentExamDetailModal)
         return newColumns.filter((item:any)=>{
            if(item?.Header === "Student Details" || item?.Header === "Actions"){
                if(menuId === "examinationSchedule"){
                    return item;
                }
            }else if(item?.Header === "Absentees Details"){
                if(menuId === "examinationReschedule"){
                    return item;
                }
            }else{
                return item
            }
        })
    }, [examinationSchedulesListResp,menuId]);

    const { data: interviewList, totalElements, totalPages, pageNumber } = examinationSchedulesListResp || {}
    return (<>
        <div className="tw-bg-white tw-rounded tw-shadow tw-inline-block tw-w-full">
            <div className="tw-flex tw-items-center tw-p-2 tw-px-3 tw-border-b">
                <div style={{ marginBottom: "-17px" }}>
                    <ModifiedHorizontalTab
                        MenuOptions={MenuOptions}
                        getActiveMenuId={(menuId: any) => {
                            setMenuId(menuId);
                        }}
                        activeTabId={menuId}
                        horizontalClass="tw-pt-2 tw-mb-2 tw-overflow-auto"
                        labelClass="tw-whitespace-nowrap"
                    />
                </div>
                <div className="tw-ml-auto tw-text-center tw-flex tw-gap-3">
                    <Button
                        variant="primary"
                        onClick={addNewExamHndlr}
                    >
                        <div className="tw-flex">
                            <span><i className="ri-add-line tw-mr-1" /></span>
                            <span>{menuId === "examinationSchedule" ? "Schedule Exam" : "Reschedule Exam"}</span>
                        </div>
                    </Button>
                    <Button
                        variant="info"
                        onClick={toggleExportExcelModal}
                    >
                        <div className="tw-flex tw-text-white">
                            <span><i className="ri-add-line tw-mr-1" /></span>
                            <span>Export</span>
                        </div>
                    </Button>
                </div>
            </div>

            <div className="tw-p-4">
                <div className="tw-flex tw-flex-wrap -tw-mx-1.5 tw-gap-y-3">
                    <div className="tw-w-full lg:tw-w-1/3 xl:tw-w-1/4 tw-px-1.5">
                        <div className="tw-relative">
                            <div className="search-box">
                                <TextInput
                                    name="search"
                                    value={filterState.search}
                                    onChange={onChangeFilterHndlr}
                                    formgroupClassName="tw-mb-0"
                                    placeHolder="Search..."
                                    labelText="Search"
                                    floatingLabel
                                />
                                <i className="ri-search-line search-icon"></i>
                            </div>
                        </div>
                    </div>
                    <div className="tw-w-full lg:tw-w-1/4 xl:tw-w-1/6 tw-px-1.5">
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
                    <div className="tw-w-full lg:tw-w-1/2 xl:tw-w-1/6 tw-px-1.5">
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
                    <div className="tw-w-full lg:tw-w-1/4 xl:tw-w-1/6 tw-px-1.5">
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
                    <div className="tw-w-auto tw-px-1.5 tw-relative">
                        <span
                            style={{ backgroundColor: "#F4F7FA" }}
                            onClick={closeAdvanceModalHndlr}
                            className="tw-p-2 tw-flex tw-rounded"
                        >
                            <FilterSvg height={"18px"} width={"18px"} />
                            <span className="tw-ml-2">Filters</span>
                        </span>
                        <span
                            className="tw-absolute tw-rounded-full tw-ml-1 tw-align-middle"
                            style={{ marginBottom: "18px", position: "absolute", top: "-9px", left: "78px", background: "#0ab39c", color: "white", padding: "0 6px", fontSize: "11px" }}
                        >
                            {count}
                        </span>
                    </div>
                    <div className="tw-w-auto tw-ml-auto tw-flex tw-px-1.5">
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
                {/* <div className='row g-3'>
                    <div className='col-12'>
                        {(Array.isArray(interviewList) && interviewList.length > 0) ?
                            interviewList.map((interviewInfo, index) => <ScheduleCard
                                key={index} interviewInfo={interviewInfo}
                                deleteExamHndlr={deleteExamHndlr}
                                editExamHndlr={editExamHndlr}
                            />) :
                            <NoDataComp />}
                    </div>
                    <div className="col-12">
                        <Pagination
                            paginationContainerClass="mb-4"
                            callbackPaginationHndlr={paginationHndlr}
                            totalPages={totalPages}
                            totalRecords={totalElements}
                            currentPageNumber={pageNumber}
                        />
                    </div>
                </div> */}
            </div>

            <TableContainer
                columns={roleColumns || []}
                data={interviewList || []}
                divClass="tw-overflow-x-auto tw-mb-3"
                theadClass="tw-table-light tw-text-gray-500 tw-align-middle"
                showPagination={true}
                totalPages={totalPages}
                totalRecords={totalElements}
                callbackPaginationHndlr={paginationHndlr}
                currentPageNumber={pageNumber}
            />
        </div>

        <ConfirmationModal
            id="delete-branch-modal"
            isOpen={delInterviewModalState.showModal}
            confirmMessage="Are you sure you want to delete the schedule examination ?"
            cancelHndlr={delModalCancelHndlr}
            confirmHndlr={delModalSubmitHndlr}
            isDisble={showApiLoader}
            showImgIcon={true}
            iconType='reject'
        />
        <OffCanvasContainer
            isOpen={advanceFilterState}
            headerTitle="Examination Advance Filter"
            closeHndlr={closeAdvanceModalHndlr}
            id="examination-filter-modal"
        >
            <AdvanceFilterModal
                getClassApiCall={getClassApiCall}
                appliedFilter={filterState}
                applyFilterCallback={advanceFilterCallbckHndlr}
            />

        </OffCanvasContainer>
        <ModalContainerUpdated
            id='student-exam-details'
            isOpen={stuExamDetailModalState.showModal}
            toggle={toggleStudentExamDetailModal}
            modalTitle="Student Exam Schedule Details"
            modalSize="md"
        >
             <StudentExamDetailModal isOpen={stuExamDetailModalState.showModal} toggle={toggleStudentExamDetailModal} examId={stuExamDetailModalState.examId} studentList={students} />

            </ModalContainerUpdated>
            <ModalContainerUpdated
            id="all-student-exam-details"
            isOpen={allStuExamDetailModalState.showModal}
            toggle={toggleAllStudentExamDetailModal}
            modalTitle="Student Exam Schedule Details"
            modalSize="xl"
        >
             <AllStudentExamDetailModal isOpen={allStuExamDetailModalState.showModal} toggle={toggleAllStudentExamDetailModal} examId={allStuExamDetailModalState.examId} studentList={students} />

            </ModalContainerUpdated>                           
            <ModalContainerUpdated
            id="edit-absent-exam-details"
            isOpen={editAbsentStuExamModal.showModal}
            toggle={()=>toggleEditAbsStuExamModal()}
            modalTitle="Edit Absent Student Exam Details"
            modalSize="lg"
        >
             <EditAbsentStudentExam toggle={()=>toggleEditAbsStuExamModal()} isOpen={editAbsentStuExamModal.showModal}/>

            </ModalContainerUpdated>   

            <ModalContainerUpdated
           id="exmination-export"
           isOpen={exportExcel.showModal}
            toggle={toggleExportExcelModal}
            modalTitle={filterState.reSchedule ?  "Export Examination Re-Schedule Data":"Export Examination Schedule Data"}
            modalSize="md"
        >
            <ExportModal
               isOpen={exportExcel.showModal}
                toggle={toggleExportExcelModal}
                instituteId={instituteId}
                branchId={branchId}
                submitHndlr={exportExcelHndler}
                feature="admission"
                subFeature="examination"
                remarksText={filterState.reSchedule ?  "Enter remarks to export Examination Re-Schedule data?":
                    "Enter remarks to export Examination Schedule data?"}
            />
        </ModalContainerUpdated>                        
    </>
    );
}

export default Examination
