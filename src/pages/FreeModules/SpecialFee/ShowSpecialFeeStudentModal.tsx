import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { TextInput } from '../../../Components/Common'
import TableContainer from '../../../Components/Common/TableContainer';
import { showStudentModalColumns } from './helper';
import { debounce, searhWithTextInList } from '../../../utility/commonutility';

const ShowSpecialFeeStudentModal = (props: any) => {
    const [searchState, setSearchState] =
        useState<string>('');
    const [studentList, setStudents] = useState([]);

    function search(event: any) {
        let abc: any = searhWithTextInList(props.studentList, ['name', 'shortName'], event.target.value);
        setStudents(abc);
    }
    const debounceFun = useCallback(debounce(search, 200), [props.studentList])
    const searchHandler = (event: any) => {
        setSearchState(event.target.value)
        debounceFun(event)
    }
    useEffect(() => {
        if (props.studentList) {
            setStudents(props.studentList)
        }
    }, [props.studentList])
    const studentColumns = useMemo(() => showStudentModalColumns(), []);
    return (
        <div>
            <div className="tw-my-1 tw-px-4">
                <div className="tw-grid tw-grid-cols-12 tw-gap-3">
                    <div className="tw-col-span-12 tw-m-0 tw-p-0">
                        <div className="tw-relative">
                            <TextInput
                                name="search"
                                value={searchState}
                                onChange={searchHandler}
                                formgroupClassName="tw-my-2"
                                placeHolder="Search Student.."
                            />
                            <i className="ri-search-line tw-absolute tw-right-3 tw-top-1/2 -tw-translate-y-1/2 tw-text-gray-400" />
                        </div>
                    </div>
                </div>
            </div>

            <TableContainer
                columns={studentColumns || []}
                data={studentList || []}
                divClass="tw-overflow-x-auto"
                theadClass="tw-bg-gray-100 tw-text-gray-600 tw-text-sm tw-align-middle"
            />
        </div>
    )
}

export default ShowSpecialFeeStudentModal
