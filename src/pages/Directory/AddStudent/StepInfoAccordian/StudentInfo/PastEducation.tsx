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
} from "../../../../../Components/Common";

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
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
//Action Generator
import { generateActionPayload } from "../../../../../utility/reduxutility";
import {
    getNationalityAct, getReligionAct, getBloodGroupAct, getGenderListAct
} from "../../../../../store/masterdata/masterdataactions";
import {
    getInstAcademicYearAct,
} from "../../../../../store/mastersettings/instacademics/instacademicactions";
import {
    getGlobalRecordsAct,
} from "../../../../../store/mastersettings/instituteinfo/instituteinfoactions";
import { getBranchCurriculumAct, getBrchSectionsAct, getBrchCurriculumClassAct } from "../../../../../store/branchsettings/branchacademics/branchacademicsactions";
import {
    getAcademicLanguagesDataAct
} from "../../../../../store/mastersettings/instituteinfo/instituteinfoactions";
import { pastEducationClassAct, setPastEductionClassAct } from "../../../../../store/directory/studentmanagement/studentmanagementactions";

function getInitialState(initialState?: any) {
    return {
        lastSchoolStudied: initialState?.lastSchoolStudied || "",
        lastCurriculumStudied: initialState?.lastCurriculumStudied || "",
        lastClassStudied: initialState?.lastClassStudied || "",
        lastClassPerc: initialState?.lastClassPerc || "",
        reasonForAdmission: initialState?.reasonForAdmission || "",
    }
}
const validationSchema = Yup.object().shape({
    lastSchoolStudied: Yup.string().required("School name required."),
    lastCurriculumStudied: Yup.string().required("past curriculum required."),
    lastClassStudied: Yup.string().required("Past class required."),
    lastClassPerc: Yup.number().typeError("Enter valid number").min(0, "Negative number are not allowed.").lessThan(100.000000001, 'Values should be less than 100.').required("Precentage required"),
});

