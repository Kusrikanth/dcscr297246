import React, { useEffect, useMemo, useRef, useState } from "react";
import { ModalContainerUpdated } from "../../../Components/Common";
import TableContainer from "../../../Components/Common/TableContainer";
import {
    generateColumns,
} from "../../FreeModules/TransferRequestApprovals/TcRequests/helper";
import { default as Approve } from "../../../assets/imagesdps/academics/ApproveSvg.svg?react";
import { default as CrossSvg } from "../../../assets/imagesdps/academics/CrossSvg.svg?react";
import { useAppSelector } from "../../../hooks/storehook";
import { shallowEqual, useDispatch } from "react-redux";
import { generateActionPayload } from "../../../utility/reduxutility";
import { getTcRequestList, setTcRequestAct } from "../../../store/academic/classroomManagment/classroommanagmentactions";
import { IPaginationState } from "../../../Components/Common/Pagination";
import TcFilters, { initialFilterValues } from "../../FreeModules/TransferRequestApprovals/TcFilters";
import TCApproveRejectModal from "../../FreeModules/TransferRequestApprovals/TcRequests/TcApproveRejectModal";
import { toast } from "react-toastify";
import { useModal } from "../../../hooks/modalhook";

const TcRequests = () => {
    const dispatch = useDispatch();
    const paginationDetails = useRef({
        pageNo: 0,
        pageSize: 10
    });
    const { modalState: approveRejTcModalState, closeModal: closeApproveRejTcModalHndlr,
        openModal: openApproveRejModalTcHndlr
    } = useModal();

    const filterRef = useRef(initialFilterValues);
    const { currentBranchIdResp: branchId, currentInstIdResp: instituteId,
        tcRequestList, classroomManagmentErrorResp }: any =
        useAppSelector(
            ({ appData, classroomManagmentInfo }) => ({
                currentBranchIdResp: appData.currentBranchIdResp,
                currentInstIdResp: appData.currentInstIdResp,
                tcRequestList: classroomManagmentInfo.tcRequestList,
                classroomManagmentErrorResp: classroomManagmentInfo.classroomManagmentErrorResp
            }), shallowEqual);

    const tcRequestRespRef = useRef({
        prevClassroomManagmentErrorResp: classroomManagmentErrorResp
    })

    useEffect(() => {
        const { prevClassroomManagmentErrorResp } = tcRequestRespRef.current;
        if (classroomManagmentErrorResp && prevClassroomManagmentErrorResp !== classroomManagmentErrorResp) {
            const { message, details }: any = classroomManagmentErrorResp;
            toast.error(message || details || "Something went wrong.");
        }
        tcRequestRespRef.current.prevClassroomManagmentErrorResp = classroomManagmentErrorResp;

    }, [classroomManagmentErrorResp]);

    useEffect(() => {
        return () => {
            dispatch(setTcRequestAct(undefined));
        }
    }, []);

    const menuOptions = useMemo(
        () => [
            // {
            //   id: "view",
            //   actionIcon: <ViewLedger />,
            //   actionName: "View",
            //   onClickHndlr: () => {
            //     toggleTransferRequestApprovalsViewModal();
            //   },
            // },
            {
                id: "allow",
                actionIcon: <Approve fill="#707070" />,
                actionName: "Allow",
                onClickHndlr: (event: any) => {
                    const tcReqId = event.currentTarget.getAttribute("data-id");
                    if (tcReqId) {
                        openApproveRejModalTcHndlr({
                            tcReqId,
                            requestType: "APPROVED"
                        });
                    }
                },
            },
            {
                id: "cancel",
                actionIcon: <CrossSvg />,
                actionName: "Cancel",
                onClickHndlr: (event) => {
                    const tcReqId = event.currentTarget.getAttribute("data-id");
                    if (tcReqId) {
                        openApproveRejModalTcHndlr({
                            tcReqId,
                            requestType: "REJECTED"
                        });
                    }
                },
            },
        ],
        [tcRequestList]
    );


    const getTcRequestListResponse = (otherProps?: any) => {
        const params = {
            branchId,
            ...filterRef.current,
            ...otherProps,
            departmentName: "TRANSPORT",
            approvedStatus: "PENDING",
            ...paginationDetails.current,
        }
        dispatch(getTcRequestList(generateActionPayload('tc_request_bydept', undefined, params)))
    }

    function paginationHndlr(paginationInfo: IPaginationState) {
        paginationDetails.current.pageNo = 0;
        paginationDetails.current = paginationInfo;
        getTcRequestListResponse(paginationInfo)
    }

    function updateFilterHandler(appliedFilter: any) {
        filterRef.current = appliedFilter;
        getTcRequestListResponse();
    }

    function toggleApproveRejModal(apiCall: any) {
        if (typeof apiCall === "boolean" && apiCall) {
            getTcRequestListResponse();
        }
        closeApproveRejTcModalHndlr();
    }

    const { content: TcRequestList = [], totalElements, totalPages, number: pageNumber } = tcRequestList || {}; 
    const roleColumns = useMemo(() => generateColumns(menuOptions), [tcRequestList]);
    return (
        <>
            <div className="tw-inline-block tw-w-full tw-mt-2">

                <TcFilters
                    branchId={branchId}
                    instituteId={instituteId}
                    dispatch={dispatch}
                    filterValues={filterRef.current}
                    updateFilterHandler={updateFilterHandler}
                />
                <TableContainer
                    columns={roleColumns || []}
                    data={TcRequestList || []}
                    divClass="tw-overflow-x-auto tw-mb-4"
                    theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
                    // showCheckbox={true}
                    showPagination={true}
                    totalPages={totalPages}
                    totalRecords={totalElements}
                    callbackPaginationHndlr={paginationHndlr}
                    currentPageNumber={pageNumber}
                />
            </div>
            <ModalContainerUpdated
                id="tc-requests-approval-modal"
                isOpen={approveRejTcModalState.showModal}
                toggle={closeApproveRejTcModalHndlr}
                hideHeader={true}
                modalSize="md"
            >
                <TCApproveRejectModal
                    requestType={approveRejTcModalState?.modalData?.requestType}
                    tcReqId={approveRejTcModalState?.modalData?.tcReqId}
                    departmentName="TRANSPORT"
                    toggle={toggleApproveRejModal}
                />
            </ModalContainerUpdated>
        </>
    );
};

export default TcRequests;
