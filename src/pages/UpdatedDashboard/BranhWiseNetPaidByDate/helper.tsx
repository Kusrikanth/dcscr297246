import { HugeiconsIcon } from "@hugeicons/react";
import { SchoolIcon } from "@hugeicons-pro/core-stroke-standard";
import { getDdMmYyyyFormat } from "../../../utility/dateutility";

const formatAmt = (amount: any) => {
  return amount?.toLocaleString("en-IN");
};

const generateDynamicColumns = (transDateColumns: any) =>
  (Array.isArray(transDateColumns) && transDateColumns.length > 0)
    ? transDateColumns.map((sub: any, index: any) => ({
      Header: () => {
        return (
          <div>{getDdMmYyyyFormat(sub)}</div>
        )
      },
      accessor: `${sub}-${index}`,
      disableSortBy: true,
      sub: sub,
      Cell: ({ row: { original } }: any) => {
        return (
          +original[sub] ? <div>{`₹ ${formatAmt(original[sub])}`}</div> : <div>{`₹ 0`}</div>
        );
      },
      Footer: (rowsData: any) => {
        const { data } = rowsData || {}
        const totalAmt = data?.reduce((acc: any, curr: any) => acc + (curr[sub] || 0), 0)
        return (
          +totalAmt ? <div>{`₹ ${formatAmt(totalAmt)}`}</div> : <div>{`₹ 0`}</div>
        );
      }
    }))
    : [];

export function generateColumns(transDateColumns: any) {
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
      accessor: "branchName",
      disableSortBy: true,
      Footer: "Total",
      columnClassName: "sticky-left tw-w-[200px] tw-min-w-[200px] tw-max-w-[200px]",
      tdClass: "sticky-left tw-w-[200px] tw-min-w-[200px] tw-max-w-[200px]",
      footerClassName: "footerTdSticky bg-light"
    },
    ...generateDynamicColumns(transDateColumns),
    {
      Header: "Total",
      accessor: "branchTotal",
      disableSortBy: true,
      columnClassName: "tw-font-bold",
      Cell: ({ row: { original } }: any) => {
        return (+original?.branchTotal ? <div>{`₹ ${formatAmt(original?.branchTotal)}`}</div> : <div>{`₹ 0`}</div>)
      },
      Footer: (rowsData: any) => {
        const { data } = rowsData || {}
        const totalAmt = data?.reduce((acc: any, curr: any) => acc + curr?.branchTotal, 0)
        return (
          +totalAmt ? <div>{`₹ ${formatAmt(totalAmt)}`}</div> : <div>{`₹ 0`}</div>
        );
      }
    },
  ];
}

export const paymentModeOptions = [
  {
    id: "CASH",
    name: "CASH",
  },
  {
    id: "ONLINE",
    name: "ONLINE",
  },
  {
    id: "CARD_PAYMENT",
    name: "CARD PAYMENT",
  },
  {
    id: "UPI",
    name: "UPI",
  },
  {
    id: "CHEQUE",
    name: "CHEQUE",
  },
  {
    id: "DD",
    name: "DD",
  },
  {
    id: "ONLINE_PG",
    name: "ONLINE PG",
  },
  {
    id: "JODO_PAY",
    name: "JODO PAY",
  },
  {
    id: "NO_PAY",
    name: "NO PAY",
  },
  {
    id: "JODO",
    name: "JODO",
  },
  {
    id: "JODO_QR",
    name: "JODO QR",
  },
  {
    id: "JODO_FLEX",
    name: "JODO FLEX",
  },
  {
    id: "JODO_CRED",
    name: "JODO CRED",
  },
]
