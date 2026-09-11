import React from 'react';
import { InputCheckbox, StatusLabel, TextArea, TextInput } from '../../../../Components/Common';
import { SelectInput, UserDetails, MenuOptionHrtl } from "../../../../Components/Common";
import { IOptionsHrtl } from '../../../../Components/Common/MenuOptions';
import { getDdMmYyyyWithMonthNameFormat } from '../../../../utility/dateutility';


export const subjectType = [
  {
    id: 'COSCHOLASTIC',
    name: 'Co-Scholastic',
  },
];

export const scholasticSubjects = [
  {
    id: 'CORE',
    name: 'Core',
  },
  {
    id: 'LANGUAGE',
    name: 'Language',
  },
];
export const coScholasticSubjects = [
  {
    id: 'AREA',
    name: 'Area',
  },
  {
    id: 'ACTIVITY',
    name: 'Activity',
  },
];

const attendanceOptions = [
  {
    id: "ABS",
    name: "ABS - Absent",
  },
  {
    id: "PR",
    name: "PR - Present",
  },
  {
    id: "ML",
    name: "ML - Medical Leave",
  },
  {
    id: "PA",
    name: "Permitted Absent - PA",
  },
];

const DescriptionInput = ({ row: { original, index }, onChangeInputHndlr }: any) => {
  const value = (original.attendance === "ABS" || original.attendance === "ML") ? "" : original?.description || "";

  return (
    <TextArea
      name={`[${index}].description`}
      value={value}
      onChange={onChangeInputHndlr}
      height="20px"
      isDisabled={true}
      formgroupClassName="mb-0"
    />
  );
}
const GradeInput = ({ row: { original, index }, onChangeInputHndlr, rowDataInfo }: any) => {
  const isDisabled = original.attendance === "ABS" || original.attendance === "ML" || !original.isSelected;
  const value = (original.attendance === "ABS" || original.attendance === "ML") ? "" : original?.coscholasticGradeId || "";

  return (
    <SelectInput
      name={`[${index}].coscholasticGradeId`}
      menuItems={rowDataInfo}
      value={value}
      onChange={onChangeInputHndlr}
      valueKey="id"
      textKey="grade"
      isDisabled={isDisabled}
      formgroupClassName="mb-0"
    />
  )
}

const AttendanceInput = ({ row: { original, index }, onChangeInputHndlr }: any) => {
  const isTeacher = original?.marksEntryDetailsId && original?.loggedInUserRole === "TEACHER";

  return (
    <SelectInput
      name={`[${index}].attendance`}
      menuItems={attendanceOptions}
      value={original.attendance || ""}
      onChange={onChangeInputHndlr}
      valueKey="id"
      textKey="name"
      isDisabled={!original.isSelected  || (isTeacher && !original.isMarksReset)}
      formgroupClassName="mb-0"
      error={(original?.touched?.attendance && original?.errors?.attendance) ? original?.errors?.attendance : ""}
      invalid={(original?.touched?.attendance && original?.errors?.attendance) ? true : false}
    />
  )
}
const MathematicsInput = ({ row: { original, index }, onChangeInputHndlr }: any) => {
  const isAbsentOrML = original.attendance === "ABS" || original.attendance === "ML" || original.attendance === "PA";

  if (isAbsentOrML) {
    return null;
  }

  const isTeacher = original?.marksEntryDetailsId && original?.loggedInUserRole === "TEACHER";

  return (
    <div>
      <div className="mb-0 w-70 d-flex align-items-center">
        <TextInput
          name={`[${index}].marks`}
          value={isAbsentOrML ? "" : (original?.marks != null ? String(original.marks) : "")}
          onChange={onChangeInputHndlr}
          formgroupClassName="mb-2"
          isDisabled={isAbsentOrML || !original.isSelected || (isTeacher && !original.isMarksReset)}
          error={(original?.touched?.marks && original?.errors?.marks) ? original?.errors?.marks : ""}
          invalid={(original?.touched?.marks && original?.errors?.marks) ? true : false}
        />
        <span className="mb-3 p-1">{`/` + original?.studentSubject?.maxMarks}</span>
      </div>
      {original.newSubjectName && (
        <div className="fs-12 table_header_style">
          {original.newSubjectName || "-"}
        </div>
      )}
    </div>
  );
};



