import React, { useRef, useState, useEffect } from "react";
import { ArrayHelpers, FieldArray, FormikProvider, useFormik } from "formik";
import { SelectInput, TextInput } from "../../../../Components/Common";
import * as Yup from "yup";
import { generateUniqueNumber } from "../../../../utility/commonutility";
import { housesOptions, schoolLevelOptions, resultOptions } from "./helper";
import { useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual } from "react-redux";

type CompetitionRow = {
  rowId: string;
  level: string;
  location: string;
  result: string;
  event: string;
};

type FormValues = {
  schoolCompetition: CompetitionRow[];
};

const validationSchema = Yup.object().shape({
  schoolCompetition: Yup.array().of(
    Yup.object().shape({
      event: Yup.string().required("Event is required"),
      level: Yup.string().required("Level is required"),
      location: Yup.string().required("Location is required"),
      result: Yup.string().required("Result is required"),
    })
  ),
});

const makeRowId = () =>
  globalThis.crypto?.randomUUID?.() ?? String(generateUniqueNumber());

const makeEmptyRow = (): CompetitionRow => ({
  rowId: makeRowId(),
  event: "",
  level: "",
  location: "",
  result: "",
});

function getInitialSchoolCompetitionData(
  getPvaStudentGradeEntryListResp: any[],
  studentId: string
): FormValues {
  const defaultData: FormValues = { schoolCompetition: [makeEmptyRow()] };

  if (!Array.isArray(getPvaStudentGradeEntryListResp) || !studentId) {
    return defaultData;
  }

  const student = getPvaStudentGradeEntryListResp.find(
    (s: any) => String(s.studentId) === String(studentId)
  );

  const comps = student?.schoolCompetitions || student?.schoolLevels;

  if (Array.isArray(comps) && comps.length > 0) {
    return {
      schoolCompetition: comps.map((comp: any) => ({
        rowId: makeRowId(),
        event: comp?.event ?? "",
        level: comp?.level ?? "",
        location: comp?.location ?? "",
        result: comp?.result ?? "",
      })),
    };
  }

  return defaultData;
}

