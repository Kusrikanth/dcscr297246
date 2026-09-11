import React, { useMemo } from 'react'
import TableContainer from '../../../../Components/Common/TableContainer'
import { viewGenerateColumns } from './helper';

const ViewBreaksCount = (props) => {
    const tableColumns = useMemo(() => viewGenerateColumns(), []);

    return (
        <>
            <div className='modal-body'>
                <TableContainer
                    columns={tableColumns || []}
                    data={Array.isArray(props?.modalData?.detailsResponseDtos) ? props?.modalData?.detailsResponseDtos : []}
                    tableClass="tw-min-w-full"
                    divClass="tw-overflow-x-auto"
                    theadClass="tw-bg-gray-100 tw-text-gray-600"
                    showPagination={false}
                ></TableContainer>
            </div>
        </>
    )
}

export default ViewBreaksCount