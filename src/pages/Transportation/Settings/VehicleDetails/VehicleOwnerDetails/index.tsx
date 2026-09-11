import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import {
  DateInput,
  SelectInput,
  TextInput,
  TextInputGroup,
} from "../../../../../Components/Common";
import * as Yup from "yup";
import { default as RupeeSvg } from "../../../../../assets/imagesdps/feeDashboard/RupeeSvg.svg?react";
import { useAppSelector } from "../../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import Button from "../../../../../Components/Common/Button";

const initialValues: any = {
  ownerName: "",
  ownerAddress: "",
  engineNo: "",
  chassisNo: "",
  busLength: "",
  busWidth: "",
  weight: "",
  wheelBase: "",
  groundClearance: "",
  mainEngineBatteries: "",
  acUnitBatteries: "",
  invoicePrice: "",
  onRoadPrice: "",
  typeOfBody: "",
  fuelTankCapacity: "",
  mileage: "",
  measuringUnit: "",
  odoMeterReading: "",
  challanNo: "",
  challanCharges: "",
  challanPaidDate: "",
  fuelTypeId: "",
  
  // vehicleType: "",
  // registeredCity: "",
  // vehicleCapacity: "",
  // permitNo: "",
  // permitCharges: "",
  // permitDate: "",
  // permitExpiryDate: "",
  // permitArea: "",
  // hpaWith: "",
  // gcWeight: 0,
  // bodyType: "",
  // enginetankCapacityNo: "",
  // purchaseCost: 0,
};

const validationSchema = Yup.object({
  // ownerName : Yup.string().required("Owner Name is Required").nullable(),
  // ownerAddress : Yup.string().required("Owner Address is Required").nullable(),
  // engineNo : Yup.string().required("Vehicle Engine No is Required").nullable(),
  // chassisNo : Yup.string().required("Vehicle Chassis No is Required").nullable(),
  busLength : Yup.number().typeError("Enter a valid number.").nullable(),
  busWidth : Yup.number().typeError("Enter a valid number.").nullable(),
  weight : Yup.number().typeError("Enter a valid number.").nullable(),
  // wheelBase : Yup.string().required("Wheel Base is Required").nullable(),
  groundClearance : Yup.number().typeError("Enter a valid number.").nullable(),
  // mainEngineBatteries : Yup.string().required("Main Engine Batteries is Required").nullable(),
  // acUnitBatteries : Yup.string().required("AC Unit Batteries is Required").nullable(),
  invoicePrice : Yup.number().typeError("Enter a valid number.").nullable(),
  onRoadPrice : Yup.number().typeError("Enter a valid number.").nullable(),
  // typeOfBody : Yup.string().required("Type Of Body is Required").nullable(),
  fuelTankCapacity : Yup.number().typeError("Enter a valid number.").nullable(),
  // fuelTypeId : Yup.string().required("Fuel Type Capacity is Required").nullable(),
  mileage : Yup.number().typeError("Enter a valid number.").nullable(),
  // measuringUnit : Yup.string().required("Measuring Unit is Required").nullable(),
  // odoMeterReading : Yup.number().required("Odo Meter Reading is Required").nullable(),
  // challanNo : Yup.string().required("Challan No is Required").nullable(),
  challanCharges : Yup.number().typeError("Enter a valid number.").nullable(),
  // challanPaidDate : Yup.string().required("Challan Paid Date is Required").nullable(),
  
})

