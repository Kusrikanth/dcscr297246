import type { BusinessUnitConfig } from "../../businessunitconfig";
import type { BusinessUnitOption } from "../../helper";

interface DatabaseTablesProps {
    tables: BusinessUnitConfig["databaseTables"];
    unit?: BusinessUnitOption;
}

const DatabaseTables = ({ tables, unit }: DatabaseTablesProps) => (
    <div className="tw-card">
        <div className="tw-card-body">
            <div className="tw-flex tw-flex-wrap tw-items-start tw-justify-between tw-gap-2">
                <div className="tw-min-w-0">
                    <p className="tw-mb-0 tw-text-base tw-font-semibold tw-text-gray-800">
                        Database tables for {unit?.name || "this business unit"}
                    </p>
                    <p className="tw-mb-0 tw-text-sm tw-text-gray-500">
                        Read-only preview of the tables holding records scoped to
                        this business unit. Showing the top 5 rows per table.
                    </p>
                </div>

                <span className="badge badge-soft-secondary tw-whitespace-nowrap">
                    {tables.length} table{tables.length === 1 ? "" : "s"}
                </span>
            </div>

            <div className="tw-mt-3 tw-flex tw-flex-col tw-gap-3">
                {tables.map(table => (
                    <div
                        key={table.tableName}
                        className="tw-rounded tw-border tw-border-gray-200"
                    >
                        <div className="tw-flex tw-flex-wrap tw-items-center tw-justify-between tw-gap-2 tw-border-b tw-border-gray-200 tw-px-3 tw-py-2">
                            <p className="tw-mb-0 tw-text-sm tw-font-medium tw-text-gray-800">
                                {table.tableName}
                            </p>
                            <p className="tw-mb-0 tw-text-xs tw-text-gray-500">
                                {table.rowCount.toLocaleString("en-IN")} row
                                {table.rowCount === 1 ? "" : "s"} for this business
                                unit
                            </p>
                        </div>

                        <div className="tw-overflow-x-auto">
                            <table className="table table-sm tw-mb-0">
                                <thead>
                                    <tr>
                                        {table.columns.map(column => (
                                            <th
                                                key={column}
                                                className="tw-whitespace-nowrap tw-text-xs"
                                            >
                                                {column}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>

                                <tbody>
                                    {table.rows.length ? (
                                        table.rows.map(row => (
                                            <tr key={table.columns.map(column => row[column]).join("-")}>
                                                {table.columns.map(column => (
                                                    <td
                                                        key={column}
                                                        title={row[column]}
                                                        className="tw-whitespace-nowrap tw-text-xs tw-text-gray-600"
                                                    >
                                                        {row[column]}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={Math.max(
                                                    1,
                                                    table.columns.length,
                                                )}
                                                className="tw-text-center tw-text-xs tw-text-gray-500"
                                            >
                                                No rows for this business unit
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))}

                {!tables.length && (
                    <div className="tw-rounded tw-border tw-border-dashed tw-border-gray-200 tw-py-6 tw-text-center">
                        <i className="ri-database-2-line tw-text-3xl tw-text-gray-300"></i>
                        <p className="tw-mb-0 tw-mt-2 tw-text-sm tw-font-medium tw-text-gray-700">
                            No scoped tables found
                        </p>
                        <p className="tw-mb-0 tw-text-xs tw-text-gray-500">
                            No table carrying a business unit column was found.
                        </p>
                    </div>
                )}
            </div>
        </div>
    </div>
);

export default DatabaseTables;
