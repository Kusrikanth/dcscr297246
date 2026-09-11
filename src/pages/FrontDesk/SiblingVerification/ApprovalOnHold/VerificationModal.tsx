import React, { useEffect } from 'react'
import { InputCheckbox, SelectInput, TextArea } from '../../../../Components/Common'
import { useFormik } from 'formik'
import { statusOptions } from './helper'
import { shallowEqual, useDispatch } from 'react-redux'
import { editSiblingVerificationStatusByIdAct, getSiblingVerificationListByIdAct } from '../../../../store/FrontDesk/AdmissionManagment/applicationmanagmentaction'
import { generateActionPayload } from '../../../../utility/reduxutility'
import { useAppSelector } from '../../../../hooks/storehook'
import Button from '../../../../Components/Common/Button'

const VerificationModal = ({ toggle,applicationId }: any) => {

    const dispatch=useDispatch();

    const initialValues = {
        status: "",
        remarks: ""
    }
    const formik = useFormik({
        // enableReinitialize: true,
        initialValues: initialValues,
        onSubmit: (values) => {
            dispatch(editSiblingVerificationStatusByIdAct(generateActionPayload('edit_sibling_verification_list_status',{id:applicationId,},{approvedStatus:values.status , remarks:values.remarks})))
        },
    });

    const {
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        getSiblingVerificationListByIdResp
    } = useAppSelector(
        ({ classroomManagmentInfo, assignGroupInfo, instAcademics, branchAcademics, appData, feeConcession, feeCollections, applicationSale }) => ({
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            getSiblingVerificationListByIdResp : applicationSale.getSiblingVerificationListByIdResp,
        }),
        shallowEqual
    );

    const correctionForValues = [
        {
            text: "Docuements",
            value: false
        },
        {
            text: "Photographs",
            value: false
        },
        {
            text: "Signatures",
            value: false
        }
    ]
    useEffect(()=>{
        if(applicationId){
            dispatch(getSiblingVerificationListByIdAct(generateActionPayload('get_sibling_verification_list_by_id',{id:applicationId})))
        }
    },[applicationId])
    return (
        <div>

            {/* Details */}
            <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4 tw-p-4">

                {/* Left */}
                <div className="tw-space-y-2">
                    <div className="tw-grid tw-grid-cols-2">
                        <p>Registration No. :</p>
                        <p>{getSiblingVerificationListByIdResp?.studentRegNo}</p>
                    </div>

                    <div className="tw-grid tw-grid-cols-2">
                        <p>Student Name :</p>
                        <p>{getSiblingVerificationListByIdResp?.studentName}</p>
                    </div>

                    <div className="tw-grid tw-grid-cols-2">
                        <p>Email ID :</p>
                        <p className="tw-break-words">
                            {getSiblingVerificationListByIdResp?.email}
                        </p>
                    </div>

                    <div className="tw-grid tw-grid-cols-2">
                        <p>Contact Person Name :</p>
                        <p>{getSiblingVerificationListByIdResp?.contactPersonName}</p>
                    </div>

                    <div className="tw-grid tw-grid-cols-2">
                        <p>Sibling Student ID :</p>
                        <p>{getSiblingVerificationListByIdResp?.siblingStudentCode}</p>
                    </div>

                    <div className="tw-grid tw-grid-cols-2">
                        <p>Sibling Class :</p>
                        <p>{getSiblingVerificationListByIdResp?.siblingClassShortName}</p>
                    </div>
                </div>

                {/* Right */}
                <div className="tw-space-y-2">
                    <div className="tw-grid tw-grid-cols-2">
                        <p>Academic Year :</p>
                        <p>{getSiblingVerificationListByIdResp?.academicYearName}</p>
                    </div>

                    <div className="tw-grid tw-grid-cols-2">
                        <p>Admission Type :</p>
                        <p>{getSiblingVerificationListByIdResp?.admissionType}</p>
                    </div>

                    <div className="tw-grid tw-grid-cols-2">
                        <p>Phone No :</p>
                        <p>{getSiblingVerificationListByIdResp?.phoneNo}</p>
                    </div>

                    <div className="tw-grid tw-grid-cols-2">
                        <p>Address :</p>
                        <p>{getSiblingVerificationListByIdResp?.address}</p>
                    </div>

                    <div className="tw-grid tw-grid-cols-2">
                        <p>Sibling Name :</p>
                        <p>{getSiblingVerificationListByIdResp?.siblingStudentName}</p>
                    </div>
                </div>

            </div>

            <hr className="tw-m-0 tw-border-gray-300/40" />

            {/* Status / Remarks */}
            <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4 tw-p-4">

                <div className="tw-mb-3">
                    <SelectInput
                        name="status"
                        valueKey="value"
                        textKey="name"
                        menuItems={statusOptions}
                        value={formik.values.status}
                        onChange={formik.handleChange}
                        formgroupClassName="tw-pr-5"
                        labelText="Status"
                    />
                </div>

                {formik.values.status === "REJECTED" && (
                    <div className="tw-mb-3">
                        <TextArea
                            name="remarks"
                            value={formik.values.remarks}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            formgroupClassName="tw-mb-0"
                            labelText="Remarks"
                        />
                    </div>
                )}

            </div>

            {/* Actions */}
            <div className="tw-flex tw-justify-end tw-gap-4 tw-mx-4 tw-my-3">

                <Button
                    type="button"
                    onClick={() => toggle()}
                    variant='secondary'
                >
                    Cancel
                </Button>

                <Button
                    type="submit"
                    onClick={(e: any) => formik.handleSubmit(e)}
                    variant='primary'
                >
                    Submit
                </Button>

            </div>

        </div>
    )
}

export default VerificationModal
