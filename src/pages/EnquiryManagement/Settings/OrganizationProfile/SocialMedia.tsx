import React, { useState } from 'react'
import * as Yup from 'yup';
import { TextInput } from '../../../../Components/Common';
import { useFormik } from 'formik';
import Button from '../../../../Components/Common/Button';


const SocialMedia = (props: any) => {    
    const initialValues = {
        linkedIn:  ' John Doe',
        facebook: ' HvLg7@example.com',
        twitter: ' 9898989898',
      };
      const validationSchema = Yup.object({
        linkedIn: Yup.string().required('Required'),
        facebook: Yup.string().required('Required'),
        twitter: Yup.string().required('Required'),
      });

    const SocialMediaForm = useFormik({
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
            <div className="tw-flex tw-flex-wrap">
              <div className="tw-mb-3 tw-flex tw-items-center tw-w-full">
                <label htmlFor="linkedIn" className="form-label tw-w-[16.666667%] tw-font-bold">LinkedIn Profile link:</label>
                <TextInput
                    name='linkedIn'
                    value={SocialMediaForm.values.linkedIn}
                      onChange={SocialMediaForm.handleChange}
                      formgroupClassName="tw-w-[50%]"
                      isReadOnly={!props.edit}
                      inputClassName={`${!props.edit ? 'tw-border-0 tw-border-b tw-rounded-none tw-bg-transparent tw-text-gray-500' : "tw-bg-light"}`}
                />
              </div>
              
              <div className="tw-flex tw-items-center tw-mb-3 tw-w-full">
                <label htmlFor="facebook" className="form-label tw-w-[16.666667%] tw-font-bold">Facebook Profile link:</label>
                <TextInput
                    name='facebook'
                    value={SocialMediaForm.values.facebook}
                      onChange={SocialMediaForm.handleChange}
                      formgroupClassName="tw-w-[50%]"
                      isReadOnly={!props.edit}
                      inputClassName={`${!props.edit ? 'tw-border-0 tw-rounded-none tw-border-b tw-bg-transparent tw-text-gray-500' : "tw-bg-light"}`}
                />
              </div>
              
              <div className="tw-flex tw-items-center tw-mb-3 tw-w-full">
                <label htmlFor="twitter" className="form-label tw-w-[16.666667%] tw-font-bold">Twitter Profile link:</label>
                <TextInput
                    name='twitter'
                    value={SocialMediaForm.values.twitter}
                      onChange={SocialMediaForm.handleChange}
                      formgroupClassName="tw-w-[50%]"
                      isReadOnly={!props.edit}
                      inputClassName={`${!props.edit ? 'tw-border-0 tw-rounded-none tw-border-b tw-bg-transparent tw-text-gray-500' : "tw-bg-light"}`}
                />
              </div>

              {props.edit && <div className="tw-flex tw-justify-end tw-gap-x-2 tw-mb-4 tw-w-full">
                    <div className="tw-flex tw-items-center tw-gap-x-2">
                    <Button
                      type="submit"
                      onClick={CancelHandler}
                      variant="secondary"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      onClick={UpdateHandler}
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

export default SocialMedia