import { type ChangeEvent, type MouseEvent } from "react";

import {
    MultiSelectCheckbox,
    SelectInput,
} from "../../../Components/Common";
import { CustomDatePicker } from "../../DashBoardBranchSummary/CustomDatePicker";
import {
    dashboardDateFieldOptions,
    type DashboardFilterState,
    type DashboardOption,
} from "./helper";

interface DashboardFiltersProps {
    filters: DashboardFilterState;
    options: {
        branches: DashboardOption[];
        owners: DashboardOption[];
        stages: DashboardOption[];
        substages: DashboardOption[];
        channels: DashboardOption[];
        sources: DashboardOption[];
        campaigns: DashboardOption[];
    };
    onMultiChange: (
        key: keyof DashboardFilterState,
        values: string[],
    ) => void;
    onDateFieldChange: (
        event: ChangeEvent<HTMLSelectElement>,
    ) => void;
    onDateRangeChange: (dates: {
        startDate: string;
        endDate: string;
    }) => void;
}

const renderValue = (
    selectedItems: DashboardOption[],
    removeItemHandler: (
        event: MouseEvent<HTMLElement>,
    ) => void,
) => (
    <div className="tw-flex tw-flex-wrap tw-gap-1">
        {selectedItems.map(item => (
            <span
                key={item.id}
                className="badge badge-soft-primary tw-flex tw-items-center tw-gap-1"
            >
                {item.name}
                <i
                    data-id={item.id}
                    className="ri-close-line tw-cursor-pointer"
                    onClick={removeItemHandler}
                ></i>
            </span>
        ))}
    </div>
);

const renderOption = (item: DashboardOption) => (
    <span>{item.name}</span>
);

const filterFields: Array<{
    key: keyof DashboardFilterState;
    labelText: string;
    optionKey: keyof DashboardFiltersProps["options"];
}> = [
        {
            key: "branches",
            labelText: "Branch",
            optionKey: "branches",
        },
        {
            key: "owners",
            labelText: "Lead Owner",
            optionKey: "owners",
        },
        {
            key: "stages",
            labelText: "Stage",
            optionKey: "stages",
        },
        {
            key: "substages",
            labelText: "Sub-stage",
            optionKey: "substages",
        },
        {
            key: "channels",
            labelText: "Channel",
            optionKey: "channels",
        },
        {
            key: "sources",
            labelText: "Source",
            optionKey: "sources",
        },
        {
            key: "campaigns",
            labelText: "Campaign",
            optionKey: "campaigns",
        },
    ];

const DashboardFilters = ({
    filters,
    options,
    onMultiChange,
    onDateFieldChange,
    onDateRangeChange,
}: DashboardFiltersProps) => (
    <div className="tw-border-b tw-border-gray-200 tw-p-3">
        <div className="row tw-items-end tw-gap-y-3">
            {filterFields.map(field => {
                const list = options[field.optionKey];
                const selected = filters[
                    field.key
                ] as string[];

                return (
                    <div
                        key={field.key}
                        className="col-12 col-md-6 col-xl-3"
                    >
                        <MultiSelectCheckbox
                            name={field.key}
                            idKey="id"
                            searchKey="name"
                            labelText={field.labelText}
                            value={list.filter(item =>
                                selected.includes(item.id),
                            )}
                            options={list}
                            renderValue={renderValue}
                            renderOptions={renderOption}
                            onChange={(
                                items: DashboardOption[],
                            ) =>
                                onMultiChange(
                                    field.key,
                                    items.map(item => item.id),
                                )
                            }
                            containerClassName="tw-mb-0"
                            floatingLabel
                        />
                    </div>
                );
            })}

            <div className="col-12 col-md-6 col-xl-3">
                <SelectInput
                    name="dateField"
                    labelText="Date field"
                    value={filters.dateField}
                    onChange={onDateFieldChange}
                    menuItems={dashboardDateFieldOptions}
                    valueKey="id"
                    textKey="name"
                    hideSelectOption
                    formgroupClassName="tw-mb-0"
                    floatingLabel
                />
            </div>

            <div className="col-12 col-md-6 col-xl-3">
                <CustomDatePicker
                    name="dashboardDateRange"
                    labelText="Date Range"
                    startDate={filters.dateFrom}
                    endDate={filters.dateTo}
                    onChange={onDateRangeChange}
                    placeholder="Select date range"
                    monthsShown={2}
                    formgroupClassName="tw-mb-0"
                    portalId="crm-dashboard-date-filter"
                    floatingLabel
                />
                <div id="crm-dashboard-date-filter"></div>
            </div>
        </div>
    </div>
);

export default DashboardFilters;
