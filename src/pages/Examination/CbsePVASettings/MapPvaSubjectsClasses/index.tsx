import { shallowEqual } from "react-redux";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { useFormik } from "formik";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02StrokeStandard, PencilEdit02Icon } from "@hugeicons-pro/core-stroke-standard";
import { getBranchClassAct, getBranchCurriculumAct, resetBrchClassAct } from "../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { debounce } from "../../../../utility/commonutility";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import { ConfirmationModal, ModalContainerUpdated, OffCanvasContainer, SelectInput, TextInput } from "../../../../Components/Common";
import { useModal } from "../../../../hooks/modalhook";
import { generateColumns, ignoredKeys } from "./helper";
import MapPvaSubjectsClassesAddModal from "./MapPvaSubjectsClassesAddModal";
import TableContainer from "../../../../Components/Common/TableContainer";
import { deletePvaSubjectsClassesMappingAct, getPvaSubjectsAct, getPvaSubjectsClassesMappingAct, getPvaSubjectsClassesMappingByIdAct } from "../../../../store/examination/pvaReports/pvaReportsActions";
import { toast } from "react-toastify";
import { getIgseTermNameListAct } from "../../../../store/examination/examinationsettings/examinationsettingsaction";
import { useFilterState } from "../../../../hooks/filterhook";
import { default as FilterSvg } from "../../../../assets/imagesdps/academics/FilterSvg.svg?react";
import { IPaginationState } from "../../../../Components/Common/Pagination";
import AdvanceFilterModal from "./AdvancedFilterModal";
import ViewAssignedSportsTeachersModal from "./ViewAssignedSportsTeachersModal";

const initialValues = {
    searchStr: "",
    academicYearId: "",
    curriculumId: "",
    classId: "",
    pvaSubjectId: "",
    termId: "",
};

