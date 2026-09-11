import React, { useState } from 'react'
import * as Yup from "yup";
import { Current_Date_YYYYMMDD } from '../../../../../utility/dateutility';
import { DateInput, NewPhoneInput, TextInput } from '../../../../../Components/Common';
import { default as Verified } from "../../../../../assets/imagesdps/academics/Verified.svg?react";
import { useFormik } from 'formik';
import { HugeiconsIcon } from '@hugeicons/react';
import { Building03Icon, CallIcon, Location01Icon, Mail01Icon } from '@hugeicons-pro/core-stroke-standard';
import Button from '../../../../../Components/Common/Button';

const ContactDetails = () => {
   
  const initialValues = (data?: any) => {
    return {
        buildingName : data?.buildingName || "PIS BACHUPALLY",
        location: data?.location || "Zaheerabad",
        email: data?.admissionType || "HvLg7@example.com",
        contactNo: data?.contactNo || "9898989898",
    }
}

    const [edit, setEdit] = useState(false);
    const [initialData, setInitialData] = useState(initialValues());
    const LeadDetailsInfoForm = useFormik({
        enableReinitialize: true,
        initialValues: initialData,
        onSubmit: (values) => {

        }})
        const UpdateHandler = () => {
          setEdit(false);
      }
      const CancelHandler = () => {
        // studentDetailsForm.setValues(initialValues(getStudentByIdResp.studentDetails)).then(() => {
        //     studentDetailsForm.setErrors({});
        // });
        setEdit(false);
    }
      const handleEditClick = () => {
        setEdit(true);
      };

  return (
    <div className='tw-border-t tw-border-b'>

            <div className="tw-flex tw-p-2 tw-pb-3 tw-gap-2">
              <div className='tw-flex-grow'>
                  <div className="tw-flex tw-gap-2 tw-mb-2 tw-items-center">
                    <HugeiconsIcon icon={Building03Icon} className="tw-text-gray-500" size={18} />
                      <TextInput
                      name='buildingName'
                      value={LeadDetailsInfoForm.values.buildingName}
                      onChange={LeadDetailsInfoForm.handleChange}
                      formgroupClassName="tw-font-bold tw-w-1/2"
                      isReadOnly={!edit}
                      inputClassName={`${!edit ? '!tw-border-0 !tw-rounded-none !tw-bg-transparent !tw-text-gray-500' : "!tw-bg-gray-100"}`}
                      />
                  </div>
                  <div className="tw-flex tw-gap-2 tw-mb-2 tw-items-center">
                    <HugeiconsIcon icon={Location01Icon} className="tw-text-gray-500" size={18} />
                      <TextInput
                      name='location'
                      value={LeadDetailsInfoForm.values.location}
                      onChange={LeadDetailsInfoForm.handleChange}
                      formgroupClassName="tw-font-bold tw-w-1/2"
                      isReadOnly={!edit}
                      inputClassName={`${!edit ? '!tw-border-0 !tw-rounded-none !tw-bg-transparent !tw-text-gray-500' : "!tw-bg-gray-100"}`}
                      />
                  </div>
                  <div className="tw-flex tw-gap-2 tw-mb-2 tw-items-center">
                    <HugeiconsIcon icon={Mail01Icon} className="tw-text-gray-500" size={18} />
                      <TextInput
                      name='email'
                      value={LeadDetailsInfoForm.values.email}
                      onChange={LeadDetailsInfoForm.handleChange}
                      formgroupClassName="tw-font-bold tw-w-1/2"
                      isReadOnly={!edit}
                      inputClassName={`${!edit ? '!tw-border-0 !tw-rounded-none !tw-bg-transparent !tw-text-gray-500' : "!tw-bg-gray-100"}`}
                      />
                      <div className='tw-flex tw-items-center'>
                          <Verified className='tw-ml-1 tw-text-emerald-500 ' />
                          <p className='tw-mb-0 tw-text-gray-500 tw-text-[10px]'>Verified</p>
                      </div>
                  </div>
                  <div className="tw-flex tw-gap-2 tw-mb-2 tw-items-center">
                    <HugeiconsIcon icon={CallIcon} className="tw-text-gray-500" size={18} />
                      <TextInput
                      name='contactNo'
                      value={LeadDetailsInfoForm.values.contactNo}
                      onChange={LeadDetailsInfoForm.handleChange}
                      formgroupClassName="tw-font-bold tw-w-1/2"
                      isReadOnly={!edit}
                      inputClassName={`${!edit ? '!tw-border-0 !tw-rounded-none !tw-bg-transparent !tw-text-gray-500' : "!tw-bg-gray-100"}`}
                      />
                      <div className='tw-flex tw-items-center'>
                          <Verified className='tw-ml-1 tw-text-emerald-500 ' />
                          <p className='tw-mb-0 tw-text-gray-500 tw-text-[10px]'>Verified</p>
                      </div>
                  </div>
              </div>
              <div className='tw-ml-auto'>
                  {!edit &&<i className="ri-edit-2-line edit-icon tw-text-3xl tw-text-blue-500" onClick={handleEditClick}></i>}
              </div>
          </div>
              {edit && <div className="tw-flex tw-flex-wrap">
                    <div className="tw-w-auto tw-ml-auto tw-flex tw-pl-4 tw-pb-3 tw-gap-3 tw-mr-2">
                        <Button variant='secondary' type="button" onClick={CancelHandler}>
                            Cancel
                        </Button>
                        <Button variant='primary' type="submit" onClick={UpdateHandler}>
                            Update
                        </Button>
                    </div>
                </div>}

    </div>
  )
}

export default ContactDetails