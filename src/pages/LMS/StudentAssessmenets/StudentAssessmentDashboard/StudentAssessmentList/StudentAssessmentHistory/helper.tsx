import React from "react";
import { MenuOptionHrtl, StatusLabel, UserDetails } from "../../../../../../Components/Common";
import { IOptionsHrtl } from "../../../../../../Components/Common/MenuOptions";
import { formatMinutesToDuration } from "../../../../../../utility/commonutility";
import { convertUTCToISTTimeOnly, getFormattedDateddMMMYYYY } from "../../../../../../utility/dateutility";
import ReactApexChart from "react-apexcharts";

const ChartPercentage = ({
    value,
    total,
}: {
    value: number;
    total: number;
}) => {
    const percentage = (value / total) * 100;
    const series = [percentage];

    let color = "#0AB39C";
    if (percentage < 50) {
        color = "#F06548";
    } else if (percentage < 75) {
        color = "#F7B84B";
    }

    const lighterColor = color + "40";

    const options: any = {
        chart: {
            type: "radialBar",
            sparkline: { enabled: true },
        },
        plotOptions: {
            radialBar: {
                startAngle: 0,
                endAngle: 360,
                hollow: {
                    margin: 0,
                    size: "65%",
                },
                track: {
                    background: lighterColor,
                    strokeWidth: "75%",
                    margin: 0,
                },
                dataLabels: {
                    show: true,
                    name: { show: false },
                    value: {
                        show: true,
                        fontSize: "10px",
                        fontWeight: 400,
                        color: "#000",
                        offsetY: 3,
                        formatter: function () {
                            return `${value}/${total}`;
                        },
                    },
                },
            },
        },
        colors: [color],
    };

    return (
        <ReactApexChart
            options={options}
            series={series}
            type="radialBar"
            height={50}
            width={50}
        />
    );
};

export const SUBJECT_ICON: Record<string, string> = {
    Maths: "📐",
    Mathematics: "📐",
    Science: "🔬",
    Physics: "🔭",
    Chemistry: "⚗️",
    Biology: "🧬",
    English: "📖",
    Hindi: "📝",
    "Social Science": "🌐",
    Social: "🌐",
    History: "🏛️",
    Geography: "🌍",
    Civics: "⚖️",
    Economics: "💹",
    "Computer Science": "💻",
    IT: "💻",
    Arts: "🎨",
    "Physical Education": "⚽",
};

export const getSubjectIcon = (subjectName?: string): string => {
    if (!subjectName) return "📘";
    const entry = Object.entries(SUBJECT_ICON).find(
        ([key]) => key.toLowerCase() === subjectName.toLowerCase()
    );
    return entry ? entry[1] : "📘";
};

export function generateColumns(actionList: Array<IOptionsHrtl>) {
    return [
        {
            Header: "Subject",
            accessor: "subjectName",
            disableSortBy: true,
            columnClassName: "w-250px min-w-160px max-w-250px text-wrap",
            Cell: ({ row: { original } }: any) => {
                const subject = original?.subjectName?.trim() || "-";
                const icon = getSubjectIcon(subject);

                return (
                    <div className="tw-flex tw-items-center tw-gap-2 tw-font-medium">
                        <span className="tw-text-lg">{icon}</span>
                        <span>{subject}</span>
                    </div>
                );
            },
        },
        {
            Header: "Assessment Name",
            accessor: "assessmentName",
            disableSortBy: true,
            columnClassName: "w-250px min-w-160px max-w-250px text-wrap",
        },
        {
            Header: "Type",
            accessor: "assessmentType",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => (
                <span className="badge text-uppercase bg-light text-muted p-2">
                    {original?.assessmentType}
                </span>
            )
        },
        {
            Header: "Date",
            accessor: "startDate",
            disableSortBy: true,
            columnClassName: "w-200px min-w-200px max-w-200px text-wrap",
            Cell: ({ row: { original } }: any) => {
                return <UserDetails
                    displayName={getFormattedDateddMMMYYYY(original.startDate)}
                    displayId={convertUTCToISTTimeOnly(original.startTime)}
                    displaySubName={formatMinutesToDuration(original.duration)}

                    showAvatar={false}
                ></UserDetails>
            },
        },
        {
            Header: "Marks",
            accessor: "evaluatedCount",
            disableSortBy: true,
            columnClassName: "text-center",
            Cell: ({ row: { original } }: any) => {
                return (
                    original.totalScore && original.totalMarks ? <ChartPercentage value={original.totalScore || 0} total={original.totalMarks || 0} /> : <span>-</span>
                );
            },
        },
        {
            Header: "Grade",
            accessor: "grade",
            disableSortBy: true,
            columnClassName: "text-center",
            Cell: ({ row: { original } }: any) => {
                const grade = original.grade?.toUpperCase();
                const gradeColorMap: Record<string, string> = {
                    A: "tw-text-green-600 font-semibold",
                    B: "tw-text-blue-600 font-semibold",
                    C: "tw-text-yellow-600 font-semibold",
                    D: "tw-text-orange-500 font-semibold",
                    E: "tw-text-red-500 font-semibold",
                    F: "tw-text-red-700 font-semibold",
                };
                const gradeClass = gradeColorMap[grade] || "tw-text-gray-500";

                return (
                    <span className={gradeClass}>
                        {grade || "-"}
                    </span>
                );
            },
        },
        {
            Header: "Status",
            accessor: "attemptStatus",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                if (!original.attemptStatus) {
                    return null;
                }
                return (
                    <StatusLabel
                        type={original.attemptStatus}
                        labelName={original.attemptStatus}
                    />
                );
            },
        },
        {
            Header: "Teacher Feedback",
            accessor: "feedBack",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                const feedback = original?.feedBack?.trim();
                return (
                    <span className="text-wrap">
                        {feedback && feedback.length > 0 ? feedback : "-"}
                    </span>
                );
            },
        },
        // {
        //     Header: "Actions",
        //     disableSortBy: true,
        //     Cell: ({ row: { original } }: any) => {
        //         const attemptId = original.attemptId;
        //         const updatedActions = actionList.map((action) => ({
        //             ...action,
        //             onClickHndlr: (event: any) => action.onClickHndlr(event, attemptId),
        //         }));

        //         return <MenuOptionHrtl actionOptions={updatedActions} rowId={attemptId} />;
        //     },
        // }

    ];
}

export const ignoredKeys = ["searchString"];

export const assessmentTypes = [
    { id: "FORMATIVE", shortName: "Formative" },
    { id: "SUMMATIVE", shortName: "Summative" },
    { id: "PRACTICE", shortName: "Practice" },
    { id: "MOCK", shortName: "Mock" },
    { id: "LIVE_WORKSHEET", shortName: "Live Worksheet" },
];
