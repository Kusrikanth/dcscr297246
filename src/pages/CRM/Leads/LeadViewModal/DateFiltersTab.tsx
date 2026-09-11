import { useFormik } from "formik";

import { CustomDatePicker } from "../../../DashBoardBranchSummary/CustomDatePicker";
import {
    type DateFiltersField,
    type DateFiltersFieldName,
    type DateFiltersState,
    type DateRangeValue,
} from "./types";

interface DateFiltersTabProps {
    value: DateFiltersState;
    onChange: (
        name: DateFiltersFieldName,
        dates: DateRangeValue,
    ) => void;
}

const dateFilterFields: DateFiltersField[] = [
    {
        id: "added",
        labelName: "Added",
        placeholder: "Select added date range",
    },
    {
        id: "updated",
        labelName: "Updated",
        placeholder: "Select updated date range",
    },
    {
        id: "referred",
        labelName: "Referred",
        placeholder: "Select referred date range",
    },
    {
        id: "nextFollowUp",
        labelName: "Next follow up",
        placeholder: "Select next follow up date range",
    },
    {
        id: "reEnquired",
        labelName: "Re Enquired",
        placeholder: "Select re-enquired date range",
    },
];

const DateFiltersTab = ({
    value,
    onChange,
}: DateFiltersTabProps) => {
    const formik = useFormik<DateFiltersState>({
        enableReinitialize: true,
        initialValues: value,
        onSubmit: () => { },
    });

    const dateChangeHandler = (
        name: DateFiltersFieldName,
        dates: DateRangeValue,
    ) => {
        formik.setFieldValue(name, dates);
        onChange(name, dates);
    };

    return (
        <div className="tw-grid tw-grid-cols-1 tw-gap-x-8 tw-gap-y-4 xl:tw-grid-cols-2 tw-mt-6">
            {dateFilterFields.map(field => {
                const portalId = `lead-view-${field.id}-date-filter`;

                return (
                    <div
                        key={field.id}
                        className="tw-mb-4"
                    >
                        <CustomDatePicker
                            name={field.id}
                            labelText={field.labelName}
                            startDate={
                                formik.values[field.id]
                                    .startDate
                            }
                            endDate={
                                formik.values[field.id]
                                    .endDate
                            }
                            onChange={(
                                dates: DateRangeValue,
                            ) =>
                                dateChangeHandler(
                                    field.id,
                                    dates,
                                )
                            }
                            placeholder={field.placeholder}
                            monthsShown={2}
                            formgroupClassName="tw-mb-0"
                            portalId={portalId}
                            floatingLabel
                        />
                        <div id={portalId}></div>
                    </div>
                );
            })}
        </div>
    );
};

export default DateFiltersTab;
