import React, { useMemo } from 'react'
import ReactApexChart from 'react-apexcharts';
import { shallowEqual } from 'react-redux';
import { useAppSelector } from '../../../../../hooks/storehook';

export function getSortedAcademicYearNames(data: any) {
  const sortedData = [...data].sort((a: any, b: any) => a.academicYearId - b.academicYearId);

  const academicYearNames = sortedData.map((item: any) => item.academicYearName);

  return academicYearNames;
}

const AcademicYearWiseAllTotal = (props: any) => {
  const {
    academicYearListResp,
    getSchoolStrengthResp,
  } = useAppSelector(
    ({ instAcademics, academicRequest }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      getSchoolStrengthResp: academicRequest.getSchoolStrengthResp
    }),
    shallowEqual
  );

  const rowData = useMemo(() => getSortedAcademicYearNames(academicYearListResp?.data || []), [academicYearListResp]);

  const series = useMemo(() => {
    const classData = getSchoolStrengthResp?.all || {};

    const maleCounts = rowData?.map((academicYear) => classData[academicYear]?.MALE || 0);
    const femaleCounts = rowData?.map((academicYear) => classData[academicYear]?.FEMALE || 0);
    const totalCount = rowData?.map((academicYear) => (classData[academicYear]?.MALE || 0) + (classData[academicYear]?.FEMALE || 0));

    return [
      {
        name: 'Boys',
        type: 'column',
        data: maleCounts,
        color: '#0AB39C',
      },
      {
        name: 'Girls',
        type: 'column',
        data: femaleCounts,
        color: '#405189',
      },
      {
        name: 'Total',
        type: 'area',
        data: totalCount,
        color: '#FAC364',
        fill: {
          type: "gradient",
          gradient: {
            shade: "light",
            type: "vertical",
            shadeIntensity: 0.5,
            gradientToColors: ["#CED4DC"],
            inverseColors: false,
            opacityFrom: 0.6,
            opacityTo: 0.8,
            stops: [0, 100],
          },
        },
      },
    ];
  }, [getSchoolStrengthResp, rowData]);

  const options: ApexCharts.ApexOptions = useMemo(() => ({
    chart: {
      height: 350,
      type: 'line',
      stacked: false,
      toolbar: {
        show: false
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: rowData.length < 5 ? '30px' : '50%',
        borderRadiusApplication: "end",
        borderRadius: 2,
        dataLabels: {
          position: "top",
        },
      },
    },
    dataLabels: {
      enabled: true,
      position: "bottom",
      offsetY: -20,
      style: {
        fontSize: "10px",
        colors: ["#000"],
        fontWeight: 500,
      },
      formatter: function (val: any, { seriesIndex }: any) {
        const hiddenSeries = [2];
        return hiddenSeries.includes(seriesIndex) ? "" : val;
      },
    },
    fill: {
      opacity: [1, 1, 0.3],
      gradient: {
        opacityFrom: 0.6,
        opacityTo: 0.8,
      },
    },
    markers: {
      size: [0, 0, 4],
      hover: {
        size: 4,
      },
    },
    stroke: {
      width: [0, 0, 1],
      dashArray: [0, 0, 3],
      curve: "smooth",
    },
    xaxis: {
      categories: rowData,
    },
    yaxis: [
      {
        seriesName: 'Male',
        axisTicks: {
          show: true,
        },
        axisBorder: {
          show: true,
          color: '#008FFB'
        },
        labels: {
          style: {
            colors: '#008FFB',
          }
        },
        title: {
          text: "No.Of Students",
          style: {
            color: '#008FFB',
          }
        },
        min: 0,
        tooltip: {
          enabled: true
        }
      }
    ],
    legend: {
      horizontalAlign: 'center',
      offsetX: 40
    }
  }), [rowData]);

  return (
    <>
      {series && Array.isArray(series) && series.length > 0 && <ReactApexChart
        key={props?.activeId}
        options={options}
        series={series}
        type="bar"
        height={350}
      />}
    </>
  )
}

export default AcademicYearWiseAllTotal