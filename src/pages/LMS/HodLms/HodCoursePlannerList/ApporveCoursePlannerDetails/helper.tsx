import React from "react";
import { MoreActions, StatusLabel } from "../../../../../Components/Common";
import { IOptionsHrtl } from "../../../../../Components/Common/MenuOptions";

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
    description: string;
    indexNumber: string;
    level: number;
    subFeatures?: IFeature[];
    totalChapters?: number;
    totalTopics?: number;
    totalHours?: number;
    percentage?: number;
}

export const formatWeeks = (weeks?: string) => {
    if (!weeks) return "N/A";
    return weeks;
};


interface TopicBuild {
    topicId: number;
    topicName: string;
    topicNo: string;
    weeks: string | null;
    totalSessions: number | null;
    minPerSession: number | null;
}

interface ChapterBuild {
    chapterId: number;
    chapterName: string;
    chapterNo: string;
    weeks: string | null;
    plannedTeachingHours: number | null;
    topicsBuild: TopicBuild[];
}

interface UnitBuild {
    unitId: number;
    unitName: string;
    unitNo: string;
    termId: number | null;
    termName: string | null;
    weeks: string | null;
    plannedTeachingHours: number | null;
    weightage: string | null;
    chaptersBuild: ChapterBuild[];
}

interface SubjectCurriculumBuildDTO {
    unitsBuild: UnitBuild[];
}

export const buildUnitsTableFromBuildDTO = (unitsBuild: UnitBuild[]) => {
    return unitsBuild.map((u: any) => ({
        id: u.unitId,
        unitId: u.unitId,
        code: u.unitNo,
        title: u.unitName,
        weeks: formatWeeks(u.weeks),
        term: u.termName || "N/A",
        weight: u.weightage || "N/A",
        hours: u.plannedTeachingHours || 0,
        status: u.plannedTeachingHours ? "Published" : "Draft",
    }));
};

export const buildChaptersTableFromBuildDTO = (unitsBuild: UnitBuild[]) => {
    const rows: any[] = [];

    unitsBuild.forEach(u => {
        u.chaptersBuild.forEach((ch:any) => {
            rows.push({
                id: ch.chapterId,
                chapterId: ch.chapterId,
                unitId: u.unitId,
                code: `${ch.chapterNo}.${u.unitNo.replace('U', '')}`,
                title: ch.chapterName,
                unit: u.unitName,
                weeks: formatWeeks(ch.weeks),
                term: u.termName || "N/A",
                weight: "N/A",
                hours: ch.plannedTeachingHours || 0,
            });
        });
    });

    return rows;
};

export const buildTopicsTableFromBuildDTO = (unitsBuild: UnitBuild[]) => {
    const rows: any[] = [];

    unitsBuild.forEach(u => {
        u.chaptersBuild.forEach(ch => {
            ch.topicsBuild.forEach((t: any) => {
                const unitNum = u.unitNo.replace('U', '');
                const chapterNum = ch.chapterNo.replace('C', '');
                const topicNum = t.topicNo.replace('T', '');
                
                rows.push({
                    id: t.topicId,
                    topicId: t.topicId,
                    chapterId: ch.chapterId,
                    unitId: u.unitId,
                    code: `T${topicNum}.${chapterNum}.${unitNum}`,
                    title: t.topicName,
                    unitChapter: `${u.unitName} → ${ch.chapterName}`,
                    weeks: formatWeeks(t.weeks),
                    term: u.termName || "N/A",
                    sessions: t.totalSessions || 0,
                    minutesPerSession: t.minPerSession || 0,
                    status: t.totalSessions ? "Planned" : "Draft",
                });
            });
        });
    });

    return rows;
};

export const notificationType = [
    { value: 'EMAIL', label: 'Email' },
    { value: 'SMS', label: 'SMS' },
]

export function renderValueWeek(selectedItems: any[], removeItemHandler: any) {
    if (!Array.isArray(selectedItems)) return null;

    return (
        <div className="selected-container">
            {selectedItems.map((item: any) => (
                <div key={`week-${item.weekName}`} className="selectedoption-item">
                    <span>{item.weekName}</span>
                    <span
                        data-id={item.weekName}
                        onClick={removeItemHandler}
                        className="remove-icon"
                    >
                        <i className="ri-close-line"></i>
                    </span>
                </div>
            ))}
        </div>
    );
}


