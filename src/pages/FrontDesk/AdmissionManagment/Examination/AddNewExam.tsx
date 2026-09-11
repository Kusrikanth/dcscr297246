import React, { useRef, useEffect, useMemo, useState, useCallback } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import classnames from "classnames";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import {
     DateInput, TimeInput, ModalContainerUpdated, RadioInputContainer, SelectInput
    , ConfirmationModal, InputCheckbox,
    TextIconInput, TextInput
} from "../../../../Components/Common";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import CancelAdmissionModal from "./CancelAdmissionModal";
// import FeeDetailsTable from "./FeeDetailsTable";
import TableContainer from "../../../../Components/Common/TableContainer";
//Helper
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
//Action Generator
import { generateActionPayload } from "../../../../utility/reduxutility";
import {
    getInstAcademicYearAct,
} from "../../../../store/mastersettings/instacademics/instacademicactions";
import {
    getBranchCurriculumAct, getBranchClassAct,
} from "../../../../store/branchsettings/branchacademics/branchacademicsactions";
import {
    getStudentsForExaminationScheduleAct, scheduleExaminationAct, updateExaminationScheduleAct,
    getExaminationDetailsAct,
    resetStudentsForExaminationScheduleAct,
} from "../../../../store/FrontDesk/examination/examinationactions";

import { addFeeReceiptAct } from "../../../../store/fee/feecollections/feecollectionactions";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { computeSubmitButtonError, generateColumns, isEditAccess, scheduledModeOptions } from "./helper";
import ScheduleExaminationModal from "./ScheduleExaminationModal";
import { convertTo12HourFormat, convertTo24HourFormat, getYyyyMmDdFormat } from "../../../../utility/dateutility";
import NoDataComp from "../../../../Components/Common/NoDataComp";
import { getEvaluationClassList, resetEvaluationClassList } from "../../../../store/FrontDesk/Interview/interviewactions";
import Button from "../../../../Components/Common/Button";

const filterFormValidationSchema = Yup.object().shape({
    academicYearId: Yup.string().required("Select academic year."),
    curriculumId: Yup.string().required("Select curriculum id."),
    classId: Yup.string().required("Select class."),
    registrationType: Yup.string().required("Select registration type."),
});

const interviewFormValidationSchema = Yup.object().shape({
    examDate: Yup.string().required("Select interview date."),
    // timeSlot: Yup.string().required("From time slot is required."),
    // meetingLink: Yup.string().required("Metting link is required"),
    // meetingId: Yup.string().required("Metting id is required"),
    // passCode: Yup.string().required("Password is required."),
});

function getFilterInitialState(filterState?: any) {
    let scheduleType: string = "ALL";
    const { students } = filterState || {};
    if (Array.isArray(students)) {
        let countPhysical = 0, countVirtual = 0;
        students.forEach((item: any) => {
            if (item.scheduleMode === "PHYSICAL") {
                countPhysical += 1;
            } else if (item.scheduleMode === "VIRTUAL") {
                countVirtual += 1;
            }
        })
        if (countPhysical === students.length) {
            scheduleType = "PHYSICAL";
        } else if (countVirtual === students.length) {
            scheduleType = "VIRTUAL";
        }
    }
    return ({
        academicYearId: filterState?.academicYearId || "",
        curriculumId: filterState?.curriculumId || "",
        classId: filterState?.classId || "",
        scheduleType: scheduleType,
        registrationType: filterState?.registrationType?.toUpperCase() || "ONLINE",
    });
}

function getScheduleInterviewState(interviewDetails?: any) {
    return ({
        examDate: interviewDetails?.examDetails?.examDate ? getYyyyMmDdFormat(interviewDetails?.examDetails?.examDate) : "",
        timeSlot: convertTo24HourFormat(interviewDetails?.examDetails?.timeSlot) || "",
        meetingLink: interviewDetails?.orientation?.meetingLink || "",
        meetingId: interviewDetails?.orientation?.meetingId || "",
        passCode: interviewDetails?.orientation?.passCode || "",
        sendEmail: true,
        sendSms: true,
    });
}

