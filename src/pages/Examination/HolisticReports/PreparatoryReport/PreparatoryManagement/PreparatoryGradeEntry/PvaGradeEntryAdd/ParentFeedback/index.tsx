import React, { useContext, useEffect, useMemo } from "react";
import { UncontrolledAccordion, AccordionBody, AccordionHeader, AccordionItem } from "reactstrap";
import { StepperFormContext } from "../helper";
import { HugeiconsIcon } from "@hugeicons/react";
import { CircleArrowRight01Icon, CircleArrowLeft01Icon, IdentityCardIcon, SmileIcon, NeutralIcon, Sad01Icon, HelpSquareIcon, BookOpen02Icon, ComputerIcon, Megaphone01Icon, EarthIcon, GameController03Icon, News01Icon } from "@hugeicons-pro/core-stroke-standard";
import { useFormik } from "formik";
import { CustomTooltip, InputCheckbox, TextArea, TextInput } from "../../../../../../../../Components/Common";
import TableContainer from "../../../../../../../../Components/Common/TableContainer";
import { useAppDispatch, useAppSelector } from "../../../../../../../../hooks/storehook";
import { generateActionPayload } from "../../../../../../../../utility/reduxutility";
import { getPreparatoryGradeEntryListByIdAct, savePreparatoryParentFeedbackAct } from "../../../../../../../../store/examination/examinationsettings/examinationsettingsaction";
import { shallowEqual } from "react-redux";

const initialValues = {
    myFriendName: "",
    selfResponses: {},
    peer1Responses: {},
    peer2Responses: {},
    books_magazines: false,
    newspapers: false,
    toys_games_sports: false,
    phone_computer: false,
    internet: false,
    broadcast: false,
    cwsn_resources: false,
    oralCommunication: false,
    reading: false,
    numbersMath: false,
    selfConfidence: false,
    workingWithOtherChildren: false,
    workingIndependently: false,
    otherSubject: false,
    specifyOther: "",
};

