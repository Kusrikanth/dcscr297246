import { useFormik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { shallowEqual, useDispatch } from "react-redux";
import * as Yup from "yup";

import {  details } from "./helper";

import { toast } from "react-toastify";

import { validateNumber } from "../../../../../utility/validationutility";
import { generateActionPayload } from "../../../../../utility/reduxutility";
import { getStudentByIdAct, updateStudentAct } from "../../../../../store/directory/studentmanagement/studentmanagementactions";
import { useAppSelector } from "../../../../../hooks/storehook";
import { getAcademicLanguagesDataAct } from "../../../../../store/mastersettings/instituteinfo/instituteinfoactions";
import { getBranchClassAct, getBranchCurriculumAct, getBrchSectionsAct } from "../../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { getHouseDetailsAct } from "../../../../../store/masterdata/masterdataactions";
import { SelectInput, TextInputWithRegex } from "../../../../../Components/Common";
import Button from "../../../../../Components/Common/Button";

interface IAcademicDetails {
    studentId: number;
    academicYearId: string;
    branchId: number;
    instituteId: number;
    divId: string;

}
export default function AcademicsDetails(props: IAcademicDetails) {
    const dispatch = useDispatch()
    const [classList, setClassList] = useState([]);
    const initialValues = (data?: any) => {
        return {
            academicId: data?.id || "",
            campusType: data?.campusType || "",
            curriculumId: data?.curriculumId || "",
            classId: data?.classId || "",
            sectionId: data?.sectionId || "",
            rollNo: validateNumber(+data?.rollNo) && data?.rollNo || "",
            firstLanguageId: data?.firstLanguageId || "",
            secondLanguageId: data?.secondLanguageId || "",
            thirdLanguageId: data?.thirdLanguageId || "",
            admissionCategory: data?.admissionCategory || "",
            admissionType: data?.admissionType || ""
        }
    }
    const validationSchema = Yup.object().shape({
        // campusType: Yup.string().required("Campus Type required."),
        curriculumId: Yup.string().required("Curriculum is required."),
        classId: Yup.string().required("Class is required."),
        sectionId: Yup.string().required("Section is required."),
        rollNo: Yup.string().required("Roll No is required.").max(5, "Roll No should be 5 digit only"),
        firstLanguageId: Yup.string().required("Select first language."),
        secondLanguageId: Yup.string().required("Select second language.").test("secondLanguageIdCheck", "Second language should not be same as first language.",
            (value: any, schema: any) => {
                if (value && value === schema.parent?.firstLanguageId) {
                    return false
                }
                return true;
            }),
        thirdLanguageId: Yup.string().required("Select third language.").test("thirdLanguageIdCheck", "Third language should not be same as first language and second language.",
            (value: any, schema: any) => {
                if (value && ((value === schema.parent?.firstLanguageId) || (value === schema.parent?.secondLanguageId))) {
                    return false
                }
                return true;
            }),
        // admissionCategory: Yup.string().required("Admission Category is required."),
        // admissionType: Yup.string().required("Admission Type is required."),
        // admissionNo: Yup.string().required("Admission No is required."),
    });
    const [edit, setEdit] = useState(false);
    const [sectionListState, setSectionListState] = useState([]);
    const [initialData, setInitialData] = useState(initialValues());
    const academicDetailsForm = useFormik({
        enableReinitialize: true,
        initialValues: initialData,
        validationSchema,
        onSubmit: (values) => {
            let formData = new FormData();
            const data = details(getStudentByIdResp, values, { branchId: props.branchId, instituteId: props.instituteId });
            formData.append("studentRequest", JSON.stringify(data));
            dispatch(updateStudentAct(generateActionPayload('update_students_by_id', undefined, formData, {
                affectedSection: "Student Academic Details"
            })));
        },
    });
    // const studentDetailsForm=useFormik({
    //     initialValues:initialValues,
    //     onsubmit:()=>{

    //     }
    // })
    const EditHandler = (event: any) => {
        setEdit(true);
    }
    const CancelHandler = () => {
        // setInitialData(initialValues(getStudentByIdResp.studentAcademicDetails));
        // academicDetailsForm.setValues(initialValues(getStudentByIdResp.studentAcademicDetails));
        academicDetailsForm.setValues(initialValues(getStudentByIdResp.studentAcademicDetails)).then(() => {
            academicDetailsForm.setErrors({});
        });
        setEdit(false);
    }
    const getStudentDetailsAPI = () => {
        // const params={academicYearId:props.academicYearId}
        dispatch(getStudentByIdAct(generateActionPayload("get_students_by_id", { studentId: props.studentId }, { academicYearId: props.academicYearId })));
    }
    const UpdateHandler = () => {
        getStudentDetailsAPI();
        setEdit(false);
    }
    const { getStudentByIdResp, updateStudentResp, academicLanguages, brchCurriculumResp, branchClassResp, brchSectionsResp, affectedSection, brchCurriculumClassResp } = useAppSelector(
        ({ directoryStudent, instituteInfo, branchAcademics, masterData }) => ({
            getStudentByIdResp: directoryStudent.getStudentByIdResp,
            updateStudentResp: directoryStudent.updateStudentResp,
            affectedSection: directoryStudent.affectedSection,
            academicLanguages: instituteInfo.academicLanguages,
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            branchClassResp: branchAcademics.branchClassResp,
            brchSectionsResp: branchAcademics.brchSectionsResp,
            brchCurriculumClassResp: branchAcademics.brchCurriculumClassResp,
        }),
        shallowEqual
    );
    const StudentAcademicDetailsRef = useRef<any>({
        preUpdateStudentDetails: updateStudentResp
    });

    useEffect(() => {
        const { preUpdateStudentDetails } =
            StudentAcademicDetailsRef.current;

        if (updateStudentResp &&
            preUpdateStudentDetails !== updateStudentResp) {
            if (affectedSection === "Student Academic Details") {
                toast.success("Student Academic Details Updated successfully.");
                UpdateHandler();
            }
        }
        StudentAcademicDetailsRef.current.preUpdateStudentDetails = updateStudentResp;
    }, [affectedSection, updateStudentResp]);

    useEffect(() => {
        const payload = {
            instituteId: props.instituteId,
            pageNo: 0,
            pageSize: 1000,
            sortBy: "languageName",
            orderBy: "asc"
        }
        dispatch(
            getAcademicLanguagesDataAct(
                generateActionPayload("get_academic_language_data", undefined, payload)
            )
        );
        const payload1 = { branchId: props.branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" };
        dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
        // dispatch(getBrchCurriculumClassAct(generateActionPayload("get_brnch_curriclum_class_mapping", payload1)));


    }, [])

    useEffect(() => {
        if (props.instituteId) {
            const payload = {
                instituteId: props.instituteId,
            }
            dispatch(getHouseDetailsAct(generateActionPayload("get_house_details", undefined, payload)));
        }
    }, [props.instituteId]);

    useEffect(() => {
        if (initialData.curriculumId && initialData.classId) {

            const payload1 = { branchId: props.branchId, academicYearId: props.academicYearId, branchCurriculumId: initialData.curriculumId, classId: initialData.classId, pageNo: 0, pageSize: 100 };

            dispatch(getBrchSectionsAct(generateActionPayload("get_brch_sections", undefined, payload1)));
        }
        // if (initialData.curriculumId) {
        //     const payload = { branchId: +props.branchId, curriculumId: initialData.curriculumId, pageNo: 0, pageSize: 100,sortBy:"className",orderBy:"asc" };
        //     dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
        //     // if (Array.isArray(brchCurriculumClassResp))
        //     //     setClassList(brchCurriculumClassResp.find((curr: any) => curr.branchCurriculumId == initialData.curriculumId)?.classDTOS || [])
        // }
    }, [initialData])
    useEffect(() => {
        if (getStudentByIdResp) {
            setInitialData(initialValues(getStudentByIdResp.studentAcademicDetails));
            const payload = { branchId: +props.branchId, curriculumId: getStudentByIdResp.studentAcademicDetails.curriculumId, pageNo: 0, pageSize: 100, sortBy: "classSequence", orderBy: "asc" };
            dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
            const sectionPayload = { branchId: props.branchId, academicYearId: props.academicYearId, branchCurriculumId: getStudentByIdResp.studentAcademicDetails.curriculumId, classId: getStudentByIdResp.studentAcademicDetails.classId, sortBy: "sectionName", orderBy: "asc" };
            dispatch(getBrchSectionsAct(generateActionPayload("get_brch_sections", undefined, sectionPayload)));
        }
    }, [getStudentByIdResp]);

    useEffect(() => {
        if (brchSectionsResp) {
            const { classId } = academicDetailsForm.values;
            sectionListHandler(classId);
        }
    }, [brchSectionsResp]);

    function sectionListHandler(classId: any) {
        const { data: sectionList } = brchSectionsResp || {};
        if (Array.isArray(sectionList)) {
            setSectionListState(sectionList.find((section: any) => section.branchClassId === +classId)?.sectionsResponse)
        }
    }


    const curriculumHandler = (event: any) => {
        academicDetailsForm.handleChange(event);
        const { name, value } = event.target;
        const payload = { branchId: +props.branchId, curriculumId: value, pageNo: 0, pageSize: 100, sortBy: "classSequence", orderBy: "asc" };
        dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
        academicDetailsForm.setFieldValue('classId', '');
        academicDetailsForm.setFieldValue('sectionId', '');
        setSectionListState([]);
    }
    const classHandler = (event: any) => {
        academicDetailsForm.handleChange(event);
        if(!event.target.value){
            setSectionListState([]);
            return;
        }
        const payload1 = { branchId: props.branchId, academicYearId: props.academicYearId, branchCurriculumId: initialData.curriculumId, classId: event.target.value, pageNo: 0, pageSize: 100, sortBy: "sectionName", orderBy: "asc" };
        dispatch(getBrchSectionsAct(generateActionPayload("get_brch_sections", undefined, payload1)));
    }

    const { data: LanguagesData } = academicLanguages || {};
    const { data: CurriculumList } = brchCurriculumResp || {};
    const { content: ClassList } = branchClassResp || {};
    return (
        <div id={props.divId} className="tw-rounded-lg tw-border tw-border-gray-200 tw-bg-white tw-shadow-sm tw-mb-4">
            <div className="tw-flex tw-items-center tw-px-5 tw-py-4 tw-border-b tw-border-gray-200">
                <h4 className="tw-text-base tw-font-semibold tw-m-0">Academics</h4>
            </div>
            <div className="tw-p-5">
                <div className="tw-grid tw-grid-cols-2 xl:tw-grid-cols-3 tw-gap-4 tw-mb-3">
                    <div>
                        <SelectInput
                            name="curriculumId"
                            labelText="Curriculum"
                            value={academicDetailsForm.values.curriculumId}
                            onChange={curriculumHandler}
                            valueKey="branchCurriculumId"
                            textKey="curriculumName"
                            menuItems={CurriculumList || []}
                            isReadOnly={!edit}
                            isDisabled={!edit}
                            onBlur={academicDetailsForm.handleBlur}
                             inputClassName={`${!edit ? '!tw-border-0 !tw-border-b !tw-rounded-0 !tw-bg-transparent' : "bg-light"}`}
                            invalid={academicDetailsForm.touched.curriculumId && academicDetailsForm.errors.curriculumId ? true : false}
                            error={academicDetailsForm.touched.curriculumId && academicDetailsForm.errors.curriculumId ? academicDetailsForm.errors.curriculumId : ""}
                            labelClass="tw-text-gray-500"
                        />
                    </div>
                    <div>
                        <SelectInput
                            name="classId"
                            labelText="Class"
                            value={academicDetailsForm.values.classId}
                            onChange={classHandler}
                            onBlur={academicDetailsForm.handleBlur}
                            valueKey="id"
                            textKey="shortName"
                            menuItems={ClassList || {}}
                            isReadOnly={!edit}
                            isDisabled={!edit}
                            inputClassName={`${!edit ? '!tw-border-0 !tw-border-b !tw-rounded-0 !tw-bg-transparent' : "bg-light"}`}
                            invalid={academicDetailsForm.touched.classId && academicDetailsForm.errors.classId ? true : false}
                            error={academicDetailsForm.touched.classId && academicDetailsForm.errors.classId ? academicDetailsForm.errors.classId : ""}
                            labelClass="tw-text-gray-500"
                        />
                    </div>
                    <div>
                        <SelectInput
                            name="sectionId"
                            labelText="Section"
                            value={academicDetailsForm.values.sectionId}
                            onChange={academicDetailsForm.handleChange}
                            onBlur={academicDetailsForm.handleBlur}
                            valueKey="sectionId"
                            textKey="sectionName"
                            menuItems={sectionListState || []}
                            isReadOnly={!edit}
                            isDisabled={!edit}
                            inputClassName={`${!edit ? '!tw-border-0 !tw-border-b !tw-rounded-0 !tw-bg-transparent' : "bg-light"}`}
                            invalid={academicDetailsForm.touched.sectionId && academicDetailsForm.errors.sectionId ? true : false}
                            error={academicDetailsForm.touched.sectionId && academicDetailsForm.errors.sectionId ? academicDetailsForm.errors.sectionId : ""}
                            labelClass="tw-text-gray-500"
                        />
                    </div>
                    <div>
                        <TextInputWithRegex
                            name="rollNo"
                            labelText="Roll No"
                            value={academicDetailsForm.values.rollNo}
                            onChange={academicDetailsForm.handleChange}
                            onBlur={academicDetailsForm.handleBlur}
                            inputClassName={`${!edit ? '!tw-border-0 !tw-border-b !tw-rounded-0 !tw-bg-transparent' : "bg-light"}`}
                            isReadOnly={!edit}
                            invalid={academicDetailsForm.touched.rollNo && academicDetailsForm.errors.rollNo ? true : false}
                            error={academicDetailsForm.touched.rollNo && academicDetailsForm.errors.rollNo ? academicDetailsForm.errors.rollNo : ""}
                            labelClass="tw-text-gray-500"
                            allowedInputRegex="^[0-9]+$"
                            maxLength={5}
                        />
                    </div>
                    <div>
                        <SelectInput
                            name="firstLanguageId"
                            labelText="First Language"
                            value={academicDetailsForm.values.firstLanguageId}
                            onChange={academicDetailsForm.handleChange}
                            onBlur={academicDetailsForm.handleBlur}
                            valueKey="languageId"
                            textKey="languageName"
                            menuItems={LanguagesData || []}
                            isReadOnly={!edit}
                            isDisabled={!edit}
                            inputClassName={`${!edit ? '!tw-border-0 !tw-border-b !tw-rounded-0 !tw-bg-transparent' : "bg-light"}`}
                            invalid={academicDetailsForm.touched.firstLanguageId && academicDetailsForm.errors.firstLanguageId ? true : false}
                            error={academicDetailsForm.touched.firstLanguageId && academicDetailsForm.errors.firstLanguageId ? academicDetailsForm.errors.firstLanguageId : ""}
                            labelClass="tw-text-gray-500"
                        />
                    </div>
                    <div>
                        <SelectInput
                            name="secondLanguageId"
                            labelText="Second Language"
                            value={academicDetailsForm.values.secondLanguageId}
                            onChange={academicDetailsForm.handleChange}
                            onBlur={academicDetailsForm.handleBlur}
                            valueKey="languageId"
                            textKey="languageName"
                            menuItems={LanguagesData || []}
                            isReadOnly={!edit}
                            isDisabled={!edit}
                            inputClassName={`${!edit ? '!tw-border-0 !tw-border-b !tw-rounded-0 !tw-bg-transparent' : "bg-light"}`}
                            invalid={academicDetailsForm.touched.secondLanguageId && academicDetailsForm.errors.secondLanguageId ? true : false}
                            error={academicDetailsForm.touched.secondLanguageId && academicDetailsForm.errors.secondLanguageId ? academicDetailsForm.errors.secondLanguageId : ""}
                            labelClass="tw-text-gray-500"
                        />
                    </div>
                    <div>
                        <SelectInput
                            name="thirdLanguageId"
                            labelText="Third Language"
                            value={academicDetailsForm.values.thirdLanguageId}
                            onChange={academicDetailsForm.handleChange}
                            onBlur={academicDetailsForm.handleBlur}
                            valueKey="languageId"
                            textKey="languageName"
                            menuItems={LanguagesData || []}
                            isReadOnly={!edit}
                            isDisabled={!edit}
                            inputClassName={`${!edit ? '!tw-border-0 !tw-border-b !tw-rounded-0 !tw-bg-transparent' : "bg-light"}`}
                            invalid={academicDetailsForm.touched.thirdLanguageId && academicDetailsForm.errors.thirdLanguageId ? true : false}
                            error={academicDetailsForm.touched.thirdLanguageId && academicDetailsForm.errors.thirdLanguageId ? academicDetailsForm.errors.thirdLanguageId : ""}
                            labelClass="tw-text-gray-500"
                        />
                    </div>
                </div>
                {edit && (
                    <div className="tw-flex tw-justify-end tw-gap-3 tw-pb-3">
                        <Button
                            variant="secondary"
                            onClick={CancelHandler}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            onClick={(e: any) => academicDetailsForm.handleSubmit(e)}
                        >
                            Update
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}