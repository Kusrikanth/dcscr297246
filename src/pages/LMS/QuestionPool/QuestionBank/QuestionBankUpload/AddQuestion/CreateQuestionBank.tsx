import React, { useEffect, useMemo, useRef, useState } from 'react'
import { ArrayHelpers, useFormik } from 'formik';
import { shallowEqual } from 'react-redux';
import { ModalContainerUpdated, MultiSelectCheckbox, SelectInput, TextInput, } from '../../../../../../Components/Common';
import { bloomList, chapterList, difficultyLevels, generateUniqueOptionId, physicsCategories, skillTypeList, subjectList, timeLevels, topicList } from './helper';
import { generateUniqueNumber } from '../../../../../../utility/commonutility';
import { HugeiconsIcon } from '@hugeicons/react';
import { SettingDone02Icon } from '@hugeicons-pro/core-stroke-standard';
import { useAppDispatch, useAppSelector } from '../../../../../../hooks/storehook';
import { getBranchClassAct, getBranchCurriculumAct, getInstSubjectNameAct } from '../../../../../../store/branchsettings/branchacademics/branchacademicsactions';
import { generateActionPayload } from '../../../../../../utility/reduxutility';
import UpdatedHorizontalTab from '../../../../../../Components/Common/UpdatedHorizontalTab';
import QuestionCreation, { questionCreationValidationSchema } from './QuestionCreation';
import TextSolution from './TextSolution';
import VideoSolution from './VideoSolution';
import PreviewQuestion from './PreviewQuestion';
import { useModal } from '../../../../../../hooks/modalhook';
import * as Yup from "yup";
import { useHistory, useLocation } from 'react-router-dom';
import { getBloomTaxonomyAct, getDifficultyLevelsAct, getQuestionTypesAct } from '../../../../../../store/lms/lmssettings/lmssettingsaction';
import { saveQuestionBankAct, updateQuestionBankAct } from '../../../../../../store/lms/lmsAssessment/lmsAssessmentaction';
import { getAssignedClassSubjectsList } from '../../../../../../store/academic/classSubjects/classsubjectsactions';
import { toast } from 'react-toastify';
import { getMasterClassesAct, getMasterClassStreamGroupAct, getMasterCurriculumAct } from '../../../../../../store/masterdata/masterdataactions';

interface MenuOption {
    id: string;
    labelName: string;
    customPadding: string;
}

export const questionValidationSchema = Yup.object().shape({
    // academicYearId: Yup.string().nullable().required("AcademicYear is required"),
    curriculumId: Yup.string().nullable().required("Curriculum is required"),
    classId: Yup.string().nullable().required("Class is required"),
    subject: Yup.string().nullable().required("Subject is required"),
    bloomTaxonomyId: Yup.array().min(1, "At least one Taxonomy is required").required('Taxonomy is required').nullable(),
    difficultyLevelId: Yup.string().nullable().required("Difficulty is required"),
    duration: Yup.string().nullable().required("Duration is required"),
    tags: Yup.string().nullable().required("Tags is required"),
}).concat(questionCreationValidationSchema);

