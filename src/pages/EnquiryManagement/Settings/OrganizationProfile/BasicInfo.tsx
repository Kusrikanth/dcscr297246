import React, { useState } from 'react'
import * as Yup from 'yup';
import { TextInput } from '../../../../Components/Common';
import { useFormik } from 'formik';
import Button from '../../../../Components/Common/Button';


const BasicInfo = (props: any) => {
    
    const initialValues = {
        contactPerson:  ' John Doe',
        email: ' HvLg7@example.com',
        phone: ' 9898989898',
        websiteURL: ' www.abc.com',
        country: ' India',
        state: ' Karnataka',
        city: ' Bangalore',
        zipCode: ' 560001',
        timeZone: ' Asia/Kolkata',
        address: ' Mysore Road',
        otherInformation: ' Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      };
      const validationSchema = Yup.object({
        contactPerson: Yup.string().required('Required'),
        email: Yup.string().email('Invalid email format').required('Required'),
        phone: Yup.string().required('Required'),
        websiteURL: Yup.string().url('Invalid URL'),
        country: Yup.string().required('Required'),
        state: Yup.string().required('Required'),
        city: Yup.string().required('Required'),
        zipCode: Yup.string().required('Required'),
        timeZone: Yup.string().required('Required'),
        address: Yup.string().required('Required'),
      });

    const BasicInfoForm = useFormik({
        enableReinitialize: true,
        initialValues: initialValues,
        validationSchema,
        onSubmit: (values) => {

        }})

        const UpdateHandler = () => {
            props.setEdit(false);
        }
        const CancelHandler = () => {
        
          props.setEdit(false);
      }

  return (
    <div className="container tw-mt-2">
            <div className="row">
              <div className="tw-mb-3 tw-flex tw-items-center">
                <label htmlFor="contactPerson" className="form-label tw-w-[16.666667%] tw-font-bold">Contact Person:</label>
                <TextInput
                    name='contactPerson'
                    value={BasicInfoForm.values.contactPerson}
                      onChange={BasicInfoForm.handleChange}
                      formgroupClassName="tw-w-[50%]"
                      isReadOnly={!props.edit}
                      inputClassName={`${!props.edit ? 'tw-border-0 tw-rounded-0 tw-bg-transparent tw-text-gray-500' : "tw-bg-light"}`}
                />
              </div>
              
              <div className="tw-mb-3 tw-flex tw-items-center">
                <label htmlFor="email" className="form-label tw-w-[16.666667%] tw-font-bold">Email:</label>
                <TextInput
                    name='email'
                    value={BasicInfoForm.values.email}
                      onChange={BasicInfoForm.handleChange}
                      formgroupClassName="tw-w-[50%]"
                      isReadOnly={!props.edit}
                      inputClassName={`${!props.edit ? 'tw-border-0 tw-rounded-0 tw-bg-transparent tw-text-gray-500' : "tw-bg-light"}`}
                />
              </div>
              
              <div className="tw-mb-3 tw-flex tw-items-center">
                <label htmlFor="phone" className="form-label tw-w-[16.666667%] tw-font-bold">Phone:</label>
                <TextInput
                    name='phone'
                    value={BasicInfoForm.values.phone}
                      onChange={BasicInfoForm.handleChange}
                      formgroupClassName="tw-w-[50%]"
                      isReadOnly={!props.edit}
                      inputClassName={`${!props.edit ? 'tw-border-0 tw-rounded-0 tw-bg-transparent tw-text-gray-500' : "tw-bg-light"}`}
                />
              </div>

              <div className="tw-mb-3 tw-flex tw-items-center">
                <label htmlFor="websiteURL" className="form-label tw-w-[16.666667%] tw-font-bold">Website URL:</label>
                <TextInput
                    name='websiteURL'
                    value={BasicInfoForm.values.websiteURL}
                      onChange={BasicInfoForm.handleChange}
                      formgroupClassName="tw-w-[50%]"
                      isReadOnly={!props.edit}
                      inputClassName={`${!props.edit ? 'tw-border-0 tw-rounded-0 tw-bg-transparent tw-text-gray-500' : "tw-bg-light"}`}
                />
              </div>

              <div className="tw-mb-3 tw-flex tw-items-center">
                <label htmlFor="country" className="form-label tw-w-[16.666667%] tw-font-bold">Country:</label>
                <TextInput
                    name='country'
                    value={BasicInfoForm.values.country}
                      onChange={BasicInfoForm.handleChange}
                      formgroupClassName="tw-w-[50%]"
                      isReadOnly={!props.edit}
                      inputClassName={`${!props.edit ? 'tw-border-0 tw-rounded-0 tw-bg-transparent tw-text-gray-500' : "tw-bg-light"}`}
                />
              </div>

              <div className="tw-mb-3 tw-flex tw-items-center">
                <label htmlFor="state" className="form-label tw-w-[16.666667%] tw-font-bold">State:</label>
                <TextInput
                    name='state'
                    value={BasicInfoForm.values.state}
                      onChange={BasicInfoForm.handleChange}
                      formgroupClassName="tw-w-[50%]"
                      isReadOnly={!props.edit}
                      inputClassName={`${!props.edit ? 'tw-border-0 tw-rounded-0 tw-bg-transparent tw-text-gray-500' : "tw-bg-light"}`}
                />
              </div>

              <div className="tw-mb-3 tw-flex tw-items-center">
                <label htmlFor="city" className="form-label tw-w-[16.666667%] tw-font-bold">City:</label>
                <TextInput
                    name='city'
                    value={BasicInfoForm.values.city}
                      onChange={BasicInfoForm.handleChange}
                      formgroupClassName="tw-w-[50%]"
                      isReadOnly={!props.edit}
                      inputClassName={`${!props.edit ? 'tw-border-0 tw-rounded-0 tw-bg-transparent tw-text-gray-500' : "tw-bg-light"}`}
                />
              </div>

              <div className="tw-mb-3 tw-flex tw-items-center">
                <label htmlFor="zipCode" className="form-label tw-w-[16.666667%] tw-font-bold">Zip Code:</label>
                <TextInput
                    name='zipCode'
                    value={BasicInfoForm.values.zipCode}
                      onChange={BasicInfoForm.handleChange}
                      formgroupClassName="tw-w-[50%]"
                      isReadOnly={!props.edit}
                      inputClassName={`${!props.edit ? 'tw-border-0 tw-rounded-0 tw-bg-transparent tw-text-gray-500' : "tw-bg-light"}`}
                />
              </div>

              <div className="tw-mb-3 tw-flex tw-items-center">
                <label htmlFor="timeZone" className="form-label tw-w-[16.666667%] tw-font-bold">Time Zone:</label>
                <TextInput
                    name='timeZone'
                    value={BasicInfoForm.values.timeZone}
                      onChange={BasicInfoForm.handleChange}
                      formgroupClassName="tw-w-[50%]"
                      isReadOnly={!props.edit}
                      inputClassName={`${!props.edit ? 'tw-border-0 tw-rounded-0 tw-bg-transparent tw-text-gray-500' : "tw-bg-light"}`}
                />
              </div>

              <div className="tw-mb-3 tw-flex tw-items-center">
                <label htmlFor="address" className="form-label tw-w-[16.666667%] tw-font-bold">Address:</label>
                <TextInput
                    name='address'
                    value={BasicInfoForm.values.address}
                      onChange={BasicInfoForm.handleChange}
                      formgroupClassName="tw-w-[50%]"
                      isReadOnly={!props.edit}
                      inputClassName={`${!props.edit ? 'tw-border-0 tw-rounded-0 tw-bg-transparent tw-text-gray-500' : "tw-bg-light"}`}
                />
              </div>

              <div className="tw-mb-3 tw-flex tw-items-center">
                <label htmlFor="otherInformation" className="form-label tw-w-[16.666667%] tw-font-bold">Other Information:</label>
                <TextInput
                    name='otherInformation'
                    value={BasicInfoForm.values.otherInformation}
                      onChange={BasicInfoForm.handleChange}
                      formgroupClassName="tw-w-[50%]"
                      isReadOnly={!props.edit}
                      inputClassName={`${!props.edit ? 'tw-border-0 tw-rounded-0 tw-bg-transparent tw-text-gray-500' : "tw-bg-light"}`}
                />
              </div>

              {props.edit && <div className="tw-flex tw-justify-end tw-gap-x-2 tw-mb-4">
                    <div className="tw-flex tw-items-center tw-gap-x-2">
                        <Button
                          type="submit"
                          onClick={CancelHandler}
                          // disabled={showApiLoader}
                          variant="secondary"
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          onClick={UpdateHandler}
                          // disabled={showApiLoader}
                          variant="primary"
                        >
                          Save
                        </Button>
                    </div>
                </div>}
            </div>
    </div>
  )
}

export default BasicInfo