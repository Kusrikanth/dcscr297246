import React, { useEffect } from 'react'
import { DateInput, RadioInputContainer, TextInput, TimeInput } from '../../../../Components/Common'
import { Current_Date_YYYYMMDD } from '../../../../utility/dateutility'
import { useFormik } from 'formik';
import * as Yup from "yup";
import { generateActionPayload } from '../../../../utility/reduxutility';
import { useAppDispatch, useAppSelector } from '../../../../hooks/storehook';
import { getSettingsAssessmentIdAct, saveRescheduleAssessmentAct } from '../../../../store/lms/lmsAssessment/lmsAssessmentaction';
import { shallowEqual } from 'react-redux';

const initialValues = {
  // Schedule Type
  startDate: "",
  startTime: "",
  expiryDate: "",
  expiryTime: "",
  durationMinutes: "",
  resultStartDate: "",
  resultStartTime: "",
  manualEvaluationDateTime: "",
}

const RescheduleModal = (props: any) => {

  const dispatch = useAppDispatch();

  const {
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    getSettingsByAssessmentIdResp,
  } = useAppSelector(
    ({
      branchAcademics,
      appData,
      lmsAssessment,
    }) => ({
      branchClassResp: branchAcademics.branchClassResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      getSettingsByAssessmentIdResp: lmsAssessment.getSettingsByAssessmentIdResp,
    }),
    shallowEqual
  );

  const isManual =
    (getSettingsByAssessmentIdResp?.resultReleaseMode || "")
      .toString()
      .toLowerCase() === "manually";


  const validationSchema = Yup.object().shape({
    startDate: Yup.string().required("Start date is required"),
    startTime: Yup.string().required("Start time is required"),
    expiryTime: Yup.string().required("End time is required"),
    ...(isManual && {
      resultStartDate: Yup.string()
        .when("resultStartTime", {
          is: (time: string) => !!time,
          then: (schema) =>
            schema
              .required("Result Date is required")
              .test(
                "is-after-end-date",
                "Result date & time must be after assessment end time",
                function (value) {
                  const { startDate, expiryTime, resultStartTime } = this.parent;
                  if (!value || !expiryTime || !resultStartTime || !startDate)
                    return true;
                  const [resHour, resMin] = resultStartTime.split(":").map(Number);
                  const [endHour, endMin] = expiryTime.split(":").map(Number);
                  const resultDateTime = new Date(value);
                  resultDateTime.setHours(resHour, resMin, 0, 0);
                  const endDateTime = new Date(startDate);
                  endDateTime.setHours(endHour, endMin, 0, 0);
                  return resultDateTime.getTime() > endDateTime.getTime();
                }
              ),
          otherwise: (schema) => schema.required("Result Date is required"),
        }),
      resultStartTime: Yup.string().required("Result Time is required"),
    }),
  });
  const settingsFormik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      const manualEvaluationDateTime =
        values.resultStartDate && values.resultStartTime
          ? `${values.resultStartDate}T${values.resultStartTime}`
          : "";
      const payload: any = {
        // Schedule settings
        startDate: values.startDate,
        startTime: values.startTime,
        expiryDate: values.startDate,
        expiryTime: values.expiryTime,
        durationMinutes: Number(values.durationMinutes) || 0,
        manualEvaluationDateTime,
      }
      dispatch(
        saveRescheduleAssessmentAct(
          generateActionPayload("save_reschedule_assessment", { id: props.id }, payload)
        )
      );
    },
  });

  useEffect(() => {
    if (props.id) {
      dispatch(
        getSettingsAssessmentIdAct(
          generateActionPayload("get_global_settings_assessment_id", {
            assessmentId: props.id,
          })
        )
      );
    }
  }, [props.id])

  useEffect(() => {
    const { startDate, startTime, expiryTime } = settingsFormik.values;
    if (startDate && startTime && expiryTime) {
      const start = new Date(`${startDate}T${startTime}`);
      const end = new Date(`${startDate}T${expiryTime}`);
      if (end > start) {
        const diffMs = end.getTime() - start.getTime();
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        settingsFormik.setFieldValue("durationMinutes", diffMinutes.toString());
      } else {
        settingsFormik.setFieldValue("durationMinutes", "");
      }
    }
  }, [
    settingsFormik.values.startDate,
    settingsFormik.values.startTime,
    settingsFormik.values.expiryTime,
  ]);

  return (
    <div className="card-body">
      <div className="row">
        <div className="col-12 ">
          <DateInput
            name="startDate"
            labelText="Start Date"
            minDate={Current_Date_YYYYMMDD}
            value={settingsFormik.values.startDate}
            onChange={settingsFormik.handleChange}
            onBlur={settingsFormik.handleBlur}
            labelClass='required'
            invalid={Boolean(
              settingsFormik.touched.startDate &&
              settingsFormik.errors.startDate
            )}
            error={
              settingsFormik.touched.startDate
                ? settingsFormik.errors.startDate
                : ""
            }
          />
        </div>
        <div className="col-6">
          <TimeInput
            name="startTime"
            labelText="Start Time"
            value={settingsFormik.values.startTime}
            onChange={settingsFormik.handleChange}
            onBlur={settingsFormik.handleBlur}
            labelClass='required'
            invalid={Boolean(
              settingsFormik.touched.startTime &&
              settingsFormik.errors.startTime
            )}
            error={
              settingsFormik.touched.startTime
                ? settingsFormik.errors.startTime
                : ""
            }
          />
        </div>
        <div className="col-6">
          <TimeInput
            name="expiryTime"
            labelText="End Time"
            value={settingsFormik.values.expiryTime}
            onChange={settingsFormik.handleChange}
            onBlur={settingsFormik.handleBlur}
            labelClass='required'
            invalid={Boolean(
              settingsFormik.touched.expiryTime &&
              settingsFormik.errors.expiryTime
            )}
            error={
              settingsFormik.touched.expiryTime
                ? settingsFormik.errors.expiryTime
                : ""
            }
          />
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <TextInput
            name="durationMinutes"
            labelText="Duration (Minutes)"
            value={settingsFormik.values.durationMinutes}
            onChange={settingsFormik.handleChange}
            isDisabled
          />
        </div>
      </div>
      {isManual && (
        <div className="row">
          <div className="col-12">
            <h4 className="text-muted mb-0 mt-1 fs-14 border-bottom pb-2 mb-3">
              Select Result Date and time when students can access their results.
            </h4>
          </div>
          <div className="col-12">
            <div className="row">
              <div className="col-12 col-md-6">
                <DateInput
                  name="resultStartDate"
                  labelText="Result Date"
                  value={settingsFormik.values.resultStartDate}
                  labelClass='required'
                  minDate={Current_Date_YYYYMMDD}
                  onBlur={settingsFormik.handleBlur}
                  onChange={(e: any) => {
                    settingsFormik.handleChange(e);
                    const date = e.target.value;
                    const time = settingsFormik.values.resultStartTime;
                    const datetime = date && time ? `${date}T${time}` : "";
                    settingsFormik.setFieldValue("manualEvaluationDateTime", datetime);
                  }}
                  invalid={Boolean(
                    settingsFormik.touched.resultStartDate &&
                    settingsFormik.errors.resultStartDate
                  )}
                  error={
                    settingsFormik.touched.resultStartDate
                      ? settingsFormik.errors.resultStartDate
                      : ""
                  }
                />
              </div>
              <div className="col-12 col-md-6">
                <TimeInput
                  name="resultStartTime"
                  labelText="Result Time"
                  value={settingsFormik.values.resultStartTime}
                  onBlur={settingsFormik.handleBlur}
                  labelClass='required'
                  onChange={(e) => {
                    settingsFormik.handleChange(e);
                    const time = e.target.value;
                    const date = settingsFormik.values.resultStartDate;
                    const datetime = date && time ? `${date}T${time}` : "";
                    settingsFormik.setFieldValue("manualEvaluationDateTime", datetime);
                  }}
                  invalid={Boolean(
                    settingsFormik.touched.resultStartTime &&
                    settingsFormik.errors.resultStartTime
                  )}
                  error={
                    settingsFormik.touched.resultStartTime
                      ? settingsFormik.errors.resultStartTime
                      : ""
                  }
                />
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="d-flex gap-2 justify-content-center  ">
        <button
          type="button"
          className="btn w-sm btn-light m-0"
          data-bs-dismiss="modal"
          onClick={props.toggle}
        >
          {"Cancel"}
        </button>
        <button
          type="submit"
          className={"btn w-sm btn-success m-0"}
          id="delete-record"
          onClick={settingsFormik.submitForm}
        // disabled={props.isDisble || false}
        >
          {"Submit"}
        </button>
      </div>
    </div>
  )
}

export default RescheduleModal
