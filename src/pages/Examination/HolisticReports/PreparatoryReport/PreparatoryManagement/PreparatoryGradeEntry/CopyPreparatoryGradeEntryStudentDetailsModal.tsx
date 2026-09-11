import React, { useEffect, useMemo, useRef, useState, } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "../../../../../../hooks/storehook";
import { generateActionPayload } from "../../../../../../utility/reduxutility";
import { shallowEqual } from "react-redux";
import { MultiSelectCheckbox, RadioInputContainer, SelectInput, TextArea } from "../../../../../../Components/Common";
import { copyPreparatoryGradeEntryStudentDetailsAct, getClassesByStageAct, getCopyClassesByStageAct, getCopyIgseTermNameListAct, getIgseTermNameListAct } from "../../../../../../store/examination/examinationsettings/examinationsettingsaction";
import { generateValidateStudentsColumns, renderOptionsStudent, renderValueStudent } from "./helper";
import { getStudentByFilterAct } from "../../../../../../store/directory/studentmanagement/studentmanagementactions";
import { resetWhatsAppNotificationValidateStudentsAct, whatsAppNotifcationValidateStudentsAct } from "../../../../../../store/communication/communicationactions";
import TableContainer from "../../../../../../Components/Common/TableContainer";
import { default as RejectSvg } from "../../../../../../assets/imagesdps/academics/confirmation-icon.svg?react";
import Button from "../../../../../../Components/Common/Button";

const initialValues = {
  academicYearId: "",
  classId: "",
  newAcademicYearId: "",
  newClassId: "",
  fromTermId: "",
  toTermId: "",
  studentType: "all-student",
  studentIds: [],
  manualStudentIds: "",
};

const validationSchema = Yup.object().shape({
  academicYearId: Yup.string().required("From Academic Year is required."),
  classId: Yup.string().required("From Class is required."),
  newAcademicYearId: Yup.string().required("To Academic Year is required."),
  newClassId: Yup.string().required("To Class is required."),
  fromTermId: Yup.string().required("From Term is required."),
  toTermId: Yup.string().required("To Term is required."),
  studentIds: Yup.array().when("studentType", {
    is: "selected-student",
    then: (schema) =>
      schema.min(1, "Please select at least one student."),
    otherwise: (schema) => schema.notRequired(),
  }),
  manualStudentIds: Yup.string().when("studentType", {
    is: "manual-entry",
    then: (schema) =>
      schema
        .trim()
        .required("Please enter student IDs.")
        .test(
          "valid-ids",
          "Enter valid comma separated numeric IDs.",
          (value) =>
            !!value &&
            value
              .split(",")
              .every((id) => !isNaN(Number(id.trim())))
        ),
    otherwise: (schema) => schema.notRequired(),
  }),
});

