import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import TableContainer from "../../../../../../Components/Common/TableContainer";
import { generateColumns } from "./helper";
import { HugeiconsIcon } from "@hugeicons/react";
import { EyeIcon, } from "@hugeicons-pro/core-stroke-standard";
import { useFormik } from "formik";
import { useAppSelector } from "../../../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { SelectInput } from "../../../../../../Components/Common";
import { chapterList, difficultyLevels, subjectList, topicList } from "../helper";
import { IPaginationState } from "../../../../../../Components/Common/Pagination";
import { toast } from "react-toastify";

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

    const [studentData, setStudentData] = useState<any>([]);
    const [allStudentSelectedState, setAllStudentSelectedState] = useState(false);
    

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

    return (
        <>
            <div className="row px-3 py-3 g-3 examination">
                <div className="col-xs-12 col-md-12 col-lg-3  col-xl-2">
                    <SelectInput
                        name="curriculumId"
                        value={addQuestionForm.values.curriculumId}
                        onChange={addQuestionForm.handleChange}
                        menuItems={curriculumTypes}
                        valueKey="branchCurriculumId"
                        textKey="curriculumName"
                        labelText='Curriculum'
                        formgroupClassName="mb-3 "
                        labelClass='fs-12'
                        inputClassName='fs-12'
                        isDisabled
                        floatingLabel
                    />
                </div>
                <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                    <SelectInput
                        name="classId"
                        value={addQuestionForm.values.classId}
                        onChange={addQuestionForm.handleChange}
                        menuItems={classTypes}
                        valueKey="id"
                        textKey="shortName"
                        labelText='Class'
                        formgroupClassName="mb-3"
                        labelClass='fs-12'
                        inputClassName='fs-12'
                        floatingLabel
                        isDisabled
                    />
                </div>
                <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                    <SelectInput
                        name="subjectId"
                        value={addQuestionForm.values.subjectId}
                        onChange={addQuestionForm.handleChange}
                        menuItems={assignedClassSubjectsListResp?.data}
                        valueKey="subjectId"
                        textKey="subjectName"
                        labelText='Subject'
                        formgroupClassName="mb-3"
                        labelClass='fs-12'
                        inputClassName='fs-12'
                        floatingLabel
                        isDisabled
                    />
                </div>
                <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                    <SelectInput
                        name="difficulty"
                        value={addQuestionForm.values.difficulty}
                        onChange={addQuestionForm.handleChange}
                        menuItems={difficultyLevels}
                        valueKey="id"
                        textKey="shortName"
                        labelText="Difficulty"
                        labelClass="required"
                        inputClassName="fs-12"
                        formgroupClassName="mb-3"
                        floatingLabel
                    />
                </div>
            </div>
            <TableContainer
                columns={columns}
                data={studentData}
                tableClass="mb-0"
                divClass="table-responsive mb-3 fs-12"
                theadClass="table-light text-muted align-middle fs-12"
                showPagination={true}
                totalPages={totalPages || 0}
                totalRecords={totalElements || 0}
                callbackPaginationHndlr={paginationHndlr}
                currentPageNumber={pageable?.pageNumber || 0}
            />
            <div className="hstack gap-2 justify-content-center mb-3">
                <button
                    type="button"
                    className={"btn btn-light px-5"}
                    onClick={props.toggle}
                >
                    Close
                </button>
                <button
                    type="button"
                    className="btn btn-outline-primary d-flex align-items-center fs-12 me-2"
                    onClick={handleAddToAssessment}
                >
                    <span>Add to Assessment</span>
                </button>
            </div>
        </>
    );
};

export default AllQuestions;