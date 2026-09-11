import React, { useState } from 'react'
import ReactApexChart from 'react-apexcharts'

const FeeCollectionAnalysis = () => {
  const [activeTab,setActiveTab]=useState('today');
  let series =  [{
    name: 'Nacharam',
    data: [44, 55, 100]
  }]

    let options: any = {
    chart: {
      type: 'bar',
      toolbar: {
        show: false,
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '20%',
        endingShape: 'rounded',
        borderRadius: 10,
      },
    },
    dataLabels: {
      enabled: false
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
        labels: {
         formatter: (value:any) => { return value + "k" },
      },
      title: {
        text: 'FEE Collection ( in )'
      }
    },
    colors:["#0AB39C"],
    fill: {
      opacity: 1,
     
    },
  }
  const tabHandler=(activeTab:string)=>{
    setActiveTab(activeTab);

  }

  return (
    <>
    <div className="card fee_collection_analysis_wrap">
        <div className="card-header tw-p-0">
          <div className="tw-grid tw-grid-cols-12 tw-items-center tw-gap-2 tw-m-2">
            <div className="tw-col-span-12 lg:tw-col-span-6 tw-mt-0">
              <h4 className="card-title tw-mb-0 tw-flex-grow">
                Fee Collection Analysis
              </h4>
            </div>

            <div className="tw-col-span-12 lg:tw-col-span-6 tw-mt-0">
              <div className='tw-flex tw-justify-end'>
                <span className="tw-p-2 tw-rounded tw-cursor-pointer tw-me-1 tw-whitespace-nowrap" 
                style={{backgroundColor:`${activeTab==='today'?"#3577F119":"#40518919"}`,color:`${activeTab==='today'?"#3577F1":"#405189"}`}}
                onClick={()=>tabHandler('today')}>Today</span>
                <span className="tw-p-2 tw-rounded tw-cursor-pointer tw-me-1 tw-whitespace-nowrap"
                style={{backgroundColor:`${activeTab==='1M'?"#3577F119":"#40518919"}`,color:`${activeTab==='week'?"#3577F1":"#405189"}`}}
                onClick={()=>tabHandler('week')}
                >1M</span>
                <span className="tw-p-2 tw-rounded tw-cursor-pointer tw-me-1 tw-whitespace-nowrap"
                style={{backgroundColor:`${activeTab==='6M'?"#3577F119":"#40518919"}`,color:`${activeTab==='month'?"#3577F1":"#405189"}`}}
                onClick={()=>tabHandler('month')}
                >6M</span>
                <span className="tw-p-2 tw-rounded tw-cursor-pointer tw-me-1 tw-whitespace-nowrap"
                style={{backgroundColor:`${activeTab==='1Y'?"#3577F119":"#40518919"}`,color:`${activeTab==='month'?"#3577F1":"#405189"}`}}
                onClick={()=>tabHandler('month')}
                >1Y</span>

                </div>
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

export default FeeCollectionAnalysis