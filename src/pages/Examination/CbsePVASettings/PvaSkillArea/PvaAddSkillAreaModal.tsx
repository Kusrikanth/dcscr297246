import React, { useRef, useEffect } from "react";
import { FieldArray, useFormik, FormikProvider, ArrayHelpers } from "formik";
import * as Yup from "yup";
import { generateUniqueNumber } from "../../../../utility/commonutility";
import { SelectInput, TextArea, TextInput } from "../../../../Components/Common";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { getAssignCurriculumListAct } from "../../../../store/assignlanguages/assignlanguagesaction";
import { getPvaSubjectsAct, savePvaSkillAreaAct } from "../../../../store/examination/pvaReports/pvaReportsActions";

const initialValues = {
  curriculumId: "",
  pvaSubjectId: "",
  pvaSkillArea: [
    {
      uniqueId: generateUniqueNumber(),
      PvaSkillAreaName: "",
      description: "",
    },
  ]
};
const validationSchema = Yup.object().shape({
  curriculumId: Yup.string().nullable().required('Curriculum is required'),
  pvaSubjectId: Yup.string().nullable().required('Subject is required'),
  pvaSkillArea: Yup.array().of(
    Yup.object().shape({
      PvaSkillAreaName: Yup.string().nullable().required('Name is required'),
      description: Yup.string().nullable().required('Subject is required'),
    })
  )
})

