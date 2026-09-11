import React, { useCallback, useContext, useMemo, useState, useEffect, useRef } from 'react'
import { StepperFormContext, TABS_ACTIONS } from '../helper';
import { assignedToOptions, generateColumns, renderOptionsStatus, renderValueStatus } from './helper';
import TableContainer from '../../../../../Components/Common/TableContainer';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowLeft03Icon, ArrowRight03Icon, Delete02StrokeStandard, StudentsIcon, } from '@hugeicons-pro/core-stroke-standard';
import { useModal } from '../../../../../hooks/modalhook';
import { ModalContainerUpdated, MultiSelectCheckbox, SelectInput, TextInput } from '../../../../../Components/Common';
import AssignStudentsModel from './AssignStudentsModel';
import { useAppDispatch, useAppSelector } from '../../../../../hooks/storehook';
import { getAssessmentCodeByIdAct, getAssessmentQuestionsByIdAct, getAssignStudentsAssessmentByIdAct, getQuestionBankAct, resetAssessmentByIdAct, resetAssessmentQuestionsByIdAct, resetAssignStudentsAssessmentByIdAct, resetSaveBasicAssessmentAct, saveAssignStudentAssessmentAct } from '../../../../../store/lms/lmsAssessment/lmsAssessmentaction';
import { generateActionPayload } from '../../../../../utility/reduxutility';
import { shallowEqual } from 'react-redux';
import { useFormik } from 'formik';
import { getStudentsListAct, setStudentsListAct } from '../../../../../store/directory/studentmanagement/studentmanagementactions';
import { getSectionList } from '../../../../../store/academic/classroomManagment/classroommanagmentactions';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';

const initialValues = {
    assignedTo: "CLASS",
    sectionIds: [],
    searchString: "",
}