const CopyPreparatoryGradeEntryStudentDetailsModal = (props: any) => {
  const dispatch = useAppDispatch();
  const [validatedStudents, setValidatedStudents] = useState<any[]>([]);
  const [isValidated, setIsValidated] = useState(false);

  const {
    currentInstIdResp: instituteId,
    currentBranchIdResp: branchId,
    academicYearListResp,
    getClassesByStageResp,
    getIgseTermNameListResp,
    getCopyClassesByStageResp,
    getCopyIgseTermNameListResp,
    getStudentsByFilterResp,
    whatsAppNotificationValidateStudentsResp,
  } = useAppSelector(
    ({ instAcademics, appData, examinationSettings, directoryStudent, communication }) => ({
      currentInstIdResp: appData.currentInstIdResp,
      academicYearListResp: instAcademics.academicYearListResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      getClassesByStageResp: examinationSettings.getClassesByStageResp,
      getIgseTermNameListResp: examinationSettings.getIgseTermNameListResp,
      getCopyClassesByStageResp: examinationSettings.getCopyClassesByStageResp,
      getCopyIgseTermNameListResp: examinationSettings.getCopyIgseTermNameListResp,
      getStudentsByFilterResp: directoryStudent.getStudentsByFilterResp,
      whatsAppNotificationValidateStudentsResp: communication.whatsAppNotificationValidateStudentsResp,
    }),
    shallowEqual
  );

  const copyPreparatoryGradeEntryStudentFormik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema,
    onSubmit: (values) => {
      const fromClass = getClassesByStageResp?.find(
        (c: any) => +c.classId === +values.classId
      );

      const toClass = getCopyClassesByStageResp?.find(
        (c: any) => +c.classId === +values.newClassId
      );
      let finalStudentIds: number[] = [];
      if (values.studentType === "all-student") {
        finalStudentIds = [];
      }

      if (values.studentType === "selected-student") {
        finalStudentIds =
          values.studentIds?.map((s: any) => Number(s.id)) || [];
      }

      if (values.studentType === "manual-entry") {
        finalStudentIds =
          validatedStudents?.map((student: any) =>
            Number(student.studentId ?? student.id)
          ) || [];
      }
      const payload: any = {
        instituteId,
        branchId,

        fromAcademicYearId: values.academicYearId,
        toAcademicYearId: values.newAcademicYearId,

        fromCurriculumId: fromClass?.curriculumId,
        toCurriculumId: toClass?.curriculumId,

        fromClassId: values.classId,
        toClassId: values.newClassId,

        fromTermId: values.fromTermId,
        toTermId: values.toTermId,
      };

      if (values.studentType !== "all-student") {
        payload.studentIds = finalStudentIds;
      }

      dispatch(
        copyPreparatoryGradeEntryStudentDetailsAct(
          generateActionPayload(
            "copy_preparatory_grade_entry_student_details",
            undefined,
            payload
          )
        )
      );
    },
  });

  const getCurriculumClassApiCall = () => {
    const payload = {
      branchId,
      academicYearId: copyPreparatoryGradeEntryStudentFormik.values.academicYearId,
      stageId: 2,
    };

    dispatch(
      getClassesByStageAct(
        generateActionPayload("get_classes_by_stage", undefined, payload)
      )
    );
  };
  const getCopyCurriculumClassApiCall = () => {
    const payload = {
      branchId,
      academicYearId: copyPreparatoryGradeEntryStudentFormik.values.newAcademicYearId,
      stageId: 2,
    };

    dispatch(
      getCopyClassesByStageAct(
        generateActionPayload("get_copy_classes_by_stage", undefined, payload)
      )
    );
  };

  const latestAcademicYearRef = useRef(copyPreparatoryGradeEntryStudentFormik.values.newAcademicYearId);

  useEffect(() => {
    latestAcademicYearRef.current = copyPreparatoryGradeEntryStudentFormik.values.newAcademicYearId;
  }, [copyPreparatoryGradeEntryStudentFormik.values.newAcademicYearId]);

  useEffect(() => {
    if (copyPreparatoryGradeEntryStudentFormik.values.academicYearId) {
      getCurriculumClassApiCall();
    }
  }, [copyPreparatoryGradeEntryStudentFormik.values.academicYearId]);

  useEffect(() => {
    if (copyPreparatoryGradeEntryStudentFormik.values.newAcademicYearId) {
      getCopyCurriculumClassApiCall();
    }
  }, [copyPreparatoryGradeEntryStudentFormik.values.newAcademicYearId]);

  const handleSelectChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    copyPreparatoryGradeEntryStudentFormik.setFieldValue(name, value);

    if (!value) return;

    if (name === "academicYearId") {
      copyPreparatoryGradeEntryStudentFormik.setFieldValue("classId", "");
      copyPreparatoryGradeEntryStudentFormik.setFieldValue("fromTermId", "");
    }

    if (name === "newAcademicYearId") {
      copyPreparatoryGradeEntryStudentFormik.setFieldValue("newClassId", "");
      copyPreparatoryGradeEntryStudentFormik.setFieldValue("toTermId", "");
    }

    if (name === "classId") {
      const selected = getClassesByStageResp?.find(
        (item: any) => +item.classId === +value
      );

      if (selected?.curriculumId) {
        dispatch(
          getIgseTermNameListAct(
            generateActionPayload("get_igse_term_name_list", undefined, {
              branchId,
              curriculumId: selected.curriculumId,
            })
          )
        );
      }
    }

    if (name === "newClassId") {
      const selected = getCopyClassesByStageResp?.find(
        (item: any) => +item.classId === +value
      );

      if (selected?.curriculumId) {
        dispatch(
          getCopyIgseTermNameListAct(
            generateActionPayload("get_copy_igse_term_name_list", undefined, {
              branchId,
              curriculumId: selected.curriculumId,
            })
          )
        );
      }
    }
  };

  const studentTypeOptions = [
    {
      id: "all-student",
      name: "All Student",
    }, {
      id: "selected-student",
      name: "Selected Student",
    },
    {
      id: "manual-entry",
      name: "Manual Students Entry",
    }
  ]

  function selectStudentHndlr(selectedOptions: any, config?: any) {
    const { name } = config;
    if (Array.isArray(selectedOptions) && selectedOptions.length > 0) {
      copyPreparatoryGradeEntryStudentFormik.setValues((prevState: any) => ({ ...prevState, [name]: selectedOptions }));
    } else {
      copyPreparatoryGradeEntryStudentFormik.setValues((prevState: any) => ({ ...prevState, [name]: null }));
    }
  }

  function onSearchMultiSelectHandler(name: any, value: any) {
    if (!copyPreparatoryGradeEntryStudentFormik.values.newAcademicYearId) return;
    if (value) {
      dispatch(
        getStudentByFilterAct(
          generateActionPayload("get_students_by_name", undefined, {
            instituteId,
            branchId,
            academicYearId: latestAcademicYearRef.current,
            studentName: value,
            pageNo: 0,
            pageSize: 50,
          })
        )
      );
    }
  }

  const manualIds = copyPreparatoryGradeEntryStudentFormik.values.manualStudentIds || "";

  const codes = manualIds
    .split(",")
    .map((code) => code.trim())
    .filter((code) => code.length > 0);

  const hasInvalidCode = codes.some((code) => !/^\d+$/.test(code));

  useEffect(() => {
    if (copyPreparatoryGradeEntryStudentFormik.values.studentType === "manual-entry") {
      dispatch(resetWhatsAppNotificationValidateStudentsAct(undefined));
      setValidatedStudents([]);
      setIsValidated(false);
    }
  }, [copyPreparatoryGradeEntryStudentFormik.values.manualStudentIds, copyPreparatoryGradeEntryStudentFormik.values.studentType, dispatch]);

  useEffect(() => {
    const resp = whatsAppNotificationValidateStudentsResp?.data;
    if (!resp) return;
    if (Array.isArray(resp.data)) {
      setValidatedStudents(resp.data);
    }
    setIsValidated((resp.total ?? 0) - (resp.invalid ?? 0) > 0);

  }, [whatsAppNotificationValidateStudentsResp]);

  const totalCount =
    whatsAppNotificationValidateStudentsResp?.data?.total ?? 0;

  const invalidCount =
    whatsAppNotificationValidateStudentsResp?.data?.invalid ?? 0;

  const validCount = totalCount - invalidCount;

  const hasValidateResp =
    copyPreparatoryGradeEntryStudentFormik.values.studentType === "manual-entry" &&
    whatsAppNotificationValidateStudentsResp?.statusCode === 200 &&
    typeof whatsAppNotificationValidateStudentsResp?.data?.total === "number";

  const canUseSelection =
    copyPreparatoryGradeEntryStudentFormik.values.studentType === "manual-entry" &&
    hasValidateResp &&
    validCount > 0;

  const hasStudentCodes =
    copyPreparatoryGradeEntryStudentFormik.values.manualStudentIds
      ?.split(",")
      .some((code: string) => code.trim().length > 0);

  const validateManualStudents = () => {
    const { manualStudentIds, studentType } = copyPreparatoryGradeEntryStudentFormik.values;
    if (studentType !== "manual-entry") return;
    copyPreparatoryGradeEntryStudentFormik.setFieldTouched("manualStudentIds", true, false);
    const codes = manualStudentIds
      ?.split(",")
      .map((c: string) => c.trim())
      .filter(Boolean);
    if (!codes || codes.length === 0) {
      copyPreparatoryGradeEntryStudentFormik.setErrors({
        manualStudentIds: "Student codes are required",
      });
      return;
    }
    const hasInvalidCode = codes.some(code => !/^\d+$/.test(code));
    if (hasInvalidCode) {
      copyPreparatoryGradeEntryStudentFormik.setErrors({
        manualStudentIds: "Enter valid student codes separated by commas",
      });
      return;
    }
    copyPreparatoryGradeEntryStudentFormik.setErrors({});
    const payload = {
      branchId,
      manualStudentIds: codes.join(","),
    };

    dispatch(
      whatsAppNotifcationValidateStudentsAct(
        generateActionPayload(
          "whatsapp_notifcation_validate_students",
          undefined,
          payload
        )
      )
    );
  };

  const columns = useMemo(() => generateValidateStudentsColumns(), []);
  const { data: academicYearList } = academicYearListResp || {};

  return (
    <>
      <form>
        <div style={{ padding: "1.25rem" }}>
          <div style={{ position: "relative", display: "inline-block", width: "97%", padding: "20px", paddingBottom: '10px', border: "1px solid #CED4DA", borderRadius: "6px", margin: "15px 11px 10px 11px", }}>
            <p className='fs-15' style={{ position: "absolute", top: "-11px", padding: "0px 10px", color: "#495057", backgroundColor: "white", fontWeight: "bold" }}>From</p>
            <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4 tw-pb-4">
              <div>
                <SelectInput
                  name="academicYearId"
                  labelText="Academic Year"
                  labelClass="required"
                  value={copyPreparatoryGradeEntryStudentFormik.values.academicYearId}
                  onChange={handleSelectChange}
                  menuItems={academicYearList}
                  valueKey="academicYearId"
                  textKey="academicYearName"
                  formgroupClassName="mb-0" invalid={(copyPreparatoryGradeEntryStudentFormik.touched.academicYearId && copyPreparatoryGradeEntryStudentFormik.errors.academicYearId) ? true : false}
                  error={(copyPreparatoryGradeEntryStudentFormik.touched.academicYearId && copyPreparatoryGradeEntryStudentFormik.errors.academicYearId) ? copyPreparatoryGradeEntryStudentFormik.errors.academicYearId : ""}
                />
              </div>
              <div>
                <SelectInput
                  name="classId"
                  value={copyPreparatoryGradeEntryStudentFormik.values.classId}
                  onChange={handleSelectChange}
                  menuItems={getClassesByStageResp}
                  valueKey="classId"
                  textKey="className"
                  formgroupClassName="mb-0"
                  labelText="Curriculum Class"
                  labelClass="required"
                  invalid={(copyPreparatoryGradeEntryStudentFormik.touched.classId && copyPreparatoryGradeEntryStudentFormik.errors.classId) ? true : false}
                  error={(copyPreparatoryGradeEntryStudentFormik.touched.classId && copyPreparatoryGradeEntryStudentFormik.errors.classId) ? copyPreparatoryGradeEntryStudentFormik.errors.classId : ""}
                />
              </div>
              <div>
                <SelectInput
                  name="fromTermId"
                  value={copyPreparatoryGradeEntryStudentFormik.values?.fromTermId}
                  onChange={handleSelectChange}
                  menuItems={Array.isArray(getIgseTermNameListResp?.data) ? getIgseTermNameListResp?.data : []}
                  valueKey="termId"
                  textKey="termName"
                  formgroupClassName="w-100"
                  labelText='Term Name'
                  labelClass="required"
                  invalid={(copyPreparatoryGradeEntryStudentFormik.touched.fromTermId && copyPreparatoryGradeEntryStudentFormik.errors.fromTermId) ? true : false}
                  error={(copyPreparatoryGradeEntryStudentFormik.touched.fromTermId && copyPreparatoryGradeEntryStudentFormik.errors.fromTermId) ? copyPreparatoryGradeEntryStudentFormik.errors.fromTermId : ""}
                />
              </div>
            </div>
          </div>
        </div>
        <div style={{ padding: "1.25rem" }}>
          <div style={{ position: "relative", display: "inline-block", width: "97%", padding: "20px", paddingBottom: '10px', border: "1px solid #CED4DA", borderRadius: "6px", margin: "15px 11px 10px 11px", }}>
            <p className='fs-15' style={{ position: "absolute", top: "-11px", padding: "0px 10px", color: "#495057", backgroundColor: "white", fontWeight: "bold" }}>To</p>
           <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4 tw-pb-4">
              <div>
                <SelectInput
                  name="newAcademicYearId"
                  labelText="Academic Year"
                  labelClass="required"
                  value={copyPreparatoryGradeEntryStudentFormik.values.newAcademicYearId}
                  onChange={handleSelectChange}
                  menuItems={academicYearList}
                  valueKey="academicYearId"
                  textKey="academicYearName"
                  formgroupClassName="mb-0"
                  invalid={(copyPreparatoryGradeEntryStudentFormik.touched.newAcademicYearId && copyPreparatoryGradeEntryStudentFormik.errors.newAcademicYearId) ? true : false}
                  error={(copyPreparatoryGradeEntryStudentFormik.touched.newAcademicYearId && copyPreparatoryGradeEntryStudentFormik.errors.newAcademicYearId) ? copyPreparatoryGradeEntryStudentFormik.errors.newAcademicYearId : ""}
                />
              </div>
              <div>
                <SelectInput
                  name="newClassId"
                  value={copyPreparatoryGradeEntryStudentFormik.values.newClassId}
                  onChange={handleSelectChange}
                  menuItems={getCopyClassesByStageResp}
                  valueKey="classId"
                  textKey="className"
                  formgroupClassName="mb-0"
                  labelText="Curriculum Class"
                  labelClass="required"
                  invalid={(copyPreparatoryGradeEntryStudentFormik.touched.newClassId && copyPreparatoryGradeEntryStudentFormik.errors.newClassId) ? true : false}
                  error={(copyPreparatoryGradeEntryStudentFormik.touched.newClassId && copyPreparatoryGradeEntryStudentFormik.errors.newClassId) ? copyPreparatoryGradeEntryStudentFormik.errors.newClassId : ""}
                />
              </div>
              <div>
                <SelectInput
                  name="toTermId"
                  value={copyPreparatoryGradeEntryStudentFormik.values?.toTermId}
                  onChange={handleSelectChange}
                  menuItems={Array.isArray(getCopyIgseTermNameListResp?.data) ? getCopyIgseTermNameListResp?.data : []}
                  valueKey="termId"
                  textKey="termName"
                  formgroupClassName="w-100"
                  labelText='Term Name'
                  labelClass="required"
                  invalid={(copyPreparatoryGradeEntryStudentFormik.touched.toTermId && copyPreparatoryGradeEntryStudentFormik.errors.toTermId) ? true : false}
                  error={(copyPreparatoryGradeEntryStudentFormik.touched.toTermId && copyPreparatoryGradeEntryStudentFormik.errors.toTermId) ? copyPreparatoryGradeEntryStudentFormik.errors.toTermId : ""}
                />
              </div>
            </div>
          </div>
        </div>
        <div style={{ padding: "1.25rem" }}>
          <div style={{ position: "relative", display: "inline-block", width: "97%", padding: "20px", paddingBottom: '10px', border: "1px solid #CED4DA", borderRadius: "6px", margin: "15px 11px 10px 11px", }}>
            <p className='fs-15' style={{ position: "absolute", top: "-11px", padding: "0px 10px", color: "#495057", backgroundColor: "white", fontWeight: "bold" }}>Student Type</p>
            <div className="row">
              <div className="col-12">
                <RadioInputContainer
                  name="studentType"
                  inputContainerClassName="tw-mt-1"
                  radioOptions={studentTypeOptions}
                  value={copyPreparatoryGradeEntryStudentFormik.values.studentType}
                  onChange={copyPreparatoryGradeEntryStudentFormik.handleChange}
                />
              </div>
              {copyPreparatoryGradeEntryStudentFormik.values.studentType === "selected-student" && (
                <div className="tw-w-full">
                  <MultiSelectCheckbox
                    name="studentIds"
                    labelText="Students"
                    containerClassName="tw-mb-3"
                    idKey="id"
                    value={copyPreparatoryGradeEntryStudentFormik.values.studentIds}
                    renderValue={renderValueStudent}
                    renderOptions={renderOptionsStudent}
                    onChange={selectStudentHndlr}
                    onSearchHandler={onSearchMultiSelectHandler}
                    options={getStudentsByFilterResp}
                    invalid={(copyPreparatoryGradeEntryStudentFormik.touched.studentIds && copyPreparatoryGradeEntryStudentFormik.errors.studentIds) ? true : false}
                    error={(copyPreparatoryGradeEntryStudentFormik.touched.studentIds && copyPreparatoryGradeEntryStudentFormik.errors.studentIds) ? copyPreparatoryGradeEntryStudentFormik.errors.studentIds : ""}
                  />
                </div>
              )}
              {copyPreparatoryGradeEntryStudentFormik.values.studentType === "manual-entry" && (
                <div className="tw-w-full">
                  <TextArea
                    name="manualStudentIds"
                    value={copyPreparatoryGradeEntryStudentFormik.values.manualStudentIds}
                    onChange={copyPreparatoryGradeEntryStudentFormik.handleChange}
                    invalid={(copyPreparatoryGradeEntryStudentFormik.touched.manualStudentIds && copyPreparatoryGradeEntryStudentFormik.errors.manualStudentIds) ? true : false}
                    error={(copyPreparatoryGradeEntryStudentFormik.touched.manualStudentIds && copyPreparatoryGradeEntryStudentFormik.errors.manualStudentIds) ? copyPreparatoryGradeEntryStudentFormik.errors.manualStudentIds : ""}
                    maxLength={60000}
                  />
                </div>
              )}
              {copyPreparatoryGradeEntryStudentFormik.values.studentType === "manual-entry" && (
                <div className="tw-text-sm tw-text-gray-500 tw-mt-1">
                  <span className="tw-font-semibold tw-text-gray-700">
                    Note:
                  </span>{" "}
                  Enter student codes separated by commas.

                  <div className="tw-mt-1 tw-text-gray-500">
                    Example:{" "}
                    <code className="tw-bg-gray-100 tw-px-1.5 tw-py-0.5 tw-rounded tw-text-gray-700">
                      1234, 12345, 1234567
                    </code>
                  </div>

                  {hasInvalidCode && (
                    <div className="tw-text-red-500 tw-text-sm tw-mt-1">
                      Only numeric values are allowed.
                    </div>
                  )}
                </div>
              )}
              {hasValidateResp && (
                <>
                  {validCount > 0 ? (
                    <div className="tw-bg-white tw-overflow-hidden !tw-mt-2">
                      <TableContainer
                        columns={columns}
                        data={validatedStudents}
                        showPagination={false}
                        showCheckbox={false}
                        tableClass="mb-0"
                        divClass="tw-border tw-border-gray-200 tw-rounded-xl table-responsive max-h-400px"
                        theadClass="table-light text-muted align-middle position-sticky top-0"
                      />
                    </div>
                  ) : (
                    <div className="tw-flex tw-items-center tw-justify-center tw-h-[120px] tw-bg-gray-50 tw-border tw-border-dashed tw-border-gray-300 tw-rounded-xl">
                      <p className="tw-text-sm tw-text-gray-600 mb-0">
                        <span className="tw-ml-2">No records are valid. Please correct the student codes and validate again.</span>  <RejectSvg fill="#f06548" width={"20px"} height="20px" />
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
          <div className="tw-flex tw-gap-2 tw-justify-end tw-mt-4 tw-mb-1">
            <Button
              type="button"
              variant='secondary'
              onClick={props.toggle}
            >
              Cancel
            </Button>
            {copyPreparatoryGradeEntryStudentFormik.values.studentType === "manual-entry" && !canUseSelection ? (
              <Button
                type="button"
                variant='info'
                onClick={validateManualStudents}
                disabled={!hasStudentCodes}
              >
                Validate
              </Button>
            ) : (
              <Button
                type="submit"
                variant='primary'
                onClick={(event: any) =>
                  copyPreparatoryGradeEntryStudentFormik.handleSubmit(event)
                }
              >
                Submit
              </Button>
            )}
          </div>
        </div>
      </form>
    </>
  );
};

export default CopyPreparatoryGradeEntryStudentDetailsModal;