const VehicleOwnerDetails = (props:any) => {

  const {state : vehicleDetailsState } = props || {};

  const {currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    showApiLoader,
    getFuelTypeListResp,
   } = useAppSelector(({ transportrequest,appData,globalData,vehicleDetailRequest }) => ({
  
    currentBranchIdResp: appData.currentBranchIdResp,
    currentInstIdResp: appData.currentInstIdResp,
    showApiLoader : globalData.showApiLoader,
   getFuelTypeListResp:vehicleDetailRequest.getFuelTypeListResp,

  }), shallowEqual);

  const VehicleOwnerDetailsData = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema,
    onSubmit: (values) => {
      props.updateStepHndlr("stepup",values,"2")
     },
  });

  useEffect(() => {
    if(vehicleDetailsState?.ownerInfo){
      VehicleOwnerDetailsData.setValues(vehicleDetailsState?.ownerInfo)
    }
  }, [])

  return (
    <div className="vehicleowner-wapper">
      <div className="tw-mb-3">
  <div className="tw-border-b">
    <span className="tw-block tw-mb-2 tw-font-bold tw-text-base">
      2. Vehicle Owner & Engine
    </span>
  </div>
</div>

      <div className="row">
        <div className="tw-space-y-4">

          <div className="tw-grid tw-grid-cols-12 tw-gap-4">
            <div className="tw-col-span-4">
              <TextInput
                name="ownerName"
                value={VehicleOwnerDetailsData.values.ownerName}
                onChange={VehicleOwnerDetailsData.handleChange}
                inputClassName="bg-soft-light"
                labelClass="fw-bold"
                labelText="Owner Name"
                invalid={VehicleOwnerDetailsData.touched.ownerName && !!VehicleOwnerDetailsData.errors.ownerName}
                onBlur={VehicleOwnerDetailsData.handleBlur}
              error={(VehicleOwnerDetailsData.touched.ownerName && VehicleOwnerDetailsData.errors.ownerName) ? VehicleOwnerDetailsData.errors.ownerName : ""}
              />
            </div>

            <div className="tw-col-span-8">
              <TextInput
                name="ownerAddress"
                value={VehicleOwnerDetailsData.values.ownerAddress}
                onChange={VehicleOwnerDetailsData.handleChange}
                inputClassName="bg-soft-light"
                labelClass="fw-bold"
                labelText="Owner Address"
                invalid={VehicleOwnerDetailsData.touched.ownerAddress && !!VehicleOwnerDetailsData.errors.ownerAddress}
                onBlur={VehicleOwnerDetailsData.handleBlur}
              error={(VehicleOwnerDetailsData.touched.ownerAddress && VehicleOwnerDetailsData.errors.ownerAddress) ? VehicleOwnerDetailsData.errors.ownerAddress : ""}
              />
            </div>
          </div>

          <div className="tw-grid tw-grid-cols-12 tw-gap-4">
            <div className="tw-col-span-4">
              <TextInput
                name="engineNo"
                value={VehicleOwnerDetailsData.values.engineNo}
                onChange={VehicleOwnerDetailsData.handleChange}
                labelText="Vehicle Engine no"
                labelClass="fw-bold"
                invalid={VehicleOwnerDetailsData.touched.engineNo && !!VehicleOwnerDetailsData.errors.engineNo}
                onBlur={VehicleOwnerDetailsData.handleBlur}
              error={(VehicleOwnerDetailsData.touched.engineNo && VehicleOwnerDetailsData.errors.engineNo) ? VehicleOwnerDetailsData.errors.engineNo : ""}
              />
            </div>

            <div className="tw-col-span-4">
              <TextInput
                name="chassisNo"
                value={VehicleOwnerDetailsData.values.chassisNo}
                onChange={VehicleOwnerDetailsData.handleChange}
                labelText="Vehicle Chassis No"
                labelClass="fw-bold"
                invalid={VehicleOwnerDetailsData.touched.chassisNo && !!VehicleOwnerDetailsData.errors.chassisNo}
                onBlur={VehicleOwnerDetailsData.handleBlur}
              error={(VehicleOwnerDetailsData.touched.chassisNo && VehicleOwnerDetailsData.errors.chassisNo) ? VehicleOwnerDetailsData.errors.chassisNo : ""}
              />
            </div>

            <div className="tw-col-span-4">
              <TextInputGroup
                name="busLength"
                value={VehicleOwnerDetailsData.values.busLength}
                onChange={VehicleOwnerDetailsData.handleChange}
                inputClassName="bg-soft-light"
                labelClass="fw-bold"
                labelText="Bus Length"
                invalid={VehicleOwnerDetailsData.touched.busLength && !!VehicleOwnerDetailsData.errors.busLength}
                onBlur={VehicleOwnerDetailsData.handleBlur}
              error={(VehicleOwnerDetailsData.touched.busLength && VehicleOwnerDetailsData.errors.busLength) ? VehicleOwnerDetailsData.errors.busLength : ""}
            > m
              </TextInputGroup>
            </div>
          </div>

          <div className="tw-grid tw-grid-cols-12 tw-gap-4">
            <div className="tw-col-span-4">
              <TextInputGroup
                name="busWidth"
                value={VehicleOwnerDetailsData.values.busWidth}
                onChange={VehicleOwnerDetailsData.handleChange}
                labelText="Bus Width"
                labelClass="fw-bold"
                invalid={VehicleOwnerDetailsData.touched.busWidth && !!VehicleOwnerDetailsData.errors.busWidth}
                onBlur={VehicleOwnerDetailsData.handleBlur}
              error={(VehicleOwnerDetailsData.touched.busWidth && VehicleOwnerDetailsData.errors.busWidth) ? VehicleOwnerDetailsData.errors.busWidth : ""}
            >m
              </TextInputGroup>
            </div>

            <div className="tw-col-span-4">
              <TextInputGroup
                name="weight"
                value={VehicleOwnerDetailsData.values.weight}
                onChange={VehicleOwnerDetailsData.handleChange}
                labelText="Weight"
                labelClass="fw-bold"
                invalid={VehicleOwnerDetailsData.touched.weight && !!VehicleOwnerDetailsData.errors.weight}
                onBlur={VehicleOwnerDetailsData.handleBlur}
              error={(VehicleOwnerDetailsData.touched.weight && VehicleOwnerDetailsData.errors.weight) ? VehicleOwnerDetailsData.errors.weight : ""}
            >Kg
              </TextInputGroup>
            </div>

            <div className="tw-col-span-4">
              <TextInputGroup
                name="wheelBase"
                value={VehicleOwnerDetailsData.values.wheelBase}
                onChange={VehicleOwnerDetailsData.handleChange}
                inputClassName="bg-soft-light"
                labelClass="fw-bold"
                labelText="Wheel Base"
                invalid={VehicleOwnerDetailsData.touched.wheelBase && !!VehicleOwnerDetailsData.errors.wheelBase}
                onBlur={VehicleOwnerDetailsData.handleBlur}
              error={(VehicleOwnerDetailsData.touched.wheelBase && VehicleOwnerDetailsData.errors.wheelBase) ? VehicleOwnerDetailsData.errors.wheelBase : ""}
            >m
              </TextInputGroup>
            </div>
          </div>

          <div className="tw-grid tw-grid-cols-12 tw-gap-4">
            <div className="tw-col-span-4">
              <TextInputGroup
                name="groundClearance"
                value={VehicleOwnerDetailsData.values.groundClearance}
                onChange={VehicleOwnerDetailsData.handleChange}
                labelText="Ground Clearance"
                labelClass="fw-bold"
                invalid={VehicleOwnerDetailsData.touched.groundClearance && !!VehicleOwnerDetailsData.errors.groundClearance}
                onBlur={VehicleOwnerDetailsData.handleBlur}
              error={(VehicleOwnerDetailsData.touched.groundClearance && VehicleOwnerDetailsData.errors.groundClearance) ? VehicleOwnerDetailsData.errors.groundClearance : ""}
            >cm
              </TextInputGroup>
            </div>

            <div className="tw-col-span-4">
              <TextInput
                name="mainEngineBatteries"
                value={VehicleOwnerDetailsData.values.mainEngineBatteries}
                onChange={VehicleOwnerDetailsData.handleChange}
                inputClassName="bg-soft-light"
                labelClass="fw-bold"
                labelText="Main Engine Batteries"
                invalid={VehicleOwnerDetailsData.touched.mainEngineBatteries && !!VehicleOwnerDetailsData.errors.mainEngineBatteries}
                onBlur={VehicleOwnerDetailsData.handleBlur}
              error={(VehicleOwnerDetailsData.touched.mainEngineBatteries && VehicleOwnerDetailsData.errors.mainEngineBatteries) ? VehicleOwnerDetailsData.errors.mainEngineBatteries : ""}
              />
            </div>

            <div className="tw-col-span-4">
              <TextInput
                name="acUnitBatteries"
                value={VehicleOwnerDetailsData.values.acUnitBatteries}
                onChange={VehicleOwnerDetailsData.handleChange}
                inputClassName="bg-soft-light"
                labelClass="fw-bold"
                labelText="A/C Unit Batteries"
                invalid={VehicleOwnerDetailsData.touched.acUnitBatteries && !!VehicleOwnerDetailsData.errors.acUnitBatteries}
                onBlur={VehicleOwnerDetailsData.handleBlur}
              error={(VehicleOwnerDetailsData.touched.acUnitBatteries && VehicleOwnerDetailsData.errors.acUnitBatteries) ? VehicleOwnerDetailsData.errors.acUnitBatteries : ""}
              />
            </div>
          </div>

        </div>
        <div className="tw-grid tw-grid-cols-12 tw-gap-4">

          <div className="tw-col-span-4">
            <TextInputGroup
              name="invoicePrice"
              labelText="Purchased Cost"
              inputClassName="bg-soft-light"
              formgroupClassName="tw-mb-0 tw-w-full"
              value={VehicleOwnerDetailsData.values.invoicePrice}
              onChange={VehicleOwnerDetailsData.handleChange}
              labelClass="fw-bold"
              invalid={VehicleOwnerDetailsData.touched.invoicePrice && !!VehicleOwnerDetailsData.errors.invoicePrice}
              onBlur={VehicleOwnerDetailsData.handleBlur}
              error={(VehicleOwnerDetailsData.touched.invoicePrice && VehicleOwnerDetailsData.errors.invoicePrice) ? VehicleOwnerDetailsData.errors.invoicePrice : ""}
            >
              <RupeeSvg width="12px" height="12px" fill="#3B3B3B" />
            </TextInputGroup>
          </div>

          <div className="tw-col-span-4">
            <TextInputGroup
              name="onRoadPrice"
              labelText="On Road Price"
              inputClassName="bg-soft-light"
              formgroupClassName="tw-mb-0 tw-w-full"
              value={VehicleOwnerDetailsData.values.onRoadPrice}
              onChange={VehicleOwnerDetailsData.handleChange}
              labelClass="fw-bold"
              invalid={VehicleOwnerDetailsData.touched.onRoadPrice && !!VehicleOwnerDetailsData.errors.onRoadPrice}
              onBlur={VehicleOwnerDetailsData.handleBlur}
              error={(VehicleOwnerDetailsData.touched.onRoadPrice && VehicleOwnerDetailsData.errors.onRoadPrice) ? VehicleOwnerDetailsData.errors.onRoadPrice : ""}
            >
              <RupeeSvg width="12px" height="12px" fill="#3B3B3B" />
            </TextInputGroup>
          </div>

          <div className="tw-col-span-4">
            <SelectInput
              name="fuelTypeId"
              value={VehicleOwnerDetailsData.values.fuelTypeId}
              onChange={VehicleOwnerDetailsData.handleChange}
              menuItems={getFuelTypeListResp || []}
              valueKey="id"
              textKey="fuelTypeName"
              inputClassName="bg-soft-light"
              labelClass="fw-bold"
              labelText="Fuel Type"
              invalid={VehicleOwnerDetailsData.touched.fuelTypeId && !!VehicleOwnerDetailsData.errors.fuelTypeId}
              onBlur={VehicleOwnerDetailsData.handleBlur}
              error={(VehicleOwnerDetailsData.touched.fuelTypeId && VehicleOwnerDetailsData.errors.fuelTypeId) ? VehicleOwnerDetailsData.errors.fuelTypeId : ""}
            // defaultSelect={"Petrol"}
            />
          </div>

        </div>
        <div className="tw-grid tw-grid-cols-12 tw-gap-4">

          <div className="tw-col-span-4">
            <TextInput
              name="typeOfBody"
              value={VehicleOwnerDetailsData.values.typeOfBody}
              onChange={VehicleOwnerDetailsData.handleChange}
              labelText="Type of Body"
              labelClass="fw-bold"
              invalid={VehicleOwnerDetailsData.touched.typeOfBody && !!VehicleOwnerDetailsData.errors.typeOfBody}
              onBlur={VehicleOwnerDetailsData.handleBlur}
              error={(VehicleOwnerDetailsData.touched.typeOfBody && VehicleOwnerDetailsData.errors.typeOfBody) ? VehicleOwnerDetailsData.errors.typeOfBody : ""}
            />
          </div>

          <div className="tw-col-span-4">
            <TextInputGroup
              name="fuelTankCapacity"
              value={VehicleOwnerDetailsData.values.fuelTankCapacity}
              onChange={VehicleOwnerDetailsData.handleChange}
              labelText="Tank Capacity"
              labelClass="fw-bold"
              invalid={VehicleOwnerDetailsData.touched.fuelTankCapacity && !!VehicleOwnerDetailsData.errors.fuelTankCapacity}
              onBlur={VehicleOwnerDetailsData.handleBlur}
              error={(VehicleOwnerDetailsData.touched.fuelTankCapacity && VehicleOwnerDetailsData.errors.fuelTankCapacity) ? VehicleOwnerDetailsData.errors.fuelTankCapacity : ""}
            >L
            </TextInputGroup>
          </div>

          <div className="tw-col-span-4">
            <TextInputGroup
              name="mileage"
              value={VehicleOwnerDetailsData.values.mileage}
              onChange={VehicleOwnerDetailsData.handleChange}
              inputClassName="bg-soft-light"
              labelClass="fw-bold"
              labelText="Mileage"
              invalid={VehicleOwnerDetailsData.touched.mileage && !!VehicleOwnerDetailsData.errors.mileage}
              onBlur={VehicleOwnerDetailsData.handleBlur}
              error={(VehicleOwnerDetailsData.touched.mileage && VehicleOwnerDetailsData.errors.mileage) ? VehicleOwnerDetailsData.errors.mileage : ""}
            >Km/l
            </TextInputGroup>
          </div>

        </div>
        <div className="tw-grid tw-grid-cols-12 tw-gap-4">

          <div className="tw-col-span-4">
            <TextInput
              name="measuringUnit"
              value={VehicleOwnerDetailsData.values.measuringUnit}
              onChange={VehicleOwnerDetailsData.handleChange}
              inputClassName="bg-soft-light"
              labelClass="fw-bold"
              labelText="Measuring Unit"
              invalid={VehicleOwnerDetailsData.touched.measuringUnit && !!VehicleOwnerDetailsData.errors.measuringUnit}
              onBlur={VehicleOwnerDetailsData.handleBlur}
              error={VehicleOwnerDetailsData.touched.measuringUnit ? VehicleOwnerDetailsData.errors.measuringUnit : ""}
            />
          </div>

          <div className="tw-col-span-4">
            <TextInput
              name="odoMeterReading"
              value={VehicleOwnerDetailsData.values.odoMeterReading}
              onChange={VehicleOwnerDetailsData.handleChange}
              inputClassName="bg-soft-light"
              labelClass="fw-bold"
              labelText="Odometer Reading"
              inputType="number"
              invalid={VehicleOwnerDetailsData.touched.odoMeterReading && !!VehicleOwnerDetailsData.errors.odoMeterReading}
              onBlur={VehicleOwnerDetailsData.handleBlur}
              error={VehicleOwnerDetailsData.touched.odoMeterReading ? VehicleOwnerDetailsData.errors.odoMeterReading : ""}
            />
          </div>

          <div className="tw-col-span-4">
            <TextInput
              name="challanNo"
              value={VehicleOwnerDetailsData.values.challanNo}
              onChange={VehicleOwnerDetailsData.handleChange}
              inputClassName="bg-soft-light"
              labelClass="fw-bold"
              labelText="Challan No"
              invalid={VehicleOwnerDetailsData.touched.challanNo && !!VehicleOwnerDetailsData.errors.challanNo}
              onBlur={VehicleOwnerDetailsData.handleBlur}
              error={VehicleOwnerDetailsData.touched.challanNo ? VehicleOwnerDetailsData.errors.challanNo : ""}
            />
          </div>

        </div>
        <div className="tw-grid tw-grid-cols-12 tw-gap-4">

          <div className="tw-col-span-4">
            <TextInputGroup
              name="challanCharges"
              labelText="Challan Charges"
              inputClassName="bg-soft-light"
              formgroupClassName="tw-mb-0 tw-w-full"
              value={VehicleOwnerDetailsData.values.challanCharges}
              onChange={VehicleOwnerDetailsData.handleChange}
              labelClass="fw-bold"
              invalid={VehicleOwnerDetailsData.touched.challanCharges && !!VehicleOwnerDetailsData.errors.challanCharges}
              onBlur={VehicleOwnerDetailsData.handleBlur}
              error={VehicleOwnerDetailsData.touched.challanCharges ? VehicleOwnerDetailsData.errors.challanCharges : ""}
            >
              <RupeeSvg width="12px" height="12px" fill="#3B3B3B" />
            </TextInputGroup>
          </div>

          <div className="tw-col-span-4">
            <DateInput
              name="challanPaidDate"
              value={VehicleOwnerDetailsData.values.challanPaidDate}
              onChange={VehicleOwnerDetailsData.handleChange}
              labelText="Challan Paid Date"
              labelClass="text-nowrap fw-bold"
              invalid={VehicleOwnerDetailsData.touched.challanPaidDate && !!VehicleOwnerDetailsData.errors.challanPaidDate}
              onBlur={VehicleOwnerDetailsData.handleBlur}
              error={VehicleOwnerDetailsData.touched.challanPaidDate ? VehicleOwnerDetailsData.errors.challanPaidDate : ""}
            />
          </div>

        </div>
        
      </div>
      {props.activeStepId === "2" && (
        <div className="tw-flex tw-justify-end tw-mb-3 tw-gap-2">

          <Button
            variant="secondary"
            onClick={() => props.updateStepHndlr("stepdown")}
          >
            Previous
          </Button>

          <Button
            variant="primary"
            onClick={(event: any) => VehicleOwnerDetailsData.handleSubmit(event)}
          >
            Proceed
          </Button>

        </div>
      )}

    </div>
  );
};

export default VehicleOwnerDetails;
