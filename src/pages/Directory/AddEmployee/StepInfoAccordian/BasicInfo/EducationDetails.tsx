import { useState, useEffect, useImperativeHandle, useContext, useRef, useMemo } from "react";
import { shallowEqual } from "react-redux";
import { UncontrolledAccordion, AccordionBody, AccordionHeader, AccordionItem, Collapse } from "reactstrap";

import { useFormik } from "formik";
import * as Yup from "yup";
import {
    ModalContainer, TextIconInput, TextInput, DateInput, SelectInput, PhoneInput,
    RadioInputContainer, Switch,
    UploadImage
} from "../../../../../Components/Common";

import StudentImgIcon from "../../../../../assets/imagesdps/directory/user-img.png";

//Helper
import {
    studentUIDTypes, yesNoOptions, admissionTypes, genderOptions, bloodGroupOptions,
    nationalityOptions, trueFalseOptions, languageOptions,
    houseNameOptions, admissionCategory, motherToungeOptions,
    religionOptions, specializationCategory, passingYears
} from "../helper";
import { StepperFormContext } from "../../helper";
//Action Generator
import { generateActionPayload } from "../../../../../utility/reduxutility";
import {
    getNationalityAct, getReligionAct, getBloodGroupAct, getGenderListAct, getQualificationAct, getUniversityAct,
    getEmployeeSpecializationAct
} from "../../../../../store/masterdata/masterdataactions";
import {
    getInstAcademicYearAct,
} from "../../../../../store/mastersettings/instacademics/instacademicactions";
import {
    getGlobalRecordsAct,
} from "../../../../../store/mastersettings/instituteinfo/instituteinfoactions";
//Utility
import { getAcademicYears } from "../../../../../utility/dateutility";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";


const validationSchema = Yup.object().shape({
    // otherAchievements: Yup.string().required("Address required."),
    passoutYear: Yup.string().nullable(),
    qualificationName: Yup.string().nullable(),
    universityName: Yup.string().nullable(),
    specializationName: Yup.string().nullable(),
});



function getInitialState(initialState?: any) {
    return {
        employeeId: initialState?.employeeId || undefined,
        otherAchievements: initialState?.otherAchievements || "",
        passoutYear: initialState?.passoutYear || "",
        qualificationName: initialState?.qualificationName || "",
        specializationId: initialState?.specializationId || "",
        universityName: initialState?.universityName || "",
        specializationName: initialState?.specializationName || "",
    }
}

