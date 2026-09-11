import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import { IPaginationState } from "../../../../Components/Common/Pagination";
import TableContainer from "../../../../Components/Common/TableContainer";
import AssessmentCards from "./AssessmentCards";
import { HugeiconsIcon } from "@hugeicons/react";
import {
    generateColumns,
    searchInputOptions,
    ignoredKeys,
    statusCountMap
} from "./helper";
import { ConfirmationModal, ModalContainerUpdated, OffCanvasContainer, SearchInput, SelectInput } from "../../../../Components/Common";
import { useFormik } from "formik";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import {
    getBranchClassAct,
    getBranchCurriculumAct,
} from "../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { useHistory } from "react-router-dom";
import { default as FilterSvg } from "../../../../assets/imagesdps/academics/FilterSvg.svg?react";

import {
    AnalysisTextLinkIcon,
    AutoConversationsIcon,
    Calendar03Icon,
    MessageQuestionIcon,
    PassportExpiredIcon,
    PassportValidIcon,
    PencilEdit02Icon,
    StudentIcon,
    Target02Icon,
    Time04Icon,
    TimeQuarter02Icon,
    TradeDownIcon,
    TradeUpIcon,
    UserGroup03Icon,
    Delete02StrokeStandard,
    EyeIcon,
    PlusSignIcon,
    PencilIcon,
    ClockIcon,
    CalendarIcon,
    PlayIcon,
    Megaphone01Icon,
    Calendar02Icon,
    CancelCircleHalfDotIcon,
    LiveStreaming02Icon,
    MessagePreview01Icon,
} from "@hugeicons-pro/core-stroke-standard";
import { getAllAssessmentsAct, getAssessmentStatsAct, savePublishAssessmentAct } from "../../../../store/lms/lmsAssessment/lmsAssessmentaction";
import { useFilterState } from "../../../../hooks/filterhook";
import AdvanceFilterModal from "./AdvancedFilterModal";
import { useModal } from "../../../../hooks/modalhook";
import { deleteCbseWeightageListAct } from "../../../../store/examination/examinationsettings/examinationsettingsaction";
import { toast } from "react-toastify";
import RescheduleModal from "./RescheduleModal";

const initialValues = {
    academicYearId: "",
    searchString: "",
    classId: "",
    curriculumId: "",
    nameFilterType: "",
    subjectId: "",
    assessmentStatus: "",
    startDate: null,
    endDate: null,
    assesmentType: "",
    createdBy: "",
};

export const analyticsList = [
    {
        id: "draft",
        label: "Draft",
        // value: "12",
        icon: PencilIcon,
        bgColor: "#E3F2FD",
        textColor: "#0D47A1",
    },
    {
        id: "readyForReview",
        label: "Ready for Review",
        // value: "5",
        icon: ClockIcon,
        bgColor: "#E8F5E9",
        textColor: "#1B5E20",
    },
    {
        id: "approved",
        label: "Approved",
        // value: "18",
        icon: ClockIcon,
        bgColor: "#FCE4EC",
        textColor: "#AD1457",
    },
    // {
    //     id: "scheduled",
    //     label: "Scheduled",
    //     // value: "22",
    //     icon: CalendarIcon,
    //     bgColor: "#F3E5F5",
    //     textColor: "#4A148C",
    // },
    {
        id: "inProgress",
        label: "In Progress",
        // value: "8",
        icon: PlayIcon,
        bgColor: "#EDE7F6",
        textColor: "#4527A0",
    },
    // {
    //     id: "grading",
    //     label: "Grading",
    //     // value: "4",
    //     icon: PassportExpiredIcon,
    //     bgColor: "#FFEBEE",
    //     textColor: "#C62828",
    // },
    {
        id: "resultsPublished",
        label: "Results Published",
        // value: "15",
        icon: TimeQuarter02Icon,
        bgColor: "#FFF3E0",
        textColor: "#E65100",
    },
    {
        id: "archived",
        label: "Archived",
        // value: "40",
        icon: TradeUpIcon,
        bgColor: "#fffad0",
        textColor: "#F57F17",
    },
];

