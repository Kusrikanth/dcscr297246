import { useFormik } from 'formik';
import React, { useEffect, useRef, useState } from 'react'
import ReactApexChart from 'react-apexcharts';
import { SelectInput } from '../../../../Components/Common';
// import { SelectInput } from '../../../Components/Common';
import { FailuresAnalysisFilterhProps } from './FailuresAnalysisTypes';
import { selectData1, selectData2 } from './helper';


const initialValues: FailuresAnalysisFilterhProps = {
    year: "2022-23",
    board: "CBSE",
};



const FailuresAnalysis = () => {

     const ref = useRef<any>();
     const [label, setLabel] = useState<any>(["Nacharam", "Mahedra Hills", "Nodergul"]);
     const [data, setData] = useState<any>([]);
     const [series, setSeries] = useState<any>([44, 55, 41]);

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

  let options:any =  {
        chart: {
        type: 'donut',
        },
        labels: ["Nacharam", "Mahendra Hills", "Nadergul"],
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
        legend: {
            show: false,
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
                    <div className="tw-flex tw-items-center">
                        <div className="tw-w-5/12">
                            <h4 className="card-title tw-mb-0 tw-flex-grow">
                                Failures Analysis
                            </h4>
                        </div>

                        <div className="tw-w-7/12">
                            <div className="tw-flex tw-gap-3 tw-justify-end">
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

            <div className="card-body">
                <div className="tw-flex tw-flex-wrap">
                    <div className="tw-w-7/12">
                        <div className="tw-flex tw-justify-center">
                            <ReactApexChart options={options} series={series} type="donut" width={200}
                            height={200} ref={ref} />
                        </div>
                  </div>

                  <div className="tw-w-5/12">
                    <div className="tw-flex tw-flex-col tw-w-max tw-mx-auto">
                        {series.map((s: any, index: number) => (
                            <div className="tw-flex tw-items-center tw-mb-2" key={index}>
                                <div
                                style={{
                                    width: "10px",
                                    height: "10px",
                                    borderRadius: "50%",
                                    backgroundColor: `${data[index]}`,
                                    marginRight: "5px"
                                }}
                                ></div>
                                <span className="tw-text-gray-500 tw-text-[15px]">{label[index]}</span>
                            </div>
                        ))}
                    </div>
                  </div>
                </div>
            </div>
        </div>
    </>
  )
}

export default FailuresAnalysis