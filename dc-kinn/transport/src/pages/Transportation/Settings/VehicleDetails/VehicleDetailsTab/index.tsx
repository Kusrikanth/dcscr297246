import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import {
  BrowseFile,
  DateInput,
  SelectInput,
  TextInput,
  TextInputGroup,
} from "../../../../../Components/Common";
import * as Yup from "yup";
import { default as RupeeSvg } from "../../../../../assets/imagesdps/feeDashboard/RupeeSvg.svg?react";
import Button from "../../../../../Components/Common/Button";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { getInsuranceCompanyListAct, getInsuranceTypesListAct } from "../../../../../store/transportation/settings/vehicledetails/vehicledetaileaction";
import { generateActionPayload } from "../../../../../utility/reduxutility";


const initialValues:any = {
  permitNo:"",
  permitArea:"",
  permitCharges:"",
  permitExpiryDate: "",
  permitDate: "",
  rcBookNo:"",
  rcIssuedStartDate:"",
  rcExpiryDate:"",
  hpaWith:"",
  roadTaxPaid:"",
  registerCity:"",
  pollutionExpiry:"",
  insuranceCompanyId:"",
  insuranceTypeId:"",
  speedCertificate:null,
  vehicleRc:null,
  fitnessDate:'',
  insuranceStartDate: "",
  insuranceEndDate: "",
  insuranceRenewalDate: "",
};

