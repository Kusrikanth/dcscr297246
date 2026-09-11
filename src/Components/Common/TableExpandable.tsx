import React, { useEffect, useRef } from "react";
import { useTable, useSortBy, useExpanded, useRowSelect } from "react-table";
import { Table } from "reactstrap";
import classnames from "classnames";
import Pagination from "./Pagination";
import { Checkbox } from "./Checkbox";
import NoDataComp from "./NoDataComp";
// Define a default UI for filtering
interface ITableContainer {
  columns: Array<any>;
  data: Array<any>;
  tableClass?: string;
  theadClass?: string;
  trClass?: string;
  trFooterClass?: string;
  thClass?: string;
  tdClass?: string;
  tdFooterClass?: string;
  trBodyClass?: any;
  divClass?: string;
  selectedMembers?: any;
  selectedMembersCallback?: any;
  showCheckbox?: boolean;
  isDataLoading?: boolean;
  sortingHandler?: any;
  rowDataInfo?: any;
  defaultSort?: any;
  manualSorting?: boolean;
  updateDefaultSortKeys?: any;
  selectedRowHandler?: any;
  defaultSelect?: any;
  //pagination props
  showPagination?: boolean;
  forcePage?: number | undefined;
  paginationContainerClass?: string;
  callbackPaginationHndlr?: any;
  totalPages?: number;
  totalRecords?: number;
  currentPageNumber?: number;
  onChangeInputHndlr?: any;
  showFooter?: boolean;
  onBlurInputHndlr?: any;
  renderRowSubComponent?: any;
  tfootClass?: string;
  defaultExpanded?: any;
}

const defaultSoryInfo: any = [];

