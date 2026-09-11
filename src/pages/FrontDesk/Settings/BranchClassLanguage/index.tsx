import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ConfirmationModal, ModalContainerUpdated, OffCanvasContainer, SelectInput, TextInput } from "../../../../Components/Common";
import Button from "../../../../Components/Common/Button";
import TableContainer from "../../../../Components/Common/TableContainer";
import { generateColumns, ignoredKeys } from "./helper";
import { default as EditSvg } from "../../../../assets/imagesdps/academics/EditSvg.svg?react";
import { default as DeleteIconSvg } from "../../../../assets/imagesdps/academics/DeleteIconSvg.svg?react";
import { useFormik } from "formik";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import { useModal } from "../../../../hooks/modalhook";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { getBranchClassAct, getBranchCurriculumAct, resetBrchClassAct } from "../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { toast } from "react-toastify";
import { IPaginationState } from "../../../../Components/Common/Pagination";
import { debounce } from "../../../../utility/commonutility";
import { default as FilterSvg } from "../../../../assets/imagesdps/academics/FilterSvg.svg?react";
import { useFilterState } from "../../../../hooks/filterhook";
import AdvanceFilterModal from "./AdvancedFilterModal";
import { getClassSubjectsList } from "../../../../store/academic/classSubjects/classsubjectsactions";
import * as Yup from "yup"
import { deleteBranchClassLanguageAct, getBranchClassLanguageAct } from "../../../../store/FrontDesk/AdmissionSettings/admissionsettingaction";
import { getAcademicLanguagesDataAct } from "../../../../store/mastersettings/instituteinfo/instituteinfoactions";
import AddBranchClassLanguageModel from "./AddBranchClassLanguageModel";
 
 
const initialValues = {
    searchString: "",
    academicYearId: "",
    curriculumId: "",
    classId: "",
    subjectId: "",
    languageId: "",
};
 
const validationSchema = Yup.object().shape({
    academicYearId: Yup.string().required("Academic Year is required."),
    curriculumId: Yup.string().required("Curriculum is required."),
    classId: Yup.string().required("Class is required.").nullable(),
});
 
