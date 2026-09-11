import { default as RupeeSvg } from "../../../../assets/imagesdps/feeDashboard/RupeeSvg.svg?react";
import { IFeeDefaultersTableData } from "./FeeDefaultersTypes";

export function generateColumns() {
  return [
    {
      Header: "Campus",
      accessor: "campus",
    },
    {
      Header: "Total Defaulters",
      accessor: "totalDefaulters",
        Cell: ({ row: { original } }: any) => {
        return (
          <div className="tw-flex tw-items-center">
            <span className="tw-me-2">{original?.totalDefaulters}%</span>
            <div className='tw-inline-block tw-w-full'>
                <div className="progress progress_bar_wrap" role="progressbar" aria-label="Example 4px high" aria-valuenow={original?.totalDefaulters} aria-valuemin={0} aria-valuemax={100} style={{height: "4px"}}>
                    <div className="progress-bar bg-success" style={{width: `${original?.totalDefaulters}%`}}></div>
                </div>
            </div>
          </div>
        );
      },
    },
    {
      Header: "Total Amount",
      accessor: "totalAmount",
      Cell: ({ row: { original } }: any) => {
        return (
          <div className="tw-flex tw-items-center">
            <RupeeSvg width="11px" height="11px" fill={"#495057"} />
            <span>{original?.totalAmount}</span>
          </div>
        );
      },
    },
  ]
}

export const TableData: Array<IFeeDefaultersTableData> = [
  {
    id: 1,
    campus: "Nacharam",
    totalDefaulters: 86,
    totalAmount: "1,895,850.00",
  }
]