export default function SchoolCompetitionModal({
  isOpen,
  toggle,
  studentId,
  onSubmitHandler,
}: any) {
  const { getPvaStudentGradeEntryListResp, showApiLoader } = useAppSelector(
    ({ pvaReports, globalData }) => ({
      getPvaStudentGradeEntryListResp:
        pvaReports.getPvaStudentGradeEntryListResp,
      showApiLoader: globalData.showApiLoader,
    }),
    shallowEqual
  );

  const formikArrayHelpers = useRef<ArrayHelpers | null>(null);

  const [initialValues, setInitialValues] = useState<FormValues>(() =>
    getInitialSchoolCompetitionData(getPvaStudentGradeEntryListResp, studentId)
  );
 
  useEffect(() => {
    if (isOpen && studentId) {
      setInitialValues(
        getInitialSchoolCompetitionData(
          getPvaStudentGradeEntryListResp,
          studentId
        )
      );
    }
  }, [isOpen, studentId, getPvaStudentGradeEntryListResp]);

  const schoolCompetitionFormik = useFormik<FormValues>({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      const payload = {
        studentId,
        schoolCompetitions: values.schoolCompetition
          .filter((c) => c.event && c.level && c.location && c.result)
          .map(({ rowId, ...rest }) => rest),
      };

      onSubmitHandler?.(payload);
      toggle?.();
    },
  });

  const addRow = () => {
    formikArrayHelpers.current?.push(makeEmptyRow());
  };

  const removeRow = (index: number) => {
    formikArrayHelpers.current?.remove(index);
  };

  return (
    <form onSubmit={schoolCompetitionFormik.handleSubmit}>
      <div className="tw-p-4">
        <div className="row mb-4">
          <div className="col-12">
            <div className="row py-2 mb-3 mx-0 bg-light align-items-center">
              <div className="col-3">
                <h6 className="form-label required mb-0">Event</h6>
              </div>
              <div className="col-3">
                <h6 className="form-label required mb-0">Level</h6>
              </div>
              <div className="col-3">
                <h6 className="form-label required mb-0">Location</h6>
              </div>
              <div className="col-3">
                <h6 className="form-label required mb-0">Result</h6>
              </div>
            </div>
          </div>

          <div className="col-12">
            <FormikProvider value={schoolCompetitionFormik}>
              <FieldArray name="schoolCompetition">
                {(arrayHelpers: ArrayHelpers) => {
                  formikArrayHelpers.current = arrayHelpers;

                  return (
                    <>
                      {schoolCompetitionFormik.values.schoolCompetition.map(
                        (competition, index) => {
                          const rowErrors: any = (
                            schoolCompetitionFormik.errors
                              .schoolCompetition as any
                          )?.[index];
                          const rowTouched: any = (
                            schoolCompetitionFormik.touched
                              .schoolCompetition as any
                          )?.[index];

                          return (
                            <div
                              key={competition.rowId}
                              className="mb-3 row mx-0 align-items-center"
                            >
                              <div className="col-3">
                                <TextInput
                                  name={`schoolCompetition[${index}].event`}
                                  value={competition.event}
                                  onChange={schoolCompetitionFormik.handleChange}
                                  onBlur={schoolCompetitionFormik.handleBlur}
                                  formgroupClassName="mb-0"
                                  invalid={
                                    !!(
                                      rowTouched?.event &&
                                      rowErrors?.event
                                    )
                                  }
                                  error={
                                    rowTouched?.event && rowErrors?.event
                                      ? rowErrors.event
                                      : ""
                                  }
                                />
                              </div>
                              <div className="col-3">
                                <SelectInput
                                  name={`schoolCompetition[${index}].level`}
                                  value={competition.level}
                                  onChange={
                                    schoolCompetitionFormik.handleChange
                                  }
                                  onBlur={schoolCompetitionFormik.handleBlur}
                                  menuItems={schoolLevelOptions}
                                  valueKey="id"
                                  textKey="labelName"
                                  formgroupClassName="mb-0"
                                  invalid={
                                    !!(rowTouched?.level && rowErrors?.level)
                                  }
                                  error={
                                    rowTouched?.level && rowErrors?.level
                                      ? rowErrors.level
                                      : ""
                                  }
                                />
                              </div>
                              <div className="col-3">
                                <TextInput
                                  name={`schoolCompetition[${index}].location`}
                                  value={competition.location}
                                  onChange={schoolCompetitionFormik.handleChange}
                                  onBlur={schoolCompetitionFormik.handleBlur}
                                  formgroupClassName="mb-0"
                                  invalid={
                                    !!(
                                      rowTouched?.location &&
                                      rowErrors?.location
                                    )
                                  }
                                  error={
                                    rowTouched?.location && rowErrors?.location
                                      ? rowErrors.location
                                      : ""
                                  }
                                />
                              </div>
                              <div className="col-2">
                                <SelectInput
                                  name={`schoolCompetition[${index}].result`}
                                  value={competition.result}
                                  onChange={
                                    schoolCompetitionFormik.handleChange
                                  }
                                  onBlur={schoolCompetitionFormik.handleBlur}
                                  menuItems={resultOptions}
                                  valueKey="id"
                                  textKey="labelName"
                                  formgroupClassName="mb-0"
                                  invalid={
                                    !!(rowTouched?.result && rowErrors?.result)
                                  }
                                  error={
                                    rowTouched?.result && rowErrors?.result
                                      ? rowErrors.result
                                      : ""
                                  }
                                />
                              </div>
                              <div className="col-1 text-center">
                                {index !== 0 && (
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => removeRow(index)}
                                    disabled={
                                      schoolCompetitionFormik.values
                                        .schoolCompetition.length === 1
                                    }
                                  >
                                    <i className="ri-delete-bin-line"></i>
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        }
                      )}
                      <div className="mt-4">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary"
                          onClick={addRow}
                        >
                          <i className="ri-add-line me-1"></i>
                          Add New
                        </button>
                      </div>
                    </>
                  );
                }}
              </FieldArray>
            </FormikProvider>
          </div>
        </div>
        <div className="hstack gap-2 justify-content-end mt-4 mb-1">
          <button type="button" className="btn btn-light" onClick={toggle}>
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-success"
            disabled={showApiLoader}
          >
            Save
          </button>
        </div>
      </div>
    </form>
  );
}
