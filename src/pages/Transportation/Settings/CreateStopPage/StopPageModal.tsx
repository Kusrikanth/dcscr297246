import React, { useEffect } from "react";
import { CustomSelect, SelectInput, TextInput, TimeInput } from "../../../../Components/Common";
import { useFormik } from "formik";
import { convertTo12HourFormatWith2DigitTime } from "../../../../utility/dateutility";
import * as Yup from "yup";
import { getStopsByRouteAct, resetStopsByRouteAct, updateTimeStopScheduleAct } from "../../../../store/transportation/transportationaction";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { shallowEqual, useDispatch } from "react-redux";
import { renderOptionsRoute, renderValueRoute, timeDurations } from "./helper";
import { useAppSelector } from "../../../../hooks/storehook";
import { toast } from "react-toastify";
import Button from "../../../../Components/Common/Button";

const initialValue = {
  routeId :"",
  tripStartTimeForPickupPoint:"",
  timeDurationForPickupPoint: "",
  tripStartTimeForDropPoint: "",
  timeDurationForDropPoint: "",
  pickupStartPoint:"",
  dropStartPoint : "",
}

const validationSchema = Yup.object().shape({
  routeId: Yup.string().nullable().required('Route is required'),
  tripStartTimeForPickupPoint: Yup.string().nullable().required('Trip Start Time for Pickup Point is required'),
  timeDurationForPickupPoint: Yup.string().nullable().required('Time Duration for Pickup Point is required'),
  tripStartTimeForDropPoint: Yup.string().nullable().required('Trip Start Time for Drop Point is required'),
  timeDurationForDropPoint: Yup.string().nullable().required('Time Duration for Drop Point is required'),
});

