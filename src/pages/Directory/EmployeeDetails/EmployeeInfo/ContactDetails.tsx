import { useFormik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { shallowEqual, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { SelectInput, TextInput, TextInputWithRegex } from "../../../../Components/Common";
import { useAppSelector } from "../../../../hooks/storehook";
import { getEmployeeByIdAct } from "../../../../store/directory/employeemanagement/employeemanagementactions";
import { updateStudentAct } from "../../../../store/directory/studentmanagement/studentmanagementactions";
import { getCasteListAct, getCountriesAct, getCountryStateAct, getMotherToungeAct, getNationalityAct, getReligionAct, getStateCityAct } from "../../../../store/masterdata/masterdataactions";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { IPropsTypes, IUpdateEmployeeRepRef } from "./EmployeeInfoTypes";
import * as Yup from 'yup';
import { details, formSectionSaveKey } from "./helper";
import { default as EditSvg } from "../../../../assets/imagesdps/directory/EditSvgIcon.svg?react";
import { AccordionBody, AccordionHeader } from "reactstrap";
import Button from "../../../../Components/Common/Button";

export default function ContactDetails({ instituteId, branchId, employeeId, divId, canCreateAndUpdate }: any) {

    const dispatch = useDispatch();

    const initialValues = (data?: any) => {

        return {
            contactId: data?.id || "",
            addressLine: data?.addressLine || "",
            area: data?.area || "",
            countryId: data?.countryId || "",
            stateId: data?.stateId || "",
            district: data?.district || "",
            cityId: data?.cityId || "",
            pincode: data?.pincode || "",
        }
    }

    const [initialData, setInitialData] = useState(initialValues());
    const [edit, setEdit] = useState(false);

    const { getEmployeeByIdResp, updateStudentResp, affectedSection, countryStateResp, stateCityResp, countriesResp, nationalityResp, casteListResp, religionResp, motherToungeResp } = useAppSelector(
        ({ directoryEmployee, directoryStudent, masterData }) => ({
            getEmployeeByIdResp: directoryEmployee.getEmployeeByIdResp,
            updateStudentResp: directoryStudent.updateStudentResp,
            affectedSection: directoryStudent.affectedSection,
            nationalityResp: masterData.nationalityResp,
            casteListResp: masterData.casteListResp,
            religionResp: masterData.religionResp,
            motherToungeResp: masterData.motherToungeResp,
            countryStateResp: masterData.countryStateResp,
            stateCityResp: masterData.stateCityResp,
            countriesResp: masterData.countriesResp,
        }),
        shallowEqual
    );
    const EmployeeEducationRef = useRef<IUpdateEmployeeRepRef>({
        prevUpdateEmployeeRep: updateStudentResp
    });
    const getEmployeeDetailsAPI = () => {
        dispatch(getEmployeeByIdAct(generateActionPayload("get_employee_byid", { employeeId: employeeId })));
    }
    const UpdateHandler = () => {
        getEmployeeDetailsAPI();
        setEdit(false);
    }
    useEffect(() => {
        const { prevUpdateEmployeeRep } =
            EmployeeEducationRef.current;

        if (updateStudentResp &&
            prevUpdateEmployeeRep !== updateStudentResp) {
            if (affectedSection === "Employee Contact Details") {
                toast.success("Employee Contact Details Updated successfully.");
                UpdateHandler();
            }
        }
        EmployeeEducationRef.current.prevUpdateEmployeeRep = updateStudentResp;
    }, [affectedSection, updateStudentResp]);

    const validationSchema = Yup.object().shape({
        addressLine: Yup.string().required("Address Line is required."),
        area: Yup.string().required("Area is required."),
        countryId: Yup.string().required("Country is required."),
        stateId: Yup.string().required("State is required."),
        district: Yup.string().required("District is required."),
        cityId: Yup.string().required("City is required."),
        pincode: Yup.number().typeError('Pincode must be a number').required("Pin Code is required.").test('len', 'Pin code should have at least 6 digits', (val: any) => val.toString().length === 6),
    });

    const ContactDetailsForm = useFormik({
        enableReinitialize: true,
        initialValues: initialData,
        validationSchema,
        onSubmit: (values) => {
            const formData = new FormData();
            const data = details(getEmployeeByIdResp, values, "Employee Contact Details", { branchId: branchId, instituteId: instituteId }, formSectionSaveKey.contactDetails);
            formData.append("employeeRequest", JSON.stringify(data));
            dispatch(updateStudentAct(generateActionPayload('add_employee', undefined, formData, {
                affectedSection: "Employee Contact Details"
            })));
        },
    });

    const EditHandler = (event: any) => {
        setEdit(true);
    }

    const CancelHandler = () => {
        ContactDetailsForm.setValues(initialValues(getEmployeeByIdResp.employeeContactDetails)).then(() => {
            ContactDetailsForm.setErrors({});
        });
        setEdit(false);
    }

    const changeHandler = (e: any) => {
        ContactDetailsForm.handleChange(e);
        const { name, value } = e.target;
        if (name === "countryId") {
            dispatch(getCountryStateAct(generateActionPayload('get_country_state', { countryId: value })));
            ContactDetailsForm.setFieldValue('stateId', "")
            ContactDetailsForm.setFieldValue('cityId', "")
        }
        if (name === "stateId") {
            dispatch(getStateCityAct(generateActionPayload('get_state_city', { stateId: value })))
            ContactDetailsForm.setFieldValue('cityId', "")
        }
    }

    useEffect(() => {
        if (getEmployeeByIdResp !== undefined) {
            setInitialData(initialValues(getEmployeeByIdResp?.employeeContactDetails
            ));
            dispatch(getCountryStateAct(generateActionPayload('get_country_state', { countryId: getEmployeeByIdResp?.employeeContactDetails?.countryId })))
            dispatch(getStateCityAct(generateActionPayload('get_state_city', { stateId: getEmployeeByIdResp?.employeeContactDetails?.stateId })))
        }
    }, [getEmployeeByIdResp]);

    useEffect(() => {
        dispatch(getCountriesAct(generateActionPayload("get_countries")));

    }, [])

    const { data: CityData } = stateCityResp || {};


    return (
        <div>
            <AccordionHeader tag="h4" targetId="contact-details">
                Contact Details
            </AccordionHeader>
            <AccordionBody accordionId="contact-details">
                <div id={divId}>
                    <div className="tw-p-0">
                        <div className="tw-flex tw-flex-wrap tw-mb-2 tw--mx-2">
                            <div className="tw-w-full lg:tw-w-1/2 tw-px-2">
                                <TextInput
                                    name="addressLine"
                                    labelText="Address Line"
                                    value={ContactDetailsForm.values.addressLine}
                                    onChange={ContactDetailsForm.handleChange}
                                    onBlur={ContactDetailsForm.handleBlur}
                                    isReadOnly={!edit}
                                    inputClassName={
                                        "!tw-bg-transparent " +
                                        `${!edit ? "!tw-border-0 !tw-rounded-none" : ""}`
                                    }
                                    formgroupClassName="tw-mb-4 tw-flex tw-items-center input-field"
                                    labelClass="tw-font-semibold tw-text-sm tw-mb-0"
                                    invalid={
                                        ContactDetailsForm.touched.addressLine &&
                                            ContactDetailsForm.errors.addressLine
                                            ? true
                                            : false
                                    }
                                    error={
                                        ContactDetailsForm.touched.addressLine &&
                                            ContactDetailsForm.errors.addressLine
                                            ? ContactDetailsForm.errors.addressLine
                                            : ""
                                    }
                                />
                            </div>
                            <div className="tw-w-full lg:tw-w-1/2 tw-px-2">
                                <TextInput
                                    name="area"
                                    labelText="Area"
                                    value={ContactDetailsForm.values.area}
                                    onChange={ContactDetailsForm.handleChange}
                                    onBlur={ContactDetailsForm.handleBlur}
                                    isReadOnly={!edit}
                                    inputClassName={
                                        "!tw-bg-transparent " +
                                        `${!edit ? "!tw-border-0 !tw-rounded-none" : ""}`
                                    }
                                    formgroupClassName="tw-mb-4 tw-flex tw-items-center input-field"
                                    labelClass="tw-font-semibold tw-text-sm tw-mb-0"
                                    invalid={
                                        ContactDetailsForm.touched.area &&
                                            ContactDetailsForm.errors.area
                                            ? true
                                            : false
                                    }
                                    error={
                                        ContactDetailsForm.touched.area &&
                                            ContactDetailsForm.errors.area
                                            ? ContactDetailsForm.errors.area
                                            : ""
                                    }
                                />
                            </div>

                            <div className="tw-w-full lg:tw-w-1/2 tw-px-2">
                                <SelectInput
                                    name="countryId"
                                    labelText="Country"
                                    value={ContactDetailsForm.values.countryId}
                                    onChange={changeHandler}
                                    onBlur={ContactDetailsForm.handleBlur}
                                    valueKey="id"
                                    textKey="countryName"
                                    menuItems={countriesResp || []}
                                    isReadOnly={!edit}
                                    isDisabled={!edit}
                                    inputClassName={
                                        "!tw-bg-transparent " +
                                        `${!edit ? "!tw-border-0 !tw-rounded-none bg-img-none" : ""}`
                                    }
                                    formgroupClassName="tw-mb-4 tw-flex tw-items-center input-field"
                                    labelClass="tw-font-semibold tw-text-sm tw-mb-0"
                                    invalid={
                                        ContactDetailsForm.touched.countryId &&
                                            ContactDetailsForm.errors.countryId
                                            ? true
                                            : false
                                    }
                                    error={
                                        ContactDetailsForm.touched.countryId &&
                                            ContactDetailsForm.errors.countryId
                                            ? ContactDetailsForm.errors.countryId
                                            : ""
                                    }
                                />
                            </div>
                            <div className="tw-w-full lg:tw-w-1/2 tw-px-2">
                                <SelectInput
                                    name="stateId"
                                    labelText="State"
                                    value={ContactDetailsForm.values.stateId}
                                    onChange={changeHandler}
                                    onBlur={ContactDetailsForm.handleBlur}
                                    valueKey="id"
                                    textKey="stateName"
                                    menuItems={countryStateResp || []}
                                    isReadOnly={!edit}
                                    isDisabled={!edit}
                                    inputClassName={
                                        "!tw-bg-transparent " +
                                        `${!edit ? "!tw-border-0 !tw-rounded-none bg-img-none" : ""}`
                                    }
                                    formgroupClassName="tw-mb-4 tw-flex tw-items-center input-field"
                                    labelClass="tw-font-semibold tw-text-sm tw-mb-0"
                                    invalid={
                                        ContactDetailsForm.touched.stateId &&
                                            ContactDetailsForm.errors.stateId
                                            ? true
                                            : false
                                    }
                                    error={
                                        ContactDetailsForm.touched.stateId &&
                                            ContactDetailsForm.errors.stateId
                                            ? ContactDetailsForm.errors.stateId
                                            : ""
                                    }
                                />
                            </div>

                            <div className="tw-w-full lg:tw-w-1/2 tw-px-2">
                                <TextInput
                                    name="district"
                                    labelText="District"
                                    value={ContactDetailsForm.values.district}
                                    onChange={ContactDetailsForm.handleChange}
                                    onBlur={ContactDetailsForm.handleBlur}
                                    isDisabled={!edit}
                                    inputClassName={
                                        "!tw-bg-transparent " +
                                        `${!edit ? "!tw-border-0 !tw-rounded-none" : ""}`
                                    }
                                    formgroupClassName="tw-mb-4 tw-flex tw-items-center input-field"
                                    labelClass="tw-font-semibold tw-text-sm tw-mb-0"
                                    invalid={
                                        ContactDetailsForm.touched.district &&
                                            ContactDetailsForm.errors.district
                                            ? true
                                            : false
                                    }
                                    error={
                                        ContactDetailsForm.touched.district &&
                                            ContactDetailsForm.errors.district
                                            ? ContactDetailsForm.errors.district
                                            : ""
                                    }
                                />
                            </div>

                            <div className="tw-w-full lg:tw-w-1/2 tw-px-2">
                                <SelectInput
                                    name="cityId"
                                    labelText="City"
                                    value={ContactDetailsForm.values.cityId}
                                    onChange={ContactDetailsForm.handleChange}
                                    onBlur={ContactDetailsForm.handleBlur}
                                    valueKey="id"
                                    textKey="cityName"
                                    menuItems={stateCityResp || []}
                                    isReadOnly={!edit}
                                    isDisabled={!edit}
                                    inputClassName={
                                        "!tw-bg-transparent " +
                                        `${!edit ? "!tw-border-0 !tw-rounded-none bg-img-none" : ""}`
                                    }
                                    formgroupClassName="tw-mb-4 tw-flex tw-items-center input-field"
                                    labelClass="tw-font-semibold tw-text-sm tw-mb-0"
                                    invalid={
                                        ContactDetailsForm.touched.cityId &&
                                            ContactDetailsForm.errors.cityId
                                            ? true
                                            : false
                                    }
                                    error={
                                        ContactDetailsForm.touched.cityId &&
                                            ContactDetailsForm.errors.cityId
                                            ? ContactDetailsForm.errors.cityId
                                            : ""
                                    }
                                />
                            </div>

                            <div className="tw-w-full lg:tw-w-1/2 tw-px-2">
                                <TextInputWithRegex
                                    name="pincode"
                                    labelText="PIN Code"
                                    value={ContactDetailsForm.values.pincode}
                                    onChange={ContactDetailsForm.handleChange}
                                    onBlur={ContactDetailsForm.handleBlur}
                                    isReadOnly={!edit}
                                    isDisabled={!edit}
                                    inputClassName={
                                        "!tw-bg-transparent " +
                                        `${!edit ? "!tw-border-0 !tw-rounded-none" : ""}`
                                    }
                                    formgroupClassName="tw-mb-4 tw-flex tw-items-center input-field"
                                    labelClass="tw-font-semibold tw-text-sm tw-mb-0"
                                    allowedInputRegex="^[0-9]+$"
                                    maxLength={6}
                                    invalid={
                                        ContactDetailsForm.touched.pincode &&
                                            ContactDetailsForm.errors.pincode
                                            ? true
                                            : false
                                    }
                                    error={
                                        ContactDetailsForm.touched.pincode &&
                                            ContactDetailsForm.errors.pincode
                                            ? ContactDetailsForm.errors.pincode
                                            : ""
                                    }
                                />
                            </div>
                        </div>

                        {canCreateAndUpdate && <>{!edit && (
                            <div className="tw-flex tw-justify-end">
                                <Button
                                    variant="hoverInfo"
                                    onClick={EditHandler}
                                >
                                    <i className="ri-pencil-line tw-mr-2 tw-text-base"></i>
                                    Edit
                                </Button>
                            </div>
                        )}

                        {edit && (
                            <div className="tw-flex tw-justify-end tw-gap-3 tw-pb-3">
                                <Button
                                variant="secondary"
                                    onClick={CancelHandler}
                                >
                                    Cancel
                                </Button>
                                <Button
                                variant="primary"
                                    onClick={(e: any) => ContactDetailsForm.handleSubmit(e)}
                                >
                                    Update
                                </Button>
                            </div>
                        )}</>}
                    </div>
                </div>
            </AccordionBody>
        </div>
    )
}