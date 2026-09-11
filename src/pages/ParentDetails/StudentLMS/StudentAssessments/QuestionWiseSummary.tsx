import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon, MinusSignIcon, Tick01Icon, } from "@hugeicons-pro/core-stroke-standard";
import { useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { AccordionBody, AccordionHeader, AccordionItem, Accordion, } from "reactstrap";
import { useState } from "react";
import { MathPreview } from "../../../../Components/Common";

const QuestionWiseSummary = (props: any) => {

    const { showApiLoader, getAssessmentQuestionDetailsAct } = useAppSelector(
        ({ studentAssessments, globalData, }) => ({
            showApiLoader: globalData.showApiLoader,
            getAssessmentQuestionDetailsAct: studentAssessments.getAssessmentQuestionDetailsAct,
        }),
        shallowEqual
    );

    const {
        resultSummary = null,
        resultSummaryQuestions = [],
    } = getAssessmentQuestionDetailsAct || {};

    const totalQuestions = resultSummary?.totalQuestionCount ?? resultSummaryQuestions.length;

    const questionMap: Record<number, any> = {};
    resultSummaryQuestions.forEach((q: any, idx: any) => {
        questionMap[idx + 1] = q;
    });

    const [openQuestionId, setOpenQuestionId] = useState<string | undefined>("");

    const toggleAccordion = (id: string) => {
        setOpenQuestionId((prev) => (prev === id ? undefined : id));
    };

    const summaryMap: Record<number, any> = {};
    (resultSummaryQuestions || []).forEach((q) => {
        summaryMap[q.questionId] = q;
    });

    const questions = (getAssessmentQuestionDetailsAct?.questionDetails || [])
        .map((q: any, index: number) => {
            const summary = summaryMap[q.id];
            return {
                id: String(q.id),
                questionNo: q.questionNo || index + 1,
                text: q.questionTitle,
                description: q.questionDescription,
                status: summary?.evaluationStatus || "UNATTEMPTED",
                answerStatus: summary?.answerStatus || "NOT_ANSWERED",
                chosenOptionId: summary?.selectedOptionId ? String(summary.selectedOptionId) : null,
                correctOptionId: String(
                    q.questionOptions.find((opt: any) => opt.isCorrectAnswer)?.optionId
                ),
                options: q.questionOptions.map((opt: any) => {
                    let parsed: any;
                    try {
                        parsed = opt.optionText ? JSON.parse(opt.optionText) : opt.text;
                    } catch {
                        parsed = { type: "text", content: opt.optionText || opt.text || "" };
                    }

                    return {
                        id: String(opt.optionId),
                        text: parsed,
                        isCorrect: opt.isCorrectAnswer,
                    };
                }),
                solution: q.textSolution || "No solution provided.",
                pointsEarned: summary?.score || 0,
                pointsTotal: q.assessmentQuestionMarks || 0,
            };
        })
        .sort((a: any, b: any) => a.questionNo - b.questionNo);

    const { correctCount, wrongCount, partiallyCorrectCount, unattemptedCount } =
        questions.reduce(
            (acc, q) => {
                if (q.answerStatus !== "ANSWERED") {
                    acc.unattemptedCount++;
                } else if (q.status === "CORRECT") {
                    acc.correctCount++;
                } else if (q.status === "INCORRECT") {
                    acc.wrongCount++;
                } else if (q.status === "PARTIALLY_CORRECT") {
                    acc.partiallyCorrectCount++;
                }
                return acc;
            },
            { correctCount: 0, wrongCount: 0, partiallyCorrectCount: 0, unattemptedCount: 0 }
        );


    return (
        <>
            <div className="col-12 col-lg-auto mx-auto p">
                <div className="card shadow-none !tw-border !tw-rounded-lg tw-overflow-hidden my-3 mx-4">
                    <div className="card-header tw-flex tw-items-center">
                        <h4 className="card-title mb-0 me-3">Questions Summary</h4>
                    </div>
                    <div className="card-body tw-flex tw-items-center tw-flex-col">
                        <div className="tw-grid tw-grid-cols-[repeat(8,_auto)] md:tw-grid-cols-[repeat(10,_auto)] lg:tw-grid-cols-[repeat(15,_auto)] tw-gap-2 tw-justify-center tw-mb-4">
                            {Array.from({ length: totalQuestions }, (_, i) => {
                                const num = i + 1;
                                const q = questions.find((qq) => qq.questionNo === num);

                                let borderClass: "correct-opt" | "wrong-opt" | "partial-opt" | "unattempted" = "unattempted";
                                if (q?.answerStatus === "ANSWERED") {
                                    if (q.status === "CORRECT") {
                                        borderClass = "correct-opt";
                                    } else if (q.status === "INCORRECT") {
                                        borderClass = "wrong-opt";
                                    } else if (q.status === "PARTIALLY_CORRECT") {
                                        borderClass = "partial-opt";
                                    }
                                }
                                return (
                                    <div key={num} className="tw-flex tw-items-center tw-justify-center">
                                        <div
                                            className={`tw-cursor-pointer tw-w-8 tw-h-8 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-relative
          ${borderClass === "correct-opt"
                                                    ? "tw-border-green-500 tw-border tw-bg-green-100 tw-text-green-700"
                                                    : borderClass === "wrong-opt"
                                                        ? "tw-border-red-500 tw-border tw-bg-red-100 tw-text-red-700"
                                                        : borderClass === "partial-opt"
                                                            ? "tw-border-yellow-500 tw-border tw-bg-yellow-100 tw-text-yellow-700"
                                                            : "tw-border tw-border-gray-400 tw-text-gray-700 tw-bg-gray-100"
                                                }`}
                                            onClick={() => {
                                                if (q) {
                                                    setOpenQuestionId((prev) =>
                                                        prev === q.id ? undefined : q.id
                                                    );
                                                }
                                            }}
                                        >
                                            <span
                                                className={`tw-flex tw-items-center tw-justify-center tw-absolute tw-bottom-0 tw-right-0 tw-w-4 tw-h-4 tw-inline-block tw-rounded-full tw-translate-x-[40%] tw-translate-y-[15%]
                                                        ${borderClass === "correct-opt"
                                ? "tw-border-green-500 tw-border tw-bg-[#e7f1f5]"
                                : borderClass === "wrong-opt"
                                  ? "tw-border-red-500 tw-border tw-bg-[#fef0ed]"
                                  : borderClass === "partial-opt"
                                                                ? "tw-border-yellow-500 tw-border tw-bg-[#fff8e1]"
                                                                : "tw-border tw-border-gray-400 tw-bg-gray-50 tw-hidden"
                                                    }`}
                                            >
                                                <HugeiconsIcon
                                                    icon={
                                                        borderClass === "correct-opt"
                                                            ? Tick01Icon
                                                            : borderClass === "wrong-opt"
                                                                ? Cancel01Icon
                                                                : borderClass === "partial-opt"
                                                                    ? MinusSignIcon
                                                                    : MinusSignIcon
                                                    }
                                                    className={
                                                        borderClass === "correct-opt"
                                                            ? "text-success"
                                                            : borderClass === "wrong-opt"
                                                                ? "text-danger"
                                                                : borderClass === "partial-opt"
                                                                    ? "text-warning"
                                                                    : ""
                                                    }
                                                    size={10}
                                                />
                                            </span>
                                            {num}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="tw-flex tw-gap-4 tw-justify-center tw-mb-3">
                            <span className="tw-flex tw-items-center tw-gap-1 tw-text-green-700">
                                ● Correct ({correctCount})
                            </span>
                            <span className="tw-flex tw-items-center tw-gap-1 tw-text-red-700">
                                ● Wrong ({wrongCount})
                            </span>
                            <span className="tw-flex tw-items-center tw-gap-1 tw-text-yellow-600">
                                ● Partially Correct ({partiallyCorrectCount})
                            </span>
                            <span className="tw-flex tw-items-center tw-gap-1 tw-text-gray-700">
                                ● Unattempted ({unattemptedCount})
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-12 col-lg-auto mx-4 rounded">
                <div className="tw-max-h-[400px] tw-overflow-y-auto tw-pr-2">
                    <Accordion open={openQuestionId} toggle={toggleAccordion} stayOpen>
                        {questions
                            .slice()
                            .sort((a, b) => a.questionNo - b.questionNo)
                            .map((q) => (
                                <AccordionItem key={q.id}>
                                    <AccordionHeader targetId={q.id}>
                                        <div className="d-flex justify-content-between align-items-center w-100 pe-4">
                                            <div className="tw-flex tw-items-center">
                                                <div
                                                    className={`tw-h-3 tw-w-3 tw-me-2 tw-rounded-full ${q.answerStatus === "NOT_ANSWERED"
                                                        ? "tw-bg-gray-400"
                                                        : q.status === "CORRECT"
                                                            ? "tw-bg-green-300"
                                                            : q.status === "PARTIALLY_CORRECT"
                                                                ? "tw-bg-yellow-400"
                                                                : "tw-bg-red-400"
                                                        }`}
                                                ></div>
                                                <p className="mb-0 fs-12">{`Q${q.questionNo}`}</p>
                                            </div>
                                            <div className="tw-text-xs tw-border tw-rounded tw-px-2 tw-py-0.5 tw-font-semibold">
                                                {`${q.pointsEarned} / ${q.pointsTotal}`}
                                            </div>
                                        </div>
                                    </AccordionHeader>
                                    <AccordionBody accordionId={q.id} className="p-0">
                                        <div className="">
                                            <p className="mb-2 d-flex jsutify-content-center align-items-center">
                                                <h5 className="mb-0 fs-14 ms-2">{q.description ? <MathPreview json={JSON.parse(q.description)} /> : ''}</h5>
                                            </p>
                                            <div className="mb-3">
                                                {q.options.map((opt, i) => {
                                                    const isChosen = opt.id === q.chosenOptionId;
                                                    const isCorrect = opt.isCorrect;

                                                    let borderClass = "border-gray-200";
                                                    let badgeClass = "border";
                                                    let icon: React.ReactNode = null;
                                                    let label: string | null = null;

                                                    if (isChosen && isCorrect) {
                                                        borderClass = "tw-bg-[rgba(10,179,156,0.15)] border-success";
                                                        badgeClass = "bg-success text-white";
                                                        icon = <HugeiconsIcon icon={Tick01Icon} className="text-success" size={16} />;
                                                        label = "Selected option is correct";
                                                    } else if (isChosen && !isCorrect) {
                                                        borderClass = "tw-bg-[rgba(240,101,72,0.15)] border-danger";
                                                        badgeClass = "bg-danger text-white";
                                                        icon = <HugeiconsIcon icon={Cancel01Icon} className="text-danger" size={16} />;
                                                        label = "Selected option";
                                                    } else if (!isChosen && isCorrect) {
                                                        borderClass = "tw-bg-[rgba(10,179,156,0.15)] border-success";
                                                        badgeClass = "bg-success text-white";
                                                        icon = <HugeiconsIcon icon={Tick01Icon} className="text-success" size={16} />;
                                                        label = "Correct option";
                                                    }
                                                    return (
                                                        <div
                                                            key={opt.id}
                                                            className={`p-2 rounded mb-2 d-flex align-items-center border-2 tw-justify-between ${borderClass}`}
                                                        >
                                                            <span className="flex-grow tw-flex"><span
                                                                className={`tw-rounded-full tw-me-2 tw-p-1 tw-w-6 tw-h-6 tw-flex tw-items-center tw-justify-center ${badgeClass}`}
                                                            >
                                                                {String.fromCharCode(65 + i)}
                                                            </span><MathPreview json={opt.text} /></span>
                                                            <div className="tw-flex tw-items-center tw-gap-2">
                                                                {icon}
                                                                {label && <span className="tw-text-xs tw-font-medium tw-text-gray-600">{label}</span>}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                            <div className="border rounded p-2 px-3 mt-2 fs-12" style={{ backgroundColor: 'rgb(255 162 0 / 10%)' }}>
                                                <div className="fw-bold">Solution:</div>
                                                <div>
                                                    {(() => {
                                                        try {
                                                            return <MathPreview json={JSON.parse(q?.solution)} />;
                                                        } catch {
                                                            return <span>{q?.solution || "-"}</span>;
                                                        }
                                                    })()}
                                                </div>
                                            </div>
                                        </div>
                                    </AccordionBody>
                                </AccordionItem>
                            ))}
                    </Accordion>
                </div>
            </div>
        </>
    );
};

export default QuestionWiseSummary;
