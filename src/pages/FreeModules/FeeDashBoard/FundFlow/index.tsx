import React, { useEffect, useMemo, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useAppDispatch, useAppSelector } from '../../../../hooks/storehook';
import { shallowEqual } from 'react-redux';
import { getFeeRevenueDashboardAct } from '../../../../store/fee/feereport/feereportactions';
import { generateActionPayload } from '../../../../utility/reduxutility';
import { formatNumber } from '../helper';
import { SelectInput } from '../../../../Components/Common';
import { getBranchCurriculumAct } from '../../../../store/branchsettings/branchacademics/branchacademicsactions';

const FundFlow = () => {

  const dispatch = useAppDispatch()
  const [chartData, setChartData] = useState<any[]>([])
  const [filterState, setFilterState] = useState({
    academicYearId: "",
    curriculumId: "",
  })

  const {
    academicYearListResp, currentInstIdResp: instituteId, currentBranchIdResp: branchId,
    getFeeRevenueDashboardResp, brchCurriculumResp } =
    useAppSelector(({ appData, instAcademics, feeReport, branchAcademics }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      currentInstIdResp: appData.currentInstIdResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      getFeeRevenueDashboardResp: feeReport.getFeeRevenueDashboardResp,
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
    }), shallowEqual);

  useEffect(() => {
    if (Array.isArray(academicYearListResp?.data)) {
      const { academicYearId } = academicYearListResp?.data?.find((year: any) => year.yearStatus.toLowerCase() === "current") || {};
      getFeeRevenueApiCall({ academicYearId })
      getCurriculumApiCall({ academicYearId })
      setFilterState((prevState: any) => ({ ...prevState, academicYearId }));
    }
  }, [academicYearListResp])

  useEffect(() => {
    if (Array.isArray(getFeeRevenueDashboardResp) && getFeeRevenueDashboardResp.length > 0) {
      const data = getFeeRevenueDashboardResp.reduce((acc, curr) => {
        const existingClass = acc.find((item: any) => item.classShortName === curr.classShortName);
        if (existingClass) {
          existingClass.totalAmt += curr.totalPaidAmount || 0;
        } else {
          acc.push({
            classShortName: curr.classShortName,
            totalAmt: curr.totalPaidAmount,
          });
        }
        return acc;
      }, []);
      setChartData(data)
    }
  }, [getFeeRevenueDashboardResp])


  const series = useMemo(() => [
    {
      name: "Fee Amount",
      data: chartData.map((item: any) => item.totalAmt),
    }
  ], [chartData])

  const options: ApexCharts.ApexOptions = useMemo(() => ({
    plotOptions: {
      bar: {
        columnWidth: chartData.length < 5 ? "30px" : "50%",
    },
    },
    chart: {
      type: "bar",
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      position: 'bottom',
      axisBorder: {
        show: true
      },
      title: {
        text: "Class", 
      },
      categories: chartData.map((item: any) => item.classShortName),
    },
    yaxis: {
      show: true,
      axisBorder: {
        show: true,
      },
      labels: {
        show: true,
        formatter: function (val: number) {
          return `₹ ${formatNumber(val)}`;
        }
      },
      title: {
        text: "Amount (₹)",
      },
    },
    tooltip: {
      enabled: true,
      y: {
        formatter: function (val: number) {
          return `₹ ${formatNumber(val)}`;
        },
      },
    },
    fill: {
      opacity: 1,
      colors: ["#0AB39C", "#F0F0F0"],
    },
  }), [chartData])

  const getCurriculumApiCall = (otherProps?: any) => {
    const curriculumParams = { academicYearId: filterState.academicYearId, branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", ...otherProps };
    dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, curriculumParams)));
  }

  const getFeeRevenueApiCall = (otherProps?: any) => {
    const payload = {
      branchId, academicYearId: filterState.academicYearId, curriculumId: filterState.curriculumId, ...otherProps
    }
    dispatch(getFeeRevenueDashboardAct(generateActionPayload("fee_revenue_dashboard", undefined, payload)))
  }

  const onChangeFilterHndlr = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFilterState((prevState: any) => ({ ...prevState, [name]: value }));
    getFeeRevenueApiCall({ [name]: value });
  }

  return (
    <>
      <div className="tw-bg-white tw-rounded-md tw-shadow tw-mb-6">
        {/* Header */}
        <div className="tw-px-4 tw-py-3 tw-border-b">
          <div className="tw-grid tw-grid-cols-12 tw-items-center">

            {/* Title */}
            <div className="tw-col-span-3 tw-mb-3 md:tw-mb-0">
              <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                Fee Revenue
              </h4>
            </div>

            {/* Filter */}
            <div className="tw-col-span-9  tw-ml-auto">
              <SelectInput
                name="curriculumId"
                value={filterState.curriculumId}
                onChange={onChangeFilterHndlr}
                menuItems={brchCurriculumResp?.data}
                formgroupClassName="tw-mb-0"
                valueKey="branchCurriculumId"
                textKey="curriculumName"
                labelText="Curriculum"
                floatingLabel
              />
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="tw-px-4 tw-py-4">
          <div className="tw-grid tw-grid-cols-12">
            <div className="tw-col-span-12 tw-pt-3">
              <ReactApexChart
                options={options}
                series={series}
                type="bar"
                height={350}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default FundFlow;
