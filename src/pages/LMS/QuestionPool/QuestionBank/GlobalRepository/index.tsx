import { useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { useFormik } from "formik";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02StrokeStandard, EyeIcon, PencilEdit02Icon, UserGroup02Icon, } from "@hugeicons-pro/core-stroke-standard";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { getBranchClassAct, getBranchCurriculumAct, getInstSubjectNameAct } from "../../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { generateActionPayload } from "../../../../../utility/reduxutility";
import BreadCrumb from "../../../../../Components/Common/BreadCrumb";
import { ConfirmationModal, ModalContainerUpdated, OffCanvasContainer, SearchInput, SelectInput, TableExpandable, TextInput } from "../../../../../Components/Common";
import { generateColumns, searchInputOptions, ignoredKeys, poolData } from "./helper";
import { default as FilterSvg } from "../../../../../assets/imagesdps/academics/FilterSvg.svg?react";
import { useFilterState } from "../../../../../hooks/filterhook";
import AdvanceFilterModal from "./AdvancedFilterModal";
import { IPaginationState } from "../../../../../Components/Common/Pagination";
import ExportIcon from "../../../../../assets/imagesdps/common_icon/export_icon.svg";
import { UncontrolledTooltip } from "reactstrap";
import { useModal } from "../../../../../hooks/modalhook";
import AddPoolModel from "./AddPoolModel";
import ViewPoolModel from "./ViewPoolDetails";
import { deleteQuestionPoolLibraryAct, getQuestionPoolLibraryAct, getQuestionPoolLibraryByIdAct } from "../../../../../store/lms/lmsAssessment/lmsAssessmentaction";
import { toast } from "react-toastify";
import { getAssignedClassSubjectsList } from "../../../../../store/academic/classSubjects/classsubjectsactions";
import { setQuestionPoolLibraryAct } from "../../../../../store/lms/lmsAssessment/lmsAssessmentslice";
import { getMasterClassesAct, getMasterClassStreamGroupAct, getMasterCurriculumAct } from "../../../../../store/masterdata/masterdataactions";

const initialValues = {
    searchString: "",
    classId: "",
    curriculumId: "",
    subjectId: "",
    tags: "",
    streamGroupId: "",
   
};

