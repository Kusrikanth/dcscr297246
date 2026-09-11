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
      accessor: "Class",
      disableSortBy: true,
      columnClassName: "w-200px min-w-200px max-w-200px",
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <UserDetails
              displayName={original?.Class}
              displayId={original?.curriculum}
              showAvatar={false}
            />
          </>
        );
      },
    },
    {
      Header: "Aggregate",
      accessor: "aggreGate",
      disableSortBy: true,
    },
  ];
}
export const topPositionsData = [
  {
    studentName: "GEETA SUHANI KOLLIMARLA",
    studentCode: "1220239",
    aggreGate: "98.8",
    Class: "X-A",
    curriculum: "CBSE",
  },
  {
    studentName: "AADHYA KOLLI",
    studentCode: "1211213",
    aggreGate: "98.8",
    Class: "X-A",
    curriculum: "CAMBRIDGE",
  },
  {
    studentName: "ISHAAN GOVINDU",
    studentCode: "1220139",
    aggreGate: "98.2",
    Class: "X-B",
    curriculum: "CAMBRIDGE",
  },
  {
    studentName: "GEETA SUHANI KOLLIMARLA",
    studentCode: "1220239",
    aggreGate: "98.8",
    Class: "X-B",
    curriculum: "CAMBRIDGE",
  },
  {
    studentName: "AADHYA KOLLI",
    studentCode: "1211213",
    aggreGate: "98.8",
    Class: "X-B",
    curriculum: "CAMBRIDGE",
  },
  {
    studentName: "ISHAAN GOVINDU",
    studentCode: "1220139",
    aggreGate: "98.2",
    Class: "X-c",
    curriculum: "CBSE",
  },
  {
    studentName: "GEETA SUHANI KOLLIMARLA",
    studentCode: "1220239",
    aggreGate: "98.8",
    Class: "X-c",
    curriculum: "CBSE",
  },
  {
    studentName: "AADHYA KOLLI",
    studentCode: "1211213",
    aggreGate: "98.8",
    Class: "X-c",
    curriculum: "CBSE",
  },
  {
    studentName: "ISHAAN GOVINDU",
    studentCode: "1220139",
    aggreGate: "98.2",
    Class: "98.2",
    curriculum: "98.2",
  },
];
function getSubjectName(options: (Array<any> | null)) {

  return (
    <>
      <div className="d-flex flex-wrap gap-1 mb-2">
        <span className="badge text-uppercase bg-light text-muted p-2">
        GEETA SUHANI KOLLIMARLA</span>
        <span className="badge text-uppercase bg-light text-muted p-2">AADHYA KOLLI</span>
        <span className="badge text-uppercase bg-light text-muted p-2">
        ISHAAN GOVINDU</span>
      <span className="badge text-uppercase bg-light text-muted p-2">
        GEETA SUHANI KOLLIMARLA</span>
      </div>
      <div className="d-flex flex-wrap gap-1">
      <span className="badge text-uppercase bg-light text-muted p-2">
        GEETA SUHANI KOLLIMARLA</span>
        <span className="badge text-uppercase bg-light text-muted p-2">AADHYA KOLLI</span>
        <span className="badge text-uppercase bg-light text-muted p-2">
        ISHAAN GOVINDU</span>
      </div>
    </>
  )
}
export function generateColumnsIssuedBooks() {
  return [
    
    {
      Header: "Subject",
      accessor: "accessionNumber",
      disableSortBy: true,
    },
    {
      Header: "High Score",
      accessor: "highScore",
      disableSortBy: true,
    },
    {
      Header: "Student Name",
      accessor: "maxMarks",
      disableSortBy: true,
      Cell: getSubjectName
    },   
  ];
}
export const HighestScoreSubjectsTableData = [
  {
    id: 1,
    accessionNumber: "ENGLISH LANG. AND LIT",
    highScore: "99",
  },
  {
    id: 2,
    accessionNumber: "MATHEMATICS STAND",
    highScore: "100",
  },
  {
    id: 3,
    accessionNumber: "SCIENCE & TECHNOLOGY",
    highScore: "100",
  },{
    id: 4,
    accessionNumber: "SOCIAL SCIENCE",
    highScore: "100",
  },
  {
    id: 5,
    accessionNumber: "GERMAN", 
    highScore: "100", 
  },
  {
    id: 6,
    accessionNumber: "FRENCH",
    highScore: "100",
  }
];
export function CentumsColumns() {
  return [
    
    {
      Header: "Subject",
      accessor: "subjects",
      disableSortBy: true,
    },
    {
      Header: "No.of Students",
      accessor: "noofStudents",
      disableSortBy: true,
    },   
  ];
}
export const CentumsData = [
  {
    id: 1,
    subjects: "ENGLISH LANG. AND LIT",
    noofStudents: "10",
  },
  {
    id: 2,
    subjects: "MATHEMATICS STAND",
    noofStudents: "18",
  },
  {
    id: 3,
    subjects: "SCIENCE & TECHNOLOGY",
    noofStudents: "23",
  },{
    id: 4,
    subjects: "SOCIAL SCIENCE",
    noofStudents: "28",
  },
  {
    id: 5,
    subjects: "GERMAN", 
    noofStudents: "18", 
  },
  {
    id: 6,
    subjects: "FRENCH",
    noofStudents: "18",
  }
];
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
    },   
  ];
}
export const SubjectAverageAnalysisData = [
  {
    id: 1,
    subjects: "ENGLISH LANG. AND LIT",
    percentage: "99.5%",
  },
  {
    id: 2,
    subjects: "MATHEMATICS STAND",
    percentage: "98.3%",
  },
  {
    id: 3,
    subjects: "SCIENCE & TECHNOLOGY",
    percentage: "90.4%",
  },{
    id: 4,
    subjects: "SOCIAL SCIENCE",
    percentage: "89.85",
  },
  {
    id: 5,
    subjects: "GERMAN", 
    percentage: "89.2%", 
  },
  {
    id: 6,
    subjects: "FRENCH",
    percentage: "87.5%",
  }
];