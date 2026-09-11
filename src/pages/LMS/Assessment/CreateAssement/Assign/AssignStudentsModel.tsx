import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { generateColumnsStudentsAssingment} from './helper';
import TableContainer from '../../../../../Components/Common/TableContainer';
import { SearchInput, SelectInput } from '../../../../../Components/Common';
import { useFormik } from 'formik';
import { useAppDispatch, useAppSelector } from '../../../../../hooks/storehook';
import { shallowEqual } from 'react-redux';
import { getBranchClassAct, getBranchCurriculumAct } from '../../../../../store/branchsettings/branchacademics/branchacademicsactions';
import { generateActionPayload } from '../../../../../utility/reduxutility';
import { searchInputOptions } from './helper';
import { getStudentsListAct } from '../../../../../store/directory/studentmanagement/studentmanagementactions';
import { getSectionList } from '../../../../../store/academic/classroomManagment/classroommanagmentactions';
import { IPaginationState } from '../../../../../Components/Common/Pagination';
import { toast } from 'react-toastify';

const initialValues = {
    searchString: "",
    curriculumId: '',
    classId: '',
    academicYearId: '',
    sectionId: '',
};

const AssignStudentsModel = (props: any) => {
    const dispatch = useAppDispatch();
    const [searchStudentState, setSearchStudentState] = useState("global");
    const [studentData, setStudentData] = useState<any>([]);
    const [allStudentSelectedState, setAllStudentSelectedState] = useState(false);
    
    // Store all selected student IDs across pagination
    const [selectedStudentIds, setSelectedStudentIds] = useState(new Set());
    // Store previously assigned student IDs (should be disabled)
    const [alreadyAssignedIds, setAlreadyAssignedIds] = useState(new Set());
    // Store complete student data for all selected students across all pages
    const [allSelectedStudentsData, setAllSelectedStudentsData] = useState(new Map());

    const paginationDetailRef = useRef({
        pageNo: 0,
        pageSize: 10,
    })

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
        studentsListResp,
        getAssessmentByIdResp,
        sectionListResp
    } = useAppSelector(
        ({ instAcademics, globalData, branchAcademics, appData, directoryStudent, lmsAssessment, classroomManagmentInfo }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            branchClassResp: branchAcademics.branchClassResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            showApiLoader: globalData.showApiLoader,
            studentsListResp: directoryStudent.studentsListResp,
            getAssessmentByIdResp: lmsAssessment.getAssessmentByIdResp,
            sectionListResp: classroomManagmentInfo.sectionListResp,
        }),
        shallowEqual
    );

    // Initialize already assigned student IDs when component mounts or when props change
    useEffect(() => {
        
        if (props.selectedStudentData && props.selectedStudentData.length > 0) {
            const assignedIds = new Set(props.selectedStudentData.map((item: any) => item.studentId));
            setAlreadyAssignedIds(assignedIds);
            
            // Also store their data in allSelectedStudentsData
            const assignedStudentsMap = new Map();
            props.selectedStudentData.forEach((student: any) => {
                assignedStudentsMap.set(student.studentId, {
                    ...student,
                    isSelectedStudent: true // Ensure this property is set
                });
            });
            setAllSelectedStudentsData(assignedStudentsMap);
            
            // Clear selectedStudentIds for newly available students
            setSelectedStudentIds(new Set());
        } else {
            setAlreadyAssignedIds(new Set());
            setAllSelectedStudentsData(new Map());
            setSelectedStudentIds(new Set());
        }
    }, [props.selectedStudentData]);

    function onInputSearchChange(otherProps?: any) {
        const { academicYearId, classId, curriculumId, searchString, sectionId } = addQuestionForm.values;
        
        const params = {
            branchId, academicYearId, classId: classId,
            curriculumId: curriculumId, searchString: searchString, sectionId: sectionId, 
            status : "ACTIVE",
            sortBy : "ROLLNO", 
            orderBy : "asc",
            ...paginationDetailRef.current,
            ...otherProps
        };
        dispatch(getStudentsListAct(generateActionPayload("get_students", undefined, params)));
    }

    useEffect(() => {
        if (getAssessmentByIdResp) {
            const { branchCurriculumId, academicYearId, classId } = getAssessmentByIdResp || {};
            addQuestionForm.setFieldValue("curriculumId", branchCurriculumId || '');
            addQuestionForm.setFieldValue("academicYearId", academicYearId || '');
            addQuestionForm.setFieldValue("classId", classId || '');
            getSectionListResp({
                branchClassId: classId,
                masterAcademicYearId: academicYearId,
                curriculumId: branchCurriculumId,
            });
        }
    }, [getAssessmentByIdResp]);

    useEffect(() => {
        if (addQuestionForm.values.classId && addQuestionForm.values.curriculumId) {
            onInputSearchChange();
        }
    }, [addQuestionForm.values.curriculumId, addQuestionForm.values.classId]);
    
    useEffect(() => {
        if (addQuestionForm.values.sectionId) {
            onInputSearchChange();
        }
    }, [addQuestionForm.values.sectionId]);

    useEffect(() => {
        if (studentsListResp?.data) {
            const data = studentsListResp.data.map((item: any) => {
                const isAlreadyAssigned = alreadyAssignedIds.has(item.studentId);
                const isCurrentlySelected = selectedStudentIds.has(item.studentId);
                
                // Store current page student data
                if (isCurrentlySelected && !isAlreadyAssigned) {
                    setAllSelectedStudentsData(prev => {
                        const newMap = new Map(prev);
                        newMap.set(item.studentId, {
                            ...item,
                            isSelectedStudent: true
                        });
                        return newMap;
                    });
                }
                
                return {
                    ...item,
                    isSelected: isCurrentlySelected || isAlreadyAssigned,
                    isDisabled: isAlreadyAssigned,
                    isSelectedStudent: isCurrentlySelected && !isAlreadyAssigned
                };
            });
            
            setStudentData(data);
            
            // Update all student checkbox state based on current page
            const currentPageStudents = data.filter((item: any) => !item.isDisabled);
            const allCurrentPageSelected = currentPageStudents.length > 0 && 
            currentPageStudents.every((item: any) => selectedStudentIds.has(item.studentId));
            setAllStudentSelectedState(allCurrentPageSelected);
        }
    }, [studentsListResp, selectedStudentIds, alreadyAssignedIds]);

    const getSectionListResp = (otherProps?: any) => {
        let payload = { 
            branchClassId: addQuestionForm.values.classId || null, 
            masterAcademicYearId: addQuestionForm.values.academicYearId, 
            curriculumId: addQuestionForm.values.curriculumId, 
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
    }

    function onSearchHandler(name: string, value: any) {
        paginationDetailRef.current.pageNo = 0;
        setSearchStudentState((prev) => {
            const updatedFilterType = prev;
            addQuestionForm.setValues((prevState) => {
                const updatedState = {
                    ...prevState,
                    searchString: value,
                    filterTypeName: updatedFilterType
                };
                // Trigger search when search string is updated
                setTimeout(() => onInputSearchChange(), 100);
                return updatedState;
            });
            return updatedFilterType;
        });
    }

    function onChangeHandler(name: string, id: any, item: any) {
        setSearchStudentState(id);
        paginationDetailRef.current.pageNo = 0;
        addQuestionForm.setValues((prevState) => {
            const updatedState = {
                ...prevState,
                filterTypeName: id,
                searchString: ""
            };
            return updatedState;
        });
    }

    function paginationHndlr(paginationInfo: IPaginationState) {
        paginationDetailRef.current = paginationInfo;
        onInputSearchChange(paginationInfo);
    }

    const allStudentCheckHndlr = useCallback((event: any) => {
        const { checked } = event.target;
        
        // Get current page students that are not disabled (not already assigned)
        const currentPageAvailableStudents = studentData.filter((item: any) => !item.isDisabled);
        
        // Update selected IDs and student data
        const updatedSelectedIds = new Set(selectedStudentIds);
        
        setAllSelectedStudentsData(prev => {
            const newMap = new Map(prev);
            
            currentPageAvailableStudents.forEach((student: any) => {
                if (checked) {
                    updatedSelectedIds.add(student.studentId);
                    newMap.set(student.studentId, {
                        ...student,
                        isSelectedStudent: true
                    });
                } else {
                    updatedSelectedIds.delete(student.studentId);
                    if (!alreadyAssignedIds.has(student.studentId)) {
                        newMap.delete(student.studentId);
                    }
                }
            });
            
            return newMap;
        });
        
        setSelectedStudentIds(updatedSelectedIds);
        setAllStudentSelectedState(checked);
    }, [studentData, selectedStudentIds, alreadyAssignedIds]);

    const singleStudentCheckHndlr = useCallback((event: any) => {
        const { checked } = event.currentTarget;
        const studentIdNumber = Number(event.currentTarget.getAttribute("data-id"));
        
        // Find the student in current data
        const student = studentData.find((item: any) => item.studentId === studentIdNumber);
        
        // Don't allow changes to already assigned students
        if (student && student.isDisabled) {
            return;
        }
        
        // Update selected IDs and student data
        const updatedSelectedIds = new Set(selectedStudentIds);
        
        setAllSelectedStudentsData(prev => {
            const newMap = new Map(prev);
            
            if (checked) {
                updatedSelectedIds.add(studentIdNumber);
                if (student) {
                    newMap.set(studentIdNumber, {
                        ...student,
                        isSelectedStudent: true
                    });
                }
            } else {
                updatedSelectedIds.delete(studentIdNumber);
                if (!alreadyAssignedIds.has(studentIdNumber)) {
                    newMap.delete(studentIdNumber);
                }
            }
            
            return newMap;
        });
        
        setSelectedStudentIds(updatedSelectedIds);
        
        // Check if all available students on current page are selected
        const currentPageAvailableStudents = studentData.filter((item: any) => !item.isDisabled);
        const allCurrentPageSelected = currentPageAvailableStudents.length > 0 &&
            currentPageAvailableStudents.every((item: any) => updatedSelectedIds.has(item.studentId));
        
        setAllStudentSelectedState(allCurrentPageSelected);
    }, [studentData, selectedStudentIds, alreadyAssignedIds]);

    const handleAddToAssessment = useCallback(() => {
        // Get newly selected students (exclude already assigned ones)
        const newlySelectedIds = Array.from(selectedStudentIds).filter(id => !alreadyAssignedIds.has(id));
        
        if (newlySelectedIds.length === 0) {
            toast.warning("Please select at least one new student.");
            return;
        }
        
        // Get complete student data for newly selected students
        const newlySelectedStudents = newlySelectedIds.map(id => {
            const studentData = allSelectedStudentsData.get(id);
            return studentData ? {
                ...studentData,
                isSelectedStudent: true
            } : null;
        }).filter(Boolean); // Remove any undefined values
        
        // Combine with existing selected data
        const updatedSelectedData = [
            ...props.selectedStudentData,
            ...newlySelectedStudents
        ];
        
        props.setSelectedStudentData(updatedSelectedData);
        toast.success(`${newlySelectedStudents.length} student(s) added to the assessment.`);
        props.toggle();
    }, [selectedStudentIds, alreadyAssignedIds, allSelectedStudentsData, props.selectedStudentData]);

    const columns = useMemo(() => 
        generateColumnsStudentsAssingment(allStudentSelectedState, allStudentCheckHndlr, singleStudentCheckHndlr), 
        [allStudentSelectedState, allStudentCheckHndlr, singleStudentCheckHndlr]
    );
    
    const { data: curriculumTypes } = brchCurriculumResp || {}
    const { content: classTypes } = branchClassResp || {};
    const { pageNumber, totalPages, totalRecords } = studentsListResp || {}

    return (
        <>
            <div className='row px-3 lms'>
                <div className="col-xs-12 col-md-6 mb-2 mt-3 ps-3 pe-1 lms">
                    <SearchInput
                        hideDefaultSelect
                        name="searchString"
                        value={searchStudentState}
                        menuItems={searchInputOptions}
                        idKey="id"
                        labelName="Search With"
                        searchHandler={onSearchHandler}
                        onChange={onChangeHandler}
                        className="fs-12 my-2"
                        renderSelectedValue={(item: any) => item?.name}
                        renderOptions={(item: any) => item?.name}
                    />
                </div>
                <div className="col-xs-12 col-md-12 col-lg-3 mb-2 mt-3 px-1 col-xl-2">
                    <SelectInput
                        name="curriculumId"
                        value={addQuestionForm.values.curriculumId}
                        onChange={addQuestionForm.handleChange}
                        menuItems={curriculumTypes}
                        valueKey="branchCurriculumId"
                        textKey="curriculumName"
                        labelText="Curriculum"
                        labelClass="required"
                        inputClassName="fs-12"
                        formgroupClassName="my-2"
                        floatingLabel
                        isDisabled
                    />
                </div>
                <div className="col-xs-12 col-md-12 col-lg-3 mb-2 mt-3 ps-1 pe-3 col-xl-2">
                    <SelectInput
                        name="classId"
                        value={addQuestionForm.values.classId}
                        onChange={addQuestionForm.handleChange}
                        menuItems={classTypes}
                        valueKey="id"
                        textKey="shortName"
                        labelText="Class"
                        labelClass="required"
                        inputClassName="fs-12"
                        formgroupClassName="my-2"
                        floatingLabel
                        isDisabled
                    />
                </div>
                <div className="col-xs-12 col-md-12 col-lg-3 mb-2 mt-3 ps-1 pe-3 col-xl-2">
                    <SelectInput
                        name="sectionId"
                        value={addQuestionForm.values.sectionId}
                        onChange={addQuestionForm.handleChange}
                        menuItems={sectionListResp?.data}
                        valueKey="sectionId"
                        textKey="sectionName"
                        labelText="Section"
                        formgroupClassName="my-2"
                        inputClassName="fs-12"
                        floatingLabel
                    />
                </div>
                <div className='col-12 px-0'>
                    <TableContainer
                        columns={columns}
                        data={studentData || []}
                        showCheckbox={false}
                        tableClass="mb-0"
                        divClass="table-responsive mb-0 fs-12"
                        theadClass="table-light text-muted align-middle fs-12"
                        showPagination={true}
                        totalPages={totalPages || 0}
                        totalRecords={totalRecords || 0}
                        callbackPaginationHndlr={paginationHndlr}
                        currentPageNumber={pageNumber || 0}
                    />
                </div>
                <div className="row my-3 px-0">
                    <div className="col-12 text-end mt-2 px-0">
                        <button 
                            type="button" 
                            className="btn btn-light text-dark fs-12 me-3"
                            onClick={props.toggle}
                        >
                            Cancel
                        </button>
                        <button 
                            type="button" 
                            className="btn btn-outline-success fs-12" 
                            onClick={handleAddToAssessment}
                            disabled={Array.from(selectedStudentIds).filter(id => !alreadyAssignedIds.has(id)).length === 0}
                        >
                            Submit ({Array.from(selectedStudentIds).filter(id => !alreadyAssignedIds.has(id)).length} selected)
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AssignStudentsModel