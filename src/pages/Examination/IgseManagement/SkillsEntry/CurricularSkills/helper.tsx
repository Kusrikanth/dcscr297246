import React, { useEffect, useMemo, useRef, useState } from "react";
import { PrePrimaryResultDataTypes } from "./AdmitCardTypes";
import avatar1 from "../../../../../assets/images/users/avatar-1.jpg";
import { TextInput, UserDetails } from "../../../../../Components/Common";
import { SelectInput, } from "../../../../../Components/Common";
 
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
        { value: "Selecti", label: "Select I" },
        { value: "Selectii", label: "Select II" },
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
        Header: () => {
          return (
            <div className="d-flex flex-column">
              <span>Values</span>
              <span>& Life Skills </span>
            </div>
          )
        },
        accessor: "lifeSkills",
        disableSortBy: true,
        Cell: SelectInputBox
    },
    {
        Header: "Art Design",
        accessor: "artDesign",
        disableSortBy: true,
        Cell: SelectInputBox
    },
    {
      Header: () => {
        return (
          <div className="d-flex flex-column">
            <span>Craft Model</span>
            <span>& Making</span>
          </div>
        )
      },
        accessor: "craftModel",
        disableSortBy: true,
        Cell: SelectInputBox
    },
    {
        Header: "Music Style",
        accessor: "musicStyle",
        disableSortBy: true,
        Cell: SelectInputBox
    },
    {
        Header: "Dance Styles",
        accessor: "danceStyles",
        disableSortBy: true,
        Cell: SelectInputBox
    },
    {
      Header: () => {
        return (
          <div className="d-flex flex-column">
            <span>Yoga Forms</span>
            <span>/Telugu</span>
          </div>
        )
      },
        accessor: "YogaFormsI",
        disableSortBy: true,
        Cell: SelectInputBox
    },
    {
      Header: () => {
        return (
          <div className="d-flex flex-column">
            <span>Events</span>
            <span>& Celebrations</span>
          </div>
        )
      },
        accessor: "events",
        disableSortBy: true,
        Cell: SelectInputBox
    },
    {
      Header: "Oracy",
        accessor: "oracy",
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