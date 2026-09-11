import { useEffect, useContext } from "react";
import { shallowEqual } from "react-redux";
import { AccordionBody, AccordionHeader, AccordionItem, Collapse } from "reactstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
    TextInput, SelectInput, TextInputWithRegex, RadioInputContainer
} from "../../../../../../Components/Common";
import { StepperFormContext, uuidTypes } from "../helper";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../../../../hooks/storehook";
//Action Generator
import { generateActionPayload } from "../../../../../../utility/reduxutility";
import {
    getNationalityAct, getReligionAct, getCasteListAct, getMotherToungeAct
} from "../../../../../../store/masterdata/masterdataactions";

function getInitialState(initialState?: any) {
    const uuidType = initialState?.foreignNationalPassportNumber ? "passport" : "aadhar";
    return {
        nationalityId: initialState?.nationalityId || "",
        uuidType: uuidType,
        religionId: initialState?.religionId || "",

        aadharNo: initialState?.aadharNo || "",
        foreignNationalPassportNumber: initialState?.foreignNationalPassportNumber || "",
        identificationMarks1: initialState?.identificationMarks1 || "",
        identificationMarks2: initialState?.identificationMarks2 || "",
    }
}

const validationSchema = Yup.object().shape({
    uuidType: Yup.string(),
    nationalityId: Yup.string().required("Nationality required."),
    religionId: Yup.string().required("Select religion."),
    identificationMarks1: Yup.string().required("Identification mark 1 is required."),
    aadharNo: Yup.string().when('uuidType', {
        is: (uuidType: any) => uuidType === "aadhar",
        then: Yup.string().matches(/^[0-9]{12,12}$/, 'Aadhar card number should be 12 digit.').required("Aadhar number required.")
    }),
    identificationMarks2: Yup.string().required("Identification mark 2 is required.").test("identificationMark2Check", "Identification mark 2 cannot be same as identification mark 1.",
        (value: any, schema: any) => {
            if (value && value?.toLowerCase() === schema.parent?.identificationMarks1?.toLowerCase()) {
                return false
            }
            return true;
        }),
});

