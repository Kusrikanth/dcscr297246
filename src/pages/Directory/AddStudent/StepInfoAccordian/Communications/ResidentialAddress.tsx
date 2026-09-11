import { useState, useImperativeHandle, useContext, useEffect, useRef } from "react";
import { shallowEqual } from "react-redux";
import { UncontrolledAccordion, AccordionBody, AccordionHeader, AccordionItem, Collapse } from "reactstrap";

import { useFormik, setNestedObjectValues } from "formik";
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
    setCountryStateAct, setStateCityAct
} from "../../../../../store/masterdata/masterdataactions";

// Ol state
// function getInitialState(initialState: any) {
//     return {
//         currentAddress: "Dummy address",
//         currentHouseNo: initialState?.currentHouseNo || "Current house",
//         currentLandmark: initialState?.currentLandmark || "Landmark",
//         currentCountryId: initialState?.currentCountryId || "1",
//         currentStateId: initialState?.currentStateId || "1",
//         currentCityId: initialState?.currentCityId || "1",
//         currentPincode: initialState?.currentPincode || "1"
//     }
// }

function getInitialState(initialState: any) {
    return {
        id: initialState?.id || undefined,
        currentAddress: initialState?.currentAddress || "",
        currentHouseNo: initialState?.currentHouseNo || "",
        currentLandmark: initialState?.currentLandmark || "",
        currentCountryId: initialState?.currentCountryId || "",
        currentStateId: initialState?.currentStateId || "",
        currentCityId: initialState?.currentCityId || "",
        currentPincode: initialState?.currentPincode || ""
    }
}

