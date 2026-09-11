import React, { useRef, useEffect } from "react";
import { FieldArray, useFormik, FormikProvider, ArrayHelpers } from "formik";
import { generateUniqueNumber } from "../../../../utility/commonutility";
import { SelectInput, TextArea, TextInput, TextInputWithRegex } from "../../../../Components/Common";
import { shallowEqual } from "react-redux";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { editCbseInternalSubjectsGradesAct, saveCbseInternalSubjectsGradesAct } from "../../../../store/examination/examinationsettings/examinationsettingsaction";
import { nanoid } from "nanoid";
import * as Yup from "yup";
import { getAssignCurriculumListAct, getAssignLanClassListAct } from "../../../../store/assignlanguages/assignlanguagesaction";

const initialValues = {
    academicYearId: "",
    curriculumId: "",
    classId: "",
    noOfGrades: "2",
    grades: [
        {
            id: nanoid(),
            grade: "",
            gradePoints: "",

        },
    ],
};

const validationSchema = Yup.object().shape({
    academicYearId: Yup.string().required("Academic Year is required."),
    curriculumId: Yup.string().required("Curriculum is required."),
    classId: Yup.string().required("Class is required."),
    noOfGrades: Yup.string().required("No of Grades is required."),
    grades: Yup.array().of(
        Yup.object().shape({
            grade: Yup.string().required("Grade is required."),
            gradePoints: Yup.string().required("Point is required."),
        })
    )
});

