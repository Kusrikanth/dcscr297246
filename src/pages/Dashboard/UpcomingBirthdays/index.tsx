import React, { useMemo, useState } from 'react'
import TableContainer from '../../../Components/Common/TableContainer'
import { generateColumns, UpcomingBirthDayData } from './helper';

const UpcomingBirthdays = () => {
  const curriculumColumns = useMemo(() => generateColumns(), []);
  const [activeTab,setActiveTab]=useState('today');

  const tabHandler=(activeTab:string)=>{
    setActiveTab(activeTab);

  }
  return (
    <>
       <div className="card upcoming_birthday_wrapper">
            <div className="card-header">
                <div className="row align-items-center">
                    <div className="col-6">
                        <h4 className="card-title mb-0 flex-grow-1">Upcoming Birthdays</h4>
                    </div>

                    <div className="col-auto ms-auto">
                        <div className="ms-auto pe-3">
                        <span className="p-2 rounded-start cursor-pointer" 
                        style={{backgroundColor:`${activeTab==='today'?"#3577F119":"#40518919"}`,color:`${activeTab==='today'?"#3577F1":"#405189"}`}}
                        onClick={()=>tabHandler('today')}>Today</span>
                        <span className="p-2 cursor-pointer"
                        style={{backgroundColor:`${activeTab==='week'?"#3577F119":"#40518919"}`,color:`${activeTab==='week'?"#3577F1":"#405189"}`}}
                        onClick={()=>tabHandler('week')}
                        >Week</span>
                        <span className="p-2 rounded-end cursor-pointer"
                        style={{backgroundColor:`${activeTab==='month'?"#3577F119":"#40518919"}`,color:`${activeTab==='month'?"#3577F1":"#405189"}`}}
                        onClick={()=>tabHandler('month')}
                        >Month</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card-body px-0 pt-0 pb-4">
                <TableContainer
                columns={curriculumColumns || []}
                data={UpcomingBirthDayData ? UpcomingBirthDayData : []}
                divClass="table-responsive mb-1"
                theadClass="table-light text-muted align-middle"
                />
            </div>
        </div>
    </>
  )
}

export default UpcomingBirthdays