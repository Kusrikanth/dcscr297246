import React, { useCallback, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";
// import { Card, CardHeader,Row, Col, Button } from "reactstrap";
import { shallowEqual } from "react-redux";
import classnames from "classnames";
import { toast } from "react-toastify";
//Common Component
import TableContainer from "../../../Components/Common/TableContainer";
import { Button, ConfirmationModal, TextIconInput } from "../../../Components/Common";


import { BranchAdminListData, generateBranchAdminListColumns } from "./helper";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
import { useEffect, useRef } from "react";

//Action Generator
import { generateActionPayload } from "../../../utility/reduxutility";
import { getInstBranchesAct, deleteBranchAct } from "../../../store/mastersettings/branch/branchactions";

// Interface & Types
import {
    IBranchProps, IBranchModal, IBranchState, IDelBranchModalState, IBranchResp, IFilterBranchState
} from "./branchtypes";
import { IOptionsHrtl } from "../../../Components/Common/MenuOptions";
import { IPaginationState } from "../../../Components/Common/Pagination";
import AddBranchAdminModal from "./AddBranchAdminModal";

const BranchAdminList: React.FC<IBranchProps> = ({ instituteId, instituteName }) => {
    const [addBranchAdminModalState, setAddBranchAdminModalState] = useState<IBranchModal>({
        showModal: false,
        branchId: ""
    });
    const [delBranchModalState, setDelBranchModalState] = useState<IDelBranchModalState>({
        showModal: false,
        branchId: ""
    })
    const history = useHistory();
    const [branchState, setBranchState] = useState<IBranchState>({
        isListMode: true
    });
    const [filterState, setFilterState] = useState<IFilterBranchState>({
        branchName: undefined
    });
    const dispatch = useAppDispatch();
    const { branchListResp, deleteBranchResp, setMainBranchResp, branchErrorResp } = useAppSelector(({ branch }) => ({
        branchListResp: branch.branchListResp,
        deleteBranchResp: branch.deleteBranchResp,
        setMainBranchResp: branch.setMainBranchResp,
        branchErrorResp: branch.branchErrorResp
    }), shallowEqual);

    const branchRespRef = useRef<IBranchResp>({
        prevDeleteBranchResp: deleteBranchResp,
        prevBranchErrorResp: branchErrorResp,
        prevSetMainBranchResp: setMainBranchResp
    });

    useEffect(() => {
        if (instituteId) {
            // const params = { instituteId };
            getBranchesApiCall();
            // dispatch(getInstBranchesAct(generateActionPayload("get_inst_branches", params)));
        }
    }, [instituteId]);

    useEffect(() => {
        const { prevDeleteBranchResp, prevSetMainBranchResp, prevBranchErrorResp } = branchRespRef.current;
        if (deleteBranchResp && prevDeleteBranchResp !== deleteBranchResp) {
            setDelBranchModalState(prevState => ({ ...prevState, showModal: false, branchId: "" }));
            toast.success("Branch deleted successfully.");
            getBranchesApiCall();
        }
        else if (branchErrorResp && branchErrorResp !== prevBranchErrorResp) {
            const { details }: any = branchErrorResp;
            toast.error(details);
        } else if (setMainBranchResp && setMainBranchResp !== prevSetMainBranchResp) {
            toast.success("Main branch updated successfully.");
            getBranchesApiCall();
        }
        branchRespRef.current.prevDeleteBranchResp = deleteBranchResp;
        branchRespRef.current.prevSetMainBranchResp = setMainBranchResp;
        branchRespRef.current.prevBranchErrorResp = branchErrorResp;
    }, [deleteBranchResp, setMainBranchResp, branchErrorResp]);


    function addBranchHndlr() {
        setAddBranchAdminModalState(prevState => ({ ...prevState, showModal: true, branchId: "", modalData: undefined }));
    }
    const toggleBranchModal = useCallback((apiCall?: boolean) => {
        setAddBranchAdminModalState(prevState => ({ ...prevState, showModal: !prevState.showModal, modalData: undefined }));
        if (typeof (apiCall) === "boolean" && apiCall) {
            getBranchesApiCall();
        }
    }, [instituteId, branchListResp]);

    function configurationHandler(event: any) {
        const branchId = event.currentTarget.getAttribute("data-id");
        if (branchId)
            history.push(`/master-setup/branch-setting/${branchId}`);
    }

    function editBranchHndlr(event: any) {
        const branchId = event.currentTarget.getAttribute("data-id");
        let modalData: any = undefined;
        if (branchId) {
            modalData = branchListResp?.data?.find((item: any) => item.branchId === Number(branchId));
        }
        if (modalData) {
            setAddBranchAdminModalState(prevState => ({ ...prevState, showModal: true, branchId, modalData }));
        }
    }

    function deleteBranchHndlr(event: any) {
        const branchId = event.currentTarget.getAttribute("data-id");
        if (branchId)
            setDelBranchModalState(prevState => ({ ...prevState, showModal: true, branchId }));
    }

    const menuOptions = useMemo((): IOptionsHrtl[] => {
        return ([{
            id: "edit",
            actionIcon: <i className={classnames("ri-pencil-fill tw-text-[#1bb3a6] tw-text-base", { "tw-align-bottom tw-mr-2": !branchState.isListMode })}></i>,
            actionName: "Edit",
            onClickHndlr: editBranchHndlr,
        }, {
            id: "delete",
            actionIcon: <i className={classnames("ri-delete-bin-5-fill tw-text-red-500 tw-text-base", { "tw-align-bottom tw-mr-2": !branchState.isListMode })}></i>,
            actionName: "Delete",
            onClickHndlr: deleteBranchHndlr,
        }])
    }, [branchState.isListMode, branchListResp]);

    function getBranchesApiCall(otherProps?: (IPaginationState | IFilterBranchState)) {
        const payload = { ...filterState, ...otherProps, instituteId };
        dispatch(getInstBranchesAct(generateActionPayload("get_inst_branches", undefined, payload)));
    }
    function branchViewHandler(event: React.MouseEvent<HTMLElement>) {
        const viewMode = event.currentTarget.getAttribute("data-view");
        setBranchState(prevState => ({ ...prevState, isListMode: viewMode === "list" }));
    }

    function delModalCancelHndlr() {
        setDelBranchModalState(prevState => ({ ...prevState, showModal: false, branchId: "" }));
    }

    //   const updateMainBranchHndlr = useCallback((event: any) => {
    //     const branchId: string = event.currentTarget.getAttribute("data-id");
    //     if (branchId) {
    //       const params = { instituteId, branchId },
    //         payload = {
    //           isMainBranch: true
    //         }
    //       dispatch(updateMainBranchAct(generateActionPayload("update_main_branch", params, payload)));
    //     }
    //   }, [branchListResp]);

    function paginationHndlr(paginationInfo: IPaginationState) {
        getBranchesApiCall(paginationInfo);
    }

    function onChangeFilterHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        setFilterState(prevState => ({ ...prevState, [name]: value }));
        getBranchesApiCall({ "branchName": value });
    }

    function delModalSubmitHndlr() {
        const { branchId } = delBranchModalState;
        dispatch(deleteBranchAct(generateActionPayload("delete_branch", { branchId })));
    }

    const branchColumns = useMemo(() => generateBranchAdminListColumns(menuOptions), [])
    // { data: branchList, pageNumber, totalPages, totalElements } = branchListResp || {};
    return (
        <React.Fragment>
            <div className="tw-bg-white tw-rounded tw-shadow tw-mb-0">
                <div className="tw-px-4 tw-py-3 tw-border-b tw-border-gray-100">
                    <div className="tw-grid tw-grid-cols-12 tw-items-center">
                        <div className="tw-col-span-12 md:tw-col-span-4">
                            <div className="tw-relative search-box">
                                <TextIconInput
                                    formgroupClassName="search-box"
                                    name="branchName"
                                    value={filterState.branchName}
                                    placeHolder="Search..."
                                    onChange={onChangeFilterHndlr}
                                />
                                <i className="ri-search-line tw-absolute tw-left-3 tw-top-[10px] tw-text-gray-400"></i>
                            </div>
                        </div>
                        <div className="tw-col-span-12 md:tw-col-span-8 tw-flex tw-justify-end tw-items-center">
                            <div className="tw-flex tw-items-center tw-gap-2">
                                {/* <Button color="info" data-view="card" className={classnames(
                  "btn btn-soft-info nav-link btn-icon fs-14 filter-button",
                  { active: !branchState.isListMode }
                )} onClick={branchViewHandler}><i className="ri-grid-fill"></i></Button>
                <Button color="info" data-view="list"
                  className={classnames(
                    "btn btn-soft-info nav-link btn-icon fs-14 filter-button",
                    { active: branchState.isListMode }
                  )}
                  onClick={branchViewHandler}><i className="ri-list-unordered"></i></Button> */}
                                <Button variant="primary" onClick={addBranchHndlr}> Add Branch Admin</Button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* </Card> */}

                <TableContainer
                    columns={branchColumns}
                    data={BranchAdminListData}
                    divClass="table-responsive tw-mb-1"
                    theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
                // showPagination={true}
                // totalPages={totalPages}
                // totalRecords={totalElements}
                // callbackPaginationHndlr={paginationHndlr}
                // currentPageNumber={pageNumber}
                // forcePage={resetPageRef.current}
                />
            </div>
            <AddBranchAdminModal
                isOpen={addBranchAdminModalState.showModal}
                toggle={toggleBranchModal}
                modalTitle={addBranchAdminModalState.branchId ? "Edit Branch Admin" : "Add Branch Admin"}
                instituteId={instituteId}
                instituteName={instituteName}
                branchId={addBranchAdminModalState.branchId}
                editBranchAdminDetails={addBranchAdminModalState.modalData}
            />
            <ConfirmationModal
                id="delete-branch-modal"
                isOpen={delBranchModalState.showModal}
                confirmMessage="Are you sure you want to delete this branch ?"
                cancelHndlr={delModalCancelHndlr}
                confirmHndlr={delModalSubmitHndlr}
            />
        </React.Fragment >
    )
}


export default BranchAdminList;