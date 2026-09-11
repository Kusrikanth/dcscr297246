import React from "react";
import { IOptionsHrtl, MenuOptionHrtl } from "../../../Components/Common/MenuOptions";
import { UserDetails } from "../../../Components/Common";

export function generateColumns(actionList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "Student Name",
      accessor: "studentName",
      thClass: "tw-w-[15%]",
      columnClassName: "tw-w-[300px] text-truncate",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <UserDetails
              displayName={original?.studentName}
              displayId={original?.studentCode}
              imageUrl={original?.studentImage}
              size={"xs"}
              defaultImgType="student"
            />
          </>
        );
      },
    },
    {
      Header: "Class",
      accessor: "sectionName",
      disableSortBy: true,
      columnClassName: "tw-w-[250px] text-truncate",
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <UserDetails
              displayName={original?.sectionName || original?.shortName || "-"}
              displayId={original?.curriculumName || "-"}
              showAvatar={false}
            />
          </>
        );
      },
    },
    {
      Header: "Existing Subject",
      accessor: "subjectsDetailsDtos",
      disableSortBy: true,
      columnClassName: "tw-w-[400px] tw-min-w-[400px] tw-max-w-[400px]",
      Cell: ({ row: { original } }: any) => {
        const existingSubjectNames = original?.subjectsDetailsDtos?.map((classDto: { existingSubjectName: string }) => (
          <span key={classDto.existingSubjectName} className="badge tw-uppercase bg-light text-muted tw-p-2 tw-me-1 tw-mb-1">
            {classDto.existingSubjectName}
          </span>
        ));

        return existingSubjectNames?.length > 0
          ? <>{existingSubjectNames}</>
          : <span className="tw-ms-2">-</span>;
      }
    },
    {
      Header: "Replacing Subject",
      accessor: "newSubjectName",
      disableSortBy: true,
      columnClassName: "tw-w-[400px] tw-min-w-[400px] tw-max-w-[400px]",
      Cell: ({ row: { original } }: any) => {
        const newSubjectNames = original?.subjectsDetailsDtos?.map((classDto: { newSubjectName: string }) => (
          <span key={classDto.newSubjectName} className="badge tw-uppercase bg-light text-muted tw-p-2 tw-me-1 tw-mb-1">
            {classDto.newSubjectName}
          </span>
        ));

        return newSubjectNames?.length > 0
          ? <>{newSubjectNames}</>
          : <span className="tw-ms-2">-</span>;
      }
    },
    {
      Header: "Action",
      thClass: "tw-w-[5%]",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <MenuOptionHrtl actionOptions={actionList} rowId={original.id} />
        );
      },
    },
  ];
}
export const ignoredKeys = ["academicYearId"];