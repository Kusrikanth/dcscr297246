import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import TableContainer from "../../../../../../Components/Common/TableContainer";
import { generateColumns } from "./helper";
import { HugeiconsIcon } from "@hugeicons/react";
import { EyeIcon, } from "@hugeicons-pro/core-stroke-standard";
import { useFormik } from "formik";
import { useAppDispatch, useAppSelector } from "../../../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { ModalContainerUpdated, SelectInput, TextInput } from "../../../../../../Components/Common";
import { chapterList, difficultyLevels, subjectList, topicList } from "../helper";
import Pagination, { IPaginationState } from "../../../../../../Components/Common/Pagination";
import { toast } from "react-toastify";
import QuestionCardList from "./QuestionList";
import { generateActionPayload } from "../../../../../../utility/reduxutility";
import { getQuestionBankByIdAct } from "../../../../../../store/lms/lmsAssessment/lmsAssessmentaction";
import { useModal } from "../../../../../../hooks/modalhook";
import PreviewQuestion from "./PreviewQuestion";

const initialValues = {
    searchString: "",
    curriculumId: '',
    classId: '',
    subjectId: "",
    chapter: '',
    topic: '',
    bloom: '',
    difficulty: '',
};

const AllQuestions = (props: any) => {
    const { branchCurriculumId, classId, subjectId } = props.data || {};
    const dispatch = useAppDispatch();
    const { closeModal: closeFetchQuestionsModal, modalState: fetchQuestionsState, openModal: openFetchQuestionsModal } = useModal();

    const [studentData, setStudentData] = useState<any>([]);
    const [allStudentSelectedState, setAllStudentSelectedState] = useState(false);
    const [searchString, setSearchString] = useState("");

    const addQuestionForm = useFormik({
        initialValues,
        onSubmit: (values) => { }
    });

    const {
        academicYearListResp,
        brchCurriculumResp,
        branchClassResp,
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        showApiLoader,
        assignedClassSubjectsListResp,
        getQuestionBankResp
    } = useAppSelector(
        ({ instAcademics, globalData, branchAcademics, appData, classSubjectsInfo, lmsAssessment }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            branchClassResp: branchAcademics.branchClassResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            showApiLoader: globalData.showApiLoader,
            assignedClassSubjectsListResp: classSubjectsInfo.assignedClassSubjectsListResp,
            getQuestionBankResp: lmsAssessment.getQuestionBankResp
        }),
        shallowEqual
    );

    useEffect(() => {
        if (props.data) {
            addQuestionForm.setFieldValue("curriculumId", branchCurriculumId);
            addQuestionForm.setFieldValue("classId", classId);
            addQuestionForm.setFieldValue("subjectId", subjectId);
        }
    }, [])

    // Modified useEffect to handle already selected questions
    useEffect(() => {
        if (getQuestionBankResp?.content) {
            const selectedQuestionIds = props.selectedStudentData?.map((item: any) => item.id) || [];

            const data = getQuestionBankResp.content.map((item: any) => {
                const isAlreadySelected = selectedQuestionIds.includes(item.id);
                return {
                    ...item,
                    isSelected: isAlreadySelected,
                    isDisabled: isAlreadySelected,
                    isSelectedStudent: false
                };
            });

            setStudentData(data);

            const nonDisabledItems = data.filter((item: any) => !item.isDisabled);
            const allNonDisabledSelected = nonDisabledItems.length > 0 &&
                nonDisabledItems.every((item: any) => item.isSelected);
            setAllStudentSelectedState(allNonDisabledSelected);
        }
    }, [getQuestionBankResp, props.selectedStudentData])

    function paginationHndlr(paginationInfo: IPaginationState) {
        props.paginationDetailRef.current = paginationInfo;
        props.getQuestionbankApiCall(paginationInfo);
    }

    // Modified to handle only non-disabled items
    const allStudentCheckHndlr = useCallback((event: any) => {
        const { checked } = event.target;
        setAllStudentSelectedState(checked);

        let updateStudentState = [...studentData];
        updateStudentState.forEach((item: any) => {
            // Only update if not disabled (not already selected)
            if (!item.isDisabled) {
                item.isSelected = checked;
                if (!checked) {
                    item.errors = {};
                }
            }
        });
        setStudentData(updateStudentState);
    }, [studentData]);

    // Modified to prevent changes to disabled items
    const singleStudentCheckHndlr = useCallback((event: any) => {
        const { checked } = event.currentTarget;
        const studentIdNumber = event.currentTarget.getAttribute("data-id");
        const studentRowIndex = studentData.findIndex((item: any) => +item.id === Number(studentIdNumber));

        if (studentRowIndex > -1) {
            const studentDetails: any = studentData[studentRowIndex];

            // Prevent changes to disabled (already selected) items
            if (studentDetails.isDisabled) {
                return;
            }

            let updateStudentState: any = [...studentData];
            updateStudentState.splice(studentRowIndex, 1, {
                ...studentDetails,
                isSelected: checked,
                ...(checked ? {} : { errors: {} }),
            });

            setStudentData(updateStudentState);

            // Check if all non-disabled items are selected
            const nonDisabledItems = updateStudentState.filter((item: any) => !item.isDisabled);
            const isAllNonDisabledSelected = nonDisabledItems.length > 0 &&
                nonDisabledItems.every((item: any) => item.isSelected);
            setAllStudentSelectedState(isAllNonDisabledSelected);
        }
    }, [studentData]);

    const handleAddToAssessment = useCallback(() => {
        // Only get newly selected items (not the disabled ones)
        const newlySelectedStudents = studentData.filter((item: any) =>
            item.isSelected && !item.isDisabled
        );

        if (newlySelectedStudents.length === 0) {
            toast.warning("Please select at least one new question.");
            return;
        }

        // Combine with existing selected data
        const updatedSelectedData = [
            ...props.selectedStudentData,
            ...newlySelectedStudents
        ];

        props.setSelectedStudentData(updatedSelectedData);
        props.toggle();
    }, [studentData, props.selectedStudentData]);

    const columns = useMemo(() =>
        generateColumns(allStudentSelectedState, allStudentCheckHndlr, singleStudentCheckHndlr),
        [studentData, allStudentSelectedState, allStudentCheckHndlr, singleStudentCheckHndlr]
    );

    const { data: curriculumTypes } = brchCurriculumResp || {}
    const { content: classTypes } = branchClassResp || {};
    const { totalElements, totalPages, pageable } = getQuestionBankResp || {}

    const handleAddSingleQuestion = useCallback((questionId: string) => {
        const questionToToggle = studentData.find((item: any) => item.id === questionId);

        if (!questionToToggle) return;

        let updatedSelectedData;

        if (props.selectedStudentData.some((q: any) => q.id === questionId)) {
            updatedSelectedData = props.selectedStudentData.filter((q: any) => q.id !== questionId);
            const updatedStudentData = studentData.map((item: any) =>
                item.id === questionId
                    ? { ...item, isSelected: false, isDisabled: false }
                    : item
            );
            setStudentData(updatedStudentData);

            toast.info("Question removed from assessment!");
        } else {
            updatedSelectedData = [...props.selectedStudentData, { ...questionToToggle }];
            const updatedStudentData = studentData.map((item: any) =>
                item.id === questionId
                    ? { ...item, isSelected: true, isDisabled: false }
                    : item
            );
            setStudentData(updatedStudentData);

            toast.success("Question added to assessment successfully!");
        }
        props.setSelectedStudentData(updatedSelectedData);
    }, [studentData, props.selectedStudentData]);

    // NEW: Handle Select All functionality
    const handleSelectAll = useCallback(() => {
        // Get all non-disabled (available) questions
        const availableQuestions = studentData.filter((item: any) => !item.isDisabled);

        if (availableQuestions.length === 0) {
            toast.warning("No available questions to select.");
            return;
        }

        // Add all available questions to selectedStudentData
        const updatedSelectedData = [
            ...props.selectedStudentData,
            ...availableQuestions
        ];
        props.setSelectedStudentData(updatedSelectedData);

        // Update local state to mark all as disabled/selected
        const updatedStudentData = studentData.map((item: any) =>
            !item.isDisabled
                ? { ...item, isSelected: true, isDisabled: true }
                : item
        );
        setStudentData(updatedStudentData);

        toast.success(`${availableQuestions.length} questions added to assessment successfully!`);
    }, [studentData, props.selectedStudentData]);

    // Expose handleSelectAll to parent component
    useEffect(() => {
        if (props.onSelectAll) {
            props.onSelectAll(handleSelectAll);
        }
    }, [handleSelectAll, props.onSelectAll]);

    const handlePreviewQuestion = useCallback((question: any) => {
        // Implement preview functionality here
        openFetchQuestionsModal(question?.id);
        dispatch(getQuestionBankByIdAct(generateActionPayload("get_question_bank_repository_by_id", { id: question?.id })));
        // You can open a modal or show preview in some other way
    }, []);

    return (
        <>
            <div className="row p-3 pb-0">
                <div className="tw-mb-4 tw-border-b tw-pb-4">
                    <div className="tw-flex tw-gap-3">
                        <div className="search-box !tw-flex-1">
                            <TextInput
                                name="searchString"
                                value={searchString}
                                onChange={(e) => setSearchString(e.target.value)}
                                labelText="Search"
                                floatingLabel
                                formgroupClassName="mb-0"
                            />
                            <i className="ri-search-line search-icon"></i>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row mb-2 px-3 pb-3 g-3 examination tw-min-h-[520px] tw-max-h-[520px]">
                <div style={{ "minHeight": "400px", "maxHeight": "400px", "overflowY": "auto", "overflowX": "hidden", width: "100%" }}>
                    <QuestionCardList
                        questions={studentData}
                        onAddQuestion={handleAddSingleQuestion}
                        onPreviewQuestion={handlePreviewQuestion}
                        searchString={searchString}
                        selectedQuestions={props.selectedStudentData.map((q: any) => q.id)}
                    />
                </div>
                <div className="pt-1">
                    <Pagination
                        paginationContainerClass="mb-2"
                        callbackPaginationHndlr={paginationHndlr}
                        totalPages={totalPages || 0}
                        totalRecords={totalElements || 0}
                        currentPageNumber={pageable?.pageNumber || 0}
                    />

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
    );
};

export default AllQuestions;