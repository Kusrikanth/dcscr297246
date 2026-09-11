import React from "react";

export interface ITreeContext {
    value: { action: string; ids: string[] };
    toggle: (action: string, ids?: string[]) => void;
}

export const TreeContextProvider = React.createContext<ITreeContext>({
    value: { action: "", ids: [] },
    toggle: () => { },
});

export interface ISubTreeParentInfo {
    parentFeatureId: string;
    parentFeatureName: string;
}

export interface IFeature {
    id: string;
    description: string;
    indexNumber: string;
    subFeatures: IFeature[];
}

export function convertCurriculumToTree(units: any[]): IFeature[] {
    return units.map((unit: any, uIndex: number) => {
        const unitNumber = `${uIndex + 1}`;

        return {
            id: String(unit.id),
            description: unit.title,
            indexNumber: unitNumber,
            subFeatures: (unit.chapters || []).map((chapter: any, cIndex: number) => {
                const chapterNumber = `${unitNumber}.${cIndex + 1}`;

                return {
                    id: String(chapter.id),
                    description: chapter.title,
                    indexNumber: chapterNumber,
                    subFeatures: (chapter.topics || []).map(
                        (topic: any, tIndex: number) => ({
                            id: String(topic.id),
                            description: topic.title,
                            indexNumber: `${chapterNumber}.${tIndex + 1}`,
                            subFeatures: [],
                        })
                    ),
                };
            }),
        };
    });
}

type StatusTone = "danger" | "warning" | "success" | "info" | "neutral";
type StatusVariant = "soft" | "outline" | "solid";
type StatusSize = "sm" | "md";

type StatusPillProps = {
    tone?: StatusTone;
    variant?: StatusVariant;
    size?: StatusSize;
    label: string;
    showDot?: boolean;
    className?: string;
    title?: string;
};

const toneStyles: Record<StatusTone, Record<StatusVariant, string> & { dot: string }> = {
    danger: {
        soft: "tw-bg-rose-50 tw-text-rose-800",
        outline: "tw-text-rose-800 tw-ring-1 tw-ring-rose-300",
        solid: "tw-bg-rose-600 tw-text-white",
        dot: "tw-bg-rose-500",
    },
    warning: {
        soft: "tw-bg-amber-50 tw-text-amber-900",
        outline: "tw-text-amber-900 tw-ring-1 tw-ring-amber-300",
        solid: "tw-bg-amber-500 tw-text-white",
        dot: "tw-bg-amber-500",
    },
    success: {
        soft: "tw-bg-emerald-50 tw-text-emerald-900",
        outline: "tw-text-emerald-900 tw-ring-1 tw-ring-emerald-300",
        solid: "tw-bg-emerald-600 tw-text-white",
        dot: "tw-bg-emerald-500",
    },
    info: {
        soft: "tw-bg-sky-50 tw-text-sky-900",
        outline: "tw-text-sky-900 tw-ring-1 tw-ring-sky-300",
        solid: "tw-bg-sky-600 tw-text-white",
        dot: "tw-bg-sky-400",
    },
    neutral: {
        soft: "tw-bg-slate-50 tw-text-slate-800",
        outline: "tw-text-slate-800 tw-ring-1 tw-ring-slate-300",
        solid: "tw-bg-slate-700 tw-text-white",
        dot: "tw-bg-slate-400",
    },
};

const sizeStyles = {
    sm: "tw-text-xs tw-h-6 tw-px-2.5",
    md: "tw-text-sm tw-h-7 tw-px-3",
};

export const StatusPill: React.FC<StatusPillProps> = ({
    tone = "info",
    variant = "soft",
    size = "sm",
    label,
    showDot = true,
    className = "",
    title,
}) => {
    return (
        <span
            role="status"
            title={title ?? label}
            className={`tw-inline-flex tw-items-center tw-gap-2 tw-rounded-full tw-font-semibold ${toneStyles[tone][variant]} ${sizeStyles[size]} ${className}`}
        >
            {showDot && <span className={`tw-w-2 tw-h-2 tw-rounded-full ${toneStyles[tone].dot}`} />}
            <span className="tw-truncate">{label}</span>
        </span>
    );
};
