import React, { useEffect } from "react";
import { useFormik } from "formik";
import { SelectInput } from "../../../../Components/Common";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { copyCbseInternalSubjectsGradesAct } from "../../../../store/examination/examinationsettings/examinationsettingsaction";
import { advanceFilterClassListAct, advanceFilterCurriculumListAct, getAssignCurriculumListAct, getAssignLanClassListAct } from "../../../../store/assignlanguages/assignlanguagesaction";
import * as Yup from "yup";

const initialValues = {
  academicYearId: "",
  curriculumId: "",
  classId: "",
  newAcademicYearId: "",
  newCurriculumId: "",
  newClassId: ""
};

const validationSchema = Yup.object().shape({
  academicYearId: Yup.string().required("From Academic Year is required."),
  curriculumId: Yup.string().required("From Curriculum is required."),
  classId: Yup.string().required("From Class is required."),
  newAcademicYearId: Yup.string().required("To Academic Year is required."),
  newCurriculumId: Yup.string().required("To Curriculum is required."),
  newClassId: Yup.string().required("To Class is required."),

});

const CopyInternalSubjectGradesModal = (props: any) => {
  const dispatch = useAppDispatch();

  const {
    currentBranchIdResp: branchId,
    academicYearListResp,
    getAssignLanClassListResp,
    getAssignListCurriculumResp,
    advanceFilterClassListResp,
    advanceFilterCurriculumListResp,
  } = useAppSelector(
    ({ instAcademics, assignLanguages, appData }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      getAssignLanClassListResp: assignLanguages.getAssignLanClassListResp,
      getAssignListCurriculumResp: assignLanguages.getAssignListCurriculumResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      advanceFilterClassListResp: assignLanguages.advanceFilterClassListResp,
      advanceFilterCurriculumListResp: assignLanguages.advanceFilterCurriculumListResp,
    }),
    shallowEqual
  );

  const copyOverAllGradesFormik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema,
    onSubmit: (values) => {
      const payload = {
        branchId,
        newBranchId: branchId,
        ...values
      }
      dispatch(
        copyCbseInternalSubjectsGradesAct(
          generateActionPayload('copy_cbse_internal_subjects_grades_list', undefined, payload)
        )
      )
    },
  });

  useEffect(() => {
    const yearId = academicYearListResp?.data.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId;
    if (yearId) {
      copyOverAllGradesFormik.setFieldValue("academicYearId", +yearId - 1);
      copyOverAllGradesFormik.setFieldValue("newAcademicYearId", yearId);
      getCurriculumApiCall({ academicYearId: +yearId - 1 });
      getToCurriculumApiCall({ academicYearId: yearId });
    }
  }, [])
  
  function getClassApiCall(otherProps?: any) {
    const payload = {
      academicYearId: copyOverAllGradesFormik.values.academicYearId,
      curriculumId: copyOverAllGradesFormik.values.curriculumId,
      branchId,
      pageNo: 0, pageSize: 100, sortBy: "classSequence", orderBy: "asc", ...otherProps,
    };

    dispatch(getAssignLanClassListAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
  }
  function getToClassApiCall(otherProps?: any) {

    const payload = {
      academicYearId: copyOverAllGradesFormik.values.newAcademicYearId,
      curriculumId: copyOverAllGradesFormik.values.newCurriculumId,
      branchId,
      pageNo: 0,
      pageSize: 100,
      sortBy: "classSequence",
      orderBy: "asc",
      ...otherProps
    };
    dispatch(advanceFilterClassListAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
  }

  const getCurriculumApiCall = (otherProps?: any) => {
    const payload1 = { academicYearId: copyOverAllGradesFormik.values.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", ...otherProps };
    dispatch(getAssignCurriculumListAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
  }

  const getToCurriculumApiCall = (otherProps?: any) => {
    const payload1 = {
      academicYearId: copyOverAllGradesFormik.values.newAcademicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", ...otherProps
    };
    dispatch(advanceFilterCurriculumListAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
  }

  const handleSelectChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    copyOverAllGradesFormik.setFieldValue(name, value);

    if (value) {
      if (name === "academicYearId") {
        copyOverAllGradesFormik.setValues((prev) => ({
          ...prev,
          academicYearId: value,
          curriculumId: "",
          classId: "",
        }));
        getCurriculumApiCall({ academicYearId: value });

      } else if (name === "newAcademicYearId") {
        copyOverAllGradesFormik.setValues((prev) => ({
          ...prev,
          newAcademicYearId: value,
          newCurriculumId: "",
          newClassId: "",
        }));
        getToCurriculumApiCall({ academicYearId: value });

      } else if (name === "curriculumId") {
        copyOverAllGradesFormik.setValues((prev) => ({
          ...prev,
          curriculumId: value,
          classId: "",
        }));
        getClassApiCall({ curriculumId: value });

      } else if (name === "newCurriculumId") {
        copyOverAllGradesFormik.setValues((prev) => ({
          ...prev,
          newCurriculumId: value,
          newClassId: "",
        }));

        getToClassApiCall({ curriculumId: value });
      }

    }
  };

  const { data: academicYearList } = academicYearListResp || {};
  const { data: curriculumTypes } = getAssignListCurriculumResp || {}
  const { content: classTypes } = getAssignLanClassListResp || {};

  return (
    <>
      <form>
        <div style={{ padding: "1.25rem",paddingBottom:'0px' }}>
          <div style={{ position: "relative", display: "inline-block", width: "97%", padding: "20px", paddingBottom: '10px', border: "1px solid #CED4DA", borderRadius: "6px", margin: "15px 11px 10px 11px", }}>
            <p className='fs-15' style={{ position: "absolute", top: "-11px", padding: "0px 10px", color: "#495057", backgroundColor: "white", fontWeight: "bold" }}>From</p>

            <div className="row">
              <div className="col-xs-12 col-md-6 mb-3">
                <SelectInput
                  name="academicYearId"
                  labelText="Academic Year"
                  labelClass="required"
                  value={copyOverAllGradesFormik.values.academicYearId}
                  onChange={handleSelectChange}
                  menuItems={academicYearList}
                  valueKey="academicYearId"
                  textKey="academicYearName"
                  formgroupClassName="mb-0" invalid={(copyOverAllGradesFormik.touched.academicYearId && copyOverAllGradesFormik.errors.academicYearId) ? true : false}
                  error={(copyOverAllGradesFormik.touched.academicYearId && copyOverAllGradesFormik.errors.academicYearId) ? copyOverAllGradesFormik.errors.academicYearId : ""}
                />
              </div>
              <div className="col-xs-12 col-md-6">
                <SelectInput
                  name="curriculumId"
                  labelText="Curriculum"
                  labelClass="required"
                  value={copyOverAllGradesFormik.values.curriculumId}
                  onChange={handleSelectChange}
                  menuItems={curriculumTypes}
                  valueKey="branchCurriculumId"
                  textKey="curriculumName"
                  formgroupClassName="mb-0 "
                  invalid={(copyOverAllGradesFormik.touched.curriculumId && copyOverAllGradesFormik.errors.curriculumId) ? true : false}
                  error={(copyOverAllGradesFormik.touched.curriculumId && copyOverAllGradesFormik.errors.curriculumId) ? copyOverAllGradesFormik.errors.curriculumId : ""}
                />
              </div>

              <div className="col-xs-12 col-md-6">
                <SelectInput
                  name="classId"
                  labelText="Class"
                  labelClass="required"
                  value={copyOverAllGradesFormik.values.classId}
                  onChange={handleSelectChange}
                  menuItems={classTypes}
                  valueKey="id"
                  textKey="shortName"
                  invalid={(copyOverAllGradesFormik.touched.classId && copyOverAllGradesFormik.errors.classId) ? true : false}
                  error={(copyOverAllGradesFormik.touched.classId && copyOverAllGradesFormik.errors.classId) ? copyOverAllGradesFormik.errors.classId : ""}
                />
              </div>

            </div>
          </div>
        </div>
        <div style={{ padding: "1.25rem" }}>
          <div style={{ position: "relative", display: "inline-block", width: "97%", padding: "20px", paddingBottom: '10px', border: "1px solid #CED4DA", borderRadius: "6px", margin: "15px 11px 10px 11px", }}>
            <p className='fs-15' style={{ position: "absolute", top: "-11px", padding: "0px 10px", color: "#495057", backgroundColor: "white", fontWeight: "bold" }}>To</p>
            <div className="row">
              <div className="col-xs-12 col-md-6 mb-3">
                <SelectInput
                  name="newAcademicYearId"
                  labelText="Academic Year"
                  labelClass="required"
                  value={copyOverAllGradesFormik.values.newAcademicYearId}
                  onChange={handleSelectChange}
                  menuItems={academicYearList}
                  valueKey="academicYearId"
                  textKey="academicYearName"
                  formgroupClassName="mb-0"
                  invalid={(copyOverAllGradesFormik.touched.newAcademicYearId && copyOverAllGradesFormik.errors.newAcademicYearId) ? true : false}
                  error={(copyOverAllGradesFormik.touched.newAcademicYearId && copyOverAllGradesFormik.errors.newAcademicYearId) ? copyOverAllGradesFormik.errors.newAcademicYearId : ""}
                />
              </div>
              <div className="col-xs-12 col-md-6">
                <SelectInput
                  name="newCurriculumId"
                  labelText="Curriculum"
                  labelClass="required"
                  value={copyOverAllGradesFormik.values.newCurriculumId}
                  onChange={handleSelectChange}
                  menuItems={advanceFilterCurriculumListResp?.data}
                  valueKey="branchCurriculumId"
                  textKey="curriculumName"
                  formgroupClassName="mb-0"
                  invalid={(copyOverAllGradesFormik.touched.newCurriculumId && copyOverAllGradesFormik.errors.newCurriculumId) ? true : false}
                  error={(copyOverAllGradesFormik.touched.newCurriculumId && copyOverAllGradesFormik.errors.newCurriculumId) ? copyOverAllGradesFormik.errors.newCurriculumId : ""}
                />
              </div>
              <div className="col-xs-12 col-md-6">
                <SelectInput
                  name="newClassId"
                  labelText="Class"
                  labelClass="required"
                  value={copyOverAllGradesFormik.values.newClassId}
                  onChange={handleSelectChange}
                  menuItems={advanceFilterClassListResp?.content}
                  valueKey="id"
                  textKey="shortName"
                  invalid={(copyOverAllGradesFormik.touched.newClassId && copyOverAllGradesFormik.errors.newClassId) ? true : false}
                  error={(copyOverAllGradesFormik.touched.newClassId && copyOverAllGradesFormik.errors.newClassId) ? copyOverAllGradesFormik.errors.newClassId : ""}
                />
              </div>
            </div>
          </div>
          <div className="hstack gap-2 justify-content-end mt-4 mb-1">
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
              onClick={(event: any) =>
                copyOverAllGradesFormik.handleSubmit(event)
              }
            >
              Submit
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default CopyInternalSubjectGradesModal;
