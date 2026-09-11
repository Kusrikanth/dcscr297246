import { HugeiconsIcon } from "@hugeicons/react";
import { Book02Icon, ChartHistogramIcon, Folder02Icon, InternetAntenna02Icon, LanguageSkillIcon, Search01Icon, StarIcon, Tag01Icon, Target01Icon, TimeQuarter02Icon } from "@hugeicons-pro/core-stroke-standard";
import { IOptionsHrtl, MenuOptionHrtl, MoreActions } from "../../../../../Components/Common/MenuOptions";
import { StatusLabel, UserDetails } from "../../../../../Components/Common";

export function generateColumns(actionList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "User Name",
      accessor: "teacherName",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
              return (
                <>
                  <UserDetails
                    showAvatar
                    imageUrl={original.teacherImageBase64}
                    displayName={original.teacherName}
                    displayId={original.teacherCode}
                    size="xs"
                  />
                </>
              );
            },
    },
    {
  Header: "Assigned Pool",
  accessor: "assignedPool",
  disableSortBy: true,
  Cell: ({ value }: { value: string[] }) => (
    <div className="d-flex flex-wrap">
      {value.map((assignedPool, index) => (
        <span
          key={index}
          className="badge text-uppercase bg-light text-muted p-2 me-1 mb-2"
        >
          {assignedPool}
        </span>
      ))}
    </div>
  ),
},
    {
      Header: "Role",
      accessor: "role",
      disableSortBy: true,
    },
    {
      Header: "Date Assigned",
      accessor: "dateAssigned",
      disableSortBy: true,
    },
     {
      Header: "Actions",
      thClass: "w-5",
      disableSortBy: true,
       Cell: ({ row: { original } }: any) => (
              
                    <MenuOptionHrtl actionOptions={actionList} rowId={original.id} />
            ),
    },
  ];
}

export function questionTableData() {
  return [
    {
      teacherCode: "NHR1001",
      teacherName: "Mr. Verma",
      assignedPool: ["Algebra Practice Pool", "Grade 10 – Mathematics"],
      role: "Modify",
      dateAssigned: "10 Jul 2025",
    },
    {
      teacherCode: "NHR1002",
      teacherName: "Ms. Sneha",
      assignedPool: ["Physics – Term 1 Pool", "Grade 10 – Mathematics"],
      role: "Read-only",
      dateAssigned: "12 Jul 2025",
    },
    {
      teacherCode: "NHR1003",
      teacherName: "Mr. Arjun",
      assignedPool: ["Grammar Part B", "Grade 11 – English"],
      role: "Modify",
      dateAssigned: "13 Jul 2025",
    },
  ];
}

export const searchInputOptions = [
  { id: 'global', name: 'Global Search' },
  { id: 'questionNo', name: 'User Name' },
  { id: 'question', name: 'Assigned Pool' },
]

export const ignoredKeys = ["searchString", "academicYearId", "curriculumId", "classId"];