export default function PastEducation({ formDetails, branchId, academicYearId }: any) {
    const [basicDetailsState, setBasicDetailsState] = useState<any>(getInitialState(formDetails));
    const { currentMultiFormKeys, editStudentData, storeMultiFormData } = useContext<any>(StepperFormContext);
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
    // useEffect(() => {
    //     if (brchCurriculumClassResp && basicDetailsState) {
    //         const { lastCurriculumId } = basicDetailsState;
    //         if (lastCurriculumId) {
    //             const { classDTOS } = brchCurriculumClassResp?.find((item: any) => (item.branchCurriculumId === +lastCurriculumId)) || {};
    //             setClassListState(classDTOS);
    //         }
    //     }
    // }, [brchCurriculumClassResp, basicDetailsState]);

    // useEffect(() => {
    //     if (brchCurriculumResp) {
    //         const { data } = brchCurriculumResp;
    //         if(Array.isArray(data)){

    //         }

    //         const { lastCurriculumId } = basicDetailsState;
    //         if (lastCurriculumId) {
    //             const { classDTOS } = brchCurriculumClassResp?.find((item: any) => (item.branchCurriculumId === +lastCurriculumId)) || {};
    //             setClassListState(classDTOS);
    //         }
    //     }
    // }, [brchCurriculumResp]);

    function handleSubmit(event: any) {
        event.preventDefault();
    }
    const pastEducationForm = useFormik({
        enableReinitialize: true,
        initialValues: basicDetailsState,
        // validationSchema,
        onSubmit: (values: any) => {
            storeMultiFormData("pastEducation", true, values);

        }
    })
    useEffect(() => {
        if (editStudentData) {
            const { pastEducation } = editStudentData,
                { formData } = pastEducation || {};
            if (formData) {
                const { lastCurriculumStudied } = formData;
                const classParams = {
                    branchId, pageNo: 0, pageSize: 100, sortBy: "classSequence",
                    orderBy: "asc", curriculumId: lastCurriculumStudied
                };
                // dispatch(pastEducationClassAct(generateActionPayload("get_brch_curriculum_class", undefined, classParams)));
                setBasicDetailsState(getInitialState(formData));
            }
        }
    }, [editStudentData, academicYearId]);

    useEffect(() => {
        if (Array.isArray(currentMultiFormKeys) && currentMultiFormKeys.includes("pastEducation"))
            pastEducationForm.handleSubmit();
    }, [currentMultiFormKeys]);


    function onChangeHandler(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        if (name === "lastCurriculumStudied") {
            if (value) {
                const classParams = {
                    branchId, pageNo: 0, pageSize: 100, sortBy: "classSequence",
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
            <AccordionHeader tag="h5" targetId="past-education">
                Past Education
            </AccordionHeader>
            <AccordionBody accordionId="past-education">
                <div className="tw-grid tw-grid-cols-12 tw-gap-4">
                    <div className="tw-col-span-4">
                        <TextInput
                            name="lastSchoolStudied"
                            labelText="School Studied"
                            value={pastEducationForm.values.lastSchoolStudied}
                            onChange={pastEducationForm.handleChange}
                            onBlur={pastEducationForm.handleBlur}
                            // labelClass="required"
                            // invalid={(pastEducationForm.touched.lastSchoolStudied && pastEducationForm.errors.lastSchoolStudied) ? true : false}
                            // error={(pastEducationForm.touched.lastSchoolStudied && pastEducationForm.errors.lastSchoolStudied) ? pastEducationForm.errors.lastSchoolStudied : ""}
                        />
                    </div>

                    <div className="tw-col-span-4">
                        {/* <SelectInput
                            name="lastCurriculumId"
                            labelText="Curriculum"
                            value={pastEducationForm.values.lastCurriculumId}
                            onChange={onChangeHandler}
                            onBlur={pastEducationForm.handleBlur}
                            invalid={(pastEducationForm.touched.lastCurriculumId && pastEducationForm.errors.lastCurriculumId) ? true : false}
                            error={(pastEducationForm.touched.lastCurriculumId && pastEducationForm.errors.lastCurriculumId) ? pastEducationForm.errors.lastCurriculumId : ""}
                            menuItems={brchCurriculumResp?.data}
                            valueKey="branchCurriculumId"
                            textKey="curriculumName"
                            labelClass="required"
                        /> */}
                        <TextInput
                            name="lastCurriculumStudied"
                            labelText="Past Curriculum"
                            value={pastEducationForm.values.lastCurriculumStudied}
                            onChange={pastEducationForm.handleChange}
                            // invalid={(pastEducationForm.touched.lastCurriculumStudied && pastEducationForm.errors.lastCurriculumStudied) ? true : false}
                            // error={(pastEducationForm.touched.lastCurriculumStudied && pastEducationForm.errors.lastCurriculumStudied) ? pastEducationForm.errors.lastCurriculumStudied : ""}
                            // labelClass="required"
                        />
                    </div>

                    <div className="tw-col-span-4">
                        {/* <SelectInput
                            name="lastClassId"
                            labelText="Class"
                            value={pastEducationForm.values.lastClassId}
                            onChange={pastEducationForm.handleChange}
                            onBlur={pastEducationForm.handleBlur}
                            invalid={(pastEducationForm.touched.lastClassId && pastEducationForm.errors.lastClassId) ? true : false}
                            error={(pastEducationForm.touched.lastClassId && pastEducationForm.errors.lastClassId) ? pastEducationForm.errors.lastClassId : ""}
                            menuItems={pastEducationClass?.content}
                            valueKey="id"
                            textKey="shortName"
                            labelClass="required"
                        /> */}
                        <TextInput
                            name="lastClassStudied"
                            labelText="Class"
                            value={pastEducationForm.values.lastClassStudied}
                            onChange={pastEducationForm.handleChange}
                            // invalid={(pastEducationForm.touched.lastClassStudied && pastEducationForm.errors.lastClassStudied) ? true : false}
                            // error={(pastEducationForm.touched.lastClassStudied && pastEducationForm.errors.lastClassStudied) ? pastEducationForm.errors.lastClassStudied : ""}
                            // labelClass="required"
                        />
                    </div>

                    <div className="tw-col-span-4">
                        <TextInput
                            name="lastClassPerc"
                            labelText="Percentage (%)"
                            value={pastEducationForm.values.lastClassPerc}
                            onChange={pastEducationForm.handleChange}
                            onBlur={pastEducationForm.handleBlur}
                            // invalid={(pastEducationForm.touched.lastClassPerc && pastEducationForm.errors.lastClassPerc) ? true : false}
                            // error={(pastEducationForm.touched.lastClassPerc && pastEducationForm.errors.lastClassPerc) ? pastEducationForm.errors.lastClassPerc : ""}
                            maxLength={5}
                            // labelClass="required"
                        />
                    </div>

                    <div className="tw-col-span-8">
                        <TextInput
                            name="reasonForAdmission"
                            labelText="Reason for Seeking Admission"
                            value={pastEducationForm.values.reasonForAdmission}
                            onChange={pastEducationForm.handleChange}
                            onBlur={pastEducationForm.handleBlur}
                            // invalid={(pastEducationForm.touched.reasonForAdmission && pastEducationForm.errors.reasonForAdmission) ? true : false}
                            // error={(pastEducationForm.touched.reasonForAdmission && pastEducationForm.errors.reasonForAdmission) ? pastEducationForm.errors.reasonForAdmission : ""}
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