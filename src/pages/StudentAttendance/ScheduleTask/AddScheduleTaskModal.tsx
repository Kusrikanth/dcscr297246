import React, { useEffect  } from 'react'
import {TextInput, TimeInput } from '../../../Components/Common';
import { useAppSelector } from '../../../hooks/storehook';
import { shallowEqual, useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from "yup";
import { generateActionPayload } from '../../../utility/reduxutility';
import {  convertTo12HourFormatWith2DigitTime, convertTo24HourFormat } from '../../../utility/dateutility';
import { addScheduleTaskAct, editScheduleTaskAct } from '../../../store/StudentAttendance/ScheduleTask/scheduleTaskaction';
import Button from '../../../Components/Common/Button';

const initialValues: any = {
  branchTime:"",
  taskName: "",
  triggerTime1: "",
  triggerTime2: "",
  module:"ATTENDANCE",
  subModule:"ABSENT"
};

const validationSchema = Yup.object().shape({
  branchTime: Yup.string().required('Branch Time is required'),
  taskName: Yup.string().required('Task Name is required'),
  triggerTime1: Yup.string().required('Trigger Time1 is required'),
})


const AddScheduleTaskModal = (props: any) => {
  const dispatch = useDispatch();

  const {
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    showApiLoader,
  } = useAppSelector(
    ({  globalData, branchAcademics, appData, }) => ({
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      showApiLoader: globalData.showApiLoader,
    }),
    shallowEqual
  );

  const addScheduleTaskForm = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values: any) => {
      const { branchTime, taskName, triggerTime1, triggerTime2, module, subModule } = values || {};
      
      if (!props?.modalData) {
        const payload = {
          branchTime:`${convertTo12HourFormatWith2DigitTime(values?.branchTime)}`, taskName: values.taskName.toUpperCase(), triggerTime1: convertTo12HourFormatWith2DigitTime(values?.triggerTime1), triggerTime2: convertTo12HourFormatWith2DigitTime(values?.triggerTime2), module, subModule, branchId,
        }
        
        dispatch(addScheduleTaskAct(generateActionPayload("add_schedule_task", undefined, payload)));
      } else {
        const payload: any = {
          branchId,branchTime:`${convertTo12HourFormatWith2DigitTime(values?.branchTime)}`, taskName: values.taskName.toUpperCase(), triggerTime1: convertTo12HourFormatWith2DigitTime(values?.triggerTime1), triggerTime2: convertTo12HourFormatWith2DigitTime(values?.triggerTime2), module, subModule
        }
      
        dispatch(editScheduleTaskAct(generateActionPayload("edit_schedule_task", {id : props.modalData?.id}, payload)));
      }

    },
  });

  useEffect(() => {
    if (props.modalData ) {
        const {  branchTime, taskName, triggerTime1, triggerTime2, module, subModule } = props.modalData || {};
        addScheduleTaskForm.setValues((prev: any) => ({ ...prev, taskName: taskName, branchTime: convertTo24HourFormat(branchTime), triggerTime1: convertTo24HourFormat(triggerTime1), triggerTime2: convertTo24HourFormat(triggerTime2), module, subModule }));
    }
  }, [props.modalData]);


  return (
    <>
      <div className="tw-p-4">
        {/* Form fields */}
        <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4">
          <TimeInput
            name="branchTime"
            labelText="Branch Time"
            value={addScheduleTaskForm.values.branchTime}
            onChange={addScheduleTaskForm.handleChange}
            onBlur={addScheduleTaskForm.handleBlur}
            invalid={
              addScheduleTaskForm.touched.branchTime &&
                addScheduleTaskForm.errors.branchTime
                ? true
                : false
            }
            error={
              addScheduleTaskForm.touched.branchTime &&
                addScheduleTaskForm.errors.branchTime
                ? addScheduleTaskForm.errors.branchTime
                : ""
            }
          />

          <TextInput
            name="taskName"
            labelText="Task Name"
            value={addScheduleTaskForm.values.taskName}
            onChange={addScheduleTaskForm.handleChange}
            onBlur={addScheduleTaskForm.handleBlur}
          />

          <TimeInput
            name="triggerTime1"
            labelText="Trigger Time 1"
            value={addScheduleTaskForm.values.triggerTime1}
            onChange={addScheduleTaskForm.handleChange}
            onBlur={addScheduleTaskForm.handleBlur}
            invalid={
              addScheduleTaskForm.touched.triggerTime1 &&
                addScheduleTaskForm.errors.triggerTime1
                ? true
                : false
            }
            error={
              addScheduleTaskForm.touched.triggerTime1 &&
                addScheduleTaskForm.errors.triggerTime1
                ? addScheduleTaskForm.errors.triggerTime1
                : ""
            }
          />

          <TimeInput
            name="triggerTime2"
            labelText="Trigger Time 2"
            value={addScheduleTaskForm.values.triggerTime2}
            onChange={addScheduleTaskForm.handleChange}
            onBlur={addScheduleTaskForm.handleBlur}
            invalid={
              addScheduleTaskForm.touched.triggerTime2 &&
                addScheduleTaskForm.errors.triggerTime2
                ? true
                : false
            }
            error={
              addScheduleTaskForm.touched.triggerTime2 &&
                addScheduleTaskForm.errors.triggerTime2
                ? addScheduleTaskForm.errors.triggerTime2
                : ""
            }
          />

          <TextInput
            name="module"
            labelText="Module"
            value={addScheduleTaskForm.values.module}
            onChange={undefined}
            isDisabled={true}
            isReadOnly={true}
          />

          <TextInput
            name="subModule"
            labelText="Sub Module"
            value={addScheduleTaskForm.values.subModule}
            onChange={undefined}
            isDisabled={true}
            isReadOnly={true}
          />
        </div>

        {/* Action buttons */}
        <div className="tw-flex tw-justify-end tw-gap-2 tw-mt-4">
          <Button
            type="button"
            variant='secondary'
            onClick={props.toggle}
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant='primary'
            disabled={showApiLoader}
            onClick={(e: any) => addScheduleTaskForm.handleSubmit(e)}
          >
            Submit
          </Button>
        </div>
      </div>
    </>
  )
}

export default AddScheduleTaskModal