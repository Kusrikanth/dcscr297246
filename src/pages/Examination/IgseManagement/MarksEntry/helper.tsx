import React, { useEffect, useMemo, useRef, useState } from "react";
import { InputCheckbox, StatusLabel, TextInput } from '../../../../Components/Common';
import { MarksEntryDataTypes } from "./MarksEntryTypes";
import { SelectInput, UserDetails, MenuOptionHrtl } from "../../../../Components/Common";
import avatar1 from "../../../../assets/images/users/avatar-1.jpg";

export const selectData1 = [
  {
    yearType: "2022-23",
  },
  {
    yearType: "2021-22",
  },
  {
    yearType: "2020-21",
  },
];
export const selectData2 = [
  {
    classType: "Class",
  },
  {
    classType: "X",
  },
  {
    classType: "IX",
  },
  {
    classType: "VIII",
  },
];
export const selectData3 = [
  {
    examName: "Examination Name",
  },
  {
    examName: "PT1",
  },
  {
    examName: "PT2",
  },
  {
    examName: "PT3",
  },
];
export const selectData4 = [
  {
    sectionType: "Section1",
  },
  {
    sectionType: "Section2",
  },
  {
    sectionType: "Section3",
  },
  {
    sectionType: "Section4",
  },
];
export const selectData5 = [
  {
    termType: "Term1",
  },
  {
    termType: "Term2",
  },
  {
    termType: "Term3",
  },
  {
    termType: "Term4",
  },
];


const AttendanceInput = ({ row: { index, original }, onChangeInputHndlr }: any) => {
  const [selectedRoute, setSelectedRoute] = useState<string>("");
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedRoute(event.target.value);
      onChangeInputHndlr(original?.id, event.target.value, "secondLanguage");
  };
  return (
    <SelectInput
    name="secondLanguage"
    menuItems={[
        { value: "Present", label: "PR" },
        { value: "Absent", label: "ABS" },
    ]}
    value={selectedRoute}
    onChange={handleChange}
    valueKey="value"
    textKey="label"
    formgroupClassName="mb-0"
/>
  )
}
const MarksInput = ({}) => { 
  const [search, setSearch] = useState(""); 


  const handleChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setSearch(event.target.value);
  };

  return (
    <div className="mb-0 w-70 d-flex align-items-center justify-content-center">
      <TextInput
        value={search}
        onChange={handleChange} 
        name="mathematics"
      /><span className="mb-3 p-1">/45.00</span>
    </div>
  );
};




export function generateColumns() {
        return [
            {
                Header: "Student Name",
                accessor: "studentName",
                disableSortBy: true,
                Cell: ({ row: { original } }: any) => {
                  return (
                    <>
                      <UserDetails
                        imageUrl={original?.studentName?.imgUrl}
                        displayName={original?.studentName?.StudName}
                        displayId={original?.studentName?.dep_id}
                      />
                    </>
                  );
                },
            },
            
            {
                Header: "Roll No.",
                accessor: "rollNo",
                disableSortBy: true,
            },
            {
                Header: "Attendance",
                accessor: "attendance",
                disableSortBy: true,
                Cell: AttendanceInput
            },
            {
              Header: "Marks",
              accessor: "marks",
              disableSortBy: true,
              Cell: MarksInput
          },
          {
            Header: "Status",
            accessor: "status",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
              return (
                <StatusLabel type={original.status} labelName={original.status} />
              );
            },
        },
        {
          Header: "Save",
          accessor: "endDateverbalLanguage",
          disableSortBy: true,
          // columnClassName: "w-70",
          Cell: ({ row: { original } }: any) => {
            return (
              <button  className="btn btn-outline-primary btn-sm btn-icon rounded-circle"><i className="ri-check-line fs-24" /></button>
              );
          },
      },
        ];
}
export const MarksEntryTableData: Array<MarksEntryDataTypes> = [
  {
    id: 1,
    studentName: {
      StudName: "User1",
      dep_id: "DCIP000001",
      imgUrl: avatar1,
    },
    rollNo: "1",
    status: "Amber",
  },
  {
    id: 2,
    studentName: {
      StudName: "User2",
      dep_id: "DCIP000002",
      imgUrl: avatar1,
    },
    rollNo: "2",
    status: "Failed",
  },
  {
    id: 3,
    studentName: {
      StudName: "User3",
      dep_id: "DCIP000003",
      imgUrl: avatar1,
    },
    rollNo: "3",
    status: "Pass",
  },
];