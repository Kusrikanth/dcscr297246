import React, { useRef, useEffect } from "react";
import { FieldArray, useFormik, FormikProvider, ArrayHelpers } from "formik";
import * as Yup from "yup";
import { generateUniqueNumber } from "../../../../utility/commonutility";
import { SelectInput, TextInput } from "../../../../Components/Common";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { getExaminationTermListAct, saveIgseTermNameAct, updateIgseTermNameAct } from "../../../../store/examination/examinationsettings/examinationsettingsaction";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { getAssignCurriculumListAct } from "../../../../store/assignlanguages/assignlanguagesaction";

const initialValues = {
  branchId: "",
  curriculumId: "",
  term: [
    {
      uniqueId: generateUniqueNumber(),
      termName: "",
      termShortName: "",
      instituteTermId: "",
    },
  ]
};
const validationSchema = Yup.object().shape({
  term: Yup.array().of(
    Yup.object().shape({
      termName: Yup.string().nullable().required('Name is required'),
      termShortName: Yup.string().nullable().required('Name is required'),
      instituteTermId: Yup.string().nullable().required('Term is required'),
    })
  )
})

const TermNameModel = (props: any) => {
  const isEy = location.pathname.includes("/early-years-settings/term-name");

  const dispatch = useAppDispatch();
  const formikArrayHelpers = useRef<ArrayHelpers | null>(null);

  const examinationTermList = () => {
    let payload = {
      instituteId,
      termTypeName: "EXAMINATION TERM",
    };

    dispatch(getExaminationTermListAct(generateActionPayload("get_examination_term_list", payload)));
  };

  const getCurriculumApiCall = (otherProps?: any) => {
    const payload1 = { branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", ...otherProps };
    dispatch(getAssignCurriculumListAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
  }

  const {
    showApiLoader,
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    branchListResp,
    getIgseTermNameByIdResp,
    getAssignListCurriculumResp,
    getExaminationTermRequestListResp,
  } = useAppSelector(({ examinationSettings, branch, appData, assignLanguages, globalData }) => ({
    currentBranchIdResp: appData.currentBranchIdResp,
    currentInstIdResp: appData.currentInstIdResp,
    branchListResp: branch.branchListResp,
    getIgseTermNameByIdResp: examinationSettings.getIgseTermNameByIdResp,
    getExaminationTermRequestListResp: examinationSettings.getExaminationTermRequestListResp,
    getAssignListCurriculumResp: assignLanguages.getAssignListCurriculumResp,
    showApiLoader: globalData.showApiLoader,
  }), shallowEqual);

  const termNameFormik = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      if (props.id) {
        const payload = {
          termName: values.term[0]?.termName || "",
          termShortName: values.term[0]?.termShortName || "",
          instituteTermId: values.term[0]?.instituteTermId || null,
          branchId: termNameFormik.values.branchId,
          curriculumId: termNameFormik.values.curriculumId,
        };
        dispatch(
          updateIgseTermNameAct(
            generateActionPayload("update_igse_term_name_by_id", { termId: props.id }, payload)
          )
        );
      } else {
        const termDetailsDTOS = values.term
          .filter((ele) => ele.termName && ele.termShortName && ele.instituteTermId)
          .map((ele) => ({
            termName: ele.termName,
            termShortName: ele.termShortName,
            instituteTermId: ele.instituteTermId,
          }));
        const payload = {
          branchId: termNameFormik.values.branchId,
          curriculumId: termNameFormik.values.curriculumId,
          termDetailsDTOS,
        };
        dispatch(
          saveIgseTermNameAct(
            generateActionPayload("save_igse_term_name", undefined, payload)
          )
        );
      }
    },
  });

  useEffect(() => {
    examinationTermList();
  }, []);

  useEffect(() => {
    if (props.modalData) {
      const { curriculumId } = props.modalData || {};
      termNameFormik.setValues((prev: any) => ({ ...prev, curriculumId }));
      // getCurriculumApiCall()
    }
  }, [])

  useEffect(() => {
    if (!branchListResp?.data?.length) return;

    const firstBranchId = branchListResp.data[0].branchId;

    termNameFormik.setFieldValue("branchId", firstBranchId);
  }, [branchListResp]);

  useEffect(() => {
    if (props.id) return;

    if (!termNameFormik.values.branchId) return;

    getCurriculumApiCall({
      branchId: termNameFormik.values.branchId,
    });
  }, [termNameFormik.values.branchId, props.id]);

  useEffect(() => {
    if (props.id && getIgseTermNameByIdResp) {
      termNameFormik.setValues({
        curriculumId: getIgseTermNameByIdResp.curriculumId || "",
        branchId: getIgseTermNameByIdResp.branchId || "",
        term: [{
          uniqueId: generateUniqueNumber(),
          termName: getIgseTermNameByIdResp.termName || "",
          termShortName: getIgseTermNameByIdResp.termShortName || "",
          instituteTermId: getIgseTermNameByIdResp.instituteTermId || null,
        }]
      });
    }
  }, [props.id, getIgseTermNameByIdResp]);

  function addNewDepartmentHndlr(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    if (formikArrayHelpers.current) {
      formikArrayHelpers.current.push({
        uniqueId: generateUniqueNumber(),
        termName: "",
        termShortName: "",
        instituteTermId: "",
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
      <form onSubmit={termNameFormik.handleSubmit}>
        <div className="">
          <div className="row px-4 pt-3">
            <div className="col-12 col-md-6">
              <SelectInput
                name="branchId"
                valueKey="branchId"
                textKey="branchName"
                value={termNameFormik.values.branchId}
                menuItems={branchListResp?.data}
                onChange={termNameFormik.handleChange}
                labelText="Branch Name"
                labelClass="required"
                isDisabled={props?.id}
                invalid={(termNameFormik.touched.curriculumId && termNameFormik.errors.curriculumId) ? true : false}
                error={(termNameFormik.touched.curriculumId && termNameFormik.errors.curriculumId) ? termNameFormik.errors.curriculumId : ""}
              />
            </div>
            <div className="col-12 col-md-6">
              <SelectInput
                name="curriculumId"
                labelText="Curriculum"
                value={termNameFormik.values.curriculumId}
                onChange={termNameFormik.handleChange}
                menuItems={curriculumTypes}
                isDisabled={props?.id}
                valueKey="branchCurriculumId"
                textKey="curriculumName"
                labelClass="required"
                invalid={(termNameFormik.touched.curriculumId && termNameFormik.errors.curriculumId) ? true : false}
                error={(termNameFormik.touched.curriculumId && termNameFormik.errors.curriculumId) ? termNameFormik.errors.curriculumId : ""}
              />
            </div>
          </div>
          <div className="row bg-light px-3 py-3 mb-2 mx-0">
            <div className="col-4 d-flex align-items-center">
              <h6 className="mb-0 form-label required">Term Name</h6>
            </div>
            <div className="col-3 d-flex align-items-center">
              <h6 className="mb-0 form-label required">Short Name</h6>
            </div>
            <div className="col-5 d-grid mt-0">
              <div className="hstack">
                <h6 className="mb-0 me-3 form-label required">Institute Term</h6>
                {!props?.id && <button
                  onClick={addNewDepartmentHndlr}
                  className="btn-sm ms-3 btn-icon btn btn-outline-primary"
                >
                  <i className="ri-add-line fs-18" />
                </button>}
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
                        {termNameFormik.values.term.length >
                          0 &&
                          termNameFormik.values.term.map(
                            (term: any, index: any) => {
                              const inputFieldErrors: any = termNameFormik.errors.term && termNameFormik.errors.term[index] || {};
                              const inputFieldTouched = termNameFormik.touched.term && termNameFormik.touched.term[index] || {};
                              return (
                                <div
                                  key={term.uniqueId}
                                  className="row g-3 mb-3"
                                >
                                  <div className="col-4">
                                    <TextInput
                                      name={`term[${index}].termName`}
                                      formgroupClassName="mb-0"
                                      value={term.termName}
                                      onChange={termNameFormik.handleChange}
                                      invalid={(inputFieldTouched.termName && inputFieldErrors.termName) ? true : false}
                                      error={(inputFieldTouched.termName && inputFieldErrors.termName) ? inputFieldErrors.termName : ""}
                                    />
                                  </div>
                                  <div className="col-3">
                                    <TextInput
                                      name={`term[${index}].termShortName`}
                                      formgroupClassName="mb-0"
                                      value={term.termShortName}
                                      onChange={termNameFormik.handleChange}
                                      invalid={(inputFieldTouched.termShortName && inputFieldErrors.termShortName) ? true : false}
                                      error={(inputFieldTouched.termShortName && inputFieldErrors.termShortName) ? inputFieldErrors.termShortName : ""}
                                    />
                                  </div>
                                  <div className="col-5 d-flex">
                                    <div className="hstack">
                                      <SelectInput
                                        name={`term[${index}].instituteTermId`}
                                        formgroupClassName="mb-0 me-4"
                                        value={term.instituteTermId}
                                        menuItems={(Array.isArray(getExaminationTermRequestListResp) && getExaminationTermRequestListResp) || []}
                                        valueKey="termId"
                                        textKey="termName"
                                        onChange={termNameFormik.handleChange}
                                        invalid={(inputFieldTouched.instituteTermId && inputFieldErrors.instituteTermId) ? true : false}
                                        error={(inputFieldTouched.instituteTermId && inputFieldErrors.instituteTermId) ? inputFieldErrors.instituteTermId : ""}
                                      />
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
            <button type="submit" className="btn btn-success px-4" disabled={showApiLoader}>
              Save
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default TermNameModel;
