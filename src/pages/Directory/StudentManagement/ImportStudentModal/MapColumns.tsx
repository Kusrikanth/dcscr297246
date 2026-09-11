import React, { useState, useMemo } from "react";
import { generateColumns, mappingData } from "./mapcolumnshelper";
//Common Component
import TableContainer from "../../../../Components/Common/TableContainer";


export default function MapColumns() {
    const mappingColumns = useMemo(() => generateColumns(), []);
    return (
        <div className="px-4">
            <TableContainer
                columns={mappingColumns}
                data={mappingData}
                divClass="table-responsive mb-1"
                theadClass="table-light text-muted align-middle"
                showPagination={false}
            // forcePage={resetPageRef.current}
            />
            <div className="text-end tw-mt-2 tw-px-4 tw-py-4">
                <button type="submit" className="btn btn-soft-success tw-me-2">
                    Cancel
                </button>
                <button onClick={() => { }} className="btn btn-success">
                    Proceed
                </button>
            </div>
        </div>
    )
}