const CreatedAssessmentList = () => {
    const [searchStudentState, setSearchStudentState] = useState("global");
    const { closeModal: closeDelCbseWeightageModal, modalState: deleteCbseWeightageState, openModal: openDelCbseWeightageModal } = useModal();
    const { closeModal: closeRescheduleModal, modalState: rescheduleModalState, openModal: openRescheduleModal } = useModal();
    const [applicationSaleFilter, setApplicationSaleFilter] =
        useState(initialValues);
    const [open, setOpen] = useState<boolean>(false); // Added for Advanced Filter
    const { showClearFilterState, count, advanceFilterChange } = useFilterState(); // Added for Advanced Filter

    const paginationDetailRef = useRef({
        pageNo: 0,
        pageSize: 10,
    });
    const history = useHistory();
    const dispatch = useAppDispatch();

    const signatureForm = useFormik({
        enableReinitialize: true,
        initialValues,
        onSubmit: (values) => { },
    });

    const {
        userDetails,
        userMeResp,
        academicYearListResp,
        getAllAssessmentsResp,
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        brchCurriculumResp,
        branchClassResp,
        showApiLoader,
        savePublishAssessmentResp,
        lmsAssessmentErrorAct,
        saveRescheduleAssessmentResp,
        getAssessmentStatsResp
    }: any = useAppSelector(
        ({ Profile, login, lmsAssessment, appData, branchAcademics, instAcademics, globalData }) => ({
            userDetails: Profile.userDetails,
            userMeResp: login.userMeResp,
            getAllAssessmentsResp: lmsAssessment.getAllAssessmentsResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            branchClassResp: branchAcademics.branchClassResp,
            academicYearListResp: instAcademics.academicYearListResp,
            showApiLoader: globalData.showApiLoader,
            savePublishAssessmentResp: lmsAssessment.savePublishAssessmentResp,
            lmsAssessmentErrorAct: lmsAssessment.lmsAssessmentErrorAct,
            saveRescheduleAssessmentResp: lmsAssessment.saveRescheduleAssessmentResp,
            getAssessmentStatsResp: lmsAssessment.getAssessmentStatsResp

        }),
        shallowEqual
    );


    const instituteRespRef = useRef<any>({
        prevLmsAssessmentErrorAct: lmsAssessmentErrorAct,
        prevSavePublishAssessmentResp: savePublishAssessmentResp,
        prevSaveRescheduleAssessmentResp: saveRescheduleAssessmentResp
    });

    useEffect(() => {
        const { prevLmsAssessmentErrorAct, prevSavePublishAssessmentResp, prevSaveRescheduleAssessmentResp } = instituteRespRef.current;
        if (lmsAssessmentErrorAct && prevLmsAssessmentErrorAct !== lmsAssessmentErrorAct) {
            toast.error(lmsAssessmentErrorAct.details || "Something went wrong.");
        }
        else if (savePublishAssessmentResp && prevSavePublishAssessmentResp !== savePublishAssessmentResp) {
            toast.success("Assessment published successfully.");
            closeDelCbseWeightageModal();
            getAssessmentListApiCall();
        }
        else if (saveRescheduleAssessmentResp && prevSaveRescheduleAssessmentResp !== saveRescheduleAssessmentResp) {
            toast.success("Assessment rescheduled successfully.");
            closeRescheduleModal();
            getAssessmentListApiCall();
        }


        instituteRespRef.current.prevLmsAssessmentErrorAct = lmsAssessmentErrorAct;
        instituteRespRef.current.prevSavePublishAssessmentResp = savePublishAssessmentResp;
        instituteRespRef.current.prevSaveRescheduleAssessmentResp = saveRescheduleAssessmentResp;
        // instituteRespRef.current.prevUpdateQuestionBankResp = updateQuestionBankResp;
    }, [lmsAssessmentErrorAct, savePublishAssessmentResp, saveRescheduleAssessmentResp]);


    useEffect(() => {
        const { data } = academicYearListResp || {};
        if (Array.isArray(data) && data.length > 0) {
            const currentYear =
                data.find((year: any) => year.yearStatus?.toUpperCase() === "CURRENT") ||
                data[0];

            if (currentYear?.academicYearId) {
                signatureForm.setFieldValue("academicYearId", currentYear.academicYearId);
                getCurriculumApiCall({ academicYearId: currentYear.academicYearId });
                getAssessmentListApiCall({ academicYearId: currentYear.academicYearId });
                getAssessemntStatsApiCall({ academicYearId: currentYear.academicYearId });
            }
        }
    }, [academicYearListResp, signatureForm.values.classId]);

    const getAssessmentListApiCall = useCallback((otherProps?: any) => {
        const payload = {
            // ...signatureForm.values,
            branchId,
            academicYearId: signatureForm.values.academicYearId,
            curriculumId: signatureForm.values.curriculumId,
            classId: signatureForm.values.classId,
            // subjectId: signatureForm.values.subjectId,
            searchString: signatureForm.values.searchString,
            nameFilterType: signatureForm.values.nameFilterType,
            ...paginationDetailRef.current,
            ...otherProps,
        }
        if (payload.branchId) {
            dispatch(getAllAssessmentsAct(generateActionPayload("get_all_assessment", undefined, payload)));
        }
    }, [branchId, signatureForm.values, dispatch]);

    const getAssessemntStatsApiCall = (otherProps?: any) => {
        const payload = {
            branchId,
            academicYearId: signatureForm.values.academicYearId,
            ...otherProps
        }
        if (payload.branchId) {
            dispatch(getAssessmentStatsAct(generateActionPayload("get_assessment_stats", undefined, payload)));
        }
    }

    // useEffect(() => {
    //     if (branchId) {
    //         getCurriculumApiCall();
    //         getAssessmentListApiCall();
    //     }
    // }, [branchId]);

    useEffect(() => {
        const { curriculumId } = signatureForm.values;
        if (curriculumId) {
            getClassApiCall(curriculumId);
        }
    }, [signatureForm.values.curriculumId]);

    useEffect(() => {
        const { data } = brchCurriculumResp || {};

        if (Array.isArray(data) && data.length > 0) {
            let shortNameToMatch = "";
            const selectedCurriculum = data.find(
                (item) => item.shortName === shortNameToMatch
            );

            if (selectedCurriculum) {
                signatureForm.setValues((prev: any) => ({
                    ...prev,
                    curriculumId: selectedCurriculum.branchCurriculumId,
                }));
            }
        }
    }, [brchCurriculumResp, location.pathname]);
    const getCurriculumApiCall = (otherProps?: any) => {
        const payload1 = {
            instituteId,
            branchId: branchId,
            pageNo: 0,
            pageSize: 100,
            sortBy: "curriculumName",
            orderBy: "asc",
            ...otherProps,
        };
        dispatch(
            getBranchCurriculumAct(
                generateActionPayload("get_brch_curriculum", undefined, payload1)
            )
        );
    };
    function getClassApiCall(curriculumId: string, academicYearId?: string) {
        const payload = {
            pageNo: 0,
            pageSize: 100,
            sortBy: "classSequence",
            orderBy: "asc",
            curriculumId,
            branchId,
            academicYearId: academicYearId || applicationSaleFilter.academicYearId,
        };
        dispatch(
            getBranchClassAct(
                generateActionPayload("get_brch_curriculum_class", undefined, payload)
            )
        );
    }

    const filterHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        paginationDetailRef.current.pageNo = 0;

        const apiPayload: any = { [name]: value };

        signatureForm.setFieldValue(name, value);

        if (name === "academicYearId") {
            getCurriculumApiCall({ academicYearId: value });
            signatureForm.setFieldValue("curriculumId", "");
            signatureForm.setFieldValue("classId", "");
            apiPayload.curriculumId = "";
            apiPayload.classId = "";
        } else if (name === "curriculumId") {
            getClassApiCall(value, signatureForm.values.academicYearId);
            signatureForm.setFieldValue("classId", "");
            apiPayload.classId = "";
        }
        getAssessmentListApiCall(apiPayload);
    }

    const onSearchHandler = (name: string, value: any) => {
        paginationDetailRef.current.pageNo = 0;
        setSearchStudentState((prev) => {
            const updatedFilterType = prev;
            setApplicationSaleFilter((prevState) => {
                const { academicYearId } = academicYearListResp?.data.find((item: any) => item.yearStatus === "CURRENT") || {};
                const updatedState = {
                    ...prevState,
                    searchString: value,
                    nameFilterType: updatedFilterType,
                    academicYearId
                };
                getAssessmentListApiCall(updatedState);
                return updatedState;
            });
            return updatedFilterType;
        });
    };

    const onChangeHandler = (name: string, id: any, item: any) => {
        setSearchStudentState(id);
        paginationDetailRef.current.pageNo = 0;
        setApplicationSaleFilter((prevState) => {
            const { academicYearId } = academicYearListResp?.data.find((item: any) => item.yearStatus === "CURRENT") || {};
            const updatedState = {
                ...prevState,
                nameFilterType: id,
                searchString: "",
                academicYearId
            };
            getAssessmentListApiCall(updatedState);
            return updatedState;
        });
    };

    const toggleAdvanceFilter = () => {
        setOpen(prev => !prev);
    }

    const advanceFilterCallbckHndlr = (appliedFilters?: any) => {
        paginationDetailRef.current = { ...paginationDetailRef.current, pageNo: 0 };
        advanceFilterChange({ keys: { ...initialValues, ...appliedFilters, academicYearId: "" }, ignoredKeys });
        signatureForm.setValues((prevState: any) => ({ ...prevState, ...appliedFilters }));
        getAssessmentListApiCall({ ...appliedFilters, pageNo: 0 });
        // toggleAdvanceFilter();
    }

    const clearFilterHndlr = () => {
        if (academicYearListResp) {
            paginationDetailRef.current = { ...paginationDetailRef.current, pageNo: 0 };
            let { academicYearId } = academicYearListResp?.data?.find((year: any) => year.isCurrent) || academicYearListResp?.data?.[0] || {};
            signatureForm.setValues({ ...initialValues, academicYearId: academicYearId || "" });
            getAssessmentListApiCall({ ...initialValues, academicYearId });
            advanceFilterChange({ keys: { ...initialValues }, ignoredKeys });
        }
    };

    const menuOptions = useMemo(
        () => [
            {
                id: "viewDetails",
                actionIcon: (
                    <HugeiconsIcon icon={EyeIcon} className="me-2 text-muted" size={18} />
                ),
                actionName: "View",

                onClickHndlr: (event: any) => {
                    const id = event.currentTarget.getAttribute("data-id");
                    history.push("/assessment-list/assessment-details", { id });
                },
            },
            {
                id: "edit",
                actionIcon: <HugeiconsIcon icon={PencilEdit02Icon} className="me-2 text-muted" size={20} />,
                actionName: "Edit",
                onClickHndlr: (event: any) => {
                    const id = event.currentTarget.getAttribute("data-id");
                    if (id) {
                        history.push("/create-assessment", { id });
                    }
                },
            },
            {
                id: "publish",
                actionIcon: <HugeiconsIcon icon={Megaphone01Icon} className="me-2 text-muted" size={20} />,
                actionName: "Publish",
                onClickHndlr: (event: any) => {
                    const id = event.currentTarget.getAttribute("data-id");
                    openDelCbseWeightageModal(id)
                },
            },
            {
                id: "reschedule",
                actionIcon: <HugeiconsIcon icon={Calendar02Icon} className="me-2 text-muted" size={20} />,
                actionName: "Reschedule",
                onClickHndlr: (event: any) => {
                    const id = event.currentTarget.getAttribute("data-id");
                    openRescheduleModal(id)
                },
            },
            {
                id: "liveMonitoring",
                actionIcon: <HugeiconsIcon icon={LiveStreaming02Icon} className="me-2 text-muted" size={20} />,
                actionName: "Live Monitoring",
                onClickHndlr: (event: any) => {
                    const id = event.currentTarget.getAttribute("data-id");
                    history.push("/assessment-list/live-assessment-monitor", { id });
                },
            },
            {
                id: "cancel",
                actionIcon: (
                    <HugeiconsIcon
                        icon={CancelCircleHalfDotIcon}
                        className="me-2 text-danger"
                        size={18}
                    />
                ),
                actionName: "Cancel",
                onClickHndlr: (event: any) => { },
            },
        ],
        []
    );

    const paginationHndlr = useCallback((paginationInfo: IPaginationState) => {
        if (paginationDetailRef.current.pageNo !== paginationInfo.pageNo || paginationDetailRef.current.pageSize !== paginationInfo.pageSize) {
            paginationDetailRef.current = paginationInfo;
            getAssessmentListApiCall(paginationInfo);
        }
    }, [getAssessmentListApiCall]);

    function delModalSubmitHndlr() {
        dispatch(savePublishAssessmentAct(generateActionPayload("get_published_assessment", { id: deleteCbseWeightageState.modalData }, { publishStatus: "PUBLISHED" })));
    }

    const { data: curriculumTypes } = brchCurriculumResp || {};
    const { content: classTypes } = branchClassResp || {};
    const { totalElements, totalPages, pageable, content: assessmentData } = getAllAssessmentsResp || {}

    const columns = useMemo(() => generateColumns(menuOptions, toggleAdvanceFilter), [getAllAssessmentsResp]);
    return (
        <div className="page-content">
            <div className="container-fluid transportaion_dashboard_wrapper">
                <BreadCrumb pageTitle="LMS" title="LMS" />
                {/* <AssessmentCards /> */}

                <div className="row g-3 mb-4">
                    {analyticsList.map((item) => {
                        const countKey = statusCountMap[item.id];
                        const value = getAssessmentStatsResp?.[countKey] ?? 0;
                        return (
                            <div className="col-12 col-md-6 col-lg-4">
                                <div
                                    className="card mb-0 tw-justify-self-stretch"
                                    style={{
                                        backgroundColor: `${item.bgColor}`,
                                    }}
                                >
                                    <div className="card-body py-2">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <p className="fs-16 fw-semibold mb-0">{value}</p>
                                            <div
                                                className="bg-white rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                                                style={{
                                                    width: "38px",
                                                    height: "38px",
                                                    border: `0.4px solid ${item.textColor}`,
                                                }}
                                            >
                                                <HugeiconsIcon icon={item.icon} className="" size={22} />
                                            </div>
                                        </div>
                                        <div className="w-100 text-truncate">
                                            <p
                                                className="mb-0 text-truncate w-100"
                                                style={{ color: `${item.textColor}` }}
                                            >
                                                {item.label}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                    )}
                </div>

                <div className="card">
                    <div className="card-header">
                        <div className="row align-items-center">
                            <div className="col-6">
                                <h4 className="card-title mb-0 flex-grow-1">Assessment List</h4>
                            </div>
                            <div className="col-auto ms-auto">
                                <div className="d-flex">
                                    <button
                                        className="btn btn-success float-end d-flex align-items-center"
                                        onClick={() => history.push("/create-assessment")}
                                    >
                                        <HugeiconsIcon
                                            icon={PlusSignIcon}
                                            className="me-2"
                                            size={18}
                                        />
                                        Add New
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card-body p-0">
                        <div className="row px-3 g-3 pt-4 py-2 align-items-center">
                            <div className="col-xs-12 col-md-12 col-lg-4 col-xl-4 !tw-mt-0">
                                <SearchInput
                                    hideDefaultSelect
                                    name="searchString"
                                    value={searchStudentState}
                                    menuItems={searchInputOptions}
                                    idKey="id"
                                    labelName="Search With"
                                    searchHandler={onSearchHandler}
                                    onChange={onChangeHandler}
                                    renderSelectedValue={(item: any) => item?.name}
                                    renderOptions={(item: any) => item?.name}
                                />
                            </div>
                            <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                                <SelectInput
                                    name="academicYearId"
                                    value={signatureForm.values.academicYearId}
                                    onChange={filterHandler}
                                    menuItems={academicYearListResp?.data || []}
                                    valueKey="academicYearId"
                                    textKey="academicYearName"
                                    labelText="Academic Year"
                                    floatingLabel
                                />
                            </div>
                            <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                                <SelectInput
                                    name="curriculumId"
                                    value={signatureForm.values.curriculumId}
                                    onChange={filterHandler}
                                    menuItems={curriculumTypes}
                                    valueKey="branchCurriculumId"
                                    textKey="curriculumName"
                                    labelText="Curriculum"
                                    floatingLabel
                                />
                            </div>
                            <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                                <SelectInput
                                    name="classId"
                                    value={signatureForm.values.classId}
                                    onChange={filterHandler}
                                    menuItems={classTypes}
                                    valueKey="id"
                                    textKey="shortName"
                                    labelText="Class"
                                    floatingLabel
                                />
                            </div>
                            <div className="col-auto !tw-mt-0">
                                <button
                                    style={{
                                        backgroundColor: "#F4F7FA",
                                        border: "1px solid #ced4da",
                                    }}
                                    onClick={toggleAdvanceFilter}
                                    className="p-2 btn d-flex position-relative"
                                >
                                    <FilterSvg height={"18px"} width={"18px"} />
                                    <span className='ms-2'>Filters</span>
                                    {(count ?? 0) > 0 &&
                                        <span className="badge align-middle rounded-pill" style={{ position: "absolute", top: "-5px", right: "-5px", background: "#0ab39c" }}>
                                            {count}
                                        </span>
                                    }
                                </button>
                            </div>
                            {showClearFilterState && (
                                <div className="col-auto !tw-mt-0">
                                    <button
                                        type="button"
                                        onClick={clearFilterHndlr}
                                        className="btn btn-ghost-danger"
                                    >
                                        Clear filter
                                    </button>
                                </div>
                            )}
                        </div>

                        <TableContainer
                            divClass="table-responsive mb-2"
                            columns={columns || []}
                            data={getAllAssessmentsResp?.content || []}
                            theadClass="table-light text-muted align-middle"
                            showPagination={true}
                            totalPages={totalPages || 0}
                            totalRecords={totalElements || 0}
                            callbackPaginationHndlr={paginationHndlr}
                            currentPageNumber={pageable?.pageNumber || 0}
                            showCheckbox={false}
                        />
                    </div>
                </div>
            </div>
            <OffCanvasContainer
                isOpen={open}
                headerTitle="Advance Filters"
                closeHndlr={toggleAdvanceFilter}
                id="assessment-list-advance-filter"
            >
                <AdvanceFilterModal
                    appliedFilter={signatureForm.values}
                    applyFilterCallback={advanceFilterCallbckHndlr}
                    toggleAdvanceFilter={toggleAdvanceFilter}
                    isOpen={open}
                />
            </OffCanvasContainer>

            <ConfirmationModal
                id="delete-examination-weightage"
                isOpen={deleteCbseWeightageState.showModal}
                confirmMessage="Are you sure you want to publish this assessment?"
                cancelHndlr={closeDelCbseWeightageModal}
                confirmHndlr={delModalSubmitHndlr}
                showImgIcon={true}
                isDisble={showApiLoader}
                iconType="approve"
            />

            <ModalContainerUpdated
                id="add-examination"
                isOpen={rescheduleModalState.showModal}
                toggle={() => closeRescheduleModal()}
                modalTitle="Reschedule Assessment"
                modalSize="md"
            >
                <RescheduleModal
                    id={rescheduleModalState.modalData}
                    isOpen={false}
                    toggle={() => closeRescheduleModal()}
                    modalTitle="Reschedule  Assessment"
                />
            </ModalContainerUpdated>

        </div>
    );
};

export default CreatedAssessmentList;
