import { useState, useEffect, useImperativeHandle, useContext, useRef } from "react";
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
    religionOptions
} from "../helper";
import { StepperFormContext } from "../../helper";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
//Action Generator
import { generateActionPayload } from "../../../../../utility/reduxutility";
import {
    getNationalityAct, getReligionAct, getBloodGroupAct, getGenderListAct, getCasteListAct, getMotherToungeAct
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

// Old State
// function getInitialState(initialState?: any) {
//     return {
//         nationalityId: initialState?.nationalityId || "1",
//         religionId: initialState?.religionId || "1",
//         casteId: initialState?.casteId || "1",
//         motherToungeId: initialState?.motherToungeId || "1",
//         foreignNationalPassportNumber: initialState?.foreignNationalPassportNumber || "ARE234324",
//         identificationMark1: initialState?.identificationMark1 || "Testing",
//         identificationMark2: initialState?.identificationMark2 || "Testing",
//     }
// }

function getInitialState(initialState?: any) {
    return {
        nationalityId: initialState?.nationalityId || "",
        religionId: initialState?.religionId || "",
        casteId: initialState?.casteId || "",
        motherToungeId: initialState?.motherToungeId || "",
        foreignNationalPassportNumber: initialState?.foreignNationalPassportNumber || "",
        identificationMark1: initialState?.identificationMark1 || "",
        identificationMark2: initialState?.identificationMark2 || "",
    }
}

const validationSchema = Yup.object().shape({
    nationalityId: Yup.string().required("Nationality required."),
    religionId: Yup.string().required("Select region."),
    casteId: Yup.string().required('Select caste.'),
    motherToungeId: Yup.string().required("Select mother toungue."),
    identificationMark1: Yup.string().required("Identification mark 1 is required."),
    identificationMark2: Yup.string().test("identificationMark2Check", "Identification mark 2 cannot be same as identification mark 1.",
        (value: any, schema: any) => {
            if (value && value?.toLowerCase() === schema.parent?.identificationMark1?.toLowerCase()) {
                return false
            }
            return true;
        }),
});

export default function IdentificationDetails({ formDetails, refId }: any) {
    const [basicDetailsState, setBasicDetailsState] = useState<any>(getInitialState(formDetails));
    const { currentMultiFormKeys, editStudentData, storeMultiFormData } = useContext<any>(StepperFormContext);

    const dispatch = useAppDispatch();
    const { nationalityResp, religionResp,
        casteListResp, motherToungeResp, masterDataErrorResp } =
        useAppSelector(({ masterData, instAcademics }) => ({
            nationalityResp: masterData.nationalityResp,
            religionResp: masterData.religionResp,
            casteListResp: masterData.casteListResp,
            motherToungeResp: masterData.motherToungeResp,
            masterDataErrorResp: masterData.masterDataErrorResp
        }), shallowEqual);

    useEffect(() => {
        dispatch(getNationalityAct(generateActionPayload("get_inst_global_records", undefined, { categoryName: "nationality", sortBy: "id", orderBy: "asc" })));
        dispatch(getReligionAct(generateActionPayload("get_inst_global_records", undefined, { categoryName: "religion", sortBy: "id", orderBy: "asc" })));
        dispatch(getCasteListAct(generateActionPayload("get_inst_global_records", undefined, { categoryName: "caste", sortBy: "casteName", pageNo: 0, pageSize: 200, orderBy: "asc" })));
        dispatch(getMotherToungeAct(generateActionPayload("get_inst_global_records", undefined, { categoryName: "mother-tongue", sortBy: "id", orderBy: "asc" })));
    }, []);

    function handleSubmit(event: any) {
        event.preventDefault();
    }
    const identificationForm = useFormik({
        enableReinitialize: true,
        initialValues: basicDetailsState,
        validationSchema,
        onSubmit: (values: any) => {
            storeMultiFormData("identificationDetail", true, values);
        }
    })
    useEffect(() => {
        if (editStudentData) {
            const { identificationDetail } = editStudentData,
                { formData } = identificationDetail || {};
            if (formData)
                setBasicDetailsState(getInitialState(formData));
        }
    }, [editStudentData]);

    useEffect(() => {
        if (currentMultiFormKeys)
            identificationForm.handleSubmit();
    }, [currentMultiFormKeys]);


    return (
        <form onSubmit={identificationForm.handleSubmit}>
            <AccordionHeader tag="h5" targetId="identification">
                Identification
            </AccordionHeader>
            <AccordionBody accordionId="identification">
                <div className="tw-grid tw-grid-cols-12 tw-gap-4">
                    <div className="tw-col-span-12 md:tw-col-span-4">
                        <SelectInput
                            name="nationalityId"
                            labelText="Nationality"
                            value={identificationForm.values.nationalityId}
                            onChange={identificationForm.handleChange}
                            onBlur={identificationForm.handleBlur}
                            invalid={(identificationForm.touched.nationalityId && identificationForm.errors.nationalityId) ? true : false}
                            error={(identificationForm.touched.nationalityId && identificationForm.errors.nationalityId) ? identificationForm.errors.nationalityId : ""}
                            menuItems={nationalityResp?.data}
                            valueKey="nationalityId"
                            textKey="nationalityName"
                            labelClass="required"
                        />
                    </div>

                    <div className="tw-col-span-12 md:tw-col-span-4">
                        <SelectInput
                            name="religionId"
                            labelText="Religion"
                            value={identificationForm.values.religionId}
                            onChange={identificationForm.handleChange}
                            onBlur={identificationForm.handleBlur}
                            invalid={(identificationForm.touched.religionId && identificationForm.errors.religionId) ? true : false}
                            error={(identificationForm.touched.religionId && identificationForm.errors.religionId) ? identificationForm.errors.religionId : ""}
                            menuItems={religionResp?.data}
                            valueKey="religionId"
                            textKey="religionName"
                            labelClass="required"
                        />
                    </div>

                    <div className="tw-col-span-12 md:tw-col-span-4">
                        <SelectInput
                            name="casteId"
                            labelText="Caste"
                            value={identificationForm.values.casteId}
                            onChange={identificationForm.handleChange}
                            onBlur={identificationForm.handleBlur}
                            invalid={(identificationForm.touched.casteId && identificationForm.errors.casteId) ? true : false}
                            error={(identificationForm.touched.casteId && identificationForm.errors.casteId) ? identificationForm.errors.casteId : ""}
                            menuItems={casteListResp?.data}
                            valueKey="casteId"
                            textKey="casteName"
                            labelClass="required"
                        />
                    </div>

                    <div className="tw-col-span-12 md:tw-col-span-4">
                        <SelectInput
                            name="motherToungeId"
                            labelText="Mother Tongue"
                            value={identificationForm.values.motherToungeId}
                            onChange={identificationForm.handleChange}
                            onBlur={identificationForm.handleBlur}
                            invalid={(identificationForm.touched.motherToungeId && identificationForm.errors.motherToungeId) ? true : false}
                            error={(identificationForm.touched.motherToungeId && identificationForm.errors.motherToungeId) ? identificationForm.errors.motherToungeId : ""}
                            menuItems={motherToungeResp?.data}
                            valueKey="motherTongueId"
                            textKey="motherTongueName"
                            labelClass="required"
                        />
                    </div>

                    <div className="tw-col-span-12 md:tw-col-span-4">
                        <TextInput
                            name="foreignNationalPassportNumber"
                            labelText="Foreign National Passport Number"
                            value={identificationForm.values.foreignNationalPassportNumber}
                            onChange={identificationForm.handleChange}
                            onBlur={identificationForm.handleBlur}
                            invalid={(identificationForm.touched.foreignNationalPassportNumber && identificationForm.errors.foreignNationalPassportNumber) ? true : false}
                            error={(identificationForm.touched.foreignNationalPassportNumber && identificationForm.errors.foreignNationalPassportNumber) ? identificationForm.errors.foreignNationalPassportNumber : ""}
                        />
                    </div>

                    <div className="tw-col-span-12 md:tw-col-span-4">
                        <TextInput
                            name="identificationMark1"
                            labelText="Identification Mark 1"
                            value={identificationForm.values.identificationMark1}
                            onChange={identificationForm.handleChange}
                            onBlur={identificationForm.handleBlur}
                            labelClass="required"
                            invalid={(identificationForm.touched.identificationMark1 && identificationForm.errors.identificationMark1) ? true : false}
                            error={(identificationForm.touched.identificationMark1 && identificationForm.errors.identificationMark1) ? identificationForm.errors.identificationMark1 : ""}
                        />
                    </div>

                    <div className="tw-col-span-12 md:tw-col-span-4">
                        <TextInput
                            name="identificationMark2"
                            labelText="Identification Mark 2"
                            value={identificationForm.values.identificationMark2}
                            onChange={identificationForm.handleChange}
                            onBlur={identificationForm.handleBlur}
                            invalid={(identificationForm.touched.identificationMark2 && identificationForm.errors.identificationMark2) ? true : false}
                            error={(identificationForm.touched.identificationMark2 && identificationForm.errors.identificationMark2) ? identificationForm.errors.identificationMark2 : ""}
                        />
                    </div>

                    {/* <div className="col-12">
                        <input type="submit" value="Submit Identification Details" />
                    </div> */}

                </div>
            </AccordionBody>
        </form>
    )
}