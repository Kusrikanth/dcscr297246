import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  InputCheckbox,
  TextInput,
  UserDetails,
} from "../../../../../Components/Common";
import NoDataComp from "../../../../../Components/Common/NoDataComp";

const StudentSearchInput = ({
  studentsList = [],
  totalStudents = 0,
  selectedStudentId = [],
  selectedStudentCallback,
}: any) => {
  const [searchStudentListState, setSearchStudentListState] = useState<any>([]);
  const [selectAllStudentState, setSelectAllStudentState] = useState(false);
  const [selectedStudentIdState, setSelectedStudentIdState] = useState<any>({});
  const [searchStudentState, setSearchStudentState] = useState("");
  const selectedStudentIdsRef = useRef<any>([]);

  console.log(studentsList)

  useEffect(() => {
    if (Array.isArray(selectedStudentId) && selectedStudentId?.length > 0) {
      const studentIds = selectedStudentId.reduce((data: any, item: any) => {
        data[item] = true;
        return data;
      }, {});
      setSelectedStudentIdState(studentIds);
      selectedStudentIdsRef.current = selectedStudentId;
    }
  }, [selectedStudentId]);

  useEffect(() => {
    // update displayed list with selection applied
    if (Array.isArray(studentsList)) {
      const updateStudentList = studentsList.map((item: any) => {
        return selectedStudentIdState[item.studentId]
          ? { ...item, selected: true }
          : { ...item, selected: false };
      });
      setSearchStudentListState(updateStudentList);
      updateSelectedAllHndlr();
    }
  }, [studentsList, selectedStudentIdState]);

  function searchFilterHndlr(event: React.ChangeEvent<HTMLInputElement>) {
    const { value } = event.target;
    setSearchStudentState(value);

    if (!value) {
      setSearchStudentListState(studentsList);
    } else {
      const filtered = studentsList.filter((s: any) =>
        s.studentName.toLowerCase().includes(value.toLowerCase())
      );
      setSearchStudentListState(filtered);
    }
  }

  function selectAllStudentHndlr(event: React.ChangeEvent<HTMLInputElement>) {
    const { checked } = event.target;
    if (checked) {
      const updateSelectedStudentIdState: any = studentsList.reduce(
        (updatedInfo: any, item: any) => {
          updatedInfo[item.studentId] = true;
          return updatedInfo;
        },
        {}
      );
      const selectIdList = Object.keys(updateSelectedStudentIdState);
      setSelectedStudentIdState(updateSelectedStudentIdState);
      selectedStudentIdsRef.current = selectIdList;
      selectedStudentCallback(selectIdList);
    } else {
      setSelectedStudentIdState({});
      selectedStudentIdsRef.current = [];
      selectedStudentCallback([]);
    }
    setSelectAllStudentState(checked);
  }

  function updateSelectedAllHndlr() {
    if (
      Array.isArray(selectedStudentIdsRef.current) &&
      totalStudents &&
      selectedStudentIdsRef.current.length === totalStudents
    ) {
      setSelectAllStudentState(true);
    } else {
      setSelectAllStudentState(false);
    }
  }

  function onSelectStudentHndlr(event: React.ChangeEvent<HTMLInputElement>) {
    const { checked } = event.target,
      studentId = event.target.getAttribute("data-id");
    if (studentId) {
      const updateSelectedStudentIdState: any = { ...selectedStudentIdState };
      if (checked) {
        updateSelectedStudentIdState[studentId] = true;
      } else {
        delete updateSelectedStudentIdState[studentId];
      }
      const selectIdList = Object.keys(updateSelectedStudentIdState);
      setSelectedStudentIdState(updateSelectedStudentIdState);
      selectedStudentIdsRef.current = selectIdList;
      selectedStudentCallback(selectIdList);
    }
  }

  return (
    <>
      <label htmlFor="" className="form-label required">
        Select Students
      </label>
      <div
        style={{
          border: "1px solid #CED4DA",
          borderRadius: "5px",
          padding: "10px",
        }}
      >
        <div className="search-box">
          <TextInput
            name="searchString"
            value={searchStudentState}
            onChange={searchFilterHndlr}
            formgroupClassName="mb-0"
            placeHolder="Search..."
          />
          <i className="ri-search-line search-icon"></i>
        </div>
        <div className="my-3 d-flex align-items-center justify-content-between">
          <InputCheckbox
            name="selectAllStudent"
            labelName="Select All"
            value={selectAllStudentState}
            onChange={selectAllStudentHndlr}
          />
          <span>
            <span className="fw-bold me-1">Total:</span>
            <span>{totalStudents}</span>
          </span>
        </div>
        <div style={{ height: "200px", overflowY: "auto" }}>
          {searchStudentListState &&
            searchStudentListState.map((student: any) => {
              const { studentImageBase64 } = student,
                imageBaseUrl = studentImageBase64
                  ? `data:image/jpeg;base64, ${studentImageBase64}`
                  : "";
              return (
                <div
                  key={`student-${student?.id}`}
                  className="d-flex border-bottom align-items-center mb-2"
                >
                  <InputCheckbox
                    name={`checkbox-${student?.studentId}`}
                    value={student.selected}
                    onChange={onSelectStudentHndlr}
                    dataId={student?.studentId}
                  />
                  <UserDetails
                    imageUrl={imageBaseUrl}
                    displayName={student?.studentName}
                    displayId={student?.studentCode}
                    size="xs"
                    defaultImgType="student"
                  />
                </div>
              );
            })}
          {searchStudentListState?.length === 0 && (
            <NoDataComp helperText="No students found." />
          )}
        </div>
      </div>
    </>
  );
};

export default React.memo(StudentSearchInput);


 // useEffect()

  // const { data: notAssignedStudentsList } =
  //   getNotAssignedStudentsListResp || {};

  // console.log(getNotAssignedStudentsListResp);

  // const studentsListMemoResp = useMemo(() => {
  //   return getNotAssignedStudentsListResp || [];
  // }, [getNotAssignedStudentsListResp]);

  // const emptySelectedIds = useMemo(() => [], []);

  // const handleSelectedStudent = useCallback((selectedIds: any) => {
  //   // Actually do something with the selected IDs
  //   setSelectedStudentIdsState(selectedIds);
  // }, []);

  // console.log(getNotAssignedStudentsListResp);