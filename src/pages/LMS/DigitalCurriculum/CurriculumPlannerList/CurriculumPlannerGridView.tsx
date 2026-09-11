import { Edit03Icon, Exchange01Icon, Megaphone01Icon } from "@hugeicons-pro/core-stroke-standard";
import { HugeiconsIcon } from "@hugeicons/react";
import { ModalContainerUpdated, MoreActions } from "../../../../Components/Common";
import { getFormattedDateddMMMYYYY } from "../../../../utility/dateutility";
import { useModal } from "../../../../hooks/modalhook";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { getDigitalCurriculumBasicDetailsByIdAct, getDigitalCurriculumManualUploadByIdAct } from "../../../../store/lms/lmsdigitalcurriculum/lmsdigitalcurriculumaction";
import EditCurriculumStructureModal from "./EditCurriculumStructureModal";
import { useHistory } from "react-router-dom";
import PublishDigitalCurriculumModal from "./PublishDigitalCurriculumModal";
import { shallowEqual } from "react-redux";
import { useEffect, useRef } from "react";
import { toast } from "react-toastify";
import ViewDigitalCurriculumModal from "./ViewDigitalCurriculumModal";
import Pagination, { IPaginationState } from "../../../../Components/Common/Pagination";
import { getCurriculumActions } from "./helper";