const validationSchema = Yup.object().shape({
    currentHouseNo: Yup.string().required("House no required."),
    currentLandmark: Yup.string().required('Landmark required.'),
    currentCountryId: Yup.string().required("Select country."),
    currentStateId: Yup.string().when('currentCountryId', {
        is: (val: string) => val === 'India',
        then: schema => schema.required('Select state.'),
        otherwise: schema => schema.notRequired(),
    }),
    currentCityId: Yup.string().when('currentCountryId', {
        is: (val: string) => val === 'India',
        then: schema => schema.required('Select city.'),
        otherwise: schema => schema.notRequired(),
    }),
    currentPincode: Yup.string().matches(/^[0-9]{6,6}$/, 'Pincode must be 6 digit number.').required("Pincode required."),
});
export default function ResidentialAddress({ formDetails, refId, countriesResp }: any) {
    const [basicDetailsState, setBasicDetailsState] = useState<any>(getInitialState(formDetails));
    const { currentMultiFormKeys, editStudentData, storeMultiFormData, updateFormKeyDataHndlr,
        requestedMultiFormKeys } = useContext<any>(StepperFormContext);
    const requestedResidentialAddress = useRef<any>(false);
    const dispatch = useAppDispatch();
    const { countryStateResp, stateCityResp } = useAppSelector(({ masterData }) => ({
        countryStateResp: masterData.countryStateResp,
        stateCityResp: masterData.stateCityResp,
    }), shallowEqual);

    const residentialForm = useFormik({
        enableReinitialize: true,
        initialValues: basicDetailsState,
        validationSchema,
        onSubmit: (values: any) => {
            storeMultiFormData("residentialAddress", true, values);
        }
    })

    useEffect(() => {
        const { residentialAddress } = editStudentData || {},
            { formData } = residentialAddress || {};
        if (formData && !requestedResidentialAddress.current) {
            const { currentCountryId, currentStateId } = formData;
            if (currentCountryId) {
                dispatch(getCountryStateAct(generateActionPayload("get_stateby_countryname", { countryName: currentCountryId })));
            }
            if (currentStateId) {
                dispatch(getStateCityAct(generateActionPayload("get_cityby_statename", { stateName: currentStateId })));
            }
            setBasicDetailsState(getInitialState(formData));
        }
    }, [editStudentData]);


    useEffect(() => {
        if (Array.isArray(currentMultiFormKeys) && currentMultiFormKeys.includes("residentialAddress"))
            residentialForm.handleSubmit();
    }, [currentMultiFormKeys]);

    useEffect(() => {
        if (Array.isArray(requestedMultiFormKeys) && requestedMultiFormKeys.includes("residentialAddress")) {
            residentialForm.validateForm().then(formKeys => {
                if (Object.keys(formKeys).length === 0) {
                    updateFormKeyDataHndlr("residentialAddress", residentialForm.values);
                    requestedResidentialAddress.current = true
                } else {
                    residentialForm.setTouched(setNestedObjectValues<any>(formKeys, true));
                }
            })
        }
    }, [requestedMultiFormKeys]);

    function onChangeCountryHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { target } = event, { name, value } = target;
        if (name === "currentCountryId") {
            if (value) {
                dispatch(getCountryStateAct(generateActionPayload("get_stateby_countryname", { countryName: value })));
            }
            dispatch(setCountryStateAct(undefined));
            dispatch(setStateCityAct(undefined));
            residentialForm.setValues((prevState: any) => ({ ...prevState, currentStateId: "", currentCityId: "", [name]: value }));
        } else if (name === "currentStateId") {
            if (value) {
                dispatch(getStateCityAct(generateActionPayload("get_cityby_statename", { stateName: value })));
            }
            dispatch(setStateCityAct(undefined));
            residentialForm.setValues((prevState: any) => ({ ...prevState, currentCityId: "", [name]: value }));
        }
    }

    const isStateCityRequired = residentialForm.values.currentCountryId === 'India';

    return (
        <form onSubmit={residentialForm.handleSubmit}>
            <AccordionHeader tag="h4" targetId="permanent">
                Residential Address
            </AccordionHeader>
            <AccordionBody accordionId="permanent">
                <div className="tw-grid tw-grid-cols-12 tw-gap-4">
                    <div className="tw-col-span-12 md:tw-col-span-4">
                        <TextInput
                            name="currentHouseNo"
                            labelText="H.No / Flat No"
                            value={residentialForm.values.currentHouseNo}
                            onChange={residentialForm.handleChange}
                            onBlur={residentialForm.handleBlur}
                            labelClass="required"
                            invalid={(residentialForm.touched.currentHouseNo && residentialForm.errors.currentHouseNo) ? true : false}
                            error={(residentialForm.touched.currentHouseNo && residentialForm.errors.currentHouseNo) ? residentialForm.errors.currentHouseNo : ""}
                        />
                    </div>
                    <div className="tw-col-span-12 md:tw-col-span-4">
                        <TextInput
                            name="currentLandmark"
                            labelText="Location / Landmark"
                            value={residentialForm.values.currentLandmark}
                            onChange={residentialForm.handleChange}
                            onBlur={residentialForm.handleBlur}
                            labelClass="required"
                            invalid={(residentialForm.touched.currentLandmark && residentialForm.errors.currentLandmark) ? true : false}
                            error={(residentialForm.touched.currentLandmark && residentialForm.errors.currentLandmark) ? residentialForm.errors.currentLandmark : ""}
                        />
                    </div>

                    <div className="tw-col-span-12 md:tw-col-span-4">
                        <SelectInput
                            name="currentCountryId"
                            labelText="Country"
                            value={residentialForm.values.currentCountryId}
                            onChange={onChangeCountryHndlr}
                            onBlur={residentialForm.handleBlur}
                            labelClass="required"
                            invalid={(residentialForm.touched.currentCountryId && residentialForm.errors.currentCountryId) ? true : false}
                            error={(residentialForm.touched.currentCountryId && residentialForm.errors.currentCountryId) ? residentialForm.errors.currentCountryId : ""}
                            menuItems={countriesResp}
                            valueKey="countryName"
                            textKey="countryName"
                        />
                    </div>

                    <div className="tw-col-span-12 md:tw-col-span-4">
                        <SelectInput
                            name="currentStateId"
                            labelText="State"
                            value={residentialForm.values.currentStateId}
                            onChange={onChangeCountryHndlr}
                            onBlur={residentialForm.handleBlur}
                            labelClass={isStateCityRequired ? "required" : ""}
                            invalid={(residentialForm.touched.currentStateId && residentialForm.errors.currentStateId) ? true : false}
                            error={(residentialForm.touched.currentStateId && residentialForm.errors.currentStateId) ? residentialForm.errors.currentStateId : ""}
                            menuItems={countryStateResp}
                            valueKey="stateName"
                            textKey="stateName"
                        />
                    </div>

                    <div className="tw-col-span-12 md:tw-col-span-4">
                        <SelectInput
                            name="currentCityId"
                            labelText="City"
                            value={residentialForm.values.currentCityId}
                            onChange={residentialForm.handleChange}
                            onBlur={residentialForm.handleBlur}
                            labelClass={isStateCityRequired ? "required" : ""}
                            invalid={(residentialForm.touched.currentCityId && residentialForm.errors.currentCityId) ? true : false}
                            error={(residentialForm.touched.currentCityId && residentialForm.errors.currentCityId) ? residentialForm.errors.currentCityId : ""}
                            menuItems={stateCityResp}
                            valueKey="cityName"
                            textKey="cityName"
                        />
                    </div>

                    <div className="tw-col-span-12 md:tw-col-span-4">
                        <TextInputWithRegex
                            name="currentPincode"
                            labelText="PIN Code"
                            value={residentialForm.values.currentPincode}
                            onChange={residentialForm.handleChange}
                            onBlur={residentialForm.handleBlur}
                            labelClass="required"
                            invalid={(residentialForm.touched.currentPincode && residentialForm.errors.currentPincode) ? true : false}
                            error={(residentialForm.touched.currentPincode && residentialForm.errors.currentPincode) ? residentialForm.errors.currentPincode : ""}
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