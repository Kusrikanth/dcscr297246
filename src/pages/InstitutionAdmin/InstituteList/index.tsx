import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { Input, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import classnames from "classnames";
//Common Component
import TableContainer from "../../../Components/Common/TableContainer";
import { Tabs } from "../../../Components/Common";
import BreadCrumb from "../../../Components/Common/BreadCrumb";

import { ConfirmationModal, TextIconInput } from "../../../Components/Common";
import AddInstitute from "./AddInstitute";

//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";

//Helper
import { tabsOptions, generateColumns, branchData } from "./helper";
//Action Generator
import { generateActionPayload } from "../../../utility/reduxutility";
import { approvingInstAct, deleteInstByIdAct, getInstituteListAct } from "../../../store/mastersettings/instituteinfo/instituteinfoactions";
//Interface and Types
import { IOptionsHrtl } from "../../../Components/Common/MenuOptions";
import Button from "../../../Components/Common/Button";

interface IInstituteModal {
    showModal: boolean
}

const InstituteList: React.FC<any> = () => {
    const [activeTabId, setActiveTabId] = useState<string | null>("");
    const [addInstModalState, setAddInstModalState] = useState<any>({
        showModal: false,
        instituteId: ""
    });
    const [delInstModalState, setDelInstModalState] = useState<any>({
        showModal: false,
        instituteId: "",
        confirmText: "",
        confirmAction: ""
    });
    const [filterState, setFilterState] = useState<any>({
        instituteName: ""
    });

    const dispatch = useAppDispatch();
    const { instituteListResp, approvingInstResp, deleteInstResp, instInfoError } = useAppSelector(({ instituteInfo }) => ({
        instituteListResp: instituteInfo.instituteListResp,
        approvingInstResp: instituteInfo.approvingInstResp,
        deleteInstResp: instituteInfo.deleteInstResp,
        instInfoError: instituteInfo.instInfoError
    }), shallowEqual);
    const branchRespRef = useRef<any>({
        prevApprovingInstResp: approvingInstResp,
        prevDeleteInstResp: deleteInstResp,
        prevInstInfoError: instInfoError
    });

    useEffect(() => {
        getInstituteApiCall({ approvalStatus: "" });
    }, []);

    useEffect(() => {
        const { prevApprovingInstResp, prevDeleteInstResp, prevInstInfoError } = branchRespRef.current;
        if (approvingInstResp && prevApprovingInstResp !== approvingInstResp) {
            getInstituteApiCall({ approvalStatus: activeTabId });
            if (delInstModalState.confirmAction === "REJECTED") {
                toast.success("Institute rejected succesfully.");
            } else {
                toast.success("Institute approved succesfully.");
            }
            setDelInstModalState((prevState: any) => ({
                ...prevState,
                showModal: false,
                instituteId: "",
                confirmText: "",
                confirmAction: ""
            }))
        } else if (deleteInstResp && deleteInstResp !== prevDeleteInstResp) {
            getInstituteApiCall({ approvalStatus: activeTabId });
            toast.success("Institute deleted succesfully.");
            setDelInstModalState((prevState: any) => ({
                ...prevState,
                showModal: false,
                instituteId: "",
                confirmText: "",
                confirmAction: ""
            }));
        }
        else if (instInfoError && instInfoError !== prevInstInfoError) {
            const { message }: any = instInfoError;
            toast.error(message);
        }
        branchRespRef.current.prevApprovingInstResp = approvingInstResp;
        branchRespRef.current.prevDeleteInstResp = deleteInstResp;
        branchRespRef.current.prevInstInfoError = instInfoError;
    }, [approvingInstResp, deleteInstResp, instInfoError]);


    function addInstituteHndlr() {
        setAddInstModalState((prevState: any) => ({ ...prevState, showModal: true, instituteId: "", modalData: undefined }));
    }
    const toggleInstModal = useCallback((apiCall?: boolean) => {
        setAddInstModalState((prevState: any) => ({ ...prevState, showModal: !prevState.showModal }));
        if (typeof (apiCall) === "boolean" && apiCall) {
            getInstituteApiCall();
        }
    }, []);


    function tabChangeHndlr(tabId: string) {
        setActiveTabId(tabId);
        getInstituteApiCall({ approvalStatus: tabId });
    }

    function viewInstituteHndlr(event: any) {
        const instituteId = event.currentTarget.getAttribute("data-id");
    }

    function editInstituteHndlr(event: any) {
        const instituteId = event.currentTarget.getAttribute("data-id"),
            modalData: any = instituteListResp?.data?.find((item: any) => item.id === instituteId);
        if (modalData) {
            setAddInstModalState((prevState: any) => ({ ...prevState, showModal: true, instituteId, modalData }));
        }
    }
    function approveInstHndlr(event: any) {
        const instituteId = event.currentTarget.getAttribute("data-id");
        if (instituteId)
            setDelInstModalState((prevState: any) => ({
                ...prevState, showModal: true,
                instituteId, confirmAction: "APPROVED", confirmText: "Are you sure you want to approve this institute?"
            }));
    }
    function rejectInstHndlr(event: any) {
        const instituteId = event.currentTarget.getAttribute("data-id");
        if (instituteId)
            setDelInstModalState((prevState: any) => ({
                ...prevState, showModal: true, instituteId,
                confirmAction: "REJECTED", confirmText: "Are you sure you want to reject this institute?"
            }));
    }

    function deleteInstHndlr(event: any) {
        const instituteId = event.currentTarget.getAttribute("data-id");
        if (instituteId)
            setDelInstModalState((prevState: any) => ({
                ...prevState, showModal: true, instituteId,
                confirmAction: "DELETED", confirmText: "Are you sure you want to delete this institute?"
            }));
    }

    const menuOptions = useMemo((): IOptionsHrtl[] => {
        return [
            // {
            //     id: "view",
            //     actionIcon: <i className="ri-eye-fill align-bottom me-2 text-muted"></i>,
            //     actionName: "View",
            //     onClickHndlr: viewInstituteHndlr,
            // },
            // {
            //     id: "edit",
            //     actionIcon: <i className="ri-pencil-fill align-bottom me-2 text-muted"></i>,
            //     actionName: "Edit",
            //     onClickHndlr: editInstituteHndlr,
            // },
            {
                id: "reject",
                actionIcon: <i className=" ri-close-circle-fill align-bottom me-2 text-muted"></i>,
                actionName: "Reject",
                onClickHndlr: rejectInstHndlr,
            }, {
                id: "approve",
                actionIcon: <i className="ri-checkbox-circle-fill align-bottom me-2 text-muted "></i>,
                actionName: "Approve",
                onClickHndlr: approveInstHndlr,
            }, {
                id: "delete",
                actionIcon: <i className="ri-delete-bin-5-fill align-bottom me-2 text-muted"></i>,
                actionName: "Delete",
                onClickHndlr: deleteInstHndlr,
            }]
    }, [instituteListResp, activeTabId]);

    function getInstituteApiCall(otherProps?: any) {
        const payload = { ...filterState, ...otherProps, instituteGroupId: "54a42c4d-47aa-40b7-bd6b-284702aaeba6" };
        dispatch(getInstituteListAct(generateActionPayload("get_institute_list", undefined, payload)));
    }

    function delModalCancelHndlr() {
        setDelInstModalState((prevState: any) => ({ ...prevState, showModal: false, instituteId: "" }));
    }

    function paginationHndlr(paginationInfo: any) {
        getInstituteApiCall(paginationInfo);
    }

    function onChangeFilterHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        setFilterState((prevState: any) => ({ ...prevState, [name]: value }));
        getInstituteApiCall({ [name]: value, approvalStatus: activeTabId });
    }

    function delModalSubmitHndlr() {
        const { instituteId, confirmAction } = delInstModalState;
        if (confirmAction === "DELETED") {
            dispatch(deleteInstByIdAct(generateActionPayload("delete_inst_by_id", { instituteId })));
        } else {
            const payload = {
                id: instituteId,
                approvedStatus: confirmAction,
                comments: "comments added"
            };
            dispatch(approvingInstAct(generateActionPayload("apprv_reject_inst_branch", undefined, payload)));
        }
    }

    const tabsOptionsData: Array<any> = useMemo(() => {
        const { totalRecords } = instituteListResp || {};
        return ([
            {
                tabId: "",
                tabName: "All Institute",
                badgeCount: (activeTabId === "") && totalRecords || 20,
            },
            {
                tabId: "APPROVED",
                tabName: "Approved Institute",
                badgeCount: (activeTabId === "APPROVED") && totalRecords || undefined,
            },
            {
                tabId: "PENDING",
                tabName: "Pending Institute",
                badgeCount: (activeTabId === "PENDING") && totalRecords || undefined,
            },
            {
                tabId: "REJECTED",
                tabName: "Rejected Institute",
                badgeCount: (activeTabId === "REJECTED") && totalRecords || undefined,
            }
        ])
    }, [activeTabId, instituteListResp]);

    const instituteListColumns = useMemo(() => generateColumns(menuOptions), [instituteListResp]),
        { data: instituteList, pageNumber, totalPages, totalRecords } = instituteListResp || {};
    return (
        <React.Fragment>
            <div className="page-content">
                <div className="container-fluid">
                    <BreadCrumb title="Institute List" pageTitle="DPS" />
                    <div className="tw-bg-white tw-rounded-lg tw-shadow">
                        <div className="tw-border-b tw-px-4 tw-py-3">
                            <div className="tw-flex tw-items-center">
                                <h4 className="tw-text-base tw-font-semibold tw-mb-0 tw-flex-grow">Institute List</h4>
                                <div className="tw-flex-shrink-0">
                                    <Button
                                        variant="primary"
                                        id="create-btn"
                                        onClick={addInstituteHndlr}
                                    >
                                        Add Institute
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
                                                name="instituteName"
                                                value={filterState.instituteName}
                                                placeHolder="Search..."
                                                onChange={onChangeFilterHndlr}
                                            ><i className="ri-search-line search-icon"></i></TextIconInput>
                                        </div>
                                        {/* <div className="col-2">
                                            <Input
                                                name="institute"
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
                                        <div className="tw-col-span-3 tw-ml-auto">
                                            <Button variant="secondary" onClick={() => { }}>Filters</Button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <TableContainer
                                columns={instituteListColumns || []}
                                data={instituteList || []}
                                divClass="tw-overflow-x-auto tw-mb-3"
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
            <AddInstitute
                isOpen={addInstModalState.showModal}
                toggle={toggleInstModal}
                modalTitle={addInstModalState.branchId ? "Edit Institute" : "Add Institute"}
                instituteGroupId={""}
                editInstDetails={addInstModalState.modalData}
                toast={toast}
            />
            <ConfirmationModal
                id="delete-branch-modal"
                isOpen={delInstModalState.showModal}
                confirmMessage={delInstModalState.confirmText}
                cancelHndlr={delModalCancelHndlr}
                confirmHndlr={delModalSubmitHndlr}
            />
        </React.Fragment>
    )
}

export default InstituteList;