const CreateQuestionBank = (props: any) => {

    const getCategoryByActiveMenuId = (activeMenuId: string) => {
        return activeMenuId === 'MCQ' ? 'checkbox' : 'radio';
    };

    const initialValues: any = {
        // academicYearId: '',
        curriculumId: '',
        searchString: '',
        classId: '',
        streamGroupId: '',
        category: getCategoryByActiveMenuId(props.activeMenuId || ''),
        selectedOptionId: "",
        selectMultiple: "",
        language: '',
        subject: "",
        description: "",
        // questionTitle: "",
        questionDescription: "",
        difficultyLevelId: '',
        duration: '',
        sections: '',
        chapter: '',
        topic: '',
        bloomTaxonomyId: "",
        skillType: '',
        optionsRow: [
            {
                id: generateUniqueNumber(),
                optionId: generateUniqueOptionId(),
                optionText: "",
                optionMarks: "",
                order: 0,
                isCorrectAnswer: false,
                selectMultiple: false
            }
        ],
        textSolution: "",
        tags: "",
    };

    const { closeModal: closeFetchQuestionsModal, modalState: fetchQuestionsState, openModal: openFetchQuestionsModal } = useModal();
    const dispatch = useAppDispatch();
    const history = useHistory();
    const [activeId, setActiveId] = useState<string | null>("userDefinedTemplate");
    const [activeSolutionId, setActiveSolutionId] = useState<string | null>("textSolution");
    const location = useLocation();
    const isCreateAssessment = location.pathname === '/create-assessment';

    const { isEditMode, editData } = props;

    const {
        academicYearListResp,
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        showApiLoader,
        getQuestionTypesResp,
        getDifficultyLevelsResp,
        getBloomTaxonomyResp,
        instituteListResp,
        branchListResp,
        saveQuestionBankResp,
        masterCurriculumResp,
        masterClassesResp,
        masterClassStreamGroupResp,
        instSubjectNameResp,
        updateQuestionBankResp,
        getQuestionBankByIdResp,
        lmsAssessmentErrorAct,
    } = useAppSelector(
        ({ instAcademics, masterData, globalData, branchAcademics, appData, lmsSettings, instituteInfo, branch, classSubjectsInfo, lmsAssessment }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            showApiLoader: globalData.showApiLoader,
            getQuestionTypesResp: lmsSettings.getQuestionTypesResp,
            getDifficultyLevelsResp: lmsSettings.getDifficultyLevelsResp,
            getBloomTaxonomyResp: lmsSettings.getBloomTaxonomyResp,
            instituteListResp: instituteInfo.instituteListResp,
            masterCurriculumResp: masterData.masterCurriculumResp,
            masterClassesResp: masterData.masterClassesResp,
            masterClassStreamGroupResp: masterData.masterClassStreamGroupResp,
            instSubjectNameResp: branchAcademics.instSubjectNameResp,
            branchListResp: branch.branchListResp,
            saveQuestionBankResp: lmsAssessment.saveQuestionBankResp,
            updateQuestionBankResp: lmsAssessment.updateQuestionBankResp,
            getQuestionBankByIdResp: lmsAssessment.getQuestionBankByIdResp,
            lmsAssessmentErrorAct: lmsAssessment.lmsAssessmentErrorAct
        }),
        shallowEqual
    );

    const instituteRespRef = useRef<any>({
        prevSaveQuestionBankResp: saveQuestionBankResp,
        prevUpdateQuestionBankResp: updateQuestionBankResp,
        prevLmsAssessmentErrorAct: lmsAssessmentErrorAct
    });

    useEffect(() => {
        const { prevSaveQuestionBankResp, prevUpdateQuestionBankResp, prevLmsAssessmentErrorAct } = instituteRespRef.current;
        if (saveQuestionBankResp && prevSaveQuestionBankResp !== saveQuestionBankResp) {
            toast.success("Question bank saved successfully.");
            history.push("/question-bank");
        }
        else if (lmsAssessmentErrorAct && prevLmsAssessmentErrorAct !== lmsAssessmentErrorAct) {
            toast.error(lmsAssessmentErrorAct.details || "Something went wrong.");
        }
        else if (updateQuestionBankResp && prevUpdateQuestionBankResp !== updateQuestionBankResp) {
            toast.success("Question bank updated successfully.");
            history.push("/question-bank");
        }
        instituteRespRef.current.prevSaveQuestionBankResp = saveQuestionBankResp;
        instituteRespRef.current.prevUpdateQuestionBankResp = updateQuestionBankResp;
        instituteRespRef.current.prevLmsAssessmentErrorAct = lmsAssessmentErrorAct;
    }, [saveQuestionBankResp, updateQuestionBankResp, lmsAssessmentErrorAct]);

    // Function to populate form with edit data
    const populateEditData = (editData: any) => {
        if (!editData) return;

        const parseJsonSafely = (str: any) => {
            if (typeof str === 'string') {
                try {
                    return JSON.parse(str);
                } catch (e) {
                    return str;
                }
            }
            return str;
        };

        const category = getCategoryByActiveMenuId(props.activeMenuId || editData.questionTypeShortName || '');

        // Enhanced boolean handling for options
        let mappedOptions = editData.questionOptions?.map((option: any, index: number) => {
            // Explicitly convert to boolean
            const isCorrectAnswer = Boolean(option.isCorrectAnswer);

            return {
                id: option.optionId || generateUniqueNumber(),
                optionId: option.optionId || "",
                optionText: parseJsonSafely(option.optionText) || "",
                optionMarks: option.allocatedMarks?.toString() || "",
                order: option.order || index,
                isCorrectAnswer: isCorrectAnswer,
                // For MCQ, selectMultiple should match isCorrectAnswer
                selectMultiple: category === 'checkbox' ? isCorrectAnswer : false
            };
        }) || [];



        // For SCQ, ensure only one isCorrectAnswer is true
        if (category === 'radio') {
            // Find the first correct option
            const correctOptionIndex = mappedOptions.findIndex(opt => opt.isCorrectAnswer);
            if (correctOptionIndex !== -1) {
                // Only update if we need to ensure only one is correct
                mappedOptions = mappedOptions.map((opt, index) => ({
                    ...opt,
                    isCorrectAnswer: index === correctOptionIndex,
                    selectMultiple: false
                }));
            }
        }

        // Find correct option for SCQ
        const correctOption = mappedOptions.find(opt => opt.isCorrectAnswer);

        // Map bloom taxonomy
        const bloomTaxonomyData = getBloomTaxonomyResp?.data?.filter((bloom: any) =>
            editData.bloomTaxonomyNames?.includes(bloom.id)
        ) || [];

        const editFormValues = {
            academicYearId: editData.academicYearId || '',
            curriculumId: editData.curriculumId || '',
            classId: editData.classId || '',
            subject: editData.subjectId || '',
            streamGroupId: editData.streamGroupId || "",
            // questionTitle: editData.questionTitle || '',
            questionDescription: parseJsonSafely(editData.questionDescription) || '',
            difficultyLevelId: editData.difficultyLevelId || '',
            duration: editData.duration && editData.duration + ":00" || '',
            bloomTaxonomyId: bloomTaxonomyData,
            tags: editData.tags?.join(', ') || '',
            category,
            selectedOptionId: category === 'radio' && correctOption ? correctOption.id.toString() : "",
            optionsRow: mappedOptions.length > 0 ? mappedOptions : initialValues.optionsRow,
            textSolution: parseJsonSafely(editData.textSolution) || "",
            language: '',
            sections: '',
            chapter: '',
            topic: '',
            skillType: '',
            selectMultiple: "",
        };

        return editFormValues;
    };

    const addQuestionForm = useFormik({
        initialValues,
        validationSchema: questionValidationSchema,
        onSubmit: (values) => {
            const tagArray = values.tags && values.tags.split(',')?.map((tag: string) => tag.trim());
            const bloomTaxonomyIds = Array.isArray(values.bloomTaxonomyId)
                ? values.bloomTaxonomyId?.map((item: any) => item.id)
                : values.bloomTaxonomyId ? [values.bloomTaxonomyId.id] : [];
            const selectedInstitute = instituteListResp?.data?.find((item: any) => Number(item?.id) === Number(instituteId));
            const branchName = branchListResp?.data?.find((item: any) => +item.branchId === +branchId)?.branchName;
            const branchShortName = branchListResp?.data?.find((item: any) => +item.branchId === +branchId)?.shortName;
            const curriculumName = masterCurriculumResp?.find((item: any) => +item.id === +values.curriculumId)?.curriculumName;
            const className = masterClassesResp?.find((item: any) => +item.id === +values.classId)?.className || masterClassesResp?.find((item: any) => +item.id === +values.classId)?.shortName;
            const subjectName = instSubjectNameResp?.content?.find((item: any) => +item.subjectId === +values.subject)?.subjectName;
            const questionTypeName = getQuestionTypesResp?.data?.find((item: any) => item.shortName === props.activeMenuId)?.id || "";
            const selectedStreamGroup = masterClassStreamGroupResp?.find((item: any) => +item.id === +values.streamGroupId);
            const streamGroupId = selectedStreamGroup?.id || 0;
            const streamGroupName = selectedStreamGroup?.groupName || "";
            const { data } = academicYearListResp || {};
            const currentAcademicYear = Array.isArray(data) ? data.find((year: any) => year.yearStatus?.toUpperCase() === "CURRENT") : null;
            const academicYearId = currentAcademicYear?.academicYearId ?? null;
            const academicYearName = currentAcademicYear?.academicYearName ?? "";

            // Create question options with proper boolean conversion
            const questionOptions = values.optionsRow?.map((option: any, index: number) => {
                const isCorrect = Boolean(option.isCorrectAnswer);

                let optionId;
                if (isEditMode && option.optionId) {
                    // Keep existing optionId if it's already in correct format
                    optionId = option.optionId;
                } else {
                    // Generate new optionId using helper function for maximum uniqueness
                    optionId = generateUniqueOptionId();
                }

                return {
                    optionId: optionId,
                    optionText: typeof option.optionText === 'object' ? JSON.stringify(option.optionText) : (option.optionText?.toString() || ""),
                    order: option.order || index,
                    allocatedMarks: parseFloat(option.optionMarks) || 0,
                    isCorrectAnswer: isCorrect
                };
            });
           
            const payload = {
                ...(isEditMode && editData?.id ? { id: editData.id } : {}),
                academicYearId,
                academicYearName: academicYearName,
                instituteGroupId: selectedInstitute?.instituteGroupId,
                branchId: branchId || 0,
                branchName: branchName,
                branchShortName: branchShortName,
                curriculumId: values.curriculumId || 0,
                curriculumName: curriculumName,
                classId: values.classId || 0,
                className: className,
                streamGroupId: streamGroupId,
                streamGroupName: streamGroupName,
                subjectId: values.subject || 0,
                subjectName: subjectName,
                poolId: 0,
                questionTypeId: questionTypeName || "",
                difficultyLevelId: values.difficultyLevelId || 0,
                duration: values.duration || "",
                bloomTaxonomyId: bloomTaxonomyIds,
                // questionTitle: values.questionTitle || "",
                questionDescription: typeof values.questionDescription === 'object' ? JSON.stringify(values.questionDescription) : (values.questionDescription || ""),
                questionOptions,
                textSolution: typeof values.textSolution === 'object' ? JSON.stringify(values.textSolution) : (values.textSolution || ""),
                tags: tagArray
            };


            if (isEditMode) {
                dispatch(updateQuestionBankAct(generateActionPayload("update_question_bank_repository", { id: props.id }, payload)));
            } else {
                dispatch(saveQuestionBankAct(generateActionPayload("save_question_bank_repository", undefined, payload)));
            }
        }
    });

    useEffect(() => {
        if (isEditMode && editData) {
            const editFormValues = populateEditData(editData);

            if (editFormValues) {
                addQuestionForm.setValues(editFormValues);
            }
        }
    }, [isEditMode, editData]);

    // Effect for activeMenuId changes (both add and edit modes)
    useEffect(() => {
        if (props.activeMenuId && !isEditMode) {
            // Only reset for add mode
            const newCategory = getCategoryByActiveMenuId(props.activeMenuId);

            if (addQuestionForm.values.category !== newCategory) {
                const resetValues = {
                    ...initialValues,
                    category: newCategory,
                    academicYearId: addQuestionForm.values.academicYearId,
                    curriculumId: addQuestionForm.values.curriculumId,
                    classId: addQuestionForm.values.classId,
                    subject: addQuestionForm.values.subject,
                    chapter: addQuestionForm.values.chapter,
                    topic: addQuestionForm.values.topic,
                    difficultyLevelId: addQuestionForm.values.difficultyLevelId,
                    duration: addQuestionForm.values.duration,
                    bloomTaxonomyId: addQuestionForm.values.bloomTaxonomyId,
                    // questionTitle: "",
                    questionDescription: "",
                    selectedOptionId: "",
                    optionsRow: [
                        {
                            id: generateUniqueNumber(),
                            optionId: generateUniqueOptionId(),
                            optionText: "",
                            optionMarks: "",
                            order: 0,
                            isCorrectAnswer: false,
                            selectMultiple: false
                        }
                    ],
                    textSolution: "",
                    tags: ""
                };

                addQuestionForm.setValues(resetValues);
            }
        } else if (props.activeMenuId && isEditMode) {
            // For edit mode, only update category
            const newCategory = getCategoryByActiveMenuId(props.activeMenuId);

            // Only update if category actually changed and we have form values
            if (addQuestionForm.values.category !== newCategory && addQuestionForm.values.optionsRow?.length > 0) {


                addQuestionForm.setFieldValue("category", newCategory);

                // Update options to match new category
                if (newCategory === 'radio') {
                    // For SCQ, preserve the existing correct answer, don't override
                    const currentOptions = addQuestionForm.values.optionsRow || [];
                    const updatedOptions = currentOptions.map((opt: any) => ({
                        ...opt,
                        selectMultiple: false
                    }));
                    addQuestionForm.setFieldValue("optionsRow", updatedOptions);
                } else if (newCategory === 'checkbox') {
                    // For MCQ, ensure selectMultiple matches isCorrectAnswer
                    const currentOptions = addQuestionForm.values.optionsRow || [];
                    const updatedOptions = currentOptions.map((opt: any) => ({
                        ...opt,
                        selectMultiple: opt.isCorrectAnswer
                    }));
                    addQuestionForm.setFieldValue("optionsRow", updatedOptions);
                }
            }
        }
    }, [props.activeMenuId, isEditMode, addQuestionForm]);

    useEffect(() => {
        getQuestionTypeApiCall();
        getDifficultyLevelsApiCall();
        getBloomTaxonomyApiCall();
    }, []);

    // Effect to ensure proper synchronization of checkbox values
    useEffect(() => {
        if (addQuestionForm.values.category === 'checkbox') {
            const options = addQuestionForm.values.optionsRow;
            const updatedOptions = options?.map((opt: any) => ({
                ...opt,
                selectMultiple: opt.isCorrectAnswer
            }));

            // Only update if there's a difference to avoid infinite loops
            const hasChanges = options?.some((opt: any, index: number) =>
                opt.selectMultiple !== updatedOptions[index]?.selectMultiple
            );

            if (hasChanges) {
                addQuestionForm.setFieldValue("optionsRow", updatedOptions);
            }
        }
    }, [addQuestionForm.values.optionsRow, addQuestionForm.values.category]);

    const curriculumListApiCall = () => {
        dispatch(
            getMasterCurriculumAct(
                generateActionPayload(
                    "get_master_curriculum",
                    undefined,
                    {
                        pageNo: 0,
                        pageSize: 100,
                    }
                )
            )
        );
    };

    const classListApiCall = () => {
        dispatch(
            getMasterClassesAct(
                generateActionPayload("get_master_classes", undefined)
            )
        );
    };

    
    const streamListApiCall = () => {
        if (addQuestionForm.values.classId) {
            dispatch(
                getMasterClassStreamGroupAct(
                    generateActionPayload(
                        "get_master_class_stream_group",
                        undefined,
                        {
                            classId: addQuestionForm.values.classId,
                        }
                    )
                )
            );
        }
    };

    const subjectListApicall = (otherProps?: any) => {
        const payload = {
            ...otherProps,
            pageNo: 0,
            pageSize: 100,
        };
            dispatch(
                getInstSubjectNameAct(
                    generateActionPayload(
                        "get_inst_subject_name",
                        undefined,
                        payload
                    )
                )
            );
    };

    const getQuestionTypeApiCall = (otherProps?: any) => {
        let payload = {
            ...otherProps,
        };
        dispatch(getQuestionTypesAct(generateActionPayload("get_question_types", undefined, payload)));
    };

    const getDifficultyLevelsApiCall = (otherProps?: any) => {
        let payload = {
            ...otherProps,
        };
        dispatch(getDifficultyLevelsAct(generateActionPayload("get_difficulty_levels", undefined, payload)));
    };

    const getBloomTaxonomyApiCall = (otherProps?: any) => {
        let payload = {
            ...otherProps,
        };
        dispatch(getBloomTaxonomyAct(generateActionPayload("get_bloom_taxonomy", undefined, payload)));
    };

    function renderOptionsTerms(item: any) {
        return item?.bloomLevel;
    }

    function renderValueTerms(selectedItems: any) {
        if (Array.isArray(selectedItems)) {
            return (<div className="text-truncate">
                {
                    selectedItems?.map((item, index) => {
                        return item?.bloomLevel + (index !== (selectedItems.length - 1) ? ', ' : '')
                    })
                }
            </div>)
        }
    }

    function onSelectOptionHandler(selectedOptions: any, config?: any) {
        const { name } = config;
        if (Array.isArray(selectedOptions) && selectedOptions.length > 0) {
            addQuestionForm.setFieldValue(name, selectedOptions);
        } else {
            addQuestionForm.setFieldValue(name, null);
        }
    }

    const clickMenuHandler = (e: React.MouseEvent<HTMLDivElement>) => {
        const id = (e.currentTarget as HTMLElement).getAttribute("data-id");
        if (id) {
            setActiveId(id);
        }
    };

    const selectedLanguages = addQuestionForm.values.language;

    const MenuOptions: MenuOption[] = Array.isArray(selectedLanguages)
        ? selectedLanguages?.map((lang: any) => ({
            id: lang.id,
            labelName: lang.labelName,
            customPadding: "0px 15px",
        }))
        : [];

    useEffect(() => {
        if (MenuOptions.length > 0) {
            setActiveId((prevId) => {
                const isStillValid = MenuOptions.some((item) => item.id === prevId);
                return isStillValid ? prevId : MenuOptions[0].id;
            });
        } else {
            setActiveId(null);
        }
    }, [MenuOptions]);

    useEffect(() => {
        curriculumListApiCall();
        classListApiCall();
        subjectListApicall();
    }, [instituteId]);

    useEffect(() => {
        if (addQuestionForm.values.classId) {
            streamListApiCall();
        }
    }, [addQuestionForm.values.classId]);

    function getActiveMenuComponent(menuId: string | null) {
        return QuestionCreation;
    }

    function getActiveMenuSolutionComponent(menuId: string | null) {
        switch (menuId) {
            case "textSolution":
                return TextSolution;
            case "videoSolution":
                return VideoSolution;
            default:
                return null;
        }
    }

    const activeComponent = useMemo(() => {
        const TabComponent = getActiveMenuComponent(activeId);
        return TabComponent ? (
            <TabComponent
                activeId={activeId}
                selectedCategory={addQuestionForm.values.category}
                parentForm={addQuestionForm}
                parentFormHelpers={addQuestionForm}
                activeMenuId={props.activeMenuId}
                isEditMode={isEditMode}
            />
        ) : null;
    }, [activeId, addQuestionForm, props.activeMenuId, isEditMode]);
    const MenuSolutionOptions: Array<MenuOption> = [
        {
            id: "textSolution",
            labelName: "Text Solution",
            customPadding: "5px 5px 5px 5px",
        },
        {
            id: "videoSolution",
            labelName: "Attach Solution",
            customPadding: "5px 5px 5px 5px",
        },
    ];

    function clickMenuSolutionHandler(event: React.MouseEvent<HTMLElement>) {
        const { currentTarget } = event,
            menuId = currentTarget.getAttribute("data-id");
        setActiveSolutionId(menuId);
    }

    const activeSolution = useMemo(() => {
        const TabComponent: any = getActiveMenuSolutionComponent(activeSolutionId);
        return (
            <TabComponent
                activeId={activeSolutionId}
                parentForm={addQuestionForm}
                parentFormHelpers={addQuestionForm}
                isEditMode={isEditMode}
            />
        );
    }, [activeSolutionId, addQuestionForm, instituteId, branchId, props.activeMenuId, isEditMode]);

    const curriculumTypes = Array.isArray(masterCurriculumResp)
        ? masterCurriculumResp
        : [];

    const classTypes = Array.isArray(masterClassesResp)
        ? masterClassesResp
        : [];

    const streamGroupTypes = Array.isArray(masterClassStreamGroupResp)
        ? masterClassStreamGroupResp
        : [];

    const subjectTypes = Array.isArray(instSubjectNameResp?.content)
        ? instSubjectNameResp.content
        : [];
       
        
  const selectedClass = masterClassesResp?.find(
    (item: any) =>
      Number(item.id) === Number(addQuestionForm.values.classId)
  );

  const showStreamGroup =
    selectedClass?.classSequence === 14 ||
    selectedClass?.classSequence === 15;

    return (
        <>
            <div className="card-body px-0">
                <div className='row'>
                    <div className='col-12 pe-3'>
                        <div className='row gx-3'>

                            <div className='col-12' >
                                <div style={{ position: "relative", display: "inline-block", width: "100%", paddingBottom: "12px", paddingTop: "20px", paddingLeft: "20px", paddingRight: "20px", border: "1px solid #CED4DA", borderRadius: "6px", marginBottom: "20px", }}>
                                    <p className='fs-12' style={{ position: "absolute", top: "-11px", padding: "0px 10px", color: "#495057", paddingBottom: "15px", backgroundColor: "white", }}><HugeiconsIcon icon={SettingDone02Icon} size={13} /> Question Entry Settings </p>
                                    <div className="row px-2 gx-3 my-2">
                                        <div className='col-12 mb-2'>
                                            <h4 className="fs-12  fw-normal">
                                                Curriculum Map
                                            </h4>
                                        </div>
                                        {/* <div className="col-6 col-md-4 col-lg-2 ">
                                            <SelectInput
                                                name="academicYearId"
                                                value={addQuestionForm.values.academicYearId}
                                                onChange={addQuestionForm.handleChange}
                                                menuItems={academicYearListResp?.data}
                                                valueKey="academicYearId"
                                                textKey="academicYearName"
                                                formgroupClassName='mb-3'
                                                inputClassName=""
                                                labelText='Academic Year'
                                                floatingLabel
                                                invalid={(addQuestionForm.touched.academicYearId && addQuestionForm.errors.academicYearId) ? true : false}
                                                error={(addQuestionForm.touched.academicYearId && addQuestionForm.errors.academicYearId) ? addQuestionForm.errors.academicYearId : ""}
                                            />
                                        </div> */}
                                        <div className="col-6 col-md-4 col-lg-2 ">
                                            <SelectInput
                                                name="curriculumId"
                                                value={addQuestionForm.values.curriculumId}
                                                onChange={addQuestionForm.handleChange}
                                                menuItems={curriculumTypes}
                                                valueKey="id"
                                                textKey="curriculumName"
                                                formgroupClassName='mb-3'
                                                inputClassName=""
                                                labelText='Curriculum'
                                                labelClass='required'
                                                floatingLabel
                                                invalid={(addQuestionForm.touched.curriculumId && addQuestionForm.errors.curriculumId) ? true : false}
                                                error={(addQuestionForm.touched.curriculumId && addQuestionForm.errors.curriculumId) ? addQuestionForm.errors.curriculumId : ""}
                                            />
                                        </div>
                                        {addQuestionForm.values.curriculumId && (
                                            <div className="col-6 col-md-4 col-lg-2">
                                                <SelectInput
                                                    name="classId"
                                                    value={addQuestionForm.values.classId}
                                                    onChange={addQuestionForm.handleChange}
                                                    menuItems={classTypes}
                                                    valueKey="id"
                                                    textKey="shortCode"
                                                    defaultSelect="Class"
                                                    formgroupClassName='mb-3'
                                                    inputClassName=""
                                                    labelText='Class'
                                                    labelClass='required'
                                                    floatingLabel
                                                    invalid={(addQuestionForm.touched.classId && addQuestionForm.errors.classId) ? true : false}
                                                    error={(addQuestionForm.touched.classId && addQuestionForm.errors.classId) ? addQuestionForm.errors.classId : ""}
                                                />
                                            </div>
                                        )}
                                        {showStreamGroup && (
                        <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                            <SelectInput
                                name="streamGroupId"
                                value={addQuestionForm.values.streamGroupId}
                                onChange={addQuestionForm.handleChange}
                                menuItems={streamGroupTypes}
                                valueKey="id"
                                textKey="groupName"
                                labelText="Stream"
                                floatingLabel
                            />
                        </div>
                    )}
                                        {addQuestionForm.values.classId && (
                                            <div className="col-6 col-md-4 col-lg-2">
                                                <SelectInput
                                                    name="subject"
                                                    value={addQuestionForm.values.subject}
                                                    onChange={addQuestionForm.handleChange}
                                                    menuItems={subjectTypes}
                                                    valueKey="id"
                                                    textKey="subjectName"
                                                    defaultSelect="Subject"
                                                    formgroupClassName='mb-3'
                                                    inputClassName=""
                                                    labelText='Subject'
                                                    labelClass='required'
                                                    floatingLabel
                                                    invalid={(addQuestionForm.touched.subject && addQuestionForm.errors.subject) ? true : false}
                                                    error={(addQuestionForm.touched.subject && addQuestionForm.errors.subject) ? addQuestionForm.errors.subject : ""}
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <div className='row px-2 gx-3 mb-2'>
                                        <div className='col-12 '>
                                            <h4 className="fs-12 mb-3 fw-normal">
                                                Question Parameters
                                            </h4>
                                        </div>
                                        <div className='col-6 col-md-4 col-lg-2 '>
                                            <SelectInput
                                                name="difficultyLevelId"
                                                value={addQuestionForm.values.difficultyLevelId}
                                                onChange={addQuestionForm.handleChange}
                                                menuItems={getDifficultyLevelsResp?.data}
                                                valueKey="id"
                                                textKey="difficultyLevel"
                                                formgroupClassName='mb-0'
                                                inputClassName=''
                                                labelText='Difficulty'
                                                labelClass='required'
                                                floatingLabel
                                                invalid={(addQuestionForm.touched.difficultyLevelId && addQuestionForm.errors.difficultyLevelId) ? true : false}
                                                error={(addQuestionForm.touched.difficultyLevelId && addQuestionForm.errors.difficultyLevelId) ? addQuestionForm.errors.difficultyLevelId : ""}
                                            />
                                        </div>
                                        <div className='col-6 col-md-4 col-lg-2'>
                                            <SelectInput
                                                name="duration"
                                                value={addQuestionForm.values.duration}
                                                onChange={addQuestionForm.handleChange}
                                                menuItems={timeLevels}
                                                valueKey="id"
                                                textKey="shortName"
                                                formgroupClassName='mb-0'
                                                inputClassName=''
                                                labelClass='required'
                                                labelText='Time'
                                                floatingLabel
                                                invalid={(addQuestionForm.touched.duration && addQuestionForm.errors.duration) ? true : false}
                                                error={(addQuestionForm.touched.duration && addQuestionForm.errors.duration) ? addQuestionForm.errors.duration : ""}
                                            />
                                        </div>
                                        <div className='col-6 col-md-4 col-lg-4'>
                                            <MultiSelectCheckbox
                                                name="bloomTaxonomyId"
                                                idKey="id"
                                                value={addQuestionForm.values.bloomTaxonomyId}
                                                onChange={onSelectOptionHandler}
                                                options={getBloomTaxonomyResp?.data}
                                                searchKey="className"
                                                labelClass='required'
                                                renderValue={renderValueTerms}
                                                renderOptions={renderOptionsTerms}
                                                invalid={addQuestionForm.touched.bloomTaxonomyId && addQuestionForm.errors.bloomTaxonomyId ? true : false}
                                                error={addQuestionForm.touched.bloomTaxonomyId && addQuestionForm.errors.bloomTaxonomyId ? String(addQuestionForm.errors.bloomTaxonomyId) : ""}
                                            />
                                        </div>
                                        <div className='col-6 col-md-4 col-lg-2'>
                                            <TextInput
                                                name="tags"
                                                value={addQuestionForm.values.tags}
                                                onChange={addQuestionForm.handleChange}
                                                formgroupClassName='mb-0'
                                                inputClassName=''
                                                labelText='Tags'
                                                labelClass='required'
                                                floatingLabel
                                                invalid={(addQuestionForm.touched.tags && addQuestionForm.errors.tags) ? true : false}
                                                error={(addQuestionForm.touched.tags && addQuestionForm.errors.tags) ? addQuestionForm.errors.tags : ""}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='col-12'>
                                <div style={{ position: "relative", display: "inline-block", width: "100%", paddingBottom: "12px", paddingTop: "20px", paddingLeft: "20px", paddingRight: "20px", border: "1px solid #CED4DA", borderRadius: "6px", marginBottom: "20px", }}>
                                    <p className='fs-12' style={{ position: "absolute", top: "-11px", padding: "0px 10px", color: "#495057", paddingBottom: "15px", backgroundColor: "white", }}> Question Panel </p>
                                    <div className='col-12'>
                                        <div className="card-body py-0 lms_horizontal_tab">
                                            <div className="row">
                                                <div className="col-12 pt-3 d-flex justify-content-start pt-md-0 px-4 px-md-0">
                                                    <UpdatedHorizontalTab
                                                        MenuOptions={MenuOptions}
                                                        clickMenuHandler={clickMenuHandler}
                                                        activeTabId={activeId}
                                                        horizontalClass="ps-0 mb-1 use-small-font"
                                                    />
                                                </div>
                                            </div>
                                            <div className='row'>
                                                {activeComponent}
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col-12'>
                                        <div className="card-body pt-0 lms_horizontal_tab">
                                            <div className="row">
                                                <div className="col-12 pt-3 d-flex justify-content-end pt-md-0 px-4 px-md-0">
                                                    <UpdatedHorizontalTab
                                                        MenuOptions={MenuSolutionOptions}
                                                        clickMenuHandler={clickMenuSolutionHandler}
                                                        activeTabId={activeSolutionId}
                                                        horizontalClass="ps-0 mb-2 use-small-font"
                                                    />
                                                </div>
                                            </div>
                                            <div className='row'>
                                                {activeSolution}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {!isCreateAssessment && (
                                <div className='col-12'>
                                    <div className='d-flex justify-content-between mt-3 mb-2'>
                                        <div className='d-flex ms-auto'>
                                            <div>
                                                <button className='btn btn-light fs-12 mx-2 ' onClick={(e: any) => history.push("/question-bank")}>Cancel</button>
                                            </div>
                                            <div>
                                                <button className='btn btn-success fs-12 mx-2 ' onClick={(e: any) => addQuestionForm.submitForm()}>
                                                    {isEditMode ? 'Update' : 'Save'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <ModalContainerUpdated
                id="add-examination"
                isOpen={fetchQuestionsState.showModal}
                toggle={() => closeFetchQuestionsModal()}
                modalTitle="Preview Question"
                modalSize="lg"
            >
                <PreviewQuestion
                    id={fetchQuestionsState.modalData}
                    isOpen={false}
                    toggle={() => closeFetchQuestionsModal()}
                    modalTitle="Preview Question"
                />
            </ModalContainerUpdated>
        </>
    )
}

export default CreateQuestionBank