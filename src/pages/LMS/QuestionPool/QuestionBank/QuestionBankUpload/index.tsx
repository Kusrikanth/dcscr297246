import { useHistory, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { useFormik } from "formik";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02StrokeStandard, EyeIcon, PencilEdit02Icon, InvoiceIcon } from "@hugeicons-pro/core-stroke-standard";
import { useEffect, useMemo, useRef, useState } from "react";
import { getBranchClassAct, getBranchCurriculumAct, getInstSubjectNameAct } from "../../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { generateActionPayload } from "../../../../../utility/reduxutility";
import BreadCrumb from "../../../../../Components/Common/BreadCrumb";
import { ConfirmationModal, ModalContainerUpdated, OffCanvasContainer, SearchInput, SelectInput, TableExpandable, TextInput } from "../../../../../Components/Common";
import { generateColumns, searchInputOptions, ignoredKeys } from "./helper";
import { default as FilterSvg } from "../../../../../assets/imagesdps/academics/FilterSvg.svg?react";
import { useFilterState } from "../../../../../hooks/filterhook";
import AdvanceFilterModal from "./AdvancedFilterModal";
import { IPaginationState } from "../../../../../Components/Common/Pagination";
import { deleteQuestionBankAct, getQuestionBankAct, getQuestionBankByIdAct } from "../../../../../store/lms/lmsAssessment/lmsAssessmentaction";
import { getBloomTaxonomyAct, getDifficultyLevelsAct, getQuestionTypesAct } from "../../../../../store/lms/lmssettings/lmssettingsaction";
import { getAssignedClassSubjectsList } from "../../../../../store/academic/classSubjects/classsubjectsactions";
import PreviewQuestion from "./AddQuestion/PreviewQuestion";
import { useModal } from "../../../../../hooks/modalhook";
import { toast } from "react-toastify";
import { getMasterClassesAct, getMasterClassStreamGroupAct, getMasterCurriculumAct } from "../../../../../store/masterdata/masterdataactions";

const initialValues = {
    searchString: "",
    classId: "",
    curriculumId: "",
    subjectId: "",
    questionTypeId: "",
    difficultyLevelId: "",
    bloomTaxonomyIds: "",
    status: "",
    streamGroupId: "",
    chapter: "",
};