const BranchClassLanguage = () => {
    const { closeModal: closeBranchClassLanguageUploadModalModal, modalState: branchClassLanguageUploadModalState, openModal: branchClassLanguageUploadModal } = useModal();
    const { closeModal: closeBranchClassLanguageModal, modalState: branchClassLanguageModalState, openModal: openBranchClassLanguageModal } = useModal();
    const { showClearFilterState, advanceFilterChange, count } = useFilterState();
    const [open, setOpen] = useState<boolean>(false);
 
    const dispatch = useAppDispatch();
    const pagination = useRef({
        pageNo: 0,
        pageSize: 10
    })
 
 
    const {
        academicYearListResp,
        brchCurriculumResp,
        branchClassResp,
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        showApiLoader,
        cbseExaminationErrorAct,
        getSubjectListResp,
        getAoMappingSubjectResp,
        saveBranchClassLanguageResp,
        deleteBranchClassLanguageResp,
        updateBranchClassLanguageResp,
        getBranchClassLanguageResp,
        admissionSettingErrorResp
 
    } = useAppSelector(
        ({ globalData, instAcademics, branchAcademics, appData, examinationSettings, admissionSettingRequest }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            branchClassResp: branchAcademics.branchClassResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            showApiLoader: globalData.showApiLoader,
            cbseExaminationErrorAct: examinationSettings.cbseExaminationErrorAct,
            getSubjectListResp: examinationSettings.getSubjectListResp,
            getAoMappingSubjectResp: examinationSettings.getAoMappingSubjectResp,
            saveBranchClassLanguageResp: admissionSettingRequest.saveBranchClassLanguageResp,
            deleteBranchClassLanguageResp: admissionSettingRequest.deleteBranchClassLanguageResp,
            updateBranchClassLanguageResp: admissionSettingRequest.updateBranchClassLanguageResp,
            getBranchClassLanguageResp: admissionSettingRequest.getBranchClassLanguageResp,
            admissionSettingErrorResp: admissionSettingRequest.admissionSettingErrorResp
 
        }),
        shallowEqual
    );
 
    const branchClassLanguageRef = useRef({
        prevCbseExaminationErrorAct: cbseExaminationErrorAct,
        prevSaveBranchClassLanguageResp: saveBranchClassLanguageResp,
        prevDeleteBranchClassLanguageResp: deleteBranchClassLanguageResp,
        prevUpdateBranchClassLanguageResp: updateBranchClassLanguageResp,
        prevAdmissionSettingErrorResp: admissionSettingErrorResp
    })
 
    useEffect(() => {
        const { prevCbseExaminationErrorAct, prevSaveBranchClassLanguageResp, prevDeleteBranchClassLanguageResp, prevUpdateBranchClassLanguageResp, prevAdmissionSettingErrorResp } = branchClassLanguageRef.current || {}
 
        if (cbseExaminationErrorAct && prevCbseExaminationErrorAct !== cbseExaminationErrorAct) {
            const { details } = cbseExaminationErrorAct || {}
            toast.error(details || "Something went wrong")
        }
        else if (admissionSettingErrorResp && prevAdmissionSettingErrorResp !== admissionSettingErrorResp) {
            const { details } = admissionSettingErrorResp || {}
            toast.error(details || "Something went wrong")
        }
        else if (saveBranchClassLanguageResp && prevSaveBranchClassLanguageResp !== saveBranchClassLanguageResp) {
            toast.success("Branch Class Language Added successfully")
            getBranchClassLanguageApiCall();
            closeBranchClassLanguageUploadModalModal();
        }
        else if (deleteBranchClassLanguageResp && prevDeleteBranchClassLanguageResp !== deleteBranchClassLanguageResp) {
            toast.success("Branch Class Language Deleted successfully")
            getBranchClassLanguageApiCall();
            closeBranchClassLanguageModal();
        }
        else if (updateBranchClassLanguageResp && prevUpdateBranchClassLanguageResp !== updateBranchClassLanguageResp) {
            toast.success("Branch Class Language Updated successfully")
            getBranchClassLanguageApiCall();
            closeBranchClassLanguageUploadModalModal();
        }
        branchClassLanguageRef.current.prevCbseExaminationErrorAct = cbseExaminationErrorAct;
        branchClassLanguageRef.current.prevSaveBranchClassLanguageResp = saveBranchClassLanguageResp;
        branchClassLanguageRef.current.prevDeleteBranchClassLanguageResp = deleteBranchClassLanguageResp;
        branchClassLanguageRef.current.prevUpdateBranchClassLanguageResp = updateBranchClassLanguageResp;
        branchClassLanguageRef.current.prevAdmissionSettingErrorResp = admissionSettingErrorResp;
    }, [cbseExaminationErrorAct, saveBranchClassLanguageResp, deleteBranchClassLanguageResp, updateBranchClassLanguageResp, admissionSettingErrorResp])
 
 
    const branchClassLanguageForm = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values) => { },
    });
 
 
    function editScheduleTaskModalHndlr(event: React.MouseEvent<HTMLElement>) {
        const id = event.currentTarget.getAttribute("data-id");
        branchClassLanguageUploadModal(id);
    }
 
    const menuOptions = useMemo(
        () => [
            {
                id: "edit",
                actionIcon: <EditSvg color="#405189" />,
                actionName: "Edit",
                onClickHndlr: editScheduleTaskModalHndlr,
            },
            {
                id: "delete",
                actionIcon: <DeleteIconSvg className="me-2" fill="#f06548" />,
                actionName: "Delete",
                onClickHndlr: (event: any) => {
                    const id = event.currentTarget.getAttribute("data-id");
                    openBranchClassLanguageModal(id)
                },
            },
        ],
        []
    );
 
    const getBranchClassLanguageApiCall = (otherProps?: any) => {
        const payload = {
            branchId,
            academicYearId: branchClassLanguageForm.values.academicYearId,
            curriculumId: branchClassLanguageForm.values.curriculumId,
            classId: branchClassLanguageForm.values.classId,
            searchString: branchClassLanguageForm.values.searchString,
            subjectId: branchClassLanguageForm.values.subjectId,
            languageId: branchClassLanguageForm.values.languageId,
            ...pagination.current,
            ...otherProps,
        }
        dispatch(getBranchClassLanguageAct(generateActionPayload("get_branch_class_language", undefined, payload)));
    }
 
    function delModalSubmitHndlr() {
        dispatch(deleteBranchClassLanguageAct(generateActionPayload("delete_branch_class_language", { id: branchClassLanguageModalState.modalData })));
    }
 
    useEffect(() => {
        let yearId = academicYearListResp?.data.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId;
        if (yearId) {
            branchClassLanguageForm.setFieldValue("academicYearId", yearId);
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
        const { data } = brchCurriculumResp || {};
 
        if (Array.isArray(data) && data.length > 0 && branchClassLanguageForm.values.academicYearId) {
 
            const selectedCurriculum = data[0];
            if (selectedCurriculum) {
                const branchCurriculumId = selectedCurriculum.branchCurriculumId;
                const payload = {
                    branchId,
                    curriculumId: branchCurriculumId,
                    academicYearId: branchClassLanguageForm.values.academicYearId,
                    sortBy: "classSequence",
                    orderBy: "asc",
                    pageNo: 0,
                    pageSize: 100,
                };
                dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
                branchClassLanguageForm.setFieldValue("curriculumId", branchCurriculumId);
                getSubjectListApiCall({ curriculumId: branchCurriculumId });
            }
        }
    }, [brchCurriculumResp, branchClassLanguageForm.values.academicYearId]);
 
    useEffect(() => {
        const { content } = branchClassResp || {};
        if (Array.isArray(content) && content.length > 0) {
            branchClassLanguageForm.setFieldValue("classId", content[0].id);
            // getBranchClassLanguageApiCall({ classId: content[0].id });
        }
    }, [branchClassResp])
   
    useEffect(() => {
        const { academicYearId, curriculumId, classId } = branchClassLanguageForm.values;
        if (academicYearId && curriculumId && classId) {
            getBranchClassLanguageApiCall();
        }
    }, [
        branchClassLanguageForm.values.academicYearId,
        branchClassLanguageForm.values.curriculumId,
        branchClassLanguageForm.values.classId
    ]);
 
    useEffect(() => {
        getMasterLanguageApiCall();
    }, [instituteId])
 
    const getSubjectListApiCall = (otherProps?: any) => {
        let payload = { branchId: branchId, curriculumId: branchClassLanguageForm.values.curriculumId, languageTypes: "FIRST,SECOND,THIRD", pageNo: 0, pageSize: 100, sortBy: "subjectName", ...otherProps }
        dispatch(
            getClassSubjectsList(
                generateActionPayload("get_class_subject_list", undefined, payload)
            )
        );
    }
 
    const getMasterLanguageApiCall = () => {
        const payload = {
            instituteId, pageNo: 0, pageSize: 100, sortBy: "languageName", orderBy: "asc"
        }
        dispatch(
            getAcademicLanguagesDataAct(
                generateActionPayload("get_academic_language_data", undefined, payload)
            )
        );
    }
 
    function getClassApiCall(curriculumId: string,) {
        const payload = {
            curriculumId,
            branchId,
            pageNo: 0,
            pageSize: 100,
            sortBy: "classSequence",
            orderBy: "asc",
        };
        dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
    }
 
    function paginationHndlr(paginationInfo: IPaginationState) {
        pagination.current = paginationInfo;
        getBranchClassLanguageApiCall(paginationInfo);
    }
 
    function search(value: string) {
        getBranchClassLanguageApiCall({ ...branchClassLanguageForm.values, searchString: value });
    }
    const toggleAdvanceFilter = () => {
        setOpen(prev => !prev);
    }
    function advanceFilterCallbckHndlr(appliedFilters?: any) {
        pagination.current = { ...pagination.current, pageNo: 0 }
        advanceFilterChange({ keys: { ...initialValues, ...appliedFilters, academicYearId: "" }, ignoredKeys })
        branchClassLanguageForm.setValues((prevState: any) => ({ ...prevState, ...appliedFilters }));
        getBranchClassLanguageApiCall(appliedFilters)
    }
 
    function clearFilterHndlr() {
        pagination.current.pageNo = 0;
        const { academicYearId } = academicYearListResp?.data?.find((year: any) => year.yearStatus.toLowerCase() === "current") || {};
        const curriculumId = branchClassLanguageForm.values.curriculumId;
        const classId = branchClassLanguageForm.values.classId;
        branchClassLanguageForm.setValues({ ...initialValues, academicYearId: academicYearId || "", curriculumId: curriculumId || "", classId: classId || "" });
        getBranchClassLanguageApiCall({ ...initialValues, academicYearId, curriculumId, classId });
        advanceFilterChange({ keys: { ...initialValues }, ignoredKeys: [] });
    }
 
    const debounceFun = useCallback(debounce(search, 200), [getAoMappingSubjectResp]);
 
    const filterHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        pagination.current.pageNo = 0;
        if (name === "searchString") {
            branchClassLanguageForm.setValues((prev: any) => ({ ...prev, [name]: value }))
            debounceFun(value);
        }
        else if (name === "curriculumId") {
            branchClassLanguageForm.setValues((prev: any) => ({ ...prev, [name]: value }));
 
            if (!value) {
                dispatch(resetBrchClassAct(undefined));
            } else {
                getClassApiCall(value);
                getSubjectListApiCall({ curriculumId: value });
            }
        } else if (name === 'classId') {
            branchClassLanguageForm.setValues((prev: any) => ({ ...prev, [name]: value, subjectId: "" }));
            // getBranchClassLanguageApiCall({ classId: value, subjectId: "" });
        } else {
            branchClassLanguageForm.setValues((prev: any) => ({ ...prev, [name]: value }))
            // getBranchClassLanguageApiCall({ [name]: value });
        }
    }
 
    const columns = useMemo(() => generateColumns(menuOptions), []);
 
    const { data: curriculumTypes } = brchCurriculumResp || {}
    const { content: classTypes } = branchClassResp || {};
    const { content: branchClassLanguage, totalElements, totalPages, pageable } = getBranchClassLanguageResp || {}
    const { data: academicYearList } = academicYearListResp || {};
 
    return (
        <>
            <div className="page-content free_payment_record_wrapper">
                <div className="container-fluid">
                    <BreadCrumb title="Admission" pageTitle="Admission" />
 
                    <div className="tw-bg-white tw-border tw-border-gray-200 tw-rounded-lg tw-shadow-sm">
                        <div className="tw-p-4 tw-border-b tw-border-gray-200">
                            <div className="tw-flex tw-items-center tw-justify-between">
                                <div className="tw-w-1/2">
                                    <h4 className="tw-text-base tw-font-semibold tw-mb-0 tw-grow">Branch Class Language</h4>
                                </div>
                            </div>
                        </div>
                        <div className="tw-p-0">
                            <div className="tw-flex tw-flex-wrap tw-bg-gray-50 tw-m-4 tw-p-4 tw-rounded-lg tw-gap-4 tw-items-end">
                                <div className="tw-w-full md:tw-w-full lg:tw-w-1/4 xl:tw-w-1/4">
                                    <div className="search-box">
                                        <TextInput
                                            name="searchString"
                                            formgroupClassName="tw-mb-0"
                                            placeHolder="Search"
                                            labelText="Search"
                                            floatingLabel
                                            inputClassName="tw-bg-gray-50"
                                            value={branchClassLanguageForm.values.searchString}
                                            onChange={filterHandler}
                                        />
                                        <i className="ri-search-line search-icon"></i>
                                    </div>
                                </div>
                                <div className="tw-w-full md:tw-w-full lg:tw-w-1/4 xl:tw-w-1/6">
                                    <SelectInput
                                        name="academicYearId"
                                        value={branchClassLanguageForm.values.academicYearId}
                                        onChange={filterHandler}
                                        menuItems={academicYearList || []}
                                        valueKey="academicYearId"
                                        textKey="academicYearName"
                                        formgroupClassName="tw-mb-0"
                                        labelText="Academic Year"
                                        floatingLabel
                                        inputClassName="tw-bg-gray-50"
                                        labelClass="required"
                                        invalid={(branchClassLanguageForm.touched.academicYearId && branchClassLanguageForm.errors.academicYearId) ? true : false}
                                        error={(branchClassLanguageForm.touched.academicYearId && branchClassLanguageForm.errors.academicYearId) ? branchClassLanguageForm.errors.academicYearId : ""}
                                    />
                                </div>
                                <div className="tw-w-full md:tw-w-full lg:tw-w-1/4 xl:tw-w-1/6">
                                    <SelectInput
                                        name="curriculumId"
                                        value={branchClassLanguageForm.values.curriculumId}
                                        onChange={filterHandler}
                                        menuItems={curriculumTypes}
                                        valueKey="branchCurriculumId"
                                        textKey="curriculumName"
                                        labelText="Curriculum"
                                        labelClass="required"
                                        formgroupClassName="tw-mb-0"
                                        floatingLabel
                                        inputClassName="tw-bg-gray-50"
                                        invalid={(branchClassLanguageForm.touched.curriculumId && branchClassLanguageForm.errors.curriculumId) ? true : false}
                                        error={(branchClassLanguageForm.touched.curriculumId && branchClassLanguageForm.errors.curriculumId) ? branchClassLanguageForm.errors.curriculumId : ""}
                                    />
                                </div>
                                <div className="tw-w-full md:tw-w-full lg:tw-w-1/4 xl:tw-w-1/6">
                                    <SelectInput
                                        name="classId"
                                        value={branchClassLanguageForm.values.classId}
                                        onChange={filterHandler}
                                        menuItems={classTypes}
                                        valueKey="id"
                                        textKey="shortName"
                                        labelText="Class"
                                        formgroupClassName="tw-mb-0"
                                        labelClass="required"
                                        floatingLabel
                                        inputClassName="tw-bg-gray-50"
                                        invalid={(branchClassLanguageForm.touched.classId && branchClassLanguageForm.errors.classId) ? true : false}
                                        error={(branchClassLanguageForm.touched.classId && branchClassLanguageForm.errors.classId) ? branchClassLanguageForm.errors.classId : ""}
                                    />
                                </div>
 
                                <div className="tw-w-auto tw-relative tw-mb-2">
                                    <div
                                        
                                        onClick={toggleAdvanceFilter}
                                        className="tw-flex tw-items-center tw-bg-[#F4F7FA] tw-cursor-pointer tw-border-gray-300"
                                    >
                                        <FilterSvg height={"18px"} width={"18px"} />
                                        <span className='tw-ml-2'>Filters</span>
                                    </div>
                                    {count !== null && count > 0 && (
                                        <span className="tw-absolute tw--top-2 tw--right-2 tw-bg-emerald-500 tw-text-white tw-text-[10px] tw-font-bold tw-px-1.5 tw-py-0.5 tw-rounded-full tw-min-w-[18px] tw-text-center">
                                            {count}
                                        </span>
                                    )}
                                </div>
 
                                {showClearFilterState && (
                                    <div className="tw-w-auto tw-flex tw-items-center">
                                        <Button 
                                            variant="wrong" 
                                            onClick={clearFilterHndlr}
                                        >
                                            Clear filter
                                        </Button>
                                    </div>
                                )}
 
                                <div className="tw-w-auto tw-ml-auto">
                                    <Button
                                        variant="primary"
                                        onClick={() => branchClassLanguageUploadModal()}
                                    >
                                        <i className="ri-add-line tw-mr-2" />
                                        Add New
                                    </Button>
                                </div>
                            </div>
 
                            <TableContainer
                                columns={columns || []}
                                data={branchClassLanguage || []}
                                tableClass="tw-mb-0"
                                divClass="table-responsive tw-mb-4"
                                theadClass="tw-bg-gray-100 tw-text-gray-500 tw-font-medium"
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
                isOpen={branchClassLanguageUploadModalState.showModal}
                toggle={() => closeBranchClassLanguageUploadModalModal()}
                modalTitle={branchClassLanguageUploadModalState.modalData ? "Edit Branch Class Language" : "Add Branch Class Language"}
                modalSize="md"
            >
                <AddBranchClassLanguageModel
                    id={branchClassLanguageUploadModalState.modalData}
                    isOpen={false}
                    toggle={() => closeBranchClassLanguageUploadModalModal()}
                    modalTitle="Create Detail"
                    modalData={branchClassLanguageForm.values}
                    modalData1={branchClassLanguageUploadModalState.modalData}
                />
            </ModalContainerUpdated>
 
            <ConfirmationModal
                id="delete-examination-ao-mapping"
                isOpen={branchClassLanguageModalState.showModal}
                confirmMessage="Are you sure you want to delete this Branch Class Language?"
                cancelHndlr={closeBranchClassLanguageModal}
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
                    appliedFilter={branchClassLanguageForm.values}
                    applyFilterCallback={advanceFilterCallbckHndlr}
                    toggleAdvanceFilter={toggleAdvanceFilter}
                    isOpen={open}
                    branchId={branchId}
                />
            </OffCanvasContainer>
        </>
    );
};
 
export default BranchClassLanguage;
 
 