import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ModalContainerUpdated, SelectInput, TableExpandable } from '../../../../Components/Common'
import { useFormik } from 'formik';
import { useAppDispatch, useAppSelector } from '../../../../hooks/storehook';
import { shallowEqual } from 'react-redux';
import { generateActionPayload } from '../../../../utility/reduxutility';
import { resetAssignedClassSubjectsListAct } from '../../../../store/academic/classSubjects/classsubjectsactions';
import { getBranchClassAct, getBranchCurriculumAct, resetBrchClassAct } from '../../../../store/branchsettings/branchacademics/branchacademicsactions';
import { getSectionList } from '../../../../store/academic/classroomManagment/classroommanagmentactions';
import * as Yup from "yup";
import { toast } from 'react-toastify';
import { HugeiconsIcon } from '@hugeicons/react';
import { Search01Icon } from '@hugeicons-pro/core-stroke-standard';
import { getIgseTermNameListAct } from '../../../../store/examination/examinationsettings/examinationsettingsaction';
import { setIgseTermDetailsListAct } from '../../../../store/examination/examinationsettings/examinationsettingsslice';
import { useLocation } from 'react-router-dom';
import { generateColumns } from './helper';
import { getPvaGradeEntrySubjectAct, getPvaStudentGradeEntryListAct, getPvaSubjectsAct, getPvaSubjectsClassesMappingAct, resetPvaSkillAreaAct, resetPvaStudentGradeEntryListAct, resetPvaSubjectAct, resetPvaSubjecttoClassMappingAct, savePvaGradeEntryListAct } from '../../../../store/examination/pvaReports/pvaReportsActions';
import { useModal } from '../../../../hooks/modalhook';
import SchoolCompetitionModal from './SchoolCompetitionModal';
import StateCompetitionModal from './StateCompetitionModal';

const initialValues = {
    academicYearId: "",
    curriculumId: "",
    classId: "",
    termId: "",
    pvaSubjectId: "",
    sectionId: "",
};

const validationSchema = Yup.object().shape({
    academicYearId: Yup.string().required("Academic Year is required"),
    curriculumId: Yup.string().required("Curriculum is required"),
    classId: Yup.string().required("Class is required"),
    termId: Yup.string().required("Term is required"),
    pvaSubjectId: Yup.string().required("Subject is required"),
    sectionId: Yup.string().required("Section is required"),
});
interface StudentData {
    studentId: number;
    studentCode: string;
    studentName?: string;
    studentImageBase64?: string;
    [key: string]: any;
}

