import React, { useEffect, useMemo, useRef } from "react";
import { ConfirmationModal, ModalContainerUpdated, SelectInput, TextInput } from '../../../../../Components/Common';
import TableContainer from '../../../../../Components/Common/TableContainer';
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
import { useFilterState } from "../../../../../hooks/filterhook";
import { useModal } from "../../../../../hooks/modalhook";
import { deleteCbseInternalSubjectsGradesAct, getCbseInternalSubjectsGradesByIdAct, getCbseInternalSubjectsGradesListAct, } from "../../../../../store/examination/examinationsettings/examinationsettingsaction";
import { generateActionPayload } from "../../../../../utility/reduxutility";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import { getBranchClassAct, getBranchCurriculumAct, resetBrchClassAct, resetBrchCurriculumAct } from "../../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { IPaginationState } from "../../../../../Components/Common/Pagination";
import BreadCrumb from "../../../../../Components/Common/BreadCrumb";
import { useFormik } from "formik";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02StrokeStandard, PencilEdit02Icon } from "@hugeicons-pro/core-stroke-standard";
import { generateInternalSubjectGradesColumns } from "./helper";
import AddInternalSubjectGradesModal from "./AddInternalSubjectGradesModal";


const initialValues = {
    searchString: "",
    academicYearId: "",
    curriculumId: "",
    classId: "",
    domainId:"",
};

