import React, { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
//Common Component
import TableContainer from "../../../Components/Common/TableContainer";
import { ConfirmationModal, TextIconInput, SelectInput, ModalComponent } from "../../../Components/Common";
//Helper
import { generateColumns } from "./helper";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";

//Modal Component
import AddEditAcademicTerms from "./AddEditAcademicTerms";
//Action Generator
import { generateActionPayload } from "../../../utility/reduxutility";
import {  getInstTermAct, deleteInstTermAct } from "../../../store/mastersettings/instacademics/instacademicactions";
import { getMasterTermTypesAct } from "../../../store/masterdata/masterdataactions";

//Interface & Types
import { IAcademicTermsProps, ITermsModalState, ITermsRespRef, IDelTermsModalState, sortRef } from "./academictermstypes";
import { IPaginationState } from "../../../Components/Common/Pagination";
import { IOptionsHrtl } from "../../../Components/Common/MenuOptions";
import Button from "../../../Components/Common/Button";

const Terms: React.FC<IAcademicTermsProps> = ({ instituteId, instituteName }) => {
    const [termsModalState, setTermsModalState] = useState<ITermsModalState>({
        showModal: false,
        termId: undefined, modalData: undefined
    });
    const [delTermsModalState, setDelTermsModalState] = useState<IDelTermsModalState>({
        showModal: false,
        termId: ""
    });
    const [filterState, setFilterState] = useState<any>({
        termName: undefined,
        masterTermTypeId: undefined,
        pageSize: 10,
        pageNo: 0,
        sortBy: "termName",
        orderBy: "asc"
    });

    const dispatch = useAppDispatch();
    const { termListResp, addTermResp, deleteTermResp, updateTermResp, masterTermTypesResp, instAcademicErrorResp } = useAppSelector(({ instAcademics, masterData }) => ({
        termListResp: instAcademics.termListResp,
        deleteTermResp: instAcademics.deleteTermResp,
        addTermResp: instAcademics.addTermResp,
        updateTermResp: instAcademics.updateTermResp,
        masterTermTypesResp: masterData.masterTermTypesResp,
        instAcademicErrorResp: instAcademics.instAcademicErrorResp
    }), shallowEqual);

    const termsRespRef = useRef<ITermsRespRef>({
        prevAddTermResp: addTermResp,
        prevDeleteTermResp: deleteTermResp,
        prevUpdateTermResp: updateTermResp,
        prevInstAcademicErrorResp: instAcademicErrorResp
    });

    useEffect(() => {
        if (instituteId) {
            getTermApicall();
        }
    }, [instituteId]);

    useEffect(() => {
        if (!masterTermTypesResp) {
            dispatch(getMasterTermTypesAct(generateActionPayload("get_master_term_types")));
        }
    }, [masterTermTypesResp]);

    useEffect(() => {
        const { prevDeleteTermResp, prevInstAcademicErrorResp, prevAddTermResp, prevUpdateTermResp } = termsRespRef.current;

        if (deleteTermResp && deleteTermResp !== prevDeleteTermResp) {
            setDelTermsModalState(prevState => ({ ...prevState, showModal: false, termId: "" }));
            getTermApicall(filterState);
            toast.success("Term deleted successfully.")
        }
        else if (instAcademicErrorResp && instAcademicErrorResp !== prevInstAcademicErrorResp) {
            const { details }: any = instAcademicErrorResp;
            toast.error(details);
        }
        termsRespRef.current.prevDeleteTermResp = deleteTermResp;
        termsRespRef.current.prevInstAcademicErrorResp = instAcademicErrorResp;
    }, [deleteTermResp, instAcademicErrorResp]);

    function addTermHndlr() {
        setTermsModalState(prevState => ({ ...prevState, showModal: true, termId: undefined, modalData: undefined }))
    }
    const toggleTermModalHndlr = useCallback((otherProps?: any, apiCall?: boolean) => {
        setTermsModalState(prevState => ({ ...prevState, showModal: !prevState.showModal }))
        if (typeof (apiCall) === "boolean" && apiCall) {

            getTermApicall(otherProps || {});
        }
    }, [termListResp]);

    function editAcademicTermHndlr(event: any) {
        const termId = event.currentTarget.getAttribute("data-id");
        let modalData: any = termListResp?.data?.find((item: any) => item.instituteTermId === +termId);
        modalData = { ...modalData, termTypeId: filterState.termTypeId }
        if (modalData) {
            setTermsModalState(prevState => ({ ...prevState, showModal: true, termId, modalData }))
        }
    }

    function deleteAcademicTermHndlr(event: any) {
        const termId: string = event.currentTarget.getAttribute("data-id");
        if (termId)
            setDelTermsModalState(prevState => ({ ...prevState, showModal: true, termId }));
    }

    const menuOptions = useMemo((): IOptionsHrtl[] => ([
        {
            id: "edit",
            actionIcon: <i className="tw-text-blue-500 ri-pencil-fill tw-text-base"></i>,
            actionName: "Edit",
            onClickHndlr: editAcademicTermHndlr,
        },
        {
            id: "delete",
            actionIcon: <i className="tw-text-red-500 ri-delete-bin-5-fill tw-text-base"></i>,
            actionName: "Delete",
            onClickHndlr: deleteAcademicTermHndlr
        }]), [termListResp]);


    function getTermApicall(otherProps?: any) {
        const payload = { instituteId, ...filterState, ...otherProps };
        payload.sortBy === "" && delete payload.orderBy
        payload.sortBy === "" && delete payload.sortBy
        dispatch(getInstTermAct(generateActionPayload("get_inst_term", undefined, payload)));
    }

    function delModalCancelHndlr() {
        setDelTermsModalState(prevState => ({ ...prevState, showModal: false, academicYearId: "" }));
    }

    function delModalSubmitHndlr() {
        const { termId } = delTermsModalState;
        dispatch(deleteInstTermAct(generateActionPayload("del_inst_term", { termId })));
    }

    function paginationHndlr(paginationInfo: IPaginationState) {
        setFilterState((pre: any) => ({ ...pre, pageNo: paginationInfo.pageNo, pageSize: paginationInfo.pageSize }));
        getTermApicall(paginationInfo);
    }

    function onChangeFilterHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;

        setFilterState((prevState: any) => ({ ...prevState, [name]: value }));
        getTermApicall({ [name]: value });
    }
    const academicTermsColumns = useMemo(() => generateColumns(menuOptions), [termListResp]),
        { data: academicTermsList, pageNumber, totalPages, totalElements } = termListResp || {};

    const sortByPrevRef = useRef<Array<sortRef>>([{
        id: "termName",
        desc: false
    }])
    const sortingHandler = useCallback((sortBy: any) => {

        const sortByPrev = sortByPrevRef.current;
        setFilterState((prev: any) => ({ ...prev, sortBy: sortBy[0].id, orderBy: sortBy[0].desc ? "desc" : "asc" }))
        if (sortBy && sortByPrev !== sortBy) {
            getTermApicall({ sortBy: sortBy[0].id, orderBy: sortBy[0].desc ? "desc" : "asc" })
        }
        sortByPrevRef.current = sortBy;
    }, [filterState])
    return (
        <React.Fragment>
            <div className="tw-bg-white tw-rounded-lg tw-shadow-sm">

                <div className="tw-border-b tw-px-4 tw-py-3">
                    <div className="tw-flex tw-items-center">

                        <div className="tw-flex-1">
                            <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                                Terms
                            </h4>
                        </div>

                        <div className="tw-flex tw-justify-end">
                            <Button
                                variant="primary"
                                onClick={addTermHndlr}
                            >
                                Add Term
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="tw-p-0">

                    <div className="tw-py-3 tw-px-3">
                        <form onClick={e => e.preventDefault()}>
                            <div className="tw-grid tw-grid-cols-12 tw-gap-4">

                                <div className="tw-col-span-12 md:tw-col-span-4">
                                        <TextIconInput
                                            formgroupClassName="tw-relative search-box"
                                            name="termName"
                                            value={filterState.termName}
                                            placeHolder="Search"
                                            onChange={onChangeFilterHndlr}
                                            labelText="Search"
                                            floatingLabel
                                        >
                                        <i className="ri-search-line tw-absolute tw-left-3 tw-top-[30px] tw-text-gray-400"></i>
                                        </TextIconInput>
                                </div>

                                <div className="tw-col-span-12 md:tw-col-span-3">
                                    <SelectInput
                                        formgroupClassName="tw-mb-0"
                                        name="masterTermTypeId"
                                        value={filterState.masterTermTypeId}
                                        onChange={onChangeFilterHndlr}
                                        menuItems={masterTermTypesResp || []}
                                        valueKey="masterTermTypeId"
                                        textKey="masterTermTypeName"
                                        labelText="Term"
                                        floatingLabel
                                    />
                                </div>

                            </div>
                        </form>
                    </div>

                    <TableContainer
                        columns={academicTermsColumns || []}
                        data={academicTermsList || []}
                        divClass="table-responsive tw-mb-1"
                        theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
                        tableClass="tw-min-w-full tw-whitespace-nowrap"
                        showPagination={true}
                        totalPages={totalPages}
                        totalRecords={totalElements}
                        callbackPaginationHndlr={paginationHndlr}
                        currentPageNumber={pageNumber}
                        sortingHandler={sortingHandler}
                    />

                </div>
            </div>
            {/* <Modal id="showModal" isOpen={academicTermsModalState.showModal} toggle={toggleTermsModalHndlr} centered size="md">
                <ModalHeader className="bg-light p-3" toggle={toggleTermsModalHndlr}>
                    Add Academic Term
                </ModalHeader>
                <ModalBody>
                    <AddEditAcademicTerms />
                </ModalBody>
                <ModalFooter>
                    <div className="hstack gap-2 justify-content-end">
                        <button
                            type="button"
                            className="btn btn-soft-success"
                            onClick={toggleTermsModalHndlr}
                        >
                            Reset
                        </button>

                        <button type="submit" className="btn btn-success">
                            Save
                        </button>
                    </div>
                </ModalFooter>
            </Modal> */}
            {/* <AddEditAcademicTerms
                isOpen={academicTermsModalState.showModal}
                toggle={toggleTermModalHndlr}
                modalTitle={academicTermsModalState.academicTermId ? "Edit Academic Term" : "Add Academic Term"}
                academicTermId={academicTermsModalState.academicTermId}
                instituteId={instituteId}
                editModalData={academicTermsModalState.modalData}
            /> */}
            <ModalComponent
                id="add-branch-modal"
                modalSize="md"
                modalBodyClass="px-0"
                modalTitle={termsModalState.termId ? "Edit Term" : "Add Term"}
                isOpen={termsModalState.showModal}
                toggle={toggleTermModalHndlr}
                submitTitle={termsModalState.termId ? "Update" : "Submit"}
                cancelHndlr={toggleTermModalHndlr}
                formId="add-terms"
            >
                <AddEditAcademicTerms
                    formId="add-terms"
                    instituteId={instituteId}
                    termId={termsModalState.termId}
                    editModalData={termsModalState.modalData}
                    toggle={toggleTermModalHndlr}
                />
            </ModalComponent>
            <ConfirmationModal
                id="delete-inst-academic-terms"
                isOpen={delTermsModalState.showModal}
                confirmMessage="Are you sure you want to delete this term ?"
                cancelHndlr={delModalCancelHndlr}
                confirmHndlr={delModalSubmitHndlr}
            />
            {/* <ToastContainer/> */}
        </React.Fragment >
    )
}

export default Terms;