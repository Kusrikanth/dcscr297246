import { ArrayHelpers, FieldArray, FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import { useState, useRef, useEffect } from "react";
import {
  MultiSelectCheckbox,
  SelectInput,
  TextArea,
  TextInput,
} from "../../../../../Components/Common";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Delete02StrokeStandard,
  PlusSignIcon,
} from "@hugeicons-pro/core-stroke-standard";
import { generateUniqueNumber } from "../../../../../utility/commonutility";
import { shallowEqual } from "react-redux";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
import {
  getSportsAttributeListAct,
  getSportsByClassesListAct,
  getSportsClassMappingListAct,
  getSportsDiscriptionsListAct,
  getSportsGradeListAct,
  getSportsNamesAct,
  getSubAttributeItemsListAct,
  getSubAttributesCommonListAct,
  setSaveSportsDiscriptionsItemsAct,
} from "../../../../../store/examination/examinationSports/examinationSportsActions";
import { generateActionPayload } from "../../../../../utility/reduxutility";
import {
  getBranchCurriculumAct,
  resetBrchClassAct,
  resetBrchCurriculumAct,
} from "../../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { getIgseTermNameListAct } from "../../../../../store/examination/examinationsettings/examinationsettingsaction";

const initialValues = {
  academicYearId: "",
  curriculumId: "",
  termId: "",
  sportsId: "",
  mainAttributeId: "",
  sportsClassId: "",

  subAttributesDescription: [
    {
      id: generateUniqueNumber(),
      subAttributesId: "",
      subAttributeName:"",
      gradeAndDescriptionRequestDTOList: [
        {
          id: generateUniqueNumber(),
          psGradeId: "",
          description: "",
        },
      ],
    },
  ],
};

const validationSchema = Yup.object().shape({
  academicYearId: Yup.string().required("Academic Year is required"),
  curriculumId: Yup.string().required("Curriculum is required"),
  termId: Yup.string().required("Term is required"),
  sportsId: Yup.string().required("Sports is required"),
  mainAttributeId: Yup.string().required("Main Attribute is required"),
  sportsClassId: Yup.array().min(1, "Class is required.").required("Class is required.").nullable(),

  subAttributesDescription: Yup.array().of(
    Yup.object().shape({
      subAttributesId: Yup.string()
        .required("Sub Attribute is required")
        .nullable()
        .test(
          "unique-subAttributesId",
          "This Sub Attribute is already chosen",
          function (value) {
            const { subAttributesDescription } = this.options.context || {};
            if (!value || !subAttributesDescription) return true;

            const currentPath = this.path;
            const currentIndexMatch = currentPath.match(
              /subAttributesDescription\[(\d+)\]/
            );
            const currentIndex = currentIndexMatch
              ? parseInt(currentIndexMatch[1])
              : -1;

            const duplicateCount = subAttributesDescription.filter(
              (s: any, idx: number) =>
                s.subAttributesId === value && idx !== currentIndex
            ).length;

            return duplicateCount === 0;
          }
        ),

      gradeAndDescriptionRequestDTOList: Yup.array().of(
        Yup.object().shape({
          psGradeId: Yup.string()
            .required("Grade is required")
            .test(
              "unique-psGradeId",
              "This Grade is already chosen",
              function (value) {
                const { parent, from } = this as any;

                const currentArray =
                  from?.[1]?.value?.gradeAndDescriptionRequestDTOList || [];

                const currentPath = this.path;
                const currentIndexMatch = currentPath.match(
                  /gradeAndDescriptionRequestDTOList\[(\d+)\]/
                );
                const currentIndex = currentIndexMatch
                  ? parseInt(currentIndexMatch[1])
                  : -1;

                const duplicateCount = currentArray.filter(
                  (g: any, idx: number) =>
                    g.psGradeId === value && idx !== currentIndex
                ).length;

                return duplicateCount === 0;
              }
            ),

          description: Yup.string().required("Description is required"),
        })
      ),
    })
  ),
});

