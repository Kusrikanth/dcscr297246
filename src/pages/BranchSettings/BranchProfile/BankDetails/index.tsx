import React, { useMemo, useState, useCallback, useEffect, useRef } from "react";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";

//Common Component
import TableContainer from "../../../../Components/Common/TableContainer";
import { ConfirmationModal, ModalContainerUpdated, TextIconInput } from "../../../../Components/Common";
import { generateColumns } from "./helper";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";

//Modal Component
import AddBankDetailModal from "./AddBankDetailModal";

//Action Generator
import { generateActionPayload } from "../../../../utility/reduxutility";
import { deleteBranchBankDetailAct, getBranchBankDetailsAct } from "../../../../store/branchsettings/branchinfo/branchinfoactions";

//Interface & Types
import { IBranchDetailsProps, IDelBankDetailsModalState } from "./bankdetailstypes";
import { IPaginationState } from "../../../../Components/Common/Pagination";
import { IOptionsHrtl } from "../../../../Components/Common/MenuOptions";
import Button from "../../../../Components/Common/Button";

const BankDetails: React.FC<IBranchDetailsProps> = ({ branchId }) => {
    const [bankDetailsModalState, setBankDetailsModalState] = useState<any>({
        showModal: false,
        bankDetailId: undefined, modalData: undefined
    });
    const [delBranchDetailModalState, setDelAcademicYearModalState] = useState<IDelBankDetailsModalState>({
        showModal: false,
        bankDetailId: ""
    });
    const [filterState, setFilterState] = useState({
        searchString: ""
    });

    const dispatch = useAppDispatch();
    const { branchBankDetailsResp, deleteBranchBankDetailResp, branchInfoErrorResp } = useAppSelector(({ branchInfo, }) => ({
        branchBankDetailsResp: branchInfo.branchBankDetailsResp,
        deleteBranchBankDetailResp: branchInfo.deleteBranchBankDetailResp,
        branchInfoErrorResp: branchInfo.branchInfoErrorResp
    }), shallowEqual);

    const academicYearRespRef = useRef<any>({
        prevBranchBankDetailsResp: branchBankDetailsResp,
        prevDeleteBranchBankDetailResp: deleteBranchBankDetailResp,
        prevBranchInfoErrorResp: branchInfoErrorResp
    });

    useEffect(() => {
        if (branchId) {
            getBankDetailsApiCall();
        }
    }, [branchId]);

    useEffect(() => {
        const { prevDeleteBranchBankDetailResp, prevBranchInfoErrorResp } = academicYearRespRef.current;
        if (deleteBranchBankDetailResp && deleteBranchBankDetailResp !== prevDeleteBranchBankDetailResp) {
            setDelAcademicYearModalState((prevState: any) => ({ ...prevState, showModal: false, bankDetailId: "" }));
            getBankDetailsApiCall();
            toast.success("Bank details deleted successfully.");
        } else if (branchInfoErrorResp && branchInfoErrorResp !== prevBranchInfoErrorResp) {
            const { ERROR, details }: any = branchInfoErrorResp;
            toast.error(ERROR || details);
        }
        academicYearRespRef.current.prevDeleteBranchBankDetailResp = deleteBranchBankDetailResp;
        academicYearRespRef.current.prevBranchInfoErrorResp = branchInfoErrorResp;
    }, [deleteBranchBankDetailResp, branchInfoErrorResp]);

    function addBankDetailsHndlr() {
        setBankDetailsModalState((prevState: any) => ({ ...prevState, showModal: true, bankDetailId: undefined, modalData: undefined }))
    }
    const toggleBankDetailHndlr = useCallback((apiCall?: boolean) => {
        setBankDetailsModalState((prevState: any) => ({ ...prevState, showModal: !prevState.showModal }))
        if (typeof (apiCall) === "boolean" && apiCall) {
            getBankDetailsApiCall();
        }
    }, [branchBankDetailsResp]);

    function editBankDetailHndlr(event: any) {
        const bankDetailId = event.currentTarget.getAttribute("data-id"),
            modalData: any = branchBankDetailsResp?.content.find((item: any) => item.id === +bankDetailId);
        if (modalData) {
            setBankDetailsModalState((prevState: any) => ({ ...prevState, showModal: true, bankDetailId, modalData }))
        }
    }

    function deleteBankDetailHndlr(event: any) {
        const bankDetailId: string = event.currentTarget.getAttribute("data-id");
        if (bankDetailId)
            setDelAcademicYearModalState((prevState: any) => ({ ...prevState, showModal: true, bankDetailId }));
    }

    const menuOptions = useMemo((): IOptionsHrtl[] => ([{
        id: "edit",
        actionIcon: <i className="text-primary ri-pencil-fill fs-16"></i>,
        actionName: "Edit",
        onClickHndlr: editBankDetailHndlr,
    }, {
        id: "delete",
        actionIcon: <i className="text-danger ri-delete-bin-5-fill fs-16"></i>,
        actionName: "Delete",
        onClickHndlr: deleteBankDetailHndlr
    }]), [branchBankDetailsResp]);

    function getBankDetailsApiCall(otherProps?: any) {
        const payload = { branchId, ...filterState, ...otherProps };
        dispatch(getBranchBankDetailsAct(generateActionPayload("get_branch_banks", undefined, payload)));
    }

    function delModalCancelHndlr() {
        setDelAcademicYearModalState((prevState: any) => ({ ...prevState, showModal: false, bankDetailId: "" }));
    }

    function delModalSubmitHndlr() {
        const { bankDetailId } = delBranchDetailModalState;
        dispatch(deleteBranchBankDetailAct(generateActionPayload("delete_branch_bank", { bankDetailId })));
    }

    function paginationHndlr(paginationInfo: IPaginationState) {
        getBankDetailsApiCall(paginationInfo);
    }

    function onChangeFilterHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        setFilterState(prevState => ({ ...prevState, [name]: value }));
        getBankDetailsApiCall({ [name]: value });
    }


    const bankDetailsColumn = useMemo(() => generateColumns(menuOptions), [branchBankDetailsResp]),
        { content: banksList, number: pageNumber, totalPages, totalElements } = branchBankDetailsResp || {};
    return (
        <React.Fragment>
            <div className="tw-p-0">
                <div className="tw-py-3 tw-px-3">
                    <form onClick={(e) => e.preventDefault()}>
                        <div className="tw-grid tw-grid-cols-1 xl:tw-grid-cols-12 tw-gap-3 tw-items-end tw-mt-3 tw-mb-2">
                            <div className="xl:tw-col-span-4">
                                <TextIconInput
                                    formgroupClassName="search-box tw-mb-0"
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
                            <div className="tw-flex xl:tw-col-span-8 xl:tw-justify-end">
                                <Button
                                    variant="primary"
                                    onClick={addBankDetailsHndlr}
                                >
                                    Add Bank Details
                                </Button>
                            </div>

                        </div>
                    </form>
                </div>

                <div className="tw-overflow-x-auto tw-mb-1">
                    <TableContainer
                        columns={bankDetailsColumn || []}
                        data={Array.isArray(banksList) ? banksList : []}
                        divClass="tw-overflow-x-auto tw-mb-1"
                        tableClass="tw-whitespace-nowrap"
                        theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
                        showPagination={true}
                        totalPages={totalPages}
                        totalRecords={totalElements}
                        callbackPaginationHndlr={paginationHndlr}
                        currentPageNumber={pageNumber}
                    />
                </div>
            </div>
            {/* </Card> */}
            <ModalContainerUpdated
                id="add-branch-bank-detail-modal"
                isOpen={bankDetailsModalState.showModal}
                toggle={toggleBankDetailHndlr}
                modalTitle={bankDetailsModalState.bankDetailId ? "Edit Bank Detail" : "Add Bank Detail"}
                modalSize="md"
            >
            <AddBankDetailModal
                isOpen={bankDetailsModalState.showModal}
                toggle={toggleBankDetailHndlr}
                bankDetailId={bankDetailsModalState.bankDetailId}
                branchId={branchId}
                editModalData={bankDetailsModalState.modalData}
            />
            </ModalContainerUpdated>
            <ConfirmationModal
                id="delete-branch-modal"
                isOpen={delBranchDetailModalState.showModal}
                confirmMessage="Are you sure you want to delete this bank detail?"
                cancelHndlr={delModalCancelHndlr}
                confirmHndlr={delModalSubmitHndlr}
            />
        </React.Fragment >
    )
}

export default BankDetails;