import React, { useMemo, useRef } from "react";
import { useFormik, FieldArray, FormikProvider, FormikErrors } from "formik";
import * as Yup from "yup";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  Bookmark03Icon,
  CircleArrowLeft01Icon,
  CircleArrowRight01Icon,
  Delete02StrokeStandard,
  Edit03Icon,
  PlusSignIcon,
} from "@hugeicons-pro/core-stroke-standard";
import { Button, Form } from "reactstrap";
import {
  DropDownToggle,
  InputCheckbox,
  SelectInput,
  TextInput,
} from "../../../../../Components/Common";
import { generateUniqueNumber } from "../../../../../utility/commonutility";

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
      const newUnits: any = values.units.map((unit, unitIdx) => ({
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

  return (
    <>
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
                      <div
                        className="card !tw-rounded-lg border tw-border-hidden"
                        key={unit.id}
                      >
                        <div className="card-body !tw-p-6">
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
                                inputClassName=""
                                formgroupClassName="mb-0 tw-flex-1 tw-border-none"
                                labelText="Unit Name"
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

                          <div className="tw-mb-8">
                            <p className="tw-mb-3 tw-me-2">Week Map:</p>
                            <div className="tw-flex tw-flex-wrap tw-gap-2">
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
                                  <div
                                    key={weekNumber}
                                    onClick={handleWeekToggle}
                                    className={`tw-rounded-lg tw-border tw-w-[32px] tw-h-[32px] tw-flex tw-items-center tw-justify-center tw-text-xs tw-cursor-pointer
                                    ${
                                      isChecked
                                        ? "tw-bg-green-50 tw-text-green-700 tw-border-green-500 tw-text-base tw-font-semibold"
                                        : "tw-bg-white tw-text-gray-700 tw-border-gray-300"
                                    }`}
                                  >
                                    {wIdx + 1}
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Chapters */}
                          <FieldArray name={`units[${unitIdx}].chapters`}>
                            {(chapterHelpers) => (
                              <div className="tw-ms-0 tw-border tw-p-4 tw-rounded-md">
                                {unit?.chapters?.length > 0 &&
                                  unit.chapters.map((chapter, chapIdx) => {
                                    const chapterError = unitError?.chapters?.[
                                      chapIdx
                                    ] as FormikErrors<Chapter>;
                                    const chapterTouched =
                                      unitTouched?.chapters?.[chapIdx];
                                    return (
                                      <div key={chapter.id} className="tw-mb-4">
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
                                              inputClassName=""
                                              formgroupClassName="mb-0 tw-flex-1"
                                              labelText="Chapter"
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
                                            <div className="tw-ms-8 tw-border tw-border-dashed tw-rounded">
                                              {chapter.topics.length > 0 &&
                                                chapter.topics.map(
                                                  (topic, topicIdx) => {
                                                    const topicError =
                                                      chapterError?.topics?.[
                                                        topicIdx
                                                      ] as FormikErrors<Topic>;
                                                    const topicTouched =
                                                      chapterTouched?.topics?.[
                                                        topicIdx
                                                      ];

                                                    return (
                                                      <div
                                                        key={topic.id}
                                                        className="tw-p-4 tw-border-dashed tw-border-b"
                                                      >
                                                        <div className="row g-3 tw-flex tw-items-center tw-mb-4">
                                                          <div className="col-5 tw-flex tw-items-baseline">
                                                            <div className="me-2 fs-12">{`${
                                                              unitIdx + 1
                                                            }.${chapIdx + 1}.${
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
                                                              inputClassName=""
                                                              labelText="Topic"
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
                                                          <div className="col-auto ms-auto">
                                                            {/* <button
                                                              type="button"
                                                              className="text-muted me-2"
                                                            >
                                                              <HugeiconsIcon
                                                                icon={
                                                                  Edit03Icon
                                                                }
                                                                size={16}
                                                              />
                                                            </button> */}
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
                                                        <div className="row g-3 tw-flex tw-items-center tw-mb-4">
                                                          <div className="col-3">
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
                                                            />
                                                          </div>
                                                          <div className="col-3">
                                                            <SelectInput
                                                              name={`units[${unitIdx}].chapters[${chapIdx}].topics[${topicIdx}].weeks`}
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
                                                              labelText="Weeks"
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
                                                          <div className="col-3">
                                                            <SelectInput
                                                              name={`units[${unitIdx}].chapters[${chapIdx}].topics[${topicIdx}].blooms`}
                                                              menuItems={[]}
                                                              value={""}
                                                              valueKey=""
                                                              textKey=""
                                                              onChange={
                                                                formik.handleChange
                                                              }
                                                              formgroupClassName="mb-0"
                                                              labelText="Bloom Level"
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
                                                            />
                                                          </div>
                                                        </div>
                                                        <div className="row g-3 tw-flex tw-items-center tw-mb-4">
                                                          <div className="col-5">
                                                            <TextInput
                                                              name="los"
                                                              value=""
                                                              labelText="LO's"
                                                              formgroupClassName="mb-0"
                                                              inputClassName=""
                                                              placeHolder="Enter LO to the current topic"
                                                            ></TextInput>
                                                          </div>
                                                        </div>
                                                      </div>
                                                    );
                                                  }
                                                )}
                                              <div className="tw-p-4 tw-flex tw-justify-end">
                                                <button
                                                  type="button"
                                                  className="btn btn-outline-success btn-sm"
                                                  onClick={() =>
                                                    topicHelpers.push({
                                                      id: generateUniqueNumber(),
                                                      topicName: "",
                                                      sessions: 1,
                                                      week: 1,
                                                    })
                                                  }
                                                >
                                                  <HugeiconsIcon
                                                    icon={PlusSignIcon}
                                                    className="tw-me-2"
                                                    size={18}
                                                  />
                                                  Add Topic
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

      <div className="row">
        <div className="row mt-4">
          <div className="col-12 d-flex justify-content-between">
            <button type="button" className="btn btn-success">
              <HugeiconsIcon
                icon={CircleArrowLeft01Icon}
                size={20}
                color="currentColor"
                className="!tw-mr-1"
              />
              Previous Step
            </button>
            <div>
              <button type="button" className="btn btn-outline-primary me-2">
                <HugeiconsIcon
                  icon={Bookmark03Icon}
                  size={20}
                  color="currentColor"
                  className="!tw-mr-1"
                />
                Save as draft
              </button>
              <button
                type="button"
                className="btn btn-success"
                // onClick={handleNext}
              >
                Next Step{" "}
                <HugeiconsIcon
                  icon={CircleArrowRight01Icon}
                  size={20}
                  color="currentColor"
                  className="!tw-ml-1"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CurriculumEditor;
