import { ArrayHelpers, FieldArray, FormikProvider, useFormik } from "formik";
import { TimeInput, InputCheckbox, MultiSelectCheckbox, SelectInput, TextInput } from "../../../../../Components/Common";
import * as Yup from "yup";
import React, { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { saveSchoolPeriodDetailsAct } from "../../../../../store/lms/lmssettings/lmssettingsaction";
import { generateActionPayload } from "../../../../../utility/reduxutility";
import { renderOptionsWorkingDays, renderValueWorkingDays, WORKING_DAYS_OPTIONS } from "./helper";
import { generateUniqueNumber } from "../../../../../utility/commonutility";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02StrokeStandard, PlusSignIcon } from "@hugeicons-pro/core-stroke-standard";

const initialValues = {
  courseAcademicYearId: "",
  workingDays: [] as string[],
  periodDetails: [
    {
      id: generateUniqueNumber(),
      periodNo: "",
      startTime: "",
      endTime: "",
      isBreak: false,
      isDeleted: false,
    },
  ],
};

const validationSchema = Yup.object().shape({
  courseAcademicYearId: Yup.string().required("Academic Year is required."),
  workingDays: Yup.array().min(1, "Select at least one working day"),
  periodDetails: Yup.array().of(
    Yup.object().shape({
      periodNo: Yup.string().required("Period is required"),
      startTime: Yup.string().required("Start Time is required"),
      endTime: Yup.string().required("End Time is required"),
    })
  ),
});

