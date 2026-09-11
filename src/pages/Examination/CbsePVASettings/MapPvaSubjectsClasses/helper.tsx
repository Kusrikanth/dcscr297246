import { MenuOptionHrtl, UserDetails } from "../../../../Components/Common";
import { IOptionsHrtl } from "../../../../Components/Common/MenuOptions";
import DefaultStudentImage from "../../../../assets/imagesdps/employee-default-img.png";


export function generateColumns(actionList: Array<IOptionsHrtl>, viewAssignedSportsTeachersOpenModal: any) {
  return [
    {
      Header: "Curriculum",
      accessor: "curriculumName",
      disableSortBy: true,
      columnClassName: "w-200px min-w-200px max-w-200px",
    },
    {
      Header: "PVA Subject",
      accessor: "pvaSubjectName",
      disableSortBy: true,
      columnClassName: "w-200px min-w-200px max-w-200px",
    },
    {
      Header: "Term",
      accessor: "termName",
      disableSortBy: true,
      columnClassName: "w-200px min-w-200px max-w-200px",
    },
     {
          Header: "Teacher Name",
          accessor: "teachersDtoList",
          disableSortBy: true,
          columnClassName: "w-250px min-w-250px max-w-250px",
          Cell: ({ row: { original, idx } }: any) => {
            const { pvaTeachers } = original;
            return (
              <div>
                {Array.isArray(pvaTeachers) && pvaTeachers.length > 1 ? (
                  <div className="avatar-group">
                    {pvaTeachers.slice(0, 2).map((emp: any, index: number) => (
                      <div
                        className="avatar-group-item"
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        title={emp.teacherName}
                        key={index}
                      >
                        <img
                          src={DefaultStudentImage}
                          alt=""
                          className="rounded-circle avatar-xs"
                        />
                      </div>
                    ))}
                    {pvaTeachers.length > 2 && (
                      <div>
                        <div
                          className="avatar-group-item cursor-pointer"
                          data-bs-toggle="tooltip"
                          data-bs-placement="top"
                          title="more"
                          data-id={idx}
                          onClick={() =>
                            viewAssignedSportsTeachersOpenModal(original.id)
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
                              {pvaTeachers.length - 2 + "+"}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : pvaTeachers?.length === 1 ? (
                  <UserDetails
                    displayName={pvaTeachers[0]?.teacherName}
                    displayId={pvaTeachers[0]?.teacherCode}
                    size="xs"
                  ></UserDetails>
                ) : (
                  <span>-</span>
                )}
              </div>
            );
          },
        },
    {
      Header: "Classes",
      accessor: "classes",
      disableSortBy: true,
      columnClassName: "w-200px min-w-200px max-w-200px text-center",
      Cell: ({ row }: any) => {
        const value = row.original.classes || [
          { classId: row.original.classId, className: row.original.classShortName },
        ];
        return value?.length > 0 ? (
          value.map((cls: any, idx: number) => (
            <span
              key={cls.classId || idx}
              className="badge text-uppercase bg-light text-muted p-2 me-1 mb-2"
            >
              {cls.classShortName || cls.className}
            </span>
          ))
        ) : (
          <span className="ms-2">-</span>
        );
      },
    },
    {
      Header: "Skill Name",
      accessor: "skillAreas",
      disableSortBy: true,
      columnClassName: "w-200px min-w-200px max-w-200px",
      Cell: ({ row: { original } }: any) => {
        return (
          <div>
            {original?.skillAreas?.map((ao: any, index: number) => (
              <div key={ao.skillAreaId || index}>{index + 1}. {ao.skillAreaName}</div>
            ))}
          </div>
        );
      },
    },
    {
      Header: "Action",
      accessor: "id",
      disableSortBy: true,
      thClass: "w-5",
      Cell: ({ value }: any, row: any) => (
        <MenuOptionHrtl actionOptions={actionList} rowId={value} />
      ),
    },
  ];
}

export const ignoredKeys = ["searchString","academicYearId","curriculumId","classId"];

export function renderValueStaff(selectedItems: any, removeItemHandler: any) {
  if (Array.isArray(selectedItems)) {
    return (
      <div className="selected-container">
        {selectedItems.map((item, index) => {
          return (
            <div key={`item-${item?.id}`} className="selectedoption-item">
              <span>{item?.employeeName}</span>
              <span
                data-id={item?.id}
                onClick={removeItemHandler}
                className="remove-icon"
              >
                <i className="ri-close-line"></i>
              </span>
            </div>
          );
        })}
      </div>
    );
  }
}

 export function renderOptionsEmployee(item: any) {
    return `${item?.employeeName} - ${item?.employeeCode}`;
  }

  export function generateAssignedTeacherColumns() {
  return [
    {
      Header: "Teachers",
      accessor: "teacherName",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <UserDetails
              displayName={original?.teacherName}
              displayId={original?.teacherCode}
              size="xs"
            />
          </>
        );
      },
    },
  ];
}