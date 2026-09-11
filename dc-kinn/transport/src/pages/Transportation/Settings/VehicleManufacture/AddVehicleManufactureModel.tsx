import React, { useEffect, useRef } from "react";
import { ArrayHelpers, FieldArray, FormikProvider, useFormik } from "formik";
import { TextInput } from "../../../../Components/Common";
import { generateUniqueNumber } from "../../../../utility/commonutility";
import * as Yup from "yup";
import { useAppDispatch } from "../../../../hooks/storehook";
import { Delete02StrokeStandard } from "@hugeicons-pro/core-stroke-standard";
import { HugeiconsIcon } from "@hugeicons/react";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { saveVehicleManufactureDetailsAct } from "../../../../store/transportation/settings/vehicledetails/vehicledetaileaction";
import Button from "../../../../Components/Common/Button";

const initialValues = {
  vehicleManufactureNames: [
    {
      uniqueId: generateUniqueNumber(),
      vehicleManufacture: "",
      vehicleManufactureCode: "",
      vehicleManufactureCountry: "",
    },
  ],
  manufactureModels: []
};

const validationSchema = Yup.object().shape({
  vehicleManufactureNames: Yup.array().of(
    Yup.object().shape({
      vehicleManufacture: Yup.string().nullable().required('Manufacture Name is required'),
      vehicleManufactureCode: Yup.string().nullable().required('Code is required'),
      vehicleManufactureCountry: Yup.string().nullable().required('Country is required'),
    })
  )
})

