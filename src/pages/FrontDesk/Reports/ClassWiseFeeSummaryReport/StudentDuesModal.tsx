import { useEffect, useMemo, useRef, useState } from "react";
import { shallowEqual } from "react-redux";
import { useHistory } from "react-router-dom";
import { StatusLabel, TextInput, UserDetails } from "../../../../Components/Common";
import Button from "../../../../Components/Common/Button";
import TableContainer from "../../../../Components/Common/TableContainer";
import { IPaginationState } from "../../../../Components/Common/Pagination";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { generateActionPayload } from "../../../../utility/reduxutility";
import {
    getClassWiseFeeSummaryStudentsAct,
    resetClassWiseFeeSummaryStudentsAct,
} from "../../../../store/fee/feereport/feereportactions";
import {
    buildSampleCellStudents,
    formatAmount,
    IDrillDownCell,
    serializeFilters,
    USE_SAMPLE_CLASS_WISE_FEE_SUMMARY,
} from "./helper";

interface IStudentDuesModal {
    /** The matrix cell that was clicked; null while the modal is closed. */
    cell: IDrillDownCell | null;
    /** Applied report scope, so the student list is narrowed the same way the matrix was. */
    scope: any;
    /** Academic years, used to resolve the year the ledger should open on. */
    academicYearList: any[];
    /** Full report, used to fill in class/section context in sample mode. */
    report: any;
    toggle: () => void;
}

const PAGE_SIZE = 10;