const AddEditSportsAttributeDescriptionModal = ({
  isOpen,
  toggle,
  editItemId,
}) => {
  const addEditSportsAttDesFormik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema,
    onSubmit: (values) => {
      const {
        academicYearId,
        curriculumId,
        termId,
        sportsId,
        mainAttributeId,
        sportsClassId,
        subAttributesDescription,
      } = values;

      const seledtedClassIds = Array.isArray(sportsClassId) ? sportsClassId.map((cls:any) => cls.id) : [];

      const activePayload = subAttributesDescription.map((subAttr: any) => ({
        subAttributeName: subAttr.subAttributesId,
        sportsClassIds: seledtedClassIds,
        gradeAndDescriptionRequestDTOList:
          subAttr.gradeAndDescriptionRequestDTOList.map((grade) => ({
            psGradeId: Number(grade.psGradeId),
            description: grade.description,
          })),
      }));

      const payload = [...activePayload, ...deletedSubAttributes];

      dispatch(
        setSaveSportsDiscriptionsItemsAct(
          generateActionPayload(
            "save_sports_discriptions_items",
            undefined,
            payload
          )
        )
      );
    },
  });
  const [deletedSubAttributes, setDeletedSubAttributes] = useState<any[]>([]);

  const dispatch = useAppDispatch();

  const {
    currentBranchIdResp: branchId,
    showApiLoader,

    academicYearListResp,
    brchCurriculumResp,
    getIgseTermNameListResp,
    getSportsAttributesListResp,
    getSportsClassMappingListResp,
    getSportsClassesListResp,
    getSubAttributesCommonListResp,
    getSportsGradesListResp,
    getSportsDiscriptionsListResp,
    getSportsNamesResp,
  } = useAppSelector(
    ({
      appData,
      instAcademics,
      examinationSports,
      branchAcademics,
      examinationSettings,
      globalData,
    }) => ({
      currentBranchIdResp: appData.currentBranchIdResp,
      academicYearListResp: instAcademics.academicYearListResp,

      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      getIgseTermNameListResp: examinationSettings.getIgseTermNameListResp,

      getSportsAttributesListResp:
        examinationSports.getSportsAttributesListResp,
      getSportsClassMappingListResp:
        examinationSports.getSportsClassMappingListResp,
      getSportsClassesListResp: examinationSports.getSportsClassesListResp,
      getSubAttributesCommonListResp:
        examinationSports.getSubAttributesCommonListResp,
      getSportsDiscriptionsListResp:
        examinationSports.getSportsDiscriptionsListResp,
      showApiLoader: globalData.showApiLoader,
      getSportsNamesResp: examinationSports.getSportsNamesResp,

      getSportsGradesListResp: examinationSports.getSportsGradesListResp,
    }),
    shallowEqual
  );

  // function fetchSportsClassMappingList(otherProps?: any) {
  //   const payload = {
  //     academicYearId: addEditSportsAttDesFormik.values.academicYearId,
  //     ...otherProps,
  //     pageNo: 0,
  //     pageSize: 100,
  //     branchId,
  //   };
  //   dispatch(
  //     getSportsClassMappingListAct(
  //       generateActionPayload(
  //         "get_sports_class_mapping_list",
  //         undefined,
  //         payload
  //       )
  //     )
  //   );
  // }

  function fetchExaminationSportsNames(otherProps?: any) {
    const payload = {
      branchId,
      ...otherProps,
      pageNo: 0,
      pageSize: 100,
    };

    dispatch(
      getSportsNamesAct(
        generateActionPayload("get_sports_names", undefined, payload)
      )
    );
  }

  function fetchSportsAttributesNames(otherProps?: any) {
    const payload = {
      branchId,
      academicYearId: addEditSportsAttDesFormik.values.academicYearId,
      pageNo: 0,
      pageSize: 100,
      ...otherProps,
    };

    dispatch(
      getSportsAttributeListAct(
        generateActionPayload("get_sports_attributes_list", undefined, payload)
      )
    );
  }

  function fetchCurriculumList(otherProps?: any) {
    const payload = {
      academicYearId: addEditSportsAttDesFormik.values.academicYearId,
      branchId,
      pageNo: 0,
      pageSize: 100,
      sortBy: "curriculumName",
      orderBy: "asc",
      ...otherProps,
    };

    dispatch(
      getBranchCurriculumAct(
        generateActionPayload("get_brch_curriculum", undefined, payload)
      )
    );
  }

  function fetchTermList(otherProps?: any) {
    const payload = {
      branchId,
      pageNo: 0,
      pageSize: 100,
      curriculumId: addEditSportsAttDesFormik.values.curriculumId,
      ...otherProps,
    };

    dispatch(
      getIgseTermNameListAct(
        generateActionPayload("get_igse_term_name_list", undefined, payload)
      )
    );
  }

  function fetchSportsClassesList(otherProps?: any) {
    const { academicYearId, curriculumId, termId, sportsId } =
      addEditSportsAttDesFormik.values;
    const payload = {
      branchId,
      academicYearId,
      curriculumId,
      termId,
      sportsId,
      pageNo: 0,
      ...otherProps,
      pageSize: 100,
    };

    dispatch(
      getSportsByClassesListAct(
        generateActionPayload("get_sports_classes_list", undefined, payload)
      )
    );
  }

  function fetchSubAttributeItemsList(otherProps?: any) {
    const { academicYearId: formAcademicYearId,  sportsId: formSportsId,  mainAttributeId: formMainAttributeId, sportsClassId: formSportsClassId } =
      addEditSportsAttDesFormik.values;

    const academicYearId = otherProps?.academicYearId ?? formAcademicYearId;
    const sportsId = otherProps?.sportsId ?? formSportsId;
    const mainAttributeId = otherProps?.mainAttributeId ?? formMainAttributeId;
    const sportsClassId = otherProps?.sportsClassId ?? formSportsClassId;

    const payload = {
      branchId,
      academicYearId,
      sportsId,
      mainAttributeId,
      sportsClassId: Array.isArray(sportsClassId) ? sportsClassId.map((cls: any) => cls.id).join(',') : sportsClassId,
      pageNo: 0,
      pageSize: 100,
    };

    dispatch(
      getSubAttributesCommonListAct(
        generateActionPayload(
          "get_sub_attributes_common_list",
          undefined,
          payload
        )
      )
    );
  }

  function fetchExaminationSportsGrades(otherProps?: any) {
    const { academicYearId } = addEditSportsAttDesFormik.values;
    const payload = {
      branchId,
      academicYearId: academicYearId,
      ...otherProps,
      pageNo: 0,
      pageSize: 100,
    };

    dispatch(
      getSportsGradeListAct(
        generateActionPayload("get_sports_grades_list", undefined, payload)
      )
    );
  }

  function filterHandler(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    if (name === "academicYearId") {
      addEditSportsAttDesFormik.setValues((prev: any) => ({
        ...prev,
        [name]: value,
        curriculumId: "",
        termId: "",
        sportsId: "",
        mainAttributeId: "",
        sportsClassId: "",
      }));

      if (value) {
        fetchCurriculumList({ academicYearId: value });
      } else {
        dispatch(resetBrchCurriculumAct(undefined));
        dispatch(resetBrchClassAct(undefined));
      }
    } else if (name === "curriculumId") {
      addEditSportsAttDesFormik.setValues((prev: any) => ({
        ...prev,
        [name]: value,
        termId: "",
        sportsId: "",
        mainAttributeId: "",
        sportsClassId: "",
      }));

      if (value) {
        fetchTermList({ curriculumId: value });
      } else {
        dispatch(resetBrchClassAct(undefined));
      }
    } else if (name === "termId") {
      addEditSportsAttDesFormik.setValues((prev: any) => ({
        ...prev,
        [name]: value,
        sportsId: "",
        mainAttributeId: "",
        sportsClassId: "",
      }));
      if (value) {
        fetchSportsAttributesNames({
          academicYearId: addEditSportsAttDesFormik.values.academicYearId,
        });
      }
    } else if (name === "sportsId") {
      addEditSportsAttDesFormik.setValues((prev: any) => ({
        ...prev,
        [name]: value,
        sportsClassId: "",
      }));
      if (value) {
        fetchSportsClassesList({ sportsId: value });
      }
    } else if (name === "sportsClassId") {
      addEditSportsAttDesFormik.setValues((prev: any) => ({
        ...prev,
        [name]: value,
        subAttributesId: "",
      }));
      if (value) {
        fetchSubAttributeItemsList({ sportsClassId: value });
        fetchExaminationSportsGrades();
      }
    } else {
      addEditSportsAttDesFormik.setValues((prev: any) => ({
        ...prev,
        [name]: value,
      }));
    }
  }

  function handleSubAttributeChange(event: React.ChangeEvent<HTMLInputElement>, idx: number) {
    const selectedId = event.target.value;
    const selectedItem = Array.isArray(getSubAttributesCommonListResp)
      ? getSubAttributesCommonListResp.find((item: any) => item.subAttributeId === selectedId)
      : null;
    addEditSportsAttDesFormik.setFieldValue(`subAttributesDescription[${idx}].subAttributesId`, selectedId);
    addEditSportsAttDesFormik.setFieldValue(`subAttributesDescription[${idx}].subAttributeName`, selectedItem?.subAttributeName || '');
  }

  useEffect(() => {
    if (editItemId) {
      const descriptionItemData = getSportsDiscriptionsListResp?.content?.find(
        (item) => +item?.uniqueId === +editItemId
      );

      const {
        academicYearId,
        curriculumId,
        termId,
        sportsId,
        mainAttributeId,
        sportsClassId,
        sportsClassName,
        subAttributes,
      } = descriptionItemData || {};
      const formattedSportsClass = [
        {
          id: sportsClassId,
          branchShortName: sportsClassName,
        },
      ];

      const formattedSubAttributes = subAttributes?.map((subAttr) => ({
        id: subAttr.subAttributeId,
        subAttributesId: subAttr.subAttributeName,
        subAttributeName: subAttr.subAttributeName,
        isExisting: true,
        gradeAndDescriptionRequestDTOList:
          subAttr.gradesAndDescriptions?.map((item) => ({
            id: item.attributeDescriptionSportsId,
            psGradeId: String(item.gradeId),
            description: item.description,
          })) || [],
      }));
      addEditSportsAttDesFormik.setFieldValue("academicYearId", academicYearId);
      addEditSportsAttDesFormik.setFieldValue("curriculumId", curriculumId);
      addEditSportsAttDesFormik.setFieldValue("termId", termId);
      addEditSportsAttDesFormik.setFieldValue("sportsId", sportsId);
      addEditSportsAttDesFormik.setFieldValue(
        "mainAttributeId",
        mainAttributeId
      );
      addEditSportsAttDesFormik.setFieldValue("sportsClassId", formattedSportsClass);
      addEditSportsAttDesFormik.setFieldValue(
        "subAttributesDescription",
        formattedSubAttributes
      );

      if (academicYearId) {
        fetchCurriculumList({ academicYearId: academicYearId });
        fetchSportsAttributesNames({
          academicYearId: academicYearId,
        });
      }
      if (curriculumId) {
        fetchTermList({ curriculumId: curriculumId });
      }
      if (sportsId) {
        fetchSportsClassesList({ sportsId: sportsId });
      }
      if (sportsClassId) {
        fetchSubAttributeItemsList({
          academicYearId,
          curriculumId,
          mainAttributeId,
          sportsId,
          sportsClassId: sportsClassId,
        });
        fetchExaminationSportsGrades();
      }
    }
  }, [editItemId]);

  useEffect(() => {
    const yearId =
      academicYearListResp &&
      academicYearListResp.data.find(
        (year: any) => year.yearStatus.toLowerCase() === "current"
      )?.academicYearId;

    addEditSportsAttDesFormik.setFieldValue("academicYearId", yearId);
    fetchCurriculumList({ academicYearId: yearId });
    fetchExaminationSportsNames();
  }, [academicYearListResp]);

  useEffect(() => {
    if (!isOpen) {
      setDeletedSubAttributes([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (editItemId && Array.isArray(getSubAttributesCommonListResp) && getSubAttributesCommonListResp.length > 0) {
      const subAttributesDescription = addEditSportsAttDesFormik.values.subAttributesDescription;
      subAttributesDescription.forEach((subAttr: any, idx: number) => {
        if (subAttr.subAttributesId && !subAttr.subAttributeName) {
          const item = getSubAttributesCommonListResp.find((item: any) => item.subAttributeId === subAttr.subAttributesId);
          if (item) {
            addEditSportsAttDesFormik.setFieldValue(`subAttributesDescription[${idx}].subAttributeName`, item.subAttributeName);
          }
        }
      });
    }
  }, [getSubAttributesCommonListResp, editItemId]);

  function renderValueTerms(selectedItems: any) {
    if (Array.isArray(selectedItems)) {
      return (<div className="text-truncate">
        {
          selectedItems.map((item, index) => {
            return item?.branchShortName + (index !== (selectedItems.length - 1) ? ', ' : '')
          })
        }
      </div>)
    }
  }
  
  function renderOptionsTerms(item: any) {
    return item?.branchShortName || item?.branchClassName;
  }

  function onSelectOptionHandler(selectedOptions:any,config?:any){
    const {name} = config;
    if(Array.isArray(selectedOptions) && selectedOptions.length > 0){
      addEditSportsAttDesFormik.setValues((prev:any) => ({...prev, [name]: selectedOptions,subAttributesId:"",subAttributeName: "", }));
      fetchSubAttributeItemsList({ sportsClassId: selectedOptions });
      fetchExaminationSportsGrades();
    }
    else {
      addEditSportsAttDesFormik.setFieldValue(name, null);
      fetchSubAttributeItemsList({ sportsClassId: selectedOptions });
      fetchExaminationSportsGrades();
    }
  }

  const { data: sportsAttributesList } = getSportsAttributesListResp || {};
  const { data: sportsClassMappingList } = getSportsClassMappingListResp || {};
  const { data: sportsGradesList } = getSportsGradesListResp || {};
  const { data: sportsList } = getSportsNamesResp || {};

  return (
    <div style={{ padding: "1.25rem" }}>
      <FormikProvider value={addEditSportsAttDesFormik}>
        <form onSubmit={addEditSportsAttDesFormik.handleSubmit}>
          <div className="row">
            <div className="col-12 col-lg-6">
              <SelectInput
                name="academicYearId"
                value={addEditSportsAttDesFormik.values.academicYearId}
                onChange={filterHandler}
                onBlur={addEditSportsAttDesFormik.handleBlur}
                menuItems={academicYearListResp?.data}
                valueKey="academicYearId"
                textKey="academicYearName"
                labelText="Academic Year"
                labelClass="required"
                isDisabled={editItemId}
                invalid={
                  !!(
                    addEditSportsAttDesFormik.touched.academicYearId &&
                    addEditSportsAttDesFormik.errors.academicYearId
                  )
                }
                error={
                  addEditSportsAttDesFormik.touched.academicYearId &&
                  addEditSportsAttDesFormik.errors.academicYearId
                    ? addEditSportsAttDesFormik.errors.academicYearId
                    : ""
                }
              />
            </div>
            <div className="col-12 col-lg-6">
              <SelectInput
                name="curriculumId"
                value={addEditSportsAttDesFormik.values.curriculumId}
                onChange={filterHandler}
                onBlur={addEditSportsAttDesFormik.handleBlur}
                menuItems={brchCurriculumResp?.data}
                valueKey="branchCurriculumId"
                textKey="curriculumName"
                labelText="Curriculum"
                labelClass="required"
                isDisabled={editItemId}
                invalid={
                  !!(
                    addEditSportsAttDesFormik.touched.curriculumId &&
                    addEditSportsAttDesFormik.errors.curriculumId
                  )
                }
                error={
                  addEditSportsAttDesFormik.touched.curriculumId &&
                  addEditSportsAttDesFormik.errors.curriculumId
                    ? addEditSportsAttDesFormik.errors.curriculumId
                    : ""
                }
              />
            </div>

            <div className="col-12 col-lg-6 mt-md-0">
              <SelectInput
                name="termId"
                value={addEditSportsAttDesFormik.values.termId}
                onChange={filterHandler}
                onBlur={addEditSportsAttDesFormik.handleBlur}
                menuItems={
                  Array.isArray(getIgseTermNameListResp?.data)
                    ? getIgseTermNameListResp?.data
                    : []
                }
                valueKey="termId"
                textKey="termName"
                labelText="Term"
                labelClass="required"
                isDisabled={editItemId}
                invalid={
                  !!(
                    addEditSportsAttDesFormik.touched.termId &&
                    addEditSportsAttDesFormik.errors.termId
                  )
                }
                error={
                  addEditSportsAttDesFormik.touched.termId &&
                  addEditSportsAttDesFormik.errors.termId
                    ? addEditSportsAttDesFormik.errors.termId
                    : ""
                }
              />
            </div>
            <div className="col-12 col-lg-6">
              <SelectInput
                name="sportsId"
                value={addEditSportsAttDesFormik.values.sportsId}
                onChange={filterHandler}
                onBlur={addEditSportsAttDesFormik.handleBlur}
                menuItems={Array.isArray(sportsList) ? sportsList : []}
                valueKey="id"
                textKey="sportName"
                labelText="Sports"
                labelClass="required"
                isDisabled={editItemId}
                invalid={
                  !!(
                    addEditSportsAttDesFormik.touched.sportsId &&
                    addEditSportsAttDesFormik.errors.sportsId
                  )
                }
                error={
                  addEditSportsAttDesFormik.touched.sportsId &&
                  addEditSportsAttDesFormik.errors.sportsId
                    ? addEditSportsAttDesFormik.errors.sportsId
                    : ""
                }
              />
            </div>
            <div className="col-12 col-lg-6">
              <SelectInput
                name="mainAttributeId"
                value={addEditSportsAttDesFormik.values.mainAttributeId}
                onChange={addEditSportsAttDesFormik.handleChange}
                onBlur={addEditSportsAttDesFormik.handleBlur}
                menuItems={
                  Array.isArray(sportsAttributesList)
                    ? sportsAttributesList
                    : []
                }
                valueKey="id"
                textKey="attributeName"
                labelText="Main Attribute"
                labelClass="required"
                isDisabled={editItemId}
                invalid={
                  !!(
                    addEditSportsAttDesFormik.touched.mainAttributeId &&
                    addEditSportsAttDesFormik.errors.mainAttributeId
                  )
                }
                error={
                  addEditSportsAttDesFormik.touched.mainAttributeId &&
                  addEditSportsAttDesFormik.errors.mainAttributeId
                    ? addEditSportsAttDesFormik.errors.mainAttributeId
                    : ""
                }
              />
            </div>
            <div className="col-12 col-lg-6">
              {/* <SelectInput
                name="sportsClassId"
                value={addEditSportsAttDesFormik.values.sportsClassId}
                onChange={filterHandler}
                onBlur={addEditSportsAttDesFormik.handleBlur}
                menuItems={
                  Array.isArray(getSportsClassesListResp)
                    ? getSportsClassesListResp
                    : []
                }
                valueKey="id"
                textKey="branchShortName"
                labelText="Class"
                labelClass="required"
                isDisabled={editItemId}
                invalid={
                  !!(
                    addEditSportsAttDesFormik.touched.sportsClassId &&
                    addEditSportsAttDesFormik.errors.sportsClassId
                  )
                }
                error={
                  addEditSportsAttDesFormik.touched.sportsClassId &&
                  addEditSportsAttDesFormik.errors.sportsClassId
                    ? addEditSportsAttDesFormik.errors.sportsClassId
                    : ""
                }
              /> */}
              <MultiSelectCheckbox
                  name="sportsClassId"
                  idKey="id"
                  labelText="Classes"
                  value={addEditSportsAttDesFormik.values.sportsClassId}
                  onChange={onSelectOptionHandler}
                  options={Array.isArray(getSportsClassesListResp)
                    ? getSportsClassesListResp
                    : []}
                  searchKey="branchShortName"
                  labelClass="required"
                  renderValue={renderValueTerms}
                  renderOptions={renderOptionsTerms}
                  isDisabled={editItemId}
                  invalid={
                    addEditSportsAttDesFormik.touched.sportsClassId &&
                    !!addEditSportsAttDesFormik.errors.sportsClassId
                  }
                  error={
                    addEditSportsAttDesFormik.touched.sportsClassId &&
                      addEditSportsAttDesFormik.errors.sportsClassId
                      ? addEditSportsAttDesFormik.errors.sportsClassId
                      : ""
                  }
              />
            </div>

            <div className="col-12 mb-3">
              <FieldArray name="subAttributesDescription">
                {(subArrayHelpers: ArrayHelpers) => (
                  <>
                    {addEditSportsAttDesFormik.values.subAttributesDescription.map(
                      (subItem: any, idx) => {
                        const subErrors: any =
                          (addEditSportsAttDesFormik.errors
                            .subAttributesDescription &&
                            (
                              addEditSportsAttDesFormik.errors
                                .subAttributesDescription as any
                            )[idx]) ||
                          {};
                        const subTouched: any =
                          (addEditSportsAttDesFormik.touched
                            .subAttributesDescription &&
                            (
                              addEditSportsAttDesFormik.touched
                                .subAttributesDescription as any
                            )[idx]) ||
                          {};

                        if (subItem.deleted) return null;

                        return (
                          <div
                            key={subItem.id}
                            className="border p-3 mb-3 rounded"
                          >
                            <div className="row mb-2">
                              <div className="col-10">
                                <SelectInput
                                  name={`subAttributesDescription[${idx}].subAttributesId`}
                                  value={subItem.subAttributesId}
                                  onChange={(e) => handleSubAttributeChange(e, idx)}
                                  onBlur={addEditSportsAttDesFormik.handleBlur}
                                  formgroupClassName="mb-0"
                                  menuItems={
                                    Array.isArray(getSubAttributesCommonListResp)
                                      ? getSubAttributesCommonListResp
                                      : []
                                  }
                                  valueKey="subAttributeName"
                                  textKey="subAttributeName"
                                  // isDisabled={editItemId}
                                  isDisabled={
                                    !!editItemId && !!subItem.subAttributesId
                                  }
                                  invalid={
                                    subTouched.subAttributesId &&
                                    subErrors.subAttributesId
                                      ? true
                                      : false
                                  }
                                  error={
                                    subTouched.subAttributesId &&
                                    subErrors.subAttributesId
                                      ? subErrors.subAttributesId
                                      : ""
                                  }
                                  labelClass="required"
                                  labelText={idx === 0 ? "Sub Attribute" : ""}
                                />
                              </div>
                              <div className="col-2 d-flex align-items-end">
                                {
                                  // <button
                                  //   type="button"
                                  //   // onClick={() => subArrayHelpers.remove(idx)}
                                  //   onClick={() => {
                                  //     const current =
                                  //       addEditSportsAttDesFormik.values
                                  //         .subAttributesDescription[idx];
                                  //     addEditSportsAttDesFormik.setFieldValue(
                                  //       `subAttributesDescription[${idx}]`,
                                  //       {
                                  //         ...current,
                                  //         gradeAndDescriptionRequestDTOList: [],
                                  //         deleted: true,
                                  //       }
                                  //     );
                                  //   }}
                                  //   className="btn-sm btn-icon btn-rounded btn-hover-danger btn btn-white"
                                  // >
                                  //   <HugeiconsIcon
                                  //     icon={Delete02StrokeStandard}
                                  //     className="text-danger"
                                  //     size={18}
                                  //   />
                                  // </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const current:any =
                                        addEditSportsAttDesFormik.values
                                          .subAttributesDescription[idx];

                                      if (current?.isExisting) {
                                        setDeletedSubAttributes((prev) => [
                                          ...prev,
                                          {
                                            subAttributesId: Number(current.subAttributesId),
                                            gradeAndDescriptionRequestDTOList: [],
                                          },
                                        ]);
                                      }

                                      subArrayHelpers.remove(idx);
                                    }}
                                    className="btn-sm btn-icon btn-rounded btn-hover-danger btn btn-white"
                                  >
                                    <HugeiconsIcon
                                      icon={Delete02StrokeStandard}
                                      className="text-danger"
                                      size={18}
                                    />
                                  </button>
                                }
                              </div>
                            </div>

                            <div className="row mb-2 ms-3">
                              <div className="col-5 form-label required">Grade</div>
                              <div className="col-5 form-label required">Description</div>
                            </div>

                            <FieldArray
                              name={`subAttributesDescription[${idx}].gradeAndDescriptionRequestDTOList`}
                            >
                              {(gradeArrayHelpers: ArrayHelpers) => (
                                <>
                                  {subItem.gradeAndDescriptionRequestDTOList.map(
                                    (grade, gIdx) => {
                                      const gradeErrors: any =
                                        (subErrors.gradeAndDescriptionRequestDTOList &&
                                          (
                                            subErrors.gradeAndDescriptionRequestDTOList as any
                                          )[gIdx]) ||
                                        {};
                                      const gradeTouched: any =
                                        (subTouched.gradeAndDescriptionRequestDTOList &&
                                          (
                                            subTouched.gradeAndDescriptionRequestDTOList as any
                                          )[gIdx]) ||
                                        {};

                                      return (
                                        <div
                                          key={grade.id}
                                          className="row mb-2 ms-3"
                                        >
                                          <div className="col-5">
                                            <SelectInput
                                              name={`subAttributesDescription[${idx}].gradeAndDescriptionRequestDTOList[${gIdx}].psGradeId`}
                                              value={grade.psGradeId}
                                              onChange={
                                                addEditSportsAttDesFormik.handleChange
                                              }
                                              onBlur={
                                                addEditSportsAttDesFormik.handleBlur
                                              }
                                              valueKey="id"
                                              textKey="grade"
                                              menuItems={
                                                Array.isArray(sportsGradesList)
                                                  ? sportsGradesList
                                                  : []
                                              }
                                              formgroupClassName="mb-0"
                                              invalid={
                                                gradeTouched.psGradeId &&
                                                gradeErrors.psGradeId
                                                  ? true
                                                  : false
                                              }
                                              error={
                                                gradeTouched.psGradeId &&
                                                gradeErrors.psGradeId
                                                  ? gradeErrors.psGradeId
                                                  : ""
                                              }
                                            />
                                          </div>
                                          <div className="col-5">
                                            <TextArea
                                              name={`subAttributesDescription[${idx}].gradeAndDescriptionRequestDTOList[${gIdx}].description`}
                                              value={grade.description}
                                              onChange={
                                                addEditSportsAttDesFormik.handleChange
                                              }
                                              onBlur={
                                                addEditSportsAttDesFormik.handleBlur
                                              }
                                              formgroupClassName="mb-0"
                                              invalid={
                                                gradeTouched.description &&
                                                gradeErrors.description
                                                  ? true
                                                  : false
                                              }
                                              error={
                                                gradeTouched.description &&
                                                gradeErrors.description
                                                  ? gradeErrors.description
                                                  : ""
                                              }
                                              height="34px"
                                            />
                                          </div>
                                          <div className="col-2 d-flex">
                                            {
                                              <button
                                                type="button"
                                                onClick={() =>
                                                  gradeArrayHelpers.remove(gIdx)
                                                }
                                                className="btn-sm btn-icon btn-rounded btn-hover-danger btn btn-white"
                                              >
                                                <HugeiconsIcon
                                                  icon={Delete02StrokeStandard}
                                                  className="text-danger"
                                                  size={18}
                                                />
                                              </button>
                                            }
                                          </div>
                                        </div>
                                      );
                                    }
                                  )}

                                  <div className="row ms-3 mb-2">
                                    <div className="col-12">
                                      <button
                                        type="button"
                                        className="btn btn-outline-secondary btn-sm"
                                        onClick={() =>
                                          gradeArrayHelpers.push({
                                            id: generateUniqueNumber(),
                                            psGradeId: "",
                                            description: "",
                                          })
                                        }
                                      >
                                        <HugeiconsIcon icon={PlusSignIcon} />{" "}
                                        Add Grade
                                      </button>
                                    </div>
                                  </div>
                                </>
                              )}
                            </FieldArray>
                          </div>
                        );
                      }
                    )}

                    <div className="row">
                      <div className="col-12">
                        <button
                          type="button"
                          className="btn btn-outline-primary btn-sm"
                          onClick={() =>
                            subArrayHelpers.push({
                              id: generateUniqueNumber(),
                              subAttributesId: "",
                              isExisting: false,
                              gradeAndDescriptionRequestDTOList: [
                                {
                                  id: generateUniqueNumber(),
                                  psGradeId: "",
                                  description: "",
                                },
                              ],
                            })
                          }
                        >
                          <HugeiconsIcon
                            icon={PlusSignIcon}
                            size={22}
                            className="me-2"
                          />{" "}
                          Add Sub Attribute
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </FieldArray>
            </div>
          </div>

          <div className="row mt-3">
            <div className="d-flex ms-auto w-auto">
              <button
                type="button"
                className="btn btn-light me-3"
                onClick={toggle}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-success"
                disabled={showApiLoader}
              >
                Submit
              </button>
            </div>
          </div>
        </form>
      </FormikProvider>
    </div>
  );
};

export default AddEditSportsAttributeDescriptionModal;
