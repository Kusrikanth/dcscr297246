import { useEffect, useMemo, useRef, useState } from "react";
import { shallowEqual } from "react-redux";
import {
  ArrayHelpers,
  FieldArray,
  FormikProvider,
  useFormik,
} from "formik";
import * as Yup from "yup";

import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02StrokeStandard } from "@hugeicons-pro/core-stroke-standard";

import {
  MultiSelectCheckbox,
  SelectInput,
  TextInput,
} from "../../../../../Components/Common";

import {
  useAppDispatch,
  useAppSelector,
} from "../../../../../hooks/storehook";
import {
  resetBrchClassAct,
} from "../../../../../store/branchsettings/branchacademics/branchacademicsactions";

import { generateActionPayload } from "../../../../../utility/reduxutility";
import { generateUniqueNumber } from "../../../../../utility/commonutility";
import { getAssignCurriculumListAct, getAssignLanClassListAct } from "../../../../../store/assignlanguages/assignlanguagesaction";
import { resetAssignLanClassListAct, resetAssignListCurriculumAct } from "../../../../../store/assignlanguages/assignlanguagesslice";
import { getDisciplineSettingsDomainsAct, saveDisciplineSettingsSubDomainItemByIdAct, updateDisciplineSettingsSubDomainItemByIdAct } from "../../../../../store/examination/pvaReports/pvaReportsActions";

const createEmptySubDomain = () => ({
  subDomainsDetailId: generateUniqueNumber(),
  subDomainName: "",
});

const initialValues = {
  academicYearId: "",
  curriculumId: "",
  domainId: "",
  classIds: [],
  subDomains: [createEmptySubDomain()],
};

const validationSchema = Yup.object({
  academicYearId: Yup.string().required("Academic Year is required"),
  curriculumId: Yup.string().required("Curriculum is required"),
  domainId: Yup.string().required("Domain is required"),
  classIds: Yup.array()
    .min(1, "At least one class is required")
    .required("Class is required"),

  subDomains: Yup.array()
    .of(
      Yup.object({
        subDomainName: Yup.string()
          .trim()
          .required("Sub domain is required"),
      })
    )
    .min(1, "At least one sub domain is required")
    .test(
      "unique-sub-domains",
      "Duplicate sub domains are not allowed",
      (subDomains) => {
        if (!subDomains) {
          return true;
        }

        const normalizedNames = subDomains
          .map((item) =>
            item?.subDomainName?.trim().toLowerCase()
          )
          .filter(Boolean);

        return new Set(normalizedNames).size === normalizedNames.length;
      }
    ),
});

