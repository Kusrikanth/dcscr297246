import React, { useContext, useMemo, useEffect } from "react";
import { UncontrolledAccordion, AccordionBody, AccordionHeader, AccordionItem } from "reactstrap";
import { StepperFormContext } from "../helper";
import { HugeiconsIcon } from "@hugeicons/react";
import { CircleArrowRight01Icon, CircleArrowLeft01Icon, FavouriteIcon, IdentityCardIcon, SmileIcon, NeutralIcon, Sad01Icon, HelpSquareIcon } from "@hugeicons-pro/core-stroke-standard";
import { useFormik } from "formik";
import { CustomTooltip, TextInput } from "../../../../../../../../Components/Common";
import TableContainer from "../../../../../../../../Components/Common/TableContainer";
import { generateActionPayload } from "../../../../../../../../utility/reduxutility";
import { getPreparatoryGradeEntryListByIdAct, savePreparatoryStudentFeedbackAct } from "../../../../../../../../store/examination/examinationsettings/examinationsettingsaction";
import { useAppDispatch, useAppSelector } from "../../../../../../../../hooks/storehook";
import { shallowEqual } from "react-redux";

const initialValues = {
    myName1: "",
    myFriendName1: "",
    myName2: "",
    myFriendName2: "",
    selfResponses: {},
    peer1Responses: {},
    peer2Responses: {},
};

// Mapping between form fields and API payload
const selfResponsesMapping = {
    0: "feelingsExpression",
    1: "selfCalming",
    2: "empathyFriends",
    3: "respectOpinions",
    4: "helpResolveConflicts",
    5: "comfortOthers",
    6: "selfSchoolConfidence",
};

const peerResponsesMapping = {
    0: "friendFeelingsExpression",
    1: "friendSelfCalming",
    2: "friendEmpathy",
    3: "friendRespectOpinions",
    4: "friendConflictResolution",
    5: "friendComfortOthers",
};

const StudentQuestions = ({
    questions,
    values,
    onChange,
    isViewMode,
    prefix,
}: {
    questions: string[];
    values: Record<number, string>;
    onChange: (index: number, value: string) => void;
    isViewMode: boolean;
    prefix: string;
}) => {
    const options = [
        {
            value: "yes",
            label: "Yes",
            icon: SmileIcon,
            color: "tw-text-green-600",
            border: "tw-border-green-500 tw-bg-green-100",
        },
        {
            value: "sometimes",
            label: "Sometimes",
            icon: NeutralIcon,
            color: "tw-text-yellow-600",
            border: "tw-border-yellow-500 tw-bg-yellow-100",
        },
        {
            value: "no",
            label: "No",
            icon: Sad01Icon,
            color: "tw-text-red-600",
            border: "tw-border-red-500 tw-bg-red-100",
        },
        {
            value: "notSure",
            label: "Not sure",
            icon: HelpSquareIcon,
            color: "tw-text-gray-600",
            border: "tw-border-gray-400 tw-bg-gray-100",
        },
    ];

    const columns = useMemo(() => {
        const baseCols = [
            {
                Header: "Question",
                accessor: "question",
                disableSortBy: true,
                columnClassName: "tw-text-left tw-font-medium tw-text-gray-800 tw-px-4 tw-py-3",
                Cell: ({ row }: any) => (
                    <span>{`${row.index + 1}. ${row.original.question}`}</span>
                ),
            },
            ...options.map((opt) => ({
                Header: opt.label,
                accessor: opt.value,
                disableSortBy: true,
                columnClassName: "tw-px-2 tw-py-3",
                Cell: ({ row }: any) => {
                    const index = row.index;
                    const isSelected = values[index] === opt.value;

                    return (
                        <div
                            className={`tw-inline-flex tw-items-center tw-justify-center tw-rounded-full tw-border-2 ${isSelected ? opt.border : "tw-border-gray-300"
                                }`}
                            style={{
                                width: "34px",
                                height: "34px",
                                cursor: isViewMode ? "default" : "pointer",
                            }}
                            onClick={() => !isViewMode && onChange(index, opt.value)}
                            data-tooltip-id={`${prefix}-q${index}-${opt.value}`}
                        >
                            <HugeiconsIcon
                                icon={opt.icon}
                                size={22}
                                className={isSelected ? opt.color : "tw-text-gray-400"}
                            />
                            <CustomTooltip
                                id={`${prefix}-q${index}-${opt.value}`}
                                content={opt.label}
                                placement="top"
                            />
                        </div>
                    );
                },
            })),
        ];
        return baseCols;
    }, [options, values, isViewMode, prefix, onChange]);

    const data = useMemo(() => {
        return questions.map((q) => ({ question: q }));
    }, [questions]);

    return (
        <div className="tw-overflow-hidden tw-rounded-lg tw-border tw-border-gray-300 tw-shadow-sm">
            <TableContainer
                columns={columns}
                data={data}
                tableClass="tw-w-full tw-text-sm tw-bg-white tw-border-collapse"
                theadClass="tw-bg-orange-100 tw-text-dark tw-text-start tw-font-semibold"
                alternateRowColor={true}
                divClass="tw-mb-0"
            />
        </div>
    );
};

