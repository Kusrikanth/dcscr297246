import * as Yup from "yup";
import { useState, useRef, useEffect } from "react";
import { MultiSelectCheckbox, SelectInput, TextInput } from "../../../../../Components/Common";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02StrokeStandard } from "@hugeicons-pro/core-stroke-standard";
import { generateUniqueNumber } from "../../../../../utility/commonutility";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import {
  editSportsSubAttributeItemAct,
  getSportsAttributeListAct,
  getSportsByClassesListAct,
  getSportsClassMappingListAct,
  getSportsNamesAct,
  saveSportsSubAttributeItemAct,
} from "../../../../../store/examination/examinationSports/examinationSportsActions";
import { generateActionPayload } from "../../../../../utility/reduxutility";
import { ArrayHelpers, FieldArray, FormikProvider, useFormik } from "formik";
import {
  getBranchClassAct,
  getBranchCurriculumAct,
  resetBrchClassAct,
  resetBrchCurriculumAct,
} from "../../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { getIgseTermNameListAct } from "../../../../../store/examination/examinationsettings/examinationsettingsaction";
import { ConsoleSolidStandard } from "@hugeicons-pro/core-solid-standard";

const initialValues = {
  academicYearId: "",
  curriculumId: "",
  termId: "",
  mainAttributeId: "",
  sportsId: "",
  classId: "",
  removeIds: [],
  attributes: [
    {
      id: generateUniqueNumber(),
      subAttribute: "",
    },
  ],
};

const validationSchema = Yup.object().shape({
  academicYearId: Yup.string().required("Academic Year is required"),
  curriculumId: Yup.string().required("Curriculum is required"),
  termId: Yup.string().required("Term is required"),
  mainAttributeId: Yup.string().required("Main Attribute is required"),
  sportsId: Yup.string().required("Sports is required"),
  classId: Yup.array().min(1, "Class is required.").required("Class is required.").nullable(),
  attributes: Yup.array().of(
    Yup.object().shape({
      id: Yup.number().nullable(),
      subAttribute: Yup.string()
        .required("Sub Attribute is required")
        .test(
          "is-unique",
          "Duplicate sub attribute not allowed",
          function (value) {
            const { path, options } = this;
            const list = options.context?.attributes || [];

            if (!value) return true;

            const duplicates = list.filter(
              (item: any) =>
                item.subAttribute?.trim().toLowerCase() ===
                value.trim().toLowerCase()
            );

            if (duplicates.length > 1) {
              return this.createError({
                path,
                message: "Duplicate sub attribute not allowed",
              });
            }

            return true;
          }
        )
        .nullable(),
    })
  ),
});

