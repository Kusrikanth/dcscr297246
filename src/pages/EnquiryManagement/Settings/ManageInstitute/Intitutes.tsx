import React, { useMemo } from 'react'
import TableContainer from '../../../../Components/Common/TableContainer'
import { dummyData, generateColumns } from './helper';
import { TextInput } from '../../../../Components/Common';
import { HugeiconsIcon } from '@hugeicons/react';
import { Delete02StrokeStandard, EyeIcon, PencilEdit02Icon, Settings01Icon } from '@hugeicons-pro/core-stroke-standard';
import Button from '../../../../Components/Common/Button';

const Intitutes = () => {
  const menuOptions = useMemo(
    () => [
        {
            id: "view",
            actionIcon:<HugeiconsIcon icon={EyeIcon} className="tw-text-gray-500" size={18} />,
            actionName: "View Details",
        },
        {
          id: "edit",
          actionIcon: <HugeiconsIcon icon={PencilEdit02Icon} className="tw-text-gray-500" size={20} />,
          actionName: "Edit Details",
        },
        {
            id: "delete",
            actionIcon: <HugeiconsIcon icon={Delete02StrokeStandard} className="tw-text-red-500" size={18} />,
            actionName: "Delete Details",
        },
        {
            id: "settings",
            actionIcon:<HugeiconsIcon icon={Settings01Icon} className="tw-text-gray-500" size={18} />,
            actionName: "Settings Details",
        },
    ], []);

  const roleColumns = useMemo(() => generateColumns(menuOptions),[menuOptions]);

  return (
    <div className="card">
          <div className="card-header">
            <div className="tw-flex tw-items-center tw-justify-between">
              <div className="tw-w-1/2">
                <h4 className="card-title tw-mb-0 tw-flex-grow">
                  Manage Form
                </h4>
              </div>
            <div className="tw-ml-auto">
                  <Button
                    variant="primary"
                  >
                    Add Intitutes
                  </Button>
            </div>
            </div>
          </div>
          <div className="card-body">
              <div className="tw-flex tw-flex-wrap tw-gap-3">
                  <div className="tw-w-full lg:tw-w-1/3 xl:tw-w-1/4">
                      <div className="search-box">
                          <TextInput
                              name="searchString"
                              // value={filterState.searchString}
                              // onChange={filterHandler}
                              inputClassName="tw-bg-gray-100"
                              formgroupClassName="tw-mb-0"
                              placeHolder="Search..."
                          />

                          <i className="ri-search-line search-icon"></i>
                      </div>
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

export default Intitutes