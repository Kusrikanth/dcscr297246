import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react'
import { shallowEqual, useDispatch } from 'react-redux';
import { SelectInput, TextIconInput, TextInput } from '../../../../Components/Common'
import { useAppSelector } from '../../../../hooks/storehook';
import { getBranchClassAct, getBranchCurriculumAct } from '../../../../store/branchsettings/branchacademics/branchacademicsactions';
import { updateStudentAct } from '../../../../store/directory/studentmanagement/studentmanagementactions';
import { generateActionPayload } from '../../../../utility/reduxutility';
import { details } from './helper';
import Button from '../../../../Components/Common/Button';


const PastEducationDetails = (props: any) => {
    const dispatch = useDispatch()
    const initialValues = (data?: any) => {
        return {
            lastSchoolStudied: data ? data.lastSchoolStudied : "",
            lastCurriculumId: data ? data.lastCurriculumId : "",
            lastClassId: data ? data.lastClassId : "",
            lastClassPerc: data ? data.lastClassPerc : "",
            reasonForAdmission: data ? data.reasonForAdmission : "",
        }
    }

    const [initialData, setInitialData] = useState(initialValues());

    const [edit, setEdit] = useState(false);

    const { getStudentByIdResp, brchCurriculumResp, branchClassResp } = useAppSelector(
        ({ directoryStudent, branchAcademics }) => ({
            getStudentByIdResp: directoryStudent.getStudentByIdResp,
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            branchClassResp: branchAcademics.branchClassResp,
        }),
        shallowEqual
    );

    const PastEducationDetailsForm = useFormik({
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
        const payload1 = { branchId: 20, pageNo: 0, pageSize: 100,sortBy:"curriculumName",orderBy:"asc" };
        dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
    }, [])
    useEffect(() => {
        const payload = { branchId: 20, curriculumId: initialData.lastCurriculumId, pageNo: 0, pageSize: 100 };
        initialData && dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
    }, [initialData])
    useEffect(() => {
        if (getStudentByIdResp !== undefined) {
            setInitialData(initialValues(getStudentByIdResp.pastEducation));
        }
    }, [getStudentByIdResp]);

    const { data: CurriculumList } = brchCurriculumResp || {};
    const { content: ClassList } = branchClassResp || {};

    return (
        <div id={props.divId} className="tw-bg-white tw-shadow tw-rounded-lg">
            <div className="tw-grid tw-grid-cols-2 tw-items-center tw-px-6 tw-py-4 tw-border-b">
                <h4 className="tw-text-base tw-font-semibold tw-mb-0">Past Education</h4>

                {!edit && (
                    <div
                        className="tw-justify-self-end tw-cursor-pointer tw-grid tw-grid-flow-col tw-auto-cols-max tw-items-center tw-gap-2"
                        onClick={EditHandler}
                    >
                        <i
                            className="ri-edit-box-line tw-text-lg"
                            style={{ color: "#405189" }}
                        ></i>
                        <span
                            className="tw-text-base tw-underline"
                            style={{ color: "#405189" }}
                        >
                            Edit
                        </span>
                    </div>
                )}
            </div>

            <div className="tw-p-6">
                <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 2xl:tw-grid-cols-3 tw-gap-4">

                    <div>
                        <TextInput
                            name="lastSchoolStudied"
                            labelText="School Studied"
                            value={PastEducationDetailsForm.values.lastSchoolStudied}
                            onChange={PastEducationDetailsForm.handleChange}
                            onBlur={PastEducationDetailsForm.handleBlur}
                            isReadOnly={!edit}
                            inputClassName={
                                "tw-bg-transparent " +
                                `${edit ? "tw-border tw-border-gray-800" : "tw-border-0 tw-border-b tw-rounded-none"}`
                            }
                            labelClass="tw-text-gray-500"
                        />
                    </div>

                    <div>
                        <SelectInput
                            name="lastCurriculumId"
                            labelText="Curriculum"
                            value={PastEducationDetailsForm.values.lastCurriculumId}
                            onChange={PastEducationDetailsForm.handleChange}
                            onBlur={PastEducationDetailsForm.handleBlur}
                            valueKey="branchCurriculumId"
                            textKey="curriculumName"
                            menuItems={CurriculumList || []}
                            isReadOnly={!edit}
                            isDisabled={!edit}
                            inputClassName={
                                "tw-bg-transparent " +
                                `${edit ? "tw-border tw-border-gray-800" : "tw-border-0 tw-border-b tw-rounded-none"}`
                            }
                            labelClass="tw-text-gray-500"
                        />
                    </div>

                    <div>
                        <SelectInput
                            name="lastClassId"
                            labelText="Class"
                            value={PastEducationDetailsForm.values.lastClassId}
                            onChange={PastEducationDetailsForm.handleChange}
                            onBlur={PastEducationDetailsForm.handleBlur}
                            valueKey="id"
                            textKey="shortName"
                            menuItems={ClassList || []}
                            isReadOnly={!edit}
                            isDisabled={!edit}
                            inputClassName={
                                "tw-bg-transparent " +
                                `${edit ? "tw-border tw-border-gray-800" : "tw-border-0 tw-border-b tw-rounded-none"}`
                            }
                            labelClass="tw-text-gray-500"
                        />
                    </div>

                    <div>
                        <TextIconInput
                            name="lastClassPerc"
                            labelText="Percentage"
                            value={PastEducationDetailsForm.values.lastClassPerc}
                            onChange={PastEducationDetailsForm.handleChange}
                            isReadOnly={!edit}
                            inputClassName={
                                "tw-bg-transparent " +
                                `${edit ? "tw-border tw-border-gray-800" : "tw-border-0 tw-border-b tw-rounded-none"}`
                            }
                            labelClass="tw-text-gray-500"
                            iconPositionClassName="right"
                        >
                            <i className="ri-percent-line tw-text-gray-500"></i>
                        </TextIconInput>
                    </div>

                    <div>
                        <TextInput
                            name="reasonForAdmission"
                            labelText="Reason for Seeking Admission"
                            value={PastEducationDetailsForm.values.reasonForAdmission}
                            onChange={PastEducationDetailsForm.handleChange}
                            onBlur={PastEducationDetailsForm.handleBlur}
                            isReadOnly={!edit}
                            inputClassName={
                                "tw-bg-transparent " +
                                `${edit ? "tw-border tw-border-gray-800" : "tw-border-0 tw-border-b tw-rounded-none"}`
                            }
                            labelClass="tw-text-gray-500"
                        />
                    </div>
                </div>

                {edit && (
                    <div className="tw-mt-6 tw-grid">
                        <div className="tw-justify-self-end tw-grid tw-grid-flow-col tw-auto-cols-max tw-gap-3 tw-pb-3">
                            <Button variant='secondary'>
                                Cancel
                            </Button>
                            <Button
                                variant='primary'
                                onClick={(e: any) => PastEducationDetailsForm.handleSubmit(e)}
                            >
                                Update
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default PastEducationDetails
