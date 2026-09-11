import { useFormik } from "formik";
import * as Yup from "yup";
import {
  DateInput,
  SelectInput,
  TextInput,
  TextInputWithRegex,
} from "../../../../../Components/Common";
import { shallowEqual, useDispatch } from "react-redux";
import { saveStudentBmiDetailsAct } from "../../../../../store/examination/examinationSports/examinationSportsActions";
import { generateActionPayload } from "../../../../../utility/reduxutility";
import { useAppSelector } from "../../../../../hooks/storehook";
import { useEffect, useMemo, useRef } from "react";
import { getGenderListAct } from "../../../../../store/masterdata/masterdataactions";
import { toast } from "react-toastify";

const validationSchema = Yup.object().shape({
  height: Yup.number()
    .required("Height is required")
    .positive("Height must be positive")
    .max(300, "Height must be less than 300 cm"),
  weight: Yup.number()
    .required("Weight is required")
    .positive("Weight must be positive")
    .max(500, "Weight must be less than 500 kg"),
  dob: Yup.string().required("Date of Birth is required"),
  genderId: Yup.string().required("Gender is required"),
});

function getAgeInMonths(dob: Date): number {
  const today = new Date();
  let months =
    (today.getFullYear() - dob.getFullYear()) * 12 +
    (today.getMonth() - dob.getMonth());

  if (today.getDate() < dob.getDate()) {
    months--;
  }

  return months;
}

