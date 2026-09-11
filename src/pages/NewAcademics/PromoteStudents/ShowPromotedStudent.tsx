import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {  TextInput } from '../../../Components/Common'
import { IShowPromotedStudent } from './promoteStudentTypes'
import NoDataComp from '../../../Components/Common/NoDataComp';
import TableContainer from '../../../Components/Common/TableContainer';
import { showPromotedStudentColumns } from './helper';
import { debounce, searhWithTextInList } from '../../../utility/commonutility';

const ShowPromotedStudent = (props: IShowPromotedStudent) => {
    const [searchState, setSearchState] =
        useState<string>('');
    const [students,setStudents]=useState([]);

    function search(event: any) {
        let abc:any = searhWithTextInList(props.students, ['studentName', 'studentCode'], event.target.value);
        setStudents(abc);
    }
    const debounceFun = useCallback(debounce(search, 200), [props.students])
    const searchHandler = (event: any) => {
        
        setSearchState(event.target.value)
        debounceFun(event)

    }
    useEffect(()=>{ 
        if(props.isOpen&&props.students){
            setStudents(props.students)
        }
        else if(!props.isOpen&&props.students){
            setStudents([]);
            setSearchState('');
        }
    },[props.isOpen,props.students])
    const roleColumns = useMemo(() => showPromotedStudentColumns(), []);
    return (
  
        <div className="tw-p-5">
            <div className="tw-my-1 tw-px-4">
                <div className="tw-w-full">
                    <div className="tw-relative search-box">
                        <TextInput
                            name="search"
                            value={searchState}
                            onChange={searchHandler}
                            formgroupClassName={"tw-my-2"}
                            placeHolder="Search Student.."
                        />

                        <i className="ri-search-line tw-absolute tw-left-3 tw-top-1/2 -tw-translate-y-1/2 tw-text-gray-400"></i>
                    </div>
                </div>
            </div>
            {props.students && props.students.length > 0 ? (
                <TableContainer
                    columns={roleColumns || []}
                    data={students || []}
                    divClass="table-responsive tw-mb-1"
                    theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
                />
            ) : (
                <NoDataComp />
            )}
        </div>
        
    )
}

export default ShowPromotedStudent
