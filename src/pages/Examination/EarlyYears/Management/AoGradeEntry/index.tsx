import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { SelectInput, TableExpandable } from '../../../../../Components/Common'
import { useFormik } from 'formik';
import { useAppDispatch, useAppSelector } from '../../../../../hooks/storehook';
import { shallowEqual } from 'react-redux';
import TableContainer from '../../../../../Components/Common/TableContainer';
import { btnOptions, coScholasticSubjects, generateColumns, scholasticSubjects, subjectType, } from './helper';
import { generateActionPayload } from '../../../../../utility/reduxutility';
import { examinationSubjectsListAct, getAoGradeEntryListAct, getAoTermSubjectsAct, getExaminationClassSubjectAct, resetAoGradeEntryListAct, saveAoGradeEntryListAct, setAoGradeEntryListAct, setAoTermSubjectsAct } from '../../../../../store/examination/examinationmanagement/examinationmanagementactions';
import { getAssignedClassSubjectsList, resetAssignedClassSubjectsListAct } from '../../../../../store/academic/classSubjects/classsubjectsactions';
import { getBranchClassAct, getBranchCurriculumAct, resetBrchClassAct } from '../../../../../store/branchsettings/branchacademics/branchacademicsactions';
import { getSectionList } from '../../../../../store/academic/classroomManagment/classroommanagmentactions';
import * as Yup from "yup";
import { toast } from 'react-toastify';
import { resetAoTermSubjectsAct, setAoGradeEntryErrorAct, setExaminationClassesAct, setExaminationClassSubjectAct } from '../../../../../store/examination/examinationmanagement/examinationmanagementslice';
import { HugeiconsIcon } from '@hugeicons/react';
import { Search01Icon } from '@hugeicons-pro/core-stroke-standard';
import { getAreaofStrengthFocusListAct, getCoscholasticSubjectsListAct, getIgseTermNameListAct } from '../../../../../store/examination/examinationsettings/examinationsettingsaction';
import { setIgseTermDetailsListAct } from '../../../../../store/examination/examinationsettings/examinationsettingsslice';
import { getSecoundLanguagesList } from '../../../../../store/FrontDesk/AdmissionManagment/applicationmanagmentaction';
import { useLocation } from 'react-router-dom';

const initialValues = {
    academicYearId: "",
    curriculumId: "",
    classId: "",
    termId: "",
    subjectId: "",
    sectionId: "",
    scholasticType: "",
    coScholasticType: "",
    subjectType: "SCHOLASTIC",
    skillArea: "",
    // languageId: "",
};

const validationSchema = Yup.object().shape({
    academicYearId: Yup.string().required("Academic Year is required"),
    curriculumId: Yup.string().required("Curriculum is required"),
    classId: Yup.string().required("Class is required"),
    termId: Yup.string().required("Term is required"),
    subjectId: Yup.string().required("Subject is required"),
    sectionId: Yup.string().required("Section is required"),
});

