import React, { useState, useMemo, } from 'react'
import Pagination from '../../../../../Components/Common/Pagination';
import TableContainer from '../../../../../Components/Common/TableContainer';
import { generateColumns, StudentSubjectTableData, } from './helper';

const AssesmentObjective = () => {
    const [activeTab,setActiveTab]=useState('today');

    const tabHandler=(activeTab:string)=>{
        setActiveTab(activeTab);
    
      }
      
      const columns = useMemo(() => generateColumns(), []);

    return (
        <>
            <div className="card upcoming_event_wrapper">
                <TableContainer
          columns={columns || []}
          data={StudentSubjectTableData}
          tableClass="mb-0"
          divClass="table-responsive mb-3"
          theadClass="text-muted align-middle"
        />
        <div className="row">
          <div className="d-flex gap-2 w-auto ms-auto mx-4 mb-3">
            <button
              type="button"
              className={"btn btn-light"}
            >
              Reset
            </button>
            <button
              type="button"
              className={`btn btn-success
                `}
            >
              Save
            </button>
          </div>
        </div>
            </div>
        </>
    )
}

export default AssesmentObjective