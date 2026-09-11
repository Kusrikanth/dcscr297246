import React, { useEffect, useMemo, useRef } from "react";
import { ConfirmationModal, ModalContainerUpdated, SelectInput, TextInput } from '../../../../Components/Common';
import TableContainer from '../../../../Components/Common/TableContainer';
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { useFilterState } from "../../../../hooks/filterhook";
import { useModal } from "../../../../hooks/modalhook";
import { deletePercentageSlabsListAct, getPercentageSlabsListAct, } from "../../../../store/examination/examinationsettings/examinationsettingsaction";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import { IPaginationState } from "../../../../Components/Common/Pagination";
import { useFormik } from "formik";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02StrokeStandard, PencilEdit02Icon } from "@hugeicons-pro/core-stroke-standard";
import { displayTypes, generateInternalSubjectGradesColumns, ignoredKeys, moduleTypes, result } from "./helper";
import AddClassModal from "./AddClassModal";

const initialValues = {
    searchString: "",
    academicYearId: "",
    displayType: "",
    resultType: "",
    moduleType: "",
};

const PercentageSlabs = () => {

    const dispatch = useAppDispatch();
    const { closeModal: closeDelInternalSubjectGradesGradeModal, modalState: deleteInternalSubjectGradesGradeState, openModal: openDelInternalSubjectGradesGradeModal } = useModal();
    const { closeModal: closeInternalSubjectGradesGradeUploadModal, modalState: cbseInternalSubjectGradesUploadState, openModal: openInternalSubjectGradesGradeUploadModal } = useModal();
    const { showClearFilterState, count, advanceFilterChange } = useFilterState()

    const pagination = useRef({
        pageNo: 0,
        pageSize: 10
    });

    const getPercentageSlabsApiCall = (otherProps?: any) => {
        const payload = {
            instituteId,
            ...internalSubjectGradeForm.values,
            ...pagination.current,
            ...otherProps,
        };
        if (payload.resultType) {
            payload.result = payload.resultType;
            delete payload.resultType;
        }
        dispatch(getPercentageSlabsListAct(generateActionPayload("get_percentage_slabs_list", undefined, payload)));
    };

    const internalSubjectGradeForm = useFormik({
        initialValues,
        onSubmit: (values) => { },
    });

    const {
        academicYearListResp,
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        showApiLoader,
        getPercentageSlabsListResp,
        cbseExaminationErrorAct,
        editPercentageSlabsListResp,
        savePercentageSlabsListResp,
        deletePercentageSlabsListResp
    } = useAppSelector(
        ({ instAcademics, examinationSettings, appData, globalData, }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            showApiLoader: globalData.showApiLoader,
            currentInstIdResp: appData.currentInstIdResp,
            getPercentageSlabsListResp: examinationSettings.getPercentageSlabsListResp,
            cbseExaminationErrorAct: examinationSettings.cbseExaminationErrorAct,
            editPercentageSlabsListResp: examinationSettings.editPercentageSlabsListResp,
            savePercentageSlabsListResp: examinationSettings.savePercentageSlabsListResp,
            deletePercentageSlabsListResp: examinationSettings.deletePercentageSlabsListResp
        }),
        shallowEqual
    );

    const addClassStructRespRef = useRef({
        prevEditPercentageSlabsListResp: editPercentageSlabsListResp,
        prevSavePercentageSlabsListResp: savePercentageSlabsListResp,
        prevInternalSubjectGradesGradesErrorResp: cbseExaminationErrorAct,
        prevDeletePercentageSlabsListResp: deletePercentageSlabsListResp

    });


    useEffect(() => {
        const { prevEditPercentageSlabsListResp, prevSavePercentageSlabsListResp, prevInternalSubjectGradesGradesErrorResp, prevDeletePercentageSlabsListResp } = addClassStructRespRef.current;
        if (editPercentageSlabsListResp && prevEditPercentageSlabsListResp !== editPercentageSlabsListResp) {
            closeInternalSubjectGradesGradeUploadModal();
            getPercentageSlabsApiCall();
            toast.success("Percentage Slabs updated successfully.")
        }
        else if (savePercentageSlabsListResp && prevSavePercentageSlabsListResp !== savePercentageSlabsListResp) {
            closeInternalSubjectGradesGradeUploadModal();
            getPercentageSlabsApiCall();
            toast.success("Percentage Slabs added successfully.")
        }
        else if (deletePercentageSlabsListResp && prevDeletePercentageSlabsListResp !== deletePercentageSlabsListResp) {
            closeDelInternalSubjectGradesGradeModal();
            getPercentageSlabsApiCall();
            toast.success("Percentage Slabs Deleted successfully.")
        }
        else if (cbseExaminationErrorAct && prevInternalSubjectGradesGradesErrorResp !== cbseExaminationErrorAct) {
            const { details } = cbseExaminationErrorAct || {};
            toast.error(details || "Something went wrong.");
        }
        addClassStructRespRef.current.prevEditPercentageSlabsListResp = editPercentageSlabsListResp;
        addClassStructRespRef.current.prevSavePercentageSlabsListResp = savePercentageSlabsListResp;
        addClassStructRespRef.current.prevInternalSubjectGradesGradesErrorResp = cbseExaminationErrorAct;
        addClassStructRespRef.current.prevDeletePercentageSlabsListResp = deletePercentageSlabsListResp;
    }, [editPercentageSlabsListResp, savePercentageSlabsListResp, cbseExaminationErrorAct, deletePercentageSlabsListResp]);

    useEffect(() => {
        const yearId = academicYearListResp?.data.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId;
        if (yearId) {
            getPercentageSlabsApiCall({ academicYearId: yearId });
            internalSubjectGradeForm.setFieldValue("academicYearId", yearId);
        }
    }, [academicYearListResp]);

    const menuOptions = useMemo(
        () => [
            {
                id: "edit",
                actionIcon: <HugeiconsIcon icon={PencilEdit02Icon} className=" text-muted" size={20} />,
                actionName: "Edit",
                onClickHndlr: (event: any) => {
                    const id = event.currentTarget.getAttribute("data-id");
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
        [getPercentageSlabsListResp]
    );

    function paginationHndlr(paginationInfo: IPaginationState) {
        pagination.current = paginationInfo;
        getPercentageSlabsApiCall(paginationInfo);
    }

    const onChangeFilterHndlr = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        pagination.current.pageNo = 0;

        internalSubjectGradeForm.setValues((prev: any) => {
            const updatedState = { ...prev, [name]: value };
            if (name === "academicYearId") {
                updatedState.classId = "";
                getPercentageSlabsApiCall({ ...updatedState, classId: "" });
            } else {
                getPercentageSlabsApiCall(updatedState);
            }
            advanceFilterChange({ keys: { ...internalSubjectGradeForm.values, [name]: value }, ignoredKeys });
            return updatedState;
        });
    };

    function clearFilterHndlr() {
        pagination.current.pageNo = 0;
        const { academicYearId } = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current") || {}
        internalSubjectGradeForm.setValues({ ...initialValues, academicYearId: academicYearId || "" });
        getPercentageSlabsApiCall({ ...initialValues, academicYearId });
        advanceFilterChange({ keys: { ...initialValues, academicYearId }, ignoredKeys })
        if (count) {
            setTimeout(() => {
                advanceFilterChange({ keys: {}, ignoredKeys });
            }, 0);
        }
    }

    function delModalSubmitHndlr() {

        const data = getPercentageSlabsListResp?.content.find((item: any) => +item.id === +deleteInternalSubjectGradesGradeState.modalData);

        const payload = {
            ...data,
            isDeleted: true
        }

        dispatch(
            deletePercentageSlabsListAct(
                generateActionPayload(
                    "update_percentage_slabs_list",
                    undefined,
                    payload
                )
            )
        );
    }

    const internalSubjectGradesCol = useMemo(() => generateInternalSubjectGradesColumns(menuOptions), []);
    const { content: cbseExaminationResp, totalElements, totalPages, pageable } = getPercentageSlabsListResp || {};
    const { data: academicYearList } = academicYearListResp || {};
    return (
        <>
                    <div className="card">
                        <div className="card-header">
                            <div className="row align-items-center">
                                <div className="col-6">
                                    <h4 className="card-title mb-0 flex-grow-1">Dashboard Percentage Slabs</h4>
                                </div>
                            </div>
                        </div>
                        <div className="card-body p-0">
                            <div className="row bg-light m-3 pb-3 px-2 g-3 examination">
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
                                            inputClassName="bg-light"
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
                                        inputClassName="bg-light"
                                    />
                                </div>
                                <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                                    <SelectInput
                                        name="displayType"
                                        value={internalSubjectGradeForm.values.displayType}
                                        onChange={onChangeFilterHndlr}
                                        menuItems={displayTypes}
                                        valueKey="value"
                                        textKey="label"
                                        formgroupClassName="mb-0"
                                        labelText='Display Type'
                                        floatingLabel
                                        inputClassName="bg-light"
                                    />
                                </div>
                                <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                                    <SelectInput
                                        name="resultType"
                                        value={internalSubjectGradeForm.values.resultType}
                                        onChange={onChangeFilterHndlr}
                                        menuItems={result}
                                        valueKey="value"
                                        textKey="label"
                                        formgroupClassName="mb-0"
                                        labelText='Result'
                                        floatingLabel
                                        inputClassName="bg-light"
                                    />
                                </div>
                                <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                                    <SelectInput
                                        name="moduleType"
                                        value={internalSubjectGradeForm.values.moduleType}
                                        onChange={onChangeFilterHndlr}
                                        menuItems={moduleTypes}
                                        valueKey="value"
                                        textKey="label"
                                        formgroupClassName="mb-0"
                                        labelText='Module Type'
                                        floatingLabel
                                        inputClassName="bg-light"
                                    />
                                </div>
                                <div className="col-auto d-flex align-items-center">
                                    {showClearFilterState && <button type="button" onClick={clearFilterHndlr} className="btn btn-sm btn-ghost-danger">Clear filter</button>}
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
                                data={Array.isArray(getPercentageSlabsListResp?.content) ? getPercentageSlabsListResp?.content : []}
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
              
            <ModalContainerUpdated
                id="add-examination"
                isOpen={cbseInternalSubjectGradesUploadState.showModal}
                toggle={closeInternalSubjectGradesGradeUploadModal}
                modalTitle={cbseInternalSubjectGradesUploadState.modalData ? "Edit Internal Subject Grades Details" : "Create Details"}
                modalSize="lg"
            >
                <AddClassModal
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
                confirmMessage="Are you sure you want to delete this record ?"
                cancelHndlr={closeDelInternalSubjectGradesGradeModal}
                confirmHndlr={delModalSubmitHndlr}
                showImgIcon={true}
                isDisble={showApiLoader}
                iconType="reject"
            />
        </>
    );
};

export default PercentageSlabs;
