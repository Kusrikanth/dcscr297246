import { useFormik, FormikProvider, FieldArray } from "formik";
import * as Yup from "yup";
import {
  MultiSelectCheckbox,
  SelectInput,
} from "../../../../../Components/Common";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02StrokeStandard } from "@hugeicons-pro/core-stroke-standard";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import {
  getBranchClassAct,
  getBranchCurriculumAct,
  resetBrchClassAct,
  resetBrchCurriculumAct,
} from "../../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { generateActionPayload } from "../../../../../utility/reduxutility";
import {
  editSportsClassMappingItemAct,
  getSportsNamesAct,
  getSportsunAssignedClassesAct,
  saveSportsClassMappingItemAct,
} from "../../../../../store/examination/examinationSports/examinationSportsActions";
import {
  getIgseTermNameListAct,
  resetIgseTermNameListAct,
} from "../../../../../store/examination/examinationsettings/examinationsettingsaction";
import { resetSetSportsunAssignedClassesAct, reSetSportsNamesAct } from "../../../../../store/examination/examinationSports/examinationSportsSlice";
import { itemsEqual } from "@dnd-kit/sortable/dist/utilities";

const initialValues = {
  academicYearId: "",
  curriculumId: "",
  sportsId: "",
  classIds: [] as { classId: string; shortName: string }[],
  termId: "",
};

const validationSchema = Yup.object().shape({
  academicYearId: Yup.string().required("Academic Year is required"),
  curriculumId: Yup.string().required("Curriculum is required"),
  termId: Yup.string().required("Term is required"),
  sportsId: Yup.string().required("Sports is required"),
  classIds: Yup.array()
    .min(1, "At least one class is required")
    .required("Class is required")
    .nullable(),
});

