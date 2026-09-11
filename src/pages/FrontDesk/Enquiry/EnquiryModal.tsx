import { useFormik } from 'formik'
import { useEffect } from 'react'
import { shallowEqual, useDispatch } from 'react-redux'
import { SelectInput, TextInput } from '../../../Components/Common'
import { useAppSelector } from '../../../hooks/storehook'
import { getEnquiryDetailsByIdAct, resetEnquiryDetailsById, setUpdateEnquiryStatusAct } from '../../../store/FrontDesk/AdmissionManagment/applicationmanagmentaction'
import { generateActionPayload } from '../../../utility/reduxutility'
import { newStatusOptions } from './helper'
import * as Yup from "yup"
import Button from '../../../Components/Common/Button'

const EnquiryModal = ({ isOpen, toggle, enquiryId }: any) => {

    const dispatch = useDispatch();

    const initialValues = {
        enquiryStatus : "",
        remarks: ""
    }
    const formik = useFormik({
        initialValues: initialValues,
        validationSchema : Yup.object().shape({
            enquiryStatus: Yup.string().required("Status is required.").nullable(),
        }),
        onSubmit: (values) => {
            dispatch(setUpdateEnquiryStatusAct(generateActionPayload('update_enquiry_status', { enquiryId: enquiryId, ...values })))
        },
    })

    const {
        enquiryByIdResp,
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        showApiLoader,
    } = useAppSelector(
        ({ globalData,  appData, applicationSale }) => ({
            enquiryByIdResp: applicationSale.enquiryByIdResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            showApiLoader: globalData.showApiLoader,
        }),
        shallowEqual
    );

    useEffect(() => {
        if (enquiryId) {
            dispatch(getEnquiryDetailsByIdAct(generateActionPayload('get_enquiry_details_by_id', { enquiryId: enquiryId })))
        }
    }, [enquiryId])

    useEffect(() => {
        if (enquiryByIdResp) {
            const { enquiryStatus , remarks } = enquiryByIdResp || {}
            formik.setFieldValue("enquiryStatus",enquiryStatus ?? "")
            formik.setFieldValue("remarks", remarks ?? "");
        }
    }, [enquiryByIdResp])

    useEffect(() => {
        return () => {
            dispatch(resetEnquiryDetailsById(undefined));
        }
    }, [])

    return (
        <div>
            <div className="tw-flex tw-flex-wrap tw-p-4">
                {/* Left column */}
                <div className="tw-w-1/2">
                    {[
                        ["Academic Year :", enquiryByIdResp?.academicYear],
                        ["Contact Person Name :", enquiryByIdResp?.parentName],
                        ["Phone No :", enquiryByIdResp?.contactNumber],
                        ["DOB :", enquiryByIdResp?.dob],
                        ["Mother Contact No :", enquiryByIdResp?.motherContactNumber ?? "N/A"],
                        ["Source :", enquiryByIdResp?.source ?? "N/A"],
                    ].map(([label, value], idx) => (
                        <div key={idx} className="tw-flex tw-mb-2">
                            <div className="tw-w-1/2">
                                <p>{label}</p>
                            </div>
                            <div className="tw-w-1/2 tw-truncate">
                                <p>{value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Right column */}
                <div className="tw-w-1/2">
                    {[
                        ["Curriculum Type :", enquiryByIdResp?.curriculumName],
                        ["Email ID :", enquiryByIdResp?.emailId],
                        ["Student Name :", enquiryByIdResp?.studentName],
                        ["Father Contact No :", enquiryByIdResp?.fatherContactNumber ?? "N/A"],
                        ["Last Studied School :", enquiryByIdResp?.lastStudiedSchool ?? "N/A"],
                        ["Address :", enquiryByIdResp?.address ?? "N/A"],
                    ].map(([label, value], idx) => (
                        <div key={idx} className="tw-flex tw-mb-2">
                            <div className="tw-w-1/2">
                                <p>{label}</p>
                            </div>
                            <div className="tw-w-1/2">
                                <p>{value}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Divider */}
            <hr className="tw-border-t tw-border-gray-300 tw-m-0 tw-opacity-30" />

            {/* Form section */}
            <div className="tw-flex  tw-flex-row tw-gap-3 tw-p-4 tw-pb-2">
                <div className="tw-w-1/2">
                    <SelectInput
                        name="enquiryStatus"
                        value={formik.values.enquiryStatus}
                        onChange={formik.handleChange}
                        menuItems={newStatusOptions}
                        valueKey="id"
                        textKey="name"
                        formgroupClassName="tw-mb-0"
                        onBlur={formik.handleBlur}
                        labelText="Status"
                        defaultSelect="Select"
                        invalid={
                            formik.touched.enquiryStatus && formik.errors.enquiryStatus
                                ? true
                                : false
                        }
                        error={
                            formik.touched.enquiryStatus && formik.errors.enquiryStatus
                                ? formik.errors.enquiryStatus
                                : ""
                        }
                    />
                </div>

                <div className="tw-w-1/2">
                    <TextInput
                        name="remarks"
                        labelText="Remarks"
                        value={formik.values?.remarks}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </div>
            </div>

            {/* Actions */}
            <div className="tw-flex">
                <div className="tw-ml-auto tw-flex tw-gap-2 tw-mx-4 tw-mb-3">
                    <Button
                        type="button"
                        onClick={toggle}
                        variant='secondary'
                    >
                        Cancel
                    </Button>

                    <Button
                        type="submit"
                        disabled={showApiLoader}
                        onClick={(event: any) => formik.handleSubmit(event)}
                        variant='primary'
                    >
                        Submit
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default EnquiryModal