export default function BmiDetailsModal({
  isOpen,
  toggle,
  studentId,
  onSubmitHandler,
}: any) {
  const dispatch = useDispatch();

  const bmiFormik = useFormik({
    initialValues: {
      height: "",
      weight: "",
      dob: "",
      genderId: "",
      bmi: "",
      bmiCategory: "",
      bmiWeightStatus: "",
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      const { height, weight, dob, genderId } = values;
      let ageInMonths = getAgeInMonths(new Date(dob));
      const payload = {
        height,
        weight,
        ageInMonths,
        genderId: genderId,
      };
      dispatch(
        saveStudentBmiDetailsAct(
          generateActionPayload("save_student_bmi_details", undefined, payload)
        )
      );
    },
  });

  const {
    saveStudentBmiDetailsResp,
    genderListResp,
    getExaminationSportsErrResp,
    studentsListResp,
    getStudentSportsGradeEntryResp,
    showApiLoader,
  } = useAppSelector(
    ({ examinationSports, masterData, directoryStudent, globalData }) => ({
      saveStudentBmiDetailsResp: examinationSports.saveStudentBmiDetailsResp,
      getExaminationSportsErrResp:
        examinationSports.getExaminationSportsErrResp,
      genderListResp: masterData.genderListResp,
      studentsListResp: directoryStudent.studentsListResp,
      getStudentSportsGradeEntryResp:
        examinationSports.getStudentSportsGradeEntryResp,
      showApiLoader: globalData.showApiLoader,
    }),
    shallowEqual
  );

  const bmiCalculationRef = useRef({
    prevSaveStudentBmiDetailsResp: saveStudentBmiDetailsResp,
    prevGetExaminationSportsErrResp: getExaminationSportsErrResp,
    isBmiCalculated: false,
  });

  const handleSaveAndClose = () => {
    onSubmitHandler({
      studentId,
      bmiCalculation: saveStudentBmiDetailsResp,
    });
    toast.success("BMI saved successfully");
    bmiCalculationRef.current.isBmiCalculated = false;
    toggle();
  };

  useEffect(() => {
    const { prevSaveStudentBmiDetailsResp, prevGetExaminationSportsErrResp } =
      bmiCalculationRef.current;
    if (
      saveStudentBmiDetailsResp &&
      saveStudentBmiDetailsResp !== prevSaveStudentBmiDetailsResp
    ) {
      bmiFormik.setValues((prev) => ({
        ...prev,
        bmi: saveStudentBmiDetailsResp?.data.bmi || "",
        bmiCategory: saveStudentBmiDetailsResp?.data.bmiCategory || "",
        bmiWeightStatus: saveStudentBmiDetailsResp?.data.bmiWeightStatus || "",
      }));
      // toast.success("BMI calculated successfully");
      bmiCalculationRef.current.isBmiCalculated = true;
    } else if (
      getExaminationSportsErrResp &&
      getExaminationSportsErrResp !== prevGetExaminationSportsErrResp
    ) {
      toast.error(
        getExaminationSportsErrResp?.message ||
          "Failed to calculate BMI. Please try again."
      );
    }
    bmiCalculationRef.current.prevSaveStudentBmiDetailsResp =
      saveStudentBmiDetailsResp;
    bmiCalculationRef.current.prevGetExaminationSportsErrResp =
      getExaminationSportsErrResp;
  }, [saveStudentBmiDetailsResp, getExaminationSportsErrResp]);

  useEffect(() => {
    dispatch(
      getGenderListAct(
        generateActionPayload("get_inst_global_records", undefined, {
          categoryName: "gender",
          sortBy: "genderName",
          orderBy: "asc",
        })
      )
    );
  }, [dispatch]);

  useEffect(() => {
    if (studentsListResp && studentId && genderListResp?.data) {
      const selectedStudent = studentsListResp?.data?.find(
        (student: any) => +student.studentId === +studentId
      );

      if (selectedStudent) {
        // Format date
        let formattedDate = "";
        if (selectedStudent.dob) {
          const dobString = String(selectedStudent.dob);
          if (dobString.includes("-")) {
            formattedDate = dobString.split("T")[0];
          } else {
            formattedDate = new Date(selectedStudent.dob)
              .toISOString()
              .split("T")[0];
          }
        }

        let matchingGenderId = "";
        if (selectedStudent.gender) {
          const studentGender = String(selectedStudent.gender)
            .toUpperCase()
            .trim();
          const matchingGender = genderListResp.data.find(
            (g: any) => g.genderName.toUpperCase() === studentGender
          );
          matchingGenderId = matchingGender?.genderId || "";
        }

        bmiFormik.setValues((prev) => ({
          ...prev,
          dob: formattedDate,
          genderId: matchingGenderId,
        }));
      }
    }
  }, [studentsListResp, studentId, genderListResp]);

  useEffect(() => {
    if (
      getStudentSportsGradeEntryResp &&
      Array.isArray(getStudentSportsGradeEntryResp) &&
      studentId
    ) {
      const student = getStudentSportsGradeEntryResp.find(
        (s: any) => +s.studentId === +studentId
      );
      if (student?.bmiDetails) {
        bmiFormik.setValues((prev) => ({
          ...prev,
          height: student.bmiDetails.height || "",
          weight: student.bmiDetails.weight || "",
          bmi: student.bmiDetails.bmi || "",
          bmiCategory: student.bmiDetails.bmiCategory || "",
          bmiWeightStatus: student.bmiDetails.bmiWeightStatus || "",
        }));
      }
    }
  }, [getStudentSportsGradeEntryResp, studentId]);

  return (
    <form onSubmit={bmiFormik.handleSubmit}>
      <div className="tw-p-4">
        <div className="row mb-4">
          <div className="col-12 col-lg-6">
            <TextInputWithRegex
              name="height"
              labelText="Height (in cm)"
              value={bmiFormik.values.height}
              onChange={bmiFormik.handleChange}
              onBlur={bmiFormik.handleBlur}
              formgroupClassName="mb-3"
              invalid={
                bmiFormik.touched.height && bmiFormik.errors.height
                  ? true
                  : false
              }
              error={
                bmiFormik.touched.height && bmiFormik.errors.height
                  ? bmiFormik.errors.height
                  : ""
              }
              allowedInputRegex="^[0-9.]+$"
            ></TextInputWithRegex>
          </div>
          <div className="col-12 col-lg-6">
            <TextInputWithRegex
              name="weight"
              labelText="Weight (in kg)"
              value={bmiFormik.values.weight}
              onChange={bmiFormik.handleChange}
              onBlur={bmiFormik.handleBlur}
              formgroupClassName="mb-3"
              invalid={
                bmiFormik.touched.weight && bmiFormik.errors.weight
                  ? true
                  : false
              }
              error={
                bmiFormik.touched.weight && bmiFormik.errors.weight
                  ? bmiFormik.errors.weight
                  : ""
              }
              allowedInputRegex="^[0-9.]+$"
            ></TextInputWithRegex>
          </div>
          <div className="col-12 col-lg-6">
            <DateInput
              name="dob"
              labelText="Date of Birth"
              value={bmiFormik.values.dob}
              onChange={bmiFormik.handleChange}
              onBlur={bmiFormik.handleBlur}
              formgroupClassName="mb-3"
              invalid={
                bmiFormik.touched.dob && bmiFormik.errors.dob ? true : false
              }
              error={
                bmiFormik.touched.dob && bmiFormik.errors.dob
                  ? bmiFormik.errors.dob
                  : ""
              }
            ></DateInput>
          </div>
          <div className="col-12 col-lg-6">
            <SelectInput
              name="genderId"
              labelText="Gender"
              onBlur={bmiFormik.handleBlur}
              menuItems={genderListResp?.data || []}
              valueKey="genderId"
              textKey="genderName"
              value={bmiFormik.values.genderId}
              onChange={bmiFormik.handleChange}
              formgroupClassName="mb-3"
              invalid={
                bmiFormik.touched.genderId && bmiFormik.errors.genderId
                  ? true
                  : false
              }
              error={
                bmiFormik.touched.genderId && bmiFormik.errors.genderId
                  ? bmiFormik.errors.genderId
                  : ""
              }
            ></SelectInput>
          </div>

          {bmiFormik.values.bmi && (
            <div className="col-12">
              <div className="tw-bg-gray-100 tw-p-2 tw-rounded">
                <div>
                  <strong>BMI Information:</strong>
                </div>
                <div>
                  BMI:
                  <span className="tw-font-semibold tw-ml-1">
                    {bmiFormik.values.bmi || "N/A"}
                  </span>
                </div>
                <div>
                  BMI Category:
                  <span className="tw-font-semibold tw-ml-1">
                    {bmiFormik.values.bmiCategory || "N/A"}
                  </span>
                </div>
                <div>
                  BMI Weight Status:
                  <span className="tw-font-semibold tw-ml-1">
                    {bmiFormik.values.bmiWeightStatus || "N/A"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="d-flex gap-2 justify-content-end mt-4">
          <button type="button" className="btn btn-light" onClick={toggle}>
            Cancel
          </button>
          {!bmiCalculationRef.current.isBmiCalculated ? (
            <button
              type="submit"
              className="btn btn-success"
              disabled={showApiLoader}
            >
              Calculate BMI
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-success"
              onClick={handleSaveAndClose}
            >
              Save
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
