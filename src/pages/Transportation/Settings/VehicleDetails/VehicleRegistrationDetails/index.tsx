import { useFormik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import * as Yup from "yup";
import {
    TextInput, DateInput, SelectInput, UploadImageUpdated,
  TextInputWithRegex,
  TextInputGroup
} from "../../../../../Components/Common";
import VehicleDefaultImg from "../../../../../assets/imagesdps/transportation/vehicle-default.png";
import { uploadImageFileErrorHndlr } from "../../../../../utility/commonutility";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { Current_Year } from "../../../../../utility/dateutility";
import { generateActionPayload } from "../../../../../utility/reduxutility";
import { getVehicleManufactureListAct, getVehicleModelListAct, resetVehicleModelListAct } from "../../../../../store/transportation/settings/vehicledetails/vehicledetaileaction";
import Button from "../../../../../Components/Common/Button";
import { vehicleStatsOptions } from "../helper";
import { getInstBranchesAct } from "../../../../../store/mastersettings/branch/branchactions";


const initialValues = {
  manufactureId: "",
  modelId: "",
  registrationAuthority:"",
  vehicleTypeId: "",
  registrationNo: "",
  registrationDate: "",
  vehicleCapacity:"",
  vehicleStatus:"",
  newInstituteId:"",
  newBranchId:"",
  effectedDate:"",
  remarks:"",
  registrationRenewalDate: "",
  maxPermissibleSpeed: "",
  model: "",
  year:"",
};

const VehicleRegistrationDetails = (props:any) => {
const dispatch = useAppDispatch()
  const {state : vehicleDetailsState} = props || {};
  const [userImageState, setUserImageState] = useState<any>("");
    const [userImageErrorState, setUserImageErrorState] = useState<any>("");
  const isOccupied = vehicleDetailsState?.basicInfo?.isRouteOccupied;
  const vehicleTypeDetailsId = vehicleDetailsState?.basicInfo?.vehicleTypeDetailsId;
    const StudentImage = useRef<any>({
      file: null
  });

const validationSchema = Yup.object({
  registrationNo : Yup.string().required("Registration number is Required").nullable(),
  // made : Yup.string().required("Made is Required").nullable(),
  vehicleTypeId : Yup.string().required("Vehicle Type is Required").nullable(),
  registrationAuthority : Yup.string().required("Registration Authority is Required").nullable(),
  modelId : Yup.string().required("Model is Required").nullable(),
  vehicleStatus: Yup.string().when([], {
    is: () => !!vehicleTypeDetailsId,
    then: (schema) => schema.required("Vehicle Status is Required"),
    otherwise: (schema) => schema.notRequired().nullable(),
  }),
  manufactureId : Yup.string().required("Manufacture is Required").nullable(),
   newInstituteId: Yup.string().when(["vehicleStatus"], {
    is: (vehicleStatus: string) => vehicleStatus === "TRANSFER",
    then: (schema) => schema.required("Institute is required"),
    otherwise: (schema) => schema.nullable(),
  }),

  newBranchId: Yup.string().when(["vehicleStatus"], {
    is: (vehicleStatus: string) => vehicleStatus === "TRANSFER",
    then: (schema) => schema.required("Branch is required"),
    otherwise: (schema) => schema.nullable(),
  }),
  // registrationDate : Yup.string().required("Registration Date is Required").nullable(),
  // vehicleCapacity : Yup.string().required("Seating Capacity is Required").nullable(),
  // registrationRenewalDate : Yup.string().required("Registration Renewal Date is Required").nullable(),
  // maxPermissibleSpeed : Yup.string().required("Max Permissible Speed is Required").nullable(),
  // model : Yup.string().required("Modal is Required").nullable(),
  // year : Yup.string().required("Year is Required").nullable(),
  
})

  const {currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    showApiLoader,
    transportationErrorAct,
    getVehicleTypeListResp,
    getVehicleManufactureListResp,
    getVehicleModelListResp,
    instituteListResp,
    branchListResp
   } = useAppSelector(({ transportrequest, vehicleDetailRequest, appData,globalData, instituteInfo, branch }) => ({
  
    currentBranchIdResp: appData.currentBranchIdResp,
    currentInstIdResp: appData.currentInstIdResp,
    showApiLoader : globalData.showApiLoader,
   transportationErrorAct:transportrequest.transportationErrorAct,
   getVehicleTypeListResp:transportrequest.getVehicleTypeListResp,
   getVehicleManufactureListResp:vehicleDetailRequest.getVehicleManufactureListResp,
   getVehicleModelListResp:vehicleDetailRequest.getVehicleModelListResp,
     instituteListResp: instituteInfo.instituteListResp,
     branchListResp: branch.branchListResp,

  }), shallowEqual);

  const VehicleRegistrationDetailsDataForm = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema,
    onSubmit: (values) => {
      
      props.updateStepHndlr("stepup",values,"1")
    },
  });

  useEffect(() => {
    if (VehicleRegistrationDetailsDataForm.values.newInstituteId) {
      dispatch(getInstBranchesAct(generateActionPayload("get_inst_branches", undefined, { instituteId: VehicleRegistrationDetailsDataForm.values.newInstituteId })));
    }
  }, [VehicleRegistrationDetailsDataForm.values.newInstituteId]);

  useEffect(() => {
    dispatch(getVehicleManufactureListAct(generateActionPayload("get_vehicle_manufacture_list", undefined)));
  }, []);

  useEffect(() => {
    return () => {
      dispatch(resetVehicleModelListAct(undefined));
    }
  }, []);

  useEffect(() => {
    const manufacturerId = VehicleRegistrationDetailsDataForm.values.manufactureId;
    const vehicleTypeId = VehicleRegistrationDetailsDataForm.values.vehicleTypeId;

    if (manufacturerId) {
      dispatch(getVehicleModelListAct(generateActionPayload("get_vehicle_model_list", { manufacturerId }, vehicleTypeId ? { vehicleTypeId } : undefined)));
    }

  }, [VehicleRegistrationDetailsDataForm.values.manufactureId, VehicleRegistrationDetailsDataForm.values.vehicleTypeId]);

  useEffect(() => {
    if(vehicleDetailsState?.basicInfo){
      VehicleRegistrationDetailsDataForm.setValues(vehicleDetailsState?.basicInfo)
    }

    if(vehicleDetailsState?.file){
      StudentImage.current.file = URL.createObjectURL(vehicleDetailsState?.file);
      setUserImageState(StudentImage.current.file)
    }
    else if(vehicleDetailsState?.basicInfo?.s3Url){
      setUserImageState(vehicleDetailsState?.basicInfo?.s3Url)
    }
  }, [vehicleDetailsState])
  useEffect(() => {
    if(vehicleDetailsState?.basicInfo){
      VehicleRegistrationDetailsDataForm.setValues(vehicleDetailsState?.basicInfo)
    }
    if(vehicleDetailsState?.file){
      StudentImage.current.file = URL.createObjectURL(vehicleDetailsState?.file);
      setUserImageState(StudentImage.current.file)
    }
  }, [])
  
  function handleFileUploadHnlr(event: any) {
    const file = event.target.files[0];
    let error = uploadImageFileErrorHndlr(file.size, file.type);
    // branchLogoFileRef.current = event.target.files[0];
    if (error === "") {
      props.updateStepHndlr("file",file)
      StudentImage.current.file = URL.createObjectURL(file);
      setUserImageState(StudentImage.current.file)
        // setUserImageState(URL.createObjectURL(file));
        setUserImageErrorState('')
        
    }
    else {
        setUserImageErrorState(error);
    }

  }

  const yearOptions = Array.from({ length: 50 }, (_, i) => {
    const year = Current_Year - i;
    return {
      id: year,
      yearType: year.toString(),
    };
  });

  const vehicleStatusMenu = isOccupied
    ? [
      { id: "OCCUPIED", name: "Vehicle is already assigned" }, // ✅ custom
      ...vehicleStatsOptions,
    ]
    : vehicleStatsOptions;

  return (
    <div>
      <div className="tw-flex tw-flex-wrap">
        <div className="tw-w-full tw-mb-3">
          <div className="tw-border-b">
            <span className="tw-font-bold tw-block tw-mb-2">
              1. Basic Info
            </span>
          </div>
        </div>
      </div>
      <div className="tw-flex tw-flex-wrap">
        <div className="tw-w-1/3 tw-flex tw-flex-col">
          <UploadImageUpdated
            name="student-image"
            acceptFileFormat=" image/jpg, image/png, image/jpeg"
            onChange={handleFileUploadHnlr}
            value={userImageState || VehicleDefaultImg}
            invalid={true}
            error={userImageErrorState}
          />
        </div>

        <div className="tw-w-2/3">
          <div className="tw-flex tw-flex-wrap">
            <div className="tw-w-full">
              <TextInputWithRegex
                name="registrationNo"
                labelText="Registration No"
                labelClass={"tw-font-bold required"}
                value={VehicleRegistrationDetailsDataForm.values.registrationNo}
                onBlur={VehicleRegistrationDetailsDataForm.handleBlur}
                onChange={VehicleRegistrationDetailsDataForm.handleChange}
                allowedInputRegex="^[A-Z0-9]*$"
                invalid={(VehicleRegistrationDetailsDataForm.touched.registrationNo && VehicleRegistrationDetailsDataForm.errors.registrationNo) ? true : false}
                error={(VehicleRegistrationDetailsDataForm.touched.registrationNo && VehicleRegistrationDetailsDataForm.errors.registrationNo) ? VehicleRegistrationDetailsDataForm.errors.registrationNo : ""}
              />
            </div>

            <div className="tw-w-full">
              <TextInputWithRegex
                name="registrationAuthority"
                labelText="Registration Authority"
                labelClass={"tw-font-bold required"}
                value={
                  VehicleRegistrationDetailsDataForm.values
                    .registrationAuthority
                }
                onBlur={VehicleRegistrationDetailsDataForm.handleBlur}
                onChange={VehicleRegistrationDetailsDataForm.handleChange}
                                    invalid={(VehicleRegistrationDetailsDataForm.touched.registrationAuthority && VehicleRegistrationDetailsDataForm.errors.registrationAuthority) ? true : false}
                                    error={(VehicleRegistrationDetailsDataForm.touched.registrationAuthority && VehicleRegistrationDetailsDataForm.errors.registrationAuthority) ? VehicleRegistrationDetailsDataForm.errors.registrationAuthority : ""}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="tw-grid tw-grid-cols-3 tw-gap-x-4 tw-gap-y-2">
        <SelectInput
              name="manufactureId"
              value={VehicleRegistrationDetailsDataForm.values.manufactureId}
              onChange={VehicleRegistrationDetailsDataForm.handleChange}
              labelClass="fw-bold required"
              labelText="Manufacture"
              menuItems={Array.isArray(getVehicleManufactureListResp?.data) ? getVehicleManufactureListResp?.data : []}
              textKey="name"
              valueKey="id"
              invalid={(VehicleRegistrationDetailsDataForm.touched.manufactureId && VehicleRegistrationDetailsDataForm.errors.manufactureId) ? true : false}
              error={(VehicleRegistrationDetailsDataForm.touched.manufactureId && VehicleRegistrationDetailsDataForm.errors.manufactureId) ? VehicleRegistrationDetailsDataForm.errors.manufactureId : ""}
            />

        <SelectInput
          name="vehicleTypeId"
          value={VehicleRegistrationDetailsDataForm.values.vehicleTypeId}
          onChange={VehicleRegistrationDetailsDataForm.handleChange}
          onBlur={VehicleRegistrationDetailsDataForm.handleBlur}
          labelText="Vehicle Type"
          labelClass={"tw-font-bold required"}
          menuItems={getVehicleTypeListResp?.data || []}
          textKey="vehicleType"
          valueKey="id"
               invalid={(VehicleRegistrationDetailsDataForm.touched.vehicleTypeId && VehicleRegistrationDetailsDataForm.errors.vehicleTypeId) ? true : false}
              error={(VehicleRegistrationDetailsDataForm.touched.vehicleTypeId && VehicleRegistrationDetailsDataForm.errors.vehicleTypeId) ? VehicleRegistrationDetailsDataForm.errors.vehicleTypeId : ""}
        />
        <SelectInput
              name="modelId"
              value={VehicleRegistrationDetailsDataForm.values.modelId}
              onChange={VehicleRegistrationDetailsDataForm.handleChange}
              labelClass="tw-font-bold required"
              labelText="Model"
              menuItems={Array.isArray(getVehicleModelListResp?.data) ? getVehicleModelListResp?.data : []}
              textKey="name"
              valueKey="modelId"
              invalid={(VehicleRegistrationDetailsDataForm.touched.modelId && VehicleRegistrationDetailsDataForm.errors.modelId) ? true : false}
              error={(VehicleRegistrationDetailsDataForm.touched.modelId && VehicleRegistrationDetailsDataForm.errors.modelId) ? VehicleRegistrationDetailsDataForm.errors.modelId : ""}
            />
      </div>

      <div className="tw-grid tw-grid-cols-3 tw-gap-x-4 tw-gap-y-2">
         <SelectInput
              name="year"
              value={VehicleRegistrationDetailsDataForm.values.year}
              onChange={VehicleRegistrationDetailsDataForm.handleChange}
              labelClass="fw-bold"
              onBlur={VehicleRegistrationDetailsDataForm.handleBlur}
              labelText={"Year"}
              menuItems={yearOptions}
              textKey="yearType"
              valueKey="id"
              invalid={(VehicleRegistrationDetailsDataForm.touched.year && VehicleRegistrationDetailsDataForm.errors.year) ? true : false}
              error={(VehicleRegistrationDetailsDataForm.touched.year && VehicleRegistrationDetailsDataForm.errors.year) ? VehicleRegistrationDetailsDataForm.errors.year : ""}
            />

        <TextInputGroup
              name="maxPermissibleSpeed"
              value={VehicleRegistrationDetailsDataForm.values.maxPermissibleSpeed}
              onChange={
                VehicleRegistrationDetailsDataForm.handleChange
              }
              onBlur={VehicleRegistrationDetailsDataForm.handleBlur}
              labelText={"Max Permissible Speed"}
              labelClass={"fw-bold"}
              invalid={(VehicleRegistrationDetailsDataForm.touched.maxPermissibleSpeed && VehicleRegistrationDetailsDataForm.errors.maxPermissibleSpeed) ? true : false}
              error={(VehicleRegistrationDetailsDataForm.touched.maxPermissibleSpeed && VehicleRegistrationDetailsDataForm.errors.maxPermissibleSpeed) ? VehicleRegistrationDetailsDataForm.errors.maxPermissibleSpeed : ""}
            >
              Km/h
              </TextInputGroup>

        <TextInputWithRegex
              name="vehicleCapacity"
              value={VehicleRegistrationDetailsDataForm.values.vehicleCapacity}
              onChange={VehicleRegistrationDetailsDataForm.handleChange}
              inputClassName={"bg-soft-light"}
              onBlur={VehicleRegistrationDetailsDataForm.handleBlur}
              labelClass={"fw-bold"}
              labelText={"Seating Capacity"}
              allowedInputRegex="^[0-9]+$"
              maxLength={3}
              invalid={(VehicleRegistrationDetailsDataForm.touched.vehicleCapacity && VehicleRegistrationDetailsDataForm.errors.vehicleCapacity) ? true : false}
              error={(VehicleRegistrationDetailsDataForm.touched.vehicleCapacity && VehicleRegistrationDetailsDataForm.errors.vehicleCapacity) ? VehicleRegistrationDetailsDataForm.errors.vehicleCapacity : ""}
        />
        {vehicleTypeDetailsId && (
          <>
            <SelectInput
              name="vehicleStatus"
              value={
                isOccupied
                  ? "OCCUPIED"
                  : VehicleRegistrationDetailsDataForm.values.vehicleStatus
              }
              onChange={VehicleRegistrationDetailsDataForm.handleChange}
              menuItems={vehicleStatusMenu || []}
              labelClass="tw-font-bold required"
              valueKey="id"
              textKey="name"
              labelText="Vehicle Status"
              isDisabled={isOccupied}
              invalid={(VehicleRegistrationDetailsDataForm.touched.vehicleStatus && VehicleRegistrationDetailsDataForm.errors.vehicleStatus) ? true : false}
              error={(VehicleRegistrationDetailsDataForm.touched.vehicleStatus && VehicleRegistrationDetailsDataForm.errors.vehicleStatus) ? VehicleRegistrationDetailsDataForm.errors.vehicleStatus : ""}
            />
            {!isOccupied && VehicleRegistrationDetailsDataForm.values.vehicleStatus && (
              <>
                {VehicleRegistrationDetailsDataForm.values.vehicleStatus === "TRANSFER" && (
                  <>
                    <SelectInput
                      name="newInstituteId"
                      value={VehicleRegistrationDetailsDataForm.values.newInstituteId}
                      onChange={VehicleRegistrationDetailsDataForm.handleChange}
                      menuItems={Array.isArray(instituteListResp?.data) ? instituteListResp?.data : []}
                      labelClass="tw-font-bold required"
                      valueKey="id"
                      textKey="instituteName"
                      labelText="To Institute"
                      invalid={!!VehicleRegistrationDetailsDataForm.errors.newInstituteId}
                      error={VehicleRegistrationDetailsDataForm.errors.newInstituteId}
                    />
                    <SelectInput
                      name="newBranchId"
                      value={VehicleRegistrationDetailsDataForm.values.newBranchId}
                      onChange={VehicleRegistrationDetailsDataForm.handleChange}
                      menuItems={Array.isArray(branchListResp?.data) ? branchListResp?.data : []}
                      labelClass="tw-font-bold required"
                      valueKey="branchId"
                      textKey="branchName"
                      labelText="To Branch"
                      invalid={!!VehicleRegistrationDetailsDataForm.errors.newBranchId}
                      error={VehicleRegistrationDetailsDataForm.errors.newBranchId}
                    />
                  </>
                )}
                {VehicleRegistrationDetailsDataForm.values.vehicleStatus !== "ACTIVE" && (
                  <>
                    <DateInput
                      name="effectedDate"
                      labelText="Effected Date"
                      labelClass="tw-font-bold"
                      value={VehicleRegistrationDetailsDataForm.values.effectedDate}
                      onChange={VehicleRegistrationDetailsDataForm.handleChange}
                    />
                    <TextInput
                      name="remarks"
                      labelText="Remarks"
                      labelClass="tw-font-bold"
                      value={VehicleRegistrationDetailsDataForm.values.remarks}
                      onChange={VehicleRegistrationDetailsDataForm.handleChange}
                      maxLength={250}
                    />
                  </>
                )}
              </>
            )}
          </>
        )}
      </div>
      <div className="tw-grid tw-grid-cols-3 tw-gap-4">
         <DateInput
              name="registrationDate"
              value={VehicleRegistrationDetailsDataForm.values.registrationDate}
              onChange={VehicleRegistrationDetailsDataForm.handleChange}
              labelText={"Registration Date"}
              onBlur={VehicleRegistrationDetailsDataForm.handleBlur}
              labelClass="text-nowrap fw-bold"
              invalid={(VehicleRegistrationDetailsDataForm.touched.registrationDate && VehicleRegistrationDetailsDataForm.errors.registrationDate) ? true : false}
              error={(VehicleRegistrationDetailsDataForm.touched.registrationDate && VehicleRegistrationDetailsDataForm.errors.registrationDate) ? VehicleRegistrationDetailsDataForm.errors.registrationDate : ""}
            />

         <DateInput
              name="registrationRenewalDate"
              value={
                VehicleRegistrationDetailsDataForm.values
                  .registrationRenewalDate
              }
              onChange={VehicleRegistrationDetailsDataForm.handleChange}
              labelText={"Registration Renewal Date"}
              labelClass="text-nowrap fw-bold"
              invalid={(VehicleRegistrationDetailsDataForm.touched.registrationRenewalDate && VehicleRegistrationDetailsDataForm.errors.registrationRenewalDate) ? true : false}
              onBlur={VehicleRegistrationDetailsDataForm.handleBlur}
              error={(VehicleRegistrationDetailsDataForm.touched.registrationRenewalDate && VehicleRegistrationDetailsDataForm.errors.registrationRenewalDate) ? VehicleRegistrationDetailsDataForm.errors.registrationRenewalDate : ""}
            />
      </div>

      {props.activeStepId === "1" && (
        <div className="tw-flex tw-justify-end tw-gap-3">
          <Button
            variant="secondary"
            onClick={() => props.toggle()}
          >
            Cancel
          </Button>

          <Button
            variant="primary"
            onClick={(event: any) =>
              VehicleRegistrationDetailsDataForm.handleSubmit(event)
            }
          >
            Proceed
          </Button>
        </div>
      )}
    </div>
  );
};

export default VehicleRegistrationDetails;