const Assign = (props: any) => {
    const { closeModal: closeFetchQuestionsModal, modalState: fetchQuestionsState, openModal: openFetchQuestionsModal } = useModal();
    const history = useHistory();
    const [selectedStudentData, setSelectedStudentData] = useState<any[]>([]);
    const [allStudentSelectedState, setAllStudentSelectedState] = useState(false);
    const [searchString, setSearchString] = useState("");


    // Add ref to prevent multiple API calls
    const hasInitialized = useRef(false);
    const lastFetchParams = useRef<string>('');

    const dispatch = useAppDispatch();
    const { submitCurrentFormCllbck } = useContext<any>(StepperFormContext);

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
        studentsListResp,
        sectionListResp,
        getAssignStudentsAssessmentByIdResp
    } = useAppSelector(
        ({ instAcademics, globalData, branchAcademics, appData, classSubjectsInfo, directoryEmployee, branch, lmsAssessment, directoryStudent, classroomManagmentInfo }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            branchClassResp: branchAcademics.branchClassResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            showApiLoader: globalData.showApiLoader,
            getAssessmentByIdResp: lmsAssessment.getAssessmentByIdResp,
            saveAssessmentQuestionsResp: lmsAssessment.saveAssessmentQuestionsResp,
            saveBasicAssessmentResp: lmsAssessment.saveBasicAssessmentResp,
            studentsListResp: directoryStudent.studentsListResp,
            sectionListResp: classroomManagmentInfo.sectionListResp,
            getAssignStudentsAssessmentByIdResp: lmsAssessment.getAssignStudentsAssessmentByIdResp
        }),
        shallowEqual
    );

    const addQuestionForm = useFormik({
        initialValues,
        onSubmit: (values) => { }
    });

    const handleDeleteQuestion = useCallback((studentId: any) => {
        const updatedStudentData = selectedStudentData.filter(
            (student: any) => student.studentId !== parseInt(studentId)
        );

        setSelectedStudentData(updatedStudentData);

        // Show success message
        toast.success("Student removed successfully from the assessment.");

    }, [selectedStudentData]);

    const menuOptions = useMemo(
        () => [
            {
                id: "delete",
                actionIcon: (
                    <HugeiconsIcon
                        icon={Delete02StrokeStandard}
                        className="me-2 text-danger"
                        size={18}
                    />
                ),
                actionName: "Delete",
                onClickHndlr: (event: any) => {
                    const id = event.currentTarget.getAttribute("data-id");
                    handleDeleteQuestion(id);
                },
            },
        ],
        [handleDeleteQuestion]
    );

    // Memoize the getSectionListResp function to prevent re-creation on every render
    const getSectionListResp = useCallback((otherProps?: any) => {
        if (!getAssessmentByIdResp) return;

        const { academicYearId, classId, curriculumId } = getAssessmentByIdResp;

        let payload = {
            branchClassId: classId || null,
            masterAcademicYearId: academicYearId,
            curriculumId: curriculumId,
            pageNo: 0,
            pageSize: 100,
            sortBy: "sectionName",
            orderBy: "asc",
            ...otherProps
        }

        if (payload.branchClassId && payload.masterAcademicYearId) {
            dispatch(
                getSectionList(
                    generateActionPayload("get_section_list", undefined, payload)
                )
            );
        }
    }, [getAssessmentByIdResp, dispatch]);

    // Memoize the onInputSearchChange function
    const onInputSearchChange = useCallback((otherProps?: any) => {
        if (!getAssessmentByIdResp || !branchId) return;

        const { academicYearId, classId, curriculumId } = getAssessmentByIdResp;
        const sectionIds = addQuestionForm.values.sectionIds?.map((item: any) => item?.sectionId).join(",");

        const params = {
            branchId,
            academicYearId,
            classId: classId,
            curriculumId: curriculumId,
            sectionIds: sectionIds,
            status: "ACTIVE",
            sortBy: "ROLLNO",
            orderBy: "asc",
            pageNo: 0,
            pageSize: 1000,
            ...otherProps
        };

        if (addQuestionForm.values.assignedTo === "CLASS") {
            delete params.sectionIds;
        }

        // Prevent duplicate API calls by comparing params
        const paramsString = JSON.stringify(params);
        if (lastFetchParams.current === paramsString) return;

        lastFetchParams.current = paramsString;

        dispatch(getStudentsListAct(generateActionPayload("get_students", undefined, params)));
    }, [getAssessmentByIdResp, branchId, addQuestionForm.values.assignedTo, addQuestionForm.values.sectionIds, dispatch]);

    // Fix the columns memoization
    const columns = useMemo(
        () => generateColumns(menuOptions, addQuestionForm.values.assignedTo),
        [menuOptions, addQuestionForm.values.assignedTo, selectedStudentData]
    );

    function getQuestionbankApiCall(otherProps?: any) {
        const { branchId, academicYearId, branchCurriculumId, classId, subjectId } = getAssessmentByIdResp || {};
        const payload = {
            branchId,
            academicYearId: academicYearId,
            curriculumId: branchCurriculumId,
            classId: classId,
            subjectId: subjectId,
            // questionTypeId: addQuestionForm.values.type,
            // difficultyLevelId: addQuestionForm.values.difficulty,
            // bloomTaxonomyIds: addQuestionForm.values.bloom,
            ...otherProps,
            // ...paginationDetailRef.current
        }
        if (payload.branchId && payload.academicYearId && payload.curriculumId && payload.classId && payload.subjectId) {
            dispatch(getQuestionBankAct(generateActionPayload("get_question_bank_repository", undefined, payload)));
        }
    }

    // Memoize the table data to prevent unnecessary re-renders
    const tableData = useMemo(() => {
        let data: any[] = [];

        if (addQuestionForm.values.assignedTo === "STUDENT") {
            data =
                selectedStudentData?.map((student) => ({
                    ...student,
                    isSelectedStudent: student.isSelectedStudent || false,
                })) || [];
        } else {
            data = studentsListResp?.data || [];
        }

        // ✅ filter by search
        if (searchString.trim() !== "") {
            const searchLower = searchString.toLowerCase();
            data = data.filter(
                (student) =>
                    student.studentName?.toLowerCase().includes(searchLower) ||
                    student.rollNo?.toString().toLowerCase().includes(searchLower) ||
                    student.phoneNumber?.toLowerCase().includes(searchLower) ||
                    student.sectionName?.toLowerCase().includes(searchLower)
            );
        }

        return data;
    }, [
        addQuestionForm.values.assignedTo,
        selectedStudentData,
        studentsListResp?.data,
        searchString, // <-- dependency
    ]);

    useEffect(() => {
        if (saveBasicAssessmentResp?.data) {
            dispatch(getAssignStudentsAssessmentByIdAct(generateActionPayload("get_assign_students_assessment_by_id", { id: saveBasicAssessmentResp?.data }, {})));
            dispatch(getAssessmentCodeByIdAct(generateActionPayload("get_assessment_by_id", { id: saveBasicAssessmentResp?.data }, {})));
        }
    }, [saveBasicAssessmentResp?.data]);

    // Handle selected student data changes
    useEffect(() => {
        if (selectedStudentData.length > 0) {
            const allSelected = selectedStudentData.every((item: any) => item.isSelectedStudent);
            setAllStudentSelectedState(allSelected);
        } else {
            setAllStudentSelectedState(false);
        }
    }, [selectedStudentData]);

    // Handle API response when editing existing assignment
    useEffect(() => {
        if (getAssignStudentsAssessmentByIdResp && getAssignStudentsAssessmentByIdResp.assignedTo) {
            // Set assignedTo value
            addQuestionForm.setFieldValue("assignedTo", getAssignStudentsAssessmentByIdResp.assignedTo);

            addQuestionForm.setFieldValue("sectionIds", getAssignStudentsAssessmentByIdResp.sectionDTOS);

            // If studentDetailsResponseDTOS exists and assignedTo is STUDENT, populate selectedStudentData
            if (getAssignStudentsAssessmentByIdResp.assignedTo === "STUDENT" &&
                getAssignStudentsAssessmentByIdResp.studentDetailsResponseDTOS &&
                getAssignStudentsAssessmentByIdResp.studentDetailsResponseDTOS.length > 0) {

                // Map the API response to match your component's expected format
                const mappedStudentData = getAssignStudentsAssessmentByIdResp.studentDetailsResponseDTOS.map((student: any) => ({
                    studentId: student.studentId,
                    studentName: student.studentName,
                    studentCode: student.studentCode,
                    rollNo: student.rollNo,
                    curriculumId: student.curriculumId,
                    curriculumName: student.curriculumName,
                    classId: student.classId,
                    className: student.className,
                    assignedDate: student.assignedDate,
                    studentStatus: student.studentStatus,
                    phoneNo: student.phoneNo,
                    sectionId: student.sectionId,
                    sectionName: student.sectionName,
                    isSelectedStudent: true // Mark as selected since they're already assigned
                }));

                setSelectedStudentData(mappedStudentData);
            }
        }
    }, [getAssignStudentsAssessmentByIdResp]);

    // Handle assignedTo changes - only call API when necessary
    useEffect(() => {
        if (!hasInitialized.current || !getAssessmentByIdResp) return;

        // Call API when assignedTo changes to CLASS or SECTION
        if (addQuestionForm.values.assignedTo === "CLASS" || addQuestionForm.values.assignedTo === "SECTION") {
            onInputSearchChange();
        }
    }, [addQuestionForm.values.assignedTo, getAssessmentByIdResp, onInputSearchChange]);

    // Handle section list fetch when assignedTo is SECTION
    useEffect(() => {
        if (!hasInitialized.current || !getAssessmentByIdResp) return;

        if (addQuestionForm.values.assignedTo === "SECTION") {
            getSectionListResp();
        }
    }, [addQuestionForm.values.assignedTo, getSectionListResp, getAssessmentByIdResp]);

    // Handle section selection changes
    useEffect(() => {
        if (!hasInitialized.current || !getAssessmentByIdResp) return;

        if (addQuestionForm.values.sectionIds && addQuestionForm.values.sectionIds.length > 0) {
            const sectionIds = addQuestionForm.values.sectionIds?.map((item: any) => item?.sectionId).join(",");
            onInputSearchChange({ sectionIds: sectionIds });
        } else if (addQuestionForm.values.assignedTo === "SECTION") {
            // If no sections selected but assignedTo is SECTION, clear the data
            onInputSearchChange();
        }
    }, [addQuestionForm.values.sectionIds, addQuestionForm.values.assignedTo, getAssessmentByIdResp, onInputSearchChange]);

    // Initial data load
    useEffect(() => {
        if (getAssessmentByIdResp && branchId && !hasInitialized.current) {
            hasInitialized.current = true;
            if (addQuestionForm.values.assignedTo === "CLASS") {
                onInputSearchChange();
            }
        }
    }, [getAssessmentByIdResp, branchId, onInputSearchChange, addQuestionForm.values.assignedTo]);

    // Load existing assignment data when props.id is available
    useEffect(() => {
        if (props.id) {
            dispatch(getAssignStudentsAssessmentByIdAct(generateActionPayload("get_assign_students_assessment_by_id", { id: props.id }, {})));
        }
    }, [props.id]);

    useEffect(() => {
        return () => {
            dispatch(resetAssessmentByIdAct(undefined));
            dispatch(setStudentsListAct(undefined));
            dispatch(resetAssignStudentsAssessmentByIdAct(undefined));
            dispatch(resetAssessmentQuestionsByIdAct(undefined));

        }
    }, [])

    const previousBtnHndlr = useCallback((e: any) => {
        submitCurrentFormCllbck(["add_question"], TABS_ACTIONS.PREVIOUS_TAB);
        if (saveBasicAssessmentResp?.data) {
            dispatch(getAssessmentQuestionsByIdAct(generateActionPayload("get_assessment_questions_by_id", { id: saveBasicAssessmentResp?.data }, {})));
            getQuestionbankApiCall();
        }
    }, [submitCurrentFormCllbck, saveBasicAssessmentResp?.data, dispatch]);

    const submitHndlr = useCallback(() => {
        if (
            addQuestionForm.values.assignedTo === "STUDENT" &&
            (!selectedStudentData || selectedStudentData.length < 1)
        ) {
            toast.warning("Please select at least one student");
            return;
        } else {
            submitCurrentFormCllbck("settings", TABS_ACTIONS.PARTICULAR_TAB);
        }

        const data = studentsListResp?.data?.map((student: any) => ({
            studentId: student.studentId,
            studentName: student.studentName,
            studentCode: student.studentCode,
            rollNo: student.rollNo,
            phoneNo: student.phoneNumber,
            studentStatus: student.status,
            sectionId: student.sectionId,
            sectionName: student.sectionName
        }));

        const data1 = selectedStudentData?.map((student: any) => {

            return ({
                studentId: student.studentId,
                studentName: student.studentName,
                studentCode: student.studentCode,
                rollNo: student.rollNo,
                phoneNo: student.phoneNumber ? student.phoneNumber : student.phoneNo,
                studentStatus: student.status ? student.status : student.studentStatus,
                sectionId: student.sectionId,
                sectionName: student.sectionName
            })
        }
        );

        const sectionIds = addQuestionForm.values.sectionIds?.map((item: any) => ({ sectionId: item?.sectionId, sectionName: item?.sectionName }));

        const payload = {
            assignedTo: addQuestionForm.values.assignedTo,
            sections: addQuestionForm.values.assignedTo === "SECTION" ? sectionIds : null,
            studentBasicDetailsDTOS: addQuestionForm.values.assignedTo === "STUDENT" ? data1 : data
        }

        const apiId = props.id || saveBasicAssessmentResp?.data;
        dispatch(saveAssignStudentAssessmentAct(generateActionPayload("save_assign_students_assessment", { id: apiId }, payload)));
    }, [submitCurrentFormCllbck, studentsListResp?.data, selectedStudentData, addQuestionForm.values.assignedTo, saveBasicAssessmentResp?.data, props.id, dispatch]);

    const onSelectDepartmentOptionHandler = useCallback((selectedOptions: any, config?: any) => {
        const { name } = config;
        if (Array.isArray(selectedOptions) && selectedOptions.length > 0) {
            addQuestionForm.setFieldValue(name, selectedOptions);
        } else {
            addQuestionForm.setFieldValue(name, []);
        }
    }, [addQuestionForm]);



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
                                icon={StudentsIcon}
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
                                Step 3: Assign Students
                            </h4>
                            <span className='text-muted' style={{
                                fontSize: "14px",
                                color: "#6c757d",
                                lineHeight: "1.4"
                            }}>
                                Assign to a Group, sections or students
                            </span>
                        </div>
                    </div>
                </div>
                <div className='card-body'>

                    <div className='row px-3 lms'>
                        <div className='card-body' style={{ backgroundColor: "#EFF6FF", borderRadius: "5px" }}>
                            <div className="gx-3 gy-2 py-1 px-2 align-items-start">
                                <div className="row">
                                    <div className="d-grid mb-1 col-6 col-lg-3 tw-gap-1">
                                        <span className="fs-14" style={{ color: "#5586D7" }}>Curriculum</span>
                                        <span className="fw-bold fs-14" style={{ color: "#0C51C5" }}>
                                            {getAssessmentByIdResp?.curriculumName || "N/A"}
                                        </span>
                                    </div>
                                    <div className="d-grid mb-1 col-6 col-lg-3 tw-gap-1">
                                        <span className="fs-14" style={{ color: "#5586D7" }}>Class</span>
                                        <span className="fw-bold fs-14" style={{ color: "#0C51C5" }}>
                                            {getAssessmentByIdResp?.className || "N/A"}
                                        </span>
                                    </div>
                                    {addQuestionForm.values.assignedTo === "SECTION" && <div className="d-grid mb-1 col-6 col-lg-3 tw-gap-1">
                                        <span className="fs-14" style={{ color: "#5586D7" }}>Section</span>
                                        <span className="fw-bold fs-14" style={{ color: "#0C51C5" }}>{addQuestionForm.values.sectionIds?.map((section: any) => section.sectionName).join(", ") || "N/A"}</span>
                                    </div>}
                                    <div className="d-grid mb-1 col-6 col-lg-3 tw-gap-1">
                                        <span className="fs-14" style={{ color: "#5586D7" }}>Total Student</span>
                                        <span className="fw-bold fs-14" style={{ color: "#0C51C5" }}>
                                            {addQuestionForm.values.assignedTo === "STUDENT"
                                                ? selectedStudentData.length
                                                : studentsListResp?.totalRecords || "N/A"
                                            }
                                        </span>
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div className='card-body bg-light mt-3' style={{ border: "1px solid #E7E7E7", borderRadius: "5px" }}>
                            <div className="gx-3 gy-2 align-items-start py-2 px-2">
                                <div className="row">
                                    <div className='col-3'>
                                        <SelectInput
                                            name="assignedTo"
                                            value={addQuestionForm.values.assignedTo}
                                            onChange={addQuestionForm.handleChange}
                                            menuItems={assignedToOptions}
                                            valueKey="id"
                                            textKey="name"
                                            // labelText="Assign To"
                                            defaultSelect='Class'
                                            defaultValue='CLASS'
                                            formgroupClassName='mb-0'
                                            labelText='Assign To'
                                        />
                                    </div>

                                    {addQuestionForm.values.assignedTo === "SECTION" && (
                                        <div className='col-3'>
                                            <MultiSelectCheckbox
                                                name="sectionIds"
                                                idKey="sectionId"
                                                // labelText='Select Section'
                                                value={addQuestionForm.values.sectionIds}
                                                renderValue={renderValueStatus}
                                                renderOptions={renderOptionsStatus}
                                                onChange={onSelectDepartmentOptionHandler}
                                                searchKey="sectionName"
                                                options={sectionListResp?.data || []}
                                                labelText='Section'
                                            />
                                        </div>
                                    )}

                                    {addQuestionForm.values.assignedTo === "STUDENT" && (
                                        <div className="col-auto d-flex align-items-end">
                                            <button
                                                type="button"
                                                className="btn btn-outline-success d-flex align-items-center me-3"
                                                onClick={() => openFetchQuestionsModal()}
                                            >
                                                <span>Assign Students</span>
                                            </button>
                                        </div>
                                    )}
                                </div>

                            </div>
                        </div>

                        <div
                            className="lms_faq lms mt-3 card shadow-sm "
                            style={{
                                border: "1px solid #E5E7EB",
                                borderRadius: "12px",
                                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                            }}
                        >
                            <div className="card-body px-0 pb-0 lms_horizontal_tab">
                                <div className='row lms'>
                                    <div className='col-12 mb-2 px-4 d-flex align-items-center '>
                                        <h5 className="fs-14">Student list</h5>
                                    </div>


                                    <div className='col-12 col-md-6 px-4 mb-3'>
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
                                    <div className='col-12 px-0'>
                                        <TableContainer
                                            columns={columns}
                                            data={tableData}
                                            showPagination={false}
                                            showCheckbox={false}
                                            tableClass="mb-0"
                                            divClass="table-responsive max-h-400px"
                                            theadClass="table-light text-muted align-middle position-sticky top-0"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-12 d-flex justify-content-between mt-1">
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
                            <div className='pe-2'>
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
                isOpen={fetchQuestionsState.showModal}
                toggle={() => closeFetchQuestionsModal()}
                modalTitle="Assign Students to Assessment"
                modalSize="lg"
            >
                <AssignStudentsModel
                    id={fetchQuestionsState.modalData}
                    isOpen={false}
                    toggle={() => closeFetchQuestionsModal()}
                    modalTitle="Assign Students to Assessment"
                    setSelectedStudentData={setSelectedStudentData}
                    selectedStudentData={selectedStudentData}
                />
            </ModalContainerUpdated>
        </>
    )
}

export default Assign