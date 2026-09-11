import React, { useMemo, useState, useEffect, useCallback, useRef } from "react";
import { shallowEqual } from "react-redux";
//Common Component
import TableContainer from "../../../Components/Common/TableContainer";
import { ConfirmationModal, TextIconInput, SelectInput, ModalContainerUpdated } from "../../../Components/Common";
import { generateColumns } from "./helper";
import { toast } from "react-toastify";

//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";

//Modal Component
import AddEditForm from "./AddEditForm";
//Action Generator
import { generateActionPayload } from "../../../utility/reduxutility";
import { getFormAssignedToBranchAct, deleteFormAssignedToBranchAct, setFormsAssignedToBranchAct } from "../../../store/mastersettings/instituteinfo/instituteinfoactions";
import { getInstBranchesAct } from "../../../store/mastersettings/branch/branchactions";

//Interface and Types
import { IOptionsHrtl } from "../../../Components/Common/MenuOptions";
import { IFormsProps } from "./formtypes";
import Button from "../../../Components/Common/Button";

const Forms: React.FC<IFormsProps> = ({ instituteId, instituteName }) => {
    const [formsModalState, setFormsModalState] = useState<any>({
        showModal: false,
        formId: undefined, modalData: undefined
    });
    const [delFormsModalState, setDelFormsModalState] = useState<any>({
        showModal: false,
        formId: ""
    });
    const [filterState, setFilterState] = useState<any>({
        branchFormName: undefined,
        branchId: undefined,
    });
    const dispatch = useAppDispatch();
    const { formsAssignedToBranchResp, deleteFormAssignedToBranchResp,
        branchListResp, branchErrorResp, instInfoError } = useAppSelector(({ instituteInfo, branch }) => ({
            formsAssignedToBranchResp: instituteInfo.formsAssignedToBranchResp,
            branchListResp: branch.branchListResp,
            deleteFormAssignedToBranchResp: instituteInfo.deleteFormAssignedToBranchResp,
            branchErrorResp: branch.branchErrorResp,
            instInfoError: instituteInfo.instInfoError
        }), shallowEqual);

    const formRespRef = useRef<any>({
        prevFormsAssignedToBranchResp: formsAssignedToBranchResp,
        prevDeleteFormAssignedToBranchResp: deleteFormAssignedToBranchResp,
        prevBranchErrorResp: branchErrorResp,
        prevInstInfoError: instInfoError
    });

    useEffect(() => {
        if (instituteId) {
            getInstFormsApiCall();
        }
    }, [instituteId]);

    useEffect(() => {
        if (instituteId && !branchListResp) {
            const payload = { instituteId, pageNo: 0, pageSize: 100 };
            dispatch(getInstBranchesAct(generateActionPayload("get_inst_branches", undefined, payload)));
        } else if (branchListResp && Array.isArray(branchListResp.data) && branchListResp?.data.length > 0) {
            const { branchId } = branchListResp.data[0];
            if (branchId) {
                getInstFormsApiCall({ branchId: branchId });
                setFilterState((prevState: any) => ({ ...prevState, branchId: branchId }));
            }
        }
    }, [instituteId, branchListResp]);


    useEffect(() => {
        const { prevDeleteFormAssignedToBranchResp, prevInstInfoError } = formRespRef.current;
        if (deleteFormAssignedToBranchResp && deleteFormAssignedToBranchResp !== prevDeleteFormAssignedToBranchResp) {
            setDelFormsModalState((prevState: any) => ({ ...prevState, showModal: false, formId: "" }));
            getInstFormsApiCall();
            toast.success("Branch form deleted successfully.");
        } else if (instInfoError && instInfoError !== prevInstInfoError) {
            const { details } = instInfoError || {};
            toast.error(details || "Something went wrong.");
        }
        formRespRef.current.prevDeleteFormAssignedToBranchResp = deleteFormAssignedToBranchResp;
        formRespRef.current.prevInstInfoError = instInfoError;
    }, [deleteFormAssignedToBranchResp, instInfoError]);

    function assignFormsHndlr() {
        setFormsModalState((prevState: any) => ({ ...prevState, showModal: true, formId: undefined, modalData: undefined }))
    }
    const toggleFormsHndlr = useCallback((apiCall?: boolean) => {
        setFormsModalState((prevState: any) => ({ ...prevState, showModal: !prevState.showModal }))
        if (typeof (apiCall) === "boolean" && apiCall) {
            getInstFormsApiCall();
        }
    }, [formsAssignedToBranchResp]);

    function editFormHndlr(event: any) {
        const formId = event.currentTarget.getAttribute("data-id"),
            modalData: any = formsAssignedToBranchResp?.data.find((item: any) => item.branchFormId === +formId);
        if (modalData) {
            setFormsModalState((prevState: any) => ({ ...prevState, showModal: true, formId, modalData }))
        }
    }

    function deleteAssignFormHndlr(event: any) {
        const formId: string = event.currentTarget.getAttribute("data-id");
        if (formId)
            setDelFormsModalState((prevState: any) => ({ ...prevState, showModal: true, formId }));
    }

    const menuOptions = useMemo((): IOptionsHrtl[] => ([{
        id: "edit",
        actionIcon: <i className="text-primary ri-pencil-fill fs-16"></i>,
        actionName: "Edit",
        onClickHndlr: editFormHndlr,
    }, {
        id: "delete",
        actionIcon: <i className="text-danger ri-delete-bin-5-fill fs-16"></i>,
        actionName: "Delete",
        onClickHndlr: deleteAssignFormHndlr
    }]), [formsAssignedToBranchResp]);

    function getInstFormsApiCall(otherProps?: any) {
        const payload = { institute: instituteId, ...filterState, ...otherProps };
        dispatch(getFormAssignedToBranchAct(generateActionPayload("get_assigned_forms", undefined, payload)));
    }

    function delModalCancelHndlr() {
        setDelFormsModalState((prevState: any) => ({ ...prevState, showModal: false, formId: "" }));
    }

    function delModalSubmitHndlr() {
        const { formId } = delFormsModalState;
        dispatch(deleteFormAssignedToBranchAct(generateActionPayload("delete_form_to_branch", { formId })));
    }

    function paginationHndlr(paginationInfo: any) {
        getInstFormsApiCall(paginationInfo);
    }
    function onChangeFilterHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        if (value) {
            getInstFormsApiCall({ [name]: value });
        } else {
            // Clear the form the form response
            dispatch(setFormsAssignedToBranchAct(undefined));
        }
        setFilterState((prevState: any) => ({ ...prevState, [name]: value }));
    }
    const curriculumColumns = useMemo(() => generateColumns(menuOptions), [formsAssignedToBranchResp]),
        { data: formsList, pageNumber, totalPages, totalElements } = formsAssignedToBranchResp || {};
    return (
        <React.Fragment>
            <div className="tw-bg-white tw-rounded-lg tw-shadow">

                <div className="tw-px-4 tw-py-3 tw-border-b">
                    <div className="tw-flex tw-items-center">

                        <div className="tw-flex-1">
                            <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                                Forms
                            </h4>
                        </div>

                        <div className="tw-ml-auto">
                            <Button
                                variant="primary"
                                onClick={assignFormsHndlr}
                            >
                                Assign Form
                            </Button>
                        </div>

                    </div>
                </div>

                <div className="tw-p-0">

                    <div className="tw-px-3 tw-py-3">
                        <form onClick={e => e.preventDefault()}>
                            <div className="tw-grid tw-grid-cols-12 tw-gap-3">

                                <div className="tw-col-span-12 xl:tw-col-span-4">
                                    <TextIconInput
                                        formgroupClassName="search-box"
                                        name="branchFormName"
                                        value={filterState.branchFormName}
                                        placeHolder="Search"
                                        labelText="Search"
                                        floatingLabel
                                        onChange={onChangeFilterHndlr}
                                    >
                                        <i className="ri-search-line search-icon"></i>
                                    </TextIconInput>
                                </div>

                                <div className="tw-col-span-12 xl:tw-col-span-3">
                                    <SelectInput
                                        name="branchId"
                                        value={filterState.branchId}
                                        onChange={onChangeFilterHndlr}
                                        menuItems={branchListResp?.data}
                                        formgroupClassName="tw-mb-0"
                                        labelText="Branch"
                                        floatingLabel
                                        valueKey="branchId"
                                        textKey="branchName"
                                    />
                                </div>
                            </div>
                        </form>
                    </div>
                    <TableContainer
                        columns={curriculumColumns || []}
                        data={formsList || []}
                        divClass="tw-overflow-x-auto tw-mb-1"
                        theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
                        showPagination={true}
                        totalPages={totalPages}
                        totalRecords={totalElements}
                        callbackPaginationHndlr={paginationHndlr}
                        currentPageNumber={pageNumber}
                    />
                </div>
            </div>
            <ModalContainerUpdated
                id="add-forms-admin"
                isOpen={formsModalState.showModal}
                toggle={toggleFormsHndlr}
                modalTitle={formsModalState.formId ? "Update Assign Form" : "Assign Form"}
                modalSize="md"
            >
            <AddEditForm
                isOpen={formsModalState.showModal}
                toggle={toggleFormsHndlr}
                formId={formsModalState.formId}
                instituteId={instituteId}
                editModalData={formsModalState.modalData}
            />
                </ModalContainerUpdated>

            <ConfirmationModal
                id="delete-branch-form"
                isOpen={delFormsModalState.showModal}
                confirmMessage="Are you sure you want to delete this branch form?"
                cancelHndlr={delModalCancelHndlr}
                confirmHndlr={delModalSubmitHndlr}
            />
        </React.Fragment >
    )
}

export default Forms;