const initialFilterState = getFilterInitialState();
const initialInterviewState = getScheduleInterviewState();
const AddNewInterview = () => {
    const { examScheduleId }: any = useParams();
    const [examStudentState, setExamStudentState] = useState<any>([]);
    const [examStudentData, setExamStudentData] = useState<any>([]);
    const [search, setSearch] = useState<any>('');
    const [showPasswordState, setShowPasswordState] = useState(false);
    const [allStudentSelectedState, setAllStudentSelectedState] = useState(false);
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
    const history = useHistory();
    const location = useLocation()
    const dispatch = useAppDispatch();
    const {
        userMeResp,
        branchClassResp,
        academicYearListResp, brchCurriculumResp,
        currentInstIdResp: instituteId, currentBranchIdResp: branchId,
        studentsForExaminationScheduleResp,
        evaluationClassList,
        scheduleExaminationResp,
        examinationDetailsResp,
        updateExaminationDetailsResp, showApiLoader,
        examinationErrorResp }: any =
        useAppSelector(({ login, appData, branchAcademics, examination, interview,
            instAcademics, globalData }) => ({
                userMeResp: login.userMeResp,
                branchClassResp: branchAcademics.branchClassResp,
                brchCurriculumResp: branchAcademics.brchCurriculumResp,
                academicYearListResp: instAcademics.academicYearListResp,
                currentInstIdResp: appData.currentInstIdResp,
                currentBranchIdResp: appData.currentBranchIdResp,
                studentsForExaminationScheduleResp: examination.studentsForExaminationScheduleResp,
                evaluationClassList: interview.evaluationClassList,
                scheduleExaminationResp: examination.scheduleExaminationResp,
                examinationDetailsResp: examination.examinationDetailsResp,
                updateExaminationDetailsResp: examination.updateExaminationDetailsResp,
                examinationErrorResp: examination.examinationErrorResp,
                showApiLoader: globalData.showApiLoader,
            }), shallowEqual);

    const addNewInterviewRespRef = useRef<any>({
        prevAcademicYearListResp: academicYearListResp,
        prevBrchCurriculumResp: brchCurriculumResp,
        prevScheduleExaminationResp: scheduleExaminationResp,
        prevStudentsForExaminationScheduleResp: studentsForExaminationScheduleResp,
        prevExaminationDetailsResp: examinationDetailsResp,
        prevUpdateExaminationDetailsResp: updateExaminationDetailsResp,
        prevInterviewErrorResp: examinationErrorResp,
    });
    useEffect(() => {
        return () => {
            dispatch(resetStudentsForExaminationScheduleAct(undefined));
        }
    }, []);

    useEffect(() => {
        if (examScheduleId) {
            const params = { examScheduleId };
            dispatch(getExaminationDetailsAct(generateActionPayload("get_examination_details", params)));
        }
    }, [examScheduleId]);

    useEffect(() => {
        const { prevStudentsForExaminationScheduleResp, prevUpdateExaminationDetailsResp, prevScheduleExaminationResp, prevExaminationDetailsResp, prevInterviewErrorResp } = addNewInterviewRespRef.current;
        if (studentsForExaminationScheduleResp && studentsForExaminationScheduleResp !== prevStudentsForExaminationScheduleResp) {
            const { data: studentsList } = studentsForExaminationScheduleResp;
            if (Array.isArray(studentsList)) {
                const studentList = studentsList.map((studentInfo) => {
                    return (
                        {
                            id: "",
                            studentRegId: studentInfo?.studentRegId,
                            studentRegistrationNo: studentInfo?.studentRegNo,
                            admissionCancel: studentInfo?.cancelAdmission || "",
                            admissionCancelReason: "",
                            studentName: studentInfo?.studentName,
                            fatherName: studentInfo?.fatherName,
                            admissionType: studentInfo?.admissionType,
                            rescheduled: studentInfo?.rescheduled,
                            email: studentInfo?.emailId,
                            communicationAddress: studentInfo?.address,
                            admissionProcess:studentInfo?.admissionProcess || "",
                            meetingLink: "",
                            isSelected: false,
                            addExam : true,
                            meetingId: "",
                            meetingPassword: "",
                            timeSlot: convertTo24HourFormat(studentInfo?.timeSlot) || "",
                            isExaminationScheduledOrCancelled: false,
                            scheduleMode: studentInfo?.scheduleMode || "",
                            mobileNumber: studentInfo?.mobileNumber,
                            groupShortName: studentInfo?.groupShortName,
                            districtName: studentInfo?.districtName,
                            studentImgUrl: studentInfo?.studentImgUrl,
                        }
                    )
                })
                setExamStudentState(studentList);
                setExamStudentData(studentList);

            }
        }
        else if (examinationDetailsResp && examinationDetailsResp !== prevExaminationDetailsResp) {
            getCurriculumApiCall({ academicYearId: examinationDetailsResp?.academicYearId });
            getClassApiCall({ curriculumId: examinationDetailsResp?.curriculumId , academicYearId: examinationDetailsResp?.academicYearId });
            const { students, examDetails, orientation } = examinationDetailsResp,
                updateFilterState = getFilterInitialState(examinationDetailsResp),
                updatedInterviewDetailState = getScheduleInterviewState(examinationDetailsResp);

            filterForm.resetForm({
                values: updateFilterState
            })
            interviewDetailsForm.resetForm({
                values: updatedInterviewDetailState
            })
            if (Array.isArray(students)) {
                const studentInterviewList = students.map((studentInfo: any) => {
                    return (
                        {
                            id: studentInfo?.id,
                            studentRegId: studentInfo?.studentRegId,
                            studentRegistrationNo: studentInfo?.studentRegNo,
                            admissionCancel: studentInfo?.cancelAdmission,
                            admissionCancelReason: studentInfo?.cancelReason,
                            studentName: studentInfo?.studentName,
                            fatherName: studentInfo?.fatherFirstName,
                            admissionType: studentInfo?.admissionType,
                            rescheduled: studentInfo?.rescheduled,
                            email: studentInfo?.email,
                            groupShortName: studentInfo?.streamGroupShortName,
                            communicationAddress: studentInfo?.communicationAddress,
                            meetingLink: studentInfo?.meetingLink,
                            isSelected: true,
                            addExam:false,
                            isEditAccess :isEditAccess(studentInfo?.admissionProcess),
                            admissionProcess:studentInfo?.admissionProcess,
                            meetingId: studentInfo?.meetingId,
                            meetingPassword: studentInfo?.passCode,
                            timeSlot: convertTo24HourFormat(studentInfo?.timeSlot),
                            isExaminationScheduledOrCancelled: true,
                            scheduleMode: studentInfo?.scheduleMode,
                            mobileNumber: studentInfo?.mobileNumber,
                            studentImgUrl: studentInfo?.studentImgUrl,
                        }
                    )
                })
                setExamStudentState(studentInterviewList);
                setExamStudentData(studentInterviewList);
            }
        }
        else if (scheduleExaminationResp && scheduleExaminationResp !== prevScheduleExaminationResp) {
            toast.success("Exam scheduled successfully.");
            history.push(`/admission-management`);
        }
        else if (updateExaminationDetailsResp && updateExaminationDetailsResp !== prevUpdateExaminationDetailsResp) {
            toast.success("Exam scheduled updated successfully.");
            history.push(`/admission-management`);
        }
        else if (examinationErrorResp && examinationErrorResp !== prevInterviewErrorResp) {
            const { message }: any = examinationErrorResp;
            toast.error(message || "Something went wrong.");
        }
        addNewInterviewRespRef.current.prevExaminationDetailsResp = examinationDetailsResp;
        addNewInterviewRespRef.current.prevScheduleExaminationResp = scheduleExaminationResp;
        addNewInterviewRespRef.current.prevUpdateExaminationDetailsResp = updateExaminationDetailsResp;
        addNewInterviewRespRef.current.prevStudentsForExaminationScheduleResp = studentsForExaminationScheduleResp;
        addNewInterviewRespRef.current.prevInterviewErrorResp = examinationErrorResp;
    }, [studentsForExaminationScheduleResp,
        scheduleExaminationResp,
        updateExaminationDetailsResp,
        examinationDetailsResp,
        examinationErrorResp]);

    useEffect(() => {
        const { data } = academicYearListResp || {};
        if (Array.isArray(data) && data.length > 0) {
            let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.isAdmissionDefault)?.academicYearId
            // academicsFilterForm.setValues((prev:any)=>({...prev,masterAcademicYearId:yearId}))
            filterForm.setFieldValue("academicYearId", `${yearId}`)
            if(!examScheduleId){
                getCurriculumApiCall({academicYearId : yearId})
            }
            // ExaminationMarksList({ academicYearId: yearId })
        }
    }, [academicYearListResp]);

    const filterForm = useFormik({
        initialValues: initialFilterState,
        validationSchema: filterFormValidationSchema,
        onSubmit: (values) => {
            if (examScheduleId) {
                return;
            }
            const { scheduleMode, ...payload }: any = filterForm.values;

            if (scheduleMode === "ALL") {
                payload.scheduleMode = null;
            } else {
                payload.scheduleMode = scheduleMode;
            }
            if(location?.pathname?.includes("reschedule")){
                payload.reSchedule = true;
            }else{
                payload.reSchedule = false;
            }
            payload.brachId = branchId;
            payload.instituteId = instituteId;
            getStudentToScheduleApiCall(payload);
        }
    })
    const interviewDetailsForm = useFormik({
        initialValues: initialInterviewState,
        validationSchema: interviewFormValidationSchema,
        onSubmit: (values) => {
            const examStudents: any = [];
            if (examScheduleId) {
                const payload = {
                    orientation: {
                        meetingLink: values?.meetingLink,
                        meetingId: values?.meetingId,
                        passCode: values?.passCode
                    },
                    examDetails: {
                        examDate: values?.examDate,
                        timeSlot: values?.timeSlot ? `${convertTo12HourFormat(values?.timeSlot)}` : "",
                    },
                    sendEmail: values?.sendEmail,
                    sendSms: values?.sendSms,
                    examScheduleId: +examScheduleId,
                    instituteId,
                    branchId,
                    academicYearId: filterForm.values.academicYearId,
                    curriculumId: filterForm.values.curriculumId,
                    classId: filterForm.values.classId,
                    
                    registrationType: filterForm.values.registrationType,
                    examType: null,
                    scheduleFor: null,
                    userName: null,
                    userId: null,
                    students: examStudents
                }

                examStudentState.forEach((item: any) => {
                    if (item.isSelected && item?.isEditAccess) {
                        examStudents.push({
                            studentRegId: item?.studentRegId || "",
                            studentName: item?.studentName || "",
                            meetingLink: item?.meetingLink || "",
                            meetingId: item?.meetingId || "",
                            passCode: item?.meetingPassword || "",
                            timeSlot: `${convertTo12HourFormat(item?.timeSlot) || ""}` || null,
                            scheduleMode: item?.scheduleMode || null,
                            cancelAdmission: item?.admissionCancel || "NO",
                            cancelReason: item?.admissionCancelReason || "",
                        });
                    }
                });
                payload.students = examStudents;
                const params = { examScheduleId };
                dispatch(updateExaminationScheduleAct(generateActionPayload("update_exam", undefined, payload)));
            } else {
                const payload = {
                    instituteId,
                    branchId,
                    curriculumId: filterForm.values.curriculumId,
                    classId: filterForm.values.classId,
                    academicYearId: filterForm.values.academicYearId,
                    registrationType: filterForm.values.registrationType,
                    sendEmail: values?.sendEmail,
                    sendSms: values?.sendSms,
                    orientation: {
                        meetingLink: values?.meetingLink,
                        meetingId: values?.meetingId,
                        passCode: values?.passCode,
                    },
                    examDetails: {
                        examDate: values?.examDate,
                        timeSlot: `${convertTo12HourFormat(values?.timeSlot) || ""}` || null,
                    },
                    examType: "School",
                    scheduleFor: filterForm.values.scheduleType,
                    students: examStudents,
                    userName: userMeResp.username,
                    userId: userMeResp.id,
                }
                examStudentState.forEach((item: any) => {
                    if (item.isSelected) {
                        examStudents.push({
                            studentRegId: item?.studentRegId || "",
                            meetingLink: item?.meetingLink || "",
                            meetingId: item?.meetingId || "",
                            passCode: item?.meetingPassword || "",
                            timeSlot: `${convertTo12HourFormat(item?.timeSlot) || ""}` || null,
                            scheduleMode: item?.scheduleMode || null,
                            cancelAdmission: item?.admissionCancel || "NO",
                            cancelReason: item?.admissionCancelReason || "",
                        });
                    }
                });
                payload.students = examStudents;
                dispatch(scheduleExaminationAct(generateActionPayload("schedule_exam", undefined, payload)));
            }
        },
    });

    const scheduleInterviewHandler = useCallback((event: any) => {
        const studentRegistrationId = event.currentTarget.getAttribute("data-id");
        if (studentRegistrationId) {
            const studentInfo = examStudentState.find((item: any) => item.studentRegId === +studentRegistrationId);

            if (studentInfo) {
                setScheduleInterviewModalState({
                    showModal: true,
                    modalDetails: studentInfo,
                })
            }
        }
    }, [examStudentState]);


    const allStudentCheckHndlr = useCallback((event: any) => {
        const { checked } = event.target;
        setAllStudentSelectedState(checked);
        let updateStudentState = [...examStudentState];
        updateStudentState.forEach(item => {
            if(item?.isEditAccess || item?.addExam){
                item.isSelected = checked;
            }
        });
        setExamStudentState(updateStudentState);
        setExamStudentData(updateStudentState);
    }, [examStudentState]);

    const singleStudentCheckHndlr = useCallback((event: any) => {
        const { checked } = event.currentTarget,
            registrationNumber = event.currentTarget.getAttribute("data-id"),
            studentRowIndex = examStudentState.findIndex((item: any) => item.studentRegId === Number(registrationNumber));
        if (studentRowIndex > -1) {
            const studentDetails: any = examStudentState[studentRowIndex];
            let updateStudentState = [...examStudentState];
            updateStudentState.splice(studentRowIndex, 1, {
                ...studentDetails, isSelected: checked,
            });
            setExamStudentState(updateStudentState);
            setExamStudentData(updateStudentState);
            const isAllSelected = updateStudentState.every((item: any) => item.isSelected);
            setAllStudentSelectedState(isAllSelected);
        }
    }, [examStudentState]);

    const ChangeScheduleModeHndler = useCallback((event: any, studentRegId: any,) => {
        if (studentRegId) {
            const newData = examStudentState?.map((item: any) => {
                if (+item?.studentRegId === +studentRegId) {
                    if (event?.target?.value?.toLowerCase() === "physical") {
                        return { ...item, scheduleMode: event?.target?.value, meetingLink: "", meetingId: "", meetingPassword: "" }
                    } else {
                        return { ...item, scheduleMode: event?.target?.value }
                    }
                } else {
                    return item;
                }
            })
            setExamStudentState(newData);
            setExamStudentData(newData);
        }
    }, [examStudentState])

    const onChangeHandlerForStudent = useCallback((event: any, studentRegId: any, textName: any) => {

        const newData = examStudentState?.map((item: any) => {
            if (+item?.studentRegId === +studentRegId) {
                return { ...item, [textName]: event?.target?.value }
            } else {
                return item;
            }
        })
        setExamStudentState(newData);
        setExamStudentData(newData);

    }, [examStudentState])

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
    function scheduleInterviewHndlr(event: any) {
        const studentRegId = event.currentTarget.getAttribute("data-id");
        if (studentRegId) {
            //
        }
    }
    function cancelRevertHndlr(event: any) {
        const studentRegId = event.currentTarget.getAttribute("data-id");
        if (studentRegId)
            setRevertCancelAdmissionState((prevState: any) => ({
                ...prevState, showConfirmModal: true,
                studentRegId
            }));
    }
    function revertCancelModalAdmissionHndlr() {
        setRevertCancelAdmissionState((prevState: any) => ({
            ...prevState, showConfirmModal: false,
            studentRegId: ""
        }));
    }
    const menuOptions = useMemo(() => [
        // {
        //     id: "edit",
        //     actionIcon: <EditSvg className="d-inline-block me-2" fill='#878A99' />,
        //     actionName: "Edit",
        //     onClickHndlr: scheduleInterviewHandler
        // },
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
    ], [examStudentState]);

    const getCurriculumApiCall = (otherProps?: any) => {
        const payload1 = { academicYearId: filterForm.values.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" , ...otherProps };
        dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
    }

    function onChangeFilterHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        // const { name, value } = event.target;
        // filterForm.setFieldValue(name, value);
        
        if (name === "curriculumId") {
            getClassApiCall({ curriculumId: value });
            filterForm.handleChange(event);
        }
        else if (name === "academicYearId") {
            dispatch(resetEvaluationClassList(undefined));
            getCurriculumApiCall({ academicYearId: value });
            filterForm.setValues((prev: any) => ({ ...prev, [name]: value , curriculumId : "" , classId : "" }));
        }else{
            filterForm.handleChange(event);
        }

    }

    function getClassApiCall(otherProps?: any) {
        const { academicYearId, curriculumId } = filterForm.values;
        const payload = { academicYearId: academicYearId, curriculumId: curriculumId, evaluationCode: "EXAM",branchId, ...otherProps };
        if (payload.academicYearId && payload.curriculumId) {
            dispatch(getEvaluationClassList(generateActionPayload('get_evaluation_class_list', undefined, payload)))
        }
    }

    function getStudentToScheduleApiCall(otherProps?: any) {
        const payload = {
            ...filterForm.values, ...otherProps
        };
        dispatch(getStudentsForExaminationScheduleAct(generateActionPayload("get_student_for_examination", undefined, payload)));
    }

    const scheduleMeetingHndlr = useCallback((studentRegId: any, meetingInfo: any) => {
        if (studentRegId) {
            toggleScheduleExamModal();
            const studentRowIndex = examStudentState.findIndex((item: any) => item.studentRegId === Number(studentRegId));
            if (studentRowIndex > -1) {
                const studentDetails: any = examStudentState[studentRowIndex];
                let updateStudentState = [...examStudentState];
                updateStudentState.splice(studentRowIndex, 1, {
                    ...studentDetails, ...meetingInfo,
                    isExaminationScheduledOrCancelled: true,
                    admissionCancel: "",
                    admissionCancelReason: "",
                });
                setExamStudentState(updateStudentState);
                setExamStudentData(updateStudentState);
            }
        }
    }, [examStudentState]);

    function toggleScheduleExamModal() {
        setScheduleInterviewModalState((prevState: any) => ({
            ...prevState, showModal: false
        }))
    }


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

    function revertCancelAdmissionModalSubmitHndlr() {
        const { studentRegId } = revertCancelAdmissionState
        if (studentRegId) {
            revertCancelModalAdmissionHndlr();
            const studentRowIndex = examStudentState.findIndex((item: any) => item.studentRegId === Number(studentRegId));
            if (studentRowIndex > -1) {
                const studentDetails: any = examStudentState[studentRowIndex];
                let updateStudentState = [...examStudentState];
                updateStudentState.splice(studentRowIndex, 1, {
                    ...studentDetails,
                    admissionCancel: "NO",
                    isInterviewScheduledOrCancelled: true
                });
                setExamStudentState(updateStudentState);
                setExamStudentData(updateStudentState);
            }
        }
    }

    function cancelAdmissionModalSubmitHndlr(remarkInfo: any) {
        const { studentRegId } = cancelAdmissionState,
            { remarks } = remarkInfo;
        if (studentRegId) {
            cancelModalAdmissionHndlr();
            const studentRowIndex = examStudentState.findIndex((item: any) => item.studentRegId === Number(studentRegId));
            if (studentRowIndex > -1) {
                const studentDetails: any = examStudentState[studentRowIndex];
                let updateStudentState = [...examStudentState];
                updateStudentState.splice(studentRowIndex, 1, {
                    ...studentDetails,
                    // scheduleMode: "",
                    // meetingLink: "",
                    // meetingId: "",
                    // meetingPassword: "",
                    // timeSlot: "",
                    admissionCancel: "YES",
                    admissionCancelReason: remarks,
                    isExaminationScheduledOrCancelled: true
                });
                setExamStudentState(updateStudentState);
                setExamStudentData(updateStudentState);
            }
        }
    }

    const submitButtonError = useMemo(() => computeSubmitButtonError(examStudentState), [examStudentState]);

    const addNewInterviewColumns = useMemo(() => generateColumns(menuOptions, scheduleInterviewHandler, allStudentSelectedState, allStudentCheckHndlr, singleStudentCheckHndlr, ChangeScheduleModeHndler), [examStudentState]);

    function searchHandler(event: any) {
        setSearch(event.target.value);
        const searchTermLowerCase = event.target.value.toLowerCase();
        const filteredData = examStudentData?.filter((item: any) => {
            const regNo = item.studentRegistrationNo.toLowerCase();
            const studentName = item.studentName.toLowerCase();

            return regNo.includes(searchTermLowerCase) || studentName.includes(searchTermLowerCase);
        });
        setExamStudentState(filteredData);
    }
    const timeHandleChange = (event: any) => {
        interviewDetailsForm.handleChange(event)

        const newData = examStudentState?.map((item: any) => {
            return { ...item, timeSlot: event.target.value }
        })
        setExamStudentState(newData);
        setExamStudentData(newData);
    }
    return (
        <>
            <div className="page-content new_fee_receipt_page_warp">
                <div className="container-fluid">
                    <BreadCrumb pageTitle="Admissions" />

                    <div className="tw-bg-white tw-rounded tw-shadow tw-mb-4">
                        <form onSubmit={filterForm.handleSubmit}>
                            <div className="tw-p-4">
                                <div className="tw-flex tw-flex-wrap -tw-mx-1.5">
                                    <div className="tw-w-full lg:tw-w-1/3 tw-px-1.5">
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
                                            isDisabled={examScheduleId}
                                        />
                                    </div>
                                    <div className="tw-w-full lg:tw-w-1/3 tw-px-1.5">
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
                                            isDisabled={examScheduleId}
                                        />
                                    </div>
                                    <div className="tw-w-full lg:tw-w-1/3 tw-px-1.5">
                                        <SelectInput
                                            name="classId"
                                            labelText="Class"
                                            value={filterForm.values.classId}
                                            onChange={onChangeFilterHndlr}
                                            menuItems={evaluationClassList || []}
                                            valueKey="branchClassId"
                                            textKey="className"
                                            formgroupClassName="tw-mb-0"
                                            defaultSelect="Class"
                                            labelClass="required"
                                            invalid={(filterForm.touched.classId && filterForm.errors.classId) ? true : false}
                                            error={(filterForm.touched.classId && filterForm.errors.classId) ? filterForm.errors.classId : ""}
                                            isDisabled={examScheduleId}
                                        />
                                    </div>
                                    <div className="tw-w-full lg:tw-w-1/3 tw-px-1.5">
                                        <SelectInput
                                            name="registrationType"
                                            formgroupClassName="tw-mb-3 lg:tw-mb-1"
                                            value={filterForm.values.registrationType}
                                            onChange={onChangeFilterHndlr}
                                            onBlur={filterForm.handleBlur}
                                            menuItems={[{ id: "OFFLINE", name: "Offline" }, { id: "ONLINE", name: "Online" }]}
                                            valueKey="id"
                                            textKey="name"
                                            labelText="Registration Type"
                                            labelClass="required"
                                            invalid={(filterForm.touched.registrationType && filterForm.errors.registrationType) ? true : false}
                                            error={(filterForm.touched.registrationType && filterForm.errors.registrationType) ? filterForm.errors.registrationType : ""}
                                            isDisabled={examScheduleId}
                                        />
                                    </div>
                                    <div className="tw-w-full lg:tw-w-1/3 tw-px-1.5">
                                        <RadioInputContainer
                                            name="scheduleType"
                                            formgroupClassName="tw-mb-3 lg:tw-mb-1"
                                            labelText="Schedule Type"
                                            inputContainerClassName="tw-mt-2"
                                            radioOptions={scheduledModeOptions}
                                            value={filterForm.values.scheduleType}
                                            onChange={onChangeFilterHndlr}
                                            isDisabled={examScheduleId}
                                        />
                                    </div>
                                    {!examScheduleId && (
                                        <div className="tw-w-1/3 tw-px-1.5 tw-mb-3 tw-flex tw-justify-end tw-items-end">
                                            <Button type="submit" variant="primary">
                                                Search
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </form>
                    </div>

                    {examStudentData && examStudentData.length > 0 ? (
                        <form onSubmit={interviewDetailsForm.handleSubmit}>

                            <div className="tw-bg-white tw-rounded tw-shadow tw-mb-4">
                                <div className="tw-px-4 tw-py-3 tw-border-b">
                                    <span className="tw-text-lg tw-font-bold">Exam Details</span>
                                </div>
                                <div className="tw-flex tw-flex-wrap -tw-mx-1.5 tw-p-4">
                                    <div className="tw-w-full lg:tw-w-1/3 tw-px-1.5">
                                        <DateInput
                                            name="examDate"
                                            value={interviewDetailsForm.values.examDate}
                                            onChange={interviewDetailsForm.handleChange}
                                            onBlur={interviewDetailsForm.handleBlur}
                                            labelText="Examination Date"
                                            invalid={interviewDetailsForm.touched.examDate && interviewDetailsForm.errors.examDate ? true : false}
                                            error={interviewDetailsForm.touched.examDate && interviewDetailsForm.errors.examDate ? interviewDetailsForm.errors.examDate : ""}
                                        />
                                    </div>
                                    <div className="tw-w-full lg:tw-w-1/3 tw-px-1.5">
                                        <TimeInput
                                            name="timeSlot"
                                            labelText="Time slot"
                                            value={interviewDetailsForm.values.timeSlot}
                                            onChange={timeHandleChange}
                                            onBlur={interviewDetailsForm.handleBlur}
                                            invalid={interviewDetailsForm.touched.timeSlot && interviewDetailsForm.errors.timeSlot ? true : false}
                                            error={interviewDetailsForm.touched.timeSlot && interviewDetailsForm.errors.timeSlot ? interviewDetailsForm.errors.timeSlot : ""}
                                        />
                                    </div>
                                    <div className="tw-w-full lg:tw-w-1/3 tw-px-1.5">
                                        <TextInput
                                            name="meetingLink"
                                            labelText="Orientations Meeting Link"
                                            maxLength={1000}
                                            value={interviewDetailsForm.values.meetingLink}
                                            onChange={interviewDetailsForm.handleChange}
                                            onBlur={interviewDetailsForm.handleBlur}
                                            invalid={(interviewDetailsForm.touched.meetingLink && interviewDetailsForm.errors.meetingLink) ? true : false}
                                            error={(interviewDetailsForm.touched.meetingLink && interviewDetailsForm.errors.meetingLink) ? interviewDetailsForm.errors.meetingLink : ""}
                                        />
                                    </div>
                                    <div className="tw-w-full lg:tw-w-1/3 tw-px-1.5">
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
                                    <div className="tw-w-full lg:tw-w-1/3 tw-px-1.5">
                                        <TextIconInput
                                            iconPositionClassName="right"
                                            labelText="Password"
                                            inputType={(showPasswordState) ? "text" : "password"}
                                            autoComplete="new-password"
                                            name="passCode"
                                            placeHolder="New Password"
                                            onChange={interviewDetailsForm.handleChange}
                                            onBlur={interviewDetailsForm.handleBlur}
                                            value={interviewDetailsForm.values.passCode || ""}
                                            invalid={(interviewDetailsForm.touched.passCode && interviewDetailsForm.errors.passCode) ? true : false}
                                            error={(interviewDetailsForm.touched.passCode && interviewDetailsForm.errors.passCode) ? interviewDetailsForm.errors.passCode : ""}
                                        >
                                            <i
                                                data-id="showNewPwdIcon"
                                                onClick={showPasswordHndlr}
                                                className={classnames("tw-align-middle tw-text-gray-500", {
                                                    "ri-eye-fill": (showPasswordState),
                                                    "ri-eye-off-fill": !(showPasswordState)
                                                })}
                                            />
                                        </TextIconInput>
                                    </div>
                                </div>
                            </div>

                            <div className="tw-bg-white tw-rounded tw-shadow tw-mb-4">
                                <div className="tw-px-4 tw-py-3 tw-border-b">
                                    <span className="tw-text-lg tw-font-bold">Student List</span>
                                </div>
                                <div className="tw-p-0">
                                    <div className="tw-flex tw-flex-wrap">
                                        <div className="tw-w-1/2 tw-px-1.5">
                                            <div className="tw-relative tw-m-3 search-box">
                                                <TextInput
                                                    name="searchString"
                                                    value={search}
                                                    onChange={searchHandler}
                                                    formgroupClassName="tw-mb-0"
                                                    placeHolder="Search..."
                                                />
                                                <i className="ri-search-line search-icon"></i>
                                            </div>
                                        </div>
                                        {examStudentState?.some((element: any) => !element?.addExam && !element?.isEditAccess) && (
                                            <div className="tw-w-full tw-ml-3 tw-mb-3 tw-flex" style={{ color: "#f06548" }}>
                                                <div>Note :</div>
                                                <div className="tw-ml-2">
                                                    <InputCheckbox
                                                        name="stuent-disable"
                                                        isDisabled={true}
                                                        value={true}
                                                        onChange={undefined}
                                                        formgroupClassName="tw-mb-0"
                                                    />
                                                </div>
                                                <div>Application has already moved to the next evaluation process.</div>
                                            </div>
                                        )}
                                        <div className="tw-w-full">
                                            <TableContainer
                                                columns={addNewInterviewColumns}
                                                data={examStudentState}
                                                divClass="tw-overflow-x-auto"
                                                theadClass="tw-table-light tw-text-gray-500 tw-align-middle"
                                                onChangeInputHndlr={onChangeHandlerForStudent}
                                            />
                                        </div>
                                        <div className="tw-w-full tw-flex tw-mt-2 tw-justify-center">
                                            <InputCheckbox
                                                name="sendEmail"
                                                labelName="Email"
                                                formgroupClassName="tw-mr-2"
                                                value={interviewDetailsForm.values.sendEmail}
                                                onChange={interviewDetailsForm.handleChange}
                                            />
                                            <InputCheckbox
                                                name="sendSms"
                                                labelName="SMS"
                                                value={interviewDetailsForm.values.sendSms}
                                                onChange={interviewDetailsForm.handleChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="tw-w-full tw-flex tw-gap-2 tw-justify-end tw-mb-4">
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
                        <div className="tw-bg-white tw-rounded tw-shadow tw-mb-4">
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
                toggle={toggleScheduleExamModal}
                modalTitle="Schedule Interview"
                modalSize="md"
            // modalSize="lg"
            >
                <ScheduleExaminationModal
                    studentDetails={scheduleInterviewModalState.modalDetails}
                    toggle={toggleScheduleExamModal}
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
