import React, { useEffect } from "react";
import {
    SelectInput, TextInput, TimeInput
} from "../../../../Components/Common";
import { Col, Row } from "reactstrap";
import { useFormik } from "formik";
import DefaultUserImg from "../../../../assets/imagesdps/default-user.png";
// Formik validation
import * as Yup from "yup";

import { scheduleModeOptions } from "./helper";
import Button from "../../../../Components/Common/Button";

function getTrueFalseOptions(fieldValue: any) {
    if (typeof fieldValue === "string") {
        return fieldValue === "YES";
    }
    return false;
}


function getYesNoOption(fieldValue: any) {
    if (typeof fieldValue === "boolean") {
        return fieldValue ? "YES" : "NO";
    }
    return "NO";
}


function getAddEditScheduleInterviewState(editData?: any): any {
    return {
        scheduleMode: editData?.scheduleMode || "",
        meetingLink: editData?.meetingLink || "",
        meetingId: editData?.meetingId || "",
        meetingPassword: editData?.meetingPassword || "",
        timeSlot: editData?.timeSlot || "",
    }
}

const validationSchema = Yup.object().shape({
    scheduleMode: Yup.string().required("Schedule mode required."),
    meetingLink: Yup.string().when('scheduleMode', {
        is: (item: any) => item === "VIRTUAL",
        then: Yup.string().required('Meeting link required.')
    }),
    meetingId: Yup.string().when('scheduleMode', {
        is: (item: any) => item === "VIRTUAL",
        then: Yup.string().required('Meeting id required.')
    }),
    meetingPassword: Yup.string().when('scheduleMode', {
        is: (item: any) => item === "VIRTUAL",
        then: Yup.string().required('Meeting password required.')
    }),
    timeSlot: Yup.string().required("Timeslot required."),
});


