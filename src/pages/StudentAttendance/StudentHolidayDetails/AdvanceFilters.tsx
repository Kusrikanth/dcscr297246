import { useFormik } from "formik";
import React, { useState } from "react";
import { DateInput } from "../../../Components/Common";
import * as Yup from "yup";
import { getDdMmYyyyFormat, isGreaterThanCompareDate, isSmallerThanCompareDate } from "../../../utility/dateutility";
import Button from "../../../Components/Common/Button";
// const initialValues = {
//     minDate: "",
//     maxDate: "",
//     startDate: "",
//     endDate: ""
// };

const validationSchema = Yup.object().shape({
    minDate: Yup.string(),
    maxDate: Yup.string(),
    startDate: Yup.string().required("Startdate is required.")
        .test("fromDateValidation", "Startdate should be smaller or equal to endDate.",
            (value: any, schema: any) => {
                const { minDate, maxDate, endDate } = schema.parent;
                if (isSmallerThanCompareDate(value, minDate)) {
                    return schema.createError({ message: `Start date should be greater than or equal to start date of academic year i.e.${getDdMmYyyyFormat(minDate)}.` });
                } else if (isGreaterThanCompareDate(value, maxDate)) {
                    return schema.createError({ message: `Start date should be smaller than or equal to end date of academic year i.e.${getDdMmYyyyFormat(maxDate)}.` });
                }
                return isSmallerThanCompareDate(value, endDate);
            }),
    endDate: Yup.string().required("Enddate is required.")
        .test("toDateValidation", "Enddate should be greater than or equal to startdate.",
            (value: any, schema: any) => {
                const { minDate, maxDate, toDate } = schema.parent;
                if (isSmallerThanCompareDate(value, minDate)) {
                    return schema.createError({ message: `End date should be greater than or equal to start date of academic year i.e.${getDdMmYyyyFormat(minDate)}.` });
                } else if (isGreaterThanCompareDate(value, maxDate)) {
                    return schema.createError({ message: `End date should be smaller than or equal to end date of academic year i.e.${getDdMmYyyyFormat(maxDate)}.` });
                }
                return isGreaterThanCompareDate(value, toDate)
            }),
});

export default function AdvanceFilter({ appliedFilters, showApiLoader, applyFilterCallback, toggleModal }: any) {
    const holidayDetailsForm = useFormik({
        initialValues: appliedFilters,
        validationSchema,
        onSubmit: (values) => {
            applyFilterCallback(values);
        },
    });

    return (
        <form onSubmit={holidayDetailsForm.handleSubmit} style={{ flexGrow: 1 }} noValidate>
            <div className="tw-flex tw-flex-col tw-h-full">
                {/* Body */}
                <div className="tw-flex-1 tw-p-4">
                    <DateInput
                        name="startDate"
                        labelClass="required"
                        labelText="Start Date"
                        minDate={holidayDetailsForm.values.minDate}
                        maxDate={holidayDetailsForm.values.maxDate}
                        value={holidayDetailsForm.values.startDate}
                        onChange={holidayDetailsForm.handleChange}
                        invalid={(holidayDetailsForm.touched.startDate && holidayDetailsForm.errors.startDate) ? true : false}
                        error={(holidayDetailsForm.touched.startDate && holidayDetailsForm.errors.startDate) ? holidayDetailsForm.errors.startDate : ""}
                    />

                    <DateInput
                        name="endDate"
                        labelClass="required"
                        labelText="End Date"
                        minDate={holidayDetailsForm.values.minDate}
                        maxDate={holidayDetailsForm.values.maxDate}
                        value={holidayDetailsForm.values.endDate}
                        onChange={holidayDetailsForm.handleChange}
                        invalid={(holidayDetailsForm.touched.endDate && holidayDetailsForm.errors.endDate) ? true : false}
                        error={(holidayDetailsForm.touched.endDate && holidayDetailsForm.errors.endDate) ? holidayDetailsForm.errors.endDate : ""}

                    />
                </div>

                {/* Footer */}
                <div className="tw-border-t tw-p-3">
                    <div className="tw-flex tw-justify-end tw-gap-2">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={toggleModal}
                            disabled={showApiLoader}
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            variant="primary"
                            className="btn btn-success"
                            disabled={showApiLoader}
                        >
                            Submit
                        </Button>
                    </div>
                </div>
            </div>
        </form>
    )
}