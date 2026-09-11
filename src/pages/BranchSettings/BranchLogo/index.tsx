import React, { useMemo, useEffect, useRef } from "react";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import TableContainer from "../../../Components/Common/TableContainer";
import { ConfirmationModal, ModalContainerUpdated } from "../../../Components/Common";
import { generateColumns } from "./helper";
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
import AddBranchModal from "./AddBranchModal";
import { generateActionPayload } from "../../../utility/reduxutility";
import { deleteBrchLogoAct, getBrchLogosAct } from "../../../store/branchsettings/branchinfo/branchinfoactions";
import { IOptionsHrtl } from "../../../Components/Common/MenuOptions";
import { useModal } from "../../../hooks/modalhook";
import Button from "../../../Components/Common/Button";

const BranchLogo: React.FC<any> = ({ branchId }) => {

    const { closeModal: closeBranchLogoModalModal, modalState: branchLogoUploadModalState, openModal: branchLogoUploadModal } = useModal();
    const { closeModal: closeDelBranchLogoModal, modalState: delBranchLogoModalState, openModal: openDelBranchLogoModal } = useModal();

    const paginationDetailRef = useRef<any>({
        pageNo: 0,
        pageSize: 10,
    });

    const dispatch = useAppDispatch();

    function getBranchLogoApiCall(otherProps?: any) {
        const payload = { ...otherProps, ...paginationDetailRef.current },
            params = { branchId };
        dispatch(getBrchLogosAct(generateActionPayload("get_brch_logo", params, payload)));
    }

    const { showApiLoader, brchLogosResp, deleteBrchLogoResp, addBrchLogoResp, branchInfoErrorResp } = useAppSelector(({ globalData, branchInfo, }) => ({
        showApiLoader: globalData.showApiLoader,
        brchLogosResp: branchInfo.brchLogosResp,
        deleteBrchLogoResp: branchInfo.deleteBrchLogoResp,
        addBrchLogoResp: branchInfo.addBrchLogoResp,
        branchInfoErrorResp: branchInfo.branchInfoErrorResp
    }), shallowEqual);

    const branchLogoRespRef = useRef<any>({
        prevBrchLogosResp: brchLogosResp,
        prevDeleteBrchLogoResp: deleteBrchLogoResp,
        prevAddBrchLogoResp: addBrchLogoResp,
        prevBranchInfoErrorResp: branchInfoErrorResp
    });

    useEffect(() => {
        if (branchId) {
            getBranchLogoApiCall();
        }
    }, [branchId]);

    useEffect(() => {
        const { prevDeleteBrchLogoResp, prevAddBrchLogoResp, prevBranchInfoErrorResp } = branchLogoRespRef.current;
        if (deleteBrchLogoResp && prevDeleteBrchLogoResp !== deleteBrchLogoResp) {
            toast.success("Logo Deleted successfully")
            closeDelBranchLogoModal();
            getBranchLogoApiCall();
        } else if (addBrchLogoResp && prevAddBrchLogoResp !== addBrchLogoResp) {
            toast.success("Logo Added successfully")
            closeBranchLogoModalModal();
            getBranchLogoApiCall();
        } else if (branchInfoErrorResp && branchInfoErrorResp !== prevBranchInfoErrorResp) {
            const { details }: any = branchInfoErrorResp;
            toast.error(details || "Something went wrong");
        }
        branchLogoRespRef.current.prevDeleteBrchLogoResp = deleteBrchLogoResp;
        branchLogoRespRef.current.prevAddBrchLogoResp = addBrchLogoResp;
        branchLogoRespRef.current.prevBranchInfoErrorResp = branchInfoErrorResp;
    }, [deleteBrchLogoResp, addBrchLogoResp, branchInfoErrorResp]);

    const menuOptions = useMemo((): IOptionsHrtl[] => ([
        {
            id: "delete",
            actionIcon: <i className="text-danger ri-delete-bin-5-fill fs-16"></i>,
            actionName: "Delete",
            onClickHndlr: (event: any) => {
                // const id = event.currentTarget.getAttribute("data-id");
                // openDelBranchLogoModal(id)
            },
        }]), [brchLogosResp]);

    function delModalSubmitHndlr() {
        dispatch(deleteBrchLogoAct(generateActionPayload("delete_brch_logo", { branchId })));
    }

    const roleColumns = useMemo(() => generateColumns(menuOptions), [brchLogosResp]);

    return (
        <React.Fragment>
            <div className="tw-bg-white tw-rounded-lg tw-shadow-sm tw-border tw-border-gray-200">
                <div className="tw-px-4 tw-py-3 tw-border-b tw-border-gray-200">
                    <div className="tw-grid tw-grid-cols-2 tw-items-center">
                        <div>
                            <h4 className="tw-text-lg tw-font-semibold tw-text-gray-800 tw-mb-0">
                                Branch Logo
                            </h4>
                        </div>
                        <div className="tw-flex tw-justify-end">
                            <Button
                                variant="primary"
                                onClick={() => branchLogoUploadModal()}
                            >
                                Add Logo
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="tw-p-0">
                    <TableContainer
                        columns={roleColumns || []}
                        data={Array.isArray(brchLogosResp) ? brchLogosResp : []}
                        divClass="tw-overflow-x-auto tw-mb-1"
                        theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
                        showPagination={false}
                    />
                </div>
            </div>
            <ModalContainerUpdated
                id="add-examination"
                isOpen={branchLogoUploadModalState.showModal}
                toggle={() => closeBranchLogoModalModal()}
                modalTitle={branchLogoUploadModalState.modalData ? "Edit Branch Logo" : "Add Branch Logo"}
                modalSize="lg"
            >
                <AddBranchModal
                    id={branchLogoUploadModalState.modalData}
                    isOpen={false}
                    toggle={() => closeBranchLogoModalModal()}
                    modalTitle="Create Detail"
                    modalData1={branchLogoUploadModalState.modalData}
                />
            </ModalContainerUpdated>
            <ConfirmationModal
                id="delete-grade-distribution"
                isOpen={delBranchLogoModalState.showModal}
                confirmMessage="Are you sure you want to delete this Logo ?"
                cancelHndlr={closeDelBranchLogoModal}
                confirmHndlr={delModalSubmitHndlr}
                showImgIcon={true}
                isDisble={showApiLoader}
                iconType="reject"
            />
        </React.Fragment >
    )
}

export default BranchLogo;