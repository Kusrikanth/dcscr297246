import { useState, useEffect, useImperativeHandle, useContext, useRef } from "react";
import { shallowEqual } from "react-redux";
import { UncontrolledAccordion, AccordionBody, AccordionHeader, AccordionItem, Collapse } from "reactstrap";

import { useFormik } from "formik";
import * as Yup from "yup";

import {
    ModalContainer, TextIconInput, TextInput, DateInput, SelectInput, PhoneInput,
    RadioInputContainer, Switch,
    UploadImage
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
    getNationalityAct, getReligionAct, getBloodGroupAct, getGenderListAct, getCasteListAct, getMotherToungeAct
} from "../../../../../../../store/masterdata/masterdataactions";
import { getInstAcademicYearAct } from "../../../../../../../store/mastersettings/instacademics/instacademicactions";
import {
    getGlobalRecordsAct,
} from "../../../../../../../store/mastersettings/instituteinfo/instituteinfoactions";
import { getBranchCurriculumAct, getBrchSectionsAct, getBrchCurriculumClassAct } from "../../../../../../../store/branchsettings/branchacademics/branchacademicsactions";
import {
    getAcademicLanguagesDataAct
} from "../../../../../../../store/mastersettings/instituteinfo/instituteinfoactions";

// Old State
// function getInitialState(initialState?: any) {
//     return {
//         nationalityId: initialState?.nationalityId || "1",
//         religionId: initialState?.religionId || "1",
//         casteId: initialState?.casteId || "1",
//         motherTongueId: initialState?.motherTongueId || "1",
//         foreignNationalPassportNumber: initialState?.foreignNationalPassportNumber || "ARE234324",
//         identificationMarks1: initialState?.identificationMarks1 || "Testing",
//         identificationMarks2: initialState?.identificationMarks2 || "Testing",
//     }
// }

function getInitialState(initialState?: any) {
    return {
        nationalityId: initialState?.nationalityId || "",
        religionId: initialState?.religionId || "",
        casteId: initialState?.casteId || "",
        motherTongueId: initialState?.motherTongueId || "",
        foreignNationalPassportNumber: initialState?.foreignNationalPassportNumber || "",
        identificationMarks1: initialState?.identificationMarks1 || "",
        identificationMarks2: initialState?.identificationMarks2 || "",
    }
}

const validationSchema = Yup.object().shape({
    nationalityId: Yup.string().required("Nationality required."),
    religionId: Yup.string().required("Select region."),
    casteId: Yup.string().required('Select caste.'),
    motherTongueId: Yup.string().required("Select mother toungue."),
    identificationMarks1: Yup.string().required("Identification mark 1 is required."),
    identificationMarks2: Yup.string().test("identificationMark2Check", "Identification mark 2 cannot be same as identification mark 1.",
        (value: any, schema: any) => {
            if (value && value?.toLowerCase() === schema.parent?.identificationMarks1?.toLowerCase()) {
                return false
            }
            return true;
        }),
});

export default function IdentificationDetails({ stepId, formId, formDetails, storeMultiFormDataCallback }: any) {
    const [basicDetailsState, setBasicDetailsState] = useState<any>(getInitialState(formDetails));
    const { currentMultiFormKeys, tabsData } = useContext<any>(StepperFormContext);

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
        dispatch(getCasteListAct(generateActionPayload("get_inst_global_records", undefined, { categoryName: "caste", sortBy: "casteName", orderBy: "asc" })));
        dispatch(getMotherToungeAct(generateActionPayload("get_inst_global_records", undefined, { categoryName: "mother-tongue", sortBy: "id", orderBy: "asc" })));
    }, []);

    function handleSubmit(event: any) {
        event.preventDefault();
    }
    const identificationForm = useFormik({
        enableReinitialize: true,
        initialValues: basicDetailsState,
        // validationSchema,
        onSubmit: (values: any) => {
            storeMultiFormDataCallback(formId, true, values);
        }
    })

    useEffect(() => {
        if (Array.isArray(currentMultiFormKeys) && currentMultiFormKeys.includes(formId)) {
            identificationForm.handleSubmit();
        }
    }, [currentMultiFormKeys]);

    useEffect(() => {
        if (tabsData[stepId]) {
            const formData = getInitialState(tabsData[stepId]);
            identificationForm.resetForm({
                values: formData
            })
        }
    }, [tabsData, stepId]);

    return (
        <form onSubmit={identificationForm.handleSubmit}>
            <AccordionHeader tag="h5" targetId="identification">
                Identification
            </AccordionHeader>
            <AccordionBody accordionId="identification">
                <div className="row">
                    <div className="col-4">
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
                        />
                    </div>

                    <div className="col-4">
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
                        />
                    </div>
                    <div className="col-4">
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
                        />
                    </div>

                    <div className="col-4">
                        <SelectInput
                            name="motherTongueId"
                            labelText="Mother Tongue"
                            value={identificationForm.values.motherTongueId}
                            onChange={identificationForm.handleChange}
                            onBlur={identificationForm.handleBlur}
                            invalid={(identificationForm.touched.motherTongueId && identificationForm.errors.motherTongueId) ? true : false}
                            error={(identificationForm.touched.motherTongueId && identificationForm.errors.motherTongueId) ? identificationForm.errors.motherTongueId : ""}
                            menuItems={motherToungeResp?.data}
                            valueKey="motherTongueId"
                            textKey="motherTongueName"
                        />
                    </div>
                    <div className="col-4">
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
                    <div className="col-4">
                        <TextInput
                            name="identificationMarks1"
                            labelText="Identification Mark 1"
                            value={identificationForm.values.identificationMarks1}
                            onChange={identificationForm.handleChange}
                            onBlur={identificationForm.handleBlur}
                            invalid={(identificationForm.touched.identificationMarks1 && identificationForm.errors.identificationMarks1) ? true : false}
                            error={(identificationForm.touched.identificationMarks1 && identificationForm.errors.identificationMarks1) ? identificationForm.errors.identificationMarks1 : ""}
                        />
                    </div>
                    <div className="col-4">
                        <TextInput
                            name="identificationMarks2"
                            labelText="Identification Mark 2"
                            value={identificationForm.values.identificationMarks2}
                            onChange={identificationForm.handleChange}
                            onBlur={identificationForm.handleBlur}
                            invalid={(identificationForm.touched.identificationMarks2 && identificationForm.errors.identificationMarks2) ? true : false}
                            error={(identificationForm.touched.identificationMarks2 && identificationForm.errors.identificationMarks2) ? identificationForm.errors.identificationMarks2 : ""}
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