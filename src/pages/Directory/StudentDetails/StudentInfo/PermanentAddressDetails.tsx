import { useFormik } from 'formik';
import React, { useEffect, useRef, useState } from 'react'
import { shallowEqual, useDispatch } from 'react-redux';
import { RadioInputContainer, SelectInput, TextInput, TextInputWithRegex } from '../../../../Components/Common'
import { useAppSelector } from '../../../../hooks/storehook';
import { getStudentByIdAct, updateStudentAct } from '../../../../store/directory/studentmanagement/studentmanagementactions';
import { generateActionPayload } from '../../../../utility/reduxutility';
import * as Yup from 'yup';
import { details, formSectionSaveKey } from './helper';
import { IUpdateStudentRepRef } from './StudentInfoTypes';
import { toast } from 'react-toastify';
import { getCountriesAct, getCountryStateAct, getStateCityAct } from '../../../../store/masterdata/masterdataactions';
import { HugeiconsIcon } from '@hugeicons/react';
import { PencilEdit02Icon } from "@hugeicons-pro/core-stroke-standard";
import Button from '../../../../Components/Common/Button';

interface ICommunicationDetails {
    studentId: number;
    academicYearId: string;
    branchId: number;
    divId: string;
    instituteId: number;
    canCreateAndUpdate: boolean;
}

