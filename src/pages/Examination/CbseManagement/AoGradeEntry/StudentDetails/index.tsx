import React, { useState, useMemo, } from 'react'
import Pagination from '../../../../../Components/Common/Pagination';
import TableContainer from '../../../../../Components/Common/TableContainer';
import { generateColumns, StudentSubjectTableData, } from './helper';

const StudentDetails = () => {
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
            </div>
        </>
    )
}

export default StudentDetails