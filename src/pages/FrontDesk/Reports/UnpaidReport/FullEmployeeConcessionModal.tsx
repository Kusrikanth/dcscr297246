import React, { useEffect, useState } from 'react'
import { AutoSearchInputUpdated, SelectInput, TextInput } from '../../../../Components/Common';
import { useFormik } from 'formik';
import { generateActionPayload } from '../../../../utility/reduxutility';
import { shallowEqual, useDispatch } from 'react-redux';
import { useAppSelector } from '../../../../hooks/storehook';
import * as Yup from 'yup';
import { getStudentPreadmissionByRegnoAct } from '../../../../store/FrontDesk/AdmissionRegistration/admissionregistrationaction';
import { fullEmployeeConcessionAct } from '../../../../store/fee/feereport/feereportactions';
import Button from '../../../../Components/Common/Button';

const initialValues = {
    academicYearId: "",
    studentRegistrationNo: "",
    className: "",
    curriculumName: "",
}

const validationSchema = Yup.object().shape({
    academicYearId: Yup.string().required("Academic year is required."),
    studentRegistrationNo: Yup.string().required("Student is required."),
});

const FullEmployeeConcessionModal = (props: any) => {
    const dispatch = useDispatch()
    const [searchStudentState, setSearchStudentState] = useState<any>(null);
    const {
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        showApiLoader,
        studentPreadmissionByRegNoResp,
        academicYearListResp,
    }: any = useAppSelector(
        ({ globalData, appData, admissionRegistration, instAcademics }) => ({
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            showApiLoader: globalData.showApiLoader,
            studentPreadmissionByRegNoResp: admissionRegistration.studentPreadmissionByRegNoResp,
            academicYearListResp: instAcademics.academicYearListResp,
        }),
        shallowEqual
    );

    const fullEmployeeConcessionForm = useFormik({
        enableReinitialize: true,
        initialValues,
        validationSchema,
        onSubmit: (values) => {
            dispatch(fullEmployeeConcessionAct(generateActionPayload("full_employee_concession", { id: values.studentRegistrationNo, branchId: props.branchId })));
        },
    });

    useEffect(() => {
        if (props.academicYearId) {
            fullEmployeeConcessionForm.setFieldValue('academicYearId', props.academicYearId);
        }
    }, [props.academicYearId]);

    function onInputSearchChange(inputString: any) {
        const { academicYearId } = fullEmployeeConcessionForm.values;
        if (inputString && academicYearId) {
            const params = {
                branchId,
                academicYearId,
                searchString: inputString,
            };
            dispatch(getStudentPreadmissionByRegnoAct(generateActionPayload("get_preadmission_byregNo", undefined, params)));
        }
    }

    const selectedStudent = (student: any) => {
        setSearchStudentState(student);

        fullEmployeeConcessionForm.setValues(prevValues => ({
            ...prevValues,
            studentRegistrationNo: student ? student?.registrationNo : "",
            className: student ? student?.admissionSoughtShortName : "",
            curriculumName: student ? student?.curriculumName : "",
        }))
    }

    return (
        <>
            <form onSubmit={fullEmployeeConcessionForm.handleSubmit}>

                <div className="tw-p-4">

                    <div className="tw-grid tw-grid-cols-1 tw-gap-4">

                        <div>
                            <SelectInput
                                name="academicYearId"
                                labelClass="required"
                                value={fullEmployeeConcessionForm.values.academicYearId}
                                onChange={fullEmployeeConcessionForm.handleChange}
                                menuItems={academicYearListResp?.data}
                                valueKey="academicYearId"
                                textKey="academicYearName"
                                labelText="Academic Year"
                                invalid={
                                    fullEmployeeConcessionForm.touched.academicYearId &&
                                        fullEmployeeConcessionForm.errors.academicYearId
                                        ? true
                                        : false
                                }
                                error={
                                    fullEmployeeConcessionForm.touched.academicYearId &&
                                        fullEmployeeConcessionForm.errors.academicYearId
                                        ? fullEmployeeConcessionForm.errors.academicYearId
                                        : ""
                                }
                            />
                        </div>

                        <div>
                            <AutoSearchInputUpdated
                                formgroupClassName="tw-relative tw-mb-3"
                                name="studentRegistrationNo"
                                placeHolder="Search..."
                                onChange={(string: any) => {
                                    if (!string)
                                        fullEmployeeConcessionForm.setFieldValue(
                                            "studentRegistrationNo",
                                            ""
                                        );
                                    onInputSearchChange(string);
                                }}
                                onBlur={fullEmployeeConcessionForm.handleBlur}
                                valueKey="registrationNo"
                                labelHeader="Reg. No."
                                labelKey="registrationNo"
                                subLabelHeader="Student Name"
                                subLabelKey="studentName"
                                labelText="Student"
                                labelClass="required"
                                options={studentPreadmissionByRegNoResp || []}
                                selected={searchStudentState}
                                selectedOptionCallbck={selectedStudent}
                                isDisabled={!fullEmployeeConcessionForm.values.academicYearId}
                                invalid={
                                    fullEmployeeConcessionForm.touched.studentRegistrationNo &&
                                        fullEmployeeConcessionForm.errors.studentRegistrationNo
                                        ? true
                                        : false
                                }
                                error={
                                    fullEmployeeConcessionForm.touched.studentRegistrationNo &&
                                        fullEmployeeConcessionForm.errors.studentRegistrationNo
                                        ? fullEmployeeConcessionForm.errors.studentRegistrationNo
                                        : ""
                                }
                            >
                                <i className="ri-search-line tw-absolute tw-right-3 tw-top-1/2 tw--translate-y-1/2 tw-text-gray-400"></i>
                            </AutoSearchInputUpdated>
                        </div>

                        <div>
                            <TextInput
                                name="curriculumName"
                                labelText="Curriculum"
                                value={fullEmployeeConcessionForm.values.curriculumName}
                                onChange={undefined}
                                isDisabled={true}
                            />
                        </div>

                        <div>
                            <TextInput
                                name="className"
                                labelText="Class"
                                value={fullEmployeeConcessionForm.values.className}
                                onChange={undefined}
                                isDisabled={true}
                            />
                        </div>

                    </div>
                </div>

                {/* Footer */}
                <div className="tw-border-t tw-shadow-sm tw-p-4">
                    <div className="tw-flex tw-gap-2 tw-justify-end">

                        <Button
                            type="button"
                            onClick={props.toggle}
                            variant='secondary'
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            disabled={showApiLoader}
                            variant='primary'
                        >
                            Submit
                        </Button>

                    </div>
                </div>

            </form>
        </>
    )
}

export default FullEmployeeConcessionModal