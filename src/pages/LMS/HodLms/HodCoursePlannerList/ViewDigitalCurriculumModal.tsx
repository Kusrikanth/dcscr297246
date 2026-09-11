import React, { useEffect, useMemo, useState } from "react";
import { shallowEqual } from "react-redux";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import {
    resetDigitalCurriculumBasicDetailsByIdAct,
    resetCurriculumStructureAct,
} from "../../../../store/lms/lmsdigitalcurriculum/lmsdigitalcurriculumslice";
import {
    getCurriculumStructureAct,
    getDigitalCurriculumBasicDetailsByIdAct,
} from "../../../../store/lms/lmsdigitalcurriculum/lmsdigitalcurriculumaction";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { UserDetails } from "../../../../Components/Common";
import { convertCurriculumToTree } from "../ReviewCoursePlanner/ReviewCoursePlannerDetails/helper";
import { ExpandCollapseAction, ExpandCollapseState, ModuleTree, TreeContextProvider } from "./TreeComponent";


const ViewDigitalCurriculumModal = (props: any) => {
    const dispatch = useAppDispatch();

    const [expandCollapseState, setExpandCollapseState] = useState<ExpandCollapseState>({
        action: "",
        ids: [],
        version: 0,
    });

    const expandCollapseHndlr = (action: ExpandCollapseAction, ids: string[] = []) => {
        setExpandCollapseState((prev) => ({
            action,
            ids,
            version: prev.version + 1,
        }));
    };

    const { getCurriculumStructureResp, getDigitalCurriculumBasicDetailsByIdResp } =
        useAppSelector(
            ({ lmsdigitalcurriculum }) => ({
                getCurriculumStructureResp: lmsdigitalcurriculum.getCurriculumStructureResp,
                getDigitalCurriculumBasicDetailsByIdResp:
                    lmsdigitalcurriculum.getDigitalCurriculumBasicDetailsByIdResp,
            }),
            shallowEqual
        );

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
                getCurriculumStructureAct(
                    generateActionPayload("get_curriculum_structure", { subjectCurriculumId }, undefined)
                )
            );
        }

        return () => {
            dispatch(resetDigitalCurriculumBasicDetailsByIdAct(undefined));
            dispatch(resetCurriculumStructureAct(undefined));
        };
    }, [subjectCurriculumId, dispatch]);

    const basic = getDigitalCurriculumBasicDetailsByIdResp;

    const buildUnits = getCurriculumStructureResp?.subjectCurriculumBuildDTO?.unitsBuild ?? [];

    const treeData = useMemo(() => convertCurriculumToTree(buildUnits), [buildUnits]);

    const counts = useMemo(() => {
        let lessonCount = 0;
        let topicCount = 0;

        buildUnits.forEach((unit: any) => {
            lessonCount += unit.chaptersBuild?.length || 0;
            unit.chaptersBuild?.forEach((chapter: any) => {
                topicCount += chapter.topicsBuild?.length || 0;
            });
        });

        return { unitCount: buildUnits.length, lessonCount, topicCount };
    }, [buildUnits]);

    const colorMap: Record<string, string> = {
        sky: "tw-bg-sky-200",
        amber: "tw-bg-amber-300",
        emerald: "tw-bg-emerald-300",
    };

    return (
        <div className="tw-w-full tw-max-w-6xl tw-rounded-3xl tw-bg-white tw-shadow-xl tw-overflow-hidden tw-text-slate-900">
            <div className="tw-bg-slate-50 tw-p-6">
                <div className="tw-rounded-2xl tw-bg-white tw-p-6 tw-space-y-6">
                    <div className="tw-flex tw-flex-col tw-gap-2">
                        <UserDetails
                            displayName={basic?.subjectCurriculumName || "-"}
                            displayId={`${basic?.curriculumName ?? "-"} • ${basic?.className ?? "-"} • ${basic?.subjectName ?? "-"
                                }`}
                            size="xs"
                        />
                        <div className="tw-inline-flex tw-items-center tw-gap-2 tw-rounded-full tw-bg-slate-50 tw-px-4 tw-py-1.5 tw-text-sm">
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
                                className="tw-rounded-xl tw-bg-white tw-border tw-border-slate-100 tw-shadow-sm tw-p-5 hover:tw-shadow-md tw-transition"
                            >
                                <div className={`tw-h-1.5 tw-w-full tw-rounded-full ${colorMap[item.color]}`} />
                                <div className="tw-mt-3 tw-text-xs tw-uppercase tw-font-semibold tw-text-slate-500">
                                    {item.label}
                                </div>
                                <div className="tw-text-3xl tw-font-extrabold tw-text-slate-900">{item.value}</div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="tw-rounded-2xl tw-bg-white tw-border tw-border-slate-200 tw-shadow-sm tw-mt-3">
                    <div className="tw-flex tw-items-center tw-justify-between tw-p-4 tw-border-b">
                        <div className="tw-font-extrabold uppercase">Curriculum Structure</div>
                        <div className="tw-flex tw-gap-2">
                            <button
                                onClick={() => expandCollapseHndlr("EXPAND_ALL")}
                                className="tw-rounded-xl tw-border tw-border-slate-300 tw-px-4 tw-py-2 tw-text-sm tw-font-semibold hover:tw-bg-slate-50"
                            >
                                <i className="ri-arrow-down-s-line me-1" />
                                Expand all
                            </button>
                            <button
                                onClick={() => expandCollapseHndlr("COLLAPSE_ALL")}
                                className="tw-rounded-xl tw-border tw-border-slate-300 tw-px-4 tw-py-2 tw-text-sm tw-font-semibold hover:tw-bg-slate-50"
                            >
                                <i className="ri-arrow-up-s-line me-1" />
                                Collapse all
                            </button>
                        </div>
                    </div>
                    <div className="tw-max-h-[52vh] tw-overflow-auto tw-p-4">
                        <TreeContextProvider.Provider value={{ value: expandCollapseState, toggle: expandCollapseHndlr }}>
                            {treeData.map((node) => (
                                <ModuleTree key={node.id} level={1} parentsInfo={[]} showEmptyMeta {...node} />
                            ))}
                        </TreeContextProvider.Provider>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewDigitalCurriculumModal;
