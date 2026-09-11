import React, { useEffect, useRef, useState } from 'react'
import ReactApexChart from 'react-apexcharts';
import { default as RupeeSvg } from "../../../assets/imagesdps/feeDashboard/RupeeSvg.svg?react";
import { default as RightIcon } from "../../../assets/imagesdps/attendence/RightIcon.svg?react";
import { default as WrongIcon } from "../../../assets/imagesdps/attendence/WrongIcon.svg?react";
import { default as LeaveIcon } from "../../../assets/imagesdps/attendence/LeaveIcon.svg?react";

const colors = ["#2A8738", "#FDA325", "#F23D4F"]

const AttendanceOverview = () => {

    const [label, setLabel] = useState<any>(["Present", "Leave", "Absent"]);
  const [series, setSeries] = useState<any>([80, 5, 15]);
  const [activeTab,setActiveTab]=useState('today');
  const ref = useRef<any>();

  const [data, setData] = useState<any>([]);

   useEffect(() => {
    ref.current && setData(ref.current.chart.theme.colors);
  }, [ref.current]);


 const chartOptions: any = {
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            value: {
              show: true,
            },
            name: {
              show: false,
            },
            total: {
              show: true,
              color: "black",
              fontSize: "29px",
              showAlways: true,
              formatter: function (w: any) {
                let total = w.globals.seriesTotals.reduce((a: any, b: any) => {
                  return a + b;
                }, 0);
                return `${total} %`;
              },
            },
          },
        },
      },
    },
    responsive: [
      {
        breakpoint: 1206,
        options: {
          chart: {
            width: 260,
            height: 260,
          },
        },
      },
      {
        breakpoint: 767,
        options: {
          chart: {
            width: 230,
            height: 230,
          },
        },
      },
    ],
    legend: {
      show: false,
    },
    chart: {
      // height: 350,
      type: "area",
    },
    labels: label,
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
    },
    colors,
  };


  const tabHandler=(activeTab:string)=>{
    setActiveTab(activeTab);

  }

  return (
    <>
        <div className="card term_wise_fee_wrapper">
        <div className="card-header">
          <div className="tw-flex tw-items-center">
            <div className="tw-w-1/2">
              <h4 className="card-title tw-mb-0 tw-grow">Attendance Overview</h4>
            </div>
            {/* <div className="col-auto ms-auto">
              <div className="ms-auto pe-3">
                  <span className="p-2 rounded-start cursor-pointer" 
                  style={{backgroundColor:`${activeTab==='today'?"#3577F119":"#40518919"}`,color:`${activeTab==='today'?"#3577F1":"#405189"}`}}
                  onClick={()=>tabHandler('today')}>Today</span>
                  <span className="p-2 cursor-pointer"
                  style={{backgroundColor:`${activeTab==='week'?"#3577F119":"#40518919"}`,color:`${activeTab==='week'?"#3577F1":"#405189"}`}}
                  onClick={()=>tabHandler('week')}
                  >Week</span>
                  <span className="p-2 rounded-end cursor-pointer"
                  style={{backgroundColor:`${activeTab==='month'?"#3577F119":"#40518919"}`,color:`${activeTab==='month'?"#3577F1":"#405189"}`}}
                  onClick={()=>tabHandler('month')}
                  >Month</span>
                </div>
            </div> */}
          </div>
        </div>

        <div className="card-body tw-p-4">
            <div className='tw-flex tw-w-full tw-justify-evenly'>

            <div className="tw-flex tw-justify-center tw-mb-3">
                <ReactApexChart
                  type="donut"
                  options={chartOptions}
                  series={series ? series : []}
                  width={200}
                  height={200}
                  ref={ref}
                  />
            </div>

            <div className='tw-flex tw-justify-center tw-gap-4 tw-mb-4 tw-flex-col'>
                {label.map((s: any, index: number) => (
                    <div className="tw-flex tw-items-center" key={index}>
                        <div
                          style={{
                            width: "10px",
                            height: "10px",
                            borderRadius: "50%",
                            backgroundColor: `${colors[index]}`,
                            marginRight: "15px",
                          }}
                        ></div>
                      <h5 className="tw-text-[16px] tw-mb-0">
                        {s} 
                      </h5>
                    </div>
                ))}
            </div>
                  </div>

                  <div className='tw-grid tw-grid-cols-3'>
                      <div className='tw-flex tw-justify-center tw-items-center tw-py-2 tw-border tw-border-solid tw-border-[#D2D0D0]'>
                        <RightIcon width="13px" height="13px" /> <span className='tw-ms-2'>Present : 25</span>
                        </div>    
                      <div className='tw-flex tw-justify-center tw-items-center tw-py-2 tw-border tw-border-solid tw-border-[#D2D0D0] tw-border-l-0'>
                      <WrongIcon width="13px" height="13px" /> <span className='tw-ms-2'>Absent : 02</span>
                        </div>    
                      <div className='tw-flex tw-justify-center tw-items-center tw-py-2 tw-border tw-border-solid tw-border-[#D2D0D0] tw-border-l-0'>
                      <LeaveIcon width="13px" height="13px" /> <span className='tw-ms-2'>Leave : 03</span>
                        </div>    
                  </div>

            {/* <div className='d-inline-block w-100 px-2'>
                <div className='d-flex justify-content-between w-100 bg-light info_wrapper px-4 py-3'>
                    <div className='d-flex flex-column'>
                        <h4 className="fs-19 mb-2 fw-normal d-flex align-items-baseline">
                            <RightIcon width="13px" height="13px" fill='#495057' /> 50K
                        </h4>

                        <h4 className="fs-16 text-muted mb-0 fw-normal">
                            Total Fee
                        </h4>
                    </div>

                    <div className='d-flex flex-column'>
                        <h4 className="fs-19 mb-2 fw-normal d-flex align-items-baseline">
                            <WrongIcon width="13px" height="13px" fill='#495057' /> 40K
                        </h4>

                        <h4 className="fs-16 text-muted mb-0 fw-normal">
                            Received
                        </h4>
                    </div>

                    <div className='d-flex flex-column'>
                        <h4 className="fs-19 mb-2 fw-normal d-flex align-items-baseline">
                            <LeaveIcon width="13px" height="13px" fill='#495057' /> 17K
                        </h4>

                        <h4 className="fs-16 text-muted mb-0 fw-normal">
                            Fee Due
                        </h4>
                    </div>
                </div>
            </div> */}
        </div>
    </div>
    </>
  )
}

export default AttendanceOverview