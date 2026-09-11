import { useFormik, FormikProvider, FieldArray } from "formik";
import * as Yup from "yup";
import {
  MultiSelectCheckbox,
  SelectInput,
  TextInput,
} from "../../../../../Components/Common";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02StrokeStandard } from "@hugeicons-pro/core-stroke-standard";
import React, { useCallback, useEffect, useMemo, useState } from "react";
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
  editAssignSportsToStudentsAct,
  editSportsClassMappingItemAct,
  getAssignSportsToStudentsListAct,
  getSportsByClassesListAct,
  getSportsNamesAct,
  getSportsNotAssignedStudentsListAct,
  saveAssignSportsToStudentsAct,
  saveSportsClassMappingItemAct,
} from "../../../../../store/examination/examinationSports/examinationSportsActions";
import {
  getIgseTermNameListAct,
  resetIgseTermNameListAct,
} from "../../../../../store/examination/examinationsettings/examinationsettingsaction";
import StudentSearchInput from "./StudentSearchInput";
import TableContainer from "../../../../../Components/Common/TableContainer";
import { sportsNotAssignedStudentsColumns } from "./helper";
import {
  debounce,
  searhWithTextInList,
} from "../../../../../utility/commonutility";
import {
  getSectionList,
  resetSectionListAct,
} from "../../../../../store/academic/classroomManagment/classroommanagmentactions";
import {
  resetNotAssignedStudentsListAct,
  resetSportsClassesListAct,
} from "../../../../../store/examination/examinationSports/examinationSportsSlice";

// import SelectStudent from "../../../../FreeModules/SpecialFee/AddSpecialFeeModal/SelectStudent";

const initialValues = {
  academicYearId: "",
  curriculumId: "",
  sportsId: "",
  sportClassId: "",
  termId: "",
  studentDetailIds: [],
  searchString: "",
  sectionId: "",
  branchClassId: "",
};

const validationSchema = Yup.object().shape({
  academicYearId: Yup.string().required("Academic Year is required"),
  curriculumId: Yup.string().required("Curriculum is required"),
  termId: Yup.string().required("Term is required"),
  sportsId: Yup.string().required("Sports is required"),
  sportClassId: Yup.string().required("Class is required"),
  // sectionId: Yup.string().required("Section is required"),
});

