import {
  IOptionsHrtl,
  MenuOptionHrtl,
} from "../../../../../Components/Common/MenuOptions";

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "S.No",
      accessor: "serialNo",
      disableSortBy: true,
      Cell: ({ row }: any) => {
        const { index } = row;
        return <span>{index + 1 < 10 ? `0${index + 1}` : index + 1}</span>;
      },
    },
    {
      Header: "Class",
      accessor: "className",
      disableSortBy: true,
    },
    {
      Header: "Subject",
      accessor: "subjectName",
      disableSortBy: true,
    },
    {
      Header: "Type",
      accessor: "questionType",
      disableSortBy: true,
    },
    {
      Header: "Code Format",
      accessor: "codeFormat",
      disableSortBy: true,
      columnClassName: "w-350px min-w-350px max-w-350px",
    },
    {
      Header: "Code Format Preview",
      accessor: "codeFormatPreview",
      disableSortBy: true,
      columnClassName: "w-350px min-w-350px max-w-350px",
    },
    {
      Header: "No. Character",
      accessor: "noCharacter",
      disableSortBy: true,
      columnClassName: "w-350px min-w-350px max-w-350px",
    },
    {
      Header: "Actions",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <MenuOptionHrtl
            actionOptions={actionsList}
            rowId={original.id}
          ></MenuOptionHrtl>
        );
      },
    },
  ];
}

export const tableData = [
  {
    id: 1,
    className: "VI",
    subjectName: "Math",
    questionType: "MCQ",
    codeFormat: "[SB][CL][CH][QT][##]",
    noCharacter: "8",
    codeFormatPreview: "CBSE06CH01MC01",
  },
  {
    id: 2,
    className: "VIII",
    subjectName: "Science",
    questionType: "SA-I",
    codeFormat: "[SB][CL][CH][QT][##]",
    noCharacter: "8",
    codeFormatPreview: "CBSE08CH02SA01",
  },
  {
    id: 3,
    className: "IX",
    subjectName: "Social science",
    questionType: "SA-II",
    codeFormat: "[SB][CL][CH][QT][##]",
    noCharacter: "8",
    codeFormatPreview: "CBSE09CH03SA02",
  },
  {
    id: 4,
    className: "V",
    subjectName: "Hindi",
    questionType: "LA",
    codeFormat: "[SB][CL][CH][QT][##]",
    noCharacter: "8",
    codeFormatPreview: "CBSE05CH01LA01",
  },
  {
    id: 5,
    className: "IV",
    subjectName: "Telugu",
    questionType: "CBQ/SBQ",
    codeFormat: "[SB][CL][CH][QT][##]",
    noCharacter: "8",
    codeFormatPreview: "CBSE04CH02CB01",
  },
];
