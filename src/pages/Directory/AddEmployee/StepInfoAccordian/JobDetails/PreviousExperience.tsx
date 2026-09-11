import { useState, useEffect, useImperativeHandle, useContext, useRef } from "react";
import { shallowEqual } from "react-redux";
import { UncontrolledAccordion, AccordionBody, AccordionHeader, AccordionItem, Collapse } from "reactstrap";

import { Formik, FieldArray, Form, ArrayHelpers, FormikErrors, FormikProvider, useFormik } from "formik";

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
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";

//Common Utility
import { generateUniqueNumber } from "../../../../../utility/commonutility";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02StrokeStandard } from "@hugeicons-pro/core-stroke-standard";
import Button from "../../../../../Components/Common/Button";

//Old Data
// function getInitialState(initialState: any) {
//     return {
//         admissionAcademicYearId: initialState?.admissionAcademicYearId || "1",
//         admissionNo: initialState?.admissionNo || "2432",
//         dateOfAdmission: initialState?.dateOfAdmission || "2023-01-15T09:45:00",
//         studentName: initialState?.studentName || "Student Name",
//         aadharCardNo: initialState?.aadharCardNo || "123456789012",
//         genderId: initialState?.genderId || "1",
//         dob: initialState?.dob || "1980-10-01T09:45:00",
//         emailId: initialState?.emailId || "stesting@gmail.com",
//         contactNo: initialState?.contactNo || "1234567890",
//         birthPlace: initialState?.birthPlace || "Shars",
//         bloodGroupId: initialState?.bloodGroupId || "1",
//     }
// }

const validationSchema = Yup.object().shape({
    experienceList: Yup.array().of(
        Yup.object().shape({
            designationId: Yup.string().required("Select designation."),
            experience: Yup.number().typeError("Enter valid number.").required("Experience required."),
            fromDate: Yup.string().required("Select from date."),
            organizationName: Yup.string().required("Organisation required."),
            toDate: Yup.string().required("Select to date."),
        })
    ),
});

function getInitialState(editData?: any): any {
    const data: any = [];
    if (Array.isArray(editData)) {
        for (let i = 0; i < editData.length; i++) {
            const { designationId, id, experience, fromDate, organizationName, toDate } = editData[i];
            data.push({
                uniqueId: id,
                id: id,
                designationId: designationId,
                experience: experience,
                fromDate: fromDate,
                organizationName: organizationName,
                toDate: toDate
            });
        }
    } else {
        data.push({
            uniqueId: generateUniqueNumber(),
            id: undefined,
            designationId: "",
            experience: "",
            fromDate: "",
            organizationName: "",
            toDate: ""
        })
    }
    return { experienceList: data }
}

