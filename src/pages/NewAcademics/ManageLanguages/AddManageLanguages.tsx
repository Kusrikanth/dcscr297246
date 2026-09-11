import React, { useRef, useState, useEffect } from "react";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
//Common Component
import { SelectInput, TextInput } from "../../../Components/Common";
// Formik validation
import * as Yup from "yup";
import { FieldArray, useFormik, ArrayHelpers, FormikProvider } from "formik";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
//Generate Action
import { generateActionPayload } from "../../../utility/reduxutility";

//Common Utility
import { generateUniqueNumber } from "../../../utility/commonutility";

//Interface and Types
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02StrokeStandard } from "@hugeicons-pro/core-stroke-standard";
import { getAssignedClassSubjectsList, saveBranchClassLanguagesAct } from "../../../store/academic/classSubjects/classsubjectsactions";
import { getAcademicLanguagesDataAct } from "../../../store/mastersettings/instituteinfo/instituteinfoactions";
import { languagesType } from "./helper";
import Button from "../../../Components/Common/Button";

const initialValues = {
    academicYearId: "",
    curriculumId: "",
    classId: "",
    languages: [
        {
            uniqueId: generateUniqueNumber(),
            subjectId: '',
            languageId: "",
            languageType: ""
        }
    ]
};

const validationSchema = Yup.object().shape({
    languages: Yup.array().of(
        Yup.object().shape({
            subjectId: Yup.string().required("Subject is required."),
            languageId: Yup.string().required("Language is required."),
            languageType: Yup.string().required("Language Type is required."),
        })
    ),
});