const QuestionBankUpload = () => {

    const location = useLocation();
    const dispatch = useAppDispatch();
    const history = useHistory();
    const { closeModal: closeFetchQuestionsModal, modalState: fetchQuestionsState, openModal: openFetchQuestionsModal } = useModal();
    // const [applicationSaleFilter, setApplicationSaleFilter] = useState(initialValues);
    const [searchStudentState, setSearchStudentState] = useState("global");
    const { showClearFilterState, count, advanceFilterChange } = useFilterState()
    const [open, setOpen] = useState<boolean>(false);
    const {
        openModal: delOpenQutionModal,
        closeModal: delCloseQutionModal,
        modalState: delQutionFormatState,
    } = useModal();

    const paginationDetailRef = useRef({
        pageNo: 0,
        pageSize: 10,
    })
    const {
        instituteListResp,
        academicYearListResp,
        masterCurriculumResp,
        masterClassesResp,
        masterClassStreamGroupResp,
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        showApiLoader,
        getQuestionBankResp,
        getQuestionTypesResp,
        deleteQuestionBankResp,
        lmsAssessmentErrorAct
    } = useAppSelector(
        ({ instituteInfo, masterData, instAcademics, globalData, branchAcademics, appData, lmsAssessment, lmsSettings }) => ({
            instituteListResp: instituteInfo.instituteListResp,
            academicYearListResp: instAcademics.academicYearListResp,
            masterCurriculumResp: masterData.masterCurriculumResp,
            masterClassesResp: masterData.masterClassesResp,
            masterClassStreamGroupResp: masterData.masterClassStreamGroupResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            showApiLoader: globalData.showApiLoader,
            getQuestionBankResp: lmsAssessment.getQuestionBankResp,
            getQuestionTypesResp: lmsSettings.getQuestionTypesResp,
            deleteQuestionBankResp: lmsAssessment.deleteQuestionBankResp,
            lmsAssessmentErrorAct: lmsAssessment.lmsAssessmentErrorAct

        }),
        shallowEqual
    );
    const instituteRespRef = useRef<any>({
        prevLmsAssessmentErrorAct: lmsAssessmentErrorAct,
        prevDeleteQuestionBankResp: deleteQuestionBankResp
    });

    useEffect(() => {
        const { prevLmsAssessmentErrorAct, prevDeleteQuestionBankResp } = instituteRespRef.current;
        if (lmsAssessmentErrorAct && prevLmsAssessmentErrorAct !== lmsAssessmentErrorAct) {
            toast.error(lmsAssessmentErrorAct.details || "Something went wrong.");
        }
        if (deleteQuestionBankResp && prevDeleteQuestionBankResp !== deleteQuestionBankResp) {
            toast.success("Question bank deleted successfully.");
            getQuestionbankApiCall();
            delCloseQutionModal();
        }
        instituteRespRef.current.prevLmsAssessmentErrorAct = lmsAssessmentErrorAct;
        instituteRespRef.current.prevDeleteQuestionBankResp = deleteQuestionBankResp;
    }, [lmsAssessmentErrorAct, deleteQuestionBankResp]);

    const signatureForm = useFormik({
        // enableReinitialize: true,
        initialValues,
        onSubmit: (values) => { },
    });


    const menuOptions = useMemo(
        () => [
            {
                id: "viewDetails",
                actionIcon: <HugeiconsIcon icon={EyeIcon} className="me-2 text-muted" size={18} />,
                actionName: "View",
                onClickHndlr: (event: any) => {
                    const id = event.currentTarget.getAttribute("data-id");
                    openFetchQuestionsModal(id);
                    dispatch(getQuestionBankByIdAct(generateActionPayload("get_question_bank_repository_by_id", { id: id })));
                },
            },
            {
                id: "edit",
                actionIcon: <HugeiconsIcon icon={PencilEdit02Icon} className="me-2 text-muted" size={20} />,
                actionName: "Edit",
                onClickHndlr: (event: any) => {
                    const id = event.currentTarget.getAttribute("data-id");
                    history.push(`${location.pathname}/question-builder`, {
                        pathName: location.pathname,
                        questionBankId: id
                    });
                },
            },
            {
                id: "delete",
                actionIcon: <HugeiconsIcon icon={Delete02StrokeStandard} className="me-2 text-danger" size={18} />,
                actionName: "Delete",
                onClickHndlr: (event: any) => {
                    const id = event.currentTarget.getAttribute("data-id");
                    delOpenQutionModal(id);
                },
            },
        ],
        []
    );

    const moveToAddConcern = (event: any) => {
        event.preventDefault()
        history.push(`${location.pathname}/question-builder`, {
            pathName: location.pathname,
        })
    }

    const getCurriculumApiCall = (otherProps?: any) => {
        dispatch(
            getMasterCurriculumAct(
                generateActionPayload(
                    "get_master_curriculum",
                    undefined,
                    {
                        pageNo: 0,
                        pageSize: 100,
                        ...otherProps,
                    }
                )
            )
        );
    };

    const getClassApiCall = () => {
        dispatch(
            getMasterClassesAct(
                generateActionPayload("get_master_classes", undefined)
            )
        );
    };

    const getMasterClassStreamGroupApiCall = () => {
        const payload = {
            classId: signatureForm.values.classId,
        };

        dispatch(
            getMasterClassStreamGroupAct(
                generateActionPayload(
                    "get_master_class_stream_group",
                    undefined,
                    payload
                )
            )
        );
    };

    const subjectListApicall = (otherProps?: any) => {
        const payload = {
            ...otherProps,
            pageNo: 0,
            pageSize: 100,
        };

        dispatch(
            getInstSubjectNameAct(
                generateActionPayload(
                    "get_inst_subject_name",
                    undefined,
                    payload
                )
            )
        );

    };

    function getQuestionbankApiCall(otherProps?: any) {

        const selectedInstitute = instituteListResp?.data?.find((item: any) => Number(item?.id) === Number(instituteId));
        const { data } = academicYearListResp || {};
        const currentAcademicYear = Array.isArray(data) ? data.find((year: any) => year.yearStatus?.toUpperCase() === "CURRENT") : null;
        const academicYearId = currentAcademicYear?.academicYearId ?? null;

        const payload = {
            instituteGroupId: selectedInstitute?.instituteGroupId,
            searchString: signatureForm.values.searchString,
            academicYearId: academicYearId,
            curriculumId: signatureForm.values.curriculumId,
            classId: signatureForm.values.classId,
            subjectId: signatureForm.values.subjectId,
            questionTypeId: signatureForm.values.questionTypeId,
            difficultyLevelId: signatureForm.values.difficultyLevelId,
            bloomTaxonomyIds: signatureForm.values.bloomTaxonomyIds,
            ...otherProps,
            ...paginationDetailRef.current
        }
        dispatch(getQuestionBankAct(generateActionPayload("get_question_bank_repository", undefined, payload)));
    }

    const getQuestionTypeApiCall = (otherProps?: any) => {
        let payload = {
            ...otherProps,
        };
        dispatch(getQuestionTypesAct(generateActionPayload("get_question_types", undefined, payload)));
    };

    const getDifficultyLevelsApiCall = (otherProps?: any) => {
        let payload = {
            ...otherProps,
        };
        dispatch(getDifficultyLevelsAct(generateActionPayload("get_difficulty_levels", undefined, payload)));
    };

    const getBloomTaxonomyApiCall = (otherProps?: any) => {
        let payload = {
            ...otherProps,
        };
        dispatch(getBloomTaxonomyAct(generateActionPayload("get_bloom_taxonomy", undefined, payload)));
    };

    // useEffect(() => {
    //     const { data } = academicYearListResp || {};
    //     if (Array.isArray(data) && data.length > 0) {
    //         const academicYearId = data.find((year: any) => year.yearStatus?.toUpperCase() === "CURRENT")?.academicYearId;
    //         if (academicYearId) {
    //             signatureForm.setFieldValue("academicYearId", academicYearId);
    //             getCurriculumApiCall({ academicYearId });
    //             getQuestionbankApiCall({ academicYearId });
    //         }
    //     }
    // }, [academicYearListResp]);

    useEffect(() => {
        getCurriculumApiCall();
        getClassApiCall();
        getQuestionTypeApiCall();
        getDifficultyLevelsApiCall();
        getBloomTaxonomyApiCall();
        getQuestionbankApiCall();
    }, []);

    useEffect(() => {
        if (signatureForm.values.classId) {
            getMasterClassStreamGroupApiCall();
        }
    }, [signatureForm.values.classId]);

    useEffect(() => {
        if (instituteId) {
            subjectListApicall();
        }
    }, [instituteId]);

    const filterHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        if (name === "curriculumId") {
            const updatedValues = {
                curriculumId: value || "",
                classId: "",
                subjectId: "",
                streamGroupId: "",
            };

            signatureForm.setValues((prev: any) => ({
                ...prev,
                ...updatedValues,
            }));

            advanceFilterChange({
                keys: {
                    ...signatureForm.values,
                    ...updatedValues,
                },
                ignoredKeys,
            });

            getQuestionbankApiCall({
                ...updatedValues,
                pageNo: 0,
            });
        }
        else if (name === "classId") {
            const updatedValues = {
                classId: value || "",
                subjectId: "",
                streamGroupId: "",
            };

            signatureForm.setValues((prev: any) => ({
                ...prev,
                ...updatedValues,
            }));

            advanceFilterChange({
                keys: {
                    ...signatureForm.values,
                    ...updatedValues,
                },
                ignoredKeys,
            });

            getQuestionbankApiCall({
                ...updatedValues,
                pageNo: 0,
            });
        }
        else {
            signatureForm.setValues((prev: any) => ({ ...prev, [name]: value }))
        }
    }
    const delLibraryDetailsConfirmHndler = () => {
        dispatch(deleteQuestionBankAct(generateActionPayload("delete_question_bank_repository", { id: delQutionFormatState.modalData },)));
    }

    const columns = useMemo(() => generateColumns(menuOptions), []);

    function onSearchHandler(name: string, value: any) {
        paginationDetailRef.current.pageNo = 0;
        signatureForm.setValues((prevState) => {
            const updatedState = {
                ...prevState,
                searchString: value,
            };
            getQuestionbankApiCall({
                searchString: value, pageNo: 0,
            });
            return updatedState;
        });
    }

    function onChangeHandler(name: string, id: any, item: any) {
        setSearchStudentState(id);
        paginationDetailRef.current.pageNo = 0;
        signatureForm.setValues((prevState) => {
            const updatedState = {
                ...prevState,
                filterTypeName: id,
                searchString: ""
            };
            return updatedState;
        });
    }

    function advanceFilterCallbckHndlr(appliedFilters?: any) {
        paginationDetailRef.current = { ...paginationDetailRef.current, pageNo: 0 }
        advanceFilterChange({ keys: { ...initialValues, ...appliedFilters, academicYearId: "" }, ignoredKeys })
        signatureForm.setValues((prevState: any) => ({ ...prevState, ...appliedFilters }));
        getQuestionbankApiCall(appliedFilters)
    }
    const { data: academicYearList } = academicYearListResp || {};

    const toggleAdvanceFilter = () => {
        setOpen(prev => !prev);
    }
    function paginationHndlr(paginationInfo: IPaginationState) {
        paginationDetailRef.current = paginationInfo;
        getQuestionbankApiCall(paginationInfo);
    }

    const clearFilterHndlr = () => {
        paginationDetailRef.current = {
            ...paginationDetailRef.current,
            pageNo: 0,
        };

        signatureForm.setValues(initialValues);

        getQuestionbankApiCall();

        advanceFilterChange({
            keys: initialValues,
            ignoredKeys,
        });
    };
    const curriculumTypes = Array.isArray(masterCurriculumResp)
        ? masterCurriculumResp
        : [];

    const classTypes = Array.isArray(masterClassesResp)
        ? masterClassesResp
        : [];

    const streamGroupTypes = Array.isArray(masterClassStreamGroupResp)
        ? masterClassStreamGroupResp
        : [];

    const selectedClass = masterClassesResp?.find(
        (item: any) =>
            Number(item.id) === Number(signatureForm.values.classId)
    );

    const showStreamGroup =
        selectedClass?.classSequence === 14 ||
        selectedClass?.classSequence === 15;

    const { totalElements, totalPages, pageable } = getQuestionBankResp || {}

    return (
        <>
            <div className="card d-inline-block w-100">
                <div className="row px-3 g-3 pt-4 py-2">
                    <div className="col-xs-12 col-md-12 col-lg-4 col-xl-3">
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
                    {/* <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                        <SelectInput
                            name="academicYearId"
                            value={signatureForm.values.academicYearId}
                            onChange={filterHandler}
                            menuItems={academicYearList}
                            valueKey="academicYearId"
                            textKey="academicYearName"
                            labelText="Academic Year"
                            floatingLabel
                        />
                    </div> */}
                    <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                        <SelectInput
                            name="curriculumId"
                            value={signatureForm.values.curriculumId}
                            onChange={filterHandler}
                            menuItems={curriculumTypes}
                            valueKey="id"
                            textKey="curriculumName"
                            labelText="Curriculum"
                            floatingLabel
                        />
                    </div>
                    <div className="col-xs-12 col-md-12 col-lg-2 col-xl-1">
                        <SelectInput
                            name="classId"
                            value={signatureForm.values.classId}
                            onChange={filterHandler}
                            menuItems={classTypes}
                            valueKey="id"
                            textKey="shortCode"
                            labelText="Class"
                            floatingLabel
                        />
                    </div>
                    {showStreamGroup && (
                        <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                            <SelectInput
                                name="streamGroupId"
                                value={signatureForm.values.streamGroupId}
                                onChange={filterHandler}
                                menuItems={streamGroupTypes}
                                valueKey="id"
                                textKey="groupName"
                                labelText="Stream"
                                floatingLabel
                            />
                        </div>
                    )}
                    <div className="col-1 py-2 mt-2">
                        <button
                            style={{
                                backgroundColor: "#F4F7FA",
                                border: "1px solid #ced4da",
                            }}
                            onClick={toggleAdvanceFilter}
                            className="p-2 btn d-flex"
                        >
                            <FilterSvg height={"18px"} width={"18px"} />
                            <span className='ms-2'>Filters</span>
                        </button>
                        <span className="badge align-middle rounded-pill ms-1 " style={{ marginBottom: "18px", position: "absolute", top: "-9px", left: "78px", background: "#0ab39c" }}>
                            {count}
                        </span>
                    </div>

                    {showClearFilterState && (
                        <div className="col-1">
                            <button
                                type="button"
                                onClick={clearFilterHndlr}
                                className="btn btn-ghost-danger !tw-nowrap !tw-px-1"
                            >
                                Clear filter
                            </button>
                        </div>
                    )}
                    <div className="col-2 ms-auto">
                        <button
                            className="btn btn-success float-end d-flex align-items-center"
                            onClick={moveToAddConcern}
                        >
                            <i className="ri-add-line me-2" />
                            Create Questions
                        </button>
                    </div>
                    {/* <div className="col-auto">
                        <button type="button" className="btn btn-outline-primary float-end d-flex align-items-center">
                            <HugeiconsIcon icon={InvoiceIcon} className="me-2" size={18} />  Add To Pool
                        </button>
                    </div> */}
                    {/* <div className="col-auto ">
                        <div className="d-flex">
                            <button
                                id="export-btn"
                                className="btn btn-icon btn-rounded btn-soft-info p-2"

                            >
                                <img src={ExportIcon} className="img-fluid h-100"></img>
                                <UncontrolledTooltip placement="bottom" target="export-btn">
                                    Export
                                </UncontrolledTooltip>
                            </button>
                        </div>
                    </div> */}
                </div>

                <TableExpandable
                    columns={columns || []}
                    data={getQuestionBankResp?.content || []}
                    divClass="table-responsive mb-3"
                    theadClass="table-light text-muted align-middle"
                    tableClass="table-bordered mb-0"
                    showPagination={true}
                    totalPages={totalPages || 0}
                    totalRecords={totalElements || 0}
                    callbackPaginationHndlr={paginationHndlr}
                    currentPageNumber={pageable?.pageNumber || 0}
                    showCheckbox={true}
                />
            </div>
            <OffCanvasContainer
                isOpen={open}
                headerTitle="Advance Filters"
                closeHndlr={toggleAdvanceFilter}
                id="advance-filter-book-issuance"
            >
                <AdvanceFilterModal
                    appliedFilter={signatureForm.values}
                    applyFilterCallback={advanceFilterCallbckHndlr}
                    toggleAdvanceFilter={toggleAdvanceFilter}
                    isOpen={open}
                />
            </OffCanvasContainer>
            <ModalContainerUpdated
                id="add-examination"
                isOpen={fetchQuestionsState.showModal}
                toggle={() => closeFetchQuestionsModal()}
                modalTitle="Preview Question"
                modalSize="lg"
            >
                <PreviewQuestion
                    id={fetchQuestionsState.modalData}
                    isOpen={false}
                    toggle={() => closeFetchQuestionsModal()}
                    modalTitle="Preview Question"
                />
            </ModalContainerUpdated>
            <ConfirmationModal
                id="del-question-formate-modal"
                isOpen={delQutionFormatState.showModal}
                confirmMessage="Are you sure you want to Delete the Question Bank?"
                cancelHndlr={delCloseQutionModal}
                confirmHndlr={delLibraryDetailsConfirmHndler}
                showImgIcon={true}
                iconType="reject"
            ></ConfirmationModal>
        </>
    );
};

export default QuestionBankUpload;
