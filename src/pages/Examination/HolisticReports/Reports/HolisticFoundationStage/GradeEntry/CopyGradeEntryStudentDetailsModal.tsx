import React, { useEffect, useMemo, useRef, useState, } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { copyFoundationStageGradeEntryStudentDetailsAct } from "../../../../../../store/examination/examinationmanagement/examinationmanagementactions";
import { useAppDispatch, useAppSelector } from "../../../../../../hooks/storehook";
import { generateActionPayload } from "../../../../../../utility/reduxutility";
import { shallowEqual } from "react-redux";
import { MultiSelectCheckbox, RadioInputContainer, SelectInput, TextArea } from "../../../../../../Components/Common";
import { getClassesByStageAct, getCopyClassesByStageAct, getCopyIgseTermNameListAct, getIgseTermNameListAct } from "../../../../../../store/examination/examinationsettings/examinationsettingsaction";
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

const CopyGradeEntryStudentDetailsModal = (props: any) => {
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
    ({ instAcademics, branchAcademics, assignLanguages, appData, examinationSettings, directoryStudent, communication }) => ({
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

  const copyGradeEntryStudentDetailsFormik = useFormik({
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
        copyFoundationStageGradeEntryStudentDetailsAct(
          generateActionPayload(
            "copy_foundation_grade_entry_student_details",
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
      academicYearId: copyGradeEntryStudentDetailsFormik.values.academicYearId,
      stageId: 1,
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
      academicYearId: copyGradeEntryStudentDetailsFormik.values.newAcademicYearId,
      stageId: 1,
    };

    dispatch(
      getCopyClassesByStageAct(
        generateActionPayload("get_copy_classes_by_stage", undefined, payload)
      )
    );
  };

  const latestAcademicYearRef = useRef(copyGradeEntryStudentDetailsFormik.values.newAcademicYearId);

  useEffect(() => {
    latestAcademicYearRef.current = copyGradeEntryStudentDetailsFormik.values.newAcademicYearId;
  }, [copyGradeEntryStudentDetailsFormik.values.newAcademicYearId]);

  useEffect(() => {
    if (copyGradeEntryStudentDetailsFormik.values.academicYearId) {
      getCurriculumClassApiCall();
    }
  }, [copyGradeEntryStudentDetailsFormik.values.academicYearId]);

  useEffect(() => {
    if (copyGradeEntryStudentDetailsFormik.values.newAcademicYearId) {
      getCopyCurriculumClassApiCall();
    }
  }, [copyGradeEntryStudentDetailsFormik.values.newAcademicYearId]);

  const handleSelectChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    copyGradeEntryStudentDetailsFormik.setFieldValue(name, value);

    if (!value) return;

    if (name === "academicYearId") {
      copyGradeEntryStudentDetailsFormik.setFieldValue("classId", "");
      copyGradeEntryStudentDetailsFormik.setFieldValue("fromTermId", "");
    }

    if (name === "newAcademicYearId") {
      copyGradeEntryStudentDetailsFormik.setFieldValue("newClassId", "");
      copyGradeEntryStudentDetailsFormik.setFieldValue("toTermId", "");
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
      copyGradeEntryStudentDetailsFormik.setValues((prevState: any) => ({ ...prevState, [name]: selectedOptions }));
    } else {
      copyGradeEntryStudentDetailsFormik.setValues((prevState: any) => ({ ...prevState, [name]: null }));
    }
  }

  function onSearchMultiSelectHandler(name: any, value: any) {
    if (!copyGradeEntryStudentDetailsFormik.values.newAcademicYearId) return;
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

  const manualIds = copyGradeEntryStudentDetailsFormik.values.manualStudentIds || "";

  const codes = manualIds
    .split(",")
    .map((code) => code.trim())
    .filter((code) => code.length > 0);

  const hasInvalidCode = codes.some((code) => !/^\d+$/.test(code));

  useEffect(() => {
    if (copyGradeEntryStudentDetailsFormik.values.studentType === "manual-entry") {
      dispatch(resetWhatsAppNotificationValidateStudentsAct(undefined));
      setValidatedStudents([]);
      setIsValidated(false);
    }
  }, [copyGradeEntryStudentDetailsFormik.values.manualStudentIds, copyGradeEntryStudentDetailsFormik.values.studentType, dispatch]);

  useEffect(() => {
    const resp = whatsAppNotificationValidateStudentsResp?.data;
    if (!resp) return;
    if (Array.isArray(resp.data)) {
      setValidatedStudents(resp.data);
    }
    setIsValidated((resp.total ?? 0) - (resp.invalid ?? 0) > 0);

  }, [whatsAppNotificationValidateStudentsResp]);

    const countPill =
        "tw-ml-2 tw-min-w-[28px] tw-text-center tw-inline-flex tw-items-center tw-justify-center tw-px-2 tw-py-0.5 tw-rounded-full tw-bg-gray-100 tw-text-gray-800 tw-text-xs tw-font-semibold";

  const totalCount =
    whatsAppNotificationValidateStudentsResp?.data?.total ?? 0;

  const invalidCount =
    whatsAppNotificationValidateStudentsResp?.data?.invalid ?? 0;

  const validCount = totalCount - invalidCount;

  const hasValidateResp =
    copyGradeEntryStudentDetailsFormik.values.studentType === "manual-entry" &&
    whatsAppNotificationValidateStudentsResp?.statusCode === 200 &&
    typeof whatsAppNotificationValidateStudentsResp?.data?.total === "number";

  const canUseSelection =
    copyGradeEntryStudentDetailsFormik.values.studentType === "manual-entry" &&
    hasValidateResp &&
    validCount > 0;

  const hasStudentCodes =
    copyGradeEntryStudentDetailsFormik.values.manualStudentIds
      ?.split(",")
      .some((code: string) => code.trim().length > 0);

  const validateManualStudents = () => {
    const { manualStudentIds, studentType } = copyGradeEntryStudentDetailsFormik.values;
    if (studentType !== "manual-entry") return;
    copyGradeEntryStudentDetailsFormik.setFieldTouched("manualStudentIds", true, false);
    const codes = manualStudentIds
      ?.split(",")
      .map((c: string) => c.trim())
      .filter(Boolean);
    if (!codes || codes.length === 0) {
      copyGradeEntryStudentDetailsFormik.setErrors({
        manualStudentIds: "Student codes are required",
      });
      return;
    }

    const hasInvalidCode = codes.some(code => !/^\d+$/.test(code));
    if (hasInvalidCode) {
      copyGradeEntryStudentDetailsFormik.setErrors({
        manualStudentIds: "Enter valid student codes separated by commas",
      });
      return;
    }
    copyGradeEntryStudentDetailsFormik.setErrors({});
    const payload = {
      branchId,
      studentCodes: codes.join(","),
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
        <div className="tw-p-5">
          <div style={{ position: "relative", display: "inline-block", width: "97%", padding: "20px", paddingBottom: '10px', border: "1px solid #CED4DA", borderRadius: "6px", margin: "15px 11px 10px 11px", }}>
            <p className='fs-15' style={{ position: "absolute", top: "-11px", padding: "0px 10px", color: "#495057", backgroundColor: "white", fontWeight: "bold" }}>From</p>
            <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4 tw-pb-4">
              <div>
                <SelectInput
                  name="academicYearId"
                  labelText="Academic Year"
                  labelClass="required"
                  value={copyGradeEntryStudentDetailsFormik.values.academicYearId}
                  onChange={handleSelectChange}
                  menuItems={academicYearList}
                  valueKey="academicYearId"
                  textKey="academicYearName"
                  formgroupClassName="tw-mb-0" invalid={(copyGradeEntryStudentDetailsFormik.touched.academicYearId && copyGradeEntryStudentDetailsFormik.errors.academicYearId) ? true : false}
                  error={(copyGradeEntryStudentDetailsFormik.touched.academicYearId && copyGradeEntryStudentDetailsFormik.errors.academicYearId) ? copyGradeEntryStudentDetailsFormik.errors.academicYearId : ""}
                />
              </div>
              <div>
                <SelectInput
                  name="classId"
                  value={copyGradeEntryStudentDetailsFormik.values.classId}
                  onChange={handleSelectChange}
                  menuItems={getClassesByStageResp}
                  valueKey="classId"
                  textKey="className"
                  formgroupClassName="tw-mb-0"
                  labelText="Curriculum Class"
                  labelClass="required"
                  invalid={(copyGradeEntryStudentDetailsFormik.touched.classId && copyGradeEntryStudentDetailsFormik.errors.classId) ? true : false}
                  error={(copyGradeEntryStudentDetailsFormik.touched.classId && copyGradeEntryStudentDetailsFormik.errors.classId) ? copyGradeEntryStudentDetailsFormik.errors.classId : ""}
                />
              </div>
              <div>
                <SelectInput
                  name="fromTermId"
                  value={copyGradeEntryStudentDetailsFormik.values?.fromTermId}
                  onChange={handleSelectChange}
                  menuItems={Array.isArray(getIgseTermNameListResp?.data) ? getIgseTermNameListResp?.data : []}
                  valueKey="termId"
                  textKey="termName"
                  formgroupClassName="w-100"
                  labelText='Term Name'
                  labelClass="required"
                  invalid={(copyGradeEntryStudentDetailsFormik.touched.fromTermId && copyGradeEntryStudentDetailsFormik.errors.fromTermId) ? true : false}
                  error={(copyGradeEntryStudentDetailsFormik.touched.fromTermId && copyGradeEntryStudentDetailsFormik.errors.fromTermId) ? copyGradeEntryStudentDetailsFormik.errors.fromTermId : ""}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="tw-p-5">
          <div style={{ position: "relative", display: "inline-block", width: "97%", padding: "20px", paddingBottom: '10px', border: "1px solid #CED4DA", borderRadius: "6px", margin: "15px 11px 10px 11px", }}>
            <p className='fs-15' style={{ position: "absolute", top: "-11px", padding: "0px 10px", color: "#495057", backgroundColor: "white", fontWeight: "bold" }}>To</p>
            <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4 tw-pb-5">
              <div>
                <SelectInput
                  name="newAcademicYearId"
                  labelText="Academic Year"
                  labelClass="required"
                  value={copyGradeEntryStudentDetailsFormik.values.newAcademicYearId}
                  onChange={handleSelectChange}
                  menuItems={academicYearList}
                  valueKey="academicYearId"
                  textKey="academicYearName"
                  formgroupClassName="tw-mb-0"
                  invalid={(copyGradeEntryStudentDetailsFormik.touched.newAcademicYearId && copyGradeEntryStudentDetailsFormik.errors.newAcademicYearId) ? true : false}
                  error={(copyGradeEntryStudentDetailsFormik.touched.newAcademicYearId && copyGradeEntryStudentDetailsFormik.errors.newAcademicYearId) ? copyGradeEntryStudentDetailsFormik.errors.newAcademicYearId : ""}
                />
              </div>
              <div>
                <SelectInput
                  name="newClassId"
                  value={copyGradeEntryStudentDetailsFormik.values.newClassId}
                  onChange={handleSelectChange}
                  menuItems={getCopyClassesByStageResp}
                  valueKey="classId"
                  textKey="className"
                  formgroupClassName="tw-mb-0"
                  labelText="Curriculum Class"
                  labelClass="required"
                  invalid={(copyGradeEntryStudentDetailsFormik.touched.newClassId && copyGradeEntryStudentDetailsFormik.errors.newClassId) ? true : false}
                  error={(copyGradeEntryStudentDetailsFormik.touched.newClassId && copyGradeEntryStudentDetailsFormik.errors.newClassId) ? copyGradeEntryStudentDetailsFormik.errors.newClassId : ""}
                />
              </div>
              <div>
                <SelectInput
                  name="toTermId"
                  value={copyGradeEntryStudentDetailsFormik.values?.toTermId}
                  onChange={handleSelectChange}
                  menuItems={Array.isArray(getCopyIgseTermNameListResp?.data) ? getCopyIgseTermNameListResp?.data : []}
                  valueKey="termId"
                  textKey="termName"
                  formgroupClassName="tw-w-full"
                  labelText='Term Name'
                  labelClass="required"
                  invalid={(copyGradeEntryStudentDetailsFormik.touched.toTermId && copyGradeEntryStudentDetailsFormik.errors.toTermId) ? true : false}
                  error={(copyGradeEntryStudentDetailsFormik.touched.toTermId && copyGradeEntryStudentDetailsFormik.errors.toTermId) ? copyGradeEntryStudentDetailsFormik.errors.toTermId : ""}
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
                  value={copyGradeEntryStudentDetailsFormik.values.studentType}
                  onChange={copyGradeEntryStudentDetailsFormik.handleChange}
                />
              </div>
              {copyGradeEntryStudentDetailsFormik.values.studentType === "selected-student" && (
                <div className="tw-w-full">
                  <MultiSelectCheckbox
                    name="studentIds"
                    labelText="Students"
                    containerClassName="tw-mb-3"
                    idKey="id"
                    value={copyGradeEntryStudentDetailsFormik.values.studentIds}
                    renderValue={renderValueStudent}
                    renderOptions={renderOptionsStudent}
                    onChange={selectStudentHndlr}
                    onSearchHandler={onSearchMultiSelectHandler}
                    options={getStudentsByFilterResp}
                    invalid={(copyGradeEntryStudentDetailsFormik.touched.studentIds && copyGradeEntryStudentDetailsFormik.errors.studentIds) ? true : false}
                    error={(copyGradeEntryStudentDetailsFormik.touched.studentIds && copyGradeEntryStudentDetailsFormik.errors.studentIds) ? copyGradeEntryStudentDetailsFormik.errors.studentIds : ""}
                  />
                </div>
              )}
              {copyGradeEntryStudentDetailsFormik.values.studentType === "manual-entry" && (
                <div className="tw-w-full">
                  <div className="row align-items-center mb-2">
                    <div className="col-8 form-label required">
                      Students
                    </div>
                    <div className="col-4 text-end">
                      <div className="tw-inline-flex tw-items-center tw-gap-2 tw-text-sm tw-text-gray-700">
                        <span>Total :</span>
                        <span className={countPill}>{totalCount}</span>
                      </div>
                    </div>
                  </div>
                  <TextArea
                    name="manualStudentIds"
                    value={copyGradeEntryStudentDetailsFormik.values.manualStudentIds}
                    onChange={copyGradeEntryStudentDetailsFormik.handleChange}
                    invalid={(copyGradeEntryStudentDetailsFormik.touched.manualStudentIds && copyGradeEntryStudentDetailsFormik.errors.manualStudentIds) ? true : false}
                    error={(copyGradeEntryStudentDetailsFormik.touched.manualStudentIds && copyGradeEntryStudentDetailsFormik.errors.manualStudentIds) ? copyGradeEntryStudentDetailsFormik.errors.manualStudentIds : ""}
                    maxLength={60000}
                  />
                </div>
              )}
              {copyGradeEntryStudentDetailsFormik.values.studentType === "manual-entry" && (
                <div className="tw-text-sm tw-text-gray-500 tw-mt-1">
                  <span className="tw-font-semibold tw-text-gray-700">Note:</span>{" "}
                  Enter student codes separated by commas.

                  <div className="tw-text-gray-500 tw-mt-1">
                    Example: <code className="tw-bg-gray-100 tw-px-1.5 tw-py-0.5 tw-rounded tw-text-gray-700">1234, 12345, 1234567</code>
                  </div>

                  {hasInvalidCode && (
                    <div className="tw-text-red-500 tw-mt-1 tw-text-sm">
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
                        tableClass="tw-mb-0"
                        divClass="tw-border tw-border-gray-200 tw-rounded-xl table-responsive max-h-400px"
                        theadClass="table-light text-muted align-middle position-sticky top-0"
                      />
                    </div>
                  ) : (
                    <div className="tw-flex tw-items-center tw-justify-center tw-h-[120px] tw-bg-gray-50 tw-border tw-border-dashed tw-border-gray-300 tw-rounded-xl">
                      <p className="tw-text-sm tw-text-gray-600 mb-0">
                        <span className="ms-2">No records are valid. Please correct the student codes and validate again.</span>  <RejectSvg fill="#f06548" width={"20px"} height="20px" />
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
            {copyGradeEntryStudentDetailsFormik.values.studentType === "manual-entry" && !canUseSelection ? (
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
                  copyGradeEntryStudentDetailsFormik.handleSubmit(event)
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

export default CopyGradeEntryStudentDetailsModal;
