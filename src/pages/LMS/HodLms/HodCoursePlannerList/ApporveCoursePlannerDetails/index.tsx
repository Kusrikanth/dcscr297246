import { useEffect, useMemo, useRef, useState } from "react";
import {
    buildUnitsTableFromBuildDTO,
    buildChaptersTableFromBuildDTO,
    buildTopicsTableFromBuildDTO,
    TreeContextProvider,
    generateColumns,
    convertBuildDTOToTree
} from "./helper";
import { ModuleTree } from "./TreeComponent";
import TableContainer from "../../../../../Components/Common/TableContainer";
import UpdatedHorizontalTab from "../../../../../Components/Common/UpdatedHorizontalTab";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02Icon, ViewIcon, Cancel01Icon } from "@hugeicons-pro/core-stroke-standard";
import { ModalContainerUpdated, OffCanvasContainer } from "../../../../../Components/Common";
import { AdvanceFilterModal } from "./AdvanceFilterModal";
import { useHistory, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
import { getCurriculumStructureAct, getinlineBuilderGridAct, getWeeksListAct } from "../../../../../store/lms/lmsdigitalcurriculum/lmsdigitalcurriculumaction";
import { generateActionPayload } from "../../../../../utility/reduxutility";
import { shallowEqual } from "react-redux";
import { getAcademicDetailsListAct, getAcademicTermDetailsListAct } from "../../../../../store/lms/lmssettings/lmssettingsaction";
import { toast } from "react-toastify";
import { useModal } from "../../../../../hooks/modalhook";
import ConfirmationModal from "./ConfirmationModal";

const ApporveCoursePlannerDetails = () => {
    const dispatch = useAppDispatch();
    const location: any = useLocation();
    const history = useHistory();
    const { closeModal: closeFeedsStateModal, modalState: feedsStateModal, openModal: openFeedsStateModal } = useModal();
    const [selectedNodeId, setSelectedNodeId] = useState<string>("");
    const [selectedNodeInfo, setSelectedNodeInfo] = useState<any>(null);
    const [activeId, setActiveId] = useState("units");
    const [open, setOpen] = useState<boolean>(false);
    const [selectedRowData, setSelectedRowData] = useState<any>();
    const [filterData, setFilterData] = useState<any>(null);

    const toggleAdvanceFilter = () => {
        setOpen((prev) => !prev);
    };
    const [expandCollapseState, setExpandCollapseState] = useState<any>({
        action: "",
        ids: [],
    });

    const {
        getinlineBuilderGridResp,
        getCurriculumStructureResp,
        academicYearListResp,
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        getAcademicDetailsListResp,
        lmsdigitalcurriculumErrorAct,
        saveSubjectCurriculumBuildResp,
        sendBuildReviewResp
    } = useAppSelector(
        ({ lmsdigitalcurriculum, instAcademics, appData, lmsSettings }) => ({
            getinlineBuilderGridResp: lmsdigitalcurriculum.getinlineBuilderGridResp,
            getCurriculumStructureResp: lmsdigitalcurriculum.getCurriculumStructureResp,
            academicYearListResp: instAcademics.academicYearListResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            getAcademicDetailsListResp: lmsSettings.getAcademicDetailsListResp,
            lmsdigitalcurriculumErrorAct: lmsdigitalcurriculum.lmsdigitalcurriculumErrorAct,
            saveSubjectCurriculumBuildResp: lmsdigitalcurriculum.saveSubjectCurriculumBuildResp,
            sendBuildReviewResp: lmsdigitalcurriculum.sendBuildReviewResp
        }),
        shallowEqual
    );
      const inspectRef = useRef<any>({
        prevSaveSubjectCurriculumBuildResp: saveSubjectCurriculumBuildResp,
        prevLmsdigitalcurriculumErrorAct: lmsdigitalcurriculumErrorAct,
        prevSendBuildReviewResp: sendBuildReviewResp
      });
    
      useEffect(() => {
        const { prevSaveSubjectCurriculumBuildResp, prevLmsdigitalcurriculumErrorAct, prevSendBuildReviewResp } = inspectRef.current;
         if (lmsdigitalcurriculumErrorAct && lmsdigitalcurriculumErrorAct !== prevLmsdigitalcurriculumErrorAct) {
            const { message } = lmsdigitalcurriculumErrorAct
            toast.error(message || "Something went wrong");
        }
        else if (sendBuildReviewResp && sendBuildReviewResp !== prevSendBuildReviewResp) {
            history.push("/course-planner");
        }
        else if (saveSubjectCurriculumBuildResp && saveSubjectCurriculumBuildResp !== prevSaveSubjectCurriculumBuildResp) {
          toast.success("Subject curriculum updated successfully");
          toggleAdvanceFilter();
          getCurriculumStructure({ subjectCurriculumId: location?.state?.digitalCurriculumId });
        }
     
        inspectRef.current.prevAcademicYearListResp = saveSubjectCurriculumBuildResp;
        inspectRef.current.prevLmsdigitalcurriculumErrorAct = lmsdigitalcurriculumErrorAct;
        inspectRef.current.prevSendBuildReviewResp = sendBuildReviewResp;
      }, [saveSubjectCurriculumBuildResp, lmsdigitalcurriculumErrorAct, sendBuildReviewResp]);

    const expandCollapseHndlr = (action: string, ids?: string[]) => {
        setExpandCollapseState({ action, ids: ids ?? [] });
    };

    const MenuOptions = [
        {
            id: "units",
            labelName: "Units",
            customPadding: "",
            count: getCurriculumStructureResp?.buildStatsDTO?.unitsCovered || 0
        },
        {
            id: "chapters",
            labelName: "Chapters",
            customPadding: "",
            count: getCurriculumStructureResp?.buildStatsDTO?.chaptersCovered || 0
        },
        {
            id: "topics",
            labelName: "Topics",
            customPadding: "",
            count: getCurriculumStructureResp?.buildStatsDTO?.topicsCovered || 0
        },
    ];

    function clickMenuHandler(event: any) {
        const id = event.currentTarget.getAttribute("data-id");
        setActiveId(id);
    }

    useEffect(() => {
        const { data } = academicYearListResp || {};
        if (Array.isArray(data) && data.length > 0) {
            const currentYear =
                data.find((year: any) => year.yearStatus?.toUpperCase() === "CURRENT") || data[0];

                setFilterData(currentYear);

            
            if (getAcademicDetailsListResp && Array.isArray(getAcademicDetailsListResp)) {
                const data = getAcademicDetailsListResp.find((item: any) => +item.academicYearId === +currentYear?.academicYearId);
                let payload = {
                    courseAcademicYearId: data.id
                };
                dispatch(getAcademicTermDetailsListAct(generateActionPayload("get_academic_term_details_list", undefined, payload)));
            }
        }
    }, [academicYearListResp, getAcademicDetailsListResp]);

    const buildDTO = getCurriculumStructureResp?.subjectCurriculumBuildDTO;

    const unitsTableData = useMemo(() =>
        buildDTO ? buildUnitsTableFromBuildDTO(buildDTO.unitsBuild) : [],
        [buildDTO]
    );

    const chaptersTableData = useMemo(() =>
        buildDTO ? buildChaptersTableFromBuildDTO(buildDTO.unitsBuild) : [],
        [buildDTO]
    );

    const topicsTableData = useMemo(() =>
        buildDTO ? buildTopicsTableFromBuildDTO(buildDTO.unitsBuild) : [],
        [buildDTO]
    );

    const getTableData = () => {
        if (activeId === "units") return unitsTableData;
        if (activeId === "chapters") return chaptersTableData;
        if (activeId === "topics") return topicsTableData;
        return [];
    };

    useEffect(() => {
        expandCollapseHndlr("EXPAND_ALL");
    }, [activeId]);

    const treeData = useMemo(() => {
        if (buildDTO) {
            return convertBuildDTOToTree(buildDTO);
        }
        return [];
    }, [buildDTO]);

    const getFilteredTableData = () => {
        const table = getTableData();
        if (!selectedNodeInfo) return table;

        const id = Number(selectedNodeInfo.id);

        if (activeId === "units") {
            if (selectedNodeInfo.level === 1) {
                return table.filter((row: any) => row.unitId === id);
            }
            if (selectedNodeInfo.level === 2) {
                const selectedChapter = chaptersTableData.find((ch: any) => ch.chapterId === id);
                if (selectedChapter) {
                    return table.filter((row: any) => row.unitId === selectedChapter.unitId);
                }
            }
            if (selectedNodeInfo.level === 3) {
                const selectedTopic = topicsTableData.find((t: any) => t.topicId === id);
                if (selectedTopic) {
                    return table.filter((row: any) => row.unitId === selectedTopic.unitId);
                }
            }
            return table;
        }

        if (activeId === "chapters") {
            if (selectedNodeInfo.level === 1) {
                return table.filter((row: any) => row.unitId === id);
            }
            if (selectedNodeInfo.level === 2) {
                return table.filter((row: any) => row.chapterId === id);
            }
            if (selectedNodeInfo.level === 3) {
                const selectedTopic = topicsTableData.find((t: any) => t.topicId === id);
                if (selectedTopic) {
                    return table.filter((row: any) => row.chapterId === selectedTopic.chapterId);
                }
            }
            return table;
        }

        if (activeId === "topics") {
            if (selectedNodeInfo.level === 1) {
                return table.filter((row: any) => row.unitId === id);
            }
            if (selectedNodeInfo.level === 2) {
                return table.filter((row: any) => row.chapterId === id);
            }
            if (selectedNodeInfo.level === 3) {
                return table.filter((row: any) => row.topicId === id);
            }
        }

        return table;
    };

    const handleInspect = (rowId: string) => {
        
        const table = getTableData();
        
        let filteredTable = table;
        if (selectedNodeInfo) {
            const id = Number(selectedNodeInfo.id);
            if (activeId === "units" && selectedNodeInfo.level === 1) {
                filteredTable = table.filter((row: any) => row.unitId === id);
            } else if (activeId === "chapters") {
                if (selectedNodeInfo.level === 1) {
                    filteredTable = table.filter((row: any) => row.unitId === id);
                } else if (selectedNodeInfo.level === 2) {
                    filteredTable = table.filter((row: any) => row.chapterId === id);
                }
            } else if (activeId === "topics") {
                if (selectedNodeInfo.level === 1) {
                    filteredTable = table.filter((row: any) => row.unitId === id);
                } else if (selectedNodeInfo.level === 2) {
                    filteredTable = table.filter((row: any) => row.chapterId === id);
                } else if (selectedNodeInfo.level === 3) {
                    filteredTable = table.filter((row: any) => row.topicId === id);
                }
            }
        }
                
        const row = filteredTable.find((row: any) => String(row.id) === String(rowId));
        
        setSelectedRowData(row);
        toggleAdvanceFilter();
    };

    const handleClearFilter = () => {
        setSelectedNodeId("");
        setSelectedNodeInfo(null);
    };

    const getAcademicYearDetailsApiCall = (otherProps?: any) => {
        let payload = {
            instituteId,
            branchId
        };
        dispatch(getAcademicDetailsListAct(generateActionPayload("get_academic_details_list", undefined, payload)));
    };

    const getCurriculumStructure = ({ subjectCurriculumId }) => {
        dispatch(getCurriculumStructureAct(generateActionPayload("get_curriculum_structure", { subjectCurriculumId: subjectCurriculumId }, undefined)));
    };

    const getInlineBuilderGrid = ({ subjectCurriculumId }) => {
        dispatch(getinlineBuilderGridAct(generateActionPayload("get_inline_builder_grid", { subjectCurriculumId: subjectCurriculumId }, undefined)));
    };

    useEffect(() => {
        if (location?.state?.digitalCurriculumId) {
            getCurriculumStructure({ subjectCurriculumId: location?.state?.digitalCurriculumId });
            // getInlineBuilderGrid({ subjectCurriculumId: location?.state?.digitalCurriculumId });
        }
    }, [location?.state?.digitalCurriculumId]);

    useEffect(() => {
        getAcademicYearDetailsApiCall();
    }, []);

    const menuOptions = useMemo(
        () =>
            [
                {
                    id: "inspect",
                    actionName: "Inspect",
                    actionIcon: (
                        <HugeiconsIcon icon={ViewIcon} className="text-muted me-2" size={18} />
                    ),
                    onClickHndlr: (event: any) => {
                        const rowId = event.currentTarget.getAttribute("data-id");
                        handleInspect(rowId);
                    },
                },
                {
                    id: "delete",
                    actionName: "Delete",
                    actionIcon: (
                        <HugeiconsIcon icon={Delete02Icon} className="text-danger me-2" size={18} />
                    ),
                    onClickHndlr: (id: any) => {},
                },
            ],
        [activeId, unitsTableData, chaptersTableData, topicsTableData, selectedNodeInfo]
    );

    const tableColumns = useMemo(
        () => generateColumns(activeId, menuOptions),
        [activeId, menuOptions]
    );

    const addFeedsHandler = () => {
            openFeedsStateModal();
           
        }

    return (
        <>
            <div className="page-content">
                <div className="container-fluid">
                    <div className="tw-grid tw-grid-cols-12 tw-gap-4">
                        <div className="tw-col-span-12">
                            <div className="tw-overflow-hidden tw-flex tw-flex-col tw-rounded-xl tw-shadow-lg tw-bg-white tw-px-5 tw-py-3">
                                <h4 className="tw-text-[16px] tw-font-semibold tw-text-gray-800 tw-my-2">
                                    Curriculum Planner
                                </h4>
                                <p>Plan, refine and deliver your lessons seamlessly.</p>
                            </div>
                        </div>
                        <div className="tw-col-span-12">
                            <div className="row g-3">
                                {[
                                    { label: "UNITS COVERED", count: getCurriculumStructureResp?.buildStatsDTO?.unitsCovered || 0, subtitle: "Great progress", color: "#F3E8FF" },
                                    { label: "CHAPTERS PLANNED", count: getCurriculumStructureResp?.buildStatsDTO?.chaptersCovered || 0, subtitle: "Keep going!", color: "#E8F2FF" },
                                    { label: "TOPICS READY", count: getCurriculumStructureResp?.buildStatsDTO?.topicsCovered || 0, subtitle: "You're ahead", color: "#fff7e6" },
                                    { label: "TEACHING HOURS", count: "68h", subtitle: "On track", color: "#E8FFF1" },
                                    { label: "LO COVERAGE", count: "85%", subtitle: "Well done", color: "#fff2e8" },
                                ].map((item, i) => (
                                    <div key={i} className="col-auto" style={{ width: "20%" }}>
                                        <div className="tw-rounded-xl tw-shadow-lg tw-bg-white tw-p-4 tw-text-start" style={{ backgroundColor: item.color }}>
                                            <p className="tw-text-xs tw-text-gray-600 tw-mb-1 tw-font-medium">{item.label}</p>
                                            <h3 className="tw-text-3xl tw-font-bold tw-mb-1">{item.count}</h3>
                                            <p className="tw-text-sm tw-text-gray-500 tw-mb-0">{item.subtitle}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="tw-col-span-12 lg:tw-col-span-4 ">
                            <div className="tw-flex tw-flex-col tw-rounded-xl tw-shadow-lg tw-bg-white tw-h-[620px] tw-mb-4 tw-overflow-hidden">
                                <div className="tw-border-b tw-px-4 tw-py-3 tw-flex tw-items-center tw-justify-between">
                                    <h4 className="tw-text-[16px] tw-font-semibold tw-text-gray-800 tw-my-2">
                                        Curriculum Structure
                                    </h4>
                                </div>
                                <div className="tw-flex-1 tw-overflow-y-auto tw-scrollbar-thin tw-scrollbar-thumb-gray-300 tw-scrollbar-track-gray-100 tw-px-4 tw-py-2">
                                    <TreeContextProvider.Provider
                                        value={{ value: expandCollapseState, toggle: expandCollapseHndlr }}
                                    >
                                        {treeData?.map((node) => (
                                            <ModuleTree
                                                key={node.id}
                                                parentsInfo={[]}
                                                parentFeatureId=""
                                                selectedNodeId={selectedNodeId}
                                                setSelectedNodeId={setSelectedNodeId}
                                                setSelectedNodeInfo={setSelectedNodeInfo}
                                                setActiveId={setActiveId}
                                                {...node}
                                            />
                                        ))}
                                    </TreeContextProvider.Provider>
                                </div>
                            </div>
                        </div>
                        <div className="tw-col-span-12 lg:tw-col-span-8">
                            <div className="tw-flex tw-flex-col tw-rounded-xl tw-shadow-lg tw-bg-white tw-h-[620px]">
                                <div className="tw-border-b tw-px-4 tw-py-3 d-flex tw-items-center">
                                    <h4 className="tw-text-[16px] tw-font-semibold tw-text-gray-800 tw-my-2">
                                        Inline Builder Grid
                                    </h4>
                                    <div className="ms-auto">
                                        <UpdatedHorizontalTab
                                            MenuOptions={MenuOptions}
                                            clickMenuHandler={clickMenuHandler}
                                            activeTabId={activeId}
                                            horizontalClass="horizontal-menu-pill-tabs tw-w-fit"
                                        />
                                    </div>
                                </div>
                                {selectedNodeInfo && (
                                    <div className="tw-px-4 tw-py-2 tw-bg-blue-50 tw-border-b tw-border-blue-200">
                                        <div className="tw-flex tw-items-center tw-justify-between">
                                            <p className="tw-text-sm tw-text-blue-800 tw-mb-0">
                                                <span className="tw-font-semibold">Filtered by:</span> {selectedNodeInfo.description}
                                            </p>
                                            <button
                                                onClick={handleClearFilter}
                                                className="tw-text-sm tw-text-blue-600 hover:tw-text-blue-800 tw-font-medium"
                                            >
                                                Show All
                                            </button>
                                        </div>
                                    </div>
                                )}
                                <div className="tw-flex-1 tw-overflow-y-auto tw-scrollbar-thin tw-scrollbar-thumb-gray-300 tw-scrollbar-track-gray-100">
                                    <TableContainer
                                        columns={tableColumns || []}
                                        data={getFilteredTableData()}
                                        tableClass="mb-0"
                                        divClass="table-responsive tw-h-[490px] mb-3 border"
                                        theadClass="table-light text-muted align-middle"
                                        showCheckbox={false}
                                        showPagination={false}
                                        totalPages={0}
                                        totalRecords={0}
                                        callbackPaginationHndlr={() => { }}
                                        currentPageNumber={0}
                                    />
                                </div>
                                 <div className="ms-auto text-center tw-mb-4 tw-mr-3">
                                                <button className="btn btn-primary me-2" onClick={addFeedsHandler} >
                                                    <div className="d-flex align-items-center">
                                                        <span>Review</span>
                                                    </div>
                                                </button>
                                            </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <OffCanvasContainer
                isOpen={open}
                headerTitle="Inspect"
                closeHndlr={toggleAdvanceFilter}
                id="advance-filter-course-directory-list"
                width={525}
            >
                <AdvanceFilterModal
                    activeIdMain={activeId}
                    closeHndlr={toggleAdvanceFilter}
                    rowData={selectedRowData}
                    subjectCurriculumId={location?.state?.digitalCurriculumId}
                    filterData={filterData}
                />
            </OffCanvasContainer>
            <ModalContainerUpdated
                            id="book-collection"
                            isOpen={feedsStateModal.showModal}
                            toggle={closeFeedsStateModal}
                            modalTitle={`Confirmation for Build Review`}
                            modalSize="md"
                        >
                            <ConfirmationModal
                           subjectCurriculumId={location?.state?.digitalCurriculumId}
                            toggle={() => closeFeedsStateModal()}
                          />
                        </ModalContainerUpdated>
        </>
    );
};

export default ApporveCoursePlannerDetails;