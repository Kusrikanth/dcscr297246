import React from "react";
import classnames from "classnames";

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
export interface IPermission {
    name: string;
    level: number;
}
export interface IFeature {
    id: string;
    code: string;
    description: string;
    subFeatures: IFeature[];
    permissions: IPermission[];
    indexNumber: string;
}
export function convertCurriculumToTree(units: any[]) {
    return units.map((unit: any, uIndex: number) => {
        const unitNumber = `${uIndex + 1}`;

        return {
            id: String(unit.id),
            description: unit.title,
            indexNumber: unitNumber,
            permissions: [],
            subFeatures: (unit.chapters || []).map((chapter: any, cIndex: number) => {
                const chapterNumber = `${unitNumber}.${cIndex + 1}`;

                return {
                    id: String(chapter.id),
                    description: chapter.title,
                    indexNumber: chapterNumber,
                    permissions: [],
                    subFeatures: (chapter.topics || []).map((topic: any, tIndex: number) => ({
                        id: String(topic.id),
                        description: topic.title,
                        indexNumber: `${chapterNumber}.${tIndex + 1}`,
                        permissions: [],
                        subFeatures: [],
                    })),
                };
            }),
        };
    });
}

type StatusTone = "danger" | "warning" | "success" | "info" | "neutral";
type StatusVariant = "soft" | "outline" | "solid";
type StatusSize = "sm" | "md";

type Props = {
    tone?: StatusTone;
    variant?: StatusVariant;
    size?: StatusSize;
    label: string;
    leading?: React.ReactNode;
    showDot?: boolean;
    className?: string;
    title?: string;
};

const toneStyles: Record<
    StatusTone,
    {
        soft: string;
        outline: string;
        solid: string;
        dot: string;
        focus: string;
    }
> = {
    danger: {
        soft: "tw-bg-rose-50 tw-text-rose-800 tw-ring-1 tw-ring-inset tw-ring-rose-200",
        outline: "tw-bg-transparent tw-text-rose-800 tw-ring-1 tw-ring-inset tw-ring-rose-300",
        solid: "tw-bg-rose-600 tw-text-white",
        dot: "tw-bg-rose-500",
        focus: "focus-visible:tw-ring-rose-400",
    },
    warning: {
        soft: "tw-bg-amber-50 tw-text-amber-900 tw-ring-1 tw-ring-inset tw-ring-amber-200",
        outline: "tw-bg-transparent tw-text-amber-900 tw-ring-1 tw-ring-inset tw-ring-amber-300",
        solid: "tw-bg-amber-500 tw-text-amber-950",
        dot: "tw-bg-amber-500",
        focus: "focus-visible:tw-ring-amber-400",
    },
    success: {
        soft: "tw-bg-emerald-50 tw-text-emerald-900 tw-ring-1 tw-ring-inset tw-ring-emerald-200",
        outline: "tw-bg-transparent tw-text-emerald-900 tw-ring-1 tw-ring-inset tw-ring-emerald-300",
        solid: "tw-bg-emerald-600 tw-text-white",
        dot: "tw-bg-emerald-500",
        focus: "focus-visible:tw-ring-emerald-400",
    },
    info: {
        soft: "tw-bg-sky-50 tw-text-sky-900 tw-ring-1 tw-ring-inset tw-ring-sky-200",
        outline: "tw-bg-transparent tw-text-sky-900 tw-ring-1 tw-ring-inset tw-ring-sky-300",
        solid: "tw-bg-sky-600 tw-text-white",
        dot: "tw-bg-sky-400",
        focus: "focus-visible:tw-ring-sky-400",
    },
    neutral: {
        soft: "tw-bg-slate-50 tw-text-slate-800 tw-ring-1 tw-ring-inset tw-ring-slate-200",
        outline: "tw-bg-transparent tw-text-slate-800 tw-ring-1 tw-ring-inset tw-ring-slate-300",
        solid: "tw-bg-slate-700 tw-text-white",
        dot: "tw-bg-slate-400",
        focus: "focus-visible:tw-ring-slate-400",
    },
};

const sizeStyles: Record<StatusSize, { pill: string; dot: string; icon: string }> = {
    sm: {
        pill: "tw-text-xs tw-h-6 tw-px-2.5 tw-gap-1.5",
        dot: "tw-w-1.5 tw-h-1.5",
        icon: "tw-w-3.5 tw-h-3.5",
    },
    md: {
        pill: "tw-text-sm tw-h-7 tw-px-3 tw-gap-2",
        dot: "tw-w-2 tw-h-2",
        icon: "tw-w-4 tw-h-4",
    },
};

export const StatusPill: React.FC<Props> = ({
    tone = "info",
    variant = "soft",
    size = "sm",
    label,
    leading,
    showDot = true,
    className,
    title,
}) => {
    const t = toneStyles[tone];
    const s = sizeStyles[size];

    return (
        <span
            role="status"
            aria-label={label}
            title={title ?? label}
            className={classnames(
                "tw-inline-flex tw-items-center tw-rounded-full tw-font-semibold",
                "tw-select-none tw-whitespace-nowrap tw-max-w-full",
                "tw-transition tw-duration-150",
                "focus-visible:tw-outline-none focus-visible:tw-ring-2 focus-visible:tw-ring-offset-2",
                t[variant],
                t.focus,
                s.pill,
                className
            )}
        >
            {leading ? (
                <span className={classnames("tw-inline-flex tw-items-center", s.icon)}>{leading}</span>
            ) : null}

            {showDot ? (
                <span
                    className={classnames(
                        "tw-rounded-full tw-flex-none",
                        s.dot,
                        variant === "solid" ? "tw-bg-white/80" : t.dot
                    )}
                />
            ) : null}

            <span className="tw-truncate">{label}</span>
        </span>
    );
};
