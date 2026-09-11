import React, {  useState } from "react";
import { PrePrimaryResultDataTypes } from "./AdmitCardTypes";
import { SelectInput, UserDetails} from "../../../../../Components/Common";
import avatar1 from "../../../../../assets/images/users/avatar-1.jpg";
 
const SelectInputBox = ({ row: { index, original }, onChangeInputHndlr }: any) => {
  const [selectedRoute, setSelectedRoute] = useState<string>("");
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedRoute(event.target.value);
      onChangeInputHndlr(original?.id, event.target.value, "secondLanguage");
  };
  return (
    <SelectInput
    name="secondLanguage"
    menuItems={[
        { value: "selecti", label: "Select I" },
        { value: "selecti", label: "Select II" },
    ]}
    value={selectedRoute}
    onChange={handleChange}
    valueKey="value"
    textKey="label"
    formgroupClassName="mb-0"
/>
  )
}

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
        Header: "Punctuality",
        accessor: "punctuality",
        disableSortBy: true,
        Cell: SelectInputBox
    },
    {
        Header: "Communication",
        accessor: "communication",
        disableSortBy: true,
        Cell: SelectInputBox
    },
    {
      Header: () => {
        return (
          <div className="d-flex flex-column">
            <span>Adaptability</span>
            <span> with Understanding</span>
          </div>
        )
      },
        accessor: "adaptability",
        disableSortBy: true,
        Cell: SelectInputBox
    },
    {
      Header: () => {
        return (
          <div className="d-flex flex-column">
            <span>Cheerful with </span>
            <span>active participation</span>
            <span>in a team</span>
          </div>
        )
      },
        accessor: "cheerfulParticipation",
        disableSortBy: true,
        Cell: SelectInputBox
    },
    
    {
      Header: () => {
        return (
          <div className="d-flex flex-column">
            <span>On time</span>
            <span>submission</span>
            <span>of assignments</span>
          </div>
        )
      },
      accessor: "assigments",
      disableSortBy: true,
      Cell: SelectInputBox
  },
  {
      Header: "PE-Theory",
      accessor: "peTheory",
      disableSortBy: true,
      Cell: SelectInputBox
  },
  {
    Header: "PE-Practical",
      accessor: "pePractical",
      disableSortBy: true,
      Cell: SelectInputBox
  },
  {
    Header: "Swimming",
      accessor: "swimming",
      disableSortBy: true,
      Cell: SelectInputBox
  },
{
  Header: "Save",
  accessor: "endDateverbalLanguage",
  disableSortBy: true,
  Cell: ({ row: { original } }: any) => {
    return (
      <button  className="btn btn-outline-primary btn-sm btn-icon"><i className="ri-check-line fs-24" /></button>
      );
  },
  
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