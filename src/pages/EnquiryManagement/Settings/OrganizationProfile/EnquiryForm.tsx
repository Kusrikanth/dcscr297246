import React, { useMemo } from 'react'
import TableContainer from '../../../../Components/Common/TableContainer'
import { dummyData, generateColumns } from './helper';
import { EyeIcon, Share03Icon } from '@hugeicons-pro/core-stroke-standard';
import { HugeiconsIcon } from '@hugeicons/react';

const EnquiryForm = () => {
  const menuOptions = useMemo(
    () => [
        {
            id: "view",
            actionIcon:<HugeiconsIcon icon={EyeIcon} className="text-muted" size={18} />,
            actionName: "View Details",
        },
        {
          id: "share",
          actionIcon: <HugeiconsIcon icon={Share03Icon} className=" text-muted" size={18} />,
          actionName: "Share Details",
      },
    ], []);

  const roleColumns = useMemo(() => generateColumns(menuOptions),[menuOptions]);

  return (
    <div className="card">
          <div className="card-header">
            <div className="tw-grid tw-grid-cols-12 tw-items-center">
              <div className="tw-col-span-6">
                <h4 className="card-title tw-mb-0 tw-flex-grow-1">
                  Manage Form
                </h4>
              </div>
            </div>
          </div>
        <TableContainer
          columns={roleColumns || []}
          data={dummyData || []}
          divClass="table-responsive tw-mb-3"
          theadClass="table-light tw-text-gray-500 tw-align-middle"
          showPagination={false}
        />
    </div>
  )
}

export default EnquiryForm