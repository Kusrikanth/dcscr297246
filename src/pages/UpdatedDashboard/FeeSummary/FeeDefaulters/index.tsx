import React, { useMemo } from 'react'
import TableContainer from '../../../../Components/Common/TableContainer';
import { generateColumns, TableData } from './helper';

const FeeDefaulters = () => {


const curriculumColumns = useMemo(() => generateColumns(), []);

  return (
    <>
        <div className="card">
        <div className="card-header">
          <div className="tw-grid tw-grid-cols-12 tw-items-center">
            <div className="tw-col-span-12 lg:tw-col-span-6">
              <h4 className="card-title tw-mb-0 tw-flex-grow">
                Fee Defaulters
              </h4>
            </div>
          </div>
        </div>

        <div className="card-body tw-p-0">
            <TableContainer
                columns={curriculumColumns || []}
                data={TableData ? TableData : []}
                divClass="table-responsive"
                theadClass="table-light text-muted tw-align-middle"
                tableClass="tw-mb-0"

                // showPagination={true}
                // totalPages={10}
                // totalRecords={10}
                // callbackPaginationHndlr={() => {}}
                // currentPageNumber={0}
            />
        </div>
      </div>
    </>
  )
}

export default FeeDefaulters