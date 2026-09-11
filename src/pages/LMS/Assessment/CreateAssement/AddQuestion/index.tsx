import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useFormik } from 'formik';
import { StepperFormContext, TABS_ACTIONS } from '../helper';
// import AllQuestions from './AllQuestions';
// import ViewQuestions from './ViewQuestions';
import { DropDownToggle, ModalContainerUpdated, SearchInput, SelectInput } from '../../../../../Components/Common';
import { useAppDispatch, useAppSelector } from '../../../../../hooks/storehook';
import { shallowEqual } from 'react-redux';
import AddNewQuestionModal from './AddNewQuestionModal';
import { HugeiconsIcon } from '@hugeicons/react';
import { Add01Icon, BookUploadIcon, Cancel01Icon, EyeIcon } from '@hugeicons-pro/core-stroke-standard';
import { useModal } from '../../../../../hooks/modalhook';
import { getAssessmentCodeByIdAct, getAssessmentQuestionsByIdAct, getQuestionBankAct, resetAssessmentByIdAct, resetAssessmentQuestionsByIdAct, resetQuestionBankAct, resetSaveBasicAssessmentAct, saveAssessmentQuestionsAct } from '../../../../../store/lms/lmsAssessment/lmsAssessmentaction';
import { generateActionPayload } from '../../../../../utility/reduxutility';
import AllQuestions from './AllQuestionsNew';
import ViewQuestions from './ViewQuestionsNew';
import { toast } from 'react-toastify';
import { sourceOptions } from './helper';
import { getBloomTaxonomyAct, getDifficultyLevelsAct, getQuestionTypesAct } from '../../../../../store/lms/lmssettings/lmssettingsaction';
import { useFilterState } from '../../../../../hooks/filterhook';
import { useHistory } from 'react-router-dom';
import { BubbleChatQuestionIcon } from '@hugeicons-pro/core-solid-standard';
import { ArrowRight03Icon, ArrowLeft03Icon } from '@hugeicons-pro/core-stroke-standard';

interface MenuOption {
    id: string;
    labelName: string;
    customPadding: string;
};

const initialValues = {
    searchString: "",
    curriculumId: '',
    classId: '',
    subject: "",
    chapter: '',
    topic: '',
    bloom: '',
    difficulty: '',
    source: '',
    type: '',
};

