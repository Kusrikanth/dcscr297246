import React, { useRef, useState, useEffect } from "react";
import { ArrayHelpers, FieldArray, FormikProvider, useFormik } from "formik";
import { SelectInput, TextInput } from "../../../../../Components/Common";
import * as Yup from "yup";
import { generateUniqueNumber } from "../../../../../utility/commonutility";
import { housesOptions, stateLevelOptions, resultOptions } from "./helper";
import { useAppSelector } from "../../../../../hooks/storehook";
import { shallowEqual } from "react-redux";

type StateCompetitionRow = {
  rowId: string; // UI-only stable unique key
  level: string;
  location: string;
  federation: string;
  results: string;
  event:string;
};

type FormValues = {
  stateLevelCompetitions: StateCompetitionRow[];
};

const validationSchema = Yup.object().shape({
  stateLevelCompetitions: Yup.array().of(
    Yup.object().shape({
      level: Yup.string().required("Level is required"),
      location: Yup.string().required("Location is required"),
      federation: Yup.string().required("Federation is required"),
      results: Yup.string().required("Results is required"),
      event: Yup.string().required("Event is required"),
    })
  ),
});

const makeRowId = () =>
  globalThis.crypto?.randomUUID?.() ?? String(generateUniqueNumber());

const makeEmptyRow = (): StateCompetitionRow => ({
  rowId: makeRowId(),
  level: "",
  location: "",
  federation: "",
  results: "",
  event:"",
});

function getInitialStateCompetitionData(
  getStudentSportsGradeEntryResp: any[],
  studentId: string
): FormValues {
  const defaultData: FormValues = { stateLevelCompetitions: [makeEmptyRow()] };

  if (!Array.isArray(getStudentSportsGradeEntryResp) || !studentId) {
    return defaultData;
  }

  const student = getStudentSportsGradeEntryResp.find(
    (s: any) => String(s.studentId) === String(studentId)
  );

  // Check both possible field names: stateLevelCompetitions OR stateLevels
  const comps = student?.stateLevelCompetitions || student?.stateLevels;

  if (Array.isArray(comps) && comps.length > 0) {
    return {
      stateLevelCompetitions: comps.map((comp: any) => ({
        rowId: makeRowId(),
        level: comp?.level ?? "",
        location: comp?.location ?? "",
        federation: comp?.federation ?? "",
        results: comp?.results ?? comp?.result ?? "",
        event: comp?.event ?? "",
      })),
    };
  }

  return defaultData;
}

