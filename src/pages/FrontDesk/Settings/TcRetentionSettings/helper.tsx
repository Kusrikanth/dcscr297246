import { StatusLabel } from "../../../../Components/Common";
import { IOptionsHrtl, MenuOptionHrtl } from "../../../../Components/Common/MenuOptions";
import { getDdMmYyyyWithMonthNameFormat } from "../../../../utility/dateutility";
import { TcRetentionMasterType } from "../../../../utility/tcretentionutility";

interface ITcRetentionMasterConfig {
  /** Tab and column title; also used in the Add button, add/edit modal, toasts and delete confirmation. */
  title: string;
  showClosure: boolean;
}

export const tcRetentionMasterConfigs: Record<TcRetentionMasterType, ITcRetentionMasterConfig> = {
  leavingReason: {
    title: "Reason for Leaving",
    showClosure: false,
  },
  retentionStatus: {
    title: "Retention Status",
    showClosure: true,
  },
  retentionOfferType: {
    title: "Retention Offer Type",
    showClosure: false,
  },
};

export function generateColumns(actionsList: Array<IOptionsHrtl>, type: TcRetentionMasterType) {
  const { title, showClosure } = tcRetentionMasterConfigs[type];
  return [
    {
      Header: title,
      accessor: "name",
      disableSortBy: true,
    },
    ...(showClosure
      ? [
          {
            Header: "Closes Follow-Up",
            accessor: "isClosure",
            disableSortBy: true,
            Cell: ({ value }: any) => {
              const status = value ? "Yes" : "No";
              return <StatusLabel type={status} labelName={status} />;
            },
          },
        ]
      : []),
    {
      Header: "Created Date",
      accessor: "createdAt",
      disableSortBy: true,
      Cell: ({ value }: any) => {
        return <span className="tw-text-nowrap">{value ? getDdMmYyyyWithMonthNameFormat(value) : "-"}</span>;
      },
    },
    {
      Header: "Actions",
      filterable: false,
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return <MenuOptionHrtl actionOptions={actionsList} rowId={original.id} />;
      },
    },
  ];
}
