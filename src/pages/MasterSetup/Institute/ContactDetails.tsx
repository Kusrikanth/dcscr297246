import React, { useState, useEffect, useRef } from "react";
import { shallowEqual } from "react-redux";
import { useFormik } from 'formik';
import * as Yup from "yup";
import { toast } from "react-toastify";
//Common Component
import { TextIconInput, TextInput, PhoneInput } from "../../../Components/Common";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";

//Generate Action
import { generateActionPayload } from "../../../utility/reduxutility";
import { getInstByIdAct, updateInstByIdAct } from "../../../store/mastersettings/instituteinfo/instituteinfoactions";

//Helper
import { getInstituteDetails } from "./helper";

//Types
import { IInstituteProps } from "./institutetypes";
//Utility
import { NAME_REGEX } from "../../../utility/validationutility";
import Button from "../../../Components/Common/Button";

const validationSchema = Yup.object().shape({
  contactPersonFirstName: Yup.string().required("Contact person first name required.").matches(NAME_REGEX, "Enter a valid name with space."),
  contactPersonLastName: Yup.string().required("Contact person last name required.").matches(NAME_REGEX, "Enter a valid name with space."),
  contactPerEmailId: Yup.string().email('Invalid Email.').required('Email is required.').nullable(),
  contactPersonPhoneNo: Yup.string().trim().matches(/^[0-9]{10,10}$/, 'Mobile number with 10 digit is valid.').required("Phone number required.").nullable(),

});

const ContactDetails: React.FC<IInstituteProps> = ({ instituteId }) => {
  const [contactDetailsState, setContactDetailsState] = useState<any>(getInstituteDetails(null));
  const dispatch = useAppDispatch();
  const { instDetailsResp, updateInstResp, instInfoError } = useAppSelector(({ instituteInfo }) => ({
    instDetailsResp: instituteInfo.instDetailsResp,
    updateInstResp: instituteInfo.updateInstResp,
    instInfoError: instituteInfo.instInfoError
  }), shallowEqual);
  const instituteRespRef = useRef<any>({
    prevUpdateInstResp: updateInstResp,
    prevInstInfoError: instInfoError
  });
  // Component did mount
  useEffect(() => {
    if (instDetailsResp) {
      const contactDetails = getInstituteDetails(instDetailsResp);
      setContactDetailsState((prevState: any) => ({
        ...prevState, ...contactDetails
      }));
      setContactDetailsState((prevState: any) => ({ ...prevState, ...instDetailsResp }));
      contactForm.resetForm();
    }
  }, [instDetailsResp]);
  //Component Did update
  useEffect(() => {
    const { prevUpdateInstResp, prevInstInfoError } = instituteRespRef.current;
    if (updateInstResp && updateInstResp !== prevUpdateInstResp) {
      toast.success("Contact person info updated successfully.");
      const params = { instituteId };
      dispatch(getInstByIdAct(generateActionPayload("get_inst_details", params)));
    } else if (instInfoError && prevInstInfoError !== instInfoError) {
      const { details }: any = instInfoError;
      toast.error(details);
    }
    instituteRespRef.current.prevUpdateInstResp = updateInstResp;
    instituteRespRef.current.prevInstInfoError = instInfoError;
  }, [updateInstResp, instInfoError]);

  // Institute Form
  const contactForm = useFormik({
    enableReinitialize: true,
    initialValues: contactDetailsState,
    validationSchema,
    onSubmit: (values) => {
      const formData = new FormData();
      formData.append("institutesRequest", JSON.stringify(values));
      dispatch(updateInstByIdAct(generateActionPayload("update_inst_details", undefined, formData)));
    },
  });
  function onChangePhoneInput(date: string, otherData: any, event: any) {
    const { target } = event, { name } = target || {},
      updateDate = date.substring(2);
    contactForm.setFieldValue(name, updateDate);
  }

  function onCancelHndlr() {
    const contactDetails = getInstituteDetails(instDetailsResp);
    setContactDetailsState((prevState: any) => ({
      ...prevState, ...contactDetails
    }));
    setContactDetailsState((prevState: any) => ({ ...prevState, ...instDetailsResp }));
    contactForm.resetForm();
  }

  return (
    <div className="">
      <form onSubmit={contactForm.handleSubmit}>
        <div className="tw-grid tw-grid-cols-12 tw-gap-x-6 tw-gap-y-4">

          <div className="tw-col-span-12 md:tw-col-span-6">
            <TextInput
              name="contactPersonFirstName"
              labelText="First Name"
              value={contactForm.values.contactPersonFirstName}
              onChange={contactForm.handleChange}
              onBlur={contactForm.handleBlur}
              invalid={(contactForm.touched.contactPersonFirstName && contactForm.errors.contactPersonFirstName) ? true : false}
              error={(contactForm.touched.contactPersonFirstName && contactForm.errors.contactPersonFirstName) ? contactForm.errors.contactPersonFirstName : ""}
            />
          </div>

          <div className="tw-col-span-12 md:tw-col-span-6">
            <TextInput
              name="contactPersonLastName"
              labelText="Last Name"
              value={contactForm.values.contactPersonLastName}
              onChange={contactForm.handleChange}
              onBlur={contactForm.handleBlur}
              invalid={(contactForm.touched.contactPersonLastName && contactForm.errors.contactPersonLastName) ? true : false}
              error={(contactForm.touched.contactPersonLastName && contactForm.errors.contactPersonLastName) ? contactForm.errors.contactPersonLastName : ""}
            />
          </div>

          <div className="tw-col-span-12 md:tw-col-span-6">
            <div className="tw-relative">
              <TextIconInput
                name="contactPerEmailId"
                labelText="Contact Person Email"
                value={contactForm.values.contactPerEmailId}
                onChange={contactForm.handleChange}
                onBlur={contactForm.handleBlur}
                invalid={(contactForm.touched.contactPerEmailId && contactForm.errors.contactPerEmailId) ? true : false}
                error={(contactForm.touched.contactPerEmailId && contactForm.errors.contactPerEmailId) ? contactForm.errors.contactPerEmailId : ""}
              />
              <i className="ri-mail-unread-line tw-absolute tw-left-3 tw-top-[35px] tw-text-gray-400"></i>
            </div>
          </div>

          <div className="tw-col-span-12 md:tw-col-span-6">
            <PhoneInput
              name="contactPersonPhoneNo"
              labelText="Contact Person Phone No"
              value={contactForm.values.contactPersonPhoneNo}
              onChange={onChangePhoneInput}
              onBlur={contactForm.handleBlur}
              invalid={(contactForm.touched.contactPersonPhoneNo && contactForm.errors.contactPersonPhoneNo) ? true : false}
              error={(contactForm.touched.contactPersonPhoneNo && contactForm.errors.contactPersonPhoneNo) ? contactForm.errors.contactPersonPhoneNo : ""}
            />
          </div>

          <div className="tw-col-span-12">
            <div className="tw-flex tw-justify-end tw-gap-2 tw-mt-2">
              {contactForm.dirty && (
                <Button
                  type="button"
                  onClick={onCancelHndlr}
                  variant="soft"
                >
                  Cancel
                </Button>
              )}
              <Button
                type="submit"
                disabled={!contactForm.dirty}
                variant="primary"
              >
                Update
              </Button>
            </div>
          </div>

        </div>
      </form>
    </div>
  )
}

export default ContactDetails;