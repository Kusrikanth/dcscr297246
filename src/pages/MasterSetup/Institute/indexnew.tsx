import React, { useState, useEffect, useRef } from "react";
import { shallowEqual } from "react-redux";
import { useFormik } from 'formik';
import * as Yup from "yup";
import { toast } from "react-toastify";
//Common Component
import { Button,TextIconInput, TextInput, PhoneInput, SelectInput, DateInput } from "../../../Components/Common";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";

//Generate Action
import { generateActionPayload } from "../../../utility/reduxutility";
import { getInstByIdAct, updateInstByIdAct } from "../../../store/mastersettings/instituteinfo/instituteinfoactions";

//Utility
import { getYyyyMmDdFormat } from "../../../utility/dateutility";
//Types
import { IInstituteProps, IInistuteInfoResp } from "./institutetypes";
import { IUpdateInstitute } from "../../../store/mastersettings/instituteinfo/instituteinfotypes";

const initialValues: any = {
  address: "",
  affiliationNo: "",
  cityId: "",
  contactPersonFirstName: "",
  contactPersonLastName: "",
  contactPersonPhoneNo: "",
  countryId: "",
  directions: "",
  displayName: "",
  emailId: "",
  erpInstituteRefCode: "",
  erpInstituteRefId: "",
  fax: "",
  instituteGroupId: "",
  instituteName: "",
  institutionPhoneNo: "",
  latitude: "",
  licenceType: "",
  licenseExpiryDate: "",
  longitude: "",
  pincode: "",
  shortName: "",
  speedDial: "",
  stateId: "",
  trustId: "",
  websiteUrl: ""
}
const validationSchema = Yup.object().shape({
  afflicationNo: Yup.string().required("Afflication no. required."),
  trustName: Yup.string().required("Trust name required."),
  institutionEmail: Yup.string().required("Email required."),
});