const AssignSportsToStudentsModal = ({ toggle, itemId, isOpen }) => {
  const [availableStudentState, setAvailableStudentState] = useState([]);
  const [searchStudentListState, setSearchStudentListState] = useState([]);
  const [allSearchedStudentSelectedState, setAllSearchedStudentSelectedState] =
    useState(false);

  const dispatch = useAppDispatch();
  const assignSportsToStudentsFormik = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      const { sportClassId } = values;

      if (itemId) {
        const editStudentIds = availableStudentState
          .filter((item: any) => !item.isSelected)
          .map((item: any) => item?.assignId);
        dispatch(
          editAssignSportsToStudentsAct(
            generateActionPayload(
              "edit_assign_sports_to_students",
              undefined,
              editStudentIds
            )
          )
        );
      } else {
        const postStudentIds = availableStudentState
          .filter((item: any) => item?.isSelected)
          .map((item: any) => item?.id);
        const payload = {
          sportClassId,
          studentIds: postStudentIds,
        };

        dispatch(
          saveAssignSportsToStudentsAct(
            generateActionPayload(
              "save_assign_sports_to_students",
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
    getSportsClassesListResp,
    sectionListResp,
    loggedInUserRole,
    getNotAssignedStudentsListResp,
    getAssignSportsToStudentItemByIdResp,
  } = useAppSelector(
    ({
      globalData,
      appData,
      instAcademics,
      branchAcademics,
      examinationSports,
      examinationSettings,
      classroomManagmentInfo,
    }) => ({
      showApiLoader: globalData.showApiLoader,
      currentBranchIdResp: appData.currentBranchIdResp,
      academicYearListResp: instAcademics.academicYearListResp,
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      branchClassResp: branchAcademics.branchClassResp,
      getIgseTermNameListResp: examinationSettings.getIgseTermNameListResp,
      getSportsClassesListResp: examinationSports.getSportsClassesListResp,
      getAssignSportsToStudentItemByIdResp:
        examinationSports.getAssignSportsToStudentItemByIdResp,
      getNotAssignedStudentsListResp:
        examinationSports.getNotAssignedStudentsListResp,
      sectionListResp: classroomManagmentInfo.sectionListResp,
      loggedInUserRole: appData.loggedInUserRole,
      getSportsNamesResp: examinationSports.getSportsNamesResp,
      getSportsClassMappingByIdResp:
        examinationSports.getSportsClassMappingByIdResp,
    }),
    shallowEqual
  );

  function fetchCurriculumList(otherProps?: any) {
    const payload = {
      academicYearId: assignSportsToStudentsFormik.values.academicYearId,
      branchId,
      pageNo: 0,
      pageSize: 100,
      sortBy: "curriculumName",
      orderBy: "asc",
      ...otherProps,
    };
    if (loggedInUserRole === "TEACHER") {
      payload.progressCardType = "SPORTS";
    }
    dispatch(
      getBranchCurriculumAct(
        generateActionPayload("get_brch_curriculum", undefined, payload)
      )
    );
  }

  function fetchTermList(otherProps?: any) {
    const payload = {
      branchId,
      curriculumId: assignSportsToStudentsFormik.values.curriculumId,
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

  function fetchSportsClassesList(otherProps?: any) {
    const { academicYearId, curriculumId, termId, sportsId } =
      assignSportsToStudentsFormik.values;
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

  function fetchSectionList(otherProps?: any) {
    let payload = {
      masterAcademicYearId: assignSportsToStudentsFormik.values.academicYearId,
      curriculumId: assignSportsToStudentsFormik.values.curriculumId,
      pageNo: 0,
      pageSize: 100,
      sortBy: "sectionName",
      orderBy: "asc",
      ...otherProps,
    };
    if (loggedInUserRole === "TEACHER") {
      payload.progressCardType = "SPORTS";
    }
    dispatch(
      getSectionList(
        generateActionPayload("get_section_list", undefined, payload)
      )
    );
  }

  function fetchNotAssignedStudentsList(otherProps?: any) {
    const { academicYearId, curriculumId, termId, sportsId, sportClassId } =
      assignSportsToStudentsFormik.values;
    const payload = {
      branchId,
      academicYearId,
      curriculumId,
      termId,
      sportsId,
      sportClassId,
      ...otherProps,
    };

    dispatch(
      getSportsNotAssignedStudentsListAct(
        generateActionPayload(
          "get_not_assigned_students_list",
          undefined,
          payload
        )
      )
    );
  }

  function filterHandler(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    if (name === "academicYearId") {
      assignSportsToStudentsFormik.setValues((prev: any) => ({
        ...prev,
        [name]: value,
        curriculumId: "",
        termId: "",
        sportsId: "",
      }));

      if (value) {
        fetchCurriculumList({ academicYearId: value });
      } else {
        dispatch(resetBrchCurriculumAct(undefined));
        dispatch(resetBrchClassAct(undefined));
      }
    } else if (name === "curriculumId") {
      assignSportsToStudentsFormik.setValues((prev: any) => ({
        ...prev,
        [name]: value,
        termId: "",
        sportsId: "",
        sportClassId: "",
        sectionId: "",
        studentDetailIds: [],
      }));

      if (value) {
        fetchTermList({ curriculumId: value });
      } else {
        dispatch(resetBrchClassAct(undefined));
      }
    } else if (name === "sportsId") {
      assignSportsToStudentsFormik.setValues((prev: any) => ({
        ...prev,
        [name]: value,
        sportClassId: "",
        sectionId: "",
        studentDetailIds: [],
      }));
      if (value) {
        fetchSportsClassesList({ sportsId: value });
      }
    } else if (name === "sportClassId") {
      assignSportsToStudentsFormik.setValues((prev: any) => ({
        ...prev,
        [name]: value,
        sectionId: "",
        studentDetailIds: [],
        branchClassId: "",
      }));
      if (value) {
        fetchNotAssignedStudentsList({ sportClassId: value });
      }
    } else if (name === "sectionId") {
      assignSportsToStudentsFormik.setValues((prev: any) => ({
        ...prev,
        [name]: value,
      }));

      fetchNotAssignedStudentsList({ sectionId: value });
    } else {
      assignSportsToStudentsFormik.setValues((prev: any) => ({
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

    assignSportsToStudentsFormik.setFieldValue("academicYearId", yearId);
    fetchCurriculumList({ academicYearId: yearId });
    fetchExaminationSportsNames();
  }, [academicYearListResp]);

  function updateSelectedAllHndlr(studentList: any) {
    if (Array.isArray(studentList) && studentList.length > 0) {
      const isAnyUnselected = studentList.some((item: any) => !item.isSelected);
      setAllSearchedStudentSelectedState(!isAnyUnselected);
    } else {
      setAllSearchedStudentSelectedState(false);
    }
  }

  const selectAllStudentHndlr = useCallback(
    (event: any) => {
      const { checked } = event.target;
      setAllSearchedStudentSelectedState(checked);
      const updateSearchStudentListState: any = [...searchStudentListState];
      const updatedAvailableStudentState: any = [...availableStudentState];

      const modifiedStudentId: any = [];
      updateSearchStudentListState.forEach((item: any) => {
        item.isSelected = checked;
        modifiedStudentId.push(item.id);
      });
      updatedAvailableStudentState.forEach((item: any) => {
        item.isSelected = modifiedStudentId.includes(item.id)
          ? checked
          : item.isSelected;
        modifiedStudentId.push(item.id);
      });
      setSearchStudentListState(updateSearchStudentListState);
      setAvailableStudentState(updatedAvailableStudentState);
      // updateSelectedAllHndlr(updatedAvailableStudentState);
    },
    [searchStudentListState]
  );
  const studentCheckHndlr = useCallback(
    (event: any) => {
      const { name, value, checked } = event.currentTarget,
        id = event.currentTarget.getAttribute("data-id"),
        studentIndex = availableStudentState.findIndex(
          (item: any) => item.id === Number(id)
        ),
        studentIndexInSearchedStudent = searchStudentListState.findIndex(
          (item: any) => item.id === Number(id)
        );
      if (studentIndex > -1 && studentIndexInSearchedStudent > -1) {
        const studentDetails: any = availableStudentState[studentIndex],
          updatedAvailableStudentState: any = [...availableStudentState],
          updatedSearchStudentState: any = [...searchStudentListState];
        updatedAvailableStudentState.splice(studentIndex, 1, {
          ...studentDetails,
          isSelected: checked,
        });
        updatedSearchStudentState.splice(studentIndexInSearchedStudent, 1, {
          ...studentDetails,
          isSelected: checked,
        });

        setAvailableStudentState(updatedAvailableStudentState);
        setSearchStudentListState(updatedSearchStudentState);
        updateSelectedAllHndlr(updatedSearchStudentState);
      }
    },
    [searchStudentListState]
  );

  function search(searchValue: any) {
    if (searchValue) {
      let filteredStudent: any = searhWithTextInList(
        availableStudentState,
        ["studentName", "studentCode"],
        searchValue
      );
      setSearchStudentListState(filteredStudent);
      updateSelectedAllHndlr(filteredStudent);
    } else {
      setSearchStudentListState(availableStudentState);
      updateSelectedAllHndlr(availableStudentState);
    }
  }
  const debounceFun = useCallback(debounce(search, 200), [
    availableStudentState,
  ]);
  const searchHandler = (event: any) => {
    const { name, value } = event.target;
    // setSearchState((prevState) => ({ ...prevState, [name]: value }));
    assignSportsToStudentsFormik.setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
    debounceFun(value);
    // getEmployees({ searchString: event.target.value });
  };

  const sportsNotAssignStudentListCol = useMemo(
    () =>
      sportsNotAssignedStudentsColumns(
        allSearchedStudentSelectedState,
        selectAllStudentHndlr,
        studentCheckHndlr
      ),
    [searchStudentListState]
  );

  useEffect(() => {
    if (!itemId && getNotAssignedStudentsListResp) {
      setAvailableStudentState(
        JSON.parse(JSON.stringify(getNotAssignedStudentsListResp))
      );
      setSearchStudentListState(
        JSON.parse(JSON.stringify(getNotAssignedStudentsListResp))
      );
    }
  }, [itemId, getNotAssignedStudentsListResp]);

  useEffect(() => {
    if (isOpen) {
      setSearchStudentListState([]);
    }
  }, [isOpen]);

  useEffect(() => {
    dispatch(resetNotAssignedStudentsListAct(undefined));
    dispatch(resetSectionListAct(undefined));
    dispatch(resetSportsClassesListAct(undefined));
  }, []);

  useEffect(() => {
    if (assignSportsToStudentsFormik.values.sportClassId) {
      const branchClassId =
        getSportsClassesListResp?.filter(
          (item) =>
            +item?.id === +assignSportsToStudentsFormik.values.sportClassId
        )[0]?.branchClassId || null;

      assignSportsToStudentsFormik.setFieldValue(
        "branchClassId",
        branchClassId
      );
      if (branchClassId && !itemId) {
        fetchSectionList({ branchClassId: branchClassId });
      }
    }
  }, [assignSportsToStudentsFormik.values.sportClassId]);

  useEffect(() => {
    if (itemId && getAssignSportsToStudentItemByIdResp) {
      const {
        sportClassId,
        sportsId,
        academicYearId,
        curriculumId,
        termId,
        studentCount,
        studentDetails,
      } = getAssignSportsToStudentItemByIdResp || {};

      const formatedStudents = studentDetails?.map((student) => ({
        id: student.studentId,
        ...student,
        isSelected: true,
      }));

      assignSportsToStudentsFormik.setFieldValue(
        "academicYearId",
        academicYearId
      );
      assignSportsToStudentsFormik.setFieldValue("curriculumId", curriculumId);
      assignSportsToStudentsFormik.setFieldValue("termId", termId);
      assignSportsToStudentsFormik.setFieldValue("sportsId", sportsId);
      assignSportsToStudentsFormik.setFieldValue("sportClassId", sportClassId);
      setAvailableStudentState(formatedStudents);
      setSearchStudentListState(formatedStudents);

      if (academicYearId) {
        fetchCurriculumList({ academicYearId: academicYearId });
      }
      if (curriculumId) {
        fetchTermList({ curriculumId: curriculumId });
      }
      if (sportsId) {
        fetchSportsClassesList({ sportsId: sportsId });
      }
    }
  }, [itemId, getAssignSportsToStudentItemByIdResp]);

  return (
    <FormikProvider value={assignSportsToStudentsFormik}>
      <form onSubmit={assignSportsToStudentsFormik.handleSubmit}>
        <div style={{ padding: "1.25rem" }}>
          <div className="row">
            <div className="col-xs-12 col-md-6">
              <SelectInput
                name="academicYearId"
                value={assignSportsToStudentsFormik.values.academicYearId}
                onChange={filterHandler}
                onBlur={assignSportsToStudentsFormik.handleBlur}
                menuItems={academicYearListResp?.data}
                valueKey="academicYearId"
                textKey="academicYearName"
                labelText="Academic Year"
                labelClass="required"
                isDisabled={itemId}
                invalid={
                  !!(
                    assignSportsToStudentsFormik.touched.academicYearId &&
                    assignSportsToStudentsFormik.errors.academicYearId
                  )
                }
                error={
                  assignSportsToStudentsFormik.touched.academicYearId &&
                  assignSportsToStudentsFormik.errors.academicYearId
                    ? assignSportsToStudentsFormik.errors.academicYearId
                    : ""
                }
              />
            </div>

            <div className="col-xs-12 col-md-6">
              <SelectInput
                name="curriculumId"
                value={assignSportsToStudentsFormik.values.curriculumId}
                onChange={filterHandler}
                onBlur={assignSportsToStudentsFormik.handleBlur}
                menuItems={brchCurriculumResp?.data}
                valueKey="branchCurriculumId"
                textKey="curriculumName"
                labelText="Curriculum"
                labelClass="required"
                isDisabled={itemId}
                invalid={
                  !!(
                    assignSportsToStudentsFormik.touched.curriculumId &&
                    assignSportsToStudentsFormik.errors.curriculumId
                  )
                }
                error={
                  assignSportsToStudentsFormik.touched.curriculumId &&
                  assignSportsToStudentsFormik.errors.curriculumId
                    ? assignSportsToStudentsFormik.errors.curriculumId
                    : ""
                }
              />
            </div>

            <div className="col-12 col-lg-6 mt-md-0">
              <SelectInput
                name="termId"
                value={assignSportsToStudentsFormik.values.termId}
                onChange={filterHandler}
                onBlur={assignSportsToStudentsFormik.handleBlur}
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
                    assignSportsToStudentsFormik.touched.termId &&
                    assignSportsToStudentsFormik.errors.termId
                  )
                }
                error={
                  assignSportsToStudentsFormik.touched.termId &&
                  assignSportsToStudentsFormik.errors.termId
                    ? assignSportsToStudentsFormik.errors.termId
                    : ""
                }
              />
            </div>

            <div className="col-xs-12 col-md-6 mt-md-0">
              <SelectInput
                name="sportsId"
                value={assignSportsToStudentsFormik.values.sportsId}
                onChange={filterHandler}
                onBlur={assignSportsToStudentsFormik.handleBlur}
                menuItems={getSportsNamesResp?.data || []}
                valueKey="id"
                textKey="sportName"
                labelText="Sports"
                labelClass="required"
                isDisabled={itemId}
                invalid={
                  !!(
                    assignSportsToStudentsFormik.touched.sportsId &&
                    assignSportsToStudentsFormik.errors.sportsId
                  )
                }
                error={
                  assignSportsToStudentsFormik.touched.sportsId &&
                  assignSportsToStudentsFormik.errors.sportsId
                    ? assignSportsToStudentsFormik.errors.sportsId
                    : ""
                }
              />
            </div>

            <div className="col-12 col-lg-6">
              <SelectInput
                name="sportClassId"
                value={assignSportsToStudentsFormik.values.sportClassId}
                onChange={filterHandler}
                onBlur={assignSportsToStudentsFormik.handleBlur}
                menuItems={
                  Array.isArray(getSportsClassesListResp)
                    ? getSportsClassesListResp
                    : []
                }
                valueKey="id"
                textKey="branchShortName"
                labelText="Class"
                labelClass="required"
                isDisabled={itemId}
                invalid={
                  !!(
                    assignSportsToStudentsFormik.touched.sportClassId &&
                    assignSportsToStudentsFormik.errors.sportClassId
                  )
                }
                error={
                  assignSportsToStudentsFormik.touched.sportClassId &&
                  assignSportsToStudentsFormik.errors.sportClassId
                    ? assignSportsToStudentsFormik.errors.sportClassId
                    : ""
                }
              />
            </div>
            {!itemId ? (
              <div className="col-12 col-lg-6">
                <SelectInput
                  name="sectionId"
                  value={assignSportsToStudentsFormik.values.sectionId}
                  onChange={filterHandler}
                  menuItems={sectionListResp?.data}
                  valueKey="sectionId"
                  textKey="sectionName"
                  labelText="Section"
                  invalid={
                    !!(
                      assignSportsToStudentsFormik.touched.sectionId &&
                      assignSportsToStudentsFormik.errors.sectionId
                    )
                  }
                  error={
                    assignSportsToStudentsFormik.touched.sectionId &&
                    assignSportsToStudentsFormik.errors.sectionId
                      ? assignSportsToStudentsFormik.errors.sectionId
                      : ""
                  }
                />
              </div>
            ) : null}
            <div className="col-12">
              <div className="tw-mb-4">
                <div className="search-box">
                  <TextInput
                    name="searchString"
                    value={assignSportsToStudentsFormik.values.searchString}
                    onChange={searchHandler}
                    // inputClassName="bg-light"
                    placeHolder="Search Student"
                    labelText="Search Student"
                    floatingLabel
                  />

                  <i className="ri-search-line search-icon"></i>
                </div>
              </div>
              <TableContainer
                columns={sportsNotAssignStudentListCol || []}
                data={
                  Array.isArray(searchStudentListState)
                    ? searchStudentListState
                    : []
                }
                divClass="table-responsive mb-1 tw-min-h-[240px] tw-max-h-[528px] custom-scrollbar"
                theadClass="table-light text-muted align-middle"
              ></TableContainer>
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

export default AssignSportsToStudentsModal;
