import React, { useMemo } from 'react'
import TableContainer from '../../../../Components/Common/TableContainer'
import { useModal } from '../../../../hooks/modalhook';
import { Button, ModalContainerUpdated } from '../../../../Components/Common';
import { generateColumns } from './helper';

const DepartmentAnalysis = (props: any) => {

  const tableColumns = useMemo(() => generateColumns(), [props.data]);
  return (
    <div className="card !tw-rounded-2xl !tw-shadow-sm">
      <div className="card-header !tw-rounded-t-2xl ">
        <div className="tw-grid tw-grid-cols-12 tw-items-center">
          <div className="tw-col-span-10 lg:tw-col-span-6 tw-mt-0">
            <h4 className="card-title !tw-mb-2 !md:tw-mb-0">
              Department Analysis
            </h4>
          </div>
          <div className="tw-col-auto tw-mt-0 tw-ml-auto tw-invisible">
            <div className="tw-flex tw-items-center">
              <Button
                id="export-btn"
                variant="exportBtn"
              >
                {/* <img src={ExportIcon} className="img-fluid h-100" />
                          <UncontrolledTooltip placement="bottom" target="export-btn">
                            Export
                          </UncontrolledTooltip> */}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="card-body !tw-px-0 !tw-pt-0 !tw-pb-3">
        <TableContainer
          columns={tableColumns || []}
          data={props.data ? props.data.slice(0, -1) : []}
          tableClass="tw-mb-0"
          divClass="table-responsive !tw-overflow-x-auto max-h-400px"
          theadClass="tw-bg-gray-100 tw-text-gray-600 tw-align-middle tw-sticky tw-top-0 tw-z-[999]"
          showPagination={false}
          showFooter={true}
          tfootClass="tw-bg-white tw-align-middle tw-sticky tw-bottom-0 tw-z-[999]"
        ></TableContainer>
      </div>
    </div>
  )
}

export default DepartmentAnalysis