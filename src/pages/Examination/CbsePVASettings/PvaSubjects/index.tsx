import { shallowEqual } from "react-redux";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { useFormik } from "formik";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete02StrokeStandard, PencilEdit02Icon } from "@hugeicons-pro/core-stroke-standard";
import { getBranchCurriculumAct } from "../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { debounce } from "../../../../utility/commonutility";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import { ConfirmationModal, ModalContainerUpdated, SelectInput, TextInput } from "../../../../Components/Common";
import TableContainer from "../../../Progress/DummyTable";
import { useModal } from "../../../../hooks/modalhook";
import { generateColumns } from "./helper";
import PvaAddSubjectModal from "./PvaAddSubjectModal";
import { deletePvaSubjectsAct, getPvaSubjectsAct, getPvaSubjectsByIdAct } from "../../../../store/examination/pvaReports/pvaReportsActions";
import { toast } from "react-toastify";

const initialValues = {
    searchString: "",
    classId: "",
    curriculumId: "",
};

const PvaSubjects = () => {
    const { closeModal: closePvaSubjectModalModal, modalState: pvaSubjectAddModalState, openModal: openPvaSubjectAddModal } = useModal();
    const { closeModal: closeDelPvaSubjectModal, modalState: delPvaSubjectModalState, openModal: openDelPvaSubjectModal } = useModal();

    const dispatch = useAppDispatch();

    const getPvaSubjectListApiCall = (otherProps?: any) => {
        const payload = {
            branchId,
            curriculumId: pvaSubjectForm.values.curriculumId,
            ...otherProps,
        }
        dispatch(getPvaSubjectsAct(generateActionPayload("get_pva_subjects", undefined, payload)));
    }

    function delModalSubmitHndlr() {
        dispatch(deletePvaSubjectsAct(generateActionPayload("delete_pva_subjects", { id: delPvaSubjectModalState.modalData })));
    }

    const {
        brchCurriculumResp,
        branchClassResp,
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        showApiLoader,
        getPvaSubjectResp,
        savePvaSubjectResp,
        updatePvaSubjectResp,
        deletePvaSubjectResp,
        pvaReportsErrorAct,
    } = useAppSelector(
        ({ globalData, branchAcademics, appData, pvaReports }) => ({
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            branchClassResp: branchAcademics.branchClassResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            showApiLoader: globalData.showApiLoader,
            getPvaSubjectResp: pvaReports.getPvaSubjectResp,
            savePvaSubjectResp: pvaReports.savePvaSubjectResp,
            updatePvaSubjectResp: pvaReports.updatePvaSubjectResp,
            deletePvaSubjectResp: pvaReports.deletePvaSubjectResp,
            pvaReportsErrorAct: pvaReports.pvaReportsErrorAct,

        }),
        shallowEqual
    );
    const pvaSubjectRef = useRef({
        prevPvaReportsErrorAct: pvaReportsErrorAct,
        prevSavePvaSubjectResp: savePvaSubjectResp,
        prevDeletePvaSubjectResp: deletePvaSubjectResp,
        prevUpdatePvaSubjectResp: updatePvaSubjectResp,
    })

    useEffect(() => {
        const { prevPvaReportsErrorAct, prevSavePvaSubjectResp, prevUpdatePvaSubjectResp, prevDeletePvaSubjectResp } = pvaSubjectRef.current || {}
        if (pvaReportsErrorAct && prevPvaReportsErrorAct !== pvaReportsErrorAct) {
            const { details } = pvaReportsErrorAct || {}
            toast.error(details || "Something went wrong")
        }
        else if (savePvaSubjectResp && prevSavePvaSubjectResp !== savePvaSubjectResp) {
            toast.success("Subjects Added successfully")
            closePvaSubjectModalModal();
            getPvaSubjectListApiCall();
        }
        else if (updatePvaSubjectResp && prevUpdatePvaSubjectResp !== updatePvaSubjectResp) {
            toast.success("Subjects Updated successfully")
            closePvaSubjectModalModal();
            getPvaSubjectListApiCall();
        }
        else if (deletePvaSubjectResp && prevDeletePvaSubjectResp !== deletePvaSubjectResp) {
            toast.success("Subject Deleted successfully")
            closeDelPvaSubjectModal();
            getPvaSubjectListApiCall();
        }
        pvaSubjectRef.current.prevPvaReportsErrorAct = pvaReportsErrorAct;
        pvaSubjectRef.current.prevSavePvaSubjectResp = savePvaSubjectResp;
        pvaSubjectRef.current.prevUpdatePvaSubjectResp = updatePvaSubjectResp;
        pvaSubjectRef.current.prevDeletePvaSubjectResp = deletePvaSubjectResp;
    }, [pvaReportsErrorAct, savePvaSubjectResp, updatePvaSubjectResp, deletePvaSubjectResp])

    useEffect(() => {
        const { data } = brchCurriculumResp || {};
        if (Array.isArray(data) && data.length > 0) {
            let shortNameToMatch = "";

            if (location.pathname.includes("/cbse-pva-settings/pva-subjects")) {
                shortNameToMatch = "CBSE";
            }
            // else if (location.pathname.includes("/early-years-settings")) {
            //     shortNameToMatch = "EY1-EY3";
            // } else if (location.pathname.includes("/igcse-settings")) {
            //     shortNameToMatch = "IGCSE";
            // }

            const selectedCurriculum = data.find(
                (item) => item.shortName === shortNameToMatch
            );

            if (selectedCurriculum) {
                pvaSubjectForm.setValues((prev: any) => ({
                    ...prev,
                    curriculumId: selectedCurriculum.branchCurriculumId,
                }));
            }
        }
    }, [brchCurriculumResp, location.pathname]);

    const pvaSubjectForm = useFormik({
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
                    dispatch(getPvaSubjectsByIdAct(generateActionPayload("get_pva_subjects_by_id", { id })));
                    openPvaSubjectAddModal(id);
                },

            },
            {
                id: "delete",
                actionIcon: <HugeiconsIcon icon={Delete02StrokeStandard} className="text-danger" size={18} />,
                actionName: "Delete",
                onClickHndlr: (event: any) => {
                    const id = event.currentTarget.getAttribute("data-id");
                    openDelPvaSubjectModal(id)
                },
            },
        ],
        [getPvaSubjectResp]
    );

    const getCurriculumApiCall = (otherProps?: any) => {
        const payload1 = { instituteId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", ...otherProps };
        dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
    }

    useEffect(() => {
        if (pvaSubjectForm.values.curriculumId) {
            getPvaSubjectListApiCall();
        }
    }, [pvaSubjectForm.values.curriculumId]);

    useEffect(() => {
        getCurriculumApiCall();
    }, [])

    function search(value: string) {
        getPvaSubjectListApiCall({ ...pvaSubjectForm.values, searchString: value });
    }

    const debounceFun = useCallback(debounce(search, 200), [getPvaSubjectResp]);

    const filterHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        if (name === "searchString") {
            pvaSubjectForm.setValues((prev: any) => ({ ...prev, [name]: value }))
            debounceFun(value);
        }
        else {
            const updatedValues = { ...pvaSubjectForm.values, [name]: value };
            pvaSubjectForm.setValues(updatedValues);
        }
    }

    const columns = useMemo(() => generateColumns(menuOptions), [getPvaSubjectResp]);
    const { data: curriculumTypes } = brchCurriculumResp || {}

    return (
        <>
            <div className="page-content free_payment_record_wrapper">
                <div className="container-fluid">
                    <BreadCrumb title="Examination" pageTitle="Examination" />
                    <div className="card">
                        <div className="card-header">
                            <div className="row align-items-center">
                                <div className="col-6">
                                    <h4 className="card-title mb-0 flex-grow-1">PVA Subjects</h4>
                                </div>
                            </div>
                        </div>
                        <div className="card-body p-0">
                            <div className="row mx-3 pt-3">
                                <div className="col-xs-12 col-md-12 col-lg-3 col-xl-3">
                                    <div className="search-box">
                                        <TextInput
                                            name="searchString"
                                            formgroupClassName="mb-0"
                                            placeHolder="Search"
                                            labelText="Search"
                                            floatingLabel
                                            inputClassName=""
                                            value={pvaSubjectForm.values.searchString}
                                            onChange={filterHandler}
                                        />
                                        <i className="ri-search-line search-icon"></i>
                                    </div>
                                </div>
                                <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                                    <SelectInput
                                        name="curriculumId"
                                        value={pvaSubjectForm.values.curriculumId}
                                        onChange={filterHandler}
                                        menuItems={curriculumTypes}
                                        valueKey="branchCurriculumId"
                                        textKey="curriculumName"
                                        labelText="Curriculum"
                                        floatingLabel
                                        inputClassName=""
                                    />
                                </div>
                                <div className="col-auto ms-auto">
                                    <button
                                        className="btn btn-success float-end d-flex align-items-center"
                                        onClick={() => openPvaSubjectAddModal()}
                                    >
                                        <i className="ri-add-line me-2" />
                                        Add New
                                    </button>
                                </div>
                            </div>
                            <TableContainer
                                columns={columns || []}
                                data={Array.isArray(getPvaSubjectResp) ? getPvaSubjectResp : []}
                                tableClass="mb-0"
                                divClass="table-responsive mb-3"
                                theadClass="table-light text-muted align-middle"
                                showPagination={true}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <ModalContainerUpdated
                id="add-examination"
                isOpen={pvaSubjectAddModalState.showModal}
                toggle={() => closePvaSubjectModalModal()}
                modalTitle={pvaSubjectAddModalState.modalData ? "Edit PVA Subjects" : "Add PVA Subjects"}
            >
                <PvaAddSubjectModal
                    id={pvaSubjectAddModalState.modalData}
                    isOpen={false}
                    toggle={() => closePvaSubjectModalModal()}
                    modalTitle="Create Detail"
                    instituteId={instituteId}
                    branchId={branchId}
                    modalData={pvaSubjectForm.values}
                />
            </ModalContainerUpdated>

            <ConfirmationModal
                id="delete-examination-pva-subject"
                isOpen={delPvaSubjectModalState.showModal}
                confirmMessage="Are you sure you want to delete this record ?"
                cancelHndlr={closeDelPvaSubjectModal}
                confirmHndlr={delModalSubmitHndlr}
                showImgIcon={true}
                isDisble={showApiLoader}
                iconType="reject"
            />
        </>
    );
};

export default PvaSubjects;
