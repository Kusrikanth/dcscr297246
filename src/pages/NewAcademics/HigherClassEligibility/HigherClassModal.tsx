import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useFormik } from "formik";
import { SelectInput, TextInput } from "../../../Components/Common";
import {
  HigherClassModalFilterhProps,
  HigherClassModalProps,
} from "./higherClassEligibilityTypes";
import {
  feeDueOptions,
  generateHigherClassModalColumns,
} from "./helper";
import TableContainer from "../../../Components/Common/TableContainer";
import { shallowEqual, useDispatch } from "react-redux";
import { generateActionPayload } from "../../../utility/reduxutility";
import { getBranchClassAct, getBranchCurriculumAct, getBrchSectionsAct, resetBrchClassAct, resetBrchCurriculumAct, resetBrchSectionsAct } from "../../../store/branchsettings/branchacademics/branchacademicsactions";
import { useAppSelector } from "../../../hooks/storehook";
import { getNonEligibleHigherClassStudentList, resetNonEligibleHigherClassStudentList, setHigherClassStudentList, setSectionListAct } from "../../../store/academic/classroomManagment/classroommanagmentactions";
import Button from "../../../Components/Common/Button";

const initialValues: HigherClassModalFilterhProps = {
  academicYearId: "",
  curriculumId: "",
  classId: "",
  sectionId: "",
  isFeeDue: ""
};


