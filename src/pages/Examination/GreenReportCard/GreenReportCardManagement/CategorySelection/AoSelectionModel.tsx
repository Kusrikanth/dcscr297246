import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { generateColumnsI } from "./helper";
import { SelectInput, MultiSelectCheckbox } from "../../../../../Components/Common";
import TableContainer from "../../../../../Components/Common/TableContainer";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { generateActionPayload } from "../../../../../utility/reduxutility";
import { getAssignCurriculumListAct, getAssignLanClassListAct } from "../../../../../store/assignlanguages/assignlanguagesaction";
import { getAoMappingSubjectAct, getIgseTermNameListAct } from "../../../../../store/examination/examinationsettings/examinationsettingsaction";
import { getGreenReportCardCategoryListAct, saveCategorySelectionAct, updateCategorySelectionAct } from "../../../../../store/examination/pvaReports/pvaReportsActions";

const initialValues = {
  academicYearId: "",
  categoryId: "",
  termId: "",
  classIds: [] as any[],
  curriculumId: "",
};

const validationSchema = Yup.object().shape({
  academicYearId: Yup.string().required("Academic Year is required."),
  curriculumId: Yup.string().required("Curriculum is required."),
  classIds: Yup.array()
    .of(
      Yup.object().shape({
        classId: Yup.string().required(),
        shortName: Yup.string().nullable(),
      })
    )
    .min(1, "At least one Class must be selected"),
  termId: Yup.string().required("Term is required."),
  categoryId: Yup.string().required("Subject is required."),
});

