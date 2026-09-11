import { IOptionsHrtl } from "../../../Components/Common/MenuOptions";
import { StatusLabel, MenuOptionHrtl } from "../../../Components/Common";
import { ITabItem } from "../../../Components/Common/Tabs";
import { getDdMmYyyyWithMonthNameFormat } from "../../../utility/dateutility";

export const tabsOptions: Array<ITabItem> = [
  {
    tabId: "academic-years",
    tabName: "Academic Years"
  },
  {
    tabId: "academic-year-dates",
    tabName: "Academic Year Dates"
  }
]

export function generateAcademicYearsDateColumns(
  actionsList: Array<IOptionsHrtl>
) {
  return [
    {
      Header: "Year Name",
      accessor: "academicYearName",
      disableSortBy: true,
    },
    {
      Header: "Start Date",
      accessor: "startDate",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        let datearr = original.startDate.split("-");
        return (<span>{getDdMmYyyyWithMonthNameFormat(original.startDate)}</span>)
      },
    },
    {
      Header: "End Date",
      accessor: "endDate",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        let datearr = original.startDate.split("-");
        return (<span>{getDdMmYyyyWithMonthNameFormat(original.endDate)}</span>)
      },
    },
    {
      Header: "Challan Display",
      accessor: "isChallanDisplay",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        const challanValue = original.isChallanDisplay ? 'Yes' : 'No';
        return (<span>{challanValue}</span>);
      },
    },
    {
      Header: "Start Year",
      accessor: "startYear",
      disableSortBy: true
    },
    {
      Header: "End Year",
      accessor: "endYear",
      disableSortBy: true
    },
    {
      Header: "Status",
      accessor: "yearStatus",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <StatusLabel
            type={original.yearStatus}
            labelName={original.yearStatus}
          />
        );
      },
    },
    {
      Header: "Actions",
      filterable: false,
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <MenuOptionHrtl
            actionOptions={actionsList}
            rowId={original.instituteAcademicYearId}
          />
        );
      },
    },
  ];
}
export function generateAcademicYearsColumns() {
  return [
    {
      Header: "S.No",
      disableSortBy: true,
      Cell: ({ row: { index } }: any) => {
        return (<span>{(Number(index) + 1)}</span>)
      }
    },
    {
      Header: "Year Name",
      accessor: "academicYearName",
      disableSortBy: true
    },
    {
      Header: "Status",
      accessor: "yearStatus",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <StatusLabel
            type={original.yearStatus}
            labelName={original.yearStatus}
          />
        );
      },
    },
  ];
}

export const select2 = [
  {
    isChallanDisplayId: "true",
    isChallanDisplayType: "True",
  },
  {
    isChallanDisplayId: "false",
    isChallanDisplayType: "False",
  },
];