const HigherClassModal = (props: HigherClassModalProps) => {
  const dispatch = useDispatch();
  const [error, setError] = useState('');
  const [searchString, setSearchString] = useState('');
  const [higherClassModalFilterState, setHigherClassModalFilterState] = useState<HigherClassModalFilterhProps>(initialValues);
  const [availableStudentState, setAvailableStudentState] = useState([]);
  const [searchStudentListState, setSearchStudentListState] = useState([]);
  const [allSearchedStudentSelectedState, setAllSearchedStudentSelectedState] = useState(false);
  const [sectionList, setSectionList] = useState([]);
  const {

    higherClassStudentListResp,

    academicYearListResp,
    brchCurriculumResp,
    nonEligibleHigherClassStudentListResp,
    branchClassResp,
    brchSectionsResp,
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    showApiLoader,
  } = useAppSelector(
    ({ classroomManagmentInfo, globalData, instAcademics, branchAcademics, appData }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      higherClassStudentListResp: classroomManagmentInfo.higherClassStudentListResp,
      nonEligibleHigherClassStudentListResp: classroomManagmentInfo.nonEligibleHigherClassStudentListResp,
      branchClassResp: branchAcademics.branchClassResp,
      brchSectionsResp: branchAcademics.brchSectionsResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      showApiLoader: globalData.showApiLoader,
    }),
    shallowEqual
  );
  const HigherClassModalFilterForm = useFormik({
    enableReinitialize: true,
    initialValues: higherClassModalFilterState,
    onSubmit: (values) => {

    },
  });

  const NonEligibleHigherClassStudentAct = (otherProps?: any) => {
    let payload = {
      ...higherClassModalFilterState, currentAcademicYearId: props.currentAcademicYearId,
      branchId: branchId, ...otherProps
    }
    if (payload.academicYearId && payload.curriculumId && payload.classId && payload.sectionId) {
      dispatch(getNonEligibleHigherClassStudentList(generateActionPayload('get_non_eligible_higher_class_student_list', undefined, payload)))
    }
  }

  function updateSelectedAllHndlr(studentList: any) {
    if (Array.isArray(studentList) && studentList.length > 0) {
      const isAnyUnselected = studentList.some((item: any) => !item.isSelected);
      setAllSearchedStudentSelectedState(!isAnyUnselected);
    } else {
      setAllSearchedStudentSelectedState(false);
    }
  }

  const selectAllStudentHndlr = useCallback((event: any) => {
    const { checked } = event.target;
    setError('')
    setAllSearchedStudentSelectedState(checked);
    const updateSearchStudentListState: any = [...searchStudentListState];
    const modifiedStudentId: any = [];

    updateSearchStudentListState.forEach((item: any) => {
      item.isSelected = checked;
      modifiedStudentId.push(item.studentId);
    });
    const updatedAvailableStudentState: any = [...availableStudentState];
    updateSearchStudentListState.forEach((item: any) => {
      item.isSelected = modifiedStudentId.includes(item.studentId) ? checked : item.isSelected;
      modifiedStudentId.push(item.studentId);
    });
    updatedAvailableStudentState.forEach((item: any) => {
      item.isSelected = modifiedStudentId.includes(item.studentId) ? checked : item.isSelected;
      modifiedStudentId.push(item.studentId);
    });

    setSearchStudentListState(updateSearchStudentListState);
    setAvailableStudentState(updatedAvailableStudentState);
    // updateSelectedAllHndlr(updatedAvailableStudentState);
  }, [searchStudentListState]);
  const studentCheckHndlr = useCallback((event: any) => {
    setError('')
    const { name, value, checked } = event.currentTarget,
      studentId = event.currentTarget.getAttribute("data-id"),
      studentIndex = availableStudentState.findIndex((item: any) => item.studentId === Number(studentId)),
      studentIndexInSearchedStudent = searchStudentListState.findIndex((item: any) => item.studentId === Number(studentId))
    if (studentIndex > -1 && studentIndexInSearchedStudent > -1) {
      const studentDetails: any = availableStudentState[studentIndex],
        updatedAvailableStudentState: any = [...availableStudentState],
        updatedSearchStudentState: any = [...searchStudentListState];
      updatedAvailableStudentState.splice(studentIndex, 1, { ...studentDetails, isSelected: checked });
      updatedSearchStudentState.splice(studentIndexInSearchedStudent, 1, { ...studentDetails, isSelected: checked });
      setAvailableStudentState(updatedAvailableStudentState);
      setSearchStudentListState(updatedSearchStudentState);
      updateSelectedAllHndlr(updatedSearchStudentState);
    }
  }, [searchStudentListState]);

  const assignGroupTableColumns = useMemo(
    () => generateHigherClassModalColumns(allSearchedStudentSelectedState, selectAllStudentHndlr, studentCheckHndlr),
    [searchStudentListState]
  );

  const getClassApiCall = (otherProps?:any)=>{
    const payload = { branchId: branchId, academicYearId : higherClassModalFilterState?.academicYearId, curriculumId: higherClassModalFilterState?.curriculumId, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100 , ...otherProps };
     dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
}