export default function StudentDuesModal({ cell, scope, academicYearList, report, toggle }: IStudentDuesModal) {
    const dispatch = useAppDispatch();
    const history = useHistory();
    const [searchString, setSearchString] = useState("");
    const [samplePageNo, setSamplePageNo] = useState(0);
    const pagination = useRef({ pageNo: 0, pageSize: PAGE_SIZE });

    const {
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        classWiseFeeSummaryStudentsResp,
    }: any = useAppSelector(
        ({ appData, feeReport }) => ({
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            classWiseFeeSummaryStudentsResp: feeReport.classWiseFeeSummaryStudentsResp,
        }),
        shallowEqual
    );

    const fetchStudents = (overrides?: any) => {
        if (!cell) return;
        dispatch(getClassWiseFeeSummaryStudentsAct(generateActionPayload("get_class_wise_fee_summary_students", undefined, {
            ...serializeFilters({ instituteId, branchId, ...scope }),
            classId: cell.classId ?? "",
            sectionId: cell.sectionId ?? "",
            // No year means the row's Grand Total was clicked: every year in scope.
            dueAcademicYearName: cell.year || "",
            searchString,
            ...pagination.current,
            ...overrides,
        })));
    };

    useEffect(() => {
        pagination.current = { pageNo: 0, pageSize: PAGE_SIZE };
        setSearchString("");
        setSamplePageNo(0);
        fetchStudents({ searchString: "" });
        return () => { dispatch(resetClassWiseFeeSummaryStudentsAct(undefined)); };
    }, [cell]);

    const apiRows = Array.isArray(classWiseFeeSummaryStudentsResp?.content)
        ? classWiseFeeSummaryStudentsResp.content
        : Array.isArray(classWiseFeeSummaryStudentsResp?.data)
            ? classWiseFeeSummaryStudentsResp.data
            : [];
    const useSample = USE_SAMPLE_CLASS_WISE_FEE_SUMMARY && apiRows.length === 0;

    const sampleRows = useMemo(() => buildSampleCellStudents(cell, report), [cell, report]);

    /** In sample mode there is no backend to search or page, so both are applied here. */
    const sampleFiltered = useMemo(() => {
        const term = searchString.trim().toLowerCase();
        if (!term) return sampleRows;
        return sampleRows.filter((student: any) =>
            `${student.studentName} ${student.studentCode}`.toLowerCase().includes(term));
    }, [sampleRows, searchString]);

    const rows = useSample ? sampleFiltered.slice(samplePageNo * PAGE_SIZE, (samplePageNo + 1) * PAGE_SIZE) : apiRows;
    const totalRecords = useSample ? sampleFiltered.length : (classWiseFeeSummaryStudentsResp?.totalElements || 0);
    const totalPages = useSample
        ? Math.ceil(sampleFiltered.length / PAGE_SIZE)
        : (classWiseFeeSummaryStudentsResp?.totalPages || 0);
    const currentPageNumber = useSample ? samplePageNo : (classWiseFeeSummaryStudentsResp?.pageble?.pageNumber || 0);

    /** Totals cover every student behind the cell, not just the page on screen. */
    const totals = useMemo(() => {
        const source = useSample ? sampleFiltered : apiRows;
        return source.reduce((acc: any, student: any) => ({
            academic: acc.academic + (Number(student?.academicFeeDue) || 0),
            transport: acc.transport + (Number(student?.transportFeeDue) || 0),
            total: acc.total + (Number(student?.totalDue) || ((Number(student?.academicFeeDue) || 0) + (Number(student?.transportFeeDue) || 0))),
        }), { academic: 0, transport: 0, total: 0 });
    }, [useSample, sampleFiltered, apiRows]);

    const searchHandler = (event: any) => {
        const { value } = event.target;
        setSearchString(value);
        if (useSample) {
            setSamplePageNo(0);
            return;
        }
        pagination.current = { ...pagination.current, pageNo: 0 };
        fetchStudents({ searchString: value });
    };

    const paginationHndlr = (paginationInfo: IPaginationState) => {
        if (useSample) {
            setSamplePageNo(paginationInfo.pageNo);
            return;
        }
        pagination.current = paginationInfo;
        fetchStudents();
    };

    /** The ledger opens on the year the due belongs to; otherwise on the earliest year in scope. */
    const ledgerYearId = useMemo(() => {
        const list = Array.isArray(academicYearList) ? academicYearList : [];
        const forCellYear = cell?.year && list.find((year: any) => year?.academicYearName === cell.year)?.academicYearId;
        if (forCellYear) return forCellYear;
        const selected = Array.isArray(scope?.academicYearIds) ? scope.academicYearIds : [];
        return [...selected]
            .sort((a: any, b: any) => String(a?.academicYearName).localeCompare(String(b?.academicYearName)))[0]?.academicYearId;
    }, [academicYearList, cell, scope]);

    const viewLedger = (student: any) => {
        history.push("/student-fee-ledger/fee-details", {
            academicYearId: ledgerYearId,
            curriculumId: scope?.curriculumId,
            classId: student?.classId ?? cell?.classId,
            studentId: student?.studentId,
        });
    };

    const columns = useMemo(() => [
        {
            Header: "Student Name",
            accessor: "studentName",
            disableSortBy: true,
            columnClassName: "w-250px min-w-250px",
            Cell: ({ row: { original } }: any) => (
                <UserDetails
                    displayName={original?.studentName}
                    displayId={original?.studentCode}
                    showAvatar={false}
                />
            ),
        },
        {
            Header: "Class",
            accessor: "className",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => (
                <span className="tw-text-nowrap">
                    {original?.className || "-"}{original?.sectionName ? ` - ${original.sectionName}` : ""}
                </span>
            ),
        },
        {
            Header: "Status",
            accessor: "studentStatus",
            disableSortBy: true,
            Cell: ({ value }: any) => value
                ? <StatusLabel type={value} labelName={value === "ACTIVE" ? "Active" : "Inactive"} />
                : <span>-</span>,
        },
        {
            Header: () => <div className="tw-text-right tw-text-nowrap">Academic Fee (₹)</div>,
            accessor: "academicFeeDue",
            disableSortBy: true,
            columnClassName: "tw-text-right min-w-[140px]",
            Cell: ({ value }: any) => Number(value)
                ? <span className="tw-block tw-text-right tw-text-nowrap">{formatAmount(value)}</span>
                : <span className="tw-block tw-text-right tw-text-gray-300">–</span>,
        },
        {
            Header: () => <div className="tw-text-right tw-text-nowrap">Transport Fee (₹)</div>,
            accessor: "transportFeeDue",
            disableSortBy: true,
            columnClassName: "tw-text-right min-w-[140px]",
            Cell: ({ value }: any) => Number(value)
                ? <span className="tw-block tw-text-right tw-text-nowrap">{formatAmount(value)}</span>
                : <span className="tw-block tw-text-right tw-text-gray-300">–</span>,
        },
        {
            Header: () => <div className="tw-text-right tw-text-nowrap">Total Due (₹)</div>,
            accessor: "totalDue",
            disableSortBy: true,
            columnClassName: "tw-text-right min-w-[140px]",
            Cell: ({ row: { original } }: any) => {
                const total = Number(original?.totalDue)
                    || ((Number(original?.academicFeeDue) || 0) + (Number(original?.transportFeeDue) || 0));
                return <span className="tw-block tw-text-right tw-text-nowrap tw-font-semibold tw-text-gray-900">{formatAmount(total)}</span>;
            },
        },
        {
            Header: "Action",
            accessor: "studentId",
            disableSortBy: true,
            columnClassName: "tw-text-center",
            Cell: ({ row: { original } }: any) => (
                <div className="tw-flex tw-justify-center">
                    <Button type="button" variant="secondary" onClick={() => viewLedger(original)} className="!tw-px-3 !tw-py-1">
                        View
                    </Button>
                </div>
            ),
        },
    ], [scope, cell, ledgerYearId]);

    return (
        <div className="tw-w-full">
            <div className="tw-px-4 tw-pt-4 tw-flex tw-flex-wrap tw-items-end tw-justify-between tw-gap-3">
                <div>
                    <p className="tw-text-sm tw-font-medium tw-text-gray-800 tw-mb-1">
                        ₹ {formatAmount(cell?.amount)} outstanding
                        <span className="tw-text-gray-500 tw-font-normal"> · {totalRecords} student{totalRecords === 1 ? "" : "s"}</span>
                    </p>
                    <p className="tw-text-xs tw-text-gray-500 tw-mb-0">
                        Academic ₹ {formatAmount(totals.academic)} · Transport ₹ {formatAmount(totals.transport)} ·
                        {" "}Total ₹ {formatAmount(totals.total)}
                    </p>
                </div>
                <div className="tw-w-full sm:tw-w-[260px]">
                    <div className="search-box">
                        <TextInput
                            name="searchString"
                            value={searchString}
                            onChange={searchHandler}
                            inputClassName="tw-bg-gray-100"
                            formgroupClassName="tw-mb-0"
                            placeHolder="Search"
                            labelText="Student / ID"
                            floatingLabel
                        />
                        <i className="ri-search-line search-icon"></i>
                    </div>
                </div>
            </div>

            <div className="tw-px-0 tw-mt-3">
                <TableContainer
                    columns={columns}
                    data={rows}
                    divClass="tw-overflow-x-auto tw-mb-1"
                    theadClass="tw-bg-gray-100 tw-text-gray-600 tw-align-middle"
                    showPagination={true}
                    totalPages={totalPages}
                    totalRecords={totalRecords}
                    callbackPaginationHndlr={paginationHndlr}
                    currentPageNumber={currentPageNumber}
                    pageSize={PAGE_SIZE}
                />
            </div>

            <div className="tw-px-4 tw-py-3 tw-flex tw-justify-end">
                <Button type="button" variant="secondary" onClick={toggle}>Close</Button>
            </div>
        </div>
    );
}
