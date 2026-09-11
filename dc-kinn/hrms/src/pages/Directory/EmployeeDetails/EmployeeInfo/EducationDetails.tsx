import { useFormik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { shallowEqual, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { SelectInput, TextInput } from "../../../../Components/Common";
import { useAppSelector } from "../../../../hooks/storehook";
import { getBranchClassAct, getBranchCurriculumAct, getBrchSectionsAct } from "../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { addEmployeeAct, getEmployeeByIdAct } from "../../../../store/directory/employeemanagement/employeemanagementactions";
import { updateStudentAct } from "../../../../store/directory/studentmanagement/studentmanagementactions";
import { getEmployeeSpecializationAct, getQualificationAct, getUniversityAct } from "../../../../store/masterdata/masterdataactions";
import { getAcademicLanguagesDataAct } from "../../../../store/mastersettings/instituteinfo/instituteinfoactions";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { IPropsTypes, IUpdateEmployeeRepRef } from "./EmployeeInfoTypes";
import * as Yup from 'yup';
import { CampusTypeOptions, details, formSectionSaveKey } from "./helper";
import { getInstAcademicYearAct } from "../../../../store/mastersettings/instacademics/instacademicactions";
import { Current_Year, getAcademicYears } from "../../../../utility/dateutility";
import { default as EditSvg } from "../../../../assets/imagesdps/directory/EditSvgIcon.svg?react";
import { AccordionBody, AccordionHeader } from "reactstrap";
import Button from "../../../../Components/Common/Button";


export default function EducationDetails({ employeeId, divId, canCreateAndUpdate }: any) {
    const dispatch = useDispatch()
    const initialValues = (data?: any) => {
        return {
            employeeId: data?.employeeId || "",
            qualificationName: data?.qualificationName || "",
            universityName: data?.universityName ? (data.universityName).toString() : "",
            passoutYear: data?.passoutYear || "",
            otherAchievements: data?.otherAchievements || "",
            specializationName: data?.specializationName || ""
        }
    }
    const [edit, setEdit] = useState(false);
    const [sectionList, setSectionList] = useState([]);
    const [initialData, setInitialData] = useState(initialValues());

    const validationSchema = Yup.object().shape({
        qualificationName: Yup.string().nullable(),
        universityName: Yup.string().nullable(),
        passoutYear: Yup.string().nullable(),
        specializationName: Yup.string().nullable(),
    });

    const educationDetailsForm = useFormik({
        enableReinitialize: true,
        initialValues: initialData,
        validationSchema,
        onSubmit: (values) => {

            let formData = new FormData();
            const data = details(getEmployeeByIdResp, values, "Employee Education Details", { branchId: branchId, instituteId: instituteId }, formSectionSaveKey.educationDetails);

            formData.append("employeeRequest", JSON.stringify(data));
            formData.forEach((value, key) => {
                console.log(key, value);
            });
            dispatch(updateStudentAct(generateActionPayload('add_employee', undefined, formData, {
                affectedSection: "Employee Education Details"
            })));
        },
    });
    const EditHandler = (event: any) => {
        setEdit(true);
    }
    const { getEmployeeByIdResp, updateStudentResp, affectedSection, academicLanguages, brchCurriculumResp, branchClassResp, qualificationsListResp, universityListResp, employeeSpecializationResp, brchSectionsResp, currentInstIdResp: instituteId, currentBranchIdResp: branchId } = useAppSelector(
        ({ directoryEmployee, directoryStudent, instituteInfo, branchAcademics, masterData, appData }) => ({
            getEmployeeByIdResp: directoryEmployee.getEmployeeByIdResp,
            updateStudentResp: directoryStudent.updateStudentResp,
            affectedSection: directoryStudent.affectedSection,
            academicLanguages: instituteInfo.academicLanguages,
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            branchClassResp: branchAcademics.branchClassResp,
            brchSectionsResp: branchAcademics.brchSectionsResp,
            qualificationsListResp: masterData.qualificationsListResp,
            universityListResp: masterData.universityListResp,
            employeeSpecializationResp: masterData.employeeSpecializationResp,
            currentInstIdResp: appData.currentInstIdResp,
            currentBranchIdResp: appData.currentBranchIdResp,
        }),
        shallowEqual
    );
    const EmployeeEducationRef = useRef<IUpdateEmployeeRepRef>({
        prevUpdateEmployeeRep: updateStudentResp
    });
    const getEmployeeDetailsAPI = () => {
        dispatch(getEmployeeByIdAct(generateActionPayload("get_employee_byid", { employeeId: employeeId })));
    }
    const UpdateHandler = () => {
        getEmployeeDetailsAPI();
        setEdit(false);
    }

    const CancelHandler = () => {
        educationDetailsForm.setValues(initialValues(getEmployeeByIdResp.employeeEducationDetails)).then(() => {
            educationDetailsForm.setErrors({});
        });
        setEdit(false);
    }

    useEffect(() => {
        dispatch(getQualificationAct(generateActionPayload("get_global_records_by_search_string", undefined, { categoryName: "QUALIFICATIONS", searchString: "", pageNo: 0, pageSize: 100, orderBy: "asc", sortBy: "qualification" })));
        dispatch(getUniversityAct(generateActionPayload("get_global_records_by_search_string", undefined, { categoryName: "UNIVERSITIES", searchString: "", pageNo: 0, pageSize: 1100, orderBy: "asc", sortBy: "universityName" })));
        dispatch(getEmployeeSpecializationAct(generateActionPayload("get_employee_specialization")));

    }, [])

    useEffect(() => {
        const { prevUpdateEmployeeRep } =
            EmployeeEducationRef.current;

        if (updateStudentResp &&
            prevUpdateEmployeeRep !== updateStudentResp) {
            if (affectedSection === "Employee Education Details") {
                toast.success("Employee Education Details Updated successfully.");
                UpdateHandler();
            }
        }
        EmployeeEducationRef.current.prevUpdateEmployeeRep = updateStudentResp;
    }, [affectedSection, updateStudentResp]);
    useEffect(() => {

        getEmployeeByIdResp && setInitialData(initialValues(getEmployeeByIdResp.employeeEducationDetails));

    }, [getEmployeeByIdResp]);
    const { data: QulificationData } = qualificationsListResp || {}
    const { data: UnivercityData } = universityListResp || {}


    return (
        <div>
            <AccordionHeader tag="h4" targetId="education-info">
                Education
            </AccordionHeader>
            <AccordionBody accordionId="education-info">
                <div id={divId}>
                    <div className="tw-p-0">
                        <div className="tw-flex tw-flex-wrap tw-mb-2 tw--mx-2">

                            <div className="tw-w-full lg:tw-w-1/2 tw-px-2">
                                <TextInput
                                    name="qualificationName"
                                    labelText="Highest Qualification"
                                    value={educationDetailsForm.values.qualificationName}
                                    onChange={educationDetailsForm.handleChange}
                                    onBlur={educationDetailsForm.handleBlur}
                                    isReadOnly={!edit}
                                    labelClass="tw-font-semibold tw-text-sm tw-mb-0"
                                    inputClassName={
                                        "!tw-bg-transparent " +
                                        `${!edit ? "!tw-border-0 !tw-rounded-none" : ""}`
                                    }
                                    formgroupClassName="tw-mb-4 tw-flex tw-items-center input-field"
                                    invalid={(educationDetailsForm.touched.qualificationName && educationDetailsForm.errors.qualificationName) ? true : false}
                                    error={(educationDetailsForm.touched.qualificationName && educationDetailsForm.errors.qualificationName) ? educationDetailsForm.errors.qualificationName : ""}
                                />
                            </div>

                            <div className="tw-w-full lg:tw-w-1/2 tw-px-2">
                                <TextInput
                                    name="universityName"
                                    labelText="Institute / University"
                                    value={educationDetailsForm.values.universityName}
                                    onChange={educationDetailsForm.handleChange}
                                    onBlur={educationDetailsForm.handleBlur}
                                    isReadOnly={!edit}
                                    labelClass="tw-font-semibold tw-text-sm tw-mb-0"
                                    inputClassName={
                                        "!tw-bg-transparent " +
                                        `${!edit ? "!tw-border-0 !tw-rounded-none" : ""}`
                                    }
                                    formgroupClassName="tw-mb-4 tw-flex tw-items-center input-field"
                                    invalid={(educationDetailsForm.touched.universityName && educationDetailsForm.errors.universityName) ? true : false}
                                    error={(educationDetailsForm.touched.universityName && educationDetailsForm.errors.universityName) ? educationDetailsForm.errors.universityName : ""}
                                />
                            </div>

                            <div className="tw-w-full lg:tw-w-1/2 tw-px-2">
                                <SelectInput
                                    name="passoutYear"
                                    labelText="Passing Year"
                                    value={educationDetailsForm.values.passoutYear}
                                    onChange={educationDetailsForm.handleChange}
                                    onBlur={educationDetailsForm.handleBlur}
                                    valueKey="year"
                                    textKey="year"
                                    menuItems={getAcademicYears(Current_Year, 1960, 0, "dec")}
                                    isReadOnly={!edit}
                                    isDisabled={!edit}
                                    inputClassName={
                                        "!tw-bg-transparent " +
                                        `${!edit ? "!tw-border-0 !tw-rounded-none bg-img-none" : ""}`
                                    }
                                    formgroupClassName="tw-mb-4 tw-flex tw-items-center input-field"
                                    labelClass="tw-font-semibold tw-text-sm tw-mb-0"
                                    invalid={
                                        educationDetailsForm.touched.passoutYear &&
                                            educationDetailsForm.errors.passoutYear
                                            ? true
                                            : false
                                    }
                                    error={
                                        educationDetailsForm.touched.passoutYear &&
                                            educationDetailsForm.errors.passoutYear
                                            ? educationDetailsForm.errors.passoutYear
                                            : ""
                                    }
                                />
                            </div>
                            <div className="tw-w-full lg:tw-w-1/2 tw-px-2">
                                <TextInput
                                    name="specializationName"
                                    labelText="Any Specialization"
                                    value={educationDetailsForm.values.specializationName}
                                    onChange={educationDetailsForm.handleChange}
                                    onBlur={educationDetailsForm.handleBlur}
                                    isReadOnly={!edit}
                                    labelClass="tw-font-semibold tw-text-sm tw-mb-0"
                                    inputClassName={
                                        "!tw-bg-transparent " +
                                        `${!edit ? "!tw-border-0 !tw-rounded-none" : ""}`
                                    }
                                    formgroupClassName="tw-mb-4 tw-flex tw-items-center input-field"
                                    invalid={(educationDetailsForm.touched.specializationName && educationDetailsForm.errors.specializationName) ? true : false}
                                    error={(educationDetailsForm.touched.specializationName && educationDetailsForm.errors.specializationName) ? educationDetailsForm.errors.specializationName : ""}
                                />
                            </div>

                            <div className="tw-w-full lg:tw-w-1/2 tw-px-2">
                                <TextInput
                                    name="otherAchievements"
                                    labelText="Other Achievements"
                                    value={educationDetailsForm.values.otherAchievements}
                                    onChange={educationDetailsForm.handleChange}
                                    onBlur={educationDetailsForm.handleBlur}
                                    isReadOnly={!edit}
                                    labelClass="tw-font-semibold tw-text-sm tw-mb-0"
                                    inputClassName={
                                        "!tw-bg-transparent " +
                                        `${!edit ? "!tw-border-0 !tw-rounded-none" : ""}`
                                    }
                                    formgroupClassName="tw-mb-4 tw-flex tw-items-center input-field"
                                    invalid={
                                        educationDetailsForm.touched.otherAchievements &&
                                            educationDetailsForm.errors.otherAchievements
                                            ? true
                                            : false
                                    }
                                    error={
                                        educationDetailsForm.touched.otherAchievements &&
                                            educationDetailsForm.errors.otherAchievements
                                            ? educationDetailsForm.errors.otherAchievements
                                            : ""
                                    }
                                />
                            </div>
                        </div>

                        {canCreateAndUpdate && <>{!edit && (
                            <div className="tw-flex tw-justify-end">
                                <Button
                                    variant="hoverInfo"
                                    onClick={EditHandler}
                                >
                                    <i className="ri-pencil-line tw-mr-2 tw-text-base"></i>
                                    Edit
                                </Button>
                            </div>
                        )}

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
                                    onClick={(e: any) => educationDetailsForm.handleSubmit(e)}
                                >
                                    Update
                                </Button>
                            </div>
                        )}</>}
                    </div>
                </div>
            </AccordionBody>
        </div>
    )
}