const AddAssessmentQuestion = (props: any) => {
    const [selectedStudentData, setSelectedStudentData] = useState([]);
    const history = useHistory();
    const [selectAllFunction, setSelectAllFunction] = useState<(() => void) | null>(null);
    const dispatch = useAppDispatch();
    const paginationDetailRef = useRef({
        pageNo: 0,
        pageSize: 30,
    })
    const { showClearFilterState, advanceFilterChange } = useFilterState();
    const [previewAllHandler, setPreviewAllHandler] = useState<(() => void) | null>(null);



    const { closeModal: closeFetchQuestionsModal, modalState: fetchQuestionsState, openModal: openFetchQuestionsModal } = useModal();
    const { closeModal: closeAddFetchQuestionsModal, modalState: fetchAddQuestionsState, openModal: openFetchAddQuestionsModal } = useModal();

    const {
        academicYearListResp,
        brchCurriculumResp,
        branchClassResp,
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        showApiLoader,
        getAssessmentByIdResp,
        saveAssessmentQuestionsResp,
        saveBasicAssessmentResp,
        getAssessmentQuestionsByIdResp,
        getQuestionBankResp,
        getQuestionTypesResp,
        getDifficultyLevelsResp,
        getBloomTaxonomyResp,

    } = useAppSelector(
        ({ instAcademics, globalData, branchAcademics, appData, classSubjectsInfo, directoryEmployee, branch, lmsAssessment, lmsSettings }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            branchClassResp: branchAcademics.branchClassResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            showApiLoader: globalData.showApiLoader,
            getAssessmentByIdResp: lmsAssessment.getAssessmentByIdResp,
            saveAssessmentQuestionsResp: lmsAssessment.saveAssessmentQuestionsResp,
            saveBasicAssessmentResp: lmsAssessment.saveBasicAssessmentResp,
            getAssessmentQuestionsByIdResp: lmsAssessment.getAssessmentQuestionsByIdResp,
            getQuestionBankResp: lmsAssessment.getQuestionBankResp,
            getQuestionTypesResp: lmsSettings.getQuestionTypesResp,
            getDifficultyLevelsResp: lmsSettings.getDifficultyLevelsResp,
            getBloomTaxonomyResp: lmsSettings.getBloomTaxonomyResp,

        }),
        shallowEqual
    );
    const addQuestionForm = useFormik({
        initialValues,
        onSubmit: (values) => { }
    });

    const { submitCurrentFormCllbck } = useContext<any>(StepperFormContext);

    function getQuestionbankApiCall(otherProps?: any) {
        const { branchId, academicYearId, branchCurriculumId, classId, subjectId } = getAssessmentByIdResp || {};
        const payload = {
            branchId,
            // academicYearId: academicYearId,
            curriculumId: branchCurriculumId,
            classId: classId,
            subjectId: subjectId,
            questionTypeId: addQuestionForm.values.type,
            difficultyLevelId: addQuestionForm.values.difficulty,
            bloomTaxonomyIds: addQuestionForm.values.bloom,
            ...otherProps,
            ...paginationDetailRef.current
        }
        if (payload.branchId && payload.curriculumId && payload.classId && payload.subjectId) {
            dispatch(getQuestionBankAct(generateActionPayload("get_question_bank_repository", undefined, payload)));
        }
    }

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
    function previousBtnHndlr(e: any) {
        submitCurrentFormCllbck(["basic_details"], TABS_ACTIONS.PREVIOUS_TAB);
        if (saveBasicAssessmentResp?.data) {
            dispatch(getAssessmentCodeByIdAct(generateActionPayload("get_assessment_by_id", { id: saveBasicAssessmentResp?.data }, {})));
        }
    }

    useEffect(() => {
        if (saveBasicAssessmentResp?.data) {
            dispatch(getAssessmentQuestionsByIdAct(generateActionPayload("get_assessment_questions_by_id", { id: saveBasicAssessmentResp?.data }, {})));
            dispatch(getAssessmentCodeByIdAct(generateActionPayload("get_assessment_by_id", { id: saveBasicAssessmentResp?.data }, {})));
            getQuestionbankApiCall();
        }
    }, [saveBasicAssessmentResp]);


    useEffect(() => {
        getQuestionTypeApiCall();
        getBloomTaxonomyApiCall();
        getDifficultyLevelsApiCall();
        return () => {
            dispatch(resetQuestionBankAct(undefined));
            dispatch(resetAssessmentByIdAct(undefined));
            dispatch(resetAssessmentQuestionsByIdAct(undefined));
            // dispatch(resetSaveBasicAssessmentAct(undefined));
        }
    }, [])

    useEffect(() => {
        if (props.id) {
            dispatch(getAssessmentQuestionsByIdAct(generateActionPayload("get_assessment_questions_by_id", { id: props.id }, {})));
            getQuestionbankApiCall();
        }
    }, [props.id]);
    function submitHndlr() {
        // Create payload with custom marks if available, otherwise calculated marks
        const payload = selectedStudentData?.map((item: any, index: number) => {

            let finalMarks = item.customMarks;

            if (!finalMarks && item.customMarks === undefined) {
                finalMarks = item.marks
            }

            if (!finalMarks && item.questionOptions && Array.isArray(item.questionOptions)) {
                finalMarks = item.questionOptions.reduce((sum: number, option: any) =>
                    sum + (option.allocatedMarks ?? 0), 0) || 0;
            }


            return {
                questionId: item.id,
                marks: finalMarks, // Use final calculated marks
                questionOrder: (index + 1).toString() // Order based on array position
            };
        });

        dispatch(saveAssessmentQuestionsAct(generateActionPayload("save_assessment_questions", { id: getAssessmentByIdResp?.id }, payload)));

        if (selectedStudentData.length >= 5) {
            submitCurrentFormCllbck("assign", TABS_ACTIONS.PARTICULAR_TAB);
        }
        else {
            toast.error("Please select at least 5 questions");
        }
    }

    const dropDownOption = useMemo(() => [
        // {
        //     id: "add-single-book",
        //     actionName: "Create Question",
        //     actionIcon: <HugeiconsIcon icon={Add01Icon} className="me-2 text-muted" size={20} />,
        //     onClickHndlr: () => { openFetchAddQuestionsModal() }
        // },
        {
            id: "upload-bulk-book",
            actionName: "Choose from Pool",
            actionIcon: <HugeiconsIcon icon={BookUploadIcon} className="me-2 text-muted" size={18} />,
            onClickHndlr: (event: any) => { openFetchQuestionsModal() }
        },
    ], [])

    const handleChange = (event: any) => {
        const { name, value } = event.target;
        if (name === "type") {
            addQuestionForm.setValues((prev: any) => ({ ...prev, [name]: value }));
            // getQuestionbankApiCall({ questionTypeId : value });
        }
        else if (name === "difficulty") {
            addQuestionForm.setValues((prev: any) => ({ ...prev, [name]: value }));
            // getQuestionbankApiCall({ difficultyLevelId : value });
        }
        else if (name === "bloom") {
            addQuestionForm.setValues((prev: any) => ({ ...prev, [name]: value }));
            // getQuestionbankApiCall({ bloomTaxonomyIds : value });
        }
        advanceFilterChange({
            keys: { ...addQuestionForm.values, [name]: value },
            ignoredKeys: [],
        });
    }

    // useEffect(() => {
    //     if (getAssessmentByIdResp) {
    //         getQuestionbankApiCall();
    //     }
    // }, [getAssessmentByIdResp])

    const handleApplyAll = () => {
        getQuestionbankApiCall();
    }

    const clearFilterHndlr = () => {
        if (academicYearListResp) {
            paginationDetailRef.current = { ...paginationDetailRef.current, pageNo: 0 }
            let { academicYearId } = academicYearListResp?.data?.find((year: any) => year.yearStatus.toLowerCase() === "current") || {};
            addQuestionForm.setValues({ ...initialValues })
            getQuestionbankApiCall({ ...initialValues })
            advanceFilterChange({ keys: { ...initialValues }, ignoredKeys: [] });
        }
    };

    // Handle Select All button click
    const handleSelectAllClick = () => {
        if (selectAllFunction) {
            selectAllFunction();
        } else {
            toast.warning("Please wait for questions to load before selecting all.");
        }
    };
    // const totalMarks = useMemo(() => {
    //     return selectedStudentData.reduce((sum: number, q: any) => {
    //         // Use custom marks if available, otherwise use calculated marks
    //         const questionMarks = q.customMarks !== undefined
    //             ? q.customMarks
    //             : q.questionOptions?.reduce((optionSum: number, option: any) =>
    //                 optionSum + (option.allocatedMarks ?? 0), 0) || 0;
    //         return sum + questionMarks;
    //     }, 0);
    // }, [selectedStudentData]);

    const totalMarks = useMemo(() => {
        return selectedStudentData.reduce((sum: number, q: any) => {

            let questionMarks = 0;

            if (q.customMarks !== undefined) {
                // Use custom marks if available
                questionMarks = q.customMarks;
            } else if (q.marks !== undefined && q.marks > 0) {
                // Use direct marks field from API response
                questionMarks = q.marks;
            } else if (q.questionOptions && Array.isArray(q.questionOptions)) {
                // Calculate from questionOptions if available
                questionMarks = q.questionOptions.reduce((optionSum: number, option: any) =>
                    optionSum + (option.allocatedMarks ?? 0), 0);
            }

            return sum + questionMarks;
        }, 0);
    }, [selectedStudentData]);



    // Callback to receive the select all function from AllQuestions
    const handleSelectAllCallback = (selectAllFn: () => void) => {
        setSelectAllFunction(() => selectAllFn);
    };

    const handleOpenPreviewAllFromParent = (handler) => {
        setPreviewAllHandler(() => handler);
    };
    const handleRemoveAll = () => {
        setSelectedStudentData([]);
        toast.success("All questions removed from assessment!");
    };
    return (
        <>
            <div className='card h-100 mb-0' style={{ borderRadius: "10px" }}>
                <div className='card-header' style={{
                    borderTopLeftRadius: "10px",
                    borderTopRightRadius: "10px",
                    padding: "20px"
                }}>
                    <div className='d-flex align-items-center' style={{ gap: "16px" }}>
                        <div style={{
                            width: "48px",
                            height: "48px",
                            backgroundColor: "#CBF3EF",
                            borderRadius: "12px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0
                        }}>
                            <HugeiconsIcon
                                icon={BubbleChatQuestionIcon}
                                size={24}
                                color="#0AB39C"

                            />
                        </div>
                        <div className='d-grid'>
                            <h4 className='mb-1' style={{
                                fontSize: "18px",
                                fontWeight: "600",
                                color: "#333",
                                lineHeight: "1.3"
                            }}>
                                Step 2: Add Questions
                            </h4>
                            <span className='text-muted' style={{
                                fontSize: "14px",
                                color: "#6c757d",
                                lineHeight: "1.4"
                            }}>
                                Provide the question for assessment.
                            </span>
                        </div>
                    </div>
                </div>
                <div className='card-body'>

                    <div className='row px-3'>
                        <div className=''>
                            <div className="px-0 pb-0 lms_horizontal_tab">
                                <div className='row'>
                                    <div className='card-body mb-4 border tw-border-gray-200 tw-rounded !tw-py-1 bg-light'>
                                        <div className="row gx-3 px-2 gy-2 ">
                                            <div className='col-12'>
                                                <h5 className='py-3'>
                                                    Filter Questions
                                                </h5>
                                            </div>
                                        </div>
                                        <div className="row gx-3 gy-2 px-2 pb-3 examination">
                                            <div className='col-xs-12 col-md-12 col-lg-3 col-xl-2'>
                                                <SelectInput
                                                    name="source"
                                                    value={addQuestionForm.values.source}
                                                    onChange={addQuestionForm.handleChange}
                                                    menuItems={[]}
                                                    valueKey="id"
                                                    textKey="name"
                                                    labelText='Source'
                                                    formgroupClassName="mb-1"
                                                    labelClass='required'
                                                    inputClassName='bg-light'
                                                    defaultSelect='Question Bank'
                                                    defaultValue='questionBank'
                                                    floatingLabel
                                                />
                                            </div>
                                            <div className='col-xs-12 col-md-12 col-lg-3 col-xl-2'>
                                                <SelectInput
                                                    name="type"
                                                    value={addQuestionForm.values.type}
                                                    onChange={handleChange}
                                                    menuItems={getQuestionTypesResp?.data || []}
                                                    valueKey="id"
                                                    textKey="shortName"
                                                    labelText='Question Type'
                                                    formgroupClassName="mb-1"
                                                    inputClassName='bg-light'
                                                    floatingLabel
                                                />
                                            </div>
                                            <div className='col-xs-12 col-md-12 col-lg-3 col-xl-2'>
                                                <SelectInput
                                                    name="difficulty"
                                                    value={addQuestionForm.values.difficulty}
                                                    onChange={handleChange}
                                                    menuItems={getDifficultyLevelsResp?.data || []}
                                                    valueKey="id"
                                                    textKey="difficultyLevel"
                                                    labelText='Difficulty Level'
                                                    formgroupClassName="mb-1"
                                                    inputClassName='bg-light'
                                                    floatingLabel
                                                />
                                            </div>
                                            <div className='col-xs-12 col-md-12 col-lg-3 col-xl-2'>
                                                <SelectInput
                                                    name="bloom"
                                                    value={addQuestionForm.values.bloom}
                                                    onChange={handleChange}
                                                    menuItems={getBloomTaxonomyResp?.data || []}
                                                    valueKey="id"
                                                    textKey="bloomLevel"
                                                    labelText='Bloom Taxonomy'
                                                    formgroupClassName="mb-1"
                                                    inputClassName='bg-light'
                                                    floatingLabel
                                                />
                                            </div>

                                            <div className='col-auto ms-auto tw-flex tw-justify-end mt-4'>
                                                <button onClick={handleApplyAll}>
                                                    <div className="btn btn-primary px-4 py-2" style={{ borderRadius: "7px" }}>Apply All</div>
                                                </button>
                                            </div>
                                            {showClearFilterState && (
                                                <div className="col-auto d-flex">
                                                    <button
                                                        type="button"
                                                        onClick={clearFilterHndlr}
                                                        className="btn btn-ghost-danger"
                                                    >
                                                        Clear filter
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="col-6 !tw-ps-0">
                                        <div className='tw-border tw-border-gray-200 tw-rounded-lg tw-shadow-lg'>
                                            <div className="card-title mb-0 tw-border-gray-200 tw-border-b-2">
                                                <div className='row px-4'>
                                                    <p className='tw-font-semibold tw-p-4 tw-pb-2 tw-mb-0 col-auto'>
                                                        Questions List </p>
                                                    <div className='col-auto ms-auto tw-flex tw-items-center tw-justify-center'>
                                                        <div className=' tw-flex tw-justify-center tw-items-center text-muted tw-text-sm'>
                                                            {getQuestionBankResp?.totalElements || 0} questions available
                                                        </div>
                                                    </div>

                                                </div>
                                                <div className='row px-4 mb-2'>
                                                    <div className="col-auto my-auto !tw-pl-0">
                                                        <button
                                                            type="button"
                                                            className="btn text-success fs-14 fw-bold"
                                                            onClick={handleSelectAllClick}
                                                        >
                                                            Select All
                                                        </button>
                                                    </div>

                                                </div>
                                            </div>
                                            <div className='tw-p-0 tw-pt-0 tw-pb-0 '>

                                                <AllQuestions
                                                    id={fetchQuestionsState.modalData}
                                                    isOpen={false}
                                                    // toggle={() => closeFetchQuestionsModal()}
                                                    modalTitle="Create Question"
                                                    data={getAssessmentByIdResp}
                                                    getQuestionbankApiCall={getQuestionbankApiCall}
                                                    paginationDetailRef={paginationDetailRef}
                                                    setSelectedStudentData={setSelectedStudentData}
                                                    selectedStudentData={selectedStudentData}
                                                    onSelectAll={handleSelectAllCallback}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-6 !tw-pe-0">
                                        <div className='tw-border tw-border-gray-200 h-100 tw-rounded-lg tw-shadow-lg'>
                                            {/* <h4 className="card-title mb-0 pb-2 tw-border-gray-200 tw-border-b-2">Selected Questions</h4> */}
                                            <div className="card-title mb-0 tw-border-gray-200 tw-border-b-2 row">
                                                <p className='tw-font-semibold w-100 p-3 tw-mb-0 d-flex col-auto'>
                                                    Selected Questions
                                                    {selectedStudentData.length > 0 && (
                                                        <div className="ms-auto !tw-pl-0">
                                                            <button
                                                                type="button"
                                                                className="btn text-success p-0 me-3"
                                                                onClick={() => previewAllHandler && previewAllHandler()}
                                                            >
                                                                <HugeiconsIcon icon={EyeIcon} className="me-2" size={18} /> Preview
                                                            </button>
                                                            <button
                                                                type="button"
                                                                className="btn text-danger p-0"
                                                                onClick={handleRemoveAll}
                                                            >
                                                                <HugeiconsIcon icon={Cancel01Icon} size={18} /> Remove All
                                                            </button>
                                                        </div>
                                                    )}
                                                </p>
                                                <div className='row px-4 mb-1'>
                                                    <div className="d-flex col-auto px-2 pb-3 !tw-pl-0">
                                                        <h4 className="text-muted mb-0 fs-13 me-2">
                                                            {selectedStudentData.length.toString().padStart(2, "0")} Total Questions
                                                        </h4>
                                                        <span className="text-muted me-2" style={{ fontSize: '14px', lineHeight: '1' }}>•</span>
                                                        <h4 className="text-muted mb-0 fs-13">
                                                            {totalMarks.toString().padStart(2, "0")} Total Marks
                                                        </h4>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className='tw-p-0 tw-pt-0 tw-pb-0'>

                                                <ViewQuestions
                                                    selectedStudentData={selectedStudentData}
                                                    setSelectedStudentData={setSelectedStudentData}
                                                    getAssessmentQuestionsByIdResp={getAssessmentQuestionsByIdResp}
                                                    getQuestionBankResp={getQuestionBankResp}
                                                    onPreviewAll={handleOpenPreviewAllFromParent}
                                                />

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row my-3">
                        <div className="col-12 d-flex justify-content-between mt-3">
                            <button
                                type="button"
                                style={{ borderRadius: "8px" }}
                                className="btn btn-outline-primary mx-2 px-4 py-2 d-flex align-items-center"
                                onClick={previousBtnHndlr}
                            >
                                <HugeiconsIcon
                                    icon={ArrowLeft03Icon}
                                    size={20}
                                    strokeWidth={1.5}
                                    style={{ color: "currentColor" }}
                                    className="me-2"
                                />

                                Previous
                            </button>

                            <div className=''>
                                <button type='button' className="btn btn-light px-4 py-2 h-100" onClick={() => { history.push("/assessment-list") }} style={{ borderRadius: "8px" }}>Cancel</button>
                                <button
                                    type="button"
                                    className="btn btn-success px-4 py-2 ms-3"
                                    onClick={submitHndlr}
                                    style={{ borderRadius: "8px" }}
                                    disabled={showApiLoader}
                                >
                                    Save & Next<HugeiconsIcon
                                        icon={ArrowRight03Icon}
                                        size={24}
                                        color="#fafafa"
                                        className='ms-1'
                                    />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ModalContainerUpdated
                id="add-examination"
                isOpen={fetchAddQuestionsState.showModal}
                toggle={() => closeAddFetchQuestionsModal()}
                modalTitle="Create Question"
                modalSize="xl"
            >
                <AddNewQuestionModal
                    id={fetchAddQuestionsState.modalData}
                    isOpen={false}
                    toggle={() => closeAddFetchQuestionsModal()}
                    modalTitle="Create Question"
                />
            </ModalContainerUpdated>
            <ModalContainerUpdated
                id="add-examination"
                isOpen={fetchQuestionsState.showModal}
                toggle={() => closeFetchQuestionsModal()}
                modalTitle="Choose from Pool"
                modalSize="xl"
            >
                <AllQuestions
                    id={fetchQuestionsState.modalData}
                    isOpen={false}
                    toggle={() => closeFetchQuestionsModal()}
                    modalTitle="Create Question"
                    data={getAssessmentByIdResp}
                    getQuestionbankApiCall={getQuestionbankApiCall}
                    paginationDetailRef={paginationDetailRef}
                    setSelectedStudentData={setSelectedStudentData}
                    selectedStudentData={selectedStudentData}
                    onSelectAll={handleSelectAllCallback}
                />
            </ModalContainerUpdated>
        </>
    )
}

export default AddAssessmentQuestion