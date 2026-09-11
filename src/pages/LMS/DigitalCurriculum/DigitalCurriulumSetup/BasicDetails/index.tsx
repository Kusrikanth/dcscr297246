import { HugeiconsIcon } from "@hugeicons/react";
import { CustomSelect, SelectInput, TextInput } from "../../../../../Components/Common";
import { Bookmark03Icon, CircleArrowLeft01Icon, CircleArrowRight01Icon } from "@hugeicons-pro/core-stroke-standard";
import { File01Icon } from "@hugeicons-pro/core-solid-standard";
import { useContext, useEffect, useRef } from "react";
import { StepperFormContext } from "../helper";
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
import { useHistory, useLocation } from "react-router-dom";
import { useFormik } from "formik";
import { getDigitalCurriculumBasicDetailsByIdAct, previewDigitalCurriculumDetailsAct, saveBasicDigitalCurriculumAct } from "../../../../../store/lms/lmsdigitalcurriculum/lmsdigitalcurriculumaction";
import { generateActionPayload } from "../../../../../utility/reduxutility";
import { shallowEqual } from "react-redux";
import { getInstSubjectNameAct } from "../../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { renderOptionsEmployee, renderValueSection } from "./helper";
import { getEmployeeByFilterAct } from "../../../../../store/directory/employeemanagement/employeemanagementactions";
import { toast } from "react-toastify";
import { getMasterClassesAct, getMasterCurriculumAct } from "../../../../../store/masterdata/masterdataactions";

type LocationState = {
  subjectCurriculumId?: number;
};

const initialValues = {
  academicYearId: '',
  curriculumId: '',
  subjectCurriculumName: '',
  streamGroupId: '',
  classId: '',
  subjectId: '',
  createdBy: '',
  numberingScheme: '',
};

const validationSchema = Yup.object({
  subjectCurriculumName: Yup.string().required('Assessment name is required').max(100, 'Assessment name should not be more than 100 characters'),
  curriculumId: Yup.string().required('Curriculum is required'),
  classId: Yup.string().required('Class is required'),
  subjectId: Yup.string().required('Subject is required'),
  createdBy: Yup.string().required('Created by is required'),
});