const AddManageLanguages: React.FC<any> = (props) => {
    const formikArrayHelpers = useRef<ArrayHelpers | null>(null);
    const [subjectName , setSubjectName] = useState([]);

    const dispatch = useAppDispatch();
    const { showApiLoader, academicYearListResp, branchClassResp, brchCurriculumResp, assignedClassSubjectsListResp, currentInstIdResp: instituteId, academicLanguages, currentBranchIdResp: branchId } = useAppSelector(({ instAcademics, globalData, branchAcademics, classSubjectsInfo, appData, instituteInfo }) => ({
        showApiLoader: globalData.showApiLoader,
        academicYearListResp: instAcademics.academicYearListResp,
        brchCurriculumResp: branchAcademics.brchCurriculumResp,
        branchClassResp: branchAcademics.branchClassResp,
        assignedClassSubjectsListResp: classSubjectsInfo.assignedClassSubjectsListResp,
        currentInstIdResp: appData.currentInstIdResp,
        academicLanguages: instituteInfo.academicLanguages,
        currentBranchIdResp: appData.currentBranchIdResp,
    }), shallowEqual);

    const addManageLanguageForm = useFormik({
        initialValues: initialValues,
        validationSchema,
        onSubmit: (values) => {
            const { academicYearId, curriculumId, classId, languages } = values || {}
            const payload = {
                instituteId, branchId, academicYearId, curriculumId, classId,
                languages: languages.map((item: any) => ({ subjectId: item.subjectId, languageId: item.languageId, languageType: item.languageType }))
            }
            dispatch(
                saveBranchClassLanguagesAct(
                    generateActionPayload("save_branch_class_languages", undefined, payload)
                )
            );
        },
    });

    function addNewLanguageHndlr() {
        if (formikArrayHelpers.current) {
            formikArrayHelpers.current.push({ uniqueId: generateUniqueNumber(), subjectId: '', languageId: "", languageType: "" });
        }
    }

    function removeLanguageHndlr(event: React.MouseEvent<HTMLButtonElement>) {
        const rowIndex = event.currentTarget.getAttribute("data-index");
        if (rowIndex !== undefined || rowIndex !== null) {
            formikArrayHelpers.current?.remove(Number(rowIndex));
        }
    }

    const getSubjectApiCall = () => {
        const { academicYearId, curriculumId, classId } = props.modalData || {}
        const payload = {
            academicYearId, curriculumId, branchClassId: classId,
            sortBy: "subjectName", orderBy: "asc",
            pageNo: 0, pageSize: 100, isDropdownRequest: true
        }
        if (payload.academicYearId) {
            dispatch(
                getAssignedClassSubjectsList(
                    generateActionPayload("get_assigned_class_subject_list", undefined, payload)
                )
            );
        }
    }

    const getMasterLanguageApiCall = () => {
        const payload = {
            instituteId, pageNo: 0, pageSize: 100, sortBy: "languageName", orderBy: "asc"
        }
        dispatch(
            getAcademicLanguagesDataAct(
                generateActionPayload("get_academic_language_data", undefined, payload)
            )
        );
    }

    useEffect(() => {
        if (props.modalData) {
            const { academicYearId, curriculumId, classId } = props.modalData || {}
            addManageLanguageForm.setValues((prev: any) => ({ ...prev, academicYearId: academicYearId, curriculumId: curriculumId, classId: classId }))
            getSubjectApiCall()
            getMasterLanguageApiCall()
        }
    }, [props.modalData])

    useEffect(()=>{
        if(assignedClassSubjectsListResp?.data){
            const subjectName = assignedClassSubjectsListResp?.data?.filter((item: any)=> item.subjectType === "SCHOLASTIC" && item.scholasticType === "LANGUAGE")
            
            setSubjectName(subjectName)
        }
    },[assignedClassSubjectsListResp])

    const { data: academicYearList } = academicYearListResp || {};
    const { data: curriculumTypes } = brchCurriculumResp || {}
    const { content: classTypes } = branchClassResp || {};

    return (
        <div className="tw-p-5">
            <div className="tw-grid tw-grid-cols-12 tw-gap-4">
                <div className="tw-col-span-12 md:tw-col-span-4">
                    <SelectInput
                        name="academicYearId"
                        value={addManageLanguageForm.values.academicYearId}
                        onChange={addManageLanguageForm.handleChange}
                        menuItems={academicYearList || []}
                        valueKey="academicYearId"
                        textKey="academicYearName"
                        labelText="Academic Year"
                        formgroupClassName="tw-mb-0"
                        isDisabled
                    />
                </div>
                <div className="tw-col-span-12 md:tw-col-span-4">
                    <SelectInput
                        name="curriculumId"
                        value={addManageLanguageForm.values.curriculumId}
                        onChange={addManageLanguageForm.handleChange}
                        menuItems={curriculumTypes || []}
                        valueKey="branchCurriculumId"
                        textKey="curriculumName"
                        labelText="Curriculum"
                        formgroupClassName="tw-mb-0"
                        isDisabled
                    />
                </div>
                <div className="tw-col-span-12 md:tw-col-span-4">
                    <SelectInput
                        name="classId"
                        value={addManageLanguageForm.values.classId}
                        onChange={addManageLanguageForm.handleChange}
                        menuItems={classTypes || []}
                        valueKey="id"
                        textKey="shortName"
                        labelText="Class"
                        formgroupClassName="tw-mb-0"
                        isDisabled
                    />
                </div>
            </div>
            <div className="tw-mt-6 tw-mb-2">
                <div className="tw-grid tw-grid-cols-12 tw-gap-4">

                    <div className="tw-col-span-4">
                        <label className="tw-text-sm tw-font-semibold">
                            Subject Name
                        </label>
                    </div>
                    <div className="tw-col-span-4">
                        <label className="tw-text-sm tw-font-semibold">
                            Language Name
                        </label>
                    </div>
                    <div className="tw-col-span-4">
                        <label className="tw-text-sm tw-font-semibold">
                            Language Type
                        </label>
                    </div>
                </div>
            </div>
            <div className="tw-space-y-4">
                <FormikProvider value={addManageLanguageForm}>
                    <FieldArray name="languages">
                        {(arrayHelpers: ArrayHelpers) => {
                            if (!formikArrayHelpers.current) {
                                formikArrayHelpers.current = arrayHelpers;
                            }

                            return (
                                <>
                                    {addManageLanguageForm.values.languages.map((language: any, index: number) => {
                                        const inputFieldErrors: any = addManageLanguageForm.errors.languages && addManageLanguageForm.errors.languages[index] || {};
                                        const inputFieldTouched = addManageLanguageForm.touched.languages && addManageLanguageForm.touched.languages[index] || {};

                                        return (
                                            <div key={language.uniqueId} className="tw-grid tw-grid-cols-12 tw-gap-4 tw-items-center">
                                                <div className="tw-col-span-12 md:tw-col-span-4">
                                                    <SelectInput
                                                        name={`languages[${index}].subjectId`}
                                                        value={language.subjectId}
                                                        menuItems={subjectName}
                                                        valueKey="subjectId"
                                                        textKey="subjectName"
                                                        formgroupClassName="tw-mb-0"
                                                        onChange={addManageLanguageForm.handleChange}
                                                        invalid={(inputFieldTouched.subjectId && inputFieldErrors.subjectId) ? true : false}
                                                        error={(inputFieldTouched.subjectId && inputFieldErrors.subjectId) ? inputFieldErrors.subjectId : ""}
                                                    />
                                                </div>
                                                <div className="tw-col-span-12 md:tw-col-span-4">
                                                    <SelectInput
                                                        name={`languages[${index}].languageId`}
                                                        value={language.languageId}
                                                        menuItems={academicLanguages?.data}
                                                        valueKey="languageId"
                                                        textKey="languageName"
                                                        formgroupClassName="tw-mb-0"
                                                        onChange={addManageLanguageForm.handleChange}
                                                        invalid={(inputFieldTouched.languageId && inputFieldErrors.languageId) ? true : false}
                                                        error={(inputFieldTouched.languageId && inputFieldErrors.languageId) ? inputFieldErrors.languageId : ""}
                                                    />
                                                </div>
                                                <div className="tw-col-span-12 md:tw-col-span-4 tw-flex tw-items-center tw-gap-2">
                                                    <SelectInput
                                                        name={`languages[${index}].languageType`}
                                                        value={language.languageType}
                                                        menuItems={languagesType}
                                                        valueKey="id"
                                                        textKey="name"
                                                        formgroupClassName="mb-0 w-80"
                                                        onChange={addManageLanguageForm.handleChange}
                                                        invalid={(inputFieldTouched.languageType && inputFieldErrors.languageType) ? true : false}
                                                        error={(inputFieldTouched.languageType && inputFieldErrors.languageType) ? inputFieldErrors.languageType : ""}
                                                    />
                                                    {index !== 0 && (
                                                        <Button
                                                            type="button"
                                                            variant="wrong"
                                                            data-index={index}
                                                            onClick={removeLanguageHndlr}
                                                        >
                                                            <HugeiconsIcon
                                                                icon={Delete02StrokeStandard}
                                                                className="tw-text-red-500"
                                                                size={18}
                                                            />
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </>
                            );
                        }}
                    </FieldArray>
                </FormikProvider>
            </div>
            <div className="tw-mt-4 tw-justify-end">
                <Button
                    type="button"
                    variant="soft"
                    onClick={addNewLanguageHndlr}
                >
                    <i className="ri-add-line"></i>
                    Add New
                </Button>
            </div>
            <div className="tw-flex tw-justify-end tw-gap-3 tw-mt-3">
                <Button
                    type="button"
                    variant="secondary"
                    onClick={props.toggle}
                >
                    Cancel
                </Button>
                <Button
                    type="button"
                    variant="primary"
                    onClick={(event: any) => addManageLanguageForm.handleSubmit(event)}
                    disabled={showApiLoader}
                >
                    {props.curriculumId ? "Update" : "Submit"}
                </Button>
            </div>
        </div>
    )
}

export default React.memo(AddManageLanguages);

