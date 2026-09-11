import React, { useRef, useEffect, useMemo, useState, useCallback } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FormGroup, Input, Label } from 'reactstrap'
import classnames from "classnames";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import {
    AutoSearchInput, DateInput, TimeInput, ModalContainerUpdated, RadioInput, RadioInputContainer, SelectInput,
    TextArea, ConfirmationModal,
    TextIconInput, TextInput, InputCheckbox
} from "../../../../Components/Common";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import CancelAdmissionModal from "./CancelAdmissionModal";
import TableContainer from "../../../../Components/Common/TableContainer";

import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
//Action Generator
import { generateActionPayload } from "../../../../utility/reduxutility";
import {
    getInstAcademicYearAct,
} from "../../../../store/mastersettings/instacademics/instacademicactions";
import {
    getBranchCurriculumAct, getBranchClassAct,
    setBrchClassAct,
} from "../../../../store/branchsettings/branchacademics/branchacademicsactions";
import {
    getStudentsForInterviewScheduleAct, scheduleInterviewAct, updateInterviewScheduleAct,
    getInterviewDetailsAct,
    getEvaluationClassList,
    resetEvaluationClassList,
} from "../../../../store/FrontDesk/Interview/interviewactions";
import { useHistory, useLocation, useParams } from "react-router-dom";
import {  computeSubmitButtonError, generateColumns, isEditAccess } from "./helper";
import ScheduleInterviewModal from "./ScheduleInterviewModal";
import { convertTo12HourFormat, convertTo24HourFormat, getYyyyMmDdFormat } from "../../../../utility/dateutility";
import NoDataComp from "../../../../Components/Common/NoDataComp";
import Button from "../../../../Components/Common/Button";

const filterFormValidationSchema = Yup.object().shape({
    academicYearId: Yup.string().required("Select academic year."),
    curriculumId: Yup.string().required("Select curriculum id."),
    classId: Yup.string().required("Select class."),
    mode: Yup.string().required("Select registration type."),
});

const interviewFormValidationSchema = Yup.object().shape({
    interviewDate: Yup.string().required("Select interview date."),
    // timeSlot: Yup.string().required("From time slot is required."),
    // orientationMeetingLink: Yup.string().required("Metting link is required"),
    // meetingId: Yup.string().required("Metting id is required"),
    // password: Yup.string().required("Password is required."),
});

function getFilterInitialState(filterState?: any) {
    let scheduleMode: string = "ALL";
    const { admissionPanelInterviewScheduleDetailsDTOS } = filterState || {};
    if (Array.isArray(admissionPanelInterviewScheduleDetailsDTOS)) {
        let countPhysical = 0, countVirtual = 0;
        admissionPanelInterviewScheduleDetailsDTOS.forEach((item: any) => {
            if (item.scheduleMode === "PHYSICAL") {
                countPhysical += 1;
            } else if (item.scheduleMode === "VIRTUAL") {
                countVirtual += 1;
            }
        })
        if (countPhysical === admissionPanelInterviewScheduleDetailsDTOS.length) {
            scheduleMode = "PHYSICAL";
        } else if (countVirtual === admissionPanelInterviewScheduleDetailsDTOS.length) {
            scheduleMode = "VIRTUAL";
        }
    }
    return ({
        academicYearId: filterState?.academicYearId || "",
        curriculumId: filterState?.curriculumId || "",
        classId: filterState?.classId || "",
        scheduleMode: scheduleMode,
        mode: filterState?.mode || "ONLINE",
        searchString: "",
        rescheduleFilter :filterState?.rescheduleFilter || "",
    });
}

function getScheduleInterviewState(interviewDetails?: any) {
    return ({
        interviewDate: interviewDetails?.interviewDate ? getYyyyMmDdFormat(interviewDetails?.interviewDate) : "",
        timeSlot: convertTo24HourFormat(interviewDetails?.timeSlot) || "",
        orientationMeetingLink: interviewDetails?.meetingLink || "",
        meetingId: interviewDetails?.meetingId || "",
        password: interviewDetails?.meetingPassword || "",
    });
}