const AoGradeEntry = () => {

    const dispatch = useAppDispatch();
    const [studentData, setStudentData] = useState([]);
    const [allStudentSelectedState, setAllStudentSelectedState] = useState(false);
    const classApiCalled = useRef(false);
    const location = useLocation();
    const isEy = location.pathname.includes("/early-years-management");
    const isIgcse = location.pathname.includes("/igcse-management");

    const {
        academicYearListResp,
        brchCurriculumResp,
        branchClassResp,
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        showApiLoader,
        sectionListResp,
        examinationSubjectsListResp,
        examinationManagementErrorResp,
        getAoGradeEntryListResp,
        getAoTermSubjectsResp,
        saveAoGradeEntryListResp,
        getIgseTermNameListResp,
        getCoscholasticSubjectsRequestListResp,
        secoundLanguageResp,
        getExaminationClassSubjectResp,
        getAreaofStrengthFocusListResp,
        aoGradeEntryErrorResp,
        loggedInUserRole
    } = useAppSelector(
        ({ globalData, instAcademics, branchAcademics, appData, classroomManagmentInfo, examinationSettings, examinationManagement, applicationSale, classSubjectsInfo }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            branchClassResp: branchAcademics.branchClassResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            showApiLoader: globalData.showApiLoader,
            sectionListResp: classroomManagmentInfo.sectionListResp,
            getIgseTermNameListResp: examinationSettings.getIgseTermNameListResp,
            examinationSubjectsListResp: examinationManagement.examinationSubjectsListResp,
            getAoGradeEntryListResp: examinationManagement.getAoGradeEntryListResp,
            getAoTermSubjectsResp: examinationManagement.getAoTermSubjectsResp,
            saveAoGradeEntryListResp: examinationManagement.saveAoGradeEntryListResp,
            examinationManagementErrorResp: examinationManagement.examinationManagementErrorResp,
            getCoscholasticSubjectsRequestListResp: examinationSettings.getCoscholasticSubjectsRequestListResp,
            secoundLanguageResp: applicationSale.secoundLanguageResp,
            getExaminationClassSubjectResp: examinationManagement.getExaminationClassSubjectResp,
            getAreaofStrengthFocusListResp: examinationSettings.getAreaofStrengthFocusListResp,
            aoGradeEntryErrorResp: examinationManagement.aoGradeEntryErrorResp,
            loggedInUserRole: appData.loggedInUserRole,
        }),
        shallowEqual
    );

    const aoGradeEntryRef = useRef({
        prevExaminationManagementErrorResp: examinationManagementErrorResp,
        prevSaveAoGradeEntryListResp: saveAoGradeEntryListResp,
        prevAoGradeEntryErrorResp: aoGradeEntryErrorResp,
    });

    useEffect(() => {
        const { prevExaminationManagementErrorResp, prevSaveAoGradeEntryListResp, prevAoGradeEntryErrorResp } = aoGradeEntryRef.current;

        if (examinationManagementErrorResp && prevExaminationManagementErrorResp !== examinationManagementErrorResp) {
            const { details } = examinationManagementErrorResp;
            toast.error(details || "Something went wrong");
        } else if (saveAoGradeEntryListResp && prevSaveAoGradeEntryListResp !== saveAoGradeEntryListResp) {
            toast.success("Ao grade entry saved successfully");
            aoGradeEntryApiCall()
        }
        else if(aoGradeEntryErrorResp && prevAoGradeEntryErrorResp !== aoGradeEntryErrorResp) {
            const { details } = aoGradeEntryErrorResp;
            toast.error(details || "Something went wrong");
            dispatch(resetAoGradeEntryListAct(undefined))
            dispatch(resetAoTermSubjectsAct(undefined))
            setStudentData([])
        }

        aoGradeEntryRef.current.prevExaminationManagementErrorResp = examinationManagementErrorResp
        aoGradeEntryRef.current.prevSaveAoGradeEntryListResp = saveAoGradeEntryListResp
        aoGradeEntryRef.current.prevAoGradeEntryErrorResp = aoGradeEntryErrorResp
    }, [saveAoGradeEntryListResp, examinationManagementErrorResp, aoGradeEntryErrorResp])
    

    const aoGradeEntryForm = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values) => {
            // Call both APIs on search
            getAoSelectionApiCall(values);
            getAreaofStrengthFocusApiCall(values);
        },
    });

    const instituteTerms = (curriculumId: string) => {
        if (curriculumId) {
            let payload = {
                branchId,
                curriculumId,
            };
            dispatch(getIgseTermNameListAct(generateActionPayload("get_igse_term_name_list", undefined, payload)));
        }
    };

    const aoGradeEntryApiCall = (otherProps?: any) => {
        if (aoGradeEntryForm.values.academicYearId && aoGradeEntryForm.values.curriculumId && aoGradeEntryForm.values.classId) {
            dispatch(getAoGradeEntryListAct(generateActionPayload("get_ao_grade_entry_list", undefined, { instituteId, branchId, ...aoGradeEntryForm.values, ...otherProps })));
        }
    }

  const getAreaofStrengthFocusApiCall = (otherProps?: any) => {
    const payload = {
      branchId,
      academicYearId: aoGradeEntryForm.values.academicYearId,
      curriculumId: aoGradeEntryForm.values.curriculumId,
      classId: aoGradeEntryForm.values.classId,
      subjectId: aoGradeEntryForm.values.subjectId,
    }
    dispatch(getAreaofStrengthFocusListAct(generateActionPayload("get_area_strength_focus", undefined, payload)));
  }

    const getSubjectList = (otherProps?: any) => {
        const sectionIdToSend =
            otherProps.sectionId ?? aoGradeEntryForm.values.sectionId;

        const payload = {
            branchId,
            academicYearId: aoGradeEntryForm.values.academicYearId, curriculumId: aoGradeEntryForm.values.curriculumId, branchClassId: aoGradeEntryForm.values.classId,
             subjectType: aoGradeEntryForm.values.subjectType,
             scholasticType: aoGradeEntryForm.values.scholasticType,
            sortBy: "subjectName", orderBy: "asc",
            pageNo: 0, pageSize: 100,
            ...otherProps
        }
        if (loggedInUserRole === "TEACHER") {
            payload.sectionId = sectionIdToSend;
        } else {
            delete payload.sectionId;
        }
        if (payload.academicYearId && payload.branchClassId && payload.curriculumId) {
            dispatch(
                examinationSubjectsListAct(
                    generateActionPayload("get_examinations_languages_list", undefined, payload)
                )
            );
        }
    }
    const getCurriculumApiCall = (otherProps?: any) => {
        const payload1 = { academicYearId: aoGradeEntryForm.values.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", ...otherProps };
        if (loggedInUserRole === "TEACHER") {
            payload1.moduleName = "EXAMINATION";
        }
        dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
    }

    const getClassApiCall = (otherProps?: any) => {
        const payload = {
            branchId, classFilter: isEy ? "EARLY" : "HIGHER", curriculumId: aoGradeEntryForm.values.curriculumId, academicYearId: aoGradeEntryForm.values.academicYearId, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100, ...otherProps,
        };
        if (loggedInUserRole === "TEACHER") {
            payload.moduleName = "EXAMINATION";
        }
        dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
    }

    const getSectionListResp = (otherProps?: any) => {
        const payload = { branchClassId: aoGradeEntryForm.values.classId || null, masterAcademicYearId: aoGradeEntryForm.values.academicYearId, curriculumId: aoGradeEntryForm.values.curriculumId, pageNo: 0, pageSize: 20, sortBy: "sectionName", orderBy: "asc", ...otherProps }
        if (loggedInUserRole === "TEACHER") {
            payload.moduleName = "EXAMINATION";
        }
        if (payload.branchClassId && payload.masterAcademicYearId) {
            dispatch(getSectionList(generateActionPayload("get_section_list", undefined, payload)));
        }
    }

    const getAoSelectionApiCall = (otherProps?: any) => {
        const payload: any = {
            branchId,
            ...aoGradeEntryForm.values,
            isSubjectIdPresent: true,
            pageNo: 0,
            pageSize: 100,
            ...otherProps,
        };
        if (!isIgcse) {
            delete payload.scholasticType;
            delete payload.coScholasticType;
            delete payload.subjectType;
            delete payload.skillArea;
            // delete payload.languageId;
        }
        dispatch(getAoTermSubjectsAct(generateActionPayload("get_ao_term_subjects", undefined, payload)));
    };

    const getSkillAreaList = (otherProps?: any) => {
        const payload = {
            branchCurriculumId: aoGradeEntryForm.values.curriculumId,
            branchId,
            subjectId: aoGradeEntryForm.values.subjectId,
            ...otherProps,
        };
        dispatch(getCoscholasticSubjectsListAct(
            generateActionPayload("get_coscholastic_subjects_list", undefined, payload)
        ));
    };

    const getSecondLanguageList = ({ classId, type }: { classId: any, type: string }) => {
        const params = {
            instituteId,
            academicYearId: aoGradeEntryForm.values.academicYearId,
            branchId,
            curriculumId: aoGradeEntryForm.values.curriculumId,
            classId,
            type,
        };

        if (classId && type) {
            dispatch(
                getSecoundLanguagesList(
                    generateActionPayload("get_secound_language_list", undefined, params)
                )
            );
        }
    };

    useEffect(() => {
        return () => {
            dispatch(setAoGradeEntryListAct(undefined));
            dispatch(setAoTermSubjectsAct(undefined));
            dispatch(resetBrchClassAct(undefined));
            dispatch(resetAoTermSubjectsAct(undefined));
        }
    }, [])

    useEffect(() => {
        const yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId
        aoGradeEntryForm.setFieldValue("academicYearId", yearId)
        getCurriculumApiCall({ academicYearId: yearId });
    }, [academicYearListResp]);
    useEffect(() => {
        classApiCalled.current = false;
    }, [location.pathname]);

    useEffect(() => {
        const { data } = brchCurriculumResp || {};
        const curriculumMapping: Record<string, string> = {
            "early-years-management": "EY1-EY3",
            "cbse-management": "CBSE",
            "igcse-management": "IGCSE",
        };
        const matchedKey = Object.keys(curriculumMapping).find((key) =>
            location.pathname.includes(key)
        );
        const selectedCurriculumName = matchedKey
            ? curriculumMapping[matchedKey]
            : "";

        if (Array.isArray(data) && data.length > 0 && aoGradeEntryForm.values.academicYearId) {
            const selectedCurriculum = data.find(
                (item: any) => item.shortName?.trim()?.toUpperCase() === selectedCurriculumName?.trim()?.toUpperCase()
            );
            if (!selectedCurriculum) {
                dispatch(resetAssignedClassSubjectsListAct(undefined));
                dispatch(resetBrchClassAct(undefined));
                aoGradeEntryForm.setFieldValue("curriculumId", "");
                aoGradeEntryForm.setFieldValue("subjectId", "");
                return;
            }
            aoGradeEntryForm.setFieldValue("curriculumId", selectedCurriculum.branchCurriculumId);

            const payload: any = {
                branchId,
                curriculumId: selectedCurriculum.branchCurriculumId,
                academicYearId: aoGradeEntryForm.values.academicYearId,
                classFilter: isEy ? "EARLY" : "HIGHER",
                sortBy: "classSequence",
                orderBy: "asc",
                pageNo: 0,
                pageSize: 100,
            };
            if (loggedInUserRole === "TEACHER") {
                payload.moduleName = "EXAMINATION";
            }
            dispatch(
                getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload))
            );
            dispatch(getIgseTermNameListAct(generateActionPayload("get_igse_term_name_list", undefined, {branchId, curriculumId: selectedCurriculum.branchCurriculumId})));
            aoGradeEntryForm.setValues((prev: any) => ({
                ...prev,
                curriculumId: selectedCurriculum.branchCurriculumId,
            }));
        
        }
    }, [brchCurriculumResp, aoGradeEntryForm.values.academicYearId, location.pathname]);

    useEffect(() => {
        const { content } = branchClassResp || {};
        if (Array.isArray(content) && content.length > 0) {
            aoGradeEntryForm.setFieldValue("classId", content[0].id);
            getSubjectList({ branchClassId: content[0]?.id });
            getSectionListResp({ branchClassId: content[0]?.id });
        }
    }, [branchClassResp])

    useEffect(() => {
        if (Array.isArray(getAoGradeEntryListResp?.studentAoDataList) && getAoGradeEntryListResp?.studentAoDataList?.length > 0) {
            const modifiedData = getAoGradeEntryListResp?.studentAoDataList.map((item: any) => {
                const base = {
                    ...item,
                    isSelected: false,
                    grade: "",
                    aosGradingDtos: item?.aosGradingDtos?.map((i: any) => ({
                        ...i,
                        grade: i?.grading,
                        isUpdated: false
                    })) || []
                };

                if (isIgcse) {
                    return base;
                } else {
                    return {
                        ...base,
                        areaOfStrength: item?.areaOfStrength,
                        areaOfFocus: item?.areaOfFocus,
                    };
                }
            });

            setStudentData(modifiedData);
        }
    }, [getAoGradeEntryListResp]);


    const onChangeInputHndlr = (name: string, value: any, studentId: string, aoObjective?: any) => {
        const studentRowIndex = studentData.findIndex((item: any) => +item.studentId === Number(studentId));
        if (studentRowIndex > -1) {
            let updateStudentState: any = [...studentData];
            if (name === "grade") {
                if (Array.isArray(updateStudentState[studentRowIndex]?.aosGradingDtos)) {
                    const { aoTermSubjectDetailsId = "", aoSubjectDetailsId } = aoObjective || {}
                    const findIndex = updateStudentState[studentRowIndex]?.aosGradingDtos?.findIndex((item: any) => +item.aoSubjectDetailsId === Number(aoSubjectDetailsId));
                    if (findIndex > -1) {
                        if (updateStudentState[studentRowIndex].aosGradingDtos[findIndex]?.gradeStudentDetailId) {
                            updateStudentState[studentRowIndex].aosGradingDtos[findIndex].isUpdated = true
                        }
                        updateStudentState[studentRowIndex].aosGradingDtos[findIndex].grade = updateStudentState[studentRowIndex].aosGradingDtos[findIndex].grade === value ? "" : value
                    } else {
                        updateStudentState[studentRowIndex].aosGradingDtos = [...updateStudentState[studentRowIndex].aosGradingDtos, { aoSubjectDetailsId, grade: value, aoTermSubjectDetailsId }]
                    }
                }
            } else if ((name === "areaOfStrength" || name === "areaOfFocus") && !isIgcse) {
                updateStudentState[studentRowIndex][name] = value;
            } else if (name === "comments" && isIgcse) {
                updateStudentState[studentRowIndex][name] = value;
            }
            setStudentData(updateStudentState);
        }
    };
    const filterHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        aoGradeEntryForm.setFieldValue(name, value);

        dispatch(setAoGradeEntryErrorAct(undefined));
        dispatch(resetAoGradeEntryListAct(undefined));
        dispatch(resetAoTermSubjectsAct(undefined));
        setStudentData([]);
        const updateFormValues = (updatedValues: Partial<typeof aoGradeEntryForm.values>) => {
            aoGradeEntryForm.setValues(prev => ({ ...prev, ...updatedValues }));
        };
        if (name === "academicYearId") {
            getCurriculumApiCall({ academicYearId: value });
            updateFormValues({ academicYearId: value, classId: "", curriculumId: "", sectionId: "", subjectId: "" });
        }
        else if (name === "curriculumId") {
            updateFormValues({ curriculumId: value, classId: "", sectionId: "", subjectId: "" });
            if (!value) {
                dispatch(resetBrchClassAct(undefined))
                dispatch(setIgseTermDetailsListAct(undefined))
            }
            else {
                getClassApiCall({ curriculumId: value, academicYearId: aoGradeEntryForm.values.academicYearId });
                instituteTerms(value);
            }
        }
        else if (name === "classId") {
            updateFormValues({ classId: value, sectionId: "", subjectId: "" });
            getSubjectList({ branchClassId: value });
            getSectionListResp({ branchClassId: value });
        } 
        else if (name === "sectionId") {
            updateFormValues({ sectionId: value, subjectId: "" });
            if (loggedInUserRole === "TEACHER") {
                getSubjectList({ sectionId: value });
            } else {
                getSubjectList();
            }
        } else if (name === "subjectType") {
            updateFormValues({ subjectType: value, subjectId: "", skillArea: "" });
            getSubjectList({ [name]: value });
        } else if (name === "scholasticType") {
            updateFormValues({ scholasticType: value, subjectId: "", skillArea: "" });
            getSubjectList({ [name]: value });
            if (!value) dispatch(setExaminationClassSubjectAct(undefined));
        } else if (name === "coScholasticType") {
            updateFormValues({ coScholasticType: value, subjectId: "", skillArea: "" });
            getSubjectList({ [name]: value });
            if (!value) dispatch(setExaminationClassSubjectAct(undefined));
        } 
        // else if (name === "subjectId") {
        //     const subjectsArray = Array.isArray(examinationSubjectsListResp?.data)
        //         ? examinationSubjectsListResp.data
        //         : [];

        //     const selectedSubject = subjectsArray.find(
        //         (item: any) => item.subjectId === Number(value)
        //     );

        //     updateFormValues({ subjectId: value, skillArea: "" });
        //     getSkillAreaList({ subjectId: value });

        //     if (
        //         selectedSubject?.scholasticType === "LANGUAGE" &&
        //         selectedSubject?.languageType !== '' &&
        //         selectedSubject?.languageType !== null
        //     ) {
        //         getSecondLanguageList({
        //             classId: aoGradeEntryForm.values.classId,
        //             type: selectedSubject.languageType,
        //         });
        //     }
        // }
        else {
            updateFormValues({ [name]: value });
        }
    }    

    const allStudentCheckHndlr = useCallback((event: any) => {
        const { checked } = event.target;
        setAllStudentSelectedState(checked);
        let updateStudentState = [...studentData];
        updateStudentState.forEach((item: any) => {
            item.isSelected = checked;
        });
        setStudentData(updateStudentState);
    }, [studentData]);

    const singleStudentCheckHndlr = useCallback((event: any) => {
        const { checked } = event.currentTarget,
            studentId = event.currentTarget.getAttribute("data-id"),
            studentRowIndex = studentData.findIndex((item: any) => +item.studentId === Number(studentId));
        if (studentRowIndex > -1) {
            const studentDetails: any = studentData[studentRowIndex];
            let updateStudentState: any = [...studentData];
            updateStudentState.splice(studentRowIndex, 1, {
                ...studentDetails, isSelected: checked,
            });
            setStudentData(updateStudentState);
            const isAllSelected = updateStudentState.every((item: any) => item.isSelected);
            setAllStudentSelectedState(isAllSelected);
        }
    }, [studentData]);

    const aoTermSubjects = useMemo(() => {
        if (Array.isArray(getAoTermSubjectsResp?.content)) { 
            const { examinationAos } = getAoTermSubjectsResp.content[0] || {};
            aoGradeEntryApiCall({...aoGradeEntryForm.values });
            return examinationAos
        }
        else {
            return []
        }
    }, [getAoTermSubjectsResp])

    const submitHndlr = () => {
        if (!aoGradeEntryForm.isValid) return;

        const selectedStudents = studentData.filter((item: any) => item?.isSelected);
        if (!selectedStudents.length) {
            toast.error("At least one student is required");
            return;
        }

        const isValid = selectedStudents.every((student: any) => {
            return aoTermSubjects?.every((subject: any) => {
                const match = student?.aosGradingDtos?.find((i: any) => +i.aoSubjectDetailsId === +subject.aoSubjectDetailsId);
                return match?.grade;
            });
        });

        if (!isValid) {
            toast.error("Please select at least one grade colour for selected student AO's.");
            return;
        }

        const studentAoDataList = selectedStudents.map((student: any) => {
            const basePayload: any = {
                studentId: student?.studentId,
                gradeStudentEntryId: student?.gradeStudentEntryId,
                comments: student?.comments,
                aosGradingDtos: student?.aosGradingDtos?.map((i: any) => {
                    const dto: any = {
                        aoSubjectDetailsId: i?.aoSubjectDetailsId,
                        grading: i?.grade,
                    };
                    if (i?.gradeStudentDetailId) {
                        dto.gradeStudentDetailId = i.gradeStudentDetailId;
                        dto.isUpdated = i.isUpdated;
                    }
                    return dto;
                })
            };

            if (!isIgcse) {
                basePayload.areaOfStrength = student?.areaOfStrength;
                basePayload.areaOfFocus = student?.areaOfFocus;
            }

            return basePayload;
        });
        const payload: any = {
            ...aoGradeEntryForm.values,
            branchId,
            instituteId,
            studentAoDataList,
        };
    if (!isIgcse) {
        delete payload.scholasticType;
        delete payload.coScholasticType;
        delete payload.subjectType;
        delete payload.skillArea;
        // delete payload.languageId;
    }
    if (getAoGradeEntryListResp?.gradeEntryId) {
        payload.gradeEntryId = getAoGradeEntryListResp?.gradeEntryId;
    }

    dispatch(saveAoGradeEntryListAct(generateActionPayload("save_ao_grade_entry", undefined, payload)));
};

    const selectedSubjectId = Number(aoGradeEntryForm.values.subjectId);

    const selectedSubject = Array.isArray(examinationSubjectsListResp)
        ? examinationSubjectsListResp.find(
            (item: any) => item.subjectId === Number(selectedSubjectId)
        )
        : undefined;

    const shouldShowSkillArea =
        selectedSubject?.scholasticType === 'LANGUAGE' &&
        selectedSubject?.languageType !== '' &&
        selectedSubject?.languageType !== null;

    const columns = useMemo(() => generateColumns(allStudentCheckHndlr, singleStudentCheckHndlr, allStudentSelectedState, aoTermSubjects, isEy, isIgcse), [studentData, aoTermSubjects]);

    const { data: academicYearList } = academicYearListResp || {};
    const { data: curriculumTypes } = brchCurriculumResp || {}
    const { content: classTypes } = branchClassResp || {};
    const { data: secoundLanguageList } = secoundLanguageResp || {};

    return (

        <>
            <div className="card d-inline-block w-100 overflow-hidden">
                <div className="card-body p-0">
                    <div className="bg-light m-3 pt-1 pb-0 rounded">
                        <div className="row p-3 g-3 examination">
                            <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                                <SelectInput
                                    name="academicYearId"
                                    value={aoGradeEntryForm.values.academicYearId}
                                    onChange={filterHandler}
                                    menuItems={academicYearList || []}
                                    valueKey="academicYearId"
                                    textKey="academicYearName"
                                    labelText="Academic Year"
                                    labelClass="required"
                                    inputClassName="bg-light"
                                    formgroupClassName='mb-0'
                                    floatingLabel
                                    invalid={(aoGradeEntryForm.touched.academicYearId && aoGradeEntryForm.errors.academicYearId) ? true : false}
                                    error={(aoGradeEntryForm.touched.academicYearId && aoGradeEntryForm.errors.academicYearId) ? aoGradeEntryForm.errors.academicYearId : ""}
                                />
                            </div>
                            <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                                <SelectInput
                                    name="curriculumId"
                                    value={aoGradeEntryForm.values.curriculumId}
                                    onChange={filterHandler}
                                    menuItems={curriculumTypes}
                                    valueKey="branchCurriculumId"
                                    textKey="curriculumName"
                                    labelText="Curriculum"
                                    labelClass="required"
                                    inputClassName="bg-light"
                                    formgroupClassName='mb-0'
                                    floatingLabel
                                    isDisabled={!isEy}
                                    invalid={(aoGradeEntryForm.touched.curriculumId && aoGradeEntryForm.errors.curriculumId) ? true : false}
                                    error={(aoGradeEntryForm.touched.curriculumId && aoGradeEntryForm.errors.curriculumId) ? aoGradeEntryForm.errors.curriculumId : ""}
                                />
                            </div>

                            <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                                <SelectInput
                                    name="classId"
                                    value={aoGradeEntryForm.values.classId}
                                    onChange={filterHandler}
                                    menuItems={classTypes}
                                    valueKey="id"
                                    textKey="shortName"
                                    labelText="Class"
                                    labelClass="required"
                                    inputClassName="bg-light"
                                    formgroupClassName='mb-0'
                                    floatingLabel
                                    invalid={(aoGradeEntryForm.touched.classId && aoGradeEntryForm.errors.classId) ? true : false}
                                    error={(aoGradeEntryForm.touched.classId && aoGradeEntryForm.errors.classId) ? aoGradeEntryForm.errors.classId : ""}
                                />
                            </div>
                            <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                                <SelectInput
                                    name="sectionId"
                                    value={aoGradeEntryForm.values.sectionId}
                                    onChange={filterHandler}
                                    menuItems={sectionListResp?.data || []}
                                    valueKey="sectionId"
                                    textKey="sectionName"
                                    defaultSelect="Select"
                                    labelText="Section"
                                    labelClass="required"
                                    inputClassName="bg-light"
                                    formgroupClassName='mb-0'
                                    onBlur={aoGradeEntryForm.handleBlur}
                                    floatingLabel
                                    invalid={(aoGradeEntryForm.touched.sectionId && aoGradeEntryForm.errors.sectionId) ? true : false}
                                    error={(aoGradeEntryForm.touched.sectionId && aoGradeEntryForm.errors.sectionId) ? aoGradeEntryForm.errors.sectionId : ""}
                                />
                            </div>
                            <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                                <SelectInput
                                    name="termId"
                                    labelText="Term Name"
                                    labelClass="required"
                                    inputClassName="bg-light"
                                    formgroupClassName='mb-0'
                                    value={aoGradeEntryForm.values.termId}
                                    onChange={filterHandler}
                                    menuItems={Array.isArray(getIgseTermNameListResp?.data) ? getIgseTermNameListResp?.data : []}
                                    valueKey="termId"
                                    textKey="termName"
                                    floatingLabel
                                    invalid={(aoGradeEntryForm.touched.termId && aoGradeEntryForm.errors.termId) ? true : false}
                                    error={(aoGradeEntryForm.touched.termId && aoGradeEntryForm.errors.termId) ? aoGradeEntryForm.errors.termId : ""}
                                />
                            </div>
                            {isIgcse && (<div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                                <SelectInput
                                    name="subjectType"
                                    value={aoGradeEntryForm.values.subjectType}
                                    onChange={filterHandler}
                                    menuItems={subjectType}
                                    valueKey="id"
                                    textKey="name"
                                    defaultSelect="Scholastic"
                                    defaultValue="SCHOLASTIC"
                                    labelText="Subject Type"
                                    labelClass="required"
                                    inputClassName="bg-light"
                                    // formgroupClassName='mb-0'
                                    floatingLabel
                                    invalid={(aoGradeEntryForm.touched.subjectType && aoGradeEntryForm.errors.subjectType) ? true : false}
                                    error={(aoGradeEntryForm.touched.subjectType && aoGradeEntryForm.errors.subjectType) ? aoGradeEntryForm.errors.subjectType : ""}
                                />
                            </div>)}
                            {isIgcse && aoGradeEntryForm.values.subjectType === "COSCHOLASTIC" ? (
                                <div className="col-xs-12 col-md-12 col-lg-3 mt-lg-0 col-xl-2">
                                    <SelectInput
                                        name="coScholasticType"
                                        labelText="Co-Scholastic Type"
                                        value={aoGradeEntryForm.values.coScholasticType}
                                        onChange={filterHandler}
                                        menuItems={coScholasticSubjects}
                                        valueKey="id"
                                        textKey="name"
                                        labelClass="required"
                                        inputClassName="bg-light"
                                        formgroupClassName="mb-0 mt-lg-3"
                                        floatingLabel
                                        invalid={
                                            aoGradeEntryForm.touched.coScholasticType &&
                                                aoGradeEntryForm.errors.coScholasticType
                                                ? true
                                                : false
                                        }
                                        error={
                                            aoGradeEntryForm.touched.coScholasticType &&
                                                aoGradeEntryForm.errors.coScholasticType
                                                ? aoGradeEntryForm.errors.coScholasticType
                                                : ""
                                        }
                                    />
                                </div>
                            ) : isIgcse && aoGradeEntryForm.values.subjectType === "SCHOLASTIC" ? (
                                <div className="col-xs-12 col-md-12 col-lg-3 mt-lg-0 col-xl-2">
                                    <SelectInput
                                        name="scholasticType"
                                        labelText="Scholastic Type"
                                        value={aoGradeEntryForm.values.scholasticType}
                                        onChange={filterHandler}
                                        menuItems={scholasticSubjects}
                                        valueKey="id"
                                        textKey="name"
                                        labelClass="required"
                                        inputClassName="bg-light"
                                        formgroupClassName="mb-0"
                                        floatingLabel
                                        invalid={
                                            aoGradeEntryForm.touched.scholasticType &&
                                                aoGradeEntryForm.errors.scholasticType
                                                ? true
                                                : false
                                        }
                                        error={
                                            aoGradeEntryForm.touched.scholasticType &&
                                                aoGradeEntryForm.errors.scholasticType
                                                ? aoGradeEntryForm.errors.scholasticType
                                                : ""
                                        }
                                    />
                                </div>
                            ) : null}

                            <div className={`col-xs-12 col-md-12 col-lg-3 col-xl-2 ${isIgcse ? 'mt-lg-0' : ''}`}>
                                <SelectInput
                                    name="subjectId"
                                    value={aoGradeEntryForm.values.subjectId}
                                    onChange={filterHandler}
                                    menuItems={Array.isArray(examinationSubjectsListResp) ? examinationSubjectsListResp : []}
                                    valueKey="subjectId"
                                    textKey="subjectName"
                                    labelText="Subject Name"
                                    labelClass="required"
                                    inputClassName="bg-light"
                                    // formgroupClassName='mb-0'
                                    floatingLabel
                                    invalid={(aoGradeEntryForm.touched.subjectId && aoGradeEntryForm.errors.subjectId) ? true : false}
                                    error={(aoGradeEntryForm.touched.subjectId && aoGradeEntryForm.errors.subjectId) ? aoGradeEntryForm.errors.subjectId : ""}
                                />
                            </div>
                            {isIgcse && aoGradeEntryForm.values.subjectType === "COSCHOLASTIC" && <div className="col-xs-12 col-md-12 col-lg-3 mt-lg-0 col-xl-2">
                                <SelectInput
                                    name="skillArea"
                                    value={aoGradeEntryForm.values.skillArea}
                                    onChange={aoGradeEntryForm.handleChange}
                                    menuItems={getCoscholasticSubjectsRequestListResp}
                                    valueKey="skillId"
                                    textKey="skillName"
                                    labelText="Skill Area"
                                    labelClass="required"
                                    inputClassName="bg-light"
                                    formgroupClassName="mb-0"
                                    floatingLabel
                                    invalid={(aoGradeEntryForm.touched.skillArea && aoGradeEntryForm.errors.skillArea) ? true : false}
                                    error={(aoGradeEntryForm.touched.skillArea && aoGradeEntryForm.errors.skillArea) ? aoGradeEntryForm.errors.skillArea : ""}
                                />
                            </div>}
                            {/* {isIgse && shouldShowSkillArea && ( <div className="col-xs-12 col-md-12 col-lg-3 mt-lg-0 col-xl-2">
                                          <SelectInput
                                            name="languageId"
                                            value={aoGradeEntryForm.values.languageId}
                                            onChange={aoGradeEntryForm.handleChange}
                                            menuItems={secoundLanguageList}
                                            valueKey="languageId"
                                            textKey="languageName"
                                            labelText="Language"
                                            labelClass="required"
                                            inputClassName="bg-light"
                                            formgroupClassName="mb-0"
                                            floatingLabel
                                            invalid={(aoGradeEntryForm.touched.languageId && aoGradeEntryForm.errors.languageId) ? true : false}
                                            error={(aoGradeEntryForm.touched.languageId && aoGradeEntryForm.errors.languageId) ? aoGradeEntryForm.errors.languageId : ""}
                                          />
                                        </div>)} */}
                           {!isIgcse && ( <div className='col-auto d-flex align-items-center mt-0'>
                                {btnOptions.map((item, index) => (
                                    <div key={index} className='d-flex align-items-center'>
                                        <button key={index} type="button" style={{ height: "17px", width: "17px" }} className={`btn btn-outline-${item.btnColor} float-end btn-sm btn-icon rounded-circle mx-1`}></button>
                                        <span className='mx-1'>{item.name}</span>
                                    </div>
                                ))}
                            </div>)}
                            <div className="col-auto ms-auto d-flex align-items-center mt-2 mt-sm-0">
                                <button disabled={showApiLoader} type="button" onClick={(event: any) => aoGradeEntryForm.handleSubmit(event)} className="btn float-end text-white d-flex justify-content-center align-items-center" style={{ background: "#405189", border: "none" }}><HugeiconsIcon icon={Search01Icon} className="me-2 text-white" size={15} />Search</button>
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
                            rowDataInfo={getAreaofStrengthFocusListResp}
                            onChangeInputHndlr={onChangeInputHndlr}
                        ></TableExpandable>
                         {studentData?.length === 0 && aoGradeEntryErrorResp && <div className='col d-flex'>
                          <span className='text-danger ms-3 mt-2'> {`Please add AO's data in AO's selection for the selected subject`}</span>
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
        </>
    )
}

export default AoGradeEntry