export function generateColumns(
    activeId: string,
    actionsList: Array<IOptionsHrtl>
) {
    if (activeId === "units") {
        return [
            { Header: "Code", accessor: "code", disableSortBy: true, },
            { Header: "Title", disableSortBy: true, accessor: "title" },
            { Header: "Weeks", disableSortBy: true, accessor: "weeks",
                Cell: ({ row: { original } }: any) => (
                    Array.isArray(original?.weeks)
                        ? original?.weeks?.map((w: any) => w.weekName).join(", ")
                        : "-"
                )
             },
            { Header: "Term", disableSortBy: true, accessor: "term" },
            { Header: "Weight%", disableSortBy: true, accessor: "weight" },
            { Header: "Hours", disableSortBy: true, accessor: "hours" },
            // {
            //     Header: "Status",
            //     disableSortBy: true,
            //     accessor: "status",
            //     Cell: ({ row: { original } }: any) => 
            //     (
            //         <StatusLabel type={original.status} labelName={original.status} />
            //     ),
            // },
            {
                Header: "Actions",
                disableSortBy: true,
                Cell: ({ row: { original } }: any) => 
                    (
                    <MoreActions
                        actionOptions={actionsList}
                        rowId={original.id}
                        isHorizontal={true}
                    />
                ),
            },
        ];
    }

    if (activeId === "chapters") {
        return [
            { Header: "Code", disableSortBy: true, accessor: "code" },
            { Header: "Title", disableSortBy: true, accessor: "title" },
            { Header: "Unit", disableSortBy: true, accessor: "unit" },
            { Header: "Weeks", disableSortBy: true, accessor: "weeks",
                Cell: ({ row: { original } }: any) => (
                    Array.isArray(original?.weeks)
                        ? original?.weeks?.map((w: any) => w.weekName).join(", ")
                        : "-"
                )
             },
            { Header: "Term", disableSortBy: true, accessor: "term" },
            // { Header: "Weight%", disableSortBy: true, accessor: "weight" },
            { Header: "Hours", disableSortBy: true, accessor: "hours" },
            {
                Header: "Actions",
                disableSortBy: true,
                Cell: ({ row: { original } }: any) => (
                    <MoreActions
                        actionOptions={actionsList}
                        rowId={original.id}
                        isHorizontal={true}
                    />
                ),
            },
        ];
    }

    return [
        { Header: "Code", columnClassName: "w-100px min-w-100px text-wrap", disableSortBy: true, accessor: "code" },
        { Header: "Title", columnClassName: "w-200px min-w-200px text-wrap", disableSortBy: true, accessor: "title" },
        { Header: "Unit → Chapter", columnClassName: "w-300px min-w-300px text-wrap", disableSortBy: true, accessor: "unitChapter" },
        { Header: "Weeks", disableSortBy: true, accessor: "weeks",
            Cell: ({ row: { original } }: any) => (
                Array.isArray(original?.weeks)
                    ? original?.weeks?.map((w: any) => w.weekName).join(", ")
                    : "-"
        )},
        { Header: "Term", columnClassName: "w-100px min-w-100px text-wrap", disableSortBy: true, accessor: "term" },
        { Header: "Sessions", disableSortBy: true, accessor: "sessions" },
        { Header: "Min/Session", disableSortBy: true, accessor: "minutesPerSession" },
        // { Header: "Status", disableSortBy: true, accessor: "status" },
        {
            Header: "Actions",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => (
                <MoreActions
                    actionOptions={actionsList}
                    rowId={original.id}
                    isHorizontal={true}
                />
            ),
        },
    ];
}

export function convertBuildDTOToTree(buildDTO: SubjectCurriculumBuildDTO) {
    return buildDTO?.unitsBuild?.map((unit, uIndex) => {
        let unitTotalTopics = 0;
        let unitTotalMinutes = 0;

        const chapterNodes = unit.chaptersBuild?.map((chapter, cIndex) => {
            const chapterMinutes = chapter.plannedTeachingHours ? chapter.plannedTeachingHours * 60 : 0;
            
            const topicNodes = chapter.topicsBuild?.map((topic, tIndex) => {
                const topicMinutes = (topic.totalSessions || 0) * (topic.minPerSession || 0);
                
                return {
                    id: String(topic.topicId),
                    description: topic.topicName,
                    indexNumber: topic.topicNo,
                    level: 3,
                    subFeatures: [],
                };
            });

            unitTotalMinutes += chapterMinutes;
            unitTotalTopics += topicNodes.length;

            return {
                id: String(chapter.chapterId),
                description: chapter.chapterName,
                indexNumber: chapter.chapterNo,
                level: 2,
                subFeatures: topicNodes,
                totalTopics: topicNodes.length,
                totalHours: chapter.plannedTeachingHours || 0,
                percentage: 0,
            };
        });

        return {
            id: String(unit.unitId),
            description: unit.unitName,
            indexNumber: unit.unitNo,
            level: 1,
            subFeatures: chapterNodes,
            totalChapters: chapterNodes.length,
            totalTopics: unitTotalTopics,
            totalHours: unit.plannedTeachingHours || 0,
            percentage: unit.weightage ? parseFloat(unit.weightage) : 0,
        };
    });
}

export function renderOptionsWeek(item: any) {
    return <span>{`${item.weekName} (${item.weekStartDate} - ${item.weekEndDate})`}</span>
}