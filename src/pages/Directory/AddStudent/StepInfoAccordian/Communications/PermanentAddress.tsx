import React, { useState, useImperativeHandle, useContext, useEffect, useRef } from "react";
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
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";

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
    getCountryStateAct, getStateCityAct,
} from "../../../../../store/masterdata/masterdataactions";
import {
    permanentAddressCityAct, permanentAddressStateAct
} from "../../../../../store/directory/studentmanagement/studentmanagementactions";


//  Old State
// function getInitialState(initialState: any) {
//     return {
//         permanentAddress: "Testing Address",
//         isPermanentAddress: initialState?.isPermanentAddress || false,
//         permanentHouseNo: initialState?.permanentHouseNo || "Permanent House No",
//         permanentLandmark: initialState?.permanentLandmark || "Permanent Landmark",
//         permanentCountryId: initialState?.permanentCountryId || "1",
//         permanentStateId: initialState?.permanentStateId || "1",
//         permanentCityId: initialState?.permanentCityId || "12",
//         permanentPincode: initialState?.permanentPincode || "123456"
//     }
// }

function getTrueFalseOptions(fieldValue: any) {
    if (typeof fieldValue === "boolean") {
        return fieldValue ? "true" : "false";
    }
    return fieldValue || "false";
}
function getInitialState(initialState?: any) {
    return {
        id: initialState?.id || undefined,
        permanentAddress: "Permanent address.",
        isPermanentAddress: getTrueFalseOptions(initialState?.isPermanentAddress),
        permanentHouseNo: initialState?.permanentHouseNo || "",
        permanentLandmark: initialState?.permanentLandmark || "",
        permanentCountryId: initialState?.permanentCountryId || "",
        permanentStateId: initialState?.permanentStateId || "",
        permanentCityId: initialState?.permanentCityId || "",
        permanentPincode: initialState?.permanentPincode || ""
    }
}
const validationSchema = Yup.object().shape({
    permanentAddress: Yup.string().required("Address required."),
    permanentHouseNo: Yup.string().required("House no required."),
    permanentLandmark: Yup.string().required('Landmark required.'),
    permanentCountryId: Yup.string().required("Select country."),
    permanentStateId: Yup.string().when('permanentCountryId', {
        is: (val: string) => val === 'India',
        then: schema => schema.required('Select state.'),
        otherwise: schema => schema.notRequired(),
    }),
    permanentCityId: Yup.string().when('permanentCountryId', {
        is: (val: string) => val === 'India',
        then: schema => schema.required('Select city.'),
        otherwise: schema => schema.notRequired(),
    }),
    permanentPincode: Yup.string().matches(/^[0-9]{6,6}$/, 'Pincode must be 6 digit number.').required("Pincode required."),
});