const AddVehicleManufactureModel = (props: any) => {
  const formikArrayHelpers = useRef<ArrayHelpers | null>(null);
  const dispatch = useAppDispatch();

  const addVehicleManufactureFormik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      const { vehicleManufactureNames } = values;
      const payload = {
        manufacturers: vehicleManufactureNames.map((item: any) => ({
          name: item.vehicleManufacture,
          code: item.vehicleManufactureCode,
          country: item.vehicleManufactureCountry
        }))
      };
      dispatch(saveVehicleManufactureDetailsAct(generateActionPayload("save_vehicle_manufacture", undefined, payload)));
    },
  });

  useEffect(() => {
    if (!props.isOpen) {
      addVehicleManufactureFormik.resetForm();
    }
  }, [props.isOpen]);

  function addNewCommanAlimentsHndlr(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    if (formikArrayHelpers.current) {
      formikArrayHelpers.current.push({
        uniqueId: generateUniqueNumber(),
        vehicleManufacture: "",
        vehicleManufactureCode: "",
        vehicleManufactureCountry: "",
      });
    }
  }

  function removeCommanAlinmentsHndlr(event: React.MouseEvent<HTMLButtonElement>) {
    const rowIndex = event.currentTarget.getAttribute("data-index");
    if (rowIndex !== undefined || rowIndex !== null) {
      formikArrayHelpers.current?.remove(Number(rowIndex));
    }
  }

  return (
    <>
      <form>
        <div className="tw-p-5">
          <div className="tw-grid tw-grid-cols-12 tw-gap-4">
            <div className="tw-col-span-12 md:tw-col-span-4">
              <h6 className="tw-text-sm tw-font-medium">
                Manufacture <span className="tw-text-red-500">*</span>
              </h6>
            </div>
            <div className="tw-col-span-12 md:tw-col-span-4">
              <h6 className="tw-text-sm tw-font-medium">
                Code <span className="tw-text-red-500">*</span>
              </h6>
            </div>
            <div className="tw-col-span-12 md:tw-col-span-4">
              <h6 className="tw-text-sm tw-font-medium">
                Country <span className="tw-text-red-500">*</span>
              </h6>
            </div>
          </div>
          <FormikProvider value={addVehicleManufactureFormik}>
            <FieldArray name="vehicleManufactureNames">
              {(arrayHelpers: ArrayHelpers) => {
                if (!formikArrayHelpers.current) {
                  formikArrayHelpers.current = arrayHelpers;
                }

                return (
                  <>
                    {addVehicleManufactureFormik.values.vehicleManufactureNames?.length > 0 &&
                      addVehicleManufactureFormik.values.vehicleManufactureNames?.map(
                        (vehicleManufactures: any, index: any) => {
                          const inputFieldErrors: any = addVehicleManufactureFormik.errors.vehicleManufactureNames && addVehicleManufactureFormik.errors.vehicleManufactureNames[index] || {};
                          const inputFieldTouched = addVehicleManufactureFormik.touched.vehicleManufactureNames && addVehicleManufactureFormik.touched.vehicleManufactureNames[index] || {};

                          return (
                            <div
                              key={vehicleManufactures.uniqueId}
                              className="tw-grid tw-grid-cols-12 tw-gap-4 tw-mb-4"
                            >
                              <div className="tw-col-span-12 md:tw-col-span-4">
                                <TextInput
                                  name={`vehicleManufactureNames[${index}].vehicleManufacture`}
                                  formgroupClassName="tw-mb-0"
                                  value={vehicleManufactures.vehicleManufacture}
                                  onChange={addVehicleManufactureFormik.handleChange}
                                  onBlur={addVehicleManufactureFormik.handleBlur}
                                  invalid={(inputFieldTouched.vehicleManufacture && inputFieldErrors.vehicleManufacture) ? true : false}
                                  error={(inputFieldTouched.vehicleManufacture && inputFieldErrors.vehicleManufacture) ? inputFieldErrors.vehicleManufacture : ""}
                                />
                              </div>
                              <div className="tw-col-span-12 md:tw-col-span-4">
                                <TextInput
                                  name={`vehicleManufactureNames[${index}].vehicleManufactureCode`}
                                  formgroupClassName="tw-mb-0"
                                  value={vehicleManufactures.vehicleManufactureCode}
                                  onChange={addVehicleManufactureFormik.handleChange}
                                  onBlur={addVehicleManufactureFormik.handleBlur}
                                  invalid={(inputFieldTouched.vehicleManufactureCode && inputFieldErrors.vehicleManufactureCode) ? true : false}
                                  error={(inputFieldTouched.vehicleManufactureCode && inputFieldErrors.vehicleManufactureCode) ? inputFieldErrors.vehicleManufactureCode : ""}
                                />
                              </div>
                              <div className="tw-col-span-12 md:tw-col-span-3">
                                <div className="tw-flex-1">
                                  <TextInput
                                    name={`vehicleManufactureNames[${index}].vehicleManufactureCountry`}
                                    formgroupClassName="tw-mb-0"
                                    value={vehicleManufactures.vehicleManufactureCountry}
                                    onChange={addVehicleManufactureFormik.handleChange}
                                    onBlur={addVehicleManufactureFormik.handleBlur}
                                    invalid={(inputFieldTouched.vehicleManufactureCountry && inputFieldErrors.vehicleManufactureCountry) ? true : false}
                                    error={(inputFieldTouched.vehicleManufactureCountry && inputFieldErrors.vehicleManufactureCountry) ? inputFieldErrors.vehicleManufactureCountry : ""}
                                  />
                                </div>
                              </div>
                              {index !== 0 && (
                                <div className="tw-col-span-12 md:tw-col-span-1">
                                  <Button
                                    type="button"
                                    variant="wrong"
                                    data-index={index}
                                    onClick={removeCommanAlinmentsHndlr}
                                    className="!tw-px-3 !tw-py-2"
                                  >
                                    <HugeiconsIcon
                                      icon={Delete02StrokeStandard}
                                      size={18}
                                    />
                                  </Button>
                                </div>
                              )}
                            </div>
                          );
                        }
                      )}
                  </>
                );
              }}
            </FieldArray>
          </FormikProvider>
          {!props?.alignId && (
            <div className="tw-mb-0">
              <Button
                type="button"
                variant="hoverInfo"
                className="tw-flex tw-items-center !tw-px-2 !tw-py-2"
                onClick={addNewCommanAlimentsHndlr}
              >
                <i className="ri-add-line tw-mr-2" />
                Add New
              </Button>
            </div>
          )}
          <div className="tw-flex tw-justify-end tw-gap-3 tw-mt-3">
            <Button type="button" variant="secondary" onClick={props.toggle}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={(event: any) =>
                addVehicleManufactureFormik.handleSubmit(event)
              }
            >
              {props.alignId ? "Update" : "Submit"}
            </Button>
          </div>
        </div>
      </form>
    </>
  );
};

export default AddVehicleManufactureModel;
