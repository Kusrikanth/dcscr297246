import React, { useEffect } from 'react'
import { useFormik } from 'formik'
import { SelectInput, Switch } from '../../../../../../Components/Common'

const notificationsData = [
    {
        id: "addedToExam",
        title: "Added to exam",
        description: "Notify students when they are added to the exam",
    },
    {
        id: "changedExamDate",
        title: "Changed exam date",
        description: "Notify students when exam date changes",
    },
    {
        id: "examStarting",
        title: "Exam starting",
        description: "Notify students 30 minutes before exam starts",
    },
    {
        id: "examEnding",
        title: "Exam ending",
        description: "Notify students if they haven't enter and the exam is ending",
    },
    {
        id: "examOngoing",
        title: "Exam ongoing",
        description: "Notify students who haven't entered that the exam is ongoing",
    },
    {
        id: "missedExam",
        title: "Missed exam",
        description: "Notify students when they miss the exam after it is finished",
    },
    {
        id: "examResultsReady",
        title: "Exam results ready",
        description: "Notify students when results are ready",
    },
    {
        id: "preExamReminder",
        title: "Pre-exam reminder",
        description: "Notify students before the exam starts with date specified by the teacher",
        hasTimeSelect: true,
    }
]

const daysTypes = [
    { id: "2dyas", shortName: "Before 2 days" },
    { id: "4days", shortName: "Before 4 days" },
    { id: "week", shortName: "Before a Week" },
]

const Notifcations = ({ settingsFormik }) => {

    return (
        <>
            {notificationsData.map((item, index) => (
                <div
                    className='card-body border-bottom pb-3 lms_form_switch'
                    key={item.id}
                    style={{
                        backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#F9FAFB',
                        borderTopLeftRadius: index === 0 ? '10px' : '0',
                        borderTopRightRadius: index === 0 ? '10px' : '0',
                        borderBottomLeftRadius: index === notificationsData.length - 1 ? '10px' : '0',
                        borderBottomRightRadius: index === notificationsData.length - 1 ? '10px' : '0',
                    }}
                >
                    <div className='row align-items-center'>
                        <div className='col-7 d-grid'>
                            <span className='fw-medium'>{item.title}</span>
                            <span className='text-muted'>{item.description}</span>
                        </div>
                        {item.hasTimeSelect && settingsFormik.values.preExamReminder ? (
                            <div className='col-2'>
                                <SelectInput
                                    name="nofDays"
                                    value={settingsFormik.values.nofDays}
                                    onChange={settingsFormik.handleChange}
                                    menuItems={daysTypes}
                                    valueKey="id"
                                    textKey="shortName"
                                    formgroupClassName="mb-0 d-flex align-items-center input-field"
                                />
                            </div>
                        ) : (
                            <div className='col-2'></div>
                        )}
                        <div className='col-3 d-flex justify-content-center'>
                            <Switch
                                attributeId={item.id}
                                labelName=""
                                checked={settingsFormik.values[item.id]}
                                onChangeHndlr={settingsFormik.handleChange}
                                className="form-switch-sm mb-0 pt-2 pb-2"
                            />
                        </div>
                    </div>
                </div>
            ))}
        </>
    )
}

export default Notifcations;
