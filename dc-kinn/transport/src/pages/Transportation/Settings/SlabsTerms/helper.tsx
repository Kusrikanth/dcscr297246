import {
  IOptionsHrtl,
  MenuOptionHrtl,
} from "../../../../Components/Common/MenuOptions";
import { default as RupeeSvg } from "../../../../assets/imagesdps/feeDashboard/RupeeSvg.svg?react";
import { getDisplayAmountValue } from "../../../../utility/commonutility";

export function generateColumns(actionList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "Slab Name",
      accessor: "slabName",
      disableSortBy: true,
    },
    {
      Header: "Term Name",
      accessor: "termName",
      disableSortBy: true,
    },
    {
      Header: "From Distance",
      accessor: "distanceFrom",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <span>{original?.distanceFrom} Kms</span>
        );
      },
    },
    {
      Header: "To Distance",
      accessor: "distanceTo",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <span>{original?.distanceTo} Kms</span>
        );
      },
    },
    {
      Header: "Amount",
      accessor: "amount",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <div className="tw-flex tw-items-center">
            <RupeeSvg width="11px" height="11px" fill={"#212529"} />
            <span>{getDisplayAmountValue(+original?.amount)}</span>
          </div>
        );
      },
    },
    {
      Header: "Actions",
      disableSortBy: true,
      filterable: false,
      Cell: ({ row: { original } }: any) => {
        return (
          <MenuOptionHrtl actionOptions={actionList} rowId={original.slabTermId} />
        );
      },
    },
  ];
}