const initialFilterState = getFilterInitialState();
const initialInterviewState = getScheduleInterviewState();
const initialSMSandEmail = {
    isSMS: true,
    isEmail: true,
}
const AddNewInterview = () => {
    const { interviewId }: any = useParams();
    const [interviewStudentState, setInterviewStudentState] = useState<any>([]);
    const [interviewStudentData, setInterviewStudentData] = useState<any>([]);
    const [showPasswordState, setShowPasswordState] = useState(false);
    const [showSubmitBtnErr, setShowSubmitBtnErr] = useState(true);
    const [smsAndEmail, setSmsAndEmail] = useState<any>(initialSMSandEmail)
    const [search, setSearch] = useState();
    const [cancelAdmissionState, setCancelAdmissionState] = useState({
        showConfirmModal: false,
        studentRegId: ""
    });
    const [revertCancelAdmissionState, setRevertCancelAdmissionState] = useState({
        showConfirmModal: false,
        studentRegId: ""
    });
    const [scheduleInterviewModalState, setScheduleInterviewModalState] = useState<any>({
        showModal: false,
        modalDetails: null,
    });
    const [allStudentSelectedState, setAllStudentSelectedState] = useState(false);
    const [interviewReschedule,setInterviewReschedule] = useState(false);
    const location = useLocation()    
    const history = useHistory();
    const dispatch = useAppDispatch();
    const {
        branchClassResp,
        academicYearListResp, brchCurriculumResp,
        currentInstIdResp: instituteId, currentBranchIdResp: branchId,
        studentsForInterviewScheduleResp,
        scheduleInterviewResp,
        updateInterviewDetailsResp,
        evaluationClassList,
        interviewDetailsResp,
        interviewErrorResp,
        showApiLoader,registrationTabId,
        feeCollectionErrorResp } =
        useAppSelector(({ appData, globalData, branchAcademics, feeCollections,
            interview,
            instAcademics }) => ({
                branchClassResp: branchAcademics.branchClassResp,
                brchCurriculumResp: branchAcademics.brchCurriculumResp,
                academicYearListResp: instAcademics.academicYearListResp,
                currentInstIdResp: appData.currentInstIdResp,
                currentBranchIdResp: appData.currentBranchIdResp,
                studentsForInterviewScheduleResp: interview.studentsForInterviewScheduleResp,
                scheduleInterviewResp: interview.scheduleInterviewResp,
                updateInterviewDetailsResp: interview.updateInterviewDetailsResp,
                evaluationClassList: interview.evaluationClassList,
                showApiLoader: globalData.showApiLoader,
                feeCollectionErrorResp: feeCollections.feeCollectionErrorResp,
                interviewDetailsResp: interview.interviewDetailsResp,
                interviewErrorResp: interview.interviewErrorResp,
                registrationTabId:globalData.registrationTabId,
            }), shallowEqual);

    const addNewInterviewRespRef = useRef({
        prevAcademicYearListResp: academicYearListResp,
        prevBrchCurriculumResp: brchCurriculumResp,
        prevScheduleInterviewResp: scheduleInterviewResp,
        prevUpdateInterviewDetailsResp: updateInterviewDetailsResp,
        prevStudentsForInterviewScheduleResp: studentsForInterviewScheduleResp,
        prevInterviewDetailsResp: interviewDetailsResp,
        prevInterviewErrorResp: interviewErrorResp,
    });

    useEffect(() => {
        if (Array.isArray(academicYearListResp?.data)) {
            const { academicYearId } = academicYearListResp?.data?.find((year: any) => year.isAdmissionDefault) || {};
            filterForm.setValues((prev: any) => ({ ...prev, academicYearId: academicYearId }));
            if(!interviewId){
                getCurriculumApiCall({ academicYearId });
            }
        }

    }, [academicYearListResp])

    useEffect(() => {
        if (interviewId) {
            const params = { interviewId };
            dispatch(getInterviewDetailsAct(generateActionPayload("get_interview_details", params)));
        }
    }, [interviewId]);

    useEffect(()=>{
        if(location.pathname?.includes("reschedule")){
            setInterviewReschedule(true)
        }else{
            setInterviewReschedule(false)
        }
    },[location.pathname])

    useEffect(() => {
        const { prevStudentsForInterviewScheduleResp, prevScheduleInterviewResp, prevUpdateInterviewDetailsResp, prevInterviewDetailsResp, prevInterviewErrorResp } = addNewInterviewRespRef.current;
        if (studentsForInterviewScheduleResp && studentsForInterviewScheduleResp !== prevStudentsForInterviewScheduleResp) {
            if (Array.isArray(studentsForInterviewScheduleResp)) {
                const studentList = studentsForInterviewScheduleResp.map((studentInfo) => {
                    return (
                        {
                            id: "",
                            interviewId:studentInfo?.interviewId,
                            studentRegId: studentInfo?.studentRegId || studentInfo?.studentRegistrationId,
                            studentRegistrationNo: studentInfo?.studentRegistrationNo,
                            admissionCancel: studentInfo?.admissionCancel || "",
                            admissionCancelReason: "",
                            studentName: studentInfo?.studentName,
                            fatherName: studentInfo?.fatherName,
                            phoneNo: studentInfo?.phoneNo,
                            admissionType: studentInfo?.admissionType,
                            isAbsent: studentInfo?.isAbsent,
                            email: studentInfo?.email,
                            admissionProcess:studentInfo?.admissionProcess || "",
                            communicationAddress: studentInfo?.communicationAddress,
                            groupShortName: studentInfo?.groupShortName,
                            studentImageS3URL: studentInfo?.studentImageS3URL,
                            isReschedule: studentInfo?.isReschedule,
                            districtName: studentInfo?.districtName,
                            addPanelInterview : true,
                            meetingLink: "",
                            isSelected: false,
                            meetingId: "",
                            meetingPassword: "",
                            timeSlot: convertTo24HourFormat(studentInfo?.timeSlot) || "",
                            isInterviewScheduledOrCancelled: false,
                            scheduleMode: studentInfo?.scheduleMode || ""
                        }
                    )
                })
                setInterviewStudentState(studentList);
                setInterviewStudentData(studentList);
            }
        }
        else if (interviewDetailsResp && interviewDetailsResp !== prevInterviewDetailsResp) {
            if (interviewDetailsResp?.curriculumId) {
                getClassApiCall({ curriculumId: interviewDetailsResp?.curriculumId });
            }
            const { admissionPanelInterviewScheduleDetailsDTOS , academicYearId } = interviewDetailsResp,
                updateFilterState = getFilterInitialState(interviewDetailsResp),
                updatedInterviewDetailState = getScheduleInterviewState(interviewDetailsResp);

            filterForm.resetForm({
                values: updateFilterState
            })
            interviewDetailsForm.resetForm({
                values: updatedInterviewDetailState
            })
            getCurriculumApiCall({ academicYearId })
            if (Array.isArray(admissionPanelInterviewScheduleDetailsDTOS)) {
                const filteredData = admissionPanelInterviewScheduleDetailsDTOS.reduce((acc:any, studentInfo:any) => {
                    if (
                      (!interviewReschedule && studentInfo?.isAbsent?.toLowerCase() === 'no' && studentInfo?.reobservation?.toLowerCase() === 'no') ||
                      (interviewReschedule && (studentInfo?.isAbsent?.toLowerCase() === 'yes' || studentInfo?.reobservation?.toLowerCase() === 'yes'))
                    ) {
                      const item = {
                        id: studentInfo?.id,
                        studentRegId: studentInfo?.studentRegId || studentInfo?.studentRegistrationId,
                        studentRegistrationNo: studentInfo?.studentRegNo,
                        admissionCancel: studentInfo?.admissionCancel,
                        admissionCancelReason: studentInfo?.cancelReason,
                        studentName: studentInfo?.studentName,
                        fatherName: studentInfo?.fatherName,
                        admissionType: studentInfo?.admissionType,
                        email: studentInfo?.email,
                        isReschedule: studentInfo?.isReschedule,
                        communicationAddress: studentInfo?.communicationAddress,
                        studentImageS3URL: studentInfo?.studentImageS3URL,
                        meetingLink: studentInfo?.meetingLink,
                        groupShortName: studentInfo?.groupShortName,
                        isEditAccess:isEditAccess(studentInfo?.admissionProcess),
                        isSelected: true,
                        addPanelInterview:false,
                        admissionProcess:studentInfo?.admissionProcess,
                        meetingId: studentInfo?.meetingId,
                        meetingPassword: studentInfo?.meetingPassword,
                        timeSlot: convertTo24HourFormat(studentInfo?.timeSlot),
                        phoneNo: studentInfo?.phoneNo,
                        isAbsent: studentInfo?.isAbsent,
                        isInterviewScheduledOrCancelled: true,
                        scheduleMode: studentInfo?.scheduleMode,
                      };
                  
                      if (item !== null && item !== undefined && Object.keys(item).length > 0) {
                        acc.push(item);
                      }
                    }
                    return acc;
                  }, []);
                  
                // setAllStudentSelectedState(true);
                setInterviewStudentState(filteredData);
                setInterviewStudentData(filteredData);
            }
        }
        else if (scheduleInterviewResp && scheduleInterviewResp !== prevScheduleInterviewResp) {
            toast.success("Interview scheduled successfully.");
            history.push(`/admission-management`);
        }
        else if (updateInterviewDetailsResp && updateInterviewDetailsResp !== prevUpdateInterviewDetailsResp) {
            toast.success("Interview schedule updated successfully.");
            history.push(`/admission-management`);
        }
        else if (interviewErrorResp && interviewErrorResp !== prevInterviewErrorResp) {
            const { message }: any = interviewErrorResp;
            toast.error(message || "Something went wrong.");
        }
        addNewInterviewRespRef.current.prevInterviewDetailsResp = interviewDetailsResp;
        addNewInterviewRespRef.current.prevScheduleInterviewResp = scheduleInterviewResp;
        addNewInterviewRespRef.current.prevUpdateInterviewDetailsResp = updateInterviewDetailsResp;
        addNewInterviewRespRef.current.prevStudentsForInterviewScheduleResp = studentsForInterviewScheduleResp;
        addNewInterviewRespRef.current.prevInterviewErrorResp = interviewErrorResp;
    }, [studentsForInterviewScheduleResp,
        scheduleInterviewResp,
        updateInterviewDetailsResp,
        interviewDetailsResp,
        interviewErrorResp]);



    const filterForm = useFormik({
        initialValues: initialFilterState,
        validationSchema: filterFormValidationSchema,
        onSubmit: (values) => {
            setShowSubmitBtnErr(true)
            if (interviewId) {
                return;
            }
            const { scheduleMode, ...payload }: any = filterForm.values;
            if (scheduleMode === "ALL") {
                payload.scheduleMode = null;
            } else {
                payload.scheduleMode = scheduleMode;
            }
            const newPayload = interviewReschedule
                ? filterForm.values.rescheduleFilter === "ABSENT"
                  ? { ...payload, forReSchedule: true, isAbsent: true, isReObservation: false }
                  : filterForm.values.rescheduleFilter === "REOBSERVATION"
                  ? { ...payload, forReSchedule: true, isAbsent: false, isReObservation: true }
                  : { ...payload, forReSchedule: true, isAbsent: false, isReObservation: false }
                : { ...payload, forReSchedule: false, isAbsent: false, isReObservation: false };

            getStudentToScheduleApiCall(newPayload);
        }
    })
    const interviewDetailsForm = useFormik({
        initialValues: initialInterviewState,
        validationSchema: interviewFormValidationSchema,
        onSubmit: (values) => {
            const interviewStudents: any = [];
            if (interviewId) {
                const payload = {
                    ...smsAndEmail,
                    interviewDate: `${values?.interviewDate}T00:00:00`,
                    timeSlot: `${convertTo12HourFormat(values?.timeSlot)}`,
                    meetingLink: values?.orientationMeetingLink,
                    meetingId: values?.meetingId,
                    meetingPassword: values?.password,
                    admissionPanelInterviewScheduleDetailsDTOS: interviewStudents
                }
                interviewStudentState.forEach((item: any) => {
                    if (item.isSelected && item?.isEditAccess) {
                        interviewStudents.push({
                            id: item?.id || "",
                            studentRegistrationId: item?.studentRegId || "",
                            meetingLink: item?.meetingLink || "",
                            meetingId: item?.meetingId || "",
                            meetingPassword: item?.meetingPassword || "",
                            timeSlot: `${convertTo12HourFormat(item?.timeSlot) || ""}` || null,
                            scheduleMode: item?.scheduleMode || "",
                            isReschedule: item?.isReschedule || "",
                            admissionCancel: item?.admissionCancel || "",
                            reason: item?.admissionCancelReason || "",
                        });
                    }
                });
                payload.admissionPanelInterviewScheduleDetailsDTOS = interviewStudents;
                const params = { interviewId };
                dispatch(updateInterviewScheduleAct(generateActionPayload("update_schedule_interview", params, payload)));
            } else {
                const payload = {
                    ...smsAndEmail,
                    instituteId,
                    branchId,
                    curriculumId: filterForm.values.curriculumId,
                    classId: filterForm.values.classId,
                    academicYearId: filterForm.values.academicYearId,
                    interviewDetailsDTO: {
                        interviewDate: `${values?.interviewDate}T00:00:00`,
                        timeSlot: `${convertTo12HourFormat(values?.timeSlot) || ""}` || null,
                        orientationMeetingLink: values?.orientationMeetingLink,
                        meetingId: values?.meetingId,
                        password: values?.password
                    },
                    scheduledInterviewStudents: interviewStudents
                }
                interviewStudentState.forEach((item: any) => {
                    if (item.isSelected) {
                        interviewStudents.push({
                            studentRegId: item?.studentRegId || "",
                            meetingLink: item?.meetingLink || "",
                            interviewId:item?.interviewId || null,
                            meetingId: item?.meetingId || "",
                            meetingPassword: item?.meetingPassword || "",
                            timeSlot: `${convertTo12HourFormat(item?.timeSlot) || ""}` || null,
                            isReschedule: item?.isReschedule || "",
                            scheduleMode: item?.scheduleMode || "",
                            admissionCancel: item?.admissionCancel || "",
                            admissionCancelReason: item?.admissionCancelReason || "",
                        });
                    }
                });
                payload.scheduledInterviewStudents = interviewStudents;
                dispatch(scheduleInterviewAct(generateActionPayload("schedule_interview", undefined, payload)));
            }
        },
    });


    const submitButtonError = useMemo(() => computeSubmitButtonError(interviewStudentState), [interviewStudentState]);

    const scheduleInterviewHandler = useCallback((event: any) => {
        const studentRegistrationId = event.currentTarget.getAttribute("data-id");
        if (studentRegistrationId) {

            const studentInfo = interviewStudentState.find((item: any) => item.studentRegId === +studentRegistrationId);

            if (studentInfo) {
                setScheduleInterviewModalState({
                    showModal: true,
                    modalDetails: studentInfo,
                })
            }
        }
    }, [interviewStudentState]);


    function editInterViewHndlr(event: any) {
        const studentRegId = event.currentTarget.getAttribute("data-id");
        if (studentRegId) {
            //
        }
    }

    function cancelAdmissionHndlr(event: any) {
        const studentRegId = event.currentTarget.getAttribute("data-id");
        if (studentRegId)
            setCancelAdmissionState((prevState: any) => ({
                ...prevState, showConfirmModal: true,
                studentRegId
            }));
    }
    function cancelRevertHndlr(event: any) {
        const studentRegId = event.currentTarget.getAttribute("data-id");
        if (studentRegId)
            setRevertCancelAdmissionState((prevState: any) => ({
                ...prevState, showConfirmModal: true,
                studentRegId
            }));
    }
    function scheduleInterviewHndlr(event: any) {
        const studentRegId = event.currentTarget.getAttribute("data-id");
        if (studentRegId) {
            //
        }
    }
    const menuOptions = useMemo(() => [

        {
            id: "cancelled",
            actionIcon: <i className=" ri-close-circle-fill fs-16 align-bottom me-2 text-muted"></i>,
            actionName: "Cancel Admission",
            onClickHndlr: cancelAdmissionHndlr
        },
        {
            id: "revertCancel",
            actionIcon: <i className="ri-pencil-fill fs-16 align-bottom me-2 text-muted"></i>,
            actionName: "Revert Cancel Admission",
            onClickHndlr: cancelRevertHndlr
        },
        // {
        //     id: "schedule",
        //     actionIcon: <i className="ri-calendar-line fs-16 align-bottom me-2 text-muted"></i>,
        //     actionName: "Schedule",
        //     onClickHndlr: scheduleInterviewHandler
        // },
    ], [interviewStudentState]);

    const getCurriculumApiCall = (otherProps?: any) => {
        const payload1 = { academicYearId: filterForm.values.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" , ...otherProps };
        dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
    }

    function onChangeFilterHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        if (name === "curriculumId") {
            if (value) {
                getClassApiCall({ curriculumId: value });
            }else{
                dispatch(resetEvaluationClassList(undefined));
            }
            filterForm.setValues((prev)=>({...prev , curriculumId : value , classId :""}));
        }
        else if(name === "academicYearId"){
            getCurriculumApiCall({ academicYearId: value });
            dispatch(resetEvaluationClassList(undefined));
            filterForm.setValues((prev)=>({...prev ,[name]:value, curriculumId : "" , classId :""}));
        }else{
            filterForm.setFieldValue(name, value);
        }
    }

    function getClassApiCall(otherProps?: any) {
        const { academicYearId, curriculumId } = filterForm.values;
        const payload = { academicYearId: academicYearId, curriculumId,branchId,instituteId, evaluationCode: "PINT", ...otherProps };
        if (payload.academicYearId && payload.curriculumId) {
            dispatch(getEvaluationClassList(generateActionPayload('get_evaluation_class_list', undefined, payload)))
        }
    }


    function getStudentToScheduleApiCall(otherProps?: any) {

        const payload = {
            instituteId,branchId,
            ...filterForm.values, ...otherProps,
        };
        delete payload.rescheduleFilter;
        dispatch(getStudentsForInterviewScheduleAct(generateActionPayload("get_student_for_interview", undefined, payload)));
    }

    //Add New Interview Modal
    function toggleScheduleInterviewModal() {
        setScheduleInterviewModalState((prevState: any) => ({
            ...prevState, showModal: false
        }))
    }

    const allStudentCheckHndlr = useCallback((event: any) => {
        const { checked } = event.target;
        setAllStudentSelectedState(checked);
        let updateStudentState = [...interviewStudentState];
        updateStudentState.forEach(item => {
            if(item?.isEditAccess || item?.addPanelInterview){
                item.isSelected = checked;
            }
        });
        setInterviewStudentState(updateStudentState);
        setInterviewStudentData(updateStudentState);
    }, [interviewStudentState]);

    const singleStudentCheckHndlr = useCallback((event: any) => {
        const { checked } = event.currentTarget,
            registrationNumber = event.currentTarget.getAttribute("data-id"),
            studentRowIndex = interviewStudentState.findIndex((item: any) => item.studentRegId === Number(registrationNumber));
        if (studentRowIndex > -1) {
            const studentDetails: any = interviewStudentState[studentRowIndex];
            let updateStudentState = [...interviewStudentState];
            updateStudentState.splice(studentRowIndex, 1, {
                ...studentDetails, isSelected: checked,
            });
            setInterviewStudentState(updateStudentState);
            setInterviewStudentData(updateStudentState);
            const isAllSelected = updateStudentState.every((item: any) => item.isSelected);
            setAllStudentSelectedState(isAllSelected);
        }
    }, [interviewStudentState]);


    function showPasswordHndlr() {
        setShowPasswordState(!showPasswordState);
    }


    //Confirm Interview Handler
    function cancelModalAdmissionHndlr() {
        setCancelAdmissionState((prevState: any) => ({
            ...prevState, showConfirmModal: false,
            studentRegId: ""
        }));
    }
    function revertCancelModalAdmissionHndlr() {
        setRevertCancelAdmissionState((prevState: any) => ({
            ...prevState, showConfirmModal: false,
            studentRegId: ""
        }));
    }

    function revertCancelAdmissionModalSubmitHndlr() {
        const { studentRegId } = revertCancelAdmissionState
        if (studentRegId) {
            revertCancelModalAdmissionHndlr();
            const studentRowIndex = interviewStudentState.findIndex((item: any) => item.studentRegId === Number(studentRegId));
            if (studentRowIndex > -1) {
                const studentDetails: any = interviewStudentState[studentRowIndex];
                let updateStudentState = [...interviewStudentState];
                updateStudentState.splice(studentRowIndex, 1, {
                    ...studentDetails,
                    admissionCancel: "NO",
                    isInterviewScheduledOrCancelled: true
                });
                setInterviewStudentState(updateStudentState);
                setInterviewStudentData(updateStudentState);
            }
        }
    }
    function cancelAdmissionModalSubmitHndlr(remarkInfo: any) {
        const { studentRegId } = cancelAdmissionState,
            { remarks } = remarkInfo;
        if (studentRegId) {
            cancelModalAdmissionHndlr();
            const studentRowIndex = interviewStudentState.findIndex((item: any) => item.studentRegId === Number(studentRegId));
            if (studentRowIndex > -1) {
                const studentDetails: any = interviewStudentState[studentRowIndex];
                let updateStudentState = [...interviewStudentState];
                updateStudentState.splice(studentRowIndex, 1, {
                    ...studentDetails,
                    // scheduleMode: "",
                    // meetingLink: "",
                    // meetingId: "",
                    // meetingPassword: "",
                    // timeSlot: "",
                    admissionCancel: "YES",
                    admissionCancelReason: remarks,
                    isInterviewScheduledOrCancelled: true
                });
                setInterviewStudentState(updateStudentState);
                setInterviewStudentData(updateStudentState);
            }
        }
    }

    const scheduleMeetingHndlr = useCallback((studentRegId: any, meetingInfo: any) => {
        if (studentRegId) {
            toggleScheduleInterviewModal();
            const studentRowIndex = interviewStudentState.findIndex((item: any) => item.studentRegId === Number(studentRegId));
            if (studentRowIndex > -1) {
                const studentDetails: any = interviewStudentState[studentRowIndex];
                let updateStudentState = [...interviewStudentState];
                updateStudentState.splice(studentRowIndex, 1, {
                    ...studentDetails, ...meetingInfo,
                    isInterviewScheduledOrCancelled: true,
                    admissionCancel: "",
                    admissionCancelReason: "",
                });
                setInterviewStudentState(updateStudentState);
                setInterviewStudentData(updateStudentState);
            }
        }
    }, [interviewStudentState]);


    const ChangeScheduleModeHndler = useCallback((event: any, studentRegId: any,) => {
        if (studentRegId) {
            const newData = interviewStudentState?.map((item: any) => {
                if (+item?.studentRegId === +studentRegId) {
                    if (event?.target?.value?.toLowerCase() === "physical") {
                        return { ...item, scheduleMode: event?.target?.value, meetingLink: "", meetingId: "", meetingPassword: "" }
                    }
                    return { ...item, scheduleMode: event?.target?.value }
                } else {
                    return item;
                }
            })
            setInterviewStudentState(newData);
            setInterviewStudentData(newData);
        }
    }, [interviewStudentState])

    const onChangeHandlerForStudent = useCallback((event: any, studentRegId: any, textName: any) => {

        const newData = interviewStudentState?.map((item: any) => {
            if (+item?.studentRegId === +studentRegId) {
                return { ...item, [textName]: event?.target?.value }
            } else {
                return item;
            }
        })
        setInterviewStudentState(newData);
        setInterviewStudentData(newData);

    }, [interviewStudentState])

    const addNewInterviewColumns = useMemo(() => generateColumns(menuOptions, scheduleInterviewHandler,
        allStudentSelectedState, allStudentCheckHndlr, singleStudentCheckHndlr, ChangeScheduleModeHndler
    ), [interviewStudentState]);

    function searchHandler(event: any) {
        setSearch(event.target.value);
        const searchTermLowerCase = event.target.value?.toLowerCase();
        const filteredData = interviewStudentData?.filter((item: any) => {
            const regNo = item?.studentRegistrationNo?.toLowerCase();
            const studentName = item?.studentName?.toLowerCase();

            return regNo.includes(searchTermLowerCase) || studentName.includes(searchTermLowerCase);
        });
        setInterviewStudentState(filteredData);
    }

    const timeHandleChange = (event: any) => {
        interviewDetailsForm.handleChange(event)

        const newData = interviewStudentState?.map((item: any) => {
            return { ...item, timeSlot: event.target.value }
        })
        setInterviewStudentState(newData);
        setInterviewStudentData(newData);
    }
    return (
        <>
            <div className="page-content new_fee_receipt_page_warp">
                <div className="container-fluid">
                    <BreadCrumb pageTitle="Admissions" />

                    <div className="tw-bg-white tw-rounded-lg tw-shadow tw-mb-4">
                        <form onSubmit={filterForm.handleSubmit}>
                            <div className="tw-p-4">
                                <div className="tw-grid tw-grid-cols-12 tw-gap-x-3">
                                    <div className="tw-col-span-12 lg:tw-col-span-4">
                                        <SelectInput
                                            name="academicYearId"
                                            labelText="Academic Year"
                                            value={filterForm.values.academicYearId}
                                            onChange={onChangeFilterHndlr}
                                            onBlur={filterForm.handleBlur}
                                            menuItems={academicYearListResp?.data}
                                            valueKey="academicYearId"
                                            textKey="academicYearName"
                                            labelClass="required"
                                            invalid={(filterForm.touched.academicYearId && filterForm.errors.academicYearId) ? true : false}
                                            error={(filterForm.touched.academicYearId && filterForm.errors.academicYearId) ? filterForm.errors.academicYearId : ""}
                                            isDisabled={interviewId}
                                        />
                                    </div>
                                    <div className="tw-col-span-12 lg:tw-col-span-4">
                                        <SelectInput
                                            name="curriculumId"
                                            labelText="Curriculum"
                                            value={filterForm.values.curriculumId}
                                            onChange={onChangeFilterHndlr}
                                            onBlur={filterForm.handleBlur}
                                            menuItems={brchCurriculumResp?.data}
                                            valueKey="branchCurriculumId"
                                            textKey="curriculumName"
                                            labelClass="required"
                                            invalid={(filterForm.touched.curriculumId && filterForm.errors.curriculumId) ? true : false}
                                            error={(filterForm.touched.curriculumId && filterForm.errors.curriculumId) ? filterForm.errors.curriculumId : ""}
                                            isDisabled={interviewId}
                                        />
                                    </div>
                                    <div className="tw-col-span-12 lg:tw-col-span-4">
                                        <SelectInput
                                            name="classId"
                                            labelText="Class"
                                            value={filterForm.values.classId}
                                            onChange={onChangeFilterHndlr}
                                            onBlur={filterForm.handleBlur}
                                            menuItems={evaluationClassList || []}
                                            valueKey="branchClassId"
                                            textKey="className"
                                            labelClass="required"
                                            invalid={(filterForm.touched.classId && filterForm.errors.classId) ? true : false}
                                            error={(filterForm.touched.classId && filterForm.errors.classId) ? filterForm.errors.classId : ""}
                                            isDisabled={interviewId}
                                        />
                                    </div>
                                    <div className="tw-col-span-12 lg:tw-col-span-4">
                                        <SelectInput
                                            name="mode"
                                            formgroupClassName="tw-mb-3 lg:tw-mb-1"
                                            value={filterForm.values.mode}
                                            onChange={onChangeFilterHndlr}
                                            onBlur={filterForm.handleBlur}
                                            labelClass="required"
                                            menuItems={[{ id: "OFFLINE", name: "Offline" }, { id: "ONLINE", name: "Online" }]}
                                            valueKey="id"
                                            textKey="name"
                                            labelText="Registration Type"
                                            invalid={(filterForm.touched.mode && filterForm.errors.mode) ? true : false}
                                            error={(filterForm.touched.mode && filterForm.errors.mode) ? filterForm.errors.mode : ""}
                                            isDisabled={interviewId}
                                        />
                                    </div>
                                    {interviewReschedule && (
                                        <div className="tw-col-span-12 lg:tw-col-span-4">
                                            <SelectInput
                                                name="rescheduleFilter"
                                                formgroupClassName="tw-mb-3 lg:tw-mb-1"
                                                value={filterForm.values.rescheduleFilter}
                                                onChange={onChangeFilterHndlr}
                                                menuItems={[{ id: "ABSENT" }, { id: "REOBSERVATION" }]}
                                                valueKey="id"
                                                textKey="id"
                                                isDisabled={interviewId}
                                                labelText="Reschedule Type"
                                            />
                                        </div>
                                    )}
                                    <div className={`tw-col-span-12 ${interviewReschedule ? "lg:tw-col-span-3" : "lg:tw-col-span-4"}`}>
                                        <RadioInputContainer
                                            name="scheduleMode"
                                            formgroupClassName="tw-mb-3 lg:tw-mb-1"
                                            labelText="Schedule Type"
                                            inputContainerClassName="tw-mt-2"
                                            radioOptions={[{ id: "ALL", name: "All" }, { id: "PHYSICAL", name: "Physical" }, { id: "VIRTUAL", name: "Virtual" }]}
                                            value={filterForm.values.scheduleMode}
                                            onChange={onChangeFilterHndlr}
                                            isDisabled={interviewId}
                                        />
                                    </div>
                                    {!interviewId && (
                                        <div className={`tw-col-span-4 ${interviewReschedule && "lg:tw-col-span-1"} tw-mb-3 tw-flex tw-justify-end tw-items-end`}>
                                            <Button type="submit"  variant="primary">
                                                Search
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </form>
                    </div>

                    {interviewStudentData && interviewStudentData.length > 0 ? (
                        <form onSubmit={interviewDetailsForm.handleSubmit}>
                            {/* Interview Details Card */}
                            <div className="tw-bg-white tw-rounded-lg tw-shadow tw-mb-4">
                                <div className="tw-px-4 tw-py-3 tw-border-b">
                                    <span className="tw-text-lg tw-font-bold">
                                        Interview Details
                                    </span>
                                </div>
                                <div className="tw-grid tw-grid-cols-12 tw-gap-x-3 tw-p-4">
                                    <div className="tw-col-span-12 lg:tw-col-span-4">
                                        <DateInput
                                            name="interviewDate"
                                            value={interviewDetailsForm.values.interviewDate}
                                            onChange={interviewDetailsForm.handleChange}
                                            onBlur={interviewDetailsForm.handleBlur}
                                            labelText="Interview Date"
                                            invalid={interviewDetailsForm.touched.interviewDate &&
                                            interviewDetailsForm.errors.interviewDate
                                            ? true
                                            : false}
                                            error={interviewDetailsForm.touched.interviewDate &&
                                            interviewDetailsForm.errors.interviewDate
                                            ? interviewDetailsForm.errors.interviewDate
                                            : ""}
                                        />
                                    </div>
                                    <div className="tw-col-span-12 lg:tw-col-span-4">
                                        <TimeInput
                                            name="timeSlot"
                                            labelText="Time slot"
                                            value={interviewDetailsForm.values.timeSlot}
                                            onChange={timeHandleChange}
                                            onBlur={interviewDetailsForm.handleBlur}
                                            invalid={interviewDetailsForm.touched.timeSlot &&
                                            interviewDetailsForm.errors.timeSlot
                                            ? true
                                            : false}
                                        error={interviewDetailsForm.touched.timeSlot &&
                                            interviewDetailsForm.errors.timeSlot
                                            ? interviewDetailsForm.errors.timeSlot
                                            : ""}
                                        />
                                    </div>
                                    <div className="tw-col-span-12 lg:tw-col-span-4">
                                        <TextInput
                                            name="orientationMeetingLink"
                                            labelText="Orientations Meeting Link"
                                            value={interviewDetailsForm.values.orientationMeetingLink}
                                            onChange={interviewDetailsForm.handleChange}
                                            onBlur={interviewDetailsForm.handleBlur}
                                            maxLength={1000}
                                            invalid={(interviewDetailsForm.touched.orientationMeetingLink && interviewDetailsForm.errors.orientationMeetingLink) ? true : false}
                                            error={(interviewDetailsForm.touched.orientationMeetingLink && interviewDetailsForm.errors.orientationMeetingLink) ? interviewDetailsForm.errors.orientationMeetingLink : ""}
                                        />
                                    </div>
                                    <div className="tw-col-span-12 lg:tw-col-span-4">
                                        <TextInput
                                            name="meetingId"
                                            labelText="Meeting ID"
                                            value={interviewDetailsForm.values.meetingId}
                                            onChange={interviewDetailsForm.handleChange}
                                            onBlur={interviewDetailsForm.handleBlur}
                                            invalid={(interviewDetailsForm.touched.meetingId && interviewDetailsForm.errors.meetingId) ? true : false}
                                            error={(interviewDetailsForm.touched.meetingId && interviewDetailsForm.errors.meetingId) ? interviewDetailsForm.errors.meetingId : ""}
                                        />
                                    </div>
                                    <div className="tw-col-span-12 lg:tw-col-span-4">
                                        <TextIconInput
                                            iconPositionClassName="right"
                                            labelText="Password"
                                            inputType={(showPasswordState) ? "text" : "password"}
                                            name="password"
                                            placeHolder="Password"
                                            autoComplete="new-password"
                                            onChange={interviewDetailsForm.handleChange}
                                            onBlur={interviewDetailsForm.handleBlur}
                                            value={interviewDetailsForm.values.password || ""}
                                            invalid={(interviewDetailsForm.touched.password && interviewDetailsForm.errors.password) ? true : false}
                                            error={(interviewDetailsForm.touched.password && interviewDetailsForm.errors.password) ? interviewDetailsForm.errors.password : ""}
                                        >
                                            <i
                                                data-id="showNewPwdIcon"
                                                onClick={showPasswordHndlr}
                                                className={classnames("tw-align-middle tw-text-gray-400", {
                                                    "ri-eye-fill": (showPasswordState),
                                                    "ri-eye-off-fill": !(showPasswordState)
                                                })}
                                            ></i>
                                        </TextIconInput>
                                    </div>
                                </div>
                            </div>

                            {/* Student List Card */}
                            <div className="tw-bg-white tw-rounded-lg tw-shadow tw-mb-4">
                                <div className="tw-px-4 tw-py-3 tw-border-b">
                                    <span className="tw-text-lg tw-font-bold">
                                        Student List
                                    </span>
                                </div>
                                <div className="tw-p-0">
                                    <div className="tw-grid tw-grid-cols-12">
                                        <div className="tw-col-span-6">
                                            <div className="tw-relative tw-m-3">
                                                <TextInput
                                                    name="searchString"
                                                    value={search}
                                                    onChange={searchHandler}
                                                    formgroupClassName="tw-mb-0"
                                                    placeHolder="Search..."
                                                />
                                                <i className="ri-search-line tw-absolute tw-right-3 tw-top-1/2 tw--translate-y-1/2"></i>
                                            </div>
                                        </div>

                                        {interviewStudentState?.some((element: any) => !element?.addPanelInterview && !element?.isEditAccess) && (
                                            <div className="tw-col-span-12 tw-ml-3 tw-mb-3 tw-flex" style={{ color: "#f06548" }}>
                                                <div>Note :</div>
                                                <div className="tw-ml-2">
                                                    <InputCheckbox
                                                        name={`stuent-disable`}
                                                        isDisabled={true}
                                                        value={true}
                                                        onChange={undefined}
                                                        formgroupClassName="tw-mb-0"
                                                    />
                                                </div>
                                                <div>Application has already moved to the next evaluation process.</div>
                                            </div>
                                        )}

                                        <div className="tw-col-span-12">
                                            <TableContainer
                                                columns={addNewInterviewColumns}
                                                data={interviewStudentState}
                                                divClass="tw-overflow-x-auto"
                                                theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
                                                onChangeInputHndlr={onChangeHandlerForStudent}
                                            />
                                        </div>

                                        <div className='tw-col-span-12 tw-flex tw-justify-center tw-py-3'>
                                            <FormGroup check>
                                                <Label check>
                                                    <Input
                                                        type="checkbox"
                                                        name='hello'
                                                        checked={smsAndEmail?.isSMS}
                                                        onClick={() => setSmsAndEmail((prev: any) => ({ ...prev, isSMS: !prev.isSMS }))}
                                                    /> SMS
                                                </Label>
                                            </FormGroup>
                                            <FormGroup check className='tw-ml-4'>
                                                <Label check>
                                                    <Input
                                                        type="checkbox"
                                                        name='hello'
                                                        checked={smsAndEmail?.isEmail}
                                                        onClick={() => setSmsAndEmail((prev: any) => ({ ...prev, isEmail: !prev.isEmail }))}
                                                    /> Email
                                                </Label>
                                            </FormGroup>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="tw-col-span-12 tw-flex tw-gap-2 tw-justify-end tw-mb-4">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => { history.push('/admission-management') }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    disabled={(submitButtonError === undefined || submitButtonError || showApiLoader) && true}
                                >
                                    Submit
                                </Button>
                            </div>
                        </form>
                    ) : (
                        <div className="tw-bg-white tw-rounded-lg tw-shadow tw-mb-4">
                            <div className="tw-p-4">
                                <NoDataComp helperText="Try adjusting the filter to get the student for scheduling the interview." />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <ModalContainerUpdated
                id="specialfee-student"
                isOpen={scheduleInterviewModalState.showModal}
                toggle={toggleScheduleInterviewModal}
                modalTitle="Schedule Interview"
                modalSize="md"
            // modalSize="lg"
            >
                <ScheduleInterviewModal
                    studentDetails={scheduleInterviewModalState.modalDetails}
                    toggle={toggleScheduleInterviewModal}
                    scheduleMeetingHndlr={scheduleMeetingHndlr}
                />
            </ModalContainerUpdated>

            <ModalContainerUpdated
                id="cancel-amdission-modal"
                isOpen={cancelAdmissionState.showConfirmModal}
                toggle={cancelModalAdmissionHndlr}
                hideHeader={true}
                modalSize="md"
            >
                <CancelAdmissionModal
                    toggle={cancelModalAdmissionHndlr}
                    confirmHndlr={cancelAdmissionModalSubmitHndlr}
                />
            </ModalContainerUpdated>
            {/* <ConfirmationModal
                id="delete-branch-modal"
                isOpen={cancelAdmissionState.showConfirmModal}
                confirmMessage="Are you sure you want to delete the schedule interview ?"
                cancelHndlr={cancelModalAdmissionHndlr}
                confirmHndlr={cancelAdmissionModalSubmitHndlr}
            /> */}
             <ConfirmationModal
                id="revert-cancel-admission"
                isOpen={revertCancelAdmissionState.showConfirmModal}
                confirmMessage="Are you sure you want to Revert the Cancel Admission ?"
                cancelHndlr={revertCancelModalAdmissionHndlr}
                confirmHndlr={revertCancelAdmissionModalSubmitHndlr}
                showImgIcon={true}
                iconType='approve'
                btnClassName='btn w-sm btn-success'
            />
        </>
    );
};

export default AddNewInterview;
