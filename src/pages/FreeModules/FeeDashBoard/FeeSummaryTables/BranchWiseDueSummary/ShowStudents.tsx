import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { shallowEqual } from "react-redux";
//Component
import TableContainer from "../../../../../Components/Common/TableContainer";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
//Action Generator
import { generateActionPayload } from "../../../../../utility/reduxutility";
import { generateStudentModalColumns } from "./helper";
import { getUnpaidStudentCountAct, setUnpaidStudentCountAct } from "../../../../../store/fee/feereport/feereportactions";
import { TextInput } from "../../../../../Components/Common";
import { IPaginationState } from "../../../../../Components/Common/Pagination";
import Button from "../../../../../Components/Common/Button";

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
        const { academicYearId, mode,studentStatus, termId, curriculumId, classId, sectionIds } = filterValues || {}
        const payload = {
            instituteId, studentStatus, branchId, curriculumId, classId, sectionId: Array.isArray(sectionIds)
                ? sectionIds.map((section: any) =>
                    typeof section === "object"
                        ? section.sectionId
                        : section
                ).join(",")
                : undefined, feeType: type, searchString, academicYearId, mode, termName: termName === "Total" ? "" : termName, ...paginationRef.current, ...otherProps
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
        <div className="tw-w-full">
            <div className="tw-grid tw-grid-cols-1">
                <div className="tw-col-span-1 tw-px-3 tw-py-3">
                    <div className="tw-relative">
                        <TextInput
                            name="searchString"
                            value={searchString}
                            onChange={filterHandler}
                            formgroupClassName="tw-mb-0"
                            labelText="Search"
                            placeHolder="Search"
                            floatingLabel
                        />
                        <i className="ri-search-line tw-absolute tw-right-3 tw-top-1/2 -tw-translate-y-1/2 tw-text-gray-400"></i>
                    </div>
                </div>

                <div className="tw-col-span-1 tw-px-0 tw-mt-2">
                    <TableContainer
                        columns={studentColumns}
                        data={
                            Array.isArray(getUnpaidStudentCountResp?.content)
                                ? getUnpaidStudentCountResp?.content
                                : []
                        }
                        divClass="tw-overflow-x-auto tw-mb-1"
                        tableClass="tw-whitespace-nowrap"
                        theadClass="tw-table-light tw-text-gray-500 tw-align-middle"
                        showPagination={true}
                        totalPages={totalPages || 0}
                        totalRecords={totalElements || 0}
                        callbackPaginationHndlr={paginationHndlr}
                        currentPageNumber={pageble?.pageNumber || 0}
                    />
                </div>

                <div className="tw-col-span-1 tw-px-3 tw-py-3 tw-flex tw-justify-end">
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