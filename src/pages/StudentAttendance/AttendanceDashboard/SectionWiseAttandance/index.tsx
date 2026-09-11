import React, { useEffect, useMemo, useState } from 'react';
import TableContainer from '../../../../Components/Common/TableContainer';
import { generateColumns } from './helper';
import { CustomDatePicker } from '../../../DashBoardBranchSummary/CustomDatePicker';


const SectionWiseAttandance = (props: any) => {

  const handleDateChange = ({ startDate, endDate }: any) => {
    if (startDate && endDate) {
      props.setFilterState((prev: any) => ({ ...prev, startDate, endDate }));
    }
  }

  const tableColumns = useMemo(() => generateColumns(), [props.rowData]);

  return (
    <>
      <div className="tw-bg-white tw-rounded-lg tw-overflow-hidden tw-mb-0 tw-border">
        {/* Header */}
        <div className="tw-border-b tw-p-2">
          <div className="tw-grid tw-grid-cols-12 tw-items-center tw-py-1">
            {/* Title */}
            <div className="tw-col-span-12 md:tw-col-span-5 tw-mb-2 md:tw-mb-0">
              <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                Section Analysis
              </h4>
            </div>

            {/* Date Range Picker */}
            <div className="tw-col-span-12 md:tw-col-span-7">
              <CustomDatePicker
                name="dateRange"
                startDate={props.filterState.startDate}
                endDate={props.filterState.endDate}
                onChange={handleDateChange}
                placeholder="Select a date range"
                monthsShown={2}
                formgroupClassName="tw-mb-0"
                labelText="Date Range"
                floatingLabel
              />
            </div>
          </div>
        </div>

        {/* Body */}
        <div
          className="tw-w-full tw-mx-auto tw-p-0 tw-relative"
          style={{
            zIndex: 1,
            minHeight: "100px",
            maxHeight: "396px",
          }}
        >
          <TableContainer
            columns={tableColumns || []}
            data={props.rowData || []}
            divClass="tw-overflow-auto tw-max-h-[400px]"
            theadClass="tw-bg-gray-50 tw-text-gray-500 tw-align-middle tw-sticky tw-top-0 tw-z-10"
            tfootClass="tw-sticky tw-bottom-0 tw-bg-white"
            showPagination={false}
            showFooter={true}
          />
        </div>
      </div>

    </>
  );
};

export default SectionWiseAttandance;