export default function PreviousExperience({ instituteId, branchId }: any) {
    const [previouExperienceState, setPreviousExperienceState] = useState<any>(getInitialState());
    const { currentMultiFormKeys, editEmployeeData,
        storeMultiFormData } = useContext<any>(StepperFormContext);
    const formikArrayHelpers = useRef<ArrayHelpers | null>(null);

    const dispatch = useAppDispatch();
    const { designationListResp, } =
        useAppSelector(({ masterData, instAcademics }) => ({
            designationListResp: masterData.designationListResp,
        }), shallowEqual);


    // useEffect(() => {
    //     const payload = { instituteId: 49, pageNo: 0, pageSize: 100 };
    //     dispatch(getInstAcademicYearAct(generateActionPayload("get_inst_academic_year", undefined, payload)));
    //     dispatch(getGenderListAct(generateActionPayload("get_inst_global_records", undefined, { categoryName: "gender" })));
    //     dispatch(getBloodGroupAct(generateActionPayload("get_inst_global_records", undefined, { categoryName: "blood-group" })));
    // }, []);

    function addDetailsHndlr() {
        if (formikArrayHelpers.current) {
            formikArrayHelpers.current.push({
                uniqueId: generateUniqueNumber(),
                id: undefined,
                designationId: "",
                experience: "",
                fromDate: "",
                organizationName: "",
                toDate: ""
            });
        }
    }

    function removeDetailsHndlr(event: React.MouseEvent<HTMLButtonElement>) {
        const rowIndex = event.currentTarget.getAttribute("data-index");
        if (rowIndex !== undefined || rowIndex !== null) {
            formikArrayHelpers.current?.remove(Number(rowIndex));
        }
    }

    const previouExperienceForm = useFormik({
        enableReinitialize: true,
        initialValues: previouExperienceState,
        validationSchema,
        onSubmit: (values: any) => {
            const { experienceList } = values,
                payload = experienceList.map((item: any) => {
                    const { uniqueId, ...otherInfo } = item;
                    return otherInfo;
                });
            storeMultiFormData("employeePastExperience", true, payload);
        }
    })
    useEffect(() => {
        if (Array.isArray(currentMultiFormKeys) && currentMultiFormKeys.includes("employeePastExperience"))
            submitHndlr();
        // previouExperienceForm.handleSubmit();
    }, [currentMultiFormKeys]);

    useEffect(() => {
        if (editEmployeeData) {
            const { employeePastExperience } = editEmployeeData,
                { formData } = employeePastExperience || {};
            if (formData)
                setPreviousExperienceState(getInitialState(formData));
        }
    }, [editEmployeeData]);

    function submitHndlr() {
        const { experienceList = [] } = previouExperienceForm.values;
        let validateForm = false;
        for (let i = 0; i < experienceList.length; i++) {
            const { uniqueId, ...otherInfo } = experienceList[i],
                checkValueInField = Object.values(otherInfo).some(item => item);
            if (checkValueInField) {
                validateForm = true;
                break;
            }
        }
        if (validateForm) {
            previouExperienceForm.handleSubmit();
        } else {
            previouExperienceForm.resetForm({
                values: { experienceList }
            });
            storeMultiFormData("employeePastExperience", true, null);
        }
    }

    function onBlurHndlr() {
        const { experienceList = [] } = previouExperienceForm.values,
            { uniqueId, ...otherInfo } = experienceList[0],
            checkValueInField = Object.values(otherInfo).some(item => item);
        if (experienceList.length === 1 && !checkValueInField) {
            previouExperienceForm.resetForm({
                values: { experienceList }
            });
        }
    }
    return (
        <form onSubmit={previouExperienceForm.handleSubmit}>
            <AccordionHeader tag="span" className="text-base font-medium" targetId="previous-experience">
                Previous Experience
            </AccordionHeader>
            <AccordionBody accordionId="previous-experience">
                <div className="tw-space-y-3">
                    <FormikProvider value={previouExperienceForm}>
                        <FieldArray name="experienceList">
                            {(arrayHelpers: ArrayHelpers) => {
                                if (!formikArrayHelpers.current) {
                                    formikArrayHelpers.current = arrayHelpers;
                                }

                                return (
                                    <>
                                        {previouExperienceForm.values.experienceList.length > 0 &&
                                            previouExperienceForm.values.experienceList.map(
                                                (experienceDetails: any, index: any) => {

                                                    const inputFieldErrors: any =
                                                        Array.isArray(previouExperienceForm.errors.experienceList) &&
                                                        previouExperienceForm.errors.experienceList[index] || {};

                                                    const inputFieldTouched =
                                                        Array.isArray(previouExperienceForm.touched.experienceList) &&
                                                        previouExperienceForm.touched.experienceList[index] || {};

                                                    return (
                                                        <div
                                                            key={experienceDetails.uniqueId}
                                                            className="tw-grid tw-grid-cols-1 md:tw-grid-cols-12 tw-gap-4"
                                                        >
                                                            <div className="md:tw-col-span-3">
                                                                <TextInput
                                                                    name={`experienceList[${index}].organizationName`}
                                                                    labelText="Organisation Name"
                                                                    value={experienceDetails.organizationName}
                                                                    onChange={previouExperienceForm.handleChange}
                                                                    onBlur={onBlurHndlr}
                                                                    invalid={(inputFieldTouched.organizationName && inputFieldErrors.organizationName) ? true : false}
                                                                    error={(inputFieldTouched.organizationName && inputFieldErrors.organizationName) ? inputFieldErrors.organizationName : ""}
                                                                />
                                                            </div>

                                                            <div className="md:tw-col-span-2">
                                                                <SelectInput
                                                                    name={`experienceList[${index}].designationId`}
                                                                    labelText="Designation"
                                                                    value={experienceDetails.designationId}
                                                                    onChange={previouExperienceForm.handleChange}
                                                                    onBlur={onBlurHndlr}
                                                                    invalid={(inputFieldTouched.designationId && inputFieldErrors.designationId) ? true : false}
                                                                    error={(inputFieldTouched.designationId && inputFieldErrors.designationId) ? inputFieldErrors.designationId : ""}
                                                                    menuItems={designationListResp?.data}
                                                                    valueKey="id"
                                                                    textKey="designationName"
                                                                />
                                                            </div>

                                                            <div className="md:tw-col-span-2">
                                                                <DateInput
                                                                    name={`experienceList[${index}].fromDate`}
                                                                    labelText="From Date"
                                                                    value={experienceDetails.fromDate}
                                                                    onChange={previouExperienceForm.handleChange}
                                                                    onBlur={onBlurHndlr}
                                                                    invalid={(inputFieldTouched.fromDate && inputFieldErrors.fromDate) ? true : false}
                                                                    error={(inputFieldTouched.fromDate && inputFieldErrors.fromDate) ? inputFieldErrors.fromDate : ""}
                                                                />
                                                                {/* <TextInput
                                                                    name={`experienceList[${index}].fromDate`}
                                                                    labelText="From Date"
                                                                    placeHolder=""
                                                                    value={experienceDetails.fromDate}
                                                                    onChange={previouExperienceForm.handleChange}
                                                                    invalid={(inputFieldTouched.fromDate && inputFieldErrors.fromDate) ? true : false}
                                                                    error={(inputFieldTouched.fromDate && inputFieldErrors.fromDate) ? inputFieldErrors.fromDate : ""}
                                                                /> */}
                                                            </div>
                                                            <div className="md:tw-col-span-2">
                                                                <DateInput
                                                                    name={`experienceList[${index}].toDate`}
                                                                    labelText="To Date"
                                                                    value={experienceDetails.toDate}
                                                                    onChange={previouExperienceForm.handleChange}
                                                                    onBlur={onBlurHndlr}
                                                                    invalid={(inputFieldTouched.toDate && inputFieldErrors.toDate) ? true : false}
                                                                    error={(inputFieldTouched.toDate && inputFieldErrors.toDate) ? inputFieldErrors.toDate : ""}
                                                                />
                                                                {/* <TextInput
                                                                    name={`experienceList[${index}].toDate`}
                                                                    labelText="To Date"
                                                                    placeHolder=""
                                                                    value={experienceDetails.toDate}
                                                                    onChange={previouExperienceForm.handleChange}
                                                                    invalid={(inputFieldTouched.toDate && inputFieldErrors.toDate) ? true : false}
                                                                    error={(inputFieldTouched.toDate && inputFieldErrors.toDate) ? inputFieldErrors.toDate : ""}
                                                                /> */}
                                                            </div>
                                                            <div className="md:tw-col-span-2 tw-flex tw-items-end tw-gap-3">
                                                                    <TextInput
                                                                        name={`experienceList[${index}].experience`}
                                                                        labelText="Year Experience (Yrs.)"
                                                                        value={experienceDetails.experience}
                                                                        onChange={previouExperienceForm.handleChange}
                                                                        onBlur={onBlurHndlr}
                                                                        invalid={(inputFieldTouched.experience && inputFieldErrors.experience) ? true : false}
                                                                        error={(inputFieldTouched.experience && inputFieldErrors.experience) ? inputFieldErrors.experience : ""}
                                                                        maxLength={2}
                                                                    />
                                                            </div>
                                                                {index !== 0 && (
                                                                <div className="md:tw-col-span-1 tw-flex tw-flex tw-items-center tw-justify-center tw-gap-3 tw-mt-2">
                                                                    <Button
                                                                        type="button"
                                                                        data-index={index}
                                                                        onClick={removeDetailsHndlr}
                                                                        variant="wrong"
                                                                        className="!tw-rounded-full !tw-p-2"
                                                                    >
                                                                        <HugeiconsIcon
                                                                            icon={Delete02StrokeStandard}
                                                                            className="tw-text-red-500"
                                                                            size={18}
                                                                        />
                                                                    </Button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                }
                                            )}
                                    </>
                                );
                            }}
                        </FieldArray>
                    </FormikProvider>
                    <div>
                        <Button
                            type="button"
                            variant="hoverInfo"
                            onClick={addDetailsHndlr}
                        >
                            Add New
                        </Button>
                        {/* <button type="button" onClick={submitHndlr} className="btn btn-success">
                            Submit
                        </button> */}
                    </div>
                </div>
            </AccordionBody>
        </form>
    )
}