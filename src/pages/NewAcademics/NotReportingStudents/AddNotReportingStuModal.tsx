import React, { useState, useEffect, useRef, } from "react";
import { useFormik, } from "formik";
import { AutoSearchInputUpdated, DateInput, SelectInput, TextArea, TextInput, } from "../../../Components/Common";
import { useAppSelector } from "../../../hooks/storehook";
import { shallowEqual, useDispatch } from "react-redux";
import { generateActionPayload } from "../../../utility/reduxutility";
import * as Yup from 'yup';
import { resetAssignLanClassListAct, resetAssignLanSectionListAct } from "../../../store/assignlanguages/assignlanguagesslice";
import { getAssignLanClassListAct, getAssignLanSectionListAct } from "../../../store/assignlanguages/assignlanguagesaction";
import { getStudentsListAct } from "../../../store/directory/studentmanagement/studentmanagementactions";
import { addNotReportingStuAct, editNotReportingStuAct, saveVlidateStudentStatusAct } from "../../../store/academic/notreportingstudents/notreportingstudentsactions";
import { setSaveVlidateStudentStatusAct } from "../../../store/academic/notreportingstudents/notreportingstudentsslice";
import Button from "../../../Components/Common/Button";


const initialValues = {
    academicYearId: "",
    curriculumId: "",
    classId: "",
    sectionId: "",
    studentId: "",
    curriculumName :"",
    sectionName : "",
    className :"",
    fromDate: "",
    remarks: "",
};

const validationSchema = Yup.object().shape({
    academicYearId: Yup.string().required('Academic Year is required').nullable(),
    studentId: Yup.string().required('Student is required').nullable(),
    fromDate: Yup.string().required('From Date is required').nullable()
});