const AddEditMapSportsToClassModal = ({ toggle, itemId, isOpen }) => {
  const [selectedClassIds, setSelectedClassIds] = useState([]);

  const dispatch = useAppDispatch();
  const mapSportsToClassesFormik = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      const { academicYearId, curriculumId, sportsId, classIds, termId } =
        values;

      if (itemId) {
        const formikClasses = classIds.map((item) => item.classId);

        const formatedClasses = selectedClassIds.map((item: any) => {
          if (formikClasses.includes(item.classId)) {
            return { classId: item.classId, id: item.id, isDeleted: false };
          } else {
            return { classId: item.classId, id: item.id, isDeleted: true };
          }
        });

        const payload = {
          sportsId,
          academicYearId,
          branchId,
          curriculumId,
          termId,
          classes: formatedClasses,
        };
        dispatch(
          editSportsClassMappingItemAct(
            generateActionPayload(
              "edit_sports_class_mapping_item",
              undefined,
              payload
            )
          )
        );
      } else {
        const modifedClassIds = classIds.map((item) => item.classId);
        const payload = {
          branchId,
          academicYearId,
          sportsId,
          termId,
          curriculumId,
          classIds: modifedClassIds,
        };

        dispatch(
          saveSportsClassMappingItemAct(
            generateActionPayload(
              "save_sports_class_mapping_item",
              undefined,
              payload
            )
          )
        );
      }
    },
  });

  const {
    showApiLoader,
    currentBranchIdResp: branchId,
    academicYearListResp,
    brchCurriculumResp,
    getSportsNamesResp,
    getIgseTermNameListResp,
    branchClassResp,
    getSportsClassMappingByIdResp,
    getSportsunAssignedClassesResp,
    getSportsClassMappingListResp,
  } = useAppSelector(
    ({
      globalData,
      appData,
      instAcademics,
      branchAcademics,
      examinationSports,
      examinationSettings,
    }) => ({
      showApiLoader: globalData.showApiLoader,
      currentBranchIdResp: appData.currentBranchIdResp,
      academicYearListResp: instAcademics.academicYearListResp,
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      branchClassResp: branchAcademics.branchClassResp,
      getIgseTermNameListResp: examinationSettings.getIgseTermNameListResp,

      getSportsNamesResp: examinationSports.getSportsNamesResp,
      getSportsClassMappingByIdResp:
        examinationSports.getSportsClassMappingByIdResp,
      getSportsunAssignedClassesResp:
        examinationSports.getSportsunAssignedClassesResp,
      getSportsClassMappingListResp:
        examinationSports.getSportsClassMappingListResp,
    }),
    shallowEqual
  );

  function fetchCurriculumList(otherProps?: any) {
    const payload = {
      academicYearId: mapSportsToClassesFormik.values.academicYearId,
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
      curriculumId: mapSportsToClassesFormik.values.curriculumId,
      ...otherProps,
    };

    dispatch(
      getIgseTermNameListAct(
        generateActionPayload("get_igse_term_name_list", undefined, payload)
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

  function fetchClassNamesList(otherProps?: any) {
    const { academicYearId, curriculumId } = mapSportsToClassesFormik.values;
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

    dispatch(
      getBranchClassAct(
        generateActionPayload("get_brch_curriculum_class", undefined, payload)
      )
    );
  }

  function fetchUnAssignedClassNamesList(otherProps?: any) {
    const { academicYearId, curriculumId, termId, sportsId } =
      mapSportsToClassesFormik.values;
    const payload = {
      branchId,
      academicYearId,
      curriculumId,
      termId,
      sportsId,
      sortBy: "classSequence",
      orderBy: "asc",
      pageNo: 0,
      pageSize: 100,
      ...otherProps,
    };

    dispatch(
      getSportsunAssignedClassesAct(
        generateActionPayload(
          "get_sports_unAssigned_classes",
          undefined,
          payload
        )
      )
    );
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
      mapSportsToClassesFormik.setFieldValue(name!, selectedOptions);
    } else {
      mapSportsToClassesFormik.setFieldValue(name!, null);
    }
  }

  function filterHandler(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    if (name === "academicYearId") {
      mapSportsToClassesFormik.setValues((prev: any) => ({
        ...prev,
        [name]: value,
        curriculumId: "",
        termId: "",
        classIds: "",
        sportsId: "",
      }));

      if (value) {
        fetchCurriculumList({ academicYearId: value });
        dispatch(resetBrchClassAct(undefined));
      } else {
        dispatch(resetBrchCurriculumAct(undefined));
        dispatch(resetBrchClassAct(undefined));
      }
    } else if (name === "curriculumId") {
      mapSportsToClassesFormik.setValues((prev: any) => ({
        ...prev,
        [name]: value,
        termId: "",
        classIds: "",
        sportsId: "",
      }));

      if (value) {
        fetchTermList({ curriculumId: value });
      } else {
        dispatch(resetIgseTermNameListAct(undefined));
        dispatch(resetBrchClassAct(undefined));
      }
    } else if (name === "termId") {
      mapSportsToClassesFormik.setValues((prev: any) => ({
        ...prev,
        [name]: value,
        classIds: "",
      }));

      if (value) {
        fetchExaminationSportsNames({
          academicYearId: mapSportsToClassesFormik.values.academicYearId,
          branchId,
        });
      } else {
        dispatch(reSetSportsNamesAct(undefined));
        dispatch(resetBrchClassAct(undefined));
      }
    } else if (name === "sportsId") {
      mapSportsToClassesFormik.setValues((prev: any) => ({
        ...prev,
        [name]: value,
      }));

      if (value) {
        fetchUnAssignedClassNamesList({ sportsId: value });
      } else {
        dispatch(resetBrchClassAct(undefined));
      }
    } else {
      mapSportsToClassesFormik.setValues((prev: any) => ({
        ...prev,
        [name]: value,
      }));
    }
  }

  useEffect(() => {
    const yearId =
      academicYearListResp &&
      academicYearListResp.data.find(
        (year: any) => year.yearStatus.toLowerCase() === "current"
      )?.academicYearId;

    mapSportsToClassesFormik.setFieldValue("academicYearId", yearId);
    fetchCurriculumList({ academicYearId: yearId });
  }, [academicYearListResp, isOpen]);

  // useEffect(() => {
  //   if (isOpen && itemId && getSportsClassMappingByIdResp) {
  //     const {
  //       sportsId,
  //       academicYearId,
  //       termId,
  //       curriculumId,
  //       classDetailsDto,
  //     } = getSportsClassMappingByIdResp || {};

  //     mapSportsToClassesFormik.setValues({
  //       ...mapSportsToClassesFormik.values,
  //       sportsId: sportsId || "",
  //       academicYearId: academicYearId || "",
  //       termId: termId || "",
  //       curriculumId: curriculumId || "",
  //     });
  //     if (academicYearId) {
  //       fetchCurriculumList({ academicYearId });
  //     }
  //     if (curriculumId) {
  //       fetchTermList({ curriculumId });
  //       fetchClassNamesList({ curriculumId });
  //       fetchUnAssignedClassNamesList({
  //         academicYearId,
  //         curriculumId,
  //         termId,
  //         sportsId,
  //       });
  //     }
  //   }
  // }, [itemId, getSportsClassMappingByIdResp, isOpen]);

  const { data: sportsClassMappingList } = getSportsClassMappingListResp || {};

  useEffect(() => {
    if (getSportsunAssignedClassesResp) {
      const allClasses = getSportsunAssignedClassesResp;
      const modifiedClasses = allClasses.map((item) => ({
        ...item,
        classId: item.id,
      }));

      setSelectedClassIds(modifiedClasses);
    }
  }, [getSportsunAssignedClassesResp]);

  useEffect(() => {
    if (itemId) {
      const selectedItemData = sportsClassMappingList?.find(
        (item) => +item?.uniqueId === +itemId
      );
      const {
        sportsId,
        academicYearId,
        termId,
        curriculumId,
        classDetailsDto,
      } = selectedItemData || {};

      const formatedClassesList = classDetailsDto.map((item) => ({
        ...item,
        shortName: item.classShortName,
      }));

      mapSportsToClassesFormik.setFieldValue("academicYearId", academicYearId);
      mapSportsToClassesFormik.setFieldValue("curriculumId", curriculumId);
      mapSportsToClassesFormik.setFieldValue("termId", termId);
      mapSportsToClassesFormik.setFieldValue("sportsId", sportsId);
      mapSportsToClassesFormik.setFieldValue("classIds", formatedClassesList);
      setSelectedClassIds(formatedClassesList);

      if (academicYearId) {
        fetchCurriculumList({ academicYearId: academicYearId });
      }
      if (curriculumId) {
        fetchTermList({ curriculumId: curriculumId });
      }
    }
  }, [itemId]);

  useEffect(() => {
    return () => {
      dispatch(resetIgseTermNameListAct(undefined));
      dispatch(resetBrchClassAct(undefined));
      dispatch(resetSetSportsunAssignedClassesAct(undefined));
      // mapSportsToClassesFormik.setFieldValue("classIds", []);
      // setSelectedClassIds([]);
    };
  }, []);

  return (
    <FormikProvider value={mapSportsToClassesFormik}>
      <form onSubmit={mapSportsToClassesFormik.handleSubmit}>
        <div style={{ padding: "1.25rem" }}>
          <div className="row">
            <div className="col-xs-12 col-md-6">
              <SelectInput
                name="academicYearId"
                value={mapSportsToClassesFormik.values.academicYearId}
                onChange={filterHandler}
                onBlur={mapSportsToClassesFormik.handleBlur}
                menuItems={academicYearListResp?.data}
                valueKey="academicYearId"
                textKey="academicYearName"
                labelText="Academic Year"
                labelClass="required"
                isDisabled={itemId}
                invalid={
                  !!(
                    mapSportsToClassesFormik.touched.academicYearId &&
                    mapSportsToClassesFormik.errors.academicYearId
                  )
                }
                error={
                  mapSportsToClassesFormik.touched.academicYearId &&
                  mapSportsToClassesFormik.errors.academicYearId
                    ? mapSportsToClassesFormik.errors.academicYearId
                    : ""
                }
              />
            </div>

            <div className="col-xs-12 col-md-6">
              <SelectInput
                name="curriculumId"
                value={mapSportsToClassesFormik.values.curriculumId}
                onChange={filterHandler}
                onBlur={mapSportsToClassesFormik.handleBlur}
                menuItems={brchCurriculumResp?.data}
                valueKey="branchCurriculumId"
                textKey="curriculumName"
                labelText="Curriculum"
                labelClass="required"
                isDisabled={itemId}
                invalid={
                  !!(
                    mapSportsToClassesFormik.touched.curriculumId &&
                    mapSportsToClassesFormik.errors.curriculumId
                  )
                }
                error={
                  mapSportsToClassesFormik.touched.curriculumId &&
                  mapSportsToClassesFormik.errors.curriculumId
                    ? mapSportsToClassesFormik.errors.curriculumId
                    : ""
                }
              />
            </div>

            <div className="col-xs-12 col-md-6 mt-md-0">
              <SelectInput
                name="termId"
                value={mapSportsToClassesFormik.values.termId}
                onChange={filterHandler}
                onBlur={mapSportsToClassesFormik.handleBlur}
                menuItems={
                  Array.isArray(getIgseTermNameListResp?.data)
                    ? getIgseTermNameListResp?.data
                    : []
                }
                valueKey="termId"
                textKey="termName"
                labelText="Term"
                labelClass="required"
                isDisabled={itemId}
                invalid={
                  !!(
                    mapSportsToClassesFormik.touched.termId &&
                    mapSportsToClassesFormik.errors.termId
                  )
                }
                error={
                  mapSportsToClassesFormik.touched.termId &&
                  mapSportsToClassesFormik.errors.termId
                    ? mapSportsToClassesFormik.errors.termId
                    : ""
                }
              />
            </div>

            <div className="col-xs-12 col-md-6 mt-md-0">
              <SelectInput
                name="sportsId"
                value={mapSportsToClassesFormik.values.sportsId}
                onChange={filterHandler}
                onBlur={mapSportsToClassesFormik.handleBlur}
                menuItems={getSportsNamesResp?.data || []}
                valueKey="id"
                textKey="sportName"
                labelText="Sports"
                labelClass="required"
                isDisabled={itemId}
                invalid={
                  !!(
                    mapSportsToClassesFormik.touched.sportsId &&
                    mapSportsToClassesFormik.errors.sportsId
                  )
                }
                error={
                  mapSportsToClassesFormik.touched.sportsId &&
                  mapSportsToClassesFormik.errors.sportsId
                    ? mapSportsToClassesFormik.errors.sportsId
                    : ""
                }
              />
            </div>

            <div className="col-xs-12 col-md-6 mt-md-0">
              <MultiSelectCheckbox
                name="classIds"
                idKey="classId"
                labelText="Classes"
                labelClass="required"
                value={mapSportsToClassesFormik.values.classIds}
                renderValue={renderSelectedClass}
                renderOptions={renderOptionClass}
                onChange={onSelectClassHndlr}
                searchKey="branchShortName"
                options={selectedClassIds}
                invalid={
                  !!(
                    mapSportsToClassesFormik.touched.classIds &&
                    mapSportsToClassesFormik.errors.classIds
                  )
                }
                error={
                  mapSportsToClassesFormik.touched.classIds &&
                  mapSportsToClassesFormik.errors.classIds
                    ? mapSportsToClassesFormik.errors.classIds
                    : ""
                }
              ></MultiSelectCheckbox>
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
                {itemId ? "Update" : "Submit"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </FormikProvider>
  );
};

export default AddEditMapSportsToClassModal;