const AddEditSubAttributeSportsModal = ({ toggle, editItemId, isOpen }) => {
  const dispatch = useAppDispatch();
  const [editClassId, setEditClassId] = useState(null);

  const {
    currentBranchIdResp: branchId,

    academicYearListResp,
    brchCurriculumResp,
    branchClassResp,
    getIgseTermNameListResp,
    getSportsAttributesListResp,
    getSportsClassMappingListResp,
    getSportsClassesListResp,
    getSportsSubAttributeItemByIdResp,
    getSportsSubAttributeListResp,
    getSportsNamesResp,
  } = useAppSelector(
    ({
      appData,
      instAcademics,
      examinationSports,
      branchAcademics,
      examinationSettings,
    }) => ({
      currentBranchIdResp: appData.currentBranchIdResp,
      academicYearListResp: instAcademics.academicYearListResp,

      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      branchClassResp: branchAcademics.branchClassResp,
      getIgseTermNameListResp: examinationSettings.getIgseTermNameListResp,

      getSportsAttributesListResp:
        examinationSports.getSportsAttributesListResp,
      getSportsClassMappingListResp:
        examinationSports.getSportsClassMappingListResp,
      getSportsClassesListResp: examinationSports.getSportsClassesListResp,
      getSportsSubAttributeItemByIdResp:
        examinationSports.getSportsSubAttributeItemByIdResp,
      getSportsSubAttributeListResp:
        examinationSports.getSportsSubAttributeListResp,
      getSportsNamesResp: examinationSports.getSportsNamesResp,
    }),
    shallowEqual
  );

  const addEditSubAttributesformik = useFormik({
    initialValues: initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values: any) => {
      const {
        academicYearId,
        mainAttributeId,
        sportsId,
        classId,
        attributes,
        removeIds,
      } = values;

      const selectedClassesIds = Array.isArray(classId) ? classId.map((cls) => cls?.id) : [];

      if (editItemId) {
        const payloadAttributes = [...attributes, ...removeIds].map(
          (item: any) => ({
            id: item.id,
            name: item.subAttribute,
            isDeleted: item.isDeleted ?? false,
          })
        );
        const payload = {
          branchId,
          academicYearId,
          mainAttributeId,
          sportsId,
          sportsClassId: classId?.[0]?.id,
          attributes: payloadAttributes,
        };
        dispatch(
          editSportsSubAttributeItemAct(
            generateActionPayload(
              "edit_sports_sub_attribute_item",
              undefined,
              payload
            )
          )
        );
      } else {
        const modifedSubAttributes = attributes.map(
          (item) => item.subAttribute
        );
        const payload = {
          branchId,
          academicYearId,
          mainAttributeId,
          sportsId,
          sportsClassIds: selectedClassesIds,
          attributes: modifedSubAttributes,
        };
        dispatch(
          saveSportsSubAttributeItemAct(
            generateActionPayload(
              "save_sports_sub_attribute_items",
              undefined,
              payload
            )
          )
        );
      }
    },
  });

  const formikArrayHelpers = useRef<ArrayHelpers | null>(null);

  function fetchSportsAttributesNames(otherProps?: any) {
    const payload = {
      branchId,
      academicYearId: addEditSubAttributesformik.values.academicYearId,
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

  function fetchSportsClassMappingList(otherProps?: any) {
    const payload = {
      academicYearId: addEditSubAttributesformik.values.academicYearId,
      ...otherProps,
      pageNo: 0,
      pageSize: 100,
      branchId,
    };
    dispatch(
      getSportsClassMappingListAct(
        generateActionPayload(
          "get_sports_class_mapping_list",
          undefined,
          payload
        )
      )
    );
  }

  function fetchExaminationSportsNames(otherProps?: any) {
    const payload = {
      branchId,
      pageNo: 0,
      pageSize: 100,
      ...otherProps,
    };

    dispatch(
      getSportsNamesAct(
        generateActionPayload("get_sports_names", undefined, payload)
      )
    );
  }

  function fetchCurriculumList(otherProps?: any) {
    const payload = {
      academicYearId: addEditSubAttributesformik.values.academicYearId,
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
      curriculumId: addEditSubAttributesformik.values.curriculumId,
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
      addEditSubAttributesformik.values;
    const payload = {
      branchId,
      academicYearId,
      curriculumId,
      termId,
      sportsId,
      ...otherProps,
    };

    dispatch(
      getSportsByClassesListAct(
        generateActionPayload("get_sports_classes_list", undefined, payload)
      )
    );
  }

  function filterHandler(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    if (name === "academicYearId") {
      addEditSubAttributesformik.setValues((prev: any) => ({
        ...prev,
        [name]: value,
        curriculumId: "",
        termId: "",
        classIds: "",
        sportsId: "",
      }));

      if (value) {
        fetchCurriculumList({ academicYearId: value });
      } else {
        dispatch(resetBrchCurriculumAct(undefined));
        dispatch(resetBrchClassAct(undefined));
      }
    } else if (name === "curriculumId") {
      addEditSubAttributesformik.setValues((prev: any) => ({
        ...prev,
        [name]: value,
        termId: "",
        classIds: "",
        sportsId: "",
      }));

      if (value) {
        fetchTermList({ curriculumId: value });
      } else {
        dispatch(resetBrchClassAct(undefined));
      }
    } else if (name === "termId") {
      addEditSubAttributesformik.setValues((prev: any) => ({
        ...prev,
        [name]: value,
        mainAttributeId: "",
        sportsId: "",
        classId: "",
      }));
      if (value) {
        fetchSportsAttributesNames({
          academicYearId: addEditSubAttributesformik.values.academicYearId,
        });
        // fetchSportsClassMappingList({
        //   academicYearId: addEditSubAttributesformik.values.academicYearId,
        // });
        fetchExaminationSportsNames();
      }
    } else if (name === "sportsId") {
      addEditSubAttributesformik.setValues((prev: any) => ({
        ...prev,
        [name]: value,
        classId: "",
      }));
      if (value) {
        fetchSportsClassesList({ sportsId: value });
      }
    } else {
      addEditSubAttributesformik.setValues((prev: any) => ({
        ...prev,
        [name]: value,
      }));
    }
  }

  function addNewSubAttribute() {
    if (formikArrayHelpers.current) {
      formikArrayHelpers.current.push({
        id: null,
        frontendId: generateUniqueNumber(),
        subAttribute: "",
      });
    }
  }
  function removeSubAttribute(event: React.MouseEvent<HTMLElement>) {
    const indexStr = event.currentTarget.getAttribute("data-index");
    if (indexStr === null) return;

    const index = Number(indexStr);
    const attributes = addEditSubAttributesformik.values.attributes;

    if (index >= 0 && index < attributes.length) {
      const removedItem = attributes[index];

      // Remove from the array
      formikArrayHelpers.current?.remove(index);

      // Add to removeIds if it has a database ID
      if (removedItem && removedItem.id) {
        addEditSubAttributesformik.setFieldValue("removeIds", [
          ...addEditSubAttributesformik.values.removeIds,
          { ...removedItem, isDeleted: true },
        ]);
      }
    }
  }

  useEffect(() => {
    const yearId =
      academicYearListResp &&
      academicYearListResp.data.find(
        (year: any) => year.yearStatus.toLowerCase() === "current"
      )?.academicYearId;

    addEditSubAttributesformik.setFieldValue("academicYearId", yearId);
    fetchCurriculumList({ academicYearId: yearId });
  }, [academicYearListResp]);

  const { data: sportsSubAttributesList } = getSportsSubAttributeListResp || {};

  useEffect(() => {
    if (editItemId) {
      const subAttributeItemData = sportsSubAttributesList.find(
        (item) => +item?.uniqueId === +editItemId
      );

      const {
        id,
        academicYearId,
        curriculumId,
        termId,
        sportsId,
        sportsClassId,
        subAttributes,
      } = subAttributeItemData || {};
      const formatedSubAttribites =
        subAttributes?.map((item: any) => ({
          ...item,
          subAttribute: item.name,
        })) || [];

      addEditSubAttributesformik.setFieldValue(
        "academicYearId",
        academicYearId
      );
      addEditSubAttributesformik.setFieldValue("curriculumId", curriculumId);
      addEditSubAttributesformik.setFieldValue("termId", termId);
      addEditSubAttributesformik.setFieldValue("sportsId", sportsId);
      addEditSubAttributesformik.setFieldValue("mainAttributeId", id);
      addEditSubAttributesformik.setFieldValue(
        "attributes",
        formatedSubAttribites
      );

      setEditClassId(sportsClassId || null);

      if (academicYearId) {
        fetchCurriculumList({ academicYearId });
        fetchExaminationSportsNames();
      }
      if (curriculumId) {
        fetchTermList({ curriculumId });
      }
      if (termId) {
        fetchSportsAttributesNames({ academicYearId });
        // fetchSportsClassMappingList({ academicYearId });
        fetchExaminationSportsNames();
      }
      if (sportsId) {
        fetchSportsClassesList({
          sportsId,
          academicYearId,
          curriculumId,
          termId,
        });
      }
    } else {
      setEditClassId(null);
    }
  }, [editItemId]);

  useEffect(() => {
    if (
      editItemId &&
      editClassId &&
      Array.isArray(getSportsClassesListResp) &&
      getSportsClassesListResp.length > 0
    ) {
      const selectedItemClass = getSportsClassesListResp.filter((cls) => cls?.id === editClassId);
      addEditSubAttributesformik.setFieldValue("classId", selectedItemClass);
    }
  }, [getSportsClassesListResp, editClassId, editItemId]);

  

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
      addEditSubAttributesformik.setFieldValue(name, selectedOptions);
    }
    else {
      addEditSubAttributesformik.setFieldValue(name, null);
    }
  }

  const { data: sportsAttributesList } = getSportsAttributesListResp || {};
  const { data: sportsClassMappingList } = getSportsClassMappingListResp || {};
  const { data: sportsGradesList } = getSportsNamesResp || {};

  return (
    <div style={{ padding: "1.25rem" }}>
      <form onSubmit={addEditSubAttributesformik.handleSubmit}>
        <div className="row">
          <div className="col-12 col-lg-6">
            <SelectInput
              name="academicYearId"
              value={addEditSubAttributesformik.values.academicYearId}
              onChange={filterHandler}
              onBlur={addEditSubAttributesformik.handleBlur}
              menuItems={academicYearListResp?.data}
              valueKey="academicYearId"
              textKey="academicYearName"
              labelText="Academic Year"
              labelClass="required"
              isDisabled={editItemId}
              invalid={
                !!(
                  addEditSubAttributesformik.touched.academicYearId &&
                  addEditSubAttributesformik.errors.academicYearId
                )
              }
              error={
                addEditSubAttributesformik.touched.academicYearId &&
                addEditSubAttributesformik.errors.academicYearId
                  ? addEditSubAttributesformik.errors.academicYearId
                  : ""
              }
            />
          </div>
          <div className="col-12 col-lg-6">
            <SelectInput
              name="curriculumId"
              value={addEditSubAttributesformik.values.curriculumId}
              onChange={filterHandler}
              onBlur={addEditSubAttributesformik.handleBlur}
              menuItems={brchCurriculumResp?.data}
              valueKey="branchCurriculumId"
              textKey="curriculumName"
              labelText="Curriculum"
              labelClass="required"
              isDisabled={editItemId}
              invalid={
                !!(
                  addEditSubAttributesformik.touched.curriculumId &&
                  addEditSubAttributesformik.errors.curriculumId
                )
              }
              error={
                addEditSubAttributesformik.touched.curriculumId &&
                addEditSubAttributesformik.errors.curriculumId
                  ? addEditSubAttributesformik.errors.curriculumId
                  : ""
              }
            />
          </div>

          <div className="col-12 col-lg-6 mt-md-0">
            <SelectInput
              name="termId"
              value={addEditSubAttributesformik.values.termId}
              onChange={filterHandler}
              onBlur={addEditSubAttributesformik.handleBlur}
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
                  addEditSubAttributesformik.touched.termId &&
                  addEditSubAttributesformik.errors.termId
                )
              }
              error={
                addEditSubAttributesformik.touched.termId &&
                addEditSubAttributesformik.errors.termId
                  ? addEditSubAttributesformik.errors.termId
                  : ""
              }
            />
          </div>
          <div className="col-12 col-lg-6">
            <SelectInput
              name="mainAttributeId"
              value={addEditSubAttributesformik.values.mainAttributeId}
              onChange={addEditSubAttributesformik.handleChange}
              onBlur={addEditSubAttributesformik.handleBlur}
              menuItems={
                Array.isArray(sportsAttributesList) ? sportsAttributesList : []
              }
              valueKey="id"
              textKey="attributeName"
              labelText="Main Attribute"
              labelClass="required"
              isDisabled={editItemId}
              invalid={
                !!(
                  addEditSubAttributesformik.touched.mainAttributeId &&
                  addEditSubAttributesformik.errors.mainAttributeId
                )
              }
              error={
                addEditSubAttributesformik.touched.mainAttributeId &&
                addEditSubAttributesformik.errors.mainAttributeId
                  ? addEditSubAttributesformik.errors.mainAttributeId
                  : ""
              }
            />
          </div>
          <div className="col-12 col-lg-6">
            <SelectInput
              name="sportsId"
              value={addEditSubAttributesformik.values.sportsId}
              onChange={filterHandler}
              onBlur={addEditSubAttributesformik.handleBlur}
              menuItems={
                Array.isArray(sportsGradesList) ? sportsGradesList : []
              }
              valueKey="id"
              textKey="sportName"
              labelText="Sports"
              labelClass="required"
              isDisabled={editItemId}
              invalid={
                !!(
                  addEditSubAttributesformik.touched.sportsId &&
                  addEditSubAttributesformik.errors.sportsId
                )
              }
              error={
                addEditSubAttributesformik.touched.sportsId &&
                addEditSubAttributesformik.errors.sportsId
                  ? addEditSubAttributesformik.errors.sportsId
                  : ""
              }
            />
          </div>
          <div className="col-12 col-lg-6 mb-3">
            {/* <SelectInput
              name="classId"
              value={addEditSubAttributesformik.values.classId}
              onChange={addEditSubAttributesformik.handleChange}
              onBlur={addEditSubAttributesformik.handleBlur}
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
                  addEditSubAttributesformik.touched.classId &&
                  addEditSubAttributesformik.errors.classId
                )
              }
              error={
                addEditSubAttributesformik.touched.classId &&
                addEditSubAttributesformik.errors.classId
                  ? addEditSubAttributesformik.errors.classId
                  : ""
              }
            /> */}
            <MultiSelectCheckbox
                name="classId"
                idKey="id"
                labelText="Classes"
                value={addEditSubAttributesformik.values.classId}
                onChange={onSelectOptionHandler}
                options={Array.isArray(getSportsClassesListResp)
                  ? getSportsClassesListResp
                  : []}
                searchKey="branchShortName"
                labelClass="required"
                renderValue={renderValueTerms}
                renderOptions={renderOptionsTerms}
                invalid={
                  addEditSubAttributesformik.touched.classId &&
                  !!addEditSubAttributesformik.errors.classId
                }
                error={
                  addEditSubAttributesformik.touched.classId &&
                    addEditSubAttributesformik.errors.classId
                    ? addEditSubAttributesformik.errors.classId
                    : ""
                }
                isDisabled={editItemId}
            />
          </div>

          <div className="col-12 mb-3">
            <FormikProvider value={addEditSubAttributesformik}>
              <FieldArray name="attributes">
                {(arrayHelpers: ArrayHelpers) => {
                  if (!formikArrayHelpers.current) {
                    formikArrayHelpers.current = arrayHelpers;
                  }
                  return (
                    <>
                      {addEditSubAttributesformik.values.attributes.map(
                        (item, idx) => {
                          const inputErrors: any =
                            (addEditSubAttributesformik.errors.attributes &&
                              (
                                addEditSubAttributesformik.errors
                                  .attributes as any
                              )[idx]) ||
                            {};
                          const inputTouched: any =
                            (addEditSubAttributesformik.touched.attributes &&
                              (
                                addEditSubAttributesformik.touched
                                  .attributes as any
                              )[idx]) ||
                            {};
                          return (
                            <div
                              key={item.frontendId || item.id}
                              className="mb-3 row"
                            >
                              <div className="col-10">
                                <TextInput
                                  name={`attributes[${idx}].subAttribute`}
                                  value={item.subAttribute}
                                  onChange={
                                    addEditSubAttributesformik.handleChange
                                  }
                                  onBlur={addEditSubAttributesformik.handleBlur}
                                  formgroupClassName="mb-0"
                                  invalid={
                                    inputTouched.subAttribute &&
                                    inputErrors.subAttribute
                                      ? true
                                      : false
                                  }
                                  error={
                                    inputTouched.subAttribute &&
                                    inputErrors.subAttribute
                                      ? inputErrors.subAttribute
                                      : ""
                                  }
                                  labelText={idx === 0 ? "Sub Attribute" : ""}
                                />
                              </div>
                              <div className="col-2 d-flex align-items-center">
                                {idx !== 0 && (
                                  <button
                                    type="button"
                                    onClick={removeSubAttribute}
                                    className="btn-sm btn-icon btn-rounded btn-hover-danger btn btn-white"
                                    data-index={idx}
                                    data-id={item.id || item.frontendId}
                                  >
                                    <HugeiconsIcon
                                      icon={Delete02StrokeStandard}
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
                            onClick={addNewSubAttribute}
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
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-success"
              // onClick={(event: any) =>
              //   addEditSubAttributesformik.handleSubmit(event)
              // }
            >
              {editItemId ? "Update" : "Submit"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddEditSubAttributeSportsModal;
