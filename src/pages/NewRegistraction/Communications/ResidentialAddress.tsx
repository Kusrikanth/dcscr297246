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
} from "../../../Components/Common";

import StudentImgIcon from "../../../../../assets/imagesdps/directory/user-img.png";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";

//Helper

import { StepperFormContext } from "../helper";
//Action Generator
import { generateActionPayload } from "../../../utility/reduxutility";
import {
    getCountryStateAct, getStateCityAct,
    setCountryStateAct, setStateCityAct
} from "../../../store/masterdata/masterdataactions";

function getInitialState(initialState?: any) {
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
    // state: Yup.string().required("Select state."),
    state: Yup.string().test("countryStateCheck", "Select state.",
        (value: any, schema: any) => {
            const countryName = schema.parent.country;
            if (countryName === 'India' && !value) {
                return false;
            }
            return true;
        }),
    city: Yup.string().test("countryCityCheck", "Select city.",
        (value: any, schema: any) => {
            const countryName = schema.parent.country;
            if (countryName === 'India' && !value) {
                return false;
            }
            return true;
        }),
    areaId: Yup.string()
        .test("countryAreaCheck", "Area is required.",
            (value: any, schema: any) => {
                const countryName = schema.parent.country;
                if (countryName === 'India' && !value) {
                    return false;
                }
                return true;
            }),
    distanceFromSchool: Yup.string()
        .test("countryCityCheck", "Distance from school is required.",
            (value: any, schema: any) => {
                const countryName = schema.parent.country;
                if (countryName === 'India' && !value) {
                    return false;
                }
                return true;
            }),
    pinCode: Yup.string().test("countryPincodeCheck", "Pincode required.",
        (value: any, schema: any) => {
            const countryName = schema.parent.country;
            if (countryName === 'India' && !value) {
                return false;
            }
            return true;
        }).matches(/^[0-9]{6,6}$/, 'Pincode must be 6 digit number.'),
});

