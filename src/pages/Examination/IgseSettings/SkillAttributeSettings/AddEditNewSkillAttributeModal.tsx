import React, { useRef, useEffect } from "react";
import { FieldArray, useFormik, FormikProvider, ArrayHelpers } from "formik";
import * as Yup from "yup";
import { shallowEqual } from "react-redux";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { SelectInput, TextInput } from "../../../../Components/Common";
import { generateUniqueNumber } from "../../../../utility/commonutility";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Delete02StrokeStandard,
  PlusSignIcon,
} from "@hugeicons-pro/core-stroke-standard";

import { getBranchCurriculumAct } from "../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { generateActionPayload } from "../../../../utility/reduxutility";
import {
  saveSkillAttributeSettingsItemAct,
  updateSkillAttributeSettingsItemAct,
} from "../../../../store/examination/examinationsettings/examinationsettingsaction";

const newAttribute = () => ({
  attributeId: generateUniqueNumber(),
  attributeName: "",
  isDeleted: null,
  isNew: true,
});

const newSkill = () => ({
  id: generateUniqueNumber(),
  skillName: "",
  attributes: [newAttribute()],
});

const initialValues = {
  academicYearId: "",
  curriculumId: "",
  skills: [newSkill()],
};

const validationSchema = Yup.object().shape({
  academicYearId: Yup.string().required("Academic Year is required").nullable(),
  curriculumId: Yup.string().required("Curriculum is required").nullable(),
  skills: Yup.array().of(
    Yup.object().shape({
      skillName: Yup.string().required("Skill Name is required").nullable(),
      attributes: Yup.array().of(
        Yup.object().shape({
          attributeName: Yup.string()
            .required("Attribute Name is required")
            .nullable(),
        })
      ),
    })
  ),
});

