import { StatusLabel, UserDetails } from "../../../../Components/Common";

export function topPositionColumns() {
  return [
    {
      Header: "Student Name",
      accessor: "studentName",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <UserDetails
              displayName={original?.studentName}
              displayId={original?.studentCode}
              imageUrl={original?.studentImageS3URL}
              size={"xs"}
              defaultImgType="student"
            />
          </>
        );
      },
    },
    {
      Header: "Class",
      accessor: "Class",
      disableSortBy: true,
      columnClassName: "tw-w-[200px] tw-min-w-[200px] tw-max-w-[200px]",
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <UserDetails
              displayName={original?.classShortName}
              displayId={original?.curriculumName}
              showAvatar={false}
            />
          </>
        );
      },
    },
    {
      Header: "Aggregate",
      accessor: "percentage",
      disableSortBy: true,
      columnClassName: "tw-text-center",
      tdClass: "tw-text-center",
      Cell: ({ row: { original } }: any) => {
        return (
          <div>
            {`${original?.percentage.toFixed(2)} %`}
          </div>
        );
      }
    },
  ];
}

export function generateColumnsIssuedBooks() {
  return [
    
    {
      Header: "Subject",
      accessor: "subjectName",
      disableSortBy: true,
    },
    {
      Header: "High Score",
      accessor: "highestScore",
      disableSortBy: true,
    },
    {
      Header: "Student Name",
      accessor: "studentNames",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
       
        const studentNames = original?.studentNames?.split(",").map((name) => name.trim());
        return (
          <>
            <div className="tw-flex tw-flex-wrap tw-gap-1 tw-mb-2">
              {studentNames?.map((name, index) => (
                <span className="badge tw-text-uppercase tw-bg-gray-100 !tw-text-gray-500 tw-p-2" key={index}>
                  {name}
                </span>
              ))}
            </div>
          </>
        );
      },
    },   
  ];
}

export function CentumsColumns() {
  return [
    
    {
      Header: "Subject",
      accessor: "subjectName",
      disableSortBy: true,
    },
    {
      Header: "No.of Students",
      accessor: "noofStudents",
      disableSortBy: true,
      columnClassName: "text-center",
      tdClass: "text-center",
    },   
  ];
}

export function SubjectAverageAnalysisColumns() {
  return [
    
    {
      Header: "Subject",
      accessor: "subjects",
      disableSortBy: true,
    },
    {
      Header: "Percentage",
      accessor: "percentage",
      disableSortBy: true,
      columnClassName: "text-center",
      tdClass: "text-center",
      Cell: ({ row: { original } }: any) => {
        return (
          <div> 
            {`${original?.percentage.toFixed(2)} %`}
          </div>
        );
      }
    },   
  ];
}
