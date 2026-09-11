import React, { useState } from "react";
import { SelectInput } from "../../../../Components/Common";
import { nanoid } from "nanoid";

const SubjectSelector = ({
  row: { index, original },
  onChnageInputHndlr,
}: any) => {
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSubject(event.target.value);
    onChnageInputHndlr(original?.id, event.target.value, "periodSubject");
  };

  return (
    <div className="tw-mb-0 tw-w-100 tw-flex tw-items-center">
      <SelectInput
        name="periodSubject"
        menuItems={[
          {
            value: "telugu",
            label: "Telugu",
          },
          {
            value: "english",
            label: "English",
          },
          {
            value: "hindi",
            label: "Hindi",
          },
          {
            value: "maths",
            label: "Maths",
          },
          {
            value: "physics",
            label: "Physics",
          },
          {
            value: "science",
            label: "Science",
          },
          {
            value: "social",
            label: "Social",
          },
        ]}
        value={selectedSubject}
        valueKey="value"
        textKey="label"
        formgroupClassName="tw-mb-0"
        onChange={handleChange}
      ></SelectInput>
    </div>
  );
};

export function generateColumns() {
  return [
    {
      Header: "Days",
      accessor: "day",
      disableSortBy: true,
      columnClassName: "tw-w-[200px] tw-min-w-[200px] tw-max-w-[200px]",
    },
    {
      Header: "P1",
      accessor: "period1Subjects",
      disableSortBy: true,
      columnClassName: "tw-w-[250px] tw-min-w-[250px] tw-max-w-[250px]",
      Cell: SubjectSelector,
    },
    {
      Header: "P2",
      accessor: "period2Subjects",
      disableSortBy: true,
      columnClassName: "tw-w-[250px] tw-min-w-[250px] tw-max-w-[250px]",
      Cell: SubjectSelector,
    },
    {
      Header: "P3",
      accessor: "period3Subjects",
      disableSortBy: true,
      columnClassName: "tw-w-[250px] tw-min-w-[250px] tw-max-w-[250px]",
      Cell: SubjectSelector,
    },
    {
      Header: "P4",
      accessor: "period4Subjects",
      disableSortBy: true,
      columnClassName: "tw-w-[250px] tw-min-w-[250px] tw-max-w-[250px]",
      Cell: SubjectSelector,
    },
    {
      Header: "P5",
      accessor: "period5Subjects",
      disableSortBy: true,
      columnClassName: "tw-w-[250px] tw-min-w-[250px] tw-max-w-[250px]",
      Cell: SubjectSelector,
    },
    {
      Header: "P6",
      accessor: "period6Subjects",
      disableSortBy: true,
      columnClassName: "tw-w-[250px] tw-min-w-[250px] tw-max-w-[250px]",
      Cell: SubjectSelector,
    },
    {
      Header: "P7",
      accessor: "period7Subjects",
      disableSortBy: true,
      columnClassName: "tw-w-[250px] tw-min-w-[250px] tw-max-w-[250px]",
      Cell: SubjectSelector,
    },
  ];
}

export const assignPeriodWiseSubjectData = [
  { id: "1", day: "MON" },
  { id: "2", day: "TUE" },
  { id: "3", day: "WED" },
  { id: "4", day: "THU" },
  { id: "5", day: "FRI" },
  { id: "6", day: "SAT" },
];


export const subjectsData = [
  { id: nanoid(), subjectName: "Mathematics", subjectTeacher: "Mr. Sharma" },
  { id: nanoid(), subjectName: "Science", subjectTeacher: "Ms. Kapoor" },
  { id: nanoid(), subjectName: "English", subjectTeacher: "Mr. Verma" },
  { id: nanoid(), subjectName: "History", subjectTeacher: "Ms. Iyer" },
  { id: nanoid(), subjectName: "Geography", subjectTeacher: "Mr. Das" },
  { id: nanoid(), subjectName: "Computer Science", subjectTeacher: "Ms. Reddy" },
];