export default function PermanentAddress({ formDetails, refId, countriesResp }: any) {
    const [basicDetailsState, setBasicDetailsState] = useState<any>(getInitialState(formDetails));
    const { currentMultiFormKeys, editStudentData, storeMultiFormData,
        submitCurrentFormCllbck, requestedMultiFormKeyCllback } = useContext<any>(StepperFormContext);
    const [stateListState, setStateListState] = useState<any>([]);
    const [cityListState, setCityListState] = useState<any>([]);
    const dispatch = useAppDispatch();
    const fieldUpdatedRef = useRef({
        requestCurrentAddress: false,
    });
    const { countryStateResp, stateCityResp, permanentAddressStateResp,
        permanentAddressCityResp } = useAppSelector(({ masterData, directoryStudent }) => ({
            countryStateResp: masterData.countryStateResp,
            stateCityResp: masterData.stateCityResp,
            permanentAddressStateResp: directoryStudent.permanentAddressStateResp,
            permanentAddressCityResp: directoryStudent.permanentAddressCityResp

        }), shallowEqual);

    const permanentAddressForm = useFormik({
        enableReinitialize: true,
        initialValues: basicDetailsState,
        validationSchema,
        onSubmit: (values: any) => {
            storeMultiFormData("permanentAddress", true, values);
        }
    })

    useEffect(() => {
        const { permanentAddress, residentialAddress } = editStudentData || {},
            { formData } = permanentAddress || {},
            { formData: residentialFormData } = residentialAddress || {},
            { requestCurrentAddress } = fieldUpdatedRef.current;
        if (requestCurrentAddress && residentialFormData) {
            const { currentAddress, currentCityId, currentCountryId, currentHouseNo,
                currentLandmark, currentPincode, currentStateId
            } = residentialFormData;
            if (currentCountryId) {
                dispatch(permanentAddressStateAct(generateActionPayload("get_stateby_countryname", { countryName: currentCountryId })));
            }
            if (currentStateId) {
                dispatch(permanentAddressCityAct(generateActionPayload("get_cityby_statename", { stateName: currentStateId })));
            }
            permanentAddressForm.resetForm({
                values: {
                    permanentAddress: currentAddress,
                    isPermanentAddress: "true",
                    permanentHouseNo: currentHouseNo,
                    permanentLandmark: currentLandmark,
                    permanentCountryId: currentCountryId,
                    permanentStateId: currentStateId,
                    permanentCityId: currentCityId,
                    permanentPincode: currentPincode
                }
            })
        } else if (formData) {
            const { permanentCountryId, permanentStateId } = formData;
            if (permanentCountryId) {
                dispatch(permanentAddressStateAct(generateActionPayload("get_stateby_countryname", { countryName: permanentCountryId })));
            }
            if (permanentStateId) {
                dispatch(permanentAddressCityAct(generateActionPayload("get_cityby_statename", { stateName: permanentStateId })));
            }
            setBasicDetailsState(getInitialState(formData));
        }
    }, [editStudentData]);


    useEffect(() => {
        const { requestCurrentAddress } = fieldUpdatedRef.current;
        if (Array.isArray(currentMultiFormKeys) && currentMultiFormKeys.includes("permanentAddress")) {
            submitHndlr();
        }
    }, [currentMultiFormKeys]);

    function submitHndlr() {
        const { isPermanentAddress } = permanentAddressForm.values;
        if (isPermanentAddress && isPermanentAddress === "true") {
            storeMultiFormData("permanentAddress", true, permanentAddressForm.values);
        } else {
            permanentAddressForm.handleSubmit();
        }
    }

    function onChangeCountryHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { target } = event, { name, value } = target;
        if (name === "permanentCountryId") {
            if (value) {
                dispatch(permanentAddressStateAct(generateActionPayload("get_stateby_countryname", { countryName: value })));
            }
            permanentAddressForm.setValues((prevState: any) => ({ ...prevState, permanentStateId: "", permanentCityId: "", [name]: value }));
        } else if (name === "permanentStateId") {
            if (value) {
                dispatch(permanentAddressCityAct(generateActionPayload("get_cityby_statename", { stateName: value })));
            }
            permanentAddressForm.setValues((prevState: any) => ({ ...prevState, permanentCityId: "", [name]: value }));
        }
    }

    function isPermanentAddressHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        if (value === "true") {
            fieldUpdatedRef.current.requestCurrentAddress = true;
            requestedMultiFormKeyCllback(["residentialAddress"]);
        }
        permanentAddressForm.resetForm({ values: getInitialState() });

    }

    const isStateCityRequired = permanentAddressForm.values.permanentCountryId === 'India';


    return (
        <form onSubmit={permanentAddressForm.handleSubmit}>
            <AccordionHeader tag="h4" targetId="residential">
                Permanent Address
            </AccordionHeader>
            <AccordionBody accordionId="residential">
                <div className="tw-grid tw-grid-cols-12 tw-gap-4">
                    <div className="tw-col-span-12">
                        <RadioInputContainer
                            name="isPermanentAddress"
                            labelText="Is Permanent Address is same as Correspondence Address ?"
                            containerClassName="tw-grid tw-grid-cols-12 tw-items-center"
                            labelClassName="tw-col-span-12 md:tw-col-span-6 tw-mb-2 md:tw-mb-0"
                            radioOptions={trueFalseOptions}
                            value={permanentAddressForm.values.isPermanentAddress}
                            onChange={isPermanentAddressHndlr}
                        />
                    </div>

                    <div className="tw-col-span-12 md:tw-col-span-4">
                        <TextInput
                            name="permanentHouseNo"
                            labelText="H.No / Flat No"
                            value={permanentAddressForm.values.permanentHouseNo}
                            onChange={permanentAddressForm.handleChange}
                            labelClass="required"
                            invalid={(permanentAddressForm.touched.permanentHouseNo && permanentAddressForm.errors.permanentHouseNo) ? true : false}
                            error={(permanentAddressForm.touched.permanentHouseNo && permanentAddressForm.errors.permanentHouseNo) ? permanentAddressForm.errors.permanentHouseNo : ""}
                            isDisabled={permanentAddressForm.values.isPermanentAddress === "true"}
                        />
                    </div>

                    <div className="tw-col-span-12 md:tw-col-span-4">
                        <TextInput
                            name="permanentLandmark"
                            labelText="Location / Landmark"
                            value={permanentAddressForm.values.permanentLandmark}
                            onChange={permanentAddressForm.handleChange}
                            labelClass="required"
                            invalid={(permanentAddressForm.touched.permanentLandmark && permanentAddressForm.errors.permanentLandmark) ? true : false}
                            error={(permanentAddressForm.touched.permanentLandmark && permanentAddressForm.errors.permanentLandmark) ? permanentAddressForm.errors.permanentLandmark : ""}
                            isDisabled={permanentAddressForm.values.isPermanentAddress === "true"}
                        />
                    </div>

                    <div className="tw-col-span-12 md:tw-col-span-4">
                        <SelectInput
                            name="permanentCountryId"
                            labelText="Country"
                            value={permanentAddressForm.values.permanentCountryId}
                            onChange={onChangeCountryHndlr}
                            labelClass="required"
                            invalid={(permanentAddressForm.touched.permanentCountryId && permanentAddressForm.errors.permanentCountryId) ? true : false}
                            error={(permanentAddressForm.touched.permanentCountryId && permanentAddressForm.errors.permanentCountryId) ? permanentAddressForm.errors.permanentCountryId : ""}
                            menuItems={countriesResp}
                            valueKey="countryName"
                            textKey="countryName"
                            isDisabled={permanentAddressForm.values.isPermanentAddress === "true"}
                        />
                        {/* <TextInput
                            name="permanentCountryId"
                            labelText="Country"
                            value={permanentAddressForm.values.permanentCountryId}
                            onChange={permanentAddressForm.handleChange}
                            invalid={(permanentAddressForm.touched.permanentCountryId && permanentAddressForm.errors.permanentCountryId) ? true : false}
                            error={(permanentAddressForm.touched.permanentCountryId && permanentAddressForm.errors.permanentCountryId) ? permanentAddressForm.errors.permanentCountryId : ""}
                        /> */}
                    </div>

                    <div className="tw-col-span-12 md:tw-col-span-4">
                        <SelectInput
                            name="permanentStateId"
                            labelText="State"
                            value={permanentAddressForm.values.permanentStateId}
                            onChange={onChangeCountryHndlr}
                            labelClass={isStateCityRequired ? "required" : ""}
                            invalid={(permanentAddressForm.touched.permanentStateId && permanentAddressForm.errors.permanentStateId) ? true : false}
                            error={(permanentAddressForm.touched.permanentStateId && permanentAddressForm.errors.permanentStateId) ? permanentAddressForm.errors.permanentStateId : ""}
                            menuItems={permanentAddressStateResp}
                            valueKey="stateName"
                            textKey="stateName"
                            isDisabled={permanentAddressForm.values.isPermanentAddress === "true"}
                        />
                        {/* <TextInput
                            name="permanentStateId"
                            labelText="State"
                            value={permanentAddressForm.values.permanentStateId}
                            onChange={permanentAddressForm.handleChange}
                            invalid={(permanentAddressForm.touched.permanentStateId && permanentAddressForm.errors.permanentStateId) ? true : false}
                            error={(permanentAddressForm.touched.permanentStateId && permanentAddressForm.errors.permanentStateId) ? permanentAddressForm.errors.permanentStateId : ""}
                        /> */}
                    </div>

                    <div className="tw-col-span-12 md:tw-col-span-4">
                        <SelectInput
                            name="permanentCityId"
                            labelText="City"
                            value={permanentAddressForm.values.permanentCityId}
                            onChange={permanentAddressForm.handleChange}
                            labelClass={isStateCityRequired ? "required" : ""}
                            invalid={(permanentAddressForm.touched.permanentCityId && permanentAddressForm.errors.permanentCityId) ? true : false}
                            error={(permanentAddressForm.touched.permanentCityId && permanentAddressForm.errors.permanentCityId) ? permanentAddressForm.errors.permanentCityId : ""}
                            menuItems={permanentAddressCityResp}
                            valueKey="cityName"
                            textKey="cityName"
                            isDisabled={permanentAddressForm.values.isPermanentAddress === "true"}
                        />
                    </div>

                    <div className="tw-col-span-12 md:tw-col-span-4">
                        <TextInputWithRegex
                            name="permanentPincode"
                            labelText="PIN Code"
                            value={permanentAddressForm.values.permanentPincode}
                            onChange={permanentAddressForm.handleChange}
                            labelClass="required"
                            invalid={(permanentAddressForm.touched.permanentPincode && permanentAddressForm.errors.permanentPincode) ? true : false}
                            error={(permanentAddressForm.touched.permanentPincode && permanentAddressForm.errors.permanentPincode) ? permanentAddressForm.errors.permanentPincode : ""}
                            isDisabled={permanentAddressForm.values.isPermanentAddress === "true"}
                            allowedInputRegex="^[0-9]{0,6}$"
                            maxLength={10}
                        />
                    </div>
                    {/* <div className="col-12">
                        <input type="submit" value="Submit Permanent" />
                    </div> */}
                </div>
            </AccordionBody>
        </form>
    )
}