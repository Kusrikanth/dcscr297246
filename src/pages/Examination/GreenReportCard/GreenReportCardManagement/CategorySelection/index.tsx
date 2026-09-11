import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { generateColumns, ignoredKeys } from "./helper";
import { useFormik } from "formik";
import AoselectionModel from "./AoSelectionModel";
import { ConfirmationModal, ModalContainerUpdated, OffCanvasContainer, SelectInput, TextInput } from "../../../../../Components/Common";
import TableContainer from "../../../../../Components/Common/TableContainer";
import { useModal } from "../../../../../hooks/modalhook";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { generateActionPayload } from "../../../../../utility/reduxutility";
import { getBranchClassAct, getBranchCurriculumAct, resetBrchClassAct } from "../../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { resetAoTermSubjectsAct, setAoTermSubjectsAct } from "../../../../../store/examination/examinationmanagement/examinationmanagementactions";
import { IPaginationState } from "../../../../../Components/Common/Pagination";
import * as Yup from "yup"
import { toast } from "react-toastify";
import { useFilterState } from "../../../../../hooks/filterhook";
import { default as FilterSvg } from "../../../../../assets/imagesdps/academics/FilterSvg.svg?react";
import AdvanceFilterModal from "./AdvancedFilterModal";
import { debounce } from "../../../../../utility/commonutility";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02StrokeStandard, PencilEdit02Icon } from "@hugeicons-pro/core-stroke-standard";
import { getIgseTermNameListAct } from "../../../../../store/examination/examinationsettings/examinationsettingsaction";
import { setIgseTermDetailsListAct } from "../../../../../store/examination/examinationsettings/examinationsettingsslice";
import { useLocation } from "react-router-dom";
import { deleteCategorySelectionAct, getCategorySelectionByIdAct, getCategorySelectionListAct, getGreenReportCardCategoryListAct } from "../../../../../store/examination/pvaReports/pvaReportsActions";

const initialValues = {
    searchString: "",
    academicYearId: "",
    curriculumId: "",
    classId: "",
    termId: "",
    categoryId: "",
};

