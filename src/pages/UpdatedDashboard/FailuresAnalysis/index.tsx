import { useFormik } from 'formik';
import React, { useEffect, useRef, useState } from 'react'
import ReactApexChart from 'react-apexcharts';
import { SelectInput } from '../../../Components/Common';
import { FailuresAnalysisFilterhProps } from './FailuresAnalysisTypes';
import { selectData1, selectData2 } from './helper';


const initialValues: FailuresAnalysisFilterhProps = {
    year: "VI",
    board: "CBSE",
};



const FailuresAnalysis = () => {

     const ref = useRef<any>();
     const [label, setLabel] = useState<any>(["Cash", "Cheques", "DD"]);
     const [data, setData] = useState<any>([]);

      useEffect(() => {
    ref.current && setData(ref.current.chart.theme.colors);
  }, [ref.current]);

const [classWiseMarkFilterState, setClassWiseMarkFilterState] =
    useState<FailuresAnalysisFilterhProps>(initialValues);

    const ClassWiseMarkFilterForm = useFormik({
    enableReinitialize: true,
    initialValues: classWiseMarkFilterState,
    onSubmit: (values) => {},
  })

  let series:number[] = [44, 55, 41];

  let options:any =  {
        chart: {
        type: 'donut',
        },
        labels: ["Nacharam", "Mahedra Hills", "Nodergul"],
        responsive: [
        {
            breakpoint: 1400,
            options: {
            chart: {
                width: 320,
                height: 320,
            },
            },
        },
        {
            breakpoint: 767,
            options: {
            chart: {
                width: 330,
                height: 330,
            },
            },
        },
        ],
        plotOptions: {
            pie: {
            donut: {
                labels: {
                show: true,
                value: {
                   show: true,
                   fontSize: "16px",
                },
                name: {
                    show: true,
                    formatter: function () {
                    return "Students";
                    },
                },
                total: {
                    show: true,
                    color: "black",
                    fontSize: "16px",
                    showAlways: true,
                    formatter: function (w: any) {
                    let total = w.globals.seriesTotals.reduce((a: any, b: any) => {
                        return a + b;
                    }, 0);
                    return total;
                    },
                },
                },
            },
            },
        },
        dataLabels: {
            enabled: false,
        },
    }

  return (
    <>
        <div className="card failures_analysis_wrap">
            <div className="card-header">
                <form onSubmit={ClassWiseMarkFilterForm.handleSubmit}>
                    <div className="tw-grid tw-grid-cols-12 tw-items-center">
                        <div className="tw-col-span-5">
                            <h4 className="card-title tw-mb-0 tw-flex-grow">
                                Failures Analysis
                            </h4>
                        </div>

                        <div className="tw-col-span-7">
                            <div className='tw-flex tw-gap-3 tw-justify-end'>
                                <SelectInput
                                    name="year"
                                    value={ClassWiseMarkFilterForm.values.year}
                                    onChange={ClassWiseMarkFilterForm.handleChange}
                                    menuItems={selectData1}
                                    valueKey="yearType"
                                    textKey="yearType" 
                                    inputClassName="tw-bg-gray-100 tw-border-0"
                                    formgroupClassName="tw-mb-0"
                                />
                                <SelectInput
                                    name="board"
                                    value={ClassWiseMarkFilterForm.values.board}
                                    onChange={ClassWiseMarkFilterForm.handleChange}
                                    menuItems={selectData2}
                                    valueKey="boardType"
                                    textKey="boardType"
                                    inputClassName="tw-bg-gray-100 tw-border-0"
                                    formgroupClassName="tw-mb-0"
                                />
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            <div className="card-body card_body_warp">
                <div className='tw-inline-block tw-w-full'>
                    <ReactApexChart options={options} series={series} type="donut" height={240} ref={ref} />
                </div>
            </div>
        </div>
    </>
  )
}

export default FailuresAnalysis