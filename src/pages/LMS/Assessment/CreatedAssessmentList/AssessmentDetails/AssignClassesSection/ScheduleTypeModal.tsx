import React, { useContext, useMemo, useState } from 'react'
import { DateInput, RadioInputContainer, TextInput, TimeInput } from '../../../../../../Components/Common'
import { useFormik } from 'formik'

const initialValues = {
    schedule: "fixed",
    startDate: "",
    startTime: "",
    graceTime: "",
    endDate: "",
    endTime: "",
}

const ScheduleTypeModal = (props: any) => {
    const scheduleOptions: Array<any> = [
        {
            id: "fixed",
            name: "Fixed",
        },
        {
            id: "flexible",
            name: "Flexible",
        }
    ]
    const questionSettingsForm = useFormik({
        initialValues,
        onSubmit: (values) => {
        },
    })

    return (
        <>
            <div className='card-body'>
                        <div className='row'>
                            <div className='col-12 col-md-6'>
                                <DateInput
                                    name="startDate"
                                    labelText="Start Date"
                                    value={questionSettingsForm.values.startDate}
                                    onChange={questionSettingsForm.handleChange}
                                />
                            </div>
                            <div className='col-12 col-md-6'>
                                <TimeInput
                                    name="startTime"
                                    labelText="Start Time"
                                    value={questionSettingsForm.values.startTime}
                                    onChange={questionSettingsForm.handleChange}
                                />
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-12 col-md-6'>
                                <DateInput
                                    name="endDate"
                                    labelText="End Date"
                                    value={questionSettingsForm.values.endDate}
                                    onChange={questionSettingsForm.handleChange}
                                />
                            </div>
                            <div className='col-12 col-md-6'>
                                <TimeInput
                                    name="endTime"
                                    labelText="End Time"
                                    value={questionSettingsForm.values.endTime}
                                    onChange={questionSettingsForm.handleChange}
                                />
                            </div>
                            <div className='col-12'>
                                <TextInput
                                    name="graceTime"
                                    labelText="Grace Period to Join (Minutes)"
                                    value={questionSettingsForm.values.graceTime}
                                    onChange={questionSettingsForm.handleChange}
                                />
                            </div>
                        </div>
                        <div className="hstack gap-2 justify-content-end mt-4 mb-1">
                <button type="button" className="btn btn-light" onClick={props.toggle}>
                    Cancel
                </button>
                <button
                    type="button"
                    className="btn btn-success"
                >
                    Submit
                </button>
            </div>
            </div>
        </>
    )
}

export default ScheduleTypeModal