const StopPageModal: React.FC<any> = (props) => {

  const dispatch = useDispatch()

  const { modalData , stopId , isOpen ,toggle } = props || {};

  const {
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    showApiLoader,
    getStopsByRouteResp,
    routeRequestListResp,
  } = useAppSelector(
    ({ globalData, appData, transportrequest }) => ({
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      showApiLoader: globalData.showApiLoader,
      getStopsByRouteResp:transportrequest.getStopsByRouteResp,
      routeRequestListResp:transportrequest.routeRequestListResp,
    }),
    shallowEqual
  );

  const stopScheduleCreateForm = useFormik({
    initialValues: initialValue,
    validationSchema,
    onSubmit: (values) => {
      const payload = {
        branchId,
        routeId : values?.routeId,
        timeDurationForPickupPoint : values?.timeDurationForPickupPoint,
        timeDurationForDropPoint : values?.timeDurationForDropPoint,
        tripStartTimeForPickupPoint : convertTo12HourFormatWith2DigitTime(values?.tripStartTimeForPickupPoint),
        tripStartTimeForDropPoint : convertTo12HourFormatWith2DigitTime(values?.tripStartTimeForDropPoint)
      }

      dispatch(updateTimeStopScheduleAct(generateActionPayload('update_time_stop_schedule', undefined, payload)))
    },
  });

  useEffect(() => {
      if(!isOpen){
        dispatch(resetStopsByRouteAct(undefined))
      }
  }, [isOpen])

  useEffect(() => {
    if(getStopsByRouteResp?.length > 0){

      const objectWithMaxId = getStopsByRouteResp.reduce((maxObject:any, currentObject:any) => {
        return currentObject.stopOrderSeq > maxObject.stopOrderSeq ? currentObject : maxObject;
      }, getStopsByRouteResp[0]);

      const objectWithMinId = getStopsByRouteResp.reduce((minObject:any, currentObject:any) => {
        return currentObject.stopOrderSeq < minObject.stopOrderSeq ? currentObject : minObject;
      }, getStopsByRouteResp[0]);

      if(objectWithMaxId?.stopName){
        stopScheduleCreateForm.setFieldValue("pickupStartPoint",objectWithMaxId?.stopName || "")
      }
      if(objectWithMinId?.stopName){
        stopScheduleCreateForm.setFieldValue("dropStartPoint",objectWithMinId?.stopName || "")
      }
    }else if (Array.isArray(getStopsByRouteResp) && getStopsByRouteResp?.length === 0) {
      stopScheduleCreateForm.setFieldValue("pickupStartPoint","")
      stopScheduleCreateForm.setFieldValue("dropStartPoint","")
      toast.error("No Stops Available for this route.")
    }
  }, [getStopsByRouteResp])

  const onChangeHndler = (event:any)=>{
    const { name , value } = event.target;
    stopScheduleCreateForm.handleChange(event);

    if(name === "routeId" && value){
      dispatch(getStopsByRouteAct(generateActionPayload("get_stops_by_routeid",{branchId,routeId:value})))
    }
  }

  function selectRouteHndlr(selectedOptions: any, config?: any) {
    const { name } = config;
    stopScheduleCreateForm.setValues((prevState: any) => ({ ...prevState, [name]: selectedOptions }));
    if(name === "routeId" && selectedOptions){
      dispatch(getStopsByRouteAct(generateActionPayload("get_stops_by_routeid",{branchId,routeId:selectedOptions})))
    }
}
  
  return (
    <form onSubmit={stopScheduleCreateForm.handleSubmit}>
      <div className="tw-p-5">
        <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4">
          <CustomSelect
            name="routeId"
            idKey="id"
            containerClassName="mb-3"
            labelText="Route"
            labelClass="required"
            defaultSelect="Select"
            value={stopScheduleCreateForm.values.routeId}
            renderValue={renderValueRoute}
            renderOptions={renderOptionsRoute}
            onChange={selectRouteHndlr}
            searchKey="routeName"
            options={routeRequestListResp?.data || []}
                invalid={(stopScheduleCreateForm.touched.routeId && stopScheduleCreateForm.errors.routeId) ? true : false}
                error={(stopScheduleCreateForm.touched.routeId && stopScheduleCreateForm.errors.routeId) ? stopScheduleCreateForm.errors.routeId : ""}
          />

          <TextInput
            name="pickupStartPoint"
            value={stopScheduleCreateForm.values.pickupStartPoint}
            onChange={undefined}
            isDisabled={true}
            labelText="Pickup Start Point"
          />
        </div>

        <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4">
          <TimeInput
            name="tripStartTimeForPickupPoint"
            labelText="Trip Start Time"
            labelClass="required"
            value={stopScheduleCreateForm.values.tripStartTimeForPickupPoint}
            onChange={stopScheduleCreateForm.handleChange}
            invalid={(stopScheduleCreateForm.touched.tripStartTimeForPickupPoint && stopScheduleCreateForm.errors.tripStartTimeForPickupPoint) ? true : false}
            error={(stopScheduleCreateForm.touched.tripStartTimeForPickupPoint && stopScheduleCreateForm.errors.tripStartTimeForPickupPoint) ? stopScheduleCreateForm.errors.tripStartTimeForPickupPoint : ""}
            onBlur={stopScheduleCreateForm.handleBlur}
              />
        </div>
        <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4">
          <SelectInput
            name="timeDurationForPickupPoint"
            labelClass="required"
            value={stopScheduleCreateForm.values.timeDurationForPickupPoint}
            onChange={stopScheduleCreateForm.handleChange}
            menuItems={timeDurations || []}
            valueKey="id"
            textKey="name"
                labelText="Time Duration between each points"
                invalid={(stopScheduleCreateForm.touched.timeDurationForPickupPoint && stopScheduleCreateForm.errors.timeDurationForPickupPoint) ? true : false}
                error={(stopScheduleCreateForm.touched.timeDurationForPickupPoint && stopScheduleCreateForm.errors.timeDurationForPickupPoint) ? stopScheduleCreateForm.errors.timeDurationForPickupPoint : ""}
                onBlur={stopScheduleCreateForm.handleBlur}
          />
        </div>

        <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4">
          <TextInput
            name="dropStartPoint"
            value={stopScheduleCreateForm.values.dropStartPoint}
            onChange={undefined}
            isDisabled={true}
            labelText="Drop Start Point"
          />

          <TimeInput
            name="tripStartTimeForDropPoint"
            labelText="Drop Start Time"
            labelClass="required"
            value={stopScheduleCreateForm.values.tripStartTimeForDropPoint}
            onChange={stopScheduleCreateForm.handleChange}
            onBlur={stopScheduleCreateForm.handleBlur}
              invalid={(stopScheduleCreateForm.touched.tripStartTimeForDropPoint && stopScheduleCreateForm.errors.tripStartTimeForDropPoint) ? true : false}
              error={(stopScheduleCreateForm.touched.tripStartTimeForDropPoint && stopScheduleCreateForm.errors.tripStartTimeForDropPoint) ? stopScheduleCreateForm.errors.tripStartTimeForDropPoint : ""}
          />
        </div>

  
        <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4">
          <SelectInput
            name="timeDurationForDropPoint"
            labelClass="required"
            value={stopScheduleCreateForm.values.timeDurationForDropPoint}
            onChange={stopScheduleCreateForm.handleChange}
            menuItems={timeDurations || []}
            valueKey="id"
            textKey="name"
                labelText="Time Duration between each points"
                invalid={(stopScheduleCreateForm.touched.timeDurationForDropPoint && stopScheduleCreateForm.errors.timeDurationForDropPoint) ? true : false}
                error={(stopScheduleCreateForm.touched.timeDurationForDropPoint && stopScheduleCreateForm.errors.timeDurationForDropPoint) ? stopScheduleCreateForm.errors.timeDurationForDropPoint : ""}
                onBlur={stopScheduleCreateForm.handleBlur}
          />
        </div>


        <div className="tw-flex tw-justify-end tw-gap-3 tw-mt-6">
          <Button
            variant="secondary"
            type="button"
            onClick={toggle}
          >
            Cancel
          </Button>

          <Button
            variant="primary"
            type="submit"
            disabled={showApiLoader}
          >
            Submit
          </Button>
        </div>
      </div>
    </form>

  );
};

export default StopPageModal;