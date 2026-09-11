import { useState, useEffect, useImperativeHandle, useContext, useRef } from "react";
import { shallowEqual } from "react-redux";
import { UncontrolledAccordion, AccordionBody, AccordionHeader, AccordionItem, Collapse } from "reactstrap";

import { useFormik } from "formik";
import * as Yup from "yup";
import {
    ModalContainer, TextIconInput, TextInput, DateInput, SelectInput, PhoneInput,
    RadioInputContainer, Switch,
    UploadImage, TextInputWithRegex
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

//Action Generator
import { generateActionPayload } from "../../../../../utility/reduxutility";
import { getCountriesAct, getCountryStateAct, getStateCityAct } from "../../../../../store/masterdata/masterdataactions";

//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";


const validationSchema = Yup.object().shape({
    addressLine: Yup.string().required("Address required."),
    area: Yup.string().required("Area required."),
    countryId: Yup.string().required("Select country."),

    district: Yup.string()
    .when('countryId', {
        is: '100',
        then: Yup.string()
            .required("District required."),
        otherwise: Yup.string().notRequired()
    }),

    pincode: Yup.string()
        .when('countryId', {
            is: '100',
            then: Yup.string()
                .required("Pincode required."),
            otherwise: Yup.string().notRequired()
        }),

    stateId: Yup.string()
        .when('countryId', {
            is: '100',
            then: Yup.string().required("Select state."),
            otherwise: Yup.string().notRequired()
        }),

    cityId: Yup.string()
        .when('countryId', {
            is: '100',
            then: Yup.string().required("Select city."),
            otherwise: Yup.string().notRequired()
        }),
});


function getInitialState(initialState?: any) {
    return {
        id: initialState?.id || undefined,
        addressLine: initialState?.addressLine || "",
        area: initialState?.area || "",
        cityId: initialState?.cityId || "",
        countryId: initialState?.countryId || "",
        district: initialState?.district || "",
        pincode: initialState?.pincode || "",
        stateId: initialState?.stateId || "",
    }
}

export default function ContactDetails({ instituteId, branchId }: any) {
    const [contactDetailState, setContactDetailState] = useState<any>(getInitialState());
    const { currentMultiFormKeys, editEmployeeData,
        storeMultiFormData } = useContext<any>(StepperFormContext);

    const dispatch = useAppDispatch();
    const { countriesResp, countryStateResp, stateCityResp } =
        useAppSelector(({ masterData }) => ({
            countriesResp: masterData.countriesResp,
            countryStateResp: masterData.countryStateResp,
            stateCityResp: masterData.stateCityResp,
            // countryStateResp: masterData,
        }), shallowEqual);

    useEffect(() => {
        if (!countriesResp)
            dispatch(getCountriesAct(generateActionPayload("get_countries")));
    }, [countriesResp]);


    const contactDetailForm = useFormik({
        enableReinitialize: true,
        initialValues: contactDetailState,
        validationSchema,
        onSubmit: (values: any) => {
            const formData = {
                ...values
            }
            storeMultiFormData("employeeContactDetails", true, formData);
        }
    })
    useEffect(() => {
        if (Array.isArray(currentMultiFormKeys) && currentMultiFormKeys.includes("employeeContactDetails"))
            contactDetailForm.handleSubmit();
    }, [currentMultiFormKeys]);

    useEffect(() => {
        if (editEmployeeData) {
            const { employeeContactDetails } = editEmployeeData,
                { formData } = employeeContactDetails || {};
            if (formData) {
                setContactDetailState(getInitialState(formData));
            }
        }
    }, [editEmployeeData]);


    function onChangeCountryHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { target } = event, { name, value } = target;
        if (name === "countryId") {
            if (value) {
                dispatch(getCountryStateAct(generateActionPayload("get_country_state", { countryId: value })));

            }
            contactDetailForm.setValues((prevState: any) => ({ ...prevState, stateId: "", cityId: "", [name]: value }));
        } else if (name === "stateId") {
            if (value) {
                dispatch(getStateCityAct(generateActionPayload("get_state_city", { stateId: value })));

            }
            contactDetailForm.setValues((prevState: any) => ({ ...prevState, cityId: "", [name]: value }));
        }
    }

    return (
        <form onSubmit={contactDetailForm.handleSubmit}>
            <AccordionHeader tag="span" className="tw-text-base tw-font-medium" targetId="contact-details">
                Contact Details
            </AccordionHeader>
            <AccordionBody accordionId="contact-details">
                <div className="tw-grid tw-grid-cols-12 tw-gap-4">
                    <div className="tw-col-span-12 md:tw-col-span-4">
                        <TextInput
                            name="addressLine"
                            labelText="Address"
                            value={contactDetailForm.values.addressLine}
                            onChange={contactDetailForm.handleChange}
                            onBlur={contactDetailForm.handleBlur}
                            invalid={(contactDetailForm.touched.addressLine && contactDetailForm.errors.addressLine) ? true : false}
                            error={(contactDetailForm.touched.addressLine && contactDetailForm.errors.addressLine) ? contactDetailForm.errors.addressLine : ""}
                            maxLength={150}
                            labelClass="required"
                        />
                    </div>
                    <div className="tw-col-span-12 md:tw-col-span-4">
                        <TextInput
                            name="area"
                            labelText="Area"
                            value={contactDetailForm.values.area}
                            onChange={contactDetailForm.handleChange}
                            onBlur={contactDetailForm.handleBlur}
                            invalid={(contactDetailForm.touched.area && contactDetailForm.errors.area) ? true : false}
                            error={(contactDetailForm.touched.area && contactDetailForm.errors.area) ? contactDetailForm.errors.area : ""}
                            maxLength={150}
                            labelClass="required"
                        />
                    </div>
                    <div className="tw-col-span-12 md:tw-col-span-4">
                        <SelectInput
                            name="countryId"
                            labelText="Country"
                            value={contactDetailForm.values.countryId}
                            onChange={onChangeCountryHndlr}
                            onBlur={contactDetailForm.handleBlur}
                            invalid={(contactDetailForm.touched.countryId && contactDetailForm.errors.countryId) ? true : false}
                            error={(contactDetailForm.touched.countryId && contactDetailForm.errors.countryId) ? contactDetailForm.errors.countryId : ""}
                            menuItems={countriesResp}
                            valueKey="id"
                            textKey="countryName"
                            labelClass="required"
                        />
                    </div>
                    <div className="tw-col-span-12 md:tw-col-span-4">
                        <SelectInput
                            name="stateId"
                            labelText="State"
                            value={contactDetailForm.values.stateId}
                            onChange={onChangeCountryHndlr}
                            onBlur={contactDetailForm.handleBlur}
                            invalid={(contactDetailForm.touched.stateId && contactDetailForm.errors.stateId) ? true : false}
                            error={(contactDetailForm.touched.stateId && contactDetailForm.errors.stateId) ? contactDetailForm.errors.stateId : ""}
                            menuItems={countryStateResp}
                            valueKey="id"
                            textKey="stateName"
                            labelClass={contactDetailForm.values.countryId === '100' ? 'required' : ''}
                        />
                    </div>
                    <div className="tw-col-span-12 md:tw-col-span-4">
                        <SelectInput
                            name="cityId"
                            labelText="City"
                            value={contactDetailForm.values.cityId}
                            onChange={contactDetailForm.handleChange}
                            onBlur={contactDetailForm.handleBlur}
                            invalid={(contactDetailForm.touched.cityId && contactDetailForm.errors.cityId) ? true : false}
                            error={(contactDetailForm.touched.cityId && contactDetailForm.errors.cityId) ? contactDetailForm.errors.cityId : ""}
                            menuItems={stateCityResp}
                            valueKey="id"
                            textKey="cityName"
                            labelClass={contactDetailForm.values.countryId === '100' ? 'required' : ''}
                        />
                    </div>
                    <div className="tw-col-span-12 md:tw-col-span-4">
                        <TextInputWithRegex
                            name="district"
                            labelText="District"
                            value={contactDetailForm.values.district}
                            onChange={contactDetailForm.handleChange}
                            onBlur={contactDetailForm.handleBlur}
                            invalid={(contactDetailForm.touched.district && contactDetailForm.errors.district) ? true : false}
                            error={(contactDetailForm.touched.district && contactDetailForm.errors.district) ? contactDetailForm.errors.district : ""}
                            labelClass={contactDetailForm.values.countryId === '100' ? 'required' : ''}
                        />
                        {/* <SelectInput
                            name="district"
                            labelText="District"
                            value={contactDetailForm.values.district}
                            onChange={contactDetailForm.handleChange}
                            invalid={(contactDetailForm.touched.district && contactDetailForm.errors.district) ? true : false}
                            error={(contactDetailForm.touched.district && contactDetailForm.errors.district) ? contactDetailForm.errors.district : ""}
                            defaultSelect="City"
                            menuItems={stateCityResp}
                            valueKey="id"
                            textKey="cityName"
                        /> */}
                    </div>
                    <div className="tw-col-span-12 md:tw-col-span-4">
                        <TextInputWithRegex
                            name="pincode"
                            labelText="PIN Code"
                            value={contactDetailForm.values.pincode}
                            onChange={contactDetailForm.handleChange}
                            onBlur={contactDetailForm.handleBlur}
                            invalid={(contactDetailForm.touched.pincode && contactDetailForm.errors.pincode) ? true : false}
                            error={(contactDetailForm.touched.pincode && contactDetailForm.errors.pincode) ? contactDetailForm.errors.pincode : ""}
                            maxLength={6}
                            allowedInputRegex="^[0-9]+$"
                            labelClass={contactDetailForm.values.countryId === '100' ? 'required' : ''}
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