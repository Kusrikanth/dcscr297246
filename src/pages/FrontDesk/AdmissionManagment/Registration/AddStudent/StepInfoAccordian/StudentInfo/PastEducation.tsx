import { useState, useEffect, useImperativeHandle, useContext, useRef } from "react";
import { shallowEqual } from "react-redux";
import { UncontrolledAccordion, AccordionBody, AccordionHeader, AccordionItem, Collapse } from "reactstrap";

import { useFormik } from "formik";
import * as Yup from "yup";

import {
    ModalContainer, TextIconInput, TextInput, DateInput, SelectInput, PhoneInput,
    RadioInputContainer, Switch,
    UploadImage,
    TextInputWithRegex
} from "../../../../../../../Components/Common";

import StudentImgIcon from "../../../../../assets/imagesdps/directory/user-img.png";

//Helper
import {
    studentUIDTypes, yesNoOptions, admissionTypes, genderOptions, bloodGroupOptions,
    nationalityOptions, trueFalseOptions, languageOptions,
    houseNameOptions, admissionCategory, motherToungeOptions,
    religionOptions
} from "../helper";
import { StepperFormContext } from "../../helper";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../../../../../hooks/storehook";
//Action Generator
import { generateActionPayload } from "../../../../../../../utility/reduxutility";
import {
    getNationalityAct, getReligionAct, getBloodGroupAct, getGenderListAct
} from "../../../../../../../store/masterdata/masterdataactions";
import {
    getInstAcademicYearAct,
} from "../../../../../../../store/mastersettings/instacademics/instacademicactions";
import {
    getGlobalRecordsAct,
} from "../../../../../../../store/mastersettings/instituteinfo/instituteinfoactions";
import { getBranchCurriculumAct, getBrchSectionsAct, getBrchCurriculumClassAct } from "../../../../../../../store/branchsettings/branchacademics/branchacademicsactions";
import {
    getAcademicLanguagesDataAct
} from "../../../../../../../store/mastersettings/instituteinfo/instituteinfoactions";
import { pastEducationClassAct, setPastEductionClassAct } from "../../../../../../../store/directory/studentmanagement/studentmanagementactions";



//Old State
// function getInitialState(initialState?: any) {
//     return {
//         lastSchoolStudied: initialState?.lastSchoolStudied || "Testing School",
//         lastCurriculumStudied: initialState?.lastCurriculumStudied || "1",
//         lastClassStudied: initialState?.lastClassStudied || "1",
//         lastAcademicPercentage: initialState?.lastAcademicPercentage || "5.5",
//         reasonForSeekingAdmission: initialState?.reasonForSeekingAdmission || "Transfter of father",
//     }
// }