const AddEditSubDomainModal = ({
  toggle,
  editItemId,
}: any) => {
  const dispatch = useAppDispatch();

  const formikArrayHelpers = useRef<ArrayHelpers | null>(null);

  const {
    showApiLoader,
    branchId,
    currentInstIdResp: instituteId,
    academicYearListResp,
    getAssignListCurriculumResp,
    getAssignLanClassListResp,
    getDisciplineSettingsSubDomainItemByIdResp,
    getDisciplineSettingsDomainsResp,
  } = useAppSelector(
    ({
      globalData,
      appData,
      instAcademics,
      assignLanguages,
      pvaReports
    }: any) => ({
      showApiLoader: globalData.showApiLoader,
      branchId: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      academicYearListResp:
        instAcademics.academicYearListResp,
      getAssignListCurriculumResp:
        assignLanguages.getAssignListCurriculumResp,
      getAssignLanClassListResp: assignLanguages.getAssignLanClassListResp,
      getDisciplineSettingsDomainsResp:
        pvaReports.getDisciplineSettingsDomainsResp,
      getDisciplineSettingsSubDomainItemByIdResp:
        pvaReports.getDisciplineSettingsSubDomainItemByIdResp,
    }),
    shallowEqual
  );

  const addEditSubDomainFormik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: false,

    onSubmit: (values) => {
     const {academicYearId,curriculumId,classIds,domainId,subDomains} = values

     if(editItemId){
      let formatedSubDomains = subDomains?.length > 0 ? subDomains?.map((item:any) => item?.subDomainName) : [];

      const payload = {
        subDomainNames:formatedSubDomains,
      }
      dispatch(
        updateDisciplineSettingsSubDomainItemByIdAct(
          generateActionPayload(
            "update_sub_discipline_settings_domain_item_by_id",
            {id:editItemId},
            payload
          )
      ))
     }
     else {
      let formatedClassIds = classIds?.length > 0 ? classIds?.map((item:any) => item?.id) : [];
      let formatedSubDomains = subDomains?.length > 0 ? subDomains?.map((item:any) => item?.subDomainName) : [];

      const payload = {
        instituteId,
        branchId,
        academicYearId,
        curriculumId,
        domainId,
        classIds : formatedClassIds,
        subDomainNames:formatedSubDomains,
      }

      dispatch(
        saveDisciplineSettingsSubDomainItemByIdAct(
          generateActionPayload(
            "save_sub_discipline_settings_domain_item_by_id",
            undefined,
            payload
          )
      ))
     }
    },
  });

  const {
    values,
    errors,
    touched,
    submitCount,
    setFieldValue,
    setValues,
    handleBlur,
    handleChange,
    handleSubmit,
  } = addEditSubDomainFormik;


  const { data: academicYearList } = academicYearListResp || {};
  const { data: curriculumTypes } = getAssignListCurriculumResp || {}

  const classOptions = useMemo(() => {
    if (Array.isArray(getAssignLanClassListResp?.content)) {
      return getAssignLanClassListResp?.content;
    }

    if (Array.isArray(getAssignLanClassListResp?.content)) {
      return getAssignLanClassListResp.content;
    }

    return [];
  }, [getAssignLanClassListResp]);

  const duplicateSubDomainIndexes = useMemo(() => {
    const normalizedMap: Record<string, number[]> = {};

    values.subDomains.forEach((item: any, index: number) => {
      const name = item?.subDomainName?.trim().toLowerCase();
      if (!name) {
        return;
      }

      if (!normalizedMap[name]) {
        normalizedMap[name] = [];
      }

      normalizedMap[name].push(index);
    });

    return Object.values(normalizedMap).flatMap((indexes) =>
      indexes.length > 1 ? indexes : []
    );
  }, [values.subDomains]);

  const {
    content: domainsList,
  } = getDisciplineSettingsDomainsResp || {};

  function fetchCurriculumList(otherProps?: any) {
    const payload = {
      branchId,
      academicYearId:addEditSubDomainFormik.values?.academicYearId,
      pageNo: 0,
      pageSize: 100,
      sortBy: "curriculumName",
      orderBy: "asc",
      ...otherProps,
    }

    dispatch(
      getAssignCurriculumListAct(
        generateActionPayload(
          "get_brch_curriculum",
          undefined,
          payload
        )
      )
    );
  }

  function fetchClassList(otherProps?: any) {
    const {academicYearId, curriculumId} = addEditSubDomainFormik.values
    const payload = {
      branchId,
      academicYearId,
      curriculumId,
      pageNo: 0,
      pageSize: 100,
      sortBy: "classSequence", 
      orderBy: "asc",
      ...otherProps,
    }

    dispatch(
      getAssignLanClassListAct(
        generateActionPayload(
          "get_brch_curriculum_class",
          undefined,
          payload
        )
      )
    );
  }

  function fetchDisciplineDomainsList(otherProps?: any) {
      const payload = {
        branchId,
        academicYearId: addEditSubDomainFormik.values.academicYearId,
        pageNo: 0,
        pageSize: 100,
        orderBy: "asc",
        ...otherProps,
      };
  
      dispatch(
        getDisciplineSettingsDomainsAct(
          generateActionPayload("get_discipline_settings_domains", undefined, payload)
        )
      );
    }

  function filterHandler(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const { name, value } = event.target;

    if (name === "academicYearId") {
      setValues((previousValues) => ({
        ...previousValues,
        academicYearId: value,
        curriculumId: "",
        domainId: "",
        classIds: [],
      }));

      dispatch(resetBrchClassAct(undefined));

      if (value) {
        fetchCurriculumList({academicYearId: value});
        fetchDisciplineDomainsList({academicYearId: value});
      } else {
        dispatch(resetAssignListCurriculumAct(undefined));
      }

      return;
    }

    if (name === "curriculumId") {
      setValues((previousValues) => ({
        ...previousValues,
        curriculumId: value,
        classIds: [],
      }));

      if (value) {
        fetchClassList({
          curriculumId: value,
        });
      } else {
        dispatch(resetAssignLanClassListAct(undefined));
      }

      return;
    }

    setFieldValue(name, value);
  }

  function addNewSubDomain() {
    formikArrayHelpers.current?.push(
      createEmptySubDomain()
    );
  }

  function removeSubDomain(index: number) {
    if (values.subDomains.length <= 1) {
      return;
    }

    formikArrayHelpers.current?.remove(index);
  }

  function onSelectClassHndlr(
    selectedOptions: { classId: string; shortName: string }[],
    config?: { name: string }
  ) {
    const { name } = config || {};
    if (Array.isArray(selectedOptions) && selectedOptions.length > 0) {
      addEditSubDomainFormik.setFieldValue(name!, selectedOptions);
    } else {
      addEditSubDomainFormik.setFieldValue(name!, []);
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


  useEffect(() => {
    const yearId = academicYearListResp &&
      academicYearListResp.data.find(
        (year: any) => year.yearStatus.toLowerCase() === "current"
      )?.academicYearId;

      addEditSubDomainFormik.setFieldValue("academicYearId", yearId)
      fetchCurriculumList({academicYearId:yearId})
      fetchDisciplineDomainsList({academicYearId:yearId})
  },[])
  useEffect(() => {
    if(editItemId && getDisciplineSettingsSubDomainItemByIdResp){

      const {academicYearId,curriculumId,classId,className,domainId,subDomains,
      } = getDisciplineSettingsSubDomainItemByIdResp || {}

      if(curriculumId){
        fetchClassList({curriculumId:curriculumId})
      }

      setFieldValue("academicYearId",academicYearId)
      setFieldValue("curriculumId",curriculumId)
      setFieldValue("domainId",domainId)
      setFieldValue(
        "classIds",
        classId
          ? [{ id: classId, shortName: className, branchShortName: className }]
          : []
      )
      setFieldValue(
        "subDomains",
        Array.isArray(subDomains) && subDomains.length > 0
          ? subDomains
          : [createEmptySubDomain()]
      )

    }
  },[getDisciplineSettingsSubDomainItemByIdResp,editItemId])

  return (
    <div style={{ padding: "1.25rem" }}>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-12 col-lg-6">
            <SelectInput
              name="academicYearId"
              value={values.academicYearId}
              onChange={filterHandler}
              onBlur={handleBlur}
              menuItems={academicYearList}
              valueKey="academicYearId"
              textKey="academicYearName"
              labelText="Academic Year"
              labelClass="required"
              isDisabled={Boolean(editItemId)}
              invalid={Boolean(
                touched.academicYearId &&
                errors.academicYearId
              )}
              error={
                touched.academicYearId &&
                errors.academicYearId
                  ? errors.academicYearId
                  : ""
              }
            />
          </div>

          <div className="col-12 col-lg-6">
            <SelectInput
              name="curriculumId"
              value={values.curriculumId}
              onChange={filterHandler}
              onBlur={handleBlur}
              menuItems={curriculumTypes}
              valueKey="branchCurriculumId"
              textKey="curriculumName"
              labelText="Curriculum"
              labelClass="required"
              isDisabled={Boolean(editItemId)}
              invalid={Boolean(
                touched.curriculumId &&
                errors.curriculumId
              )}
              error={
                touched.curriculumId &&
                errors.curriculumId
                  ? errors.curriculumId
                  : ""
              }
            />
          </div>

          <div className="col-12 col-lg-6 mb-3">
            <MultiSelectCheckbox
              name="classIds"
              idKey="id"
              labelText="Classes"
              value={values.classIds}
              onChange={onSelectClassHndlr}
              options={classOptions}
              searchKey="branchShortName"
              labelClass="required"
              renderValue={renderSelectedClass}
              renderOptions={renderOptionClass}
              isDisabled={Boolean(editItemId)}
              invalid={Boolean(
                touched.classIds &&
                errors.classIds
              )}
              error={
                touched.classIds &&
                errors.classIds
                  ? errors.classIds
                  : ""
              }
            />
          </div>

          <div className="col-12 col-lg-6">
            <SelectInput
              name="domainId"
              value={values.domainId}
              onChange={handleChange}
              onBlur={handleBlur}
              menuItems={domainsList}
              valueKey="id"
              textKey="domainName"
              labelText="Domain"
              labelClass="required"
              isDisabled={Boolean(editItemId)}
              invalid={Boolean(
                touched.domainId &&
                errors.domainId
              )}
              error={
                touched.domainId &&
                errors.domainId
                  ? errors.domainId
                  : ""
              }
            />
          </div>

          <div className="col-12 mb-3">
            <FormikProvider
              value={addEditSubDomainFormik}
            >
              <FieldArray name="subDomains">
                {(arrayHelpers: ArrayHelpers) => {
                  formikArrayHelpers.current =
                    arrayHelpers;

                  return (
                    <>
                      {values.subDomains.map(
                        (item, index) => {
                          const itemErrors =
                            Array.isArray(
                              errors.subDomains
                            )
                              ? errors.subDomains[index]
                              : undefined;

                          const itemTouched =
                            Array.isArray(
                              touched.subDomains
                            )
                              ? touched.subDomains[index]
                              : undefined;

                          const subDomainError =
                            typeof itemErrors ===
                              "object" &&
                            itemErrors !== null
                              ? itemErrors.subDomainName
                              : "";

                          const isSubDomainTouched =
                            typeof itemTouched ===
                              "object" &&
                            itemTouched !== null
                              ? itemTouched.subDomainName
                              : false;

                          const hasDuplicateSubDomain =
                            duplicateSubDomainIndexes.includes(index);

                          const duplicateSubDomainError =
                            hasDuplicateSubDomain &&
                            item.subDomainName?.trim()
                              ? "Duplicate sub domains are not allowed"
                              : "";

                          const showSubDomainError =
                            Boolean(
                              (isSubDomainTouched && subDomainError) ||
                                (duplicateSubDomainError &&
                                  (isSubDomainTouched || submitCount > 0))
                            );

                          return (
                            <div
                              key={
                                item.subDomainsDetailId ??
                                item.subDomainsDetailId ??
                                index
                              }
                              className="mb-3 row align-items-end"
                            >
                              <div className="col-10">
                                <TextInput
                                  name={`subDomains[${index}].subDomainName`}
                                  value={
                                    item.subDomainName
                                  }
                                  onChange={
                                    handleChange
                                  }
                                  onBlur={handleBlur}
                                  formgroupClassName="mb-0"
                                  invalid={Boolean(
                                    showSubDomainError
                                  )}
                                  error={
                                    showSubDomainError
                                      ? duplicateSubDomainError ||
                                        String(subDomainError)
                                      : ""
                                  }
                                  labelText={
                                    index === 0
                                      ? "Sub Domains"
                                      : ""
                                  }
                                  labelClass={
                                    index === 0
                                      ? "required"
                                      : ""
                                  }
                                />
                              </div>

                              <div className="col-2 d-flex align-items-center">
                                {values.subDomains
                                  .length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      removeSubDomain(
                                        index
                                      )
                                    }
                                    className="btn-sm btn-icon btn-rounded btn-hover-danger btn btn-white"
                                    aria-label={`Remove sub domain ${
                                      index + 1
                                    }`}
                                  >
                                    <HugeiconsIcon
                                      icon={
                                        Delete02StrokeStandard
                                      }
                                      className="text-danger"
                                      size={18}
                                    />
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        }
                      )}

                      <div className="row">
                        <div className="col-12">
                          <button
                            type="button"
                            className="btn btn-outline-primary btn-sm"
                            onClick={
                              addNewSubDomain
                            }
                          >
                            Add New
                          </button>
                        </div>
                      </div>
                    </>
                  );
                }}
              </FieldArray>
            </FormikProvider>
          </div>
        </div>

        <div className="row mt-3">
          <div className="d-flex ms-auto w-auto">
            <button
              type="button"
              className="btn btn-light me-3"
              onClick={toggle}
              disabled={showApiLoader}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn btn-success"
              disabled={showApiLoader}
            >
              {editItemId
                ? "Update"
                : "Submit"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddEditSubDomainModal;
