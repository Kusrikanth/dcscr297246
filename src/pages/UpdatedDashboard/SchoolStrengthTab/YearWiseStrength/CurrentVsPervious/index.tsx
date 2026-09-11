import React, { useCallback, useMemo } from 'react';
import ReactApexChart from 'react-apexcharts';
import { shallowEqual } from 'react-redux';
import { useAppSelector } from '../../../../../hooks/storehook';

interface ApiResponse {
  others: Record<string, number>;
  male: Record<string, number>;
  totalStudents: Record<string, number>;
  newAdmissions: Record<string, { OLD_ADMISSION?: number; NEW_ADMISSION: number }>;
  tcTaken: Record<string, number>;
  female: Record<string, number>;
}

interface TransformedData {
  [year: string]: {
    others: number;
    male: number;
    totalStudents: number;
    newAdmissions: number;
    tcTaken: number;
    female: number;
  };
}

function transformApiResponse(response: ApiResponse): TransformedData {
  if (!response) return {};
  const transformedData: TransformedData = {};

  Object.keys(response?.totalStudents).forEach((year) => {
    transformedData[year] = {
      others: response?.others[year] || 0,
      male: response?.male[year] || 0,
      totalStudents: response?.totalStudents[year] || 0,
      newAdmissions: response?.newAdmissions[year]?.NEW_ADMISSION || 0,
      tcTaken: response?.tcTaken[year] || 0,
      female: response?.female[year] || 0,
    };
  });

  return transformedData;
}

const AcademicYearCurrrentPreTotal = (props: any) => {
  const {
    getSchoolStrengthResp,
  } = useAppSelector(
    ({ academicRequest }) => ({
      getSchoolStrengthResp: academicRequest.getSchoolStrengthResp
    }),
    shallowEqual
  );

  const transformedResponse = useMemo(() => transformApiResponse(getSchoolStrengthResp?.currentVsPs), [getSchoolStrengthResp]);

  const mapRowDataToSeries = useCallback((transformedData: TransformedData) => {
    const years = Object.keys(transformedData);

    const data1 = years?.map((year, index) => {
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
    const newData = [...data1, {
      type: 'area',
      name: 'Total',
      data: data1[0].data.map((_, index:number) =>
        data1.reduce((sum:any, item:any) => sum + item.data[index], 0)
      ),
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
    }]
    return newData
  }, [transformedResponse]);
  
  const series = useMemo(() => mapRowDataToSeries(transformedResponse), [transformedResponse, mapRowDataToSeries]);

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
        borderRadiusApplication: "end",
        borderRadius: 2,
        dataLabels: {
          position: "top",
        },
      },
    },
    markers: {
      size: [0, 0, 4],
      hover: {
        size: 4,
      },
    },
    fill: {
      opacity: [1, 1, 0.3],
      gradient: {
        opacityFrom: 0.6,
        opacityTo: 0.8,
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