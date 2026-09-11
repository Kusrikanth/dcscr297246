import { ResponseData, RowData } from "./StudentAdmissionType";

const borderColors = ["#BCE3FF", "#C4F4E4", "#D8D4FE"];

const getDynamicBorderColor = (index: number): string => borderColors[index % borderColors.length];

export const transformResponseToRowData = (response: ResponseData): RowData[] => {
    return Object.entries(response).map(([key, value], index) => ({
      label: key,
      boys: value.MALE ?? 0,
      girls: value.FEMALE ?? 0,
      total: value.TOTAL,
      borderColor: getDynamicBorderColor(index), 
    }));
  };
  export function generateColumns() {
    return [
      {
        Header: "Class Name",
        accessor: "label",
        disableSortBy: true,
        columnClassName: "tw-w-[200px] tw-min-w-[200px] tw-max-w-[200px]",
        Cell: ({ row: { original } }: any) => {
          return (
            <div
              style={{ borderLeft: `4px solid ${original.borderColor}` }}
              className="tw-pl-2"
            >
              <p className="tw-font-medium tw-truncate tw-mb-1">
                {original.label}
              </p>
            </div>
          );
        },
        Footer: "",
      },
      {
        Header: "Boys",
        accessor: "boys",
        disableSortBy: true,
        columnClassName: "tw-text-center",
        footerClassName: "tw-text-center",
        Footer: ({ rows }: any) => {
          const total = rows.reduce((sum: number, row: any) => {
            const boysCount = row.values.boys;
            return sum + (isNaN(boysCount) ? 0 : Number(boysCount));
          }, 0);

          return <span>{total}</span>;
        },
      },
      {
        Header: "Girls",
        accessor: "girls",
        disableSortBy: true,
        columnClassName: "tw-text-center",
        footerClassName: "tw-text-center",
        Footer: ({ rows }: any) => {
          const total = rows.reduce((sum: number, row: any) => {
            const girlsCount = row.values.girls;
            return sum + (isNaN(girlsCount) ? 0 : Number(girlsCount));
          }, 0);

          return <span>{total}</span>;
        },
      },
      {
        Header: "Total",
        accessor: "total",
        disableSortBy: true,
        columnClassName: "tw-text-center",
        footerClassName: "tw-text-center",
        Footer: ({ rows }: any) => {
          const total = rows.reduce((sum: number, row: any) => {
            const totalCount = row.values.total;
            return sum + (isNaN(totalCount) ? 0 : Number(totalCount));
          }, 0);

          return <span>{total}</span>;
        },
      },
    ];
}

export function mapClassAnalysisToRowData(
  branchClassResp: any,
  getClassWiseAnalysisResp: any
): RowData[] {
  if (!branchClassResp?.content) return [];
  return branchClassResp.content.map((classItem: any, index: number) => {
    const analysis = getClassWiseAnalysisResp?.[classItem.id] || {};
    return {
      label: classItem.shortName,
      boys: analysis.MALE || 0,
      girls: analysis.FEMALE || 0,
      total: analysis.TOTAL || 0,
      borderColor: getDynamicBorderColor(index),
    };
  });
}