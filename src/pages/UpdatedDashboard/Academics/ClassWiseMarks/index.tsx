import { useFormik } from 'formik';
import React, { useState } from 'react'
import ReactApexChart from 'react-apexcharts'
import { SelectInput } from '../../../../Components/Common';
import { ClassWiseMarkFilterhProps } from './ClassWiseMarksTypes';
import { selectData1, selectData2 } from './helper';


const initialValues: ClassWiseMarkFilterhProps = {
  board: "CBSE",
  class: "VI",
};

const ClassWiseMarks = () => {

    const [classWiseMarkFilterState, setClassWiseMarkFilterState] =
    useState<ClassWiseMarkFilterhProps>(initialValues);

    const ClassWiseMarkFilterForm = useFormik({
      enableReinitialize: true,
      initialValues: classWiseMarkFilterState,
      onSubmit: (values) => {},
    });

let series =  [{
    name: 'Nacharam',
    data: [44, 55, 57, 56, 61, 58, 63, 60, 66,70]
  }, {
    name: 'Mahendra Hills',
    data: [76, 85, 101, 98, 87, 105, 91, 114, 94,50]
  }, {
    name: 'Nadergul',
    data: [35, 41, 36, 26, 45, 48, 52, 53, 41,80]
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
      categories: ['ENGLISH', ["MATHEMATICS", "THEORY"], 'SCIENCE', 'III LANG', ["GENERAL", "KNOWLEDGE"], ["HEALTH &", "PHYSICAL EDUCATION"], 'ART EDUCATION', 'DISCIPLINE', 'DISCIPLINE','DANCE EDUCATION'],
       labels: {
            rotate: 0,
        },
    },
    yaxis: {
      title: {
        text: '(Average marks %)'
      }
    },
    colors:["#F06548","#405189","#0AB39C"],
    fill: {
      opacity: 1,
     
    },
    tooltip: {
    //   y: {
    //     formatter: function (val:any) {
    //       return "₹ " + val + " thousands"
    //     }
    //   }
    }
  }

  return (
    <>
      <div className="card">
        <div className="card-header">
          <form onSubmit={ClassWiseMarkFilterForm.handleSubmit}>
            <div className="tw-flex tw-items-center">
              <div className="tw-w-1/2">
                <h4 className="card-title tw-mb-0 tw-flex-grow">
                  Class wise marks Comparison of all Branches
                </h4>
              </div>

              <div className="tw-w-auto tw-ml-auto">
                <div className="tw-flex tw-gap-3">
                  <SelectInput
                    name="board"
                    value={ClassWiseMarkFilterForm.values.board}
                    onChange={ClassWiseMarkFilterForm.handleChange}
                    menuItems={selectData1}
                    valueKey="boardType"
                    textKey="boardType"
                    inputClassName="tw-bg-gray-100 tw-border-0"
                    formgroupClassName="tw-mb-0"
                  />
                  <SelectInput
                    name="class"
                    value={ClassWiseMarkFilterForm.values.class}
                    onChange={ClassWiseMarkFilterForm.handleChange}
                    menuItems={selectData2}
                    valueKey="classType"
                    textKey="classType"
                    inputClassName="tw-bg-gray-100 tw-border-0"
                    formgroupClassName="tw-mb-0"
                  />
                </div>
            </div>
          </div>
          </form>
        </div>
        <div className="card-body">
            <div className="tw-inline-block tw-w-full">
            <ReactApexChart
                options={options}
                series={series}
                type="bar"
                height={350}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default ClassWiseMarks