const PvaAddSkillAreaModal = (props: any) => {

  const dispatch = useAppDispatch();
  const formikArrayHelpers = useRef<ArrayHelpers | null>(null);
  const paginationRef = useRef({ pageNo: 0, pageSize: 200 });
  const getPvaSubjectListApiCall = (otherProps?: any) => {
    const payload = {
      branchId,
      curriculumId: pvaSkillAreaNameFormik.values.curriculumId,
      ...otherProps,
    }
    dispatch(getPvaSubjectsAct(generateActionPayload("get_pva_subjects", undefined, payload)));
  }
  const getCurriculumApiCall = (otherProps?: any) => {
    const payload1 = { branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", ...otherProps };
    dispatch(getAssignCurriculumListAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
  }

  const {
    showApiLoader,
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    getAssignListCurriculumResp,
    getPvaSubjectResp,
    getPvaSkillAreaByIdResp,
    brchSubjectsResp,
  } = useAppSelector(({ examinationSettings, appData, assignLanguages, globalData, pvaReports, branchAcademics }) => ({
    currentBranchIdResp: appData.currentBranchIdResp,
    currentInstIdResp: appData.currentInstIdResp,
    getAssignListCurriculumResp: assignLanguages.getAssignListCurriculumResp,
    showApiLoader: globalData.showApiLoader,
    getPvaSubjectResp: pvaReports.getPvaSubjectResp,
    getPvaSkillAreaByIdResp: pvaReports.getPvaSkillAreaByIdResp,
    brchSubjectsResp: branchAcademics.brchSubjectsResp,
  }), shallowEqual);

  const pvaSkillAreaNameFormik = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      const payload = values.pvaSkillArea.map((item: any) => {
        const existingSkill = getPvaSkillAreaByIdResp?.skillAreas?.find(
          (skill: any) => skill.name === item.PvaSkillAreaName
        );
        return {
          id: props.id ? existingSkill?.id || "" : null,
          name: item.PvaSkillAreaName,
          description: item.description,
          ...(props.id && { isDeleted: !!item.isDeleted }),
        };
      });
      dispatch(savePvaSkillAreaAct(generateActionPayload("save_update_pva_skill_attributes", { id: values.pvaSubjectId }, payload)));
    },
  });

  useEffect(() => {
    if (props.id && getPvaSkillAreaByIdResp) {
      const { curriculumId, pvaSubjectId, skillAreas } = getPvaSkillAreaByIdResp;

      const mappedSkillAreas = (skillAreas || []).map((item: any) => ({
        uniqueId: generateUniqueNumber(),
        id: item.id,
        PvaSkillAreaName: item.name || "",
        description: item.description || "",
      }));
      pvaSkillAreaNameFormik.setValues({
        curriculumId: curriculumId || "",
        pvaSubjectId: pvaSubjectId || "",
        pvaSkillArea: mappedSkillAreas.length
          ? mappedSkillAreas
          : initialValues.pvaSkillArea,
      });
    }
  }, [props.id, getPvaSkillAreaByIdResp]);

  useEffect(() => {
    getCurriculumApiCall();
    if (props.modalData) {
      const { curriculumId } = props.modalData || {};
      pvaSkillAreaNameFormik.setValues((prev: any) => ({ ...prev, curriculumId }));
    }
  }, []);

  useEffect(() => {
    if (pvaSkillAreaNameFormik.values.curriculumId) {
      getPvaSubjectListApiCall();
    }
  }, [pvaSkillAreaNameFormik.values.curriculumId]);

  useEffect(() => {
    if (
      getAssignListCurriculumResp?.data?.length &&
      !pvaSkillAreaNameFormik.values.curriculumId
    ) {
      const cbseCurriculum = getAssignListCurriculumResp.data.find(
        (item: any) => item.curriculumShortName?.toLowerCase() === "cbse"
      );

      if (cbseCurriculum) {
        pvaSkillAreaNameFormik.setFieldValue("curriculumId", cbseCurriculum.branchCurriculumId);
      }
    }
  }, [getAssignListCurriculumResp]);

  function addNewDepartmentHndlr(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    if (formikArrayHelpers.current) {
      formikArrayHelpers.current.push({
        uniqueId: generateUniqueNumber(),
        PvaSkillAreaName: "",
        description: "",
      });
    }
  }

  function removeDepartmentHndlr(event: React.MouseEvent<HTMLButtonElement>) {
    const rowIndex = event.currentTarget.getAttribute("data-index");
    if (rowIndex !== undefined && rowIndex !== null) {
      pvaSkillAreaNameFormik.setFieldValue(
        `pvaSkillArea[${rowIndex}].isDeleted`,
        true
      );
    }
  }

  function removeGradesHndlr(event: React.MouseEvent<HTMLButtonElement>) {
    const rowIndex = event.currentTarget.getAttribute("data-index");
    if (rowIndex !== undefined || rowIndex !== null) {
      formikArrayHelpers.current?.remove(Number(rowIndex));
    }
  }
  const { data: curriculumTypes } = getAssignListCurriculumResp || {}
  const descriptions =
    brchSubjectsResp?.data?.filter((item: any) => item.subjectType === "COSCHOLASTIC") || [];

  return (
    <>
      <form onSubmit={pvaSkillAreaNameFormik.handleSubmit}>
        <div className="">
          <div className="row px-4 pt-3">
            <div className="col-12 col-md-6">
              <SelectInput
                name="curriculumId"
                labelText="Curriculum"
                value={pvaSkillAreaNameFormik.values.curriculumId}
                onChange={pvaSkillAreaNameFormik.handleChange}
                menuItems={curriculumTypes}
                isDisabled={props?.id}
                valueKey="branchCurriculumId"
                textKey="curriculumName"
                labelClass="required"
                invalid={(pvaSkillAreaNameFormik.touched.curriculumId && pvaSkillAreaNameFormik.errors.curriculumId) ? true : false}
                error={(pvaSkillAreaNameFormik.touched.curriculumId && pvaSkillAreaNameFormik.errors.curriculumId) ? pvaSkillAreaNameFormik.errors.curriculumId : ""}
              />
            </div>
            <div className="col-12 col-md-6">
              <SelectInput
                name="pvaSubjectId"
                labelText="PVA Subject"
                value={pvaSkillAreaNameFormik.values.pvaSubjectId}
                onChange={pvaSkillAreaNameFormik.handleChange}
                menuItems={Array.isArray(getPvaSubjectResp) ? getPvaSubjectResp : []}
                isDisabled={props?.id}
                valueKey="id"
                textKey="pvaSubjectName"
                labelClass="required"
                invalid={(pvaSkillAreaNameFormik.touched.pvaSubjectId && pvaSkillAreaNameFormik.errors.pvaSubjectId) ? true : false}
                error={(pvaSkillAreaNameFormik.touched.pvaSubjectId && pvaSkillAreaNameFormik.errors.pvaSubjectId) ? pvaSkillAreaNameFormik.errors.pvaSubjectId : ""}
              />
            </div>
          </div>
          <div className="row bg-light px-3 py-3 mb-2 mx-0 align-items-center">
            <div className="col-6 d-flex align-items-center">
              <h6 className="mb-0 form-label required">Skill Area Name</h6>
            </div>
            <div className="col-6 d-flex align-items-center justify-content-between">
              <h6 className="mb-0 form-label required">Description</h6>
              <button
                onClick={addNewDepartmentHndlr}
                className="btn-sm btn-icon btn btn-outline-primary"
              >
                <i className="ri-add-line fs-18" />
              </button>
            </div>
          </div>

          <div className="row px-4">
            <div className="col-12 mt-2">
              <FormikProvider value={pvaSkillAreaNameFormik}>
                <FieldArray name="pvaSkillArea">
                  {(arrayHelpers: ArrayHelpers) => {
                    if (!formikArrayHelpers.current) {
                      formikArrayHelpers.current = arrayHelpers;
                    }
                    const activeSkillAreas =
                      pvaSkillAreaNameFormik.values.pvaSkillArea?.filter(
                        (item: any) => !item.isDeleted
                      ) || [];

                    return (
                      <>
                        {activeSkillAreas.length > 0 &&
                          activeSkillAreas.map((pvaSkillArea: any, index: number) => {
                            const inputFieldErrors: any =
                              (pvaSkillAreaNameFormik.errors.pvaSkillArea &&
                                pvaSkillAreaNameFormik.errors.pvaSkillArea[index]) ||
                              {};
                            const inputFieldTouched =
                              (pvaSkillAreaNameFormik.touched.pvaSkillArea &&
                                pvaSkillAreaNameFormik.touched.pvaSkillArea[index]) ||
                              {};

                            return (
                              <div
                                key={pvaSkillArea.uniqueId}
                                className="row g-3 mb-3 align-items-center"
                              >
                                <div className="col-md-6">
                                  <TextInput
                                    name={`pvaSkillArea[${index}].PvaSkillAreaName`}
                                    formgroupClassName="mb-0"
                                    value={pvaSkillArea.PvaSkillAreaName}
                                    onChange={pvaSkillAreaNameFormik.handleChange}
                                    invalid={inputFieldTouched.PvaSkillAreaName && inputFieldErrors.PvaSkillAreaName ? true : false}
                                    error={inputFieldTouched.PvaSkillAreaName && inputFieldErrors.PvaSkillAreaName ? inputFieldErrors.PvaSkillAreaName : ""}
                                  />
                                </div>

                                <div className="col-md-6">
                                  <div className="d-flex align-items-center justify-content-between">
                                    <div
                                      className="flex-grow-1 me-2"
                                      style={{ maxWidth: "calc(100% - 40px)" }}
                                    >
                                      <TextArea
                                        name={`pvaSkillArea[${index}].description`}
                                        formgroupClassName="mb-0"
                                        value={pvaSkillArea.description}
                                        onChange={pvaSkillAreaNameFormik.handleChange}
                                        invalid={inputFieldTouched.description && inputFieldErrors.description ? true : false}
                                        error={inputFieldTouched.description && inputFieldErrors.description ? inputFieldErrors.description : ""}
                                      />
                                    </div>

                                    {(props.id || index !== 0) && (
                                      <button
                                        type="button"
                                        data-index={index}
                                        onClick={(e) => {
                                          if (props.id) {
                                            removeDepartmentHndlr(e);
                                          } else {
                                            removeGradesHndlr(e);
                                          }
                                        }}
                                        className="btn btn-white btn-sm btn-icon btn-rounded btn-hover-danger"
                                      >
                                        <i className="ri-delete-bin-2-fill" />
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
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
            <button type="submit" className="btn btn-success px-4" disabled={showApiLoader}>
              Save
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default PvaAddSkillAreaModal;
