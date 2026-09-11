import { useEffect, useMemo, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { getFeeDashboardConcessionAct } from "../../../../store/fee/feereport/feereportactions";
import { colorsList, createChartOptions, titles } from "./helper";
import { formatNumber } from "../helper";

type ITabDataId = "students" | "average" | "amount"

type ITabData = {
  id: ITabDataId;
  tabName: string;
  className: string;
}

const tabData: Array<ITabData> = [
  {
    id: "average",
    tabName: "Average",
    className: "tw-p-2 tw-rounded-start tw-cursor-pointer",
  },
  {
    id: "students",
    tabName: "Students",
    className: "tw-p-2 tw-cursor-pointer",
  },
  {
    id: "amount",
    tabName: "Amount",
    className: "tw-p-2 tw-rounded-end tw-cursor-pointer",
  }
]

export default function ConcessionType() {
  const dispatch = useAppDispatch();
  const [chartData, setChartData] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<ITabDataId>("average");

  const {
    academicYearListResp, currentInstIdResp: instituteId, currentBranchIdResp: branchId,
    getFeeDashboardConcessionResp } =
    useAppSelector(({ appData, instAcademics, feeReport, branchAcademics }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      currentInstIdResp: appData.currentInstIdResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      getFeeDashboardConcessionResp: feeReport.getFeeDashboardConcessionResp,
    }), shallowEqual);

  useEffect(() => {
    if (Array.isArray(academicYearListResp?.data)) {
      const { academicYearId } = academicYearListResp?.data?.find((year: any) => year.yearStatus.toLowerCase() === "current") || {};
      const payload = { academicYearId, branchId , isBranchDashBoard : true };
      dispatch(getFeeDashboardConcessionAct(generateActionPayload("fee_dashboard_concession_type", undefined, payload)))
    }
  }, [academicYearListResp])

  useEffect(() => {
    if (getFeeDashboardConcessionResp) {
      const { feeConcessionTypeDetails, concessionDetails } = getFeeDashboardConcessionResp || {},
        { Total: feeConcessionDetails } = feeConcessionTypeDetails || {},
        { totalConcessionAmount } = concessionDetails || {};
      if (Array.isArray(feeConcessionDetails) && feeConcessionDetails.length > 0) {
        const concessionData = feeConcessionDetails.map((item: any) => ({
          ...item,
          concessionType: item?.concessionType?.split("_")?.join(" ") || "",
          concessionPerc: (+item.concessionAmount / +totalConcessionAmount) * 100
        }))
        setChartData(concessionData)
      } else {
        setChartData([])
      }
    }
  }, [getFeeDashboardConcessionResp])

  const defaultBarHeight = 30; 
  const maxVisibleBars = 5; 
  const calculatedBarHeight = chartData.length > maxVisibleBars ? defaultBarHeight - (chartData.length - maxVisibleBars) * 1 : defaultBarHeight; 
  const minBarHeight = 5; 

  const options: ApexCharts.ApexOptions = useMemo(() => createChartOptions(
    chartData,
    calculatedBarHeight,
    minBarHeight,
    (val: number) => activeTab === "students" ? val.toString() : activeTab === "average" ? `${val.toFixed(2)}%` : `₹ ${formatNumber(val)}`,
    (val: string) => activeTab === "students" ? val.toString() : activeTab === "average" ? `${(+val).toFixed(0)}%` : `₹ ${formatNumber(+val)}`,
  ), [chartData, activeTab]);

  const tabHandler = (tab: ITabDataId) => {
    setActiveTab(tab);
  };

  const labelNames = useMemo(() => {
    return chartData.map((item: any, index: number) => ({
      labelName: item?.concessionType,
      seriesData: activeTab === "students" ? item?.studentCount : activeTab === "average" ? item?.concessionPerc : item?.concessionAmount,
      colorName: colorsList[index],
    }))
  }, [activeTab, chartData])

  const activeTitle = useMemo(() => titles.find((title) => title.titleId === activeTab), [activeTab]);

  const series = useMemo(() => {
    return [{
      data: chartData.map((item: any) => activeTab === "students" ? item?.studentCount : activeTab === "average" ? item?.concessionPerc : item?.concessionAmount),
      name: activeTab === "students" ? "Students Benefited" : activeTab === "average" ? "Concession Percentage" : "Concession Amount",
    }]
  }, [activeTab, chartData])
  return (
    <div className="tw-bg-white tw-rounded-md tw-shadow tw-h-full term_wise_fee_wrapper">
      {/* Header */}
      <div className="tw-px-4 tw-py-3 tw-border-b">
        <div className="tw-grid tw-grid-cols-12 tw-items-center">

          <div className="tw-col-span-12 md:tw-col-span-6">
            <h4 className="tw-text-base tw-font-semibold tw-my-2 tw-flex-grow">
              Concession Type
            </h4>
          </div>

          <div className="tw-col-span-12 md:tw-col-span-6 tw-flex tw-justify-end tw-mt-2 md:tw-mt-0">
            <div className="tw-flex tw-items-center tw-pr-3 tw-gap-3">
              {tabData.map((item) => (
                <span
                  key={item.id}
                  className={item.className}
                  style={{
                    backgroundColor:
                      activeTab === item.id ? "#3577F119" : "#40518919",
                    color: activeTab === item.id ? "#3577F1" : "#405189",
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

      {/* Body */}
      <div className="tw-px-4 tw-pb-0">
        <div className="tw-grid tw-grid-cols-12">

          {/* Title */}
          <div className="tw-col-span-12 tw-text-muted tw-text-[16px] tw-font-bold">
            {activeTitle?.titleValue}
          </div>

          {/* Chart */}
          <div className="tw-col-span-12 lg:tw-col-span-8">
            <ReactApexChart
              options={options}
              series={series}
              type="bar"
              height={Math.max(chartData.length * calculatedBarHeight, 380)}
            />
          </div>

          {/* Legend */}
          <div className="tw-col-span-4 tw-hidden lg:tw-flex tw-flex-col tw-mt-1 tw-items-end tw-pl-0">
            <div>
              {labelNames.map((label: any, index: number) => (
                <div
                  key={`${label?.labelName}-${index}`}
                  className="tw-mb-2 tw-pb-1 tw-flex tw-items-center"
                >
                  <div
                    className="tw-mr-3"
                    style={{
                      width: "12px",
                      height: "12px",
                      backgroundColor: label.colorName,
                      borderRadius: "2px",
                      flexShrink: 0,
                    }}
                  />

                  <p className="tw-text-muted tw-text-[12px] tw-mb-0">
                    {`${label.labelName} : ${activeTab === "students"
                        ? label.seriesData
                        : activeTab === "average"
                          ? `${label.seriesData?.toFixed(2)}%`
                          : `₹ ${formatNumber(label.seriesData)}`
                      }`}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>

  );
}
