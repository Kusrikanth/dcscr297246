import React, { useRef, useEffect } from "react";
import { FieldArray, useFormik, FormikProvider, ArrayHelpers } from "formik";
import * as Yup from "yup";
import { generateUniqueNumber } from "../../../../utility/commonutility";
import { SelectInput, TextInput } from "../../../../Components/Common";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { getAssignCurriculumListAct } from "../../../../store/assignlanguages/assignlanguagesaction";
import { getBrchSubjectsAct } from "../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { savePvaSubjectsAct, updatePvaSubjectsAct } from "../../../../store/examination/pvaReports/pvaReportsActions";
import { FormGroup, Input } from "reactstrap";

const initialValues = {
  curriculumId: "",
  pvaSubject: [
    {
      uniqueId: generateUniqueNumber(),
      pvaSubjectName: "",
      subjectId: "",
      colorCode: "#364574",
    },
  ]
};
const validationSchema = Yup.object().shape({
  curriculumId: Yup.string().required("Curriculum is required"),
  pvaSubject: Yup.array().of(
    Yup.object().shape({
      pvaSubjectName: Yup.string().nullable().required('Name is required'),
      subjectId: Yup.string().nullable().required('Subject is required'),
    })
  )
})

const PvaAddSubjectModal = (props: any) => {

  const dispatch = useAppDispatch();
  const formikArrayHelpers = useRef<ArrayHelpers | null>(null);
  const paginationRef = useRef({ pageNo: 0, pageSize: 200 });

  const getCurriculumApiCall = (otherProps?: any) => {
    const payload1 = { branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", ...otherProps };
    dispatch(getAssignCurriculumListAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
  }
  function getSubjectApiCall(curriculumId?: number | string) {
    if (!curriculumId) return;
    const payload = {
      branchId,
      curriculumId,
      subjectType: "COSCHOLASTIC",
      ...paginationRef.current,
    };
    dispatch(getBrchSubjectsAct(generateActionPayload("get_brch_subjects", undefined, payload)));
  }

  const {
    showApiLoader,
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    getAssignListCurriculumResp,
    brchSubjectsResp,
    getPvaSubjectByIdResp,
  } = useAppSelector(({ examinationSettings, appData, assignLanguages, globalData, branchAcademics, pvaReports }) => ({
    currentBranchIdResp: appData.currentBranchIdResp,
    currentInstIdResp: appData.currentInstIdResp,
    getAssignListCurriculumResp: assignLanguages.getAssignListCurriculumResp,
    showApiLoader: globalData.showApiLoader,
    brchSubjectsResp: branchAcademics.brchSubjectsResp,
    getPvaSubjectByIdResp: pvaReports.getPvaSubjectByIdResp,
  }), shallowEqual);

  const pvaSubjectNameFormik = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema,
    onSubmit: (values) => {      
      const payload = {
        branchId,
        curriculumId: values.curriculumId,
        subjects: values.pvaSubject.map((item: any) => ({
          pvaSubjectName: item.pvaSubjectName,
          subjectId: item.subjectId,
          color: item.colorCode || "#364574"
        })),
      };

      if (props?.id) {
        const editPayload = {
          pvaSubjectName: values.pvaSubject[0].pvaSubjectName,
          subjectId: values.pvaSubject[0].subjectId,
          color: values.pvaSubject[0].colorCode || "#364574"
        };

        dispatch(updatePvaSubjectsAct(generateActionPayload("update_pva_subjects", { id: props.id }, editPayload)));
      } else {
        dispatch(savePvaSubjectsAct(generateActionPayload("save_pva_subjects", undefined, payload)));
      }
    },
  });


  useEffect(() => {
    getCurriculumApiCall();
    getSubjectApiCall();
    if (props.modalData) {
      const { curriculumId } = props.modalData || {};
      pvaSubjectNameFormik.setValues((prev: any) => ({ ...prev, curriculumId }));
    }
  }, []);

  useEffect(() => {
    const selectedCurriculumId = pvaSubjectNameFormik.values.curriculumId;
    if (selectedCurriculumId) {
      getSubjectApiCall(selectedCurriculumId);
    }
  }, [pvaSubjectNameFormik.values.curriculumId]);

  useEffect(() => {
    if (
      getAssignListCurriculumResp?.data?.length &&
      !pvaSubjectNameFormik.values.curriculumId
    ) {
      const cbseCurriculum = getAssignListCurriculumResp.data.find(
        (item: any) => item.curriculumShortName?.toLowerCase() === "cbse"
      );

      if (cbseCurriculum) {
        pvaSubjectNameFormik.setFieldValue("curriculumId", cbseCurriculum.branchCurriculumId);
      }
    }
  }, [getAssignListCurriculumResp]);

  useEffect(() => {
    if (props.id && getPvaSubjectByIdResp) {
      const matchingSubject = brchSubjectsResp?.data?.find(
        (item: any) => item.subjectName === getPvaSubjectByIdResp.subjectName
      );

      pvaSubjectNameFormik.setValues({
        curriculumId: getPvaSubjectByIdResp.curriculumId || "",
        pvaSubject: [
          {
            uniqueId: generateUniqueNumber(),
            pvaSubjectName: getPvaSubjectByIdResp?.pvaSubjectName || "",
            subjectId: matchingSubject?.id || "",
            colorCode: getPvaSubjectByIdResp?.color || "",
          },
        ],
      });
    }
  }, [props.id, getPvaSubjectByIdResp, brchSubjectsResp]);  

  function addNewDepartmentHndlr(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    if (formikArrayHelpers.current) {
      formikArrayHelpers.current.push({
        uniqueId: generateUniqueNumber(),
        pvaSubjectName: "",
        coscholasticSubject: "",
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
  const coscholasticSubjects =
    brchSubjectsResp?.data?.filter((item: any) => item.subjectType === "COSCHOLASTIC") || [];

  return (
    <>
      <form onSubmit={pvaSubjectNameFormik.handleSubmit}>
        <div className="">
          <div className="row px-4 pt-3">
            <div className="col-8">
              <SelectInput
                name="curriculumId"
                labelText="Curriculum"
                value={pvaSubjectNameFormik.values.curriculumId}
                onChange={pvaSubjectNameFormik.handleChange}
                menuItems={curriculumTypes}
                valueKey="branchCurriculumId"
                textKey="curriculumName"
                isDisabled={props?.id}
                labelClass="required"
                invalid={(pvaSubjectNameFormik.touched.curriculumId && pvaSubjectNameFormik.errors.curriculumId) ? true : false}
                error={(pvaSubjectNameFormik.touched.curriculumId && pvaSubjectNameFormik.errors.curriculumId) ? pvaSubjectNameFormik.errors.curriculumId : ""}
              />
            </div>
          </div>
          <div className="row bg-light px-3 py-3 mb-2 mx-0 align-items-center">
            <div className="col-4 d-flex align-items-center">
              <h6 className="mb-0 form-label required">Coscholastic Name</h6>
            </div>
            <div className="col-4 d-flex align-items-center">
              <h6 className="mb-0 form-label required">Color</h6>
            </div>
            <div className="col-4 d-flex align-items-center justify-content-between">
              <h6 className="mb-0 form-label required">PVA Subject Name</h6>
              {!props?.id && (
                <button
                  onClick={addNewDepartmentHndlr}
                  className="btn-sm btn-icon btn btn-outline-primary"
                >
                  <i className="ri-add-line fs-18" />
                </button>
              )}
            </div>
          </div>
          <div className="row px-4">
            <div className="col-12 mt-2">
              <FormikProvider value={pvaSubjectNameFormik}>
                <FieldArray name="pvaSubject">
                  {(arrayHelpers: ArrayHelpers) => {
                    if (!formikArrayHelpers.current) {
                      formikArrayHelpers.current = arrayHelpers;
                    }
                    return (
                      <>
                        {pvaSubjectNameFormik.values.pvaSubject.length >
                          0 &&
                          pvaSubjectNameFormik.values.pvaSubject.map(
                            (pvaSubject: any, index: any) => {
                              const inputFieldErrors: any = pvaSubjectNameFormik.errors.pvaSubject && pvaSubjectNameFormik.errors.pvaSubject[index] || {};
                              const inputFieldTouched = pvaSubjectNameFormik.touched.pvaSubject && pvaSubjectNameFormik.touched.pvaSubject[index] || {};
                              return (
                                <div key={pvaSubject.uniqueId} className="row g-3 mb-3 align-items-center">
                                  <div className="col-md-4">
                                    <SelectInput
                                      name={`pvaSubject[${index}].subjectId`}
                                      // formgroupClassName="mb-0"
                                      value={pvaSubject.subjectId}
                                      menuItems={coscholasticSubjects}
                                      valueKey="id"
                                      textKey="subjectName"
                                      onChange={pvaSubjectNameFormik.handleChange}
                                      invalid={inputFieldTouched.subjectId && inputFieldErrors.subjectId ? true : false}
                                      error={
                                        inputFieldTouched.subjectId && inputFieldErrors.subjectId
                                          ? inputFieldErrors.subjectId
                                          : ""
                                      }
                                    />
                                  </div>
                                  <div className="col-4">
                                            <FormGroup>
                                              <Input
                                                name={`pvaSubject[${index}].colorCode`}
                                                type="color"
                                                className="form-control form-control-color w-100"
                                                id="colorCode"
                                                value={pvaSubject.colorCode || "#364574"} 
                                                onChange={pvaSubjectNameFormik.handleChange} 
                                              />
                                  
                                            </FormGroup>
                                          </div>
                                  <div className="col-md-4">
                                    <div className="d-flex align-items-center justify-content-between">
                                      <div className="flex-grow-1 me-2" style={{ maxWidth: "calc(100% - 40px)" }}>
                                        <TextInput
                                          name={`pvaSubject[${index}].pvaSubjectName`}
                                          // formgroupClassName="mb-0"
                                          value={pvaSubject.pvaSubjectName}
                                          onChange={pvaSubjectNameFormik.handleChange}
                                          invalid={inputFieldTouched.pvaSubjectName && inputFieldErrors.pvaSubjectName ? true : false}
                                          error={inputFieldTouched.pvaSubjectName && inputFieldErrors.pvaSubjectName ? inputFieldErrors.pvaSubjectName : ""}
                                        />
                                      </div>
                                      {index !== 0 && (
                                        <button
                                          type="button"
                                          data-index={index}
                                          onClick={removeDepartmentHndlr}
                                          className="btn btn-white btn-sm btn-icon btn-rounded btn-hover-danger mb-4"
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

export default PvaAddSubjectModal;
