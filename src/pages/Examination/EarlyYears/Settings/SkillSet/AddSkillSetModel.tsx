import React, { useRef, useEffect } from "react";
import { FieldArray, useFormik, FormikProvider, ArrayHelpers } from "formik";
import { generateUniqueNumber } from "../../../../../utility/commonutility";
import { SelectInput, TextArea, TextInput } from "../../../../../Components/Common";
import { getAssignCurriculumListAct } from "../../../../../store/assignlanguages/assignlanguagesaction";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
import { generateActionPayload } from "../../../../../utility/reduxutility";
import { shallowEqual } from "react-redux";
import { saveSkillEntryAct, updateSkillEntryAct } from "../../../../../store/examination/examinationsettings/examinationsettingsaction";

const initialValues = {
  curriculumId: "",
  skillSets: [
    {
      uniqueId: generateUniqueNumber(),
      overAllGrades: "",
      remarks: "",
      grades: "",
    },
  ],
};

const AddSkillSetModel = (props: any) => {

  const formikArrayHelpers = useRef<ArrayHelpers | null>(null);
  const dispatch = useAppDispatch();

  const SkillSetFormik = useFormik({
    enableReinitialize: true,
    initialValues,
    onSubmit: (values) => {
      const { skillSets } = values
      if (props.id) {
        const payload = {
          overAllGrades: skillSets[0]?.overAllGrades,
          grades: skillSets[0]?.grades,
          remarks: skillSets[0]?.remarks
        }

        dispatch(updateSkillEntryAct(generateActionPayload("update_skill_entry", { id: props.id }, payload)));
      }
      else {

        const tempres = values.skillSets
          ?.map((ele: any) => ({
            overAllGrades: ele.overAllGrades,
            grades: ele.grades,
            remarks: ele.remarks
          }));
        const payload = {
          instituteId,
          branchId,
          curriculumId: values.curriculumId,
          skillSets: tempres
        }


        dispatch(saveSkillEntryAct(generateActionPayload("save_skill_entry", undefined, payload)));
      }

    },
  });

  const {
    getAssignListCurriculumResp,
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    getSkillEntryByIdResp,
    getSkillEntryListResp
  } = useAppSelector(
    ({ appData, assignLanguages, examinationSettings }) => ({
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      getAssignListCurriculumResp: assignLanguages.getAssignListCurriculumResp,
      getSkillEntryByIdResp: examinationSettings.getSkillEntryByIdResp,
      getSkillEntryListResp: examinationSettings.getSkillEntryListResp,

    }),
    shallowEqual
  );

  useEffect(() => {
    if (props.id) {
      getSkillEntryListResp && getSkillEntryListResp?.data?.map((item: any) => {
        if (+item.id === +props.id) {
          SkillSetFormik.setValues((prev: any) => ({
            ...prev, curriculumId: item.branchCurriculumId, skillSets: [
              {
                uniqueId: props.id,
                overAllGrades: item.overAllGrades,
                remarks: item.remarks,
                grades: item.grade
              }
            ]
          }))

        }
      })
    }
    else{
      if (props.modalData) {
        const { curriculumId } = props.modalData;
        SkillSetFormik.setFieldValue('curriculumId', curriculumId);
      }
    }
  }, [props.id, getSkillEntryListResp]);

  useEffect(() => {
    getCurriculumApiCall();
  }, [])

  const getCurriculumApiCall = (otherProps?: any) => {
    const payload1 = { branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", ...otherProps };
    dispatch(getAssignCurriculumListAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
  }

  function addNewDepartmentHndlr(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    if (formikArrayHelpers.current) {
      formikArrayHelpers.current.push({
        uniqueId: generateUniqueNumber(),
      });
    }
  }
  function removeDepartmentHndlr(event: React.MouseEvent<HTMLButtonElement>) {
    const rowIndex = event.currentTarget.getAttribute("data-index");
    if (rowIndex !== undefined || rowIndex !== null) {
      formikArrayHelpers.current?.remove(Number(rowIndex));
    }
  }

  const { data: curriculumTypes } = getAssignListCurriculumResp || {}

  return (
    <>
      <form>
        <div className="row px-4">
          <div className="row g-3">
            <div className="col-12 mt-0 col-md-6">
              <SelectInput
                name="curriculumId"
                labelText="Curriculum"
                labelClass="required"
                value={SkillSetFormik.values.curriculumId}
                onChange={SkillSetFormik.handleChange}
                menuItems={curriculumTypes}
                valueKey="branchCurriculumId"
                textKey="curriculumName"
                formgroupClassName="mb-0"
                isDisabled={props.id ? true : false}
              />
            </div>
          </div>
        </div>
        <div className="py-3 px-2 mx-1">
          <div className="row bg-light px-2 py-2 mb-3">
            <div className="col-12 col-md-3 d-flex align-items-center mb-2">
              <h6 className="mb-0">OverAll Grade</h6>
            </div>
            <div className="col-12 col-md-5 d-flex align-items-center">
              <h6 className="mb-0">Remarks</h6>
            </div>
            <div className="col-12 col-md-3 d-flex align-items-center">
              <h6 className="mb-0">Grade</h6>
            </div>
            {!props.id && <div className="col-12 col-md-1 px-0 d-flex align-items-center">
              <button
                onClick={addNewDepartmentHndlr}
                className="btn-sm btn-icon btn btn-outline-primary"
              >
                <i className="ri-add-line fs-18" />
              </button>
            </div>}
          </div>
          <div className="row px-2">
            <div className="col-12">
              <FormikProvider value={SkillSetFormik}>
                <FieldArray name="skillSets">
                  {(arrayHelpers: ArrayHelpers) => {
                    if (!formikArrayHelpers.current) {
                      formikArrayHelpers.current = arrayHelpers;
                    }
                    return (
                      <>
                        {SkillSetFormik.values.skillSets.length >
                          0 &&
                          SkillSetFormik.values.skillSets.map(
                            (department, index) => {
                              return (
                                <div
                                  key={department.uniqueId}
                                  className="mb-3 row"
                                >
                                  <div className="col-12 col-md-3">
                                    <TextInput
                                      name={`skillSets[${index}].overAllGrades`}
                                      value={department.overAllGrades}
                                      formgroupClassName="mb-0 w-80 me-2"
                                      onChange={
                                        SkillSetFormik.handleChange
                                      }
                                    />
                                  </div>
                                  <div className="col-12 col-md-5">
                                    <TextArea
                                      name={`skillSets[${index}].remarks`}
                                      formgroupClassName="mb-0 w-100 me-2 h-75"
                                      inputClassName="h-100"
                                      value={department.remarks}
                                      onChange={
                                        SkillSetFormik.handleChange
                                      }
                                    />
                                  </div>
                                  <div className="col-12 col-md-3">
                                    <div className="hstack">
                                      <TextInput
                                        name={`skillSets[${index}].grades`}
                                        formgroupClassName="mb-0 w-80 me-2"
                                        value={department.grades}
                                        onChange={
                                          SkillSetFormik.handleChange
                                        }
                                      />

                                    </div>
                                  </div>
                                  <div className="col-12 col-md-1 px-2 d-flex align-items-center justify-content-center">
                                    {index !== 0 && (
                                      <button
                                        data-index={index}
                                        onClick={removeDepartmentHndlr}
                                        className="btn-sm btn-icon btn-rounded btn-hover-danger btn btn-white"
                                      >
                                        <i className="ri-delete-bin-2-fill" />
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
              </FormikProvider>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="d-flex gap-2 w-auto ms-auto mx-4 my-3">
            <button
              type="button"
              className={"btn btn-light"}
              onClick={props.toggle}
            >
              Cancel
            </button>
            <button
              type="button"
              className={`btn btn-success
                `}
              onClick={(event: any) => SkillSetFormik.handleSubmit(event)}
            >
              {props.id ? "Update" : "Submit"}
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default AddSkillSetModel;