const getCurriculumApiCall = (otherProps?: any) => {
    const payload1 = { academicYearId: higherClassModalFilterState?.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" , ...otherProps };
    dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
}

  useEffect(() => {
    if (props.isOpen) {

      setHigherClassModalFilterState((prev: any) => ({ ...prev, classId: props.filterState.classId, curriculumId: props.filterState.curriculumId, academicYearId: props.filterState.academicYearId }))
      const payload1 = { branchId: props.branchId, academicYearId: props.filterState.academicYearId, branchCurriculumId: props.filterState.curriculumId, classId: props.filterState.classId, pageNo: 0, pageSize: 100, sortBy: "sectionName", orderBy: "asc" };
      if (payload1.academicYearId && payload1.branchCurriculumId && payload1.classId) {
        dispatch(getBrchSectionsAct(generateActionPayload("get_brch_sections", undefined, payload1)));
      }
      dispatch(resetBrchClassAct(undefined));
    }
    else {
      setHigherClassModalFilterState((prev: any) => ({ ...prev, sectionId: "", classId: "", curriculumId: "", academicYearId: "" }));
      dispatch(resetNonEligibleHigherClassStudentList([]));
      setAllSearchedStudentSelectedState(false)
    }
  }, [props.isOpen])

  useEffect(() => {
    if (nonEligibleHigherClassStudentListResp) {
   
      setAvailableStudentState(JSON.parse(JSON.stringify(nonEligibleHigherClassStudentListResp)));
      setSearchStudentListState(JSON.parse(JSON.stringify(nonEligibleHigherClassStudentListResp)));
    }
  }, [nonEligibleHigherClassStudentListResp]);

  const filterHandler = (event: any) => {

    const { name, value } = event.target;
    if (name === "academicYearId") {
      getCurriculumApiCall({ academicYearId: value });
      dispatch(resetBrchClassAct(undefined));
      dispatch(resetBrchSectionsAct(undefined));
      setHigherClassModalFilterState((prev: any) => ({ ...prev,[name]: value,classId: null, curriculumId: "",sectionId: null }));
    }
    else if (name === "curriculumId") {
      if (!value) {
        dispatch(resetBrchClassAct(undefined))
        dispatch(resetBrchSectionsAct(undefined));
      }
      else {
        getClassApiCall({ [name]: value, academicYearId: higherClassModalFilterState.academicYearId });
        setHigherClassModalFilterState((prev: any) => ({ ...prev,[name]: value, classId: null, sectionId: null }));
        dispatch(resetBrchSectionsAct(undefined));
      }
    }
    else if (name === "classId") {
      const payload1 = { branchId: props.branchId, academicYearId: higherClassModalFilterState.academicYearId, branchCurriculumId: higherClassModalFilterState.curriculumId, classId: value, pageNo: 0, pageSize: 100, sortBy: "sectionName", orderBy: "asc" };
      if (payload1.academicYearId && payload1.branchCurriculumId && payload1.classId) {
        dispatch(getBrchSectionsAct(generateActionPayload("get_brch_sections", undefined, payload1)));
      }
      setHigherClassModalFilterState((prev: any) => ({ ...prev, [name]: value }))
    }
    else{
      setHigherClassModalFilterState((prev: any) => ({ ...prev, [name]: value }));
    }

  }

  const searchHandler = (event: any) => {
    event.preventDefault();
    setSearchString("")
    setAllSearchedStudentSelectedState(false)
    NonEligibleHigherClassStudentAct()
  }

  const submitHandler = () => {
    if (Array.isArray(availableStudentState) && availableStudentState.length > 0) {

      const studentIds = availableStudentState.filter((item: any) => item?.isSelected).map((item: any) => item?.studentId);
      const { classId, curriculumId, academicYearId, sectionId } = higherClassModalFilterState
      let payload = {
        branchId: branchId,
        branchClassId: classId,
        academicYearId: academicYearId,
        branchCurriculumId: curriculumId,
        sectionId: sectionId,
        studentIds: studentIds
      }
      if (studentIds.length > 0) {
        dispatch(setHigherClassStudentList(generateActionPayload('assign_student_for_higher_class', undefined, payload)))
      }
      else {
        setError('*Please Select Atleast One Student.')
      }

    }
  }

  const resetHandler = () => {
    let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus === "CURRENT")?.academicYearId
    setHigherClassModalFilterState({
      academicYearId: yearId || "",
      curriculumId: "",
      classId: "",
      sectionId: "",
      isFeeDue: ""
    })
    dispatch(resetNonEligibleHigherClassStudentList([]));
    setAllSearchedStudentSelectedState(false)
  }

  const searchStringHandler = (event: any) => {
    const { name, value } = event.target
    setAllSearchedStudentSelectedState(false)
    setSearchString(value)
    NonEligibleHigherClassStudentAct({ searchString: value })
  }

  const { data: academicYearList } = academicYearListResp || {};
  const { data: curriculumTypes } = brchCurriculumResp || {};
  const { content: ClassList } = branchClassResp || {};
  const { data: SectionList } = brchSectionsResp || {};
  
  useEffect(() => {
    if(Array.isArray(SectionList) && SectionList.length > 0){
      setSectionList(SectionList.find((section: any) => section.branchClassId === +higherClassModalFilterState.classId)?.sectionsResponse)
    }else{
      setSectionList([])
    }
  }, [brchSectionsResp])
  return (
    <>
      <div className="tw-grid tw-grid-cols-12 tw-gap-4 tw-bg-gray-100 tw-rounded-lg tw-px-6 tw-py-5 tw-mx-3 tw-my-4">
        <div className="tw-col-span-12 md:tw-col-span-2">
          <SelectInput
            name="academicYearId"
            labelText="Academic Year"
            labelClass="required"
            value={higherClassModalFilterState.academicYearId}
            onChange={filterHandler}
            menuItems={academicYearList || []}
            valueKey="academicYearId"
            textKey="academicYearName"
            formgroupClassName="tw-mb-0"
          />
        </div>
        <div className="tw-col-span-12 md:tw-col-span-2">
          <SelectInput
            name="curriculumId"
            labelText="Curriculum"
            labelClass="required"
            value={higherClassModalFilterState.curriculumId}
            onChange={filterHandler}
            menuItems={curriculumTypes || []}
            valueKey="branchCurriculumId"
            textKey="curriculumName"
            formgroupClassName="tw-mb-0"
          />
        </div>
        <div className="tw-col-span-12 md:tw-col-span-2">
          <SelectInput
            name="classId"
            labelText="Class"
            labelClass="required"
            value={higherClassModalFilterState.classId}
            onChange={filterHandler}
            menuItems={ClassList || []}
            valueKey="id"
            textKey="shortName"
            formgroupClassName="tw-mb-0"
          />
        </div>
        <div className="tw-col-span-12 md:tw-col-span-2">
          <SelectInput
            name="sectionId"
            labelText="Section"
            labelClass="required"
            value={higherClassModalFilterState.sectionId}
            onChange={filterHandler}
            menuItems={sectionList || []}
            valueKey="sectionId"
            textKey="sectionName"
            formgroupClassName="tw-mb-0"
          />
        </div>
        <div className="tw-col-span-12 md:tw-col-span-2">
          <SelectInput
            name="isFeeDue"
            labelText="Fee Due"
            value={higherClassModalFilterState.isFeeDue}
            onChange={filterHandler}
            menuItems={feeDueOptions || []}
            valueKey="id"
            textKey="name"
            formgroupClassName="tw-mb-0"
          />
        </div>
        <div className="tw-col-span-12 md:tw-col-span-2 tw-flex tw-items-end tw-justify-end">
          <Button
            type="button"
            variant="info"
            onClick={searchHandler}
          >
            Search
          </Button>
        </div>
      </div>
      <div className="tw-grid tw-grid-cols-12 tw-gap-4 tw-px-3 tw-mb-4">
        <div className="tw-col-span-12 md:tw-col-span-4 search-box">
          <TextInput
            name="searchString"
            value={searchString}
            onChange={searchStringHandler}
            formgroupClassName="mb-0"
            placeHolder="Search"
            labelText="Search"
            floatingLabel
          />
          <i className="ri-search-line search-icon ms-2"></i>
        </div>
      </div>
      <TableContainer
        columns={assignGroupTableColumns || []}
        data={Array.isArray(searchStudentListState) ? searchStudentListState : []}
        divClass="table-responsive tw-mb-1"
        theadClass="tw-bg-gray-100 tw-text-gray-600 tw-align-middle"
      />
      {<span className="tw-p-3 tw-pb-0 tw-text-red-500">{error}</span>}
      <div className="tw-flex tw-justify-end tw-gap-3 tw-mb-4 tw-px-4">
        <Button
          type="button"
          variant="secondary"
          onClick={resetHandler}
        >
          Reset
        </Button>
        <Button
          type="button"
          variant="primary"
          onClick={submitHandler}
          disabled={showApiLoader}
        >
          Submit
        </Button>
      </div>
    </>
  );
};

export default HigherClassModal;
