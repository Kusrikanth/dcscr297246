import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react'
import { shallowEqual, useDispatch } from 'react-redux';
import { SelectInput, Switch, TextInput } from '../../../../Components/Common';
import { useAppSelector } from '../../../../hooks/storehook';
import { updateStudentAct } from '../../../../store/directory/studentmanagement/studentmanagementactions';
import { generateActionPayload } from '../../../../utility/reduxutility';
import { details } from './helper';
import Button from '../../../../Components/Common/Button';


const MedicalInfoDetails = (props: any) => {
    const dispatch = useDispatch();
    const initialValues = (data?: any) => {
        return {
            isSpecialChild: data ? `${data.isSpecialChild}` : "",
            // allergicInfo:data ? `${data.allergicInfo}` : "",
            allergiticDetails: data ? data.allergiticDetails : "",
            isAllergitic: data ? `${data.isAllergitic}` : "",
            otherHealthIssue: data ? data.otherHealthIssue : "",
            emergencyContactno: data ? data.emergencyContactNo : "",
        }
    }

    const [initialData, setInitialData] = useState(initialValues());
    const [edit, setEdit] = useState(false);

    const { getStudentByIdResp } = useAppSelector(
        ({ directoryStudent }) => ({
            getStudentByIdResp: directoryStudent.getStudentByIdResp,
        }),
        shallowEqual
    );

    const MedicalInfoDetailsForm = useFormik({
        enableReinitialize: true,
        initialValues: initialData,
        onSubmit: (values) => {
            const formData = new FormData();
            const data = details(getStudentByIdResp, values);
            formData.append("studentRequest", JSON.stringify(data));
            dispatch(updateStudentAct(generateActionPayload('update_students_by_id', undefined, formData)));
        },
    });

    const EditHandler = (event: any) => {
        setEdit(true);
    }

    useEffect(() => {
        if (getStudentByIdResp !== undefined) {
            setInitialData(initialValues(getStudentByIdResp.medicalInfo));
        }
    }, [getStudentByIdResp]);


    return (
        <div id={props.divId} className="tw-bg-white tw-rounded-xl tw-shadow-sm tw-border">

            <div className="tw-flex tw-items-center tw-justify-between tw-px-6 tw-py-4 tw-border-b">
                <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                    Medical Info
                </h4>

                {!edit && (
                    <div
                        className="tw-ml-auto tw-flex tw-items-center tw-cursor-pointer"
                        onClick={EditHandler}
                    >
                        <i className="ri-edit-box-line tw-text-lg tw-mr-1 tw-text-[#405189]"></i>
                        <span className="tw-text-base tw-underline tw-text-[#405189]">
                            Edit
                        </span>
                    </div>
                )}
            </div>

            <div className="tw-p-6">

                <div className="tw-grid tw-grid-cols-12 tw-gap-4 tw-mb-4">

                    <div className="tw-col-span-12 md:tw-col-span-6 xl:tw-col-span-4">
                        <SelectInput
                            name="isSpecialChild"
                            labelText="Is Special Child"
                            value={MedicalInfoDetailsForm.values.isSpecialChild}
                            onChange={MedicalInfoDetailsForm.handleChange}
                            onBlur={MedicalInfoDetailsForm.handleBlur}
                            valueKey="isSpecialChildValue"
                            textKey="isSpecialChildText"
                            menuItems={[{ isSpecialChildText: "Yes", isSpecialChildValue: "true" }, { isSpecialChildText: "No", isSpecialChildValue: "false" }]}
                            isReadOnly={!edit}
                            isDisabled={!edit}
                            inputClassName={
                                'tw-bg-transparent ' +
                                (edit
                                    ? 'tw-border tw-border-gray-400 tw-rounded-md'
                                    : 'tw-border-0 tw-border-b tw-rounded-none')
                            }
                            labelClass="tw-text-gray-500"
                        />
                    </div>

                    <div className="tw-col-span-12 md:tw-col-span-6 xl:tw-col-span-4">
                        <TextInput
                            name="allergiticDetails"
                            labelText="Details"
                            value={MedicalInfoDetailsForm.values.allergiticDetails}
                            onChange={MedicalInfoDetailsForm.handleChange}
                            onBlur={MedicalInfoDetailsForm.handleBlur}
                            isReadOnly={!edit}
                            inputClassName={
                                'tw-bg-transparent ' +
                                (edit
                                    ? 'tw-border tw-border-gray-400 tw-rounded-md'
                                    : 'tw-border-0 tw-border-b tw-rounded-none')
                            }
                            labelClass="tw-text-gray-500"
                        />
                    </div>

                    <div className="tw-col-span-12 md:tw-col-span-6 xl:tw-col-span-4">
                        <SelectInput
                            name="isAllergitic"
                            labelText="Allergic Info"
                            value={MedicalInfoDetailsForm.values.isAllergitic}
                            onChange={MedicalInfoDetailsForm.handleChange}
                            onBlur={MedicalInfoDetailsForm.handleBlur}
                            valueKey="allergicInfoValue"
                            textKey="allergicInfoText"
                            menuItems={[{ allergicInfoText: "Yes", allergicInfoValue: "true" }, { allergicInfoText: "No", allergicInfoValue: "false" }]}
                            isReadOnly={!edit}
                            isDisabled={!edit}
                            inputClassName={
                                'tw-bg-transparent ' +
                                (edit
                                    ? 'tw-border tw-border-gray-400 tw-rounded-md'
                                    : 'tw-border-0 tw-border-b tw-rounded-none')
                            }
                            labelClass="tw-text-gray-500"
                        />
                    </div>

                    <div className="tw-col-span-12 md:tw-col-span-6 xl:tw-col-span-4">
                        <TextInput
                            name="otherHealthIssue"
                            labelText="Other Health Issue"
                            value={MedicalInfoDetailsForm.values.otherHealthIssue}
                            onChange={MedicalInfoDetailsForm.handleChange}
                            onBlur={MedicalInfoDetailsForm.handleBlur}
                            isReadOnly={!edit}
                            inputClassName={
                                'tw-bg-transparent ' +
                                (edit
                                    ? 'tw-border tw-border-gray-400 tw-rounded-md'
                                    : 'tw-border-0 tw-border-b tw-rounded-none')
                            }
                            labelClass="tw-text-gray-500"
                        />
                    </div>

                    <div className="tw-col-span-12 md:tw-col-span-6 xl:tw-col-span-4">
                        <TextInput
                            name="emergencyContactno"
                            labelText="Emergency Contact no"
                            value={MedicalInfoDetailsForm.values.emergencyContactno}
                            onChange={MedicalInfoDetailsForm.handleChange}
                            onBlur={MedicalInfoDetailsForm.handleBlur}
                            isReadOnly={!edit}
                            inputClassName={
                                'tw-bg-transparent ' +
                                (edit
                                    ? 'tw-border tw-border-gray-400 tw-rounded-md'
                                    : 'tw-border-0 tw-border-b tw-rounded-none')
                            }
                            labelClass="tw-text-gray-500"
                        />
                    </div>

                </div>

                {edit && (
                    <div className="tw-flex tw-justify-end tw-gap-3 tw-pt-4">
                        <Button  variant='secondary'>
                            Cancel
                        </Button>

                        <Button
                            variant='primary'
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
