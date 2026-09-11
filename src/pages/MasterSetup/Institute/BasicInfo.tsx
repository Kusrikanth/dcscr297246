import React, { useState, useEffect, useRef } from "react";
import { shallowEqual } from "react-redux";
import { useFormik } from 'formik';
import * as Yup from "yup";
import { toast } from "react-toastify";
//Common Component
import { TextIconInput, TextInput, PhoneInput, SelectInput, DateInput, TextInputWithRegex, Button,  } from "../../../Components/Common";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";

//Generate Action
import { generateActionPayload } from "../../../utility/reduxutility";
import { Current_Date_YYYYMMDD } from "../../../utility/dateutility";
import { getInstByIdAct, updateInstByIdAct, } from "../../../store/mastersettings/instituteinfo/instituteinfoactions";
import {
  getCountriesAct, getCountryStateAct, resetCountryStateAct, setCountryStateAct,
  getMasterTrustAct
} from "../../../store/masterdata/masterdataactions";

//Helper
import { getInstituteDetails } from "./helper";


//Types
import { IInstituteProps, IInistuteInfoResp } from "./institutetypes";
// import Button from "../../../Components/Common/Button";

const validationSchema = Yup.object().shape({
  affiliationNo: Yup.number().typeError("Enter valid number.").required("Affiliation no. required."),
  // trustId: Yup.string().required("Trust name required.").nullable(),
  emailId: Yup.string().email('Invalid Email.').required('Email is required.').nullable(),
  institutionPhoneNo: Yup.string().trim().matches(/^[0-9]{10,10}$/, 'Mobile number with 10 digit is valid.').required("Phone number required.").nullable(),
  countryId: Yup.string().required("Country required.").nullable(),
  stateId: Yup.string().required("State required.").nullable(),
  address: Yup.string().required("Address required.").nullable(),
  pincode: Yup.string().matches(/^[0-9]{6,6}$/, 'Pincode must be 6 digit number.').required("Pincode required.").nullable(),
  // licenceType: Yup.string().required("Licence type required.").nullable(),
  // licenseExpiryDate: Yup.date().min(Current_Date_YYYYMMDD, `Date should be more than todays date.`).required("Licence expiry date required.").nullable(),
});