function getInitialState(initialState?: any) {
    return {
        lastSchoolStudied: initialState?.lastSchoolStudied || "",
        lastCurriculumStudied: initialState?.lastCurriculumStudied || "",
        lastClassStudied: initialState?.lastClassStudied || "",
        lastAcademicPercentage: initialState?.lastAcademicPercentage || "",
        reasonForSeekingAdmission: initialState?.reasonForSeekingAdmission || "",
    }
}
const validationSchema = Yup.object().shape({
    lastSchoolStudied: Yup.string().required("School name required."),
    lastCurriculumStudied: Yup.string().required("Select curriculum."),
    lastClassStudied: Yup.string().required("Select class id."),
    lastAcademicPercentage: Yup.number().typeError("Enter valid number").lessThan(100.000000001, 'Values should be less than 100.').required("Class precentage required"),
});
const initialValues = getInitialState();
export default function PastEducation({ stepId, formId, formDetails, branchId, academicYearId,
    storeMultiFormDataCallback }: any) {
    const { currentMultiFormKeys, tabsData } = useContext<any>(StepperFormContext);
    const [classListState, setClassListState] = useState([]);
    const [sectionsListState, setSectionsListState] = useState([]);
    const dispatch = useAppDispatch();
    const { academicLanguages, brchCurriculumClassResp,
        brchSectionsResp, brchCurriculumResp, pastEducationClass,
        brchAcademicErrorResp } = useAppSelector(({ branchAcademics, directoryStudent, instituteInfo }) => ({
            academicLanguages: instituteInfo.academicLanguages,
            brchCurriculumClassResp: branchAcademics.brchCurriculumClassResp,
            brchSectionsResp: branchAcademics.brchSectionsResp,
            pastEducationClass: directoryStudent.pastEducationClass,
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            brchAcademicErrorResp: branchAcademics.brchAcademicErrorResp
        }), shallowEqual);

    function handleSubmit(event: any) {
        event.preventDefault();
    }
    const pastEducationForm = useFormik({
        initialValues,
        // validationSchema,
        onSubmit: (values: any) => {
            storeMultiFormDataCallback(formId, true, values);

        }
    });

    useEffect(() => {
        if (Array.isArray(currentMultiFormKeys) && currentMultiFormKeys.includes(formId))
            pastEducationForm.handleSubmit();
    }, [currentMultiFormKeys]);

    useEffect(() => {
        if (tabsData[stepId]) {
            const formData = getInitialState(tabsData[stepId]);
            pastEducationForm.resetForm({
                values: formData
            })
        }
    }, [tabsData, stepId]);


    function onChangeHandler(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        if (name === "lastCurriculumStudied") {
            if (value) {
                const classParams = {
                    branchId, pageNo: 0, pageSize: 100, sortBy: "className",
                    orderBy: "asc", curriculumId: value
                };
                dispatch(pastEducationClassAct(generateActionPayload("get_brch_curriculum_class", undefined, classParams)));
                // const { classDTOS } = brchCurriculumClassResp?.find((item: any) => (item.branchCurriculumId === +value)) || {};
                // setClassListState(classDTOS);
            } else {
                dispatch(setPastEductionClassAct(undefined));
            }
            pastEducationForm.setValues((prevState: any) => ({
                ...prevState, [name]: value, lastClassStudied: ""
            }))
        }
    }

    return (
        <form onSubmit={pastEducationForm.handleSubmit}>
            <AccordionHeader tag="h5" targetId="pastEducation">
                Past Education
            </AccordionHeader>
            <AccordionBody accordionId="pastEducation">
                <div className="row">
                    <div className="col-4">
                        <TextInput
                            name="lastSchoolStudied"
                            labelText="School Studied"
                            value={pastEducationForm.values.lastSchoolStudied}
                            onChange={pastEducationForm.handleChange}
                            onBlur={pastEducationForm.handleBlur}
                            invalid={(pastEducationForm.touched.lastSchoolStudied && pastEducationForm.errors.lastSchoolStudied) ? true : false}
                            error={(pastEducationForm.touched.lastSchoolStudied && pastEducationForm.errors.lastSchoolStudied) ? pastEducationForm.errors.lastSchoolStudied : ""}
                        />
                    </div>

                    <div className="col-4">
                        <SelectInput
                            name="lastCurriculumStudied"
                            labelText="Curriculum"
                            value={pastEducationForm.values.lastCurriculumStudied}
                            onChange={onChangeHandler}
                            onBlur={pastEducationForm.handleBlur}
                            invalid={(pastEducationForm.touched.lastCurriculumStudied && pastEducationForm.errors.lastCurriculumStudied) ? true : false}
                            error={(pastEducationForm.touched.lastCurriculumStudied && pastEducationForm.errors.lastCurriculumStudied) ? pastEducationForm.errors.lastCurriculumStudied : ""}
                            menuItems={brchCurriculumResp?.data}
                            valueKey="branchCurriculumId"
                            textKey="curriculumName"
                        />
                        {/* <TextInput
                            name="lastCurriculumStudied"
                            labelText="Curriculum"
                            value={pastEducationForm.values.lastCurriculumStudied}
                            onChange={pastEducationForm.handleChange}
                            invalid={(pastEducationForm.touched.lastCurriculumStudied && pastEducationForm.errors.lastCurriculumStudied) ? true : false}
                            error={(pastEducationForm.touched.lastCurriculumStudied && pastEducationForm.errors.lastCurriculumStudied) ? pastEducationForm.errors.lastCurriculumStudied : ""}
                        /> */}
                    </div>

                    <div className="col-4">
                        <SelectInput
                            name="lastClassStudied"
                            labelText="Class"
                            value={pastEducationForm.values.lastClassStudied}
                            onChange={pastEducationForm.handleChange}
                            onBlur={pastEducationForm.handleBlur}
                            invalid={(pastEducationForm.touched.lastClassStudied && pastEducationForm.errors.lastClassStudied) ? true : false}
                            error={(pastEducationForm.touched.lastClassStudied && pastEducationForm.errors.lastClassStudied) ? pastEducationForm.errors.lastClassStudied : ""}
                            menuItems={pastEducationClass?.content}
                            valueKey="id"
                            textKey="shortName"
                        />
                        {/* <TextInput
                            name="lastClassStudied"
                            labelText="Class"
                            value={pastEducationForm.values.lastClassStudied}
                            onChange={pastEducationForm.handleChange}
                            invalid={(pastEducationForm.touched.lastClassStudied && pastEducationForm.errors.lastClassStudied) ? true : false}
                            error={(pastEducationForm.touched.lastClassStudied && pastEducationForm.errors.lastClassStudied) ? pastEducationForm.errors.lastClassStudied : ""}
                        /> */}
                    </div>
                    <div className="col-4">
                        <TextInput
                            name="lastAcademicPercentage"
                            labelText="Percentage (%)"
                            value={pastEducationForm.values.lastAcademicPercentage}
                            onChange={pastEducationForm.handleChange}
                            onBlur={pastEducationForm.handleBlur}
                            invalid={(pastEducationForm.touched.lastAcademicPercentage && pastEducationForm.errors.lastAcademicPercentage) ? true : false}
                            error={(pastEducationForm.touched.lastAcademicPercentage && pastEducationForm.errors.lastAcademicPercentage) ? pastEducationForm.errors.lastAcademicPercentage : ""}
                            maxLength={5}
                        />
                    </div>
                    <div className="col-8">
                        <TextInput
                            name="reasonForSeekingAdmission"
                            labelText="Reason for Seeking Admission"
                            value={pastEducationForm.values.reasonForSeekingAdmission}
                            onChange={pastEducationForm.handleChange}
                            onBlur={pastEducationForm.handleBlur}
                            invalid={(pastEducationForm.touched.reasonForSeekingAdmission && pastEducationForm.errors.reasonForSeekingAdmission) ? true : false}
                            error={(pastEducationForm.touched.reasonForSeekingAdmission && pastEducationForm.errors.reasonForSeekingAdmission) ? pastEducationForm.errors.reasonForSeekingAdmission : ""}
                        />
                    </div>

                    {/* <div className="col-12">
                        <input type="submit" value="Past details" />
                    </div> */}


                </div>
            </AccordionBody>
        </form>
    )
}