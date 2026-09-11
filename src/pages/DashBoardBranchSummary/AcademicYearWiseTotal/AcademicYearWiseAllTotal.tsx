import React, { useMemo } from 'react'
import ReactApexChart from 'react-apexcharts';
import { useAppSelector } from '../../../hooks/storehook';
import { shallowEqual } from 'react-redux';
import { getSortedAcademicYearNames } from './helper';

const AcademicYearWiseAllTotal = (props: any) => {
  const {
    academicYearListResp,
    getSchoolStrengthResp,
} = useAppSelector(
    ({ instAcademics, academicRequest}) => ({
        academicYearListResp: instAcademics.academicYearListResp,
        getSchoolStrengthResp: academicRequest.getSchoolStrengthResp
    }),
    shallowEqual
);

const rowData = useMemo(() => getSortedAcademicYearNames(academicYearListResp?.data || []),[academicYearListResp]);

  const series = useMemo(() => {
    const classData = getSchoolStrengthResp?.all || {};
  
    const maleCounts = rowData?.map((academicYear) => classData[academicYear]?.MALE || 0);
    const femaleCounts = rowData?.map((academicYear) => classData[academicYear]?.FEMALE || 0);
    
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
    ];
  }, [getSchoolStrengthResp, rowData]);
  
  
  const options:  ApexCharts.ApexOptions = useMemo(() => ({
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