const ParentQuestions = ({
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

const ParentFeedback = (props: any) => {
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
        savePreparatoryParentFeedbackResp
    } = useAppSelector(
        ({ examinationManagement, examinationSettings }) => ({
            uploadFamilySurroundingPhotoResp: examinationManagement.uploadFamilySurroundingPhotoResp,
            savePreparatoryGradeEntryListResp: examinationSettings.savePreparatoryGradeEntryListResp,
            getPreparatoryGradeEntryListByIdResp: examinationSettings.getPreparatoryGradeEntryListByIdResp,
            savePreparatoryStudentSurroundingResp: examinationSettings.savePreparatoryStudentSurroundingResp,
            savePreparatoryStudentFeedbackResp: examinationSettings.savePreparatoryStudentFeedbackResp,
            savePreparatoryParentFeedbackResp: examinationSettings.savePreparatoryParentFeedbackResp

        }),
        shallowEqual
    );

    const parentFeedbackFormik = useFormik({
        initialValues,
        onSubmit: () => { },
    });

    const handleChange = (section: string, index: number, value: string) => {
        parentFeedbackFormik.setFieldValue(`${section}.${index}`, value);
    };

    useEffect(() => {
        if(getPreparatoryGradeEntryListByIdResp) {
            
            const { childFeedback, childNeedSupport, studentHomeResources } = getPreparatoryGradeEntryListByIdResp;
        
            const childFeedbackMapping = [
                'welcomingSafeSpace',
                'participatesActivities',
                'curriculumDifficult',
                'goodProgress',
                'schoolSupport',
                'childFeelingsExpression',
                'childSelfCalming',
                'childEmpathy',
                'childRespectOpinions',
                'childConflictResolution',
                'childComfortOthers'
            ];
        
            const selfResponsesPrefill: any = {};
            childFeedbackMapping.forEach((key, index) => {
                selfResponsesPrefill[index] = childFeedback?.[key] || "";
            });
        
            const home = studentHomeResources;
        
            const homeResourcesPrefill = {
                books_magazines: home?.booksMagazines === "true",
                newspapers: home?.newspapers === "true",
                toys_games_sports: home?.toysGamesSports === "true",
                phone_computer: home?.phoneComputer === "true",
                internet: home?.internet === "true",
                broadcast: home?.publicBroadcastSystem === "true",
                cwsn_resources: home?.resourcesForCwsn === "true",
                myFriendName: home?.otherResource === "true" ? home.otherResourceSpecify : "",
            };
        
            const support = childNeedSupport;
        
            const supportPrefill = {
                oralCommunication: support?.oralCommunication || false,
                reading: support?.reading || false,
                numbersMath: support?.numbersMath || false,
                selfConfidence: support?.selfConfidence || false,
                workingWithOtherChildren: support?.workingWithChildren || false,
                workingIndependently: support?.workingIndependently || false,
                otherSubject: support?.otherSubject || false,
                specifyOther: support?.otherSubject ? support?.otherSubjectSpecify || "" : "",
            };
        
            parentFeedbackFormik.setValues({
                ...parentFeedbackFormik.values,
                selfResponses: selfResponsesPrefill,
                ...homeResourcesPrefill,
                ...supportPrefill,
            });
        }

}, [getPreparatoryGradeEntryListByIdResp]);


    const transformToApiPayload = (values: typeof initialValues) => {

        const childFeedbackMapping = [
            'welcomingSafeSpace',
            'participatesActivities',
            'curriculumDifficult',
            'goodProgress',
            'schoolSupport',
            'childFeelingsExpression',
            'childSelfCalming',
            'childEmpathy',
            'childRespectOpinions',
            'childConflictResolution',
            'childComfortOthers'
        ];

        const childFeedback: any = {};
        childFeedbackMapping.forEach((key, index) => {
            childFeedback[key] = values.selfResponses[index] || "notSure";
        });

        return {
            studentHomeResources: {
                booksMagazines: String(values.books_magazines),
                newspapers: String(values.newspapers),
                toysGamesSports: String(values.toys_games_sports),
                phoneComputer: String(values.phone_computer),
                internet: String(values.internet),
                publicBroadcastSystem: String(values.broadcast),
                resourcesForCwsn: String(values.cwsn_resources),
                otherResource: String(!!values.myFriendName),
                otherResourceSpecify: values.myFriendName || ""
            },
            childFeedback,
            childNeedSupport: {
                oralCommunication: values.oralCommunication,
                reading: values.reading,
                numbersMath: values.numbersMath,
                selfConfidence: values.selfConfidence,
                workingWithChildren: values.workingWithOtherChildren,
                workingIndependently: values.workingIndependently,
                otherSubject: values.otherSubject,
                otherSubjectSpecify: values.otherSubject  ? values.specifyOther : ""
            }
        };
    };


    const handleNext = async () => {
        try {
            const payload: any = transformToApiPayload(parentFeedbackFormik.values);
            if (savePreparatoryParentFeedbackResp?.data || getPreparatoryGradeEntryListByIdResp?.studentPartAParentFeedBackId) {
                payload.studentPartAParentFeedBackId = savePreparatoryParentFeedbackResp?.data || getPreparatoryGradeEntryListByIdResp?.studentPartAParentFeedBackId
            }
            dispatch(savePreparatoryParentFeedbackAct(generateActionPayload("save_preparatory_parent_feedback", { id: savePreparatoryGradeEntryListResp?.data || entryId }, payload)));
            submitCurrentFormCllbck([], "NEXT_TAB");
            nextStepHndlr(stepId, parentFeedbackFormik.values);
        } catch (error) {
            console.error("Failed to submit feedback:", error);
        }
    };
    useEffect(() => {
                if (savePreparatoryGradeEntryListResp?.data || entryId) {
                    dispatch(getPreparatoryGradeEntryListByIdAct(generateActionPayload("get_preparatory_grade_entry_by_id", { id: savePreparatoryGradeEntryListResp?.data || entryId }, undefined)));
                }
            }, [entryId, savePreparatoryGradeEntryListResp]);

    const handlePrevious = () => {
        submitCurrentFormCllbck([], "PREVIOUS_TAB");
        nextStepHndlr(stepId, parentFeedbackFormik.values);
    };

    const selfQuestions = [
        "My child finds the classroom and school a welcoming and safe space.",
        "My child participates in academic and other activities in school.",
        "My child finds the grade-level curriculum difficult.",
        "My child is making good progress as per their grade.",
        "My child is getting the support needed from school.",
        "My child can talk about how he/she feels, e.g., happy, upset, or angry.",
        "My child can calm himself/herself down during difficult situations.",
        "My child can understand how his/her friends feel.",
        "My child respects everyone's opinions.",
        "My child can help his/her friends make up after a fight.",
        "When someone is sad, my child can make them feel better.",
    ];

    const resources = [
        {
            id: "books_magazines",
            label: "Books & Magazines",
            icon: BookOpen02Icon,
            color: "#0A84FF",
        },
        { id: "newspapers", label: "Newspapers", icon: News01Icon, color: "#FF9500" },
        {
            id: "toys_games_sports",
            label: "Toys, Games & Sports",
            icon: GameController03Icon,
            color: "#34C759",
        },
        {
            id: "phone_computer",
            label: "Phone & Computer",
            icon: ComputerIcon,
            color: "#5856D6",
        },
        { id: "internet", label: "Internet", icon: EarthIcon, color: "#007AFF" },
        {
            id: "broadcast",
            label: "Public Broadcast System",
            icon: Megaphone01Icon,
            color: "#FF3B30",
        },
        {
            id: "cwsn_resources",
            label: "Resources for CWSN",
            icon: BookOpen02Icon,
            color: "#AF52DE",
        },
    ];

    return (
        <>
            <div className="!tw-px-4">
                <div className="row !tw-border-dotted !tw-border-2 !tw-border-gray-300 !tw-rounded-lg !tw-p-4 !tw-pt-5 !tw-mb-5">
                    <div className="col-12">
                        <span className="form-label tw-font-semibold tw-text-gray-800">
                            Tick the Resources available to your child at home.
                        </span>
                    </div>
                    <div className="col-12">
                        <div className="tw-grid tw-grid-cols-2 md:tw-grid-cols-4 lg:tw-grid-cols-7 tw-gap-6 tw-text-center tw-mt-4">
                            {resources.map((item) => {
                                const isSelected = parentFeedbackFormik.values[item.id];
                                return (
                                    <div
                                        key={item.id}
                                        className="tw-flex tw-flex-col tw-items-center tw-justify-between tw-gap-2 tw-h-[150px]"
                                    >
                                        <div
                                            className={`tw-flex tw-items-center tw-justify-center tw-w-[70px] tw-h-[70px] tw-rounded-xl tw-bg-white tw-border tw-shadow-sm tw-cursor-pointer hover:tw-bg-orange-50 tw-transition`}
                                            style={{
                                                borderColor: isSelected ? item.color : "#D1D5DB",
                                                boxShadow: isSelected
                                                    ? `0 0 3px 1px ${item.color}50`
                                                    : "0 1px 2px rgba(0,0,0,0.05)",
                                                backgroundColor: isSelected ? `${item.color}10` : "white",
                                            }}
                                            onClick={() =>
                                                parentFeedbackFormik.setFieldValue(item.id, !isSelected)
                                            }
                                        >
                                            <HugeiconsIcon
                                                icon={item.icon}
                                                size={38}
                                                style={{
                                                    color: isSelected ? item.color : "#9CA3AF",
                                                }}
                                            />
                                        </div>
                                        <label className="tw-text-xs tw-font-semibold tw-text-gray-700 tw-w-[95px] tw-leading-tight tw-min-h-[32px] tw-flex tw-items-center tw-justify-center">
                                            {item.label}
                                        </label>
                                        <div className="tw-h-[20px] tw-flex tw-items-center">
                                            <InputCheckbox
                                                name={item.id}
                                                value={isSelected || false}
                                                onChange={(e: any) =>
                                                    parentFeedbackFormik.setFieldValue(item.id, e.target.checked)
                                                }
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className="col-12 mt-4">
                        <TextArea
                            name="myFriendName"
                            labelText="Any other (Please specify):"
                            value={parentFeedbackFormik.values.myFriendName}
                            onChange={parentFeedbackFormik.handleChange}
                            placeHolder="Enter your details"
                            isDisabled={isViewMode}
                            maxLength={200}
                        />
                    </div>
                </div>
            </div>
            <UncontrolledAccordion
                open="selfFeedback"
                defaultOpen={["selfFeedback", "childNeedSupport"]}
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
                            <div className="fw-bold">How can i know your child better</div>
                        </div>
                    </AccordionHeader>
                    <AccordionBody accordionId="selfFeedback">
                        <ParentQuestions
                            questions={selfQuestions}
                            values={parentFeedbackFormik.values.selfResponses}
                            onChange={(i, v) => handleChange("selfResponses", i, v)}
                            isViewMode={isViewMode}
                            prefix="self"
                        />
                    </AccordionBody>
                </AccordionItem>
                <AccordionItem>
                    <AccordionHeader tag="h5" targetId="childNeedSupport">
                        <div className="d-flex align-items-center">
                            <HugeiconsIcon
                                icon={IdentityCardIcon}
                                size={22}
                                className="me-2"
                                style={{ color: "#0ab39c" }}
                            />
                            <div className="fw-bold">My Child needs support with...</div>
                        </div>
                    </AccordionHeader>
                    <AccordionBody accordionId="childNeedSupport">
                        <div className="!tw-border-dotted !tw-border-2 !tw-border-gray-300 !tw-rounded-lg !tw-p-4 !tw-pt-5">
                            <div className="row tw-text-sm tw-text-gray-800 tw-font-medium">
                                <div className="col-12 col-md-6 tw-space-y-3">
                                    {[
                                        { name: "oralCommunication", label: "Oral communication (R1 or R2)" },
                                        { name: "reading", label: "Reading" },
                                        { name: "numbersMath", label: "Numbers and Math" },
                                        { name: "selfConfidence", label: "Self-confidence" },
                                    ].map((item) => (
                                        <div className="tw-flex tw-items-center tw-gap-2" key={item.name}>
                                            <InputCheckbox
                                                name={item.name}
                                                value={parentFeedbackFormik.values[item.name] || false}
                                                onChange={(e: any) =>
                                                    parentFeedbackFormik.setFieldValue(item.name, e.target.checked)
                                                }
                                            />
                                            <span>{item.label}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="col-12 col-md-6 tw-space-y-3">
                                    {[
                                        { name: "workingWithOtherChildren", label: "Working with other children" },
                                        { name: "workingIndependently", label: "Working independently at home" },
                                        { name: "otherSubject", label: "Other subject areas" },
                                    ].map((item) => (
                                        <div
                                            className="tw-flex tw-items-start tw-gap-2"
                                            key={item.name}
                                        >
                                            <InputCheckbox
                                                name={item.name}
                                                value={parentFeedbackFormik.values[item.name] || false}
                                                onChange={(e: any) =>
                                                    parentFeedbackFormik.setFieldValue(item.name, e.target.checked)
                                                }
                                            />
                                            <div className="tw-flex-1">
                                                <span>{item.label}</span>
                                                {item.name === "otherSubject" && parentFeedbackFormik.values.otherSubject && (
                                                    <div className="tw-mt-2">
                                                        <TextInput
                                                            name="specifyOther"
                                                            placeHolder="Specify..."
                                                            value={parentFeedbackFormik.values.specifyOther}
                                                            onChange={parentFeedbackFormik.handleChange}
                                                            isDisabled={isViewMode}
                                                            maxLength={30}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
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

export default ParentFeedback;