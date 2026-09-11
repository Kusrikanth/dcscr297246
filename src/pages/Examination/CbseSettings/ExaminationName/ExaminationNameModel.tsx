import React, { useRef, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { DateInput, MultiSelectCheckbox, SelectInput, TextInput } from "../../../../Components/Common";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { editCbseExaminationListAct, saveCbseExaminationListAct } from "../../../../store/examination/examinationsettings/examinationsettingsaction";
import { getAssignCurriculumListAct, getAssignLanClassListAct } from "../../../../store/assignlanguages/assignlanguagesaction";
import { useLocation } from "react-router-dom";

const initialValues = {
  shortName: "",
  examinationName: "",
  academicYearId: "",
  curriculumId: "",
  // examinationOrder: "",
  classId: "",
  attendanceFromDate: "",
  attendanceToDate: "",
  examCategoryId : "",
  termId : ""
};

export const getValidationSchema = (isTermWiseExamPath: boolean) => {
  return Yup.object().shape({
    shortName: Yup.string().required("Short Name is required.").nullable(),
    examinationName: Yup.string().required("Examination Name is required.").nullable(),
    curriculumId: Yup.string().required("Curriculum is required.").nullable(),
    classId: Yup.array().min(1, "Class is required.").required("Class is required.").nullable(),
    ...(isTermWiseExamPath && {
      termId: Yup.string().required("Term is required.").nullable(),
    }),
  });
};

const ExaminationNameModel = (props: any) => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const isTermWiseExamPath = location.pathname.includes('/igcse-settings/term-wise-examination');
  const validationSchema = getValidationSchema(isTermWiseExamPath);
  
  const { academicYearListResp,
    currentBranchIdResp: branchId,
    branchClassResp,
    getAssignLanClassListResp,
    getAssignListCurriculumResp,
    brchCurriculumResp,
    getExamCategoryResp,
    getIgseTermNameListResp,
    getCbseExaminationListByIdResp,
    currentInstIdResp: showApiLoader } = useAppSelector(
      ({ instAcademics, branchAcademics, assignLanguages, appData, examinationSettings, globalData }) => ({
        academicYearListResp: instAcademics.academicYearListResp,
        branchClassResp: branchAcademics.branchClassResp,
        brchCurriculumResp: branchAcademics.brchCurriculumResp,
        getAssignLanClassListResp: assignLanguages.getAssignLanClassListResp,
        getAssignListCurriculumResp: assignLanguages.getAssignListCurriculumResp,
        currentBranchIdResp: appData.currentBranchIdResp,
        currentInstIdResp: appData.currentInstIdResp,
        getCbseExaminationListByIdResp: examinationSettings.getCbseExaminationListByIdResp,
        getExamCategoryResp: examinationSettings.getExamCategoryResp,
        getIgseTermNameListResp: examinationSettings.getIgseTermNameListResp,
        showApiLoader: globalData.showApiLoader,
      }),
      shallowEqual
    );

  const changeExaminationNameFormik = useFormik({

    enableReinitialize: true,
    initialValues,
    validationSchema,
    onSubmit: (values) => {

      const classIds = Array.isArray(values.classId)
        ? values.classId.map((classObj: any) => classObj.id)
        : values.classId.split(',').map((id: string) => parseInt(id.trim()));

      const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const year = date.getFullYear();
        return `${month}-${day}-${year}`;
      };

      const payload = {
        branchId,
        academicYearId: values.academicYearId,
        curriculumId: values.curriculumId,
        shortName: values.shortName,
        termId: values.termId,
        examinationName: values.examinationName,
        examCategoryId: values.examCategoryId,
        // examinationOrder: values.examinationOrder,
        attendanceFromDate: formatDate(values.attendanceFromDate),
        attendanceToDate: formatDate(values.attendanceToDate),
        classIds
      };
      const editpayload = {
        examinationName: values.examinationName,
        shortName: values.shortName,
        termId: values.termId,
        examCategoryId: values.examCategoryId,
        // examinationOrder: values.examinationOrder,
        attendanceFromDate: formatDate(values.attendanceFromDate),
        attendanceToDate: formatDate(values.attendanceToDate),
        classIds: classIds
      };
      if (props?.id) {
        dispatch(editCbseExaminationListAct(generateActionPayload("edit_cbse_examination_list", { id: props.id }, editpayload)));
      } else {
        dispatch(saveCbseExaminationListAct(generateActionPayload("save_cbse_examination", undefined, payload)));
      }
    },
  });

  const addExaminationDetailsRef = useRef({
    prevGetCbseExaminationListByIdResp: getCbseExaminationListByIdResp,
  })

  useEffect(() => {

    if (props.modalData) {
      const { academicYearId, curriculumId, classId, sectionId, date } = props.modalData || {};
      changeExaminationNameFormik.setValues((prev: any) => ({ ...prev, academicYearId, curriculumId, classId, sectionId, date }));

      if (academicYearId) {
        getCurriculumApiCall({ academicYearId })
      }
      if (curriculumId) {
        const payload = { branchId: branchId, curriculumId, academicYearId, classFilter: "HIGHER", sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100 };
        dispatch(getAssignLanClassListAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
      }
    }
    return () => {
      changeExaminationNameFormik.resetForm();
    }
  }, [])


  useEffect(() => {
    const { prevGetCbseExaminationListByIdResp } = addExaminationDetailsRef.current || {};
    if (getCbseExaminationListByIdResp && prevGetCbseExaminationListByIdResp !== getCbseExaminationListByIdResp) {
      if (props?.id) {
        const {
          examinationName,
          examinationShortName,
          examinationOrder,
          academicYearId,
          curriculumId,
          attendanceFromDate,
          attendanceToDate,
          examCategoryId,
          branchClassDtos,
          termId,
        } = getCbseExaminationListByIdResp || {};

        const selectedClasses = branchClassDtos?.map((classDto: { branchClassId: any; classShortName: any; }) => ({
          id: classDto.branchClassId,
          shortName: classDto.classShortName,
        })) || [];

        changeExaminationNameFormik.setValues((prev) => ({
          ...prev,
          examinationName: examinationName,
          shortName: examinationShortName,
          examinationOrder: examinationOrder,
          academicYearId: academicYearId,
          curriculumId: curriculumId,
          examCategoryId: examCategoryId,
          attendanceFromDate: attendanceFromDate,
          attendanceToDate: attendanceToDate,
          termId: termId,
          classId: selectedClasses,
        }));
        if (curriculumId) {
          getClassApiCall(curriculumId);
        }
      }
    }

    addExaminationDetailsRef.current.prevGetCbseExaminationListByIdResp = getCbseExaminationListByIdResp;
  }, [getCbseExaminationListByIdResp]);

  function renderOptionsTerms(item: any) {
    return item?.className || item?.shortName;
  }

  function renderValueTerms(selectedItems: any) {
    if (Array.isArray(selectedItems)) {
      return (<div className="text-truncate">
        {
          selectedItems.map((item, index) => {
            return item?.shortName + (index !== (selectedItems.length - 1) ? ', ' : '')
          })
        }
      </div>)
    }
  }
  useEffect(() => {
    if (changeExaminationNameFormik.values.academicYearId && changeExaminationNameFormik.values.curriculumId) {
      getClassApiCall(changeExaminationNameFormik.values.curriculumId);
    }
  }, [changeExaminationNameFormik.values.academicYearId, changeExaminationNameFormik.values.curriculumId]);

  function getClassApiCall(selectedCurriculumId: string) {
    const payload = {
      academicYearId: changeExaminationNameFormik.values.academicYearId,
      curriculumId: selectedCurriculumId,
      branchId,
      pageNo: 0, pageSize: 100,classFilter: "HIGHER", sortBy: "classSequence", orderBy: "asc",
    };

    dispatch(getAssignLanClassListAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
  }

  function onSelectOptionHandler(selectedOptions: any, config?: any) {
    const { name } = config;
    if (Array.isArray(selectedOptions) && selectedOptions.length > 0) {
      changeExaminationNameFormik.setFieldValue(name, selectedOptions);
    } else {
      changeExaminationNameFormik.setFieldValue(name, null);
    }
  }

  const getCurriculumApiCall = (otherProps?: any) => {
    const payload1 = { academicYearId: changeExaminationNameFormik.values.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", ...otherProps };
    dispatch(getAssignCurriculumListAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));

  }
  const handleSelectChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    changeExaminationNameFormik.setFieldValue(name, value);

    if (value) {
      if (name === "academicYearId") {
        getCurriculumApiCall({ academicYearId: value });

        changeExaminationNameFormik.setValues((prev) => ({
          ...prev,
          academicYearId: value,
          classId: "",
          examinationId: "",
        }));
      } else if (name === "curriculumId") {
        changeExaminationNameFormik.setFieldValue("classId", "");
        changeExaminationNameFormik.setFieldValue("sectionId", "");
      }
    }
  }


  const { data: curriculumTypes } = getAssignListCurriculumResp || {}
  const { content: classTypes } = getAssignLanClassListResp || {};

  return (
    <>
      <form>
        <div style={{ padding: "1.25rem" }}>
          <div className="row">
            <div className="col-xs-12 col-md-6">
              <SelectInput
                name="academicYearId"
                labelText="Academic Year"
                labelClass="required"
                value={changeExaminationNameFormik.values.academicYearId}
                onChange={handleSelectChange}
                menuItems={academicYearListResp?.data}
                valueKey="academicYearId"
                textKey="academicYearName"
                isDisabled={props?.id}
                invalid={(changeExaminationNameFormik.touched.academicYearId && changeExaminationNameFormik.errors.academicYearId) ? true : false}
                error={(changeExaminationNameFormik.touched.academicYearId && changeExaminationNameFormik.errors.academicYearId) ? changeExaminationNameFormik.errors.academicYearId : ""}
              />
            </div>
            <div className="col-xs-12 col-md-6">
              <SelectInput
                name="curriculumId"
                labelText="Curriculum"
                value={changeExaminationNameFormik.values.curriculumId}
                onChange={handleSelectChange}
                menuItems={curriculumTypes}
                isDisabled={true}
                valueKey="branchCurriculumId"
                textKey="curriculumName"
                labelClass="required"
                invalid={(changeExaminationNameFormik.touched.curriculumId && changeExaminationNameFormik.errors.curriculumId) ? true : false}
                error={(changeExaminationNameFormik.touched.curriculumId && changeExaminationNameFormik.errors.curriculumId) ? changeExaminationNameFormik.errors.curriculumId : ""}

              />
            </div>
            {isTermWiseExamPath ? (
              <>
                <div className="col-md-6 col-12">
                  <TextInput
                    name="examinationName"
                    labelText="Examination Name"
                    labelClass="required"
                    value={changeExaminationNameFormik.values.examinationName}
                    onChange={changeExaminationNameFormik.handleChange}
                    invalid={!!(changeExaminationNameFormik.touched.examinationName && changeExaminationNameFormik.errors.examinationName)}
                    error={changeExaminationNameFormik.touched.examinationName && changeExaminationNameFormik.errors.examinationName
                      ? changeExaminationNameFormik.errors.examinationName
                      : ""}
                  />
                </div>
              </>
            ) : (
            <div className="col-12">
              <TextInput
                name="examinationName"
                labelText="Examination Name"
                labelClass="required"
                value={changeExaminationNameFormik.values.examinationName}
                onChange={changeExaminationNameFormik.handleChange}
                invalid={(changeExaminationNameFormik.touched.examinationName && changeExaminationNameFormik.errors.examinationName) ? true : false}
                error={(changeExaminationNameFormik.touched.examinationName && changeExaminationNameFormik.errors.examinationName) ? changeExaminationNameFormik.errors.examinationName : ""}
              />
            </div>
            )}
            <div className="col-md-6 col-12">
              <TextInput
                name="shortName"
                labelText="Short Name"
                labelClass="required"
                value={changeExaminationNameFormik.values.shortName}
                onChange={changeExaminationNameFormik.handleChange}
                invalid={(changeExaminationNameFormik.touched.shortName && changeExaminationNameFormik.errors.shortName) ? true : false}
                error={(changeExaminationNameFormik.touched.shortName && changeExaminationNameFormik.errors.shortName) ? changeExaminationNameFormik.errors.shortName : ""}
              />
            </div>
            {/* <div className="col-12">
              <SelectInput
                name="examinationOrder"
                labelText="Examination Order"
                labelClass="required"
                value={changeExaminationNameFormik.values.examinationOrder}
                onChange={changeExaminationNameFormik.handleChange}
                menuItems={examinationOrder}
                valueKey="examinationOrder"
                textKey="examinationOrder"
                invalid={(changeExaminationNameFormik.touched.examinationOrder && changeExaminationNameFormik.errors.examinationOrder) ? true : false}
                error={(changeExaminationNameFormik.touched.examinationOrder && changeExaminationNameFormik.errors.examinationOrder) ? changeExaminationNameFormik.errors.examinationOrder : ""}
              />
            </div> */}
            <div className="col-md-6 col-12">
              <SelectInput
                name="examCategoryId"
                value={changeExaminationNameFormik.values.examCategoryId}
                onChange={changeExaminationNameFormik.handleChange}
                menuItems={getExamCategoryResp}
                valueKey="id"
                textKey="displayName"
                labelText='Exam Category'
              />
            </div>
            {isTermWiseExamPath && (
              <>
                <div className="col-md-6 col-12">
                  <SelectInput
                    name="termId"
                    labelText="Term Name"
                    labelClass="required"
                    menuItems={Array.isArray(getIgseTermNameListResp?.data) ? getIgseTermNameListResp?.data : []}
                    valueKey="termId"
                    textKey="termName"
                    value={changeExaminationNameFormik.values.termId}
                    onChange={changeExaminationNameFormik.handleChange}
                    invalid={!!(changeExaminationNameFormik.touched.termId && changeExaminationNameFormik.errors.termId)}
                    error={changeExaminationNameFormik.touched.termId && changeExaminationNameFormik.errors.termId
                      ? changeExaminationNameFormik.errors.termId
                      : ""}
                  />
                </div>
              </>
            )}
            <div className="col-12 mb-3">
              <MultiSelectCheckbox
                name="classId"
                idKey="id"
                labelText="Classes"
                value={changeExaminationNameFormik.values.classId}
                onChange={onSelectOptionHandler}
                options={getAssignLanClassListResp?.content || []}
                searchKey="className"
                isDisabled={props?.id}
                labelClass="required"
                renderValue={renderValueTerms}
                renderOptions={renderOptionsTerms}
                invalid={
                  changeExaminationNameFormik.touched.classId &&
                  !!changeExaminationNameFormik.errors.classId
                }
                error={
                  changeExaminationNameFormik.touched.classId &&
                    changeExaminationNameFormik.errors.classId
                    ? changeExaminationNameFormik.errors.classId
                    : ""
                }
              />

            </div>
            <div className="col-6">
              <DateInput
                name="attendanceFromDate"
                value={changeExaminationNameFormik.values.attendanceFromDate}
                onChange={changeExaminationNameFormik.handleChange}
                // inputClassName="bg-light"
                formgroupClassName="mb-0"
                labelText="Attendance Start Date"
                // minDate={new Date().toISOString().split("T")[0]}
              />
            </div>
            <div className="col-6">
              <DateInput
                name="attendanceToDate"
                value={changeExaminationNameFormik.values.attendanceToDate}
                onChange={changeExaminationNameFormik.handleChange}
                // inputClassName="bg-light"
                formgroupClassName="mb-0"
                labelText="Attendance End Date"
                // minDate={new Date().toISOString().split("T")[0]}
              />
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
                changeExaminationNameFormik.handleSubmit(event)
              }
            >
              Save
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default ExaminationNameModel;
