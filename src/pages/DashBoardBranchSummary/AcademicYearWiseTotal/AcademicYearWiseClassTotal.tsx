import React, { useMemo } from 'react'
import ReactApexChart from 'react-apexcharts';
import { useAppSelector } from '../../../hooks/storehook';
import { shallowEqual } from 'react-redux';

const AcademicYearWiseClassTotal = (props: any) => {
  const {
    getSchoolStrengthResp,
    classListResp,
} = useAppSelector(
    ({ applicationSale, academicRequest}) => ({
        getSchoolStrengthResp: academicRequest.getSchoolStrengthResp,
        classListResp: applicationSale.classListResp
    }),
    shallowEqual
);

const rowData = useMemo(() => Object.values(classListResp), [classListResp]);
const series = useMemo(() => {
  
  const classData = getSchoolStrengthResp?.class || {};

  const maleCounts = Object.keys(classListResp)?.map((key) => classData[key]?.MALE || 0);
  const femaleCounts = Object.keys(classListResp)?.map((key) => classData[key]?.FEMALE || 0);

  return [
    {
      name: 'Boys',
      type: 'column',
      data: maleCounts,
      color: '#0AB39C'
    }, {
      name: 'Girls',
      type: 'column',
      data: femaleCounts,
      color: '#405189'
    },
  ];
}, [getSchoolStrengthResp]);



  const options: ApexCharts.ApexOptions = useMemo(() => ({chart: {
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
      columnWidth: rowData.length < 5 ? "30px" : '50%',
    },
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    width: [1, 1, 4]
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
  }}), [rowData]);


  return (
    <>
      {series && Array.isArray(series) && series.length > 0 && <ReactApexChart
        key={props.activeId}
        options={options}
        series={series}
        type="bar"
        height={350}
      />}
    </>
  )
}

export default AcademicYearWiseClassTotal