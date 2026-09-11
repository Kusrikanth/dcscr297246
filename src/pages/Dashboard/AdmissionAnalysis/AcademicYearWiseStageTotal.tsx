import { useMemo } from 'react'
import ReactApexChart from 'react-apexcharts';
import { useAppSelector } from '../../../hooks/storehook';
import { shallowEqual } from 'react-redux';

const AcademicYearWiseStageTotal = () => {

  const {
    currentBranchIdResp: branchId,
    getAdmissionAnalysisResp,
    currentInstIdResp: instituteId,
    classListResp,
} = useAppSelector(
    ({ appData,applicationSale}) => ({
        currentBranchIdResp: appData.currentBranchIdResp,
        getAdmissionAnalysisResp: applicationSale.getAdmissionAnalysisResp,
        currentInstIdResp: appData.currentInstIdResp,
        classListResp: applicationSale.classListResp,
    }),
    shallowEqual
);

const rowData = useMemo(() => Object.values(classListResp), [classListResp]);


const series = useMemo(() => {
  return Object.keys(getAdmissionAnalysisResp?.stage || {}).map((yearKey) => ({
    name: yearKey.split('-')[0], 
    data: Object.keys(classListResp).map((classKey) => {
      const admissionData = getAdmissionAnalysisResp?.stage?.[yearKey];
      return admissionData?.[classKey] || 0
    }),
  }));
}, [getAdmissionAnalysisResp, classListResp]);
  
  const options: ApexCharts.ApexOptions = useMemo(() => ({
    chart: {
      type: 'bar',
      toolbar: {
        show: false,
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: rowData?.length < 5 ? '30px' : '50%',
      },
    },
    dataLabels: {
      enabled: false
    },
     legend: {
        offsetY: 7,
     },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: rowData,
       labels: {
            rotate: 0,
        },
    },
    yaxis: {
      title: {
        text: 'No. of Students'
      }
    },
    colors:[ "#f06548", "#405189", "#0AB39C",],
    fill: {
      opacity: 1,
     
    },
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

export default AcademicYearWiseStageTotal