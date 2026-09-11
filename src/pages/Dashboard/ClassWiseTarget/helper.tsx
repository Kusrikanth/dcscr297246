import ReactApexChart from "react-apexcharts";

export const curriculumTypes = [
  {
    id: "CAMBRIDGE INTERNATIONAL",
    name: "CAMBRIDGE INTERNATIONAL"
  },
  {
    id: "CBSE",
    name: "CBSE"
  }
]

const ChatPercentage = ({ seriesData }: any) => {
  const series = [seriesData];

  let color = "#0AB39C";
  if (seriesData < 50) {
    color = "#F06548";
  } else if (seriesData < 75) {
    color = "#F7B84B";
  }

  const options: any = {
    chart: {
      type: "radialBar",
      width: 42,
      height: 42,
      sparkline: {
        enabled: true,
      },
    },
    plotOptions: {
      radialBar: {
        hollow: {
          margin: 0,
          size: "65%",
        },
        track: {
          margin: 1,
        },
        dataLabels: {
          show: true,
          name: {
            show: false,
          },
          value: {
            show: true,
            fontSize: "10px",
            fontWeight: 500,
            color: "#000",
            offsetY: 3,
            offsetX: 2,
            formatter: function (val: number) {
              return `${Math.round(val)}%`;
            },
          },
        },
      },
    },
    colors: [color],
    dataLabels: {
      enabled: false,
    },
  };

  return (
    <ReactApexChart
      dir="ltr"
      options={options}
      series={series}
      type="radialBar"
      height="42"
      className="apex-charts"
    />
  );
};

