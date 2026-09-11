import { useFormik } from "formik";
import { SelectInput, TextInputWithRegex } from "../../../../../Components/Common";
import * as Yup from "yup";
import React, { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { saveDigitalCurriculumValidationAct } from "../../../../../store/lms/lmssettings/lmssettingsaction";
import { generateActionPayload } from "../../../../../utility/reduxutility";
import { generateUniqueNumber } from "../../../../../utility/commonutility";
import { getBranchCurriculumAct } from "../../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { getMasterCurriculumAct } from "../../../../../store/masterdata/masterdataactions";

const initialValues = {
  academicYearId: "",
  courseAcademicYearId: "",
  curriculumId: "",
  minChapters: "",
  minTopics: "",
  minUnits: "",
};

const validationSchema = Yup.object().shape({
  courseAcademicYearId: Yup.string().required("Academic Year is required."),
  curriculumId: Yup.string().required("Curriculum is required."),
  minUnits: Yup.string().required("No.of Units is required."),
  minChapters: Yup.string().required("No.of Chapters is required."),
  minTopics: Yup.string().required("No.of Topics is required."),
});

const AddDigitalCurriculumValidationModal = (props: any) => {
  const dispatch = useAppDispatch();

  const addDigitalCurriculumValidationFormik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      const payload = {
        academicYearId: values.academicYearId,
        academicYearName:
          academicYearListResp?.data?.find(
            (y: any) => y.academicYearId == values.academicYearId
          )?.academicYearName ?? "",

        curriculumId: values.curriculumId,
        curriculumName:
          curriculumTypes.find(
            (c: any) => String(c.id) === String(values.curriculumId)
          )?.curriculumName ?? "",

        minUnits: values.minUnits,
        minChapters: values.minChapters,
        minTopics: values.minTopics,
      };

      dispatch(
        saveDigitalCurriculumValidationAct(
          generateActionPayload(
            "save_digital_curriculum_validation",
            undefined,
            payload
          )
        )
      );
    }
  });

  const { showApiLoader, getAcademicDetailsListResp, masterCurriculumResp, currentInstIdResp: instituteId, currentBranchIdResp: branchId, academicYearListResp } =
    useAppSelector(({ globalData, masterData, branch, branchAcademics, appData, instituteInfo, lmsSettings, instAcademics }) => ({
      showApiLoader: globalData.showApiLoader,
      getAcademicDetailsListResp: lmsSettings.getAcademicDetailsListResp,
      instituteListResp: instituteInfo.instituteListResp,
      masterCurriculumResp: masterData.masterCurriculumResp,
      branchListResp: branch.branchListResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      academicYearListResp: instAcademics.academicYearListResp
    }), shallowEqual);

  const getCurriculumApiCall = (otherProps?: any) => {
    dispatch(
      getMasterCurriculumAct(
        generateActionPayload(
          "get_master_curriculum",
          undefined,
          {
            pageNo: 0,
            pageSize: 100,
            ...otherProps,
          }
        )
      )
    );
  };
  useEffect(() => {
    const { data } = academicYearListResp || {};
    if (Array.isArray(data) && data.length > 0) {
      const currentYear =
        data.find((year: any) => year.yearStatus?.toUpperCase() === "CURRENT") ||
        data[0];

      if (currentYear?.academicYearId) {
        addDigitalCurriculumValidationFormik.setFieldValue("academicYearId", currentYear.academicYearId);
        getCurriculumApiCall({ academicYearId: currentYear.academicYearId });
      }
    }
  }, [academicYearListResp]);
  useEffect(() => {
    if (Array.isArray(getAcademicDetailsListResp) && getAcademicDetailsListResp.length > 0) {
      const { id } = getAcademicDetailsListResp[0];
      if (id) {
        addDigitalCurriculumValidationFormik.setFieldValue(
          "courseAcademicYearId",
          id
        );
      }
    }
  }, [getAcademicDetailsListResp]);

  useEffect(() => {
    if (
      props?.id &&
      Array.isArray(getAcademicDetailsListResp) &&
      Array.isArray(masterCurriculumResp)
    ) {
      const academicYear = getAcademicDetailsListResp.find(
        (y: any) =>String(y.academicYearId) === String(props.id.academicYearId)
      );

      const matchedCurriculum = masterCurriculumResp.find(
        (c: any) =>String(c.id) === String(props.id.curriculumId)
      );

      addDigitalCurriculumValidationFormik.setValues({
        academicYearId: String(props.id.academicYearId),
        courseAcademicYearId: academicYear ? String(academicYear.id) : "",
        curriculumId: matchedCurriculum
          ? String(matchedCurriculum.id)
          : "",
        minUnits: String(props.id.minUnits),
        minChapters: String(props.id.minChapters),
        minTopics: String(props.id.minTopics),
      });
    }
  }, [props.id, getAcademicDetailsListResp, masterCurriculumResp]);

  const curriculumTypes = Array.isArray(masterCurriculumResp)
    ? masterCurriculumResp
    : [];

  return (
    <>
      <div className="modal-body p-3">
        <form onSubmit={addDigitalCurriculumValidationFormik.handleSubmit}>
          <div className="row">
            <div className="col-12 col-md-6">
              <SelectInput
                name="courseAcademicYearId"
                labelText="Academic Year"
                labelClass="required"
                value={addDigitalCurriculumValidationFormik.values.courseAcademicYearId}
                onChange={addDigitalCurriculumValidationFormik.handleChange}
                menuItems={Array.isArray(getAcademicDetailsListResp) ? getAcademicDetailsListResp : []}
                valueKey="id"
                textKey="courseAcademicYearName"
                isDisabled
                invalid={(addDigitalCurriculumValidationFormik.touched.courseAcademicYearId && addDigitalCurriculumValidationFormik.errors.courseAcademicYearId) ? true : false}
                error={(addDigitalCurriculumValidationFormik.touched.courseAcademicYearId && addDigitalCurriculumValidationFormik.errors.courseAcademicYearId) ? addDigitalCurriculumValidationFormik.errors.courseAcademicYearId : ""}
              />
            </div>
            <div className="col-12 col-md-6">
              <SelectInput
                name="curriculumId"
                labelText="Curriculum"
                value={addDigitalCurriculumValidationFormik.values.curriculumId}
                onChange={addDigitalCurriculumValidationFormik.handleChange}
                menuItems={curriculumTypes}
                valueKey="id"
                textKey="curriculumName"
                isDisabled={props?.id}
                labelClass="required"
                invalid={(addDigitalCurriculumValidationFormik.touched.curriculumId && addDigitalCurriculumValidationFormik.errors.curriculumId) ? true : false}
                error={(addDigitalCurriculumValidationFormik.touched.curriculumId && addDigitalCurriculumValidationFormik.errors.curriculumId) ? addDigitalCurriculumValidationFormik.errors.curriculumId : ""}
              />
            </div>
            <div className="col-12 col-md-6">
              <TextInputWithRegex
                name="minUnits"
                labelText="Min Units"
                allowedInputRegex="^[0-9]+$"
                maxLength={3}
                value={addDigitalCurriculumValidationFormik.values.minUnits}
                onChange={addDigitalCurriculumValidationFormik.handleChange}
                labelClass="required"
                invalid={(addDigitalCurriculumValidationFormik.touched.minUnits && addDigitalCurriculumValidationFormik.errors.minUnits) ? true : false}
                error={(addDigitalCurriculumValidationFormik.touched.minUnits && addDigitalCurriculumValidationFormik.errors.minUnits) ? addDigitalCurriculumValidationFormik.errors.minUnits : ""}
              />
            </div>
            <div className="col-12 col-md-6">
              <TextInputWithRegex
                name="minChapters"
                labelText="Min Chapters"
                labelClass="required"
                allowedInputRegex="^[0-9]+$"
                maxLength={3}
                value={addDigitalCurriculumValidationFormik.values.minChapters}
                onChange={addDigitalCurriculumValidationFormik.handleChange}
                invalid={(addDigitalCurriculumValidationFormik.touched.minChapters && addDigitalCurriculumValidationFormik.errors.minChapters) ? true : false}
                error={(addDigitalCurriculumValidationFormik.touched.minChapters && addDigitalCurriculumValidationFormik.errors.minChapters) ? addDigitalCurriculumValidationFormik.errors.minChapters : ""}
              />
            </div>
            <div className="col-12 col-md-6">
              <TextInputWithRegex
                name="minTopics"
                labelText="Min Topics"
                labelClass="required"
                allowedInputRegex="^[0-9]+$"
                maxLength={3}
                value={addDigitalCurriculumValidationFormik.values.minTopics}
                onChange={addDigitalCurriculumValidationFormik.handleChange}
                invalid={(addDigitalCurriculumValidationFormik.touched.minTopics && addDigitalCurriculumValidationFormik.errors.minTopics) ? true : false}
                error={(addDigitalCurriculumValidationFormik.touched.minTopics && addDigitalCurriculumValidationFormik.errors.minTopics) ? addDigitalCurriculumValidationFormik.errors.minTopics : ""}
              />
            </div>
            <div className="col-12 col-md-6">
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

export default AddDigitalCurriculumValidationModal;
