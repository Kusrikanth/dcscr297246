import React, { useMemo } from 'react'
import TableContainer from '../../../../Components/Common/TableContainer';
import { generateColumns } from './helper';

const MostAbsenteesLastMnth = (props: any) => {

const mostAbsenteesColumns = useMemo(() => generateColumns(), [props.getAttendanceDashboardResp]);

  return (
    <>
        
            <TableContainer
                columns={mostAbsenteesColumns}
                data={props.getAttendanceDashboardResp?.mostAbsenteeLast30Days}
                divClass="tw-overflow-x-auto tw-mb-3"
                theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
            />
    </>
  )
}

export default MostAbsenteesLastMnth