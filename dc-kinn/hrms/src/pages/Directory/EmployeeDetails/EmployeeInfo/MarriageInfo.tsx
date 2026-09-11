import { useFormik } from 'formik';
import React, { useEffect, useRef, useState } from 'react'
import { shallowEqual, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { DateInput, TextInput } from '../../../../Components/Common';
import { useAppSelector } from '../../../../hooks/storehook';
import { getEmployeeByIdAct } from '../../../../store/directory/employeemanagement/employeemanagementactions';
import { updateStudentAct } from '../../../../store/directory/studentmanagement/studentmanagementactions';
import { generateActionPayload } from '../../../../utility/reduxutility';
import { IPropsTypes, IUpdateEmployeeRepRef } from './EmployeeInfoTypes';
import * as Yup from 'yup';
import { details, formSectionSaveKey } from './helper';
import { Current_Date } from '../../../../utility/dateutility';
import { default as EditSvg } from "../../../../assets/imagesdps/directory/EditSvgIcon.svg?react";
import { AccordionBody, AccordionHeader } from 'reactstrap';
import Button from '../../../../Components/Common/Button';

const MarriageInfo = ({ instituteId, branchId, employeeId, divId, canCreateAndUpdate }: any) => {
    const dispatch = useDispatch();
    const initialValues = (data?: any) => {
        return {
            marriageCertificateNo: data ? data.marriageCertificateNo ? data.marriageCertificateNo : "N/A" : "",
            marriageCertificateDor: data?.marriageCertificateDor || "",
        }
    }

    const [initialData, setInitialData] = useState(initialValues());
    const [edit, setEdit] = useState(false);
    const EditHandler = (event: any) => {
        setEdit(true);
    }
    const { getEmployeeByIdResp, updateStudentResp, affectedSection } = useAppSelector(
        ({ directoryEmployee, directoryStudent, masterData }) => ({
            getEmployeeByIdResp: directoryEmployee.getEmployeeByIdResp,
            updateStudentResp: directoryStudent.updateStudentResp,
            affectedSection: directoryStudent.affectedSection,
        }),
        shallowEqual
    );

    const EmployeeMarriageRef = useRef<IUpdateEmployeeRepRef>({
        prevUpdateEmployeeRep: updateStudentResp
    });
    const getEmployeeDetailsAPI = () => {
        dispatch(getEmployeeByIdAct(generateActionPayload("get_employee_byid", { employeeId: employeeId })));
    }
    const UpdateHandler = () => {
        getEmployeeDetailsAPI();
        setEdit(false);
    }

    const CancelHandler = () => {
        MarriageInfoForm.setValues(initialValues(getEmployeeByIdResp.employeeMarriageInfo)).then(() => {
            MarriageInfoForm.setErrors({});
        });
        setEdit(false);
    }

    useEffect(() => {
        const { prevUpdateEmployeeRep } =
            EmployeeMarriageRef.current;

        if (updateStudentResp &&
            prevUpdateEmployeeRep !== updateStudentResp) {
            if (affectedSection === "Employee Marriage Details") {
                toast.success("Employee Marriage Details Updated successfully.");
                UpdateHandler();
            }
        }
        EmployeeMarriageRef.current.prevUpdateEmployeeRep = updateStudentResp;
    }, [affectedSection, updateStudentResp]);

    const validationSchema = Yup.object().shape({
        marriageCertificateDor: Yup.date().max(Current_Date, "Invalid Date"),

    });

    const MarriageInfoForm = useFormik({
        enableReinitialize: true,
        initialValues: initialData,
        validationSchema,
        onSubmit: (values) => {
            const formData = new FormData();
            const data = details(getEmployeeByIdResp, values, "Employee Marriage Details", { branchId: branchId, instituteId: instituteId }, formSectionSaveKey.marriageDetails);
            formData.append("employeeRequest", JSON.stringify(data));
            dispatch(updateStudentAct(generateActionPayload('add_employee', undefined, formData, {
                affectedSection: "Employee Marriage Details"
            })));
        },
    });
    useEffect(() => {

        getEmployeeByIdResp && setInitialData(initialValues(getEmployeeByIdResp.employeeMarriageInfo));

    }, [getEmployeeByIdResp]);
    return (
        <div>
            <AccordionHeader tag="h4" targetId="marriage-info">
                Marriage Info
            </AccordionHeader>
            <AccordionBody accordionId="marriage-info">
                <div id={divId}>
                    <div className="tw-p-0">

                        <div className="tw-flex tw-flex-wrap tw-mb-2 tw--mx-2">
                            <div className="tw-w-full lg:tw-w-1/2 tw-px-2">
                                <TextInput
                                    name="marriageCertificateNo"
                                    labelText="Certificate No."
                                    value={MarriageInfoForm.values.marriageCertificateNo}
                                    onChange={MarriageInfoForm.handleChange}
                                    onBlur={MarriageInfoForm.handleBlur}
                                    inputClassName={`!tw-bg-transparent ${!edit ? "!tw-border-0 !tw-rounded-none" : ""
                                        }`}
                                    isReadOnly={!edit}
                                    invalid={
                                        MarriageInfoForm.touched.marriageCertificateNo &&
                                            MarriageInfoForm.errors.marriageCertificateNo
                                            ? true
                                            : false
                                    }
                                    error={
                                        MarriageInfoForm.touched.marriageCertificateNo &&
                                            MarriageInfoForm.errors.marriageCertificateNo
                                            ? MarriageInfoForm.errors.marriageCertificateNo
                                            : ""
                                    }
                                    labelClass="tw-font-semibold tw-text-sm tw-mb-0"
                                    formgroupClassName="tw-mb-4 tw-flex tw-items-center input-field"
                                />
                            </div>
                            <div className="tw-w-full lg:tw-w-1/2 tw-px-2">
                                <DateInput
                                    name="marriageCertificateDor"
                                    value={MarriageInfoForm.values.marriageCertificateDor}
                                    onChange={MarriageInfoForm.handleChange}
                                    onBlur={MarriageInfoForm.handleBlur}
                                    inputClassName={`!tw-bg-transparent ${!edit ? "!tw-border-0 !tw-rounded-none" : ""
                                        }`}
                                    isReadOnly={!edit}
                                    formgroupClassName="tw-mb-4 tw-flex tw-items-center input-field"
                                    labelText="Date of Registration"
                                    maxDate={Current_Date}
                                    invalid={
                                        MarriageInfoForm.touched.marriageCertificateDor &&
                                            MarriageInfoForm.errors.marriageCertificateDor
                                            ? true
                                            : false
                                    }
                                    error={
                                        MarriageInfoForm.touched.marriageCertificateDor &&
                                            MarriageInfoForm.errors.marriageCertificateDor
                                            ? MarriageInfoForm.errors.marriageCertificateDor
                                            : ""
                                    }
                                    labelClass="tw-font-semibold tw-text-sm tw-mb-0"
                                />
                            </div>
                        </div>

                        {canCreateAndUpdate && <>{!edit && (
                            <div className="tw-flex tw-justify-end">
                                <Button
                                    variant='hoverInfo'
                                    onClick={EditHandler}
                                >
                                    <i className="ri-pencil-line tw-mr-2 tw-text-base"></i>
                                    Edit
                                </Button>
                            </div>
                        )}

                        {edit && (
                            <div className="tw-flex tw-justify-end tw-gap-3 tw-pl-4 tw-pb-3">
                                <Button
                                    variant='secondary'
                                    onClick={CancelHandler}
                                >
                                    Cancel
                                </Button>

                                <Button
                                    variant='primary'
                                    onClick={(e: any) => MarriageInfoForm.handleSubmit(e)}
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

export default MarriageInfo
