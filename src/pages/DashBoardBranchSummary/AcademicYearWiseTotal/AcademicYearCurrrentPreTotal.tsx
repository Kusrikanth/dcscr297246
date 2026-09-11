import React, { useCallback, useMemo } from 'react';
import ReactApexChart from 'react-apexcharts';
import { shallowEqual } from 'react-redux';
import { useAppSelector } from '../../../hooks/storehook';
import { transformApiResponse, TransformedData } from './helper';

const AcademicYearCurrrentPreTotal = (props: any) => {
  const {
    getSchoolStrengthResp,
  } = useAppSelector(
    ({ academicRequest}) => ({
      getSchoolStrengthResp: academicRequest.getSchoolStrengthResp
    }),
    shallowEqual
  );

  const transformedResponse = useMemo(() => transformApiResponse(getSchoolStrengthResp?.currentVsPs),[getSchoolStrengthResp]);
  const mapRowDataToSeries = useCallback((transformedData: TransformedData) => {
    const years = Object.keys(transformedData);

    return years?.map((year, index) => {
      const yearData = transformedData[year];
      const mappedData = [
        yearData?.totalStudents,
        yearData?.male,
        yearData?.female,
        yearData?.newAdmissions,
        yearData?.tcTaken,
      ];

      return {
        type: 'column',
        name: year,
        data: mappedData,
        color: index % 2 === 0 ? '#0AB39C' : '#405189',
      };
    });
  }, []);

  const series = useMemo(() => mapRowDataToSeries(transformedResponse), [transformedResponse,mapRowDataToSeries]);
  

  const rowData = ['Total Students', 'Boys', 'Girls', 'New Admission', 'Tc Taken'];

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
        columnWidth: rowData.length < 6 ? '30px' : '50%',
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

export default AcademicYearCurrrentPreTotal