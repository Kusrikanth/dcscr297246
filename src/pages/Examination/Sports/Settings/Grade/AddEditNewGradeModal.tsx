import { useFormik } from "formik";
import { SelectInput, TextInput } from "../../../../../Components/Common";
import * as Yup from "yup";
import { shallowEqual, useDispatch } from "react-redux";
import { useAppSelector } from "../../../../../hooks/storehook";
import { useEffect } from "react";
import {
  editSportsGradeItemAct,
  saveSportsGradeItemAct,
} from "../../../../../store/examination/examinationSports/examinationSportsActions";
import { generateActionPayload } from "../../../../../utility/reduxutility";

const initialValues = {
  academicYearId: "",
  grade: "",
  label: "",
};

const validationSchema = Yup.object().shape({
  academicYearId: Yup.string().required("Academic Year is required"),
  grade: Yup.string().required("Grade is required"),
  label: Yup.string().required("Label is required"),
});

const AddEditNewGradeModal = ({ toggle, gradeId }) => {
  const dispatch = useDispatch();

  const {
    showApiLoader,
    currentBranchIdResp: branchId,
    academicYearListResp,
    getSportsGradeByIdResp,
  } = useAppSelector(
    ({ globalData, appData, instAcademics, examinationSports }) => ({
      showApiLoader: globalData.showApiLoader,
      currentBranchIdResp: appData.currentBranchIdResp,
      academicYearListResp: instAcademics.academicYearListResp,

      getSportsGradeByIdResp: examinationSports.getSportsGradeByIdResp,
    }),
    shallowEqual
  );

  const addEditSportsGradeFormik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values: any) => {
      if (gradeId) {
        const { grade, label } = values;
        const payload = {
          grade,
          label,
        };

        dispatch(
          editSportsGradeItemAct(
            generateActionPayload(
              "edit_sports_grade_item",
              { id: gradeId },
              payload
            )
          )
        );
      } else {
        const { academicYearId, grade, label } = values;
        const payload = {
          branchId,
          academicYearId,
          grade,
          label,
        };

        dispatch(
          saveSportsGradeItemAct(
            generateActionPayload("save_sports_grade_item", undefined, payload)
          )
        );
      }
    },
  });

  useEffect(() => {
    const yearId =
      academicYearListResp &&
      academicYearListResp?.data.find(
        (year: any) => year.yearStatus.toLowerCase() === "current"
      )?.academicYearId;

    addEditSportsGradeFormik.setFieldValue("academicYearId", yearId);
  }, [academicYearListResp]);

  useEffect(() => {
    if (gradeId && getSportsGradeByIdResp) {
      addEditSportsGradeFormik.setFieldValue(
        "grade",
        getSportsGradeByIdResp?.grade || ""
      );
      addEditSportsGradeFormik.setFieldValue(
        "label",
        getSportsGradeByIdResp?.label || ""
      );
    }
  }, [gradeId, getSportsGradeByIdResp]);

  return (
    <div style={{ padding: "1.25rem" }}>
      <div className="row">
        <div className="col-12">
          <SelectInput
            name="academicYearId"
            labelText="Academic Year"
            labelClass="required"
            value={addEditSportsGradeFormik.values.academicYearId}
            menuItems={academicYearListResp?.data}
            onChange={addEditSportsGradeFormik.handleChange}
            onBlur={addEditSportsGradeFormik.handleBlur}
            valueKey="academicYearId"
            textKey="academicYearName"
            isDisabled={gradeId}
            invalid={
              addEditSportsGradeFormik.touched.academicYearId &&
              addEditSportsGradeFormik.errors.academicYearId
                ? true
                : false
            }
            error={
              addEditSportsGradeFormik.touched.academicYearId &&
              addEditSportsGradeFormik.errors.academicYearId
                ? addEditSportsGradeFormik.errors.academicYearId
                : ""
            }
          ></SelectInput>
        </div>
        <div className="col-12">
          <TextInput
            name="grade"
            value={addEditSportsGradeFormik.values.grade}
            onChange={addEditSportsGradeFormik.handleChange}
            onBlur={addEditSportsGradeFormik.handleBlur}
            labelText="Grade"
            labelClass="required"
            invalid={
              addEditSportsGradeFormik.touched.grade &&
              addEditSportsGradeFormik.errors.grade
                ? true
                : false
            }
            error={
              addEditSportsGradeFormik.touched.grade &&
              addEditSportsGradeFormik.errors.grade
                ? addEditSportsGradeFormik.errors.grade
                : false
            }
          ></TextInput>
        </div>
        <div className="col-12">
          <TextInput
            name="label"
            value={addEditSportsGradeFormik.values.label}
            onChange={addEditSportsGradeFormik.handleChange}
            onBlur={addEditSportsGradeFormik.handleBlur}
            labelText="Label"
            labelClass="required"
            invalid={
              addEditSportsGradeFormik.touched.label &&
              addEditSportsGradeFormik.errors.label
                ? true
                : false
            }
            error={
              addEditSportsGradeFormik.touched.label &&
              addEditSportsGradeFormik.errors.label
                ? addEditSportsGradeFormik.errors.label
                : false
            }
          ></TextInput>
        </div>
      </div>
      <div className="row">
        <div className="d-flex ms-auto w-auto">
          <button className="btn btn-light me-3" onClick={toggle}>
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-success"
            onClick={(event: any) =>
              addEditSportsGradeFormik.handleSubmit(event)
            }
            disabled={showApiLoader}
          >
            {gradeId ? "Update" : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEditNewGradeModal;
