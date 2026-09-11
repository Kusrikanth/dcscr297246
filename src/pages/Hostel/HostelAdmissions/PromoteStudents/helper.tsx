import {
  UserDetails,
} from "../../../../Components/Common";
import DefaultStudentImage from "../../../../assets/imagesdps/student-default-img.png";

export function generateColumns(toggleShowPromotedStudentModal:any) {
  return [
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
      Cell: ({ row : {original , index}}: any) => {
        const { studentDetailsDto } = original || {}
        return (
          <div>
            {Array.isArray(studentDetailsDto) && studentDetailsDto.length > 1 ? (
              <div className="tw-flex tw-flex-wrap tw-pl-3">
                <>
                  {studentDetailsDto.slice(0, 2).map((stu: any, index: number) => (
                    <div
                      key={index}
                      title={stu.studentName}
                      className="
                        tw-relative
                        -tw-ml-3
                        tw-rounded-full
                        tw-border-2
                        tw-border-white
                        tw-transition
                        tw-duration-200
                        hover:tw--translate-y-0.5
                        hover:tw-z-10
                      "
                    >
                      <img
                        src={stu?.thumbnailImage?.s3URL || DefaultStudentImage}
                        alt=""
                        className="tw-h-6 tw-w-6 tw-rounded-full"
                      />
                    </div>
                  ))}

                  {studentDetailsDto.length > 2 && (
                    <div
                      title="More"
                      onClick={toggleShowPromotedStudentModal}
                      className="
                        tw-relative
                        -tw-ml-3
                        tw-cursor-pointer
                        tw-rounded-full
                        tw-border-2
                        tw-border-white
                        tw-transition
                        tw-duration-200
                        hover:tw--translate-y-0.5
                        hover:tw-z-10
                      "
                    >
                      <div className="tw-h-6 tw-w-6 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-bg-[#D4F5F0] tw-text-[#0AB39C] tw-text-xs tw-font-semibold">
                        {studentDetailsDto.length - 2}+
                      </div>
                    </div>
                  )}
                </>
              </div>
            ) : (
              Array.isArray(studentDetailsDto) &&
              studentDetailsDto?.length === 1 && <UserDetails
                  imageUrl={studentDetailsDto[0]?.thumbnailImage?.s3URL}
                  displayName={studentDetailsDto[0]?.studentName}
                  displayId={studentDetailsDto[0]?.studentCode}
                  defaultImgType="student"
                  size="xs"
                />
              )
            }
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