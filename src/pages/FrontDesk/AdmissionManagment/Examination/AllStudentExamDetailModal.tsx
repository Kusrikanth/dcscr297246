import React, { useEffect, useMemo, useState } from "react";

import { useDispatch } from "react-redux";

import { generateColumnsForExamDetails } from "./helper";
import TableContainer from "../../../Progress/DummyTable";


const AllStudentExamDetailModal = (props: any) => {

    const {  studentList } = props;
    const dispatch = useDispatch();

    const roleColumns = useMemo(() => generateColumnsForExamDetails(), []);
    return (
        <>
               <TableContainer
                columns={roleColumns || []}
                data={studentList || []}
                divClass="table-responsive tw-mb-3"
                theadClass="table-light text-muted align-middle"
                // showCheckbox={true}
            />
        </>
    );
};

export default AllStudentExamDetailModal;
