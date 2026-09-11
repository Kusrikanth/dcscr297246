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
} from "../../../../../../../Components/Common";

import StudentImgIcon from "../../../../../assets/imagesdps/directory/user-img.png";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../../../../../hooks/storehook";

//Helper
import {
    studentUIDTypes, yesNoOptions, admissionTypes, genderOptions, bloodGroupOptions,
    nationalityOptions, trueFalseOptions, languageOptions,
    houseNameOptions, admissionCategory, motherToungeOptions,
    religionOptions
} from "../helper";
import { StepperFormContext } from "../../helper";
//Action Generator
import { generateActionPayload } from "../../../../../../../utility/reduxutility";
import {
    getCountryStateAct, getStateCityAct,
    setCountryStateAct, setStateCityAct
} from "../../../../../../../store/masterdata/masterdataactions";

// Ol state
// function getInitialState(initialState: any) {
//     return {
//         currentAddress: "Dummy address",
//         houseNo: initialState?.houseNo || "Current house",
//         landmark: initialState?.landmark || "Landmark",
//         country: initialState?.country || "1",
//         state: initialState?.state || "1",
//         city: initialState?.city || "1",
//         pinCode: initialState?.pinCode || "1"
//     }
// }

function getInitialState(initialState: any) {
    return {
        houseNo: initialState?.houseNo || "",
        landmark: initialState?.landmark || "",
        country: initialState?.country || "",
        state: initialState?.state || "",
        city: initialState?.city || "",
        pinCode: initialState?.pinCode || "",
        areaId: initialState?.areaId || "",
        distanceFromSchool: initialState?.distanceFromSchool || "",
    }
}

