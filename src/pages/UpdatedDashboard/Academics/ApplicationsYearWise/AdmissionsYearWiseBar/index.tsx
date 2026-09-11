import { useMemo } from "react";
import ReactApexChart from "react-apexcharts";
import { useAppSelector } from "../../../../../hooks/storehook";
import { shallowEqual } from "react-redux";

const ApplicationsYearWiseBar = () => {
  const {
    getAdmissionsYearWiseResp } =
    useAppSelector(({ reports }) => ({
      getAdmissionsYearWiseResp: reports.getAdmissionsYearWiseResp,
    }), shallowEqual)

  const category = useMemo(() => Array.isArray(getAdmissionsYearWiseResp) ? getAdmissionsYearWiseResp
    .map((item: any) => item?.branchName)
    .filter((value: any, index: number, self: any) => self.indexOf(value) === index) : [], [getAdmissionsYearWiseResp]);

  const academicYears = useMemo<string[]>(() =>
    Array.isArray(getAdmissionsYearWiseResp)
      ? getAdmissionsYearWiseResp
        .map((item: any) => item?.academicYearName)
        .filter((value: string, index: number, self: string[]) => self.indexOf(value) === index)
      : [],
    [getAdmissionsYearWiseResp]);

  const series = useMemo<{ name: string; data: number[] }[]>(() =>
    Array.isArray(academicYears) ? academicYears.map((year: string) => {
      const yearData = getAdmissionsYearWiseResp.filter((item: any) => item?.academicYearName === year);

      const data = Array.isArray(category) ? category?.map((branch: string) => {
        const branchData = yearData.find((item: any) => item?.branchName === branch);
        return branchData?.admissions || 0;
      }) : [];

      return {
        name: year,
        data,
      };
    }) : [], [academicYears, category, getAdmissionsYearWiseResp]);

  const options: ApexCharts.ApexOptions = useMemo(
    () => ({
      chart: {
        type: "bar",
        stacked: false,
        height: 352,
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: category?.length <= 5 ? '35px' : '50%',
          borderRadiusApplication: "end",
          dataLabels: {
            position: "top",
          },
        },
      },
      dataLabels: {
        enabled: true,
        position: "top",
        offsetY: -20,
        style: {
          fontSize: "11px",
          colors: ["#333"],
          fontWeight: 500,
        },
      },
      stroke: {
        show: true,
        width: 4,
        colors: ["transparent"],
      },
      xaxis: {
        categories: category
      },
      yaxis: {
        title: {
          text: "Count",
        },
      },
      colors: ["#feb019", "#405189", "#0ab39c"],
    }),
    [category, series]
  );

  return (
    <>
      <div className="admissions-year-wise-container">
        <div id="chart">
          <ReactApexChart
            options={options}
            series={series}
            type="bar"
            height={352}
          />
        </div>
      </div>
    </>
  );
};

export default ApplicationsYearWiseBar;
