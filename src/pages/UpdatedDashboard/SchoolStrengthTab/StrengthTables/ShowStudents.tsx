import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { shallowEqual } from "react-redux";
//Component
import TableContainer from "../../../../Components/Common/TableContainer";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
//Action Generator
import { generateActionPayload } from "../../../../utility/reduxutility";
import { Button, TextInput, UserDetails } from "../../../../Components/Common";
import { IPaginationState } from "../../../../Components/Common/Pagination";
import { getClassByBranchStatusStudentsAct, setClassByBranchStatusStudentsAct } from "../../../../store/FrontDesk/Reports/reportsactions";

function generateStudentModalColumns() {
    return (
        [{
            Header: "Student Name",
            accessor: "studentName",
            disableSortBy: true,
            columnClassName: "tw-w-[300px] tw-min-w-[300px] tw-max-w-[300px]",
            Cell: ({ row: { original } }: any) => {
                return (
                    <UserDetails
                        imageUrl={original?.studentImageS3url}
                        displayId={original.studentCode}
                        displayName={original.studentName}
                        showAvatar={true}
                        size="xs"
                    />
                );
            },
        },
        {
            Header: "Curriculum",
            accessor: "curriculumName",
            disableSortBy: true,
        },
        {
            Header: "Class",
            accessor: "className",
            disableSortBy: true,
        },
        ]
    )
}

export default function ShowStudents({
    toggle, isOpen, filterValues
}: any) {

    const dispatch = useAppDispatch();
    const paginationRef = useRef({
        pageNo: 0, pageSize: 10
    })
    const [searchString, setSearchString] = useState("");

    const {
        getClassByBranchStatusStudentsResp,
    } = useAppSelector(
        ({ reports }) => ({
            getClassByBranchStatusStudentsResp: reports.getClassByBranchStatusStudentsResp,
        }),
        shallowEqual
    );

    const getStudentsList = (otherProps?: any) => {
        const payload = {
            ...filterValues, ...otherProps, ...paginationRef.current
        }
        if (payload.academicYearId) {
            dispatch(getClassByBranchStatusStudentsAct(generateActionPayload("get_class_by_branch_status_students", undefined, payload)));
        }
    }

    useEffect(() => {
        if (filterValues) {
            getStudentsList()
        }
        return () => {
            dispatch(setClassByBranchStatusStudentsAct(undefined))
        }
    }, [])

    const filterHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setSearchString(value);
        getStudentsList({ [name]: value })
    }

    function paginationHndlr(paginationInfo: IPaginationState) {
        paginationRef.current = paginationInfo;
        getStudentsList(paginationInfo)
    }

    const { totalElements, totalPages, pageble } = getClassByBranchStatusStudentsResp || {}
    const studentColumns = useMemo(() => generateStudentModalColumns(), []);

    return (
        <div className="container-fluid">
            <div className="tw-grid tw-grid-cols-12">
                <div className="tw-col-span-12 tw-px-3 tw-py-3">
                    <div className="search-box">
                        <TextInput
                            name="searchString"
                            value={searchString}
                            onChange={filterHandler}
                            formgroupClassName="mb-0"
                            labelText="Search"
                            placeHolder="Search"
                            floatingLabel
                        />
                        <i className="ri-search-line search-icon"></i>
                    </div>
                </div>
                <div className="tw-col-span-12 tw-px-0">
                    <TableContainer
                        columns={studentColumns}
                        data={Array.isArray(getClassByBranchStatusStudentsResp?.content) ? getClassByBranchStatusStudentsResp?.content : []}
                        divClass="table-responsive tw-mb-1"
                        tableClass="table-nowrap"
                        theadClass="table-light text-muted tw-align-middle"
                        showPagination={true}
                        totalPages={totalPages || 0}
                        totalRecords={totalElements || 0}
                        callbackPaginationHndlr={paginationHndlr}
                        currentPageNumber={pageble?.pageNumber || 0}
                    />
                </div>
                <div className="tw-col-span-12 tw-pb-3 tw-px-3 tw-flex tw-justify-end">
                    <Button
                        type="button"
                        onClick={toggle}
                        variant="secondary"
                    >
                        Close
                    </Button>
                </div>
            </div>
        </div>

    )
}