const AddNotReportingStuModal: React.FC<any> = (props) => {

    const dispatch = useDispatch();
    const [searchStudentState, setSearchStudentState] = useState<any>(null);
    const [tempStudent, setTempStudent] = useState<any>(null);

    const {
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        academicYearListResp,
        showApiLoader,
        studentsListResp,
        getByIdNotReportingStuResp,
        saveVlidateStudentStatusResp,
        notReportingStuErrResp
    } = useAppSelector(
        ({ masterData, globalData, directoryEmployee, branchAcademics, appData, complaintDepartment, instAcademics, notReportingStu, directoryStudent, assignLanguages }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            showApiLoader: globalData.showApiLoader,
            studentsListResp: directoryStudent.studentsListResp,
            getByIdNotReportingStuResp: notReportingStu.getByIdNotReportingStuResp,
            saveVlidateStudentStatusResp:notReportingStu.saveVlidateStudentStatusResp,
            notReportingStuErrResp: notReportingStu.notReportingStuErrResp,

        }),
        shallowEqual
    );

    const addNotReportStuRef = useRef({
        prevGetByIdNotReportingStuResp: getByIdNotReportingStuResp,
        prevNotReportingStuErrResp: notReportingStuErrResp
    });

    useEffect(() => {
        const { prevGetByIdNotReportingStuResp, prevNotReportingStuErrResp } = addNotReportStuRef.current;

        if(notReportingStuErrResp && notReportingStuErrResp !== prevNotReportingStuErrResp){
            setTempStudent(null)
            addNotReportStuForm.setValues((prev: any) => ({ ...prev, studentId: "", curriculumId: "", classId: "", sectionId: "", curriculumName: "", className: "", sectionName: "", studentName: "", studentCode: "" }))
        }
        else if (getByIdNotReportingStuResp && getByIdNotReportingStuResp !== prevGetByIdNotReportingStuResp) {
            if (getByIdNotReportingStuResp && props?.id) {
                const { academicYearId, curriculumId, fromDate, classId, sectionId, remarks, studentName, studentCode, studentId,curriculumName, classShortName, sectionName } = getByIdNotReportingStuResp || {};

                setSearchStudentState({ studentName, studentCode, studentId })
                addNotReportStuForm.setValues((prev: any) => ({
                    ...prev,
                    academicYearId: academicYearId,curriculumId, classId, sectionId ,curriculumName, className:classShortName, sectionName,fromDate, remarks, studentId
                }))
            }
        }
        addNotReportStuRef.current.prevGetByIdNotReportingStuResp = getByIdNotReportingStuResp;
        addNotReportStuRef.current.prevNotReportingStuErrResp = notReportingStuErrResp;

    }, [getByIdNotReportingStuResp, notReportingStuErrResp]);

    useEffect(() => {
        if (!props?.id) {
            let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId
            addNotReportStuForm.setFieldValue("academicYearId", yearId)
        }
    }, [academicYearListResp])

    useEffect(() => {
        return () => {
            dispatch(setSaveVlidateStudentStatusAct(undefined));
        };
    }, []);

    const addNotReportStuForm = useFormik({
        initialValues: initialValues,
        validationSchema,
        onSubmit: (values) => {
            const {academicYearId, fromDate,classId,sectionId,curriculumId,studentId,remarks} = values || {}
            if (props.id) {
                const payload = { remarks, fromDate }
                dispatch(editNotReportingStuAct(generateActionPayload("edit_not_report_stu", { id: props?.id }, payload)));
            } else {
                const payload = { academicYearId, fromDate,classId,sectionId,curriculumId,studentId,remarks, branchId }
                dispatch(addNotReportingStuAct(generateActionPayload("save_not_report_stu", undefined, { ...payload })));
            }
        },
    });

    const selectedStudent = (student: any) => {
        if (student) {
            const {studentId, curriculumName, className, sectionName,curriculumId,classId,sectionId} = student || {};
            dispatch(saveVlidateStudentStatusAct(generateActionPayload("save_validate_student_status", undefined, { studentId, requestType: "NR"})));
            // setSearchStudentState(student);
            setTempStudent(student);
            // addNotReportStuForm.setValues((prev: any) => ({ ...prev, studentId, curriculumId, classId, sectionId ,curriculumName, className, sectionName  }))
        }
    } 

    useEffect(() => {
        if (saveVlidateStudentStatusResp && saveVlidateStudentStatusResp === 200) {
            if (tempStudent) {
                const { studentId, curriculumName, className, sectionName, curriculumId, classId, sectionId } = tempStudent;

                setSearchStudentState(tempStudent);

                addNotReportStuForm.setValues((prev) => ({
                    ...prev,
                    studentId,
                    curriculumId,
                    classId,
                    sectionId,
                    curriculumName,
                    className,
                    sectionName
                }));
            }
        }
    }, [saveVlidateStudentStatusResp, tempStudent]);

    const filterHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
         if (name === "academicYearId") {
            addNotReportStuForm.setValues((prev: any) => ({ ...prev, [name]: value }))
        } else {
            addNotReportStuForm.setValues((prev: any) => ({ ...prev, [name]: value }))
        }

    }

    function onInputSearchChange(inputString: any) {
        const { academicYearId, curriculumId, classId, sectionId } = addNotReportStuForm.values;
        if (inputString && academicYearId ) {
            const params = {
                branchId, academicYearId,
                // classId: classId,
                // curriculumId: curriculumId,
                // sectionId,
                searchString: inputString,
            };
            dispatch(getStudentsListAct(generateActionPayload("get_students", undefined, params)));
        }
    }

    return (
        <>
            <form>
                <div className="tw-p-6">
                    <div className="tw-grid tw-grid-cols-12 tw-gap-4">
                        <div className="tw-col-span-12 md:tw-col-span-6">
                            <SelectInput
                                name="academicYearId"
                                labelText="Academic Year"
                                value={addNotReportStuForm.values.academicYearId}
                                onChange={filterHandler}
                                menuItems={academicYearListResp?.data}
                                isDisabled={props?.id && true}
                                valueKey="academicYearId"
                                textKey="academicYearName"
                                formgroupClassName="tw-mb-0"
                                labelClass="required"
                                invalid={(addNotReportStuForm.touched.academicYearId && addNotReportStuForm.errors.academicYearId) ? true : false}
                                error={(addNotReportStuForm.touched.academicYearId && addNotReportStuForm.errors.academicYearId) ? addNotReportStuForm.errors.academicYearId : ""}
                            />
                        </div>
                        <div className="tw-col-span-12 md:tw-col-span-6">
                            <AutoSearchInputUpdated
                                formgroupClassName="search-box tw-mb-0"
                                name="studentId"
                                placeHolder="Search..."
                                onChange={(string: any) => {
                                    if (!string) addNotReportStuForm.setFieldValue("studentId", "");
                                    onInputSearchChange(string);
                                }}
                                onBlur={addNotReportStuForm.handleBlur}
                                isDisabled={props?.id && true}
                                valueKey="studentId"
                                labelHeader="Student Code"
                                labelKey="studentCode"
                                subLabelHeader="Student Name"
                                subLabelKey="studentName"
                                labelText="Student"
                                labelClass="required"
                                options={studentsListResp?.data || []}
                                selected={searchStudentState}
                                selectedOptionCallbck={selectedStudent}
                                invalid={(addNotReportStuForm.touched.studentId && addNotReportStuForm.errors.studentId) ? true : false}
                                error={(addNotReportStuForm.touched.studentId && addNotReportStuForm.errors.studentId) ? addNotReportStuForm.errors.studentId : ""}

                            >
                                <i className="ri-search-line search-icon"></i>
                            </AutoSearchInputUpdated>
                        </div>
                        <div className="tw-col-span-12 md:tw-col-span-6">
                            <TextInput
                                name="curriculumName"
                                labelText="Curriculum"
                                value={addNotReportStuForm.values.curriculumName}
                                isDisabled={true}
                                formgroupClassName="tw-mb-0"
                            />
                        </div>
                        <div className="tw-col-span-12 md:tw-col-span-6">
                            <TextInput
                                name="className"
                                labelText="Class"
                                value={addNotReportStuForm.values.className}
                                isDisabled={true}
                                formgroupClassName="tw-mb-0"
                            />
                        </div>
                        <div className="tw-col-span-12 md:tw-col-span-6">
                            <TextInput
                                name="sectionName"
                                labelText="Section"
                                value={addNotReportStuForm.values.sectionName}
                                isDisabled={true}
                                formgroupClassName="tw-mb-0"
                            />
                        </div>
                        <div className="tw-col-span-12 md:tw-col-span-6">
                            <DateInput
                                name="fromDate"
                                value={addNotReportStuForm.values.fromDate}
                                onChange={filterHandler}
                                inputClassName="tw-bg-gray-50"
                                labelText="From Date"
                                labelClass="required"
                                formgroupClassName="tw-mb-0"
                                invalid={(addNotReportStuForm.touched.fromDate && addNotReportStuForm.errors.fromDate) ? true : false}
                                error={(addNotReportStuForm.touched.fromDate && addNotReportStuForm.errors.fromDate) ? addNotReportStuForm.errors.fromDate : ""}
                            />
                        </div>
                        <div className="tw-col-span-12">
                            <TextArea
                                name="remarks"
                                value={addNotReportStuForm.values.remarks}
                                onChange={filterHandler}
                                inputClassName="tw-bg-gray-50"
                                labelText="Remarks"
                                formgroupClassName="tw-mb-0"
                                invalid={(addNotReportStuForm.touched.remarks && addNotReportStuForm.errors.remarks) ? true : false}
                                error={(addNotReportStuForm.touched.remarks && addNotReportStuForm.errors.remarks) ? addNotReportStuForm.errors.remarks : ""}
                            />
                        </div>
                    </div>
                    <div className="tw-flex tw-justify-end tw-gap-3 tw-mt-6">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={props.toggle}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            onClick={(event: any) =>
                                addNotReportStuForm.handleSubmit(event)
                            }
                            disabled={showApiLoader}
                        >
                            Submit
                        </Button>
                    </div>
                </div>
            </form>
        </>
    );
};

export default AddNotReportingStuModal;
