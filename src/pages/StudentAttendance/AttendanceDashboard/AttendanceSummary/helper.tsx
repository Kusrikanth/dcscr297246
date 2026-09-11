import { StatusLabel, UserDetails } from "../../../../Components/Common";
import { IAttendanceSummaryTableData } from "./AttendanceSummaryTypes";

export function generateColumns() {
  return [
    {
      Header: "Student Name",
      accessor: "studentName",
      disableSortBy: true,
      columnClassName: "sticky-left w-250px min-w-250px max-w-250px text-truncate",
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <UserDetails
              displayName={original?.studentName}
              displayId={original?.studentCode}
              imageUrl={original?.imageUrl}
              size={"xs"}
              defaultImgType="student"
            />
          </>
        );
      },
    },
    {
      Header: "Class",
      accessor: "section",
      disableSortBy: true,
      columnClassName: "text-truncate",
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <UserDetails
              displayName={original?.sectionName || "-"}
              displayId={
                typeof original?.curriculumName === "string"
                  ? original.curriculumName.split(" ")[0] || "-"
                  : "-"
              }
              showAvatar={false}
            />
          </>
        );
      },
    },
    {
      Header: "Attended/Total",
      accessor: "attended",
      disableSortBy: true,
      columnClassName: " text-truncate text-center",
      Cell: ({ row: { original } }: any) => {
        return (
          <div className="d-flex align-items-center justify-content-center">
            <span className="text-nowrap">{original?.presentDays}</span>
            <span className="text-nowrap">{original?.presentDays && original?.totalDays ? "/" : " "}</span>
            <span className="text-nowrap">{original?.totalDays}</span>
          </div>
        )
      }
    },
    {
      Header: "Percentage",
      accessor: "attendancePercentage",
      disableSortBy: true,
      columnClassName: "w-200px min-w-200px max-w-200px",
      Cell: ({ row: { original } }: any) => {
        return (
          <div className="d-flex align-items-center">
            <div className="d-inline-block w-100">
            <div
              className="progress progress_bar_wrap"
              role="progressbar"
              aria-label="Example 4px high"
              aria-valuenow={original?.attendancePercentage?.toFixed(2)}
              aria-valuemin={0}
              aria-valuemax={100}
              style={{ height: "16px", position: "relative" }}
            >
              <div
                className={`progress-bar ${
                  original?.attendancePercentage?.toFixed(2) >= 50
                    ? "bg-success"
                    : original?.attendancePercentage?.toFixed(2) >= 25
                    ? "bg-warning"
                    : "bg-danger"
                }`}
                style={{
                  width: `${original?.attendancePercentage?.toFixed(2)}%`,
                  textAlign: "center",
                  fontSize: "12px",
                  lineHeight: "16px",
                  color: original?.attendancePercentage?.toFixed(2) < 25 ? "#000" : "#fff",
                }}
              >
                {original?.attendancePercentage?.toFixed(2) < 25 ? (
                  <span style={{ position: "absolute", left: "4px", color: "#000" }}>
                    {original?.attendancePercentage?.toFixed(2)}%
                  </span>
                ) : (
                  `${original?.attendancePercentage?.toFixed(2)}%`
                )}
              </div>
            </div>
            </div>
          </div>
        );
      },
    }
    
  ]
}



export function TopStudentsTableDataColumns() {
  return [
    {
      Header: "Student Name",
      accessor: "studentName",
      disableSortBy: true,
      columnClassName: "sticky-left w-250px min-w-250px max-w-250px text-truncate",
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <UserDetails
              displayName={original?.studentName}
              displayId={original?.studentCode}
              imageUrl={original?.imageUrl}
              size={"xs"}
              defaultImgType="student"
            />
          </>
        );
      },
    },
    {
      Header: "Class",
      accessor: "section",
      disableSortBy: true,
      columnClassName: "text-truncate",
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <UserDetails
              displayName={original?.sectionName || "-"}
              displayId={(original?.curriculumName)?.split(" ")[0] || "-"}
              showAvatar={false}
            />
          </>
        );
      },
    },
    {
      Header: "Attended/Total",
      accessor: "attended",
      disableSortBy: true,
      columnClassName: " text-truncate text-center",
      Cell: ({ row: { original } }: any) => {
        return (
          <div className="d-flex align-items-center justify-content-center">
            <span className="text-nowrap">{original?.presentDays}</span>
            <span className="text-nowrap">{original?.presentDays && original?.totalDays ? "/" : " "}</span>
            <span className="text-nowrap">{original?.totalDays}</span>
          </div>
        )
      }
    },
    {
      Header: "Percentage",
      accessor: "totalDefaulters",
      disableSortBy: true,
      columnClassName: "w-200px min-w-200px max-w-200px",
      Cell: ({ row: { original } }: any) => {
        return (
          <div className="d-flex align-items-center">
            <div className="d-inline-block w-100">
            <div
              className="progress progress_bar_wrap"
              role="progressbar"
              aria-label="Example 4px high"
              aria-valuenow={original?.attendancePercentage?.toFixed(2)}
              aria-valuemin={0}
              aria-valuemax={100}
              style={{ height: "16px", position: "relative" }}
            >
              <div
                className={`progress-bar ${
                  original?.attendancePercentage?.toFixed(2) >= 50
                    ? "bg-success"
                    : original?.attendancePercentage?.toFixed(2) >= 25
                    ? "bg-warning"
                    : "bg-danger"
                }`}
                style={{
                  width: `${original?.attendancePercentage?.toFixed(2)}%`,
                  textAlign: "center",
                  fontSize: "12px",
                  lineHeight: "16px",
                  color: original?.attendancePercentage?.toFixed(2) < 25 ? "#000" : "#fff",
                }}
              >
                {original?.attendancePercentage?.toFixed(2) < 25 ? (
                  <span style={{ position: "absolute", left: "4px", color: "#000" }}>
                    {original?.attendancePercentage?.toFixed(2)}%
                  </span>
                ) : (
                  `${original?.attendancePercentage?.toFixed(2)}%`
                )}
              </div>
            </div>
            </div>
          </div>
        );
      },
    }
    
  ]
}

