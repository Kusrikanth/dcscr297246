import React, { useState, useMemo, useEffect, useCallback } from "react";
import { ModalContainer, TextInput } from "../../../Components/Common";
import {
  assignGroupDataProps,
  IAssignGroupModalProps,
  IAssignStudentTableData,
} from "./assignGroupTypes";
import { Row, Col } from "reactstrap";
import TableContainer from "../../../Components/Common/TableContainer";
import {
  generateAssignGroupStudentColumns,
} from "./helper";
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
import {
  getUnassignedGroupStudentsList,
  setAssignStudentToGroup,
} from "../../../store/academic/assignGroup/assigngroupactions";
import { generateActionPayload } from "../../../utility/reduxutility";
import { shallowEqual } from "react-redux";
import { debounce, searhWithTextInList } from "../../../utility/commonutility";

const initialValues: assignGroupDataProps = {
  curriculum: "",
  class: "",
  searchString:''
};

const AssignGroupModal = (props: IAssignGroupModalProps) => {
  const [assignGroupState, setAssignGroupState] =
    useState<assignGroupDataProps>(initialValues);
  const [unAssignedStudentList, setUnAssignedStudentList] = useState<
    Array<IAssignStudentTableData>
  >([]);
  const [orgUnassignedStudentList, setOrgUnassignedStudentList] = useState<
    Array<IAssignStudentTableData>
  >([]);
  const [selectedStudents, setSelectedStudents] = useState<any>([]);
  const [error, setError] = useState<any>("");


  const [availableStudentState, setAvailableStudentState] = useState([]);
  const [searchStudentListState, setSearchStudentListState] = useState([]);
  const [allSearchedStudentSelectedState, setAllSearchedStudentSelectedState] = useState(false);


  const selectAllStudentHndlr = useCallback((event: any) => {
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
    // updateSelectedAllHndlr(updatedAvailableStudentState);
  }, [searchStudentListState]);
  const studentCheckHndlr = useCallback((event: any) => {
    
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
    () => generateAssignGroupStudentColumns(allSearchedStudentSelectedState,selectAllStudentHndlr, studentCheckHndlr),
    [searchStudentListState]
  );
  const dispatch = useAppDispatch();
  useEffect(() => {
    // const { classId, curriculumId, academicYearId } = props.optionalDetails || {};

    if (props.isOpen) {
      // const payload = { classId: classId, curriculumId: curriculumId, academicYearId: academicYearId, branchId: branchId, pageNo: 0, pageSize: 1000, sortBy: "lastModifiedAt", orderBy: "asc" }
      // dispatch(
      //   getUnassignedGroupStudentsList(
      //     generateActionPayload("get_unassigned_group_student_list", undefined, payload)
      //   )
      // );
      getUnAssignStudent();
    }
    else{
      setAssignGroupState(prev=>({...prev,searchString:""}))
      setAllSearchedStudentSelectedState(false);
    }
    // if(props.isOpen && curriculumId){
    //   const payload1 = { branchId: branchId, pageNo: 0, pageSize: 100 };
    //   dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
    //   const payload = { branchId: branchId, curriculumId: curriculumId, pageNo: 0, pageSize: 100 };
    //   dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
    // }
  }, [props.isOpen, props.optionalDetails]);
  const { unassignedGroupStudentListResp, updateClassroomStudentsResp, brchCurriculumResp, branchClassResp, currentBranchIdResp: branchId, streamClassList }: any =
    useAppSelector(
      ({ assignGroupInfo, appData, branchAcademics, classroomManagmentInfo }) => ({
        unassignedGroupStudentListResp:
          assignGroupInfo.unassignedGroupStudentListResp,
        updateClassroomStudentsResp:
          assignGroupInfo.updateClassroomStudentsResp,
        brchCurriculumResp: branchAcademics.brchCurriculumResp,
        branchClassResp: branchAcademics.branchClassResp,
        currentBranchIdResp:
          appData.currentBranchIdResp,
        streamClassList: classroomManagmentInfo.streamClassList,

      }),
      shallowEqual
    );
  useEffect(() => {
    const { curriculumId, classId } = props.optionalDetails || {};

    if (curriculumId && brchCurriculumResp) {
      let curriculumName = brchCurriculumResp.data.find((curr: any) => curr.branchCurriculumId === +curriculumId).curriculumName;
      setAssignGroupState((prev: any) => ({ ...prev, curriculum: curriculumName }))
    }
    if (classId && streamClassList) {
      let className = streamClassList?.data.find((curr: any) => curr.id === +classId)?.className;      
      setAssignGroupState((prev: any) => ({ ...prev, class: className }))
    }
  }, [brchCurriculumResp, branchClassResp, props.optionalDetails]);

  const getUnAssignStudent=(otherProps?:any)=>{
    const { classId, curriculumId, academicYearId } = props.optionalDetails || {};
    if (classId && curriculumId && academicYearId) {
      const payload = { classId: classId, curriculumId: curriculumId, academicYearId: academicYearId, branchId: branchId, pageNo: 0, pageSize: 10000,searchString:assignGroupState.searchString, sortBy: "lastModifiedAt", orderBy: "asc",...otherProps }
      dispatch(
        getUnassignedGroupStudentsList(
          generateActionPayload("get_unassigned_group_student_list", undefined, payload)
        )
      );
    }
  }

  const addStudentActionHandler = () => {
    if (Array.isArray(availableStudentState) && availableStudentState.length > 0) {
      const studentIds = availableStudentState.filter((item: any) => item?.isSelected).map((item: any) => item?.studentId);
      
      const { classId, curriculumId, academicYearId } = props.optionalDetails || {};
      if(studentIds.length>0){
        setError('')
        const payload = { branchId: branchId, curriculumId: curriculumId, classId: classId, academicYearId: academicYearId, groupId: props.streamId, studentIds: studentIds }
        dispatch(
          setAssignStudentToGroup(
            generateActionPayload(
              "assigned_student_to_group", undefined, payload
            )
          )
        );
      }
      else{
        setError('* Please Select At Least One Student');
      }
    }
  };
  const resetHandler = () => {
    // const { classId, curriculumId, academicYearId } = props.optionalDetails || {};

    // if (props.isOpen && classId && curriculumId && academicYearId) {
    //   const payload = { classId: classId, curriculumId: curriculumId, academicYearId: academicYearId, branchId: branchId, pageNo: 0, pageSize: 10000, sortBy: "lastModifiedAt", orderBy: "asc" }
    //   dispatch(
    //     getUnassignedGroupStudentsList(
    //       generateActionPayload("get_unassigned_group_student_list", undefined, payload)
    //     )
    //   );
    // }
    getUnAssignStudent();
    setAllSearchedStudentSelectedState(false);
  }
  const addStudentHandler = (students: any) => {
    // let std = students.map((student: any) => {
    //   return {
    //     academicStudentId: student?.values.studentName.acd_id,
    //     branchStudentDetailsId: student?.values.studentName.stu_id,
    //     academicClassId: props?.optionalDetails.classId,
    //     academicClassStreamId: props?.streamDetails?.id,
    //   };
    // });
    let studentIds: any = [];
    students.map((student: any) => studentIds.push(student.studentId))
    setSelectedStudents(studentIds);
  };

  function search(searchValue: any) {
    if (searchValue) {
      let filteredStudent: any = searhWithTextInList(availableStudentState, ['studentName', 'studentCode'], searchValue);
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
    // setSearchState((prevState) => ({ ...prevState, [name]: value }));
    setAssignGroupState(prev=>({...prev,[name]:value}))
    debounceFun(value)
    // getEmployees({ searchString: event.target.value });

  }


  useEffect(() => {
    if (unassignedGroupStudentListResp&&unassignedGroupStudentListResp.content) {
      // setOrgUnAssignedStudent(unassignedGroupStudentListResp.content);
      // setUnAssignedStudent(unassignedGroupStudentListResp.content);
      setAvailableStudentState(JSON.parse(JSON.stringify(unassignedGroupStudentListResp.content)));
      setSearchStudentListState(JSON.parse(JSON.stringify(unassignedGroupStudentListResp.content)));
      
      
    }
  }, [unassignedGroupStudentListResp]);

  function updateSelectedAllHndlr(studentList: any) {
    
    if (Array.isArray(studentList) && studentList.length > 0) {
      const isAnyUnselected = studentList.some((item: any) => !item.isSelected);
      setAllSearchedStudentSelectedState(!isAnyUnselected);
    } else {
      setAllSearchedStudentSelectedState(false);
    }
  }

  // const selectAllStudentHndlr = useCallback((event: any) => {
  //   const { checked } = event.target;
  //   setAllSearchedStudentSelectedState(checked);
  //   const updateSearchStudentListState: any = [...searchStudentListState];
  //   const modifiedStudentId: any = [];
  //   updateSearchStudentListState.forEach((item: any) => {
  //     item.isSelected = checked;
  //     modifiedStudentId.push(item.studentId);
  //   });
  //   const updatedAvailableStudentState: any = [...availableStudentState];
  //   updateSearchStudentListState.forEach((item: any) => {
  //     item.isselected = modifiedStudentId.includes(item.studentId) ? checked : item.isSelected;
  //     modifiedStudentId.push(item.studentId);
  //   });
  //   setSearchStudentListState(updateSearchStudentListState);
  //   setAvailableStudentState(updatedAvailableStudentState);
  //   // updateSelectedAllHndlr(updatedAvailableStudentState);
  // }, [searchStudentListState]);

  
  // const addStudentsTableColumns = useMemo(() => generateAddStudentsColumns(allSearchedStudentSelectedState,
  //   selectAllStudentHndlr, studentCheckHndlr), [searchStudentListState]);





  // useEffect(()=>{
  //   if(unassignedGroupStudentListResp){
  //     setUnAssignedStudentList(unassignedGroupStudentListResp.content)
  //     setOrgUnassignedStudentList(unassignedGroupStudentListResp.content)
  //   }
  // },[unassignedGroupStudentListResp])


  // const searchHandler=(event:any)=>{
  //   const {name,value}=event.target;
  //   setAssignGroupState((prev:any)=>({...prev,[name]:value}));
  //   getUnAssignStudent({[name]:value});
  // }
  const { content: unassignedStudents } = unassignedGroupStudentListResp || {};
  const { data: curriculumTypes } = brchCurriculumResp || {}
  const { content: classTypes } = branchClassResp || {};

  return (
    <>
      <ModalContainer
        id="assign-groups-modal"
        modalTitle={props.modalTitle}
        isOpen={props.isOpen}
        toggle={props.toggle}
        submitHndlr={addStudentActionHandler}
        cancelHndlr={resetHandler}
        cancelTitle={"Reset"}
        submitTitle={"Add"}
        modalSize={"md"}
        modalBodyClass="tw-p-0"
        // isSubmitting={selectedStudents.length === 0}
      >
        <div className="tw-px-0 tw-py-3">
          <div className="tw-grid tw-grid-cols-12 tw-gap-4">
            <div className="tw-col-span-12 md:tw-col-span-6">
              <TextInput
                name="curriculum"
                labelText="Curriculum"
                value={assignGroupState.curriculum}
                isReadOnly={true}
                isDisabled={true}
                formgroupClassName="tw-mb-0"
              />
            </div>
            <div className="tw-col-span-12 md:tw-col-span-6">
              <TextInput
                name="class"
                labelText="Class"
                value={assignGroupState.class}
                isReadOnly={true}
                isDisabled={true}
                formgroupClassName="tw-mb-0"
              />
            </div>
            <div className="tw-col-span-12 tw-relative">
              <div className="search-box">
                <TextInput
                  name="searchString"
                  value={assignGroupState.searchString}
                  onChange={searchHandler}
                  placeHolder="Search Student"
                  labelText="Search Student"
                  formgroupClassName="tw-mb-0"
                  floatingLabel
                />
                <i className="ri-search-line search-icon"></i>
              </div>
            </div>
          </div>
        </div>
        <TableContainer
          columns={assignGroupTableColumns || []}
          data={Array.isArray(searchStudentListState) ? searchStudentListState : []}
          divClass="table-responsive tw-mb-1"
          theadClass="tw-bg-gray-100 tw-text-muted tw-align-middle"
          // showCheckbox={true}
          // selectedRowHandler={addStudentHandler}
        />
       <p className="tw-text-red-600 tw-m-2">{error}</p>
      </ModalContainer>
    </>
  );
};

export default AssignGroupModal;
