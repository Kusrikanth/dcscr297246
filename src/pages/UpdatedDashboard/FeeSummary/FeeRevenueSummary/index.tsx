import React from 'react'
import ReactApexChart from 'react-apexcharts'

const FeeRevenueSummary = () => {


let series =  [{
    name: 'Estimated',
    data: [44, 55, 57]
  }, {
    name: 'Concession',
    data: [76, 85, 101]
  }, {
    name: 'Received',
    data: [35, 41, 36]
  }]

    let options: any = {
    chart: {
      type: 'bar',
    //   height: 350,
      toolbar: {
        show: false,
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '30%',
        endingShape: 'rounded',
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
      categories: ['Nacharam','Mahendra Hills', 'Nadergul'],
       labels: {
            rotate: 0,
        },
    },
    yaxis: {
      title: {
        text: '₹ (thousands)'
      }
    },
    colors:["#F06548","#405189","#0AB39C"],
    fill: {
      opacity: 1,
     
    },
  }

  return (
    <>
    <div className="card fee_revenue_summary_wrapper">
        <div className="card-header">
          <div className="tw-grid tw-grid-cols-12 tw-items-center">
            <div className="tw-col-span-12 lg:tw-col-span-6">
              <h4 className="card-title tw-mb-0 tw-flex-grow">
                Fee Revenue Summary
              </h4>
            </div>

            <div className="tw-col-span-12 lg:tw-col-span-6 tw-mt-0">
              {/* <span className="sort_selection_label">SORT BY:</span>
              <select className="sort_selection">
                <option value="1">Fee Name</option>
                <option value="2">Two</option>
                <option value="3">Three</option>
              </select> */}
            </div>
          </div>
        </div>

        <div className="card-body tw-pt-0 tw-ps-1">
          <ReactApexChart
            options={options}
            series={series}
            type="bar"
            height={350}
          />
        </div>
      </div>
    </>
  )
}

export default FeeRevenueSummary