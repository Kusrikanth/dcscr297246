import { ArrayHelpers, FieldArray, FormikProvider, useFormik } from "formik";
import { DateInput, SelectInput, TextInput } from "../../../../../Components/Common";
import { generateUniqueNumber } from "../../../../../utility/commonutility";
import * as Yup from "yup";
import React, { useEffect, useRef } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02StrokeStandard, PlusSignIcon } from "@hugeicons-pro/core-stroke-standard";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
import { saveSchoolHolidaysAct } from "../../../../../store/lms/lmssettings/lmssettingsaction";
import { generateActionPayload } from "../../../../../utility/reduxutility";
import { shallowEqual } from "react-redux";
import { Current_Date } from "../../../../../utility/dateutility";

const initialValues = {
  courseAcademicYearId: "",
  holidayListDto: [
    {
      id: generateUniqueNumber(),
      holidayName: "",
      holidayType: "",
      holidayDate: "",
    },
  ],
};

const validationSchema = Yup.object().shape({
  courseAcademicYearId: Yup.string().required("Academic Year is required."),
  holidayListDto: Yup.array().of(
    Yup.object().shape({
      holidayName: Yup.string().required("Format type is required"),
      holidayType: Yup.string().required("Looks like is required"),
      holidayDate: Yup.string().required("Notes filed is required"),
    })
  ),
});