const PvaGradeEntry = () => {

    const dispatch = useAppDispatch();
    const [studentData, setStudentData] = useState<StudentData[]>([]);
    const [allStudentSelectedState, setAllStudentSelectedState] = useState(false);
    const classApiCalled = useRef(false);
    const location = useLocation();
    const isEy = location.pathname.includes("/early-years-management");
    const isIgcse = location.pathname.includes("/igcse-management");
    const [objectivesData, setObjectivesData] = useState<any[]>([]);
    const { openModal: schoolCompetitionOpenModal, closeModal: schoolCompetitionCloseModal, modalState: schoolCompetitionModalState } = useModal();
    const {openModal: stateCompetitionOpenModal, closeModal: stateCompetitionCloseModal, modalState: stateCompetitionModalState} = useModal();
    
    const pvaGradeEntryForm = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values) => {
            pvaGradeEntryStudentListApiCall(values);
            getPvaSubjecttoClassMappingListApiCall(values);
        },
    });

    const {
        academicYearListResp,
        brchCurriculumResp,
        branchClassResp,
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        showApiLoader,
        sectionListResp,
        getPvaSubjectResp,
        getIgseTermNameListResp,
        getPvaSubjecttoClassMappingResp,
        getPvaStudentGradeEntryListResp,
        savePvaStudentGradeEntryListResp,
        pvaReportsErrorAct,
        loggedInUserRole,
        getPvaGradeEntrySubjectResp
    } = useAppSelector(
        ({ globalData, instAcademics, branchAcademics, appData, classroomManagmentInfo, examinationSettings, examinationManagement, applicationSale, pvaReports }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            branchClassResp: branchAcademics.branchClassResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            showApiLoader: globalData.showApiLoader,
            sectionListResp: classroomManagmentInfo.sectionListResp,
            getIgseTermNameListResp: examinationSettings.getIgseTermNameListResp,
            getPvaSubjectResp: pvaReports.getPvaSubjectResp,
            getPvaSubjecttoClassMappingResp: pvaReports.getPvaSubjecttoClassMappingResp,
            getPvaStudentGradeEntryListResp: pvaReports.getPvaStudentGradeEntryListResp,
            savePvaStudentGradeEntryListResp: pvaReports.savePvaStudentGradeEntryListResp,
            pvaReportsErrorAct: pvaReports.pvaReportsErrorAct,
            loggedInUserRole: appData.loggedInUserRole,
            getPvaGradeEntrySubjectResp: pvaReports.getPvaGradeEntrySubjectResp
        }),
        shallowEqual
    );
    const pvsGradeEntryRef = useRef({
        prevSavePvaStudentGradeEntryListResp: savePvaStudentGradeEntryListResp,
        prevPvaReportsErrorAct: pvaReportsErrorAct,
    });

    useEffect(() => {
        const { prevSavePvaStudentGradeEntryListResp, prevPvaReportsErrorAct } = pvsGradeEntryRef.current;
        if (savePvaStudentGradeEntryListResp && prevSavePvaStudentGradeEntryListResp !== savePvaStudentGradeEntryListResp) {
            toast.success("Pva grade entry saved successfully");
            pvaGradeEntryStudentListApiCall()
        }
        else if (pvaReportsErrorAct && prevPvaReportsErrorAct !== pvaReportsErrorAct) {
            const { details } = pvaReportsErrorAct;
            toast.error(details || "Something went wrong");
            dispatch(resetPvaStudentGradeEntryListAct(undefined));
            dispatch(resetPvaSubjectAct(undefined));
            setStudentData([])
        }

        pvsGradeEntryRef.current.prevSavePvaStudentGradeEntryListResp = savePvaStudentGradeEntryListResp
        pvsGradeEntryRef.current.prevPvaReportsErrorAct = pvaReportsErrorAct
    }, [savePvaStudentGradeEntryListResp, pvaReportsErrorAct])

    useEffect(() => {
        const responseData = Array.isArray(getPvaSubjecttoClassMappingResp?.content)
            ? getPvaSubjecttoClassMappingResp.content
            : [];
        if (responseData.length > 0) {
            const allSkillAreas = responseData.flatMap((subject: any) =>
                subject.skillAreas.map((skill: any) => ({
                    id: `${skill.skillAreaId}_${subject.classId}_${subject.pvaSubjectId}`,
                    skillAreaId: skill.skillAreaId,
                    classId: subject.classId,
                    subjectId: subject.pvaSubjectId,
                    title: skill.skillAreaName,
                }))
            );
            setObjectivesData(allSkillAreas);
        }
        else {
            setObjectivesData([]);
        }
    }, [getPvaSubjecttoClassMappingResp]);

    useEffect(() => {
        if (Array.isArray(getPvaStudentGradeEntryListResp) && getPvaStudentGradeEntryListResp.length > 0) {
            const modifiedData = getPvaStudentGradeEntryListResp.map((student: any) => {
                const skillValues: Record<string, number> = Object.fromEntries(
                    (objectivesData || []).map((obj) => [`objective_${obj.id}`, 0])
                );
                if (Array.isArray(student.skillAreaIds)) {
                    student.skillAreaIds.forEach((skill: any) => {
                        const match = (objectivesData || []).find(
                            (obj) => obj.skillAreaId === skill.skillAreaId
                        );
                        if (match) {
                            skillValues[`objective_${match.id}`] = skill.gradeRating || 0;
                        }
                    });
                }
                return {
                    ...student,
                    studentName: student.studentName || "-",
                    studentImageBase64: student.studentImageBase64 || "",
                    isSelected: false,
                    ...skillValues,
                };
            });
 
            setStudentData(modifiedData);
        }
    }, [getPvaStudentGradeEntryListResp, objectivesData]);

    useEffect(() => {
        const yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId
        pvaGradeEntryForm.setFieldValue("academicYearId", yearId)
        getCurriculumApiCall({ academicYearId: yearId });
    }, [academicYearListResp]);

    useEffect(() => {
        const { data } = brchCurriculumResp || {};
        const curriculumMapping: Record<string, string> = {
            "/early-years-management": "EY1-EY3",
            "/cbse-pva-management": "CBSE",
            "/igcse-management": "IGCSE",
        };
        const selectedCurriculumName = curriculumMapping[location.pathname];
        if (Array.isArray(data) && data.length > 0 && pvaGradeEntryForm.values.academicYearId && !classApiCalled.current) {
            const selectedCurriculum = data.find(
                (item) => item.shortName === selectedCurriculumName
            );
            if (!selectedCurriculum) {
                dispatch(resetAssignedClassSubjectsListAct(undefined));
                dispatch(resetBrchClassAct(undefined));
                pvaGradeEntryForm.setFieldValue("curriculumId", "")
                pvaGradeEntryForm.setFieldValue("pvaSubjectId", "")
                return;
            }
            pvaGradeEntryForm.setFieldValue("curriculumId", selectedCurriculum.branchCurriculumId);

            const payload: any = {
                branchId,
                curriculumId: selectedCurriculum.branchCurriculumId,
                academicYearId: pvaGradeEntryForm.values.academicYearId,
                sortBy: "classSequence",
                orderBy: "asc",
                pageNo: 0,
                pageSize: 100,
            };
            if(loggedInUserRole === "TEACHER"){
                payload.progressCardType = "PVA";
            }
            dispatch(
                getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload))
            );
            dispatch(getIgseTermNameListAct(generateActionPayload("get_igse_term_name_list", undefined, { branchId, curriculumId: selectedCurriculum.branchCurriculumId })));
            pvaGradeEntryForm.setValues((prev: any) => ({
                ...prev,
                curriculumId: selectedCurriculum.branchCurriculumId,
            }));
            classApiCalled.current = true;
        }
    }, [brchCurriculumResp, pvaGradeEntryForm.values.academicYearId]);

    useEffect(() => {
        const { content } = branchClassResp || {};
        if (Array.isArray(content) && content.length > 0) {
            pvaGradeEntryForm.setFieldValue("classId", content[0].id);
            // getSubjectList({ curriculumId: pvaGradeEntryForm.values.curriculumId, academicYearId: pvaGradeEntryForm.values.academicYearId, classId: content[0].id });
            getSectionListResp({ branchClassId: content[0]?.id });
        }
    }, [branchClassResp])

    useEffect(() => {
        return () => {
            dispatch(resetBrchClassAct(undefined));
            dispatch(resetPvaStudentGradeEntryListAct(undefined));
        }
    }, [])


    const handleStarChange = (studentId: number, objectiveId: string, value: number) => {
        setStudentData((prevData) =>
            prevData.map((student) =>
                student.studentId === studentId
                    ? { ...student, [`objective_${objectiveId}`]: value }
                    : student
            )
        );
    };

    const instituteTerms = (curriculumId: string) => {
        if (curriculumId) {
            let payload = {
                branchId,
                curriculumId,
            };
            dispatch(getIgseTermNameListAct(generateActionPayload("get_igse_term_name_list", undefined, payload)));
        }
    };

    const pvaGradeEntryStudentListApiCall = (otherProps?: any) => {
        const {
            academicYearId,
            curriculumId,
            classId,
            termId,
            pvaSubjectId,
            sectionId,
        } = pvaGradeEntryForm.values;

        if (academicYearId && curriculumId && classId) {
            const payload = {
                instituteId,
                branchId,
                academicYearId,
                curriculumId,
                classId,
                termId,
                pvaSubjectId,
                sectionId,
                ...otherProps,
            };

            dispatch(
                getPvaStudentGradeEntryListAct(
                    generateActionPayload("get_pva_students_grade_entry_list", undefined, payload)
                )
            );
        }
    };

    const getPvaSubjecttoClassMappingListApiCall = (otherProps?: any) => {
        const payload = {
            branchId,
            ...pvaGradeEntryForm.values
        }
        dispatch(getPvaSubjectsClassesMappingAct(generateActionPayload("get_pva_subjects_classes_mapping", undefined, payload)));
    }

    const getSubjectList = (otherProps?: any) => {

        const payload = {
            branchId,
            academicYearId: pvaGradeEntryForm.values.academicYearId,
            curriculumId: pvaGradeEntryForm.values.curriculumId,
            sortBy: "subjectName", orderBy: "asc",
            pageNo: 0, pageSize: 100,
            termId: pvaGradeEntryForm.values.termId,
            classId: pvaGradeEntryForm.values.classId,
            ...otherProps
        }
        if (payload.academicYearId && payload.curriculumId) {
            dispatch(getPvaGradeEntrySubjectAct(generateActionPayload("get_pva_grade_entry_subjects", undefined, payload)));
        }
    }

    const getCurriculumApiCall = (otherProps?: any) => {
        const payload1 = { academicYearId: pvaGradeEntryForm.values.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", ...otherProps };
        if(loggedInUserRole === "TEACHER"){
                payload1.progressCardType = "PVA";
            }
        dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
    }

    const getClassApiCall = (otherProps?: any) => {
        const payload = {
            branchId, curriculumId: pvaGradeEntryForm.values.curriculumId, academicYearId: pvaGradeEntryForm.values.academicYearId, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100, ...otherProps,
        };
         if(loggedInUserRole === "TEACHER"){
                payload.progressCardType = "PVA";
            }
        dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
    }

    const getSectionListResp = (otherProps?: any) => {
        const payload = { branchClassId: pvaGradeEntryForm.values.classId || null, masterAcademicYearId: pvaGradeEntryForm.values.academicYearId, curriculumId: pvaGradeEntryForm.values.curriculumId, pageNo: 0, pageSize: 20, sortBy: "sectionName", orderBy: "asc", ...otherProps }
        if(loggedInUserRole === "TEACHER"){
            payload.progressCardType = "PVA";
        }
        if (payload.branchClassId && payload.masterAcademicYearId) {
            dispatch(getSectionList(generateActionPayload("get_section_list", undefined, payload)));
        }
    }

    const filterHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        pvaGradeEntryForm.setFieldValue(name, value);
        dispatch(resetPvaStudentGradeEntryListAct(undefined));
        if (name === "academicYearId" || name === "curriculumId") {
            dispatch(resetPvaSubjectAct(undefined));
        }
        setStudentData([]);
        const updateFormValues = (updatedValues: Partial<typeof pvaGradeEntryForm.values>) => {
            pvaGradeEntryForm.setValues(prev => ({ ...prev, ...updatedValues }));
        };
        if (name === "academicYearId") {
            getCurriculumApiCall({ academicYearId: value });
            updateFormValues({ academicYearId: value, classId: "", curriculumId: "", sectionId: "", pvaSubjectId: "" });
        }
        else if (name === "curriculumId") {
            updateFormValues({ curriculumId: value, classId: "", sectionId: "", pvaSubjectId: "" });
            if (!value) {
                dispatch(resetBrchClassAct(undefined))
                dispatch(setIgseTermDetailsListAct(undefined))
            }
            else {
                getClassApiCall({ curriculumId: value, academicYearId: pvaGradeEntryForm.values.academicYearId });
                instituteTerms(value);
            }
        }
        else if (name === "classId") {
            updateFormValues({ classId: value, sectionId: "", pvaSubjectId: "" });
            getSectionListResp({ branchClassId: value });
            // getSubjectList({ curriculumId: pvaGradeEntryForm.values.curriculumId, academicYearId: pvaGradeEntryForm.values.academicYearId, classId: value });
        }
        else if (name === "termId") {
            updateFormValues({ termId: value, pvaSubjectId: "" });
            getSubjectList({academicYearId: pvaGradeEntryForm.values.academicYearId, curriculumId: pvaGradeEntryForm.values.curriculumId, classId: pvaGradeEntryForm.values.classId, termId: value});
        }
        else {
            updateFormValues({ [name]: value });
        }
    }

    const allStudentCheckHndlr = useCallback((event: any) => {
        const { checked } = event.target;
        setAllStudentSelectedState(checked);
        setStudentData((prevData) =>
            prevData.map((student) => ({
                ...student,
                isSelected: checked
            }))
        );
    }, []);


    const singleStudentCheckHndlr = useCallback((event: any) => {
        const { checked } = event.currentTarget;
        const studentId = Number(event.currentTarget.getAttribute("data-id"));
        setStudentData((prevData) =>
            prevData.map((student) =>
                student.studentId === studentId
                    ? { ...student, isSelected: checked }
                    : student
            )
        );
        setAllStudentSelectedState((prevData) =>
            studentData.every((s) => s.studentId === studentId ? checked : s.isSelected)
        );
    }, [studentData]);

    const generatePayload = (studentData: StudentData[], initialValues: any, branchId: number) => {
        const payload = {
            ...pvaGradeEntryForm.values,
            branchId: branchId,
            students: studentData
                .filter((student) => student.isSelected)
                .map((student) => {
                    const skillAreaIds = Object.keys(student)
                        .filter((key) => key.startsWith("objective_"))
                        .map((key) => {
                            const [_, skillAreaId] = key.split("_");
                            return {
                                skillAreaId: Number(skillAreaId),
                                gradeRating: Number(student[key]) || 0,
                            };
                        })
                        .filter((item) => item.gradeRating > 0);

                    const totalGradeRating = skillAreaIds.reduce((acc, cur) => acc + cur.gradeRating, 0);
                    const finalGrade = skillAreaIds.length > 0 ? Math.round(totalGradeRating / skillAreaIds.length) : 0;

                    return {
                        studentId: student.studentId,
                        skillAreaIds,
                        totalGradeRating,
                        finalGrade: String(finalGrade),
                        schoolCompetitions: student.schoolLevelCompetitions || [],
                        stateLevelCompetitions: student.stateLevelCompetitions || [],
                    };
                }),
        };

        return payload;
    };

    const submitHndlr = () => {
        const selectedStudents = studentData.filter(
              (item: any) => item?.isSelected
            );
            if (!selectedStudents.length) {
              toast.error("At least one student is required");
              return;
            }
        if (studentData.length > 0 && studentData.find((student) => student.isSelected === true)) {
            const payload = generatePayload(studentData, initialValues, branchId);
            dispatch(savePvaGradeEntryListAct(generateActionPayload("save_pva_grade_entry", undefined, payload)));
        }
    };

    const handleSchoolCompetitionSubmit = (schoolCompetitionData: any) => {
        const { studentId, schoolCompetitions } = schoolCompetitionData;

        setStudentData((prevData) =>
            prevData.map((student) => {
                if (String(student.studentId) === String(studentId)) {
                    return {
                        ...student,
                        schoolLevelCompetitions: schoolCompetitions,
                    };
                }
                return student;
            })
        );
        toast.success("School Competitions updated successfully");
    };
    const handleStateCompetitionSubmit = (stateCompetitionData: any) => {
        const { studentId, stateCompetitions } = stateCompetitionData;

        setStudentData((prevData) =>
            prevData.map((student) => {
                if (String(student.studentId) === String(studentId)) {
                    return {
                        ...student,
                        stateLevelCompetitions: stateCompetitions,
                    };
                }
                return student;
            })
        );
        toast.success("State Competitions updated successfully");
    };

    const handleSchoolCompetitionModalOpen = (studentId: string) => {
        schoolCompetitionOpenModal(studentId);
    };

    const handleStateCompetitionModalOpen = (studentId: string) => {
        stateCompetitionOpenModal(studentId);
    };
    const columns = useMemo(() => generateColumns(allStudentCheckHndlr, singleStudentCheckHndlr, allStudentSelectedState, isEy, isIgcse, objectivesData, handleStarChange, handleSchoolCompetitionModalOpen, handleStateCompetitionModalOpen), [studentData, objectivesData]);
    const { data: academicYearList } = academicYearListResp || {};
    const { data: curriculumTypes } = brchCurriculumResp || {}
    const { content: classTypes } = branchClassResp || {};

    return (

        <>
            <div className="card d-inline-block w-100 overflow-hidden">
                <div className="card-body p-0">
                    <div className="bg-light m-3 pt-1 pb-0 rounded">
                        <div className="row p-3 g-3 examination">
                            <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                                <SelectInput
                                    name="academicYearId"
                                    value={pvaGradeEntryForm.values.academicYearId}
                                    onChange={filterHandler}
                                    menuItems={academicYearList || []}
                                    valueKey="academicYearId"
                                    textKey="academicYearName"
                                    labelText="Academic Year"
                                    labelClass="required"
                                    inputClassName="bg-light"
                                    formgroupClassName='mb-0'
                                    floatingLabel
                                    invalid={(pvaGradeEntryForm.touched.academicYearId && pvaGradeEntryForm.errors.academicYearId) ? true : false}
                                    error={(pvaGradeEntryForm.touched.academicYearId && pvaGradeEntryForm.errors.academicYearId) ? pvaGradeEntryForm.errors.academicYearId : ""}
                                />
                            </div>
                            <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                                <SelectInput
                                    name="curriculumId"
                                    value={pvaGradeEntryForm.values.curriculumId}
                                    onChange={filterHandler}
                                    menuItems={curriculumTypes}
                                    valueKey="branchCurriculumId"
                                    textKey="curriculumName"
                                    labelText="Curriculum"
                                    labelClass="required"
                                    inputClassName="bg-light"
                                    formgroupClassName='mb-0'
                                    floatingLabel
                                    invalid={(pvaGradeEntryForm.touched.curriculumId && pvaGradeEntryForm.errors.curriculumId) ? true : false}
                                    error={(pvaGradeEntryForm.touched.curriculumId && pvaGradeEntryForm.errors.curriculumId) ? pvaGradeEntryForm.errors.curriculumId : ""}
                                />
                            </div>

                            <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                                <SelectInput
                                    name="classId"
                                    value={pvaGradeEntryForm.values.classId}
                                    onChange={filterHandler}
                                    menuItems={classTypes}
                                    valueKey="id"
                                    textKey="shortName"
                                    labelText="Class"
                                    labelClass="required"
                                    inputClassName="bg-light"
                                    formgroupClassName='mb-0'
                                    floatingLabel
                                    invalid={(pvaGradeEntryForm.touched.classId && pvaGradeEntryForm.errors.classId) ? true : false}
                                    error={(pvaGradeEntryForm.touched.classId && pvaGradeEntryForm.errors.classId) ? pvaGradeEntryForm.errors.classId : ""}
                                />
                            </div>
                            <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                                <SelectInput
                                    name="sectionId"
                                    value={pvaGradeEntryForm.values.sectionId}
                                    onChange={filterHandler}
                                    menuItems={sectionListResp?.data || []}
                                    valueKey="sectionId"
                                    textKey="sectionName"
                                    defaultSelect="Select"
                                    labelText="Section"
                                    labelClass="required"
                                    inputClassName="bg-light"
                                    formgroupClassName='mb-0'
                                    onBlur={pvaGradeEntryForm.handleBlur}
                                    floatingLabel
                                    invalid={(pvaGradeEntryForm.touched.sectionId && pvaGradeEntryForm.errors.sectionId) ? true : false}
                                    error={(pvaGradeEntryForm.touched.sectionId && pvaGradeEntryForm.errors.sectionId) ? pvaGradeEntryForm.errors.sectionId : ""}
                                />
                            </div>
                            <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                                <SelectInput
                                    name="termId"
                                    labelText="Term Name"
                                    labelClass="required"
                                    inputClassName="bg-light"
                                    formgroupClassName='mb-0'
                                    value={pvaGradeEntryForm.values.termId}
                                    onChange={filterHandler}
                                    menuItems={Array.isArray(getIgseTermNameListResp?.data) ? getIgseTermNameListResp?.data : []}
                                    valueKey="termId"
                                    textKey="termName"
                                    floatingLabel
                                    invalid={(pvaGradeEntryForm.touched.termId && pvaGradeEntryForm.errors.termId) ? true : false}
                                    error={(pvaGradeEntryForm.touched.termId && pvaGradeEntryForm.errors.termId) ? pvaGradeEntryForm.errors.termId : ""}
                                />
                            </div>
                            <div className={`col-xs-12 col-md-12 col-lg-3 col-xl-2 ${isIgcse ? 'mt-lg-0' : ''}`}>
                                <SelectInput
                                    name="pvaSubjectId"
                                    value={pvaGradeEntryForm.values.pvaSubjectId}
                                    onChange={filterHandler}
                                    menuItems={Array.isArray(getPvaGradeEntrySubjectResp) ? getPvaGradeEntrySubjectResp : []}
                                    valueKey="pvaSubjectId"
                                    textKey="pvaSubjectName"
                                    labelText="Subject Name"
                                    labelClass="required"
                                    inputClassName="bg-light"
                                    floatingLabel
                                    invalid={(pvaGradeEntryForm.touched.pvaSubjectId && pvaGradeEntryForm.errors.pvaSubjectId) ? true : false}
                                    error={(pvaGradeEntryForm.touched.pvaSubjectId && pvaGradeEntryForm.errors.pvaSubjectId) ? pvaGradeEntryForm.errors.pvaSubjectId : ""}
                                />
                            </div>
                            <div className="col-auto d-flex align-items-center mt-2 mt-sm-0">
                                <span>
                                    Please select students to provide ratings for skills
                                </span>
                            </div>
                            <div className="col-auto ms-auto d-flex align-items-center mt-2 mt-sm-0">
                                <button disabled={showApiLoader} type="button" onClick={(event: any) => pvaGradeEntryForm.handleSubmit(event)} className="btn float-end text-white d-flex justify-content-center align-items-center" style={{ background: "#405189", border: "none" }}><HugeiconsIcon icon={Search01Icon} className="me-2 text-white" size={15} />Search</button>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <TableExpandable
                            columns={columns || []}
                            data={studentData || []}
                            tableClass="table-bordered table-nowrap"
                            divClass="table-responsive max-h-500px mb-2"
                            theadClass="table-light text-muted align-middle z-index-2"
                            showPagination={false}
                            rowDataInfo={Array.isArray(getPvaSubjecttoClassMappingResp?.content) ? getPvaSubjecttoClassMappingResp.content : []}
                        />
                        {studentData?.length === 0 && pvaReportsErrorAct && <div className='col d-flex'>
                            <span className='text-danger ms-3 mt-2'> {`Please add Pva data in Pva selection for the selected subject`}</span>
                        </div>}
                    </div>
                    <div className='row'>
                        <div className="d-flex gap-2 w-auto ms-auto mx-4 my-3">
                            <button
                                type="button"
                                className={`btn btn-success`}
                                disabled={showApiLoader}
                                onClick={submitHndlr}
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <ModalContainerUpdated
                id="school-competition-modal"
                isOpen={schoolCompetitionModalState.showModal}
                toggle={schoolCompetitionCloseModal}
                modalTitle="School Competition"
                modalSize="lg"
            >
                <SchoolCompetitionModal
                    isOpen={schoolCompetitionModalState.showModal}
                    toggle={schoolCompetitionCloseModal}
                    studentId={schoolCompetitionModalState.modalData}
                    onSubmitHandler={handleSchoolCompetitionSubmit}
                />
            </ModalContainerUpdated>
            <ModalContainerUpdated
                id="state-competition-modal"
                isOpen={stateCompetitionModalState.showModal}
                toggle={stateCompetitionCloseModal}
                modalTitle="State Competition"
                modalSize="lg"
            >
                <StateCompetitionModal
                    isOpen={stateCompetitionModalState.showModal}
                    toggle={stateCompetitionCloseModal}
                    studentId={stateCompetitionModalState.modalData}
                    onSubmitHandler={handleStateCompetitionSubmit}
                />
            </ModalContainerUpdated>
        </>
    )
}

export default PvaGradeEntry