import React, { useState } from "react";
import { DateInput } from "../../../Components/Common";
import { useAppSelector } from "../../../hooks/storehook";
import { useDispatch } from "react-redux";
import { generateActionPayload } from "../../../utility/reduxutility";
import { saveTriggerAttendanceAct } from "../../../store/StudentAttendance/DailyAttendance/dailyattendanceaction";
import { useFormik } from "formik";
import * as Yup from 'yup';
import Button from "../../../Components/Common/Button";

const initialValues = {
    date: "",
};

const validationSchema = Yup.object().shape({
    date: Yup.string().required('Please select a date'),
});

const TrackAttendanceModal: React.FC<any> = (props) => {
    const dispatch = useDispatch();

    const { currentBranchIdResp: branchId, showApiLoader } = useAppSelector(
        ({ appData, globalData }) => ({
            currentBranchIdResp: appData.currentBranchIdResp,
            showApiLoader: globalData.showApiLoader,
        })
    );

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        onSubmit: (values) => {
            const payload = {
                branchId: branchId,
                date: values.date
            };
            dispatch(saveTriggerAttendanceAct(generateActionPayload("save_trigger_attendance", payload, undefined)));
        },
    });

    return (
        <>
            <div className="tw-px-4 tw-py-4">
                <div className="tw-w-full">
                    <div className="tw-border tw-border-blue-500 tw-rounded-lg tw-shadow-sm tw-bg-white tw-m-0">

                        {/* Header */}
                        <div className="tw-bg-blue-500 tw-text-white tw-px-4 tw-py-3 tw-rounded-t-lg">
                            <h5 className="tw-mb-0 tw-text-white tw-text-lg tw-font-semibold">
                                Select Date for Triggering Month Attendance
                            </h5>
                        </div>

                        {/* Body */}
                        <div className="tw-p-4">
                            <div className="tw-flex tw-justify-center tw-items-center">
                                <div className="tw-w-full">
                                    <DateInput
                                        name="date"
                                        value={formik.values.date}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        formgroupClassName="tw-mb-0"
                                        labelClass="required"
                                        labelText="Attendance Date"
                                        invalid={formik.touched.date && formik.errors.date ? true : false}
                                        error={formik.touched.date && formik.errors.date ? formik.errors.date : ""}
                                    />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="tw-flex tw-gap-2 tw-justify-end tw-mt-4 tw-mx-4 tw-mb-3">

                    <Button
                        type="button"
                        variant="secondary"
                        onClick={props.toggle}
                    >
                        Cancel
                    </Button>

                    <Button
                        type="button"
                        variant="primary"
                        disabled={showApiLoader}
                        onClick={() => formik.handleSubmit()}
                    >
                        <i className="ri-search-line tw-mr-2"></i>
                        Trigger Attendance
                    </Button>

                </div>
            </div>

        </>
    );
};

export default TrackAttendanceModal;