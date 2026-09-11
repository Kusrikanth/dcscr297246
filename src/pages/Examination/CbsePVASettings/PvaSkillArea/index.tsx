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
import { useModal } from "../../../../hooks/modalhook";
import { generateColumns } from "./helper";
import PvaAddSkillAreaModal from "./PvaAddSkillAreaModal";
import TableContainer from "../../../../Components/Common/TableContainer";
import { toast } from "react-toastify";
import { deletePvaSkillAreaAct, getPvaSkillAreaAct, getPvaSkillAreaByIdAct } from "../../../../store/examination/pvaReports/pvaReportsActions";
import { IPaginationState } from "../../../../Components/Common/Pagination";

const initialValues = {
    searchString: "",
    classId: "",
    curriculumId: "",
};

const PvaSkillArea = () => {
    const { closeModal: closePvaSkillAreaModalModal, modalState: pavSubjectAddModalState, openModal: openPvaSkillAreaAddModal } = useModal();
    const { closeModal: closeDelPvaSkillAreaModal, modalState: delPvaSkillAreaModalState, openModal: openDelPvaSkillAreaModal } = useModal();

    const dispatch = useAppDispatch();

    const pagination = useRef({
        pageNo: 0,
        pageSize: 10
    })
    const getPvaSkillAreaListApiCall = (otherProps?: any) => {
        const payload = {
            branchId,
            curriculumId: pvaSkillAreaForm.values.curriculumId,
            ...pagination.current,
            ...otherProps,
        }
        dispatch(getPvaSkillAreaAct(generateActionPayload("get_pva_skill_attributes", undefined, payload)));
    }

    function delModalSubmitHndlr() {
        dispatch(deletePvaSkillAreaAct(generateActionPayload("delete_pva_skill_attributes", { id: delPvaSkillAreaModalState.modalData })));
    }

    const {
        brchCurriculumResp,
        branchClassResp,
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        showApiLoader,
        getPvaSkillAreaResp,
        savePvaSkillAreaResp,
        deletePvaSkillAreaResp,
        pvaReportsErrorAct,
    } = useAppSelector(
        ({ globalData, branchAcademics, appData, pvaReports }) => ({
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            branchClassResp: branchAcademics.branchClassResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            showApiLoader: globalData.showApiLoader,
            getPvaSkillAreaResp: pvaReports.getPvaSkillAreaResp,
            savePvaSkillAreaResp: pvaReports.savePvaSkillAreaResp,
            deletePvaSkillAreaResp: pvaReports.deletePvaSkillAreaResp,
            pvaReportsErrorAct: pvaReports.pvaReportsErrorAct,

        }),
        shallowEqual
    );
    const pvaSubjectRef = useRef({
        prevPvaReportsErrorAct: pvaReportsErrorAct,
        prevSavePvaSkillAreaResp: savePvaSkillAreaResp,
        prevDeletePvaSkillAreaResp: deletePvaSkillAreaResp,
    })

    useEffect(() => {
        const { prevPvaReportsErrorAct, prevSavePvaSkillAreaResp, prevDeletePvaSkillAreaResp } = pvaSubjectRef.current || {}
        if (pvaReportsErrorAct && prevPvaReportsErrorAct !== pvaReportsErrorAct) {
            const { details } = pvaReportsErrorAct || {}
            toast.error(details || "Something went wrong")
        }
        else if (savePvaSkillAreaResp && prevSavePvaSkillAreaResp !== savePvaSkillAreaResp) {
            toast.success("Skills Added successfully")
            closePvaSkillAreaModalModal();
            getPvaSkillAreaListApiCall();
        }
        else if (deletePvaSkillAreaResp && prevDeletePvaSkillAreaResp !== deletePvaSkillAreaResp) {
            toast.success("Skills Deleted successfully")
            closeDelPvaSkillAreaModal();
            getPvaSkillAreaListApiCall();
        }
        pvaSubjectRef.current.prevPvaReportsErrorAct = pvaReportsErrorAct;
        pvaSubjectRef.current.prevSavePvaSkillAreaResp = savePvaSkillAreaResp;
       pvaSubjectRef.current.prevDeletePvaSkillAreaResp = deletePvaSkillAreaResp;
    }, [pvaReportsErrorAct, savePvaSkillAreaResp, deletePvaSkillAreaResp])

    useEffect(() => {
        const { data } = brchCurriculumResp || {};
        if (Array.isArray(data) && data.length > 0) {
            let shortNameToMatch = "";

            if (location.pathname.includes("/cbse-pva-settings/pva-skill-area")) {
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
                pvaSkillAreaForm.setValues((prev: any) => ({
                    ...prev,
                    curriculumId: selectedCurriculum.branchCurriculumId,
                }));
            }
        }
    }, [brchCurriculumResp, location.pathname]);

    const pvaSkillAreaForm = useFormik({
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
                    dispatch(getPvaSkillAreaByIdAct(generateActionPayload("get_pva_skill_attributes_by_id", { id })));
                    openPvaSkillAreaAddModal(id);
                },

            },
            {
                id: "delete",
                actionIcon: <HugeiconsIcon icon={Delete02StrokeStandard} className="text-danger" size={18} />,
                actionName: "Delete",
                onClickHndlr: (event: any) => {
                    const id = event.currentTarget.getAttribute("data-id");
                    openDelPvaSkillAreaModal(id)
                },
            },
        ],
        [getPvaSkillAreaResp]
    );


    const getCurriculumApiCall = (otherProps?: any) => {
        const payload1 = { instituteId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", ...otherProps };
        dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
    }

    useEffect(() => {
        if (pvaSkillAreaForm.values.curriculumId) {
            getPvaSkillAreaListApiCall();
        }
    }, [pvaSkillAreaForm.values.curriculumId]);

    useEffect(() => {
        getCurriculumApiCall();
    }, [])


    function search(value: string) {
        getPvaSkillAreaListApiCall({ ...pvaSkillAreaForm.values, searchString: value });
    }

    const debounceFun = useCallback(debounce(search, 200), [getPvaSkillAreaResp]);

    const filterHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        pagination.current.pageNo = 0;
        if (name === "searchString") {
            pvaSkillAreaForm.setValues((prev: any) => ({ ...prev, [name]: value }))
            debounceFun(value);
        }
        else {
            const updatedValues = { ...pvaSkillAreaForm.values, [name]: value };
            pvaSkillAreaForm.setValues(updatedValues);
        }
    }

    function paginationHndlr(paginationInfo: IPaginationState) {
        pagination.current = paginationInfo;
        getPvaSkillAreaListApiCall(paginationInfo);
    }
    const columns = useMemo(() => generateColumns(menuOptions), [getPvaSkillAreaResp]);
    const { data: curriculumTypes } = brchCurriculumResp || {}
    const { totalElements, totalPages, pageable } = getPvaSkillAreaResp || {};

    return (
        <>
            <div className="page-content free_payment_record_wrapper">
                <div className="container-fluid">
                    <BreadCrumb title="Examination" pageTitle="Examination" />
                    <div className="card">
                        <div className="card-header">
                            <div className="row align-items-center">
                                <div className="col-6">
                                    <h4 className="card-title mb-0 flex-grow-1">PVA Skill Area</h4>
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
                                            value={pvaSkillAreaForm.values.searchString}
                                            onChange={filterHandler}
                                        />
                                        <i className="ri-search-line search-icon"></i>
                                    </div>
                                </div>
                                <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
                                    <SelectInput
                                        name="curriculumId"
                                        value={pvaSkillAreaForm.values.curriculumId}
                                        onChange={filterHandler}
                                        menuItems={curriculumTypes}
                                        valueKey="branchCurriculumId"
                                        textKey="curriculumName"
                                        labelText="Curriculum"
                                        floatingLabel
                                        labelClass="required"
                                        inputClassName=""
                                    />
                                </div>
                                <div className="col-auto ms-auto">
                                    <button
                                        className="btn btn-success float-end d-flex align-items-center"
                                        onClick={() => openPvaSkillAreaAddModal()}
                                    >
                                        <i className="ri-add-line me-2" />
                                        Add New
                                    </button>
                                </div>
                            </div>
                            <TableContainer
                                columns={columns || []}
                                data={
                                    Array.isArray(getPvaSkillAreaResp?.content)
                                        ? getPvaSkillAreaResp.content
                                        : []
                                }
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
            </div>
            <ModalContainerUpdated
                id="add-examination"
                isOpen={pavSubjectAddModalState.showModal}
                toggle={() => closePvaSkillAreaModalModal()}
                modalTitle={pavSubjectAddModalState.modalData ? "Edit PVA Skill Area" : "Add PVA Skill Area"}
                modalSize="md"
            >
                <PvaAddSkillAreaModal
                    id={pavSubjectAddModalState.modalData}
                    isOpen={false}
                    toggle={() => closePvaSkillAreaModalModal()}
                    modalTitle="Create Detail"
                    instituteId={instituteId}
                    branchId={branchId}
                    modalData={pvaSkillAreaForm.values}
                />
            </ModalContainerUpdated>

            <ConfirmationModal
                id="delete-pva-skill-area"
                isOpen={delPvaSkillAreaModalState.showModal}
                confirmMessage="Are you sure you want to delete this record ?"
                cancelHndlr={closeDelPvaSkillAreaModal}
                confirmHndlr={delModalSubmitHndlr}
                showImgIcon={true}
                isDisble={showApiLoader}
                iconType="reject"
            />
        </>
    );
};

export default PvaSkillArea;
