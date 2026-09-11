import React, { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";

//Common Component
import TableContainer from "../../../../Components/Common/TableContainer";
import { ConfirmationModal, TextIconInput, SelectInput, ModalContainerUpdated } from "../../../../Components/Common";

import { generateColumns, subjectTypeOptions } from "./helper";

//Modal Component
import AddEditSubject from "./AddEditSubject";
//Action Generator
import { generateActionPayload } from "../../../../utility/reduxutility";
import { deleteBrchSubjectAct, getBrchSubjectsAct, getBranchCurriculumAct } from "../../../../store/branchsettings/branchacademics/branchacademicsactions";

//Interface & Types
import { IOptionsHrtl } from "../../../../Components/Common/MenuOptions";
import { HugeiconsIcon } from "@hugeicons/react";
import { EyeIcon } from "@hugeicons-pro/core-stroke-standard";
import Button from "../../../../Components/Common/Button";

const Subjects: React.FC<any> = ({ instituteId, branchId }) => {
    const [addClassModalState, setAddClassModalState] = useState<any>({
        showModal: false, subjectId: "", modalData: undefined
    });
    const [delClassModalState, setDelClassModalState] = useState<any>({
        showModal: false,
        subjectId: ""
    });
    const paginationRef = useRef({ pageNo: 0, pageSize: 10 });
    
    const [filterState, setFilterState] = useState<any>({
        searchString: undefined,
        curriculumId: undefined,
        subjectType: undefined,
    });

    const dispatch = useAppDispatch();
    const { brchCurriculumResp, brchSubjectsResp, deleteBrchSubjectResp, brchAcademicErrorResp } = useAppSelector((
        { branchAcademics }) => ({
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            brchSubjectsResp: branchAcademics.brchSubjectsResp,
            deleteBrchSubjectResp: branchAcademics.deleteBrchSubjectResp,
            brchAcademicErrorResp: branchAcademics.brchAcademicErrorResp
        }), shallowEqual);

    const branchClassRespRef = useRef<any>({
        prevBrchCurriculumResp: undefined,
        prevBrchSubjectsResp: brchSubjectsResp,
        prevDeleteBrchSubjectResp: deleteBrchSubjectResp,
        prevBrchAcademicErrorResp: brchAcademicErrorResp
    });

    useEffect(() => {
        if (branchId && !brchCurriculumResp) {
            const params = { branchId, pageSize: 100, pageNo: 0, sortBy: "curriculumName", orderBy: "asc" };
            dispatch(getBranchCurriculumAct(generateActionPayload("get_inst_curriculum", undefined, params)));
        }
    }, [branchId, brchCurriculumResp]);

    useEffect(() => {
        const { prevBrchCurriculumResp, prevDeleteBrchSubjectResp, prevBrchAcademicErrorResp } = branchClassRespRef.current;
        if (brchCurriculumResp && prevBrchCurriculumResp !== brchCurriculumResp) {
            const { data }: any = brchCurriculumResp;
            if (Array.isArray(data) && data.length > 0) {
                const { branchCurriculumId } = data[0];
                setFilterState((prevState: any) => ({ ...prevState, curriculumId: branchCurriculumId }));
                if (branchCurriculumId) {
                    getSubjectApiCall({ curriculumId: branchCurriculumId })
                }
            }
        }
        else if (deleteBrchSubjectResp && prevDeleteBrchSubjectResp !== deleteBrchSubjectResp) {
            setDelClassModalState((prevState: any) => ({ ...prevState, showModal: false, subjectId: "" }));
            getSubjectApiCall();
            toast.success("Subject deleted successfully.");
        } else if (brchAcademicErrorResp && brchAcademicErrorResp !== prevBrchAcademicErrorResp) {
            const { details }: any = brchAcademicErrorResp;
            toast.error(details);
        }
        branchClassRespRef.current.prevBrchCurriculumResp = brchCurriculumResp;
        branchClassRespRef.current.prevDeleteBrchSubjectResp = deleteBrchSubjectResp;
        branchClassRespRef.current.prevBrchAcademicErrorResp = brchAcademicErrorResp;
    }, [brchCurriculumResp, deleteBrchSubjectResp, brchAcademicErrorResp]);

    const toggleSubjectModalHndlr = useCallback((apiCall?: boolean) => {
        setAddClassModalState((prevState: any) => ({ ...prevState, showModal: !prevState.showModal, subjectId: "" }))
        if (typeof (apiCall) === "boolean" && apiCall) {
            getSubjectApiCall();
        }
    }, [branchId, brchSubjectsResp]);

    function addSubjectHndlr() {
        setAddClassModalState((prevState: any) => ({ ...prevState, showModal: true, subjectId: "", modalData: undefined }));
    }

    function editSubjectHndlr(event: any) {
        const subjectId = event.currentTarget.getAttribute("data-id"),
            modalData: any = brchSubjectsResp?.data?.find((item: any) => item.id === +subjectId);
        if (modalData) {
            setAddClassModalState((prevState: any) => ({ ...prevState, showModal: true, subjectId, modalData }))
        }
    }

    function delSubjectHndlr(event: any) {
        const subjectId = event.currentTarget.getAttribute("data-id");
        if (subjectId)
            setDelClassModalState((prevState: any) => ({ ...prevState, showModal: true, subjectId }));
    }

    const menuOptions = useMemo((): IOptionsHrtl[] => ([
        {
            id: "view",
            actionIcon:< HugeiconsIcon icon = { EyeIcon } className = "text-muted" size = { 18} />,
            actionName: "View Details",
            onClickHndlr: editSubjectHndlr
        }, {
            id: "delete",
            actionIcon: <i className="text-danger ri-delete-bin-5-fill fs-16"></i>,
            actionName: "Delete",
            onClickHndlr: delSubjectHndlr
        }]), [brchSubjectsResp]);

    function delModalCancelHndlr() {
        setDelClassModalState((prevState: any) => ({ ...prevState, showModal: false, subjectId: "" }));
    }
    function delModalSubmitHndlr() {
        const { subjectId } = delClassModalState;
        dispatch(deleteBrchSubjectAct(generateActionPayload("delete_brch_subject", { subjectId })));
    }
    function paginationHndlr(paginationInfo: any) {
        getSubjectApiCall(paginationInfo);
    }

    function getSubjectApiCall(otherProps?: any) {
        const payload = {
            branchId, ...filterState,...paginationRef.current, ...otherProps
        };
        dispatch(getBrchSubjectsAct(generateActionPayload("get_brch_subjects", undefined, payload)));
    }

    function onChangeFilterHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        setFilterState((prevState: any) => ({ ...prevState, [name]: value }));
        getSubjectApiCall({ [name]: value });
    }
    const classColumns = useMemo(() => generateColumns(menuOptions), [brchSubjectsResp]),
        { data: classList, pageNumber, totalPages, totalElements } = brchSubjectsResp || {};
    return (
        <React.Fragment>

            <div className="tw-py-3 tw-px-3">
                <form onClick={(e) => e.preventDefault()}>
                    <div className="tw-grid tw-grid-cols-2 lg:tw-grid-cols-12 tw-gap-3 tw-items-end tw-pt-3 tw-pb-1">

                        <div className="lg:tw-col-span-4">
                            <div className="search-box">
                                <TextIconInput
                                    formgroupClassName="search-box"
                                    name="searchString"
                                    value={filterState.searchString}
                                    placeHolder="Search"
                                    labelText="Search"
                                    floatingLabel
                                    onChange={onChangeFilterHndlr}
                                >
                                    <i className="ri-search-line search-icon"></i>
                                </TextIconInput>
                            </div>
                        </div>
                        <div className="lg:tw-col-span-3">
                            <SelectInput
                                name="curriculumId"
                                value={filterState.curriculumId}
                                onChange={onChangeFilterHndlr}
                                menuItems={brchCurriculumResp?.data}
                                formgroupClassName="tw-mb-0"
                                valueKey="branchCurriculumId"
                                textKey="curriculumName"
                                labelText="Curriculum"
                                floatingLabel
                            />
                        </div>

                        <div className="lg:tw-col-span-2">
                            <SelectInput
                                name="subjectType"
                                value={filterState.subjectType}
                                onChange={onChangeFilterHndlr}
                                menuItems={subjectTypeOptions}
                                formgroupClassName="tw-mb-0"
                                valueKey="id"
                                textKey="name"
                                labelText="Subject"
                                floatingLabel
                            />
                        </div>

                        <div className="tw-col-span-2 lg:tw-col-span-3 tw-flex tw-justify-start lg:tw-justify-end">
                            <Button
                                variant="primary"
                                onClick={addSubjectHndlr}
                            >
                                Add Subject
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
            <TableContainer
                columns={classColumns || []}
                data={(Array.isArray(classList) && classList) || []}
                divClass="table-responsive mb-1"
                theadClass="table-light text-muted align-middle"
                showPagination={true}
                totalPages={totalPages}
                totalRecords={totalElements}
                callbackPaginationHndlr={paginationHndlr}
                currentPageNumber={pageNumber}
            />
                <ModalContainerUpdated
                id="add-subjects-modal"
                isOpen={addClassModalState.showModal}
                toggle={toggleSubjectModalHndlr}
                modalTitle={addClassModalState.subjectId ? "View Subject" : "Add Subject"}
                modalSize="lg"
            >
            <AddEditSubject
                isOpen={addClassModalState.showModal}
                toggle={toggleSubjectModalHndlr}
                subjectId={addClassModalState.subjectId}
                branchId={branchId}
                instituteId={instituteId}
                editModalData={addClassModalState.modalData}
            />
            </ModalContainerUpdated>
            <ConfirmationModal
                id="delete-subject-modal"
                isOpen={delClassModalState.showModal}
                confirmMessage="Are you sure you want to delete this subject?"
                cancelHndlr={delModalCancelHndlr}
                confirmHndlr={delModalSubmitHndlr}
            />
        </React.Fragment >
    )
}

export default Subjects;