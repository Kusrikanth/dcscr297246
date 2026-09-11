import React, { useState, useMemo } from "react";
import { generateColumns, mappingData } from "./mapcolumnshelper";
//Common Component
import TableContainer from "../../../../Components/Common/TableContainer";
import Button from "../../../../Components/Common/Button";


export default function MapColumns() {
    const mappingColumns = useMemo(() => generateColumns(), []);
    return (
        <div className="tw-px-4">
            <TableContainer
                columns={mappingColumns}
                data={mappingData}
                divClass="table-responsive tw-mb-1"
                theadClass="table-light text-muted tw-align-middle"
                showPagination={false}
            // forcePage={resetPageRef.current}
            />
            <div className="text-end tw-mt-2 tw-px-4 tw-py-4">
                <Button type="submit" variant="secondary">
                    Cancel
                </Button>
                <Button onClick={() => { }} variant="primary">
                    Proceed
                </Button>
            </div>
        </div>
    )
}