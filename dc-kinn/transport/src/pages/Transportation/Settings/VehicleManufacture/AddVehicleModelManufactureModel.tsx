import React, { useState, useEffect, useRef } from "react";
import { ArrayHelpers, FieldArray, FormikProvider, useFormik } from "formik";
import { SelectInput, TextInput } from "../../../../Components/Common";
import { generateUniqueNumber } from "../../../../utility/commonutility";
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { shallowEqual } from "react-redux";
import { getVehicleTypeListAct } from "../../../../store/transportation/transportationaction";
import { Delete02StrokeStandard } from "@hugeicons-pro/core-stroke-standard";
import { HugeiconsIcon } from "@hugeicons/react";
import Button from "../../../../Components/Common/Button";
import { saveVehicleModelManufactureDetailsAct } from "../../../../store/transportation/settings/vehicledetails/vehicledetaileaction";

const initialValues = {
  manufacturerId: "",
  manufacturerName: "",
  manufacturerCode: "",
  manufacturerCountry: "",
  modelNames: [
    {
      uniqueId: generateUniqueNumber(),
      modelId: "",
      modelName: "",
      code: "",
      vehicleTypeId: "",
    },
  ],
};


const validationSchema = Yup.object().shape({
  manufacturerName: Yup.string().required("Manufacturer Name is required"),
  manufacturerCode: Yup.string().required("Code is required"),
  manufacturerCountry: Yup.string().required("Country is required"),
  modelNames: Yup.array().of(
    Yup.object().shape({
      modelName: Yup.string().required("Model Name is required"),
      code: Yup.string().required("Model Code is required"),
      vehicleTypeId: Yup.string().required("Vehicle is required"),
    })
  ),
});


