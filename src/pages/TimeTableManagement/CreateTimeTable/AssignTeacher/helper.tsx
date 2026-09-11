import React, { useState } from "react";
import { MultiSelect } from "../../../../Components/Common";

const TeacherSelector = ({
  row: { index, original },
  onChnageInputHndlr,
}: any) => {
  const [selectedTeacher, setSelectedTeacher] = useState<string>("");
  const handleChange = (selectedOptions: any) => {
    setSelectedTeacher(selectedOptions);
    const selectedValues = selectedOptions.map((option: any) => option.value);
    onChnageInputHndlr(original?.id, selectedValues, "teacher");
  };

  return (
    <MultiSelect
      name="teacher"
      menuItems={[
        {
          value: "teacher-1",
          label: "Rajesh",
        },
        {
          value: "teacher-2",
          label: "Kiran",
        },
        {
          value: "teacher-3",
          label: "Sruthi",
        },
        {
          value: "teacher-4",
          label: "Varma",
        },
      ]}
      value={selectedTeacher}
      valueKey="value"
      textKey="label"
      formgroupClassName="mb-0"
      onChange={handleChange}
    ></MultiSelect>
  );
};

export function generateColumns() {
  return [
    {
      Header: "Subject",
      accessor: "subjectName",
      disableSortBy: true,
      columnClassName: "tw-w-[250px] tw-min-w-[250px] tw-max-w-[250px]",
    },
    {
      Header: "Subject Teacher",
      accessor: "subjectTeacher",
      disableSortBy: true,
      Cell: TeacherSelector,
      columnClassName: "tw-w-[300px] tw-min-w-[300px] tw-max-w-[300px]",
    },
    {
      Header: "Substitute Teacher",
      accessor: "substituteTeacher",
      disableSortBy: true,
      Cell: TeacherSelector,
      columnClassName: "tw-w-[300px] tw-min-w-[300px] tw-max-w-[300px]",
    },
  ];
}

export const assignPeriodWiseSubjectData = [
  { id: "1", subjectName: "Telugu" },
  { id: "2", subjectName: "English" },
  { id: "3", subjectName: "Hindi" },
  { id: "4", subjectName: "Maths" },
  { id: "5", subjectName: "Physics" },
  { id: "6", subjectName: "Science" },
  { id: "6", subjectName: "Social" },
];