const validationSchema = Yup.object().shape({
    houseNo: Yup.string().required("House no required."),
    landmark: Yup.string().required('Landmark required.'),
    country: Yup.string().required("Select country."),
    state: Yup.string().required("Select state."),
    city: Yup.string().required("Select city."),
    pinCode: Yup.string().matches(/^[0-9]{6,6}$/, 'Pincode must be 6 digit number.').required("Pincode required."),
});
export default function ResidentialAddress({ formId, formDetails, refId, countriesResp }: any) {
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
        // validationSchema,
        onSubmit: (values: any) => {
            // storeMultiFormData("residentialAddress", true, values);
        }
    })

    // useEffect(() => {
    //     const { residentialAddress } = editStudentData || {},
    //         { formData } = residentialAddress || {};
    //     if (formData && !requestedResidentialAddress.current) {
    //         const { country, state } = formData;
    //         if (country) {
    //             dispatch(getCountryStateAct(generateActionPayload("get_country_state", { countryId: country })));
    //         }
    //         if (state) {
    //             dispatch(getStateCityAct(generateActionPayload("get_state_city", { stateId: state })));
    //         }
    //         setBasicDetailsState(getInitialState(formData));
    //     }
    // }, [editStudentData]);


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
        if (name === "country") {
            if (value) {
                dispatch(getCountryStateAct(generateActionPayload("get_country_state", { countryId: value })));
            }
            dispatch(setCountryStateAct(undefined));
            dispatch(setStateCityAct(undefined));
            residentialForm.setValues((prevState: any) => ({ ...prevState, state: "", city: "", [name]: value }));
        } else if (name === "state") {
            if (value) {
                dispatch(getStateCityAct(generateActionPayload("get_state_city", { stateId: value })));
            }
            dispatch(setStateCityAct(undefined));
            residentialForm.setValues((prevState: any) => ({ ...prevState, city: "", [name]: value }));
        }
    }

    return (
        <form onSubmit={residentialForm.handleSubmit}>
            <AccordionHeader tag="h4" targetId={formId}>
                Residential Address
            </AccordionHeader>
            <AccordionBody accordionId={formId}>
                <div className="row">
                    <div className="col-4">
                        <TextInput
                            name="houseNo"
                            labelText="House/Flat no"
                            value={residentialForm.values.houseNo}
                            onChange={residentialForm.handleChange}
                            onBlur={residentialForm.handleBlur}
                            invalid={(residentialForm.touched.houseNo && residentialForm.errors.houseNo) ? true : false}
                            error={(residentialForm.touched.houseNo && residentialForm.errors.houseNo) ? residentialForm.errors.houseNo : ""}
                        />
                    </div>
                    <div className="col-4">
                        <TextInput
                            name="landmark"
                            labelText="Location / Landmark"
                            value={residentialForm.values.landmark}
                            onChange={residentialForm.handleChange}
                            onBlur={residentialForm.handleBlur}
                            invalid={(residentialForm.touched.landmark && residentialForm.errors.landmark) ? true : false}
                            error={(residentialForm.touched.landmark && residentialForm.errors.landmark) ? residentialForm.errors.landmark : ""}
                        />
                    </div>
                    <div className="col-4">
                        <SelectInput
                            name="country"
                            labelText="Country"
                            // formgroupClassName="mb-4"
                            value={residentialForm.values.country}
                            onChange={onChangeCountryHndlr}
                            onBlur={residentialForm.handleBlur}
                            invalid={(residentialForm.touched.country && residentialForm.errors.country) ? true : false}
                            error={(residentialForm.touched.country && residentialForm.errors.country) ? residentialForm.errors.country : ""}
                            menuItems={countriesResp}
                            valueKey="id"
                            textKey="countryName"
                        />
                        {/* <TextInput
                            name="country"
                            labelText="Country"
                            value={residentialForm.values.country}
                            onChange={onChangeCountryHndlr}
                            invalid={(residentialForm.touched.country && residentialForm.errors.country) ? true : false}
                            error={(residentialForm.touched.country && residentialForm.errors.country) ? residentialForm.errors.country : ""}
                        /> */}
                    </div>
                    <div className="col-4">
                        <SelectInput
                            name="state"
                            labelText="State"
                            // formgroupClassName="mb-4"
                            value={residentialForm.values.state}
                            onChange={onChangeCountryHndlr}
                            onBlur={residentialForm.handleBlur}
                            invalid={(residentialForm.touched.state && residentialForm.errors.state) ? true : false}
                            error={(residentialForm.touched.state && residentialForm.errors.state) ? residentialForm.errors.state : ""}
                            menuItems={countryStateResp}
                            valueKey="id"
                            textKey="stateName"
                        />
                        {/* <TextInput
                            name="state"
                            labelText="State"
                            value={residentialForm.values.state}
                            onChange={residentialForm.handleChange}
                            invalid={(residentialForm.touched.state && residentialForm.errors.state) ? true : false}
                            error={(residentialForm.touched.state && residentialForm.errors.state) ? residentialForm.errors.state : ""}
                        /> */}
                    </div>
                    <div className="col-4">
                        <SelectInput
                            name="city"
                            labelText="City"
                            value={residentialForm.values.city}
                            onChange={residentialForm.handleChange}
                            onBlur={residentialForm.handleBlur}
                            invalid={(residentialForm.touched.city && residentialForm.errors.city) ? true : false}
                            error={(residentialForm.touched.city && residentialForm.errors.city) ? residentialForm.errors.city : ""}
                            menuItems={stateCityResp}
                            valueKey="id"
                            textKey="cityName"
                        />
                    </div>

                    <div className="col-4">
                        <TextInputWithRegex
                            name="pinCode"
                            labelText="PIN Code"
                            value={residentialForm.values.pinCode}
                            onChange={residentialForm.handleChange}
                            onBlur={residentialForm.handleBlur}
                            invalid={(residentialForm.touched.pinCode && residentialForm.errors.pinCode) ? true : false}
                            error={(residentialForm.touched.pinCode && residentialForm.errors.pinCode) ? residentialForm.errors.pinCode : ""}
                            allowedInputRegex="^[0-9]+$"
                            maxLength={10}
                        />
                    </div>
                    <div className="col-4">
                        <SelectInput
                            name='areaId'
                            valueKey='text'
                            textKey='text'
                            menuItems={[{ text: 'Area' }]}
                            value={residentialForm.values.areaId}
                            onChange={residentialForm.handleChange}
                            // formgroupClassName="pe-5"
                            // isDisabled={true}
                            // inputClassName={"border-0"}
                            labelText="Area"
                            invalid={(residentialForm.touched.areaId && residentialForm.errors.areaId) ? true : false}
                            error={(residentialForm.touched.areaId && residentialForm.errors.areaId) ? residentialForm.errors.areaId : ""}
                        />
                    </div>
                    <div className="col-4">
                        <SelectInput
                            name='distanceFromSchool'
                            valueKey='text'
                            textKey='text'
                            menuItems={[{ text: '10-20km' }]}
                            value={residentialForm.values.distanceFromSchool}
                            onChange={residentialForm.handleChange}
                            // formgroupClassName="pe-5"
                            // isDisabled={true}
                            // inputClassName={"border-0"}
                            labelText="Distance from School"
                            invalid={(residentialForm.touched.distanceFromSchool && residentialForm.errors.distanceFromSchool) ? true : false}
                            error={(residentialForm.touched.distanceFromSchool && residentialForm.errors.distanceFromSchool) ? residentialForm.errors.distanceFromSchool : ""}
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