import React, { useEffect } from "react";
import {
  DateInput,
  TextInput,
  TextInputGroup,
  TimeInput,
} from "../../../../../../Components/Common";
import {
  Current_Date_YYYYMMDD,
  Current_time,
} from "../../../../../../utility/dateutility";

const ScheduleType = ({ settingsFormik}) => {
  
  // useEffect(() => {
  //   const { startDate, startTime, expiryTime } = settingsFormik.values;

  //   if (startDate && startTime) {
  //     const start = new Date(`${startDate}T${startTime}`);

  //     if (!expiryTime) {
  //       const autoEnd = new Date(start.getTime() + 60 * 60 * 1000);
  //       const hh = autoEnd.getHours().toString().padStart(2, "0");
  //       const mm = autoEnd.getMinutes().toString().padStart(2, "0");
  //       settingsFormik.setFieldValue("expiryTime", `${hh}:${mm}`);
  //     }
  //   }
  // }, [settingsFormik.values.startDate, settingsFormik.values.startTime]);

useEffect(() => {
  const { startDate, startTime, expiryTime } = settingsFormik.values;

  if (startDate && startTime) {
    const start = new Date(`${startDate}T${startTime}`);

    if (!expiryTime) {
      // Auto-set expiryTime only once (first time)
      const end = new Date(start.getTime() + 60 * 60 * 1000);
      const endHours = end.getHours().toString().padStart(2, "0");
      const endMinutes = end.getMinutes().toString().padStart(2, "0");
      const formattedEndTime = `${endHours}:${endMinutes}`;

      if (settingsFormik.values.expiryTime !== formattedEndTime) {
        settingsFormik.setFieldValue("expiryTime", formattedEndTime);
      }

      if (settingsFormik.values.durationMinutes !== "60") {
        settingsFormik.setFieldValue("durationMinutes", "60");
      }
    } else {
      // Always calculate duration from startTime → expiryTime
      const end = new Date(`${startDate}T${expiryTime}`);
      const diffMinutes = Math.floor((end.getTime() - start.getTime()) / (1000 * 60));

      if (settingsFormik.values.durationMinutes !== diffMinutes.toString()) {
        settingsFormik.setFieldValue("durationMinutes", diffMinutes.toString());
      }
    }
  }
}, [
  settingsFormik.values.startDate,
  settingsFormik.values.startTime,
  settingsFormik.values.expiryTime, // ✅ now we listen for end time changes
]);

  
  return (
    <div className="card-body">
      <div className="row">
        <div className="col-12 col-md-6">
          <DateInput
            name="startDate"
            labelText="Start Date"
            minDate={Current_Date_YYYYMMDD}
            value={settingsFormik.values.startDate}
            onChange={settingsFormik.handleChange}
            onBlur={settingsFormik.handleBlur}
            invalid={Boolean(
              settingsFormik.touched.startDate &&
                settingsFormik.errors.startDate
            )}
            error={
              settingsFormik.touched.startDate
                ? settingsFormik.errors.startDate
                : ""
            }
            labelClass="required"
          />
        </div>
        <div className="col-12 col-md-6">
          <TimeInput
            name="startTime"
            labelText="Start Time"
            value={settingsFormik.values.startTime}
            onChange={settingsFormik.handleChange}
            onBlur={settingsFormik.handleBlur}
            invalid={Boolean(
              settingsFormik.touched.startTime &&
                settingsFormik.errors.startTime
            )}
            error={
              settingsFormik.touched.startTime
                ? settingsFormik.errors.startTime
                : ""
            }
            labelClass="required"
          />
        </div>
        <div className="col-12 col-md-6">
          <TimeInput
            name="expiryTime"
            labelText="End Time"
            value={settingsFormik.values.expiryTime}
            onChange={settingsFormik.handleChange}
            onBlur={settingsFormik.handleBlur}
            invalid={Boolean(
              settingsFormik.touched.expiryTime &&
                settingsFormik.errors.expiryTime
            )}
            error={
              settingsFormik.touched.expiryTime
                ? settingsFormik.errors.expiryTime
                : ""
            }
            labelClass="required"
          />
        </div>
        <div className="col-12 col-md-6 text-box-lable">
          <TextInputGroup
            name="durationMinutes"
            labelText="Duration (Minutes)"
            value={settingsFormik.values.durationMinutes}
            onChange={settingsFormik.handleChange}
            isDisabled
          >
            Min
          </TextInputGroup>
        </div>
        <div className="col-12 col-md-6 text-box-lable">
          <TextInputGroup
            name="gracePeriod"
            labelText="Grace Period to Join (Minutes)"
            value={settingsFormik.values.gracePeriod}
            onChange={settingsFormik.handleChange}
            allowedInputRegex='^[0-9.]+$'
          >
            Min
          </TextInputGroup>
        </div>
        <div className="col-12 col-md-6 text-box-lable">
          <TextInputGroup
            name="gracePeriodEndTime"
            labelText="Grace Period to End (Minutes)"
            value={settingsFormik.values.gracePeriodEndTime}
            onChange={settingsFormik.handleChange}
            allowedInputRegex='^[0-9.]+$'
          >
            Min
          </TextInputGroup>
        </div>
      </div>
    </div>
  );
};

export default ScheduleType;