import { useFormik } from "formik";
import React, { useState } from "react";
import { ModalContainer, SelectInput } from "../../../Components/Common";
import { selectData1 } from "./helper";
import {
  AllocateAnotherVehicleTypes,
  LiveTrackingTypeModalProps,
} from "./LiveTrackingTypes";

const initialValues: AllocateAnotherVehicleTypes = {
  vehicle: "",
  driver: "",
  attendant: "",
};

const AllocateAnotherVehicleModal = (props: LiveTrackingTypeModalProps) => {
  const [
    allocateAnotherVehicleTypesDataState,
    setAllocateAnotherVehicleTypesDataState,
  ] = useState<AllocateAnotherVehicleTypes>(initialValues);

  const AllocateAnotherVehicleTypesForm = useFormik({
    enableReinitialize: true,
    initialValues: allocateAnotherVehicleTypesDataState,
    onSubmit: (values) => {},
  });

  return (
    <>
      <ModalContainer
        id="allocate-another-vehicle"
        modalTitle={props.modalTitle}
        isOpen={props.isOpen}
        toggle={props.toggle}
        submitHndlr={() => {}}
        cancelHndlr={props.toggle}
        cancelTitle={"Reset"}
        submitTitle={"Allocate"}
        modalSize={"md"}
        modalBodyClass="p-0"
        cancelBtnClass="btn-light text-success"
      >
        <div className="tw-inline-block tw-w-full tw-p-3 tw-border-b">

          <div className="tw-grid tw-grid-cols-12 tw-mb-2">
            <div className="tw-col-span-3">
              <h6 className="tw-text-base tw-font-normal">Route No</h6>
            </div>
            <div className="tw-col-span-9">
              <div className="tw-flex tw-flex-nowrap tw-items-center">
                <span className="tw-font-normal tw-mr-1">:</span>
                <h6 className="tw-text-base tw-font-normal tw-mb-0">ROUTE5004</h6>
              </div>
            </div>
          </div>

          <div className="tw-grid tw-grid-cols-12 tw-mb-2">
            <div className="tw-col-span-3">
              <h6 className="tw-text-base tw-font-normal">Vehicle No</h6>
            </div>
            <div className="tw-col-span-9">
              <div className="tw-flex tw-flex-nowrap tw-items-center">
                <span className="tw-font-normal tw-mr-1">:</span>
                <h6 className="tw-text-base tw-font-normal tw-mb-0">002</h6>
              </div>
            </div>
          </div>

          <div className="tw-grid tw-grid-cols-12 tw-mb-2">
            <div className="tw-col-span-3">
              <h6 className="tw-text-base tw-font-normal">Current Stop</h6>
            </div>
            <div className="tw-col-span-9">
              <div className="tw-flex tw-flex-nowrap tw-items-center">
                <span className="tw-font-normal tw-mr-1">:</span>
                <h6 className="tw-text-base tw-font-normal tw-mb-0">
                  Roayal Villas Ootapally
                </h6>
              </div>
            </div>
          </div>

          <div className="tw-grid tw-grid-cols-12 tw-mb-2">
            <div className="tw-col-span-3">
              <h6 className="tw-text-base tw-font-normal">Address</h6>
            </div>
            <div className="tw-col-span-9">
              <div className="tw-flex tw-flex-nowrap tw-items-start">
                <span className="tw-font-normal tw-mr-1">:</span>
                <h6 className="tw-text-base tw-font-normal tw-mb-0">
                  Telangana Secretariat reads NTR Marg, Public Gardens,
                  Khairatabad, Hyderabad, Telangana 500004.
                </h6>
              </div>
            </div>
          </div>
        </div>

        <div className="tw-inline-block tw-w-full tw-p-3">

          <div className="tw-grid tw-grid-cols-12 tw-gap-4">
            <div className="tw-col-span-12 md:tw-col-span-6">
              <SelectInput
                name="vehicle"
                labelText="Vehicle"
                value={AllocateAnotherVehicleTypesForm.values.vehicle}
                onChange={AllocateAnotherVehicleTypesForm.handleChange}
                menuItems={selectData1}
                valueKey="vehicleType"
                textKey="vehicleType"
              />
            </div>
          </div>

          <div className="tw-grid tw-grid-cols-12 tw-gap-4">
            <div className="tw-col-span-12 md:tw-col-span-6">
              <SelectInput
                name="driver"
                labelText="Driver"
                value={AllocateAnotherVehicleTypesForm.values.driver}
                onChange={AllocateAnotherVehicleTypesForm.handleChange}
                menuItems={selectData1}
                valueKey="driverType"
                textKey="driverType"
              />
            </div>

            <div className="tw-col-span-12 md:tw-col-span-6">
              <SelectInput
                name="attendant"
                labelText="Attendant"
                value={AllocateAnotherVehicleTypesForm.values.attendant}
                onChange={AllocateAnotherVehicleTypesForm.handleChange}
                menuItems={selectData1}
                valueKey="attendantType"
                textKey="attendantType"
              />
            </div>
          </div>
        </div>
      </ModalContainer>
    </>
  );
};

export default AllocateAnotherVehicleModal;