const validationSchema = Yup.object({
  // permitNo : Yup.string().required("Permit No is Required").nullable(),
  // permitArea : Yup.string().required("Permit Area is Required").nullable(),
  // registerCity : Yup.string().required("Permit City is Required").nullable(),
  // permitCharges : Yup.string().required("Permit Charges is Required").nullable(),
  // permitExpiryDate : Yup.string().required("Permit Expiry Date is Required").nullable(),
  // permitDate : Yup.string().required("Permit Date is Required").nullable(),
  // rcBookNo : Yup.string().required("RC Book No is Required").nullable(),
  // rcIssuedStartDate : Yup.string().required("RC Issued Date is Required").nullable(),
  // rcExpiryDate : Yup.string().required("RC Expiry Date is Required").nullable(),
  // hpaWith : Yup.string().required("HPA With is Required").nullable(),
  roadTaxPaid : Yup.number().typeError("Enter a valid number.").nullable(),
  vehicleRc: Yup.mixed().required("File is required"),
  insuranceCompanyId: Yup.mixed().required("Insurance Company is required"),
  insuranceTypeId: Yup.mixed().required("Insurance Type is required"),
  insuranceStartDate: Yup.string().required("Insurance Start Date is Required").nullable(),
  insuranceEndDate: Yup.string().required("Insurance End Date is Required").nullable(),
  insuranceRenewalDate: Yup.string().required("Insurance Renewal Date is Required").nullable(),
})
const VehicleDetailsTab = (props:any) => {
 const dispatch = useAppDispatch();
  const {state : vehicleDetailsState } = props || {};
  const [fileState, setFileState] = useState<any>({
    speedCertificate: null,
    vehicleRc: null,
  });
  
  const { currentBranchIdResp: branchId,
    currentInstIdResp: instituteId, getInsuranceCompanyListResp, getInsuranceTypesListResp } = useAppSelector(({ vehicleDetailRequest, appData, globalData }) => ({
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      showApiLoader: globalData.showApiLoader,
      getInsuranceCompanyListResp: vehicleDetailRequest.getInsuranceCompanyListResp,
      getInsuranceTypesListResp: vehicleDetailRequest.getInsuranceTypesListResp,
    }), shallowEqual);

  useEffect(() => {
    dispatch(getInsuranceCompanyListAct(generateActionPayload("get_insurance_company_list", undefined, { branchId, instituteId, pageNo: 0, pageSize: 100 })));
    dispatch(getInsuranceTypesListAct(generateActionPayload("get_insurance_types_list", undefined, { branchId, instituteId, pageNo: 0, pageSize: 100 })));
  }, [instituteId]);

  const VehicleDetailsTabForm = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema,
    onSubmit: (values) => {
      // props.stepHandler("stepdown")
      if (values.speedCertificate?.id) {
        delete values.speedCertificate
      }
      if (values.vehicleRc?.id) {
        delete values.vehicleRc
      }
      props.updateStepHndlr("stepup", values, "3")
    },
  });

  useEffect(() => {
    if (vehicleDetailsState?.permitInfo) {
      VehicleDetailsTabForm.setValues(vehicleDetailsState?.permitInfo)
      const { originalFileName } = vehicleDetailsState?.permitInfo?.speedCertificate || {};
      const speedCert = vehicleDetailsState?.permitInfo?.speedCertificate;
      const vehicleRc = vehicleDetailsState?.permitInfo?.vehicleRc;

      setFileState({
        speedCertificate: speedCert
          ? { ...speedCert, name: speedCert?.originalFileName }
          : null,
        vehicleRc: vehicleRc
          ? { ...vehicleRc, name: vehicleRc?.originalFileName }
          : null,
      });
    }
  }, [])

  const onChangeFileInputHndlr = (event: any) => {
    const file = event.target.files[0];
    const name = event.target.name;

    setFileState((prev: any) => ({
      ...prev,
      [name]: file
    }));

    VehicleDetailsTabForm.setValues((prevState: any) => ({
      ...prevState, [name]: file,
    }));
  }
  return (
    <div className="vehicleowner-wapper">
      <div className="tw-row">
        <div className="tw-col-12 tw-mb-3">
          <div className="tw-border-b">
            <span className="tw-block tw-mb-2 tw-font-bold tw-text-base">
              3. Permit & License Info
            </span>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="tw-grid tw-grid-cols-12 tw-gap-4">

          <div className="tw-col-span-4">
            <TextInput
              name="permitNo"
              value={VehicleDetailsTabForm.values.permitNo}
              onChange={VehicleDetailsTabForm.handleChange}
              labelText={"Permit no."}
              labelClass={"tw-font-bold"}
              invalid={(VehicleDetailsTabForm.touched.permitNo && VehicleDetailsTabForm.errors.permitNo) ? true : false}
              onBlur={VehicleDetailsTabForm.handleBlur}
              error={(VehicleDetailsTabForm.touched.permitNo && VehicleDetailsTabForm.errors.permitNo) ? VehicleDetailsTabForm.errors.permitNo : ""}
            />
          </div>

          <div className="tw-col-span-4">
            <TextInput
              name="permitArea"
              value={VehicleDetailsTabForm.values.permitArea}
              onChange={VehicleDetailsTabForm.handleChange}
              labelClass={"fw-bold"}
              labelText={"Permit Area"}
              invalid={(VehicleDetailsTabForm.touched.permitArea && VehicleDetailsTabForm.errors.permitArea) ? true : false}
              onBlur={VehicleDetailsTabForm.handleBlur}
              error={VehicleDetailsTabForm.touched.permitArea && VehicleDetailsTabForm.errors.permitArea}
            />
          </div>

          <div className="tw-col-span-4">
            <TextInputGroup
              name="permitCharges"
              labelText="Route Permit Cost"
              inputClassName="tw-bg-gray-100"
              formgroupClassName="tw-w-full"
              value={VehicleDetailsTabForm.values.permitCharges}
              onChange={VehicleDetailsTabForm.handleChange}
              labelClass="fw-bold"
              invalid={(VehicleDetailsTabForm.touched.permitCharges && VehicleDetailsTabForm.errors.permitCharges) ? true : false}
              onBlur={VehicleDetailsTabForm.handleBlur}
              error={VehicleDetailsTabForm.touched.permitCharges && VehicleDetailsTabForm.errors.permitCharges}
            >
              <RupeeSvg width="12px" height="12px" fill="#3B3B3B" />
            </TextInputGroup>
          </div>

          <div className="tw-col-span-4">
            <DateInput
              name="permitDate"
              value={VehicleDetailsTabForm.values.permitDate}
              onChange={VehicleDetailsTabForm.handleChange}
              labelText={"Permit Date"}
              labelClass={"fw-bold"}
              invalid={(VehicleDetailsTabForm.touched.permitDate && VehicleDetailsTabForm.errors.permitDate) ? true : false}
              onBlur={VehicleDetailsTabForm.handleBlur}
              error={VehicleDetailsTabForm.touched.permitDate && VehicleDetailsTabForm.errors.permitDate}
            />
          </div>

          <div className="tw-col-span-4">
            <DateInput
              name="permitExpiryDate"
              value={VehicleDetailsTabForm.values.permitExpiryDate}
              onChange={VehicleDetailsTabForm.handleChange}
              inputClassName={"bg-soft-light"}
              labelClass={"fw-bold"}
              labelText={"Permit Expiry Date"}
              invalid={(VehicleDetailsTabForm.touched.permitExpiryDate && VehicleDetailsTabForm.errors.permitExpiryDate) ? true : false}
              onBlur={VehicleDetailsTabForm.handleBlur}
              error={VehicleDetailsTabForm.touched.permitExpiryDate && VehicleDetailsTabForm.errors.permitExpiryDate}
            />
          </div>

          <div className="tw-col-span-4">
            <TextInputGroup
              name="roadTaxPaid"
              labelText="Road Tax Paid"
              inputClassName="tw-bg-gray-100"
              formgroupClassName="tw-w-full"
              value={VehicleDetailsTabForm.values.roadTaxPaid}
              onChange={VehicleDetailsTabForm.handleChange}
              labelClass="fw-bold"
              invalid={(VehicleDetailsTabForm.touched.roadTaxPaid && VehicleDetailsTabForm.errors.roadTaxPaid) ? true : false}
              onBlur={VehicleDetailsTabForm.handleBlur}
              error={VehicleDetailsTabForm.touched.roadTaxPaid && VehicleDetailsTabForm.errors.roadTaxPaid}
            >
              <RupeeSvg width="12px" height="12px" fill="#3B3B3B" />
            </TextInputGroup>
          </div>

          <div className="tw-col-span-4">
            <TextInput
              name="rcBookNo"
              value={VehicleDetailsTabForm.values.rcBookNo}
              onChange={VehicleDetailsTabForm.handleChange}
              labelText={"RC Book No."}
              labelClass={"fw-bold"}
              invalid={(VehicleDetailsTabForm.touched.rcBookNo && VehicleDetailsTabForm.errors.rcBookNo) ? true : false}
              onBlur={VehicleDetailsTabForm.handleBlur}
              error={VehicleDetailsTabForm.touched.rcBookNo && VehicleDetailsTabForm.errors.rcBookNo}
            />
          </div>

          <div className="tw-col-span-4">
            <DateInput
              name="rcIssuedStartDate"
              value={VehicleDetailsTabForm.values.rcIssuedStartDate}
              onChange={VehicleDetailsTabForm.handleChange}
              inputClassName={"bg-soft-light"}
              labelClass={"fw-bold"}
              labelText={"RC Issue Date"}
              invalid={(VehicleDetailsTabForm.touched.rcIssuedStartDate && VehicleDetailsTabForm.errors.rcIssuedStartDate) ? true : false}
              onBlur={VehicleDetailsTabForm.handleBlur}
              error={VehicleDetailsTabForm.touched.rcIssuedStartDate && VehicleDetailsTabForm.errors.rcIssuedStartDate}
            />
          </div>

          <div className="tw-col-span-4">
            <DateInput
              name="rcExpiryDate"
              value={VehicleDetailsTabForm.values.rcExpiryDate}
              onChange={VehicleDetailsTabForm.handleChange}
              inputClassName={"bg-soft-light"}
              labelClass={"fw-bold"}
              labelText={"RC Expiry Date"}
              invalid={(VehicleDetailsTabForm.touched.rcExpiryDate && VehicleDetailsTabForm.errors.rcExpiryDate) ? true : false}
              onBlur={VehicleDetailsTabForm.handleBlur}
              error={VehicleDetailsTabForm.touched.rcExpiryDate && VehicleDetailsTabForm.errors.rcExpiryDate}
            />
          </div>

          <div className="tw-col-span-4">
            <TextInput
              name="hpaWith"
              value={VehicleDetailsTabForm.values.hpaWith}
              onChange={VehicleDetailsTabForm.handleChange}
              labelText={"HPA With"}
              labelClass={"fw-bold"}
              invalid={(VehicleDetailsTabForm.touched.hpaWith && VehicleDetailsTabForm.errors.hpaWith) ? true : false}
              onBlur={VehicleDetailsTabForm.handleBlur}
              error={VehicleDetailsTabForm.touched.hpaWith && VehicleDetailsTabForm.errors.hpaWith}
            />
          </div>

          <div className="tw-col-span-4">
            <TextInput
              name="registerCity"
              value={VehicleDetailsTabForm.values.registerCity}
              onChange={VehicleDetailsTabForm.handleChange}
              labelClass={"fw-bold"}
              labelText={"Permit City"}
              invalid={(VehicleDetailsTabForm.touched.registerCity && VehicleDetailsTabForm.errors.registerCity) ? true : false}
              onBlur={VehicleDetailsTabForm.handleBlur}
              error={VehicleDetailsTabForm.touched.registerCity && VehicleDetailsTabForm.errors.registerCity}
            />
          </div>

          <div className="tw-col-span-4">
            <DateInput
              name="pollutionExpiry"
              value={VehicleDetailsTabForm.values.pollutionExpiry}
              onChange={VehicleDetailsTabForm.handleChange}
              inputClassName={"bg-soft-light"}
              labelClass={"fw-bold"}
              labelText={"Pollution Expiry Date"}
              invalid={(VehicleDetailsTabForm.touched.pollutionExpiry && VehicleDetailsTabForm.errors.pollutionExpiry) ? true : false}
              onBlur={VehicleDetailsTabForm.handleBlur}
              error={VehicleDetailsTabForm.touched.pollutionExpiry && VehicleDetailsTabForm.errors.pollutionExpiry}
            />
          </div>

        </div>

        <div className="tw-grid tw-grid-cols-12 tw-gap-4">

          <div className="tw-col-span-4">
            <DateInput
              name="fitnessDate"
              value={VehicleDetailsTabForm.values.fitnessDate}
              onChange={VehicleDetailsTabForm.handleChange}
              inputClassName={"bg-soft-light"}
              labelClass={"fw-bold"}
              labelText={"Fitness Date"}
              invalid={(VehicleDetailsTabForm.touched.fitnessDate && VehicleDetailsTabForm.errors.fitnessDate) ? true : false}
              onBlur={VehicleDetailsTabForm.handleBlur}
              error={VehicleDetailsTabForm.touched.fitnessDate && VehicleDetailsTabForm.errors.fitnessDate}
            />
          </div>

          <div className="tw-col-span-4">
            <BrowseFile
              containerClassName="tw-mb-0"
              labelText="Speed Certificate"
              name="speedCertificate"
              labelClass="tw-font-bold"
              fileName={fileState.speedCertificate?.name}
              onChangeFileHndlr={onChangeFileInputHndlr}
              invalid={(VehicleDetailsTabForm.touched.speedCertificate && VehicleDetailsTabForm.errors.speedCertificate) ? true : false}
              error={(VehicleDetailsTabForm.touched.speedCertificate && VehicleDetailsTabForm.errors.speedCertificate) ? String(VehicleDetailsTabForm.errors.speedCertificate) : ""}
            />
          </div>
          <div className="tw-col-span-4">
            <BrowseFile
              containerClassName="tw-mb-0"
              labelText="Vehicle RC"
              name="vehicleRc"
              labelClass="tw-font-bold required"
              fileName={fileState.vehicleRc?.name}
              onChangeFileHndlr={onChangeFileInputHndlr}
              invalid={(VehicleDetailsTabForm.touched.vehicleRc && VehicleDetailsTabForm.errors.vehicleRc) ? true : false}
              error={(VehicleDetailsTabForm.touched.vehicleRc && VehicleDetailsTabForm.errors.vehicleRc) ? String(VehicleDetailsTabForm.errors.vehicleRc) : ""}
            />
          </div>
          <div className="tw-col-span-4">
            <SelectInput
              name="insuranceCompanyId"
              value={VehicleDetailsTabForm.values.insuranceCompanyId}
              onChange={VehicleDetailsTabForm.handleChange}
              labelClass="fw-bold required"
              labelText="Insurance Company"
              menuItems={Array.isArray(getInsuranceCompanyListResp) ? getInsuranceCompanyListResp : []}
              textKey="insuranceCompany"
              valueKey="id"
              invalid={(VehicleDetailsTabForm.touched.insuranceCompanyId && VehicleDetailsTabForm.errors.insuranceCompanyId) ? true : false}
              onBlur={VehicleDetailsTabForm.handleBlur}
              error={VehicleDetailsTabForm.touched.insuranceCompanyId && VehicleDetailsTabForm.errors.insuranceCompanyId}
            />
          </div>
          <div className="tw-col-span-4">
            <SelectInput
              name="insuranceTypeId"
              value={VehicleDetailsTabForm.values.insuranceTypeId}
              onChange={VehicleDetailsTabForm.handleChange}
              labelClass="fw-bold required"
              labelText="Insurance Type"
              menuItems={Array.isArray(getInsuranceTypesListResp) ? getInsuranceTypesListResp : []}
              textKey="insuranceType"
              valueKey="id"
              invalid={(VehicleDetailsTabForm.touched.insuranceTypeId && VehicleDetailsTabForm.errors.insuranceTypeId) ? true : false}
              onBlur={VehicleDetailsTabForm.handleBlur}
              error={VehicleDetailsTabForm.touched.insuranceTypeId && VehicleDetailsTabForm.errors.insuranceTypeId}
            />
          </div>
          <div className="tw-col-span-4">
            <DateInput
              name="insuranceStartDate"
              value={VehicleDetailsTabForm.values.insuranceStartDate}
              onChange={VehicleDetailsTabForm.handleChange}
              inputClassName={"bg-soft-light"}
              labelClass={"fw-bold required"}
              labelText={"Insurance Start Date"}
              invalid={(VehicleDetailsTabForm.touched.insuranceStartDate && VehicleDetailsTabForm.errors.insuranceStartDate) ? true : false}
              onBlur={VehicleDetailsTabForm.handleBlur}
              error={VehicleDetailsTabForm.touched.insuranceStartDate && VehicleDetailsTabForm.errors.insuranceStartDate}
            />
          </div>
          <div className="tw-col-span-4">
            <DateInput
              name="insuranceEndDate"
              value={VehicleDetailsTabForm.values.insuranceEndDate}
              onChange={VehicleDetailsTabForm.handleChange}
              inputClassName={"bg-soft-light"}
              labelClass={"fw-bold required"}
              labelText={"Insurance End Date"}
              invalid={(VehicleDetailsTabForm.touched.insuranceEndDate && VehicleDetailsTabForm.errors.insuranceEndDate) ? true : false}
              onBlur={VehicleDetailsTabForm.handleBlur}
              error={VehicleDetailsTabForm.touched.insuranceEndDate && VehicleDetailsTabForm.errors.insuranceEndDate}
            />
          </div>
          <div className="tw-col-span-4">
            <DateInput
              name="insuranceRenewalDate"
              value={VehicleDetailsTabForm.values.insuranceRenewalDate}
              onChange={VehicleDetailsTabForm.handleChange}
              inputClassName={"bg-soft-light"}
              labelClass={"fw-bold required"}
              labelText={"Insurance Renewal Date"}
              invalid={(VehicleDetailsTabForm.touched.insuranceRenewalDate && VehicleDetailsTabForm.errors.insuranceRenewalDate) ? true : false}
              onBlur={VehicleDetailsTabForm.handleBlur}
              error={VehicleDetailsTabForm.touched.insuranceRenewalDate && VehicleDetailsTabForm.errors.insuranceRenewalDate}
            />
          </div>
        </div>
      </div>
      {props.activeStepId === "3" && (
        <div className="tw-flex tw-justify-end tw-mb-3 tw-gap-3">
          <Button
            variant="secondary"
            onClick={() => props.updateStepHndlr("stepdown")}
          >
            Previous
          </Button>

          <Button
            variant="primary"
            onClick={(event: any) => VehicleDetailsTabForm.handleSubmit(event)}
          >
            Save
          </Button>
        </div>
      )}

    </div>
  );
};

export default VehicleDetailsTab;
