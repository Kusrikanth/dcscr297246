import { InputCheckbox, UserDetails } from "../../../../../Components/Common";
import {
  IOptionsHrtl,
  MenuOptionHrtl,
} from "../../../../../Components/Common/MenuOptions";

import DefaultStudentImage from "../../../../../assets/imagesdps/employee-default-img.png";

export function generateColumns(
  actionsList: Array<IOptionsHrtl>,
  viewAssignedSportsTeachersOpenModal: any
) {
  return [
    {
      Header: "Academic Year",
      accessor: "academicYearName",
      disableSortBy: true,
      columnClassName: "w-250px min-w-250px max-w-250px",
    },
    {
      Header: "Sports Name",
      accessor: "sportsName",
      disableSortBy: true,
      columnClassName: "w-250px min-w-250px max-w-250px",
    },
    {
      Header: "Teacher Name",
      accessor: "teachersDtoList",
      disableSortBy: true,
      columnClassName: "w-250px min-w-250px max-w-250px",
      Cell: ({ row: { original, idx } }: any) => {
        const { teachersDtoList } = original;
        return (
          <div>
            {Array.isArray(teachersDtoList) && teachersDtoList.length > 1 ? (
              <div className="avatar-group">
                {teachersDtoList.slice(0, 2).map((emp: any, index: number) => (
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
                {teachersDtoList.length > 2 && (
                  <div>
                    <div
                      className="avatar-group-item cursor-pointer"
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                      title="more"
                      data-id={idx}
                      onClick={() =>
                        viewAssignedSportsTeachersOpenModal(original.sportsId)
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
                          {teachersDtoList.length - 2 + "+"}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : teachersDtoList?.length === 1 ? (
              <UserDetails
                displayName={teachersDtoList[0]?.teacherName}
                displayId={teachersDtoList[0]?.teacherCode}
                size="xs"
              ></UserDetails>
            ) : (
              <span>-</span>
            )}
          </div>
        );

        // return (
        //   <UserDetails
        //     displayName={original?.teacherName}
        //     displayId={original?.teacherCode}
        //     size="xs"
        //   ></UserDetails>
        // );
      },
    },
    {
      Header: "Actions",
      disableSortBy: true,
      columnClassName: "w-150px min-w-150px max-w-150px",
      Cell: ({ row: { original } }: any) => {
        return (
          <MenuOptionHrtl
            actionOptions={actionsList}
            rowId={original.sportsId}
          ></MenuOptionHrtl>
        );
      },
    },
  ];
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

export function generateAddEditTeacherTableColumns(
  allTeachersSelectedState: any,
  selectAllTeacherHndlr: any,
  teacherCheckHndlr: any
) {
  return [
    {
      Header: () => {
        return (
          <InputCheckbox
            name="all-teacher"
            value={allTeachersSelectedState}
            onChange={selectAllTeacherHndlr}
            formgroupClassName="mb-0"
          ></InputCheckbox>
        );
      },
      accessor: "isTeacherChecked",
      columnClassName: "w-5",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        const { id, isSelected } = original;
        return (
          <>
            <InputCheckbox
              name={`teacher-${id}`}
              value={isSelected}
              onChange={teacherCheckHndlr}
              dataId={id}
              formgroupClassName="mb-0"
            ></InputCheckbox>
          </>
        );
      },
    },
    {
      Header: "Teacher Name",
      accessor: "teacherName",
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <UserDetails
              displayName={original?.employeeName}
              displayId={original?.employeeCode}
              defaultImgType={"employee"}
              size="xs"
            ></UserDetails>
          </>
        );
      },
    },
  ];
}

export function renderValueStudent(selectedItems: any, removeItemHandler: any) {
  if (Array.isArray(selectedItems)) {
    return (
      <div className="selected-container">
        {selectedItems.map((item, index) => {
          return (
            <div key={`item-${item?.id}`} className="selectedoption-item">
              <span>{item?.name}</span>
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