export default function EducationDetails({ branchId, instituteId }: any) {
    const [educationDetailState, setEducationDetailState] = useState<any>(getInitialState());
    const { currentMultiFormKeys, editEmployeeData,
        storeMultiFormData } = useContext<any>(StepperFormContext);

    const dispatch = useAppDispatch();
    const { employeeSpecializationResp } =
        useAppSelector(({ masterData, instAcademics }) => ({
            employeeSpecializationResp: masterData.employeeSpecializationResp
        }), shallowEqual);
    const academicYearList = useMemo(() => {
        const currentYear = new Date().getFullYear();
        return getAcademicYears(currentYear);
    }, []);

    useEffect(() => {
       dispatch(getEmployeeSpecializationAct(generateActionPayload("get_employee_specialization")));

        // dispatch(getReligionAct(generateActionPayload("get_inst_global_records", undefined, { categoryName: "religion", pageNo: 0, pageSize: 100 })));
    }, []);

    const educationDetailForm = useFormik({
        enableReinitialize: true,
        initialValues: educationDetailState,
        validationSchema,
        onSubmit: (values: any) => {
            const formData = {
                ...values
            }
            storeMultiFormData("employeeEducationDetails", true, formData);
        }
    })
    useEffect(() => {
        if (Array.isArray(currentMultiFormKeys) && currentMultiFormKeys.includes("employeeEducationDetails"))
            educationDetailForm.handleSubmit();
    }, [currentMultiFormKeys]);

    useEffect(() => {
        if (editEmployeeData) {
            const { employeeEducationDetails } = editEmployeeData,
                { formData } = employeeEducationDetails || {};
            if (formData)
                setEducationDetailState(getInitialState(formData));
        }
    }, [editEmployeeData]);


    return (
        <form onSubmit={educationDetailForm.handleSubmit}>
            <AccordionHeader
                tag="span"
                className="tw-text-base tw-font-medium"
                targetId="education"
            >
                Education
            </AccordionHeader>

            <AccordionBody accordionId="education">
                <div className="tw-grid tw-grid-cols-12 tw-gap-4">
                    <div className="tw-col-span-12 md:tw-col-span-4">
                        <TextInput
                            name="qualificationName"
                            labelText="Highest Qualification"
                            labelClass="required"
                            value={educationDetailForm.values.qualificationName}
                            onChange={educationDetailForm.handleChange}
                            onBlur={educationDetailForm.handleBlur}
                            invalid={(educationDetailForm.touched.qualificationName && educationDetailForm.errors.qualificationName) ? true : false}
                            error={(educationDetailForm.touched.qualificationName && educationDetailForm.errors.qualificationName) ? educationDetailForm.errors.qualificationName : ""}
                        />
                    </div>
                    <div className="tw-col-span-12 md:tw-col-span-4">
                        <TextInput
                            name="universityName"
                            labelText="Institute / University"
                            labelClass="required"
                            value={educationDetailForm.values.universityName}
                            onChange={educationDetailForm.handleChange}
                            onBlur={educationDetailForm.handleBlur}
                            invalid={(educationDetailForm.touched.universityName && educationDetailForm.errors.universityName) ? true : false}
                            error={(educationDetailForm.touched.universityName && educationDetailForm.errors.universityName) ? educationDetailForm.errors.universityName : ""}
                        />
                    </div>
                    <div className="tw-col-span-12 md:tw-col-span-4">
                        <SelectInput
                            name="passoutYear"
                            labelText="Passing Year"
                            value={educationDetailForm.values.passoutYear}
                            onChange={educationDetailForm.handleChange}
                            onBlur={educationDetailForm.handleBlur}
                            invalid={(educationDetailForm.touched.passoutYear && educationDetailForm.errors.passoutYear) ? true : false}
                            error={(educationDetailForm.touched.passoutYear && educationDetailForm.errors.passoutYear) ? educationDetailForm.errors.passoutYear : ""}
                            menuItems={academicYearList}
                            valueKey="year"
                            textKey="year"
                            labelClass="required"
                        />
                    </div>
                    <div className="tw-col-span-12 md:tw-col-span-4">
                        <TextInput
                            name="specializationName"
                            labelText="Any Specialization"
                            labelClass="required"
                            value={educationDetailForm.values.specializationName}
                            onChange={educationDetailForm.handleChange}
                            onBlur={educationDetailForm.handleBlur}
                            invalid={(educationDetailForm.touched.specializationName && educationDetailForm.errors.specializationName) ? true : false}
                            error={(educationDetailForm.touched.specializationName && educationDetailForm.errors.specializationName) ? educationDetailForm.errors.specializationName : ""}
                        />
                    </div>
                    <div className="tw-col-span-12 md:tw-col-span-8">
                        <TextInput
                            name="otherAchievements"
                            labelText="Other Achievements"
                            value={educationDetailForm.values.otherAchievements}
                            onChange={educationDetailForm.handleChange}
                            onBlur={educationDetailForm.handleBlur}
                            invalid={(educationDetailForm.touched.otherAchievements && educationDetailForm.errors.otherAchievements) ? true : false}
                            error={(educationDetailForm.touched.otherAchievements && educationDetailForm.errors.otherAchievements) ? educationDetailForm.errors.otherAchievements : ""}
                        />
                    </div>
                    {/* <div className="col-12">
                        <input type="submit" value="Submit" />
                    </div> */}
                </div>
            </AccordionBody>
        </form>
    )
}