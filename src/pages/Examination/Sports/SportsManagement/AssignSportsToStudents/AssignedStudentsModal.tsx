import React, { useCallback, useEffect, useMemo, useState } from "react";
import TableContainer from "../../../../../Components/Common/TableContainer";
import NoDataComp from "../../../../../Components/Common/NoDataComp";
import { TextInput } from "../../../../../Components/Common";
import {
  debounce,
  searhWithTextInList,
} from "../../../../../utility/commonutility";

import { useAppSelector } from "../../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { assignedStudentsColumns } from "./helper";

const AssignedStudentsModal = (props) => {
  const [searchState, setSearchState] = useState<string>("");
  const [students, setStudents] = useState<any[]>([]);
  const [allStudents, setAllStudents] = useState<any[]>([]);

  const { getAssignSportsToStudentsListResp } = useAppSelector(
    ({ examinationSports }) => ({
      getAssignSportsToStudentsListResp:
        examinationSports.getAssignSportsToStudentsListResp,
    }),
    shallowEqual
  );

  const { data: assignSportsToStudentList } =
    getAssignSportsToStudentsListResp || {};

  useEffect(() => {
    if (props.itemId && getAssignSportsToStudentsListResp) {
      const assignedStudentsList =
        assignSportsToStudentList.find(
          (item) => +item.sportClassId === +props.itemId
        )?.studentDetails || [];
      setStudents(assignedStudentsList);
      setAllStudents(assignedStudentsList);
    }
  }, [props.itemId, getAssignSportsToStudentsListResp]);

  const search = (event: any) => {
    const value = event.target.value;
    let filtered: any = searhWithTextInList(
      allStudents,
      ["studentName", "studentCode"],
      value
    );
    setStudents(filtered);
  };

  const debounceFun = useCallback(debounce(search, 200), [allStudents]);

  const searchHandler = (event: any) => {
    setSearchState(event.target.value);
    debounceFun(event);
  };

  useEffect(() => {
    if (props.isOpen) {
      setStudents(allStudents);
    } else {
      setStudents([]);
      setSearchState("");
    }
  }, [props.isOpen, allStudents]);

  const roleColumns = useMemo(() => assignedStudentsColumns(), []);

  return (
    <div style={{ padding: "1.25rem" }}>
      <div className="row g-3 my-1">
        <div className="col-12 m-0 p-0">
          <div className="search-box">
            <TextInput
              name="search"
              value={searchState}
              onChange={searchHandler}
              formgroupClassName={"my-2"}
              placeHolder="Search Student.."
            />
            <i className="ri-search-line search-icon"></i>
          </div>
        </div>
      </div>

      {students && students.length > 0 ? (
        <TableContainer
          columns={roleColumns || []}
          data={students || []}
          divClass="table-responsive mb-1"
          theadClass="table-light text-muted align-middle"
        />
      ) : (
        <NoDataComp />
      )}
    </div>
  );
};

export default AssignedStudentsModal;