const initialValues = getInitialState();
export default function IdentificationDetails({ isViewMode, stepId, formId, formDetails, storeMultiFormDataCallback }: any) {
    const { currentMultiFormKeys, tabsData } = useContext<any>(StepperFormContext);

    const dispatch = useAppDispatch();
    const { nationalityResp, religionResp, masterDataErrorResp } =
        useAppSelector(({ masterData, instAcademics }) => ({
            nationalityResp: masterData.nationalityResp,
            religionResp: masterData.religionResp,

            masterDataErrorResp: masterData.masterDataErrorResp
        }), shallowEqual);

    useEffect(() => {
        dispatch(getNationalityAct(generateActionPayload("get_inst_global_records", undefined, { categoryName: "nationality", sortBy: "id", orderBy: "asc", pageNo: 0, pageSize: 25 })));
        dispatch(getReligionAct(generateActionPayload("get_inst_global_records", undefined, { categoryName: "religion", sortBy: "id", orderBy: "asc", pageNo: 0, pageSize: 100 })));
    }, []);

    const identificationForm = useFormik({
        enableReinitialize: true,
        initialValues,
        validationSchema,
        onSubmit: (values: any) => {
            storeMultiFormDataCallback(formId, true, identificationForm.dirty, values);
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

    function uuidTypeHandler(event: any) {
        const { name, value } = event.target;
        identificationForm.setValues(prevState => ({
            ...prevState, [name]: value,
            aadharNo: "", foreignNationalPassportNumber: ""
        }));
    }


    function onChangeIdentficationHandler(event: any) {
        const { name, value } = event.target;
        if (name === "aadharNo") {
            identificationForm.setValues(prevState => ({
                ...prevState,
                [name]: value,
                foreignNationalPassportNumber: ""
            }))
        } else {
            identificationForm.setValues(prevState => ({
                ...prevState,
                [name]: value,
                aadharNo: ""
            }))
        }
    }

    return (
        <form onSubmit={identificationForm.handleSubmit}>
            <AccordionHeader tag="h5" targetId="identification">
                Identification
            </AccordionHeader>
            <AccordionBody accordionId="identification">
                <div className="tw-grid tw-grid-cols-12 tw-gap-x-3">

                    {/* UID Type Radio */}
                    <div className="tw-col-span-12">
                        <RadioInputContainer
                            name="uuidType"
                            labelText="Select UID Number"
                            containerClassName="tw-me-3"
                            radioClassName="form-radio-green"
                            radioOptions={uuidTypes}
                            isDisabled={isViewMode}
                            value={identificationForm.values.uuidType}
                            onChange={uuidTypeHandler}
                        />
                    </div>

                    {/* Aadhar Field */}
                    {identificationForm.values.uuidType === "aadhar" && (
                        <div className="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-4 2xl:tw-col-span-3">
                            <TextInputWithRegex
                                name="aadharNo"
                                labelText="Aadhar Number"
                                labelClass="required"
                                inputClassName="ng-input"
                                isDisabled={isViewMode}
                                value={identificationForm.values.aadharNo}
                                onChange={onChangeIdentficationHandler}
                                onBlur={identificationForm.handleBlur}
                                invalid={(identificationForm.touched.aadharNo && identificationForm.errors.aadharNo) ? true : false}
                                error={(identificationForm.touched.aadharNo && identificationForm.errors.aadharNo) ? identificationForm.errors.aadharNo : ""}
                                maxLength={12}
                                allowedInputRegex="^[0-9]+$"
                            />
                        </div>
                    )}

                    {/* Passport Field */}
                    {identificationForm.values.uuidType === "passport" && (
                        <div className="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-4 2xl:tw-col-span-3">
                            <TextInput
                                name="foreignNationalPassportNumber"
                                labelText="Foreign National Passport Number"
                                inputClassName="ng-input"
                                value={identificationForm.values.foreignNationalPassportNumber}
                                onChange={onChangeIdentficationHandler}
                            />
                        </div>
                    )}

                    {/* Nationality */}
                    <div className="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-4 2xl:tw-col-span-3">
                        <SelectInput
                            name="nationalityId"
                            labelText="Nationality"
                            labelClass="required"
                            inputClassName="ng-input"
                            isDisabled={isViewMode}
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

                    {/* Religion */}
                    <div className="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-4 2xl:tw-col-span-3">
                        <SelectInput
                            name="religionId"
                            labelText="Religion"
                            labelClass="required"
                            inputClassName="ng-input"
                            isDisabled={isViewMode}
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

                    {/* Identification Mark 1 */}
                    <div className="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-4 2xl:tw-col-span-3">
                        <TextInput
                            name="identificationMarks1"
                            labelText="Identification Mark 1"
                            labelClass="required"
                            inputClassName="ng-input"
                            isDisabled={isViewMode}
                            value={identificationForm.values.identificationMarks1}
                            onChange={identificationForm.handleChange}
                            onBlur={identificationForm.handleBlur}
                            invalid={(identificationForm.touched.identificationMarks1 && identificationForm.errors.identificationMarks1) ? true : false}
                            error={(identificationForm.touched.identificationMarks1 && identificationForm.errors.identificationMarks1) ? identificationForm.errors.identificationMarks1 : ""}
                        />
                    </div>

                    {/* Identification Mark 2 */}
                    <div className="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-4 2xl:tw-col-span-3">
                        <TextInput
                            name="identificationMarks2"
                            labelText="Identification Mark 2"
                            labelClass="required"
                            inputClassName="ng-input"
                            isDisabled={isViewMode}
                            value={identificationForm.values.identificationMarks2}
                            onChange={identificationForm.handleChange}
                            onBlur={identificationForm.handleBlur}
                            invalid={(identificationForm.touched.identificationMarks2 && identificationForm.errors.identificationMarks2) ? true : false}
                            error={(identificationForm.touched.identificationMarks2 && identificationForm.errors.identificationMarks2) ? identificationForm.errors.identificationMarks2 : ""}
                        />
                    </div>

                </div>
            </AccordionBody>
        </form>
    )
}