const ParmanentAddressDetails = (props: ICommunicationDetails) => {
    const dispatch = useDispatch();
    // const [classList, setClassList] = useState([]);
    const initialValues = (data?: any) => {
        return {
            isPermanentAddress: data?.isPermanentAddress ? "true" : "false",
            permanentHouseNo: data?.permanentHouseNo || "",
            permanentLandmark: data?.permanentLandmark || "",
            permanentCountryId: data?.permanentCountryId || "",
            permanentStateId: data?.permanentStateId || "",
            permanentCityId: data?.permanentCityId || "",
            permanentPincode: data?.permanentPincode || "",
        }
    }

    const [initialData, setInitialData] = useState(initialValues());

    const [edit, setEdit] = useState(false);

    const validationSchema = Yup.object().shape({
        permanentHouseNo: Yup.string().when('isPermanentAddress', {
            is: (val: any) => val === "false",
            then: Yup.string().required("House/Flat No. is required."),
            otherwise: Yup.string().notRequired(),
        }),
        permanentLandmark: Yup.string().when('isPermanentAddress', {
            is: (val: any) => val === "false",
            then: Yup.string().required("Landmark is required."),
            otherwise: Yup.string().notRequired(),
        }),
        permanentCountryId: Yup.string().when('isPermanentAddress', {
            is: (val: any) => val === "false",
            then: Yup.string().required("Country is required."),
            otherwise: Yup.string().notRequired(),
        }),
        permanentStateId: Yup.string().when('isPermanentAddress', {
            is: (val: any) => val === "false",
            then: Yup.string().required("State is required."),
            otherwise: Yup.string().notRequired(),
        }),
        permanentCityId: Yup.string().when([], {
            is: (val: any) => val === "false",
            then: Yup.number().required("City is required."),
            otherwise: Yup.string().notRequired(),
        }),
        permanentPincode: Yup.number().when('isPermanentAddress', {
            is: (val: any) => val === "false",
            then: Yup.number().typeError('Pin Code must be a number').required("Pin Code is required.").test('len', 'Pin code should have at least 6 digits', (val: any) => val && val.toString().length === 6),
            otherwise: Yup.number().notRequired(),
        })
        // lastClassPerc: Yup.string().required("Percentage is required."),
        // reasonForAdmission: Yup.string().required("Reason for Seeking Admission is required."),
    });

    const { getStudentByIdResp, updateStudentResp, affectedSection, countriesResp, countryStateResp, stateCityResp } = useAppSelector(
        ({ directoryStudent, branchAcademics, masterData }) => ({
            getStudentByIdResp: directoryStudent.getStudentByIdResp,
            updateStudentResp: directoryStudent.updateStudentResp,
            affectedSection: directoryStudent.affectedSection,
            countriesResp: masterData.countriesResp,
            countryStateResp: masterData.countryStateResp,
            stateCityResp: masterData.stateCityResp,
        }),
        shallowEqual
    );
    const getStudentDetailsAPI = () => {
        // const params={academicYearId:props.academicYearId}
        dispatch(getStudentByIdAct(generateActionPayload("get_students_by_id", { studentId: props.studentId }, { academicYearId: props.academicYearId })));
    }
    const UpdateHandler = () => {
        getStudentDetailsAPI();
        setEdit(false);
    }
    const CommunicationDetailsRef = useRef<IUpdateStudentRepRef>({
        preUpdateStudentDetails: updateStudentResp
    });

    useEffect(() => {
        const { preUpdateStudentDetails } =
            CommunicationDetailsRef.current;

        if (updateStudentResp &&
            preUpdateStudentDetails !== updateStudentResp) {
            if (affectedSection === "Permanent Address Details") {
                toast.success("Permanent Address Details Updated successfully.");
                UpdateHandler();
            }
        }
        CommunicationDetailsRef.current.preUpdateStudentDetails = updateStudentResp;
    }, [affectedSection, updateStudentResp]);



    const CommunicationDetailsForm = useFormik({
        enableReinitialize: true,
        initialValues: initialData,
        validationSchema,
        onSubmit: (values) => {

            const formData = new FormData();
            const data = details(getStudentByIdResp, values, { branchId: props.branchId, instituteId: props.instituteId }, formSectionSaveKey.permanentAddressDetails);

            formData.append("studentRequest", JSON.stringify(data));
            dispatch(updateStudentAct(generateActionPayload('update_students_by_id', undefined, formData, {
                affectedSection: "Permanent Address Details"
            })));
        },
    });

    const EditHandler = (event: any) => {
        setEdit(true);
    }

    const CancelHandler = () => {
        CommunicationDetailsForm.setValues(initialValues(getStudentByIdResp.communicationDetails)).then(() => {
            CommunicationDetailsForm.setErrors({});
        });
        setEdit(false);
    }

    const ChangeHandler = (event: any) => {
        CommunicationDetailsForm.handleChange(event);
        const { name, value } = event.target;
        if (name === "permanentCountryId") {
            dispatch(getCountryStateAct(generateActionPayload('get_stateby_countryname', { countryName: value })))
            CommunicationDetailsForm.setFieldValue('permanentStateId', "");
            CommunicationDetailsForm.setFieldValue('permanentCityId', "");
        }
        else if (name === "permanentStateId") {
            dispatch(getStateCityAct(generateActionPayload('get_cityby_statename', { stateName: value })))
            CommunicationDetailsForm.setFieldValue('permanentCityId', "");
        }
    }

    const toggleHandler = (event: any) => {
        CommunicationDetailsForm.handleChange(event);
        // permanentHouseNo: data?.permanentHouseNo || "",
        //     permanentLandmark: data?.permanentLandmark || "",
        //     permanentCountryId: data?.permanentCountryId || "",
        //     permanentStateId: data?.permanentStateId || "",
        //     permanentCityId: data?.permanentCityId || "",
        //     permanentPincode: data?.permanentPincode || "",
        if (event.target.value === "true") {
            let data = getStudentByIdResp.communicationDetails;
            CommunicationDetailsForm.setValues(prev => ({ isPermanentAddress: event.target.value, permanentHouseNo: data.currentHouseNo, permanentLandmark: data.currentLandmark, permanentCountryId: data?.currentCountryId, permanentStateId: data?.currentStateId, permanentCityId: data.currentCityId, permanentPincode: data.currentPincode }))
        }
    }

    useEffect(() => {
        dispatch(getCountriesAct(generateActionPayload("get_countries")));
    }, [])
    useEffect(() => {
        if (getStudentByIdResp !== undefined) {
            setInitialData(initialValues(getStudentByIdResp.communicationDetails));
            if (getStudentByIdResp.communicationDetails?.currentCountryId) {
                dispatch(getCountryStateAct(generateActionPayload('get_stateby_countryname', { countryName: getStudentByIdResp.communicationDetails?.currentCountryId })));
            }
            if (getStudentByIdResp.communicationDetails?.currentStateId) {
                dispatch(getStateCityAct(generateActionPayload('get_cityby_statename', { stateName: getStudentByIdResp.communicationDetails?.currentStateId })))
            }
        }
    }, [getStudentByIdResp]);

    return (
        <div id={props.divId} className="tw-bg-white tw-rounded-lg tw-shadow tw-mb-4">

            {/* Header */}
            <div className="tw-flex tw-items-center tw-border-b tw-px-6 tw-py-4">
                <h4 className="tw-text-lg tw-font-semibold tw-text-gray-800">
                    Permanent Address Details
                </h4>

                {props.canCreateAndUpdate && !edit && (
                    <div
                        className="tw-ml-auto tw-flex tw-items-center tw-cursor-pointer"
                        onClick={EditHandler}
                    >
                        <HugeiconsIcon
                            icon={PencilEdit02Icon}
                            size={18}
                            className="tw-text-gray-400"
                        />
                    </div>
                )}
            </div>

            {/* Body */}
            <div className="tw-p-6">

                {/* Grid */}
                <div className="tw-grid tw-grid-cols-1 sm:tw-grid-cols-2 2xl:tw-grid-cols-3 tw-gap-6">

                    {/* Same as Correspondence */}
                    <div>
                        {edit ? (
                            <RadioInputContainer
                                name="isPermanentAddress"
                                labelText="Is Permanent Address same as Correspondence Address?"
                                inputContainerClassName="tw-mt-2"
                                radioOptions={[
                                    { id: "true", name: "Yes" },
                                    { id: "false", name: "No" }
                                ]}
                                value={CommunicationDetailsForm.values.isPermanentAddress}
                                onChange={toggleHandler}
                                isDisabled={!edit}
                                labelClassName="tw-text-gray-500"
                            />
                        ) : (
                            <TextInput
                                name="isPermanentAddress"
                                labelText="Is Permanent Address same as Correspondence Address?"
                                value={
                                    CommunicationDetailsForm.values.isPermanentAddress === "true"
                                        ? "Yes"
                                        : "No"
                                }
                                isReadOnly
                                isDisabled
                                inputClassName="tw-bg-transparent tw-border-0 tw-border-b tw-rounded-none"
                                labelClass="tw-text-gray-500"
                            />
                        )}
                    </div>

                    {/* House No */}
                    <TextInput
                        name="permanentHouseNo"
                        labelText="H.No / Flat No"
                        value={CommunicationDetailsForm.values.permanentHouseNo}
                        onChange={CommunicationDetailsForm.handleChange}
                        onBlur={CommunicationDetailsForm.handleBlur}
                        isReadOnly={!edit}
                        isDisabled={CommunicationDetailsForm.values.isPermanentAddress === "true"}
                        inputClassName={`${!edit
                                ? "tw-bg-transparent tw-border-0 tw-border-b tw-rounded-none"
                                : CommunicationDetailsForm.values.isPermanentAddress === "true"
                                    ? "tw-bg-gray-100"
                                    : "tw-bg-transparent"
                            }`}
                        invalid={Boolean(
                            CommunicationDetailsForm.touched.permanentHouseNo &&
                            CommunicationDetailsForm.errors.permanentHouseNo
                        )}
                        error={
                            CommunicationDetailsForm.touched.permanentHouseNo &&
                            CommunicationDetailsForm.errors.permanentHouseNo
                        }
                        labelClass="tw-text-gray-500"
                    />

                    {/* Landmark */}
                    <TextInput
                        name="permanentLandmark"
                        labelText="Location / Landmark"
                        value={CommunicationDetailsForm.values.permanentLandmark}
                        onChange={CommunicationDetailsForm.handleChange}
                        onBlur={CommunicationDetailsForm.handleBlur}
                        isReadOnly={!edit}
                        inputClassName={`${!edit
                                ? "tw-bg-transparent tw-border-0 tw-border-b tw-rounded-none"
                                : CommunicationDetailsForm.values.isPermanentAddress === "true"
                                    ? "tw-bg-gray-100"
                                    : "tw-bg-transparent"
                            }`}
                        invalid={Boolean(
                            CommunicationDetailsForm.touched.permanentLandmark &&
                            CommunicationDetailsForm.errors.permanentLandmark
                        )}
                        error={
                            CommunicationDetailsForm.touched.permanentLandmark &&
                            CommunicationDetailsForm.errors.permanentLandmark
                        }
                        labelClass="tw-text-gray-500"
                    />

                    {/* Country */}
                    <SelectInput
                        name="permanentCountryId"
                        labelText="Country"
                        value={CommunicationDetailsForm.values.permanentCountryId}
                        onChange={ChangeHandler}
                        onBlur={CommunicationDetailsForm.handleBlur}
                        valueKey="countryName"
                        textKey="countryName"
                        menuItems={countriesResp || []}
                        isReadOnly={!edit}
                        isDisabled={
                            CommunicationDetailsForm.values.isPermanentAddress === "true" || !edit
                        }
                        inputClassName={`${!edit
                                ? "tw-bg-transparent tw-border-0 tw-border-b tw-rounded-none tw-bg-none"
                                : CommunicationDetailsForm.values.isPermanentAddress === "true"
                                    ? "tw-bg-gray-100"
                                    : "tw-bg-transparent"
                            }`}
                        invalid={Boolean(
                            CommunicationDetailsForm.touched.permanentCountryId &&
                            CommunicationDetailsForm.errors.permanentCountryId
                        )}
                        error={
                            CommunicationDetailsForm.touched.permanentCountryId &&
                            CommunicationDetailsForm.errors.permanentCountryId
                        }
                        labelClass="tw-text-gray-500"
                    />

                    {/* State */}
                    <SelectInput
                        name="permanentStateId"
                        labelText="State"
                        value={CommunicationDetailsForm.values.permanentStateId}
                        onChange={ChangeHandler}
                        onBlur={CommunicationDetailsForm.handleBlur}
                        valueKey="stateName"
                        textKey="stateName"
                        menuItems={countryStateResp || []}
                        isReadOnly={!edit}
                        isDisabled={
                            CommunicationDetailsForm.values.isPermanentAddress === "true" || !edit
                        }
                        inputClassName={`${!edit
                                ? "tw-bg-transparent tw-border-0 tw-border-b tw-rounded-none tw-bg-none"
                                : CommunicationDetailsForm.values.isPermanentAddress === "true"
                                    ? "tw-bg-gray-100"
                                    : "tw-bg-transparent"
                            }`}
                        invalid={Boolean(
                            CommunicationDetailsForm.touched.permanentStateId &&
                            CommunicationDetailsForm.errors.permanentStateId
                        )}
                        error={
                            CommunicationDetailsForm.touched.permanentStateId &&
                            CommunicationDetailsForm.errors.permanentStateId
                        }
                        labelClass="tw-text-gray-500"
                    />

                    {/* City */}
                    <SelectInput
                        name="permanentCityId"
                        labelText="City"
                        value={CommunicationDetailsForm.values.permanentCityId}
                        onChange={ChangeHandler}
                        onBlur={CommunicationDetailsForm.handleBlur}
                        valueKey="cityName"
                        textKey="cityName"
                        menuItems={stateCityResp || []}
                        isReadOnly={!edit}
                        isDisabled={
                            CommunicationDetailsForm.values.isPermanentAddress === "true" || !edit
                        }
                        inputClassName={`${!edit
                                ? "tw-bg-transparent tw-border-0 tw-border-b tw-rounded-none tw-bg-none"
                                : CommunicationDetailsForm.values.isPermanentAddress === "true"
                                    ? "tw-bg-gray-100"
                                    : "tw-bg-transparent"
                            }`}
                        invalid={Boolean(
                            CommunicationDetailsForm.touched.permanentCityId &&
                            CommunicationDetailsForm.errors.permanentCityId
                        )}
                        error={
                            CommunicationDetailsForm.touched.permanentCityId &&
                            CommunicationDetailsForm.errors.permanentCityId
                        }
                        labelClass="tw-text-gray-500"
                    />

                    {/* Pincode */}
                    <TextInputWithRegex
                        name="permanentPincode"
                        labelText="PIN Code"
                        value={CommunicationDetailsForm.values.permanentPincode}
                        onChange={CommunicationDetailsForm.handleChange}
                        onBlur={CommunicationDetailsForm.handleBlur}
                        isReadOnly={!edit}
                        isDisabled={CommunicationDetailsForm.values.isPermanentAddress === "true"}
                        inputClassName={`${!edit
                                ? "tw-bg-transparent tw-border-0 tw-border-b tw-rounded-none"
                                : CommunicationDetailsForm.values.isPermanentAddress === "true"
                                    ? "tw-bg-gray-100"
                                    : "tw-bg-transparent"
                            }`}
                        invalid={Boolean(
                            CommunicationDetailsForm.touched.permanentPincode &&
                            CommunicationDetailsForm.errors.permanentPincode
                        )}
                        error={
                            CommunicationDetailsForm.touched.permanentPincode &&
                            CommunicationDetailsForm.errors.permanentPincode
                        }
                        labelClass="tw-text-gray-500"
                        allowedInputRegex="^[0-9]+$"
                        maxLength={6}
                    />

                </div>

                {/* Buttons */}
                {edit && (
                    <div className="tw-flex tw-justify-end tw-gap-4 tw-pt-6">
                        <Button
                            type="button"
                            onClick={CancelHandler}
                            variant='secondary'
                        >
                            Cancel
                        </Button>

                        <Button
                            type="button"
                            onClick={(e: any) => CommunicationDetailsForm.handleSubmit(e)}
                            variant='primary'
                        >
                            Update
                        </Button>
                    </div>
                )}

            </div>
        </div>
    )
}

export default ParmanentAddressDetails;
