import { useMemo } from 'react'
import ReactApexChart from 'react-apexcharts';
import { useAppSelector } from '../../../hooks/storehook';
import { shallowEqual } from 'react-redux';
import {  collectionsAppliactionData, getSortedAcademicYearNames } from './helper';

const AcademicAdmissionAnalysis = () => {

  const {
    academicYearListResp,
    currentBranchIdResp: branchId,
    getAdmissionAnalysisResp,
    currentInstIdResp: instituteId,
} = useAppSelector(
    ({ instAcademics, appData,applicationSale}) => ({
        academicYearListResp: instAcademics.academicYearListResp,
        currentBranchIdResp: appData.currentBranchIdResp,
        getAdmissionAnalysisResp: applicationSale.getAdmissionAnalysisResp,
        currentInstIdResp: appData.currentInstIdResp,
    }),
    shallowEqual
);

const rowData = useMemo(() => getSortedAcademicYearNames(academicYearListResp?.data || []),[academicYearListResp]);

const admissionsData = useMemo(() => collectionsAppliactionData(rowData,getAdmissionAnalysisResp?.currentVsPs?.admissions || []), [getAdmissionAnalysisResp]);


const appliactionData = useMemo(() => collectionsAppliactionData(rowData,getAdmissionAnalysisResp?.currentVsPs?.applications || []), [getAdmissionAnalysisResp]);


  const series = useMemo(() => {
    return [
      {
            name: 'Applications',
            type: 'column',
            data: appliactionData,
            color: '#0AB39C'
          }, {
            name: 'Admissions',
            type: 'column',
            data: admissionsData,
            color: '#405189'
          }
    ];
  }, [getAdmissionAnalysisResp, rowData]);

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
          text: "No.Of Applications",
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
     <ReactApexChart
        options={options}
        series={series}
        type="bar"
        height={350}
      />
     
    </>
  )
}

export default AcademicAdmissionAnalysis