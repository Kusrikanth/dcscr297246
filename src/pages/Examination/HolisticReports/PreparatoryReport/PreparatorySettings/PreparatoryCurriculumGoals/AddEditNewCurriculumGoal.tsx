import React, { useRef, useEffect } from "react";
import { FieldArray, useFormik, FormikProvider, ArrayHelpers } from "formik";
import * as Yup from "yup";

import { shallowEqual } from "react-redux";
import {
  getPreparatoryDomainAct,
  getPreparatoryDomainModelAct,
  savePreparatoryCurriculumGoalsAct,
  updatePreparatoryCurriculumGoalsAct,
} from "../../../../../../store/examination/examinationsettings/examinationsettingsaction";

import { generateUniqueNumber } from "../../../../../../utility/commonutility";
import {
  SelectInput,
  TextArea,
  TextInputWithRegex,
} from "../../../../../../Components/Common";
import { generateActionPayload } from "../../../../../../utility/reduxutility";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../../../hooks/storehook";
import { transformResponse } from "../../../Settings/CurriculumGoals/helper";

const getInitialValues = (dataLength: number) => ({
  curriculumGoal: "",
  domain: "",
  curriculumGoalIndex: String(dataLength + 1),
  term: [
    {
      uniqueId: generateUniqueNumber(),
      competencyName: "",
      competencyIndex: "",
      competencyId: null,
    },
  ],
});

const validationSchema = Yup.object().shape({
  curriculumGoal: Yup.string()
    .nullable()
    .required("Curricular Goal is required"),
  curriculumGoalIndex: Yup.string()
    .nullable()
    .required("Curricular Goal Index is required"),
  domain: Yup.string().nullable().required("Domain is required"),
  term: Yup.array().of(
    Yup.object().shape({
      competencyName: Yup.string()
        .nullable()
        .required("Competency Name is required"),
      competencyIndex: Yup.string()
        .nullable()
        .required("Competency Index is required"),
    })
  ),
});

