import { useFormik } from "formik";
import { DateInput, SelectInput } from "../../../../../Components/Common";
import * as Yup from "yup";
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { saveAcademicDetailsAct } from "../../../../../store/lms/lmssettings/lmssettingsaction";
import { generateActionPayload } from "../../../../../utility/reduxutility";

const initialValues = {
  academicYearId: "",
  startDate: "",
  endDate: "",
};

const validationSchema = Yup.object().shape({
  academicYearId: Yup.string().required("Academic Year is required."),
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

const AddSchoolHolidaysPeriodsModal = (props: any) => {
  const dispatch = useAppDispatch();

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
      const academicYearObj = academicYearListResp?.data?.find(
        (item: any) => String(item.academicYearId) === String(values.academicYearId)
      );

      const payload = {
        ...(props.id && { id: props.id }),
        academicYearId: values.academicYearId,
        courseAcademicYearName: academicYearObj?.academicYearName,
        startDate: values.startDate,
        endDate: values.endDate,
      };
      dispatch(
        saveAcademicDetailsAct(
          generateActionPayload(
            "save_academic_details",
            undefined,
            payload
          )
        )
      );
    },
  });

  const { showApiLoader, branchListResp, academicYearListResp, currentBranchIdResp: branchId,
    currentInstIdResp: instituteId, instituteListResp, getAcademicDetailsByIdResp } =
    useAppSelector(({ globalData, branch, instAcademics, appData, instituteInfo, lmsSettings }) => ({
      showApiLoader: globalData.showApiLoader,
      branchListResp: branch.branchListResp,
      academicYearListResp: instAcademics.academicYearListResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      instituteListResp: instituteInfo.instituteListResp,
      getAcademicDetailsByIdResp: lmsSettings.getAcademicDetailsByIdResp
    }), shallowEqual);

  useEffect(() => {
    if (academicYearListResp?.data?.length) {
      const { academicYearId } =
        academicYearListResp.data?.find(
          (year: any) => year.yearStatus === "CURRENT"
        ) || {};

      if (academicYearId) {
        addAcademicYearDetailsFormik.setFieldValue(
          "academicYearId",
          academicYearId
        );
      }
    }
  }, [academicYearListResp]);

  useEffect(() => {
    if (props.id && getAcademicDetailsByIdResp?.id) {
      addAcademicYearDetailsFormik.setValues({
        academicYearId: getAcademicDetailsByIdResp.academicYearId || "",
        startDate: getAcademicDetailsByIdResp.startDate || "",
        endDate: getAcademicDetailsByIdResp.endDate || "",
      });
    }
  }, [props.id, getAcademicDetailsByIdResp]);

  return (
    <>
      <div className="modal-body p-3">
        <form onSubmit={addAcademicYearDetailsFormik.handleSubmit}>
          <div className="row">
            <div className="col-12">
              <SelectInput
                name="academicYearId"
                labelText="Academic Year"
                labelClass="required"
                value={addAcademicYearDetailsFormik.values.academicYearId}
                onChange={addAcademicYearDetailsFormik.handleChange}
                menuItems={academicYearListResp?.data?.filter(
                  (item: any) => item.yearStatus === "CURRENT"
                )}
                valueKey="academicYearId"
                textKey="academicYearName"
                invalid={(addAcademicYearDetailsFormik.touched.academicYearId && addAcademicYearDetailsFormik.errors.academicYearId) ? true : false}
                error={(addAcademicYearDetailsFormik.touched.academicYearId && addAcademicYearDetailsFormik.errors.academicYearId) ? addAcademicYearDetailsFormik.errors.academicYearId : ""}
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
            >
              {props.id ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddSchoolHolidaysPeriodsModal;
