import React, { useContext, useEffect, useMemo, useState } from 'react'
import { DateInput, RadioInputContainer, Switch, TextInput, TimeInput } from '../../../../../../Components/Common'
import { useAppDispatch, useAppSelector } from '../../../../../../hooks/storehook';
import { getGlobalSettingsBranchIdAct } from '../../../../../../store/lms/lmsAssessment/lmsAssessmentaction';
import { generateActionPayload } from '../../../../../../utility/reduxutility';
import { shallowEqual } from 'react-redux';

const ResultSettings = ({ data }) => {
    
  const scheduleOptions: Array<any> = [
    {
      id: "INSTANTLY",
      name: "Instantly",
      description: "Right after the assessment is evaluated"
    },
    {
      id: "AFTER_VALIDITY",
      name: "After Validity",
      description: "Right after the validity of the assessment is over"
    },
    {
      id: "MANUALLY",
      name: "Manually",
      description: "Publish results on a specific date and time"
    }
  ];

  // Parse releaseDatetime to get date and time for display
  const getReleaseDateTime = () => {
    if (data?.releaseDatetime) {
      const date = new Date(data.releaseDatetime);
      return {
        date: date.toISOString().split('T')[0],
        time: date.toTimeString().slice(0, 5)
      };
    }
    return { date: '', time: '' };
  };

  const { date: releaseDate, time: releaseTime } = getReleaseDateTime();

  return (
    <>
      <div className='border lms_radio_bg'>
        <div className="p-0">
          <h4 className="card-title mb-0 fs-12 px-4 pt-2">Result Settings</h4>
          <h4 className="text-muted mb-0 fs-12 mt-1 border-bottom pb-2 px-4 pt-1">
            Choose when the students can view their results
          </h4>
        </div>   
        <div className="list-group fs-12 px-4 pt-1">
          <RadioInputContainer
            name="resultReleaseMode"
            inputContainerClassName="mt-2"
            radioOptions={scheduleOptions}
            value={data?.resultReleaseMode || "INSTANTLY"}
            onChange={undefined}
          />
        </div> 
        {data?.resultReleaseMode?.toLowerCase() === "manually" && (
          <div className='row'>
            <div className='col-12 col-md-4'>
              <DateInput
                name="resultStartDate"
                labelText="Date"
                value={releaseDate}
                onChange={undefined}
              />
            </div>
            <div className='col-12 col-md-4'>
              <TimeInput
                name="resultStartTime"
                labelText='Time'
                value={releaseTime}
                onChange={undefined}
              />
            </div>
          </div>
        )}

        <div className='row align-items-center px-4 py-2'>
          <div className='col-9 d-grid'>
            <span className='card-title mb-0 fs-12'>
              Show Correct Answers After Submission
            </span>
          </div>
          <div className='col-3 d-flex justify-content-center'>
          <span className={`badge ${data?.showCorrectAnswersAfterSubmission === true  ? "bg-success" : "bg-secondary"}`}>
                    {data?.showCorrectAnswersAfterSubmission == true ? "Yes" : "No"}
                  </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResultSettings;
