import { useFormik } from 'formik';
import { useEffect, useRef, useState } from 'react'
import { shallowEqual, useDispatch } from 'react-redux';
import { SelectInput, TextIconInput, TextInput } from '../../../../Components/Common'
import { useAppSelector } from '../../../../hooks/storehook';
import { getBranchClassAct } from '../../../../store/branchsettings/branchacademics/branchacademicsactions';
import { getStudentByIdAct, updateStudentAct } from '../../../../store/directory/studentmanagement/studentmanagementactions';
import { generateActionPayload } from '../../../../utility/reduxutility';
import * as Yup from 'yup';
import { details, formSectionSaveKey } from './helper';
import { IUpdateStudentRepRef } from './StudentInfoTypes';
import { toast } from 'react-toastify';
import { getMasterCurriculumAct } from '../../../../store/masterdata/masterdataactions';
import { HugeiconsIcon } from '@hugeicons/react';
import { PencilEdit02Icon } from '@hugeicons-pro/core-stroke-standard';
import Button from '../../../../Components/Common/Button';

interface IPastEducationDetails {
    studentId: number;
    academicYearId: string;
    branchId: number;
    divId: string;
    instituteId: number;
    canCreateAndUpdate: boolean;
}

const PastEducationDetails = (props: IPastEducationDetails) => {
    const dispatch = useDispatch();
    const [classList, setClassList] = useState([]);
    const initialValues = (data?: any) => {
        return {
            lastSchoolStudied: data?.lastSchoolStudied || "",
            lastCurriculumStudied: data?.lastCurriculumStudied || "",
            lastClassStudied: data?.lastClassStudied || "",
            lastClassPerc: data?.lastClassPerc ? `${data.lastClassPerc}` : "",
            reasonForAdmission: data?.reasonForAdmission || "",
        }
    }

    const [initialData, setInitialData] = useState(initialValues());

    const [edit, setEdit] = useState(false);

    const validationSchema = Yup.object().shape({
        lastClassPerc: Yup.number().positive('Class precentage should be positive value').typeError("Enter valid number").lessThan(100.000000001, 'Class precentage should be less than 100.')
        // lastClassPerc: Yup.string().required("Percentage is required."),
        // reasonForAdmission: Yup.string().required("Reason for Seeking Admission is required."),
    });

    const { getStudentByIdResp, masterCurriculumResp, brchCurriculumResp, branchClassResp, updateStudentResp, affectedSection, brchCurriculumClassResp } = useAppSelector(
        ({ directoryStudent, masterData, branchAcademics }) => ({
            getStudentByIdResp: directoryStudent.getStudentByIdResp,
            updateStudentResp: directoryStudent.updateStudentResp,
            affectedSection: directoryStudent.affectedSection,
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            masterCurriculumResp: masterData.masterCurriculumResp,
            branchClassResp: branchAcademics.branchClassResp,
            brchCurriculumClassResp: branchAcademics.brchCurriculumClassResp
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
            if (affectedSection === "Past Education Details") {
                toast.success("Past Education Updated successfully.");
                UpdateHandler();
            }
        }
        PastEducationDetailsRef.current.preUpdateStudentDetails = updateStudentResp;
    }, [affectedSection, updateStudentResp]);


    useEffect(() => {
        dispatch(getMasterCurriculumAct(generateActionPayload("get_master_curriculum", undefined, { pageNo: 0, pageSize: 50 })));
    }, []);

    const PastEducationDetailsForm = useFormik({
        enableReinitialize: true,
        initialValues: initialData,
        validationSchema,
        onSubmit: (values) => {

            const formData = new FormData();
            const data = details(getStudentByIdResp, values, { branchId: props.branchId, instituteId: props.instituteId }, formSectionSaveKey.pastEducation);
            formData.append("studentRequest", JSON.stringify(data));
            dispatch(updateStudentAct(generateActionPayload('update_students_by_id', undefined, formData, {
                affectedSection: "Past Education Details"
            })));
        },
    });

    const EditHandler = (event: any) => {
        setEdit(true);
    }

    const CancelHandler = () => {
        PastEducationDetailsForm.setValues(initialValues(getStudentByIdResp.pastEducation)).then(() => {
            PastEducationDetailsForm.setErrors({});
        });
        setEdit(false);
    }

    const curriculumHandler = (event: any) => {
        PastEducationDetailsForm.handleChange(event);
        const { name, value } = event.target;
        const payload = { branchId: +props.branchId, academicYearId: props.academicYearId, curriculumId: value, pageNo: 0, pageSize: 100, sortBy: "className", orderBy: "asc" };
        dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
    }
    // const classHandler = (event: any) => {
    //     PastEducationDetailsForm.handleChange(event);
    //     const payload1 = { branchId: props.branchId, curriculumId: initialData.lastCurriculumId, classId: event.target.value, pageNo: 0, pageSize: 100 };
    //     dispatch(getBrchSectionsAct(generateActionPayload("get_brch_sections", undefined, payload1)));
    // }

    // useEffect(() => {
    //     const payload1 = { branchId: 20, pageNo: 0, pageSize: 100 };
    //     dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
    // }, [])
    useEffect(() => {
        // if (initialData.lastCurriculumId) {
        //     const payload = { branchId: +props.branchId, curriculumId: initialData.lastCurriculumId, pageNo: 0, pageSize: 100,sortBy:"className",orderBy:"asc" };
        //     dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
        // }
    }, [initialData])
    useEffect(() => {
        if (getStudentByIdResp !== undefined) {
            setInitialData(initialValues(getStudentByIdResp.pastEducation));
        }
    }, [getStudentByIdResp]);

    const { data: CurriculumList } = brchCurriculumResp || {};
    const { content: ClassList } = branchClassResp || {};

    return (
        <div id={props.divId} className="tw-bg-white tw-rounded-lg tw-shadow tw-mb-4">
            {/* Header */}
            <div className="tw-flex tw-items-center tw-border-b tw-px-6 tw-py-4">
                <h4 className="tw-text-lg tw-font-semibold tw-text-gray-800">
                    Past Education
                </h4>
				{!edit && <div className="ms-auto d-flex align-items-center cursor-pointer" onClick={EditHandler}>
                    <HugeiconsIcon icon={PencilEdit02Icon} className="me-2 text-muted" size={18} />
                </div>}
            </div>

            {/* Body */}
            <div className="tw-p-6">
                <div className="tw-grid tw-grid-cols-1 sm:tw-grid-cols-2 2xl:tw-grid-cols-3 tw-gap-4">

                    <TextInput
                        name="lastSchoolStudied"
                        labelText="School Studied"
                        value={PastEducationDetailsForm.values.lastSchoolStudied}
                        onChange={PastEducationDetailsForm.handleChange}
                        onBlur={PastEducationDetailsForm.handleBlur}
                        isReadOnly={!edit}
                        inputClassName={
                            !edit
                                ? "!tw-bg-transparent  !tw-border-0 !tw-border-b !tw-rounded-none"
                                : "!tw-bg-transparent"
                        }
                        invalid={Boolean(
                            PastEducationDetailsForm.touched.lastSchoolStudied &&
                            PastEducationDetailsForm.errors.lastSchoolStudied
                        )}
                        error={
                            PastEducationDetailsForm.touched.lastSchoolStudied &&
                                PastEducationDetailsForm.errors.lastSchoolStudied
                                ? PastEducationDetailsForm.errors.lastSchoolStudied
                                : ""
                        }
                        labelClass="tw-text-gray-500"
                    />

                    <TextInput
                            name="lastCurriculumStudied"
                            labelText="Curriculum"
                            value={PastEducationDetailsForm.values.lastCurriculumStudied}
                            onChange={PastEducationDetailsForm.handleChange}
                            onBlur={PastEducationDetailsForm.handleBlur}
                            // menuItems={CurriculumList || []}
                            isReadOnly={!edit}
                            isDisabled={!edit}
                            inputClassName={'!bg-transparent ' + `${!edit ? ' !tw-border-0 !tw-border-b !tw-rounded-none' : ""}`}
                            // invalid={
                            //     PastEducationDetailsForm.touched.lastCurriculumStudied &&
                            //         PastEducationDetailsForm.errors.lastCurriculumStudied
                            //         ? true
                            //         : false
                            // }
                            // error={
                            //     PastEducationDetailsForm.touched.lastCurriculumStudied &&
                            //         PastEducationDetailsForm.errors.lastCurriculumStudied
                            //         ? PastEducationDetailsForm.errors.lastCurriculumStudied
                            //         : ""
                            // }
							 labelClass="text-muted"
                        />

                    <TextInput
                            name="lastClassStudied"
                            labelText="Class"
                            value={PastEducationDetailsForm.values.lastClassStudied}
                            onChange={PastEducationDetailsForm.handleChange}
                            onBlur={PastEducationDetailsForm.handleBlur}
                            // valueKey="id"
                            // textKey="shortName"
                            // menuItems={ClassList || []}
                            isReadOnly={!edit}
                            isDisabled={!edit}
                            inputClassName={'bg-transparent ' + `${!edit ? 'border-0 border-bottom rounded-0 bg-img-none' : ""}`}
                            // invalid={
                            //     PastEducationDetailsForm.touched.lastClassStudied &&
                            //         PastEducationDetailsForm.errors.lastClassStudied
                            //         ? true
                            //         : false
                            // }
                            // error={
                            //     PastEducationDetailsForm.touched.lastClassStudied &&
                            //         PastEducationDetailsForm.errors.lastClassStudied
                            //         ? PastEducationDetailsForm.errors.lastClassStudied
                            //         : ""
                            // }
                            labelClass="text-muted"
                        />

                    <TextIconInput
                        name="lastClassPerc"
                        labelText="Percentage"
                        value={PastEducationDetailsForm.values.lastClassPerc}
                        onChange={PastEducationDetailsForm.handleChange}
                        onBlur={PastEducationDetailsForm.handleBlur}
                        isReadOnly={!edit}
                        maxLength={3}
                        inputClassName={
                            !edit
                                ? "!tw-bg-transparent  !tw-border-0 !tw-border-b !tw-rounded-none"
                                : "!tw-bg-transparent"
                        }
                        invalid={Boolean(
                            PastEducationDetailsForm.touched.lastClassPerc &&
                            PastEducationDetailsForm.errors.lastClassPerc
                        )}
                        error={
                            PastEducationDetailsForm.touched.lastClassPerc &&
                                PastEducationDetailsForm.errors.lastClassPerc
                                ? PastEducationDetailsForm.errors.lastClassPerc
                                : ""
                        }
                        labelClass="tw-text-gray-500"
                        iconPositionClassName="right"
                    >
                        <i className="ri-percent-line tw-text-gray-400"></i>
                    </TextIconInput>

                    <TextInput
                            name="reasonForAdmission"
                            labelText="Reason for Seeking Admission"
                            value={PastEducationDetailsForm.values.reasonForAdmission}
                            onChange={PastEducationDetailsForm.handleChange}
                            onBlur={PastEducationDetailsForm.handleBlur}
                            isReadOnly={!edit}
                            inputClassName={'bg-transparent ' + `${!edit ? 'border-0 border-bottom rounded-0' : ""}`}
                            // invalid={
                            //     PastEducationDetailsForm.touched.reasonForAdmission &&
                            //         PastEducationDetailsForm.errors.reasonForAdmission
                            //         ? true
                            //         : false
                            // }
                            // error={
                            //     PastEducationDetailsForm.touched.reasonForAdmission &&
                            //         PastEducationDetailsForm.errors.reasonForAdmission
                            //         ? PastEducationDetailsForm.errors.reasonForAdmission
                            //         : ""
                            // }
                            labelClass="text-muted" />
                </div>

                {/* Footer buttons */}
                {edit && (
                    <div className="tw-flex tw-justify-end tw-gap-3 tw-pt-6">
                        <Button 
                            variant='secondary'
                            type="button"
                            onClick={CancelHandler}
                        >
                            Cancel
                        </Button>

                        <Button 
                            variant='primary'   
                            type="button"
                            onClick={(e: any    ) => PastEducationDetailsForm.handleSubmit(e)}
                        >
                            Update
                        </Button    >
                    </div>
                )}
            </div>
        </div>
    )
}

export default PastEducationDetails
