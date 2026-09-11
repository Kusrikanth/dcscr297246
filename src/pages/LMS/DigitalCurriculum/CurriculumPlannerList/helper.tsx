import { StatusLabel, UserDetails } from "../../../../Components/Common";
import { IOptionsHrtl, MoreActions } from "../../../../Components/Common/MenuOptions";
import { convertUTCToISTTimeOnly, getFormattedDateddMMMYYYY } from "../../../../utility/dateutility";

export const resolveStatuses = (row: any) => {
  const curriculum = row.curriculumStatus ?? "";
  const review = row.buildReviewStatus ?? row.reviewStatus ?? "";

  const statusKey = curriculum.toString().toLowerCase();
  const reviewKey = review.toString().toLowerCase();

  let curriculumLabel = curriculum;
  if (statusKey === "published") curriculumLabel = "PUBLISHED";
  else if (reviewKey === "approved") curriculumLabel = "APPROVED";

  let hodLabel = "-";
  if (statusKey === "published") hodLabel = "PUBLISHED";
  else if (reviewKey === "approved") hodLabel = "APPROVED";
  else if (reviewKey === "request_change") hodLabel = "REQUEST CHANGE";
  else if (reviewKey === "rejected") hodLabel = "REJECTED";

  return { curriculumLabel, hodLabel };
};

export const getCurriculumActions = (row: any, actionsList: any[]) => {
  const curriculumStatus =
    row.curriculumStatus?.toUpperCase() ||
    row.courseStatus?.toUpperCase();

  const reviewStatus =
    row.reviewStatus?.toUpperCase();

  const isDraft = curriculumStatus === "DRAFT";
  const isInProgress = curriculumStatus === "IN_PROGRESS";
  const isRequestChange = reviewStatus === "REQUEST_CHANGE";
  const isApproved = reviewStatus === "APPROVED";
  const isPublished = curriculumStatus === "PUBLISHED";

  let updatedActionList: any[] = [];

  if (isDraft) {
    updatedActionList = actionsList.filter(a => a.id === "edit");
  }
  else if (isApproved && !isPublished) {
    updatedActionList = actionsList.filter(a => a.id === "publish");
  }
  else if (isInProgress || isRequestChange) {
    updatedActionList = actionsList.filter(a => a.id === "modify-curriculum");
  }
  else if (isPublished) {
    updatedActionList = actionsList.filter(a => a.id === "View");
  }

  return updatedActionList;
};


export function generateColumns(actionsList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "Digital Curriculum",
      accessor: "subjectCurriculumName",
      disableSortBy: true,
      Cell: ({ value }: any) => value || "-",
    },
    {
      Header: "Class",
      accessor: "curriculumName",
      disableSortBy: true,
      columnClassName: "w-150px min-w-150px max-w-150px sticky-left text-wrap",
      Cell: ({ row: { original } }: any) => {
        return (
          <UserDetails
            displayName={original.curriculumName || "-"}
            displayId={original.className || "-"}
            showAvatar={false}
          />
        );
      },
    },
    {
      Header: "Subject",
      accessor: "subjectName",
      disableSortBy: true,
      Cell: ({ value }: any) => value || "-",
    },
    {
      Header: "Units",
      accessor: "unitsCount",
      disableSortBy: true,
      Cell: ({ value }: any) => value ?? "-",
    },
    {
      Header: "Chapters",
      accessor: "chaptersCount",
      disableSortBy: true,
      Cell: ({ value }: any) => value ?? "-",
    },
    {
      Header: "Topics",
      accessor: "topicsCount",
      disableSortBy: true,
      Cell: ({ value }: any) => value ?? "-",
    },
    {
      Header: "Created By",
      accessor: "createdByName",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <UserDetails
            displayName={original.createdByName || "-"}
            size="xs"
          />
        );
      },
    },
    {
      Header: "Updated",
      accessor: "lastModifiedAt",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        const [date, time] = original?.lastModifiedAt?.split("T") ?? [];
        return <UserDetails
          displayName={date ? getFormattedDateddMMMYYYY(date) : "-"}
          displayId={time ? convertUTCToISTTimeOnly(time) : "-"}
          showAvatar={false}
        ></UserDetails>
      }
    },
    {
      Header: "Curriculum Status",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        const { curriculumLabel } = resolveStatuses(original);
        return (
          <StatusLabel
            type={curriculumLabel}
            labelName={curriculumLabel}
          />
        );
      },
    },
    {
      Header: "HOD Status",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        const { hodLabel } = resolveStatuses(original);
        if (hodLabel === "-") {
          return <span className="tw-text-gray-400">–</span>;
        }
        return (
          <StatusLabel
            type={hodLabel}
            labelName={hodLabel}
          />
        );
      },
    },
    {
      Header: "Actions",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        const curriculumStatus = original.curriculumStatus;
        const reviewStatus = original.reviewStatus;

        const isPublished = curriculumStatus === "PUBLISHED";
        const isApprovedByHOD = reviewStatus === "APPROVED";
        const isRequestChange = reviewStatus === "REQUEST_CHANGE";
        const isDraft = curriculumStatus === "DRAFT";
        const isInProgress = curriculumStatus === "IN_PROGRESS";

        let updatedActionList: any[] = [];
        if (isPublished) {
          actionsList.forEach((a) => {
            if (a.id === "View") updatedActionList.push(a);
          });
        }
        else if (isApprovedByHOD) {
          actionsList.forEach((a) => {
            if (a.id === "publish") updatedActionList.push(a);
          });
        }
        else if (isRequestChange) {
          actionsList.forEach((a) => {
            if (a.id === "modify-curriculum") updatedActionList.push(a);
          });
        }
        else if (isDraft) {
          actionsList.forEach((a) => {
            if (a.id === "edit") updatedActionList.push(a);
          });
        }
        else if (isInProgress) {
          actionsList.forEach((a) => {
            if (a.id === "modify-curriculum") updatedActionList.push(a);
          });
        }
        if (!updatedActionList.length) return null;
        return (
          <MoreActions
            actionOptions={updatedActionList}
            rowId={original.id}
          />
        );
      }
    },
  ];
}

