import { useFormik } from "formik";
import { DateInput, SelectInput, TextInput } from "../../../../../Components/Common";
import * as Yup from "yup";
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { saveAcademicTermDetailsAct } from "../../../../../store/lms/lmssettings/lmssettingsaction";
import { generateActionPayload } from "../../../../../utility/reduxutility";

const initialValues = {
  courseAcademicYearId: "",
  termName: "",
  startDate: "",
  endDate: "",
};

const validationSchema = Yup.object().shape({
  courseAcademicYearId: Yup.string().required("Academic Year is required."),
  termName: Yup.string().required("Term Name is required."),
  startDate: Yup.string().required("Start Date is required."),
  endDate: Yup.string()
    .required("End Date is required.")
    .test(
      "end-after-start",
      "End Date must be greater than or equal to Start Date.",
      function (endDate) {
        const { startDate } = this.parent;
        if (!startDate || !endDate) return true;
        return new Date(endDate) >= new Date(startDate);
      }
    ),
});

const AddAcademicTermDetailsModal = (props: any) => {
  const dispatch = useAppDispatch();

  const addAcademicYearDetailsFormik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {

      const payload = {
        ...(props.id && { id: props.id }),
        courseAcademicYearId: values.courseAcademicYearId,
        termName: values.termName,
        startDate: values.startDate,
        endDate: values.endDate,
      };
      dispatch(
        saveAcademicTermDetailsAct(
          generateActionPayload(
            "save_academic_term_details",
            undefined,
            payload
          )
        )
      );
    },
  });

  const { showApiLoader, getAcademicDetailsListResp, getAcademicTermDetailsByIdResp } =
    useAppSelector(({ globalData, branch, instAcademics, appData, instituteInfo, lmsSettings }) => ({
      showApiLoader: globalData.showApiLoader,
      getAcademicDetailsListResp: lmsSettings.getAcademicDetailsListResp,
      getAcademicTermDetailsByIdResp: lmsSettings.getAcademicTermDetailsByIdResp
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
    if (props.id && getAcademicTermDetailsByIdResp?.id) {
      addAcademicYearDetailsFormik.setValues({
        courseAcademicYearId: getAcademicTermDetailsByIdResp.courseAcademicYearId || "",
        termName: getAcademicTermDetailsByIdResp.termName || "",
        startDate: getAcademicTermDetailsByIdResp.startDate || "",
        endDate: getAcademicTermDetailsByIdResp.endDate || "",
      });
    }
  }, [props.id, getAcademicTermDetailsByIdResp]);

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
                isDisabled
                textKey="courseAcademicYearName"
                invalid={(addAcademicYearDetailsFormik.touched.courseAcademicYearId && addAcademicYearDetailsFormik.errors.courseAcademicYearId) ? true : false}
                error={(addAcademicYearDetailsFormik.touched.courseAcademicYearId && addAcademicYearDetailsFormik.errors.courseAcademicYearId) ? addAcademicYearDetailsFormik.errors.courseAcademicYearId : ""}
              />
            </div>
            <div className="col-12 col-md-6">
              <TextInput
                name="termName"
                labelText="Term Name"
                labelClass="required"
                value={addAcademicYearDetailsFormik.values.termName}
                onChange={addAcademicYearDetailsFormik.handleChange}
                invalid={(addAcademicYearDetailsFormik.touched.termName && addAcademicYearDetailsFormik.errors.termName) ? true : false}
                error={(addAcademicYearDetailsFormik.touched.termName && addAcademicYearDetailsFormik.errors.termName) ? addAcademicYearDetailsFormik.errors.termName : ""}
              />
            </div>
            <div className="col-12 col-md-6">
              <DateInput
                name="startDate"
                labelText="Start Date"
                labelClass="required"
                value={addAcademicYearDetailsFormik.values.startDate}
                onChange={addAcademicYearDetailsFormik.handleChange}
                formgroupClassName="mb-0"
                invalid={(addAcademicYearDetailsFormik.touched.startDate && addAcademicYearDetailsFormik.errors.startDate) ? true : false}
                error={(addAcademicYearDetailsFormik.touched.startDate && addAcademicYearDetailsFormik.errors.startDate) ? addAcademicYearDetailsFormik.errors.startDate : ""}
              />
            </div>
            <div className="col-12 col-md-6">
              <DateInput
                name="endDate"
                labelText="End Date"
                labelClass="required"
                value={addAcademicYearDetailsFormik.values.endDate}
                onChange={addAcademicYearDetailsFormik.handleChange}
                formgroupClassName="mb-0"
                invalid={(addAcademicYearDetailsFormik.touched.endDate && addAcademicYearDetailsFormik.errors.endDate) ? true : false}
                error={(addAcademicYearDetailsFormik.touched.endDate && addAcademicYearDetailsFormik.errors.endDate) ? addAcademicYearDetailsFormik.errors.endDate : ""}
              />
            </div>
          </div>
          <div className="hstack gap-2 justify-content-end mt-4 mb-1 pb-0">
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

export default AddAcademicTermDetailsModal;
