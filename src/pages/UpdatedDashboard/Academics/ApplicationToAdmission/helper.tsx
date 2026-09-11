import { HugeiconsIcon } from "@hugeicons/react";
import { SchoolIcon } from "@hugeicons-pro/core-stroke-standard";

export function generateColumns() {
  return [
    {
      Header: () => (
        <div className="tw-flex tw-items-center tw-justify-center">
          <HugeiconsIcon icon={SchoolIcon}
            size={20}
            className="tw-me-2"
          />
          <span>Branch Name</span>
        </div>
      ),
      accessor: "hiddenBranch",
      disableSortBy: true,
      rowSpan: 2,
      columnClassName:
        "tw-text-nowrap tw-text-center sticky-left tw-w-[150px] tw-min-w-[150px] tw-max-w-[150px]",
      footerClassName:
        "tw-text-nowrap tw-text-center sticky-left tw-w-[150px] tw-min-w-[150px] tw-max-w-[150px]",
      columns: [
        {
          Header: "hidden",
          displayNone: true,
          accessor: "branchName",
          disableSortBy: true,
          columnClassName:
            "tw-text-nowrap tw-text-center sticky-left tw-w-[150px] tw-min-w-[150px] tw-max-w-[150px]",
          footerClassName:
            "tw-text-nowrap tw-text-center sticky-left tw-w-[150px] tw-min-w-[150px] tw-max-w-[150px] bg-light",
        },
      ],
    },
    {
      Header: "CBSE",
      accessor: "cbseCurriculumn",
      disableSortBy: true,
      columnClassName: "tw-text-center",
      columns: [
        {
          Header: "Applications",
          accessor: "cbseApplications",
          disableSortBy: true,
          columnClassName: "tw-text-center",
          Cell : ({ row: { original } }: any) => <span>{original?.cbseApplications || 0}</span>,
        },
        {
          Header: "Admissions",
          accessor: "cbseAdmissions",
          disableSortBy: true,
          columnClassName: "tw-text-center",
          Cell : ({ row: { original } }: any) => <span>{original?.cbseAdmissions || 0}</span>,
        },
        {
          Header: "Conversion (%)",
          accessor: "cbseApplicationToAdmissionPer",
          disableSortBy: true,
          columnClassName: "tw-text-center",
          Cell : ({ row: { original } }: any) => <span>{original?.cbseApplicationToAdmissionPer || 0}</span>,
        },
      ],
    },
    {
      Header: "EY1-EY3",
      accessor: "earlyYear",
      disableSortBy: true,
      columnClassName: "tw-text-center",
      columns: [
        {
          Header: "Applications",
          accessor: "earlyYearApplications",
          disableSortBy: true,
          columnClassName: "tw-text-center",
          Cell : ({ row: { original } }: any) => <span>{original?.earlyYearApplications || 0}</span>,
        },
        {
          Header: "Admissions",
          accessor: "earlyYearAdmissions",
          disableSortBy: true,
          columnClassName: "tw-text-center",
          Cell : ({ row: { original } }: any) => <span>{original?.earlyYearAdmissions || 0}</span>,
        },
        {
          Header: "Conversion (%)",
          accessor: "earlyYearApplicationToAdmissionPer",
          disableSortBy: true,
          columnClassName: "tw-text-center",
          Cell : ({ row: { original } }: any) => <span>{original?.earlyYearApplicationToAdmissionPer || 0}</span>,
        },
      ],
    },
    {
      Header: "IGCSE",
      accessor: "igcse",
      disableSortBy: true,
      columnClassName: "tw-text-center",
      columns: [
        {
          Header: "Applications",
          accessor: "igcseApplications",
          disableSortBy: true,
          columnClassName: "tw-text-center",
          Cell : ({ row: { original } }: any) => <span>{original?.igcseApplications || 0}</span>,
        },
        {
          Header: "Admissions",
          accessor: "igcseAdmissions",
          disableSortBy: true,
          columnClassName: "tw-text-center",
          Cell : ({ row: { original } }: any) => <span>{original?.igcseAdmissions || 0}</span>,
        },
        {
          Header: "Conversion (%)",
          accessor: "igcseApplicationToAdmissionPer",
          disableSortBy: true,
          columnClassName: "tw-text-center",
          Cell : ({ row: { original } }: any) => <span>{original?.igcseApplicationToAdmissionPer || 0}</span>,
        },
      ],
    },
    {
      Header: "Total",
      accessor: "totalApplToAdm",
      disableSortBy: true,
      columnClassName: "tw-text-center",

      columns: [
        {
          Header: "Applications",
          accessor: "totalApplications",
          disableSortBy: true,
          columnClassName: "tw-text-center tw-font-bold",
          Cell : ({ row : { original} }: any) => {
            const { cbseApplications = 0 , earlyYearApplications = 0 , igcseApplications = 0 } = original || {}
            return <div>{cbseApplications + earlyYearApplications + igcseApplications}</div>
          }
        },
        {
          Header: "Admissions",
          accessor: "totalAdmissions",
          disableSortBy: true,
          columnClassName: "tw-text-center tw-font-bold",
          Cell : ({ row : { original} }: any) => {
            const { cbseAdmissions = 0 , earlyYearAdmissions = 0 , igcseAdmissions = 0 } = original || {}
            return <div>{cbseAdmissions + earlyYearAdmissions + igcseAdmissions}</div>
          }
        },
        {
          Header: "Conversion (%)",
          accessor: "totalApplicationToAdmissionPer",
          disableSortBy: true,
          columnClassName: "tw-text-center",
          Cell : ({ row : { original} }: any) => {
            const { cbseApplications = 0 , earlyYearApplications = 0 , igcseApplications = 0 , cbseAdmissions = 0 , earlyYearAdmissions = 0 , igcseAdmissions = 0 } = original || {}
            const totalApplications = cbseApplications + earlyYearApplications + igcseApplications
            const totalAdmissions = cbseAdmissions + earlyYearAdmissions + igcseAdmissions
            return <div>{((totalAdmissions / (totalApplications || 1)) * 100).toFixed(2)}</div>
          }
        },
      ],
    },
  ];
}
