import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ModalContainer, TextInput } from "../../Components/Common";
import { IAssignClassroomProps, searchInputProps } from "./academicsTypes";
import { Col, Row } from "reactstrap";
import TableContainer from "../../Components/Common/TableContainer";
import { generateAddStudentsColumns } from "./helper";
import { useAppDispatch, useAppSelector } from "../../hooks/storehook";
import {
  getUnassignedStudentList,
  updateSectionStudents,
} from "../../store/academic/classroomManagment/classroommanagmentactions";
import { generateActionPayload } from "../../utility/reduxutility";
import { shallowEqual } from "react-redux";
import { debounce, searhWithTextInList } from "../../utility/commonutility";
import Button from "../../Components/Common/Button";

const initialValues: searchInputProps = {
  search: "",
};

const AddStudentModal = (props: IAssignClassroomProps) => {
  const [searchState, setSearchState] =
    useState<searchInputProps>(initialValues);
  const [availableStudentState, setAvailableStudentState] = useState([]);
  const [searchStudentListState, setSearchStudentListState] = useState([]);
  const [allSearchedStudentSelectedState, setAllSearchedStudentSelectedState] = useState(false);
  const [error,setError]=useState('')
  const dispatch = useAppDispatch();
  const addStudentActionHandler = () => {
    if (Array.isArray(availableStudentState) && availableStudentState.length > 0) {
      const studentIds = availableStudentState.filter((item: any) => item?.isSelected).map((item: any) => item?.studentId);
      if(studentIds.length>0){
        dispatch(
          updateSectionStudents(
            generateActionPayload(
              "assign_student_to_section",
              {
                academicClassSectionId: props.sectionDetails?.sectionId,
              },
              studentIds
            )
          )
        );
      }
      else{
        setError('*Please Select Atleast One Student')
      }
    }
  };
  const { unAssignedstudentListResp, academicYearListResp,showApiLoader }: any =
    useAppSelector(
      ({ classroomManagmentInfo, instAcademics,globalData }) => ({
        unAssignedstudentListResp:
          classroomManagmentInfo.unAssignedstudentListResp,
        updateSectionStudentsResp:
          classroomManagmentInfo.updateSectionStudentsResp,
        academicYearListResp: instAcademics.academicYearListResp,
        showApiLoader:globalData.showApiLoader
      }),
      shallowEqual
    );

  useEffect(() => {
    if (props.isOpen) {
      let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current").academicYearId
      const params = { branchClassId: props.sectionDetails.classId, academicYearId: props.academicYearId || yearId, searchString: "" }
      dispatch(getUnassignedStudentList(generateActionPayload('get_unassigned_student_list', undefined, params)))
    }
    else {
      setSearchState((prevState) => ({ ...prevState, "search": "" }));
      setAllSearchedStudentSelectedState(false);
    }
  }, [props.isOpen])

  function search(searchValue: any) {
    if (searchValue) {
      let filteredStudent: any = searhWithTextInList(availableStudentState, ['studentName', 'studentCodeNum'], searchValue);
      setSearchStudentListState(filteredStudent);
      updateSelectedAllHndlr(filteredStudent);
    } else {
      setSearchStudentListState(availableStudentState);
      updateSelectedAllHndlr(availableStudentState);
    }
  }
  const debounceFun = useCallback(debounce(search, 200), [availableStudentState])
  const searchHandler = (event: any) => {
    const { name, value } = event.target;
    setSearchState((prevState) => ({ ...prevState, [name]: value }));
    debounceFun(value)
  }

  useEffect(() => {
    if (unAssignedstudentListResp) {
      setAvailableStudentState(JSON.parse(JSON.stringify(unAssignedstudentListResp.data)));
      setSearchStudentListState(JSON.parse(JSON.stringify(unAssignedstudentListResp.data)));
    }
  }, [unAssignedstudentListResp]);

  function updateSelectedAllHndlr(studentList: any) {
    if (Array.isArray(studentList) && studentList.length > 0) {
      const isAnyUnselected = studentList.some((item: any) => !item.isSelected);
      setAllSearchedStudentSelectedState(!isAnyUnselected);
    } else {
      setAllSearchedStudentSelectedState(false);
    }
  }

  const selectAllStudentHndlr = useCallback((event: any) => {
    setError('')
    const { checked } = event.target;
    setAllSearchedStudentSelectedState(checked);
    const updateSearchStudentListState: any = [...searchStudentListState];
    const updatedAvailableStudentState: any = [...availableStudentState];

    const modifiedStudentId: any = [];
    updateSearchStudentListState.forEach((item: any) => {
      item.isSelected = checked;
      modifiedStudentId.push(item.studentId);
    });
    updatedAvailableStudentState.forEach((item: any) => {
      item.isSelected = modifiedStudentId.includes(item.studentId) ? checked : item.isSelected;
      modifiedStudentId.push(item.studentId);
    });
    setSearchStudentListState(updateSearchStudentListState);
    setAvailableStudentState(updatedAvailableStudentState);
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
  const addStudentsTableColumns = useMemo(() => generateAddStudentsColumns(allSearchedStudentSelectedState,
    selectAllStudentHndlr, studentCheckHndlr), [searchStudentListState]);
   
  return (
    <>
      <div>
        <div className="tw-flex tw-flex-col">
          <div className="tw-px-4 tw-pt-4 tw-my-2">
            <div className="search-box">
              <TextInput
                name="search"
                value={searchState.search}
                onChange={searchHandler}
                placeHolder="Search Student"
                labelText="Search Student"
                floatingLabel
              />
              <i className="ri-search-line search-icon"></i>
            </div>
          </div>
          <TableContainer
            columns={addStudentsTableColumns || []}
            data={Array.isArray(searchStudentListState) ? searchStudentListState : []}
            divClass="tw-overflow-x-auto tw-mb-3"
            theadClass="tw-bg-gray-50 tw-text-gray-500 tw-text-sm tw-align-middle"
          />
          {error && (
            <span className="tw-px-4 tw-text-red-500 tw-text-sm">
              {error}
            </span>
          )}
          <div className="tw-flex tw-justify-end tw-gap-3 tw-my-3 tw-pb-3 tw-px-4">
            <Button type="button" variant="secondary" onClick={() =>
              props.toggle({ sectionDetails: props.sectionDetails })
            }>
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              className="tw-px-2 tw-py-1"
              onClick={addStudentActionHandler}
              disabled={showApiLoader}
            >
              Add
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddStudentModal;