const BasicDetails = () => {
  const { goToNextStep, subjectCurriculumId, goToPreviousStep, goToStep, isFirstStep, isLastStep, setSubjectCurriculumId } =
    useContext(StepperFormContext);
  const dispatch = useAppDispatch();
  const history = useHistory();
  const location = useLocation<LocationState>();

  const idFromRouteState = location.state?.subjectCurriculumId;

  const submitTypeRef = useRef<"draft" | "next">("next");
  const digitalCurriculumAddForm = useFormik({
    validationSchema,
    initialValues,
    onSubmit: (values) => {
      const selectedInstitute = instituteListResp?.data?.find(
        (item: any) => Number(item?.id) === Number(instituteId)
      );

      const academicYearName = academicYearListResp?.data?.find(
        (item: any) => Number(item.academicYearId) === Number(values.academicYearId)
      )?.academicYearName;

      const branchName = branchListResp?.data?.find(
        (item: any) => Number(item.branchId) === Number(branchId)
      )?.branchName;

      const curriculumName = masterCurriculumResp?.find(
        (item: any) => Number(item.id) === Number(values.curriculumId)
      )?.curriculumName;

      const className = masterClassesResp?.find(
        (item: any) => Number(item.id) === Number(values.classId)
      )?.name;

      const streamGroupName = masterClassStreamGroupResp?.find(
        (item: any) => Number(item.id) === Number(values.streamGroupId)
      )?.groupName;

      const subjectName = instSubjectNameResp?.content?.find(
        (item: any) => Number(item.id) === Number(values.subjectId)
      )?.subjectName;

      const selectedEmployee = getEmployeesByFilterResp?.find(
        (emp: any) => String(emp.userId) === String(values.createdBy)
      );

      const payload = {
        id: getDigitalCurriculumBasicDetailsByIdResp?.id || null,

        instituteGroupId: selectedInstitute?.instituteGroupId,
        instituteId,
        branchId,
        branchName,
        branchShortName: branchListResp?.data?.find(
          (item: any) => Number(item.branchId) === Number(branchId)
        )?.shortName,
        academicYearId: values.academicYearId,
        academicYearName,
        curriculumId: values.curriculumId,
        curriculumName,
        subjectCurriculumName: values.subjectCurriculumName,
        classId: values.classId,
        className,
        streamGroupId: values.streamGroupId,
        streamGroupName,
        subjectId: values.subjectId,
        subjectName,
        numberingScheme: values.numberingScheme,
        createdBy: values.createdBy,
        createdByName: selectedEmployee?.employeeName || "",
      };
      const formData = new FormData();
      formData.append("requestValue", JSON.stringify(payload));

      // if (getAssessmentByIdResp) {
      //     payload.id = props.id || saveBasicDigitalCurriculumResp?.data
      // }
      dispatch(saveBasicDigitalCurriculumAct(generateActionPayload("save_basic_digital_curriculum", undefined, formData)));
      // submitCurrentFormCllbck("add_question", TABS_ACTIONS.PARTICULAR_TAB);

    }
  });

  useEffect(() => {
    if (idFromRouteState && !subjectCurriculumId) {
      setSubjectCurriculumId(idFromRouteState);
    }
  }, [idFromRouteState, subjectCurriculumId]);

  useEffect(() => {
    if (subjectCurriculumId) {
      dispatch(
        getDigitalCurriculumBasicDetailsByIdAct(
          generateActionPayload(
            "get_digital_curriculum_basic_details_by_id",
            { subjectCurriculumId },
            undefined
          )
        )
      );
    }
  }, [subjectCurriculumId]);

  const {
    instituteListResp,
    academicYearListResp,
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    showApiLoader,
    masterCurriculumResp,
    masterClassesResp,
    instSubjectNameResp,
    masterClassStreamGroupResp,
    getEmployeesByFilterResp,
    branchListResp,
    saveBasicDigitalCurriculumResp,
    lmsdigitalcurriculumErrorAct,
    getDigitalCurriculumBasicDetailsByIdResp,
  } = useAppSelector(
    ({ instituteInfo, instAcademics, globalData, masterData, branchAcademics, appData, classSubjectsInfo, directoryEmployee, branch, lmsAssessment, lmsdigitalcurriculum }) => ({
      instituteListResp: instituteInfo.instituteListResp,
      academicYearListResp: instAcademics.academicYearListResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      showApiLoader: globalData.showApiLoader,
      masterCurriculumResp: masterData.masterCurriculumResp,
      masterClassesResp: masterData.masterClassesResp,
      instSubjectNameResp: branchAcademics.instSubjectNameResp,
      masterClassStreamGroupResp: masterData.masterClassStreamGroupResp,
      getEmployeesByFilterResp: directoryEmployee.getEmployeesByFilterResp,
      branchListResp: branch.branchListResp,
      saveBasicDigitalCurriculumResp: lmsdigitalcurriculum.saveBasicDigitalCurriculumResp,
      lmsdigitalcurriculumErrorAct: lmsdigitalcurriculum.lmsdigitalcurriculumErrorAct,
      getDigitalCurriculumBasicDetailsByIdResp: lmsdigitalcurriculum.getDigitalCurriculumBasicDetailsByIdResp,

    }),
    shallowEqual
  );

  const instituteRespRef = useRef<any>({
    prevLmsdigitalcurriculumErrorAct: lmsdigitalcurriculumErrorAct,
    prevSaveBasicDigitalCurriculumResp: saveBasicDigitalCurriculumResp,
  });

  useEffect(() => {
    const { prevLmsdigitalcurriculumErrorAct, prevSaveBasicDigitalCurriculumResp } = instituteRespRef.current;
    if (lmsdigitalcurriculumErrorAct && prevLmsdigitalcurriculumErrorAct !== lmsdigitalcurriculumErrorAct) {
      toast.error(lmsdigitalcurriculumErrorAct.details || "Something went wrong.");
    }
    else if (saveBasicDigitalCurriculumResp && prevSaveBasicDigitalCurriculumResp !== saveBasicDigitalCurriculumResp) {
      toast.success("Basic Digital Curriculum Details saved successfully.");
      const subjectCurriculumId = saveBasicDigitalCurriculumResp.data;
      if (submitTypeRef.current === "draft") {
        history.push("/digital-curriculum");
      } else {
        if (subjectCurriculumId) {
          setSubjectCurriculumId(subjectCurriculumId);
        }
        goToNextStep();
      }
    }
    instituteRespRef.current.prevSaveBasicDigitalCurriculumResp = saveBasicDigitalCurriculumResp;
    instituteRespRef.current.prevLmsdigitalcurriculumErrorAct = lmsdigitalcurriculumErrorAct;
  }, [lmsdigitalcurriculumErrorAct, saveBasicDigitalCurriculumResp]);

  useEffect(() => {
    const data = getDigitalCurriculumBasicDetailsByIdResp;

    if (!subjectCurriculumId || !data || !getEmployeesByFilterResp?.length) return;

    const matchedEmployee = getEmployeesByFilterResp.find(
      (emp: any) =>
        emp.employeeName?.toLowerCase() ===
        data.createdByName?.toLowerCase()
    );

    digitalCurriculumAddForm.setValues((prev) => ({
      ...prev,
      academicYearId: data.academicYearId || "",
      curriculumId: data.curriculumId || "",
      subjectCurriculumName: data.subjectCurriculumName || "",
      classId: data.classId || "",
      subjectId: data.subjectId || "",
      createdBy: matchedEmployee?.userId || "",
      numberingScheme: data.numberingScheme || prev.numberingScheme,
    }));
  }, [getDigitalCurriculumBasicDetailsByIdResp, getEmployeesByFilterResp]);

  useEffect(() => {
    const data = getDigitalCurriculumBasicDetailsByIdResp;

    if (!data?.createdByName) return;

    dispatch(
      getEmployeeByFilterAct(
        generateActionPayload(
          "get_employee_by_name",
          { searchString: data.createdByName },
          { instituteGroupId: 1 }
        )
      )
    );
  }, [getDigitalCurriculumBasicDetailsByIdResp]);

  const getCurriculumApiCall = (otherProps?: any) => {
    const payload1 = {

    };
    dispatch(getMasterCurriculumAct(generateActionPayload("get_master_curriculum", undefined, { pageNo: 0, pageSize: 50 })));
  };

  function getClassApiCall() {
    const payload = {

    };

    dispatch(
      getMasterClassesAct(
        generateActionPayload("get_master_classes", undefined, payload)
      )
    );
  }
  const subjectListApicall = (otherProps?: any) => {
    const payload = { instituteId, ...otherProps, pageNo: 0, pageSize: 100, };
    if (instituteId) {
      dispatch(
        getInstSubjectNameAct(generateActionPayload("get_inst_subject_name", undefined, payload))
      );
    }
  }

  useEffect(() => {

    getCurriculumApiCall();
    getClassApiCall();

  }, []);

  useEffect(() => {
    if (instituteId) {
      subjectListApicall();
    }
  }, [instituteId]);

  const onchangeHandler = (e: any) => {
    const { name, value } = e.target;

    digitalCurriculumAddForm.setFieldValue(name, value);

  }

  function selectSectionHndlr(selectedOptions: number | number[], config?: any) {
    const { name } = config;
    const selectedContactPerson = getEmployeesByFilterResp.find((item: { userId: number }) => +item.userId === +selectedOptions);
    if (selectedContactPerson) {
      digitalCurriculumAddForm.setValues((prevState) => ({
        ...prevState, contactPerson: selectedContactPerson.employeeName, contactPhone: selectedContactPerson.workPhoneNo, [name]: selectedOptions
      }))
    }
    else {
      digitalCurriculumAddForm.setValues((prevState) => ({ ...prevState, [name]: selectedOptions }))
    }
  }

  function onSearchMultiSelectHandleremployee(name: any, value: string) {
    if (value) {
      const params = { searchString: value };
      dispatch(getEmployeeByFilterAct(generateActionPayload("get_employee_by_name", params, { instituteGroupId: 1 })));
    }
  }

  useEffect(() => {
    const { data } = academicYearListResp || {};
    if (Array.isArray(data) && data.length > 0) {
      const academicYearId = data.find((year: any) => year.yearStatus?.toUpperCase() === "CURRENT")?.academicYearId;
      let { academicYearName } = data.find((year: any) => year.academicYearId === academicYearId) || {};
      if (academicYearId) {
        digitalCurriculumAddForm.setFieldValue("academicYearId", academicYearId);
        getCurriculumApiCall({ academicYearId });

      }
    }
  }, [academicYearListResp]);

  const handleSaveDigitalCurriculum = () => {
    history.push("/digital-curriculum");
  };


  const selectedClass = masterClassesResp?.find(
  (item: any) =>
    Number(item.id) === Number(digitalCurriculumAddForm.values.classId)
);

const showStreamGroup =
  selectedClass?.classSequence === 14 ||
  selectedClass?.classSequence === 15;

  return (
    <>
      <div className="tw-bg-white tw-h-full tw-rounded-xl tw-shadow-lg tw-border tw-border-slate-200">
        <div className="tw-flex tw-items-center tw-gap-4 tw-p-5 tw-border-b tw-border-slate-200 tw-rounded-t-xl">
          <div className="tw-w-12 tw-h-12 tw-bg-[#CBF3EF] tw-rounded-xl tw-flex tw-items-center tw-justify-center tw-shrink-0">
            <HugeiconsIcon icon={File01Icon} size={24} color="#0AB39C" />
          </div>
          <div>
            <h4 className="tw-text-[18px] tw-font-semibold tw-text-slate-800 tw-leading-snug">
              Step 1: Basic Details
            </h4>
            <p className="tw-text-sm tw-text-slate-500 tw-mt-0.5">
              Provide the basic details about your digital curriculum.
            </p>
          </div>
        </div>
        <div className="tw-py-5 tw-px-8">
          <form onSubmit={digitalCurriculumAddForm.handleSubmit} className="tw-h-full lms">
            <div className="tw-grid tw-grid-cols-12 tw-gap-4 create-admin-assessment">
              <div className="tw-col-span-10 md:tw-col-span-5 lg:tw-col-span-4">
                <TextInput
                  name="subjectCurriculumName"
                  value={digitalCurriculumAddForm.values.subjectCurriculumName}
                  onChange={digitalCurriculumAddForm.handleChange}
                  labelText='Curriculum Name'
                  formgroupClassName="mb-3 "
                  labelClass=' required'
                  invalid={(digitalCurriculumAddForm.touched.subjectCurriculumName && digitalCurriculumAddForm.errors.subjectCurriculumName) ? true : false}
                  error={(digitalCurriculumAddForm.touched.subjectCurriculumName && digitalCurriculumAddForm.errors.subjectCurriculumName) ? digitalCurriculumAddForm.errors.subjectCurriculumName : ""}
                />
              </div>
              <div className="tw-col-span-10 md:tw-col-span-5 lg:tw-col-span-4">
                <SelectInput
                  name="curriculumId"
                  value={digitalCurriculumAddForm.values.curriculumId}
                  onChange={onchangeHandler}
                  menuItems={Array.isArray(masterCurriculumResp)
                    ? masterCurriculumResp
                    : []}
                  valueKey="id"
                  textKey="curriculumName"
                  labelText='Curriculum Type'
                  formgroupClassName="mb-3 "
                  labelClass=' required'
                  invalid={(digitalCurriculumAddForm.touched.curriculumId && digitalCurriculumAddForm.errors.curriculumId) ? true : false}
                  error={(digitalCurriculumAddForm.touched.curriculumId && digitalCurriculumAddForm.errors.curriculumId) ? digitalCurriculumAddForm.errors.curriculumId : ""}
                />
              </div>
              <div className="tw-col-span-10 md:tw-col-span-5 lg:tw-col-span-4">
                <SelectInput
                  name="classId"
                  value={digitalCurriculumAddForm.values.classId}
                  onChange={onchangeHandler}
                  menuItems={Array.isArray(masterClassesResp)
                    ? masterClassesResp
                    : []}
                  valueKey="id"
                  textKey="shortCode"
                  labelText='Class'
                  formgroupClassName="mb-3"
                  labelClass=' required'
                  invalid={(digitalCurriculumAddForm.touched.classId && digitalCurriculumAddForm.errors.classId) ? true : false}
                  error={(digitalCurriculumAddForm.touched.classId && digitalCurriculumAddForm.errors.classId) ? digitalCurriculumAddForm.errors.classId : ""}
                />
              </div>
              {showStreamGroup && (
                <div className="tw-col-span-10 md:tw-col-span-5 lg:tw-col-span-4">
                  <SelectInput
                    name="streamGroupId"
                    value={digitalCurriculumAddForm.values.streamGroupId}
                    onChange={onchangeHandler}
                    menuItems={Array.isArray(masterClassStreamGroupResp)
                      ? masterClassStreamGroupResp
                      : []}
                    valueKey="id"
                    textKey="groupName"
                    labelText="Stream"
                    formgroupClassName="mb-3"
                    labelClass=' required'
                    invalid={(digitalCurriculumAddForm.touched.classId && digitalCurriculumAddForm.errors.classId) ? true : false}
                    error={(digitalCurriculumAddForm.touched.classId && digitalCurriculumAddForm.errors.classId) ? digitalCurriculumAddForm.errors.classId : ""}
                  />
                </div>
              )}
              <div className="tw-col-span-10 md:tw-col-span-5 lg:tw-col-span-4">
                <SelectInput
                  name="subjectId"
                  value={digitalCurriculumAddForm.values.subjectId}
                  onChange={digitalCurriculumAddForm.handleChange}
                  menuItems={Array.isArray(instSubjectNameResp?.content)
                    ? instSubjectNameResp?.content
                    : []}
                  valueKey="id"
                  textKey="subjectName"
                  labelText='Subject'
                  formgroupClassName="mb-3"
                  labelClass=' required'
                  invalid={(digitalCurriculumAddForm.touched.subjectId && digitalCurriculumAddForm.errors.subjectId) ? true : false}
                  error={(digitalCurriculumAddForm.touched.subjectId && digitalCurriculumAddForm.errors.subjectId) ? digitalCurriculumAddForm.errors.subjectId : ""}
                />
              </div>
              <div className="tw-col-span-10 md:tw-col-span-5 lg:tw-col-span-4">
                <CustomSelect
                  name="createdBy"
                  idKey="userId"
                  defaultSelect="Select"
                  value={digitalCurriculumAddForm.values.createdBy}
                  renderValue={renderValueSection}
                  renderOptions={renderOptionsEmployee}
                  onChange={selectSectionHndlr}
                  onSearchHandler={onSearchMultiSelectHandleremployee}
                  labelText='Created By'
                  containerClassName="mb-3"
                  labelClass=' required'
                  options={getEmployeesByFilterResp}
                  invalid={(digitalCurriculumAddForm.touched.createdBy && digitalCurriculumAddForm.errors.createdBy) ? true : false}
                  error={(digitalCurriculumAddForm.touched.createdBy && digitalCurriculumAddForm.errors.createdBy) ? digitalCurriculumAddForm.errors.createdBy : ""}
                />
              </div>
              <div className="tw-col-span-10 md:tw-col-span-5 lg:tw-col-span-4">
                <TextInput
                  name="numberingScheme"
                  value={"U/U.C/U.C.T/U.C.T.S"}
                  onChange={() => { }}
                  labelText="Curriculum Structure"
                  isDisabled={true}
                  formgroupClassName="mb-3"
                  labelClass=" "
                  inputClassName=" "
                />
              </div>
            </div>
            <div className="row mt-2 px-0">
              <div className="col-4 d-flex justify-content-start mt-2 ps-4 pe-2">
                <button
                  onClick={handleSaveDigitalCurriculum}
                  className="tw-bg-gray-100 tw-rounded-lg tw-px-4 tw-py-2"
                >
                  <HugeiconsIcon icon={CircleArrowLeft01Icon} size={20} className="tw-mr-1" /> Cancel
                </button>
              </div>
              <div className="col-8 d-flex justify-content-end my-2 px-0">
                <button
                  type="submit"
                  className="btn btn-outline-primary mx-2 px-4 py-2"
                  style={{ borderRadius: "8px" }}
                  onClick={() => {
                    submitTypeRef.current = "draft";
                  }}
                >
                  <HugeiconsIcon
                    icon={Bookmark03Icon}
                    size={20}
                    color="currentColor"
                    className="me-2"
                  />
                  Save as draft
                </button>
                <button
                  type="submit"
                  className="btn btn-success px-4 py-2"
                  style={{ borderRadius: "8px" }}
                  disabled={showApiLoader}
                  onClick={() => {
                    submitTypeRef.current = "next";
                  }}
                >
                  Next Step
                  <HugeiconsIcon
                    icon={CircleArrowRight01Icon}
                    size={20}
                    color="currentColor"
                    className="ms-1"
                  />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default BasicDetails;