const TableExpandable = ({
  columns,
  data = [],
  tableClass,
  theadClass,
  trClass,
  trFooterClass,
  tdFooterClass,
  trBodyClass,
  tdClass,
  thClass,
  divClass,
  selectedMembers,
  selectedMembersCallback,
  selectedRowHandler,
  defaultSelect: controlledSelectedRowIds,
  showPagination = false,
  showCheckbox = false,
  isDataLoading = false,
  sortingHandler,
  rowDataInfo = null,
  defaultSort = defaultSoryInfo,
  manualSorting = false,
  updateDefaultSortKeys,
  onChangeInputHndlr = undefined,
  onBlurInputHndlr = undefined,
  showFooter = false,
  tfootClass,
  renderRowSubComponent,
  defaultExpanded,
  ...paginationProps
}: ITableContainer) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    footerGroups,
    rows,
    prepareRow,
    selectedFlatRows,
    state: { sortBy, selectedRowIds, expanded },
  }: // setSortBy,
  any = useTable(
    {
      columns,
      data,
      initialState: {
        sortBy: defaultSort,
        selectedRowIds: controlledSelectedRowIds || {},
        expanded: defaultExpanded || {},
      } as any,
      // defaultSelectedRow:[],
      manualSortBy: manualSorting,
      rowDataInfo,
      selectedMembersCallback,
      selectedMembers,
      // disableSortRemove: true,
      autoResetSortBy: true,
      // @ts-ignore
      onChangeInputHndlr,
      onBlurInputHndlr,
      // disableMultiSort: true,
    },
    useSortBy,
    useExpanded,
    useRowSelect,
    (hooks) => {
      if (showCheckbox) {
        hooks.visibleColumns.push((columns) => [
          {
            id: "selection",
            thClass: "w-5",
            disableSortBy: true,
            Header: ({ getToggleAllRowsSelectedProps }: any) => (
              <Checkbox {...getToggleAllRowsSelectedProps()} />
            ),
            Cell: function StudentsItems({ row }: any) {
              return <Checkbox {...row.getToggleRowSelectedProps()} />;
            },
          },
          ...columns,
        ]);
      }
    }
  );

  const generateSortingIndicator = (column: any) => {
    return column.isSorted ? (column.isSortedDesc ? " " : "") : "";
  };

  const dynamicSortKeyRef = useRef(updateDefaultSortKeys);

  useEffect(() => {
    if (dynamicSortKeyRef.current !== updateDefaultSortKeys) {
      // setSortBy(updateDefaultSortKeys)
    }
    dynamicSortKeyRef.current = updateDefaultSortKeys;
  }, [updateDefaultSortKeys]);
  useEffect(() => {
    if (sortBy) {
      if (typeof sortingHandler === "function" && manualSorting) {
        sortingHandler(sortBy);
      }
    }
  }, [sortBy, manualSorting]);

  useEffect(() => {
    if (selectedRowHandler) {
      let arr: any = [];
      selectedFlatRows.map((row: any) => arr.push(row.original));
      if (typeof selectedRowHandler === "function") {
        selectedRowHandler(arr, selectedFlatRows);
      }
    }
  }, [selectedFlatRows]);

  const flatColumns = columns.map((column) => column.columns).flat();
  const dataColumns = flatColumns.length;

  return (
    <React.Fragment>
      <div className={classnames(divClass || "tw-mb-3")}>
        <Table
          hover
          {...getTableProps()}
          className={classnames("tw-mb-0", tableClass)}
          style={{ minHeight: "250px" }}
        >
          <thead className={theadClass}>
            {headerGroups.map((headerGroup: any) => (
              <tr
                className={trClass}
                key={headerGroup.id}
                {...headerGroup.getHeaderGroupProps()}
              >
                {headerGroup.headers.map((column: any) => {
                  return (
                    <th
                      key={column.id}
                      // className={`table_header_style text-nowrap ${column.thClass ? column.thClass : thClass
                      //   }`}
                      className={classnames(
                        "table_header_style text-nowrap",
                        column.columnClassName,
                        column.thClass,
                        thClass,
                        {
                          sort: !column.disableSortBy,
                          "sorting-asc": column.isSorted && column.isSortedDesc,
                          "sorting-desc":
                            column.isSorted && !column.isSortedDesc,
                        }
                      )}
                      // className={`${column.thClass ? column.thClass : thClass}`}
                      // {...column.getSortByToggleProps()}
                      {...column.getHeaderProps(
                        column.getSortByToggleProps({ title: undefined })
                      )}
                      rowSpan={`${column.rowSpan ?? 1}`}
                      style={column.displayNone ? { display: "none" } : {}}
                    >
                      {column.render("Header")}
                      {/* {generateSortingIndicator(column)} */}

                      {/* <Filter column={column} /> */}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>

          <tbody {...getTableBodyProps()}>
            {rows.length > 0 ? (
              rows.map((row: any) => {
                prepareRow(row);
                return (
                  <React.Fragment key={row.getRowProps().key}>
                    <tr
                      {...row.getRowProps()}
                      className={classnames(
                        trBodyClass ? trBodyClass(row) : ""
                      )}
                    >
                      {row.cells.map((cell: any) => {
                        return (
                          <td
                            key={cell.id}
                            className={classnames(
                              cell?.column?.columnClassName,
                              cell.column.tdClass,
                              tdClass
                            )}
                            {...cell.getCellProps()}
                          >
                            {cell.render("Cell")}
                          </td>
                        );
                      })}
                    </tr>
                  </React.Fragment>
                );
              })
            ) : (
              <tr>
                <td
                  className="no_hover"
                  // colSpan={showCheckbox ? columns.length + 1 : columns.length}
                  colSpan={dataColumns}
                >
                  <NoDataComp />
                </td>
              </tr>
            )}
          </tbody>

          {showFooter && rows.length > 0 && (
            <tfoot className={classnames("table_footer_style", tfootClass)}>
              {footerGroups.map((footerGroup: any) => (
                <tr
                  className={classnames(trClass, trFooterClass)}
                  key={footerGroup.id}
                  {...footerGroup.getHeaderGroupProps()}
                >
                  {footerGroup.headers.map((column: any) => {
                    return (
                      <td
                        key={column.id}
                        className={classnames(
                          "tw-text-nowrap",
                          column.footerClassName,
                          tdFooterClass
                        )}
                        {...column.getFooterProps()}
                      >
                        {column.render("Footer")}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tfoot>
          )}
        </Table>
        {isDataLoading && (
          <div
            className="tw-absolute tw-top-0 tw-bottom-0 tw-right-0 tw-left-0 tw-w-full tw-flex tw-justify-center
                tw-items-center"
          >
            <div className="spinner-border tw-text-[#405189]" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        )}
      </div>

      {showPagination && (
        <Pagination
          forcePage={paginationProps.forcePage}
          paginationContainerClass={paginationProps.paginationContainerClass}
          callbackPaginationHndlr={paginationProps.callbackPaginationHndlr}
          totalPages={paginationProps.totalPages}
          totalRecords={paginationProps.totalRecords || 0}
          currentPageNumber={paginationProps.currentPageNumber}
        />
      )}
    </React.Fragment>
  );
};

export default React.memo(TableExpandable);