const AddEditNewSkillAttributeModal = ({ toggle, editItemId }: any) => {
  const dispatch = useAppDispatch();

  const skillsArrayHelpersRef = useRef<ArrayHelpers | null>(null);

  const attrArrayHelpersRefMap = useRef<Record<number, ArrayHelpers>>({});

  const {
    academicYearListResp,
    currentBranchIdResp: branchId,
    brchCurriculumResp,
    showApiLoader,
    getSkillAttributeSettingsItemByIdResp,
  } = useAppSelector(
    ({
      instAcademics,
      appData,
      branchAcademics,
      globalData,
      examinationSettings,
    }: any) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      showApiLoader: globalData.showApiLoader,
      getSkillAttributeSettingsItemByIdResp:
        examinationSettings.getSkillAttributeSettingsItemByIdResp,
    }),
    shallowEqual
  );

  const addEditNewSkillAtrribute = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      if (editItemId) {
        const { skills } = values;

        const payload = {
          skillName: skills[0].skillName,
          attributes: skills[0].attributes.map((attr) => ({
            attributeName: attr.attributeName,
            ...(attr.isNew ? {} : { attributeId: attr.attributeId }),
            ...(attr.isDeleted === true ? { isDeleted: true } : {}),
          })),
        };

        dispatch(
          updateSkillAttributeSettingsItemAct(
            generateActionPayload(
              "update_skill_entry_attribute",
              { id: editItemId },
              payload
            )
          )
        );
      } else {
        const payload = {
          branchId,
          academicYearId: values.academicYearId,
          curriculumId: values.curriculumId,
          skills: values.skills.map((skill) => ({
            skillName: skill.skillName,
            attributes: skill.attributes.map((attr) => {
              return { attributeName: attr.attributeName };
            }),
          })),
        };
        dispatch(
          saveSkillAttributeSettingsItemAct(
            generateActionPayload(
              "save_skill_entry_attribute",
              undefined,
              payload
            )
          )
        );
      }
    },
  });


  function fetchBranchCurriculumsList(otherProps?: any) {
    const payload = {
      branchId,
      academicYearId: addEditNewSkillAtrribute.values.academicYearId,
      pageNo: 0,
      pageSize: 100,
      sortBy: "curriculumName",
      sortOrder: "asc",
      ...otherProps,
    };

    dispatch(
      getBranchCurriculumAct(
        generateActionPayload("get_brch_curriculum", undefined, payload)
      )
    );
  }

  useEffect(() => {
    const yearId = academicYearListResp?.data?.find(
      (year: any) => (year.yearStatus || "").toLowerCase() === "current"
    )?.academicYearId;

    if (yearId) {
      addEditNewSkillAtrribute.setFieldValue("academicYearId", yearId);
      fetchBranchCurriculumsList({ academicYearId: yearId });
    }
  }, [academicYearListResp]);

  useEffect(() => {
    const { data } = brchCurriculumResp || {};
    const curriculumMapping: Record<string, string> = {
      "/igcse-settings/skill-attribute-settings": "IGCSE",
    };
    const selectedCurriculumName = curriculumMapping[location.pathname];

    if (
      Array.isArray(data) &&
      data.length > 0 &&
      addEditNewSkillAtrribute.values.academicYearId
    ) {
      const selectedCurriculum = data.find(
        (c: any) => c.shortName === selectedCurriculumName
      );
      addEditNewSkillAtrribute.setFieldValue(
        "curriculumId",
        selectedCurriculum?.branchCurriculumId || ""
      );
    }
  }, [brchCurriculumResp, addEditNewSkillAtrribute.values.academicYearId]);

  function addSkillHandler() {
    skillsArrayHelpersRef.current?.push(newSkill());
  }

  function removeSkillHandler(event: React.MouseEvent<HTMLElement>) {
    const rowIndex = event.currentTarget.getAttribute("data-index");
    if (rowIndex !== null && rowIndex !== undefined) {
      if (Number(rowIndex) === 0) return;
      skillsArrayHelpersRef.current?.remove(Number(rowIndex));
    }
  }

  function addAttributeHandler(skillIndex: number) {
    const helpers = attrArrayHelpersRefMap.current[skillIndex];
    helpers?.push(newAttribute());
  }

  function removeAttributeHandler(event: React.MouseEvent<HTMLElement>) {
    const sIdx = event.currentTarget.getAttribute("data-skill-index");
    const aIdx = event.currentTarget.getAttribute("data-attr-index");
    if (sIdx === null || aIdx === null) return;

    const skillIndex = Number(sIdx);
    const attrIndex = Number(aIdx);

    if (attrIndex === 0) return;

    if (editItemId) {
      const currentAttr =
        addEditNewSkillAtrribute.values.skills?.[skillIndex]?.attributes?.[
          attrIndex
        ];

      addEditNewSkillAtrribute.setFieldValue(
        `skills[${skillIndex}].attributes[${attrIndex}]`,
        { ...currentAttr, isDeleted: true }
      );
      return;
    }

    const helpers = attrArrayHelpersRefMap.current[skillIndex];
    helpers?.remove(attrIndex);
  }

  const { data: academicYearList } = academicYearListResp || {};
  const { data: branchCurriculumList } = brchCurriculumResp || {};

  const addEditSkillAttributeRef = useRef({
    prevRetSkillAttributeSettingsItemByIdResp:
      getSkillAttributeSettingsItemByIdResp,
  });

  useEffect(() => {
    if (editItemId && getSkillAttributeSettingsItemByIdResp) {
      const { curriculumId, skillName, attributes, academicYearId } =
        getSkillAttributeSettingsItemByIdResp || {};
      addEditNewSkillAtrribute.setValues((prev: any) => ({
        ...prev,
        curriculumId,
        academicYearId,
        skills: [
          {
            skillName,
            attributes: (attributes || []).map((attr: any) => ({
              ...attr,
              isNew: false,
            })),
          },
        ],
      }));
    }
  }, [editItemId, getSkillAttributeSettingsItemByIdResp]);

  return (
    <div style={{ padding: "1.25rem" }}>
      <FormikProvider value={addEditNewSkillAtrribute}>
        <form onSubmit={addEditNewSkillAtrribute.handleSubmit}>
          <div className="row mb-2">
            <div className="col-12 col-lg-6">
              <SelectInput
                name="academicYearId"
                value={addEditNewSkillAtrribute.values.academicYearId}
                labelText="Academic Year"
                onChange={addEditNewSkillAtrribute.handleChange}
                onBlur={addEditNewSkillAtrribute.handleBlur}
                valueKey="academicYearId"
                textKey="academicYearName"
                menuItems={academicYearList || []}
                isDisabled={true}
                invalid={
                  !!(
                    addEditNewSkillAtrribute.touched.academicYearId &&
                    addEditNewSkillAtrribute.errors.academicYearId
                  )
                }
                error={
                  addEditNewSkillAtrribute.touched.academicYearId &&
                  addEditNewSkillAtrribute.errors.academicYearId
                    ? (addEditNewSkillAtrribute.errors.academicYearId as any)
                    : ""
                }
              />
            </div>

            <div className="col-12 col-lg-6">
              <SelectInput
                name="curriculumId"
                value={addEditNewSkillAtrribute.values.curriculumId}
                labelText="Curriculum"
                onChange={addEditNewSkillAtrribute.handleChange}
                onBlur={addEditNewSkillAtrribute.handleBlur}
                valueKey="branchCurriculumId"
                textKey="shortName"
                menuItems={branchCurriculumList || []}
                isDisabled={true}
                invalid={
                  !!(
                    addEditNewSkillAtrribute.touched.curriculumId &&
                    addEditNewSkillAtrribute.errors.curriculumId
                  )
                }
                error={
                  addEditNewSkillAtrribute.touched.curriculumId &&
                  addEditNewSkillAtrribute.errors.curriculumId
                    ? (addEditNewSkillAtrribute.errors.curriculumId as any)
                    : ""
                }
              />
            </div>
          </div>

          <FormikProvider value={addEditNewSkillAtrribute}>
            <FieldArray name="skills">
              {(skillHelpers: ArrayHelpers) => {
                if (!skillsArrayHelpersRef.current) {
                  skillsArrayHelpersRef.current = skillHelpers;
                }

                return (
                  <>
                    {addEditNewSkillAtrribute.values.skills?.map(
                      (skill: any, sIdx: number) => {
                        const skillErr: any =
                          (addEditNewSkillAtrribute.errors.skills &&
                            (addEditNewSkillAtrribute.errors.skills as any)[
                              sIdx
                            ]) ||
                          {};
                        const skillTouch: any =
                          (addEditNewSkillAtrribute.touched.skills &&
                            (addEditNewSkillAtrribute.touched.skills as any)[
                              sIdx
                            ]) ||
                          {};

                        return (
                          <>
                            <div
                              key={skill.id}
                              className="border rounded p-3 mb-3"
                            >
                              <div className="row tw-items-center tw-mb-6">
                                <div className="col-10">
                                  <TextInput
                                    name={`skills[${sIdx}].skillName`}
                                    value={skill.skillName}
                                    onChange={
                                      addEditNewSkillAtrribute.handleChange
                                    }
                                    onBlur={addEditNewSkillAtrribute.handleBlur}
                                    placeHolder="Skill Name"
                                    formgroupClassName="mb-0"
                                    invalid={
                                      !!(
                                        skillTouch.skillName &&
                                        skillErr.skillName
                                      )
                                    }
                                    error={
                                      skillTouch.skillName && skillErr.skillName
                                        ? skillErr.skillName
                                        : ""
                                    }
                                    labelText="Skill Name"
                                    labelClass="required"
                                  />
                                </div>

                                <div className="col-2 d-flex align-items-start">
                                  {sIdx !== 0 && (
                                    <button
                                      type="button"
                                      data-index={sIdx}
                                      onClick={removeSkillHandler}
                                      className="btn btn-outline-danger btn-sm btn-icon btn-hover-danger"
                                    >
                                      <HugeiconsIcon
                                        icon={Delete02StrokeStandard}
                                        className="text-danger"
                                        size={18}
                                      />
                                    </button>
                                  )}
                                </div>
                              </div>

                              <div className="tw-w-[80%] tw-border tw-rounded tw-px-4 tw-py-3 tw-grid tw-gap-y-3 tw-relative">
                                <div className="">
                                  <p className="m-0 tw-absolute tw-px-2 tw-py-1 tw-rounded tw-bg-white tw-top-0 tw--translate-y-1/2 form-label required">
                                    Attributes
                                  </p>
                                </div>

                                <div>
                                  <FieldArray
                                    name={`skills[${sIdx}].attributes`}
                                  >
                                    {(attrHelpers: ArrayHelpers) => {
                                      attrArrayHelpersRefMap.current[sIdx] =
                                        attrHelpers;

                                      return (
                                        <>
                                          {skill.attributes?.map(
                                            (attr: any, aIdx: number) => {
                                              const attrErr: any =
                                                (skillErr.attributes &&
                                                  (skillErr.attributes as any)[
                                                    aIdx
                                                  ]) ||
                                                {};
                                              const attrTouch: any =
                                                (skillTouch.attributes &&
                                                  (
                                                    skillTouch.attributes as any
                                                  )[aIdx]) ||
                                                {};
                                              if (attr?.isDeleted) return null;

                                              return (
                                                <div
                                                  key={attr.attributeId}
                                                  className="row mb-2 tw-items-center"
                                                >
                                                  <div className="col-10">
                                                    <TextInput
                                                      name={`skills[${sIdx}].attributes[${aIdx}].attributeName`}
                                                      value={attr.attributeName}
                                                      onChange={
                                                        addEditNewSkillAtrribute.handleChange
                                                      }
                                                      onBlur={
                                                        addEditNewSkillAtrribute.handleBlur
                                                      }
                                                      placeHolder="Attribute Name"
                                                      formgroupClassName="mb-0"
                                                      invalid={
                                                        !!(
                                                          attrTouch.attributeName &&
                                                          attrErr.attributeName
                                                        )
                                                      }
                                                      error={
                                                        attrTouch.attributeName &&
                                                        attrErr.attributeName
                                                          ? attrErr.attributeName
                                                          : ""
                                                      }
                                                    />
                                                  </div>

                                                  <div className="col-2 d-flex align-items-start">
                                                    {aIdx !== 0 && (
                                                      <button
                                                        type="button"
                                                        data-skill-index={sIdx}
                                                        data-attr-index={aIdx}
                                                        onClick={
                                                          removeAttributeHandler
                                                        }
                                                        className="btn btn-outline-danger btn-sm btn-icon btn-hover-danger"
                                                      >
                                                        <HugeiconsIcon
                                                          icon={
                                                            Delete02StrokeStandard
                                                          }
                                                          className="text-danger"
                                                          size={18}
                                                        />
                                                      </button>
                                                    )}
                                                  </div>
                                                </div>
                                              );
                                            }
                                          )}
                                        </>
                                      );
                                    }}
                                  </FieldArray>
                                </div>

                                <div className="d-flex align-items-center justify-content-between mb-2">
                                  <button
                                    type="button"
                                    className="btn-sm btn btn-outline-secondary tw-text-[10px]"
                                    onClick={() => addAttributeHandler(sIdx)}
                                  >
                                    + Add New Attribute
                                  </button>
                                </div>
                              </div>
                            </div>
                          </>
                        );
                      }
                    )}
                    {!editItemId && (
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <button
                          type="button"
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => addSkillHandler()}
                        >
                          + Add Skill
                        </button>
                      </div>
                    )}
                  </>
                );
              }}
            </FieldArray>
          </FormikProvider>

          <div className="row mt-3">
            <div className="d-flex ms-auto w-auto">
              <button
                type="button"
                className="btn btn-light me-3"
                onClick={toggle}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-success"
                disabled={showApiLoader}
                onClick={(event: any) =>
                  addEditNewSkillAtrribute.handleSubmit(event)
                }
              >
                {editItemId ? "Update" : "Submit"}
              </button>
            </div>
          </div>
        </form>
      </FormikProvider>
    </div>
  );
};

export default AddEditNewSkillAttributeModal;
