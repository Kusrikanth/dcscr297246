
import { ArrayHelpers, FieldArray, FormikProvider, useFormik } from "formik";

import {
  TextInput,
} from "../../../../Components/Common";
import React, { useEffect, useRef } from "react";
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";

import { generateActionPayload } from "../../../../utility/reduxutility";
import { shallowEqual } from "react-redux";
import { generateUniqueNumber } from "../../../../utility/commonutility";
import { createVehicleTypeListAct, editVehicleTypeListAct } from "../../../../store/transportation/transportationaction";
import Button from "../../../../Components/Common/Button";


const initialValues = {
  vehicleType:[
    {
      id : generateUniqueNumber(),
      vehicle: "",
    }
  ]
};

const validationSchema =  Yup.object().shape({
  vehicleType : Yup.array().of(
    Yup.object().shape({
      // id: Yup.number().required('ID is required'),
      vehicle: Yup.string().nullable().required('Vehicle Type is required'),
    })
  )
})

const VehicalsTypeModal: React.FC<any> = (props) => {
  
  const dispatch = useAppDispatch();
  const formikArrayHelpers = useRef<ArrayHelpers | null>(null);

 
  const {currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,  vehicleTypeResp,getVehicleTypeListByIdResp  } = useAppSelector(({ vehicleDetailRequest, transportrequest,appData }) => ({
    currentBranchIdResp: appData.currentBranchIdResp,
    currentInstIdResp: appData.currentInstIdResp,
    vehicleTypeResp: vehicleDetailRequest.vehicleTypeResp,
    getVehicleTypeListByIdResp:transportrequest.getVehicleTypeListByIdResp,
  }), shallowEqual);

  const VehicleTypeAddForm:any = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema,
    onSubmit: (values) => {


      let payload: any = {};
      if (props.vehicleId && values?.vehicleType?.length > 0) {
        payload = {
          id : values?.vehicleType[0]?.id,
          vehicleType : values?.vehicleType[0]?.vehicle,
        }
        dispatch(editVehicleTypeListAct(generateActionPayload("edit_vehicle_type_list", undefined, payload)));
      } else {
        const tempres = values?.vehicleType
          ?.map((ele:any) => ele?.vehicle);
        dispatch(createVehicleTypeListAct(generateActionPayload("create_vehicle_type_list", undefined, { vehicleTypes: tempres,instituteId,branchId })));
      }
  
    },
  });

  

useEffect(() => {
  if(getVehicleTypeListByIdResp && props?.vehicleId){
    VehicleTypeAddForm.setValues((prev:any)=>({
      ...prev,
      vehicleType:[
        {
          id : getVehicleTypeListByIdResp?.id,
          vehicle: getVehicleTypeListByIdResp?.vehicleType,
        }
      ]
    }))
  }
}, [getVehicleTypeListByIdResp])


  function addSlabHandler() {
    if (formikArrayHelpers.current) {
      formikArrayHelpers.current.push({   id : generateUniqueNumber(),vehicle: "",});
    }
  }

  function removeSlabHndlr(event: React.MouseEvent<HTMLElement>) {
    const rowIndex = event.currentTarget.getAttribute("data-index");
    if (rowIndex !== undefined || rowIndex !== null) {
      formikArrayHelpers.current?.remove(Number(rowIndex));
    }
  }
  return (
    <>
   
      <div className="tw-p-5">
        <div className="tw-flex tw-flex-wrap">
          <div className="tw-w-full tw-mb-3">
            <div className="tw-flex tw-items-center">
              <h6 className="tw-text-sm tw-font-medium tw-mb-0 tw-mr-2">
                Vehicle Type
              </h6>
            </div>
          </div>

          <div className="tw-w-full">
            <FormikProvider value={VehicleTypeAddForm}>
              <FieldArray name="vehicleType">
                {(arrayHelpers: ArrayHelpers) => {
                  if (!formikArrayHelpers.current) {
                    formikArrayHelpers.current = arrayHelpers;
                  }

                  return (
                    <>
                      {VehicleTypeAddForm.values.vehicleType?.length > 0 &&
                        VehicleTypeAddForm.values.vehicleType.map(
                          (vehicleType: any, index: any) => {
                            const inputFieldErrors =
                              (VehicleTypeAddForm.errors.vehicleType &&
                                VehicleTypeAddForm.errors.vehicleType[index]) ||
                              {};
                            const inputFieldTouched =
                              (VehicleTypeAddForm.touched.vehicleType &&
                                VehicleTypeAddForm.touched.vehicleType[index]) ||
                              {};

                            return (
                              <div
                                key={vehicleType.id}
                                className="tw-flex tw-flex-wrap tw-mb-3"
                              >
                                <div className="tw-w-5/6 tw-flex tw-items-center">
                                  <div className="tw-w-4/5">
                                    <TextInput
                                      name={`vehicleType[${index}].vehicle`}
                                      value={vehicleType.vehicle}
                                      formgroupClassName="tw-mb-0"
                                      onChange={VehicleTypeAddForm.handleChange}
                                      onBlur={VehicleTypeAddForm.handleBlur}
                                invalid={(inputFieldTouched.vehicle && inputFieldErrors.vehicle) ? true : false}
                                error={(inputFieldTouched.vehicle && inputFieldErrors.vehicle) ? inputFieldErrors.vehicle : ""}
                                    />
                                  </div>

                                  {index !== 0 && (
                                    <Button
                                      variant="wrong"
                                      data-index={index}
                                      onClick={removeSlabHndlr}
                                      color="white"
                                      className="tw-ml-3 tw-p-2 tw-rounded-full hover:tw-bg-red-50"
                                    >
                                      <i className="ri-delete-bin-2-fill tw-text-red-500" />
                                    </Button>
                                  )}
                                </div>
                              </div>
                            );
                          }
                        )}
                    </>
                  );
                }}
              </FieldArray>
            </FormikProvider>

            {!props?.vehicleId && (
              <div className="tw-flex">
                <div className="tw-w-full">
                  <Button
                    onClick={addSlabHandler}
                    type="button"
                    variant="primary"
                  >
                    Add New
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="tw-flex tw-justify-end tw-mt-4">
            <div className="tw-flex tw-gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={props.toggle}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                variant="primary"
                onClick={(event: any) =>
                  VehicleTypeAddForm.handleSubmit(event)
                }
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      </div>
     
    </>
  );
};

export default React.memo(VehicalsTypeModal);