const CurriculumPlannerGridView = ({ getDigitalCurriculumListResp, activeId, onPublishSuccess, onPaginationChange, getDigitalCurriculumStatsApi, getDigitalCurriculumListApi }) => {
    const apiData = getDigitalCurriculumListResp?.content ?? [];

    const { openModal: openEditCurriculumStructureModal, closeModal: closeEditCurriculumStructureModal, modalState: editCurriculumStructureModalState } = useModal();
    const { openModal: openPublishDigitalCurriculumModal, closeModal: closePublishDigitalCurriculumModal, modalState: publishDigitalCurriculumModalState } = useModal();
    const { openModal: openViewDigitalCurriculumModal, closeModal: closeViewDigitalCurriculumModal, modalState: viewDigitalCurriculumModalState } = useModal();

    const dispatch = useAppDispatch();
    const history = useHistory();
    const coursePlannerData = apiData.map((item: any) => ({
        id: item.id,
        courseId: `${item.id}-${item.className}-${item.curriculumName}`,
        curriculumCode: item.curriculumCode,
        courseTitle: item.subjectCurriculumName,
        createdByName: item.createdByName,
        courseSubject: item.subjectName,
        courseAcademicYear: item.academicYearId,
        className: item.className,
        noOfUnits: item.unitsCount ?? 0,
        chaptersCount: item.chaptersCount ?? 0,
        topicsCount: item.topicsCount ?? 0,
        lastModifiedAt: item.lastModifiedAt,
        mappedPer: Number(item.curriculumProgress?.toFixed(1)) ?? 0,
        courseStatus: item.curriculumStatus?.toLowerCase() || "draft",
        reviewStatus: item.reviewStatus?.toLowerCase() || "-",
        curriculumName: item.curriculumName,
        description: item.description,
        version: item.version,
        branchId: item.branchId,
    }));

    const { savePublishDigitalCurriculumResp } =
        useAppSelector(
            ({ lmsdigitalcurriculum }) => ({
                savePublishDigitalCurriculumResp: lmsdigitalcurriculum.savePublishDigitalCurriculumResp,
            }),
            shallowEqual
        );

    const digitalCurriculumGridRef = useRef<any>({
        prevPublishDigitalCurriculumResp: savePublishDigitalCurriculumResp,
    });

    useEffect(() => {
        const { prevPublishDigitalCurriculumResp } = digitalCurriculumGridRef.current;
        if (savePublishDigitalCurriculumResp && prevPublishDigitalCurriculumResp !== savePublishDigitalCurriculumResp) {
            toast.success("Digital Curriculum Published.");
            closePublishDigitalCurriculumModal()
            onPublishSuccess?.();
        }
        digitalCurriculumGridRef.current.prevPublishDigitalCurriculumResp = savePublishDigitalCurriculumResp;
    }, [savePublishDigitalCurriculumResp]);

    const getProgressVariant = (progress = 0) => {
        if (progress <= 25) return "danger";
        if (progress <= 50) return "warning";
        if (progress <= 75) return "info";
        return "success";
    };

    const PROGRESS_BAR_COLORS: Record<string, string> = {
        danger: "#e11d48",
        warning: "#f59e0b",
        info: "#0284c7",
        success: "#059669",
    };
    const normalizeStatus = (status: string = "") =>
        status.toLowerCase().replace(/_/g, "");
    const filteredData =
        activeId === "all"
            ? coursePlannerData
            : coursePlannerData.filter(
                (course) =>
                    normalizeStatus(course.courseStatus) ===
                    normalizeStatus(activeId)
            );
    const CurriculumPlannerItem = ({ courseItem }) => {
        const {
            courseTitle,
            createdByName,
            courseStatus,
            courseSubject,
            noOfUnits,
            chaptersCount,
            topicsCount,
            lastModifiedAt,
            reviewStatus,
            mappedPer,
        } = courseItem;

        const [date] = (lastModifiedAt || "").split("T");

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

        const normalizedSubject = courseSubject?.trim();
        const iconSubject = SUBJECT_ICON[normalizedSubject] || "📘";
        const progressVariant = getProgressVariant(mappedPer);
        const progressColor = PROGRESS_BAR_COLORS[progressVariant];

        const normalizeStatusLabel = (status?: string) =>
            status
                ? status
                    .toLowerCase()
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (c) => c.toUpperCase())
                : "-";

        const statusKey = (courseStatus || "").toLowerCase().replace(/_/g, "");
        const statusStyles: Record<string, any> = {
            inreview: { text: "#6D28D9", bg: "#F5F3FF", border: "#DDD6FE", dot: "#7C3AED" },
            inprogress: { text: "#B45309", bg: "#FFFBEB", border: "#FDE68A", dot: "#F59E0B" },
            pending: { text: "#B45309", bg: "#FEF3C7", border: "#FCD34D", dot: "#F59E0B" },
            draft: { text: "#475569", bg: "#F1F5F9", border: "#CBD5E1", dot: "#64748B" },
            published: { text: "#047857", bg: "#ECFDF5", border: "#A7F3D0", dot: "#10B981" },
            approved: { text: "#047857", bg: "#ECFDF5", border: "#A7F3D0", dot: "#10B981" },
        };

        const reviewKey = (reviewStatus || "").toLowerCase().replace(/_/g, "");
        const isApproved = reviewKey === "approved";
        const isPublished = statusKey === "published";
        const effectiveHodKey = isPublished ? "published" : reviewKey;
        const isInProgress = statusKey === "inprogress";
        const curriculumDisplayKey = isApproved ? "approved" : statusKey;
        const statusUI =
            statusStyles[curriculumDisplayKey] || statusStyles.draft;

        const reviewStyles: Record<string, any> = {
            approved: { text: "#047857", bg: "#ECFDF5", border: "#A7F3D0", dot: "#10B981", label: "Approved" },
            requestchange: { text: "#B45309", bg: "#FFFBEB", border: "#FDE68A", dot: "#F59E0B", label: "Request Change" },
            rejected: { text: "#BE123C", bg: "#FFF1F2", border: "#FECDD3", dot: "#FB7185", label: "Rejected" },
            published: { text: "#047857", bg: "#ECFDF5", border: "#A7F3D0", dot: "#10B981", label: "Published" },
        };

        const showHodStatus =
            !!effectiveHodKey &&
            effectiveHodKey !== "pending" &&
            !!reviewStyles[effectiveHodKey];

        const hodUI = showHodStatus ? reviewStyles[effectiveHodKey] : null;
        const isDraft = statusKey === "draft";
        const isRequestChange = reviewKey === "requestchange";
        const isInReview = statusKey === "inreview";
        const isPending = statusKey === "pending";
        const menuOptions = getCurriculumActions(courseItem, [
            {
                id: "modify-curriculum",
                actionIcon: <HugeiconsIcon icon={Exchange01Icon} className="me-2 text-muted" size={18} />,
                actionName: "Modify Curriculum",
                onClickHndlr: () => {
                    dispatch(
                        getDigitalCurriculumManualUploadByIdAct(
                            generateActionPayload(
                                "get_digital_curriculum_manual_upload_by_id",
                                { subjectCurriculumId: courseItem.id },
                                undefined
                            )
                        )
                    );
                    openEditCurriculumStructureModal(courseItem.id);
                },
            },
            {
                id: "edit",
                actionIcon: <HugeiconsIcon icon={Edit03Icon} className="me-2 text-muted" size={18} />,
                actionName: "Edit",
                onClickHndlr: () => {
                    history.push("/digital-curriculum/add-curriculum", {
                        subjectCurriculumId: courseItem.id,
                    });
                },
            },
            {
                id: "publish",
                actionIcon: <HugeiconsIcon icon={Megaphone01Icon} className="me-2 text-muted" size={18} />,
                actionName: "Publish",
                onClickHndlr: () => {
                    dispatch(
                        getDigitalCurriculumBasicDetailsByIdAct(
                            generateActionPayload(
                                "get_digital_curriculum_basic_details_by_id",
                                { subjectCurriculumId: courseItem.id },
                                undefined
                            )
                        )
                    );
                    openPublishDigitalCurriculumModal(courseItem.id);
                },
            },
        ]);

        const showActions = (isDraft || isRequestChange || isInProgress || isApproved) && !isPublished;

        const getCurriculumStatusLabel = () => {
            if (reviewKey === "rejected") {
                return "Curriculum Rejected";
            }
            if (reviewKey === "requestchange") {
                return "Changes Requested by HOD";
            }
            if (reviewKey === "approved") {
                return "Approved by HOD";
            }
            if (isPublished) {
                return "Curriculum Published";
            }
            if (isInReview) {
                return "Awaiting HOD Review";
            }
            if (isInProgress) {
                return "Curriculum Mapping In Progress";
            }
            if (isPending) {
                return "Pending Submission";
            }
            if (isDraft) {
                return "Curriculum Draft Saved";
            }
            return "Status Not Available";
        };

        return (
            <div className="tw-bg-white tw-rounded-2xl tw-border tw-border-slate-200 tw-shadow-sm hover:tw-shadow-md tw-transition-shadow tw-overflow-hidden">
                <div className="tw-p-4 tw-flex tw-items-start tw-justify-between tw-gap-3">
                    <div className="tw-flex tw-items-start tw-gap-3 tw-min-w-0">
                        <div className="tw-h-10 tw-w-10 tw-rounded-xl tw-bg-slate-50 tw-border tw-border-slate-200 tw-flex tw-items-center tw-justify-center">
                            <span className="tw-text-lg">{iconSubject}</span>
                        </div>
                        <div className="tw-min-w-0">
                            <h3 className="tw-font-semibold tw-mb-1 tw-text-slate-900 tw-text-[15px] tw-leading-5 tw-truncate tw-max-w-[240px]">
                                {courseTitle || "-"}
                            </h3>
                            <div className="tw-mt-1 tw-flex tw-items-center tw-justify-between tw-gap-3 tw-text-[12px] tw-text-slate-600">
                                <div className="tw-flex tw-items-center tw-gap-1 tw-min-w-0">
                                    <span className="tw-whitespace-nowrap">Created by:</span>
                                    <span className="tw-font-medium tw-text-slate-800 tw-truncate">{createdByName || "-"}</span>
                                </div>

                                <div className="tw-flex tw-items-center tw-gap-1 tw-whitespace-nowrap">
                                    <span>Updated:</span>
                                    <span className="tw-font-medium tw-text-slate-800">
                                        {date ? getFormattedDateddMMMYYYY(date) : "-"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {showActions && (
                        <div className="tw-shrink-0">
                            <MoreActions actionOptions={menuOptions} rowId={courseItem.courseId} isHorizontal />
                        </div>
                    )}
                </div>
                <div className="tw-px-4 tw-pb-3">
                    <div className="tw-grid tw-grid-cols-3 tw-gap-2 tw-bg-slate-50 tw-border tw-border-slate-200 tw-rounded-xl tw-p-3">
                        <Stat label="Units" value={noOfUnits ?? 0} />
                        <Stat label="Chapters" value={chaptersCount ?? 0} />
                        <Stat label="Topics" value={topicsCount ?? 0} />
                    </div>
                </div>
                <div className="tw-px-4 tw-pb-4">
                    <div className="tw-flex tw-items-center tw-justify-between tw-mb-2">
                        <span className=" tw-text-slate-600">Curriculum Mapped</span>
                        <span className="tw-font-semibold tw-text-slate-800">{mappedPer ?? 0}%</span>
                    </div>
                    <div className="tw-h-2 tw-rounded-full tw-bg-slate-100 tw-overflow-hidden">
                        <div
                            className="tw-h-full tw-rounded-full tw-transition-all"
                            style={{
                                width: `${Math.max(0, Math.min(100, mappedPer ?? 0))}%`,
                                backgroundColor: progressColor,
                            }}
                        />
                    </div>
                </div>
                <div className="tw-px-4 tw-pb-4 tw-flex tw-flex-wrap tw-gap-2">
                    <PillBadge
                        label={isPublished ? "Published" : normalizeStatusLabel(isApproved ? reviewStatus : courseStatus)}
                        text={statusUI.text}
                        bg={statusUI.bg}
                        border={statusUI.border}
                        dot={statusUI.dot}
                        prefix="Curriculum"
                    />
                    {hodUI ? (
                        <PillBadge
                            label={hodUI.label}
                            text={hodUI.text}
                            bg={hodUI.bg}
                            border={hodUI.border}
                            dot={hodUI.dot}
                            prefix="HOD"
                        />
                    ) : (
                        <div className="tw-text-[12px] tw-text-slate-400 tw-self-center">HOD: -</div>
                    )}
                </div>
                {isPublished ? (
                    <div className="tw-border-t tw-border-slate-200 tw-p-3">
                        <button
                            className="btn btn-outline-success tw-w-full tw-px-3 tw-py-1"
                            style={{ borderRadius: 10 }}
                            onClick={() => openViewDigitalCurriculumModal(courseItem.id)}
                        >
                            View Curriculum
                        </button>
                    </div>
                ) : (
                    <div className="tw-border-t tw-border-slate-200 tw-p-3 tw-text-center">
                        <span className="tw-text-sm tw-text-slate-500">
                            {getCurriculumStatusLabel()}
                        </span>
                    </div>
                )}
            </div>
        );
    };

    const Stat = ({ label, value }: { label: string; value: any }) => (
        <div className="tw-text-center">
            <div className="tw-text-slate-500">{label}</div>
            <div className="tw-mt-0.5  tw-font-semibold tw-text-slate-900">{value}</div>
        </div>
    );

    const PillBadge = ({
        prefix,
        label,
        text,
        bg,
        border,
        dot,
    }: {
        prefix: string;
        label: string;
        text: string;
        bg: string;
        border: string;
        dot: string;
    }) => (
        <div
            className="tw-inline-flex tw-items-center tw-gap-2 tw-px-3 tw-py-1 tw-rounded-full tw-font-medium tw-border tw-whitespace-nowrap"
            style={{ color: text, backgroundColor: bg, borderColor: border }}
        >
            <span className="tw-relative tw-flex">
                <span className="tw-relative tw-w-2 tw-h-2 tw-rounded-full" style={{ backgroundColor: dot }} />
            </span>
            <span style={{ opacity: 0.85 }}>{prefix}:</span>
            <span>{label}</span>
        </div>
    );

    function paginationHndlr(paginationInfo: IPaginationState) {
        onPaginationChange(paginationInfo);
    }

    const { pageNumber, totalElements, totalPages } = getDigitalCurriculumListResp || {}

    return (
        <>
            {filteredData.length > 0 ? (
                <>
                    <div className="tw-grid tw-gap-4 tw-mb-4 md:tw-grid-cols-2 xl:tw-grid-cols-3 2xl:tw-grid-cols-3">
                        {filteredData.map((courseItem: any) => (
                            <CurriculumPlannerItem
                                key={courseItem.courseId}
                                courseItem={courseItem}
                            />
                        ))}
                    </div>
                    <div className="tw-flex tw-justify-end">
                        <Pagination
                            paginationContainerClass="mb-4"
                            callbackPaginationHndlr={paginationHndlr}
                            totalPages={totalPages}
                            totalRecords={totalElements || 0}
                            currentPageNumber={pageNumber}
                        />
                    </div>
                </>
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
                id="edit-curriculum-structure-modal"
                isOpen={editCurriculumStructureModalState.showModal}
                toggle={closeEditCurriculumStructureModal}
                modalTitle="Edit Curriculum Details"
                modalSize="xl"
            >
                <EditCurriculumStructureModal
                    getDigitalCurriculumStatsApi={getDigitalCurriculumStatsApi}
                    getDigitalCurriculumListApi={getDigitalCurriculumListApi}
                    toggle={closeEditCurriculumStructureModal}
                    id={editCurriculumStructureModalState.modalData}
                />
            </ModalContainerUpdated>
            <ModalContainerUpdated
                id="publish-curriculum-structure-modal"
                isOpen={publishDigitalCurriculumModalState.showModal}
                toggle={closePublishDigitalCurriculumModal}
                modalTitle="Publish Curriculum Details"
                modalSize="lg"
            >
                <PublishDigitalCurriculumModal
                    toggle={closePublishDigitalCurriculumModal}
                    id={publishDigitalCurriculumModalState.modalData}
                />
            </ModalContainerUpdated>
            <ModalContainerUpdated
                id="view-curriculum-structure-modal"
                isOpen={viewDigitalCurriculumModalState.showModal}
                toggle={closeViewDigitalCurriculumModal}
                modalTitle="View Curriculum Details"
                headerClassName="!tw-bg-slate-900 !tw-text-white"
                modalSize="lg"
            >
                <ViewDigitalCurriculumModal
                    toggle={closeViewDigitalCurriculumModal}
                    id={viewDigitalCurriculumModalState.modalData}
                />
            </ModalContainerUpdated>
        </>
    );
};

export default CurriculumPlannerGridView;