const DisciplineInternalSubjectGrades = () => {

    const dispatch = useAppDispatch();
    const { closeModal: closeDelInternalSubjectGradesGradeModal, modalState: deleteInternalSubjectGradesGradeState, openModal: openDelInternalSubjectGradesGradeModal } = useModal();
    const { closeModal: closeInternalSubjectGradesGradeUploadModal, modalState: cbseInternalSubjectGradesUploadState, openModal: openInternalSubjectGradesGradeUploadModal } = useModal();

    const pagination = useRef({
        pageNo: 0,
        pageSize: 10
    });

    const internaSubjectGradesList = (otherProps?: any) => {
        const payload = {
            branchId,
            ...internalSubjectGradeForm.values,
            ...pagination.current,
            ...otherProps,
        };
        dispatch(getCbseInternalSubjectsGradesListAct(generateActionPayload("get_cbse_internal_subjects_grades_list", undefined, payload)));
    };

    function delModalSubmitHndlr() {
        dispatch(deleteCbseInternalSubjectsGradesAct(generateActionPayload("delete_cbse_internal_subjects_grades_list", { id: deleteInternalSubjectGradesGradeState.modalData })));
    }

    const internalSubjectGradeForm = useFormik({
        initialValues,
        onSubmit: (values) => { },
    });

    const {
        academicYearListResp,
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        brchCurriculumResp,
        branchClassResp,
        showApiLoader,
        getCbseInternalSubjectsGradesListResp,
        saveCbseInternalSubjectsGradesListResp,
        editCbseInternalSubjectsGradesListResp,
        deleteCbseInternalSubjectsGradesListResp,
        
        cbseExaminationErrorAct
    } = useAppSelector(
        ({ instAcademics, branchAcademics, examinationSettings, appData, globalData, }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            showApiLoader: globalData.showApiLoader,
            currentInstIdResp: appData.currentInstIdResp,
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            branchClassResp: branchAcademics.branchClassResp,
            getCbseInternalSubjectsGradesListResp: examinationSettings.getCbseInternalSubjectsGradesListResp,
            saveCbseInternalSubjectsGradesListResp: examinationSettings.saveCbseInternalSubjectsGradesListResp,
            editCbseInternalSubjectsGradesListResp: examinationSettings.editCbseInternalSubjectsGradesListResp,
           
            deleteCbseInternalSubjectsGradesListResp: examinationSettings.deleteCbseInternalSubjectsGradesListResp,
            cbseExaminationErrorAct: examinationSettings.cbseExaminationErrorAct,
        }),
        shallowEqual
    );

    const cbseInternalSubjectGradesRef = useRef({
        prevSaveCbseInternalSubjectsGradesListResp: saveCbseInternalSubjectsGradesListResp,
        prevEditCbseInternalSubjectsGradesListResp: editCbseInternalSubjectsGradesListResp,
        prevDeleteCbseInternalSubjectsGradesListResp: deleteCbseInternalSubjectsGradesListResp,
        
        prevInternalSubjectGradesGradesErrorResp: cbseExaminationErrorAct,
    })

    useEffect(() => {
        const { prevSaveCbseInternalSubjectsGradesListResp, prevEditCbseInternalSubjectsGradesListResp, prevDeleteCbseInternalSubjectsGradesListResp, prevInternalSubjectGradesGradesErrorResp } = cbseInternalSubjectGradesRef.current;
        if (saveCbseInternalSubjectsGradesListResp && prevSaveCbseInternalSubjectsGradesListResp !== saveCbseInternalSubjectsGradesListResp) {
            toast.success("Internal Subject Grades added successfully.");
            closeInternalSubjectGradesGradeUploadModal()
            internaSubjectGradesList()
        }
        else if (editCbseInternalSubjectsGradesListResp && prevEditCbseInternalSubjectsGradesListResp !== editCbseInternalSubjectsGradesListResp) {
            toast.success("Internal Subject Grades updated successfully.");
            closeInternalSubjectGradesGradeUploadModal()
            internaSubjectGradesList()
        }
        
        else if (deleteCbseInternalSubjectsGradesListResp && prevDeleteCbseInternalSubjectsGradesListResp !== deleteCbseInternalSubjectsGradesListResp) {
            toast.success("Internal Subject Grades deleted successfully.");
            closeDelInternalSubjectGradesGradeModal()
            internaSubjectGradesList()
        }
        else if (cbseExaminationErrorAct && prevInternalSubjectGradesGradesErrorResp !== cbseExaminationErrorAct) {
            const { details } = cbseExaminationErrorAct || {};
            toast.error(details || "Something went wrong.");
        }
        cbseInternalSubjectGradesRef.current.prevDeleteCbseInternalSubjectsGradesListResp = deleteCbseInternalSubjectsGradesListResp;
        cbseInternalSubjectGradesRef.current.prevEditCbseInternalSubjectsGradesListResp = editCbseInternalSubjectsGradesListResp;
        cbseInternalSubjectGradesRef.current.prevSaveCbseInternalSubjectsGradesListResp = saveCbseInternalSubjectsGradesListResp;
        
        cbseInternalSubjectGradesRef.current.prevInternalSubjectGradesGradesErrorResp = cbseExaminationErrorAct;
    }, [saveCbseInternalSubjectsGradesListResp, editCbseInternalSubjectsGradesListResp, deleteCbseInternalSubjectsGradesListResp, cbseExaminationErrorAct]);

    useEffect(() => {
        const yearId = academicYearListResp?.data.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId;
        if (yearId) {
            internaSubjectGradesList({ academicYearId: yearId });
            internalSubjectGradeForm.setValues((prev: any) => ({ ...prev, academicYearId: yearId }));
            getCurriculumApiCall({ academicYearId: yearId });
        }
    }, [academicYearListResp]);
    const classApiCalled = useRef(false);
    useEffect(() => {
        const { data } = brchCurriculumResp || {};
        const curriculumMapping: Record<string, string> = {
            "/early-years-settings/internal-subject-grades": "EY1-EY3",
            "/cbse-settings/internal-subject-grades": "CBSE",
            "/igcse-settings/internal-subject-grades": "IGCSE",
        };
        const selectedCurriculumName = curriculumMapping[location.pathname];
        if (Array.isArray(data) && data.length > 0 && internalSubjectGradeForm.values.academicYearId && !classApiCalled.current) {
            const selectedCurriculum = data.find(
                (item) => item.shortName === selectedCurriculumName
            );
            if (!selectedCurriculum) {
                internalSubjectGradeForm.setValues((prev: any) => ({
                    ...prev,
                    curriculumId: undefined,
                }));
                return;
            }
            const payload = {
                branchId,
                curriculumId: selectedCurriculum.branchCurriculumId,
                academicYearId: internalSubjectGradeForm.values.academicYearId,
                sortBy: "classSequence",
                classFilter: "HIGHER",
                orderBy: "asc",
                pageNo: 0,
                pageSize: 100,
            };
            dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
            internalSubjectGradeForm.setValues((prev: any) => ({
                ...prev,
                curriculumId: selectedCurriculum.branchCurriculumId,
            }));
            classApiCalled.current = true;
        }
    }, [brchCurriculumResp, internalSubjectGradeForm.values.academicYearId]);

    const menuOptions = useMemo(
        () => [
            {
                id: "edit",
                actionIcon: <HugeiconsIcon icon={PencilEdit02Icon} className=" text-muted" size={20} />,
                actionName: "Edit",
                onClickHndlr: (event: any) => {
                    const id = event.currentTarget.getAttribute("data-id");
                    dispatch(getCbseInternalSubjectsGradesByIdAct(generateActionPayload("get_cbse_internal_subjects_grades_list_by_id", { id })));
                    openInternalSubjectGradesGradeUploadModal(id);
                },
            },
            {
                id: "delete",
                actionIcon: <HugeiconsIcon icon={Delete02StrokeStandard} className="text-danger" size={18} />,
                actionName: "Delete",
                onClickHndlr: (event: any) => {
                    const id = event.currentTarget.getAttribute("data-id");
                    openDelInternalSubjectGradesGradeModal(id)
                },
            },
        ],
        [getCbseInternalSubjectsGradesListResp]
    );

    function paginationHndlr(paginationInfo: IPaginationState) {
        pagination.current = paginationInfo;
        internaSubjectGradesList(paginationInfo);
    }
    const getCurriculumApiCall = (otherProps?: any) => {
        const payload1 = { academicYearId: internalSubjectGradeForm.values.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", ...otherProps };
        dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
    }
    function getClassApiCall(otherProps?: any) {
        const { academicYearId, curriculumId } = internalSubjectGradeForm.values || {};
        const payload = {
            academicYearId,
            curriculumId,
            branchId,
            classFilter: "HIGHER",
            pageNo: 0,
            pageSize: 100,
            sortBy: "classSequence",
            orderBy: "asc",
            ...otherProps,
        };
        dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
    }

    function fetchDisciplineInternalGrades(otherProps?: any){
        const {
            academicYearId, curriculumId
        } = internalSubjectGradeForm.values || {};
    }
    const onChangeFilterHndlr = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        pagination.current.pageNo = 0;
        if (name === "academicYearId") {
            internalSubjectGradeForm.setValues((prev: any) => ({
                ...prev,
                [name]: value,
                curriculumId:"",
                classId:"",
                domainId:""
            }));
            fetchDisciplineInternalGrades({ [name]: value });
            if(!value){
                dispatch(resetBrchCurriculumAct(undefined))
            }else {
                getCurriculumApiCall({ academicYearId: value });
            }
        } else if(name === 'curriculumId'){
            internalSubjectGradeForm.setValues((prev: any) => ({
                ...prev,
                [name]: value,
                classId:"",
            }));
            fetchDisciplineInternalGrades({ [name]: value });
            if(!value){
                dispatch(resetBrchClassAct(undefined))
            }
            else {
                getClassApiCall({ curriculumId: value, academicYearId: internalSubjectGradeForm.values.academicYearId });
            }
        }
        else if(name === 'classId'){
            internalSubjectGradeForm.setValues((prev: any) => ({
                ...prev,
                [name]: value,
            }));
            getClassApiCall({ classId: value});
            fetchDisciplineInternalGrades({ [name]: value });
        } 
            
        else if (name === "searchString") {
          internalSubjectGradeForm.setValues((prev: any) => ({
            ...prev,
            [name]: value,
          }));
          fetchDisciplineInternalGrades({ [name]: value });
        }
    };

    

    const internalSubjectGradesCol = useMemo(() => generateInternalSubjectGradesColumns(menuOptions), []);
    const { data: cbseExaminationResp, totalElements, totalPages, pageable } = getCbseInternalSubjectsGradesListResp || {};
    const { data: academicYearList } = academicYearListResp || {};
    const { data: curriculumTypes } = brchCurriculumResp || {};
    const { content: classTypes } = branchClassResp || {};
    return (
        <>
            <div className="page-content free_payment_record_wrapper">
                <div className="container-fluid">
                    <BreadCrumb title="Examination" pageTitle="Examination" />
                    <div className="card">
                        <div className="card-header">
                            <div className="row align-items-center">
                                <div className="col-6">
                                    <h4 className="card-title mb-0 flex-grow-1">Internal Subject Grades</h4>
                                </div>
                            </div>
                        </div>
                        <div className="card-body p-0">
                            <div className="row p-3 g-3">
                                <div className="col-xs-12 col-md-12 col-lg-4 col-xl-3">
                                    <div className="search-box">
                                        <TextInput
                                            name="searchString"
                                            formgroupClassName="mb-0"
                                            labelText='Search'
                                            placeHolder="Search"
                                            value={internalSubjectGradeForm.values.searchString}
                                            onChange={onChangeFilterHndlr}
                                            floatingLabel
                                            
                                        />
                                        <i className="ri-search-line search-icon"></i>
                                    </div>
                                </div>
                                <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                                    <SelectInput
                                        name="academicYearId"
                                        value={internalSubjectGradeForm.values.academicYearId}
                                        onChange={onChangeFilterHndlr}
                                        menuItems={academicYearList}
                                        valueKey="academicYearId"
                                        textKey="academicYearName"
                                        formgroupClassName="mb-0"
                                        labelText='Academic Year'
                                        floatingLabel
                                        
                                    />
                                </div>
                                <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                                    <SelectInput
                                        name="curriculumId"
                                        value={internalSubjectGradeForm.values.curriculumId}
                                        onChange={onChangeFilterHndlr}
                                        menuItems={curriculumTypes}
                                        valueKey="branchCurriculumId"
                                        textKey="curriculumName"
                                        formgroupClassName="mb-0"
                                        labelText='Curriculum'
                                        floatingLabel
                                        
                                    />
                                </div>
                                <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                                    <SelectInput
                                        name="classId"
                                        value={internalSubjectGradeForm.values.classId}
                                        onChange={onChangeFilterHndlr}
                                        menuItems={classTypes}
                                        valueKey="id"
                                        textKey="shortName"
                                        formgroupClassName="mb-0"
                                        labelText='Class'
                                        floatingLabel
                                        
                                    />
                                </div>
                                
                                <div className="col-auto ms-auto">
                                    <button
                                        className="btn btn-success float-end d-flex align-items-center"
                                        onClick={() => openInternalSubjectGradesGradeUploadModal()}
                                    >
                                        <i className="ri-add-line me-2" />
                                        Add New
                                    </button>
                                </div>
                            </div>

                            <TableContainer
                                columns={internalSubjectGradesCol}
                                data={Array.isArray(getCbseInternalSubjectsGradesListResp?.data) ? getCbseInternalSubjectsGradesListResp?.data : []}
                                tableClass="mb-0"
                                divClass="table-responsive mb-3"
                                theadClass="table-light text-muted align-middle"
                                showCheckbox={false}
                                showPagination={true}
                                totalPages={totalPages || 0}
                                totalRecords={totalElements || 0}
                                callbackPaginationHndlr={paginationHndlr}
                                currentPageNumber={pageable?.pageNumber || 0}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <ModalContainerUpdated
                id="add-examination"
                isOpen={cbseInternalSubjectGradesUploadState.showModal}
                toggle={closeInternalSubjectGradesGradeUploadModal}
                modalTitle={cbseInternalSubjectGradesUploadState.modalData ? "Edit Internal Subject Grades Details" : "Create Details"}
                modalSize="md"
            >
                <AddInternalSubjectGradesModal
                    modalData={internalSubjectGradeForm.values}
                    id={cbseInternalSubjectGradesUploadState.modalData}
                    isOpen={false}
                    toggle={closeInternalSubjectGradesGradeUploadModal}
                    modalTitle="Create Detail"
                />
            </ModalContainerUpdated>
            <ConfirmationModal
                id="delete-examination-modal"
                isOpen={deleteInternalSubjectGradesGradeState.showModal}
                confirmMessage="Are you sure you want to delete this Internal Subject Grades ?"
                cancelHndlr={closeDelInternalSubjectGradesGradeModal}
                confirmHndlr={delModalSubmitHndlr}
                showImgIcon={true}
                isDisble={showApiLoader}
                iconType="reject"
            />
        </>
    );
};

export default DisciplineInternalSubjectGrades;
