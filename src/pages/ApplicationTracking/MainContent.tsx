import React, { useEffect, useRef, useState } from 'react'
import "./_apptracking.scss";
import { shallowEqual } from 'react-redux';
import { useAppSelector } from '../../hooks/storehook';
import { getDdMmYyyyFormat } from '../../utility/dateutility';
import { useHistory, useParams } from 'react-router-dom';

const applicationData = [
    "EXAM SCHEDULE - ADMISSION CANCELED",
    "PANEL INTERVIEW SCHEDULE ADMISSION CANCELLED",
    "PANEL INTERVIEW RESULT ADMISSION CANCELLED",
    "ADMISSION CANCELLED",
    "REGISTRATION ADMISSION CANCELLED",
    "SCRUTINY ADMISSION CANCELLED",
    "APPLICATION SALE ADMISSION CANCELLED",
]

const MainContent = (props: { setStepper: (stepper: string) => void }) => {

    const [processList, setProcessList] = useState([]);
    const urlParams:any = useParams()
    const history = useHistory()

    const {
        getStuAppTrackerListResp,
    } = useAppSelector(
        ({  admissionAvailabilityRequest }) => ({
            getStuAppTrackerListResp: admissionAvailabilityRequest.getStuAppTrackerListResp,
        }),
        shallowEqual
    );

    useEffect(() => {

        if (getStuAppTrackerListResp) {
            const { admissionTrackerReport, admissionProcesses: totalProcess } = getStuAppTrackerListResp || {};
            const { admissionProcess: currentProcess } = admissionTrackerReport || {};
            let processCompleted = false
            const newList = totalProcess?.map((item: any) => {
                if (item?.processCodes?.includes(currentProcess)) {
                    processCompleted = true
                    if (item?.processFinalCodes?.includes(currentProcess)) {
                        return { ...item, status: "completed" }
                    } else {
                        return { ...item, status: "pending" }
                    }
                } else {
                    if (processCompleted) {
                        return { ...item }
                    } else {
                        return { ...item, status: "completed" }
                    }
                }
            })
            setProcessList(newList)
        }

    }, [getStuAppTrackerListResp])

    const previousStepper = () => {
     props.setStepper("verification")
     if(urlParams?.applicationo){
        history.replace(`/application-tracking`)
     }
    }

    return (
        <>
            <main className="main-content-tracking">
                <div>
                    <span className="tw-text-xl tw-font-semibold">
                        Application Number : {getStuAppTrackerListResp?.applicationSale?.saleFormDetails?.applicationNumber}
                    </span>
                </div>

                <div className="success-container">
                    <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-3 tw-gap-6">

                        <div className="tw-flex tw-flex-col">
                            <span className="tw-text-gray-500 tw-text-base">Student Name</span>
                            <span className="tw-font-bold tw-text-lg tw-mt-1">
                                {getStuAppTrackerListResp?.applicationSale?.saleFormDetails?.fullName}
                            </span>
                        </div>

                        <div className="tw-flex tw-flex-col">
                            <span className="tw-text-gray-500 tw-text-base">Application Date</span>
                            <span className="tw-font-bold tw-text-lg tw-mt-1">
                                {getDdMmYyyyFormat(getStuAppTrackerListResp?.applicationSale?.saleFormDetails?.applicationSaleDate)}
                            </span>
                        </div>

                        <div className="tw-flex tw-flex-col">
                            <span className="tw-text-gray-500 tw-text-base">Curriculum</span>
                            <span className="tw-font-bold tw-text-lg tw-mt-1">
                                {getStuAppTrackerListResp?.applicationSale?.saleFormDetails?.curriculumName}
                            </span>
                        </div>

                        <div className="tw-flex tw-flex-col">
                            <span className="tw-text-gray-500 tw-text-base">Contact Person Name</span>
                            <span className="tw-font-bold tw-text-lg tw-mt-1">
                                {getStuAppTrackerListResp?.applicationSale?.saleFormDetails?.contactPerson}
                            </span>
                        </div>

                        <div className="tw-flex tw-flex-col">
                            <span className="tw-text-gray-500 tw-text-base">Admission for</span>
                            <span className="tw-font-bold tw-text-lg tw-mt-1">
                                {getStuAppTrackerListResp?.applicationSale?.saleFormDetails?.admissionClassShortName}
                            </span>
                        </div>

                        <div className="tw-flex tw-flex-col">
                            <span className="tw-text-gray-500 tw-text-base">Phone</span>
                            <span className="tw-font-bold tw-text-lg tw-mt-1">
                                {getStuAppTrackerListResp?.applicationSale?.saleFormDetails?.contactNumber}
                            </span>
                        </div>

                        <div className="tw-flex tw-flex-col">
                            <span className="tw-text-gray-500 tw-text-base">Email</span>
                            <span className="tw-font-bold tw-text-lg tw-mt-1">
                                {getStuAppTrackerListResp?.applicationSale?.saleFormDetails?.emailId}
                            </span>
                        </div>

                        <div className="tw-flex tw-flex-col">
                            <span className="tw-text-gray-500 tw-text-base">Mode</span>
                            <span className="tw-font-bold tw-text-lg tw-mt-1">
                                {getStuAppTrackerListResp?.applicationSale?.saleFormDetails?.mode}
                            </span>
                        </div>

                        <div className="tw-flex tw-flex-col">
                            <span className="tw-text-gray-500 tw-text-base">Application Status</span>
                            {(applicationData?.includes(getStuAppTrackerListResp?.admissionTrackerReport?.admissionProcess) ||
                                getStuAppTrackerListResp?.admissionTrackerReport?.admissionCancel?.toLowerCase() === "yes") ? (
                                <span className="tw-font-bold tw-text-lg tw-mt-1 tw-text-red-600">
                                    Cancelled
                                </span>
                            ) : (
                                <span className="tw-font-bold tw-text-lg tw-mt-1 tw-text-green-600">
                                    Active
                                </span>
                            )}
                        </div>

                        <div className="tw-flex tw-flex-col">
                            <span className="tw-text-gray-500 tw-text-base">Current Status</span>
                            <span
                                className={`tw-font-bold tw-text-lg tw-mt-1 ${getStuAppTrackerListResp?.admissionTrackerReport?.admissionProcess
                                        ?.toLowerCase()
                                        ?.includes("cancelled")
                                        ? "tw-text-red-600"
                                        : "tw-text-yellow-500"
                                    }`}
                            >
                                {getStuAppTrackerListResp?.admissionTrackerReport?.admissionProcess}
                            </span>
                        </div>

                        <div className="tw-col-span-1 md:tw-col-span-2 lg:tw-col-span-3 tw-text-sm">
                            {getStuAppTrackerListResp?.currentStatusMessage || ""}
                        </div>
                    </div>
                </div>
                <div className="tw-mt-8 application-tracking-stepper-container">
                    <div className="tw-text-xl tw-font-semibold tw-mb-4">
                        Application tracking
                    </div>
                    <div className="tw-space-y-6 stepper">
                        {processList.map((item: any, idx: number) => (
                            <div
                                key={idx}
                                className={`tw-flex tw-items-start tw-gap-4 ${item?.status === "completed" ? "tw-opacity-100" : "tw-opacity-60"
                                    }`}
                            >
                                <div
                                    className={`tw-w-8 tw-h-8 tw-flex tw-items-center tw-justify-center tw-rounded-full tw-border ${item?.status === "completed"
                                            ? "tw-bg-green-600 tw-text-white tw-border-green-600"
                                            : "tw-border-gray-400"
                                        }`}
                                >
                                    {item?.status === "completed" && (
                                        <span>✓</span>
                                    )}
                                </div>
                                <div className={`step-details ${!(item?.status === "completed") && "opacity-40"}`}>
                                    <h5 className="tw-font-semibold">{item?.processName}</h5>
                                    <p className="tw-mt-1 tw-text-sm tw-text-gray-600">{item?.processDescription}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="tw-mt-8">
                    <div className="tw-text-lg">
                        Please{" "}
                        <span
                            onClick={previousStepper}
                            className="tw-text-sky-500 tw-underline tw-cursor-pointer"
                        >
                            click here
                        </span>{" "}
                        to enter your details again.
                    </div>

                    <div className="tw-text-lg tw-mt-3">
                        In case of any queries, please get in touch with our admission team{" "}
                        <span className="tw-text-sky-500 tw-underline tw-cursor-pointer">
                            here.
                        </span>
                    </div>
                </div>
            </main>
        </>
    )
}

export default MainContent