const initialState = getAddEditScheduleInterviewState(null);
const ScheduleInterviewModal: React.FC<any> = (props) => {
    useEffect(() => {
        if (props.studentDetails) {
            const examinationFormValues = getAddEditScheduleInterviewState(props.studentDetails);
            scheduleInterviewForm.setValues(examinationFormValues);
        }
    }, [props.studentDetails]);


    const scheduleInterviewForm = useFormik({
        enableReinitialize: true,
        initialValues: initialState,
        validationSchema,
        onSubmit: (values) => {
            const { studentRegId } = props?.studentDetails || {};
            props.scheduleMeetingHndlr(studentRegId, values);
        },
    });

    function onChangeScheduleModeHndlr(event: any) {
        const { name, value } = event.target;
        scheduleInterviewForm.setValues((prevState: any) => ({
            ...prevState,
            [name]: value,
            meetingLink: "",
            meetingId: "",
            meetingPassword: "",
        }));
    }

    return (
        <>
            <form onSubmit={scheduleInterviewForm.handleSubmit}>
                <div className="tw-p-4 tw-m-3">
                    <div className="tw-flex tw-flex-wrap -tw-mx-1.5">
                        <div className="tw-w-full tw-px-1.5 tw-mb-3 tw-flex tw-flex-col tw-items-center tw-justify-center">
                            <div
                                style={{ border: "3px solid #0AB39C" }}
                                className="tw-w-12 tw-h-12 tw-flex-shrink-0 tw-rounded-full tw-mb-1 tw-overflow-hidden"
                            >
                                <img
                                    src={props?.studentDetails?.studentImgUrl || DefaultUserImg}
                                    className="tw-max-w-full tw-h-full tw-block tw-rounded-full"
                                />
                            </div>
                            <div className="tw-font-bold">{props?.studentDetails?.studentName}</div>
                        </div>
                        <div className="tw-w-full md:tw-w-1/2 tw-px-1.5">
                            <TextInput
                                name="studentRegistrationNo"
                                labelText="Registration No."
                                value={props?.studentDetails?.studentRegistrationNo}
                                onChange={undefined}
                                isDisabled={true}
                            />
                        </div>
                        <div className="tw-w-full md:tw-w-1/2 tw-px-1.5">
                            <SelectInput
                                name="scheduleMode"
                                labelText="Schedule Mode"
                                value={scheduleInterviewForm.values.scheduleMode}
                                onChange={onChangeScheduleModeHndlr}
                                menuItems={scheduleModeOptions}
                                valueKey="id"
                                textKey="name"
                                invalid={(scheduleInterviewForm.touched.scheduleMode && scheduleInterviewForm.errors.scheduleMode) ? true : false}
                                error={(scheduleInterviewForm.touched.scheduleMode && scheduleInterviewForm.errors.scheduleMode) ? scheduleInterviewForm.errors.scheduleMode : ""}
                            />
                        </div>
                        <div className="tw-w-full tw-px-1.5">
                            <TextInput
                                name="meetingLink"
                                labelText="Meeting Link"
                                value={scheduleInterviewForm.values.meetingLink}
                                onChange={scheduleInterviewForm.handleChange}
                                invalid={(scheduleInterviewForm.touched.meetingLink && scheduleInterviewForm.errors.meetingLink) ? true : false}
                                error={(scheduleInterviewForm.touched.meetingLink && scheduleInterviewForm.errors.meetingLink) ? scheduleInterviewForm.errors.meetingLink : ""}
                                isDisabled={scheduleInterviewForm.values.scheduleMode === "PHYSICAL"}
                            />
                        </div>
                        <div className="tw-w-full md:tw-w-1/2 tw-px-1.5">
                            <TextInput
                                name="meetingId"
                                labelText="Meeting Id"
                                value={scheduleInterviewForm.values.meetingId}
                                onChange={scheduleInterviewForm.handleChange}
                                invalid={(scheduleInterviewForm.touched.meetingId && scheduleInterviewForm.errors.meetingId) ? true : false}
                                error={(scheduleInterviewForm.touched.meetingId && scheduleInterviewForm.errors.meetingId) ? scheduleInterviewForm.errors.meetingId : ""}
                                isDisabled={scheduleInterviewForm.values.scheduleMode === "PHYSICAL"}
                            />
                        </div>
                        <div className="tw-w-full md:tw-w-1/2 tw-px-1.5">
                            <TextInput
                                name="meetingPassword"
                                labelText="Password"
                                value={scheduleInterviewForm.values.meetingPassword}
                                onChange={scheduleInterviewForm.handleChange}
                                invalid={(scheduleInterviewForm.touched.meetingPassword && scheduleInterviewForm.errors.meetingPassword) ? true : false}
                                error={(scheduleInterviewForm.touched.meetingPassword && scheduleInterviewForm.errors.meetingPassword) ? scheduleInterviewForm.errors.meetingPassword : ""}
                                isDisabled={scheduleInterviewForm.values.scheduleMode === "PHYSICAL"}
                            />
                        </div>
                        <div className="tw-w-full md:tw-w-1/2 tw-px-1.5">
                            <TimeInput
                                name="timeSlot"
                                labelText="From time slot"
                                value={scheduleInterviewForm.values.timeSlot}
                                onChange={scheduleInterviewForm.handleChange}
                                onBlur={scheduleInterviewForm.handleBlur}
                                invalid={scheduleInterviewForm.touched.timeSlot &&
                                    scheduleInterviewForm.errors.timeSlot
                                    ? true
                                    : false}
                                error={scheduleInterviewForm.touched.timeSlot &&
                                    scheduleInterviewForm.errors.timeSlot
                                    ? scheduleInterviewForm.errors.timeSlot
                                    : ""}
                            />
                        </div>
                    </div>
                </div>
                <div className="modal-footer modal-footer-shadow">
                    <div className="tw-flex tw-gap-2 tw-justify-end">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={props.toggle}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                        >
                            Submit
                        </Button>
                    </div>
                </div>
            </form>
        </>
    );
};

export default ScheduleInterviewModal;
