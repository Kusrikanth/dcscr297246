import { UserDetails } from "../../../../Components/Common";

export function generateColumnsConcession( openDetailReportModalHndlr: any) {
  return [
    {
      Header: "Concession Category %",
      accessor: "staticSlab",
      disableSortBy: true,
      columnClassName: "tw-text-center",
    },
    {
      Header: "Total Concession Amount (₹)",
      accessor: "totalConcessionAmount",
      disableSortBy: true,
      columnClassName: "tw-text-center",
      Cell: ({ row: { original } }: any) => {
        return (
          <span>
            {Math.floor(+original?.totalConcessionAmount).toLocaleString()}
          </span>
        );
      },
    },
    {
      Header: "Total Concession #",
      accessor: "totalConcessionCount",
      disableSortBy: true,
      columnClassName: "tw-text-center",
      Cell: ({ row: { original } }: { row: { original: any } }) => {
        const { totalConcessionCount } = original;
    
        return totalConcessionCount > 0 ? (
          <div
            className="tw-text-blue-500 tw-cursor-pointer tw-underline"
            onClick={() => openDetailReportModalHndlr(original)}
          >
            {totalConcessionCount}
          </div>
        ) : (
          <div>{totalConcessionCount}</div>
        );
      },
    },
    {
      Header: "Academic %",
      accessor: "academicConcession",
      disableSortBy: true,
      columnClassName: "tw-text-center",
      Cell: ({ value }: { value: number }) => `${(value).toFixed(2)}%`,
    },
    {
      Header: "Academic #",
      accessor: "academicConcessionCount",
      disableSortBy: true,
      columnClassName: "tw-text-center",
    },
    {
      Header: "Sport %",
      accessor: "sportsConcession",
      disableSortBy: true,
      columnClassName: "tw-text-center",
      Cell: ({ value }: { value: number }) => `${(value).toFixed(2)}%`,
    },
    {
      Header: "Sports #",
      accessor: "sportsConcessionCount",
      disableSortBy: true,
      columnClassName: "tw-text-center",
    },
    {
      Header: "Siblings %",
      accessor: "siblingConcession",
      disableSortBy: true,
      columnClassName: "tw-text-center",
      Cell: ({ value }: { value: number }) => `${(value).toFixed(2)}%`,
    },
    {
      Header: "Siblings #",
      accessor: "siblingConcessionCount",
      disableSortBy: true,
      columnClassName: "tw-text-center",
    },
    {
      Header: "PVA %",
      accessor: "pvaConcession",
      disableSortBy: true,
      columnClassName: "tw-text-center",
      Cell: ({ value }: { value: number }) => `${(value).toFixed(2)}%`,
    },
    {
      Header: "PVA #",
      accessor: "pvaConcessionCount",
      disableSortBy: true,
      columnClassName: "tw-text-center",
    },
    {
      Header: "Other Concession %",
      accessor: "otherConcession",
      disableSortBy: true,
      columnClassName: "tw-text-center",
      Cell: ({ value }: { value: number }) => `${(value).toFixed(2)}%`,
    },
    {
      Header: "Other Concession #",
      accessor: "otherConcessionCount",
      disableSortBy: true,
      columnClassName: "tw-text-center",
    },
    {
      Header: "Management %",
      accessor: "managementConcession",
      disableSortBy: true,
      columnClassName: "tw-text-center",
      Cell: ({ value }: { value: number }) => `${(value).toFixed(2)}%`,
    },
    {
      Header: "Management #",
      accessor: "managementConcessionCount",
      disableSortBy: true,
      columnClassName: "tw-text-center",
    },
  ];
}
export function generateColumnsFeeReceived() {
    return [
        {
          Header: "Name",
          accessor: "name",
          columnClassName: "tw-w-[200px] tw-min-w-[200px] tw-max-w-[200px]",
          disableSortBy: true,
          Cell: ({ row: { original } }: any) => {
            return (
              <>
                <UserDetails
                  imageUrl={original?.studentImageS3URL}
                  displayName={original?.studentName}
                  displayId={original?.applicationNo}
                  size="xs"
                  defaultImgType="student"
                />
              </>
            );
          },
        },
        {
          Header: "Class",
          accessor: "class",
          disableSortBy: true,
        },
        {
          Header: "Concession Type",
          accessor: "concessionType",
          disableSortBy: true,
        },
        {
          Header: "Fee Name",
          accessor: "feeName",
          disableSortBy: true,
        },
        {
          Header: "Fee Amount (₹) (Term-I)",
          accessor: "feeAmountI",
          disableSortBy: true,
        },
        {
          Header: "Concession Amount (₹) (Term-I)",
          accessor: "concessionAmountI",
          disableSortBy: true,
        },
        {
            Header: "Fee Amount (₹) (Term-II)",
            accessor: "feeAmountII",
            disableSortBy: true,
        },
        {
            Header: "Concession Amount (₹) (Term-II)",
            accessor: "concessionAmountII",
            disableSortBy: true,
        },
        {
            Header: "Fee Amount (₹) (Term-III)",
            accessor: "feeAmountIII",
            disableSortBy: true,
          },
          {
            Header: "Concession Amount (₹) (Term-III)",
            accessor: "concessionAmountIII",
            disableSortBy: true,
          },
        {
          Header: "Total Amount (₹)",
          accessor: "totalAmount",
          disableSortBy: true,
        },
      ];
}

export function generateReportDetailsColumns() {
  return ([
    {
      Header: "Student",
      accessor: "studentName",
      disableSortBy: true,
      columnClassName: "tw-w-[350px] tw-min-w-[350px] tw-max-w-[350px]",
      Cell: ({ row: { original } }: any) => {
        return (
          <UserDetails
            displayName={original?.studentName || "-"}
            displayId={original?.studentCode || "-"}
            showAvatar={false}
          />
        );
      },
    },
    {
      Header: "Class",
      accessor: "sectionName",
      disableSortBy: true,
      columnClassName: "tw-w-[150px] tw-min-w-[150px] tw-max-w-[150px]",
      Cell: ({ row: { original } }: any) => {
        return (
          <UserDetails
            displayName={original?.sectionName || "-"}
            displayId={original?.curriculumName || "-"}
            showAvatar={false}
          />
        );
      },
    },
      {
          Header: "Total Amount to Pay (₹)",
          accessor: "totalAmountToPay",
          disableSortBy: true,
          columnClassName: "tw-text-center",
          Cell: ({ row: { original } }: any) => {
            return (
              <span>
                {Math.floor(+original?.totalAmountToPay).toLocaleString()}
              </span>
            );
          },
      },
      {
          Header: "Concession Amount (₹)",
          accessor: "concessionAmount",
          disableSortBy: true,
          columnClassName: "tw-text-center",
          Cell: ({ row: { original } }: any) => {
            return (
              <span>
                {Math.floor(+original?.concessionAmount).toLocaleString()}
              </span>
            );
          },
      },
      {
          Header: "Concession Percentage %",
          accessor: "concessionPercentage",
          columnClassName: "tw-text-center",
          disableSortBy: true,
          Cell: ({ value }: { value: number }) => `${(value).toFixed(2)}%`,
      },
  ])
}

export const activeStatus = [
  {
      name: "Active",
      id: "ACTIVE",
  },
  {
      name: "In Active",
      id: "INACTIVE",
  },
]

export const feeType = [
  {
      name: "Academic",
      id: "FEE STRUCTURE",
  },
  {
      name: "Transport",
      id: "TRANSPORT FEE",
  },
]

