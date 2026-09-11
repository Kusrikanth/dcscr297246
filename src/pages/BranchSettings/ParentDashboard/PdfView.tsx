import React from 'react'
import { default as PdfViewSvg } from "../../../assets/imagesdps/academics/PdfViewSvg.svg?react";
import { default as Download } from "../../../assets/imagesdps/academics/Download.svg?react";
import { PdfViewProps } from './ParentDashboard'

const PdfView = (props:PdfViewProps) => {
  return (
      <div className="tw-w-full tw-bg-[#F3F8FE]">
          <div className="tw-flex tw-flex-col tw-items-center tw-py-3">

              <p className="tw-text-sm tw-font-medium">
                  {props.name}
              </p>
              <div className="tw-flex tw-flex-col tw-items-center tw-w-3/4 tw-bg-white tw-rounded-lg tw-shadow-sm tw-p-3">
                  <PdfViewSvg />
                  <div className="tw-flex tw-w-full tw-justify-between tw-items-end tw-mt-3">
                      <p className="tw-text-xs tw-text-gray-500 tw-m-0">
                          124 KB pdf file
                      </p>
                      <Download />
                  </div>
              </div>
          </div>
      </div>
  )
}

export default PdfView
