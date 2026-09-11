import React, { useMemo, useRef } from "react";
import { useFormik, FieldArray, FormikProvider, FormikErrors } from "formik";
import * as Yup from "yup";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  Delete02StrokeStandard,
  Edit03Icon,
} from "@hugeicons-pro/core-stroke-standard";
import { Button, Form } from "reactstrap";
import {
  DropDownToggle,
  InputCheckbox,
  SelectInput,
  TextInput,
} from "../../../../Components/Common";
import { generateUniqueNumber } from "../../../../utility/commonutility";
import { IFeature } from "./TreeNode/types";

// ...imports remain the same

interface Topic {
  id: string;
  topicName: string;
  sessions: number;
  week: number;
}

interface Chapter {
  id: string;
  chapterName: string;
  topics: Topic[];
}

interface Week {
  weekId: string;
  weekName: string;
}

interface Unit {
  id: string;
  unitName: string;
  weeks: Week[];
  chapters: Chapter[];
}

interface FormValues {
  units: Unit[];
}

const initialValues: FormValues = {
  units: [
    {
      id: generateUniqueNumber(),
      unitName: "",
      weeks: [],
      chapters: [
        {
          id: generateUniqueNumber(),
          chapterName: "",
          topics: [
            {
              id: generateUniqueNumber(),
              topicName: "",
              sessions: 1,
              week: 1,
            },
          ],
        },
      ],
    },
  ],
};

const validationSchema = Yup.object().shape({
  units: Yup.array()
    .of(
      Yup.object().shape({
        unitName: Yup.string().required("Unit name is required"),
        weeks: Yup.array(),
        chapters: Yup.array().of(
          Yup.object().shape({
            chapterName: Yup.string().required("Chapter name is required"),
            topics: Yup.array().of(
              Yup.object().shape({
                topicName: Yup.string().required("Topic name is required"),
                sessions: Yup.number()
                  .typeError("Sessions must be a number")
                  .required("Sessions are required")
                  .positive("Must be greater than 0"),
                week: Yup.number()
                  .typeError("Week must be a number")
                  .required("Week is required")
                  .min(1, "Week must be at least 1")
                  .max(40, "Week can't exceed 40"),
              })
            ),
          })
        ),
      })
    )
    .required("At least one unit is required"),
});

