import { useFormik } from 'formik';
import React, { useEffect, useRef, useState } from 'react'
import { shallowEqual, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { NewPhoneInput, RadioInputContainer, TextInput } from '../../../../Components/Common';
import { useAppSelector } from '../../../../hooks/storehook';
import { getStudentByIdAct, updateStudentAct } from '../../../../store/directory/studentmanagement/studentmanagementactions';
import { generateActionPayload } from '../../../../utility/reduxutility';
import { details, formSectionSaveKey } from './helper';
import * as Yup from 'yup'
import { IUpdateStudentRepRef } from './StudentInfoTypes';
import { HugeiconsIcon } from '@hugeicons/react';
import { PencilEdit02Icon } from "@hugeicons-pro/core-stroke-standard";
import Button from '../../../../Components/Common/Button';


interface IMedicalInfoDetails {
    studentId: number;
    academicYearId: string;
    divId: string;
    branchId: number;
    instituteId: number;
    canCreateAndUpdate: boolean;
}

const MedicalInfoDetails = (props: IMedicalInfoDetails) => {
    const dispatch = useDispatch();
    const initialValues = (data?: any) => {
        return {
            isSpecialChild: data ? data.isSpecialChild ? "true" : "false" : "",
            // allergicInfo:data ? `${data.allergicInfo}` : "",
            allergiticDetails: data?.allergiticDetails || "",
            isAllergitic: data ? data.isAllergitic ? "true" : "false" : "",
            otherHealthIssue: data?.otherHealthIssue || "",
            emergencyContactno: data?.emergencyContactNo || "",
        }
    }
    const validationSchema = Yup.object().shape({
        isSpecialChild: Yup.string().required("Is Special Child is required."),
        allergiticDetails: Yup.string().when([], {
            is: () => MedicalInfoDetailsForm.values.isAllergitic === "true",
            then: Yup.string().required("Allergetic Details is required."),
            otherwise: Yup.string().notRequired(),
        }),
        isAllergitic: Yup.string().required("Is Allergitic is required."),
        otherHealthIssue: Yup.string().when([], {
            is: () => MedicalInfoDetailsForm.values.isSpecialChild === "true",
            then: Yup.string().required("Special Child Details is required."),
            otherwise: Yup.string().notRequired(),
        }),
        emergencyContactno: Yup.string().trim().matches(/^[0-9]{10,10}$/, 'Phone number with 10 digit is valid.').required("Phone number required.").nullable(),
    });
    const [initialData, setInitialData] = useState(initialValues());
    const [edit, setEdit] = useState(false);

    const { getStudentByIdResp, updateStudentResp, affectedSection } = useAppSelector(
        ({ directoryStudent }) => ({
            getStudentByIdResp: directoryStudent.getStudentByIdResp,
            updateStudentResp: directoryStudent.updateStudentResp,
            affectedSection: directoryStudent.affectedSection,
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
    const PastEducationDetailsRef = useRef<IUpdateStudentRepRef>({
        preUpdateStudentDetails: updateStudentResp
    });

    useEffect(() => {
        const { preUpdateStudentDetails } =
            PastEducationDetailsRef.current;

        if (updateStudentResp &&
            preUpdateStudentDetails !== updateStudentResp) {
            if (affectedSection === "Medical Info") {
                toast.success("Medical Information Updated successfully.");
                UpdateHandler();
            }
        }
        PastEducationDetailsRef.current.preUpdateStudentDetails = updateStudentResp;
    }, [affectedSection, updateStudentResp]);
    const MedicalInfoDetailsForm = useFormik({
        enableReinitialize: true,
        initialValues: initialData,
        validationSchema,
        onSubmit: (values) => {
            const formData = new FormData();
            const data = details(getStudentByIdResp, values, { branchId: props.branchId, instituteId: props.instituteId }, formSectionSaveKey.medicalInfo);
            formData.append("studentRequest", JSON.stringify(data));
            dispatch(updateStudentAct(generateActionPayload('update_students_by_id', undefined, formData, {
                affectedSection: "Medical Info"
            })));
        },
    });

    const EditHandler = (event: any) => {
        setEdit(true);
    }

    const CancelHandler = () => {
        MedicalInfoDetailsForm.setValues(initialValues(getStudentByIdResp.medicalInfo)).then(() => {
            MedicalInfoDetailsForm.setErrors({});
        });
        setEdit(false);
    }

    function onChangePhoneInput(date: string, otherData: any, event: any) {
        const { target } = event, { name } = target || {},
            updateDate = date.substring(2);
        MedicalInfoDetailsForm.setFieldValue(name, updateDate);
    }

    const toggleHandler = (event: any) => {
        const { name, checked } = event.target;

        MedicalInfoDetailsForm.setValues((prev: any) => ({ ...prev, [name]: checked }))
    }

    useEffect(() => {
        if (getStudentByIdResp !== undefined) {
            setInitialData(initialValues(getStudentByIdResp.medicalInfo));
        }
    }, [getStudentByIdResp]);


    return (
        <div id={props.divId} className="tw-bg-white tw-rounded-lg tw-shadow tw-mb-4">

            {/* Header */}
            <div className="tw-flex tw-items-center tw-border-b tw-px-6 tw-py-4">
                <h4 className="tw-text-lg tw-font-semibold tw-text-gray-800">
                    Medical Info
                </h4>

                {props.canCreateAndUpdate && !edit && (
                    <div
                        className="tw-ml-auto tw-flex tw-items-center tw-cursor-pointer"
                        onClick={EditHandler}
                    >
                        <HugeiconsIcon
                            icon={PencilEdit02Icon}
                            className="tw-text-gray-400"
                            size={18}
                        />
                    </div>
                )}
            </div>

            {/* Body */}
            <div className="tw-p-6">

                <div className="tw-grid tw-grid-cols-12 tw-gap-4 tw-mb-2">

                    {/* Is Special Child */}
                    <div className="tw-col-span-12 lg:tw-col-span-4">
                        {edit ? (
                            <RadioInputContainer
                                name="isSpecialChild"
                                labelText="Is Special Child"
                                inputContainerClassName="tw-mt-2"
                                radioOptions={[
                                    { id: "true", name: "Yes" },
                                    { id: "false", name: "No" }
                                ]}
                                value={MedicalInfoDetailsForm.values.isSpecialChild}
                                onChange={MedicalInfoDetailsForm.handleChange}
                                isDisabled={!edit}
                                labelClassName="tw-text-gray-500"
                                invalid={
                                MedicalInfoDetailsForm.touched.isSpecialChild &&
                                    MedicalInfoDetailsForm.errors.isSpecialChild
                                    ? true
                                    : false
                                }
                                error={
                                    MedicalInfoDetailsForm.touched.isSpecialChild &&
                                        MedicalInfoDetailsForm.errors.isSpecialChild
                                        ? MedicalInfoDetailsForm.errors.isSpecialChild
                                        : ""
                                }
                            />
                        ) : (
                            <TextInput
                            name="isSpecialChild"
                            labelText="Is Special Child"
                            value={MedicalInfoDetailsForm.values.isSpecialChild === "true" ? "Yes" : "No"}
                            isReadOnly={true}
                            isDisabled={true}
                            inputClassName={'!tw-bg-transparent  !tw-border-0 !tw-border-b !tw-rounded-none'}
                            labelClass="text-muted"
                        />
                        )}
                    </div>

                    {/* Special Child Details */}
                    <div className="tw-col-span-12 lg:tw-col-span-4">
                        <TextInput
                            name="otherHealthIssue"
                            labelText="Special Child Details"
                            value={MedicalInfoDetailsForm.values.otherHealthIssue}
                            onChange={MedicalInfoDetailsForm.handleChange}
                            onBlur={MedicalInfoDetailsForm.handleBlur}
                            isReadOnly={!edit}
                            isDisabled={
                                !(edit && MedicalInfoDetailsForm.values.isSpecialChild === "true")
                            }
                            inputClassName={
                                !edit
                                    ? "!tw-bg-transparent  !tw-border-0 !tw-border-b !tw-rounded-none"
                                    : MedicalInfoDetailsForm.values.isSpecialChild === "true"
                                        ? "!tw-bg-transparent"
                                        : "!tw-bg-gray-100"
                            }
                            invalid={
                                MedicalInfoDetailsForm.touched.otherHealthIssue &&
                                    MedicalInfoDetailsForm.errors.otherHealthIssue
                                    ? true
                                    : false
                            }
                            error={
                                MedicalInfoDetailsForm.touched.otherHealthIssue &&
                                    MedicalInfoDetailsForm.errors.otherHealthIssue
                                    ? MedicalInfoDetailsForm.errors.otherHealthIssue
                                    : ""
                            }
                            labelClass="tw-text-gray-500"
                        />
                    </div>

                    {/* Allergic Info */}
                    <div className="tw-col-span-12 lg:tw-col-span-4">
                        {edit ? (
                            <RadioInputContainer
                                name="isAllergitic"
                                labelText="Medical Info"
                                inputContainerClassName="tw-mt-2"
                                radioOptions={[
                                    { id: "true", name: "Yes" },
                                    { id: "false", name: "No" }
                                ]}
                                value={MedicalInfoDetailsForm.values.isAllergitic}
                                onChange={MedicalInfoDetailsForm.handleChange}
                                isDisabled={!edit}
                                labelClassName="tw-text-gray-500"
                                invalid={
                                MedicalInfoDetailsForm.touched.isAllergitic &&
                                    MedicalInfoDetailsForm.errors.isAllergitic
                                    ? true
                                    : false
                                }
                                error={
                                    MedicalInfoDetailsForm.touched.isAllergitic &&
                                        MedicalInfoDetailsForm.errors.isAllergitic
                                        ? MedicalInfoDetailsForm.errors.isAllergitic
                                        : ""
                                }
                            />
                        ) : (
                           <TextInput
                            name="isAllergitic"
                            labelText="Medical Info"
                            value={MedicalInfoDetailsForm.values.isAllergitic === "true" ? "Yes" : "No"}
                            isReadOnly={true}
                            isDisabled={true}
                            inputClassName={'!tw-bg-transparent  !tw-border-0 !tw-border-b !tw-rounded-none'}
                            labelClass="text-muted"
                        />
                        )}
                    </div>

                    {/* Allergic Details */}
                    <div className="tw-col-span-12 lg:tw-col-span-4 ">
                        <TextInput
                            name="allergiticDetails"
                            labelText="Medical Details"
                            value={MedicalInfoDetailsForm.values.allergiticDetails}
                            onChange={MedicalInfoDetailsForm.handleChange}
                            onBlur={MedicalInfoDetailsForm.handleBlur}
                            isReadOnly={!edit}
                            isDisabled={
                                !(edit && MedicalInfoDetailsForm.values.isAllergitic === "true")
                            }
                            inputClassName={
                                !edit
                                    ? "!tw-bg-transparent !tw-border-0 !tw-border-b !tw-rounded-none"
                                    : MedicalInfoDetailsForm.values.isAllergitic === "true"
                                        ? "!tw-bg-transparent"
                                        : "!tw-bg-gray-100"
                            }
                            invalid={
                                MedicalInfoDetailsForm.touched.allergiticDetails &&
                                    MedicalInfoDetailsForm.errors.allergiticDetails
                                    ? true
                                    : false
                            }
                            error={
                                MedicalInfoDetailsForm.touched.allergiticDetails &&
                                    MedicalInfoDetailsForm.errors.allergiticDetails
                                    ? MedicalInfoDetailsForm.errors.allergiticDetails
                                    : ""
                            }
                            labelClass="tw-text-gray-500"
                        />
                    </div>

                    {/* Emergency Contact */}
                    <div className="tw-col-span-12 lg:tw-col-span-4">
                        <NewPhoneInput
                            name="emergencyContactno"
                            labelText="Emergency Contact no"
                            value={MedicalInfoDetailsForm.values.emergencyContactno}
                            onChange={onChangePhoneInput}
                            onBlur={MedicalInfoDetailsForm.handleBlur}
                            isDisabled={!edit}
                            labelClass="text-muted"
                            inputClassName={`${!edit ? '!tw-bg-transparent !tw-border-0 !tw-border-b !tw-rounded-none' : ""}`}
                            invalid={(MedicalInfoDetailsForm.touched.emergencyContactno && MedicalInfoDetailsForm.errors.emergencyContactno) ? true : false}
                            error={(MedicalInfoDetailsForm.touched.emergencyContactno && MedicalInfoDetailsForm.errors.emergencyContactno) ? MedicalInfoDetailsForm.errors.emergencyContactno : ""}
                        />
                    </div>

                </div>

                {/* Footer Buttons */}
                {edit && (
                    <div className="tw-flex tw-justify-end tw-gap-3 tw-pt-4">
                        <Button
                            type="button"
                            variant='secondary'
                            onClick={CancelHandler}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant='primary'
                            type="button"
                            onClick={(e: any) => MedicalInfoDetailsForm.handleSubmit(e)}
                        >
                            Update
                        </Button>
                    </div>
                )}

            </div>
        </div>

    )
}

export default MedicalInfoDetails
