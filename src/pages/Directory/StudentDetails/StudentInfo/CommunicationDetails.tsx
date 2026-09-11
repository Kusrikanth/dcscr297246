import { useFormik } from 'formik';
import React, { useEffect, useRef, useState } from 'react'
import { shallowEqual, useDispatch } from 'react-redux';
import { SelectInput, TextInput, TextInputWithRegex } from '../../../../Components/Common'
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

const CommunicationDetails = (props: ICommunicationDetails) => {
    const dispatch = useDispatch();
    // const [classList, setClassList] = useState([]);
    const initialValues = (data?: any) => {
        return {
            currentHouseNo: data?.currentHouseNo || "",
            currentLandmark: data?.currentLandmark || "",
            currentCountryId: data?.currentCountryId || "",
            currentStateId: data?.currentStateId || "",
            currentCityId: data?.currentCityId || "",
            currentPincode: data?.currentPincode || "",
        }
    }

    const [initialData, setInitialData] = useState(initialValues());

    const [edit, setEdit] = useState(false);

    const validationSchema = Yup.object().shape({
        currentHouseNo: Yup.string().required("House/Flat No. is required."),
        currentLandmark: Yup.string().required("Landmark is required."),
        currentCountryId: Yup.string().required("Country is required."),
        currentStateId: Yup.string().required("State is required."),
        currentCityId: Yup.string().required("City is required."),
        currentPincode: Yup.number().typeError('Pincode must be a number').required("Pin Code is required.").test('len', 'Pin code should have at least 6 digits', (val: any) => val.toString().length === 6)
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
            if (affectedSection === "Communication Details") {
                toast.success("Communication Details Updated successfully.");
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
            const data = details(getStudentByIdResp, values, { branchId: props.branchId, instituteId: props.instituteId }, formSectionSaveKey.communicationDetails);

            formData.append("studentRequest", JSON.stringify(data));
            dispatch(updateStudentAct(generateActionPayload('update_students_by_id', undefined, formData, {
                affectedSection: "Communication Details"
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
        if (name === "currentCountryId") {
            dispatch(getCountryStateAct(generateActionPayload('get_stateby_countryname', { countryName: value })))
            CommunicationDetailsForm.setFieldValue('currentStateId', "");
            CommunicationDetailsForm.setFieldValue('currentCityId', "");
        }
        else if (name === "currentStateId") {
            dispatch(getStateCityAct(generateActionPayload('get_cityby_statename', { stateName: value })))
            CommunicationDetailsForm.setFieldValue('currentCityId', "");
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
        <div className="tw-bg-white tw-rounded-lg tw-shadow tw-mb-4">

            {/* Header */}
            <div className="tw-flex tw-items-center tw-border-b tw-px-6 tw-py-4">
                <h4 className="tw-text-lg tw-font-semibold tw-text-gray-800">
                    Communication Details
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

                {/* Form Grid */}
                <div className="tw-grid tw-grid-cols-1 sm:tw-grid-cols-2 2xl:tw-grid-cols-3 tw-gap-6">

                    <TextInput
                        name="currentHouseNo"
                        labelText="H.No / Flat No"
                        value={CommunicationDetailsForm.values.currentHouseNo}
                        onChange={CommunicationDetailsForm.handleChange}
                        onBlur={CommunicationDetailsForm.handleBlur}
                        isReadOnly={!edit}
                        inputClassName={`tw-bg-transparent ${!edit ? "tw-border-0 tw-border-b tw-rounded-none" : ""
                            }`}
                        invalid={
                                CommunicationDetailsForm.touched.currentHouseNo &&
                                    CommunicationDetailsForm.errors.currentHouseNo
                                    ? true
                                    : false
                            }
                            error={
                                CommunicationDetailsForm.touched.currentHouseNo &&
                                    CommunicationDetailsForm.errors.currentHouseNo
                                    ? CommunicationDetailsForm.errors.currentHouseNo
                                    : ""
                            }
                        labelClass="tw-text-gray-500"
                    />

                    <TextInput
                        name="currentLandmark"
                        labelText="Location / Landmark"
                        value={CommunicationDetailsForm.values.currentLandmark}
                        onChange={CommunicationDetailsForm.handleChange}
                        onBlur={CommunicationDetailsForm.handleBlur}
                        isReadOnly={!edit}
                        inputClassName={`tw-bg-transparent ${!edit ? "tw-border-0 tw-border-b tw-rounded-none" : ""
                            }`}
                        invalid={
                                CommunicationDetailsForm.touched.currentLandmark &&
                                    CommunicationDetailsForm.errors.currentLandmark
                                    ? true
                                    : false
                            }
                            error={
                                CommunicationDetailsForm.touched.currentLandmark &&
                                    CommunicationDetailsForm.errors.currentLandmark
                                    ? CommunicationDetailsForm.errors.currentLandmark
                                    : ""
                            }
                        labelClass="tw-text-gray-500"
                    />

                    <SelectInput
                        name="currentCountryId"
                        labelText="Country"
                        value={CommunicationDetailsForm.values.currentCountryId}
                        onChange={ChangeHandler}
                        onBlur={CommunicationDetailsForm.handleBlur}
                        valueKey="countryName"
                        textKey="countryName"
                        menuItems={countriesResp || []}
                        isReadOnly={!edit}
                        isDisabled={!edit}
                        inputClassName={`tw-bg-transparent ${!edit
                                ? "tw-border-0 tw-border-b tw-rounded-none tw-bg-none"
                                : ""
                            }`}
                        invalid={
                                CommunicationDetailsForm.touched.currentCountryId &&
                                    CommunicationDetailsForm.errors.currentCountryId
                                    ? true
                                    : false
                            }
                            error={
                                CommunicationDetailsForm.touched.currentCountryId &&
                                    CommunicationDetailsForm.errors.currentCountryId
                                    ? CommunicationDetailsForm.errors.currentCountryId
                                    : ""
                            }
                        labelClass="tw-text-gray-500"
                    />

                    <SelectInput
                        name="currentStateId"
                        labelText="State"
                        value={CommunicationDetailsForm.values.currentStateId}
                        onChange={ChangeHandler}
                        onBlur={CommunicationDetailsForm.handleBlur}
                        valueKey="stateName"
                        textKey="stateName"
                        menuItems={countryStateResp || []}
                        isReadOnly={!edit}
                        isDisabled={!edit}
                        inputClassName={`tw-bg-transparent ${!edit
                                ? "tw-border-0 tw-border-b tw-rounded-none tw-bg-none"
                                : ""
                            }`}
                        invalid={
                                CommunicationDetailsForm.touched.currentStateId &&
                                    CommunicationDetailsForm.errors.currentStateId
                                    ? true
                                    : false
                            }
                            error={
                                CommunicationDetailsForm.touched.currentStateId &&
                                    CommunicationDetailsForm.errors.currentStateId
                                    ? CommunicationDetailsForm.errors.currentStateId
                                    : ""
                            }
                        labelClass="tw-text-gray-500"
                    />

                    <SelectInput
                        name="currentCityId"
                        labelText="City"
                        value={CommunicationDetailsForm.values.currentCityId}
                        onChange={ChangeHandler}
                        onBlur={CommunicationDetailsForm.handleBlur}
                        valueKey="cityName"
                        textKey="cityName"
                        menuItems={stateCityResp || []}
                        isReadOnly={!edit}
                        isDisabled={!edit}
                        inputClassName={`tw-bg-transparent ${!edit
                                ? "tw-border-0 tw-border-b tw-rounded-none tw-bg-none"
                                : ""
                            }`}
                        invalid={
                                CommunicationDetailsForm.touched.currentCityId &&
                                    CommunicationDetailsForm.errors.currentCityId
                                    ? true
                                    : false
                            }
                            error={
                                CommunicationDetailsForm.touched.currentCityId &&
                                    CommunicationDetailsForm.errors.currentCityId
                                    ? CommunicationDetailsForm.errors.currentCityId
                                    : ""
                            }
                        labelClass="tw-text-gray-500"
                    />

                    <TextInputWithRegex
                        name="currentPincode"
                        labelText="PIN Code"
                        value={CommunicationDetailsForm.values.currentPincode}
                        onChange={CommunicationDetailsForm.handleChange}
                        onBlur={CommunicationDetailsForm.handleBlur}
                        isReadOnly={!edit}
                        inputClassName={`tw-bg-transparent ${!edit ? "tw-border-0 tw-border-b tw-rounded-none" : ""
                            }`}
                        invalid={
                                CommunicationDetailsForm.touched.currentPincode &&
                                    CommunicationDetailsForm.errors.currentPincode
                                    ? true
                                    : false
                            }
                            error={
                                CommunicationDetailsForm.touched.currentPincode &&
                                    CommunicationDetailsForm.errors.currentPincode
                                    ? CommunicationDetailsForm.errors.currentPincode
                                    : ""
                            }
                        labelClass="tw-text-gray-500"
                        allowedInputRegex="^[0-9]+$"
                        maxLength={6}
                    />

                </div>

                {/* Action Buttons */}
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
                            variant='primary'>
                            Update
                        </Button>

                    </div>
                )}

            </div>
        </div>
    )
}

export default CommunicationDetails
