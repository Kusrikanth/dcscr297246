import { StatusLabel, UserDetails } from "../../../../Components/Common";
import { IOptionsHrtl, MoreActions } from "../../../../Components/Common/MenuOptions";
import {
  getFormattedDateddMMMYYYY,
  Current_Date_YYYYMMDD,
  Current_time,
  getDifferenceInHours,
  convertUTCToISTTimeOnly
} from "../../../../utility/dateutility";
import DefaultStudentImage from "../../../../assets/imagesdps/student-default-img.png";
import { Progress } from "reactstrap";
import { formatMinutesToDuration } from "../../../../utility/commonutility";

function formatTime(time: string) {
  if(!time) return;
  const [hours, minutes] = time.split(":");
  let h = parseInt(hours);
  const suffix = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${minutes} ${suffix}`;
}

export const assessmentTypes = [
  { id: "FORMATIVE", shortName: "Formative" },
  { id: "SUMMATIVE", shortName: "Summative" },
  { id: "PRACTICE", shortName: "Practice" },
  { id: "MOCK", shortName: "Mock" },
  { id: "LIVE_WORKSHEET", shortName: "Live Worksheet" },
];

 export function renderValueSection(selectedItems: any) {
    return `${selectedItems?.employeeName}`;
  }
export function renderOptionsEmployee(item: any) {
    return `${item?.employeeName} - ${item?.employeeCode}`;
  }


const assessmentStatusMap: { [key: string]: { label: string; type: string } } = {
  DRAFT: { label: "Draft", type: "secondary" },
  PUBLISHED: { label: "Published", type: "success" },
  SCHEDULED: { label: "Scheduled", type: "info" },
  COMPLETED: { label: "Completed", type: "primary" },
  ARCHIVE: { label: "Archive", type: "danger" },
};

const isEditDisabled = (startDate: string, startTime: string) => {
  if (!startDate || !startTime) {
    return false;
  }
  if (startDate > Current_Date_YYYYMMDD) {
    return false;
  }
  if (startDate === Current_Date_YYYYMMDD) {
    const difference = getDifferenceInHours(startTime, Current_time);
    return difference < 3;
  }
  return true;
}

export function generateColumns(actionList: Array<IOptionsHrtl>, toggleShowPromotedStudentModal: any) {
  return [
    {
      Header: "Assessment Id",
      accessor: "assessmentCode",
      disableSortBy: true,
      columnClassName: "sticky-left",
    },
    {
      Header: "Assessment Name",
      accessor: "assessmentName",
      disableSortBy: true,
      columnClassName: "w-250px min-w-160px max-w-250px text-wrap",
    },
    {
      Header: "Assessment Type",
      accessor: "assessmentType",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => (
        <span className="badge text-uppercase bg-light text-muted p-2">
          {original?.assessmentType}
        </span>
      )
    },
    {
      Header: "Class",
      accessor: "className",
      disableSortBy: true,
      columnClassName: "w-150px min-w-150px max-w-150px text-wrap",
      Cell: ({ row: { original } }: any) => {
          return (
              <>
                  <UserDetails
                      displayName={original.className}
                      displayId={original.curriculumName}
                      showAvatar={false}
                  />
              </>
          );
      },
    },
    {
      Header: "Subject",
      accessor: "subjectName",
      disableSortBy: true,
      columnClassName: "w-100px min-w-100px max-w-100px text-wrap",
    },
    // {
    //   Header: "Students",
    //   accessor: "students",
    //   disableSortBy: true,
    //   Cell: ({ row }: any) => {
    //     return (
    //       <div>
    //         {Array.isArray(row.original.studentDetailDTOList) && row.original.studentDetailDTOList.length > 1 ? <div className="avatar-group">
    //           <>{row.original.studentDetailDTOList.slice(0, 2).map((stu: any, index: number) => <div className="avatar-group-item" data-bs-toggle="tooltip" data-bs-placement="top" title={stu.studentName} key={index}>
    //             <img src={stu?.thumbnailImage?.s3URL || DefaultStudentImage} alt="" className="rounded-circle avatar-xs" />
    //           </div>
    //           )
    //           }
    //             {row.original.studentDetailDTOList.length > 2 && <div className="avatar-group-item cursor-pointer" data-bs-toggle="tooltip" data-bs-placement="top" title="more" data-id={row.index} onClick={toggleShowPromotedStudentModal}>
    //               <div className="avatar-xs">
    //                 <div className="avatar-title rounded-circle" style={{ backgroundColor: "#D4F5F0", color: "#0AB39C" }}>
    //                   {row.original.studentDetailDTOList.length - 2 + "+"}
    //                 </div>
    //               </div>
    //             </div>}
    //           </>
    //         </div> : <UserDetails
    //           imageUrl={row.original.studentDetailDTOList?.thumbnailImage?.s3URL}
    //           displayName={row.original.studentDetailDTOList?.studentName}
    //           displayId={row.original.studentDetailDTOList?.studentCode}
    //           defaultImgType="student"
    //           size="xs"
    //         />}
    //       </div>
    //     );
    //   },
    // },
    {
      Header: "Exam Start Date",
      accessor: "startDate",
      disableSortBy: true,
      columnClassName: "w-200px min-w-200px max-w-200px text-wrap",
      Cell: ({ row: { original } }: any) => {
        // return getFormattedDateddMMMYYYY(original.startDate);
        // need to add time
        return <UserDetails
        displayName={getFormattedDateddMMMYYYY(original.startDate)}
        displayId={convertUTCToISTTimeOnly(original.startTime)}
        displaySubName={formatMinutesToDuration(original.duration)}

        showAvatar={false}
        ></UserDetails>
      },
    },
    // {
    //   Header: "End Date",
    //   accessor: "expiryDate",
    //   disableSortBy: true,
    //   columnClassName: "w-100px min-w-100px max-w-100px text-wrap",
    //   Cell: ({ row: { original } }: any) => {
    //     return getFormattedDateddMMMYYYY(original.expiryDate);
    //   },
    // },
    // {
    //   Header: "Submission Status",
    //   accessor: "submittedCount",
    //   disableSortBy: true,
    //   Cell:({row:{original}}) => {
    //     return <span>{`${original?.submittedCount ?? 0} / ${original?.assignedCount}`}</span>
    //   }
    // },
    {
      Header: "Total Assigned Students",
      accessor: "totalStudents",
      disableSortBy: true,
      columnClassName: "text-center",
    },
    {
      Header: "Total Submission Students",
      accessor: "submittedCount",
      disableSortBy: true,
      columnClassName: "text-center",
      Cell: ({ row: { original } }: any) => {
        return (
          <p className="mb-0">{`${original?.submittedCount ?? 0} / ${original?.totalStudents ?? 0}`}</p>
        )
          

      },
    },
    {
      Header: "Total Evaluated Students",
      accessor: "evaluatedCount",
      disableSortBy: true,
      columnClassName: "text-center",
      Cell: ({ row: { original } }: any) => {
        return (
           <p className="mb-0">{`${original?.evaluatedCount ?? 0} / ${original?.totalStudents ?? 0}`}</p>
        )

      },
    },
    // {
    //   Header: "Evaluation Status",
    //   accessor: "evaluatedCount",
    //   disableSortBy: true,
    //   columnClassName: "w-150px min-w-150px max-w-150px",
    //   Cell:({row:{original}}) => {
    //     return <div className="tw-text-center">
    //         {original.assignedCount ? (
    //           <div className="tw-flex tw-items-center">
    //             <Progress
    //               value={original?.evaluatedCount ?? 0}
    //               max={original?.submittedCount ?? 0}
    //               className="tw-flex-1 tw-me-2"
    //             />
    //             <p className="mb-0">{`${original?.evaluatedCount ?? 0} / ${original?.submittedCount ?? 0}`}</p>
    //           </div>
    //         ) : (
    //           <span>-</span>
    //         )}
    //       </div>

    //   }
    // },
    // {
    //   Header: "Assiged to",
    //   accessor: "assignedCount",
    //   disableSortBy: true,
    //   columnClassName: "w-100px min-w-100px max-w-100px text-wrap",
    // },
    {
      Header: "Status",
      accessor: "assessmentStatus",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        if (!original.assessmentStatus) {
          return null;
        }
        return (
          <StatusLabel
            type={original.assessmentStatus}
            labelName={original.assessmentStatus}
          />
        );
      },
    },
    {
      Header: "Publish Status",
      accessor: "publishStatus",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        if (!original.publishStatus) {
          return null;
        }
        return (
          <StatusLabel
            type={original.publishStatus}
            labelName={original.publishStatus}
          />
        );
      },
    },
    {
      Header: "Actions",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        const isEditActionDisabled = isEditDisabled(original.startDate, original.startTime);
        const isLiveMonitoringAvailable = (startDate, startTime, expiryDate, expiryTime) => {
          if (!startDate || !startTime || !expiryDate || !expiryTime) return false;
          const startDateTime = new Date(`${startDate}T${startTime}Z`);
          const endDateTime = new Date(`${expiryDate}T${expiryTime}Z`);
          const currentUTC = new Date();
          return currentUTC >= startDateTime && currentUTC <= endDateTime;
        };
        const isLiveAvailable = isLiveMonitoringAvailable(
          original.startDate,
          original.startTime,
          original.expiryDate,
          original.expiryTime
        );
        const visibleActionList = actionList.filter(action => {
          if (action.id === 'edit') {
            if (original.publishStatus !== 'DRAFT' || isEditActionDisabled) {
              return false;
            }
          }
          if (action.id === 'viewDetails') {
            if (original.publishStatus !== 'PUBLISHED') {
              return false;
            }
          }
          if (action.id === 'publish' && (original.publishStatus === 'PUBLISHED' || original.assessmentStatus === 'DRAFT')) {
            return false;
          }
          if (action.id === 'reschedule' && (!isEditActionDisabled || original.assessmentStatus === 'DRAFT')) {
            return false;
          }
          if (action.id === 'liveMonitoring' && !isLiveAvailable) {
            return false;
          }
          return true;
        });
        return (
          <MoreActions
            actionOptions={visibleActionList}
            rowId={original.id}
            isHorizontal={true}
          />
        );
      },
    }
  ];
}

export const searchInputOptions = [
  { id: 'global', name: 'Global Search' },
  { id: 'assessmentCode', name: 'Assessment Code' },
  { id: 'assessmentName', name: 'Assessment Name' },
]

export const statusTypes = [
  {
    statusName: "DRAFT",
    statusType: "Draft",
  },
  {
    statusName: "SCHEDULED",
    statusType: "Scheduled",
  },
  {
    statusName: "COMPLETED",
    statusType: "Completed",
  },
  {
    statusName: "ARCHIVE",
    statusType: "Archive",
  },
]

export const ignoredKeys = ['academicYearId', 'searchString', 'curriculumId', 'classId'];

export const statusCountMap: Record<string, string> = {
  draft: "draftCount",
  readyForReview: "readyForReviewCount",
  approved: "approvedCount",
  // scheduled: "scheduledCount",          // only if your API provides it
  inProgress: "inProgressCount",
  // grading: "gradingCount",              // only if your API provides it
  resultsPublished: "resultsPublishedCount",
  archived: "archivedCount",
};
