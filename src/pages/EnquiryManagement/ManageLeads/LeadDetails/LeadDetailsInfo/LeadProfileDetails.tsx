import React, { useState } from 'react'
import * as Yup from "yup";
import { Current_Date_YYYYMMDD } from '../../../../../utility/dateutility';
import { DateInput, NewPhoneInput, TextInput } from '../../../../../Components/Common';
import { default as Verified } from "../../../../../assets/imagesdps/academics/Verified.svg?react";
import { useFormik } from 'formik';
import Button from '../../../../../Components/Common/Button';

const LeadProfileDetails = () => {
   
  const initialValues = (data?: any) => {
    return {
        leadOwner : data?.leadOwner || "PIS BACHUPALLY",
        source: data?.source || "Zaheerabad",
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
    <div className='border-top border-bottom'>

            <div className="tw-flex tw-p-2 tw-pb-3 tw-gap-2">
              <div className='tw-flex-grow-1'>
                  <div  className="tw-flex tw-mb-2">
                  <p className="tw-text-gray-500 tw-col-3 tw-mb-0 tw-flex tw-items-center">Lead Owner:</p>
                  <TextInput
                      name='leadOwner'
                      value={LeadDetailsInfoForm.values.leadOwner}
                      onChange={LeadDetailsInfoForm.handleChange}
                      formgroupClassName="tw-font-bold tw-col-6"
                      isReadOnly={!edit}
                      inputClassName={`${!edit ? '!tw-border-0 !tw-rounded-0 !tw-bg-transparent !tw-font-bold' : "!tw-bg-light"}`}
                      />
                  </div>
                  <div className="tw-flex tw-gap-2 tw-mb-2 tw-items-center">
                  <p className="tw-text-gray-500 tw-col-3 tw-mb-0 tw-flex tw-items-center">Source:</p>
                  <TextInput
                      name='source'
                      value={LeadDetailsInfoForm.values.source}
                      onChange={LeadDetailsInfoForm.handleChange}
                      formgroupClassName="tw-font-bold tw-col-6"
                      isReadOnly={!edit}
                      inputClassName={`${!edit ? '!tw-border-0 !tw-rounded-0 !tw-bg-transparent !tw-font-bold' : "!tw-bg-light"}`}
                      />
                  </div>
              </div>
              <div className='tw-ml-auto'>
                  {!edit &&<i className="ri-edit-2-line  edit-icon tw-text-3xl tw-text-blue-500" onClick={handleEditClick}></i>}
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

export default LeadProfileDetails