import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import BreadCrumb from '../../../../../Components/Common/BreadCrumb'
import { DateInput, InputCheckbox, ModalContainerUpdated, SelectInput, TextInput } from '../../../../../Components/Common'
import { useFormik } from 'formik'

import { default as NewEditSvg } from "../../../../../assets/imagesdps/academics/NewEditSvg.svg?react";
import { classFiveAboveArr, computeSubmitButtonError, generateColumns, refDataHndler } from './helper'
import TableContainer from '../../../../../Components/Common/TableContainer'
import { useAppDispatch, useAppSelector } from '../../../../../hooks/storehook'
import { shallowEqual } from 'react-redux'
import { getInstAcademicYearAct } from '../../../../../store/mastersettings/instacademics/instacademicactions'
import { generateActionPayload } from '../../../../../utility/reduxutility'
import { getBranchClassAct, getBranchCurriculumAct, resetBrchClassAct, resetBrchCurriculumAct } from '../../../../../store/branchsettings/branchacademics/branchacademicsactions'
import * as Yup from "yup";
import { useHistory, useLocation } from 'react-router-dom'
import { editObsAndIntReportAct, getObsAndIntRepListWhiSaveAct, getObsIntSubAct, getObservationAndInterviewerReportByIdAct, resetObservationAndInterviewReportByIdAct, resetObservationAndInterviewerReportListWhileSavingAct, resetObservationInterviewSubjectsAct, saveObservationReportAct } from '../../../../../store/FrontDesk/Interview/interviewactions'
import { toast } from 'react-toastify'
import { Current_Date } from '../../../../../utility/dateutility'
import { IPaginationState } from '../../../../../Components/Common/Pagination';
import Button from '../../../../../Components/Common/Button';

const initialFilterState = {
    academicYearId: "",
    curriculumId: "",
    classId: "",
    interviewDate: "",
}

