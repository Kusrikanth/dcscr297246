
import {
  IOptionsHrtl,
  MenuOptionHrtl,
} from "../../../Components/Common/MenuOptions";
import BookIconWithInfo from "../../../Components/Common/BookIconWithInfo";
import { AutoSearchInput, TextInput } from "../../../Components/Common";
import { useState } from "react";

const AutoSearchInputComponent = ({
  row: { index, original },
  onChangeInputHndlr,
  onBlurInputHndlr,
  selectedMembersCallback,
  rowDataInfo,
}: any) => {
  const [inputValue, setInputValue] = useState("");
  
  const selectedTeacher =
    original?.teacherId && !inputValue
      ? {
          ...original,
          employeeName: original?.teacherName,
          employeeCode: original?.teacherEmployeeCode,
          id: original?.teacherId,
        }
      : inputValue
      ? { employeeName: inputValue }
      : {};

  return (
    <div className="tw-mt-2">
      <AutoSearchInput
        formgroupClassName="search-box"
        name="teacherId"
        placeHolder="Search..."
        onChange={(value: string) => {
          setInputValue(value);
          onChangeInputHndlr(original?.sectionId, value, "teacherId")}}
        valueKey={"id"}
        labelKey="employeeName"
        subLabelKey="employeeCode"
        labelHeader="Teacher Code"
        subLabelHeader="Teacher Name"
        options={rowDataInfo || []}
        selected={selectedTeacher || {}}
        selectedOptionCallbck={(employee: any) => {
          if (!employee) {
            selectedMembersCallback(null, original?.id);
          } else {
            setInputValue(""); 
            selectedMembersCallback(employee, original?.id)}}}
      >
        <i className="ri-search-line search-icon"></i>
      </AutoSearchInput>
    </div>
  );
};
export function generateColumnsModal(rowSearchInputs = {}) {
  return [
    {
      Header: "Class",
      accessor: "classShortName",
      disableSortBy: true
    },
    {
      Header: "Section",
      accessor: "sectionName",
      disableSortBy: true
    },
    {
      Header: "Teachers",
      accessor: "assignTeachers",
      disableSortBy: true,
      Cell: AutoSearchInputComponent
    }
  ];
}


export function generateColumns(actionsList: Array<IOptionsHrtl>, openClassSubjectModalHnldr:any ) {
  return [
    {
      Header: "Subject Name",
      accessor: "subjectName",
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <BookIconWithInfo
              cardName={original?.cardName}
              subName={original?.subName}
              image={original?.image}
              color={original?.color}
            />
          </>
        );
      },
    },
    {
      Header: "Short Name",
      accessor: "shortName",
      disableSortBy:true
    },
    {
      Header: "Assign Teachers",
      accessor: "assignTeachers",
      disableSortBy:true,
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            {<div
              className="tw-text-blue-600 tw-cursor-pointer"
              onClick={() =>openClassSubjectModalHnldr(original)}
            >
              <span>Assign</span>
            </div>}
          </>
        );
      }
    },
    {
      Header: "Actions",
      disableSortBy: true,
      filterable: false,
      Cell: ({ row: { original } }: any) => {
        return (
          <MenuOptionHrtl actionOptions={actionsList} rowId={original.id} />
        );
      },
    },
  ];
}


export const subjectType = [
  {
    id: 'SCHOLASTIC',
    name: 'Scholastic',
  },
  {
    id: 'COSCHOLASTIC',
    name: 'Co-Scholastic',
  },
  {
    id: 'INTERNAL',
    name: 'Internal',
  },
]