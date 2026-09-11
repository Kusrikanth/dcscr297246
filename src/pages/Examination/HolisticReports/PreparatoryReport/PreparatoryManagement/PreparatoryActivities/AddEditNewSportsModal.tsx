import React, { useRef, useEffect, Suspense, useState } from "react";
import { FieldArray, useFormik, FormikProvider, ArrayHelpers } from "formik";
import * as Yup from "yup";
import { shallowEqual } from "react-redux";
import { generateUniqueNumber } from "../../../../../../utility/commonutility";
import { useAppDispatch, useAppSelector } from "../../../../../../hooks/storehook";
import { getActivityBranchAct, getActivityClassAct, getActivityByIdAct, getHolisticDomainModelAct, saveHolisticActivityAct, updateHolisticActivityAct, getInstituteClassAct, getClassesByStageAct, savePreparatoryActivityAct, updatePreparatoryActivityAct, getPreparatoryDomainAct, getPreparatoryActivityByIdAct, copyPreparatoryActivityAct } from "../../../../../../store/examination/examinationsettings/examinationsettingsaction";
import { generateActionPayload } from "../../../../../../utility/reduxutility";
import { MultiSelectCheckbox, QuillEditor, SelectInput, TextArea, TextInput } from "../../../../../../Components/Common";
import BreadCrumb from "../../../../../../Components/Common/BreadCrumb";
import { renderOptionsClass, renderOptionsEmployee, renderValueClass, renderValueSection } from "./helper";
import { setActivityBranchAct, setActivityClassAct, setPreparatoryActivityByIdAct } from "../../../../../../store/examination/examinationsettings/examinationsettingsslice";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";

const initialValues = {
  academicYearId: "",
  notes: "",
  domain: "",
  description: "",
  title: "",
  classId: "",
  learningOutcome: "",
  awarenessBeginner: "",
  awarenessProficient: "",
  awarenessAdvanced: "",
  sensitivityBeginner: "",
  sensitivityProficient: "",
  sensitivityAdvanced: "",
  creativityBeginner: "",
  creativityProficient: "",
  creativityAdvanced: "",
  instituteDetails: [
    {
      uniqueId: generateUniqueNumber(),
      instituteId: null,
      branchId: null,
      classId: null,
      classResponse: null,
      branchResponse: null

    },
  ],
  term: [
    {
      uniqueId: generateUniqueNumber(),
      question: "",
    },
  ]
};

const validationSchema = (showInstituteAdminUI: boolean) =>
  Yup.object().shape({
    title: Yup.string().nullable().required("Title is required"),
    description: Yup.string().nullable().required("Description is required"),
    learningOutcome: Yup.string().nullable().required("Learning Outcome is required"),
    instituteDetails: Yup.array().of(
      Yup.object().shape({
        instituteId: Yup.mixed()
          .nullable()
          .when([], {
            is: () => showInstituteAdminUI,
            then: (schema) => schema.required("Institute is required"),
            otherwise: (schema) => schema.nullable(),
          }),
        branchId: Yup.mixed()
          .nullable()
          .when([], {
            is: () => showInstituteAdminUI,
            then: (schema) => schema.required("Branch is required"),
            otherwise: (schema) => schema.nullable(),
          }),
        classId: Yup.mixed()
          .nullable()
          .when([], {
            is: () => showInstituteAdminUI,
            then: (schema) => schema.required("Class is required"),
            otherwise: (schema) => schema.nullable(),
          }),
      })
    ),
  });