const AddObservationAndInterviewReport = () => {

    const dispatch = useAppDispatch()
    const history = useHistory()
    const location: any = useLocation()

    const [obsAndIntRepFilterState, setObsAndIntRepFilterState] = useState(initialFilterState);

    const [obsAndIntRepList, setObsAndIntRepList] = useState<any[]>([])
    const [obsAndIntRepData, setObsAndIntRepData] = useState<any[]>([])
    const [allStudentSelectedState, setAllStudentSelectedState] = useState(false);
    const [searchString, setSearchString] = useState("");
    const [isLowerClass, setIsLowerClass] = useState(false);
    const selectedData = useRef<any[]>([])
    const paginationRef = useRef({ pageNo: 0, pageSize: 10 })

    const [addObservationAndInterviewReportModal, setAddObservationAndInterviewReportModal] = useState({
            showModal: false,
            branchId: "",
            observationId: "",
    });

    const { currentBranchIdResp: branchId, showApiLoader, currentInstIdResp: instituteId, academicYearListResp, brchCurriculumResp, branchClassResp, observationAndInterviewerReportByIdResp, observationAndInterviewerReportListWhileSavingResp, interviewErrorResp, saveObservationReportResp, getObservationInterviewSubjectsResp, editObsAndIntReportResp } =
        useAppSelector(
            ({ appData, instAcademics, branchAcademics, globalData, interview }) => ({
                currentBranchIdResp: appData.currentBranchIdResp,
                currentInstIdResp: appData.currentInstIdResp,
                academicYearListResp: instAcademics.academicYearListResp,
                brchCurriculumResp: branchAcademics.brchCurriculumResp,
                branchClassResp: branchAcademics.branchClassResp,
                observationAndInterviewerReportByIdResp: interview.observationAndInterviewerReportByIdResp,
                interviewErrorResp: interview.interviewErrorResp,
                getObservationInterviewSubjectsResp: interview.getObservationInterviewSubjectsResp,
                saveObservationReportResp: interview.saveObservationReportResp,
                editObsAndIntReportResp: interview.editObsAndIntReportResp,
                observationAndInterviewerReportListWhileSavingResp: interview.observationAndInterviewerReportListWhileSavingResp,
                showApiLoader: globalData.showApiLoader,
            }),
            shallowEqual
        );

    const ObservationReportRef = useRef({
        prevInterviewErrorResp: interviewErrorResp,
        prevSaveObservationReportResp: saveObservationReportResp,
        prevEditObsAndIntReportResp: editObsAndIntReportResp,
    })
    useEffect(() => {
        const { prevInterviewErrorResp, prevSaveObservationReportResp, prevEditObsAndIntReportResp } = ObservationReportRef.current;

        if (interviewErrorResp && prevInterviewErrorResp !== interviewErrorResp) {
            const { details } = interviewErrorResp;
            toast.error(details)
        }
        if (saveObservationReportResp && prevSaveObservationReportResp !== saveObservationReportResp) {
            const { errorWarning } = saveObservationReportResp || {};
            if (!errorWarning) {
                toast.success('Observation Report Save Successfully')
            } else {
                toast.warning(errorWarning || "")
            }
            history.push('/admission-management');
            let yearId = academicYearListResp ? academicYearListResp?.data?.find((year: any) => year.isAdmissionDefault)?.academicYearId : ""
            setObsAndIntRepFilterState((prev) => ({ ...initialFilterState, academicYearId: yearId || "" }));
            dispatch(resetObservationAndInterviewerReportListWhileSavingAct(undefined))
            dispatch(resetObservationInterviewSubjectsAct(undefined))

        }
        if (editObsAndIntReportResp && prevEditObsAndIntReportResp !== editObsAndIntReportResp) {
            dispatch(resetObservationInterviewSubjectsAct(undefined))
            toast.success('Observation Report Edit Successfully')
            let yearId = academicYearListResp ? academicYearListResp?.data?.find((year: any) => year.isAdmissionDefault)?.academicYearId : ""
            setObsAndIntRepFilterState((prev) => ({ ...initialFilterState, academicYearId: yearId || "" }));
            dispatch(resetObservationAndInterviewerReportListWhileSavingAct(undefined))
            const updatedState = { ...location.state, obsId: null };
            history.push('/admission-management');
        }
        ObservationReportRef.current.prevInterviewErrorResp = interviewErrorResp;
        ObservationReportRef.current.prevSaveObservationReportResp = saveObservationReportResp;
        ObservationReportRef.current.prevEditObsAndIntReportResp = editObsAndIntReportResp;
    }, [interviewErrorResp, saveObservationReportResp, editObsAndIntReportResp])


    const toggleObservationAndInterviewReportModal = (id?: any) => {
        setAddObservationAndInterviewReportModal((prevState: any) => ({
            ...prevState,
            showModal: !prevState.showModal,
            observationId: id || '',
        }));
    };

    useEffect(() => {
        if (location?.state?.obsId) {
            dispatch(getObservationAndInterviewerReportByIdAct(generateActionPayload("get_obs_and_int_report_by_id", { id: location?.state?.obsId })));
        }
    }, [location])

    useEffect(() => {
        if (observationAndInterviewerReportByIdResp && location?.state?.obsId && branchClassResp) {
            const { admissionType, studentRegNo, academicYearId, classId, curriculumId, observationAndInterviewDetailsOtherDTOS, isAbsent, studentRegId, isReObservation, isRecommended, studentName, className, id, observationStatus, studentImageS3URL, reObservationReason } = observationAndInterviewerReportByIdResp || {};
            let newObj: any;
            newObj = {
                status: observationStatus, reObservationReason, studentImageS3URL, className, admissionType, academicYearId, curriculumId, classId, branchId, instituteId, isAbsent: observationStatus?.toLowerCase() === "absent" ? true : false, isReObservation: observationStatus?.toLowerCase() === "reobservation" ? true : false, isRecommended: observationStatus?.toLowerCase() === "recommended" ? true : false, studentName, registrationNo: studentRegNo, studentRegId, id,
                isSelected: true, observationAndInterviewDetailsOtherDTOS, interviewSubjectDTOS: observationAndInterviewerReportByIdResp?.observationAndReportDetailsDTOS?.map((item: any) => {
                    return {
                        subjectId: item?.subjectId,
                        status: item?.status,
                        otherRemarks: item?.otherRemarks,
                    }
                })
            }
            setAllStudentSelectedState(true)
            selectedData.current = [newObj]
            setObsAndIntRepList([newObj])
            setObsAndIntRepData([newObj])
        }
    }, [observationAndInterviewerReportByIdResp, branchClassResp])

    useEffect(() => {
        if (Array.isArray(observationAndInterviewerReportListWhileSavingResp?.content) && observationAndInterviewerReportListWhileSavingResp?.content?.length > 0) {
            const previousData = [...selectedData.current]
            let newList = observationAndInterviewerReportListWhileSavingResp?.content?.map((item: any) => {
                const baseItem = {
                    ...item,
                    isAbsent: false,
                    status: "",
                    isSelected: false,
                };
                const findIndex = previousData?.findIndex((prev:any)=>+prev?.id === +item?.id)
                if(Array.isArray(getObservationInterviewSubjectsResp) && getObservationInterviewSubjectsResp.length === 0){
                    toast.warning("No Subject added for this class kindly add through Settings --> Exam Subjects")
                }
                if (findIndex < 0) {
                    if (checkLowerClass(obsAndIntRepFilterState.classId) && getObservationInterviewSubjectsResp?.length > 0) {
                        return {
                            ...baseItem,
                            siblingVerification: item?.siblingVerification === "YES" ? true : false,
                            isSelected: item?.siblingVerification === "YES" ? true : false,
                            interviewSubjectDTOS: getObservationInterviewSubjectsResp?.map((subjectItem: any) => ({
                                subjectId: subjectItem?.subjectId,
                                status: "",
                                otherRemarks: "",
                            })),
                        };
                    }

                    return {
                        ...baseItem,
                        siblingVerification: item?.siblingVerification === "YES" ? true : false,
                        isSelected: item?.siblingVerification === "YES" ? true : false,
                    };
                } else {
                    return previousData[findIndex]
                }
            });

            setObsAndIntRepList(newList);
            setObsAndIntRepData(newList);
        }
    }, [observationAndInterviewerReportListWhileSavingResp, getObservationInterviewSubjectsResp]);

    const getObsAndIntRepListWhiSave = (values: any) => {
        dispatch(getObsAndIntRepListWhiSaveAct(generateActionPayload("get_obs_and_int_rep_list_while_save", undefined, { ...values,...paginationRef.current, branchId })));
    }

    const validationSchema = Yup.object().shape({
        academicYearId: Yup.string().required("Academic Year is required."),
        curriculumId: Yup.string().required("Curriculum is required."),
        classId: Yup.string().required("Class is required."),
        // interviewDate: Yup.string().required("Interview Date is required."),
    });

    const filterForm = useFormik({
        initialValues: obsAndIntRepFilterState,
        enableReinitialize: true,
        validationSchema,
        onSubmit: (value: any) => {
            if (isLowerClass) {
                const payload = { branchId, academicYearId: value?.academicYearId, curriculumId: value?.curriculumId, classId: value?.classId }
                dispatch(getObsIntSubAct(generateActionPayload("get_observation_interview_subjects", undefined, payload)));
            } else {
                dispatch(resetObservationInterviewSubjectsAct(undefined))
            }
            getObsAndIntRepListWhiSave(value)
            selectedData.current = []
        }
    })
    const AddObservationAndInterviewForm = useFormik({
        initialValues: obsAndIntRepList,
        enableReinitialize: true,
        onSubmit: () => {

            let payload = {
                academicYearId: filterForm?.values?.academicYearId,
                curriculumId: filterForm?.values?.curriculumId,
                classId: filterForm?.values?.classId,
                isSMS: false,
                isEmail: false,
                branchId, instituteId,
                interviewReportDTOS: refDataHndler(obsAndIntRepData,[...selectedData.current])?.filter((f: any) => {
                    if (f?.isSelected && !f?.siblingVerification) { return true }
                    // if (f.observationAndInterviewDetailsOtherDTOS?.length) { return true }
                    // else if (!(f?.status === "")) { return true }
                }).map((i: any) => {
                    if (i?.interviewSubjectDTOS?.length) {
                        if (i?.observationAndInterviewDetailsOtherDTOS?.length) {
                            return { ...i?.observationAndInterviewDetailsOtherDTOS[0], studentRegId: i?.studentRegId, isAbsent: i?.isAbsent, status: i?.status, interviewSubjectDTOS: i?.interviewSubjectDTOS, isRecommended: i?.isRecommended, isReObservation: i?.isReObservation, reObservationReason: i?.reObservationReason }
                        } else {
                            return { studentRegId: i?.studentRegId, isAbsent: i?.isAbsent, status: i?.status, interviewSubjectDTOS: i?.interviewSubjectDTOS, isRecommended: i?.isRecommended, isReObservation: i?.isReObservation, reObservationReason: i?.reObservationReason }
                        }
                    } else {
                        if (i?.observationAndInterviewDetailsOtherDTOS?.length) {
                            return { ...i?.observationAndInterviewDetailsOtherDTOS[0], studentRegId: i?.studentRegId, isAbsent: i?.isAbsent, isRecommended: i?.isRecommended, isReObservation: i?.isReObservation, status: i?.status, reObservationReason: i?.reObservationReason, interviewSubjectDTOS: [] }
                        } else {
                            return { studentRegId: i?.studentRegId, isAbsent: i?.isAbsent, isRecommended: i?.isRecommended, isReObservation: i?.isReObservation, status: i?.status, reObservationReason: i?.reObservationReason, interviewSubjectDTOS: [] }
                        }
                    }
                })
            }

            payload?.interviewReportDTOS?.forEach((item: any) => {
                if (item?.interviewSubjectDTOS?.length) {
                    delete item?.studentAcademics;
                    delete item?.studentAcademicsRemarks;
                    delete item?.studentAttitude;
                    delete item?.studentAttitudeRemarks;
                    delete item?.studentCommunication;
                    delete item?.studentCommunicationRemarks;

                    const isAllStatusEmpty = item?.interviewSubjectDTOS?.every((obj: any) => obj?.status === '');
                    if (isAllStatusEmpty) {
                        item.interviewSubjectDTOS = []
                    }
                }
                if (item?.isAbsent) {
                    delete item?.interviewSubjectDTOS
                }
                if (item?.isReObservation) {
                    for (const field in item) {
                        if (classFiveAboveArr.includes(field) && (item[field] === "" || item[field] === null || item[field] === undefined)) {
                            item[field] = null;
                        }
                    }
                }
                if (item && (item?.reObservationReason === "" || item?.reObservationReason === undefined)) {
                    item.reObservationReason = null
                }
            })

            if (location?.state?.obsId) {
                dispatch(editObsAndIntReportAct(generateActionPayload("edit_obs_and_int_report", { id: location?.state.obsId }, payload)));
            } else {
                if (payload?.interviewReportDTOS?.length > 0) {
                    dispatch(saveObservationReportAct(generateActionPayload("save_observation_report", undefined, payload)));
                }
                else {
                    toast.error("Please Change in at least one student")
                }
            }
        }
    })
    const menuOptions = useMemo(
        () => [
            {
                id: "edit",
                actionIcon: <NewEditSvg className="d-inline-block me-2" fill='#878A99' />,
                actionName: "Update Result",
                onClickHndlr: (event: any) => {
                    let id = event.currentTarget.getAttribute('data-id');
                    toggleObservationAndInterviewReportModal(id)
                },
            },
        ],
        []
    );


    const changeStatusHandler = (id: any, event: any) => {
        let updatedData: any;
        if (event.target.value === "Absent") {
            updatedData = obsAndIntRepList?.map((item: any) =>
                +item.id === +id ? {
                    ...item, observationAndInterviewDetailsOtherDTOS: [], interviewSubjectDTOS
                        : item?.interviewSubjectDTOS?.map((i: any) => ({ ...i, status: "", otherRemarks: "" })), status: event.target.value, isAbsent: true, isRecommended: false, isReObservation: false, reObservationReason: "",
                } : item
            );
        } else {
            updatedData = obsAndIntRepList?.map((item: any) =>
                +item.id === +id ? { ...item, status: event.target.value, isAbsent: false, isReObservation: event.target.value === "ReObservation" ? true : false, isRecommended: event.target.value === "Recommended" ? true : false, reObservationReason: event.target.value === "ReObservation" ? item?.reObservationReason : "" } : item
            );
        }
        setObsAndIntRepList(updatedData);
        setObsAndIntRepData(updatedData);
    }

    const reportChangeHandler = (values: any) => {

        if (values?.interviewSubjectDTOS?.length > 0) {
            const updatedData: any = obsAndIntRepList?.map((item: any) => {
                return (+item.id === +addObservationAndInterviewReportModal?.observationId) ? { ...item, observationAndInterviewDetailsOtherDTOS: [{ ...values }], interviewSubjectDTOS: values?.interviewSubjectDTOS } : item
            }
            );
            setObsAndIntRepList(updatedData);
            setObsAndIntRepData(updatedData);
        } else {
            const updatedData: any = obsAndIntRepList.map((item: any) => {
                return (+item.id === +addObservationAndInterviewReportModal?.observationId) ? { ...item, observationAndInterviewDetailsOtherDTOS: [values] } : item
            }
            );
            setObsAndIntRepList(updatedData);
            setObsAndIntRepData(updatedData);
        }

    }

    useEffect(() => {

        return () => {
            dispatch(resetBrchCurriculumAct(undefined));
            dispatch(resetBrchClassAct(undefined));
            dispatch(resetObservationAndInterviewerReportListWhileSavingAct(undefined))
            dispatch(resetObservationInterviewSubjectsAct(undefined))
            dispatch(resetObservationAndInterviewReportByIdAct(undefined))
        }
    }, []);

    useEffect(() => {
        const { data } = academicYearListResp || {};
        if (Array.isArray(data) && data.length > 0) {
            if (!location?.state?.obsId) {
                let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.isAdmissionDefault)?.academicYearId
                setObsAndIntRepFilterState((prev: any) => ({ ...prev, academicYearId: yearId }))
                getCurriculumApiCall({ academicYearId: yearId })
            }
        }
    }, [academicYearListResp]);

    useEffect(() => {
        const { content } = branchClassResp || {};
        if (Array.isArray(content) && content.length > 0 && !location?.state?.obsId) {
            setObsAndIntRepFilterState((prev: any) => ({ ...prev, classId: content[0].branchCurriculumId }))
        } else if (location?.state?.obsId && observationAndInterviewerReportByIdResp) {

            const { academicYearId, curriculumId, classId, interviewDate }: any = observationAndInterviewerReportByIdResp || {}
            const check = checkLowerClass(classId)

            if (check) {
                const payload = { branchId, academicYearId, curriculumId, classId }
                dispatch(getObsIntSubAct(generateActionPayload("get_observation_interview_subjects", undefined, payload)));
            }

            setObsAndIntRepFilterState((prev: any) => ({
                ...prev,
                academicYearId, curriculumId, classId, interviewDate: interviewDate?.slice(0, 10)
            }))
        }
    }, [branchClassResp]);

    useEffect(() => {
        if (observationAndInterviewerReportByIdResp && academicYearListResp && location?.state?.obsId) {

            const { academicYearId, curriculumId, classId }: any = observationAndInterviewerReportByIdResp || {}
            getCurriculumApiCall({ academicYearId })

            const payload = { branchId: branchId,academicYearId, curriculumId, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100 };
            dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
        }
    }, [observationAndInterviewerReportByIdResp, academicYearListResp])


    const checkLowerClass = (currentClassId: any) => {

        let className: any;
        if (currentClassId) {
            branchClassResp?.content?.map((item: any) => {
                if (+item?.id === +currentClassId) {
                    className = item?.shortName
                }
            })

            switch (className) {
                case "PREP":
                case "I":
                case "II":
                case "III":
                case "IV":
                case "PN":
                case "NUR":
                case "EY-1(NUR)":
                case "EY-2(PP1/LKG)":
                case "EY-3(PP2/UKG)":
                    setIsLowerClass(true)
                    return true;
                default:
                    setIsLowerClass(false)
                    return false;
            }
        }
    }
    const changeReportHndler = (event: any, name: any, id: any, subjectId?: any, subjectStatusName?: any) => {
        let updatedData;

        if (name === "reasonChange") {
            updatedData = obsAndIntRepList?.map((item: any) =>
                +item.id === +id ? { ...item, reObservationReason: event.target.value } : item
            );
        } else if (name === "subjectChange") {
            // when subjects resp are there and class is below 5.
            updatedData = obsAndIntRepList?.map((item: any) => {
                let updatedSubjects;
                if (+item?.id === +id) {
                    if (item?.interviewSubjectDTOS?.length) {
                        updatedSubjects = item?.interviewSubjectDTOS?.map((i: any) => {
                            if (+i?.subjectId === +subjectId) {
                                if (subjectStatusName === "status" && !(event.target.value === "OTHER")) {
                                    // This is for doing otherRemarks empty 
                                    return { ...i, [subjectStatusName]: event.target.value, otherRemarks: "" }
                                }
                                return { ...i, [subjectStatusName]: event.target.value }
                            } else {
                                return i
                            }
                        })
                    } else {
                        //create new
                        updatedSubjects = getObservationInterviewSubjectsResp?.map((i: any) => {
                            if (+i?.subjectId === +subjectId) {
                                return { status: "", otherRemarks: "", subjectId: i?.subjectId, [subjectStatusName]: event.target.value }
                            } else {
                                return i
                            }
                        })
                    }
                    return { ...item, interviewSubjectDTOS: updatedSubjects }
                } else {
                    return { ...item }
                }
            })
        }
        else {
            // when subjects resp are not there and class is above 5
            updatedData = obsAndIntRepList?.map((item: any) => {
                if (+item?.id === +id) {
                    let updatedObservation;
                    if (item?.observationAndInterviewDetailsOtherDTOS?.length) {
                        updatedObservation =
                            item?.observationAndInterviewDetailsOtherDTOS?.map((observationItem: any) => {
                                if (!(name?.toLowerCase()?.includes("remarks")) && !(event.target.value === "OTHER")) {
                                    const remarksKey = name + "Remarks";
                                    return {
                                        ...observationItem,
                                        [name]: event.target.value,
                                        [remarksKey]: "",
                                    };
                                }
                                return {
                                    ...observationItem,
                                    [name]: event.target.value,
                                };
                            })
                    }
                    else {
                        updatedObservation = [{
                            [name]: event.target.value,
                        }]
                    }
                    return {
                        ...item,
                        observationAndInterviewDetailsOtherDTOS: updatedObservation,
                    };
                }
                return item;
            });
        }

        setObsAndIntRepData(updatedData);
        setObsAndIntRepList(updatedData);
    };

    const allStudentCheckHndlr = useCallback((event: any) => {
        const { checked } = event.target;
        setAllStudentSelectedState(checked);
        let updateStudentState = [...obsAndIntRepList];
        updateStudentState.forEach(item => {
            if (!item?.siblingVerification) {
                item.isSelected = checked;
            }
        });
        setObsAndIntRepList(updateStudentState);
        setObsAndIntRepData(updateStudentState);
    }, [obsAndIntRepList]);

    const singleStudentCheckHndlr = useCallback((event: any) => {
        const { checked } = event.currentTarget,
            registrationNumber = event.currentTarget.getAttribute("data-id"),
            studentRowIndex = obsAndIntRepList.findIndex((item: any) => item.studentRegId === Number(registrationNumber));
        if (studentRowIndex > -1) {
            const studentDetails: any = obsAndIntRepList[studentRowIndex];
            let updateStudentState = [...obsAndIntRepList];
            updateStudentState.splice(studentRowIndex, 1, {
                ...studentDetails, isSelected: checked,
            });

            setObsAndIntRepList(updateStudentState);
            setObsAndIntRepData(updateStudentState);
            const isAllSelected = updateStudentState.every((item: any) => item.isSelected);
            setAllStudentSelectedState(isAllSelected);
        }
    }, [obsAndIntRepList]);

    const roleColumns = useMemo(() => {
        const newColumns = generateColumns(menuOptions, toggleObservationAndInterviewReportModal, changeStatusHandler, getObservationInterviewSubjectsResp, reportChangeHandler, allStudentSelectedState, allStudentCheckHndlr, singleStudentCheckHndlr)
        return newColumns?.filter((item: any) => {
            if (item?.Header === "Student Interviewer Report") {
                if (!getObservationInterviewSubjectsResp) return item
            } else {
                return item
            }
        })
    }, [obsAndIntRepList, getObservationInterviewSubjectsResp]);

    function paginationHndlr(paginationInfo: IPaginationState) {
        paginationRef.current = paginationInfo;
        getObsAndIntRepListWhiSave({ ...obsAndIntRepFilterState, ...paginationInfo })
        const newList = refDataHndler(obsAndIntRepData,[...selectedData.current])
        setAllStudentSelectedState(false)
        selectedData.current = [...newList]
    }

    const getCurriculumApiCall = (otherProps?: any) => {
        const payload1 = { academicYearId: filterForm.values.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" , ...otherProps };
        dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
      }

    const handleChange = (event: any) => {
        const { name, value } = event.target;
        if (name === 'curriculumId') {
            if (!value) {
                dispatch(resetBrchClassAct(undefined));
            }
            else {
                const payload = { branchId: branchId,academicYearId : filterForm.values.academicYearId, curriculumId: value, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100 };
                dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
            }
            setObsAndIntRepFilterState((prev: any) => ({ ...prev, [name]: value , classId :"" }));
        } else if (name === "classId") {
            checkLowerClass(value)
            setObsAndIntRepFilterState((prev: any) => ({ ...prev, [name]: value }));
        }
        else if (name === "academicYearId") {
            getCurriculumApiCall({ academicYearId: value });
            dispatch(resetBrchClassAct(undefined));
            setObsAndIntRepFilterState((prev: any) => ({ ...prev, [name]: value , curriculumId : "" , classId : "" }));
        }else{
            setObsAndIntRepFilterState((prev: any) => ({ ...prev, [name]: value }));
        }
    }

    function searchByRegNumberOrName(searchTerm: any) {
        const searchTermLowerCase = searchTerm.toLowerCase();

        const filteredData = obsAndIntRepData?.filter((item: any) => {
            const regNo = item.registrationNo.toLowerCase();
            const studentName = item.studentName.toLowerCase();

            return regNo.includes(searchTermLowerCase) || studentName.includes(searchTermLowerCase);
        });
        setObsAndIntRepList(filteredData)
    }
    const submitButtonError = useMemo(() => computeSubmitButtonError(obsAndIntRepList, getObservationInterviewSubjectsResp), [obsAndIntRepList, getObservationInterviewSubjectsResp]);

    const { totalElements, totalPages, pageable } = observationAndInterviewerReportListWhileSavingResp || {};
    const { data: academicYearList } = academicYearListResp || {};
    const { data: curriculumTypes } = brchCurriculumResp || {};
    const { content: classTypes } = branchClassResp || {};

    return (

        <>

            <div className="page-content new_fee_receipt_page_warp">
                <div className="container-fluid">
                    <BreadCrumb pageTitle="Admissions" />
                    {/* <BackButtonText title="<< Back to Observation And Interview Report List" link={'/admission-management'} /> */}

                    <div className="tw-bg-white tw-shadow tw-rounded">
                        <form onSubmit={filterForm.handleSubmit}>
                            <div className="tw-py-4 tw-px-6 tw-border-b">
                                <div className="tw-grid tw-grid-cols-12 tw-gap-3">
                                    <div className="tw-col-span-12 lg:tw-col-span-2">
                                        <SelectInput
                                            name="academicYearId"
                                            labelText="Academic Year"
                                            value={obsAndIntRepFilterState?.academicYearId}
                                            onChange={handleChange}
                                            onBlur={filterForm.handleBlur}
                                            menuItems={academicYearList || []}
                                            valueKey="academicYearId"
                                            textKey="academicYearName"
                                            labelClass='required'
                                            isDisabled={location?.state?.obsId && true}
                                            invalid={(filterForm.touched.academicYearId && filterForm.errors.academicYearId) ? true : false}
                                            error={(filterForm.touched.academicYearId && filterForm.errors.academicYearId) ? filterForm.errors.academicYearId : ""}
                                        // isDisabled={examScheduleId}
                                        />
                                    </div>

                                    <div className="tw-col-span-12 lg:tw-col-span-2">
                                        <SelectInput
                                            name="curriculumId"
                                            labelText="Curriculum"
                                            value={obsAndIntRepFilterState?.curriculumId}
                                            onChange={handleChange}
                                            onBlur={filterForm.handleBlur}
                                            menuItems={curriculumTypes || []}
                                            valueKey="branchCurriculumId"
                                            textKey="curriculumName"
                                            labelClass='required'
                                            isDisabled={location?.state?.obsId && true}
                                            invalid={(filterForm.touched.curriculumId && filterForm.errors.curriculumId) ? true : false}
                                            error={(filterForm.touched.curriculumId && filterForm.errors.curriculumId) ? filterForm.errors.curriculumId : ""}
                                        // isDisabled={examScheduleId}
                                        />
                                    </div>

                                    <div className="tw-col-span-12 lg:tw-col-span-2">
                                        <SelectInput
                                            name="classId"
                                            labelText="Class"
                                            value={obsAndIntRepFilterState?.classId}
                                            onChange={handleChange}
                                            onBlur={filterForm.handleBlur}
                                            menuItems={classTypes || []}
                                            valueKey="id"
                                            textKey="shortName"
                                            labelClass='required'
                                            isDisabled={location?.state?.obsId && true}
                                            invalid={(filterForm.touched.classId && filterForm.errors.classId) ? true : false}
                                            error={(filterForm.touched.classId && filterForm.errors.classId) ? filterForm.errors.classId : ""}
                                        // isDisabled={examScheduleId}
                                        />
                                    </div>

                                    <div className="tw-col-span-12 lg:tw-col-span-2">
                                        <DateInput
                                            name="interviewDate"
                                            value={obsAndIntRepFilterState?.interviewDate}
                                            onChange={handleChange}
                                            onBlur={filterForm.handleBlur}
                                            labelText="Interview Date"
                                            // placeHolder="dd-mm-yyyy"
                                            isDisabled={location?.state?.obsId && true}
                                            invalid={filterForm.touched.interviewDate &&
                                                filterForm.errors.interviewDate
                                                ? true
                                                : false}
                                            error={filterForm.touched.interviewDate &&
                                                filterForm.errors.interviewDate
                                                ? filterForm.errors.interviewDate
                                                : ""}
                                            maxDate={Current_Date}
                                        />
                                    </div>

                                    <div className="tw-col-span-12 lg:tw-col-span-3 tw-flex tw-justify-center tw-items-end tw-mb-3">
                                        <Button
                                            type="button"
                                            variant='soft'
                                            onClick={() => { filterForm.handleSubmit(); setSearchString(""); }}
                                            disabled={location?.state?.obsId}
                                        >
                                            Show Details
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {!location?.state?.obsId && (
                                <div className="tw-p-6">
                                    <div className="tw-grid tw-grid-cols-12 tw-gap-3">
                                        <div className="tw-col-span-12 lg:tw-col-span-5">
                                            <div className="tw-relative tw-w-full">
                                                <TextInput
                                                    name="searchString"
                                                    value={searchString}
                                                    isDisabled={location?.state?.obsId}
                                                    onChange={(event) => { searchByRegNumberOrName(event.target.value); setSearchString(event.target.value); }}
                                                    formgroupClassName="tw-mb-0"
                                                    placeHolder="Search Student by registration no or name ..."
                                                />
                                                <i className="ri-search-line tw-absolute tw-right-3 tw-top-1/2 tw--translate-y-1/2 tw-text-gray-400"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </form>

                        {obsAndIntRepList?.some((el) => el?.siblingVerification) && (
                            <div className="tw-col-span-12 tw-ms-3 tw-mb-3 tw-flex tw-text-red-500 tw-items-center">
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
                                <div>Student add is not allowed because sibling verification is pending.</div>
                            </div>
                        )}

                        <TableContainer
                            columns={roleColumns || []}
                            data={Array.isArray(obsAndIntRepList) ? obsAndIntRepList : []}
                            divClass="tw-overflow-x-auto tw-mb-3"
                            theadClass="tw-bg-gray-100 tw-text-gray-600 tw-align-middle"
                            onChangeInputHndlr={changeReportHndler}
                            showPagination={true}
                            totalPages={totalPages}
                            totalRecords={totalElements}
                            callbackPaginationHndlr={paginationHndlr}
                            currentPageNumber={pageable?.pageNumber || 0}
                        />

                        <div className="tw-flex tw-justify-end tw-mb-3">
                            <Button
                                type="submit"
                                onClick={() => AddObservationAndInterviewForm.handleSubmit()}
                                variant='primary'
                                disabled={submitButtonError === undefined || submitButtonError || showApiLoader}
                            >
                                Submit
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            {/* 
            <ModalContainerUpdated
          id="obs-int-rep-modal"
          isOpen={addObservationAndInterviewReportModal.showModal}
          toggle={toggleObservationAndInterviewReportModal}
          modalSize="lg"
          >
            <AddObservationAndInterviewReportModal
                isOpen={addObservationAndInterviewReportModal.showModal}
                observationId={addObservationAndInterviewReportModal.observationId}
                reportChangeHandler={reportChangeHandler}
                toggle={toggleObservationAndInterviewReportModal}
                modalTitle="Observation and Interviewer Report"
                instituteId={instituteId}
                observationAndInterviewReportList={obsAndIntRepList}
                instituteName={"Observation and Interviewer Report"}
                branchId={addObservationAndInterviewReportModal.branchId}
                editBranchDetails={""}
                />
                </ModalContainerUpdated> */}
        </>
    )
}

export default AddObservationAndInterviewReport
