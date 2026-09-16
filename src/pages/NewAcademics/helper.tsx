import { UserDetails , InputCheckbox } from "../../Components/Common";
import { IOptionsHrtl, MoreActions } from "../../Components/Common/MenuOptions";

import avatar1 from "../../assets/images/users/avatar-1.jpg";
import {
  IAcademicTableData,
  IAddStudentsTableData,
  ISectionDetails,
  ITeacherDataListType,
} from "./academicsTypes";

export function generateColumns(
  actionsList: Array<IOptionsHrtl>,
  assignRoomModal: ({ sectionDetails }: ISectionDetails) => void,
  assignTeacherModal: ({ sectionDetails }: ISectionDetails) => void,
  showStudentModal: ({
    sectionDetails
  }: ISectionDetails) => void
) {
  return [
    {
      Header: "Class",
      accessor: "className",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <div>{original.className}</div>
          </>
        );
      },
    },
    {
      Header: "Section Name",
      accessor: "sectionName",
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <div>{original.sectionName}</div>
          </>
        );
      },
    },
    {
      Header: "Room No",
      accessor: "roomNo",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            {original.roomNo ? <span>{original.roomNo}</span> : <div
              className="tw-text-blue-600 tw-cursor-pointer"
              onClick={() =>
                assignRoomModal({
                  sectionDetails: original
                })
              }
            >
              Assign Room
            </div>}
          </>
        );
      },
    },
    {
      Header: "Class Teacher",
      accessor: "classTeacher",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            {original.sectionTeacherId ? <UserDetails
              displayName={original?.sectionTeacherName}
              displayId={original?.sectionTeacherCode}
              showAvatar={false}
            /> : <div
              className="tw-text-blue-600 tw-cursor-pointer"
              onClick={() =>
                assignTeacherModal({
                  sectionDetails: original,
                })
              }
            >
              <span>Assign Class Teacher</span>
            </div>}
          </>
        );
      },
    },
    {
      Header: "No. of Students",
      accessor: "noStudents",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <div
              className="tw-text-blue-600 tw-cursor-pointer"
            >
              <span onClick={() =>
                showStudentModal({
                  sectionDetails: original,
                })
              }>
                {original.studentCount}
              </span>
            </div>
          </>
        );
      },
    },
    {
      Header: "Actions",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        let newActionList = actionsList.filter((action) => {
          if (action.id === "changeTeacher") {
            if (original.sectionTeacherId) {
              return action;
            }
          } else if (action.id === "changeRoom") {
            if (original.roomNo) {
              return action;
            }
          } else {
            return action;
          }
        });

        return (
          <MoreActions
            actionOptions={newActionList}
            rowId={original.sectionId}
            isHorizontal={true}
          />
        );
      },
    },
  ];
}

export function generateAddStudentsColumns(isAllSelected: any, allCheckHndlr: any, studentCheckHndlr: any) {
  return [
    {
      Header: () => {
        return (
          <InputCheckbox
            name={"all-student"}
            // labelName={shortName}
            value={isAllSelected}
            onChange={allCheckHndlr}
            formgroupClassName="tw-mb-0"
          />
        )
      },
      accessor: "isStudentChecked",
      columnClassName: "tw-w-5",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        const { studentId, isSelected } = original;
        return (
          <>
            <InputCheckbox
              name={`student-${studentId}`}
              // labelName={shortName}
              value={isSelected}
              onChange={studentCheckHndlr}
              dataId={studentId}
              formgroupClassName="tw-mb-0"
            />
          </>
        )
      }
    },
    {
      Header: "Student Name",
      accessor: "studentName",
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <UserDetails
              imageUrl={original?.fullImage?.s3URL}
              displayName={original?.studentName}
              displayId={original?.studentCodeNum}
              defaultImgType="student"
              size="xs"
            />
          </>
        );
      },
    },
  ];
}
export function generateSectionStudentColumns() {
  return [
    {
      Header: "Student Name",
      accessor: "studentName",
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <UserDetails
              displayName={original?.studentName}
              displayId={original?.studentCodeNum}
              showAvatar={false}
            />
          </>
        );
      },
    },
    {
      Header: "Roll No",
      accessor: "rollNo",
      disableSortBy: true
    },
    {
      Header: "Student Type ",
      accessor: "studentType",
      disableSortBy: true
    },
    {
      Header: "Email",
      accessor: "emailId",
      disableSortBy: true
    },
    {
      Header: "Phone No",
      accessor: "contactNo",
      disableSortBy: true
    },
    {
      Header: "Parent Name",
      accessor: "fatherName",
      disableSortBy: true
    },
  ];
}
export function generateSectionSubjectColumns() {
  return [
    {
      Header: "Subject Name",
      accessor: "subjectName",
    },
    {
      Header: "Teacher Name",
      accessor: "teacherName",
      disableSortBy: true
    }
  ];
}
