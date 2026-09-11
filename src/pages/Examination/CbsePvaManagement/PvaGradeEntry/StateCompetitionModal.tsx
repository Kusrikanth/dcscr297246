import React, { useRef, useState, useEffect } from "react";
import { ArrayHelpers, FieldArray, FormikProvider, useFormik } from "formik";
import { SelectInput, TextInput } from "../../../../Components/Common";
import * as Yup from "yup";
import { generateUniqueNumber } from "../../../../utility/commonutility";
import { housesOptions, stateLevelOptions, resultOptions, medalLevelOptions } from "./helper";
import { useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual } from "react-redux";

type StateCompetitionRow = {
  rowId: string;
  level: string;
  location: string;
  federation: string;
  medal: string;
  event: string;
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
      medal: Yup.string().required("Medal is required"),
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
  medal: "",
  event: "",
});

function getInitialStateCompetitionData(
  getPvaStudentGradeEntryListResp: any[],
  studentId: string
): FormValues {
  const defaultData: FormValues = { stateLevelCompetitions: [makeEmptyRow()] };

  if (!Array.isArray(getPvaStudentGradeEntryListResp) || !studentId) {
    return defaultData;
  }

  const student = getPvaStudentGradeEntryListResp.find(
    (s: any) => String(s.studentId) === String(studentId)
  );

  const comps = student?.stateLevelCompetitions || student?.stateLevels;

  if (Array.isArray(comps) && comps.length > 0) {
    return {
      stateLevelCompetitions: comps.map((comp: any) => ({
        rowId: makeRowId(),
        event: comp?.event ?? "",
        level: comp?.level ?? "",
        location: comp?.location ?? "",
        federation: comp?.federation ?? "",
        medal: comp?.medal ?? comp?.result ?? "",
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
    getInitialStateCompetitionData(getPvaStudentGradeEntryListResp, studentId)
  );

  useEffect(() => {
    if (isOpen && studentId) {
      setInitialValues(
        getInitialStateCompetitionData(
          getPvaStudentGradeEntryListResp,
          studentId
        )
      );
    }
  }, [isOpen, studentId, getPvaStudentGradeEntryListResp]);

  const stateCompetitionFormik = useFormik<FormValues>({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      const payload = {
        studentId,
        stateCompetitions: values.stateLevelCompetitions
          .filter((c) => c.level && c.location && c.federation && c.medal && c.event)
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
    <form onSubmit={stateCompetitionFormik.handleSubmit}>
      <div className="tw-p-4">
        <div className="row mb-4">
          <div className="col-12">
            <div className="row py-2 mb-3 mx-0 bg-light align-items-center">
              <div className="col-2">
                <h6 className="form-label required mb-0">Event</h6>
              </div>
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
                <h6 className="form-label required mb-0">Medal/Cups</h6>
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
                              key={competition.rowId}
                              className="mb-3 row mx-0 align-items-center"
                            >
                              <div className="col-2">
                                <TextInput
                                  name={`stateLevelCompetitions[${index}].event`}
                                  value={competition.event}
                                  onChange={stateCompetitionFormik.handleChange}
                                  onBlur={stateCompetitionFormik.handleBlur}
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
                              <div className="col-3">
                                <SelectInput
                                  name={`stateLevelCompetitions[${index}].medal`}
                                  value={competition.medal}
                                  onChange={stateCompetitionFormik.handleChange}
                                  onBlur={stateCompetitionFormik.handleBlur}
                                  formgroupClassName="mb-0"
                                  menuItems={medalLevelOptions}
                                  valueKey="id"
                                  textKey="labelName"
                                  invalid={
                                    !!(
                                      rowTouched?.medal && rowErrors?.medal
                                    )
                                  }
                                  error={
                                    rowTouched?.medal && rowErrors?.medal
                                      ? rowErrors.medal
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
