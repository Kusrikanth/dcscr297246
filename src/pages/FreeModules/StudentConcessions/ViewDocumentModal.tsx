
import { useMemo, useState } from "react";
import TableContainer from "../../../Components/Common/TableContainer";
import { generateColumnsForViewDocument } from "./helper";

const ViewDocumentModal = (props: any) => {

    const roleColumns = useMemo(() => generateColumnsForViewDocument(), [props.data]);

  return (
    <>
      
      <div className='pb-3'>
      <TableContainer
              columns={roleColumns || []}
              data={props.data ||[] }
              divClass="table-responsive mb-3"
              theadClass="table-light text-muted align-middle"
              showPagination={false}
            />

    </div>
      
    </>
  );
};

export default ViewDocumentModal;
