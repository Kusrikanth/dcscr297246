import React from "react";
import { StatusLabel, UserDetails } from "../../../../../../../Components/Common";

interface ChartPercentageProps {
    value: number;
    total: number;
    result: string;
    size?: number;
}

const ChartPercentage: React.FC<ChartPercentageProps> = ({ value, total, result, size = 45 }) => {
    const percentage = total > 0 ? (value / total) * 100 : 0;
    const strokeWidth = 4;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    const isPass = result === "PASS";
    const progressColor = isPass ? "#0AB39C" : "#F06548";
    const backgroundColor = isPass ? "#0AB39C40" : "#F0654840";

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: size,
                height: size,
                overflow: "visible",
            }}
        >
            <svg width={size} height={size}>
                <circle
                    stroke={backgroundColor}
                    fill="transparent"
                    strokeWidth={strokeWidth}
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
                <circle
                    stroke={progressColor}
                    fill="transparent"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                    style={{
                        transform: "rotate(-90deg)",
                        transformOrigin: "50% 50%",
                        transition: "stroke-dashoffset 0.5s ease",
                    }}
                />
                <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    dy=".3em"
                    fontSize="10"
                    fontWeight="600"
                    fill="#374151"
                >
                    {value}/{total}
                </text>
            </svg>
        </div>
    );
};
export default ChartPercentage;

export const attemptStatus = [
    { value: "SUBMITTED", label: "Submitted" },
    { value: "EVALUATED", label: "Evaluated" },
    { value: "ABSENT", label: "Absent" },
];

export const resultStatus = [
    { value: "PASS", label: "Pass" },
    { value: "FAIL", label: "Fail" },
];
export const searchInputOptions = [
    { id: 'global', name: 'Global Search' },
    { id: 'studentName', name: 'Student Name' },
    { id: 'studentCode', name: 'Student Code' },
    { id: 'attemptCode', name: 'Attempt Code' },
]