const GlobalRepository = () => {
    const { closeModal: closeAddPoolModal, modalState: addPoolModalState, openModal: openAddPoolModal } = useModal();
    const { closeModal: closeViewPoolModal, modalState: viewPoolModalState, openModal: openViewPoolModal } = useModal();
    const { openModal: delOpenQutionModal, closeModal: delCloseQutionModal, modalState: delQutionFormatState } = useModal();
    const dispatch = useAppDispatch();
    const [searchStudentState, setSearchStudentState] = useState("global");
    const { showClearFilterState, count, advanceFilterChange } = useFilterState()
    const [open, setOpen] = useState<boolean>(false);
    const [modalMode, setModalMode] = useState("add");

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
        getQuestionPoolLibraryResp,
        saveQuestionPoolLibraryResp,
        deleteQuestionPoolLibraryResp,
        editQuestionPoolLibraryResp,
        getQuestionPoolLibraryByIdResp,
        lmsAssessmentErrorAct
    } = useAppSelector(
        ({ instituteInfo, masterData, instAcademics, globalData, branchAcademics, appData, lmsAssessment }) => ({
            instituteListResp: instituteInfo.instituteListResp,
            academicYearListResp: instAcademics.academicYearListResp,
            masterCurriculumResp: masterData.masterCurriculumResp,
            masterClassesResp: masterData.masterClassesResp,
            masterClassStreamGroupResp: masterData.masterClassStreamGroupResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            showApiLoader: globalData.showApiLoader,
            getQuestionPoolLibraryResp: lmsAssessment.getQuestionPoolLibraryResp,
            saveQuestionPoolLibraryResp: lmsAssessment.saveQuestionPoolLibraryResp,
            deleteQuestionPoolLibraryResp: lmsAssessment.deleteQuestionPoolLibraryResp,
            editQuestionPoolLibraryResp: lmsAssessment.editQuestionPoolLibraryResp,
            getQuestionPoolLibraryByIdResp: lmsAssessment.getQuestionPoolLibraryByIdResp,
            lmsAssessmentErrorAct: lmsAssessment.lmsAssessmentErrorAct

        }),
        shallowEqual
    );

    const UpdateClassroomRef = useRef<any>({
        prevSaveQuestionPoolLibraryResp: saveQuestionPoolLibraryResp,
        prevDeleteQuestionPoolLibraryResp: deleteQuestionPoolLibraryResp,
        prevEditQuestionPoolLibraryResp: editQuestionPoolLibraryResp,
        prevLmsAssessmentErrorAct: lmsAssessmentErrorAct
    });

    useEffect(() => {
        const { prevSaveQuestionPoolLibraryResp, prevDeleteQuestionPoolLibraryResp, prevLmsAssessmentErrorAct, prevEditQuestionPoolLibraryResp } = UpdateClassroomRef.current;

        if (saveQuestionPoolLibraryResp && saveQuestionPoolLibraryResp !== prevSaveQuestionPoolLibraryResp) {
            // dispatch(setQuestionPoolLibraryAct(undefined));
            getQuestionsPoolLibraryApiCall();
            closeAddPoolModal();
            toast.success("Question Pool saved successfully");
        }
        else if (editQuestionPoolLibraryResp && editQuestionPoolLibraryResp !== prevEditQuestionPoolLibraryResp) {
            // dispatch(setQuestionPoolLibraryAct(undefined));
            getQuestionsPoolLibraryApiCall();
            closeAddPoolModal();
            toast.success("Question Pool updated successfully");
        }
        else if (deleteQuestionPoolLibraryResp && deleteQuestionPoolLibraryResp !== prevDeleteQuestionPoolLibraryResp) {
            getQuestionsPoolLibraryApiCall();
            toast.success("Question Pool deleted successfully");
            delCloseQutionModal();
        }
        else if (lmsAssessmentErrorAct && lmsAssessmentErrorAct !== prevLmsAssessmentErrorAct) {
            toast.error(lmsAssessmentErrorAct.details || "Something went wrong.");
        }
        UpdateClassroomRef.current.prevSaveQuestionPoolLibraryResp = saveQuestionPoolLibraryResp;
        UpdateClassroomRef.current.prevDeleteQuestionPoolLibraryResp = deleteQuestionPoolLibraryResp;
        UpdateClassroomRef.current.prevLmsAssessmentErrorAct = lmsAssessmentErrorAct;
        UpdateClassroomRef.current.prevEditQuestionPoolLibraryResp = editQuestionPoolLibraryResp;
    }, [saveQuestionPoolLibraryResp, deleteQuestionPoolLibraryResp, lmsAssessmentErrorAct, editQuestionPoolLibraryResp]);


    const signatureForm = useFormik({
        // enableReinitialize: true,
        initialValues,
        onSubmit: (values) => { },
    });


    const menuOptions = useMemo(
        () => [
            {
                id: "viewDetails",
                actionIcon: <HugeiconsIcon icon={EyeIcon} className="me-2 text-muted" size={16} />,
                actionName: "View",
                onClickHndlr: () => { openViewPoolModal() },
            },
            {
                id: "assign",
                actionIcon: <HugeiconsIcon icon={UserGroup02Icon} className="me-2 text-muted" size={16} />,
                actionName: "Assign",
                onClickHndlr: (event: any) => {
                    const id = event.currentTarget.getAttribute("data-id");
                    dispatch(getQuestionPoolLibraryByIdAct(generateActionPayload("get_question_pool_library_by_id", { id: id },)));
                    setModalMode("assign");
                    openAddPoolModal(id);
                },
            },
            {
                id: "edit",
                actionIcon: <HugeiconsIcon icon={PencilEdit02Icon} className="me-2 text-muted" size={16} />,
                actionName: "Edit",
                onClickHndlr: (event: any) => {
                    const id = event.currentTarget.getAttribute("data-id");
                    dispatch(getQuestionPoolLibraryByIdAct(generateActionPayload("get_question_pool_library_by_id", { id: id },)));
                    setModalMode("edit");
                    openAddPoolModal(id);
                },
            },
            {
                id: "delete",
                actionIcon: <HugeiconsIcon icon={Delete02StrokeStandard} className="me-2 text-danger" size={16} />,
                actionName: "Delete",
                onClickHndlr: (event: any) => {
                    const id = event.currentTarget.getAttribute("data-id");
                    delOpenQutionModal(id);
                },
            },
        ],
        []
    );

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

    const getQuestionsPoolLibraryApiCall = (otherProps?: any) => {
                const selectedInstitute = instituteListResp?.data?.find((item: any) => Number(item?.id) === Number(instituteId));
        const { data } = academicYearListResp || {};
        const currentAcademicYear = Array.isArray(data) ? data.find((year: any) => year.yearStatus?.toUpperCase() === "CURRENT") : null;
        const academicYearId = currentAcademicYear?.academicYearId ?? null;

        let payload = {
            instituteGroupId: selectedInstitute?.instituteGroupId,
            branchId,
            academicYearId: academicYearId,
            curriculumId: signatureForm.values.curriculumId,
            classId: signatureForm.values.classId,
            subjectId: signatureForm.values.subjectId,
            tags: signatureForm.values.tags,
            searchString: signatureForm.values.searchString,
            ...paginationDetailRef.current,
            ...otherProps
        };
        
        if (payload.branchId) {
            dispatch(getQuestionPoolLibraryAct(generateActionPayload("get_question_pool_library", undefined, payload)));
        }
      }

    useEffect(() => {
        const { data } = academicYearListResp || {};
        if (Array.isArray(data) && data.length > 0) {
            const academicYearId = data.find((year: any) => year.yearStatus?.toUpperCase() === "CURRENT")?.academicYearId;
            if (academicYearId) {
                getQuestionsPoolLibraryApiCall({ academicYearId });
            }
        }
    }, [academicYearListResp]);

    useEffect(() => {
        getCurriculumApiCall();
        getClassApiCall();
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
        paginationDetailRef.current.pageNo = 0;
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

            getQuestionsPoolLibraryApiCall({
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

            getQuestionsPoolLibraryApiCall({
                ...updatedValues,
                pageNo: 0,
            });
        }
        else{
            signatureForm.setValues((prev: any) => ({ ...prev, [name]: value }));
            getQuestionsPoolLibraryApiCall({ [name]: value });
        }
        
    }
          const toggleAdvanceFilter = () => {
              setOpen(prev => !prev);
          }

          
          
          function onChangeHandler(name: string, id: any, item: any) {
              setSearchStudentState(id);
              
            }
            
            function advanceFilterCallbckHndlr(appliedFilters?: any) {
            paginationDetailRef.current = { ...paginationDetailRef.current, pageNo: 0 }
            advanceFilterChange({ keys : { ...initialValues, ...appliedFilters , academicYearId: "" } , ignoredKeys })
            signatureForm.setValues((prevState: any) => ({ ...prevState, ...appliedFilters }));
            getQuestionsPoolLibraryApiCall(appliedFilters)    
        }
        
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

        const delLibraryDetailsConfirmHndler = () => {
            dispatch(deleteQuestionPoolLibraryAct(generateActionPayload("delete_question_pool_library", { id: delQutionFormatState.modalData },)));
        }
        
        
        const tableColumns = useMemo(() => generateColumns(menuOptions), [menuOptions]);
    const paginationHndlr = useCallback((paginationInfo: IPaginationState) => {
        // Only update if pageNo or pageSize actually changed
        if (
            paginationDetailRef.current.pageNo !== paginationInfo.pageNo ||
            paginationDetailRef.current.pageSize !== paginationInfo.pageSize
        ) {
            paginationDetailRef.current = paginationInfo;
            getQuestionsPoolLibraryApiCall(paginationInfo);
        }
    }, []);

    const clearFilterHndlr = () => {
        paginationDetailRef.current = {
            ...paginationDetailRef.current,
            pageNo: 0,
        };

        signatureForm.setValues(initialValues);

        getQuestionsPoolLibraryApiCall();

        advanceFilterChange({
            keys: initialValues,
            ignoredKeys,
        });
    };
    const { data: cbseExaminationSubjectsResp, totalElements, totalPages, pageable } = getQuestionPoolLibraryResp || {};    


    return (
        <>
            <div className="card d-inline-block w-100">
                <div className="row px-3 g-3 pt-4 py-2">
                    <div className="col-xs-12 col-md-12 col-lg-4 col-xl-4">
                        <SearchInput
                            hideDefaultSelect
                            name="searchString"
                            value={searchStudentState}
                            menuItems={searchInputOptions}
                            idKey="id"
                            labelName="Search With"
                            searchHandler={filterHandler}
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
                    <div className="col-xs-12 col-md-12 col-lg-2">
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
                    <div className="col-xs-12 col-md-12 col-lg-3 col-xl-1">
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
                            className="btn btn-success float-end d-flex align-items-center" onClick={() => {
                                setModalMode("add");
                                openAddPoolModal();
                            }}
                        >
                            <i className="ri-add-line me-2" />
                            Add Question Pool
                        </button>
                    </div>
                    <div className="col-auto ">
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
                    </div>
                </div>
                <TableExpandable
                    columns={tableColumns}
                    data={getQuestionPoolLibraryResp?.content}
                    divClass="table-responsive table-expandable table-sticky"
                    theadClass="text-muted align-middle"
                    tableClass="table-bordered table-nowrap"
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
                isOpen={addPoolModalState.showModal}
                toggle={closeAddPoolModal}
                modalTitle={
                    modalMode === 'edit' ? "Edit Pool" :
                        modalMode === 'assign' ? "Assign Pool" : "Add Pool"
                }
                modalSize="lg"
            >
                <AddPoolModel
                    id={addPoolModalState.modalData}
                    isOpen={addPoolModalState.showModal}
                    toggle={closeAddPoolModal}
                    modalTitle={
                        modalMode === 'edit' ? "Edit Pool" :
                            modalMode === 'assign' ? "Assign Pool" : "Add Pool"
                    }
                    data={getQuestionPoolLibraryByIdResp}
                    mode={modalMode}
                />
            </ModalContainerUpdated>
            <ModalContainerUpdated
                id="add-examination"
                isOpen={viewPoolModalState.showModal}
                toggle={() => closeViewPoolModal()}
                modalTitle="View Pool"
                modalSize="xl"
            >
                <ViewPoolModel
                    id={viewPoolModalState.modalData}
                    isOpen={false}
                    toggle={() => closeViewPoolModal()}
                    modalTitle="View Pool"
                />
            </ModalContainerUpdated>
            {/* <ModalContainerUpdated
                id="add-examination"
                isOpen={usedInModalState.showModal}
                toggle={() => closeUsedInModal()}
                modalTitle="View Pool"
                modalSize="xl"
            >
                <UsedInModel
                    id={usedInModalState.modalData}
                    isOpen={false}
                    toggle={() => closeUsedInModal()}
                    modalTitle="View Pool"
                />
            </ModalContainerUpdated> */}
             <ConfirmationModal
                    id="del-question-formate-modal"
                    isOpen={delQutionFormatState.showModal}
                    confirmMessage="Are you sure you want to Delete the Question Format"
                    cancelHndlr={delCloseQutionModal}
                    confirmHndlr={delLibraryDetailsConfirmHndler}
                    showImgIcon={true}
                    iconType="reject"
                  ></ConfirmationModal>
        </>
    );
};

export default GlobalRepository;
