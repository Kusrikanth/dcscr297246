import { HugeiconsIcon } from "@hugeicons/react";
import { Wallet01Icon, UserMultiple02Icon, SchoolIcon, AlertCircleIcon } from "@hugeicons-pro/core-stroke-standard";
import bgImg from "../FeeConcessionReport/cardimg.svg";
import { formatAmount } from "./helper";

interface IOutstandingSummaryCards {
    summary: {
        totalOutstanding: number;
        studentsWithDues: number;
        classesWithDues: number;
        currentYearDues: number;
        priorYearArrears: number;
        topClass: { className: string; amount: number } | null;
    };
    currentYearName?: string;
    /** Opens the year-wise trend; when given, the Total Outstanding card becomes the way in. */
    onViewYearWise?: () => void;
    /** Opens the class-wise student trend from the Students with Dues card. */
    onViewClassWiseStudents?: () => void;
    /** Opens the class-wise trend for the running year's dues. */
    onViewCurrentYearDues?: () => void;
    /** Opens the class-wise trend for dues carried forward from earlier years. */
    onViewPriorYearArrears?: () => void;
}

export default function OutstandingSummaryCards({
    summary,
    currentYearName,
    onViewYearWise,
    onViewClassWiseStudents,
    onViewCurrentYearDues,
    onViewPriorYearArrears,
}: IOutstandingSummaryCards) {
    const cards = [
        {
            key: "totalOutstanding",
            label: "TOTAL OUTSTANDING",
            value: `₹ ${formatAmount(summary.totalOutstanding)}`,
            hint: summary.topClass && summary.topClass.amount > 0
                ? `Highest: ${summary.topClass.className} (₹ ${formatAmount(summary.topClass.amount)})`
                : "",
            icon: Wallet01Icon,
            iconClass: "jodocred-icon",
            onClick: onViewYearWise,
            actionLabel: "Year-wise ›",
        },
        {
            key: "studentsWithDues",
            label: "STUDENTS WITH DUES",
            value: `${summary.studentsWithDues}`,
            hint: `Across ${summary.classesWithDues} class${summary.classesWithDues === 1 ? "" : "es"}`,
            icon: UserMultiple02Icon,
            iconClass: "online-icon",
            onClick: onViewClassWiseStudents,
            actionLabel: "Class-wise ›",
        },
        {
            key: "currentYearDues",
            label: "CURRENT YEAR DUES",
            value: `₹ ${formatAmount(summary.currentYearDues)}`,
            hint: currentYearName || "",
            icon: SchoolIcon,
            iconClass: "cash-icon",
            onClick: onViewCurrentYearDues,
            actionLabel: "Class-wise ›",
        },
        {
            key: "priorYearArrears",
            label: "PRIOR YEAR ARREARS",
            value: `₹ ${formatAmount(summary.priorYearArrears)}`,
            hint: "Carried forward from earlier years",
            icon: AlertCircleIcon,
            iconClass: "jodoflex-icon",
            onClick: onViewPriorYearArrears,
            actionLabel: "Class-wise ›",
        },
    ];

    return (
        <div className="tw-grid tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-4 fee-payment-reports stats-card-types-container tw-gap-4 tw-mb-3">
            {cards.map((card) => (
                <div
                    key={card.key}
                    className={`tw-bg-white tw-rounded-lg tw-shadow tw-relative tw-overflow-hidden${card.onClick ? " tw-cursor-pointer hover:tw-shadow-md tw-transition" : ""}`}
                    onClick={card.onClick}
                    onKeyDown={card.onClick ? (event) => {
                        if (event.key === "Enter" || event.key === " ") { event.preventDefault(); card.onClick?.(); }
                    } : undefined}
                    role={card.onClick ? "button" : undefined}
                    tabIndex={card.onClick ? 0 : undefined}
                    title={card.onClick ? `View ${card.label.toLowerCase()} breakdown` : undefined}
                >
                    <div className="tw-absolute tw-inset-0">
                        <img src={bgImg} alt="bg-image" />
                    </div>
                    {card.onClick && (
                        <span className="tw-absolute tw-top-2 tw-right-3 tw-z-10 tw-text-[11px] tw-font-medium tw-text-[#1bb3a6]">
                            {card.actionLabel}
                        </span>
                    )}
                    <div className="tw-p-4 tw-relative tw-z-10">
                        <div className="tw-flex tw-items-center">
                            <div className={`tw-flex tw-justify-center tw-items-center tw-shrink-0 tw-me-4 payment-icon ${card.iconClass}`}>
                                <HugeiconsIcon icon={card.icon} className="payment-icon" />
                            </div>
                            <div className="tw-flex tw-flex-col tw-flex-grow tw-overflow-hidden">
                                <p className="tw-mb-2 tw-text-sm tw-font-medium tw-text-gray-500 tw-truncate" title={card.label}>
                                    {card.label}
                                </p>
                                <h5 className="tw-text-lg tw-font-semibold tw-text-gray-900 tw-truncate" title={card.value}>
                                    {card.value}
                                </h5>
                                {card.hint && (
                                    <p className="tw-mb-0 tw-text-xs tw-text-gray-500 tw-truncate" title={card.hint}>{card.hint}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
