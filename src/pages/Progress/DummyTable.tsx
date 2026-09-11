import React, { useEffect } from "react";
import {
    useTable,
    useGlobalFilter,
    useAsyncDebounce,
    useSortBy,
    useFilters,
    useExpanded,
    usePagination,
    useRowSelect
} from "react-table";
import { UseSortByOptions } from "react-table";
import { Table } from "reactstrap";
import classnames from "classnames";
import NoDataComp from "../../Components/Common/NoDataComp";

// Define a default UI for filtering
interface ITableContainer {
    columns: Array<any>;
    data: Array<any>;
    tableClass?: string;
    theadClass?: string;
    trClass?: string;
    thClass?: string;
    tdClass?: string;
    divClass?: string;
    showCheckbox?: boolean;
    isLoading?: boolean;
    //pagination props
    showPagination?: boolean;
    forcePage?: number | undefined;
    paginationContainerClass?: string;
    callbackPaginationHndlr?: any;
    totalPages?: number;
    totalRecords?: number;
    currentPageNumber?: number;
    sortHndlr?: any;
}

const TableContainer = ({
    columns,
    data,
    tableClass,
    theadClass,
    trClass,
    thClass,
    divClass,
    showPagination = false,
    showCheckbox = false,
    sortHndlr,
    isLoading = false,
    ...paginationProps
}: ITableContainer) => {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        sortTypes, manualSortBy,
        state: { sortBy }
    } = useTable({
        columns,
        data,
        // initialState: {
        //     sortBy: [{ id: "id", desc: true }]
        // },
        manualSortBy: true,
        disableSortRemove: true,
        disableMultiSort: true
        // orderByFn: sortHndlr
    }, useSortBy, usePagination, useRowSelect,)

    const generateSortingIndicator = (column: any) => {
        return column.isSorted ? (column.isSortedDesc ? "" : "") : "";
    }

    useEffect(() => {
    }, [sortBy]);



    return (
        <React.Fragment>
            <div className={divClass}>
                <Table hover {...getTableProps()}
                    className={classnames(
                        "align-middle", tableClass
                    )}
                >
                    <thead className={theadClass}>
                        {headerGroups.map((headerGroup: any) => (
                            <tr className={trClass} key={headerGroup.id}  {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map((column: any) => {
                                    return (<th key={column.id}
                                        // className="sort"
                                        className={classnames("table_header_style text-nowrap", column.thClass, thClass,
                                            {
                                                "sort": !column.disableSortBy,
                                                "sorting-asc": column.isSorted && !column.isSortedDesc,
                                                "sorting-desc": column.isSorted && column.isSortedDesc
                                            })}
                                        // className={` ${column.thClass ? column.thClass : thClass
                                        //     }`}
                                        // // onClick={sortHndlr}
                                        // className={`${column.thClass ? column.thClass : thClass}`}{...column.getHeaderProps()}
                                        // {...column.getSortByToggleProps()}
                                        {...column.getHeaderProps(column.getSortByToggleProps({ title: undefined }))}
                                    >
                                        {column.render("Header")}
                                        {generateSortingIndicator(column)}
                                        {/* <Filter column={column} /> */}
                                    </th>

                                    )
                                })}
                            </tr>
                        ))}
                    </thead>

                    <tbody {...getTableBodyProps()}>
                        {(rows.length > 0) ? rows.map((row: any) => {
                            prepareRow(row);
                            return (
                                <React.Fragment key={row.getRowProps().key}>
                                    <tr>
                                        {row.cells.map((cell: any) => {
                                            return (
                                                <td key={cell.id} {...cell.getCellProps()}>
                                                    {cell.render("Cell")}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                </React.Fragment>
                            );
                        }) :
                            <tr>
                                <td className="no_hover" colSpan={columns.length}>
                                    <NoDataComp />
                                </td>
                            </tr>
                        }
                    </tbody>
                </Table>
                {isLoading && <div className="position-absolute top-0 bottom-0 right-0 left-0 w-100 d-flex justify-content-center
                align-items-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>}
            </div>
        </React.Fragment >
    );
};

export default TableContainer;
