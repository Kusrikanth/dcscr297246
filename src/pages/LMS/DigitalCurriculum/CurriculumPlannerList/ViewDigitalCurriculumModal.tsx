import React, { useEffect, useMemo, useRef, useState } from "react";
import { shallowEqual } from "react-redux";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { resetDigitalCurriculumBasicDetailsByIdAct, resetDigitalCurriculumManualUploadByIdAct } from "../../../../store/lms/lmsdigitalcurriculum/lmsdigitalcurriculumslice";
import { digitalCurriculumDownloadReportAct, getDigitalCurriculumBasicDetailsByIdAct, getDigitalCurriculumManualUploadByIdAct } from "../../../../store/lms/lmsdigitalcurriculum/lmsdigitalcurriculumaction";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { convertCurriculumToTree, TreeContextProvider } from "../DigitalCurriulumSetup/ReviewCurriculumDetails/helper";
import { ModuleTree } from "../DigitalCurriulumSetup/ReviewCurriculumDetails/TreeComponent";
import { UserDetails } from "../../../../Components/Common";
import { toast } from "react-toastify";

type ExpandCollapseState = { action: string; ids: string[] };

const ViewDigitalCurriculumModal = (props: any) => {
    const dispatch = useAppDispatch();

    const [expandCollapseState, setExpandCollapseState] =
        useState<ExpandCollapseState>({ action: "", ids: [] });

    const expandCollapseHndlr = (action: string, ids: string[] = []) => {
        setExpandCollapseState({ action, ids });
    };

    function downloadPdfFromBase64(base64: any, fileName: any) {
        const link = document.createElement("a");
        link.href = `data:${"application/pdf"};base64,${base64}`;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    const {
        getDigitalCurriculumanualUploadByIdResp,
        getDigitalCurriculumBasicDetailsByIdResp,
        digitalCurriculumDownloadReportResp
    } = useAppSelector(
        ({ lmsdigitalcurriculum }) => ({
            getDigitalCurriculumanualUploadByIdResp: lmsdigitalcurriculum.getDigitalCurriculumanualUploadByIdResp,
            getDigitalCurriculumBasicDetailsByIdResp: lmsdigitalcurriculum.getDigitalCurriculumBasicDetailsByIdResp,
            digitalCurriculumDownloadReportResp: lmsdigitalcurriculum.digitalCurriculumDownloadReportResp,
        }),
        shallowEqual
    );

    const viewDigitalCurriculumRef = useRef({
        prevDownloadDigitalCurriculumReportRespActResp: digitalCurriculumDownloadReportResp,
    })

    useEffect(() => {
        const { prevDownloadDigitalCurriculumReportRespActResp } = viewDigitalCurriculumRef.current;

        if (digitalCurriculumDownloadReportResp && prevDownloadDigitalCurriculumReportRespActResp !== digitalCurriculumDownloadReportResp) {
            toast.success("Digital Curriculum downloaded successfully");
            downloadPdfFromBase64(digitalCurriculumDownloadReportResp.pdfBase64, "Digital Curriculum.pdf");
        }

        viewDigitalCurriculumRef.current.prevDownloadDigitalCurriculumReportRespActResp = digitalCurriculumDownloadReportResp;
    }, [digitalCurriculumDownloadReportResp]);

    const subjectCurriculumId = props.id;

    useEffect(() => {
        if (subjectCurriculumId) {
            dispatch(
                getDigitalCurriculumBasicDetailsByIdAct(
                    generateActionPayload(
                        "get_digital_curriculum_basic_details_by_id",
                        { subjectCurriculumId },
                        undefined
                    )
                )
            );
            dispatch(
                getDigitalCurriculumManualUploadByIdAct(
                    generateActionPayload(
                        "get_digital_curriculum_manual_upload_by_id",
                        { subjectCurriculumId },
                        undefined
                    )
                )
            );
        }

        return () => {
            dispatch(resetDigitalCurriculumBasicDetailsByIdAct(undefined));
            dispatch(resetDigitalCurriculumManualUploadByIdAct(undefined));
        };
    }, [subjectCurriculumId]);

    const basic = getDigitalCurriculumBasicDetailsByIdResp;
    const units = getDigitalCurriculumanualUploadByIdResp?.units ?? [];
    const tree = useMemo(() => convertCurriculumToTree(units), [units]);

    const counts = useMemo(() => {
        let lessonCount = 0;
        let topicCount = 0;

        units.forEach((unit: any) => {
            lessonCount += unit.chapters?.length || 0;

            unit.chapters?.forEach((chapter: any) => {
                topicCount += chapter.topics?.length || 0;
            });
        });

        return {
            unitCount: units.length,
            lessonCount,
            topicCount,
        };
    }, [units]);

    const colorMap: Record<string, string> = {
        sky: "tw-bg-sky-200",
        amber: "tw-bg-amber-300",
        emerald: "tw-bg-emerald-300",
    };

    const downloadDigitalCurrriculumReportHndlr = (examData: any) => {
        dispatch(digitalCurriculumDownloadReportAct(generateActionPayload("digital_curriculum_download_report", { subjectCurriculumId }, undefined)));
    };

    return (
        <div className="tw-w-full tw-max-w-6xl tw-rounded-3xl tw-bg-white tw-shadow-xl tw-overflow-hidden tw-text-slate-900">
            <div className="tw-bg-slate-50 tw-p-6">
                <div className="tw-rounded-2xl tw-bg-white tw-p-6 tw-space-y-6">
                    <div className="tw-flex tw-flex-col tw-gap-3">
                        <div className="tw-flex tw-items-center tw-justify-between">
                            <UserDetails
                                displayName={basic?.subjectCurriculumName || "-"}
                                displayId={`${basic?.curriculumName ?? "-"} • ${basic?.className ?? "-"} • ${basic?.subjectName ?? "-"}`}
                                size="xs"
                            />
                            <button
                                type="button"
                                className="tw-inline-flex tw-items-center
                                            tw-rounded-lg
                                            tw-bg-[#405189] tw-text-white
                                            tw-px-5 tw-py-2
                                            tw-text-sm tw-font-medium
                                            hover:tw-bg-[#364574]
                                            tw-shadow-sm"
                                onClick={downloadDigitalCurrriculumReportHndlr}
                            >
                                Download
                            </button>
                        </div>
                        <div
                            className="w-100 tw-inline-flex tw-items-center tw-gap-2
                                       tw-rounded-full tw-bg-slate-50
                                       tw-px-4 tw-py-1.5 tw-text-sm
                                       tw-w-fit"
                        >
                            <span className="tw-text-slate-600">Created by</span>
                            <span className="tw-font-semibold tw-text-slate-900">
                                {basic?.createdByName ?? "—"}
                            </span>
                        </div>
                    </div>
                    <div className="tw-grid tw-grid-cols-1 sm:tw-grid-cols-3 tw-gap-4">
                        {[
                            { label: "Units", value: counts.unitCount, color: "sky" },
                            { label: "Lessons", value: counts.lessonCount, color: "amber" },
                            { label: "Topics", value: counts.topicCount, color: "emerald" },
                        ].map((item) => (
                            <div
                                key={item.label}
                                className="tw-rounded-xl tw-bg-white 
                                           tw-border tw-border-slate-100
                                           tw-shadow-sm tw-p-5 
                                           hover:tw-shadow-md tw-transition"
                            >
                                <div className={`tw-h-1.5 tw-w-full tw-rounded-full ${colorMap[item.color]}`} />
                                <div className="tw-mt-3 tw-text-xs tw-uppercase tw-font-semibold tw-text-slate-500">
                                    {item.label}
                                </div>
                                <div className="tw-text-3xl tw-font-extrabold tw-text-slate-900">
                                    {item.value}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="tw-rounded-2xl tw-bg-white tw-border tw-border-slate-200 tw-shadow-sm tw-mt-3">
                    <div className="tw-flex tw-items-center tw-justify-between tw-p-4 tw-border-b">
                        <div className="tw-font-extrabold uppercase">
                            Curriculum Structure
                        </div>
                        <div className="tw-flex tw-gap-2">
                            <button
                                onClick={() => expandCollapseHndlr("EXPAND_ALL")}
                                className="tw-rounded-xl tw-border tw-border-slate-300 tw-px-4 tw-py-2 hover:tw-bg-slate-50"
                            >
                                <i className="ri-arrow-down-s-line me-1" />
                                Expand all
                            </button>
                            <button
                                onClick={() => expandCollapseHndlr("COLLAPSE_ALL")}
                                className="tw-rounded-xl tw-border tw-border-slate-300 tw-px-4 tw-py-2 hover:tw-bg-slate-50"
                            >
                                <i className="ri-arrow-up-s-line me-1" />
                                Collapse all
                            </button>
                        </div>
                    </div>
                    <TreeContextProvider.Provider
                        value={{ value: expandCollapseState, toggle: expandCollapseHndlr }}
                    >
                        <div className="tw-max-h-[60vh] tw-overflow-auto tw-p-4">
                            <div className="tw-space-y-2">
                                {tree.map((node: any) => (
                                    <ModuleTree
                                        key={node.id}
                                        level={1}
                                        parentsInfo={[]}
                                        parentFeatureId=""
                                        {...node}
                                    />
                                ))}
                            </div>
                        </div>
                    </TreeContextProvider.Provider>
                </div>
            </div>
        </div>
    );
};

export default ViewDigitalCurriculumModal;
