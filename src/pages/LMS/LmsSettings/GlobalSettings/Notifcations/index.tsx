import React, { useEffect, useRef } from 'react'
import { useFormik } from 'formik'
import { SelectInput, Switch } from '../../../../../Components/Common'
import { getGlobalSettingsBranchIdAct, saveGlobalSettingsAct } from '../../../../../store/lms/lmsAssessment/lmsAssessmentaction'
import { generateActionPayload } from '../../../../../utility/reduxutility'
import { toast } from 'react-toastify'
import { shallowEqual } from 'react-redux'
import { useAppDispatch, useAppSelector } from '../../../../../hooks/storehook'

const initialValues = {
    addedToExam: true,
    changedExamDate: true,
    examStarting: true,
    examEnding: true,
    examOngoing: true,
    missedExam: true,
    examResultsReady: true,
    preExamReminder: true,
    nofDays: "",
}

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

const Notifcations = () => {
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
            resultReleaseMode: getGlobalSettingsBranchIdResp.resultReleaseMode,
            resultStartDate: getGlobalSettingsBranchIdResp.resultStartDate,
            resultStartTime: getGlobalSettingsBranchIdResp.resultStartTime,
            showCorrectAnswersAfterSubmission: getGlobalSettingsBranchIdResp.showCorrectAnswersAfterSubmission,
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
                addedToExam: getGlobalSettingsBranchIdResp.addedToExam ?? true,
                changedExamDate: getGlobalSettingsBranchIdResp.changedExamDate ?? true,
                examStarting: getGlobalSettingsBranchIdResp.examStarting ?? true,
                examEnding: getGlobalSettingsBranchIdResp.examEnding ?? true,
                examOngoing: getGlobalSettingsBranchIdResp.examOngoing ?? true,
                missedExam: getGlobalSettingsBranchIdResp.missedExam ?? true,
                examResultsReady: getGlobalSettingsBranchIdResp.examResultsReady ?? true,
                preExamReminder: getGlobalSettingsBranchIdResp.preExamReminder ?? true,
                nofDays: getGlobalSettingsBranchIdResp.nofDays ?? ""
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
                    ([_, v]) => v !== "" && v !== null && v !== undefined
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
            <div className="card">
                <div className="card-header">
                    <div className="row align-items-center">
                        <div className="col-6">
                            <h4 className="card-title mb-0 flex-grow-1">
                                Notification
                            </h4>
                        </div>
                    </div>
                </div>
                <div className='card-body'>
                    <div className="list-group fs-12">
                        <div className="row">
                            {notificationsData.map((item) => (
                                <div className='card-body border-bottom px-4' key={item.id}>
                                    <div className='row align-items-center px-2'>
                                        <div className='col-7 d-grid'>
                                            <span className='fs-12 fw-bold'>{item.title}</span>
                                            <span className='fs-12 text-muted'>{item.description}</span>
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

export default Notifcations;