const AddSchoolPeriodsModal = (props: any) => {
  const dispatch = useAppDispatch();
  const formikArrayHelpers = useRef<ArrayHelpers | null>(null);

  const addAcademicYearDetailsFormik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      const branchName = branchListResp?.data?.find(
        (item: any) => +item.branchId === +branchId
      )?.branchName;
      const instituteName = instituteListResp?.data?.find(
        (item: any) => +item.id === +instituteId
      )?.instituteName;
      const payload = {
        ...(props.id && { id: props.id }),
        courseAcademicYearId: Number(values.courseAcademicYearId),
        branchName,
        workingDays: values.workingDays.map((day: any) => day.id),
        periodDetails: values.periodDetails.map((item: any) => {
          const period: any = {
            periodNo: item.periodNo,
            startTime: item.startTime,
            endTime: item.endTime,
            isBreak: Boolean(item.isBreak),
            isDeleted: Boolean(item.isDeleted),
          };
          if (props.id && typeof item.id === "number") {
            period.id = item.id;
          }
          return period;
        }),

      };

      dispatch(
        saveSchoolPeriodDetailsAct(
          generateActionPayload(
            "save_school_period_details",
            undefined,
            payload
          )
        )
      );
    },
  });

  const { showApiLoader, getAcademicDetailsListResp, branchListResp, instituteListResp, currentInstIdResp: instituteId, currentBranchIdResp: branchId, getSchoolPeriodDetailsByIdResp } =
    useAppSelector(({ globalData, branch, instAcademics, appData, instituteInfo, lmsSettings }) => ({
      showApiLoader: globalData.showApiLoader,
      getAcademicDetailsListResp: lmsSettings.getAcademicDetailsListResp,
      instituteListResp: instituteInfo.instituteListResp,
      branchListResp: branch.branchListResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      getSchoolPeriodDetailsByIdResp: lmsSettings.getSchoolPeriodDetailsByIdResp
    }), shallowEqual);

  useEffect(() => {
    if (Array.isArray(getAcademicDetailsListResp) && getAcademicDetailsListResp.length > 0) {
      const { id } = getAcademicDetailsListResp[0];
      if (id) {
        addAcademicYearDetailsFormik.setFieldValue(
          "courseAcademicYearId",
          id
        );
      }
    }
  }, [getAcademicDetailsListResp]);

  useEffect(() => {
    if (props.id && getSchoolPeriodDetailsByIdResp?.id) {
      addAcademicYearDetailsFormik.setValues({
        courseAcademicYearId: String(
          getSchoolPeriodDetailsByIdResp.courseAcademicYearId || ""
        ),
        workingDays: (getSchoolPeriodDetailsByIdResp.workingDays || []).map(
          (day: string) => ({
            id: day,
            label: day.charAt(0) + day.slice(1).toLowerCase(),
          })
        ),
        periodDetails: (getSchoolPeriodDetailsByIdResp.periodDetails || []).map(
          (item: any) => ({
            id: item.id,
            periodNo: item.periodNo,
            startTime: item.startTime.slice(0, 5),
            endTime: item.endTime.slice(0, 5),
            isBreak: Boolean(item.isBreak),
            isDeleted: false,
          })
        ),
      });
    }
  }, [props.id, getSchoolPeriodDetailsByIdResp]);

  function onWorkingDaysChange(selectedOptions: string[], config?: any) {
    const { name } = config;
    addAcademicYearDetailsFormik.setFieldValue(name, selectedOptions);
  }

  function addNewQuestionNoHandlr(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    if (formikArrayHelpers.current) {
      formikArrayHelpers.current.push({
        id: generateUniqueNumber(),
        periodNo: "",
        startTime: "",
        endTime: "",
        isBreak: false,
      });

    }
  }

  function removeQuestionNoHandlr(event: React.MouseEvent<HTMLButtonElement>) {
    const rowIndex = Number(event.currentTarget.getAttribute("data-index"));
    const current = addAcademicYearDetailsFormik.values.periodDetails[rowIndex];
    if (current?.id && props.id) {
      addAcademicYearDetailsFormik.setFieldValue(
        `periodDetails[${rowIndex}].isDeleted`,
        true
      );
    }
    else {
      formikArrayHelpers.current?.remove(rowIndex);
    }
  }

  return (
    <>
      <div className="modal-body p-3">
        <form onSubmit={addAcademicYearDetailsFormik.handleSubmit}>
          <div className="row">
            <div className="col-12 col-md-6">
              <SelectInput
                name="courseAcademicYearId"
                labelText="Academic Year"
                labelClass="required"
                value={addAcademicYearDetailsFormik.values.courseAcademicYearId}
                onChange={addAcademicYearDetailsFormik.handleChange}
                menuItems={Array.isArray(getAcademicDetailsListResp) ? getAcademicDetailsListResp : []}
                valueKey="id"
                textKey="courseAcademicYearName"
                isDisabled
                invalid={(addAcademicYearDetailsFormik.touched.courseAcademicYearId && addAcademicYearDetailsFormik.errors.courseAcademicYearId) ? true : false}
                error={(addAcademicYearDetailsFormik.touched.courseAcademicYearId && addAcademicYearDetailsFormik.errors.courseAcademicYearId) ? addAcademicYearDetailsFormik.errors.courseAcademicYearId : ""}
              />
            </div>
            <div className="col-12 col-md-6">
              <MultiSelectCheckbox
                name="workingDays"
                labelText="Working Days"
                containerClassName="mb-3"
                idKey="id"
                labelClass="required"
                value={addAcademicYearDetailsFormik.values.workingDays}
                renderValue={renderValueWorkingDays}
                renderOptions={renderOptionsWorkingDays}
                onChange={onWorkingDaysChange}
                options={WORKING_DAYS_OPTIONS}
                invalid={addAcademicYearDetailsFormik.touched.workingDays && !!addAcademicYearDetailsFormik.errors.workingDays}
                error={addAcademicYearDetailsFormik.touched.workingDays ? addAcademicYearDetailsFormik.errors.workingDays : ""}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="row py-2 px-3 mb-3 mx-0 bg-light align-items-center">
                <div className="col-4 px-1">
                  <h6 className="form-label required mb-0">Period Name</h6>
                </div>
                <div className="col-3 px-1">
                  <h6 className="form-label required mb-0">Start Time</h6>
                </div>
                <div className="col-3 px-1">
                  <h6 className="form-label required mb-0">End Time</h6>
                </div>
                <div className="col-1 px-1">
                  <h6 className="form-label required mb-0">Break</h6>
                </div>
                <div className="col-1 px-1 d-flex justify-content-center"><button
                  className="btn btn-sm btn-outline-primary"
                  onClick={addNewQuestionNoHandlr}
                >
                  <HugeiconsIcon
                    icon={PlusSignIcon}
                    className=""
                    size={12}
                  />
                </button>
                </div>
              </div>
            </div>
            <div className="col-12 px-4">
              <FormikProvider value={addAcademicYearDetailsFormik}>
                <FieldArray name="periodDetails">
                  {(arrayHelpers: ArrayHelpers) => {
                    formikArrayHelpers.current = arrayHelpers;
                    return (
                      <>
                        {addAcademicYearDetailsFormik.values?.periodDetails.filter((item: any) => !item.isDeleted).map(
                          (question: any, idx: any) => {
                            return (
                              <div
                                key={question.id}
                                className="row mx-0 align-items-end border-bottom pb-3 mb-3 g-3"
                              >
                                <div className="col-4">
                                  <TextInput
                                    name={`periodDetails[${idx}].periodNo`}
                                    onChange={addAcademicYearDetailsFormik.handleChange}
                                    value={question.periodNo}
                                    formgroupClassName="mb-0"
                                    maxLength={3}
                                    invalid={
                                      addAcademicYearDetailsFormik.touched.periodDetails &&
                                        addAcademicYearDetailsFormik.errors.periodDetails &&
                                        addAcademicYearDetailsFormik.errors.periodDetails[idx]
                                        ? true
                                        : false
                                    }
                                    error={
                                      addAcademicYearDetailsFormik.touched.periodDetails &&
                                        addAcademicYearDetailsFormik.errors.periodDetails &&
                                        addAcademicYearDetailsFormik.errors.periodDetails[idx]
                                        ? (addAcademicYearDetailsFormik.errors.periodDetails as any)?.[idx]?.periodNo
                                        : ""
                                    }
                                  />
                                </div>
                                <div className="col-3">
                                  <TimeInput
                                    name={`periodDetails[${idx}].startTime`}
                                    value={question.startTime}
                                    onChange={addAcademicYearDetailsFormik.handleChange}
                                    formgroupClassName="mb-0"
                                    invalid={
                                      addAcademicYearDetailsFormik.touched.periodDetails &&
                                        addAcademicYearDetailsFormik.errors.periodDetails &&
                                        addAcademicYearDetailsFormik.errors.periodDetails[idx]
                                        ? true
                                        : false
                                    }
                                    error={
                                      addAcademicYearDetailsFormik.touched.periodDetails &&
                                        addAcademicYearDetailsFormik.errors.periodDetails &&
                                        addAcademicYearDetailsFormik.errors.periodDetails[idx]
                                        ? (addAcademicYearDetailsFormik.errors.periodDetails as any)?.[idx]?.startTime
                                        : ""
                                    }
                                  />
                                </div>
                                <div className="col-3">
                                  <TimeInput
                                    name={`periodDetails[${idx}].endTime`}
                                    value={question.endTime}
                                    onChange={addAcademicYearDetailsFormik.handleChange}
                                    formgroupClassName="mb-0"
                                    invalid={
                                      addAcademicYearDetailsFormik.touched.periodDetails &&
                                        addAcademicYearDetailsFormik.errors.periodDetails &&
                                        addAcademicYearDetailsFormik.errors.periodDetails[idx]
                                        ? true
                                        : false
                                    }
                                    error={
                                      addAcademicYearDetailsFormik.touched.periodDetails &&
                                        addAcademicYearDetailsFormik.errors.periodDetails &&
                                        addAcademicYearDetailsFormik.errors.periodDetails[idx]
                                        ? (addAcademicYearDetailsFormik.errors.periodDetails as any)?.[idx]?.endTime
                                        : ""
                                    }
                                  />
                                </div>
                                <div className="col-1 d-flex justify-content-center">
                                  <InputCheckbox
                                    name={`periodDetails[${idx}].isBreak`}
                                    value={question.isBreak}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                      addAcademicYearDetailsFormik.setFieldValue(
                                        `periodDetails[${idx}].isBreak`,
                                        e.target.checked
                                      );
                                    }}
                                  />
                                </div>
                                <div className="col-1 d-flex justify-content-center">
                                  {idx !== 0 && (
                                    <button
                                      data-index={idx}
                                      onClick={removeQuestionNoHandlr}
                                      className="btn-sm btn-icon btn-rounded btn-hover-danger btn btn-white"
                                      type="button"
                                    >
                                      <HugeiconsIcon
                                        icon={Delete02StrokeStandard}
                                        className="text-danger"
                                        size={14}
                                      />
                                    </button>
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
            </div>
          </div>
          <div className="hstack gap-2 justify-content-end mt-2 mb-1 pb-0">
            <button
              type="button"
              className="btn btn-light"
              onClick={props.toggle}
            >
              Cancel
            </button>
            <button
              className="btn btn-success"
              type="submit"
              disabled={showApiLoader}
            >
              {props.id ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddSchoolPeriodsModal;
