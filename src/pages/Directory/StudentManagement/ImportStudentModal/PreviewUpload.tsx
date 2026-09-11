import React, { useState, useMemo } from "react";
import { generateColumns, mappingData } from "./previewuploadhelper";
//Common Component
import TableContainer from "../../../../Components/Common/TableContainer";
import Button from "../../../../Components/Common/Button";


export default function PreviewUpload() {
    const mappingColumns = useMemo(() => generateColumns(), []);
    return (
        <div className="px-4">
            <TableContainer
                columns={mappingColumns}
                data={mappingData}
                divClass="table-responsive tw-mb-1"
                theadClass="table-light text-muted align-middle"
                showPagination={false}
            // forcePage={resetPageRef.current}
            />
            <div className="text-end tw-mt-2 tw-py-4">
                <Button type="submit" variant="secondary">
                    Close
                </Button>
                {/* <button onClick={() => { }} className="btn btn-success">
                    Proceed
                </button> */}
            </div>
        </div>
    )
}