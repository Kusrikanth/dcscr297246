import React, { useMemo } from 'react'
import TableContainer from '../../../../Components/Common/TableContainer';
import { TopStudentsTableDataColumns } from './helper';

const TopPresentStudents = (props: any) => {

  const topStudentsColumns = useMemo(() => TopStudentsTableDataColumns(), [props.getAttendanceDashboardResp]);

  return (
    <>
        <TableContainer
          columns={topStudentsColumns || []}
          data={props.getAttendanceDashboardResp?.top10StudentsByAttendances}
           divClass="tw-overflow-x-auto tw-mb-3"
          theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
        />
    </>
  )
}

export default TopPresentStudents