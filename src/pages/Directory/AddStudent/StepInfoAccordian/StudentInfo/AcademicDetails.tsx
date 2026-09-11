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
    religionOptions,
    studentType
} from "../helper";
import { StepperFormContext } from "../../helper";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
//Action Generator
import { generateActionPayload } from "../../../../../utility/reduxutility";
import {
    getNationalityAct, getReligionAct, getBloodGroupAct, getGenderListAct,
    getHouseDetailsAct
} from "../../../../../store/masterdata/masterdataactions";
import {
    getInstAcademicYearAct,
} from "../../../../../store/mastersettings/instacademics/instacademicactions";
import {
    getGlobalRecordsAct,
} from "../../../../../store/mastersettings/instituteinfo/instituteinfoactions";
import {
    getBranchCurriculumAct, getBrchSectionsAct, getBranchClassAct,
    getBrchCurriculumClassAct,
    getAcademicLanguagesAct
} from "../../../../../store/branchsettings/branchacademics/branchacademicsactions";
import {
    getAcademicLanguagesDataAct
} from "../../../../../store/mastersettings/instituteinfo/instituteinfoactions";


const validationSchema = Yup.object().shape({
    branchCurriculumId: Yup.string().required("Select curriculum."),
    branchClassId: Yup.string().required('Select class.'),
    // firstLanguageId: Yup.string().required("Select first language."),
    admissionType: Yup.string().required("Select admission type."),
    studentType: Yup.string().required("Select student type."),
    admissionCategory: Yup.string().required("Select admission category."),
});

function getInitialState(initialState?: any) {
    return {
        id: initialState?.id || "",
        branchCurriculumId: initialState?.branchCurriculumId || "",
        branchClassId: initialState?.branchClassId || "",
        academicSectionId: initialState?.academicSectionId || "",
        rollNo: initialState?.rollNo || "",
        houseName: initialState?.houseName || "",
        // houseId: initialState?.houseId || "",
        firstLanguageId: initialState?.firstLanguageId || "",
        secondLanguageId: initialState?.secondLanguageId || "",
        thirdLanguageId: initialState?.thirdLanguageId || "",
        admissionCategory: initialState?.admissionCategory || "",
        admissionType: initialState?.admissionType || "",
        studentType: initialState?.studentType || ""
    }
}

//Old State
// function getInitialState(initialState?: any) {
//     return {
//         campusType: initialState?.campusType || "1",
//         branchCurriculumId: initialState?.branchCurriculumId || "1",
//         branchClassId: initialState?.branchClassId || "1",
//         academicSectionId: initialState?.academicSectionId || "1",
//         rollNo: initialState?.rollNo || "1456",
//         houseName: initialState?.houseName || "House Name",
//         houseId: initialState?.houseId || "1",
//         firstLanguageId: initialState?.firstLanguageId || "1",
//         secondLanguageId: initialState?.secondLanguageId || "2",
//         thirdLanguageId: initialState?.thirdLanguageId || "7",
//         admissionCategory: initialState?.admissionCategory || "Admission Cate",
//         admissionType: initialState?.admissionType || "Sports",
//     }
// }



