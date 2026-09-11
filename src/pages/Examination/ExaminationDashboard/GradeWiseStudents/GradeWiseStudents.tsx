import React from "react";
import ReactApexChart from "react-apexcharts";

const GradeWiseStudents = () => {
  const series = [
    {
      name: 'A1',
      data: [44, 55, 41, 67, 22, 43]
    }, {
      name: 'A2',
      data: [13, 23, 20, 8, 13, 27]
    }, 
    {
      name: 'B1',
      data: [11, 17, 15, 15, 21, 14]
    }, 
    {
      name: 'B2',
      data: [21, 7, 25, 13, 22, 8]
    },
    {
      name: 'C1',
      data: [11, 17, 15, 15, 21, 14]
    }, 
    {
      name: 'C2',
      data: [21, 7, 25, 13, 22, 8]
    }
  ];

  const options: any = {
    chart: {
      type: 'bar',
      height: 350,
      stacked: true,
      toolbar: {
        show: false
      },
      zoom: {
        enabled: true
      }
    },
    responsive: [{
      breakpoint: 480,
      options: {
        legend: {
          position: 'bottom',
          offsetX: -10,
          offsetY: 0
        }
      }
    }],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "50%",
        borderRadiusApplication: 'end',
        borderRadiusWhenStacked: 'last',
        dataLabels: {
          total: {
            enabled: true,
            style: {
              fontSize: '13px',
              fontWeight: 900
            }
          }
        }
      },
    },
    xaxis: {
      categories: ['English Core', 'Mathematics', 'Physics', 'Chemistry',
        'Biology', 'Physical Education'
      ],
    },
    legend: {
      position: 'bottom',
    },
    fill: {
      opacity: 1
    },
    colors: ["#405189", "#0AB39C", "#FEB019", "#f06548", "#2A9D8F", "#E9C46A", "#F4A261"],
  };
  

  return (
    <div>
        <ReactApexChart
          options={options}
          series={series}
          type="bar"
          height={350}
        />
    </div>
  );
};

export default GradeWiseStudents;
