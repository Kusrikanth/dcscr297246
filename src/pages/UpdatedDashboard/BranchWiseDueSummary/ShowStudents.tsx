import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { shallowEqual } from "react-redux";
//Component
import TableContainer from "../../../Components/Common/TableContainer";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
//Action Generator
import { generateActionPayload } from "../../../utility/reduxutility";
import { generateStudentModalColumns } from "./helper";
import { getUnpaidStudentCountAct, setUnpaidStudentCountAct } from "../../../store/fee/feereport/feereportactions";
import { Button, TextInput } from "../../../Components/Common";
import { IPaginationState } from "../../../Components/Common/Pagination";

export default function ShowStudents({
    toggle, modalData, isOpen, filterValues
}: any) {

    const dispatch = useAppDispatch();
    const paginationRef = useRef({
        pageNo: 0, pageSize: 10
    })
    const [searchString, setSearchString] = useState("");

    const {
        academicYearListResp,
        currentBranchIdResp,
        currentInstIdResp: instituteId,
        showApiLoader,
        feeTermByTypeResp,
        getUnpaidStudentCountResp,
    } = useAppSelector(
        ({ globalData, instAcademics, appData, feeReport }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            showApiLoader: globalData.showApiLoader,
            feeTermByTypeResp: feeReport.feeTermByTypeResp,
            getUnpaidStudentCountResp: feeReport.getUnpaidStudentCountResp,
        }),
        shallowEqual
    );

    const getStudentsList = (otherProps?: any) => {
        const { branchId , termName } = modalData?.data || {}
        const { type } = modalData || {}
        const { academicYearId, mode,studentStatus, termId } = filterValues || {}
        const payload = {
            instituteId,studentStatus, branchId, feeType : type, searchString, academicYearId, mode, termName : termName === "Total" ? "" : termName, ...paginationRef.current, ...otherProps
        }
        dispatch(getUnpaidStudentCountAct(generateActionPayload("get_unpaid_student_count", undefined, payload)));
    }

    useEffect(() => {
        if (modalData) {
            getStudentsList()
        }
        return () => {
            dispatch(setUnpaidStudentCountAct(undefined))
        }
    }, [])

    const filterHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setSearchString(value);
        getStudentsList({ [name]: value })
    }

    function paginationHndlr(paginationInfo: IPaginationState) {
        paginationRef.current = paginationInfo;
        getStudentsList()
    }

    const { totalElements, totalPages, pageble } = getUnpaidStudentCountResp || {}
    const studentColumns = useMemo(() => generateStudentModalColumns(), []);

    return (
        <div className="!tw-w-full">
            <div className="!tw-flex !tw-flex-wrap">
                <div className="!tw-w-full !tw-px-3 !tw-py-3">
                    <div className="search-box">
                        <TextInput
                            name="searchString"
                            value={searchString}
                            onChange={filterHandler}
                            formgroupClassName="!tw-mb-0"
                            labelText="Search"
                            placeHolder="Search"
                            floatingLabel
                        />
                        <i className="ri-search-line search-icon"></i>
                    </div>
                </div>
                <div className="!tw-w-full !tw-px-0 !tw-mt-2">
                    <TableContainer
                        columns={studentColumns}
                        data={Array.isArray(getUnpaidStudentCountResp?.content) ? getUnpaidStudentCountResp?.content : []}
                        divClass="table-responsive !tw-mb-3"
                        tableClass="table-nowrap"
                        theadClass="table-light !tw-text-gray-500 !tw-align-middle"
                        showPagination={true}
                        totalPages={totalPages || 0}
                        totalRecords={totalElements || 0}
                        callbackPaginationHndlr={paginationHndlr}
                        currentPageNumber={pageble?.pageNumber || 0}
                    />
                </div>
                <div className="!tw-w-full !tw-py-3 !tw-px-3 !tw-flex !tw-justify-end">
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