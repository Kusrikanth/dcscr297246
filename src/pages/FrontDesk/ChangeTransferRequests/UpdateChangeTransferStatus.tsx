import React, { useEffect, useState,useMemo } from 'react'
import { SelectInput, TextInput } from '../../../Components/Common'
import { useFormik } from 'formik'
import { shallowEqual, useDispatch } from 'react-redux'
import { updateStatusChangeTransferAct } from '../../../store/FrontDesk/AdmissionManagment/applicationmanagmentaction'
import { generateActionPayload } from '../../../utility/reduxutility'
import { useAppSelector } from '../../../hooks/storehook'
import * as Yup from "yup";
import { statusList } from './helper'
import DefaultStudentImage from "../../../assets/imagesdps/student-default-img.png";
import Button from '../../../Components/Common/Button';

interface initialValue {
    followUpRemarks : string;
    followUpStatus : string;
}

const initialValue: initialValue = {
    followUpStatus: "",
    followUpRemarks: "",
};


const UpdateChangeTransferStatus = ({ toggle,data,isOpen }: any) => {

    const dispatch = useDispatch()

    const validationSchema =  Yup.object().shape({
        followUpStatus: Yup.string().nullable().required("Status is required."),
        followUpRemarks: Yup.string().nullable().required("Remarks is required."),     
    });
    const formik = useFormik({
        initialValues:initialValue,
        validationSchema,
        enableReinitialize: true,
        onSubmit: (values) => {

            dispatch(updateStatusChangeTransferAct(generateActionPayload("update_status_change_transfer_req", {id : data?.id}, {...values})));            
        },
    });

    const {
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        showApiLoader,
    }: any = useAppSelector(
        ({ globalData, appData }) => ({
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            showApiLoader:globalData.showApiLoader,
        }),
        shallowEqual
    );

    useEffect(() => {
      if(isOpen && data){
        formik.setValues((prev: any) => ({ ...prev, followUpStatus: data?.followUpStatus, followUpRemarks: data?.followUpRemarks }))
      }
    }, [isOpen])

         const changeHandler = (e:any)=>{
            const { name , value } = e.target;
            formik.setValues((prev: any) => ({ ...prev, [name]: value }))
         }
    return (
        <div>
            <div className="tw-flex tw-items-center tw-justify-center tw-flex-col tw-mt-4">
                    <div
                        className={
                            `tw-w-16 tw-h-16 ` +
                            "tw-shrink-0 tw-rounded-full tw-mr-2"
                        }
                    >
                        <img
                            src={data?.studentImageURL || DefaultStudentImage }
                            className="tw-w-full tw-h-full tw-block tw-rounded-full tw-object-cover"
                            style={{ border: "1px solid grey" }}
                        />

                    </div>
                    <div className="tw-font-bold tw-mt-2">
                        {data?.studentName}
                    </div>
                    <div className="tw-text-[#405189] tw-mt-1">
                    {data?.registrationNo}
                    </div>
                </div>
            <div className='tw-grid tw-grid-cols-1 tw-gap-4 tw-px-4 tw-mt-4'>
   
                               
                                <div className="tw-col-span-1">
                                    <SelectInput
                                        name="followUpStatus"
                                        value={formik.values.followUpStatus}
                                        onChange={changeHandler}
                                        menuItems={statusList || []}
                                        valueKey="id"
                                        textKey="name"
                                        // inputClassName="border-0"
                                        formgroupClassName="tw-mb-0"
                                        onBlur={formik.handleBlur}
                                        labelText='Status'
                                        defaultSelect="Select"
                                        invalid={(formik.touched.followUpStatus && formik.errors.followUpStatus) ? true : false}
                                        error={(formik.touched.followUpStatus && formik.errors.followUpStatus) ? formik.errors.followUpStatus as string : ""}
                                    />
                                </div>

                                <div className="tw-col-span-1">
                                <TextInput
                                    name="followUpRemarks"
                                    labelText="Remarks"
                                    inputClassName="tw-mt-2"
                                    value={formik.values?.followUpRemarks}
                                    onChange={changeHandler}
                                    onBlur={formik.handleBlur}
                                    invalid={(formik.touched.followUpRemarks && formik.errors.followUpRemarks) ? true : false}
                                    error={(formik.touched.followUpRemarks && formik.errors.followUpRemarks) ? formik.errors.followUpRemarks as string : ""}
                                />
                          
                            </div>
            </div>
      
            <div className='tw-flex tw-justify-end tw-items-center tw-px-4 tw-my-4 tw-gap-3'>
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => toggle()}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        variant="primary"
                        onClick={() => { formik.handleSubmit()}}
                        disabled={showApiLoader}
                    >
                        Submit
                    </Button>
            </div>
        </div >
    )
}

export default UpdateChangeTransferStatus