const AddVehicleModelManufactureModel = (props: any) => {
  const formikArrayHelpers = useRef<ArrayHelpers | null>(null);
  const dispatch = useAppDispatch();

  const {
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    showApiLoader,
    getVehicleTypeListResp,
    getVehicleManufactureDetailListResp,
  } = useAppSelector(
    ({ healthRecords, appData, transportrequest, globalData, vehicleDetailRequest }) => ({
      currentBranchIdResp: appData.currentBranchIdResp,
      showApiLoader: globalData.showApiLoader,
      currentInstIdResp: appData.currentInstIdResp,
      getVehicleTypeListResp: transportrequest.getVehicleTypeListResp,
      getVehicleManufactureDetailListResp: vehicleDetailRequest.getVehicleManufactureDetailListResp,
    }),
    shallowEqual
  );

  useEffect(() => {
    dispatch(getVehicleTypeListAct(generateActionPayload("get_vehicle_type_list", undefined, { branchId, instituteId, pageNo: 0, pageSize: 100 })));
  }, [branchId, instituteId])

  const vehicleModelManufactureFormik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      const payload = {
        manufacturerId: props?.id
          ? Number(props.id)
          : values.manufacturerId || null,

        manufacturerName: values.manufacturerName,
        manufacturerCode: values.manufacturerCode,
        manufacturerCountry: values.manufacturerCountry,

        modelNames: values.modelNames
          .filter((item) => item.modelName.trim() !== "")
          .map((item) => ({
            modelId: item.modelId || null,
            modelName: item.modelName,
            code: item.code,
            vehicleTypeId: Number(item.vehicleTypeId),
          })),
      };
      dispatch(saveVehicleModelManufactureDetailsAct(generateActionPayload("save_vehicle_manufacture_model", undefined, payload)));
    }
  });

  useEffect(() => {
    if (props?.id && getVehicleManufactureDetailListResp?.data?.length > 0) {
      const selectedManufacturer =
        getVehicleManufactureDetailListResp.data.find(
          (item: any) => item.id === Number(props.id)
        );

      if (selectedManufacturer) {
        const { id, manufacturerName, manufacturerCode, manufacturerCountry, models } = selectedManufacturer;

        vehicleModelManufactureFormik.setValues({
          manufacturerId: id,
          manufacturerName,
          manufacturerCode,
          manufacturerCountry,
          modelNames:
            models && models.length > 0
              ? models.map((model: any) => ({
                uniqueId: `model-${model.modelId}`,
                modelId: model.modelId,
                modelName: model.modelName,
                code: model.code,
                vehicleTypeId: model.vehicleTypeId,
              }))
              : [
                {
                  uniqueId: generateUniqueNumber(),
                  modelId: "",
                  modelName: "",
                  code: "",
                  vehicleTypeId: "",
                },
              ],
        });
      }
    }
  }, [props.id, getVehicleManufactureDetailListResp]);

  function addNewCommanAlimentsHndlr(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    if (formikArrayHelpers.current) {
      formikArrayHelpers.current.push({
        uniqueId: generateUniqueNumber(),
        modelName: "",
        code: "",
        vehicleTypeId: "",
      });
    }
  }

  function removeCommanAlinmentsHndlr(index: number) {
    if (formikArrayHelpers.current) {
      formikArrayHelpers.current.remove(index);
    }
  }

  return (
    <>
      <form>
        <div className="tw-p-5">
          <div className="tw-grid tw-grid-cols-12 tw-gap-4 tw-mb-2">
            <div className="tw-col-span-12 md:tw-col-span-4">
              <TextInput
                name="manufacturerName"
                labelText="Manufacturer Name"
                value={vehicleModelManufactureFormik.values.manufacturerName}
                onChange={vehicleModelManufactureFormik.handleChange}
                onBlur={vehicleModelManufactureFormik.handleBlur}
                invalid={(vehicleModelManufactureFormik.touched.manufacturerName && vehicleModelManufactureFormik.errors.manufacturerName) ? true : false}
                error={(vehicleModelManufactureFormik.touched.manufacturerName && vehicleModelManufactureFormik.errors.manufacturerName) ? vehicleModelManufactureFormik.errors.manufacturerName : ""}
              />
            </div>
            <div className="tw-col-span-12 md:tw-col-span-4">
              <TextInput
                name="manufacturerCode"
                labelText="Manufacturer Code"
                value={vehicleModelManufactureFormik.values.manufacturerCode}
                onChange={vehicleModelManufactureFormik.handleChange}
                onBlur={vehicleModelManufactureFormik.handleBlur}
                invalid={(vehicleModelManufactureFormik.touched.manufacturerCode && vehicleModelManufactureFormik.errors.manufacturerCode) ? true : false}
                error={(vehicleModelManufactureFormik.touched.manufacturerCode && vehicleModelManufactureFormik.errors.manufacturerCode) ? vehicleModelManufactureFormik.errors.manufacturerCode : ""}
              />
            </div>
            <div className="tw-col-span-12 md:tw-col-span-4">
              <TextInput
                name="manufacturerCountry"
                labelText="Country"
                value={vehicleModelManufactureFormik.values.manufacturerCountry}
                onChange={vehicleModelManufactureFormik.handleChange}
                onBlur={vehicleModelManufactureFormik.handleBlur}
                invalid={(vehicleModelManufactureFormik.touched.manufacturerCountry && vehicleModelManufactureFormik.errors.manufacturerCountry) ? true : false}
                error={(vehicleModelManufactureFormik.touched.manufacturerCountry && vehicleModelManufactureFormik.errors.manufacturerCountry) ? vehicleModelManufactureFormik.errors.manufacturerCountry : ""}
              />
            </div>
          </div>
          <div className="tw-grid tw-grid-cols-12 tw-gap-4 tw-mb-1">
            <div className="tw-col-span-12 md:tw-col-span-4">
              <h6 className="tw-text-sm tw-font-medium">
                Model Name <span className="tw-text-red-500">*</span>
              </h6>
            </div>
            <div className="tw-col-span-12 md:tw-col-span-4">
              <h6 className="tw-text-sm tw-font-medium">
                Model Code <span className="tw-text-red-500">*</span>
              </h6>
            </div>
            <div className="tw-col-span-12 md:tw-col-span-4">
              <h6 className="tw-text-sm tw-font-medium">
                Vehicle Type <span className="tw-text-red-500">*</span>
              </h6>
            </div>
          </div>
          <FormikProvider value={vehicleModelManufactureFormik}>
            <FieldArray name="modelNames">
              {(arrayHelpers: ArrayHelpers) => {
                if (!formikArrayHelpers.current) {
                  formikArrayHelpers.current = arrayHelpers;
                }

                return (
                  <>
                    {vehicleModelManufactureFormik.values.modelNames?.map(
                      (model: any, index: any) => {
                        const inputFieldErrors: any = vehicleModelManufactureFormik.errors.modelNames && vehicleModelManufactureFormik.errors.modelNames[index] || {};
                        const inputFieldTouched = vehicleModelManufactureFormik.touched.modelNames && vehicleModelManufactureFormik.touched.modelNames[index] || {};

                        return (
                          <div
                            key={model.uniqueId}
                            className="tw-grid tw-grid-cols-12 tw-gap-4 tw-mb-4 tw-items-start"
                          >
                            <div className="tw-col-span-12 md:tw-col-span-4">
                              <TextInput
                                name={`modelNames[${index}].modelName`}
                                value={model.modelName}
                                onChange={vehicleModelManufactureFormik.handleChange}
                                onBlur={vehicleModelManufactureFormik.handleBlur}
                                formgroupClassName="tw-mb-0"
                                invalid={(inputFieldTouched.modelName && inputFieldErrors.modelName) ? true : false}
                                error={(inputFieldTouched.modelName && inputFieldErrors.modelName) ? inputFieldErrors.modelName : ""}
                              />
                            </div>
                            <div className="tw-col-span-12 md:tw-col-span-4">
                              <TextInput
                                name={`modelNames[${index}].code`}
                                value={model.code}
                                onChange={vehicleModelManufactureFormik.handleChange}
                                onBlur={vehicleModelManufactureFormik.handleBlur}
                                formgroupClassName="tw-mb-0"
                                invalid={(inputFieldTouched.code && inputFieldErrors.code) ? true : false}
                                error={(inputFieldTouched.code && inputFieldErrors.code) ? inputFieldErrors.code : ""}
                              />
                            </div>
                            <div className="tw-col-span-12 md:tw-col-span-3">
                              <SelectInput
                                name={`modelNames[${index}].vehicleTypeId`}
                                value={model.vehicleTypeId}
                                onChange={vehicleModelManufactureFormik.handleChange}
                                onBlur={vehicleModelManufactureFormik.handleBlur}
                                menuItems={getVehicleTypeListResp?.data || []}
                                formgroupClassName="tw-mb-0"
                                textKey="vehicleType"
                                valueKey="id"
                                invalid={(inputFieldTouched.vehicleTypeId && inputFieldErrors.vehicleTypeId) ? true : false}
                                error={(inputFieldTouched.vehicleTypeId && inputFieldErrors.vehicleTypeId) ? inputFieldErrors.vehicleTypeId : ""}
                              />
                            </div>
                            {!model.modelId && (
                              <div className="tw-col-span-12 md:tw-col-span-1">
                                <Button
                                  type="button"
                                  variant="wrong"
                                  onClick={() => removeCommanAlinmentsHndlr(index)}
                                  className="!tw-px-3 !tw-py-2"
                                >
                                  <HugeiconsIcon
                                    icon={Delete02StrokeStandard}
                                    size={18}
                                  />
                                </Button>
                              </div>)}
                          </div>
                        );
                      }
                    )}
                  </>
                );
              }}
            </FieldArray>
          </FormikProvider>
          <Button
            type="button"
            variant="hoverInfo"
            className="tw-flex tw-items-center !tw-px-2 !tw-py-2"
            onClick={addNewCommanAlimentsHndlr}
          >
            <i className="ri-add-line tw-mr-2" />
            Add New
          </Button>
          <div className="tw-flex tw-justify-end tw-gap-3 tw-mt-3">
            <Button type="button" variant="secondary" onClick={props.toggle}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={(event: any) =>
                vehicleModelManufactureFormik.handleSubmit(event)
              }
            >
              {props.id ? "Update" : "Submit"}
            </Button>
          </div>
        </div>
      </form>
    </>
  );
};

export default AddVehicleModelManufactureModel;
