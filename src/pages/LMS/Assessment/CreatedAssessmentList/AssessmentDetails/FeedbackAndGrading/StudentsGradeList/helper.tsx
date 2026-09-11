import { useEffect, useState } from "react";
import {
  InputCheckbox,
  SelectInput,
  StatusLabel,
  TextArea,
  UserDetails,
} from "../../../../../../../Components/Common";
import {
  IOptionsHrtl,
  MenuOptionHrtl,
} from "../../../../../../../Components/Common/MenuOptions";
import ChartPercentage from "./ChartPercentage";
import { getCurrentTimezoneYyyyMmDdFormat, getDateWithTimeFormat } from "../../../../../../../utility/dateutility";

const feedBackData = [
  { feedBackId: 1, content: "Well Done" },
  { feedBackId: 2, content: "Needs Improvement" },
  { feedBackId: 3, content: "Excellent Accuracy" },
  { feedBackId: 4, content: "Incomplete Submission" },
];


const FeedBackEditField = ({
  row: { index, original },
  onChangeInputHndlr,
  onBlurInputHndlr,
}: any) => {
  const [localValue, setLocalValue] = useState(
    original?.feedBack || original?.feedBackString || ""
  );

  useEffect(() => {
    setLocalValue(original?.feedBack || original?.feedBackString || "");
  }, [original?.feedBack, original?.feedBackString]);

  const handleChange = (e: any) => {
    setLocalValue(e.target.value);
    onChangeInputHndlr(e);
  };

  const isTextAreaDisabled = !original.isSelected || original?.attemptStatus !== "EVALUATED";

  return (
    <div style={{ minWidth: "20rem", display: "flex", alignItems: "center" }}>
      {original?.attemptStatus === "EVALUATED" ? (
        <TextArea
          name={`[${index}].feedBack`}
          inputClassName="h-100 w-100"
          formgroupClassName="w-75"
          maxLength={500}
          value={localValue}
          onChange={handleChange}
          onBlur={onBlurInputHndlr}
          isDisabled={isTextAreaDisabled}
        />
      ) : (
        <span>-</span>)}
    </div>
  );
};

export function generateColumns(actionList: Array<IOptionsHrtl>, onChangeInputHndlr: any,allStudentSelectedState: any, allStudentCheckHndlr: any, singleStudentCheckHndlr: any) {
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
            const { id, isSelected, attemptStatus } = original;
            
            return (
              <>
                {attemptStatus === "EVALUATED"  && <InputCheckbox
                  name={`student-${id}`}
                  // labelName={shortName}
                  value={isSelected}
                  onChange={singleStudentCheckHndlr}
                  dataId={id}
                  formgroupClassName="mb-0"
                />}
              </>
            )
          }
        },
    {
      Header: "Student Name",
      accessor: "studentName",
      disableSortBy: true,
      columnClassName: "sticky-left min-w-200px w-200px max-w-200px tw-z-10",
      Cell: ({ row: { original } }: any) => {
        return (
          <UserDetails
            displayName={original?.studentName}
            displayId={original?.studentCode}
            size="xs"
          ></UserDetails>
        );
      },
    },
    // {
    //   Header: "Auto Marks",
    //   accessor: "autoMarks",
    //   disableSortBy: true,
    // },
    // {
    //   Header: "Manual Marks",
    //   accessor: "manualMarks",
    //   disableSortBy: true,
    // },
    {
      Header: "Total Marks",
      accessor: "score",
      disableSortBy: true,
      columnClassName: "text-center",
      Cell: ({ row: { original } }: any) => {
        return (
          original.totalScore && original.totalQuestionMarks ? <ChartPercentage value={original.totalScore || 0} total={original.totalQuestionMarks || 0}/> : <span>-</span>
        );
      },
    },
    {
      Header: "Accuracy",
      accessor: "accuracyPercentage",
      disableSortBy: true,
      columnClassName: "text-center",
      Cell: ({ row: { original } }: any) => {
        // return <ChatPercentage seriesData={original.accuracy}></ChatPercentage>;
        return original.accuracyPercentage ? <span>{`${original.accuracyPercentage ? original.accuracyPercentage : 0.00} %`}</span> : <span>-</span>;
      },
    },
    {
      Header: "Grade",
      accessor: "grade",
      disableSortBy: true,
      columnClassName: "text-center",
      Cell: ({ row: { original } }: any) => {
        return original.grade ? <span>{original.grade}</span> : <span>-</span>;
      },
    },
    {
      Header: "Submitted",
      accessor: "submitted",
      disableSortBy: true,
      columnClassName: "text-center",
      Cell: ({ row: { original } }: any) => {
        return (
          original.submittedAt ? <span>{getDateWithTimeFormat(original.submittedAt + "Z")}</span> : <span>-</span>
        );
      },
    },
    // {
    //   Header: "Completed On",
    //   accessor: "completedOn",
    //   disableSortBy: true,
    //   Cell: ({ row: { original } }: any) => {
    //     const createdDate = original.completedOn
    //       .split(" ")
    //       .slice(0, 3)
    //       .join(" ");
    //     const createTime = original.completedOn.split(" ").slice(3).join(" ");

    //     return (
    //       <UserDetails
    //         displayName={createdDate}
    //         displayId={createTime}
    //         showAvatar={false}
    //       ></UserDetails>
    //     );
    //   },
    // },
    {
      Header: "Attempted",
      accessor: "totalAttempted",
      disableSortBy: true,
      columnClassName: "text-center",
      Cell: ({ row: { original } }: any) => {
        return (
          original.totalAttempted ? <span>{original.totalAttempted}</span> : <span>-</span>
        );
      },
    },
    {
      Header: "Un Attempted",
      accessor: "totalUnattempted",
      disableSortBy: true,
      columnClassName: "text-center",
      Cell: ({ row: { original } }: any) => {
        return (
          original.totalUnattempted ? <span>{original.totalUnattempted}</span> : <span>-</span>
        );
      },
    },
    {
      Header: "Attempt Status",
      accessor: "attemptStatus",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <StatusLabel
            type={original.attemptStatus}
            labelName={original.attemptStatus}
          ></StatusLabel>
        );
      },
    },
    {
      Header: "Result",
      accessor: "result",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <StatusLabel
            type={original.result}
            labelName={original.result}
          ></StatusLabel>
        );
      },
    },
    {
      Header: "FeedBack",
      accessor: "feedBack",
      disableSortBy: true,
      Cell: FeedBackEditField
    },
  ];
}

export const attemptStatus = [
  // { value: "NOT_STARTED", label: "Not Started" },
  // { value: "IN_PROGRESS", label: "In Progress" },
  { value: "SUBMITTED", label: "Submitted" },
  { value: "EVALUATED", label: "Evaluated" },
  // { value: "PUBLISHED", label: "Published" },
  { value: "ABSENT", label: "Absent" },
];

export const resultStatus = [
  { value: "PASS", label: "Pass" },
  { value: "FAIL", label: "Fail" },
];
export const searchInputOptions = [
    { id: 'global', name: 'Global Search' },
    { id: 'studentName', name: 'Student Name' },
    { id: 'studentCode', name: 'Student Code' },
    { id: 'attemptCode', name: 'Attempt Code' },
]

export const ignoredKeys = ['academicYearId', 'searchString', 'curriculumId', 'classId', 'nameFilterType'];
