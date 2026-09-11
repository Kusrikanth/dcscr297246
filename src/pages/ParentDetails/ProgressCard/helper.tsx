 import React from "react";
import { MenuOptionHrtl, StatusLabel } from "../../../Components/Common";
import { IOptionsHrtl, MoreActions } from "../../../Components/Common/MenuOptions";
import { nanoid } from "nanoid";

export function generateColumns(progressCardActions: Array<IOptionsHrtl>) {
    return [
        {
            Header: "Generation Type",
            accessor: "generationType",
            disableSortBy: true,
        },
        {
            Header: "Exam/Term Name",
            accessor: "name",
             disableSortBy: true,
        },
        {
            Header: "Curriculum Name",
            accessor: "curriculumName",
            disableSortBy: true,
        },
        {
            Header: "Class Name",
            accessor: "classShortName",
            disableSortBy: true,
        },
        {
            Header: "Progress Card Type",
            accessor: "progressCardType",
            disableSortBy: true,
        },
        {
            Header: "Progress Card",
            filterable: false,
            accessor: "progressCard",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return (
                    <div>
                        <MenuOptionHrtl actionOptions={progressCardActions} rowId={original?.rowId} />
                    </div>
                );
            },
        },
    ];
}

export const generateTableData = (data: any) => {
    const result: any = [];
    data.forEach((item: any) => {
        const base = {
            curriculumName: item.curriculumName,
            className: item.className,
            classShortName: item.classShortName,
            progressCardType: item.progressCardType,
            processType: item.processType,
            branchId: item.branchId,
            academicYearId: item.academicYearId,
            branchClassId: item.branchClassId,
            branchCurriculumId: item.branchCurriculumId,
        };
        if (Array.isArray(item.examinationJson)) {
            item.examinationJson.forEach((exam: any) => {
                result.push({
                    ...base,
                    rowId: nanoid(),
                    parentId: item.id,
                    id: exam.id,
                    generationType: exam.generationType,
                    name: exam.name,
                    shortName: exam.shortName,
                    displayTypes: Array.isArray(exam.displayTypes) ? exam.displayTypes : [],
                    isFeeCheckEnabled: !!exam.isFeeCheckEnabled,
                });
            });
        }

        if (Array.isArray(item.termJson)) {
            item.termJson.forEach((term: any) => {
                result.push({
                    ...base,
                    rowId: nanoid(),
                    parentId: item.id,
                    id: term.id,
                    generationType: term.generationType,
                    name: term.name,
                    shortName: term.shortName,
                    displayTypes: Array.isArray(term.displayTypes) ? term.displayTypes : [],
                    isFeeCheckEnabled: !!term.isFeeCheckEnabled,
                });
            });
        }
    });

    return result;
};
