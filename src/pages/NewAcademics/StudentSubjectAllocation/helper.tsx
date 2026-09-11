
import { StatusLabel, TextInput, UserDetails } from "../../../Components/Common";
import { IOptionsHrtl, MenuOptionHrtl } from "../../../Components/Common/MenuOptions";
import { default as ApproveSvg } from "../../../assets/imagesdps/academics/ApproveSvg.svg?react";

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "Student Name",
      accessor: "studentName",
      columnClassName: "tw-w-[200px] tw-min-w-[200px] tw-max-w-[200px]",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <UserDetails
              displayName={original?.studentName}
              displayId={original?.studentCode}
              imageUrl={original?.studentImageURL}
              size={"xs"}
              defaultImgType="student"
            />
          </>
        );
      },
    },
    {
      Header: "Curriculum",
      accessor: "curriculumName",
      disableSortBy: true,
    },
    {
      Header: "Class",
      accessor: "classShortName",
      columnClassName: "text-nowrap",
      disableSortBy: true,
    },
    {
      Header: "Sections",
      accessor: "sectionName",
      disableSortBy: true,
      Cell: ({ value }: any) => <>{value || "-"}</>,
    },
    {
      Header: "Status",
      accessor: "studentSubjectStatus",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return <StatusLabel type={original.studentSubjectStatus} labelName={original.studentSubjectStatus} />
      },
    },
    {
      Header: "Subjects",
      accessor: "subjectNames",
      disableSortBy: true,
      Cell: ({ value }: any) => <>{value || "-"}</>,
    },
    {
      Header: "Actions",
      filterable: false,
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        const { id } = original;
        let actions: Array<any> = actionsList;
        if (!id) {
          actions = actionsList.filter((item: any) => item.id !== 'delete');
        }

        return (
          <MenuOptionHrtl actionOptions={actions} rowId={original.academicStudentId} />
        );
      },
    },
  ];
}


export function checkFitlersApplied(applieFilters: any) {
  return Object.keys(applieFilters).some(item => {
    if (item === "academicYearId" || item === "branchId" || item === "pageNo" || item === "pageSize") {
      return false;
    }
    return !!applieFilters[item];
  });
}

export const assignStatusOptions = [{id:"Assigned",name:"Assigned"},{
  id:"Not Assigned",name:"Not Assigned"
}];