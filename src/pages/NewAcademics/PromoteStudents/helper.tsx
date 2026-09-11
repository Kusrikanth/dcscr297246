import {
  UserDetails,
} from "../../../Components/Common";
import DefaultStudentImage from "../../../assets/imagesdps/student-default-img.png";

export function generateColumns(toggleShowPromotedStudentModal:any) {
  return [
    {
      Header: "S.no",
      accessor: "studentCount",
      disableSortBy: true,
      Cell: ({ row }: any) => {
        return row.index + 1
      }
    },
    {
      Header: "Academic Year",
      accessor: "academicYearName",
      disableSortBy: true,
    },
    {
      Header: "Curriculum",
      accessor: "curriculumName",
      disableSortBy: true,
    },
    {
      Header: "Promoted By",
      accessor: "promotedBy",
      disableSortBy: true,
    },
    {
      Header: "Promoted to Class",
      accessor: "className",
      disableSortBy: true,
    },
    {
      Header: "Students",
      accessor: "students",
      disableSortBy: true,
      Cell: ({ row}: any) => {
        return (
          <div>
            {Array.isArray(row.original.studentDetailDTOList) && row.original.studentDetailDTOList.length > 1 ? <div className="avatar-group">
              <>{row.original.studentDetailDTOList.slice(0, 2).map((stu: any, index: number) => <div className="avatar-group-item" data-bs-toggle="tooltip" data-bs-placement="top" title={stu.studentName} key={index}>
                <img src={stu?.thumbnailImage?.s3URL || DefaultStudentImage} alt="" className="rounded-circle avatar-xs" />
              </div>
              )
              }
                {row.original.studentDetailDTOList.length > 2 && <div className="avatar-group-item tw-cursor-pointer" data-bs-toggle="tooltip" data-bs-placement="top" title="more" data-id={row.index} onClick={toggleShowPromotedStudentModal}>
                  <div className="avatar-xs">
                    <div className="avatar-title rounded-circle" style={{backgroundColor:"#D4F5F0",color:"#0AB39C"}}>
                      {row.original.studentDetailDTOList.length-2+"+"}
                    </div>
                  </div>
                </div>}
              </>
            </div> : <UserDetails
              imageUrl={row.original.studentDetailDTOList[0]?.thumbnailImage?.s3URL}
              displayName={row.original.studentDetailDTOList[0]?.studentName}
              displayId={row.original.studentDetailDTOList[0]?.studentCode}
              defaultImgType="student"
              size="xs"
            />}
          </div>
        );
      },
    },
  ];
}

export function showPromotedStudentColumns(){
  return [
    {
      Header: "Student",
      accessor: "student",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <UserDetails
              imageUrl={original.thumbnailImage}
              displayName={original?.studentName}
              displayId={original?.studentCode}
              defaultImgType="student"
            />

          </>
        );
      },
    },
  ]
}

export function generateStudentColumns() {
  return [
    {
      Header: "Students",
      accessor: "students",
      disableSortBy: true,
    },
    {
      Header: "Class",
      accessor: "className",
      disableSortBy: true,
    },
    {
      Header: "Section",
      accessor: "sectionName",
      disableSortBy: true,
    },
  ]
}

export const promotionTypeOp = [
  {
    promotedBy: "Class",
    promotedByType: "CLASS",
  },
  {
    promotedBy: "Student",
    promotedByType: "STUDENT",
  },
];

export function hasStateChanged(newState: any) {
  let count: any = 0;
  let showState: boolean = false;
  for (const key in newState) {
    const newValue = newState[key];
    if (newValue) {
      showState = true;
    }
  }
  if (count > 0) { return { stateChange: showState } }
  else { return { stateChange: showState } }
}