const Institute: React.FC<IInstituteProps> = ({ instituteName, instituteId }) => {
  const [instituteState, setInstituteState] = useState<any>(initialValues);
  const dispatch = useAppDispatch();
  const { instDetailsResp, updateInstResp, instInfoError } = useAppSelector(({ instituteInfo }) => ({
    instDetailsResp: instituteInfo.instDetailsResp,
    updateInstResp: instituteInfo.updateInstResp,
    instInfoError: instituteInfo.instInfoError
  }), shallowEqual);
  const instituteRespRef = useRef<IInistuteInfoResp>({
    prevInstDetailsResp: instDetailsResp,
    prevUpdateInstResp: updateInstResp,
    prevInstInfoError: instInfoError
  });
  // Component did mount
  useEffect(() => {
    if (instituteId) {
      const params = { instituteId };
      dispatch(getInstByIdAct(generateActionPayload("get_inst_details", params)));
    }
  }, [instituteId]);
  //Component Did update
  useEffect(() => {
    const { prevInstDetailsResp, prevUpdateInstResp, prevInstInfoError } = instituteRespRef.current;
    if (instDetailsResp && prevInstDetailsResp !== instDetailsResp) {
      const { licenseExpiryDate, ...otherDetails } = instDetailsResp;
      const updatedDateFormat = getYyyyMmDdFormat(licenseExpiryDate);
      setInstituteState({
        ...otherDetails,
        licenseExpiryDate: updatedDateFormat
      });
    } else if (updateInstResp && updateInstResp !== prevUpdateInstResp) {
      toast.success("Institute updated successfully.");
      const params = { instituteId };
      dispatch(getInstByIdAct(generateActionPayload("get_inst_details", params)));
    } else if (instInfoError && prevInstInfoError !== instInfoError) {
      const { message }: any = instInfoError;
      toast.error(message);
    }
    instituteRespRef.current.prevInstDetailsResp = instDetailsResp;
    instituteRespRef.current.prevUpdateInstResp = updateInstResp;
    instituteRespRef.current.prevInstInfoError = instInfoError;
  }, [instDetailsResp, updateInstResp, instInfoError]);

  // Institute Form
  const instituteForm = useFormik({
    enableReinitialize: true,
    initialValues: instituteState,
    validationSchema,
    onSubmit: (values) => {
      dispatch(updateInstByIdAct(generateActionPayload("update_inst_details", undefined, values)));
    },
  });
  function onChangePhoneInput(date: string, otherData: any, event: any) {
    const { target } = event, { name } = target || {},
      updateDate = date.substring(2);
    instituteForm.setFieldValue(name, updateDate);
  }
  return (
    <div className="tw-bg-white tw-rounded-lg tw-shadow-sm tw-border tw-border-gray-200">
      <div className="tw-bg-gray-50 tw-rounded-t-lg tw-border-b tw-border-gray-200 tw-px-6 tw-py-4">
        <h4 className="tw-text-base tw-font-semibold tw-mb-0 tw-flex-grow">Institute Info</h4>
      </div>
      <div className="tw-p-6">
        <form onSubmit={instituteForm.handleSubmit}>
          <div className="tw-grid tw-grid-cols-12 tw-gap-x-6 tw-gap-y-4">
            <div className="tw-col-span-12 md:tw-col-span-6">
              <TextInput
                name="instituteName"
                labelText="Institute Name"
                value={instituteForm.values.instituteName}
                onChange={instituteForm.handleChange}
                isReadOnly={true}
              />
            </div>
            <div className="tw-col-span-12 md:tw-col-span-6">
              <TextInput
                name="shortName"
                labelText="Institute Code"
                value={instituteForm.values.shortName}
                onChange={instituteForm.handleChange}
                isReadOnly={true}
              />
            </div>
            <div className="tw-col-span-12 md:tw-col-span-6">
              <TextInput
                name="affiliationNo"
                labelText="Affiliation No."
                value={instituteForm.values.affiliationNo}
                onChange={instituteForm.handleChange}
                invalid={(instituteForm.touched.affiliationNo && instituteForm.errors.affiliationNo) ? true : false}
                error={(instituteForm.touched.affiliationNo && instituteForm.errors.affiliationNo) ? instituteForm.errors.affiliationNo : ""}
              />
            </div>
            <div className="tw-col-span-12 md:tw-col-span-6">
              <TextInput
                name="trustName"
                labelText="Trust Name"
                value={instituteForm.values.trustName}
                onChange={instituteForm.handleChange}
                invalid={(instituteForm.touched.trustName && instituteForm.errors.trustName) ? true : false}
                error={(instituteForm.touched.trustName && instituteForm.errors.trustName) ? instituteForm.errors.trustName : ""}
              />
            </div>
            <div className="tw-col-span-12 md:tw-col-span-6">
              <div className="tw-relative">
                <TextIconInput
                  name="emailId"
                  labelText="Institution Email"
                  value={instituteForm.values.emailId}
                  onChange={instituteForm.handleChange}
                  invalid={(instituteForm.touched.emailId && instituteForm.errors.emailId) ? true : false}
                  error={(instituteForm.touched.emailId && instituteForm.errors.emailId) ? instituteForm.errors.emailId : ""}
                />
                <i className="ri-mail-unread-line tw-absolute tw-right-3 tw-top-[38px] tw-text-gray-400"></i>
              </div>
            </div>
            <div className="tw-col-span-12 md:tw-col-span-6">
              <PhoneInput
                name="institutionPhoneNo"
                labelText="Institution Phone No."
                value={instituteForm.values.institutionPhoneNo}
                onChange={onChangePhoneInput}
                invalid={(instituteForm.touched.institutionPhoneNo && instituteForm.errors.institutionPhoneNo) ? true : false}
                error={(instituteForm.touched.institutionPhoneNo && instituteForm.errors.institutionPhoneNo) ? instituteForm.errors.institutionPhoneNo : ""}
              />
            </div>
            <div className="tw-col-span-12 md:tw-col-span-6">
              <SelectInput
                name="countryId"
                labelText="Country"
                value={instituteForm.values.countryId}
                onChange={instituteForm.handleChange}
                invalid={(instituteForm.touched.countryId && instituteForm.errors.countryId) ? true : false}
                error={(instituteForm.touched.countryId && instituteForm.errors.countryId) ? instituteForm.errors.countryId : ""}
                menuItems={[{ id: "1", name: "India" }]}
                valueKey="id"
                textKey="name"
              />
            </div>
            <div className="tw-col-span-12 md:tw-col-span-6">
              <SelectInput
                name="stateId"
                labelText="State"
                value={instituteForm.values.stateId}
                onChange={instituteForm.handleChange}
                invalid={(instituteForm.touched.stateId && instituteForm.errors.stateId) ? true : false}
                error={(instituteForm.touched.stateId && instituteForm.errors.stateId) ? instituteForm.errors.stateId : ""}
                menuItems={[{ id: "1", name: "Hyderabad" }]}
                valueKey="id"
                textKey="name"
              />
            </div>
            <div className="tw-col-span-12 md:tw-col-span-6">
              <TextInput
                name="address"
                labelText="Address"
                value={instituteForm.values.address}
                onChange={instituteForm.handleChange}
                invalid={(instituteForm.touched.address && instituteForm.errors.address) ? true : false}
                error={(instituteForm.touched.address && instituteForm.errors.address) ? instituteForm.errors.address : ""}
              />
            </div>
            <div className="tw-col-span-12 md:tw-col-span-6">
              <TextInput
                name="pincode"
                labelText="Pin Code"
                value={instituteForm.values.pincode}
                onChange={instituteForm.handleChange}
                invalid={(instituteForm.touched.pincode && instituteForm.errors.pincode) ? true : false}
                error={(instituteForm.touched.pincode && instituteForm.errors.pincode) ? instituteForm.errors.pincode : ""}
              />
            </div>
            <div className="tw-col-span-12 md:tw-col-span-6">
              <TextInput
                name="licenceType"
                labelText="Licence Type"
                value={instituteForm.values.licenceType}
                onChange={instituteForm.handleChange}
                invalid={(instituteForm.touched.licenceType && instituteForm.errors.licenceType) ? true : false}
                error={(instituteForm.touched.licenceType && instituteForm.errors.licenceType) ? instituteForm.errors.licenceType : ""}
              />
            </div>
            <div className="tw-col-span-12 md:tw-col-span-6">
              <DateInput
                name="licenseExpiryDate"
                labelText="Expiry Date"
                value={instituteForm.values.licenseExpiryDate}
                onChange={instituteForm.handleChange}
                invalid={(instituteForm.touched.licenseExpiryDate && instituteForm.errors.licenseExpiryDate) ? true : false}
                error={(instituteForm.touched.licenseExpiryDate && instituteForm.errors.licenseExpiryDate) ? instituteForm.errors.licenseExpiryDate : ""}
              />
            </div>
            <div className="tw-col-span-12">
              <TextInput
                name="websiteUrl"
                labelText="Website URL"
                value={instituteForm.values.websiteUrl}
                onChange={instituteForm.handleChange}
                invalid={(instituteForm.touched.websiteUrl && instituteForm.errors.websiteUrl) ? true : false}
                error={(instituteForm.touched.websiteUrl && instituteForm.errors.websiteUrl) ? instituteForm.errors.websiteUrl : ""}
                isReadOnly={true}
              />
            </div>
            <div className="tw-col-span-12">
              <div className="tw-flex tw-justify-end tw-gap-2 tw-mt-2">
                {instituteForm.dirty && (
                  <Button
                    variant="soft"
                    onClick={() => instituteForm.resetForm()}
                  >
                    Cancel
                  </Button>
                )}
                <Button
                  variant="primary"
                  type="submit"
                  disabled={!instituteForm.dirty}
                >
                  Update
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Institute;