import React, { useEffect, useMemo, useState } from "react";

import { generateColumnsForExamDetails } from "./helper";
import TableContainer from "../../../Progress/DummyTable";


const AllStudentExamDetailModal = (props: any) => {

    const { examId, studentList, isOpen } = props;
    const roleColumns = useMemo(() => generateColumnsForExamDetails(), []);

    return (
        <>
               <TableContainer
                columns={roleColumns || []}
                data={studentList || []}
                divClass="tw-overflow-x-auto tw-mb-3"
                theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
                // showCheckbox={true}
            />
        </>
    );
};

export default AllStudentExamDetailModal;