export function generateColumns() {
  return [
    {
      id: "expander",
      disableSortBy: true,
      Header: ({ getToggleAllRowsExpandedProps, isAllRowsExpanded }: any) => (
        <span
          {...getToggleAllRowsExpandedProps()}
          className={`expander-btn fs-18 fw-normal ${isAllRowsExpanded ? "bg-danger" : "bg-success"
            }`}
        >
          {isAllRowsExpanded ? "-" : "+"}
        </span>
      ),
      rowSpan: 2,
      columnClassName: "sticky-left tw-w-[100px] tw-min-w-[100px] tw-max-w-[100px]",
      footerClassName: "bg-light sticky-left tw-w-[100px] tw-min-w-[100px] tw-max-w-[100px]",
      Footer: "",
      columns: [
        {
          Header: "Hidden",
          displayNone: true,
          disableSortBy: true,
          columnClassName: "sticky-left tw-w-[100px] tw-min-w-[100px] tw-max-w-[100px]",
          footerClassName:
            "bg-light sticky-left tw-w-[100px] tw-min-w-[100px] tw-max-w-[100px]",
          Footer: "",
          Cell: ({ row }: any) =>
            row.canExpand ? (
              <span
                {...row.getToggleRowExpandedProps({
                  style: {
                    paddingLeft: `${row.depth * 2}rem`,
                  },
                })}
                className={`expander-btn fs-18 ${row.isExpanded ? "bg-danger" : "bg-success"
                  }`}
              >
                {row.isExpanded ? "-" : "+"}
              </span>
            ) : null,
        },
      ],
    },
    {
      Header: "Curriculum",
      accessor: "",
      disableSortBy: true,
      rowSpan: 2,
      columnClassName: "tw-text-center sticky-second-left tw-w-[200px] tw-min-w-[200px] tw-max-w-[200px]",
      footerClassName: "tw-text-center sticky-second-left tw-w-[200px] tw-min-w-[200px] tw-max-w-[200px]",
      Footer: "",
      columns: [
        {
          Header: "Curriculum Type",
          displayNone: true,
          accessor: "curriculumType",
          columnClassName: "tw-text-center sticky-second-left tw-w-[200px] tw-min-w-[200px] tw-max-w-[200px]",
          disableSortBy: true,
          Footer: "Total",
          footerClassName: "tw-text-center sticky-second-left tw-w-[200px] tw-min-w-[200px] tw-max-w-[200px] bg-light",
        },
      ],
    },
    {
      Header: "Total Sections",
      accessor: "",
      disableSortBy: true,
      rowSpan: 2,
      columnClassName: "tw-text-center",
      footerClassName: "text-white tw-font-bold",
      Footer: "",
      columns: [
        {
          Header: "",
          displayNone: true,
          accessor: "totalSections",
          columnClassName: "tw-text-center",
          disableSortBy: true,
          Footer: "",
          footerClassName: "text-white tw-font-bold",
        },
      ],
    },
    {
      Header: "Total Strength",
      accessor: "",
      disableSortBy: true,
      rowSpan: 2,
      columnClassName: "tw-text-center",
      footerClassName: "text-white tw-font-bold",
      Footer: "",
      columns: [
        {
          Header: "",
          displayNone: true,
          accessor: "totalStrength",
          columnClassName: "tw-text-center",
          disableSortBy: true,
          Footer: "",
          footerClassName: "text-white tw-font-bold",
        },
      ],
    },
    {
      Header: "Desired strength",
      accessor: "",
      disableSortBy: true,
      rowSpan: 2,
      columnClassName: "tw-text-center",
      footerClassName: "text-white tw-font-bold",
      Footer: "",
      columns: [
        {
          Header: "",
          displayNone: true,
          accessor: "desiredStrength",
          columnClassName: "tw-text-center",
          disableSortBy: true,
          Footer: "",
          footerClassName: "text-white tw-font-bold",
        },
      ],
    },
    {
      Header: "Promoted Students",
      accessor: "",
      disableSortBy: true,
      rowSpan: 2,
      columnClassName: "tw-text-center",
      footerClassName: "text-white tw-font-bold",
      Footer: "",
      columns: [
        {
          Header: "",
          displayNone: true,
          accessor: "promotedStudents",
          columnClassName: "tw-text-center",
          disableSortBy: true,
          Footer: "",
          footerClassName: "text-white tw-font-bold",
        },
      ],
    },
    {
      Header: "Admissions Target",
      accessor: "",
      disableSortBy: true,
      rowSpan: 2,
      columnClassName: "tw-text-center",
      footerClassName: "text-white tw-font-bold",
      Footer: "",
      columns: [
        {
          Header: "",
          displayNone: true,
          accessor: "admissionsTarget",
          columnClassName: "tw-text-center",
          disableSortBy: true,
          Footer: "",
          footerClassName: "text-white tw-font-bold",
        },
      ],
    },
    {
      Header: "Applications",
      accessor: "",
      disableSortBy: true,
      rowSpan: 2,
      columnClassName: "tw-text-center",
      footerClassName: "text-white tw-font-bold",
      Footer: "",
      columns: [
        {
          Header: "",
          displayNone: true,
          accessor: "applications",
          columnClassName: "tw-text-center",
          disableSortBy: true,
          Footer: "",
          footerClassName: "text-white tw-font-bold",
        },
      ],
    },
    {
      Header: "Admissions",
      accessor: "",
      disableSortBy: true,
      rowSpan: 2,
      columnClassName: "tw-text-center",
      footerClassName: "text-white tw-font-bold",
      Footer: "",
      columns: [
        {
          Header: "",
          displayNone: true,
          accessor: "admissions",
          columnClassName: "tw-text-center",
          disableSortBy: true,
          Footer: "",
          footerClassName: "text-white tw-font-bold",
        },
      ],
    },
    {
      Header: "Vacancies",
      accessor: "",
      disableSortBy: true,
      rowSpan: 2,
      columnClassName: "tw-text-center",
      footerClassName: "text-white tw-font-bold",
      Footer: "",
      columns: [
        {
          Header: "",
          displayNone: true,
          accessor: "vacancies",
          columnClassName: "tw-text-center",
          disableSortBy: true,
          Footer: "",
          footerClassName: "text-white tw-font-bold",
        },
      ],
    },
    {
      Header: "Appli To Admission (%)",
      accessor: "",
      disableSortBy: true,
      rowSpan: 2,
      columnClassName: "tw-text-center",
      footerClassName: "text-white tw-font-bold",
      Footer: "",
      columns: [
        {
          Header: "",
          displayNone: true,
          accessor: "applicationToAdmissionPer",
          columnClassName: "tw-text-center tw-w-[150px] tw-min-w-[150px] tw-max-w-[150px] tw-py-0 tw-pt-1",
          disableSortBy: true,
          Footer: "",
          footerClassName: "text-white tw-font-bold",
          Cell: ({ row: { original } }: any) => {
            const { applications, admissions } = original;
            const applicationToAdmissionPer = Number((((+admissions || 0) / (+applications || 1)) * 100).toFixed(2))
            const barColor =
              applicationToAdmissionPer <= 75
                ? "danger"
                : applicationToAdmissionPer <= 90
                  ? "warning"
                  : "success";

            return (
              <ChatPercentage
                seriesData={applicationToAdmissionPer}
              ></ChatPercentage>
            );
          },
        },
      ],
    },
    {
      Header: "Vacancies (%)",
      accessor: "",
      disableSortBy: true,
      rowSpan: 2,
      columnClassName: "tw-text-center",
      footerClassName: "text-white tw-font-bold",
      Footer: "",
      columns: [
        {
          Header: "",
          displayNone: true,
          accessor: "vacanciesPer",
          columnClassName: "tw-text-center tw-w-[150px] tw-min-w-[150px] tw-max-w-[150px] tw-py-0 tw-pt-1",
          disableSortBy: true,
          Footer: "",
          footerClassName: "text-white tw-font-bold",
          Cell: ({ row: { original } }: any) => {
            const { vacancies, desiredStrength } = original;
            const vacanciesPer = Number(((((+vacancies || 0)) / (+desiredStrength || 1)) * 100).toFixed(2))
            const barColor =
              vacanciesPer <= 75
                ? "danger"
                : vacanciesPer <= 90
                  ? "warning"
                  : "success";

            return (
              <ChatPercentage
                seriesData={vacanciesPer}
              ></ChatPercentage>
            );
          },
        },
      ],
    },
  ];
}