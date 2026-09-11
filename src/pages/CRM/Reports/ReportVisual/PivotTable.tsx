import { Fragment } from "react";

import {
    formatReportValue,
    type PivotData,
    type PivotRow,
    type ReportDefinition,
} from "../helper";

interface PivotTableProps {
    report: Partial<ReportDefinition>;
    data: PivotData;
}

function flattenRows(rows: Array<PivotRow>): Array<PivotRow> {
    return rows.flatMap(row => [row, ...flattenRows(row.children || [])]);
}

const PivotTable = ({ report, data }: PivotTableProps) => {
    const measures = data.measures || [];
    const columnNames = data.columnNames || [];
    const flatRows = flattenRows(data.rows || []);
    const multiMeasure = measures.length > 1;
    const showRowTotals = report.showRowTotals !== false;
    const showColumnTotals = !!report.showColumnTotals;

    if (!flatRows.length) {
        return (
            <p className="tw-mb-0 tw-py-6 tw-text-center tw-text-sm tw-text-gray-500">
                No data matches these filters.
            </p>
        );
    }

    const cellValue = (row: PivotRow, measureIndex: number, columnIndex: number) =>
        row.measureCells?.[measureIndex]?.[columnIndex] ?? 0;

    const grandValue = (measureIndex: number, columnIndex: number) =>
        data.grandMeasureCells?.[measureIndex]?.[columnIndex] ?? 0;

    return (
        <div className="table-responsive">
            <table className="table table-nowrap align-middle mb-0">
                <thead className="table-light text-muted">
                    <tr>
                        <th rowSpan={multiMeasure ? 2 : 1}>
                            {(report.rows || []).length ? "Group" : "All records"}
                        </th>

                        {columnNames.map(columnName => (
                            <th
                                key={columnName}
                                colSpan={multiMeasure ? measures.length : 1}
                                className="text-center"
                            >
                                {columnName === "Value" ? measures[0]?.label : columnName}
                            </th>
                        ))}

                        {showRowTotals && (
                            <th
                                rowSpan={multiMeasure ? 2 : 1}
                                className="text-end"
                            >
                                Total
                            </th>
                        )}
                    </tr>

                    {multiMeasure && (
                        <tr>
                            {columnNames.map(columnName =>
                                measures.map(measure => (
                                    <th
                                        key={`${columnName}-${measure.field}-${measure.label}`}
                                        className="text-end tw-text-xs tw-font-normal"
                                    >
                                        {measure.label}
                                    </th>
                                ))
                            )}
                        </tr>
                    )}
                </thead>

                <tbody>
                    {flatRows.map(row => (
                        <tr key={`${row.path}-${row.level}`}>
                            <td>
                                <span style={{ paddingLeft: `${row.level * 16}px` }}>
                                    {row.level > 0 && (
                                        <i className="ri-corner-down-right-line tw-mr-1 tw-text-gray-400"></i>
                                    )}
                                    {row.label}
                                </span>
                            </td>

                            {columnNames.map((columnName, columnIndex) =>
                                measures.map((measure, measureIndex) => (
                                    <td
                                        key={`${row.path}-${columnName}-${measure.field}-${measureIndex}`}
                                        className="text-end"
                                    >
                                        {formatReportValue(
                                            cellValue(row, measureIndex, columnIndex),
                                            measure.valueFormat
                                        )}
                                    </td>
                                ))
                            )}

                            {showRowTotals && (
                                <td className="text-end fw-medium">
                                    {formatReportValue(
                                        row.measureTotals?.[0] ?? row.total,
                                        measures[0]?.valueFormat
                                    )}
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>

                {showColumnTotals && (
                    <tfoot className="table-light">
                        <tr>
                            <td className="fw-medium">Grand total</td>

                            {columnNames.map((columnName, columnIndex) =>
                                measures.map((measure, measureIndex) => (
                                    <Fragment key={`grand-${columnName}-${measure.field}-${measureIndex}`}>
                                        <td className="text-end fw-medium">
                                            {formatReportValue(
                                                grandValue(measureIndex, columnIndex),
                                                measure.valueFormat
                                            )}
                                        </td>
                                    </Fragment>
                                ))
                            )}

                            {showRowTotals && (
                                <td className="text-end fw-medium">
                                    {formatReportValue(
                                        data.grandTotals?.[0] ?? 0,
                                        measures[0]?.valueFormat
                                    )}
                                </td>
                            )}
                        </tr>
                    </tfoot>
                )}
            </table>
        </div>
    );
};

export default PivotTable;
