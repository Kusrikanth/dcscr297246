import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { Input, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { shallowEqual } from "react-redux";
import classnames from "classnames";
import { toast } from "react-toastify";
//Common Component
import TableContainer from "../../../Components/Common/TableContainer";
import { Tabs, SelectInput } from "../../../Components/Common";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { getInstituteListAct } from "../../../store/mastersettings/instituteinfo/instituteinfoactions";

import { ConfirmationModal, TextIconInput } from "../../../Components/Common";
import AddBranch from "./AddBranch";

//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";

//Helper
import { generateColumns } from "./helper";
//Action Generator
import { generateActionPayload } from "../../../utility/reduxutility";
import { approveBranchAct, deleteBranchAct, getInstBranchesAct } from "../../../store/mastersettings/branch/branchactions";

//Interface and Types
import { IOptionsHrtl } from "../../../Components/Common/MenuOptions";
import Button from "../../../Components/Common/Button";

const BranchList: React.FC<any> = () => {
    const [activeTabId, setActiveTabId] = useState<string | null>("");
    const [addInstModalState, setAddInstModalState] = useState<any>({
        showModal: false,
        branchId: ""
    });
    const [delBranchModalState, setDelBranchModalState] = useState<any>({
        showModal: false,
        branchId: "",
        confirmText: "",
        confirmAction: ""
    });
    const [filterState, setFilterState] = useState<any>({
        branchName: "",
        instituteId: ""
    });

    const dispatch = useAppDispatch();
    const { instituteListResp, branchListResp, approveBranchResp, deleteBranchResp, branchErrorResp, instInfoError } = useAppSelector(({ instituteInfo, branch }) => ({
        instituteListResp: instituteInfo.instituteListResp,
        branchListResp: branch.branchListResp,
        approveBranchResp: branch.approveBranchResp,
        deleteBranchResp: branch.deleteBranchResp,
        branchErrorResp: branch.branchErrorResp,
        instInfoError: instituteInfo.instInfoError
    }), shallowEqual);
    const branchRespRef = useRef<any>({
        prevApproveBranchResp: approveBranchResp,
        prevDeleteBranchResp: deleteBranchResp,
        prevBranchErrorResp: branchErrorResp,
        prevInstInfoError: instInfoError
    });

    useEffect(() => {
        getBranchApiCall({ approvalStatus: "" });
        const params = { instituteGroupId: "54a42c4d-47aa-40b7-bd6b-284702aaeba6", pageNo: 0, pageSize: 100 };
        dispatch(getInstituteListAct(generateActionPayload("get_institute_list", undefined, params)));
    }, []);

    useEffect(() => {
        const { prevApproveBranchResp, prevDeleteBranchResp, prevBranchErrorResp, prevInstInfoError } = branchRespRef.current;
        if (approveBranchResp && prevApproveBranchResp !== approveBranchResp) {
            getBranchApiCall({ approvalStatus: activeTabId });
            if (delBranchModalState.confirmAction === "REJECTED") {
                toast.success("Branch deleted succesfully.");
            } else {
                toast.success("Branch approved succesfully.");
            }
            setDelBranchModalState((prevState: any) => ({
                ...prevState,
                showModal: false,
                branchId: "",
                confirmText: "",
                confirmAction: ""
            }))
        } else if (deleteBranchResp && deleteBranchResp !== prevDeleteBranchResp) {
            getBranchApiCall({ approvalStatus: activeTabId });
            toast.success("Branch deleted succesfully.");
            setDelBranchModalState((prevState: any) => ({
                ...prevState,
                showModal: false,
                branchId: "",
                confirmText: "",
                confirmAction: ""
            }));
        }
        else if (instInfoError && instInfoError !== prevInstInfoError) {
            const { message }: any = instInfoError;
            toast.error(message);
        }
        else if (branchErrorResp && branchErrorResp !== prevBranchErrorResp) {
            const { message }: any = branchErrorResp;
            toast.error(message);
        }
        branchRespRef.current.prevApproveBranchResp = approveBranchResp;
        branchRespRef.current.prevInstInfoError = instInfoError;
        branchRespRef.current.prevDeleteBranchResp = deleteBranchResp;
        branchRespRef.current.prevBranchErrorResp = branchErrorResp;
    }, [approveBranchResp, deleteBranchResp, branchErrorResp, instInfoError]);


    function addBrchHndlr() {
        setAddInstModalState((prevState: any) => ({ ...prevState, showModal: true, branchId: "", modalData: undefined }));
    }
    const toggleInstModal = useCallback((apiCall?: boolean) => {
        setAddInstModalState((prevState: any) => ({ ...prevState, showModal: !prevState.showModal }));
        if (typeof (apiCall) === "boolean" && apiCall) {
            getBranchApiCall();
        }
    }, []);


    function tabChangeHndlr(tabId: string) {
        setActiveTabId(tabId);
        getBranchApiCall({ approvalStatus: tabId });
    }

    function viewBranchHndlr(event: any) {
        const branchId = event.currentTarget.getAttribute("data-id");
    }

    function eidtBranchHndlr(event: any) {
        const branchId = event.currentTarget.getAttribute("data-id"),
            modalData: any = branchListResp?.data?.find((item: any) => item.id === branchId);
        if (modalData) {
            setAddInstModalState((prevState: any) => ({ ...prevState, showModal: true, branchId, modalData }));
        }
    }
    function approveBrchHndlr(event: any) {
        const branchId = event.currentTarget.getAttribute("data-id");
        if (branchId)
            setDelBranchModalState((prevState: any) => ({
                ...prevState, showModal: true,
                branchId, confirmAction: "APPROVED", confirmText: "Are you sure you want to approve this branch?"
            }));
    }
    function rejectBrchHndlr(event: any) {
        const branchId = event.currentTarget.getAttribute("data-id");
        if (branchId)
            setDelBranchModalState((prevState: any) => ({
                ...prevState, showModal: true, branchId,
                confirmAction: "REJECTED", confirmText: "Are you sure you want to reject this branch?"
            }));
    }

    function deleteBrchHndlr(event: any) {
        const branchId = event.currentTarget.getAttribute("data-id");
        if (branchId)
            setDelBranchModalState((prevState: any) => ({
                ...prevState, showModal: true, branchId,
                confirmAction: "DELETED", confirmText: "Are you sure you want to delete this branch?"
            }));
    }

    const menuOptions = useMemo((): IOptionsHrtl[] => {
        return [
            // {
            //     id: "view",
            //     actionIcon: <i className="ri-eye-fill align-bottom me-2 text-muted"></i>,
            //     actionName: "View",
            //     onClickHndlr: viewBranchHndlr,
            // },
            // {
            //     id: "edit",
            //     actionIcon: <i className="ri-pencil-fill align-bottom me-2 text-muted"></i>,
            //     actionName: "Edit",
            //     onClickHndlr: eidtBranchHndlr,
            // },
            {
                id: "reject",
                actionIcon: <i className=" ri-close-circle-fill align-bottom me-2 text-muted"></i>,
                actionName: "Reject",
                onClickHndlr: rejectBrchHndlr,
            }, {
                id: "approve",
                actionIcon: <i className="ri-checkbox-circle-fill align-bottom me-2 text-muted "></i>,
                actionName: "Approve",
                onClickHndlr: approveBrchHndlr,
            }, {
                id: "delete",
                actionIcon: <i className="ri-delete-bin-5-fill align-bottom me-2 text-muted"></i>,
                actionName: "Delete",
                onClickHndlr: deleteBrchHndlr,
            }]
    }, [branchListResp, activeTabId]);

    function getBranchApiCall(otherProps?: any) {
        const payload = { ...filterState, ...otherProps };
        dispatch(getInstBranchesAct(generateActionPayload("get_inst_branches", undefined, payload)));
    }

    function delModalCancelHndlr() {
        setDelBranchModalState((prevState: any) => ({ ...prevState, showModal: false, branchId: "" }));
    }

    function paginationHndlr(paginationInfo: any) {
        getBranchApiCall(paginationInfo);
    }

    function onChangeFilterHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        setFilterState((prevState: any) => ({ ...prevState, [name]: value }));
        getBranchApiCall({ [name]: value, approvalStatus: activeTabId });
    }

    function delModalSubmitHndlr() {
        const { branchId, confirmAction } = delBranchModalState;
        if (confirmAction === "DELETED") {
            dispatch(deleteBranchAct(generateActionPayload("delete_branch", { branchId })));
        } else {
            const payload = {
                id: branchId,
                approvedStatus: confirmAction,
                comments: "comments added"
            };
            dispatch(approveBranchAct(generateActionPayload("approve_brnch", undefined, payload)));
        }
    }

    const tabsOptionsData: Array<any> = useMemo(() => {
        const { totalRecords } = branchListResp || {};
        return ([
            {
                tabId: "",
                tabName: "All Branch",
                badgeCount: (activeTabId === "") && totalRecords || undefined,
            },
            {
                tabId: "APPROVED",
                tabName: "Approved Branch",
                badgeCount: (activeTabId === "APPROVED") && totalRecords || undefined,
            },
            {
                tabId: "PENDING",
                tabName: "Pending Branch",
                badgeCount: (activeTabId === "PENDING") && totalRecords || undefined,
            },
            {
                tabId: "REJECTED",
                tabName: "Rejected Branch",
                badgeCount: (activeTabId === "REJECTED") && totalRecords || undefined,
            }
        ])
    }, [activeTabId, branchListResp]);

    const branchColumns = useMemo(() => generateColumns(menuOptions), [branchListResp]),
        { data: branchList, pageNumber, totalPages, totalRecords } = branchListResp || {},
        { data: instituteList } = instituteListResp || {};
    return (
        <React.Fragment>
            <div className="page-content">
                <div className="container-fluid">
                    <BreadCrumb title="Branches List" pageTitle="DPS" />
                    <div className="tw-bg-white tw-rounded-lg tw-shadow">
                        <div className="tw-border-b tw-px-4 tw-py-3">
                            <div className="tw-flex tw-items-center">
                                <h4 className="tw-text-base tw-font-semibold tw-mb-0 tw-flex-grow">Branches List</h4>
                                <div className="tw-flex-shrink-0">
                                    <Button
                                        variant="primary"
                                        id="create-btn"
                                        onClick={addBrchHndlr}
                                    >
                                        Add Branch
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className="tw-px-2 tw-py-2">
                            <Tabs
                                activeTabId={activeTabId}
                                tabChangeHndlr={tabChangeHndlr}
                                tabsList={tabsOptionsData}
                                navContainerClass="card-header-tabs tw-border-b-0 nav-tabs nav-info"
                            />
                        </div>
                        <div className="tw-p-0">
                            <div className="tw-py-3 tw-px-4">
                                <form onClick={e => e.preventDefault()}>
                                    <div className="tw-mt-2 tw-grid tw-grid-cols-1 md:tw-grid-cols-4 tw-gap-3">
                                        <div className="tw-w-full">
                                            <TextIconInput
                                                formgroupClassName="search-box"
                                                name="branchName"
                                                value={filterState.branchName}
                                                placeHolder="Search..."
                                                onChange={onChangeFilterHndlr}
                                            ><i className="ri-search-line search-icon"></i></TextIconInput>
                                        </div>
                                        <div className="tw-w-full">
                                            <SelectInput
                                                name="instituteId"
                                                value={filterState.instituteId}
                                                onChange={onChangeFilterHndlr}
                                                menuItems={(Array.isArray(instituteList) && instituteList) || []}
                                                inputClassName="tw-bg-gray-100"
                                                formgroupClassName="tw-mb-0"
                                                valueKey="id"
                                                textKey="instituteName"
                                            />
                                        </div>
                                        {/* <div className="col-2">
                                            <Input
                                                name="branch"
                                                type="select"
                                                className="bg-light"
                                            >
                                                <option value="DPS">Status</option>
                                            </Input>
                                        </div>
                                        <div className="col-2">
                                            <Input
                                                name="institute"
                                                type="date"
                                                className="bg-light"
                                                placeholder="Selecte Date Range"
                                            >
                                            </Input>
                                        </div> */}
                                        {/* <div className="col-auto ms-auto">
                                            <button className="btn btn-secondary float-end px-4" onClick={() => { }}>Filters</button>
                                        </div> */}
                                    </div>
                                </form>
                            </div>
                            <TableContainer
                                columns={branchColumns || []}
                                data={branchList || []}
                                divClass="table-responsive tw-mb-3"
                                theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
                                showPagination={true}
                                totalPages={totalPages}
                                totalRecords={totalRecords}
                                callbackPaginationHndlr={paginationHndlr}
                                currentPageNumber={pageNumber}
                            />
                        </div>
                    </div>
                </div>
            </div>
            {/* <AddBranch
                isOpen={addInstModalState.showModal}
                toggle={toggleInstModal}
                modalTitle={addInstModalState.branchId ? "Edit Branch" : "Add Branch"}
                editInstDetails={addInstModalState.modalData}
            /> */}
            <ConfirmationModal
                id="delete-branch-modal"
                isOpen={delBranchModalState.showModal}
                confirmMessage={delBranchModalState.confirmText}
                cancelHndlr={delModalCancelHndlr}
                confirmHndlr={delModalSubmitHndlr}
            />
            {/* <Modal id="showModal" isOpen={addInstModalState.showModal} toggle={toggleInstModal} centered size="lg">
                <ModalHeader className="bg-light p-3" toggle={toggleInstModal}>
                    Add Institute
                </ModalHeader>
                <ModalBody>
                    <AddBranch />
                </ModalBody>
                <ModalFooter>
                    <div className="hstack gap-2 justify-content-end">
                        <button
                            type="button"
                            className="btn btn-light"
                            onClick={toggleInstModal}
                        >
                            Close
                        </button>

                        <button type="submit" className="btn btn-success">
                            Submit
                        </button>
                    </div>
                </ModalFooter>
            </Modal> */}
        </React.Fragment>
    )
}

export default BranchList;