import { InputCheckbox, UserDetails } from "../../../../../Components/Common";
import {
  IOptionsHrtl,
  MenuOptionHrtl,
} from "../../../../../Components/Common/MenuOptions";
import DefaultStudentImage from "../../../../../assets/imagesdps/student-default-img.png";

export function generateColumns(
  actionsList: Array<IOptionsHrtl>,
  assignedStudentsOpenModal
) {
  return [
    {
      Header: "Sports Name",
      accessor: "sportsName",
      disableSortBy: true,
    },
    {
      Header: "Class",
      accessor: "className",
      disableSortBy: true,
    },
    {
      Header: "Curriculum",
      accessor: "curriculumName",
      disableSortBy: true,
    },
    {
      Header: "Term Name",
      accessor: "termName",
      disableSortBy: true,
    },
    {
      Header: "Student Count",
      accessor: "studentCount",
      disableSortBy: true,
    },
    {
      Header: "Students",
      accessor: "studentDetails",
      disableSortBy: true,
      Cell: ({ row: { original, idx } }: any) => {
        const { studentDetails } = original;
        return (
          <div>
            {Array.isArray(studentDetails) && studentDetails.length > 1 ? (
              <div className="avatar-group">
                {studentDetails.slice(0, 2).map((stu: any, index: number) => (
                  <div
                    className="avatar-group-item"
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    title={stu.studentName}
                    key={index}
                  >
                    <img
                      src={DefaultStudentImage}
                      alt=""
                      className="rounded-circle avatar-xs"
                    />
                  </div>
                ))}
                {studentDetails.length > 2 && (
                  <div>
                    <div
                      className="avatar-group-item cursor-pointer"
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                      title="more"
                      data-id={idx}
                      onClick={() =>
                        assignedStudentsOpenModal(original.sportClassId)
                      }
                    >
                      <div className="avatar-xs">
                        <div
                          className="avatar-title rounded-circle"
                          style={{
                            backgroundColor: "#D4F5F0",
                            color: "#0AB39C",
                          }}
                        >
                          {studentDetails.length - 2 + "+"}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : studentDetails?.length === 1 ? (
              <UserDetails
                displayName={studentDetails[0]?.studentName}
                displayId={studentDetails[0]?.studentCode}
                size="xs"
              />
            ) : (
              <span>-</span>
            )}
          </div>
        );
      },
    },
    {
      Header: "Actions",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <MenuOptionHrtl
            actionOptions={actionsList}
            rowId={original.sportClassId}
          ></MenuOptionHrtl>
        );
      },
    },
  ];
}

export function sportsNotAssignedStudentsColumns(
  isAllSelected: any,
  allCheckHndlr: any,
  studentCheckHndlr: any
) {
  return [
    {
      Header: () => {
        return (
          <InputCheckbox
            name={"all-student"}
            // labelName={shortName}
            value={isAllSelected}
            onChange={allCheckHndlr}
            formgroupClassName="mb-0"
          />
        );
      },
      accessor: "isStudentChecked",
      columnClassName: "w-5",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        const { id, isSelected } = original;
        return (
          <>
            <InputCheckbox
              name={`student-${id}`}
              // labelName={shortName}
              value={isSelected}
              onChange={studentCheckHndlr}
              dataId={id}
              formgroupClassName="mb-0"
            />
          </>
        );
      },
    },
    {
      Header: "Student Name",
      accessor: "studentName",
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <UserDetails
              imageUrl={original?.studentPic}
              displayName={original?.studentName}
              displayId={original?.studentCode}
              defaultImgType={"student"}
              size="xs"
            />
          </>
        );
      },
    },
  ];
}

export function assignedStudentsColumns() {
  return [
    {
      Header: "Student",
      accessor: "studentName",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <UserDetails
              imageUrl={original.fullImage}
              displayName={original?.studentName}
              displayId={original?.studentCode}
              defaultImgType="student"
            />
          </>
        );
      },
    },
  ];
}

export const ignoredKeys = ["searchString", "academicYearId", "curriculumId"];
