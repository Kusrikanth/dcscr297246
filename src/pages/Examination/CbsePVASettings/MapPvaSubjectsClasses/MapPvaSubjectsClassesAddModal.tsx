import React, { useRef, useEffect, useState } from "react";
import { useFormik, ArrayHelpers } from "formik";
import * as Yup from "yup";
import { generateUniqueNumber } from "../../../../utility/commonutility";
import { InputCheckbox, MultiSelectCheckbox, SelectInput, TextArea, TextInput } from "../../../../Components/Common";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { getAssignCurriculumListAct } from "../../../../store/assignlanguages/assignlanguagesaction";
import { getBranchClassAct } from "../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { getIgseTermNameListAct } from "../../../../store/examination/examinationsettings/examinationsettingsaction";
import { getPvaSkillAreaAct, getPvaSubjectsAct, savePvaSubjectsClassesMappingAct, updatePvaSubjectsClassesMappingAct } from "../../../../store/examination/pvaReports/pvaReportsActions";
import { setPvaSkillAreaAct } from "../../../../store/examination/pvaReports/pvaReportsSlice";
import { renderOptionsEmployee, renderValueStaff } from "./helper";
import { getTeacherList } from "../../../../store/academic/classroomManagment/classroommanagmentactions";
import { getEmployeeCategoriesAct, getEmployeeStatusAct } from "../../../../store/masterdata/masterdataactions";

interface MapPvaSubjectsClassesFormValues {
  academicYearId: string;
  curriculumId: string;
  pvaSubject: string;
  termId: string;
  classIds: { classId: string; shortName: string }[];
  teacherIds: any[];
  MapPvaSubjectsClasses: {
    uniqueId: number;
    skillAreaId: number | null;
    MapPvaSubjectsClassesName: string;
    description: string;
  }[];
}


const initialValues = {
  academicYearId: "",
  curriculumId: "",
  pvaSubject: "",
  termId: "",
  classIds: [],
  teacherIds: [],
  MapPvaSubjectsClasses: [
    {
      uniqueId: Number(generateUniqueNumber()),
      skillAreaId: null,
      MapPvaSubjectsClassesName: "",
      description: "",
    },
  ],
};
const validationSchema = Yup.object().shape({
  academicYearId: Yup.string().nullable().required("Academic Year is required"),
  curriculumId: Yup.string().nullable().required("Curriculum is required"),
  pvaSubject: Yup.string().nullable().required("Subject is required"),
  termId: Yup.string().nullable().required("Term is required"),
  classIds: Yup.array()
    .of(
      Yup.object().shape({
        classId: Yup.string().required(),
        shortName: Yup.string().nullable(),
      })
    )
    .min(1, "At least one Class must be selected"),
  teacherIds: Yup.array()
    .of(
      Yup.object().shape({
        id: Yup.number().required(),
        employeeName: Yup.string().nullable(),
        employeeCode: Yup.string().nullable(),
      })
    )
    .min(1, "At least one Teacher must be selected"),

})