const validationSchema = Yup.object().shape({
    academicYearId: Yup.string().required("Academic Year is required."),
    curriculumId: Yup.string().required("Curriculum is required."),
    classId: Yup.string().required("Class is required.").nullable(),
});
const CategorySelection = () => {

    const { closeModal: closeAoSectionModal, openModal: openAoSectionModal, modalState: aoselectionModelState } = useModal();
    const { closeModal: closeDelAoSectionModal, modalState: delAoSectionModalState, openModal: openDelAoSectionModal } = useModal();
    const { showClearFilterState, advanceFilterChange, count } = useFilterState();
    const dispatch = useAppDispatch();
    const location = useLocation();
    const pagination = useRef({
        pageNo: 0,
        pageSize: 10
    })
    const [open, setOpen] = useState<boolean>(false);


    const {
        academicYearListResp,
        brchCurriculumResp,
        branchClassResp,
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        showApiLoader,
        getAoTermSubjectsResp,
        examinationManagementErrorResp,
        saveCategorySelectionResp,
        deleteCategorySelectionResp,
        updateCategorySelectionResp,
        getCategorySelectionListResp,
        pvaReportsErrorAct


    } = useAppSelector(
        ({ globalData, instAcademics, branchAcademics, appData, examinationManagement, pvaReports }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            branchClassResp: branchAcademics.branchClassResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            showApiLoader: globalData.showApiLoader,
            getAoTermSubjectsResp: examinationManagement.getAoTermSubjectsResp,
            examinationManagementErrorResp: examinationManagement.examinationManagementErrorResp,
            saveCategorySelectionResp: pvaReports.saveCategorySelectionResp,
            deleteCategorySelectionResp: pvaReports.deleteCategorySelectionResp,
            updateCategorySelectionResp: pvaReports.updateCategorySelectionResp,
            getCategorySelectionListResp: pvaReports.getCategorySelectionListResp,
            pvaReportsErrorAct: pvaReports.pvaReportsErrorAct,

        }),
        shallowEqual
    );

    const marksEntryRef = useRef({
        prevSaveCategorySelectionResp: saveCategorySelectionResp,
        prevExaminationManagementErrorResp: examinationManagementErrorResp,
        prevDeleteCategorySelectionResp: deleteCategorySelectionResp,
        prevUpdateCategorySelectionResp: updateCategorySelectionResp,
        prevPvaReportsErrorAct: pvaReportsErrorAct,
    })

    useEffect(() => {
        const { prevSaveCategorySelectionResp, prevExaminationManagementErrorResp, prevDeleteCategorySelectionResp, prevUpdateCategorySelectionResp,prevPvaReportsErrorAct } = marksEntryRef.current || {}

        if (saveCategorySelectionResp && prevSaveCategorySelectionResp !== saveCategorySelectionResp) {
            toast.success("Category Selection Saved Successfully")
            closeAoSectionModal()
            getCategoryListApiCall()
        }
        else if (examinationManagementErrorResp && prevExaminationManagementErrorResp !== examinationManagementErrorResp) {
            const { details } = examinationManagementErrorResp || {}
            toast.error(details || "Something went wrong")
        }
        else if (deleteCategorySelectionResp && prevDeleteCategorySelectionResp !== deleteCategorySelectionResp) {
            toast.success("Category Selection Deleted Successfully")
            getCategoryListApiCall()
            closeDelAoSectionModal()
        }
        else if (updateCategorySelectionResp && prevUpdateCategorySelectionResp !== updateCategorySelectionResp) {
            toast.success("Category Selection Updated Successfully")
            getCategoryListApiCall()
            closeAoSectionModal()
        } else if (
              pvaReportsErrorAct &&
              pvaReportsErrorAct !== prevPvaReportsErrorAct
            ) {
              const { details } = pvaReportsErrorAct;
              toast.error(details || 'Something went wrong');
            }
        marksEntryRef.current.prevSaveCategorySelectionResp = saveCategorySelectionResp;
        marksEntryRef.current.prevExaminationManagementErrorResp = examinationManagementErrorResp;
        marksEntryRef.current.prevDeleteCategorySelectionResp = deleteCategorySelectionResp;
        marksEntryRef.current.prevUpdateCategorySelectionResp = updateCategorySelectionResp;
        marksEntryRef.current.prevPvaReportsErrorAct = pvaReportsErrorAct;

    }, [saveCategorySelectionResp, examinationManagementErrorResp, deleteCategorySelectionResp, updateCategorySelectionResp,pvaReportsErrorAct])

    const aoSelectionForm = useFormik({
        validationSchema,
        initialValues,
        onSubmit: (values) => { },
    });

    function editScheduleTaskModalHndlr(event: React.MouseEvent<HTMLElement>) {
        const id = event.currentTarget.getAttribute("data-id");
        dispatch(getCategorySelectionByIdAct(generateActionPayload('get_category_selection_by_id', { id })));
        openAoSectionModal(id);
    }

    const menuOptions = useMemo(
        () => [
            {
                id: "edit",
                actionIcon: <HugeiconsIcon icon={PencilEdit02Icon} className="text-muted" size={18} />,
                actionName: "Edit",
                onClickHndlr: editScheduleTaskModalHndlr,
            },
            {
                id: "delete",
                actionIcon: <HugeiconsIcon icon={Delete02StrokeStandard} className="text-danger" size={18} />,
                actionName: "Delete",
                onClickHndlr: (event: React.MouseEvent<HTMLElement>) => {
                    const id = event.currentTarget.getAttribute("data-id");
                    openDelAoSectionModal(id)
                },
            },
        ],
        []
    );

    const getCategoryListApiCall = (otherProps?: any) => {
        const payload = {
            branchId,
            academicYearId: aoSelectionForm.values.academicYearId,
            curriculumId: aoSelectionForm.values.curriculumId,
            classId: aoSelectionForm.values.classId,
            termId: aoSelectionForm.values.termId,
            categoryId: aoSelectionForm.values.categoryId,
            ...pagination.current,
            ...otherProps,
        }
        if (payload.academicYearId) {
            dispatch(getCategorySelectionListAct(generateActionPayload("get_category_selection_list", undefined, payload)));
        }
    }

    const igseTermList = (curriculumId: string) => {
        if (curriculumId) {
            let payload = {
                branchId,
                curriculumId,
            };
            dispatch(getIgseTermNameListAct(generateActionPayload("get_igse_term_name_list", undefined, payload)));
        }
    };

    function fetchGreenReportCardCategoryList(otherProps?: any) {
        const { academicYearId, searchString } = aoSelectionForm.values;
        const payload = {
            branchId,
            academicYearId,
            searchString,
            ...otherProps,
            ...pagination.current,
        };
        dispatch(
            getGreenReportCardCategoryListAct(
                generateActionPayload(
                    'get_green_report_card_category_list',
                    undefined,
                    payload,
                ),
            ),
        );
    }
    const getCurriculumApiCall = (otherProps?: any) => {
        const payload1 = { academicYearId: aoSelectionForm.values.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", ...otherProps };
        dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
    }

    function delModalSubmitHndlr() {
        dispatch(deleteCategorySelectionAct(generateActionPayload("delete_category_selection", { id: delAoSectionModalState.modalData })));
    }

    useEffect(() => {
        return () => {
            dispatch(setAoTermSubjectsAct(undefined));
            dispatch(resetAoTermSubjectsAct(undefined));
        }
    }, [])


    useEffect(() => {
        let yearId = academicYearListResp?.data.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId;
        if (yearId) {
            aoSelectionForm.setValues((prev: any) => ({ ...prev, academicYearId: yearId }));
            fetchGreenReportCardCategoryList({ academicYearId: yearId })
            getCategoryListApiCall({ academicYearId: yearId })
            const payload1 = {
                academicYearId: yearId,
                branchId: branchId,
                pageNo: 0,
                pageSize: 100,
                sortBy: "curriculumName",
                orderBy: "asc",
            };
            dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
        }
    }, [academicYearListResp]);


    useEffect(() => {
        const { content } = branchClassResp || {};
        if (Array.isArray(content) && content.length > 0) {
            aoSelectionForm.setFieldValue("classId", content[0].id);
            getCategoryListApiCall({ classId: content[0]?.id });
        }
    }, [branchClassResp])

    function search(value: string) {
        getCategoryListApiCall({ ...aoSelectionForm.values, searchString: value });
    }

    const debounceFun = useCallback(debounce(search, 200), [getAoTermSubjectsResp]);

    const getClassApiCall = (otherProps?: any) => {
        const payload = { branchId: branchId, academicYearId: aoSelectionForm.values?.academicYearId, curriculumId: aoSelectionForm.values.curriculumId, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100, ...otherProps };
        dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
    }

    const filterHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        pagination.current.pageNo = 0;
        if (name === "academicYearId") {
            getCurriculumApiCall({ academicYearId: value });
            aoSelectionForm.setValues((prev: any) => ({
                ...prev,
                [name]: value,
                classId: null,
                curriculumId: prev.curriculumId ? prev.curriculumId : "",
            }));
            fetchGreenReportCardCategoryList({ academicYearId: value })
            getCategoryListApiCall({ academicYearId: value, curriculumId: "", classId: "", categoryId: "" });
        } else if (name === 'curriculumId') {
            aoSelectionForm.setValues((prev: any) => ({ ...prev, [name]: value, classId: "", sectionId: "" }))
            if (!value) {
                dispatch(resetBrchClassAct(undefined))
                dispatch(setIgseTermDetailsListAct(undefined))
            }
            else {
                getClassApiCall({ curriculumId: value, academicYearId: aoSelectionForm.values.academicYearId });
                igseTermList(value);
            }
        }
        else if (name === 'classId') {
            aoSelectionForm.setValues((prev: any) => ({ ...prev, [name]: value, categoryId: "" }));
            getCategoryListApiCall({ classId: value, categoryId: "" });
        }
        else if (name === "serchString") {
            aoSelectionForm.setValues((prev: any) => ({ ...prev, [name]: value }));
            debounceFun(value);
        }
        else {
            aoSelectionForm.setValues((prev: any) => ({ ...prev, [name]: value }))
            getCategoryListApiCall({ [name]: value });
        }
        advanceFilterChange({
            keys: { ...aoSelectionForm.values, [name]: value },
            ignoredKeys: ["serchString", "academicYearId", "curriculumId", "classId"],
        });
    }

    function paginationHndlr(paginationInfo: IPaginationState) {
        pagination.current = paginationInfo;
        getCategoryListApiCall(paginationInfo);
    }
    const toggleAdvanceFilter = () => {
        setOpen(prev => !prev);
    }
    function advanceFilterCallbckHndlr(appliedFilters?: any) {
        pagination.current = { ...pagination.current, pageNo: 0 }
        advanceFilterChange({ keys: { ...initialValues, ...appliedFilters, academicYearId: "" }, ignoredKeys })
        aoSelectionForm.setValues((prevState: any) => ({ ...prevState, ...appliedFilters }));
        getCategoryListApiCall(appliedFilters)
    }

    const clearFilterHndlr = () => {
        if (academicYearListResp) {
            pagination.current = { ...pagination.current, pageNo: 0 }
            const { academicYearId } = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current") || {}
            dispatch(resetBrchClassAct(undefined))
            aoSelectionForm.setValues({ ...initialValues, academicYearId: academicYearId || "" })
            getCurriculumApiCall({ academicYearId })
            fetchGreenReportCardCategoryList({ academicYearId })
            getCategoryListApiCall({ ...initialValues, academicYearId })
            advanceFilterChange({ keys: { ...initialValues }, ignoredKeys: [] });
        }
    };

    const columns = useMemo(() => generateColumns(menuOptions), []);
    const { data: academicYearList } = academicYearListResp || {};
    const { data: curriculumTypes } = brchCurriculumResp || {}
    const { content: classTypes } = branchClassResp || {};
    const { content: studentList, totalElements, totalPages, pageable } = getCategorySelectionListResp || {}

    return (
        <>
            <div className="card d-inline-block w-100">
                <form onSubmit={aoSelectionForm.handleSubmit}>
                    <div className="row bg-light m-3 pb-3 px-2 g-3 examination">

                        <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                            <div className="search-box">
                                <TextInput
                                    name="searchString"
                                    formgroupClassName="mb-0"
                                    placeHolder="Search"
                                    labelText="Search"
                                    floatingLabel
                                    inputClassName="bg-light"
                                    value={aoSelectionForm.values.searchString}
                                    onChange={filterHandler}
                                />
                                <i className="ri-search-line search-icon"></i>
                            </div>
                        </div>
                        <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                            <SelectInput
                                name="academicYearId"
                                value={aoSelectionForm.values.academicYearId}
                                onChange={filterHandler}
                                menuItems={academicYearList || []}
                                valueKey="academicYearId"
                                textKey="academicYearName"
                                labelText="Academic Year"
                                labelClass="required"
                                formgroupClassName="mb-0"
                                floatingLabel
                                inputClassName="bg-light"
                                invalid={(aoSelectionForm.touched.academicYearId && aoSelectionForm.errors.academicYearId) ? true : false}
                                error={(aoSelectionForm.touched.academicYearId && aoSelectionForm.errors.academicYearId) ? aoSelectionForm.errors.academicYearId : ""}
                            />
                        </div>
                        <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                            <SelectInput
                                name="curriculumId"
                                value={aoSelectionForm.values.curriculumId}
                                onChange={filterHandler}
                                menuItems={curriculumTypes}
                                valueKey="branchCurriculumId"
                                textKey="curriculumName"
                                labelText="Curriculum"
                                labelClass="required"
                                formgroupClassName="mb-0"
                                floatingLabel
                                inputClassName="bg-light"
                                invalid={(aoSelectionForm.touched.curriculumId && aoSelectionForm.errors.curriculumId) ? true : false}
                                error={(aoSelectionForm.touched.curriculumId && aoSelectionForm.errors.curriculumId) ? aoSelectionForm.errors.curriculumId : ""}
                            />
                        </div>
                        <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                            <SelectInput
                                name="classId"
                                value={aoSelectionForm.values.classId}
                                onChange={filterHandler}
                                menuItems={classTypes}
                                valueKey="id"
                                textKey="shortName"
                                labelText="Class"
                                labelClass="required"
                                formgroupClassName="mb-0"
                                floatingLabel
                                inputClassName="bg-light"
                                invalid={(aoSelectionForm.touched.classId && aoSelectionForm.errors.classId) ? true : false}
                                error={(aoSelectionForm.touched.classId && aoSelectionForm.errors.classId) ? aoSelectionForm.errors.classId : ""}
                            />
                        </div>
                        <div className="col-1">
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
                            <div className="col-auto ms-auto d-flex">
                                <button
                                    type="button"
                                    onClick={clearFilterHndlr}
                                    className="btn btn-ghost-danger"
                                >
                                    Clear filter
                                </button>
                            </div>
                        )}

                        <div className="col-auto ms-auto">
                            <button
                                className="btn btn-success float-end d-flex align-items-center"
                                onClick={() => openAoSectionModal()}
                            >
                                <i className="ri-add-line me-2" />
                                Add New
                            </button>
                        </div>
                    </div>
                </form>

                <TableContainer
                    columns={columns || []}
                    data={studentList || []}
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
            <ModalContainerUpdated
                id="detensions-or-promotions"
                isOpen={aoselectionModelState.showModal}
                toggle={closeAoSectionModal}
                modalTitle="Category Selection"
                modalSize="xl"
            >
                <AoselectionModel
                    isOpen={aoselectionModelState.showModal}
                    toggle={closeAoSectionModal}
                    modalTitle="Category Selection"
                    modalData={aoSelectionForm.values}
                    modalData1={aoselectionModelState.modalData}
                />
            </ModalContainerUpdated>
            <ConfirmationModal
                id="delete-examination-ao-selection"
                isOpen={delAoSectionModalState.showModal}
                confirmMessage="Are you sure you want to delete this Category Selection ?"
                cancelHndlr={closeDelAoSectionModal}
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
                    appliedFilter={aoSelectionForm.values}
                    applyFilterCallback={advanceFilterCallbckHndlr}
                    toggleAdvanceFilter={toggleAdvanceFilter}
                    isOpen={open}
                />
            </OffCanvasContainer>
        </>
    );
};

export default CategorySelection;
