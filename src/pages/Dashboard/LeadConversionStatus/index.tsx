import React, { useEffect, useMemo } from 'react';
import ReactApexChart from "react-apexcharts";
import { UncontrolledTooltip } from 'reactstrap';
import ExportIcon from "../../../assets/imagesdps/common_icon/export_icon.svg";
import { useAppDispatch, useAppSelector } from '../../../hooks/storehook';
import { generateActionPayload } from '../../../utility/reduxutility';
import { getLeadConversionStatusAct } from '../../../store/FrontDesk/AdmissionManagment/applicationmanagmentaction';
import { shallowEqual } from 'react-redux';
import { categoriesData, LeadConversionData } from './helper';
import { ApexOptions } from 'apexcharts';
import Button from '../../../Components/Common/Button';


const LeadConversionStatus = () => {
  const dispatch = useAppDispatch();

  const AdmissionSummaryWiseApiCall = ( otherProps?: any) => {
    let payload = {
      branchId,
      instituteId,
      ...otherProps,
  };
        dispatch(getLeadConversionStatusAct(generateActionPayload('lead_conversion_status', undefined, payload)));
}

  const {
    academicYearListResp,
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    leadConversionStatusResp
} = useAppSelector(
    ({ instAcademics, appData,applicationSale}) => ({
        academicYearListResp: instAcademics.academicYearListResp,
        currentBranchIdResp: appData.currentBranchIdResp,
        currentInstIdResp: appData.currentInstIdResp,
        leadConversionStatusResp: applicationSale.leadConversionStatusResp
    }),
    shallowEqual
);


useEffect(() => {
    AdmissionSummaryWiseApiCall();
  }, []);

const rowData = useMemo(() => LeadConversionData(leadConversionStatusResp || {}), [leadConversionStatusResp]);
const categories = useMemo(() => categoriesData(leadConversionStatusResp || {}), [leadConversionStatusResp]);
    
    const series = useMemo(() => {
    return [
      {
        name: "",
        data: rowData,
      },
    ]}, [rowData]);    

    const maxValue = Math.max(...rowData);
    const defaultBarHeight = 30; 
    const maxVisibleBars = 5; 
    const calculatedBarHeight = rowData.length > maxVisibleBars ? defaultBarHeight - (rowData.length - maxVisibleBars) * 1 : defaultBarHeight; 
    const minBarHeight = 5; 

    const options: ApexOptions = useMemo(() => {
    
      return {
        chart: {
          type: 'bar',
          height: Math.max(rowData.length * calculatedBarHeight, 380), 
          toolbar: {
            show: false
          },
          offsetX: -30
        },
        plotOptions: {
          bar: {
            barHeight: `${Math.max(minBarHeight, calculatedBarHeight)}px`, 
            distributed: true,
            horizontal: true,
            dataLabels: {
              position: 'bottom',
            },
          },
        },
        colors: [
          '#405189',
          '#299CDB',
          '#0AB39C',
          '#F7B84B',
          '#F06548',
        ],
        dataLabels: {
          enabled: true,
          textAnchor: 'start',
          formatter: function (val: any, opt: any) {
            const label = opt.w.globals.labels[opt.dataPointIndex];
            return `${label}: ${val}`;
          },
          style: {
            fontSize: '12px',
            colors: rowData.map((value: number) =>
              value < maxValue * 0.2 ? '#000000' : '#FFFFFF'
            ),
          },
          dropShadow: {
            enabled: false,
          },
        },
        stroke: {
          width: 1,
          colors: ['#fff']
        },
        xaxis: {
          categories: categories,
        },
        yaxis: {
          labels: {
            show: false
          },
        },
        tooltip: {
          y: {
            formatter: function (val: any) {
              return val;
            },
            title: {
              formatter: function (seriesName: any) {
                return "";
              },
            },
          },
        },
        legend: {
          show: true,
          position: 'bottom',
          offsetX: 10,
        },
        grid: {
          show: false
        }
      }
    }, [rowData, categories]);
  

    return (

      <div className="lead_conversion tw-bg-white tw-shadow tw-rounded-lg tw-w-full">
    <div className="tw-px-4 tw-py-3 tw-border-b tw-border-gray-200">
          <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4 tw-items-center">

            <div>
              <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                Lead Conversion Status
              </h4>
            </div>

            <div className="tw-flex tw-justify-start md:tw-justify-end">
              <Button
                variant='exportBtn'
                id="export-btn"
              >
                <img
                  src={ExportIcon}
                  className="tw-h-full tw-w-auto"
                  alt="Export"
                />
                <UncontrolledTooltip placement="bottom" target="export-btn">
                  Export
                </UncontrolledTooltip>
              </Button>
            </div>

          </div>
    </div>

    <div className="tw-px-3 tw-py-4 tw-flex tw-flex-col tw-justify-center">
        <div className="tw-flex tw-items-center tw-flex-wrap">
            <div className="tw-w-full tw-m-1">
                <ReactApexChart 
                    dir="ltr"
                    series={series}
                    options={options}
                    type="bar"
                    height={Math.max(rowData.length * calculatedBarHeight, 400)} 
                />
            </div>
        </div>
    </div>
</div>
        
    );

}
export default LeadConversionStatus;