const MapPvaSubjectsClassesAddModal = (props: any) => {
  const [selectedClassIds, setSelectedClassIds] = useState([]);
  const [selectedTeachers, setSelectedTeachers] = useState<any>([]);

  const dispatch = useAppDispatch();

  const getCurriculumApiCall = (otherProps?: any) => {
    const payload1 = { branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", ...otherProps };
    dispatch(getAssignCurriculumListAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
  }

  function fetchTermList(otherProps?: any) {
    const payload = {
      branchId,
      curriculumId: mapPvaSubjectsClassesNameFormik.values.curriculumId,
      ...otherProps,
    };

    dispatch(
      getIgseTermNameListAct(
        generateActionPayload("get_igse_term_name_list", undefined, payload)
      )
    );
  }
  function fetchClassNamesList(otherProps?: any) {
    const { academicYearId, curriculumId } = mapPvaSubjectsClassesNameFormik.values;
    if (!academicYearId || !curriculumId) return;

    const payload = {
      branchId,
      academicYearId,
      curriculumId,
      sortBy: "classSequence",
      orderBy: "asc",
      pageNo: 0,
      pageSize: 100,
      ...otherProps,
    };

    dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
  }
  const getPvaSubjectListApiCall = (otherProps?: any) => {
    const payload = {
      branchId,
      curriculumId: mapPvaSubjectsClassesNameFormik.values.curriculumId,
      ...otherProps,
    }
    dispatch(getPvaSubjectsAct(generateActionPayload("get_pva_subjects", undefined, payload)));
  }

  const getPvaSkillAreaListApiCall = (otherProps?: any) => {
    const payload = {
      branchId,
      curriculumId: mapPvaSubjectsClassesNameFormik.values.curriculumId,
      pvaSubjectId: mapPvaSubjectsClassesNameFormik.values.pvaSubject,
      pageNo: 0,
      pageSize: 200,
      ...otherProps,
    }
    dispatch(getPvaSkillAreaAct(generateActionPayload("get_pva_skill_attributes", undefined, payload)));
  }

  function getTeachers(otherProps?: any) {
    const statusID = employeeStatusResp?.find((status: any) => status.empStatusName.toLowerCase() === 'active')?.id;
    const categoryID = employeeCategoriesResp?.find((category: any) => category.categoryName.toLowerCase() === 'teachers')?.employeeCategoryId;    

    const academicYearId = otherProps?.academicYearId || mapPvaSubjectsClassesNameFormik.values.academicYearId;

    if (academicYearId && branchId) {
      const params = {
        branchId,
        pageNo: 0,
        pageSize: 2000,
        status: statusID,
        employeeCategoryId: categoryID,
        // searchString: searchString,
        masterAcademicYearId: academicYearId,
        ...otherProps
      };

      dispatch(getTeacherList(generateActionPayload("get_employees", undefined, params)));
    }
  }
  const {
    academicYearListResp,
    showApiLoader,
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    branchClassResp,
    getPvaSubjectResp,
    getPvaSubjecttoClassMappingByIdResp,
    getPvaSkillAreaResp,
    getAssignListCurriculumResp,
    getIgseTermNameListResp,
    employeeStatusResp,
    teacherListResp,
    employeeCategoriesResp
  } = useAppSelector(({ classroomManagmentInfo, examinationSettings, instAcademics, appData, assignLanguages, globalData, pvaReports, branchAcademics, masterData }) => ({
    academicYearListResp: instAcademics.academicYearListResp,
    currentBranchIdResp: appData.currentBranchIdResp,
    currentInstIdResp: appData.currentInstIdResp,
    branchClassResp: branchAcademics.branchClassResp,
    getPvaSubjectResp: pvaReports.getPvaSubjectResp,
    getPvaSubjecttoClassMappingByIdResp: pvaReports.getPvaSubjecttoClassMappingByIdResp,
    getPvaSkillAreaResp: pvaReports.getPvaSkillAreaResp,
    getAssignListCurriculumResp: assignLanguages.getAssignListCurriculumResp,
    showApiLoader: globalData.showApiLoader,
    getIgseTermNameListResp: examinationSettings.getIgseTermNameListResp,
    teacherListResp: classroomManagmentInfo.teacherListResp,
    employeeStatusResp: masterData.employeeStatusResp,
    employeeCategoriesResp: masterData.employeeCategoriesResp,


  }), shallowEqual);

  const mapPvaSubjectsClassesNameFormik = useFormik<MapPvaSubjectsClassesFormValues>({
    enableReinitialize: true,
    initialValues,
    validationSchema,
    onSubmit: (values) => {      
      if (props?.id) {
        const classes = (values.classIds || []).map((cls: any) => ({
          classId: Number(cls.classId),
          skillAreas: (values.MapPvaSubjectsClasses || []).map((sa: any) => ({
            skillAreaId: sa.skillAreaId || sa.id,
          })),
        }));
        const selectedTeacherIds = Array.isArray(values.teacherIds)
          ? values.teacherIds.map((cls: any) => cls.id)
          : [];


        const editPayload = {
          skillAreas: (values.MapPvaSubjectsClasses || []).map((sa: any) => ({
            skillAreaId: sa.skillAreaId || sa.id,
          })),
          teacherIds: selectedTeacherIds
        };
        dispatch(
          updatePvaSubjectsClassesMappingAct(
            generateActionPayload(
              "update_pva_subjects_classes_mapping",
              { id: props.id },
              editPayload
            )
          )
        );
      } else {
        const selectedSkillAreaIds = values.MapPvaSubjectsClasses
        .filter((item: any) => item.skillAreaId)
          .map((item: any) => item.skillAreaId);

        const selectedClassIds = Array.isArray(values.classIds)
          ? values.classIds.map((cls: any) => cls.classId)
          : [];
        
        const selectedTeacherIds = Array.isArray(values.teacherIds)
          ? values.teacherIds.map((cls: any) => cls.id)
          : [];

        const payload = {
          academicYearId: values.academicYearId,
          branchId,
          branchCurriculumId: values.curriculumId,
          termId: values.termId,
          pvaSubjectId: values.pvaSubject,
          classIds: selectedClassIds,
          skillAreaIds: selectedSkillAreaIds,
          teacherIds: selectedTeacherIds,
        };

        dispatch(
          savePvaSubjectsClassesMappingAct(
            generateActionPayload(
              "save_pva_subjects_classes_mapping",
              undefined,
              payload
            )
          )
        );
      }
    },
  });

  useEffect(() => {
          dispatch(getEmployeeCategoriesAct(generateActionPayload("get_employee_categories")));
          dispatch(getEmployeeStatusAct(generateActionPayload("get_employee_status")))
      }, [])

  useEffect(() => {
    if (props.id && getPvaSubjecttoClassMappingByIdResp) {
      const data = getPvaSubjecttoClassMappingByIdResp;

     
      const classList = data.classId ? [{
        classId: String(data.classId),
        shortName: data.className || "",
      }] : [];

      const teacherList = data.pvaTeachers.length > 0 ? data.pvaTeachers.map((item: any) => ({ id: item.teacherId, employeeName: item.teacherName, employeeCode: item.teacherCode })) : [];

  
      const skillAreas = Array.isArray(data.skillAreas) ? data.skillAreas : [];

      const mappedSkillAreas =
        skillAreas.length > 0
          ? skillAreas.map((skill: any) => ({
            uniqueId: Number(generateUniqueNumber()),
            skillAreaId: skill.skillAreaId,
            MapPvaSubjectsClassesName: skill.skillAreaName,
            description: "",
          }))
          : [
            {
              uniqueId: Number(generateUniqueNumber()),
              skillAreaId: null,
              MapPvaSubjectsClassesName: "",
              description: "",
            },
          ];

      mapPvaSubjectsClassesNameFormik.setValues({
        academicYearId: data.academicYearId ? String(data.academicYearId) : "",
        curriculumId: data.curriculumId ? String(data.curriculumId) : "",
        termId: data.termId ? String(data.termId) : "",
        pvaSubject: data.pvaSubjectId ? String(data.pvaSubjectId) : "",
        classIds: classList,
        teacherIds: teacherList,
        MapPvaSubjectsClasses: mappedSkillAreas,
      });
    }
  }, [props.id, getPvaSubjecttoClassMappingByIdResp]);

  useEffect(() => {
    const selectedAcademicYearId = mapPvaSubjectsClassesNameFormik.values.academicYearId;
    if (selectedAcademicYearId && !props.id && employeeCategoriesResp && employeeStatusResp) {
      getCurriculumApiCall({ academicYearId: selectedAcademicYearId });
      getTeachers({ masterAcademicYearId: selectedAcademicYearId });
      mapPvaSubjectsClassesNameFormik.setFieldValue("curriculumId", "");
    }
    else if (selectedAcademicYearId && props.id && employeeCategoriesResp && employeeStatusResp) {
      getCurriculumApiCall({ academicYearId: selectedAcademicYearId });
      getTeachers({ masterAcademicYearId: selectedAcademicYearId });
    }
  }, [mapPvaSubjectsClassesNameFormik.values.academicYearId, props.id, employeeCategoriesResp, employeeStatusResp]);

  useEffect(() => {
    if (mapPvaSubjectsClassesNameFormik.values.curriculumId) {
      getPvaSubjectListApiCall();
    }
  }, [mapPvaSubjectsClassesNameFormik.values.curriculumId]);

  useEffect(() => {
    if (Array.isArray(teacherListResp)) {
      setSelectedTeachers(teacherListResp);
    }
  }, [teacherListResp]);

  useEffect(() => {
    if (mapPvaSubjectsClassesNameFormik.values.curriculumId && mapPvaSubjectsClassesNameFormik.values.pvaSubject) {
      getPvaSkillAreaListApiCall();
    }
  }, [mapPvaSubjectsClassesNameFormik.values.curriculumId, mapPvaSubjectsClassesNameFormik.values.pvaSubject]);

  useEffect(() => {
    if (academicYearListResp?.data?.length && !mapPvaSubjectsClassesNameFormik.values.academicYearId) {
      const currentAcademicYear = academicYearListResp.data.find(
        (year: any) => year.yearStatus === "CURRENT"
      );

      if (currentAcademicYear) {
        mapPvaSubjectsClassesNameFormik.setFieldValue("academicYearId", currentAcademicYear.academicYearId);
      }
    }
  }, [academicYearListResp]);

  useEffect(() => {
    if (
      getAssignListCurriculumResp?.data?.length &&
      !mapPvaSubjectsClassesNameFormik.values.curriculumId
    ) {
      const cbseCurriculum = getAssignListCurriculumResp.data.find(
        (item: any) => item.curriculumShortName?.toLowerCase() === "cbse"
      );

      if (cbseCurriculum) {
        mapPvaSubjectsClassesNameFormik.setFieldValue("curriculumId", cbseCurriculum.branchCurriculumId);
      }
    }
  }, [getAssignListCurriculumResp]);

  useEffect(() => {
    const selectedCurriculumId = mapPvaSubjectsClassesNameFormik.values.curriculumId;

    if (selectedCurriculumId) {
      if (!mapPvaSubjectsClassesNameFormik.values.termId) {
        mapPvaSubjectsClassesNameFormik.setFieldValue("termId", "");
      }

      fetchTermList();
    }
  }, [mapPvaSubjectsClassesNameFormik.values.curriculumId]);

  useEffect(() => {
    if (branchClassResp?.content?.length) {
      const classes = branchClassResp.content.map((item: any) => ({
        classId: item.id,
        shortName: item.shortName
      }));

      setSelectedClassIds(classes);
    } else {
      setSelectedClassIds([]);
    }
  }, [branchClassResp]);
  useEffect(() => {
    const { curriculumId, academicYearId } = mapPvaSubjectsClassesNameFormik.values;
    if (!props.id && curriculumId && academicYearId) {
      mapPvaSubjectsClassesNameFormik.setFieldValue("classIds", []); // reset previous selection
      fetchClassNamesList();
    }
  }, [props.id, mapPvaSubjectsClassesNameFormik.values.curriculumId, mapPvaSubjectsClassesNameFormik.values.academicYearId]);

  useEffect(() => {
    return () => {
      dispatch(setPvaSkillAreaAct(undefined));
    }
  }, []);

  function onSearchMultiSelectHandleremployee(name:any , value: string) {
        if (value) {
            const params = { searchString: value };
            getTeachers({ ...params, masterAcademicYearId: mapPvaSubjectsClassesNameFormik.values.academicYearId });
        }
    }

  function renderSelectedClass(
    selectedItems: Array<{ classId: string; shortName: string }>
  ): JSX.Element | null {
    if (Array.isArray(selectedItems)) {
      return (
        <div className="text-truncate">
          {selectedItems.map((item, index) => {
            return (
              item?.shortName + (index !== selectedItems.length - 1 ? ", " : "")
            );
          })}
        </div>
      );
    }
    return null;
  }

  function renderOptionClass(item: { shortName: string }): string {
    return item.shortName;
  }

  function onSelectClassHndlr(
    selectedOptions: { classId: string; shortName: string }[],
    config?: { name: string }
  ) {
    const { name } = config || {};
    if (Array.isArray(selectedOptions) && selectedOptions.length > 0) {
      mapPvaSubjectsClassesNameFormik.setFieldValue(name!, selectedOptions);
    } else {
      mapPvaSubjectsClassesNameFormik.setFieldValue(name!, null);
    }
  }

  function selectTeacherHndlr(selectedOptions: any, config?: any) {
      const { name, actionItem, actionType } = config;
      if (Array.isArray(selectedOptions) && selectedOptions.length > 0) {
        mapPvaSubjectsClassesNameFormik.setFieldValue(name, selectedOptions);
      } else {
        mapPvaSubjectsClassesNameFormik.setFieldValue(name, []);
      }
    }

  const { data: curriculumTypes } = getAssignListCurriculumResp || {}

  return (
    <>
      <form onSubmit={mapPvaSubjectsClassesNameFormik.handleSubmit}>
        <div className="">
          <div className="row px-4 pt-3">
            <div className="col-12 col-md-6">
              <SelectInput
                name="academicYearId"
                labelText="Academic Year"
                value={mapPvaSubjectsClassesNameFormik.values.academicYearId}
                onChange={mapPvaSubjectsClassesNameFormik.handleChange}
                menuItems={academicYearListResp?.data}
                valueKey="academicYearId"
                textKey="academicYearName"
                labelClass="required"
                isDisabled={props?.id}
                invalid={(mapPvaSubjectsClassesNameFormik.touched.academicYearId && mapPvaSubjectsClassesNameFormik.errors.academicYearId) ? true : false}
                error={(mapPvaSubjectsClassesNameFormik.touched.academicYearId && mapPvaSubjectsClassesNameFormik.errors.academicYearId) ? mapPvaSubjectsClassesNameFormik.errors.academicYearId : ""}
              />
            </div>
            <div className="col-12 col-md-6">
              <SelectInput
                name="curriculumId"
                labelText="Curriculum"
                value={mapPvaSubjectsClassesNameFormik.values.curriculumId}
                onChange={mapPvaSubjectsClassesNameFormik.handleChange}
                menuItems={curriculumTypes}
                valueKey="branchCurriculumId"
                textKey="curriculumName"
                labelClass="required"
                isDisabled={props?.id}
                invalid={(mapPvaSubjectsClassesNameFormik.touched.curriculumId && mapPvaSubjectsClassesNameFormik.errors.curriculumId) ? true : false}
                error={(mapPvaSubjectsClassesNameFormik.touched.curriculumId && mapPvaSubjectsClassesNameFormik.errors.curriculumId) ? mapPvaSubjectsClassesNameFormik.errors.curriculumId : ""}
              />
            </div>
            <div className="col-12 col-md-6">
              <SelectInput
                name="termId"
                value={mapPvaSubjectsClassesNameFormik.values.termId}
                onChange={mapPvaSubjectsClassesNameFormik.handleChange}
                onBlur={mapPvaSubjectsClassesNameFormik.handleBlur}
                menuItems={
                  Array.isArray(getIgseTermNameListResp?.data)
                    ? getIgseTermNameListResp?.data
                    : []
                }
                valueKey="termId"
                textKey="termName"
                labelText="Term"
                isDisabled={props?.id}
                labelClass="required"
                invalid={
                  !!(
                    mapPvaSubjectsClassesNameFormik.touched.termId &&
                    mapPvaSubjectsClassesNameFormik.errors.termId
                  )
                }
                error={
                  mapPvaSubjectsClassesNameFormik.touched.termId &&
                    mapPvaSubjectsClassesNameFormik.errors.termId
                    ? mapPvaSubjectsClassesNameFormik.errors.termId
                    : ""
                }
              />
            </div>
            <div className="col-12 col-md-6">
              <SelectInput
                name="pvaSubject"
                labelText="PVA Subject"
                value={mapPvaSubjectsClassesNameFormik.values.pvaSubject}
                onChange={mapPvaSubjectsClassesNameFormik.handleChange}
                menuItems={Array.isArray(getPvaSubjectResp) ? getPvaSubjectResp : []}
                valueKey="id"
                textKey="pvaSubjectName"
                labelClass="required"
                isDisabled={props?.id}
                invalid={(mapPvaSubjectsClassesNameFormik.touched.pvaSubject && mapPvaSubjectsClassesNameFormik.errors.pvaSubject) ? true : false}
                error={(mapPvaSubjectsClassesNameFormik.touched.pvaSubject && mapPvaSubjectsClassesNameFormik.errors.pvaSubject) ? mapPvaSubjectsClassesNameFormik.errors.pvaSubject : ""}
              />
            </div>
            <div className="col-12 ">
              <MultiSelectCheckbox
                name = "teacherIds"
                idKey="id"
                labelText="Teachers"
                labelClass="required"
                value={mapPvaSubjectsClassesNameFormik.values.teacherIds}
                renderValue={renderValueStaff}
                renderOptions={renderOptionsEmployee}
                onChange={selectTeacherHndlr}
                searchKey="employeeName"
                containerClassName="mb-3"
                onSearchHandler={onSearchMultiSelectHandleremployee}
                options={selectedTeachers}
                invalid={!!(mapPvaSubjectsClassesNameFormik.touched.teacherIds && mapPvaSubjectsClassesNameFormik.errors.teacherIds)}
                error={mapPvaSubjectsClassesNameFormik.touched.teacherIds ? mapPvaSubjectsClassesNameFormik.errors.teacherIds : ""}
              ></MultiSelectCheckbox>
            </div>
            <div className="col-12 mt-md-0 mb-3">
              <MultiSelectCheckbox
                name="classIds"
                idKey="classId"
                labelText="Classes"
                labelClass="required"
                value={mapPvaSubjectsClassesNameFormik.values.classIds}
                renderValue={renderSelectedClass}
                renderOptions={renderOptionClass}
                onChange={onSelectClassHndlr}
                searchKey="shortName"
                options={selectedClassIds}
                invalid={
                  !!(
                    mapPvaSubjectsClassesNameFormik.touched.classIds &&
                    mapPvaSubjectsClassesNameFormik.errors.classIds
                  )
                }
                error={
                  mapPvaSubjectsClassesNameFormik.touched.classIds &&
                    mapPvaSubjectsClassesNameFormik.errors.classIds
                    ? mapPvaSubjectsClassesNameFormik.errors.classIds
                    : ""
                }
                isDisabled={props?.id}

              />
            </div>
          </div>
          <div className="row bg-light px-3 py-3 mb-2 mx-0 align-items-center">
            <div className="col-6 d-flex align-items-center">
              {getPvaSkillAreaResp?.content?.[0]?.skillAreas?.length > 0 && (
                <InputCheckbox
                  name="selectAllSkillAreas"
                  value={(() => {
                    const allSkills = getPvaSkillAreaResp.content[0].skillAreas;
                    const selectedSkills = mapPvaSubjectsClassesNameFormik.values.MapPvaSubjectsClasses;
                    
                    return allSkills.length > 0 && 
                           allSkills.every((skill: any) => 
                             selectedSkills.some((selected: any) => selected.skillAreaId === skill.id)
                           );
                  })()}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const allSkills = getPvaSkillAreaResp.content[0].skillAreas;
                    
                    if (e.target.checked) {
                      const selectedSkills = allSkills.map((skill: any) => ({
                        uniqueId: Number(generateUniqueNumber()),
                        skillAreaId: skill.id,
                        MapPvaSubjectsClassesName: skill.name,
                        description: skill.description || "",
                      }));
                      mapPvaSubjectsClassesNameFormik.setFieldValue("MapPvaSubjectsClasses", selectedSkills);
                    } else {
                      mapPvaSubjectsClassesNameFormik.setFieldValue("MapPvaSubjectsClasses", []);
                    }
                  }}
                />
              )}
              <h6 className="mb-0 form-label required">Skill Area</h6>
            </div>
          </div>
          <div className="row px-4">
            <div className="col-12 mt-2">
              {getPvaSkillAreaResp?.content?.[0]?.skillAreas?.length > 0 ? (
                getPvaSkillAreaResp.content[0].skillAreas.map((skill: any) => {
                  const isChecked = mapPvaSubjectsClassesNameFormik.values.MapPvaSubjectsClasses.some(
                    (item: any) => item.skillAreaId === skill.id
                  );

                  return (
                    <InputCheckbox
                      key={skill.id}
                      name={`MapPvaSubjectsClasses[${skill.id}]`}
                      labelName={skill.name}
                      value={isChecked}
                      dataId={skill.id}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const updatedSkills = [...mapPvaSubjectsClassesNameFormik.values.MapPvaSubjectsClasses];

                        if (e.target.checked) {
                          const isAlreadySelected = updatedSkills.some(
                            (item) => item.skillAreaId === skill.id
                          );
                          
                          if (!isAlreadySelected) {
                            updatedSkills.push({
                              uniqueId: Number(generateUniqueNumber()),
                              skillAreaId: skill.id,
                              MapPvaSubjectsClassesName: skill.name,
                              description: skill.description || "",
                            });
                          }
                        } else {
                          const index = updatedSkills.findIndex(
                            (item) => item.skillAreaId === skill.id
                          );
                          if (index !== -1) updatedSkills.splice(index, 1);
                        }

                        mapPvaSubjectsClassesNameFormik.setFieldValue(
                          "MapPvaSubjectsClasses",
                          updatedSkills
                        );
                      }}
                    />

                  );
                })
              ) : (
                <div className="text-muted">No skill areas available for this PVA Subject</div>
              )}
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

export default MapPvaSubjectsClassesAddModal;
