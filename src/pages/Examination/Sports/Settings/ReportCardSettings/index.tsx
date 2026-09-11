import React, { useEffect, useMemo, useRef } from "react";
import { ConfirmationModal, ModalContainerUpdated, SelectInput, TextInput } from '../../../../../Components/Common';
import TableContainer from '../../../../../Components/Common/TableContainer';
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
import { useFilterState } from "../../../../../hooks/filterhook";
import { useModal } from "../../../../../hooks/modalhook";
import { deleteCbseInternalSubjectsGradesAct, deleteReportCardSettingsAct, getCbseInternalSubjectsGradesByIdAct, getCbseInternalSubjectsGradesListAct, getReportCardSettingsAct, } from "../../../../../store/examination/examinationsettings/examinationsettingsaction";
import { generateActionPayload } from "../../../../../utility/reduxutility";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import { getBranchClassAct, getBranchCurriculumAct, resetBrchClassAct } from "../../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { IPaginationState } from "../../../../../Components/Common/Pagination";
import BreadCrumb from "../../../../../Components/Common/BreadCrumb";
import { useFormik } from "formik";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02StrokeStandard, PencilEdit02Icon } from "@hugeicons-pro/core-stroke-standard";
import AddReportCardSettings from "./AddReportCardSettings";
import {
    generateReportCardSettingsColumns, ignoredKeys,
    progressCardTypes
} from "./helper";

const initialValues = {
    searchString: "",
    academicYearId: "",
    curriculumId: "",
    classId: "",
    progressCardType: "SPORTS",
};