const AddSchoolHolidaysModal = (props: any) => {

  const dispatch = useAppDispatch();

  const schoolHolidaysModalFormik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values: any) => {
      const payload = {
        courseAcademicYearId: Number(values.courseAcademicYearId),
        holidayListDTO: values.holidayListDto.map((item: any) => ({
          ...(props.id && { id: props.id }),
          holidayName: item.holidayName,
          holidayType: item.holidayType,
          holidayDate: item.holidayDate,
        })),
      };
      dispatch(
        saveSchoolHolidaysAct(
          generateActionPayload(
            "save_school_holidays",
            undefined,
            payload
          )
        )
      );
    }
  });

  const formikArrayHelpers = useRef<ArrayHelpers | null>(null);

  const { showApiLoader, getAcademicDetailsListResp, getSchoolHolidaysByIdResp } =
    useAppSelector(({ globalData, branch, instAcademics, appData, instituteInfo, lmsSettings }) => ({
      showApiLoader: globalData.showApiLoader,
      getAcademicDetailsListResp: lmsSettings.getAcademicDetailsListResp,
      getSchoolHolidaysByIdResp: lmsSettings.getSchoolHolidaysByIdResp
    }), shallowEqual);

  function addNewQuestionNoHandlr(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();

    if (formikArrayHelpers.current) {
      formikArrayHelpers.current.push({
        id: generateUniqueNumber(),
        holidayName: "",
        holidayType: "",
        holidayDate: "",
      });
    }
  }

  useEffect(() => {
    if (getSchoolHolidaysByIdResp && props.id) {
      schoolHolidaysModalFormik.setValues({
        courseAcademicYearId: String(
          getSchoolHolidaysByIdResp.courseAcademicYearId || ""
        ),

        holidayListDto: [
          {
            id: getSchoolHolidaysByIdResp.id || generateUniqueNumber(),
            holidayName: getSchoolHolidaysByIdResp.holidayName || "",
            holidayType: getSchoolHolidaysByIdResp.holidayType || "",
            holidayDate: getSchoolHolidaysByIdResp.holidayDate || "",
          },
        ],
      });
    }
  }, [getSchoolHolidaysByIdResp, props.id]);

  function removeQuestionNoHandlr(event: React.MouseEvent<HTMLButtonElement>) {
    const rowIndex = event.currentTarget.getAttribute("data-index");
    if (rowIndex !== undefined || rowIndex !== null) {
      formikArrayHelpers.current?.remove(Number(rowIndex));
    }
  }

  useEffect(() => {
    if (Array.isArray(getAcademicDetailsListResp) && getAcademicDetailsListResp.length > 0) {
      const { id } = getAcademicDetailsListResp[0];
      if (id) {
        schoolHolidaysModalFormik.setFieldValue(
          "courseAcademicYearId",
          id
        );
      }
    }
  }, [getAcademicDetailsListResp]);

  return (
    <>
      <form onSubmit={schoolHolidaysModalFormik.handleSubmit}>
        <div className="row p-3">
          <div className="col-12">
            <SelectInput
              name="courseAcademicYearId"
              labelText="Academic Year"
              labelClass="required"
              value={schoolHolidaysModalFormik.values.courseAcademicYearId}
              onBlur={schoolHolidaysModalFormik.handleBlur}
              onChange={schoolHolidaysModalFormik.handleChange}
              menuItems={Array.isArray(getAcademicDetailsListResp) ? getAcademicDetailsListResp : []}
              valueKey="id"
              textKey="courseAcademicYearName"
              isDisabled
              formgroupClassName="my-2"
              floatingLabel
              invalid={(schoolHolidaysModalFormik.touched.courseAcademicYearId && schoolHolidaysModalFormik.errors.courseAcademicYearId) ? true : false}
              error={(schoolHolidaysModalFormik.touched.courseAcademicYearId && schoolHolidaysModalFormik.errors.courseAcademicYearId) ? schoolHolidaysModalFormik.errors.courseAcademicYearId : ""}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="row py-2 px-3 mb-3 mx-0 bg-light align-items-center">
              <div className="col-4">
                <h6 className="form-label required mb-0">Holiday Name</h6>
              </div>
              <div className="col-4">
                <h6 className="form-label required mb-0">Holiday Type</h6>
              </div>
              <div className="col-3">
                <h6 className="form-label required mb-0">Holiday Date</h6>
              </div>
              <div className="col-1 px-1"><button
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
            <FormikProvider value={schoolHolidaysModalFormik}>
              <FieldArray name="holidayListDto">
                {(arrayHelpers: ArrayHelpers) => {
                  formikArrayHelpers.current = arrayHelpers;
                  return (
                    <>
                      {schoolHolidaysModalFormik.values?.holidayListDto.map(
                        (question: any, idx: any) => {
                          return (
                            <div
                              key={question.id}
                              className="row mx-0 align-items-end border-bottom pb-3 mb-3 g-3"
                            >
                              <div className="col-4">
                                <TextInput
                                  name={`holidayListDto[${idx}].holidayName`}
                                  onChange={schoolHolidaysModalFormik.handleChange}
                                  value={question.holidayName}
                                  formgroupClassName="mb-0"
                                  invalid={
                                    schoolHolidaysModalFormik.touched.holidayListDto &&
                                      schoolHolidaysModalFormik.errors.holidayListDto &&
                                      schoolHolidaysModalFormik.errors.holidayListDto[idx]
                                      ? true
                                      : false
                                  }
                                  error={
                                    schoolHolidaysModalFormik.touched.holidayListDto &&
                                      schoolHolidaysModalFormik.errors.holidayListDto &&
                                      schoolHolidaysModalFormik.errors.holidayListDto[idx]
                                      ? schoolHolidaysModalFormik.errors.holidayListDto[idx].holidayName
                                      : ""
                                  }
                                />
                              </div>
                              <div className="col-4">
                                <TextInput
                                  name={`holidayListDto[${idx}].holidayType`}
                                  onChange={schoolHolidaysModalFormik.handleChange}
                                  value={question.holidayType}
                                  formgroupClassName="mb-0"
                                  invalid={
                                    schoolHolidaysModalFormik.touched.holidayListDto &&
                                      schoolHolidaysModalFormik.errors.holidayListDto &&
                                      schoolHolidaysModalFormik.errors.holidayListDto[idx]
                                      ? true
                                      : false
                                  }
                                  error={
                                    schoolHolidaysModalFormik.touched.holidayListDto &&
                                      schoolHolidaysModalFormik.errors.holidayListDto &&
                                      schoolHolidaysModalFormik.errors.holidayListDto[idx]
                                      ? schoolHolidaysModalFormik.errors.holidayListDto[idx].holidayType
                                      : ""
                                  }
                                />
                              </div>
                              <div className="col-3">
                                <DateInput
                                  name={`holidayListDto[${idx}].holidayDate`}
                                  value={question.holidayDate}
                                  onChange={schoolHolidaysModalFormik.handleChange}
                                  minDate={Current_Date}
                                  formgroupClassName="mb-0"
                                  invalid={
                                    schoolHolidaysModalFormik.touched.holidayListDto &&
                                      schoolHolidaysModalFormik.errors.holidayListDto &&
                                      schoolHolidaysModalFormik.errors.holidayListDto[idx]
                                      ? true
                                      : false
                                  }
                                  error={
                                    schoolHolidaysModalFormik.touched.holidayListDto &&
                                      schoolHolidaysModalFormik.errors.holidayListDto &&
                                      schoolHolidaysModalFormik.errors.holidayListDto[idx]
                                      ? schoolHolidaysModalFormik.errors.holidayListDto[idx].holidayDate
                                      : ""
                                  }
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
        <div className="hstack gap-2 justify-content-end mb-1 px-4 pb-3">
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
          >
            {props.id ? "Update" : "Save"}
          </button>
        </div>
      </form>
    </>
  );
};

export default AddSchoolHolidaysModal;
