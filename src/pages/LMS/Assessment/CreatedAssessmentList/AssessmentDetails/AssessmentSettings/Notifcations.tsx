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

const Notifcations = (props: any) => {

    const { data } = props

    const getNotificationValue = (notificationId: string) => {
        if (!data) return "No"
        
        switch (notificationId) {
            case "addedToExam":
                return data?.addedToExam ? "Yes" : "No"
            case "changedExamDate":
                return data?.changedExamDate ? "Yes" : "No"
            case "examStarting":
                return data?.examStarting ? "Yes" : "No"
            case "examEnding":
                return data?.examEnding ? "Yes" : "No"
            case "examOngoing":
                return data?.examOngoing ? "Yes" : "No"
            case "missedExam":
                return data?.missedExam ? "Yes" : "No"
            case "examResultsReady":
                return data?.examResultsReady ? "Yes" : "No"
            case "preExamReminder":
                if (data?.preExamReminder) {
                    return `Yes (${data?.preExamReminderHours} hours)`
                }
                return "No"
            default:
                return "No"
        }
    }

    return (
        <>
        <div className='border '>
            {notificationsData?.map((item) => (
                <div className='card-body border-bottom' key={item?.id}>
                    <div className='row align-items-center'>
                        <div className='col-7 d-grid'>
                            <span className='fs-12 fw-bold'>{item?.title}</span>
                            <span className='fs-12 text-muted'>{item?.description}</span>
                        </div>
                        <div className='col-5 text-end'>
                            <span className={`badge ${getNotificationValue(item?.id) === "Yes" ? "bg-success" : "bg-secondary"}`}>
                                {getNotificationValue(item?.id)}
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
        </>
    )
}

export default Notifcations;