const ReportCardSettings = () => {
    const dispatch = useAppDispatch();
    const { closeModal: closeReportCardSettingModalHndlr, modalState: deleteReportCardModal, openModal: openDeleteReportCardModalHandler } = useModal();
    const { closeModal: closeSettingsModalHandler, modalState: reportCardSettingModal, openModal: openSettingsModalData } = useModal();

    const paginationRef = useRef({
        pageNo: 0,
        pageSize: 10
    })

    const reportCardSettingsApiCall = (otherProps?: any) => {
        const payload = {
            instituteId,
            branchId,
            ...reportCardSettingsForm.values,
            ...paginationRef.current,
            ...otherProps,
        };
        dispatch(getReportCardSettingsAct(generateActionPayload("get_report_card_settings", undefined, payload)));
    };

    const getCurriculumApiCall = (otherProps?: any) => {
        const payload1 = { academicYearId: reportCardSettingsForm.values.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", ...otherProps };
        dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
    }

    function delModalSubmitHndlr() {
        dispatch(deleteReportCardSettingsAct(generateActionPayload("delete_report_card_settings", { id: deleteReportCardModal.modalData })));
    }

    const reportCardSettingsForm = useFormik({
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
        getReportCardSettingsResp,
        deleteReportCardSettingsResp,
        cbseExaminationErrorAct
    } = useAppSelector(
        ({ instAcademics, branchAcademics, examinationSettings, appData, globalData, }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            showApiLoader: globalData.showApiLoader,
            currentInstIdResp: appData.currentInstIdResp,
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            branchClassResp: branchAcademics.branchClassResp,
            getReportCardSettingsResp: examinationSettings.getReportCardSettingsResp,
            deleteReportCardSettingsResp: examinationSettings.deleteReportCardSettingsResp,
            cbseExaminationErrorAct: examinationSettings.cbseExaminationErrorAct,
        }),
        shallowEqual
    );

    const cbseInternalSubjectGradesRef = useRef({
        prevBranchClassResp: branchClassResp,
        prevDeleteReportCardSettingsResp: deleteReportCardSettingsResp,
        prevCbseExaminationErrorResp: cbseExaminationErrorAct,
    })

    useEffect(() => {
        const { prevBranchClassResp,
            prevDeleteReportCardSettingsResp, prevCbseExaminationErrorResp } = cbseInternalSubjectGradesRef.current;
        // if (branchClassResp && prevBranchClassResp !== branchClassResp) {
        //     const { content } = branchClassResp || {};
        //     if (Array.isArray(content) && !!content.length) {
        //         const { id } = content[0];
        //         reportCardSettingsForm.setValues((prev: any) => ({
        //             ...prev,
        //             classId: id,
        //         }));
        //         reportCardSettingsApiCall({ classId: id });
        //     }
        // }
        // else
        if (deleteReportCardSettingsResp && prevDeleteReportCardSettingsResp !== deleteReportCardSettingsResp) {
            toast.success("Report card settings deleted successfully.");
            closeReportCardSettingModalHndlr();
            reportCardSettingsApiCall()
        }
        else if (cbseExaminationErrorAct && prevCbseExaminationErrorResp !== cbseExaminationErrorAct) {
            const { details } = cbseExaminationErrorAct || {};
            toast.error(details || "Something went wrong.");
        }
        cbseInternalSubjectGradesRef.current.prevBranchClassResp = branchClassResp;
        cbseInternalSubjectGradesRef.current.prevDeleteReportCardSettingsResp = deleteReportCardSettingsResp;
        cbseInternalSubjectGradesRef.current.prevCbseExaminationErrorResp = cbseExaminationErrorAct;
    }, [branchClassResp, deleteReportCardSettingsResp, cbseExaminationErrorAct]);

    useEffect(() => {
        const yearId = academicYearListResp?.data.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId;
        if (yearId) {
            reportCardSettingsForm.setValues((prev: any) => ({ ...prev, academicYearId: yearId }));
            getCurriculumApiCall({ academicYearId: yearId });
        }
    }, [academicYearListResp]);

    useEffect(() => {
        const { data } = brchCurriculumResp || {};
        if (Array.isArray(data) && data.length > 0 && reportCardSettingsForm.values.academicYearId) {
            const selectedCurriculum = data.find((item: { instituteCurriculumId: number }) => item.instituteCurriculumId === 1) || data[0];
            if (!selectedCurriculum) {
                reportCardSettingsForm.setValues((prev: any) => ({
                    ...prev,
                    curriculumId: undefined,
                }));
                return;
            }
            getClassApiCall({ curriculumId: selectedCurriculum.branchCurriculumId });
            reportCardSettingsApiCall({ curriculumId: selectedCurriculum.branchCurriculumId });
            reportCardSettingsForm.setValues((prev: any) => ({
                ...prev,
                curriculumId: selectedCurriculum.branchCurriculumId,
            }));
        }
    }, [brchCurriculumResp, reportCardSettingsForm.values.academicYearId]);

    function getClassApiCall(otherProps?: any) {
        const { academicYearId, curriculumId } = reportCardSettingsForm.values || {};
        const payload = {
            academicYearId,
            curriculumId,
            branchId,
            pageNo: 0,
            pageSize: 100,
            sortBy: "classSequence",
            orderBy: "asc",
            ...otherProps,
        };
        dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
    }
    const onChangeFilterHndlr = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        paginationRef.current.pageNo = 0;

        reportCardSettingsForm.setValues((prev: any) => {
            const updatedState = { ...prev, [name]: value };

            if (name === "academicYearId") {
                getCurriculumApiCall({ academicYearId: value });
                updatedState.classId = "";
                reportCardSettingsApiCall({ ...updatedState, classId: "" });
            } else if (name === "curriculumId") {
                if (!value) {
                    dispatch(resetBrchClassAct(undefined))
                }
                else {
                    getClassApiCall({ curriculumId: value });
                }
                updatedState.classId = "";
                reportCardSettingsApiCall({ ...updatedState, classId: "" });
            } else {
                reportCardSettingsApiCall(updatedState);
            }
            return updatedState;
        });
    };

    function closeReportCardSettingModal(apiCall: boolean) {
        if (typeof (apiCall) === 'boolean' && apiCall) {
            reportCardSettingsApiCall();
        }
        closeSettingsModalHandler();
    }

    const menuOptions = useMemo(
        () => [
            {
                id: "edit",
                actionIcon: <HugeiconsIcon icon={PencilEdit02Icon} className=" text-muted" size={20} />,
                actionName: "Edit",
                onClickHndlr: (event: any) => {
                    const id = event.currentTarget.getAttribute("data-id");
                    const { data: reportCardTableData } = getReportCardSettingsResp;
                    const rowData = reportCardTableData.find((item: any) => item.id === +id);
                    if (!id || !rowData) {
                        return;
                    }
                    openSettingsModalData({
                        id: rowData.id,
                        academicYearId: rowData.academicYearId ?? '',
                        curriculumId: rowData.branchCurriculumId ?? '',
                        classId: rowData.branchClassId ?? '',
                        progressCardType: rowData.progressCardType ?? '',
                    });
                },
            },
            {
                id: "delete",
                actionIcon: <HugeiconsIcon icon={Delete02StrokeStandard} className="text-danger" size={18} />,
                actionName: "Delete",
                onClickHndlr: (event: any) => {
                    const id = event.currentTarget.getAttribute("data-id");
                    openDeleteReportCardModalHandler(id)
                },
            },
        ],
        [getReportCardSettingsResp]
    );

    function addNewSettingModalHandler() {
        openSettingsModalData({
            academicYearId: reportCardSettingsForm.values.academicYearId ?? '',
            curriculumId: reportCardSettingsForm.values.curriculumId ?? '',
            classId: reportCardSettingsForm.values.classId ?? '',
            progressCardType: reportCardSettingsForm.values.progressCardType ?? '',
        });
    }

    function paginationHndlr(paginationInfo: any) {
        paginationRef.current = paginationInfo;
        reportCardSettingsApiCall();
    }
    const reportCardColumns = useMemo(() =>
        generateReportCardSettingsColumns(menuOptions), [getReportCardSettingsResp]);
    const { data: academicYearList } = academicYearListResp || {};
    const { data: curriculumTypes } = brchCurriculumResp || {};
    const { content: classTypes } = branchClassResp || {};
    const { data: tableData, totalElements, totalPages, pageable } = getReportCardSettingsResp || {};
    return (
        <>
            <div className="page-content free_payment_record_wrapper">
                <div className="container-fluid">
                    <BreadCrumb title="Examination" pageTitle="Examination" />
                    <div className="card">
                        <div className="card-header">
                            <div className="row align-items-center">
                                <div className="col-6">
                                    <h4 className="card-title mb-0 flex-grow-1">Report Card Settings</h4>
                                </div>
                            </div>
                        </div>
                        <div className="card-body p-0">
                            <div className="row bg-light m-3 pb-3 px-2 g-3 examination">
                                {/* <div className="col-xs-12 col-md-12 col-lg-4 col-xl-3">
                                    <div className="search-box">
                                        <TextInput
                                            name="searchString"
                                            formgroupClassName="mb-0"
                                            labelText='Search'
                                            placeHolder="Search"
                                            value={reportCardSettingsForm.values.searchString}
                                            onChange={onChangeFilterHndlr}
                                            floatingLabel
                                            inputClassName="bg-light"
                                        />
                                        <i className="ri-search-line search-icon"></i>
                                    </div>
                                </div> */}
                                <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                                    <SelectInput
                                        name="academicYearId"
                                        value={reportCardSettingsForm.values.academicYearId}
                                        onChange={onChangeFilterHndlr}
                                        menuItems={academicYearList}
                                        valueKey="academicYearId"
                                        textKey="academicYearName"
                                        formgroupClassName="mb-0"
                                        labelText='Academic Year'
                                        floatingLabel
                                        labelClass="required"
                                        inputClassName="bg-light"
                                    />
                                </div>
                                <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                                    <SelectInput
                                        name="curriculumId"
                                        value={reportCardSettingsForm.values.curriculumId}
                                        onChange={onChangeFilterHndlr}
                                        menuItems={curriculumTypes}
                                        valueKey="branchCurriculumId"
                                        textKey="curriculumName"
                                        formgroupClassName="mb-0"
                                        labelText='Curriculum'
                                        floatingLabel
                                        labelClass="required"
                                        inputClassName="bg-light"
                                    />
                                </div>
                                <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                                    <SelectInput
                                        name="classId"
                                        value={reportCardSettingsForm.values.classId}
                                        onChange={onChangeFilterHndlr}
                                        menuItems={classTypes}
                                        valueKey="id"
                                        textKey="shortName"
                                        formgroupClassName="mb-0"
                                        labelText='Class'
                                        floatingLabel
                                        inputClassName="bg-light"
                                    />
                                </div>
                                <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                                    <SelectInput
                                        name="progressCardType"
                                        value={reportCardSettingsForm.values.progressCardType}
                                        onChange={onChangeFilterHndlr}
                                        menuItems={progressCardTypes}
                                        hideSelectOption
                                        valueKey="id"
                                        textKey="name"
                                        formgroupClassName="mb-0"
                                        labelText='Progress Card Type'
                                        floatingLabel
                                        inputClassName="bg-light"
                                    />
                                </div>
                                <div className="col-auto ms-auto">
                                    <button
                                        className="btn btn-success float-end d-flex align-items-center"
                                        onClick={addNewSettingModalHandler}
                                    >
                                        <i className="ri-add-line me-2" />
                                        Add New
                                    </button>
                                </div>
                            </div>
                            <TableContainer
                                columns={reportCardColumns}
                                data={Array.isArray(tableData) ? tableData : []}
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
                id="addreportcardsettings"
                isOpen={reportCardSettingModal.showModal}
                toggle={closeSettingsModalHandler}
                modalTitle={reportCardSettingModal.modalData?.id ? "Edit Report Card Settings" : "Create Report Card Settings"}
                modalSize="xl"
            >
                <AddReportCardSettings
                    modalData={reportCardSettingModal.modalData}
                    isOpen={false}
                    instituteId={instituteId}
                    branchId={branchId}
                    toggle={closeReportCardSettingModal}
                    modalTitle="Create Detail"
                />
            </ModalContainerUpdated>
            <ConfirmationModal
                id="delete-reportcard"
                isOpen={deleteReportCardModal.showModal}
                confirmMessage="Are you sure you want to delete this Report Card settings?"
                cancelHndlr={closeReportCardSettingModalHndlr}
                confirmHndlr={delModalSubmitHndlr}
                showImgIcon={true}
                isDisble={showApiLoader}
                iconType="reject"
            />
        </>
    );
};

export default ReportCardSettings;
