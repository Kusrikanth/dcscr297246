import { useFormik } from 'formik';
import React, { useState } from 'react'
import ReactApexChart from 'react-apexcharts';
import { SelectInput } from '../../../Components/Common';
import { ClassWiseHighMarksFilterTypes } from './ClassWiseHighMarksTypes';
import { selectData1, selectData2 } from './helper';

const initialValues: ClassWiseHighMarksFilterTypes = {
  board: "CBSE",
  nacharam: "Nacharam",
};

const ClassWiseHighMarks = () => {

const [classWiseHighMarksFilterState, setClassWiseHighMarksFilterState] =
    useState<ClassWiseHighMarksFilterTypes>(initialValues);

    const ClassWiseHighMarksFilterForm = useFormik({
    enableReinitialize: true,
    initialValues: classWiseHighMarksFilterState,
    onSubmit: (values) => {},
  });

  let series =  [{
    name: 'Current Year',
    data: [44, 55, 57, 56, 61, 58, 63, 60, 66, 70, 9, 76, 45, 99, 66]
  }, {
    name: 'Previous Year',
    data: [76, 85, 10, 98, 87, 105, 91, 114, 94, 50, 75, 88, 32, 55, 86]
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
        columnWidth: '50%',
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
      categories: ['PREP', 'NUR', 'PN', 'I', 'II', 'III','IV', "V", "VI", "VII", "VIII","IX", "X", "XI", "XII"],
       labels: {
            rotate: 0,
        },
    },
    yaxis: {
      title: {
        text: '(Marks)'
      }
    },
    colors:["#405189","#0AB39C"],
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
        <form onSubmit={ClassWiseHighMarksFilterForm.handleSubmit}>
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
                  value={ClassWiseHighMarksFilterForm.values.board}
                  onChange={ClassWiseHighMarksFilterForm.handleChange}
                  menuItems={selectData1}
                  valueKey="boardType"
                  textKey="boardType"
                  inputClassName="tw-bg-gray-100 tw-border-0"
                  formgroupClassName="tw-mb-0"
                />
                <SelectInput
                  name="nacharam"
                  value={ClassWiseHighMarksFilterForm.values.nacharam}
                  onChange={ClassWiseHighMarksFilterForm.handleChange}
                  menuItems={selectData2}
                  valueKey="nacharamType"
                  textKey="nacharamType"
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
            height={250}
          />
        </div>
      </div>
    </div>
    </>
  )
}

export default ClassWiseHighMarks