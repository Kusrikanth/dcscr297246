import React, { useCallback, useEffect, useMemo, useState } from "react";
import TableContainer from "../../../../../Components/Common/TableContainer";
import NoDataComp from "../../../../../Components/Common/NoDataComp";
import { TextInput, UserDetails } from "../../../../../Components/Common";
import {
  debounce,
  searhWithTextInList,
} from "../../../../../utility/commonutility";
import { useAppSelector } from "../../../../../hooks/storehook";
import { shallowEqual } from "react-redux";

import { generateAssignedTeacherColumns } from "./helper";

const ViewAssignedSportsTeachersModal = (props) => {
  const [searchState, setSearchState] = useState<string>("");
  const [teachers, setTeachers] = useState<any[]>([]);
  const [allTeachers, setAllTeachers] = useState<any[]>([]);

  const { getSportsTeacherListResp } = useAppSelector(
    ({ examinationSports }) => ({
      getSportsTeacherListResp: examinationSports.getSportsTeacherListResp,
    }),
    shallowEqual
  );

  const { data: assignSportsToTeacherList } = getSportsTeacherListResp || {};

  useEffect(() => {
    if (props.itemId && getSportsTeacherListResp) {
      const assignedTeachersList =
        assignSportsToTeacherList.find((item) => +item.sportsId === +props.itemId)
          ?.teachersDtoList || [];

      setTeachers(assignedTeachersList);
      setAllTeachers(assignedTeachersList);
    }
  }, [props.itemId, getSportsTeacherListResp]);

  const search = (event: any) => {
    const value = event.target.value;
    let filtered: any = searhWithTextInList(
      allTeachers,
      ["teacherName", "teacherCode"],
      value
    );
    setTeachers(filtered);
  };

  const debounceFun = useCallback(debounce(search, 200), [allTeachers]);

  const searchHandler = (event: any) => {
    setSearchState(event.target.value);
    debounceFun(event);
  };

  useEffect(() => {
    if (props.isOpen) {
      setTeachers(allTeachers);
    } else {
      setTeachers([]);
      setSearchState("");
    }
  }, [props.isOpen, allTeachers]);

  const teacherColumns = useMemo(() => generateAssignedTeacherColumns(), []);

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
              placeHolder="Search Teacher.."
            />
            <i className="ri-search-line search-icon"></i>
          </div>
        </div>
      </div>

      {teachers && teachers.length > 0 ? (
        <TableContainer
          columns={teacherColumns || []}
          data={teachers || []}
          divClass="table-responsive mb-1"
          theadClass="table-light text-muted align-middle"
        />
      ) : (
        <NoDataComp />
      )}
    </div>
  );
};

export default ViewAssignedSportsTeachersModal;