export default function StateCompetitionModal({
  isOpen,
  toggle,
  studentId,
  onSubmitHandler,
}: any) {
  const { getStudentSportsGradeEntryResp, showApiLoader } = useAppSelector(
    ({ examinationSports, globalData }) => ({
      getStudentSportsGradeEntryResp:
        examinationSports.getStudentSportsGradeEntryResp,
      showApiLoader: globalData.showApiLoader,
    }),
    shallowEqual
  );

  const formikArrayHelpers = useRef<ArrayHelpers | null>(null);

  const [initialValues, setInitialValues] = useState<FormValues>(() =>
    getInitialStateCompetitionData(getStudentSportsGradeEntryResp, studentId)
  );

  // Recreate initialValues ONLY when opening / student changes / api data changes
  useEffect(() => {
    if (isOpen && studentId) {
      setInitialValues(
        getInitialStateCompetitionData(
          getStudentSportsGradeEntryResp,
          studentId
        )
      );
    }
  }, [isOpen, studentId, getStudentSportsGradeEntryResp]);

  const stateCompetitionFormik = useFormik<FormValues>({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      const payload = {
        studentId,
        stateCompetitions: values.stateLevelCompetitions
          .filter((c) => c.level && c.location && c.federation && c.results && c.event)
          .map(({ rowId, ...rest }) => rest), // remove rowId in payload
      };

      console.log("State Competition Values", payload);
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
    <form onSubmit={stateCompetitionFormik.handleSubmit}>
      <div className="tw-p-4">
        <div className="row mb-4">
          <div className="col-12">
            <div className="row py-2 mb-3 mx-0 bg-light align-items-center w-100">
              <div className="col-2">
                <h6 className="form-label required mb-0">Level</h6>
              </div>
              <div className="col-2">
                <h6 className="form-label required mb-0">Location</h6>
              </div>
              <div className="col-2">
                <h6 className="form-label required mb-0">Federation</h6>
              </div>
              <div className="col-2">
                <h6 className="form-label required mb-0">Results</h6>
              </div>
              <div className="col-3">
                <h6 className="form-label required mb-0">Event</h6>
              </div>
            </div>
          </div>

          <div className="col-12">
            <FormikProvider value={stateCompetitionFormik}>
              <FieldArray name="stateLevelCompetitions">
                {(arrayHelpers: ArrayHelpers) => {
                  formikArrayHelpers.current = arrayHelpers;

                  return (
                    <>
                      {stateCompetitionFormik.values.stateLevelCompetitions.map(
                        (competition, index) => {
                          const rowErrors: any = (
                            stateCompetitionFormik.errors
                              .stateLevelCompetitions as any
                          )?.[index];
                          const rowTouched: any = (
                            stateCompetitionFormik.touched
                              .stateLevelCompetitions as any
                          )?.[index];

                          return (
                            <div
                              key={competition.rowId} // ✅ FIX: stable unique key
                              className="mb-3 row mx-0 align-items-center"
                            >
                              <div className="col-2">
                                <SelectInput
                                  name={`stateLevelCompetitions[${index}].level`}
                                  value={competition.level}
                                  onChange={stateCompetitionFormik.handleChange}
                                  onBlur={stateCompetitionFormik.handleBlur}
                                  menuItems={stateLevelOptions}
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

                              <div className="col-2">
                                <TextInput
                                  name={`stateLevelCompetitions[${index}].location`}
                                  value={competition.location}
                                  onChange={stateCompetitionFormik.handleChange}
                                  onBlur={stateCompetitionFormik.handleBlur}
                                  formgroupClassName="mb-0"
                                  placeHolder="Location"
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
                                <TextInput
                                  name={`stateLevelCompetitions[${index}].federation`}
                                  value={competition.federation}
                                  onChange={stateCompetitionFormik.handleChange}
                                  onBlur={stateCompetitionFormik.handleBlur}
                                  formgroupClassName="mb-0"
                                  placeHolder="Federation"
                                  invalid={
                                    !!(
                                      rowTouched?.federation &&
                                      rowErrors?.federation
                                    )
                                  }
                                  error={
                                    rowTouched?.federation &&
                                    rowErrors?.federation
                                      ? rowErrors.federation
                                      : ""
                                  }
                                />
                              </div>

                              <div className="col-2">
                                <TextInput
                                  name={`stateLevelCompetitions[${index}].results`}
                                  value={competition.results}
                                  onChange={stateCompetitionFormik.handleChange}
                                  onBlur={stateCompetitionFormik.handleBlur}
                                  formgroupClassName="mb-0"
                                  placeHolder="Results"
                                  invalid={
                                    !!(
                                      rowTouched?.results && rowErrors?.results
                                    )
                                  }
                                  error={
                                    rowTouched?.results && rowErrors?.results
                                      ? rowErrors.results
                                      : ""
                                  }
                                />
                              </div>
                              <div className = "col-3">
                                  <TextInput
                                    name = {`stateLevelCompetitions[${index}].event`}
                                    value = {competition.event}
                                    onChange={
                                        stateCompetitionFormik.handleChange
                                    }
                                    onBlur={stateCompetitionFormik.handleBlur}
                                    formgroupClassName="mb-0"
                                    invalid={
                                      !!(rowTouched?.event && rowErrors?.event)
                                    }
                                    error={
                                      rowTouched?.event && rowErrors?.event
                                        ? rowErrors.event
                                        : ""
                                    }
                                    placeHolder="Event"
                                  ></TextInput>
                              </div>

                              <div className="col-auto text-center">
                                {index !== 0 && (
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => removeRow(index)}
                                    disabled={
                                      stateCompetitionFormik.values
                                        .stateLevelCompetitions.length === 1
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

                      <div className="mt-3">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary"
                          onClick={addRow}
                        >
                          <i className="ri-add-line me-1"></i>
                          Add Row
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
