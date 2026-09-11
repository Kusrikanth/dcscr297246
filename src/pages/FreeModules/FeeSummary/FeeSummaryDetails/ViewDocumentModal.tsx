
import { useMemo } from "react";
import TableContainer from "../../../../Components/Common/TableContainer";
import { generateColumnsForViewDocument } from "./helper";

const ViewDocumentModal = (props: any) => {

    const roleColumns = useMemo(() => generateColumnsForViewDocument(), [props.data]);

    return (
        <>
            <div className='tw-pb-3'>
                <TableContainer
                    columns={roleColumns || []}
                    data={props.data || []}
                    divClass="tw-overflow-x-auto tw-mb-3"
                    theadClass="tw-bg-gray-100 tw-text-gray-600 tw-align-middle"
                    showPagination={false}
                />
            </div>
        </>
    );
};

export default ViewDocumentModal;