const initialValues = getInitialState();
export default function ResidentialAddress({ stepId, formId,
    branchAreasResp,
    updateResidentialAddress, triggerResidentialKey, storeMultiFormDataCallback, countriesResp, branchId }: any) {
    const { tabsData, currentMultiFormKeys } = useContext<any>(StepperFormContext);
    const [shareResidentialAddress, setShareResidentialAddress] = useState<any>(null);
    const [isCitySelectable, setIsCitySelectable] = useState(true);
    const dispatch = useAppDispatch();
    const { countryStateResp, stateCityResp, branchListResp } = useAppSelector(({ masterData, branch }) => ({
        countryStateResp: masterData.countryStateResp,
        stateCityResp: masterData.stateCityResp,
        branchListResp: branch.branchListResp,
    }), shallowEqual);

    const residentialForm = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values: any) => {
            const payload = { ...values };
            storeMultiFormDataCallback(formId, true, residentialForm.dirty, payload);
        }
    })


    useEffect(() => {
        if (Array.isArray(currentMultiFormKeys) && currentMultiFormKeys.includes(formId)) {
            residentialForm.handleSubmit();
        }
    }, [currentMultiFormKeys]);

    useEffect(() => {
        if (tabsData?.[stepId]) {
            const formData = getInitialState(tabsData[stepId]);
            const { country, state } = tabsData[stepId];
            if (country) {
                dispatch(getCountryStateAct(generateActionPayload("get_stateby_countryname", { countryName: country })));
            }
            if (state) {
                dispatch(getStateCityAct(generateActionPayload("get_cityby_statename", { stateName: state })));
            }
            residentialForm.resetForm({
                values: formData
            })
        }
    }, [tabsData, stepId]);

    useEffect(() => {
        if (triggerResidentialKey) {
            residentialForm.validateForm().then(formKeys => {
                if (Object.keys(formKeys).length === 0) {
                    updateResidentialAddress(residentialForm.values);
                } else {
                    residentialForm.setTouched(setNestedObjectValues<any>(formKeys, true));
                }
            })
        }
    }, [triggerResidentialKey]);


    function onChangeCountryHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { target } = event, { name, value } = target;
        if (name === "country") {
            if (value) {
                dispatch(getCountryStateAct(generateActionPayload("get_stateby_countryname", { countryName: value })));
            }
            dispatch(setCountryStateAct(undefined));
            dispatch(setStateCityAct(undefined));
            residentialForm.setValues((prevState: any) => ({
                ...prevState, state: "", city: "",
                pinCode: "", areaId: "", distanceFromSchool: "", [name]: value
            }));
        } else if (name === "state") {
            // const stateInfo = countryStateResp?.find((item: any) => item.id?.toString().toLowerCase() === value);
            if (value) {
                dispatch(getStateCityAct(generateActionPayload("get_cityby_statename", { stateName: value })));
            }
            dispatch(setStateCityAct(undefined));
            residentialForm.setValues((prevState: any) => ({
                ...prevState, city: "",
                pinCode: "", areaId: "", distanceFromSchool: "", [name]: value
            }));
        }
    }

    const selectedBranch = branchListResp?.data?.find(
        (item: any) => item.branchId === Number(branchId)
    );

    const branchShortName = selectedBranch?.shortName;
    const distanceOptions =
        branchShortName === "PC"
            ? [
                { text: "0-2 Km" },
                { text: "2-5 Km" },
                { text: "5-10 Km" },
                { text: "10-15 Km" },
            ]
            : [
                { text: "0-5 Km" },
                { text: "5-10 Km" },
                { text: "10-15 Km" },
                { text: "15-20 Km" },
                { text: "20-25 Km" },
            ];

    return (
        <form onSubmit={residentialForm.handleSubmit}>
            <AccordionHeader tag="h4" targetId={formId}>
                Residential Address
            </AccordionHeader>
            <AccordionBody accordionId={formId}>
                <div className="tw-grid tw-grid-cols-12 tw-gap-4">
                    <div className="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-4 2xl:tw-col-span-3">
                        <TextInput
                            name="houseNo"
                            labelText="House/Flat no"
                            labelClass="required"
                            value={residentialForm.values.houseNo}
                            onChange={residentialForm.handleChange}
                            onBlur={residentialForm.handleBlur}
                            invalid={(residentialForm.touched.houseNo && residentialForm.errors.houseNo) ? true : false}
                            error={(residentialForm.touched.houseNo && residentialForm.errors.houseNo) ? residentialForm.errors.houseNo : ""}
                        />
                    </div>
                    <div className="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-4 2xl:tw-col-span-3">
                        <TextInput
                            name="landmark"
                            labelText="Location / Landmark"
                            labelClass="required"
                            value={residentialForm.values.landmark}
                            onChange={residentialForm.handleChange}
                            onBlur={residentialForm.handleBlur}
                            invalid={(residentialForm.touched.landmark && residentialForm.errors.landmark) ? true : false}
                            error={(residentialForm.touched.landmark && residentialForm.errors.landmark) ? residentialForm.errors.landmark : ""}
                        />
                    </div>
                    <div className="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-4 2xl:tw-col-span-3">
                        <SelectInput
                            name="country"
                            labelText="Country"
                            labelClass="required"
                            // formgroupClassName="mb-4"
                            value={residentialForm.values.country}
                            onChange={onChangeCountryHndlr}
                            onBlur={residentialForm.handleBlur}
                            invalid={(residentialForm.touched.country && residentialForm.errors.country) ? true : false}
                            error={(residentialForm.touched.country && residentialForm.errors.country) ? residentialForm.errors.country : ""}
                            menuItems={countriesResp}
                            valueKey="countryName"
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
                    <div className="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-4 2xl:tw-col-span-3">
                        <SelectInput
                            name="state"
                            labelText="State"
                            labelClass={residentialForm.values.country === 'India' ? "required" : ""}
                            // formgroupClassName="mb-4"
                            value={residentialForm.values.state}
                            onChange={onChangeCountryHndlr}
                            onBlur={residentialForm.handleBlur}
                            invalid={(residentialForm.touched.state && residentialForm.errors.state) ? true : false}
                            error={(residentialForm.touched.state && residentialForm.errors.state) ? residentialForm.errors.state : ""}
                            menuItems={countryStateResp}
                            valueKey="stateName"
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
                    <div className="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-4 2xl:tw-col-span-3">
                        <SelectInput
                            name="city"
                            labelText="City"
                            labelClass={residentialForm.values.country === 'India' ? "required" : ""}
                            value={residentialForm.values.city}
                            onChange={residentialForm.handleChange}
                            onBlur={residentialForm.handleBlur}
                            invalid={(residentialForm.touched.city && residentialForm.errors.city) ? true : false}
                            error={(residentialForm.touched.city && residentialForm.errors.city) ? residentialForm.errors.city : ""}
                            menuItems={stateCityResp}
                            valueKey="cityName"
                            textKey="cityName"
                        />
                    </div>

                    <div className="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-4 2xl:tw-col-span-3">
                        <TextInputWithRegex
                            name="pinCode"
                            labelText="PIN Code"
                            labelClass={residentialForm.values.country === 'India' ? "required" : ""}
                            value={residentialForm.values.pinCode}
                            onChange={residentialForm.handleChange}
                            onBlur={residentialForm.handleBlur}
                            invalid={(residentialForm.touched.pinCode && residentialForm.errors.pinCode) ? true : false}
                            error={(residentialForm.touched.pinCode && residentialForm.errors.pinCode) ? residentialForm.errors.pinCode : ""}
                            allowedInputRegex="^[0-9]+$"
                            maxLength={10}
                        />
                    </div>
                    <div className="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-4 2xl:tw-col-span-3">
                        <SelectInput
                            labelText="Area"
                            labelClass={residentialForm.values.country === 'India' ? "required" : ""}
                            name='areaId'
                            valueKey='id'
                            textKey='areaName'
                            menuItems={branchAreasResp?.content}
                            value={residentialForm.values.areaId}
                            onChange={residentialForm.handleChange}
                            // formgroupClassName="pe-5"
                            // isDisabled={true}
                            // inputClassName={"border-0"}
                            invalid={(residentialForm.touched.areaId && residentialForm.errors.areaId) ? true : false}
                            error={(residentialForm.touched.areaId && residentialForm.errors.areaId) ? residentialForm.errors.areaId : ""}
                        />
                    </div>
                    <div className="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-4 2xl:tw-col-span-3">
                        <SelectInput
                            name='distanceFromSchool'
                            labelClass={residentialForm.values.country === 'India' ? "required" : ""}
                            valueKey='text'
                            textKey='text'
                            menuItems={distanceOptions}
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