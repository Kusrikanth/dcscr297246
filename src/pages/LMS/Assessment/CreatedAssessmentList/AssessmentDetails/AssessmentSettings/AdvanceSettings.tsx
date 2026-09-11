import React from 'react'

const AdvanceSettings = (props: any) => {

    const { data } = props

    return (
        <div className="border rounded-md p-4">
            <div className=" row">
                <div className='col-6'>
                    <div className='tw-flex tw-items-center tw-gap-2 tw-mb-1'>
                        <span className="fs-12 fw-bold">Marks/Points Mode:   </span>
                        <p className="tw-mb-0 fs-12 text-muted">{data?.marksPointsMode}</p>
                    </div>
                    {data?.marksPointsMode == 'Manual' && <div className='tw-flex tw-items-center tw-gap-2 tw-mb-1'>
                        <span className="fs-12 fw-bold">Marks for Correct Answer:   </span>
                        <p className="tw-mb-0 fs-12 text-muted">{data?.marksForCorrectAnswer}</p>
                    </div>}
                    <div className='tw-flex tw-items-center tw-gap-2 tw-mb-1'>
                        <span className="fs-12 fw-bold">Negative Marking:   </span>
                        <p className="tw-mb-0 fs-12 text-muted">{data?.negativeMarking === true ? 'Yes' : 'No'}</p>
                    </div>
                    {data?.negativeMarking === true && <div className='tw-flex tw-items-center tw-gap-2 tw-mb-1'>
                        <span className="fs-12 fw-bold ">Negative Marking Type:   </span>
                        <p className="tw-mb-0 fs-12 text-muted">{data?.negativeMarkingType}</p>
                    </div>}
                    {data?.negativeMarking === true && data?.negativeMarkingType == "FIXED" && <div className='tw-flex tw-items-center tw-gap-2 tw-mb-1'>
                        <span className="fs-12 fw-bold">Negative Marks:   </span>
                        <p className="tw-mb-0 fs-12 text-muted">{data?.negativeMarks}</p>
                    </div>}
                    {data?.negativeMarking === true && data?.negativeMarkingType == "PERCENTAGE" && <div className='tw-flex tw-items-center tw-gap-2 tw-mb-1'>
                        <span className="fs-12 fw-bold">Negative Percentage:   </span>
                        <p className="tw-mb-0 fs-12 text-muted">{data?.negativeMarks}</p>
                    </div>}
                    <div className='tw-flex tw-items-center tw-gap-2 tw-mb-1'>
                        <span className="fs-12 fw-bold">Pass Percentage:   </span>
                        <p className="tw-mb-0 fs-12 text-muted">{data?.passPercentage}</p>
                    </div>
                </div>

                <div className='col-6'>
                    <div className='tw-flex tw-items-center tw-gap-2 tw-mb-1'>
                        <span className="fs-12 fw-bold ">Shuffle Questions:   </span>
                        <p className="tw-mb-0 fs-12 text-muted">{data?.shuffleQuestions === true ? 'Yes' : 'No'}</p>
                    </div>
                    <div className='tw-flex tw-items-center tw-gap-2 tw-mb-1'>
                        <span className="fs-12 fw-bold ">Shuffle Options:   </span>
                        <p className="tw-mb-0 fs-12 text-muted">{data?.shuffleOptions === true ? 'Yes' : 'No'}</p>
                    </div>
                    <div className='tw-flex tw-items-center tw-gap-2 tw-mb-1'>
                        <span className="fs-12 fw-bold ">Restrict Attempts:   </span>
                        <p className="tw-mb-0 fs-12 text-muted">{data?.restrictAttempts === true ? 'Yes' : 'No'}</p>
                    </div>
                    <div className='tw-flex tw-items-center tw-gap-2 tw-mb-1'>
                        <span className="fs-12 fw-bold ">Disable Finish Button:   </span>
                        <p className="tw-mb-0 fs-12 text-muted">{data?.disableFinishButton === true ? 'Yes' : 'No'}</p>
                    </div>
                    <div className='tw-flex tw-items-center tw-gap-2 tw-mb-1'>
                        <span className="fs-12 fw-bold">Enable Question List:   </span>
                        <p className="tw-mb-0 fs-12 text-muted">{data?.enableQuestionListView === true ? 'Yes' : 'No'}</p>
                    </div>
                    <div className='tw-flex tw-items-center tw-gap-2 tw-mb-1'>
                        <span className="fs-12 fw-bold ">Hide Solutions:   </span>
                        <p className="tw-mb-0 fs-12 text-muted">{data?.hideSolutions === true ? 'Yes' : 'No'}</p>
                    </div>
                    {data?.restrictAttempts === true && <div className='tw-flex tw-items-center tw-gap-2 tw-mb-1'>
                        <span className="fs-12 fw-bold ">Number of Attempts:   </span>
                        <p className="tw-mb-0 fs-12 text-muted">{data?.noOfAttempts === true ? 'Yes' : 'No'}</p>
                    </div>}

                </div>

            </div>
        </div>
    )
}

export default AdvanceSettings
