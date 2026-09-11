import { useFormik } from 'formik'
import { RadioInputContainerLms } from './RadioInputContainerLms';
import { RadioInputContainer, Switch, TextInputWithRegex } from '../../../../../Components/Common';
import { useAppDispatch, useAppSelector } from '../../../../../hooks/storehook';
import { shallowEqual } from 'react-redux';
import { generateActionPayload } from '../../../../../utility/reduxutility';
import { getGlobalSettingsBranchIdAct, saveGlobalSettingsAct } from '../../../../../store/lms/lmsAssessment/lmsAssessmentaction';
import { useEffect, useRef } from 'react';
import { toast } from 'react-toastify';

const initialValues = {
    marksPointsMode: "Auto",
    marksForCorrectAnswer: "",
    negativeMarking: true,
    negativeMarkingType: "",
    negativeMarks: "",
    passPercentage: "",
    shuffleQuestions: true,
    shuffleOptions: true,
    restrictAttempts: true,
    noOfAttempts: "",
    disableFinishButton: true,
    enableQuestionListView: true,
    hideSolutions: true,
};

const AdvanceSettings = () => {
    const dispatch = useAppDispatch();

    const modeOptions: Array<any> = [
        {
            id: "Auto",
            name: "Auto",
        },
        {
            id: "Manual",
            name: "Manual",
        }
    ]
    const negativeOptions: Array<any> = [
        {
            id: "FIXED",
            name: "Fixed",
        },
        {
            id: "PERCENTAGE",
            name: "Percentage",
        }
    ]

    const yesNoOptions: Array<any> = [
        {
            id: "true",
            name: "Yes",
        },
        {
            id: "false",
            name: "No",
        }
    ]
    const getQuestionsNoFormatApiCall = (otherProps?: any) => {
        let payload = {
            branchId,
            ...otherProps,
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
                addedToExam: getGlobalSettingsBranchIdResp.addedToExam,
                changedExamDate: getGlobalSettingsBranchIdResp.changedExamDate,
                examStarting: getGlobalSettingsBranchIdResp.examStarting,
                examEnding: getGlobalSettingsBranchIdResp.examEnding,
                examOngoing: getGlobalSettingsBranchIdResp.examOngoing,
                missedExam: getGlobalSettingsBranchIdResp.missedExam,
                examResultsReady: getGlobalSettingsBranchIdResp.examResultsReady,
                preExamReminder: getGlobalSettingsBranchIdResp.preExamReminder,
                nofDays: getGlobalSettingsBranchIdResp.nofDays,
                resultReleaseMode: getGlobalSettingsBranchIdResp.resultReleaseMode,
                resultStartDate: getGlobalSettingsBranchIdResp.resultStartDate,
                resultStartTime: getGlobalSettingsBranchIdResp.resultStartTime,
                showCorrectAnswersAfterSubmission: getGlobalSettingsBranchIdResp.showCorrectAnswersAfterSubmission,
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
            dispatch(
                saveGlobalSettingsAct(
                    generateActionPayload("save_global_settings", undefined, payload)
                )
            );
        },
    });

    useEffect(() => {
        if (getGlobalSettingsBranchIdResp) {
            settingsFormik.setValues({
                marksPointsMode: getGlobalSettingsBranchIdResp.marksPointsMode ?? "Auto",
                marksForCorrectAnswer: getGlobalSettingsBranchIdResp.marksForCorrectAnswer ?? "",
                negativeMarking: getGlobalSettingsBranchIdResp.negativeMarking ?? true,
                negativeMarkingType: getGlobalSettingsBranchIdResp.negativeMarkingType ?? "",
                negativeMarks: getGlobalSettingsBranchIdResp.negativeMarks ?? "",
                passPercentage: getGlobalSettingsBranchIdResp.passPercentage ?? "",
                shuffleQuestions: getGlobalSettingsBranchIdResp.shuffleQuestions ?? true,
                shuffleOptions: getGlobalSettingsBranchIdResp.shuffleOptions ?? true,
                restrictAttempts: getGlobalSettingsBranchIdResp.restrictAttempts ?? true,
                noOfAttempts: getGlobalSettingsBranchIdResp.noOfAttempts ?? "",
                disableFinishButton: getGlobalSettingsBranchIdResp.disableFinishButton ?? true,
                enableQuestionListView: getGlobalSettingsBranchIdResp.enableQuestionListView ?? true,
                hideSolutions: getGlobalSettingsBranchIdResp.hideSolutions ?? true,
            });
        } else {
            settingsFormik.resetForm({ values: initialValues });
        }
    }, [getGlobalSettingsBranchIdResp]);


    return (
        <>
            <div className="card">
                <div className="card-header">
                    <div className="row align-items-center">
                        <div className="col-6">
                            <h4 className="card-title mb-0 flex-grow-1">Advance Settings</h4>
                        </div>
                    </div>
                </div>

                <div className="card-body mt-3 px-4 lms_radio_bg">
                    <div className="list-group fs-12 px-2">
                        <div className="row">
                            {/* Left Column */}
                            <div className="col-12 col-md-6">
                                {/* Marks Mode */}
                                <RadioInputContainerLms
                                    name="marksPointsMode"
                                    labelText="Marks/Points Mode"
                                    inputContainerClassName="mt-2 d-flex"
                                    radioOptions={[
                                        { id: "Auto", name: "Auto" },
                                        { id: "Manual", name: "Manual" },
                                    ]}
                                    value={settingsFormik.values.marksPointsMode}
                                    onChange={settingsFormik.handleChange}
                                    showTooltipIcon={true}
                                    tooltipText={`<strong>Auto</strong> - Marks/Points will be calculated...`}
                                />

                                {settingsFormik.values.marksPointsMode === "Manual" && (
                                    <TextInputWithRegex
                                    allowedInputRegex="^[0-9]+$"
                                        name="marksForCorrectAnswer"
                                        labelText="Marks for Correct Answer"
                                        value={settingsFormik.values.marksForCorrectAnswer}
                                        onChange={settingsFormik.handleChange}
                                        formgroupClassName="d-flex align-items-center mb-3"
                                        labelClass="me-3 w-50"
                                        inputClassName="flex-grow-1"
                                    />
                                )}

                                {/* Negative Marking */}
                                 <div className="row mb-3 align-items-center">
                                        <label className="col-8">Negative Marking</label>
                                        <div className="col-3 d-flex">
                                        <Switch
                                            attributeId="negativeMarking"
                                            checked={settingsFormik.values.negativeMarking}
                                            onChangeHndlr={settingsFormik.handleChange}
                                            className="form-switch-sm"
                                        />
                                    </div>
                                </div>

                                {settingsFormik.values.negativeMarking && (
                                    <>
                                        <div className='row'>
                                            <label className="col-8">Negative Marking Type</label>
                                            <div className='col-4'>
                                                <RadioInputContainer
                                                    name="negativeMarkingType"
                                                    labelText=""
                                                    inputContainerClassName="mt-2"
                                                    radioOptions={negativeOptions}
                                                    value={settingsFormik.values.negativeMarkingType}
                                                    onChange={settingsFormik.handleChange}
                                                />
                                            </div>
                                        </div>
                                        {settingsFormik.values.negativeMarkingType === "FIXED" && (
                                            <div className='row'>
                                                <label className="col-8">Negative Marks</label>
                                                <div className='col-4'>
                                                    <TextInputWithRegex
                                                        allowedInputRegex="^[0-9]+$"
                                                        name="negativeMarks"
                                                        labelText=""
                                                        value={settingsFormik.values.negativeMarks}
                                                        onChange={settingsFormik.handleChange}
                                                        formgroupClassName="d-flex align-items-center mb-3"
                                                        labelClass="me-3 w-50"
                                                        inputClassName="flex-grow-1"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                        {settingsFormik.values.negativeMarkingType === "PERCENTAGE" && (
                                            <div className='row'>
                                                <label className="col-8">Negative Percentage</label>
                                                <div className='col-4'>
                                                    <TextInputWithRegex
                                                        allowedInputRegex="^[0-9]+$"
                                                        name="negativeMarks"
                                                        labelText=""
                                                        value={settingsFormik.values.negativeMarks}
                                                        onChange={settingsFormik.handleChange}
                                                        formgroupClassName="d-flex align-items-center mb-3"
                                                        labelClass="me-4 w-50"
                                                        inputClassName="flex-grow-1"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}

                               <div className='row'>
                                <label className="col-8">Pass Percentage</label>
                                <div className='col-4'>                   
                                <TextInputWithRegex
                                allowedInputRegex="^[0-9]+$"
                                    name="passPercentage"
                                    labelText=""
                                    value={settingsFormik.values.passPercentage}
                                    onChange={settingsFormik.handleChange}
                                    formgroupClassName="d-flex align-items-center mb-3"
                                    labelClass="me-4 w-50"
                                    inputClassName="flex-grow-1"
                                />
                                </div>
                               </div>
                                {[
                                    { name: "shuffleQuestions", label: "Shuffle Questions" },
                                    { name: "shuffleOptions", label: "Shuffle Options" },
                                    { name: "restrictAttempts", label: "Restrict Attempts" },
                                    { name: "disableFinishButton", label: "Disable Finish Button" },
                                    { name: "enableQuestionListView", label: "Enable Question List" },
                                    { name: "hideSolutions", label: "Hide Solutions" },
                                ].map((item) => {
                                    const isShuffleQuestions = item.name === "shuffleQuestions";
                                    const isShuffleOptions = item.name === "shuffleOptions";
                                    const disableSwitch =
                                        (isShuffleQuestions && settingsFormik.values.shuffleOptions) ||
                                        (isShuffleOptions && settingsFormik.values.shuffleQuestions);

                                    return (
                                        <div className="row mb-3 align-items-center" key={item.name}>
                                            <label className="col-8">{item.label}</label>
                                            <div className="col-3 d-flex">
                                                <Switch
                                                    attributeId={item.name}
                                                    checked={settingsFormik.values[item.name]}
                                                    onChangeHndlr={(e) => {
                                                        const { name, checked } = e.target;

                                                        // Handle mutual exclusivity:
                                                        if (name === "shuffleQuestions" && checked) {
                                                            settingsFormik.setFieldValue("shuffleOptions", false);
                                                        } else if (name === "shuffleOptions" && checked) {
                                                            settingsFormik.setFieldValue("shuffleQuestions", false);
                                                        }

                                                        settingsFormik.setFieldValue(name, checked);
                                                    }}
                                                    className="form-switch-sm"
                                                    isDisabled={disableSwitch}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}

                                {settingsFormik.values.restrictAttempts && (
                                     <div className='row'>
                                <label className="col-8">Number of Attempts</label>
                                <div className='col-4'>  
                               <TextInputWithRegex
                                    allowedInputRegex="^[0-9]+$"
                                        name="noOfAttempts"
                                        labelText=""
                                        value={settingsFormik.values.noOfAttempts}
                                        onChange={settingsFormik.handleChange}
                                        formgroupClassName="d-flex align-items-center mb-3"
                                        labelClass="me-3 w-50"
                                        inputClassName="flex-grow-1"
                                    />
                                </div>
                               </div>                                
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Save button */}
                    <div className="hstack gap-2 justify-content-end pt-3">
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

export default AdvanceSettings