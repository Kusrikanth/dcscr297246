export const titles = [
    {
        titleId: "students",
        titleValue: "Concession Amount by Concession Type (₹)",
    },
    {
        titleId: "average",
        titleValue: "Concession % by Concession Type"
    },
    {
        titleId: "amount",
        titleValue: "Students Benefited for Each Concession Type",
    },
];

export const colorsList = [
    "#405189D9",
    "#0AB39CD9",
    "#F7B84BD9",
    "#F06548D9",
    "#212529D9",
    "#299CDBD9",
    "#5A6BA5D9",
    "#13C4DED9",
    "#FACD76D9",
    "#F27E6AD9",
    "#383E47D9",
    "#3CB0EAD9" 
];

export const createChartOptions = (
    chartData: any[],
    calculatedBarHeight: any,
    minBarHeight: any,
    formatter: (val: number) => string,
    labelFormatter: (val: string) => string,
  ): ApexCharts.ApexOptions => {
    return {
      plotOptions: {
        bar: {
          barHeight: `${Math.max(minBarHeight, calculatedBarHeight)}px`, 
          distributed: true,
          horizontal: true,
          dataLabels: {
            position: "bottom",
          },
        },
      },
      chart: {
        type: "bar",
        height: Math.max(chartData.length * calculatedBarHeight, 380), 
        toolbar: {
          show: false,
        },
        stacked: true,
        offsetX: -24
      },
      colors: colorsList,
      dataLabels: {
        enabled: false,
        textAnchor: "start",
        style: {
          colors: ["#fff"],
        },
        formatter: formatter,
        offsetX: 0,
        dropShadow: {
          enabled: true,
        },
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"],
      },
      xaxis: {
        position: "bottom",
        axisBorder: {
          show: true,
        },
        title: {
          text: "Class",
          offsetX: 0,
          offsetY: 200,
        },
        labels: {
          show:true,
          formatter:labelFormatter,
        },
        categories: chartData.map((item) => item.concessionType),
      },
      yaxis: {
        labels: {
          show: false,
        },
      },
      legend: {
        show: false,
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        y: {
          formatter: formatter
        },
      },
      responsive: [
        {
          breakpoint: 1206,
          options: {
            dataLabels: {
              enabled: false,
            },
          },
        },
        {
          breakpoint: 991,
          options: {
            dataLabels: {
              enabled: true,
              offsetX: 10,        
            },
          },
        },
      ],
    };
  };