const AoSelection: React.FC<any> = (props) => {
  const dispatch = useAppDispatch();
  const [selectedSubjectState, setSelectedSubjectState] = useState<any[]>([]);
  const [allStudentSelectedState, setAllStudentSelectedState] = useState(false);
  const [selectedClassIds, setSelectedClassIds] = useState<any[]>([]);

  const {
    academicYearListResp,
    currentBranchIdResp: branchId,
    getIgseTermNameListResp,
    getAssignLanClassListResp,
    getAssignListCurriculumResp,
    getGreenReportCardCategoryListResp,
    getCategorySelectionByIdResp
  } = useAppSelector(
    ({ instAcademics, appData, examinationSettings, assignLanguages, pvaReports }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      getIgseTermNameListResp: examinationSettings.getIgseTermNameListResp,
      getAssignLanClassListResp: assignLanguages.getAssignLanClassListResp,
      getAssignListCurriculumResp: assignLanguages.getAssignListCurriculumResp,
      getGreenReportCardCategoryListResp: pvaReports.getGreenReportCardCategoryListResp,
      getCategorySelectionByIdResp: pvaReports.getCategorySelectionByIdResp,

    }),
    shallowEqual
  );

  const changeAoSelectionFormik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      const selectedIds = selectedSubjectState
        .filter(sub => sub.isSelected)
        .map(sub => sub.subCategoryId);

      const selectedClassIds = Array.isArray(values.classIds)
        ? values.classIds.map((cls: any) => cls.classId)
        : [];


      const payload = {
        instituteId: branchId,
        branchId,
        academicYearId: values.academicYearId,
        curriculumId: values.curriculumId,
        classIds: selectedClassIds,
        termId: values.termId,
        categoryId: values.categoryId,
        subCategoryIds: selectedIds,
      }
      console.log(payload, "payload")
      if (props.modalData1) {
        dispatch(updateCategorySelectionAct(generateActionPayload("update_category_selection", { id: props.modalData1 }, { subCategoryIds: selectedIds })));
      }
      else {
        dispatch(saveCategorySelectionAct(generateActionPayload("save_category_selection", undefined, payload)));
      }
    },
  });


  const getAoMappingApiCall = (otherProps?: any) => {
    const firstClassId = changeAoSelectionFormik.values.classIds?.[0]?.classId || "";
    const payload = {
      branchId,
      academicYearId: changeAoSelectionFormik.values.academicYearId,
      curriculumId: changeAoSelectionFormik.values.curriculumId,
      classId: firstClassId,
      termId: changeAoSelectionFormik.values.termId,
      categoryId: changeAoSelectionFormik.values.categoryId,
      ...otherProps,
    }
    if (payload.academicYearId && payload.curriculumId && payload.classId && payload.termId && payload.categoryId) {
      dispatch(getAoMappingSubjectAct(generateActionPayload("get_ao_mapping_subjects", undefined, payload)));
    }
  }

  function fetchGreenReportCardCategoryList(otherProps?: any) {
    const { academicYearId } = changeAoSelectionFormik.values;
    const payload = {
      branchId,
      academicYearId,
      searchString: "",
      ...otherProps,
    };
    dispatch(
      getGreenReportCardCategoryListAct(
        generateActionPayload(
          'get_green_report_card_category_list',
          undefined,
          payload,
        ),
      ),
    );
  }

  useEffect(() => {
    if (changeAoSelectionFormik.values.academicYearId && changeAoSelectionFormik.values.curriculumId) {
      getClassApiCall(changeAoSelectionFormik.values.curriculumId);
    }
  }, [changeAoSelectionFormik.values.academicYearId, changeAoSelectionFormik.values.curriculumId]);

  useEffect(() => {
    if (getAssignLanClassListResp?.content?.length) {
      const classes = getAssignLanClassListResp.content.map((item: any) => ({
        classId: item.id,
        shortName: item.shortName
      }));
      setSelectedClassIds(classes);

      const currentFormClassIds = changeAoSelectionFormik.values.classIds;
      if (currentFormClassIds && currentFormClassIds.length > 0) {
        const updatedFormClassIds = currentFormClassIds.map((c: any) => {
          if (!c.shortName) {
            const found = classes.find((cls: any) => String(cls.classId) === String(c.classId));
            return found ? { ...c, shortName: found.shortName } : c;
          }
          return c;
        });

        const needsUpdate = updatedFormClassIds.some((c: any, i: number) => c.shortName !== currentFormClassIds[i].shortName);
        if (needsUpdate) {
          changeAoSelectionFormik.setFieldValue("classIds", updatedFormClassIds);
        }
      }
    } else {
      setSelectedClassIds([]);
    }
  }, [getAssignLanClassListResp, changeAoSelectionFormik.values.classIds]);

  useEffect(() => {
    if (getCategorySelectionByIdResp && props.modalData1) {
      const { academicYearId, curriculumId, classId, className, categoryId, termId } = getCategorySelectionByIdResp;

      const classList = classId ? [{ classId: String(classId), shortName: className || "" }] : [];

      changeAoSelectionFormik.setValues((prev: any) => ({
        ...prev,
        academicYearId,
        curriculumId,
        classIds: classList,
        categoryId,
        termId
      }));

      getCurriculumApiCall({ academicYearId });
      if (curriculumId) {
        let payload = {
          branchId,
          curriculumId,
        };
        dispatch(getIgseTermNameListAct(generateActionPayload("get_igse_term_name_list", undefined, payload)));
        fetchGreenReportCardCategoryList({ academicYearId, curriculumId})
      }
    }
  }, [getCategorySelectionByIdResp, props.modalData1]);

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
      changeAoSelectionFormik.setFieldValue(name!, selectedOptions);
    } else {
      changeAoSelectionFormik.setFieldValue(name!, []);
    }
  }

  function getClassApiCall(selectedCurriculumId: string) {
    const payload = {
      academicYearId: changeAoSelectionFormik.values.academicYearId,
      curriculumId: selectedCurriculumId,
      branchId,
      pageNo: 0, pageSize: 100, sortBy: "classSequence", orderBy: "asc",
    };

    dispatch(getAssignLanClassListAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
  }

  const getCurriculumApiCall = (otherProps?: any) => {
    const payload1 = { academicYearId: changeAoSelectionFormik.values.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", ...otherProps };
    dispatch(getAssignCurriculumListAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
  }

  useEffect(() => {
    if (props.modalData && !props.modalData1) {
      const { academicYearId, categoryId, termId, classId, curriculumId } = props.modalData;
      changeAoSelectionFormik.setFieldValue("academicYearId", academicYearId);
      changeAoSelectionFormik.setFieldValue("curriculumId", curriculumId);

      const classList = classId ? [{
        classId: String(classId),
        shortName: props.modalData.className || "",
      }] : [];
      changeAoSelectionFormik.setFieldValue("classIds", classList);

      changeAoSelectionFormik.setFieldValue("categoryId", categoryId);
      changeAoSelectionFormik.setFieldValue("termId", termId);

      if (academicYearId) {
        getCurriculumApiCall({ academicYearId })
      }
      if (classId && curriculumId && academicYearId) {
        getAoMappingApiCall({ classId, curriculumId, academicYearId, categoryId, termId });
      }
    }
  }, []);


  const allStudentCheckHndlr = useCallback((event: any) => {
    const { checked } = event.target;
    setAllStudentSelectedState(checked);
    let updateStudentState = [...selectedSubjectState];
    updateStudentState.forEach((item: any) => {
      item.isSelected = checked;
      if (!checked) {
        item.errors = {};
      }
    });
    setSelectedSubjectState(updateStudentState);
  }, [selectedSubjectState]);

  const singleStudentCheckHndlr = useCallback((event: any) => {
    const { checked } = event.currentTarget
    const subCategoryId = event.currentTarget.getAttribute("data-id")
    const studentRowIndex = selectedSubjectState.findIndex((item: any) => +item.subCategoryId === Number(subCategoryId));
    if (studentRowIndex > -1) {
      const studentDetails: any = selectedSubjectState[studentRowIndex];
      let updateStudentState: any = [...selectedSubjectState];
      updateStudentState.splice(studentRowIndex, 1, {
        ...studentDetails, isSelected: checked, ...(checked ? {} : { errors: {} }),
      });

      setSelectedSubjectState(updateStudentState);
      const isAllSelected = updateStudentState.every((item: any) => item.isSelected);
      setAllStudentSelectedState(isAllSelected);
    }
  }, [selectedSubjectState]);

  const filterHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name !== 'categoryId') {
      getAoMappingApiCall({ [name]: value });
    }
    if (name === "academicYearId") {
      getCurriculumApiCall({ academicYearId: value });
      changeAoSelectionFormik.setValues((prev: any) => ({
        ...prev,
        [name]: value,
        classIds: [],
        curriculumId: prev.curriculumId ? prev.curriculumId : "",
      }));
    }
    if (name === "curriculumId") {
      changeAoSelectionFormik.setValues((prev: any) => ({ ...prev, [name]: value, termId: "" }));
      getAoMappingApiCall({ curriculumId: value });
      let payload = {
        branchId,
        curriculumId: value,
      };
      dispatch(getIgseTermNameListAct(generateActionPayload("get_igse_term_name_list", undefined, payload)));
      fetchGreenReportCardCategoryList({ curriculumId:value });
    }
    else {
      changeAoSelectionFormik.setValues((prev: any) => ({ ...prev, [name]: value }))
    }
  }

  useEffect(() => {
    if (changeAoSelectionFormik.values.categoryId && getGreenReportCardCategoryListResp?.content) {
      const selectedCategory = getGreenReportCardCategoryListResp.content.find((cat: any) => cat.categoryId === Number(changeAoSelectionFormik.values.categoryId));

      const selectedSubCategoryIds = getCategorySelectionByIdResp?.subCategories?.map((item: any) => item.subCategoryId) || [];

      if (selectedCategory && selectedCategory.subCategories) {
        const updatedSubCategories = selectedCategory.subCategories.map((sub: any) => ({
          ...sub,
          isSelected: props.modalData1 ? selectedSubCategoryIds.includes(sub.subCategoryId) : false
        }));

        setSelectedSubjectState(updatedSubCategories);

        const allSelected = selectedSubCategoryIds.length > 0 && props.modalData1 && selectedSubCategoryIds.length === selectedCategory.subCategories.length;
        setAllStudentSelectedState(allSelected);
      } else {
        setSelectedSubjectState([]);
        setAllStudentSelectedState(false);
      }
    } else {
      setSelectedSubjectState([]);
      setAllStudentSelectedState(false);
    }
  }, [changeAoSelectionFormik.values.categoryId, getGreenReportCardCategoryListResp?.content, getCategorySelectionByIdResp, props.modalData1]);

  const roleColumns = useMemo(() => generateColumnsI(allStudentSelectedState, allStudentCheckHndlr, singleStudentCheckHndlr), [allStudentSelectedState, selectedSubjectState]);
  const { data: academicYearList } = academicYearListResp || {};
  const { data: curriculumTypes } = getAssignListCurriculumResp || {}

  return (
    <>
      <form>
        <div className="row px-4">
          <div className="row g-3 mb-3">

            <div className="col-xs-12 col-md-3">
              <SelectInput
                name="academicYearId"
                value={changeAoSelectionFormik.values.academicYearId}
                onChange={filterHandler}
                menuItems={academicYearList || []}
                valueKey="academicYearId"
                textKey="academicYearName"
                labelText="Academic Year"
                isDisabled={props.modalData1 && true}
                labelClass="required"
                invalid={(changeAoSelectionFormik.touched.academicYearId && changeAoSelectionFormik.errors.academicYearId) ? true : false}
                error={(changeAoSelectionFormik.touched.academicYearId && changeAoSelectionFormik.errors.academicYearId) ? changeAoSelectionFormik.errors.academicYearId : ""}
              />
            </div>
            <div className="col-xs-12 col-md-3">
              <SelectInput
                name="curriculumId"
                value={changeAoSelectionFormik.values.curriculumId}
                onChange={filterHandler}
                menuItems={curriculumTypes}
                valueKey="branchCurriculumId"
                textKey="curriculumName"
                labelText="Curriculum"
                labelClass="required"
                isDisabled={props.modalData1 && true}
                invalid={(changeAoSelectionFormik.touched.curriculumId && changeAoSelectionFormik.errors.curriculumId) ? true : false}
                error={(changeAoSelectionFormik.touched.curriculumId && changeAoSelectionFormik.errors.curriculumId) ? changeAoSelectionFormik.errors.curriculumId : ""}
              />
            </div>
            <div className="col-xs-12 col-md-3">
              <MultiSelectCheckbox
                name="classIds"
                idKey="classId"
                labelText="Classes"
                labelClass="required"
                value={changeAoSelectionFormik.values.classIds}
                renderValue={renderSelectedClass}
                renderOptions={renderOptionClass}
                onChange={onSelectClassHndlr}
                searchKey="shortName"
                options={selectedClassIds}
                invalid={
                  !!(
                    changeAoSelectionFormik.touched.classIds &&
                    changeAoSelectionFormik.errors.classIds
                  )
                }
                error={
                  changeAoSelectionFormik.touched.classIds &&
                    changeAoSelectionFormik.errors.classIds
                    ? changeAoSelectionFormik.errors.classIds
                    : ""
                }
                isDisabled={props.modalData1 && true}
              />
            </div>

            <div className="col-xs-12 col-md-3">
              <SelectInput
                name="termId"
                labelText="Term Name"
                labelClass="required"
                value={changeAoSelectionFormik.values.termId}
                onChange={filterHandler}
                menuItems={Array.isArray(getIgseTermNameListResp?.data) ? getIgseTermNameListResp?.data : []}
                valueKey="termId"
                textKey="termName"
                isDisabled={props.modalData1 && true}
                formgroupClassName="mb-0"
                invalid={changeAoSelectionFormik.touched.termId &&
                  changeAoSelectionFormik.errors.termId
                  ? true
                  : false}
                error={changeAoSelectionFormik.touched.termId &&
                  changeAoSelectionFormik.errors.termId
                  ? changeAoSelectionFormik.errors.termId
                  : ""}
              />
            </div>
            <div className="col-xs-12 col-md-3">
              <SelectInput
                name="categoryId"
                value={changeAoSelectionFormik.values.categoryId}
                onChange={filterHandler}
                menuItems={Array.isArray(getGreenReportCardCategoryListResp?.content) ? getGreenReportCardCategoryListResp?.content : []}
                valueKey="categoryId"
                textKey="categoryName"
                labelText="Category"
                isDisabled={props.modalData1 && true}
                labelClass="required"
                invalid={(changeAoSelectionFormik.touched.categoryId && changeAoSelectionFormik.errors.categoryId) ? true : false}
                error={(changeAoSelectionFormik.touched.categoryId && changeAoSelectionFormik.errors.categoryId) ? changeAoSelectionFormik.errors.categoryId : ""}
              />
            </div>
          </div>
          <TableContainer
            columns={roleColumns || []}
            data={changeAoSelectionFormik.values.categoryId ? selectedSubjectState : []}
            showCheckbox={false}
            divClass="table-responsive overflow-auto"
            theadClass="table-light text-muted align-middle"
          />
          <div className="row">
            <div className="d-flex gap-2 w-auto ms-auto mx-4 my-3">
              <button
                type="button"
                className={"btn btn-light"}
                onClick={(event: any) => props.toggle()}
              >
                Close
              </button>
              <button
                type="button"
                className={`btn btn-success
                `}
                onClick={(event: any) =>
                  changeAoSelectionFormik.handleSubmit(event)
                }
              >
                Submit
              </button>
            </div>
          </div>
        </div>

      </form>
    </>
  );
};

export default AoSelection;
