import { ArrayHelpers, FieldArray, FormikProvider, useFormik } from "formik";
import { useEffect } from "react";
import {
  TextInput,
} from "../../../../Components/Common";
import React, { useRef, useState } from "react";
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { createRouteAct, updateRouteDetailAct } from "../../../../store/transportation/transportationaction";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import { generateUniqueNumber } from "../../../../utility/commonutility";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02StrokeStandard } from "@hugeicons-pro/core-stroke-standard";
import Button from "../../../../Components/Common/Button";

const validationSchema =  Yup.object().shape({
  routes : Yup.array().of(
    Yup.object().shape({
      routeName: Yup.string().nullable().required('Route Name is required'),
      routeCode: Yup.string().nullable().required('Route Code is required'),
    })
  )
})

const initialValues = {
  routes:[
    {
      id: generateUniqueNumber(),
      routeName: "",
      routeCode: ""
    }
  ]
};

const RoutesTabModal: React.FC<any> = (props) => {
 
  const dispatch = useAppDispatch();

  const formikArrayHelpers = useRef<ArrayHelpers | null>(null);

  const { addRouteRequestResp,
     updateRouteDetailRequestResp,
     getRoutesListByIdResp,
     showApiLoader,
     currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
     } = useAppSelector(({ transportrequest,appData,globalData }) => ({
    addRouteRequestResp: transportrequest.addRouteRequestResp,
    updateRouteDetailRequestResp: transportrequest.updateRouteDetailRequestResp,
    getRoutesListByIdResp:transportrequest.getRoutesListByIdResp,
    currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            showApiLoader:globalData.showApiLoader,
  }), shallowEqual);

  const [newRoutesDataState, setNewRoutesDataState] =
    useState(initialValues);

  const addRouteRespRef = useRef({
    prevAddRouteRequestResp: addRouteRequestResp,
    prevUpdateRouteDetailRequestResp: updateRouteDetailRequestResp,
  });

  useEffect(() => {
    const { prevAddRouteRequestResp, prevUpdateRouteDetailRequestResp } = addRouteRespRef.current;
    if (addRouteRequestResp && prevAddRouteRequestResp !== addRouteRequestResp) {
      props.toggle(false);
      setNewRoutesDataState(initialValues);
      toast.success("Route Details added successfully.");
    } else if (updateRouteDetailRequestResp && prevUpdateRouteDetailRequestResp !== updateRouteDetailRequestResp){
      props.toggle(false);
      setNewRoutesDataState(initialValues);
      toast.success("Route Details Updated successfully.");
    }
   
      addRouteRespRef.current.prevAddRouteRequestResp = addRouteRequestResp;

      addRouteRespRef.current.prevUpdateRouteDetailRequestResp = updateRouteDetailRequestResp;
  }, [addRouteRequestResp,updateRouteDetailRequestResp,getRoutesListByIdResp]);


  const routesDetailAddForm:any = useFormik({
    enableReinitialize: true,
    initialValues: newRoutesDataState,
    validationSchema,
    onSubmit: (values) => {

      const {routes} = values
      let payload: any = {};
      if (props.routeId && routes?.length > 0) {
        payload = {
              routeName: routes[0]?.routeName,
              routeCode: routes[0]?.routeCode,
        }
        dispatch(updateRouteDetailAct(generateActionPayload("update_route_details",{routeId: props.routeId,branchId} , payload)));
      } else {
        const tempres = routes
          ?.map((ele:any) => ({
            routeName: ele.routeName,
            routeCode: ele.routeCode
          }));
        dispatch(createRouteAct(generateActionPayload("create_route_details", undefined, {branchId,instituteId, routes: tempres }, undefined)));
      }
    },
  });


  useEffect(() => {
    
  if(props.isOpen && props?.routeId && getRoutesListByIdResp){
    setNewRoutesDataState({
      routes : [{
        id : getRoutesListByIdResp?.id,
        routeName : getRoutesListByIdResp?.routeName,
        routeCode : getRoutesListByIdResp?.routeCode
      }]
    })  }else{
setNewRoutesDataState(initialValues)
    }
    
  }, [props.isOpen,getRoutesListByIdResp])
  
  function removeSlabHndlr(event: React.MouseEvent<HTMLElement>) {
    const rowIndex = event.currentTarget.getAttribute("data-index");
    if (rowIndex !== undefined || rowIndex !== null) {
      formikArrayHelpers.current?.remove(Number(rowIndex));
    }
  }

  function addSlabHandler() {
    if (formikArrayHelpers.current) {
      formikArrayHelpers.current.push({ uniqueId: generateUniqueNumber(), routeName: "", routeCode: "" });
    }
  }

  return (
    <>
   
      <div className="tw-p-5">
        <div className="tw-flex tw-flex-wrap">
          <div className="tw-w-full tw-mb-3">
            <div className="tw-flex tw-flex-wrap">
              <div className="tw-w-1/2">
                <div className="tw-flex tw-items-center">
                  <h6 className="tw-text-sm tw-font-semibold tw-mr-2">
                    Route Name <span className="tw-text-red-500">*</span>
                  </h6>
                </div>
              </div>
              <div className="tw-w-1/3">
                <h6 className="tw-text-sm tw-font-semibold">
                  Route Code <span className="tw-text-red-500">*</span>
                </h6>
              </div>
            </div>
          </div>

          <div className="tw-w-full">
            <FormikProvider value={routesDetailAddForm}>
              <FieldArray name="routes">
                {(arrayHelpers: ArrayHelpers) => {
                  if (!formikArrayHelpers.current) {
                    formikArrayHelpers.current = arrayHelpers;
                  }

                  return (
                    <>
                      {routesDetailAddForm.values.routes?.length > 0 &&
                      routesDetailAddForm.values.routes?.map((route:any, index:any) => {
                        const inputFieldErrors: any = routesDetailAddForm.errors.routes && routesDetailAddForm.errors.routes[index] || {};
                        const inputFieldTouched = routesDetailAddForm.touched.routes && routesDetailAddForm.touched.routes[index] || {};
                          return (
                            <div key={route.uniqueId} className="tw-flex tw-flex-wrap tw-mb-3 tw-gap-2">
                              <div className="tw-w-1/2">
                                <TextInput
                                  name={`routes[${index}].routeName`}
                                  value={route.routeName}
                                formgroupClassName="tw-mb-0"
                                onChange={routesDetailAddForm.handleChange}
                                onBlur={routesDetailAddForm.handleBlur}
                                invalid={(inputFieldTouched.routeName && inputFieldErrors.routeName) ? true : false}
                                error={(inputFieldTouched.routeName && inputFieldErrors.routeName) ? inputFieldErrors.routeName : ""}
                              />
                            </div>
                            <div className="tw-w-1/3">
                              <div className="hstack">
                                <TextInput
                                  name={`routes[${index}].routeCode`}
                                  inputClassName="tw-w-80"
                                  value={route.routeCode}
                                  formgroupClassName="tw-mb-0"
                                  onChange={routesDetailAddForm.handleChange}
                                  onBlur={routesDetailAddForm.handleBlur}
                                  invalid={(inputFieldTouched.routeCode && inputFieldErrors.routeCode) ? true : false}
                                  error={(inputFieldTouched.routeCode && inputFieldErrors.routeCode) ? inputFieldErrors.routeCode : ""}
                                  />
                                </div>
                              </div>
                              {index !== 0 && (
                                    <Button
                                    variant="wrong"
                                      data-index={index}
                                      onClick={removeSlabHndlr}
                                      className="tw-p-1 tw-rounded-full  tw-ml-2"
                                    >
                                      <HugeiconsIcon
                                        icon={Delete02StrokeStandard}
                                        className="tw-text-red-500"
                                        size={18}
                                      />
                                    </Button>
                                  )}
                            </div>
                          )
                        })}
                    </>
                  )
                }}
              </FieldArray>
            </FormikProvider>

            {!props?.routeId && (
              <div className="tw-flex">
                <div className="tw-w-full">
                  <Button
                    onClick={addSlabHandler}
                    type="button"
                    variant="soft"
                  >
                    Add New
                  </Button>
                </div>
              </div>
            )}
          </div>
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
              onClick={(event: any) => routesDetailAddForm.handleSubmit(event)}
              disabled={showApiLoader}
            >
              {props.routeId ? "Update" : "Submit"}
            </Button>
          </div>
        </div>
      </div>
     
    </>
  );
};

export default React.memo(RoutesTabModal);
