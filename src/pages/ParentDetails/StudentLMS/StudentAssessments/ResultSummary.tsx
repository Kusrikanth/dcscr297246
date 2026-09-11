import studentDummyImg from "../../../../assets/imagesdps/student-default-img.png";
import { useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { getDdMmYyyyWithMonthNameFormat } from "../../../../utility/dateutility";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon, CheckmarkCircle02Icon, NextIcon, Tick01Icon } from "@hugeicons-pro/core-stroke-standard";
import ReactApexChart from "react-apexcharts";

const ResultSummary = (props: any) => {

    const { showApiLoader, getAssessmentSummaryResultDetailsAct, getAssessmentQuestionDetailsAct } = useAppSelector(
        ({ studentAssessments, globalData, }) => ({
            showApiLoader: globalData.showApiLoader,
            getAssessmentSummaryResultDetailsAct: studentAssessments.getAssessmentSummaryResultDetailsAct,
            getAssessmentQuestionDetailsAct: studentAssessments.getAssessmentQuestionDetailsAct,
        }),
        shallowEqual
    );

const summaryMap: Record<number, any> = {};

getAssessmentQuestionDetailsAct?.resultSummaryQuestions?.forEach((q) => {
  summaryMap[q.questionId] = q;
});


    const submittedDate = getAssessmentSummaryResultDetailsAct?.submittedDate
        ? new Date(getAssessmentSummaryResultDetailsAct.submittedDate)
        : null;

    const timefunction = (utcDateString?: string) => {
        if (!utcDateString) return "-";
        const safeDateString =
            utcDateString.length > 23 ? utcDateString.slice(0, 23) : utcDateString;
        const date = new Date(safeDateString + "Z");

        if (isNaN(date.getTime())) return "-";

        return new Intl.DateTimeFormat("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        })
            .format(date)
            .replace(",", " /");
    };

    const ScoreChart = ({ getAssessmentSummaryResultDetailsAct }) => {
        const scoredMarks = getAssessmentSummaryResultDetailsAct?.resultSummary?.totalScore ?? 0;
        const condectedMarks = getAssessmentSummaryResultDetailsAct?.resultSummary?.totalQuestionMarks ?? 0;
        const percentage =
            condectedMarks > 0 ? (scoredMarks / condectedMarks) * 100 : 0;

        const options: ApexCharts.ApexOptions = {
            chart: {
                type: "radialBar",
                sparkline: { enabled: true },
            },
            plotOptions: {
                radialBar: {
                    hollow: {
                        size: "60%",
                    },
                    track: {
                        background: "#E6E6E6",
                    },
                    dataLabels: {
                        name: {
                            show: false,
                        },
                        value: {
                            show: false,
                        },
                    },
                },
            },
            colors: ["#FF6600"],
            stroke: {
                lineCap: "round",
            },
        };

        const series = [percentage];

        return (
            <div className="card shadow-none !tw-border !tw-rounded-lg tw-overflow-hidden mb-0">
                <div className="card-header tw-flex tw-items-center">
                    <h4 className="card-title mb-0 me-3">Score Summary</h4>
                </div>
                <div className="card-body tw-flex tw-items-center tw-flex-col">
                    <div className="row tw-flex tw-items-end tw-w-full tw-mb-3">
                        <div className="col-4 tw-flex tw-items-center tw-flex-col">
                            <div className="tw-relative tw-w-full tw-h-20 tw-flex tw-items-center tw-justify-center tw-mb-2">
                                <ReactApexChart
                                    options={options}
                                    series={series}
                                    type="radialBar"
                                    height={108}
                                />
                                <div className="tw-absolute tw-text-center">
                                    <p className="tw-font-bold tw-text-base mb-0">
                                        {scoredMarks}/{condectedMarks}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-8">
                            <div className="tw-flex tw-items-center mb-1 tw-w-full tw-gap-y-2">
                                <div className="tw-text-gray-500 tw-me-1 tw-text-xs tw-w-[50%]">
                                    Accuracy
                                </div>
                                <div className="tw-w-[50%] tw-text-xs">: {percentage.toFixed(1)}%</div>
                            </div>
                            <div className="tw-flex tw-items-center mb-1 tw-w-full">
                                <div className="tw-text-gray-500 tw-me-1 tw-text-xs tw-w-[50%]">
                                    Status
                                </div>
                                <div className="tw-w-[50%] tw-text-xs">: <div
                                    className={`tw-inline-flex tw-mt-1 tw-rounded-md tw-px-2 tw-py-1 tw-text-xs tw-mb-2 ${getAssessmentSummaryResultDetailsAct?.resultSummary?.resultStatus === "PASS"
                                            ? "tw-text-green-700 tw-border tw-border-green-400 tw-bg-green-100"
                                            : "tw-text-red-700 tw-border tw-border-red-400 tw-bg-red-100"
                                        }`}
                                >
                                    {getAssessmentSummaryResultDetailsAct?.resultSummary?.resultStatus}
                                </div></div>
                            </div>
                            <div className="tw-flex tw-items-center mb-1 tw-w-full">
                                <div className="tw-text-gray-500 tw-me-1 tw-text-xs tw-w-[50%]">
                                    Grade
                                </div>
                                <div className="tw-w-[50%] tw-text-xs">
                                  :  {getAssessmentSummaryResultDetailsAct?.resultSummary?.grade}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const ScoreSummary = ({ getAssessmentSummaryResultDetailsAct }) => {
        const summary = getAssessmentSummaryResultDetailsAct?.resultSummary ?? {};
        const difficultyLevels = getAssessmentSummaryResultDetailsAct?.difficultyLevels ?? [];

        const attempted = summary.totalAttempted ?? 0;
        const correct = summary.totalCorrect ?? 0;
        const incorrect = summary.totalIncorrect ?? 0;
        const unattempted = summary.totalUnattempted ?? 0;

        const totalDifficultyQuestions = difficultyLevels.reduce(
            (sum: any, d: any) => sum + (d.totalQuestionsCount ?? 0),
            0
        );

        const difficultyPercents = difficultyLevels.map((d) => ({
            ...d,
            percent:
                totalDifficultyQuestions > 0
                    ? (d.totalQuestionsCount / totalDifficultyQuestions) * 100
                    : 0,
        }));

        const getColor = (shortName: string) => {
            switch (shortName) {
                case "E1": return "tw-bg-green-500";
                case "M1": return "tw-bg-yellow-500";
                case "H1": return "tw-bg-red-500";
                default: return "tw-bg-gray-400";
            }
        };

        return (
            <div className="card !tw-rounded-lg !tw-border shadow-none tw-w-full tw-max-w-full tw-overflow-hidden mb-0">
                <div className="card-header">
                    <h4 className="card-title mb-0">Performance Overview</h4>
                </div>

                <div className="card-body">
                    <div className="tw-flex tw-flex-col tw-items-center">
                        <div className="tw-grid tw-grid-cols-2 xl:tw-grid-cols-[repeat(4,_1fr)] tw-gap-3 tw-mb-4 tw-w-full">
                            <SummaryCard
                                label="Attempted"
                                value={attempted}
                                icon={CheckmarkCircle02Icon}
                                color="tw-text-yellow-500"
                            />
                            <SummaryCard
                                label="Correct"
                                value={correct}
                                icon={Tick01Icon}
                                color="tw-text-green-500"
                            />
                            <SummaryCard
                                label="Incorrect"
                                value={incorrect}
                                icon={Cancel01Icon}
                                color="tw-text-red-500"
                            />
                            <SummaryCard
                                label="Unattempted"
                                value={unattempted}
                                icon={NextIcon}
                                color="tw-text-gray-500"
                            />
                        </div>
                        <div className="tw-w-full">
                            <div className="tw-flex tw-items-center tw-mb-4">
                                <p className="tw-mb-0 tw-font-semibold tw-me-4">
                                    FeedBack : <span className="text-muted"> {getAssessmentSummaryResultDetailsAct?.feedback}</span>
                                </p>
                            </div>
                            <div className="tw-flex tw-items-center tw-mb-4">
                                <p className="tw-mb-0 tw-font-semibold tw-me-4">
                                    Difficulty Level Analysis
                                </p>
                            </div>
                            <div className="tw-flex tw-items-center tw-w-full tw-mb-2">
                                <div className="tw-flex tw-h-3 tw-w-full tw-bg-gray-200 tw-rounded-full tw-overflow-hidden">
                                    {difficultyPercents.map((d) => (
                                        <div
                                            key={d.difficultyLevelId}
                                            className={`${getColor(
                                                d.difficultyLevelShortName
                                            )} tw-h-full`}
                                            style={{ width: `${d.percent}%` }}
                                            aria-label={`${d.difficultyLevelName} difficulty ${d.percent.toFixed(0)}%`}
                                        ></div>
                                    ))}
                                </div>
                            </div>
                            <div className="tw-flex tw-gap-6 tw-flex-wrap">
                                {difficultyLevels.map((d) => (
                                    <p
                                        key={d.difficultyLevelId}
                                        className="tw-mb-0 tw-flex tw-items-center"
                                    >
                                        <div
                                            className={`tw-h-3 tw-w-3 tw-rounded ${getColor(
                                                d.difficultyLevelShortName
                                            )} tw-flex-shrink-0 tw-me-2`}
                                        ></div>
                                        <span className="tw-me-2">{d.difficultyLevelName} </span>
                                        <span>
                                            : {d.totalCorrect}/{d.totalQuestionsCount}
                                        </span>
                                    </p>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const SummaryCard = ({ label, value, icon, color }) => (
        <div className="tw-border tw-rounded-lg tw-px-2 tw-py-2">
            <div className="tw-flex tw-items-center">
                <div className="tw-flex-1">
                    <p className="mb-0 tw-text-gray-500 tw-flex tw-items-center">
                        <HugeiconsIcon icon={icon} className={`tw-me-2 ${color}`} size={18} />
                        {label}
                    </p>
                    <p className="mb-0 tw-font-bold tw-text-lg tw-text-right">{value}</p>
                </div>
            </div>
        </div>
    );

    return (
        <div className="modal-body p-0">
            <div className="row w-100 mx-auto tw-px-4 tw-py-6 g-3">
                <div className="col-12 col-xl-6 tw-grid">
                    <div className="tw-flex tw-items-center tw-border tw-rounded-lg tw-px-4 tw-py-3">
                        <div className="tw-me-3">
                            <img
                                src={studentDummyImg}
                                alt="student image"
                                className="tw-w-12 tw-h-12 tw-shrink-0"
                            ></img>
                        </div>
                        <div className="">
                            <p className="tw-mb-1">  {getAssessmentSummaryResultDetailsAct?.studentName}</p>
                            <ul className="tw-flex tw-ps-0 tw-gap-x-2 tw-mb-0 tw-text-gray-500 tw-text-xs tw-items-center">
                                <li className="first:tw-list-none">
                                    <span className="tw-px-2 tw-py-0.5 tw-rounded tw-bg-slate-200 tw-text-xs tw-border tw-border-slate-500 tw-text-slate-500">
                                        {getAssessmentSummaryResultDetailsAct?.studentCode}
                                    </span>
                                </li>
                                <li className="tw-list-disc tw-ms-4">
                                    <span className="tw-me-1">Class :</span>
                                    <span>  {getAssessmentSummaryResultDetailsAct?.className} - {getAssessmentSummaryResultDetailsAct?.sectionName}</span>
                                </li>
                                <li className="tw-list-disc tw-ms-4">
                                    <span className="tw-me-1">Roll No :</span>
                                    <span>  {getAssessmentSummaryResultDetailsAct?.rollNo}</span>
                                </li>
                                <li className="tw-list-disc tw-ms-4">
                                    <span className="tw-me-1">Rank :</span>
                                    <span className="tw-me-1">  {getAssessmentSummaryResultDetailsAct?.resultSummary?.position}</span>
                                    <span className="tw-text-[18px]">🏅</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-xl-6 tw-grid">
                    <div className="tw-flex tw-items-center tw-border tw-rounded-lg tw-px-4 tw-py-3">
                        <div className="">
                            <div className="tw-mb-0 tw-flex tw-items-center">
                                <p className="tw-mb-1 tw-text-lg tw-font-semibold tw-me-3">
                                    {getAssessmentSummaryResultDetailsAct?.assessmentName}
                                </p>
                                <span className="tw-px-2 tw-py-0.5 tw-rounded tw-bg-slate-200 tw-text-xs tw-text-slate-500">
                                    {getAssessmentSummaryResultDetailsAct?.assessmentType}
                                </span>
                            </div>
                            <ul className="tw-flex tw-ps-0 tw-gap-x-2 tw-mb-0 tw-text-gray-500 tw-text-xs">
                                <li>{getAssessmentSummaryResultDetailsAct?.assessmentCode?.trim() ? getAssessmentSummaryResultDetailsAct.assessmentCode : "-"}</li>
                                <li className="tw-list-disc tw-ms-4">
                                    <span>{getAssessmentSummaryResultDetailsAct?.subjectName}</span>
                                </li>
                                <li className="tw-list-disc tw-ms-4">
                                    <span>{getAssessmentSummaryResultDetailsAct?.resultSummary?.totalQuestionCount ?? "0"} Q</span>
                                </li>
                                <li className="tw-list-disc tw-ms-4">
                                    <span>{getAssessmentSummaryResultDetailsAct?.resultSummary?.totalQuestionMarks ?? "0"} Marks</span>
                                </li>
                                <li className="tw-list-disc tw-ms-4">
                                    <span>{getDdMmYyyyWithMonthNameFormat(getAssessmentSummaryResultDetailsAct?.assessmentDate)}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-xl-6 tw-grid">
                    <ScoreChart getAssessmentSummaryResultDetailsAct={getAssessmentSummaryResultDetailsAct} />
                </div>
                <div className="col-12 col-xl-6 tw-grid">
                    <div className="card shadow-none !tw-border !tw-rounded-lg tw-overflow-hidden mb-0">
                        <div className="card-header tw-flex tw-items-center">
                            <h4 className="card-title mb-0 me-3">Attempt Summary</h4>
                        </div>
                        <div className="card-body tw-flex tw-items-center tw-flex-col">
                            <div className="row tw-flex tw-items-end tw-w-full">
                                <div className="col-8">
                                    <div className="tw-flex tw-items-center mb-3 tw-w-full tw-gap-y-2">
                                        <div className="tw-text-gray-500 tw-me-1 tw-text-xs tw-w-[50%]">
                                            Attempt No
                                        </div>
                                        <div className="tw-w-[50%] tw-text-xs">: {getAssessmentSummaryResultDetailsAct?.attemptId ?? "-"}</div>
                                    </div>
                                    <div className="tw-flex tw-items-center mb-3 tw-w-full">
                                        <div className="tw-text-gray-500 tw-me-1 tw-text-xs tw-w-[50%]">
                                            Attempt Code
                                        </div>
                                        <div className="tw-w-[50%] tw-text-xs">: {getAssessmentSummaryResultDetailsAct?.attemptCode ?? "-"}</div>
                                    </div>
                                    <div className="tw-flex tw-items-center mb-3 tw-w-full">
                                        <div className="tw-text-gray-500 tw-me-1 tw-text-xs tw-w-[50%]">
                                            Submitted At
                                        </div>
                                        <div className="tw-w-[50%] tw-text-xs">
                                            <span className="d-block">: {timefunction(getAssessmentSummaryResultDetailsAct?.submittedDate)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 tw-grid">
                    <ScoreSummary getAssessmentSummaryResultDetailsAct={getAssessmentSummaryResultDetailsAct} />
                </div>
            </div>
        </div>
    );
};

export default ResultSummary;