const CurriculumEditor = () => {
  const formik = useFormik<FormValues>({
    initialValues,
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      const newUnits: IFeature[] = values.units.map((unit, unitIdx) => ({
        id: generateUniqueNumber(),
        code: "",
        type: "Unit",
        description: unit.unitName,
        hours: 1,
        permissions: [],
        subFeatures: unit.chapters.map((chapter, chapterIdx) => ({
          id: generateUniqueNumber(),
          code: "",
          type: "Chapter",
          description: chapter.chapterName,
          hours: 1,
          permissions: [],
          subFeatures: chapter.topics.map((topic, topicIdx) => ({
            id: generateUniqueNumber(),
            code: "",
            type: "Topic",
            description: topic.topicName,
            hours: 1,
            permissions: [],
            subFeatures: [],
          })),
        })),
      }));

      // console.log("Formatted Tree:", newUnits);
      // onTreeNodeData(newUnits);
      resetForm();
    },
  });

  const arrayHelpersRef = useRef<any>(null);

  const weekList = Array.from({ length: 40 }, (_, idx) => {
    return {
      weekId: `${idx + 1}`,
      weekName: `Week ${idx + 1}`,
    };
  });
  const sessionsList = Array.from({ length: 15 }, (_, idx) => {
    return {
      sessionId: `${idx + 1}`,
      sessionName: `Session ${idx + 1}`,
    };
  });

  const dropDownOption = useMemo(
    () => [
      {
        id: "teacher-view",
        actionName: "Teacher View",
        onClickHndlr: () => {},
      },
      {
        id: "hod-view",
        actionName: "HOD View",
        onClickHndlr: () => {},
      },
    ],
    []
  );

  return (
    <div className="">
      <div className="mb-4 course-management">
        <FormikProvider value={formik}>
          <Form onSubmit={formik.handleSubmit}>
            <FieldArray name="units">
              {(unitHelpers) => {
                arrayHelpersRef.current = unitHelpers;
                return (
                  <>
                    {formik.values.units.map((unit, unitIdx) => {
                      const unitError = formik.errors.units?.[
                        unitIdx
                      ] as FormikErrors<Unit>;
                      const unitTouched = formik.touched.units?.[unitIdx];

                      return (
                        <div className="card border" key={unit.id}>
                          <div className="card-body !tw-p-6">
                            {/* Unit Header */}
                            <div className="row tw-flex tw-items-center tw-justify-between tw-mb-6">
                              <div className="col-8 tw-flex tw-items-baseline">
                                <div className="tw-me-2">{`${
                                  unitIdx + 1
                                }. `}</div>
                                <TextInput
                                  name={`units[${unitIdx}].unitName`}
                                  value={unit.unitName}
                                  onChange={formik.handleChange}
                                  placeHolder="Enter Unit Name"
                                  inputClassName="input"
                                  formgroupClassName="mb-0 tw-flex-1 tw-border-none"
                                  invalid={
                                    unitTouched?.unitName && unitError?.unitName
                                      ? true
                                      : false
                                  }
                                  error={
                                    unitTouched?.unitName && unitError?.unitName
                                      ? unitError?.unitName
                                      : ""
                                  }
                                />
                              </div>
                              <div className="col-auto ms-auto d-flex align-items-center justify-between">
                                <div className="tw-me-6 tw-text-gray-500">
                                  <span className="tw-me-2">Weeks :</span>
                                  {unit.weeks.map((w) => w.weekId).join(", ")}
                                </div>
                                <button
                                  type="button"
                                  className="text-muted me-2"
                                >
                                  <HugeiconsIcon icon={Edit03Icon} size={16} />
                                </button>
                                {unitIdx !== 0 && (
                                  <button
                                    type="button"
                                    className="text-danger"
                                    onClick={() => unitHelpers.remove(unitIdx)}
                                  >
                                    <HugeiconsIcon
                                      icon={Delete02StrokeStandard}
                                      size={16}
                                    />
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Week Map */}
                            <div className="mt-2 d-flex align-items-center tw-border tw-rounded tw-p-3 tw-mb-6 shadow">
                              <p className="mb-0 me-2 fs-12">Week Map:</p>
                              <div className="tw-flex tw-flex-wrap tw-gap-y-2">
                                {[...Array(40)].map((_, wIdx) => {
                                  const weekNumber = `${wIdx + 1}`;
                                  const weekName = `week${weekNumber}`;
                                  const currentWeeks = unit.weeks || [];

                                  const isChecked = currentWeeks.some(
                                    (w) => w.weekId === weekNumber
                                  );

                                  const handleWeekToggle = () => {
                                    const updatedWeeks = isChecked
                                      ? currentWeeks.filter(
                                          (w) => w.weekId !== weekNumber
                                        )
                                      : [
                                          ...currentWeeks,
                                          { weekId: weekNumber, weekName },
                                        ];

                                    formik.setFieldValue(
                                      `units[${unitIdx}].weeks`,
                                      updatedWeeks
                                    );
                                  };

                                  return (
                                    <div key={weekNumber}>
                                      <p className="tw-mb-0 tw-text-xs tw-flex tw-items-center tw-justify-center">
                                        {wIdx + 1}
                                      </p>
                                      <InputCheckbox
                                        name={weekName}
                                        value={isChecked}
                                        onChange={handleWeekToggle}
                                        formgroupClassName="mb-0 d-flex align-items-center justify-content-center"
                                      />
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Chapters */}
                            <FieldArray name={`units[${unitIdx}].chapters`}>
                              {(chapterHelpers) => (
                                <div className="tw-ms-6">
                                  {unit?.chapters?.length > 0 &&
                                    unit.chapters.map((chapter, chapIdx) => {
                                      const chapterError = unitError
                                        ?.chapters?.[
                                        chapIdx
                                      ] as FormikErrors<Chapter>;
                                      const chapterTouched =
                                        unitTouched?.chapters?.[chapIdx];
                                      return (
                                        <div
                                          key={chapter.id}
                                          className="tw-mb-4"
                                        >
                                          <div className="row tw-flex tw-items-end tw-justify-between tw-mb-4">
                                            <div className="col-8 tw-flex tw-items-baseline">
                                              <div className="me-2 fs-12">{`${
                                                unitIdx + 1
                                              }.${chapIdx + 1}`}</div>
                                              <TextInput
                                                name={`units[${unitIdx}].chapters[${chapIdx}].chapterName`}
                                                value={chapter.chapterName}
                                                onChange={formik.handleChange}
                                                placeHolder="Enter Chapter Name"
                                                inputClassName="input"
                                                formgroupClassName="mb-0 tw-flex-1"
                                                invalid={
                                                  chapterTouched?.chapterName &&
                                                  chapterError?.chapterName
                                                    ? true
                                                    : false
                                                }
                                                error={
                                                  chapterTouched?.chapterName &&
                                                  chapterError?.chapterName
                                                    ? chapterError?.chapterName
                                                    : ""
                                                }
                                              />
                                            </div>
                                            <div className="col-auto ms-auto">
                                              <button
                                                type="button"
                                                className="text-muted me-2"
                                              >
                                                <HugeiconsIcon
                                                  icon={Edit03Icon}
                                                  size={16}
                                                />
                                              </button>
                                              <button
                                                type="button"
                                                className="text-danger"
                                                onClick={() =>
                                                  chapterHelpers.remove(chapIdx)
                                                }
                                              >
                                                <HugeiconsIcon
                                                  icon={Delete02StrokeStandard}
                                                  size={16}
                                                />
                                              </button>
                                            </div>
                                          </div>

                                          {/* Topics */}
                                          <FieldArray
                                            name={`units[${unitIdx}].chapters[${chapIdx}].topics`}
                                          >
                                            {(topicHelpers) => (
                                              <div className="tw-ms-6">
                                                {chapter.topics.length > 0 &&
                                                  chapter.topics.map(
                                                    (topic, topicIdx) => {
                                                      const topicError =
                                                        chapterError?.topics?.[
                                                          topicIdx
                                                        ] as FormikErrors<Topic>;
                                                      const topicTouched =
                                                        chapterTouched
                                                          ?.topics?.[topicIdx];

                                                      return (
                                                        <div
                                                          key={topic.id}
                                                          className="mb-3"
                                                        >
                                                          <div className="row g-3 tw-flex tw-items-center mb-2">
                                                            <div className="col-5 tw-flex tw-items-baseline">
                                                              <div className="me-2 fs-12">{`${
                                                                unitIdx + 1
                                                              }.${
                                                                chapIdx + 1
                                                              }.${
                                                                topicIdx + 1
                                                              }`}</div>
                                                              <TextInput
                                                                name={`units[${unitIdx}].chapters[${chapIdx}].topics[${topicIdx}].topicName`}
                                                                value={
                                                                  topic.topicName
                                                                }
                                                                onChange={
                                                                  formik.handleChange
                                                                }
                                                                placeHolder="Enter Topic Name"
                                                                formgroupClassName="mb-0 tw-flex-1"
                                                                inputClassName="input"
                                                                invalid={
                                                                  topicError?.topicName &&
                                                                  topicTouched?.topicName
                                                                    ? true
                                                                    : false
                                                                }
                                                                error={
                                                                  topicError?.topicName &&
                                                                  topicTouched?.topicName
                                                                    ? topicError?.topicName
                                                                    : ""
                                                                }
                                                              />
                                                            </div>
                                                            <div className="col-3">
                                                              {/* <TextInput
                                                              name={`units[${unitIdx}].chapters[${chapIdx}].topics[${topicIdx}].week`}
                                                              value={
                                                                topic.sessions
                                                              }
                                                              onChange={
                                                                formik.handleChange
                                                              }
                                                              placeHolder="No of Weeks"
                                                              formgroupClassName="mb-0"
                                                              invalid={
                                                                topicError?.week &&
                                                                topicTouched?.week
                                                                  ? true
                                                                  : false
                                                              }
                                                              error={
                                                                topicError?.week &&
                                                                topicTouched?.week
                                                                  ? topicError?.week
                                                                  : ""
                                                              }
                                                              labelText="No of Weeks"
                                                              floatingLabel
                                                            /> */}
                                                              <SelectInput
                                                                name={`units[${unitIdx}].chapters[${chapIdx}].topics[${topicIdx}].sessions`}
                                                                value={"1"}
                                                                onChange={
                                                                  formik.handleChange
                                                                }
                                                                valueKey="sessionId"
                                                                textKey="sessionName"
                                                                menuItems={
                                                                  sessionsList ||
                                                                  []
                                                                }
                                                                formgroupClassName="mb-0"
                                                                invalid={
                                                                  topicError?.week &&
                                                                  topicTouched?.week
                                                                    ? true
                                                                    : false
                                                                }
                                                                error={
                                                                  topicError?.week &&
                                                                  topicTouched?.week
                                                                    ? topicError?.week
                                                                    : ""
                                                                }
                                                                labelText="Planned Sessions"
                                                                floatingLabel
                                                              />
                                                            </div>
                                                            <div className="col-3">
                                                              <SelectInput
                                                                name={`units[${unitIdx}].chapters[${chapIdx}].topics[${topicIdx}].sessions`}
                                                                menuItems={
                                                                  weekList || []
                                                                }
                                                                value={"1"}
                                                                valueKey="weekId"
                                                                textKey="weekName"
                                                                onChange={
                                                                  formik.handleChange
                                                                }
                                                                formgroupClassName="mb-0"
                                                                labelText="Select Weeks"
                                                                floatingLabel
                                                                invalid={
                                                                  topicError?.sessions &&
                                                                  topicTouched?.sessions
                                                                    ? true
                                                                    : false
                                                                }
                                                                error={
                                                                  topicError?.sessions &&
                                                                  topicTouched?.sessions
                                                                    ? topicError?.sessions
                                                                    : ""
                                                                }
                                                                defaultSelect="Weeks"
                                                              />
                                                            </div>
                                                            <div className="col-auto ms-auto">
                                                              <button
                                                                type="button"
                                                                className="text-muted me-2"
                                                              >
                                                                <HugeiconsIcon
                                                                  icon={
                                                                    Edit03Icon
                                                                  }
                                                                  size={16}
                                                                />
                                                              </button>
                                                              <button
                                                                type="button"
                                                                className="text-danger"
                                                                onClick={() =>
                                                                  topicHelpers.remove(
                                                                    topicIdx
                                                                  )
                                                                }
                                                              >
                                                                <HugeiconsIcon
                                                                  icon={
                                                                    Delete02StrokeStandard
                                                                  }
                                                                  size={16}
                                                                />
                                                              </button>
                                                            </div>
                                                          </div>
                                                          <div className="row g-3 tw-flex tw-items-center">
                                                            <div className="col-5 !tw-ps-10">
                                                              <TextInput
                                                                name="los"
                                                                value=""
                                                                // labelText="LO's"
                                                                formgroupClassName="mb-0"
                                                                inputClassName="input"
                                                                placeHolder="Enter LO to the current topic"
                                                              ></TextInput>
                                                            </div>
                                                            <div className="col-3">
                                                              <TextInput
                                                                name="los"
                                                                value=""
                                                                // labelText="LO's"
                                                                formgroupClassName="mb-0"
                                                                inputClassName="input"
                                                                placeHolder="Enter Bloom's level"
                                                              ></TextInput>
                                                            </div>
                                                          </div>
                                                        </div>
                                                      );
                                                    }
                                                  )}
                                                <div className="mt-2">
                                                  <button
                                                    type="button"
                                                    className="text-info"
                                                    onClick={() =>
                                                      topicHelpers.push({
                                                        id: generateUniqueNumber(),
                                                        topicName: "",
                                                        sessions: 1,
                                                        week: 1,
                                                      })
                                                    }
                                                  >
                                                    + Add Topic
                                                  </button>
                                                </div>
                                              </div>
                                            )}
                                          </FieldArray>
                                        </div>
                                      );
                                    })}
                                  <div className="mt-3">
                                    <button
                                      type="button"
                                      className="text-success"
                                      onClick={() =>
                                        chapterHelpers.push({
                                          id: generateUniqueNumber(),
                                          chapterName: "",
                                          topics: [],
                                        })
                                      }
                                    >
                                      + Add Chapter
                                    </button>
                                  </div>
                                </div>
                              )}
                            </FieldArray>
                          </div>
                        </div>
                      );
                    })}
                    <div className="tw-mt-3 tw-mb-8 tw-flex tw-justify-between">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() =>
                          unitHelpers.push({
                            id: generateUniqueNumber(),
                            unitName: "",
                            weeks: [],
                            chapters: [],
                          })
                        }
                      >
                        + Add Unit
                      </button>
                    </div>
                  </>
                );
              }}
            </FieldArray>
          </Form>
        </FormikProvider>
        <div className="card">
          <div className="card-body">
            <div className="tw-flex tw-items-center tw-justify-center tw-gap-2">
              <button
                type="button"
                className="btn btn-outline-warning !tw-py-[0.5065rem]"
              >
                Save Draft
              </button>
              <button
                type="submit"
                className="btn btn-outline-primary !tw-py-[0.5065rem]"
                onClick={(event: any) => formik.handleSubmit(event)}
              >
                Finalize Curriculum
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary !tw-py-[0.5065rem]"
              >
                Export PDF
              </button>

              <div className="d-flex">
                <DropDownToggle
                  id="curriculum-preview"
                  menuOptions={dropDownOption || []}
                  btnName="Preview as"
                  dropDownClassName=""
                ></DropDownToggle>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurriculumEditor;
