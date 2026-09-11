import React, { useState } from 'react'
import * as Yup from "yup";
import { Current_Date_YYYYMMDD } from '../../../../../utility/dateutility';
import { DateInput, TextInput } from '../../../../../Components/Common';
import { useFormik } from 'formik';
import Button from '../../../../../Components/Common/Button';

const ParenetDetails = () => {
    const MinDate_YYYYMMDD = "01-01-1970"
    const validationSchema = Yup.object().shape({
        parentName: Yup.string().required("Parent Name is required."),
        dob: Yup.date().min(MinDate_YYYYMMDD, `DOB should be more than ${MinDate_YYYYMMDD}.`).max(Current_Date_YYYYMMDD, `DOB should be less than current date.`).required("Select dob."),
        admissionType: Yup.string().required("Place of Birth is required."),
        contactNo: Yup.string().trim().matches(/^[0-9]{10,10}$/, 'Contact number with 10 digit is valid.').required("Phone number required.").nullable(),
    });
  const initialValues = (data?: any) => {
    return {
        parentName : data?.parentName || "Gitika Kalasthi",
        dob: data?.dob || Current_Date_YYYYMMDD,
        admissionType: data?.admissionType || "N/A",
        contactNo: data?.contactNo || "N/A",
    }
}

    const [edit, setEdit] = useState(false);
    const [initialData, setInitialData] = useState(initialValues());
    const LeadDetailsInfoForm = useFormik({
        enableReinitialize: true,
        initialValues: initialData,
        validationSchema,
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
                  <div className="tw-grid tw-grid-cols-12 tw-mb-2">
                      <p className="tw-text-gray-500 tw-col-span-5 tw-mb-0 tw-flex tw-items-center">Name of the Parent:</p>
                      <TextInput
                      name='parentName'
                      value={LeadDetailsInfoForm.values.parentName}
                      onChange={LeadDetailsInfoForm.handleChange}
                      formgroupClassName="tw-font-bold tw-col-span-6"
                      isReadOnly={!edit}
                      inputClassName={`${!edit ? '!tw-border-0 !tw-rounded-0 !tw-bg-transparent' : "!tw-bg-light"}`}
                      invalid={
                        LeadDetailsInfoForm.touched.parentName &&
                        LeadDetailsInfoForm.errors.parentName
                            ? true
                            : false
                        }
                      error={
                        LeadDetailsInfoForm.touched.parentName &&
                        LeadDetailsInfoForm.errors.parentName
                            ? LeadDetailsInfoForm.errors.parentName
                            : ""
                          }
                      />
                  </div>
                  <div className="tw-grid tw-grid-cols-12 tw-mb-2">
                      <p className="tw-text-gray-500 tw-col-span-5 tw-mb-0 tw-flex tw-items-center">DOB:</p>
                      <DateInput 
                        name='dob' 
                        value={LeadDetailsInfoForm.values.dob} 
                        onChange={LeadDetailsInfoForm.handleChange}
                        formgroupClassName="tw-font-bold tw-col-span-6"
                        isReadOnly={!edit}
                        inputClassName={`${!edit ? '!tw-border-0 !tw-rounded-0 !tw-bg-transparent' : "!tw-bg-light"}`}
                        invalid={
                          LeadDetailsInfoForm.touched.dob &&
                            LeadDetailsInfoForm.errors.dob
                            ? true
                            : false
                        }
                        error={
                          LeadDetailsInfoForm.touched.dob &&
                            LeadDetailsInfoForm.errors.dob
                            ? LeadDetailsInfoForm.errors.dob
                            : ""
                        }
                      />
                  </div>
                  <div className="tw-grid tw-grid-cols-12 tw-mb-2">
                      <p className="tw-text-gray-500 tw-col-span-5 tw-mb-0 tw-flex tw-items-center">Admission Type:</p>
                      <TextInput
                      name='admissionType'
                      value={LeadDetailsInfoForm.values.admissionType}
                      onChange={LeadDetailsInfoForm.handleChange}
                      formgroupClassName="tw-font-bold tw-col-span-6"
                      isReadOnly={!edit}
                      inputClassName={`${!edit ? '!tw-border-0 !tw-rounded-0 !tw-bg-transparent' : "!tw-bg-gray-100"}`}
                      invalid={
                        LeadDetailsInfoForm.touched.admissionType &&
                        LeadDetailsInfoForm.errors.admissionType
                            ? true
                            : false
                        }
                      error={
                        LeadDetailsInfoForm.touched.admissionType &&
                        LeadDetailsInfoForm.errors.admissionType
                            ? LeadDetailsInfoForm.errors.admissionType
                            : ""
                          }
                      />
                  </div>
                  <div className="tw-grid tw-grid-cols-12 tw-mb-2">
                      <p className="tw-text-gray-500 tw-col-span-5 tw-mb-0 tw-flex tw-items-center">Alternate MObile Number:</p>
                      <TextInput
                      name='contactNo'
                      value={LeadDetailsInfoForm.values.contactNo}
                      onChange={LeadDetailsInfoForm.handleChange}
                      formgroupClassName="tw-font-bold tw-col-span-6"
                      isReadOnly={!edit}
                      inputClassName={`${!edit ? '!tw-border-0 !tw-rounded-0 !tw-bg-transparent ' : "!tw-bg-gray-100"}`} 
                      invalid={
                        LeadDetailsInfoForm.touched.contactNo &&
                        LeadDetailsInfoForm.errors.contactNo
                            ? true
                            : false
                        }
                      error={
                        LeadDetailsInfoForm.touched.contactNo &&
                        LeadDetailsInfoForm.errors.contactNo
                            ? LeadDetailsInfoForm.errors.contactNo
                            : ""
                          }
                       />
                  </div>
              </div>
              <div className=' tw-ml-auto'>
                  {!edit &&<i className="ri-edit-2-line  edit-icon tw-text-3xl tw-text-blue-500" onClick={handleEditClick}></i>}
              </div>
          </div>
              {edit && <div className="tw-grid tw-grid-cols-12">
                    <div className="tw-col-span-12 tw-ml-auto tw-flex tw-pl-4  tw-gap-3 tw-mr-2 tw-pb-3">
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

export default ParenetDetails