const generateDynamicColumns = (subjectsHeaderName: any, coScholasticType: any) => {

  if (coScholasticType === "COSCHOLASTIC") {
    return [
      {
        Header: "Grade",
        accessor: "grade",
        disableSortBy: true,
        Cell: GradeInput
      },
      {
        Header: "Description",
        accessor: "description",
        disableSortBy: true,
        Cell: DescriptionInput
      }]
  }
  else{
    return subjectsHeaderName ? [{
      Header: `${subjectsHeaderName || ""}`,
      accessor: `${subjectsHeaderName || ""}`,
      disableSortBy: true,
      Cell: MathematicsInput
    }] : [];
  }

}


export function generateColumns(subjectsHeaderName: any, actionList: Array<IOptionsHrtl>, coScholasticType: any, allStudentSelectedState: any, allStudentCheckHndlr: any, singleStudentCheckHndlr: any) { 
  return [
    {
      Header: () => {
        return (
          <InputCheckbox
            name={"all-student"}
            // labelName={shortName}
            value={allStudentSelectedState}
            onChange={allStudentCheckHndlr}
            formgroupClassName="mb-0"
          />
        )
      },
      accessor: "isStudentChecked",
      columnClassName: "w-5",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        const { studentId, isSelected } = original;
        return (
          <>
            <InputCheckbox
              name={`student-${studentId}`}
              // labelName={shortName}
              value={isSelected}
              onChange={singleStudentCheckHndlr}
              dataId={studentId}
              formgroupClassName="mb-0"
            />
          </>
        )
      }
    },
    {
      Header: "Student Name",
      accessor: "studentName",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <UserDetails
              showAvatar
              imageUrl={original.studentImageBase64}
              displayName={original.studentName}
              displayId={original.studentCode}
              size="xs"
            />
          </>
        );
      },
    },
    
    {
      Header: "Roll No.",
      accessor: "rollNo",
      disableSortBy: false,
    },
    {
      Header: "Attendance",
      accessor: "attendance",
      disableSortBy: true,
      Cell: AttendanceInput
    },
    ...generateDynamicColumns( subjectsHeaderName, coScholasticType ),
    {
      Header: "Modified By",
      accessor: "userTypeName",
      disableSortBy: true,
    },
    {
      Header: "Modified Date",
      accessor: "modifiedDate",
      disableSortBy: true,
      columnClassName: "text-center",
      Cell: ({ row: { original } }: any) => {
        return (<span className="text-nowrap">{getDdMmYyyyWithMonthNameFormat(original.modifiedDate)}</span>)
      },
    },
    ...(coScholasticType === "SCHOLASTIC"
      ? [
        {
          Header: "Status",
          accessor: "status",
          disableSortBy: true,
          Cell: ({ row: { original } }: any) => {
            const isAbsent = original.attendance === "ABS";
            const isPa = original.attendance === "PA";
            const isMedicalLeave = original.attendance === "ML";
            const percentage = Number(original.marks) / Number(original?.studentSubject?.maxMarks) * 100;
        
            let status;
        
            if (isAbsent) {
              status = <span className="badge text-uppercase badge-soft-info p-2"> Absent </span>;
            } else if (isPa) {
              status = <span className="badge text-uppercase badge-soft-info p-2"> Permitted Absent </span>;
            } else if (isMedicalLeave) {
              status = <span className="badge text-uppercase badge-soft-warning p-2"> Medical Leave </span>;
            } else if (!original.marks) {
              status = "";
            } else if (percentage >= original?.studentSubject?.passMarksPercentage) {
              status = <span className="badge text-uppercase badge-soft-success p-2"> Pass </span>;
            } else {
              status = <span className="badge text-uppercase badge-soft-danger p-2"> Fail </span>;
            }
            return <>{status}</>;
          },
        },
        ]
      : []),
  ];
}
