import React from 'react'
import "./_apptracking.scss";
import { default as NoResultSvg} from "../../assets/imagesdps/academics/NoResult.svg?react"


const NoResult = (props:{setStepper:(stepper:string)=>void}) => {
    return (
        <>
            <main className="main-content-tracking">
                <div>
                    <span className="tw-text-4xl  tw-font-medium">
                        Application Number :{" "}
                        <span className="tw-text-orange-500">
                            No application found
                        </span>
                    </span>
                </div>

                <div className="no-result-container tw-flex tw-flex-col tw-items-center tw-justify-center tw-text-gray-500 tw-mt-8 tw-text-center">
                    <div>
                        <NoResultSvg />
                    </div>
                    <div className="tw-text-lg tw-mt-4">
                        No Application found
                    </div>
                </div>

                <div className="tw-mt-8">
                    <div className="tw-text-lg">
                        Please{" "}
                        <span
                            onClick={() => props.setStepper("verification")}
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

export default NoResult