export default function AcademicDetails({ formDetails, branchId, instituteId, academicYearId }: any) {
    const [academicDetailsState, setacAdemicDetailsState] = useState<any>(getInitialState(formDetails));
    const { currentMultiFormKeys, editStudentData, storeMultiFormData } = useContext<any>(StepperFormContext);
    const [classListState, setClassListState] = useState<any>([]);
    const [sectionsListState, setSectionsListState] = useState<any>([]);
    const dispatch = useAppDispatch();
    const { houseDetailsResp, academicLanguages, brchCurriculumClassResp, branchClassResp,
        brchSectionsResp, brchCurriculumResp,
        brchAcademicErrorResp, getAcademicLanguagesResp } = useAppSelector(({ masterData, branchAcademics, instituteInfo }) => ({
            houseDetailsResp: masterData.houseDetailsResp,
            academicLanguages: instituteInfo.academicLanguages,
            brchCurriculumClassResp: branchAcademics.brchCurriculumClassResp,
            branchClassResp: branchAcademics.branchClassResp,
            brchSectionsResp: branchAcademics.brchSectionsResp,
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            brchAcademicErrorResp: branchAcademics.brchAcademicErrorResp,
            getAcademicLanguagesResp: branchAcademics.getAcademicLanguagesResp
        }), shallowEqual);

    useEffect(() => {
        if (branchClassResp) {
            const { content } = branchClassResp;
            if (Array.isArray(content)) {
                setClassListState(content);
            }
        }
    }, [branchClassResp]);

    useEffect(() => {
        if (Array.isArray(brchSectionsResp?.data) && brchSectionsResp?.data.length > 0) {
            const { sectionsResponse } = brchSectionsResp?.data[0] || {};
            if (Array.isArray(sectionsResponse)) {
                setSectionsListState(sectionsResponse);
            }
        }
    }, [brchSectionsResp]);


    useEffect(() => {
        if (getAcademicLanguagesResp?.FIRST && 
            Array.isArray(getAcademicLanguagesResp.FIRST) && 
            getAcademicLanguagesResp.FIRST.length > 0) {
            
            const firstLanguage = getAcademicLanguagesResp.FIRST[0];            
            academicDetailsForm.setFieldValue('firstLanguageId', firstLanguage.languageId.toString());
        }
    }, [getAcademicLanguagesResp]);

    useEffect(() => {
        const brchCurriculumparams = { branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" },
            languagesPayload = { instituteId, pageNo: 0, pageSize: 100, sortBy: "languageName", orderBy: "asc" };
        dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, brchCurriculumparams)));
        // dispatch(getBrchCurriculumClassAct(generateActionPayload("get_brnch_curriclum_class_mapping", currciulumClassResp)));
        // dispatch(getBrchSectionsAct(generateActionPayload("get_brch_sections", undefined, brchCurriculumparams)));
        // dispatch(getAcademicLanguagesDataAct(generateActionPayload("get_academic_language_data", undefined, languagesPayload)));
    }, []);

    useEffect(() => {
        if (instituteId) {
            const payload = {
                instituteId
            }
            dispatch(getHouseDetailsAct(generateActionPayload("get_house_details", undefined, payload)));
        }
    }, [instituteId]);

    // useEffect(() => {
    //     if (editStudentData) {
    //         const { studentAcademicDetails } = editStudentData,
    //             { formData } = studentAcademicDetails || {};
    //         if (formData) {
    //             const { branchCurriculumId, branchClassId } = formData,
    //                 { classDTOS } = brchCurriculumClassResp?.find((item: any) => (item.branchCurriculumId === +branchCurriculumId)) || {},
    //                 { sectionsResponse } = brchSectionsResp?.data?.find((item: any) => (item.branchClassId === +branchClassId)) || {};
    //             setClassListState(classDTOS);
    //             setSectionsListState(sectionsResponse);
    //             setacAdemicDetailsState(getInitialState(formData));
    //         }
    //     }
    // }, [editStudentData]);
    useEffect(() => {
        const { studentAcademicDetails } = editStudentData || {},
            { formData } = studentAcademicDetails || {};
        if (formData) {
            const { branchCurriculumId, branchClassId } = formData;
            if (branchCurriculumId) {
                getClassApiCall(branchCurriculumId);
            }
            if (branchCurriculumId && branchClassId) {
                getSectionApiCall(branchCurriculumId, branchClassId);
            }
            setacAdemicDetailsState(getInitialState(formData));
        }
    }, [editStudentData]);

    function getClassApiCall(curriculumId: string) {
        if (curriculumId) {
            const classParams = {
                branchId, pageNo: 0, pageSize: 100, sortBy: "classSequence",
                orderBy: "asc", curriculumId: curriculumId
            };
            dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, classParams)));
        }
    }
    function getSectionApiCall(curriculumId: string, classId: string) {
        if (curriculumId && classId) {
            const sectionParams = {
                branchId, pageNo: 0, pageSize: 100, sortBy: "sectionName", orderBy: "asc",
                branchCurriculumId: curriculumId, academicYearId, classId
            };
            dispatch(getBrchSectionsAct(generateActionPayload("get_brch_sections", undefined, sectionParams)));
        }
    }


    function handleSubmit(event: any) {
        event.preventDefault();
    }
    const academicDetailsForm = useFormik({
        enableReinitialize: true,
        initialValues: academicDetailsState,
        validationSchema,
        onSubmit: (values: any) => {             
            storeMultiFormData("studentAcademicDetails", true, values);
        }
    })

    useEffect(() => {
        if (Array.isArray(currentMultiFormKeys) && currentMultiFormKeys.includes("studentAcademicDetails"))
            academicDetailsForm.handleSubmit();
    }, [currentMultiFormKeys]);

    function onChangeHandler(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        if (name === "branchCurriculumId") {
            // if (value) {
            //     const { classDTOS } = brchCurriculumClassResp?.find((item: any) => (item.branchCurriculumId === +value)) || {};
            //     setClassListState(classDTOS);
            // } else {
            //     setClassListState([]);
            // }
            if (value) {
                getClassApiCall(value);
            } else {
                setClassListState([]);
                setSectionsListState([]);
            }
            academicDetailsForm.setValues((prevState: any) => ({
                ...prevState, [name]: value, branchClassId: "",
                academicSectionId: ""
            }))
        } else if (name === "branchClassId") {
            if (value) {
                // const { sectionsResponse } = brchSectionsResp?.data?.find((item: any) => (item.branchClassId === +value)) || {};
                // setSectionsListState(sectionsResponse);
                const payload = {
                    branchId,
                    academicYearId,
                    curriculumId: academicDetailsForm.values.branchCurriculumId,
                    branchClassId: value,
                }
                const { branchCurriculumId } = academicDetailsForm.values;
                getSectionApiCall(branchCurriculumId, value)
                dispatch(getAcademicLanguagesAct(generateActionPayload("get_academic_language_list", undefined, payload)));
            } else {
                setSectionsListState([]);
            }
            academicDetailsForm.setValues((prevState: any) => ({
                ...prevState, [name]: value,
                academicSectionId: ""
            }))
        }
    }
    return (
        <form onSubmit={academicDetailsForm.handleSubmit}>
            <AccordionHeader tag="h5" targetId="academics">
                Academics
            </AccordionHeader>
            <AccordionBody accordionId="academics">
                <div className="tw-grid tw-grid-cols-12 tw-gap-4">
                    <div className="tw-col-span-4">
                        <SelectInput
                            name="branchCurriculumId"
                            labelText="Curriculum"
                            value={academicDetailsForm.values.branchCurriculumId}
                            onChange={onChangeHandler}
                            onBlur={academicDetailsForm.handleBlur}
                            invalid={(academicDetailsForm.touched.branchCurriculumId && academicDetailsForm.errors.branchCurriculumId) ? true : false}
                            error={(academicDetailsForm.touched.branchCurriculumId && academicDetailsForm.errors.branchCurriculumId) ? academicDetailsForm.errors.branchCurriculumId : ""}
                            menuItems={brchCurriculumResp?.data}
                            valueKey="branchCurriculumId"
                            textKey="curriculumName"
                            labelClass="required"
                        />
                    </div>

                    <div className="tw-col-span-4">
                        <SelectInput
                            name="branchClassId"
                            labelText="Class"
                            value={academicDetailsForm.values.branchClassId}
                            onChange={onChangeHandler}
                            onBlur={academicDetailsForm.handleBlur}
                            invalid={(academicDetailsForm.touched.branchClassId && academicDetailsForm.errors.branchClassId) ? true : false}
                            error={(academicDetailsForm.touched.branchClassId && academicDetailsForm.errors.branchClassId) ? academicDetailsForm.errors.branchClassId : ""}
                            menuItems={classListState}
                            valueKey="id"
                            textKey="shortName"
                            labelClass="required"
                        />
                    </div>

                    <div className="tw-col-span-4">
                        <SelectInput
                            name="academicSectionId"
                            labelText="Section"
                            value={academicDetailsForm.values.academicSectionId}
                            onChange={academicDetailsForm.handleChange}
                            onBlur={academicDetailsForm.handleBlur}
                            menuItems={sectionsListState}
                            valueKey="sectionId"
                            textKey="sectionName"
                        />
                    </div>

                    <div className="tw-col-span-4">
                        <TextInputWithRegex
                            name="rollNo"
                            labelText="Roll No"
                            value={academicDetailsForm.values.rollNo}
                            onChange={academicDetailsForm.handleChange}
                            onBlur={academicDetailsForm.handleBlur}
                            allowedInputRegex="^[0-9]+$"
                            maxLength={10}
                        />
                    </div>

                    <div className="tw-col-span-4">
                        <SelectInput
                            name="houseName"
                            labelText="House Name"
                            value={academicDetailsForm.values.houseName}
                            onChange={academicDetailsForm.handleChange}
                            onBlur={academicDetailsForm.handleBlur}
                            menuItems={houseDetailsResp}
                            valueKey="houseName"
                            textKey="houseName"
                        />
                        {/* <TextInput
                            name="houseName"
                            labelText="House Name"
                            // formgroupClassName="mb-4"
                            value={academicDetailsForm.values.houseName}
                            onChange={academicDetailsForm.handleChange}
                            invalid={(academicDetailsForm.touched.houseName && academicDetailsForm.errors.houseName) ? true : false}
                            error={(academicDetailsForm.touched.houseName && academicDetailsForm.errors.houseName) ? academicDetailsForm.errors.houseName : ""}
                        /> */}
                    </div>

                    <div className="tw-col-span-4">
                        <SelectInput
                            name="firstLanguageId"
                            labelText="First Language"
                            value={academicDetailsForm.values.firstLanguageId}
                            onChange={academicDetailsForm.handleChange}
                            onBlur={academicDetailsForm.handleBlur}
                            menuItems={getAcademicLanguagesResp?.FIRST}
                            valueKey="languageId"
                            textKey="languageName"
                            labelClass="required"
                            isDisabled={true}
                        />
                    </div>

                    <div className="tw-col-span-4">
                        <SelectInput
                            name="secondLanguageId"
                            labelText="Second Language"
                            value={academicDetailsForm.values.secondLanguageId}
                            onChange={academicDetailsForm.handleChange}
                            onBlur={academicDetailsForm.handleBlur}
                            menuItems={getAcademicLanguagesResp?.SECOND}
                            valueKey="languageId"
                            textKey="languageName"
                        />
                    </div>

                    <div className="tw-col-span-4">
                        <SelectInput
                            name="thirdLanguageId"
                            labelText="Third Language"
                            value={academicDetailsForm.values.thirdLanguageId}
                            onChange={academicDetailsForm.handleChange}
                            onBlur={academicDetailsForm.handleBlur}
                            menuItems={getAcademicLanguagesResp?.THIRD}
                            valueKey="languageId"
                            textKey="languageName"
                        />
                    </div>

                    <div className="tw-col-span-4">
                        <SelectInput
                            name="admissionCategory"
                            labelText="Admission Category"
                            value={academicDetailsForm.values.admissionCategory}
                            onChange={academicDetailsForm.handleChange}
                            onBlur={academicDetailsForm.handleBlur}
                            menuItems={admissionCategory}
                            valueKey="id"
                            textKey="name"
                            invalid={(academicDetailsForm.touched.admissionCategory && academicDetailsForm.errors.admissionCategory) ? true : false}
                            error={(academicDetailsForm.touched.admissionCategory && academicDetailsForm.errors.admissionCategory) ? academicDetailsForm.errors.admissionCategory : ""}
                            labelClass="required"
                        />
                    </div>

                    <div className="tw-col-span-4">
                        <SelectInput
                            name="admissionType"
                            labelText="Admission Type"
                            value={academicDetailsForm.values.admissionType}
                            onChange={academicDetailsForm.handleChange}
                            onBlur={academicDetailsForm.handleBlur}
                            invalid={(academicDetailsForm.touched.admissionType && academicDetailsForm.errors.admissionType) ? true : false}
                            error={(academicDetailsForm.touched.admissionType && academicDetailsForm.errors.admissionType) ? academicDetailsForm.errors.admissionType : ""}
                            menuItems={admissionTypes}
                            valueKey="id"
                            textKey="name"
                            labelClass="required"
                        />
                    </div>

                    <div className="tw-col-span-4">
                        <SelectInput
                            name="studentType"
                            labelText="Student Type"
                            value={academicDetailsForm.values.studentType}
                            onChange={academicDetailsForm.handleChange}
                            onBlur={academicDetailsForm.handleBlur}
                            invalid={(academicDetailsForm.touched.studentType && academicDetailsForm.errors.studentType) ? true : false}
                            error={(academicDetailsForm.touched.studentType && academicDetailsForm.errors.studentType) ? academicDetailsForm.errors.studentType : ""}
                            menuItems={studentType}
                            valueKey="id"
                            textKey="name"
                            labelClass="required"
                        />
                    </div>
                </div>
            </AccordionBody>
        </form>
    )
}