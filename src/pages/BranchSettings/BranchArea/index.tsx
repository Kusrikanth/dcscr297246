import React, { useMemo, useState, useCallback, useEffect, useRef } from "react";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
//Common Component
import TableContainer from "../../../Components/Common/TableContainer";
import { ConfirmationModal, ModalContainerUpdated, TextIconInput } from "../../../Components/Common";
import { generateColumns } from "./helper";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";

//Modal Component
import AddBankDetailModal from "./AddEditBranchArea";

//Action Generator
import { generateActionPayload } from "../../../utility/reduxutility";
import { deleteBranchAreaAct, getBranchAreasAct } from "../../../store/branchsettings/branchinfo/branchinfoactions";
//Interface & Types
import { IPaginationState } from "../../../Components/Common/Pagination";
import { IOptionsHrtl } from "../../../Components/Common/MenuOptions";
import Button from "../../../Components/Common/Button";

const BranchArea: React.FC<any> = ({ branchId }) => {

    const [branchAreaModalState, setBranchAreaModalState] = useState<any>({
        showModal: false,
        branchAreaId: undefined, modalData: undefined
    });
    const [delBranchAreaState, setDelBranchAreaState] = useState<any>({
        showModal: false,
        branchAreaId: ""
    });
    const [filterState, setFilterState] = useState<any>({
        areaName: undefined
    });
    const paginationDetailRef = useRef<any>({
        pageNo: 0,
        pageSize: 10,
    });

    const dispatch = useAppDispatch();
    const { branchAreasResp, deleteBranchAreaResp, branchInfoErrorResp } = useAppSelector(({ branchInfo, }) => ({
        branchAreasResp: branchInfo.branchAreasResp,
        deleteBranchAreaResp: branchInfo.deleteBranchAreaResp,
        branchInfoErrorResp: branchInfo.branchInfoErrorResp
    }), shallowEqual);

    const branchAreaRespRef = useRef<any>({
        prevBranchAreasResp: branchAreasResp,
        prevDeleteBranchAreaResp: deleteBranchAreaResp,
        prevBranchInfoErrorResp: branchInfoErrorResp
    });

    useEffect(() => {
        if (branchId) {
            getBranchAreaApiCall();
        }
    }, [branchId]);

    useEffect(() => {
        const { prevDeleteBranchAreaResp, prevBranchInfoErrorResp } = branchAreaRespRef.current;
        if (deleteBranchAreaResp && deleteBranchAreaResp !== prevDeleteBranchAreaResp) {
            setDelBranchAreaState((prevState: any) => ({ ...prevState, showModal: false, branchAreaId: "" }));
            getBranchAreaApiCall();
            toast.success("Branch area deleted successfully.");
        } else if (branchInfoErrorResp && branchInfoErrorResp !== prevBranchInfoErrorResp) {
            const { details }: any = branchInfoErrorResp;
            toast.error(details || "details");
        }
        branchAreaRespRef.current.prevDeleteBranchAreaResp = deleteBranchAreaResp;
        branchAreaRespRef.current.prevBranchInfoErrorResp = branchInfoErrorResp;
    }, [deleteBranchAreaResp, branchInfoErrorResp]);

    function addBranchAreaHndlr() {
        setBranchAreaModalState((prevState: any) => ({ ...prevState, showModal: true, branchAreaId: undefined, modalData: undefined }))
    }
    const toggleBranchAreaHndlr = useCallback((apiCall?: boolean) => {
        setBranchAreaModalState((prevState: any) => ({ ...prevState, showModal: !prevState.showModal }))
        if (typeof (apiCall) === "boolean" && apiCall) {
            getBranchAreaApiCall();
        }
    }, [branchAreasResp]);

    function editBranchAreaHndlr(event: any) {
        const branchAreaId = event.currentTarget.getAttribute("data-id"),
            modalData: any = branchAreasResp?.content.find((item: any) => item.id === +branchAreaId);
        if (modalData) {
            setBranchAreaModalState((prevState: any) => ({ ...prevState, showModal: true, branchAreaId, modalData }))
        }
    }

    function delBrachAreaHndlr(event: any) {
        const branchAreaId: string = event.currentTarget.getAttribute("data-id");
        if (branchAreaId)
            setDelBranchAreaState((prevState: any) => ({ ...prevState, showModal: true, branchAreaId }));
    }

    const menuOptions = useMemo((): IOptionsHrtl[] => ([{
        id: "edit",
        actionIcon: <i className="text-primary ri-pencil-fill fs-16"></i>,
        actionName: "Edit",
        onClickHndlr: editBranchAreaHndlr,
    }, {
        id: "delete",
        actionIcon: <i className="text-danger ri-delete-bin-5-fill fs-16"></i>,
        actionName: "Delete",
        onClickHndlr: delBrachAreaHndlr
    }]), [branchAreasResp]);

    function getBranchAreaApiCall(otherProps?: any) {
        const payload = { ...filterState, ...otherProps, ...paginationDetailRef.current },
            params = { branchId };
        dispatch(getBranchAreasAct(generateActionPayload("get_branch_area", params, payload)));
    }

    function delModalCancelHndlr() {
        setDelBranchAreaState((prevState: any) => ({ ...prevState, showModal: false, branchAreaId: "" }));
    }

    function delModalSubmitHndlr() {
        const { branchAreaId } = delBranchAreaState;
        dispatch(deleteBranchAreaAct(generateActionPayload("delete_branch_are", { branchAreaId })));
    }

    function paginationHndlr(paginationInfo: IPaginationState) {
        getBranchAreaApiCall(paginationInfo);
    }
    function onChangeFilterHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        setFilterState((prevState: any) => ({ ...prevState, [name]: value }));
        getBranchAreaApiCall({ [name]: value });
    }

    const roleColumns = useMemo(() => generateColumns(menuOptions), [branchAreasResp]),
        { content: bankAreaList, pageNumber, totalPages, totalElements } = branchAreasResp || {};
    return (
        <React.Fragment>
            <div className="tw-bg-white tw-rounded-xl tw-shadow-sm tw-border tw-border-gray-200">

                <div className="tw-px-4 tw-py-3 tw-border-b tw-border-gray-200">
                    <div className="tw-flex tw-items-center tw-justify-between">

                        <h4 className="tw-text-lg tw-font-semibold tw-text-gray-800">
                            Branch Area
                        </h4>

                        <Button
                            onClick={addBranchAreaHndlr}
                            variant="primary"
                        >
                            Add Area
                        </Button>

                    </div>
                </div>

                <div className="tw-p-0">

                    <div className="tw-px-4 tw-py-3">
                        <form onClick={(e) => e.preventDefault()}>
                            <div className="tw-grid tw-grid-cols-12 tw-gap-4">

                                <div className="tw-col-span-12 xl:tw-col-span-4">
                                    <TextIconInput
                                        formgroupClassName="tw-w-full"
                                        name="areaName"
                                        value={filterState.areaName}
                                        placeHolder="Search"
                                        labelText="Search"
                                        floatingLabel
                                        onChange={onChangeFilterHndlr}
                                    >
                                        <i className="ri-search-line tw-text-gray-400" />
                                    </TextIconInput>
                                </div>

                            </div>
                        </form>
                    </div>

                    <TableContainer
                        columns={roleColumns || []}
                        data={Array.isArray(bankAreaList) ? bankAreaList : []}
                        divClass="tw-overflow-x-auto tw-mb-1"
                        theadClass="tw-bg-gray-100 tw-text-gray-500 tw-text-sm tw-align-middle"
                        showPagination={true}
                        totalPages={totalPages}
                        totalRecords={totalElements}
                        callbackPaginationHndlr={paginationHndlr}
                        currentPageNumber={pageNumber}
                    />

                </div>

            </div>
            <ModalContainerUpdated
                id="add-language-modal"
                isOpen={branchAreaModalState.showModal}
                toggle={toggleBranchAreaHndlr}
                modalTitle={branchAreaModalState.branchAreaId ? "Edit Branch Area" : "Add Branch Area"}
                modalSize="md"
            >
            <AddBankDetailModal
                isOpen={branchAreaModalState.showModal}
                toggle={toggleBranchAreaHndlr}
                branchAreaId={branchAreaModalState.branchAreaId}
                branchId={branchId}
                editAreaDetails={branchAreaModalState.modalData}
            />
                </ModalContainerUpdated>
            <ConfirmationModal
                id="delete-branch-modal"
                isOpen={delBranchAreaState.showModal}
                confirmMessage="Are you sure you want to delete this branch area?"
                cancelHndlr={delModalCancelHndlr}
                confirmHndlr={delModalSubmitHndlr}
            />
        </React.Fragment >
    )
}

export default BranchArea;