const BasicInfo: React.FC<IInstituteProps> = ({ instituteName, instituteId }) => {
  const [instituteState, setInstituteState] = useState<any>(() => getInstituteDetails(null));
  const dispatch = useAppDispatch();
  const { instDetailsResp, updateInstResp,
    countriesResp, countryStateResp, masterTrustResp, instInfoError,
    masterDataErrorResp } = useAppSelector(({ instituteInfo, masterData }) => ({
      instDetailsResp: instituteInfo.instDetailsResp,
      updateInstResp: instituteInfo.updateInstResp,
      countriesResp: masterData.countriesResp,
      countryStateResp: masterData.countryStateResp,
      masterTrustResp: masterData.masterTrustResp,
      instInfoError: instituteInfo.instInfoError,
      masterDataErrorResp: masterData.masterDataErrorResp
    }), shallowEqual);

  const instituteRespRef = useRef<any>({
    prevUpdateInstResp: updateInstResp,
    prevInstInfoError: instInfoError,
    prevMasterDataErrorResp: masterDataErrorResp
  });
  // Component did mount
  useEffect(() => {
    if (!countriesResp)
      dispatch(getCountriesAct(generateActionPayload("get_countries")));
    return () => { dispatch(resetCountryStateAct(undefined)); }
  }, [countriesResp]);
  useEffect(() => {
    if (!masterTrustResp)
      dispatch(getMasterTrustAct(generateActionPayload("get_master_trust")));
  }, [masterTrustResp]);

  useEffect(() => {
    if (instDetailsResp) {
      const { countryId } = instDetailsResp,
        instituteDetails = getInstituteDetails(instDetailsResp);
      if (countryId) {
        dispatch(getCountryStateAct(generateActionPayload("get_country_state", { countryId })));
      }
      setInstituteState((prevState: any) => ({
        ...prevState, ...instituteDetails
      }));
      instituteForm.resetForm();
    }
  }, [instDetailsResp]);
  //Component Did update
  useEffect(() => {
    const { prevUpdateInstResp, prevInstInfoError, prevMasterDataErrorResp } = instituteRespRef.current;
    if (updateInstResp && updateInstResp !== prevUpdateInstResp) {
      toast.success("Institute basic info updated successfully.");
      const params = { instituteId };
      dispatch(getInstByIdAct(generateActionPayload("get_inst_details", params)));
    } else if (instInfoError && prevInstInfoError !== instInfoError) {
      const { details }: any = instInfoError;
      toast.error(details);
    } else if (masterDataErrorResp && prevMasterDataErrorResp !== masterDataErrorResp) {
      const { details }: any = masterDataErrorResp;
      toast.error(details);
    }
    instituteRespRef.current.prevUpdateInstResp = updateInstResp;
    instituteRespRef.current.prevInstInfoError = instInfoError;
    instituteRespRef.current.prevMasterDataErrorResp = masterDataErrorResp;
  }, [updateInstResp, instInfoError, masterDataErrorResp]);

  // Institute Form
  const instituteForm = useFormik({
    enableReinitialize: true,
    initialValues: instituteState,
    validationSchema,
    onSubmit: (values) => {
      const formData = new FormData();
      formData.append("institutesRequest", JSON.stringify(values));
      dispatch(updateInstByIdAct(generateActionPayload("update_inst_details", undefined, formData)));
    },
  });
  function onChangePhoneInput(phoneNumber: string, otherData: any, event: any) {
    const { target } = event, { name } = target || {},
      updateDate = phoneNumber.substring(2);
    instituteForm.setFieldValue(name, updateDate);
  }

  function onChangeCountryHndlr(event: React.ChangeEvent<HTMLInputElement>) {
    const { target } = event, { name, value } = target;
    if (value) {
      dispatch(getCountryStateAct(generateActionPayload("get_country_state", { countryId: value })));
      dispatch(setCountryStateAct(undefined));
    }
    instituteForm.setValues((prevState: any) => ({ ...prevState, stateId: "", [name]: value }));
  }

  function onCancelHndlr() {
    const { countryId } = instDetailsResp,
      instituteDetails = getInstituteDetails(instDetailsResp);
    if (countryId) {
      dispatch(getCountryStateAct(generateActionPayload("get_country_state", { countryId })));
    }
    setInstituteState((prevState: any) => ({
      ...prevState, ...instituteDetails
    }));
    instituteForm.resetForm();
  }

  return (
    <div className="">
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
            <TextInputWithRegex
              name="affiliationNo"
              labelText="Affiliation No."
              value={instituteForm.values.affiliationNo}
              onChange={instituteForm.handleChange}
              onBlur={instituteForm.handleBlur}
              invalid={(instituteForm.touched.affiliationNo && instituteForm.errors.affiliationNo) ? true : false}
              error={(instituteForm.touched.affiliationNo && instituteForm.errors.affiliationNo) ? instituteForm.errors.affiliationNo : ""}
              maxLength={10}
              allowedInputRegex="^[0-9]+$"
            />
          </div>

          <div className="tw-col-span-12 md:tw-col-span-6">
            <SelectInput
              name="trustId"
              labelText="Trust Name"
              value={instituteForm.values.trustId}
              onChange={instituteForm.handleChange}
              onBlur={instituteForm.handleBlur}
              invalid={(instituteForm.touched.trustId && instituteForm.errors.trustId) ? true : false}
              error={(instituteForm.touched.trustId && instituteForm.errors.trustId) ? instituteForm.errors.trustId : ""}
              menuItems={masterTrustResp}
              valueKey="id"
              textKey="trustName"
              isDisabled={true}
            />
          </div>

          <div className="tw-col-span-12 md:tw-col-span-6">
            <div className="tw-relative">
              <TextIconInput
                name="emailId"
                labelText="Institution Email"
                value={instituteForm.values.emailId}
                onChange={instituteForm.handleChange}
                onBlur={instituteForm.handleBlur}
                invalid={(instituteForm.touched.emailId && instituteForm.errors.emailId) ? true : false}
                error={(instituteForm.touched.emailId && instituteForm.errors.emailId) ? instituteForm.errors.emailId : ""}
              />
              <i className="ri-mail-unread-line tw-absolute tw-left-3 tw-top-[35px] tw-text-gray-400"></i>
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
              // formgroupClassName="mb-4"
              value={instituteForm.values.countryId}
              onChange={onChangeCountryHndlr}
              onBlur={instituteForm.handleBlur}
              invalid={(instituteForm.touched.countryId && instituteForm.errors.countryId) ? true : false}
              error={(instituteForm.touched.countryId && instituteForm.errors.countryId) ? instituteForm.errors.countryId : ""}
              menuItems={countriesResp}
              valueKey="id"
              textKey="countryName"
            />
          </div>

          <div className="tw-col-span-12 md:tw-col-span-6">
            <SelectInput
              name="stateId"
              labelText="State"
              // formgroupClassName="mb-4"
              value={instituteForm.values.stateId}
              onChange={instituteForm.handleChange}
              onBlur={instituteForm.handleBlur}
              invalid={(instituteForm.touched.stateId && instituteForm.errors.stateId) ? true : false}
              error={(instituteForm.touched.stateId && instituteForm.errors.stateId) ? instituteForm.errors.stateId : ""}
              menuItems={countryStateResp}
              valueKey="id"
              textKey="stateName"
            />
          </div>

          <div className="tw-col-span-12 md:tw-col-span-6">
            <TextInput
              name="address"
              labelText="Address"
              value={instituteForm.values.address}
              onChange={instituteForm.handleChange}
              onBlur={instituteForm.handleBlur}
              invalid={(instituteForm.touched.address && instituteForm.errors.address) ? true : false}
              error={(instituteForm.touched.address && instituteForm.errors.address) ? instituteForm.errors.address : ""}
            />
          </div>

          <div className="tw-col-span-12 md:tw-col-span-6">
            <TextInputWithRegex
              name="pincode"
              labelText="Pin Code"
              value={instituteForm.values.pincode}
              onChange={instituteForm.handleChange}
              onBlur={instituteForm.handleBlur}
              invalid={(instituteForm.touched.pincode && instituteForm.errors.pincode) ? true : false}
              error={(instituteForm.touched.pincode && instituteForm.errors.pincode) ? instituteForm.errors.pincode : ""}
              allowedInputRegex="^[0-9]+$"
              maxLength={6}
            />
          </div>

          <div className="tw-col-span-12 md:tw-col-span-6">
            <TextInput
              name="licenceType"
              labelText="Licence Type"
              value={instituteForm.values.licenceType}
              onChange={instituteForm.handleChange}
              onBlur={instituteForm.handleBlur}
              invalid={(instituteForm.touched.licenceType && instituteForm.errors.licenceType) ? true : false}
              error={(instituteForm.touched.licenceType && instituteForm.errors.licenceType) ? instituteForm.errors.licenceType : ""}
              isDisabled={true}
            />
          </div>

          <div className="tw-col-span-12 md:tw-col-span-6">
            <DateInput
              name="licenseExpiryDate"
              labelText="Expiry Date"
              value={instituteForm.values.licenseExpiryDate}
              onChange={instituteForm.handleChange}
              onBlur={instituteForm.handleBlur}
              minDate={Current_Date_YYYYMMDD}
              invalid={(instituteForm.touched.licenseExpiryDate && instituteForm.errors.licenseExpiryDate) ? true : false}
              error={(instituteForm.touched.licenseExpiryDate && instituteForm.errors.licenseExpiryDate) ? instituteForm.errors.licenseExpiryDate : ""}
              isReadOnly={true}
            />
          </div>

          {/* Full width fields */}
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
                  type="button"
                  variant="soft"
                  onClick={onCancelHndlr}
                >
                  Cancel
                </Button>
              )}
              <Button
                type="submit"
                disabled={!instituteForm.dirty}
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

export default BasicInfo;