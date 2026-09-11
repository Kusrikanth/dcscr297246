import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { DateInput, RadioInputContainer, Switch, TextInput, TimeInput } from '../../../../../Components/Common'
import { useFormik } from 'formik'
import { getGlobalSettingsBranchIdAct, saveGlobalSettingsAct } from '../../../../../store/lms/lmsAssessment/lmsAssessmentaction';
import { generateActionPayload } from '../../../../../utility/reduxutility';
import { toast } from 'react-toastify';
import { shallowEqual } from 'react-redux';
import { useAppDispatch, useAppSelector } from '../../../../../hooks/storehook';

const initialValues = {
    resultReleaseMode: "INSTANTLY",
    resultStartDate: "",
    resultStartTime: "",
    showCorrectAnswersAfterSubmission: true,
};

const ResultSettings = () => {
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

    const dispatch = useAppDispatch();
    const getQuestionsNoFormatApiCall = () => {
        let payload = {
            branchId,
            marksPointsMode: getGlobalSettingsBranchIdResp.marksPointsMode,
            marksForCorrectAnswer: getGlobalSettingsBranchIdResp.marksForCorrectAnswer,
            negativeMarking: getGlobalSettingsBranchIdResp.negativeMarking,
            negativeMarkingType: getGlobalSettingsBranchIdResp.negativeMarkingType,
            negativeMarks: getGlobalSettingsBranchIdResp.negativeMarks,
            passPercentage: getGlobalSettingsBranchIdResp.passPercentage,
            shuffleQuestions: getGlobalSettingsBranchIdResp.shuffleQuestions,
            shuffleOptions: getGlobalSettingsBranchIdResp.shuffleOptions,
            restrictAttempts: getGlobalSettingsBranchIdResp.restrictAttempts,
            noOfAttempts: getGlobalSettingsBranchIdResp.noOfAttempts,
            disableFinishButton: getGlobalSettingsBranchIdResp.disableFinishButton,
            enableQuestionListView: getGlobalSettingsBranchIdResp.enableQuestionListView,
            hideSolutions: getGlobalSettingsBranchIdResp.hideSolutions,
            addedToExam: getGlobalSettingsBranchIdResp.addedToExam,
            changedExamDate: getGlobalSettingsBranchIdResp.changedExamDate,
            examStarting: getGlobalSettingsBranchIdResp.examStarting,
            examEnding: getGlobalSettingsBranchIdResp.examEnding,
            examOngoing: getGlobalSettingsBranchIdResp.examOngoing,
            missedExam: getGlobalSettingsBranchIdResp.missedExam,
            examResultsReady: getGlobalSettingsBranchIdResp.examResultsReady,
            preExamReminder: getGlobalSettingsBranchIdResp.preExamReminder,
            nofDays: getGlobalSettingsBranchIdResp.nofDays,
            fullScreenMode: getGlobalSettingsBranchIdResp.fullScreenMode,
            disableRightClickCopyPaste: getGlobalSettingsBranchIdResp.disableRightClickCopyPaste,
            singleTabOnly: getGlobalSettingsBranchIdResp.singleTabOnly,
            blockDevTools: getGlobalSettingsBranchIdResp.blockDevTools,
            cursorMustStayInsideWindow: getGlobalSettingsBranchIdResp.cursorMustStayInsideWindow,
            preventSwitchingAppsTabs: getGlobalSettingsBranchIdResp.preventSwitchingAppsTabs,
            noSecondMonitorAllowed: getGlobalSettingsBranchIdResp.noSecondMonitorAllowed,
            serverControlledTimerAutoSubmit: getGlobalSettingsBranchIdResp.serverControlledTimerAutoSubmit,
            autoSaveAnswersPeriodically: getGlobalSettingsBranchIdResp.autoSaveAnswersPeriodically,
            logWarnings: getGlobalSettingsBranchIdResp.logWarnings,
        };
        dispatch(getGlobalSettingsBranchIdAct(generateActionPayload("get_global_settings_branch_id", undefined, payload)));
    };

    useEffect(() => {
        getQuestionsNoFormatApiCall();
    }, [])

    const { currentInstIdResp: instituteId,
        currentBranchIdResp: branchId,
        saveGlobalSettingsResp,
        getGlobalSettingsBranchIdResp,
        lmsAssessmentErrorAct
    } = useAppSelector(
        ({
            appData, lmsAssessment,
        }) => ({
            currentInstIdResp: appData.currentInstIdResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            saveGlobalSettingsResp: lmsAssessment.saveGlobalSettingsResp,
            getGlobalSettingsBranchIdResp: lmsAssessment.getGlobalSettingsBranchIdResp,
            lmsAssessmentErrorAct: lmsAssessment.lmsAssessmentErrorAct,
        }),
        shallowEqual
    );

    const instituteRespRef = useRef<any>({
        prevSaveGlobalSettingsResp: saveGlobalSettingsResp,
        prevLmsAssessmentErrorAct: lmsAssessmentErrorAct,
    });

    useEffect(() => {
        const { prevLmsAssessmentErrorAct, prevSaveGlobalSettingsResp, prevSaveAssessemntSettingsStepResp } = instituteRespRef.current;
        if (lmsAssessmentErrorAct && prevLmsAssessmentErrorAct !== lmsAssessmentErrorAct) {
            toast.error(lmsAssessmentErrorAct.details || "Something went wrong.");
        }
        else if (saveGlobalSettingsResp && prevSaveGlobalSettingsResp !== saveGlobalSettingsResp) {
            toast.success("Advance Settings saved successfully.");
        }
        instituteRespRef.current.prevSaveGlobalSettingsResp = saveGlobalSettingsResp;
        instituteRespRef.current.prevLmsAssessmentErrorAct = lmsAssessmentErrorAct;
    }, [lmsAssessmentErrorAct, saveGlobalSettingsResp]);

    useEffect(() => {
        if (getGlobalSettingsBranchIdResp) {
            settingsFormik.setValues({
                resultReleaseMode: getGlobalSettingsBranchIdResp.resultReleaseMode ?? "INSTANTLY",
                resultStartDate: getGlobalSettingsBranchIdResp.resultStartDate ?? "",
                resultStartTime: getGlobalSettingsBranchIdResp.resultStartTime ?? "",
                showCorrectAnswersAfterSubmission: getGlobalSettingsBranchIdResp.showCorrectAnswersAfterSubmission ?? true,
            });
        } else {
            settingsFormik.resetForm({ values: initialValues });
        }
    }, [getGlobalSettingsBranchIdResp]);

    const settingsFormik = useFormik({
        initialValues,
        onSubmit: (values) => {
            const cleanedValues = Object.fromEntries(
                Object.entries(values).filter(
                    ([_, v]) => v !== null && v !== undefined
                )
            );
            let payload = {
                instituteId,
                branchId,
                ...cleanedValues,
            };
            dispatch(
                saveGlobalSettingsAct(
                    generateActionPayload("save_global_settings", undefined, payload)
                )
            );
        },
    });

    return (
        <>
            <div className="card lms_radio_bg">
                <div className="card-header">
                    <div className="row align-items-center">
                        <div className="col-6">
                            <h4 className="card-title mb-0 flex-grow-1">
                                Result Settings
                            </h4>
                        </div>
                    </div>
                </div>
                <div className='card-body px-4'>
                    <div className="p-2">
                        <h4 className="card-title mb-0 fs-12">Result Settings</h4>
                        <h4 className="text-muted mb-0 fs-12 mt-1 border-bottom pb-2">Choose when the students can view their results</h4>
                    </div>
                    <div className="list-group fs-12">
                        <RadioInputContainer
                            name="resultReleaseMode"
                            inputContainerClassName="mt-2"
                            radioOptions={scheduleOptions}
                            value={settingsFormik.values.resultReleaseMode}
                            onChange={settingsFormik.handleChange}
                        />
                    </div>
                    {settingsFormik.values.resultReleaseMode.toLowerCase() === "manually" && (
                        <>
                            <div className='row'>
                                <div className='col-12 col-md-4'>
                                    <DateInput
                                        name="resultStartDate"
                                        labelText="Date"
                                        value={settingsFormik.values.resultStartDate}
                                        onChange={settingsFormik.handleChange}
                                    />
                                </div>
                                <div className='col-12 col-md-4'>
                                    <TimeInput
                                        name="resultStartTime"
                                        labelText='Time'
                                        value={settingsFormik.values.resultStartTime}
                                        onChange={settingsFormik.handleChange}
                                    />
                                </div>
                            </div>
                        </>
                    )}
                    <div className='row align-items-center'>
                        <div className='col-9 d-grid'>
                            <span className='card-title mb-0 fs-12'>
                                Show Correct Answers After Submission
                            </span>
                        </div>
                        <div className='col-3 d-flex justify-content-center'>
                            <Switch
                                attributeId="showCorrectAnswersAfterSubmission"
                                labelName=""
                                checked={settingsFormik.values.showCorrectAnswersAfterSubmission}
                                onChangeHndlr={settingsFormik.handleChange}
                                className="form-switch-sm mb-0 pt-2 pb-2"
                            />
                        </div>
                    </div>
                    <div className="hstack gap-2 justify-content-end mt-3 pb-0">
                        <button
                            className="btn btn-success px-4"
                            type="submit"
                            onClick={(event: any) => settingsFormik.handleSubmit(event)}
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ResultSettings