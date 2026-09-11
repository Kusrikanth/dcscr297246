import ReactApexChart from "react-apexcharts";
import { generateWeekLabel, getDdMmYyyyFormat, getShortMonth } from "../../../../utility/dateutility";
import { useEffect, useMemo, useState } from "react";
import { getMonthWiseTicketsAct } from "../../../../store/concernsfeedback/concernsfeedbacklist/concernsfeedbacklistaction";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual } from "react-redux";

type ITabDataId = "days" | "weeks" | "months"

type ITabData = {
  id: ITabDataId;
  tabName: string;
  className: string;
}

const tabData: Array<ITabData> = [
  {
    id: "days",
    tabName: "Days",
    className: "tw-p-2 tw-rounded-l-md tw-cursor-pointer",
  },
  {
    id: "weeks",
    tabName: "Weeks",
    className: "tw-p-2 tw-cursor-pointer",
  },
  {
    id: "months",
    tabName: "Months",
    className: "tw-p-2 tw-rounded-r-md tw-cursor-pointer",
  }
]

const MonthWiseTickets = (props: any) => {
  const [activeTab, setActiveTab] = useState('days');
  const dispatch = useAppDispatch();

  const {
    currentInstIdResp: instituteId,
    getMonthWiseTicketsResp
  } =
    useAppSelector(({ appData, concernsFeedback }) => ({
      currentInstIdResp: appData.currentInstIdResp,
      getMonthWiseTicketsResp: concernsFeedback.getMonthWiseTicketsResp

    }), shallowEqual)

  const getMonthWiseTicketsApiCall = (type?: any, otherProps?: any) => {
    const payload = { ...props.filters, instituteId, type }
    delete payload.endDate
    delete payload.startDate
    delete payload.dateType
    if (Array.isArray(payload.departmentNames)) {
      payload.departmentNames = payload.departmentNames.map((item: any) => item.name).join(",");
    }
    dispatch(getMonthWiseTicketsAct(generateActionPayload("get_month_wise_tickets", undefined, payload)))
  }

  useEffect(() => {
    if (props?.filters?.academicYearId) {
      getMonthWiseTicketsApiCall(activeTab)
    }
  }, [activeTab, props?.filters?.academicYearId, props?.filters])

  const processData = useMemo(() => {
    if (!getMonthWiseTicketsResp) {
      return {
        categories: [],
        openData: [],
        closedData: []
      };
    }

    const categories: string[] = [];
    const openData: number[] = [];
    const closedData: number[] = [];

    if (activeTab === 'days') {
      const daysData = getMonthWiseTicketsResp; 
      if (Array.isArray(daysData)) {
        daysData.forEach((dayData: any) => {
          const formattedDate = getDdMmYyyyFormat(dayData.date);
          categories.push(formattedDate);
          openData.push(dayData.openCount);
          closedData.push(dayData.closedCount);
        });
      }
    } else if (activeTab === 'weeks') {
      const weeksData = getMonthWiseTicketsResp; 
      if (Array.isArray(weeksData)) {
        weeksData.forEach((weekData: any) => {
          const weekLabel = generateWeekLabel(weekData.weekStartDate, weekData.weekEndDate);
          categories.push(weekLabel);
          openData.push(weekData.openCount);
          closedData.push(weekData.closedCount);
        });
      }
    } else if (activeTab === 'months') {
      const monthsData = getMonthWiseTicketsResp;
      if (Array.isArray(monthsData)) {
        monthsData.forEach((monthData: any) => {
          categories.push(getShortMonth(monthData.month));
          openData.push(monthData.openCount);
          closedData.push(monthData.closedCount);
        });
      }
    }

    return { categories, openData, closedData };
  }, [getMonthWiseTicketsResp, activeTab]);

  const { categories, openData, closedData } = processData;

  const series = [
    {
      name: "Open",
      data: openData,
    },
    {
      name: "Closed",
      data: closedData,
    },
  ];

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "bar",
      height: 350,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: categories.length < 9 ? '35px' : '50%',
        borderRadius: 2,
        borderRadiusApplication: "end",
        dataLabels: {
          position: "top",
        },
      },
    },
    dataLabels: {
      enabled: true,
      offsetY: -20,
      style: {
        fontSize: "12px",
        colors: ["#878a99"],
      },
      formatter: (val: number) => `${val}`,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    legend: {
      position: "bottom",
    },
    xaxis: {
      categories: categories,
      labels: {
        style: {
          fontSize: "12px",
        },
        rotate: activeTab === 'weeks' ? -45 : 0,
      },
    },
    yaxis: {
      title: {
        text: "No of Tickets",
        style: {
          fontSize: "12px",
        },
      },
    },
    colors: ["#0AB39C", "#405189"],
    tooltip: {
      y: {
        formatter: function (val) {
          return val + " tickets";
        },
      },
    },
  };

  const tabHandler = (activeTab: ITabDataId) => {
    setActiveTab(activeTab);
    getMonthWiseTicketsApiCall(activeTab);
  };

  const getTitle = () => {
    switch (activeTab) {
      case 'days':
        return 'Day wise tickets';
      case 'weeks':
        return 'Week wise tickets';
      case 'months':
        return 'Month wise tickets';
      default:
        return 'Tickets';
    }
  };

  return (
    <div className="card !tw-rounded-2xl !tw-shadow-sm">
      <div className="card-header !tw-rounded-t-2xl">
        <div className="tw-flex tw-flex-wrap tw-items-center">
          <div className="tw-w-full md:tw-w-1/2">
            <h4 className="card-title !tw-mb-0">{getTitle()}</h4>
          </div>
          <div className="tw-w-full md:tw-w-auto md:tw-ml-auto tw-mt-2 md:tw-mt-0">
            <div className="tw-flex tw-items-center tw-justify-end">
              <span className="tw-p-2 tw-rounded-l-md" style={{ backgroundColor: "#3577F119", color: "#3577F1" }}>Last 12</span> &nbsp; &nbsp;
              {tabData?.map((item) => (
                <span
                  className={item.className}
                  key={item.id}
                  style={{
                    backgroundColor: `${activeTab === item.id ? "#3577F119" : "#40518919"
                      }`,
                    color: `${activeTab === item.id ? "#3577F1" : "#405189"}`,
                  }}
                  onClick={() => tabHandler(item.id)}
                >
                  {item.tabName}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="card-body">
        <ReactApexChart
          options={options}
          series={series}
          type="bar"
          height={350}
        />
      </div>
    </div>
  );
};

export default MonthWiseTickets;