const MapPvaSubjectsClasses = () => {
    const { closeModal: closeMapPvaSubjectsClassesModal, modalState: pavSubjectAddModalState, openModal: openMapPvaSubjectsClassesModal } = useModal();
    const { closeModal: closeDelMapPvaSubjectsClassesModal, modalState: delMapPvaSubjectsClassesModalState, openModal: openDelMapPvaSubjectsClassesModal } = useModal();
    const {
        openModal: viewAssignedSportsTeachersOpenModal,
        closeModal: viewAssignedSportsTeachersCloseModal,
        modalState: viewAssignedSportsTeachersModalState,
      } = useModal();
    const { showClearFilterState, count, advanceFilterChange } = useFilterState()
    const [open, setOpen] = useState<boolean>(false);

    const dispatch = useAppDispatch();

    const pagination = useRef({
        pageNo: 0,
        pageSize: 10
    })

    const getPvaSubjecttoClassMappingListApiCall = (otherProps?: any) => {
        const payload = {
            branchId,
            ...mapSubjectClassesForm.values,
            ...pagination.current,
            ...otherProps,
        }
        dispatch(getPvaSubjectsClassesMappingAct(generateActionPayload("get_pva_subjects_classes_mapping", undefined, payload)));
    }

    function delModalSubmitHndlr() {
        dispatch(deletePvaSubjectsClassesMappingAct(generateActionPayload("delete_pva_subjects_classes_mapping", { id: delMapPvaSubjectsClassesModalState.modalData })));
    }

    const toggleAdvanceFilter = () => {
        setOpen(prev => !prev);
    }

    const {
        academicYearListResp,
        brchCurriculumResp,
        branchClassResp,
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        showApiLoader,
        getPvaSubjecttoClassMappingResp,
        savePvaSubjecttoClassMappingResp,
        updatePvaSubjecttoClassMappingResp,
        deletePvaSubjecttoClassMappingResp,
        pvaReportsErrorAct,
    } = useAppSelector(
        ({ instAcademics, globalData, branchAcademics, appData, pvaReports }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            branchClassResp: branchAcademics.branchClassResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            showApiLoader: globalData.showApiLoader,
            getPvaSubjecttoClassMappingResp: pvaReports.getPvaSubjecttoClassMappingResp,
            savePvaSubjecttoClassMappingResp: pvaReports.savePvaSubjecttoClassMappingResp,
            updatePvaSubjecttoClassMappingResp: pvaReports.updatePvaSubjecttoClassMappingResp,
            deletePvaSubjecttoClassMappingResp: pvaReports.deletePvaSubjecttoClassMappingResp,
            pvaReportsErrorAct: pvaReports.pvaReportsErrorAct,

        }),
        shallowEqual
    );

    const pvaGradeRef = useRef({
        prevPvaReportsErrorAct: pvaReportsErrorAct,
        prevSavePvaSubjecttoClassMappingResp: savePvaSubjecttoClassMappingResp,
        prevDeletePvaSubjecttoClassMappingResp: deletePvaSubjecttoClassMappingResp,
        prevUpdatePvaSubjecttoClassMappingResp: updatePvaSubjecttoClassMappingResp,
    })

    useEffect(() => {
        const { prevPvaReportsErrorAct, prevSavePvaSubjecttoClassMappingResp, prevUpdatePvaSubjecttoClassMappingResp, prevDeletePvaSubjecttoClassMappingResp } = pvaGradeRef.current || {}
        if (pvaReportsErrorAct && prevPvaReportsErrorAct !== pvaReportsErrorAct) {
            const { details } = pvaReportsErrorAct || {}
            toast.error(details || "Something went wrong")
        }
        else if (savePvaSubjecttoClassMappingResp && prevSavePvaSubjecttoClassMappingResp !== savePvaSubjecttoClassMappingResp) {
            toast.success("Mapping Added successfully")
            closeMapPvaSubjectsClassesModal();
            getPvaSubjecttoClassMappingListApiCall();
        }
        else if (updatePvaSubjecttoClassMappingResp && prevUpdatePvaSubjecttoClassMappingResp !== updatePvaSubjecttoClassMappingResp) {
            toast.success("Mapping Updated successfully")
            closeMapPvaSubjectsClassesModal();
            getPvaSubjecttoClassMappingListApiCall();
        }
        else if (deletePvaSubjecttoClassMappingResp && prevDeletePvaSubjecttoClassMappingResp !== deletePvaSubjecttoClassMappingResp) {
            toast.success("Mapping Deleted successfully")
            closeDelMapPvaSubjectsClassesModal();
            getPvaSubjecttoClassMappingListApiCall();
        }
        pvaGradeRef.current.prevPvaReportsErrorAct = pvaReportsErrorAct;
        pvaGradeRef.current.prevSavePvaSubjecttoClassMappingResp = savePvaSubjecttoClassMappingResp;
        pvaGradeRef.current.prevUpdatePvaSubjecttoClassMappingResp = updatePvaSubjecttoClassMappingResp;
        pvaGradeRef.current.prevDeletePvaSubjecttoClassMappingResp = deletePvaSubjecttoClassMappingResp;
    }, [pvaReportsErrorAct, savePvaSubjecttoClassMappingResp, updatePvaSubjecttoClassMappingResp, deletePvaSubjecttoClassMappingResp])

    useEffect(() => {
        const { data } = brchCurriculumResp || {};
        if (Array.isArray(data) && data.length > 0) {
            let shortNameToMatch = "";

            if (location.pathname.includes("/other-pva-settings/pva-map-subject-classes")) {
                shortNameToMatch = "CBSE";
            }

            const selectedCurriculum = data.find(
                (item) => item.shortName === shortNameToMatch
            );

            if (selectedCurriculum) {
                dispatch(getIgseTermNameListAct(generateActionPayload("get_igse_term_name_list", undefined, { branchId, curriculumId: selectedCurriculum.branchCurriculumId })));
                const payload = {
                    branchId,
                    curriculumId: selectedCurriculum.branchCurriculumId,
                    academicYearId: mapSubjectClassesForm.values.academicYearId,
                    sortBy: "classSequence",
                    orderBy: "asc",
                    pageNo: 0,
                    pageSize: 100,
                };
                dispatch(
                    getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload))
                ); const subjectPayload = {
                    branchId,
                    academicYearId: mapSubjectClassesForm.values.academicYearId,
                    curriculumId: selectedCurriculum.branchCurriculumId,
                    sortBy: "subjectName", orderBy: "asc",
                    pageNo: 0, pageSize: 100,
                }
                if (subjectPayload.academicYearId && subjectPayload.curriculumId) {
                    dispatch(getPvaSubjectsAct(generateActionPayload("get_pva_subjects", undefined, subjectPayload)));
                }
                mapSubjectClassesForm.setValues((prev: any) => ({
                    ...prev,
                    curriculumId: selectedCurriculum.branchCurriculumId,
                }));
                getPvaSubjecttoClassMappingListApiCall({ ...mapSubjectClassesForm.values, curriculumId: selectedCurriculum.branchCurriculumId });
            }
        }
    }, [brchCurriculumResp, location.pathname]);

    const mapSubjectClassesForm = useFormik({
        enableReinitialize: true,
        initialValues,
        onSubmit: (values) => { },
    });

    const menuOptions = useMemo(
        () => [
            {
                id: "edit",
                actionIcon: <HugeiconsIcon icon={PencilEdit02Icon} className="text-muted" size={20} />,
                actionName: "Edit",
                onClickHndlr: (event: any) => {
                    const id = event.currentTarget.getAttribute("data-id");
                    dispatch(getPvaSubjectsClassesMappingByIdAct(generateActionPayload("get_pva_subjects_classes_mapping_by_id", { id })));
                    openMapPvaSubjectsClassesModal(id);
                },

            },
            {
                id: "delete",
                actionIcon: <HugeiconsIcon icon={Delete02StrokeStandard} className="text-danger" size={18} />,
                actionName: "Delete",
                onClickHndlr: (event: any) => {
                    const id = event.currentTarget.getAttribute("data-id");
                    openDelMapPvaSubjectsClassesModal(id)
                },
            },
        ],
        [getPvaSubjecttoClassMappingResp]
    );

    useEffect(() => {
        if (
            academicYearListResp?.data?.length &&
            !mapSubjectClassesForm.values.academicYearId
        ) {
            const currentAcademicYear = academicYearListResp.data.find(
                (year: any) => year.yearStatus === "CURRENT"
            );
            if (currentAcademicYear) {
                mapSubjectClassesForm.setFieldValue(
                    "academicYearId",
                    currentAcademicYear.academicYearId
                );
            }
        }
    }, [academicYearListResp]);


    useEffect(() => {
        const selectedAcademicYearId = mapSubjectClassesForm.values.academicYearId;
        if (selectedAcademicYearId) {
            const payload1 = {
                instituteId,
                branchId,
                pageNo: 0,
                pageSize: 100,
                sortBy: "curriculumName",
                orderBy: "asc",
                academicYearId: selectedAcademicYearId,
            };

            dispatch(
                getBranchCurriculumAct(
                    generateActionPayload("get_brch_curriculum", undefined, payload1)
                )
            );

            mapSubjectClassesForm.setFieldValue("curriculumId", "");
        }
    }, [mapSubjectClassesForm.values.academicYearId]);

    function search(value: string) {
        getPvaSubjecttoClassMappingListApiCall({ ...mapSubjectClassesForm.values, searchStr: value });
    }

    const debounceFun = useCallback(debounce(search, 200), [getPvaSubjecttoClassMappingResp]);

    const filterHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        pagination.current.pageNo = 0;
        if (name === "searchStr") {
            mapSubjectClassesForm.setValues((prev: any) => ({ ...prev, [name]: value }))
            debounceFun(value);
        }
        else if (name === "curriculumId") {
            mapSubjectClassesForm.setValues((prev: any) => ({ ...prev, [name]: value, classId: "", termId: "", pvaSubjectId: "", subjectId: "" }));
            if (!value) {
                dispatch(resetBrchClassAct(undefined))
                }
            else {
                 const payload = {
                    branchId,
                    curriculumId: value,
                    academicYearId: mapSubjectClassesForm.values.academicYearId,
                    sortBy: "classSequence",
                    orderBy: "asc",
                    pageNo: 0,
                    pageSize: 100,
                };
                dispatch(
                    getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload))
                ); 

                const subjectPayload = {
                    branchId,
                    academicYearId: mapSubjectClassesForm.values.academicYearId,
                    curriculumId: value,
                    sortBy: "subjectName", orderBy: "asc",
                    pageNo: 0, pageSize: 100,
                }
                if (subjectPayload.academicYearId && subjectPayload.curriculumId) {
                    dispatch(getPvaSubjectsAct(generateActionPayload("get_pva_subjects", undefined, subjectPayload)));
                }
                dispatch(getIgseTermNameListAct(generateActionPayload("get_igse_term_name_list", undefined, { branchId, curriculumId: value })));
                getPvaSubjecttoClassMappingListApiCall({ ...mapSubjectClassesForm.values, curriculumId: value, classId: "", termId: "", pvaSubjectId: "", subjectId: "" });
            }
        }
        else if(name === "classId") {
            mapSubjectClassesForm.setValues((prev: any) => ({ ...prev, [name]: value, termId: "", pvaSubjectId: "", subjectId: "" }));
            getPvaSubjecttoClassMappingListApiCall({ ...mapSubjectClassesForm.values, classId: value, termId: "", pvaSubjectId: "", subjectId: "" });
        }
        else {
            const updatedValues = { ...mapSubjectClassesForm.values, [name]: value };
            mapSubjectClassesForm.setValues(updatedValues);
        } advanceFilterChange({ keys: { ...mapSubjectClassesForm.values, [name]: value }, ignoredKeys });

    }

    function paginationHndlr(paginationInfo: IPaginationState) {
        pagination.current = paginationInfo;
        getPvaSubjecttoClassMappingListApiCall(paginationInfo);
    }

    function advanceFilterCallbckHndlr(appliedFilters?: any) {
        pagination.current = { ...pagination.current, pageNo: 0 }
        advanceFilterChange({ keys: { ...initialValues, ...appliedFilters, academicYearId: "" }, ignoredKeys })
        mapSubjectClassesForm.setValues((prevState: any) => ({ ...prevState, ...appliedFilters }));
        getPvaSubjecttoClassMappingListApiCall(appliedFilters)
    }
    function clearFilterHndlr() {
    pagination.current.pageNo = 0;
    const { academicYearId } = academicYearListResp?.data?.find((year: any) => year.yearStatus.toLowerCase() === "current") || {};
    const curriculumId = mapSubjectClassesForm.values.curriculumId;
    mapSubjectClassesForm.setValues({ ...initialValues, academicYearId: academicYearId || "", curriculumId: curriculumId || "", });
    getPvaSubjecttoClassMappingListApiCall({ ...initialValues, academicYearId, curriculumId });
    advanceFilterChange({ keys: { ...initialValues }, ignoredKeys: [] });
  }

    const columns = useMemo(() => generateColumns(menuOptions, viewAssignedSportsTeachersOpenModal), [getPvaSubjecttoClassMappingResp]);
    const { data: curriculumTypes } = brchCurriculumResp || {}
    const { content: classTypes } = branchClassResp || {};
    const { data: academicYearList } = academicYearListResp || {};
    const { totalElements, totalPages, pageable } = getPvaSubjecttoClassMappingResp || {};

    return (
        <>
            <div className="page-content free_payment_record_wrapper">
                <div className="container-fluid">
                    <BreadCrumb title="Examination" pageTitle="Examination" />
                    <div className="card">
                        <div className="card-header">
                            <div className="row align-items-center">
                                <div className="col-6">
                                    <h4 className="card-title mb-0 flex-grow-1">Map PVA Subject's to Classes</h4>
                                </div>
                            </div>
                        </div>
                        <div className="card-body pb-0">
                            <div className="row g-3">
                                <div className="col-xs-12 col-md-12 col-lg-3">
                                    <div className="search-box">
                                        <TextInput
                                            name="searchStr"
                                            formgroupClassName="mb-0"
                                            placeHolder="Search"
                                            labelText="Search"
                                            floatingLabel
                                            inputClassName=""
                                            value={mapSubjectClassesForm.values.searchStr}
                                            onChange={filterHandler}
                                        />
                                        <i className="ri-search-line search-icon"></i>
                                    </div>
                                </div>
                                <div className="col-xs-12 col-md-12 col-lg-2">
                                    <SelectInput
                                        name="academicYearId"
                                        value={mapSubjectClassesForm.values.academicYearId}
                                        onChange={filterHandler}
                                        menuItems={academicYearList || []}
                                        valueKey="academicYearId"
                                        textKey="academicYearName"
                                        formgroupClassName="mb-0"
                                        labelText='Academic Year'
                                        labelClass="required"
                                        floatingLabel
                                    />
                                </div>
                                <div className="col-xs-12 col-md-12 col-lg-2">
                                    <SelectInput
                                        name="curriculumId"
                                        value={mapSubjectClassesForm.values.curriculumId}
                                        onChange={filterHandler}
                                        menuItems={curriculumTypes}
                                        valueKey="branchCurriculumId"
                                        textKey="curriculumName"
                                        labelText="Curriculum"
                                        floatingLabel
                                        inputClassName=""
                                        labelClass="required"
                                        formgroupClassName="mb-0"
                                    />
                                </div>
                                <div className="col-xs-12 col-md-12 col-lg-2">
                                    <SelectInput
                                        name="classId"
                                        value={mapSubjectClassesForm.values.classId}
                                        onChange={filterHandler}
                                        menuItems={classTypes}
                                        valueKey="id"
                                        textKey="shortName"
                                        labelText="Class"
                                        floatingLabel
                                        inputClassName=""
                                    />
                                </div>
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
                                <div className="col-auto d-flex align-items-center py-2 mt-2">
                                    <button type="button" onClick={clearFilterHndlr} className="btn btn-sm btn-ghost-danger">
                                    Clear filter</button>
                                </div>
                                )}
                                <div className="col-auto ms-auto">
                                    <button
                                        className="btn btn-success float-end d-flex align-items-center"
                                        onClick={() => openMapPvaSubjectsClassesModal()}
                                    >
                                        <i className="ri-add-line me-2" />
                                        Add New
                                    </button>
                                </div>
                            </div>
                        </div>
                        <TableContainer
                            columns={columns || []}
                            data={Array.isArray(getPvaSubjecttoClassMappingResp?.content) ? getPvaSubjecttoClassMappingResp.content : []}
                            tableClass="mb-0"
                            divClass="table-responsive mb-3"
                            theadClass="table-light text-muted align-middle"
                            showPagination={true}
                            totalPages={totalPages || 0}
                            totalRecords={totalElements || 0}
                            callbackPaginationHndlr={paginationHndlr}
                            currentPageNumber={pageable?.pageNumber || 0}
                        />
                    </div>
                </div>
            </div>
            <ModalContainerUpdated
                id="add-examination"
                isOpen={pavSubjectAddModalState.showModal}
                toggle={() => closeMapPvaSubjectsClassesModal()}
                modalTitle={pavSubjectAddModalState.modalData ? "Edit Map Subject to Class" : "Add Map Subject to Class"}
                modalSize="md"
            >
                <MapPvaSubjectsClassesAddModal
                    id={pavSubjectAddModalState.modalData}
                    isOpen={false}
                    toggle={() => closeMapPvaSubjectsClassesModal()}
                    modalTitle="Create Detail"
                    instituteId={instituteId}
                    branchId={branchId}
                    modalData={mapSubjectClassesForm.values}
                />
            </ModalContainerUpdated>
            <ConfirmationModal
                id="delete-subject-class-mapping"
                isOpen={delMapPvaSubjectsClassesModalState.showModal}
                confirmMessage="Are you sure you want to delete this record ?"
                cancelHndlr={closeDelMapPvaSubjectsClassesModal}
                confirmHndlr={delModalSubmitHndlr}
                showImgIcon={true}
                isDisble={showApiLoader}
                iconType="reject"
            />
            <OffCanvasContainer
                isOpen={open}
                headerTitle="Advance Filters"
                closeHndlr={toggleAdvanceFilter}
                id="advance-filter-book-issuance"
            >
                <AdvanceFilterModal
                    appliedFilter={mapSubjectClassesForm.values}
                    applyFilterCallback={advanceFilterCallbckHndlr}
                    toggleAdvanceFilter={toggleAdvanceFilter}
                    isOpen={open}
                />
            </OffCanvasContainer>
            <ModalContainerUpdated
                          id="view-assigned-sports-teachers-modal"
                          isOpen={viewAssignedSportsTeachersModalState.showModal}
                          toggle={viewAssignedSportsTeachersCloseModal}
                          modalTitle="Assigned Sports Teachers"
                          modalSize="md"
                        >
                          <ViewAssignedSportsTeachersModal
                            isOpen={viewAssignedSportsTeachersModalState.showModal}
                            itemId={viewAssignedSportsTeachersModalState.modalData}
                          ></ViewAssignedSportsTeachersModal>
                        </ModalContainerUpdated>
        </>
    );
};

export default MapPvaSubjectsClasses;