const AddEditNewSportsModal = () => {
  const dispatch = useAppDispatch();
  const formikArrayHelpers = useRef<ArrayHelpers | null>(null);
  const instituteArrayHelpers = useRef<ArrayHelpers | null>(null);
  const history = useHistory<any>();
  const [uniqueId, setUniqueId] = useState("");

  const {
    showApiLoader,
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    getHolisticDomainModelResp,
    instituteListResp,
    getActivityBranchResp,
    academicYearListResp,
    getInstituteClassResp,
    getPreparatoryActivityByIdResp,
    getClassesByStageResp,
    loggedInUserRole,
    virtualRoleResp,
    savePreparatoryActivityResp,
    updatePreparatoryActivityResp,
    cbseExaminationErrorAct,
    getPreparatoryDomainResp,
    copyPreparatoryActivityResp
  } = useAppSelector(({ examinationSettings, appData, globalData, instituteInfo, instAcademics }) => ({
    currentBranchIdResp: appData.currentBranchIdResp,
    currentInstIdResp: appData.currentInstIdResp,
    showApiLoader: globalData.showApiLoader,
    getHolisticDomainModelResp: examinationSettings.getHolisticDomainModelResp,
    instituteListResp: instituteInfo.instituteListResp,
    getActivityBranchResp: examinationSettings.getActivityBranchResp,
    academicYearListResp: instAcademics.academicYearListResp,
    getInstituteClassResp: examinationSettings.getInstituteClassResp,
    getPreparatoryActivityByIdResp: examinationSettings.getPreparatoryActivityByIdResp,
    loggedInUserRole: appData.loggedInUserRole,
      virtualRoleResp: appData.virtualRoleResp,
    getClassesByStageResp: examinationSettings.getClassesByStageResp,
    savePreparatoryActivityResp: examinationSettings.savePreparatoryActivityResp,
      updatePreparatoryActivityResp: examinationSettings.updatePreparatoryActivityResp,
      cbseExaminationErrorAct: examinationSettings.cbseExaminationErrorAct,
            getPreparatoryDomainResp: examinationSettings.getPreparatoryDomainResp,
            copyPreparatoryActivityResp: examinationSettings.copyPreparatoryActivityResp

  }), shallowEqual);

  const showInstituteAdminUI = loggedInUserRole === 'INSTITUTE_ADMIN' && !virtualRoleResp;

  
    const sportsNamesRef = useRef({
      prevSavePreparatoryActivityResp: savePreparatoryActivityResp,
      prevUpdatePreparatoryActivityResp: updatePreparatoryActivityResp,
      prevCbseExaminationErrorAct: cbseExaminationErrorAct,
      prevCopyPreparatoryActivityResp: copyPreparatoryActivityResp
    });
  
   useEffect(() => {
      const {
        prevSavePreparatoryActivityResp,
        prevUpdatePreparatoryActivityResp,
        prevCbseExaminationErrorAct,
        prevCopyPreparatoryActivityResp
      } = sportsNamesRef.current;
     if (
        cbseExaminationErrorAct &&
        cbseExaminationErrorAct !== prevCbseExaminationErrorAct
      ) {
        const { details } = cbseExaminationErrorAct;
        toast.error(details || "Something went wrong");
      }
     else  if (
        savePreparatoryActivityResp &&
        savePreparatoryActivityResp !== prevSavePreparatoryActivityResp
      ) {
       toast.success("Activity added successfully");
             if(showInstituteAdminUI){
               history.push("/preparatory-activity-management")
             }
             else {
               history.push("/preparatory-management")
             }
      } else if (
        updatePreparatoryActivityResp &&
        updatePreparatoryActivityResp !== prevUpdatePreparatoryActivityResp
      ) {
       toast.success(" Activity updated successfully");
             if(showInstituteAdminUI){
               history.push("/preparatory-activity-management")
             }
             else {
               history.push("/preparatory-management")
             }
      }
      else if (
        copyPreparatoryActivityResp &&
        copyPreparatoryActivityResp !== prevCopyPreparatoryActivityResp
      ) {
       toast.success(" Activity copied successfully");
       history.push("/preparatory-activity-management")

      }
  
      sportsNamesRef.current.prevSavePreparatoryActivityResp = savePreparatoryActivityResp;
      sportsNamesRef.current.prevUpdatePreparatoryActivityResp = updatePreparatoryActivityResp;
      sportsNamesRef.current.prevCbseExaminationErrorAct = cbseExaminationErrorAct;
      sportsNamesRef.current.prevCopyPreparatoryActivityResp = copyPreparatoryActivityResp;
    }, [
      savePreparatoryActivityResp,
      updatePreparatoryActivityResp,
      cbseExaminationErrorAct,
      copyPreparatoryActivityResp
    ]);

  const termNameFormik = useFormik({
      initialValues,
      validationSchema: validationSchema(showInstituteAdminUI),
      onSubmit: (values) => {
        const assessmentRubric = {
          awareness: [
            {
              type: "beginner",
              title: "Beginner",
              description: values.awarenessBeginner || ""
            },
            {
              type: "proficient",
              title: "Proficient",
              description: values.awarenessProficient || ""
            },
            {
              type: "advanced",
              title: "Advanced",
              description: values.awarenessAdvanced || ""
            }
          ],
          sensitivity: [
            {
              type: "beginner",
              title: "Beginner",
              description: values.sensitivityBeginner || ""
            },
            {
              type: "proficient",
              title: "Proficient",
              description: values.sensitivityProficient || ""
            },
            {
              type: "advanced",
              title: "Advanced",
              description: values.sensitivityAdvanced || ""
            }
          ],
          creativity: [
            {
              type: "beginner",
              title: "Beginner",
              description: values.creativityBeginner || ""
            },
            {
              type: "proficient",
              title: "Proficient",
              description: values.creativityProficient || ""
            },
            {
              type: "advanced",
              title: "Advanced",
              description: values.creativityAdvanced || ""
            }
          ]
        };
  
        const termDetailsDTOS = values.term
          .filter((ele) => ele.question)
          .map((ele) => ele.question);
  
        const allBranchIds: number[] = [];
        const allClassSequences: number[] = [];
  
        values.instituteDetails.forEach((detail) => {
          if (detail.branchId) {
            const branchIds = Array.isArray(detail.branchId)
              ? (detail.branchId as any[]).map((branch: any) => branch.branchId)
              : [detail.branchId];
            allBranchIds.push(...branchIds);
          }
  
          if (detail.classId) {
            const classSequences = Array.isArray(detail.classId)
              ? (detail.classId as any[]).map((classItem: any) => classItem.classSequence)
              : [detail.classId];
            allClassSequences.push(...classSequences);
          }
        });
  
        const classSequences =
          showInstituteAdminUI ? Array.isArray(values?.instituteDetails?.[0]?.classId)
            ? (values.instituteDetails[0].classId as any[]).map((cls: any) => cls.classSequence)
            : [] : Array.isArray(values?.classId) ? values.classId.map((cls: any) => cls.classSequence) : [];
  
        const payload = {
          domainId: values.domain,
          academicYearId: values.academicYearId,
          title: values.title,
          description: values.description,
          learningOutcome: values.learningOutcome,
          notes: values.notes,
          questions: termDetailsDTOS,
          assessmentRubric,
          institutes: values.instituteDetails.map((inst) => ({
            instituteId: showInstituteAdminUI ? Number(inst.instituteId) : instituteId,
            branchIds: showInstituteAdminUI ? Array.isArray(inst.branchId)
              ? (inst.branchId as any[]).map((b: any) => b.branchId)
              : inst.branchId
                ? [inst.branchId]
                : [] : [branchId],
            classSequences: showInstituteAdminUI ? Array.isArray(inst.classId)
              ? (inst.classId as any[]).map((c: any) => c.classSequence)
              : inst.classId
                ? [inst.classId]
                : [] : Array.isArray(values.classId) ? values.classId.map((cls: any) => cls.classSequence) : []
          }))
        };
        const payload1 = {
          domainId: values.domain,
          academicYearId: values.academicYearId,
          title: values.title,
          description: values.description,
          learningOutcome: values.learningOutcome,
          notes: values.notes,
          questions: termDetailsDTOS,
          assessmentRubric,
          classSequences
        };
        const payload2 = values.instituteDetails.map((inst) => ({
            academicYearId: values.academicYearId,
            instituteId: showInstituteAdminUI ? Number(inst.instituteId) : instituteId,
            branchIds: showInstituteAdminUI ? Array.isArray(inst.branchId)
              ? (inst.branchId as any[]).map((b: any) => b.branchId)
              : inst.branchId
                ? [inst.branchId]
                : [] : [branchId],
            classSequences: showInstituteAdminUI ? Array.isArray(inst.classId)
              ? (inst.classId as any[]).map((c: any) => c.classSequence)
              : inst.classId
                ? [inst.classId]
                : [] : Array.isArray(values.classId) ? values.classId.map((cls: any) => cls.classSequence) : []
          }))
  
        if (history.location.state?.id) {
          if(history.location.state?.isCopy){
            dispatch(
              copyPreparatoryActivityAct(
                generateActionPayload("copy_preparatory_activity", { id: history.location.state.id }, payload2)
              )
            );
          }
          else{
            dispatch(
              updatePreparatoryActivityAct(
                generateActionPayload("update_preparatory_activity", { id: history.location.state.id }, payload1)
              )
            );
          }
        } else {
          dispatch(
            savePreparatoryActivityAct(
              generateActionPayload("save_preparatory_activity", undefined, payload)
            )
          );
        }
      },
    });

  useEffect(() => {
    const yearId =
      academicYearListResp &&
      academicYearListResp.data.find(
        (year: any) => year.yearStatus.toLowerCase() === "current"
      )?.academicYearId;

    termNameFormik.setFieldValue("academicYearId", yearId);
  }, [academicYearListResp]);

  useEffect(() => {
    if (termNameFormik.values.academicYearId) {
      getCurriculumClassApiCall({
        academicYearId: termNameFormik.values.academicYearId,
      });
    }
  }, [termNameFormik.values.academicYearId]);

  const getHolisticDomainApiCall = (otherProps?: any) => {
   dispatch(
      getPreparatoryDomainAct(
        generateActionPayload("get_preparatory_domain", undefined, {})
      )
    );
  };

  useEffect(() => {
    getHolisticDomainApiCall();
    return () => {
      dispatch(setActivityBranchAct(undefined));
      dispatch(setActivityClassAct(undefined));
      dispatch(setPreparatoryActivityByIdAct(undefined));
    };
  }, []);

  useEffect(() => {
    if (getActivityBranchResp && getInstituteClassResp) {
      const findIdx = termNameFormik.values.instituteDetails?.findIndex((item: any) => item.uniqueId === uniqueId);
      if (findIdx !== -1) {
        termNameFormik.setFieldValue(`instituteDetails[${findIdx}].branchResponse`, getActivityBranchResp);
        termNameFormik.setFieldValue(`instituteDetails[${findIdx}].classResponse`, getInstituteClassResp);
      }
    }
  }, [getActivityBranchResp, getInstituteClassResp])

  useEffect(() => {
    if (history.location.state?.id) {
      dispatch(getPreparatoryActivityByIdAct(generateActionPayload("get_preparatory_activity_by_id", { id: history.location.state.id }, {})));
    }
  }, [history.location.state?.id]);

  useEffect(() => {
    if (history.location.state?.id && getPreparatoryActivityByIdResp) {
      const data = getPreparatoryActivityByIdResp

      if (data) {
        const uniqueIdGenerated = generateUniqueNumber();
        setUniqueId(uniqueIdGenerated);

        fetchBranchesForInstituteApiCall({ instituteIds: data?.instituteId });
        if(showInstituteAdminUI){
        fetchClassesForInstituteApiCall({ instituteIds: data?.instituteId, academicYearId: data?.academicYearId });
        }
        else {
          getCurriculumClassApiCall({ academicYearId: data?.academicYearId });
        }

        const awarenessData = data?.assessmentRubric?.awareness || [];
        const sensitivityData = data?.assessmentRubric?.sensitivity || [];
        const creativityData = data?.assessmentRubric?.creativity || [];

        const selectedClasses = data?.classes?.map((cls: any) => ({
          classId: cls.instituteClassId,
          className: cls.className,
          classShortCode: cls.classShortName,
          classSequence: cls.classSequence,
          instituteClassId: cls.instituteClassId
        })) || [];

        termNameFormik.setValues({
          academicYearId: data?.academicYearId || "",
          notes: data?.notes || "",
          description: data?.description || "",
          domain: data?.domainId || "",
          title: data?.title || "",
          classId: selectedClasses,
          learningOutcome: data?.learningOutcome || "",
          awarenessBeginner: awarenessData.find((item: any) => item.type === "beginner")?.description || "",
          awarenessProficient: awarenessData.find((item: any) => item.type === "proficient")?.description || "",
          awarenessAdvanced: awarenessData.find((item: any) => item.type === "advanced")?.description || "",
          sensitivityBeginner: sensitivityData.find((item: any) => item.type === "beginner")?.description || "",
          sensitivityProficient: sensitivityData.find((item: any) => item.type === "proficient")?.description || "",
          sensitivityAdvanced: sensitivityData.find((item: any) => item.type === "advanced")?.description || "",
          creativityBeginner: creativityData.find((item: any) => item.type === "beginner")?.description || "",
          creativityProficient: creativityData.find((item: any) => item.type === "proficient")?.description || "",
          creativityAdvanced: creativityData.find((item: any) => item.type === "advanced")?.description || "",
          term: data?.questions?.map((d: any) => ({ uniqueId: generateUniqueNumber(), question: d })) || [],
          instituteDetails: [
            {
              uniqueId: uniqueIdGenerated,
              instituteId: data?.instituteId ?? null,
              branchId: data?.branchId ?? null,
              classId: selectedClasses,
              classResponse: null,
              branchResponse: null
            }
          ]
        });
      }
    }
  }, [history.location.state?.id, getPreparatoryActivityByIdResp]);

  useEffect(() => {
    if (getActivityBranchResp && getInstituteClassResp && uniqueId) {
      const findIdx = termNameFormik.values.instituteDetails?.findIndex((item: any) => item.uniqueId === uniqueId);
      if (findIdx !== -1) {
        termNameFormik.setFieldValue(`instituteDetails[${findIdx}].branchResponse`, getActivityBranchResp);
        termNameFormik.setFieldValue(`instituteDetails[${findIdx}].classResponse`, getInstituteClassResp);

        if (history.location.state?.id) {
          const currentBranchId = termNameFormik.values.instituteDetails[findIdx].branchId;
          if (currentBranchId && getActivityBranchResp) {
            const branchObj = getActivityBranchResp.find((b: any) => b.branchId === currentBranchId);
            if (branchObj) {
              termNameFormik.setFieldValue(`instituteDetails[${findIdx}].branchId`, [branchObj]);
            }
          }
        }
      }
    }
  }, [getActivityBranchResp, getInstituteClassResp, uniqueId]);



  function addNewInstituteDetailHndlr(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    if (instituteArrayHelpers.current) {
      instituteArrayHelpers.current.push({
        uniqueId: generateUniqueNumber(),
        instituteId: null,
        branchId: null,
        classId: null,
        classResponse: null,
        branchResponse: null
      });
    }
  }

  function removeInstituteDetailHndlr(event: React.MouseEvent<HTMLButtonElement>) {
    const rowIndex = event.currentTarget.getAttribute("data-index");
    if (rowIndex !== undefined || rowIndex !== null) {
      instituteArrayHelpers.current?.remove(Number(rowIndex));
    }
  }

  function addNewDepartmentHndlr(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    if (formikArrayHelpers.current) {
      formikArrayHelpers.current.push({
        uniqueId: generateUniqueNumber(),
        question: "",
      });
    }
  }

  function removeDepartmentHndlr(event: React.MouseEvent<HTMLButtonElement>) {
    const rowIndex = event.currentTarget.getAttribute("data-index");
    if (rowIndex !== undefined || rowIndex !== null) {
      formikArrayHelpers.current?.remove(Number(rowIndex));
    }
  }

  const onChangeQuillHndlr = (content: any) => {
    termNameFormik.setFieldValue("description", content);
  };

  const fetchBranchesForInstituteApiCall = (params: any) => {
    const payload = {
      pageSize: 100,
      pageNo: 0,
      instituteIds: params.instituteIds || params,
    };

    dispatch(
      getActivityBranchAct(
        generateActionPayload("get_activity_branch", undefined, payload)
      )
    );
  };

  const fetchClassesForInstituteApiCall = (params: any) => {
    const yearId =
      academicYearListResp &&
      academicYearListResp.data.find(
        (year: any) => year.yearStatus.toLowerCase() === "current"
      )?.academicYearId;
    const payload: any = {
      instituteIds: params.instituteIds || params,
      stageId: "2",
    };
    dispatch(
      getInstituteClassAct(
        generateActionPayload("get_institute_class", undefined, payload)
      )
    );
  };

  const getCurriculumClassApiCall = (otherProps?: any) => {
    const payload = {
      branchId: branchId,
      academicYearId: termNameFormik.values.academicYearId,
      stageId: 2,
      ...otherProps,
    };

    dispatch(getClassesByStageAct(generateActionPayload("get_classes_by_stage", undefined, payload)));
  };


  const handleInstituteChange = (selectedOption: any, index: number, uniqueId?: any) => {
    termNameFormik.setFieldValue(`instituteDetails[${index}].instituteId`, selectedOption);
    termNameFormik.setFieldValue(`instituteDetails[${index}].branchId`, null);
    termNameFormik.setFieldValue(`instituteDetails[${index}].classId`, null);

    if (selectedOption) {
      setUniqueId(uniqueId)
      fetchBranchesForInstituteApiCall(selectedOption);
      fetchClassesForInstituteApiCall(selectedOption);
    }
  };

  const handleBranchChange = (selectedOptions: any, index: number) => {
    termNameFormik.setFieldValue(`instituteDetails[${index}].branchId`, selectedOptions);
  };

  const handleClassChange = (selectedOptions: any, index: number) => {
    termNameFormik.setFieldValue(`instituteDetails[${index}].classId`, selectedOptions);
  };

  function selectStudentHndlr(selectedOptions: number | number[], config?: any) {
    const { name } = config;
    if (Array.isArray(selectedOptions) && selectedOptions.length > 0) {
      termNameFormik.setValues((prevState) => ({ ...prevState, [name]: selectedOptions }));
    } else {
      termNameFormik.setValues((prevState) => ({ ...prevState, [name]: null }));
    }
  }

  return (
    <>
      <form onSubmit={termNameFormik.handleSubmit}>
        <div className="page-content">
          <div className="container-fluid">
            <BreadCrumb title="Examination" pageTitle="Examination" />

            <div className="card">
              <div className="card-header">
                <div className="row align-items-center">
                  <div className="col-6">
                    <h4 className="card-title mb-0 flex-grow-1">{history.location.state?.isCopy ? "Copy Activity" : history.location.state?.id  ? "Edit Activities" : "Add Activities"}</h4>
                  </div>
                </div>
              </div>
              <div className="card-body p-0">
                <div className="row px-4 pt-3">
                  {!showInstituteAdminUI &&
                    (<>
                      <div className="col-4">
                        <SelectInput
                          name="academicYearId"
                          value={termNameFormik.values.academicYearId}
                          onChange={termNameFormik.handleChange}
                          menuItems={academicYearListResp?.data}
                          valueKey="academicYearId"
                          textKey="academicYearName"
                          formgroupClassName="mb-0"
                          labelText="Academic Year"
                          isDisabled={history.location.state?.id}
                          invalid={termNameFormik.touched.domain && termNameFormik.errors.domain ? true : false}
                          error={termNameFormik.touched.domain && termNameFormik.errors.domain ? termNameFormik.errors.domain : ""}
                        />
                      </div>
                    </>)}
                  <div className={`${!showInstituteAdminUI ? "col-4" : "col-6"}`}>
                    <SelectInput
                      name="domain"
                      value={termNameFormik.values.domain}
                      onChange={termNameFormik.handleChange}
                      menuItems={getPreparatoryDomainResp || []}
                      valueKey="id"
                      textKey="name"
                      labelText="Domain"
                      isDisabled={history.location.state?.id}
                      invalid={termNameFormik.touched.domain && termNameFormik.errors.domain ? true : false}
                      error={termNameFormik.touched.domain && termNameFormik.errors.domain ? termNameFormik.errors.domain : ""}
                    />
                  </div>
                  {showInstituteAdminUI &&
                    (<>
                      <div className="bg-light py-3 px-4">

                        <div className="row  flex-nowrap justify-content-center ">
                          <div className="col-12 d-flex">
                            <div className="row w-100">

                              <div className="col-3 ">
                                <h6 className="mb-0">Institute</h6>
                              </div>
                              <div className="col-3 ">
                                <h6 className="mb-0">Branch</h6>
                              </div>
                              <div className="col-4 ">
                                <h6 className="mb-0">Class</h6>
                              </div>
                              <div className="col d-grid mt-0">
                                <div className="hstack">
                                  {(!history.location.state?.id || history.location.state?.isCopy === true) && (
                                    <button
                                      onClick={addNewInstituteDetailHndlr}
                                      className="btn-sm ms-3 btn-icon btn btn-outline-primary"
                                      type="button"
                                    >
                                      <i className="ri-add-line fs-18" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>

                          </div>
                        </div>
                      </div>

                      <div className="row px-4">
                        <div className="col-12 mt-2">
                          <FormikProvider value={termNameFormik}>
                            <FieldArray name="instituteDetails">
                              {(arrayHelpers: ArrayHelpers) => {
                                if (!instituteArrayHelpers.current) {
                                  instituteArrayHelpers.current = arrayHelpers;
                                }
                                return (
                                  <>
                                    {termNameFormik.values.instituteDetails.length > 0 &&
                                      termNameFormik.values.instituteDetails.map(
                                        (detail: any, index: any) => {
                                          const inputFieldErrors: any = termNameFormik.errors.instituteDetails && termNameFormik.errors.instituteDetails[index] || {};
                                          const inputFieldTouched = termNameFormik.touched.instituteDetails && termNameFormik.touched.instituteDetails[index] || {};

                                          return (
                                            <div
                                              key={detail.uniqueId}
                                              className="row g-3 mb-3 align-items-start"
                                            >
                                              <div className="col-3">
                                                <SelectInput
                                                  name={`instituteDetails[${index}].instituteId`}
                                                  value={detail.instituteId}
                                                  onChange={(e: any) => handleInstituteChange(e.target.value, index, detail.uniqueId)}
                                                  menuItems={instituteListResp?.data || []}
                                                  valueKey="id"
                                                  textKey="instituteName"
                                                  isDisabled={history.location.state?.id && !history.location.state?.isCopy} // Disable in edit mode
                                                  invalid={(inputFieldTouched.instituteId && inputFieldErrors.instituteId) ? true : false}
                                                  error={(inputFieldTouched.instituteId && inputFieldErrors.instituteId) ? inputFieldErrors.instituteId : ""}
                                                />
                                              </div>
                                              <div className="col-3">
                                                <MultiSelectCheckbox
                                                  name={`instituteDetails[${index}].branchId`}
                                                  idKey="branchId"
                                                  defaultSelect="Select Branches"
                                                  value={detail.branchId}
                                                  renderValue={(selectedItems: any, removeItemHandler: any) =>
                                                    renderValueSection(selectedItems, removeItemHandler, history.location.state?.id || !detail.instituteId)
                                                  }
                                                  renderOptions={renderOptionsEmployee}
                                                  onChange={(selectedOptions: any) => handleBranchChange(selectedOptions, index)}
                                                  containerClassName="mb-0"
                                                  options={Array.isArray(detail?.branchResponse) ? detail?.branchResponse : []}
                                                  isDisabled={history.location.state?.id && !history.location.state?.isCopy  || !detail.instituteId}
                                                  invalid={(inputFieldTouched.branchId && inputFieldErrors.branchId) ? true : false}
                                                  error={(inputFieldTouched.branchId && inputFieldErrors.branchId) ? inputFieldErrors.branchId : ""}
                                                />
                                              </div>
                                              <div className="col-4">
                                                <MultiSelectCheckbox
                                                  name={`instituteDetails[${index}].classId`}
                                                  idKey="classSequence"
                                                  defaultSelect="Select Classes"
                                                  value={detail.classId}
                                                  renderValue={renderValueClass}
                                                  renderOptions={renderOptionsClass}
                                                  onChange={(selectedOptions: any) => handleClassChange(selectedOptions, index)}
                                                  containerClassName="mb-0"
                                                  options={Array.isArray(detail?.classResponse) ? detail?.classResponse : []}
                                                  isDisabled={!detail.instituteId}

                                                  invalid={(inputFieldTouched.classId && inputFieldErrors.classId) ? true : false}
                                                  error={(inputFieldTouched.classId && inputFieldErrors.classId) ? inputFieldErrors.classId : ""}
                                                />
                                              </div>
                                              <div className="col d-flex align-items-center">
                                                <div className="hstack">
                                                  {index !== 0 && !history.location.state?.id && (
                                                    <button
                                                      data-index={index}
                                                      onClick={removeInstituteDetailHndlr}
                                                      className="btn-sm btn-icon btn-rounded btn-hover-danger btn btn-white"
                                                      type="button"
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
                    </>)
                  }
                  {!showInstituteAdminUI &&
                    (<>
                      <div className="col-4">
                        <MultiSelectCheckbox
                          name="classId"
                          idKey="classSequence"
                          defaultSelect="Select Classes"
                          value={termNameFormik.values.classId}
                          renderValue={renderValueClass}
                          renderOptions={renderOptionsClass}
                          onChange={selectStudentHndlr}
                          containerClassName="mb-0"
                          options={Array.isArray(getClassesByStageResp) ? getClassesByStageResp : []}
                          labelText="Class"

                        />
                      </div>
                    </>)}
                  <div className="col-12">
                    <TextInput
                      name="title"
                      onChange={termNameFormik.handleChange}
                      value={termNameFormik.values.title}
                      labelText="Title"
                      invalid={(termNameFormik.touched.title && termNameFormik.errors.title) ? true : false}
                      error={(termNameFormik.touched.title && termNameFormik.errors.title) ? termNameFormik.errors.title : ""}
                      labelClass='required'
                      maxLength={500}
                      isDisabled={history.location.state?.isCopy}
                    />
                  </div>
                  <div className="col-12">
                    <Suspense fallback={<div>Loading...</div>}>
                      <QuillEditor
                        name="description"
                        value={termNameFormik.values.description}
                        onChange={onChangeQuillHndlr}
                        invalid={(termNameFormik.touched.description && termNameFormik.errors.description) ? true : false}
                        error={(termNameFormik.touched.description && termNameFormik.errors.description) ? termNameFormik.errors.description : ""}
                        labelText="Description"
                        labelClass='required'
                        isReadOnly={history.location.state?.isCopy}
                      />
                    </Suspense>
                  </div>
                  <div className="col-6">
                    <TextArea
                      name="learningOutcome"
                      onChange={termNameFormik.handleChange}
                      value={termNameFormik.values.learningOutcome}
                      labelText="Learning Outcome"
                      invalid={(termNameFormik.touched.learningOutcome && termNameFormik.errors.learningOutcome) ? true : false}
                      error={(termNameFormik.touched.learningOutcome && termNameFormik.errors.learningOutcome) ? termNameFormik.errors.learningOutcome : ""}
                      labelClass='required'
                      isDisabled={history.location.state?.isCopy}
                    />
                  </div>
                  <div className="col-6">
                    <TextArea
                      name="notes"
                      onChange={termNameFormik.handleChange}
                      value={termNameFormik.values.notes}
                      labelText="Notes"
                      isDisabled={history.location.state?.isCopy}
                      invalid={(termNameFormik.touched.notes && termNameFormik.errors.notes) ? true : false}
                      error={(termNameFormik.touched.notes && termNameFormik.errors.notes) ? termNameFormik.errors.notes : ""}
                    />
                  </div>
                </div>



                {/* Assessment Criteria Table */}
                <div className="row px-4">
                  <div className="col-12 mt-4">
                    <h6 className="form-label mb-3">Assessment Criteria</h6>
                    <div className="table-responsive">
                      <table className="table table-bordered">
                        <thead className="table-light">
                          <tr>
                            <th style={{ minWidth: '120px' }}>Domain</th>
                            <th style={{ minWidth: '250px' }}>Beginner</th>
                            <th style={{ minWidth: '250px' }}>Proficient</th>
                            <th style={{ minWidth: '250px' }}>Advanced</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="align-top fw-medium">Awareness</td>
                            <td>
                              <TextArea
                                name="awarenessBeginner"
                                onChange={termNameFormik.handleChange}
                                value={termNameFormik.values.awarenessBeginner || ''}
                                placeHolder="Identifies object but gives little or no explanation."
                                height="20px"
                                isDisabled={history.location.state?.isCopy}
                              />
                            </td>
                            <td>
                              <TextArea
                                name="awarenessProficient"
                                onChange={termNameFormik.handleChange}
                                value={termNameFormik.values.awarenessProficient || ''}
                                placeHolder="Explains how to use the object with teacher's support."
                                height="20px"
                                isDisabled={history.location.state?.isCopy}
                              />
                            </td>
                            <td>
                              <TextArea
                                name="awarenessAdvanced"
                                onChange={termNameFormik.handleChange}
                                value={termNameFormik.values.awarenessAdvanced || ''}
                                placeHolder="Explains both use and importance of the object independently."
                                height="20px"
                                isDisabled={history.location.state?.isCopy}
                              />
                            </td>
                          </tr>
                          <tr>
                            <td className="align-top fw-medium">Sensitivity</td>
                            <td>
                              <TextArea
                                name="sensitivityBeginner"
                                onChange={termNameFormik.handleChange}
                                value={termNameFormik.values.sensitivityBeginner || ''}
                                placeHolder="Speaks softly or hesitantly, needs prompts."
                                height="20px"
                                isDisabled={history.location.state?.isCopy}
                              />
                            </td>
                            <td>
                              <TextArea
                                name="sensitivityProficient"
                                onChange={termNameFormik.handleChange}
                                value={termNameFormik.values.sensitivityProficient || ''}
                                placeHolder="Speaks with some confidence, uses simple sentences."
                                height="20px"
                                isDisabled={history.location.state?.isCopy}
                              />
                            </td>
                            <td>
                              <TextArea
                                name="sensitivityAdvanced"
                                onChange={termNameFormik.handleChange}
                                value={termNameFormik.values.sensitivityAdvanced || ''}
                                placeHolder="Speaks confidently, makes eye contact, answers peer questions."
                                height="20px"
                                isDisabled={history.location.state?.isCopy}
                              />
                            </td>
                          </tr>
                          <tr>
                            <td className="align-top fw-medium">Creativity</td>
                            <td>
                              <TextArea
                                name="creativityBeginner"
                                onChange={termNameFormik.handleChange}
                                value={termNameFormik.values.creativityBeginner || ''}
                                placeHolder="Uses single words or short phrases."
                                height="20px"
                                isDisabled={history.location.state?.isCopy}
                              />
                            </td>
                            <td>
                              <TextArea
                                name="creativityProficient"
                                onChange={termNameFormik.handleChange}
                                value={termNameFormik.values.creativityProficient || ''}
                                placeHolder="Connects object to daily life."
                                height="20px"
                                isDisabled={history.location.state?.isCopy}
                              />
                            </td>
                            <td>
                              <TextArea
                                name="creativityAdvanced"
                                onChange={termNameFormik.handleChange}
                                value={termNameFormik.values.creativityAdvanced || ''}
                                placeHolder="Adds extra detail or personal story."
                                height="20px"
                                isDisabled={history.location.state?.isCopy}
                              />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Questions Section */}
                <div className="row bg-light px-3 py-3 mb-2 mx-0">
                  <div className="col-10 d-flex align-items-center">
                    <h6 className="mb-0 form-label">Questions</h6>
                  </div>
                  <div className="col d-grid mt-0">
                    <div className="hstack">
                      {!history.location.state?.id && (
                        <button
                          onClick={addNewDepartmentHndlr}
                          className="btn-sm ms-3 btn-icon btn btn-outline-primary"
                          type="button"
                        >
                          <i className="ri-add-line fs-18" />
                        </button>
                      )}
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
                                    const inputFieldErrors: any = termNameFormik.errors.term && termNameFormik.errors.term[index] || {};
                                    const inputFieldTouched = termNameFormik.touched.term && termNameFormik.touched.term[index] || {};
                                    return (
                                      <div
                                        key={term.uniqueId}
                                        className="row g-3 mb-3"
                                      >
                                        <div className="col-11">
                                          <TextInput
                                            name={`term[${index}].question`}
                                            formgroupClassName="mb-0"
                                            value={term.question}
                                            onChange={termNameFormik.handleChange}
                                            invalid={(inputFieldTouched.question && inputFieldErrors.question) ? true : false}
                                            error={(inputFieldTouched.question && inputFieldErrors.question) ? inputFieldErrors.question : ""}
                                            maxLength={500}
                                            isDisabled={history.location.state?.isCopy}
                                          />
                                        </div>
                                        <div className="col-1 d-flex">
                                          <div className="hstack">
                                            {index !== 0 && (
                                              <button
                                                data-index={index}
                                                onClick={removeDepartmentHndlr}
                                                className="btn-sm btn-icon btn-rounded btn-hover-danger btn btn-white"
                                                type="button"
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
                    onClick={() => history.goBack()}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-success px-4" disabled={showApiLoader}>
                    {history.location.state?.isCopy ? "Copy" : history.location.state?.id ? "Update" : "Save"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default AddEditNewSportsModal;