const AddEditNewCurriculumGoal = (props: any) => {
  const dispatch = useAppDispatch();
  const formikArrayHelpers = useRef<ArrayHelpers | null>(null);
  const originalCompetencies = useRef<any[]>([]);

  const {
    showApiLoader,
    currentBranchIdResp: branchId,
    getPreparatoryDomainResp,
    getPreparatoryCurriculumGoalsResp,
  } = useAppSelector(
    ({ examinationSettings, appData, globalData }) => ({
      currentBranchIdResp: appData.currentBranchIdResp,
      showApiLoader: globalData.showApiLoader,
      getPreparatoryDomainResp: examinationSettings.getPreparatoryDomainResp,
      getPreparatoryCurriculumGoalsResp:
        examinationSettings.getPreparatoryCurriculumGoalsResp,
    }),
    shallowEqual
  );

  const termNameFormik = useFormik({
    initialValues: getInitialValues(props.dataLength || 0),
    validationSchema,
    onSubmit: (values) => {
      if (props.id) {
        const currentCompetencyIds = values.term
          .map((term) => term.competencyId)
          .filter((id) => id);

        const deletedCompetencies = originalCompetencies.current
          .filter(
            (original) => !currentCompetencyIds.includes(original.competencyId)
          )
          .map((comp) => ({
            competencyId: comp.competencyId,
            competencyName: comp.competencyName,
            competencyIndex: comp.competencyIndex,
            delete: true,
          }));

        const currentCompetencies = values.term
          .filter((ele) => ele.competencyName && ele.competencyIndex)
          .map((ele) => ({
            competencyId: ele.competencyId || "",
            competencyName: ele.competencyName,
            competencyIndex: ele.competencyIndex,
            delete: false,
          }));

        const allCompetencies = [
          ...currentCompetencies,
          ...deletedCompetencies,
        ];

        const data = {
          goalName: values.curriculumGoal,
          goalIndex: values.curriculumGoalIndex,
          competencies: allCompetencies,
        };

        dispatch(
          updatePreparatoryCurriculumGoalsAct(
            generateActionPayload(
              "update_preparatory_curriculum_goals",
              { id: props.id },
              data
            )
          )
        );
      } else {
        const termDetailsDTOS = values.term
          .filter((ele) => ele.competencyName && ele.competencyIndex)
          .map((ele) => ({
            competencyName: ele.competencyName,
            competencyIndex: ele.competencyIndex,
          }));

        const data = {
          branchId,
          goalName: values.curriculumGoal,
          goalIndex: values.curriculumGoalIndex,
          domainId: values.domain,
          termDetailsDTOS,
        };
        const payload = transformResponse(data);

        dispatch(
          savePreparatoryCurriculumGoalsAct(
            generateActionPayload(
              "save_preparatory_curriculum_goals",
              undefined,
              payload
            )
          )
        );
      }
    },
  });

  const getHolisticDomainApiCall = (otherProps?: any) => {
    dispatch(
      getPreparatoryDomainModelAct(
        generateActionPayload("get_preparatory_domain", undefined, {})
      )
    );
  };

  useEffect(() => {
    getHolisticDomainApiCall();
  }, []);

  useEffect(() => {
    if (props.id) {
      const data = getPreparatoryCurriculumGoalsResp?.find(
        (item: any) => +item.goalId === +props.id
      );

      if (data) {
        originalCompetencies.current =
          data.competencies?.map((comp: any) => ({
            competencyId: comp.competencyId,
            competencyName: comp.competencyName,
            competencyIndex: comp.competencyIndex,
          })) || [];

        termNameFormik.setValues({
          curriculumGoal: data.goalName || "",
          curriculumGoalIndex: data.goalIndex || "",
          domain: data.domainId || "",
          term:
            data.competencies?.map((comp: any) => ({
              uniqueId: generateUniqueNumber(),
              competencyName: comp.competencyName || "",
              competencyIndex: comp.competencyIndex || "",
              competencyId: comp.competencyId || null,
            })) || [],
        });
      }
    }
  }, [props.id, getPreparatoryCurriculumGoalsResp]);

  function addNewDepartmentHndlr(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    if (formikArrayHelpers.current) {
      formikArrayHelpers.current.push({
        uniqueId: generateUniqueNumber(),
        competencyName: "",
        competencyIndex: "",
        competencyId: null,
      });
    }
  }

  function removeDepartmentHndlr(event: React.MouseEvent<HTMLButtonElement>) {
    const rowIndex = event.currentTarget.getAttribute("data-index");
    if (rowIndex !== undefined || rowIndex !== null) {
      formikArrayHelpers.current?.remove(Number(rowIndex));
    }
  }

  return (
    <>
      <form onSubmit={termNameFormik.handleSubmit}>
        <div className="">
          <div className="row px-4 pt-3">
            <div className="col-6">
              <SelectInput
                name="domain"
                value={termNameFormik.values.domain}
                onChange={termNameFormik.handleChange}
                menuItems={getPreparatoryDomainResp || []}
                valueKey="id"
                textKey="name"
                labelText="Domain"
                isDisabled={props.id}
                invalid={
                  termNameFormik.touched.domain && termNameFormik.errors.domain
                    ? true
                    : false
                }
                error={
                  termNameFormik.touched.domain && termNameFormik.errors.domain
                    ? termNameFormik.errors.domain
                    : ""
                }
              />
            </div>
            <div className="col-6">
              <TextInputWithRegex
                name="curriculumGoalIndex"
                formgroupClassName="mb-0"
                value={termNameFormik.values.curriculumGoalIndex}
                onChange={termNameFormik.handleChange}
                labelText="Curricular Goal Index"
                invalid={
                  termNameFormik.touched.curriculumGoalIndex &&
                  termNameFormik.errors.curriculumGoalIndex
                    ? true
                    : false
                }
                error={
                  termNameFormik.touched.curriculumGoalIndex &&
                  termNameFormik.errors.curriculumGoalIndex
                    ? termNameFormik.errors.curriculumGoalIndex
                    : ""
                }
                allowedInputRegex="^[0-9]+(\.[0-9]*){0,2}$"
              />
            </div>
            <div className="col-12">
              <TextArea
                name="curriculumGoal"
                onChange={termNameFormik.handleChange}
                value={termNameFormik.values.curriculumGoal}
                labelText="Curricular Goal"
                invalid={
                  termNameFormik.touched.curriculumGoal &&
                  termNameFormik.errors.curriculumGoal
                    ? true
                    : false
                }
                error={
                  termNameFormik.touched.curriculumGoal &&
                  termNameFormik.errors.curriculumGoal
                    ? termNameFormik.errors.curriculumGoal
                    : ""
                }
              />
            </div>
          </div>
          <div className="row bg-light px-3 py-3 mb-2 mx-0">
            <div className="col-5 d-flex align-items-center">
              <h6 className="mb-0 form-label required">Competencies</h6>
            </div>
            <div className="col-5 d-flex align-items-center">
              <h6 className="mb-0 form-label required">Competencies Index</h6>
            </div>
            <div className="col d-grid mt-0">
              <div className="hstack">
                <button
                  onClick={addNewDepartmentHndlr}
                  className="btn-sm ms-3 btn-icon btn btn-outline-primary"
                >
                  <i className="ri-add-line fs-18" />
                </button>
              </div>
            </div>
          </div>
          <div className="row px-4">
            <div className="col-12 mt-2">
              <FormikProvider value={termNameFormik}>
                <FieldArray name="term">
                  {(arrayHelpers: ArrayHelpers) => {
                    if (!formikArrayHelpers.current) {
                      formikArrayHelpers.current = arrayHelpers;
                    }
                    return (
                      <>
                        {termNameFormik.values.term.length > 0 &&
                          termNameFormik.values.term.map(
                            (term: any, index: any) => {
                              const inputFieldErrors: any =
                                (termNameFormik.errors.term &&
                                  termNameFormik.errors.term[index]) ||
                                {};
                              const inputFieldTouched =
                                (termNameFormik.touched.term &&
                                  termNameFormik.touched.term[index]) ||
                                {};
                              return (
                                <div
                                  key={term.uniqueId}
                                  className="row g-3 mb-3"
                                >
                                  <div className="col-5">
                                    <TextArea
                                      name={`term[${index}].competencyName`}
                                      formgroupClassName="mb-0"
                                      height="36px"
                                      value={term.competencyName}
                                      onChange={termNameFormik.handleChange}
                                      invalid={
                                        inputFieldTouched.competencyName &&
                                        inputFieldErrors.competencyName
                                          ? true
                                          : false
                                      }
                                      error={
                                        inputFieldTouched.competencyName &&
                                        inputFieldErrors.competencyName
                                          ? inputFieldErrors.competencyName
                                          : ""
                                      }
                                    />
                                  </div>
                                  <div className="col-5">
                                    <TextInputWithRegex
                                      name={`term[${index}].competencyIndex`}
                                      formgroupClassName="mb-0"
                                      value={term.competencyIndex}
                                      onChange={termNameFormik.handleChange}
                                      invalid={
                                        inputFieldTouched.competencyIndex &&
                                        inputFieldErrors.competencyIndex
                                          ? true
                                          : false
                                      }
                                      error={
                                        inputFieldTouched.competencyIndex &&
                                        inputFieldErrors.competencyIndex
                                          ? inputFieldErrors.competencyIndex
                                          : ""
                                      }
                                      allowedInputRegex="^[0-9]+(\.[0-9]*){0,2}$"
                                    />
                                  </div>
                                  <div className="col d-flex">
                                    <div className="hstack">
                                      <button
                                        data-index={index}
                                        onClick={removeDepartmentHndlr}
                                        className="btn-sm btn-icon btn-rounded btn-hover-danger btn btn-white"
                                      >
                                        <i className="ri-delete-bin-2-fill" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              );
                            }
                          )}
                      </>
                    );
                  }}
                </FieldArray>
              </FormikProvider>
            </div>
          </div>
          <div className="px-4 pb-3 hstack gap-2 justify-content-end mt-2 mb-1">
            <button
              type="button"
              className={"btn btn-light"}
              onClick={props.toggle}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-success px-4"
              disabled={showApiLoader}
            >
              Save
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default AddEditNewCurriculumGoal;