const StudentFeedback = (props: any) => {
    const { entryId } = props;
    const { stepId, isViewMode, nextStepHndlr, submitCurrentFormCllbck } =
        useContext(StepperFormContext);
    const dispatch = useAppDispatch();
    
    const {
        uploadFamilySurroundingPhotoResp,
        savePreparatoryGradeEntryListResp,
        getPreparatoryGradeEntryListByIdResp,
        savePreparatoryStudentSurroundingResp,
        savePreparatoryStudentFeedbackResp,
        
    } = useAppSelector(
        ({ examinationManagement, examinationSettings }) => ({
            uploadFamilySurroundingPhotoResp: examinationManagement.uploadFamilySurroundingPhotoResp,
            savePreparatoryGradeEntryListResp: examinationSettings.savePreparatoryGradeEntryListResp,
            getPreparatoryGradeEntryListByIdResp: examinationSettings.getPreparatoryGradeEntryListByIdResp,
            savePreparatoryStudentSurroundingResp: examinationSettings.savePreparatoryStudentSurroundingResp,
            savePreparatoryStudentFeedbackResp: examinationSettings.savePreparatoryStudentFeedbackResp

        }),
        shallowEqual
    );

            const studentFeedbackFormik = useFormik({
                initialValues,
                onSubmit: () => { },
            });

    const handleChange = (section: string, index: number, value: string) => {
        studentFeedbackFormik.setFieldValue(`${section}.${index}`, value);
    };
useEffect(() => {
    if (getPreparatoryGradeEntryListByIdResp) {
        const { selfFeedback, peer1Feedback, peer2Feedback } =
            getPreparatoryGradeEntryListByIdResp;

        const selfResponsesPrefill: any = {};
        Object.entries(selfResponsesMapping).forEach(([index, apiKey]) => {
            selfResponsesPrefill[index] = selfFeedback?.[apiKey] || "";
        });

        const peer1ResponsesPrefill: any = {};
        Object.entries(peerResponsesMapping).forEach(([index, apiKey]) => {
            peer1ResponsesPrefill[index] = peer1Feedback?.[apiKey] || "";
        });

        const peer2ResponsesPrefill: any = {};
        Object.entries(peerResponsesMapping).forEach(([index, apiKey]) => {
            peer2ResponsesPrefill[index] = peer2Feedback?.[apiKey] || "";
        });

        studentFeedbackFormik.setValues({
            myName1: peer1Feedback?.myName || "",
            myFriendName1: peer1Feedback?.friendName || "",
            myName2: peer2Feedback?.myName || "",
            myFriendName2: peer2Feedback?.friendName || "",
            selfResponses: selfResponsesPrefill,
            peer1Responses: peer1ResponsesPrefill,
            peer2Responses: peer2ResponsesPrefill,
        });
    }
}, [getPreparatoryGradeEntryListByIdResp]);

useEffect(() => {
            if (savePreparatoryGradeEntryListResp?.data || entryId) {
                dispatch(getPreparatoryGradeEntryListByIdAct(generateActionPayload("get_preparatory_grade_entry_by_id", { id: savePreparatoryGradeEntryListResp?.data || entryId }, undefined)));
            }
        }, [entryId, savePreparatoryGradeEntryListResp]);

    const transformToPayload = () => {
        const { selfResponses, peer1Responses, peer2Responses, myName1, myFriendName1, myName2, myFriendName2 } = studentFeedbackFormik.values;

        const selfFeedback: any = {};
        Object.entries(selfResponses).forEach(([key, value]) => {
            const apiKey = selfResponsesMapping[Number(key) as keyof typeof selfResponsesMapping];
            if (apiKey) {
                selfFeedback[apiKey] = value;
            }
        });

        const peer1Feedback: any = {
            myName: myName1,
            friendName: myFriendName1,
        };
        Object.entries(peer1Responses).forEach(([key, value]) => {
            const apiKey = peerResponsesMapping[Number(key) as keyof typeof peerResponsesMapping];
            if (apiKey) {
                peer1Feedback[apiKey] = value;
            }
        });

        const peer2Feedback: any = {
            myName: myName2,
            friendName: myFriendName2,
        };
        Object.entries(peer2Responses).forEach(([key, value]) => {
            const apiKey = peerResponsesMapping[Number(key) as keyof typeof peerResponsesMapping];
            if (apiKey) {
                peer2Feedback[apiKey] = value;
            }
        });

        return {
            selfFeedback,
            peer1Feedback,
            peer2Feedback,
        };
    };

    const handleNext = async () => {
        try {
            const payload: any = transformToPayload();
            if(savePreparatoryStudentFeedbackResp?.data || getPreparatoryGradeEntryListByIdResp?.studentPartA3Id){
                payload.studentPartA3Id = savePreparatoryStudentFeedbackResp?.data || getPreparatoryGradeEntryListByIdResp?.studentPartA3Id
            }
            dispatch(savePreparatoryStudentFeedbackAct(generateActionPayload("save_preparatory_student_feedback", { id: savePreparatoryGradeEntryListResp?.data || entryId}, payload)));
            submitCurrentFormCllbck([], "NEXT_TAB");
            nextStepHndlr(stepId, studentFeedbackFormik.values);
            
        } catch (error) {
            console.error('Error submitting feedback:', error);
        }
    };

    const handlePrevious = () => {
        submitCurrentFormCllbck([], "PREVIOUS_TAB");
        nextStepHndlr(stepId, studentFeedbackFormik.values);
    };

    const selfQuestions = [
        "I can talk about how I feel, e.g., happy, confident, upset, or angry.",
        "I can calm myself down during difficult situations.",
        "I can understand how my friends feel.",
        "I respect everyone's opinions.",
        "I can help my friends make up after a fight.",
        "When someone is sad, I can make them feel better.",
        "I think I do well at school.",
    ];

    const peerQuestions = [
        "My friend can talk about how he/she feels, e.g., happy, confident, upset, or angry.",
        "My friend can calm himself/herself down during difficult situations.",
        "My friend can understand how his/her friends feel.",
        "My friend respects everyone's opinions.",
        "My friend can help others make up after a fight.",
        "When someone is sad, my friend can make them feel better.",
    ];

    return (
        <>
            <UncontrolledAccordion
                open="selfFeedback"
                defaultOpen={["selfFeedback", "peer1Feedback", "peer2Feedback"]}
                stayOpen
            >
                <AccordionItem>
                    <AccordionHeader tag="h5" targetId="selfFeedback">
                        <div className="d-flex align-items-center">
                            <HugeiconsIcon
                                icon={IdentityCardIcon}
                                size={22}
                                className="me-2"
                                style={{ color: "#0ab39c" }}
                            />
                            <div className="fw-bold">How do I feel at school</div>
                        </div>
                    </AccordionHeader>
                    <AccordionBody accordionId="selfFeedback">
                        <StudentQuestions
                            questions={selfQuestions}
                            values={studentFeedbackFormik.values.selfResponses}
                            onChange={(i, v) => handleChange("selfResponses", i, v)}
                            isViewMode={isViewMode}
                            prefix="self"
                        />
                    </AccordionBody>
                </AccordionItem>
                <AccordionItem>
                    <AccordionHeader tag="h5" targetId="peer1Feedback">
                        <div className="d-flex align-items-center">
                            <HugeiconsIcon
                                icon={FavouriteIcon}
                                size={22}
                                className="me-2"
                                style={{ color: "#D97705" }}
                            />
                            <div className="fw-bold">Peer-1 Feedback</div>
                        </div>
                    </AccordionHeader>
                    <AccordionBody accordionId="peer1Feedback">
                        <div className="row !tw-p-4">
                            <div className="col-12 col-md-6">
                                <TextInput
                                    name="myName1"
                                    labelText="My Name"
                                    value={studentFeedbackFormik.values.myName1}
                                    onChange={studentFeedbackFormik.handleChange}
                                    placeHolder="Enter your name"
                                    isDisabled={isViewMode}
                                    maxLength={30}
                                />
                            </div>
                            <div className="col-12 col-md-6">
                                <TextInput
                                    name="myFriendName1"
                                    labelText="My Friend's Name"
                                    value={studentFeedbackFormik.values.myFriendName1}
                                    onChange={studentFeedbackFormik.handleChange}
                                    placeHolder="Enter friend's name"
                                    isDisabled={isViewMode}
                                    maxLength={30}
                                />
                            </div>
                        </div>
                        <StudentQuestions
                            questions={peerQuestions}
                            values={studentFeedbackFormik.values.peer1Responses}
                            onChange={(i, v) => handleChange("peer1Responses", i, v)}
                            isViewMode={isViewMode}
                            prefix="peer1"
                        />
                    </AccordionBody>
                </AccordionItem>
                <AccordionItem>
                    <AccordionHeader tag="h5" targetId="peer2Feedback">
                        <div className="d-flex align-items-center">
                            <HugeiconsIcon
                                icon={FavouriteIcon}
                                size={22}
                                className="me-2"
                                style={{ color: "#D97705" }}
                            />
                            <div className="fw-bold">Peer-2 Feedback</div>
                        </div>
                    </AccordionHeader>
                    <AccordionBody accordionId="peer2Feedback">
                        <div className="row !tw-p-4">
                            <div className="col-12 col-md-6">
                                <TextInput
                                    name="myName2"
                                    labelText="My Name"
                                    value={studentFeedbackFormik.values.myName2}
                                    onChange={studentFeedbackFormik.handleChange}
                                    placeHolder="Enter your name"
                                    isDisabled={isViewMode}
                                    maxLength={30}
                                />
                            </div>
                            <div className="col-12 col-md-6">
                                <TextInput
                                    name="myFriendName2"
                                    labelText="My Friend's Name"
                                    value={studentFeedbackFormik.values.myFriendName2}
                                    onChange={studentFeedbackFormik.handleChange}
                                    placeHolder="Enter friend's name"
                                    isDisabled={isViewMode}
                                    maxLength={30}
                                />
                            </div>
                        </div>
                        <StudentQuestions
                            questions={peerQuestions}
                            values={studentFeedbackFormik.values.peer2Responses}
                            onChange={(i, v) => handleChange("peer2Responses", i, v)}
                            isViewMode={isViewMode}
                            prefix="peer2"
                        />
                    </AccordionBody>
                </AccordionItem>
            </UncontrolledAccordion>
            {!isViewMode && (
                <div className="row mt-4 px-3">
                    <div className="col-12 d-flex justify-content-between">
                        <button
                            type="button"
                            className="btn btn-outline-primary fs-12 px-4 py-2"
                            onClick={handlePrevious}
                            style={{ borderRadius: "8px" }}
                        >
                            <HugeiconsIcon
                                icon={CircleArrowLeft01Icon}
                                size={20}
                                color="currentColor"
                                className="!tw-mr-1"
                            />
                            Previous Step
                        </button>
                        <button 
                            type="button" 
                            className="btn btn-success px-4 py-2" 
                            onClick={handleNext} 
                            style={{ borderRadius: "8px" }}
                        >
                            Next Step
                            <HugeiconsIcon
                                icon={CircleArrowRight01Icon}
                                size={20}
                                color="currentColor"
                                className="!tw-ml-1"
                            />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default StudentFeedback;