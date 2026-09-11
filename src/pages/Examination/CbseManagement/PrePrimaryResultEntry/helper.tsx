import React, { useEffect, useMemo, useRef, useState } from "react";
import { InputCheckbox, TextInput } from '../../../../Components/Common';
import { PrePrimaryResultDataTypes } from "./AdmitCardTypes";
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
    assesmentType: "Assesment1",
  },
  {
    assesmentType: "Assesment1",
  },
  {
    assesmentType: "Assesment3",
  },
  {
    assesmentType: "Assesment4",
  },
];

const VerbalSpeakingInput = ({}) => { 
  const [search, setSearch] = useState(""); 


  const handleChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setSearch(event.target.value);
  };

  return (
    <div className="mb-0 w-70 d-flex align-items-center">
      <TextInput
        value={search}
        onChange={handleChange} 
        name="verbalSpeaking"
      />
    </div>
  );
};
const VerbalReadingInput = ({}) => { 
  const [search, setSearch] = useState(""); 


  const handleChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setSearch(event.target.value);
  };

  return (
    <div className="mb-0 w-70 d-flex align-items-center">
      <TextInput
        value={search}
        onChange={handleChange} 
        name="verbalReading"
      />
    </div>
  );
};
const VerbalWrittenInput = ({}) => { 
  const [search, setSearch] = useState(""); 


  const handleChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setSearch(event.target.value);
  };

  return (
    <div className="mb-0 w-70 d-flex align-items-center">
      <TextInput
        value={search}
        onChange={handleChange} 
        name="verbalWritten"
      />
    </div>
  );
};
const EndDateverbalLanguageInput = ({}) => { 
  const [search, setSearch] = useState(""); 


  const handleChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setSearch(event.target.value);
  };

  return (
    <div className="mb-0 w-70 d-flex align-items-center">
      <TextInput
        value={search}
        onChange={handleChange} 
        name="endDateverbalLanguage"
      />
    </div>
  );
};
const MathWrittenInput = ({}) => { 
  const [search, setSearch] = useState(""); 


  const handleChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setSearch(event.target.value);
  };

  return (
    <div className="mb-0 w-70 d-flex align-items-center">
      <TextInput
        value={search}
        onChange={handleChange} 
        name="mathWritten"
      />
    </div>
  );
};
const EnvironWrittenInput = ({}) => { 
  const [search, setSearch] = useState(""); 


  const handleChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setSearch(event.target.value);
  };

  return (
    <div className="mb-0 w-70 d-flex align-items-center">
      <TextInput
        value={search}
        onChange={handleChange} 
        name="environWritten"
      />
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
                Header: "Verbal Linguistic (Sepaking)",
                accessor: "verbalSpeaking",
                disableSortBy: true,
                columnClassName: "w-70",
            Cell: VerbalSpeakingInput
            },
            {
              Header: "Verbal Linguistic (Reading)",
              accessor: "verbalReading",
              disableSortBy: true,
              columnClassName: "w-70",
              Cell: VerbalReadingInput
          },
          {
            Header: "Verbal Linguistic (Written / Oral)",
            accessor: "verbalWritten",
            disableSortBy: true,
            columnClassName: "w-70",
            Cell: VerbalWrittenInput
        },
        {
          Header: "Verbal Linguistic (IILanguage - Hindi / Telugu)",
          accessor: "endDateverbalLanguage",
          disableSortBy: true,
          columnClassName: "w-70",
          Cell: EndDateverbalLanguageInput
      },
      {
        Header: "Logic Mathematical (Written / Oral)",
        accessor: "mathWritten",
        disableSortBy: true,
        columnClassName: "w-70",
        Cell: MathWrittenInput
    },
    {
      Header: "Naturalistic / Environmentalist (Written / Oral)",
      accessor: "environWritten",
      disableSortBy: true,
      columnClassName: "w-70",
      Cell: EnvironWrittenInput
  },
        ];
}
export const PrePrimaryResultTableData: Array<PrePrimaryResultDataTypes> = [
  {
    id: 1,
    studentName: {
      StudName: "User1",
      dep_id: "DCIP000001",
      imgUrl: avatar1,
    },
    rollNo: "1",
  },
  {
    id: 2,
    studentName: {
      StudName: "User2",
      dep_id: "DCIP000002",
      imgUrl: avatar1,
    },
    rollNo: "2",
  },
  {
    id: 3,
    studentName: {
      StudName: "User3",
      dep_id: "DCIP000003",
      imgUrl: avatar1,
    },
    rollNo: "3",
  },
];