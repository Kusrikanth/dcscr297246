import { useEffect, useMemo, useRef, useState } from "react";
import { generateColumns } from "./helper";
import { ModalContainerUpdated, SelectInput, TableExpandable } from "../../../Components/Common";
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { exportBranchWiseAdmAnalysisNewAct } from "../../../store/FrontDesk/Reports/reportsactions";
import { generateActionPayload } from "../../../utility/reduxutility";
import { setBranchWiseAdmAnalysisAct } from "../../../store/FrontDesk/Reports/reportsslice";
import ExportModal from "../../Directory/StudentManagement/ExportModal";
import ExportIcon from "../../../assets/imagesdps/common_icon/export_icon.svg";
import { useModal } from "../../../hooks/modalhook";
import { UncontrolledTooltip } from "reactstrap";
import { toast } from "react-toastify";
import { downloadExcelFile } from "../../../utility/commonutility";
import { exportSectionWiseLanguageAct, getSecondLangListAct, getSectionWiseLanguageAct, getThirdLangListAct } from "../../../store/academic/academicRequest/academicrequestactions";
import Button from "../../../Components/Common/Button";

const initialValues = {
    academicYearId: "",
};

const SectionWiseLanguage = () => {
    const dispatch = useAppDispatch();
    const [tableData, setTableData] = useState<any[]>([]);
    const [filterState, setFilterState] = useState(initialValues);
    const { closeModal: closeExportModal, openModal: openExportModal, modalState: exportModalState } = useModal()

    const { currentBranchIdResp: branchId, currentInstIdResp: instituteId,
        getSectionWiseLanguageResp, academicYearListResp, getThirdLangListResp, getSecondLangListResp, exportSectionWiseLanguageResp,
    } = useAppSelector(
        ({ appData, instAcademics, academicRequest }) => ({
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            getSectionWiseLanguageResp: academicRequest.getSectionWiseLanguageResp,
            getThirdLangListResp: academicRequest.getThirdLangListResp,
            getSecondLangListResp: academicRequest.getSecondLangListResp,
            exportSectionWiseLanguageResp: academicRequest.exportSectionWiseLanguageResp,
            academicYearListResp: instAcademics.academicYearListResp,
        }),
        shallowEqual
    );

    const sectionWiseLanguageRef = useRef({
        prevExportSectionWiseLanguageResp: exportSectionWiseLanguageResp,
    });

    useEffect(() => {
        const { prevExportSectionWiseLanguageResp } = sectionWiseLanguageRef.current;
        if (exportSectionWiseLanguageResp && exportSectionWiseLanguageResp !== prevExportSectionWiseLanguageResp) {
            toast.success("Exported successfully");
            closeExportModal()
            downloadExcelFile(exportSectionWiseLanguageResp, "section_wise_language");
        }
        sectionWiseLanguageRef.current.prevExportSectionWiseLanguageResp = exportSectionWiseLanguageResp;

    }, [exportSectionWiseLanguageResp]);

    const getSecondLangApiCall = (otherProps?: any) => {
        const payload = {
            branchId, academicYearId: filterState.academicYearId, languageType: "SECOND LANGUAGE", ...otherProps
        }
        dispatch(getSecondLangListAct(generateActionPayload('get_all_language_list', undefined, payload)))
    }

    const getThirdLangApiCall = (otherProps?: any) => {
        const payload = {
            branchId, academicYearId: filterState.academicYearId, languageType: "THIRD LANGUAGE", ...otherProps
        }
        dispatch(getThirdLangListAct(generateActionPayload('get_all_language_list', undefined, payload)))
    }

    const sectionWiseLangugaeApiCall = (otherProps?: any) => {
        const payload = {
            branchId,
            instituteId,
            ...filterState,
            ...otherProps,
        };
        dispatch(getSectionWiseLanguageAct(generateActionPayload('get_section_wise_language', undefined, payload)))
    }

    const exportSubmitHndlr = () => {
        const payload = { branchId, instituteId, ...filterState }
        dispatch(exportSectionWiseLanguageAct(generateActionPayload("export_section_wise_language", undefined, payload, {
            responseType: 'blob'
        })));
    }

    useEffect(() => {
        return () => {
            dispatch(setBranchWiseAdmAnalysisAct(undefined))
        }
    }, [])

    useEffect(() => {
        if (branchId && academicYearListResp) {
            const { academicYearId = "" } = academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current") || {};
            if (academicYearId) {
                sectionWiseLangugaeApiCall({ academicYearId })
                setFilterState({ ...filterState, academicYearId })
                getSecondLangApiCall({ academicYearId })
                getThirdLangApiCall({ academicYearId })
            }
        }
    }, [branchId, academicYearListResp, instituteId])

    const mergedUniqueLanguages = useMemo(() => {
        return Array.from([...(getThirdLangListResp || []), ...(getSecondLangListResp || [])].reduce(
            (acc, curr) => {
                acc.set(curr.languageId, curr);
                return acc;
            },
            new Map()
        )?.values())
    }, [getThirdLangListResp, getSecondLangListResp]);

    useEffect(() => {
        if (Array.isArray(getSectionWiseLanguageResp) && mergedUniqueLanguages.length > 0) {

            const modifiedResp = getSectionWiseLanguageResp.reduce((acc: any[], curr: any) => {

                const { classId, className, classShortName, curriculumId, curriculumName, sectionId, sectionName, secondLanguages = [], thirdLanguages = [] } = curr || {}

                const secondLangObj = secondLanguages?.reduce((ac: any, cur: any) => {
                    ac = { ...ac, [`second-${cur?.languageName}`]: (cur?.studentCount || 0) }
                    return ac
                }, {})

                const thirdLangObj = thirdLanguages?.reduce((ac: any, cur: any) => {
                    ac = { ...ac, [`third-${cur?.languageName}`]: (cur?.studentCount || 0) }
                    return ac
                }, {})

                const sectionObj = {
                    sectionId, sectionName, showName: sectionName,
                    ...secondLangObj, ...thirdLangObj
                }

                const classObj = {
                    classId, className, showName: classShortName,
                    subRows: [sectionObj]
                }

                // Find same curriculum Data
                const findCurriculumIdx = acc?.findIndex((item: any) => +item.curriculumId === +curr.curriculumId);

                if (findCurriculumIdx > -1) {

                    // Find same class Data
                    const findClassIdx = acc[findCurriculumIdx]?.subRows?.findIndex((item: any) => +item.classId === +curr.classId);

                    if (findClassIdx > -1) {
                        acc[findCurriculumIdx].subRows[findClassIdx].subRows = [...acc[findCurriculumIdx]?.subRows[findClassIdx]?.subRows, sectionObj]
                    } else {
                        acc[findCurriculumIdx].subRows = [...acc[findCurriculumIdx]?.subRows, { ...classObj }]
                    }

                } else {
                    acc = [...acc, {
                        curriculumId, curriculumName, showName: "Total",
                        subRows: [classObj]
                    }]
                }
                return acc
            }, []).map((item: any) => {

                const classLevelTotal = item?.subRows?.map((item1: any) => {
                    const data = item1?.subRows?.reduce((acc: any, curr: any) => {
                        mergedUniqueLanguages.map((i: any) => {
                            acc = { ...acc, [`second-${i?.languageName}`]: (acc[`second-${i?.languageName}`] || 0) + (curr[`second-${i?.languageName}`] || 0), [`third-${i?.languageName}`]: (acc[`third-${i?.languageName}`] || 0) + (curr[`third-${i?.languageName}`] || 0) }
                        })
                        return acc
                    }, {})
                    return {
                        ...item1, ...data
                    }
                })

                const curriculumLevelTotal = classLevelTotal?.reduce((acc: any, curr: any) => {
                    mergedUniqueLanguages.map((i: any) => {
                        acc = { ...acc, [`second-${i?.languageName}`]: (acc[`second-${i?.languageName}`] || 0) + (curr[`second-${i?.languageName}`] || 0), [`third-${i?.languageName}`]: (acc[`third-${i?.languageName}`] || 0) + (curr[`third-${i?.languageName}`] || 0) }
                    })
                    return acc
                }, {})
                return { ...item, ...curriculumLevelTotal, subRows: classLevelTotal }
            })
            setTableData(modifiedResp)
        } else {
            setTableData([])
        }
    }, [getSectionWiseLanguageResp, mergedUniqueLanguages])

    const onChangeHndler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (value) {
            setFilterState({ ...filterState, [name]: value });
            sectionWiseLangugaeApiCall({ [name]: value });
            getSecondLangApiCall({ [name]: value })
            getThirdLangApiCall({ [name]: value })
        }
    };

    const { data: academicYearList } = academicYearListResp || {};

    const expandableTableColumns = useMemo(() => generateColumns(getSecondLangListResp, getThirdLangListResp), [tableData, getSecondLangListResp, getThirdLangListResp]);

    const defaultExpanded = useMemo(() => {
        const expanded: any = {};
        tableData.forEach((_, index) => {
            expanded[`${index}`] = true;
        });
        return expanded;
    }, [tableData]);

    return (
        <>
            <div className="class-wise-admission-analysis-container">

                <div className="tw-bg-white tw-rounded-lg tw-shadow tw-pb-1">

                    <div className="tw-py-2 tw-px-4 tw-border-b">
                        <div className="tw-flex tw-flex-wrap tw-items-center tw-gap-y-3">

                            <div className="tw-w-full lg:tw-w-1/3 tw-py-2">
                                <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                                    Section Wise Languages
                                </h4>
                            </div>

                            <div className="tw-ml-auto">
                                <div className="tw-flex tw-items-center">
                                    <Button
                                        id="export-btn"
                                        variant="exportBtn"
                                        onClick={openExportModal}
                                    >
                                        <img src={ExportIcon} className="tw-h-5 tw-w-5" />
                                    </Button>

                                    <UncontrolledTooltip placement="bottom" target="export-btn">
                                        Export
                                    </UncontrolledTooltip>
                                </div>
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
                                    divClass="table-responsive  table-expandable table-sticky tw-h-[468px]"
                                    theadClass="tw-text-gray-600 tw-align-middle theadPrimary"
                                    tableClass="table-bordered table-nowrap"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ModalContainerUpdated
                id="export-section-wise-language-modal"
                isOpen={exportModalState.showModal}
                toggle={closeExportModal}
                modalTitle="Export Section Wise Languages"
                modalSize="md"
            >
                <ExportModal
                    isOpen={exportModalState.showModal}
                    toggle={closeExportModal}
                    instituteId={instituteId}
                    branchId={branchId}
                    submitHndlr={exportSubmitHndlr}
                    feature="academic"
                    subFeature={"section_wise_languages"}
                    remarksText="Enter remarks to export section wise languages?"
                />
            </ModalContainerUpdated>
        </>
    );
};

export default SectionWiseLanguage;
