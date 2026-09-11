import { Copy01Icon, Delete02Icon, Edit03Icon } from "@hugeicons-pro/core-stroke-standard";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMemo } from "react";
import { Progress } from "reactstrap";
import { ModalContainerUpdated, MoreActions } from "../../../../Components/Common";
import { useHistory } from "react-router-dom";
import { useModal } from "../../../../hooks/modalhook";
import FeedBackHistoryModal from "./FeedBackHistoryModal";
import { useAppDispatch } from "../../../../hooks/storehook";
import { hodFeedbackHistoryDigitalCurriculumDetailsByIdAct } from "../../../../store/lms/lmsdigitalcurriculum/lmsdigitalcurriculumaction";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { convertUTCToISTTimeOnly, getDateWithTimeFormat, getFormattedDateddMMMYYYY } from "../../../../utility/dateutility";

const CurriculumPlannerGridView = ({ getDigitalCurriculumListResp, activeId }) => {
    const { openModal: openFeedBackHistoryModal, closeModal: closeFeedBackHistoryModal, modalState: feedBackHistoryModalState } = useModal();
    const dispatch = useAppDispatch();
    const apiData = getDigitalCurriculumListResp?.content ?? [];
    const history = useHistory();
    const handleReviewDigitalCurriculumDetails = (id: number) => {
        history.push(`/review-digital-curriculum-details/${id}`);
    };

    const coursePlannerData = apiData.map((item: any) => ({
        id: item.id,
        courseId: `${item.id}-${item.className}-${item.curriculumName}`,
        curriculumCode: item.curriculumCode,
        reviewVersion: item.reviewVersion,
        courseTitle: item.subjectCurriculumName,
        courseSubject: item.subjectName,
        courseAcademicYear: item.academicYearId,
        className: item.className,
        noOfUnits: item.unitsCount ?? 0,
        chaptersCount: item.chaptersCount ?? 0,
        topicsCount: item.topicsCount ?? 0,
        createdAt: item.createdAt,
        lastModifiedAt: item.lastModifiedAt,
        reviewStatus: item.reviewStatus,
        mappedPer: Number(item.curriculumProgress?.toFixed(1)) ?? 0,
        courseStatus: item.reviewStatus?.toLowerCase() || "IN_REVIEW",
        curriculumName: item.curriculumName,
        description: item.description,
        version: item.version,
        branchId: item.branchId,
    }));
    const filteredData = coursePlannerData;

    const CurriculumPlannerItem = ({ courseItem }) => {
        const {
            courseTitle,
            curriculumCode,
            courseStatus,
            courseSubject,
            reviewVersion,
            className,
            noOfUnits,
            chaptersCount,
            topicsCount,
            createdAt,
            lastModifiedAt,
            mappedPer,
            curriculumName,
        } = courseItem;
        const [dateModified, timeModified] = lastModifiedAt?.split("T");
        const [dateCreated, timeCreated] = createdAt?.split("T");
        const SUBJECT_ICON: Record<string, string> = {
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

        const menuOptions = useMemo(
            () => [
                {
                    id: "feedBack",
                    actionIcon: (
                        <HugeiconsIcon
                            icon={Copy01Icon}
                            className="me-2 text-muted"
                            size={18}
                        />
                    ),
                    actionName: "Feedback & History",
                    onClickHndlr: (event: any) => {
                        const id = courseItem.id;
                        dispatch(hodFeedbackHistoryDigitalCurriculumDetailsByIdAct(generateActionPayload("hod_feedback_history_details_by_id", { subjectCurriculumId: id }, undefined)));
                        openFeedBackHistoryModal(id);
                    },
                }
            ],
            []
        );

        const normalizedSubject = courseSubject?.trim();
        const iconSubject = SUBJECT_ICON[normalizedSubject] || "📘";
        const statusStyles: Record<string, any> = {
            inreview: {
                text: "#6D28D9",
                bg: "#F5F3FF",
                border: "#DDD6FE",
                dot: "#7C3AED",
            },
            inprogress: {
                text: "#D97706",
                bg: "#FFFBEB",
                border: "#FDE68A",
                dot: "#F59E0B",
            },
            pending: {
                text: "#B45309",
                bg: "#FEF3C7",
                border: "#FCD34D",
                dot: "#F59E0B",
            },
            draft: {
                text: "#475569",
                bg: "#F1F5F9",
                border: "#CBD5E1",
                dot: "#64748B",
            },
            published: {
                text: "#047857",
                bg: "#ECFDF5",
                border: "#A7F3D0",
                dot: "#10B981",
            },
        };
        const normalizeStatus = (status?: string) =>
            status
                ?.toLowerCase()
                .replace(/_/g, " ")
                .replace(/\b\w/g, (c) => c.toUpperCase());

        const statusKey = courseStatus?.toLowerCase().replace(/_/g, "");
        const statusUI = statusStyles[statusKey] || statusStyles.draft;

        return (
            <div
                className="tw-rounded-lg tw-bg-white tw-border tw-shadow-sm tw-overflow-hidden"
            >
                <div className="tw-p-4">
                    <div className="tw-flex tw-items-start tw-justify-between tw-mb-2">
                        <div className="tw-flex tw-justify-center tw-items-center">
                            <span className="text-muted tw-truncate tw-max-w-[80px] tw-me-2">{curriculumCode || "-"}</span>
                        </div>
                        <span
                            className="
    tw-inline-flex tw-items-center tw-gap-2
    tw-px-3 tw-py-1
    tw-rounded-full
    tw-text-[12.5px] tw-font-medium
    tw-border
  "
                            style={{
                                color: statusUI.text,
                                backgroundColor: statusUI.bg,
                                borderColor: statusUI.border,
                            }}
                        >
                            <span
                                className="tw-relative tw-flex"
                            >
                                <span
                                    className="tw-absolute tw-inline-flex tw-h-full tw-w-full tw-rounded-full tw-animate-ping tw-opacity-20"
                                    style={{ backgroundColor: statusUI.dot }}
                                />
                                <span
                                    className="tw-relative tw-w-2 tw-h-2 tw-rounded-full"
                                    style={{ backgroundColor: statusUI.dot }}
                                />
                            </span>
                            {normalizeStatus(courseStatus)}
                        </span>
                    </div>
                    <div className="tw-flex tw-items-start tw-justify-between tw-mb-2">
                        <div className="tw-flex tw-items-start tw-gap-2 tw-flex-1 tw-min-w-0">
                            <span className="tw-text-md tw-shrink-0">{iconSubject}</span>
                            <div className="tw-flex-1 tw-min-w-0">
                                <h3 className="tw-font-semibold tw-text-[16px] tw-text-gray-900">
                                    {courseTitle || "-"}
                                </h3>
                            </div>
                        </div>
                        <MoreActions
                            actionOptions={menuOptions}
                            rowId={courseItem.courseId}
                            isHorizontal
                        />
                    </div>
                    <div className="tw-flex tw-items-start tw-justify-between tw-mb-3 tw-w-100">
                        <div className="tw-flex tw-justify-center tw-w-100 tw-items-center">
                            <span className="text-muted tw-truncate tw-max-w-[80px] tw-me-2">{curriculumName || "-"}</span>
                            <span className="tw-w-1.5 tw-h-1.5 tw-me-2 tw-inline-block tw-rounded-full" style={{ backgroundColor: "#8F8F8F" }}></span>
                            <span className="text-muted tw-truncate tw-max-w-[60px]">{className || "-"}</span>
                            <span className="tw-w-1.5 tw-h-1.5 tw-me-2 tw-inline-block tw-rounded-full" style={{ backgroundColor: "#8F8F8F" }}></span>
                            <span className="text-muted tw-truncate tw-max-w-[90px]">{normalizedSubject || "-"}</span>
                        </div>
                    </div>
                    <div className="fs-14 tw-text-gray-600 tw-mb-3 tw-space-y-0.5">
                        <div className="tw-flex tw-gap-2">
                            <span className="text-muted tw-font-medium">Units :</span> <span className="tw-font-semibold">{noOfUnits ?? 0}</span>
                            <span className="text-muted tw-mx-2">Chapters :</span> <span className="tw-font-semibold">{chaptersCount ?? 0}</span>
                            <span className="text-muted tw-mx-2">Topics :</span> <span className="tw-font-semibold">{topicsCount ?? 0}</span>
                        </div>
                    </div>
                    <div className="tw-flex tw-gap-x-3 tw-gap-y-3 tw-mb-4 tw-flex-wrap">
                        <div className="tw-flex tw-items-center">
                            <span className="tw-font-400 tw-me-1">Version :</span>
                            <span className="text-muted"> V {Number(reviewVersion ?? 1).toFixed(1)}</span>
                        </div>
                        <div className="tw-flex tw-items-center">
                            <span className="tw-font-400 tw-me-1">Created :</span>
                            <span className="text-muted">{createdAt
                                ? `${getFormattedDateddMMMYYYY(dateCreated)}, ${convertUTCToISTTimeOnly(timeCreated)}`
                                : "-"}</span>
                        </div>
                    </div>
                    <div className="tw-flex tw-gap-x-3 tw-gap-y-3 tw-mb-4 tw-flex-wrap">
                        <div className="tw-flex tw-items-center">
                            <span className="tw-font-400 tw-me-1">Created By :</span>
                            <span className="text-muted">Mr.Ramesh</span>
                        </div>
                        <div className="tw-flex tw-items-center">
                            <span className="tw-font-400 tw-me-1">Updated :</span>
                            <span className="text-muted">{lastModifiedAt
                                ? `${getFormattedDateddMMMYYYY(dateModified)}, ${convertUTCToISTTimeOnly(timeModified)}`
                                : "-"}</span>
                        </div>
                    </div>
                    <div className="tw-border-t tw-pt-4">
                        <div className="tw-flex tw-justify-center tw-px-0 tw-w-full">
                            <button
                                type="button"
                                className="tw-text-white btn btn-outline-success tw-px-3 tw-py-1 tw-w-full"
                                style={{ borderRadius: "10px" }}
                                onClick={() => handleReviewDigitalCurriculumDetails(courseItem.id)}
                            >
                                Review Curriculum
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <>
            {filteredData.length > 0 ? (
                <div className="tw-grid tw-gap-4 tw-mb-6 md:tw-grid-cols-2 xl:tw-grid-cols-3 2xl:tw-grid-cols-3">
                    {filteredData.map((courseItem: any) => (
                        <CurriculumPlannerItem
                            courseItem={courseItem}
                            key={courseItem.courseId}
                        />
                    ))}
                </div>
            ) : (
                <div className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-text-center tw-bg-white tw-rounded-xl tw-border tw-shadow-sm tw-py-10 tw-px-4">
                    <div className="tw-w-14 tw-h-14 tw-bg-gray-100 tw-rounded-2xl tw-shadow-sm tw-flex tw-items-center tw-justify-center tw-mb-3">
                        <div className="tw-text-3xl tw-text-gray-400">📄</div>
                    </div>
                    <p className="tw-text-base tw-font-semibold tw-text-gray-700">
                        No curriculum found
                    </p>
                    <p className="tw-text-sm tw-text-gray-500 tw-mt-1">
                        Try adjusting filters or create a new digital curriculum for a class and subject.
                    </p>
                </div>
            )}
            <ModalContainerUpdated
                id="feedback-history-modal"
                isOpen={feedBackHistoryModalState.showModal}
                toggle={closeFeedBackHistoryModal}
                modalTitle="Feedback History Details"
                modalSize="xl"
            >
                <FeedBackHistoryModal
                    toggle={closeFeedBackHistoryModal}
                    id={feedBackHistoryModalState.modalData}
                />
            </ModalContainerUpdated>
        </>
    );
};

export default CurriculumPlannerGridView;