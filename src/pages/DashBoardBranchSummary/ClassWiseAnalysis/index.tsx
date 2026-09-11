import { useEffect, useMemo, useState } from "react";
import { generateColumns } from "./helper";
import { SelectInput, TableExpandable } from "../../../Components/Common";
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { generateActionPayload } from "../../../utility/reduxutility";
import { setBranchWiseAdmAnalysisAct } from "../../../store/FrontDesk/Reports/reportsslice";
import { getClassWiseGenderAnalysisAct } from "../../../store/academic/academicRequest/academicrequestactions";
import { getCurriculumWIseClassAct } from "../../../store/branchsettings/branchacademics/branchacademicsactions";

const initialValues = {
    academicYearId: "",
};

const ClassWiseAnalysis = () => {
    const dispatch = useAppDispatch();
    const [tableData, setTableData] = useState<any[]>([]);
    const [filterState, setFilterState] = useState(initialValues);

    const { currentBranchIdResp: branchId, currentInstIdResp: instituteId,
         academicYearListResp, curriculumWiseResp, getClassWiseGenderAnalysisResp
    } = useAppSelector(
        ({ appData, instAcademics, academicRequest, branchAcademics }) => ({
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            academicYearListResp: instAcademics.academicYearListResp,
            curriculumWiseResp: branchAcademics.curriculumWiseResp,
            getClassWiseGenderAnalysisResp: academicRequest.getClassWiseGenderAnalysisResp,

        }),
        shallowEqual
    );

    useEffect(() => {
        return () => {
            dispatch(setBranchWiseAdmAnalysisAct(undefined))
        }
    }, [])

    useEffect(() => {
        if (branchId && academicYearListResp) {
            const { academicYearId = "" } = academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current") || {};
            if (academicYearId) {
                setFilterState({ ...filterState, academicYearId })
                dispatch(getCurriculumWIseClassAct(generateActionPayload("get_curriculum_wise_class", undefined, { branchId, academicYearId })));
                dispatch(getClassWiseGenderAnalysisAct(generateActionPayload("get_class_wise_gender_analysis", undefined, { branchId, academicYearId })));
            }
        }
    }, [branchId, academicYearListResp, instituteId])

    useEffect(() => {
        if (getClassWiseGenderAnalysisResp && curriculumWiseResp) {
            const classDetailsMap = new Map();

            Object.entries(curriculumWiseResp).forEach(([curriculumName, classes]: [string, any]) => {
                (classes as any[]).forEach((classItem) => {
                    classDetailsMap.set(classItem.id.toString(), {
                        classId: classItem.id,
                        className: classItem.className,
                        classShortName: classItem.shortName,
                        curriculumId: classItem.curriculumId,
                        curriculumName: classItem.curriculumName,
                        classSequence: classItem.classSequence
                    });
                });
            });

            const modifiedResp = Object.entries(getClassWiseGenderAnalysisResp).reduce((acc: any[], [curriculumName, classData]: [string, any]) => {

                const classesArray = Object.entries(classData).map(([classId, genderData]: [string, any]) => {
                    const classDetails = classDetailsMap.get(classId);

                    if (!classDetails) return null;

                    return {
                        classId: classDetails.classId,
                        className: classDetails.className,
                        showName: classDetails.classShortName,
                        curriculumId: classDetails.curriculumId,
                        curriculumName: classDetails.curriculumName,
                        classSequence: classDetails.classSequence,
                        total: genderData.TOTAL || 0,
                        male: genderData.MALE || 0,
                        female: genderData.FEMALE || 0,
                        others: genderData.OTHERS || 0,
                    };
                }).filter(Boolean);

                classesArray.sort((a: any, b: any) => a.classSequence - b.classSequence);

                if (classesArray.length > 0) {
                    const curriculumTotal = classesArray.reduce((totals, classItem: any) => ({
                        total: totals.total + classItem.total,
                        male: totals.male + classItem.male,
                        female: totals.female + classItem.female,
                        others: totals.others + classItem.others,
                    }), { total: 0, male: 0, female: 0, others: 0 });

                    const firstClass: any = classesArray[0];
                    acc.push({
                        curriculumId: firstClass.curriculumId,
                        curriculumName: firstClass.curriculumName,
                        showName: "Total",
                        ...curriculumTotal,
                        subRows: classesArray,
                    });
                }

                return acc;
            }, []);

            setTableData(modifiedResp);
        } else {
            setTableData([]);
        }
    }, [getClassWiseGenderAnalysisResp, curriculumWiseResp]);

    const onChangeHndler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (value) {
            setFilterState({ ...filterState, [name]: value });
            dispatch(getCurriculumWIseClassAct(generateActionPayload("get_curriculum_wise_class", undefined, { branchId, academicYearId: value })));
            dispatch(getClassWiseGenderAnalysisAct(generateActionPayload("get_class_wise_gender_analysis", undefined, { branchId, academicYearId: value })));
        }
    };

    const { data: academicYearList } = academicYearListResp || {};

    const expandableTableColumns = useMemo(() => generateColumns(), []);
    return (
        <>
            <div className="class-wise-admission-analysis-container">

                <div className="tw-bg-white tw-rounded-lg tw-shadow">

                    <div className="tw-py-2 tw-px-4 tw-border-b">
                        <div className="tw-flex tw-flex-wrap tw-items-center tw-gap-y-3">

                            <div className="tw-w-full lg:tw-w-1/3 tw-py-2">
                                <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                                    Class Wise Analysis
                                </h4>
                            </div>
                        </div>
                    </div>

                    <div className="tw-p-0">

                        <div className="branch-wise-drill-down-table-container">
                            <div className="tw-flex tw-flex-wrap tw-gap-3 tw-px-2 tw-py-3 tw-w-full tw-mx-auto">

                                <div className="tw-w-1/2 lg:tw-w-1/4 2xl:tw-w-1/6">
                                    <SelectInput
                                        name="academicYearId"
                                        value={filterState.academicYearId}
                                        onChange={onChangeHndler}
                                        menuItems={academicYearList || []}
                                        valueKey="academicYearId"
                                        textKey="academicYearName"
                                        formgroupClassName="tw-mb-0"
                                        labelText="Academic Year"
                                        floatingLabel
                                    />
                                </div>
                            </div>
                            <div>
                                <TableExpandable
                                    columns={expandableTableColumns || []}
                                    data={Array.isArray(tableData) ? tableData : []}
                                    divClass="table-responsive tw-mb-3 table-expandable table-sticky tw-h-[468px]"
                                    theadClass="tw-text-gray-600 tw-align-middle theadPrimary"
                                    tableClass="table-bordered table-nowrap"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
};

export default ClassWiseAnalysis;
