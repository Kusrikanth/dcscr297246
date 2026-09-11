import React, { useState } from "react";
import avatar1 from "../../../../assets/images/users/avatar-1.jpg";
import { StudentSubjectDataTypes, } from "./StudentReviesTypes";
import { IOptionsHrtl } from "../../../../Components/Common/MenuOptions";
import { SelectInput, UserDetails, MenuOptionHrtl, TextInput } from "../../../../Components/Common";

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
  export const selectData3 = [
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
  export const selectData4 = [
    {
      sectionType: "Section",
    },
    
    {
      sectionType: "X-I",
    },
    {
      sectionType: "X-II",
    },
    {
      sectionType: "X-III",
    },
  ];
  
  export const selectData5 = [
    {
      termType: "Term",
    },
    {
      termType: "Term I",
    },
    {
      termType: "Term II",
    },
    {
      termType: "Term III",
    },
  ];
 

export function generateColumns(actionList: Array<IOptionsHrtl>) {
        return [
            {
                Header: "Student Name",
                accessor: "studentName",
                thClass: "w-15",
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
                Header: "Class",
                accessor: "class",
                disableSortBy: true,
            },
            {
                Header: "Section",
                accessor: "section",
                disableSortBy: true,
            },
            {
                Header: "Remarks",
                accessor: "secondLanguage",
                disableSortBy: true,
                
            },
            {
                Header: "Action",
                thClass: "w-5",
                disableSortBy: true,
                Cell: ({ row: { original } }: any) => {
                  return (
                    <MenuOptionHrtl actionOptions={actionList} rowId={original.id} />
                  );
                },
              },
        ];
}

export const StudentSubjectTableData: Array<StudentSubjectDataTypes> =
  [
    {
      id: 1,
      studentName: {
        StudName: "User1",
        dep_id: "DCIP000001",
        imgUrl: avatar1,
      },
      class: "X",
      section: "X-A",
      secondLanguage: "Active Participation, follows class rules and rarely interrupts.",
      },
      {
        id: 2,
        studentName: {
          StudName: "User2",
          dep_id: "DCIP000002",
          imgUrl: avatar1,
        },
        class: "X",
        section: "X-A",
        secondLanguage: "Needs to work towards enhancing team skills especially when interacting with classmates.",
        },
        {
            id: 3,
            studentName: {
              StudName: "User3",
              dep_id: "DCIP000003",
              imgUrl: avatar1,
            },
            class: "X",
            section: "X-A",
            secondLanguage: "Displays good manners and eyiquettes.",
            },
  ];
  const SecondLanguage = ({ row: { index, original }, onChangeInputHndlr }: any) => {
    const [selectedRoute, setSelectedRoute] = useState<string>("");
    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedRoute(event.target.value);
        onChangeInputHndlr(original?.id, event.target.value, "secondLanguage");
    };
    return (
      <SelectInput
      name="secondLanguage"
      menuItems={[
          { value: "Review1", label: "Review 1" },
          { value: "Review2", label: "Review 2" },
          { value: "Review3", label: "Review 3" },
          { value: "Review4", label: "Review 4" },
      ]}
      value={selectedRoute}
      onChange={handleChange}
      valueKey="value"
      textKey="label"
      formgroupClassName="mb-0"
  />
    )
  }
  const ThirdLanguage = ({ row: { index, original }, onChangeInputHndlr }: any) => {
    const [search, setSearch] = useState(""); 


    const handleChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
      setSearch(event.target.value);
    };
  
    return (
      <div className="mb-0 w-70">
        <TextInput
          value={search}
          onChange={handleChange} 
          name="mathematics"
        />
      </div>
    );
  }

  export function addStuAttGenerateColumns() {
    return [
    {
      Header: "Student Name",
      accessor: "studentName",
      thClass: "w-15",
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
          Header: "Select Remarks",
          accessor: "secondLanguage",
          disableSortBy: true,
          Cell : SecondLanguage,
      },
        {
            Header:"Remarks",
            accessor:"thirdLanguage",
            disableSortBy: true,
            Cell : ThirdLanguage,
        },
    ];
}

export const addStuAttData = [
  {
    studentName: {
      StudName: "User1",
      dep_id: "DCIP000001",
      imgUrl: avatar1,
    },
      thirdLanguage : "",
      update : "",
      secondLanguage : "",

  },
  {
    studentName: {
      StudName: "User2",
      dep_id: "DCIP000002",
      imgUrl: avatar1,
    },
      thirdLanguage : "",
      update : "",
      secondLanguage : "",
  }
]