const AddInternalSubjectGradesModal = (props: any) => {
    const formikArrayHelpers = useRef<ArrayHelpers | null>(null);
    console.log(props);
    
    const dispatch = useAppDispatch();

    const { academicYearListResp,
        currentBranchIdResp: branchId,
        getAssignLanClassListResp,
        getAssignListCurriculumResp,
        getCbseInternalSubjectsGradesListByIdResp,
        showApiLoader } = useAppSelector(
            ({ instAcademics, assignLanguages, appData, examinationSettings, globalData }) => ({
                academicYearListResp: instAcademics.academicYearListResp,
                currentBranchIdResp: appData.currentBranchIdResp,
                getAssignLanClassListResp: assignLanguages.getAssignLanClassListResp,
                getAssignListCurriculumResp: assignLanguages.getAssignListCurriculumResp,
                getCbseInternalSubjectsGradesListByIdResp: examinationSettings.getCbseInternalSubjectsGradesListByIdResp,
                showApiLoader: globalData.showApiLoader,
            }),
            shallowEqual
        );

    const addCoscholasticGradesFormik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values) => {
            const payload = {
                branchId,
                academicYearId: values.academicYearId,
                curriculumId: values.curriculumId,
                classId: values.classId,
                grades: values.grades.map(grade => ({
                    grade: grade.grade,
                    gradePoints: Number(grade.gradePoints),
                }))
            };
            const editPayload = {
                grade: values.grades[0]?.grade,
                gradePoints: values.grades[0]?.gradePoints,
            };

            if (props?.id) {
                dispatch(editCbseInternalSubjectsGradesAct(generateActionPayload("edit_cbse_internal_subjects_grades_list", { id: props.id }, editPayload)));
            } else {
                dispatch(saveCbseInternalSubjectsGradesAct(generateActionPayload("save_cbse_internal_subjects_grades_list", undefined, payload)));
            }
        },
    });

    useEffect(() => {
        
        return () => {
            addCoscholasticGradesFormik.resetForm();
        }
    }, [])

    const addExaminationCoscholasticGradesRef = useRef({
        prevgetCbseInternalSubjectsGradesListByIdResp: getCbseInternalSubjectsGradesListByIdResp,
    })

    useEffect(() => {
        const { prevgetCbseInternalSubjectsGradesListByIdResp } = addExaminationCoscholasticGradesRef.current || {};

        if (getCbseInternalSubjectsGradesListByIdResp && prevgetCbseInternalSubjectsGradesListByIdResp !== getCbseInternalSubjectsGradesListByIdResp) {
            if (props?.id) {
                const {
                    academicYearId, curriculumId, classId, grade,
                    gradePoints,
                    description,
                } = getCbseInternalSubjectsGradesListByIdResp || {};

                addCoscholasticGradesFormik.setValues((prev: any) => ({
                    ...prev,
                    academicYearId,
                    curriculumId,
                    classId,
                    grades: [{
                        grade: grade,
                        gradePoints: gradePoints,
                        description: description
                    }]
                }));
                if (academicYearId) {
                    getCurriculumApiCall({ academicYearId });
                }
                if (academicYearId && curriculumId) {
                    getClassApiCall({ curriculumId, academicYearId });
                }
            }
        }

        addExaminationCoscholasticGradesRef.current.prevgetCbseInternalSubjectsGradesListByIdResp = getCbseInternalSubjectsGradesListByIdResp;
    }, [getCbseInternalSubjectsGradesListByIdResp]);

    function getClassApiCall(otherProps?: any) {
        const payload = {
            academicYearId: addCoscholasticGradesFormik.values.academicYearId,
            curriculumId: addCoscholasticGradesFormik.values.curriculumId,
            branchId,
            pageNo: 0, pageSize: 100,  classFilter:  "HIGHER", sortBy: "classSequence", orderBy: "asc", ...otherProps
        };

        dispatch(getAssignLanClassListAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
    }

    const getCurriculumApiCall = (otherProps?: any) => {
        const payload1 = { academicYearId: addCoscholasticGradesFormik.values.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", ...otherProps };
        dispatch(getAssignCurriculumListAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
    }

    const handleSelectChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        addCoscholasticGradesFormik.setFieldValue(name, value);

        if (value) {
            if (name === "academicYearId") {
                addCoscholasticGradesFormik.setValues((prev) => ({
                    ...prev,
                    academicYearId: value,
                    curriculumId: "",
                    classId: "",
                }));
                getCurriculumApiCall({ academicYearId: value });
            } else if (name === "curriculumId") {
                getClassApiCall({ curriculumId: value });
                addCoscholasticGradesFormik.setFieldValue("classId", "");
                addCoscholasticGradesFormik.setFieldValue("sectionId", "");
            }
        }
    }

    useEffect(() => {
        if(props?.modalData){
            addCoscholasticGradesFormik.setFieldValue("academicYearId", props?.modalData?.academicYearId);
            addCoscholasticGradesFormik.setFieldValue("curriculumId", props?.modalData?.curriculumId);
            getCurriculumApiCall({ academicYearId: props?.modalData?.academicYearId });
            getClassApiCall({academicYearId: props?.modalData?.academicYearId, curriculumId: props?.modalData?.curriculumId });
        } 
        else{
            if (!props.id) {
            const yearId = academicYearListResp?.data.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId;
            addCoscholasticGradesFormik.setValues((prev: any) => ({ ...prev, academicYearId: yearId }));
        }
        }  
    }, [props?.modalData]);

    function addWeightageHandler() {
        if (formikArrayHelpers.current) {
            formikArrayHelpers.current.push({ uniqueId: generateUniqueNumber(), grade: "", gradePoints: "", description: "" });
        }
    }

    function removeGradesHndlr(event: React.MouseEvent<HTMLButtonElement>) {
        const rowIndex = event.currentTarget.getAttribute("data-index");
        if (rowIndex !== undefined || rowIndex !== null) {
            formikArrayHelpers.current?.remove(Number(rowIndex));
        }
    }

    return (
        <>
            <form>
                <div className="row px-4 mb-3">
                    <div className="row g-3">
                        <div className="col-12 col-md-6 mt-0">
                            <SelectInput
                                name="academicYearId"
                                labelText="Academic Year"
                                labelClass="required"
                                value={addCoscholasticGradesFormik.values.academicYearId}
                                onChange={handleSelectChange}
                                menuItems={academicYearListResp?.data}
                                valueKey="academicYearId"
                                textKey="academicYearName"
                                formgroupClassName="mb-0"
                                isDisabled={props?.id}
                                invalid={(addCoscholasticGradesFormik.touched.academicYearId && addCoscholasticGradesFormik.errors.academicYearId) ? true : false}
                                error={(addCoscholasticGradesFormik.touched.academicYearId && addCoscholasticGradesFormik.errors.academicYearId) ? addCoscholasticGradesFormik.errors.academicYearId : ""}
                            />
                        </div>
                        <div className="col-12 col-md-6 mt-0">
                            <SelectInput
                                name="curriculumId"
                                labelText="Curriculum"
                                value={addCoscholasticGradesFormik.values.curriculumId}
                                onChange={handleSelectChange}
                                menuItems={getAssignListCurriculumResp?.data}
                                isDisabled
                                valueKey="branchCurriculumId"
                                textKey="curriculumName"
                                labelClass="required"
                                formgroupClassName="mb-0"
                                invalid={(addCoscholasticGradesFormik.touched.curriculumId && addCoscholasticGradesFormik.errors.curriculumId) ? true : false}
                                error={(addCoscholasticGradesFormik.touched.curriculumId && addCoscholasticGradesFormik.errors.curriculumId) ? addCoscholasticGradesFormik.errors.curriculumId : ""}
                            />
                        </div>
                        <div className="col-12 col-md-6">
                            <SelectInput
                                name="classId"
                                labelText="Class"
                                value={addCoscholasticGradesFormik.values.classId}
                                onChange={addCoscholasticGradesFormik.handleChange}
                                menuItems={getAssignLanClassListResp?.content}
                                valueKey="id"
                                textKey="shortName"
                                labelClass="required"
                                formgroupClassName="mb-0"
                                isDisabled={props?.id}
                                invalid={(addCoscholasticGradesFormik.touched.classId && addCoscholasticGradesFormik.errors.classId) ? true : false}
                                error={(addCoscholasticGradesFormik.touched.classId && addCoscholasticGradesFormik.errors.classId) ? addCoscholasticGradesFormik.errors.classId : ""}
                            />
                        </div>
                        <div className="col-12 col-md-6">
                        </div>
                    </div>
                </div>
                <div className="bg-light py-3 px-4">
                    <div className="row">
                        <div className="col-12 col-md-4">Grade Name</div>
                        <div className="col-12 col-md-4">Grade Point</div>
                        <div className="col-12 col-md-2 justify-content-end d-flex align-items-center">
                            {!props?.id && <button
                                onClick={addWeightageHandler}
                                type="button"
                                className="btn-sm btn-icon btn btn-outline-primary"
                            >
                                <i className="ri-add-line fs-18" />
                            </button>}
                        </div>
                    </div>
                </div>
                <div className="pt-3 px-4">
                    <div className="row px-2">
                        <div className="col-12">
                            <FormikProvider value={addCoscholasticGradesFormik}>
                                <FieldArray name="grades">
                                    {(arrayHelpers: ArrayHelpers) => {
                                        if (!formikArrayHelpers.current) {
                                            formikArrayHelpers.current = arrayHelpers;
                                        }
                                        return (
                                            <>
                                                {addCoscholasticGradesFormik.values.grades.length >
                                                    0 &&
                                                    addCoscholasticGradesFormik.values.grades.map(
                                                        (grade: any, index: number) => {
                                                            const inputFieldErrors: any = addCoscholasticGradesFormik.errors.grades && addCoscholasticGradesFormik.errors.grades[index] || {};
                                                            const inputFieldTouched: any = addCoscholasticGradesFormik.touched.grades && addCoscholasticGradesFormik.touched.grades[index] || {};
                                                            return (
                                                                <div
                                                                    key={grade.uniqueId}
                                                                    className="mb-3 row"
                                                                >
                                                                    <div className="col-12 col-md-4">
                                                                        <TextInput
                                                                            name={`grades[${index}].grade`}
                                                                            labelClass="required"
                                                                            value={grade.grade}
                                                                            formgroupClassName="mb-0 w-80 me-2"
                                                                            onChange={addCoscholasticGradesFormik.handleChange}
                                                                            invalid={inputFieldTouched.grade && inputFieldErrors.grade ? true : false}
                                                                            error={inputFieldTouched.grade && inputFieldErrors.grade ? inputFieldErrors.grade : ""}
                                                                        />
                                                                    </div>
                                                                    <div className="col-12 col-md-4">
                                                                        <TextInputWithRegex
                                                                            name={`grades[${index}].gradePoints`}
                                                                            labelClass="required"
                                                                            formgroupClassName="mb-0 w-80 me-2"
                                                                            value={grade.gradePoints}
                                                                            onChange={addCoscholasticGradesFormik.handleChange}
                                                                            invalid={inputFieldTouched.gradePoints && inputFieldErrors.gradePoints ? true : false}
                                                                            error={inputFieldTouched.gradePoints && inputFieldErrors.gradePoints ? inputFieldErrors.gradePoints : ""}
                                                                            allowedInputRegex="^[0-9]+$"
                                                                            maxLength={3}
                                                                        />
                                                                    </div>
                                                                    <div className="col-12 col-md-4 pe-1">
                                                                        <div className="hstack">
                                                                            
                                                                            {index !== 0 && (
                                                                                <button
                                                                                    data-index={index}
                                                                                    onClick={removeGradesHndlr}
                                                                                    className="btn-sm btn-icon btn-rounded btn-hover-danger btn btn-white"
                                                                                >
                                                                                    <i className="ri-delete-bin-2-fill" />
                                                                                </button>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        }
                                                    )}
                                            </>
                                        );
                                    }}
                                </FieldArray>
                            </FormikProvider>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="d-flex gap-2 w-auto ms-auto mx-4 mt-2 mb-3">
                        <button
                            type="button"
                            className={"btn btn-light"}
                            onClick={props.toggle}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            className={`btn btn-success`}
                            disabled={showApiLoader}
                            onClick={(event: any) => addCoscholasticGradesFormik.handleSubmit(event)}
                        >
                            Submit
                        </button>
                    </div>
                </div>
            </form>
        </>
    );
};

export default AddInternalSubjectGradesModal;
